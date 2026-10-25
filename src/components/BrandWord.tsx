import React from 'react';

/** Where the word sits: light page, navy background, or an orange pill. */
export type BrandTone = 'color' | 'onDark' | 'onAccent';

// The final badge reads on every background (white letters on its own orange), so all tones use it.
const SRC: Record<BrandTone, string> = {
  color: '/brand/deal-badge.svg?v=4',
  onDark: '/brand/deal-badge.svg?v=4',
  onAccent: '/brand/deal-badge.svg?v=4',
};

/** The DEAL logo standing in for the word "DEAL" inside a sentence — about one capital letter tall. */
export const BrandWord: React.FC<{ tone?: BrandTone; className?: string }> = ({ tone = 'color', className = '' }) => (
  <img
    src={SRC[tone]}
    alt="DEAL"
    width={688}
    height={237}
    className={`inline-block h-[1.15em] w-auto align-[-0.25em] mx-[0.15em] ${className}`}
  />
);

/** Swaps every "DEAL" in a piece of text for the logo; plain text stays as it is. */
export const withBrand = (text: string, tone: BrandTone = 'color'): React.ReactNode => {
  if (!text.includes('DEAL')) return text;
  return text.split(/(DEAL)/).map((part, i) => (part === 'DEAL' ? <BrandWord key={i} tone={tone} /> : part));
};
