import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Tag,
  ShieldCheck,
  FileCheck2,
  UserCheck,
  Handshake,
  ChevronDown,
  TrendingDown,
  Ban,
  HandCoins,
  FileText,
  Wallet,
  Percent,
  Users,
  ScrollText,
  Repeat,
  ArrowLeftRight,
  Headset,
  EyeOff,
  Scale,
  ClipboardCheck,
  Landmark,
  Flame,
  Receipt,
  MessageCircle,
  Share2,
  Check,
  X,
  Search,
  KeyRound,
} from 'lucide-react';
import { Filters, SortKey } from '../lib/unitFilters';
import { PageId, RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';
import { IlloForm, IlloKeys, IlloPeople, IlloReview } from '../components/Illustrations';
import { useAnimatedNumber } from '../lib/useAnimatedNumber';
import { BRAND, whatsappLink } from '../config/brand';
import { Budget, BudgetFinder, fitsBudget } from '../components/BudgetFinder';
import { PROPERTY_TYPES, REGIONS, cancellationLoss, currency, isDeal, money, sellerDiscount } from '../lib/unitHelpers';

interface HomePageProps {
  units: RealEstateUnit[];
  budget: Budget;
  onBudgetChange: (b: Budget) => void;
  onBrowseWithBudget: () => void;
  onNavigate: (page: PageId) => void;
  onSelectUnit: (unit: RealEstateUnit) => void;
  onOpenRules: (tab: 'seller' | 'buyer') => void;
  /** Opens the listings filtered to deals only. */
  onOpenDeals: () => void;
  /** Opens the listings with these filters (hero search, quick chips, areas). */
  onSearch: (s: HomeSearch) => void;
}

/** What the listings page should open with after a search on the home page. */
export interface HomeSearch {
  filters?: Partial<Filters>;
  sort?: SortKey;
  /** Most the buyer can pay a month; turns the budget filter on. */
  monthly?: number;
}

/** The hero search block is wider than the rest of the page, like a search site: ~78% of the screen on desktop. */
const WIDE = 'w-full mx-auto px-4 sm:px-6 lg:px-0 lg:w-[78%] max-w-[110rem]';

const SectionTitle: React.FC<{ title: string; sub?: string; center?: boolean; light?: boolean; kicker?: string }> = ({
  title,
  sub,
  center,
  light,
  kicker,
}) => (
  <div className={center ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
    {kicker && (
      <p
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-semibold mb-3 ${
          light ? 'bg-white/10 text-accent-light' : 'bg-sand text-brand'
        }`}
      >
        {kicker}
      </p>
    )}
    <h2 className={`text-2xl sm:text-[2rem] font-bold leading-tight ${light ? 'text-white' : 'text-brand'}`}>{title}</h2>
    {sub && <p className={`mt-3 text-[15px] sm:text-base leading-relaxed ${light ? 'text-white/60' : 'text-muted'}`}>{sub}</p>}
  </div>
);

const Slider: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void }> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const { language, isRTL } = useLanguage();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-ink-soft">{label}</span>
        <span className="num font-display text-xl font-bold text-ink">
          {money(value, language)} <span className="text-xs text-muted font-medium">{currency(language)}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to ${isRTL ? 'left' : 'right'}, var(--color-brand) ${pct}%, var(--color-line) ${pct}%)` }}
      />
    </div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({
  units,
  budget,
  onBudgetChange,
  onBrowseWithBudget,
  onNavigate,
  onSelectUnit,
  onOpenRules,
  onOpenDeals,
  onSearch,
}) => {
  const { tx, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const matching = useMemo(() => units.filter((u) => fitsBudget(u, budget)), [units, budget]);
  // Show what fits the budget above; fall back to the newest units so the row is never empty.
  const featured = useMemo(
    () => [...(matching.length > 0 ? matching : units)].sort((a, b) => sellerDiscount(b) - sellerDiscount(a)),
    [matching, units],
  );
  // Biggest seller discounts first.
  const deals = useMemo(() => units.filter(isDeal).sort((a, b) => sellerDiscount(b) - sellerDiscount(a)), [units]);

  return (
    <div>
      {/* ───────── 1. Hero — one message, for the owner who's behind ───────── */}
      <section className="relative overflow-hidden bg-brand-ink text-white">
        {/* A real home behind the message; two washes keep the words readable over any photo. */}
        <img src={BRAND.heroImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-brand-ink/25 to-brand-ink/5" />
        <div aria-hidden="true" className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-brand-ink/55 via-brand-ink/15 to-transparent" />

        {/* Short band like a search site: title and one line at the bottom, the search card overlapping it. */}
        <div className={`relative ${WIDE} min-h-[23rem] sm:min-h-[25rem] lg:min-h-[27rem] flex flex-col justify-end pt-10 pb-24 sm:pb-36`}>
          <div className="w-full">
            <p className="hero-in inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-3 py-1 text-xs sm:text-sm font-medium text-white">
              <ShieldCheck className="w-4 h-4 text-accent-light" />
              {tx('تنازل رسمي في مقر المطور · من غير عمولة عليك', 'Official transfer at the developer · no fee for you')}
            </p>
            <h1 style={{ animationDelay: '80ms' }} className="hero-in mt-3 text-[1.9rem] sm:text-4xl lg:text-5xl font-extrabold leading-[1.25] text-white drop-shadow">
              {tx('اتأخرت في الأقساط؟', 'Behind on installments?')}{' '}
              <br className="sm:hidden" />
              <span className="text-accent-light">
                {tx('استرد اللي دفعته ', 'Get back all ')}
                <span className="relative inline-block">
                  {tx('كامل.', 'you paid.')}
                  <svg aria-hidden="true" viewBox="0 0 200 20" preserveAspectRatio="none" className="underline-draw absolute -bottom-2 inset-x-0 w-full h-3 sm:h-4">
                    <path d="M4 14C40 6 90 4 130 7s56 6 66 4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>
            <p style={{ animationDelay: '160ms' }} className="hero-in mt-3 text-sm sm:text-lg font-medium text-white/90 max-w-4xl leading-relaxed drop-shadow">
              {tx(
                'ما تلغيش وتخسر. بنبيع وحدتك بسعر اللي دفعته، حتى لو عليك متأخرات — بتتخصم يوم التنازل، ومحدش هيعرف إنك بتبيع.',
                "Don't cancel and lose. We sell your unit for what you paid, even with arrears — deducted on transfer day — and nobody knows you're selling.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ───────── 1b. One search card over the band: buy · sell · swap ───────── */}
      <HeroSearch onSearch={onSearch} onNavigate={onNavigate} />

      {/* ───────── 1b'. For the owner who's behind: the promises and the two ways to start ───────── */}
      <section className={`${WIDE} pt-5`}>
        <div className="rounded-card border border-line bg-surface shadow-soft p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <ul className="flex-1 grid sm:grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: Receipt, t: tx('عليك متأخرات؟', 'Behind?'), d: tx('بتتخصم يوم التنازل', 'Deducted on transfer day') },
              { icon: EyeOff, t: tx('في سرية', 'Private'), d: tx('اسمك ورقمك مش بيتنشروا', 'Name and number never shown') },
              { icon: Wallet, t: tx('صفر عمولة', 'Zero fee'), d: tx('وكاش بشيك مصرفي', 'Paid by bank cheque') },
            ].map((x) => (
              <li key={x.t} className="flex items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-accent-soft text-accent shrink-0">
                  <x.icon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{x.t}</span>
                  <span className="block text-xs text-muted">{x.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:border-s lg:border-line lg:ps-6">
            <div className="flex gap-2">
              <button onClick={() => onNavigate('sell')} className="btn-primary flex-1 sm:flex-none px-5">
                <Tag className="w-5 h-5" />
                {tx('اعرض وحدتك', 'List your unit')}
              </button>
              <button onClick={() => onNavigate('statement')} className="btn-ghost flex-1 sm:flex-none px-5">
                <ClipboardCheck className="w-5 h-5 text-brand" />
                {tx('كشف حساب مجاني', 'Free statement')}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-muted lg:max-w-[11rem] leading-snug">
              {tx('جالك إنذار من المطور؟ ', 'Got a warning letter? ')}
              <a href={`tel:${BRAND.hotline}`} className="font-semibold text-brand underline underline-offset-4">
                {tx(`كلّمنا ${BRAND.hotline}`, `Call ${BRAND.hotline}`)}
              </a>
              {tx(' قبل ما يلغي.', ' before they cancel.')}
            </p>
          </div>
        </div>
      </section>

      {/* ───────── 1c. Areas, as photos ───────── */}
      <RegionsRow units={units} onPick={(r) => onSearch({ filters: { regions: [r] } })} />

      {/* ───────── 2. Buyers — one strip, not a second hero ───────── */}
      <section className="page-wrap -mt-px pt-8 sm:pt-10">
        <div className="card p-5 sm:p-7 grid lg:grid-cols-[16rem_1fr_15rem] gap-6 lg:gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-muted">{tx('بتدوّر على وحدة؟', 'Looking for a unit?')}</p>
            <p className="font-display mt-1 text-2xl font-bold text-ink leading-snug">{tx('دوّر بقسطك، بسعر زمان', 'Search by monthly, at old prices')}</p>
          </div>
          <BudgetFinder budget={budget} onChange={onBudgetChange} />
          <div>
            <p className="text-sm text-ink-soft">
              {matching.length > 0 ? (
                <>
                  <span className="num font-display text-2xl font-bold text-ink">{matching.length}</span> {tx('وحدة على قد ميزانيتك', 'units fit your budget')}
                </>
              ) : (
                tx('زوّد الميزانية شوية', 'Try a higher budget')
              )}
            </p>
            <button onClick={onBrowseWithBudget} className="btn-primary w-full mt-3 min-h-12">
              {tx('وريني الوحدات', 'Show me units')}
              <Arrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────── 2b. Sellers: the cancel-vs-sell calculator, compact ───────── */}
      <section className="mt-14 sm:mt-20 bg-surface border-y border-line">
        <div className="page-wrap py-14 sm:py-20 grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-center">
          <div>
            <SectionTitle
              kicker={tx('لو بتفكر تلغي', 'Thinking of cancelling?')}
              title={tx('احسب هتخسر كام لو لغيت', 'See what cancelling would cost you')}
              sub={tx(
                'المطور بيخصم 10–15% من سعر العقد كله لو لغيت، وبيرجعلك الباقي على أقساط. حط أرقامك وشوف الفرق.',
                'Developers deduct 10–15% of the whole contract on cancellation and refund the rest in instalments. Try your numbers.',
              )}
            />
            <button onClick={() => onNavigate('sell')} className="btn-primary rounded-full mt-6">
              <Tag className="w-5 h-5" />
              {tx('اعرض وحدتك', 'List your unit')}
            </button>
          </div>
          <HeroCalculator />
        </div>
      </section>

      {/* ───────── 3. Why sell through us — the free statement and four promises ───────── */}
      <SellerPromises onStatement={() => onNavigate('statement')} />

      {/* ───────── 3b. The three ways out, side by side ───────── */}
      <ThreeWays onSell={() => onNavigate('sell')} />

      {/* ───────── 4. Units — budget matches, discounted ones first ───────── */}
      <section>
        <div className="page-wrap py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <SectionTitle
              title={matching.length > 0 ? tx('على قد ميزانيتك', 'Within your budget') : tx('وحدات بسعر زمان', 'Units at old prices')}
              sub={tx('موثّقة ومراجَعة قبل النشر — واللي عليها خصم من صاحبها الأول', 'Verified before listing — owner discounts first')}
            />
            <div className="flex flex-wrap items-center gap-3">
              {deals.length > 0 && (
                <button onClick={onOpenDeals} className="chip bg-accent-soft border-accent/30 text-accent hover:border-accent">
                  <Flame className="w-4 h-4" />
                  {tx(`أقل من المدفوع (${deals.length})`, `Below what was paid (${deals.length})`)}
                </button>
              )}
              <button onClick={onBrowseWithBudget} className="hidden sm:inline-flex items-center gap-1.5 text-brand font-semibold hover:underline whitespace-nowrap min-h-11">
                {tx('شوف الكل', 'See all')}
                <Arrow className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {featured.slice(0, 6).map((u, i) => (
              <div key={u.id} className={`w-[82%] shrink-0 snap-start sm:w-auto ${i >= 3 ? 'sm:hidden' : ''}`}>
                <UnitCard unit={u} onOpen={onSelectUnit} fitsBudget={matching.length > 0} />
              </div>
            ))}
          </div>
          <button onClick={onBrowseWithBudget} className="btn-ghost w-full mt-6 sm:hidden">
            {tx('شوف كل الوحدات', 'See all units')}
          </button>
        </div>
      </section>

      {/* ───────── 5. Swap — only on Wahdety ───────── */}
      <SwapFeature onSwap={() => onNavigate('swap')} />

      {/* ───────── 6. Money safety ───────── */}
      <RulesPreview onOpenRules={onOpenRules} />

      {/* ───────── 7. Steps ───────── */}
      <HowItWorks />

      {/* ───────── 8. FAQ ───────── */}
      <Faq />

      {/* ───────── 9. One closing call ───────── */}
      <section className="page-wrap pb-16">
        {/* Same photo-and-wash treatment as the hero, so the page opens and closes the same way. */}
        <div className="relative overflow-hidden rounded-card bg-brand-ink text-white p-7 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <img src={BRAND.keysImage} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-brand-ink/95 via-brand-ink/80 to-brand-ink/50" />
          <div className="relative max-w-xl">
            <p className="font-display text-2xl sm:text-3xl font-bold">{tx('قبل ما تلغي، اعرف موقفك', 'Before you cancel, know where you stand')}</p>
            <p className="mt-2 text-white/80">{tx('كشف حساب مجاني لوحدتك ونصيحة صريحة — من غير أي التزام.', 'A free statement and honest advice — no commitment.')}</p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <button onClick={() => onNavigate('statement')} className="btn bg-white text-brand hover:bg-brand-soft min-h-13 px-6">
              <ClipboardCheck className="w-5 h-5" />
              {tx('اطلب كشف الحساب', 'Get my statement')}
            </button>
            <a
              href={whatsappLink(tx('عندي وحدة ومتأخر في الأقساط', "I'm behind on installments for my unit"))}
              target="_blank"
              rel="noreferrer"
              className="btn border border-white/30 text-white hover:bg-white/10 min-h-13 px-5"
            >
              <MessageCircle className="w-5 h-5" />
              {tx('واتساب', 'WhatsApp')}
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">{tx('الأرقام استرشادية، والمراجعة النهائية بتكون على العقد الفعلي.', 'Figures are indicative; final review is on the actual contract.')}</p>
      </section>
    </div>
  );
};

/* Buy · sell · swap in one card that sits over the bottom of the hero band. */
const HeroSearch: React.FC<{ onSearch: (s: HomeSearch) => void; onNavigate: (page: PageId) => void }> = ({ onSearch, onNavigate }) => {
  const { language, tx } = useLanguage();
  const [mode, setMode] = useState<'buy' | 'sell' | 'swap'>('buy');
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const [monthly, setMonthly] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = Number(monthly.replace(/\D/g, ''));
    const filters: Partial<Filters> = {};
    if (query.trim()) filters.query = query.trim();
    if (region) filters.regions = [region];
    if (type) filters.types = [type];
    onSearch({ filters, monthly: m > 0 ? m : undefined });
  };

  const quick: { icon: React.ElementType; label: string; s: HomeSearch }[] = [
    { icon: Flame, label: tx('فيها خصم', 'Discounted'), s: { filters: { discounted: true }, sort: 'deals' } },
    { icon: KeyRound, label: tx('استلام فوري', 'Ready now'), s: { filters: { delivery: ['استلام فوري'] } } },
    { icon: Wallet, label: tx('قسط قليل', 'Low monthly'), s: { sort: 'monthly' } },
  ];

  return (
    <section className={`relative -mt-16 sm:-mt-28 ${WIDE}`}>
      <div className="card shadow-lift overflow-hidden">
        <div className="px-4 sm:px-8 pt-3 sm:pt-4">
          {/* Underline tabs, full width. */}
          <div role="tablist" className="grid grid-cols-3 border-b-2 border-line">
            {([
              ['buy', tx('اشتري', 'Buy'), Search],
              ['sell', tx('بيع', 'Sell'), Tag],
              ['swap', tx('بدل', 'Swap'), Repeat],
            ] as const).map(([k, label, Icon]) => (
              <button
                key={k}
                role="tab"
                aria-selected={mode === k}
                onClick={() => setMode(k)}
                className={`relative -mb-[2px] inline-flex items-center justify-center gap-2 min-h-13 text-base font-bold border-b-2 transition-colors ${
                  mode === k ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-8 sm:pt-6">
          {mode === 'buy' && (
            <form onSubmit={submit} className="grid gap-3">
              <label className="relative block">
                <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-muted pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tx('دوّر بالكمبوند، المطور أو المنطقة', 'Search by compound, developer or area')}
                  aria-label={tx('بحث', 'Search')}
                  className="field h-14 ps-12 text-base"
                />
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_12rem] gap-3">
                <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label={tx('المنطقة', 'Area')} className="field h-14">
                  <option value="">{tx('كل المناطق', 'All areas')}</option>
                  {REGIONS.map((r) => (
                    <option key={r.ar} value={r.ar}>
                      {language === 'ar' ? r.ar : r.en}
                    </option>
                  ))}
                </select>
                <select value={type} onChange={(e) => setType(e.target.value)} aria-label={tx('نوع الوحدة', 'Unit type')} className="field h-14">
                  <option value="">{tx('كل الأنواع', 'All types')}</option>
                  {PROPERTY_TYPES.map((p) => (
                    <option key={p.ar} value={p.ar}>
                      {language === 'ar' ? p.ar : p.en}
                    </option>
                  ))}
                </select>
                <input
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  inputMode="numeric"
                  placeholder={tx('أقصى قسط في الشهر', 'Max monthly')}
                  aria-label={tx('أقصى قسط في الشهر', 'Max monthly')}
                  className="field h-14 num col-span-2 lg:col-span-1"
                />
                <button type="submit" className="btn-primary h-14 text-base col-span-2 lg:col-span-1">
                  <Search className="w-5 h-5" />
                  {tx('دوّر', 'Search')}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-sm text-muted">{tx('بحث سريع:', 'Quick:')}</span>
                {quick.map((q) => (
                  <button key={q.label} type="button" onClick={() => onSearch(q.s)} className="chip-off">
                    <q.icon className="w-4 h-4 text-brand" />
                    {q.label}
                  </button>
                ))}
              </div>
            </form>
          )}
          {mode !== 'buy' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-h-[8.5rem]">
              <div>
                <p className="text-lg font-bold text-ink">
                  {mode === 'sell' ? tx('بيع وحدتك باللي دفعته', 'Sell your unit for what you paid') : tx('بدّل وحدتك بوحدة تانية', 'Swap your unit for another')}
                </p>
                <p className="mt-1 text-ink-soft">
                  {mode === 'sell'
                    ? tx('صفر عمولة عليك، في سرية، وحتى لو عليك متأخرات.', 'Zero fee, fully private — even with arrears.')
                    : tx('أي وحدة على الموقع، وتدفع أو تاخد الفرق بس.', 'Any listed unit — pay or receive only the difference.')}
                </p>
              </div>
              <button onClick={() => onNavigate(mode === 'sell' ? 'sell' : 'swap')} className="btn-primary h-14 px-8 text-base shrink-0">
                {mode === 'sell' ? <Tag className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                {mode === 'sell' ? tx('اعرض وحدتك', 'List your unit') : tx('جرّب التبديل', 'Try a swap')}
              </button>
            </div>
          )}
        </div>

        {/* Policies, not marketing numbers — every one of these is true from day one. */}
        <dl className="grid grid-cols-3 border-t border-line bg-sand-soft [&>div+div]:border-s [&>div+div]:border-line">
          {[
            { v: tx('صفر', 'Zero'), l: tx('عمولة على البايع', 'seller fee') },
            { v: tx('صفر', 'Zero'), l: tx('أوفر على المشتري', 'overprice') },
            { v: tx('شيك مصرفي', 'Bank cheque'), l: tx('في مقر المطور', 'at the developer') },
          ].map((x) => (
            <div key={x.l} className="px-2 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-x-1.5 text-center">
              <dt className="sr-only">{x.l}</dt>
              <dd className="font-bold text-brand text-sm sm:text-base whitespace-nowrap">{x.v}</dd>
              <p className="text-xs sm:text-sm text-muted">{x.l}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

/* Soft tones behind each area photo (and in place of it, until an area has one). */
const AREA_TINTS = ['#e6dccb', '#dcd2c4', '#d9cfbd', '#e2d6c6', '#d4c8b4', '#e8dfd0'];
const AREA_SHORT: Record<string, [string, string]> = {
  'القاهرة الجديدة': ['التجمع', 'New Cairo'],
  'الشيخ زايد وأكتوبر': ['زايد', 'Zayed'],
  'العاصمة الإدارية': ['العاصمة', 'New Capital'],
  'الساحل الشمالي': ['الساحل', 'North Coast'],
  'المستقبل والشروق': ['المستقبل', 'Mostakbal'],
  'مدينة نصر ومصر الجديدة': ['مدينة نصر', 'Nasr City'],
  'العلمين الجديدة': ['العلمين', 'Alamein'],
  'العين السخنة': ['السخنة', 'Sokhna'],
  'البحر الأحمر': ['البحر الأحمر', 'Red Sea'],
};

/* Placeholder photo per area until it has a listed unit to show. Swap for real photos of each area. */
const AREA_PHOTOS: Record<string, string> = {
  'القاهرة الجديدة': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=70',
  'الشيخ زايد وأكتوبر': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=70',
  'العاصمة الإدارية': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=70',
  'المستقبل والشروق': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=70',
  'مدينة نصر ومصر الجديدة': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=70',
  'الساحل الشمالي': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=70',
  'العلمين الجديدة': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=70',
  'العين السخنة': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=70',
  'البحر الأحمر': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=70',
};

const RegionsRow: React.FC<{ units: RealEstateUnit[]; onPick: (region: string) => void }> = ({ units, onPick }) => {
  const { tx } = useLanguage();
  // Every area, busiest first; each with one of its own unit photos when it has one.
  const areas = useMemo(
    () =>
      REGIONS.map((r) => {
        const inArea = units.filter((u) => u.region === r.ar);
        return { ...r, count: inArea.length, photo: inArea[0]?.images[0] ?? AREA_PHOTOS[r.ar] };
      }).sort((a, b) => b.count - a.count),
    [units],
  );
  return (
    <section className="page-wrap pt-10 sm:pt-12">
      <h2 className="text-2xl sm:text-[2rem] font-bold text-brand">{tx('المناطق', 'Areas')}</h2>
      <div className="mt-5 -mx-4 px-4 sm:mx-0 sm:px-0 flex lg:justify-between gap-5 sm:gap-7 overflow-x-auto no-scrollbar pb-1">
        {areas.map((r, i) => (
          <button key={r.ar} onClick={() => onPick(r.ar)} className="group flex flex-col items-center gap-1.5 shrink-0">
            <span
              className="block w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-transparent ring-offset-2 ring-offset-paper group-hover:ring-brand transition"
              style={{ backgroundColor: AREA_TINTS[i % AREA_TINTS.length] }}
            >
              {r.photo && <img src={r.photo} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
            </span>
            <span className="mt-0.5 text-sm font-semibold text-ink-soft group-hover:text-brand">{tx(AREA_SHORT[r.ar]?.[0] ?? r.ar, AREA_SHORT[r.ar]?.[1] ?? r.en)}</span>
            <span className="text-xs text-muted">
              {r.count > 0 ? tx(r.count === 1 ? 'وحدة واحدة' : r.count === 2 ? 'وحدتين' : `${r.count} ${r.count > 10 ? 'وحدة' : 'وحدات'}`, `${r.count} ${r.count === 1 ? 'unit' : 'units'}`) : tx('قريباً', 'Soon')}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

/* The hero's right side: the owner's own numbers, cancel vs sell — the whole argument in one card. */
const HeroCalculator: React.FC = () => {
  const { language, tx } = useLanguage();
  const [contract, setContract] = useState(6_000_000);
  const [paid, setPaid] = useState(1_500_000);
  const safePaid = Math.min(paid, contract);
  const loss = cancellationLoss(contract, safePaid);
  const cancelBack = safePaid - loss;
  const lostPct = safePaid ? Math.round((loss / safePaid) * 100) : 0;
  const shownCancel = useAnimatedNumber(cancelBack);
  const shownPaid = useAnimatedNumber(safePaid);
  const shownLoss = useAnimatedNumber(loss);

  // Native share sheet on phones (WhatsApp is usually first); WhatsApp link elsewhere.
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    const text = tx(
      `وحدتي بـ ${money(contract, language)} ودفعت ${money(safePaid, language)}.\nلو لغيت مع المطور: ترجعلي ${money(cancelBack, language)} على أقساط — يعني هخسر ${money(loss, language)}.\nلو بعتها عن طريق وحدتي: هقبض ${money(safePaid, language)} كاش.\nإيه رأيك؟`,
      `My unit is ${money(contract, language)} and I've paid ${money(safePaid, language)}.\nCancelling returns ${money(cancelBack, language)} over years — I'd lose ${money(loss, language)}.\nSelling through Wahdety: ${money(safePaid, language)} cash.\nWhat do you think?`,
    );
    if (navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch {
        /* dismissed — fall through */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noreferrer');
  };

  return (
    <div id="seller-calc" className="card text-ink p-5 sm:p-6 shadow-lift scroll-mt-24 w-full max-w-xl lg:justify-self-end">
      <p className="font-display text-lg font-bold">{tx('احسب بأرقامك', 'Try your numbers')}</p>
      <div className="mt-4 grid gap-4">
        <Slider label={tx('سعر الوحدة في العقد', 'Contract price')} value={contract} min={1_000_000} max={15_000_000} step={100_000} onChange={setContract} />
        <Slider label={tx('دفعت كام لحد دلوقتي؟', 'Paid so far')} value={safePaid} min={100_000} max={contract} step={50_000} onChange={setPaid} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-paper border border-line p-3.5">
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted">
            <TrendingDown className="w-4 h-4" />
            {tx('لو لغيت', 'If you cancel')}
          </p>
          <p className="num font-display mt-1.5 text-xl sm:text-2xl font-bold text-muted line-through decoration-2">{money(shownCancel, language)}</p>
          <p className="mt-1 text-xs text-muted">{tx('على أقساط لسنين', 'over years')}</p>
        </div>
        <div className="rounded-xl bg-brand text-white p-3.5">
          <p className="text-xs sm:text-sm text-white/70">{tx('لو بعت عن طريقنا', 'Sell through us')}</p>
          <p className="num font-display mt-1.5 text-xl sm:text-2xl font-bold">{money(shownPaid, language)}</p>
          <p className="mt-1 text-xs text-white/70">{tx('كاش يوم التنازل', 'cash on transfer day')}</p>
        </div>
      </div>
      <p className="mt-3 rounded-xl bg-danger-soft px-3 py-2 text-sm font-semibold text-danger">
        {tx(`الإلغاء بيخسّرك ${money(shownLoss, language)} — ${lostPct}% من اللي دفعته`, `Cancelling costs you ${money(loss, language)} — ${lostPct}% of what you paid`)}
      </p>
      <button onClick={share} className="mt-3 w-full inline-flex items-center justify-center gap-2 min-h-11 text-sm font-semibold text-brand hover:underline">
        <Share2 className="w-4 h-4" />
        {tx('ابعت الحسبة دي لحد تستشيره', 'Send this to someone you trust')}
      </button>
    </div>
  );
};

/* Cancel vs a broker vs us — the three options an owner who's behind actually weighs. */
const ThreeWays: React.FC<{ onSell: () => void }> = ({ onSell }) => {
  const { tx } = useLanguage();
  const cols = [tx('تلغي مع المطور', 'Cancel with the developer'), tx('تبيع عن طريق سمسار', 'Sell through a broker'), tx('تبيع عن طريقنا', 'Sell through us')];
  const rows: { k: string; v: [string, string, string]; bad?: [boolean, boolean] }[] = [
    {
      k: tx('هتقبض كام؟', 'What you get'),
      v: [tx('اللي دفعته ناقص 10–15% من سعر العقد كله', 'What you paid, minus 10–15% of the whole contract'), tx('اللي دفعته ناقص عمولة السمسار', "What you paid, minus the broker's fee"), tx('اللي دفعته كامل — صفر عمولة', 'Everything you paid — zero fee')],
      bad: [true, true],
    },
    {
      k: tx('امتى؟', 'When'),
      v: [tx('على أقساط، ممكن تاخد سنين', 'In instalments, possibly years'), tx('لما يلاقي مشتري', 'Whenever he finds a buyer'), tx('كاش يوم التنازل، بشيك مصرفي', 'Cash on transfer day, by bank cheque')],
      bad: [true, false],
    },
    {
      k: tx('عليك متأخرات؟', 'Behind on payments?'),
      v: [tx('بتتخصم، وممكن غرامات زيادة', 'Deducted, possibly with extra fines'), tx('غالباً لازم تسددها الأول', 'Often must be paid first'), tx('بتتخصم يوم التنازل — مش محتاج تدفع حاجة دلوقتي', 'Deducted on transfer day — nothing to pay now')],
      bad: [true, true],
    },
    {
      k: tx('خصوصيتك', 'Your privacy'),
      v: [tx('—', '—'), tx('إعلانات، ورقمك مع ناس كتير', 'Ads, and your number with many people'), tx('اسمك ورقمك مش بيتنشروا', 'Your name and number stay private')],
      bad: [false, true],
    },
    {
      k: tx('فلوسك في أمان؟', 'Is the money safe?'),
      v: [tx('—', '—'), tx('عربون وكاش في إيد', 'Deposits and cash in hand'), tx('مفيش فلوس قبل التنازل، في مقر المطور', 'No money before transfer, at the developer')],
      bad: [false, true],
    },
    {
      k: tx('اختيارات تانية', 'Other options'),
      v: [tx('لأ', 'No'), tx('لأ', 'No'), tx('تبدّلها بوحدة قسطها أقل', 'Swap for a lower monthly')],
      bad: [true, true],
    },
  ];

  const Cell: React.FC<{ text: string; tone: 'bad' | 'neutral' | 'good' }> = ({ text, tone }) => (
    <span className={`flex items-start gap-2 ${tone === 'good' ? 'text-ink font-semibold' : 'text-muted'}`}>
      {tone === 'good' ? (
        <Check className="w-4 h-4 text-brand shrink-0 mt-1" strokeWidth={3} />
      ) : tone === 'bad' ? (
        <X className="w-4 h-4 text-danger/70 shrink-0 mt-1" />
      ) : (
        <span className="w-4 shrink-0" />
      )}
      {text}
    </span>
  );

  return (
    <section className="bg-surface border-y border-line">
      <div className="page-wrap py-14 sm:py-20">
        <SectionTitle center kicker={tx('قبل ما تقرر', 'Before you decide')} title={tx('قدامك 3 طرق. قارن بنفسك.', 'You have three ways out. Compare.')} />

        {/* Desktop: one table */}
        <div className="mt-10 hidden md:block overflow-hidden rounded-card border border-line shadow-soft">
          <div className="grid grid-cols-[11rem_1fr_1fr_1.15fr] bg-paper text-sm font-bold">
            <div className="p-4" />
            <div className="p-4 text-muted">{cols[0]}</div>
            <div className="p-4 text-muted">{cols[1]}</div>
            <div className="p-4 bg-brand text-white">{cols[2]}</div>
          </div>
          {rows.map((r) => (
            <div key={r.k} className="grid grid-cols-[11rem_1fr_1fr_1.15fr] border-t border-line text-[15px]">
              <div className="p-4 font-bold text-ink">{r.k}</div>
              <div className="p-4">
                <Cell text={r.v[0]} tone={r.bad?.[0] ? 'bad' : 'neutral'} />
              </div>
              <div className="p-4">
                <Cell text={r.v[1]} tone={r.bad?.[1] ? 'bad' : 'neutral'} />
              </div>
              <div className="p-4 bg-brand-soft">
                <Cell text={r.v[2]} tone="good" />
              </div>
            </div>
          ))}
        </div>

        {/* Phones: one block per question, ours first */}
        <div className="mt-8 md:hidden rounded-card border border-line divide-y divide-line bg-surface">
          {rows.map((r) => (
            <div key={r.k} className="p-4">
              <p className="font-bold text-ink">{r.k}</p>
              <div className="mt-2 rounded-xl bg-brand-soft px-3 py-2">
                <p className="text-xs text-muted">{cols[2]}</p>
                <Cell text={r.v[2]} tone="good" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted">{cols[0]}</p>
                  <Cell text={r.v[0]} tone={r.bad?.[0] ? 'bad' : 'neutral'} />
                </div>
                <div>
                  <p className="text-xs text-muted">{cols[1]}</p>
                  <Cell text={r.v[1]} tone={r.bad?.[1] ? 'bad' : 'neutral'} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={onSell} className="btn-primary">
            <Tag className="w-5 h-5" />
            {tx('اعرض وحدتك', 'List your unit')}
          </button>
          <p className="mt-3 text-xs text-muted">{tx('نسب الإلغاء والعمولات بتختلف من مطور ومن سمسار للتاني.', 'Cancellation rates and fees vary by developer and broker.')}</p>
        </div>
      </div>
    </section>
  );
};

/* Swap is ours alone — show it with a worked example instead of hiding it in the menu. */
const SwapFeature: React.FC<{ onSwap: () => void }> = ({ onSwap }) => {
  const { language, tx } = useLanguage();
  const mine = 1_500_000;
  const theirs = 2_000_000;
  return (
    <section className="bg-sand-soft border-y border-line">
      <div className="page-wrap py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div>
        <SectionTitle
          kicker={tx('حصري على وحدتي', 'Only on Wahdety')}
          title={tx('عايز تغيّر وحدتك؟ بدّلها.', 'Want a different unit? Swap it.')}
          sub={tx(
            'مش لازم تبيع الأول وتدوّر لوحدك. إحنا بنبيع وحدتك وبنشتريلك التانية مع بعض، وإنت تدفع أو تاخد الفرق بس.',
            "No need to sell first and search on your own. We sell your unit and buy the new one for you together — you just settle the difference.",
          )}
        />
        <ul className="mt-6 space-y-3 text-ink-soft">
          {[
            tx('وحدة قسطها أقل لو القسط تقل عليك — أو أكبر، أو في منطقة تانية', 'A lower monthly if yours is too heavy — or bigger, or elsewhere'),
            tx('الفرق بيتحسب على المدفوع، مش على سعر النهارده', "The difference is on what's paid, not today's price"),
            tx('أي وحدة على الموقع ينفع تبدّل بيها — صاحبها مش لازم يعوز وحدتك', "Any listed unit works — its owner doesn't need to want yours"),
          ].map((p) => (
            <li key={p} className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-ink shrink-0 mt-0.5" />
              {p}
            </li>
          ))}
        </ul>
        <button onClick={onSwap} className="btn-primary mt-8">
          <Repeat className="w-5 h-5" />
          {tx('جرّب التبديل', 'Try a swap')}
        </button>
      </div>

      <div className="rounded-card border border-line bg-surface shadow-lift p-5 sm:p-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
          <div className="rounded-xl bg-paper border border-line p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-muted">{tx('وحدتك — مدفوع فيها', 'Your unit — paid')}</p>
            <p className="num font-display mt-2 text-lg sm:text-3xl font-bold text-ink whitespace-nowrap">{money(mine, language)}</p>
          </div>
          <span className="grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand text-white">
            <ArrowLeftRight className="w-5 h-5" />
          </span>
          <div className="rounded-xl bg-paper border border-line p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-muted">{tx('الوحدة الجديدة — مدفوع فيها', 'New unit — paid')}</p>
            <p className="num font-display mt-2 text-lg sm:text-3xl font-bold text-ink whitespace-nowrap">{money(theirs, language)}</p>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-brand text-white p-5 flex items-center justify-between gap-4">
          <span className="text-white/70">{tx('تدفع الفرق بس', 'You pay only the difference')}</span>
          <span className="num font-display text-2xl sm:text-3xl font-bold">
            {money(theirs - mine, language)} <span className="text-sm font-medium text-white/60">{currency(language)}</span>
          </span>
        </div>
        <p className="mt-3 text-xs text-muted">{tx('مثال توضيحي. الفرق الفعلي بيتحدد بعد مراجعة العقدين.', 'Illustrative. The actual difference is set after both contracts are reviewed.')}</p>
      </div>
      </div>
    </section>
  );
};

/* Sellers: the cancellation maths, then what we promise them. */
const SellerPromises: React.FC<{ onStatement: () => void }> = ({ onStatement }) => {
  const { tx } = useLanguage();

  const promises = [
    {
      icon: Receipt,
      t: tx('عليك متأخرات؟ عادي', 'Behind on payments? Fine'),
      d: tx('بنبيعها برضه. المتأخرات والغرامات بتتخصم من فلوسك يوم التنازل، فمش محتاج تدفع حاجة دلوقتي.', "We still sell it. Arrears and fines come out of your payout on transfer day — nothing to pay now."),
    },
    {
      icon: Headset,
      t: tx('مستشار واحد معاك', 'One advisor, start to finish'),
      d: tx('نفس الشخص من أول مكالمة لحد ما تقبض الشيك. مش هتحكي حكايتك مرتين.', "The same person from the first call until you hold the cheque. You'll never repeat yourself."),
    },
    {
      icon: EyeOff,
      t: tx('بيع في هدوء', 'A quiet sale'),
      d: tx('من غير يافطة ولا تليفونات سماسرة. اسمك ورقمك مش بيتنشروا، والمشترين بيكلمونا احنا.', 'No signs, no broker calls. Your name and number are never published — buyers talk to us.'),
    },
    {
      icon: Scale,
      t: tx('من غير ضغط', 'No pressure'),
      d: tx('لو الأحسن ليك إنك تكمّل أقساطك، هنقولك كده. القرار قرارك.', "If you're better off keeping your unit, we'll tell you. It's your call."),
    },
  ];

  return (
    <section className="page-wrap py-14 sm:py-20">
      <SectionTitle center kicker={tx('لو مش قادر تكمّل', "If you can't keep up")} title={tx('ليه تبيع عن طريقنا؟', 'Why sell through us?')} />
      <div className="mt-10 grid lg:grid-cols-[1fr_1.4fr] gap-4 sm:gap-5">
        <div className="rounded-card border border-line bg-surface shadow-soft overflow-hidden flex flex-col">
          <div className="relative h-44 sm:h-52">
            <img src={BRAND.peopleImage} alt="" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/70 to-transparent" />
            <p className="absolute bottom-3 inset-x-4 text-white text-sm font-semibold">{tx('مستشار واحد معاك من أول مكالمة لحد ما تقبض', 'One advisor with you from the first call until you’re paid')}</p>
          </div>
          <div className="p-6 sm:p-8 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand text-white">
              <ClipboardCheck className="w-6 h-6" />
            </span>
            <span className="rounded-xl bg-accent-soft text-accent px-3 py-1 text-sm font-bold">{tx('مجاناً', 'Free')}</span>
          </div>
          <p className="font-display mt-5 text-2xl sm:text-3xl font-bold text-ink">{tx('ابدأ بكشف حساب', 'Start with a statement')}</p>
          <p className="mt-3 text-ink-soft leading-relaxed flex-1">
            {tx(
              'بنراجع عقدك ومدفوعاتك والمتبقي، ونقولك بالأرقام وبصراحة: تبيع، ولا تبدّل، ولا تكمّل. من غير أي التزام.',
              'We review your contract, payments and balance and tell you in numbers: sell, swap or keep going. No commitment.',
            )}
          </p>
          <button onClick={onStatement} className="btn-primary mt-6 self-start">
            {tx('اطلب كشف الحساب', 'Get my statement')}
          </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {promises.map((p) => (
            <div key={p.t} className="rounded-card bg-surface border border-line shadow-soft p-5 sm:p-6 hover:shadow-lift hover:-translate-y-0.5 transition">
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-soft text-brand">
                <p.icon className="w-5 h-5" />
              </span>
              <p className="mt-4 font-bold text-lg text-ink">{p.t}</p>
              <p className="mt-1 text-sm text-muted leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks: React.FC = () => {
  const { tx } = useLanguage();
  const [tab, setTab] = useState<'sell' | 'buy'>('sell');

  const steps =
    tab === 'sell'
      ? [
          { illo: IlloForm, icon: FileCheck2, t: tx('ابعت بيانات وحدتك', 'Send your unit details'), d: tx('دقيقة واحدة، ومجاناً', 'One minute, free') },
          { illo: IlloReview, icon: ClipboardCheck, t: tx('كشف حساب مجاني', 'Free statement'), d: tx('نراجع العقد والمديونية ونقولك موقفك', 'We check contract and dues, and tell you where you stand') },
          { illo: IlloPeople, icon: Users, t: tx('نوصلك بمشتري جاد', 'We find a serious buyer'), d: tx('واسمك ورقمك مش بيظهروا', 'Your name and number stay hidden') },
          { illo: IlloKeys, icon: Handshake, t: tx('تتنازل وتقبض', 'Transfer & get paid'), d: tx('في مقر المطور بشيك مصرفي', 'At the developer, by bank cheque') },
        ]
      : [
          { illo: IlloForm, icon: Wallet, t: tx('حدد ميزانيتك', 'Set your budget'), d: tx('الكاش اللي معاك والقسط اللي يريحك', 'Your cash and a comfortable monthly') },
          { illo: IlloPeople, icon: UserCheck, t: tx('عاين ببلاش', 'Free viewing'), d: tx('بنرتبها معاك', 'We arrange it') },
          { illo: IlloReview, icon: ShieldCheck, t: tx('اطمن على الورق', 'Check the papers'), d: tx('العقد والمديونية متراجعين', 'Contract & dues verified') },
          { illo: IlloKeys, icon: Handshake, t: tx('استلم باسمك', 'Take it over'), d: tx('تنازل رسمي وتكمّل الأقساط', 'Official transfer, continue the plan') },
        ];

  return (
    <section className="bg-surface border-y border-line">
      <div className="page-wrap py-14 sm:py-20">
        <SectionTitle center kicker={tx('إزاي بنشتغل', 'How it works')} title={tx('4 خطوات وبس', 'Four steps, that’s it')} />
        <div className="mt-6 flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-paper border border-line">
            {(['sell', 'buy'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === k ? 'bg-brand text-white' : 'text-ink-soft hover:text-brand'}`}
              >
                {k === 'sell' ? tx('للبايع', 'Sellers') : tx('للمشتري', 'Buyers')}
              </button>
            ))}
          </div>
        </div>
        <ol className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {steps.map((s, i) => (
            <li key={s.t} className="relative flex sm:block items-center gap-4 rounded-card border border-line bg-paper p-4 sm:p-6">
              <span className="hidden sm:block absolute top-4 end-6 num font-display text-6xl font-bold text-brand/10">{i + 1}</span>
              <span className="relative grid place-items-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sand text-brand shrink-0">
                <s.illo className="w-11 h-11 sm:w-14 sm:h-14" />
                <span className="sm:hidden num absolute -top-1.5 -end-1.5 grid place-items-center w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold">{i + 1}</span>
              </span>
              <div>
                <p className="sm:mt-6 font-bold sm:text-lg text-ink">{s.t}</p>
                <p className="sm:mt-1 text-sm sm:text-base text-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

/* The rules, framed around what buyers and sellers actually worry about: the money. */
const RulesPreview: React.FC<{ onOpenRules: (tab: 'seller' | 'buyer') => void }> = ({ onOpenRules }) => {
  const { tx } = useLanguage();
  const rules = [
    { icon: HandCoins, t: tx('مفيش فلوس قبل التنازل', 'No money before transfer'), d: tx('ولا عربون ولا مقدم في إيد حد', 'No deposit, no cash in anyone’s hand') },
    { icon: Landmark, t: tx('شيك مصرفي في مقر المطور', 'Bank cheque at the developer'), d: tx('الفلوس والتنازل في نفس المكان والوقت', 'Payment and transfer at the same time and place') },
    { icon: Ban, t: tx('صفر أوفر برايس', 'Zero overprice'), d: tx('السعر هو اللي البايع دفعه، مش جنيه زيادة', 'The price is what the seller paid') },
    { icon: FileText, t: tx('المديونية مكتوبة', 'Dues in writing'), d: tx('أي متأخرات بتظهر في الإعلان', 'Any overdues shown on the listing') },
    { icon: UserCheck, t: tx('ملّاك بس', 'Owners only'), d: tx('بنتعامل مع صاحب الوحدة، مش سماسرة', 'We deal with owners, not brokers') },
    { icon: Percent, t: tx(`المشتري ${BRAND.buyerFeePercent}% بس`, `Buyers pay ${BRAND.buyerFeePercent}% only`), d: tx('وبعد توقيع التنازل. البايع صفر.', 'After signing. Sellers pay nothing.') },
  ];
  return (
    <section className="page-wrap py-14 sm:py-20">
      <SectionTitle center title={tx('فلوسك في أمان', 'Your money stays safe')} sub={tx('قواعد ثابتة على كل تنازل، بتحمي البايع والمشتري', 'Fixed rules on every transfer, protecting both sides')} />
      <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {rules.map((r) => (
          <div key={r.t} className="card p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <span className="grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-soft text-ink shrink-0">
              <r.icon className="w-5 h-5" />
            </span>
            <div>
              <p className="font-bold text-ink text-[15px] sm:text-base leading-snug">{r.t}</p>
              <p className="hidden sm:block mt-0.5 text-sm text-muted">{r.d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-3">
        <button onClick={() => onOpenRules('seller')} className="btn-ghost px-3 text-sm sm:text-[15px]">
          <ScrollText className="w-5 h-5 text-brand" />
          {tx('قواعد البايع', 'Seller rules')}
        </button>
        <button onClick={() => onOpenRules('buyer')} className="btn-ghost px-3 text-sm sm:text-[15px]">
          <ScrollText className="w-5 h-5 text-brand" />
          {tx('قواعد المشتري', 'Buyer rules')}
        </button>
      </div>
      <a href="#verify" className="mt-6 mx-auto flex max-w-xl items-center gap-3 rounded-xl border border-line bg-surface p-4 hover:border-brand transition-colors">
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand text-white shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </span>
        <span className="flex-1">
          <span className="block font-bold text-ink">{tx('حد بعتلك وحدة باسمنا؟ اتأكد منها', 'Sent a unit in our name? Verify it')}</span>
          <span className="block text-sm text-muted">{tx('اكتب الكود اللي عليها وشوف إنها عندنا فعلاً', 'Enter its code and see it is really ours')}</span>
        </span>
      </a>
    </section>
  );
};

const Faq: React.FC = () => {
  const { tx } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { q: tx('يعني إيه أشتري بسعر العقد القديم؟', 'What does buying at the old contract price mean?'), a: tx('بتدفع للبايع اللي هو دفعه للمطور بالظبط، وتكمّل باقي الأقساط بنفس جدول العقد. من غير أي أوفر.', 'You pay the seller exactly what they paid the developer and continue the remaining instalments on the original schedule. No overprice.') },
    { q: tx('عليا أقساط متأخرة وغرامات، ينفع أبيع؟', "I'm behind and have fines — can I still sell?"), a: tx('أيوه. بنكتب المتأخرات في الإعلان بصراحة، وبتتخصم من فلوسك يوم التنازل والمشتري يسددها للمطور. مش محتاج تدفع حاجة قبلها.', 'Yes. We list the arrears openly; they come out of your payout on transfer day and the buyer settles them with the developer. Nothing to pay before.') },
    { q: tx('هسترد فلوسي كلها فعلاً؟', 'Do I really get all my money back?'), a: tx('أيوه. المشتري بيدفعلك كل اللي دفعته للمطور، من غير خصم ومن غير عمولة عليك.', 'Yes. The buyer pays you everything you paid the developer — no deductions, no fee for you.') },
    { q: tx('لو الأحسن إني أكمّل أقساطي، هتقولولي؟', "If I'm better off keeping my unit, will you say so?"), a: tx('أيوه. كشف الحساب بيقارن كل الاختيارات، ولو الاستمرار أحسن ليك هنقولك ده، ومن غير أي التزام.', 'Yes. The statement compares every option; if keeping it is better for you, we will tell you — no commitment.') },
    { q: tx('حد هيعرف إني ببيع وحدتي؟', 'Will people know I’m selling?'), a: tx('اسمك ورقمك مش بيظهروا في أي مكان. الإعلان فيه بيانات الوحدة بس، وأي مشتري بيكلمنا احنا الأول.', 'Your name and number never appear anywhere. The listing shows the unit only, and buyers contact us first.') },
    { q: tx('إزاي التبديل بيشتغل؟', 'How does a swap work?'), a: tx('بتختار أي وحدة على الموقع. إحنا بنبيع وحدتك باللي دفعته، وبنشتريلك الجديدة، ونرتّب التنازلين مع بعض. إنت بتدفع أو بتاخد الفرق بس.', "Pick any listed unit. We sell yours at what you paid, buy the new one for you, and arrange both transfers together. You just pay or receive the difference.") },
    { q: tx('إيه اللي يضمن حقي؟', 'How am I protected?'), a: tx('التنازل بيتم رسمي في مقر المطور، والفلوس بشيك مصرفي، ومفيش أي فلوس بتتدفع قبلها.', 'Transfer is signed at the developer, paid by bank cheque, and no money changes hands before.') },
  ];
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <SectionTitle center title={tx('أسئلة بتتسأل كتير', 'Common questions')} />
      <div className="mt-8 space-y-3">
        {items.map((it, i) => (
          <div key={it.q} className="card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between gap-4 p-5 text-start font-semibold text-ink"
            >
              {it.q}
              <ChevronDown className={`w-5 h-5 shrink-0 text-muted transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="px-5 pb-5 -mt-1 text-ink-soft leading-relaxed">{it.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};
