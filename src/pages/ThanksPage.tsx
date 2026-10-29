import React, { useState } from 'react';
import { Check, Copy, PhoneCall, ClipboardCheck, Users, Handshake, CalendarCheck, FileSearch, FileSignature, MessageCircle, ClipboardList, Search, Home } from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { BRAND, whatsappLink } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';
import { buyerFee, cashPrice, deliveryLabel, fullMoney, monthlyInstallment, pick } from '../lib/unitHelpers';

export type ThanksKind = 'sell' | 'statement' | 'viewing' | 'swap' | 'contact' | 'alert';

interface ThanksPageProps {
  kind: ThanksKind;
  /** Request code for "sell". */
  code?: string | null;
  /** The unit for "viewing". */
  unit?: RealEstateUnit | null;
  /** Other units to suggest after a viewing request. */
  suggestions?: RealEstateUnit[];
  onNavigate: (page: PageId) => void;
  onOpenRequest: (code: string | null) => void;
  onSelectUnit: (unit: RealEstateUnit) => void;
}

/** One confirmation screen for everything a visitor can send us: what we got, what happens next, where to go now. */
export const ThanksPage: React.FC<ThanksPageProps> = ({ kind, code, unit, suggestions = [], onNavigate, onOpenRequest, onSelectUnit }) => {
  const { language, tx } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the code is on screen anyway */
    }
  };

  const content = {
    sell: {
      title: tx('وصلنا طلبك.', 'We got your request.'),
      sub: tx('هنراجع بيانات وحدتك والمستندات، وهنكلمك لو في بيانات ناقصة.', "We'll review your unit's details and documents, and call you if anything is missing."),
      steps: [
        { icon: ClipboardCheck, t: tx('نراجع طلبك', 'We review your request'), d: tx('العقد والمديونية والمستندات', 'Contract, dues and documents') },
        { icon: PhoneCall, t: tx('هنكلمك لو في بيانات ناقصة', "We call you if anything's missing"), d: tx('غير كده إعلانك بينزل بعد المراجعة', 'Otherwise your listing goes live after review') },
        { icon: Users, t: tx('نوصلك بمشتري جاد', 'We find a serious buyer'), d: tx('لو قررت تبيع، واسمك ورقمك مش بيظهروا', 'If you decide to sell; your name and number stay hidden') },
        { icon: Handshake, t: tx('تتنازل وتقبض', 'Transfer & get paid'), d: tx('في مقر المطور بشيك مصرفي', 'At the developer, by bank cheque') },
      ],
    },
    viewing: {
      title: tx('وصلنا إنك مهتم بالشراء.', "We got your interest in buying."),
      sub: tx('هنكلمك خلال يوم عمل نجاوب على أسئلتك ونكمّل الإجراءات.', "We'll call within one business day to answer your questions and go ahead."),
      steps: [
        { icon: PhoneCall, t: tx('نكلمك', 'We call you'), d: tx('خلال يوم عمل', 'Within one business day') },
        { icon: CalendarCheck, t: tx('نرتب مع صاحبها', 'We arrange it with the owner'), d: tx('ونقولك الخطوات', 'And walk you through the steps') },
        { icon: FileSearch, t: tx('تطمن على الورق', 'Check the papers'), d: tx('العقد والمديونية متراجعين قبلها', 'Contract and dues already verified') },
        { icon: FileSignature, t: tx('وعد بيع', 'Promise of sale'), d: tx('بيتكتب بينك وبين صاحبها، فيه السعر وميعاد التنازل', 'Signed by you and the owner, with the price and transfer date') },
        { icon: Handshake, t: tx('تنازل رسمي', 'Official transfer'), d: tx(`في مقر المطور. عمولتنا ${BRAND.buyerFeePercent}% من سعر الوحدة، بشيك مصرفي بعد التنازل`, `At the developer. Our ${BRAND.buyerFeePercent}% of the unit price, by bank cheque after the transfer`) },
      ],
    },
    statement: {
      title: tx('طلب كشف الحساب وصل.', 'Statement request received.'),
      sub: tx('ومفيش أي التزام — وحدتك مش هتتعرض لحد ما إنت تقرر.', "No commitment — your unit isn't listed unless you decide to."),
      steps: [
        { icon: PhoneCall, t: tx('مكالمة من مستشارك', 'A call from your advisor'), d: tx('خلال يوم عمل', 'Within one business day') },
        { icon: FileSearch, t: tx('نراجع عقدك والمديونية', 'We check your contract and dues'), d: tx('ونحسب كل اختيار بالأرقام', 'And work out every option in numbers') },
        { icon: ClipboardCheck, t: tx('الكشف يوصلك على واتساب', 'Your statement on WhatsApp'), d: tx('إلغاء، بيع، تبديل، أو تكمّل — ونصيحتنا', 'Cancel, sell, swap or keep — with our advice') },
        { icon: Handshake, t: tx('القرار ليك', 'Your call'), d: tx('ولو قررت تبيع، بياناتك جاهزة', 'And if you sell, your details are ready') },
      ],
    },
    swap: {
      title: tx('طلب التبديل وصل.', 'Swap request received.'),
      sub: tx('مستشارك هيكلمك خلال يوم عمل يراجع معاك الأرقام.', 'Your advisor will call within one business day to go over the numbers.'),
      steps: [
        { icon: PhoneCall, t: tx('مكالمة من مستشارك', 'A call from your advisor'), d: tx('خلال يوم عمل', 'Within one business day') },
        { icon: FileSearch, t: tx('نراجع العقدين', 'We check both contracts'), d: tx('عقد وحدتك وعقد الوحدة الجديدة، والفرق الفعلي', 'Yours and the new one, and the real difference') },
        { icon: Users, t: tx('نلاقي مشتري لوحدتك', 'We find a buyer for yours'), d: tx('باللي دفعته، واسمك ورقمك مش بيظهروا', 'At what you paid; your name and number stay hidden') },
        { icon: Handshake, t: tx('تنازلين مترتبين مع بعض', 'Two transfers, arranged together'), d: tx(`تدفع أو تاخد الفرق بس. عمولتنا ${BRAND.buyerFeePercent}% من سعر الوحدة على كل طرف، بشيك مصرفي بعد التنازل`, `You just settle the difference. Our fee is ${BRAND.buyerFeePercent}% of the unit price from each side, by bank cheque after the transfer`) },
      ],
    },
    alert: {
      title: tx('تمام، هنبلّغك.', "Done — we'll let you know."),
      sub: tx('أول ما تنزل وحدة زي اللي بتدوّر عليها، هنبعتلك على واتساب.', "As soon as a matching unit is listed, we'll WhatsApp you."),
      steps: [],
    },
    contact: {
      title: tx('رسالتك وصلت.', 'Message received.'),
      sub: tx('هنرد عليك في أقرب وقت، غالباً في نفس اليوم.', "We'll get back to you soon — usually the same day."),
      steps: [],
    },
  }[kind];

  return (
    <div className="page-wrap py-10 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <span className="pop-in grid place-items-center w-16 h-16 rounded-full bg-brand text-white">
          <Check className="w-8 h-8" strokeWidth={2.5} />
        </span>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight text-ink">{content.title}</h1>
        <p className="mt-3 text-lg text-ink-soft leading-relaxed">{content.sub}</p>

        {/* What we received */}
        {kind === 'sell' && code && (
          <div className="mt-8 rounded-card border-2 border-brand p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">{tx('رقم طلبك — احتفظ بيه عشان تتابع', 'Your request number — keep it to follow up')}</p>
              <p className="num font-display mt-1 text-3xl sm:text-4xl font-bold text-ink" dir="ltr">
                {code}
              </p>
            </div>
            <button onClick={copyCode} className="btn-ghost min-h-11 px-4 text-sm">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? tx('اتنسخ', 'Copied') : tx('انسخ الرقم', 'Copy number')}
            </button>
          </div>
        )}
        {/* A booking: the unit's full figures, so the buyer has them in front of them before we call */}
        {kind === 'viewing' && unit && (
          <div className="mt-8 card overflow-hidden">
            <div className="flex items-center gap-4 p-3 border-b border-line">
              <img src={unit.images[0]} alt="" className="w-24 h-20 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-lg text-ink truncate">{pick(language, unit.compound, unit.compoundEn)}</p>
                <p className="text-sm text-muted truncate">{pick(language, unit.location, unit.locationEn)}</p>
                <p className="num text-xs text-muted mt-0.5" dir="ltr">
                  {unit.verificationCode}
                </p>
              </div>
            </div>

            {/* The money */}
            <dl className="p-4 sm:p-5 grid gap-2.5 text-[15px]">
              {[
                { k: tx('المطلوب كاش دلوقتي', 'Cash now'), v: fullMoney(cashPrice(unit), language) },
                { k: tx(`عمولتنا ${BRAND.buyerFeePercent}% من سعر الوحدة (بشيك مصرفي بعد التنازل)`, `Our ${BRAND.buyerFeePercent}% of the unit price (bank cheque, after the transfer)`), v: fullMoney(buyerFee(unit), language) },
                // The real instalment as the contract has it (not the per-month figure the cards compare on).
                {
                  k: tx('القسط', 'Instalment'),
                  v: unit.installmentFrequency
                    ? `${fullMoney(unit.installmentValue, language)} · ${pick(language, unit.installmentFrequency, unit.installmentFrequencyEn)}`
                    : fullMoney(monthlyInstallment(unit), language),
                },
                { k: tx('الباقي للمطور', 'Left to the developer'), v: fullMoney(unit.remainingAmount, language) },
                ...((unit.overdueFinesAmount ?? 0) > 0
                  ? [{ k: tx('متأخرات بتتخصم يوم التنازل', 'Arrears deducted on transfer day'), v: fullMoney(unit.overdueFinesAmount ?? 0, language) }]
                  : []),
              ].map((r) => (
                <div key={r.k} className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted">{r.k}</dt>
                  <dd className="num font-semibold text-ink text-end">{r.v}</dd>
                </div>
              ))}
              <div className="mt-1 pt-3 border-t border-line flex items-baseline justify-between gap-3">
                <dt className="font-bold text-ink">{tx('هتدفع إجمالي دلوقتي', 'Total you pay now')}</dt>
                <dd className="num font-display text-xl font-bold text-ink">
                  {fullMoney(cashPrice(unit) + buyerFee(unit), language)}
                </dd>
              </div>
            </dl>

            {/* The unit */}
            <div className="px-4 sm:px-5 pb-5 flex flex-wrap gap-2">
              {[
                pick(language, unit.propertyType, unit.propertyTypeEn),
                `${unit.areaM2} ${tx('م²', 'm²')}`,
                unit.bedrooms > 0 ? tx(`${unit.bedrooms} غرف`, `${unit.bedrooms} beds`) : '',
                unit.bathrooms > 0 ? tx(`${unit.bathrooms} حمام`, `${unit.bathrooms} baths`) : '',
                unit.floor ? tx(`الدور ${unit.floor}`, `Floor ${unit.floor}`) : '',
                pick(language, unit.finishing, unit.finishingEn),
                deliveryLabel(unit, language),
              ]
                .filter(Boolean)
                .map((t) => (
                  <span key={t} className="num rounded-full bg-paper border border-line px-3 py-1 text-sm text-ink-soft">
                    {t}
                  </span>
                ))}
            </div>
            <button onClick={() => onSelectUnit(unit)} className="w-full border-t border-line py-3 text-sm font-semibold text-brand hover:bg-paper">
              {tx('افتح صفحة الوحدة', 'Open the unit page')}
            </button>
          </div>
        )}
        {kind === 'swap' && unit && (
          <button onClick={() => onSelectUnit(unit)} className="mt-8 w-full card p-3 flex items-center gap-4 text-start hover:shadow-lift transition-shadow">
            <img src={unit.images[0]} alt="" className="w-24 h-20 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-lg text-ink truncate">{pick(language, unit.compound, unit.compoundEn)}</p>
              <p className="text-sm text-muted truncate">{pick(language, unit.location, unit.locationEn)}</p>
              <p className="num text-xs text-muted mt-0.5" dir="ltr">
                {unit.verificationCode}
              </p>
            </div>
          </button>
        )}

        {/* What happens next */}
        {content.steps.length > 0 && (
          <div className="mt-10">
            {(kind === 'sell' || kind === 'statement' || kind === 'swap') && (
              <img src={BRAND.keysImage} alt="" loading="lazy" className="mb-8 w-full h-40 sm:h-52 object-cover rounded-card" />
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-ink">{tx('اللي هيحصل بعد كده', 'What happens next')}</h2>
            <ol className="mt-5 relative space-y-5 before:absolute before:top-2 before:bottom-2 before:start-5 before:w-px before:bg-line-strong">
              {content.steps.map((s, i) => (
                <li key={s.t} className="relative flex items-start gap-4">
                  <span className={`relative grid place-items-center w-10 h-10 rounded-full shrink-0 ${i === 0 ? 'bg-brand text-white' : 'bg-surface border border-line text-ink'}`}>
                    <s.icon className="w-5 h-5" />
                  </span>
                  <div className="pt-1.5">
                    <p className="font-bold text-ink">{s.t}</p>
                    <p className="text-sm text-muted mt-0.5">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Where to go now */}
        <div className="mt-10 flex flex-wrap gap-3">
          {kind === 'sell' && (
            <>
              <button onClick={() => onOpenRequest(code ?? null)} className="btn-primary">
                <ClipboardList className="w-5 h-5" />
                {tx('كمّل بيانات وحدتك', 'Complete your unit details')}
              </button>
              <button onClick={() => onNavigate('swap')} className="btn-ghost">
                {tx('ولا تحب تبدّلها؟', 'Or swap it instead?')}
              </button>
            </>
          )}
          {(kind === 'viewing' || kind === 'alert' || kind === 'swap') && (
            <button onClick={() => onNavigate('opportunities')} className="btn-primary">
              <Search className="w-5 h-5" />
              {tx('كمّل تصفح الوحدات', 'Keep browsing')}
            </button>
          )}
          {kind === 'statement' && (
            <button onClick={() => onNavigate('sell')} className="btn-primary">
              <ClipboardList className="w-5 h-5" />
              {tx('عايز تعرضها للبيع دلوقتي؟', 'Want to list it now?')}
            </button>
          )}
          {kind === 'contact' && (
            <button onClick={() => onNavigate('home')} className="btn-primary">
              <Home className="w-5 h-5" />
              {tx('الرئيسية', 'Home')}
            </button>
          )}
          <a href={whatsappLink(code ? tx(`بخصوص طلب ${code}`, `About request ${code}`) : undefined)} target="_blank" rel="noreferrer" className="btn-ghost">
            <MessageCircle className="w-5 h-5" />
            {tx('مستعجل؟ كلمنا واتساب', 'In a hurry? WhatsApp us')}
          </a>
        </div>
        {kind === 'sell' && (
          <p className="mt-4 text-sm text-muted">
            {tx('كل ما تكمّل بيانات أكتر، كل ما كشف الحساب يطلع أدق وأسرع.', 'The more details you add, the faster and more accurate your statement.')}
          </p>
        )}
      </div>

      {kind === 'viewing' && suggestions.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">{tx('وحدات ممكن تعجبك كمان', 'You might also like')}</h2>
          <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {suggestions.map((u) => (
              <div key={u.id} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <UnitCard unit={u} onOpen={onSelectUnit} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
