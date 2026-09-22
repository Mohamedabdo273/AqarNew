import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Calculator, 
  PlusCircle, 
  PhoneCall, 
  Menu, 
  X, 
  Sparkles, 
  ArrowUpRight, 
  Globe, 
  ChevronDown,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';
import { BrandSuggestion, PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentBrand: BrandSuggestion;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onSelectBrand?: (brand: BrandSuggestion) => void;
  onOpenAddUnit: () => void;
  onOpenBrandShowcase?: () => void;
  onOpenAuthModal: (tab?: 'login' | 'register') => void;
  onOpenUserProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBrand,
  activePage,
  onNavigate,
  onOpenAddUnit,
  onOpenBrandShowcase,
  onOpenAuthModal,
  onOpenUserProfile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const navItemClass = (page: PageId) => `
    px-2 py-1.5 2xl:px-2.5 rounded-md text-xs 2xl:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap
    ${activePage === page 
      ? 'bg-[#0f766e]/10 text-[#0f766e]' 
      : 'text-[#0f172a] hover:text-[#0f766e] hover:bg-slate-50'
    }
  `;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] shadow-xs">
      {/* Top Bar matching Aqarexit country & hotline header */}
      <div className="bg-[#0f172a] text-slate-300 text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[11px] min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-white font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]"></span>
                {t('countryEgypt')}
              </span>
              <span className="text-slate-400 hidden xs:inline">
                {t('countryKSA')} <span className="text-[9px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded">{t('soon')}</span>
              </span>
              <span className="text-slate-400 hidden md:inline">
                {t('countryUAE')} <span className="text-[9px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded">{t('soon')}</span>
              </span>
            </div>
            <span className="text-slate-600 hidden lg:inline">|</span>
            <p className="hidden lg:inline text-slate-300 text-[11px] truncate max-w-sm xl:max-w-md">
              {t('topbarTagline')}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] shrink-0">
            {/* Admin Platform Quick Access */}
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer text-[11px] ${
                activePage === 'admin'
                  ? 'bg-[#0f766e] text-white shadow-xs'
                  : 'text-slate-300 hover:text-[#2dd4bf] bg-slate-800/80 hover:bg-slate-700'
              }`}
              title={language === 'ar' ? 'لوحة تحكم الإدارة والتدقيق' : 'Admin Operations Suite'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
              <span>{language === 'ar' ? 'لوحة الإدارة' : 'Admin'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            </button>

            {/* Language Switcher in Topbar */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-white hover:text-[#2dd4bf] font-bold px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
              title={t('switchLangLabel')}
            >
              <Globe className="w-3.5 h-3.5 text-[#2dd4bf]" />
              <span>{t('switchLang')}</span>
            </button>

            <a 
              href="tel:19822" 
              className="flex items-center gap-1 text-white hover:text-[#0d9488] font-sans font-semibold transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#0d9488]" />
              <span className="font-bold">19822</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <button 
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-2 sm:gap-2.5 ${isRTL ? 'text-right' : 'text-left'} cursor-pointer group`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-black group-hover:bg-[#0f766e] transition-colors shadow-sm shrink-0">
                <span className="text-base sm:text-lg text-[#0d9488] font-mono">⧉</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-[#0f172a] leading-none">
                    {language === 'ar' ? currentBrand.nameAr : currentBrand.nameEn}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#0f766e] bg-[#ecfdf5] border border-[#d1fae5] px-1 sm:px-1.5 py-0.5 rounded leading-none hidden xs:inline-block">
                    {language === 'ar' ? currentBrand.nameEn : currentBrand.nameAr}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#475569] font-medium mt-0.5 truncate max-w-[140px] sm:max-w-none">
                  {t('noOverpriceBadge')}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links (xl and up to guarantee zero overlap) */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 text-xs 2xl:text-sm font-semibold text-[#0f172a]">
            <button onClick={() => onNavigate('home')} className={navItemClass('home')}>
              {t('home')}
            </button>
            <button onClick={() => onNavigate('sell')} className={navItemClass('sell')}>
              {t('sellUnit')}
            </button>
            <button onClick={() => onNavigate('opportunities')} className={navItemClass('opportunities')}>
              {t('opportunities')}
            </button>
            <button onClick={() => onNavigate('how-it-works')} className={navItemClass('how-it-works')}>
              {t('howItWorks')}
            </button>
            <button onClick={() => onNavigate('investors')} className={navItemClass('investors')}>
              {t('forInvestors')}
            </button>
            <button onClick={() => onNavigate('story')} className={navItemClass('story')}>
              {t('ourStory')}
            </button>
            <button onClick={() => onNavigate('contact')} className={navItemClass('contact')}>
              {t('contactUs')}
            </button>
            <button onClick={() => onNavigate('admin')} className={navItemClass('admin')}>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0f766e]" />
                <span>{language === 'ar' ? 'الإدارة' : 'Admin'}</span>
              </span>
            </button>
          </nav>

          {/* Right Actions: Clean & Adaptive */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Language Toggle Button (desktop) */}
            <button
              onClick={toggleLanguage}
              className="p-1.5 sm:p-2 text-xs font-bold text-slate-700 hover:text-[#0f766e] bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title={t('switchLangLabel')}
            >
              <Globe className="w-3.5 h-3.5 text-[#0f766e]" />
              <span className="hidden xs:inline">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Desktop Auth Controls */}
            {isAuthenticated && user ? (
              <button
                onClick={onOpenUserProfile}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0f766e] bg-slate-50 hover:bg-white text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#0f766e] text-white flex items-center justify-center text-xs font-black overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                <span className="hidden md:inline text-[9px] bg-teal-100 text-[#0f766e] px-1.5 py-0.2 rounded font-bold">
                  {user.role === 'seller' ? (language === 'ar' ? 'بائع' : 'Seller') : user.role === 'buyer' ? (language === 'ar' ? 'مشتري' : 'Buyer') : (language === 'ar' ? 'مستثمر' : 'Investor')}
                </span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-[#0f766e] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('login')}</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-2.5 py-1.5 text-xs font-bold text-[#0f766e] bg-[#0f766e]/10 hover:bg-[#0f766e]/20 rounded-lg transition-colors cursor-pointer hidden md:inline-block"
                >
                  <span>{t('register')}</span>
                </button>
              </div>
            )}

            {/* Opportunities quick link (on very wide screens) */}
            <button 
              onClick={() => onNavigate('opportunities')}
              className="hidden 2xl:inline-flex px-3 py-1.5 text-xs font-bold text-[#0f172a] border border-[#cbd2d9] rounded-lg hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
            >
              {t('wantToBuy')}
            </button>

            {/* Primary Action Button (Adaptive) */}
            <button 
              onClick={() => onNavigate('sell')}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#0f766e] hover:bg-[#115e59] rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="hidden xs:inline">{t('sellGetCash')}</span>
              <span className="xs:hidden">{language === 'ar' ? 'اعرض وحدتك' : 'Sell Unit'}</span>
            </button>

            {/* Mobile & Tablet menu trigger (visible under xl) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-slate-200"
              aria-label={language === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-sm font-bold text-slate-900 shadow-xl max-h-[85vh] overflow-y-auto">
          {isAuthenticated && user ? (
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0f766e] text-white flex items-center justify-center text-sm font-black overflow-hidden shrink-0">
                  {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[160px]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => { onOpenUserProfile(); setMobileMenuOpen(false); }}
                className="text-xs font-bold text-[#0f766e] bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                {t('myAccount')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => { onOpenAuthModal('login'); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </button>
              <button
                onClick={() => { onOpenAuthModal('register'); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 text-xs font-bold text-white bg-[#0f766e] hover:bg-[#115e59] rounded-lg text-center cursor-pointer"
              >
                {t('register')}
              </button>
            </div>
          )}

          {/* Navigation links inside drawer */}
          <div className="space-y-1 pt-1">
            <button 
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer ${activePage === 'home' ? 'bg-[#0f766e]/10 text-[#0f766e] font-black' : 'hover:bg-slate-50'}`}
            >
              {t('home')}
            </button>
            <button 
              onClick={() => { onNavigate('sell'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer ${activePage === 'sell' ? 'bg-[#0f766e]/10 text-[#0f766e] font-black' : 'hover:bg-slate-50 text-[#0f766e]'}`}
            >
              {t('sellUnit')}
            </button>
            <button 
              onClick={() => { onNavigate('opportunities'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer ${activePage === 'opportunities' ? 'bg-[#0f766e]/10 text-[#0f766e] font-black' : 'hover:bg-slate-50'}`}
            >
              {t('opportunities')}
            </button>
            <button 
              onClick={() => { onNavigate('how-it-works'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer ${activePage === 'how-it-works' ? 'bg-[#0f766e]/10 text-[#0f766e] font-black' : 'hover:bg-slate-50'}`}
            >
              {t('howItWorks')}
            </button>
            <button 
              onClick={() => { onNavigate('investors'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer ${activePage === 'investors' ? 'bg-[#0f766e]/10 text-[#0f766e] font-black' : 'hover:bg-slate-50'}`}
            >
              {t('forInvestors')}
            </button>
            <button 
              onClick={() => { onNavigate('story'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer ${activePage === 'story' ? 'bg-[#0f766e]/10 text-[#0f766e] font-black' : 'hover:bg-slate-50'}`}
            >
              {t('ourStory')}
            </button>
            <button 
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer ${activePage === 'contact' ? 'bg-[#0f766e]/10 text-[#0f766e] font-black' : 'hover:bg-slate-50'}`}
            >
              {t('contactUs')}
            </button>
            <button 
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${activePage === 'admin' ? 'bg-[#0f766e] text-white font-black' : 'bg-teal-50 text-teal-900 border border-teal-200'}`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
                <span>{language === 'ar' ? 'لوحة تحكم الإدارة والتدقيق' : 'Admin Operations Platform'}</span>
              </span>
              <span className="text-[10px] bg-[#0f766e] text-white font-bold px-2 py-0.5 rounded">Admin</span>
            </button>
          </div>

          {/* Quick Support & Hotline inside Drawer */}
          <div className="pt-3 mt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <a 
              href="tel:19822" 
              className="flex items-center gap-1.5 font-bold text-[#0f766e]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الخط الساخن: 19822' : 'Hotline: 19822'}</span>
            </a>
            <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
              {language === 'ar' ? 'عمولة البائع 0%' : '0% Seller Fee'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
