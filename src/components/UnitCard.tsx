import React from 'react';
import { Heart, MapPin, BedDouble, Maximize2, KeyRound, BadgeCheck } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { deliveryLabel, money, monthlyInstallment, pick, savingsPercent, currency } from '../lib/unitHelpers';

interface UnitCardProps {
  unit: RealEstateUnit;
  onOpen: (unit: RealEstateUnit) => void;
  /** Shows a "fits your budget" tag when the buyer searched by budget. */
  fitsBudget?: boolean;
  /** Extra pill shown on the image (e.g. swap price difference). */
  tag?: { label: string; strong?: boolean };
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit, onOpen, fitsBudget, tag }) => {
  const { language, tx } = useLanguage();
  const { isUnitSaved, toggleSaveUnit } = useUnits();
  const saved = isUnitSaved(unit.id);
  const pct = savingsPercent(unit);

  return (
    <article
      onClick={() => onOpen(unit)}
      className="group card overflow-hidden cursor-pointer transition-all hover:shadow-lift hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        <img
          src={unit.images[0]}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between">
          {unit.verifiedContract ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-semibold text-brand-ink">
              <BadgeCheck className="w-3.5 h-3.5 text-brand" />
              {tx('موثّقة', 'Verified')}
            </span>
          ) : (
            <span />
          )}
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
        {pct > 0 && (
          <span className="absolute bottom-3 start-3 rounded-full bg-gold text-white px-3 py-1 text-xs font-bold">
            {tx(`أرخص ${pct}% من سعر النهارده`, `${pct}% below today's price`)}
          </span>
        )}
        {tag && (
          <span
            className={`absolute top-14 start-3 rounded-full px-3 py-1 text-xs font-bold shadow ${
              tag.strong ? 'bg-brand text-white' : 'bg-surface text-ink'
            }`}
          >
            {tag.label}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h3 className="font-bold text-[17px] leading-snug text-ink truncate">
            {pick(language, unit.compound, unit.compoundEn)}
          </h3>
          {fitsBudget && (
            <span className="shrink-0 rounded-full bg-brand-soft text-brand-ink px-2.5 py-0.5 text-xs font-semibold">
              {tx('في ميزانيتك', 'In budget')}
            </span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{pick(language, unit.location, unit.locationEn)}</span>
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-muted" />{unit.areaM2} {tx('م²', 'm²')}</span>
          {unit.bedrooms > 0 && (
            <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-muted" />{unit.bedrooms}</span>
          )}
          <span className="flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-muted" />{deliveryLabel(unit, language)}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-line grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted">{tx('تدفع كاش', 'Cash now')}</p>
            <p className="num mt-0.5 text-lg font-bold text-ink whitespace-nowrap">
              {money(unit.paidCashAmount, language)} <span className="text-xs font-medium text-muted">{currency(language)}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">{tx('قسط شهري تقريباً', '≈ Monthly')}</p>
            <p className="num mt-0.5 text-lg font-bold text-brand whitespace-nowrap">
              {money(monthlyInstallment(unit), language)} <span className="text-xs font-medium text-muted">{currency(language)}</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
