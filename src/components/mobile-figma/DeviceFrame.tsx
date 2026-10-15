import React, { useState } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, MoreVertical, Bell, Sparkles } from 'lucide-react';

export type Platform = 'ios' | 'android';
export type DeviceColor = 'titanium-dark' | 'titanium-natural' | 'silver' | 'gold';

interface DeviceFrameProps {
  platform: Platform;
  color?: DeviceColor;
  scale?: number;
  title?: string;
  activeScreenName?: string;
  children: React.ReactNode;
  currentTime?: string;
  className?: string;
  bottomBar?: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  platform,
  color = 'titanium-dark',
  scale = 1,
  title,
  activeScreenName,
  children,
  currentTime,
  className = '',
  bottomBar,
}) => {
  const [islandExpanded, setIslandExpanded] = useState(false);
  const time = currentTime || (platform === 'ios' ? '9:41' : '10:00');

  // Outer bezel frame color theme
  const bezelTheme = {
    'titanium-dark': {
      outer: 'bg-[#1a1b1e] border-[#2d2e32] shadow-2xl shadow-black/60',
      ring: 'border-[#3a3b40]',
      glare: 'from-white/10 via-transparent to-transparent',
    },
    'titanium-natural': {
      outer: 'bg-[#6b6965] border-[#8a8883] shadow-2xl shadow-black/50',
      ring: 'border-[#9e9c96]',
      glare: 'from-white/20 via-transparent to-transparent',
    },
    'silver': {
      outer: 'bg-[#e2e4e8] border-[#c0c4cc] shadow-2xl shadow-black/30',
      ring: 'border-[#ffffff]',
      glare: 'from-white/40 via-transparent to-transparent',
    },
    'gold': {
      outer: 'bg-[#4a3f35] border-[#7d6b5b] shadow-2xl shadow-black/50',
      ring: 'border-[#b59e86]',
      glare: 'from-amber-200/20 via-transparent to-transparent',
    },
  }[color];

  if (platform === 'ios') {
    return (
      <div
        className={`relative inline-flex flex-col items-center select-none transition-transform duration-200 ${className}`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {/* Frame Label / Figma Artboard Title */}
        {title && (
          <div className="mb-3 flex items-center gap-2 px-3 py-1 rounded-full bg-surface/90 border border-line text-xs font-semibold text-ink shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#007aff]" />
            <span>{title}</span>
            <span className="text-muted font-normal">· iOS 18 (393 × 852 pt)</span>
          </div>
        )}

        {/* iPhone 16 Pro Chassis */}
        <div
          className={`relative w-[393px] h-[852px] rounded-[54px] p-[11px] ${bezelTheme.outer} border-[4px] shadow-2xl`}
        >
          {/* Outer metal bezel highlight */}
          <div className="absolute inset-0 rounded-[50px] pointer-events-none ring-1 ring-white/10" />

          {/* Physical Side Buttons: Action Button + Volume Up & Down (Left), Power/Siri (Right) */}
          <div className="absolute -left-[6px] top-[115px] w-[3px] h-[28px] bg-[#3a3b40] rounded-l-sm" />
          <div className="absolute -left-[6px] top-[160px] w-[3px] h-[52px] bg-[#3a3b40] rounded-l-sm" />
          <div className="absolute -left-[6px] top-[225px] w-[3px] h-[52px] bg-[#3a3b40] rounded-l-sm" />
          <div className="absolute -right-[6px] top-[175px] w-[3px] h-[75px] bg-[#3a3b40] rounded-r-sm" />

          {/* Screen Display Container */}
          <div className="relative w-full h-full rounded-[44px] bg-paper overflow-hidden flex flex-col border border-black/40">
            {/* iOS Status Bar */}
            <div className="relative z-40 h-[47px] px-7 flex items-center justify-between text-[14px] font-semibold tracking-tight text-ink">
              {/* Left: Clock */}
              <span className="font-semibold">{time}</span>

              {/* Center: Dynamic Island */}
              <button
                onClick={() => setIslandExpanded(!islandExpanded)}
                className={`absolute left-1/2 -translate-x-1/2 top-[10px] bg-black text-white rounded-full transition-all duration-300 ease-out flex items-center justify-between px-3 cursor-pointer z-50 hover:opacity-95 ${
                  islandExpanded
                    ? 'w-[330px] h-[48px] rounded-[24px] shadow-xl py-2 px-4'
                    : 'w-[124px] h-[34px] rounded-full'
                }`}
                title="اضغط لتكبير Dynamic Island"
                aria-label="Dynamic Island"
              >
                {!islandExpanded ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-white/80 tracking-wide">فرصة</span>
                    <div className="w-3 h-3 rounded-full bg-black border border-white/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    </div>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-[10px]">
                        ف
                      </div>
                      <div className="text-start leading-tight">
                        <div className="font-bold text-[11px] text-white">فرصة اليوم</div>
                        <div className="text-[9px] text-white/70">شقة بالم هيلز · 0 أوفر</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] text-emerald-400 font-bold">معتمدة</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    </div>
                  </div>
                )}
              </button>

              {/* Right: Signal, 5G, Battery */}
              <div className="flex items-center gap-1.5 text-xs text-ink">
                <Signal className="w-4 h-4 fill-current" />
                <span className="text-[11px] font-bold">5G</span>
                <Battery className="w-5 h-5 fill-current" />
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
              {children}
            </div>

            {/* Bottom Navigation or Bar */}
            {bottomBar && <div className="relative z-30">{bottomBar}</div>}

            {/* iOS Home Indicator Safe Area */}
            <div className="relative z-40 h-[28px] w-full flex items-center justify-center bg-transparent pointer-events-none">
              <div className="w-[136px] h-[5px] rounded-full bg-ink/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android Material 3 Chassis (Pixel 9 Pro)
  return (
    <div
      className={`relative inline-flex flex-col items-center select-none transition-transform duration-200 ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Frame Label / Figma Artboard Title */}
      {title && (
        <div className="mb-3 flex items-center gap-2 px-3 py-1 rounded-full bg-surface/90 border border-line text-xs font-semibold text-ink shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>{title}</span>
          <span className="text-muted font-normal">· Android Material 3 (412 × 915 dp)</span>
        </div>
      )}

      {/* Android Device Chassis */}
      <div
        className={`relative w-[412px] h-[870px] rounded-[48px] p-[10px] ${bezelTheme.outer} border-[3px] shadow-2xl`}
      >
        {/* Metal ring highlight */}
        <div className="absolute inset-0 rounded-[44px] pointer-events-none ring-1 ring-white/10" />

        {/* Physical buttons on right edge for Android */}
        <div className="absolute -right-[5px] top-[180px] w-[3px] h-[45px] bg-[#3a3b40] rounded-r-sm" />
        <div className="absolute -right-[5px] top-[245px] w-[3px] h-[80px] bg-[#3a3b40] rounded-r-sm" />

        {/* Screen Display Container */}
        <div className="relative w-full h-full rounded-[38px] bg-paper overflow-hidden flex flex-col border border-black/40">
          {/* Android Status Bar */}
          <div className="relative z-40 h-[36px] px-6 flex items-center justify-between text-[13px] font-medium text-ink bg-transparent">
            {/* Clock */}
            <span className="font-semibold">{time}</span>

            {/* Centered Punch-hole Camera */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[9px] w-[14px] h-[14px] rounded-full bg-black border border-[#2a2a2a] flex items-center justify-center">
              <div className="w-[5px] h-[5px] rounded-full bg-[#0a1525]" />
            </div>

            {/* Notification icons & Battery */}
            <div className="flex items-center gap-2 text-xs text-ink">
              <Bell className="w-3.5 h-3.5 text-muted" />
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">LTE</span>
              <Battery className="w-4 h-4 fill-current" />
              <span className="text-[11px] font-bold">96%</span>
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            {children}
          </div>

          {/* Bottom Bar / Navigation */}
          {bottomBar && <div className="relative z-30">{bottomBar}</div>}

          {/* Android Gesture Navigation Bar */}
          <div className="relative z-40 h-[22px] w-full flex items-center justify-center bg-transparent pointer-events-none">
            <div className="w-[96px] h-[4px] rounded-full bg-ink/60" />
          </div>
        </div>
      </div>
    </div>
  );
};
