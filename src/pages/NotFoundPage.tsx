import React from 'react';
import { Home, Search, Tag, MessageCircle } from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { whatsappLink } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';

interface NotFoundPageProps {
  /** "unit" when a shared unit link points to a unit that's gone (usually sold). */
  variant: 'page' | 'unit';
  suggestions: RealEstateUnit[];
  onNavigate: (page: PageId) => void;
  onSelectUnit: (unit: RealEstateUnit) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ variant, suggestions, onNavigate, onSelectUnit }) => {
  const { tx } = useLanguage();
  const isUnit = variant === 'unit';

  return (
    <div className="page-wrap py-12 sm:py-20">
      <div className="max-w-2xl">
        <p className="num font-display text-7xl sm:text-8xl font-bold text-line-strong" aria-hidden="true">
          {isUnit ? tx('اتباعت', 'Sold') : '404'}
        </p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold leading-tight text-ink">
          {isUnit ? tx('الوحدة دي مش متاحة دلوقتي.', "This unit isn't available anymore.") : tx('الصفحة دي مش موجودة.', "This page doesn't exist.")}
        </h1>
        <p className="mt-3 text-lg text-ink-soft leading-relaxed">
          {isUnit
            ? tx('غالباً اتباعت أو صاحبها سحبها. بس عندنا وحدات شبهها بنفس الفكرة: سعر زمان ومن غير أوفر.', 'It was probably sold or withdrawn. Here are similar ones — same idea: old price, no overprice.')
            : tx('يمكن اللينك فيه غلطة، أو الصفحة اتنقلت. جرّب حاجة من دول:', 'The link may be wrong or the page moved. Try one of these:')}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('opportunities')} className="btn-primary">
            <Search className="w-5 h-5" />
            {tx('شوف الوحدات المتاحة', 'See available units')}
          </button>
          {!isUnit && (
            <button onClick={() => onNavigate('sell')} className="btn-ghost">
              <Tag className="w-5 h-5" />
              {tx('عندي وحدة للبيع', 'I have a unit to sell')}
            </button>
          )}
          <button onClick={() => onNavigate('home')} className="btn-ghost">
            <Home className="w-5 h-5" />
            {tx('الرئيسية', 'Home')}
          </button>
          <a href={whatsappLink(tx('كنت بدوّر على حاجة ومالقيتهاش', "I couldn't find what I was looking for"))} target="_blank" rel="noreferrer" className="btn-ghost">
            <MessageCircle className="w-5 h-5" />
            {tx('اسألنا', 'Ask us')}
          </a>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-14 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">{isUnit ? tx('وحدات شبهها', 'Similar units') : tx('وحدات بسعر زمان', 'Units at old prices')}</h2>
          <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {suggestions.map((u) => (
              <div key={u.id} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <UnitCard unit={u} onOpen={onSelectUnit} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
