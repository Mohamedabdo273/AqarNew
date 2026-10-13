import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { ApiError, errorText } from '../services/api';
import { isValidPhone } from '../lib/sellForm';

const RESEND_SECONDS = 60;
const MIN_PASSWORD = 8;

type Mode = 'login' | 'register' | 'register-code' | 'forgot' | 'forgot-code';

/**
 * Visitor accounts: log in with phone + password; sign up with name, phone, password and confirmation
 * (the phone is proven once by a code); "forgot password" sends a code to set a new one.
 */
export const SignInSheet: React.FC = () => {
  const { tx, isRTL } = useLanguage();
  const { login, startSignUp, finishSignUp, sendResetCode, resetPassword, closeSignIn } = useAuth();
  const { showToast } = useUnits();
  const Back = isRTL ? ArrowRight : ArrowLeft;

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [wait, setWait] = useState(0);

  const cleanPhone = phone.replace(/\s/g, '');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSignIn();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [closeSignIn]);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const go = (m: Mode) => {
    setMode(m);
    setError('');
    setCode('');
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  // Sends a code and moves to the code step. A "wait" (429) means one went out moments ago — let them type it.
  const sendCode = (send: () => Promise<void>, next: Mode) =>
    run(async () => {
      try {
        await send();
      } catch (e) {
        if (e instanceof ApiError && e.status === 429) go(next);
        throw e;
      }
      go(next);
      setWait(RESEND_SECONDS);
    });

  const done = (msg: string) => {
    showToast(msg);
    closeSignIn();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const phoneOk = isValidPhone(cleanPhone);
    const pwOk = password.length >= MIN_PASSWORD;
    const fail = (m: string) => setError(m);

    if (mode === 'login') {
      if (!phoneOk) return fail(tx('اكتب رقم موبايل مصري صحيح، 11 رقم', 'Enter a valid 11-digit Egyptian mobile'));
      if (!password) return fail(tx('اكتب كلمة السر', 'Enter your password'));
      return run(async () => {
        await login(cleanPhone, password);
        done(tx('أهلاً بيك 👋', 'Welcome back 👋'));
      });
    }
    if (mode === 'register' || mode === 'forgot-code') {
      if (mode === 'register' && name.trim().length < 2) return fail(tx('اكتب اسمك', 'Enter your name'));
      if (mode === 'register' && !phoneOk) return fail(tx('اكتب رقم موبايل مصري صحيح، 11 رقم', 'Enter a valid 11-digit Egyptian mobile'));
      if (!pwOk) return fail(tx(`كلمة السر لازم تكون ${MIN_PASSWORD} حروف على الأقل`, `Password must be at least ${MIN_PASSWORD} characters`));
      if (password !== confirm) return fail(tx('كلمة السر وتأكيدها مش زي بعض', "Passwords don't match"));
    }
    if (mode === 'register') return sendCode(() => startSignUp(name.trim(), cleanPhone, password), 'register-code');
    if (mode === 'forgot') {
      if (!phoneOk) return fail(tx('اكتب رقم موبايل مصري صحيح، 11 رقم', 'Enter a valid 11-digit Egyptian mobile'));
      return sendCode(() => sendResetCode(cleanPhone), 'forgot-code');
    }
    if (!/^\d{4,8}$/.test(code.trim())) return fail(tx('اكتب الكود اللي وصلك', 'Enter the code you received'));
    if (mode === 'register-code')
      return run(async () => {
        await finishSignUp(name.trim(), cleanPhone, password, code.trim());
        done(tx(`أهلاً ${name.trim()}`, `Welcome, ${name.trim()}`));
      });
    return run(async () => {
      await resetPassword(cleanPhone, code.trim(), password);
      done(tx('اتغيّرت كلمة السر ودخلت', 'Password changed — you’re in'));
    });
  };

  const titles: Record<Mode, string> = {
    login: tx('تسجيل الدخول', 'Log in'),
    register: tx('حساب جديد', 'Create account'),
    'register-code': tx('أكّد رقمك', 'Confirm your number'),
    forgot: tx('نسيت كلمة السر', 'Forgot password'),
    'forgot-code': tx('كلمة سر جديدة', 'New password'),
  };
  const buttons: Record<Mode, string> = {
    login: tx('دخول', 'Log in'),
    register: tx('كمّل', 'Continue'),
    'register-code': tx('اعمل الحساب', 'Create account'),
    forgot: tx('ابعتلي كود', 'Send me a code'),
    'forgot-code': tx('احفظ وادخل', 'Save and log in'),
  };

  const pwInput = (id: string, value: string, set: (v: string) => void, label: string, autoComplete: string) => (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPw ? 'text' : 'password'}
          value={value}
          onChange={(e) => {
            set(e.target.value);
            setError('');
          }}
          autoComplete={autoComplete}
          dir="ltr"
          className={`field ${isRTL ? 'text-right pl-11' : 'text-left pr-11'}`}
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          aria-label={showPw ? tx('اخفي كلمة السر', 'Hide password') : tx('اظهر كلمة السر', 'Show password')}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-muted hover:text-ink`}
        >
          {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  const phoneInput = (
    <div>
      <label htmlFor="signin-phone" className="label">
        {tx('رقم الموبايل', 'Mobile')}
      </label>
      <input
        id="signin-phone"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setError('');
        }}
        inputMode="tel"
        dir="ltr"
        placeholder="01xxxxxxxxx"
        autoComplete="tel"
        className={`field ${isRTL ? 'text-right' : 'text-left'}`}
      />
    </div>
  );

  const codeStep = mode === 'register-code' || mode === 'forgot-code';

  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="signin-title">
      <div className="absolute inset-0 bg-ink/50" onClick={closeSignIn} />
      <form onSubmit={submit} noValidate className="relative w-full sm:max-w-sm max-h-[92vh] overflow-y-auto bg-surface rounded-t-card sm:rounded-card p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1">
            {mode !== 'login' && (
              <button
                type="button"
                onClick={() => go(mode === 'register-code' ? 'register' : mode === 'forgot-code' ? 'forgot' : 'login')}
                aria-label={tx('رجوع', 'Back')}
                className="grid place-items-center w-9 h-9 -ms-2 rounded-full hover:bg-paper"
              >
                <Back className="w-5 h-5" />
              </button>
            )}
            <p id="signin-title" className="font-display text-xl font-bold text-ink">
              {titles[mode]}
            </p>
          </div>
          <button type="button" onClick={closeSignIn} aria-label={tx('إغلاق', 'Close')} className="grid place-items-center w-10 h-10 rounded-full hover:bg-paper -mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {mode === 'login' && (
            <>
              {phoneInput}
              {pwInput('signin-pw', password, setPassword, tx('كلمة السر', 'Password'), 'current-password')}
              <button type="button" onClick={() => go('forgot')} className="text-sm font-semibold text-brand hover:underline">
                {tx('نسيت كلمة السر؟', 'Forgot password?')}
              </button>
            </>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="signin-name" className="label">
                  {tx('الاسم', 'Name')}
                </label>
                <input id="signin-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="field" />
              </div>
              {phoneInput}
              {pwInput('signin-pw', password, setPassword, tx('كلمة السر', 'Password'), 'new-password')}
              {pwInput('signin-pw2', confirm, setConfirm, tx('تأكيد كلمة السر', 'Confirm password'), 'new-password')}
              <p className="text-xs text-muted">{tx(`${MIN_PASSWORD} حروف على الأقل. هنبعتلك كود مرة واحدة نتأكد بيه من رقمك.`, `At least ${MIN_PASSWORD} characters. We'll send one code to confirm your number.`)}</p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <p className="text-sm text-muted">{tx('اكتب رقمك وهنبعتلك كود تعمل بيه كلمة سر جديدة.', "Enter your number and we'll send a code to set a new password.")}</p>
              {phoneInput}
            </>
          )}

          {codeStep && (
            <>
              <p className="text-sm text-muted">
                {tx('بعتنا كود للرقم', 'We sent a code to')}{' '}
                <span className="num font-semibold text-ink" dir="ltr">
                  {cleanPhone}
                </span>
              </p>
              <div>
                <label htmlFor="signin-code" className="label">
                  {tx('الكود', 'Code')}
                </label>
                <input
                  id="signin-code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 8));
                    setError('');
                  }}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  dir="ltr"
                  placeholder="••••"
                  autoFocus
                  className="field num text-center text-2xl tracking-[0.4em]"
                />
              </div>
              {mode === 'forgot-code' && (
                <>
                  {pwInput('signin-pw', password, setPassword, tx('كلمة السر الجديدة', 'New password'), 'new-password')}
                  {pwInput('signin-pw2', confirm, setConfirm, tx('تأكيد كلمة السر', 'Confirm password'), 'new-password')}
                </>
              )}
              <button
                type="button"
                disabled={wait > 0 || busy}
                onClick={() =>
                  mode === 'register-code'
                    ? sendCode(() => startSignUp(name.trim(), cleanPhone, password), 'register-code')
                    : sendCode(() => sendResetCode(cleanPhone), 'forgot-code')
                }
                className="text-sm font-semibold text-brand disabled:text-muted"
              >
                {wait > 0 ? tx(`ابعت كود تاني بعد ${wait} ثانية`, `Resend in ${wait}s`) : tx('ابعت كود تاني', 'Resend code')}
              </button>
            </>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full mt-6 min-h-13">
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : buttons[mode]}
        </button>

        {(mode === 'login' || mode === 'register') && (
          <p className="mt-4 text-center text-sm text-muted">
            {mode === 'login' ? tx('معندكش حساب؟', "Don't have an account?") : tx('عندك حساب؟', 'Have an account?')}{' '}
            <button type="button" onClick={() => go(mode === 'login' ? 'register' : 'login')} className="font-semibold text-brand hover:underline">
              {mode === 'login' ? tx('اعمل حساب', 'Create one') : tx('ادخل', 'Log in')}
            </button>
          </p>
        )}
      </form>
    </div>
  );
};
