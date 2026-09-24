import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { DocumentTemporaryUrlResponse } from '../../types/admin';
import { adminApi } from '../../services/adminApi';

interface DocumentViewerModalProps {
  documentId: string;
  documentTitle: string;
  onClose: () => void;
  language: 'ar' | 'en';
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  documentId,
  documentTitle,
  onClose,
  language,
}) => {
  const isRTL = language === 'ar';
  const [docData, setDocData] = useState<DocumentTemporaryUrlResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const fetchDocumentUrl = async () => {
    setLoading(true);
    setIsExpired(false);
    try {
      const data = await adminApi.getDocumentTemporaryUrl(documentId);
      setDocData(data);
      setTimeLeft(data.validDurationSeconds || 300);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentUrl();
  }, [documentId]);

  // Countdown timer for 5 minutes
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatMinutesSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0f172a] rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[#2dd4bf] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{documentTitle}</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {documentId}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL ? 'نظام فحص المستندات المشفرة • رابط أمني مؤقت' : 'Encrypted Document Audit System • Signed Temporary URL'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* 5-Minute Timer Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-mono border transition-all ${
              isExpired 
                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                : timeLeft < 60 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                  : 'bg-teal-500/10 border-teal-500/30 text-[#2dd4bf]'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isExpired 
                  ? (isRTL ? 'انتهت صلاحية الرابط' : 'URL Expired') 
                  : `${formatMinutesSeconds(timeLeft)} ${isRTL ? 'متبقية' : 'left'}`}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{isRTL ? 'رمز التشفير:' : 'Token:'}</span>
              <span className="font-mono text-slate-200">
                {docData?.securityToken.substring(0, 8)}...
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(60, z - 20))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title={isRTL ? 'تصغير' : 'Zoom out'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] w-12 text-center text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(180, z + 20))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title={isRTL ? 'تكبير' : 'Zoom in'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="w-px h-4 bg-slate-700 mx-1"></span>
            <button
              onClick={fetchDocumentUrl}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              title={isRTL ? 'تجديد الرابط (5 دقائق جديدة)' : 'Refresh 5-minute URL'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isRTL ? 'تجديد الصلاحية' : 'Refresh Link'}</span>
            </button>
          </div>
        </div>

        {/* Document Content Area */}
        <div className="flex-1 p-6 overflow-auto bg-slate-950 flex items-center justify-center relative min-h-[420px]">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-slate-400 py-16">
              <RefreshCw className="w-8 h-8 animate-spin text-[#0d9488]" />
              <p className="text-sm font-bold">
                {isRTL ? 'جاري توليد الرابط الأمني المؤقت وفحص الصلاحيات...' : 'Generating secure temporary signed URL...'}
              </p>
            </div>
          ) : isExpired ? (
            <div className="text-center max-w-md p-8 bg-slate-900/90 rounded-2xl border border-red-500/30 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">
                {isRTL ? 'انتهت مدة صلاحية الرابط المؤقت (5 دقائق)' : 'Temporary Signed URL Has Expired'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isRTL 
                  ? 'حفاظاً على سرية بيانات عقود المطورين وبطاقات الهوية، تنتهي روابط المعاينة تلقائياً بعد 5 دقائق. اضغط أدناه لتوليد رابط جديد فوراً.'
                  : 'To protect sensitive developer contracts and personal IDs, document URLs expire after 5 minutes. Click below to regenerate a new secure token.'}
              </p>
              <button
                onClick={fetchDocumentUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isRTL ? 'توليد رابط مؤقت جديد (5 دقائق)' : 'Generate New 5-Min URL'}</span>
              </button>
            </div>
          ) : (
            <div 
              className="relative w-full max-w-2xl bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl transition-transform duration-150 origin-top select-none"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* Security Watermark */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-12 rotate-[-28deg]">
                <span className="text-3xl sm:text-4xl font-black text-red-800 text-center tracking-widest leading-loose uppercase">
                  {docData?.watermarkText || 'CONFIDENTIAL • TANAZUL AUDIT'}
                </span>
              </div>

              {/* Document Header Mock */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">جمهورية مصر العربية</span>
                  <h2 className="text-lg font-black text-slate-900">{documentTitle}</h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">DOC REF: {documentId} • VERIFIED ARCHIVE</p>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-teal-700 flex items-center justify-center text-teal-800 text-center text-[9px] font-bold rotate-[-12deg]">
                  معتمد<br/>للتدقيق
                </div>
              </div>

              {/* Document Body Mock */}
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-serif">
                <p>
                  إنه في يوم المعاينة المعتمد، تم فحص مستند التعاقد الرسمي رقم <strong>{documentId}</strong> الصادر والمقيد بسجلات شركة التطوير العقاري.
                </p>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">حالة التوثيق:</span>
                    <span className="text-teal-700 font-bold">مطابق لأصل العقد الابتدائي</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">المطور العقاري:</span>
                    <span className="text-slate-900 font-bold">معتمد في القائمة الرسمية</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">صلاحية الشيكات:</span>
                    <span className="text-slate-900 font-bold">لا يوجد أي إخطار بالشيكات المرتدة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">شرط الأوفر برايس:</span>
                    <span className="text-emerald-700 font-bold">0% أوفر برايس (مستوفي)</span>
                  </div>
                </div>
                <p>
                  يقر فريق التدقيق القانوني بمنصة وحدتي بمطابقة الأرقام المالية المسجلة بالعقد مع كشف الحساب الصادر من المطور، والتأكد من إمكانية نقل الملكية واسترداد شيكات الأقساط القديمة فوراً بمقر المطور.
                </p>
              </div>

              {/* Document Footer Signatures */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">توقيع المستشار العقاري:</p>
                  <p className="font-serif italic text-teal-800 mt-1">Sherif El-Meniawy, Operations</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">ختم التدقيق الرقمي:</p>
                  <p className="font-mono text-[10px] text-slate-400 mt-1">{new Date().toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Notes */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              {isRTL ? 'جلسة فحص آمنة معتمدة بختم زمني' : 'Secure audited session with cryptographic timestamp'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            {isRTL ? 'إغلاق المعاينة' : 'Close Viewer'}
          </button>
        </div>
      </div>
    </div>
  );
};
