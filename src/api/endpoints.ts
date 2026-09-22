import { api } from './client';
import {
  AuthResponse,
  CompoundDto,
  ContactRevealResult,
  DeveloperDto,
  ExitCalculatorResult,
  InquiryDto,
  Paged,
  RegionDto,
  SellerUnitDto,
  UnitDetailDto,
  UnitListItemDto,
  UnitStatsDto,
  UserDto,
} from './dto';

export interface UnitSearchParams {
  search?: string;
  regionId?: number;
  developerId?: number;
  propertyType?: number;
  maxCash?: number;
  minCash?: number;
  maxMonthlyInstallment?: number;
  minArea?: number;
  maxArea?: number;
  minBedrooms?: number;
  maxDeliveryYear?: number;
  readyToDeliver?: boolean;
  negotiableOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: 'newest' | 'gain' | 'cashLow' | 'installmentLow' | 'delivery' | 'popular' | 'saved';
  page?: number;
  pageSize?: number;
}

function qs(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    sp.append(key, String(value));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export const unitsApi = {
  search: (params: UnitSearchParams = {}) =>
    api.get<Paged<UnitListItemDto>>(`/api/units${qs(params as Record<string, unknown>)}`),

  stats: () => api.get<UnitStatsDto>('/api/units/stats'),

  byCode: (publicCode: string) => api.get<UnitDetailDto>(`/api/units/${publicCode}`),

  revealContact: (unitId: number) =>
    api.post<ContactRevealResult>(`/api/units/${unitId}/reveal-contact`),

  inquiry: (
    unitId: number,
    body: {
      inquiryType: number;
      message?: string;
      offerAmount?: number;
      preferredDate?: string;
      guestName?: string;
      guestPhone?: string;
    }
  ) => api.post<number>(`/api/units/${unitId}/inquiry`, body),
};

export const lookupsApi = {
  regions: () => api.get<RegionDto[]>('/api/lookups/regions'),
  developers: () => api.get<DeveloperDto[]>('/api/lookups/developers'),
  compounds: (developerId?: number, regionId?: number) =>
    api.get<CompoundDto[]>(`/api/lookups/compounds${qs({ developerId, regionId })}`),
};

export const authApi = {
  requestOtp: (phone: string) => api.post<{ success: boolean }>('/api/auth/otp/request', { phone }),

  verifyOtp: (phone: string, code: string, fullName?: string, role?: number) =>
    api.post<AuthResponse>('/api/auth/otp/verify', { phone, code, fullName, role }),

  me: () => api.get<UserDto>('/api/auth/me'),

  logout: (refreshToken: string) => api.post('/api/auth/logout', { refreshToken }),

  updateProfile: (fullName: string, email?: string) =>
    api.put<UserDto>('/api/auth/me', { fullName, email }),

  updateBudget: (budgetCashMax?: number, budgetInstallment?: number, preferredRegionIds?: number[]) =>
    api.put<UserDto>('/api/auth/me/budget', {
      budgetCashMax,
      budgetInstallment,
      preferredRegionIds,
    }),
};

export const meApi = {
  saved: () => api.get<UnitListItemDto[]>('/api/me/saved'),
  toggleSave: (unitId: number) => api.post(`/api/me/saved/${unitId}`),
  inquiries: () => api.get<InquiryDto[]>('/api/me/inquiries'),
  alerts: () => api.get<unknown[]>('/api/me/alerts'),
  createAlert: (body: {
    regionIds?: number[];
    developerIds?: number[];
    propertyTypes?: number[];
    maxCash?: number;
    maxMonthlyInstallment?: number;
    minArea?: number;
    channel: number;
  }) => api.post<number>('/api/me/alerts', body),
};

export interface CreateUnitBody {
  developerId: number;
  compoundId: number;
  titleAr?: string;
  propertyType: number;
  areaM2: number;
  bedrooms?: number;
  bathrooms?: number;
  floorInfo?: string;
  finishing?: number;
  originalContractPrice: number;
  paidCashAmount: number;
  remainingAmount: number;
  currentMarketPrice?: number;
  installmentValue?: number;
  installmentFrequency?: number;
  installmentYearsLeft?: number;
  nextInstallmentDate?: string;
  maintenanceFee?: number;
  deliveryYear?: number;
  isReadyToDeliver?: boolean;
  transferFeePolicy?: number;
  isNegotiable?: boolean;
  descriptionAr?: string;
}

export const sellerApi = {
  myUnits: () => api.get<SellerUnitDto[]>('/api/seller/units'),

  createDraft: (body: CreateUnitBody) => api.post<number>('/api/seller/units', body),

  update: (id: number, body: CreateUnitBody) => api.put(`/api/seller/units/${id}`, body),

  uploadDocument: (unitId: number, docType: number, file: File) => {
    const form = new FormData();
    form.append('docType', String(docType));
    form.append('file', file);
    return api.upload<number>(`/api/seller/units/${unitId}/documents`, form);
  },

  submit: (id: number) => api.post(`/api/seller/units/${id}/submit`),

  withdraw: (id: number) => api.post(`/api/seller/units/${id}/withdraw`),
};

export const calculatorApi = {
  exit: (body: {
    contractPrice: number;
    paidAmount: number;
    developerId?: number;
    remainingAmount?: number;
    currentMarketPrice?: number;
  }) => api.post<ExitCalculatorResult>('/api/calculator/exit', body),
};

export const leadsApi = {
  contact: (body: {
    fullName: string;
    phone?: string;
    email?: string;
    subject?: string;
    message: string;
  }) => api.post<number>('/api/contact', body),

  investor: (body: {
    fullName: string;
    company?: string;
    country?: string;
    city?: string;
    email: string;
    phone?: string;
    investorType: number;
    ticketSizeUsd?: number;
    answersJson?: string;
  }) => api.post<number>('/api/investors/interest', body),
};
