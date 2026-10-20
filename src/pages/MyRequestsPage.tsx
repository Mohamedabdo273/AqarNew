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
  Loader2,
  LogIn,
  Heart,
  Scale,
  ShieldCheck,
  ExternalLink,
  ImagePlus,
  X,
} from 'lucide-react';
import { PageId } from '../types';
import { IlloEmpty } from '../components/Illustrations';
import { useLanguage } from '../context/LanguageContext';
import { REQUEST_STAGES, SellRequest, useRequests } from '../context/RequestsContext';
import { useAuth } from '../context/AuthContext';
import { useUnits } from '../context/UnitsContext';
import { useCompare } from '../context/CompareContext';
import { DETAIL_SECTIONS, DetailSection, completeness, netToSeller, sectionDone } from '../lib/sellForm';
import { fullMoney, money, currency } from '../lib/unitHelpers';
import { SellDetailsWizard } from '../components/sell/SellDetailsWizard';
import { ADMIN_URL, whatsappLink } from '../config/brand';
import { ApiError, SellRequestTracker, USER_ROLE, errorText, mediaUrl, trackSellRequest } from '../services/api';

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
  const { requests, loading, getRequest } = useRequests();
  const { user, checking, openSignIn } = useAuth();
  const { savedUnitIds } = useUnits();
  const { compareIds } = useCompare();
  const [lookup, setLookup] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [lookupError, setLookupError] = useState('');
  // A request found by number that wasn't sent from this device: stage only, no personal details.
  const [tracked, setTracked] = useState<SellRequestTracker | null>(null);
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  const current = code ? getRequest(code) : undefined;
  if (code && current) return <RequestDetail req={current} onBack={() => onOpenRequest(null)} />;
  if (code && loading) {
    return (
      <div className="py-24 grid place-items-center text-muted" aria-busy="true">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const stageLabel = (i: number) =>
    [tx('استلمنا طلبك', 'Received'), tx('بنراجعه', 'In review'), tx('منشورة', 'Listed'), tx('لقينا مشتري', 'Buyer found'), tx('اتقبضت', 'Paid out')][i];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">{tx('حسابي', 'My account')}</h1>

      {/* Who's signed in — or an invitation to sign in */}
      {!checking &&
        (user ? (
          <div className="mt-6 card overflow-hidden">
            <div className="bg-brand px-5 py-5 sm:px-6 flex items-center gap-4">
              <span className="grid place-items-center w-14 h-14 rounded-full bg-white/15 ring-2 ring-white/30 text-white text-2xl font-bold shrink-0">
                {user.fullName.trim().charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold text-white truncate">{user.fullName}</p>
                <p className="num text-sm text-white/75" dir="ltr">
                  {user.phone}
                </p>
              </div>
              {user.role >= USER_ROLE.ops && ADMIN_URL && (
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user.role === USER_ROLE.admin ? tx('أدمن', 'Admin') : tx('من الفريق', 'Team')}
                </span>
              )}
            </div>
            <div className="px-5 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted">
                {tx('عضو من', 'Member since')} {formatDate(user.createdAt, language)}
              </span>
              {user.role >= USER_ROLE.ops && (
                <a href={ADMIN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline">
                  <ShieldCheck className="w-4 h-4" />
                  {tx('لوحة التحكم', 'Dashboard')}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 card p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-md">
              <p className="font-bold text-ink">{tx('ادخل برقم موبايلك', 'Sign in with your mobile')}</p>
              <p className="mt-1 text-sm text-muted">{tx('وتشوف طلباتك ومفضلتك من أي جهاز.', 'See your requests and saved units on any device.')}</p>
            </div>
            <button onClick={openSignIn} className="btn-primary min-h-11 px-5 text-sm">
              <LogIn className="w-4 h-4" />
              {tx('دخول', 'Sign in')}
            </button>
          </div>
        ))}

      {/* Quick counts — each opens its page */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: Tag, n: requests.length, l: tx('طلبات البيع', 'Sell requests'), go: () => onNavigate('sell') },
          { icon: Heart, n: savedUnitIds.length, l: tx('المفضلة', 'Saved'), go: () => onNavigate('saved') },
          { icon: Scale, n: compareIds.length, l: tx('في المقارنة', 'Comparing'), go: () => onNavigate('compare') },
        ].map((t, i) => (
          <button
            key={t.l}
            onClick={i === 0 ? () => document.getElementById('my-requests')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) : t.go}
            className="card p-4 text-start transition-all hover:shadow-lift hover:border-brand/40"
          >
            <t.icon className="w-5 h-5 text-brand" />
            <p className="num mt-2 text-2xl font-bold text-ink">{t.n}</p>
            <p className="text-sm text-muted">{t.l}</p>
          </button>
        ))}
      </div>

      {/* Sell requests */}
      <div id="my-requests" className="mt-10 scroll-mt-24 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink">{tx('طلبات البيع', 'Sell requests')}</h2>
          <p className="mt-1 text-sm text-muted">{tx('تابع مراجعة وعرض وحدتك خطوة بخطوة', 'Follow your unit review and listing step by step')}</p>
        </div>
        <button onClick={() => onNavigate('sell')} className="btn-ghost min-h-11 px-4 text-sm">
          <Tag className="w-4 h-4" />
          {tx('اعرض وحدة', 'List a unit')}
        </button>
      </div>

      <form
        className="mt-4 flex gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const wanted = lookup.trim().toUpperCase();
          if (!wanted || searching) return;
          setTracked(null);
          setLookupError('');
          const found = getRequest(wanted);
          if (found) return onOpenRequest(found.code);
          setSearching(true);
          try {
            setTracked(await trackSellRequest(wanted));
            setNotFound(false);
          } catch (err) {
            if (err instanceof ApiError && err.status === 404) setNotFound(true);
            else setLookupError(tx('مش قادرين نوصل للسيرفر دلوقتي، جرّب تاني.', "Can't reach the server right now. Try again."));
          } finally {
            setSearching(false);
          }
        }}
      >
        <input
          value={lookup}
          onChange={(e) => {
            setLookup(e.target.value);
            setNotFound(false);
            setLookupError('');
          }}
          dir="ltr"
          placeholder={tx('أدخل كود الطلب — مثلاً WHD-12345', 'Enter request code — e.g. WHD-12345')}
          className={`field flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
        />
        <button className="btn-ghost h-13" aria-label={tx('دوّر', 'Find')} disabled={searching}>
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </form>
      {notFound && <p className="mt-2 text-sm text-danger">{tx('مش لاقيين الرقم ده. كلمنا واتساب ونساعدك.', "Couldn't find that. WhatsApp us and we'll help.")}</p>}
      {lookupError && <p className="mt-2 text-sm text-danger">{lookupError}</p>}
      {tracked && (
        <div className="mt-4 card p-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="num text-sm font-bold text-muted" dir="ltr">{tracked.code}</span>
            <span className="rounded-full bg-brand-soft text-brand-ink px-2.5 py-0.5 text-xs font-semibold">
              {tracked.stage === 'closed' ? tx('مقفول', 'Closed') : stageLabel(Math.max(0, REQUEST_STAGES.indexOf(tracked.stage as SellRequest['stage'])))}
            </span>
          </div>
          <p className="mt-1 font-bold text-lg text-ink">{tracked.compound}</p>
          <p className="text-sm text-muted">
            {tracked.developer} · {tx('آخر تحديث', 'Updated')} {formatDate(tracked.updatedAt, language)}
          </p>
          <p className="mt-3 text-xs text-muted">{tx('التفاصيل بتظهر بس على الجهاز اللي اتبعت منه الطلب، أو كلم مستشارك.', 'Full details show only on the device the request was sent from — or ask your advisor.')}</p>
        </div>
      )}

      {loading ? (
        <div className="mt-8 py-16 grid place-items-center text-muted" aria-busy="true">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-8 card p-10 text-center">
          <IlloEmpty className="mx-auto w-20 h-20 text-brand" />
          <p className="mt-4 font-bold text-lg text-ink">{tx('لسه ما قدمتش طلب لعرض وحدتك', 'No unit requests submitted yet')}</p>
          <p className="mt-1 text-muted max-w-md mx-auto">{tx('اعرض وحدتك في دقيقة وهتقدر تتابع كل خطوات المراجعة والمشتري من هنا', 'List your unit in a minute and track all review and buyer steps from here')}</p>
          <button onClick={() => onNavigate('sell')} className="btn-primary mt-6">
            <Tag className="w-5 h-5" />
            {tx('اعرض وحدتك للبيع', 'List your unit')}
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
                      <span className="rounded-full bg-brand-soft text-brand-ink px-2.5 py-0.5 text-xs font-semibold">
                        {r.apiStage === 'closed' ? tx('مقفول', 'Closed') : stageLabel(st)}
                      </span>
                      {r.needsInfoReason && (
                        <span className="rounded-full bg-danger-soft text-danger px-2.5 py-0.5 text-xs font-semibold">{tx('محتاجين منك حاجة', 'Action needed')}</span>
                      )}
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
      <p className="mt-6 text-center text-xs text-muted">{user
          ? tx('دي طلبات حسابك، واللي اتبعتت من الجهاز ده', 'Requests on your account, plus any sent from this device')
          : tx('دي الطلبات اللي اتبعتت من الجهاز ده — سجّل دخول عشان تشوف طلباتك من أي جهاز', 'These are the requests sent from this device — sign in to see them on any device')}</p>
    </div>
  );
};

/* ───────────── One request: tracker + what's missing + details wizard ───────────── */

const RequestDetail: React.FC<{ req: SellRequest; onBack: () => void }> = ({ req, onBack }) => {
  const { language, tx, isRTL } = useLanguage();
  const { updateRequest, uploadDocument } = useRequests();
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
          onUpload={(type, file) => uploadDocument(req.code, type, file)}
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
        {tx('كل طلبات وحداتي', 'All my unit requests')}
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

      {req.needsInfoReason && (
        <div role="alert" className="mt-6 rounded-xl border border-danger/25 bg-danger-soft p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-danger">{tx('فريق المراجعة محتاج منك:', 'The review team needs:')}</p>
            <p className="mt-1 text-sm text-ink-soft">{req.needsInfoReason}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid lg:grid-cols-[1fr_21rem] gap-6 items-start">
        <div className="space-y-6">
          {/* What's missing — only while the request can still be edited */}
          {pct < 100 && req.canEdit && (
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

          <PhotosCard req={req} />

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
            {(f.negotiable || f.eligibleForSwap || f.privateListing) && (
              <div className="pt-2.5 border-t border-line flex flex-wrap gap-1.5">
                {f.negotiable && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-ink">{tx('قابل للتفاوض', 'Negotiable')}</span>}
                {f.eligibleForSwap && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-ink">{tx('يقبل التبديل', 'Open to swap')}</span>}
                {f.privateListing && <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-ink">{tx('عرض خاص', 'Private listing')}</span>}
              </div>
            )}
          </dl>
        </aside>
      </div>
    </div>
  );
};

/* ───────────── Listing photos: add / remove while the request is editable ───────────── */

const MAX_PHOTOS = 12;

const PhotosCard: React.FC<{ req: SellRequest }> = ({ req }) => {
  const { tx } = useLanguage();
  const { uploadPhoto, deletePhoto } = useRequests();
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const photos = req.photos;
  const canAdd = req.canEdit && photos.length < MAX_PHOTOS;

  const add = async (files: File[]) => {
    setError('');
    setBusy(true);
    // One at a time, so they keep the order picked.
    for (const f of files.slice(0, MAX_PHOTOS - photos.length)) {
      try {
        await uploadPhoto(req.code, f);
      } catch (e) {
        setError(errorText(e));
        break;
      }
    }
    setBusy(false);
  };

  const remove = async (url: string) => {
    setError('');
    setRemoving(url);
    try {
      await deletePhoto(req.code, url);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setRemoving(null);
    }
  };

  if (!req.canEdit && !photos.length) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-ink">{tx('صور الوحدة', 'Unit photos')}</p>
        <span className="num text-sm text-muted">
          {photos.length}/{MAX_PHOTOS}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {req.canEdit
          ? tx('الصور بتبان للمشترين لما الوحدة تتنشر — أول صورة هي الغلاف.', 'Buyers see these once the unit is listed — the first photo is the cover.')
          : tx('الوحدة اتنشرت — لتغيير الصور كلمنا.', 'The unit is listed — to change photos, contact us.')}
      </p>

      {(photos.length > 0 || canAdd) && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {photos.map((url, i) => (
            <div key={url} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface">
              <img src={mediaUrl(url)} alt="" loading="lazy" className={`w-full h-full object-cover ${removing === url ? 'opacity-40' : ''}`} />
              {i === 0 && (
                <span className="absolute bottom-1 start-1 rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-bold text-white">{tx('الغلاف', 'Cover')}</span>
              )}
              {req.canEdit && (
                <button
                  type="button"
                  onClick={() => remove(url)}
                  disabled={busy || removing !== null}
                  className="absolute top-1 end-1 grid place-items-center w-7 h-7 rounded-full bg-ink/70 text-white hover:bg-danger disabled:opacity-50"
                  aria-label={tx('شيل الصورة', 'Remove photo')}
                >
                  {removing === url ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                </button>
              )}
            </div>
          ))}
          {canAdd && (
            <label
              className={`aspect-[4/3] grid place-items-center rounded-lg border border-dashed border-line-strong bg-surface text-brand ${busy ? 'opacity-60' : 'cursor-pointer hover:border-brand'}`}
            >
              <span className="flex flex-col items-center gap-1 text-sm font-semibold">
                {busy ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
                {busy ? tx('بنرفع…', 'Uploading…') : tx('ضيف صور', 'Add photos')}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={busy}
                className="sr-only"
                onChange={(e) => {
                  const picked = [...(e.target.files ?? [])];
                  e.target.value = '';
                  if (picked.length) add(picked);
                }}
              />
            </label>
          )}
        </div>
      )}
      {req.canEdit && <p className="mt-3 text-xs text-muted">{tx(`لحد ${MAX_PHOTOS} صورة — JPG أو PNG أو WEBP`, `Up to ${MAX_PHOTOS} photos — JPG, PNG or WEBP`)}</p>}
      {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
};
