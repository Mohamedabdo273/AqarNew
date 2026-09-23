import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  CheckCircle2, 
  Coins, 
  Calendar, 
  Maximize2, 
  ShieldCheck, 
  ArrowLeft, 
  Heart,
  TrendingDown,
  Eye,
  PlusCircle,
  Tag,
  Bookmark
} from 'lucide-react';
import { RealEstateUnit, BrandSuggestion, PageId } from '../types';
import { useUnits } from '../context/UnitsContext';
import { useLanguage } from '../context/LanguageContext';

interface OpportunitiesPageProps {
  units: RealEstateUnit[];
  currentBrand: BrandSuggestion;
  onSelectUnit: (unit: RealEstateUnit) => void;
  onOpenAddUnit: () => void;
  onNavigate: (page: PageId) => void;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({
  units,
  currentBrand,
  onSelectUnit,
  onOpenAddUnit,
  onNavigate
}) => {
  const { toggleSaveUnit, isUnitSaved, savedUnitIds } = useUnits();
  const { language, t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDelivery, setSelectedDelivery] = useState('ALL');
  const [maxCash, setMaxCash] = useState<number>(10000000);
  const [sortBy, setSortBy] = useState<'savings' | 'cashLow' | 'area' | 'newest'>('savings');
  const [onlySaved, setOnlySaved] = useState(false);

  const filteredUnits = useMemo(() => {
    return units
      .filter((u) => {
        // Saved only
        if (onlySaved && !savedUnitIds.includes(u.id)) return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (u.title || '').toLowerCase().includes(q) || (u.titleEn || '').toLowerCase().includes(q);
          const matchCompound = (u.compound || '').toLowerCase().includes(q) || (u.compoundEn || '').toLowerCase().includes(q);
          const matchDev = (u.developer || '').toLowerCase().includes(q) || (u.developerEn || '').toLowerCase().includes(q);
          const matchLoc = (u.location || '').toLowerCase().includes(q) || (u.locationEn || '').toLowerCase().includes(q);
          if (!matchTitle && !matchCompound && !matchDev && !matchLoc) return false;
        }

        // Region
        if (selectedRegion !== 'ALL') {
          if (u.region !== selectedRegion && u.regionEn !== selectedRegion) return false;
        }

        // Type
        if (selectedType !== 'ALL') {
          if (u.propertyType !== selectedType && u.propertyTypeEn !== selectedType) return false;
        }

        // Delivery
        if (selectedDelivery !== 'ALL') {
          if (u.deliveryStatus !== selectedDelivery && u.deliveryStatusEn !== selectedDelivery) return false;
        }

        // Cash Max
        if (u.paidCashAmount > maxCash) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'savings') {
          const savingsA = a.currentMarketPrice - a.originalContractPrice;
          const savingsB = b.currentMarketPrice - b.originalContractPrice;
          return savingsB - savingsA;
        }
        if (sortBy === 'cashLow') {
          return a.paidCashAmount - b.paidCashAmount;
        }
        if (sortBy === 'area') {
          return b.areaM2 - a.areaM2;
        }
        return b.originalContractPrice - a.originalContractPrice;
      });
  }, [units, searchQuery, selectedRegion, selectedType, selectedDelivery, maxCash, sortBy, onlySaved, savedUnitIds]);

  const formatEGP = (num: number) => {
    return num.toLocaleString() + ' ' + t('egp');
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-[#f5f6f8] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6 sm:pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'سوق الفرص الموثقة · 0% أوفر برايس' : 'Verified Assignment Market · 0% Overprice'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'ar' ? 'الفرص العقارية المتاحة للتنازل' : 'Verified Assignment Opportunities'}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {language === 'ar' 
                ? 'اشتري وحدتك بسعر التعاقد القديم وكمل أقساطها بدون فوائد جديدة ولا جنيه أوفر.'
                : 'Acquire properties at legacy contract prices and assume remaining installments without new interest or overprice.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAddUnit}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'ar' ? 'اعرض وحدتك للتنازل' : 'List Your Unit for Assignment'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-4 sm:p-5 shadow-xs space-y-4">
          
          {/* Top Row: Search & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 relative">
              <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3' : 'left-3'} top-3`} />
              <input
                type="text"
                placeholder={language === 'ar' ? 'ابحث بالكمبوند، المطور، أو المنطقة (مثل: بادية، سوديك، التجمع، مراسي)...' : 'Search by compound, developer, or location (e.g. Badya, SODIC, New Cairo, Marassi)...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 bg-slate-50 border border-[#cbd2d9] rounded-xl text-xs focus:bg-white transition-all`}
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2 text-xs">
              <span className="text-slate-500 shrink-0 font-medium">{language === 'ar' ? 'ترتيب:' : 'Sort:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-[#cbd2d9] rounded-xl font-bold text-slate-800 cursor-pointer text-xs"
              >
                <option value="savings">{language === 'ar' ? 'الأعلى توفيراً عن أسعار اليوم' : 'Highest Savings vs Current Market'}</option>
                <option value="cashLow">{language === 'ar' ? 'الأقل كاش مطلوب للبائع' : 'Lowest Cash Downpayment'}</option>
                <option value="area">{language === 'ar' ? 'المساحة الأكبر أولاً' : 'Largest Area First'}</option>
                <option value="newest">{language === 'ar' ? 'سعر العقد' : 'Contract Price'}</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Region, Type, Delivery, Cash Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'المنطقة:' : 'Region:'}</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
              >
                <option value="ALL">{language === 'ar' ? 'كل المناطق' : 'All Regions'}</option>
                <option value={language === 'ar' ? 'القاهرة الجديدة' : 'New Cairo'}>{language === 'ar' ? 'القاهرة الجديدة' : 'New Cairo'}</option>
                <option value={language === 'ar' ? 'الشيخ زايد وأكتوبر' : 'Sheikh Zayed & 6th of October'}>{language === 'ar' ? 'الشيخ زايد وأكتوبر' : 'Sheikh Zayed & 6th of October'}</option>
                <option value={language === 'ar' ? 'العاصمة الإدارية' : 'New Administrative Capital'}>{language === 'ar' ? 'العاصمة الإدارية' : 'New Administrative Capital'}</option>
                <option value={language === 'ar' ? 'الساحل الشمالي' : 'North Coast'}>{language === 'ar' ? 'الساحل الشمالي' : 'North Coast'}</option>
                <option value={language === 'ar' ? 'المستقبل والشروق' : 'Mostakbal & Shorouk'}>{language === 'ar' ? 'المستقبل والشروق' : 'Mostakbal & Shorouk'}</option>
                <option value={language === 'ar' ? 'البحر الأحمر' : 'Red Sea'}>{language === 'ar' ? 'البحر الأحمر' : 'Red Sea'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'نوع العقار:' : 'Property Type:'}</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
              >
                <option value="ALL">{language === 'ar' ? 'كل الأنواع' : 'All Types'}</option>
                <option value={language === 'ar' ? 'شقة' : 'Apartment'}>{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                <option value={language === 'ar' ? 'تاون هاوس' : 'Townhouse'}>{language === 'ar' ? 'تاون هاوس' : 'Townhouse'}</option>
                <option value={language === 'ar' ? 'فيلا مستقلة' : 'Standalone Villa'}>{language === 'ar' ? 'فيلا مستقلة' : 'Standalone Villa'}</option>
                <option value={language === 'ar' ? 'دوبلكس' : 'Duplex'}>{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                <option value={language === 'ar' ? 'تجاري / محل' : 'Retail Shop'}>{language === 'ar' ? 'تجاري / محل' : 'Retail Shop'}</option>
                <option value={language === 'ar' ? 'عيادة / إداري' : 'Commercial Office'}>{language === 'ar' ? 'عيادة / إداري' : 'Commercial Office'}</option>
                <option value={language === 'ar' ? 'شاليه ساحلي' : 'Coastal Chalet'}>{language === 'ar' ? 'شاليه ساحلي' : 'Coastal Chalet'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'موعد الاستلام:' : 'Handover Date:'}</label>
              <select
                value={selectedDelivery}
                onChange={(e) => setSelectedDelivery(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg"
              >
                <option value="ALL">{language === 'ar' ? 'كل المواعيد' : 'All Dates'}</option>
                <option value={language === 'ar' ? 'استلام فوري' : 'Ready to Move'}>{language === 'ar' ? 'استلام فوري' : 'Ready to Move'}</option>
                <option value={language === 'ar' ? 'استلام 2026' : 'Delivery 2026'}>{language === 'ar' ? 'استلام 2026' : 'Delivery 2026'}</option>
                <option value={language === 'ar' ? 'استلام 2027' : 'Delivery 2027'}>{language === 'ar' ? 'استلام 2027' : 'Delivery 2027'}</option>
                <option value={language === 'ar' ? 'استلام 2028' : 'Delivery 2028'}>{language === 'ar' ? 'استلام 2028' : 'Delivery 2028'}</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>{language === 'ar' ? 'أقصى كاش للبائع:' : 'Max Cash to Seller:'}</span>
                <span className="text-[#0f766e]">{formatEGP(maxCash)}</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={15000000}
                step={500000}
                value={maxCash}
                onChange={(e) => setMaxCash(Number(e.target.value))}
                className="w-full accent-[#0f766e] mt-1.5"
              />
            </div>
          </div>

          {/* Active Filter Chips & Saved Filter Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                {language === 'ar' ? 'عرض ' : 'Showing '}
                <strong className="text-[#0f172a]">{filteredUnits.length}</strong> 
                {language === 'ar' ? ' فرصة مطابقة' : ' matching opportunities'}
              </span>
              
              <button
                type="button"
                onClick={() => setOnlySaved(!onlySaved)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  onlySaved
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${onlySaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
                <span className="bg-white px-1.5 py-0.2 rounded-full text-[10px] text-slate-600 font-mono">
                  {savedUnitIds.length}
                </span>
              </button>
            </div>

            {(selectedRegion !== 'ALL' || selectedType !== 'ALL' || selectedDelivery !== 'ALL' || searchQuery || onlySaved) && (
              <button
                onClick={() => {
                  setSelectedRegion('ALL');
                  setSelectedType('ALL');
                  setSelectedDelivery('ALL');
                  setSearchQuery('');
                  setMaxCash(10000000);
                  setOnlySaved(false);
                }}
                className="text-[#0f766e] hover:underline font-bold cursor-pointer"
              >
                {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
              </button>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredUnits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#cbd2d9] p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#0f172a]">
              {language === 'ar' ? 'لا توجد وحدات مطابقة لمعايير البحث حالياً' : 'No units match your current search criteria'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'ar' 
                ? 'يمكنك تغيير فلاتر البحث أو تسجيل طلبك لنقوم بالبحث لك عن فرصة تنازل مطابقة فور توفرها.'
                : 'Adjust your search filters or submit a bespoke request so our assignments desk can notify you when matching inventory emerges.'}
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-lg bg-[#0f766e] text-white text-xs font-bold cursor-pointer"
            >
              {language === 'ar' ? 'اطلب فرصة مخصصة من فريقنا' : 'Request Custom Unit from Our Desk'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredUnits.map((unit) => {
              const savings = unit.currentMarketPrice - unit.originalContractPrice;
              const displayTitle = (language === 'en' && unit.titleEn) ? unit.titleEn : unit.title;
              const displayDev = (language === 'en' && unit.developerEn) ? unit.developerEn : unit.developer;
              const displayCompound = (language === 'en' && unit.compoundEn) ? unit.compoundEn : unit.compound;
              const displayDelivery = (language === 'en' && unit.deliveryStatusEn) ? unit.deliveryStatusEn : unit.deliveryStatus;
              const displayType = (language === 'en' && unit.propertyTypeEn) ? unit.propertyTypeEn : unit.propertyType;

              return (
                <div
                  key={unit.id}
                  onClick={() => onSelectUnit(unit)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                      <img
                        src={unit.images[0]}
                        alt={displayTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badges */}
                      <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex items-center gap-1.5`}>
                        <span className="bg-slate-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                          {t("noOverpriceBadge")}
                        </span>
                      </div>

                      <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-1.5`}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveUnit(unit.id);
                          }}
                          className={`p-1.5 rounded-full backdrop-blur-xs transition-transform active:scale-90 cursor-pointer ${
                            isUnitSaved(unit.id)
                              ? 'bg-white text-rose-500 shadow-xs'
                              : 'bg-slate-900/60 hover:bg-slate-900/80 text-white'
                          }`}
                          title={isUnitSaved(unit.id) ? (language === 'ar' ? 'محفوظة في المفضلة' : 'Saved to Favorites') : (language === 'ar' ? 'حفظ في المفضلة' : 'Save to Favorites')}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isUnitSaved(unit.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Image Info */}
                      <div className="absolute bottom-2.5 right-2.5 left-2.5 flex justify-between items-center text-white">
                        <span className="bg-slate-900/80 text-[11px] font-medium px-2 py-0.5 rounded">
                          {language === 'ar' ? `وفر ${formatEGP(savings)}` : `Save ${formatEGP(savings)}`}
                        </span>
                        <span className="text-[11px] bg-slate-900/80 px-2 py-0.5 rounded">
                          {displayDelivery}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-slate-800">{displayDev}</span>
                          <span>·</span>
                          <span>{displayCompound}</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                          {displayTitle}
                        </h3>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 py-1.5 border-y border-slate-100">
                        <span>{unit.areaM2} {t('sqm')}</span>
                        <span>·</span>
                        <span>{unit.bedrooms} {language === 'ar' ? 'غرف' : 'Beds'}</span>
                        <span>·</span>
                        <span>{unit.bathrooms} {language === 'ar' ? 'حمام' : 'Baths'}</span>
                        <span>·</span>
                        <span>{displayType}</span>
                      </div>

                      {/* Financial Breakdown Box */}
                      <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs border border-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{language === 'ar' ? 'الكاش المطلوب للبائع:' : 'Cash to Seller:'}</span>
                          <strong className="text-slate-900 font-sans font-bold text-sm">
                            {formatEGP(unit.paidCashAmount)}
                          </strong>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500">
                          <span>{language === 'ar' ? 'المتبقي للمطور أقساط:' : 'Remaining Installments:'}</span>
                          <span className="font-sans font-medium text-slate-700">{formatEGP(unit.remainingAmount)}</span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500">
                          <span>{language === 'ar' ? 'القسط الدوري:' : 'Installment:'}</span>
                          <span className="font-sans text-slate-800 font-medium">
                            {formatEGP(unit.installmentValue)} ({unit.installmentFrequency === 'ربع سنوي' ? (language === 'ar' ? 'ربع سنوي' : 'Quarterly') : unit.installmentFrequency === 'نصف سنوي' ? (language === 'ar' ? 'نصف سنوي' : 'Semi-Annual') : (language === 'ar' ? 'شهري' : 'Monthly')})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUnit(unit);
                      }}
                      className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'عرض تفاصيل الوحدة والعقد' : 'View Unit Details & Contract'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Order Box */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className={`space-y-1 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
            <h3 className="text-lg font-bold text-[#0f172a]">
              {language === 'ar' ? 'تبحث عن كمبوند أو مساحة محددة لم تجدها في الفرص؟' : 'Looking for a specific compound or unit layout?'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'سجل طلبك وسيقوم فريق التنازلات بالبحث المباشر والتواصل فور ظهور أول بائع مطابق.'
                : 'Register your target requirements and our team will match you directly when a verified exit seller lists.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-lg bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs cursor-pointer shrink-0 transition-colors"
          >
            {language === 'ar' ? 'سجل طلب وحدة مخصصة' : 'Request Tailored Match'}
          </button>
        </div>

      </div>
    </div>
  );
};
