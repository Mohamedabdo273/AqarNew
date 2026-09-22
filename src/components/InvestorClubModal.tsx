import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Lock, 
  Building2, 
  Coins, 
  Bell, 
  ShieldCheck,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InvestorClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillBudget?: string;
}

export const InvestorClubModal: React.FC<InvestorClubModalProps> = ({
  isOpen,
  onClose,
  prefillBudget
}) => {
  const { language, isRTL } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [investorType, setInvestorType] = useState<'individual' | 'fund' | 'family_office'>('individual');
  const [availableLiquidity, setAvailableLiquidity] = useState(prefillBudget || '5M - 10M EGP');
  const [targetDistricts, setTargetDistricts] = useState<string[]>(['القاهرة الجديدة']);
  const [targetPropertyTypes, setTargetPropertyTypes] = useState<string[]>(['شقق وبنتهاوس']);
  const [preferredDiscountHorizon, setPreferredDiscountHorizon] = useState('خصم 35% فما فوق عن أسعار المطور');
  const [whatsappAlertsOnly, setWhatsappAlertsOnly] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleDistrict = (district: string) => {
    setTargetDistricts(prev => 
      prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
    );
  };

  const togglePropertyType = (type: string) => {
    setTargetPropertyTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[92vh]"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header Banner */}
        <div className="bg-[#0f172a] text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0f766e]/30 rounded-full blur-2xl pointer-events-none"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 left-4 sm:top-5 sm:left-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2dd4bf]/20 text-[#2dd4bf] text-[11px] font-black border border-[#2dd4bf]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'نادي المستثمرين الخاص • Off-Market Private Deals' : 'VIP Investor Club • Off-Market Private Deals'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {language === 'ar' ? 'انضم لنادي المستثمرين لتصلك الصفقات العاجلة قبل نشرها' : 'Join VIP Investor Club for Early Access Alerts'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
            {language === 'ar'
              ? 'الصفقات بصفر أوفر برايس وسعر عقد 2022 تنتهي في ساعات. نرسل إشعارات خاصة للأعضاء المعتمدين قبل الطرح العام بـ 48 ساعة.'
              : 'Zero-overprice deals sell rapidly. Verified investors get priority dossiers 48 hours before public publishing.'}
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 text-slate-800 text-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0f766e] border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">
                  {language === 'ar' ? 'تم تفعيل عضويتك في نادي المستثمرين بنجاح!' : 'VIP Investor Membership Activated!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  {language === 'ar'
                    ? 'تم تسجيل معايير محفظتك وسيقوم مدير علاقات كبار المستثمرين بالتواصل معك عبر واتساب لتأكيد قنوات إرسال الصفقات العاجلة.'
                    : 'Your investment parameters have been archived. A senior wealth relationship officer will contact you via WhatsApp with off-market deal packets.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 max-w-md mx-auto text-right space-y-1">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{language === 'ar' ? 'المستثمر:' : 'Investor:'}</span>
                  <span className="font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">{language === 'ar' ? 'السيولة المتاحة:' : 'Liquid Capital:'}</span>
                  <span className="font-bold text-[#0f766e]">{availableLiquidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'ar' ? 'المناطق المحددة:' : 'Districts:'}</span>
                  <span className="font-bold truncate max-w-[200px]">{targetDistricts.join('، ')}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {language === 'ar' ? 'تم، تصفح الفرص الحالية' : 'Done, Browse Current Deals'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Personal Information */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'اسم المستثمر / ممثل الكيان:' : 'Investor / Entity Representative:'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم بالكامل...' : 'Full Name...'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'رقم الموبايل (واتساب للإشعارات):' : 'Mobile / WhatsApp (For Priority Alerts):'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f766e]"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Investor Profile */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'صفة المستثمر:' : 'Investor Classification:'}
                  </label>
                  <select
                    value={investorType}
                    onChange={(e) => setInvestorType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f766e]"
                  >
                    <option value="individual">{language === 'ar' ? 'مستثمر فردي (Private Individual)' : 'Private Individual'}</option>
                    <option value="family_office">{language === 'ar' ? 'مكتب عائلي (Family Office)' : 'Family Office'}</option>
                    <option value="fund">{language === 'ar' ? 'صندوق استثمار / شركة إدارة أصول' : 'Investment Fund / Asset Mgmt'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'السيولة الكاش الجاهزة للدخول فوراً:' : 'Available Ready Cash for Instant Entry:'}
                  </label>
                  <select
                    value={availableLiquidity}
                    onChange={(e) => setAvailableLiquidity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0f766e]"
                  >
                    <option value="2M - 5M EGP">{language === 'ar' ? '2 مليون إلى 5 مليون ج.م' : '2M to 5M EGP'}</option>
                    <option value="5M - 10M EGP">{language === 'ar' ? '5 مليون إلى 10 مليون ج.م' : '5M to 10M EGP'}</option>
                    <option value="10M - 20M EGP">{language === 'ar' ? '10 مليون إلى 20 مليون ج.م' : '10M to 20M EGP'}</option>
                    <option value="+20M EGP">{language === 'ar' ? 'أكثر من 20 مليون ج.م (محافظ مجمعة)' : 'Over 20M EGP (Bulk Portfolios)'}</option>
                  </select>
                </div>
              </div>

              {/* Target Regions Checklist */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  {language === 'ar' ? 'المناطق المستهدفة (يمكن اختيار أكثر من منطقة):' : 'Target Regions of Interest:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'القاهرة الجديدة',
                    'الشيخ زايد وأكتوبر',
                    'الساحل الشمالي',
                    'العاصمة الإدارية',
                    'المستقبل والشروق',
                    'البحر الأحمر والجونة'
                  ].map((district) => {
                    const isSelected = targetDistricts.includes(district);
                    return (
                      <button
                        type="button"
                        key={district}
                        onClick={() => toggleDistrict(district)}
                        className={`p-2 rounded-lg border text-start transition-all cursor-pointer flex items-center justify-between text-[11px] font-bold ${
                          isSelected
                            ? 'bg-[#0f766e]/10 border-[#0f766e] text-[#0f766e]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{district}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0f766e] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Types */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  {language === 'ar' ? 'نوعية الأصول المطلوبة:' : 'Target Asset Types:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'شقق وبنتهاوس',
                    'فيلات وتاون هاوس',
                    'تجاري وإداري (عيادات/مكاتب)',
                    'شاليهات ساحلية',
                    'أصول جاهزة للاستلام الفوري',
                    'أي فرصة بخصم تاريخي يتجاوز 40%'
                  ].map((type) => {
                    const isSelected = targetPropertyTypes.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => togglePropertyType(type)}
                        className={`p-2 rounded-lg border text-start transition-all cursor-pointer flex items-center justify-between text-[11px] font-bold ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{type}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notification Preference */}
              <div className="bg-[#ecfdf5] border border-[#d1fae5] p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0f766e] shrink-0" />
                  <span className="text-[11px] text-[#0f766e] font-bold">
                    {language === 'ar' ? 'إرسال ملف الصفقات بصيغة PDF عبر واتساب قبل الطرح بـ 48 ساعة' : 'Deliver encrypted deal dossiers via WhatsApp 48h prior to public listing'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlertsOnly}
                  onChange={(e) => setWhatsappAlertsOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#0f766e] cursor-pointer"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'تأكيد الانضمام واستلام صفقات الأوف ماركت' : 'Confirm Membership & Receive Off-Market Alerts'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {language === 'ar'
                    ? 'بياناتك الاستثمارية سرية ومحمية، ولا تُشارك مع أي طرف خارجي.'
                    : 'Strictly confidential and encrypted under banking NDA standards.'}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
