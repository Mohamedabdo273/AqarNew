import React, { useMemo, useState } from 'react';
import {
  BarChart2,
  X,
  Check,
  Building2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  monthlyInstallment,
  pick,
  savingsAmount,
} from '../lib/unitHelpers';

interface AqarExitComparisonProps {
  currentUnit: RealEstateUnit;
  allUnits: RealEstateUnit[];
  onSelectUnit: (unit: RealEstateUnit) => void;
}

const full = (n: number) => Math.round(n).toLocaleString('en-US');

export const AqarExitComparison: React.FC<AqarExitComparisonProps> = ({
  currentUnit,
  allUnits,
  onSelectUnit,
}) => {
  const { language, tx, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // 1. Find alternative units in the same compound first
  const sameCompoundUnits = useMemo(() => {
    return allUnits.filter(
      (u) => u.id !== currentUnit.id && u.compound.toLowerCase() === currentUnit.compound.toLowerCase()
    );
  }, [allUnits, currentUnit]);

  // 2. Find alternative units in the same developer or same region if needed
  const alternativeCandidates = useMemo(() => {
    if (sameCompoundUnits.length >= 3) {
      return sameCompoundUnits;
    }
    const sameDeveloper = allUnits.filter(
      (u) =>
        u.id !== currentUnit.id &&
        !sameCompoundUnits.some((sc) => sc.id === u.id) &&
        u.developer.toLowerCase() === currentUnit.developer.toLowerCase()
    );
    const sameRegion = allUnits.filter(
      (u) =>
        u.id !== currentUnit.id &&
        !sameCompoundUnits.some((sc) => sc.id === u.id) &&
        !sameDeveloper.some((sd) => sd.id === u.id) &&
        u.region === currentUnit.region
    );
    return [...sameCompoundUnits, ...sameDeveloper, ...sameRegion];
  }, [allUnits, currentUnit, sameCompoundUnits]);

  // Take top 3 alternative units to compare with current unit (total 4 units)
  const compareUnits = useMemo(() => {
    const topThree = alternativeCandidates.slice(0, 3);
    return [currentUnit, ...topThree];
  }, [currentUnit, alternativeCandidates]);

  // Stats for the banner
  const projectUnitsCount = sameCompoundUnits.length > 0 ? sameCompoundUnits.length : alternativeCandidates.length;
  const projectCashPrices = alternativeCandidates.map((u) => cashPrice(u));
  const minCash = projectCashPrices.length > 0 ? Math.min(...projectCashPrices) : cashPrice(currentUnit);
  const currCash = cashPrice(currentUnit);

  const bannerProjectName =
    sameCompoundUnits.length > 0
      ? tx('في نفس المشروع', 'in the same project')
      : tx(`في ${currentUnit.region}`, `in ${currentUnit.region}`);

  // Helpers for rows in the table
  const cur = currency(language);

  // Calculate market price (currentMarketPrice or 1.2x originalContractPrice)
  const getMarketPrice = (u: RealEstateUnit) => {
    return u.currentMarketPrice || Math.round(u.originalContractPrice * 1.22);
  };

  // Commission cash: cashPrice + 2.5% platform fee
  const getCashWithCommission = (u: RealEstateUnit) => {
    const cash = cashPrice(u);
    return Math.round(cash * 1.025);
  };

  // Price per m2 by contract
  const getPricePerM2 = (u: RealEstateUnit) => {
    return Math.round(u.originalContractPrice / (u.areaM2 || 1));
  };

  // Delivery year as number
  const getDeliveryYear = (u: RealEstateUnit) => {
    if (u.deliveryStatus === 'استلام فوري') return 2026;
    const match = u.deliveryStatus.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : 2028;
  };

  // Best of calculators
  const lowestCash = Math.min(...compareUnits.map((u) => cashPrice(u)));
  const lowestCashWithCommission = Math.min(...compareUnits.map((u) => getCashWithCommission(u)));
  const lowestRemaining = Math.min(...compareUnits.map((u) => u.remainingAmount));
  const lowestMonthly = Math.min(...compareUnits.map((u) => monthlyInstallment(u)));
  const highestSavings = Math.max(...compareUnits.map((u) => savingsAmount(u)));
  const lowestPricePerM2 = Math.min(...compareUnits.map((u) => getPricePerM2(u)));
  const highestArea = Math.max(...compareUnits.map((u) => u.areaM2));
  const highestBathrooms = Math.max(...compareUnits.map((u) => u.bathrooms));
  const nearestDelivery = Math.min(...compareUnits.map((u) => getDeliveryYear(u)));

  // Recommendation leaders
  const lowestCashUnit = compareUnits.find((u) => cashPrice(u) === lowestCash) || compareUnits[0];
  const lowestMonthlyUnit = compareUnits.find((u) => monthlyInstallment(u) === lowestMonthly) || compareUnits[0];
  const nearestDeliveryUnit = compareUnits.find((u) => getDeliveryYear(u) === nearestDelivery) || compareUnits[0];
  const highestSavingsUnit = compareUnits.find((u) => savingsAmount(u) === highestSavings) || compareUnits[0];

  const getUnitLabel = (u: RealEstateUnit, idx: number) => {
    if (u.id === currentUnit.id) return tx('الوحدة اللي بتشوفها', 'Current unit');
    return `${tx('وحدة', 'Unit')} ${idx + 1}`;
  };

  return (
    <div className="w-full">
      {/* 1. Exact Banner from Image 1 */}
      <div className="rounded-2xl border border-line bg-paper/70 hover:bg-paper p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-brand shrink-0 shadow-xs">
            <BarChart2 className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h3 className="font-bold text-ink text-sm sm:text-base">
              {tx(
                `فيه ${projectUnitsCount} وحدات تانية ${bannerProjectName}`,
                `There are ${projectUnitsCount} other units ${bannerProjectName}`
              )}
            </h3>
            <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
              {tx(
                `أقلهم كاش دلوقتي ${full(minCash)} ج.م — الوحدة دي ${full(currCash)} ج.م`,
                `Lowest cash now ${full(minCash)} EGP — this unit is ${full(currCash)} EGP`
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="font-bold text-brand hover:underline text-sm sm:text-base whitespace-nowrap px-2 py-1"
        >
          {tx('قارن الوحدات', 'Compare units')}
        </button>
      </div>

      {/* 2. Exact Comparison View from Image 2 & Image 3 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 backdrop-blur-xs p-2 sm:p-4 md:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-surface border border-line rounded-3xl shadow-2xl w-full max-w-5xl my-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top Modal Controls */}
            <div className="p-4 sm:p-6 pb-2 flex items-center justify-between border-b border-line/60">
              <span className="text-xs font-bold text-brand bg-brand-soft px-3 py-1 rounded-full">
                {pick(language, currentUnit.compound, currentUnit.compoundEn)}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid place-items-center w-9 h-9 rounded-full bg-paper hover:bg-line text-ink-soft hover:text-ink transition"
                aria-label={tx('إغلاق', 'Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-4 sm:p-8 space-y-8">
              {/* Header Title & Subtitle */}
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
                  {tx(`قارن وحدات ${pick(language, currentUnit.compound, currentUnit.compoundEn)}`, `Compare ${pick(language, currentUnit.compound, currentUnit.compoundEn)} Units`)}
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft mt-3 leading-relaxed">
                  {tx(
                    'الوحدات دي كلها في نفس المشروع. سعر كل وحدة هو سعر تعاقدها الأصلي — البايع بياخد اللي دفعه بالظبط ومفيش أوفر. اللي بيختلف بينهم هو البايع دفع قد إيه لحد دلوقتي، وفاضل عليه قد إيه.',
                    'All these units are in the same project. Each unit is priced at its original contract value with 0 overprice. The only difference is how much the seller has paid so far and the remaining balance.'
                  )}
                </p>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full border-collapse text-center text-sm min-w-[620px]">
                  <thead>
                    <tr className="border-b border-line">
                      {compareUnits.map((u, idx) => {
                        const isCurrent = u.id === currentUnit.id;
                        return (
                          <th key={u.id} className="p-3 align-top font-normal w-1/4">
                            <div className="flex flex-col items-center">
                              <div
                                onClick={() => {
                                  if (!isCurrent) {
                                    onSelectUnit(u);
                                    setIsOpen(false);
                                  }
                                }}
                                className={`w-full aspect-[4/3] rounded-2xl overflow-hidden border border-line bg-paper relative cursor-pointer group ${
                                  isCurrent ? 'ring-2 ring-brand' : 'hover:border-brand'
                                }`}
                              >
                                <img
                                  src={u.images[0]}
                                  alt=""
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {isCurrent && (
                                  <span className="absolute top-2 start-2 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                    {tx('الحالية', 'Current')}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`mt-2 font-bold text-xs sm:text-sm block ${
                                  isCurrent ? 'text-brand' : 'text-ink'
                                }`}
                              >
                                {getUnitLabel(u, idx)}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-line/60">
                    {/* Row 1: المطلوب كاش دلوقتي */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('المطلوب كاش دلوقتي', 'Cash required now')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const isBest = cashPrice(u) === lowestCash;
                        return (
                          <td key={u.id} className="py-2.5 px-2">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {full(cashPrice(u))}
                              </span>
                            ) : (
                              <span className="font-semibold text-ink text-xs sm:text-sm">
                                {full(cashPrice(u))}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 2: اللي هتدفعه دلوقتي بالعمولة */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('اللي هتدفعه دلوقتي بالعمولة', 'Cash now including commission')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const val = getCashWithCommission(u);
                        const isBest = val === lowestCashWithCommission;
                        return (
                          <td key={u.id} className="py-2.5 px-2">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {full(val)}
                              </span>
                            ) : (
                              <span className="font-semibold text-ink text-xs sm:text-sm">
                                {full(val)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 3: المتبقي للمطور */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('المتبقي للمطور', 'Remaining to developer')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const isBest = u.remainingAmount === lowestRemaining;
                        return (
                          <td key={u.id} className="py-2.5 px-2">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {full(u.remainingAmount)}
                              </span>
                            ) : (
                              <span className="font-semibold text-ink text-xs sm:text-sm">
                                {full(u.remainingAmount)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 4: القسط (مكافئ شهري) */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('القسط (مكافئ شهري)', 'Installment (monthly equivalent)')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const m = monthlyInstallment(u);
                        const isBest = m === lowestMonthly;
                        return (
                          <td key={u.id} className="py-2.5 px-2">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {full(m)}
                              </span>
                            ) : (
                              <span className="font-semibold text-ink text-xs sm:text-sm">
                                {full(m)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 5: مكسبك عن سعر السوق */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('مكسبك عن سعر السوق', 'Your savings vs market')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const s = savingsAmount(u);
                        const isBest = s === highestSavings;
                        return (
                          <td key={u.id} className="py-2.5 px-2">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {full(s)}
                              </span>
                            ) : (
                              <span className="font-semibold text-ink text-xs sm:text-sm">
                                {full(s)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 6: سعر المتر بالتعاقد */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('سعر المتر بالتعاقد', 'Contract price per m²')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const p = getPricePerM2(u);
                        const isBest = p === lowestPricePerM2;
                        return (
                          <td key={u.id} className="py-2.5 px-2">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs sm:text-sm">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {full(p)}
                              </span>
                            ) : (
                              <span className="font-semibold text-ink text-xs sm:text-sm">
                                {full(p)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 7: سعر التعاقد */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('سعر التعاقد', 'Original contract price')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => (
                        <td key={u.id} className="py-2.5 px-2 font-semibold text-ink text-xs sm:text-sm">
                          {full(u.originalContractPrice)}
                        </td>
                      ))}
                    </tr>

                    {/* Row 8: سعر السوق اليوم */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('سعر السوق اليوم', "Today's market value")}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const mp = getMarketPrice(u);
                        return (
                          <td key={u.id} className="py-2.5 px-2">
                            <span className="inline-block bg-blue-600 text-white font-bold px-3 py-1 rounded-md text-xs sm:text-sm shadow-xs">
                              {full(mp)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 9: المساحة */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('المساحة', 'Area')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const isBest = u.areaM2 === highestArea;
                        return (
                          <td key={u.id} className="py-2.5 px-2 font-semibold text-ink text-xs sm:text-sm">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {u.areaM2} {tx('م²', 'm²')}
                              </span>
                            ) : (
                              <span>{u.areaM2} {tx('م²', 'm²')}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 10: غرف */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('غرف', 'Bedrooms')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => (
                        <td key={u.id} className="py-2.5 px-2 font-semibold text-ink text-xs sm:text-sm">
                          {u.bedrooms || '—'}
                        </td>
                      ))}
                    </tr>

                    {/* Row 11: حمامات */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('حمامات', 'Bathrooms')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const isBest = u.bathrooms === highestBathrooms;
                        return (
                          <td key={u.id} className="py-2.5 px-2 font-semibold text-ink text-xs sm:text-sm">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {u.bathrooms}
                              </span>
                            ) : (
                              <span>{u.bathrooms || '—'}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 12: الدور */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('الدور', 'Floor')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => (
                        <td key={u.id} className="py-2.5 px-2 font-semibold text-ink text-xs sm:text-sm">
                          {u.floor || '3'}
                        </td>
                      ))}
                    </tr>

                    {/* Row 13: الاستلام */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('الاستلام', 'Delivery')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => {
                        const dy = getDeliveryYear(u);
                        const isBest = dy === nearestDelivery;
                        return (
                          <td key={u.id} className="py-2.5 px-2 font-semibold text-ink text-xs sm:text-sm">
                            {isBest ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {deliveryLabel(u, language)}
                              </span>
                            ) : (
                              <span>{deliveryLabel(u, language)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 14: التشطيب */}
                    <tr>
                      <td colSpan={compareUnits.length} className="pt-4 pb-1 text-xs text-muted font-bold text-center">
                        {tx('التشطيب', 'Finishing')}
                      </td>
                    </tr>
                    <tr>
                      {compareUnits.map((u) => (
                        <td key={u.id} className="py-2.5 px-2 font-semibold text-ink text-xs sm:text-sm">
                          {pick(language, u.finishing, u.finishingEn)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Small Footnote Disclaimers from Image 3 */}
              <div className="text-center text-xs text-muted space-y-1 pt-2">
                <p>
                  {tx(
                    'الأرقام الناقصة معروضة «—» والوحدة بتتشال من حساب السطر ده — نقص البيانات مش عيب في الوحدة.',
                    'Missing figures are shown as "—" and excluded from row calculations.'
                  )}
                </p>
                <p>
                  {tx(
                    'الأقساط اللي مش شهرية اتحولت لمكافئها الشهري عشان المقارنة تبقى عادلة.',
                    'Non-monthly installments are converted to their monthly equivalent for fair comparison.'
                  )}
                </p>
              </div>

              {/* Exact Recommendation Card from Image 3 */}
              <div className="rounded-2xl border border-line bg-paper/50 p-5 sm:p-6 space-y-3">
                <h4 className="font-extrabold text-base sm:text-lg text-ink text-center">
                  {tx('الأنسب لك يعتمد على أولويتك', 'What suits you depends on your priority')}
                </h4>
                <p className="text-xs sm:text-sm text-ink-soft text-center">
                  {tx(
                    'مفيش وحدة «أحسن» بشكل مطلق — يعتمد إنت ناقصك كاش دلوقتي ولا ناقصك دخل شهري.',
                    'There is no universally "best" unit — it depends on whether upfront cash or monthly outflow matters most to you.'
                  )}
                </p>

                <div className="pt-3 space-y-2.5 max-w-md mx-auto text-xs sm:text-sm font-semibold">
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface border border-line/60">
                    <span className="text-ink-soft">{tx('لو أولويتك أقل كاش دلوقتي', 'If priority is lowest cash')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectUnit(lowestCashUnit);
                        setIsOpen(false);
                      }}
                      className="text-brand font-bold hover:underline flex items-center gap-1"
                    >
                      <span>← {getUnitLabel(lowestCashUnit, compareUnits.indexOf(lowestCashUnit))}</span>
                      <span className="num text-ink">({full(cashPrice(lowestCashUnit))})</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface border border-line/60">
                    <span className="text-ink-soft">{tx('لو أولويتك أقل قسط شهري', 'If priority is lowest monthly')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectUnit(lowestMonthlyUnit);
                        setIsOpen(false);
                      }}
                      className="text-brand font-bold hover:underline flex items-center gap-1"
                    >
                      <span>← {getUnitLabel(lowestMonthlyUnit, compareUnits.indexOf(lowestMonthlyUnit))}</span>
                      <span className="num text-ink">({full(monthlyInstallment(lowestMonthlyUnit))})</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface border border-line/60">
                    <span className="text-ink-soft">{tx('لو أولويتك أقرب استلام', 'If priority is nearest delivery')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectUnit(nearestDeliveryUnit);
                        setIsOpen(false);
                      }}
                      className="text-brand font-bold hover:underline flex items-center gap-1"
                    >
                      <span>← {getUnitLabel(nearestDeliveryUnit, compareUnits.indexOf(nearestDeliveryUnit))}</span>
                      <span className="num text-ink">({deliveryLabel(nearestDeliveryUnit, language)})</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface border border-line/60">
                    <span className="text-ink-soft">{tx('لو أولويتك أكبر مكسب عن السوق', 'If priority is max market saving')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectUnit(highestSavingsUnit);
                        setIsOpen(false);
                      }}
                      className="text-brand font-bold hover:underline flex items-center gap-1"
                    >
                      <span>← {getUnitLabel(highestSavingsUnit, compareUnits.indexOf(highestSavingsUnit))}</span>
                      <span className="num text-ink">({full(savingsAmount(highestSavingsUnit))})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Project Units Counter Link from Image 3 */}
              <div className="text-center pt-2">
                <span className="text-xs sm:text-sm font-semibold text-muted">
                  {tx(
                    `و${Math.max(0, projectUnitsCount - 3)} كمان في نفس المشروع`,
                    `and ${Math.max(0, projectUnitsCount - 3)} more in the same project`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
