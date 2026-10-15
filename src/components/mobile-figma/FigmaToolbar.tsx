import React from 'react';
import {
  Smartphone,
  Layers,
  Palette,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Check,
  Apple,
  Eye,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { Platform, DeviceColor } from './DeviceFrame';
import { ScreenId } from './MobileScreens';

export type ViewMode = 'interactive' | 'canvas' | 'tokens';

interface FigmaToolbarProps {
  platform: Platform;
  onPlatformChange: (p: Platform) => void;
  showBothPlatforms: boolean;
  onToggleBothPlatforms: (show: boolean) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  activeScreen: ScreenId;
  onScreenChange: (s: ScreenId) => void;
  deviceColor: DeviceColor;
  onDeviceColorChange: (c: DeviceColor) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
}

export const FigmaToolbar: React.FC<FigmaToolbarProps> = ({
  platform,
  onPlatformChange,
  showBothPlatforms,
  onToggleBothPlatforms,
  viewMode,
  onViewModeChange,
  activeScreen,
  onScreenChange,
  deviceColor,
  onDeviceColorChange,
  scale,
  onScaleChange,
}) => {
  const screens: { id: ScreenId; label: string }[] = [
    { id: 'home', label: '1. الرئيسية' },
    { id: 'listings', label: '2. الفرص والفلترة' },
    { id: 'detail', label: '3. تفاصيل الوحدة' },
    { id: 'sell', label: '4. اعرض وحدتك' },
    { id: 'swap', label: '5. البدل العقاري' },
    { id: 'account', label: '6. حسابي' },
  ];

  const colors: { id: DeviceColor; label: string; bg: string }[] = [
    { id: 'titanium-dark', label: 'Dark Titanium', bg: '#2b2c30' },
    { id: 'titanium-natural', label: 'Natural Titanium', bg: '#8a8883' },
    { id: 'silver', label: 'Silver White', bg: '#d4d8de' },
    { id: 'gold', label: 'Desert Gold', bg: '#a38f7a' },
  ];

  return (
    <div className="sticky top-0 z-40 bg-[#1e1e1e] text-white border-b border-[#333333] shadow-md px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Brand / Studio Badge & View Modes */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#2c2c2c] border border-[#3e3e3e]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#a259ff]" />
          <span className="font-bold tracking-tight">Figma Studio</span>
          <span className="text-white/40">·</span>
          <span className="text-white/70">تطبيق الموبايل</span>
        </div>

        {/* View Mode Segmented Tabs */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#2c2c2c] border border-[#3e3e3e]">
          <button
            onClick={() => onViewModeChange('interactive')}
            className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'interactive'
                ? 'bg-[#383838] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-accent-light" />
            <span>المحاكي التفاعلي</span>
          </button>

          <button
            onClick={() => onViewModeChange('canvas')}
            className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'canvas'
                ? 'bg-[#383838] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#007aff]" />
            <span>لوحة الآرت بوردز (Figma Canvas)</span>
          </button>

          <button
            onClick={() => onViewModeChange('tokens')}
            className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'tokens'
                ? 'bg-[#383838] text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>المواصفات والتوكنز</span>
          </button>
        </div>
      </div>

      {/* Center: Platform Switcher (iOS vs Android) */}
      {viewMode === 'interactive' && (
        <div className="flex items-center gap-2">
          {/* OS Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#2c2c2c] border border-[#3e3e3e]">
            <button
              onClick={() => {
                onToggleBothPlatforms(false);
                onPlatformChange('ios');
              }}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                !showBothPlatforms && platform === 'ios'
                  ? 'bg-[#007aff] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Apple iOS 18</span>
            </button>

            <button
              onClick={() => {
                onToggleBothPlatforms(false);
                onPlatformChange('android');
              }}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                !showBothPlatforms && platform === 'android'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android 15</span>
            </button>

            <button
              onClick={() => onToggleBothPlatforms(!showBothPlatforms)}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                showBothPlatforms
                  ? 'bg-[#a259ff] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>كلاهما جنب بعض</span>
            </button>
          </div>

          {/* Screen Picker */}
          <div className="relative">
            <select
              value={activeScreen}
              onChange={(e) => onScreenChange(e.target.value as ScreenId)}
              className="appearance-none bg-[#2c2c2c] border border-[#3e3e3e] text-white rounded-lg px-3 py-1.5 pe-8 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {screens.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1e1e1e] text-white">
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-white/60 absolute end-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Right: Device Finish & Zoom */}
      <div className="flex items-center gap-2">
        {/* Device Color / Finish */}
        {viewMode === 'interactive' && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2c2c2c] border border-[#3e3e3e]">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => onDeviceColorChange(c.id)}
                title={c.label}
                className={`w-4 h-4 rounded-full border transition-all ${
                  deviceColor === c.id ? 'border-white scale-125' : 'border-white/30 opacity-70'
                }`}
                style={{ backgroundColor: c.bg }}
              />
            ))}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#2c2c2c] border border-[#3e3e3e]">
          <button
            onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
            className="p-1 text-white/70 hover:text-white"
            title="تصغير"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1 w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => onScaleChange(Math.min(1.4, scale + 0.1))}
            className="p-1 text-white/70 hover:text-white"
            title="تكبير"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onScaleChange(scale === 0.9 ? 1 : 0.9)}
            className="p-1 text-white/70 hover:text-white ms-1"
            title="إعادة ضبط الحجم"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
