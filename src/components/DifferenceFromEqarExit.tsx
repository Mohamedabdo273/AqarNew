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

interface DifferenceFromEqarExitProps {
  currentBrand: BrandSuggestion;
  onNavigate: (page: PageId) => void;
  onOpenAddUnit: () => void;
}

export const DifferenceFromEqarExit: React.FC<DifferenceFromEqarExitProps> = ({
  currentBrand,
  onNavigate,
  onOpenAddUnit
}) => {
  const { t, language, isRTL } = useLanguage();

  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0f766e]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f766e]/20 text-[#2dd4bf] border border-[#0d9488]/40 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'ar' ? 'نموذج الجيل الثاني للتخارج العقاري' : 'Next-Gen PropTech Asset Reallocation'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {language === 'ar' ? (
              <>كيف نختلف جذرياً عن <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#38bdf8]">«عقار إكزيت»</span> والوسطاء التقليديين؟</>
            ) : (
              <>How We Fundamentally Differ from <span className="text-[#2dd4bf]">Aqar Exit</span> & Brokers</>
            )}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            {language === 'ar'
              ? 'لسنا مجرد وسيط إعلاني للمتعثرين. نحن منظومة مالية ومصرفية متكاملة تقدم حلولاً مؤسسية ذكية لإعادة تدوير المحافظ الاستثمارية وتحرير السيولة بأعلى درجات الوقار والأمان.'
              : 'We are not a distressed seller classifieds board. We are an institutional real estate investment banking suite providing dignified capital rebalancing and multi-track exits.'}
          </p>
        </div>

        {/* 3 Strategic Tracks (Our Big Innovation) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
              {language === 'ar' ? '3 مسارات استثمارية متكاملة (وليس مساراً واحداً)' : '3 Strategic Tracks (Not Just A Single Fire-Sale Option)'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {language === 'ar' ? 'حلول مصممة خصيصاً لكل احتياج مالي' : 'Tailored Solutions for Every Financial Objective'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Track 1: Direct Cash Exit */}
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 hover:border-[#0d9488] transition-all flex flex-col justify-between group shadow-lg">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0f766e]/20 text-[#2dd4bf] flex items-center justify-center font-bold mb-4 border border-[#0d9488]/30 group-hover:scale-105 transition-transform">
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded mb-2">
                  {language === 'ar' ? 'المسار الأول • استرداد نقدي 100%' : 'Track 1 • 100% Cash Recovery'}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {language === 'ar' ? 'التخارج الكاش بصفر أوفر برايس' : 'Direct Cash Exit (0% Overprice)'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'استرداد كامل رأس المال المسدد بالجنيه دون أي استقطاعات، بشيك مصرفي مقبول الدفع يُسلّم في مقر المطور مع إبراء الذمة من كامل الشيكات الآجلة.'
                    : 'Recover 100% of your paid cash with zero deductions. Handover of certified cashier draft at developer HQ with total debt discharge.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">{language === 'ar' ? 'العمولة على البائع:' : 'Seller Fee:'} <strong className="text-emerald-400">0% مجاناً</strong></span>
                <button 
                  onClick={onOpenAddUnit}
                  className="text-[#2dd4bf] hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'طلب تخارج' : 'Start Exit'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 2: Property Swap (Exclusive) */}
            <div className="bg-gradient-to-b from-slate-800/90 to-[#0f766e]/15 rounded-2xl p-6 border-2 border-[#0d9488] transition-all flex flex-col justify-between relative shadow-xl">
              <div className="absolute -top-3 right-4 bg-[#0d9488] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                {language === 'ar' ? 'حصري لمنصتنا • غير متاح لدى المنافسين' : 'Exclusive Innovation'}
              </div>

              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2dd4bf]/20 text-[#2dd4bf] flex items-center justify-center font-bold mb-4 border border-[#2dd4bf]/40">
                  <Repeat className="w-6 h-6" />
                </div>
                <div className="inline-block text-[10px] font-bold text-[#2dd4bf] bg-[#0f766e]/40 border border-[#0d9488]/60 px-2 py-0.5 rounded mb-2">
                  {language === 'ar' ? 'المسار الثاني • البقاء في السوق' : 'Track 2 • Stay in the Market'}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {language === 'ar' ? 'المناقلة والمبادلة العقارية الذكية' : 'Smart Property Swap & Switch'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'بدّل وحدتك ذات الأقساط المرتفعة بأصل آخر (مكتب إداري، عيادة، أو شقة سكنية) مدفوع بالكامل أو بأقساط ميسرة، فتحافظ على مدخراتك داخل السوق دون تسييل قهري.'
                    : 'Swap your high-installment unit for another prime asset (office, clinic, apartment) with fully paid equity or easy cash flow, avoiding forced liquidation.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">{language === 'ar' ? 'الحماية:' : 'Protection:'} <strong className="text-[#2dd4bf]">{language === 'ar' ? 'عقود موثقة بالمطور' : 'Official contracts'}</strong></span>
                <button 
                  onClick={() => onNavigate('swap')}
                  className="bg-[#0f766e] hover:bg-[#115e59] text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{language === 'ar' ? 'استكشف المبادلات' : 'Explore Swaps'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 3: Instant Liquidity Network */}
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 hover:border-amber-500 transition-all flex flex-col justify-between group shadow-lg">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-4 border border-amber-500/30 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="inline-block text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded mb-2">
                  {language === 'ar' ? 'المسار الثالث • سرعة قياسية 72 ساعة' : 'Track 3 • Rapid 72h Settlement'}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {language === 'ar' ? 'شبكة السيولة الفورية والاستحواذ' : 'Instant Liquidity Institutional Network'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ar'
                    ? 'للحالات المستعجلة التي تتطلب سيولة طارئة: نوجه الوحدة مباشرة إلى شبكة صناديق ومستثمري السيولة المعتمدين لإنهاء الاستحواذ وسداد الكاش خلال 72 ساعة.'
                    : 'For urgent cash requirements: your property is presented directly to our pre-qualified private investment consortium for rapid 72-hour acquisition.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">{language === 'ar' ? 'زمن التنفيذ:' : 'Execution:'} <strong className="text-amber-400">{language === 'ar' ? 'خلال 3 أيام' : 'Within 3 days'}</strong></span>
                <button 
                  onClick={() => onNavigate('investors')}
                  className="text-amber-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'ar' ? 'شبكة الصناديق' : 'Investor Club'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Head-to-Head Comparison Table */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-8 overflow-hidden shadow-2xl">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {language === 'ar' ? 'مقارنة المعايير: لماذا تتفوق منصتنا؟' : 'Direct Benchmark: Why Our Platform Leads?'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'ar' 
                  ? 'مقارنة موضوعية ودقيقة بين نموذجنا المتطور ونموذج «عقار إكزيت» وسماسرة السوق التقليديين' 
                  : 'Objective comparison between our institutional model, Aqar Exit, and standard market brokers'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0f766e]/30 text-[#2dd4bf] text-xs font-bold border border-[#0d9488]/40 self-start sm:self-auto">
              <Award className="w-4 h-4" />
              <span>{language === 'ar' ? 'معايير مصرفية معتمدة' : 'Institutional Audit Standard'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className={`py-3.5 px-3 font-bold text-slate-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? 'المعيار / الخاصية' : 'Feature / Metric'}
                  </th>
                  <th className={`py-3.5 px-3 font-bold text-red-400 bg-red-950/20 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? '«عقار إكزيت» (Aqar Exit)' : 'Aqar Exit'}
                  </th>
                  <th className={`py-3.5 px-3 font-bold text-[#2dd4bf] bg-[#0f766e]/20 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? `منصتنا (${currentBrand.nameAr})` : `Our Platform (${currentBrand.nameEn})`}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                
                {/* Point 1: Stigma */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">
                    {language === 'ar' ? 'لغة الخطاب ومكانة العميل' : 'Positioning & Client Dignity'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 bg-red-950/10">
                    <span className="flex items-center gap-1.5 text-red-400">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>{language === 'ar' ? 'يصنف البائع كـ "متعثر" ويخلق وصمة اجتماعية تدفع المشترين لبخس السعر' : 'Labels users as "struggling debtors", inducing severe low-balling'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 bg-[#0f766e]/10 font-bold">
                    <span className="flex items-center gap-1.5 text-[#2dd4bf]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{language === 'ar' ? 'إعادة هيكلة محافظ وتخارج استثماري راقٍ بلا أي وصمة تعثر' : 'Dignified portfolio rebalancing & investment banking protocol'}</span>
                    </span>
                  </td>
                </tr>

                {/* Point 2: Tracks */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">
                    {language === 'ar' ? 'تنوع مسارات الحلول' : 'Diversity of Exit Tracks'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 bg-red-950/10">
                    <span className="flex items-center gap-1.5 text-red-400">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>{language === 'ar' ? 'خيار وحيد فقط: بيع كاش وانتظار مشتري فردي قد يتأخر أشهراً' : 'Single track: wait for an individual retail buyer with cash'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 bg-[#0f766e]/10 font-bold">
                    <span className="flex items-center gap-1.5 text-[#2dd4bf]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{language === 'ar' ? '3 مسارات: استرداد كاش + مبادلة ومناقلة أصول + شبكة سيولة خلال 72 ساعة' : '3 tracks: Cash Exit + Asset Swap + 72h Institutional Liquidity'}</span>
                    </span>
                  </td>
                </tr>

                {/* Point 3: Property Swap */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">
                    {language === 'ar' ? 'خدمة المناقلة والمبادلة (Swap)' : 'Property Swap / Switch'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 bg-red-950/10">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{language === 'ar' ? 'غير متوفرة نهائياً' : 'Completely unavailable'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 bg-[#0f766e]/10 font-bold">
                    <span className="flex items-center gap-1.5 text-[#2dd4bf]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{language === 'ar' ? 'متاحة حصرياً: بدّل وحدتك بأصل تجاري أو سكني يناسب دخلك' : 'Exclusive engine: Swap high installment unit for an income asset'}</span>
                    </span>
                  </td>
                </tr>

                {/* Point 4: Due Diligence Report */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">
                    {language === 'ar' ? 'تقرير الفحص والاعتماد الفني (Due Diligence)' : 'Due Diligence & Audit Rating'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 bg-red-950/10">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{language === 'ar' ? 'مراجعة أوراق عادية دون تقرير ائتماني أو قياس إنجاز' : 'Basic document check without formal rating or progress audit'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 bg-[#0f766e]/10 font-bold">
                    <span className="flex items-center gap-1.5 text-[#2dd4bf]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{language === 'ar' ? 'وثيقة تدقيق شاملة برتب (A+ / AAA) وتوثيق نسبة البناء والموقف المالي' : 'Formal Audit Passport: Construction %, Cashflow, & Legal Clearance'}</span>
                    </span>
                  </td>
                </tr>

                {/* Point 5: Settlement & Security */}
                <tr className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-white">
                    {language === 'ar' ? 'ضمان التسوية البنكية واسترداد الشيكات' : 'Settlement & Checks Clearance'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 bg-red-950/10">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="text-amber-400 text-sm">~</span>
                      <span>{language === 'ar' ? 'وساطة تقليدية بحضور مندوب' : 'Standard broker attendance'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 bg-[#0f766e]/10 font-bold">
                    <span className="flex items-center gap-1.5 text-[#2dd4bf]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
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
