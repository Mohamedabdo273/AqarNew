import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { RealEstateUnit } from '../types';
import { useAuth } from './AuthContext';
import { CompoundDto, DeveloperDto, RegionDto, UnitStatsDto } from '../api/dto';
import { lookupsApi, unitsApi, UnitSearchParams, sellerApi, CreateUnitBody } from '../api/endpoints';
import { mapUnit } from '../api/mappers';

export interface InquiryInput {
  unitId: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
  preferredDate?: string;
  inquiryType?: 'viewing' | 'official_exit' | 'price_check';
}

const INQUIRY_TYPE_TO_API: Record<string, number> = {
  viewing: 2,
  price_check: 3,
  official_exit: 1,
};

interface UnitsContextType {
  units: RealEstateUnit[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNext: boolean;

  stats: UnitStatsDto | null;
  regions: RegionDto[];
  developers: DeveloperDto[];
  compounds: CompoundDto[];

  /** بحث من السيرفر — الفلترة والترتيب بيتعملوا في الداتابيز مش في المتصفح */
  search: (params: UnitSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  loadCompounds: (developerId?: number, regionId?: number) => Promise<void>;

  getUnitByCode: (publicCode: string) => Promise<RealEstateUnit>;

  toggleSaveUnit: (id: string) => void;
  isUnitSaved: (id: string) => boolean;
  savedUnitIds: string[];

  submitInquiry: (input: InquiryInput) => Promise<void>;
  createUnit: (body: CreateUnitBody, documents?: { docType: number; file: File }[]) => Promise<number>;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export const UnitsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, toggleSaveUnit: authToggleSave, isUnitSaved: authIsSaved, savedUnitIds } = useAuth();

  const [units, setUnits] = useState<RealEstateUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [lastParams, setLastParams] = useState<UnitSearchParams>({});
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState<UnitStatsDto | null>(null);
  const [regions, setRegions] = useState<RegionDto[]>([]);
  const [developers, setDevelopers] = useState<DeveloperDto[]>([]);
  const [compounds, setCompounds] = useState<CompoundDto[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const search = useCallback(async (params: UnitSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await unitsApi.search({ ...params, page: 1, pageSize: params.pageSize ?? 24 });
      setUnits(result.items.map((dto) => mapUnit(dto)));
      setTotalCount(result.totalCount);
      setHasNext(result.hasNext);
      setLastParams(params);
      setPage(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'مقدرناش نجيب الوحدات.');
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasNext || loading) return;
    setLoading(true);
    try {
      const next = page + 1;
      const result = await unitsApi.search({ ...lastParams, page: next, pageSize: lastParams.pageSize ?? 24 });
      setUnits((prev) => [...prev, ...result.items.map((dto) => mapUnit(dto))]);
      setHasNext(result.hasNext);
      setPage(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'مقدرناش نجيب باقي الوحدات.');
    } finally {
      setLoading(false);
    }
  }, [hasNext, loading, page, lastParams]);

  const loadCompounds = useCallback(async (developerId?: number, regionId?: number) => {
    try {
      setCompounds(await lookupsApi.compounds(developerId, regionId));
    } catch {
      setCompounds([]);
    }
  }, []);

  // التحميل الأول: المراجع + أول صفحة وحدات + الإحصائيات
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [regionsRes, developersRes, statsRes] = await Promise.allSettled([
        lookupsApi.regions(),
        lookupsApi.developers(),
        unitsApi.stats(),
      ]);

      if (cancelled) return;
      if (regionsRes.status === 'fulfilled') setRegions(regionsRes.value);
      if (developersRes.status === 'fulfilled') setDevelopers(developersRes.value);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    })();

    search({ sortBy: 'newest' });
    return () => {
      cancelled = true;
    };
  }, [search]);

  const getUnitByCode = useCallback(async (publicCode: string): Promise<RealEstateUnit> => {
    const detail = await unitsApi.byCode(publicCode);
    return mapUnit(detail, detail);
  }, []);

  const toggleSaveUnit = useCallback(
    (id: string) => {
      if (!isAuthenticated) {
        showToast('سجّل دخولك الأول عشان تحفظ الوحدة');
        return;
      }
      const wasSaved = authIsSaved(id);
      authToggleSave(id)
        .then(() => showToast(wasSaved ? 'تمت إزالة الوحدة من المفضلة' : 'تم حفظ الوحدة في قائمتك ❤️'))
        .catch(() => showToast('مقدرناش نحفظ الوحدة دلوقتي'));
    },
    [isAuthenticated, authIsSaved, authToggleSave, showToast]
  );

  const submitInquiry = useCallback(
    async (input: InquiryInput) => {
      const unitId = Number(input.unitId);
      if (!Number.isFinite(unitId)) throw new Error('الوحدة مش صحيحة.');

      await unitsApi.inquiry(unitId, {
        inquiryType: INQUIRY_TYPE_TO_API[input.inquiryType ?? 'viewing'] ?? 1,
        message: input.notes,
        preferredDate: input.preferredDate || undefined,
        guestName: isAuthenticated ? undefined : input.clientName,
        guestPhone: isAuthenticated ? undefined : input.clientPhone,
      });

      showToast('طلبك وصلنا — هنكلمك في أقرب وقت');
    },
    [isAuthenticated, showToast]
  );

  const createUnit = useCallback(
    async (body: CreateUnitBody, documents?: { docType: number; file: File }[]) => {
      const unitId = await sellerApi.createDraft(body);

      if (documents?.length) {
        for (const doc of documents) {
          await sellerApi.uploadDocument(unitId, doc.docType, doc.file);
        }
        // مفيش مراجعة من غير عقد وإيصال — الباك إند بيرفض التقديم من غيرهم
        await sellerApi.submit(unitId);
        showToast('وحدتك وصلت لفريق المراجعة ✅');
      } else {
        showToast('حفظنا وحدتك كمسودة — ارفع العقد والإيصالات عشان نراجعها');
      }

      return unitId;
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      units,
      loading,
      error,
      totalCount,
      hasNext,
      stats,
      regions,
      developers,
      compounds,
      search,
      loadMore,
      loadCompounds,
      getUnitByCode,
      toggleSaveUnit,
      isUnitSaved: authIsSaved,
      savedUnitIds,
      submitInquiry,
      createUnit,
      toastMessage,
      showToast,
    }),
    [
      units, loading, error, totalCount, hasNext, stats, regions, developers, compounds,
      search, loadMore, loadCompounds, getUnitByCode, toggleSaveUnit, authIsSaved, savedUnitIds,
      submitInquiry, createUnit, toastMessage, showToast,
    ]
  );

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
};

export const useUnits = () => {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error('useUnits must be used within a UnitsProvider');
  return ctx;
};
