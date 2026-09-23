import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { LegalGuarantees } from './components/LegalGuarantees';
import { TestimonialsAndFaq } from './components/TestimonialsAndFaq';
import { Footer } from './components/Footer';
import { UnitDetailModal } from './components/UnitDetailModal';
import { AddUnitModal } from './components/AddUnitModal';
import { StoryPage } from './pages/StoryPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactPage } from './pages/ContactPage';
import { InvestorsPage } from './pages/InvestorsPage';
import { SellUnitPage } from './pages/SellUnitPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { PropertySwapPage } from './pages/PropertySwapPage';
import { InstitutionalAdvantage } from './components/InstitutionalAdvantage';
import { AdminPlatform } from './components/admin/AdminPlatform';
import { InvestorClubModal } from './components/InvestorClubModal';
import { BRAND_SUGGESTIONS } from './data/mockData';
import { BrandSuggestion, PageId, RealEstateUnit } from './types';
import { useUnits } from './context/UnitsContext';
import { useLanguage } from './context/LanguageContext';
import { MessageSquare, PlusCircle } from 'lucide-react';

export default function App() {
  const { units } = useUnits();
  const { t, language, isRTL } = useLanguage();
  const [currentBrand, setCurrentBrand] = useState<BrandSuggestion>(BRAND_SUGGESTIONS[0]);
  const [selectedUnit, setSelectedUnit] = useState<RealEstateUnit | null>(null);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState<boolean>(false);
  const [isInvestorClubOpen, setIsInvestorClubOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<PageId>('home');
  
  // Calculator prefill state for AddUnitModal
  const [prefillCalculator, setPrefillCalculator] = useState<{
    contractPrice: number;
    paidAmount: number;
    developer: string;
  }>({
    contractPrice: 5000000,
    paidAmount: 2000000,
    developer: 'بالم هيلز'
  });

  // Filters shared from Hero to Listings
  const [heroSearchFilters, setHeroSearchFilters] = useState<{
    searchQuery: string;
    region: string;
    propertyType: string;
  }>({
    searchQuery: '',
    region: '',
    propertyType: ''
  });

  // Handle URL Hash navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['story', 'how-it-works', 'contact', 'investors', 'sell', 'opportunities', 'admin', 'swap'].includes(hash)) {
        setActivePage(hash as PageId);
      } else if (hash === 'listings') {
        setActivePage('opportunities');
      } else if (hash === 'home' || hash === '') {
        setActivePage('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (activePage !== 'home') {
      setActivePage('home');
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartExitRequest = (contractPrice: number, paidAmount: number, developer: string) => {
    setPrefillCalculator({ contractPrice, paidAmount, developer });
    setIsAddUnitOpen(true);
  };

  const handleHeroSearch = (query: string, region: string, propertyType: string) => {
    setHeroSearchFilters({
      searchQuery: query,
      region,
      propertyType
    });
    handleNavigate('opportunities');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f172a] font-sans selection:bg-[#0f766e] selection:text-white overflow-x-hidden w-full relative">
      {/* Top Navbar */}
      <Navbar
        currentBrand={currentBrand}
        activePage={activePage}
        onNavigate={handleNavigate}
        onSelectBrand={setCurrentBrand}
        onOpenAddUnit={() => setIsAddUnitOpen(true)}
        onOpenInvestorClub={() => setIsInvestorClubOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            {/* Hero Section (Clean & Direct) */}
            <HeroSection
              currentBrand={currentBrand}
              onOpenAddUnit={() => handleNavigate('sell')}
              onNavigate={handleNavigate}
            />

            {/* How It Works (Simple 4 steps) */}
            <HowItWorks />

            {/* Legal Guarantees & Safety Pillars */}
            <LegalGuarantees />

            {/* Social Proof & FAQs */}
            <TestimonialsAndFaq />
          </>
        )}

        {/* 1. صفحة قصتنا */}
        {activePage === 'story' && (
          <StoryPage
            currentBrand={currentBrand}
            onNavigate={handleNavigate}
            onOpenAddUnit={() => setIsAddUnitOpen(true)}
          />
        )}

        {/* 2. صفحة إزاي بنشتغل */}
        {activePage === 'how-it-works' && (
          <HowItWorksPage
            currentBrand={currentBrand}
            onNavigate={handleNavigate}
            onOpenAddUnit={() => setIsAddUnitOpen(true)}
          />
        )}

        {/* 3. صفحة كلمنا */}
        {activePage === 'contact' && (
          <ContactPage
            currentBrand={currentBrand}
            onNavigate={handleNavigate}
            onOpenAddUnit={() => setIsAddUnitOpen(true)}
          />
        )}

        {/* 4. صفحة للمستثمرين */}
        {activePage === 'investors' && (
          <InvestorsPage
            currentBrand={currentBrand}
            onNavigate={handleNavigate}
            onOpenAddUnit={() => setIsAddUnitOpen(true)}
          />
        )}

        {/* 5. صفحة بيع وحدتك */}
        {activePage === 'sell' && (
          <SellUnitPage
            currentBrand={currentBrand}
            onNavigate={handleNavigate}
            onOpenAddUnitModal={() => setIsAddUnitOpen(true)}
          />
        )}

        {/* 6. صفحة الفرص المتاحة */}
        {activePage === 'opportunities' && (
          <OpportunitiesPage
            units={units}
            currentBrand={currentBrand}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
            onOpenAddUnit={() => setIsAddUnitOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {/* 7. صفحة المناقلة والمبادلة العقارية الذكية */}
        {activePage === 'swap' && (
          <PropertySwapPage
            currentBrand={currentBrand}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
            onOpenAddUnit={() => setIsAddUnitOpen(true)}
          />
        )}

        {/* 8. لوحة تحكم الإدارة والتدقيق الفني */}
        {activePage === 'admin' && (
          <AdminPlatform
            onBackToApp={() => handleNavigate('home')}
            language={language}
          />
        )}
      </main>

      {/* Footer (hidden inside Admin Platform for full viewport immersion) */}
      {activePage !== 'admin' && (
        <Footer
          currentBrand={currentBrand}
          onNavigate={handleNavigate}
          onOpenAddUnit={() => setIsAddUnitOpen(true)}
        />
      )}

      {/* Unit Detail Modal */}
      <UnitDetailModal
        unit={selectedUnit}
        onClose={() => setSelectedUnit(null)}
      />

      {/* Add Unit / Safe Exit Request Modal */}
      <AddUnitModal
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        prefillContractPrice={prefillCalculator.contractPrice}
        prefillPaidAmount={prefillCalculator.paidAmount}
        prefillDeveloper={prefillCalculator.developer}
        onUnitCreated={(unit) => {
          setSelectedUnit(unit);
        }}
      />

      {/* VIP Investor Club Modal */}
      <InvestorClubModal
        isOpen={isInvestorClubOpen}
        onClose={() => setIsInvestorClubOpen(false)}
      />

      {/* Floating Action Buttons */}
      <div className={`fixed bottom-4 sm:bottom-5 ${isRTL ? 'left-3 sm:left-5' : 'right-3 sm:right-5'} z-40 flex flex-col items-start gap-2`}>
        <a
          href={`https://wa.me/201000000000?text=${encodeURIComponent(
            language === 'ar'
              ? 'مرحباً، أرغب في استشارة بخصوص التنازل عن وحدة بالأقساط بدون أوفر'
              : 'Hello, I would like an advisory consultation regarding 0% overprice contract transfer'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          title={language === 'ar' ? 'واتساب مباشر' : 'Direct WhatsApp'}
          aria-label={language === 'ar' ? 'واتساب مباشر' : 'Direct WhatsApp'}
        >
          <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{language === 'ar' ? 'واتساب مباشر' : 'Direct WhatsApp'}</span>
        </a>

        <button
          onClick={() => handleNavigate('sell')}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105 cursor-pointer border border-white/10"
          title={language === 'ar' ? 'اعرض وحدتك للتنازل' : 'List Unit for Exit'}
          aria-label={language === 'ar' ? 'اعرض وحدتك للتنازل' : 'List Unit for Exit'}
        >
          <PlusCircle className="w-4 h-4 text-[#2dd4bf]" />
          <span className="hidden sm:inline">{language === 'ar' ? 'اعرض وحدتك للتنازل' : 'List Unit for Exit'}</span>
        </button>
      </div>
    </div>
  );
}
