import { RealEstateUnit } from '../types';
import { UnitDetailDto, UnitListItemDto } from './dto';

// ---- تحويل الـ enums الرقمية لنصوص عربية ----

const PROPERTY_TYPE_AR: Record<number, string> = {
  1: 'شقة',
  2: 'فيلا مستقلة',
  3: 'تاون هاوس',
  4: 'توين هاوس',
  5: 'دوبلكس',
  6: 'بنتهاوس',
  7: 'شاليه ساحلي',
  8: 'تجاري / محل',
  9: 'عيادة / إداري',
  10: 'عيادة / إداري',
  11: 'أرض',
};

const PROPERTY_TYPE_EN: Record<number, string> = {
  1: 'Apartment',
  2: 'Villa',
  3: 'Townhouse',
  4: 'Twin house',
  5: 'Duplex',
  6: 'Penthouse',
  7: 'Chalet',
  8: 'Retail',
  9: 'Office',
  10: 'Clinic',
  11: 'Land',
};

const INSTALLMENT_FREQ_AR: Record<number, string> = {
  1: 'شهري',
  2: 'ربع سنوي',
  3: 'نصف سنوي',
  4: 'سنوي',
};

const FINISHING_AR: Record<number, string> = {
  1: 'بدون تشطيب',
  2: 'نصف تشطيب',
  3: 'تشطيب كامل سوبر لوكس',
  4: 'ألترا سوبر لوكس',
};

const TRANSFER_POLICY_AR: Record<number, string> = {
  1: 'على البائع',
  2: 'على المشتري',
  3: 'مناصفة',
  4: 'معفي من رسوم التنازل',
};

/** عدد السنين المتبقية في التقسيط — تقدير من سنة الاستلام لو مش متوفر */
function yearsLeft(deliveryYear: number | null): number {
  if (!deliveryYear) return 0;
  return Math.max(0, deliveryYear - new Date().getFullYear());
}

function deliveryLabel(deliveryYear: number | null, isReady: boolean): string {
  if (isReady) return 'استلام فوري';
  if (!deliveryYear) return 'غير محدد';
  return `استلام ${deliveryYear}`;
}

const FALLBACK_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  2: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  3: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  5: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  7: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
};

function imagesFor(dto: UnitListItemDto, detail?: UnitDetailDto): string[] {
  if (detail?.images?.length) return detail.images;
  if (dto.coverImage) return [dto.coverImage];
  return [FALLBACK_IMAGES[dto.propertyType] ?? FALLBACK_IMAGES[1]];
}

/**
 * بيحوّل رد الـ API لشكل RealEstateUnit اللي الشاشات بتستخدمه.
 * الغرض إن الكومبوننتات ما تتغيرش مع تغيّر شكل الـ API.
 */
export function mapUnit(dto: UnitListItemDto, detail?: UnitDetailDto): RealEstateUnit {
  const d = detail;

  return {
    id: String(dto.id),
    title: dto.title,
    developer: dto.developer,
    compound: dto.compound,
    location: `${dto.compound} — ${dto.region}`,
    region: dto.region,
    propertyType: PROPERTY_TYPE_AR[dto.propertyType] ?? 'شقة',
    propertyTypeEn: PROPERTY_TYPE_EN[dto.propertyType] ?? 'Apartment',

    // سعر التعاقد مش موجود في كارت القائمة — بنستخدم التكلفة الكلية كبديل
    originalContractPrice: d?.originalContractPrice ?? dto.totalCost,
    currentMarketPrice: dto.currentMarketPrice ?? 0,
    paidCashAmount: dto.paidCashAmount,
    remainingAmount: dto.remainingAmount,

    installmentPeriodYears: d?.installmentYearsLeft ?? yearsLeft(dto.deliveryYear),
    installmentFrequency: INSTALLMENT_FREQ_AR[dto.installmentFrequency ?? 0] ?? 'ربع سنوي',
    installmentValue: dto.installmentValue ?? 0,
    nextInstallmentDate: d?.nextInstallmentDate ?? '',

    deliveryDate: dto.deliveryYear ? String(dto.deliveryYear) : '',
    deliveryStatus: deliveryLabel(dto.deliveryYear, dto.isReadyToDeliver),

    areaM2: dto.areaM2,
    bedrooms: dto.bedrooms ?? 0,
    bathrooms: dto.bathrooms ?? 0,
    floor: d?.floorInfo ?? undefined,
    finishing: FINISHING_AR[d?.finishing ?? 0] ?? 'نصف تشطيب',
    maintenanceFee: d?.maintenanceFee ?? 0,
    transferFeePolicy: TRANSFER_POLICY_AR[d?.transferFeePolicy ?? 0] ?? 'على المشتري',

    verifiedContract: dto.isVerified,
    verificationCode: dto.publicCode,

    // الأوفر دايمًا صفر — دي فكرة المنصة كلها
    overpriceAmount: 0,
    buyerGain: dto.buyerGain,

    images: imagesFor(dto, d),
    features: [],
    description: d?.description ?? '',

    contractYear: dto.publishedAt ? new Date(dto.publishedAt).getFullYear() : 0,
    viewsCount: dto.viewsCount,
    offersCount: d?.inquiriesCount ?? 0,
    isHotDeal: dto.isFeatured,
    urgencyBadge: dto.isNegotiable ? 'قابل للتفاوض' : undefined,
  };
}

/** المكسب زي ما الباك إند حسبه — مش بنحسبه في الفرونت */
export function buyerGainOf(dto: UnitListItemDto): number | null {
  return dto.buyerGain;
}
