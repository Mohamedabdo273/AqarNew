import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  Coins 
} from 'lucide-react';
import { BrandSuggestion, PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  currentBrand: BrandSuggestion;
  onOpenAddUnit: () => void;
  onNavigate: (page: PageId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentBrand,
  onOpenAddUnit,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const { t, language, isRTL } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('opportunities');
  };

  return (
    <section id="hero" className="bg-slate-50/70 border-b border-slate-200/80 pt-12 pb-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        
        {/* Top Eyebrow Tag */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            <span>{t('heroBadge')}</span>
          </span>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900">
            {language === 'ar' ? (
              <>
                استرد كاش شقتك بالكامل
                <span className="block text-teal-800 font-extrabold mt-1">
                  بدون خسارة مليم وبصفر عمولة
                </span>
              </>
            ) : (
              <>
                Recover 100% of Your Paid Cash
                <span className="block text-teal-800 font-extrabold mt-1">
                  Zero Deductions & 0% Fee
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
            {language === 'ar'
              ? 'تخارج رسمي بمقر المطور: بنوصلك بمشتري يستلم شقتك بنفس سعر العقد القديم، تستلم شيك مصرفي بكامل فلوسك وتسترجع شيكاتك البنكية فوراً.'
              : 'Direct official assignment at developer HQ: Exit smoothly, receive a certified cashier check for all paid cash, and discharge pending checks.'}
          </p>

          {/* Primary Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 sm:pt-4">
            <button
              onClick={onOpenAddUnit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-bold min-h-[46px] px-6 text-sm bg-teal-700 hover:bg-teal-800 text-white transition-colors cursor-pointer shadow-xs"
            >
              <span>{language === 'ar' ? 'سجل شقتك وتخارج الآن (مجاناً)' : 'Exit Your Unit Now (Free)'}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onNavigate('opportunities')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold min-h-[46px] px-6 text-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              <span>{language === 'ar' ? 'تصفح الفرص المتاحة (سعر زمان)' : 'Browse Units (0% Overprice)'}</span>
            </button>
          </div>

          {/* 3 Quick Benefit Bullets */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>{language === 'ar' ? 'عمولة 0% على البائع' : '0% Seller Fee'}</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>{language === 'ar' ? 'استرداد الشيكات البنكية' : 'Bank Checks Returned'}</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>{language === 'ar' ? 'التنازل داخل مقر المطور' : 'At Developer HQ'}</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-slate-200 text-slate-900">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className={`w-full ${isRTL ? 'pl-4 pr-10' : 'pr-4 pl-10'} py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-teal-700 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400`}
              />
              <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
            </div>

            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-teal-700 focus:bg-white text-slate-700 transition-all cursor-pointer"
              >
                <option value="">{t('allRegions')}</option>
                <option value="القاهرة الجديدة">{language === 'ar' ? 'القاهرة الجديدة (التجمع)' : 'New Cairo (Tagamoa)'}</option>
                <option value="الشيخ زايد">{language === 'ar' ? 'الشيخ زايد و6 أكتوبر' : 'Sheikh Zayed & 6th of October'}</option>
                <option value="العاصمة الإدارية">{language === 'ar' ? 'العاصمة الإدارية' : 'New Administrative Capital'}</option>
                <option value="الساحل الشمالي">{language === 'ar' ? 'الساحل الشمالي' : 'North Coast'}</option>
                <option value="المستقبل والشروق">{language === 'ar' ? 'مدينة المستقبل والشروق' : 'Mostakbal City & Shorouk'}</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full h-full py-2.5 px-5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{t('exploreOpportunities')}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};
