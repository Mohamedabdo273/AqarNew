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
      title: language === 'ar' ? 'تقييم الموقف المالي' : 'Evaluate Financial Position',
      desc: language === 'ar'
        ? 'إدخال بيانات الوحدة التعاقدية (إجمالي التعاقد، رأس المال المسدد، وجدول الأقساط) لتحديد سيناريو التخارج واسترداد المستحقات بدقة.'
        : 'Input your numbers: total contract value, paid capital, and remaining installments. Calculate your financial scenario accurately.'
    },
    {
      number: '02',
      title: language === 'ar' ? 'التدقيق القانوني والمستندي' : 'Documentary & Legal Audit',
      desc: language === 'ar'
        ? 'رفع صورة العقد وآخر إيصال سداد مصرفي لمطابقة المركز المالي وإجراء الاستعلام المعتمد لدى إدارة خدمة العملاء بشركة التطوير.'
        : 'Upload the contract & latest payment receipts. Our legal auditors verify standing with the developer in strict confidence.'
    },
    {
      number: '03',
      title: language === 'ar' ? 'الاعتماد وإدراج الفرصة' : 'Audit Approval & Listing',
      desc: language === 'ar'
        ? 'مراجعة كشف الحساب البنكي واعتماد الوحدة رسمياً بنظام "صفر أوفر برايس" وبسعر التعاقد التأسيسي المسدد فقط.'
        : 'We reconcile developer statements to the penny and publish your unit strictly under zero overprice policy.'
    },
    {
      number: '04',
      title: language === 'ar' ? 'المطابقة مع المشتري المعتمد' : 'Certified Buyer Matching',
      desc: language === 'ar'
        ? 'توجيه الفرصة لمشتري استثماري جاد ملتزم بسداد كامل رأس المال المسدد فوراً واستكمال سداد باقي الأقساط للمطور.'
        : 'We match your unit with a verified buyer committed to repaying your paid capital upfront and assuming future installments.'
    },
    {
      number: '05',
      title: language === 'ar' ? 'التنازل الرسمي بمقر المطور' : 'Official Assignment at Developer HQ',
      desc: language === 'ar'
        ? 'إتمام إجراءات التنازل القانوني وسحب وإبراء ذمة الشيكات الآجلة واستلام شيك مصرفي معتمد بكامل رأس المال المسدد.'
        : 'Complete official transfer at developer headquarters: collect your cashier check, retrieve all pending checks, and receive full discharge.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-[#e5e7eb]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold mb-2 border border-[#d1fae5]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('howItWorks')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            {language === 'ar' ? 'مراحل التنازل ونقل الملكية المعتمدة' : 'Certified Transfer & Exit Workflow'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            {language === 'ar'
              ? 'إجراءات تعاقدية محكمة وموثقة قانونياً تضمن استرداد كامل رأس مالك دون تعريضك لغرامات الفسخ.'
              : 'Simple, legally documented milestones ensuring 100% recovery without developer penalties or broker hassle.'}
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className="bg-[#f5f6f8] rounded-2xl border border-[#e5e7eb] p-5 flex flex-col justify-between space-y-3 relative hover:border-[#0f766e] transition-all group"
            >
              <div>
                <div className="text-2xl font-black text-[#0f766e] font-sans mb-3">
                  {s.number}
                </div>
                <h3 className="font-bold text-base text-[#0f172a] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-[#0f766e] flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <ShieldCheck className="w-3 h-3" />
                <span>{language === 'ar' ? 'إجراء رسمي ومضمون' : 'Certified Official Transfer'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 bg-[#0f172a] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-white">
              {language === 'ar' ? 'جاهز تبدأ إجراءات الخروج الآمن لوحدتك؟' : 'Ready to start your safe exit?'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'ar'
                ? 'مجانًا تمامًا للبائع — لا نتقاضى أي عمولة أو مصاريف تسجيل منك.'
                : '100% Free for Sellers — Zero commission or registration charges.'}
            </p>
          </div>
          <a
            href="#calculator"
            className="px-6 py-3 rounded-lg bg-[#0f766e] hover:bg-[#115e59] text-white text-xs sm:text-sm font-bold transition-all shrink-0"
          >
            {language === 'ar' ? 'احسب خروجك الآن' : 'Calculate Exit Now'}
          </a>
        </div>

      </div>
    </section>
  );
};
