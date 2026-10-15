import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ArrowUp, Headset, Loader2, RefreshCw } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DEFAULT_BUDGET, Budget, CASH_RANGE, MONTHLY_RANGE } from './components/BudgetFinder';
import { HomePage, HomeSearch } from './pages/HomePage';
import { SellUnitPage } from './pages/SellUnitPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { PropertySwapPage } from './pages/PropertySwapPage';
import { AboutPage } from './pages/AboutPage';
import { RulesPage, RulesTab } from './pages/RulesPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { SavedPage } from './pages/SavedPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { UnitPage, similarUnits } from './pages/UnitPage';
import { ThanksPage, ThanksKind } from './pages/ThanksPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPlatform } from './components/admin/AdminPlatform';
import { AdminLogin } from './components/admin/AdminLogin';
import { StatementPage } from './pages/StatementPage';
import { ComparePage } from './pages/ComparePage';
import { MarketComparisonsPage } from './pages/MarketComparisonsPage';
import { VerifyPage } from './pages/VerifyPage';
import { MobileDesignPage } from './pages/MobileDesignPage';
import { useCompare } from './context/CompareContext';
import { Scale } from 'lucide-react';
import { BRAND, whatsappLink } from './config/brand';
import { hasAdminSession } from './services/adminAuth';
import { useScrollReveal } from './lib/useScrollReveal';
import { PageId, RealEstateUnit } from './types';
import { useUnits } from './context/UnitsContext';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { SignInSheet } from './components/SignInSheet';
import { fetchUnit } from './services/api';

/** Pages reachable by a bare hash (#sell, #contact, …). */
const PAGES: PageId[] = ['home', 'opportunities', 'sell', 'statement', 'compare', 'market-comparisons', 'verify', 'swap', 'contact', 'about', 'rules', 'saved', 'requests', 'privacy', 'terms', 'admin', 'mobile-design'];
const THANKS: ThanksKind[] = ['sell', 'statement', 'viewing', 'swap', 'contact', 'alert'];

/*
 * Hash routes:
 *   (empty)                        home
 *   #opportunities, #sell, …       a page
 *   #unit/<id>                     one unit, as a full page (shareable link)
 *   #requests/WHD-12345            one seller request
 *   #thanks/sell/WHD-12345         confirmation after listing a unit
 *   #thanks/viewing/<unitId>       confirmation after booking a viewing
 *   #thanks/swap/<unitId>          confirmation after a swap request
 *   #thanks/contact                confirmation after the contact form
 *   anything else                  404
 */
export default function App() {
  const { units, unitsStatus, reloadUnits } = useUnits();
  const { signInOpen } = useAuth();
  const { language, tx } = useLanguage();
  const [activePage, setActivePage] = useState<PageId>('home');
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<string | null>(null);
  const [thanks, setThanks] = useState<{ kind: ThanksKind; ref: string | null }>({ kind: 'contact', ref: null });
  // Sections and cards fade up as they scroll in; re-armed on every page change.
  useScrollReveal(`${activePage}:${unitId ?? ''}`);
  // The floating WhatsApp button steps aside while you scroll down (it sits over content on phones) and comes back on scroll up.
  const [fabVisible, setFabVisible] = useState(true);
  // "Back to top" shows once you're well down a long page and scrolling back up — when you'd actually want it.
  const [topVisible, setTopVisible] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      const goingUp = y < lastY;
      setFabVisible(goingUp || y < 200);
      setTopVisible(goingUp && y > window.innerHeight * 1.5);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Budget is shared between the home finder and the browse page filters.
  const [budget, setBudget] = useState<Budget>(DEFAULT_BUDGET);
  const [budgetOn, setBudgetOn] = useState(false);
  // Opens the listings with "deals only" on; any other navigation turns it back off.
  const [dealsOn, setDealsOn] = useState(false);
  // Filters the listings open with after a search from the home page; cleared on any other navigation.
  const [listPreset, setListPreset] = useState<HomeSearch | null>(null);
  const [rulesTab, setRulesTab] = useState<RulesTab>('seller');
  const [verifyCode, setVerifyCode] = useState<string | null>(null);
  const [adminIn, setAdminIn] = useState(hasAdminSession);
  const { compareIds } = useCompare();

  // True once the visitor has moved around inside the app, so "back" can use browser history.
  const navigatedInApp = useRef(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace('#', ''));
      const [head, ...rest] = hash.split('/');
      const tail = rest.join('/');
      window.scrollTo({ top: 0 });

      setUnitId(head === 'unit' ? tail : null);
      setRequestCode(head === 'requests' && tail ? tail : null);

      if (head === 'unit' && tail) return setActivePage('unit');
      if (head === 'verify') {
        setVerifyCode(tail || null);
        return setActivePage('verify');
      }
      if (head === 'thanks' && THANKS.includes(rest[0] as ThanksKind)) {
        setThanks({ kind: rest[0] as ThanksKind, ref: rest[1] ?? null });
        return setActivePage('thanks');
      }
      if (head === 'requests') return setActivePage('requests');
      if (hash === 'figma' || hash === 'mobile-design' || hash === 'mobile') return setActivePage('mobile-design');
      if (hash === '') return setActivePage('home');
      if (hash === 'listings') return setActivePage('opportunities');
      setActivePage(PAGES.includes(hash as PageId) ? (hash as PageId) : 'notfound');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const go = (hash: string) => {
    navigatedInApp.current = true;
    window.location.hash = hash;
  };

  const handleNavigate = (page: PageId) => {
    setDealsOn(false);
    setListPreset(null);
    go(page === 'home' ? '' : page);
  };
  const searchFromHome = (s: HomeSearch) => {
    handleNavigate('opportunities');
    setListPreset(s);
    if (s.monthly) {
      setBudget({ cash: CASH_RANGE.max, monthly: Math.min(Math.max(s.monthly, MONTHLY_RANGE.min), MONTHLY_RANGE.max) });
      setBudgetOn(true);
    }
  };
  const openDeals = () => {
    handleNavigate('opportunities');
    setDealsOn(true);
  };
  const openUnit = (unit: RealEstateUnit) => go(`unit/${unit.id}`);
  const openRequest = (code: string | null) => go(code ? `requests/${code}` : 'requests');
  const openRules = (tab: RulesTab) => {
    setRulesTab(tab);
    handleNavigate('rules');
  };
  // From a unit page: go back where the visitor came from, or to the listings if they landed here from a shared link.
  const backFromUnit = () => (navigatedInApp.current ? window.history.back() : handleNavigate('opportunities'));

  // A unit that isn't in the published list (reserved, or a code instead of an id) is fetched on its own.
  const [directUnit, setDirectUnit] = useState<{ key: string; unit: RealEstateUnit | null } | null>(null);
  const listedUnit = unitId ? units.find((u) => u.id === unitId || u.verificationCode === unitId) ?? null : null;
  useEffect(() => {
    if (!unitId || listedUnit || unitsStatus !== 'ready' || directUnit?.key === unitId) return;
    let live = true;
    fetchUnit(unitId)
      .then((u) => live && setDirectUnit({ key: unitId, unit: u }))
      .catch(() => live && setDirectUnit({ key: unitId, unit: null }));
    return () => {
      live = false;
    };
  }, [unitId, listedUnit, unitsStatus, directUnit?.key]);
  const selectedUnit = listedUnit ?? (directUnit?.key === unitId ? directUnit.unit : null);
  const unitLoading = !!unitId && !listedUnit && (unitsStatus === 'loading' || (unitsStatus === 'ready' && directUnit?.key !== unitId));
  const thanksUnit = (thanks.kind === 'viewing' || thanks.kind === 'swap') && thanks.ref ? units.find((u) => u.id === thanks.ref) ?? null : null;

  if (activePage === 'admin') {
    return adminIn ? (
      <AdminPlatform onBackToApp={() => handleNavigate('home')} language={language} />
    ) : (
      <AdminLogin onSignedIn={() => setAdminIn(true)} onBackToSite={() => handleNavigate('home')} />
    );
  }

  if (activePage === 'mobile-design') {
    return <MobileDesignPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink selection:bg-brand selection:text-white overflow-x-clip">
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {unitsStatus === 'error' && (
          <div role="alert" className="page-wrap pt-6">
            <div className="rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm text-ink">
              <span>{tx('مش قادرين نوصل للسيرفر دلوقتي، فالوحدات مش ظاهرة.', "We can't reach the server right now, so units aren't showing.")}</span>
              <button onClick={reloadUnits} className="btn-ghost min-h-10 px-4 text-sm">
                <RefreshCw className="w-4 h-4" />
                {tx('جرّب تاني', 'Try again')}
              </button>
            </div>
          </div>
        )}
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
            onOpenDeals={openDeals}
            onSearch={searchFromHome}
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
            dealsOnly={dealsOn}
            preset={listPreset}
            onAlertRequested={() => go('thanks/alert')}
          />
        )}
        {activePage === 'unit' &&
          (unitLoading ? (
            <div className="page-wrap py-24 grid place-items-center text-muted" aria-busy="true">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : selectedUnit ? (
            <UnitPage
              unit={selectedUnit}
              units={units}
              onBack={backFromUnit}
              onSelectUnit={openUnit}
              onOpenBuyerRules={() => openRules('buyer')}
              onNavigate={handleNavigate}
              onBooked={(u) => go(`thanks/viewing/${u.id}`)}
            />
          ) : (
            <NotFoundPage variant="unit" suggestions={units.slice(0, 3)} onNavigate={handleNavigate} onSelectUnit={openUnit} />
          ))}
        {activePage === 'sell' && (
          <SellUnitPage onSubmitted={(code) => go(`thanks/sell/${code}`)} onOpenRules={() => openRules('seller')} onNavigate={handleNavigate} />
        )}
        {activePage === 'thanks' && (
          <ThanksPage
            kind={thanks.kind}
            code={thanks.kind === 'sell' ? thanks.ref : null}
            unit={thanksUnit}
            suggestions={thanksUnit ? similarUnits(thanksUnit, units) : []}
            onNavigate={handleNavigate}
            onOpenRequest={openRequest}
            onSelectUnit={openUnit}
          />
        )}
        {activePage === 'swap' && <PropertySwapPage units={units} onSelectUnit={openUnit} onRequested={(u) => go(`thanks/swap/${u.id}`)} />}
        {activePage === 'saved' && <SavedPage onSelectUnit={openUnit} onNavigate={handleNavigate} />}
        {activePage === 'requests' && <MyRequestsPage code={requestCode} onOpenRequest={openRequest} onNavigate={handleNavigate} />}
        {activePage === 'compare' && <ComparePage units={units} onSelectUnit={openUnit} onNavigate={handleNavigate} />}
        {activePage === 'market-comparisons' && <MarketComparisonsPage units={units} onSelectUnit={openUnit} onNavigate={handleNavigate} />}
        {activePage === 'verify' && <VerifyPage initialCode={verifyCode} onSelectUnit={openUnit} />}
        {activePage === 'statement' && <StatementPage onNavigate={handleNavigate} onSent={() => go('thanks/statement')} />}
        {activePage === 'contact' && <ContactPage onNavigate={handleNavigate} onSent={() => go('thanks/contact')} />}
        {activePage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {activePage === 'rules' && <RulesPage tab={rulesTab} onTabChange={setRulesTab} onNavigate={handleNavigate} />}
        {activePage === 'privacy' && <PrivacyPage />}
        {activePage === 'terms' && <TermsPage onNavigate={handleNavigate} />}
        {activePage === 'notfound' && <NotFoundPage variant="page" suggestions={units.slice(0, 3)} onNavigate={handleNavigate} onSelectUnit={openUnit} />}
      </main>

      <Footer onNavigate={handleNavigate} />

      {signInOpen && <SignInSheet />}

      {/* Compare tray: shows once a unit is added, until you're on the compare page. */}
      {compareIds.length > 0 && activePage !== 'compare' && (
        <button
          onClick={() => handleNavigate('compare')}
          className="fixed bottom-20 md:bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-30 btn-primary min-h-12 px-5 shadow-lift"
        >
          <Scale className="w-5 h-5" />
          {tx(`قارن (${compareIds.length})`, `Compare (${compareIds.length})`)}
        </button>
      )}

      <a
        href={whatsappLink(tx('مرحباً، عندي سؤال', 'Hi, I have a question'))}
        target="_blank"
        rel="noreferrer"
        aria-label={tx('واتساب', 'WhatsApp')}
        className={`fixed bottom-20 md:bottom-6 end-4 md:end-6 z-30 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand text-white ring-2 ring-white shadow-lift hover:scale-105 transition-all duration-300 ${
          fabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Hotline, mirroring WhatsApp on the other side: the two ways to reach a human. */}
      <a
        href={`tel:${BRAND.hotline}`}
        aria-label={tx(`الخط الساخن ${BRAND.hotline}`, `Hotline ${BRAND.hotline}`)}
        className={`fixed bottom-20 md:bottom-6 start-4 md:start-6 z-30 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand text-white ring-2 ring-white shadow-lift hover:scale-105 transition-all duration-300 ${
          fabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Headset className="w-6 h-6" />
      </a>

      {/* Back to top sits above the hotline so the two never overlap. */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={tx('ارجع لفوق', 'Back to top')}
        tabIndex={topVisible ? 0 : -1}
        className={`fixed bottom-36 md:bottom-24 start-4 md:start-6 z-30 grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-surface text-brand border border-line shadow-lift hover:bg-brand-soft transition-all duration-300 ${
          topVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
