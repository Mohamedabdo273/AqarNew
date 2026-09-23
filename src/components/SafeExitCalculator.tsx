import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Clock, 
  Building2,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { ExitCalculationResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SafeExitCalculatorProps {
  onStartExitRequest: (contractPrice: number, paidAmount: number, developer: string) => void;
}

export const SafeExitCalculator: React.FC<SafeExitCalculatorProps> = ({
  onStartExitRequest
}) => {
  const { t, language, isRTL } = useLanguage();
  const [contractPrice, setContractPrice] = useState<number>(5000000);
  const [paidAmount, setPaidAmount] = useState<number>(2000000);
  const [developerName, setDeveloperName] = useState<string>('بالم هيلز');

  const validatedPaid = Math.min(paidAmount, contractPrice);

  const calculations: ExitCalculationResult = useMemo(() => {
    const penaltyRate = 0.15;
    const developerPenalty = Math.round(contractPrice * penaltyRate);
    const developerNetRefund = Math.max(0, validatedPaid - developerPenalty);
    const developerRefundDelayMonths = 36;

    const traditionalBrokerFee = Math.round(contractPrice * 0.025);
    const traditionalOverpriceRiskMonths = 6;

    const tanazulNetCash = validatedPaid;
    const tanazulFeeForSeller = 0;
    const tanazulEstimatedDaysToExit = 7;
    const totalSavedMoney = developerPenalty;

    return {
      paidAmount: validatedPaid,
      developerPenalty,
      developerRefundDelayMonths,
      developerNetRefund,
      traditionalBrokerFee,
      traditionalOverpriceRiskMonths,
      tanazulNetCash,
      tanazulFeeForSeller,
      tanazulEstimatedDaysToExit,
      totalSavedMoney
    };
  }, [contractPrice, validatedPaid]);

  const formatCurrency = (num: number) => {
    return num.toLocaleString() + ' ' + t('egp');
  };

  return (
    <section id="calculator" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200/60">
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'حاسبة الخروج العادل بالأرقام' : 'Numerical Exit Calculator'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {t('calcTitle')}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            {t('calcSub')}
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-3.5 sm:p-6 lg:p-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left: Inputs (5 cols) */}
            <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 space-y-4 sm:space-y-5 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>{language === 'ar' ? 'بيانات عقد وحدتك' : 'Your Contract Figures'}</span>
              </h3>

              {/* Total Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <label htmlFor="c-price">{t('calcContractPrice')}:</label>
                  <span className="text-teal-800 font-sans font-bold text-sm">
                    {formatCurrency(contractPrice)}
                  </span>
                </div>
                <input
                  id="c-price"
                  type="range"
                  min={1000000}
                  max={30000000}
                  step={250000}
                  value={contractPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setContractPrice(val);
                    if (paidAmount > val) setPaidAmount(val);
                  }}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1M {t('egp')}</span>
                  <span>15M {t('egp')}</span>
                  <span>30M {t('egp')}</span>
                </div>
              </div>

              {/* Paid Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <label htmlFor="p-amount">{t('calcPaidAmount')}:</label>
                  <span className="text-teal-800 font-sans font-bold text-sm">
                    {formatCurrency(validatedPaid)}
                  </span>
                </div>
                <input
                  id="p-amount"
                  type="range"
                  min={200000}
                  max={contractPrice}
                  step={100000}
                  value={validatedPaid}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>200K {t('egp')}</span>
                  <span>{language === 'ar' ? 'نسبة السداد:' : 'Paid Ratio:'} {Math.round((validatedPaid / contractPrice) * 100)}%</span>
                  <span>{formatCurrency(contractPrice)}</span>
                </div>
              </div>

              {/* Developer */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t('calcDeveloperName')}:
                </label>
                <select
                  value={developerName}
                  onChange={(e) => setDeveloperName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium cursor-pointer focus:outline-none focus:border-teal-700"
                >
                  <option value="بالم هيلز">Palm Hills (بالم هيلز للتعمير)</option>
                  <option value="سوديك">SODIC (سوديك)</option>
                  <option value="ماونتن فيو">Mountain View (ماونتن فيو)</option>
                  <option value="إعمار مصر">Emaar Misr (إعمار مصر)</option>
                  <option value="أورا ديفيلوبرز">ORA Developers (أورا)</option>
                  <option value="مصر إيطاليا">Misr Italia (مصر إيطاليا)</option>
                  <option value="طلعت مصطفى">TMG (طلعت مصطفى)</option>
                  <option value="الأهلي صبور">Al Ahly Sabbour (الأهلي صبور)</option>
                  <option value="مطور آخر">{language === 'ar' ? 'شركة تطوير أخرى' : 'Other Developer'}</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  {language === 'ar'
                    ? '* أغلب المطورين يخصمون 10% إلى 15% من ثمن الوحدة الإجمالي عند فسخ العقد.'
                    : '* Most developers enforce a 10% to 15% penalty on the total contract price upon cancellation.'}
                </p>
              </div>

              {/* Micro Explanation */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-semibold flex items-center gap-1 text-[11px] text-slate-800">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{language === 'ar' ? 'تنبيه هام حول خصم المطور:' : 'Important Developer Penalty Note:'}</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'الخصم يقع على إجمالي ثمن الوحدة وليس على ما دفعته، لذلك الفسخ يحرق غالبية مدفوعاتك!'
                    : 'Penalties are assessed against the TOTAL contract price rather than what was paid, erasing most of your capital!'}
                </p>
              </div>
            </div>

            {/* Right: Results Comparison (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Winner: Exit via Platform */}
              <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {t('calcPlatformTitle')}
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-300 bg-teal-900/40 border border-teal-700/40 px-2.5 py-0.5 rounded">
                    {language === 'ar' ? 'وفرت ' : 'Saved '} {formatCurrency(calculations.totalSavedMoney)}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">{t('calcPlatformCash')}</span>
                    <div className="text-xl font-black text-teal-300 font-sans">
                      {formatCurrency(calculations.tanazulNetCash)}
                    </div>
                    <span className="text-[10px] text-slate-400">{language === 'ar' ? 'استرداد كامل رأس المال' : '100% full capital recovery'}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">{language === 'ar' ? 'عمولة البائع:' : 'Seller Commission:'}</span>
                    <div className="text-xl font-black text-white font-sans">
                      0 {t('egp')}
                    </div>
                    <span className="text-[10px] text-slate-400">{language === 'ar' ? 'خدمة مجانية للبائع بالكامل' : '100% free for seller'}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">{language === 'ar' ? 'طريقة الاستلام:' : 'Payout Method:'}</span>
                    <div className="text-base font-bold text-white mt-1">
                      {language === 'ar' ? 'شيك مصرفي معتمد' : 'Certified Cashier Check'}
                    </div>
                    <span className="text-[10px] text-slate-400">{language === 'ar' ? 'يُسلّم بمقر المطور العقاري' : 'Handed at developer HQ'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-300">
                    {language === 'ar' 
                      ? 'استرداد كامل رأس مالك المسدد مع إبراء ذمة قانوني شامل واسترجاع كافة الشيكات الآجلة.'
                      : 'Recover all funds and receive full discharge of pending checks without penalty.'}
                  </span>
                  <button
                    onClick={() => onStartExitRequest(contractPrice, validatedPaid, developerName)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>{t('calcStartExitBtn')}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Developer Cancellation Comparison */}
              <div className="bg-white rounded-xl p-5 border border-rose-200/80 shadow-xs">
                <div className="flex items-center justify-between border-b border-rose-100 pb-2.5 mb-3">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{language === 'ar' ? 'المسار البديل: لو اخترت فسخ العقد مع المطور' : t('calcDevLossTitle')}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/70">
                    {language === 'ar' ? `خسارة ${Math.round((Math.min(calculations.developerPenalty, validatedPaid) / validatedPaid) * 100)}% من أموالك` : 'Heavy Loss'}
                  </span>
                </div>

                <div className="grid sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'ما سددته كاش:' : 'Cash Paid:'}</span>
                    <div className="text-sm font-bold text-slate-900 font-sans">
                      {formatCurrency(validatedPaid)}
                    </div>
                    <span className="text-[9px] text-slate-400">{language === 'ar' ? 'رأس مالك المدفوع' : 'Your paid capital'}</span>
                  </div>

                  <div className="bg-rose-50/60 p-2.5 rounded-lg border border-rose-200/70">
                    <span className="text-[10px] text-rose-800 block font-semibold">{language === 'ar' ? 'غرامة الفسخ (المخصومة):' : t('calcDevLossPenalty')}</span>
                    <div className="text-sm font-bold text-rose-700 font-sans">
                      -{formatCurrency(calculations.developerPenalty)}
                    </div>
                    <span className="text-[9px] text-rose-600">{language === 'ar' ? '15% من ثمن الوحدة' : '15% of contract'}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-700 block font-semibold">{language === 'ar' ? 'ما يتبقى لك فعلياً:' : 'Net Refund:'}</span>
                    <div className="text-sm font-bold text-slate-900 font-sans">
                      {formatCurrency(calculations.developerNetRefund)}
                    </div>
                    <span className="text-[9px] text-slate-500">{language === 'ar' ? 'فقط بعد الاستقطاع' : 'After penalty'}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'طريقة وتوقيت الصرف:' : 'Payout Schedule:'}</span>
                    <div className="text-xs font-bold text-slate-800 font-sans mt-0.5">
                      {language === 'ar' ? '3 سنوات شيكات آجلة' : '3-year deferred'}
                    </div>
                    <span className="text-[9px] text-slate-400">{language === 'ar' ? 'إجراءات استرداد معقدة' : 'Delayed refund'}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
