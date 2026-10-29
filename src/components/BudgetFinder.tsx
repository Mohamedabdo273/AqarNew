import React from 'react';
import { Wallet, CalendarClock } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { cashPrice, currency, money, monthlyInstallment } from '../lib/unitHelpers';

export interface Budget {
  cash: number;
  monthly: number;
}

export const CASH_RANGE = { min: 250_000, max: 6_000_000, step: 50_000 };
export const MONTHLY_RANGE = { min: 5_000, max: 150_000, step: 1_000 };
export const DEFAULT_BUDGET: Budget = { cash: 2_500_000, monthly: 55_000 };

export const fitsBudget = (unit: RealEstateUnit, budget: Budget) =>
  cashPrice(unit) <= budget.cash && monthlyInstallment(unit) <= budget.monthly;

interface SliderProps {
  icon: React.ElementType;
  label: string;
  value: number;
  range: { min: number; max: number; step: number };
  onChange: (v: number) => void;
  dark?: boolean;
}

export const BudgetSlider: React.FC<SliderProps> = ({ icon: Icon, label, value, range, onChange, dark }) => {
  const { language, isRTL } = useLanguage();
  const pct = ((value - range.min) / (range.max - range.min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`flex items-center gap-2 text-sm font-medium ${dark ? 'text-white/70' : 'text-ink-soft'}`}>
          <Icon className={`w-4 h-4 ${dark ? 'text-white/70' : 'text-brand'}`} />
          {label}
        </span>
        <span className={`num font-display text-xl font-bold ${dark ? 'text-white' : 'text-ink'}`}>
          {money(value, language)} <span className={`text-xs font-medium ${dark ? 'text-white/50' : 'text-muted'}`}>{currency(language)}</span>
        </span>
      </div>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: dark
            ? `linear-gradient(to ${isRTL ? 'left' : 'right'}, #ffffff ${pct}%, rgb(255 255 255 / 0.15) ${pct}%)`
            : `linear-gradient(to ${isRTL ? 'left' : 'right'}, var(--color-brand) ${pct}%, var(--color-line) ${pct}%)`,
          accentColor: dark ? '#ffffff' : undefined,
        }}
      />
    </div>
  );
};

interface BudgetFinderProps {
  budget: Budget;
  onChange: (b: Budget) => void;
  /** Light-on-dark styling, for the black hero card. */
  dark?: boolean;
}

export const BudgetFinder: React.FC<BudgetFinderProps> = ({ budget, onChange, dark }) => {
  const { tx } = useLanguage();
  return (
    <div className="space-y-6">
      <BudgetSlider
        icon={Wallet}
        label={tx('معاك كاش قد إيه؟', 'Cash you have')}
        value={budget.cash}
        range={CASH_RANGE}
        onChange={(cash) => onChange({ ...budget, cash })}
        dark={dark}
      />
      <BudgetSlider
        icon={CalendarClock}
        label={tx('تقدر تدفع كام في الشهر؟', 'Monthly you can pay')}
        value={budget.monthly}
        range={MONTHLY_RANGE}
        onChange={(monthly) => onChange({ ...budget, monthly })}
        dark={dark}
      />
    </div>
  );
};
