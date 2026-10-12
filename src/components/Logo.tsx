import React from 'react';

interface LogoProps {
  onClick?: () => void;
  light?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/** Same value as the --color-accent-bright token, kept here so the SVG can use it as a stroke. */
const LOGO_ORANGE = 'var(--color-accent-bright, #f26a0a)';

/** The mark on its own: a house outline with a handshake inside. Same drawing as brand/forsa-logo.svg. */
export const LogoMark: React.FC<{ size?: number; className?: string; light?: boolean; color?: string }> = ({ size = 40, className, color = LOGO_ORANGE }) => (
  <svg width={size} height={(size * 96) / 112} viewBox="0 0 112 96" className={className} aria-hidden="true">
    <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 46L56 9l48 37" strokeWidth="10" />
      <path d="M19 39v53h74V39" strokeWidth="10" />
      <g transform="translate(33 36) scale(1.9)" strokeWidth="2.4">
        <path d="M11 17l2 2a1 1 0 1 0 3-3" />
        <path d="M14 14l2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="M21 3l1 11h-2" />
        <path d="M3 3L2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </g>
    </g>
  </svg>
);

const SIZES = {
  sm: { mark: 'w-9', word: 'text-[24px]', tag: 'text-[7px] tracking-[0.2em]' },
  md: { mark: 'w-11 sm:w-14', word: 'text-[28px] sm:text-[36px]', tag: 'text-[7.5px] sm:text-[9.5px] tracking-[0.2em]' },
  lg: { mark: 'w-20', word: 'text-[52px]', tag: 'text-[13px] tracking-[0.22em]' },
};

/**
 * House-and-handshake mark + "FORSA" (navy) over "REAL ESTATE SOLUTIONS" (orange).
 * `light` is for dark backgrounds (footer): FORSA turns white, the orange stays.
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
      aria-label="FORSA - Real Estate Solutions"
      dir="ltr"
    >
      <LogoMark className={`${s.mark} h-auto shrink-0 transition-transform duration-200 group-hover:scale-105`} />
      <span className="flex flex-col leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <span className={`${s.word} font-extrabold tracking-[0.01em] leading-[0.9] ${light ? 'text-white' : 'text-brand'}`}>FORSA</span>
        <span className={`${s.tag} mt-1 font-semibold whitespace-nowrap`} style={{ color: LOGO_ORANGE }}>
          REAL ESTATE SOLUTIONS
        </span>
      </span>
    </div>
  );
};
