import React from 'react';
import { X, Search, Check, Minus } from 'lucide-react';
import { IlloEmpty } from '../components/Illustrations';
import { PageId, RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCompare } from '../context/CompareContext';
import { cashPrice, currency, deliveryLabel, isDeal, isNegotiable, monthlyInstallment, pick, savingsAmount, savingsPercent, sellerDiscount } from '../lib/unitHelpers';

interface ComparePageProps {
  units: RealEstateUnit[];
  onSelectUnit: (unit: RealEstateUnit) => void;
  onNavigate: (page: PageId) => void;
}

const full = (n: number) => Math.round(n).toLocaleString('en-US');

type Row = {
  label: string;
  value: (u: RealEstateUnit) => React.ReactNode;
  /** Numeric value used to highlight the best unit in the row. */
  score?: (u: RealEstateUnit) => number;
  better?: 'low' | 'high';
};

export const ComparePage: React.FC<ComparePageProps> = ({ units, onSelectUnit, onNavigate }) => {
  const { language, tx } = useLanguage();
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const cur = currency(language);
  const list = compareIds.map((id) => units.find((u) => u.id === id)).filter((u): u is RealEstateUnit => !!u);

  const money = (n: number) => (
    <>
      {full(n)} <span className="text-xs text-muted">{cur}</span>
    </>
  );
  const yesNo = (ok: boolean) =>
    ok ? <Check className="w-5 h-5 text-brand" strokeWidth={2.5} aria-label={tx('أيوه', 'Yes')} /> : <Minus className="w-5 h-5 text-muted" aria-label={tx('لأ', 'No')} />;

  const rows: Row[] = [
    { label: tx('قسطك الشهري تقريباً', 'Monthly, roughly'), value: (u) => money(monthlyInstallment(u)), score: monthlyInstallment, better: 'low' },
    { label: tx('تدفع كاش دلوقتي', 'Cash now'), value: (u) => money(cashPrice(u)), score: cashPrice, better: 'low' },
    { label: tx('باقي للمطور', 'Left to developer'), value: (u) => money(u.remainingAmount), score: (u) => u.remainingAmount, better: 'low' },
    {
      label: tx('توفيرك عن سعر المطور', 'Saving vs developer'),
      value: (u) => (
        <>
          {money(savingsAmount(u))} <span className="text-xs text-muted">· {savingsPercent(u)}%</span>
        </>
      ),
      score: savingsAmount,
      better: 'high',
    },
    { label: tx('خصم من صاحبها', 'Owner discount'), value: (u) => (isDeal(u) ? money(sellerDiscount(u)) : <Minus className="w-5 h-5 text-muted" />) },
    { label: tx('قابل للتفاوض', 'Negotiable'), value: (u) => yesNo(isNegotiable(u)) },
    { label: tx('المساحة', 'Area'), value: (u) => `${u.areaM2} ${tx('م²', 'm²')}`, score: (u) => u.areaM2, better: 'high' },
    { label: tx('الغرف · الحمامات', 'Beds · baths'), value: (u) => `${u.bedrooms || '—'} · ${u.bathrooms || '—'}` },
    { label: tx('الاستلام', 'Delivery'), value: (u) => deliveryLabel(u, language) },
    { label: tx('التشطيب', 'Finishing'), value: (u) => pick(language, u.finishing, u.finishingEn) },
    { label: tx('العقد متراجع', 'Contract verified'), value: (u) => yesNo(!!u.verifiedContract) },
    { label: tx('من غير غرامات تأخير', 'No late penalties'), value: (u) => yesNo(!u.hasLatePenalties) },
  ];

  const bestOf = (r: Row) => {
    if (!r.score || list.length < 2) return null;
    const vals = list.map(r.score);
    const target = r.better === 'low' ? Math.min(...vals) : Math.max(...vals);
    return vals.filter((v) => v === target).length === 1 ? list[vals.indexOf(target)].id : null;
  };

  if (list.length === 0) {
    return (
      <div className="page-wrap py-16 max-w-xl text-center">
        <IlloEmpty className="mx-auto w-20 h-20 text-brand" />
        <h1 className="mt-5 text-3xl font-bold text-ink">{tx('قارن بين الوحدات', 'Compare units')}</h1>
        <p className="mt-2 text-muted">{tx(`اضغط "قارن" على أي كارت وحدة (لحد 3) وشوفهم هنا جنب بعض.`, 'Tap "Compare" on any unit card (up to 3) to see them side by side.')}</p>
        <button onClick={() => onNavigate('opportunities')} className="btn-primary mt-6">
          <Search className="w-5 h-5" />
          {tx('تصفّح الوحدات', 'Browse units')}
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrap py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink">{tx('قارن بين الوحدات', 'Compare units')}</h1>
          <p className="mt-2 text-muted">{tx('الأحسن في كل صف متعلّم بالأخضر.', 'The best in each row is highlighted.')}</p>
        </div>
        <button onClick={clearCompare} className="text-sm font-semibold text-muted hover:text-ink min-h-11">
          {tx('امسح المقارنة', 'Clear comparison')}
        </button>
      </div>

      {/* Scrolls sideways on phones; the label column stays put. */}
      <div className="mt-8 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky start-0 z-10 bg-paper w-40" />
              {list.map((u) => (
                <th key={u.id} className="p-2 align-top text-start font-normal">
                  <div className="card overflow-hidden">
                    <div className="relative">
                      <img src={u.images[0]} alt="" className="w-full aspect-[16/10] object-cover" />
                      <button
                        onClick={() => toggleCompare(u.id)}
                        aria-label={tx('شيلها من المقارنة', 'Remove from comparison')}
                        className="absolute top-2 end-2 grid place-items-center w-9 h-9 rounded-full bg-surface/95 hover:bg-surface"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => onSelectUnit(u)} className="block w-full p-3 text-start hover:bg-paper">
                      <span className="block font-bold text-ink line-clamp-2">{pick(language, u.compound, u.compoundEn)}</span>
                      <span className="num block text-xs text-muted mt-0.5" dir="ltr">
                        {u.verificationCode}
                      </span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const best = bestOf(r);
              return (
                <tr key={r.label}>
                  <th scope="row" className="sticky start-0 z-10 bg-paper p-3 text-start font-medium text-muted border-t border-line">
                    {r.label}
                  </th>
                  {list.map((u) => (
                    <td key={u.id} className={`num p-3 border-t border-line font-semibold text-ink ${best === u.id ? 'bg-brand-soft' : ''}`}>
                      {r.value(u)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
