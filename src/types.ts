/** What a unit looks out on. Matches Catalog.Views on the API. */
export type UnitView = 'open' | 'water' | 'landscape' | 'street' | 'sea' | 'clubhouse';

export type Language = 'ar' | 'en';

export type UserRole = 'seller' | 'buyer' | 'investor';

export interface UserUnitSubmission {
  id: string;
  title: string;
  compound: string;
  developer: string;
  contractPrice: number;
  paidAmount: number;
  submissionDate: string;
  status: 'under_review' | 'verified' | 'matched' | 'completed';
  statusAr: string;
  statusEn: string;
}

export interface UserInquiry {
  id: string;
  unitId?: string;
  unitTitle?: string;
  title: string;
  type: 'buyer_inquiry' | 'seller_exit' | 'investor_vip' | 'general';
  date: string;
  status: 'received' | 'in_progress' | 'scheduled';
  statusTextAr: string;
  statusTextEn: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  savedUnits: string[];
  myUnits: UserUnitSubmission[];
  inquiries: UserInquiry[];
  joinedDate: string;
}

export type PropertyType =
  // سكني (والفندقي بنفس الأنواع)
  | 'شقة'
  | 'استوديو'
  | 'شاليه'
  | 'دوبلكس'
  | 'تاون هاوس'
  | 'توين هاوس'
  | 'فيلا'
  | 'بنتهاوس'
  | 'أخرى'
  // تجاري
  | 'محل/مقر'
  | 'مخزن'
  | 'مطعم/كافيه'
  // إداري
  | 'مكتب'
  | 'دور إداري'
  | 'مقر شركة'
  // طبي
  | 'عيادة'
  | 'صيدلية'
  // ترفيهي
  | 'سينما'
  | 'ملاهي';

export type PropertyCategory = 'سكني' | 'تجاري' | 'إداري' | 'فندقي' | 'طبي' | 'ترفيهي';

export type InstallmentFrequency = 'شهري' | 'ربع سنوي' | 'نصف سنوي' | 'سنوي';

export type DeliveryStatus = 'استلام فوري' | 'استلام 2026' | 'استلام 2027' | 'استلام 2028' | 'استلام 2029+';

export type FinishingType = 'بدون تشطيب' | 'نصف تشطيب' | 'تشطيب كامل سوبر لوكس' | 'ألترا سوبر لوكس';

export type PageId = 
  | 'home' 
  | 'about'
  | 'rules'
  | 'saved'
  | 'requests'
  | 'offers'
  | 'privacy'
  | 'terms'
  | 'sell' 
  | 'opportunities'
  | 'swap'
  | 'contact'
  | 'statement'
  | 'compare'
  | 'market-comparisons'
  | 'verify'
  | 'unit'
  | 'thanks'
  | 'notfound'
  | 'admin'
  | 'mobile-design';

export interface RealEstateUnit {
  id: string;
  title: string;
  titleEn?: string;
  developer: string;
  developerEn?: string;
  compound: string;
  compoundEn?: string;
  location: string;
  locationEn?: string;
  region: 'قاهرة' | 'جيزة' | 'إسكندرية' | 'دلتا' | 'الصعيد' | 'مدن القناة' | 'الساحل الشمالي' | 'العين السخنة';
  /** المنطقة التفصيلية جوه الإقليم — من SUB_AREAS */
  subArea?: string;
  regionEn?: string;
  propertyType: PropertyType;
  /** بيتشتق من النوع — مش بيتخزن في كل وحدة. */
  propertyCategory?: PropertyCategory;
  propertyTypeEn?: string;
  originalContractPrice: number; // EGP
  currentMarketPrice: number; // EGP (shows huge savings)
  paidCashAmount: number; // What the seller wants back (0 overprice)
  remainingAmount: number; // Remaining installments to developer
  installmentPeriodYears: number;
  installmentFrequency: InstallmentFrequency;
  installmentValue: number;
  nextInstallmentDate: string;
  deliveryDate: string;
  deliveryStatus: DeliveryStatus;
  deliveryStatusEn?: string;
  areaM2: number;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  floorEn?: string;
  finishing: FinishingType;
  finishingEn?: string;
  maintenanceFee: number;
  transferFeePolicy: 'على البائع' | 'على المشتري' | 'مناصفة' | 'معفي من رسوم التنازل';
  transferFeePolicyEn?: string;
  verifiedContract: boolean;
  verificationCode: string;
  overpriceAmount: number; // Always 0 EGP!
  images: string[];
  features: string[];
  featuresEn?: string[];
  description: string;
  descriptionEn?: string;
  contractYear: number;
  viewsCount: number;
  offersCount: number;
  isHotDeal?: boolean;
  urgencyBadge?: string;
  urgencyBadgeEn?: string;
  // Unique Institutional Differentiators vs Traditional Market
  eligibleForSwap?: boolean;
  swapTargetType?: string;
  swapTargetTypeEn?: string;
  instantLiquidityEligible?: boolean;
  auditScore?: 'A+' | 'AA' | 'AAA';
  constructionProgress?: number; // 0-100%
  exitTrack?: 'cash_exit' | 'property_swap' | 'instant_liquidity';

  // Enhanced Audit & Verification Parameters (Institutional Grade)
  unitNumber?: string; // e.g. Building 14, Unit 302
  phaseName?: string; // Phase name inside compound
  phaseNameEn?: string;
  viewOrientation?: 'بحري صريح' | 'بحري شرقي' | 'قبلي' | 'شرقي' | 'غربي';
  /** What it looks out on — keys of VIEW_OPTIONS; a unit can have several. */
  views?: UnitView[];
  viewOrientationEn?: string;
  gardenAreaM2?: number; // Garden area for ground units
  roofAreaM2?: number; // Roof area for penthouses
  parkingIncluded?: boolean; // Dedicated parking spot status
  parkingSlotsCount?: number;
  clubhouseIncluded?: boolean; // Club membership paid status
  clubhouseFeePaid?: boolean;
  hasStorageRoom?: boolean; // Storage locker in basement
  
  // Detailed Financial Audit & Contract Specifics
  downPaymentOriginal?: number; // Original down payment upon signing
  installmentsRemainingCount?: number; // Total number of remaining checks
  remainingInstallmentsBreakdown?: {
    equalInstallmentsCount: number;
    annualBulletCount?: number;
    annualBulletValue?: number;
    deliveryPaymentAmount?: number;
  };
  hasMaintenanceDepositPaid?: boolean; // Was maintenance deposit settled or due upon delivery?
  transferFeePercent?: number; // Developer's official assignment fee % (usually 5% to 10%)
  transferFeeBearer?: 'بائع' | 'مشتري' | 'مناصفة' | 'معفي بالعقد';
  hasLatePenalties?: boolean; // Are there overdue installment fines with developer?
  developerAccountStatementVerified?: boolean; // Statement matched with developer records
  checkDischargeStatus?: 'جاهزة للإلغاء بالمقر' | 'مودعة لدى البنك' | 'شيكات مقاصة مباشرة';

  // Competitive Edge: Live Buyer Demand & Arbitrage Intelligence
  activeMatchedBuyersCount?: number; // e.g. 14 verified cash buyers waiting
  estimatedDaysToClose?: number; // e.g. 3 to 7 days
  arbitrageYieldPercent?: number; // e.g. +68% capital arbitrage compared to today's launch prices
  preAuditedReportUrl?: string; // Verifiable audit passport
  isPreAudited100?: boolean; // Verified 0% legal encumbrance badge
  swapPreferenceMatchPercent?: number; // Match score for equity swap (e.g. 96%)

  // New Features: Seller Discount (Fire Sale), Payment Facilitation, Penalties & Tax Handling
  sellerWillingDiscountAmount?: number; // قيمة التنازل/الخصم الإضافي من المدفوع
  sellerWillingDiscountPercent?: number; // نسبة الخصم الإضافي
  /** Owner is open to lower offers (never higher — no overprice). */
  negotiable?: boolean;
  acceptsInstallmentsForCash?: boolean; // هل يقبل تسهيلات في سداد الكاش على دفعتين بشيك مصرفي؟
  cashInstallmentsTerms?: string; // تفاصيل تسهيلات الكاش
  hasOverdueFinesDeducted?: boolean; // هل توجد متأخرات تخصم من ثمن الوحدة؟
  overdueFinesAmount?: number; // قيمة الغرامات أو المتأخرات المخصومة
  taxCategory?: 'residential_exempt' | 'commercial_vat' | 'business_tax'; // نوع المعاملة الضريبية
  taxBearer?: 'بائع' | 'مشتري' | 'حسب القانون' | 'معفى'; // الطرف المتحمل للضريبة
  onlineReservationActive?: boolean; // تفعيل وعد البيع والحجز أونلاين
}

export interface UnitFilters {
  searchQuery: string;
  region: string;
  propertyType: string;
  developer: string;
  maxPaidCash: number;
  deliveryStatus: string;
  sortBy: 'savings' | 'paidCashLow' | 'newest' | 'area';
}

export interface CalculatorState {
  contractPrice: number;
  paidAmount: number;
  remainingYears: number;
  developerName: string;
}

export interface ExitCalculationResult {
  paidAmount: number;
  developerPenalty: number;
  developerRefundDelayMonths: number;
  developerNetRefund: number;
  traditionalBrokerFee: number;
  traditionalOverpriceRiskMonths: number;
  tanazulNetCash: number;
  tanazulFeeForSeller: number;
  tanazulEstimatedDaysToExit: number;
  totalSavedMoney: number;
}


export type ActivePage = PageId;
