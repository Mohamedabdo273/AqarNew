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
  | 'شقة'
  | 'فيلا مستقلة'
  | 'تاون هاوس'
  | 'دوبلكس'
  | 'تجاري / محل'
  | 'عيادة / إداري'
  | 'شاليه ساحلي';

export type InstallmentFrequency = 'شهري' | 'ربع سنوي' | 'نصف سنوي' | 'سنوي';

export type DeliveryStatus = 'استلام فوري' | 'استلام 2026' | 'استلام 2027' | 'استلام 2028' | 'استلام 2029+';

export type FinishingType = 'بدون تشطيب' | 'نصف تشطيب' | 'تشطيب كامل سوبر لوكس' | 'ألترا سوبر لوكس';

export type PageId = 
  | 'home' 
  | 'story' 
  | 'how-it-works' 
  | 'contact' 
  | 'investors' 
  | 'sell' 
  | 'opportunities'
  | 'admin';

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
  region: 'القاهرة الجديدة' | 'الشيخ زايد وأكتوبر' | 'العاصمة الإدارية' | 'الساحل الشمالي' | 'المستقبل والشروق' | 'البحر الأحمر';
  regionEn?: string;
  propertyType: PropertyType;
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

export interface BrandSuggestion {
  id: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  concept: string;
  rationale: string;
  domainIdea: string;
  badge: string;
  vibe: string;
  highlights: string[];
}

export type ActivePage = PageId;
