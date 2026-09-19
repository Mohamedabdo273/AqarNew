import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { BrandSuggestion, PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ContactPageProps {
  currentBrand: BrandSuggestion;
  onNavigate: (page: PageId) => void;
  onOpenAddUnit: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  currentBrand,
  onNavigate,
  onOpenAddUnit
}) => {
  const { t, language, isRTL } = useLanguage();
  const [inquiryType, setInquiryType] = useState<string>('seller');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [developerOrArea, setDeveloperOrArea] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const quickWhatsapp = (text: string) => {
    const encoded = encodeURIComponent(`Hello ${currentBrand.nameEn}, ${text}`);
    window.open(`https://wa.me/201000000000?text=${encoded}`, '_blank');
  };

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-[#f5f6f8] text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ecfdf5] text-[#0f766e] text-xs font-bold border border-[#d1fae5]">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تواصل مباشر وسريع' : 'Direct & Swift Advisory'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-tight">
            {language === 'ar' ? (
              <>تحدث مع مستشار <span className="text-[#0f766e]">{currentBrand.nameAr}</span></>
            ) : (
              <>Speak with an Advisor at <span className="text-[#0f766e]">{currentBrand.nameEn}</span></>
            )}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            {language === 'ar'
              ? 'فريقنا من الخبراء العقاريين والمحامين المتخصصين في عقود التطوير جاهز لمساعدتك في أي استفسار بشأن التنازل، فحص الشيكات، أو اقتناص الفرص الاستثمارية.'
              : 'Our real estate analysts and contract legal counsel are prepared to assist you with contract assignment, check discharge, and prime investment acquisition.'}
          </p>
        </div>

        {/* Quick WhatsApp Prompts Bar */}
        <div className="bg-white rounded-2xl border border-[#cbd2d9] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#0f766e] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="font-bold text-sm text-[#0f172a]">
                  {language === 'ar' ? 'تواصل عبر واتساب فوراً (مستشار مباشر متاح)' : 'Instant WhatsApp Dispatch (Direct Advisor On-Duty)'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'اختر موضوع استفسارك لبدء محادثة مخصصة بدون انتظار:' : 'Select inquiry topic to launch instant conversation:'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => quickWhatsapp(language === 'ar' ? 'أرغب في استشارة عاجلة بخصوص التنازل عن وحدتي واسترداد الكاش' : 'I am a seller seeking urgent exit and full cash recovery')}
                className="px-3 py-1.5 rounded-lg bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] text-xs font-bold transition-colors cursor-pointer"
              >
                💼 {language === 'ar' ? 'أنا بائع أريد التنازل' : 'Seller Safe Exit'}
              </button>
              <button
                onClick={() => quickWhatsapp(language === 'ar' ? 'أبحث عن فرصة شراء وحدة بالتقسيط بدون أوفر في التجمع أو زايد' : 'I am an investor seeking 0% overprice deals')}
                className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition-colors cursor-pointer"
              >
                🔑 {language === 'ar' ? 'أنا مشتري أبحث عن فرصة' : 'Buyer 0% Overprice'}
              </button>
              <button
                onClick={() => quickWhatsapp(language === 'ar' ? 'لدي استفسار قانوني بخصوص التنازل لدى المطور وموقف الشيكات' : 'I have a legal question regarding developer contract transfer & checks')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors cursor-pointer"
              >
                ⚖️ {language === 'ar' ? 'استفسار قانوني وشيكات' : 'Legal & Check Audit'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Contact Form & Info Cards */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#cbd2d9] p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#ecfdf5] text-[#0f766e] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#0f172a]">
                  {language === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Inquiry Received Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {language === 'ar'
                    ? `شكراً لتواصلك معنا. يقوم مستشار العقود والتنازلات بمراجعة بياناتك وسيتصل بك على الرقم ${phone} خلال أقل من 60 دقيقة.`
                    : `Thank you for contacting us. A senior contract advisor is reviewing your request and will call you on ${phone} within 60 minutes.`}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 bg-[#0f172a] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    {language === 'ar' ? 'إرسال رسالة جديدة' : 'Send Another Inquiry'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-xl font-bold text-[#0f172a]">
                    {language === 'ar' ? 'نموذج طلب الاستشارة والمتابعة' : 'Advisory Request Form'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ar' ? 'اترك بياناتك وسيتواصل معك استشاري متخصص بدون أي التزام مالي.' : 'Leave your contact details and an advisor will connect with zero obligation.'}
                  </p>
                </div>

                {/* Inquiry Type Radio/Buttons */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'ar' ? 'نوع الاستفسار:' : 'Inquiry Type:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setInquiryType('seller')}
                      className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                        inquiryType === 'seller'
                          ? 'bg-[#0f766e] text-white border-[#0f766e]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {language === 'ar' ? 'بائع (تنازل)' : 'Seller (Exit)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('buyer')}
                      className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                        inquiryType === 'buyer'
                          ? 'bg-[#0f766e] text-white border-[#0f766e]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {language === 'ar' ? 'مشتري (فرصة)' : 'Buyer (Deals)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('investor')}
                      className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                        inquiryType === 'investor'
                          ? 'bg-[#0f766e] text-white border-[#0f766e]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {language === 'ar' ? 'مستثمر محافظ' : 'Portfolio Investor'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('legal')}
                      className={`p-2.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                        inquiryType === 'legal'
                          ? 'bg-[#0f766e] text-white border-[#0f766e]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {language === 'ar' ? 'استشارة قانونية' : 'Legal Counsel'}
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ar' ? 'أحمد محمود...' : 'John Doe...'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'رقم الموبايل (واتساب):' : 'Mobile (WhatsApp):'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="010XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'البريد الإلكتروني (اختياري):' : 'Email (Optional):'}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'المطور أو المنطقة المعنية:' : 'Developer or Region:'}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'مثال: سوديك زايد، بالم هيلز التجمع...' : 'e.g. Sodic Zayed, Palm Hills New Cairo...'}
                      value={developerOrArea}
                      onChange={(e) => setDeveloperOrArea(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ar' ? 'تفاصيل رسالتك أو استفسارك:' : 'Message or Inquiry Details:'}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={language === 'ar' ? 'اكتب أي تفاصيل بخصوص الوحدة، الأقساط، أو نوع الفرصة التي تبحث عنها...' : 'Specify details regarding your unit, installments, or desired property...'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-[#cbd2d9] rounded-lg text-xs"
                  ></textarea>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f766e] shrink-0" />
                  <span>{language === 'ar' ? 'نلتزم بحماية خصوصيتك وسرية بياناتك تماماً ولا نشاركها مع أي طرف ثالث.' : 'Strict confidentiality guarantee: Your personal data is never shared.'}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إرسال الطلب الآن' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Info Side (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Cards */}
            <div className="bg-white rounded-2xl border border-[#cbd2d9] p-6 space-y-4 shadow-xs">
              <h4 className="font-bold text-sm text-[#0f172a] border-b border-slate-200 pb-2">
                {language === 'ar' ? 'بيانات التواصل المباشر' : 'Direct Communications'}
              </h4>

              <div className="space-y-3 text-xs">
                <a 
                  href="tel:19822"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-[#ecfdf5] border border-slate-200 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0f172a] group-hover:bg-[#0f766e] text-white flex items-center justify-center shrink-0 transition-colors">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">{language === 'ar' ? 'الخط الساخن المباشر' : 'Direct Hotline'}</span>
                    <strong className="text-[#0f172a] font-sans text-sm">19822</strong>
                  </div>
                </a>

                <a 
                  href="mailto:contact@tanazul.eg"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-[#ecfdf5] border border-slate-200 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0f172a] group-hover:bg-[#0f766e] text-white flex items-center justify-center shrink-0 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">{language === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Official Support Email'}</span>
                    <strong className="text-[#0f172a] font-sans text-xs">info@{currentBrand.nameEn.toLowerCase()}.eg</strong>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-[#0f172a] text-white flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">{language === 'ar' ? 'مواعيد العمل الرسمية' : 'Operating Hours'}</span>
                    <strong className="text-[#0f172a] text-xs">
                      {language === 'ar' ? 'السبت - الخميس (9:00 ص - 8:00 م)' : 'Sat - Thu (9:00 AM - 8:00 PM)'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Offices Location Card */}
            <div className="bg-[#0f172a] text-white rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-[#2dd4bf]">
                <Building2 className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  {language === 'ar' ? 'مقراتنا واستقبال العملاء' : 'Offices & Executive Lounges'}
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <strong className="text-white block font-bold">
                    {language === 'ar' ? 'المقر الرئيسي — القاهرة الجديدة' : 'Headquarters — New Cairo'}
                  </strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {language === 'ar' ? 'شارع التسعين الشمالي، التجمع الخامس، مبنى الأعمال بلازا، الدور الرابع، القاهرة.' : 'North 90th Street, Plaza Business Hub, 4th Floor, New Cairo, Egypt.'}
                  </p>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                  <strong className="text-white block font-bold">
                    {language === 'ar' ? 'فرع غرب القاهرة — الشيخ زايد' : 'West Cairo Branch — Sheikh Zayed'}
                  </strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {language === 'ar' ? 'مبنى كابيتال بيزنس بارك، محور 26 يوليو، مدخل زايد 2، الجيزة.' : 'Capital Business Park, 26th of July Corridor, Gate 2, Zayed, Giza.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400">
                {language === 'ar' ? '* المقابلات الرسمية تتم بتنسيق مسبق لحجز جلسات فحص العقود مع المستشار القانوني.' : '* In-person visits require prior appointment for contract auditing.'}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
