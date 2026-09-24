import React, { useMemo, useState } from 'react';
import { Repeat, ArrowDownUp, MessageCircle } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';
import { whatsappLink } from '../config/brand';
import { PROPERTY_TYPES, REGIONS, currency, money } from '../lib/unitHelpers';

interface PropertySwapPageProps {
  units: RealEstateUnit[];
  onSelectUnit: (unit: RealEstateUnit) => void;
}

export const PropertySwapPage: React.FC<PropertySwapPageProps> = ({ units, onSelectUnit }) => {
  const { language, tx, isRTL } = useLanguage();
  const [myPaid, setMyPaid] = useState(1_500_000);
  const [wantRegion, setWantRegion] = useState('');
  const [wantType, setWantType] = useState('');
  const pct = ((myPaid - 200_000) / (5_000_000 - 200_000)) * 100;

  const matches = useMemo(
    () =>
      units
        .filter((u) => u.eligibleForSwap !== false)
        .filter((u) => !wantRegion || u.region === wantRegion)
        .filter((u) => !wantType || u.propertyType === wantType)
        .sort((a, b) => Math.abs(a.paidCashAmount - myPaid) - Math.abs(b.paidCashAmount - myPaid)),
    [units, wantRegion, wantType, myPaid]
  );

  return (
    <div className="page-wrap py-8 sm:py-12">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-gold-soft text-gold px-3.5 py-1.5 text-sm font-semibold">
          <Repeat className="w-4 h-4" />
          {tx('حصري عندنا', 'Only here')}
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('بدّل وحدتك بوحدة تانية', 'Swap your unit for another')}</h1>
        <p className="mt-2 text-muted">{tx('من غير ما تبيع الأول. تدفع أو تاخد الفرق بس.', 'No need to sell first. Just settle the difference.')}</p>
      </div>

      <div className="mt-8 card p-6 sm:p-8 grid lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-start">
        <div>
          <p className="font-bold text-ink">{tx('وحدتك', 'Your unit')}</p>
          <div className="mt-5 flex items-center justify-between mb-3">
            <span className="text-sm text-ink-soft">{tx('دفعت فيها كام؟', 'Paid so far')}</span>
            <span className="num text-xl font-bold text-ink">
              {money(myPaid, language)} <span className="text-xs text-muted font-medium">{currency(language)}</span>
            </span>
          </div>
          <input
            type="range"
            min={200_000}
            max={5_000_000}
            step={50_000}
            value={myPaid}
            onChange={(e) => setMyPaid(Number(e.target.value))}
            aria-label={tx('المدفوع', 'Paid')}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to ${isRTL ? 'left' : 'right'}, var(--color-brand) ${pct}%, var(--color-line) ${pct}%)` }}
          />
        </div>

        <span className="hidden lg:grid self-center place-items-center w-12 h-12 rounded-full bg-brand-soft text-brand">
          <ArrowDownUp className="w-5 h-5 rotate-90" />
        </span>

        <div className="space-y-5">
          <p className="font-bold text-ink">{tx('عاوز إيه بدالها؟', 'What do you want instead?')}</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setWantRegion('')} className={wantRegion === '' ? 'chip-on' : 'chip-off'}>{tx('أي منطقة', 'Any area')}</button>
            {REGIONS.map((r) => (
              <button key={r.ar} onClick={() => setWantRegion(r.ar)} className={wantRegion === r.ar ? 'chip-on' : 'chip-off'}>
                {language === 'ar' ? r.ar : r.en}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setWantType('')} className={wantType === '' ? 'chip-on' : 'chip-off'}>{tx('أي نوع', 'Any type')}</button>
            {PROPERTY_TYPES.map((p) => (
              <button key={p.ar} onClick={() => setWantType(p.ar)} className={wantType === p.ar ? 'chip-on' : 'chip-off'}>
                {language === 'ar' ? p.ar : p.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <p className="text-ink-soft">
          <span className="num font-bold text-ink">{matches.length}</span> {tx('وحدة ممكن تبدّل بيها', 'swap matches')}
        </p>
      </div>

      {matches.length > 0 ? (
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((u) => {
            const diff = u.paidCashAmount - myPaid;
            return (
              <UnitCard
                key={u.id}
                unit={u}
                onOpen={onSelectUnit}
                tag={{
                  strong: diff <= 0,
                  label:
                    diff > 0
                      ? tx(`تدفع فرق ${money(diff, language)}`, `You pay ${money(diff, language)}`)
                      : diff < 0
                        ? tx(`تاخد فرق ${money(-diff, language)}`, `You get ${money(-diff, language)}`)
                        : tx('من غير فرق', 'Even swap'),
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-5 card p-10 text-center">
          <p className="font-bold text-lg text-ink">{tx('مفيش مطابقة دلوقتي', 'No match right now')}</p>
          <p className="mt-1 text-muted">{tx('ابعتلنا وهندوّرلك وننبهك أول ما تنزل وحدة', "Message us and we'll alert you when one appears")}</p>
          <a
            href={whatsappLink(tx('عاوز أبدّل وحدتي', 'I want to swap my unit'))}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            <MessageCircle className="w-5 h-5" />
            {tx('كلمنا واتساب', 'WhatsApp us')}
          </a>
        </div>
      )}
    </div>
  );
};
