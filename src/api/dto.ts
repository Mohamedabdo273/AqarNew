// أشكال البيانات زي ما الـ API بيرجّعها بالظبط.
// التحويل للشكل اللي الشاشات بتستخدمه في mappers.ts

export interface Paged<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface UnitListItemDto {
  id: number;
  publicCode: string;
  title: string;
  developer: string;
  compound: string;
  region: string;
  propertyType: number;
  areaM2: number;
  bedrooms: number | null;
  bathrooms: number | null;
  paidCashAmount: number;
  remainingAmount: number;
  totalCost: number;
  currentMarketPrice: number | null;
  buyerGain: number | null;
  commissionRate: number;
  installmentValue: number | null;
  installmentFrequency: number | null;
  deliveryYear: number | null;
  isReadyToDeliver: boolean;
  isNegotiable: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  coverImage: string | null;
  viewsCount: number;
  publishedAt: string | null;
  marketPriceDisclaimer: string | null;
}

export interface UnitDetailDto extends UnitListItemDto {
  description: string | null;
  floorInfo: string | null;
  finishing: number | null;
  originalContractPrice: number;
  installmentYearsLeft: number | null;
  nextInstallmentDate: string | null;
  maintenanceFee: number | null;
  transferFeePolicy: number | null;
  images: string[];
  verifiedDocuments: string[];
  savesCount: number;
  inquiriesCount: number;
  isSavedByMe: boolean;
  verifiedAt: string | null;
}

export interface UnitStatsDto {
  totalUnits: number;
  availableUnits: number;
  estimatedMarketValue: number;
  averageBuyerGain: number | null;
}

export interface RegionDto {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
  unitsCount: number;
}

export interface DeveloperDto {
  id: number;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  logoUrl: string | null;
  unitsCount: number;
}

export interface CompoundDto {
  id: number;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  developerId: number;
  regionId: number;
  unitsCount: number;
}

export interface UserDto {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: number;
  isPhoneVerified: boolean;
  budgetCashMax: number | null;
  budgetInstallment: number | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserDto;
}

export interface SellerUnitDto {
  id: number;
  publicCode: string;
  title: string;
  developer: string;
  compound: string;
  status: number;
  statusAr: string;
  statusEn: string;
  paidCashAmount: number;
  remainingAmount: number;
  buyerGain: number | null;
  documentsCount: number;
  inquiriesCount: number;
  viewsCount: number;
  rejectionReason: string | null;
  createdAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
}

export interface InquiryDto {
  id: number;
  unitId: number | null;
  unitCode: string | null;
  unitTitle: string | null;
  contactName: string;
  contactPhone: string;
  inquiryType: number;
  status: number;
  message: string | null;
  offerAmount: number | null;
  createdAt: string;
}

export interface ExitCalculatorResult {
  paidAmount: number;
  developerPenaltyRate: number;
  developerPenalty: number;
  developerNetRefund: number;
  developerRefundDelayMonths: number;
  traditionalBrokerFee: number;
  traditionalEstimatedMonths: number;
  platformNetCash: number;
  platformFeeOnSeller: number;
  platformEstimatedDays: number;
  totalSaved: number;
  dataSource: string;
}

export interface ContactRevealResult {
  granted: boolean;
  sellerName: string | null;
  sellerPhone: string | null;
  reason: string | null;
}

// ---- قيم الـ enums زي ما هي في الباك إند ----

export const PropertyTypeApi = {
  Apartment: 1,
  Villa: 2,
  Townhouse: 3,
  TwinHouse: 4,
  Duplex: 5,
  Penthouse: 6,
  Chalet: 7,
  Retail: 8,
  Office: 9,
  Clinic: 10,
  Land: 11,
} as const;

export const InstallmentFrequencyApi = {
  Monthly: 1,
  Quarterly: 2,
  SemiAnnual: 3,
  Annual: 4,
} as const;

export const FinishingApi = {
  None: 1,
  SemiFinished: 2,
  FullyFinished: 3,
  UltraSuperLux: 4,
} as const;

export const TransferFeePolicyApi = {
  OnSeller: 1,
  OnBuyer: 2,
  Split: 3,
  Exempt: 4,
} as const;

export const UnitStatusApi = {
  Draft: 1,
  PendingReview: 2,
  NeedsInfo: 3,
  Published: 4,
  Reserved: 5,
  UnderTransfer: 6,
  Completed: 7,
  Rejected: 8,
  Withdrawn: 9,
  Expired: 10,
} as const;
