import { IncomingMessage, ServerResponse } from 'http';
import { 
  INITIAL_DEALS, 
  INITIAL_INQUIRIES, 
  INITIAL_PIPELINE_REPORT, 
  INITIAL_QUEUE_UNITS 
} from '../data/adminMockData';
import { AdminDeal, AdminInquiry, AdminQueueUnit, PipelineReport } from '../types/admin';

// In-memory persistent state for the backend API
let queueUnitsState: AdminQueueUnit[] = JSON.parse(JSON.stringify(INITIAL_QUEUE_UNITS));
let inquiriesState: AdminInquiry[] = JSON.parse(JSON.stringify(INITIAL_INQUIRIES));
let dealsState: AdminDeal[] = JSON.parse(JSON.stringify(INITIAL_DEALS));
let reportState: PipelineReport = JSON.parse(JSON.stringify(INITIAL_PIPELINE_REPORT));

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export async function handleAdminApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = (req as any).originalUrl || req.url || '';
  const method = req.method || 'GET';

  if (!url.startsWith('/api/admin')) {
    return false;
  }

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return true;
  }

  // 1. GET /api/admin/units/queue
  if (url === '/api/admin/units/queue' && method === 'GET') {
    sendJson(res, 200, queueUnitsState);
    return true;
  }

  // 2. GET /api/admin/reports/pipeline
  if (url === '/api/admin/reports/pipeline' && method === 'GET') {
    // Recalculate dynamic stats
    reportState.pendingAuditCount = queueUnitsState.filter((u) => u.status === 'pending_review').length;
    reportState.activeDealsCount = dealsState.filter((d) => d.status === 'active').length;
    reportState.completedDealsCount = dealsState.filter((d) => d.status === 'completed').length;
    sendJson(res, 200, reportState);
    return true;
  }

  // 3. GET /api/admin/inquiries
  if ((url === '/api/admin/inquiries' || url.startsWith('/api/admin/inquiries?')) && method === 'GET') {
    sendJson(res, 200, inquiriesState);
    return true;
  }

  // 4. PUT /api/admin/inquiries or /api/admin/inquiries/:id
  if (url.startsWith('/api/admin/inquiries') && method === 'PUT') {
    const body = await parseBody(req);
    const parts = url.split('/');
    const id = parts[4] || body.id;
    const idx = inquiriesState.findIndex((inq) => inq.id === id);
    if (idx !== -1) {
      inquiriesState[idx] = {
        ...inquiriesState[idx],
        ...body,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      sendJson(res, 200, inquiriesState[idx]);
    } else {
      sendJson(res, 404, { error: 'Inquiry not found' });
    }
    return true;
  }

  // 5. GET /api/admin/deals
  if ((url === '/api/admin/deals' || url.startsWith('/api/admin/deals?')) && method === 'GET') {
    sendJson(res, 200, dealsState);
    return true;
  }

  // 6. POST /api/admin/deals
  if (url === '/api/admin/deals' && method === 'POST') {
    const body = await parseBody(req);
    const newDeal: AdminDeal = {
      ...body,
      id: `dl-${Date.now()}`,
      dealCode: `DL-2026-${(dealsState.length + 45).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      milestones: [
        { id: 'm-1', title: 'حجز الوحدة وتوقيع بروتوكول التنازل المبدئي', date: new Date().toISOString().split('T')[0], completed: true },
        { id: 'm-2', title: 'طلب موافقة المطور وسداد رسوم التنازل', date: '', completed: false },
        { id: 'm-3', title: 'إصدار الشيك المصرفي المقبول الدفع', date: '', completed: false },
        { id: 'm-4', title: 'جلسة التنازل بمقر المطور واسترداد الشيكات القديمة', date: '', completed: false },
        { id: 'm-5', title: 'إتمام الصفقة وتسليم العقد النهائي', date: '', completed: false },
      ],
    };
    dealsState.unshift(newDeal);
    sendJson(res, 201, newDeal);
    return true;
  }

  // 7. PUT /api/admin/deals/:id
  if (url.startsWith('/api/admin/deals/') && method === 'PUT') {
    const id = url.split('/')[4];
    const body = await parseBody(req);
    const idx = dealsState.findIndex((d) => d.id === id);
    if (idx !== -1) {
      dealsState[idx] = { ...dealsState[idx], ...body };
      sendJson(res, 200, dealsState[idx]);
    } else {
      sendJson(res, 404, { error: 'Deal not found' });
    }
    return true;
  }

  // 8. GET /api/admin/documents/:id/url (temporary signed URL, valid for 5 minutes)
  const docUrlMatch = url.match(/\/api\/admin\/documents\/([^/]+)\/url/);
  if (docUrlMatch && method === 'GET') {
    const docId = docUrlMatch[1];
    const expires = new Date(Date.now() + 5 * 60 * 1000);
    const token = Math.random().toString(36).substring(2, 12);
    sendJson(res, 200, {
      documentId: docId,
      url: `https://storage.tanazul.com/secure-docs/${docId}?token=${token}&expires=${expires.getTime()}`,
      fileName: `official_document_${docId}.pdf`,
      fileType: 'PDF',
      expiresAt: expires.toISOString(),
      validDurationSeconds: 300,
      securityToken: token,
      watermarkText: 'CONFIDENTIAL • TANAZUL AUDIT • FOR INTERNAL REVIEW ONLY',
    });
    return true;
  }

  // 9. POST /api/admin/units/:id/verify
  const verifyMatch = url.match(/\/api\/admin\/units\/([^/]+)\/verify/);
  if (verifyMatch && method === 'POST') {
    const unitId = verifyMatch[1];
    const body = await parseBody(req);
    const idx = queueUnitsState.findIndex((u) => u.id === unitId);
    if (idx !== -1) {
      const code = `TNZ-VRF-${Math.floor(1000 + Math.random() * 9000)}`;
      queueUnitsState[idx] = {
        ...queueUnitsState[idx],
        status: 'verified',
        checklist: body.checklist,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        verifiedBy: body.verifiedBy || 'مدير التدقيق العقاري',
        verificationCode: code,
        urgencyAlert: undefined,
        documents: queueUnitsState[idx].documents.map((d) => ({ ...d, status: 'verified' })),
      };
      sendJson(res, 200, { success: true, verificationCode: code, unit: queueUnitsState[idx] });
    } else {
      sendJson(res, 404, { error: 'Unit not found' });
    }
    return true;
  }

  // 10. POST /api/admin/units/:id/request-info
  const requestInfoMatch = url.match(/\/api\/admin\/units\/([^/]+)\/request-info/);
  if (requestInfoMatch && method === 'POST') {
    const unitId = requestInfoMatch[1];
    const body = await parseBody(req);
    const idx = queueUnitsState.findIndex((u) => u.id === unitId);
    if (idx !== -1) {
      queueUnitsState[idx] = {
        ...queueUnitsState[idx],
        status: 'info_requested',
        missingInfoReason: body.missingReason,
        requestedInfoNote: body.note,
        urgencyAlert: `استكمال بيانات مطلوب: ${body.missingReason}`,
      };
      sendJson(res, 200, { success: true, unit: queueUnitsState[idx] });
    } else {
      sendJson(res, 404, { error: 'Unit not found' });
    }
    return true;
  }

  // 11. POST /api/admin/units/:id/reject
  const rejectMatch = url.match(/\/api\/admin\/units\/([^/]+)\/reject/);
  if (rejectMatch && method === 'POST') {
    const unitId = rejectMatch[1];
    const body = await parseBody(req);
    const idx = queueUnitsState.findIndex((u) => u.id === unitId);
    if (idx !== -1) {
      queueUnitsState[idx] = {
        ...queueUnitsState[idx],
        status: 'rejected',
        rejectionReason: body.rejectionReason,
        rejectionCategory: body.category || 'مخالفة معايير المنصة',
        urgencyAlert: undefined,
      };
      sendJson(res, 200, { success: true, unit: queueUnitsState[idx] });
    } else {
      sendJson(res, 404, { error: 'Unit not found' });
    }
    return true;
  }

  // 12. GET /api/admin/units/:id
  const getUnitMatch = url.match(/\/api\/admin\/units\/([^/]+)$/);
  if (getUnitMatch && method === 'GET') {
    const unitId = getUnitMatch[1];
    const found = queueUnitsState.find((u) => u.id === unitId);
    if (found) {
      sendJson(res, 200, found);
    } else {
      sendJson(res, 404, { error: 'Unit not found in queue' });
    }
    return true;
  }

  return false;
}
