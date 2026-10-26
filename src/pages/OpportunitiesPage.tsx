import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X, BellRing, Flame, ArrowUpDown, ChevronDown, MapPin, Building2, Wallet, BedDouble, TrendingDown } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UnitCard } from '../components/UnitCard';
import { Budget, BudgetFinder } from '../components/BudgetFinder';
import { FilterPanel } from '../components/FilterPanel';
import { Pagination } from '../components/Pagination';
import { EMPTY_FILTERS, Filters, SortKey, applyFilters } from '../lib/unitFilters';
import {
  DELIVERY_OPTIONS,
  FINISHING_OPTIONS,
  FREQUENCY_OPTIONS,
  PROPERTY_CATEGORIES,
  PROPERTY_TYPES,
  isDeal,
  money,
  pick,
  typesFor,
} from '../lib/unitHelpers';
import { errorText, sendSearchAlert } from '../services/api';
import { useDistricts, useRegions, useSubAreas } from '../lib/places';

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

/** A filter-bar button that opens a small panel under it. Closes on an outside click or Escape. */
const QuickFilter: React.FC<{
  label: string;
  icon: React.ElementType;
  count: number;
  wide?: boolean;
  children: (close: () => void) => React.ReactNode;
}> = ({ label, icon: Icon, count, wide, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 h-11 rounded-xl border-2 px-4 text-[15px] font-bold transition-colors ${
          count > 0 ? 'bg-brand-soft border-brand text-brand-ink' : 'bg-surface border-line-strong text-ink hover:border-brand'
        }`}
      >
        <Icon className="w-4.5 h-4.5 text-brand" />
        {label}
        {count > 0 && <span className="num grid place-items-center min-w-5 h-5 px-1 rounded-full bg-brand text-white text-[11px]">{count}</span>}
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute top-full mt-2 start-0 z-30 card p-4 shadow-lift ${wide ? 'w-[24rem]' : 'w-[20rem]'}`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
};

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
  const { user, requireAuth } = useAuth();
  const [alertPhone, setAlertPhone] = useState(user?.phone ?? '');
  const [alertTried, setAlertTried] = useState(false);
  const [alertSending, setAlertSending] = useState(false);
  const [alertError, setAlertError] = useState('');
  const dealsCount = useMemo(() => units.filter(isDeal).length, [units]);
  const [sort, setSort] = useState<SortKey>(preset?.sort ?? 'newest');
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const resultsTop = useRef<HTMLDivElement>(null);

  const patch = (p: Partial<Filters>) => setFilters((f) => ({ ...f, ...p }));
  const regions = useRegions();
  const subAreas = useSubAreas(filters.regionIds);
  const districts = useDistricts(filters.subAreaIds);

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
  const withoutId = (list: number[], v: number) => list.filter((x) => x !== v);
  const placeLabelOf = (list: { id: number; ar: string; en: string }[], id: number) => {
    const o = list.find((x) => x.id === id);
    return o ? (language === 'ar' ? o.ar : o.en) : '…';
  };
  /** Keeps only the sub-areas / districts that still sit under what's picked above them. */
  const pickPlaces = (regionIds: number[], subAreaIds: number[]) => {
    const keptSubAreas = subAreaIds.filter((id) => subAreas.some((s) => s.id === id && regionIds.includes(s.regionId)));
    const keptDistricts = filters.districtIds.filter((id) => districts.some((d) => d.id === id && keptSubAreas.includes(d.subAreaId)));
    patch({ regionIds, subAreaIds: keptSubAreas, districtIds: keptDistricts });
  };

  // Every active filter as a removable pill above the results.
  const pills: { key: string; label: string; remove: () => void }[] = [
    ...(budgetOn
      ? [{ key: 'budget', label: tx(`كاش ≤ ${money(budget.cash, language)} · قسط ≤ ${money(budget.monthly, language)}`, `Cash ≤ ${money(budget.cash, language)} · Monthly ≤ ${money(budget.monthly, language)}`), remove: () => onBudgetOnChange(false) }]
      : []),
    ...filters.regionIds.map((v) => ({ key: `r-${v}`, label: placeLabelOf(regions, v), remove: () => pickPlaces(withoutId(filters.regionIds, v), filters.subAreaIds) })),
    ...filters.subAreaIds.map((v) => ({ key: `s-${v}`, label: placeLabelOf(subAreas, v), remove: () => pickPlaces(filters.regionIds, withoutId(filters.subAreaIds, v)) })),
    ...filters.districtIds.map((v) => ({ key: `ds-${v}`, label: placeLabelOf(districts, v), remove: () => patch({ districtIds: withoutId(filters.districtIds, v) }) })),
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

  const regionCount = filters.regionIds.length + filters.subAreaIds.length + filters.districtIds.length;
  const typeCount = filters.categories.length + filters.types.length;
  const toggleIn = (list: string[], v: string) => (list.includes(v) ? without(list, v) : [...list, v]);
  const bedsLabel = (n: number) => (n === 5 ? '5+' : String(n));

  return (
    <div className="page-wrap py-6 sm:py-8">
      {/* Compact header: the units are the content, not the banner. */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">{tx('وحدات للبيع', 'Units for sale')}</h1>
          <p className="mt-1 text-sm text-muted">
            {tx('ادفع اللي صاحبها دفعه بس، وكمّل الأقساط مع المطور.', 'Pay only what the owner paid, then continue the instalments with the developer.')}
          </p>
        </div>
        <a href="#sell" className="text-sm font-semibold text-brand hover:underline">
          {tx('عندك وحدة عايز تبيعها؟', 'Selling a unit?')}
        </a>
      </div>

      {/* Filter bar: search, the four questions every buyer asks, two quick toggles, and "all filters" for the rest. */}
      <div className="sticky top-24 sm:top-28 z-20 mt-5 rounded-2xl border border-line bg-surface/95 backdrop-blur-md p-3 sm:p-4 shadow-[0_8px_24px_-12px_rgba(18,18,16,0.18)]">
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-muted" />
            <input
              value={filters.query}
              onChange={(e) => patch({ query: e.target.value })}
              placeholder={tx('ابحث بكمبوند، مطور، منطقة أو كود', 'Compound, developer, area or code')}
              className="field h-12 ps-10 text-sm"
            />
          </div>
          <button onClick={() => setSheetOpen(true)} className="btn-primary shrink-0 h-12 px-4 sm:px-5 text-[15px]" aria-label={tx('فلتر', 'Filter')}>
            <SlidersHorizontal className="w-5 h-5" />
            <span>{tx('فلتر', 'Filter')}</span>
            {pills.length > 0 && <span className="num grid place-items-center min-w-5 h-5 px-1 rounded-full bg-white text-brand text-xs font-bold">{pills.length}</span>}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="hidden md:contents">
            <QuickFilter label={tx('المنطقة', 'Area')} icon={MapPin} count={regionCount}>
              {() => (
                <div className="flex flex-wrap gap-2">
                  {regions.map((r) => (
                    <button
                      key={r.id}
                      onClick={() =>
                        pickPlaces(filters.regionIds.includes(r.id) ? withoutId(filters.regionIds, r.id) : [...filters.regionIds, r.id], filters.subAreaIds)
                      }
                      aria-pressed={filters.regionIds.includes(r.id)}
                      className={filters.regionIds.includes(r.id) ? 'chip-on' : 'chip-off'}
                    >
                      {language === 'ar' ? r.ar : r.en}
                    </button>
                  ))}
                </div>
              )}
            </QuickFilter>

            <QuickFilter label={tx('نوع الوحدة', 'Type')} icon={Building2} count={typeCount}>
              {() => (
                <div className="grid gap-3">
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_CATEGORIES.map((c) => (
                      <button
                        key={c.ar}
                        onClick={() => {
                          const categories = toggleIn(filters.categories, c.ar);
                          const allowed = new Set<string>(typesFor(categories).map((t) => t.ar));
                          patch({ categories, types: filters.types.filter((t) => allowed.has(t)) });
                        }}
                        aria-pressed={filters.categories.includes(c.ar)}
                        className={filters.categories.includes(c.ar) ? 'chip-on' : 'chip-off'}
                      >
                        {language === 'ar' ? c.ar : c.en}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-line">
                    {typesFor(filters.categories).map((t) => (
                      <button
                        key={t.ar}
                        onClick={() => patch({ types: toggleIn(filters.types, t.ar) })}
                        aria-pressed={filters.types.includes(t.ar)}
                        className={filters.types.includes(t.ar) ? 'chip-on' : 'chip-off'}
                      >
                        {language === 'ar' ? t.ar : t.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </QuickFilter>

            <QuickFilter
              label={budgetOn ? tx(`كاش لحد ${money(budget.cash, language)}`, `Cash up to ${money(budget.cash, language)}`) : tx('الميزانية', 'Budget')}
              icon={Wallet}
              count={budgetOn ? 1 : 0}
              wide
            >
              {(close) => (
                <div className="grid gap-4">
                  <BudgetFinder budget={budget} onChange={onBudgetChange} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onBudgetOnChange(true);
                        close();
                      }}
                      className="btn-primary flex-1 min-h-11"
                    >
                      {tx('وريني اللي على قدي', 'Show what I can afford')}
                    </button>
                    {budgetOn && (
                      <button
                        onClick={() => {
                          onBudgetOnChange(false);
                          close();
                        }}
                        className="btn-ghost min-h-11 px-4"
                      >
                        {tx('شيل', 'Clear')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </QuickFilter>

            <QuickFilter
              label={filters.bedrooms !== null ? tx(`${bedsLabel(filters.bedrooms)} غرف`, `${bedsLabel(filters.bedrooms)} beds`) : tx('الغرف', 'Beds')}
              icon={BedDouble}
              count={filters.bedrooms !== null ? 1 : 0}
            >
              {(close) => (
                <div className="grid grid-cols-6 gap-1.5">
                  {[null, 1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={String(n)}
                      onClick={() => {
                        patch({ bedrooms: n });
                        close();
                      }}
                      aria-pressed={filters.bedrooms === n}
                      className={`h-10 rounded-lg text-sm font-semibold border ${
                        filters.bedrooms === n ? 'bg-brand text-white border-brand' : 'bg-surface border-line text-ink-soft hover:border-line-strong'
                      }`}
                    >
                      {n === null ? tx('الكل', 'Any') : bedsLabel(n)}
                    </button>
                  ))}
                </div>
              )}
            </QuickFilter>
            <span className="w-px h-6 bg-line mx-1" aria-hidden="true" />
          </div>

          {dealsCount > 0 && (
            <button
              onClick={() => patch({ discounted: !filters.discounted })}
              aria-pressed={filters.discounted}
              className={`inline-flex items-center gap-1.5 h-11 rounded-xl border-2 px-4 text-[15px] font-bold transition-colors ${
                filters.discounted ? 'bg-accent border-accent text-white' : 'bg-accent-soft border-accent/40 text-accent hover:border-accent'
              }`}
            >
              <Flame className="w-4 h-4" />
              {tx('لقطات', 'Deals')}
              <span className="num text-xs opacity-80">{dealsCount}</span>
            </button>
          )}
          <button
            onClick={() => patch({ negotiable: !filters.negotiable })}
            aria-pressed={filters.negotiable}
            className={`inline-flex items-center gap-1.5 h-11 rounded-xl border-2 px-4 text-[15px] font-bold transition-colors ${
              filters.negotiable ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:border-emerald-600'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            {tx('قابل للتفاوض', 'Negotiable')}
          </button>
        </div>
      </div>

      <div ref={resultsTop} className="scroll-mt-48 mt-3">
        {pills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {pills.map((p) => (
              <button
                key={p.key}
                onClick={p.remove}
                className="inline-flex items-center gap-1 rounded-full bg-brand-soft text-brand-ink ps-3 pe-2 py-1 text-xs font-semibold hover:bg-brand/15"
              >
                {p.label}
                <X className="w-3.5 h-3.5" />
              </button>
            ))}
            <button onClick={clearAll} className="text-xs font-semibold text-muted hover:text-ink px-1.5">
              {tx('مسح الكل', 'Clear all')}
            </button>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            <span className="num font-bold text-ink">{results.length}</span> {tx('وحدة', 'units')}
            {results.length > PAGE_SIZE && (
              <span className="text-muted">
                {' · '}
                {tx('عرض', 'showing')} <span className="num">{from}–{to}</span>
              </span>
            )}
          </p>
          <label className="flex items-center gap-2 text-sm text-muted">
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">{tx('ترتيب', 'Sort')}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-lg border border-line bg-surface px-2.5 text-sm font-semibold text-ink focus:outline-none focus:border-brand"
            >
              {sorts.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-5">
              {pageItems.map((u) => (
                <UnitCard key={u.id} unit={u} onOpen={onSelectUnit} fitsBudget={budgetOn} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination page={current} totalPages={totalPages} onChange={goToPage} />
            </div>
            <p className="mt-6 text-center text-xs text-muted">
              {tx('التوفير محسوب على سعر المطور وقت نشر الإعلان، وهو تقديري.', "Savings are against the developer's price when the listing went up — an estimate.")}
            </p>
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
              onSubmit={async (e) => {
                e.preventDefault();
                // Sign in first; they send it again once they're in.
                if (!requireAuth()) return;
                setAlertTried(true);
                const phone = alertPhone.replace(/\s/g, '');
                if (!/^01\d{9}$/.test(phone) || alertSending) return;
                setAlertSending(true);
                setAlertError('');
                try {
                  await sendSearchAlert({
                    phone,
                    summary: pills.map((p) => p.label).join(' · ') || undefined,
                    filters: { ...filters, budget: budgetOn ? budget : null, sort: effectiveSort },
                  });
                  onAlertRequested();
                } catch (err) {
                  setAlertError(errorText(err));
                } finally {
                  setAlertSending(false);
                }
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
              <button type="submit" disabled={alertSending} className="btn-primary min-h-13 whitespace-nowrap">
                <BellRing className="w-5 h-5" />
                {alertSending ? tx('بنبعت...', 'Sending...') : tx('نبّهني', 'Alert me')}
              </button>
            </form>
            {alertError && <p role="alert" className="mt-2 text-sm text-danger">{alertError}</p>}
            {alertTried && !/^01\d{9}$/.test(alertPhone.replace(/\s/g, '')) && (
              <p className="mt-2 text-sm text-danger">{tx('رقم موبايل مصري صحيح، 11 رقم', 'A valid 11-digit Egyptian mobile')}</p>
            )}
            <button onClick={clearAll} className="mt-5 text-sm font-semibold text-ink-soft hover:text-ink underline min-h-11">
              {tx('أو امسح الفلاتر وشوف كل الوحدات', 'Or clear filters and see everything')}
            </button>
          </div>
        )}
      </div>

      {/* All filters: a bottom sheet on phones, a side drawer on larger screens */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] flex flex-col rounded-t-[28px] bg-surface md:inset-x-auto md:inset-y-0 md:start-0 md:w-[26rem] md:max-h-none md:rounded-none md:shadow-lift">
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
