import React from 'react';
import { Heart, MapPin, BadgeCheck, Flame, ArrowDown } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { BRAND } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  isNegotiable,
  money,
  monthlyInstallment,
  pick,
  savingsAmount,
  savingsPercent,
  sellerDiscount,
} from '../lib/unitHelpers';

interface UnitCardProps {
  unit: RealEstateUnit;
  onOpen: (unit: RealEstateUnit) => void;
  /** Shows a "fits your budget" tag when the buyer searched by budget. */
  fitsBudget?: boolean;
  /** Extra pill shown on the image (e.g. swap price difference). */
  tag?: { label: string; strong?: boolean };
  /** Extra content at the bottom of the card (e.g. the swap page's monthly change and request button). */
  footer?: React.ReactNode;
}

/** Full number with thousands separators — easier to read and compare than "1.7 مليون" on a price card. */
const full = (n: number) => Math.round(n).toLocaleString('en-US');

export const UnitCard: React.FC<UnitCardProps> = ({ unit, onOpen, fitsBudget, tag, footer }) => {
  const { language, tx } = useLanguage();
  const { isUnitSaved, toggleSaveUnit } = useUnits();
  const saved = isUnitSaved(unit.id);
  const deal = isDeal(unit);
  const cur = currency(language);

  const specs = [
    pick(language, unit.propertyType, unit.propertyTypeEn),
    unit.bedrooms > 0 ? tx(`${unit.bedrooms} غرف`, `${unit.bedrooms} beds`) : null,
    unit.bathrooms > 0 ? tx(`${unit.bathrooms} حمام`, `${unit.bathrooms} baths`) : null,
    `${unit.areaM2} ${tx('م²', 'm²')}`,
    tx(`استلام ${deliveryLabel(unit, language)}`, `Delivery ${deliveryLabel(unit, language)}`),
  ].filter(Boolean);

  return (
    <article
      onClick={() => onOpen(unit)}
      className={`group card overflow-hidden cursor-pointer transition-all hover:shadow-lift hover:-translate-y-0.5 flex flex-col ${deal ? 'border-accent/50 ring-1 ring-accent/20' : ''}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-line">
        <img
          src={unit.images[0]}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between">
          {/* Status pills live on the photo so the title gets the full width. */}
          <div className="flex flex-wrap gap-1.5">
            {unit.verifiedContract && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-semibold text-brand-ink">
                <BadgeCheck className="w-3.5 h-3.5 text-brand" />
                {tx('موثّقة', 'Verified')}
              </span>
            )}
            {fitsBudget && <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white">{tx('في ميزانيتك', 'In budget')}</span>}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveUnit(unit.id);
            }}
            aria-label={tx('حفظ', 'Save')}
            className="grid place-items-center w-11 h-11 rounded-full bg-surface/95 hover:bg-surface"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-danger text-danger' : 'text-ink-soft'}`} />
          </button>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          {/* The one place the accent colour shows up in a list: a seller discount. */}
          {deal ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent text-white px-3 py-1 text-xs font-bold shadow">
              <Flame className="w-3.5 h-3.5" />
              {tx(`خصم ${money(sellerDiscount(unit), language)}`, `${money(sellerDiscount(unit), language)} off`)}
            </span>
          ) : (
            <span />
          )}
          {tag && (
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${tag.strong ? 'bg-brand text-white' : 'bg-surface/95 text-ink'}`}>{tag.label}</span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Who and where */}
        <h3 className="font-bold text-lg leading-snug text-ink line-clamp-2">{pick(language, unit.compound, unit.compoundEn)}</h3>
        {/* Wraps instead of truncating — on a narrow phone card the code drops to its own line. */}
        <p className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm text-muted">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{pick(language, unit.location, unit.locationEn)}</span>
          <span className="num ms-auto text-xs" dir="ltr">
            {unit.verificationCode}
          </span>
        </p>
        <p className="mt-2 text-sm font-medium text-ink-soft">{specs.join(' · ')}</p>

        {/* The headline number is the monthly — "within your budget" is the whole idea. Cash comes second. */}
        <div className="mt-4">
          <p className="text-sm text-muted">{tx('قسطك الشهري تقريباً', 'Your monthly, roughly')}</p>
          <p className="num font-display mt-0.5 text-3xl font-bold text-ink whitespace-nowrap">
            {full(monthlyInstallment(unit))} <span className="text-sm font-semibold text-muted">{tx(`${cur} / شهر`, `${cur} / mo`)}</span>
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-line px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted">{tx('وتدفع كاش دلوقتي', 'Plus cash now')}</span>
            <span className="num text-lg font-bold text-ink whitespace-nowrap">
              {full(cashPrice(unit))} <span className="text-xs font-semibold text-muted">{cur}</span>
            </span>
          </div>
          {deal && (
            <p className="num text-end text-sm text-muted whitespace-nowrap">
              {tx('كان', 'was')} <span className="line-through">{full(unit.paidCashAmount)}</span>
            </p>
          )}
          {isNegotiable(unit) && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white whitespace-nowrap">
              <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
              {tx('الكاش قابل للتفاوض', 'Cash negotiable')}
            </p>
          )}
        </div>

        {/* What they gain */}
        <div className="mt-3 rounded-xl bg-paper border border-line px-4 py-3">
          <p className="text-xs text-muted">{tx('توفيرك عن سعر المطور النهارده', "Saving vs the developer's price today")}</p>
          <p className="num mt-0.5 text-lg font-bold text-ink whitespace-nowrap">
            + {full(savingsAmount(unit))} <span className="text-sm font-semibold text-muted">{cur}</span>
            <span className="ms-2 text-sm font-semibold text-muted">{savingsPercent(unit)}%</span>
          </p>
          <p className="num mt-1 text-[11px] text-muted">
            {tx(
              `سعر المطور النهارده ${full(unit.currentMarketPrice)} · بعد عمولتنا ${BRAND.buyerFeePercent}%`,
              `Developer's price today ${full(unit.currentMarketPrice)} · after our ${BRAND.buyerFeePercent}% fee`,
            )}
          </p>
        </div>

        {/* What they take on */}
        <dl className="mt-auto pt-4 space-y-2 text-sm">
          <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
            <dt className="text-muted">{tx('باقي للمطور', 'Left to developer')}</dt>
            <dd className="num font-semibold text-ink whitespace-nowrap">
              {full(unit.remainingAmount)} <span className="text-xs text-muted">{cur}</span>
            </dd>
          </div>
        </dl>
        {footer}
      </div>
    </article>
  );
};
