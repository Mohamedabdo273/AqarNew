import React, { useEffect, useRef, useState } from 'react';
import { Home, Search, Tag, Repeat, Globe, Menu, X, Info, ShieldCheck, MessageCircle, Heart, ClipboardList, Phone, Bell, MoreHorizontal, UserRound, Scale, Sparkles, LogIn, LogOut, HandCoins } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { useRequests } from '../context/RequestsContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { whatsappLink } from '../config/brand';
import { useNotifications } from '../lib/useNotifications';
import { notificationTitle } from '../lib/offers';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const Badge: React.FC<{ n: number }> = ({ n }) =>
  n > 0 ? (
    <span className="num absolute -top-0.5 -end-0.5 grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold">
      {n > 9 ? '9+' : n}
    </span>
  ) : null;

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const { language, toggleLanguage, tx } = useLanguage();
  const { savedUnitIds } = useUnits();
  const { requests } = useRequests();
  const { compareIds } = useCompare();
  const { user, checking, openSignIn, logout } = useAuth();
  const server = useNotifications(!!user);
  const firstName = user?.fullName.trim().split(/\s+/)[0] ?? '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<null | 'bell' | 'more'>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  // أي قايمة منسدلة تتقفل لما تدوس بره أو تدوس Escape
  useEffect(() => {
    if (!openPanel) return;
    const onDown = (e: MouseEvent) => {
      if (panelsRef.current && !panelsRef.current.contains(e.target as Node)) setOpenPanel(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenPanel(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openPanel]);

  // الإشعارات من الطلبات الحقيقية — كل طلب وآخر مرحلة وصلها
  const STAGE_TEXT: Record<string, [string, string]> = {
    received: ['طلبك وصلنا', 'Request received'],
    reviewing: ['بنراجع عقدك ومدفوعاتك', 'Reviewing your contract'],
    listed: ['وحدتك اتنشرت في السوق', 'Your unit is live'],
    matched: ['فيه مشتري مهتم بوحدتك', 'A buyer is interested'],
    transferred: ['تم التنازل — مبروك', 'Transfer complete'],
  };
  const notifications = [...requests]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .map((r) => ({
      code: r.code,
      text: tx(STAGE_TEXT[r.stage]?.[0] ?? r.stage, STAGE_TEXT[r.stage]?.[1] ?? r.stage),
      at: new Date(r.updatedAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' }),
    }));

  const shortDate = (iso: string) => new Date(iso).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' });
  const bellCount = server.unread + notifications.length;

  type Link = { id: PageId; label: string; icon: React.ElementType };
  const buy: Link = { id: 'opportunities', label: tx('اشتري', 'Buy'), icon: Search };
  const sell: Link = { id: 'sell', label: tx('اعرض وحدتك', 'List your unit'), icon: Tag };
  const swap: Link = { id: 'swap', label: tx('بدّل وحدتك', 'Swap'), icon: Repeat };
  const rules: Link = { id: 'rules', label: tx('حقوقك والتزاماتك', 'Rights & duties'), icon: ShieldCheck };
  const contact: Link = { id: 'contact', label: tx('كلمنا', 'Contact'), icon: Phone };

  // Desktop order as asked: list · buy · swap · protection · contact. "about" lives in the footer.
  // `sell` keeps the filled-button look so the main action still stands out inside the row.
  const desktop: Link[] = [sell, buy, swap, rules, contact];
  const mobileTabs: (Link & { badge?: number })[] = [
    { id: 'home', label: tx('الرئيسية', 'Home'), icon: Home },
    { ...sell, label: tx('بيع', 'Sell') },
    { ...swap, label: tx('بدّل', 'Swap') },
    buy,
    { id: 'requests', label: tx('حسابي', 'Account'), icon: ClipboardList, badge: requests.length },
  ];
  const menuLinks: Link[] = [
    { id: 'home', label: tx('الرئيسية', 'Home'), icon: Home },
    sell,
    swap,
    buy,
    rules,
    contact,
    { id: 'market-comparisons', label: tx('مقارنات السوق', 'Market Comparisons'), icon: Sparkles },
    { id: 'saved', label: tx('المفضلة', 'Saved'), icon: Heart },
    { id: 'requests', label: tx('حسابي', 'My account'), icon: ClipboardList },
    { id: 'offers', label: tx('العروض والتفاوض', 'Offers'), icon: HandCoins },
    { id: 'about', label: tx('احنا مين', 'About us'), icon: Info },
  ];

  const go = (id: PageId) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  const iconBtn = (id: PageId) =>
    `relative grid place-items-center w-11 h-11 rounded-full transition-colors ${activePage === id ? 'bg-brand-soft text-brand' : 'text-ink-soft hover:bg-surface'}`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-line">
        <div className="page-wrap h-24 sm:h-28 flex items-center justify-between gap-3 sm:gap-5">
          <Logo onClick={() => go('home')} />

          <nav className="hidden xl:flex items-center gap-1">
            {desktop.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`px-4 py-2.5 rounded-full text-lg font-semibold whitespace-nowrap transition-colors hover:bg-brand-soft ${
                  activePage === l.id ? 'bg-brand-soft text-brand' : 'text-ink-soft hover:text-brand'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div ref={panelsRef} className="flex items-center gap-1">
            {/* Saved: hidden on mobile (<sm) because it is in the thumb bottom bar */}
            <button onClick={() => go('saved')} aria-label={tx('المفضلة', 'Saved')} className={`hidden sm:grid ${iconBtn('saved')}`}>
              <Heart className="w-5 h-5" />
              <Badge n={savedUnitIds.length} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setOpenPanel((v) => (v === 'bell' ? null : 'bell'))}
                aria-label={tx('الإشعارات', 'Notifications')}
                aria-expanded={openPanel === 'bell'}
                className={`relative grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-colors ${
                  openPanel === 'bell' ? 'bg-brand-soft text-brand' : 'text-ink-soft hover:bg-surface'
                }`}
              >
                <Bell className="w-5 h-5" />
                <Badge n={bellCount} />
              </button>
              {openPanel === 'bell' && (
                <div className="absolute top-full mt-2 end-0 w-80 max-w-[calc(100vw-2rem)] card p-2 shadow-lift z-50">
                  <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                    <p className="text-sm font-bold text-ink">{tx('الإشعارات', 'Notifications')}</p>
                    {server.unread > 0 && (
                      <button onClick={server.markAllRead} className="text-xs font-semibold text-brand hover:underline">
                        {tx('علّم الكل مقروء', 'Mark all read')}
                      </button>
                    )}
                  </div>
                  {server.items.length > 0 && (
                    <ul className="max-h-80 overflow-y-auto">
                      {server.items.map((n) => (
                        <li key={n.id}>
                          <button
                            onClick={() => {
                              setOpenPanel(null);
                              server.markRead(n.id);
                              window.location.hash = n.offerThreadId ? `offers/${n.offerThreadId}` : 'offers';
                            }}
                            className={`w-full flex gap-2 text-start rounded-xl px-2 py-2 hover:bg-paper ${n.isRead ? '' : 'bg-brand-soft/60'}`}
                          >
                            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-accent'}`} />
                            <span className="min-w-0">
                              <span className={`block text-sm text-ink ${n.isRead ? '' : 'font-semibold'}`}>{notificationTitle(n, tx)}</span>
                              {n.body && language === 'ar' && <span className="block text-xs text-ink-soft">{n.body}</span>}
                              <span className="block text-xs text-muted">{shortDate(n.createdAt)}</span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {notifications.length === 0 && server.items.length === 0 ? (
                    <p className="px-2 pb-2 text-sm text-muted">{tx('مفيش إشعارات لسه', 'Nothing yet')}</p>
                  ) : (
                    <ul className="max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <li key={n.code}>
                          <button
                            onClick={() => {
                              setOpenPanel(null);
                              go('requests');
                            }}
                            className="w-full text-start rounded-xl px-2 py-2 hover:bg-paper"
                          >
                            <span className="block text-sm text-ink">{n.text}</span>
                            <span className="block text-xs text-muted">
                              <span className="num">{n.code}</span> · {n.at}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* More dropdown: only on desktop (xl:), mobile uses the Menu sheet */}
            <div className="hidden xl:block relative">
              <button
                onClick={() => setOpenPanel((v) => (v === 'more' ? null : 'more'))}
                aria-label={tx('المزيد', 'More')}
                aria-expanded={openPanel === 'more'}
                className={`relative grid place-items-center w-11 h-11 rounded-full transition-colors ${
                  openPanel === 'more' ? 'bg-brand-soft text-brand' : 'text-ink-soft hover:bg-surface'
                }`}
              >
                <MoreHorizontal className="w-5 h-5" />
                <Badge n={requests.length} />
              </button>
              {openPanel === 'more' && (
                <div className="absolute top-full mt-2 end-0 w-56 card p-2 shadow-lift z-50">
                  {[
                    { id: 'requests' as PageId, label: tx('حسابي', 'My account'), icon: ClipboardList, n: requests.length },
                    { id: 'offers' as PageId, label: tx('العروض والتفاوض', 'Offers'), icon: HandCoins, n: 0 },
                    { id: 'market-comparisons' as PageId, label: tx('مقارنات السوق', 'Market Comparisons'), icon: Sparkles, n: 0 },
                    { id: 'about' as PageId, label: tx('احنا مين', 'About us'), icon: Info, n: 0 },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setOpenPanel(null);
                        go(m.id);
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-start hover:bg-paper"
                    >
                      <m.icon className="w-5 h-5 text-brand shrink-0" />
                      <span className="flex-1 text-sm font-medium text-ink">{m.label}</span>
                      {m.n > 0 && <span className="num text-xs text-muted">{m.n}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account: sign in as a guest, or jump to "حسابي" once signed in */}
            {!checking &&
              (user ? (
                <button onClick={() => go('requests')} aria-label={tx('حسابي', 'My account')} title={user.fullName} className={iconBtn('requests')}>
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-brand text-white text-sm font-bold">{firstName.charAt(0) || <UserRound className="w-4 h-4" />}</span>
                </button>
              ) : (
                <button onClick={openSignIn} className="flex items-center gap-1.5 h-10 sm:h-11 px-3 rounded-full text-sm font-semibold text-brand hover:bg-brand-soft">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{tx('دخول', 'Sign in')}</span>
                </button>
              ))}


            {/* Language toggle: hidden on mobile (<sm), accessible in mobile drawer */}
            <button onClick={toggleLanguage} className="hidden sm:flex h-11 px-3 rounded-full text-sm font-medium text-ink-soft hover:bg-surface items-center gap-1.5">
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label={tx('القائمة', 'Menu')}
              className="xl:hidden grid place-items-center w-10 h-10 rounded-xl hover:bg-surface border border-line/60 text-ink transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 inset-x-0 max-h-[90vh] overflow-y-auto bg-surface rounded-b-card p-5 shadow-lift">
            <div className="flex items-center justify-between">
              <Logo onClick={() => go('home')} />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft bg-paper hover:bg-surface border border-line px-2.5 py-1.5 rounded-xl shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5 text-brand" />
                  <span>{language === 'ar' ? 'English' : 'عربي'}</span>
                </button>
                <button onClick={() => setMenuOpen(false)} aria-label={tx('إغلاق', 'Close')} className="grid place-items-center w-10 h-10 rounded-full bg-paper hover:bg-line">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-paper p-3 flex items-center justify-between gap-3">
              {user ? (
                <>
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="grid place-items-center w-9 h-9 rounded-full bg-brand text-white text-sm font-bold shrink-0">{firstName.charAt(0)}</span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink truncate">{user.fullName}</span>
                      <span className="block num text-xs text-muted" dir="ltr">{user.phone}</span>
                    </span>
                  </span>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-danger min-h-10 px-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {tx('خروج', 'Sign out')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openSignIn();
                  }}
                  className="w-full flex items-center justify-center gap-2 min-h-11 font-semibold text-brand"
                >
                  <LogIn className="w-5 h-5" />
                  {tx('سجّل دخول برقم موبايلك', 'Sign in with your mobile')}
                </button>
              )}
            </div>
            <nav className="mt-3 grid gap-1">
              {menuLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-start text-base font-medium ${
                    activePage === l.id ? 'bg-brand-soft text-brand-ink' : 'text-ink hover:bg-paper'
                  }`}
                >
                  <l.icon className="w-5 h-5 text-brand" />
                  {l.label}
                </button>
              ))}
            </nav>
            <a href={whatsappLink(tx('مرحباً، عندي سؤال', 'Hi, I have a question'))} target="_blank" rel="noreferrer" className="btn-primary w-full mt-4">
              <MessageCircle className="w-5 h-5" />
              {tx('كلمنا واتساب', 'WhatsApp us')}
            </a>
          </div>
        </div>
      )}

      {/* Mobile bottom tab bar — thumb-reachable, app-like */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {mobileTabs.map((l) => {
            const active = activePage === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active ? 'text-brand' : 'text-muted'}`}
              >
                <span className="relative">
                  <l.icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.8} />
                  {l.badge ? <span className="absolute -top-1 -end-1.5 w-2 h-2 rounded-full bg-danger" /> : null}
                </span>
                {l.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
