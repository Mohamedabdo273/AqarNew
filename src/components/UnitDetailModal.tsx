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
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            <span className="text-xs font-bold text-slate-900">
              {language === "ar" ? (
                <>
                  فرصة موثقة بكشف حساب رسمي • كود:{" "}
                  <span className="text-teal-700 font-mono">
                    {unit.verificationCode}
                  </span>
                </>
              ) : (
                <>
                  Verified Listing with Audited Statement • Code:{" "}
                  <span className="text-teal-700 font-mono">
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
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span className="font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                {t("noOverpriceBadge")}
              </span>
              <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {language === "ar" ? `وفر ${formatEGP(savings)}` : `Save ${formatEGP(savings)}`}
              </span>
              <span className="font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                {language === "ar" ? `سعر تعاقد ${unit.contractYear}` : `${unit.contractYear} Contract`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {displayTitle}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="font-medium text-slate-700">
                {displayDeveloper} — {displayCompound}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {displayLocation}
              </span>
            </div>
          </div>

          {/* Liquidity Indicator - Clean & Understated */}
          <div className="bg-slate-50 text-slate-800 rounded-xl p-3.5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">
                  {language === "ar" ? "مؤشر السيولة وتوفر المشترين الكاش" : "Liquidity & Cash Buyers Index"}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === "ar"
                    ? `مسجل لدينا ${unit.activeMatchedBuyersCount || 14} مشتري كاش يبحثون عن نفس الوحدة والكمبوند.`
                    : `${unit.activeMatchedBuyersCount || 14} verified cash buyers matching this compound.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 self-end sm:self-center">
              <div>
                <span className="text-[10px] text-slate-400 block">{language === "ar" ? "سرعة التخارج:" : "Avg. Close:"}</span>
                <span className="font-bold text-slate-900">~{unit.estimatedDaysToClose || 3} {language === "ar" ? "أيام" : "days"}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div>
                <span className="text-[10px] text-slate-400 block">{language === "ar" ? "طريقة الاستلام:" : "Payment:"}</span>
                <span className="font-bold text-teal-800">{language === "ar" ? "شيك مصرفي معتمد" : "Cashier check"}</span>
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

          {/* Financial Breakdown Card - Clean & Eye-friendly */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-teal-400" />
                <h3 className="font-bold text-sm text-white">
                  {language === "ar"
                    ? "الحسابات المالية (سعر التعاقد القديم بدون أوفر)"
                    : "Financial Breakdown (Official Contract Price)"}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {language === "ar" ? "عمولة المشتري 1.25% فقط" : "1.25% Buyer Fee"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                <span className="text-xs text-slate-400 block mb-1">
                  {language === "ar" ? "المدفوع كاش للبائع:" : "Cash Paid to Seller:"}
                </span>
                <div className="text-lg font-bold text-white font-sans">
                  {unit.sellerWillingDiscountAmount && unit.sellerWillingDiscountAmount > 0 ? (
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-teal-400">{formatEGP(unit.paidCashAmount - unit.sellerWillingDiscountAmount)}</span>
                      <span className="text-xs text-slate-500 line-through font-normal">{formatEGP(unit.paidCashAmount)}</span>
                    </div>
                  ) : (
                    formatEGP(unit.paidCashAmount)
                  )}
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {unit.sellerWillingDiscountAmount && unit.sellerWillingDiscountAmount > 0
                    ? (language === "ar" ? "🔥 البائع تنازل بخصم للتخارج السريع" : "🔥 Seller discount applied")
                    : (language === "ar" ? "المبلغ الفعلي المدفوع للمطور" : "Actual amount paid to developer")}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                <span className="text-xs text-slate-400 block mb-1">
                  {language === "ar" ? "المتبقي أقساط للمطور:" : "Remaining Installments:"}
                </span>
                <div className="text-lg font-bold text-white font-sans">
                  {formatEGP(unit.remainingAmount)}
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {language === "ar" ? `على ${unit.installmentPeriodYears} سنين` : `Over ${unit.installmentPeriodYears} years`}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
                <span className="text-xs text-slate-400 block mb-1">
                  {language === "ar" ? "قيمة القسط والدورية:" : "Installment Value:"}
                </span>
                <div className="text-lg font-bold text-white font-sans">
                  {formatEGP(unit.installmentValue)}
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {unit.installmentFrequency} · {language === "ar" ? "القادم:" : "Next:"} {unit.nextInstallmentDate}
                </span>
              </div>
            </div>

            {/* Platform Rules Notice on Transfer Fees */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  {language === "ar" ? "رسوم التنازل لدى شركة التطوير:" : "Developer Transfer Fee:"}
                </span>
                <strong className="text-white">
                  {unit.transferFeeBearer === "معفي بالعقد" 
                    ? (language === "ar" ? "معفاة بالعقد الرسمي (0 جنيه)" : "Contract Exempt (0 EGP)")
                    : (language === "ar" ? "يتحملها المشتري بالكامل" : "Borne by Buyer")}
                </strong>
              </div>
              <span className="text-slate-400 text-[11px]">
                {language === "ar" ? "مقابل استلام الوحدة بسعر العقد القديم بدون أوفر" : "In exchange for 0% overprice"}
              </span>
            </div>

            {/* Special Conditions: Overdue Fines Deduction, Flexible Cash Terms, Tax Status */}
            {(unit.hasOverdueFinesDeducted || unit.acceptsInstallmentsForCash || unit.taxCategory) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {unit.hasOverdueFinesDeducted && (
                  <div className="bg-slate-800/50 border border-slate-700 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-rose-400 font-bold">✓</span>
                    <div>
                      <span className="font-semibold text-slate-200 block">
                        {language === "ar" ? "خصم متأخرات المطور من ثمن الوحدة:" : "Developer Arrears Deducted:"}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {unit.overdueFinesAmount 
                          ? (language === "ar" ? `مخصوم ${unit.overdueFinesAmount.toLocaleString()} ج يسددها المشتري للمطور بدلاً من البائع` : `${unit.overdueFinesAmount.toLocaleString()} EGP deducted`)
                          : (language === "ar" ? "أي متأخرات تُخصم مباشرة من الكاش" : "Deducted directly from seller cash")}
                      </span>
                    </div>
                  </div>
                )}

                {unit.acceptsInstallmentsForCash && (
                  <div className="bg-slate-800/50 border border-slate-700 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <div>
                      <span className="font-semibold text-slate-200 block">
                        {language === "ar" ? "تسهيلات في سداد الكاش:" : "Flexible Cash Terms:"}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {unit.cashInstallmentsTerms || (language === "ar" ? "يقبل البائع دفعة أولى كاش والباقي بشيك مقبول الدفع" : "Accepts cashier checks in tranches")}
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/50 border border-slate-700 p-2.5 rounded-xl flex items-center gap-2 sm:col-span-2">
                  <span className="text-slate-400 font-bold">⚖️</span>
                  <div>
                    <span className="font-semibold text-slate-200 block">
                      {language === "ar" ? "الموقف الضريبي والقانوني:" : "Tax Classification:"}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {unit.taxCategory === 'commercial_vat' 
                        ? (language === "ar" ? "تجاري (تخضع للقيمة المضافة)" : "Commercial VAT")
                        : (language === "ar" ? "سكني معفى من القيمة المضافة (كل طرف يتحمل التزامه القانوني)" : "Residential exempt from VAT")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Price Comparison - Understated */}
            <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[11px] text-slate-400 block mb-0.5">
                    {language === "ar" ? "سعر نفس الوحدة لدى المطور اليوم" : "Today's Developer Price"}
                  </span>
                  <div className="text-sm font-bold text-slate-400 line-through font-sans">
                    {formatEGP(unit.currentMarketPrice)}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-teal-700/60">
                  <span className="text-[11px] text-teal-300 font-medium block mb-0.5">
                    {language === "ar" ? "سعر التنازل الرسمي بالمنصة" : "Platform Grandfathered Price"}
                  </span>
                  <div className="text-sm font-bold text-teal-300 font-sans">
                    {formatEGP(unit.originalContractPrice)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold bg-slate-900/90 p-2.5 rounded-lg border border-slate-700 text-teal-400">
                <span className="text-slate-300">
                  {language === "ar" ? "إجمالي المبلغ الذي يوفره المشتري فوراً:" : "Total Cash Saved by Buyer:"}
                </span>
                <span className="font-bold font-sans text-sm">
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

                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === "ar" ? "طلب وعد بيع وحجز جلسة المطور أونلاين:" : "Online Reservation & Promise of Sale:"}</span>
                    </span>
                    <span className="text-[10px] font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                      {language === "ar" ? "حجز مبدئي مؤقت" : "Temporary Lock"}
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-700 leading-relaxed">
                    {language === "ar"
                      ? "يتيح لك هذا الطلب تجميد الوحدة مؤقتاً لحين مطابقة كشف الحساب بمقر المطور وإصدار الشيك المصرفي المعتمد للبائع."
                      : "Temporarily freezes this unit while developer statement verification and certified cashier check are arranged."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-3 sm:py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[44px]"
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
                    className="py-3 sm:py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
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
