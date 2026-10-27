import { Language, RealEstateUnit } from '../types';
import { BRAND } from '../config/brand';

const MONTHS_PER_PAYMENT: Record<string, number> = {
  'شهري': 1,
  'ربع سنوي': 3,
  'نصف سنوي': 6,
  'سنوي': 12,
};

/** Installment normalised to a per-month figure so every unit can be compared on the same scale. */
export const monthlyInstallment = (unit: RealEstateUnit): number =>
  Math.round(unit.installmentValue / (MONTHS_PER_PAYMENT[unit.installmentFrequency] ?? 3));

/** Amount the seller agreed to knock off what they paid, to sell faster. */
export const sellerDiscount = (unit: RealEstateUnit): number => Math.max(0, unit.sellerWillingDiscountAmount ?? 0);

/** A "لقطة": the seller is taking less than they paid. */
export const isDeal = (unit: RealEstateUnit): boolean => sellerDiscount(unit) > 0;

/** The owner accepts offers below the asking cash. */
export const isNegotiable = (unit: RealEstateUnit): boolean => !!unit.negotiable;

/** Cash the buyer actually hands over: what the seller paid, less any agreed discount. */
export const cashPrice = (unit: RealEstateUnit): number => Math.max(0, unit.paidCashAmount - sellerDiscount(unit));

/** Our fee, paid by the buyer after signing: a % of the contract price. */
export const buyerFee = (unit: RealEstateUnit): number => Math.round((unit.originalContractPrice * BRAND.buyerFeePercent) / 100);

/**
 * Buyer's real saving vs buying the same unit from the developer today:
 * includes any seller discount and is already net of our fee — so the number we show is the number they keep.
 */
export const savingsAmount = (unit: RealEstateUnit): number =>
  Math.max(0, unit.currentMarketPrice - unit.originalContractPrice + sellerDiscount(unit) - buyerFee(unit));

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
/** Low end of the same range — for showing the loss as a 10–15% range. */
export const CANCELLATION_PENALTY_MIN_RATE = 0.1;

/** What cancelling costs: the penalty on the full contract price, capped at what was actually paid. */
export const cancellationLoss = (contractPrice: number, paid: number, rate = CANCELLATION_PENALTY_RATE) =>
  Math.min(paid, Math.round(contractPrice * rate));

/** The views a unit can look out on (pick any). */
export const VIEW_OPTIONS: { key: import('../types').UnitView; ar: string; en: string }[] = [
  { key: 'open', ar: 'فيو مفتوح', en: 'Open view' },
  { key: 'water', ar: 'مسطحات مائية', en: 'Water features' },
  { key: 'landscape', ar: 'لاند سكيب', en: 'Landscape' },
  { key: 'street', ar: 'على شارع', en: 'Street view' },
  { key: 'sea', ar: 'فيو بحر', en: 'Sea view' },
  { key: 'clubhouse', ar: 'كلوب هاوس', en: 'Club house' },
];

/** "التجمع الخامس، القاهرة الجديدة" — أدق مكان معروف للوحدة، من غير تكرار المنطقة. */
export const placeLabel = (unit: Pick<RealEstateUnit, 'region' | 'regionEn' | 'subArea' | 'subAreaEn' | 'district' | 'districtEn'>, language: Language) => {
  const parts = [pick(language, unit.district ?? '', unit.districtEn), pick(language, unit.subArea ?? '', unit.subAreaEn)].filter(Boolean);
  return (parts.length ? parts : [pick(language, unit.region, unit.regionEn)]).join(language === 'en' ? ', ' : '، ');
};

/** تصنيف الوحدة — المستوى الأول. */
export const PROPERTY_CATEGORIES: { ar: RealEstateUnit['propertyCategory']; en: string }[] = [
  { ar: 'سكني', en: 'Residential' },
  { ar: 'تجاري', en: 'Commercial' },
  { ar: 'إداري', en: 'Administrative' },
  { ar: 'فندقي', en: 'Hotel' },
  { ar: 'طبي', en: 'Medical' },
  { ar: 'ترفيهي', en: 'Entertainment' },
];

/** الفندقي بنفس أنواع السكني — نفس القايمة مش نسخة منها، عشان تعديل واحد يمشي على الاتنين. */
const LIVING_TYPES: { ar: RealEstateUnit['propertyType']; en: string }[] = [
  { ar: 'شقة', en: 'Apartment' },
  { ar: 'استوديو', en: 'Studio' },
  { ar: 'شاليه', en: 'Chalet' },
  { ar: 'دوبلكس', en: 'Duplex' },
  { ar: 'تاون هاوس', en: 'Townhouse' },
  { ar: 'توين هاوس', en: 'Twin house' },
  { ar: 'فيلا', en: 'Villa' },
  { ar: 'بنتهاوس', en: 'Penthouse' },
  { ar: 'أخرى', en: 'Other' },
];

/** الأنواع تحت كل تصنيف. عدّل هنا وبس — الفلاتر والفورم بيقروا منها. */
export const TYPES_BY_CATEGORY: Record<RealEstateUnit['propertyCategory'], { ar: RealEstateUnit['propertyType']; en: string }[]> = {
  'سكني': LIVING_TYPES,
  'تجاري': [
    { ar: 'محل/مقر', en: 'Shop / premises' },
    { ar: 'مخزن', en: 'Warehouse' },
    { ar: 'مطعم/كافيه', en: 'Restaurant / cafe' },
  ],
  'إداري': [
    { ar: 'مكتب', en: 'Office' },
    { ar: 'دور إداري', en: 'Office floor' },
    { ar: 'مقر شركة', en: 'Company HQ' },
  ],
  'فندقي': LIVING_TYPES,
  'طبي': [
    { ar: 'عيادة', en: 'Clinic' },
    { ar: 'صيدلية', en: 'Pharmacy' },
  ],
  'ترفيهي': [
    { ar: 'سينما', en: 'Cinema' },
    { ar: 'ملاهي', en: 'Amusement park' },
  ],
};

/** كل الأنواع في قايمة واحدة — للفلاتر اللي مش محتاجة التصنيف. */
export const PROPERTY_TYPES: { ar: RealEstateUnit['propertyType']; en: string }[] = dedupe(
  PROPERTY_CATEGORIES.flatMap((c) => TYPES_BY_CATEGORY[c.ar]),
);

/** الأنواع تحت التصنيفات المختارة — من غير اختيار بتجيب الكل. */
export const typesFor = (categories: string[]) => {
  const keys = categories.length ? categories : PROPERTY_CATEGORIES.map((c) => c.ar);
  return dedupe(keys.flatMap((c) => TYPES_BY_CATEGORY[c as RealEstateUnit['propertyCategory']] ?? []));
};

/** نفس النوع ممكن يتكرر تحت أكتر من تصنيف (شقة سكني وفندقي)، فبنشيل التكرار من القوايم المجمّعة. */
function dedupe(list: { ar: RealEstateUnit['propertyType']; en: string }[]) {
  const seen = new Set<string>();
  return list.filter((t) => !seen.has(t.ar) && seen.add(t.ar));
}

/**
 * تصنيف أي نوع. دي تخمين من النوع بس — والسكني والفندقي بنفس الأنواع،
 * فأي نوع سكن هيرجّع "سكني". للوحدات استخدم categoryOf اللي بتقرا التصنيف المخزّن الأول.
 */
export const categoryOfType = (type: string): RealEstateUnit['propertyCategory'] | '' => {
  for (const c of PROPERTY_CATEGORIES) {
    if (TYPES_BY_CATEGORY[c.ar].some((t) => t.ar === type)) return c.ar;
  }
  return '';
};

/** تصنيف وحدة: المخزّن الأول (بيفرّق بين السكني والفندقي)، وإلا بنشتقه من النوع. */
export const categoryOf = (unit: Pick<RealEstateUnit, 'propertyType' | 'propertyCategory'>) =>
  unit.propertyCategory || categoryOfType(unit.propertyType);

export const DELIVERY_OPTIONS: { ar: RealEstateUnit['deliveryStatus']; en: string; short: string }[] = [
  { ar: 'استلام فوري', en: 'Ready', short: 'فوري' },
  { ar: 'استلام 2026', en: '2026', short: '2026' },
  { ar: 'استلام 2027', en: '2027', short: '2027' },
  { ar: 'استلام 2028', en: '2028', short: '2028' },
  { ar: 'استلام 2029+', en: '2029+', short: 'بعد 2028' },
];

export const FINISHING_OPTIONS: { ar: RealEstateUnit['finishing']; en: string }[] = [
  { ar: 'طوب أحمر', en: 'Red brick (core & shell)' },
  { ar: 'نص تشطيب', en: 'Semi-finished' },
  { ar: 'تلت تربع تشطيب', en: 'Three-quarters finished' },
  { ar: 'كامل التشطيب', en: 'Fully finished' },
  { ar: 'متشطب بالعفش', en: 'Finished & furnished' },
];

/** The developer's transfer fee is always on the buyer and differs by developer — shown wherever a listing's fee bearer used to be. */
export const transferFeeText = (tx: (ar: string, en: string) => string) =>
  tx('رسوم التنازل على المشتري — بتختلف حسب المطور', "Transfer fee is on the buyer — it varies by developer");

export const FREQUENCY_OPTIONS: { ar: RealEstateUnit['installmentFrequency']; en: string }[] = [
  { ar: 'شهري', en: 'Monthly' },
  { ar: 'ربع سنوي', en: 'Quarterly' },
  { ar: 'نصف سنوي', en: 'Semi-annual' },
  { ar: 'سنوي', en: 'Annual' },
];
