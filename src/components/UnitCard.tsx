import React from 'react';
import { Heart, BadgeCheck, BedDouble, Bath, Maximize2, KeyRound, Flame } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  money,
  monthlyInstallment,
  pick,
  savingsAmount,
  sellerDiscount,
} from '../lib/unitHelpers';

interface UnitCardProps {
  unit: RealEstateUnit;
  onOpen: (unit: RealEstateUnit) => void;
  /** Shows a "fits your budget" tag when the buyer searched by budget. */
  fitsBudget?: boolean;
  /** Extra pill shown on the image (e.g. swap price difference). */
  tag?: { label: string; strong?: boolean };
  /** Extra content at the bottom of the card. */
  footer?: React.ReactNode;
}

const full = (n: number) => Math.round(n).toLocaleString('en-US');

/**
 * A listing at a glance: the cash to hand over, the monthly instalment, where it is and what it is.
 * Everything else (remaining balance, market comparison, terms) lives on the unit page.
 */
export const UnitCard: React.FC<UnitCardProps> = ({ unit, onOpen, fitsBudget, tag, footer }) => {
  const { language, tx } = useLanguage();
  const { isUnitSaved, toggleSaveUnit } = useUnits();
  const saved = isUnitSaved(unit.id);
  const deal = isDeal(unit);
  const cur = currency(language);
  const cash = cashPrice(unit);
  const savings = savingsAmount(unit);
  const ready = unit.deliveryStatus === 'استلام فوري';
  const dealPct = deal && unit.paidCashAmount > 0 ? Math.round((sellerDiscount(unit) / unit.paidCashAmount) * 100) : 0;

  const specs = [
    unit.bedrooms > 0 && { icon: BedDouble, v: String(unit.bedrooms), l: tx('غرف', 'beds') },
    unit.bathrooms > 0 && { icon: Bath, v: String(unit.bathrooms), l: tx('حمام', 'baths') },
    { icon: Maximize2, v: String(unit.areaM2), l: tx('المساحة', 'area'), suffix: tx('م²', 'm²') },
  ].filter(Boolean) as { icon: React.ElementType; v: string; l: string; suffix?: string }[];

  return (
    <article
      onClick={() => onOpen(unit)}
      className="group cursor-pointer flex flex-col h-full overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:border-line-strong"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        <img
          src={unit.images[0]}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Status first: what makes this unit worth a look. */}
        <div className="absolute top-3 start-3 flex flex-col items-start gap-2 pointer-events-none">
          {deal && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-base font-extrabold text-white shadow-md">
              <Flame className="w-5 h-5 fill-current" />
              {tx(`خصم ${dealPct}%`, `Deal · ${dealPct}% off`)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveUnit(unit.id);
          }}
          aria-label={tx('حفظ', 'Save')}
          className="absolute top-2.5 end-2.5 grid place-items-center w-9 h-9 rounded-full bg-surface/90 backdrop-blur-xs shadow-xs hover:bg-surface transition"
        >
          <Heart
            key={String(saved)}
            className={`w-4 h-4 transition-colors ${saved ? 'fill-accent-bright text-accent-bright heart-pop' : 'text-ink-soft'}`}
          />
        </button>

        <div className="absolute inset-x-2.5 bottom-2.5 flex items-end justify-between gap-2 pointer-events-none">
          {unit.verifiedContract ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/70 backdrop-blur-xs px-3 py-1 text-sm font-semibold text-white">
              <BadgeCheck className="w-4 h-4" />
              {tx('موثّقة', 'Verified')}
            </span>
          ) : (
            <span />
          )}
          <span className="flex gap-1.5">
            {fitsBudget && <span className="rounded-md bg-surface/95 px-2.5 py-1 text-sm font-bold text-ink shadow-xs">{tx('في ميزانيتك', 'In budget')}</span>}
            {tag && (
              <span className={`rounded-md px-2.5 py-1 text-sm font-bold shadow-xs ${tag.strong ? 'bg-brand text-white' : 'bg-surface/95 text-ink'}`}>
                {tag.label}
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* The numbers a buyer decides on, and when they get the keys */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="block text-sm font-semibold text-ink-soft">{tx('كاش دلوقتي', 'Cash now')}</span>
            <span className="num block font-black text-[28px] text-brand-ink leading-tight whitespace-nowrap">
              {full(cash)} <span className="text-base font-bold text-muted">{cur}</span>
            </span>
            {deal && <span className="num block text-base text-muted line-through">{full(unit.paidCashAmount)} {cur}</span>}
          </div>
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-base font-extrabold ${
              ready ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-soft text-brand-ink'
            }`}
          >
            <KeyRound className="w-5 h-5" />
            {ready ? tx('استلام فوري', 'Ready now') : <span className="num">{tx(`استلام ${deliveryLabel(unit, language)}`, `Delivery ${deliveryLabel(unit, language)}`)}</span>}
          </span>
        </div>
        <p className="mt-1.5 text-base text-ink-soft">
<span className="num font-bold text-ink">{money(monthlyInstallment(unit), language)}</span>{' '}
          {tx('قسط/شهر', '/month')}
        </p>

        <h3 className="mt-3 font-bold text-xl text-ink line-clamp-1">{pick(language, unit.compound, unit.compoundEn)}</h3>
        <p className="mt-1 text-base text-muted line-clamp-1">
          {pick(language, unit.propertyType, unit.propertyTypeEn)} · {pick(language, unit.location, unit.locationEn)}
        </p>
        {unit.verificationCode && (
          <p className="mt-2 inline-flex self-start items-center gap-1.5 rounded-lg bg-brand-soft px-2.5 py-1 text-sm">
            <span className="text-ink-soft">{tx('كود الوحدة', 'Unit code')}</span>
            <span className="num font-extrabold text-brand-ink" dir="ltr">{unit.verificationCode}</span>
          </p>
        )}

        <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-base text-ink-soft">
          {specs.map((s) => (
            <li key={s.l} className="inline-flex items-center gap-1.5" title={s.l}>
              <s.icon className="w-5 h-5 text-muted" />
              <span className="num font-bold text-ink">{s.v}</span>
              {s.suffix && <span>{s.suffix}</span>}
            </li>
          ))}
        </ul>

        {/* mt-auto pins the last line to the bottom so it lines up across a row of cards. */}
        {savings > 0 && (
          <div className="mt-auto pt-3">
            <p className="pt-3 border-t border-line/70 text-base font-bold text-emerald-700">
              {tx(`خصم ${money(savings, language)} ${cur} عن سعر السوق`, `${money(savings, language)} ${cur} below market`)}
            </p>
          </div>
        )}

        {footer}
      </div>
    </article>
  );
};
