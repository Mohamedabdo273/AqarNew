import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { COUNTRIES, joinPhone, splitPhone } from '../lib/countries';

/**
 * A mobile number with its country code, as one box. The value is the whole number as the API stores it (see joinPhone).
 * The closed picker shows the code only; the invisible select on top of it opens the list with the country names.
 */
export const PhoneInput: React.FC<{
  id: string;
  value: string;
  onChange: (phone: string) => void;
  invalid?: boolean;
  autoComplete?: string;
}> = ({ id, value, onChange, invalid, autoComplete }) => {
  const { language, tx } = useLanguage();
  const { dial, local } = splitPhone(value);
  return (
    <div
      dir="ltr"
      aria-invalid={invalid}
      className="flex h-13 w-full items-stretch rounded-xl border border-field-border bg-field text-[15px] text-ink transition hover:border-brand/60 focus-within:border-brand focus-within:bg-surface focus-within:ring-4 focus-within:ring-brand/15"
    >
      <div className="relative flex shrink-0 items-center gap-1.5 border-e border-field-border px-3.5 hover:bg-brand-soft/60 rounded-s-xl transition-colors">
        <span className="num font-semibold">+{dial}</span>
        <ChevronDown className="w-4 h-4 text-brand" strokeWidth={2.5} />
        <select
          value={dial}
          onChange={(e) => onChange(joinPhone(e.target.value, local))}
          aria-label={tx('كود الدولة', 'Country code')}
          className="appearance-none absolute inset-0 w-full cursor-pointer opacity-0"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.dial}>
              {language === 'ar' ? c.ar : c.en} +{c.dial}
            </option>
          ))}
        </select>
      </div>
      <input
        id={id}
        value={local}
        onChange={(e) => onChange(joinPhone(dial, e.target.value))}
        inputMode="tel"
        placeholder={dial === '20' ? '01xxxxxxxxx' : 'xxxxxxxxx'}
        autoComplete={autoComplete}
        className="num min-w-0 flex-1 rounded-e-xl bg-transparent px-3.5 text-left outline-none placeholder:text-ink/40"
      />
    </div>
  );
};
