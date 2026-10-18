import React, { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { RealEstateUnit } from '../types';
import { useAuth } from './AuthContext';
import { INQUIRY_TYPE, addFavorite, fetchAllUnits, removeFavorite, sendInquiry, syncFavorites } from '../services/api';

export interface InquiryInput {
  unitId: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
  preferredDate?: string;
  inquiryType?: 'viewing' | 'price_check';
}

/** loading → first fetch in flight; error → the API couldn't be reached (the page offers a retry). */
export type UnitsStatus = 'loading' | 'ready' | 'error';

interface UnitsContextType {
  units: RealEstateUnit[];
  unitsStatus: UnitsStatus;
  reloadUnits: () => void;
  savedUnitIds: string[];
  toggleSaveUnit: (id: string) => void;
  isUnitSaved: (id: string) => boolean;
  /** Sends a viewing / price-check request for a unit. Throws ApiError on failure. */
  submitInquiry: (input: InquiryInput) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

// A guest's favorites live on the device; once signed in they're merged into the account and the server is the source of truth.
// The API ids are plain numbers ("12").
const STORAGE_KEY_SAVED = 'tanazul_saved_units_v1';

export const UnitsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, requireAuth } = useAuth();

  const [units, setUnits] = useState<RealEstateUnit[]>([]);
  const [unitsStatus, setUnitsStatus] = useState<UnitsStatus>('loading');

  const reloadUnits = useCallback(() => {
    setUnitsStatus('loading');
    fetchAllUnits()
      .then((list) => {
        setUnits(list);
        setUnitsStatus('ready');
      })
      .catch((e) => {
        console.error('Failed to load units from the API', e);
        setUnitsStatus('error');
      });
  }, []);

  useEffect(reloadUnits, [reloadUnits]);

  const [savedUnitIds, setSavedUnitIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedUnitIds));
    } catch (e) {
      console.error('Failed to persist bookmarks', e);
    }
  }, [savedUnitIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // On sign-in (or a restored session) merge what was saved as a guest into the account.
  // On sign-out the list is cleared, so the next person on this device doesn't see it.
  const syncedFor = useRef<string | null>(null);
  const savedRef = useRef(savedUnitIds);
  savedRef.current = savedUnitIds;
  useEffect(() => {
    const uid = user?.id ?? null;
    if (uid === syncedFor.current) return;
    const wasSignedIn = syncedFor.current !== null;
    syncedFor.current = uid;
    if (!uid) {
      if (wasSignedIn) setSavedUnitIds([]);
      return;
    }
    const local = savedRef.current.map(Number).filter((n) => Number.isInteger(n) && n > 0);
    syncFavorites(local)
      .then((ids) => {
        if (syncedFor.current !== uid) return;
        // Keep anything saved while the sync was in flight (e.g. the favorite that asked for the sign-in).
        const sent = new Set(local.map(String));
        setSavedUnitIds((prev) => [...new Set([...ids.map(String), ...prev.filter((id) => !sent.has(id))])]);
      })
      .catch((e) => console.error('Failed to sync favorites', e));
  }, [user?.id]);

  const isUnitSaved = (id: string) => savedUnitIds.includes(id);

  const doToggle = (id: string) => {
    const exists = savedUnitIds.includes(id);
    setSavedUnitIds((prev) => (exists ? prev.filter((item) => item !== id) : [...prev, id]));
    showToast(exists ? 'اتشالت من المفضلة' : 'اتحفظت في المفضلة');
    if (!user) return;
    // Optimistic: put it back if the server says no.
    (exists ? removeFavorite(Number(id)) : addFavorite(Number(id))).catch(() => {
      setSavedUnitIds((prev) => (exists ? [...prev, id] : prev.filter((item) => item !== id)));
      showToast('ما قدرناش نحفظ التغيير ده، جرّب تاني');
    });
  };
  // The sign-in sheet runs the save after login — through the ref, so it uses that render's state, not the guest's.
  const toggleRef = useRef(doToggle);
  toggleRef.current = doToggle;
  const toggleSaveUnit = (id: string) => {
    requireAuth(() => toggleRef.current(id));
  };

  const submitInquiry = async (input: InquiryInput) => {
    await sendInquiry({
      contactName: input.clientName,
      contactPhone: input.clientPhone,
      inquiryType: input.inquiryType === 'price_check' ? INQUIRY_TYPE.priceOffer : INQUIRY_TYPE.viewing,
      unitId: Number(input.unitId) || undefined,
      message: input.notes,
      preferredDate: input.preferredDate,
    });
    showToast('تمام! هنكلمك خلال يوم عمل');
  };

  return (
    <UnitsContext.Provider
      value={{
        units,
        unitsStatus,
        reloadUnits,
        savedUnitIds,
        toggleSaveUnit,
        isUnitSaved,
        submitInquiry,
        toastMessage,
        showToast
      }}
    >
      {children}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div role="status" className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] max-w-[calc(100%-2rem)] px-5 py-3.5 rounded-xl bg-brand text-white text-sm font-medium shadow-lift flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-brand-soft shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </UnitsContext.Provider>
  );
};

export const useUnits = (): UnitsContextType => {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
};
