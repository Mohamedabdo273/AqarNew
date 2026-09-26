import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/** Up to this many units side by side — more doesn't fit a phone and stops being a comparison. */
export const COMPARE_MAX = 3;
const STORAGE_KEY = 'wahdety_compare_v1';

interface CompareContextType {
  compareIds: string[];
  isCompared: (id: string) => boolean;
  /** Adds or removes; returns false when the list is already full. */
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [compareIds, setCompareIds] = useState<string[]>(() => {
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
      setCompareIds((prev) => prev.filter((x) => x !== id));
      return true;
    }
    if (compareIds.length >= COMPARE_MAX) return false;
    setCompareIds((prev) => [...prev, id]);
    return true;
  };

  return (
    <CompareContext.Provider value={{ compareIds, isCompared, toggleCompare, clearCompare: () => setCompareIds([]) }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return ctx;
};
