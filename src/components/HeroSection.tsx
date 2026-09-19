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
import { BrandSuggestion } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  currentBrand: BrandSuggestion;
  onOpenAddUnit: () => void;
  onScrollToSection: (sectionId: string) => void;
  onSearchChange: (query: string, region: string, propertyType: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentBrand,
  onOpenAddUnit,
  onScrollToSection,
  onSearchChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const { t, language, isRTL } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchQuery, selectedRegion, selectedType);
    onScrollToSection('listings');
  };

  return (
    <section id="hero" className="bg-[#0f172a] text-white pt-12 pb-16 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0d9488]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Top Eyebrow Tag */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 text-white/90 border border-white/15 text-[11px] sm:text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-pulse"></span>
            <span>{t('heroBadge')}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            {t('heroHeadlinePrefix')}
            <br className="hidden sm:inline" />
            {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#38bdf8]">
              {t('heroHeadlineHighlight')}
            </span>
            {' '}
            {t('heroHeadlineSuffix')}
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed pt-1 sm:pt-2">
            {t('heroSubheadline')}
          </p>

          {/* Primary Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 sm:pt-4">
            <button
              onClick={onOpenAddUnit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg font-bold min-h-[44px] sm:min-h-[48px] h-12 sm:h-13 px-6 sm:px-8 text-sm sm:text-base bg-[#0f766e] hover:bg-[#115e59] text-white shadow-lg transition-all cursor-pointer hover:shadow-teal-900/30"
            >
              <span>{t('sellUnit')}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onScrollToSection('listings')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg font-bold min-h-[44px] sm:min-h-[48px] h-12 sm:h-13 px-6 sm:px-8 text-sm sm:text-base bg-transparent text-white border border-white/30 hover:bg-white/10 transition-all cursor-pointer"
            >
              <span>{t('exploreOpportunities')}</span>
            </button>
          </div>

          {/* Micro Trust Note */}
          <p className="text-[11px] sm:text-xs text-slate-400 pt-1">
            {language === 'ar' ? (
              <>للبايع: <strong className="text-white">مجانًا تمامًا — مفيش أي عمولة عليك</strong>. للمشتري: <strong className="text-white">أرقام موثقة قبل ما تدفع جنيه</strong></>
            ) : (
              <>For Sellers: <strong className="text-white">100% Free — Zero Commission</strong>. For Buyers: <strong className="text-white">Legally audited before you pay a single pound</strong></>
            )}
          </p>
        </div>

        {/* The Iconic Side-by-Side Comparison Box */}
        <div className="mt-8 sm:mt-12 max-w-3xl mx-auto bg-slate-900/90 rounded-2xl border border-white/10 p-3.5 sm:p-6 shadow-2xl backdrop-blur-md">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Left: لو رجّع الوحدة للمطور */}
            <div className="rounded-xl bg-white/5 border border-red-500/20 p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    {language === 'ar' ? 'لو رجّع الوحدة للمطور' : 'If Cancelled with Developer'}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-black/40 px-2 py-0.5 rounded">
                    {language === 'ar' ? 'فسخ وإلغاء' : 'Cancellation'}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-xs text-slate-400 block">
                    {language === 'ar' ? 'خصم الإلغاء (15% من سعر الوحدة كله)' : 'Penalty (15% of total contract)'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-red-400 font-sans tracking-tight">
                    - 1,500,000 <span className="text-sm font-normal text-red-300">{t('egp')}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {language === 'ar' ? 'ياخدها المطور على: ' : 'Installment refund: '}
                    <strong className="text-slate-300">{language === 'ar' ? '3 سنين شيكات مؤجلة' : '3-year deferred checks'}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-xs font-semibold text-red-400/90 bg-red-950/20 p-2 rounded">
                {language === 'ar' ? 'خسارة 75% من فلوسه المسددة + سنين انتظار' : 'Loss of 75% of paid cash + years of waiting'}
              </div>
            </div>

            {/* Right: لو نقل تعاقده عن طريق المنصة */}
            <div className="rounded-xl bg-[#0f766e]/20 border border-[#0d9488]/50 p-5 flex flex-col justify-between space-y-3 shadow-inner">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2dd4bf] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2dd4bf]" />
                    {language === 'ar' ? `لو نقل تعاقده عن طريق ${currentBrand.nameAr}` : `If Transferred via ${currentBrand.nameEn}`}
                  </span>
                  <span className="text-[10px] text-[#2dd4bf] bg-[#0d9488]/30 px-2 py-0.5 rounded font-bold">
                    {language === 'ar' ? 'تنازل آمن' : 'Safe Exit'}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-xs text-slate-300 block">
                    {language === 'ar' ? 'يسترجع اللي دفعه بالكامل' : 'Recover 100% of cash paid'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                    2,000,000 <span className="text-sm font-normal text-[#2dd4bf]">{t('egp')} {language === 'ar' ? 'كاش' : 'Cash'}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  <span>{language === 'ar' ? 'كاش عند إتمام النقل بمقر المطور فوراً' : 'Certified cash at developer HQ instantly'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#0d9488]/30 text-xs font-bold text-[#2dd4bf] bg-[#0f766e]/30 p-2 rounded">
                {language === 'ar' ? 'فلوسه كاملة كاش، والمشتري كسب سعر قديم!' : '100% cash to seller, original past price to buyer!'}
              </div>
            </div>

          </div>
        </div>

        {/* Live Marketplace Statistics Bar */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-white/10 pt-8">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-sans">
              7,328
            </div>
            <div className="text-xs text-slate-400">
              {language === 'ar' ? 'الوحدات على المنصة' : 'Units on Platform'}
              <span className="block text-[10px] text-slate-500">{language === 'ar' ? 'منشورة وفي مرحلة المراجعة' : 'Listed & audited'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-[#2dd4bf] font-sans">
              105.6 <span className="text-sm font-normal">{language === 'ar' ? 'مليار' : 'Billion'}</span>
            </div>
            <div className="text-xs text-slate-400">
              {language === 'ar' ? 'قيمة الوحدات بالسوق' : 'Market Value of Units'}
              <span className="block text-[10px] text-slate-500">{language === 'ar' ? 'بسعر السوق الحالي التقديري' : 'Estimated at today\'s market rate'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-sans">
              0%
            </div>
            <div className="text-xs text-slate-400">
              {language === 'ar' ? 'عمولة البائع' : 'Seller Commission'}
              <span className="block text-[10px] text-slate-500">{language === 'ar' ? 'مجانًا بالكامل بدون مصاريف' : 'Zero commission on sellers'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-[#38bdf8] font-sans">
              0 <span className="text-sm font-normal">{t('egp')}</span>
            </div>
            <div className="text-xs text-slate-400">
              {language === 'ar' ? 'الأوفر برايس' : 'Overprice Premium'}
              <span className="block text-[10px] text-slate-500">{language === 'ar' ? 'ممنوع أي زيادة فوق المدفوع' : 'Strictly 0% overprice'}</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-10 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200 text-slate-900">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className={`w-full ${isRTL ? 'pl-4 pr-10' : 'pr-4 pl-10'} py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0f766e] focus:bg-white transition-all`}
              />
              <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3.5`} />
            </div>

            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0f766e] focus:bg-white text-slate-700 transition-all cursor-pointer"
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
                className="w-full h-full py-3 px-6 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
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
