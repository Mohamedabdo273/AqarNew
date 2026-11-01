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
  BadgeCheck,
  Undo2,
  Copy,
  Check,
  Hash,
} from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { BRAND, whatsappLink } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useUnits } from '../context/UnitsContext';
import { errorText } from '../services/api';
import { FormError } from '../components/FormError';
import { UnitCard } from '../components/UnitCard';
import { SourceTag } from '../components/SourceTag';
import { AqarExitComparison } from '../components/AqarExitComparison';
import {
  cashPrice,
  currency,
  deliveryLabel,
  isDeal,
  sellerDiscount,
  fullMoney,
  money,
  monthlyInstallment,
  installmentsLeft,
  monthsLeft,
  durationLabel,
  pick,
  placeLabel,
  savingsAmount,
  savingsPercent,
  transferFeeText,
  VIEW_OPTIONS,
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

/** Units to suggest next to this one: same district, then location, then region, then the closest cash amount. */
export const similarUnits = (unit: RealEstateUnit, units: RealEstateUnit[], n = 3) =>
  units
    .filter((u) => u.id !== unit.id)
    .sort(
      (a, b) =>
        Number(!!unit.districtId && b.districtId === unit.districtId) - Number(!!unit.districtId && a.districtId === unit.districtId) ||
        Number(!!unit.subAreaId && b.subAreaId === unit.subAreaId) - Number(!!unit.subAreaId && a.subAreaId === unit.subAreaId) ||
        Number(b.region === unit.region) - Number(a.region === unit.region) ||
        Math.abs(cashPrice(a) - cashPrice(unit)) - Math.abs(cashPrice(b) - cashPrice(unit)),
    )
    .slice(0, n);

export const UnitPage: React.FC<UnitPageProps> = ({ unit, units, onBack, onSelectUnit, onOpenBuyerRules, onNavigate, onBooked }) => {
  const { language, tx, isRTL } = useLanguage();
  const { isUnitSaved, toggleSaveUnit, submitInquiry } = useUnits();
  const { user, requireAuth } = useAuth();
  const [imgIdx, setImgIdx] = useState(0);
  const [booking, setBooking] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [name, setName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [bookTried, setBookTried] = useState(false);
  // Signed in from the "book a viewing" button: fill in what the account already knows.
  useEffect(() => {
    if (!user) return;
    setName((n) => n || user.fullName);
    setPhone((p) => p || user.phone);
  }, [user]);
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

  // The money a buyer weighs, in one row.
  const left = installmentsLeft(unit);
  const keyNumbers = [
    { l: tx('سعر العقد', 'Contract price'), v: fullMoney(unit.originalContractPrice, language) },
    { l: tx('صاحبها دفع', 'Owner paid'), v: fullMoney(unit.paidCashAmount, language) },
    { l: tx('باقي للمطور', 'Left to developer'), v: fullMoney(unit.remainingAmount, language) },
    { l: tx('القسط في الشهر تقريباً', 'Monthly, roughly'), v: fullMoney(monthlyInstallment(unit), language) },
    ...(left > 0 ? [{ l: tx('عدد الأقساط المتبقية', 'Instalments left'), v: tx(`${left} قسط`, `${left}`) }] : []),
    ...(monthsLeft(unit) > 0 ? [{ l: tx('المدة المتبقية', 'Time left'), v: durationLabel(monthsLeft(unit), language) }] : []),
  ];

  // What the unit is, at a glance, under the title.
  const facts = [
    { icon: Building2, l: tx('النوع', 'Type'), v: pick(language, unit.propertyType, unit.propertyTypeEn) },
    { icon: Maximize2, l: tx('المساحة', 'Area'), v: `${unit.areaM2} ${tx('م²', 'm²')}` },
    unit.bedrooms > 0 && { icon: BedDouble, l: tx('الغرف', 'Bedrooms'), v: String(unit.bedrooms) },
    unit.bathrooms > 0 && { icon: Bath, l: tx('الحمامات', 'Bathrooms'), v: String(unit.bathrooms) },
    { icon: Paintbrush, l: tx('التشطيب', 'Finishing'), v: pick(language, unit.finishing, unit.finishingEn) },
    { icon: KeyRound, l: tx('الاستلام', 'Delivery'), v: unit.deliveryStatus === 'استلام فوري' ? tx('فوري', 'Ready now') : deliveryLabel(unit, language) },
  ].filter(Boolean) as { icon: React.ElementType; l: string; v: string }[];
  const views = VIEW_OPTIONS.filter((o) => unit.views?.includes(o.key));

  const checks = [
    { ok: unit.verifiedContract, l: tx('العقد أصلي ومراجَع', 'Contract verified') },
    { ok: unit.developerAccountStatementVerified ?? unit.verifiedContract, l: tx('المدفوعات متطابقة مع المطور', 'Payments match developer') },
    { ok: !unit.hasLatePenalties, l: tx('مفيش غرامات تأخير', 'No late penalties') },
    { ok: unit.overpriceAmount === 0, l: tx('بدون أوفر برايس', 'Zero overprice') },
  ];

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
    // The developer's transfer fee is always the buyer's; how much depends on the developer.
    { k: tx('رسوم التنازل', 'Transfer fee'), v: transferFeeText(tx) },
    {
      k: tx('وديعة الصيانة', 'Maintenance deposit'),
      v: unit.hasMaintenanceDepositPaid ? tx('مدفوعة', 'Paid') : tx('لسه', 'Not yet paid'),
      tone: unit.hasMaintenanceDepositPaid ? 'good' : undefined,
    },
    ...(unit.taxCategory ? [{ k: tx('الضريبة', 'Tax'), v: tx(TAX[unit.taxCategory][0], TAX[unit.taxCategory][1]) }] : []),
    ...(unit.sellerWillingDiscountAmount
      ? [
          {
            k: tx('خصم صاحبها', "Owner's discount"),
            v: tx(`${fullMoney(unit.sellerWillingDiscountAmount, language)} أقل من اللي دفعه`, `${fullMoney(unit.sellerWillingDiscountAmount, language)} below what he paid`),
            tone: 'good' as const,
          },
        ]
      : []),
    ...(unit.eligibleForSwap
      ? [{ k: tx('صاحبها يقبل يبدّلها بـ', 'Owner would swap it for'), v: pick(language, unit.swapTargetType || tx('أي وحدة مناسبة', 'Any suitable unit'), unit.swapTargetTypeEn) }]
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

  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookTried(true);
    if (name.trim().length < 2 || !phoneValid || sending) return;
    setSending(true);
    setSendError('');
    try {
      await submitInquiry({
        unitId: unit.id,
        clientName: name.trim(),
        clientPhone: phone,
        inquiryType: 'booking',
        notes: tx(`مهتم بشراء الوحدة ${unit.compound} (${unit.verificationCode})`, `Interested in buying ${unit.compoundEn || unit.compound} (${unit.verificationCode})`),
      });
      onBooked(unit);
    } catch (err) {
      setSendError(errorText(err));
    } finally {
      setSending(false);
    }
  };

  const side = unit.images.map((src, i) => ({ src, i })).filter((x) => x.i !== imgIdx).slice(0, 2);

  return (
    <div className="page-wrap py-6 sm:py-10">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 font-semibold text-ink-soft hover:text-ink min-h-10">
          <Back className="w-4 h-4" />
          {tx('الوحدات', 'Units')}
        </button>
        <span aria-hidden>/</span>
        <span>{pick(language, unit.region, unit.regionEn)}</span>
        {unit.subArea && (
          <>
            <span aria-hidden>/</span>
            <span>{placeLabel(unit, language)}</span>
          </>
        )}
        <span aria-hidden>/</span>
        <span className="text-ink-soft font-medium truncate max-w-[16rem]">{compound}</span>
      </nav>

      {/* Title first: what it is and where, with the reasons to look closer as badges */}
      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {isDeal(unit) && (
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-base font-extrabold text-white shadow-md">
                <Flame className="w-4 h-4 fill-current" />
                {tx(`خصم ${money(sellerDiscount(unit), language)} من اللي صاحبها دفعه`, `${money(sellerDiscount(unit), language)} below what the owner paid`)}
              </span>
            )}
            {unit.verifiedContract && (
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-base font-bold text-brand">
                <BadgeCheck className="w-4 h-4" />
                {tx('متحقق بالمستندات', 'Documents verified')}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight text-ink">{compound}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-muted" />
              {pick(language, unit.location, unit.locationEn)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-muted" />
              <bdi>{pick(language, unit.developer, unit.developerEn)}</bdi>
            </span>
          </p>
          {/* كود الوحدة في خانة لوحده، باسمه — عشان يتقري في التليفون أو يتنسخ ويتبعت */}
          <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl border border-brand/20 bg-brand-soft ps-3 pe-1.5 py-1.5">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
              <Hash className="w-4 h-4 text-brand" />
              {tx('كود الوحدة', 'Unit code')}
            </span>
            <span className="num text-lg font-extrabold tracking-wide text-brand-ink" dir="ltr">
              {unit.verificationCode}
            </span>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(unit.verificationCode);
                  setCodeCopied(true);
                  setTimeout(() => setCodeCopied(false), 2000);
                } catch {
                  /* النسخ مش متاح — الكود ظاهر قدامه يكتبه */
                }
              }}
              aria-label={tx('انسخ كود الوحدة', 'Copy unit code')}
              className="inline-flex items-center gap-1 rounded-lg bg-surface px-2.5 py-1.5 text-sm font-semibold text-brand hover:bg-white"
            >
              {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {codeCopied ? tx('اتنسخ', 'Copied') : tx('انسخ', 'Copy')}
            </button>
            <a
              href={`#verify/${encodeURIComponent(unit.verificationCode)}`}
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-brand underline hover:bg-surface"
            >
              {tx('اتأكد منها', 'Verify')}
            </a>
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <button onClick={share} className="btn-ghost min-h-11 px-4 text-sm">
            <Share2 className="w-4 h-4" />
            {tx('شارك', 'Share')}
          </button>
          <button onClick={() => toggleSaveUnit(unit.id)} aria-pressed={saved} className="btn-ghost min-h-11 px-4 text-sm">
            <Heart key={String(saved)} className={`w-4 h-4 ${saved ? 'fill-danger text-danger heart-pop' : ''}`} />
            {saved ? tx('محفوظة', 'Saved') : tx('احفظ', 'Save')}
          </button>
          {copied && (
            <span className="absolute top-full mt-2 end-0 whitespace-nowrap rounded-full bg-brand text-white text-sm px-3 py-1.5 shadow-lift">
              {tx('اتنسخ اللينك', 'Link copied')}
            </span>
          )}
        </div>
      </header>

      {/* Gallery: the layout follows how many photos there are, so there's never an empty slot */}
      <div
        className={`mt-5 grid gap-2 sm:gap-3 ${
          side.length === 0 ? '' : side.length === 1 ? 'lg:grid-cols-[3fr_2fr]' : 'lg:grid-cols-[2fr_1fr]'
        }`}
      >
        <div className="relative rounded-card overflow-hidden bg-line">
          <img src={unit.images[imgIdx]} alt={compound} className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[480px] object-cover" />
          {isDeal(unit) && (
            <span
              className={`absolute top-4 start-4 inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-lg sm:text-xl font-extrabold text-white shadow-lift`}
            >
              <Flame className="w-6 h-6 fill-current" />
              {tx(`خصم ${money(sellerDiscount(unit), language)}`, `${money(sellerDiscount(unit), language)} off`)}
            </span>
          )}
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 backdrop-blur-xs text-white px-3 py-1.5 text-sm font-semibold">
            <Images className="w-4 h-4" />
            {imgIdx + 1} / {unit.images.length}
          </span>
        </div>
        {side.length > 0 && (
          <div className={`hidden lg:grid gap-3 h-[480px] ${side.length === 2 ? 'grid-rows-2' : 'grid-rows-1'}`}>
            {side.map(({ src, i: at }, i) => (
              <button key={src} onClick={() => setImgIdx(at)} className="relative rounded-card overflow-hidden bg-line group">
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                {i === side.length - 1 && unit.images.length > side.length + 1 && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/45 text-white text-lg font-bold">
                    +{unit.images.length - side.length - 1} {tx('صور', 'photos')}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {unit.images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar lg:hidden">
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

      {/* Key facts */}
      <div className="mt-5 card grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-line">
        {facts.map((f, i) => (
          <div
            key={f.l}
            className={`flex items-center gap-3 p-4 ${i > 0 ? 'lg:border-s border-line' : ''} ${i % 2 === 1 ? 'border-s sm:border-s-0 lg:border-s' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} ${i >= 3 ? 'sm:border-t lg:border-t-0' : ''}`}
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-soft text-brand shrink-0">
              <f.icon className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-muted">{f.l}</span>
              <span className="num block font-bold text-ink truncate">{f.v}</span>
            </span>
          </div>
        ))}
      </div>
      {views.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">{tx('الفيو:', 'View:')}</span>
          {views.map((o) => (
            <span key={o.key} className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-line px-3 py-1 font-medium text-ink-soft">
              <Eye className="w-4 h-4 text-muted" />
              {tx(o.ar, o.en)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 sm:mt-8 grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
        {/* Price + booking — first on phones, sticky side column on desktop */}
        <aside className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24 space-y-3">
          <div className="rounded-card bg-brand text-white p-6 shadow-lift">
            {isDeal(unit) && (
              <div className="-mt-6 -mx-6 mb-5 rounded-t-card bg-gradient-to-r from-[#e05a08] via-[#ea620a] to-[#f26a0a] px-6 py-3.5 flex items-center justify-between text-white font-black shadow-md">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <Flame className="w-5 h-5 shrink-0 fill-current animate-pulse" />
                  <span>
                    {tx(
                      `خصم خاص ${money(sellerDiscount(unit), language)} أقل من المدفوع!`,
                      `Special discount ${money(sellerDiscount(unit), language)} below what owner paid!`,
                    )}
                  </span>
                </div>
                <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {tx('صفقة حقيقية', 'Hot Deal')}
                </span>
              </div>
            )}
            <p className="flex items-center gap-2 text-sm text-white/70 font-medium">
              {tx('تدفع كاش دلوقتي', 'Cash now')}
              <SourceTag light verified={!!(unit.developerAccountStatementVerified ?? unit.verifiedContract)} />
            </p>
            <p className="num font-display mt-1 text-4xl font-extrabold">
              {money(cashPrice(unit), language)} <span className="text-base font-medium text-white/70">{currency(language)}</span>
            </p>
            {isDeal(unit) && (
              <p className="num mt-1 text-sm text-white/70 font-semibold">
                {tx('بدل', 'instead of')} <span className="line-through decoration-accent decoration-2">{money(unit.paidCashAmount, language)}</span> {tx('— اللي صاحبها دفعه', '— what the owner paid')}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-white/60">{tx('وقسط شهري تقريباً', 'Monthly, roughly')} <SourceTag light verified={false} /></span>
              <span className="num font-display text-xl font-bold">
                {money(monthlyInstallment(unit), language)} <span className="text-xs font-medium text-white/60">{currency(language)}</span>
              </span>
            </div>

            {!booking ? (
              <div className="mt-6 grid gap-2">
                <button onClick={() => requireAuth(() => setBooking(true))} className="btn-accent min-h-13 w-full">
                  <CalendarCheck className="w-5 h-5" />
                  {tx('مهتم بالشراء', "I'm interested in buying")}
                </button>
                {/* واتساب للمسجلين بس — اللي مش داخل بيتفتحله تسجيل الدخول الأول، وبعدها يضغط تاني. */}
                <a
                  href={whatsappLink(waText)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!requireAuth()) e.preventDefault();
                  }}
                  className="btn border border-white/20 text-white hover:bg-white/10 min-h-12 w-full">
                  <MessageCircle className="w-5 h-5" />
                  {tx('اسأل على واتساب', 'Ask on WhatsApp')}
                </a>
              </div>
            ) : (
              <form onSubmit={book} className="mt-6 grid gap-2.5">
                <div className="flex items-center justify-between text-xs text-white/80 mb-0.5">
                  <span className="font-semibold">{tx('بياناتك عشان نكلمك بخصوص الشراء', 'Your details so we can call you about buying')}</span>
                  <button
                    type="button"
                    onClick={() => setBooking(false)}
                    className="underline text-white/70 hover:text-white text-xs"
                  >
                    {tx('إلغاء', 'Cancel')}
                  </button>
                </div>
                <label className="sr-only" htmlFor="bk-name">
                  {tx('اسمك', 'Your name')}
                </label>
                <input
                  id="bk-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tx('اسمك بالكامل', 'Your full name')}
                  aria-invalid={bookTried && name.trim().length < 2}
                  className="w-full rounded-xl border border-white/30 bg-white px-4 h-13 text-[15px] font-semibold text-ink placeholder:text-muted/70 hover:border-white focus:outline-none focus:ring-4 focus:ring-accent/30 focus:border-accent focus:bg-white focus:text-ink transition shadow-xs"
                  autoFocus
                />
                <label className="sr-only" htmlFor="bk-phone">
                  {tx('رقم الموبايل', 'Mobile number')}
                </label>
                <input
                  id="bk-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={tx('رقم الموبايل (مثال: 01012345678)', 'Mobile (e.g. 01012345678)')}
                  inputMode="tel"
                  dir="ltr"
                  aria-invalid={(bookTried || phone.length >= 11) && !phoneValid}
                  className={`w-full rounded-xl border border-white/30 bg-white px-4 h-13 text-[15px] font-semibold text-ink placeholder:text-muted/70 hover:border-white focus:outline-none focus:ring-4 focus:ring-accent/30 focus:border-accent focus:bg-white focus:text-ink transition shadow-xs ${language === 'ar' ? 'text-right' : 'text-left'}`}
                />
                <FormError
                  messages={[
                    bookTried && name.trim().length < 2 && tx('اكتب اسمك', 'Enter your name'),
                    (bookTried || phone.length >= 11) && !phoneValid && tx('رقم الموبايل لازم يبدأ بـ 01 ويتكون من 11 رقم', 'Phone must start with 01 and be 11 digits'),
                  ]}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="btn bg-accent text-white hover:bg-accent-hover active:scale-[0.98] min-h-13 w-full font-bold shadow-md disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed"
                >
                  {sending ? tx('بنبعت...', 'Sending...') : tx('ابعت إني مهتم', 'Send my interest')}
                </button>
                <FormError messages={sendError} />
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
              { icon: Percent, t: tx(`عمولتنا ${BRAND.buyerFeePercent}% من سعر الوحدة، بشيك مصرفي بعد التنازل بس`, `Our fee is ${BRAND.buyerFeePercent}% of the unit price, by bank cheque, only after the transfer`) },
              { icon: Undo2, t: tx('تقدر تنسحب قبل توقيع عقد وعد البيع', 'You can withdraw before signing the promise of sale') },
              { icon: Eye, t: tx('لما تبعت إنك مهتم بنكلّمك خلال يوم عمل نكمّل الإجراءات', 'Once you send your interest we call within one business day to go ahead') },
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
          {/* The numbers */}
          <section className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-ink">{tx('الأرقام', 'The numbers')}</h2>
            <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {keyNumbers.map((k) => (
                <div key={k.l} className="rounded-xl bg-paper px-4 py-3">
                  <dt className="text-xs text-muted">{k.l}</dt>
                  <dd className="num mt-1 text-base sm:text-lg font-bold text-ink">{k.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Savings — the reason to buy here */}
          <div className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-ink">{tx('هتوفّر قد إيه؟', 'How much you save')}</h2>
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
              {tx(`وبعد خصم عمولتنا (${BRAND.buyerFeePercent}% من سعر الوحدة). `, `Net of our fee (${BRAND.buyerFeePercent}% of the unit price). `)}
              {tx('سعر المطور النهارده تقديري وقت نشر الإعلان.', "Today's developer price is an estimate from when the listing went up.")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold text-ink mb-4">{tx('راجعنالك', "We've checked")}</h2>
              <ul className="space-y-3">
                {checks.map((c) => (
                  <li key={c.l} className={`flex items-center gap-2.5 ${c.ok ? 'text-ink' : 'text-muted line-through'}`}>
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${c.ok ? 'text-emerald-600' : 'text-line-strong'}`} />
                    {c.l}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold text-ink mb-4">{tx('خطة السداد', 'Payment plan')}</h2>
              <dl className="space-y-3 text-[15px]">
                {[
                  [tx('القسط', 'Installment'), fullMoney(unit.installmentValue, language)],
                  [
                    tx('الجدولة', 'Schedule'),
                    pick(language, unit.installmentFrequency, { 'شهري': 'شهرياً', 'ربع سنوي': 'ربع سنوي', 'نصف سنوي': 'نصف سنوي', 'سنوي': 'سنوي' }[unit.installmentFrequency] || unit.installmentFrequency),
                  ],
                  [tx('إجمالي خطة السداد', 'Total payment plan'), tx(`${unit.installmentPeriodYears} سنين`, `${unit.installmentPeriodYears} years`)],
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
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-bold text-ink mb-4">{tx('المديونية والشروط', 'Dues & terms')}</h2>
            <dl className="grid sm:grid-cols-2 gap-2.5 text-[15px]">
              {terms.map((r) => (
                <div key={r.k} className="flex justify-between gap-3 rounded-xl bg-paper px-4 py-3">
                  <dt className="text-muted">{r.k}</dt>
                  <dd className={`num font-semibold text-end ${r.tone === 'bad' ? 'text-danger' : 'text-ink'}`}>{r.v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm text-ink-soft leading-relaxed">
              {tx(
                'تقدر تنسحب في أي وقت قبل توقيع عقد وعد البيع. رسوم التنازل عند المطور بيدفعها المشتري، وقيمتها بتختلف من مطور للتاني.',
                "You can withdraw any time before signing the promise of sale. The developer's transfer fee is paid by the buyer, and the amount differs by developer.",
              )}
            </p>
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

          {pick(language, unit.description, unit.descriptionEn) && (
            <section className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold text-ink mb-3">{tx('عن الوحدة', 'About the unit')}</h2>
              <p className="text-ink-soft leading-relaxed">{pick(language, unit.description, unit.descriptionEn)}</p>
            </section>
          )}
        </div>
      </div>

      {/* Unit Comparison Strip & Modal (Aqar Exit style) */}
      <div className="mt-10 sm:mt-14">
        <AqarExitComparison
          currentUnit={unit}
          allUnits={units}
          onSelectUnit={onSelectUnit}
        />
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
