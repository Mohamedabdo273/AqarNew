import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, TrendingDown, Clock, ScrollText, Send, Check, Repeat, MessageCircle, ArrowLeft, ArrowRight, Coins, EyeOff, Calendar, CheckCircle2, X } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useRequests } from '../context/RequestsContext';
import { useUnits } from '../context/UnitsContext';
import { useAuth } from '../context/AuthContext';
import { errorText } from '../services/api';
import { PROPERTY_CATEGORIES, TYPES_BY_CATEGORY, REGIONS, SUB_AREAS, CANCELLATION_PENALTY_MIN_RATE, cancellationLoss, currency, money } from '../lib/unitHelpers';
import { DeliveryStatus } from '../types';
import { EMPTY_SELL_FORM, SellForm, isValidPhone, netToSeller } from '../lib/sellForm';
import { ChipSelect, CheckBox, Field, FilePick, FilePickMany, MoneyInput, Toggle } from '../components/sell/FormBits';
import { whatsappLink } from '../config/brand';

interface SellUnitPageProps {
  onSubmitted: (code: string) => void;
  onOpenRules: () => void;
  onNavigate: (page: PageId) => void;
}

const DRAFT_KEY = 'wahdety_sell_quick_draft_v1';

const DELIVERY_MONTHS = [
  { m: 1, ar: 'يناير', en: 'January' },
  { m: 2, ar: 'فبراير', en: 'February' },
  { m: 3, ar: 'مارس', en: 'March' },
  { m: 4, ar: 'أبريل', en: 'April' },
  { m: 5, ar: 'مايو', en: 'May' },
  { m: 6, ar: 'يونيو', en: 'June' },
  { m: 7, ar: 'يوليو', en: 'July' },
  { m: 8, ar: 'أغسطس', en: 'August' },
  { m: 9, ar: 'سبتمبر', en: 'September' },
  { m: 10, ar: 'أكتوبر', en: 'October' },
  { m: 11, ar: 'نوفمبر', en: 'November' },
  { m: 12, ar: 'ديسمبر', en: 'December' },
];

const DELIVERY_YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032];

/**
 * Phase 1 of listing: only what we need to call the seller back.
 * Everything else is filled later from "My requests" (or by an advisor on the phone).
 */
export const SellUnitPage: React.FC<SellUnitPageProps> = ({ onSubmitted, onOpenRules, onNavigate }) => {
  const { language, tx, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const { createRequest } = useRequests();
  const { showToast } = useUnits();
  const { user } = useAuth();
  const [form, setForm] = useState<SellForm>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      // The draft can't hold the files themselves, so their names are dropped too — otherwise they'd look uploaded.
      return raw
        ? { ...EMPTY_SELL_FORM, ...JSON.parse(raw), contractPages: [], paymentScheduleFile: '', unitPlanFile: '' }
        : EMPTY_SELL_FORM;
    } catch {
      return EMPTY_SELL_FORM;
    }
  });
  // The picked files themselves, uploaded once the request exists.
  const [contractPageFiles, setContractPageFiles] = useState<File[]>([]);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  // Signed in: fill the owner's name and mobile from the account, without overwriting what they typed.
  useEffect(() => {
    if (!user) return;
    const accountName = /\d{6,}/.test(user.fullName) ? '' : user.fullName;
    setForm((f) => ({ ...f, ownerName: f.ownerName || accountName, ownerPhone: f.ownerPhone || user.phone }));
  }, [user]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState<number>(() => {
    const num = Number(form.deliveryStatus?.replace(/\D/g, ''));
    return num >= 2026 ? num : 2027;
  });
  const [pickerMonth, setPickerMonth] = useState<number>(() => {
    const matched = DELIVERY_MONTHS.find((m) => form.deliveryDate?.includes(m.ar) || form.deliveryDate?.includes(m.en));
    return matched ? matched.m : 6;
  });

  useEffect(() => {
    if (!deliveryModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeliveryModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deliveryModalOpen]);

  useEffect(() => {
    if (deliveryModalOpen) {
      if (form.deliveryStatus) {
        const num = Number(form.deliveryStatus.replace(/\D/g, ''));
        if (num >= 2026 && num <= 2035) setPickerYear(num);
      }
      if (form.deliveryDate) {
        const matched = DELIVERY_MONTHS.find((m) => form.deliveryDate.includes(m.ar) || form.deliveryDate.includes(m.en));
        if (matched) setPickerMonth(matched.m);
      }
    }
  }, [deliveryModalOpen, form.deliveryDate, form.deliveryStatus]);

  const handleDeliveredClick = () => {
    set('alreadyDelivered', true);
    set('deliveryStatus', 'استلام فوري');
    set('deliveryDate', language === 'ar' ? 'تم الاستلام بالفعل' : 'Already received');
    setDeliveryModalOpen(false);
  };

  const handleNotDeliveredClick = () => {
    set('alreadyDelivered', false);
    if (form.deliveryStatus === 'استلام فوري') {
      set('deliveryStatus', '');
      set('deliveryDate', '');
    }
    setDeliveryModalOpen(true);
  };

  const STEPS = [
    { n: 1 as const, label: tx('الوحدة', 'The unit') },
    { n: 2 as const, label: tx('الفلوس', 'The money') },
    { n: 3 as const, label: tx('المستندات', 'Documents') },
    { n: 4 as const, label: tx('بياناتك', 'Your details') },
  ];

  /** كل خطوة بتتحقق من حقولها هي بس — عشان محدش يتقالّه "ناقص" على حاجة لسه مشفهاش. */
  const stepErrors = (target: 1 | 2 | 3 | 4): string[] => {
    const e: string[] = [];
    if (target === 1) {
      if (!form.region) e.push(tx('المنطقة', 'Area'));
      if (form.region && !form.subArea) e.push(tx('المنطقة بالتحديد', 'Which part'));
      if (!form.developer.trim()) e.push(tx('المطور', 'Developer'));
      if (!form.compound.trim()) e.push(tx('الكمبوند', 'Compound'));
      if (!form.propertyCategory) e.push(tx('النشاط', 'Activity'));
      if (form.propertyCategory && !form.propertyType) e.push(tx('نوع الوحدة', 'Unit type'));
      if (form.alreadyDelivered === null) e.push(tx('موقف الاستلام (تم الاستلام بالفعل؟)', 'Delivery status (Already received?)'));
      if (form.alreadyDelivered === false && !form.deliveryDate && !form.deliveryStatus) {
        e.push(tx('تحديد تاريخ الاستلام المتوقع', 'Select expected delivery date'));
        setDeliveryModalOpen(true);
      }
    }
    if (target === 2) {
      if (!form.contractPrice) e.push(tx('سعر العقد', 'Contract price'));
      if (!form.paidAmount) e.push(tx('المدفوع', 'Amount paid'));
      if (form.paidAmount > form.contractPrice && form.contractPrice) e.push(tx('المدفوع أكبر من سعر العقد', 'Paid is more than contract price'));
    }
    // المستندات (خطوة 3) اختيارية — مش هنوقف البايع عشان صورة
    if (target === 4) {
      if (!form.ownerName.trim()) e.push(tx('اسمك', 'Your name'));
      if (!isValidPhone(form.ownerPhone)) e.push(tx('موبايل صحيح (01xxxxxxxxx)', 'Valid mobile (01xxxxxxxxx)'));
      if (form.willingToDiscount && !form.discountAmount) e.push(tx('قيمة الخصم', 'Discount amount'));
      if (form.willingToDiscount && form.discountAmount >= form.paidAmount && form.paidAmount) e.push(tx('الخصم أكبر من المدفوع', 'Discount is more than what you paid'));
      if (!form.ackOwner || !form.ackNoOverprice || !form.ackDeclareDues) e.push(tx('الموافقة على القواعد التلاتة', 'Agree to the three rules'));
    }
    return e;
  };

  const backToTop = () => document.getElementById('sell-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const goTo = (target: 1 | 2 | 3 | 4) => {
    setErrors([]);
    setStep(target);
    backToTop();
  };

  const goNext = () => {
    const e = stepErrors(step);
    setErrors(e);
    backToTop();
    if (!e.length && step < 4) setStep((step + 1) as 1 | 2 | 3 | 4);
  };

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* draft is a convenience only */
    }
  }, [form]);

  const set = <K extends keyof SellForm>(key: K, value: SellForm[K]) => setForm((f) => ({ ...f, [key]: value }));
  const L = <T extends string>(list: { ar: T; en: string }[]) => list.map((o) => ({ value: o.ar, label: language === 'ar' ? o.ar : o.en }));

  const submit = async () => {
    if (sending) return;
    // لو فيه نقص في خطوة سابقة، نوديه لها بدل ما نقوله "ناقص" على شاشة مش شايفها
    for (const target of [1, 2, 3, 4] as const) {
      const e = stepErrors(target);
      if (e.length) {
        setStep(target);
        setErrors(e);
        backToTop();
        return;
      }
    }
    setErrors([]);
    setSending(true);
    setSendError('');
    try {
      const { code, failedUploads } = await createRequest(
        { ...form, developer: form.developer.trim(), compound: form.compound.trim(), ownerName: form.ownerName.trim() },
        { contractPages: contractPageFiles, paymentSchedule: scheduleFile, unitPlan: planFile },
      );
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      if (failedUploads > 0) {
        showToast(tx(`طلبك وصل، بس ${failedUploads} ملف ما اترفعش — ارفعه من "حسابي"`, `Request sent, but ${failedUploads} file(s) didn't upload — add them from "My account"`));
      }
      onSubmitted(code);
    } catch (err) {
      setSendError(errorText(err));
    } finally {
      setSending(false);
    }
  };

  const validMoney = form.paidAmount > 0 && form.paidAmount <= form.contractPrice;
  const { net, discount, fines } = netToSeller(form);

  const confirmDeliveryDate = (year: number, monthNum: number) => {
    const monthObj = DELIVERY_MONTHS.find((m) => m.m === monthNum) || DELIVERY_MONTHS[5];
    const dateStr = language === 'ar' ? `${monthObj.ar} ${year}` : `${monthObj.en} ${year}`;
    const statusStr: DeliveryStatus =
      year === 2026
        ? 'استلام 2026'
        : year === 2027
        ? 'استلام 2027'
        : year === 2028
        ? 'استلام 2028'
        : 'استلام 2029+';
    set('alreadyDelivered', false);
    set('deliveryDate', dateStr);
    set('deliveryStatus', statusStr);
    setDeliveryModalOpen(false);
  };

  return (
    <div id="sell-top" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 scroll-mt-20">
      {/* العنوان الأول، وتحته سطر الطمأنة — مش العكس. اللي داخل الصفحة دي عايز يعرف بيعمل إيه قبل أي كلام. */}
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-bold text-accent">
          <Clock className="w-4 h-4" />
          {tx('دقيقة واحدة · مجاناً · من غير عمولة عليك', 'One minute · free · no fee for you')}
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight text-ink">
          {tx('اعرض وحدتك في دقيقة', 'List your unit in a minute')}
        </h1>
        <p className="mt-3 text-lg text-ink-soft leading-relaxed">
          {tx(
            'إحنا فاهمين إن الموقف صعب — وناس كتير قبلك عدّوا بيه. املا البيانات الأساسية بس، والباقي بعدين.',
            "We know this is hard — many have been here before you. Fill in the basics; the rest comes later.",
          )}
        </p>
      </header>

      {/* الثلاثة دول مكاسب مش تفاصيل — كل واحد في كارت لوحده عشان يتقروا بنظرة. */}
      <ul className="mt-6 grid sm:grid-cols-3 gap-3">
        {[
          { icon: Coins, t: tx('الى دفعته', 'What you paid'), d: tx('تبيع بسعرك، أو تبدّلها بوحدة تانية', 'Sell at your price, or swap it') },
          { icon: TrendingDown, t: tx('تتباع أسرع', 'Sells faster'), d: tx('تقدر تعمل خصم أو تقبل التفاوض', 'Add a discount or accept offers') },
          { icon: EyeOff, t: tx('في سرية', 'Private'), d: tx('اسمك ورقمك مش بيتنشروا', 'Your name and number stay private') },
        ].map((b) => (
          <li key={b.t} className="flex items-start gap-3 rounded-card border border-line bg-surface p-4 shadow-soft">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-soft text-brand shrink-0">
              <b.icon className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-bold text-ink">{b.t}</span>
              <span className="block mt-0.5 text-sm text-ink-soft leading-snug">{b.d}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* أكتر سؤال بيقلق البايع — بنرد عليه قبل ما يبدأ. طمأنة مش تحذير، فاللون كحلي مش أحمر. */}
      <div className="mt-4 flex items-start gap-3 rounded-card bg-brand-soft px-5 py-4">
        <ShieldCheck className="w-6 h-6 shrink-0 text-brand" />
        <p className="text-[15px] leading-relaxed text-brand-ink">
          <b className="block text-base text-ink">{tx('اتأخرت في الأقساط أو عليك غرامات؟', 'Behind on installments or have fines?')}</b>
          {tx(
            'عادي، بنبيعها برضه. المتأخرات بتتخصم من فلوسك يوم التنازل، ومش مطلوب منك تدفع حاجة دلوقتي.',
            "That's fine — we still sell it. Arrears come out of your payout on transfer day; nothing to pay now.",
          )}
        </p>
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_20rem] gap-6 items-start">
        <div className="card p-5 sm:p-8 space-y-7">
          {errors.length > 0 && (
            <div role="alert" className="rounded-xl bg-danger-soft p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <p className="text-sm text-ink-soft">
                <span className="font-semibold text-danger">{tx('ناقص: ', 'Missing: ')}</span>
                {errors.join('، ')}
              </p>
            </div>
          )}

          {/* شريط الخطوات — تقدر ترجع لأي خطوة عدّيتها، مش للي قدامك */}
          <ol className="flex items-center gap-2">
            {STEPS.map((st, i) => (
              <React.Fragment key={st.n}>
                <li>
                  <button
                    type="button"
                    onClick={() => st.n < step && goTo(st.n)}
                    disabled={st.n > step}
                    aria-current={st.n === step ? 'step' : undefined}
                    className={`flex items-center gap-2 rounded-full py-1.5 pe-3 ps-1.5 transition-colors ${
                      st.n === step
                        ? 'bg-brand text-white'
                        : st.n < step
                          ? 'text-brand hover:bg-brand-soft cursor-pointer'
                          : 'text-muted cursor-default'
                    }`}
                  >
                    <span
                      className={`grid place-items-center w-7 h-7 rounded-full text-sm font-bold shrink-0 ${
                        st.n === step ? 'bg-white text-brand' : st.n < step ? 'bg-brand text-white' : 'bg-line text-muted'
                      }`}
                    >
                      {st.n < step ? <Check className="w-4 h-4" strokeWidth={3} /> : st.n}
                    </span>
                    <span className="text-sm font-bold whitespace-nowrap">{st.label}</span>
                  </button>
                </li>
                {i < STEPS.length - 1 && <li aria-hidden className="h-px flex-1 bg-line" />}
              </React.Fragment>
            ))}
          </ol>

          {step === 1 && (
          <div className="space-y-7">
          {/* 1. المنطقة */}
          <Field label={tx('المنطقة', 'Area')} required>
            <ChipSelect
              options={L(REGIONS)}
              value={form.region}
              onChange={(v) => {
                set('region', v);
                set('subArea', ''); // الإقليم اتغير، فالاختيار التفصيلي القديم مابقاش صالح
              }}
            />
          </Field>
          {form.region && (
            <Field label={tx('المنطقة بالتحديد', 'Which part')} required>
              <ChipSelect
                options={(SUB_AREAS[form.region] ?? []).map((o) => ({ value: o.ar, label: language === 'ar' ? o.ar : o.en }))}
                value={form.subArea}
                onChange={(v) => set('subArea', v)}
              />
            </Field>
          )}

          {/* 2. المطور والكمبوند */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('المطور', 'Developer')} required htmlFor="dev">
              <input id="dev" value={form.developer} onChange={(e) => set('developer', e.target.value)} placeholder={tx('مثلاً: بالم هيلز', 'e.g. Palm Hills')} className="field" />
            </Field>
            <Field label={tx('الكمبوند', 'Compound')} required htmlFor="cmp">
              <input id="cmp" value={form.compound} onChange={(e) => set('compound', e.target.value)} placeholder={tx('مثلاً: بالم هيلز نيو كايرو', 'e.g. Palm Hills New Cairo')} className="field" />
            </Field>
          </div>

          {/* 3. النشاط ونوع الوحدة */}
          <Field label={tx('النشاط', 'Activity')} required>
            <ChipSelect
              options={L(PROPERTY_CATEGORIES)}
              value={form.propertyCategory}
              onChange={(v) => {
                set('propertyCategory', v);
                set('propertyType', ''); // التصنيف اتغير، فالنوع القديم مابقاش تحته
              }}
            />
          </Field>
          {form.propertyCategory && (
            <Field label={tx('نوع الوحدة', 'Unit type')} required>
              <ChipSelect
                options={(TYPES_BY_CATEGORY[form.propertyCategory] ?? []).map((o) => ({ value: o.ar, label: language === 'ar' ? o.ar : o.en }))}
                value={form.propertyType}
                onChange={(v) => set('propertyType', v)}
              />
            </Field>
          )}

          {/* 4. تم الاستلام بالفعل (نعم / لا) */}
          <div className="rounded-xl border border-line bg-surface p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink text-base">
                  {tx('تم الاستلام بالفعل؟', 'Already received / handed over?')}
                </span>
                <span className="text-danger font-bold text-sm">*</span>
              </div>
              <p className="text-xs sm:text-sm text-ink-soft mt-1">
                {tx(
                  'هل وحدتك تم استلامها بالفعل من المطور وجاهزة أم ما زالت تحت الإنشاء؟',
                  'Is your unit already handed over, or still under construction?'
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDeliveredClick}
                className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  form.alreadyDelivered === true
                    ? 'bg-brand text-white border-brand shadow-sm'
                    : 'bg-paper text-ink border-line hover:border-brand-soft hover:bg-surface'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${form.alreadyDelivered === true ? 'text-white' : 'text-muted'}`} />
                <span>{tx('نعم (تم الاستلام)', 'Yes (Delivered)')}</span>
              </button>

              <button
                type="button"
                onClick={handleNotDeliveredClick}
                className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  form.alreadyDelivered === false
                    ? 'bg-brand text-white border-brand shadow-sm'
                    : 'bg-paper text-ink border-line hover:border-brand-soft hover:bg-surface'
                }`}
              >
                <Calendar className={`w-5 h-5 ${form.alreadyDelivered === false ? 'text-white' : 'text-muted'}`} />
                <span>{tx('لا (تحت الإنشاء)', 'No (Under construction)')}</span>
              </button>
            </div>

            {/* If Yes is selected */}
            {form.alreadyDelivered === true && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tx('الوحدة جاهزة ومستلمة بالفعل من المطور (استلام فوري).', 'The unit is already handed over from the developer (immediate handover).')}</span>
              </div>
            )}

            {/* If No is selected */}
            {form.alreadyDelivered === false && (
              <div className="space-y-2">
                {form.deliveryDate ? (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-brand-soft border border-brand/20 text-brand-ink">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-brand shrink-0" />
                      <div>
                        <span className="text-xs font-semibold block text-muted">{tx('تاريخ الاستلام المتوقع المحدد:', 'Selected expected delivery:')}</span>
                        <span className="text-base font-bold text-ink">{form.deliveryDate} ({form.deliveryStatus})</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeliveryModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-surface border border-line text-xs sm:text-sm font-semibold text-brand hover:border-brand transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {tx('تغيير التاريخ', 'Change date')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeliveryModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-accent-soft border border-accent/30 text-accent font-bold text-sm hover:bg-accent/15 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{tx('اضغط هنا لتحديد تاريخ الاستلام المتوقع', 'Click here to choose expected delivery date')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          </div>
          )}

          {step === 2 && (
          <div className="space-y-7">
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
            <Field label={tx('حوالي كام؟', 'Roughly how much? (if you know)')} htmlFor="fines">
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

          </div>
          )}

          {step === 3 && (
          <div className="space-y-7">
            <p className="rounded-xl bg-brand-soft px-4 py-3 text-[15px] leading-relaxed text-brand-ink">
              {tx(
                'المستندات دي بتخلّي المراجعة أسرع، ومش بتظهر لأي مشتري ولا بتتنشر.',
                "These speed up the review. They are never shown to buyers or published — you can skip now and upload later from \"My account\".",
              )}
            </p>

            <FilePickMany
              label={tx('أول 4 صور في العقد', 'First 4 pages of the contract')}
              hint={tx('الصفحات اللي فيها بياناتك وبيانات الوحدة والسعر', 'The pages with your details, the unit and the price')}
              max={4}
              value={form.contractPages}
              onChange={(v) => set('contractPages', v)}
              files={contractPageFiles}
              onFilesChange={setContractPageFiles}
            />
            <FilePick
              label={tx('جدول سداد الأقساط', 'Payment schedule')}
              hint={tx('الملحق بالعقد', 'The contract annex')}
              value={form.paymentScheduleFile}
              onChange={(v) => set('paymentScheduleFile', v)}
              onFile={setScheduleFile}
            />
            <FilePick
              label={tx('صورة بلان الوحدة', 'Unit plan')}
              hint={tx('الملحق بالعقد', 'The contract annex')}
              value={form.unitPlanFile}
              onChange={(v) => set('unitPlanFile', v)}
              onFile={setPlanFile}
            />
          </div>
          )}

          {step === 4 && (
          <div className="space-y-7">
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
            {/* خيار جوه الفورم مش لينك بيخرّجه منه — البايع يقول إنه يقبل التبديل ويكمّل. */}
            <Toggle
              label={tx('أقبل أبدّلها بوحدة تانية', 'Open to swapping it')}
              hint={tx('من غير ما تبيع الأول — تدفع أو تاخد الفرق بس', 'No selling first — just settle the difference')}
              on={form.eligibleForSwap}
              onChange={(v) => set('eligibleForSwap', v)}
            >
              <Field
                label={tx('عايز تبدّلها بإيه؟', 'What would you swap into?')}
                htmlFor="swapwish"
                hint={tx('اختياري — اكتبها بكلامك: نوع الوحدة أو المنطقة أو قد إيه القسط', 'Optional — in your words: type, area, or the monthly you want')}
              >
                <input
                  id="swapwish"
                  value={form.swapTargetType}
                  onChange={(e) => set('swapTargetType', e.target.value)}
                  placeholder={tx('مثلاً: شقة أصغر بقسط أقل في أكتوبر', 'e.g. a smaller flat with a lower monthly in October')}
                  className="field"
                />
              </Field>
            </Toggle>
            <button
              type="button"
              onClick={() => onNavigate('swap')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline min-h-11"
            >
              <Repeat className="w-4 h-4" />
              {tx('شوف التبديل شغال إزاي', 'See how swapping works')}
              <Arrow className="w-4 h-4" />
            </button>
          </div>

          {/* The three seller rules that matter most, agreed to right where they apply. */}
          <div className="rounded-xl bg-paper p-5 space-y-4">
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

          </div>
          )}

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button type="button" onClick={() => goTo((step - 1) as 1 | 2 | 3 | 4)} className="btn-ghost min-h-14 px-5">
                {tx('رجوع', 'Back')}
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={goNext} className="btn-primary flex-1 min-h-14 text-base">
                {tx('التالي', 'Next')}
                <Arrow className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={submit} disabled={sending} className="btn-primary flex-1 min-h-14 text-base">
                <Send className="w-5 h-5" />
                {sending ? tx('بنبعت طلبك...', 'Sending...') : tx('ابعت طلبي', 'Send my request')}
              </button>
            )}
          </div>
          {sendError && (
            <p role="alert" className="-mt-3 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
              {sendError}
            </p>
          )}

          {step === 4 && (
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
          )}
          <a
            href={whatsappLink(tx('عايز أعرض وحدتي', "I'd like to list my unit"))}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-line py-3 text-sm font-semibold text-ink-soft hover:text-ink hover:border-ink-soft transition-colors"
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
                <p className="num font-display mt-3 text-4xl font-bold text-ink">{money(net, language)}</p>
                <p className="text-sm text-muted">
                  {currency(language)} · {tx('من غير عمولة', 'no fee')}
                  {discount > 0 && tx(` · بعد خصمك ${money(discount, language)}`, ` · after your ${money(discount, language)} discount`)}
                  {fines > 0 && tx(` · بعد المتأخرات ${money(fines, language)}`, ` · after ${money(fines, language)} arrears`)}
                </p>
                <div className="mt-5 rounded-xl bg-danger-soft p-4 flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-danger shrink-0" />
                  <p className="text-sm text-ink-soft">
                    {tx('لو لغيت مع المطور ممكن تخسر من', 'Cancelling could cost you')}{' '}
                    <span className="num font-bold text-danger">
                      {money(cancellationLoss(form.contractPrice, form.paidAmount, CANCELLATION_PENALTY_MIN_RATE), language)}
                      {tx(' لـ ', ' – ')}
                      {money(cancellationLoss(form.contractPrice, form.paidAmount), language)}
                    </span>
                    <span className="block text-xs text-muted mt-0.5">{tx('(10% – 15% من سعر الوحدة)', '(10–15% of the unit price)')}</span>
                  </p>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted">{tx('اكتب سعر العقد والمدفوع وهنحسبلك', 'Enter the contract price and amount paid')}</p>
            )}
          </div>
          <div className="rounded-xl bg-brand-soft p-4 text-sm text-brand-ink space-y-2">
            <p className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {tx('إيه اللي هيحصل بعد كده؟', 'What happens next?')}
            </p>
            <p>{tx('هنكلمك خلال يوم عمل، وتقدر تكمّل باقي البيانات من "حسابي" أو مع المستشار في التليفون.', "We'll call within one business day. Finish the details from \"My account\" or with your advisor on the phone.")}</p>
          </div>
        </aside>
      </div>

      {/* نافذة اختيار تاريخ الاستلام */}
      {deliveryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delivery-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs"
          onClick={() => setDeliveryModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-surface rounded-2xl border border-line shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-line">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-soft text-brand shrink-0">
                  <Calendar className="w-5 h-5" />
                </span>
                <div>
                  <h3 id="delivery-modal-title" className="text-xl font-bold text-ink">
                    {tx('تاريخ الاستلام المتوقع', 'Expected Delivery Date')}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                    {tx('حدد الشهر والسنة المتوقع استلام وحدتك فيهما من المطور', 'Select the month and year you expect handover')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryModalOpen(false)}
                aria-label={tx('إغلاق', 'Close')}
                className="grid place-items-center w-9 h-9 rounded-full text-muted hover:text-ink hover:bg-paper transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-6">
              {/* Year Selector */}
              <div>
                <label className="block text-sm font-bold text-ink mb-2.5">
                  {tx('سنة الاستلام', 'Delivery Year')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {DELIVERY_YEARS.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setPickerYear(yr)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        pickerYear === yr
                          ? 'bg-brand text-white shadow-sm ring-2 ring-brand/20'
                          : 'bg-paper text-ink border border-line hover:border-brand-soft'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Selector */}
              <div>
                <label className="block text-sm font-bold text-ink mb-2.5">
                  {tx('شهر الاستلام', 'Delivery Month')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {DELIVERY_MONTHS.map((m) => (
                    <button
                      key={m.m}
                      type="button"
                      onClick={() => setPickerMonth(m.m)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        pickerMonth === m.m
                          ? 'bg-brand text-white border-brand shadow-sm'
                          : 'bg-paper text-ink border-line hover:border-brand-soft hover:bg-surface'
                      }`}
                    >
                      <span className="text-xs opacity-75">{m.m}</span>
                      <span className="text-xs sm:text-sm font-bold mt-0.5">
                        {language === 'ar' ? m.ar : m.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Quarters */}
              <div>
                <span className="text-xs text-muted block mb-2">{tx('اختصارات ربع سنوية سريعة:', 'Quick quarterly shortcuts:')}</span>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[
                    { label: tx('الربع 1 (مارس)', 'Q1 (Mar)'), m: 3 },
                    { label: tx('الربع 2 (يونيو)', 'Q2 (Jun)'), m: 6 },
                    { label: tx('الربع 3 (سبتمبر)', 'Q3 (Sep)'), m: 9 },
                    { label: tx('الربع 4 (ديسمبر)', 'Q4 (Dec)'), m: 12 },
                  ].map((q) => (
                    <button
                      key={q.m}
                      type="button"
                      onClick={() => setPickerMonth(q.m)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors cursor-pointer ${
                        pickerMonth === q.m
                          ? 'bg-brand-soft border-brand/40 text-brand-ink'
                          : 'bg-paper border-line text-ink-soft hover:bg-surface'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Preview */}
              <div className="rounded-xl bg-brand-soft p-4 border border-brand/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-brand shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-muted block">
                      {tx('التاريخ المحدد:', 'Selected date:')}
                    </span>
                    <span className="text-base font-bold text-ink">
                      {language === 'ar'
                        ? `${DELIVERY_MONTHS.find((m) => m.m === pickerMonth)?.ar || ''} ${pickerYear}`
                        : `${DELIVERY_MONTHS.find((m) => m.m === pickerMonth)?.en || ''} ${pickerYear}`}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface border border-line text-brand-ink">
                  {pickerYear === 2026
                    ? tx('استلام 2026', '2026 Handover')
                    : pickerYear === 2027
                    ? tx('استلام 2027', '2027 Handover')
                    : pickerYear === 2028
                    ? tx('استلام 2028', '2028 Handover')
                    : tx('استلام 2029+', '2029+ Handover')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setDeliveryModalOpen(false)}
                className="btn-ghost flex-1 min-h-12 text-sm cursor-pointer"
              >
                {tx('إلغاء', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={() => confirmDeliveryDate(pickerYear, pickerMonth)}
                className="btn-primary flex-1 min-h-12 text-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {tx('تأكيد تاريخ الاستلام', 'Confirm Date')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
