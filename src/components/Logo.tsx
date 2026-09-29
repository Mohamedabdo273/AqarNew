import React from 'react';
import { BRAND } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';

/** Square mark for tight spots — favicon, app icon, the admin sign-in.
 *  One letter only: at 16px a whole word turns to mush. Keep in sync with public/favicon.svg. */
export const LogoMark: React.FC<{ size?: number; className?: string; light?: boolean }> = ({ size = 36, className, light }) => {
  const bg = light ? '#ffffff' : '#1e3a5f';
  const fg = light ? '#1e3a5f' : '#ffffff';
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="9" fill={bg} />
      <text
        x="20"
        y="29"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill={fg}
        fontFamily="'IBM Plex Sans Arabic', system-ui, sans-serif"
      >
        ف
      </text>
      <rect x="11" y="32.6" width="18" height="2.2" rx="1.1" fill="#b5562f" />
    </svg>
  );
};

/**
 * The wordmark: the name, with the other script under it.
 * Whichever language you're reading leads, so the lockup stays the same shape in both.
 */
export const Logo: React.FC<{ onClick?: () => void; light?: boolean }> = ({ onClick, light }) => {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const lead = ar ? BRAND.nameAr : BRAND.nameEn.toUpperCase();
  const sub = ar ? BRAND.nameEn.toUpperCase() : BRAND.nameAr;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center shrink-0 min-h-11 leading-none"
      aria-label={ar ? BRAND.nameAr : BRAND.nameEn}
    >
      <span className={`font-display text-2xl font-bold tracking-tight ${light ? 'text-white' : 'text-brand'}`}>
        {lead}
      </span>
      <span
        className={`mt-0.5 text-[0.65rem] font-semibold ${light ? 'text-white/70' : 'text-accent'}`}
        style={{ letterSpacing: ar ? '0.42em' : '0.12em', textIndent: ar ? '0.42em' : undefined }}
      >
        {sub}
      </span>
    </button>
  );
};
