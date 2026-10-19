import React, { useEffect, useState } from 'react';
import { Search, Tag, Repeat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/** Who the visitor is. The whole home page is built for one of them at a time. */
export type HomeRole = 'buy' | 'sell' | 'swap';
const ROLE_KEY = 'home_role';
const ROLES: HomeRole[] = ['buy', 'sell', 'swap'];

/** #home/sell opens straight on the seller's page (handy for ads); otherwise the last choice, else the buyer's. */
const initialRole = (): HomeRole => {
  const fromHash = window.location.hash.replace('#', '').split('/')[1] as HomeRole;
  if (ROLES.includes(fromHash)) return fromHash;
  try {
    const saved = localStorage.getItem(ROLE_KEY) as HomeRole;
    if (ROLES.includes(saved)) return saved;
  } catch {
    /* ignore */
  }
  return 'buy';
};

/** The home role, remembered on this device and kept in the link while on the home page. */
export const useHomeRole = (onHome: boolean) => {
  const [role, setRole] = useState<HomeRole>(initialRole);
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_KEY, role);
    } catch {
      /* ignore */
    }
    if (onHome) history.replaceState(null, '', `#home/${role}`);
  }, [role, onHome]);
  // A #home/sell link opened while the app is already running.
  useEffect(() => {
    const onHash = () => {
      const r = window.location.hash.replace('#', '').split('/')[1] as HomeRole;
      if (ROLES.includes(r)) setRole(r);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [role, setRole] as const;
};

/* "I want to: buy · sell · swap" — a segmented pill in the slim bar under the header on the home page. */
export const RoleSwitch: React.FC<{ role: HomeRole; onChange: (r: HomeRole) => void }> = ({ role, onChange }) => {
  const { tx } = useLanguage();
  const options: [HomeRole, string, React.ElementType][] = [
    ['buy', tx('أشتري', 'Buy'), Search],
    ['sell', tx('أبيع وحدتي', 'Sell my unit'), Tag],
    ['swap', tx('أبدّل وحدتي', 'Swap my unit'), Repeat],
  ];
  return (
    <div role="tablist" aria-label={tx('أنا عاوز', 'I want to')} className="flex w-full sm:w-auto p-1 rounded-full bg-surface border border-line shadow-xs"
    >
      {options.map(([k, label, Icon]) => (
        <button
          key={k}
          role="tab"
          aria-selected={role === k}
          onClick={() => {
            onChange(k);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-7 min-h-10 sm:min-h-11 text-sm sm:text-base font-bold whitespace-nowrap transition-colors ${
            role === k ? 'bg-accent text-white shadow-sm' : 'text-ink-soft hover:text-accent hover:bg-accent-soft'
          }`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          {label}
        </button>
      ))}
    </div>
  );
};
