import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UnitDetailModal } from './components/UnitDetailModal';
import { DEFAULT_BUDGET, Budget } from './components/BudgetFinder';
import { HomePage } from './pages/HomePage';
import { SellUnitPage } from './pages/SellUnitPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { PropertySwapPage } from './pages/PropertySwapPage';
import { AdminPlatform } from './components/admin/AdminPlatform';
import { AboutPage } from './pages/AboutPage';
import { RulesPage, RulesTab } from './pages/RulesPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { SavedPage } from './pages/SavedPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { whatsappLink } from './config/brand';
import { PageId, RealEstateUnit } from './types';
import { useUnits } from './context/UnitsContext';
import { useLanguage } from './context/LanguageContext';

const PAGES: PageId[] = ['home', 'opportunities', 'sell', 'swap', 'about', 'rules', 'saved', 'requests', 'privacy', 'terms', 'admin'];

/*
 * Hash routes:
 *   #opportunities, #sell, …       a page
 *   #requests/WHD-12345            one seller request
 *   #unit/<id>                     a unit opened over the current page (shareable link)
 */
export default function App() {
  const { units } = useUnits();
  const { language, tx } = useLanguage();
  const [activePage, setActivePage] = useState<PageId>('home');
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<string | null>(null);
  // Budget is shared between the home finder and the browse page filters.
  const [budget, setBudget] = useState<Budget>(DEFAULT_BUDGET);
  const [budgetOn, setBudgetOn] = useState(false);
  const [rulesTab, setRulesTab] = useState<RulesTab>('seller');

  // True when the unit was opened by a click here (so closing can just go "back").
  const unitOpenedInApp = useRef(false);
  const firstLoad = useRef(true);

  useEffect(() => {
    const handleHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace('#', ''));
      const isFirst = firstLoad.current;
      firstLoad.current = false;

      if (hash.startsWith('unit/')) {
        setUnitId(hash.slice('unit/'.length));
        // Opened from a shared link: show the listings behind it.
        if (isFirst) setActivePage('opportunities');
        return;
      }
      setUnitId(null);
      unitOpenedInApp.current = false;

      if (hash.startsWith('requests/')) {
        setActivePage('requests');
        setRequestCode(hash.slice('requests/'.length));
        return;
      }
      setRequestCode(null);
      if (hash === 'listings') setActivePage('opportunities');
      else setActivePage(PAGES.includes(hash as PageId) ? (hash as PageId) : 'home');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const selectedUnit = unitId ? units.find((u) => u.id === unitId) ?? null : null;

  // A shared link to a unit that no longer exists falls back to the listings.
  useEffect(() => {
    if (unitId && !selectedUnit) {
      window.history.replaceState(null, '', '#opportunities');
      setUnitId(null);
      setActivePage('opportunities');
    }
  }, [unitId, selectedUnit]);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openUnit = (unit: RealEstateUnit) => {
    unitOpenedInApp.current = true;
    window.location.hash = `unit/${unit.id}`;
  };

  const closeUnit = () => {
    if (unitOpenedInApp.current) {
      window.history.back();
    } else {
      const pageHash = activePage === 'home' ? '' : activePage === 'requests' && requestCode ? `requests/${requestCode}` : activePage;
      window.history.replaceState(null, '', `#${pageHash}`);
      setUnitId(null);
    }
  };

  const openRequest = (code: string | null) => {
    window.location.hash = code ? `requests/${code}` : 'requests';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRules = (tab: RulesTab) => {
    setRulesTab(tab);
    handleNavigate('rules');
  };

  if (activePage === 'admin') {
    return <AdminPlatform onBackToApp={() => handleNavigate('home')} language={language} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-brand selection:text-white overflow-x-clip">
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            units={units}
            budget={budget}
            onBudgetChange={setBudget}
            onBrowseWithBudget={() => {
              setBudgetOn(true);
              handleNavigate('opportunities');
            }}
            onNavigate={handleNavigate}
            onSelectUnit={openUnit}
            onOpenRules={openRules}
          />
        )}
        {activePage === 'opportunities' && (
          <OpportunitiesPage
            units={units}
            budget={budget}
            onBudgetChange={setBudget}
            budgetOn={budgetOn}
            onBudgetOnChange={setBudgetOn}
            onSelectUnit={openUnit}
          />
        )}
        {activePage === 'sell' && <SellUnitPage onSubmitted={openRequest} onOpenRules={() => openRules('seller')} onNavigate={handleNavigate} />}
        {activePage === 'swap' && <PropertySwapPage units={units} onSelectUnit={openUnit} />}
        {activePage === 'saved' && <SavedPage onSelectUnit={openUnit} onNavigate={handleNavigate} />}
        {activePage === 'requests' && <MyRequestsPage code={requestCode} onOpenRequest={openRequest} onNavigate={handleNavigate} />}
        {activePage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {activePage === 'rules' && <RulesPage tab={rulesTab} onTabChange={setRulesTab} onNavigate={handleNavigate} />}
        {activePage === 'privacy' && <PrivacyPage />}
        {activePage === 'terms' && <TermsPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />

      <UnitDetailModal unit={selectedUnit} onClose={closeUnit} onOpenBuyerRules={() => openRules('buyer')} onNavigate={handleNavigate} />

      <a
        href={whatsappLink(tx('مرحباً، عندي سؤال', 'Hi, I have a question'))}
        target="_blank"
        rel="noreferrer"
        aria-label={tx('واتساب', 'WhatsApp')}
        className="fixed bottom-20 md:bottom-6 end-4 md:end-6 z-30 grid place-items-center w-14 h-14 rounded-full bg-[#25d366] text-white shadow-lift hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
