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
              <>للبائع: <strong className="text-white">خدمة مجانية بالكامل — صفر عمولة</strong>. للمشتري: <strong className="text-white">تدقيق مالي وقانوني معتمد قبل سداد أي مستحقات</strong></>
            ) : (
              <>For Sellers: <strong className="text-white">100% Free — Zero Commission</strong>. For Buyers: <strong className="text-white">Legally audited before you pay a single pound</strong></>
            )}
          </p>
        </div>

        {/* The Iconic Side-by-Side Comparison Box */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto bg-slate-900/95 rounded-2xl border border-white/10 p-4 sm:p-7 shadow-2xl backdrop-blur-md">
          {/* Example Context Tag */}
          <div className="text-center mb-5 pb-3 border-b border-white/10 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">
              {language === 'ar' ? 'مثال عملي لوحدة قيمتها 10 مليون ج.م:' : 'Real Example for a 10M EGP Unit:'}
            </span>
            <span className="bg-slate-800 text-white px-2.5 py-0.5 rounded-full font-bold border border-slate-700">
              {language === 'ar' ? 'المبلغ الذي سددته كاش للمطور حتى الآن: 2,000,000 ج.م' : 'Cash Actually Paid to Developer: 2,000,000 EGP'}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Left: لو فسخ العقد مع المطور */}
            <div className="rounded-xl bg-red-950/20 border border-red-500/30 p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                  <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    {language === 'ar' ? 'المسار الأول: لو فسخت العقد مع المطور' : 'Track 1: If You Cancel with Developer'}
                  </span>
                  <span className="text-[10px] text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded font-bold">
                    {language === 'ar' ? 'خسارة فادحة' : 'Heavy Loss'}
                  </span>
                </div>

                {/* Clear Breakdown */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{language === 'ar' ? 'المبلغ الذي دفعته كاش:' : 'Cash You Paid:'}</span>
                    <span className="font-bold text-white font-sans">2,000,000 {t('egp')}</span>
                  </div>

                  <div className="flex justify-between items-center text-red-400 bg-red-950/40 px-2 py-1.5 rounded border border-red-900/30">
                    <div>
                      <span className="block font-bold">{language === 'ar' ? 'غرامة الفسخ التي يخصمها المطور:' : 'Developer Cancellation Penalty:'}</span>
                      <span className="text-[10px] text-red-300/80">{language === 'ar' ? '(15% من ثمن الشقة الإجمالي 10M)' : '(15% of total 10M price)'}</span>
                    </div>
                    <span className="font-black text-red-400 text-sm font-sans">- 1,500,000 {t('egp')}</span>
                  </div>

                  <div className="pt-2 border-t border-red-900/40 flex justify-between items-end">
                    <div>
                      <span className="block text-[11px] text-slate-400">{language === 'ar' ? 'صافي ما ستستلمه فقط بعد الخصم:' : 'Net Cash You Actually Recover:'}</span>
                      <span className="text-xl sm:text-2xl font-black text-red-400 font-sans">
                        500,000 <span className="text-xs font-normal text-slate-300">{t('egp')}</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-red-300 bg-red-900/50 px-2 py-1 rounded">
                      {language === 'ar' ? 'خسرت 1.5 مليون (75%)' : 'Lost 1.5M (75%)'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 bg-black/20 p-2 rounded">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    {language === 'ar' ? 'شروط المطور للصرف: ' : 'Developer Terms: '}
                    <strong className="text-slate-200">{language === 'ar' ? 'الـ 500 ألف تقسط على 3 سنوات بشيكات آجلة!' : 'The 500k is refunded over 3 years in checks!'}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-red-900/30 text-center text-xs font-bold text-red-400 bg-red-950/40 py-2 px-3 rounded">
                {language === 'ar' ? '❌ النتيجة: خسارة 75% من فلوسك + انتظار 3 سنين' : '❌ Result: 75% Capital Lost + 3 Years Waiting'}
              </div>
            </div>

            {/* Right: لو نقل تعاقده عن طريق المنصة */}
            <div className="rounded-xl bg-[#0f766e]/20 border border-[#0d9488]/60 p-5 flex flex-col justify-between space-y-4 shadow-inner">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#0d9488]/30">
                  <span className="text-xs font-bold text-[#2dd4bf] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                    {language === 'ar' ? `المسار الثاني: التنازل الرسمي عبر ${currentBrand.nameAr}` : `Track 2: Transfer via ${currentBrand.nameEn}`}
                  </span>
                  <span className="text-[10px] text-[#2dd4bf] bg-[#0d9488]/40 border border-[#0d9488]/50 px-2 py-0.5 rounded font-bold">
                    {language === 'ar' ? 'استرداد كامل 100%' : '100% Recovery'}
                  </span>
                </div>

                {/* Clear Breakdown */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{language === 'ar' ? 'المبلغ الذي دفعته كاش:' : 'Cash You Paid:'}</span>
                    <span className="font-bold text-white font-sans">2,000,000 {t('egp')}</span>
                  </div>

                  <div className="flex justify-between items-center text-[#2dd4bf] bg-[#0f766e]/30 px-2 py-1.5 rounded border border-[#0d9488]/40">
                    <div>
                      <span className="block font-bold">{language === 'ar' ? 'غرامات أو استقطاعات المنصة:' : 'Platform Fees or Deductions:'}</span>
                      <span className="text-[10px] text-slate-300">{language === 'ar' ? '(خدمة التنازل والتسويق مجانية للبائع 100%)' : '(100% Free service for seller)'}</span>
                    </div>
                    <span className="font-black text-[#2dd4bf] text-sm font-sans">0 {t('egp')}</span>
                  </div>

                  <div className="pt-2 border-t border-[#0d9488]/30 flex justify-between items-end">
                    <div>
                      <span className="block text-[11px] text-slate-300">{language === 'ar' ? 'المبلغ الذي ستسترده كاش بالكامل:' : 'Cash You Fully Recover:'}</span>
                      <span className="text-xl sm:text-2xl font-black text-white font-sans">
                        2,000,000 <span className="text-xs font-bold text-[#2dd4bf]">{t('egp')} {language === 'ar' ? 'كاش فوري' : 'Instant Cash'}</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/50 px-2 py-1 rounded">
                      {language === 'ar' ? 'استرداد 100% (خسارة 0%)' : '0% Loss (100% Back)'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-300 flex items-center gap-1.5 bg-black/20 p-2 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0" />
                  <span>
                    {language === 'ar' ? 'طريقة الاستلام: ' : 'Payout: '}
                    <strong className="text-white">{language === 'ar' ? 'شيك مصرفي معتمد يُسلّم لك بمقر المطور فور التنازل' : 'Certified cashier check handed at developer HQ'}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#0d9488]/40 text-center text-xs font-bold text-[#2dd4bf] bg-[#0f766e]/40 py-2 px-3 rounded">
                {language === 'ar' ? '✅ النتيجة: استرداد الـ 2 مليون كاملة + إبراء ذمة واسترجاع الشيكات' : '✅ Result: Full 2 Million Recovered + Checks Returned'}
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
