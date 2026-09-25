import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Repeat, ArrowDownUp, MessageCircle, ArrowDown, ArrowUp, X, ClipboardList, Search, Handshake } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UnitCard } from '../components/UnitCard';
import { Pagination } from '../components/Pagination';
import { Field, MoneyInput, Toggle } from '../components/sell/FormBits';
import { BRAND, whatsappLink } from '../config/brand';
import { PROPERTY_TYPES, REGIONS, cashPrice, currency, money, monthlyInstallment, pick } from '../lib/unitHelpers';
import { isResidential, isValidPhone } from '../lib/sellForm';

interface PropertySwapPageProps {
  units: RealEstateUnit[];
  onSelectUnit: (unit: RealEstateUnit) => void;
  /** Called once a swap request is sent for a target unit. */
  onRequested: (unit: RealEstateUnit) => void;
}

const PAGE_SIZE = 12;

/**
 * Swap = we sell the owner's unit and buy the new one for them, arranged together.
 * So any listed unit can be a target — the other owner doesn't need to want this one.
 */
export const PropertySwapPage: React.FC<PropertySwapPageProps> = ({ units, onSelectUnit, onRequested }) => {
  const { language, tx, isRTL } = useLanguage();
  const [myPaid, setMyPaid] = useState(0);
  const [myMonthly, setMyMonthly] = useState(0);
  const [wantRegion, setWantRegion] = useState('');
  // 'residential' is a group, not a type: most people swapping out of a home want another home.
  const [wantType, setWantType] = useState('residential');
  const [lowerOnly, setLowerOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<RealEstateUnit | null>(null);
  const resultsTop = useRef<HTMLDivElement>(null);

  // "Lower monthly" only means something once we know their current monthly.
  const filterLower = lowerOnly && myMonthly > 0;

  const matches = useMemo(
    () =>
      units
        .filter((u) => !wantRegion || u.region === wantRegion)
        .filter((u) => !wantType || (wantType === 'residential' ? isResidential(u.propertyType) : u.propertyType === wantType))
        .filter((u) => !filterLower || monthlyInstallment(u) < myMonthly)
        .sort((a, b) =>
          filterLower
            ? monthlyInstallment(a) - monthlyInstallment(b)
            : myPaid
              ? Math.abs(cashPrice(a) - myPaid) - Math.abs(cashPrice(b) - myPaid)
              : 0,
        ),
    [units, wantRegion, wantType, filterLower, myMonthly, myPaid],
  );

  useEffect(() => setPage(1), [wantRegion, wantType, filterLower, myMonthly, myPaid]);

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const diffTag = (u: RealEstateUnit) => {
    if (!myPaid) return undefined;
    const diff = cashPrice(u) - myPaid;
    return {
      strong: diff <= 0,
      label:
        diff > 0
          ? tx(`تدفع فرق ${money(diff, language)}`, `You pay ${money(diff, language)}`)
          : diff < 0
            ? tx(`تاخد فرق ${money(-diff, language)}`, `You get ${money(-diff, language)}`)
            : tx('من غير فرق', 'Even swap'),
    };
  };

  return (
    <div className="page-wrap py-8 sm:py-12">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft text-ink px-3.5 py-1.5 text-sm font-semibold">
          <Repeat className="w-4 h-4" />
          {tx('حصري عندنا', 'Only here')}
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-ink">{tx('بدّل وحدتك بوحدة قسطها يريحك', 'Swap for a unit whose instalment you can manage')}</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          {tx(
            'مش لازم تبيع الأول وتدوّر لوحدك. إحنا بنبيع وحدتك وبنشتريلك الوحدة التانية مع بعض، وإنت تدفع أو تاخد الفرق بس.',
            "No need to sell first and search on your own. We sell your unit and buy the new one for you together — you just settle the difference.",
          )}
        </p>
      </div>

      {/* How it works — the questions everyone has before they try it. */}
      <ol className="mt-8 grid sm:grid-cols-3 gap-3">
        {[
          { icon: ClipboardList, t: tx('قولنا وحدتك وعاوز إيه', 'Tell us your unit and what you want'), d: tx('اللي دفعته وقسطك، والمنطقة والنوع', 'What you paid, your monthly, area and type') },
          { icon: Search, t: tx('نراجع العقدين', 'We check both contracts'), d: tx('ونلاقي مشتري لوحدتك بسعر اللي دفعته', 'And find a buyer for yours at what you paid') },
          {
            icon: Handshake,
            t: tx('تنازلين مترتبين مع بعض', 'Two transfers, arranged together'),
            d: tx(`تدفع أو تاخد الفرق. وحدتك من غير عمولة، والجديدة ${BRAND.buyerFeePercent}% بعد التوقيع`, `Settle the difference. No fee on yours; ${BRAND.buyerFeePercent}% on the new one after signing`),
          },
        ].map((s, i) => (
          <li key={s.t} className="card p-4 flex items-start gap-3">
            <span className="num grid place-items-center w-8 h-8 rounded-full bg-ink text-white text-sm font-bold shrink-0">{i + 1}</span>
            <div>
              <p className="font-bold text-ink">{s.t}</p>
              <p className="mt-0.5 text-sm text-muted">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 card p-6 sm:p-8 grid lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-start">
        <div className="space-y-4">
          <p className="font-bold text-ink">{tx('وحدتك', 'Your unit')}</p>
          <Field label={tx('دفعت فيها كام؟', 'Paid so far')} htmlFor="sw-paid" hint={tx('عشان نحسب الفرق', 'To work out the difference')}>
            <MoneyInput id="sw-paid" value={myPaid} onChange={setMyPaid} placeholder="1,500,000" />
          </Field>
          <Field label={tx('قسطك الشهري دلوقتي كام؟', 'Your monthly instalment now')} htmlFor="sw-monthly" hint={tx('لو بتدفع كل 3 شهور، اقسم على 3', 'If you pay quarterly, divide by 3')}>
            <MoneyInput id="sw-monthly" value={myMonthly} onChange={setMyMonthly} placeholder="55,000" />
          </Field>
        </div>

        <span className="hidden lg:grid self-center place-items-center w-12 h-12 rounded-full bg-brand-soft text-ink">
          <ArrowDownUp className="w-5 h-5 rotate-90" />
        </span>

        <div className="space-y-5">
          <p className="font-bold text-ink">{tx('عاوز إيه بدالها؟', 'What do you want instead?')}</p>
          <Toggle
            label={tx('قسطها أقل من قسطي', 'Lower monthly than mine')}
            hint={myMonthly ? tx('بنرتّبها من الأقل قسط', 'Sorted from the lowest monthly') : tx('اكتب قسطك الأول', 'Enter your monthly first')}
            on={lowerOnly}
            onChange={setLowerOnly}
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setWantRegion('')} className={wantRegion === '' ? 'chip-on' : 'chip-off'}>
              {tx('أي منطقة', 'Any area')}
            </button>
            {REGIONS.map((r) => (
              <button key={r.ar} onClick={() => setWantRegion(r.ar)} className={wantRegion === r.ar ? 'chip-on' : 'chip-off'}>
                {language === 'ar' ? r.ar : r.en}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setWantType('residential')} className={wantType === 'residential' ? 'chip-on' : 'chip-off'}>
              {tx('أي سكني', 'Any home')}
            </button>
            <button onClick={() => setWantType('')} className={wantType === '' ? 'chip-on' : 'chip-off'}>
              {tx('أي نوع', 'Any type')}
            </button>
            {PROPERTY_TYPES.map((p) => (
              <button key={p.ar} onClick={() => setWantType(p.ar)} className={wantType === p.ar ? 'chip-on' : 'chip-off'}>
                {language === 'ar' ? p.ar : p.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={resultsTop} className="mt-10 scroll-mt-24">
        <p className="text-ink-soft">
          <span className="num font-bold text-ink">{matches.length}</span> {tx('وحدة ممكن تبدّل بيها', 'units you could swap into')}
          {filterLower && <span className="text-muted"> · {tx('قسطها أقل من قسطك', 'lower monthly than yours')}</span>}
        </p>
      </div>

      {matches.length > 0 ? (
        <>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageItems.map((u) => {
              const change = myMonthly ? monthlyInstallment(u) - myMonthly : 0;
              return (
                <UnitCard
                  key={u.id}
                  unit={u}
                  onOpen={onSelectUnit}
                  tag={diffTag(u)}
                  footer={
                    <div className="mt-4 pt-4 border-t border-line space-y-3">
                      {myMonthly > 0 && (
                        <p className={`num flex items-center gap-1.5 text-sm font-semibold ${change < 0 ? 'text-ink' : 'text-danger'}`}>
                          {change < 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                          {change < 0
                            ? tx(`قسطك هيقل ${money(-change, language)} في الشهر`, `Your monthly drops by ${money(-change, language)}`)
                            : tx(`قسطك هيزيد ${money(change, language)} في الشهر`, `Your monthly rises by ${money(change, language)}`)}
                        </p>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTarget(u);
                        }}
                        className="btn-primary w-full min-h-12"
                      >
                        <Repeat className="w-4 h-4" />
                        {tx('اطلب التبديل ده', 'Request this swap')}
                      </button>
                    </div>
                  }
                />
              );
            })}
          </div>
          <div className="mt-10">
            <Pagination
              page={current}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                resultsTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
          </div>
        </>
      ) : (
        <div className="mt-5 card p-10 text-center">
          <p className="font-bold text-lg text-ink">{tx('مفيش وحدة بالمواصفات دي دلوقتي', 'Nothing matches right now')}</p>
          <p className="mt-1 text-muted">{tx('جرّب منطقة أو نوع تاني، أو ابعتلنا وإحنا ندوّرلك.', 'Try another area or type, or message us and we’ll look for you.')}</p>
          <a href={whatsappLink(tx('عاوز أبدّل وحدتي', 'I want to swap my unit'))} target="_blank" rel="noreferrer" className="btn-primary mt-6">
            <MessageCircle className="w-5 h-5" />
            {tx('كلمنا واتساب', 'WhatsApp us')}
          </a>
        </div>
      )}

      {target && (
        <SwapRequestSheet
          target={target}
          myPaid={myPaid}
          myMonthly={myMonthly}
          onClose={() => setTarget(null)}
          onSent={() => {
            const u = target;
            setTarget(null);
            onRequested(u);
          }}
        />
      )}
    </div>
  );
};

/** Name + phone, with a summary of the swap — enough for an advisor to call back. */
const SwapRequestSheet: React.FC<{
  target: RealEstateUnit;
  myPaid: number;
  myMonthly: number;
  onClose: () => void;
  onSent: () => void;
}> = ({ target, myPaid, myMonthly, onClose, onSent }) => {
  const { language, tx, isRTL } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tried, setTried] = useState(false);
  const diff = myPaid ? cashPrice(target) - myPaid : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (name.trim().length < 2 || !isValidPhone(phone)) return;
    // TODO(api): send { targetUnitId, myPaid, myMonthly, name, phone } once the backend exists.
    onSent();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="swap-title">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <form onSubmit={submit} noValidate className="relative w-full sm:max-w-md bg-surface rounded-t-card sm:rounded-card p-6 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <p id="swap-title" className="font-display text-xl font-bold text-ink">
            {tx('اطلب التبديل', 'Request the swap')}
          </p>
          <button type="button" onClick={onClose} aria-label={tx('إغلاق', 'Close')} className="grid place-items-center w-10 h-10 rounded-full hover:bg-paper -mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <dl className="mt-4 rounded-xl bg-paper p-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{tx('الوحدة الجديدة', 'New unit')}</dt>
            <dd className="font-semibold text-ink text-end truncate">{pick(language, target.compound, target.compoundEn)}</dd>
          </div>
          {diff !== null && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{diff > 0 ? tx('هتدفع فرق', "You'll pay") : tx('هتاخد فرق', "You'll get")}</dt>
              <dd className="num font-semibold text-ink">
                {money(Math.abs(diff), language)} {currency(language)}
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{tx('قسطك الجديد تقريباً', 'New monthly, roughly')}</dt>
            <dd className="num font-semibold text-ink">
              {money(monthlyInstallment(target), language)} {currency(language)}
              {myMonthly > 0 && <span className="text-muted font-normal"> {tx(`بدل ${money(myMonthly, language)}`, `vs ${money(myMonthly, language)}`)}</span>}
            </dd>
          </div>
        </dl>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="sw-name" className="label">
              {tx('اسمك', 'Your name')}
            </label>
            <input id="sw-name" value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" autoFocus />
            {tried && name.trim().length < 2 && <p className="mt-1.5 text-sm text-danger">{tx('اكتب اسمك', 'Enter your name')}</p>}
          </div>
          <div>
            <label htmlFor="sw-phone" className="label">
              {tx('موبايل (واتساب)', 'Mobile (WhatsApp)')}
            </label>
            <input
              id="sw-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              dir="ltr"
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
              className={`field ${isRTL ? 'text-right' : 'text-left'}`}
            />
            {tried && !isValidPhone(phone) && <p className="mt-1.5 text-sm text-danger">{tx('رقم موبايل مصري صحيح، 11 رقم', 'A valid 11-digit Egyptian mobile')}</p>}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-6 min-h-13">
          <Repeat className="w-5 h-5" />
          {tx('ابعت طلب التبديل', 'Send swap request')}
        </button>
        <p className="mt-3 text-center text-xs text-muted">{tx('الأرقام تقديرية لحد ما نراجع العقدين. مفيش أي التزام دلوقتي.', 'Figures are estimates until both contracts are reviewed. No commitment now.')}</p>
      </form>
    </div>
  );
};
