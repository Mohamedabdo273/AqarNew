import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AccountUser,
  ApiError,
  fetchMe,
  getSession,
  logoutSession,
  onSessionChange,
  requestOtp,
  setSession,
  updateMe,
  verifyOtp,
} from '../services/api';

interface AuthContextType {
  user: AccountUser | null;
  isAuthenticated: boolean;
  /** True while a saved session is being checked on load. */
  checking: boolean;
  /** Sends a WhatsApp code to the phone. Throws ApiError (e.g. too many requests). */
  sendCode: (phone: string) => Promise<void>;
  /** Signs in with the code. Returns whether the account still needs a name. */
  confirmCode: (phone: string, code: string) => Promise<{ needsName: boolean }>;
  saveName: (fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Opens the sign-in sheet from anywhere (navbar, saving a favorite, …). */
  openSignIn: () => void;
  closeSignIn: () => void;
  signInOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** A first-time account is created with the phone as its name until the visitor gives one. */
const hasNoName = (u: AccountUser) => !u.fullName.trim() || u.fullName.replace(/\D/g, '') === u.phone.replace(/\D/g, '');

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [checking, setChecking] = useState(() => !!getSession());
  const [signInOpen, setSignInOpen] = useState(false);

  // Restore a saved session: the API is the judge of whether it still works.
  useEffect(() => {
    // The old demo login kept a fake user here; it means nothing now.
    try {
      localStorage.removeItem('tanazul_user');
    } catch {
      /* ignore */
    }
    if (!getSession()) return;
    fetchMe()
      .then(setUser)
      .catch((e) => {
        // An expired/revoked session is cleared by the client; a network error keeps it for next time.
        if (e instanceof ApiError && e.status === 401) setSession(null);
      })
      .finally(() => setChecking(false));
  }, []);

  // A session that dies mid-use (refresh rejected) signs the visitor out here too.
  useEffect(() => onSessionChange((s) => !s && setUser(null)), []);

  const sendCode = async (phone: string) => {
    await requestOtp(phone);
  };

  const confirmCode = async (phone: string, code: string) => {
    const auth = await verifyOtp(phone, code);
    setSession({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, expiresAt: auth.expiresAt });
    setUser(auth.user);
    return { needsName: hasNoName(auth.user) };
  };

  const saveName = async (fullName: string) => {
    setUser(await updateMe({ fullName, email: user?.email ?? null }));
  };

  const logout = async () => {
    const s = getSession();
    if (s) await logoutSession(s.refreshToken).catch(() => undefined);
    setSession(null);
    setUser(null);
  };

  const openSignIn = useCallback(() => setSignInOpen(true), []);
  const closeSignIn = useCallback(() => setSignInOpen(false), []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, checking, sendCode, confirmCode, saveName, logout, openSignIn, closeSignIn, signInOpen }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
