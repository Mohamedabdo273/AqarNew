import React from 'react';
import { Check, Minus, Plus, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { currency } from '../../lib/unitHelpers';

/* Shared form building blocks for the sell flow. */

export const Field: React.FC<{ label: string; required?: boolean; hint?: string; htmlFor?: string; children: React.ReactNode }> = ({
  label,
  required,
  hint,
  htmlFor,
  children,
}) => (
  <div>
    <label htmlFor={htmlFor} className="label">
      {label}
      {required && <span className="text-danger"> *</span>}
    </label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
  </div>
);

/** Number placeholders get an "e.g." so they never look like a value someone already typed. */
const useExample = () => {
  const { tx } = useLanguage();
  return (p?: string) => (p ? `${tx('مثلاً', 'e.g.')} ${p}` : undefined);
};

export const MoneyInput: React.FC<{ id: string; value: number; onChange: (n: number) => void; placeholder?: string }> = ({ id, value, onChange, placeholder }) => {
  const { language, isRTL } = useLanguage();
  const example = useExample();
  return (
    <div className="relative">
      <input
        id={id}
        inputMode="numeric"
        dir="ltr"
        value={value ? value.toLocaleString('en-US') : ''}
        onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
        placeholder={example(placeholder)}
        className={`field num font-semibold ${isRTL ? 'pl-16 text-right' : 'pr-16 text-left'}`}
      />
      <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-sm text-muted`}>{currency(language)}</span>
    </div>
  );
};

export const NumberInput: React.FC<{ id: string; value: number; onChange: (n: number) => void; placeholder?: string; suffix?: string }> = ({
  id,
  value,
  onChange,
  placeholder,
  suffix,
}) => {
  const { isRTL } = useLanguage();
  const example = useExample();
  return (
    <div className="relative">
      <input
        id={id}
        inputMode="numeric"
        dir="ltr"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value.replace(/[^\d.]/g, '')) || 0)}
        placeholder={example(placeholder)}
        className={`field num ${isRTL ? 'text-right' : 'text-left'} ${suffix ? (isRTL ? 'pl-12' : 'pr-12') : ''}`}
      />
      {suffix && <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-sm text-muted`}>{suffix}</span>}
    </div>
  );
};

export function ChipSelect<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} aria-pressed={value === o.value} className={value === o.value ? 'chip-on' : 'chip-off'}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Month + year picker stored as 'YYYY-MM' — in the page's language, unlike the native date input. */
export const MonthYearInput: React.FC<{ id: string; value: string; onChange: (v: string) => void }> = ({ id, value, onChange }) => {
  const { language, tx } = useLanguage();
  const [y, m] = value ? value.split('-') : ['', ''];
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => String(thisYear - 1 + i));
  // Keeps a half-picked value ('2027-' or '-05') so the other select doesn't reset.
  const update = (ny: string, nm: string) => onChange(ny || nm ? `${ny}-${nm}` : '');
  return (
    <div className="grid grid-cols-2 gap-2">
      <select id={id} value={m ?? ''} onChange={(e) => update(y ?? '', e.target.value)} aria-label={tx('الشهر', 'Month')} className="field">
        <option value="">{tx('الشهر', 'Month')}</option>
        {(language === 'ar' ? MONTHS_AR : MONTHS_EN).map((name, i) => (
          <option key={name} value={String(i + 1).padStart(2, '0')}>
            {name}
          </option>
        ))}
      </select>
      <select value={y ?? ''} onChange={(e) => update(e.target.value, m ?? '')} aria-label={tx('السنة', 'Year')} className="field num">
        <option value="">{tx('السنة', 'Year')}</option>
        {years.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Counter: React.FC<{ label: string; value: number; onChange: (n: number) => void; min?: number; max?: number }> = ({ label, value, onChange, min = 0, max = 10 }) => {
  const { tx } = useLanguage();
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex items-center justify-between h-13 rounded-2xl border border-field-border bg-field px-2">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={tx('أقل', 'Less')} className="grid place-items-center w-9 h-9 rounded-full hover:bg-paper disabled:opacity-30" disabled={value <= min}>
          <Minus className="w-4 h-4" />
        </button>
        <span className="num text-lg font-bold text-ink">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label={tx('أكتر', 'More')} className="grid place-items-center w-9 h-9 rounded-full hover:bg-paper disabled:opacity-30" disabled={value >= max}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Toggle: React.FC<{ label: string; hint?: string; on: boolean; onChange: (v: boolean) => void; children?: React.ReactNode; tone?: 'danger' | 'accent' }> = ({
  label,
  hint,
  on,
  onChange,
  children,
  tone,
}) => {
  const bg = on ? (tone === 'danger' ? 'bg-danger-soft border-danger/20' : tone === 'accent' ? 'bg-accent-soft border-accent/20' : 'bg-brand-soft border-brand/20') : 'bg-surface border-line';
  return (
    <div className={`rounded-2xl border p-4 transition-colors ${bg}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-ink">{label}</p>
          {hint && <p className="text-sm text-muted mt-0.5">{hint}</p>}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          onClick={() => onChange(!on)}
          className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${on ? (tone === 'danger' ? 'bg-danger' : tone === 'accent' ? 'bg-accent' : 'bg-brand') : 'bg-field-border'}`}
        >
          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'start-6' : 'start-1'}`} />
        </button>
      </div>
      {on && children && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
};

export const CheckBox: React.FC<{ checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }> = ({ checked, onChange, children }) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
    <span className={`mt-0.5 grid place-items-center w-6 h-6 rounded-lg border-2 shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand ${checked ? 'bg-brand border-brand text-white' : 'border-field-border bg-surface'}`}>
      {checked && <Check className="w-4 h-4" strokeWidth={3} />}
    </span>
    <span className="text-[15px] text-ink leading-relaxed">{children}</span>
  </label>
);

export const FilePick: React.FC<{ label: string; hint: string; value: string; onChange: (name: string) => void }> = ({ label, hint, value, onChange }) => (
  <label className={`flex items-center gap-4 rounded-2xl border-2 border-dashed p-4 cursor-pointer transition-colors ${value ? 'border-brand bg-brand-soft/50' : 'border-field-border hover:border-ink'}`}>
    <span className={`grid place-items-center w-11 h-11 rounded-xl shrink-0 ${value ? 'bg-brand text-white' : 'bg-brand-soft text-brand'}`}>
      {value ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
    </span>
    <span className="min-w-0">
      <span className="block font-semibold text-ink">{label}</span>
      <span className="block text-sm text-muted truncate">{value || hint}</span>
    </span>
    <input type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => onChange(e.target.files?.[0]?.name || '')} />
  </label>
);

export const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <fieldset className="space-y-5">
    <legend className="text-sm font-bold text-muted uppercase tracking-wide mb-4">{title}</legend>
    {children}
  </fieldset>
);

