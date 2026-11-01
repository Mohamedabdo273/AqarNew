import { useEffect, useState } from 'react';
import { Language } from '../types';
import { PlaceOption, SubAreaOption, fetchRegions, fetchSubAreas } from '../services/api';

/* المنطقة ← الموقع: القوايم جاية من الـ API (GET /api/locations/…)، والوحدات والفلاتر بتشاور عليها بالـ id. */

export type { PlaceOption, SubAreaOption } from '../services/api';

/** Loads a list once per key; empty while loading or if the API can't be reached. */
function useList<T>(key: string, load: () => Promise<T[]>): T[] {
  const [state, setState] = useState<{ key: string; items: T[] }>({ key: '', items: [] });
  useEffect(() => {
    let alive = true;
    load()
      .then((items) => alive && setState({ key, items }))
      .catch(() => alive && setState({ key, items: [] }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the key says everything the loader depends on
  }, [key]);
  return state.key === key ? state.items : [];
}

export const useRegions = () => useList<PlaceOption>('regions', fetchRegions);

/** The sub-areas of every region given, each tagged with its region. */
export const useSubAreas = (regionIds: number[]) =>
  useList<SubAreaWithRegion>(`sub-areas:${regionIds.join(',')}`, () =>
    Promise.all(regionIds.map((id) => fetchSubAreas(id).then((list) => list.map((s) => ({ ...s, regionId: id }))))).then((l) => l.flat()),
  );

export const placeName = (p: PlaceOption, language: Language) => (language === 'ar' ? p.ar : p.en);

export type RegionOption = PlaceOption;
export type SubAreaWithRegion = SubAreaOption & { regionId: number };
