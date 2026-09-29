import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Search, CheckCircle2, MinusCircle, MessageCircle } from 'lucide-react';
import { RealEstateUnit } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { whatsappLink } from '../config/brand';
import { pick } from '../lib/unitHelpers';

interface VerifyPageProps {
  units: RealEstateUnit[];
  /** Code from the link (#verify/WHD-…), if any. */
  initialCode: string | null;
  onSelectUnit: (unit: RealEstateUnit) => void;
}

const normalise = (s: string) => s.trim().toUpperCase().replace(/\s+/g, '');

/** Anyone can check a unit code they were sent — the simplest guard against someone using our name on a fake listing. */
export const VerifyPage: React.FC<VerifyPageProps> = ({ units, initialCode, onSelectUnit }) => {
  const { language, tx, isRTL } = useLanguage();
  const [code, setCode] = useState(initialCode ?? '');
  const [checked, setChecked] = useState<string | null>(initialCode ? normalise(initialCode) : null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      setChecked(normalise(initialCode));
    }
  }, [initialCode]);

  const unit = checked ? units.find((u) => normalise(u.verificationCode) === checked) : undefined;

  const checks = unit
    ? [
        { ok: !!unit.verifiedContract, l: tx('العقد أصلي ومراجَع', 'Contract reviewed') },
        { ok: unit.developerAccountStatementVerified ?? !!unit.verifiedContract, l: tx('المدفوعات متطابقة مع المطور', 'Payments match the developer') },
        { ok: unit.overpriceAmount === 0, l: tx('من غير أوفر برايس', 'No overprice') },
      ]
    : [];

  return (
    <div className="page-wrap py-10 sm:py-16 max-w-2xl">
      <span className="grid place-items-center w-14 h-14 rounded-xl bg-brand text-white">
        <ShieldCheck className="w-7 h-7" />
      </span>
      <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-ink">{tx('اتأكد من الوحدة', 'Verify a unit')}</h1>
      <p className="mt-3 text-ink-soft leading-relaxed">
        {tx(
          'حد بعتلك وحدة وقالك إنها على وحدتي؟ اكتب الكود اللي عليها واتأكد إنها عندنا فعلاً ومتراجعة — قبل ما تدفع أي حاجة.',
          'Someone sent you a unit saying it is on Forsa? Enter its code and check it is really ours and reviewed — before you pay anything.',
        )}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!code.trim()) return;
          setChecked(normalise(code));
          window.history.replaceState(null, '', `#verify/${encodeURIComponent(normalise(code))}`);
        }}
        className="mt-8 flex gap-3"
      >
        <label htmlFor="verify-code" className="sr-only">
          {tx('كود الوحدة', 'Unit code')}
        </label>
        <input
          id="verify-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          dir="ltr"
          placeholder="WHD-PH-8821"
          className={`field flex-1 num ${isRTL ? 'text-right' : 'text-left'}`}
          autoFocus={!initialCode}
        />
        <button type="submit" className="btn-primary min-h-13 px-5">
          <Search className="w-5 h-5" />
          {tx('اتأكد', 'Check')}
        </button>
      </form>

      {checked && unit && (
        <div className="mt-8 card overflow-hidden">
          <div className="flex items-center gap-3 bg-brand text-white px-5 py-4">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <p className="font-bold">{tx('الوحدة دي عندنا ومتراجعة.', 'This unit is listed with us and reviewed.')}</p>
          </div>
          <div className="p-5 flex gap-4">
            <img src={unit.images[0]} alt="" className="w-28 h-24 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-lg text-ink">{pick(language, unit.compound, unit.compoundEn)}</p>
              <p className="text-sm text-muted">{pick(language, unit.location, unit.locationEn)}</p>
              <p className="num text-xs text-muted mt-0.5" dir="ltr">
                {unit.verificationCode}
              </p>
            </div>
          </div>
          <ul className="px-5 pb-2 space-y-2">
            {checks.map((c) => (
              <li key={c.l} className="flex items-center gap-2 text-ink">
                {c.ok ? <CheckCircle2 className="w-5 h-5 text-brand" /> : <MinusCircle className="w-5 h-5 text-muted" />}
                {c.l}
              </li>
            ))}
          </ul>
          <div className="p-5 flex flex-wrap gap-3">
            <button onClick={() => onSelectUnit(unit)} className="btn-primary">
              {tx('شوف الوحدة', 'View the unit')}
            </button>
          </div>
          <p className="px-5 pb-5 text-xs text-muted">
            {tx('وبرضه: ما تدفعش عربون لأي حد. الفلوس بتتدفع يوم التنازل في مقر المطور بس.', 'And still: never pay a deposit. Money changes hands only on transfer day, at the developer.')}
          </p>
        </div>
      )}

      {checked && !unit && (
        <div className="mt-8 rounded-card border-2 border-danger/40 bg-danger-soft p-5">
          <p className="flex items-center gap-2 font-bold text-danger">
            <ShieldAlert className="w-6 h-6" />
            {tx('مش لاقيين وحدة بالكود ده.', "We can't find a unit with this code.")}
          </p>
          <p className="mt-2 text-ink-soft">
            {tx(
              'اتأكد إنك كتبته صح. لو حد بيقولك إنها على وحدتي وطالب منك فلوس، ما تدفعش — وكلّمنا.',
              "Check you typed it right. If someone says it's on Forsa and asks you for money, don't pay — and tell us.",
            )}
          </p>
          <a href={whatsappLink(tx(`حد بعتلي وحدة بكود ${checked} ومش لاقيها`, `Someone sent me unit code ${checked} and I can't find it`))} target="_blank" rel="noreferrer" className="btn-primary mt-4">
            <MessageCircle className="w-5 h-5" />
            {tx('بلّغنا على واتساب', 'Tell us on WhatsApp')}
          </a>
        </div>
      )}
    </div>
  );
};
