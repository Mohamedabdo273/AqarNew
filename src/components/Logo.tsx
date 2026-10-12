import React from 'react';

interface LogoProps {
  onClick?: () => void;
  /** موجودة عشان الأماكن اللي بتستخدمها — اللوجو بخلفيته البرتقالي فبيبان على أي خلفية. */
  light?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/* اللوجو كامل زي ما هو: أبيض على خلفيته البرتقالي، بسطر REAL ESTATE SOLUTIONS.
   الفراغ البرتقالي حوالين الكلام أقل ما يمكن عشان الكلام ياخد أكبر نصيب من البادچ. */
const LOGO_SRC = '/brand/forsa-logo-bg.png';
const MARK_SRC = '/brand/forsa-mark.png';
const MARK_SRC_LIGHT = '/brand/forsa-mark-white.png';

/** العلامة لوحدها: بيت جوّاه مصافحة — من غير خلفية، عشان بتتحط على صفحات فاتحة. */
export const LogoMark: React.FC<{ size?: number; className?: string; light?: boolean }> = ({
  size = 40,
  className,
  light = false,
}) => (
  <img
    src={light ? MARK_SRC_LIGHT : MARK_SRC}
    alt=""
    aria-hidden="true"
    width={size}
    height={Math.round((size * 214) / 254)}
    className={className}
    style={{ width: size, height: 'auto' }}
  />
);

/** عرض اللوجو — الارتفاع بيتحسب لوحده من نسبة الصورة. */
const SIZES = { sm: 'w-36', md: 'w-48 sm:w-60', lg: 'w-72' };

/** اللوجو الكامل: العلامة + FORSA + REAL ESTATE SOLUTIONS، على خلفيته البرتقالي. */
export const Logo: React.FC<LogoProps> = ({ onClick, className = '', size = 'md' }) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
    className={`inline-flex items-center shrink-0 cursor-pointer select-none group focus:outline-hidden ${className}`}
    aria-label="FORSA - Real Estate Solutions"
    dir="ltr"
  >
    <img
      src={LOGO_SRC}
      alt="FORSA — Real Estate Solutions"
      width={1062}
      height={306}
      className={`${SIZES[size]} h-auto shrink-0 rounded-lg transition-transform duration-200 group-hover:scale-105`}
    />
  </div>
);
