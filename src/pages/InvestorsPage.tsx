import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Building2, 
  PieChart, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Briefcase, 
  FileText,
  BadgePercent,
  Bell
} from 'lucide-react';
import { BrandSuggestion, PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface InvestorsPageProps {
  currentBrand: BrandSuggestion;
  onNavigate: (page: PageId) => void;
  onOpenAddUnit: () => void;
}

export const InvestorsPage: React.FC<InvestorsPageProps> = ({
  currentBrand,
  onNavigate,
  onOpenAddUnit
}) => {
  const { language, t, isRTL } = useLanguage();

  // Investor ROI simulator state
  const [dealOldPrice, setDealOldPrice] = useState<number>(6000000);
  const [dealCurrentPrice, setDealCurrentPrice] = useState<number>(10500000);
  const [paidCashToSeller, setPaidCashToSeller] = useState<number>(2400000);
  const [remainingYears, setRemainingYears] = useState<number>(5);

  // VIP Investor Club Unified state
  const [vipName, setVipName] = useState('');
  const [vipPhone, setVipPhone] = useState('');
  const [investorType, setInvestorType] = useState<'individual' | 'fund' | 'family_office'>('individual');
  const [vipBudget, setVipBudget] = useState('5M - 10M EGP');
  const [targetDistricts, setTargetDistricts] = useState<string[]>(['القاهرة الجديدة']);
  const [targetPropertyTypes, setTargetPropertyTypes] = useState<string[]>(['شقق وبنتهاوس']);
  const [whatsappAlertsOnly, setWhatsappAlertsOnly] = useState(true);
  const [vipSubmitted, setVipSubmitted] = useState(false);

  const toggleDistrict = (district: string) => {
    setTargetDistricts(prev => 
      prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
    );
  };

  const togglePropertyType = (type: string) => {
    setTargetPropertyTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Calculations
  const immediateEquityGain = dealCurrentPrice - dealOldPrice;
  const remainingToDeveloper = dealOldPrice - paidCashToSeller;
  const roiOnCash = ((immediateEquityGain / paidCashToSeller) * 100).toFixed(1);
  const annualInstallment = remainingYears > 0 ? Math.round(remainingToDeveloper / remainingYears) : 0;

  const formatEGP = (num: number) => {
    return num.toLocaleString() + ' ' + t('egp');
  };

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVipSubmitted(true);
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-[#f5f6f8] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold border border-[#d1fae5]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'بوابة المستثمرين وصناديق الثروة' : 'Investors & Family Offices Gateway'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-tight">
            {language === 'ar' ? (
              <>استثمر في عقارات مصرية <span className="text-[#0f766e]">بأسعار زمان وبدون أوفر</span></>
            ) : (
              <>Invest in Prime Egyptian Real Estate <span className="text-[#0f766e]">at Historic Prices & 0% Overprice</span></>
            )}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {language === 'ar'
              ? 'الفرصة الاستثمارية الأذكى في 2026: اقتناص وحدات كبار المطورين بأسعار تعاقد 2022-2024 مع خطط أقساط ممتدة، دون دفع جنيه واحد أوفر برايس، وبنقل ملكية رسمي ومحمي 100%.'
              : 'The smartest real estate strategy in 2026: acquire tier-1 developer units locked into 2022–2024 contract valuations with long installment schedules, zero overprice premiums, and 100% legally secured assignments.'}
          </p>
        </div>

        {/* 4 Pillars for Investors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-6 rounded-2xl border border-[#cbd2d9] space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
              <BadgePercent className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0f172a]">
              {language === 'ar' ? 'ربح فوري من اليوم الأول' : 'Instant Day-1 Equity Gain'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'شراء الوحدة بسعر التعاقد القديم يوفر لك فورياً من 30% إلى 50% مقارنة بأسعار نفس المطور لنفس المساحة اليوم.'
                : 'Acquiring at original contract pricing provides an immediate 30% to 50% discount compared to current developer phase prices.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#cbd2d9] space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0f172a]">
              {language === 'ar' ? 'سيولة كاش منخفضة للدخول' : 'Low Cash Down Payment'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'تدفع للبائع فقط ما سدده فعلياً (100% كاش البائع بدون أوفر)، وتكمل باقي الأقساط للمطور على سنوات بدون فوائد بنكية.'
                : 'Pay the original owner strictly what they disbursed to date with zero markup, and continue remaining developer installments interest-free.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#cbd2d9] space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0f172a]">
              {language === 'ar' ? 'مشاريع Sold-Out من الصف الأول' : 'Prime Sold-Out Projects'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'فرص نادرة في مراحل منتهية بالكامل لدى شركات مثل إعمار، بالم هيلز، سوديك، وماونتن فيو لا تجدها في مكاتب المبيعات.'
                : 'Exclusive access to fully sold-out phases across Emaar, Palm Hills, SODIC, and Mountain View unavailable at sales centers.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#cbd2d9] space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#0f172a]">
              {language === 'ar' ? 'أمان قانوني بالمقر الرئيسي' : 'Direct Developer Security'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'إجراءات التنازل تتم بصفة رسمية داخل مقر المطور مع مراجعة خلو النزاعات، واستصدار ملحق عقد جديد يثبت ملكيتك مباشرة.'
                : 'Official assignment protocol at developer corporate HQ, including statement auditing and direct title addendum in your name.'}
            </p>
          </div>
        </div>

        {/* Interactive Investor Yield Simulator */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-[#0f766e] uppercase tracking-wider block mb-1">
              {language === 'ar' ? 'أداة المحاكاة الاستثمارية' : 'Investment Simulator'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a]">
              {language === 'ar' ? 'احسب العائد على رأس المال المدفوع (ROI Simulator)' : 'Calculate Yield & Return on Cash (ROI)'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ar'
                ? 'جرب تغيير أرقام الصفقة وشاهد الفارق الضخم بين سعر التنازل بدون أوفر وأسعار السوق الحالية'
                : 'Adjust the deal parameters below to observe the massive equity gap between 0% overprice assignment and today market pricing.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls (6 cols) */}
            <div className="lg:col-span-6 space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">{language === 'ar' ? 'سعر الوحدة بالعقد القديم (إجمالي):' : 'Original Contract Price (Total):'}</span>
                  <span className="text-[#0f172a] font-sans text-sm">{formatEGP(dealOldPrice)}</span>
                </div>
                <input
                  type="range"
                  min={3000000}
                  max={25000000}
                  step={250000}
                  value={dealOldPrice}
                  onChange={(e) => setDealOldPrice(Number(e.target.value))}
                  className="w-full accent-[#0f766e]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">{language === 'ar' ? 'سعر نفس الوحدة لدى المطور اليوم (Market Value):' : 'Developer Current Market Value Today:'}</span>
                  <span className="text-[#0f766e] font-sans text-sm">{formatEGP(dealCurrentPrice)}</span>
                </div>
                <input
                  type="range"
                  min={5000000}
                  max={40000000}
                  step={500000}
                  value={dealCurrentPrice}
                  onChange={(e) => setDealCurrentPrice(Number(e.target.value))}
                  className="w-full accent-[#0f766e]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">{language === 'ar' ? 'المطلوب سداده كاش للبائع (ما دفعه فعلياً):' : 'Required Cash Down to Seller (Paid Amount):'}</span>
                  <span className="text-amber-800 font-sans text-sm">{formatEGP(paidCashToSeller)}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={dealOldPrice * 0.8}
                  step={100000}
                  value={paidCashToSeller}
                  onChange={(e) => setPaidCashToSeller(Number(e.target.value))}
                  className="w-full accent-[#0f766e]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">{language === 'ar' ? 'عدد سنوات الأقساط المتبقية للمطور:' : 'Remaining Installment Horizon:'}</span>
                  <span className="text-[#0f172a] font-sans text-sm">
                    {remainingYears} {language === 'ar' ? 'سنوات' : 'Years'}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={remainingYears}
                  onChange={(e) => setRemainingYears(Number(e.target.value))}
                  className="w-full accent-[#0f766e]"
                />
              </div>
            </div>

            {/* Results Output (6 cols) */}
            <div className="lg:col-span-6 bg-[#0f172a] text-white p-6 sm:p-8 rounded-2xl space-y-4">
              <div className="text-xs text-[#2dd4bf] font-bold">
                {language === 'ar' ? 'تحليل العائد الاستثماري على الصفقة:' : 'Deal Yield & Equity Breakdown:'}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'صافي الربح الفوري (Equity Gain):' : 'Immediate Equity Gain:'}</span>
                  <strong className="text-xl sm:text-2xl font-black text-[#2dd4bf] font-sans block mt-1">
                    {formatEGP(immediateEquityGain)}
                  </strong>
                  <span className="text-[10px] text-slate-400">{language === 'ar' ? 'وفرته مباشرة من أسعار المطور اليوم' : 'Locked saving vs today developer price'}</span>
                </div>

                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'العائد على الكاش المدفوع:' : 'Day-1 Cash-on-Cash Return:'}</span>
                  <strong className="text-xl sm:text-2xl font-black text-amber-400 font-sans block mt-1">
                    +{roiOnCash}%
                  </strong>
                  <span className="text-[10px] text-slate-400">{language === 'ar' ? 'على السيولة النقدية المستثمرة فوراً' : 'On actual upfront liquidity deployed'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'ar' ? 'المتبقي يسدد للمطور على أقساط:' : 'Remaining Balance in Developer Installments:'}</span>
                  <strong className="font-sans text-white">{formatEGP(remainingToDeveloper)}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'ar' ? 'متوسط القسط السنوي للمطور:' : 'Average Annual Installment to Developer:'}</span>
                  <strong className="font-sans text-white">
                    {formatEGP(annualInstallment)} / {language === 'ar' ? 'سنوياً' : 'yr'}
                  </strong>
                </div>
                <div className="flex justify-between text-[#2dd4bf] font-bold">
                  <span>{language === 'ar' ? 'الأوفر برايس المدفوع للبائع:' : 'Overprice Paid to Seller:'}</span>
                  <span>{language === 'ar' ? '0 ج.م (بدون أي أوفر)' : '0 EGP (Strictly Zero Overprice)'}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('opportunities')}
                className="w-full mt-2 py-3 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs sm:text-sm text-center transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'شاهد الفرص المطابقة في السوق الآن' : 'Explore Matching Market Opportunities'}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

        {/* Institutional & Family Offices Services */}
        <div className="bg-[#0f172a] text-white rounded-2xl p-6 sm:p-10">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 text-[#2dd4bf] text-xs font-bold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'خدمات المحافظ الاستثمارية والمكاتب العائلية' : 'Portfolio & Family Office Advisory'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'ar' ? 'إدارة صفقات المحافظ العقارية المجمعة (Bulk Portfolios)' : 'Bulk Portfolios & Distressed Asset Acquisitions'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {language === 'ar'
                ? 'إذا كنت مديراً لصندوق استثماري أو مكتب عائلي وتبحث عن الاستحواذ على حزم أصول التخارج وإعادة الهيكلة لدى كبار المطورين بخصم نقدي هائل، نوفر لك:'
                : 'For private equity funds, corporate treasuries, and family offices seeking syndicated block purchases of high-end exit units with deep cash discounts:'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 text-xs">
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-[#2dd4bf]">
                {language === 'ar' ? 'فحص قانوني وائتماني مسبق' : 'Legal & Credit Due Diligence'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'تقارير فحص نافي للجهالة (Due Diligence) لكل وحدة، والتأكد من مطابقة كشوف الحسابات وخلو الوحدات من أي حظر أو نزاع.'
                  : 'Comprehensive title audit reports, financial reconciliation with developers, and clean non-encumbrance certifications.'}
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-[#2dd4bf]">
                {language === 'ar' ? 'تسوية جماعية لدى المطور' : 'Corporate Developer Settlement'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'إدارة بروتوكولات التنازل المجمع لدى الإدارات العليا لشركات التطوير والحصول على شروط دفع مرنة.'
                  : 'Executive-level multi-unit transfer negotiations, waiver of transfer fees, and restructured installment schedules.'}
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-[#2dd4bf]">
                {language === 'ar' ? 'استراتيجية إعادة البيع أو التأجير' : 'Exit Strategy & Dollarized Yield'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {language === 'ar'
                  ? 'خطط تسييل وجني أرباح واضحة بعد التسليم أو استثمار العائد الإيجاري الدولاري في مشروعات الشيخ زايد والقاهرة الجديدة.'
                  : 'Structured liquidity horizons upon handover, secondary resale orchestration, or corporate tenant leasing yielding FX returns.'}
              </p>
            </div>
          </div>
        </div>

        {/* VIP Investor Alert Club Form */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-6 sm:p-10 shadow-xs max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
              ⚡ {language === 'ar' ? 'قائمة المستثمرين الخاصة (Off-Market Alerts)' : 'VIP Investor Club (Off-Market Alerts)'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-2">
              {language === 'ar' ? 'انضم لنادي المستثمرين لتصلك الصفقات العاجلة قبل نشرها' : 'Get Priority Alerts 48 Hours Before Public Listing'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ar'
                ? 'الصفقات بصفر أوفر برايس وسعر عقد 2022 تنتهي في ساعات. نرسل إشعارات خاصة للأعضاء المعتمدين قبل الطرح العام بـ 48 ساعة.'
                : 'Zero-overprice prime units sell within hours. Registered private investors receive priority private notifications.'}
            </p>
          </div>

          {vipSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0f766e] border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  {language === 'ar' ? 'تم تفعيل عضويتك في قائمة المستثمرين VIP بنجاح!' : 'VIP Investor Membership Activated!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {language === 'ar'
                    ? 'تم تسجيل معايير محفظتك وسيقوم مدير علاقات كبار المستثمرين بالتواصل معك عبر واتساب لتأكيد قنوات إرسال الصفقات العاجلة.'
                    : 'Your investment parameters have been archived. A senior wealth relationship officer will contact you via WhatsApp with off-market deal packets.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 max-w-md mx-auto text-right space-y-1">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{language === 'ar' ? 'المستثمر:' : 'Investor:'}</span>
                  <span className="font-bold">{vipName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{language === 'ar' ? 'السيولة المتاحة:' : 'Liquid Capital:'}</span>
                  <span className="font-bold text-[#0f766e]">{vipBudget}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{language === 'ar' ? 'المناطق المحددة:' : 'Districts:'}</span>
                  <span className="font-bold truncate max-w-[200px]">{targetDistricts.join('، ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'الأصول المطلوبة:' : 'Asset Types:'}</span>
                  <span className="font-bold truncate max-w-[200px]">{targetPropertyTypes.join('، ')}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVipSubmit} className="space-y-4 text-xs">
              {/* Row 1: Name & Phone */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'اسم المستثمر / ممثل الكيان:' : 'Investor / Entity Representative:'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'الاسم بالكامل...' : 'Full Name...'}
                    value={vipName}
                    onChange={(e) => setVipName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'رقم الموبايل (واتساب للإشعارات):' : 'Mobile / WhatsApp (For Priority Alerts):'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="010XXXXXXXX"
                    value={vipPhone}
                    onChange={(e) => setVipPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg focus:outline-none focus:border-[#0f766e]"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 2: Investor Type & Liquid Capital */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'صفة المستثمر:' : 'Investor Classification:'}
                  </label>
                  <select
                    value={investorType}
                    onChange={(e) => setInvestorType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg focus:outline-none focus:border-[#0f766e]"
                  >
                    <option value="individual">{language === 'ar' ? 'مستثمر فردي (Private Individual)' : 'Private Individual'}</option>
                    <option value="family_office">{language === 'ar' ? 'مكتب عائلي (Family Office)' : 'Family Office'}</option>
                    <option value="fund">{language === 'ar' ? 'صندوق استثمار / شركة إدارة أصول' : 'Investment Fund / Asset Mgmt'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'السيولة الكاش الجاهزة للدخول فوراً:' : 'Available Ready Cash for Instant Entry:'}
                  </label>
                  <select
                    value={vipBudget}
                    onChange={(e) => setVipBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg focus:outline-none focus:border-[#0f766e]"
                  >
                    <option value="2M - 5M EGP">{language === 'ar' ? '2 مليون إلى 5 مليون ج.م' : '2M to 5M EGP'}</option>
                    <option value="5M - 10M EGP">{language === 'ar' ? '5 مليون إلى 10 مليون ج.م' : '5M to 10M EGP'}</option>
                    <option value="10M - 20M EGP">{language === 'ar' ? '10 مليون إلى 20 مليون ج.م' : '10M to 20M EGP'}</option>
                    <option value="+20M EGP">{language === 'ar' ? 'أكثر من 20 مليون ج.م (محافظ مجمعة)' : 'Over 20M EGP (Bulk Portfolios)'}</option>
                  </select>
                </div>
              </div>

              {/* Target Regions Checklist */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  {language === 'ar' ? 'المناطق المستهدفة (يمكن اختيار أكثر من منطقة):' : 'Target Regions of Interest:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'القاهرة الجديدة',
                    'الشيخ زايد وأكتوبر',
                    'الساحل الشمالي',
                    'العاصمة الإدارية',
                    'المستقبل والشروق',
                    'البحر الأحمر والجونة'
                  ].map((district) => {
                    const isSelected = targetDistricts.includes(district);
                    return (
                      <button
                        type="button"
                        key={district}
                        onClick={() => toggleDistrict(district)}
                        className={`p-2 rounded-lg border text-start transition-all cursor-pointer flex items-center justify-between text-[11px] font-bold ${
                          isSelected
                            ? 'bg-[#0f766e]/10 border-[#0f766e] text-[#0f766e]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{district}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0f766e] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Types */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  {language === 'ar' ? 'نوعية الأصول المطلوبة:' : 'Target Asset Types:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'شقق وبنتهاوس',
                    'فيلات وتاون هاوس',
                    'تجاري وإداري (عيادات/مكاتب)',
                    'شاليهات ساحلية',
                    'أصول جاهزة للاستلام الفوري',
                    'أي فرصة بخصم تاريخي يتجاوز 40%'
                  ].map((type) => {
                    const isSelected = targetPropertyTypes.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => togglePropertyType(type)}
                        className={`p-2 rounded-lg border text-start transition-all cursor-pointer flex items-center justify-between text-[11px] font-bold ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{type}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notification Preference */}
              <div className="bg-[#ecfdf5] border border-[#d1fae5] p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0f766e] shrink-0" />
                  <span className="text-[11px] text-[#0f766e] font-bold">
                    {language === 'ar' ? 'إرسال ملف الصفقات بصيغة PDF عبر واتساب قبل الطرح بـ 48 ساعة' : 'Deliver encrypted deal dossiers via WhatsApp 48h prior to public listing'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlertsOnly}
                  onChange={(e) => setWhatsappAlertsOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#0f766e] cursor-pointer"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'تأكيد الانضمام واستلام صفقات الأوف ماركت' : 'Confirm Membership & Receive Off-Market Alerts'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {language === 'ar'
                    ? 'بياناتك الاستثمارية سرية ومحمية، ولا تُشارك مع أي طرف خارجي.'
                    : 'Strictly confidential and encrypted under banking NDA standards.'}
                </span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
