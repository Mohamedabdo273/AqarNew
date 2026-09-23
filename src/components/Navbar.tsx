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
  Repeat
} from 'lucide-react';
import { BrandSuggestion, PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentBrand: BrandSuggestion;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onSelectBrand?: (brand: BrandSuggestion) => void;
  onOpenAddUnit: () => void;
  onOpenBrandShowcase?: () => void;
  onOpenInvestorClub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentBrand,
  activePage,
  onNavigate,
  onOpenAddUnit,
  onOpenBrandShowcase,
  onOpenInvestorClub
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, toggleLanguage, isRTL } = useLanguage();

  const navItemClass = (page: PageId) => `
    px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap
    ${activePage === page 
      ? 'bg-slate-100 text-slate-900 font-bold' 
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }
  `;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar - Clean, quiet and understated */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              {t('countryEgypt')}
            </span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-slate-400 hidden sm:inline text-xs">
              {language === 'ar' ? 'التنازل المالي الرسمي بمقر المطور بدون أوفر برايس' : 'Official developer HQ contract transfer · 0% Overprice'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Admin Platform Quick Access */}
            <button
              onClick={() => onNavigate('admin')}
              className={`text-xs px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activePage === 'admin'
                  ? 'text-teal-300 font-bold bg-slate-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'لوحة الإدارة' : 'Admin'}
            </button>

            {/* Language Switcher in Topbar */}
            <button
              onClick={toggleLanguage}
              className="text-xs text-slate-300 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5"
            >
              {t('switchLang')}
            </button>

            <span className="text-slate-700 hidden xs:inline">|</span>

            <a 
              href="tel:19822" 
              className="text-xs text-slate-300 hover:text-white font-sans font-semibold transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-teal-400" />
              <span>19822</span>
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
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none">
                    {language === 'ar' ? currentBrand.nameAr : currentBrand.nameEn}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans hidden sm:inline">
                    / {language === 'ar' ? currentBrand.nameEn : currentBrand.nameAr}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-normal mt-0.5 truncate max-w-[150px] sm:max-w-none">
                  {t('noOverpriceBadge')}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-700">
            <button onClick={() => onNavigate('home')} className={navItemClass('home')}>
              {t('home')}
            </button>
            <button onClick={() => onNavigate('sell')} className={navItemClass('sell')}>
              {t('sellUnit')}
            </button>
            <button onClick={() => onNavigate('opportunities')} className={navItemClass('opportunities')}>
              {t('opportunities')}
            </button>
            <button onClick={() => onNavigate('swap')} className={navItemClass('swap')}>
              <span>{language === 'ar' ? 'تبديل عقارك' : 'Property Swap'}</span>
            </button>
            <button onClick={() => onNavigate('how-it-works')} className={navItemClass('how-it-works')}>
              {t('howItWorks')}
            </button>
          </nav>

          {/* Right Actions: Clean & Adaptive */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Opportunities quick link (on very wide screens) */}
            <button 
              onClick={() => onNavigate('opportunities')}
              className="hidden 2xl:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t('wantToBuy')}
            </button>

            {/* Primary Action Button (Adaptive) */}
            <button 
              onClick={() => onNavigate('sell')}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="hidden xs:inline">{t('sellGetCash')}</span>
              <span className="xs:hidden">{language === 'ar' ? 'اعرض وحدتك' : 'Sell Unit'}</span>
            </button>

            {/* Mobile & Tablet menu trigger (visible under lg) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-slate-200"
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
          {/* Quick CTA in drawer */}
          <button
            onClick={() => { onNavigate('sell'); setMobileMenuOpen(false); }}
            className="w-full py-2.5 px-3 text-xs font-bold text-white bg-[#0f766e] hover:bg-[#115e59] rounded-lg text-center cursor-pointer shadow-sm mb-2 flex items-center justify-center gap-1.5"
          >
            <span>{t('sellGetCash')}</span>
          </button>

          {/* Navigation links inside drawer */}

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
              onClick={() => { onNavigate('swap'); setMobileMenuOpen(false); }}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} p-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${activePage === 'swap' ? 'bg-amber-50 text-amber-900 font-black border border-amber-200' : 'hover:bg-slate-50 text-amber-900 font-bold'}`}
            >
              <span className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-amber-600" />
                <span>{language === 'ar' ? 'تبديل عقارك' : 'Property Swap'}</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">{language === 'ar' ? 'جديد' : 'New'}</span>
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
