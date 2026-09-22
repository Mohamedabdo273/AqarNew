import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { tokenStore, setSessionExpiredHandler } from '../api/client';
import { authApi, meApi } from '../api/endpoints';
import { UserDto } from '../api/dto';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  /** بيبعت كود تحقق على واتساب. نفس الخطوة للتسجيل والدخول. */
  requestOtp: (phone: string) => Promise<void>;
  /** بيأكد الكود. الاسم مطلوب بس لو الرقم جديد. */
  verifyOtp: (phone: string, code: string, fullName?: string, role?: UserRole) => Promise<void>;

  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;

  toggleSaveUnit: (unitId: string) => Promise<void>;
  isUnitSaved: (unitId: string) => boolean;
  savedUnitIds: string[];

  updateBudget: (cash?: number, installment?: number, regionIds?: number[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_BY_NUMBER: Record<number, UserRole> = {
  1: 'buyer',
  2: 'seller',
  3: 'buyer',
  4: 'buyer',
  5: 'buyer',
  6: 'buyer',
};

const ROLE_TO_NUMBER: Record<UserRole, number> = {
  buyer: 1,
  seller: 2,
  investor: 1,
};

function mapUser(dto: UserDto, savedUnits: string[]): User {
  return {
    id: dto.id,
    name: dto.fullName,
    email: dto.email ?? '',
    phone: dto.phone,
    role: ROLE_BY_NUMBER[dto.role] ?? 'buyer',
    savedUnits,
    myUnits: [],
    inquiries: [],
    joinedDate: dto.createdAt,
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedUnitIds, setSavedUnitIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = useCallback(async (): Promise<string[]> => {
    try {
      const saved = await meApi.saved();
      const ids = saved.map((u) => String(u.id));
      setSavedUnitIds(ids);
      return ids;
    } catch {
      return [];
    }
  }, []);

  const refreshMe = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      const ids = await loadSaved();
      setUser(mapUser(me, ids));
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadSaved]);

  // استرجاع الجلسة عند فتح الموقع
  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  // لو التوكن خلص ومفيش تجديد، نظّف الحالة بدل ما الموقع يفضل فاكر إن فيه مستخدم
  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setSavedUnitIds([]);
    });
  }, []);

  const requestOtp = useCallback(async (phone: string) => {
    await authApi.requestOtp(phone);
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, code: string, fullName?: string, role?: UserRole) => {
      const res = await authApi.verifyOtp(
        phone,
        code,
        fullName,
        role ? ROLE_TO_NUMBER[role] : undefined
      );
      tokenStore.set(res.accessToken, res.refreshToken);
      const ids = await loadSaved();
      setUser(mapUser(res.user, ids));
    },
    [loadSaved]
  );

  const logout = useCallback(async () => {
    const refresh = tokenStore.getRefresh();
    if (refresh) {
      try {
        await authApi.logout(refresh);
      } catch {
        /* حتى لو السيرفر مارجعش، بنمسح الجلسة محليًا */
      }
    }
    tokenStore.clear();
    setUser(null);
    setSavedUnitIds([]);
  }, []);

  const isUnitSaved = useCallback((unitId: string) => savedUnitIds.includes(unitId), [savedUnitIds]);

  const toggleSaveUnit = useCallback(
    async (unitId: string) => {
      const numericId = Number(unitId);
      if (!Number.isFinite(numericId)) return;

      // تحديث متفائل — بنرجّع الحالة لو السيرفر رفض
      const wasSaved = savedUnitIds.includes(unitId);
      setSavedUnitIds((prev) => (wasSaved ? prev.filter((id) => id !== unitId) : [...prev, unitId]));

      try {
        await meApi.toggleSave(numericId);
      } catch (e) {
        setSavedUnitIds((prev) => (wasSaved ? [...prev, unitId] : prev.filter((id) => id !== unitId)));
        throw e;
      }
    },
    [savedUnitIds]
  );

  const updateBudget = useCallback(
    async (cash?: number, installment?: number, regionIds?: number[]) => {
      const updated = await authApi.updateBudget(cash, installment, regionIds);
      setUser((prev) => (prev ? { ...prev, ...mapUser(updated, savedUnitIds) } : prev));
    },
    [savedUnitIds]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      requestOtp,
      verifyOtp,
      logout,
      refreshMe,
      toggleSaveUnit,
      isUnitSaved,
      savedUnitIds,
      updateBudget,
    }),
    [user, loading, requestOtp, verifyOtp, logout, refreshMe, toggleSaveUnit, isUnitSaved, savedUnitIds, updateBudget]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
