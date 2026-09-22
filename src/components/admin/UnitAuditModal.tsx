import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Building2, 
  User, 
  Coins, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Send,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { AdminQueueUnit, VerificationChecklist } from '../../types/admin';
import { adminApi } from '../../services/adminApi';
import { DocumentViewerModal } from './DocumentViewerModal';

interface UnitAuditModalProps {
  unit: AdminQueueUnit;
  onClose: () => void;
  onUnitUpdated: (updated: AdminQueueUnit) => void;
  language: 'ar' | 'en';
}

export const UnitAuditModal: React.FC<UnitAuditModalProps> = ({
  unit,
  onClose,
  onUnitUpdated,
  language,
}) => {
  const isRTL = language === 'ar';
  
  // Checklist State
  const [checklist, setChecklist] = useState<VerificationChecklist>(
    unit.checklist || {
      developerSoaMatched: false,
      originalContractValid: false,
      checksScheduleVerified: false,
      zeroOverpricePolicyConfirmed: false,
      developerTransferTermsClear: false,
    }
  );

  // Active Action Mode
  const [actionTab, setActionTab] = useState<'verify' | 'request_info' | 'reject'>('verify');
  
  // Request Info Form
  const [missingReason, setMissingReason] = useState(unit.missingInfoReason || '');
  const [infoNote, setInfoNote] = useState(unit.requestedInfoNote || '');
  
  // Rejection Form
  const [rejectionCategory, setRejectionCategory] = useState(unit.rejectionCategory || 'مخالفة سياسة 0% أوفر برايس');
  const [rejectionReason, setRejectionReason] = useState(unit.rejectionReason || '');

  // Loading / Submission
  const [submitting, setSubmitting] = useState(false);
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<{ id: string; title: string } | null>(null);

  const allChecklistItemsCompleted = 
    checklist.developerSoaMatched &&
    checklist.originalContractValid &&
    checklist.checksScheduleVerified &&
    checklist.zeroOverpricePolicyConfirmed &&
    checklist.developerTransferTermsClear;

  const handleVerify = async () => {
    if (!allChecklistItemsCompleted) return;
    setSubmitting(true);
    try {
      const res = await adminApi.verifyUnit(unit.id, checklist);
      onUnitUpdated(res.unit);
      onClose();
    } catch (err) {
      alert(isRTL ? 'حدث خطأ أثناء الاعتماد' : 'Error verifying unit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestInfo = async () => {
    if (!missingReason.trim()) {
      alert(isRTL ? 'يرجى تحديد البيانات أو المستندات المطلوب استكمالها' : 'Please specify missing information');
      return;
    }
    setSubmitting(true);
    try {
      const res = await adminApi.requestInfo(unit.id, missingReason, infoNote);
      onUnitUpdated(res.unit);
      onClose();
    } catch (err) {
      alert(isRTL ? 'حدث خطأ أثناء إرسال طلب الاستكمال' : 'Error requesting info');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert(isRTL ? 'يرجى ذكر سبب الرفض بالتفصيل' : 'Please explain the rejection reason');
      return;
    }
    setSubmitting(true);
    try {
      const res = await adminApi.rejectUnit(unit.id, rejectionReason, rejectionCategory);
      onUnitUpdated(res.unit);
      onClose();
    } catch (err) {
      alert(isRTL ? 'حدث خطأ أثناء تسجيل الرفض' : 'Error rejecting unit');
    } finally {
      setSubmitting(false);
    }
  };

  const formatEgp = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-US').format(amount);
  };

  const savings = unit.currentMarketPrice - unit.originalContractPrice;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
        <div 
          className="relative w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#0f172a] animate-in fade-in zoom-in-95 duration-200"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-[#2dd4bf] border border-teal-500/30 font-bold">
                  {unit.unitCode}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  unit.status === 'pending_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  unit.status === 'verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  unit.status === 'info_requested' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {unit.status === 'pending_review' ? (isRTL ? 'قيد التدقيق والمراجعة' : 'Pending Audit') :
                   unit.status === 'verified' ? (isRTL ? 'معتمد ومنشور' : 'Verified & Live') :
                   unit.status === 'info_requested' ? (isRTL ? 'بانتظار استكمال بيانات' : 'Info Requested') :
                   (isRTL ? 'مرفوض' : 'Rejected')}
                </span>
                {unit.isOverdueSla && (
                  <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">
                    {isRTL ? 'تجاوز زمن الـ SLA' : 'SLA Breached'}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                {unit.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SLA & Urgency Notification Banner */}
          {unit.urgencyAlert && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-bold">{unit.urgencyAlert}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-700">
                <Clock className="w-3.5 h-3.5" />
                <span>{isRTL ? `مدة الانتظار: ${unit.waitingHours} ساعة` : `Waiting: ${unit.waitingHours} hrs`}</span>
              </div>
            </div>
          )}

          {/* Modal Body - 2 Columns */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid lg:grid-cols-12 gap-6 items-start bg-slate-50/50">
            
            {/* Left Column: Unit Dossier, Financials & Documents (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Financial Breakdown Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#0f766e]" />
                  <span>{isRTL ? 'المعادلة المالية وعقد الوحدة' : 'Financial Equation & Contract'}</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">{isRTL ? 'الكاش المطلوب للبائع' : 'Net Cash to Seller'}</span>
                    <span className="text-base font-black text-[#0f766e]">{formatEgp(unit.paidCashAmount)}</span>
                    <span className="text-[10px] text-emerald-700 font-bold block">{isRTL ? '0% أوفر برايس' : '0 Overprice'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">{isRTL ? 'المتبقي للمطور' : 'Remaining to Dev'}</span>
                    <span className="text-base font-bold text-slate-900">{formatEgp(unit.remainingAmount)}</span>
                    <span className="text-[10px] text-slate-500 block">{unit.installmentPeriodYears} {isRTL ? 'سنوات أقساط' : 'years'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-500 block">{isRTL ? 'سعر العقد الأصلي' : 'Contract Price'}</span>
                    <span className="text-base font-bold text-slate-900">{formatEgp(unit.originalContractPrice)}</span>
                    <span className="text-[10px] text-slate-500 block">{isRTL ? 'جنيه مصري' : 'EGP'}</span>
                  </div>
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-600 block">{isRTL ? 'سعر اليوم لدى المطور:' : 'Current Dev Price:'} <strong>{formatEgp(unit.currentMarketPrice)} ج.م</strong></span>
                    <span className="text-[#0f766e] font-bold block mt-0.5">
                      {isRTL ? `توفير المشتري الحقيقي: ${formatEgp(savings)} ج.م` : `Total Buyer Savings: ${formatEgp(savings)} EGP`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">{isRTL ? 'القسط القادم:' : 'Next Installment:'}</span>
                    <span className="font-mono font-bold text-red-700">{unit.nextInstallmentDate}</span>
                  </div>
                </div>
              </div>

              {/* Seller & Compound Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 text-xs">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#0f766e]" />
                  <span>{isRTL ? 'بيانات البائع والموقع' : 'Seller & Property Dossier'}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{isRTL ? 'اسم المالك بالبطاقة:' : 'Seller Name:'}</span>
                    <strong className="text-slate-900">{unit.seller.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{isRTL ? 'رقم الهاتف:' : 'Phone:'}</span>
                    <strong className="font-mono text-slate-900">{unit.seller.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{isRTL ? 'الرقم القومي:' : 'National ID:'}</span>
                    <span className="font-mono">{unit.seller.nationalId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">{isRTL ? 'المطور والكمبوند:' : 'Developer & Compound:'}</span>
                    <span>{unit.developer} - {unit.compound}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">{isRTL ? 'سبب الخروج والتنازل:' : 'Exit Reason:'}</span>
                  <p className="text-slate-600 italic mt-0.5">{unit.seller.exitReason}</p>
                </div>
              </div>

              {/* Uploaded Documents List with 5-Minute Signed URL Preview */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0f766e]" />
                    <span>{isRTL ? 'المستندات المرفوعة للتدقيق' : 'Uploaded Audit Documents'}</span>
                  </h3>
                  <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {isRTL ? 'رابط مؤقت 5 دقائق' : '5-Min Signed URL'}
                  </span>
                </div>

                <div className="space-y-2">
                  {unit.documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-3 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50/70 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#0f766e] flex items-center justify-center font-bold text-xs shrink-0">
                          {doc.fileType}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{doc.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {doc.fileName} • {doc.fileSize}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedDocForViewer({ id: doc.id, title: doc.title })}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#2dd4bf]" />
                        <span>{isRTL ? 'معاينة أمنية' : 'Preview'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Actions (Verify with Checklist / Request Info / Reject) (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              
              {/* Action Tabs Header */}
              <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-bold">
                <button
                  onClick={() => setActionTab('verify')}
                  className={`flex-1 py-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    actionTab === 'verify' 
                      ? 'bg-white text-[#0f766e] shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'الاعتماد' : 'Verify'}</span>
                </button>

                <button
                  onClick={() => setActionTab('request_info')}
                  className={`flex-1 py-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    actionTab === 'request_info' 
                      ? 'bg-white text-blue-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'استكمال' : 'Request'}</span>
                </button>

                <button
                  onClick={() => setActionTab('reject')}
                  className={`flex-1 py-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    actionTab === 'reject' 
                      ? 'bg-white text-red-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'رفض' : 'Reject'}</span>
                </button>
              </div>

              {/* TAB 1: VERIFY WITH CHECKLIST */}
              {actionTab === 'verify' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
                      <span>{isRTL ? 'قائمة الفحص والتدقيق القانوني' : 'Legal & Financial Checklist'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isRTL 
                        ? 'يجب وضع علامة صح على جميع بنود التدقيق قبل فتح زر النشر المباشر:' 
                        : 'All audit checklist items must be checked before publishing:'}
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700">
                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={checklist.developerSoaMatched}
                        onChange={(e) => setChecklist({ ...checklist, developerSoaMatched: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]"
                      />
                      <span>{isRTL ? 'مطابقة كشف حساب المطور والمبالغ المسددة فعلياً' : 'Developer statement of account verified'}</span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={checklist.originalContractValid}
                        onChange={(e) => setChecklist({ ...checklist, originalContractValid: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]"
                      />
                      <span>{isRTL ? 'صحة أصل العقد الابتدائي ومطابقة هوية المالك' : 'Original contract copy matches owner ID'}</span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={checklist.checksScheduleVerified}
                        onChange={(e) => setChecklist({ ...checklist, checksScheduleVerified: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]"
                      />
                      <span>{isRTL ? 'سلامة الشيكات المتبقية وعدم وجود شيكات مرتدة' : 'Deferred check schedule verified with no bounce'}</span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={checklist.zeroOverpricePolicyConfirmed}
                        onChange={(e) => setChecklist({ ...checklist, zeroOverpricePolicyConfirmed: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]"
                      />
                      <span className="font-bold text-[#0f766e]">
                        {isRTL ? 'الالتزام الصارم بشرط 0% أوفر برايس' : 'Zero Overprice policy strictly confirmed'}
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={checklist.developerTransferTermsClear}
                        onChange={(e) => setChecklist({ ...checklist, developerTransferTermsClear: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-[#0f766e]"
                      />
                      <span>{isRTL ? 'استيفاء شروط ومقر التنازل الرسمي لدى المطور' : 'Developer HQ transfer requirements fulfilled'}</span>
                    </label>
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={!allChecklistItemsCompleted || submitting}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                      allChecklistItemsCompleted && !submitting
                        ? 'bg-[#0f766e] hover:bg-[#115e59] text-white cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {submitting 
                        ? (isRTL ? 'جاري التوثيق والنشر...' : 'Publishing...') 
                        : (isRTL ? 'اعتماد ونشر الوحدة في السوق المباشر' : 'Verify & Publish Unit')}
                    </span>
                  </button>
                  
                  {!allChecklistItemsCompleted && (
                    <p className="text-[11px] text-amber-700 text-center">
                      {isRTL ? 'يجب استكمال كافة بنود التدقيق الخمسة لتفعيل الاعتماد' : 'Complete all 5 audit items to enable verification'}
                    </p>
                  )}
                </div>
              )}

              {/* TAB 2: REQUEST INFO */}
              {actionTab === 'request_info' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isRTL ? 'طلب استكمال بيانات أو مستندات' : 'Request Additional Documents'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isRTL 
                        ? 'سيتم إشعار البائع فوراً عبر الرسائل والواتساب لرفع المستندات المطلوبة:' 
                        : 'The seller will be notified via SMS/WhatsApp to upload missing items:'}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isRTL ? 'اختر المستند الناقص:' : 'Select Missing Item:'}
                      </label>
                      <select
                        value={missingReason}
                        onChange={(e) => setMissingReason(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="">{isRTL ? '-- اختر نوع المستند المطلوبة --' : '-- Select --'}</option>
                        <option value="كشف حساب مالي رسمي حديث ومختوم من المطور">كشف حساب مالي رسمي حديث ومختوم من المطور</option>
                        <option value="صورة إيصال سداد رسوم وديعة الصيانة المحدثة">صورة إيصال سداد رسوم وديعة الصيانة المحدثة</option>
                        <option value="صورة واضحة للوجهين لبطاقة الرقم القومي سارية">صورة واضحة للوجهين لبطاقة الرقم القومي سارية</option>
                        <option value="حافظة إيصالات الشيكات المتبقية أو كعب الشيكات البنكية">حافظة إيصالات الشيكات المتبقية أو كعب الشيكات البنكية</option>
                        <option value="موافقة كتابية من المطور على إمكانية التنازل الفوري">موافقة كتابية من المطور على إمكانية التنازل الفوري</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isRTL ? 'رسالة توجيهية للبائع:' : 'Instructions to Seller:'}
                      </label>
                      <textarea
                        value={infoNote}
                        onChange={(e) => setInfoNote(e.target.value)}
                        placeholder={isRTL ? 'اكتب تفاصيل المستند المطلوب وأين يمكنه استخراجه...' : 'Describe how the seller can retrieve the file...'}
                        rows={4}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <button
                      onClick={handleRequestInfo}
                      disabled={submitting}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isRTL ? 'إرسال طلب الاستكمال للبائع' : 'Send Info Request'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: REJECT UNIT */}
              {actionTab === 'reject' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-red-700 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>{isRTL ? 'رفض الوحدة واستبعادها' : 'Reject & Archive Submission'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isRTL 
                        ? 'سيتم استبعاد الوحدة من طابور العرض وإشعار البائع بسبب الرفض الرسمي:' 
                        : 'The unit will be excluded from the queue and seller informed:'}
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isRTL ? 'تصنيف سبب الرفض:' : 'Rejection Category:'}
                      </label>
                      <select
                        value={rejectionCategory}
                        onChange={(e) => setRejectionCategory(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="مخالفة سياسة 0% أوفر برايس">مخالفة سياسة 0% أوفر برايس (طلب مبالغ إضافية)</option>
                        <option value="مطور غير معتمد أو متوقف عن التنازل الرسمي">مطور غير معتمد أو متوقف عن التنازل الرسمي</option>
                        <option value="وجود نزاع قضائي أو حظر قانوني على الوحدة">وجود نزاع قضائي أو حظر قانوني على الوحدة</option>
                        <option value="تكرار الشيكات المرتدة وغرامات تعثر غير مسددة">تكرار الشيكات المرتدة وغرامات تعثر غير مسددة</option>
                        <option value="بيانات ملكية غير مطابقة لأصل العقد الابتدائي">بيانات ملكية غير مطابقة لأصل العقد الابتدائي</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {isRTL ? 'شرح سبب الرفض الرسمي:' : 'Detailed Explanation:'}
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder={isRTL ? 'وضح بالتفصيل سبب الرفض غير القابل للطعن...' : 'State the reason for rejection...'}
                        rows={4}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <button
                      onClick={handleReject}
                      disabled={submitting}
                      className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{isRTL ? 'تأكيد الرفض الرسمي' : 'Confirm Official Rejection'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocForViewer && (
        <DocumentViewerModal
          documentId={selectedDocForViewer.id}
          documentTitle={selectedDocForViewer.title}
          onClose={() => setSelectedDocForViewer(null)}
          language={language}
        />
      )}
    </>
  );
};
