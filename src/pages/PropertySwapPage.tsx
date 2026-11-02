import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Repeat, ArrowDownUp, MessageCircle, ArrowDown, ArrowUp, X, ClipboardList, Search, Handshake } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UnitCard } from '../components/UnitCard';
import { Pagination } from '../components/Pagination';
import { Field, MoneyInput, Toggle } from '../components/sell/FormBits';
import { BRAND, whatsappLink } from '../config/brand';
import { PROPERTY_TYPES, buyerFee, cashPrice, feeOn, currency, money, monthlyInstallment, pick } from '../lib/unitHelpers';
import { placeName, useRegions } from '../lib/places';
import { isResidential, isValidPhone } from '../lib/sellForm';
import { errorText, sendSwap } from '../services/api';
import { FieldError, FormError } from '../components/FormError';

interface PropertySwapPageProps {
  units: RealEstateUnit[];
  onSelectUnit: (unit: RealEstateUnit) => void;
  /** Called once a swap request is sent for a target unit. */
  onRequested: (unit: RealEstateUnit) => void;
}

const PAGE_SIZE = 12;

/**
 * Swap = two owners exchange units: each takes the other's unit and carries on its plan; only the difference in what
 * was paid changes hands. So only units whose owner said "open to swap" are shown — and an advisor gets that owner's
 * OK on this visitor's unit before anything moves.
 */
export const PropertySwapPage: React.FC<PropertySwapPageProps> = ({ units, onSelectUnit, onRequested }) => {
  const { language, tx, isRTL } = useLanguage();
  const { requireAuth } = useAuth();
  const [myPaid, setMyPaid] = useState(0);
  const [myMonthly, setMyMonthly] = useState(0);
  const [myPrice, setMyPrice] = useState(0);
  const [hasArrears, setHasArrears] = useState(false);
  const [arrearsAmount, setArrearsAmount] = useState(0);
  const regions = useRegions();
  const [wantRegion, setWantRegion] = useState<number | null>(null);
  // 'residential' is a group, not a type: most people swapping out of a home want another home.
  const [wantType, setWantType] = useState('residential');
  const [lowerOnly, setLowerOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<RealEstateUnit | null>(null);
  const resultsTop = useRef<HTMLDivElement>(null);

  const myArrears = hasArrears ? arrearsAmount : 0;
  // What actually comes out of selling theirs: what they paid, less the arrears settled at transfer.
  const myNet = Math.max(0, myPaid - myArrears);
  // Both owners pay our fee in a swap, each on the unit they take — so what comes out of this visitor's pocket is the
  // difference between the two units plus their fee on the unit they're taking.
  const swapDiff = (u: RealEstateUnit) => cashPrice(u) - myNet + buyerFee(u);

  // "Lower monthly" only means something once we know their current monthly.
  const filterLower = lowerOnly && myMonthly > 0;

  const matches = useMemo(
    () =>
      units
        .filter((u) => u.eligibleForSwap === true)
        .filter((u) => !wantRegion || u.regionId === wantRegion)
        .filter((u) => !wantType || (wantType === 'residential' ? isResidential(u.propertyType) : u.propertyType === wantType))
        .filter((u) => !filterLower || monthlyInstallment(u) < myMonthly)
        .sort((a, b) =>
          filterLower
            ? monthlyInstallment(a) - monthlyInstallment(b)
            : myPaid
              ? Math.abs(swapDiff(a)) - Math.abs(swapDiff(b))
              : 0,
        ),
    [units, wantRegion, wantType, filterLower, myMonthly, myPaid, myNet],
  );

  useEffect(() => setPage(1), [wantRegion, wantType, filterLower, myMonthly, myPaid, myArrears]);

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const diffTag = (u: RealEstateUnit) => {
    if (!myPaid) return undefined;
    const diff = swapDiff(u);
    return {
      strong: diff <= 0,
      label:
        diff > 0
          ? tx(`تدفع فرق ${money(diff, language)}`, `You pay ${money(diff, language)}`)
          : diff < 0
            ? tx(`تاخد فرق ${money(-diff, language)}`, `You get ${money(-diff, language)}`)
            : tx('من غير فرق', 'Even swap'),
    };
  };

  return (
    <div className="page-wrap py-8 sm:py-12">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft text-ink px-3.5 py-1.5 text-sm font-semibold">
          <Repeat className="w-4 h-4" />
          {tx('حصري عندنا', 'Only here')}
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink">{tx('بدّل وحدتك بوحدة قسطها يريحك', 'Swap for a unit whose instalment you can manage')}</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          {tx(
            'لاقي حد عايز يبدل معاك: انت تاخد وحدته وهو ياخد وحدتك، وكل واحد يكمّل أقساط اللي خده. بنوريك بس الوحدات اللي أصحابها عايزين يبدلوا، واللي بيتدفع هو الفرق بس.',
            "Find an owner who wants to swap with you: you take their unit, they take yours, and each carries on the other's plan. Only units whose owners want to swap are shown, and only the difference changes hands.",
          )}
        </p>
      </div>

      {/* How it works — the questions everyone has before they try it. */}
      <ol className="mt-8 grid sm:grid-cols-3 gap-3">
        {[
          { icon: ClipboardList, t: tx('قولنا وحدتك وعاوز إيه', 'Tell us your unit and what you want'), d: tx('اللي دفعته وقسطك، والمنطقة والنوع', 'What you paid, your monthly, area and type') },
          { icon: Search, t: tx('ناخد موافقة الطرف التاني', "We get the other owner's OK"), d: tx('بنعرض عليه وحدتك، ونراجع العقدين', 'We show them your unit and check both contracts') },
          {
            icon: Handshake,
            t: tx('تبدلوا في نفس اليوم', 'Swap on the same day'),
            d: tx(
              `كل واحد يكمّل أقساط اللي خده، والفرق بيتسوّى بينكم. عمولتنا ${BRAND.buyerFeePercent}% على كل طرف من سعر الوحدة اللي بياخدها، بشيك مصرفي بعد التنازل`,
              `Each carries on the other's plan; you settle the difference. Our fee is ${BRAND.buyerFeePercent}% from each side, on the price of the unit they take, by bank cheque after the transfer`,
            ),
          },
        ].map((s, i) => (
          <li key={s.t} className="card p-4 flex items-start gap-3">
            <span className="num grid place-items-center w-8 h-8 rounded-full bg-brand text-white text-sm font-bold shrink-0">{i + 1}</span>
            <div>
              <p className="font-bold text-ink">{s.t}</p>
              <p className="mt-0.5 text-sm text-muted">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 card p-6 sm:p-8 grid lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-start">
        <div className="space-y-4">
          <p className="font-bold text-ink">{tx('وحدتك', 'Your unit')}</p>
          <Field label={tx('دفعت فيها كام؟', 'Paid so far')} htmlFor="sw-paid" hint={tx('عشان نحسب الفرق', 'To work out the difference')}>
            <MoneyInput id="sw-paid" value={myPaid} onChange={setMyPaid} placeholder="1,500,000" />
          </Field>
          <Field label={tx('قسطك الشهري دلوقتي كام؟', 'Your monthly instalment now')} htmlFor="sw-monthly" hint={tx('لو بتدفع كل 3 شهور، اقسم على 3', 'If you pay quarterly, divide by 3')}>
            <MoneyInput id="sw-monthly" value={myMonthly} onChange={setMyMonthly} placeholder="55,000" />
          </Field>
          <Field
            label={tx('سعر العقد بتاع وحدتك', "Your unit's contract price")}
            htmlFor="sw-price"
            hint={tx(`عمولتنا ${BRAND.buyerFeePercent}% على كل طرف من سعر الوحدة اللي بياخدها`, `Our fee is ${BRAND.buyerFeePercent}% from each side, on the price of the unit they take`)}
          >
            <MoneyInput id="sw-price" value={myPrice} onChange={setMyPrice} placeholder="4,000,000" />
          </Field>
          <Toggle
            tone="danger"
            label={tx('عليك متأخرات؟', 'Any arrears?')}
            hint={tx('بتتسدد من فلوس وحدتك يوم التنازل', 'Settled from your unit’s money on transfer day')}
            on={hasArrears}
            onChange={setHasArrears}
          >
            <Field label={tx('حوالي كام؟', 'Roughly how much?')} htmlFor="sw-arrears">
              <MoneyInput id="sw-arrears" value={arrearsAmount} onChange={setArrearsAmount} placeholder="80,000" />
            </Field>
          </Toggle>
        </div>

        <span className="hidden lg:grid self-center place-items-center w-12 h-12 rounded-full bg-brand-soft text-ink">
          <ArrowDownUp className="w-5 h-5 rotate-90" />
        </span>

        <div className="space-y-5">
          <p className="font-bold text-ink">{tx('عاوز إيه بدالها؟', 'What do you want instead?')}</p>
          <Toggle
            label={tx('قسطها أقل من قسطي', 'Lower monthly than mine')}
            hint={myMonthly ? tx('بنرتّبها من الأقل قسط', 'Sorted from the lowest monthly') : tx('اكتب قسطك الأول', 'Enter your monthly first')}
            on={lowerOnly}
            onChange={setLowerOnly}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('المنطقة', 'Area')} htmlFor="sw-region">
              <select id="sw-region" value={wantRegion ?? ''} onChange={(e) => setWantRegion(e.target.value ? Number(e.target.value) : null)} className="field">
                <option value="">{tx('أي منطقة', 'Any area')}</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {placeName(r, language)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={tx('نوع الوحدة', 'Unit type')} htmlFor="sw-type">
              <select id="sw-type" value={wantType} onChange={(e) => setWantType(e.target.value)} className="field">
                <option value="residential">{tx('أي سكني', 'Any home')}</option>
                <option value="">{tx('أي نوع', 'Any type')}</option>
                {PROPERTY_TYPES.map((p) => (
                  <option key={p.ar} value={p.ar}>
                    {language === 'ar' ? p.ar : p.en}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </div>

      <div ref={resultsTop} className="mt-10 scroll-mt-24">
        <p className="text-ink-soft">
          <span className="num font-bold text-ink">{matches.length}</span> {tx('وحدة أصحابها عايزين يبدلوا', 'units whose owners want to swap')}
          {filterLower && <span className="text-muted"> · {tx('قسطها أقل من قسطك', 'lower monthly than yours')}</span>}
        </p>
      </div>

      {matches.length > 0 ? (
        <>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((u) => {
              const change = myMonthly ? monthlyInstallment(u) - myMonthly : 0;
              return (
                <UnitCard
                  key={u.id}
                  unit={u}
                  onOpen={onSelectUnit}
                  tag={diffTag(u)}
                  footer={
                    <div className="mt-4 pt-4 border-t border-line space-y-3">
                      {/* What this owner is after — the visitor can tell at a glance whether their unit fits. */}
                      {(u.swapTargetType || u.swapTargetTypeEn) && (
                        <p className="flex items-start gap-1.5 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-ink">
                          <Repeat className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>
                            <span className="font-semibold">{tx('صاحبها عايز بدالها: ', 'Owner wants: ')}</span>
                            {pick(language, u.swapTargetType ?? '', u.swapTargetTypeEn)}
                          </span>
                        </p>
                      )}
                      {myMonthly > 0 && (
                        <p className={`num flex items-center gap-1.5 text-sm font-semibold ${change < 0 ? 'text-ink' : 'text-danger'}`}>
                          {change < 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                          {change < 0
                            ? tx(`قسطك هيقل ${money(-change, language)} في الشهر`, `Your monthly drops by ${money(-change, language)}`)
                            : tx(`قسطك هيزيد ${money(change, language)} في الشهر`, `Your monthly rises by ${money(change, language)}`)}
                        </p>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requireAuth(() => setTarget(u));
                        }}
                        className="btn-primary w-full min-h-12"
                      >
                        <Repeat className="w-4 h-4" />
                        {tx('اطلب التبديل ده', 'Request this swap')}
                      </button>
                    </div>
                  }
                />
              );
            })}
          </div>
          <div className="mt-10">
            <Pagination
              page={current}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                resultsTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
          </div>
        </>
      ) : (
        <div className="mt-5 card p-10 text-center">
          <p className="font-bold text-lg text-ink">{tx('مفيش وحدة بالمواصفات دي دلوقتي', 'Nothing matches right now')}</p>
          <p className="mt-1 text-muted">{tx('جرّب منطقة أو نوع تاني، أو ابعتلنا وإحنا ندوّرلك.', 'Try another area or type, or message us and we’ll look for you.')}</p>
          <a href={whatsappLink(tx('عاوز أبدّل وحدتي', 'I want to swap my unit'))} target="_blank" rel="noreferrer" className="btn-primary mt-6">
            <MessageCircle className="w-5 h-5" />
            {tx('كلمنا واتساب', 'WhatsApp us')}
          </a>
        </div>
      )}

      {target && (
        <SwapRequestSheet
          target={target}
          myPaid={myPaid}
          myArrears={myArrears}
          myPrice={myPrice}
          diff={myPaid ? swapDiff(target) : null}
          myMonthly={myMonthly}
          onClose={() => setTarget(null)}
          onSent={() => {
            const u = target;
            setTarget(null);
            onRequested(u);
          }}
        />
      )}
    </div>
  );
};

/** Name + phone, with a summary of the swap — enough for an advisor to call back. */
const SwapRequestSheet: React.FC<{
  target: RealEstateUnit;
  myPaid: number;
  myArrears: number;
  /** Contract price of the visitor's own unit — the other owner's side of our fee. 0 = not given. */
  myPrice: number;
  /** New unit's cash, minus what theirs nets, plus their fee on the new unit. null until they enter what they paid. */
  diff: number | null;
  myMonthly: number;
  onClose: () => void;
  onSent: () => void;
}> = ({ target, myPaid, myArrears, myPrice, diff, myMonthly, onClose, onSent }) => {
  const { language, tx, isRTL } = useLanguage();
  const { user } = useAuth();
  const [name, setName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  // Each owner pays our fee on the unit they take.
  const myFee = buyerFee(target);
  const theirFee = feeOn(myPrice);
  const nameBad = name.trim().length < 2;
  const phoneBad = !isValidPhone(phone);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (nameBad || phoneBad || sending) return;
    setSending(true);
    setSendError('');
    try {
      await sendSwap({
        targetUnitId: Number(target.id),
        name: name.trim(),
        phone: phone.replace(/\s/g, ''),
        myPaid: myPaid || undefined,
        myMonthly: myMonthly || undefined,
        myContractPrice: myPrice || undefined,
        // The API has no field for arrears yet, so they ride along in the notes for the advisor.
        notes: myArrears > 0 ? `متأخرات على وحدته: ${myArrears.toLocaleString('en-US')} ج.م` : undefined,
      });
      onSent();
    } catch (err) {
      setSendError(errorText(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="swap-title">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <form onSubmit={submit} noValidate className="relative w-full sm:max-w-md bg-surface rounded-t-card sm:rounded-card p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <p id="swap-title" className="font-display text-xl font-bold text-ink">
            {tx('اطلب التبديل', 'Request the swap')}
          </p>
          <button type="button" onClick={onClose} aria-label={tx('إغلاق', 'Close')} className="grid place-items-center w-10 h-10 rounded-full hover:bg-paper -mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <dl className="mt-4 rounded-xl bg-paper p-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{tx('الوحدة الجديدة', 'New unit')}</dt>
            <dd className="font-semibold text-ink text-end truncate">{pick(language, target.compound, target.compoundEn)}</dd>
          </div>
          {diff !== null && (
            <>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">
                  {diff > 0 ? tx('هتدفع فرق', "You'll pay") : diff < 0 ? tx('هتاخد فرق', "You'll get") : tx('الفرق', 'Difference')}
                </dt>
                <dd className="num font-semibold text-ink">
                  {diff === 0 ? tx('من غير فرق', 'Even swap') : `${money(Math.abs(diff), language)} ${currency(language)}`}
                </dd>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {tx(`محسوب بعد عمولتنا عليك ${money(myFee, language)} (${BRAND.buyerFeePercent}% من سعر الوحدة اللي هتاخدها)`, `Includes your fee of ${money(myFee, language)} (${BRAND.buyerFeePercent}% of the price of the unit you take)`)}
                {myArrears > 0 && tx(` وبعد متأخراتك ${money(myArrears, language)}`, ` and your ${money(myArrears, language)} arrears`)}
              </p>
            </>
          )}
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{tx('قسطك الجديد تقريباً', 'New monthly, roughly')}</dt>
            <dd className="num font-semibold text-ink">
              {money(monthlyInstallment(target), language)} {currency(language)}
              {myMonthly > 0 && <span className="text-muted font-normal"> {tx(`بدل ${money(myMonthly, language)}`, `vs ${money(myMonthly, language)}`)}</span>}
            </dd>
          </div>
        </dl>

        {/* Both owners pay us — say so before they send, not after. */}
        <div className="mt-3 rounded-xl border border-brand/25 bg-brand-soft px-4 py-3 text-sm text-brand-ink leading-relaxed">
          <p className="font-bold">{tx(`عمولتنا ${BRAND.buyerFeePercent}% على كل طرف من سعر الوحدة اللي بياخدها`, `Our fee: ${BRAND.buyerFeePercent}% from each side, on the price of the unit they take`)}</p>
          <p className="mt-1">
            {tx('عليك', 'You')}: <span className="num font-semibold">{money(myFee, language)} {currency(language)}</span>
            {' · '}
            {tx('على صاحب الوحدة', 'The other owner')}: <span className="num font-semibold">{theirFee ? `${money(theirFee, language)} ${currency(language)}` : tx(`${BRAND.buyerFeePercent}% من سعر وحدتك`, `${BRAND.buyerFeePercent}% of your unit's price`)}</span>
          </p>
          <p className="mt-1 text-xs">{tx('بتتدفع بشيك مصرفي بعد التنازل', 'Paid by bank cheque after the transfer')}</p>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="sw-name" className="label">
              {tx('اسمك', 'Your name')}
            </label>
            <input id="sw-name" value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" autoFocus aria-invalid={tried && nameBad} />
            <FieldError show={tried && nameBad}>{tx('اكتب اسمك', 'Enter your name')}</FieldError>
          </div>
          <div>
            <label htmlFor="sw-phone" className="label">
              {tx('موبايل (واتساب)', 'Mobile (WhatsApp)')}
            </label>
            <input
              id="sw-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              dir="ltr"
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
              aria-invalid={tried && phoneBad}
              className={`field ${isRTL ? 'text-right' : 'text-left'}`}
            />
            <FieldError show={tried && phoneBad}>{tx('رقم موبايل مصري صحيح، 11 رقم', 'A valid 11-digit Egyptian mobile')}</FieldError>
          </div>
        </div>

        <button type="submit" disabled={sending} className="btn-primary w-full mt-6 min-h-13">
          <Repeat className="w-5 h-5" />
          {sending ? tx('بنبعت...', 'Sending...') : tx('ابعت طلب التبديل', 'Send swap request')}
        </button>
        <FormError className="mt-4" messages={sendError} />
        <p className="mt-3 text-center text-xs text-muted">{tx('الأرقام تقديرية لحد ما نراجع العقدين. مفيش أي التزام دلوقتي.', 'Figures are estimates until both contracts are reviewed. No commitment now.')}</p>
      </form>
    </div>
  );
};
