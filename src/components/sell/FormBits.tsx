import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, ImagePlus, Minus, Plus, Upload, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { foldArabic } from '../../lib/developers';
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

/**
 * A single choice as a native drop-down. value can be '' — "nothing picked yet" is a real state for every choice in the form;
 * it shows the placeholder unless one of the options is itself '' (e.g. "Don't know").
 */
export function Select<T extends string>({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id?: string;
  options: { value: T; label: string }[];
  value: T | '';
  onChange: (v: T) => void;
  placeholder?: string;
}) {
  const { tx } = useLanguage();
  const hasEmpty = options.some((o) => o.value === '');
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className="field">
      {!hasEmpty && (
        <option value="" disabled>
          {placeholder ?? tx('اختار', 'Choose')}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
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
      <div className="flex items-center justify-between h-13 rounded-xl border border-field-border bg-field px-2">
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
    <div className={`rounded-xl border p-4 transition-colors ${bg}`}>
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
    <span className={`mt-0.5 grid place-items-center w-6 h-6 rounded-xl border-2 shrink-0 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand ${checked ? 'bg-brand border-brand text-white' : 'border-field-border bg-surface'}`}>
      {checked && <Check className="w-4 h-4" strokeWidth={3} />}
    </span>
    <span className="text-[15px] text-ink leading-relaxed">{children}</span>
  </label>
);

/** `onFile` gets the picked File itself, for callers that upload it. */
export const FilePick: React.FC<{ label: string; hint: string; value: string; onChange: (name: string) => void; onFile?: (file: File | null) => void; required?: boolean }> = ({
  label,
  hint,
  value,
  onChange,
  onFile,
  required,
}) => (
  <label className={`flex items-center gap-4 rounded-xl border-2 border-dashed p-4 cursor-pointer transition-colors ${value ? 'border-brand bg-brand-soft/50' : 'border-field-border hover:border-brand'}`}>
    <span className={`grid place-items-center w-11 h-11 rounded-xl shrink-0 ${value ? 'bg-brand text-white' : 'bg-brand-soft text-brand'}`}>
      {value ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
    </span>
    <span className="min-w-0">
      <span className="block font-semibold text-ink">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      <span className="block text-sm text-muted truncate">{value || hint}</span>
    </span>
    <input
      type="file"
      accept="image/*,.pdf"
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0] ?? null;
        onChange(file?.name || '');
        onFile?.(file);
      }}
    />
  </label>
);

/** رفع أكتر من صورة لنفس المستند — صفحات العقد مثلاً. */
export const FilePickMany: React.FC<{
  label: string;
  hint: string;
  max: number;
  value: string[];
  onChange: (names: string[]) => void;
  /** The picked Files, kept in the same order as `value`. */
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  required?: boolean;
}> = ({ label, hint, max, value, onChange, files = [], onFilesChange, required }) => {
  const full = value.length >= max;
  return (
    <div className={`rounded-xl border-2 border-dashed p-4 transition-colors ${value.length ? 'border-brand bg-brand-soft/50' : 'border-field-border'}`}>
      <label className={`flex items-center gap-4 ${full ? 'cursor-default' : 'cursor-pointer'}`}>
        <span className={`grid place-items-center w-11 h-11 rounded-xl shrink-0 ${value.length ? 'bg-brand text-white' : 'bg-brand-soft text-brand'}`}>
          {value.length ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-ink">
            {label}
            {required && <span className="text-danger"> *</span>} <span className="num text-sm font-normal text-muted">({value.length}/{max})</span>
          </span>
          <span className="block text-sm text-muted truncate">{hint}</span>
        </span>
        <input
          type="file"
          accept="image/*,.pdf"
          multiple
          disabled={full}
          className="sr-only"
          onChange={(e) => {
            const pickedFiles = [...(e.target.files ?? [])];
            onChange([...value, ...pickedFiles.map((f) => f.name)].slice(0, max));
            onFilesChange?.([...files, ...pickedFiles].slice(0, max));
            e.target.value = ''; // عشان تقدر ترفع نفس الملف تاني لو شيلته
          }}
        />
      </label>
      {value.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {value.map((name, i) => (
            <li key={name + i} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
              <span className="num text-xs text-muted shrink-0">{i + 1}</span>
              <span className="flex-1 truncate text-ink">{name}</span>
              <button
                type="button"
                onClick={() => {
                  onChange(value.filter((_, j) => j !== i));
                  onFilesChange?.(files.filter((_, j) => j !== i));
                }}
                className="grid place-items-center w-8 h-8 rounded-lg text-muted hover:bg-danger-soft hover:text-danger shrink-0"
                aria-label="شيل الملف"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** Listing photos with thumbnails. The first one is the cover on the unit card. */
export const PhotoPick: React.FC<{ files: File[]; onChange: (files: File[]) => void; max: number }> = ({ files, onChange, max }) => {
  const { tx } = useLanguage();
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);
  const full = files.length >= max;

  return (
    <div className={`rounded-xl border-2 border-dashed p-4 transition-colors ${files.length ? 'border-brand bg-brand-soft/50' : 'border-field-border'}`}>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {previews.map((src, i) => (
          <div key={src} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface">
            <img src={src} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-1 start-1 rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-bold text-white">{tx('الغلاف', 'Cover')}</span>
            )}
            <button
              type="button"
              onClick={() => onChange(files.filter((_, j) => j !== i))}
              className="absolute top-1 end-1 grid place-items-center w-7 h-7 rounded-full bg-ink/70 text-white hover:bg-danger"
              aria-label={tx('شيل الصورة', 'Remove photo')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {!full && (
          <label className="aspect-[4/3] grid place-items-center rounded-lg border border-line bg-surface text-brand cursor-pointer hover:border-brand">
            <span className="flex flex-col items-center gap-1 text-sm font-semibold">
              <ImagePlus className="w-6 h-6" />
              {tx('ضيف صور', 'Add photos')}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(e) => {
                onChange([...files, ...(e.target.files ?? [])].slice(0, max));
                e.target.value = '';
              }}
            />
          </label>
        )}
      </div>
      <p className="num mt-3 text-sm text-muted">
        {tx(`${files.length} من ${max} — أول صورة هي اللي بتظهر على الكارت`, `${files.length} of ${max} — the first one shows on the card`)}
      </p>
    </div>
  );
};

/** A drop-down list where several options can be ticked (a native <select multiple> is hard to use). */
export function MultiSelect<T extends string>({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id?: string;
  options: { value: T; label: string }[];
  value: T[];
  onChange: (v: T[]) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  // Shown in the options' order, whatever order they were ticked in.
  const picked = options.filter((o) => value.includes(o.value));

  return (
    <div ref={box} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="field flex items-center justify-between gap-2 text-start"
      >
        <span className={`truncate ${picked.length ? 'text-ink' : 'text-muted'}`}>
          {picked.length ? picked.map((o) => o.label).join('، ') : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" aria-multiselectable="true" className="absolute z-20 mt-1.5 w-full rounded-xl border border-line bg-surface p-1.5 shadow-lift">
          {options.map((o) => {
            const on = value.includes(o.value);
            return (
              <li key={o.value} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-start text-[15px] text-ink hover:bg-paper"
                >
                  <span className={`grid place-items-center w-5 h-5 rounded-md border-2 shrink-0 ${on ? 'bg-brand border-brand text-white' : 'border-line-strong'}`}>
                    {on && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </span>
                  {o.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** A single-choice drop-down with a search box — for long lists (some locations have 50+ districts, developers, compounds). */
export function SearchSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  clearLabel,
  disabled,
  searchable,
  allowCustom,
  customLabel,
}: {
  id?: string;
  /** `search` = extra text to match (e.g. the other language's name). */
  options: { value: string; label: string; search?: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  /** First row that empties the choice (the field is optional). */
  clearLabel?: string;
  disabled?: boolean;
  searchable?: boolean;
  allowCustom?: boolean;
  customLabel?: string;
}) {
  const { tx } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  const shown = useMemo(() => {
    const q = foldArabic(query.trim());
    return q ? options.filter((o) => foldArabic(`${o.label} ${o.search ?? ''}`).includes(q)) : options;
  }, [options, query]);
  const picked = options.find((o) => o.value === value || o.label === value);
  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery('');
  };

  const showSearchInput = searchable ?? options.length > 8;

  return (
    <div ref={box} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="field flex items-center justify-between gap-2 text-start disabled:opacity-60 cursor-pointer"
      >
        <span className={`truncate ${picked || value ? 'text-ink font-medium' : 'text-muted'}`}>
          {picked?.label ?? (value || placeholder)}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-line bg-surface p-1.5 shadow-lift">
          {showSearchInput && (
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tx('دوّر…', 'Search…')}
              aria-label={tx('دوّر', 'Search')}
              className="field mb-1.5 py-2 text-sm"
            />
          )}
          <ul role="listbox" className="max-h-64 overflow-y-auto">
            {clearLabel && !query && (
              <li role="option" aria-selected={!value}>
                <button type="button" onClick={() => pick('')} className="w-full rounded-lg px-3 py-2 text-start text-sm text-muted hover:bg-paper cursor-pointer">
                  {clearLabel}
                </button>
              </li>
            )}

            {shown.map((o) => {
              const isSelected = o.value === value || o.label === value;
              return (
                <li key={o.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => pick(o.value)}
                    className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm cursor-pointer transition-colors ${
                      isSelected ? 'bg-brand text-white font-bold' : 'text-ink hover:bg-paper'
                    }`}
                  >
                    <span className="truncate">{o.label}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-white" strokeWidth={3} />}
                  </button>
                </li>
              );
            })}

            {/* Custom search query quick-pick if not found in list — under the matches, so a real match gets picked first */}
            {allowCustom && query.trim() && !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase() || o.value.toLowerCase() === query.trim().toLowerCase()) && (
              <li role="option" className="mt-1">
                <button
                  type="button"
                  onClick={() => pick(query.trim())}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-start text-xs font-bold text-brand bg-brand-soft/20 hover:bg-brand-soft/40 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{tx(`استخدام "${query.trim()}"`, `Use "${query.trim()}"`)}</span>
                </button>
              </li>
            )}

            {!shown.length && !allowCustom && <li className="px-3 py-2.5 text-sm text-muted">{tx('مفيش نتايج', 'No matches')}</li>}

            {allowCustom && (
              <li role="option" className="border-t border-line mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => pick('__OTHER__')}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-start text-xs font-bold text-brand hover:bg-brand-soft/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{customLabel ?? tx('اختيار آخر (كتابة يدوية)', 'Other (manual entry)')}</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <fieldset className="space-y-5">
    <legend className="text-sm font-bold text-muted uppercase tracking-wide mb-4">{title}</legend>
    {children}
  </fieldset>
);

