import React, { useState } from 'react';
import {
  ClipboardCheck,
  Send,
  Lock,
  TrendingDown,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Scale,
  EyeOff,
  Building2,
  FileText,
  Clock,
  Coins
} from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { whatsappLink } from '../config/brand';
import { errorText, sendStatement } from '../services/api';
import { CANCELLATION_PENALTY_MIN_RATE, cancellationLoss, currency, money } from '../lib/unitHelpers';
import { isValidPhone } from '../lib/sellForm';
import { Field, FilePick, MoneyInput, Toggle } from '../components/sell/FormBits';
import { FormError } from '../components/FormError';

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
  const [contractUpload, setContractUpload] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validMoney = contract > 0 && paid > 0 && paid <= contract;
  const fines = late ? lateAmount : 0;
  // The developer deducts 10–15% of the contract, so what comes back is a range.
  const cancelBackMin = validMoney ? paid - cancellationLoss(contract, paid) : 0;
  const cancelBack = validMoney ? paid - cancellationLoss(contract, paid, CANCELLATION_PENALTY_MIN_RATE) : 0;
  const sellBack = validMoney ? Math.max(0, paid - fines) : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
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
    // Save draft for user convenience
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
    setSending(true);
    setSendError('');
    try {
      await sendStatement(
        {
          name: name.trim(),
          phone: phone.replace(/\s/g, ''),
          developer: developer.trim(),
          compound: compound.trim() || undefined,
          contractPrice: contract,
          paidAmount: paid,
          hasLatePenalties: late,
          latePenaltiesAmount: late ? lateAmount : 0,
        },
        contractUpload,
      );
      onSent();
    } catch (err) {
      setSendError(errorText(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="statement-top" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 scroll-mt-32">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface to-brand-soft/25 border border-line p-6 sm:p-10 shadow-sm mb-8 sm:mb-10">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 end-0 -mt-12 -me-12 w-72 h-72 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft/90 border border-brand/20 px-3.5 py-1 text-xs font-bold text-brand mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>{tx('خدمة استشارية محايدة 100% · مجاناً بالكامل', '100% Unbiased Advisory · Completely Free')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            {tx('كشف حساب وحدتك — مجاناً', 'Your unit statement — free')}
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-lg sm:text-xl font-bold text-accent leading-snug">
            {tx('مش لازم تقرر النهارده. اعرف موقفك الأول، وبعدين نتكلم.', "You don't have to decide today. Know where you stand first, then we talk.")}
          </p>

          {/* Core Paragraph */}
          <p className="mt-3 text-base sm:text-lg text-ink-soft leading-relaxed">
            {tx(
              'قبل ما تقرر أي حاجة: بنقولك لو لغيت هترجعلك كام وامتى، ولو بعت أو بدّلت هتقبض كام، ونصيحتنا الصريحة — حتى لو الأحسن إنك تكمّل.',
              "Before you decide anything: what cancelling returns and when, what selling or swapping pays, and our honest advice — even if keeping it is best."
            )}
          </p>

          {/* 3 Visual Micro-Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-paper/90 border border-line p-3.5 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0 mt-0.5">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">{tx('لو لغيت مع المطور', 'If you cancel')}</p>
                <p className="text-[11px] text-ink-soft mt-0.5 leading-snug">
                  {tx('هيرجعلك كام بالضبط، ومواعيد وشروط الاسترداد', 'Exact refund amount, schedule & terms')}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-paper/90 border border-line p-3.5 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">{tx('لو بعت أو بدّلت', 'If you sell or swap')}</p>
                <p className="text-[11px] text-ink-soft mt-0.5 leading-snug">
                  {tx('الكاش اللي هتقبضه في إيدك وفارق التوفير في الأقساط', 'Cash in hand & monthly savings')}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-paper/90 border border-line p-3.5 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">{tx('نصيحتنا الصريحة', 'Our honest advice')}</p>
                <p className="text-[11px] text-ink-soft mt-0.5 leading-snug">
                  {tx('رأي مالي حيادي حتى لو الأنسب إنك تكمّل', 'Unbiased advice even if keeping it is best')}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Zero-Commitment Guarantee Bar */}
          <div className="mt-6 pt-5 border-t border-line/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="inline-flex items-center gap-2.5 text-ink">
              <div className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm sm:text-base text-ink">
                {tx('من غير أي التزام. وحدتك مش هتتعرض للبيع.', "No commitment. Your unit won't be listed.")}
              </span>
            </div>

            <div className="flex items-center gap-3 text-muted text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {tx('سرية تامة 100%', '100% Confidential')}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-ink-soft">
                <EyeOff className="w-3.5 h-3.5 text-brand" />
                {tx('لا يتم نشر أي شيء', 'Never published')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Sidebar */}
      <div className="grid lg:grid-cols-[1fr_21rem] gap-8 items-start">
        <form onSubmit={submit} noValidate className="card p-6 sm:p-8 space-y-6 shadow-sm border border-line bg-surface">
          <FormError title={tx('برجاء استكمال البيانات الآتية:', 'Please complete:')} messages={errors} />

          {/* Section 1: Property Details */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-line">
              <div className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-ink text-base">
                {tx('بيانات الوحدة في العقد', 'Unit & Contract Info')}
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={tx('المطور', 'Developer')} required htmlFor="st-dev">
                <input
                  id="st-dev"
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  placeholder={tx('مثلاً: بالم هيلز', 'e.g. Palm Hills')}
                  className="field"
                />
              </Field>
              <Field label={tx('الكمبوند', 'Compound')} htmlFor="st-cmp">
                <input
                  id="st-cmp"
                  value={compound}
                  onChange={(e) => setCompound(e.target.value)}
                  placeholder={tx('مثلاً: بالم هيلز نيو كايرو', 'e.g. Palm Hills New Cairo')}
                  className="field"
                />
              </Field>
              <Field label={tx('سعر الوحدة في العقد', 'Contract price')} required htmlFor="st-price">
                <MoneyInput id="st-price" value={contract} onChange={setContract} placeholder="5,000,000" />
              </Field>
              <Field
                label={tx('دفعت كام لحد النهارده؟', 'Paid so far')}
                required
                htmlFor="st-paid"
                hint={tx('المقدم + الأقساط اللي اتدفعت', 'Down payment + paid installments')}
              >
                <MoneyInput id="st-paid" value={paid} onChange={setPaid} placeholder="1,500,000" />
              </Field>
            </div>
          </div>

          {/* Section 2: Financial Dues & Fines */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-line">
              <div className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-ink text-base">
                {tx('الموقف المالي والأقساط المتأخرة', 'Financial Status & Arrears')}
              </h3>
            </div>

            <Toggle
              tone="danger"
              label={tx('عليك أقساط متأخرة أو غرامات؟', 'Any overdue installments or fines?')}
              hint={tx('قول بصراحة — بيخلّي الكشف أدق ومطابق للواقع', 'Be upfront — makes the calculation accurate')}
              on={late}
              onChange={setLate}
            >
              <Field label={tx('حوالي كام؟ (لو تعرف)', 'Roughly how much? (if you know)')} htmlFor="st-fines">
                <MoneyInput id="st-fines" value={lateAmount} onChange={setLateAmount} placeholder="80,000" />
              </Field>
            </Toggle>
          </div>

          {/* Section 3: Documents */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-line">
              <div className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-ink text-base">
                {tx('مستند العقد (اختياري)', 'Contract Document (Optional)')}
              </h3>
            </div>

            <FilePick
              label={tx('صورة العقد أو كشف حساب المطور (اختياري)', 'Contract photo or developer ledger (optional)')}
              hint={tx('بتخلّي الكشف أدق وأسرع — وسريّة تماماً مش بتظهر لحد', 'Makes the statement faster and more accurate — 100% confidential')}
              value={contractFile}
              onChange={setContractFile}
              onFile={setContractUpload}
            />
          </div>

          {/* Section 4: Contact Information */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-line">
              <div className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-ink text-base">
                {tx('بيانات التواصل لاستلام الكشف', 'Contact Info to Receive Statement')}
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={tx('اسمك', 'Your name')} required htmlFor="st-name">
                <input
                  id="st-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tx('مثلاً: أحمد محمود', 'e.g. Ahmed Mahmoud')}
                  className="field"
                  autoComplete="name"
                />
              </Field>
              <Field
                label={tx('رقم الموبايل (واتساب)', 'Mobile / WhatsApp')}
                required
                htmlFor="st-phone"
                hint={tx('الكشف والتقرير المالي هيوصلك عليه', 'Detailed statement will be sent here')}
              >
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
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button type="submit" disabled={sending} className="btn-primary w-full min-h-14 text-base font-bold shadow-md hover:shadow-lg transition">
              <Send className="w-5 h-5" />
              <span>{sending ? tx('بنبعت...', 'Sending...') : tx('ابعتلي كشف الحساب مجاناً', 'Send me my free statement')}</span>
            </button>
            <FormError className="mt-4" messages={sendError} />
            <p className="mt-3 text-center text-xs text-muted">
              {tx('بالإرسال إنت موافق على ', 'By submitting you agree to the ')}
              <button
                type="button"
                onClick={() => onNavigate('privacy')}
                className="font-semibold text-ink hover:underline"
              >
                {tx('سياسة الخصوصية وسرية البيانات', 'Privacy & Data Protection')}
              </button>
            </p>
          </div>
        </form>

        {/* Sidebar: Live Preview & Value Summary */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          {/* Live Preview Card */}
          <div className="card p-5 sm:p-6 border border-line bg-surface shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <span className="font-bold text-ink text-sm sm:text-base flex items-center gap-2">
                <Coins className="w-4 h-4 text-brand" />
                {tx('نظرة أولية فورية', 'Instant preview')}
              </span>
              <span className="text-[11px] font-semibold text-muted bg-paper px-2 py-0.5 rounded-full">
                {tx('حسبة تقديرية', 'Estimate')}
              </span>
            </div>

            {validMoney ? (
              <div className="mt-4 space-y-3.5 text-sm">
                <div className="rounded-2xl bg-paper p-3.5 border border-line/60">
                  <div className="flex items-center justify-between text-muted text-xs">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-danger" />
                      {tx('لو لغيت مع المطور', 'Cancel with developer')}
                    </span>
                    <span className="text-[10px] text-danger font-semibold">{tx('خصم وخسارة', 'Loss')}</span>
                  </div>
                  <dd className="num font-display mt-1 text-xl font-bold text-muted line-through decoration-danger decoration-2">
                    {money(cancelBackMin, language)} – {money(cancelBack, language)}
                  </dd>
                  <p className="text-[11px] text-muted mt-1 leading-snug">
                    {tx('المطور بيخصم من 10% لـ 15% من سعر الوحدة، وغالباً الاسترداد بيقعد لسنين', 'The developer deducts 10–15% of the unit price, and refunds often take years')}
                  </p>
                </div>

                <div className="rounded-2xl bg-brand text-white p-4 shadow-sm">
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <span>{tx('لو بعت عن طريقنا كاش', 'Sell through us cash')}</span>
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {tx('أفضل عائد', 'Best Return')}
                    </span>
                  </div>
                  <dd className="num font-display mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                    {money(sellBack, language)}{' '}
                    <span className="text-sm font-medium text-white/70">{currency(language)}</span>
                  </dd>
                  <p className="text-xs text-white/80 mt-1 leading-snug">
                    {tx('كاش فوري يوم التنازل في بنك المطور', 'Cash on transfer day at developer')}
                    {fines > 0 && tx(` · بعد تسوية المتأخرات ${money(fines, language)}`, ` · after ${money(fines, language)} arrears`)}
                  </p>
                </div>

                <p className="text-[11px] text-muted text-center pt-1">
                  {tx('الكشف الكامل بيتعمل على عقدك الفعلي وجدول أقساطك.', 'Full statement analyzes your actual contract schedule.')}
                </p>
              </div>
            ) : (
              <div className="mt-4 text-center py-6 px-2 text-ink-soft">
                <FileText className="w-8 h-8 text-brand/30 mx-auto mb-2" />
                <p className="text-xs font-semibold text-ink">
                  {tx('اكتب سعر العقد والمدفوع', 'Enter contract price & amount paid')}
                </p>
                <p className="text-[11px] text-muted mt-1">
                  {tx('وهنوريك الفرق بين الإلغاء والبيع فوري هنا', 'We will show you the difference right here')}
                </p>
              </div>
            )}
          </div>

          {/* What's In The Statement Checklist */}
          <div className="rounded-2xl bg-brand-soft/60 border border-brand/20 p-5 text-sm text-ink space-y-3">
            <p className="font-bold text-ink flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-brand" />
              <span>{tx('تقرير الكشف فيه إيه بالضبط؟', "What's in the statement?")}</span>
            </p>
            <ul className="space-y-2 text-xs text-ink-soft">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                <span>{tx('الإلغاء مع المطور: هيرجعلك كام بالضبط، وإيه الغرامة ومواعيد الصرف', 'Developer cancellation: exact refund, fine & timeline')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                <span>{tx('البيع عن طريقنا: هتقبض كام كاش في جيبك عند التنازل', 'Exit via platform: cash in hand upon transfer')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                <span>{tx('تبديل الوحدة: خيارات التبديل بوحدة قسطها الشهري أخف', 'Property swap: options to switch to lower installments')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                <span>{tx('لو كملت: حسبة الالتزامات المتبقية وموعد التسليم المتوقع', 'If you continue: remaining balance & delivery timeline')}</span>
              </li>
              <li className="flex items-start gap-2 font-semibold text-brand">
                <Sparkles className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                <span>{tx('نصيحتنا الصريحة: دراسة القرار الأنسب لمصلحتك المالية', 'Our honest advice: the best choice for your finances')}</span>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Option */}
          <a
            href={whatsappLink(tx('مرحباً، محتاج كشف حساب واستشارة لوحدتي', "Hello, I'd like a unit statement and advice"))}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface hover:bg-paper hover:border-brand py-3.5 text-xs font-bold text-ink transition shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>{tx('أو اطلب الكشف مباشرة على واتساب', 'Or request statement via WhatsApp')}</span>
          </a>
        </aside>
      </div>
    </div>
  );
};
