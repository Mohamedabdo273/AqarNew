import React, { useState } from 'react';
import { FigmaToolbar, ViewMode } from '../components/mobile-figma/FigmaToolbar';
import { DeviceFrame, Platform, DeviceColor } from '../components/mobile-figma/DeviceFrame';
import { MobileScreens, MobileTabBar, ScreenId } from '../components/mobile-figma/MobileScreens';
import { DesignSystemTokens } from '../components/mobile-figma/DesignSystemTokens';
import { useUnits } from '../context/UnitsContext';
import { useLanguage } from '../context/LanguageContext';
import { PageId } from '../types';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Download,
  Share2,
  Check,
  Smartphone,
  Layers,
  Info,
  Maximize2,
} from 'lucide-react';

interface MobileDesignPageProps {
  onNavigate: (page: PageId) => void;
}

export const MobileDesignPage: React.FC<MobileDesignPageProps> = ({ onNavigate }) => {
  const { units } = useUnits();
  const { tx, language } = useLanguage();

  const [platform, setPlatform] = useState<Platform>('ios');
  const [showBothPlatforms, setShowBothPlatforms] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('interactive');
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [deviceColor, setDeviceColor] = useState<DeviceColor>('titanium-dark');
  const [scale, setScale] = useState(0.9);
  const [copiedLink, setCopiedLink] = useState(false);

  const screensList: { id: ScreenId; titleAr: string; titleEn: string; desc: string }[] = [
    {
      id: 'home',
      titleAr: '01 · الرئيسية (Home)',
      titleEn: '01 · Home & Explore',
      desc: 'البحث الفوري، حاسبة التنازل، شريط المطورين، وفرص اليوم الحصرية بدون أوفر برايس',
    },
    {
      id: 'listings',
      titleAr: '02 · فرص السوق والفلترة (Listings)',
      titleEn: '02 · Opportunities & Filters',
      desc: 'فلتر المطور الذكي (دوّر على مطور)، كروت الوحدات ببادج طوبي، والمقارنة السريعة',
    },
    {
      id: 'detail',
      titleAr: '03 · تفاصيل الوحدة (Unit Details)',
      titleEn: '03 · Unit Detail View',
      desc: 'معرض الصور، فحص العقد القانوني 100%، تفاصيل الأقساط، وشريط الاتصال والواتساب الثابت',
    },
    {
      id: 'sell',
      titleAr: '04 · اعرض وحدتك (Sell Unit)',
      titleEn: '04 · Sell Unit Flow',
      desc: 'ويزارد العرض السريع مع فلتر المطور اللحظي واختيار الكمبوند وتفاصيل الكاش',
    },
    {
      id: 'swap',
      titleAr: '05 · البدل العقاري (Property Swap)',
      titleEn: '05 · Property Swap',
      desc: 'توفيق البدل الذكي بدون عمولة مضاعفة مع نسبة التوافق وضمانات المطور',
    },
    {
      id: 'account',
      titleAr: '06 · حسابي وتتبع الطلبات (Account)',
      titleEn: '06 · Account & OTP',
      desc: 'تسجيل الدخول برقم الموبايل OTP ومتابعة مراحل طلب التنازل خطوة بخطوة',
    },
  ];

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/#mobile-design');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#141518] text-[#e0e2e6] flex flex-col selection:bg-[#a259ff] selection:text-white">
      {/* Figma Studio Main Top Bar */}
      <FigmaToolbar
        platform={platform}
        onPlatformChange={setPlatform}
        showBothPlatforms={showBothPlatforms}
        onToggleBothPlatforms={setShowBothPlatforms}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        deviceColor={deviceColor}
        onDeviceColorChange={setDeviceColor}
        scale={scale}
        onScaleChange={setScale}
      />

      {/* Breadcrumb / Sub-header Banner */}
      <div className="bg-[#1b1c20] border-b border-[#2a2c32] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="text-white/60 hover:text-white flex items-center gap-1 font-semibold"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
            <span>العودة للمنصة الأساسية</span>
          </button>
          <span className="text-white/30">/</span>
          <span className="font-bold text-white flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-accent-light" />
            <span>تصميم ومحاكي تطبيق الموبايل لنظامي iOS و Android (Figma Studio)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShareLink}
            className="px-3 py-1 rounded-md bg-[#282a30] border border-[#3e414a] text-white/90 hover:text-white flex items-center gap-1.5 font-semibold"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>تم نسخ الرابط!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-white/70" />
                <span>مشاركة التصميم</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-auto">
        {/* VIEW MODE 1: INTERACTIVE SIMULATOR */}
        {viewMode === 'interactive' && (
          <div
            className="min-h-[900px] p-6 sm:p-12 flex flex-col items-center justify-center relative"
            style={{
              backgroundImage: 'radial-gradient(#2d3039 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Quick Screen Selector Buttons */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#1f2127]/90 backdrop-blur-md border border-[#333742] shadow-xl z-10 max-w-2xl">
              {screensList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScreen(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeScreen === s.id
                      ? 'bg-brand text-white shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s.titleAr.split(' ')[2] || s.titleAr}
                </button>
              ))}
            </div>

            {/* Device Frames Display */}
            {!showBothPlatforms ? (
              /* Single Selected Device */
              <div className="flex flex-col items-center">
                <DeviceFrame
                  platform={platform}
                  color={deviceColor}
                  scale={scale}
                  title={platform === 'ios' ? 'Apple iPhone 16 Pro' : 'Google Pixel 9 Pro'}
                  bottomBar={
                    <MobileTabBar
                      platform={platform}
                      activeScreen={activeScreen}
                      onNavigate={setActiveScreen}
                    />
                  }
                >
                  <MobileScreens
                    screen={activeScreen}
                    platform={platform}
                    onNavigateScreen={setActiveScreen}
                    units={units}
                  />
                </DeviceFrame>
              </div>
            ) : (
              /* Side-by-Side: iOS and Android together */
              <div className="flex flex-wrap items-start justify-center gap-12 sm:gap-16">
                {/* iOS Device */}
                <div className="flex flex-col items-center">
                  <DeviceFrame
                    platform="ios"
                    color={deviceColor}
                    scale={scale}
                    title="Apple iOS 18 (iPhone 16 Pro)"
                    bottomBar={
                      <MobileTabBar
                        platform="ios"
                        activeScreen={activeScreen}
                        onNavigate={setActiveScreen}
                      />
                    }
                  >
                    <MobileScreens
                      screen={activeScreen}
                      platform="ios"
                      onNavigateScreen={setActiveScreen}
                      units={units}
                    />
                  </DeviceFrame>
                </div>

                {/* Android Device */}
                <div className="flex flex-col items-center">
                  <DeviceFrame
                    platform="android"
                    color={deviceColor}
                    scale={scale}
                    title="Google Android 15 (Material 3)"
                    bottomBar={
                      <MobileTabBar
                        platform="android"
                        activeScreen={activeScreen}
                        onNavigate={setActiveScreen}
                      />
                    }
                  >
                    <MobileScreens
                      screen={activeScreen}
                      platform="android"
                      onNavigateScreen={setActiveScreen}
                      units={units}
                    />
                  </DeviceFrame>
                </div>
              </div>
            )}

            {/* Helpful Simulator Tips */}
            <div className="mt-8 text-center text-xs text-white/50 max-w-md">
              <p>
                💡 <strong className="text-white/80">محاكي تفاعلي كامل:</strong> يمكنك الضغط على شريط التنقل بالأسفل للتنقل بين الشاشات، أو الضغط على الجزيرة التفاعلية Dynamic Island، أو فتح كروت الوحدات والفلترة.
              </p>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: FIGMA ARTBOARDS CANVAS */}
        {viewMode === 'canvas' && (
          <div
            className="p-8 sm:p-12 min-h-screen"
            style={{
              backgroundImage: 'radial-gradient(#2d3039 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          >
            <div className="max-w-7xl mx-auto mb-8 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a259ff]/20 text-[#c898ff] text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>لوحة شاشات التصميم الشاملة (Figma Artboards Canvas)</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                شاشات تطبيق فرصة لكلا نظامي iOS و Android
              </h2>
              <p className="text-xs text-white/60 mt-1">
                جميع الشاشات الست الأساسية مصممة بأعلى معايير تجربة المستخدم (UI/UX) مع الحفاظ على هوية المنصة (اللون الطوبي، فلاتر المطورين، 0 أوفر برايس). اضغط على أي شاشة لتشغيلها في المحاكي التفاعلي.
              </p>
            </div>

            {/* Grid of Artboards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {screensList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveScreen(item.id);
                    setViewMode('interactive');
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  {/* Artboard Header Label */}
                  <div className="w-[393px] mb-2 flex items-center justify-between text-xs px-2">
                    <span className="font-bold text-white/90 group-hover:text-accent-light transition-colors">
                      {item.titleAr}
                    </span>
                    <span className="text-[11px] text-white/50">393 × 852 pt</span>
                  </div>

                  {/* Device Scaled Down for Canvas View */}
                  <div className="group-hover:scale-[1.02] transition-transform duration-200">
                    <DeviceFrame
                      platform="ios"
                      color="titanium-dark"
                      scale={0.72}
                      bottomBar={
                        <MobileTabBar
                          platform="ios"
                          activeScreen={item.id}
                          onNavigate={() => {}}
                        />
                      }
                    >
                      <MobileScreens
                        screen={item.id}
                        platform="ios"
                        onNavigateScreen={() => {}}
                        units={units}
                      />
                    </DeviceFrame>
                  </div>

                  {/* Description Box */}
                  <div className="w-[393px] mt-1 p-2 rounded-xl bg-[#1f2127] border border-[#2d3039] text-[11px] text-white/60 text-start">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW MODE 3: DESIGN TOKENS & SPECS */}
        {viewMode === 'tokens' && (
          <div className="bg-paper py-8">
            <DesignSystemTokens />
          </div>
        )}
      </div>
    </div>
  );
};
