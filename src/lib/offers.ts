import { CASH_PLAN, CashPlan, OFFER_ACTOR, OFFER_MOVE, OFFER_STATUS, OfferMove, OfferThread, NOTIFICATION_TYPE, AppNotification } from '../services/api';

type Tx = (ar: string, en: string) => string;

/**
 * The amounts a slider can land on between `min` and `max`.
 * The first offer walks up from the floor in fixed steps (75%, 75% + 10,000, …); counters and raises snap to round
 * figures, falling back to finer steps when the two sides are already close.
 */
export function offerLadder(min: number, max: number, step: number, anchored = false): number[] {
  if (max < min) return [];
  if (anchored) {
    const out: number[] = [];
    for (let v = min; v <= max; v += step) out.push(v);
    return out;
  }
  for (const s of [step, step / 10, 100]) {
    const out: number[] = [];
    for (let v = Math.ceil(min / s) * s; v <= max; v += s) out.push(v);
    if (out.length > 0) return out.length > 200 ? out.filter((_, i) => i % Math.ceil(out.length / 200) === 0) : out;
  }
  return [Math.round(min)];
}

export const isOpenOffer = (t: OfferThread) => t.status === OFFER_STATUS.awaitingSeller || t.status === OFFER_STATUS.awaitingBuyer;

/** Is it the caller's turn? */
export const myTurn = (t: OfferThread) =>
  (t.role === 'buyer' && t.status === OFFER_STATUS.awaitingBuyer) || (t.role === 'seller' && t.status === OFFER_STATUS.awaitingSeller);

export function offerStatusLabel(t: OfferThread, tx: Tx): { text: string; tone: 'turn' | 'wait' | 'good' | 'off' } {
  switch (t.status) {
    case OFFER_STATUS.awaitingSeller:
    case OFFER_STATUS.awaitingBuyer:
      return myTurn(t)
        ? { text: tx('دورك ترد', 'Your turn'), tone: 'turn' }
        : t.role === 'buyer'
          ? { text: tx('مستنيين رد صاحب الوحدة', 'Waiting for the owner'), tone: 'wait' }
          : { text: tx(`مستنيين رد ${t.buyerLabel}`, `Waiting for ${t.buyerLabel.replace('مشتري', 'buyer')}`), tone: 'wait' };
    case OFFER_STATUS.agreed:
      return { text: tx('اتفقتوا — الوحدة اتحجزت', 'Agreed — unit reserved'), tone: 'good' };
    case OFFER_STATUS.rejected:
      return { text: tx('اترفض', 'Rejected'), tone: 'off' };
    case OFFER_STATUS.withdrawn:
      return { text: tx('اتسحب', 'Withdrawn'), tone: 'off' };
    case OFFER_STATUS.expired:
      return { text: tx('انتهت المهلة', 'Expired'), tone: 'off' };
    default:
      return { text: tx('اتقفل', 'Closed'), tone: 'off' };
  }
}

/** "باقي 31 ساعة" — time left on the current turn. */
export function timeLeft(deadlineAt: string | null, tx: Tx, now = Date.now()): string | null {
  if (!deadlineAt) return null;
  const ms = new Date(deadlineAt).getTime() - now;
  if (ms <= 0) return tx('المهلة خلصت', 'Time is up');
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return tx(`باقي ${hours} ساعة`, `${hours}h left`);
  const minutes = Math.max(1, Math.floor(ms / 60_000));
  return tx(`باقي ${minutes} دقيقة`, `${minutes} min left`);
}

/** Who said it, from the caller's side of the table. */
export function moveSide(m: OfferMove, t: OfferThread): 'mine' | 'theirs' | 'system' {
  if (m.actor === OFFER_ACTOR.system || m.actor === OFFER_ACTOR.staff) return 'system';
  const mine = (m.actor === OFFER_ACTOR.buyer) === (t.role === 'buyer');
  return mine ? 'mine' : 'theirs';
}

export function moveText(m: OfferMove, t: OfferThread, index: number, tx: Tx): string {
  const side = moveSide(m, t);
  const who = side === 'mine' ? tx('إنت', 'You') : m.actor === OFFER_ACTOR.buyer ? t.buyerLabel : tx('صاحب الوحدة', 'Owner');
  const firstOffer = index === 0;
  switch (m.type) {
    case OFFER_MOVE.offer:
      return firstOffer ? tx(`${who}: عرض`, `${who}: offer`) : tx(`${who}: علّى العرض`, `${who}: raised to`);
    case OFFER_MOVE.counter:
      return tx(`${who}: رد بسعر`, `${who}: countered with`);
    case OFFER_MOVE.accept:
      return tx(`${who}: موافق على`, `${who}: accepted`);
    case OFFER_MOVE.reject:
      return tx(`${who}: رفض العرض`, `${who}: rejected the offer`);
    case OFFER_MOVE.withdraw:
      return tx(`${who}: انسحب`, `${who}: withdrew`);
    case OFFER_MOVE.expire:
      return m.note ?? tx('المهلة خلصت', 'Time ran out');
    default:
      return m.note ?? tx('العرض اتقفل', 'Closed');
  }
}

const NOTE_EN: Record<number, string> = {
  [NOTIFICATION_TYPE.offerReceived]: 'New offer on your unit',
  [NOTIFICATION_TYPE.offerCountered]: 'The owner answered your offer',
  [NOTIFICATION_TYPE.offerRaised]: 'A buyer raised their offer',
  [NOTIFICATION_TYPE.offerAccepted]: 'Offer agreed — unit reserved',
  [NOTIFICATION_TYPE.offerRejected]: 'Your offer was rejected',
  [NOTIFICATION_TYPE.offerExpired]: 'An offer expired',
  [NOTIFICATION_TYPE.offerWithdrawn]: 'A buyer withdrew their offer',
  [NOTIFICATION_TYPE.unitReserved]: 'The unit was reserved — offer closed',
  [NOTIFICATION_TYPE.offerClosed]: 'An offer was closed',
  [NOTIFICATION_TYPE.offerExtended]: 'More time on an offer',
  [NOTIFICATION_TYPE.offerReopened]: 'You can make an offer again',
  [NOTIFICATION_TYPE.staffCallParties]: 'Offer agreed — call both sides',
};

/** The server writes Arabic; English is rebuilt from the type. */
export const notificationTitle = (n: AppNotification, tx: Tx) =>
  tx(n.title, `${NOTE_EN[n.type] ?? 'Update'}${n.unitCode ? ` · ${n.unitCode}` : ''}`);

/** The cash plans, in the order the picker shows them. */
export const CASH_PLANS: { value: CashPlan; ar: string; en: string; hint: [string, string] }[] = [
  { value: CASH_PLAN.full, ar: 'كاش كامل', en: 'Full cash', hint: ['هتدفع المبلغ كله عند التنازل', 'You pay it all at the transfer'] },
  {
    value: CASH_PLAN.installments,
    ar: 'محتاج تقسيط',
    en: 'I need instalments',
    hint: ['فريقنا يتفق معاكم على التفاصيل', 'Our team agrees the details with you both'],
  },
];

export const cashPlanLabel = (plan: CashPlan | null | undefined, tx: Tx) => {
  const p = CASH_PLANS.find((x) => x.value === plan) ?? CASH_PLANS[0];
  return plan === CASH_PLAN.installments ? tx('الكاش بالتقسيط', 'Cash in instalments') : tx(p.ar, p.en);
};
