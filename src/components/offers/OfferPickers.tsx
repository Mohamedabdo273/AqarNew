import React from 'react';
import { Banknote, CalendarRange, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CASH_PLAN, CashPlan } from '../../services/api';
import { fullMoney, money } from '../../lib/unitHelpers';
import { CASH_PLANS } from '../../lib/offers';

/**
 * A price bar people can read: the chosen number in big type, what it saves under it, and plain words at both
 * ends of the bar ("أقل سعر" / "أقرب للمطلوب") so it's obvious which way is cheaper.
 * `values` are the only amounts allowed (sorted ascending); `reference` is the asking price.
 */
export const AmountPicker: React.FC<{
  values: number[];
  value: number;
  onChange: (v: number) => void;
  reference: number;
}> = ({ values, value, onChange, reference }) => {
  const { language, tx } = useLanguage();
  const i = Math.max(0, values.indexOf(value));
  const pct = values.length > 1 ? (i / (values.length - 1)) * 100 : 100;
  const first = values[0];
  const last = values[values.length - 1];

  return (
    <div className="grid gap-3">
      <div className="text-center">
        <p className="num font-display text-3xl font-extrabold text-brand-ink">{fullMoney(value, language)}</p>
        {reference > value && (
          <p className="num mt-0.5 text-sm font-bold text-emerald-700">
            {tx(`أقل من المطلوب بـ ${money(reference - value, language)}`, `${money(reference - value, language)} below asking`)}
          </p>
        )}
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(0, values.length - 1)}
        step={1}
        value={i}
        onChange={(e) => onChange(values[Number(e.target.value)])}
        disabled={values.length < 2}
        aria-label={tx('السعر', 'Price')}
        aria-valuetext={fullMoney(value, language)}
        className="offer-range w-full"
        style={{ '--fill': `${pct}%` } as React.CSSProperties}
      />

      {/* What each end of the bar means — the bar is drawn in reading direction, so "start" is the lowest price. */}
      <div className="flex items-start justify-between gap-3 text-xs">
        <span className="text-start">
          <span className="block font-bold text-ink">{tx('أقل سعر', 'Lowest')}</span>
          <span className="num block text-muted">{fullMoney(first, language)}</span>
        </span>
        <span className="text-center text-muted self-center">{tx('حرّك الدايرة لحد السعر اللي يناسبك', 'Drag to the price that suits you')}</span>
        <span className="text-end">
          <span className="block font-bold text-ink">{tx('أقرب للمطلوب', 'Closest to asking')}</span>
          <span className="num block text-muted">{fullMoney(last, language)}</span>
        </span>
      </div>
    </div>
  );
};

/** Full cash, or needs instalments — the details of an instalment plan are agreed by phone with our team. */
export const CashPlanPicker: React.FC<{ value: CashPlan; onChange: (v: CashPlan) => void }> = ({ value, onChange }) => {
  const { tx } = useLanguage();
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={tx('هتدفع الكاش إزاي؟', 'How will you pay the cash?')}>
      {CASH_PLANS.map((p) => {
        const on = p.value === value;
        const Icon = p.value === CASH_PLAN.full ? Banknote : CalendarRange;
        return (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(p.value)}
            className={`relative grid gap-1 rounded-xl border-2 p-3 text-start transition-colors ${
              on ? 'border-brand bg-brand-soft' : 'border-line bg-surface hover:border-line-strong'
            }`}
          >
            {on && (
              <span className="absolute top-2 end-2 grid place-items-center w-5 h-5 rounded-full bg-brand text-white">
                <Check className="w-3 h-3" strokeWidth={3} />
              </span>
            )}
            <Icon className={`w-6 h-6 ${on ? 'text-brand' : 'text-muted'}`} />
            <span className={`text-base font-extrabold ${on ? 'text-brand-ink' : 'text-ink'}`}>{tx(p.ar, p.en)}</span>
            <span className="text-xs text-muted leading-snug">{tx(p.hint[0], p.hint[1])}</span>
          </button>
        );
      })}
    </div>
  );
};
