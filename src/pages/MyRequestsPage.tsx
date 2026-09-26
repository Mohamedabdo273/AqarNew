import React, { useState } from 'react';
import {
  Inbox,
  Zap,
  Search,
  Megaphone,
  Users,
  Handshake,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  FileText,
  Ruler,
  CalendarClock,
  AlertTriangle,
  Tag,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { PageId } from '../types';
import { IlloEmpty } from '../components/Illustrations';
import { useLanguage } from '../context/LanguageContext';
import { REQUEST_STAGES, SellRequest, useRequests } from '../context/RequestsContext';
import { DETAIL_SECTIONS, DetailSection, completeness, netToSeller, sectionDone } from '../lib/sellForm';
import { fullMoney, money, currency } from '../lib/unitHelpers';
import { SellDetailsWizard } from '../components/sell/SellDetailsWizard';
import { whatsappLink } from '../config/brand';

interface MyRequestsPageProps {
  code: string | null;
  onOpenRequest: (code: string | null) => void;
  onNavigate: (page: PageId) => void;
}

const formatDate = (iso: string, lang: 'ar' | 'en') =>
  new Date(iso).toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Stage shown to the seller: a complete file moves into review automatically. */
const displayStage = (r: SellRequest) => Math.max(REQUEST_STAGES.indexOf(r.stage), completeness(r.form) === 100 ? 1 : 0);

export const MyRequestsPage: React.FC<MyRequestsPageProps> = ({ code, onOpenRequest, onNavigate }) => {
  const { language, tx, isRTL } = useLanguage();
  const { requests, getRequest } = useRequests();
  const [lookup, setLookup] = useState('');
  const [notFound, setNotFound] = useState(false);
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  const current = code ? getRequest(code) : undefined;
  if (code && current) return <RequestDetail req={current} onBack={() => onOpenRequest(null)} />;

  const stageLabel = (i: number) =>
    [tx('استلمنا طلبك', 'Received'), tx('بنراجعه', 'In review'), tx('منشورة', 'Listed'), tx('لقينا مشتري', 'Buyer found'), tx('اتقبضت', 'Paid out')][i];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('طلباتي', 'My requests')}</h1>
      <p className="mt-2 text-muted">{tx('تابع وحدتك خطوة بخطوة', 'Follow your unit step by step')}</p>

      <form
        className="mt-8 flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const found = getRequest(lookup.trim().toUpperCase());
          setNotFound(!found);
          if (found) onOpenRequest(found.code);
        }}
      >
        <input
          value={lookup}
          onChange={(e) => {
            setLookup(e.target.value);
            setNotFound(false);
          }}
          dir="ltr"
          placeholder={tx('رقم الطلب — مثلاً WHD-12345', 'Request no. — e.g. WHD-12345')}
          className={`field flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
        />
        <button className="btn-ghost h-13" aria-label={tx('دوّر', 'Find')}>
          <Search className="w-5 h-5" />
        </button>
      </form>
      {notFound && <p className="mt-2 text-sm text-danger">{tx('مش لاقيين الرقم ده. كلمنا واتساب ونساعدك.', "Couldn't find that. WhatsApp us and we'll help.")}</p>}

      {requests.length === 0 ? (
        <div className="mt-8 card p-10 text-center">
          <IlloEmpty className="mx-auto w-20 h-20 text-brand" />
          <p className="mt-4 font-bold text-lg text-ink">{tx('لسه ما بعتّش طلبات', 'No requests yet')}</p>
          <p className="mt-1 text-muted">{tx('اعرض وحدتك في دقيقة وتابعها من هنا', 'List your unit in a minute and track it here')}</p>
          <button onClick={() => onNavigate('sell')} className="btn-primary mt-6">
            <Tag className="w-5 h-5" />
            {tx('اعرض وحدتك', 'List your unit')}
          </button>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {requests.map((r) => {
            const pct = completeness(r.form);
            const st = displayStage(r);
            return (
              <li key={r.code}>
                <button onClick={() => onOpenRequest(r.code)} className="w-full card p-5 text-start flex items-center gap-4 transition-all hover:shadow-lift">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="num text-sm font-bold text-muted" dir="ltr">{r.code}</span>
                      <span className="rounded-full bg-brand-soft text-brand-ink px-2.5 py-0.5 text-xs font-semibold">{stageLabel(st)}</span>
                    </div>
                    <p className="mt-1 font-bold text-lg text-ink truncate">{r.form.compound}</p>
                    <p className="text-sm text-muted">
                      {formatDate(r.createdAt, language)} · {tx('هتسترد', "You'll get")} <span className="num font-semibold text-ink">{money(netToSeller(r.form).net, language)}</span>
                    </p>
                    {pct < 100 && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
                          <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="num text-xs font-semibold text-ink-soft whitespace-nowrap">{tx(`البيانات ${pct}%`, `Details ${pct}%`)}</span>
                      </div>
                    )}
                  </div>
                  <Chevron className="w-5 h-5 text-muted shrink-0" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-6 text-center text-xs text-muted">{tx('الطلبات محفوظة على الجهاز ده', 'Requests are saved on this device')}</p>
    </div>
  );
};

/* ───────────── One request: tracker + what's missing + details wizard ───────────── */

const RequestDetail: React.FC<{ req: SellRequest; onBack: () => void }> = ({ req, onBack }) => {
  const { language, tx, isRTL } = useLanguage();
  const { updateRequest } = useRequests();
  const [editing, setEditing] = useState<number | null>(null);
  const Back = isRTL ? ArrowRight : ArrowLeft;

  const f = req.form;
  const pct = completeness(f);
  const st = displayStage(req);
  const { net, fines, discount } = netToSeller(f);

  const stages = [
    { icon: Inbox, t: tx('استلمنا طلبك', 'Request received'), d: formatDate(req.createdAt, language) },
    { icon: Search, t: tx('كشف حساب وحدتك', 'Your unit statement'), d: pct < 100 ? tx('بيبدأ لما البيانات تكمل — نراجع العقد والمديونية', 'Starts once details are complete — we check contract and dues') : tx('خلال 24 ساعة', 'Within 24h') },
    { icon: Megaphone, t: tx('نشر الوحدة للمشترين', 'Listed to buyers'), d: tx('بعد المراجعة', 'After review') },
    { icon: Users, t: tx('معاينة واتفاق مع مشتري', 'Viewing & agreement'), d: tx('بنرتبها معاك', 'We arrange it with you') },
    { icon: Handshake, t: tx('التنازل والقبض', 'Transfer & payout'), d: tx('في مقر المطور بشيك مصرفي', 'At the developer, by bank cheque') },
  ];

  const sectionMeta: Record<DetailSection, { icon: React.ElementType; t: string }> = {
    specs: { icon: Ruler, t: tx('مواصفات الوحدة', 'Unit specs') },
    installments: { icon: CalendarClock, t: tx('الأقساط الباقية', 'Remaining installments') },
    dues: { icon: AlertTriangle, t: tx('المديونية والرسوم', 'Dues & fees') },
    faster: { icon: Zap, t: tx('تبيع أسرع؟ (اختياري)', 'Sell faster? (optional)') },
    docs: { icon: FileText, t: tx('صورة العقد', 'Contract photo') },
  };

  if (editing !== null) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <SellDetailsWizard
          initial={f}
          startStep={editing}
          onSave={(form) => updateRequest(req.code, form)}
          onCancel={() => {
            setEditing(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  const firstMissing = DETAIL_SECTIONS.findIndex((s) => !sectionDone(f, s));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <Back className="w-4 h-4" />
        {tx('كل طلباتي', 'All requests')}
      </button>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="num text-sm font-bold text-muted" dir="ltr">{req.code}</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink">{f.compound}</h1>
          <p className="text-muted">{f.developer}</p>
        </div>
        <a
          href={whatsappLink(tx(`بخصوص طلبي رقم ${req.code}`, `About my request ${req.code}`))}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          <MessageCircle className="w-5 h-5 text-brand" />
          {tx('كلّم مستشارك', 'Talk to your advisor')}
        </a>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1fr_21rem] gap-6 items-start">
        <div className="space-y-6">
          {/* What's missing */}
          {pct < 100 && (
            <div className="card p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-ink">{tx('كمّل بياناتك عشان المراجعة تبدأ', 'Complete your details to start review')}</p>
                <span className="num text-sm font-bold text-ink">{pct}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-line overflow-hidden">
                <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <ul className="mt-5 grid sm:grid-cols-2 gap-2">
                {DETAIL_SECTIONS.map((s, i) => {
                  // The optional step never shows as "done" — nothing was necessarily filled in.
                  const optional = s === 'faster';
                  const done = !optional && sectionDone(f, s);
                  const M = sectionMeta[s];
                  return (
                    <li key={s}>
                      <button
                        onClick={() => setEditing(i)}
                        className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-start transition-colors ${done ? 'border-line bg-paper' : optional ? 'border-line border-dashed bg-surface hover:border-ink-soft' : 'border-line-strong bg-surface hover:border-brand'}`}
                      >
                        <span className={`grid place-items-center w-8 h-8 rounded-full shrink-0 ${done ? 'bg-brand text-white' : 'bg-brand-soft text-ink'}`}>
                          {done ? <Check className="w-4 h-4" strokeWidth={3} /> : <M.icon className="w-4 h-4" />}
                        </span>
                        <span className={`flex-1 font-medium ${done ? 'text-muted' : 'text-ink'}`}>{M.t}</span>
                        <span className={`text-sm font-semibold ${done || optional ? 'text-muted' : 'text-ink underline'}`}>
                          {done ? tx('تعديل', 'Edit') : optional ? tx('افتح', 'Open') : tx('كمّل', 'Add')}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button onClick={() => setEditing(Math.max(0, firstMissing))} className="btn-primary w-full mt-5">
                {tx('كمّل دلوقتي', 'Continue now')}
              </button>
              <p className="mt-3 text-center text-xs text-muted">{tx('أو المستشار يكمّلها معاك في التليفون', 'Or your advisor completes it with you by phone')}</p>
            </div>
          )}

          {/* Tracker */}
          <div className="card p-6 sm:p-7">
            <p className="font-bold text-ink mb-5">{tx('طلبك فين دلوقتي؟', 'Where is my request?')}</p>
            <ol>
              {stages.map((s, i) => {
                // "Received" is always done, so the first live step is review.
                const active = Math.max(st, 1);
                const done = i < active;
                const cur = i === active;
                return (
                  <li key={s.t} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid place-items-center w-10 h-10 rounded-full shrink-0 ${
                          done ? 'bg-brand text-white' : cur ? 'bg-brand-soft text-brand ring-2 ring-brand' : 'bg-paper text-muted border border-line'
                        }`}
                      >
                        {done ? <Check className="w-5 h-5" strokeWidth={3} /> : <s.icon className="w-5 h-5" />}
                      </span>
                      {i < stages.length - 1 && <span className={`w-0.5 flex-1 min-h-6 my-1 ${done ? 'bg-brand' : 'bg-line'}`} />}
                    </div>
                    <div className="pb-6 pt-2">
                      <p className={`font-semibold ${done || cur ? 'text-ink' : 'text-muted'}`}>{s.t}</p>
                      <p className="text-sm text-muted">{s.d}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 card p-6">
          <p className="font-bold text-ink">{tx('هتستلم', "You'll receive")}</p>
          <p className="num font-display mt-2 text-4xl font-bold text-ink">{money(net, language)}</p>
          <p className="text-sm text-muted">{currency(language)} · {tx('بشيك مصرفي', 'by bank cheque')}</p>
          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">{tx('سعر العقد', 'Contract')}</dt>
              <dd className="num font-semibold text-ink">{fullMoney(f.contractPrice, language)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{tx('المدفوع', 'Paid')}</dt>
              <dd className="num font-semibold text-ink">{fullMoney(f.paidAmount, language)}</dd>
            </div>
            {fines > 0 && (
              <div className="flex justify-between text-danger">
                <dt>{tx('متأخرات تتخصم', 'Dues deducted')}</dt>
                <dd className="num font-semibold">−{fullMoney(fines, language)}</dd>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <dt>{tx('خصم منك', 'Your discount')}</dt>
                <dd className="num font-semibold">−{fullMoney(discount, language)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">{tx('عمولتنا عليك', 'Our fee to you')}</dt>
              <dd className="font-semibold text-ink">{tx('صفر', 'Zero')}</dd>
            </div>
            {(f.negotiable || f.eligibleForSwap) && (
              <div className="pt-2.5 border-t border-line flex flex-wrap gap-1.5">
                {f.negotiable && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-ink">{tx('قابل للتفاوض', 'Negotiable')}</span>}
                {f.eligibleForSwap && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-ink">{tx('يقبل التبديل', 'Open to swap')}</span>}
              </div>
            )}
          </dl>
        </aside>
      </div>
    </div>
  );
};
