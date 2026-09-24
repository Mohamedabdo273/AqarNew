import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  DELIVERY_OPTIONS,
  FINISHING_OPTIONS,
  FREQUENCY_OPTIONS,
  fullMoney,
} from '../../lib/unitHelpers';
import { DETAIL_SECTIONS, FeeBearer, SellForm, TaxBearer, TaxCategory, View, isResidential } from '../../lib/sellForm';
import { ChipSelect, CheckBox, Counter, Field, FilePick, Group, MoneyInput, NumberInput, Toggle } from './FormBits';

interface SellDetailsWizardProps {
  initial: SellForm;
  startStep?: number;
  onSave: (form: SellForm) => void;
  onCancel: () => void;
}

/** Phase 2 of listing: everything beyond the basics, saved section by section. */
export const SellDetailsWizard: React.FC<SellDetailsWizardProps> = ({ initial, startStep = 0, onSave, onCancel }) => {
  const { language, tx, isRTL } = useLanguage();
  const Next = isRTL ? ArrowLeft : ArrowRight;
  const Back = isRTL ? ArrowRight : ArrowLeft;
  const [form, setForm] = useState<SellForm>(initial);
  const [step, setStep] = useState(startStep);
  const [errors, setErrors] = useState<string[]>([]);

  const set = <K extends keyof SellForm>(key: K, value: SellForm[K]) => setForm((f) => ({ ...f, [key]: value }));
  const remaining = Math.max(0, form.contractPrice - form.paidAmount);
  const L = <T extends string>(list: { ar: T; en: string }[]) => list.map((o) => ({ value: o.ar, label: language === 'ar' ? o.ar : o.en }));

  const titles = [tx('المواصفات', 'Specs'), tx('الأقساط', 'Installments'), tx('المديونية والشروط', 'Dues & terms'), tx('المستندات', 'Documents')];

  const validate = (s: number): string[] => {
    const e: string[] = [];
    if (DETAIL_SECTIONS[s] === 'specs' && !form.areaM2) e.push(tx('المساحة', 'Size'));
    if (DETAIL_SECTIONS[s] === 'installments' && remaining > 0 && !form.installmentValue) e.push(tx('قيمة القسط', 'Installment amount'));
    if (DETAIL_SECTIONS[s] === 'dues') {
      if (form.hasLatePenalties && !form.latePenaltiesAmount) e.push(tx('قيمة المتأخرات', 'Overdue amount'));
      if (form.willingToDiscount && !form.discountAmount) e.push(tx('قيمة الخصم', 'Discount amount'));
    }
    return e;
  };

  // Every step saves on the way forward, so leaving midway never loses what was entered.
  const saveAndGo = (target: number | 'done') => {
    const e = validate(step);
    if (e.length) {
      setErrors(e);
      return;
    }
    const next = DETAIL_SECTIONS[step] === 'dues' ? { ...form, duesConfirmed: true } : form;
    setForm(next);
    setErrors([]);
    onSave(next);
    if (target === 'done') onCancel();
    else {
      setStep(target);
      document.getElementById('details-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="details-top" className="card p-5 sm:p-8 scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xl font-bold text-ink">{tx('كمّل بيانات وحدتك', 'Complete your unit details')}</p>
        <button onClick={onCancel} className="text-sm font-semibold text-muted hover:text-ink">{tx('بعدين', 'Later')}</button>
      </div>

      <ol className="mt-5 grid grid-cols-4 gap-2">
        {titles.map((t, i) => (
          <li key={t}>
            <button onClick={() => (i < step ? setStep(i) : i > step && saveAndGo(i))} className="w-full text-start" aria-current={i === step ? 'step' : undefined}>
              <span className={`block h-1.5 rounded-full ${i < step ? 'bg-brand' : i === step ? 'bg-brand/60' : 'bg-line'}`} />
              <span className={`mt-2 block text-xs sm:text-sm font-medium truncate ${i <= step ? 'text-ink' : 'text-muted'}`}>{t}</span>
            </button>
          </li>
        ))}
      </ol>

      {errors.length > 0 && (
        <div role="alert" className="mt-6 rounded-2xl bg-danger-soft p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-danger">{tx('ناقص: ', 'Missing: ')}</span>
            {errors.join('، ')}
          </p>
        </div>
      )}

      <div className="mt-8">
        {DETAIL_SECTIONS[step] === 'specs' && (
          <div className="space-y-8">
            <Group title={tx('المساحة والغرف', 'Size & rooms')}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Field label={tx('المساحة', 'Size')} required htmlFor="area">
                    <NumberInput id="area" value={form.areaM2} onChange={(n) => set('areaM2', n)} placeholder="150" suffix={tx('م²', 'm²')} />
                  </Field>
                </div>
                {isResidential(form.propertyType) && <Counter label={tx('غرف النوم', 'Bedrooms')} value={form.bedrooms} onChange={(n) => set('bedrooms', n)} max={8} />}
                <Counter label={tx('الحمامات', 'Bathrooms')} value={form.bathrooms} onChange={(n) => set('bathrooms', n)} max={8} />
                <Field label={tx('الدور', 'Floor')} htmlFor="floor">
                  <input id="floor" value={form.floor} onChange={(e) => set('floor', e.target.value)} placeholder={tx('مثلاً: التالت', 'e.g. 3rd')} className="field" />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={tx('المرحلة', 'Phase')} htmlFor="phase">
                  <input id="phase" value={form.phaseName} onChange={(e) => set('phaseName', e.target.value)} placeholder={tx('مثلاً: المرحلة الثانية', 'e.g. Phase 2')} className="field" />
                </Field>
                <Field label={tx('رقم العمارة / الوحدة', 'Building / unit no.')} htmlFor="unitno" hint={tx('مش هيظهر للمشترين', 'Not shown to buyers')}>
                  <input id="unitno" value={form.unitNumber} onChange={(e) => set('unitNumber', e.target.value)} placeholder={tx('مثلاً: عمارة 14 - شقة 302', 'e.g. B14 - 302')} className="field" />
                </Field>
                <Field label={tx('مساحة الجنينة', 'Garden')} htmlFor="garden" hint={tx('لو فيه', 'If any')}>
                  <NumberInput id="garden" value={form.gardenAreaM2} onChange={(n) => set('gardenAreaM2', n)} placeholder="0" suffix={tx('م²', 'm²')} />
                </Field>
                <Field label={tx('مساحة الروف', 'Roof')} htmlFor="roof" hint={tx('لو فيه', 'If any')}>
                  <NumberInput id="roof" value={form.roofAreaM2} onChange={(n) => set('roofAreaM2', n)} placeholder="0" suffix={tx('م²', 'm²')} />
                </Field>
              </div>
            </Group>
            <Group title={tx('الحالة', 'Condition')}>
              <Field label={tx('التشطيب', 'Finishing')}>
                <ChipSelect options={L(FINISHING_OPTIONS)} value={form.finishing} onChange={(v) => set('finishing', v)} />
              </Field>
              <Field label={tx('الاستلام', 'Delivery')}>
                <ChipSelect
                  options={DELIVERY_OPTIONS.map((d) => ({ value: d.ar, label: language === 'ar' ? d.short : d.en }))}
                  value={form.deliveryStatus}
                  onChange={(v) => set('deliveryStatus', v)}
                />
              </Field>
              {form.deliveryStatus !== 'استلام فوري' && (
                <div className="sm:w-1/2">
                  <Field label={tx('تاريخ الاستلام في العقد', 'Delivery date in contract')} htmlFor="ddate">
                    <input id="ddate" type="date" value={form.deliveryDate} onChange={(e) => set('deliveryDate', e.target.value)} className="field" />
                  </Field>
                </div>
              )}
              <Field label={tx('الواجهة', 'Facing')}>
                <ChipSelect<View>
                  options={[
                    { value: 'بحري صريح', label: tx('بحري صريح', 'North') },
                    { value: 'بحري شرقي', label: tx('بحري شرقي', 'North-east') },
                    { value: 'قبلي', label: tx('قبلي', 'South') },
                    { value: 'شرقي', label: tx('شرقي', 'East') },
                    { value: 'غربي', label: tx('غربي', 'West') },
                  ]}
                  value={form.viewOrientation}
                  onChange={(v) => set('viewOrientation', v)}
                />
              </Field>
            </Group>
            <Group title={tx('مع الوحدة', 'Included')}>
              <div className="grid sm:grid-cols-3 gap-3">
                <Toggle label={tx('جراج', 'Parking')} on={form.parkingIncluded} onChange={(v) => set('parkingIncluded', v)} />
                <Toggle label={tx('عضوية النادي', 'Club')} on={form.clubhouseIncluded} onChange={(v) => set('clubhouseIncluded', v)} />
                <Toggle label={tx('غرفة تخزين', 'Storage')} on={form.hasStorageRoom} onChange={(v) => set('hasStorageRoom', v)} />
              </div>
            </Group>
          </div>
        )}

        {DETAIL_SECTIONS[step] === 'installments' && (
          <div className="space-y-8">
            <p className="rounded-2xl bg-paper px-4 py-3 text-sm text-ink-soft">
              {tx('باقي للمطور', 'Left to developer')}: <span className="num font-bold text-ink">{fullMoney(remaining, language)}</span>
            </p>
            <Group title={tx('الأقساط الباقية', 'Remaining installments')}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={tx('قيمة القسط', 'Installment amount')} required htmlFor="inst">
                  <MoneyInput id="inst" value={form.installmentValue} onChange={(n) => set('installmentValue', n)} placeholder="125,000" />
                </Field>
                <Field label={tx('القسط الجاي امتى؟', 'Next installment date')} htmlFor="next">
                  <input id="next" type="date" value={form.nextInstallmentDate} onChange={(e) => set('nextInstallmentDate', e.target.value)} className="field" />
                </Field>
              </div>
              <Field label={tx('بتدفع كل', 'Paid every')}>
                <ChipSelect options={L(FREQUENCY_OPTIONS)} value={form.installmentFrequency} onChange={(v) => set('installmentFrequency', v)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Counter label={tx('سنين باقية', 'Years left')} value={form.installmentPeriodYears} onChange={(n) => set('installmentPeriodYears', n)} max={15} />
                <Field label={tx('عدد الأقساط الباقية', 'Installments left')} htmlFor="count">
                  <NumberInput id="count" value={form.installmentsRemainingCount} onChange={(n) => set('installmentsRemainingCount', n)} placeholder="20" />
                </Field>
              </div>
            </Group>
            <Group title={tx('أرقام إضافية', 'Extra figures')}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={tx('المقدم وقت التعاقد', 'Original down payment')} htmlFor="down">
                  <MoneyInput id="down" value={form.downPaymentOriginal} onChange={(n) => set('downPaymentOriginal', n)} placeholder="500,000" />
                </Field>
                <Field label={tx('سعر نفس الوحدة عند المطور النهارده', "Developer's price today")} htmlFor="market" hint={tx('لو مش عارف سيبها، هنحسبها', "Leave empty and we'll estimate")}>
                  <MoneyInput id="market" value={form.currentMarketPrice} onChange={(n) => set('currentMarketPrice', n)} placeholder="9,000,000" />
                </Field>
              </div>
            </Group>
          </div>
        )}

        {DETAIL_SECTIONS[step] === 'dues' && (
          <div className="space-y-8">
            <Group title={tx('المديونية', 'Dues')}>
              <Toggle
                tone="danger"
                label={tx('عليك أقساط متأخرة أو غرامات؟', 'Any overdue installments or fines?')}
                hint={tx('قول بصراحة — بيسرّع المراجعة وبيحميك', 'Be upfront — it speeds up review')}
                on={form.hasLatePenalties}
                onChange={(v) => set('hasLatePenalties', v)}
              >
                <Field label={tx('إجمالي المتأخرات والغرامات', 'Total overdue + fines')} required htmlFor="fines">
                  <MoneyInput id="fines" value={form.latePenaltiesAmount} onChange={(n) => set('latePenaltiesAmount', n)} placeholder="80,000" />
                </Field>
                <CheckBox checked={form.deductPenaltiesFromPrice} onChange={(v) => set('deductPenaltiesFromPrice', v)}>
                  {tx('تتخصم من فلوسي والمشتري يسددها للمطور', 'Deduct from my payout; buyer settles it with the developer')}
                </CheckBox>
              </Toggle>
              <Toggle label={tx('وديعة الصيانة اتدفعت؟', 'Maintenance deposit paid?')} on={form.maintenanceDepositPaid} onChange={(v) => set('maintenanceDepositPaid', v)} />
            </Group>

            <Group title={tx('الرسوم والضرايب', 'Fees & tax')}>
              <Field label={tx('رسوم التنازل عند المطور على مين؟', 'Developer transfer fee paid by')}>
                <ChipSelect<FeeBearer>
                  options={[
                    { value: 'مشتري', label: tx('المشتري', 'Buyer') },
                    { value: 'بائع', label: tx('أنا', 'Me') },
                    { value: 'مناصفة', label: tx('مناصفة', '50/50') },
                    { value: 'معفي بالعقد', label: tx('معفي بالعقد', 'Exempt') },
                  ]}
                  value={form.transferFeeBearer}
                  onChange={(v) => set('transferFeeBearer', v)}
                />
              </Field>
              {form.transferFeeBearer !== 'معفي بالعقد' && (
                <div className="sm:w-1/2">
                  <Field label={tx('نسبة الرسوم', 'Fee %')} htmlFor="feepct" hint={tx('غالباً من 2% لـ 10% من سعر العقد', 'Usually 2–10% of contract price')}>
                    <NumberInput id="feepct" value={form.transferFeePercent} onChange={(n) => set('transferFeePercent', Math.min(100, n))} placeholder="5" suffix="%" />
                  </Field>
                </div>
              )}
              <Field label={tx('نوع الوحدة ضريبياً', 'Tax category')}>
                <ChipSelect<TaxCategory>
                  options={[
                    { value: 'residential_exempt', label: tx('سكني (معفي)', 'Residential (exempt)') },
                    { value: 'commercial_vat', label: tx('تجاري / إداري', 'Commercial (VAT)') },
                    { value: 'business_tax', label: tx('مملوكة لشركة', 'Company-owned') },
                  ]}
                  value={form.taxCategory}
                  onChange={(v) => set('taxCategory', v)}
                />
              </Field>
              <Field label={tx('الضريبة على مين؟', 'Tax paid by')}>
                <ChipSelect<TaxBearer>
                  options={[
                    { value: 'حسب القانون', label: tx('حسب القانون', 'By law') },
                    { value: 'بائع', label: tx('أنا', 'Me') },
                    { value: 'مشتري', label: tx('المشتري', 'Buyer') },
                    { value: 'معفى', label: tx('معفاة', 'Exempt') },
                  ]}
                  value={form.taxBearer}
                  onChange={(v) => set('taxBearer', v)}
                />
              </Field>
            </Group>

            <Group title={tx('عاوز تبيع أسرع؟', 'Want to sell faster?')}>
              <Toggle
                tone="gold"
                label={tx('موافق على خصم من المدفوع', 'Offer a discount on the paid amount')}
                hint={tx('الوحدات اللي فيها خصم بتتباع أسرع', 'Discounted units sell faster')}
                on={form.willingToDiscount}
                onChange={(v) => set('willingToDiscount', v)}
              >
                <Field label={tx('قيمة الخصم', 'Discount amount')} required htmlFor="disc">
                  <MoneyInput id="disc" value={form.discountAmount} onChange={(n) => set('discountAmount', n)} placeholder="100,000" />
                </Field>
              </Toggle>
              <Toggle
                label={tx('تقبل الكاش على دفعتين؟', 'Accept cash in two payments?')}
                hint={tx('مثلاً جزء عند التوقيع والباقي بشيك بعد شهرين', 'e.g. part on signing, rest by cheque in 60 days')}
                on={form.acceptsCashInstallments}
                onChange={(v) => set('acceptsCashInstallments', v)}
              >
                <textarea
                  value={form.cashInstallmentNotes}
                  onChange={(e) => set('cashInstallmentNotes', e.target.value)}
                  rows={2}
                  placeholder={tx('مثلاً: 60% عند التوقيع و40% بشيك بعد شهرين', 'e.g. 60% on signing, 40% cheque in 60 days')}
                  className="field h-auto py-3 resize-none"
                />
              </Toggle>
              <Toggle
                label={tx('تقبل تبدّل وحدتك؟', 'Open to swapping?')}
                hint={tx('بوحدة تانية تدفع أو تاخد الفرق', 'For another unit, settling the difference')}
                on={form.eligibleForSwap}
                onChange={(v) => set('eligibleForSwap', v)}
              >
                <input
                  value={form.swapTargetType}
                  onChange={(e) => set('swapTargetType', e.target.value)}
                  placeholder={tx('عاوز إيه بدالها؟ مثلاً: شقة أصغر في زايد', 'What do you want instead?')}
                  className="field"
                />
              </Toggle>
            </Group>
          </div>
        )}

        {DETAIL_SECTIONS[step] === 'docs' && (
          <Group title={tx('المستندات بتسرّع المراجعة', 'Documents speed up review')}>
            <div className="grid gap-3">
              <FilePick label={tx('صورة العقد', 'Contract')} hint={tx('صورة أو PDF', 'Photo or PDF')} value={form.contractFile} onChange={(v) => set('contractFile', v)} />
              <FilePick label={tx('كشف حساب أو آخر إيصال', 'Statement or last receipt')} hint={tx('من المطور', 'From the developer')} value={form.receiptFile} onChange={(v) => set('receiptFile', v)} />
              <FilePick label={tx('البطاقة', 'National ID')} hint={tx('للتأكد إنك المالك', 'To confirm ownership')} value={form.idFile} onChange={(v) => set('idFile', v)} />
            </div>
          </Group>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="btn-ghost" aria-label={tx('رجوع', 'Back')}>
            <Back className="w-5 h-5" />
          </button>
        )}
        <button onClick={() => saveAndGo(step < DETAIL_SECTIONS.length - 1 ? step + 1 : 'done')} className="btn-primary flex-1 min-h-13">
          {step < DETAIL_SECTIONS.length - 1 ? (
            <>
              {tx('حفظ والتالي', 'Save & next')}
              <Next className="w-5 h-5" />
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              {tx('حفظ', 'Save')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
