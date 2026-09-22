import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Building2,
  TrendingUp,
  AlertCircle
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess
}) => {
  const { login, register, loginWithDemo } = useAuth();
  const { t, language, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('seller');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginEmail) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setSuccessMessage(t('loginSuccess'));
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        setSuccessMessage('');
      }, 900);
    } catch {
      setErrorMessage(language === 'ar' ? 'فشل تسجيل الدخول. حاول مجدداً.' : 'Failed to log in. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!registerName || !registerEmail || !registerPhone) {
      setErrorMessage(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (registerPassword && registerPassword !== confirmPassword) {
      setErrorMessage(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        role: registerRole,
        password: registerPassword
      });
      setSuccessMessage(t('registerSuccess'));
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        setSuccessMessage('');
      }, 900);
    } catch {
      setErrorMessage(language === 'ar' ? 'حدث خطأ أثناء التسجيل.' : 'Error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    loginWithDemo(role);
    const roleLabels = {
      seller: language === 'ar' ? 'بائع وحدة' : 'Seller',
      buyer: language === 'ar' ? 'مشتري' : 'Buyer',
      investor: language === 'ar' ? 'مستثمر VIP' : 'VIP Investor'
    };
    setSuccessMessage(
      language === 'ar' 
        ? `تم الدخول فوراً بحساب تجريبي كـ (${roleLabels[role]})!` 
        : `Logged in instantly with Demo account as (${roleLabels[role]})!`
    );
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
      setSuccessMessage('');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Top Header Banner */}
        <div className="bg-[#0f172a] text-white p-6 relative">
          <button 
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer`}
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-md bg-[#0f766e] flex items-center justify-center text-sm font-bold text-white">
              ⧉
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2dd4bf]">
              {t('noOverpriceBadge')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {activeTab === 'login' ? t('tabLogin') : t('tabRegister')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
            {t('authModalSub')}
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-800/80 rounded-xl mt-5 border border-white/10">
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'login' 
                  ? 'bg-[#0f766e] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{t('tabLogin')}</span>
            </button>

            <button
              onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'register' 
                  ? 'bg-[#0f766e] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('tabRegister')}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Alerts */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1-Click Fast Demo Accounts */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('demoAccountsTitle')}</span>
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                1-Click
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('seller')}
                className="p-2 rounded-lg bg-white hover:bg-[#0f766e]/10 border border-slate-200 hover:border-[#0f766e] text-[#0f172a] hover:text-[#0f766e] text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#0f766e]" />
                <span>{t('tryAsSeller')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('buyer')}
                className="p-2 rounded-lg bg-white hover:bg-[#0f766e]/10 border border-slate-200 hover:border-[#0f766e] text-[#0f172a] hover:text-[#0f766e] text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
              >
                <User className="w-4 h-4 text-sky-600" />
                <span>{t('tryAsBuyer')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('investor')}
                className="p-2 rounded-lg bg-white hover:bg-[#0f766e]/10 border border-slate-200 hover:border-[#0f766e] text-[#0f172a] hover:text-[#0f766e] text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>{t('tryAsInvestor')}</span>
              </button>
            </div>
          </div>

          {/* Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] outline-none transition-all`}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {t('passwordLabel')}
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert(language === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset link sent to your email.'); }} className="text-[11px] text-[#0f766e] hover:underline font-semibold">
                    {t('forgotPassword')}
                  </a>
                </div>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] outline-none transition-all`}
                    defaultValue="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#0f766e] focus:ring-[#0f766e]"
                  />
                  <span>{t('rememberMe')}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>{t('loading')}</span>
                ) : (
                  <>
                    <span>{t('signInBtn')}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('fullNameLabel')}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder={t('fullNamePlaceholder')}
                    className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] outline-none transition-all`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('emailLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder={t('emailPlaceholder')}
                      className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] outline-none transition-all`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('phoneLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder={t('phonePlaceholder')}
                      className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] outline-none transition-all`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('roleLabel')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label 
                    className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                      registerRole === 'seller'
                        ? 'border-[#0f766e] bg-[#0f766e]/10 text-[#0f766e]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="seller"
                      checked={registerRole === 'seller'}
                      onChange={() => setRegisterRole('seller')}
                      className="sr-only"
                    />
                    <Building2 className="w-4 h-4 shrink-0 text-[#0f766e]" />
                    <span className="leading-tight">{t('tryAsSeller').replace('دخول كـ ', '').replace('Demo as ', '')}</span>
                  </label>

                  <label 
                    className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                      registerRole === 'buyer'
                        ? 'border-[#0f766e] bg-[#0f766e]/10 text-[#0f766e]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={registerRole === 'buyer'}
                      onChange={() => setRegisterRole('buyer')}
                      className="sr-only"
                    />
                    <User className="w-4 h-4 shrink-0 text-sky-600" />
                    <span className="leading-tight">{t('tryAsBuyer').replace('دخول كـ ', '').replace('Demo as ', '')}</span>
                  </label>

                  <label 
                    className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                      registerRole === 'investor'
                        ? 'border-[#0f766e] bg-[#0f766e]/10 text-[#0f766e]'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="investor"
                      checked={registerRole === 'investor'}
                      onChange={() => setRegisterRole('investor')}
                      className="sr-only"
                    />
                    <TrendingUp className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="leading-tight">{t('tryAsInvestor').replace('دخول كـ ', '').replace('Demo as ', '')}</span>
                  </label>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('passwordLabel')}
                  </label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-[#0f766e] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('confirmPasswordLabel')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-[#0f766e] outline-none"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('termsAgree')}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>{t('loading')}</span>
                ) : (
                  <>
                    <span>{t('registerBtn')}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social & Switch info */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            {activeTab === 'login' ? (
              <>
                <span>{t('dontHaveAccount')}</span>
                <button
                  onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
                  className="font-bold text-[#0f766e] hover:underline cursor-pointer"
                >
                  {t('tabRegister')}
                </button>
              </>
            ) : (
              <>
                <span>{t('alreadyHaveAccount')}</span>
                <button
                  onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                  className="font-bold text-[#0f766e] hover:underline cursor-pointer"
                >
                  {t('tabLogin')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
