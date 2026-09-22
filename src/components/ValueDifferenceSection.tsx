import React from 'react';
import { 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Coins, 
  FileCheck, 
  Users, 
  Zap, 
  Lock 
} from 'lucide-react';
import { BrandSuggestion } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ValueDifferenceProps {
  currentBrand: BrandSuggestion;
  onOpenAddUnit: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const ValueDifferenceSection: React.FC<ValueDifferenceProps> = ({
  currentBrand,
  onOpenAddUnit,
  onScrollToSection
}) => {
  const { t, language, isRTL } = useLanguage();

  return (
    <section id="comparison" className="py-20 bg-[#f5f6f8] border-b border-[#e5e7eb]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-20">
        
        {/* Two-Sided Proposition */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
              {language === 'ar' 
                ? 'طرف يبحث عن التخارج الآمن، وآخر ينتظر الفرصة الاستثمارية'
                : 'One Party Needs to Exit, One Awaits the Deal — We Bridge the Gap'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {language === 'ar'
                ? 'منظومة تعاقدية حصرية ترتكز على مبدأ "صفر أوفر برايس": يسترد البائع كامل رأس ماله المسدد دون أي استقطاعات، ويكتسب المشتري حق الحلول التعاقدي بنفس سعر وتسهيلات الطرح الأصلي.'
                : 'This is not traditional resale: strictly 0% overprice. Sellers claim back their exact paid cash, while buyers inherit original past pricing.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Card 1: البائع */}
            <div className="bg-white rounded-2xl border border-[#cbd2d9] p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#0f766e] transition-all">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold border border-[#d1fae5]">
                  {language === 'ar' ? 'البائع — مالك الوحدة التعاقدية' : 'The Seller — Property Owner'}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
                  {language === 'ar' ? 'صفر أوفر برايس = أعلى سرعة إنجاز للتنازل' : '0% Overprice = Fastest Exit in the Market'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'بطرح وحدتك بقيمة رأس المال المدفوع فعلياً دون أي هوامش ربحية مضاربية، تكتسب الوحدة أولوية استثمارية قصوى لدى المشترين الجادين، محققة سرعة تخارج قياسية واسترداداً فورياً للسيولة دون الخضوع لغرامات الفسخ أو الجدولة الممتدة لدى المطور.'
                    : 'Because you ask only for your actual cash paid with zero markup, your property becomes the most attractive opportunity in the market — exiting in days. You claim 100% of your funds instead of developer penalties and delayed installments.'}
                </p>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>
                      {language === 'ar' ? (
                        <><strong>استرداد 100% من رأس المال المسدد</strong> — بشيك مصرفي معتمد فور إتمام التنازل الرسمي.</>
                      ) : (
                        <><strong>Recover 100% of your paid cash</strong> — Certified cashier check handed over at developer HQ.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>
                      {language === 'ar' ? (
                        <><strong>سرية تعاقدية تامة وحماية مطلقة للبيانات</strong> — دون إعلانات عامة أو وساطة عشوائية.</>
                      ) : (
                        <><strong>Zero public ads & spam broker calls</strong> — Total confidentiality of your unit info.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>
                      {language === 'ar' ? (
                        <><strong>إشراف قانوني كامل على ملف التنازل</strong> ومطابقة استرداد كامل الشيكات الآجلة وإبراء الذمة.</>
                      ) : (
                        <><strong>We assemble the transfer dossier</strong> and accompany you until all pending checks are returned.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>
                      {language === 'ar' ? (
                        <><strong>خدمة مجانية للبائع بالكامل</strong> — لا تتقاضى المنصة أي نسبة أو عمولة من البائع المتنازل.</>
                      ) : (
                        <><strong>100% Free for Sellers</strong> — {currentBrand.nameEn} takes zero commission from you.</>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenAddUnit}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>{t('sellGetCash')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Card 2: المشتري */}
            <div className="bg-white rounded-2xl border border-[#cbd2d9] p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:border-[#0f766e] transition-all">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                  {language === 'ar' ? 'المشتري' : 'The Buyer'}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
                  {language === 'ar' ? 'شراء وحدات بالتقسيط بصفر أوفر برايس' : 'Installment Units with 0% Overprice'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'امتلاك الوحدة بسعر تعاقدها التأسيسي الأصلي، محققاً وفراً مالياً بملايين الجنيهات مقارنة بأسعار الطروحات الحالية لدى المطور، مع استكمال سداد الأقساط المتبقية دون أي فوائد أو أوفر برايس.'
                    : 'Acquire high-demand units at previous developer pricing — saving millions compared to current developer rates — and continue standard installments with zero overprice markup.'}
                </p>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>
                      {language === 'ar' ? (
                        <><strong>سعر التعاقد التأسيسي الأصلي دون أي زيادة</strong> — حظر تام لأي مبالغ إضافية أو أوفر برايس.</>
                      ) : (
                        <><strong>Original Contract Price Intact</strong> — Overprice is strictly prohibited.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>
                      {language === 'ar' ? (
                        <><strong>تدقيق مالي وقانوني معتمد للعقود وكشوف الحسابات</strong> قبل اعتماد ونشر أي فرصة.</>
                      ) : (
                        <><strong>Contracts & bank statements audited</strong> before units are ever displayed.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>
                      {language === 'ar' ? (
                        <><strong>نقل ملكية وتنازل رسمي بسجلات المطور العقاري</strong> — حظر قاطع للتوكيلات أو العقود العرفية.</>
                      ) : (
                        <><strong>Official developer assignment</strong> — strictly no precarious powers of attorney.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>
                      {language === 'ar' ? (
                        <><strong>رسوم توثيق وتدقيق مخفضة 1.25% فقط</strong> تُستحق حصرياً عقب اكتمال التنازل الرسمي بمقر المطور.</>
                      ) : (
                        <><strong>Modest 1.25% audit & verification fee</strong> payable strictly upon successful transfer completion at developer HQ.</>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onScrollToSection('listings')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>{t('exploreOpportunities')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

        {/* Comparison Table */}
        <div className="pt-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
              {t('comparisonTableTitle')}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {t('comparisonTableSub')}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#cbd2d9] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} text-xs sm:text-sm border-collapse`}>
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-slate-50 text-[#0f172a]">
                    <th className="p-4 sm:p-5 font-bold w-1/4">{t('featureCol')}</th>
                    <th className="p-4 sm:p-5 font-bold text-slate-500 w-3/8">{t('brokerCol')}</th>
                    <th className="p-4 sm:p-5 font-bold text-[#0f766e] bg-[#ecfdf5]/70 w-3/8">
                      {language === 'ar' ? currentBrand.nameAr : currentBrand.nameEn} ({t('platformCol')})
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0f172a] bg-slate-50/50">{t('compRow1Feature')}</td>
                    <td className="p-4 sm:p-5 text-slate-600">{t('compRow1Broker')}</td>
                    <td className="p-4 sm:p-5 font-bold text-[#0f766e] bg-[#ecfdf5]/30">{t('compRow1Platform')}</td>
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0f172a] bg-slate-50/50">{t('compRow2Feature')}</td>
                    <td className="p-4 sm:p-5 text-slate-600">{t('compRow2Broker')}</td>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 bg-[#ecfdf5]/30">{t('compRow2Platform')}</td>
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0f172a] bg-slate-50/50">{t('compRow3Feature')}</td>
                    <td className="p-4 sm:p-5 text-slate-600">{t('compRow3Broker')}</td>
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 bg-[#ecfdf5]/30">{t('compRow3Platform')}</td>
                  </tr>

                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0f172a] bg-slate-50/50">{t('compRow4Feature')}</td>
                    <td className="p-4 sm:p-5 text-slate-600">{t('compRow4Broker')}</td>
                    <td className="p-4 sm:p-5 font-bold text-[#0f766e] bg-[#ecfdf5]/30">{t('compRow4Platform')}</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* معايير الخروج العادل */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
              {language === 'ar' ? 'معايير الخروج العادل' : 'Fair Exit Standards'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {language === 'ar' ? 'مبادئ نلتزم بها لحماية كافة الأطراف بدون ضغوط أو مفاجآت.' : 'Strict principles protecting both parties without pressure or hidden terms.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`space-y-2 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
              <div className={`w-10 h-10 rounded-xl bg-slate-100 text-[#0f766e] flex items-center justify-center mb-3 mx-auto ${isRTL ? 'sm:mr-0' : 'sm:ml-0'}`}>
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0f172a]">
                {language === 'ar' ? 'كل رقم له مصدر' : 'Every Number is Audited'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'مفيش تقريب ولا تخمين. كل جنيه معروض موثق بإيصال سداد أو كشف حساب معتمد.'
                  : 'Zero speculation. Every figure is confirmed with developer receipts or certified account statements.'}
              </p>
            </div>

            <div className={`space-y-2 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
              <div className={`w-10 h-10 rounded-xl bg-slate-100 text-[#0f766e] flex items-center justify-center mb-3 mx-auto ${isRTL ? 'sm:mr-0' : 'sm:ml-0'}`}>
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0f172a]">
                {language === 'ar' ? 'مجانًا للبايع بالكامل' : '100% Free for Sellers'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'البايع مش بيدفع مليم واحد لا في التقييم ولا عند استلام فلوسه كاش.'
                  : 'Sellers pay 0% fees — no evaluation costs and no exit commission.'}
              </p>
            </div>

            <div className={`space-y-2 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
              <div className={`w-10 h-10 rounded-xl bg-slate-100 text-[#0f766e] flex items-center justify-center mb-3 mx-auto ${isRTL ? 'sm:mr-0' : 'sm:ml-0'}`}>
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0f172a]">
                {language === 'ar' ? 'خصوصيتك محفوظة' : 'Guaranteed Privacy'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'بياناتك ورقم وحدتك لا تظهر علناً في إعلانات، ولا نبيع بياناتك لشركات تسويق.'
                  : 'Unit numbers and personal contact info are never publicly listed or shared with telemarketers.'}
              </p>
            </div>

            <div className={`space-y-2 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
              <div className={`w-10 h-10 rounded-xl bg-slate-100 text-[#0f766e] flex items-center justify-center mb-3 mx-auto ${isRTL ? 'sm:mr-0' : 'sm:ml-0'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#0f172a]">
                {language === 'ar' ? 'من غير أي ضغط' : 'Zero Pressure'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'لك مطلق الحرية في قبول أو رفض أي عرض شراء حتى اللحظة الأخيرة قبل الإمضاء.'
                  : 'You hold total authority to accept or decline buyer offers up until signing at developer HQ.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
