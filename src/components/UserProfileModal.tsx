import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Building2, 
  Bookmark, 
  MessageSquare, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  PlusCircle, 
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RealEstateUnit } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: RealEstateUnit[];
  onSelectUnit: (unit: RealEstateUnit) => void;
  onOpenAddUnit: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  units,
  onSelectUnit,
  onOpenAddUnit
}) => {
  const { user, logout, toggleSaveUnit } = useAuth();
  const { t, language, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'myUnits' | 'saved' | 'inquiries'>('profile');

  if (!isOpen || !user) return null;

  const savedUnitsList = units.filter((unit) => user.savedUnits.includes(unit.id));

  const roleBadgeInfo = {
    seller: {
      labelAr: 'بائع وحدة (طلب خروج)',
      labelEn: 'Unit Seller (Exit Request)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    buyer: {
      labelAr: 'مشتري معتمد',
      labelEn: 'Verified Buyer',
      color: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    investor: {
      labelAr: 'مستثمر VIP',
      labelEn: 'VIP Investor',
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    }
  };

  const currentRoleInfo = roleBadgeInfo[user.role] || roleBadgeInfo.seller;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-6 relative">
          <button 
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer`}
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0f766e] text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white/20 overflow-hidden shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user.name.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {user.name}
                </h2>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentRoleInfo.color}`}>
                  {language === 'ar' ? currentRoleInfo.labelAr : currentRoleInfo.labelEn}
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                {user.email} • {user.phone}
              </p>
            </div>

            <button
              onClick={() => { logout(); onClose(); }}
              className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('logout')}</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 mt-6 border-b border-white/10 pb-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#0f766e] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{t('tabProfileInfo')}</span>
            </button>

            <button
              onClick={() => setActiveTab('myUnits')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'myUnits'
                  ? 'bg-[#0f766e] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('tabMyUnits')}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                {user.myUnits.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-[#0f766e] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t('tabSavedUnits')}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                {user.savedUnits.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#0f766e] text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('tabInquiries')}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                {user.inquiries.length}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto">
          {/* 1. Profile Info Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    {t('fullNameLabel')}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {user.name}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    {t('emailLabel')}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {user.email}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    {t('phoneLabel')}
                  </span>
                  <span className="text-sm font-semibold text-slate-900" dir="ltr">
                    {user.phone}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    {t('accountRole')}
                  </span>
                  <span className="text-sm font-bold text-[#0f766e]">
                    {language === 'ar' ? currentRoleInfo.labelAr : currentRoleInfo.labelEn}
                  </span>
                </div>
              </div>

              {/* Status Guarantee Banner */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0f766e] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-teal-950">
                  <p className="font-bold mb-0.5">
                    {language === 'ar' ? 'حساب موثق ومحمى بنكياً' : 'Verified & Bank-Protected Account'}
                  </p>
                  <p className="text-teal-800">
                    {language === 'ar'
                      ? 'كافة صفقاتك واتفاقيات التنازل مسجلة رسمياً لدى الإدارة العقارية للمطور، مع رد كامل الشيكات البنكية المؤجلة.'
                      : 'All transactions and assignment agreements are officially recorded at the developer\'s legal office, with postdated checks fully returned.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => { onClose(); onOpenAddUnit(); }}
                  className="px-4 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('addUnitNow')}</span>
                </button>

                <a
                  href="https://wa.me/201000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#2dd4bf]" />
                  <span>{t('consultationWithLegal')}</span>
                </a>
              </div>
            </div>
          )}

          {/* 2. My Units Tab */}
          {activeTab === 'myUnits' && (
            <div className="space-y-4">
              {user.myUnits.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                  <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 mb-1">{t('noListedUnits')}</p>
                  <p className="text-xs text-slate-500 mb-4">
                    {language === 'ar'
                      ? 'هل تريد الخروج من وحدة واسترداد أموالك كاش دون غرامة فسخ؟'
                      : 'Looking to exit an installment unit and recover 100% of your cash without cancellation penalties?'}
                  </p>
                  <button
                    onClick={() => { onClose(); onOpenAddUnit(); }}
                    className="px-4 py-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-xl text-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t('addUnitNow')}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.myUnits.map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#0f766e] transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0f766e] border border-teal-200 self-start">
                          {language === 'ar' ? item.statusAr : item.statusEn}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mb-2">
                        <div>
                          <span className="text-slate-400 block text-[10px]">{t('calcDeveloperName')}</span>
                          <span className="font-bold text-slate-800">{item.developer}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">{t('unitOriginalPrice')}</span>
                          <span className="font-bold text-slate-800">{item.contractPrice.toLocaleString()} {t('egp')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">{t('unitPaidCash')}</span>
                          <span className="font-bold text-[#0f766e]">{item.paidAmount.toLocaleString()} {t('egp')}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{language === 'ar' ? `تاريخ الطرح: ${item.submissionDate}` : `Submitted on: ${item.submissionDate}`}</span>
                        <span className="text-[#0f766e] font-bold">
                          {language === 'ar' ? '0% أوفر برايس • كاش مسترد' : '0% Overprice • Cash Recovered'}
                        </span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => { onClose(); onOpenAddUnit(); }}
                    className="w-full py-2.5 border border-dashed border-[#0f766e] text-[#0f766e] hover:bg-[#0f766e]/5 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t('addUnitNow')}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. Saved Deals Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedUnitsList.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                  <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 mb-1">{t('noSavedUnits')}</p>
                  <p className="text-xs text-slate-500 mb-4">
                    {language === 'ar' 
                      ? 'تصفح قائمة الوحدات المتاحة بدون أوفر واحفظ الفرص التي تناسب ميزانيتك.'
                      : 'Explore zero-overprice opportunities and bookmark deals that fit your investment targets.'}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    {t('browseUnitsNow')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedUnitsList.map((unit) => (
                    <div 
                      key={unit.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-[#0f766e] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={unit.images[0]} 
                          alt={unit.title} 
                          className="w-16 h-16 rounded-lg object-cover shrink-0" 
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                            {language === 'ar' ? unit.title : (unit.titleEn || unit.title)}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {language === 'en' && unit.developerEn ? unit.developerEn : unit.developer} • {language === 'en' && unit.compoundEn ? unit.compoundEn : unit.compound}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-black text-[#0f766e]">
                              {unit.paidCashAmount.toLocaleString()} {t('egp')}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                              {language === 'ar' ? 'توفير' : 'Savings'} {(unit.currentMarketPrice - unit.originalContractPrice).toLocaleString()} {t('egp')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectUnit(unit);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{t('unitViewDetails')}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleSaveUnit(unit.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title={language === 'ar' ? 'إزالة من المحفوظات' : 'Remove from Saved'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              {user.inquiries.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-300">
                  <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700 mb-1">{t('noInquiries')}</p>
                  <p className="text-xs text-slate-500 mb-4">
                    {language === 'ar' 
                      ? 'يمكنك طلب استشارة قانونية مجانية حول نقل الشيكات والتنازل الرسمي.'
                      : 'You can request a free legal consultation regarding check returns and official developer assignments.'}
                  </p>
                  <a
                    href="https://wa.me/201000000000"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#0f766e] hover:bg-[#115e59] text-white font-bold rounded-xl text-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('consultationWithLegal')}</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{inq.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 self-start">
                          {language === 'ar' ? inq.statusTextAr : inq.statusTextEn}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{inq.date}</span>
                        </span>
                        <a 
                          href="https://wa.me/201000000000" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#0f766e] font-bold hover:underline"
                        >
                          {language === 'ar' ? 'متابعة مع المستشار عبر واتساب ←' : 'Follow up on WhatsApp →'}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
