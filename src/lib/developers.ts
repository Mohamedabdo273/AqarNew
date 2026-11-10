import { useEffect, useState } from 'react';
import { CompoundOption, DeveloperOption, fetchCompounds, fetchDevelopers, searchDevelopers } from '../services/api';

/* المطورين ← الكمبوندات: القوايم جاية من الـ API (GET /api/developers…) والموظفين بيعدّلوها من الأدمن.
 * الوحدة بتتخزن بالـ id لو البائع اختار من القايمة، وبالاسم دايمًا — فاللي بيكتب اسم مش موجود بيكمّل عادي. */

export type { CompoundOption, DeveloperOption } from '../services/api';

/** الأسماء اللي بتظهر من غير تحميل الكتالوج كله (شاشات الموبايل). */
export const FEATURED_DEVELOPERS: { id: string; nameAr: string }[] = [
  { id: 'palm-hills', nameAr: 'بالم هيلز للتعمير (Palm Hills)' },
  { id: 'sodic', nameAr: 'سوديك (SODIC)' },
  { id: 'emaar', nameAr: 'إعمار مصر (Emaar Misr)' },
  { id: 'mountain-view', nameAr: 'ماونتن فيو (Mountain View - DMG)' },
  { id: 'tmg', nameAr: 'مجموعة طلعت مصطفى (TMG)' },
  { id: 'ora', nameAr: 'أورا للتطوير (ORA Developers - ساويرس)' },
];

/** Loads a list once per key; empty while loading or if the API can't be reached (the seller can still type a name). */
function useList<T>(key: string | null, load: () => Promise<T[]>): T[] {
  const [state, setState] = useState<{ key: string | null; items: T[] }>({ key: null, items: [] });
  useEffect(() => {
    if (key === null) return;
    let alive = true;
    load()
      .then((items) => alive && setState({ key, items }))
      .catch(() => alive && setState({ key, items: [] }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the key says everything the loader depends on
  }, [key]);
  return key !== null && state.key === key ? state.items : [];
}

/** Active developers, the big names first. */
export const useDeveloperCatalog = () => useList<DeveloperOption>('developers', fetchDevelopers);

/** A developer's active compounds; empty with no developer picked from the list. */
export const useCompounds = (developerId: number | null) =>
  useList<CompoundOption>(developerId ? `compounds:${developerId}` : null, () => fetchCompounds(developerId as number));

/**
 * Developer id → its compounds matching what the seller is typing, so "ميفيدا" finds إعمار.
 * Asked from the API after a short pause; the developer list itself is already loaded.
 */
export function useDeveloperSearch(query: string): Map<number, string[]> {
  const [found, setFound] = useState<{ q: string; map: Map<number, string[]> }>({ q: '', map: new Map() });
  const q = query.trim();
  useEffect(() => {
    if (q.length < 2) return;
    let alive = true;
    const t = window.setTimeout(() => {
      searchDevelopers(q)
        .then((list) => alive && setFound({ q, map: new Map(list.filter((d) => d.matches?.length).map((d) => [d.id, d.matches ?? []])) }))
        .catch(() => undefined);
    }, 250);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [q]);
  return found.q === q ? found.map : EMPTY;
}
const EMPTY = new Map<number, string[]>();

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
 * `regionSubAreas` = the seller's region's sub-areas (id + Arabic name), to tell neighbouring places apart.
 */
export function compoundRank(
  compound: Pick<CompoundOption, 'regionId' | 'subAreaId'>,
  subAreaId: number | null,
  regionId: number | null,
  regionSubAreas: { id: number; ar: string }[],
): number {
  if (!compound.regionId) return 2;
  if (!subAreaId && !regionId) return 2;
  if (subAreaId && compound.subAreaId === subAreaId) return 0;
  const name = (id: number | null) => regionSubAreas.find((s) => s.id === id)?.ar ?? '';
  const mine = name(subAreaId);
  const theirs = name(compound.subAreaId);
  if (mine && theirs && SAME_PLACE.some((g) => g.includes(mine) && g.includes(theirs))) return 0;
  return compound.regionId === regionId ? 1 : 3;
}
