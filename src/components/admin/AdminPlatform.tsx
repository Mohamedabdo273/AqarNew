import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Search, 
  Filter, 
  Users, 
  Handshake, 
  BarChart3, 
  Plus, 
  Eye, 
  Phone, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  RefreshCw, 
  Layers, 
  Coins, 
  Check, 
  ArrowLeft,
  Building2,
  ExternalLink
} from 'lucide-react';
import { 
  AdminDeal, 
  AdminInquiry, 
  AdminQueueUnit, 
  DealStage, 
  PipelineReport, 
  QueueUnitStatus 
} from '../../types/admin';
import { adminApi } from '../../services/adminApi';
import { ADMIN_ADVISORS } from '../../data/adminMockData';
import { UnitAuditModal } from './UnitAuditModal';
import { NewDealModal } from './NewDealModal';

interface AdminPlatformProps {
  onBackToApp: () => void;
  language: 'ar' | 'en';
}

type AdminTab = 'queue' | 'inquiries' | 'deals' | 'reports';

export const AdminPlatform: React.FC<AdminPlatformProps> = ({
  onBackToApp,
  language,
}) => {
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState<AdminTab>('queue');
  
  // Data States
  const [queueUnits, setQueueUnits] = useState<AdminQueueUnit[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [deals, setDeals] = useState<AdminDeal[]>([]);
  const [report, setReport] = useState<PipelineReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [queueStatusFilter, setQueueStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<string>('all');

  // Modals
  const [selectedUnitForAudit, setSelectedUnitForAudit] = useState<AdminQueueUnit | null>(null);
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);

  // Load All Admin Data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [queueData, inquiriesData, dealsData, reportData] = await Promise.all([
        adminApi.getQueue(),
        adminApi.getInquiries(),
        adminApi.getDeals(),
        adminApi.getPipelineReport(),
      ]);
      setQueueUnits(queueData);
      setInquiries(inquiriesData);
      setDeals(dealsData);
      setReport(reportData);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const formatEgp = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-US').format(amount);
  };

  // Handler for updating a unit in the queue
  const handleUnitUpdated = (updated: AdminQueueUnit) => {
    setQueueUnits((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    // Refresh reports
    adminApi.getPipelineReport().then(setReport);
  };

  // Handler for creating a new deal
  const handleCreateDeal = async (dealData: Omit<AdminDeal, 'id' | 'dealCode' | 'createdAt' | 'milestones'>) => {
    try {
      const created = await adminApi.createDeal(dealData);
      setDeals((prev) => [created, ...prev]);
      adminApi.getPipelineReport().then(setReport);
    } catch (err) {
      console.error(err);
    }
  };

  // Handler for advancing deal stage
  const handleAdvanceDealStage = async (dealId: string, currentStage: DealStage) => {
    const stages: DealStage[] = ['reservation', 'developer_clearance', 'cashier_check_prep', 'hq_assignment', 'completed'];
    const currentIdx = stages.indexOf(currentStage);
    if (currentIdx < stages.length - 1) {
      const nextStage = stages[currentIdx + 1];
      try {
        const updated = await adminApi.updateDeal(dealId, {
          stage: nextStage,
          status: nextStage === 'completed' ? 'completed' : 'active',
        });
        setDeals((prev) => prev.map((d) => (d.id === dealId ? updated : d)));
        adminApi.getPipelineReport().then(setReport);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Handler for assigning inquiry to advisor
  const handleAssignInquiry = async (inquiryId: string, advisorId: string) => {
    const advisor = ADMIN_ADVISORS.find((a) => a.id === advisorId);
    try {
      const updated = await adminApi.updateInquiry({
        id: inquiryId,
        assignedAdvisorId: advisorId,
        assignedAdvisorName: advisor?.name,
        status: 'contacted',
      });
      setInquiries((prev) => prev.map((inq) => (inq.id === inquiryId ? updated : inq)));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Queue
  const filteredQueue = queueUnits.filter((u) => {
    if (queueStatusFilter !== 'all' && u.status !== queueStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = u.title.toLowerCase().includes(q);
      const matchesCompound = u.compound.toLowerCase().includes(q);
      const matchesDeveloper = u.developer.toLowerCase().includes(q);
      const matchesSeller = u.seller.name.toLowerCase().includes(q);
      const matchesCode = u.unitCode.toLowerCase().includes(q);
      if (!matchesTitle && !matchesCompound && !matchesDeveloper && !matchesSeller && !matchesCode) return false;
    }
    return true;
  });

  const pendingQueueCount = queueUnits.filter((u) => u.status === 'pending_review').length;
  const urgentAlertsCount = queueUnits.filter((u) => u.urgencyAlert).length;

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a]" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Top Operations Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand / Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[#2dd4bf] flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight text-white">
                    {isRTL ? 'لوحة تحكم العمليات والتنازل' : 'Forsa Operations'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-[#2dd4bf] border border-teal-500/30">
                    ADMIN v2.6
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isRTL ? 'إدارة طابور المراجعة • توزيع الطلبات • متابعة صفقات المطورين' : 'Verification Queue • Lead Routing • HQ Assignment Pipeline'}
                </p>
              </div>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="hidden lg:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">{isRTL ? 'طابور التدقيق:' : 'Pending Queue:'}</span>
                <strong className="text-amber-300 font-bold">{pendingQueueCount}</strong>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Handshake className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-slate-400">{isRTL ? 'صفقات جارية:' : 'Active Deals:'}</span>
                <strong className="text-[#2dd4bf] font-bold">{deals.filter((d) => d.status === 'active').length}</strong>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">{isRTL ? 'كاش مسترد للبائعين:' : 'Cash Recovered:'}</span>
                <strong className="text-emerald-300 font-bold">62.8M {isRTL ? 'ج.م' : 'EGP'}</strong>
              </div>
            </div>

            {/* Right Controls: Refresh & Exit */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={loadAllData}
                disabled={loading}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title={isRTL ? 'تحديث البيانات' : 'Refresh Data'}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={onBackToApp}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{isRTL ? 'الرجوع للمنصة العامة' : 'Public Portal'}</span>
                {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

          {/* 4 Main Module Tabs */}
          <div className="flex space-x-2 space-x-reverse border-t border-slate-800 overflow-x-auto text-xs py-1">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'queue' 
                  ? 'bg-[#0f766e] text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isRTL ? 'طابور المراجعة والاعتماد' : 'Verification Queue'}</span>
              {pendingQueueCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {pendingQueueCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'inquiries' 
                  ? 'bg-[#0f766e] text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isRTL ? 'الطلبات وتوزيعها' : 'Inquiries Routing'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300 text-[10px] font-mono">
                {inquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'deals' 
                  ? 'bg-[#0f766e] text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Handshake className="w-4 h-4" />
              <span>{isRTL ? 'الصفقات ومراحل التنازل' : 'Deals Pipeline'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300 text-[10px] font-mono">
                {deals.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'reports' 
                  ? 'bg-[#0f766e] text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{isRTL ? 'التقرير ومحفظة العمليات' : 'Pipeline Reports'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* ========================================================= */}
        {/* MODULE 1: QUEUE & VERIFICATION (طابور المراجعة والاعتماد)   */}
        {/* ========================================================= */}
        {activeTab === 'queue' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* SLA Alert Banner */}
            {urgentAlertsCount > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-200/70 text-amber-800 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="font-bold text-sm block">
                      {isRTL ? `يوجد ${urgentAlertsCount} وحدات ذات أولوية قصوى أو تجاوزت زمن الـ SLA` : `${urgentAlertsCount} units require immediate audit attention`}
                    </strong>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      {isRTL 
                        ? 'تنبيهات الأقساط القادمة والشيكات المستحقة تستوجب المراجعة خلال 12 ساعة لمساعدة البائع على الخروج في الوقت المناسب.'
                        : 'Upcoming installment due dates require audit within 12 hours to secure timely seller exit.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setQueueStatusFilter('pending_review')}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shrink-0 self-start sm:self-center transition-colors cursor-pointer"
                >
                  {isRTL ? 'عرض الوحدات المنتظرة فقط' : 'View Pending Only'}
                </button>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder={isRTL ? 'بحث بكود الوحدة، اسم المطور، الكمبوند، أو البائع...' : 'Search by code, developer, compound, seller...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Status Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
                {[
                  { key: 'all', labelAr: 'الكل', labelEn: 'All' },
                  { key: 'pending_review', labelAr: 'قيد التدقيق', labelEn: 'Pending Review' },
                  { key: 'info_requested', labelAr: 'استكمال بيانات', labelEn: 'Info Requested' },
                  { key: 'verified', labelAr: 'معتمد ومنشور', labelEn: 'Verified' },
                  { key: 'rejected', labelAr: 'مرفوض', labelEn: 'Rejected' },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setQueueStatusFilter(pill.key)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                      queueStatusFilter === pill.key
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isRTL ? pill.labelAr : pill.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue Table / Cards */}
            <div className="space-y-3">
              {filteredQueue.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  {isRTL ? 'لا توجد وحدات تطابق معايير البحث الحالية' : 'No queue units match your current search'}
                </div>
              ) : (
                filteredQueue.map((unit) => {
                  const savings = unit.currentMarketPrice - unit.originalContractPrice;
                  return (
                    <div
                      key={unit.id}
                      className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md ${
                        unit.isOverdueSla ? 'border-amber-400 bg-amber-50/10' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Unit Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {unit.unitCode}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              unit.status === 'pending_review' ? 'bg-amber-100 text-amber-800' :
                              unit.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                              unit.status === 'info_requested' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {unit.status === 'pending_review' ? (isRTL ? 'قيد المراجعة' : 'Pending Audit') :
                               unit.status === 'verified' ? (isRTL ? 'معتمد ومنشور' : 'Verified & Live') :
                               unit.status === 'info_requested' ? (isRTL ? 'طلب استكمال بيانات' : 'Info Requested') :
                               (isRTL ? 'مرفوض' : 'Rejected')}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                              {unit.developerTier}
                            </span>
                            {unit.isOverdueSla && (
                              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{isRTL ? `متأخر (${unit.waitingHours} ساعة)` : `Overdue (${unit.waitingHours}h)`}</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            {unit.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>{unit.developer} - {unit.compound}</span>
                            <span>•</span>
                            <span>{isRTL ? 'البائع:' : 'Seller:'} <strong>{unit.seller.name}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-teal-700 font-medium">
                              <FileText className="w-3.5 h-3.5" />
                              <span>{unit.documents.length} {isRTL ? 'مستندات مرفوعة' : 'Docs'}</span>
                            </span>
                          </div>

                          {unit.urgencyAlert && (
                            <p className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded inline-block">
                              {unit.urgencyAlert}
                            </p>
                          )}
                        </div>

                        {/* Financial Snapshot */}
                        <div className="flex items-center gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-r border-slate-100 pt-3 lg:pt-0 lg:pr-6 shrink-0">
                          <div>
                            <span className="text-[11px] text-slate-400 block">{isRTL ? 'الكاش المطلوب للبائع' : 'Cash to Seller'}</span>
                            <span className="text-base font-black text-[#0f766e]">{formatEgp(unit.paidCashAmount)}</span>
                            <span className="text-[10px] text-slate-500 block">{isRTL ? '0% أوفر' : '0% Overprice'}</span>
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-400 block">{isRTL ? 'سعر العقد القديم' : 'Original Contract'}</span>
                            <span className="text-sm font-bold text-slate-800">{formatEgp(unit.originalContractPrice)}</span>
                            <span className="text-[10px] text-emerald-700 font-bold block">
                              {isRTL ? `توفير ${formatEgp(savings)}` : `Saves ${formatEgp(savings)}`}
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedUnitForAudit(unit)}
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f766e] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
                            <span>{isRTL ? 'فحص وتدقيق الوحدة' : 'Audit Unit'}</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 2: INQUIRIES & LEAD ROUTING (الطلبات وتوزيعها)       */}
        {/* ========================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {isRTL ? 'إدارة وتوزيع طلبات المشترين والبائعين' : 'Inquiries & Lead Distribution'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL 
                    ? 'توزيع الطلبات على مديري الحسابات ومستشاري الصفقات حسب المنطقة ونوع الوحدة' 
                    : 'Assign buyer inquiries and seller exit requests to specialized property advisors'}
                </p>
              </div>

              {/* Inquiry Type Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">{isRTL ? 'تصفية النوع:' : 'Type:'}</span>
                <select
                  value={inquiryTypeFilter}
                  onChange={(e) => setInquiryTypeFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="all">{isRTL ? 'جميع الطلبات' : 'All Types'}</option>
                  <option value="buyer_inquiry">{isRTL ? 'مشتري مهتم' : 'Buyer Inquiry'}</option>
                  <option value="seller_exit">{isRTL ? 'بائع يرغب بالتنازل' : 'Seller Exit'}</option>
                  <option value="investor_vip">{isRTL ? 'مستثمر VIP' : 'VIP Investor'}</option>
                  <option value="legal_consultation">{isRTL ? 'استشارة قانونية' : 'Legal Consultation'}</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right" dir={isRTL ? 'rtl' : 'ltr'}>
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5 font-bold">{isRTL ? 'العميل' : 'Client'}</th>
                      <th className="p-3.5 font-bold">{isRTL ? 'نوع الطلب والوحدة' : 'Request & Unit'}</th>
                      <th className="p-3.5 font-bold">{isRTL ? 'الميزانية / الكاش' : 'Budget'}</th>
                      <th className="p-3.5 font-bold">{isRTL ? 'الأولوية' : 'Priority'}</th>
                      <th className="p-3.5 font-bold">{isRTL ? 'المستشار المعين' : 'Assigned Advisor'}</th>
                      <th className="p-3.5 font-bold">{isRTL ? 'الحالة' : 'Status'}</th>
                      <th className="p-3.5 font-bold text-center">{isRTL ? 'إجراء سريع' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inquiries
                      .filter((inq) => inquiryTypeFilter === 'all' || inq.type === inquiryTypeFilter)
                      .map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <strong className="font-bold text-slate-900 block">{inq.clientName}</strong>
                            <span className="font-mono text-slate-500 text-[11px]">{inq.clientPhone}</span>
                          </td>

                          <td className="p-3.5 max-w-xs">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                              {inq.type === 'buyer_inquiry' ? (isRTL ? 'مشتري لوحدة' : 'Buyer') :
                               inq.type === 'seller_exit' ? (isRTL ? 'طلب خروج بائع' : 'Seller Exit') :
                               inq.type === 'investor_vip' ? (isRTL ? 'مستثمر VIP' : 'VIP Investor') :
                               (isRTL ? 'استشارة قانونية' : 'Legal')}
                            </span>
                            <p className="text-slate-700 truncate">{inq.unitTitle || inq.notes}</p>
                          </td>

                          <td className="p-3.5 font-mono font-bold text-[#0f766e]">
                            {inq.budgetEgp ? `${formatEgp(inq.budgetEgp)} ج.م` : '—'}
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inq.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              inq.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {inq.priority === 'urgent' ? (isRTL ? 'عاجل' : 'Urgent') :
                               inq.priority === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
                               (isRTL ? 'عادي' : 'Normal')}
                            </span>
                          </td>

                          {/* Instant Advisor Assignment Selector */}
                          <td className="p-3.5">
                            <select
                              value={inq.assignedAdvisorId || ''}
                              onChange={(e) => handleAssignInquiry(inq.id, e.target.value)}
                              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-bold text-slate-800 cursor-pointer"
                            >
                              <option value="">{isRTL ? 'غير معين (تعيين مستشار)' : 'Unassigned'}</option>
                              {ADMIN_ADVISORS.map((adv) => (
                                <option key={adv.id} value={adv.id}>
                                  {adv.name} ({adv.role.split(' - ')[0]})
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inq.status === 'new' ? 'bg-teal-100 text-teal-800' :
                              inq.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              inq.status === 'meeting_scheduled' ? 'bg-purple-100 text-purple-800' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {inq.status === 'new' ? (isRTL ? 'جديد' : 'New') :
                               inq.status === 'contacted' ? (isRTL ? 'قيد التواصل' : 'Contacted') :
                               inq.status === 'meeting_scheduled' ? (isRTL ? 'مجدول جلسة' : 'Scheduled') :
                               (isRTL ? 'مكتمل' : 'Closed')}
                            </span>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <a
                                href={`https://wa.me/2${inq.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `مرحباً ${inq.clientName}، مع حضرتك مستشار العمليات بمنصة فرصة بخصوص طلبك (${inq.inquiryCode}).`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${inq.clientPhone}`}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                title="Call"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 3: DEALS PIPELINE (الصفقات ومراحل التنازل)           */}
        {/* ========================================================= */}
        {activeTab === 'deals' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {isRTL ? 'إدارة صفقات التنازل ومراحل التنفيذ' : 'Deals Pipeline & HQ Assignments'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL 
                    ? 'المراحل الخمس لنقل الملكية: من حجز الوحدة حتى جلسة التوقيع واسترداد الشيكات بمقر المطور' 
                    : 'Track assignment milestones from initial matching to developer HQ check handover'}
                </p>
              </div>

              <button
                onClick={() => setIsNewDealOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{isRTL ? 'إدراج صفقة تنازل جديدة' : 'New Assignment Deal'}</span>
              </button>
            </div>

            {/* 5 Stages Kanban View */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              {[
                { stage: 'reservation', titleAr: '1. حجز ومطابقة', titleEn: '1. Matching' },
                { stage: 'developer_clearance', titleAr: '2. مراجعة المطور', titleEn: '2. Dev Clearance' },
                { stage: 'cashier_check_prep', titleAr: '3. تجهيز الشيك', titleEn: '3. Cashier Check' },
                { stage: 'hq_assignment', titleAr: '4. جلسة المطور', titleEn: '4. HQ Signing' },
                { stage: 'completed', titleAr: '5. إتمام ونقل الملكية', titleEn: '5. Completed' },
              ].map((column) => {
                const stageDeals = deals.filter((d) => d.stage === column.stage);
                return (
                  <div key={column.stage} className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col min-h-[460px]">
                    <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800">
                        {isRTL ? column.titleAr : column.titleEn}
                      </h3>
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {stageDeals.length === 0 ? (
                        <div className="text-center py-10 text-[11px] text-slate-400">
                          {isRTL ? 'لا توجد صفقات حالياً' : 'No active deals'}
                        </div>
                      ) : (
                        stageDeals.map((deal) => (
                          <div
                            key={deal.id}
                            className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200/80 space-y-2 text-xs transition-all shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {deal.dealCode}
                              </span>
                              {deal.stage === 'hq_assignment' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-600 text-white animate-pulse">
                                  {isRTL ? 'جلسة قادمة' : 'HQ Scheduled'}
                                </span>
                              )}
                            </div>

                            <p className="font-bold text-slate-900 leading-tight">
                              {deal.unitTitle}
                            </p>

                            <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                              <div className="flex justify-between">
                                <span className="text-slate-400">{isRTL ? 'كاش البائع:' : 'Cash:'}</span>
                                <strong className="text-[#0f766e]">{formatEgp(deal.cashAmountToSeller)}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">{isRTL ? 'البائع:' : 'Seller:'}</span>
                                <span className="truncate max-w-[90px]">{deal.sellerName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">{isRTL ? 'المشتري:' : 'Buyer:'}</span>
                                <span className="truncate max-w-[90px]">{deal.buyerName}</span>
                              </div>
                            </div>

                            {deal.targetHqDate && (
                              <p className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
                                {isRTL ? `الموعد: ${deal.targetHqDate}` : `Date: ${deal.targetHqDate}`}
                              </p>
                            )}

                            {deal.stage !== 'completed' && (
                              <button
                                onClick={() => handleAdvanceDealStage(deal.id, deal.stage)}
                                className="w-full mt-1 py-1.5 px-2 rounded bg-slate-900 hover:bg-[#0f766e] text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <span>{isRTL ? 'ترقية للمرحلة التالية' : 'Advance Stage'}</span>
                                {isRTL ? <ArrowLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODULE 4: PIPELINE REPORTS (التقرير ومحفظة العمليات)        */}
        {/* ========================================================= */}
        {activeTab === 'reports' && report && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {isRTL ? 'تقرير العمليات ومحفظة التنازلات النشطة' : 'Operations & Exit Pipeline Report'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL 
                  ? 'المؤشرات الرئيسية لأداء المنصة، الكاش المسترد للبائعين وسرعة إتمام التنازل' 
                  : 'Key performance indicators on verification speed, capital recovered, and developer exit volume'}
              </p>
            </div>

            {/* 4 Primary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs text-slate-500 block">{isRTL ? 'إجمالي محفظة التنازلات' : 'Total Pipeline Value'}</span>
                <span className="text-2xl font-black text-[#0f172a]">{formatEgp(report.totalPipelineValue)} <span className="text-xs font-normal text-slate-500">ج.م</span></span>
                <span className="text-[11px] text-teal-700 font-bold block">{isRTL ? 'قيمة العقود قيد التنازل' : 'Active contract valuations'}</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs text-slate-500 block">{isRTL ? 'كاش مسترد للبائعين 100%' : 'Total Seller Cash Recovered'}</span>
                <span className="text-2xl font-black text-[#0f766e]">{formatEgp(report.totalCashRecoveredForSellers)} <span className="text-xs font-normal text-slate-500">ج.م</span></span>
                <span className="text-[11px] text-emerald-700 font-bold block">{isRTL ? 'دون خسارة غرامات الـ 15%' : '0% cancellation loss'}</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs text-slate-500 block">{isRTL ? 'متوسط سرعة الفحص والتدقيق' : 'Avg. Verification SLA'}</span>
                <span className="text-2xl font-black text-slate-900">{report.avgVerificationHours} <span className="text-xs font-normal text-slate-500">{isRTL ? 'ساعات' : 'hrs'}</span></span>
                <span className="text-[11px] text-slate-500 block">{isRTL ? 'أسرع من السوق بـ 8x' : '8x faster than traditional resale'}</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs text-slate-500 block">{isRTL ? 'متوسط أيام إتمام التنازل' : 'Avg. Days to Exit'}</span>
                <span className="text-2xl font-black text-slate-900">{report.avgDaysToExit} <span className="text-xs font-normal text-slate-500">{isRTL ? 'يوماً' : 'days'}</span></span>
                <span className="text-[11px] text-teal-700 font-bold block">{isRTL ? 'مقارنة بـ 6-9 شهور في الريسيل' : 'vs 6-9 months in broker resale'}</span>
              </div>
            </div>

            {/* Developer Share Distribution */}
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0f766e]" />
                  <span>{isRTL ? 'توزيع الوحدات حسب كبار المطورين في مصر' : 'Developer Market Share Distribution'}</span>
                </h3>

                <div className="space-y-3.5">
                  {report.developerDistribution.map((dev) => (
                    <div key={dev.developer} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-800">{dev.developer}</span>
                        <span className="font-mono font-bold text-slate-900">{formatEgp(dev.valueEgp)} ج.م ({dev.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#0f766e] h-2 rounded-full"
                          style={{ width: `${dev.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Performance Trend */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#0f766e]" />
                  <span>{isRTL ? 'تطور عمليات التنازل والكاش المسترد' : 'Monthly Exit & Cash Trend'}</span>
                </h3>

                <div className="space-y-3">
                  {report.monthlyPerformance.map((item) => (
                    <div key={item.month} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="font-bold text-slate-900 block">{item.month}</strong>
                        <span className="text-[11px] text-slate-500">{item.exitsCount} {isRTL ? 'صفقات تنازل منجزة' : 'exits completed'}</span>
                      </div>
                      <div className="text-left font-mono">
                        <span className="font-black text-[#0f766e] block">{formatEgp(item.cashRecoveredEgp)} ج.م</span>
                        <span className="text-[10px] text-emerald-700 font-bold">{isRTL ? 'استرداد فوري' : '100% Cash'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Audit Modal for Queue Unit */}
      {selectedUnitForAudit && (
        <UnitAuditModal
          unit={selectedUnitForAudit}
          onClose={() => setSelectedUnitForAudit(null)}
          onUnitUpdated={handleUnitUpdated}
          language={language}
        />
      )}

      {/* New Deal Modal */}
      {isNewDealOpen && (
        <NewDealModal
          onClose={() => setIsNewDealOpen(false)}
          onCreateDeal={handleCreateDeal}
          language={language}
        />
      )}

    </div>
  );
};
