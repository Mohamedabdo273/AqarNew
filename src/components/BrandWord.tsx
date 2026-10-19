import React from 'react';

/** Where the word sits: light page, navy background, or an orange pill. */
export type BrandTone = 'color' | 'onDark' | 'onAccent';

const SRC: Record<BrandTone, string> = {
  color: '/brand/deal-word.svg',
  onDark: '/brand/deal-word-white.svg',
  onAccent: '/brand/deal-word-mono.svg',
};

/** The DEAL logo standing in for the word "DEAL" inside a sentence — about one capital letter tall. */
export const BrandWord: React.FC<{ tone?: BrandTone; className?: string }> = ({ tone = 'color', className = '' }) => (
  <img
    src={SRC[tone]}
    alt="DEAL"
    width={515}
    height={202}
    className={`inline-block h-[0.95em] w-auto align-[-0.08em] mx-[0.12em] ${className}`}
  />
);

/** Swaps every "DEAL" in a piece of text for the logo; plain text stays as it is. */
export const withBrand = (text: string, tone: BrandTone = 'color'): React.ReactNode => {
  if (!text.includes('DEAL')) return text;
  return text.split(/(DEAL)/).map((part, i) => (part === 'DEAL' ? <BrandWord key={i} tone={tone} /> : part));
};
