import React from 'react';
import { 
  Calculator, 
  UploadCloud, 
  FileCheck2, 
  Users2, 
  Building2, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t, language } = useLanguage();

  const steps = [
    {
      number: '01',
      title: language === 'ar' ? 'سجل بيانات شقتك' : 'Submit Details',
      desc: language === 'ar'
        ? 'اسم المشروع، المدفوع كاش، وجدول الأقساط المتبقية للمطور.'
        : 'Compound name, paid cash, and remaining developer installments.'
    },
    {
      number: '02',
      title: language === 'ar' ? 'التدقيق مع المطور' : 'Developer Audit',
      desc: language === 'ar'
        ? 'فحص ومطابقة الموقف المالي وكشف الحساب رسمياً في ساعتين.'
        : 'Reconciling financial statement with developer in 2 hours.'
    },
    {
      number: '03',
      title: language === 'ar' ? 'توفير المشتري الكاش' : 'Buyer Matching',
      desc: language === 'ar'
        ? 'توجيه الشقة لمشتري كاش جاهز يسترد منك مدفوعاتك بالكامل.'
        : 'Direct matching with a ready buyer to repay 100% of your paid cash.'
    },
    {
      number: '04',
      title: language === 'ar' ? 'التنازل واستلام فلوسك' : 'HQ Transfer & Payout',
      desc: language === 'ar'
        ? 'توقع التنازل بمقر المطور، تستلم شيك مصرفي، وتسترجع شيكاتك القديمة.'
        : 'Official signing at developer HQ: receive certified check & retrieve checks.'
    }
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-18 bg-white border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200/60">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('howItWorks')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {language === 'ar' ? 'كيف يتم التنازل في 4 خطوات بسيطة؟' : 'How Assignment Works in 4 Quick Steps'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {language === 'ar'
              ? 'إجراءات قانونية واضحة ومباشرة تضمن استرداد كاشك 100% بدون أي وجع دماغ.'
              : 'Clear, direct legal steps ensuring 100% cash recovery without stress.'}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-3 hover:border-slate-300 hover:bg-white transition-all shadow-xs"
            >
              <div>
                <div className="text-xl font-black text-teal-700 font-sans mb-2">
                  {s.number}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[11px] font-semibold text-teal-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>{language === 'ar' ? 'رسمي بمقر المطور' : 'Official Developer Transfer'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 bg-slate-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base sm:text-lg text-white">
              {language === 'ar' ? 'جاهز تبدأ إجراءات الخروج الآمن لوحدتك؟' : 'Ready to start your safe exit?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {language === 'ar'
                ? 'مجانًا تمامًا للبائع — لا نتقاضى أي عمولة أو مصاريف تسجيل منك.'
                : '100% Free for Sellers — Zero commission or registration charges.'}
            </p>
          </div>
          <a
            href="#calculator"
            className="px-6 py-2.5 sm:py-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            {language === 'ar' ? 'احسب خروجك الآن' : 'Calculate Exit Now'}
          </a>
        </div>

      </div>
    </section>
  );
};
