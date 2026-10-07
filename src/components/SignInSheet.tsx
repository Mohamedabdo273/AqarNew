import React, { useEffect, useRef, useState } from 'react';
import { X, MessageCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { ApiError, errorText } from '../services/api';
import { isValidPhone } from '../lib/sellForm';

const RESEND_SECONDS = 60;

/**
 * Sign-in for visitors: phone → WhatsApp code → (first time only) name.
 * No passwords. The account keeps favorites and sell requests across devices.
 */
export const SignInSheet: React.FC = () => {
  const { tx, isRTL } = useLanguage();
  const { sendCode, confirmCode, saveName, closeSignIn } = useAuth();
  const { showToast } = useUnits();
  const Back = isRTL ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState<'phone' | 'code' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [wait, setWait] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

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

  // Resend countdown.
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

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

  const toCodeStep = () => {
    setStep('code');
    setCode('');
    setWait(RESEND_SECONDS);
    setTimeout(() => codeRef.current?.focus(), 50);
  };

  const send = () =>
    run(async () => {
      try {
        await sendCode(cleanPhone);
      } catch (e) {
        // "Wait before another code" means one was sent moments ago — let them type it, keeping the message.
        if (step === 'phone' && e instanceof ApiError && e.status === 429) toCodeStep();
        throw e;
      }
      toCodeStep();
    });

  const verify = () =>
    run(async () => {
      const { needsName } = await confirmCode(cleanPhone, code.trim());
      if (needsName) return setStep('name');
      showToast(tx('أهلاً بيك تاني 👋', 'Welcome back 👋'));
      closeSignIn();
    });

  const finish = () =>
    run(async () => {
      await saveName(name.trim());
      showToast(tx(`أهلاً ${name.trim()}`, `Welcome, ${name.trim()}`));
      closeSignIn();
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (step === 'phone') {
      if (!isValidPhone(cleanPhone)) return setError(tx('اكتب رقم موبايل مصري صحيح، 11 رقم', 'Enter a valid 11-digit Egyptian mobile'));
      send();
    } else if (step === 'code') {
      if (!/^\d{4,8}$/.test(code.trim())) return setError(tx('اكتب الكود اللي وصلك', 'Enter the code you received'));
      verify();
    } else {
      if (name.trim().length < 2) return setError(tx('اكتب اسمك', 'Enter your name'));
      finish();
    }
  };

  const titles = {
    phone: tx('سجّل دخول', 'Sign in'),
    code: tx('اكتب الكود', 'Enter the code'),
    name: tx('اسمك إيه؟', "What's your name?"),
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="signin-title">
      <div className="absolute inset-0 bg-ink/50" onClick={closeSignIn} />
      <form onSubmit={submit} noValidate className="relative w-full sm:max-w-sm bg-surface rounded-t-card sm:rounded-card p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1">
            {step === 'code' && (
              <button type="button" onClick={() => setStep('phone')} aria-label={tx('رجوع', 'Back')} className="grid place-items-center w-9 h-9 -ms-2 rounded-full hover:bg-paper">
                <Back className="w-5 h-5" />
              </button>
            )}
            <p id="signin-title" className="font-display text-xl font-bold text-ink">
              {titles[step]}
            </p>
          </div>
          <button type="button" onClick={closeSignIn} aria-label={tx('إغلاق', 'Close')} className="grid place-items-center w-10 h-10 rounded-full hover:bg-paper -mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'phone' && (
          <>
            <p className="mt-2 text-sm text-muted">
              {tx('من غير باسورد. هنبعتلك كود على موبايلك، وتشوف مفضلتك وطلباتك من أي جهاز.', "No password. We'll send a code to your phone, and your saved units and requests follow you to any device.")}
            </p>
            <label htmlFor="signin-phone" className="label mt-5">
              {tx('موبايل (واتساب)', 'Mobile (WhatsApp)')}
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
              autoFocus
              className={`field ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </>
        )}

        {step === 'code' && (
          <>
            <p className="mt-2 text-sm text-muted">
              {tx('بعتنا كود للرقم', 'We sent a code to')}{' '}
              <span className="num font-semibold text-ink" dir="ltr">
                {cleanPhone}
              </span>
            </p>
            <label htmlFor="signin-code" className="label mt-5">
              {tx('الكود', 'Code')}
            </label>
            <input
              id="signin-code"
              ref={codeRef}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 8));
                setError('');
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              dir="ltr"
              placeholder="••••"
              className="field num text-center text-2xl tracking-[0.4em]"
            />
            <button type="button" onClick={send} disabled={wait > 0 || busy} className="mt-3 text-sm font-semibold text-brand disabled:text-muted">
              {wait > 0 ? tx(`ابعت كود تاني بعد ${wait} ثانية`, `Resend in ${wait}s`) : tx('ابعت كود تاني', 'Resend code')}
            </button>
          </>
        )}

        {step === 'name' && (
          <>
            <p className="mt-2 text-sm text-muted">{tx('أول مرة تدخل — عشان المستشار يعرف يكلمك باسمك.', 'First time here — so your advisor knows what to call you.')}</p>
            <label htmlFor="signin-name" className="label mt-5">
              {tx('اسمك', 'Your name')}
            </label>
            <input id="signin-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" autoFocus className="field" />
          </>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full mt-6 min-h-13">
          {busy ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : step === 'phone' ? (
            <>
              <MessageCircle className="w-5 h-5" />
              {tx('ابعتلي الكود', 'Send me the code')}
            </>
          ) : step === 'code' ? (
            tx('ادخل', 'Sign in')
          ) : (
            tx('تمام', 'Done')
          )}
        </button>
        {step === 'name' && (
          <button type="button" onClick={closeSignIn} className="w-full mt-2 min-h-11 text-sm font-semibold text-muted hover:text-ink">
            {tx('بعدين', 'Later')}
          </button>
        )}
      </form>
    </div>
  );
};
