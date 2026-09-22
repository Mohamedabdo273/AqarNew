import React, { useState } from "react";
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
  Heart,
  Repeat,
  Award,
  FileCheck2,
  Activity,
  Zap,
  Users,
  TrendingUp,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { RealEstateUnit } from "../types";
import { useUnits } from "../context/UnitsContext";
import { useLanguage } from "../context/LanguageContext";

interface UnitDetailModalProps {
  unit: RealEstateUnit | null;
  onClose: () => void;
}

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({
  unit,
  onClose,
}) => {
  const { toggleSaveUnit, isUnitSaved, submitInquiry } = useUnits();
  const { language, t, isRTL } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!unit) return null;

  const saved = isUnitSaved(unit.id);
  const savings = unit.currentMarketPrice - unit.originalContractPrice;

  const formatEGP = (num: number) => {
    return (
      new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
        maximumFractionDigits: 0,
      }).format(num) + (language === "ar" ? " ج.م" : " EGP")
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry({
      unitId: unit.id,
      clientName,
      clientPhone,
    });
    setSubmitted(true);
  };

  const displayTitle =
    language === "en" && unit.titleEn ? unit.titleEn : unit.title;
  const displayDeveloper =
    language === "en" && unit.developerEn ? unit.developerEn : unit.developer;
  const displayCompound =
    language === "en" && unit.compoundEn ? unit.compoundEn : unit.compound;
  const displayLocation =
    language === "en" && unit.locationEn ? unit.locationEn : unit.location;
  const displayFinishing =
    language === "en" && unit.finishingEn ? unit.finishingEn : unit.finishing;
  const displayDelivery =
    language === "en" && unit.deliveryStatusEn
      ? unit.deliveryStatusEn
      : unit.deliveryStatus;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-[#e5e7eb] relative flex flex-col max-h-[92vh]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f5f6f8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]"></span>
            <span className="text-xs font-bold text-[#0f172a]">
              {language === "ar" ? (
                <>
                  فرصة موثقة بكشف حساب رسمي • كود:{" "}
                  <span className="text-[#0f766e] font-mono">
                    {unit.verificationCode}
                  </span>
                </>
              ) : (
                <>
                  Verified Listing with Audited Statement • Code:{" "}
                  <span className="text-[#0f766e] font-mono">
                    {unit.verificationCode}
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveUnit(unit.id)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
                saved
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
              title={
                saved
                  ? language === "ar"
                    ? "محفوظة في المفضلة"
                    : "Saved to Favorites"
                  : language === "ar"
                    ? "حفظ في المفضلة"
                    : "Save to Favorites"
              }
            >
              <Heart
                className={`w-4 h-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`}
              />
              <span className="hidden sm:inline">
                {saved
                  ? language === "ar"
                    ? "محفوظة"
                    : "Saved"
                  : language === "ar"
                    ? "حفظ"
                    : "Save"}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label={language === "ar" ? "إغلاق" : "Close"}
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
                {t("noOverpriceBadge")}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                {language === "ar"
                  ? `وفر ${formatEGP(savings)}`
                  : `Save ${formatEGP(savings)}`}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-emerald-400 font-bold text-xs border border-emerald-600/40 flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                {language === "ar" ? "فحص قانوني معتمد 100%" : "Audited & Verified 100%"}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-xs">
                {language === "ar"
                  ? `سعر تعاقد ${unit.contractYear}`
                  : `${unit.contractYear} Contract Price`}
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

          {/* FEATURE 1: Instant Liquidity & Matching Index Dashboard Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-xl p-4 border border-teal-800/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-teal-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">
                    {language === "ar" ? "مؤشر السيولة وسرعة التخارج الفوري" : "Instant Liquidity & Matching Index"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                    {language === "ar" ? "طلب شراء نشط" : "High Demand"}
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/80 mt-0.5">
                  {language === "ar"
                    ? `يوجد حالياً ${unit.activeMatchedBuyersCount || 14} مشتري كاش مسجل يبحثون عن نفس الوحدة والكمبوند.`
                    : `${unit.activeMatchedBuyersCount || 14} verified cash buyers are currently actively seeking this layout.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{language === "ar" ? "متوسط سرعة الإغلاق:" : "Avg. Close Speed:"}</span>
                <span className="text-sm font-black text-emerald-400 font-sans">~{unit.estimatedDaysToClose || 3} {language === "ar" ? "أيام عمل" : "Business Days"}</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{language === "ar" ? "السيولة المحققة:" : "Instant Liquidity:"}</span>
                <span className="text-sm font-black text-teal-300 font-sans">100% {language === "ar" ? "كاش" : "Cash"}</span>
              </div>
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
              <div
                className={`absolute bottom-2.5 ${isRTL ? "right-2.5" : "left-2.5"} bg-[#0f172a]/80 backdrop-blur-xs px-2.5 py-1 rounded text-white text-[11px]`}
              >
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
                      selectedImageIndex === idx
                        ? "border-[#0f766e]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
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
                  {language === "ar"
                    ? "الحسابات المالية (سعر التعاقد القديم بدون أوفر)"
                    : "Financial Breakdown (Grandfathered Contract • 0% Overprice)"}
                </h3>
              </div>
              <span className="text-[11px] text-[#2dd4bf] font-bold bg-[#0f766e]/30 px-2 py-0.5 rounded">
                {language === "ar"
                  ? "1.25% عمولة للمشتري بس"
                  : "1.25% Buyer Fee Only"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-[11px] text-slate-300 block mb-1">
                  {language === "ar"
                    ? "المدفوع كاش للبائع:"
                    : "Cash Paid to Seller:"}
                </span>
                <div className="text-xl font-black text-[#2dd4bf] font-sans">
                  {formatEGP(unit.paidCashAmount)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {language === "ar"
                    ? "اللي اتدفع فعلاً للمطور"
                    : "Actual amount paid to developer"}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-[11px] text-slate-300 block mb-1">
                  {language === "ar"
                    ? "المتبقي أقساط للمطور:"
                    : "Remaining Installments:"}
                </span>
                <div className="text-xl font-black text-white font-sans">
                  {formatEGP(unit.remainingAmount)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {language === "ar"
                    ? `على ${unit.installmentPeriodYears} سنين`
                    : `Over ${unit.installmentPeriodYears} years`}
                </span>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-[11px] text-slate-300 block mb-1">
                  {language === "ar" ? "قيمة القسط:" : "Installment Value:"}
                </span>
                <div className="text-xl font-black text-amber-300 font-sans">
                  {formatEGP(unit.installmentValue)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {unit.installmentFrequency} •{" "}
                  {language === "ar" ? "القادم:" : "Next:"}{" "}
                  {unit.nextInstallmentDate}
                </span>
              </div>
            </div>

            {/* FEATURE 2: Opportunity Arbitrage Visual Comparison */}
            <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-teal-950/70 border border-teal-500/40 p-3.5 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  <span>{language === "ar" ? "مقارنة مراجحة الأسعار (Developer vs. Platform Arbitrage):" : "Opportunity Arbitrage Analysis:"}</span>
                </span>
                <span className="text-[11px] font-black text-amber-300 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded">
                  +{unit.arbitrageYieldPercent || Math.round((savings / unit.originalContractPrice) * 100)}% {language === "ar" ? "فرق سعري فوري" : "Instant Arbitrage"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-400 block mb-0.5">
                    {language === "ar" ? "سعر نفس الوحدة لدى المطور اليوم" : "Today's Developer Price"}
                  </span>
                  <div className="text-sm font-bold text-slate-300 line-through font-sans">
                    {formatEGP(unit.currentMarketPrice)}
                  </div>
                </div>

                <div className="bg-[#0f766e]/30 p-2 rounded-lg border border-[#0f766e]/60">
                  <span className="text-[10px] text-teal-300 font-bold block mb-0.5">
                    {language === "ar" ? "سعر التنازل الرسمي بالمنصة" : "Platform Grandfathered Price"}
                  </span>
                  <div className="text-base font-black text-[#2dd4bf] font-sans">
                    {formatEGP(unit.originalContractPrice)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold bg-teal-500/10 p-2 rounded-lg border border-teal-500/20 text-[#2dd4bf]">
                <span className="flex items-center gap-1 text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === "ar" ? "إجمالي المبلغ الذي يوفره المشتري فوراً:" : "Total Cash Saved by Buyer:"}</span>
                </span>
                <span className="text-amber-300 font-black font-sans text-sm">
                  {formatEGP(savings)}
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Audit Passport & Due Diligence */}
          <div className="bg-slate-900 text-white rounded-xl p-4.5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#2dd4bf]" />
                <h4 className="font-bold text-xs text-white">
                  {language === "ar" ? "وثيقة التدقيق الفني والمالي المعتمد (Due Diligence)" : "Institutional Due Diligence Audit Passport"}
                </h4>
              </div>
              <span className="text-[10px] font-black tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
                GRADE {unit.auditScore || 'AAA'} VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{language === "ar" ? "نسبة الإنجاز الإنشائي الميداني:" : "Actual Construction Progress:"}</span>
                  <span className="font-bold text-[#2dd4bf] font-sans">{unit.constructionProgress || 80}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#0f766e] to-[#2dd4bf] h-2 rounded-full transition-all"
                    style={{ width: `${unit.constructionProgress || 80}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {language === "ar" ? "تم التحقق عبر المعاينة الميدانية وصور الأقمار الصناعية" : "Verified via on-site inspection"}
                </span>
              </div>

              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{language === "ar" ? "القرار الوزاري ورخصة البناء سارية" : "Ministerial decree & permits verified"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{language === "ar" ? "كشف حساب معتمد ومطابق مع إدارة المطور" : "Audited account statement matched"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{language === "ar" ? "إلغاء التوكيلات وقصر التنازل على المقر الرسمي" : "Zero power-of-attorney risk"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 4: Smart Equity Swap Matcher (Interactive Asset Exchange) */}
          {unit.eligibleForSwap && (
            <div className="bg-gradient-to-r from-amber-50 via-teal-50 to-emerald-50 border border-amber-300/80 p-4 rounded-xl space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 flex items-center gap-1.5 text-xs">
                  <Repeat className="w-4 h-4 text-amber-600" />
                  <span>{language === "ar" ? "محرك المناقلة العقارية الذكية (Smart Equity Swap Matcher):" : "Smart Equity Swap Matcher:"}</span>
                </span>
                <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow-2xs">
                  {unit.swapPreferenceMatchPercent || 96}% {language === "ar" ? "توافق محفظة" : "Match Score"}
                </span>
              </div>

              <div className="bg-white/80 p-3 rounded-lg border border-amber-200/60 space-y-1">
                <span className="text-[11px] font-bold text-amber-900 block">
                  {language === "ar" ? "العقار المستهدف المطلوب في البدل:" : "Requested Swap Asset:"}
                </span>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  {language === "ar" 
                    ? (unit.swapTargetType || 'أصل تجاري أو إداري أو سكني أصغر بموقع حيوي')
                    : (unit.swapTargetTypeEn || unit.swapTargetType || 'Commercial, office or smaller liquid asset')}
                </p>
                <span className="text-[10px] text-slate-500 block pt-1">
                  {language === "ar"
                    ? "يتم احتساب الفروق المالية بشيك مصرفي رسمي مقبول الدفع في جلسة التنازل المعتمدة بالمقر."
                    : "Equity differences settled via certified bank cashier check during official assignment."}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>{language === "ar" ? "هل لديك عقار ترغب في مبادلته بهذه الوحدة؟" : "Have an asset to swap with this unit?"}</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("booking-form-area");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-md cursor-pointer transition-colors text-[10px]"
                >
                  {language === "ar" ? "طلب مناقلة الآن" : "Propose Swap"}
                </button>
              </div>
            </div>
          )}

          {/* Unit Specs */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs text-slate-700">
              {language === "ar"
                ? "مواصفات الوحدة والتسليم:"
                : "Unit Specifications & Delivery:"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-[#f5f6f8] p-2.5 rounded-lg border border-[#e5e7eb]">
                <span className="text-slate-500 block text-[11px]">
                  {t("unitArea")}:
                </span>
                <strong className="text-[#0f172a]">
                  {unit.areaM2} {t("sqm")}
                </strong>
              </div>
              <div className="bg-[#f5f6f8] p-2.5 rounded-lg border border-[#e5e7eb]">
                <span className="text-slate-500 block text-[11px]">
                  {language === "ar" ? "التقسيم:" : "Layout:"}
                </span>
                <strong className="text-[#0f172a]">
                  {unit.bedrooms} {language === "ar" ? "نوم" : "Beds"} •{" "}
                  {unit.bathrooms} {language === "ar" ? "حمام" : "Baths"}
                </strong>
              </div>
              <div className="bg-[#f5f6f8] p-2.5 rounded-lg border border-[#e5e7eb]">
                <span className="text-slate-500 block text-[11px]">
                  {language === "ar" ? "التشطيب:" : "Finishing:"}
                </span>
                <strong className="text-[#0f172a]">{displayFinishing}</strong>
              </div>
              <div className="bg-[#f5f6f8] p-2.5 rounded-lg border border-[#e5e7eb]">
                <span className="text-slate-500 block text-[11px]">
                  {language === "ar" ? "التسليم:" : "Delivery:"}
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
                {language === "ar"
                  ? `إجراء التنازل الرسمي بمقر ${displayDeveloper}:`
                  : `Official Transfer at ${displayDeveloper} HQ:`}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {language === "ar"
                ? "يتم سداد مستحقات البائع بموجب شيك مصرفي مقبول الدفع، وتستلم شركة التطوير الشيكات الآجلة الجديدة باسم المشتري، مع تحرير ملحق التنازل الرسمي وإلغاء أوراق الدفع الخاصة بالمالك السابق وإبراء ذمته نهائياً."
                : "The seller is paid via certified cashier's check. The developer issues replacement checks in your name, generates official contract transfer addenda, and discharges previous liabilities."}
            </p>
          </div>

          {/* Form */}
          <div id="booking-form-area" className="bg-[#f5f6f8] p-4 rounded-xl border border-[#e5e7eb]">
            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-[#0f766e] mx-auto" />
                <h4 className="text-sm font-bold text-[#0f172a]">
                  {language === "ar"
                    ? "تم تسجيل طلبك بنجاح!"
                    : "Inquiry Submitted Successfully!"}
                </h4>
                <p className="text-xs text-slate-600">
                  {language === "ar"
                    ? "سيتواصل معك المستشار المالي والقانوني لمراجعة بيان الحساب وتنسيق موعد جلسة التنازل الرسمية بمقر شركة التطوير."
                    : "A senior transfer advisor will reach out to verify paperwork and schedule an inspection."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <h4 className="font-bold text-xs text-[#0f172a]">
                  {language === "ar"
                    ? "طلب فحص كشف الحساب وتنسيق جلسة التنازل:"
                    : "Request Statement Verification & Transfer Appointment:"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={
                        language === "ar" ? "الاسم بالكامل..." : "Full Name..."
                      }
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#e5e7eb] rounded-lg"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder={
                        language === "ar"
                          ? "رقم الموبايل (واتساب)..."
                          : "Phone / WhatsApp Number..."
                      }
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
                    <span>
                      {language === "ar"
                        ? "طلب الوحدة وبدء الإجراءات"
                        : "Proceed with Unit & Legal Transfer"}
                    </span>
                    {isRTL ? (
                      <ArrowLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={`https://wa.me/201000000000?text=${encodeURIComponent(
                      language === "ar"
                        ? `استفسار عن وحدة: ${unit.title} - كود ${unit.verificationCode}`
                        : `Inquiry for unit: ${displayTitle} - Code ${unit.verificationCode}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 sm:py-2.5 px-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#2dd4bf]" />
                    <span>
                      {language === "ar"
                        ? "استفسار عبر واتساب"
                        : "WhatsApp Inquiry"}
                    </span>
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
