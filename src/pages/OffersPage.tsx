import React, { useCallback, useEffect, useState } from 'react';
import { HandCoins, Inbox, Loader2, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { errorText, fetchMyOffers, fetchReceivedOffers, mediaUrl, OfferThread, OFFER_STATUS } from '../services/api';
import { fullMoney } from '../lib/unitHelpers';
import { isOpenOffer, myTurn, offerStatusLabel, timeLeft } from '../lib/offers';
import { OfferThreadView } from '../components/offers/OfferThreadView';
import { PageId } from '../types';

type Tab = 'mine' | 'received';

const TONE: Record<string, string> = {
  turn: 'bg-accent-soft text-accent-ink',
  wait: 'bg-brand-soft text-brand',
  good: 'bg-emerald-100 text-emerald-800',
  off: 'bg-line text-muted',
};

/** Your turn first, then open threads, then the rest — newest first inside each group. */
const byUrgency = (a: OfferThread, b: OfferThread) =>
  Number(myTurn(b)) - Number(myTurn(a)) ||
  Number(isOpenOffer(b)) - Number(isOpenOffer(a)) ||
  (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt);

/**
 * "عروضي" (offers I made as a buyer) and "العروض على وحدتك" (offers on units I sell).
 * Routes: #offers · #offers/received · #offers/<threadId>
 */
export const OffersPage: React.FC<{ target: string | null; onNavigate: (page: PageId) => void }> = ({ target, onNavigate }) => {
  const { language, tx } = useLanguage();
  const [mine, setMine] = useState<OfferThread[] | null>(null);
  const [received, setReceived] = useState<OfferThread[] | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>(target === 'received' ? 'received' : 'mine');
  const [openId, setOpenId] = useState<number | null>(target && /^\d+$/.test(target) ? Number(target) : null);

  const load = useCallback(async () => {
    const [m, r] = await Promise.allSettled([fetchMyOffers(), fetchReceivedOffers()]);
    if (m.status === 'fulfilled') setMine(m.value);
    if (r.status === 'fulfilled') setReceived(r.value);
    setError(m.status === 'rejected' && r.status === 'rejected' ? errorText(m.reason) : '');
    return { m: m.status === 'fulfilled' ? m.value : [], r: r.status === 'fulfilled' ? r.value : [] };
  }, []);

  // Pick the tab the link points to: a thread id opens whichever side it's on.
  useEffect(() => {
    load().then(({ m, r }) => {
      if (target === 'received') return setTab('received');
      const id = target && /^\d+$/.test(target) ? Number(target) : null;
      if (id !== null) {
        setOpenId(id);
        setTab(r.some((t) => t.id === id) ? 'received' : 'mine');
      } else if (m.length === 0 && r.length > 0) setTab('received');
    });
  }, [target, load]);

  const update = (t: OfferThread) => {
    const replace = (list: OfferThread[] | null) => list?.map((x) => (x.id === t.id ? t : x)) ?? null;
    setMine(replace);
    setReceived(replace);
    // Agreeing closes the unit's other threads — fetch them fresh.
    if (t.status === OFFER_STATUS.agreed) load();
  };

  const list = (tab === 'mine' ? mine : received) ?? [];
  const loading = mine === null && received === null && !error;
  const turnCount = (l: OfferThread[] | null) => (l ?? []).filter(myTurn).length;

  return (
    <div className="page-wrap py-8 sm:py-12 max-w-3xl">
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink flex items-center gap-2">
        <HandCoins className="w-7 h-7 text-brand" />
        {tx('العروض والتفاوض', 'Offers')}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {tx('كل عرض محادثة بأرقام بس: عرض، رد، موافقة. الطرفين مش شايفين بيانات بعض — فريقنا بيكلّمكم لما تتفقوا.', "Each offer is a numbers-only conversation. Neither side sees the other's details — we call you both once you agree.")}
      </p>

      <div role="tablist" className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-line/60 p-1">
        {(
          [
            ['mine', tx('عروضي', 'My offers'), turnCount(mine)],
            ['received', tx('العروض على وحدتك', 'Offers on my units'), turnCount(received)],
          ] as [Tab, string, number][]
        ).map(([id, label, n]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`min-h-11 rounded-lg text-sm font-semibold transition-colors ${tab === id ? 'bg-surface text-ink shadow-xs' : 'text-muted hover:text-ink'}`}
          >
            {label}
            {n > 0 && <span className="num ms-1.5 rounded-full bg-accent px-1.5 text-[11px] text-white">{n}</span>}
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-16 grid place-items-center text-muted" aria-busy="true">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      )}
      {error && <p role="alert" className="mt-6 text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">{error}</p>}

      {!loading && !error && list.length === 0 && (
        <div className="mt-8 card p-8 text-center grid gap-3 justify-items-center">
          <Inbox className="w-10 h-10 text-muted" />
          {tab === 'mine' ? (
            <>
              <p className="text-ink font-semibold">{tx('لسه ما عملتش أي عرض', "You haven't made an offer yet")}</p>
              <p className="text-sm text-muted">{tx('على أي وحدة مكتوب عليها "قابل للتفاوض" هتلاقي زرار "اعرض سعرك".', 'Units marked "negotiable" have a "Make an offer" button.')}</p>
              <button onClick={() => onNavigate('opportunities')} className="btn-primary min-h-11 px-5">
                {tx('شوف الوحدات', 'Browse units')}
              </button>
            </>
          ) : (
            <>
              <p className="text-ink font-semibold">{tx('مفيش عروض على وحداتك', 'No offers on your units')}</p>
              <p className="text-sm text-muted">{tx('لو وحدتك قابلة للتفاوض، العروض هتوصلك هنا وفي الجرس فوق.', 'If your unit is negotiable, offers arrive here and in the bell.')}</p>
            </>
          )}
        </div>
      )}

      <ul className="mt-6 grid gap-3">
        {[...list].sort(byUrgency).map((t) => {
          const status = offerStatusLabel(t, tx);
          const left = isOpenOffer(t) ? timeLeft(t.deadlineAt, tx) : null;
          const latest = t.agreedPrice ?? (t.status === OFFER_STATUS.awaitingBuyer && t.lastSellerCounter ? t.lastSellerCounter : t.lastBuyerOffer);
          const open = openId === t.id;
          return (
            <li key={t.id} id={`offer-${t.id}`} className={`card overflow-hidden ${myTurn(t) ? 'ring-2 ring-accent/40' : ''}`}>
              <button onClick={() => setOpenId(open ? null : t.id)} aria-expanded={open} className="w-full flex items-center gap-3 p-3 text-start hover:bg-paper">
                {t.unitImage ? (
                  <img src={mediaUrl(t.unitImage)} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                ) : (
                  <span className="w-16 h-16 rounded-xl bg-brand-soft shrink-0" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink truncate">{t.unitTitle}</span>
                  <span className="block text-xs text-muted">
                    <span className="num">{t.unitCode}</span>
                    {tab === 'received' && <> · {tx(t.buyerLabel, t.buyerLabel.replace('مشتري', 'Buyer'))}</>}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${TONE[status.tone]}`}>{status.text}</span>
                    {left && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                        <Clock className="w-3 h-3" />
                        {left}
                      </span>
                    )}
                  </span>
                </span>
                <span className="num font-display font-bold text-ink text-end shrink-0">{fullMoney(latest, language)}</span>
              </button>
              {open && (
                <div className="border-t border-line p-3 sm:p-4 grid gap-3">
                  <OfferThreadView thread={t} onChange={update} />
                  <a href={`#unit/${t.unitId}`} className="text-center text-sm font-semibold text-brand underline min-h-10">
                    {tx('افتح الوحدة', 'Open the unit')}
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
