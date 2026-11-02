import React, { useMemo, useState } from 'react';
import { Building2, Landmark } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { baseName, foldArabic } from '../lib/developers';
import { pick } from '../lib/unitHelpers';

const MAX_PER_GROUP = 5;

interface Suggestion {
  key: string;
  label: string;
  /** The Arabic and English names, folded, to match what's typed. */
  hay: string;
  count: number;
}

/** Each name once, with how many listed units carry it. */
const collect = (units: RealEstateUnit[], ar: (u: RealEstateUnit) => string, en: (u: RealEstateUnit) => string | undefined, lang: 'ar' | 'en'): Suggestion[] => {
  const byName = new Map<string, Suggestion>();
  units.forEach((u) => {
    const name = ar(u)?.trim();
    if (!name) return;
    const key = baseName(name);
    const found = byName.get(key);
    if (found) found.count += 1;
    else byName.set(key, { key, label: pick(lang, name, en(u)), hay: foldArabic(`${name} ${en(u) ?? ''}`), count: 1 });
  });
  return [...byName.values()];
};

/** Best matches first: names that start with what's typed, then the ones with the most units. */
const matches = (list: Suggestion[], q: string) =>
  list
    .filter((s) => !q || s.hay.includes(q))
    .sort((a, b) => Number(b.hay.startsWith(q)) - Number(a.hay.startsWith(q)) || b.count - a.count)
    .slice(0, MAX_PER_GROUP);

interface UnitSearchInputProps {
  units: RealEstateUnit[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel?: string;
  className?: string;
}

/* A search box that suggests only the developers and compounds that have listed units. Free text still searches as before. */
export const UnitSearchInput: React.FC<UnitSearchInputProps> = ({ units, value, onChange, placeholder, ariaLabel, className }) => {
  const { language, tx } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const developers = useMemo(() => collect(units, (u) => u.developer, (u) => u.developerEn, language), [units, language]);
  const compounds = useMemo(() => collect(units, (u) => u.compound, (u) => u.compoundEn, language), [units, language]);

  const q = foldArabic(value.trim());
  const groups = [
    { title: tx('الكمبوندات', 'Compounds'), icon: Landmark, items: matches(compounds, q) },
    { title: tx('المطورين', 'Developers'), icon: Building2, items: matches(developers, q) },
  ].filter((g) => g.items.length > 0);
  const flat = groups.flatMap((g) => g.items);

  const choose = (s: Suggestion) => {
    onChange(s.label);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') return setOpen(false);
    if (!flat.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      // Cycles through the names and back to the box itself (-1).
      const slots = flat.length + 1;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => ((i + 1 + step + slots) % slots) - 1);
    } else if (e.key === 'Enter' && open && active >= 0) {
      // Picks the highlighted name; with nothing highlighted, Enter keeps doing what the page's form does.
      e.preventDefault();
      choose(flat[active]);
    }
  };

  return (
    <div className="relative w-full min-w-0">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        role="combobox"
        aria-expanded={open && flat.length > 0}
        aria-autocomplete="list"
        autoComplete="off"
        className={className}
      />
      {open && flat.length > 0 && (
        <div role="listbox" className="absolute top-full start-0 z-30 mt-3 w-full min-w-[17rem] max-h-80 overflow-y-auto card p-2 shadow-lift text-start">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-muted">{g.title}</p>
              {g.items.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  role="option"
                  aria-selected={flat[active] === s}
                  // Keeps the focus in the box, so the list doesn't close before the click lands.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(s)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm transition-colors hover:bg-paper ${flat[active] === s ? 'bg-paper' : ''}`}
                >
                  <g.icon className="w-4 h-4 text-muted shrink-0" />
                  <span className="min-w-0 flex-1 truncate font-semibold text-ink">{s.label}</span>
                  <span className="num shrink-0 text-xs text-muted">{tx(s.count === 1 ? 'وحدة واحدة' : s.count === 2 ? 'وحدتين' : `${s.count} ${s.count <= 10 ? 'وحدات' : 'وحدة'}`, `${s.count} ${s.count === 1 ? 'unit' : 'units'}`)}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
