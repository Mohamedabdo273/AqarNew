import React from 'react';
import { BRAND } from '../config/brand';
import { useLanguage } from '../context/LanguageContext';

/** Brand mark: a building with one lit window — "your unit". Keep in sync with public/favicon.svg. */
export const LogoMark: React.FC<{ size?: number; className?: string }> = ({ size = 36, className }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
    <rect width="40" height="40" rx="11" fill="#145c4b" />
    <path d="M11 32V11.5a2.5 2.5 0 0 1 2.5-2.5h13a2.5 2.5 0 0 1 2.5 2.5V32z" fill="#ffffff" />
    <g fill="#145c4b">
      <rect x="13.8" y="12.5" width="3.4" height="3.4" rx="0.8" />
      <rect x="18.3" y="12.5" width="3.4" height="3.4" rx="0.8" />
      <rect x="22.8" y="12.5" width="3.4" height="3.4" rx="0.8" />
      <rect x="13.8" y="17.6" width="3.4" height="3.4" rx="0.8" />
      <rect x="18.3" y="17.6" width="3.4" height="3.4" rx="0.8" />
      <rect x="13.8" y="22.7" width="3.4" height="3.4" rx="0.8" />
      <rect x="22.8" y="22.7" width="3.4" height="3.4" rx="0.8" />
      <rect x="18.3" y="25.5" width="3.4" height="6.5" rx="0.8" />
    </g>
    <rect x="22.8" y="17.6" width="3.4" height="3.4" rx="0.8" fill="#f2b53a" />
    <rect x="8" y="31.2" width="24" height="1.8" rx="0.9" fill="#ffffff" />
  </svg>
);

export const Logo: React.FC<{ onClick?: () => void; light?: boolean }> = ({ onClick, light }) => {
  const { language } = useLanguage();
  const name = language === 'ar' ? BRAND.nameAr : BRAND.nameEn;
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 shrink-0 min-h-11" aria-label={name}>
      <LogoMark />
      <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>{name}</span>
    </button>
  );
};
