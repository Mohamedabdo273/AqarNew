import React from 'react';
import { useLogo, LogoVariant } from '../context/LogoContext';

interface LogoProps {
  onClick?: () => void;
  light?: boolean;
  forcedVariant?: LogoVariant;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/** Standalone square icon mark for tight places (favicon, admin login, etc.) */
export const LogoMark: React.FC<{ size?: number; className?: string; light?: boolean; variant?: LogoVariant }> = ({
  size = 38,
  className,
  light,
  variant = 'portal',
}) => {
  const primary = light ? '#ffffff' : '#1e3a5f';
  const accent = '#b5562f';
  const bg = light ? 'rgba(255,255,255,0.15)' : '#1e3a5f';
  const fg = light ? '#ffffff' : '#ffffff';

  if (variant === 'crest') {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" className={className} fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="12" fill={bg} />
        {/* Monogram Architectural F with roofline */}
        <path d="M14 34V12H30V18H20V23H27V28H20V34H14Z" fill={fg} />
        <rect x="22" y="10" width="8" height="3" rx="1.5" fill={accent} />
        <circle cx="27" cy="25.5" r="2.5" fill={accent} />
      </svg>
    );
  }

  if (variant === 'skyline') {
    return (
      <svg width={size} height={size} viewBox="0 0 44 44" className={className} fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="12" fill={bg} />
        {/* 3 Stepped towers */}
        <path d="M12 34V22L17 17V34H12Z" fill={fg} fillOpacity="0.8" />
        <path d="M19 34V14L25 9V34H19Z" fill={accent} />
        <path d="M27 34V19L32 15V34H27Z" fill={fg} />
      </svg>
    );
  }

  // Default: Gateway Portal / Safe Exit keyhole
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className={className} fill="none" aria-hidden="true">
      <rect width="44" height="44" rx="12" fill={bg} />
      {/* Architectural Doorway / Portal */}
      <path
        d="M13 33V17C13 13.6863 15.6863 11 19 11H25C28.3137 11 31 13.6863 31 17V33"
        stroke={fg}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Inner Key / Exit Arrow Step */}
      <path d="M22 17V26" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="22" cy="29" r="2.5" fill={accent} />
      <rect x="10" y="32" width="24" height="3" rx="1.5" fill={fg} />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  onClick,
  light = false,
  forcedVariant,
  className = '',
  size = 'md',
}) => {
  const { logoVariant } = useLogo();
  const currentVariant = forcedVariant || logoVariant;

  const primaryColor = light ? 'text-white' : 'text-brand';
  const accentColor = light ? 'text-white/80' : 'text-accent';

  // Sizing styles
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  const engSize = isLg
    ? 'text-3xl sm:text-4xl'
    : isSm
    ? 'text-lg sm:text-xl'
    : 'text-2xl sm:text-[26px]';

  const arSize = isLg
    ? 'text-sm sm:text-base'
    : isSm
    ? 'text-[10px]'
    : 'text-xs sm:text-[13px]';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer select-none group focus:outline-hidden ${className}`}
      aria-label="Forsa - فرصة"
    >
      {/* Variant 1: Pure Typographic Wordmark (English on top, bigger) */}
      {currentVariant === 'wordmark' && (
        <div className="flex flex-col items-center justify-center text-center leading-none">
          <span className={`font-display font-black tracking-tight ${engSize} ${primaryColor} group-hover:scale-[1.02] transition-transform`}>
            FORSA
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-[1.5px] bg-accent/70 rounded-full" />
            <span
              className={`font-bold font-display ${arSize} ${accentColor} tracking-[0.25em]`}
            >
              فـُـرصـة
            </span>
            <span className="w-2.5 h-[1.5px] bg-accent/70 rounded-full" />
          </div>
        </div>
      )}

      {/* Variant 2: Gateway Portal Emblem + Dual Script (English on top, bigger) */}
      {currentVariant === 'portal' && (
        <>
          <LogoMark
            size={isLg ? 48 : isSm ? 32 : 40}
            light={light}
            variant="portal"
            className="group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col text-start leading-none">
            <span className={`font-display font-black tracking-tight ${engSize} ${primaryColor} group-hover:text-brand-light transition-colors`}>
              FORSA
            </span>
            <span className={`mt-0.5 font-bold font-display ${arSize} ${accentColor} tracking-widest`}>
              فـُـرصــة
            </span>
          </div>
        </>
      )}

      {/* Variant 3: Financial Crest / Monogram (English on top, bigger) */}
      {currentVariant === 'crest' && (
        <>
          <LogoMark
            size={isLg ? 48 : isSm ? 32 : 40}
            light={light}
            variant="crest"
            className="group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col text-start leading-none">
            <div className="flex items-baseline gap-1">
              <span className={`font-display font-black tracking-wider ${engSize} ${primaryColor}`}>
                FORSA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            </div>
            <span className={`mt-0.5 font-bold font-display ${arSize} ${accentColor} tracking-[0.2em]`}>
              فـُـرصـة · عقارات
            </span>
          </div>
        </>
      )}

      {/* Variant 4: Fintech Bold Dot (English on top, bigger) */}
      {currentVariant === 'dot' && (
        <div className="flex flex-col items-center justify-center text-center leading-none">
          <div className="flex items-baseline">
            <span className={`font-display font-black tracking-tight ${engSize} ${primaryColor}`}>
              FORSA
            </span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent ms-0.5 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-3 h-[1.5px] bg-accent/60" />
            <span className={`font-extrabold ${arSize} ${accentColor} tracking-widest`}>
              فـُـرصـة
            </span>
            <span className="w-3 h-[1.5px] bg-accent/60" />
          </div>
        </div>
      )}

      {/* Variant 5: Architectural Skyline Angle (English on top, bigger) */}
      {currentVariant === 'skyline' && (
        <>
          <LogoMark
            size={isLg ? 48 : isSm ? 32 : 40}
            light={light}
            variant="skyline"
            className="group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col text-start leading-none">
            <span className={`font-display font-black tracking-tight ${engSize} ${primaryColor}`}>
              FORSA
            </span>
            <span className={`mt-0.5 font-bold ${arSize} ${accentColor} tracking-[0.22em]`}>
              فـُـرصـة
            </span>
          </div>
        </>
      )}
    </div>
  );
};
