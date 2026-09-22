import React, { useState } from 'react';
import { X, Handshake, Building2, User, Coins, Calendar, ShieldCheck, Check } from 'lucide-react';
import { AdminDeal, DealStage } from '../../types/admin';
import { ADMIN_ADVISORS } from '../../data/adminMockData';

interface NewDealModalProps {
  onClose: () => void;
  onCreateDeal: (dealData: Omit<AdminDeal, 'id' | 'dealCode' | 'createdAt' | 'milestones'>) => void;
  language: 'ar' | 'en';
}

export const NewDealModal: React.FC<NewDealModalProps> = ({
  onClose,
  onCreateDeal,
  language,
}) => {
  const isRTL = language === 'ar';

  const [unitTitle, setUnitTitle] = useState('');
  const [developer, setDeveloper] = useState('مجموعة طلعت مصطفى (TMG)');
  const [compound, setCompound] = useState('مدينتي');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [originalContractPrice, setOriginalContractPrice] = useState(5000000);
  const [cashAmountToSeller, setCashAmountToSeller] = useState(2000000);
  const [remainingInstallments, setRemainingInstallments] = useState(3000000);
  const [stage, setStage] = useState<DealStage>('reservation');
  const [targetHqDate, setTargetHqDate] = useState('2026-10-01');
  const [assignedAdvisor, setAssignedAdvisor] = useState(ADMIN_ADVISORS[1].name);
  const [assignedLawyer, setAssignedLawyer] = useState(ADMIN_ADVISORS[3].name);
  const [transferFeesPolicy, setTransferFeesPolicy] = useState('مناصفة بين الطرفين');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitTitle || !sellerName || !buyerName) {
      alert(isRTL ? 'يرجى ملء جميع الحقول الإلزامية' : 'Please fill all required fields');
      return;
    }

    onCreateDeal({
      unitId: `u-deal-${Date.now()}`,
      unitTitle,
      developer,
      compound,
      sellerName,
      sellerPhone,
      buyerName,
      buyerPhone,
      originalContractPrice: Number(originalContractPrice),
      cashAmountToSeller: Number(cashAmountToSeller),
      remainingInstallments: Number(remainingInstallments),
      stage,
      targetHqDate,
      assignedAdvisor,
      assignedLawyer,
      transferFeesPolicy,
      status: 'active',
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-[#0f172a] animate-in fade-in zoom-in-95 duration-200"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-[#2dd4bf] flex items-center justify-center">
              <Handshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isRTL ? 'إنشاء وتوثيق صفقة تنازل جديدة' : 'Create New Assignment Deal'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL ? 'ربط البائع والمشتري وبدء إجراءات التنازل بمقر المطور' : 'Match seller and buyer into developer HQ pipeline'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {isRTL ? 'عنوان ووصف الوحدة *' : 'Unit Title *'}
            </label>
            <input
              type="text"
              required
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              placeholder={isRTL ? 'مثال: شقة 175م بالم هيلز التجمع - مرحلة أولى' : 'e.g. 175m Palm Hills New Cairo'}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'المطور العقاري' : 'Developer'}</label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'الكمبوند' : 'Compound'}</label>
              <input
                type="text"
                value={compound}
                onChange={(e) => setCompound(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Seller / Buyer */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-2">
              <span className="font-bold text-[#0f766e] flex items-center gap-1 text-[11px]">
                <User className="w-3.5 h-3.5" />
                <span>{isRTL ? 'بيانات البائع المتنازل' : 'Seller Info'}</span>
              </span>
              <input
                type="text"
                required
                placeholder={isRTL ? 'اسم البائع' : 'Seller Name'}
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
              />
              <input
                type="tel"
                required
                placeholder={isRTL ? 'هاتف البائع' : 'Seller Phone'}
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
              />
            </div>

            <div className="space-y-2">
              <span className="font-bold text-teal-700 flex items-center gap-1 text-[11px]">
                <User className="w-3.5 h-3.5" />
                <span>{isRTL ? 'بيانات المشتري الجديد' : 'Buyer Info'}</span>
              </span>
              <input
                type="text"
                required
                placeholder={isRTL ? 'اسم المشتري' : 'Buyer Name'}
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
              />
              <input
                type="tel"
                required
                placeholder={isRTL ? 'هاتف المشتري' : 'Buyer Phone'}
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
              />
            </div>
          </div>

          {/* Financials */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'كاش البائع (0% أوفر)' : 'Cash to Seller'}</label>
              <input
                type="number"
                value={cashAmountToSeller}
                onChange={(e) => setCashAmountToSeller(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#0f766e]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'المتبقي للمطور' : 'Remaining Installments'}</label>
              <input
                type="number"
                value={remainingInstallments}
                onChange={(e) => setRemainingInstallments(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'تاريخ جلسة المطور' : 'Target HQ Date'}</label>
              <input
                type="date"
                value={targetHqDate}
                onChange={(e) => setTargetHqDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'المستشار المعين' : 'Advisor'}</label>
              <select
                value={assignedAdvisor}
                onChange={(e) => setAssignedAdvisor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                {ADMIN_ADVISORS.map((adv) => (
                  <option key={adv.id} value={adv.name}>{adv.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{isRTL ? 'المستشار القانوني' : 'Lawyer'}</label>
              <select
                value={assignedLawyer}
                onChange={(e) => setAssignedLawyer(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="المستشار القانوني / هيثم رضوان">المستشار القانوني / هيثم رضوان</option>
                <option value="مكتب المستشار / طارق حسني">مكتب المستشار / طارق حسني</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0f766e] hover:bg-[#115e59] text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isRTL ? 'حفظ وإدراج الصفقة' : 'Create Deal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
