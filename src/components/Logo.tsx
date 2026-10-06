import React from 'react';

interface LogoProps {
  onClick?: () => void;
  light?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/** Standalone square icon mark for tight places (favicon, admin login, etc.) */
export const LogoMark: React.FC<{ size?: number; className?: string; light?: boolean }> = ({
  size = 38,
  className,
  light,
}) => {
  const accent = '#b5562f';
  const bg = light ? 'rgba(255,255,255,0.15)' : '#1e3a5f';
  const fg = '#ffffff';

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

/**
 * Platform Logo:
 * English (FORSA) on top and larger, with Arabic (فرصة) underneath.
 */
export const Logo: React.FC<LogoProps> = ({
  onClick,
  light = false,
  className = '',
  size = 'md',
}) => {
  const primaryColor = light ? 'text-white' : 'text-brand';
  const accentColor = light ? 'text-white/80' : 'text-accent';

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
      aria-label="FORSA - فرصة"
    >
      <LogoMark
        size={isLg ? 48 : isSm ? 32 : 40}
        light={light}
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
    </div>
  );
};
