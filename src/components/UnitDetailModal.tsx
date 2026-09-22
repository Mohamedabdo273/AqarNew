import React, { useState } from 'react';
import { 
  X, 
  Building, 
  MapPin, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  MessageSquare, 
  Layers,
  Heart
} from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useUnits } from '../context/UnitsContext';
import { useLanguage } from '../context/LanguageContext';

interface UnitDetailModalProps {
  unit: RealEstateUnit | null;
  onClose: () => void;
}

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({
  unit,
  onClose
}) => {
  const { toggleSaveUnit, isUnitSaved, submitInquiry } = useUnits();
  const { language, t, isRTL } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!unit) return null;

  const saved = isUnitSaved(unit.id);
  const savings = unit.buyerGain ?? 0;

  const formatEGP = (num: number) => {
    return (
      new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
        maximumFractionDigits: 0
      }).format(num) + (language === 'ar' ? ' ج.م' : ' EGP')
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry({
      unitId: unit.id,
      clientName,
      clientPhone
    });
    setSubmitted(true);
  };

  const displayTitle = language === 'en' && unit.titleEn ? unit.titleEn : unit.title;
  const displayDeveloper = language === 'en' && unit.developerEn ? unit.developerEn : unit.developer;
  const displayCompound = language === 'en' && unit.compoundEn ? unit.compoundEn : unit.compound;
  const displayLocation = language === 'en' && unit.locationEn ? unit.locationEn : unit.location;
  const displayFinishing = language === 'en' && unit.finishingEn ? unit.finishingEn : unit.finishing;
  const displayDelivery = language === 'en' && unit.deliveryStatusEn ? unit.deliveryStatusEn : unit.deliveryStatus;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-[#e5e7eb] relative flex flex-col max-h-[92vh]"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f5f6f8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]"></span>
            <span className="text-xs font-bold text-[#0f172a]">
              {language === 'ar' ? (
                <>فرصة موثقة بكشف حساب رسمي • كود: <span className="text-[#0f766e] font-mono">{unit.verificationCode}</span></>
              ) : (
                <>Verified Listing with Audited Statement • Code: <span className="text-[#0f766e] font-mono">{unit.verificationCode}</span></>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveUnit(unit.id)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
                saved 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
              title={saved ? (language === 'ar' ? 'محفوظة في المفضلة' : 'Saved to Favorites') : (language === 'ar' ? 'حفظ في المفضلة' : 'Save to Favorites')}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">
                {saved ? (language === 'ar' ? 'محفوظة' : 'Saved') : (language === 'ar' ? 'حفظ' : 'Save')}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 text-[#0f172a]">
          
          {/* Title & Compound */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#ecfdf5] text-[#0f766e] font-bold text-xs border border-[#d1fae5]">
                {t('noOverpriceBadge')}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                {language === 'ar' ? `وفر ${formatEGP(savings)}` : `Save ${formatEGP(savings)}`}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-xs">
                {language === 'ar' ? `سعر تعاقد ${unit.contractYear}` : `${unit.contractYear} Contract Price`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a]">
              {displayTitle}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="font-semibold text-[#0f172a]">
                {displayDeveloper} — {displayCompound}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {displayLocation}
              </span>
            </div>
          </div>

          {/* Photo Showcase */}
          <div className="space-y-2">
            <div className="relative h-60 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-100">
              <img
                src={unit.images[selectedImageIndex] || unit.images[0]}
                alt={displayTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className={`absolute bottom-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'} bg-[#0f172a]/80 backdrop-blur-xs px-2.5 py-1 rounded text-white text-[11px]`}>
                {selectedImageIndex + 1} / {unit.images.length}
              </div>
            </div>

            {unit.images.length > 1 && (
              <div className="flex gap-2">
                {unit.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-[#0f766e]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-[#0f172a] text-white rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3.5">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#2dd4bf]" />
                <h3 className="font-bold text-sm text-white">
                  {language === 'ar' ? 'الحسابات المالية (سعر التعاقد القديم بدون أوفر)' : 'Financial Breakdown (Grandfathered Contract • 0% Overprice)'}
                </h3>
              </div>
              <span className="text-[11px] text-[#2dd4bf] font-bold bg-[#0f766e]/30 px-2 py-0.5 rounded">
                {language === 'ar' ? '1.25% عمولة للمشتري بس' : '1.25% Buyer Fee Only'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-[11px] text-slate-300 block mb-1">
                  {language === 'ar' ? 'المدفوع كاش للبائع:' : 'Cash Paid to Seller:'}
                </span>
                <div className="text-xl font-black text-[#2dd4bf] font-sans">
                  {formatEGP(unit.paidCashAmount)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {language === 'ar' ? 'اللي اتدفع فعلاً للمطور' : 'Actual amount paid to developer'}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-[11px] text-slate-300 block mb-1">
                  {language === 'ar' ? 'المتبقي أقساط للمطور:' : 'Remaining Installments:'}
                </span>
                <div className="text-xl font-black text-white font-sans">
                  {formatEGP(unit.remainingAmount)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {language === 'ar' ? `على ${unit.installmentPeriodYears} سنين` : `Over ${unit.installmentPeriodYears} years`}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-[11px] text-slate-300 block mb-1">
                  {language === 'ar' ? 'قيمة القسط:' : 'Installment Value:'}
                </span>
                <div className="text-xl font-black text-amber-300 font-sans">
                  {formatEGP(unit.installmentValue)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {unit.installmentFrequency} • {language === 'ar' ? 'القادم:' : 'Next:'} {unit.nextInstallmentDate}
                </span>
              </div>
            </div>

            <div className="bg-[#0f766e]/20 border border-[#0f766e]/40 p-2.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-300">
                {language === 'ar' ? 'سعر نفس الوحدة اليوم عند المطور: ' : 'Current developer price today: '}
                <span className="line-through font-sans">{formatEGP(unit.currentMarketPrice)}</span>
              </span>
              <span className="font-bold text-[#2dd4bf]">
                {language === 'ar' ? `أنت توفر ${formatEGP(savings)}` : `You Save ${formatEGP(savings)}`}
              </span>
            </div>
          </div>

          {/* Unit Specs */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs text-slate-700">
              {language === 'ar' ? 'مواصفات الوحدة والتسليم:' : 'Unit Specifications & Delivery:'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-[#f5f6f8] p-2.5 rounded-lg border border-[#e5e7eb]">
                <span className="text-slate-500 block text-[11px]">{t('unitArea')}:</span>
                <strong className="text-[#0f172a]">{unit.areaM2} {t('sqm')}</strong>
              </div>
              <div className="bg-[#f5f6f8] p-2.5 rounded-lg border border-[#e5e7eb]">
                <span className="text-slate-500 block text-[11px]">
                  {language === 'ar' ? 'التقسيم:' : 'Layout:'}
                </span>
                <strong className="text-[#0f172a]">
                  {unit.bedrooms} {language === 'ar' ? 'نوم' : 'Beds'} • {unit.bathrooms} {language === 'ar' ? 'حمام' : 'Baths'}
                </strong>
              </div>
              <div className="bg-[#f5f6f8] p-2.5 rounded-lg border border-[#e5e7eb]">
                <span className="text-slate-500 block text-[11px]">
                  {language === 'ar' ? 'التشطيب:' : 'Finishing:'}
                </span>
                <strong className="text-[#0f172a]">{displayFinishing}</strong>
              </div>
              <div className="bg-[#f5f6f8] p-2.5 rounded-lg border border-[#e5e7eb]">
                <span className="text-slate-500 block text-[11px]">
                  {language === 'ar' ? 'التسليم:' : 'Delivery:'}
                </span>
                <strong className="text-[#0f172a]">{displayDelivery}</strong>
              </div>
            </div>
          </div>

          {/* Transfer Procedure Note */}
          <div className="bg-emerald-50/60 border border-[#d1fae5] p-3.5 rounded-xl space-y-1 text-xs text-emerald-950">
            <div className="font-bold flex items-center gap-1.5 text-[#0f766e]">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {language === 'ar' 
                  ? `إجراء التنازل الرسمي بمقر ${displayDeveloper}:` 
                  : `Official Transfer at ${displayDeveloper} HQ:`}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'يتم سداد كاش البائع بشيك مصرفي موثق، وتستلم شركة التطوير الشيكات الجديدة باسمك وتصدر ملحق التنازل الرسمي وإلغاء شيكات المالك القديم.'
                : 'The seller is paid via certified cashier\'s check. The developer issues replacement checks in your name, generates official contract transfer addenda, and discharges previous liabilities.'}
            </p>
          </div>

          {/* Form */}
          <div className="bg-[#f5f6f8] p-4 rounded-xl border border-[#e5e7eb]">
            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-[#0f766e] mx-auto" />
                <h4 className="text-sm font-bold text-[#0f172a]">
                  {language === 'ar' ? 'تم تسجيل طلبك بنجاح!' : 'Inquiry Submitted Successfully!'}
                </h4>
                <p className="text-xs text-slate-600">
                  {language === 'ar'
                    ? 'سيتواصل معك مستشار التنازلات لمطابقة أوراق الوحدة وتحديد موعد الفحص.'
                    : 'A senior transfer advisor will reach out to verify paperwork and schedule an inspection.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <h4 className="font-bold text-xs text-[#0f172a]">
                  {language === 'ar' ? 'اطلب الاطلاع على كشف الحساب وتحديد موعد التنازل:' : 'Request Statement Verification & Transfer Appointment:'}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'الاسم بالكامل...' : 'Full Name...'}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder={language === 'ar' ? 'رقم الموبايل (واتساب)...' : 'Phone / WhatsApp Number...'}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-lg"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-3 sm:py-2.5 px-4 bg-[#0f766e] hover:bg-[#115e59] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs min-h-[44px]"
                  >
                    <span>{language === 'ar' ? 'طلب الوحدة وبدء الإجراءات' : 'Proceed with Unit & Legal Transfer'}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={`https://wa.me/201000000000?text=${encodeURIComponent(
                      language === 'ar' 
                        ? `استفسار عن وحدة: ${unit.title} - كود ${unit.verificationCode}`
                        : `Inquiry for unit: ${displayTitle} - Code ${unit.verificationCode}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 sm:py-2.5 px-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#2dd4bf]" />
                    <span>{language === 'ar' ? 'استفسار عبر واتساب' : 'WhatsApp Inquiry'}</span>
                  </a>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
