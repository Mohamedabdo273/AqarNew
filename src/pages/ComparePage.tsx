import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  Minus,
  Plus,
  Sparkles,
  Building2,
  Eye,
  RefreshCw,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCompare, COMPARE_MAX } from '../context/CompareContext';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  isNegotiable,
  monthlyInstallment,
  pick,
  savingsAmount,
  savingsPercent,
  sellerDiscount,
  money as formatMoney,
} from '../lib/unitHelpers';

interface ComparePageProps {
  units: RealEstateUnit[];
  onSelectUnit: (unit: RealEstateUnit) => void;
  onNavigate: (page: PageId) => void;
}

const full = (n: number) => Math.round(n).toLocaleString('en-US');

type Row = {
  label: string;
  value: (u: RealEstateUnit) => React.ReactNode;
  /** Numeric value used to highlight the best unit in the row. */
  score?: (u: RealEstateUnit) => number;
  better?: 'low' | 'high';
};

export const ComparePage: React.FC<ComparePageProps> = ({ units, onSelectUnit, onNavigate }) => {
  const { language, tx, isRTL } = useLanguage();
  const { compareIds, clearCompare, setCompareList, removeFromCompare } = useCompare();
  const cur = currency(language);

  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const [replacingUnitId, setReplacingUnitId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');

  // Filter out any IDs that might no longer exist in the units array
  const list = useMemo(() => {
    return compareIds
      .map((id) => units.find((u) => u.id === id))
      .filter((u): u is RealEstateUnit => Boolean(u));
  }, [compareIds, units]);

  // Available units that are not yet in the comparison list
  const availableToAdd = useMemo(() => {
    const activeIds = new Set(list.map((u) => u.id));
    return units.filter((u) => {
      if (activeIds.has(u.id)) return false;
      if (selectedRegionFilter !== 'all' && u.region !== selectedRegionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const compoundMatch =
          u.compound.toLowerCase().includes(q) || (u.compoundEn && u.compoundEn.toLowerCase().includes(q));
        const devMatch =
          u.developer.toLowerCase().includes(q) || (u.developerEn && u.developerEn.toLowerCase().includes(q));
        const codeMatch = u.verificationCode.toLowerCase().includes(q);
        const regionMatch = u.region.toLowerCase().includes(q);
        if (!compoundMatch && !devMatch && !codeMatch && !regionMatch) return false;
      }
      return true;
    });
  }, [units, list, selectedRegionFilter, searchQuery]);

  // Distinct regions for filter
  const regions = useMemo(() => {
    const rSet = new Set(units.map((u) => u.region).filter(Boolean));
    return Array.from(rSet);
  }, [units]);

  // Add 3 smart alternatives to compare with the single current unit
  const handleAddThreeAlternatives = () => {
    if (list.length === 0) return;
    const baseUnit = list[0];
    const alts = units
      .filter((u) => u.id !== baseUnit.id)
      .sort((a, b) => {
        const aSame = a.region === baseUnit.region ? 1 : 0;
        const bSame = b.region === baseUnit.region ? 1 : 0;
        if (bSame !== aSame) return bSame - aSame;
        return Math.abs(cashPrice(a) - cashPrice(baseUnit)) - Math.abs(cashPrice(b) - cashPrice(baseUnit));
      })
      .slice(0, 3);
    setCompareList([baseUnit.id, ...alts.map((u) => u.id)]);
  };

  const handleSelectUnitFromPicker = (unitId: string) => {
    if (replacingUnitId) {
      // Replace
      const newList = list.map((u) => (u.id === replacingUnitId ? unitId : u.id));
      setCompareList(newList);
      setReplacingUnitId(null);
    } else {
      // Add
      if (list.length < COMPARE_MAX) {
        setCompareList([...list.map((u) => u.id), unitId]);
      }
    }
    setPickerModalOpen(false);
  };

  const money = (n: number) => (
    <>
      {full(n)} <span className="text-xs text-muted">{cur}</span>
    </>
  );

  const yesNo = (ok: boolean) =>
    ok ? (
      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
        <Check className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
        <span className="text-xs">{tx('نعم', 'Yes')}</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-muted">
        <Minus className="w-4 h-4 text-muted" />
        <span className="text-xs">{tx('لا', 'No')}</span>
      </span>
    );

  const rows: Row[] = [
    {
      label: tx('تدفع كاش دلوقتي', 'Cash now'),
      value: (u) => (
        <span className="text-base font-extrabold text-brand">
          {money(cashPrice(u))}
        </span>
      ),
      score: cashPrice,
      better: 'low',
    },
    {
      label: tx('قسطك الشهري تقريباً', 'Monthly installment'),
      value: (u) => money(monthlyInstallment(u)),
      score: monthlyInstallment,
      better: 'low',
    },
    {
      label: tx('باقي للمطور', 'Remaining to developer'),
      value: (u) => money(u.remainingAmount),
      score: (u) => u.remainingAmount,
      better: 'low',
    },
    {
      label: tx('سعر العقد الأصلي', 'Total contract price'),
      value: (u) => money(u.originalContractPrice),
      score: (u) => u.originalContractPrice,
      better: 'low',
    },
    {
      label: tx('سعر المتر المربع', 'Price per m²'),
      value: (u) => (
        <span>
          {full(Math.round(u.originalContractPrice / (u.areaM2 || 1)))}{' '}
          <span className="text-xs text-muted">{cur}</span>
        </span>
      ),
      score: (u) => Math.round(u.originalContractPrice / (u.areaM2 || 1)),
      better: 'low',
    },
    {
      label: tx('توفيرك عن سعر المطور', 'Saving vs developer'),
      value: (u) => (
        <span className="text-emerald-700 font-bold">
          {money(savingsAmount(u))} <span className="text-xs">· {savingsPercent(u)}%</span>
        </span>
      ),
      score: savingsAmount,
      better: 'high',
    },
    {
      label: tx('خصم إضافي من المالك', 'Owner discount'),
      value: (u) => (isDeal(u) ? <span className="text-brand font-bold">{money(sellerDiscount(u))}</span> : <Minus className="w-5 h-5 text-muted" />),
    },
    {
      label: tx('قابل للتفاوض', 'Negotiable'),
      value: (u) => yesNo(isNegotiable(u)),
    },
    {
      label: tx('المساحة', 'Area'),
      value: (u) => `${u.areaM2} ${tx('م²', 'm²')}`,
      score: (u) => u.areaM2,
      better: 'high',
    },
    {
      label: tx('الغرف · الحمامات', 'Beds · baths'),
      value: (u) => `${u.bedrooms || '—'} ${tx('غرف', 'beds')} · ${u.bathrooms || '—'} ${tx('حمام', 'baths')}`,
    },
    {
      label: tx('موعد الاستلام', 'Delivery'),
      value: (u) => <span className="font-bold">{deliveryLabel(u, language)}</span>,
    },
    {
      label: tx('مستوى التشطيب', 'Finishing'),
      value: (u) => pick(language, u.finishing, u.finishingEn),
    },
    {
      label: tx('العقد متراجع وكشف الحساب', 'Contract & ledger verified'),
      value: (u) => yesNo(Boolean(u.verifiedContract)),
    },
    {
      label: tx('من غير غرامات تأخير', 'No late penalties'),
      value: (u) => yesNo(!u.hasLatePenalties),
    },
    {
      label: tx('رسوم تنازل المطور', 'Transfer fee policy'),
      value: (u) => (
        <span className="font-semibold">
          {pick(language, u.transferFeePolicy, u.transferFeePolicyEn)}
        </span>
      ),
    },
    {
      label: tx('وديعة الصيانة', 'Maintenance fee'),
      value: (u) =>
        u.maintenanceFee ? (
          money(u.maintenanceFee)
        ) : (
          <span className="text-xs text-muted">{tx('مشمولة بالعقد', 'Included')}</span>
        ),
    },
  ];

  const bestOf = (r: Row) => {
    if (!r.score || list.length < 2) return null;
    const vals = list.map(r.score);
    const target = r.better === 'low' ? Math.min(...vals) : Math.max(...vals);
    return vals.filter((v) => v === target).length === 1 ? list[vals.indexOf(target)].id : null;
  };

  // If compare list is empty, show clean empty state informing user to add units
  if (list.length === 0) {
    return (
      <div className="page-wrap py-16 sm:py-24 max-w-xl text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand/10 text-brand flex items-center justify-center mx-auto shadow-sm">
          <Scale className="w-10 h-10" />
        </div>
        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-ink">
          {tx('قائمة المقارنة فارغة', 'Your compare list is empty')}
        </h1>
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          {tx(
            'تظهر هنا الوحدات التي تضيفها أنت بنفسك للمقارنة. اضغط على أيقونة (قارن) على أي وحدة لإضافتها ومقارنتها جنباً إلى جنب (حتى 4 وحدات)، أو استكشف مقارنات السوق الجاهزة في صفحتها المستقلة.',
            'Only units you explicitly choose to compare will appear here. Tap "Compare" on any unit to compare up to 4 units side by side, or explore curated market comparisons.'
          )}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('opportunities')}
            className="btn-primary w-full sm:w-auto min-h-12 px-6 shadow-sm"
          >
            <Search className="w-5 h-5" />
            <span>{tx('تصفّح الوحدات لإضافتها', 'Browse units to compare')}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('market-comparisons')}
            className="btn-ghost w-full sm:w-auto min-h-12 px-6"
          >
            <Sparkles className="w-4 h-4 text-brand" />
            <span>{tx('استكشف مقارنات السوق الجاهزة', 'Explore Market Comparisons')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-ink">
                {tx('مقارنة وحداتك المختارة', 'My Unit Comparison')}
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft mt-1">
                {tx(
                  `مقارنة الوحدات التي اخترتها بنفسك وجهاً لوجه حتى 4 وحدات (الأفضل في كل معيار متعلّم بالأخضر).`,
                  'Side-by-side comparison of your selected units (up to 4 units).'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {list.length < COMPARE_MAX && (
            <button
              type="button"
              onClick={() => {
                setReplacingUnitId(null);
                setPickerModalOpen(true);
              }}
              className="btn-primary min-h-10 text-xs sm:text-sm px-4 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{tx('أضف وحدة للمقارنة', 'Add Unit to Compare')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={clearCompare}
            className="btn-ghost min-h-10 text-xs sm:text-sm px-3"
          >
            {tx('امسح الكل', 'Clear all')}
          </button>
        </div>
      </div>

      {/* Helper notice if only 1 unit is in comparison */}
      {list.length === 1 && (
        <div className="mt-4 p-4 rounded-2xl bg-brand/5 border border-brand/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">
                {tx('لديك وحدة واحدة فقط في المقارنة حالياً', 'You currently have 1 unit in compare')}
              </p>
              <p className="text-xs text-ink-soft">
                {tx('يمكنك مقارنتها فوراً مع 3 وحدات بديلة مشابهة لرؤية الفروق بوضوح', 'You can compare it with 3 similar units to see the differences clearly')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddThreeAlternatives}
            className="btn-primary min-h-9 text-xs px-3.5 self-start sm:self-auto shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tx('قارن مع 3 وحدات بديلة الآن', 'Compare with 3 alternatives now')}</span>
          </button>
        </div>
      )}

      {/* Main Comparison Table */}
      <div className="mt-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[55rem] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky start-0 z-20 bg-paper/95 backdrop-blur w-48 sm:w-56 p-3 text-start align-bottom border-b border-line">
                <span className="text-xs font-bold text-ink-soft uppercase tracking-wider block">
                  {tx('معايير المقارنة', 'Specifications')}
                </span>
                <span className="text-[11px] text-muted block mt-0.5">
                  ({list.length} {tx('من 4 وحدات', 'of 4 units')})
                </span>
              </th>

              {/* Render compared units */}
              {list.map((u, idx) => (
                <th key={u.id} className="p-2.5 align-top text-start font-normal min-w-[210px] w-64 border-b border-line">
                  <div className="card overflow-hidden border border-line bg-surface hover:shadow-md transition-shadow relative">
                    {/* Index badge */}
                    <div className="absolute top-2 start-2 z-10">
                      <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="relative">
                      <img src={u.images[0]} alt="" className="w-full aspect-[16/10] object-cover" />
                      <div className="absolute top-2 end-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setReplacingUnitId(u.id);
                            setPickerModalOpen(true);
                          }}
                          title={tx('استبدل الوحدة', 'Replace unit')}
                          aria-label={tx('استبدل الوحدة', 'Replace unit')}
                          className="grid place-items-center w-8 h-8 rounded-full bg-surface/95 hover:bg-surface text-ink-soft hover:text-brand shadow-sm transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(u.id)}
                          aria-label={tx('شيلها من المقارنة', 'Remove from comparison')}
                          className="grid place-items-center w-8 h-8 rounded-full bg-surface/95 hover:bg-danger hover:text-white text-ink-soft shadow-sm transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <span className="num block text-[11px] text-muted font-bold" dir="ltr">
                        {u.verificationCode}
                      </span>
                      <h3 className="font-bold text-ink text-sm sm:text-base line-clamp-1 mt-0.5">
                        {pick(language, u.compound, u.compoundEn)}
                      </h3>
                      <p className="text-xs text-ink-soft flex items-center gap-1 mt-1 truncate">
                        <Building2 className="w-3.5 h-3.5 text-muted shrink-0" />
                        <span>{pick(language, u.developer, u.developerEn)}</span>
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-line/60 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectUnit(u)}
                          className="btn-ghost min-h-8 text-xs px-2.5 w-full justify-center font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{tx('عرض التفاصيل', 'View Unit')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
              ))}

              {/* Empty placeholder slot to add up to 4 units */}
              {list.length < COMPARE_MAX && (
                <th className="p-2.5 align-top text-start font-normal min-w-[210px] w-64 border-b border-line">
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingUnitId(null);
                      setPickerModalOpen(true);
                    }}
                    className="w-full h-full min-h-[220px] rounded-2xl border-2 border-dashed border-line hover:border-brand bg-paper/60 hover:bg-brand-soft/20 transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-surface group-hover:bg-brand group-hover:text-white border border-line flex items-center justify-center text-brand transition-colors mb-3 shadow-sm">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm text-ink group-hover:text-brand block">
                      {tx('+ أضف وحدة للمقارنة', '+ Add Unit')}
                    </span>
                    <span className="text-xs text-muted mt-1 block">
                      {tx(
                        `المتبقي: ${COMPARE_MAX - list.length} وحدات للمقارنة`,
                        `${COMPARE_MAX - list.length} slots left`
                      )}
                    </span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, rowIndex) => {
              const best = bestOf(r);
              return (
                <tr key={r.label} className={rowIndex % 2 === 0 ? 'bg-surface' : 'bg-paper/40'}>
                  <th
                    scope="row"
                    className="sticky start-0 z-10 bg-inherit p-3.5 text-start font-semibold text-ink-soft border-t border-line text-xs sm:text-sm"
                  >
                    {r.label}
                  </th>

                  {list.map((u) => {
                    const isBest = best === u.id;
                    return (
                      <td
                        key={u.id}
                        className={`num p-3.5 border-t border-line text-sm font-semibold transition-colors ${
                          isBest
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold border-emerald-500/20'
                            : 'text-ink'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div>{r.value(u)}</div>
                          {isBest && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                              <Check className="w-3 h-3 text-emerald-600" />
                              {tx('الأفضل', 'Best')}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Empty cell for placeholder column */}
                  {list.length < COMPARE_MAX && (
                    <td className="p-3.5 border-t border-line bg-paper/20 text-center text-muted text-xs">
                      —
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Banner linking to market comparisons page */}
      <div className="mt-10 p-5 rounded-2xl bg-paper border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-ink">
              {tx('تريد مقارنات سوقية جاهزة ومحللة؟', 'Looking for pre-analyzed market comparisons?')}
            </h4>
            <p className="text-xs text-ink-soft mt-0.5">
              {tx('تصفح صفحة مقارنات السوق الجاهزة بين أهم الفرص والمناطق الاستثمارية', 'Explore curated market comparisons across prime areas and opportunities')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('market-comparisons')}
          className="btn-ghost min-h-10 text-xs sm:text-sm px-4 shrink-0"
        >
          <span>{tx('صفحة مقارنات السوق الجاهزة', 'Market Comparisons Page')}</span>
          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Unit Picker Modal */}
      {pickerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="card w-full max-w-2xl max-h-[85vh] flex flex-col bg-surface border border-line shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-line flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-ink">
                  {replacingUnitId
                    ? tx('استبدال الوحدة في المقارنة', 'Replace unit in comparison')
                    : tx('اختر وحدة لإضافتها للمقارنة', 'Select unit to add to comparison')}
                </h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  {tx(
                    'اختر من بين جميع الوحدات المتاحة في المنصة لتظهر مباشرة بجوار الوحدات الأخرى',
                    'Choose from available units on the platform to compare side by side'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPickerModalOpen(false);
                  setReplacingUnitId(null);
                }}
                className="grid place-items-center w-9 h-9 rounded-full bg-paper hover:bg-line text-ink-soft"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-4 bg-paper/60 border-b border-line space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-muted absolute top-1/2 -translate-y-1/2 start-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tx('ابحث بالكمبوند، المطور، المنطقة، أو كود الوحدة...', 'Search compound, developer, area, or code...')}
                  className="input ps-9 pe-4 py-2 text-sm w-full bg-surface"
                />
              </div>

              {/* Region filter pills */}
              <div className="flex flex-wrap items-center gap-1.5 max-h-20 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setSelectedRegionFilter('all')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                    selectedRegionFilter === 'all'
                      ? 'bg-brand text-white'
                      : 'bg-surface text-ink hover:bg-brand-soft border border-line'
                  }`}
                >
                  {tx('كل المناطق', 'All Regions')}
                </button>
                {regions.map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setSelectedRegionFilter(reg)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                      selectedRegionFilter === reg
                        ? 'bg-brand text-white'
                        : 'bg-surface text-ink hover:bg-brand-soft border border-line'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Unit List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
              {availableToAdd.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <p className="font-semibold text-sm">{tx('لا توجد وحدات مطابقة للبحث', 'No matching units found')}</p>
                  <p className="text-xs mt-1">{tx('جرّب تغيير كلمات البحث أو المنطقة', 'Try clearing filters or changing search keywords')}</p>
                </div>
              ) : (
                availableToAdd.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-2xl border border-line bg-surface hover:border-brand hover:shadow-sm transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.images[0]}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover border border-line shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="num text-[11px] font-bold text-muted" dir="ltr">
                            {u.verificationCode}
                          </span>
                          <span className="text-[11px] font-bold text-brand bg-brand-soft px-2 py-0.5 rounded-md">
                            {u.region}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-ink truncate mt-0.5">
                          {pick(language, u.compound, u.compoundEn)}
                        </h4>
                        <p className="text-xs text-ink-soft">
                          {u.areaM2} {tx('م²', 'm²') } · {pick(language, u.propertyType, u.propertyTypeEn)} · {pick(language, u.developer, u.developerEn)}
                        </p>
                      </div>
                    </div>

                    <div className="text-end shrink-0 flex flex-col items-end gap-1.5">
                      <div>
                        <span className="num text-sm font-extrabold text-brand block">
                          {formatMoney(cashPrice(u), language)} {cur}
                        </span>
                        <span className="text-[10px] text-muted block">{tx('كاش الآن', 'Cash now')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectUnitFromPicker(u.id)}
                        className="btn-primary min-h-8 text-xs px-3 py-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{replacingUnitId ? tx('استبدال', 'Replace') : tx('أضف', 'Add')}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-paper border-t border-line flex items-center justify-between text-xs text-muted">
              <span>
                {tx(`متاح ${availableToAdd.length} وحدة للإضافة`, `${availableToAdd.length} units available`)}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPickerModalOpen(false);
                  setReplacingUnitId(null);
                }}
                className="btn-ghost min-h-8 px-3 text-xs"
              >
                {tx('إغلاق', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
