import React from 'react';
import { Heart, BadgeCheck, ArrowDown } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SourceTag } from './SourceTag';
import { useUnits } from '../context/UnitsContext';
import { BRAND } from '../config/brand';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  isNegotiable,
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

/** One quiet row of the "what you take over" list at the bottom of the card. */
const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-3">
    <span className="text-[11px] @xs:text-xs text-muted whitespace-nowrap">{label}</span>
    <span className="num text-[11px] @xs:text-xs font-bold text-ink text-end">{value}</span>
  </div>
);

export const UnitCard: React.FC<UnitCardProps> = ({ unit, onOpen, fitsBudget, tag, footer }) => {
  const { language, tx } = useLanguage();
  const { isUnitSaved, toggleSaveUnit } = useUnits();
  const saved = isUnitSaved(unit.id);
  const deal = isDeal(unit);
  const discountVal = sellerDiscount(unit);
  const negotiable = isNegotiable(unit);
  const cur = currency(language);

  const savings = savingsAmount(unit);
  const cash = cashPrice(unit);

  // One plain line instead of a row of bordered pills: "شقة · 3 غرف · 3 حمام · 155 م²".
  const specs = [
    pick(language, unit.propertyType, unit.propertyTypeEn),
    unit.bedrooms > 0 ? `${unit.bedrooms} ${tx('غرف', 'beds')}` : '',
    unit.bathrooms > 0 ? `${unit.bathrooms} ${tx('حمام', 'baths')}` : '',
    `${unit.areaM2} ${tx('م²', 'm²')}`,
  ].filter(Boolean);

  return (
    <article
      onClick={() => onOpen(unit)}
      className="@container group card overflow-hidden cursor-pointer flex flex-col h-full rounded-2xl border border-line bg-surface transition-shadow duration-200 hover:shadow-lift hover:border-line-strong"
    >
      {/* Photo — one small pill, one save button. Nothing else competes with it. */}
      <div className="relative aspect-[16/9] overflow-hidden bg-line">
        <img
          src={unit.images[0]}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-0 top-0 p-2.5 flex items-start justify-between gap-2 pointer-events-none">
          {unit.verifiedContract && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-brand shadow-xs">
              <BadgeCheck className="w-3.5 h-3.5" />
              {tx('متحقق بالمستندات', 'Documents verified')}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveUnit(unit.id);
            }}
            aria-label={tx('حفظ', 'Save')}
            className="pointer-events-auto ms-auto grid place-items-center w-9 h-9 shrink-0 rounded-full bg-surface/90 backdrop-blur-xs text-ink-soft hover:bg-surface shadow-xs transition"
          >
            <Heart
              key={String(saved)}
              className={`w-4 h-4 transition-colors ${
                saved ? 'fill-accent-bright text-accent-bright heart-pop' : 'text-ink-soft'
              }`}
            />
          </button>
        </div>

        {(tag || fitsBudget) && (
          <div className="absolute inset-x-2.5 bottom-2.5 flex items-end justify-end gap-2 pointer-events-none">
            {fitsBudget && (
              <span className="rounded-md bg-surface/95 px-2 py-0.5 text-xs font-bold text-ink shadow-xs">
                {tx('في ميزانيتك', 'In budget')}
              </span>
            )}
            {tag && (
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold shadow-xs ${
                  tag.strong ? 'bg-brand text-white' : 'bg-surface/95 text-ink'
                }`}
              >
                {tag.label}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-3.5 @xs:p-4 flex-1 flex flex-col">
        {/* Who and where */}
        <h3 className="font-bold text-[15px] @xs:text-base text-brand-ink line-clamp-1">
          {pick(language, unit.compound, unit.compoundEn)}
        </h3>
        <p className="mt-0.5 text-xs text-muted line-clamp-1">
          {pick(language, unit.developer, unit.developerEn)} · {pick(language, unit.location, unit.locationEn)}
        </p>
        <p className="num mt-1 text-[11px] text-muted/70" dir="ltr">
          {unit.verificationCode}
        </p>
        <p className="mt-2 text-xs text-ink-soft">{specs.join(' · ')}</p>

        {/* The one number that matters */}
        <div className="mt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted">
            {tx('المطلوب كاش دلوقتي', 'Cash needed now')}
            <SourceTag verified={!!(unit.developerAccountStatementVerified ?? unit.verifiedContract)} />
          </span>
          {/* Reserved whether or not there's an old price, so the big number sits at the same height on every card. */}
          <span className="num block h-4 text-[11px] text-muted line-through leading-4 mt-0.5">
            {deal ? `${full(unit.paidCashAmount)} ${cur}` : ''}
          </span>
          <span className="num block font-black text-xl @xs:text-2xl text-brand-ink leading-tight mt-0.5">
            {full(cash)} <span className="text-sm @xs:text-base font-bold">{cur}</span>
          </span>

          {deal && (
            <span className="mt-1 block text-xs font-bold text-accent">
              {tx(
                `أقل ${full(discountVal)} ج.م من اللي دفعه المالك`,
                `${full(discountVal)} EGP below what the owner paid`
              )}
            </span>
          )}
          {negotiable && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-accent">
              <ArrowDown className="w-3 h-3 stroke-[2.5]" />
              {tx('قابل للتفاوض', 'Negotiable')}
            </span>
          )}
        </div>

        {/* The single tinted block on the card. mt-auto anchors it (and everything under it) to the
            bottom, so these line up across the row no matter how many flag lines the price has. */}
        <div className="mt-auto" aria-hidden />
        <div className="mt-3 rounded-xl bg-accent-soft px-2.5 py-2">
          <span className="flex items-center gap-1.5 text-[11px] text-accent-ink/80">
            {tx('مكسبك عن سعر السوق', 'Your gain vs market')}
            <SourceTag verified={false} />
          </span>
          <span className="num block font-black text-base @xs:text-lg text-accent-ink leading-tight mt-0.5">
            +{full(savings)} <span className="text-xs font-bold">{cur}</span>
          </span>
          {/* Two deliberate lines, each kept to one row — a wrapping sentence here would
              shift the block by a line and break the alignment across the grid. */}
          <span className="block truncate text-[10px] @xs:text-[11px] text-muted mt-0.5 leading-snug">
            {tx(
              `سعر السوق اليوم: ${full(unit.currentMarketPrice)} ج.م`,
              `Market today: ${full(unit.currentMarketPrice)} EGP`
            )}
          </span>
          <span className="block truncate text-[10px] @xs:text-[11px] text-muted leading-snug">
            {tx(`بعد خصم عمولتنا ${BRAND.buyerFeePercent}%`, `After our ${BRAND.buyerFeePercent}% fee`)}
          </span>
        </div>

        {/* What you take over */}
        <div className="mt-3 pt-3 border-t border-line space-y-1.5">
          <Row label={tx('المتبقي للمطور', 'Left to developer')} value={`${full(unit.remainingAmount)} ${cur}`} />
          <Row
            label={tx('القسط', 'Instalment')}
            value={`${full(unit.installmentValue)} ${cur} · ${unit.installmentFrequency}`}
          />
          <Row label={tx('الاستلام', 'Delivery')} value={deliveryLabel(unit, language)} />
        </div>

        {/* Looks like the card's button, but the whole card is the click target. */}
        <span className="pt-3.5 block">
          <span className="w-full inline-flex items-center justify-center h-11 rounded-xl bg-brand text-white text-sm font-bold transition-colors group-hover:bg-brand-hover">
            {tx('تفاصيل', 'Details')}
          </span>
        </span>

        {footer}
      </div>
    </article>
  );
};
