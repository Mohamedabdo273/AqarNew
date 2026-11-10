import { RealEstateUnit } from '../types';
import { Budget, fitsBudget } from '../components/BudgetFinder';
import { foldArabic } from './developers';
import { cashPrice, categoryOf, isDeal, isNegotiable, monthlyInstallment, savingsPercent, sellerDiscount } from './unitHelpers';

/** How the developer filter names a unit's developer: its catalog id when it has one (spelling variants count as one), else the name. */
export const developerKey = (u: Pick<RealEstateUnit, 'developer' | 'developerId'>) => (u.developerId ? `#${u.developerId}` : u.developer);

export interface Filters {
  query: string;
  /** Place filters by id (GET /api/locations/…): regions and their sub-areas. */
  regionIds: number[];
  subAreaIds: number[];
  categories: string[];
  types: string[];
  developers: string[];
  bedrooms: number | null; // 5 means 5+
  areaMin: number;
  areaMax: number;
  priceMin: number;
  priceMax: number;
  delivery: string[];
  finishing: string[];
  frequency: string[];
  /** Seller offers a fixed discount. */
  discounted: boolean;
  /** Seller accepts lower offers. */
  negotiable: boolean;
  swappable: boolean;
  /** Any of these views (empty = any). */
  views: string[];
  noTransferFee: boolean;
  noPenalties: boolean;
}

export const EMPTY_FILTERS: Filters = {
  query: '',
  regionIds: [],
  subAreaIds: [],
  categories: [],
  types: [],
  developers: [],
  bedrooms: null,
  areaMin: 0,
  areaMax: 0,
  priceMin: 0,
  priceMax: 0,
  delivery: [],
  finishing: [],
  frequency: [],
  discounted: false,
  negotiable: false,
  swappable: false,
  views: [],
  noTransferFee: false,
  noPenalties: false,
};

export type SortKey = 'newest' | 'deals' | 'savings' | 'cash' | 'monthly' | 'delivery' | 'popular' | 'area';

const deliveryRank = (u: RealEstateUnit) =>
  u.deliveryStatus === 'استلام فوري' ? 0 : Number(u.deliveryStatus.replace(/\D/g, '')) || 9999;

export const SORTERS: Record<SortKey, (a: RealEstateUnit, b: RealEstateUnit) => number> = {
  newest: () => 0, // units are stored newest-first
  deals: (a, b) => sellerDiscount(b) - sellerDiscount(a),
  savings: (a, b) => savingsPercent(b) - savingsPercent(a),
  cash: (a, b) => cashPrice(a) - cashPrice(b),
  monthly: (a, b) => monthlyInstallment(a) - monthlyInstallment(b),
  delivery: (a, b) => deliveryRank(a) - deliveryRank(b),
  popular: (a, b) => b.viewsCount - a.viewsCount,
  area: (a, b) => b.areaM2 - a.areaM2,
};

export const applyFilters = (
  units: RealEstateUnit[],
  f: Filters,
  budget: Budget | null,
  sort: SortKey
): RealEstateUnit[] => {
  const q = foldArabic(f.query.trim());
  const list = units.filter((u) => {
    if (budget && !fitsBudget(u, budget)) return false;
    if (f.regionIds.length && !f.regionIds.includes(u.regionId ?? 0)) return false;
    if (f.subAreaIds.length && !f.subAreaIds.includes(u.subAreaId ?? 0)) return false;
    if (f.categories.length && !f.categories.includes(categoryOf(u))) return false;
    if (f.types.length && !f.types.includes(u.propertyType)) return false;
    if (f.developers.length && !f.developers.includes(developerKey(u)) && !f.developers.includes(u.developer)) return false;
    if (f.bedrooms !== null && (f.bedrooms >= 5 ? u.bedrooms < 5 : u.bedrooms !== f.bedrooms)) return false;
    if (f.areaMin && u.areaM2 < f.areaMin) return false;
    if (f.areaMax && u.areaM2 > f.areaMax) return false;
    if (f.priceMin && u.originalContractPrice < f.priceMin) return false;
    if (f.priceMax && u.originalContractPrice > f.priceMax) return false;
    if (f.delivery.length && !f.delivery.includes(u.deliveryStatus)) return false;
    if (f.finishing.length && !f.finishing.includes(u.finishing)) return false;
    if (f.frequency.length && !f.frequency.includes(u.installmentFrequency)) return false;
    if (f.discounted && !isDeal(u)) return false;
    if (f.negotiable && !isNegotiable(u)) return false;
    if (f.swappable && u.eligibleForSwap === false) return false;
    if (f.views.length && !f.views.some((v) => u.views?.includes(v as never))) return false;
    if (f.noTransferFee && u.transferFeePolicy !== 'معفي من رسوم التنازل') return false;
    if (f.noPenalties && u.hasLatePenalties) return false;
    if (q) {
      const hay = foldArabic([u.compound, u.compoundEn, u.developer, u.developerEn, u.location, u.locationEn, u.subArea, u.subAreaEn, u.district, u.districtEn, u.verificationCode].join(' '));
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return sort === 'newest' ? list : [...list].sort(SORTERS[sort]);
};
