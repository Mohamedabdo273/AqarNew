export type QueueUnitStatus = 'pending_review' | 'info_requested' | 'verified' | 'rejected';

export interface DocumentItem {
  id: string;
  title: string;
  type: 'contract' | 'national_id' | 'account_statement' | 'checks_copy' | 'clearance_certificate';
  status: 'uploaded' | 'verified' | 'rejected';
  uploadDate: string;
  fileSize: string;
  fileType: string;
  fileName: string;
}

export interface VerificationChecklist {
  developerSoaMatched: boolean; // مطابقة كشف حساب المطور المالي والمبالغ المسددة
  originalContractValid: boolean; // صحة أصل العقد الابتدائي ومطابقة بيانات المالك
  checksScheduleVerified: boolean; // سلامة جدول الشيكات المتبقية وعدم وجود شيكات مرتدة
  zeroOverpricePolicyConfirmed: boolean; // التأكد الصارم من عدم فرض أي أوفر برايس
  developerTransferTermsClear: boolean; // استيفاء شروط ومقر التنازل الرسمي لدى المطور
}

export interface AdminQueueUnit {
  id: string;
  unitCode: string;
  title: string;
  titleEn?: string;
  developer: string;
  developerTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  compound: string;
  location: string;
  propertyType: string;
  areaM2: number;
  originalContractPrice: number;
  currentMarketPrice: number;
  paidCashAmount: number; // 0 overprice - net cash to seller
  remainingAmount: number; // remaining to developer
  installmentPeriodYears: number;
  installmentFrequency: string;
  installmentValue: number;
  nextInstallmentDate: string;
  deliveryDate: string;
  deliveryStatus: string;
  submissionDate: string;
  waitingHours: number;
  isOverdueSla: boolean;
  urgencyAlert?: string;
  status: QueueUnitStatus;
  seller: {
    id: string;
    name: string;
    phone: string;
    email: string;
    nationalId: string;
    exitReason: string;
  };
  documents: DocumentItem[];
  checklist?: VerificationChecklist;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationCode?: string;
  missingInfoReason?: string;
  requestedInfoNote?: string;
  rejectionReason?: string;
  rejectionCategory?: string;
  internalNotes?: string;
}

export interface DocumentTemporaryUrlResponse {
  documentId: string;
  url: string;
  fileName: string;
  fileType: string;
  expiresAt: string; // ISO string
  validDurationSeconds: number; // 300 seconds = 5 minutes
  securityToken: string;
  watermarkText: string;
}

export interface AdminAdvisor {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar: string;
  activeDealsCount: number;
}

export interface AdminInquiry {
  id: string;
  inquiryCode: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  type: 'buyer_inquiry' | 'seller_exit' | 'investor_vip' | 'legal_consultation';
  unitId?: string;
  unitTitle?: string;
  budgetEgp?: number;
  date: string;
  status: 'new' | 'contacted' | 'meeting_scheduled' | 'deal_created' | 'closed';
  priority: 'urgent' | 'medium' | 'normal';
  assignedAdvisorId?: string;
  assignedAdvisorName?: string;
  notes: string;
  lastUpdated: string;
}

export type DealStage = 
  | 'reservation'           // 1. حجز ومطابقة أولية
  | 'developer_clearance'   // 2. مراجعة وموافقة المطور
  | 'cashier_check_prep'    // 3. تجهيز الشيك المصرفي
  | 'hq_assignment'         // 4. جلسة التنازل بمقر المطور
  | 'completed';            // 5. إتمام ونقل الملكية رسمياً

export interface DealMilestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface AdminDeal {
  id: string;
  dealCode: string;
  unitId: string;
  unitTitle: string;
  developer: string;
  compound: string;
  sellerName: string;
  sellerPhone: string;
  buyerName: string;
  buyerPhone: string;
  originalContractPrice: number;
  cashAmountToSeller: number; // Zero overprice paid back
  remainingInstallments: number;
  stage: DealStage;
  targetHqDate?: string;
  assignedAdvisor: string;
  assignedLawyer: string;
  transferFeesPolicy: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  milestones: DealMilestone[];
  notes: string;
}

export interface PipelineReport {
  totalPipelineValue: number;
  totalCashRecoveredForSellers: number;
  pendingAuditCount: number;
  activeDealsCount: number;
  completedDealsCount: number;
  avgVerificationHours: number;
  avgDaysToExit: number;
  urgentAlertsCount: number;
  developerDistribution: Array<{
    developer: string;
    unitsCount: number;
    valueEgp: number;
    percentage: number;
  }>;
  stageDistribution: Array<{
    stage: DealStage;
    stageNameAr: string;
    stageNameEn: string;
    count: number;
    totalValue: number;
  }>;
  monthlyPerformance: Array<{
    month: string;
    exitsCount: number;
    cashRecoveredEgp: number;
  }>;
}
