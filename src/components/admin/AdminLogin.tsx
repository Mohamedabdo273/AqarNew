import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { adminSignIn, isDevLogin } from '../../services/adminAuth';
import { LogoMark } from '../Logo';

interface AdminLoginProps {
  onSignedIn: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSignedIn, onBackToSite }) => {
  const { tx, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Back = isRTL ? ArrowRight : ArrowLeft;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError(tx('اكتب الإيميل وكلمة السر', 'Enter your email and password'));
      return;
    }
    setBusy(true);
    setError(null);
    const result = await adminSignIn(email.trim(), password);
    setBusy(false);
    if (result === 'ok') onSignedIn();
    else if (result === 'invalid') setError(tx('الإيميل أو كلمة السر غلط', 'Wrong email or password'));
    else setError(tx('الدخول مش متاح دلوقتي. جرّب تاني بعد شوية.', "Sign-in isn't available right now. Try again shortly."));
  };

  return (
    <div className="min-h-screen bg-paper text-ink grid place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <LogoMark size={52} />
          <h1 className="mt-5 text-2xl font-extrabold">{tx('دخول الإدارة', 'Admin sign-in')}</h1>
          <p className="mt-1 text-sm text-muted">{tx('للفريق بس', 'Team only')}</p>
        </div>

        <form onSubmit={submit} noValidate className="mt-8 card p-6 space-y-4">
          <div>
            <label htmlFor="a-email" className="label">
              {tx('الإيميل', 'Email')}
            </label>
            <input
              id="a-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              dir="ltr"
              className={`field ${isRTL ? 'text-right' : 'text-left'}`}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="a-pass" className="label">
              {tx('كلمة السر', 'Password')}
            </label>
            <div className="relative">
              <input
                id="a-pass"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                dir="ltr"
                className={`field pe-12 ${isRTL ? 'text-right' : 'text-left'}`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? tx('إخفاء كلمة السر', 'Hide password') : tx('إظهار كلمة السر', 'Show password')}
                className="absolute inset-y-0 end-0 grid place-items-center w-12 text-muted hover:text-ink"
              >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-semibold text-danger">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full min-h-13">
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {tx('دخول', 'Sign in')}
          </button>

          {isDevLogin() && (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent">
              {tx('وضع التطوير: مفيش سيرفر دخول لسه، فأي بيانات هتدخلك. ده مش هيشتغل في النسخة النهائية.', 'Dev mode: no login server yet, so any details will work. This does not apply to production builds.')}
            </p>
          )}
        </form>

        <button onClick={onBackToSite} className="mt-6 mx-auto flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink min-h-11">
          <Back className="w-4 h-4" />
          {tx('رجوع للموقع', 'Back to the site')}
        </button>
      </div>
    </div>
  );
};
