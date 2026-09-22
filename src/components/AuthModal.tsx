import React, { useState } from 'react';
import {
  X,
  Phone,
  KeyRound,
  User,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onSuccess?: () => void;
}

/**
 * الدخول والتسجيل بقوا خطوة واحدة: رقم الموبايل + كود على واتساب.
 * مفيش باسوردات خالص — الرقم هو الهوية، وهو نفسه وسيلة التواصل في الصفقة.
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { requestOtp, verifyOtp } = useAuth();
  const { language, isRTL } = useLanguage();
  const ar = language === 'ar';

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [needsName, setNeedsName] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const reset = () => {
    setStep('phone');
    setCode('');
    setError('');
    setSuccess('');
    setNeedsName(false);
  };

  const closeAll = () => {
    reset();
    setPhone('');
    setFullName('');
    onClose();
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phone.replace(/\D/g, '').length < 10) {
      setError(ar ? 'اكتب رقم موبايل صحيح' : 'Enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      await requestOtp(phone);
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : ar ? 'مقدرناش نبعت الكود' : 'Could not send the code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length < 4) {
      setError(ar ? 'اكتب الكود اللي وصلك' : 'Enter the code you received');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(phone, code, needsName ? fullName : undefined, needsName ? role : undefined);
      setSuccess(ar ? 'أهلاً بيك 👋' : 'Welcome 👋');
      setTimeout(() => {
        closeAll();
        onSuccess?.();
      }, 800);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      // السيرفر بيطلب الاسم لو الرقم جديد — بنفتحله الحقل بدل رسالة خطأ مبهمة
      if (message.includes('اسمك')) {
        setNeedsName(true);
        setError(ar ? 'أول مرة تدخل — اكتب اسمك عشان نكمّل' : 'First time here — enter your name to continue');
      } else {
        setError(message || (ar ? 'الكود غلط' : 'Wrong code'));
      }
    } finally {
      setLoading(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <button
          onClick={closeAll}
          className="absolute top-4 left-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={ar ? 'إغلاق' : 'Close'}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-7">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f766e]">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-[#0f172a]">
              {step === 'phone'
                ? ar ? 'دخول أو تسجيل' : 'Sign in or register'
                : ar ? 'اكتب الكود' : 'Enter the code'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {step === 'phone'
                ? ar
                  ? 'رقم موبايلك بس — هيوصلك كود على واتساب'
                  : 'Just your mobile — a code will arrive on WhatsApp'
                : ar
                  ? `بعتنا كود على ${phone}`
                  : `We sent a code to ${phone}`}
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <p className="font-bold text-emerald-700">{success}</p>
            </div>
          ) : step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  {ar ? 'رقم الموبايل' : 'Mobile number'}
                </label>
                <div className="relative">
                  <Phone className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    autoFocus
                    className="w-full rounded-lg border border-slate-300 py-2.5 pr-10 pl-3 text-left focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  {ar ? 'انت عايز تعمل إيه؟' : 'What brings you here?'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <RoleButton active={role === 'buyer'} onClick={() => setRole('buyer')}>
                    {ar ? 'أشتري وحدة' : 'Buy a unit'}
                  </RoleButton>
                  <RoleButton active={role === 'seller'} onClick={() => setRole('seller')}>
                    {ar ? 'أبيع وحدتي' : 'Sell my unit'}
                  </RoleButton>
                </div>
              </div>

              {error && <ErrorText>{error}</ErrorText>}

              <SubmitButton loading={loading}>{ar ? 'ابعت الكود' : 'Send code'}</SubmitButton>

              <p className="text-center text-xs text-slate-400">
                {ar
                  ? 'بدخولك انت موافق على الشروط وسياسة الخصوصية'
                  : 'By continuing you agree to our terms and privacy policy'}
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {needsName && (
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    {ar ? 'اسمك بالكامل' : 'Full name'}
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoFocus
                      className="w-full rounded-lg border border-slate-300 py-2.5 pr-10 pl-3 focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  {ar ? 'كود التحقق' : 'Verification code'}
                </label>
                <div className="relative">
                  <KeyRound className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    placeholder="------"
                    autoFocus={!needsName}
                    className="w-full rounded-lg border border-slate-300 py-2.5 pr-10 pl-3 text-center text-lg tracking-[0.5em] focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] focus:outline-none"
                  />
                </div>
              </div>

              {error && <ErrorText>{error}</ErrorText>}

              <SubmitButton loading={loading}>{ar ? 'دخول' : 'Sign in'}</SubmitButton>

              <button
                type="button"
                onClick={reset}
                className="flex w-full items-center justify-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
              >
                <BackIcon className="h-4 w-4" />
                {ar ? 'تغيير الرقم' : 'Change number'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const RoleButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${
      active
        ? 'border-[#0f766e] bg-[#ecfdf5] text-[#0f766e]'
        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
    }`}
  >
    {children}
  </button>
);

const ErrorText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
    {children}
  </p>
);

const SubmitButton: React.FC<{ loading: boolean; children: React.ReactNode }> = ({
  loading,
  children,
}) => (
  <button
    type="submit"
    disabled={loading}
    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f766e] py-2.5 font-bold text-white transition hover:bg-[#115e56] disabled:cursor-not-allowed disabled:bg-[#0f766e]/50"
  >
    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    {children}
  </button>
);
