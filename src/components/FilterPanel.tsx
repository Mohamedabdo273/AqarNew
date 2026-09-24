import React, { useMemo, useState } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Budget, BudgetFinder } from './BudgetFinder';
import { Filters } from '../lib/unitFilters';
import { DELIVERY_OPTIONS, FINISHING_OPTIONS, FREQUENCY_OPTIONS, PROPERTY_TYPES, REGIONS, pick } from '../lib/unitHelpers';

interface FilterPanelProps {
  units: RealEstateUnit[];
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  budget: Budget;
  onBudgetChange: (b: Budget) => void;
  budgetOn: boolean;
  onBudgetOnChange: (on: boolean) => void;
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const Switch: React.FC<{ on: boolean; onClick: () => void; label: string }> = ({ on, onClick, label }) => (
  <button
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onClick}
    className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${on ? 'bg-brand' : 'bg-line-strong'}`}
  >
    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'start-6' : 'start-1'}`} />
  </button>
);

const Section: React.FC<{ title: string; active?: number; defaultOpen?: boolean; children: React.ReactNode }> = ({
  title,
  active = 0,
  defaultOpen = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line last:border-0 py-5 first:pt-0">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-center justify-between gap-2 text-start">
        <span className="flex items-center gap-2 font-bold text-ink">
          {title}
          {active > 0 && (
            <span className="num grid place-items-center min-w-5 h-5 px-1.5 rounded-full bg-brand text-white text-xs">{active}</span>
          )}
        </span>
        <ChevronDown className={`w-5 h-5 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
};

const Chips: React.FC<{ options: { value: string; label: string }[]; selected: string[]; onToggle: (v: string) => void }> = ({
  options,
  selected,
  onToggle,
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button key={o.value} onClick={() => onToggle(o.value)} aria-pressed={selected.includes(o.value)} className={selected.includes(o.value) ? 'chip-on' : 'chip-off'}>
        {o.label}
      </button>
    ))}
  </div>
);

const RangeFields: React.FC<{ min: number; max: number; onChange: (min: number, max: number) => void; unit: string; money?: boolean }> = ({
  min,
  max,
  onChange,
  unit,
  money,
}) => {
  const { tx, isRTL } = useLanguage();
  const fmt = (n: number) => (n ? (money ? n.toLocaleString('en-US') : String(n)) : '');
  const parse = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0;
  const cls = `field h-11 text-sm num ${isRTL ? 'text-right' : 'text-left'}`;
  return (
    <div className="grid grid-cols-2 gap-2">
      <label>
        <span className="block text-xs text-muted mb-1">{tx('من', 'Min')} ({unit})</span>
        <input inputMode="numeric" dir="ltr" value={fmt(min)} onChange={(e) => onChange(parse(e.target.value), max)} placeholder="—" className={cls} />
      </label>
      <label>
        <span className="block text-xs text-muted mb-1">{tx('إلى', 'Max')} ({unit})</span>
        <input inputMode="numeric" dir="ltr" value={fmt(max)} onChange={(e) => onChange(min, parse(e.target.value))} placeholder="—" className={cls} />
      </label>
    </div>
  );
};

export const FilterPanel: React.FC<FilterPanelProps> = ({
  units,
  filters: f,
  onChange,
  budget,
  onBudgetChange,
  budgetOn,
  onBudgetOnChange,
}) => {
  const { language, tx } = useLanguage();
  const [devQuery, setDevQuery] = useState('');

  const developers = useMemo(() => {
    const map = new Map<string, { value: string; label: string; count: number }>();
    units.forEach((u) => {
      const cur = map.get(u.developer);
      if (cur) cur.count++;
      else map.set(u.developer, { value: u.developer, label: pick(language, u.developer, u.developerEn), count: 1 });
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [units, language]);

  const shownDevs = developers.filter((d) => d.label.toLowerCase().includes(devQuery.trim().toLowerCase()));
  const L = (o: { ar: string; en: string }) => ({ value: o.ar, label: language === 'ar' ? o.ar : o.en });

  const extras: { key: 'negotiable' | 'swappable' | 'noTransferFee' | 'noPenalties'; label: string }[] = [
    { key: 'negotiable', label: tx('فيها خصم / قابلة للتفاوض', 'Discount / negotiable') },
    { key: 'swappable', label: tx('تقبل مبادلة', 'Open to swap') },
    { key: 'noTransferFee', label: tx('معفاة من رسوم التنازل', 'No transfer fee') },
    { key: 'noPenalties', label: tx('بدون غرامات تأخير', 'No late penalties') },
  ];

  return (
    <div>
      <Section title={tx('دوّر بميزانيتك', 'Search by budget')} active={budgetOn ? 1 : 0} defaultOpen>
        <div className="flex items-center justify-between gap-3 mb-5 rounded-2xl bg-paper px-4 py-3">
          <span className="text-sm text-ink-soft">{tx('وريني اللي على قدي بس', 'Only show what I can afford')}</span>
          <Switch on={budgetOn} onClick={() => onBudgetOnChange(!budgetOn)} label={tx('دوّر بميزانيتك', 'Search by budget')} />
        </div>
        <div className={budgetOn ? '' : 'opacity-40 pointer-events-none'}>
          <BudgetFinder budget={budget} onChange={onBudgetChange} />
        </div>
      </Section>

      <Section title={tx('المنطقة', 'Area')} active={f.regions.length} defaultOpen>
        <Chips options={REGIONS.map(L)} selected={f.regions} onToggle={(v) => onChange({ regions: toggle(f.regions, v) })} />
      </Section>

      <Section title={tx('النوع', 'Type')} active={f.types.length} defaultOpen>
        <Chips options={PROPERTY_TYPES.map(L)} selected={f.types} onToggle={(v) => onChange({ types: toggle(f.types, v) })} />
      </Section>

      <Section title={tx('المطور', 'Developer')} active={f.developers.length}>
        {developers.length > 6 && (
          <div className="relative mb-3">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted" />
            <input value={devQuery} onChange={(e) => setDevQuery(e.target.value)} placeholder={tx('دوّر على مطور', 'Find developer')} className="field h-11 text-sm ps-9" />
          </div>
        )}
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {shownDevs.map((d) => {
            const on = f.developers.includes(d.value);
            return (
              <li key={d.value}>
                <button
                  onClick={() => onChange({ developers: toggle(f.developers, d.value) })}
                  aria-pressed={on}
                  className="w-full flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-paper text-start"
                >
                  <span className={`grid place-items-center w-5 h-5 rounded-md border-2 shrink-0 ${on ? 'bg-brand border-brand text-white' : 'border-line-strong'}`}>
                    {on && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 text-sm text-ink truncate">{d.label}</span>
                  <span className="num text-xs text-muted">{d.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title={tx('عدد الغرف', 'Bedrooms')} active={f.bedrooms !== null ? 1 : 0}>
        <div className="grid grid-cols-6 gap-1.5">
          {[null, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={String(n)}
              onClick={() => onChange({ bedrooms: n })}
              aria-pressed={f.bedrooms === n}
              className={`h-11 rounded-xl text-sm font-semibold border transition-colors ${
                f.bedrooms === n ? 'bg-brand text-white border-brand' : 'bg-surface border-line text-ink-soft hover:border-line-strong'
              }`}
            >
              {n === null ? tx('الكل', 'Any') : n === 5 ? '5+' : n}
            </button>
          ))}
        </div>
      </Section>

      <Section title={tx('المساحة', 'Size')} active={f.areaMin || f.areaMax ? 1 : 0}>
        <RangeFields min={f.areaMin} max={f.areaMax} unit={tx('م²', 'm²')} onChange={(areaMin, areaMax) => onChange({ areaMin, areaMax })} />
      </Section>

      <Section title={tx('سعر العقد', 'Contract price')} active={f.priceMin || f.priceMax ? 1 : 0}>
        <RangeFields money min={f.priceMin} max={f.priceMax} unit={tx('ج.م', 'EGP')} onChange={(priceMin, priceMax) => onChange({ priceMin, priceMax })} />
      </Section>

      <Section title={tx('الاستلام', 'Delivery')} active={f.delivery.length}>
        <Chips
          options={DELIVERY_OPTIONS.map((d) => ({ value: d.ar, label: language === 'ar' ? d.short : d.en }))}
          selected={f.delivery}
          onToggle={(v) => onChange({ delivery: toggle(f.delivery, v) })}
        />
      </Section>

      <Section title={tx('التشطيب', 'Finishing')} active={f.finishing.length}>
        <Chips options={FINISHING_OPTIONS.map(L)} selected={f.finishing} onToggle={(v) => onChange({ finishing: toggle(f.finishing, v) })} />
      </Section>

      <Section title={tx('نظام القسط', 'Installment plan')} active={f.frequency.length}>
        <Chips options={FREQUENCY_OPTIONS.map(L)} selected={f.frequency} onToggle={(v) => onChange({ frequency: toggle(f.frequency, v) })} />
      </Section>

      <Section title={tx('مميزات', 'Extras')} active={extras.filter((e) => f[e.key]).length}>
        <div className="space-y-4">
          {extras.map((e) => (
            <div key={e.key} className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink">{e.label}</span>
              <Switch on={f[e.key]} onClick={() => onChange({ [e.key]: !f[e.key] })} label={e.label} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
