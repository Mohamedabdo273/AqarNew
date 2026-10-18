import React from 'react';

interface LogoProps {
  onClick?: () => void;
  /** موجودة عشان الأماكن اللي بتستخدمها — اللوجو بخلفيته البرتقالي فبيبان على أي خلفية. */
  light?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/* لوجو DEAL: الحروف مباني، حرف برتقاني وحرف كحلي، وتحتها REAL ESTATE.
   على الخلفيات الغامقة (الفوتر) الكحلي بيبقى أبيض. */
const LOGO_SRC = '/brand/deal-logo.svg?v=4';
const LOGO_SRC_LIGHT = '/brand/deal-logo-white.svg?v=4';
const MARK_SRC = '/brand/forsa-mark.png';
const MARK_SRC_LIGHT = '/brand/forsa-mark-white.png';

/** العلامة: لوجو DEAL */
export const LogoMark: React.FC<{ size?: number; className?: string; light?: boolean }> = ({
  size = 40,
  className = '',
  light = false,
}) => (
  <img
    src={light ? LOGO_SRC_LIGHT : LOGO_SRC}
    alt="DEAL"
    width={size}
    height={size}
    className={`shrink-0 object-contain ${className}`}
    style={{ height: size, width: 'auto' }}
  />
);

/** عرض اللوجو — الارتفاع بيتحسب لوحده من نسبة الصورة. */
const SIZES = { sm: 'h-24', md: 'h-20 sm:h-24', lg: 'h-28' };

/** اللوجو الكامل: DEAL + REAL ESTATE. */
export const Logo: React.FC<LogoProps> = ({ onClick, className = '', size = 'md', light = false }) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
    className={`inline-flex items-center shrink-0 cursor-pointer select-none group focus:outline-hidden ${className}`}
    aria-label="DEAL - Real Estate Solutions"
    dir="ltr"
  >
    <img
      src={light ? LOGO_SRC_LIGHT : LOGO_SRC}
      alt="DEAL — Real Estate Solutions"
      width={600}
      height={285}
      className={`${SIZES[size]} w-auto shrink-0 transition-transform duration-200 group-hover:scale-105`}
    />
  </div>
);
