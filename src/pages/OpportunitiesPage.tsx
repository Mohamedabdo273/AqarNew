import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X, BellRing, Flame } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';
import { Budget } from '../components/BudgetFinder';
import { FilterPanel } from '../components/FilterPanel';
import { Pagination } from '../components/Pagination';
import { EMPTY_FILTERS, Filters, SortKey, applyFilters } from '../lib/unitFilters';
import { DELIVERY_OPTIONS, FINISHING_OPTIONS, FREQUENCY_OPTIONS, PROPERTY_TYPES, REGIONS, isDeal, money, pick } from '../lib/unitHelpers';

interface OpportunitiesPageProps {
  units: RealEstateUnit[];
  budget: Budget;
  onBudgetChange: (b: Budget) => void;
  budgetOn: boolean;
  onBudgetOnChange: (on: boolean) => void;
  onSelectUnit: (unit: RealEstateUnit) => void;
  /** Open with the "deals only" filter on (from the home page deals section). */
  dealsOnly?: boolean;
  /** Filters and sort to open with (from the home page search and chips). */
  preset?: { filters?: Partial<Filters>; sort?: SortKey } | null;
  /** Called when a buyer asks to be told about new matching units. */
  onAlertRequested: () => void;
}

const PAGE_SIZE = 12;

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({
  units,
  budget,
  onBudgetChange,
  budgetOn,
  onBudgetOnChange,
  onSelectUnit,
  dealsOnly = false,
  preset = null,
  onAlertRequested,
}) => {
  const { language, tx, isRTL } = useLanguage();
  const [filters, setFilters] = useState<Filters>(() => ({ ...EMPTY_FILTERS, discounted: dealsOnly, ...preset?.filters }));
  const [alertPhone, setAlertPhone] = useState('');
  const [alertTried, setAlertTried] = useState(false);
  const dealsCount = useMemo(() => units.filter(isDeal).length, [units]);
  const [sort, setSort] = useState<SortKey>(preset?.sort ?? 'newest');
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const resultsTop = useRef<HTMLDivElement>(null);

  const patch = (p: Partial<Filters>) => setFilters((f) => ({ ...f, ...p }));

  // With "below what was paid" on and no other sort picked, biggest discount comes first.
  const effectiveSort: SortKey = filters.discounted && sort === 'newest' ? 'deals' : sort;
  const results = useMemo(
    () => applyFilters(units, filters, budgetOn ? budget : null, effectiveSort),
    [units, filters, budgetOn, budget, effectiveSort]
  );

  useEffect(() => setPage(1), [filters, budgetOn, budget, sort]);

  useEffect(() => {
    if (!sheetOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    resultsTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const labelOf = (list: { ar: string; en: string }[], v: string) => {
    const o = list.find((x) => x.ar === v);
    return o ? (language === 'ar' ? o.ar : o.en) : v;
  };
  const without = (list: string[], v: string) => list.filter((x) => x !== v);

  // Every active filter as a removable pill above the results.
  const pills: { key: string; label: string; remove: () => void }[] = [
    ...(budgetOn
      ? [{ key: 'budget', label: tx(`كاش ≤ ${money(budget.cash, language)} · قسط ≤ ${money(budget.monthly, language)}`, `Cash ≤ ${money(budget.cash, language)} · Monthly ≤ ${money(budget.monthly, language)}`), remove: () => onBudgetOnChange(false) }]
      : []),
    ...filters.regions.map((v) => ({ key: `r-${v}`, label: labelOf(REGIONS, v), remove: () => patch({ regions: without(filters.regions, v) }) })),
    ...filters.types.map((v) => ({ key: `t-${v}`, label: labelOf(PROPERTY_TYPES, v), remove: () => patch({ types: without(filters.types, v) }) })),
    ...filters.developers.map((v) => {
      const u = units.find((x) => x.developer === v);
      return { key: `d-${v}`, label: u ? pick(language, u.developer, u.developerEn) : v, remove: () => patch({ developers: without(filters.developers, v) }) };
    }),
    ...(filters.bedrooms !== null
      ? [{ key: 'beds', label: tx(`${filters.bedrooms === 5 ? '5+' : filters.bedrooms} غرف`, `${filters.bedrooms === 5 ? '5+' : filters.bedrooms} beds`), remove: () => patch({ bedrooms: null }) }]
      : []),
    ...(filters.areaMin || filters.areaMax
      ? [{ key: 'area', label: `${filters.areaMin || 0}–${filters.areaMax || '∞'} ${tx('م²', 'm²')}`, remove: () => patch({ areaMin: 0, areaMax: 0 }) }]
      : []),
    ...(filters.priceMin || filters.priceMax
      ? [{ key: 'price', label: `${money(filters.priceMin, language)}–${filters.priceMax ? money(filters.priceMax, language) : '∞'}`, remove: () => patch({ priceMin: 0, priceMax: 0 }) }]
      : []),
    ...filters.delivery.map((v) => ({ key: `dl-${v}`, label: labelOf(DELIVERY_OPTIONS, v), remove: () => patch({ delivery: without(filters.delivery, v) }) })),
    ...filters.finishing.map((v) => ({ key: `f-${v}`, label: labelOf(FINISHING_OPTIONS, v), remove: () => patch({ finishing: without(filters.finishing, v) }) })),
    ...filters.frequency.map((v) => ({ key: `q-${v}`, label: labelOf(FREQUENCY_OPTIONS, v), remove: () => patch({ frequency: without(filters.frequency, v) }) })),
    ...(filters.discounted ? [{ key: 'disc', label: tx('أقل من المدفوع', 'Below what was paid'), remove: () => patch({ discounted: false }) }] : []),
    ...(filters.negotiable ? [{ key: 'neg', label: tx('قابل للتفاوض', 'Negotiable'), remove: () => patch({ negotiable: false }) }] : []),
    ...(filters.swappable ? [{ key: 'swap', label: tx('تقبل مبادلة', 'Swap'), remove: () => patch({ swappable: false }) }] : []),
    ...(filters.noTransferFee ? [{ key: 'fee', label: tx('بدون رسوم تنازل', 'No transfer fee'), remove: () => patch({ noTransferFee: false }) }] : []),
    ...(filters.noPenalties ? [{ key: 'pen', label: tx('بدون غرامات', 'No penalties'), remove: () => patch({ noPenalties: false }) }] : []),
  ];

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    onBudgetOnChange(false);
  };

  const sorts: { key: SortKey; label: string }[] = [
    { key: 'newest', label: tx('الأحدث', 'Newest') },
    { key: 'savings', label: tx('الأكبر توفير', 'Biggest savings') },
    { key: 'cash', label: tx('الأقل كاش', 'Lowest cash') },
    { key: 'monthly', label: tx('أقل قسط', 'Lowest monthly') },
    { key: 'delivery', label: tx('الأقرب للاستلام', 'Soonest delivery') },
    { key: 'popular', label: tx('الأكثر مشاهدة', 'Most viewed') },
    { key: 'area', label: tx('الأكبر مساحة', 'Largest') },
  ];

  const panel = (
    <FilterPanel
      units={units}
      filters={filters}
      onChange={patch}
      budget={budget}
      onBudgetChange={onBudgetChange}
      budgetOn={budgetOn}
      onBudgetOnChange={onBudgetOnChange}
    />
  );

  const from = results.length ? (current - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(current * PAGE_SIZE, results.length);

  return (
    <div className="page-wrap py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('وحدات بسعر زمان', 'Units at old prices')}</h1>
      <p className="mt-2 text-muted">{tx('ادفع اللي المالك دفعه بس، وكمّل الأقساط.', 'Pay only what the owner paid, then continue the plan.')}</p>
      <a href="#sell" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline min-h-11">
        {tx('عندك وحدة ومش قادر تكمّل أقساطها؟ بيعها أو بدّلها', "Own a unit and can't keep up? Sell or swap it")}
      </a>

      {/* Search */}
      <div className="mt-8 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-muted" />
          <input
            value={filters.query}
            onChange={(e) => patch({ query: e.target.value })}
            placeholder={tx('كمبوند، مطور، منطقة أو رقم الوحدة', 'Compound, developer, area or unit code')}
            className="field ps-12"
          />
        </div>
        <button onClick={() => setSheetOpen(true)} className="btn-ghost lg:hidden shrink-0 h-13 px-4" aria-label={tx('فلترة', 'Filter')}>
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">{tx('فلترة', 'Filter')}</span>
          {pills.length > 0 && (
            <span className="num grid place-items-center min-w-5 h-5 px-1 rounded-full bg-brand text-white text-xs">{pills.length}</span>
          )}
        </button>
      </div>

      {/* Sort chips */}
      <div className="mt-4 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar">
        {dealsCount > 0 && (
          <>
            <button
              onClick={() => patch({ discounted: !filters.discounted })}
              aria-pressed={filters.discounted}
              className={`chip ${filters.discounted ? 'bg-accent border-accent text-white' : 'bg-accent-soft border-accent/30 text-accent hover:border-accent'}`}
            >
              <Flame className="w-4 h-4" />
              {tx('أقل من المدفوع', 'Below what was paid')}
              <span className="num text-xs opacity-80">{dealsCount}</span>
            </button>
            <span className="w-px shrink-0 bg-line my-1.5" aria-hidden="true" />
          </>
        )}
        {sorts.map((s) => (
          <button key={s.key} onClick={() => setSort(s.key)} aria-pressed={sort === s.key} className={sort === s.key ? 'chip-on' : 'chip-off'}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-[20rem_1fr] gap-8 items-start">
        <aside className="hidden lg:block card p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <p className="text-lg font-bold text-ink">{tx('الفلاتر', 'Filters')}</p>
            {pills.length > 0 && (
              <button onClick={clearAll} className="text-sm font-semibold text-brand hover:underline">{tx('مسح الكل', 'Clear all')}</button>
            )}
          </div>
          {panel}
        </aside>

        <div ref={resultsTop} className="scroll-mt-24 min-w-0">
          {pills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {pills.map((p) => (
                <button
                  key={p.key}
                  onClick={p.remove}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-ink ps-3.5 pe-2.5 py-1.5 text-sm font-medium hover:bg-brand/15"
                >
                  {p.label}
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
              <button onClick={clearAll} className="text-sm font-semibold text-muted hover:text-ink px-2">{tx('مسح الكل', 'Clear all')}</button>
            </div>
          )}

          <p className="mb-1 text-ink-soft">
            {results.length > 0 ? (
              <>
                {tx('عرض', 'Showing')} <span className="num font-bold text-ink">{from}–{to}</span> {tx('من', 'of')}{' '}
                <span className="num font-bold text-ink">{results.length}</span> {tx('وحدة', 'units')}
              </>
            ) : (
              <span className="num">0 {tx('وحدة', 'units')}</span>
            )}
          </p>
          <p className="mb-5 text-xs text-muted">
            {tx('التوفير محسوب على سعر المطور النهارده وقت نشر الإعلان، وهو تقديري.', "Savings are against the developer's price when the listing went up — an estimate.")}
          </p>

          {results.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                {pageItems.map((u) => (
                  <UnitCard key={u.id} unit={u} onOpen={onSelectUnit} fitsBudget={budgetOn} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination page={current} totalPages={totalPages} onChange={goToPage} />
              </div>
            </>
          ) : (
            <div className="card p-6 sm:p-10">
              <span className="grid place-items-center w-14 h-14 rounded-xl bg-brand text-white">
                <BellRing className="w-7 h-7" />
              </span>
              <p className="mt-5 font-display text-2xl font-bold text-ink">{tx('مفيش وحدة بالمواصفات دي النهارده', 'Nothing matches this search today')}</p>
              <p className="mt-2 text-ink-soft leading-relaxed max-w-xl">
                {tx(
                  'بس فيه وحدات جديدة بتنزل كل يوم. سيب رقمك ونبعتلك على واتساب أول ما تنزل وحدة زي اللي بتدوّر عليها.',
                  "New units go up every day. Leave your number and we'll WhatsApp you as soon as one like this is listed.",
                )}
              </p>
              {pills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {pills.map((p) => (
                    <span key={p.key} className="rounded-full bg-paper border border-line px-3 py-1 text-sm text-ink-soft">
                      {p.label}
                    </span>
                  ))}
                </div>
              )}
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  setAlertTried(true);
                  if (!/^01\d{9}$/.test(alertPhone.replace(/\s/g, ''))) return;
                  // TODO(api): save { phone, filters, budget } as a saved search once the backend exists.
                  onAlertRequested();
                }}
                className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl"
              >
                <label htmlFor="alert-phone" className="sr-only">
                  {tx('رقم الموبايل (واتساب)', 'Mobile (WhatsApp)')}
                </label>
                <input
                  id="alert-phone"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  inputMode="tel"
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  className={`field flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
                />
                <button type="submit" className="btn-primary min-h-13 whitespace-nowrap">
                  <BellRing className="w-5 h-5" />
                  {tx('نبّهني', 'Alert me')}
                </button>
              </form>
              {alertTried && !/^01\d{9}$/.test(alertPhone.replace(/\s/g, '')) && (
                <p className="mt-2 text-sm text-danger">{tx('رقم موبايل مصري صحيح، 11 رقم', 'A valid 11-digit Egyptian mobile')}</p>
              )}
              <button onClick={clearAll} className="mt-5 text-sm font-semibold text-ink-soft hover:text-ink underline min-h-11">
                {tx('أو امسح الفلاتر وشوف كل الوحدات', 'Or clear filters and see everything')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] flex flex-col rounded-t-[28px] bg-surface">
            <div className="flex items-center justify-between p-5 border-b border-line">
              <p className="text-xl font-bold text-ink">{tx('الفلاتر', 'Filters')}</p>
              <div className="flex items-center gap-2">
                {pills.length > 0 && (
                  <button onClick={clearAll} className="text-sm font-semibold text-brand px-2">{tx('مسح الكل', 'Clear all')}</button>
                )}
                <button onClick={() => setSheetOpen(false)} aria-label={tx('إغلاق', 'Close')} className="grid place-items-center w-11 h-11 rounded-full bg-paper">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-5">{panel}</div>
            <div className="p-4 border-t border-line pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button onClick={() => setSheetOpen(false)} className="btn-primary w-full min-h-13">
                {tx(`اعرض ${results.length} وحدة`, `Show ${results.length} units`)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
