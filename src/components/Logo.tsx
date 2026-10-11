import React from 'react';

interface LogoProps {
  onClick?: () => void;
  light?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/** The mark on its own: a terracotta circle with a white "ف". Works as the app/tab icon too. */
export const LogoMark: React.FC<{ size?: number; className?: string; light?: boolean }> = ({ size = 38, className }) => (
  <svg width={size} height={size} viewBox="0 0 44 44" className={className} aria-hidden="true">
    <circle cx="22" cy="22" r="22" fill="#b5562f" />
    <text x="22" y="29.5" textAnchor="middle" fontFamily="'El Messiri', serif" fontWeight={700} fontSize="25" fill="#ffffff">
      ف
    </text>
  </svg>
);

const SIZES = {
  sm: { mark: 'w-9 h-9', en: 'text-[24px]', ar: 'text-[12px]' },
  md: { mark: 'w-11 h-11 sm:w-[52px] sm:h-[52px]', en: 'text-[28px] sm:text-[34px]', ar: 'text-[13px] sm:text-[15px]' },
  lg: { mark: 'w-16 h-16', en: 'text-[46px]', ar: 'text-[20px]' },
};

/**
 * Circle mark + "forsa" as the big word, with "فرصة" small underneath.
 * `light` is for dark backgrounds (footer): white words, the circle keeps its terracotta.
 */
export const Logo: React.FC<LogoProps> = ({ onClick, light = false, className = '', size = 'md' }) => {
  const s = SIZES[size];
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
      className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer select-none group focus:outline-hidden ${className}`}
      aria-label="FORSA - فرصة"
    >
      <LogoMark className={`${s.mark} shrink-0 transition-transform duration-200 group-hover:scale-105`} />
      <span className="flex flex-col items-start leading-none">
        <span
          dir="ltr"
          className={`${s.en} font-extrabold tracking-[-0.03em] leading-[0.95] ${light ? 'text-white' : 'text-brand'}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          forsa
        </span>
        <span
          className={`${s.ar} mt-0.5 leading-none ${light ? 'text-white/70' : 'text-accent'}`}
          style={{ fontFamily: "'El Messiri', serif", fontWeight: 700 }}
        >
          فرصة
        </span>
      </span>
    </div>
  );
};
