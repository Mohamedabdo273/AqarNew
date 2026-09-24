import React, { useState } from 'react';
import { Home, Search, Tag, Repeat, Globe, Menu, X, Info, ScrollText, MessageCircle, Heart, ClipboardList, FileText, Lock } from 'lucide-react';
import { PageId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitsContext';
import { useRequests } from '../context/RequestsContext';
import { Logo } from './Logo';
import { whatsappLink } from '../config/brand';

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
  const [menuOpen, setMenuOpen] = useState(false);

  const main: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'opportunities', label: tx('اشتري', 'Buy'), icon: Search },
    { id: 'sell', label: tx('بيع وحدتك', 'Sell'), icon: Tag },
    { id: 'swap', label: tx('بدّل وحدتك', 'Swap'), icon: Repeat },
  ];
  const info: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'about', label: tx('احنا مين', 'About us'), icon: Info },
    { id: 'rules', label: tx('القواعد', 'Rules'), icon: ScrollText },
  ];
  const mobileTabs: { id: PageId; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: tx('الرئيسية', 'Home'), icon: Home },
    ...main,
    { id: 'requests', label: tx('طلباتي', 'Requests'), icon: ClipboardList, badge: requests.length },
  ];
  const menuLinks: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: tx('الرئيسية', 'Home'), icon: Home },
    ...main,
    { id: 'saved', label: tx('المفضلة', 'Saved'), icon: Heart },
    { id: 'requests', label: tx('طلباتي', 'My requests'), icon: ClipboardList },
    ...info,
    { id: 'terms', label: tx('الشروط والأحكام', 'Terms & conditions'), icon: FileText },
    { id: 'privacy', label: tx('سياسة الخصوصية', 'Privacy policy'), icon: Lock },
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
        <div className="page-wrap h-16 flex items-center justify-between gap-4">
          <Logo onClick={() => go('home')} />

          <nav className="hidden lg:flex items-center gap-0.5">
            {[...main, ...info].map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`px-3.5 py-2 rounded-full text-[15px] font-medium whitespace-nowrap transition-colors ${
                  activePage === l.id ? 'bg-brand-soft text-brand-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => go('saved')} aria-label={tx('المفضلة', 'Saved')} className={iconBtn('saved')}>
              <Heart className="w-5 h-5" />
              <Badge n={savedUnitIds.length} />
            </button>
            <button onClick={() => go('requests')} aria-label={tx('طلباتي', 'My requests')} className={`${iconBtn('requests')} hidden md:grid`}>
              <ClipboardList className="w-5 h-5" />
              <Badge n={requests.length} />
            </button>
            <button onClick={toggleLanguage} className="h-11 px-3 rounded-full text-sm font-medium text-ink-soft hover:bg-surface flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button onClick={() => go('sell')} className="btn-primary hidden xl:inline-flex min-h-10 px-5 text-sm ms-1">
              {tx('اعرض وحدتك مجاناً', 'List your unit free')}
            </button>
            <button onClick={() => setMenuOpen(true)} aria-label={tx('القائمة', 'Menu')} className="lg:hidden grid place-items-center w-11 h-11 rounded-full hover:bg-surface">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 inset-x-0 max-h-[90vh] overflow-y-auto bg-surface rounded-b-[28px] p-5 shadow-lift">
            <div className="flex items-center justify-between">
              <Logo onClick={() => go('home')} />
              <button onClick={() => setMenuOpen(false)} aria-label={tx('إغلاق', 'Close')} className="grid place-items-center w-11 h-11 rounded-full bg-paper">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="mt-5 grid gap-1">
              {menuLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-start text-base font-medium ${
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
