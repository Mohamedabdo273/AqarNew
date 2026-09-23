import React, { useState } from 'react';
import { 
  Repeat, 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  FileCheck2,
  RefreshCw,
  Send,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { RealEstateUnit, BrandSuggestion } from '../types';

interface PropertySwapPageProps {
  currentBrand: BrandSuggestion;
  onSelectUnit: (unit: RealEstateUnit) => void;
  onOpenAddUnit: () => void;
}

export const PropertySwapPage: React.FC<PropertySwapPageProps> = ({
  currentBrand,
  onSelectUnit,
  onOpenAddUnit
}) => {
  const { t, language, isRTL } = useLanguage();
  const { units } = useUnits();

  // Swap Form State
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    currentUnitType: 'شقة',
    currentLocation: 'التجمع الخامس / القاهرة الجديدة',
    currentDeveloper: '',
    currentCompound: '',
    currentAreaM2: 160,
    bedrooms: 3,
    floor: 'الدور الثالث',
    finishing: 'نصف تشطيب',
    paidCash: '2,000,000 ج.م',
    remainingContractPrice: '3,000,000 ج.م',
    installmentPerQuarter: '120,000 ج.م',
    nextInstallmentDate: '2026-11-01',
    desiredType: 'مكتب إداري / عيادة',
    desiredLocation: 'القاهرة الجديدة أو الشيخ زايد',
    desiredMaxInstallment: '40,000 ج.م',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const swapEligibleUnits = units.filter(u => u.eligibleForSwap);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0f766e] text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2dd4bf]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#2dd4bf] text-xs font-bold border border-white/15">
              <Repeat className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{language === 'ar' ? 'خدمة حصرية وغير مسبوقة في السوق المصري' : 'Exclusive Real Estate Swap Service'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {language === 'ar' ? (
                <>تبديل عقارك الذكي <br className="hidden sm:inline" />
                <span className="text-[#2dd4bf]">بدّل وحدتك.. واستمر في السوق دون تعثر</span></>
              ) : (
                <>Smart Property Swap & Switch <br className="hidden sm:inline" />
                <span className="text-[#2dd4bf]">Reallocate Your Assets Without Liquidating</span></>
              )}
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              {language === 'ar'
                ? 'هل أصبحت أقساط وحدتك السكنية عبئاً ثقيلاً ولكنك لا تريد الخروج من السوق العقاري؟ تتيح لك منظومتنا مبادلة وحدتك بأصل تجاري أو إداري أو سكني مدفوع بالكامل أو بأقساط ميسرة تناسب دخلك، مع إجراءات نقل ملكية رسمية بمقر المطور.'
                : 'Heavy installment burdens? Keep your capital working in real estate. Swap into a commercial office, clinic, or smaller residential unit with lower installments or fully paid equity.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" />
                {language === 'ar' ? 'دون غرامات فسخ المطور' : 'Zero Developer Penalties'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" />
                {language === 'ar' ? 'تسوية الفروق المالية بشيكات مصرفية' : 'Equity Difference via Certified Checks'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" />
                {language === 'ar' ? 'عقود وإبراء ذمة رسمي' : 'Official Legal Discharges'}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Swap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f766e]/10 text-[#0f766e] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'من سكني كبير إلى تجاري/إداري' : 'From Large Residential to Commercial'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'حوّل فيلا أو دوبلكس بأقساط ضخمة إلى مكتب إداري أو محل تجاري يؤجّر بعائد دوري يغطي أي التزامات أخرى.'
                : 'Convert a high-liability villa into an income-generating office or retail unit.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'تخفيض عبء القسط بنسبة 70%' : 'Slash Installment Burdens by 70%'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'استبدل شقة قسطها 120 ألف شهرياً بشقة مساحة أصغر قسطها 35 ألف فقط مع استرداد فرق المدفوع كاش.'
                : 'Downscale to a smaller unit with lightweight installments while getting cash back for the difference.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'مقاصة مالية وقانونية معتمدة' : 'Audited Legal & Financial Clearing'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'تتم عملية المبادلة بالتنسيق التام بين شركتي التطوير وإصدار ملاحق تنازل متزامنة وإلغاء شيكات الطرفين القديمة.'
                : 'Simultaneous developer assignment addenda with full replacement of liability checks.'}
            </p>
          </div>
        </div>

        {/* Main Content Layout: Form & Available Swaps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Swap Application Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#0f766e] bg-[#0f766e]/10 px-2 py-0.5 rounded">
                {language === 'ar' ? 'طلب مناقلة فوري' : 'Direct Swap Request'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                {language === 'ar' ? 'اعرض وحدتك للمبادلة الذكية' : 'List Your Unit for Smart Swap'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ar'
                  ? 'سيتولى مستشار الاستثمار والمناقلة مطابقة طلبك مع الفرص المتاحة في قاعدة بياناتنا.'
                  : 'Our investment matching team will pair your property with qualified counterpart opportunities.'}
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'ar' ? 'تم استلام طلب المناقلة بنجاح!' : 'Swap Request Registered!'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'يقوم فريق المطابقة حالياً بفحص الوحدات المتوافقة مع متطلباتك، وسيتواصل معك مستشار التخارج خلال 24 ساعة بمقترحات ملموسة.'
                    : 'Our matching desk is auditing compatible assets. An advisor will contact you within 24 hours.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-[#0f766e] hover:underline cursor-pointer"
                >
                  {language === 'ar' ? 'إرسال طلب آخر' : 'Submit another request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder={language === 'ar' ? 'مثال: م. أحمد عبد الرحمن' : 'e.g. Eng. Ahmed'}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    {language === 'ar' ? 'رقم الهاتف (واتساب)' : 'Phone Number (WhatsApp)'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      {language === 'ar' ? 'نوع وحدتك الحالية' : 'Current Property Type'}
                    </label>
                    <select
                      value={formData.currentUnitType}
                      onChange={(e) => setFormData({ ...formData, currentUnitType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0f766e]"
                    >
                      <option value="شقة">{language === 'ar' ? 'شقة سكنية' : 'Apartment'}</option>
                      <option value="فيلا مستقلة">{language === 'ar' ? 'فيلا مستقلة' : 'Standalone Villa'}</option>
                      <option value="تاون هاوس">{language === 'ar' ? 'تاون هاوس / توين' : 'Townhouse'}</option>
                      <option value="دوبلكس">{language === 'ar' ? 'دوبلكس / بنتهاوس' : 'Duplex'}</option>
                      <option value="شاليه">{language === 'ar' ? 'شاليه ساحلي' : 'Chalet'}</option>
                      <option value="تجاري">{language === 'ar' ? 'تجاري / إداري' : 'Commercial / Admin'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      {language === 'ar' ? 'المساحة الإجمالية (م²)' : 'Area (sqm)'}
                    </label>
                    <input
                      type="number"
                      value={formData.currentAreaM2}
                      onChange={(e) => setFormData({ ...formData, currentAreaM2: Number(e.target.value) })}
                      placeholder="160"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      {language === 'ar' ? 'المطور العقاري' : 'Developer'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.currentDeveloper}
                      onChange={(e) => setFormData({ ...formData, currentDeveloper: e.target.value })}
                      placeholder={language === 'ar' ? 'بالم هيلز، سوديك، ماونتن فيو...' : 'e.g. SODIC'}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      {language === 'ar' ? 'اسم المشروع / الكمبوند' : 'Compound Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.currentCompound}
                      onChange={(e) => setFormData({ ...formData, currentCompound: e.target.value })}
                      placeholder={language === 'ar' ? 'بادية، فيليت، ايست تاون...' : 'e.g. Badya'}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 text-[11px]">
                      {language === 'ar' ? 'عدد الغرف' : 'Bedrooms'}
                    </label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4+</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 text-[11px]">
                      {language === 'ar' ? 'الدور' : 'Floor'}
                    </label>
                    <input
                      type="text"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      placeholder={language === 'ar' ? 'الثالث' : '3rd'}
                      className="w-full px-2 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800 text-[11px]">
                      {language === 'ar' ? 'التشطيب' : 'Finishing'}
                    </label>
                    <select
                      value={formData.finishing}
                      onChange={(e) => setFormData({ ...formData, finishing: e.target.value })}
                      className="w-full px-2 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="نصف تشطيب">{language === 'ar' ? 'نصف تشطيب' : 'Semi'}</option>
                      <option value="تشطيب كامل">{language === 'ar' ? 'تشطيب كامل' : 'Finished'}</option>
                      <option value="طوب أحمر">{language === 'ar' ? 'طوب أحمر' : 'Core'}</option>
                    </select>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {language === 'ar' ? 'التدقيق المالي للوحدة الحالية:' : 'Financial Audit Details:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">
                        {language === 'ar' ? 'المسدد كاش حتى الآن (ج.م)' : 'Paid Cash to Date'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.paidCash}
                        onChange={(e) => setFormData({ ...formData, paidCash: e.target.value })}
                        placeholder="2,000,000"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-teal-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">
                        {language === 'ar' ? 'المتبقي أقساط للمطور' : 'Remaining Installments'}
                      </label>
                      <input
                        type="text"
                        value={formData.remainingContractPrice}
                        onChange={(e) => setFormData({ ...formData, remainingContractPrice: e.target.value })}
                        placeholder="3,000,000"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">
                        {language === 'ar' ? 'قيمة القسط الدوري' : 'Installment Value'}
                      </label>
                      <input
                        type="text"
                        value={formData.installmentPerQuarter}
                        onChange={(e) => setFormData({ ...formData, installmentPerQuarter: e.target.value })}
                        placeholder="120,000"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600">
                        {language === 'ar' ? 'تاريخ الاستحقاق القادم' : 'Next Due Date'}
                      </label>
                      <input
                        type="date"
                        value={formData.nextInstallmentDate}
                        onChange={(e) => setFormData({ ...formData, nextInstallmentDate: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <span className="text-[11px] font-bold text-slate-700 block mb-2">
                    {language === 'ar' ? 'ما هو الأصل والهدف الذي ترغب في المبادلة به؟' : 'Target Asset for Swap:'}
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-medium text-slate-600 text-[11px]">
                        {language === 'ar' ? 'النوع المطلوب' : 'Desired Type'}
                      </label>
                      <select
                        value={formData.desiredType}
                        onChange={(e) => setFormData({ ...formData, desiredType: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="مكتب إداري / عيادة">{language === 'ar' ? 'مكتب إداري / عيادة' : 'Office / Clinic'}</option>
                        <option value="محل تجاري">{language === 'ar' ? 'محل تجاري' : 'Retail'}</option>
                        <option value="شقة سكنية أصغر">{language === 'ar' ? 'شقة سكنية بقسط أقل' : 'Smaller Apartment'}</option>
                        <option value="شاليه ساحلي">{language === 'ar' ? 'شاليه ساحلي' : 'Coastal Chalet'}</option>
                        <option value="أرض">{language === 'ar' ? 'قطعة أرض' : 'Land Plot'}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-slate-600 text-[11px]">
                        {language === 'ar' ? 'الحد الأقصى للقسط المستهدف' : 'Target Max Installment'}
                      </label>
                      <input
                        type="text"
                        value={formData.desiredMaxInstallment}
                        onChange={(e) => setFormData({ ...formData, desiredMaxInstallment: e.target.value })}
                        placeholder={language === 'ar' ? 'مثال: 40,000 ج.م' : 'e.g. 40,000 EGP'}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تقديم طلب دراسة المبادلة' : 'Submit Swap Inquiry'}</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  {language === 'ar' 
                    ? 'بياناتك مشفرة ومحمية بسرية مصرفية تامة، ولا يتم مشاركتها إلا بعد موافقتك المسبقة.' 
                    : 'Your information is fully encrypted and never shared without consent.'}
                </p>
              </form>
            )}
          </div>

          {/* Currently Available Swap Opportunities (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {language === 'ar' ? 'فرص مناقلة معروضة حالياً' : 'Live Opportunities Open for Swap'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'ملاك وحدات جاهزون للمبادلة الفورية مع تسوية الفروق' : 'Verified owners ready for immediate mutual contract assignments'}
                </p>
              </div>
              <span className="text-xs font-bold text-[#0f766e] bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                {swapEligibleUnits.length} {language === 'ar' ? 'فرص نشطة' : 'Active Deals'}
              </span>
            </div>

            <div className="space-y-4">
              {swapEligibleUnits.map(unit => (
                <div 
                  key={unit.id}
                  onClick={() => onSelectUnit(unit)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-[#0d9488] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img 
                      src={unit.images[0]} 
                      alt={unit.title} 
                      className="w-full sm:w-44 h-36 object-cover rounded-xl shrink-0 group-hover:opacity-95 transition-opacity"
                    />

                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-[#0f766e] bg-[#0f766e]/10 px-2 py-0.5 rounded">
                            {unit.developer}
                          </span>
                          <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <Repeat className="w-3 h-3" />
                            {language === 'ar' ? 'متاح للمناقلة' : 'Swap Available'}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0f766e] transition-colors mt-1 line-clamp-1">
                          {language === 'ar' ? unit.title : (unit.titleEn || unit.title)}
                        </h3>

                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{unit.compound} • {unit.region}</span>
                        </p>
                      </div>

                      {/* Swap Target Box */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs">
                        <span className="text-[10px] text-slate-500 block font-semibold">
                          {language === 'ar' ? 'الأصل المطلوب للمبادلة معه:' : 'Target Swap Asset:'}
                        </span>
                        <strong className="text-slate-800 text-[11px] block mt-0.5">
                          {language === 'ar' ? (unit.swapTargetType || 'أي أصل تجاري أو إداري بالتجمع أو زايد') : (unit.swapTargetTypeEn || 'Commercial or administrative asset')}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'المدفوع كاش:' : 'Paid Cash:'}</span>
                          <span className="font-bold text-slate-900 font-sans">
                            {unit.paidCashAmount.toLocaleString()} {t('egp')}
                          </span>
                        </div>

                        <button className="text-xs font-bold text-[#0f766e] group-hover:underline flex items-center gap-1">
                          <span>{language === 'ar' ? 'تفاصيل الفرصة' : 'View Details'}</span>
                          {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner to List */}
            <div className="bg-[#0f766e]/10 border border-[#0d9488]/30 rounded-2xl p-5 text-center space-y-2">
              <h4 className="font-bold text-sm text-[#0f766e]">
                {language === 'ar' ? 'هل لديك وحدة وتريد عرضها للمبادلة هنا؟' : 'Want to list your unit for property swap?'}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {language === 'ar' 
                  ? 'نعرض وحدتك على شبكة المشترين والمستثمرين ونفحص عروض المبادلة دون أي عمولة عليك.'
                  : 'We present your unit to our network of serious investors with 0% seller fees.'}
              </p>
              <button
                onClick={onOpenAddUnit}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0f766e] text-white font-bold text-xs hover:bg-[#115e59] cursor-pointer transition-colors shadow-xs"
              >
                <span>{language === 'ar' ? 'أضف وحدتك للمبادلة والتنازل' : 'List Unit for Swap'}</span>
                {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
