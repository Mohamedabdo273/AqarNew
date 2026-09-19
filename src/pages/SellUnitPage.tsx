import React, { useState } from 'react';
import { 
  Building, 
  Coins, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  FileUp, 
  Lock, 
  Calculator, 
  Sparkles,
  Scale,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { BrandSuggestion, PageId, PropertyType, RealEstateUnit } from '../types';
import { SafeExitCalculator } from '../components/SafeExitCalculator';
import { useUnits } from '../context/UnitsContext';
import { useLanguage } from '../context/LanguageContext';

interface SellUnitPageProps {
  currentBrand: BrandSuggestion;
  onNavigate: (page: PageId) => void;
  onOpenAddUnitModal: () => void;
}

export const SellUnitPage: React.FC<SellUnitPageProps> = ({
  currentBrand,
  onNavigate,
  onOpenAddUnitModal
}) => {
  const { addUnit } = useUnits();
  const { language, t, isRTL } = useLanguage();
  // Direct form submission state
  const [developer, setDeveloper] = useState('');
  const [compound, setCompound] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('شقة');
  const [region, setRegion] = useState<'القاهرة الجديدة' | 'الشيخ زايد وأكتوبر' | 'العاصمة الإدارية' | 'الساحل الشمالي' | 'المستقبل والشروق' | 'البحر الأحمر'>('القاهرة الجديدة');
  const [areaM2, setAreaM2] = useState<number>(160);
  const [contractPrice, setContractPrice] = useState<number>(5000000);
  const [paidAmount, setPaidAmount] = useState<number>(2000000);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [newlyCreatedUnit, setNewlyCreatedUnit] = useState<RealEstateUnit | null>(null);

  const formatEGP = (num: number) => {
    return num.toLocaleString() + ' ' + t('egp');
  };

  const remaining = Math.max(0, contractPrice - paidAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addUnit({
      developer: developer || (language === 'ar' ? 'مطور عقاري معتمد' : 'Verified Developer'),
      compound: compound || (language === 'ar' ? `كمبوند ${developer}` : `Compound ${developer}`),
      propertyType,
      region,
      areaM2: Number(areaM2) || 160,
      originalContractPrice: Number(contractPrice),
      paidCashAmount: Number(paidAmount),
      installmentValue: Math.round(remaining / 20),
      ownerName,
      ownerPhone,
      uploadedFileName: fileName || undefined
    });
    setNewlyCreatedUnit(created);
    setSubmitted(true);
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-[#f5f6f8] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold border border-[#d1fae5]">
            <Coins className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'بوابة البائع والمتنازل • عمولة 0% عليك' : 'Seller & Assignment Gateway • 0% Commission on Sellers'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-tight">
            {language === 'ar' ? (
              <>بيع وحدتك للتنازل واسترد <span className="text-[#0f766e]">100% كاش فوري</span></>
            ) : (
              <>Assign Your Contract & Recover <span className="text-[#0f766e]">100% Cash</span></>
            )}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {language === 'ar'
              ? 'لا داعي للخسارة في غرامات المطور (15% من ثمن الوحدة) ولا تجميد البيع بأوفر برايس غير واقعي. تنازل عن وحدتك رسمياً في مقر المطور، استرجع ما دفعته كاملاً بشيك مصرفي، واسترد شيكاتك المؤجلة.'
              : 'Avoid losing 15% in developer cancellation penalties or languishing with inflated resale premiums. Assign your unit officially at developer headquarters, recover 100% of your paid cash via cashier check, and retrieve all deferred bank checks.'}
          </p>
        </div>

        {/* 3 Exit Options Comparison */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-4 sm:p-8 lg:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a]">
              {language === 'ar' ? 'قارن بين خياراتك الثلاثة للخروج من عبء الأقساط' : 'Compare Your 3 Exit Options from Installment Burdens'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ar' ? 'لماذا نموذج التنازل هو الخيار الأكثر أماناً ووفراً للبائع؟' : 'Why the verified contract assignment model provides total capital recovery and peace of mind.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Option 1: Developer */}
            <div className="p-5 rounded-xl bg-red-50/70 border border-red-200 space-y-3">
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded">
                {language === 'ar' ? 'الخيار 1: الفسخ مع المطور' : 'Option 1: Developer Cancellation'}
              </span>
              <h3 className="font-bold text-base text-[#0f172a]">
                {language === 'ar' ? 'خسارة قاسية + تأخير سنوات' : 'Hefty Penalties + Multi-Year Delays'}
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                {language === 'ar' ? (
                  <>
                    <li>خصم من 10% إلى 15% من <strong>إجمالي ثمن الوحدة</strong>.</li>
                    <li>تأخير رد المتبقي لك على أقساط لمدد تصل إلى 3 سنوات.</li>
                    <li>تعقيدات روتينية ومماطلة في تسليم الشيكات.</li>
                  </>
                ) : (
                  <>
                    <li>10% to 15% deducted from the <strong>TOTAL property price</strong>.</li>
                    <li>Refund delayed over installments spanning up to 3 years.</li>
                    <li>Tedious administrative bureaucracy to retrieve checks.</li>
                  </>
                )}
              </ul>
              <div className="pt-2 text-xs font-bold text-red-700">
                {language === 'ar' ? 'النتيجة: ضياع جزء كبير من رأس مالك.' : 'Outcome: Heavy capital loss and prolonged stress.'}
              </div>
            </div>

            {/* Option 2: Traditional Broker */}
            <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded">
                {language === 'ar' ? 'الخيار 2: الريسيل العادي والسماسرة' : 'Option 2: Traditional Resale Brokers'}
              </span>
              <h3 className="font-bold text-base text-[#0f172a]">
                {language === 'ar' ? 'أوفر برايس يعطل البيع' : 'Overprice Freezes Buyer Interest'}
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                {language === 'ar' ? (
                  <>
                    <li>مطالبتك بطلب أوفر برايس بمليون أو أكثر يرفضه المشترون.</li>
                    <li>عمولة 2.5% تخصم منك كوسيط.</li>
                    <li>إعلانات عامة وإزعاج مستمر باتصالات عشوائية.</li>
                    <li>مخاطر التوكيلات العرفية خارج مقر المطور.</li>
                  </>
                ) : (
                  <>
                    <li>Speculative multi-million overprices turn buyers away.</li>
                    <li>2.5% brokerage commission deducted from your proceeds.</li>
                    <li>Public listings result in endless unsolicited spam calls.</li>
                    <li>Risks of informal powers-of-attorney outside developer HQ.</li>
                  </>
                )}
              </ul>
              <div className="pt-2 text-xs font-bold text-amber-800">
                {language === 'ar' ? 'النتيجة: شهور انتظار وأقساط مستمرة تتراكم عليك.' : 'Outcome: Months of stagnation while installments accumulate.'}
              </div>
            </div>

            {/* Option 3: Tanazul Platform */}
            <div className="p-5 rounded-xl bg-[#ecfdf5] border-2 border-[#0f766e] space-y-3 relative shadow-xs">
              <div className={`absolute -top-3 ${isRTL ? 'left-4' : 'right-4'} bg-[#0f766e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full`}>
                {language === 'ar' ? 'الخيار الأضمن 100%' : '100% Guaranteed Safe Exit'}
              </div>
              <span className="text-xs font-bold text-[#0f766e] bg-white px-2.5 py-1 rounded border border-[#d1fae5]">
                {language === 'ar' ? `الخيار 3: التنازل في ${currentBrand.nameAr}` : `Option 3: Assignment via ${currentBrand.nameEn}`}
              </span>
              <h3 className="font-bold text-base text-[#0f172a]">
                {language === 'ar' ? 'استرداد كامل الكاش + عمولة 0%' : '100% Cash Recovery + 0% Commission'}
              </h3>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside font-medium">
                {language === 'ar' ? (
                  <>
                    <li>استرداد 100% من كل جنيه سددته بدون أي خصم.</li>
                    <li>عمولة 0% مجاناً على البائع (لا نتقاضى مليم منك).</li>
                    <li>بيع سريع خلال 3 - 7 أيام لأن الوحدة بدون أوفر.</li>
                    <li>استلام شيك مصرفي معتمد واسترداد كافة شيكاتك المؤجلة.</li>
                    <li>التنازل الرسمي بمقر المطور بحضور محامي المنصة.</li>
                  </>
                ) : (
                  <>
                    <li>Recover 100% of every pound paid with zero deductions.</li>
                    <li>0% seller commission (completely free for exit owners).</li>
                    <li>Swift matched exit in 3 to 7 days due to zero overprice.</li>
                    <li>Receive certified cashier check & retrieve all old checks.</li>
                    <li>Official assignment at developer HQ with platform legal counsel.</li>
                  </>
                )}
              </ul>
              <div className="pt-2 text-xs font-black text-[#0f766e]">
                {language === 'ar' ? 'النتيجة: خروج فوري بكامل رأس مالك وراحة بال تامة.' : 'Outcome: Instant clean exit, full liquidity & total peace of mind.'}
              </div>
            </div>
          </div>
        </div>

        {/* Sell Form On-Page */}
        <div id="sell-form" className="bg-white rounded-2xl border border-[#cbd2d9] p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-[#0f766e] uppercase tracking-wider block mb-1">
              {language === 'ar' ? 'سجل وحدتك الآن' : 'List Your Unit Now'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a]">
              {language === 'ar' ? 'بيانات الوحدة والمبالغ المطلوبة' : 'Property Details & Cash Figures'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ar'
                ? 'أدخل بيانات وحدتك وسيقوم فريق التقييم بمطابقة كشف حساب المطور والرد خلال ساعتين'
                : 'Enter your unit parameters; our audit desk reconciles statements with developer records within 2 hours.'}
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 bg-[#ecfdf5] text-[#0f766e] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[#0f172a]">
                {language === 'ar' ? 'تم إدراج وحدتك بنجاح في المنصة!' : 'Your unit was successfully submitted!'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar' ? (
                  <>
                    شكراً لك يا <strong>{ownerName || 'فندم'}</strong>. استلمنا بيانات وحدتك في مشروع ({compound || developer})، ورقم الفحص التوثيقي: <span className="font-mono font-bold text-[#0f766e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{newlyCreatedUnit?.verificationCode || 'TNZ-VERIFIED'}</span>.
                  </>
                ) : (
                  <>
                    Thank you <strong>{ownerName || 'Sir/Madam'}</strong>. We received your listing in ({compound || developer}). Audit Ref: <span className="font-mono font-bold text-[#0f766e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{newlyCreatedUnit?.verificationCode || 'TNZ-VERIFIED'}</span>.
                  </>
                )}
              </p>
              <div className={`p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'المبلغ المراد استرداده كاش:' : 'Target Cash Recovery:'}</span>
                  <strong className="text-[#0f766e] font-bold text-sm">{formatEGP(paidAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'العمولة على البائع:' : 'Seller Fee:'}</span>
                  <strong className="text-emerald-700 font-bold">{language === 'ar' ? '0% مجاناً 100%' : '0% Completely Free'}</strong>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="px-5 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>{language === 'ar' ? 'تصفح وحدتك في سوق الفرص' : 'View Opportunities Marketplace'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  {language === 'ar' ? 'إضافة وحدة أخرى' : 'Add Another Unit'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              {/* Step 1: Unit details */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#0f172a] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-xs">1</span>
                  <span>{language === 'ar' ? 'بيانات المشروع والمطور' : 'Project & Developer Details'}</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'المطور العقاري:' : 'Developer:'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'مثال: بالم هيلز، سوديك، إعمار، ماونتن فيو...' : 'e.g. Palm Hills, SODIC, Emaar, Mountain View...'}
                      value={developer}
                      onChange={(e) => setDeveloper(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'اسم الكمبوند / المشروع:' : 'Compound / Project:'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'مثال: بادية، فيليت، هايد بارك، مراسي...' : 'e.g. Badya, Villette, Hyde Park, Marassi...'}
                      value={compound}
                      onChange={(e) => setCompound(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{language === 'ar' ? 'نوع الوحدة:' : 'Type:'}</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
                    >
                      <option value="شقة">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                      <option value="تاون هاوس">{language === 'ar' ? 'تاون هاوس' : 'Townhouse'}</option>
                      <option value="فيلا مستقلة">{language === 'ar' ? 'فيلا مستقلة' : 'Standalone Villa'}</option>
                      <option value="دوبلكس">{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                      <option value="تجاري / محل">{language === 'ar' ? 'تجاري / محل' : 'Retail Shop'}</option>
                      <option value="شاليه ساحلي">{language === 'ar' ? 'شاليه ساحلي' : 'Coastal Chalet'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{language === 'ar' ? 'المنطقة:' : 'Region:'}</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
                    >
                      <option value="القاهرة الجديدة">{language === 'ar' ? 'القاهرة الجديدة' : 'New Cairo'}</option>
                      <option value="الشيخ زايد وأكتوبر">{language === 'ar' ? 'الشيخ زايد وأكتوبر' : 'Sheikh Zayed & October'}</option>
                      <option value="العاصمة الإدارية">{language === 'ar' ? 'العاصمة الإدارية' : 'New Capital'}</option>
                      <option value="الساحل الشمالي">{language === 'ar' ? 'الساحل الشمالي' : 'North Coast'}</option>
                      <option value="المستقبل والشروق">{language === 'ar' ? 'المستقبل والشروق' : 'Mostakbal & Shorouk'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{language === 'ar' ? 'المساحة (م²):' : 'Area (sqm):'}</label>
                    <input
                      type="number"
                      min={30}
                      max={2000}
                      value={areaM2}
                      onChange={(e) => setAreaM2(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Financial Details */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="font-bold text-sm text-[#0f172a] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-xs">2</span>
                  <span>{language === 'ar' ? 'الأرقام المالية والمدفوعات' : 'Financial Statements & Paid Cash'}</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'إجمالي ثمن الوحدة في العقد الأصلي (ج.م):' : 'Original Contract Price (EGP):'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      step={50000}
                      value={contractPrice}
                      onChange={(e) => setContractPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'المبلغ الذي سددته فعلياً (المطلوب استرداده كاش):' : 'Paid Cash Amount to Recover:'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      step={25000}
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg font-sans text-[#0f766e] font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="bg-[#ecfdf5] border border-[#d1fae5] p-3 rounded-xl flex items-center justify-between text-xs text-[#0f766e]">
                  <span>
                    {language === 'ar' ? 'المتبقي يسدده المشتري الجديد للمطور بالأقساط: ' : 'Remaining to Developer in Installments: '}
                    <strong>{formatEGP(remaining)}</strong>
                  </span>
                  <span className="font-bold">{language === 'ar' ? 'أوفر برايس عليك: 0 ج.م' : 'Overprice: 0 EGP'}</span>
                </div>
              </div>

              {/* Step 3: Owner & Contact Details */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="font-bold text-sm text-[#0f172a] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0f172a] text-white flex items-center justify-center text-xs">3</span>
                  <span>{language === 'ar' ? 'بيانات المالك للتوثيق والسرية' : 'Owner Contact & Confidentiality'}</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'اسم المالك (كما بالعقد):' : 'Owner Name (as per contract):'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'الاسم الثلاثي...' : 'Full Name...'}
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'رقم الموبايل (واتساب مباشر):' : 'Phone / WhatsApp:'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010XXXXXXXX"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
                    />
                  </div>
                </div>

                {/* Upload File */}
                <div className="border border-dashed border-[#cbd2d9] rounded-xl p-4 text-center bg-slate-50">
                  <FileUp className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {language === 'ar'
                      ? 'إرفاق صورة كشف الحساب أو إيصال السداد (اختياري للفحص الفوري السريع)'
                      : 'Attach Statement or Receipt copy (optional for fast-track audit)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    id="sell-upload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="sell-upload"
                    className="inline-block mt-2 px-3 py-1 bg-white border border-[#cbd2d9] rounded-md text-[11px] font-bold text-slate-700 cursor-pointer hover:bg-slate-50"
                  >
                    {fileName
                      ? (language === 'ar' ? `تم اختيار: ${fileName}` : `Selected: ${fileName}`)
                      : (language === 'ar' ? 'اختر ملفاً من جهازك' : 'Choose file from device')}
                  </label>
                </div>

                <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] text-slate-600 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#0f766e] shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'تأكيد السرية: رقم شقتك وبياناتك الشخصية لا تظهر في أي إعلان علني، ولا نتقاضى أي مصاريف منك.'
                      : 'Confidentiality Assurance: Your unit number and personal data remain private; zero seller fees.'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'تأكيد إرسال طلب التنازل واسترداد الكاش' : 'Submit Assignment Request & Recover Cash'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Embedded Calculator */}
        <div>
          <SafeExitCalculator
            onStartExitRequest={(contractP, paidP, dev) => {
              setContractPrice(contractP);
              setPaidAmount(paidP);
              setDeveloper(dev);
              const el = document.getElementById('sell-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

      </div>
    </div>
  );
};
