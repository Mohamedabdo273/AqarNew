/** Single source for brand identity and contact details. Change here, it updates everywhere. */
export const BRAND = {
  nameAr: 'وحدتي',
  nameEn: 'Wahdety',
  taglineAr: 'مش قادر تكمّل الأقساط؟ بيع وحدتك واسترد فلوسك — حتى لو عليك متأخرات.',
  taglineEn: "Can't keep up with the instalments? Sell your unit and get your money back — even with arrears.",
  hotline: '19822',
  /** International format without "+" — used for wa.me links. Placeholder until the real number is set. */
  whatsapp: '201000000000',
  /** Platform fee charged to the buyer only, as % of the contract price, paid after the transfer is signed. */
  buyerFeePercent: 1.25,
  /** Prefix for listing / request codes shown to users. */
  codePrefix: 'WHD',
  /** Home hero background. Placeholder stock photo — swap for a real photo of a compound or one of our units. */
  /** People photos used around the site. Placeholder stock photos — replace with your own team and handovers. */
  peopleImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=70',
  keysImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=70',
  heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=70',
  /** Contact page details. Placeholders until the real ones are set — an empty value hides that line. */
  email: 'hello@wahdety.com',
  addressAr: 'القاهرة الجديدة، التجمع الخامس',
  addressEn: 'Fifth Settlement, New Cairo',
  /** Google Maps link for the office. Empty hides the "open in maps" button. */
  mapUrl: '',
  hoursAr: 'كل يوم من 10 الصبح لـ 10 بالليل',
  hoursEn: 'Every day, 10am–10pm',
};

/** Shown on the privacy policy and terms pages. Update whenever either text changes. */
export const LEGAL_UPDATED = '2026-09-24';

export const whatsappLink = (text?: string) =>
  `https://wa.me/${BRAND.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
