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
  Ban,
  HandCoins,
  FileText,
  Wallet,
  Percent,
  Users,
  ScrollText,
  Phone,
  Repeat,
  ArrowLeftRight,
  Headset,
  EyeOff,
  Scale,
  ClipboardCheck,
  Landmark,
  Flame,
  Check,
  Receipt,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';
import { BRAND, whatsappLink } from '../config/brand';
import { Budget, BudgetFinder, fitsBudget } from '../components/BudgetFinder';
import { cancellationLoss, currency, isDeal, money, sellerDiscount } from '../lib/unitHelpers';

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
}

const SectionTitle: React.FC<{ title: string; sub?: string; center?: boolean; light?: boolean; kicker?: string }> = ({
  title,
  sub,
  center,
  light,
  kicker,
}) => (
  <div className={center ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
    {kicker && (
      <p className={`flex items-center gap-2 text-sm font-semibold mb-3 ${center ? 'justify-center' : ''} ${light ? 'text-accent-light' : 'text-accent'}`}>
        {kicker}
      </p>
    )}
    <h2 className={`text-3xl sm:text-4xl font-extrabold leading-tight ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
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
}) => {
  const { language, tx, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const matching = useMemo(() => units.filter((u) => fitsBudget(u, budget)), [units, budget]);
  // Show what fits the budget above; fall back to the newest units so the row is never empty.
  const featured = matching.length > 0 ? matching : units;
  // Hero example — the calculator's default numbers, so both places agree.
  const heroExample = useMemo(() => {
    const contract = 6_000_000;
    const paid = 1_500_000;
    return { contract, paid, cancelBack: paid - cancellationLoss(contract, paid) };
  }, []);
  // Biggest seller discounts first.
  const deals = useMemo(() => units.filter(isDeal).sort((a, b) => sellerDiscount(b) - sellerDiscount(a)), [units]);

  return (
    <div>
      {/* ───────── 1. Hero: two doors — the owner who's struggling, and the buyer with a budget ───────── */}
      <section className="page-wrap pt-10 sm:pt-14 pb-12">
        <p className="flex items-center gap-2 text-sm font-medium text-muted">
          <span className="w-6 h-px bg-ink" />
          {tx('تنازل رسمي عن وحدات التقسيط', 'Official transfers of installment units')}
        </p>
        <h1 className="mt-4 text-[2rem] sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-ink max-w-4xl">
          {tx('بيع من غير ما ', 'Sell without ')}
          <span className="text-accent">{tx('تخسر.', 'losing.')}</span>
          <br />
          {tx('واشتري من غير أوفر.', 'Buy without overprice.')}
        </h1>

        <div className="mt-8 sm:mt-10 grid lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {/* Door 1 — the owner who can't keep up. Plain words, no "defaulter" label. */}
          <div className="rounded-card border-2 border-ink bg-surface p-6 sm:p-8 flex flex-col">
            <p className="text-sm font-semibold text-muted">{tx('عندي وحدة', 'I own a unit')}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight text-ink">{tx('اتأخرت في الأقساط؟', 'Behind on installments?')}</h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              {tx(
                'ما تلغيش وتخسر. بيع وحدتك واسترد اللي دفعته — حتى لو عليك متأخرات أو غرامات.',
                "Don't cancel and lose. Sell your unit and get back what you paid — even with overdue installments or fines.",
              )}
            </p>
            <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-ink">
              <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <span>
                <b>{tx('جالك إنذار من المطور؟ ', 'Got a warning letter from the developer? ')}</b>
                {tx('لسه في وقت. كلّمنا قبل ما يلغي، وإحنا نشوف معاك أسرع طريق.', "There's still time. Call us before they cancel and we'll find the fastest way out.")}
              </span>
            </p>
            <ul className="mt-5 space-y-2.5 text-[15px] text-ink flex-1">
              {[
                tx('المتأخرات بتتخصم من فلوسك — مش مطلوب منك تدفع حاجة دلوقتي', 'Arrears come out of your payout — nothing to pay now'),
                tx('اسمك ورقمك مش بيتنشروا، ومحدش هيعرف إنك بتبيع', "Your name and number stay private — nobody knows you're selling"),
                tx('من غير عمولة عليك، وكشف حساب مجاني قبل ما تقرر', 'No fee for you, and a free statement before you decide'),
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={2.5} />
                  {b}
                </li>
              ))}
            </ul>
            {/* Same maths as the calculator below, on its default example (6M contract, 1.5M paid). */}
            <div className="mt-6 rounded-xl border border-line overflow-hidden">
              <div className="grid grid-cols-2 text-center">
                <div className="p-3 bg-paper">
                  <p className="text-xs text-muted">{tx('لو لغيت مع المطور', 'Cancel with the developer')}</p>
                  <p className="num font-display mt-1 text-xl font-bold text-muted line-through decoration-2">{money(heroExample.cancelBack, language)}</p>
                  <p className="text-xs text-muted">{tx('على أقساط لسنين', 'paid back over years')}</p>
                </div>
                <div className="p-3 bg-ink text-white">
                  <p className="text-xs text-white/70">{tx('لو بعت عن طريقنا', 'Sell through us')}</p>
                  <p className="num font-display mt-1 text-xl font-extrabold">{money(heroExample.paid, language)}</p>
                  <p className="text-xs text-white/70">{tx('كاش يوم التنازل', 'cash on transfer day')}</p>
                </div>
              </div>
              <a
                href="#seller-calc"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('seller-calc')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block border-t border-line px-3 py-2 text-center text-xs text-muted hover:text-ink"
              >
                {tx(`مثال: عقد ${money(heroExample.contract, language)} ودفعت ${money(heroExample.paid, language)} · احسب بأرقامك ←`, `e.g. ${money(heroExample.contract, language)} contract, ${money(heroExample.paid, language)} paid · try your numbers →`)}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={() => onNavigate('sell')} className="btn-primary min-h-13 px-6">
                <Tag className="w-5 h-5" />
                {tx('اعرض وحدتك — ببلاش', 'List your unit — free')}
              </button>
              <a href={`tel:${BRAND.hotline}`} className="btn-ghost min-h-13 px-5">
                <Phone className="w-5 h-5" />
                {tx(`كلّمنا ${BRAND.hotline}`, `Call ${BRAND.hotline}`)}
              </a>
              <a
                href={whatsappLink(tx('عندي وحدة ومتأخر في الأقساط', "I'm behind on installments for my unit"))}
                target="_blank"
                rel="noreferrer"
                aria-label={tx('واتساب', 'WhatsApp')}
                className="btn-ghost min-h-13 px-4"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Door 2 — the buyer: search by cash and monthly. */}
          <div className="rounded-card bg-ink text-white p-6 sm:p-8 shadow-lift flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white/60">{tx('بدوّر على وحدة', "I'm looking for a unit")}</p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">{tx('بسعر زمان، على قد ميزانيتك', 'Old prices, within your budget')}</h2>
              </div>
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-white/10 text-white shrink-0">
                <Banknote className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-6 flex-1">
              <BudgetFinder dark budget={budget} onChange={onBudgetChange} />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {matching.slice(0, 3).map((u) => (
                  <img key={u.id} src={u.images[0]} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-ink" />
                ))}
              </div>
              <p className="text-sm text-white/70">
                {matching.length > 0 ? (
                  <>
                    <span className="num font-bold text-white text-base">{matching.length}</span> {tx('وحدة على قد ميزانيتك', 'units fit your budget')}
                  </>
                ) : (
                  tx('زوّد الميزانية شوية', 'Try a higher budget')
                )}
              </p>
            </div>
            <button onClick={onBrowseWithBudget} className="btn bg-white text-ink hover:bg-brand-soft w-full mt-5 min-h-13">
              {tx('وريني الوحدات', 'Show me units')}
              <Arrow className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Policies, not marketing numbers — every one of these is true from day one. */}
        <dl className="mt-8 flex flex-wrap gap-y-4 border-t border-line pt-5 [&>div+div]:border-s [&>div+div]:border-line">
          {[
            { v: tx('صفر', 'Zero'), l: tx('عمولة على البايع', 'seller fee') },
            { v: tx('صفر', 'Zero'), l: tx('أوفر برايس على المشتري', 'overprice for buyers') },
            { v: tx('شيك مصرفي', 'Bank cheque'), l: tx('في مقر المطور', 'at the developer') },
          ].map((x) => (
            <div key={x.l} className="px-4 sm:px-8 first:ps-0 last:pe-0">
              <dt className="sr-only">{x.l}</dt>
              <dd className="font-display text-xl sm:text-2xl font-extrabold text-ink whitespace-nowrap">{x.v}</dd>
              <p className="text-sm text-muted mt-0.5">{x.l}</p>
            </div>
          ))}
        </dl>
      </section>

      {/* ───────── 1b. The owner's maths, right after the hero ───────── */}
      <SellerSection onStatement={() => onNavigate('statement')} />

      {/* ───────── 2. Units that fit the budget above ───────── */}
      <section className="bg-surface border-y border-line">
        <div className="page-wrap py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <SectionTitle
              title={matching.length > 0 ? tx('على قد ميزانيتك', 'Within your budget') : tx('وحدات بسعر زمان', 'Units at old prices')}
              sub={
                matching.length > 0
                  ? tx(
                      `${money(budget.cash, language)} كاش و${money(budget.monthly, language)} في الشهر — كلها موثّقة ومراجَعة قبل النشر`,
                      `${money(budget.cash, language)} cash and ${money(budget.monthly, language)} a month — all verified before listing`,
                    )
                  : tx('موثّقة ومراجَعة قبل النشر', 'Verified before listing')
              }
            />
            <button onClick={onBrowseWithBudget} className="hidden sm:inline-flex items-center gap-1.5 text-brand font-semibold hover:underline whitespace-nowrap">
              {tx('شوف الكل', 'See all')}
              <Arrow className="w-4 h-4" />
            </button>
          </div>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {featured.slice(0, 6).map((u, i) => (
              <div key={u.id} className={`w-[82%] shrink-0 snap-start sm:w-auto ${i >= 3 ? 'sm:hidden' : ''}`}>
                <UnitCard unit={u} onOpen={onSelectUnit} fitsBudget={matching.length > 0} />
              </div>
            ))}
          </div>
          <button onClick={onBrowseWithBudget} className="btn-ghost w-full mt-6 sm:hidden">
            {tx(`شوف كل الوحدات (${featured.length})`, `See all ${featured.length} units`)}
          </button>
        </div>
      </section>

      {/* ───────── 2b. Deals: sellers who took a discount to sell faster ───────── */}
      {deals.length > 0 && (
        <section className="page-wrap py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white px-3 py-1 text-sm font-bold">
                <Flame className="w-4 h-4" />
                {tx('أقل من المدفوع', 'Below what was paid')}
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight text-ink">{tx('سعر زمان، وكمان بخصم', 'The old price — and then a discount')}</h2>
              <p className="mt-3 text-[15px] sm:text-base text-muted leading-relaxed">
                {tx('أصحاب الوحدات دي عاملين خصم من اللي دفعوه عشان يبيعوا أسرع.', 'The owners of these units took money off what they paid, to sell faster.')}
              </p>
            </div>
            <button onClick={onOpenDeals} className="hidden sm:inline-flex items-center gap-1.5 text-brand font-semibold hover:underline whitespace-nowrap">
              {tx(`شوف الكل (${deals.length})`, `See all (${deals.length})`)}
              <Arrow className="w-4 h-4" />
            </button>
          </div>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {deals.slice(0, 3).map((u) => (
              <div key={u.id} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <UnitCard unit={u} onOpen={onSelectUnit} />
              </div>
            ))}
          </div>
          <button onClick={onOpenDeals} className="btn-ghost w-full mt-6 sm:hidden">
            {tx(`شوف الكل (${deals.length})`, `See all (${deals.length})`)}
          </button>
        </section>
      )}

      {/* ───────── 3. Swap — only on Wahdety ───────── */}
      <SwapFeature onSwap={() => onNavigate('swap')} />

      {/* ───────── 5. Money safety — the rules on every transfer ───────── */}
      <RulesPreview onOpenRules={onOpenRules} />

      {/* ───────── 6. Steps ───────── */}
      <HowItWorks />

      {/* ───────── 7. FAQ ───────── */}
      <Faq />

      {/* ───────── 8. Two closing paths ───────── */}
      <section className="page-wrap pb-16 grid md:grid-cols-2 gap-4">
        <div className="rounded-card bg-surface border border-line p-6 sm:p-10">
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink">{tx('قبل ما تلغي، اعرف موقفك', 'Before you cancel, know where you stand')}</p>
          <p className="mt-2 text-ink-soft">{tx('كشف حساب مجاني لوحدتك، ونصيحة صريحة — من غير أي التزام.', 'A free statement for your unit and honest advice — no commitment.')}</p>
          <button onClick={() => onNavigate('statement')} className="btn-primary mt-6">
            <ClipboardCheck className="w-5 h-5" />
            {tx('اطلب كشف الحساب', 'Get my statement')}
          </button>
        </div>
        <div className="rounded-card bg-surface border border-line p-6 sm:p-10">
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-ink">{tx('عايز تغيّر وحدتك؟', 'Want a different unit?')}</p>
          <p className="mt-2 text-ink-soft">{tx('بدّلها بوحدة تانية، وادفع أو خد الفرق بس.', 'Swap it for another and settle only the difference.')}</p>
          <button onClick={() => onNavigate('swap')} className="btn-ghost mt-6">
            <Repeat className="w-5 h-5" />
            {tx('جرّب التبديل', 'Try a swap')}
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

/* Swap is ours alone — show it with a worked example instead of hiding it in the menu. */
const SwapFeature: React.FC<{ onSwap: () => void }> = ({ onSwap }) => {
  const { language, tx } = useLanguage();
  const mine = 1_500_000;
  const theirs = 2_000_000;
  return (
    <section className="page-wrap py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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

      <div className="rounded-card border border-line bg-surface p-5 sm:p-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
          <div className="rounded-xl bg-paper border border-line p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-muted">{tx('وحدتك — مدفوع فيها', 'Your unit — paid')}</p>
            <p className="num font-display mt-2 text-lg sm:text-3xl font-extrabold text-ink whitespace-nowrap">{money(mine, language)}</p>
          </div>
          <span className="grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-ink text-white">
            <ArrowLeftRight className="w-5 h-5" />
          </span>
          <div className="rounded-xl bg-paper border border-line p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-muted">{tx('الوحدة الجديدة — مدفوع فيها', 'New unit — paid')}</p>
            <p className="num font-display mt-2 text-lg sm:text-3xl font-extrabold text-ink whitespace-nowrap">{money(theirs, language)}</p>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-ink text-white p-5 flex items-center justify-between gap-4">
          <span className="text-white/70">{tx('تدفع الفرق بس', 'You pay only the difference')}</span>
          <span className="num font-display text-2xl sm:text-3xl font-extrabold">
            {money(theirs - mine, language)} <span className="text-sm font-medium text-white/60">{currency(language)}</span>
          </span>
        </div>
        <p className="mt-3 text-xs text-muted">{tx('مثال توضيحي. الفرق الفعلي بيتحدد بعد مراجعة العقدين.', 'Illustrative. The actual difference is set after both contracts are reviewed.')}</p>
      </div>
    </section>
  );
};

/* Sellers: the cancellation maths, then what we promise them. */
const SellerSection: React.FC<{ onStatement: () => void }> = ({ onStatement }) => {
  const { language, tx } = useLanguage();
  const [contract, setContract] = useState(6_000_000);
  const [paid, setPaid] = useState(1_500_000);
  const safePaid = Math.min(paid, contract);
  const loss = cancellationLoss(contract, safePaid);
  const cancelBack = safePaid - loss;
  const lostPct = safePaid ? Math.round((loss / safePaid) * 100) : 0;

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
    <section id="seller-calc" className="bg-surface border-y border-line scroll-mt-20">
      <div className="page-wrap py-14 sm:py-20">
        <SectionTitle
          center
          kicker={tx('لو مش قادر تكمّل', "If you can't keep up")}
          title={tx('الإلغاء بيخسّرك كام؟', 'What does cancelling cost you?')}
          sub={tx('الإلغاء بيخصم نسبة من سعر العقد كله، مش من اللي دفعته. حرّك وشوف الفرق.', 'Cancelling deducts a share of the whole contract price, not of what you paid. Slide to see.')}
        />

        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto grid gap-6">
          <Slider label={tx('سعر الوحدة في العقد', 'Contract price')} value={contract} min={1_000_000} max={15_000_000} step={100_000} onChange={setContract} />
          <Slider label={tx('دفعت كام لحد دلوقتي؟', 'How much have you paid?')} value={safePaid} min={100_000} max={contract} step={50_000} onChange={setPaid} />
        </div>

        <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="rounded-card border border-line bg-paper p-5 sm:p-7">
            <p className="flex items-center gap-2 text-sm sm:text-base font-semibold text-muted">
              <TrendingDown className="w-5 h-5" />
              {tx('لو لغيت مع المطور', 'Cancel with the developer')}
            </p>
            <p className="num font-display mt-3 sm:mt-4 text-3xl sm:text-4xl font-bold text-muted line-through decoration-2">{money(cancelBack, language)}</p>
            <p className="mt-1 text-sm sm:text-base text-muted">{tx('وبترجعلك على أقساط، ممكن لسنين', 'And paid back in instalments, possibly over years')}</p>
            <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2 text-xs sm:text-sm text-danger font-semibold">
              {tx(`بتخسر ${money(loss, language)} — يعني ${lostPct}% من اللي دفعته`, `You lose ${money(loss, language)} — ${lostPct}% of what you paid`)}
            </p>
          </div>
          <div className="rounded-card bg-ink text-white p-5 sm:p-7 shadow-lift">
            <p className="flex items-center gap-2 text-sm sm:text-base font-semibold text-white/70">
              <ShieldCheck className="w-5 h-5 text-accent-light" />
              {tx('لو اتنازلت عن طريقنا', 'Transfer through us')}
            </p>
            <p className="num font-display mt-3 sm:mt-4 text-4xl sm:text-5xl font-extrabold">{money(safePaid, language)}</p>
            <p className="mt-1 text-sm sm:text-base text-white/70">{tx('كاش بشيك مصرفي يوم التنازل', 'Cash by bank cheque on transfer day')}</p>
            <p className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-xs sm:text-sm text-white font-semibold">
              {tx('صفر عمولة عليك', 'Zero fee for you')}
            </p>
          </div>
        </div>

        {/* The free statement + what we promise sellers */}
        <div className="mt-12 sm:mt-16 grid lg:grid-cols-[1fr_1.4fr] gap-4 sm:gap-5 max-w-6xl mx-auto">
          <div className="rounded-card border-2 border-ink p-6 sm:p-8 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-ink text-white">
                <ClipboardCheck className="w-6 h-6" />
              </span>
              <span className="rounded-full bg-accent-soft text-accent px-3 py-1 text-sm font-bold">{tx('مجاناً', 'Free')}</span>
            </div>
            <p className="font-display mt-5 text-2xl sm:text-3xl font-extrabold text-ink">{tx('كشف حساب وحدتك', 'Your unit statement')}</p>
            <p className="mt-3 text-ink-soft leading-relaxed flex-1">
              {tx(
                'بنراجع عقدك ومدفوعاتك والمتبقي، ونحسبلك الإلغاء قصاد التنازل بالأرقام، ونقولك بصراحة: تبيع، ولا تلغي، ولا تكمّل.',
                'We review your contract, payments and balance, compare cancelling vs transferring in numbers, and tell you straight: sell, cancel, or keep going.',
              )}
            </p>
            <button onClick={onStatement} className="btn-primary mt-6 self-start">
              {tx('اطلب كشف الحساب', 'Get my statement')}
            </button>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {promises.map((p) => (
              <div key={p.t} className="rounded-card bg-paper border border-line p-5 sm:p-6 flex items-start gap-4">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-surface border border-line text-ink shrink-0">
                  <p.icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-bold text-lg text-ink">{p.t}</p>
                  <p className="mt-1 text-muted leading-relaxed">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
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
          { icon: FileCheck2, t: tx('ابعت بيانات وحدتك', 'Send your unit details'), d: tx('دقيقة واحدة، ومجاناً', 'One minute, free') },
          { icon: ClipboardCheck, t: tx('كشف حساب مجاني', 'Free statement'), d: tx('نراجع العقد والمديونية ونقولك موقفك', 'We check contract and dues, and tell you where you stand') },
          { icon: Users, t: tx('نوصلك بمشتري جاد', 'We find a serious buyer'), d: tx('واسمك ورقمك مش بيظهروا', 'Your name and number stay hidden') },
          { icon: Handshake, t: tx('تتنازل وتقبض', 'Transfer & get paid'), d: tx('في مقر المطور بشيك مصرفي', 'At the developer, by bank cheque') },
        ]
      : [
          { icon: Wallet, t: tx('حدد ميزانيتك', 'Set your budget'), d: tx('الكاش اللي معاك والقسط اللي يريحك', 'Your cash and a comfortable monthly') },
          { icon: UserCheck, t: tx('عاين ببلاش', 'Free viewing'), d: tx('بنرتبها معاك', 'We arrange it') },
          { icon: ShieldCheck, t: tx('اطمن على الورق', 'Check the papers'), d: tx('العقد والمديونية متراجعين', 'Contract & dues verified') },
          { icon: Handshake, t: tx('استلم باسمك', 'Take it over'), d: tx('تنازل رسمي وتكمّل الأقساط', 'Official transfer, continue the plan') },
        ];

  return (
    <section className="bg-ink text-white">
      <div className="page-wrap py-14 sm:py-20">
        <SectionTitle light center title={tx('4 خطوات وبس', 'Four steps, that’s it')} />
        <div className="mt-6 flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10">
            {(['sell', 'buy'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === k ? 'bg-white text-ink' : 'text-white/70 hover:text-white'}`}
              >
                {k === 'sell' ? tx('للبايع', 'Sellers') : tx('للمشتري', 'Buyers')}
              </button>
            ))}
          </div>
        </div>
        <ol className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {steps.map((s, i) => (
            <li key={s.t} className="relative flex sm:block items-center gap-4 rounded-card border border-white/10 bg-white/[0.04] p-4 sm:p-6">
              <span className="hidden sm:block absolute top-4 end-6 num font-display text-6xl font-extrabold text-white/10">{i + 1}</span>
              <span className="relative grid place-items-center w-12 h-12 rounded-xl bg-white/10 text-white shrink-0">
                <s.icon className="w-6 h-6" />
                <span className="sm:hidden num absolute -top-1.5 -end-1.5 grid place-items-center w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold">{i + 1}</span>
              </span>
              <div>
                <p className="sm:mt-6 font-bold sm:text-lg text-white">{s.t}</p>
                <p className="sm:mt-1 text-sm sm:text-base text-white/60">{s.d}</p>
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
