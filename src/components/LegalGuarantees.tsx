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
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0f766e]/30 text-[#2dd4bf] border border-[#0f766e]/50 text-xs font-bold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الحماية القانونية والأمان المالي' : 'Legal Protection & Financial Security'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'ar' ? (
              <>الأركان الأربعة <span className="text-[#2dd4bf]">لأمان التنازل ونقل الملكية</span></>
            ) : (
              <>The Four Pillars of <span className="text-[#2dd4bf]">Safe Assignment & Ownership Transfer</span></>
            )}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            {language === 'ar' 
              ? 'صممنا النموذج القانوني لضمان حقوق الطرفين 100% داخل المقر الرسمي للمطور العقاري.' 
              : 'We engineered the legal framework to safeguard 100% of both parties\' rights exclusively at developer headquarters.'}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          
          <div className={`bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-10 h-10 rounded-lg bg-[#0f766e]/20 text-[#2dd4bf] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {language === 'ar' ? '1. التنازل الرسمي بمقر شركة التطوير فقط' : '1. Official Transfer Exclusively at Developer HQ'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'مفيش توكيلات في الشهر العقاري ولا أوراق عرفية خارج الشركة. كل الإجراءات بتتم بحضور الطرفين ومحامي المنصة داخل إدارة خدمة العملاء بالمقر الرئيسي للمطور.'
                : 'Zero risky notary powers of attorney or unofficial contracts. Every step is executed with both parties and our legal counsel at the developer\'s customer relations department.'}
            </p>
          </div>

          <div className={`bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-10 h-10 rounded-lg bg-[#0f766e]/20 text-[#2dd4bf] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {language === 'ar' ? '2. استرداد شيكات البائع وإبراء الذمة' : '2. Complete Check Discharge & Release'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'المطور بيسلم البايع كافة شيكاته المؤجلة غير المستحقة ويتم إتلافها أو تسليمها مع مخالصة مالية نهائية تفيد بنقل كافة التزامات الوحدة للمشتري الجديد.'
                : 'The developer returns all future uncashed checks to the seller, issuing a final financial clearance discharging them from all liability.'}
            </p>
          </div>

          <div className={`bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-10 h-10 rounded-lg bg-[#0f766e]/20 text-[#2dd4bf] flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {language === 'ar' ? '3. سداد كاش آمن بشيك مصرفي مقبول الدفع' : '3. Certified Cashier Check Payment'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'البايع بيستلم فلوسه اللي دفعها كاملة بشيك مصرفي معتمد (Banker\'s Draft) صادر من بنك معتمد ومسجل باسمه، لحظة توقيع التنازل لدى المطور.'
                : 'Sellers receive 100% of their paid cash via a verified cashier\'s check (Banker\'s Draft) in their name at the moment of signing at developer HQ.'}
            </p>
          </div>

          <div className={`bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="w-10 h-10 rounded-lg bg-[#0f766e]/20 text-[#2dd4bf] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              {language === 'ar' ? '4. مطابقة كشف الحساب والعقد قبل العرض' : '4. Pre-Listing Audit & Statement Reconciliation'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ar'
                ? 'فريق الفحص بيتأكد من سداد كافة الأقساط المستحقة وعدم وجود أي غرامات تأخير أو نزاعات، ومطابقة الجدول الزمني للتسليم.'
                : 'Our audit team validates all paid installments, confirms zero penalties or disputes, and reconciles delivery milestones prior to listing.'}
            </p>
          </div>

        </div>

        {/* Compatibility Bar */}
        <div className={`mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'} flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400`}>
          <div>
            {language === 'ar' ? (
              <>🤝 متوافقون مع لوائح التنازل لكبرى الشركات: <span className="text-white font-bold">بالم هيلز، سوديك، ماونتن فيو، إعمار مصر، طلعت مصطفى، أورا، وصبور</span>.</>
            ) : (
              <>🤝 Fully compliant with transfer bylaws of top developers: <span className="text-white font-bold">Palm Hills, SODIC, Mountain View, Emaar Misr, TMG, ORA, and Sabbour</span>.</>
            )}
          </div>
          <span className="text-[#2dd4bf] font-medium">
            {language === 'ar' ? 'فريق قانوني متخصص في عقود التطوير' : 'Specialized Developer Contract Legal Team'}
          </span>
        </div>

      </div>
    </section>
  );
};
