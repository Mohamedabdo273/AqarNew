import React, { useState } from 'react';
import { 
  Building2, 
  Coins, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  AlertTriangle, 
  FileUp, 
  Lock, 
  Calculator, 
  Sparkles,
  Scale,
  PhoneCall,
  ExternalLink,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  Repeat,
  BadgeCheck,
  Clock,
  Banknote,
  Calendar,
  Compass,
  Home,
  Check,
  HelpCircle,
  FileCheck2,
  TrendingDown,
  Users
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

  // Distinct Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;
  const [understandsExactPaid, setUnderstandsExactPaid] = useState<boolean>(true);
  const [currentMarketPrice, setCurrentMarketPrice] = useState<string>('');
  const [ackIsDirectOwner, setAckIsDirectOwner] = useState<boolean>(true);
  const [ackNoBroker, setAckNoBroker] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Unit specifications
  const [developer, setDeveloper] = useState('');
  const [compound, setCompound] = useState('');
  const [phaseName, setPhaseName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('شقة');
  const [region, setRegion] = useState<'القاهرة الجديدة' | 'الشيخ زايد وأكتوبر' | 'العاصمة الإدارية' | 'الساحل الشمالي' | 'المستقبل والشروق' | 'البحر الأحمر'>('القاهرة الجديدة');
  const [areaM2, setAreaM2] = useState<number>(160);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [floor, setFloor] = useState('الدور الثالث');
  const [viewOrientation, setViewOrientation] = useState<'بحري صريح' | 'بحري شرقي' | 'قبلي' | 'شرقي' | 'غربي'>('بحري صريح');
  const [deliveryDate, setDeliveryDate] = useState('2027-06-30');
  const [deliveryStatus, setDeliveryStatus] = useState<any>('استلام 2027');
  const [finishing, setFinishing] = useState<any>('نصف تشطيب');
  const [gardenAreaM2, setGardenAreaM2] = useState<number>(0);
  const [parkingIncluded, setParkingIncluded] = useState(true);
  const [clubhouseIncluded, setClubhouseIncluded] = useState(true);

  // Financial audit fields
  const [contractPrice, setContractPrice] = useState<number>(5000000);
  const [paidAmount, setPaidAmount] = useState<number>(2000000);
  const [installmentValue, setInstallmentValue] = useState<number>(125000);
  const [installmentFrequency, setInstallmentFrequency] = useState<'شهري' | 'ربع سنوي' | 'نصف سنوي' | 'سنوي'>('ربع سنوي');
  const [installmentPeriodYears, setInstallmentPeriodYears] = useState<number>(5);
  const [nextInstallmentDate, setNextInstallmentDate] = useState('2026-11-01');
  const [maintenanceDepositPaid, setMaintenanceDepositPaid] = useState(false);
  const [transferFeeBearer, setTransferFeeBearer] = useState<'بائع' | 'مشتري' | 'مناصفة' | 'معفي بالعقد'>('معفي بالعقد');
  const [transferFeePercent, setTransferFeePercent] = useState<number>(0);
  const [hasLatePenalties, setHasLatePenalties] = useState(false);

  // Swap and liquidity preferences
  const [eligibleForSwap, setEligibleForSwap] = useState(true);
  const [swapTargetType, setSwapTargetType] = useState('مكتب إداري أو عيادة أو شقة أصغر');

  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [newlyCreatedUnit, setNewlyCreatedUnit] = useState<RealEstateUnit | null>(null);

  const formatEGP = (num: number) => {
    return num.toLocaleString() + ' ' + t('egp');
  };

  const remaining = Math.max(0, contractPrice - paidAmount);
  const paidPercent = contractPrice > 0 ? Math.min(100, Math.round((paidAmount / contractPrice) * 100)) : 0;
  const remainingPercent = 100 - paidPercent;

  // Step definition for distinct stepper bar
  const stepsMetadata = [
    {
      num: 1,
      titleAr: 'المشروع والماليات',
      titleEn: 'Project & Financials',
      subtitleAr: 'المطور وقيمة العقد',
      subtitleEn: 'Developer & Price',
      icon: Banknote,
    },
    {
      num: 2,
      titleAr: 'مواصفات الوحدة',
      titleEn: 'Unit Specifications',
      subtitleAr: 'المساحة، الغرف، الدور',
      subtitleEn: 'Area, Rooms, Floor',
      icon: Home,
    },
    {
      num: 3,
      titleAr: 'جدول الأقساط',
      titleEn: 'Installment Plan',
      subtitleAr: 'المتبقي للمطور ومواعيده',
      subtitleEn: 'Dues & Schedule',
      icon: FileSpreadsheet,
    },
    {
      num: 4,
      titleAr: 'المبادلة الذكية',
      titleEn: 'Smart Asset Swap',
      subtitleAr: 'نقل رأس المال لأصل آخر',
      subtitleEn: 'Transfer Equity',
      icon: Repeat,
    },
    {
      num: 5,
      titleAr: 'بيانات المالك',
      titleEn: 'Owner & Verification',
      subtitleAr: 'الاسم، الموبايل، والمستند',
      subtitleEn: 'Contact & Documents',
      icon: ShieldCheck,
    },
    {
      num: 6,
      titleAr: 'الإقرار والمراجعة',
      titleEn: 'Review & Submit',
      subtitleAr: 'التأكيد النهائي بدون أوفر',
      subtitleEn: 'Final 0% Overprice Check',
      icon: FileCheck2,
    },
  ];

  const validateStep = (step: number): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (!developer.trim()) {
        setValidationError(language === 'ar' ? 'يرجى إدخال اسم المطور العقاري' : 'Please enter developer name');
        return false;
      }
      if (!compound.trim()) {
        setValidationError(language === 'ar' ? 'يرجى إدخال اسم المشروع أو الكمبوند' : 'Please enter compound / project name');
        return false;
      }
      if (!contractPrice || contractPrice <= 0) {
        setValidationError(language === 'ar' ? 'يرجى إدخال إجمالي سعر الوحدة في العقد' : 'Please enter contract price');
        return false;
      }
      if (!paidAmount || paidAmount <= 0) {
        setValidationError(language === 'ar' ? 'يرجى إدخال إجمالي المدفوع كاش حتى اليوم' : 'Please enter paid cash amount');
        return false;
      }
      if (paidAmount > contractPrice) {
        setValidationError(language === 'ar' ? 'المبلغ المسدد لا يمكن أن يتجاوز ثمن الوحدة' : 'Paid cash cannot exceed contract price');
        return false;
      }
      if (!understandsExactPaid) {
        setValidationError(language === 'ar' ? 'يرجى تأكيد إقرار استلام المدفوع بالكامل بدون أوفر برايس' : 'Please confirm recovering exact paid cash');
        return false;
      }
    } else if (step === 2) {
      if (!areaM2 || areaM2 <= 0) {
        setValidationError(language === 'ar' ? 'يرجى إدخال مساحة الوحدة بالمتر المربع' : 'Please enter property area in sqm');
        return false;
      }
    } else if (step === 5) {
      if (!ownerName.trim()) {
        setValidationError(language === 'ar' ? 'يرجى إدخال اسم المالك كما هو مدون في العقد' : 'Please enter owner name');
        return false;
      }
      if (!ownerPhone.trim()) {
        setValidationError(language === 'ar' ? 'يرجى إدخال رقم الهاتف أو الواتساب للتواصل' : 'Please enter contact phone/WhatsApp');
        return false;
      }
    } else if (step === 6) {
      if (!ackIsDirectOwner || !ackNoBroker) {
        setValidationError(language === 'ar' ? 'يجب الإقرار بأنك المالك المباشر للوحدة بدون وسيط' : 'You must declare that you are the direct owner');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        const el = document.getElementById('sell-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        handleSubmitForm();
      }
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      const el = document.getElementById('sell-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitForm = () => {
    const created = addUnit({
      developer: developer || (language === 'ar' ? 'مطور عقاري معتمد' : 'Verified Developer'),
      compound: compound || (language === 'ar' ? `كمبوند ${developer}` : `Compound ${developer}`),
      propertyType,
      region,
      areaM2: Number(areaM2) || 160,
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 2,
      floor,
      viewOrientation,
      deliveryDate,
      deliveryStatus,
      finishing,
      gardenAreaM2: Number(gardenAreaM2) || undefined,
      parkingIncluded,
      clubhouseIncluded,
      originalContractPrice: Number(contractPrice),
      paidCashAmount: Number(paidAmount),
      installmentValue: Number(installmentValue) || Math.round(remaining / 20),
      installmentFrequency,
      installmentPeriodYears: Number(installmentPeriodYears) || 5,
      nextInstallmentDate,
      hasMaintenanceDepositPaid: maintenanceDepositPaid,
      transferFeeBearer,
      transferFeePercent: Number(transferFeePercent) || 0,
      hasLatePenalties,
      eligibleForSwap,
      swapTargetType,
      instantLiquidityEligible: true,
      phaseName: phaseName || undefined,
      unitNumber: unitNumber || undefined,
      ownerName,
      ownerPhone,
      uploadedFileName: fileName || undefined
    });
    setNewlyCreatedUnit(created);
    setSubmitted(true);
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-[#f8fafc] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'ar' ? 'منظومة التنازل المباشر • عمولة 0% على البائع' : 'Direct Assignment Portal • 0% Seller Fee'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {language === 'ar' ? (
              <>سجل وحدتك للتنازل واسترجع <span className="text-[#0f766e]">كامل رأس مالك كاش</span></>
            ) : (
              <>List For Assignment & Recover <span className="text-[#0f766e]">100% Cash In Full</span></>
            )}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {language === 'ar'
              ? 'تخارج آمن وقانوني 100% بمقر المطور وبإشراف المنصة. استرد ما دفعته كاملاً بشيك مصرفي مقبول الدفع، وتخلص فوراً من عبء الأقساط القادمة بدون أي خسارة.'
              : 'Safe & 100% legal exit at developer headquarters. Recover every pound paid via cashier check and eliminate upcoming installments without loss.'}
          </p>
        </div>

        {/* 3 Exit Options Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 lg:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'ar' ? 'قارن بين خياراتك الثلاثة للخروج من عبء الأقساط' : 'Compare Your 3 Exit Options from Installment Burdens'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ar' ? 'لماذا نموذج التنازل هو الخيار الأكثر أماناً ووفراً للبائع؟' : 'Why the verified contract assignment model provides total capital recovery and peace of mind.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Option 1: Developer */}
            <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-md inline-block">
                {language === 'ar' ? 'الخيار 1: الفسخ مع المطور' : 'Option 1: Developer Cancellation'}
              </span>
              <h3 className="text-base font-bold text-red-950">
                {language === 'ar' ? 'خسارة مالية فادحة واسترداد مؤجل' : 'Severe Penalty & Long Waiting Period'}
              </h3>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                {language === 'ar' ? (
                  <>
                    <li>خصم غرامة تعاقدية <strong>10% إلى 15% من إجمالي ثمن الوحدة</strong> (وليس فقط من المدفوع).</li>
                    <li>تجميد المبلغ المتبقي واسترداده بعد إعادة بيع الوحدة أو بعد 6 - 12 شهراً.</li>
                    <li>تجميد الشيكات القديمة لحين إتمام إجراءات الفسخ القانونية.</li>
                  </>
                ) : (
                  <>
                    <li>Deduction of 10% to 15% penalty from the total unit contract price.</li>
                    <li>Remaining refund delayed 6 to 12 months until the developer resells.</li>
                    <li>Bank checks kept locked until full administrative closure.</li>
                  </>
                )}
              </ul>
              <div className="pt-2 text-xs font-black text-red-700">
                {language === 'ar' ? 'النتيجة: خسارة جزء كبير من مدخراتك.' : 'Outcome: Heavy loss of capital.'}
              </div>
            </div>

            {/* Option 2: Market Resale with Overprice */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md inline-block">
                {language === 'ar' ? 'الخيار 2: البيع في السوق بأوفر برايس' : 'Option 2: Market Resale with Overprice'}
              </span>
              <h3 className="text-base font-bold text-amber-950">
                {language === 'ar' ? 'شهور من الانتظار وتراكم الأقساط' : 'Months on Hold with Accumulating Dues'}
              </h3>
              <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside">
                {language === 'ar' ? (
                  <>
                    <li>محاولة فرض أوفر برايس تؤدي لركود الوحدة لشهور بسبب انكماش السيولة.</li>
                    <li>استمرار استحقاق الأقساط وغرامات التأخير أثناء البحث عن مشتري.</li>
                    <li>دفع عمولة سماسرة 2.5% تقتطع من أي سيولة مستردة.</li>
                    <li>المشتري يفضل الشراء المباشر من المطور لمدد أطول.</li>
                  </>
                ) : (
                  <>
                    <li>Overprice premiums freeze interest during high interest rate cycles.</li>
                    <li>Installment checks continue bouncing while waiting for a buyer.</li>
                    <li>2.5% broker commissions eaten out of your net recovery.</li>
                    <li>Buyers bypass and go direct to developer launches.</li>
                  </>
                )}
              </ul>
              <div className="pt-2 text-xs font-black text-amber-800">
                {language === 'ar' ? 'النتيجة: ضغط نفسي وتراكم شيكات متعثرة.' : 'Outcome: Financial anxiety & check defaults.'}
              </div>
            </div>

            {/* Option 3: Verified Assignment (Our Model) */}
            <div className="p-5 rounded-2xl bg-teal-50/60 border-2 border-[#0f766e] space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white bg-[#0f766e] px-2.5 py-1 rounded-md">
                  {language === 'ar' ? 'الخيار 3: التنازل الرسمي عبر المنصة' : 'Option 3: Assignment Model'}
                </span>
                <span className="text-[11px] font-bold text-[#0f766e]">
                  {language === 'ar' ? 'الأسرع والأوفر' : 'Recommended'}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f766e]">
                {language === 'ar' ? 'استرداد 100% كاش وعمولة 0% على البائع' : '100% Cash Recovery & 0% Seller Fee'}
              </h3>
              <ul className="text-xs text-slate-800 space-y-2 list-disc list-inside">
                {language === 'ar' ? (
                  <>
                    <li>استرداد كل جنيه دفعته للمطور <strong>بالكامل بشيك مصرفي مقبول الدفع</strong>.</li>
                    <li><strong>0% عمولة على البائع</strong> (الخدمة مجانية بالكامل لأصحاب الوحدات).</li>
                    <li>سرعة تنفيذ خلال 3 إلى 7 أيام لأن الوحدة بسعر قديم وبدون أي أوفر.</li>
                    <li>استرداد كافة شيكاتك البنكية المؤجلة فوراً وإلغاء مسؤوليتك القانونية.</li>
                    <li>تنازل رسمي بمقر المطور وبإشراف قانوني موثق.</li>
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

        {/* Distinctive Sell Studio Layout: Stepper + Live Audit Sidebar */}
        <div id="sell-form" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Banner: Direct Owner Badge */}
          <div className="bg-slate-900 text-white px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0f766e] flex items-center justify-center text-white shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-100">
                {language === 'ar' 
                  ? 'بنتعامل مع مالك الوحدة الأصلي المباشر فقط — الوسطاء والسماسرة مستبعدون نهائياً'
                  : 'Direct contract owners only — 0% overprice policy strictly audited.'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-teal-300 font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'ar' ? 'فحص ومطابقة خلال ساعتين' : '2-Hour Verification'}</span>
            </div>
          </div>

          {/* Stepper Header (Desktop Tabs / Mobile Cards) */}
          <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-3">
              {stepsMetadata.map((st) => {
                const IconComponent = st.icon;
                const isActive = st.num === currentStep;
                const isPassed = st.num < currentStep;

                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => {
                      if (st.num < currentStep) {
                        setCurrentStep(st.num);
                      } else if (st.num === currentStep + 1 && validateStep(currentStep)) {
                        setCurrentStep(st.num);
                      }
                    }}
                    className={`relative p-3 rounded-2xl text-start transition-all cursor-pointer border ${
                      isActive 
                        ? 'bg-white border-[#0f766e] shadow-sm ring-2 ring-[#0f766e]/20'
                        : isPassed
                        ? 'bg-white/80 border-emerald-200 text-slate-700 hover:bg-white'
                        : 'bg-slate-100/60 border-slate-200/80 text-slate-400 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isActive
                          ? 'bg-[#0f766e] text-white shadow-2xs'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isPassed ? <Check className="w-3.5 h-3.5" /> : st.num}
                      </div>
                      <IconComponent className={`w-4 h-4 ${
                        isActive ? 'text-[#0f766e]' : isPassed ? 'text-emerald-600' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="font-black text-xs text-slate-800 line-clamp-1">
                      {language === 'ar' ? st.titleAr : st.titleEn}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 hidden sm:block">
                      {language === 'ar' ? st.subtitleAr : st.subtitleEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Body + Interactive Exit Summary Sidebar */}
          {submitted ? (
            <div className="text-center py-12 px-4 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-50 text-[#0f766e] rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {language === 'ar' ? 'تم تسجيل وحدتك بنجاح في المنصة!' : 'Your unit was successfully submitted!'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar' ? (
                  <>
                    شكراً لك يا <strong>{ownerName || 'فندم'}</strong>. استلمنا بيانات وحدتك في مشروع ({compound || developer})، وكود الفحص الخاص بك هو: <span className="font-mono font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{newlyCreatedUnit?.verificationCode || 'TNZ-DIRECT'}</span>.
                  </>
                ) : (
                  <>
                    Thank you <strong>{ownerName || 'Sir/Madam'}</strong>. Listing received for ({compound || developer}). Verification Code: <span className="font-mono font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{newlyCreatedUnit?.verificationCode || 'TNZ-DIRECT'}</span>.
                  </>
                )}
              </p>
              
              <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'المبلغ المسترد بالكامل:' : 'Cash Recovery Amount:'}</span>
                  <strong className="text-[#0f766e] font-bold text-sm">{formatEGP(paidAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'العمولة على البائع:' : 'Seller Commission:'}</span>
                  <strong className="text-emerald-700 font-bold">{language === 'ar' ? '0% مجاناً بالكامل' : '0% Free'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'طريقة الاستلام:' : 'Payment Method:'}</span>
                  <span className="font-bold text-slate-800">{language === 'ar' ? 'شيك مصرفي مقبول الدفع' : 'Certified Cashier Check'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="px-5 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>{language === 'ar' ? 'عرض وحدتك في سوق الفرص' : 'View In Opportunities'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(1);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  {language === 'ar' ? 'تسجيل وحدة أخرى' : 'Submit Another Unit'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-5 sm:p-8 lg:p-10">
              
              {/* Main Step Content Area (7 cols on lg) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Step Headline & Subtitle */}
                <div>
                  <span className="text-[11px] font-bold text-[#0f766e] bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block mb-1.5">
                    {language === 'ar' ? `الجزء ${currentStep} من ${totalSteps}` : `Part ${currentStep} of ${totalSteps}`}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentStep === 1 && (language === 'ar' ? 'بيانات المطور، المشروع، والمبالغ المالية' : 'Developer, Compound & Financial Equity')}
                    {currentStep === 2 && (language === 'ar' ? 'المواصفات الفنية والمعمارية للوحدة' : 'Architectural Specs & Area')}
                    {currentStep === 3 && (language === 'ar' ? 'جدول الأقساط المتبقية للمطور' : 'Installment Schedule & Dues')}
                    {currentStep === 4 && (language === 'ar' ? 'المبادلة الذكية والمناقلة العقارية' : 'Smart Equity Swap Option')}
                    {currentStep === 5 && (language === 'ar' ? 'بيانات المالك والتوثيق والسرية' : 'Owner Verification & Statement')}
                    {currentStep === 6 && (language === 'ar' ? 'المراجعة النهائية والإقرار القانوني' : 'Legal Acknowledgment & Submission')}
                  </h3>
                </div>

                {/* Validation alert */}
                {validationError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* STEP 1: بيانات المشروع والماليات */}
                {currentStep === 1 && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'اسم المطور العقاري:' : 'Developer:'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={language === 'ar' ? 'مثال: بالم هيلز، سوديك، إعمار، ماونتن فيو...' : 'e.g. Palm Hills, SODIC, Emaar...'}
                          value={developer}
                          onChange={(e) => setDeveloper(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'اسم المشروع / الكمبوند:' : 'Compound / Project:'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={language === 'ar' ? 'مثال: بادية، فيليت، هايد بارك، ميفيدا...' : 'e.g. Badya, Villette, Hyde Park...'}
                          value={compound}
                          onChange={(e) => setCompound(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'إجمالي ثمن الوحدة في العقد الأصلي:' : 'Total Contract Price:'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            step={50000}
                            placeholder="5,000,000"
                            value={contractPrice || ''}
                            onChange={(e) => setContractPrice(Number(e.target.value))}
                            className={`w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans focus:bg-white focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] ${
                              isRTL ? 'pl-10 text-right' : 'pr-10 text-left'
                            }`}
                          />
                          <span className={`absolute top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold ${
                            isRTL ? 'left-3' : 'right-3'
                          }`}>
                            {t('egp')}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'إجمالي المدفوع كاش حتى تاريخه (المطلوب استرداده):' : 'Total Cash Paid Until Today:'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            step={25000}
                            placeholder="2,000,000"
                            value={paidAmount || ''}
                            onChange={(e) => setPaidAmount(Number(e.target.value))}
                            className={`w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-[#0f766e] font-bold focus:bg-white focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] ${
                              isRTL ? 'pl-10 text-right' : 'pr-10 text-left'
                            }`}
                          />
                          <span className={`absolute top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold ${
                            isRTL ? 'left-3' : 'right-3'
                          }`}>
                            {t('egp')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Exact Paid Checkbox Card */}
                    <div
                      onClick={() => setUnderstandsExactPaid(!understandsExactPaid)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        understandsExactPaid
                          ? 'bg-teal-50/70 border-teal-300 text-teal-950'
                          : 'bg-slate-50 border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-black block">
                          {language === 'ar'
                            ? 'أؤكد إني فاهم وموافق على استرداد ما دفعته بالظبط (صفر أوفر برايس)'
                            : 'I confirm recovering strictly what I paid with 0% overprice premium'}
                        </span>
                        <span className="text-[11px] text-slate-600 block">
                          {language === 'ar'
                            ? 'المنصة قائمة على ربط البائع بمشتري جاد بسعر قديم بدون أي زيادات، لاسترداد السيولة فوراً.'
                            : 'This enables swift 3-7 day liquidity recovery without speculative stagnation.'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={understandsExactPaid}
                        onChange={(e) => setUnderstandsExactPaid(e.target.checked)}
                        className="w-5 h-5 accent-[#0f766e] rounded cursor-pointer shrink-0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {language === 'ar' ? 'سعر نفس الوحدة حالياً لدى المطور (اختياري لمعرفة قيمة الصفقة):' : 'Current Developer Price for Same Unit (Optional):'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={language === 'ar' ? 'مثال: 9,000,000 ج.م حالياً لدى المطور' : 'e.g. 9,000,000 EGP'}
                          value={currentMarketPrice}
                          onChange={(e) => setCurrentMarketPrice(e.target.value)}
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] ${
                            isRTL ? 'pl-10 text-right' : 'pr-10 text-left'
                          }`}
                        />
                        <span className={`absolute top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold ${
                          isRTL ? 'left-3' : 'right-3'
                        }`}>
                          {t('egp')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: مواصفات ومساحة الوحدة */}
                {currentStep === 2 && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'نوع العقار:' : 'Property Type:'}
                        </label>
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        >
                          <option value="شقة">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                          <option value="تاون هاوس">{language === 'ar' ? 'تاون هاوس' : 'Townhouse'}</option>
                          <option value="فيلا مستقلة">{language === 'ar' ? 'فيلا مستقلة' : 'Standalone Villa'}</option>
                          <option value="دوبلكس">{language === 'ar' ? 'دوبلكس / بنتهاوس' : 'Duplex'}</option>
                          <option value="تجاري / محل">{language === 'ar' ? 'تجاري / محل' : 'Commercial'}</option>
                          <option value="شاليه ساحلي">{language === 'ar' ? 'شاليه ساحلي' : 'Chalet'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'المنطقة الجغرافية:' : 'Region:'}
                        </label>
                        <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        >
                          <option value="القاهرة الجديدة">{language === 'ar' ? 'القاهرة الجديدة والتجمع' : 'New Cairo'}</option>
                          <option value="الشيخ زايد وأكتوبر">{language === 'ar' ? 'الشيخ زايد وأكتوبر' : 'Sheikh Zayed & October'}</option>
                          <option value="العاصمة الإدارية">{language === 'ar' ? 'العاصمة الإدارية الجديدة' : 'New Capital'}</option>
                          <option value="الساحل الشمالي">{language === 'ar' ? 'الساحل الشمالي ومطروح' : 'North Coast'}</option>
                          <option value="المستقبل والشروق">{language === 'ar' ? 'المستقبل سيتي والشروق' : 'Mostakbal & Shorouk'}</option>
                          <option value="البحر الأحمر">{language === 'ar' ? 'البحر الأحمر والجونة' : 'Red Sea & El Gouna'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'المساحة (م²):' : 'Area (sqm):'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={30}
                          max={2000}
                          value={areaM2}
                          onChange={(e) => setAreaM2(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'غرف النوم:' : 'Bedrooms:'}
                        </label>
                        <select
                          value={bedrooms}
                          onChange={(e) => setBedrooms(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'الحمامات:' : 'Bathrooms:'}
                        </label>
                        <select
                          value={bathrooms}
                          onChange={(e) => setBathrooms(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4+</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'الدور / الطابق:' : 'Floor:'}
                        </label>
                        <input
                          type="text"
                          value={floor}
                          onChange={(e) => setFloor(e.target.value)}
                          placeholder={language === 'ar' ? 'مثال: الدور الثالث' : 'e.g. 3rd Floor'}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'الواجهة والاتجاه:' : 'Orientation:'}
                        </label>
                        <select
                          value={viewOrientation}
                          onChange={(e) => setViewOrientation(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        >
                          <option value="بحري صريح">{language === 'ar' ? 'بحري صريح' : 'North'}</option>
                          <option value="بحري شرقي">{language === 'ar' ? 'بحري شرقي' : 'North-East'}</option>
                          <option value="قبلي">{language === 'ar' ? 'قبلي' : 'South'}</option>
                          <option value="شرقي">{language === 'ar' ? 'شرقي' : 'East'}</option>
                          <option value="غربي">{language === 'ar' ? 'غربي' : 'West'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'المرحلة داخل المشروع (Phase):' : 'Project Phase:'}
                        </label>
                        <input
                          type="text"
                          placeholder={language === 'ar' ? 'مثال: المرحلة الأولى، Cluster 4...' : 'e.g. Phase 1, Cluster 4...'}
                          value={phaseName}
                          onChange={(e) => setPhaseName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'رقم العمارة / الوحدة (سري لدى الإدارة):' : 'Unit Number (Confidential):'}
                        </label>
                        <input
                          type="text"
                          placeholder={language === 'ar' ? 'مثال: عمارة 15 شقة 3' : 'e.g. Bldg 15 Apt 3'}
                          value={unitNumber}
                          onChange={(e) => setUnitNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={parkingIncluded}
                          onChange={(e) => setParkingIncluded(e.target.checked)}
                          className="w-4 h-4 accent-[#0f766e]"
                        />
                        <span>{language === 'ar' ? 'يشمل باكية جراج' : 'Parking slot included'}</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={clubhouseIncluded}
                          onChange={(e) => setClubhouseIncluded(e.target.checked)}
                          className="w-4 h-4 accent-[#0f766e]"
                        />
                        <span>{language === 'ar' ? 'يشمل اشتراك النادي (كلوب هاوس)' : 'Clubhouse membership included'}</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 3: جدول الأقساط المتبقية للمطور */}
                {currentStep === 3 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-slate-400 text-[11px] block">{language === 'ar' ? 'الأقساط المتبقية للمطور:' : 'Remaining to Developer:'}</span>
                        <strong className="text-xl font-black text-teal-400 font-sans">{formatEGP(remaining)}</strong>
                      </div>
                      <div className="text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                        {language === 'ar' ? 'يسددها المشتري الجديد للمطور مباشرة' : 'Transferred to the new buyer'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'قيمة القسط الدوري:' : 'Installment Value:'}
                        </label>
                        <input
                          type="number"
                          value={installmentValue}
                          onChange={(e) => setInstallmentValue(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'دورية السداد:' : 'Payment Frequency:'}
                        </label>
                        <select
                          value={installmentFrequency}
                          onChange={(e) => setInstallmentFrequency(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        >
                          <option value="شهري">{language === 'ar' ? 'شهري' : 'Monthly'}</option>
                          <option value="ربع سنوي">{language === 'ar' ? 'ربع سنوي (كل 3 شهور)' : 'Quarterly'}</option>
                          <option value="نصف سنوي">{language === 'ar' ? 'نصف سنوي' : 'Semi-Annual'}</option>
                          <option value="سنوي">{language === 'ar' ? 'سنوي' : 'Annual'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'تاريخ استحقاق القسط القادم:' : 'Next Due Date:'}
                        </label>
                        <input
                          type="date"
                          value={nextInstallmentDate}
                          onChange={(e) => setNextInstallmentDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'سنوات الأقساط المتبقية:' : 'Remaining Years:'}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={12}
                          value={installmentPeriodYears}
                          onChange={(e) => setInstallmentPeriodYears(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {language === 'ar' ? 'رسوم التنازل لدى المطور (Transfer Fee):' : 'Developer Transfer Fee:'}
                      </label>
                      <select
                        value={transferFeeBearer}
                        onChange={(e) => setTransferFeeBearer(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                      >
                        <option value="معفي بالعقد">{language === 'ar' ? 'معفي من رسوم التنازل بنص العقد' : 'Exempt from transfer fees by contract'}</option>
                        <option value="على البائع">{language === 'ar' ? 'يتحملها البائع' : 'Borne by seller'}</option>
                        <option value="على المشتري">{language === 'ar' ? 'يتحملها المشتري' : 'Borne by buyer'}</option>
                        <option value="مناصفة">{language === 'ar' ? 'مناصفة بين الطرفين' : '50/50 Shared'}</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={maintenanceDepositPaid}
                          onChange={(e) => setMaintenanceDepositPaid(e.target.checked)}
                          className="w-4 h-4 accent-[#0f766e]"
                        />
                        <span>{language === 'ar' ? 'تم سداد وديعة الصيانة مسبقاً' : 'Maintenance Deposit Pre-paid'}</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={hasLatePenalties}
                          onChange={(e) => setHasLatePenalties(e.target.checked)}
                          className="w-4 h-4 accent-rose-600"
                        />
                        <span>{language === 'ar' ? 'توجد غرامات تأخير معلقة' : 'Pending Overdue Fines'}</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 4: المبادلة الذكية والمناقلة */}
                {currentStep === 4 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={eligibleForSwap}
                          onChange={(e) => setEligibleForSwap(e.target.checked)}
                          className="w-5 h-5 accent-[#0f766e] mt-0.5 shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-900 block">
                            {language === 'ar'
                              ? 'أرحب أيضاً بمبادلة ومناقلة هذه الوحدة بأصل عقاري آخر'
                              : 'Open to Smart Property Swap for another real estate asset'}
                          </span>
                          <span className="text-[11px] text-slate-600 leading-relaxed block">
                            {language === 'ar'
                              ? 'انقل مدفوعاتك السابقة بالكامل إلى عيادة، مكتب إداري، أو شقة أصغر ذات قسط شهري منخفض دون الحاجة للسيولة النقدية.'
                              : 'Transfer your paid equity directly to a lower-installment asset like an office, clinic, or smaller unit.'}
                          </span>
                        </div>
                      </label>

                      {eligibleForSwap && (
                        <div className="pt-3 border-t border-teal-200">
                          <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            {language === 'ar' ? 'نوع الأصل المرغوب في المبادلة به:' : 'Target Asset for Swap:'}
                          </label>
                          <input
                            type="text"
                            value={swapTargetType}
                            onChange={(e) => setSwapTargetType(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: عيادة في التجمع أو شقة أصغر في زايد بقسط أقل...' : 'e.g. Clinic or smaller unit with lower payments...'}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 5: بيانات المالك والتوثيق والسرية */}
                {currentStep === 5 && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'اسم المالك (كما بالعقد):' : 'Owner Name (as per contract):'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={language === 'ar' ? 'الاسم الثلاثي أو الرباعي...' : 'Full Legal Name...'}
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          {language === 'ar' ? 'رقم الموبايل (واتساب مباشر للتواصل):' : 'Mobile Phone (Direct WhatsApp):'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="010XXXXXXXX"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Upload File */}
                    <div className="border border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50">
                      <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-slate-800 block">
                        {language === 'ar' ? 'إرفاق صورة كشف الحساب أو إيصال السداد (اختياري)' : 'Attach statement copy or payment receipt (optional)'}
                      </span>
                      <span className="text-[11px] text-slate-500 block mb-2.5">
                        {language === 'ar' ? 'للتسريع من مطابقة كشف الحساب مع المطور خلال ساعتين' : 'Accelerates statement audit with developer within 2 hours'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }}
                        className="hidden"
                        id="sell-upload"
                      />
                      <label
                        htmlFor="sell-upload"
                        className="inline-block px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 shadow-2xs"
                      >
                        {fileName ? (language === 'ar' ? `تم الاختيار: ${fileName}` : `Selected: ${fileName}`) : (language === 'ar' ? 'اختيار ملف من جهازك' : 'Choose File')}
                      </label>
                    </div>

                    <div className="p-3.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
                      <span>
                        {language === 'ar'
                          ? 'تأكيد الخصوصية: رقم وحدتك وبياناتك الشخصية لا تظهر في أي إعلان علني، ولا نتقاضى أي مصاريف أو عمولات من البائع.'
                          : 'Privacy Guarantee: Your unit number and personal contact are never shared publicly. Zero fees on seller.'}
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 6: التأكيد والإقرار النهائي */}
                {currentStep === 6 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                        {language === 'ar' ? 'ملخص طلب التنازل واسترداد رأس المال:' : 'Listing Summary:'}
                      </h5>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{language === 'ar' ? 'المشروع والمطور:' : 'Project & Developer:'}</span>
                        <strong className="text-slate-900">{compound} — {developer}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{language === 'ar' ? 'إجمالي سعر العقد:' : 'Contract Price:'}</span>
                        <span className="font-sans font-bold">{formatEGP(contractPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{language === 'ar' ? 'المبلغ المسترد لك بالكامل:' : 'Cash You Recover:'}</span>
                        <strong className="font-sans font-black text-[#0f766e] text-sm">{formatEGP(paidAmount)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{language === 'ar' ? 'الأقساط المتبقية للمطور:' : 'Remaining Installments:'}</span>
                        <span className="font-sans font-bold">{formatEGP(remaining)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{language === 'ar' ? 'عمولة المنصة على البائع:' : 'Platform Fee on Seller:'}</span>
                        <span className="text-emerald-700 font-bold">{language === 'ar' ? '0% مجاناً بالكامل' : '0% Free'}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div
                        onClick={() => setAckIsDirectOwner(!ackIsDirectOwner)}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <span className="text-xs font-bold text-slate-800">
                          {language === 'ar'
                            ? 'أقر بأنني المالك المباشر المسجل بالعقد ولست وسيطاً أو سمساراً.'
                            : 'I declare that I am the direct contract owner and not an agent or broker.'}
                        </span>
                        <input
                          type="checkbox"
                          checked={ackIsDirectOwner}
                          onChange={(e) => setAckIsDirectOwner(e.target.checked)}
                          className="w-4 h-4 accent-[#0f766e] rounded cursor-pointer shrink-0"
                        />
                      </div>

                      <div
                        onClick={() => setAckNoBroker(!ackNoBroker)}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <span className="text-xs font-bold text-slate-800">
                          {language === 'ar'
                            ? 'أوافق على استرداد ما دفعته فقط بدون إضافة أي أوفر برايس.'
                            : 'I agree to strictly recover what I paid without adding any overprice premium.'}
                        </span>
                        <input
                          type="checkbox"
                          checked={ackNoBroker}
                          onChange={(e) => setAckNoBroker(e.target.checked)}
                          className="w-4 h-4 accent-[#0f766e] rounded cursor-pointer shrink-0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons */}
                <div className="pt-5 border-t border-slate-200 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                      <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <span>
                      {currentStep === totalSteps
                        ? language === 'ar'
                          ? 'تأكيد وإرسال طلب التنازل'
                          : 'Confirm & Submit Listing'
                        : language === 'ar'
                        ? 'التالي'
                        : 'Next'}
                    </span>
                    {currentStep === totalSteps ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isRTL ? (
                      <ArrowLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

              </div>

              {/* Distinctive Live Audit Sidebar (5 cols on lg) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Live Financial Breakdown Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black text-slate-200">
                      {language === 'ar' ? 'المطابقة المالية الفورية' : 'Live Financial Audit'}
                    </span>
                    <span className="text-[10px] font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                      {language === 'ar' ? 'استرداد 100%' : '100% Cash'}
                    </span>
                  </div>

                  {/* Cash Recovery Highlight */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block">
                      {language === 'ar' ? 'المبلغ المسترد بالكامل لك:' : 'Net Cash Paid (To Recover):'}
                    </span>
                    <div className="text-2xl font-black font-sans text-teal-400">
                      {formatEGP(paidAmount)}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'ar' ? 'بشيك مصرفي مقبول الدفع فور التنازل' : 'Paid via certified cashier check upon signing'}
                    </span>
                  </div>

                  {/* Visual Progress Bar of Paid vs Remaining */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>{language === 'ar' ? `المدفوع (${paidPercent}%)` : `Paid (${paidPercent}%)`}</span>
                      <span>{language === 'ar' ? `المتبقي (${remainingPercent}%)` : `Remaining (${remainingPercent}%)`}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div style={{ width: `${paidPercent}%` }} className="bg-[#0f766e] h-full transition-all duration-300" />
                      <div style={{ width: `${remainingPercent}%` }} className="bg-slate-600 h-full transition-all duration-300" />
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'ar' ? 'سعر العقد الإجمالي:' : 'Contract Price:'}</span>
                      <span className="font-sans font-bold text-white">{formatEGP(contractPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'ar' ? 'المتبقي للمطور بالأقساط:' : 'Remaining to Dev:'}</span>
                      <span className="font-sans font-bold text-slate-300">{formatEGP(remaining)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'ar' ? 'عمولة البائع:' : 'Seller Fee:'}</span>
                      <span className="font-bold text-emerald-400">{language === 'ar' ? '0% مجاناً 100%' : '0% Free'}</span>
                    </div>
                  </div>

                  {/* Safe Exit Vs Cancellation Callout */}
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-red-300 font-bold">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'وفرت غرامة الفسخ:' : 'Penalty Saved:'}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {language === 'ar'
                        ? `وفرت حوالي ${formatEGP(contractPrice * 0.15)} كانت ستخصم كغرامة 15% إذا قمت بفسخ العقد مع المطور.`
                        : `Saved ~${formatEGP(contractPrice * 0.15)} (15% penalty) compared to developer contract termination.`}
                    </p>
                  </div>
                </div>

                {/* Live Liquidity & Matching Index Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-white shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>{language === 'ar' ? 'مؤشر السيولة وسرعة التخارج' : 'Liquidity & Matching Index'}</span>
                    </span>
                    <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                      {language === 'ar' ? 'طلب فوري' : 'High Match'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {language === 'ar'
                      ? `بمجرد مراجعة وتدقيق وحدتك، يتم إشعار أكثر من 18 مشتري كاش مسجل يبحثون عن ${compound || 'هذا الكمبوند'} مع متوسط إغلاق 3 أيام.`
                      : `Once verified, your unit is instantly matched to ~18 pre-registered cash buyers with ~3 days avg. closing.`}
                  </p>
                </div>

                {/* Audit Desk Assurance Card */}
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
                    <span>{language === 'ar' ? 'ضمانات التنازل القانوني' : 'Legal Assignment Safeguards'}</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                    <li>{language === 'ar' ? 'حضور مستشار قانوني من المنصة بمقر المطور.' : 'Legal counsel attendance at developer HQ.'}</li>
                    <li>{language === 'ar' ? 'استرداد جميع شيكاتك البنكية المؤجلة فوراً.' : 'Retrieval of all deferred checks upon signing.'}</li>
                    <li>{language === 'ar' ? 'إبراء ذمة رسمي ونهائي من إدارة المطور.' : 'Full official clearance from developer.'}</li>
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Embedded Calculator */}
        <div>
          <SafeExitCalculator
            onStartExitRequest={(contractP, paidP, dev) => {
              setContractPrice(contractP);
              setPaidAmount(paidP);
              setDeveloper(dev);
              setCurrentStep(1);
              const el = document.getElementById('sell-form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

      </div>
    </div>
  );
};
