import React from 'react';
import { 
  Building2, 
  Lock, 
  Coins, 
  FileText, 
  Scale, 
  ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LegalGuarantees: React.FC = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section id="legal-guarantees" className="py-20 bg-[#0f172a] text-white relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-teal-300 text-xs font-medium mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الحماية القانونية والأمان المالي' : 'Legal Protection & Financial Security'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {language === 'ar' ? (
              <>الأركان الأربعة لأمان التنازل ونقل الملكية</>
            ) : (
              <>The Four Pillars of Safe Assignment</>
            )}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            {language === 'ar' 
              ? 'صممنا النموذج القانوني لضمان حقوق الطرفين 100% داخل المقر الرسمي للمطور العقاري.' 
              : 'Safeguarding both parties\' rights exclusively at developer headquarters.'}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          
          <div className={`bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-8 h-8 rounded-lg bg-teal-900/50 text-teal-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {language === 'ar' ? '1. التنازل بمقر شركة التطوير حصراً' : '1. Exclusively at Developer HQ'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'لا توكيلات ولا عقود عرفية. نقل التعاقد يتم رسمياً داخل خدمة عملاء المطور وبحضور ممثل المنصة.'
                : 'Zero unofficial contracts. Everything happens inside the developer customer relations office.'}
            </p>
          </div>

          <div className={`bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-8 h-8 rounded-lg bg-teal-900/50 text-teal-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {language === 'ar' ? '2. استرداد شيكاتك البنكية وإبراء الذمة' : '2. Bank Checks Return & Clearance'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'استلام كافة الشيكات الآجلة غير المصروفة فور التوقيع، مع إبراء ذمة مالي وقانوني كامل من المطور.'
                : 'Receive all uncashed future checks upon transfer with full discharge from all liabilities.'}
            </p>
          </div>

          <div className={`bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-8 h-8 rounded-lg bg-teal-900/50 text-teal-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {language === 'ar' ? '3. استلام كامل كاشك بشيك مصرفي مقبول الدفع' : '3. Certified Cashier Check'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'تسترد كامل رأس مالك المسدد بشيك مصرفي مضمون وصادر باسمك يُسلّم لك لحظة توقيع التنازل.'
                : '100% of your paid cash returned via guaranteed cashier check issued in your name.'}
            </p>
          </div>

          <div className={`bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-8 h-8 rounded-lg bg-teal-900/50 text-teal-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {language === 'ar' ? '4. تدقيق كشف الحساب مجاناً للبائع' : '4. Fast Statement Verification'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'مراجعة الموقف المالي مجاناً، والتأكد من صحة المدفوعات لضمان عدم وجود أي مفاجآت أو مصاريف خفية.'
                : 'Free validation of statements and dues to ensure seamless transfer with zero surprises.'}
            </p>
          </div>

        </div>

        {/* Compatibility Bar */}
        <div className={`mt-8 bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'} flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400`}>
          <div>
            {language === 'ar' ? (
              <>متوافقون مع إجراءات التنازل لكبرى الشركات: <span className="text-slate-200 font-medium">بالم هيلز، سوديك، ماونتن فيو، إعمار مصر، طلعت مصطفى، أورا، وصبور</span>.</>
            ) : (
              <>Compliant with transfer bylaws of major developers: <span className="text-slate-200 font-medium">Palm Hills, SODIC, Mountain View, Emaar, TMG, ORA, Sabbour</span>.</>
            )}
          </div>
          <span className="text-slate-400">
            {language === 'ar' ? 'فريق قانوني متخصص' : 'Specialized Legal Team'}
          </span>
        </div>

      </div>
    </section>
  );
};
