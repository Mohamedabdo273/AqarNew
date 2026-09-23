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
  const totalSteps = 5;
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
  const [transferFeeBearer, setTransferFeeBearer] = useState<'بائع' | 'مشتري' | 'مناصفة' | 'معفي بالعقد'>('مشتري');
  const [transferFeePercent, setTransferFeePercent] = useState<number>(0);
  const [hasLatePenalties, setHasLatePenalties] = useState(false);
  const [latePenaltiesAmount, setLatePenaltiesAmount] = useState<number>(0);
  const [deductPenaltiesFromPrice, setDeductPenaltiesFromPrice] = useState(true);

  // New Seller Flexibility & Fire Sale Fields
  const [isWillingToDiscount, setIsWillingToDiscount] = useState(false);
  const [willingDiscountAmount, setWillingDiscountAmount] = useState<number>(100000);
  const [acceptsCashInstallments, setAcceptsCashInstallments] = useState(false);
  const [cashInstallmentNotes, setCashInstallmentNotes] = useState('');
  const [taxCategory, setTaxCategory] = useState<'residential_exempt' | 'commercial_vat' | 'business_tax'>('residential_exempt');
  const [taxBearer, setTaxBearer] = useState<'بائع' | 'مشتري' | 'حسب القانون' | 'معفى'>('حسب القانون');
  const [ackPlatformDisclaimer, setAckPlatformDisclaimer] = useState(false);

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
      titleAr: 'بيانات المالك',
      titleEn: 'Owner & Verification',
      subtitleAr: 'الاسم، الموبايل، والمستند',
      subtitleEn: 'Contact & Documents',
      icon: ShieldCheck,
    },
    {
      num: 5,
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
    } else if (step === 4) {
      if (!ownerName.trim()) {
        setValidationError(language === 'ar' ? 'يرجى إدخال اسم المالك كما هو مدون في العقد' : 'Please enter owner name');
        return false;
      }
      if (!ownerPhone.trim()) {
        setValidationError(language === 'ar' ? 'يرجى إدخال رقم الهاتف أو الواتساب للتواصل' : 'Please enter contact phone/WhatsApp');
        return false;
      }
    } else if (step === 5) {
      if (!ackIsDirectOwner || !ackNoBroker) {
        setValidationError(language === 'ar' ? 'يجب الإقرار بأنك المالك المباشر للوحدة بدون وسيط' : 'You must declare that you are the direct owner');
        return false;
      }
      if (!ackPlatformDisclaimer) {
        setValidationError(language === 'ar' ? 'يرجى الموافقة على إقرار الشفافية وإخلاء مسؤولية المنصة عن صحة الورق' : 'Please accept platform legal disclaimer');
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
      hasOverdueFinesDeducted: hasLatePenalties && deductPenaltiesFromPrice,
      overdueFinesAmount: hasLatePenalties ? Number(latePenaltiesAmount) : 0,
      sellerWillingDiscountAmount: isWillingToDiscount ? Number(willingDiscountAmount) : undefined,
      acceptsInstallmentsForCash: acceptsCashInstallments,
      cashInstallmentsTerms: acceptsCashInstallments ? cashInstallmentNotes : undefined,
      taxCategory,
      taxBearer,
      eligibleForSwap: false,
      swapTargetType: '',
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
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'ar' ? 'منظومة التنازل المباشر • عمولة 0% على البائع' : 'Direct Assignment Portal • 0% Seller Fee'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? (
              <>سجل شقتك للتنازل واسترد <span className="text-[#0f766e]">كامل كاشك</span></>
            ) : (
              <>List For Assignment & Recover <span className="text-[#0f766e]">100% Cash In Full</span></>
            )}
          </h1>

          <p className="text-slate-500 text-xs sm:text-sm">
            {language === 'ar'
              ? 'خطوات سريعة وبسيطة: أدخل بيانات الوحدة، وسنقوم بالتواصل وتنسيق التنازل الرسمي بمقر المطور بشيك مصرفي معتمد.'
              : 'Simple quick steps: Enter your unit details, and we coordinate the official transfer at developer HQ with zero fees.'}
          </p>
        </div>

        {/* Distinctive Sell Studio Layout: Stepper + Live Audit Sidebar */}
        <div id="sell-form" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Banner: Direct Owner Info */}
          <div className="bg-slate-900 text-white px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-800 flex items-center justify-center text-white shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-200">
                {language === 'ar' 
                  ? 'التعامل مع مالك الوحدة المباشر فقط — التنازل بمقر المطور وبدون أوفر برايس'
                  : 'Direct contract owners only — 0% overprice policy audited.'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'ar' ? 'فحص ومطابقة سريعة' : 'Fast Verification'}</span>
            </div>
          </div>

          {/* Stepper Header (Desktop Tabs / Mobile Cards) */}
          <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-2.5">
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
                    className={`relative p-2.5 rounded-xl text-start transition-all cursor-pointer border ${
                      isActive 
                        ? 'bg-white border-teal-700 shadow-xs'
                        : isPassed
                        ? 'bg-white/80 border-slate-300 text-slate-700 hover:bg-white'
                        : 'bg-slate-100/50 border-slate-200/80 text-slate-400 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isActive
                          ? 'bg-teal-700 text-white'
                          : isPassed
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isPassed ? <Check className="w-3 h-3" /> : st.num}
                      </div>
                      <IconComponent className={`w-3.5 h-3.5 ${
                        isActive ? 'text-teal-700' : isPassed ? 'text-slate-600' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="font-bold text-xs text-slate-800 line-clamp-1">
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
                    {currentStep === 4 && (language === 'ar' ? 'بيانات المالك والتوثيق والسرية' : 'Owner Verification & Statement')}
                    {currentStep === 5 && (language === 'ar' ? 'المراجعة النهائية والإقرار القانوني' : 'Legal Acknowledgment & Submission')}
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
                      <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                        <span>{language === 'ar' ? 'رسوم التنازل لدى المطور (Transfer Fee):' : 'Developer Transfer Fee:'}</span>
                        <span className="text-[11px] font-semibold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {language === 'ar' ? 'القاعدة الأساسية: على المشتري' : 'Rule: Borne by Buyer'}
                        </span>
                      </label>
                      <select
                        value={transferFeeBearer}
                        onChange={(e) => setTransferFeeBearer(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="على المشتري">{language === 'ar' ? 'يتحملها المشتري الجديد بالكامل (القاعدة المعتمدة)' : 'Borne by Buyer (Standard Platform Rule)'}</option>
                        <option value="معفي بالعقد">{language === 'ar' ? 'معفي من رسوم التنازل بنص العقد الأصلي للمطور' : 'Exempt from transfer fees by contract'}</option>
                        <option value="على البائع">{language === 'ar' ? 'يتحملها البائع (استثناء بناءً على رغبة البائع)' : 'Borne by Seller (Special exception)'}</option>
                        <option value="مناصفة">{language === 'ar' ? 'مناصفة بين الطرفين (50% / 50%)' : '50/50 Shared'}</option>
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {language === 'ar'
                          ? '💡 وفقاً لقواعد المنصة، يتحمل المشتري رسوم التنازل لشركة التطوير مقابل حصوله على الوحدة بسعر التعاقد القديم بدون أوفر برايس.'
                          : '💡 Per platform policy, transfer fees are borne by the buyer in exchange for acquiring the property at original contract value.'}
                      </p>
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
                        <span>{language === 'ar' ? 'توجد غرامات أو متأخرات على الوحدة' : 'Pending Overdue Fines'}</span>
                      </label>
                    </div>

                    {/* حقل تفاصيل الغرامات والمتأخرات وخصمها */}
                    {hasLatePenalties && (
                      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-bold text-rose-900">
                            {language === 'ar' ? 'قيمة المتأخرات / الغرامات المستحقة للمطور (ج.م):' : 'Overdue Fines Amount (EGP):'}
                          </label>
                          <input
                            type="number"
                            value={latePenaltiesAmount || ''}
                            onChange={(e) => setLatePenaltiesAmount(Number(e.target.value))}
                            placeholder="مثال: 50,000"
                            className="w-full sm:w-48 px-3 py-1.5 bg-white border border-rose-300 rounded-lg text-xs font-sans font-bold text-rose-950"
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-rose-800">
                          <input
                            type="checkbox"
                            checked={deductPenaltiesFromPrice}
                            onChange={(e) => setDeductPenaltiesFromPrice(e.target.checked)}
                            className="w-3.5 h-3.5 accent-rose-600"
                          />
                          <span>
                            {language === 'ar'
                              ? 'خصم قيمة المتأخرات من الكاش المستحق لي، على أن يسددها المشتري للمطور بدلاً مني'
                              : 'Deduct overdue fines from cash due to me, buyer settles with developer instead'}
                          </span>
                        </label>
                      </div>
                    )}

                    {/* قسم العروض النارية والتخارج العاجل (Fire Sale & Promotions) */}
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="text-amber-500">🔥</span>
                          <span>{language === 'ar' ? 'هل ترغب في تخارج فوري سريع (عرض ترويجي خاص)؟' : 'Offer Urgent Fire Sale Discount?'}</span>
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isWillingToDiscount}
                            onChange={(e) => setIsWillingToDiscount(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>

                      {isWillingToDiscount && (
                        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                          <p className="text-[11px] text-amber-900 leading-relaxed">
                            {language === 'ar'
                              ? 'منح خصم إضافي من قيمة ما دفعته يضع وحدتك في صدارة "عروض التخارج العاجل" بالموقع، ويجذب المستثمرين الكاش في أقل من 24 ساعة!'
                              : 'Granting an extra discount under paid capital promotes your unit in Hot Deals, closing within 24 hours!'}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-amber-950">{language === 'ar' ? 'مبلغ الخصم المستعد للتنازل عنه:' : 'Discount Amount:'}</span>
                            <input
                              type="number"
                              value={willingDiscountAmount}
                              onChange={(e) => setWillingDiscountAmount(Number(e.target.value))}
                              step={10000}
                              className="w-40 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-sans font-black text-amber-900"
                            />
                            <span className="text-xs text-amber-800 font-bold">{t('egp')}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* قسم التسهيلات في استلام الكاش */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                        <input
                          type="checkbox"
                          checked={acceptsCashInstallments}
                          onChange={(e) => setAcceptsCashInstallments(e.target.checked)}
                          className="w-4 h-4 accent-[#0f766e]"
                        />
                        <span>{language === 'ar' ? 'هل تقبل تسهيلات في سداد الكاش (مثلاً: دفعة أولى كاش والباقي بشيك مقبول الدفع بعد شهرين)؟' : 'Accept Flexible Cash Installments (e.g. 2 tranches with certified checks)?'}</span>
                      </label>
                      {acceptsCashInstallments && (
                        <input
                          type="text"
                          value={cashInstallmentNotes}
                          onChange={(e) => setCashInstallmentNotes(e.target.value)}
                          placeholder={language === 'ar' ? 'اكتب شروطك للتسهيلات (مثال: 60% عند التوقيع و40% بشيك بعد شهرين)...' : 'E.g., 60% on signing, 40% certified check in 60 days...'}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        />
                      )}
                    </div>

                    {/* قسم نوع العقار والضرائب */}
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {language === 'ar' ? 'المعاملة الضريبية للوحدة:' : 'Tax & Legal Classification:'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <select
                          value={taxCategory}
                          onChange={(e) => setTaxCategory(e.target.value as any)}
                          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                        >
                          <option value="residential_exempt">{language === 'ar' ? 'سكني (معفى من القيمة المضافة VAT)' : 'Residential (VAT Exempt)'}</option>
                          <option value="commercial_vat">{language === 'ar' ? 'تجاري / إداري (خاضع لضريبة القيمة المضافة)' : 'Commercial / Retail (VAT Applicable)'}</option>
                          <option value="business_tax">{language === 'ar' ? 'أصل مملوك لشركة (ضريبة أرباح تجارية)' : 'Corporate Owned (Business Profit Tax)'}</option>
                        </select>
                        <select
                          value={taxBearer}
                          onChange={(e) => setTaxBearer(e.target.value as any)}
                          className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                        >
                          <option value="حسب القانون">{language === 'ar' ? 'كل طرف يتحمل التزامه الضريبي قانوناً' : 'Each party bears statutory tax dues'}</option>
                          <option value="معفى">{language === 'ar' ? 'معفاة تماماً داخل كمبوند المطور' : 'Fully Exempt at Developer Compound'}</option>
                          <option value="بائع">{language === 'ar' ? 'يتحملها البائع' : 'Borne by Seller'}</option>
                          <option value="مشتري">{language === 'ar' ? 'يتحملها المشتري' : 'Borne by Buyer'}</option>
                        </select>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {language === 'ar'
                          ? '⚖️ القاعدة المعمول بها: يتحمل كل طرف ما يفرضه القانون عليه، والوحدات السكنية العادية لا تفرض عليها ضرائب قيمة مضافة.'
                          : '⚖️ Standard practice: each party pays statutory taxes; normal residential resales are VAT exempt.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: بيانات المالك والتوثيق والسرية */}
                {currentStep === 4 && (
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

                {/* STEP 5: التأكيد والإقرار النهائي */}
                {currentStep === 5 && (
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

                      {/* بند إخلاء مسؤولية المنصة عن صحة الورق والضرائب */}
                      <div
                        onClick={() => setAckPlatformDisclaimer(!ackPlatformDisclaimer)}
                        className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-900 block">
                            {language === 'ar'
                              ? 'إقرار الشفافية والمسؤولية القانونية وإخلاء مسؤولية المنصة:'
                              : 'Legal Disclaimer & Statutory Responsibility:'}
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {language === 'ar'
                              ? 'أقر بأن المنصة هي وسيط تقني وإعلاني للتوفيق فقط، وليست مسؤولة عن صحة المستندات أو أصل الملكية أو سلامة التوكيلات، حيث تقع المراجعة والاعتماد النهائي حصراً على عاتق الشؤون القانونية للمطور العقاري بمقره الرسمي. كما يلتزم كل طرف بما عليه من التزامات ضريبية مقررة قانوناً.'
                              : 'Platform is a matching portal and not liable for document authenticity; final verification rests exclusively with developer legal counsel at HQ. Parties bear statutory taxes.'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={ackPlatformDisclaimer}
                          onChange={(e) => setAckPlatformDisclaimer(e.target.checked)}
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
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-200">
                      {language === 'ar' ? 'المطابقة المالية الفورية' : 'Live Financial Audit'}
                    </span>
                    <span className="text-[11px] text-teal-300 font-semibold">
                      {language === 'ar' ? 'استرداد 100% كاش' : '100% Cash'}
                    </span>
                  </div>

                  {/* Cash Recovery Highlight */}
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 block">
                      {language === 'ar' ? 'المبلغ المسترد بالكامل لك:' : 'Net Cash Paid (To Recover):'}
                    </span>
                    <div className="text-2xl font-bold font-sans text-teal-400">
                      {formatEGP(paidAmount)}
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {language === 'ar' ? 'بشيك مصرفي مقبول الدفع فور التنازل' : 'Paid via certified cashier check upon signing'}
                    </span>
                  </div>

                  {/* Visual Progress Bar of Paid vs Remaining */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{language === 'ar' ? `المدفوع (${paidPercent}%)` : `Paid (${paidPercent}%)`}</span>
                      <span>{language === 'ar' ? `المتبقي (${remainingPercent}%)` : `Remaining (${remainingPercent}%)`}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                      <div style={{ width: `${paidPercent}%` }} className="bg-teal-600 h-full transition-all duration-300" />
                      <div style={{ width: `${remainingPercent}%` }} className="bg-slate-700 h-full transition-all duration-300" />
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'ar' ? 'سعر العقد الإجمالي:' : 'Contract Price:'}</span>
                      <span className="font-sans font-medium text-white">{formatEGP(contractPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'ar' ? 'المتبقي للمطور بالأقساط:' : 'Remaining to Dev:'}</span>
                      <span className="font-sans font-medium text-slate-300">{formatEGP(remaining)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{language === 'ar' ? 'عمولة البائع:' : 'Seller Fee:'}</span>
                      <span className="font-bold text-teal-400">{language === 'ar' ? '0% مجاناً بالكامل' : '0% Free'}</span>
                    </div>
                  </div>

                  {/* Safe Exit Vs Cancellation Callout */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                      <TrendingDown className="w-3.5 h-3.5 text-teal-400" />
                      <span>{language === 'ar' ? 'توفير غرامة فسخ التعاقد:' : 'Penalty Saved:'}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {language === 'ar'
                        ? `توفر حوالي ${formatEGP(contractPrice * 0.15)} كانت ستخصم كغرامة 15% إذا قمت بفسخ العقد مع المطور.`
                        : `Saved ~${formatEGP(contractPrice * 0.15)} compared to contract termination.`}
                    </p>
                  </div>
                </div>

                {/* Liquidity Note */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-teal-700" />
                      <span>{language === 'ar' ? 'مؤشر المشترين الكاش' : 'Cash Buyers Index'}</span>
                    </span>
                    <span className="text-[11px] text-teal-800 font-semibold">
                      {language === 'ar' ? 'طلب نشط' : 'Active'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {language === 'ar'
                      ? `بمجرد فحص بيانات وحدتك، يتم إشعار المشترين الكاش المسجلين الباحثين عن ${compound || 'هذا الكمبوند'}.`
                      : `Once verified, your unit is matched to pre-registered buyers seeking this compound.`}
                  </p>
                </div>

                {/* Audit Desk Assurance Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>{language === 'ar' ? 'ضمانات التنازل الرسمي' : 'Assignment Safeguards'}</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                    <li>{language === 'ar' ? 'حضور ممثل قانوني من المنصة بمقر المطور.' : 'Legal representative attendance at developer HQ.'}</li>
                    <li>{language === 'ar' ? 'استرداد جميع شيكاتك البنكية المؤجلة فوراً.' : 'Retrieval of deferred checks upon signing.'}</li>
                    <li>{language === 'ar' ? 'إبراء ذمة رسمي ونهائي من إدارة المطور.' : 'Full clearance from developer.'}</li>
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
