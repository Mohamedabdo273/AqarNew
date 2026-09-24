import { DeliveryStatus, FinishingType, InstallmentFrequency, PropertyType, RealEstateUnit } from '../types';

export type View = 'بحري صريح' | 'بحري شرقي' | 'قبلي' | 'شرقي' | 'غربي';
export type FeeBearer = 'بائع' | 'مشتري' | 'مناصفة' | 'معفي بالعقد';
export type TaxCategory = 'residential_exempt' | 'commercial_vat' | 'business_tax';
export type TaxBearer = 'بائع' | 'مشتري' | 'حسب القانون' | 'معفى';

/** Everything a seller can tell us. Phase 1 (quick) fills the basics; phase 2 (details) fills the rest. */
export interface SellForm {
  // Basics — phase 1
  developer: string;
  compound: string;
  region: RealEstateUnit['region'];
  propertyType: PropertyType;
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
  viewOrientation: View;
  finishing: FinishingType;
  deliveryStatus: DeliveryStatus;
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
  installmentFrequency: InstallmentFrequency;
  installmentPeriodYears: number;
  installmentsRemainingCount: number;
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
  acceptsCashInstallments: boolean;
  cashInstallmentNotes: string;
  eligibleForSwap: boolean;
  swapTargetType: string;
  // Documents
  contractFile: string;
  receiptFile: string;
  idFile: string;
}

export const EMPTY_SELL_FORM: SellForm = {
  developer: '',
  compound: '',
  region: 'القاهرة الجديدة',
  propertyType: 'شقة',
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
  bedrooms: 3,
  bathrooms: 2,
  floor: '',
  viewOrientation: 'بحري صريح',
  finishing: 'نصف تشطيب',
  deliveryStatus: 'استلام 2027',
  deliveryDate: '',
  gardenAreaM2: 0,
  roofAreaM2: 0,
  parkingIncluded: true,
  clubhouseIncluded: false,
  hasStorageRoom: false,
  downPaymentOriginal: 0,
  currentMarketPrice: 0,
  installmentValue: 0,
  installmentFrequency: 'ربع سنوي',
  installmentPeriodYears: 5,
  installmentsRemainingCount: 0,
  nextInstallmentDate: '',
  duesConfirmed: false,
  hasLatePenalties: false,
  latePenaltiesAmount: 0,
  deductPenaltiesFromPrice: true,
  maintenanceDepositPaid: false,
  transferFeeBearer: 'مشتري',
  transferFeePercent: 0,
  taxCategory: 'residential_exempt',
  taxBearer: 'حسب القانون',
  willingToDiscount: false,
  discountAmount: 0,
  acceptsCashInstallments: false,
  cashInstallmentNotes: '',
  eligibleForSwap: false,
  swapTargetType: '',
  contractFile: '',
  receiptFile: '',
  idFile: '',
};

export const isValidPhone = (phone: string) => /^01\d{9}$/.test(phone.replace(/\s/g, ''));

export const isResidential = (type: PropertyType) => !['تجاري / محل', 'عيادة / إداري'].includes(type);

/** What the seller actually walks away with after deducted dues and any discount they offered. */
export const netToSeller = (f: SellForm) => {
  const fines = f.hasLatePenalties && f.deductPenaltiesFromPrice ? f.latePenaltiesAmount : 0;
  const discount = f.willingToDiscount ? f.discountAmount : 0;
  return { fines, discount, net: Math.max(0, f.paidAmount - fines - discount) };
};

/** Phase-2 sections. Index = wizard step. */
export type DetailSection = 'specs' | 'installments' | 'dues' | 'docs';
export const DETAIL_SECTIONS: DetailSection[] = ['specs', 'installments', 'dues', 'docs'];

export const sectionDone = (f: SellForm, s: DetailSection): boolean => {
  switch (s) {
    case 'specs':
      return f.areaM2 > 0;
    case 'installments':
      return f.installmentValue > 0 || f.paidAmount >= f.contractPrice;
    case 'dues':
      return f.duesConfirmed;
    case 'docs':
      return !!f.contractFile;
  }
};

/** 20% for the basics, 20% for each detail section. */
export const completeness = (f: SellForm) =>
  20 + DETAIL_SECTIONS.filter((s) => sectionDone(f, s)).length * 20;
