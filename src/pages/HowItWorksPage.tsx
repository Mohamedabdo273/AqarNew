import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Coins, 
  ArrowLeft, 
  ArrowRight,
  Scale, 
  FileCheck, 
  HelpCircle, 
  AlertCircle, 
  Calendar, 
  Lock,
  ChevronDown
} from 'lucide-react';
import { BrandSuggestion, PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HowItWorksPageProps {
  currentBrand: BrandSuggestion;
  onNavigate: (page: PageId) => void;
  onOpenAddUnit: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  currentBrand,
  onNavigate,
  onOpenAddUnit
}) => {
  const { t, language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller');

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-[#f5f6f8] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold border border-[#d1fae5]">
            <Scale className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إجراءات موثقة خطوة بخطوة' : 'Documented Step-by-Step Milestones'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-tight">
            {language === 'ar' ? (
              <>إزاي بنشتغل في <span className="text-[#0f766e]">{currentBrand.nameAr}</span>؟</>
            ) : (
              <>How it works at <span className="text-[#0f766e]">{currentBrand.nameEn}</span></>
            )}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {language === 'ar'
              ? 'دليل عملي تفصيلي يوضح كل خطوة يمر بها البائع والمشتري من لحظة تقديم الطلب حتى توقيع التنازل واستلام الأموال والشيكات بمقر شركة التطوير العقاري.'
              : 'A comprehensive operational roadmap outlining every milestone for sellers and buyers from initial submission to developer HQ contract assignment and check retrieval.'}
          </p>
        </div>

        {/* Persona Switcher Tabs */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-xl border border-[#cbd2d9] inline-flex items-center gap-2 shadow-xs">
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'seller'
                  ? 'bg-[#0f172a] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'ar' ? 'دليل البائع (المتنازل)' : 'Seller Playbook (Exit)'}
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'buyer'
                  ? 'bg-[#0f766e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'ar' ? 'دليل المشتري (المستثمر)' : 'Buyer Playbook (Invest)'}
            </button>
          </div>
        </div>

        {/* Steps Content */}
        {activeTab === 'seller' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#cbd2d9] p-6 sm:p-10 shadow-xs">
              <div className="max-w-2xl mb-8">
                <span className="text-xs font-bold text-[#0f766e] uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'رحلة البائع في 5 خطوات آمنة' : 'The Seller Journey in 5 Secure Steps'}
                </span>
                <h2 className="text-2xl font-black text-[#0f172a]">
                  {language === 'ar' 
                    ? 'كيف تسترد مدفوعاتك كاش وتتخلص من التزام الشيكات؟'
                    : 'How to recover 100% of your paid cash and discharge future checks'}
                </h2>
              </div>

              <div className={`space-y-8 relative before:absolute ${isRTL ? 'before:right-6 sm:before:right-8' : 'before:left-6 sm:before:left-8'} before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200`}>
                
                {/* Step 1 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    1
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'تقديم بيانات الوحدة وحساب المدفوع' : 'Submit Contract Figures & Cash Paid'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'تقوم بإدخال تفاصيل وحدتك: اسم المطور، المشروع، إجمالي ثمن الوحدة في العقد، والمبلغ الدقيق الذي سددته حتى تاريخه. يمكنك استخدام حاسبة الخروج لمعرفة أرقامك فوراً.'
                        : 'Enter your unit parameters: developer name, compound, total contract price, and certified paid cash. Use our instant calculator to model scenarios.'}
                    </p>
                    <div className="inline-block text-[11px] bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-medium">
                      ⏱ {language === 'ar' ? 'الوقت المستغرق: دقيقتان فقط' : 'Time required: 2 minutes'}
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0f766e] text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    2
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'فحص ومطابقة المستندات مع إدارة المطور' : 'Legal & Ledger Audit with Developer'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'فريقنا القانوني يتأكد من كشف الحساب المعتمد ومطابقة إيصالات السداد، والتأكد من عدم وجود غرامات تأخير أو موانع للتنازل في لائحة المطور العقاري الخاصة بالمشروع.'
                        : 'Our legal team reconciles account statements, verifies payment receipts, and confirms the absence of assignment restrictions under developer bylaws.'}
                    </p>
                    <div className="inline-block text-[11px] bg-[#ecfdf5] text-[#0f766e] px-3 py-1 rounded-md font-bold">
                      ✓ {language === 'ar' ? 'سرية تامة: رقم وحدتك وهويتك لا تظهر للعامة' : '100% Confidential: Private data is never publicly shared'}
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    3
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'تجهيز الفرصة وعرضها للمشترين الجادين' : 'Matchmaking Qualified Buyers (0% Overprice)'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'نعرض الوحدة على شبكة المستثمرين والراغبين في الشراء بدون أوفر (0 EGP Overprice). لأن الوحدة معروضة بسعر العقد القديم وبدون أوفر، فإنها تحظى بأعلى إقبال وطلب في السوق.'
                        : 'We present the property across our institutional investor network at strict 0% overprice. Priced at original past levels, it receives maximum buyer interest within days.'}
                    </p>
                    <div className="inline-block text-[11px] bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-medium">
                      🎯 {language === 'ar' ? 'متوسط وقت الحصول على مشتري جاد: من 3 إلى 7 أيام' : 'Average time to qualified buyer: 3-7 days'}
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0f766e] text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    4
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'التحقق من المشتري وحجز موعد التنازل الرسمي' : 'Buyer Verification & Closing Booking'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'نتحقق من جاهزية المشتري المالية وتجهيزه للشيك المصرفي المقبول الدفع الموجه باسمك، ونقوم بالتنسيق مع إدارة خدمة العملاء في مقر شركة التطوير لتحديد موعد التنازل الرسمي.'
                        : 'We verify buyer solvency, ensure the issuance of a certified cashier check in your name, and coordinate the formal appointment with developer customer service.'}
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    5
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'التوقيع بمقر المطور، استلام الكاش، واسترداد الشيكات' : 'Assignment at HQ, Certified Cashier Check & Voided Checks'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'في المقر الرئيسي للمطور وبحضور محامينا: تستلم الشيك المصرفي المعتمد بكامل المبلغ المدفوع (100%)، ويتم نقل العقد رسمياً للمشتري، وتسليمك شيكاتك المؤجلة لإتلافها مع مخالصة نهائية تبرئ ذمتك تماماً.'
                        : 'At developer headquarters with legal representation: collect your 100% cashier check, execute the contract annex, and receive your remaining checks for immediate disposal alongside full financial release.'}
                    </p>
                    <div className="inline-block text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-md font-bold">
                      🎉 {language === 'ar' ? 'عمولتك 0% — خرجت بفلوسك كاملة بدون خسارة مليم!' : '0% Seller Commission — 100% clean capital recovery!'}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#cbd2d9] p-6 sm:p-10 shadow-xs">
              <div className="max-w-2xl mb-8">
                <span className="text-xs font-bold text-[#0f766e] uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'رحلة المشتري في 5 خطوات ذكية' : 'The Buyer Journey in 5 Strategic Steps'}
                </span>
                <h2 className="text-2xl font-black text-[#0f172a]">
                  {language === 'ar'
                    ? 'كيف تشتري وحدة تقسيط بسعر زمان وبدون دفع جنيه أوفر؟'
                    : 'How to purchase prime installment property at past prices with 0% overprice'}
                </h2>
              </div>

              <div className={`space-y-8 relative before:absolute ${isRTL ? 'before:right-6 sm:before:right-8' : 'before:left-6 sm:before:left-8'} before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200`}>
                
                {/* Buyer Step 1 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0f766e] text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    1
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'تصفح الفرص الحقيقية والمطابقة في السوق' : 'Explore Verified Opportunities'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'استكشف الوحدات المتاحة في كبرى الكمبوندات (القاهرة الجديدة، الشيخ زايد، الساحل، العاصمة). كل وحدة موضّح أمامها بدقة: ثمن العقد الأصلي، الكاش المطلوب للبائع، والمتبقي أقساط للمطور.'
                        : 'Browse available units across top master-developments (New Cairo, Zayed, North Coast, New Capital). Every unit displays verified original contracts, paid cash, and future installments.'}
                    </p>
                  </div>
                </div>

                {/* Buyer Step 2 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    2
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'حساب التوفير الفعلي مقارنة بأسعار اليوم' : 'Calculate Instant Capital Savings'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'بما أنك تشتري بسعر العقد القديم وبدون أوفر، فإنك توفر من 25% إلى 50% مقارنة بنفس الوحدة لو اشتريتها من المطور اليوم، مع الاستفادة من خطة أقساط مريحة وممتدة.'
                        : 'Because you buy at contract origin without overprice, you immediately capture 25%-50% equity gains versus developer retail rates, while maintaining long payment terms.'}
                    </p>
                  </div>
                </div>

                {/* Buyer Step 3 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0f766e] text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    3
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'طلب المعاينة والاطلاع على كشف الحساب' : 'Review Certified Ledger & Site Inspection'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'نزودك بكافة تفاصيل جدول الأقساط القادمة المعتمد من الشركة، نسب التنفيذ على أرض الواقع، ونموذج التنازل المعتمد لدى المطور.'
                        : 'We supply certified payment schedules, real construction milestones, and verified assignment templates directly from the developer.'}
                    </p>
                  </div>
                </div>

                {/* Buyer Step 4 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    4
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'إصدار الشيك المصرفي وشيكات الأقساط' : 'Issue Certified Cashier Check & Installment Checks'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'تقوم بإصدار شيك مصرفي مقبول الدفع (Banker\'s Cheque) باسم البائع بقيمة ما دفعه فقط، وتجهيز شيكاتك البنكية بالأقساط المتبقية باسم شركة التطوير العقاري.'
                        : 'Issue a guaranteed cashier check payable to the seller for their exact paid cash, and prepare your bank checkbook for remaining installments to the developer.'}
                    </p>
                  </div>
                </div>

                {/* Buyer Step 5 */}
                <div className="flex gap-4 sm:gap-6 relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0 z-10 shadow-sm">
                    5
                  </div>
                  <div className="space-y-2 pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {language === 'ar' ? 'توقيع التنازل بمقر المطور واستلام العقد الملحق' : 'Execute Assignment at HQ & Receive Contract Annex'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {language === 'ar'
                        ? 'يتم التوقيع الرسمي داخل إدارة خدمة العملاء بالمقر الرئيسي لشركة التطوير، وإصدار ملحق عقد باسمك أو عقد جديد، وتصبح الوحدة ملكك قانونياً مباشرة من المطور.'
                        : 'Sign the official assignment at developer customer service desks, obtain your official contract amendment in your name, and assume clean legal ownership directly from the developer.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* RULES & PROTOCOL SECTION: ميثاق وقواعد التنازل بين البائع والمشتري */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs">
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-[#2dd4bf]" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                  {language === 'ar' ? 'ميثاق الشفافية والعدالة التعاقدية' : 'Platform Governance & Protocol'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {language === 'ar'
                    ? 'قواعد وشروط التنازل بين البائع والمشتري'
                    : 'Official Rules & Commitments: Buyer & Seller'}
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {language === 'ar'
                ? 'وضعت هذه القواعد بدقة لحماية حقوق الطرفين بالتساوي: يحصل المشتري على فرصة استثمارية بسعر قديم وبدون أوفر، ويسترد البائع كامل أمواله المسددة نقداً مع براءة ذمة فورية من المطور.'
                : 'Formulated to protect both parties equally: buyers secure past-contract pricing with 0% overprice, and sellers exit smoothly with 100% verified cash and full legal discharge.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-6 bg-slate-50/50">
            {/* 1. قواعد والتزامات المشتري */}
            <div className="bg-white rounded-xl border border-teal-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-teal-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#0f766e] text-white flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <h4 className="text-base font-black text-[#0f172a]">
                    {language === 'ar' ? 'قواعد والتزامات المشتري (Buyer Rules)' : 'Buyer Rules & Obligations'}
                  </h4>
                </div>
                <span className="text-[10px] font-black text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {language === 'ar' ? 'المستفيد من السعر القديم' : 'Capturing 0% Overprice'}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'رسوم التنازل لدى المطور (Transfer Fee):' : 'Developer Transfer Fees:'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'يتحملها المشتري بالكامل لشركة التطوير العقاري (إلا إذا كانت الوحدة معفاة بنص عقدها الأصلي)، وذلك نظير حصوله على فرق سعري وأقساط قديمة توفر ملايين الجنيهات.'
                        : 'Borne 100% by the buyer payable to the developer (unless contractually exempt), in return for acquiring deep grandfathered pricing and saving millions.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'شيك مصرفي معتمد ومقبول الدفع للبائع:' : 'Certified Bank Cashier Check to Seller:'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'إصدار شيك مصرفي مقبول الدفع باسم البائع بكامل المبلغ المسدد منه للمطور فعلياً، ويتم تسليمه للبائع يداً بيد أثناء التوقيع بمقر المطور.'
                        : 'Issuance of a certified cashier check in the seller\'s name covering the exact verified paid capital, handed over during the official signing.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'دفتر شيكات بنكية شخصية سارية:' : 'Valid Bank Checkbook for Remaining Dues:'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'إحضار دفتر شيكات بنكي شخصي ساري لتحرير الأقساط المؤجلة المتبقية لشركة التطوير لاستبدال شيكات البائع القديمة.'
                        : 'Bringing a valid personal checkbook to issue all remaining future installment checks payable to the developer.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'وديعة الصيانة والمصروفات الإدارية:' : 'Maintenance Deposit & Operating Dues:'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'يلتزم المشتري باستكمال أي دفعات صيانة مستحقة وقت الاستلام وفقاً للجدول الزمني المحدد من قبل المطور.'
                        : 'Buyer assumes scheduled maintenance deposits upon delivery per developer milestones.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'عمولة المنصة الرمزية (1.25%):' : 'Reduced Platform Brokerage (1.25%):'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'يتحملها المشتري فقط مقابل الفحص القانوني، مطابقة الحسابات بمقر المطور، وتأمين جلسة التنازل الرسمية (0% عمولة على البائع).'
                        : 'Covered exclusively by the buyer for full legal auditing, developer account matching, and closing facilitation (0% seller fee).'}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 2. قواعد والتزامات البائع */}
            <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#0f172a] text-white flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <h4 className="text-base font-black text-[#0f172a]">
                    {language === 'ar' ? 'قواعد والتزامات البائع (Seller Rules)' : 'Seller Rules & Obligations'}
                  </h4>
                </div>
                <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {language === 'ar' ? 'استرداد 100% من رأس المال' : '100% Capital Recovery'}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'الالتزام بمبدأ 0% أوفر برايس:' : 'Strict 0% Overprice Commitment:'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'يطلب البائع استرداد ما سدده للمطور فقط بالمليم بموجب إيصالات وكشف حساب رسمي، مع حظر طلب أي هوامش مضاربية تخل بجوهر المنصة.'
                        : 'Seller requests exact recovery of paid funds with zero speculative premiums, verified against developer payment receipts.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'إثبات صفة المالك المباشر (منع السماسرة):' : 'Direct Owner Verification (No Brokers):'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'أن يكون البائع هو الطرف الثاني المقيد اسمه بالعقد مع المطور، أو وكيل رسمي بتوكيل خاص ساري يبيح البيع والتنازل وقبض الثمن.'
                        : 'Seller must be the contract titleholder or an authorized representative holding a valid power of attorney with assignment and collection rights.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'خلو الوحدة من المتأخرات والغرامات:' : 'Zero Arrears & Clear Financial Standing:'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'تقديم كشف حساب يفيد سداد كافة الأقساط المستحقة حتى تاريخ التنازل، وتسوية أي فوائد تأخير سابقة إن وجدت قبل موعد الجلسة.'
                        : 'Providing an updated statement showing all due installments are cleared with no pending penalty balances.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'استرداد الشيكات القديمة وبراءة الذمة:' : 'Check Retrieval & Official Discharge:'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'يتسلم البائع أصل شيكاته البنكية المؤجلة المحررة سابقاً للمطور فور استبدالها بشيكات المشتري الجديد، مع استلام مخالصة نهائية.'
                        : 'Seller retrieves all original post-dated checks directly from the developer with a formal release and discharge certificate.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    ✓
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {language === 'ar' ? 'الحضور الشخصي بمقر المطور العقاري:' : 'In-Person Developer HQ Attendance:'}
                    </strong>
                    <span className="text-slate-600 leading-relaxed block">
                      {language === 'ar'
                        ? 'الحضور في الموعد المحدد للتوقيع أمام مسؤولي خدمة العملاء والشؤون القانونية للمطور، دون أي توكيلات عرفية خارج مقر الشركة.'
                        : 'Attending the scheduled appointment in person before the developer\'s legal department, avoiding informal side agreements.'}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* الركائز الإضافية: الضرائب، الغرامات، التخارج السريع، وإخلاء المسؤولية */}
          <div className="p-6 bg-slate-100 border-t border-slate-200 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span>⚖️</span> {language === 'ar' ? 'الضرائب والأرباح التجارية:' : 'Taxes & Statutory Dues:'}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'يتحمل كل طرف ما يفرضه القانون عليه. الوحدات السكنية العادية معفاة من ضريبة القيمة المضافة، والتجاري يخضع للضريبة المقررة.'
                  : 'Parties bear statutory tax duties. Residential resales are VAT exempt; commercial units follow official tax laws.'}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span>💸</span> {language === 'ar' ? 'تسوية الغرامات والمتأخرات:' : 'Overdue Fines Settlement:'}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'إذا كانت هناك متأخرات على البائع للمطور، يتم خصمها من ثمن التنازل بالمليم ويسددها المشتري للمطور بدلاً منه لحماية الطرفين.'
                  : 'Any developer fines are deducted strictly from seller cash and settled directly by buyer with developer.'}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <span>🔥</span> {language === 'ar' ? 'التخارج العاجل وتسهيلات الكاش:' : 'Fire Sale & Flexible Cash:'}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'يمكن للبائع طلب سرعة التخارج بالتنازل بخصم من مدفوعاته، أو قبول استلام الكاش على دفعتين بشيكات مصرفية مقبولة الدفع.'
                  : 'Sellers can offer urgent discounts under paid equity or accept cashier check tranches for faster exits.'}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
              <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                <span>🛡️</span> {language === 'ar' ? 'إخلاء مسؤولية المنصة عن الورق:' : 'Platform Legal Disclaimer:'}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'المنصة وسيط تقني وإعلاني للتوفيق. التحقق النهائي من صحة أصل العقود وسندات الملكية والتوكيلات يقع حصراً على إدارة المطور بمقره.'
                  : 'Platform is a matching engine; final contract validation and power-of-attorney checks rest solely with developer HQ.'}
              </p>
            </div>
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0f172a]">
                {language === 'ar' ? 'قائمة المستندات المطلوبة لإتمام التنازل' : 'Required Legal Dossier for Closing'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ar' ? 'جهّز هذه الأوراق لفحص وحدتك خلال ساعتين' : 'Prepare these records for a 2-hour audit turnaround'}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#0f172a] mb-0.5">{language === 'ar' ? 'أصل عقد بيع الوحدة' : 'Original Purchase Contract'}</strong>
                <span className="text-slate-500">{language === 'ar' ? 'العقد الموقع مع المطور العقاري وملحقاته.' : 'Signed contract and annexes with the developer.'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#0f172a] mb-0.5">{language === 'ar' ? 'كشف حساب أقساط معتمد' : 'Certified Statement of Account'}</strong>
                <span className="text-slate-500">{language === 'ar' ? 'صادر من إدارة الحسابات لدى المطور يوضح المسدد والمتبقي.' : 'Issued by developer accounts detailing paid & pending amounts.'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#0f172a] mb-0.5">{language === 'ar' ? 'إيصالات السداد البنكية' : 'Bank Payment Receipts'}</strong>
                <span className="text-slate-500">{language === 'ar' ? 'إيصالات التحويل أو إشعارات خصم الشيكات المسددة.' : 'Transfer receipts or cleared check debit confirmations.'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#0f172a] mb-0.5">{language === 'ar' ? 'بطاقة الرقم القومي سارية' : 'Valid National ID / Passport'}</strong>
                <span className="text-slate-500">{language === 'ar' ? 'للبائع والمشتري (أو جواز سفر ساري للمغتربين).' : 'For both parties (or valid passport for expat investors).'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#0f172a] mb-0.5">{language === 'ar' ? 'شيك مصرفي مقبول الدفع' : 'Certified Banker\'s Cheque'}</strong>
                <span className="text-slate-500">{language === 'ar' ? 'يصدره المشتري باسم البائع بكامل المبلغ المتنازل عنه.' : 'Issued by buyer to seller covering exact paid cash.'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f766e] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#0f172a] mb-0.5">{language === 'ar' ? 'دفتر شيكات المشتري' : 'Buyer\'s Bank Checkbook'}</strong>
                <span className="text-slate-500">{language === 'ar' ? 'لكتابة الشيكات الآجلة المتبقية لشركة التطوير العقاري.' : 'For future installment checks payable to the developer.'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-[#0f172a] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className={`space-y-1 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
            <h3 className="text-xl font-bold text-white">
              {language === 'ar' ? 'مستعد للبدء؟ ارفع بيانات وحدتك الآن' : 'Ready to start? Submit your unit details now'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'فريقنا القانوني جاهز لمراجعة الموقف وحساب كاش التنازل بدون أي رسوم.' : 'Our legal team evaluates your numbers and audits contract standings at 0% fees.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddUnit}
              className="px-6 py-3 rounded-lg bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md transition-all flex items-center gap-2"
            >
              <span>{t('sellGetCash')}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm cursor-pointer border border-slate-700 transition-all"
            >
              {t('opportunities')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
