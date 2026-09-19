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
