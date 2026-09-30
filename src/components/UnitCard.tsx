import React from 'react';
import { Heart, MapPin, BadgeCheck, Flame, Scale, ArrowDown } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { COMPARE_MAX, useCompare } from '../context/CompareContext';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  isNegotiable,
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
  /** Extra content at the bottom of the card. */
  footer?: React.ReactNode;
}

const full = (n: number) => Math.round(n).toLocaleString('en-US');

export const UnitCard: React.FC<UnitCardProps> = ({ unit, onOpen, fitsBudget, tag, footer }) => {
  const { language, tx } = useLanguage();
  const { isUnitSaved, toggleSaveUnit } = useUnits();
  const saved = isUnitSaved(unit.id);
  const { isCompared, toggleCompare } = useCompare();
  const compared = isCompared(unit.id);
  const deal = isDeal(unit);
  const discountVal = sellerDiscount(unit);
  const negotiable = isNegotiable(unit);
  const cur = currency(language);

  const savings = savingsAmount(unit);
  const savingsPct = savingsPercent(unit);
  const cash = cashPrice(unit);
  const monthly = monthlyInstallment(unit);

  return (
    <article
      onClick={() => onOpen(unit)}
      className="group card overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lift hover:-translate-y-1 flex flex-col h-full rounded-2xl border border-line bg-surface hover:border-brand/40"
    >
      {/* Image & Prominent Overlays */}
      <div className="relative aspect-[16/10] overflow-hidden bg-line">
        <img
          src={unit.images[0]}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Top Badges & Actions */}
        <div className="absolute inset-x-0 top-0 p-2.5 flex items-start justify-between gap-2 pointer-events-none">
          {/* Prominent High-Contrast Badges */}
          <div className="flex flex-col gap-1.5 items-start pointer-events-auto">
            {/* 1. Ultra Prominent Discount Badge */}
            {deal && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 text-white px-3 py-1 text-xs font-black shadow-md tracking-tight">
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>{tx(`خصم ${full(discountVal)} ج.م`, `Save ${full(discountVal)} EGP`)}</span>
              </span>
            )}

            {/* 2. Ultra Prominent Negotiable Badge */}
            {negotiable && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-2.5 py-1 text-xs font-black shadow-md">
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{tx('قابل للتفاوض', 'Negotiable')}</span>
              </span>
            )}

            {/* Verified Contract */}
            {unit.verifiedContract && !deal && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-bold text-brand shadow-xs">
                <BadgeCheck className="w-3.5 h-3.5 text-brand" />
                <span>{tx('عقد موثّق', 'Verified')}</span>
              </span>
            )}

            {fitsBudget && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                {tx('في ميزانيتك', 'In budget')}
              </span>
            )}
          </div>

          {/* Quick Action Buttons (Compare & Save) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!toggleCompare(unit.id)) {
                  window.alert(tx(`تقدر تقارن ${COMPARE_MAX} وحدات بس في المرة.`, `You can compare up to ${COMPARE_MAX} units.`));
                }
              }}
              aria-pressed={compared}
              aria-label={compared ? tx('شيلها من المقارنة', 'Remove from comparison') : tx('قارن', 'Compare')}
              title={compared ? tx('في المقارنة', 'In comparison') : tx('قارن', 'Compare')}
              className={`grid place-items-center w-8 h-8 rounded-full transition-all shadow-xs ${
                compared
                  ? 'bg-brand text-white'
                  : 'bg-surface/90 backdrop-blur-xs text-ink-soft hover:bg-surface hover:text-brand'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveUnit(unit.id);
              }}
              aria-label={tx('حفظ', 'Save')}
              className="grid place-items-center w-8 h-8 rounded-full bg-surface/90 backdrop-blur-xs text-ink-soft hover:bg-surface shadow-xs transition"
            >
              <Heart
                key={String(saved)}
                className={`w-3.5 h-3.5 transition-colors ${
                  saved ? 'fill-danger text-danger heart-pop' : 'text-ink-soft'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom image pills */}
        <div className="absolute inset-x-2.5 bottom-2.5 flex items-end justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-md bg-ink/75 backdrop-blur-xs text-white px-2 py-0.5 text-[11px] font-medium" dir="ltr">
            {unit.verificationCode}
          </span>

          {tag && (
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold shadow-xs ${
              tag.strong ? 'bg-brand text-white' : 'bg-surface/95 text-ink'
            }`}>
              {tag.label}
            </span>
          )}
        </div>
      </div>

      {/* Card Content - Compact & High-Impact */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Compound */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-ink line-clamp-1 group-hover:text-brand transition-colors">
              {pick(language, unit.compound, unit.compoundEn)}
            </h3>
          </div>

          {/* Location & Developer */}
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-brand/80" />
            <span className="truncate">{pick(language, unit.location, unit.locationEn)}</span>
            <span>·</span>
            <span className="truncate">{pick(language, unit.developer, unit.developerEn)}</span>
          </p>

          {/* Specs Micro-Strip */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-soft font-medium">
            <span className="bg-paper px-2 py-0.5 rounded-md border border-line/60">
              {unit.areaM2} {tx('م²', 'm²')}
            </span>
            {unit.bedrooms > 0 && (
              <span className="bg-paper px-2 py-0.5 rounded-md border border-line/60">
                {unit.bedrooms} {tx('غرف', 'beds')}
              </span>
            )}
            {unit.bathrooms > 0 && (
              <span className="bg-paper px-2 py-0.5 rounded-md border border-line/60">
                {unit.bathrooms} {tx('حمام', 'baths')}
              </span>
            )}
            <span className="bg-paper px-2 py-0.5 rounded-md border border-line/60 text-muted">
              {deliveryLabel(unit, language)}
            </span>
          </div>
        </div>

        {/* Pricing & Financials Block */}
        <div className="mt-3.5 pt-3 border-t border-line/70">
          <div className="grid grid-cols-2 gap-2 bg-paper/70 p-2.5 rounded-xl border border-line/70">
            {/* Cash Now */}
            <div>
              <span className="text-[11px] font-medium text-muted block leading-none">
                {tx('كاش دلوقتي', 'Cash now')}
              </span>
              <div className="mt-1">
                {deal && (
                  <span className="text-[10px] text-danger font-bold line-through block leading-tight">
                    {tx('كان', 'was')} {full(unit.paidCashAmount)}
                  </span>
                )}
                <span className="num font-black text-base sm:text-lg text-brand block leading-tight">
                  {full(cash)}
                </span>
                <span className="text-[10px] text-muted font-medium">{cur}</span>
              </div>
            </div>

            {/* Monthly Installment */}
            <div className="text-end border-s border-line/70 ps-2 flex flex-col justify-end">
              <span className="text-[11px] font-medium text-muted block leading-none">
                {tx('قسط شهري تقريباً', 'Monthly')}
              </span>
              <div className="mt-1">
                <span className="num font-black text-base sm:text-lg text-ink block leading-tight">
                  {full(monthly)}
                </span>
                <span className="text-[10px] text-muted font-medium">{tx(`${cur} / شهر`, `${cur}/mo`)}</span>
              </div>
            </div>
          </div>

          {/* Prominent High-Visibility Callout Banners */}
          <div className="mt-2 space-y-1.5">
            {/* 1. Explicit Seller Discount Callout */}
            {deal && (
              <div className="flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-400 px-2.5 py-1 text-xs font-black">
                <Flame className="w-3.5 h-3.5 shrink-0 fill-current" />
                <span>
                  {tx(
                    `خصم ${full(discountVal)} ج.م أقل من اللي دفعه المالك!`,
                    `${full(discountVal)} EGP discount below what owner paid!`
                  )}
                </span>
              </div>
            )}

            {/* 2. Explicit Negotiable Callout */}
            {negotiable && (
              <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-black">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{tx('الكاش قابل للتفاوض مع المالك', 'Cash is negotiable')}</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-extrabold">
                  {tx('يرحب بالعروض', 'Open to offers')}
                </span>
              </div>
            )}

            {/* 3. Overall Savings Row */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-muted font-medium">
                {tx('توفيرك عن المطور:', 'Savings vs dev:')}
              </span>
              <span className="font-extrabold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded">
                +{full(savings)} {cur} ({savingsPct}%)
              </span>
            </div>
          </div>
        </div>

        {footer}
      </div>
    </article>
  );
};
