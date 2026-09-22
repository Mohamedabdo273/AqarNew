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
  ExternalLink
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
  const { createUnit, developers, compounds, regions, loadCompounds } = useUnits();
  const { language, t, isRTL } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [developerId, setDeveloperId] = useState<number>(0);
  const [compoundId, setCompoundId] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<number>(1);
  const [areaM2, setAreaM2] = useState<number>(160);

  const selectedCompound = compounds.find((c) => c.id === compoundId);
  const selectedRegionName =
    regions.find((r) => r.id === selectedCompound?.regionId)?.nameAr ?? '';
  
  const [contractPrice, setContractPrice] = useState<number>(prefillContractPrice);
  const [paidAmount, setPaidAmount] = useState<number>(prefillPaidAmount);
  const [nextInstallmentDate, setNextInstallmentDate] = useState('');
  const [installmentValue, setInstallmentValue] = useState<number>(120000);

  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [createdUnit, setCreatedUnit] = useState<RealEstateUnit | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const remaining = Math.max(0, contractPrice - paidAmount);

  const formatEGP = (num: number) => {
    return (
      new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
        maximumFractionDigits: 0
      }).format(num) + (language === 'ar' ? ' ج.م' : ' EGP')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!developerId || !compoundId) {
      setSubmitError(language === 'ar' ? 'اختار المطور والمشروع' : 'Select developer and project');
      return;
    }

    setSaving(true);
    try {
      await createUnit(
        {
          developerId,
          compoundId,
          propertyType,
          areaM2: Number(areaM2) || 150,
          originalContractPrice: Number(contractPrice),
          paidCashAmount: Number(paidAmount),
          remainingAmount: remaining,
          installmentValue: Number(installmentValue) || undefined,
          installmentFrequency: 2, // ربع سنوي — الأشيع في السوق
          nextInstallmentDate: nextInstallmentDate || undefined,
        },
        // العقد لازم يترفع عشان الوحدة تروح للمراجعة
        uploadedFile ? [{ docType: 1, file: uploadedFile }] : undefined
      );
      setSubmitted(true);
      onUnitCreated?.(undefined as unknown as RealEstateUnit);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : language === 'ar' ? 'مقدرناش نحفظ الوحدة' : 'Could not save the unit'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    setCreatedUnit(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-[#e5e7eb] relative flex flex-col max-h-[92vh]"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f5f6f8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]"></span>
            <span className="text-xs font-bold text-[#0f172a]">
              {language === 'ar' 
                ? 'اعرض وحدتك للتنازل • استرجع 100% كاش (عمولة 0% عليك)' 
                : 'List Your Unit for Exit • Recover 100% Cash (0% Seller Fee)'}
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

        {/* Step Indicator */}
        {!submitted && (
          <div className="bg-slate-50 px-6 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step >= 1 ? 'bg-[#0f766e] text-white' : 'bg-slate-200 text-slate-600'
              }`}>1</span>
              <span className={step >= 1 ? 'text-[#0f172a]' : 'text-slate-400'}>
                {language === 'ar' ? 'بيانات الوحدة' : 'Unit Details'}
              </span>
            </div>
            <div className="h-px w-8 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step >= 2 ? 'bg-[#0f766e] text-white' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
              <span className={step >= 2 ? 'text-[#0f172a]' : 'text-slate-400'}>
                {language === 'ar' ? 'المدفوعات' : 'Financials'}
              </span>
            </div>
            <div className="h-px w-8 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                step >= 3 ? 'bg-[#0f766e] text-white' : 'bg-slate-200 text-slate-600'
              }`}>3</span>
              <span className={step >= 3 ? 'text-[#0f172a]' : 'text-slate-400'}>
                {language === 'ar' ? 'التأكيد' : 'Confirmation'}
              </span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="overflow-y-auto p-5 sm:p-6 text-[#0f172a]">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-[#ecfdf5] text-[#0f766e] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">
                {language === 'ar' ? 'تم إدراج وحدتك بنجاح في السوق!' : 'Unit Listed Successfully!'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {language === 'ar' ? (
                  <>تمت إضافة وحدتك برقم فحص كودي: <span className="font-mono font-bold text-[#0f766e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{createdUnit?.verificationCode || 'TNZ-VERIFIED'}</span>، وبدأ مشترون جادون في الاطلاع عليها بدون أي أوفر برايس.</>
                ) : (
                  <>Your unit is published under verification code: <span className="font-mono font-bold text-[#0f766e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{createdUnit?.verificationCode || 'TNZ-VERIFIED'}</span>. Verified buyers can now view it with 0% overprice.</>
                )}
              </p>

              <div className="bg-[#f5f6f8] p-3.5 rounded-xl border border-[#e5e7eb] max-w-xs mx-auto text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'المبلغ المسترد لك بالكامل:' : 'Total Recovered Cash:'}</span>
                  <strong className="text-[#0f766e] font-bold">{formatEGP(paidAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'العمولة على البائع:' : 'Seller Fee:'}</span>
                  <strong className="text-emerald-700 font-bold">{language === 'ar' ? '0% مجاناً 100%' : '0% - 100% Free'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'سعر التعاقد القديم:' : 'Original Contract Price:'}</span>
                  <span className="text-slate-700 font-medium">{formatEGP(contractPrice)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  {language === 'ar' ? 'استمرار وتصفح المنصة' : 'Continue & Explore Listings'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm text-[#0f172a]">
                    {language === 'ar' ? 'حدد بيانات الوحدة والمشروع:' : 'Specify Property & Project Information:'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'المطور العقاري:' : 'Developer:'}
                      </label>
                      <select
                        required
                        value={developerId}
                        onChange={(e) => {
                          const id = Number(e.target.value);
                          setDeveloperId(id);
                          setCompoundId(0);
                          loadCompounds(id);
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg"
                      >
                        <option value={0}>
                          {language === 'ar' ? '— اختر المطور —' : '— Select developer —'}
                        </option>
                        {developers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {language === 'ar' ? d.nameAr : d.nameEn ?? d.nameAr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'اسم المشروع / الكمبوند:' : 'Project / Compound Name:'}
                      </label>
                      <select
                        required
                        disabled={!developerId}
                        value={compoundId}
                        onChange={(e) => setCompoundId(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg disabled:opacity-50"
                      >
                        <option value={0}>
                          {developerId
                            ? language === 'ar' ? '— اختر المشروع —' : '— Select project —'
                            : language === 'ar' ? 'اختر المطور الأول' : 'Select a developer first'}
                        </option>
                        {compounds.map((c) => (
                          <option key={c.id} value={c.id}>
                            {language === 'ar' ? c.nameAr : c.nameEn ?? c.nameAr}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {language === 'ar'
                          ? 'مشروعك مش في القايمة؟ كلّمنا ونضيفه.'
                          : 'Project not listed? Contact us and we will add it.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'نوع الوحدة:' : 'Property Type:'}
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(Number(e.target.value))}
                        className="w-full px-2.5 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg"
                      >
                        <option value={1}>{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                        <option value={3}>{language === 'ar' ? 'تاون هاوس' : 'Townhouse'}</option>
                        <option value={2}>{language === 'ar' ? 'فيلا مستقلة' : 'Standalone Villa'}</option>
                        <option value={5}>{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                        <option value={8}>{language === 'ar' ? 'تجاري / محل' : 'Commercial / Retail'}</option>
                        <option value={7}>{language === 'ar' ? 'شاليه ساحلي' : 'Coastal Chalet'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'المنطقة:' : 'Region:'}
                      </label>
                      {/* المنطقة بتتحدد من الكمبوند في الباك إند — بنعرضها للتأكيد بس */}
                      <div className="w-full px-2.5 py-2 bg-slate-100 border border-[#e5e7eb] rounded-lg text-slate-500 truncate">
                        {selectedRegionName ||
                          (language === 'ar' ? 'حسب المشروع' : 'From project')}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'المساحة (م²):' : 'Area (sqm):'}
                      </label>
                      <input
                        type="number"
                        min={30}
                        max={2000}
                        value={areaM2}
                        onChange={(e) => setAreaM2(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{language === 'ar' ? 'المتابعة للمدفوعات' : 'Proceed to Financials'}</span>
                      {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm text-[#0f172a]">
                    {language === 'ar' ? 'الأرقام المالية والمدفوعات:' : 'Financial Schedule & Payments:'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'إجمالي ثمن الوحدة في العقد الأصلي (ج.م):' : 'Original Contract Price (EGP):'}
                      </label>
                      <input
                        type="number"
                        required
                        step={50000}
                        value={contractPrice}
                        onChange={(e) => setContractPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg font-sans"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'إجمالي ما سددته (المطلوب استرداده كاش):' : 'Total Paid Cash (To Be Recovered 100%):'}
                      </label>
                      <input
                        type="number"
                        required
                        step={25000}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg font-sans text-[#0f766e] font-bold"
                      />
                    </div>
                  </div>

                  <div className="bg-[#ecfdf5] border border-[#d1fae5] p-3 rounded-xl text-[11px] text-[#0f766e] flex justify-between items-center">
                    <span>
                      {language === 'ar' ? 'المتبقي أقساط للمطور: ' : 'Remaining Developer Installments: '}
                      <strong className="font-sans text-xs">{formatEGP(remaining)}</strong>
                    </span>
                    <span className="font-bold">
                      {language === 'ar' ? 'المشتري يتكفل به' : 'Assumed by Buyer'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'قيمة القسط الدوري (ج.م):' : 'Installment Value (EGP):'}
                      </label>
                      <input
                        type="number"
                        value={installmentValue}
                        onChange={(e) => setInstallmentValue(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'موعد القسط القادم:' : 'Next Installment Date:'}
                      </label>
                      <input
                        type="date"
                        value={nextInstallmentDate}
                        onChange={(e) => setNextInstallmentDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                      <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{language === 'ar' ? 'المتابعة لبيانات التواصل' : 'Proceed to Contact Details'}</span>
                      {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-3.5">
                  <h4 className="font-bold text-sm text-[#0f172a]">
                    {language === 'ar' ? 'بيانات التواصل والسرية:' : 'Contact Information & Confidentiality:'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'اسم المالك (كما بالعقد):' : 'Owner Name (as in contract):'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'ar' ? 'الاسم الثلاثي...' : 'Full Legal Name...'}
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'رقم الموبايل (واتساب):' : 'Mobile / WhatsApp:'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="010XXXXXXXX"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-[#e5e7eb] rounded-lg"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Upload */}
                  <div className="border border-dashed border-[#cbd2d9] rounded-xl p-3.5 text-center bg-slate-50">
                    <FileUp className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-700 block">
                      {language === 'ar' 
                        ? 'صورة العقد أو إيصال السداد (اختياري للتوثيق الفوري)' 
                        : 'Contract copy or payment receipt (optional for instant audit)'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="contract-upload"
                    />
                    <label
                      htmlFor="contract-upload"
                      className="inline-block mt-2 px-3 py-1 bg-white border border-[#e5e7eb] rounded-md text-[11px] font-bold text-slate-700 cursor-pointer hover:bg-slate-50"
                    >
                      {uploadedFile ? (language === 'ar' ? `تم الاختيار: ${uploadedFile.name}` : `Selected: ${uploadedFile.name}`) : (language === 'ar' ? 'اختر ملف' : 'Choose File')}
                    </label>
                  </div>

                  <div className="p-2.5 bg-slate-100 rounded-lg text-[10px] text-slate-600 flex items-start gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#0f766e] shrink-0 mt-0.5" />
                    <span>
                      {language === 'ar' 
                        ? 'بياناتك ورقم وحدتك لا تظهر في أي إعلان علني، ولا نتقاضى أي مصاريف أو عمولات من البائع.'
                        : 'Your personal information and unit number remain strictly private and are never publicly displayed. Zero seller commission.'}
                    </span>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                      <span>{language === 'ar' ? 'السابق' : 'Back'}</span>
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{language === 'ar' ? 'تأكيد طلب التنازل' : 'Confirm Listing Request'}</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
