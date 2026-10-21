import React, { useEffect, useMemo, useState } from 'react';
import { HandCoins, Inbox } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createOffer, errorText, fetchUnitOfferState, OfferThread, UnitOfferState } from '../../services/api';
import { fullMoney } from '../../lib/unitHelpers';
import { isOpenOffer, offerLadder } from '../../lib/offers';
import { OfferThreadView } from './OfferThreadView';

/**
 * "اعرض سعرك" on a negotiable unit: a slider from 90% of the asking cash up to asking − 10,000,
 * then the negotiation itself once the offer is in. The owner sees a link to the offers on their unit instead.
 * If the API doesn't know about offers yet (not deployed), the panel simply stays hidden.
 */
export const OfferPanel: React.FC<{ unitId: string }> = ({ unitId }) => {
  const { language, tx } = useLanguage();
  const { user, requireAuth } = useAuth();
  const [state, setState] = useState<UnitOfferState | null>(null);
  const [open, setOpen] = useState(false);
  // null = the top of the range: the buyer starts near the asking price, not anchored on the lowest figure.
  const [idx, setIdx] = useState<number | null>(null);
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

  const ladder = useMemo(() => (state ? offerLadder(state.floorPrice, state.maxOffer, state.step, true) : []), [state]);
  if (!state || !state.negotiable) return null;

  const money = (v: number) => fullMoney(v, language);
  const pick = Math.min(idx ?? ladder.length - 1, ladder.length - 1);
  const amount = ladder[pick] ?? state.maxOffer;
  const below = state.askingPrice > 0 ? Math.round(((state.askingPrice - amount) / state.askingPrice) * 1000) / 10 : 0;
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
      setThread(await createOffer(Number(unitId), amount));
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

  return (
    <div className={open ? 'card p-4 grid gap-3' : ''}>
      {!open ? (
        // A big call to action on its own — as prominent as "book this unit".
        <button
          onClick={() => requireAuth(() => setOpen(true))}
          className="btn-accent min-h-16 w-full rounded-card text-xl font-extrabold shadow-lift hover:scale-[1.01] transition-transform"
        >
          <HandCoins className="w-7 h-7" />
          {tx('اعرض سعرك', 'Make an offer')}
        </button>
      ) : (
        <>
          <p className="font-bold text-ink">{tx('اختار عرضك', 'Pick your offer')}</p>
          <p className="num text-center font-display text-3xl font-extrabold text-ink">{money(amount)}</p>
          <p className="text-center text-xs text-muted">
            {tx(`أقل من المطلوب بـ ${below}%`, `${below}% below asking`)} · {tx(`+ عمولتنا ${money(Math.round((amount * state.buyerFeePercent) / 100))} بعد التوقيع`, `+ our ${money(Math.round((amount * state.buyerFeePercent) / 100))} fee after signing`)}
          </p>
          <input
            type="range"
            min={0}
            max={Math.max(0, ladder.length - 1)}
            step={1}
            value={pick}
            onChange={(e) => setIdx(Number(e.target.value))}
            disabled={ladder.length < 2}
            aria-label={tx('قيمة العرض', 'Offer amount')}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-muted num">
            <span>{money(ladder[0] ?? state.floorPrice)}</span>
            <span>{money(ladder[ladder.length - 1] ?? state.maxOffer)}</span>
          </div>
          <ul className="text-xs text-ink-soft grid gap-1 list-disc ps-4">
            <li>{tx('صاحب الوحدة يقبل، أو يرد بسعر، أو يرفض. لو رفض مش هتقدر تعرض تاني على نفس الوحدة.', 'The owner accepts, counters or rejects. A rejection is final for this unit.')}</li>
            <li>{tx('لكل طرف 3 حركات بس، وكل واحد عنده 48 ساعة يرد.', 'Three moves each, 48 hours per turn.')}</li>
            <li>{tx('لو اتفقتوا الوحدة بتتحجز لك وفريقنا يكلمك خلال يوم عمل.', "If you agree, the unit is reserved for you and we call within one business day.")}</li>
          </ul>
          <div className="flex gap-2">
            <button disabled={sending || ladder.length === 0} onClick={submit} className="btn-primary flex-1 min-h-12">
              {sending ? tx('بنبعت...', 'Sending...') : tx('ابعت العرض', 'Send offer')}
            </button>
            <button disabled={sending} onClick={() => setOpen(false)} className="btn-ghost min-h-12 px-4">
              {tx('إلغاء', 'Cancel')}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
};
