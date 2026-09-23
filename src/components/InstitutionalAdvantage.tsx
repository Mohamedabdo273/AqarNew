import React from 'react';
import { 
  Repeat, 
  Banknote, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  Sparkles,
  Award,
  Layers,
  Building2,
  FileCheck2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BrandSuggestion, PageId } from '../types';

interface InstitutionalAdvantageProps {
  currentBrand: BrandSuggestion;
  onNavigate: (page: PageId) => void;
  onOpenAddUnit: () => void;
}

export const InstitutionalAdvantage: React.FC<InstitutionalAdvantageProps> = ({
  currentBrand,
  onNavigate,
  onOpenAddUnit
}) => {
  const { t, language, isRTL } = useLanguage();

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200 text-slate-900 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'ar' ? 'نموذج التخارج العقاري المباشر' : 'Direct Asset Reallocation Protocol'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? (
              <>كيف نختلف عن <span className="text-teal-800">الوسطاء والمواقع التقليدية</span>؟</>
            ) : (
              <>How We Differ from <span className="text-teal-800">Traditional Portals & Brokers</span></>
            )}
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            {language === 'ar'
              ? 'نرفض تماماً ثقافة وتصنيف "المتعثرين" وبخس الأسعار. نحن منظومة مالية وقانونية متكاملة تقدم حلولاً ذكية لإعادة تدوير الأقساط وتحرير السيولة بأمان وشفافية.'
              : 'We strictly reject the "distressed fire-sale" stigma and low-ball culture. We provide transparent solutions for contract rebalancing and multi-track exits.'}
          </p>
        </div>

        {/* 3 Strategic Tracks */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              {language === 'ar' ? '3 مسارات استثمارية واضحة' : '3 Strategic Tracks'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {language === 'ar' ? 'حلول تناسب رغبتك واحتياجك المالي' : 'Solutions Built for Your Financial Plan'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Track 1: Direct Cash Exit */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold mb-3.5">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="inline-block text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded mb-2">
                  {language === 'ar' ? 'المسار الأول • استرداد نقدي 100%' : 'Track 1 • 100% Cash Recovery'}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  {language === 'ar' ? 'التخارج الكاش بصفر أوفر برايس' : 'Direct Cash Exit (0% Overprice)'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'استرداد كامل رأس المال المسدد بالجنيه دون أي استقطاعات، بشيك مصرفي مقبول الدفع يُسلّم في مقر المطور مع إبراء الذمة من كامل الشيكات الآجلة.'
                    : 'Recover 100% of your paid cash with zero deductions. Handover of certified cashier draft at developer HQ with total debt discharge.'}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'ar' ? 'العمولة على البائع:' : 'Seller Fee:'} <strong className="text-teal-800">0% مجاناً</strong></span>
                <button 
                  onClick={onOpenAddUnit}
                  className="text-teal-800 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'طلب تخارج' : 'Start Exit'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 2: Property Swap */}
            <div className="bg-white rounded-2xl p-6 border-2 border-teal-700 transition-all flex flex-col justify-between relative shadow-xs">
              <div className="absolute -top-3 right-4 bg-teal-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {language === 'ar' ? 'مسار مميز' : 'Popular'}
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold mb-3.5">
                  <Repeat className="w-5 h-5" />
                </div>
                <div className="inline-block text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded mb-2">
                  {language === 'ar' ? 'المسار الثاني • التبديل الذكي' : 'Track 2 • Smart Asset Swap'}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  {language === 'ar' ? 'المناقلة والمبادلة العقارية' : 'Smart Property Swap'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'بدّل التزامك العقاري الحالي بوحدة ذات أقساط أقل تناسب دخلك، أو بأصل تجاري/إداري مدرّ للدخل، دون الحاجة للبيع والتسييل المعقد.'
                    : 'Swap your high-installment unit for an asset with lower monthly burden, or trade into a cashflow-generating commercial property.'}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'ar' ? 'حل ذكي وسريع' : 'Smart Alternative'}</span>
                <button 
                  onClick={() => onNavigate('swap')}
                  className="text-teal-800 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'استكشف المبادلة' : 'Explore Swap'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 3: Instant Liquidity */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold mb-3.5">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="inline-block text-[11px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-2">
                  {language === 'ar' ? 'المسار الثالث • سيولة سريعة' : 'Track 3 • Rapid Liquidity'}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">
                  {language === 'ar' ? 'شبكة المشترين الجاهزين (72 ساعة)' : '72-Hour Liquidity Network'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'طرح الوحدة مباشرة على قائمة المستثمرين الجاهزين فوراً للاستحواذ والتنفيذ المباشر بمقر المطور خلال أيام معدودة.'
                    : 'Direct presentation to pre-approved buyers seeking immediate acquisition and closing in days.'}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{language === 'ar' ? 'للإغلاق السريع' : 'For Fast Closing'}</span>
                <button 
                  onClick={() => onNavigate('investors')}
                  className="text-slate-800 hover:text-slate-950 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'نادي المستثمرين' : 'Investor Desk'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Feature-by-Feature Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-500 font-semibold block mb-0.5">
                {language === 'ar' ? 'مقارنة المعايير' : 'Benchmarking Matrix'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {language === 'ar' ? 'الفارق بين المنظومة الرسمية والوساطة التقليدية' : 'Institutional Protocol vs Traditional Brokerage'}
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold self-start sm:self-auto border border-teal-200/60">
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'معايير رسمية معتمدة' : 'Official Standards'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/50">
                  <th className={`py-3 px-3 font-bold text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? 'المعيار' : 'Feature'}
                  </th>
                  <th className={`py-3 px-3 font-semibold text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? 'المواقع والوسطاء التقليديون' : 'Traditional Portals & Brokers'}
                  </th>
                  <th className={`py-3 px-3 font-bold text-teal-800 bg-teal-50/60 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? `منصتنا (${currentBrand.nameAr})` : `Our Platform (${currentBrand.nameEn})`}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                
                {/* Point 1: Stigma */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {language === 'ar' ? 'لغة الخطاب ومكانة العميل' : 'Positioning & Client Dignity'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{language === 'ar' ? 'يصنف البائع كـ "متعثر" ويخلق وصمة اجتماعية تدفع المشترين لبخس السعر' : 'Labels users as "struggling debtors", inducing severe low-balling'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-teal-900 bg-teal-50/30 font-medium">
                    <span className="flex items-center gap-1.5 text-teal-800">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'ar' ? 'إعادة هيكلة محافظ وتخارج استثماري راقٍ بلا أي وصمة تعثر' : 'Dignified portfolio rebalancing & investment banking protocol'}</span>
                    </span>
                  </td>
                </tr>

                {/* Point 2: Tracks */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {language === 'ar' ? 'تنوع مسارات الحلول' : 'Diversity of Exit Tracks'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{language === 'ar' ? 'خيار وحيد فقط: بيع كاش وانتظار مشتري فردي قد يتأخر أشهراً' : 'Single track: wait for an individual retail buyer with cash'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-teal-900 bg-teal-50/30 font-medium">
                    <span className="flex items-center gap-1.5 text-teal-800">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'ar' ? '3 مسارات: استرداد كاش + مبادلة ومناقلة أصول + شبكة سيولة خلال 72 ساعة' : '3 tracks: Cash Exit + Asset Swap + 72h Institutional Liquidity'}</span>
                    </span>
                  </td>
                </tr>

                {/* Point 3: Property Swap */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {language === 'ar' ? 'خدمة المناقلة والمبادلة (Swap)' : 'Property Swap / Switch'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <XCircle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{language === 'ar' ? 'غير متوفرة نهائياً' : 'Completely unavailable'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-teal-900 bg-teal-50/30 font-medium">
                    <span className="flex items-center gap-1.5 text-teal-800">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'ar' ? 'متاحة حصرياً: بدّل وحدتك بأصل تجاري أو سكني يناسب دخلك' : 'Exclusive engine: Swap high installment unit for an income asset'}</span>
                    </span>
                  </td>
                </tr>

                {/* Point 4: Due Diligence Report */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {language === 'ar' ? 'تقرير الفحص والاعتماد الفني (Due Diligence)' : 'Due Diligence & Audit Rating'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <XCircle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{language === 'ar' ? 'مراجعة أوراق عادية دون تقرير ائتماني أو قياس إنجاز' : 'Basic document check without formal rating or progress audit'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-teal-900 bg-teal-50/30 font-medium">
                    <span className="flex items-center gap-1.5 text-teal-800">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'ar' ? 'وثيقة تدقيق شاملة برتب (A+ / AAA) وتوثيق نسبة البناء والموقف المالي' : 'Formal Audit Passport: Construction %, Cashflow, & Legal Clearance'}</span>
                    </span>
                  </td>
                </tr>

                {/* Point 5: Settlement & Security */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {language === 'ar' ? 'ضمان التسوية البنكية واسترداد الشيكات' : 'Settlement & Checks Clearance'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="text-slate-400 text-sm">~</span>
                      <span>{language === 'ar' ? 'وساطة تقليدية بحضور مندوب' : 'Standard broker attendance'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-teal-900 bg-teal-50/30 font-medium">
                    <span className="flex items-center gap-1.5 text-teal-800">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'ar' ? 'إشراف قانوني كامل، شيك مصرفي معتمد، ومطابقة استرجاع كامل أوراق الدفع' : 'Legal audit, certified banker draft, and complete promissory notes return'}</span>
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
