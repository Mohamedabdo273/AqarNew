import { Language, RealEstateUnit } from '../types';

const MONTHS_PER_PAYMENT: Record<string, number> = {
  'شهري': 1,
  'ربع سنوي': 3,
  'نصف سنوي': 6,
  'سنوي': 12,
};

/** Installment normalised to a per-month figure so every unit can be compared on the same scale. */
export const monthlyInstallment = (unit: RealEstateUnit): number =>
  Math.round(unit.installmentValue / (MONTHS_PER_PAYMENT[unit.installmentFrequency] ?? 3));

/** What the buyer saves versus buying the same unit from the developer today. */
export const savingsAmount = (unit: RealEstateUnit): number =>
  Math.max(0, unit.currentMarketPrice - unit.originalContractPrice);

export const savingsPercent = (unit: RealEstateUnit): number =>
  unit.currentMarketPrice > 0 ? Math.round((savingsAmount(unit) / unit.currentMarketPrice) * 100) : 0;

/** Short, human money label: "1.85 مليون" / "850 ألف" / "1.85M". */
export const money = (value: number, lang: Language): string => {
  const abs = Math.abs(value);
  const trim = (n: number) => String(Number(n.toFixed(2)));
  if (abs >= 1_000_000) return lang === 'ar' ? `${trim(value / 1_000_000)} مليون` : `${trim(value / 1_000_000)}M`;
  if (abs >= 1_000) return lang === 'ar' ? `${trim(value / 1_000)} ألف` : `${trim(value / 1_000)}K`;
  return String(Math.round(value));
};

export const currency = (lang: Language) => (lang === 'ar' ? 'ج.م' : 'EGP');

export const fullMoney = (value: number, lang: Language): string =>
  `${Math.round(value).toLocaleString('en-US')} ${currency(lang)}`;

/** Picks the English field when available and the UI is in English. */
export const pick = (lang: Language, ar: string, en?: string): string => (lang === 'en' && en ? en : ar);

export const deliveryLabel = (unit: RealEstateUnit, lang: Language): string => {
  if (unit.deliveryStatus === 'استلام فوري') return lang === 'ar' ? 'فوري' : 'Ready';
  const year = unit.deliveryStatus.replace('استلام ', '');
  return year;
};

/** Developers typically deduct 10–15% of the TOTAL contract price on cancellation, refunded over up to ~3 years. */
export const CANCELLATION_PENALTY_RATE = 0.15;

/** What cancelling costs: the penalty on the full contract price, capped at what was actually paid. */
export const cancellationLoss = (contractPrice: number, paid: number) =>
  Math.min(paid, Math.round(contractPrice * CANCELLATION_PENALTY_RATE));

export const REGIONS: { ar: RealEstateUnit['region']; en: string }[] = [
  { ar: 'القاهرة الجديدة', en: 'New Cairo' },
  { ar: 'الشيخ زايد وأكتوبر', en: 'Zayed & October' },
  { ar: 'العاصمة الإدارية', en: 'New Capital' },
  { ar: 'المستقبل والشروق', en: 'Mostakbal & Shorouk' },
  { ar: 'الساحل الشمالي', en: 'North Coast' },
  { ar: 'البحر الأحمر', en: 'Red Sea' },
];

export const PROPERTY_TYPES: { ar: RealEstateUnit['propertyType']; en: string }[] = [
  { ar: 'شقة', en: 'Apartment' },
  { ar: 'دوبلكس', en: 'Duplex' },
  { ar: 'تاون هاوس', en: 'Townhouse' },
  { ar: 'فيلا مستقلة', en: 'Villa' },
  { ar: 'شاليه ساحلي', en: 'Chalet' },
  { ar: 'عيادة / إداري', en: 'Office / Clinic' },
  { ar: 'تجاري / محل', en: 'Retail' },
];

export const DELIVERY_OPTIONS: { ar: RealEstateUnit['deliveryStatus']; en: string; short: string }[] = [
  { ar: 'استلام فوري', en: 'Ready', short: 'فوري' },
  { ar: 'استلام 2026', en: '2026', short: '2026' },
  { ar: 'استلام 2027', en: '2027', short: '2027' },
  { ar: 'استلام 2028', en: '2028', short: '2028' },
  { ar: 'استلام 2029+', en: '2029+', short: 'بعد 2028' },
];

export const FINISHING_OPTIONS: { ar: RealEstateUnit['finishing']; en: string }[] = [
  { ar: 'بدون تشطيب', en: 'Core & shell' },
  { ar: 'نصف تشطيب', en: 'Semi-finished' },
  { ar: 'تشطيب كامل سوبر لوكس', en: 'Fully finished' },
  { ar: 'ألترا سوبر لوكس', en: 'Ultra lux' },
];

export const FREQUENCY_OPTIONS: { ar: RealEstateUnit['installmentFrequency']; en: string }[] = [
  { ar: 'شهري', en: 'Monthly' },
  { ar: 'ربع سنوي', en: 'Quarterly' },
  { ar: 'نصف سنوي', en: 'Semi-annual' },
  { ar: 'سنوي', en: 'Annual' },
];
