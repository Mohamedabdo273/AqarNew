import React from 'react';

/*
 * Small spot illustrations drawn in the brand palette. They inherit `currentColor` for lines,
 * use the accent (gold) for one highlight each, and a soft fill so they read on light and dark.
 */

type P = { className?: string };
const common = { viewBox: '0 0 64 64', fill: 'none', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

/** A form with a pen — "send your details". */
export const IlloForm: React.FC<P> = ({ className }) => (
  <svg {...common} className={className} stroke="currentColor">
    <rect x="12" y="8" width="32" height="44" rx="4" fill="currentColor" fillOpacity="0.08" />
    <path d="M19 19h18M19 26h18M19 33h11" />
    <path d="M40 44l12-12 4 4-12 12-5 1z" stroke="var(--color-accent-light)" fill="var(--color-accent-light)" fillOpacity="0.2" />
  </svg>
);

/** A contract under a magnifier — "we check the numbers". */
export const IlloReview: React.FC<P> = ({ className }) => (
  <svg {...common} className={className} stroke="currentColor">
    <rect x="10" y="8" width="30" height="40" rx="4" fill="currentColor" fillOpacity="0.08" />
    <path d="M17 18h16M17 25h16M17 32h9" />
    <circle cx="42" cy="40" r="10" stroke="var(--color-accent-light)" fill="var(--color-accent-light)" fillOpacity="0.15" />
    <path d="M49 47l7 7" stroke="var(--color-accent-light)" />
    <path d="M38 40l3 3 5-6" />
  </svg>
);

/** Two people — "we find a serious buyer". */
export const IlloPeople: React.FC<P> = ({ className }) => (
  <svg {...common} className={className} stroke="currentColor">
    <circle cx="22" cy="22" r="7" fill="currentColor" fillOpacity="0.08" />
    <path d="M9 50c1-9 6-14 13-14s12 5 13 14" fill="currentColor" fillOpacity="0.08" />
    <circle cx="43" cy="24" r="6" stroke="var(--color-accent-light)" fill="var(--color-accent-light)" fillOpacity="0.15" />
    <path d="M33 50c1-8 5-12 10-12s10 4 11 12" stroke="var(--color-accent-light)" />
  </svg>
);

/** A key over a small house — "transfer and get paid". */
export const IlloKeys: React.FC<P> = ({ className }) => (
  <svg {...common} className={className} stroke="currentColor">
    <path d="M10 30L28 14l18 16v20H10z" fill="currentColor" fillOpacity="0.08" />
    <path d="M23 50V38h10v12" />
    <circle cx="46" cy="40" r="7" stroke="var(--color-accent-light)" fill="var(--color-accent-light)" fillOpacity="0.2" />
    <path d="M51 45l6 6M54 48l-2 2" stroke="var(--color-accent-light)" />
  </svg>
);

/** An open empty box — for empty lists. */
export const IlloEmpty: React.FC<P> = ({ className }) => (
  <svg {...common} className={className} stroke="currentColor">
    <path d="M10 26l22-10 22 10v22L32 58 10 48z" fill="currentColor" fillOpacity="0.08" />
    <path d="M10 26l22 10 22-10M32 36v22" />
    <path d="M22 12l-6-6M42 12l6-6M32 10V3" stroke="var(--color-accent)" />
  </svg>
);
