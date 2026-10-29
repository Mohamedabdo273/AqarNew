import React from 'react';

interface LogoProps {
  onClick?: () => void;
  /** موجودة عشان الأماكن اللي بتستخدمها — اللوجو بخلفيته البرتقالي فبيبان على أي خلفية. */
  light?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/* لوجو DEAL النهائي زي ما هو: البادج البرتقالي، والبيت والإيدين وDEAL والسطر اللي تحته بالأبيض.
   بخلفيته البرتقالي فبيبان على الفاتح والغامق، فمفيش نسخة تانية للفوتر. (من FINAL LOGO.pdf) */
const LOGO_SRC = '/brand/deal-badge.svg?v=5';
const LOGO_SRC_LIGHT = LOGO_SRC;

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
const SIZES = { sm: 'h-16', md: 'h-16 sm:h-[5.5rem]', lg: 'h-24' };

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
      width={688}
      height={237}
      className={`${SIZES[size]} w-auto shrink-0 transition-transform duration-200 group-hover:scale-105`}
    />
  </div>
);
