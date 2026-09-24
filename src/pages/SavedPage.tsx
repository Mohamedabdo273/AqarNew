import React from 'react';
import { Heart, Search } from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { UnitCard } from '../components/UnitCard';

interface SavedPageProps {
  onSelectUnit: (unit: RealEstateUnit) => void;
  onNavigate: (page: PageId) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({ onSelectUnit, onNavigate }) => {
  const { tx } = useLanguage();
  const { units, savedUnitIds } = useUnits();
  const saved = units.filter((u) => savedUnitIds.includes(u.id));

  return (
    <div className="page-wrap py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('المفضلة', 'Saved')}</h1>
      <p className="mt-2 text-muted">
        {saved.length > 0
          ? tx(`${saved.length} وحدة حفظتها`, `${saved.length} saved units`)
          : tx('الوحدات اللي تدوس عليها ❤️ بتتجمع هنا', 'Units you ❤️ collect here')}
      </p>

      {saved.length > 0 ? (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((u) => (
            <UnitCard key={u.id} unit={u} onOpen={onSelectUnit} />
          ))}
        </div>
      ) : (
        <div className="mt-8 card p-12 text-center">
          <span className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-danger-soft text-danger">
            <Heart className="w-7 h-7" />
          </span>
          <p className="mt-4 font-bold text-lg text-ink">{tx('لسه ما حفظتش حاجة', 'Nothing saved yet')}</p>
          <p className="mt-1 text-muted">{tx('دوس على ❤️ في أي وحدة عشان ترجعلها بعدين', 'Tap ❤️ on any unit to come back to it later')}</p>
          <button onClick={() => onNavigate('opportunities')} className="btn-primary mt-6">
            <Search className="w-5 h-5" />
            {tx('تصفح الوحدات', 'Browse units')}
          </button>
        </div>
      )}
    </div>
  );
};
