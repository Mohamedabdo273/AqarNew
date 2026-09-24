import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Tag,
  Search,
  ShieldCheck,
  FileCheck2,
  UserCheck,
  Handshake,
  Banknote,
  ChevronDown,
  TrendingDown,
  Sparkles,
  Check,
  X,
  Ban,
  HandCoins,
  FileText,
  Wallet,
  Percent,
  Users,
  ScrollText,
  Phone,
} from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';
import { BRAND } from '../config/brand';
import { Budget, BudgetFinder, fitsBudget } from '../components/BudgetFinder';
import { cancellationLoss, currency, money, savingsAmount } from '../lib/unitHelpers';

interface HomePageProps {
  units: RealEstateUnit[];
  budget: Budget;
  onBudgetChange: (b: Budget) => void;
  onBrowseWithBudget: () => void;
  onNavigate: (page: PageId) => void;
  onSelectUnit: (unit: RealEstateUnit) => void;
  onOpenRules: (tab: 'seller' | 'buyer') => void;
}

const SectionTitle: React.FC<{ title: string; sub?: string; center?: boolean }> = ({ title, sub, center }) => (
  <div className={center ? 'text-center max-w-xl mx-auto' : ''}>
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">{title}</h2>
    {sub && <p className="mt-2 text-muted text-[15px]">{sub}</p>}
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
        <span className="num text-xl font-bold text-ink">
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
}) => {
  const { language, tx, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const matching = useMemo(() => units.filter((u) => fitsBudget(u, budget)), [units, budget]);
  const totalSavings = useMemo(() => units.reduce((s, u) => s + savingsAmount(u), 0), [units]);
  const avgDays = useMemo(() => {
    const days = units.map((u) => u.estimatedDaysToClose).filter((d): d is number => !!d);
    return days.length ? Math.round(days.reduce((a, b) => a + b, 0) / days.length) : 7;
  }, [units]);

  return (
    <div>
      {/* ───────── 1. Hero ───────── */}
      <section className="page-wrap pt-10 sm:pt-16 pb-14 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft text-brand-ink px-3.5 py-1.5 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {tx('منصة التنازل عن وحدات التقسيط', 'The marketplace for installment units')}
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] tracking-tight text-ink">
            {tx('اخرج من وحدتك', 'Exit your unit')}
            <br />
            <span className="text-brand">{tx('بفلوسك كاملة', 'with every pound back')}</span>
          </h1>
          <p className="mt-5 text-lg text-ink-soft max-w-md leading-relaxed">
            {tx('أو اشتري وحدة بسعر العقد القديم وكمّل أقساطها. بدون أوفر برايس.', 'Or buy a unit at its old contract price and continue the plan. No overprice.')}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            <button onClick={() => onNavigate('sell')} className="btn-primary min-h-14 text-base px-4 whitespace-nowrap">
              <Tag className="w-5 h-5" />
              {tx('بيع وحدتك', 'Sell your unit')}
            </button>
            <button onClick={() => onNavigate('opportunities')} className="btn-ghost min-h-14 text-base px-4 whitespace-nowrap">
              <Search className="w-5 h-5" />
              {tx('شوف الوحدات', 'See units')}
            </button>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: `${units.length}+`, l: tx('وحدة متاحة', 'Units live') },
              { v: money(Math.round(totalSavings / 1_000_000) * 1_000_000, language), l: tx('توفير للمشترين', 'Buyer savings') },
              { v: tx(`${avgDays} أيام`, `${avgDays} days`), l: tx('متوسط البيع', 'Avg. to sell') },
            ].map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd className="num text-xl sm:text-2xl font-bold text-ink whitespace-nowrap">{s.v}</dd>
                <p className="text-sm text-muted mt-0.5">{s.l}</p>
              </div>
            ))}
          </dl>
        </div>

        {/* Budget-first search — our main difference */}
        <div className="card p-6 sm:p-7 shadow-lift">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-lg font-bold text-ink">{tx('ميزانيتك تجيب إيه؟', 'What fits your budget?')}</p>
              <p className="text-sm text-muted mt-0.5">{tx('حرّك وشوف النتيجة فوراً', 'Slide and see instantly')}</p>
            </div>
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gold-soft text-gold">
              <Banknote className="w-5 h-5" />
            </span>
          </div>
          <BudgetFinder budget={budget} onChange={onBudgetChange} />
          <div className="mt-7 flex items-center gap-3">
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {matching.slice(0, 3).map((u) => (
                <img key={u.id} src={u.images[0]} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-surface" />
              ))}
            </div>
            <p className="text-sm text-ink-soft">
              {matching.length > 0 ? (
                <>
                  <span className="num font-bold text-ink text-base">{matching.length}</span> {tx('وحدة على قد ميزانيتك', 'units fit your budget')}
                </>
              ) : (
                tx('زوّد الميزانية شوية', 'Try a higher budget')
              )}
            </p>
          </div>
          <button onClick={onBrowseWithBudget} className="btn-primary w-full mt-5 min-h-13">
            {tx('وريني الوحدات', 'Show me units')}
            <Arrow className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ───────── 2. Cancel vs exit, with real numbers ───────── */}
      <LossExample onSell={() => onNavigate('sell')} />

      {/* ───────── 3. Who it's for ───────── */}
      <Audiences onNavigate={onNavigate} />

      {/* ───────── 4. Us vs normal resale ───────── */}
      <ComparisonTable />

      {/* ───────── 5. Featured units ───────── */}
      <section className="page-wrap py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionTitle title={tx('وحدات بسعر زمان', 'Units at old prices')} sub={tx('موثّقة ومراجَعة قبل النشر', 'Verified before listing')} />
          <button onClick={() => onNavigate('opportunities')} className="hidden sm:inline-flex items-center gap-1.5 text-brand font-semibold hover:underline">
            {tx('شوف الكل', 'See all')}
            <Arrow className="w-4 h-4" />
          </button>
        </div>
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {units.slice(0, 6).map((u, i) => (
            <div key={u.id} className={`w-[82%] shrink-0 snap-start sm:w-auto ${i >= 3 ? 'sm:hidden' : ''}`}>
              <UnitCard unit={u} onOpen={onSelectUnit} />
            </div>
          ))}
        </div>
        <button onClick={() => onNavigate('opportunities')} className="btn-ghost w-full mt-6 sm:hidden">
          {tx(`شوف كل الوحدات (${units.length})`, `See all ${units.length} units`)}
        </button>
      </section>

      {/* ───────── 6. How it works ───────── */}
      <HowItWorks />

      {/* ───────── 7. Our rules ───────── */}
      <RulesPreview onOpenRules={onOpenRules} />

      {/* ───────── 8. FAQ ───────── */}
      <Faq />

      {/* ───────── 9. Two closing paths ───────── */}
      <section className="page-wrap pb-16 grid md:grid-cols-2 gap-4">
        <div className="rounded-[28px] bg-brand-ink text-white p-6 sm:p-10">
          <p className="text-2xl font-bold">{tx('مش قادر تكمّل أقساطك؟', "Can't keep up with installments?")}</p>
          <p className="mt-2 text-white/70">{tx('ما تلغيش وتخسر. اعرض وحدتك في دقيقة واسترد فلوسك كاملة.', "Don't cancel and lose. List in a minute and get all your money back.")}</p>
          <button onClick={() => onNavigate('sell')} className="btn bg-white text-brand-ink hover:bg-brand-soft mt-6">
            <Tag className="w-5 h-5" />
            {tx('بيع وحدتك', 'Sell your unit')}
          </button>
        </div>
        <div className="rounded-[28px] bg-gold-soft p-6 sm:p-10">
          <p className="text-2xl font-bold text-ink">{tx('بتدوّر على فرصة حقيقية؟', 'Looking for a real deal?')}</p>
          <p className="mt-2 text-ink-soft">{tx('وحدات بسعر العقد القديم، موثّقة، وعلى قد ميزانيتك.', 'Units at old contract prices, verified, within your budget.')}</p>
          <button onClick={() => onNavigate('opportunities')} className="btn-primary mt-6">
            <Search className="w-5 h-5" />
            {tx('شوف فرص الشراء', 'See units')}
          </button>
        </div>
      </section>

      <div className="page-wrap pb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <a href={`tel:${BRAND.hotline}`} className="inline-flex items-center gap-1.5 hover:text-ink min-h-11">
          <Phone className="w-4 h-4" />
          {BRAND.hotline}
        </a>
        <span>{tx('الأرقام استرشادية، والمراجعة النهائية بتكون على العقد الفعلي.', 'Figures are indicative; final review is on the actual contract.')}</span>
      </div>
    </div>
  );
};

/* Cancelling costs a % of the whole contract, not of what you paid — make that visible with real numbers. */
const LossExample: React.FC<{ onSell: () => void }> = ({ onSell }) => {
  const { language, tx } = useLanguage();
  const [contract, setContract] = useState(6_000_000);
  const [paid, setPaid] = useState(1_500_000);
  const safePaid = Math.min(paid, contract);
  const loss = cancellationLoss(contract, safePaid);
  const cancelBack = safePaid - loss;
  const lostPct = safePaid ? Math.round((loss / safePaid) * 100) : 0;

  return (
    <section className="bg-surface border-y border-line">
      <div className="page-wrap py-12 sm:py-16">
        <SectionTitle center title={tx('ليه تلغي وتخسر؟', 'Why cancel and lose?')} sub={tx('مثال بالأرقام — حرّك وشوف', 'An example with numbers — slide to see')} />

        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto grid gap-6">
          <Slider label={tx('سعر الوحدة في العقد', 'Contract price')} value={contract} min={1_000_000} max={15_000_000} step={100_000} onChange={setContract} />
          <Slider label={tx('دفعت كام لحد دلوقتي؟', 'How much have you paid?')} value={safePaid} min={100_000} max={contract} step={50_000} onChange={setPaid} />
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-danger-soft p-4 sm:p-7">
            <p className="flex items-center gap-2 text-sm sm:text-base font-semibold text-danger">
              <TrendingDown className="w-5 h-5" />
              {tx('لو لغيت مع المطور', 'Cancel with the developer')}
            </p>
            <p className="num mt-3 sm:mt-4 text-2xl sm:text-4xl font-bold text-danger">{money(cancelBack, language)}</p>
            <p className="mt-1 text-sm sm:text-base text-ink-soft">{tx('ترجعلك على أقساط لحد 3 سنين', 'Paid back over up to 3 years')}</p>
            <p className="mt-3 sm:mt-4 rounded-xl bg-surface/70 px-3 py-2 text-xs sm:text-sm text-danger font-semibold">
              {tx(`بتخسر ${money(loss, language)} — يعني ${lostPct}% من اللي دفعته`, `You lose ${money(loss, language)} — ${lostPct}% of what you paid`)}
            </p>
          </div>
          <div className="rounded-3xl bg-brand-soft p-4 sm:p-7 ring-2 ring-brand/20">
            <p className="flex items-center gap-2 text-sm sm:text-base font-semibold text-brand">
              <ShieldCheck className="w-5 h-5" />
              {tx('لو خرجت معانا', 'Exit with us')}
            </p>
            <p className="num mt-3 sm:mt-4 text-2xl sm:text-4xl font-bold text-brand">{money(safePaid, language)}</p>
            <p className="mt-1 text-sm sm:text-base text-ink-soft">{tx('كاش بشيك مصرفي يوم التنازل', 'Cash by bank cheque on transfer day')}</p>
            <p className="mt-3 sm:mt-4 rounded-xl bg-surface/70 px-3 py-2 text-xs sm:text-sm text-brand font-semibold">
              {tx('صفر عمولة عليك — صفر خسارة', 'Zero fee for you — zero loss')}
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button onClick={onSell} className="btn-primary">
            {tx('ابدأ دلوقتي — مجاناً', 'Start now — free')}
          </button>
        </div>
      </div>
    </section>
  );
};

const Audiences: React.FC<{ onNavigate: (p: PageId) => void }> = ({ onNavigate }) => {
  const { tx } = useLanguage();
  const groups = [
    {
      icon: Tag,
      who: tx('البايع — صاحب الوحدة', 'The seller — unit owner'),
      head: tx('بدون أوفر = أسرع بيع في السوق', 'No overprice = fastest sale in the market'),
      points: [
        tx('تسترد 100% من اللي دفعته كاش', 'Get back 100% of what you paid, in cash'),
        tx('صفر عمولة عليك', 'Zero fee for you'),
        tx('رقمك مش بيتنشر، واحنا بنمشي معاك لحد ما تقبض', "Your number stays private; we're with you until payout"),
      ],
      cta: tx('بيع وحدتك', 'Sell your unit'),
      page: 'sell' as PageId,
      tone: 'brand',
    },
    {
      icon: Search,
      who: tx('المشتري', 'The buyer'),
      head: tx('بسعر العقد القديم، وتكمّل الأقساط', 'At the old contract price, continue the plan'),
      points: [
        tx('مفيش أوفر برايس — تدفع اللي البايع دفعه بس', 'No overprice — pay only what the seller paid'),
        tx('دوّر بالكاش اللي معاك والقسط اللي تقدر عليه', 'Search by your cash and the monthly you can afford'),
        tx('العقد والمديونية متراجعين، والتنازل رسمي عند المطور', 'Contract and dues checked; official transfer at the developer'),
      ],
      cta: tx('شوف فرص الشراء', 'See units'),
      page: 'opportunities' as PageId,
      tone: 'gold',
    },
  ];
  return (
    <section className="page-wrap py-16 grid md:grid-cols-2 gap-4">
      {groups.map((g) => (
        <div key={g.who} className="card p-6 sm:p-8 flex flex-col">
          <span className={`inline-flex items-center gap-2 self-start rounded-full px-3.5 py-1.5 text-sm font-semibold ${g.tone === 'brand' ? 'bg-brand-soft text-brand-ink' : 'bg-gold-soft text-gold'}`}>
            <g.icon className="w-4 h-4" />
            {g.who}
          </span>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-ink leading-snug">{g.head}</p>
          <ul className="mt-5 space-y-3 flex-1">
            {g.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-ink-soft">
                <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate(g.page)} className={`${g.tone === 'brand' ? 'btn-primary' : 'btn-ghost'} mt-7 self-start`}>
            {g.cta}
          </button>
        </div>
      ))}
    </section>
  );
};

const ComparisonTable: React.FC = () => {
  const { tx } = useLanguage();
  const rows: { k: string; them: string; us: string; themOk?: boolean }[] = [
    { k: tx('السعر', 'Price'), them: tx('أوفر برايس فوق المدفوع', 'Overprice on top'), us: tx('اللي البايع دفعه بس', 'Only what the seller paid') },
    { k: tx('العمولة على البايع', 'Seller fee'), them: tx('عمولة سمسار', 'Broker commission'), us: tx('صفر', 'Zero') },
    { k: tx('الفلوس', 'Payment'), them: tx('عربون وكاش في إيد', 'Deposits & cash in hand'), us: tx('شيك مصرفي في مقر المطور', 'Bank cheque at the developer') },
    { k: tx('البحث', 'Search'), them: tx('بالسعر الكلي بس', 'Total price only'), us: tx('بالكاش والقسط الشهري', 'By cash & monthly') },
    { k: tx('المبادلة', 'Swap'), them: tx('مش موجودة', 'Not available'), us: tx('وحدة قصاد وحدة', 'Unit for unit') },
  ];
  return (
    <section className="bg-surface border-y border-line">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <SectionTitle center title={tx('إيه الفرق بينا وبين الريسيل العادي؟', "How we differ from normal resale")} />
        {/* Desktop: side-by-side table */}
        <div className="mt-10 hidden sm:block overflow-hidden rounded-3xl border border-line">
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] bg-paper text-sm font-bold">
            <div className="p-4" />
            <div className="p-4 text-muted">{tx('الريسيل العادي', 'Normal resale')}</div>
            <div className="p-4 text-brand bg-brand-soft">{tx(BRAND.nameAr, BRAND.nameEn)}</div>
          </div>
          {rows.map((r) => (
            <div key={r.k} className="grid grid-cols-[1fr_1.2fr_1.2fr] border-t border-line text-[15px]">
              <div className="p-4 font-semibold text-ink">{r.k}</div>
              <div className="p-4 flex items-start gap-2 text-muted">
                <X className="w-4 h-4 text-danger shrink-0 mt-1" />
                {r.them}
              </div>
              <div className="p-4 flex items-start gap-2 text-ink bg-brand-soft/40">
                <Check className="w-4 h-4 text-brand shrink-0 mt-1" strokeWidth={3} />
                {r.us}
              </div>
            </div>
          ))}
        </div>
        {/* Phone: one small card per row */}
        <div className="mt-8 rounded-2xl border border-line divide-y divide-line sm:hidden">
          {rows.map((r) => (
            <div key={r.k} className="p-4">
              <p className="font-bold text-ink">{r.k}</p>
              <p className="mt-1.5 flex items-start gap-2 text-sm text-muted">
                <X className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                {r.them}
              </p>
              <p className="mt-1.5 flex items-start gap-2 text-sm text-ink font-medium">
                <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" strokeWidth={3} />
                {r.us}
              </p>
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
          { icon: FileCheck2, t: tx('ابعت طلبك', 'Send a request'), d: tx('8 بيانات بس في دقيقة', '8 fields, one minute') },
          { icon: FileText, t: tx('نراجع العقد', 'We check the contract'), d: tx('والمديونية مع المطور', 'And dues with the developer') },
          { icon: Users, t: tx('نوصلك بمشتري', 'We find a buyer'), d: tx('جاهز بالكاش', 'Ready with cash') },
          { icon: Handshake, t: tx('تتنازل وتقبض', 'Transfer & get paid'), d: tx('في مقر المطور بشيك مصرفي', 'At the developer, bank cheque') },
        ]
      : [
          { icon: Search, t: tx('اختار وحدتك', 'Pick a unit'), d: tx('بالكاش والقسط اللي يناسبك', 'By cash & monthly') },
          { icon: UserCheck, t: tx('عاين ببلاش', 'Free viewing'), d: tx('بنرتبها معاك', 'We arrange it') },
          { icon: ShieldCheck, t: tx('اطمن على الورق', 'Check the papers'), d: tx('العقد والمديونية متراجعين', 'Contract & dues verified') },
          { icon: Handshake, t: tx('استلم باسمك', 'Take it over'), d: tx('تنازل رسمي وتكمّل الأقساط', 'Official transfer, continue plan') },
        ];

  return (
    <section className="bg-surface border-y border-line">
      <div className="page-wrap py-12 sm:py-16">
        <SectionTitle center title={tx('إزاي بنشتغل؟', 'How it works')} />
        <div className="mt-6 flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-paper border border-line">
            {(['sell', 'buy'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === k ? 'bg-brand text-white' : 'text-ink-soft'}`}
              >
                {k === 'sell' ? tx('للبايع', 'Sellers') : tx('للمشتري', 'Buyers')}
              </button>
            ))}
          </div>
        </div>
        <ol className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {steps.map((s, i) => (
            <li key={s.t} className="relative flex sm:block items-center gap-4 rounded-2xl sm:rounded-3xl bg-paper p-4 sm:p-6">
              <span className="hidden sm:block absolute top-5 end-6 num text-5xl font-bold text-line-strong">{i + 1}</span>
              <span className="relative grid place-items-center w-12 h-12 rounded-2xl bg-surface text-brand border border-line shrink-0">
                <s.icon className="w-6 h-6" />
                <span className="sm:hidden num absolute -top-1.5 -end-1.5 grid place-items-center w-5 h-5 rounded-full bg-brand text-white text-[11px] font-bold">{i + 1}</span>
              </span>
              <div>
                <p className="sm:mt-5 font-bold sm:text-lg text-ink">{s.t}</p>
                <p className="sm:mt-1 text-sm sm:text-base text-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

/* The rules, visible on the home page — not hidden behind a link. */
const RulesPreview: React.FC<{ onOpenRules: (tab: 'seller' | 'buyer') => void }> = ({ onOpenRules }) => {
  const { tx } = useLanguage();
  const rules = [
    { icon: Ban, t: tx('صفر أوفر برايس', 'Zero overprice'), d: tx('السعر هو اللي البايع دفعه، مش جنيه زيادة', 'The price is what the seller paid') },
    { icon: UserCheck, t: tx('ملّاك بس', 'Owners only'), d: tx('بنتعامل مع صاحب الوحدة، مش سماسرة', 'We deal with owners, not brokers') },
    { icon: HandCoins, t: tx('مفيش فلوس قبل التنازل', 'No money before transfer'), d: tx('ولا عربون — كله في مقر المطور', 'No deposits — all at the developer') },
    { icon: FileText, t: tx('المديونية مكتوبة', 'Dues in writing'), d: tx('أي متأخرات بتظهر في الإعلان', 'Any overdues shown on the listing') },
    { icon: Wallet, t: tx('البايع ما بيدفعش حاجة', 'Sellers pay nothing'), d: tx('صفر عمولة', 'Zero fee') },
    { icon: Percent, t: tx(`المشتري ${BRAND.buyerFeePercent}% بس`, `Buyers pay ${BRAND.buyerFeePercent}% only`), d: tx('وبعد توقيع التنازل', 'And after signing') },
  ];
  return (
    <section className="page-wrap py-12 sm:py-16">
      <SectionTitle center title={tx('قواعدنا', 'Our rules')} sub={tx('بسيطة وواضحة، وبتحمي الطرفين', 'Simple, clear, and protect both sides')} />
      <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {rules.map((r) => (
          <div key={r.t} className="card p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <span className="grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-ink text-[#f2b53a] shrink-0">
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
    </section>
  );
};

const Faq: React.FC = () => {
  const { tx } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { q: tx('هسترد فلوسي كلها فعلاً؟', 'Do I really get all my money back?'), a: tx('أيوه. المشتري بيدفعلك كل اللي دفعته للمطور، من غير خصم ومن غير عمولة عليك.', 'Yes. The buyer pays you everything you paid the developer — no deductions, no fee for you.') },
    { q: tx('مين بيدفع العمولة؟', 'Who pays the fee?'), a: tx(`المشتري بس، ${BRAND.buyerFeePercent}% من سعر العقد بعد توقيع التنازل.`, `Only the buyer: ${BRAND.buyerFeePercent}% of the contract price, after the transfer is signed.`) },
    { q: tx('ليه ما ألغيش مع المطور وخلاص؟', "Why not just cancel with the developer?"), a: tx('لأن الإلغاء بيخصم 10–15% من سعر العقد كله، وده ممكن ياكل معظم اللي دفعته، وباقي فلوسك بترجع على سنين.', 'Cancelling deducts 10–15% of the whole contract price — often most of what you paid — and the rest comes back over years.') },
    { q: tx('إيه اللي يضمن حقي؟', 'How am I protected?'), a: tx('التنازل بيتم رسمي في مقر المطور، والفلوس بشيك مصرفي، ومفيش أي فلوس بتتدفع قبلها.', 'Transfer is signed at the developer, paid by bank cheque, and no money changes hands before.') },
  ];
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
      <SectionTitle center title={tx('أسئلة سريعة', 'Quick questions')} />
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
