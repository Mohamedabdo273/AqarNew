import { useEffect, useState } from 'react';
import { LookupOption, fetchLookups } from '../services/api';
import { PROPERTY_CATEGORIES, TYPES_BY_CATEGORY } from './unitHelpers';

/*
 * النشاط ونوع الوحدة: جايين من الـ API (GET /api/lookups) — هو اللي بيتحقق من الطلب، وقيمه الإنجليزي هي قيم الـ CRM.
 * كده التعديل بيتعمل في الباك إند بس (Catalog.cs) ويبان هنا من غير ما الموقع يتنشر تاني.
 * القايمة اللي في unitHelpers بتظهر لحد ما الرد يوصل، أو لو الـ API ما ردّش.
 */

export interface UnitTypeLists {
  categories: LookupOption[];
  typesByCategory: Record<string, LookupOption[]>;
  /** Every type once (residential and hotel share theirs), in category order — for filters that don't need the category. */
  allTypes: LookupOption[];
  /** The types under the given categories; every type when none is given. */
  typesFor: (categories: string[]) => LookupOption[];
  /** The category a type falls under (the first one: a flat is "سكني" before "فندقي"); '' when unknown. */
  categoryOfType: (type: string) => string;
  /** True once the lists came from the API (false = the built-in copy). */
  fromApi: boolean;
}

function dedupe(list: LookupOption[]) {
  const seen = new Set<string>();
  return list.filter((t) => !seen.has(t.ar) && seen.add(t.ar));
}

function build(categories: LookupOption[], typesByCategory: Record<string, LookupOption[]>, fromApi: boolean): UnitTypeLists {
  const typesFor = (picked: string[]) =>
    dedupe((picked.length ? picked : categories.map((c) => c.ar)).flatMap((c) => typesByCategory[c] ?? []));
  return {
    categories,
    typesByCategory,
    allTypes: typesFor([]),
    typesFor,
    categoryOfType: (type) => categories.find((c) => (typesByCategory[c.ar] ?? []).some((t) => t.ar === type))?.ar ?? '',
    fromApi,
  };
}

const BUILT_IN = build(PROPERTY_CATEGORIES, TYPES_BY_CATEGORY, false);

/** The API's answer, shared by every component on the page once it arrives. */
let fromApi: UnitTypeLists | null = null;

export function useUnitTypeLists(): UnitTypeLists {
  const [lists, setLists] = useState<UnitTypeLists>(fromApi ?? BUILT_IN);
  useEffect(() => {
    if (fromApi) return;
    let alive = true;
    fetchLookups()
      .then((l) => {
        // Only a usable answer replaces the built-in lists.
        if (l?.categories?.length && l.typesByCategory) {
          fromApi ??= build(l.categories, l.typesByCategory, true);
          if (alive) setLists(fromApi);
        }
      })
      .catch(() => {
        /* keep the built-in lists */
      });
    return () => {
      alive = false;
    };
  }, []);
  return lists;
}
