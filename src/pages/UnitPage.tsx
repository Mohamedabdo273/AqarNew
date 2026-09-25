import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Heart,
  Maximize2,
  BedDouble,
  Bath,
  KeyRound,
  Paintbrush,
  CheckCircle2,
  MessageCircle,
  CalendarCheck,
  Building2,
  ScrollText,
  Share2,
  Ban,
  Percent,
  Eye,
  Images,
  Flame,
  ArrowDown,
} from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { BRAND, whatsappLink } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { UnitCard } from '../components/UnitCard';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  isNegotiable,
  sellerDiscount,
  fullMoney,
  money,
  monthlyInstallment,
  pick,
  savingsAmount,
  savingsPercent,
} from '../lib/unitHelpers';

interface UnitPageProps {
  unit: RealEstateUnit;
  units: RealEstateUnit[];
  onBack: () => void;
  onSelectUnit: (unit: RealEstateUnit) => void;
  onOpenBuyerRules: () => void;
  onNavigate: (page: PageId) => void;
  /** Called after a viewing request is sent. */
  onBooked: (unit: RealEstateUnit) => void;
}

/** Units to suggest next to this one: same area first, then the closest cash amount. */
export const similarUnits = (unit: RealEstateUnit, units: RealEstateUnit[], n = 3) =>
  units
    .filter((u) => u.id !== unit.id)
    .sort(
      (a, b) =>
        Number(b.region === unit.region) - Number(a.region === unit.region) ||
        Math.abs(cashPrice(a) - cashPrice(unit)) - Math.abs(cashPrice(b) - cashPrice(unit)),
    )
    .slice(0, n);

export const UnitPage: React.FC<UnitPageProps> = ({ unit, units, onBack, onSelectUnit, onOpenBuyerRules, onNavigate, onBooked }) => {
  const { language, tx, isRTL } = useLanguage();
  const { isUnitSaved, toggleSaveUnit, submitInquiry } = useUnits();
  const [imgIdx, setImgIdx] = useState(0);
  const [booking, setBooking] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const Back = isRTL ? ArrowRight : ArrowLeft;

  const compound = pick(language, unit.compound, unit.compoundEn);

  useEffect(() => {
    setImgIdx(0);
    setBooking(false);
    const prev = document.title;
    document.title = `${compound} | ${language === 'ar' ? BRAND.nameAr : BRAND.nameEn}`;
    return () => {
      document.title = prev;
    };
  }, [unit.id, compound, language]);

  const similar = useMemo(() => similarUnits(unit, units), [unit, units]);

  const saved = isUnitSaved(unit.id);
  const oldPct = Math.round((unit.originalContractPrice / unit.currentMarketPrice) * 100);
  const phoneValid = /^01\d{9}$/.test(phone.replace(/\s/g, ''));

  const keyNumbers = [
    { l: tx('باقي للمطور', 'Left to developer'), v: money(unit.remainingAmount, language) },
    { l: tx('سعر العقد', 'Contract price'), v: money(unit.originalContractPrice, language) },
    { l: tx('الاستلام', 'Delivery'), v: deliveryLabel(unit, language), noCurrency: true },
    { l: tx('المساحة', 'Area'), v: `${unit.areaM2} ${tx('م²', 'm²')}`, noCurrency: true },
  ];

  const specs = [
    { icon: Maximize2, v: `${unit.areaM2} ${tx('م²', 'm²')}` },
    unit.bedrooms > 0 && { icon: BedDouble, v: tx(`${unit.bedrooms} غرف`, `${unit.bedrooms} beds`) },
    unit.bathrooms > 0 && { icon: Bath, v: tx(`${unit.bathrooms} حمام`, `${unit.bathrooms} baths`) },
    { icon: Paintbrush, v: pick(language, unit.finishing, unit.finishingEn) },
    { icon: KeyRound, v: pick(language, unit.deliveryStatus, unit.deliveryStatusEn) },
  ].filter(Boolean) as { icon: React.ElementType; v: string }[];

  const checks = [
    { ok: unit.verifiedContract, l: tx('العقد أصلي ومراجَع', 'Contract verified') },
    { ok: unit.developerAccountStatementVerified ?? unit.verifiedContract, l: tx('المدفوعات متطابقة مع المطور', 'Payments match developer') },
    { ok: !unit.hasLatePenalties, l: tx('مفيش غرامات تأخير', 'No late penalties') },
    { ok: unit.overpriceAmount === 0, l: tx('بدون أوفر برايس', 'Zero overprice') },
  ];

  const FEE_EN: Record<string, string> = { 'على البائع': 'Seller', 'على المشتري': 'Buyer', 'مناصفة': '50/50', 'معفي من رسوم التنازل': 'Exempt' };
  const TAX: Record<string, [string, string]> = {
    residential_exempt: ['سكني معفي', 'Residential, exempt'],
    commercial_vat: ['تجاري (قيمة مضافة)', 'Commercial (VAT)'],
    business_tax: ['مملوكة لشركة', 'Company-owned'],
  };
  const terms: { k: string; v: string; tone?: 'good' | 'bad' }[] = [
    unit.hasLatePenalties || (unit.overdueFinesAmount ?? 0) > 0
      ? {
          k: tx('متأخرات وغرامات', 'Overdue & fines'),
          v:
            fullMoney(unit.overdueFinesAmount ?? 0, language) +
            (unit.hasOverdueFinesDeducted ? tx(' (بتتخصم من البائع)', ' (deducted from seller)') : ''),
          tone: 'bad',
        }
      : { k: tx('متأخرات وغرامات', 'Overdue & fines'), v: tx('مفيش', 'None'), tone: 'good' },
    {
      k: tx('رسوم التنازل', 'Transfer fee'),
      v:
        (language === 'ar' ? unit.transferFeePolicy : FEE_EN[unit.transferFeePolicy] ?? unit.transferFeePolicy) +
        (unit.transferFeePercent ? ` · ${unit.transferFeePercent}%` : ''),
      tone: unit.transferFeePolicy === 'معفي من رسوم التنازل' ? 'good' : undefined,
    },
    {
      k: tx('وديعة الصيانة', 'Maintenance deposit'),
      v: unit.hasMaintenanceDepositPaid ? tx('مدفوعة', 'Paid') : tx('لسه', 'Not yet paid'),
      tone: unit.hasMaintenanceDepositPaid ? 'good' : undefined,
    },
    ...(unit.taxCategory ? [{ k: tx('الضريبة', 'Tax'), v: tx(TAX[unit.taxCategory][0], TAX[unit.taxCategory][1]) }] : []),
    ...(unit.sellerWillingDiscountAmount
      ? [{ k: tx('خصم من البائع', 'Seller discount'), v: fullMoney(unit.sellerWillingDiscountAmount, language), tone: 'good' as const }]
      : []),
    ...(unit.eligibleForSwap
      ? [{ k: tx('يقبل مبادلة', 'Open to swap'), v: pick(language, unit.swapTargetType || tx('أيوه', 'Yes'), unit.swapTargetTypeEn) }]
      : []),
  ];

  const shareUrl = `${window.location.origin}${window.location.pathname}#unit/${unit.id}`;
  const shareText = tx(
    `${unit.compound} — تدفع ${money(cashPrice(unit), language)} والقسط ${money(monthlyInstallment(unit), language)} في الشهر`,
    `${unit.compoundEn || unit.compound} — ${money(cashPrice(unit), language)} cash, ${money(monthlyInstallment(unit), language)}/month`,
  );
  // Native share sheet on phones (WhatsApp is usually first); copy link elsewhere.
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, text: shareText, url: shareUrl });
        return;
      } catch {
        /* dismissed — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, '_blank', 'noreferrer');
    }
  };

  const waText = tx(
    `مهتم بالوحدة ${unit.compound} (${unit.verificationCode})`,
    `Interested in ${unit.compoundEn || unit.compound} (${unit.verificationCode})`,
  );

  const book = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneValid) return;
    submitInquiry({ unitId: unit.id, clientName: name.trim(), clientPhone: phone, inquiryType: 'viewing' });
    onBooked(unit);
  };

  const side = unit.images.slice(1, 3);

  return (
    <div className="page-wrap py-6 sm:py-10">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-ink min-h-11">
        <Back className="w-4 h-4" />
        {tx('رجوع للوحدات', 'Back to units')}
      </button>

      {/* Gallery: one large photo and two smaller ones on desktop; one photo and a thumbnail strip on phones */}
      <div className="mt-3 grid lg:grid-cols-[2fr_1fr] gap-2 sm:gap-3">
        <div className="relative rounded-card overflow-hidden bg-line">
          <img src={unit.images[imgIdx]} alt={compound} className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[460px] object-cover" />
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-brand/80 text-white px-3 py-1 text-xs font-semibold">
            <Images className="w-3.5 h-3.5" />
            {imgIdx + 1} / {unit.images.length}
          </span>
        </div>
        {side.length > 0 && (
          <div className="hidden lg:grid grid-rows-2 gap-3 h-[460px]">
            {side.map((src, i) => (
              <button key={src} onClick={() => setImgIdx(i + 1)} className="rounded-card overflow-hidden bg-line">
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
              </button>
            ))}
          </div>
        )}
      </div>
      {unit.images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {unit.images.map((src, i) => (
            <button
              key={src}
              onClick={() => setImgIdx(i)}
              aria-label={`${i + 1}`}
              className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition ${i === imgIdx ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Title + quick actions */}
      <div className="mt-6 sm:mt-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Building2 className="w-4 h-4" />
            {pick(language, unit.developer, unit.developerEn)}
            <span className="num ms-2 text-xs" dir="ltr">
              {unit.verificationCode}
            </span>
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-ink">{compound}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-ink-soft">
            <MapPin className="w-4 h-4 text-muted" />
            {pick(language, unit.location, unit.locationEn)}
          </p>
        </div>
        <div className="relative flex gap-2">
          <button onClick={share} className="btn-ghost min-h-11 px-4 text-sm">
            <Share2 className="w-4 h-4" />
            {tx('شارك', 'Share')}
          </button>
          <button onClick={() => toggleSaveUnit(unit.id)} aria-pressed={saved} className="btn-ghost min-h-11 px-4 text-sm">
            <Heart className={`w-4 h-4 ${saved ? 'fill-danger text-danger' : ''}`} />
            {saved ? tx('محفوظة', 'Saved') : tx('احفظ', 'Save')}
          </button>
          {copied && (
            <span className="absolute top-full mt-2 end-0 whitespace-nowrap rounded-full bg-brand text-white text-sm px-3 py-1.5 shadow-lift">
              {tx('اتنسخ اللينك', 'Link copied')}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-10 items-start">
        {/* Price + booking — first on phones, sticky side column on desktop */}
        <aside className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24 space-y-3">
          <div className="rounded-card bg-brand text-white p-6 shadow-lift">
            {isDeal(unit) && (
              <div className="-mt-6 -mx-6 mb-5 rounded-t-card bg-accent px-6 py-3 flex items-center gap-2 text-sm font-bold">
                <Flame className="w-4 h-4 shrink-0" />
                {tx(
                  `أقل من المدفوع: صاحبها عامل خصم ${money(sellerDiscount(unit), language)} عشان يبيع أسرع`,
                  `Below what was paid: the owner took ${money(sellerDiscount(unit), language)} off to sell faster`,
                )}
              </div>
            )}
            <p className="text-sm text-white/60">{tx('تدفع كاش', 'Cash now')}</p>
            <p className="num font-display mt-1 text-4xl font-bold">
              {money(cashPrice(unit), language)} <span className="text-base font-medium text-white/60">{currency(language)}</span>
            </p>
            {isDeal(unit) && (
              <p className="num mt-1 text-sm text-white/50">
                {tx('بدل', 'instead of')} <span className="line-through">{money(unit.paidCashAmount, language)}</span> {tx('— اللي صاحبها دفعه', '— what the owner paid')}
              </p>
            )}
            {isNegotiable(unit) && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                <ArrowDown className="w-4 h-4" />
                {tx('السعر قابل للتفاوض — اعرض سعرك في المعاينة', 'Negotiable — make your offer at the viewing')}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-baseline justify-between gap-3">
              <span className="text-white/60">{tx('وقسط شهري تقريباً', 'Then about')}</span>
              <span className="num font-display text-xl font-bold">
                {money(monthlyInstallment(unit), language)} <span className="text-xs font-medium text-white/60">{currency(language)}</span>
              </span>
            </div>

            {!booking ? (
              <div className="mt-6 grid gap-2">
                <button onClick={() => setBooking(true)} className="btn bg-white text-ink hover:bg-brand-soft min-h-13 w-full">
                  <CalendarCheck className="w-5 h-5" />
                  {tx('احجز معاينة ببلاش', 'Book a free viewing')}
                </button>
                <a href={whatsappLink(waText)} target="_blank" rel="noreferrer" className="btn border border-white/20 text-white hover:bg-white/10 min-h-12 w-full">
                  <MessageCircle className="w-5 h-5" />
                  {tx('اسأل على واتساب', 'Ask on WhatsApp')}
                </a>
              </div>
            ) : (
              <form onSubmit={book} className="mt-6 grid gap-2">
                <label className="sr-only" htmlFor="bk-name">
                  {tx('اسمك', 'Your name')}
                </label>
                <input
                  id="bk-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tx('اسمك', 'Your name')}
                  className="field bg-white/10 border-white/15 text-white placeholder:text-white/50 focus:border-white"
                  autoFocus
                />
                <label className="sr-only" htmlFor="bk-phone">
                  {tx('رقم الموبايل', 'Mobile number')}
                </label>
                <input
                  id="bk-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={tx('رقم الموبايل', 'Mobile number')}
                  inputMode="tel"
                  dir="ltr"
                  className={`field bg-white/10 border-white/15 text-white placeholder:text-white/50 focus:border-white ${language === 'ar' ? 'text-right' : 'text-left'}`}
                />
                <button type="submit" disabled={!name.trim() || !phoneValid} className="btn bg-white text-ink hover:bg-brand-soft min-h-13 w-full">
                  {tx('أكّد المعاينة', 'Confirm viewing')}
                </button>
                <p className="text-center text-xs text-white/50">
                  {tx('بالتأكيد إنت موافق على ', 'By confirming you agree to the ')}
                  <button type="button" onClick={() => onNavigate('terms')} className="underline hover:text-white">
                    {tx('الشروط', 'Terms')}
                  </button>
                  {tx(' و', ' and ')}
                  <button type="button" onClick={() => onNavigate('privacy')} className="underline hover:text-white">
                    {tx('الخصوصية', 'Privacy')}
                  </button>
                </p>
              </form>
            )}
          </div>

          <ul className="card p-4 grid gap-2.5 text-sm">
            {[
              { icon: Ban, t: tx('ما تدفعش عربون لأي حد', 'Never pay anyone a deposit') },
              { icon: Percent, t: tx(`عمولتنا ${BRAND.buyerFeePercent}% بعد توقيع التنازل بس`, `Our ${BRAND.buyerFeePercent}% fee only after signing`) },
              { icon: Eye, t: tx('المعاينة ببلاش، وبنرتبها معاك', 'Free viewing, arranged with you') },
            ].map((r) => (
              <li key={r.t} className="flex items-center gap-2.5 text-ink-soft">
                <r.icon className="w-4 h-4 text-ink shrink-0" />
                {r.t}
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate('sell')} className="w-full text-center text-sm font-semibold text-ink underline min-h-11">
            {tx('عندك وحدة ومش قادر تكمّل أقساطها؟', "Own a unit and can't keep up?")}
          </button>
        </aside>

        <div className="lg:col-start-1 lg:row-start-1 space-y-5 sm:space-y-6 min-w-0">
          {/* Savings — the reason to buy here */}
          <div className="card p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-xl font-bold text-ink">{tx('هتوفّر قد إيه؟', 'How much you save')}</p>
              <span className="rounded-full bg-accent-soft text-accent px-3 py-1 text-sm font-bold">
                {money(savingsAmount(unit), language)} {currency(language)} · {savingsPercent(unit)}%
              </span>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-ink-soft">{tx('سعر العقد (اللي هتدفعه)', 'Contract price (you pay)')}</span>
                  <span className="num font-bold text-ink">{fullMoney(unit.originalContractPrice, language)}</span>
                </div>
                <div className="h-3 rounded-full bg-line overflow-hidden">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${oldPct}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-ink-soft">{tx('سعر المطور النهارده', "Developer's price today")}</span>
                  <span className="num font-bold text-muted">{fullMoney(unit.currentMarketPrice, language)}</span>
                </div>
                <div className="h-3 rounded-full bg-line-strong" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted">
              {isDeal(unit)
                ? tx(`التوفير شامل خصم صاحب الوحدة (${money(sellerDiscount(unit), language)}). `, `Includes the owner's ${money(sellerDiscount(unit), language)} discount. `)
                : ''}
              {tx(`وبعد خصم عمولتنا ${BRAND.buyerFeePercent}%. `, `Net of our ${BRAND.buyerFeePercent}% fee. `)}
              {tx('سعر المطور النهارده تقديري وقت نشر الإعلان.', "Today's developer price is an estimate from when the listing went up.")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {keyNumbers.map((k) => (
              <div key={k.l} className="card p-4">
                <p className="text-xs text-muted">{k.l}</p>
                <p className="num mt-1 text-lg sm:text-xl font-bold text-ink">
                  {k.v}
                  {!k.noCurrency && <span className="text-xs font-medium text-muted"> {currency(language)}</span>}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {specs.map((s) => (
              <span key={s.v} className="chip-off pointer-events-none">
                <s.icon className="w-4 h-4 text-muted" />
                {s.v}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <p className="font-bold text-ink mb-4">{tx('راجعنالك', "We've checked")}</p>
              <ul className="space-y-3">
                {checks.map((c) => (
                  <li key={c.l} className={`flex items-center gap-2.5 ${c.ok ? 'text-ink' : 'text-muted line-through'}`}>
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${c.ok ? 'text-ink' : 'text-line-strong'}`} />
                    {c.l}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <p className="font-bold text-ink mb-4">{tx('خطة السداد', 'Payment plan')}</p>
              <dl className="space-y-3 text-[15px]">
                {[
                  [tx('القسط', 'Installment'), fullMoney(unit.installmentValue, language)],
                  [
                    tx('كل', 'Every'),
                    pick(language, unit.installmentFrequency, { 'شهري': 'month', 'ربع سنوي': '3 months', 'نصف سنوي': '6 months', 'سنوي': 'year' }[unit.installmentFrequency]),
                  ],
                  [tx('لمدة', 'For'), tx(`${unit.installmentPeriodYears} سنين`, `${unit.installmentPeriodYears} years`)],
                  [tx('القسط الجاي', 'Next due'), unit.nextInstallmentDate],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted">{k}</dt>
                    <dd className="num font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Dues & terms — what the buyer takes on beyond the cash */}
          <div className="card p-5">
            <p className="font-bold text-ink mb-4">{tx('المديونية والشروط', 'Dues & terms')}</p>
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-[15px]">
              {terms.map((r) => (
                <div key={r.k} className="flex justify-between gap-3">
                  <dt className="text-muted">{r.k}</dt>
                  <dd className={`num font-semibold text-end ${r.tone === 'bad' ? 'text-danger' : 'text-ink'}`}>{r.v}</dd>
                </div>
              ))}
            </dl>
            <button onClick={onOpenBuyerRules} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:underline">
              <ScrollText className="w-4 h-4" />
              {tx('قبل ما تدفع أي حاجة، اقرا قواعد المشتري', 'Before paying anything, read the buyer rules')}
            </button>
            {unit.acceptsInstallmentsForCash && unit.cashInstallmentsTerms && (
              <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm text-ink-soft">
                <span className="font-semibold text-ink">{tx('الكاش على دفعتين: ', 'Cash in two payments: ')}</span>
                {unit.cashInstallmentsTerms}
              </p>
            )}
          </div>

          <div>
            <p className="font-bold text-ink mb-2">{tx('عن الوحدة', 'About the unit')}</p>
            <p className="text-ink-soft leading-relaxed">{pick(language, unit.description, unit.descriptionEn)}</p>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-14 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">{tx('وحدات شبهها', 'Similar units')}</h2>
          <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {similar.map((u) => (
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
