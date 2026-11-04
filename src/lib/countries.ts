/** Countries for the mobile code and the nationality. Egypt first: most visitors are Egyptian. */
export interface Country {
  /** ISO code: this is what gets saved as the nationality. */
  code: string;
  dial: string;
  ar: string;
  en: string;
  nationalityAr: string;
  nationalityEn: string;
}

export const COUNTRIES: Country[] = [
  { code: 'EG', dial: '20', ar: 'مصر', en: 'Egypt', nationalityAr: 'مصري', nationalityEn: 'Egyptian' },
  { code: 'SA', dial: '966', ar: 'السعودية', en: 'Saudi Arabia', nationalityAr: 'سعودي', nationalityEn: 'Saudi' },
  { code: 'AE', dial: '971', ar: 'الإمارات', en: 'UAE', nationalityAr: 'إماراتي', nationalityEn: 'Emirati' },
  { code: 'KW', dial: '965', ar: 'الكويت', en: 'Kuwait', nationalityAr: 'كويتي', nationalityEn: 'Kuwaiti' },
  { code: 'QA', dial: '974', ar: 'قطر', en: 'Qatar', nationalityAr: 'قطري', nationalityEn: 'Qatari' },
  { code: 'BH', dial: '973', ar: 'البحرين', en: 'Bahrain', nationalityAr: 'بحريني', nationalityEn: 'Bahraini' },
  { code: 'OM', dial: '968', ar: 'عُمان', en: 'Oman', nationalityAr: 'عُماني', nationalityEn: 'Omani' },
  { code: 'JO', dial: '962', ar: 'الأردن', en: 'Jordan', nationalityAr: 'أردني', nationalityEn: 'Jordanian' },
  { code: 'LB', dial: '961', ar: 'لبنان', en: 'Lebanon', nationalityAr: 'لبناني', nationalityEn: 'Lebanese' },
  { code: 'PS', dial: '970', ar: 'فلسطين', en: 'Palestine', nationalityAr: 'فلسطيني', nationalityEn: 'Palestinian' },
  { code: 'SY', dial: '963', ar: 'سوريا', en: 'Syria', nationalityAr: 'سوري', nationalityEn: 'Syrian' },
  { code: 'IQ', dial: '964', ar: 'العراق', en: 'Iraq', nationalityAr: 'عراقي', nationalityEn: 'Iraqi' },
  { code: 'YE', dial: '967', ar: 'اليمن', en: 'Yemen', nationalityAr: 'يمني', nationalityEn: 'Yemeni' },
  { code: 'SD', dial: '249', ar: 'السودان', en: 'Sudan', nationalityAr: 'سوداني', nationalityEn: 'Sudanese' },
  { code: 'LY', dial: '218', ar: 'ليبيا', en: 'Libya', nationalityAr: 'ليبي', nationalityEn: 'Libyan' },
  { code: 'TN', dial: '216', ar: 'تونس', en: 'Tunisia', nationalityAr: 'تونسي', nationalityEn: 'Tunisian' },
  { code: 'DZ', dial: '213', ar: 'الجزائر', en: 'Algeria', nationalityAr: 'جزائري', nationalityEn: 'Algerian' },
  { code: 'MA', dial: '212', ar: 'المغرب', en: 'Morocco', nationalityAr: 'مغربي', nationalityEn: 'Moroccan' },
  { code: 'US', dial: '1', ar: 'أمريكا / كندا', en: 'USA / Canada', nationalityAr: 'أمريكي / كندي', nationalityEn: 'American / Canadian' },
  { code: 'GB', dial: '44', ar: 'بريطانيا', en: 'United Kingdom', nationalityAr: 'بريطاني', nationalityEn: 'British' },
  { code: 'DE', dial: '49', ar: 'ألمانيا', en: 'Germany', nationalityAr: 'ألماني', nationalityEn: 'German' },
  { code: 'FR', dial: '33', ar: 'فرنسا', en: 'France', nationalityAr: 'فرنسي', nationalityEn: 'French' },
  { code: 'IT', dial: '39', ar: 'إيطاليا', en: 'Italy', nationalityAr: 'إيطالي', nationalityEn: 'Italian' },
];

export const DEFAULT_NATIONALITY = 'EG';
const EGYPT_DIAL = '20';

/**
 * A phone is kept the way the API stores it: Egyptian as 01xxxxxxxxx, any other as +<code><number>.
 * This splits it back into the code picker and the number box.
 */
export const splitPhone = (phone: string): { dial: string; local: string } => {
  if (!phone.startsWith('+')) return { dial: EGYPT_DIAL, local: phone };
  const digits = phone.slice(1);
  const dial = COUNTRIES.map((c) => c.dial)
    .filter((d) => digits.startsWith(d))
    .sort((a, b) => b.length - a.length)[0];
  return dial ? { dial, local: digits.slice(dial.length) } : { dial: EGYPT_DIAL, local: digits };
};

export const joinPhone = (dial: string, local: string): string => {
  const digits = local.replace(/\D/g, '');
  // Coming back to Egypt from another code, or typed without it: Egyptian numbers keep their leading 0.
  if (dial === EGYPT_DIAL) return digits && !digits.startsWith('0') ? `0${digits}` : digits;
  return `+${dial}${digits.replace(/^0+/, '')}`;
};
