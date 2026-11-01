import { useEffect, useState } from 'react';

export interface KnownCompound {
  ar: string;
  en: string;
  /** اسم الموقع أو المنطقة بالعربي لو معروف — بيرتب قايمة الكمبوندات. */
  area?: string;
}

export interface KnownDeveloper {
  id: string;
  nameAr: string;
  nameEn: string;
  popular?: boolean;
  compounds: KnownCompound[];
}

/** الأسماء اللي بتظهر من غير تحميل الكتالوج كله (شاشات الموبايل). */
export const FEATURED_DEVELOPERS: Pick<KnownDeveloper, 'id' | 'nameAr'>[] = [
  { id: 'palm-hills', nameAr: 'بالم هيلز للتعمير (Palm Hills)' },
  { id: 'sodic', nameAr: 'سوديك (SODIC)' },
  { id: 'emaar', nameAr: 'إعمار مصر (Emaar Misr)' },
  { id: 'mountain-view', nameAr: 'ماونتن فيو (Mountain View - DMG)' },
  { id: 'tmg', nameAr: 'مجموعة طلعت مصطفى (TMG)' },
  { id: 'ora', nameAr: 'أورا للتطوير (ORA Developers - ساويرس)' },
];

/** The catalog is big, so it loads only when a page asks for it (and only once). */
let catalog: Promise<KnownDeveloper[]> | null = null;
const loadCatalog = () => {
  if (!catalog) {
    catalog = import('../data/developerCatalog')
      .then((m) => m.DEVELOPER_CATALOG)
      .catch((e) => {
        catalog = null;
        throw e;
      });
  }
  return catalog;
};

/** Empty while loading or if the file can't be fetched — the seller can still type a name. */
export function useDeveloperCatalog(): KnownDeveloper[] {
  const [list, setList] = useState<KnownDeveloper[]>([]);
  useEffect(() => {
    let alive = true;
    loadCatalog()
      .then((items) => alive && setList(items))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
  return list;
}

/** أ/إ/آ وا، ة وه، ى وي — اللي بيكتب "اكتوبر" يلاقي "أكتوبر". */
export const foldArabic = (s: string) =>
  s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ً-ْ]/g, '');

/** The name without its "(English)" part, so "ماونتن فيو (Mountain View)" and "ماونتن فيو (Mountain View - DMG)" count as one. */
export const baseName = (s: string) => foldArabic(s.split('(')[0]).trim();

/** Locations sellers treat as one place. */
const SAME_PLACE = [
  ['التجمع الخامس', 'القاهرة الجديدة'],
  ['الشيخ زايد', 'زايد الجديدة'],
  ['6 أكتوبر', 'حدائق أكتوبر', 'أكتوبر الجديدة'],
  ['العين السخنة', 'الجلالة'],
  ['الغردقة', 'سهل حشيش', 'الجونة'],
];

/**
 * 0 = the seller's location, 1 = their region, 2 = place unknown, 3 = elsewhere.
 * It only orders the list: a compound filed under a neighbouring location must still be there to pick.
 */
export function compoundRank(compound: KnownCompound, subArea: string, region: string, regionSubAreas: string[]): number {
  const area = compound.area;
  if (!area) return 2;
  if (!subArea && !region) return 2;
  if (area === subArea || SAME_PLACE.some((g) => g.includes(area) && g.includes(subArea))) return 0;
  return area === region || regionSubAreas.includes(area) ? 1 : 3;
}
