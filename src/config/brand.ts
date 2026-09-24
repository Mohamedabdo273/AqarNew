/** Single source for brand identity and contact details. Change here, it updates everywhere. */
export const BRAND = {
  nameAr: 'وحدتي',
  nameEn: 'Wahdety',
  taglineAr: 'بيع وحدتك بفلوسك كاملة، أو اشتريها بسعر العقد القديم',
  taglineEn: 'Sell your unit with every pound back, or buy at the old contract price',
  hotline: '19822',
  /** International format without "+" — used for wa.me links. Placeholder until the real number is set. */
  whatsapp: '201000000000',
  /** Platform fee charged to the buyer only, as % of the contract price, paid after the transfer is signed. */
  buyerFeePercent: 1.25,
  /** Prefix for listing / request codes shown to users. */
  codePrefix: 'WHD',
};

/** Shown on the privacy policy and terms pages. Update whenever either text changes. */
export const LEGAL_UPDATED = '2026-09-24';

export const whatsappLink = (text?: string) =>
  `https://wa.me/${BRAND.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
