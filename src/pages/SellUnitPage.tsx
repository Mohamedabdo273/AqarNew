import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, TrendingDown, Clock, ScrollText, Send, Check, UserCheck } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useRequests } from '../context/RequestsContext';
import { PROPERTY_TYPES, REGIONS, cancellationLoss, currency, money } from '../lib/unitHelpers';
import { EMPTY_SELL_FORM, SellForm, isValidPhone } from '../lib/sellForm';
import { ChipSelect, CheckBox, Field, MoneyInput } from '../components/sell/FormBits';

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
    if (!form.contractPrice) e.push(tx('سعر العقد', 'Contract price'));
    if (!form.paidAmount) e.push(tx('المدفوع', 'Amount paid'));
    if (form.paidAmount > form.contractPrice && form.contractPrice) e.push(tx('المدفوع أكبر من سعر العقد', 'Paid is more than contract price'));
    if (!form.ownerName.trim()) e.push(tx('اسمك', 'Your name'));
    if (!isValidPhone(form.ownerPhone)) e.push(tx('موبايل صحيح (01xxxxxxxxx)', 'Valid mobile (01xxxxxxxxx)'));
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

  return (
    <div id="sell-top" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 scroll-mt-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('عاوز تخرج من وحدتك؟', 'Want out of your unit?')}</h1>
      <p className="mt-2 flex items-center gap-2 text-muted">
        <Clock className="w-4 h-4" />
        {tx('دقيقة واحدة · مجاناً · وباقي البيانات بعدين', 'One minute · free · the rest later')}
      </p>

      {/* What the seller gets — one glanceable line, so the form starts on the first screen. */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
        {[
          tx('مراجعة حقيقية لعقدك', 'Real contract review'),
          tx('مقارنة الإلغاء قصاد التنازل', 'Cancel vs transfer compared'),
          tx('نصيحة صريحة', 'Honest advice'),
          tx('صفر عمولة عليك', 'Zero fee for you'),
        ].map((b) => (
          <li key={b} className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-brand shrink-0" strokeWidth={2.5} />
            {b}
          </li>
        ))}
      </ul>

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

          <Field label={tx('المنطقة', 'Area')}>
            <ChipSelect options={L(REGIONS)} value={form.region} onChange={(v) => set('region', v)} />
          </Field>
          <Field label={tx('النوع', 'Type')}>
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

          {/* The three seller rules that matter most, agreed to right where they apply. */}
          <div className="rounded-2xl bg-paper p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold text-ink">{tx('3 قواعد لازم توافق عليها', '3 rules to agree to')}</p>
              <button type="button" onClick={onOpenRules} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                <ScrollText className="w-4 h-4" />
                {tx('كل القواعد', 'All rules')}
              </button>
            </div>
            <p className="flex items-start gap-2 rounded-xl bg-gold-soft px-3 py-2.5 text-sm text-ink">
              <UserCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>
                <b>{tx('ملّاك بس. ', 'Owners only. ')}</b>
                {tx('بنتعامل مع صاحب الوحدة مباشرة، ومش بنقبل سماسرة.', 'We deal directly with the owner — no brokers.')}
              </span>
            </p>
            <CheckBox checked={form.ackOwner} onChange={(v) => set('ackOwner', v)}>
              <b>{tx('أنا المالك', "I'm the owner")}</b> — {tx('العقد باسمي أو معايا توكيل رسمي', 'the contract is in my name or I hold a formal POA')}
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
        </div>

        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="card p-6">
            <p className="font-bold text-ink">{tx('هتسترد كام؟', "What you'll get back")}</p>
            {validMoney ? (
              <>
                <p className="num mt-3 text-4xl font-bold text-brand">{money(form.paidAmount, language)}</p>
                <p className="text-sm text-muted">{currency(language)} · {tx('من غير عمولة', 'no fee')}</p>
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
