import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Users, 
  Scale, 
  FileCheck2, 
  Coins, 
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { BrandSuggestion, PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface StoryPageProps {
  currentBrand: BrandSuggestion;
  onNavigate: (page: PageId) => void;
  onOpenAddUnit: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({
  currentBrand,
  onNavigate,
  onOpenAddUnit
}) => {
  const { t, language, isRTL } = useLanguage();

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-[#f5f6f8] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Breadcrumb & Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold border border-[#d1fae5]">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'قصتنا • لماذا تأسست المنصة؟' : 'Our Story • Why We Started'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-tight">
            {language === 'ar' ? (
              <>بدأنا لأن السوق كان محتاج <span className="text-[#0f766e]">حلاً عادلاً وإنسانياً</span></>
            ) : (
              <>We started because the market desperately needed a <span className="text-[#0f766e]">fair, human solution</span></>
            )}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {language === 'ar'
              ? 'في ظل تغيرات أسعار الصرف وارتفاع الالتزامات المالية في مصر، وجد آلاف المتعاقدين على وحدات بالتقسيط أنفسهم محاصرين بين شروط جزائية قاسية للمطورين، وجشع سماسرة الريسيل. من هنا ولدت فكرة التنازل بدون أوفر.'
              : 'Amid shifting currency rates and surging installment burdens in Egypt, thousands of property owners found themselves trapped between punitive developer cancellation penalties and speculative broker overprices. We built the fair exit ecosystem to solve this permanently.'}
          </p>
        </div>

        {/* The Problem We Saw */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-4 sm:p-8 lg:p-10 shadow-xs">
          <div className="max-w-3xl mb-6 sm:mb-8">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{language === 'ar' ? 'المشكلة التي لاحظناها في السوق' : 'The Market Dilemma We Observed'}</span>
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0f172a]">
              {language === 'ar' ? 'بين مطرقة غرامات المطور وسندان السماسرة' : 'Between Punitive Penalties and Speculative Resale'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-6 rounded-xl bg-red-50/60 border border-red-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-[#0f172a]">
                {language === 'ar' ? 'غرامات الفسخ لدى المطورين تحرق الشقى' : 'Developer Cancellation Forfeitures'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'لو تعثر العميل في سداد قسط وقرر فسخ العقد مع شركة التطوير، تفاجئه اللائحة بخصم من 10% إلى 15% من إجمالي ثمن الوحدة (مش من اللي دفعه!). يعني لو دافع 2 مليون في وحدة ثمنها 8 مليون، المطور يخصم 1.2 مليون ويقسط له الباقي على 3 سنين!'
                  : 'When defaulting or cancelling, contracts enforce penalties of 10% to 15% on the entire contract volume (not just paid cash). If an owner paid 2M on an 8M unit, the developer forfeits 1.2M and spreads the meager rest over 3 years in deferred checks.'}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-[#0f172a]">
                {language === 'ar' ? 'الريسيل العادي: أوفر مبالغ فيه وعمولات من الطرفين' : 'Traditional Resale: Bloated Overprice & High Fees'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'السماسرة يطلبون من البائع وضع أوفر برايس بمليون أو اتنين لتعطيل البيع، مع عمولات 2.5% من البايع و2.5% من المشتري، ويتركون الطرفين لمشاكل الشيكات وتوكيلات الشهر العقاري العرفية من غير تأمين قانوني لمقر المطور.'
                  : 'Brokers push arbitrary 1M-2M overprice premiums that stagnate sales for years, demand 2.5% commission from each party, and abandon them to risky unofficial powers of attorney without developer headquarters endorsement.'}
              </p>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-[#0f172a] text-white rounded-2xl p-6 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold text-[#2dd4bf] bg-[#0f766e]/30 px-3 py-1 rounded-md border border-[#0f766e]">
              {language === 'ar' ? 'الحل المبتكر: معادلة التنازل العادل' : 'The Solution: Zero Overprice Safe Transfer'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {language === 'ar' ? 'طرف محتاج يخرج بأمان، وطرف مستني فرصة ذهبية' : 'One party exits safely; the other secures a generational deal'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {language === 'ar'
                ? `أسسنا ${currentBrand.nameAr} لتكون الجسر الموثوق: البائع يسترد 100% من كل جنيه سدده للمطور كاش وفوراً بمقر الشركة وبدون أي عمولة (0%)، والمشتري يحصل على وحدة بسعر تعاقد قديم أرخص من أسعار اليوم بملايين الجنيهات ويكمل الأقساط الأصلية.`
                : `We founded ${currentBrand.nameEn} as the institutional bridge: Sellers receive 100% of their actual paid cash at developer headquarters with 0% seller commission, while buyers inherit original past pricing and continue existing installment schedules.`}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-[#2dd4bf] font-sans">0%</div>
                <div className="text-xs text-slate-300 font-bold mt-1">
                  {language === 'ar' ? 'عمولة على البائع' : 'Seller Commission'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'ar' ? 'خدمة مجانية بالكامل للمتنازل لاسترداد كامل أمواله.' : 'Completely free service for sellers to exit clean.'}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-white font-sans">100%</div>
                <div className="text-xs text-slate-300 font-bold mt-1">
                  {language === 'ar' ? 'كاش مسترد للبائع' : 'Cash Recovered for Seller'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'ar' ? 'بشيك مصرفي معتمد عند توقيع التنازل الرسمي.' : 'Guaranteed cashier check upon developer assignment.'}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-[#2dd4bf] font-sans">0 {t('egp')}</div>
                <div className="text-xs text-slate-300 font-bold mt-1">
                  {language === 'ar' ? 'أوفر برايس' : 'Overprice Markup'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'ar' ? 'السعر هو نفس المدفوع فقط، موثق بالإيصالات الرسمية.' : 'Units listed exactly at certified historical receipts.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a]">
              {language === 'ar' ? 'المبادئ التي لا نساوم عليها' : 'Our Non-Negotiable Principles'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {language === 'ar'
                ? `ثوابت العمل في ${currentBrand.nameAr} لبناء الثقة في السوق العقاري المصري.`
                : `Core operational commitments building institutional trust across Egypt.`}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#cbd2d9] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#0f172a]">
                {language === 'ar' ? 'الشفافية الكاملة' : 'Absolute Transparency'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'كل رقم معلن على المنصة له مستند رسمي: إيصال سداد أو كشف حساب معتمد من المطور، ولا مكان للتخمين.'
                  : 'Every published figure is audited against official bank receipts or developer ledger statements.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#cbd2d9] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#0f172a]">
                {language === 'ar' ? 'المقر الرسمي فقط' : 'Official Developer HQ Only'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'نرفض التوكيلات العرفية تماماً؛ كل التنازلات تتم داخل إدارة خدمة العملاء لشركة التطوير وبحضور محامينا.'
                  : 'We strictly reject informal powers of attorney; all closings execute at developer customer service desks.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#cbd2d9] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#0f172a]">
                {language === 'ar' ? 'إبراء الذمة واسترداد الشيكات' : 'Full Check Discharge'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'لا نترك البائع حتى يستلم كافة شيكاته المؤجلة ويتم إتلافها رسمياً ويحصل على مخالصة نهائية تبرئ ذمته.'
                  : 'We never exit the closing until all future checks are physically retrieved, voided, and a clearance letter is issued.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#cbd2d9] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#0f172a]">
                {language === 'ar' ? 'السرية والاحترام' : 'Discretion & Privacy'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'رقم شقتك وبياناتك الشخصية لا تظهر في أي إعلان علني، ولا نشارك بياناتك مع مسوقين أو جهات خارجية.'
                  : 'Your unit number and private identity remain confidential and are never published or traded.'}
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Numbers */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#0f766e] font-sans">
                +450M
              </div>
              <div className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'جنيه تم إنقاذها من الغرامات' : 'EGP Saved from Developer Penalties'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#0f172a] font-sans">
                120+
              </div>
              <div className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'عملية تنازل ناجحة ومعتمدة' : 'Successful Audited Transfers'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#0f766e] font-sans">
                0
              </div>
              <div className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'نزاع قانوني أو شيكات معلقة' : 'Legal Disputes or Lingering Checks'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#0f172a] font-sans">
                {language === 'ar' ? '7 أيام' : '7 Days'}
              </div>
              <div className="text-xs font-bold text-slate-700">
                {language === 'ar' ? 'متوسط وقت إيجاد المشتري الجاد' : 'Average Time to Match Buyer'}
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="bg-[#0f172a] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className={`space-y-1 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
            <h3 className="text-xl font-bold text-white">
              {language === 'ar' ? 'هل لديك وحدة وترغب في استرداد أموالك بأمان؟' : 'Hold a unit and wish to exit safely with full cash?'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'تقييم مجاني ومطابقة أوراق خلال أقل من ساعتين مع مستشار قانوني.' : 'Free contract evaluation and document verification within 2 hours.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddUnit}
              className="px-6 py-3 rounded-lg bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md transition-all flex items-center gap-2"
            >
              <span>{t('sellGetCash')}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm cursor-pointer border border-slate-700 transition-all"
            >
              {t('contactUs')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
