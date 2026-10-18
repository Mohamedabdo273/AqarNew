import React, { useEffect, useRef } from 'react';
import { Loader2, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

/**
 * Pages that are an action in themselves (listing a unit, asking for a statement) need an account.
 * A guest sees this instead, and the sign-in sheet opens by itself once; after signing in the page shows.
 */
export const RequireAuth: React.FC<{ title: string; text: string; children: React.ReactNode }> = ({ title, text, children }) => {
  const { user, checking, openSignIn } = useAuth();
  const { tx } = useLanguage();
  const opened = useRef(false);

  useEffect(() => {
    if (checking || user || opened.current) return;
    opened.current = true;
    openSignIn();
  }, [checking, user, openSignIn]);

  if (user) return <>{children}</>;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24">
      {checking ? (
        <div className="grid place-items-center py-16 text-muted">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      ) : (
        <div className="card p-6 sm:p-10 text-center">
          <span className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-accent-soft text-accent">
            <Lock className="w-7 h-7" />
          </span>
          <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold text-ink">{title}</h1>
          <p className="mt-3 text-ink-soft leading-relaxed">{text}</p>
          <button onClick={openSignIn} className="btn-accent mt-7 min-h-12 px-7">
            <LogIn className="w-5 h-5" />
            {tx('سجّل دخول أو اعمل حساب', 'Log in or create an account')}
          </button>
        </div>
      )}
    </div>
  );
};
