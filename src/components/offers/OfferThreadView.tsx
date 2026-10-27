import React, { useMemo, useState } from 'react';
import { Check, Clock, Handshake, Undo2, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CashPlan, errorText, offerAction, OfferAction, OfferThread } from '../../services/api';
import { fullMoney } from '../../lib/unitHelpers';
import { BRAND } from '../../config/brand';
import { cashPlanLabel, isOpenOffer, moveSide, moveText, offerLadder, offerStatusLabel, timeLeft } from '../../lib/offers';
import { AmountPicker, CashPlanPicker } from './OfferPickers';

const STEP = 10_000;

const TONE: Record<string, string> = {
  turn: 'bg-accent-soft text-accent-ink',
  wait: 'bg-brand-soft text-brand',
  good: 'bg-emerald-100 text-emerald-800',
  off: 'bg-line text-muted',
};

/**
 * One negotiation as chat bubbles: every move is a type + amount + cash plan + time, no free text.
 * Shows only the buttons the server says the caller may press right now.
 */
export const OfferThreadView: React.FC<{ thread: OfferThread; onChange: (t: OfferThread) => void }> = ({ thread: t, onChange }) => {
  const { language, tx } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<OfferAction | null>(null);
  const [picking, setPicking] = useState(false);

  const moving: OfferAction | null = t.actions.includes('counter') ? 'counter' : t.actions.includes('raise') ? 'raise' : null;
  const ladder = useMemo(
    () => (moving && t.nextMin !== null && t.nextMax !== null ? offerLadder(t.nextMin, t.nextMax, STEP) : []),
    [moving, t.nextMin, t.nextMax],
  );
  // Counters start high (close to asking), raises start low (close to the last offer) — both sides open with their own interest.
  const [picked, setPicked] = useState<number | null>(null);
  const amount = picked !== null && ladder.includes(picked) ? picked : moving === 'counter' ? ladder[ladder.length - 1] : ladder[0];
  const [plan, setPlan] = useState<CashPlan | null>(null);
  const nextPlan = plan ?? t.cashPlan;

  const status = offerStatusLabel(t, tx);
  const left = isOpenOffer(t) ? timeLeft(t.deadlineAt, tx) : null;
  const money = (v: number) => fullMoney(v, language);

  const run = async (action: OfferAction, value?: number) => {
    setBusy(true);
    setError('');
    try {
      onChange(await offerAction(t.id, action, value, value === undefined ? undefined : nextPlan));
      setConfirm(null);
      setPicking(false);
      setPicked(null);
      setPlan(null);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  const confirmText: Partial<Record<OfferAction, string>> = {
    accept:
      t.role === 'buyer'
        ? tx(
            `هتوافق على ${money(t.lastSellerCounter ?? 0)} (${cashPlanLabel(t.cashPlan, tx)}) والوحدة هتتحجز لك. متأكد؟`,
            `Accept ${money(t.lastSellerCounter ?? 0)} (${cashPlanLabel(t.cashPlan, tx)}) and reserve the unit?`,
          )
        : tx(
            `هتبيع بـ ${money(t.lastBuyerOffer)} (${cashPlanLabel(t.cashPlan, tx)}) والوحدة هتتحجز للمشتري. متأكد؟`,
            `Sell for ${money(t.lastBuyerOffer)} (${cashPlanLabel(t.cashPlan, tx)}) and reserve the unit?`,
          ),
    reject: tx('لو رفضت، المشتري ده مش هيقدر يعرض تاني على الوحدة دي. متأكد؟', "If you reject, this buyer can't offer on this unit again. Sure?"),
    withdraw: tx('هتسحب عرضك وتقفل التفاوض. متأكد؟', 'Withdraw your offer and end this negotiation?'),
  };

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${TONE[status.tone]}`}>{status.text}</span>
        {left && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
            <Clock className="w-3.5 h-3.5" />
            {left}
          </span>
        )}
      </div>

      <div className="rounded-xl bg-paper border border-line p-3 grid grid-cols-2 gap-2 text-xs">
        <span className="text-muted">{tx('السعر المطلوب', 'Asking')}</span>
        <span className="num text-end font-semibold text-ink">{money(t.askingPrice)}</span>
        <span className="text-muted">{t.agreedPrice !== null ? tx('طريقة الدفع المتفق عليها', 'Agreed payment') : tx('طريقة الدفع المطروحة', 'Payment on the table')}</span>
        <span className="text-end font-semibold text-ink">{cashPlanLabel(t.cashPlan, tx)}</span>
        {t.role === 'buyer' && (
          <>
            <span className="text-muted">{tx(`عمولتنا ${BRAND.buyerFeePercent}% من سعر الوحدة`, `Our fee: ${BRAND.buyerFeePercent}% of the unit price`)}</span>
            <span className="num text-end font-semibold text-ink">{money(t.buyerFee)}</span>
          </>
        )}
        {isOpenOffer(t) && (
          <>
            <span className="text-muted">{tx('حركات باقية', 'Moves left')}</span>
            <span className="num text-end text-ink">
              {t.role === 'buyer' ? tx(`ليك ${t.buyerMovesLeft}`, `You ${t.buyerMovesLeft}`) : tx(`ليك ${t.sellerMovesLeft}`, `You ${t.sellerMovesLeft}`)}
              {' · '}
              {t.role === 'buyer' ? tx(`للمالك ${t.sellerMovesLeft}`, `Owner ${t.sellerMovesLeft}`) : tx(`للمشتري ${t.buyerMovesLeft}`, `Buyer ${t.buyerMovesLeft}`)}
            </span>
          </>
        )}
      </div>

      <ol className="grid gap-2" aria-label={tx('سجل التفاوض', 'Negotiation history')}>
        {t.moves.map((m, i) => {
          const side = moveSide(m, t);
          const at = new Date(m.at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
          if (side === 'system')
            return (
              <li key={i} className="justify-self-center max-w-[90%] rounded-full bg-line/70 px-3 py-1 text-center text-xs text-muted">
                {moveText(m, t, i, tx)} · {at}
              </li>
            );
          return (
            <li
              key={i}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 shadow-xs ${
                side === 'mine' ? 'justify-self-start bg-brand text-white rounded-ss-sm' : 'justify-self-end bg-surface border border-line text-ink rounded-se-sm'
              }`}
            >
              <span className={`block text-xs ${side === 'mine' ? 'text-white/70' : 'text-muted'}`}>{moveText(m, t, i, tx)}</span>
              {m.amount !== null && <span className="num block font-display text-lg font-bold">{money(m.amount)}</span>}
              {m.cashPlan !== null && <span className={`block text-xs font-semibold ${side === 'mine' ? 'text-white/85' : 'text-ink-soft'}`}>{cashPlanLabel(m.cashPlan, tx)}</span>}
              <span className={`block text-[11px] ${side === 'mine' ? 'text-white/60' : 'text-muted'}`}>{at}</span>
            </li>
          );
        })}
      </ol>

      {t.agreedPrice !== null && (
        <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-sm text-emerald-900">
          <Handshake className="inline w-4 h-4 me-1" />
          {t.role === 'buyer'
            ? tx(
                `اتفقتوا على ${money(t.agreedPrice)} (${cashPlanLabel(t.cashPlan, tx)}) + عمولتنا ${money(t.buyerFee)} بعد التوقيع. فريقنا هيكلمك خلال يوم عمل.`,
                `Agreed at ${money(t.agreedPrice)} (${cashPlanLabel(t.cashPlan, tx)}) + our ${money(t.buyerFee)} fee after signing. We'll call within one business day.`,
              )
            : tx(
                `اتفقتوا على ${money(t.agreedPrice)} (${cashPlanLabel(t.cashPlan, tx)}). فريقنا هيكلمك خلال يوم عمل يرتب الخطوات.`,
                `Agreed at ${money(t.agreedPrice)} (${cashPlanLabel(t.cashPlan, tx)}). We'll call within one business day.`,
              )}
        </p>
      )}
      {!isOpenOffer(t) && t.agreedPrice === null && t.closeReason && <p className="text-xs text-muted">{t.closeReason}</p>}

      {/* Actions */}
      {t.actions.length > 0 && !confirm && !picking && (
        <div className="grid gap-2">
          {t.actions.includes('accept') && (
            <button disabled={busy} onClick={() => setConfirm('accept')} className="btn-primary min-h-11 w-full">
              <Check className="w-4 h-4" />
              {t.role === 'buyer'
                ? tx(`موافق على ${money(t.lastSellerCounter ?? 0)}`, `Accept ${money(t.lastSellerCounter ?? 0)}`)
                : tx(`موافق على ${money(t.lastBuyerOffer)}`, `Accept ${money(t.lastBuyerOffer)}`)}
            </button>
          )}
          {moving && ladder.length > 0 && (
            <button disabled={busy} onClick={() => setPicking(true)} className="btn-ghost min-h-11 w-full">
              {moving === 'counter' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
              {moving === 'counter' ? tx('رد بسعر أو طريقة دفع تانية', 'Counter with another price or payment') : tx('علّي عرضك', 'Raise your offer')}
            </button>
          )}
          <div className="flex gap-2">
            {t.actions.includes('reject') && (
              <button disabled={busy} onClick={() => setConfirm('reject')} className="flex-1 min-h-10 rounded-xl text-sm font-semibold text-danger hover:bg-danger-soft">
                <X className="inline w-4 h-4 me-1" />
                {tx('ارفض', 'Reject')}
              </button>
            )}
            {t.actions.includes('withdraw') && (
              <button disabled={busy} onClick={() => setConfirm('withdraw')} className="flex-1 min-h-10 rounded-xl text-sm font-semibold text-muted hover:bg-line/60">
                <Undo2 className="inline w-4 h-4 me-1" />
                {tx('اسحب عرضك', 'Withdraw')}
              </button>
            )}
          </div>
        </div>
      )}

      {picking && moving && amount !== undefined && (
        <div className="rounded-xl border border-line bg-surface p-4 grid gap-4">
          <div className="grid gap-2">
            <p className="text-sm font-bold text-ink">{moving === 'counter' ? tx('السعر اللي تقبله', 'The price you accept') : tx('عرضك الجديد', 'Your new offer')}</p>
            <p className="text-xs text-muted">
              {moving === 'counter'
                ? tx('أعلى من عرض المشتري، ومش أعلى من آخر سعر طلبته.', "Above the buyer's offer and no higher than your last price.")
                : tx('أعلى من عرضك اللي فات، وأقل من رقم صاحب الوحدة.', "Above your last offer and below the owner's price.")}
            </p>
            <AmountPicker values={ladder} value={amount} onChange={setPicked} reference={t.askingPrice} />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-bold text-ink">{tx('طريقة دفع الكاش', 'How the cash is paid')}</p>
            <CashPlanPicker value={nextPlan} onChange={setPlan} />
          </div>
          {t.role === 'buyer' && (
            <p className="text-xs text-muted text-center">
              {/* The fee is on the unit's contract price, so it doesn't move with the offer. */}
              {tx(`+ عمولتنا ${money(t.buyerFee)} (${BRAND.buyerFeePercent}% من سعر الوحدة) بعد التوقيع`, `+ our ${money(t.buyerFee)} fee (${BRAND.buyerFeePercent}% of the unit price) after signing`)}
            </p>
          )}
          <div className="flex gap-2">
            <button disabled={busy} onClick={() => run(moving, amount)} className="btn-primary flex-1 min-h-12">
              {busy ? tx('بنبعت...', 'Sending...') : tx(`ابعت ${money(amount)}`, `Send ${money(amount)}`)}
            </button>
            <button disabled={busy} onClick={() => setPicking(false)} className="btn-ghost min-h-12 px-4">
              {tx('إلغاء', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <div className="rounded-xl border border-line bg-surface p-3 grid gap-2">
          <p className="text-sm text-ink">{confirmText[confirm]}</p>
          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={() => run(confirm)}
              className={`flex-1 min-h-11 rounded-xl font-bold text-white ${confirm === 'accept' ? 'bg-brand hover:bg-brand-hover' : 'bg-danger hover:opacity-90'}`}
            >
              {busy ? tx('لحظة...', 'One moment...') : tx('أيوه، أكّد', 'Yes, confirm')}
            </button>
            <button disabled={busy} onClick={() => setConfirm(null)} className="btn-ghost min-h-11 px-4">
              {tx('لأ', 'No')}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
};
