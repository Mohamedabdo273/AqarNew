import React, { useState } from 'react';
import { ClipboardCheck, Send, Lock, TrendingDown, AlertTriangle, MessageCircle } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { whatsappLink } from '../config/brand';
import { cancellationLoss, currency, money } from '../lib/unitHelpers';
import { isValidPhone } from '../lib/sellForm';
import { Field, FilePick, MoneyInput, Toggle } from '../components/sell/FormBits';

interface StatementPageProps {
  onNavigate: (page: PageId) => void;
  onSent: () => void;
}

/** Same key the sell form reads its draft from — so "list it now" after the statement starts pre-filled. */
const SELL_DRAFT_KEY = 'wahdety_sell_quick_draft_v1';

/**
 * A free statement request: advice, not a listing. No seller rules to agree to, nothing is published.
 * The advisor calls back and sends the statement on WhatsApp.
 */
export const StatementPage: React.FC<StatementPageProps> = ({ onNavigate, onSent }) => {
  const { language, tx, isRTL } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [developer, setDeveloper] = useState('');
  const [compound, setCompound] = useState('');
  const [contract, setContract] = useState(0);
  const [paid, setPaid] = useState(0);
  const [late, setLate] = useState(false);
  const [lateAmount, setLateAmount] = useState(0);
  const [contractFile, setContractFile] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validMoney = contract > 0 && paid > 0 && paid <= contract;
  const fines = late ? lateAmount : 0;
  const cancelBack = validMoney ? paid - cancellationLoss(contract, paid) : 0;
  const sellBack = validMoney ? Math.max(0, paid - fines) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: string[] = [];
    if (name.trim().length < 2) err.push(tx('اسمك', 'Your name'));
    if (!isValidPhone(phone)) err.push(tx('موبايل صحيح (01xxxxxxxxx)', 'Valid mobile (01xxxxxxxxx)'));
    if (!developer.trim()) err.push(tx('المطور', 'Developer'));
    if (!contract) err.push(tx('سعر العقد', 'Contract price'));
    if (!paid) err.push(tx('المدفوع', 'Amount paid'));
    if (paid > contract && contract) err.push(tx('المدفوع أكبر من سعر العقد', 'Paid is more than contract price'));
    setErrors(err);
    if (err.length) {
      document.getElementById('statement-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // TODO(api): send the statement request once the backend exists.
    // Meanwhile keep the answers so listing afterwards doesn't mean typing them again.
    try {
      const prev = JSON.parse(localStorage.getItem(SELL_DRAFT_KEY) || '{}');
      localStorage.setItem(
        SELL_DRAFT_KEY,
        JSON.stringify({
          ...prev,
          ownerName: name.trim(),
          ownerPhone: phone,
          developer: developer.trim(),
          compound: compound.trim(),
          contractPrice: contract,
          paidAmount: paid,
          hasLatePenalties: late,
          latePenaltiesAmount: lateAmount,
          contractFile,
        }),
      );
    } catch {
      /* the draft is a convenience only */
    }
    onSent();
  };

  return (
    <div id="statement-top" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 scroll-mt-20">
      <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand text-white">
        <ClipboardCheck className="w-6 h-6" />
      </span>
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-ink">{tx('كشف حساب وحدتك — مجاناً', 'Your unit statement — free')}</h1>
      <p className="mt-2 text-accent font-semibold">{tx('مش لازم تقرر النهارده. اعرف موقفك الأول، وبعدين نتكلم.', "You don't have to decide today. Know where you stand first, then we talk.")}</p>
      <p className="mt-3 max-w-2xl text-ink-soft leading-relaxed">
        {tx(
          'قبل ما تقرر أي حاجة: بنقولك لو لغيت هترجعلك كام وامتى، ولو بعت أو بدّلت هتقبض كام، ونصيحتنا الصريحة — حتى لو الأحسن إنك تكمّل.',
          "Before you decide anything: what cancelling returns and when, what selling or swapping pays, and our honest advice — even if keeping it is best.",
        )}
      </p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-ink">
        <Lock className="w-4 h-4" />
        {tx('من غير أي التزام. وحدتك مش هتتعرض للبيع.', "No commitment. Your unit won't be listed.")}
      </p>

      <div className="mt-8 grid lg:grid-cols-[1fr_20rem] gap-6 items-start">
        <form onSubmit={submit} noValidate className="card p-5 sm:p-8 space-y-6">
          {errors.length > 0 && (
            <div role="alert" className="rounded-xl bg-danger-soft p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <p className="text-sm text-ink-soft">
                <span className="font-semibold text-danger">{tx('ناقص: ', 'Missing: ')}</span>
                {errors.join('، ')}
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('المطور', 'Developer')} required htmlFor="st-dev">
              <input id="st-dev" value={developer} onChange={(e) => setDeveloper(e.target.value)} placeholder={tx('مثلاً: بالم هيلز', 'e.g. Palm Hills')} className="field" />
            </Field>
            <Field label={tx('الكمبوند', 'Compound')} htmlFor="st-cmp">
              <input id="st-cmp" value={compound} onChange={(e) => setCompound(e.target.value)} placeholder={tx('مثلاً: بالم هيلز نيو كايرو', 'e.g. Palm Hills New Cairo')} className="field" />
            </Field>
            <Field label={tx('سعر الوحدة في العقد', 'Contract price')} required htmlFor="st-price">
              <MoneyInput id="st-price" value={contract} onChange={setContract} placeholder="5,000,000" />
            </Field>
            <Field label={tx('دفعت كام لحد النهارده؟', 'Paid so far')} required htmlFor="st-paid" hint={tx('المقدم + الأقساط اللي اتدفعت', 'Down payment + paid installments')}>
              <MoneyInput id="st-paid" value={paid} onChange={setPaid} placeholder="1,500,000" />
            </Field>
          </div>

          <Toggle
            tone="danger"
            label={tx('عليك أقساط متأخرة أو غرامات؟', 'Any overdue installments or fines?')}
            hint={tx('قول بصراحة — بيخلّي الكشف أدق', 'Be upfront — it makes the statement accurate')}
            on={late}
            onChange={setLate}
          >
            <Field label={tx('حوالي كام؟ (لو تعرف)', 'Roughly how much? (if you know)')} htmlFor="st-fines">
              <MoneyInput id="st-fines" value={lateAmount} onChange={setLateAmount} placeholder="80,000" />
            </Field>
          </Toggle>

          <FilePick
            label={tx('صورة العقد (اختياري)', 'Contract photo (optional)')}
            hint={tx('بتخلّي الكشف أدق وأسرع — ومش بتظهر لحد', 'Makes it faster and more accurate — never shown to anyone')}
            value={contractFile}
            onChange={setContractFile}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('اسمك', 'Your name')} required htmlFor="st-name">
              <input id="st-name" value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" />
            </Field>
            <Field label={tx('موبايل (واتساب)', 'Mobile (WhatsApp)')} required htmlFor="st-phone" hint={tx('الكشف هيوصلك عليه', "We'll send the statement here")}>
              <input
                id="st-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                autoComplete="tel"
                className={`field ${isRTL ? 'text-right' : 'text-left'}`}
              />
            </Field>
          </div>

          <button type="submit" className="btn-primary w-full min-h-14 text-base">
            <Send className="w-5 h-5" />
            {tx('ابعتلي كشف الحساب', 'Send me my statement')}
          </button>
          <p className="-mt-3 text-center text-sm text-muted">
            {tx('بالإرسال إنت موافق على ', 'By sending you agree to the ')}
            <button type="button" onClick={() => onNavigate('privacy')} className="font-semibold text-ink hover:underline">
              {tx('سياسة الخصوصية', 'Privacy policy')}
            </button>
          </p>
        </form>

        {/* A first look while they type — the real statement comes from the advisor. */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="card p-6">
            <p className="font-bold text-ink">{tx('نظرة أولى', 'A first look')}</p>
            {validMoney ? (
              <dl className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl bg-paper p-3">
                  <dt className="flex items-center gap-1.5 text-muted">
                    <TrendingDown className="w-4 h-4" />
                    {tx('لو لغيت مع المطور', 'Cancel with the developer')}
                  </dt>
                  <dd className="num font-display mt-1 text-2xl font-bold text-muted line-through decoration-2">{money(cancelBack, language)}</dd>
                  <p className="text-xs text-muted">{tx('وغالباً على أقساط لسنين', 'usually paid back over years')}</p>
                </div>
                <div className="rounded-xl bg-brand text-white p-3">
                  <dt className="text-white/70">{tx('لو بعت عن طريقنا', 'Sell through us')}</dt>
                  <dd className="num font-display mt-1 text-2xl font-bold">
                    {money(sellBack, language)} <span className="text-sm font-medium text-white/60">{currency(language)}</span>
                  </dd>
                  <p className="text-xs text-white/70">
                    {tx('كاش يوم التنازل', 'cash on transfer day')}
                    {fines > 0 && tx(` · بعد المتأخرات ${money(fines, language)}`, ` · after ${money(fines, language)} arrears`)}
                  </p>
                </div>
                <p className="text-xs text-muted">{tx('حسبة تقريبية. الكشف بيتعمل على عقدك الفعلي.', 'A rough estimate. The statement uses your actual contract.')}</p>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted">{tx('اكتب سعر العقد والمدفوع وهنوريك الفرق', 'Enter the contract price and amount paid to see the difference')}</p>
            )}
          </div>
          <div className="rounded-xl bg-brand-soft p-4 text-sm text-ink space-y-2">
            <p className="font-semibold">{tx('الكشف فيه إيه؟', "What's in it?")}</p>
            <ul className="space-y-1.5 text-ink-soft">
              <li>• {tx('الإلغاء هيرجعلك كام، وامتى', 'What cancelling returns, and when')}</li>
              <li>• {tx('البيع عن طريقنا هيقبّضك كام', 'What selling through us pays')}</li>
              <li>• {tx('تبديل بوحدة قسطها أقل', 'A swap to a lower monthly')}</li>
              <li>• {tx('لو كمّلت: قسطك والباقي', 'If you keep it: your monthly and balance')}</li>
              <li>• {tx('ونصيحتنا الصريحة', 'And our honest advice')}</li>
            </ul>
          </div>
          <a
            href={whatsappLink(tx('عايز كشف حساب لوحدتي', "I'd like a statement for my unit"))}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-ink-soft hover:text-ink hover:border-ink-soft"
          >
            <MessageCircle className="w-4 h-4" />
            {tx('أو اطلبه على واتساب', 'Or ask on WhatsApp')}
          </a>
        </aside>
      </div>
    </div>
  );
};
