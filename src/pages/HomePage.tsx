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
  Search,
  KeyRound,
  MapPin,
} from 'lucide-react';
import { Filters, SortKey } from '../lib/unitFilters';
import { PageId, RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';
import { withBrand } from '../components/BrandWord';
import { HomeRole, RoleSwitch } from '../components/RoleSwitch';
import { IlloForm, IlloKeys, IlloPeople, IlloReview } from '../components/Illustrations';
import { useAnimatedNumber } from '../lib/useAnimatedNumber';
import { BRAND, whatsappLink } from '../config/brand';
import { Budget, BudgetFinder, fitsBudget } from '../components/BudgetFinder';
import { PROPERTY_TYPES, PROPERTY_CATEGORIES, TYPES_BY_CATEGORY, categoryOf, REGIONS, SUB_AREAS, subAreasFor, CANCELLATION_PENALTY_MIN_RATE, cancellationLoss, cashPrice, currency, isDeal, money, sellerDiscount } from '../lib/unitHelpers';

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
  /** Buyer, seller or swapper — picked in the header; the whole page follows it. */
  role: HomeRole;
  onRoleChange: (r: HomeRole) => void;
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
        className="inline-flex items-center rounded-full px-4 py-1.5 text-sm sm:text-base font-bold mb-3 bg-accent text-white"
      >
        {withBrand(kicker, 'onAccent')}
      </p>
    )}
    <h2 className={`text-2xl sm:text-[2rem] font-bold leading-tight ${light ? 'text-white' : 'text-brand'}`}>{withBrand(title, light ? 'onDark' : 'color')}</h2>
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

/* قايمة فلتر واحدة. الخيارات اللي مفيهاش وحدات بتفضل ظاهرة بس مقفولة ومكتوب جنبها not available. */
const FilterSelect: React.FC<{
  label: string;
  allLabel: string;
  allCount: number;
  value: string;
  onPick: (v: string) => void;
  options: { value: string; label: string; count: number }[];
}> = ({ label, allLabel, allCount, value, onPick, options }) => {
  if (options.length === 0) return null;
  return (
    <label className="block">
      <span className="block mb-1.5 text-sm font-semibold text-muted">{label}</span>
      <select value={value} onChange={(e) => onPick(e.target.value)} className="field h-12 w-full">
        <option value="">
          {allLabel} ({allCount})
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.count === 0}>
            {o.count > 0 ? `${o.label} (${o.count})` : `${o.label} — not available`}
          </option>
        ))}
      </select>
    </label>
  );
};

/* صف فلتر واحد: عنوانه، وخيار "الكل"، وباقي الخيارات وكل واحد وعدده. */
const ChipRow: React.FC<{
  label: string;
  allLabel: string;
  allCount: number;
  value: string;
  onPick: (v: string) => void;
  options: { value: string; label: string; count: number }[];
}> = ({ label, allLabel, allCount, value, onPick, options }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-sm font-semibold text-muted w-20 shrink-0">{label}</span>
    <button type="button" onClick={() => onPick('')} aria-pressed={value === ''} className={value === '' ? 'chip chip-on' : 'chip chip-off'}>
      {allLabel}
      <span className="num text-xs opacity-70">{allCount}</span>
    </button>
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onPick(o.value)}
        aria-pressed={value === o.value}
        className={value === o.value ? 'chip chip-on' : 'chip chip-off'}
      >
        {o.label}
        <span className="num text-xs opacity-70">{o.count}</span>
      </button>
    ))}
  </div>
);

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
  role,
  onRoleChange,
}) => {
  const { language, tx, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const matching = useMemo(() => units.filter((u) => fitsBudget(u, budget)), [units, budget]);
  // Show what fits the budget above; fall back to the newest units so the row is never empty.
  const featured = useMemo(
    () => [...(matching.length > 0 ? matching : units)].sort((a, b) => sellerDiscount(b) - sellerDiscount(a)),
    [matching, units],
  );
  // Biggest seller discounts first.
  const deals = useMemo(() => units.filter(isDeal).sort((a, b) => sellerDiscount(b) - sellerDiscount(a)), [units]);

  // فلاتر فوق الكروت. كل قايمة بتتبني من الوحدات اللي فاضلة بعد الفلاتر اللي قبلها،
  // فأي خيار بتشوفه قدامك مضمون إنه هيرجّع نتيجة.
  const [cardRegion, setCardRegion] = useState('');
  const [cardSubArea, setCardSubArea] = useState('');
  const [cardCategory, setCardCategory] = useState('');
  const [cardType, setCardType] = useState('');

  /** بيعدّ وحدات كل خيار ويرجّع القايمة كاملة بالترتيب الرسمي — حتى الخيارات اللي عدادها صفر،
      عشان الزباين تشوف إيه اللي إحنا بنغطيه حتى لو مفيش وحدة متاحة دلوقتي. */
  type Opt = { ar: string; en: string };
  const tally = (list: RealEstateUnit[], key: (u: RealEstateUnit) => string | undefined, order: readonly Opt[]) => {
    const counts = new Map<string, number>();
    list.forEach((u) => {
      const k = key(u);
      if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
    });
    return order.map((o) => ({ o, count: counts.get(o.ar) ?? 0 }));
  };

  const regionsShown = useMemo(() => tally(featured, (u) => u.region, REGIONS), [featured]);

  const afterRegion = useMemo(
    () => (cardRegion ? featured.filter((u) => u.region === cardRegion) : featured),
    [featured, cardRegion],
  );
  // من غير اختيار إقليم بنعرض المناطق الموجودة في المعروض كله — لما كل الوحدات
  // في إقليم واحد، الفلتر المفيد هو التفصيلي مش الإقليم.
  const subAreasShown = useMemo(
    () => tally(afterRegion, (u) => u.subArea, cardRegion ? SUB_AREAS[cardRegion as keyof typeof SUB_AREAS] ?? [] : subAreasFor([])),
    [afterRegion, cardRegion],
  );

  const afterSubArea = useMemo(
    () => (cardSubArea ? afterRegion.filter((u) => u.subArea === cardSubArea) : afterRegion),
    [afterRegion, cardSubArea],
  );
  const categoriesShown = useMemo(
    () => tally(afterSubArea, (u) => categoryOf(u), PROPERTY_CATEGORIES),
    [afterSubArea],
  );

  const afterCategory = useMemo(
    () => (cardCategory ? afterSubArea.filter((u) => categoryOf(u) === cardCategory) : afterSubArea),
    [afterSubArea, cardCategory],
  );
  const typesShown = useMemo(
    () => tally(afterCategory, (u) => u.propertyType, cardCategory ? TYPES_BY_CATEGORY[cardCategory as keyof typeof TYPES_BY_CATEGORY] ?? [] : PROPERTY_TYPES),
    [afterCategory, cardCategory],
  );

  const shownCards = useMemo(
    () => (cardType ? afterCategory.filter((u) => u.propertyType === cardType) : afterCategory).slice(0, 6),
    [afterCategory, cardType],
  );

  // اختيار إقليم جديد بيلغي اللي اتختار جواه، عشان مايفضلش فلتر شغال على حاجة مش ظاهرة
  const pickRegion = (r: string) => {
    setCardRegion(r);
    setCardSubArea('');
    setCardCategory('');
    setCardType('');
  };

  const swapUnits = useMemo(() => units.filter((u) => u.eligibleForSwap).slice(0, 6), [units]);

  const HEROES: Record<HomeRole, { badge: string; line1: string; line2: string; lead: string; body: string; points: string[]; cards: { icon: React.ElementType; t: string; d: string }[] }> = {
    buy: {
      badge: tx('تنازل رسمي في مقر المطور · من غير أوفر', 'Official transfer at the developer · no overprice'),
      line1: tx('اشتري بسعر يوم التعاقد،', 'Buy at the original contract price,'),
      line2: tx('أرخص من سعر السوق.', 'below today’s market.'),
      lead: tx('بتدوّر على وحدة؟', 'Looking for a unit?'),
      body: tx(
        'اشتري بسعر يوم التعاقد — أرخص من سعر السوق — وكمّل نفس الأقساط. كل الأرقام متحققة من العقد والإيصالات، وإحنا معاك في إجراءات التنازل خطوة بخطوة.',
        'Buy at the original contract price — below market — and continue the same instalments. Every number is checked against the contract and receipts, and we walk you through the transfer step by step.',
      ),
      points: [
        tx('كل وحدة متراجعة على العقد وإيصالات الدفع قبل ما تتنشر', 'Every unit is checked against its contract and payment receipts before listing'),
        tx('بتشوف المطلوب كاش والقسط والمتبقي قبل ما تكلّم حد', 'See the cash needed, monthly and balance before talking to anyone'),
        tx('احجز الوحدة من صفحتها، وإحنا نكمّل مع صاحبها', 'Book the unit from its page — we take it from there with the owner'),
        tx('العمولة بتتدفع بس لما التنازل يتم في مقر المطور', 'The fee is paid only once the transfer completes at the developer'),
      ],
      cards: [
        { icon: Wallet, t: tx('بسعر زمان', 'At the old price'), d: tx('أرخص من سعر المطور النهارده', 'Below the developer’s price today') },
        { icon: ShieldCheck, t: tx('ورق متراجع', 'Papers checked'), d: tx('العقد والمديونية متأكدين', 'Contract and dues verified') },
        { icon: UserCheck, t: tx('من المالك على طول', 'Straight from the owner'), d: tx('من غير سماسرة ولا أوفر', 'No brokers, no overprice') },
      ],
    },
    sell: {
      badge: tx('تنازل رسمي في مقر المطور · من غير عمولة عليك', 'Official transfer at the developer · no fee for you'),
      line1: tx('البايع ياخد كل اللي دفعه،', 'Sellers get back everything they paid,'),
      line2: tx('من غير عمولة عليه.', 'with no fee.'),
      lead: tx('لو مش قادر تكمّل أقساطك:', "Can't keep up with the instalments?"),
      body: tx(
        'بيع وحدتك من غير أوفر واسترجع فلوسك كاش، بدل ما تخاطر بخسارة توصل لـ 10–15% من سعر الوحدة كلها في الإلغاء حسب عقدك.',
        'Sell your unit with no overprice and get your money back in cash, instead of risking a loss of 10–15% of the whole contract price on cancellation, depending on your contract.',
      ),
      points: [
        tx('بتبعت بيانات وحدتك في دقيقة، وكشف الحساب مجاني', 'Send your unit details in a minute — the statement is free'),
        tx('اسمك ورقمك مش بيظهروا لأي حد — المشتري بيكلّمنا إحنا', 'Your name and number never appear — buyers talk to us'),
        tx('المتأخرات بتتخصم يوم التنازل — مش لازم تسددها الأول', 'Arrears come off on transfer day — no need to clear them first'),
        tx('بتقبض بشيك مصرفي في مقر المطور، ولو تكمّل عقدك أحسن ليك هنقولك بصراحة', 'Paid by bank cheque at the developer — and if keeping your contract is better, we’ll say so'),
      ],
      cards: [
        { icon: ShieldCheck, t: tx('ما تلغيش وتخسر', "Don't cancel & lose"), d: tx('بنبيع وحدتك بالسعر اللي دفعته', 'Sold for what you paid') },
        { icon: Receipt, t: tx('عليك متأخرات؟', 'Have arrears?'), d: tx('بتتخصم عادي يوم التنازل', 'Deducted on transfer day') },
        { icon: EyeOff, t: tx('سرية وأمان', '100% Confidential'), d: tx('محدش هيعرف إنك بتبيع', 'No one knows you sell') },
      ],
    },
    swap: {
      badge: tx('تبديل رسمي في مقر المطور · بموافقة الطرفين', 'Official swap at the developer · both owners agree'),
      line1: tx('بدّل وحدتك', 'Swap your unit'),
      line2: tx('بوحدة تناسبك أكتر.', 'for one that fits you better.'),
      lead: tx('عايز وحدة غير اللي معاك؟', 'Want a different unit?'),
      body: tx(
        'اختار وحدة صاحبها عايز يبدّل، وشوف الفرق والقسط الجديد قبل ما تقرر. بناخد موافقة الطرف التاني ونراجع العقدين، وتبدلوا في نفس اليوم — واللي وحدته أغلى ياخد الفرق.',
        'Pick a unit whose owner wants to swap and see the difference and new monthly before you decide. We get the other owner’s OK and check both contracts, and you swap the same day — the pricier side gets the difference.',
      ),
      points: [
        tx('قولنا وحدتك وعاوز إيه: المنطقة والنوع والقسط اللي يريحك', 'Tell us your unit and what you want: area, type and a comfortable monthly'),
        tx('بنوريك الفرق في المدفوع والقسط الجديد قبل ما تقرر', 'See the difference in what was paid and the new monthly before deciding'),
        tx('مفيش بدل غير بموافقة المالكين الاتنين، وبنراجع العقدين', 'No swap without both owners agreeing — and both contracts checked'),
        tx('التنازلين بيتموا في نفس اليوم، وكل واحد يكمّل أقساط اللي خده', 'Both transfers happen the same day; each carries on the plan they took'),
      ],
      cards: [
        { icon: ArrowLeftRight, t: tx('تبديل حقيقي', 'A real swap'), d: tx('بين مالكين موافقين', 'Between two willing owners') },
        { icon: ShieldCheck, t: tx('العقدين متراجعين', 'Both contracts checked'), d: tx('قبل ما حد يمضي', 'Before anyone signs') },
        { icon: Handshake, t: tx('في نفس اليوم', 'Same day'), d: tx('في مقر المطور', 'At the developer') },
      ],
    },
  };
  const hero = HEROES[role];

  return (
    <div>
      {/* ───────── Who are you? A navy bar under the header, joined to the hero; stays while scrolling and the whole page follows it ───────── */}
      <div className="sticky top-24 sm:top-28 z-30 bg-brand-ink shadow-md">
        <div className="page-wrap py-2 flex justify-center">
          <RoleSwitch role={role} onChange={onRoleChange} />
        </div>
      </div>

      {/* ───────── 1. Hero — one message, for the owner who's behind ───────── */}
      <section className="relative overflow-hidden bg-brand-ink text-white">
        {/* A real home behind the message; two washes keep the words readable over any photo. */}
        <img src={BRAND.heroImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 via-brand-ink/10 to-transparent" />

        {/* Short band like a search site: title and one line at the bottom, the search card overlapping it. */}
        {/* The text panel runs wider than the search card under it (92% of the screen on desktop). */}
        <div className={`relative w-full mx-auto px-4 sm:px-6 lg:px-0 lg:w-[92%] max-w-[120rem] min-h-[23rem] sm:min-h-[25rem] lg:min-h-[27rem] flex flex-col justify-end pt-10 pb-24 sm:pb-36`}>
          {/* لوح غامق ورا الكلام: بيضمن إن النص يفضل مقروء مهما كانت صورة الخلفية */}
          <div className="w-full rounded-3xl bg-brand-ink/70 backdrop-blur-[2px] border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl">
            <p className="hero-in inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-lg font-bold text-white">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-accent-light" />
              {hero.badge}
            </p>
            <h1 style={{ animationDelay: '80ms' }} className="hero-in mt-4 text-[2.4rem] sm:text-5xl lg:text-6xl font-extrabold leading-[1.22] text-white [text-shadow:0_2px_16px_rgb(0_0_0/0.55)]">
              <span className="text-white">{hero.line1}</span>
              <br className="sm:hidden" />{' '}
              <span className="text-accent-light">
                <span className="relative inline-block">
                  {hero.line2}
                  <svg aria-hidden="true" viewBox="0 0 200 20" preserveAspectRatio="none" className="underline-draw absolute -bottom-2 inset-x-0 w-full h-3 sm:h-4">
                    <path d="M4 14C40 6 90 4 130 7s56 6 66 4" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>
            <p style={{ animationDelay: '140ms' }} className="hero-in mt-6 max-w-4xl text-xl sm:text-2xl text-white/95 leading-[1.8] [text-shadow:0_2px_12px_rgb(0_0_0/0.6)]">
              <span className="font-bold text-accent-light">{hero.lead} </span>
              {hero.body}
            </p>
            {/* The details people ask about next, one line each */}
            <ul style={{ animationDelay: '180ms' }} className="hero-in mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3 [text-shadow:0_2px_12px_rgb(0_0_0/0.6)]">
              {hero.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-lg sm:text-xl text-white/95 leading-relaxed">
                  <span className="mt-1.5 grid place-items-center w-6 h-6 rounded-full bg-accent shrink-0">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div style={{ animationDelay: '220ms' }} className="hero-in mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
              {hero.cards.map((c) => (
                <div key={c.t} className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md p-4 sm:p-5 transition shadow-sm">
                  <div className="w-14 h-14 rounded-xl bg-accent-light/20 border border-accent-light/30 flex items-center justify-center shrink-0 text-accent-light">
                    <c.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="block text-lg sm:text-xl font-extrabold text-white leading-tight">{c.t}</span>
                    <span className="block text-[15px] sm:text-[17px] text-white/90 font-medium leading-snug mt-1">{c.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── The search card (buyers) or the one next step (sellers, swappers) ───────── */}
      <HeroSearch mode={role} onSearch={onSearch} onNavigate={onNavigate} />

      {role === 'sell' && (
        <>
      {/* ───────── 1b'. For the owner who's behind: the promises and the two ways to start ───────── */}
      <section className={`${WIDE} pt-5`}>
        <div className="rounded-3xl border border-line bg-surface shadow-sm p-4 sm:p-6">
          {/* Top Row: 3 Trust Guarantees with ample horizontal room */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: Receipt,
                t: tx('عليك متأخرات؟', 'Behind on dues?'),
                d: tx('بتتخصم تلقائياً يوم التنازل', 'Deducted directly on transfer day'),
                color: 'text-accent bg-accent-soft',
              },
              {
                icon: EyeOff,
                t: tx('سرية تامة 100%', '100% Confidential'),
                d: tx('اسمك ورقمك وبياناتك مش بيتنشروا', 'Name and number never published'),
                color: 'text-brand bg-brand/10',
              },
              {
                icon: Wallet,
                t: tx('صفر عمولة على البايع', 'Zero fee for sellers'),
                d: tx('استلم كاش بشيك مصرفي معتمد', 'Receive cash via bank cheque'),
                color: 'text-emerald-600 bg-emerald-500/10',
              },
            ].map((x) => (
              <div
                key={x.t}
                className="flex items-center gap-3.5 rounded-2xl border border-line bg-paper/60 p-3.5 sm:p-4 transition-all hover:bg-paper shadow-xs"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${x.color}`}>
                  <x.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-sm sm:text-base font-extrabold text-ink leading-snug">
                    {x.t}
                  </span>
                  <span className="block text-xs sm:text-sm text-ink-soft leading-snug mt-0.5">
                    {x.d}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row / Action Bar: Buttons + Hotline Notice */}
          <div className="mt-4 pt-4 border-t border-line/70 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('sell')}
                className="btn-accent min-h-11 px-5 text-sm font-bold shadow-xs"
              >
                <Tag className="w-4 h-4" />
                <span>{tx('اعرض وحدتك', 'List your unit')}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('statement')}
                className="btn-ghost min-h-11 px-4 text-sm font-bold border border-line hover:border-brand"
              >
                <ClipboardCheck className="w-4 h-4 text-brand" />
                <span>{tx('كشف حساب مجاني', 'Free statement')}</span>
              </button>
            </div>

            {/* Hotline Emergency Alert Pill */}
            <div className="inline-flex items-center gap-2 rounded-2xl bg-brand-soft/60 border border-brand/20 px-3.5 py-2 text-xs sm:text-sm self-start md:self-auto">
              <span className="text-ink font-medium">
                {tx('جالك إنذار من المطور؟', 'Got a warning from developer?')}
              </span>
              <a
                href={`tel:${BRAND.hotline}`}
                className="inline-flex items-center gap-1.5 font-extrabold text-brand hover:underline"
              >
                <Headset className="w-4 h-4 shrink-0 text-brand" />
                <span>{tx(`كلّمنا ${BRAND.hotline}`, `Call ${BRAND.hotline}`)}</span>
              </a>
              <span className="text-muted text-[11px] sm:text-xs">
                {tx('قبل الإلغاء', 'before cancellation')}
              </span>
            </div>
          </div>
        </div>
      </section>

        </>
      )}

      <div className="mt-10 sm:mt-12">
        <HowItWorks tab={role} />
      </div>

      {role === 'buy' && (
        <>
      {/* ───────── 1c. Areas, as photos ───────── */}
      <RegionsRow units={units} onPick={(r) => onSearch({ filters: { regions: [r] } })} />

      {/* ───────── 2. Buyers — one strip, not a second hero ───────── */}
      <section className="page-wrap -mt-px pt-8 sm:pt-10">
        <div className="card p-5 sm:p-7 grid lg:grid-cols-[16rem_1fr_15rem] gap-6 lg:gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-muted">{tx('بتدوّر على وحدة؟', 'Looking for a unit?')}</p>
            <p className="font-display mt-1 text-2xl font-bold text-ink leading-snug">{tx('اختار القسط بسعر زمان', 'Pick your monthly, at old prices')}</p>
          </div>
          <BudgetFinder budget={budget} onChange={onBudgetChange} />
          <div>
            <p className="text-sm text-ink-soft">
              {matching.length > 0 ? (
                <>
                  <span className="num font-display text-2xl font-bold text-ink">{matching.length}</span> {tx('عرض متتفوتش', "offers you shouldn't miss")}
                </>
              ) : (
                tx('زوّد الميزانية شوية', 'Try a higher budget')
              )}
            </p>
            <button onClick={onBrowseWithBudget} className="btn-primary w-full mt-3 min-h-14 text-lg">
              {tx('عرض الوحدات', 'Show units')}
              <Arrow className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────── 3. Units first — the owner wants to see real units before any pitch ───────── */}
      <section>
        <div className="page-wrap py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <SectionTitle
              title={matching.length > 0 ? tx('عروض متتفوتش', "Offers you shouldn't miss") : tx('وحدات بسعر زمان', 'Units at old prices')}
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

          {/* فلاتر الكروت — قوايم منسدلة عشان ما تاخدش نص الشاشة.
              كل قايمة بتتبني من اللي فاضل بعد اللي قبلها، فأي خيار فيها مضمون يرجّع نتيجة. */}
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <FilterSelect
              label={tx('المنطقة', 'Area')}
              allLabel={tx('كل المناطق', 'All areas')}
              allCount={featured.length}
              value={cardRegion}
              onPick={pickRegion}
              options={regionsShown.map((x) => ({ value: x.o.ar, label: language === 'ar' ? x.o.ar : x.o.en, count: x.count }))}
            />
            <FilterSelect
              label={tx('الموقع', 'Location')}
              allLabel={tx('كلها', 'All')}
              allCount={afterRegion.length}
              value={cardSubArea}
              onPick={(v) => {
                setCardSubArea(v);
                setCardType('');
              }}
              options={subAreasShown.map((x) => ({ value: x.o.ar, label: language === 'ar' ? x.o.ar : x.o.en, count: x.count }))}
            />
            <FilterSelect
              label={tx('الأنشطة', 'Activity')}
              allLabel={tx('كل الأنشطة', 'All activities')}
              allCount={afterSubArea.length}
              value={cardCategory}
              onPick={(v) => {
                setCardCategory(v);
                setCardType('');
              }}
              options={categoriesShown.map((x) => ({ value: x.o.ar, label: language === 'ar' ? x.o.ar : x.o.en, count: x.count }))}
            />
            <FilterSelect
              label={tx('نوع الوحده', 'Type')}
              allLabel={tx('كل أنواع الوحدات', 'All unit types')}
              allCount={afterCategory.length}
              value={cardType}
              onPick={setCardType}
              options={typesShown.map((x) => ({ value: x.o.ar, label: language === 'ar' ? x.o.ar : x.o.en, count: x.count }))}
            />
          </div>

          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar items-stretch">
            {shownCards.map((u, i) => (
              <div key={u.id} className={`w-[82%] shrink-0 snap-start sm:w-auto h-full ${i >= 3 ? 'sm:hidden' : ''}`}>
                <UnitCard unit={u} onOpen={onSelectUnit} fitsBudget={matching.length > 0} />
              </div>
            ))}
          </div>
          <button onClick={onBrowseWithBudget} className="btn-ghost w-full mt-6 sm:hidden">
            {tx('شوف كل الوحدات', 'See all units')}
          </button>
        </div>
      </section>

        </>
      )}

      {role === 'sell' && (
        <>
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
            <button onClick={() => onNavigate('sell')} className="btn-accent rounded-full mt-6">
              <Tag className="w-5 h-5" />
              {tx('اعرض وحدتك', 'List your unit')}
            </button>
          </div>
          <HeroCalculator />
        </div>
      </section>

          <SellerPromises onStatement={() => onNavigate('statement')} />
          <ThreeWays onSell={() => onNavigate('sell')} />
        </>
      )}

      {role === 'swap' && (
        <>
          <SwapFeature onSwap={() => onNavigate('swap')} />
      {/* ───────── Swap: units whose owners want to swap ───────── */}
      <section>
        <div className="page-wrap py-14 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <SectionTitle
              title={tx('وحدات أصحابها عايزين يبدّلوا', 'Units whose owners want to swap')}
              sub={tx('اختار واحدة، وشوف الفرق والقسط الجديد قبل ما تقرر', 'Pick one and see the difference and new monthly first')}
            />
            <button onClick={() => onNavigate('swap')} className="hidden sm:inline-flex items-center gap-1.5 text-brand font-semibold hover:underline whitespace-nowrap min-h-11">
              {tx('شوف الكل', 'See all')}
              <Arrow className="w-4 h-4" />
            </button>
          </div>
          {swapUnits.length > 0 ? (
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar items-stretch">
              {swapUnits.map((u) => (
                <div key={u.id} className="w-[82%] shrink-0 snap-start sm:w-auto h-full">
                  <UnitCard unit={u} onOpen={onSelectUnit} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-ink-soft">
              {tx('لسه مفيش وحدات معروضة للبدل — اعرض وحدتك وعلّم على "أقبل أبدّلها" وهنوصلك بأول حد مناسب.', 'No units open to swap yet — list yours, tick "open to swap", and we\'ll match you first.')}
            </div>
          )}
          <button onClick={() => onNavigate('swap')} className="btn-primary w-full sm:w-auto mt-6 min-h-13 px-8">
            <Repeat className="w-5 h-5" />
            {tx('ابدأ البدل', 'Start a swap')}
          </button>
        </div>
      </section>

        </>
      )}

      <RulesPreview onOpenRules={onOpenRules} />
      <Faq />

      {role === 'buy' && (
      <section className="page-wrap py-16">
        <div className="relative overflow-hidden rounded-card bg-brand-ink text-white p-7 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <img src={BRAND.keysImage} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-brand-ink/95 via-brand-ink/80 to-brand-ink/50" />
          <div className="relative max-w-xl">
            <p className="font-display text-2xl sm:text-3xl font-bold">{tx('لقيت وحدة عاجباك؟', 'Found one you like?')}</p>
            <p className="mt-2 text-white/80">{tx('احجزها من صفحتها، والورق متراجع قبل ما تدفع حاجة.', 'Book it from its page — the papers are checked before you pay anything.')}</p>
          </div>
          <button onClick={() => onBrowseWithBudget()} className="relative btn bg-white text-brand hover:bg-brand-soft min-h-13 px-6">
            <Search className="w-5 h-5" />
            {tx('شوف كل الفرص', 'See all offers')}
          </button>
        </div>
      </section>
      )}
      {role === 'swap' && (
      <section className="page-wrap py-16">
        <div className="relative overflow-hidden rounded-card bg-brand-ink text-white p-7 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <img src={BRAND.keysImage} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-brand-ink/95 via-brand-ink/80 to-brand-ink/50" />
          <div className="relative max-w-xl">
            <p className="font-display text-2xl sm:text-3xl font-bold">{tx('وحدتك مش مناسبة ليك؟', 'Your unit no longer fits?')}</p>
            <p className="mt-2 text-white/80">{tx('قولنا وحدتك وعاوز إيه، وإحنا ندوّرلك على اللي يبدّل معاك.', 'Tell us your unit and what you want — we find someone to swap with.')}</p>
          </div>
          <button onClick={() => onNavigate('swap')} className="relative btn bg-white text-brand hover:bg-brand-soft min-h-13 px-6">
            <Repeat className="w-5 h-5" />
            {tx('ابدأ البدل', 'Start a swap')}
          </button>
        </div>
      </section>
      )}
      {role === 'sell' && (
        <>
      {/* ───────── 9. One closing call ───────── */}
      <section className="page-wrap py-16">
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
        </>
      )}
    </div>
  );
};

/* Buy · sell · swap in one card that sits over the bottom of the hero band. */
const HeroSearch: React.FC<{ mode: HomeRole; onSearch: (s: HomeSearch) => void; onNavigate: (page: PageId) => void }> = ({ mode, onSearch, onNavigate }) => {
  const { language, tx } = useLanguage();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [subArea, setSubArea] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [monthly, setMonthly] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = Number(monthly.replace(/\D/g, ''));
    const filters: Partial<Filters> = {};
    if (query.trim()) filters.query = query.trim();
    if (region) filters.regions = [region];
    if (subArea) filters.subAreas = [subArea];
    if (category) filters.categories = [category];
    if (type) filters.types = [type];
    onSearch({ filters, monthly: m > 0 ? m : undefined });
  };

  const quick: { icon: React.ElementType; label: string; s: HomeSearch }[] = [
    { icon: Flame, label: tx('فرص مميزة', 'Top deals'), s: { filters: { discounted: true }, sort: 'deals' } },
    { icon: KeyRound, label: tx('استلام فوري', 'Ready now'), s: { filters: { delivery: ['استلام فوري'] } } },
    { icon: Wallet, label: tx('أقل قسط', 'Low monthly'), s: { sort: 'monthly' } },
  ];

  return (
    <section className={`relative -mt-16 sm:-mt-28 ${WIDE}`}>
      <div className="card shadow-lift overflow-hidden">
        <div className="p-4 sm:p-8 sm:pt-6">
          {mode === 'buy' && (
            <form onSubmit={submit} className="grid gap-3">
              <label className="relative block">
                <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-muted pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tx('ابحث باسم الكمبوند أو المطور', 'Search by compound or developer name')}
                  aria-label={tx('بحث', 'Search')}
                  className="field h-14 ps-12 text-base"
                />
              </label>
              {/* Area and unit type each open a second list once chosen, so the row has 4, 5 or 6 cells. */}
              <div
                className={`grid grid-cols-2 gap-3 ${
                  region && category
                    ? 'lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_9rem]'
                    : region || category
                      ? 'lg:grid-cols-[1fr_1fr_1fr_1fr_10rem]'
                      : 'lg:grid-cols-[1fr_1fr_1fr_12rem]'
                }`}
              >
                <select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setSubArea(''); // الإقليم اتغير، فاللي كان متختار جواه مابقاش صالح
                  }}
                  aria-label={tx('المنطقة', 'Area')}
                  className="field h-14"
                >
                  <option value="">{tx('كل المناطق', 'All areas')}</option>
                  {REGIONS.map((r) => (
                    <option key={r.ar} value={r.ar}>
                      {language === 'ar' ? r.ar : r.en}
                    </option>
                  ))}
                </select>
                {region && (
                  <select
                    value={subArea}
                    onChange={(e) => setSubArea(e.target.value)}
                    aria-label={tx('الموقع', 'Location')}
                    className="field h-14"
                  >
                    <option value="">{tx('كل مناطق ', 'All of ') + (language === 'ar' ? region : REGIONS.find((r) => r.ar === region)?.en ?? region)}</option>
                    {(SUB_AREAS[region as keyof typeof SUB_AREAS] ?? []).map((a) => (
                      <option key={a.ar} value={a.ar}>
                        {language === 'ar' ? a.ar : a.en}
                      </option>
                    ))}
                  </select>
                )}
                {/* التصنيف الأول، وقايمة الأنواع بتتفتح بعده — زي المنطقة بالظبط */}
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setType(''); // التصنيف اتغير، فالنوع القديم مابقاش تحته
                  }}
                  aria-label={tx('الأنشطة', 'Activity')}
                  className="field h-14"
                >
                  <option value="">{tx('كل الأنشطة', 'All activities')}</option>
                  {PROPERTY_CATEGORIES.map((c) => (
                    <option key={c.ar} value={c.ar}>
                      {language === 'ar' ? c.ar : c.en}
                    </option>
                  ))}
                </select>
                {category && (
                  <select value={type} onChange={(e) => setType(e.target.value)} aria-label={tx('نوع الوحدة', 'Unit type')} className="field h-14">
                    <option value="">{tx('كل أنواع ', 'All ') + category}</option>
                    {(TYPES_BY_CATEGORY[category as keyof typeof TYPES_BY_CATEGORY] ?? []).map((p) => (
                      <option key={p.ar} value={p.ar}>
                        {language === 'ar' ? p.ar : p.en}
                      </option>
                    ))}
                  </select>
                )}
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
                  {tx('أبحث', 'Search')}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-sm text-muted">{tx('بحث سريع:', 'Quick:')}</span>
                {quick.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => onSearch(q.s)}
                    className="chip font-semibold bg-accent border-accent text-white hover:bg-accent-ink hover:border-accent-ink"
                  >
                    <q.icon className="w-4 h-4 text-white" />
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
                    : tx('مع مالك تاني عايز وحدتك — واللي وحدته أغلى ياخد الفرق.', 'With another owner who wants yours — the pricier side gets the difference.')}
                </p>
              </div>
              <button onClick={() => onNavigate(mode === 'sell' ? 'sell' : 'swap')} className="btn-primary h-14 px-8 text-base shrink-0">
                {mode === 'sell' ? <Tag className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
                {mode === 'sell' ? tx('اعرض وحدتك', 'List your unit') : tx('ابدأ البدل', 'Start a swap')}
              </button>
            </div>
          )}
        </div>

        {/* Policies, not marketing numbers — every one of these is true from day one. */}
        <dl className="grid grid-cols-3 border-t border-line bg-sand-soft/60 backdrop-blur-md [&>div+div]:border-s [&>div+div]:border-line/70">
          {[
            { v: tx('صفر', 'Zero'), l: tx('عمولة على البايع', 'seller fee') },
            { v: tx('صفر', 'Zero'), l: tx('أوفر على المشتري', 'overprice') },
            { v: tx('شيك مصرفي', 'Bank cheque'), l: tx('في مقر المطور', 'at the developer') },
          ].map((x) => (
            <div key={x.l} className="px-2 py-3.5 flex flex-col sm:flex-row items-center justify-center gap-x-2 text-center">
              <dt className="sr-only">{x.l}</dt>
              <dd className="font-bold text-brand text-base sm:text-xl whitespace-nowrap">{x.v}</dd>
              <p className="text-sm sm:text-base text-ink">{x.l}</p>
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
  'قاهرة': ['قاهرة', 'Cairo'],
  'جيزة': ['جيزة', 'Giza'],
  'إسكندرية': ['إسكندرية', 'Alexandria'],
  'دلتا': ['دلتا', 'Delta'],
  'الصعيد': ['الصعيد', 'Upper Egypt'],
  'مدن القناة': ['مدن القناة', 'Canal cities'],
  'الساحل الشمالي': ['الساحل الشمالي', 'North Coast'],
  'العين السخنة': ['العين السخنة', 'Ain Sokhna'],
};

/* One photo per area that says "this place" at a glance (not a unit's interior). Stock photos — swap for real ones of each area. */
const areaPhoto = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=320&h=320&q=70`;
const AREA_PHOTOS: Record<string, string> = {
  'قاهرة': areaPhoto('1572252009286-268acec5ca0a'), // القاهرة القديمة بمآذنها
  'جيزة': areaPhoto('1600520611035-84157ad4084d'), // أهرامات الجيزة
  'إسكندرية': areaPhoto('1633624646814-3a61ed3e2847'), // قلعة قايتباي
  'دلتا': areaPhoto('1500382017468-9049fed747ef'), // أرض زراعية
  'الصعيد': areaPhoto('1738829235767-83963c09647c'), // بالونات الأقصر فوق الصحرا
  'مدن القناة': areaPhoto('1587634552378-199c247a85c5'), // كوبري على القناة
  'الساحل الشمالي': areaPhoto('1507525428034-b723cf961d3e'), // رمل أبيض وبحر
  'العين السخنة': areaPhoto('1519046904884-53103b34b206'), // نخل وشاطئ
};/*
 * Regions as a "where are the deals" overview — the search bar already filters by region, so this row adds what the
 * bar can't: how many units, the lowest cash to get in, and the biggest discount. A click opens that region's listings
 * (an empty one opens the "alert me" form). All regions stay in one row, in the fixed REGIONS order.
 */
const RegionsRow: React.FC<{ units: RealEstateUnit[]; onPick: (region: string) => void }> = ({ units, onPick }) => {
  const { language, tx } = useLanguage();
  const areas = useMemo(
    () =>
      REGIONS.map((r, i) => {
        const inRegion = units.filter((u) => u.region === r.ar);
        return {
          ...r,
          tint: AREA_TINTS[i % AREA_TINTS.length],
          photo: AREA_PHOTOS[r.ar],
          count: inRegion.length,
          minCash: inRegion.length ? Math.min(...inRegion.map(cashPrice)) : 0,
          maxDiscount: inRegion.reduce((m, u) => Math.max(m, sellerDiscount(u)), 0),
        };
      }),
    [units],
  );
  const name = (r: (typeof areas)[number]) => tx(AREA_SHORT[r.ar]?.[0] ?? r.ar, AREA_SHORT[r.ar]?.[1] ?? r.en);
  const unitsLabel = (n: number) =>
    tx(n === 1 ? 'وحدة واحدة' : n === 2 ? 'وحدتين' : `${n} ${n > 10 ? 'وحدة' : 'وحدات'}`, `${n} ${n === 1 ? 'unit' : 'units'}`);

  return (
    <section className="page-wrap pt-10 sm:pt-12">
      <h2 className="text-2xl sm:text-[2rem] font-bold text-brand">{tx('أقوى الـ Deals حسب المنطقة', 'Top deals by area')}</h2>
      <p className="mt-1 text-muted">{tx('دوس على المنطقة وشوف وحداتها', 'Tap a region to see its units')}</p>

      <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex lg:justify-between gap-5 sm:gap-7 overflow-x-auto no-scrollbar pb-1">
        {areas.map((r) => (
          <button
            key={r.ar}
            onClick={() => onPick(r.ar)}
            title={r.count ? undefined : tx('سيب رقمك ونبلّغك أول ما تنزل وحدة هنا', "Leave your number and we'll tell you when one is listed")}
            className="group flex flex-col items-center shrink-0 text-center"
          >
            <span className="relative">
              <span
                className={`block w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-transparent ring-offset-2 ring-offset-paper group-hover:ring-brand transition ${r.count ? '' : 'opacity-70 group-hover:opacity-100'}`}
                style={{ backgroundColor: r.tint }}
              >
                {r.photo ? (
                  <img src={r.photo} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-ink/25">
                    <MapPin className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.5} />
                  </span>
                )}
              </span>
              {r.count > 0 && (
                <span className="absolute -bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                  {unitsLabel(r.count)}
                </span>
              )}
            </span>
            <span className="mt-3 text-sm sm:text-base font-bold text-ink group-hover:text-brand">{name(r)}</span>
            {r.count > 0 ? (
              <>
                <span className="mt-0.5 text-xs sm:text-sm text-muted">
                  {tx('كاش من', 'Cash from')} <span className="num font-bold text-brand">{money(r.minCash, language)}</span>
                </span>
                {r.maxDiscount > 0 && (
                  <span className="text-xs text-muted">
                    {tx('خصم لحد', 'Up to')} <span className="num font-bold text-accent">{money(r.maxDiscount, language)}</span>
                    {language === 'en' && ' off'}
                  </span>
                )}
              </>
            ) : (
              <span className="mt-0.5 text-xs sm:text-sm text-muted">{tx('قريباً', 'Soon')}</span>
            )}
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
  // The developer deducts 10–15% of the contract, so the loss is a range.
  const lossMin = cancellationLoss(contract, safePaid, CANCELLATION_PENALTY_MIN_RATE);
  const loss = cancellationLoss(contract, safePaid);
  const cancelBackMin = safePaid - loss;
  const cancelBack = safePaid - lossMin;
  const pctOf = (n: number) => (safePaid ? Math.round((n / safePaid) * 100) : 0);
  const shownCancelMin = useAnimatedNumber(cancelBackMin);
  const shownCancel = useAnimatedNumber(cancelBack);
  const shownPaid = useAnimatedNumber(safePaid);
  const shownLossMin = useAnimatedNumber(lossMin);
  const shownLoss = useAnimatedNumber(loss);

  // Native share sheet on phones (WhatsApp is usually first); WhatsApp link elsewhere.
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    const text = tx(
      `وحدتي بـ ${money(contract, language)} ودفعت ${money(safePaid, language)}.\nلو لغيت مع المطور: ترجعلي من ${money(cancelBackMin, language)} لـ ${money(cancelBack, language)} على أقساط — يعني هخسر من ${money(lossMin, language)} لـ ${money(loss, language)}.\nلو بعتها عن طريق DEAL: هقبض ${money(safePaid, language)} كاش.\nإيه رأيك؟`,
      `My unit is ${money(contract, language)} and I've paid ${money(safePaid, language)}.\nCancelling returns ${money(cancelBackMin, language)}–${money(cancelBack, language)} over years — I'd lose ${money(lossMin, language)}–${money(loss, language)}.\nSelling through DEAL: ${money(safePaid, language)} cash.\nWhat do you think?`,
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
        <Slider label={tx('سعر الوحدة في العقد', 'Contract price')} value={contract} min={1_000_000} max={400_000_000} step={100_000} onChange={setContract} />
        <Slider label={tx('دفعت كام لحد دلوقتي؟', 'Paid so far')} value={safePaid} min={100_000} max={contract} step={50_000} onChange={setPaid} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-paper border border-line p-3.5">
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted">
            <TrendingDown className="w-4 h-4" />
            {tx('لو لغيت', 'If you cancel')}
          </p>
          <p className="num font-display mt-1.5 text-lg sm:text-xl font-bold text-muted line-through decoration-2">
            {money(shownCancelMin, language)} – {money(shownCancel, language)}
          </p>
          <p className="mt-1 text-xs text-muted">{tx('على أقساط لسنين', 'over years')}</p>
        </div>
        <div className="rounded-xl bg-brand text-white p-3.5">
          <p className="text-xs sm:text-sm text-white/70">{tx('لو بعت عن طريقنا', 'Sell through us')}</p>
          <p className="num font-display mt-1.5 text-xl sm:text-2xl font-bold">{money(shownPaid, language)}</p>
          <p className="mt-1 text-xs text-white/70">{tx('كاش يوم التنازل', 'cash on transfer day')}</p>
        </div>
      </div>
      {/* الرقم الكبير أول حاجة، وتحته من فين جه: الخصم نسبته من سعر العقد مش من اللي دفعته. */}
      <div className="mt-3 rounded-xl bg-danger-soft px-4 py-3.5 text-danger">
        <p className="text-xl sm:text-2xl font-extrabold leading-snug">
          {tx(
            `الإلغاء بيخسّرك من ${money(shownLossMin, language)} لـ ${money(shownLoss, language)}`,
            `Cancelling costs you ${money(shownLossMin, language)}–${money(shownLoss, language)}`,
          )}
        </p>
        <p className="mt-1.5 text-sm sm:text-base font-semibold leading-relaxed text-danger/90">
          {tx(
            `المطور بيخصم 10–15% من سعر العقد كله — يعني من ${pctOf(lossMin)}% لـ ${pctOf(loss)}% من اللي دفعته`,
            `The developer deducts 10–15% of the whole contract — that's ${pctOf(lossMin)}–${pctOf(loss)}% of what you paid`,
          )}
        </p>
      </div>
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

  /* A card per way out, not a grid of cells: you're choosing a path, not reading a spreadsheet.
     Same markup on phone and desktop — ours just moves to the top on a phone. */
  const ways = cols.map((title, i) => ({
    title,
    ours: i === 2,
    points: rows.map((r) => ({ k: r.k, v: r.v[i], bad: i < 2 && !!r.bad?.[i] })),
  }));

  return (
    <section className="bg-surface border-y border-line">
      <div className="page-wrap py-14 sm:py-20">
        <SectionTitle
          center
          kicker={tx('قبل ما تقرر', 'Before you decide')}
          title={tx('قارن بنفسك.. وخد قرارك', 'Compare for yourself.. and make your decision')}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-[1fr_1.18fr_1fr] items-center">
          {ways.map((w) => (
            <div
              key={w.title}
              className={`rounded-3xl border transition-all ${
                w.ours
                  ? 'order-first md:order-none border-2 border-brand bg-gradient-to-b from-brand-soft via-brand-soft/90 to-surface shadow-2xl p-6 sm:p-8 md:scale-[1.06] z-10 relative ring-4 ring-brand/10'
                  : 'border-line bg-paper/90 shadow-soft p-5 sm:p-6'
              }`}
            >
              {w.ours && (
                <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                  <span className="rounded-full bg-brand px-4 py-1 text-xs sm:text-sm font-extrabold text-white shadow-md flex items-center gap-1.5 uppercase tracking-wide">
                    ★ {tx('الأفضل ليك والأكثر أماناً', 'Best & Safest For You')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mt-1">
                <h3 className={`font-display font-extrabold ${w.ours ? 'text-xl sm:text-2xl text-brand' : 'text-lg sm:text-xl text-ink'}`}>
                  {w.title}
                </h3>
                {w.ours && (
                  <span className="hidden sm:inline-block rounded-full bg-brand/10 text-brand text-xs font-bold px-2.5 py-0.5">
                    {tx('بدون عمولة', 'Zero Fee')}
                  </span>
                )}
              </div>

              <ul className={`mt-6 ${w.ours ? 'space-y-4' : 'space-y-3.5'}`}>
                {w.points.map((pt) => (
                  <li key={pt.k} className="flex items-start gap-3">
                    {w.ours ? (
                      <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Check className="w-3.5 h-3.5" strokeWidth={3.5} />
                      </div>
                    ) : pt.bad ? (
                      /* حلقة فاتحة جوّاها دايرة مصمتة — من غير علامة، اللون لوحده بيقول إنها نقطة ضعف */
                      <div className="w-7 h-7 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="block w-3.5 h-3.5 rounded-full bg-danger" />
                      </div>
                    ) : (
                      <span className="w-7 shrink-0" />
                    )}
                    <span className="min-w-0">
                      <span className={`block ${w.ours ? 'text-xs sm:text-sm font-bold text-brand-ink' : 'text-xs text-muted'}`}>
                        {pt.k}
                      </span>
                      <span className={`block ${w.ours ? 'text-[15px] sm:text-base font-bold text-ink leading-snug mt-0.5' : 'text-[14px] sm:text-[15px] text-ink-soft'}`}>
                        {pt.v}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center flex flex-col items-center">
          <button onClick={onSell} className="btn-accent min-h-13 px-8 text-base font-bold shadow-lg hover:shadow-xl transition">
            <Tag className="w-5 h-5" />
            <span>{tx('اعرض وحدتك الآن', 'List your unit now')}</span>
          </button>

          
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
          kicker={tx('حصري على DEAL', 'Only on DEAL')}
          title={tx('عايز تغيّر وحدتك؟ بدّلها.', 'Want a different unit? Swap it.')}
          sub={tx(
            'لاقي حد عايز يبدل معاك: انت تاخد وحدته وهو ياخد وحدتك، وكل واحد يكمّل أقساط اللي خده. اللي بيتدفع هو الفرق في المدفوع بس.',
            'Find an owner who wants to swap with you: you take their unit, they take yours, and each of you carries on the other\'s plan. Only the difference in what was paid changes hands.',
          )}
        />
        <ul className="mt-6 space-y-3 text-ink-soft">
          {[
            tx('وحدة قسطها أقل لو القسط تقل عليك — أو أكبر، أو في منطقة تانية', 'A lower monthly if yours is too heavy — or bigger, or elsewhere'),
            tx('الفرق بيتحسب على المدفوع، مش على سعر النهارده', "The difference is on what's paid, not today's price"),
            tx('بنوريك بس الوحدات اللي أصحابها عايزين يبدلوا، وبناخد موافقتهم على وحدتك', 'Only units whose owners want to swap — and we get their OK on yours'),
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
            <p className="text-xs sm:text-sm text-muted">{tx('وحدة اللي هيبدل معاك — مدفوع فيها', "The other owner's unit — paid")}</p>
            <p className="num font-display mt-2 text-lg sm:text-3xl font-bold text-ink whitespace-nowrap">{money(theirs, language)}</p>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-brand text-white p-5 flex items-center justify-between gap-4">
          <span className="text-white/70">{tx('تدفع الفرق بس', 'You pay only the difference')}</span>
          <span className="num font-display text-2xl sm:text-3xl font-bold">
            {money(theirs - mine, language)} <span className="text-sm font-medium text-white/60">{currency(language)}</span>
          </span>
        </div>
        <p className="mt-3 text-xs text-muted">{tx('مثال توضيحي. وحدته مدفوع فيها أكتر، فانت اللي بتدفعله الفرق — ولو العكس هو اللي بيدفعلك. الفرق الفعلي بيتحدد بعد مراجعة العقدين.', 'Illustrative. Theirs has more paid in, so you pay them the difference — the other way round, they pay you. The actual figure is set after both contracts are reviewed.')}</p>
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
      <SectionTitle
        center
        kicker={tx('لو مش قادر تكمّل', "If you can't keep up")}
        title={tx(`ليه تبيع عن طريق ${BRAND.nameAr} ؟`, `Why sell through ${BRAND.nameEn} ?`)}
      />
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

const HowItWorks: React.FC<{ tab: HomeRole }> = ({ tab }) => {
  const { tx } = useLanguage();

  const steps =
    tab === 'sell'
      ? [
          { illo: IlloForm, icon: FileCheck2, t: tx('ابعت بيانات وحدتك', 'Send your unit details'), d: tx('دقيقة واحدة، ومجاناً', 'One minute, free') },
          { illo: IlloReview, icon: ClipboardCheck, t: tx('كشف حساب مجاني', 'Free statement'), d: tx('نراجع العقد والمديونية ونقولك موقفك', 'We check contract and dues, and tell you where you stand') },
          { illo: IlloPeople, icon: Users, t: tx('نوصلك بمشتري جاد', 'We find a serious buyer'), d: tx('واسمك ورقمك مش بيظهروا', 'Your name and number stay hidden') },
          { illo: IlloKeys, icon: Handshake, t: tx('تتنازل وتقبض', 'Transfer & get paid'), d: tx('في مقر المطور بشيك مصرفي', 'At the developer, by bank cheque') },
        ]
      : tab === 'buy'
      ? [
          { illo: IlloForm, icon: Wallet, t: tx('حدد ميزانيتك', 'Set your budget'), d: tx('الكاش اللي معاك والقسط اللي يريحك', 'Your cash and a comfortable monthly') },
          { illo: IlloPeople, icon: UserCheck, t: tx('احجز الوحدة', 'Book the unit'), d: tx('باسمك ورقمك، وإحنا نكلّمك', 'Name and mobile — we call you') },
          { illo: IlloReview, icon: ShieldCheck, t: tx('اطمن على الورق', 'Check the papers'), d: tx('العقد والمديونية متراجعين', 'Contract & dues verified') },
          { illo: IlloKeys, icon: Handshake, t: tx('استلم باسمك', 'Take it over'), d: tx('تنازل رسمي وتكمّل الأقساط', 'Official transfer, continue the plan') },
        ]
      : [
          { illo: IlloForm, icon: FileCheck2, t: tx('قولنا وحدتك وعاوز إيه', 'Tell us your unit and what you want'), d: tx('اللي دفعته وقسطك، والمنطقة والنوع', 'What you paid, your monthly, area and type') },
          { illo: IlloPeople, icon: ArrowLeftRight, t: tx('اختار وحدة صاحبها عايز يبدل', 'Pick a unit whose owner wants to swap'), d: tx('وشوف الفرق والقسط الجديد قبل ما تقرر', 'See the difference and the new monthly first') },
          { illo: IlloReview, icon: ShieldCheck, t: tx('ناخد موافقة الطرف التاني', "We get the other owner's OK"), d: tx('ونراجع العقدين الاتنين', 'And check both contracts') },
          { illo: IlloKeys, icon: Handshake, t: tx('تبدلوا في نفس اليوم', 'Swap on the same day'), d: tx('كل واحد يكمّل أقساط اللي خده، والفرق بيتسوّى بينكم', "Each carries on the other's plan; you settle the difference") },
        ];

  return (
    <section className="bg-surface border-y border-line">
      <div className="page-wrap py-14 sm:py-20">
        <SectionTitle center kicker={tx('إزاي بنشتغل', 'How it works')} title={tx('4 خطوات وبس', 'Four steps, that’s it')} />
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
    { icon: Percent, t: tx(`المشتري ${BRAND.buyerFeePercent}% عموله بس`, `Buyers pay ${BRAND.buyerFeePercent}% only`), d: tx('وبعد توقيع التنازل. البايع صفر.', 'After signing. Sellers pay nothing.') },
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
