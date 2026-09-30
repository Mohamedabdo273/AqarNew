import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/** Up to 4 units side by side (1 main unit + 3 more units to compare). */
export const COMPARE_MAX = 4;
const STORAGE_KEY = 'wahdety_compare_v1';

interface CompareContextType {
  compareIds: string[];
  isCompared: (id: string) => boolean;
  /** Adds or removes; returns false when the list is already full. */
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
  setCompareList: (ids: string[]) => void;
  addMultipleToCompare: (ids: string[]) => void;
  removeFromCompare: (id: string) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [compareIds, setCompareIdsState] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.slice(0, COMPARE_MAX) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
    } catch {
      /* convenience only */
    }
  }, [compareIds]);

  const isCompared = (id: string) => compareIds.includes(id);

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIdsState((prev) => prev.filter((x) => x !== id));
      return true;
    }
    if (compareIds.length >= COMPARE_MAX) return false;
    setCompareIdsState((prev) => [...prev, id]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareIdsState((prev) => prev.filter((x) => x !== id));
  };

  const setCompareList = (ids: string[]) => {
    const valid = Array.from(new Set(ids)).slice(0, COMPARE_MAX);
    setCompareIdsState(valid);
  };

  const addMultipleToCompare = (ids: string[]) => {
    setCompareIdsState((prev) => {
      const merged = Array.from(new Set([...prev, ...ids])).slice(0, COMPARE_MAX);
      return merged;
    });
  };

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        isCompared,
        toggleCompare,
        clearCompare: () => setCompareIdsState([]),
        setCompareList,
        addMultipleToCompare,
        removeFromCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return ctx;
};
