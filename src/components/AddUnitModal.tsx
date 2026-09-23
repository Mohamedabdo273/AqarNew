import React, { useState } from 'react';
import {
  X,
  Building,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  FileUp,
  Lock,
  UserCheck,
  AlertCircle,
  HelpCircle,
  CheckSquare,
  Square
} from 'lucide-react';
import { PropertyType, RealEstateUnit } from '../types';
import { useUnits } from '../context/UnitsContext';
import { useLanguage } from '../context/LanguageContext';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillContractPrice?: number;
  prefillPaidAmount?: number;
  prefillDeveloper?: string;
  onUnitCreated?: (unit: RealEstateUnit) => void;
}

export const AddUnitModal: React.FC<AddUnitModalProps> = ({
  isOpen,
  onClose,
  prefillContractPrice = 5000000,
  prefillPaidAmount = 2000000,
  prefillDeveloper = 'بالم هيلز',
  onUnitCreated
}) => {
  const { addUnit } = useUnits();
  const { language, t, isRTL } = useLanguage();

  // 6 Steps Flow as requested in user's design reference:
  // Step 1: بيانات الوحدة (المطور، المشروع، السعر، المدفوع، تأكيد استلام المدفوع فقط)
  // Step 2: مواصفات الوحدة (النوع، المنطقة، المساحة، الغرف، الحمامات، الدور، الواجهة)
  // Step 3: جدول الأقساط (قيمة القسط، دوريته، موعد القادم، رسوم التنازل)
  // Step 4: المبادلة الذكية والمناقلة (هل تود مبادلتها؟ ونوع الأصل المستهدف)
  // Step 5: بيانات المالك والتوثيق (اسم المالك، رقم الهاتف/واتساب، إرفاق المستند)
  // Step 6: مراجعة الطلب والإقرار النهائي (التأكيد على صفر أوفر برايس والتعامل مع المالك فقط)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Step 1 Data
  const [developer, setDeveloper] = useState(prefillDeveloper);
  const [compound, setCompound] = useState('');
  const [contractPrice, setContractPrice] = useState<number>(prefillContractPrice);
  const [paidAmount, setPaidAmount] = useState<number>(prefillPaidAmount);
  const [understandsExactPaid, setUnderstandsExactPaid] = useState<boolean>(true);
  const [currentMarketPrice, setCurrentMarketPrice] = useState<string>('');

  // Step 2 Data
  const [propertyType, setPropertyType] = useState<PropertyType>('شقة');
  const [region, setRegion] = useState<'القاهرة الجديدة' | 'الشيخ زايد وأكتوبر' | 'العاصمة الإدارية' | 'الساحل الشمالي' | 'المستقبل والشروق' | 'البحر الأحمر'>('القاهرة الجديدة');
  const [areaM2, setAreaM2] = useState<number>(160);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [floor, setFloor] = useState('الدور الثالث');
  const [viewOrientation, setViewOrientation] = useState<'بحري صريح' | 'بحري شرقي' | 'قبلي' | 'شرقي' | 'غربي'>('بحري صريح');
  const [finishing, setFinishing] = useState<any>('نصف تشطيب');
  const [phaseName, setPhaseName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [parkingIncluded, setParkingIncluded] = useState(true);

  // Step 3 Data
  const [installmentValue, setInstallmentValue] = useState<number>(120000);
  const [installmentFrequency, setInstallmentFrequency] = useState<'شهري' | 'ربع سنوي' | 'نصف سنوي' | 'سنوي'>('ربع سنوي');
  const [installmentPeriodYears, setInstallmentPeriodYears] = useState<number>(5);
  const [nextInstallmentDate, setNextInstallmentDate] = useState('2026-11-01');
  const [transferFeeBearer, setTransferFeeBearer] = useState<'بائع' | 'مشتري' | 'مناصفة' | 'معفي بالعقد'>('معفي بالعقد');

  // Step 4 Data
  const [eligibleForSwap, setEligibleForSwap] = useState(true);
  const [swapTargetType, setSwapTargetType] = useState('مكتب إداري أو عيادة أو شقة أصغر');

  // Step 5 Data
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Step 6 Acknowledgments
  const [ackIsDirectOwner, setAckIsDirectOwner] = useState<boolean>(true);
  const [ackNoBroker, setAckNoBroker] = useState<boolean>(true);

  // Result state
  const [submitted, setSubmitted] = useState(false);
  const [createdUnit, setCreatedUnit] = useState<RealEstateUnit | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const remaining = Math.max(0, contractPrice - paidAmount);

  const formatEGP = (num: number) => {
    return (
      new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
        maximumFractionDigits: 0
      }).format(num) + (language === 'ar' ? ' ج.م' : ' EGP')
    );
  };

  const validateStep = (step: number): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (!developer.trim()) {
        setValidationError(language === 'ar' ? 'يرجى كتابة اسم المطور' : 'Please enter the developer name');
        return false;
      }
      if (!compound.trim()) {
        setValidationError(language === 'ar' ? 'يرجى كتابة اسم المشروع / الكمبوند' : 'Please enter the compound/project name');
        return false;
      }
      if (!contractPrice || contractPrice <= 0) {
        setValidationError(language === 'ar' ? 'يرجى إدخال إجمالي سعر الوحدة في العقد' : 'Please enter original contract price');
        return false;
      }
      if (!paidAmount || paidAmount <= 0) {
        setValidationError(language === 'ar' ? 'يرجى إدخال إجمالي المبلغ المسدد' : 'Please enter total paid cash');
        return false;
      }
      if (paidAmount > contractPrice) {
        setValidationError(language === 'ar' ? 'المبلغ المسدد لا يمكن أن يتجاوز ثمن الوحدة' : 'Paid cash cannot exceed contract price');
        return false;
      }
      if (!understandsExactPaid) {
        setValidationError(language === 'ar' ? 'يجب الإقرار بأنك تستلم ما دفعته بالضبط بدون أوفر' : 'Please confirm that you will recover exact paid amount');
        return false;
      }
    } else if (step === 2) {
      if (!areaM2 || areaM2 <= 0) {
        setValidationError(language === 'ar' ? 'يرجى إدخال المساحة بالمتر المربع' : 'Please enter property area in sqm');
        return false;
      }
    } else if (step === 5) {
      if (!ownerName.trim()) {
        setValidationError(language === 'ar' ? 'يرجى إدخال اسم المالك كما هو مدون في العقد' : 'Please enter owner name as written in contract');
        return false;
      }
      if (!ownerPhone.trim()) {
        setValidationError(language === 'ar' ? 'يرجى إدخال رقم الهاتف أو الواتساب للتواصل' : 'Please enter your phone/WhatsApp number');
        return false;
      }
    } else if (step === 6) {
      if (!ackIsDirectOwner || !ackNoBroker) {
        setValidationError(language === 'ar' ? 'يجب تأكيد أنك المالك المباشر للوحدة ولست وسيطاً أو سمساراً' : 'You must confirm that you are the direct owner and not a broker');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        submitForm();
      }
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitForm = () => {
    const newUnit = addUnit({
      developer: developer || (language === 'ar' ? 'مطور عقاري معتمد' : 'Approved Developer'),
      compound: compound || (language === 'ar' ? `كمبوند ${developer}` : `${developer} Compound`),
      propertyType,
      region,
      areaM2: Number(areaM2) || 160,
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 2,
      floor,
      viewOrientation,
      finishing,
      parkingIncluded,
      phaseName: phaseName || undefined,
      unitNumber: unitNumber || undefined,
      originalContractPrice: Number(contractPrice),
      paidCashAmount: Number(paidAmount),
      installmentValue: Number(installmentValue),
      installmentFrequency,
      installmentPeriodYears: Number(installmentPeriodYears) || 5,
      transferFeeBearer,
      eligibleForSwap,
      swapTargetType: eligibleForSwap ? swapTargetType : undefined,
      nextInstallmentDate: nextInstallmentDate || '2026-12-01',
      ownerName,
      ownerPhone,
      uploadedFileName: uploadedFile || undefined
    });
    setCreatedUnit(newUnit);
    setSubmitted(true);
    if (onUnitCreated) {
      onUnitCreated(newUnit);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setCreatedUnit(null);
    onClose();
  };

  // Step Titles
  const stepTitles = [
    language === 'ar' ? 'بيانات الوحدة' : 'Unit Details',
    language === 'ar' ? 'المواصفات' : 'Specifications',
    language === 'ar' ? 'جدول الأقساط' : 'Installments',
    language === 'ar' ? 'المبادلة الذكية' : 'Smart Swap',
    language === 'ar' ? 'بيانات المالك' : 'Owner Contact',
    language === 'ar' ? 'التأكيد والإقرار' : 'Verification'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[92vh]"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-700"></span>
            <span className="text-xs font-bold text-slate-900">
              {language === 'ar'
                ? 'طلب قيد وتنازل رسمي • استرداد 100% كاش (0% عمولة على البائع)'
                : 'Formal Assignment Listing • 100% Cash Recovery (0% Seller Fee)'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Header / Progress Bar */}
        {!submitted && (
          <div className="p-4 sm:px-6 border-b border-slate-100 bg-white">
            {/* Owner-Only Notice Box (As seen in User Screenshot) */}
            <div className="mb-4 rounded-xl border border-slate-300 bg-slate-50/70 p-3.5 sm:p-4 text-slate-800">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'ar' ? 'بنتعامل مع مالك الوحدة نفسه بس' : 'We Deal Exclusively With Direct Unit Owners'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {language === 'ar'
                      ? 'الطلبات اللي بتيجي من سماسرة أو وسطاء بنستبعدها، وأي وحدة يتبين إنها من وسيط بترفض أو بتتحذف نهائياً. سبب المنصة الأساسي إن المشتري ياخد سعر التعاقد القديم من غير أوفر — ووجود وسيط بيضيف هامش وبيلغي الفكرة كلها.'
                      : 'Requests from brokers or middlemen are strictly excluded. Any listing discovered to come from an intermediary is immediately rejected. The platform purpose is for buyers to acquire old contract price with ZERO overprice.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Step Counter & Title */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900 text-base">
                {stepTitles[currentStep - 1]}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {language === 'ar' ? `خطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
              </span>
            </div>

            {/* Progress Bar with 6 segments */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5, 6].map((st) => (
                <div
                  key={st}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    st <= currentStep ? 'bg-teal-700' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 text-slate-900 flex-1">
          {submitted ? (
            <div className="text-center py-6 space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 bg-emerald-50 text-[#0f766e] rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {language === 'ar' ? 'تم قيد وحدتك بنجاح وبدء المراجعة الفنية!' : 'Unit Registered Successfully!'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar' ? (
                  <>
                    شكراً لك يا <strong>{ownerName || 'فندم'}</strong>. استلمنا طلب التنازل لوحدتك في مشروع ({compound || developer})، وكود التدقيق المعتمد هو:{' '}
                    <span className="font-mono font-bold text-[#0f766e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {createdUnit?.verificationCode || 'TNZ-VERIFIED'}
                    </span>
                    . سيتواصل معك مستشار التوثيق لمطابقة كشف حساب المطور وتنسيق موعد التنازل.
                  </>
                ) : (
                  <>
                    Thank you <strong>{ownerName || 'Sir/Madam'}</strong>. Your assignment listing in ({compound || developer}) was recorded under audit ref:{' '}
                    <span className="font-mono font-bold text-[#0f766e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {createdUnit?.verificationCode || 'TNZ-VERIFIED'}
                    </span>
                    .
                  </>
                )}
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 text-right">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{language === 'ar' ? 'المبلغ المسترد لك كاش بالكامل:' : 'Cash You Recover:'}</span>
                  <strong className="text-[#0f766e] font-black text-sm">{formatEGP(paidAmount)}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{language === 'ar' ? 'الأوفر برايس على المشتري:' : 'Overprice:'}</span>
                  <strong className="text-emerald-700 font-bold">{language === 'ar' ? '0 ج.م (سعر التعاقد القديم)' : '0 EGP'}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{language === 'ar' ? 'عمولة المنصة على البائع:' : 'Platform Fee:'}</span>
                  <strong className="text-emerald-700 font-bold">{language === 'ar' ? '0% مجاناً 100%' : '0% - 100% Free'}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  {language === 'ar' ? 'تم، العودة واستعراض المنصة' : 'Done, Back to Listings'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Validation alert */}
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 1: بيانات الوحدة (Exact Match of Screenshot Layout) */}
              {/* ========================================================= */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* اسم المطور */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {language === 'ar' ? 'اسم المطور' : 'Developer Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'مثال: بالم هيلز، سوديك، إعمار، ماونتن فيو...' : 'e.g. Palm Hills, SODIC, Emaar...'}
                      value={developer}
                      onChange={(e) => setDeveloper(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
                    />
                  </div>

                  {/* اسم المشروع / الكمبوند */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {language === 'ar' ? 'اسم المشروع / الكمبوند' : 'Compound / Project Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'مثال: بادية، فيليت، هايد بارك، ميفيدا...' : 'e.g. Badya, Villette, Hyde Park...'}
                      value={compound}
                      onChange={(e) => setCompound(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
                    />
                  </div>

                  {/* إجمالي سعر الوحدة في العقد */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {language === 'ar' ? 'إجمالي سعر الوحدة في العقد' : 'Total Contract Price'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        step={50000}
                        placeholder="5,000,000"
                        value={contractPrice || ''}
                        onChange={(e) => setContractPrice(Number(e.target.value))}
                        className={`w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-sans focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] ${
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

                  {/* إجمالي اللي دفعته لحد النهارده */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {language === 'ar' ? 'إجمالي اللي دفعته لحد النهارده' : 'Total Cash Paid Until Today'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        step={25000}
                        placeholder="2,000,000"
                        value={paidAmount || ''}
                        onChange={(e) => setPaidAmount(Number(e.target.value))}
                        className={`w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-sans text-[#0f766e] font-bold focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] ${
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

                  {/* Notice Box: هتستلم المبلغ اللي دفعته بالظبط - بدون أي أوفر أو زيادة */}
                  <div className="rounded-xl bg-sky-50/70 border border-sky-200 p-3 text-center text-xs font-bold text-sky-800">
                    {language === 'ar'
                      ? 'هتستلم المبلغ اللي دفعته بالظبط — بدون أي أوفر أو زيادة.'
                      : 'You will recover the exact cash amount you paid — with zero overprice or markups.'}
                  </div>

                  {/* Checkbox: أؤكد إني فاهم إن المبلغ اللي هستلمه هو اللي دفعته بالظبط - بدون أي أوفر أو زيادة */}
                  <div
                    onClick={() => setUnderstandsExactPaid(!understandsExactPaid)}
                    className="p-3.5 rounded-xl border border-slate-300 bg-slate-50/50 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800">
                      {language === 'ar'
                        ? 'أؤكد إني فاهم إن المبلغ اللي هستلمه هو اللي دفعته بالظبط — بدون أي أوفر أو زيادة.'
                        : 'I confirm that the cash amount I will receive is strictly what I paid — zero overprice.'}
                    </span>
                    <input
                      type="checkbox"
                      checked={understandsExactPaid}
                      onChange={(e) => setUnderstandsExactPaid(e.target.checked)}
                      className="w-4 h-4 accent-[#0f766e] rounded cursor-pointer shrink-0"
                    />
                  </div>

                  {/* سعر نفس الوحدة من المطور النهارده (لو تعرفه) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {language === 'ar' ? 'سعر نفس الوحدة من المطور النهارده (لو تعرفه)' : 'Current Developer Price for Same Unit (Optional)'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={language === 'ar' ? 'مثال: 9,000,000 ج.م حالياً لدى المطور' : 'e.g. 9,000,000 EGP'}
                        value={currentMarketPrice}
                        onChange={(e) => setCurrentMarketPrice(e.target.value)}
                        className={`w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e] ${
                          isRTL ? 'pl-10 text-right' : 'pr-10 text-left'
                        }`}
                      />
                      <span className={`absolute top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold ${
                        isRTL ? 'left-3' : 'right-3'
                      }`}>
                        {t('egp')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {language === 'ar' ? 'يساعد هذا الرقم في إبراز قوة وفرصة وحدتك للمشترين المعتمدين.' : 'Helps highlight the savings for prospective buyers.'}
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 2: مواصفات الوحدة التفصيلية */}
              {/* ========================================================= */}
              {currentStep === 2 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'نوع الوحدة' : 'Property Type'}
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
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
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'المنطقة' : 'Region'}
                      </label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      >
                        <option value="القاهرة الجديدة">{language === 'ar' ? 'القاهرة الجديدة' : 'New Cairo'}</option>
                        <option value="الشيخ زايد وأكتوبر">{language === 'ar' ? 'الشيخ زايد وأكتوبر' : 'Sheikh Zayed & October'}</option>
                        <option value="العاصمة الإدارية">{language === 'ar' ? 'العاصمة الإدارية' : 'New Capital'}</option>
                        <option value="الساحل الشمالي">{language === 'ar' ? 'الساحل الشمالي' : 'North Coast'}</option>
                        <option value="المستقبل والشروق">{language === 'ar' ? 'المستقبل والشروق' : 'Mostakbal & Shorouk'}</option>
                        <option value="البحر الأحمر">{language === 'ar' ? 'البحر الأحمر والجونة' : 'Red Sea & El Gouna'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'المساحة (م²)' : 'Area (sqm)'}
                      </label>
                      <input
                        type="number"
                        min={30}
                        max={2000}
                        value={areaM2}
                        onChange={(e) => setAreaM2(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                      </label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'الحمامات' : 'Bathrooms'}
                      </label>
                      <select
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'الدور / الطابق' : 'Floor'}
                      </label>
                      <input
                        type="text"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: الدور الثالث' : 'e.g. 3rd Floor'}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'الواجهة والاتجاه' : 'Orientation'}
                      </label>
                      <select
                        value={viewOrientation}
                        onChange={(e) => setViewOrientation(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      >
                        <option value="بحري صريح">{language === 'ar' ? 'بحري صريح' : 'North'}</option>
                        <option value="بحري شرقي">{language === 'ar' ? 'بحري شرقي' : 'North-East'}</option>
                        <option value="قبلي">{language === 'ar' ? 'قبلي' : 'South'}</option>
                        <option value="شرقي">{language === 'ar' ? 'شرقي' : 'East'}</option>
                        <option value="غربي">{language === 'ar' ? 'غربي' : 'West'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'المرحلة داخل المشروع (اختياري)' : 'Phase Name (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={phaseName}
                        onChange={(e) => setPhaseName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: المرحلة 2' : 'e.g. Phase 2'}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'رقم العمارة / الوحدة (سري لدى الإدارة)' : 'Unit Number (Private)'}
                      </label>
                      <input
                        type="text"
                        value={unitNumber}
                        onChange={(e) => setUnitNumber(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: عمارة 12 شقة 4' : 'e.g. Bldg 12 Apt 4'}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={parkingIncluded}
                        onChange={(e) => setParkingIncluded(e.target.checked)}
                        className="w-4 h-4 accent-[#0f766e]"
                      />
                      <span>{language === 'ar' ? 'يشمل باكية جراج' : 'Parking slot included'}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 3: جدول الأقساط المتبقية للمطور */}
              {/* ========================================================= */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  {/* Summary Box */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500 block">{language === 'ar' ? 'المتبقي أقساط للمطور:' : 'Remaining to Developer:'}</span>
                      <strong className="text-slate-900 font-black font-sans text-base">{formatEGP(remaining)}</strong>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {language === 'ar' ? 'يتكفل به المشتري الجديد بالكامل' : 'Assumed by Buyer'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'قيمة القسط الدوري' : 'Installment Value'}
                      </label>
                      <input
                        type="number"
                        value={installmentValue}
                        onChange={(e) => setInstallmentValue(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'دورية سداد القسط' : 'Payment Frequency'}
                      </label>
                      <select
                        value={installmentFrequency}
                        onChange={(e) => setInstallmentFrequency(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                      >
                        <option value="شهري">{language === 'ar' ? 'شهري' : 'Monthly'}</option>
                        <option value="ربع سنوي">{language === 'ar' ? 'ربع سنوي (كل 3 شهور)' : 'Quarterly'}</option>
                        <option value="نصف سنوي">{language === 'ar' ? 'نصف سنوي' : 'Semi-Annual'}</option>
                        <option value="سنوي">{language === 'ar' ? 'سنوي' : 'Annual'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'تاريخ استحقاق القسط القادم' : 'Next Due Date'}
                      </label>
                      <input
                        type="date"
                        value={nextInstallmentDate}
                        onChange={(e) => setNextInstallmentDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ar' ? 'سنوات الأقساط المتبقية' : 'Remaining Years'}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={installmentPeriodYears}
                        onChange={(e) => setInstallmentPeriodYears(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {language === 'ar' ? 'رسوم التنازل لدى المطور (Transfer Fee)' : 'Developer Transfer Fee'}
                    </label>
                    <select
                      value={transferFeeBearer}
                      onChange={(e) => setTransferFeeBearer(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    >
                      <option value="معفي بالعقد">{language === 'ar' ? 'معفي من رسوم التنازل بنص العقد' : 'Exempt from transfer fees by contract'}</option>
                      <option value="على البائع">{language === 'ar' ? 'يتحملها البائع' : 'Borne by seller'}</option>
                      <option value="على المشتري">{language === 'ar' ? 'يتحملها المشتري' : 'Borne by buyer'}</option>
                      <option value="مناصفة">{language === 'ar' ? 'مناصفة بين الطرفين' : '50/50 Shared'}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 4: المبادلة الذكية والمناقلة */}
              {/* ========================================================= */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eligibleForSwap}
                        onChange={(e) => setEligibleForSwap(e.target.checked)}
                        className="w-4 h-4 accent-[#0f766e] mt-0.5 shrink-0"
                      />
                      <div>
                        <span className="text-xs font-black text-slate-900 block">
                          {language === 'ar'
                            ? 'أرحب أيضاً بمبادلة ومناقلة هذه الوحدة بأصل عقاري آخر'
                            : 'Open to Smart Property Swap for another real estate asset'}
                        </span>
                        <span className="text-[11px] text-slate-600">
                          {language === 'ar'
                            ? 'إذا كنت تبحث عن تخفيف الأقساط بالانتقال إلى مكتب إداري، عيادة، أو شقة أصغر بدون تسييل نقدي.'
                            : 'Transfer your paid equity directly to a lower-installment asset like an office, clinic, or smaller unit.'}
                        </span>
                      </div>
                    </label>

                    {eligibleForSwap && (
                      <div className="pt-2 border-t border-teal-200/60">
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {language === 'ar' ? 'نوع الأصل المرغوب في المبادلة به:' : 'Target Asset for Swap:'}
                        </label>
                        <input
                          type="text"
                          value={swapTargetType}
                          onChange={(e) => setSwapTargetType(e.target.value)}
                          placeholder={language === 'ar' ? 'مثال: عيادة في التجمع أو شقة أصغر في زايد بقسط أقل...' : 'e.g. Clinic or smaller unit with lower payments...'}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 5: بيانات المالك والتوثيق والسرية */}
              {/* ========================================================= */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {language === 'ar' ? 'اسم المالك (كما بالعقد)' : 'Owner Name (as per contract)'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'الاسم الثلاثي أو الرباعي...' : 'Full Legal Name...'}
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      {language === 'ar' ? 'رقم الموبايل (واتساب مباشر للتواصل)' : 'Mobile Phone (Direct WhatsApp)'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010XXXXXXXX"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]"
                      dir="ltr"
                    />
                  </div>

                  {/* Upload file */}
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                    <FileUp className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-xs font-bold text-slate-800 block">
                      {language === 'ar' ? 'إرفاق صورة كشف الحساب أو إيصال السداد (اختياري)' : 'Attach statement copy or payment receipt (optional)'}
                    </span>
                    <span className="text-[11px] text-slate-500 block mb-2">
                      {language === 'ar' ? 'للتسريع من مطابقة كشف الحساب مع المطور خلال ساعتين' : 'Accelerates statement audit with developer within 2 hours'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedFile(e.target.files[0].name);
                        }
                      }}
                      className="hidden"
                      id="contract-upload-modal"
                    />
                    <label
                      htmlFor="contract-upload-modal"
                      className="inline-block px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50"
                    >
                      {uploadedFile ? (language === 'ar' ? `تم الاختيار: ${uploadedFile}` : `Selected: ${uploadedFile}`) : (language === 'ar' ? 'اختيار ملف من جهازك' : 'Choose File')}
                    </label>
                  </div>

                  <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
                    <span>
                      {language === 'ar'
                        ? 'تأكيد الخصوصية: رقم وحدتك وبياناتك الشخصية لا تظهر في أي إعلان علني، ولا نتقاضى أي مصاريف أو عمولات من البائع.'
                        : 'Privacy Guarantee: Your unit number and personal contact are never shared publicly. Zero fees on seller.'}
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 6: التأكيد والإقرار النهائي */}
              {/* ========================================================= */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  {/* Summary Review Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                    <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                      {language === 'ar' ? 'ملخص طلب التنازل واسترداد الكاش:' : 'Listing Summary:'}
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
                  </div>

                  {/* Anti-Broker Mandatory Declarations */}
                  <div className="space-y-2.5 pt-1">
                    <div
                      onClick={() => setAckIsDirectOwner(!ackIsDirectOwner)}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
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
                        className="w-4 h-4 accent-teal-700 rounded cursor-pointer shrink-0"
                      />
                    </div>

                    <div
                      onClick={() => setAckNoBroker(!ackNoBroker)}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
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
                        className="w-4 h-4 accent-teal-700 rounded cursor-pointer shrink-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
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
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
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
          )}
        </div>
      </div>
    </div>
  );
};
