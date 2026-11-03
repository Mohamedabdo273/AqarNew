import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, TrendingDown, Clock, ScrollText, Send, Check, MessageCircle, ArrowLeft, ArrowRight, Coins, EyeOff } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { SellDraft, useRequests } from '../context/RequestsContext';
import { useUnits } from '../context/UnitsContext';
import { useAuth } from '../context/AuthContext';
import { errorText } from '../services/api';
import { FormError } from '../components/FormError';
import { PROPERTY_CATEGORIES, TYPES_BY_CATEGORY, CANCELLATION_PENALTY_MIN_RATE, CANCELLATION_PENALTY_RATE, DELIVERY_OPTIONS, FREQUENCY_OPTIONS, cancellationLoss, currency, money } from '../lib/unitHelpers';
import { baseName, compoundRank, useDeveloperCatalog } from '../lib/developers';
import { EMPTY_SELL_FORM, MONTHS_PER_PAYMENT, SellForm, fitPlace, isValidPhone, netToSeller } from '../lib/sellForm';
import { CheckBox, Field, FilePick, FilePickMany, MoneyInput, NumberInput, PhotoPick, SearchSelect, Select, Toggle } from '../components/sell/FormBits';
import { placeName, useRegions, useSubAreas } from '../lib/places';
import { whatsappLink } from '../config/brand';

interface SellUnitPageProps {
  onSubmitted: (code: string) => void;
  onOpenRules: () => void;
  onNavigate: (page: PageId) => void;
}

const DRAFT_KEY = 'wahdety_sell_quick_draft_v1';
/** The draft saved on the server (code + token), so a reload carries on from where the seller was. */
const SERVER_DRAFT_KEY = 'deal_sell_server_draft_v1';

/**
 * Phase 1 of listing: only what we need to call the seller back.
 * Everything else is filled later from "My requests" (or by an advisor on the phone).
 */
export const SellUnitPage: React.FC<SellUnitPageProps> = ({ onSubmitted, onOpenRules, onNavigate }) => {
  const { language, tx, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const { createRequest, saveDraft } = useRequests();
  const { showToast, units } = useUnits();
  const { user } = useAuth();
  const [form, setForm] = useState<SellForm>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      // The draft can't hold the files themselves, so their names are dropped too — otherwise they'd look uploaded.
      return raw
        ? fitPlace({ ...EMPTY_SELL_FORM, ...JSON.parse(raw), contractPages: [], paymentScheduleFile: '', unitPlanFile: '', unitLocationFile: '' })
        : EMPTY_SELL_FORM;
    } catch {
      return EMPTY_SELL_FORM;
    }
  });
  // The picked files themselves, uploaded once the request exists.
  const [contractPageFiles, setContractPageFiles] = useState<File[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [locationFile, setLocationFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  // The request as saved on the server so far — each "Next" updates it, the last step submits it.
  const [draft, setDraft] = useState<SellDraft | null>(() => {
    try {
      const raw = localStorage.getItem(SERVER_DRAFT_KEY);
      return raw ? (JSON.parse(raw) as SellDraft) : null;
    } catch {
      return null;
    }
  });
  const [saving, setSaving] = useState(false);
  const [sendError, setSendError] = useState('');

  // Signed in: fill the owner's name and mobile from the account, without overwriting what they typed.
  useEffect(() => {
    if (!user) return;
    const accountName = /\d{6,}/.test(user.fullName) ? '' : user.fullName;
    setForm((f) => ({ ...f, ownerName: f.ownerName || accountName, ownerPhone: f.ownerPhone || user.phone }));
  }, [user]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const STEPS = [
    { n: 1 as const, label: tx('بياناتك', 'Your details') },
    { n: 2 as const, label: tx('الوحدة', 'The unit') },
    { n: 3 as const, label: tx('الفلوس', 'The money') },
    { n: 4 as const, label: tx('الصور والمستندات', 'Photos & papers') },
  ];

  /** كل خطوة بتتحقق من حقولها هي بس — عشان محدش يتقالّه "ناقص" على حاجة لسه مشفهاش. */
  const stepErrors = (target: 1 | 2 | 3 | 4): string[] => {
    const e: string[] = [];
    if (target === 1) {
      if (!form.ownerName.trim()) e.push(tx('اسمك', 'Your name'));
      if (!isValidPhone(form.ownerPhone)) e.push(tx('موبايل صحيح (01xxxxxxxxx)', 'Valid mobile (01xxxxxxxxx)'));
      if (form.ownerAltPhone.trim() && !isValidPhone(form.ownerAltPhone)) e.push(tx('رقم تاني صحيح (01xxxxxxxxx)', 'Valid second number (01xxxxxxxxx)'));
    }
    if (target === 2) {
      if (!form.regionId) e.push(tx('المنطقة', 'Area'));
      if (form.regionId && !form.subAreaId) e.push(tx('الموقع', 'Location'));
      if (!form.developer.trim()) e.push(tx('المطور', 'Developer'));
      if (!form.compound.trim()) e.push(tx('الكمبوند', 'Compound'));
      if (!form.propertyCategory) e.push(tx('النشاط', 'Activity'));
      if (form.propertyCategory && !form.propertyType) e.push(tx('نوع الوحدة', 'Unit type'));
      if (!form.deliveryStatus) e.push(tx('الاستلام', 'Delivery'));
    }
    if (target === 3) {
      if (!form.contractPrice) e.push(tx('سعر العقد', 'Contract price'));
      if (!form.paidAmount) e.push(tx('المدفوع', 'Amount paid'));
      if (form.paidAmount > form.contractPrice && form.contractPrice) e.push(tx('المدفوع أكبر من سعر العقد', 'Paid is more than contract price'));
      if (form.paidAmount && form.contractPrice > form.paidAmount) {
        if (!form.installmentFrequency) e.push(tx('نوع القسط', 'Installment type'));
        if (!form.installmentsRemainingCount) e.push(tx('عدد الأقساط', 'Number of installments'));
      }
      if (form.willingToDiscount && !form.discountAmount) e.push(tx('قيمة الخصم', 'Discount amount'));
      if (form.willingToDiscount && form.discountAmount >= form.paidAmount && form.paidAmount) e.push(tx('الخصم أكبر من المدفوع', 'Discount is more than what you paid'));
    }
    // الصور اختيارية، بس المستندات الأربعة لازم تترفع، ولازم يوافق على القواعد
    if (target === 4) {
      if (!contractPageFiles.length) e.push(tx('صور العقد', 'Contract pages'));
      if (!scheduleFile) e.push(tx('جدول سداد الأقساط', 'Payment schedule'));
      if (!planFile) e.push(tx('بلان الوحدة', 'Unit plan'));
      if (!locationFile) e.push(tx('تحديد موقع الوحدة في المشروع', 'Unit location in the project'));
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

  const cleanForm = (): SellForm => ({
    ...form,
    developer: form.developer.trim(),
    compound: form.compound.trim(),
    ownerName: form.ownerName.trim(),
    installmentPeriodYears:
      form.installmentFrequency && form.installmentsRemainingCount
        ? Math.ceil((form.installmentsRemainingCount * MONTHS_PER_PAYMENT[form.installmentFrequency]) / 12)
        : form.installmentPeriodYears,
  });

  const keepDraft = (d: SellDraft | null) => {
    setDraft(d);
    try {
      if (d) localStorage.setItem(SERVER_DRAFT_KEY, JSON.stringify(d));
      else localStorage.removeItem(SERVER_DRAFT_KEY);
    } catch {
      /* ignore */
    }
  };

  const goNext = async () => {
    if (saving) return;
    const e = stepErrors(step);
    setErrors(e);
    backToTop();
    if (e.length || step >= 4) return;
    setSaving(true);
    setSendError('');
    try {
      let saved: SellDraft;
      try {
        saved = await saveDraft(cleanForm(), draft);
      } catch (err) {
        // The old draft is gone (sent from another tab, or cleared) — start a new one.
        if (draft && (err as { status?: number })?.status === 404) saved = await saveDraft(cleanForm(), null);
        else throw err;
      }
      keepDraft(saved);
      setStep((step + 1) as 1 | 2 | 3 | 4);
    } catch (err) {
      setSendError(errorText(err));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* draft is a convenience only */
    }
  }, [form]);

  const set = <K extends keyof SellForm>(key: K, value: SellForm[K]) => setForm((f) => ({ ...f, [key]: value }));
  // المنطقة ← الموقع من الـ API؛ الفورم بيخزّن الـ id والاسم مع بعض، واختيار مستوى بيمسح اللي تحته.
  // (البايع مش بيختار المنطقة التفصيلية — فريقنا يحددها وقت المراجعة لو محتاجين.)
  const regions = useRegions();
  const subAreas = useSubAreas(form.regionId ? [form.regionId] : []);
  // مسودة قديمة على موقع اتشال من القايمة: البائع يختار من اللي موجود.
  useEffect(() => {
    if (subAreas.length && form.subAreaId && !subAreas.some((s) => s.id === form.subAreaId)) {
      setForm((f) => ({ ...f, subAreaId: null, subArea: '', districtId: null, district: '' }));
    }
  }, [subAreas, form.subAreaId]);
  const pickRegion = (id: number) => {
    const r = regions.find((x) => x.id === id);
    setForm((f) => ({ ...f, regionId: r?.id ?? null, region: r?.ar ?? '', subAreaId: null, subArea: '', districtId: null, district: '' }));
  };
  const pickSubArea = (id: number) => {
    const a = subAreas.find((x) => x.id === id);
    setForm((f) => ({ ...f, subAreaId: a?.id ?? null, subArea: a?.ar ?? '', districtId: null, district: '' }));
  };
  // الكتالوج + أي مطور على الموقع؛ والكمبوندات بتاعة المطور المختار. البحث في المطور بيدوّر في كمبونداته كمان،
  // فاللي عارف اسم الكمبوند بس يكتبه ويلاقي مطوره. (الوحدات بتتخزن بالاسم كنص، فالأسماء القديمة فاضلة شغالة.)
  const catalog = useDeveloperCatalog();
  const developerOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string; search: string }>();
    const known = [...catalog].sort((a, b) => {
      const last = Number(a.id === 'inshaa-other') - Number(b.id === 'inshaa-other');
      return last || Number(!!b.popular) - Number(!!a.popular) || (b.popular ? 0 : a.nameAr.localeCompare(b.nameAr, 'ar'));
    });
    for (const d of known) {
      map.set(baseName(d.nameAr), { value: d.nameAr, label: language === 'ar' ? d.nameAr : d.nameEn || d.nameAr, search: `${d.nameAr} ${d.nameEn} ${d.compounds.map((c) => `${c.ar} ${c.en}`).join(' ')}` });
    }
    for (const u of units) {
      if (u.developer && !map.has(baseName(u.developer))) map.set(baseName(u.developer), { value: u.developer, label: language === 'ar' ? u.developer : u.developerEn || u.developer, search: u.developerEn ?? '' });
    }
    return [...map.values()];
  }, [catalog, units, language]);
  const compoundOptions = useMemo(() => {
    if (!form.developer) return [];
    const map = new Map<string, { value: string; label: string; search: string }>();
    const devKey = baseName(form.developer);
    const known = catalog.find((d) => baseName(d.nameAr) === devKey || d.nameEn === form.developer);
    const regionAreas = subAreas.map((s) => s.ar);
    const ranked = [...(known?.compounds ?? [])].sort((a, b) => compoundRank(a, form.subArea, form.region, regionAreas) - compoundRank(b, form.subArea, form.region, regionAreas));
    for (const c of ranked) map.set(baseName(c.ar), { value: c.ar, label: language === 'ar' ? c.ar : c.en || c.ar, search: `${c.ar} ${c.en}` });
    for (const u of units) {
      if (baseName(u.developer) === devKey && u.compound && !map.has(baseName(u.compound))) map.set(baseName(u.compound), { value: u.compound, label: language === 'ar' ? u.compound : u.compoundEn || u.compound, search: u.compoundEn ?? '' });
    }
    return [...map.values()];
  }, [catalog, units, language, form.developer, form.subArea, form.region, subAreas]);

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
        cleanForm(),
        { contractPages: contractPageFiles, paymentSchedule: scheduleFile, unitPlan: planFile, unitLocation: locationFile, photos: photoFiles },
        draft,
      );
      keepDraft(null);
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
  // The penalty is 10–15% of the whole contract, but nobody can lose more than they paid — so it's capped there.
  const penaltyMin = Math.round(form.contractPrice * CANCELLATION_PENALTY_MIN_RATE);
  const penaltyMax = Math.round(form.contractPrice * CANCELLATION_PENALTY_RATE);
  const lossMin = cancellationLoss(form.contractPrice, form.paidAmount, CANCELLATION_PENALTY_MIN_RATE);
  const lossMax = cancellationLoss(form.contractPrice, form.paidAmount);
  // Under 1% of the price paid is almost always a typo (a missing zero or two).
  const paidLooksLow = form.contractPrice > 0 && form.paidAmount > 0 && form.paidAmount < form.contractPrice * 0.01;

  return (
    <div id="sell-top" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 scroll-mt-32">
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
          <FormError title={tx('ناقص:', 'Missing:')} messages={errors} />

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
            <Field label={tx('رقم تاني (اختياري)', 'Second number (optional)')} htmlFor="oaltphone">
              <input
                id="oaltphone"
                value={form.ownerAltPhone}
                onChange={(e) => set('ownerAltPhone', e.target.value)}
                inputMode="tel"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                className={`field ${isRTL ? 'text-right' : 'text-left'}`}
              />
            </Field>
          </div>

          </div>
          )}

          {step === 2 && (
          <div className="space-y-7">
          {/* 1. المنطقة والموقع جنب بعض */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('المنطقة', 'Area')} required htmlFor="region">
              <select
                id="region"
                value={form.regionId ?? ''}
                onChange={(e) => pickRegion(Number(e.target.value))}
                className="field"
              >
                <option value="">{tx('اختار المنطقة', 'Choose an area')}</option>
                {regions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {placeName(o, language)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={tx('الموقع', 'Location')} required htmlFor="subarea">
              <select
                id="subarea"
                value={form.subAreaId ?? ''}
                onChange={(e) => pickSubArea(Number(e.target.value))}
                disabled={!form.regionId}
                className="field disabled:opacity-60"
              >
                <option value="">{form.regionId ? tx('اختار الموقع', 'Choose a location') : tx('اختار المنطقة الأول', 'Choose the area first')}</option>
                {subAreas.map((o) => (
                  <option key={o.id} value={o.id}>
                    {placeName(o, language)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* 2. المطور والكمبوند — قوايم بحث؛ لو مش موجود يكتبه ويختار "استخدام ..." */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('المطور العقاري', 'Developer')} required htmlFor="developer">
              <SearchSelect
                id="developer"
                searchable
                allowCustom
                value={form.developer}
                onChange={(v) => setForm((f) => ({ ...f, developer: v, compound: v === f.developer ? f.compound : '' }))}
                placeholder={tx('اختار المطور', 'Choose the developer')}
                options={developerOptions}
              />
            </Field>
            <Field label={tx('الكمبوند / المشروع', 'Compound / Project')} required htmlFor="compound">
              <SearchSelect
                id="compound"
                searchable
                allowCustom
                disabled={!form.developer}
                value={form.compound}
                onChange={(v) => set('compound', v)}
                placeholder={form.developer ? tx('اختار الكمبوند', 'Choose the compound') : tx('اختار المطور الأول', 'Choose the developer first')}
                options={compoundOptions}
              />
            </Field>
          </div>

          {/* 3. النشاط ونوع الوحدة والفيو — قوايم منسدلة */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('النشاط', 'Activity')} required htmlFor="category">
              <select
                id="category"
                value={form.propertyCategory}
                onChange={(e) => {
                  set('propertyCategory', e.target.value as SellForm['propertyCategory']);
                  set('propertyType', ''); // التصنيف اتغير، فالنوع القديم مابقاش تحته
                }}
                className="field"
              >
                <option value="">{tx('اختار النشاط', 'Choose an activity')}</option>
                {PROPERTY_CATEGORIES.map((o) => (
                  <option key={o.ar} value={o.ar}>
                    {language === 'ar' ? o.ar : o.en}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={tx('نوع الوحدة', 'Unit type')} required htmlFor="ptype">
              <select
                id="ptype"
                value={form.propertyType}
                onChange={(e) => set('propertyType', e.target.value as SellForm['propertyType'])}
                disabled={!form.propertyCategory}
                className="field disabled:opacity-60"
              >
                <option value="">{form.propertyCategory ? tx('اختار نوع الوحدة', 'Choose a unit type') : tx('اختار النشاط الأول', 'Choose the activity first')}</option>
                {(form.propertyCategory ? TYPES_BY_CATEGORY[form.propertyCategory] ?? [] : []).map((o) => (
                  <option key={o.ar} value={o.ar}>
                    {language === 'ar' ? o.ar : o.en}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* 4. الاستلام — قايمة واحدة: اتسلمت خلاص أو سنة الاستلام */}
          <Field label={tx('الاستلام', 'Delivery')} required htmlFor="delivery">
            <select
              id="delivery"
              value={form.deliveryStatus}
              onChange={(e) => {
                const v = e.target.value as SellForm['deliveryStatus'];
                setForm((f) => ({ ...f, deliveryStatus: v, alreadyDelivered: v ? v === 'استلام فوري' : null, deliveryDate: '' }));
              }}
              className="field"
            >
              <option value="">{tx('اختار موعد الاستلام', 'Choose delivery')}</option>
              {DELIVERY_OPTIONS.map((o) => (
                <option key={o.ar} value={o.ar}>
                  {o.ar === 'استلام فوري' ? tx('اتسلمت خلاص', 'Already handed over') : tx(o.ar, `Delivery ${o.en}`)}
                </option>
              ))}
            </select>
          </Field>

          </div>
          )}

          {step === 3 && (
          <div className="space-y-7">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={tx('سعر الوحدة في العقد', 'Contract price')} required htmlFor="price">
              <MoneyInput id="price" value={form.contractPrice} onChange={(n) => set('contractPrice', n)} placeholder="5,000,000" />
            </Field>
            <Field label={tx('دفعت كام لحد النهارده؟', 'Paid so far')} required htmlFor="paid" hint={
                paidLooksLow
                  ? tx('الرقم ده صغير أوي مقارنة بسعر الوحدة — اتأكد إنك كاتبه صح', 'That is very small next to the unit price — double-check it')
                  : tx('المقدم + الأقساط اللي اتدفعت', 'Down payment + paid installments')
              }>
              <MoneyInput id="paid" value={form.paidAmount} onChange={(n) => set('paidAmount', n)} placeholder="1,500,000" />
            </Field>
          </div>
          {form.paidAmount > 0 && form.contractPrice > form.paidAmount && (
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label={tx('المتبقي من سعر الوحدة', 'Left of the unit price')} htmlFor="left" hint={tx('سعر الوحدة ناقص اللي دفعته', 'Unit price minus what you paid')}>
                <div className="relative">
                  <input
                    id="left"
                    readOnly
                    tabIndex={-1}
                    dir="ltr"
                    value={(form.contractPrice - form.paidAmount).toLocaleString('en-US')}
                    className={`field num font-semibold bg-sand-soft cursor-default ${isRTL ? 'pl-16 text-right' : 'pr-16 text-left'}`}
                  />
                  <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-sm text-muted`}>{currency(language)}</span>
                </div>
              </Field>
              <Field label={tx('نوع القسط', 'Installment type')} required htmlFor="freq">
                <Select
                  id="freq"
                  options={FREQUENCY_OPTIONS.map((o) => ({ value: o.ar, label: language === 'ar' ? o.ar : o.en }))}
                  value={form.installmentFrequency}
                  onChange={(v) => set('installmentFrequency', v)}
                />
              </Field>
              <Field label={tx('عدد الأقساط', 'Number of installments')} required htmlFor="count" hint={tx('الأقساط الباقية', 'Installments left')}>
                <NumberInput id="count" value={form.installmentsRemainingCount} onChange={(n) => set('installmentsRemainingCount', Math.floor(n))} placeholder="20" />
              </Field>
            </div>
          )}
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
              hint={tx('تتبادل مع مالك تاني عايز وحدتك — واللي وحدته أغلى ياخد الفرق', 'Trade with another owner who wants yours — the pricier side gets the difference')}
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
          </div>

          </div>
          )}

          {step === 4 && (
          <div className="space-y-7">
            <div>
              <p className="mb-3 font-bold text-ink">{tx('صور الوحدة', 'Unit photos')}</p>
              <PhotoPick files={photoFiles} onChange={setPhotoFiles} max={10} />
            </div>

            <p className="rounded-xl bg-brand-soft px-4 py-3 text-[15px] leading-relaxed text-brand-ink">
              {tx(
                'المستندات دي لازم عشان نراجع وحدتك، ومش بتظهر لأي مشتري ولا بتتنشر.',
                'We need these to review your unit. They are never shown to buyers or published.',
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
              required
            />
            <FilePick
              label={tx('جدول سداد الأقساط', 'Payment schedule')}
              hint={tx('الملحق بالعقد', 'The contract annex')}
              value={form.paymentScheduleFile}
              onChange={(v) => set('paymentScheduleFile', v)}
              onFile={setScheduleFile}
              required
            />
            <FilePick
              label={tx('صورة بلان الوحدة', 'Unit plan')}
              hint={tx('الملحق بالعقد', 'The contract annex')}
              value={form.unitPlanFile}
              onChange={(v) => set('unitPlanFile', v)}
              onFile={setPlanFile}
              required
            />
            <FilePick
              label={tx('تحديد موقع الوحدة في المشروع', 'Unit location in the project')}
              hint={tx('الملحق بالعقد', 'The contract annex')}
              value={form.unitLocationFile}
              onChange={(v) => set('unitLocationFile', v)}
              onFile={setLocationFile}
              required
            />
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
              <b>{tx('أنا المالك ومش سمسار ولا وسيط', "I'm the owner, not a broker or middleman")}</b> — {tx('العقد باسمي أو معايا توكيل رسمي. لو اتضح إني وسيط، الوحدة بتتشال نهائياً.', "the contract is in my name or I hold a formal POA. If I turn out to be a middleman, the unit is removed for good.")}
            </CheckBox>
            <CheckBox checked={form.ackNoOverprice} onChange={(v) => set('ackNoOverprice', v)}>
              <b>{tx('مفيش أوفر برايس', 'No overprice')}</b> — {tx('هاخد اللي دفعته بس، مش جنيه زيادة', "I'll take only what I paid, not a pound more")}
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
              <button type="button" onClick={goNext} disabled={saving} className="btn-primary flex-1 min-h-14 text-base">
                {saving ? tx('بنحفظ...', 'Saving...') : tx('التالي', 'Next')}
                {!saving && <Arrow className="w-5 h-5" />}
              </button>
            ) : (
              <button onClick={submit} disabled={sending} className="btn-primary flex-1 min-h-14 text-base">
                <Send className="w-5 h-5" />
                {sending ? tx('بنبعت طلبك...', 'Sending...') : tx('ابعت طلبي', 'Send my request')}
              </button>
            )}
          </div>
          <FormError className="-mt-3" messages={sendError} />

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
            {tx('لأي استفسار ابعتلنا على الواتساب', 'For any inquiries, message us on WhatsApp')}
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
                  {tx(' · قبل ضريبة التصرفات', ' · before disposal tax')}
                  {discount > 0 && tx(` · بعد خصمك ${money(discount, language)}`, ` · after your ${money(discount, language)} discount`)}
                  {fines > 0 && tx(` · بعد المتأخرات ${money(fines, language)}`, ` · after ${money(fines, language)} arrears`)}
                </p>
                <div className="mt-5 rounded-xl bg-danger-soft p-4 flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-danger shrink-0" />
                  <p className="text-sm text-ink-soft">
                    {lossMin >= form.paidAmount ? (
                      <>
                        {tx('لو لغيت مع المطور ممكن تخسر', 'Cancelling could cost you')}{' '}
                        <span className="font-bold text-danger">{tx('كل اللي دفعته', 'everything you paid')}</span>{' '}
                        <span className="num font-bold text-danger">({money(form.paidAmount, language)})</span>
                      </>
                    ) : lossMax >= form.paidAmount ? (
                      <>
                        {tx('لو لغيت مع المطور ممكن تخسر من', 'Cancelling could cost you from')}{' '}
                        <span className="num font-bold text-danger">{money(lossMin, language)}</span>{' '}
                        {tx('لحد كل اللي دفعته', 'up to everything you paid')}
                      </>
                    ) : (
                      <>
                        {tx('لو لغيت مع المطور ممكن تخسر من', 'Cancelling could cost you')}{' '}
                        <span className="num font-bold text-danger">
                          {money(lossMin, language)}
                          {tx(' لحد ', ' – ')}
                          {money(lossMax, language)}
                        </span>
                      </>
                    )}
                    <span className="block text-xs text-muted mt-0.5">
                      {lossMax >= form.paidAmount
                        ? tx(
                            `الغرامة 10–15% من سعر الوحدة (${money(penaltyMin, language)} – ${money(penaltyMax, language)}) — أكبر من اللي دفعته`,
                            `The penalty is 10–15% of the unit price (${money(penaltyMin, language)} – ${money(penaltyMax, language)}) — more than you paid`,
                          )
                        : tx('(10% – 15% من سعر الوحدة)', '(10–15% of the unit price)')}
                    </span>
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
            <p>{tx('بنراجع طلبك والمستندات، وهنكلمك لو في بيانات ناقصة. وتقدر تتابع طلبك من "حسابي".', "We review your request and documents, and call you if anything is missing. Follow it from \"My account\".")}</p>
          </div>
        </aside>
      </div>

    </div>
  );
};
