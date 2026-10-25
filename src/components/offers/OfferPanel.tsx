import React, { useEffect, useMemo, useState } from 'react';
import { HandCoins, Inbox } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { CASH_PLAN, CashPlan, createOffer, errorText, fetchUnitOfferState, OfferThread, UnitOfferState } from '../../services/api';
import { fullMoney } from '../../lib/unitHelpers';
import { cashPlanLabel, isOpenOffer, offerLadder } from '../../lib/offers';
import { OfferThreadView } from './OfferThreadView';
import { AmountPicker, CashPlanPicker } from './OfferPickers';

/**
 * "فاوض على السعر" on a negotiable unit: a price from 75% of the asking cash up to asking − 10,000 plus how the cash
 * is paid, then the negotiation itself once the offer is in. The owner sees a link to the offers on their unit instead.
 * If the API doesn't know about offers yet (not deployed), the panel simply stays hidden.
 */
export const OfferPanel: React.FC<{ unitId: string }> = ({ unitId }) => {
  const { language, tx } = useLanguage();
  const { user, requireAuth } = useAuth();
  const [state, setState] = useState<UnitOfferState | null>(null);
  const [open, setOpen] = useState(false);
  // null = the top of the range: the buyer starts near the asking price, not anchored on the lowest figure.
  const [picked, setPicked] = useState<number | null>(null);
  const [plan, setPlan] = useState<CashPlan>(CASH_PLAN.full);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    setOpen(false);
    fetchUnitOfferState(unitId)
      .then((s) => live && setState(s))
      .catch(() => live && setState(null));
    return () => {
      live = false;
    };
  }, [unitId, user?.id]);

  // Paying the cash in instalments can keep the full asking price — the ask is about how to pay, not how much.
  const ladder = useMemo(() => {
    if (!state) return [];
    const base = offerLadder(state.floorPrice, state.maxOffer, state.step, true);
    return plan === CASH_PLAN.installments && !base.includes(state.askingPrice) ? [...base, state.askingPrice] : base;
  }, [state, plan]);
  if (!state || !state.negotiable) return null;

  const money = (v: number) => fullMoney(v, language);
  const amount = picked !== null && ladder.includes(picked) ? picked : ladder[ladder.length - 1] ?? state.maxOffer;
  const thread = state.thread;
  const setThread = (t: OfferThread) => setState({ ...state, thread: t, canOffer: false });

  if (state.isOwner)
    return (
      <div className="card p-4 grid gap-2">
        <p className="flex items-center gap-2 font-bold text-ink">
          <Inbox className="w-5 h-5 text-brand" />
          {state.openThreadsOnUnit > 0
            ? tx(`فيه ${state.openThreadsOnUnit} عرض مفتوح على وحدتك`, `${state.openThreadsOnUnit} open offer(s) on your unit`)
            : tx('مفيش عروض مفتوحة على وحدتك دلوقتي', 'No open offers on your unit right now')}
        </p>
        <a href="#offers/received" className="btn-ghost min-h-11 w-full">
          {tx('العروض على وحدتك', 'Offers on your unit')}
        </a>
      </div>
    );

  const submit = async () => {
    setSending(true);
    setError('');
    try {
      setThread(await createOffer(Number(unitId), amount, plan));
      setOpen(false);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setSending(false);
    }
  };

  // A live (or just-finished) negotiation on this unit takes the panel.
  if (thread && (isOpenOffer(thread) || !state.canOffer))
    return (
      <div className="card p-4 grid gap-3">
        <p className="flex items-center gap-2 font-bold text-ink">
          <HandCoins className="w-5 h-5 text-brand" />
          {tx('عرضك على الوحدة دي', 'Your offer on this unit')}
        </p>
        <OfferThreadView thread={thread} onChange={setThread} />
        <a href={`#offers/${thread.id}`} className="text-center text-sm font-semibold text-brand underline min-h-10">
          {tx('كل عروضي', 'All my offers')}
        </a>
      </div>
    );

  if (!state.canOffer)
    return user && state.reason ? <p className="card p-4 text-sm text-muted">{state.reason}</p> : null;

  const steps = [
    tx('اختار السعر اللي يناسبك وابعته', 'Pick the price that suits you and send it'),
    tx('صاحب الوحدة يوافق، أو يرد عليك بسعر أو طريقة دفع تانية', 'The owner accepts, or answers with another price or payment'),
    tx('لو اتفقتوا، الوحدة بتتحجز لك وإحنا نكلمك', "If you agree, the unit is reserved for you and we call you"),
  ];

  return (
    <div className="card overflow-hidden">
      {!open ? (
        <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 border-s-4 border-accent">
          <div className="flex-1 min-w-0">
            <p className="text-xl font-extrabold text-ink">{tx('السعر مش مناسبك؟', 'Price not right for you?')}</p>
            <p className="mt-1 text-sm text-ink-soft leading-relaxed">
              {tx(
                'صاحب الوحدة مستعد يتفاوض. قوله على السعر اللي تقدر تدفعه، وهو يرد عليك هنا على الموقع.',
                "The owner is open to negotiating. Tell them the price you can pay and they'll answer you here on the site.",
              )}
            </p>
          </div>
          <div className="shrink-0 grid gap-1.5 md:w-80">
            <button
              onClick={() => requireAuth(() => setOpen(true))}
              className="btn-accent min-h-14 w-full rounded-xl text-lg font-extrabold shadow-lift hover:scale-[1.01] transition-transform"
            >
              <HandCoins className="w-6 h-6" />
              {tx('فاوض على السعر', 'Negotiate the price')}
            </button>
            <p className="text-xs text-muted text-center">{tx('ببلاش، ومن غير ما حد يعرف رقمك أو اسمك', 'Free, and nobody sees your name or number')}</p>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="grid gap-5 content-start">
            <div className="grid gap-3">
              <p className="flex items-center gap-2 text-lg font-extrabold text-ink">
                <span className="num grid place-items-center w-7 h-7 rounded-full bg-brand text-white text-sm font-bold shrink-0">1</span>
                {tx('عايز تدفع كام؟', 'How much do you offer?')}
              </p>
              <AmountPicker values={ladder} value={amount} onChange={setPicked} reference={state.askingPrice} />
            </div>
            <div className="grid gap-3">
              <p className="flex items-center gap-2 text-lg font-extrabold text-ink">
                <span className="num grid place-items-center w-7 h-7 rounded-full bg-brand text-white text-sm font-bold shrink-0">2</span>
                {tx('هتدفع الكاش إزاي؟', 'How will you pay the cash?')}
              </p>
              <CashPlanPicker value={plan} onChange={setPlan} />
            </div>
          </div>

          <div className="grid gap-4 content-start">
            {/* What the owner will see, before it's sent */}
            <div className="rounded-xl bg-paper border border-line divide-y divide-line">
              <p className="px-4 py-3 text-sm font-bold text-ink">{tx('عرضك لصاحب الوحدة', 'Your offer to the owner')}</p>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm text-muted">{tx('السعر المطلوب', 'Asking price')}</span>
                <span className="num font-bold text-muted line-through">{money(state.askingPrice)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm font-bold text-ink">{tx('عرضك', 'Your offer')}</span>
                <span className="num font-display text-2xl font-extrabold text-brand-ink">{money(amount)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm text-muted">{tx('طريقة الدفع', 'Payment')}</span>
                <span className="text-sm font-bold text-ink text-end">{cashPlanLabel(plan, tx)}</span>
              </div>
              {amount < state.askingPrice ? (
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-emerald-50">
                  <span className="text-sm font-bold text-emerald-800">{tx('هتوفّر لو وافق', 'You save if accepted')}</span>
                  <span className="num text-lg font-extrabold text-emerald-700">{money(state.askingPrice - amount)}</span>
                </div>
              ) : (
                // Full price, cash in instalments: the ask is only about how to pay.
                <p className="px-4 py-3 bg-brand-soft text-sm font-semibold text-brand-ink">
                  {tx('بالسعر المطلوب — بتطلب بس تقسّط الكاش', 'At the asking price — you only ask to pay the cash in instalments')}
                </p>
              )}
            </div>

            <ol className="grid gap-2">
              {steps.map((t, i) => (
                <li key={t} className="flex items-start gap-3 text-sm text-ink-soft">
                  <span className="num grid place-items-center w-6 h-6 rounded-full bg-brand-soft text-brand text-xs font-bold shrink-0">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted leading-relaxed">
              {tx(
                'كل طرف عنده 48 ساعة يرد. لو صاحب الوحدة رفض، مش هتقدر تعرض تاني على نفس الوحدة.',
                'Each side has 48 hours to answer. If the owner says no, you can’t offer on this unit again.',
              )}
            </p>

          <div className="flex gap-2">
            <button disabled={sending || ladder.length === 0} onClick={submit} className="btn-primary flex-1 min-h-13 text-base">
              {sending ? tx('بنبعت...', 'Sending...') : tx(`ابعت عرض ${money(amount)}`, `Send ${money(amount)}`)}
            </button>
            <button disabled={sending} onClick={() => setOpen(false)} className="btn-ghost min-h-13 px-4">
              {tx('إلغاء', 'Cancel')}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          </div>
        </div>
      )}
    </div>
  );
};
