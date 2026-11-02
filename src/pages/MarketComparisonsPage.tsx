import React, { useState, useMemo } from 'react';
import {
  Scale,
  Sparkles,
  ArrowRight,
  Building2,
  Eye,
  Check,
  Minus,
  TrendingDown,
  Layers,
  MapPin,
  Calendar,
  Flame,
  Zap,
} from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCompare, COMPARE_MAX } from '../context/CompareContext';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  isNegotiable,
  monthlyInstallment,
  pick,
  savingsAmount,
  savingsPercent,
  sellerDiscount,
  money as formatMoney,
} from '../lib/unitHelpers';

interface MarketComparisonsPageProps {
  units: RealEstateUnit[];
  onSelectUnit: (unit: RealEstateUnit) => void;
  onNavigate: (page: PageId) => void;
}

type PresetKey = 'topDeals' | 'newCairo' | 'octoberZayed' | 'immediate' | 'villas' | 'lowCash';

const full = (n: number) => Math.round(n).toLocaleString('en-US');

export const MarketComparisonsPage: React.FC<MarketComparisonsPageProps> = ({
  units,
  onSelectUnit,
  onNavigate,
}) => {
  const { language, tx, isRTL } = useLanguage();
  const { setCompareList } = useCompare();
  const cur = currency(language);

  const [activeTab, setActiveTab] = useState<PresetKey>('topDeals');

  // Definitions for curated presets
  const presets: {
    key: PresetKey;
    icon: string;
    title: string;
    titleEn: string;
    subtitle: string;
    subtitleEn: string;
    tag: string;
    filter: (all: RealEstateUnit[]) => RealEstateUnit[];
  }[] = [
    {
      key: 'topDeals',
      icon: '🔥',
      title: 'أعلى 4 فرص توفيراً في السوق',
      titleEn: 'Top 4 Highest Savings Deals',
      subtitle: 'وحدات معروضة بأعلى فارق سعري وتوفير حقيقي مقارنة بسعر المطور الحالي',
      subtitleEn: 'Units offering the highest absolute savings compared to the current developer price list',
      tag: tx('الأعلى توفيراً', 'Max Savings'),
      filter: (all) =>
        [...all].sort((a, b) => savingsAmount(b) - savingsAmount(a)).slice(0, COMPARE_MAX),
    },
    {
      key: 'newCairo',
      icon: '📍',
      title: 'مقارنة شقق القاهرة الجديدة والتجمع',
      titleEn: 'New Cairo & 5th Settlement Apartments',
      subtitle: 'مقارنة دقيقة لأبرز الشقق في كمبوندات التجمع الخامس واللوتس والمستقبل',
      subtitleEn: 'Side-by-side comparison of prime apartments in New Cairo and surrounding compounds',
      tag: tx('القاهرة الجديدة', 'New Cairo'),
      filter: (all) => {
        const matching = all.filter((u) => u.region === 'قاهرة' || u.region === 'جيزة' || u.location.includes('التجمع') || u.location.includes('القاهرة الجديدة'));
        return matching.slice(0, COMPARE_MAX);
      },
    },
    {
      key: 'octoberZayed',
      icon: '🏢',
      title: 'مقارنة وحدات الشيخ زايد و6 أكتوبر',
      titleEn: 'Sheikh Zayed & 6th October Comparison',
      subtitle: 'مقارنة شقق وبنتهاوس في أرقى كمبوندات غرب القاهرة وسعر المتر لكل مشروع',
      subtitleEn: 'Compare west Cairo apartments & penthouses across top compounds and price per meter',
      tag: tx('غرب القاهرة', 'West Cairo'),
      filter: (all) => {
        const matching = all.filter(
          (u) =>
            u.location.includes('زايد') ||
            u.location.includes('أكتوبر') ||
            u.compound.includes('زايد') ||
            u.compound.includes('أكتوبر') ||
            u.region === 'قاهرة' || u.region === 'جيزة'
        );
        return matching.slice(0, COMPARE_MAX);
      },
    },
    {
      key: 'immediate',
      icon: '⚡',
      title: 'مقارنة وحدات الاستلام الفوري و2026',
      titleEn: 'Immediate & 2026 Delivery Comparison',
      subtitle: 'وحدات جاهزة للسكن الفوري أو الاستلام القريب جداً للاستثمار والتأجير السريع',
      subtitleEn: 'Ready to move or near-term delivery units ideal for immediate living or fast rental yields',
      tag: tx('استلام فوري', 'Ready to Move'),
      filter: (all) => {
        const matching = all.filter((u) => u.deliveryStatus === 'استلام فوري' || u.deliveryStatus === 'استلام 2026');
        return (matching.length >= 2 ? matching : all).slice(0, COMPARE_MAX);
      },
    },
    {
      key: 'lowCash',
      icon: '💰',
      title: 'مقارنة أقل كاش مطلوب (مقدم خفيف)',
      titleEn: 'Lowest Cash Downpayment Comparison',
      subtitle: 'وحدات مميزة يمكنك امتلاكها بأقل سيولة كاش واستكمال الباقي بأقساط مريحة',
      subtitleEn: 'High-value properties accessible with minimal upfront cash and manageable installment terms',
      tag: tx('أقل كاش', 'Low Cash'),
      filter: (all) =>
        [...all].sort((a, b) => cashPrice(a) - cashPrice(b)).slice(0, COMPARE_MAX),
    },
    {
      key: 'villas',
      icon: '🏡',
      title: 'مقارنة التاون هاوس والدوبلكس الفاخر',
      titleEn: 'Townhouses & Duplexes Comparison',
      subtitle: 'مقارنة المساحات الكبيرة والوحدات العائلية الفاخرة ذات الحديقة أو الرووف',
      subtitleEn: 'Spacious townhouses and duplexes with private gardens or rooftops',
      tag: tx('مساحات كبيرة', 'Spacious'),
      filter: (all) => {
        const matching = all.filter(
          (u) =>
            u.propertyType === 'تاون هاوس' ||
            u.propertyType === 'توين هاوس' ||
            u.propertyType === 'دوبلكس' ||
            u.propertyType === 'بنتهاوس' ||
            u.propertyType === 'فيلا' ||
            u.areaM2 >= 180
        );
        return (matching.length >= 2 ? matching : all).slice(0, COMPARE_MAX);
      },
    },
  ];

  const currentPreset = presets.find((p) => p.key === activeTab) || presets[0];

  const selectedUnits = useMemo(() => {
    const list = currentPreset.filter(units);
    if (list.length >= 2) return list;
    return units.slice(0, COMPARE_MAX);
  }, [currentPreset, units]);

  const money = (n: number) => (
    <>
      {full(n)} <span className="text-xs text-muted">{cur}</span>
    </>
  );

  const yesNo = (ok: boolean) =>
    ok ? (
      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
        <Check className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
        <span className="text-xs">{tx('نعم', 'Yes')}</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-muted">
        <Minus className="w-4 h-4 text-muted" />
        <span className="text-xs">{tx('لا', 'No')}</span>
      </span>
    );

  type SpecRow = {
    label: string;
    value: (u: RealEstateUnit) => React.ReactNode;
    score?: (u: RealEstateUnit) => number;
    better?: 'low' | 'high';
  };

  const rows: SpecRow[] = [
    {
      label: tx('تدفع كاش دلوقتي', 'Cash now'),
      value: (u) => (
        <span className="text-base font-extrabold text-brand">
          {money(cashPrice(u))}
        </span>
      ),
      score: cashPrice,
      better: 'low',
    },
    {
      label: tx('قسطك الشهري تقريباً', 'Monthly installment'),
      value: (u) => money(monthlyInstallment(u)),
      score: monthlyInstallment,
      better: 'low',
    },
    {
      label: tx('باقي للمطور', 'Remaining to developer'),
      value: (u) => money(u.remainingAmount),
      score: (u) => u.remainingAmount,
      better: 'low',
    },
    {
      label: tx('سعر العقد الأصلي', 'Total contract price'),
      value: (u) => money(u.originalContractPrice),
      score: (u) => u.originalContractPrice,
      better: 'low',
    },
    {
      label: tx('سعر المتر المربع', 'Price per m²'),
      value: (u) => (
        <span>
          {full(Math.round(u.originalContractPrice / (u.areaM2 || 1)))}{' '}
          <span className="text-xs text-muted">{cur}</span>
        </span>
      ),
      score: (u) => Math.round(u.originalContractPrice / (u.areaM2 || 1)),
      better: 'low',
    },
    {
      label: tx('توفيرك عن سعر المطور', 'Saving vs developer'),
      value: (u) => (
        <span className="text-emerald-700 font-bold">
          {money(savingsAmount(u))} <span className="text-xs">· {savingsPercent(u)}%</span>
        </span>
      ),
      score: savingsAmount,
      better: 'high',
    },
    {
      label: tx('المساحة', 'Area'),
      value: (u) => `${u.areaM2} ${tx('م²', 'm²')}`,
      score: (u) => u.areaM2,
      better: 'high',
    },
    {
      label: tx('الغرف · الحمامات', 'Beds · baths'),
      value: (u) => `${u.bedrooms || '—'} ${tx('غرف', 'beds')} · ${u.bathrooms || '—'} ${tx('حمام', 'baths')}`,
    },
    {
      label: tx('موعد الاستلام', 'Delivery'),
      value: (u) => <span className="font-bold">{deliveryLabel(u, language)}</span>,
    },
    {
      label: tx('مستوى التشطيب', 'Finishing'),
      value: (u) => pick(language, u.finishing, u.finishingEn),
    },
    {
      label: tx('العقد متراجع وكشف الحساب', 'Contract verified'),
      value: (u) => yesNo(Boolean(u.verifiedContract)),
    },
    {
      label: tx('من غير غرامات تأخير', 'No late penalties'),
      value: (u) => yesNo(!u.hasLatePenalties),
    },
    {
      label: tx('رسوم تنازل المطور', 'Transfer fee policy'),
      value: (u) => (
        <span className="font-semibold">
          {pick(language, u.transferFeePolicy, u.transferFeePolicyEn)}
        </span>
      ),
    },
  ];

  const bestOf = (r: SpecRow) => {
    if (!r.score || selectedUnits.length < 2) return null;
    const vals = selectedUnits.map(r.score);
    const target = r.better === 'low' ? Math.min(...vals) : Math.max(...vals);
    return vals.filter((v) => v === target).length === 1
      ? selectedUnits[vals.indexOf(target)].id
      : null;
  };

  // Import this curated comparison into personal compare page
  const handleImportToMyCompare = () => {
    setCompareList(selectedUnits.map((u) => u.id));
    onNavigate('compare');
  };

  return (
    <div className="page-wrap py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-ink">
                {tx('مقارنات السوق الجاهزة', 'Market Comparisons')}
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft mt-1">
                {tx(
                  'مقارنات تحليلية جاهزة تجمع أبرز الفرص العقارية وجهاً لوجه لمساعدتك في اتخاذ أفضل قرار استثماري.',
                  'Curated head-to-head property comparisons to help you evaluate key market opportunities.'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleImportToMyCompare}
            className="btn-primary min-h-10 text-xs sm:text-sm px-4 shadow-sm"
          >
            <Scale className="w-4 h-4" />
            <span>{tx('فتح في صفحتي للمقارنة', 'Open in My Compare')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Preset Categories Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {presets.map((p) => {
          const active = p.key === activeTab;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setActiveTab(p.key)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                active
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-paper text-ink hover:bg-brand-soft border border-line'
              }`}
            >
              <span>{p.icon}</span>
              <span>{pick(language, p.title, p.titleEn)}</span>
            </button>
          );
        })}
      </div>

      {/* Active Preset Banner */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-paper border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentPreset.icon}</span>
            <h2 className="text-base sm:text-lg font-bold text-ink">
              {pick(language, currentPreset.title, currentPreset.titleEn)}
            </h2>
            <span className="bg-brand/10 text-brand text-xs font-bold px-2.5 py-0.5 rounded-full">
              {currentPreset.tag}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            {pick(language, currentPreset.subtitle, currentPreset.subtitleEn)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleImportToMyCompare}
          className="btn-ghost min-h-9 text-xs font-bold px-3.5 shrink-0 self-start sm:self-auto"
        >
          <span>{tx('تعديل وإضافة وحدات على هذه المقارنة', 'Customize this comparison')}</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="mt-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[55rem] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky start-0 z-20 bg-paper/95 backdrop-blur w-48 sm:w-56 p-3 text-start align-bottom border-b border-line">
                <span className="text-xs font-bold text-ink-soft uppercase tracking-wider block">
                  {tx('معايير المقارنة', 'Specifications')}
                </span>
                <span className="text-[11px] text-muted block mt-0.5">
                  ({selectedUnits.length} {tx('وحدات', 'units')})
                </span>
              </th>

              {selectedUnits.map((u, idx) => (
                <th key={u.id} className="p-2.5 align-top text-start font-normal min-w-[210px] w-64 border-b border-line">
                  <div className="card overflow-hidden border border-line bg-surface hover:shadow-md transition-shadow relative">
                    <div className="absolute top-2 start-2 z-10">
                      <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="relative">
                      <img src={u.images[0]} alt="" className="w-full aspect-[16/10] object-cover" />
                    </div>

                    <div className="p-3">
                      <span className="num block text-[11px] text-muted font-bold" dir="ltr">
                        {u.verificationCode}
                      </span>
                      <h3 className="font-bold text-ink text-sm sm:text-base line-clamp-1 mt-0.5">
                        {pick(language, u.compound, u.compoundEn)}
                      </h3>
                      <p className="text-xs text-ink-soft flex items-center gap-1 mt-1 truncate">
                        <Building2 className="w-3.5 h-3.5 text-muted shrink-0" />
                        <span>{pick(language, u.developer, u.developerEn)}</span>
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-line/60">
                        <button
                          type="button"
                          onClick={() => onSelectUnit(u)}
                          className="btn-ghost min-h-8 text-xs px-2.5 w-full justify-center font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{tx('عرض تفاصيل الوحدة', 'View Unit')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, rowIndex) => {
              const best = bestOf(r);
              return (
                <tr key={r.label} className={rowIndex % 2 === 0 ? 'bg-surface' : 'bg-paper/40'}>
                  <th
                    scope="row"
                    className="sticky start-0 z-10 bg-inherit p-3.5 text-start font-semibold text-ink-soft border-t border-line text-xs sm:text-sm"
                  >
                    {r.label}
                  </th>

                  {selectedUnits.map((u) => {
                    const isBest = best === u.id;
                    return (
                      <td
                        key={u.id}
                        className={`num p-3.5 border-t border-line text-sm font-semibold transition-colors ${
                          isBest
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold border-emerald-500/20'
                            : 'text-ink'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div>{r.value(u)}</div>
                          {isBest && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                              <Check className="w-3 h-3 text-emerald-600" />
                              {tx('الأفضل', 'Best')}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer prompt */}
      <div className="mt-10 text-center">
        <p className="text-sm text-ink-soft mb-3">
          {tx('تريد مقارنة وحدات محددة من اختيارك الخاص؟', 'Want to compare your own custom selection of units?')}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('opportunities')}
          className="btn-primary min-h-11 px-5 shadow-sm"
        >
          <Scale className="w-4 h-4" />
          <span>{tx('تصفح الوحدات واختر بنفسك', 'Browse and pick units to compare')}</span>
        </button>
      </div>
    </div>
  );
};
