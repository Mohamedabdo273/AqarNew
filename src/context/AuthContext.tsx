import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AccountUser,
  ApiError,
  AuthResponse,
  fetchMe,
  getSession,
  login as loginRequest,
  logoutSession,
  onSessionChange,
  register,
  requestOtp,
  resetPassword as resetPasswordRequest,
  setSession,
  startRegistration,
} from '../services/api';

interface AuthContextType {
  user: AccountUser | null;
  isAuthenticated: boolean;
  /** True while a saved session is being checked on load. */
  checking: boolean;
  /** Phone + password. Throws ApiError (401 for a wrong phone or password). */
  login: (phone: string, password: string) => Promise<void>;
  /** Sign-up step 1: checks the details and sends a code to the phone. 409 if the phone already has an account. */
  startSignUp: (fullName: string, phone: string, password: string) => Promise<void>;
  /** Sign-up step 2: the code from the phone creates the account and signs in. */
  finishSignUp: (fullName: string, phone: string, password: string, code: string) => Promise<void>;
  /** "Forgot password", step 1: sends a code to the phone. */
  sendResetCode: (phone: string) => Promise<void>;
  /** "Forgot password", step 2: the code sets the new password and signs in. */
  resetPassword: (phone: string, code: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Opens the sign-in sheet from anywhere (navbar, saving a favorite, …). */
  openSignIn: () => void;
  closeSignIn: () => void;
  signInOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const signIn = (auth: AuthResponse) => {
    setSession({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, expiresAt: auth.expiresAt });
    setUser(auth.user);
  };

  const login = async (phone: string, password: string) => signIn(await loginRequest(phone, password));

  const startSignUp = async (fullName: string, phone: string, password: string) => {
    await startRegistration({ fullName, phone, password });
  };

  const finishSignUp = async (fullName: string, phone: string, password: string, code: string) =>
    signIn(await register({ fullName, phone, password, code }));

  const sendResetCode = async (phone: string) => {
    await requestOtp(phone);
  };

  const resetPassword = async (phone: string, code: string, newPassword: string) =>
    signIn(await resetPasswordRequest({ phone, code, newPassword }));

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
      value={{ user, isAuthenticated: !!user, checking, login, startSignUp, finishSignUp, sendResetCode, resetPassword, logout, openSignIn, closeSignIn, signInOpen }}
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
