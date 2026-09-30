import { DeliveryStatus, FinishingType, InstallmentFrequency, PropertyCategory, PropertyType, RealEstateUnit } from '../types';

export type View = 'بحري صريح' | 'بحري شرقي' | 'قبلي' | 'شرقي' | 'غربي';
/** '' = the seller doesn't know (a valid answer, not a missing one). */
export type FeeBearer = 'بائع' | 'مشتري' | 'مناصفة' | 'معفي بالعقد' | '';
export type TaxCategory = 'residential_exempt' | 'commercial_vat' | 'business_tax' | '';
export type TaxBearer = 'بائع' | 'مشتري' | 'حسب القانون' | 'معفى';

/** Everything a seller can tell us. Phase 1 (quick) fills the basics; phase 2 (details) fills the rest. */
export interface SellForm {
  // Basics — phase 1
  developer: string;
  compound: string;
  region: RealEstateUnit['region'] | '';
  subArea: string;
  propertyCategory: PropertyCategory | '';
  propertyType: PropertyType | '';
  contractPrice: number;
  paidAmount: number;
  ownerName: string;
  ownerPhone: string;
  ackOwner: boolean;
  ackNoOverprice: boolean;
  ackDeclareDues: boolean;
  // Specs
  phaseName: string;
  unitNumber: string;
  areaM2: number;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  viewOrientation: View | '';
  finishing: FinishingType | '';
  alreadyDelivered: boolean | null;
  deliveryStatus: DeliveryStatus | '';
  /** Legacy — no longer asked (the delivery year is enough). */
  deliveryDate: string;
  gardenAreaM2: number;
  roofAreaM2: number;
  parkingIncluded: boolean;
  clubhouseIncluded: boolean;
  hasStorageRoom: boolean;
  // Installments
  downPaymentOriginal: number;
  currentMarketPrice: number;
  installmentValue: number;
  installmentFrequency: InstallmentFrequency | '';
  /** Derived from count × frequency on save. */
  installmentPeriodYears: number;
  installmentsRemainingCount: number;
  /** 'YYYY-MM'. */
  nextInstallmentDate: string;
  // Dues, fees & terms
  duesConfirmed: boolean;
  hasLatePenalties: boolean;
  latePenaltiesAmount: number;
  deductPenaltiesFromPrice: boolean;
  maintenanceDepositPaid: boolean;
  transferFeeBearer: FeeBearer;
  transferFeePercent: number;
  taxCategory: TaxCategory;
  taxBearer: TaxBearer;
  willingToDiscount: boolean;
  discountAmount: number;
  /** Open to offers below the asking cash. */
  negotiable: boolean;
  acceptsCashInstallments: boolean;
  cashInstallmentNotes: string;
  eligibleForSwap: boolean;
  swapTargetType: string;
  // Documents
  /** أول 4 صفحات من العقد — أسماء الملفات. */
  contractPages: string[];
  /** جدول سداد الأقساط الملحق بالعقد. */
  paymentScheduleFile: string;
  /** بلان الوحدة الملحق بالعقد. */
  unitPlanFile: string;
  contractFile: string;
  receiptFile: string;
  idFile: string;
}

export const EMPTY_SELL_FORM: SellForm = {
  developer: '',
  compound: '',
  region: '',
  subArea: '',
  propertyCategory: '',
  propertyType: '',
  contractPrice: 0,
  paidAmount: 0,
  ownerName: '',
  ownerPhone: '',
  ackOwner: false,
  ackNoOverprice: false,
  ackDeclareDues: false,
  phaseName: '',
  unitNumber: '',
  areaM2: 0,
  bedrooms: 0,
  bathrooms: 0,
  floor: '',
  viewOrientation: '',
  finishing: '',
  alreadyDelivered: null,
  deliveryStatus: '',
  deliveryDate: '',
  gardenAreaM2: 0,
  roofAreaM2: 0,
  parkingIncluded: false,
  clubhouseIncluded: false,
  hasStorageRoom: false,
  downPaymentOriginal: 0,
  currentMarketPrice: 0,
  installmentValue: 0,
  installmentFrequency: '',
  installmentPeriodYears: 0,
  installmentsRemainingCount: 0,
  nextInstallmentDate: '',
  duesConfirmed: false,
  hasLatePenalties: false,
  latePenaltiesAmount: 0,
  deductPenaltiesFromPrice: true,
  maintenanceDepositPaid: false,
  transferFeeBearer: '',
  transferFeePercent: 0,
  taxCategory: '',
  taxBearer: 'حسب القانون',
  willingToDiscount: false,
  negotiable: false,
  discountAmount: 0,
  acceptsCashInstallments: false,
  cashInstallmentNotes: '',
  eligibleForSwap: false,
  swapTargetType: '',
  contractPages: [],
  paymentScheduleFile: '',
  unitPlanFile: '',
  contractFile: '',
  receiptFile: '',
  idFile: '',
};

export const isValidPhone = (phone: string) => /^01\d{9}$/.test(phone.replace(/\s/g, ''));

export const isResidential = (type: PropertyType | '') => !['محل', 'مكتب'].includes(type);

/** What the seller actually walks away with after deducted dues and any discount they offered. */
export const netToSeller = (f: SellForm) => {
  const fines = f.hasLatePenalties && f.deductPenaltiesFromPrice ? f.latePenaltiesAmount : 0;
  const discount = f.willingToDiscount ? f.discountAmount : 0;
  return { fines, discount, net: Math.max(0, f.paidAmount - fines - discount) };
};

/** Phase-2 sections. Index = wizard step. "faster" is optional and never blocks review. */
export type DetailSection = 'specs' | 'installments' | 'dues' | 'faster' | 'docs';
export const DETAIL_SECTIONS: DetailSection[] = ['specs', 'installments', 'dues', 'faster', 'docs'];
const REQUIRED_SECTIONS = DETAIL_SECTIONS.filter((s) => s !== 'faster');

export const MONTHS_PER_PAYMENT: Record<InstallmentFrequency, number> = { 'شهري': 1, 'ربع سنوي': 3, 'نصف سنوي': 6, 'سنوي': 12 };

export const sectionDone = (f: SellForm, s: DetailSection): boolean => {
  switch (s) {
    case 'specs':
      return f.areaM2 > 0 && !!f.finishing && !!f.deliveryStatus;
    case 'installments':
      return (f.installmentValue > 0 && !!f.installmentFrequency) || f.paidAmount >= f.contractPrice;
    case 'dues':
      return f.duesConfirmed;
    case 'faster':
      return true;
    case 'docs':
      return !!f.contractFile;
  }
};

/** 20% for the basics, 20% for each required detail section. */
export const completeness = (f: SellForm) =>
  20 + REQUIRED_SECTIONS.filter((s) => sectionDone(f, s)).length * 20;
