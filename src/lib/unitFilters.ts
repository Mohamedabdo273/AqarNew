import { RealEstateUnit } from '../types';
import { Budget, fitsBudget } from '../components/BudgetFinder';
import { cashPrice, isDeal, isNegotiable, monthlyInstallment, savingsPercent, sellerDiscount } from './unitHelpers';

export interface Filters {
  query: string;
  regions: string[];
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
  noTransferFee: boolean;
  noPenalties: boolean;
}

export const EMPTY_FILTERS: Filters = {
  query: '',
  regions: [],
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
  const q = f.query.trim().toLowerCase();
  const list = units.filter((u) => {
    if (budget && !fitsBudget(u, budget)) return false;
    if (f.regions.length && !f.regions.includes(u.region)) return false;
    if (f.types.length && !f.types.includes(u.propertyType)) return false;
    if (f.developers.length && !f.developers.includes(u.developer)) return false;
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
    if (f.noTransferFee && u.transferFeePolicy !== 'معفي من رسوم التنازل') return false;
    if (f.noPenalties && u.hasLatePenalties) return false;
    if (q) {
      const hay = [u.compound, u.compoundEn, u.developer, u.developerEn, u.location, u.locationEn, u.verificationCode]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return sort === 'newest' ? list : [...list].sort(SORTERS[sort]);
};
