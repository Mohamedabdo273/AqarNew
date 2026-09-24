import React, { useEffect, useRef, useState } from 'react';
import {
  X,
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
} from 'lucide-react';
import { PageId, RealEstateUnit } from '../types';
import { BRAND, whatsappLink } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import {
  currency,
  deliveryLabel,
  fullMoney,
  money,
  monthlyInstallment,
  pick,
  savingsAmount,
  savingsPercent,
} from '../lib/unitHelpers';

interface UnitDetailModalProps {
  unit: RealEstateUnit | null;
  onClose: () => void;
  onOpenBuyerRules: () => void;
  onNavigate: (page: PageId) => void;
}

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({ unit, onClose, onOpenBuyerRules, onNavigate }) => {
  const { language, tx } = useLanguage();
  const { isUnitSaved, toggleSaveUnit, submitInquiry } = useUnits();
  const [imgIdx, setImgIdx] = useState(0);
  const [step, setStep] = useState<'view' | 'form' | 'done'>('view');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setImgIdx(0);
    setStep('view');
    if (!unit) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [unit?.id]);

  if (!unit) return null;

  const saved = isUnitSaved(unit.id);
  const oldPct = Math.round((unit.originalContractPrice / unit.currentMarketPrice) * 100);
  const phoneValid = /^01\d{9}$/.test(phone.replace(/\s/g, ''));

  const keyNumbers = [
    { l: tx('تدفع كاش', 'Cash now'), v: money(unit.paidCashAmount, language), strong: true },
    { l: tx('قسط شهري تقريباً', '≈ Monthly'), v: money(monthlyInstallment(unit), language), brand: true },
    { l: tx('باقي للمطور', 'Left to developer'), v: money(unit.remainingAmount, language) },
    { l: tx('الاستلام', 'Delivery'), v: deliveryLabel(unit, language), noCurrency: true },
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
    `${unit.compound} — تدفع ${money(unit.paidCashAmount, language)} والقسط ${money(monthlyInstallment(unit), language)} في الشهر`,
    `${unit.compoundEn || unit.compound} — ${money(unit.paidCashAmount, language)} cash, ${money(monthlyInstallment(unit), language)}/month`
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

  const waText = (
    tx(`مهتم بالوحدة ${unit.compound} (${unit.verificationCode})`, `Interested in ${unit.compoundEn || unit.compound} (${unit.verificationCode})`)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-4xl max-h-[94vh] sm:max-h-[90vh] flex flex-col bg-paper rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-lift">
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Gallery */}
          <div className="relative">
            <img src={unit.images[imgIdx]} alt="" className="w-full aspect-[16/9] sm:aspect-[2/1] object-cover" />
            <div className="absolute top-4 inset-x-4 flex justify-between">
              <button onClick={onClose} aria-label={tx('إغلاق', 'Close')} className="grid place-items-center w-11 h-11 rounded-full bg-surface/95 shadow">
                <X className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                <button onClick={share} aria-label={tx('شارك', 'Share')} className="grid place-items-center w-11 h-11 rounded-full bg-surface/95 shadow">
                  <Share2 className="w-5 h-5" />
                </button>
                <button onClick={() => toggleSaveUnit(unit.id)} aria-label={tx('حفظ', 'Save')} className="grid place-items-center w-11 h-11 rounded-full bg-surface/95 shadow">
                  <Heart className={`w-5 h-5 ${saved ? 'fill-danger text-danger' : ''}`} />
                </button>
              </div>
            </div>
            {copied && (
              <span className="absolute top-16 end-4 rounded-full bg-ink text-white text-sm px-3 py-1.5 shadow-lift">{tx('اتنسخ اللينك', 'Link copied')}</span>
            )}
            {unit.images.length > 1 && (
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                {unit.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setImgIdx(i)}
                    aria-label={`${i + 1}`}
                    className={`w-12 h-9 rounded-lg overflow-hidden border-2 transition ${i === imgIdx ? 'border-white' : 'border-transparent opacity-70'}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <p className="flex items-center gap-1.5 text-sm text-muted">
                <Building2 className="w-4 h-4" />
                {pick(language, unit.developer, unit.developerEn)}
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-ink">{pick(language, unit.compound, unit.compoundEn)}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-ink-soft">
                <MapPin className="w-4 h-4 text-muted" />
                {pick(language, unit.location, unit.locationEn)}
              </p>
            </div>

            {/* Key numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {keyNumbers.map((k) => (
                <div key={k.l} className="card p-4">
                  <p className="text-xs text-muted">{k.l}</p>
                  <p className={`num mt-1 text-xl font-bold ${k.brand ? 'text-brand' : 'text-ink'}`}>
                    {k.v}
                    {!k.noCurrency && <span className="text-xs font-medium text-muted"> {currency(language)}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Old vs today's price */}
            <div className="card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-ink">{tx('هتوفّر قد إيه؟', 'How much you save')}</p>
                <span className="rounded-full bg-gold-soft text-gold px-3 py-1 text-sm font-bold">
                  {money(savingsAmount(unit), language)} {currency(language)} · {savingsPercent(unit)}%
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-ink-soft">{tx('سعر العقد (اللي هتدفعه)', 'Contract price (you pay)')}</span>
                    <span className="num font-bold text-brand">{fullMoney(unit.originalContractPrice, language)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-line overflow-hidden">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${oldPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-ink-soft">{tx('سعر المطور النهارده', "Developer's price today")}</span>
                    <span className="num font-bold text-ink">{fullMoney(unit.currentMarketPrice, language)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-line-strong" />
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap gap-2">
              {specs.map((s) => (
                <span key={s.v} className="chip-off pointer-events-none">
                  <s.icon className="w-4 h-4 text-muted" />
                  {s.v}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Verification */}
              <div className="card p-5">
                <p className="font-bold text-ink mb-4">{tx('راجعنالك', "We've checked")}</p>
                <ul className="space-y-3">
                  {checks.map((c) => (
                    <li key={c.l} className={`flex items-center gap-2.5 ${c.ok ? 'text-ink' : 'text-muted line-through'}`}>
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${c.ok ? 'text-brand' : 'text-line-strong'}`} />
                      {c.l}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment plan */}
              <div className="card p-5">
                <p className="font-bold text-ink mb-4">{tx('خطة السداد', 'Payment plan')}</p>
                <dl className="space-y-3 text-[15px]">
                  {[
                    [tx('القسط', 'Installment'), fullMoney(unit.installmentValue, language)],
                    [tx('كل', 'Every'), pick(language, unit.installmentFrequency, { 'شهري': 'month', 'ربع سنوي': '3 months', 'نصف سنوي': '6 months', 'سنوي': 'year' }[unit.installmentFrequency])],
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
                    <dd className={`num font-semibold text-end ${r.tone === 'bad' ? 'text-danger' : r.tone === 'good' ? 'text-brand' : 'text-ink'}`}>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <button onClick={onOpenBuyerRules} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
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

            <p className="text-ink-soft leading-relaxed">{pick(language, unit.description, unit.descriptionEn)}</p>
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="border-t border-line bg-surface p-4 sm:px-8">
          {step === 'view' && (
            <div className="flex gap-3">
              <button onClick={() => setStep('form')} className="btn-primary flex-1 min-h-13">
                <CalendarCheck className="w-5 h-5" />
                {tx('احجز معاينة', 'Book a viewing')}
              </button>
              <a href={whatsappLink(waText)} target="_blank" rel="noreferrer" className="btn-ghost min-h-13" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5 text-brand" />
                <span className="hidden sm:inline">{tx('واتساب', 'WhatsApp')}</span>
              </a>
            </div>
          )}

          {step === 'form' && (
            <ul className="mb-4 grid sm:grid-cols-3 gap-2 text-sm">
              {[
                { icon: Ban, t: tx('ما تدفعش عربون لحد', 'Never pay a deposit') },
                { icon: Percent, t: tx(`عمولتنا ${BRAND.buyerFeePercent}% بعد التوقيع بس`, `Our ${BRAND.buyerFeePercent}% fee is after signing`) },
                { icon: Eye, t: tx('المعاينة ببلاش', 'Viewing is free') },
              ].map((r) => (
                <li key={r.t} className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2 text-ink-soft">
                  <r.icon className="w-4 h-4 text-brand shrink-0" />
                  {r.t}
                </li>
              ))}
            </ul>
          )}
          {step === 'form' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim() || !phoneValid) return;
                submitInquiry({ unitId: unit.id, clientName: name.trim(), clientPhone: phone, inquiryType: 'viewing' });
                setStep('done');
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={tx('اسمك', 'Your name')} className="field flex-1" autoFocus />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tx('رقم الموبايل', 'Mobile number')}
                inputMode="tel"
                dir="ltr"
                className={`field flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}
              />
              <button type="submit" disabled={!name.trim() || !phoneValid} className="btn-primary min-h-13">
                {tx('تأكيد', 'Confirm')}
              </button>
            </form>
          )}
          {step === 'form' && (
            <p className="mt-3 text-center text-xs text-muted">
              {tx('بالتأكيد إنت موافق على ', 'By confirming you agree to the ')}
              <button type="button" onClick={() => onNavigate('terms')} className="text-brand font-semibold hover:underline">
                {tx('الشروط', 'Terms')}
              </button>
              {tx(' و', ' and ')}
              <button type="button" onClick={() => onNavigate('privacy')} className="text-brand font-semibold hover:underline">
                {tx('الخصوصية', 'Privacy')}
              </button>
            </p>
          )}

          {step === 'done' && (
            <div className="flex items-center gap-3 text-brand-ink">
              <CheckCircle2 className="w-6 h-6 text-brand shrink-0" />
              <p className="font-semibold">{tx('تمام! هنكلمك خلال ساعتين.', "Done! We'll call you within 2 hours.")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
