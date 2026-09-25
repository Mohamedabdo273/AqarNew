import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, TrendingDown, Clock, ScrollText, Send, Check, Repeat, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useRequests } from '../context/RequestsContext';
import { PROPERTY_TYPES, REGIONS, cancellationLoss, currency, money } from '../lib/unitHelpers';
import { EMPTY_SELL_FORM, SellForm, isValidPhone, netToSeller } from '../lib/sellForm';
import { ChipSelect, CheckBox, Field, MoneyInput, Toggle } from '../components/sell/FormBits';
import { whatsappLink } from '../config/brand';

interface SellUnitPageProps {
  onSubmitted: (code: string) => void;
  onOpenRules: () => void;
  onNavigate: (page: PageId) => void;
}

const DRAFT_KEY = 'wahdety_sell_quick_draft_v1';

/**
 * Phase 1 of listing: only what we need to call the seller back.
 * Everything else is filled later from "My requests" (or by an advisor on the phone).
 */
export const SellUnitPage: React.FC<SellUnitPageProps> = ({ onSubmitted, onOpenRules, onNavigate }) => {
  const { language, tx, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const { createRequest } = useRequests();
  const [form, setForm] = useState<SellForm>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? { ...EMPTY_SELL_FORM, ...JSON.parse(raw) } : EMPTY_SELL_FORM;
    } catch {
      return EMPTY_SELL_FORM;
    }
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* draft is a convenience only */
    }
  }, [form]);

  const set = <K extends keyof SellForm>(key: K, value: SellForm[K]) => setForm((f) => ({ ...f, [key]: value }));
  const L = <T extends string>(list: { ar: T; en: string }[]) => list.map((o) => ({ value: o.ar, label: language === 'ar' ? o.ar : o.en }));

  const submit = () => {
    const e: string[] = [];
    if (!form.developer.trim()) e.push(tx('المطور', 'Developer'));
    if (!form.compound.trim()) e.push(tx('الكمبوند', 'Compound'));
    if (!form.region) e.push(tx('المنطقة', 'Area'));
    if (!form.propertyType) e.push(tx('النوع', 'Type'));
    if (!form.contractPrice) e.push(tx('سعر العقد', 'Contract price'));
    if (!form.paidAmount) e.push(tx('المدفوع', 'Amount paid'));
    if (form.paidAmount > form.contractPrice && form.contractPrice) e.push(tx('المدفوع أكبر من سعر العقد', 'Paid is more than contract price'));
    if (!form.ownerName.trim()) e.push(tx('اسمك', 'Your name'));
    if (!isValidPhone(form.ownerPhone)) e.push(tx('موبايل صحيح (01xxxxxxxxx)', 'Valid mobile (01xxxxxxxxx)'));
    if (form.willingToDiscount && !form.discountAmount) e.push(tx('قيمة الخصم', 'Discount amount'));
    if (form.willingToDiscount && form.discountAmount >= form.paidAmount && form.paidAmount) e.push(tx('الخصم أكبر من المدفوع', 'Discount is more than what you paid'));
    if (!form.ackOwner || !form.ackNoOverprice || !form.ackDeclareDues) e.push(tx('الموافقة على القواعد التلاتة', 'Agree to the three rules'));
    setErrors(e);
    if (e.length) {
      document.getElementById('sell-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const req = createRequest({ ...form, developer: form.developer.trim(), compound: form.compound.trim(), ownerName: form.ownerName.trim() });
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    onSubmitted(req.code);
  };

  const validMoney = form.paidAmount > 0 && form.paidAmount <= form.contractPrice;
  const { net, discount, fines } = netToSeller(form);

  return (
    <div id="sell-top" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 scroll-mt-20">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">{tx('اعرض وحدتك في دقيقة', 'List your unit in a minute')}</h1>
      <p className="mt-2 flex items-center gap-2 text-muted">
        <Clock className="w-4 h-4" />
        {tx('مجاناً · من غير عمولة عليك · وباقي البيانات بعدين', 'Free · no fee for you · the rest later')}
      </p>

      {/* What the seller can do here — one glanceable line, so the form starts on the first screen. */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
        {[
          tx('تبيع باللي دفعته، أو تبدّلها بوحدة تانية', 'Sell for what you paid, or swap it'),
          tx('تعمل خصم أو تخليها قابلة للتفاوض عشان تتباع أسرع', 'Add a discount or accept offers to sell faster'),
          tx('اسمك ورقمك مش بيتنشروا', 'Your name and number stay private'),
        ].map((b) => (
          <li key={b} className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-ink shrink-0" strokeWidth={2.5} />
            {b}
          </li>
        ))}
      </ul>

      {/* For owners who are already behind — the first worry, answered before the form. */}
      <p className="mt-5 flex items-start gap-3 rounded-2xl border-2 border-ink bg-surface px-4 py-3.5 text-[15px] text-ink max-w-3xl">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <span>
          <b>{tx('اتأخرت في الأقساط أو عليك غرامات؟ ', 'Behind on installments or have fines? ')}</b>
          {tx('عادي، بنبيعها برضه. المتأخرات بتتخصم من فلوسك يوم التنازل، ومش مطلوب منك تدفع حاجة دلوقتي.', "That's fine — we still sell it. Arrears come out of your payout on transfer day; nothing to pay now.")}
        </span>
      </p>

      <div className="mt-6 grid lg:grid-cols-[1fr_20rem] gap-6 items-start">
        <div className="card p-5 sm:p-8 space-y-7">
          {errors.length > 0 && (
            <div role="alert" className="rounded-2xl bg-danger-soft p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <p className="text-sm text-ink-soft">
                <span className="font-semibold text-danger">{tx('ناقص: ', 'Missing: ')}</span>
                {errors.join('، ')}
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('المطور', 'Developer')} required htmlFor="dev">
              <input id="dev" value={form.developer} onChange={(e) => set('developer', e.target.value)} placeholder={tx('مثلاً: بالم هيلز', 'e.g. Palm Hills')} className="field" />
            </Field>
            <Field label={tx('الكمبوند', 'Compound')} required htmlFor="cmp">
              <input id="cmp" value={form.compound} onChange={(e) => set('compound', e.target.value)} placeholder={tx('مثلاً: بالم هيلز نيو كايرو', 'e.g. Palm Hills New Cairo')} className="field" />
            </Field>
          </div>

          <Field label={tx('المنطقة', 'Area')} required>
            <ChipSelect options={L(REGIONS)} value={form.region} onChange={(v) => set('region', v)} />
          </Field>
          <Field label={tx('النوع', 'Type')} required>
            <ChipSelect options={L(PROPERTY_TYPES)} value={form.propertyType} onChange={(v) => set('propertyType', v)} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('سعر الوحدة في العقد', 'Contract price')} required htmlFor="price">
              <MoneyInput id="price" value={form.contractPrice} onChange={(n) => set('contractPrice', n)} placeholder="5,000,000" />
            </Field>
            <Field label={tx('دفعت كام لحد النهارده؟', 'Paid so far')} required htmlFor="paid" hint={tx('المقدم + الأقساط اللي اتدفعت', 'Down payment + paid installments')}>
              <MoneyInput id="paid" value={form.paidAmount} onChange={(n) => set('paidAmount', n)} placeholder="1,500,000" />
            </Field>
          </div>
          <Toggle
            tone="danger"
            label={tx('عليك أقساط متأخرة أو غرامات؟', 'Any overdue installments or fines?')}
            hint={tx('قول بصراحة — ده مش هيوقف البيع، وبيخلّي الحسبة أدق', "Be upfront — it won't stop the sale, and keeps the maths honest")}
            on={form.hasLatePenalties}
            onChange={(v) => set('hasLatePenalties', v)}
          >
            <Field label={tx('حوالي كام؟ (لو تعرف)', 'Roughly how much? (if you know)')} htmlFor="fines">
              <MoneyInput id="fines" value={form.latePenaltiesAmount} onChange={(n) => set('latePenaltiesAmount', n)} placeholder="80,000" />
            </Field>
          </Toggle>
          <Field
            label={tx('سعر نفس الوحدة من المطور النهارده (اختياري)', "Developer's price for the same unit today (optional)")}
            htmlFor="market"
            hint={tx('ده اللي بيبيّن للمشتري هيوفّر قد إيه. مش عارفه؟ سيبه، واحنا هنجيبه.', "It shows buyers how much they save. Don't know it? Leave it — we'll find out.")}
          >
            <MoneyInput id="market" value={form.currentMarketPrice} onChange={(n) => set('currentMarketPrice', n)} placeholder="9,000,000" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('اسمك زي العقد', 'Name as in contract')} required htmlFor="oname">
              <input id="oname" value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} className="field" />
            </Field>
            <Field label={tx('موبايل (واتساب)', 'Mobile (WhatsApp)')} required htmlFor="ophone">
              <input
                id="ophone"
                value={form.ownerPhone}
                onChange={(e) => set('ownerPhone', e.target.value)}
                inputMode="tel"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                className={`field ${isRTL ? 'text-right' : 'text-left'}`}
              />
            </Field>
          </div>

          {/* Our own levers, shown before sending — not buried in the details later. */}
          <div className="space-y-3">
            <p className="font-bold text-ink">
              {tx('عايز تبيع أسرع؟', 'Want to sell faster?')} <span className="text-sm font-medium text-muted">{tx('(اختياري)', '(optional)')}</span>
            </p>
            <Toggle
              tone="accent"
              label={tx('أعمل خصم من اللي دفعته', 'Take a discount off what I paid')}
              hint={tx('وحدتك هتظهر بعلامة الخصم وفي الرئيسية', 'Your unit gets the discount badge and shows on the home page')}
              on={form.willingToDiscount}
              onChange={(v) => set('willingToDiscount', v)}
            >
              <Field label={tx('قيمة الخصم', 'Discount amount')} required htmlFor="disc">
                <MoneyInput id="disc" value={form.discountAmount} onChange={(n) => set('discountAmount', n)} placeholder="100,000" />
              </Field>
            </Toggle>
            <Toggle
              label={tx('السعر قابل للتفاوض', 'Open to offers')}
              hint={tx('المشتري يقدر يعرض سعر أقل شوية، والقرار في الآخر ليك', 'Buyers can offer a little less — you decide')}
              on={form.negotiable}
              onChange={(v) => set('negotiable', v)}
            />
            <button type="button" onClick={() => onNavigate('swap')} className="w-full flex items-center gap-3 rounded-2xl border border-line p-4 text-start hover:border-ink-soft transition-colors">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-soft text-ink shrink-0">
                <Repeat className="w-5 h-5" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-ink">{tx('ولا تحب تبدّلها بوحدة تانية؟', 'Rather swap it for another unit?')}</span>
                <span className="block text-sm text-muted">{tx('من غير ما تبيع الأول — تدفع أو تاخد الفرق بس', 'No selling first — just settle the difference')}</span>
              </span>
              <Arrow className="w-4 h-4 text-muted" />
            </button>
          </div>

          {/* The three seller rules that matter most, agreed to right where they apply. */}
          <div className="rounded-2xl bg-paper p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-ink">{tx('3 قواعد لازم توافق عليها', '3 rules to agree to')}</p>
              <button type="button" onClick={onOpenRules} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                <ScrollText className="w-4 h-4" />
                {tx('كل القواعد', 'All rules')}
              </button>
            </div>
            <CheckBox checked={form.ackOwner} onChange={(v) => set('ackOwner', v)}>
              <b>{tx('أنا المالك', "I'm the owner")}</b> — {tx('العقد باسمي أو معايا توكيل رسمي. مش بنقبل سماسرة.', 'the contract is in my name or I hold a formal POA. No brokers.')}
            </CheckBox>
            <CheckBox checked={form.ackNoOverprice} onChange={(v) => set('ackNoOverprice', v)}>
              <b>{tx('مفيش أوفر برايس', 'No overprice')}</b> — {tx('هاخد اللي دفعته بس، ومش هاخد عربون برّه', "I'll take only what I paid, and no side deposits")}
            </CheckBox>
            <CheckBox checked={form.ackDeclareDues} onChange={(v) => set('ackDeclareDues', v)}>
              <b>{tx('هقول على المديونية', "I'll declare dues")}</b> — {tx('أي أقساط متأخرة أو غرامات', 'any overdue installments or fines')}
            </CheckBox>
          </div>

          <button onClick={submit} className="btn-primary w-full min-h-14 text-base">
            <Send className="w-5 h-5" />
            {tx('ابعت طلبي', 'Send my request')}
          </button>
          <p className="-mt-3 text-center text-sm text-muted">
            {tx('بإرسال الطلب إنت موافق على ', 'By sending you agree to the ')}
            <button type="button" onClick={() => onNavigate('terms')} className="text-brand font-semibold hover:underline">
              {tx('الشروط والأحكام', 'Terms')}
            </button>
            {tx(' و', ' and ')}
            <button type="button" onClick={() => onNavigate('privacy')} className="text-brand font-semibold hover:underline">
              {tx('سياسة الخصوصية', 'Privacy policy')}
            </button>
          </p>
          <a
            href={whatsappLink(tx('عايز أعرض وحدتي', "I'd like to list my unit"))}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-line py-3 text-sm font-semibold text-ink-soft hover:text-ink hover:border-ink-soft transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {tx('مش حابب تملا فورم؟ ابعتلنا على واتساب', "Rather not fill a form? Message us on WhatsApp")}
          </a>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="card p-6">
            <p className="font-bold text-ink">{tx('هتسترد كام؟', "What you'll get back")}</p>
            {validMoney ? (
              <>
                <p className="num font-display mt-3 text-4xl font-extrabold text-ink">{money(net, language)}</p>
                <p className="text-sm text-muted">
                  {currency(language)} · {tx('من غير عمولة', 'no fee')}
                  {discount > 0 && tx(` · بعد خصمك ${money(discount, language)}`, ` · after your ${money(discount, language)} discount`)}
                  {fines > 0 && tx(` · بعد المتأخرات ${money(fines, language)}`, ` · after ${money(fines, language)} arrears`)}
                </p>
                <div className="mt-5 rounded-2xl bg-danger-soft p-4 flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-danger shrink-0" />
                  <p className="text-sm text-ink-soft">
                    {tx('لو لغيت مع المطور ممكن تخسر', 'Cancelling could cost you')}{' '}
                    <span className="num font-bold text-danger">{money(cancellationLoss(form.contractPrice, form.paidAmount), language)}</span>
                  </p>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted">{tx('اكتب سعر العقد والمدفوع وهنحسبلك', 'Enter the contract price and amount paid')}</p>
            )}
          </div>
          <div className="rounded-2xl bg-brand-soft p-4 text-sm text-brand-ink space-y-2">
            <p className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {tx('إيه اللي هيحصل بعد كده؟', 'What happens next?')}
            </p>
            <p>{tx('هنكلمك خلال ساعتين، وتقدر تكمّل باقي البيانات من "طلباتي" أو مع المستشار في التليفون.', "We'll call within 2 hours. Finish the details from \"My requests\" or with your advisor on the phone.")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
