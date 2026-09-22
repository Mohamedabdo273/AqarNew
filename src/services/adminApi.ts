import { 
  AdminDeal, 
  AdminInquiry, 
  AdminQueueUnit, 
  DocumentTemporaryUrlResponse, 
  PipelineReport, 
  VerificationChecklist 
} from '../types/admin';
import { 
  INITIAL_DEALS, 
  INITIAL_INQUIRIES, 
  INITIAL_PIPELINE_REPORT, 
  INITIAL_QUEUE_UNITS 
} from '../data/adminMockData';

const STORAGE_KEYS = {
  QUEUE: 'tanazul_admin_queue_v1',
  INQUIRIES: 'tanazul_admin_inquiries_v1',
  DEALS: 'tanazul_admin_deals_v1',
  REPORT: 'tanazul_admin_report_v1',
};

// Local storage helpers for fallback state
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage set failed', e);
  }
}

export const adminApi = {
  /**
   * GET /api/admin/units/queue
   * طابور المراجعة بالتنبيهات ومدة الانتظار
   */
  async getQueue(): Promise<AdminQueueUnit[]> {
    try {
      const res = await fetch('/api/admin/units/queue');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // Fallback to local state
    }
    return getStored<AdminQueueUnit[]>(STORAGE_KEYS.QUEUE, INITIAL_QUEUE_UNITS);
  },

  /**
   * GET /api/admin/units/{id}
   * بيانات الوحدة للمراجعة
   */
  async getUnitById(id: string): Promise<AdminQueueUnit | null> {
    try {
      const res = await fetch(`/api/admin/units/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const queue = getStored<AdminQueueUnit[]>(STORAGE_KEYS.QUEUE, INITIAL_QUEUE_UNITS);
    return queue.find((u) => u.id === id) || null;
  },

  /**
   * POST /api/admin/units/{id}/verify
   * اعتماد ونشر بالـ Checklist
   */
  async verifyUnit(id: string, checklist: VerificationChecklist, verifiedBy = 'مدير التدقيق العقاري'): Promise<{ success: boolean; verificationCode: string; unit: AdminQueueUnit }> {
    try {
      const res = await fetch(`/api/admin/units/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist, verifiedBy }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const queue = getStored<AdminQueueUnit[]>(STORAGE_KEYS.QUEUE, INITIAL_QUEUE_UNITS);
    const index = queue.findIndex((u) => u.id === id);
    const verificationCode = `TNZ-VRF-${Math.floor(1000 + Math.random() * 9000)}`;

    if (index !== -1) {
      const updatedUnit: AdminQueueUnit = {
        ...queue[index],
        status: 'verified',
        checklist,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        verifiedBy,
        verificationCode,
        urgencyAlert: undefined,
        documents: queue[index].documents.map((d) => ({ ...d, status: 'verified' })),
      };
      queue[index] = updatedUnit;
      setStored(STORAGE_KEYS.QUEUE, queue);
      return { success: true, verificationCode, unit: updatedUnit };
    }
    throw new Error('Unit not found in queue');
  },

  /**
   * POST /api/admin/units/{id}/request-info
   * طلب استكمال بيانات
   */
  async requestInfo(id: string, missingReason: string, note?: string): Promise<{ success: boolean; unit: AdminQueueUnit }> {
    try {
      const res = await fetch(`/api/admin/units/${id}/request-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missingReason, note }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const queue = getStored<AdminQueueUnit[]>(STORAGE_KEYS.QUEUE, INITIAL_QUEUE_UNITS);
    const index = queue.findIndex((u) => u.id === id);
    if (index !== -1) {
      const updatedUnit: AdminQueueUnit = {
        ...queue[index],
        status: 'info_requested',
        missingInfoReason: missingReason,
        requestedInfoNote: note,
        urgencyAlert: `استكمال بيانات مطلوب: ${missingReason}`,
      };
      queue[index] = updatedUnit;
      setStored(STORAGE_KEYS.QUEUE, queue);
      return { success: true, unit: updatedUnit };
    }
    throw new Error('Unit not found in queue');
  },

  /**
   * POST /api/admin/units/{id}/reject
   * رفض بسبب
   */
  async rejectUnit(id: string, rejectionReason: string, category?: string): Promise<{ success: boolean; unit: AdminQueueUnit }> {
    try {
      const res = await fetch(`/api/admin/units/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason, category }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const queue = getStored<AdminQueueUnit[]>(STORAGE_KEYS.QUEUE, INITIAL_QUEUE_UNITS);
    const index = queue.findIndex((u) => u.id === id);
    if (index !== -1) {
      const updatedUnit: AdminQueueUnit = {
        ...queue[index],
        status: 'rejected',
        rejectionReason,
        rejectionCategory: category || 'مخالفة معايير المنصة',
        urgencyAlert: undefined,
      };
      queue[index] = updatedUnit;
      setStored(STORAGE_KEYS.QUEUE, queue);
      return { success: true, unit: updatedUnit };
    }
    throw new Error('Unit not found in queue');
  },

  /**
   * GET .../documents/{id}/url
   * رابط مؤقت للمستند (صلاحية 5 دقايق)
   */
  async getDocumentTemporaryUrl(documentId: string): Promise<DocumentTemporaryUrlResponse> {
    try {
      const res = await fetch(`/api/admin/documents/${documentId}/url`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Generate simulated 5-minute signed token response
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    return {
      documentId,
      url: `https://storage.tanazul.com/secure-docs/${documentId}?token=${token}&expires=${expires.getTime()}`,
      fileName: `official_document_${documentId}.pdf`,
      fileType: 'PDF',
      expiresAt: expires.toISOString(),
      validDurationSeconds: 300,
      securityToken: token,
      watermarkText: 'CONFIDENTIAL • TANAZUL AUDIT • FOR INTERNAL REVIEW ONLY',
    };
  },

  /**
   * GET /api/admin/inquiries
   * الطلبات وتوزيعها
   */
  async getInquiries(): Promise<AdminInquiry[]> {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // Fallback
    }
    return getStored<AdminInquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
  },

  /**
   * PUT /api/admin/inquiries or /api/admin/inquiries/{id}
   * تحديث الطلب وتوزيعه
   */
  async updateInquiry(inquiry: Partial<AdminInquiry> & { id: string }): Promise<AdminInquiry> {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const inquiries = getStored<AdminInquiry[]>(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const idx = inquiries.findIndex((inq) => inq.id === inquiry.id);
    if (idx !== -1) {
      const updated: AdminInquiry = {
        ...inquiries[idx],
        ...inquiry,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      inquiries[idx] = updated;
      setStored(STORAGE_KEYS.INQUIRIES, inquiries);
      return updated;
    }
    throw new Error('Inquiry not found');
  },

  /**
   * GET /api/admin/deals
   * الصفقات ومراحلها
   */
  async getDeals(): Promise<AdminDeal[]> {
    try {
      const res = await fetch('/api/admin/deals');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // Fallback
    }
    return getStored<AdminDeal[]>(STORAGE_KEYS.DEALS, INITIAL_DEALS);
  },

  /**
   * POST /api/admin/deals
   * إنشاء صفقة جديدة
   */
  async createDeal(dealData: Omit<AdminDeal, 'id' | 'dealCode' | 'createdAt' | 'milestones'>): Promise<AdminDeal> {
    try {
      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const deals = getStored<AdminDeal[]>(STORAGE_KEYS.DEALS, INITIAL_DEALS);
    const codeNum = deals.length + 45;
    const newDeal: AdminDeal = {
      ...dealData,
      id: `dl-${Date.now()}`,
      dealCode: `DL-2026-${codeNum.toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      milestones: [
        { id: 'm-1', title: 'حجز الوحدة وتوقيع بروتوكول التنازل المبدئي', date: new Date().toISOString().split('T')[0], completed: true },
        { id: 'm-2', title: 'طلب موافقة المطور وسداد رسوم التنازل', date: '', completed: false },
        { id: 'm-3', title: 'إصدار الشيك المصرفي المقبول الدفع', date: '', completed: false },
        { id: 'm-4', title: 'جلسة التنازل بمقر المطور واسترداد الشيكات القديمة', date: '', completed: false },
        { id: 'm-5', title: 'إتمام الصفقة وتسليم العقد النهائي', date: '', completed: false },
      ],
    };
    deals.unshift(newDeal);
    setStored(STORAGE_KEYS.DEALS, deals);
    return newDeal;
  },

  /**
   * PUT /api/admin/deals/{id}
   * تحديث مرحلة الصفقة
   */
  async updateDeal(id: string, updates: Partial<AdminDeal>): Promise<AdminDeal> {
    try {
      const res = await fetch(`/api/admin/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const deals = getStored<AdminDeal[]>(STORAGE_KEYS.DEALS, INITIAL_DEALS);
    const idx = deals.findIndex((d) => d.id === id);
    if (idx !== -1) {
      const updatedDeal: AdminDeal = {
        ...deals[idx],
        ...updates,
      };
      deals[idx] = updatedDeal;
      setStored(STORAGE_KEYS.DEALS, deals);
      return updatedDeal;
    }
    throw new Error('Deal not found');
  },

  /**
   * GET /api/admin/reports/pipeline
   * التقرير ولوحة المؤشرات
   */
  async getPipelineReport(): Promise<PipelineReport> {
    try {
      const res = await fetch('/api/admin/reports/pipeline');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return getStored<PipelineReport>(STORAGE_KEYS.REPORT, INITIAL_PIPELINE_REPORT);
  },
};
