import React, { useState, useMemo } from "react";
import {
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  ShieldCheck,
  Coins,
  Search,
  Filter,
  Heart,
  Repeat,
  Award,
  Zap,
  Users,
  Flame,
  TrendingUp,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { RealEstateUnit, UnitFilters } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useUnits } from "../context/UnitsContext";

interface ListingsSectionProps {
  units: RealEstateUnit[];
  initialFilters?: Partial<UnitFilters>;
  onSelectUnit: (unit: RealEstateUnit) => void;
  onOpenAddUnit: () => void;
}

export const ListingsSection: React.FC<ListingsSectionProps> = ({
  units,
  initialFilters,
  onSelectUnit,
  onOpenAddUnit,
}) => {
  const { t, language, isRTL } = useLanguage();
  const { toggleSaveUnit, isUnitSaved } = useUnits();
  const [searchQuery, setSearchQuery] = useState(
    initialFilters?.searchQuery || "",
  );
  const [selectedRegion, setSelectedRegion] = useState(
    initialFilters?.region || "",
  );
  const [selectedType, setSelectedType] = useState(
    initialFilters?.propertyType || "",
  );
  const [selectedTrack, setSelectedTrack] = useState<"all" | "swap" | "instant">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"savings" | "paidCashLow" | "newest">(
    "savings",
  );

  const filteredUnits = useMemo(() => {
    return units
      .filter((unit) => {
        const titleMatch = (
          unit.titleEn && language === "en" ? unit.titleEn : unit.title
        ).toLowerCase();
        const compoundMatch = (
          unit.compoundEn && language === "en" ? unit.compoundEn : unit.compound
        ).toLowerCase();
        const developerMatch = (
          unit.developerEn && language === "en"
            ? unit.developerEn
            : unit.developer
        ).toLowerCase();
        const locationMatch = (
          unit.locationEn && language === "en" ? unit.locationEn : unit.location
        ).toLowerCase();
        const q = searchQuery.toLowerCase();

        const matchesSearch =
          searchQuery === "" ||
          titleMatch.includes(q) ||
          compoundMatch.includes(q) ||
          developerMatch.includes(q) ||
          locationMatch.includes(q) ||
          unit.title.toLowerCase().includes(q) ||
          unit.compound.toLowerCase().includes(q);

        const matchesRegion =
          selectedRegion === "" || unit.region === selectedRegion;
        const matchesType =
          selectedType === "" || unit.propertyType === selectedType;
        const matchesTrack =
          selectedTrack === "all" ||
          (selectedTrack === "swap" && unit.eligibleForSwap) ||
          (selectedTrack === "instant" && unit.instantLiquidityEligible);

        return matchesSearch && matchesRegion && matchesType && matchesTrack;
      })
      .sort((a, b) => {
        if (sortBy === "savings") {
          const savingsA = a.currentMarketPrice - a.originalContractPrice;
          const savingsB = b.currentMarketPrice - b.originalContractPrice;
          return savingsB - savingsA;
        }
        if (sortBy === "paidCashLow") {
          return a.paidCashAmount - b.paidCashAmount;
        }
        return b.contractYear - a.contractYear;
      });
  }, [units, searchQuery, selectedRegion, selectedType, sortBy, language]);

  const formatCurrency = (num: number) => {
    return num.toLocaleString() + " " + t("egp");
  };

  const quickRegions = [
    { label: language === "ar" ? "الكل" : "All", value: "" },
    {
      label: language === "ar" ? "القاهرة الجديدة" : "New Cairo",
      value: "القاهرة الجديدة",
    },
    {
      label: language === "ar" ? "الشيخ زايد و6 أكتوبر" : "Sheikh Zayed & Oct",
      value: "الشيخ زايد وأكتوبر",
    },
    {
      label: language === "ar" ? "العاصمة الإدارية" : "New Capital",
      value: "العاصمة الإدارية",
    },
    {
      label: language === "ar" ? "الساحل الشمالي" : "North Coast",
      value: "الساحل الشمالي",
    },
  ];

  return (
    <section id="listings" className="py-16 bg-[#f5f6f8] text-[#0f172a]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold mb-2 border border-[#d1fae5]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t("listingsBadge")}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              {t("listingsTitle")}{" "}
              <span className="text-[#0f766e]">{t("noOverpriceBadge")}</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {t("listingsSub")}
            </p>
          </div>

          <button
            onClick={onOpenAddUnit}
            className="self-start md:self-auto px-5 py-2.5 rounded-lg bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all"
          >
            <span>{t("sellGetCash")}</span>
            {isRTL ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Strategic Track Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-slate-200/70 p-1.5 rounded-xl border border-slate-300/70">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTrack === 'all'
                ? 'bg-[#0f172a] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <span>{language === 'ar' ? 'كافة الفرص المعتمدة' : 'All Audited Deals'}</span>
          </button>

          <button
            onClick={() => setSelectedTrack('swap')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTrack === 'swap'
                ? 'bg-[#0f766e] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مسار المناقلة والمبادلة (Swap)' : 'Property Swap Track'}</span>
          </button>

          <button
            onClick={() => setSelectedTrack('instant')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTrack === 'instant'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'شبكة السيولة الفورية (72h)' : 'Instant Liquidity (72h)'}</span>
          </button>
        </div>

        {/* Quick Region Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {quickRegions.map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedRegion(r.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRegion === r.value
                  ? "bg-[#0f172a] text-white shadow-xs"
                  : "bg-white text-slate-700 border border-[#e5e7eb] hover:bg-slate-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3.5 rounded-xl border border-[#e5e7eb] mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRTL ? "pl-3 pr-9" : "pr-3 pl-9"} py-2 text-xs bg-slate-50 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#0f766e]`}
            />
            <Search
              className={`w-4 h-4 text-slate-400 absolute ${isRTL ? "right-2.5" : "left-2.5"} top-2.5`}
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#e5e7eb] rounded-lg text-slate-700 cursor-pointer"
            >
              <option value="">{t("allPropertyTypes")}</option>
              <option value="شقة">
                {language === "ar" ? "شقة" : "Apartment"}
              </option>
              <option value="تاون هاوس">
                {language === "ar" ? "تاون هاوس" : "Townhouse"}
              </option>
              <option value="فيلا مستقلة">
                {language === "ar" ? "فيلا مستقلة" : "Standalone Villa"}
              </option>
              <option value="دوبلكس">
                {language === "ar" ? "دوبلكس" : "Duplex"}
              </option>
              <option value="تجاري / محل">
                {language === "ar" ? "تجاري / محل" : "Commercial / Retail"}
              </option>
              <option value="شاليه ساحلي">
                {language === "ar" ? "شاليه ساحلي" : "Coastal Chalet"}
              </option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#e5e7eb] rounded-lg text-slate-700 cursor-pointer"
            >
              <option value="savings">{t("sortSavings")}</option>
              <option value="paidCashLow">{t("sortPaidCash")}</option>
              <option value="newest">{t("sortNewest")}</option>
            </select>
          </div>
        </div>

        {/* Unit Cards Grid */}
        {filteredUnits.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e5e7eb] max-w-md mx-auto">
            <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#0f172a]">
              {language === "ar"
                ? "لا توجد فرص تطابق هذا الفلتر"
                : "No units matching this filter"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === "ar"
                ? "جرب تغيير المنطقة للوصول لفرص أخرى."
                : "Try adjusting the region or search term."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion("");
                setSelectedType("");
              }}
              className="mt-3 px-4 py-2 bg-[#0f766e] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              {language === "ar" ? "عرض كافة الفرص" : "Show All Opportunities"}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => {
              const savings =
                unit.currentMarketPrice - unit.originalContractPrice;
              const displayTitle =
                language === "en" && unit.titleEn ? unit.titleEn : unit.title;
              const displayCompound =
                language === "en" && unit.compoundEn
                  ? unit.compoundEn
                  : unit.compound;
              const displayDeveloper =
                language === "en" && unit.developerEn
                  ? unit.developerEn
                  : unit.developer;
              const displayLocation =
                language === "en" && unit.locationEn
                  ? unit.locationEn
                  : unit.location;
              const displayDelivery =
                language === "en" && unit.deliveryStatusEn
                  ? unit.deliveryStatusEn
                  : unit.deliveryStatus;

              return (
                <div
                  key={unit.id}
                  onClick={() => onSelectUnit(unit)}
                  className="bg-white rounded-2xl border border-[#e5e7eb] hover:border-[#0f766e] transition-all flex flex-col justify-between overflow-hidden group cursor-pointer shadow-xs hover:shadow-md"
                >
                  {/* Image Container */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={unit.images[0]}
                      alt={displayTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Zero Overprice & Track Badges */}
                    <div
                      className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} flex flex-wrap items-center gap-1.5`}
                    >
                      <span className="px-2.5 py-1 rounded-md bg-[#0f766e] text-white font-bold text-xs shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t("noOverpriceBadge")}
                      </span>

                      {/* FEATURE 3: Pre-Audited Exit Badge */}
                      <span className="px-2 py-1 rounded-md bg-slate-900/90 text-emerald-400 font-bold text-[10px] border border-emerald-500/40 shadow-sm flex items-center gap-1 backdrop-blur-xs">
                        <FileCheck2 className="w-3 h-3 text-emerald-400" />
                        <span>{language === "ar" ? "مفحوصة قانونياً 100%" : "Pre-Audited 100%"}</span>
                      </span>

                      {unit.eligibleForSwap && (
                        <span className="px-2 py-1 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] shadow-sm flex items-center gap-1">
                          <Repeat className="w-3 h-3" />
                          {language === "ar" ? "مناقلة ذكية" : "Smart Swap"}
                        </span>
                      )}

                      {unit.auditScore && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900/90 text-[#2dd4bf] font-black text-[10px] border border-[#2dd4bf]/40 flex items-center gap-0.5">
                          <Award className="w-3 h-3 text-[#2dd4bf]" />
                          {unit.auditScore}
                        </span>
                      )}
                    </div>

                    {/* Delivery Status & Heart */}
                    <div
                      className={`absolute top-3 ${isRTL ? "left-3" : "right-3"} flex items-center gap-1.5`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveUnit(unit.id);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-xs transition-transform active:scale-90 cursor-pointer ${
                          isUnitSaved(unit.id)
                            ? "bg-white text-rose-500 shadow-md"
                            : "bg-black/50 hover:bg-black/75 text-white"
                        }`}
                        title={
                          isUnitSaved(unit.id)
                            ? language === "ar"
                              ? "محفوظة في المفضلة"
                              : "Saved in favorites"
                            : language === "ar"
                              ? "حفظ في المفضلة"
                              : "Save to favorites"
                        }
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isUnitSaved(unit.id) ? "fill-rose-500 text-rose-500" : ""}`}
                        />
                      </button>

                      <span className="px-2 py-0.5 rounded-md bg-[#0f172a]/80 backdrop-blur-xs text-white text-[11px] font-medium border border-white/10">
                        {displayDelivery}
                      </span>
                    </div>

                    {/* Compound & Developer */}
                    <div className="absolute bottom-3 right-3 left-3 text-white">
                      <span className="text-[11px] text-[#2dd4bf] font-medium block">
                        {displayDeveloper}
                      </span>
                      <h3 className="text-sm font-bold truncate text-white">
                        {displayCompound}
                      </h3>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 sm:p-5 space-y-3.5 grow flex flex-col justify-between">
                    <div>
                      {/* Specs */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 pb-2.5 border-b border-slate-100">
                        <span>
                          {unit.areaM2} {t("m2")}
                        </span>
                        <span>•</span>
                        <span>
                          {unit.bedrooms} {t("bedrooms")}
                        </span>
                        <span>•</span>
                        <span>
                          {language === "ar"
                            ? unit.propertyType
                            : unit.propertyType === "شقة"
                              ? "Apartment"
                              : unit.propertyType === "تاون هاوس"
                                ? "Townhouse"
                                : unit.propertyType === "فيلا مستقلة"
                                  ? "Standalone Villa"
                                  : unit.propertyType === "دوبلكس"
                                    ? "Duplex"
                                    : unit.propertyType === "تجاري / محل"
                                      ? "Commercial"
                                      : unit.propertyType === "شاليه ساحلي"
                                        ? "Chalet"
                                        : unit.propertyType}
                        </span>
                        <span
                          className={`${isRTL ? "mr-auto" : "ml-auto"} flex items-center gap-1 text-[11px] text-slate-400`}
                        >
                          <MapPin className="w-3 h-3" />
                          {displayLocation.split("،")[0]}
                        </span>
                      </div>

                      {/* FEATURE 1: Instant Liquidity & Matching Index */}
                      <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/90 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                          <Users className="w-3.5 h-3.5 text-[#0f766e] animate-pulse" />
                          <span>
                            {language === "ar"
                              ? `مؤشر السيولة: ${unit.activeMatchedBuyersCount || 14} مشتري كاش مسجل`
                              : `Liquidity Index: ${unit.activeMatchedBuyersCount || 14} Cash Buyers`}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-[#0f766e] bg-white px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 fill-[#0f766e]" />
                          {language === "ar" ? `إغلاق ~${unit.estimatedDaysToClose || 3} أيام` : `~${unit.estimatedDaysToClose || 3}d close`}
                        </span>
                      </div>

                      {/* FEATURE 4: Smart Equity Swap Matcher */}
                      {unit.eligibleForSwap && (
                        <div className="mt-2 text-[10px] bg-amber-50/90 border border-amber-200 text-amber-950 p-2 rounded-lg space-y-1">
                          <div className="flex items-center justify-between font-bold text-amber-900">
                            <span className="flex items-center gap-1">
                              <Repeat className="w-3 h-3 text-amber-700 shrink-0" />
                              <span>{language === "ar" ? "مطابقة المناقلة الذكية (Equity Swap):" : "Smart Equity Swap Matcher:"}</span>
                            </span>
                            <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-black">
                              {unit.swapPreferenceMatchPercent || 95}% {language === "ar" ? "توافق" : "Match"}
                            </span>
                          </div>
                          <p className="text-[10px] text-amber-800 truncate">
                            {language === "ar" ? "يقبل البدل بـ: " : "Accepts swap for: "}
                            <strong className="text-slate-900">
                              {language === "ar" ? unit.swapTargetType : (unit.swapTargetTypeEn || unit.swapTargetType)}
                            </strong>
                          </p>
                        </div>
                      )}

                      {/* FEATURE 2: Opportunity Arbitrage Card */}
                      <div className="mt-3 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-3.5 rounded-xl border border-slate-800 space-y-2.5 shadow-sm">
                        
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
                          <span className="text-slate-300 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-[#2dd4bf]" />
                            {language === "ar" ? "بطاقة مراجحة السعر (Arbitrage):" : "Price Arbitrage Analysis:"}
                          </span>
                          <span className="font-black text-[#2dd4bf] bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800">
                            +{unit.arbitrageYieldPercent || Math.round((savings / unit.originalContractPrice) * 100)}% {language === "ar" ? "مكسب فوري" : "Instant Gain"}
                          </span>
                        </div>

                        {/* Side by Side Comparison: Developer vs Platform */}
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="text-[10px] text-slate-400 block mb-0.5">
                              {language === "ar" ? "سعر المطور اليوم" : "Dev Price Today"}
                            </span>
                            <span className="text-xs font-bold text-slate-300 line-through font-sans block">
                              {formatCurrency(unit.currentMarketPrice)}
                            </span>
                          </div>

                          <div className="bg-[#0f766e]/20 p-2 rounded-lg border border-[#0f766e]/50">
                            <span className="text-[10px] text-teal-300 font-bold block mb-0.5">
                              {language === "ar" ? "سعر التنازل هنا (0% أوفر)" : "Platform Price (0% Over)"}
                            </span>
                            <span className="text-xs font-black text-[#2dd4bf] font-sans block">
                              {formatCurrency(unit.originalContractPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Paid cash and installments detail */}
                        <div className="space-y-1.5 pt-1 text-xs">
                          <div className="flex items-baseline justify-between">
                            <span className="text-slate-300 text-[11px]">
                              {t("paidCashLabel")}:
                            </span>
                            <span className="text-sm font-black text-[#2dd4bf] font-sans">
                              {formatCurrency(unit.paidCashAmount)}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between text-[11px] text-slate-400">
                            <span>{t("remainingInstallments")}:</span>
                            <span className="font-semibold text-slate-200 font-sans">
                              {formatCurrency(unit.remainingAmount)} ({unit.installmentPeriodYears} {language === "ar" ? "سنين" : "yrs"})
                            </span>
                          </div>
                        </div>

                        {/* Net Savings Callout */}
                        <div className="flex items-center justify-between text-xs font-bold bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/15">
                          <span className="text-slate-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>{language === "ar" ? "صافي وفر المشتري:" : "Net Buyer Savings:"}</span>
                          </span>
                          <span className="font-sans font-black text-amber-300">
                            {formatCurrency(savings)}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUnit(unit);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0f172a] hover:bg-[#0f766e] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
                    >
                      <span>{t("viewUnitDetails")}</span>
                      {isRTL ? (
                        <ArrowLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
