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
  const [selectedTrack, setSelectedTrack] = useState<"all" | "fire_sale" | "swap" | "instant">(
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
          (selectedTrack === "fire_sale" && !!(unit.sellerWillingDiscountAmount && unit.sellerWillingDiscountAmount > 0)) ||
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
    <section id="listings" className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-200 text-slate-900">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t("listingsBadge")}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t("listingsTitle")}{" "}
              <span className="text-teal-800">{t("noOverpriceBadge")}</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {t("listingsSub")}
            </p>
          </div>

          <button
            onClick={onOpenAddUnit}
            className="self-start md:self-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>{t("sellGetCash")}</span>
            {isRTL ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Strategic Track Selector Tabs - Minimal, clean, eye-friendly */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedTrack === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'ar' ? 'كافة الفرص المعتمدة' : 'All Audited Deals'}
          </button>

          <button
            onClick={() => setSelectedTrack('fire_sale')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedTrack === 'fire_sale'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <span>🔥</span>
            <span>{language === 'ar' ? 'عروض التخارج العاجل' : 'Urgent Fire Sales'}</span>
          </button>

          <button
            onClick={() => setSelectedTrack('swap')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedTrack === 'swap'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مسار التبديل والمناقلة' : 'Swap Track'}</span>
          </button>

          <button
            onClick={() => setSelectedTrack('instant')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedTrack === 'instant'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'السيولة الفورية (72h)' : 'Instant Liquidity (72h)'}</span>
          </button>
        </div>

        {/* Quick Region Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6 text-xs">
          {quickRegions.map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedRegion(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedRegion === r.value
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-2xs">
          <div className="relative">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRTL ? "pl-3 pr-9" : "pr-3 pl-9"} py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-700`}
            />
            <Search
              className={`w-4 h-4 text-slate-400 absolute ${isRTL ? "right-2.5" : "left-2.5"} top-2.5`}
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:border-teal-700"
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
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:outline-none focus:border-teal-700"
            >
              <option value="savings">{t("sortSavings")}</option>
              <option value="paidCashLow">{t("sortPaidCash")}</option>
              <option value="newest">{t("sortNewest")}</option>
            </select>
          </div>
        </div>

        {/* Unit Cards Grid */}
        {filteredUnits.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">
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
              className="mt-3 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
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
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between overflow-hidden group cursor-pointer shadow-xs"
                >
                  {/* Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={unit.images[0]}
                      alt={displayTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                    {/* Minimal Top Indicators */}
                    <div
                      className={`absolute top-2.5 ${isRTL ? "right-2.5" : "left-2.5"} flex items-center gap-1.5`}
                    >
                      {unit.sellerWillingDiscountAmount && unit.sellerWillingDiscountAmount > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[11px]">
                          {language === "ar" ? `خصم عاجل` : `Discounted`}
                        </span>
                      ) : null}

                      <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-teal-300 font-semibold text-[11px]">
                        0% أوفر برايس
                      </span>
                    </div>

                    {/* Delivery Status & Heart */}
                    <div
                      className={`absolute top-2.5 ${isRTL ? "left-2.5" : "right-2.5"} flex items-center gap-1.5`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveUnit(unit.id);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                          isUnitSaved(unit.id)
                            ? "bg-white text-rose-500 shadow-sm"
                            : "bg-slate-900/60 hover:bg-slate-900 text-white"
                        }`}
                        title={isUnitSaved(unit.id) ? "محفوظة" : "حفظ"}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isUnitSaved(unit.id) ? "fill-rose-500 text-rose-500" : ""}`}
                        />
                      </button>

                      <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[11px]">
                        {displayDelivery}
                      </span>
                    </div>

                    {/* Compound & Developer */}
                    <div className="absolute bottom-2.5 right-3 left-3 text-white">
                      <span className="text-[11px] text-slate-300 block">
                        {displayDeveloper}
                      </span>
                      <h3 className="text-sm font-bold truncate text-white">
                        {displayCompound}
                      </h3>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3 grow flex flex-col justify-between">
                    <div>
                      {/* Specs */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100">
                        <span>{unit.areaM2} {t("m2")}</span>
                        <span>·</span>
                        <span>{unit.bedrooms} {t("bedrooms")}</span>
                        <span>·</span>
                        <span>{unit.propertyType}</span>
                        <span className={`${isRTL ? "mr-auto" : "ml-auto"} flex items-center gap-1 text-[11px] text-slate-400`}>
                          <MapPin className="w-3 h-3" />
                          {displayLocation.split("،")[0]}
                        </span>
                      </div>

                      {/* Financial Card - Clean & Eye Friendly */}
                      <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
                        
                        {/* Cash to Seller */}
                        <div className="flex items-baseline justify-between">
                          <span className="text-slate-600 font-medium">
                            {t("paidCashLabel")}:
                          </span>
                          {unit.sellerWillingDiscountAmount && unit.sellerWillingDiscountAmount > 0 ? (
                            <div className="text-right">
                              <span className="text-sm font-bold text-rose-600 font-sans">
                                {formatCurrency(unit.paidCashAmount - unit.sellerWillingDiscountAmount)}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through mr-1 inline-block">
                                {formatCurrency(unit.paidCashAmount)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-slate-900 font-sans">
                              {formatCurrency(unit.paidCashAmount)}
                            </span>
                          )}
                        </div>

                        {/* Remaining to Dev */}
                        <div className="flex items-baseline justify-between text-slate-500 text-[11px]">
                          <span>{t("remainingInstallments")}:</span>
                          <span className="font-semibold text-slate-700 font-sans">
                            {formatCurrency(unit.remainingAmount)} ({unit.installmentPeriodYears} {language === "ar" ? "سنين" : "yrs"})
                          </span>
                        </div>

                        {/* Net Savings */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70 text-xs font-semibold">
                          <span className="text-teal-800">
                            {language === "ar" ? "وفر عن سعر اليوم:" : "Buyer Savings:"}
                          </span>
                          <span className="font-sans font-bold text-teal-700">
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
                      className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-teal-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                    >
                      <span>{t("viewUnitDetails")}</span>
                      {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
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
