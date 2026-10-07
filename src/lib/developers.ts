export interface KnownCompound {
  ar: string;
  en: string;
}

export interface KnownDeveloper {
  id: string;
  nameAr: string;
  nameEn: string;
  tier?: 'Tier 1' | 'Tier 2';
  popular?: boolean;
  compounds: KnownCompound[];
}

export const KNOWN_DEVELOPERS: KnownDeveloper[] = [
  {
    id: 'palm-hills',
    nameAr: 'بالم هيلز للتعمير (Palm Hills)',
    nameEn: 'Palm Hills Developments',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'كمبوند بالم هيلز نيو كايرو', en: 'Palm Hills New Cairo' },
      { ar: 'كمبوند بادية (Badya)', en: 'Badya Palm Hills' },
      { ar: 'بالم هيلز أكتوبر', en: 'Palm Hills October' },
      { ar: 'بالم باركس (Palm Parks)', en: 'Palm Parks' },
      { ar: 'ذا كراون (The Crown)', en: 'The Crown' },
      { ar: 'هاسيندا باي / وايت / ويست', en: 'Hacienda Bay / White / West' },
      { ar: 'بامبو بالم هيلز', en: 'Bamboo Palm Hills' },
    ],
  },
  {
    id: 'sodic',
    nameAr: 'سوديك (SODIC)',
    nameEn: 'SODIC Developments',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'كمبوند فيليت سوديك (Villette)', en: 'Villette SODIC' },
      { ar: 'سوديك إيست (SODIC East)', en: 'SODIC East' },
      { ar: 'ألجريا (Allegria)', en: 'Allegria' },
      { ar: 'بيفرلي هيلز (Beverly Hills)', en: 'Beverly Hills' },
      { ar: 'أكتوبر بلازا (October Plaza)', en: 'October Plaza' },
      { ar: 'كارميل سوديك (Karmell)', en: 'Karmell New Zayed' },
      { ar: 'فاي سوديك (VYE SODIC)', en: 'VYE SODIC' },
      { ar: 'جون سوديك الساحل (June)', en: 'June SODIC' },
    ],
  },
  {
    id: 'emaar',
    nameAr: 'إعمار مصر (Emaar Misr)',
    nameEn: 'Emaar Misr',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'كمبوند ميفيدا التجمع (Mivida)', en: 'Mivida New Cairo' },
      { ar: 'أب تاون كايرو (Uptown Cairo)', en: 'Uptown Cairo' },
      { ar: 'مراسي الساحل الشمالي (Marassi)', en: 'Marassi North Coast' },
      { ar: 'كايرو جيت الشيخ زايد (Cairo Gate)', en: 'Cairo Gate' },
      { ar: 'سول الساحل الشمالي (SOUL)', en: 'SOUL North Coast' },
      { ar: 'بيل في الشيخ زايد (Belle Vie)', en: 'Belle Vie Sheikh Zayed' },
    ],
  },
  {
    id: 'mountain-view',
    nameAr: 'ماونتن فيو (Mountain View - DMG)',
    nameEn: 'Mountain View Developments',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'ماونتن فيو آي سيتي التجمع (iCity)', en: 'Mountain View iCity New Cairo' },
      { ar: 'ماونتن فيو آي سيتي أكتوبر (iCity)', en: 'Mountain View iCity October' },
      { ar: 'ماونتن فيو تشيل آوت بارك (Chillout Park)', en: 'Chillout Park' },
      { ar: 'ماونتن فيو هايد بارك (MV Hyde Park)', en: 'MV Hyde Park' },
      { ar: 'ماونتن فيو رأس الحكمة (Ras El Hekma)', en: 'Mountain View Ras El Hekma' },
      { ar: 'ماونتن فيو بلاج سيدي عبد الرحمن (Plage)', en: 'Plage Sidi Abdel Rahman' },
      { ar: 'ماونتن فيو 1 / 2 التجمع', en: 'Mountain View 1 & 2' },
      { ar: 'ماونتن فيو جيزة بلاتوه', en: 'Mountain View Giza Plateau' },
    ],
  },
  {
    id: 'tmg',
    nameAr: 'مجموعة طلعت مصطفى (TMG)',
    nameEn: 'Talaat Moustafa Group (TMG)',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'مدينتي (Madinaty)', en: 'Madinaty' },
      { ar: 'الرحاب (Rehab City)', en: 'Rehab City' },
      { ar: 'سيليا العاصمة الإدارية (Celia)', en: 'Celia New Capital' },
      { ar: 'مدينة نور (Noor City)', en: 'Noor City' },
      { ar: 'ساوث ميد الساحل (SouthMED)', en: 'SouthMED North Coast' },
      { ar: 'الربوة الشيخ زايد', en: 'Al Rabwa Sheikh Zayed' },
    ],
  },
  {
    id: 'ora',
    nameAr: 'أورا للتطوير (ORA Developers - ساويرس)',
    nameEn: 'ORA Developers (Naguib Sawiris)',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'زد إيست التجمع الخامس (ZED East)', en: 'ZED East New Cairo' },
      { ar: 'زد الشيخ زايد (ZED Towers)', en: 'ZED Zayed' },
      { ar: 'سيلفر ساندس الساحل الشمالي (Silversands)', en: 'Silversands North Coast' },
      { ar: 'سولانا الشيخ زايد (Solana)', en: 'Solana New Zayed' },
      { ar: 'بيراميدز هيلز (Pyramids Hills)', en: 'Pyramids Hills' },
    ],
  },
  {
    id: 'misr-italia',
    nameAr: 'مصر إيطاليا (Misr Italia)',
    nameEn: 'Misr Italia Properties',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'كمبوند البوسكو العاصمة (IL Bosco)', en: 'IL Bosco New Capital' },
      { ar: 'البوسكو سيتي المستقبل (IL Bosco City)', en: 'IL Bosco City Mostakbal' },
      { ar: 'فينشي العاصمة الإدارية (Vinci)', en: 'Vinci New Capital' },
      { ar: 'كاي السخنة (Kai Sokhna)', en: 'Kai Sokhna' },
      { ar: 'سولاري الساحل الشمالي (Solare)', en: 'Solare North Coast' },
      { ar: 'سيلا القاهرة الجديدة (Sila)', en: 'Sila New Cairo' },
    ],
  },
  {
    id: 'sabbour',
    nameAr: 'الأهلي صبور (Al Ahly Sabbour)',
    nameEn: 'Al Ahly Sabbour Developments',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'أمواج الساحل الشمالي (Amwaj)', en: 'Amwaj North Coast' },
      { ar: 'سمر رأس الحكمة (Summer)', en: 'Summer Ras El Hekma' },
      { ar: 'لافينير المستقبل سيتي (L\'Avenir)', en: 'L\'Avenir Mostakbal City' },
      { ar: 'كيفا 6 أكتوبر (Keeva)', en: 'Keeva 6th October' },
      { ar: 'جرين سكوير المستقبل', en: 'Green Square Mostakbal' },
      { ar: 'ذا سيتي أوف أوديسيا (Odyssia)', en: 'The City of Odyssia' },
      { ar: 'أتيكا العاصمة الإدارية', en: 'Atika New Capital' },
      { ar: 'جايا الساحل الشمالي (Gaia)', en: 'Gaia North Coast' },
    ],
  },
  {
    id: 'hyde-park',
    nameAr: 'هايد بارك للتطوير (Hyde Park)',
    nameEn: 'Hyde Park Developments',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'هايد بارك التجمع الخامس', en: 'Hyde Park New Cairo' },
      { ar: 'تاوني 6 أكتوبر (Tawny)', en: 'Tawny 6th October' },
      { ar: 'هايد بارك الساحل الشمالي (Ras El Hekma)', en: 'Hyde Park North Coast' },
      { ar: 'جاردن ليكس أكتوبر (Garden Lakes)', en: 'Garden Lakes' },
      { ar: 'سيشور الساحل الشمالي (Seashore)', en: 'Seashore North Coast' },
    ],
  },
  {
    id: 'madinet-masr',
    nameAr: 'مدينة مصر للإسكان (Madinet Masr)',
    nameEn: 'Madinet Masr (MNHD)',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'كمبوند تاج سيتي (Taj City)', en: 'Taj City' },
      { ar: 'كمبوند سراي (Sarai)', en: 'Sarai' },
      { ar: 'تاج سلطان (Taj Sultan)', en: 'Taj Sultan' },
      { ar: 'زهو أسيوط (Zaho)', en: 'Zaho Asyut' },
    ],
  },
  {
    id: 'hassan-allam',
    nameAr: 'حسن علام العقارية (Hassan Allam)',
    nameEn: 'Hassan Allam Properties',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'سوان ليك التجمع (Swan Lake)', en: 'Swan Lake Residences' },
      { ar: 'سوان ليك الجونة', en: 'Swan Lake El Gouna' },
      { ar: 'سوان ليك الساحل الشمالي', en: 'Swan Lake North Coast' },
      { ar: 'هاب تاون المستقبل (HAPTown)', en: 'HAPTown Mostakbal City' },
      { ar: 'سبرينجز الشروق (The Springs)', en: 'The Springs' },
      { ar: 'بارك فيو التجمع (Park View)', en: 'Park View' },
    ],
  },
  {
    id: 'tatweer-misr',
    nameAr: 'تطوير مصر (Tatweer Misr)',
    nameEn: 'Tatweer Misr',
    tier: 'Tier 1',
    popular: true,
    compounds: [
      { ar: 'المونت جلالة العين السخنة (IL Monte Galala)', en: 'IL Monte Galala' },
      { ar: 'فوكا باي الساحل (Fouka Bay)', en: 'Fouka Bay' },
      { ar: 'دي باي الساحل (D-Bay)', en: 'D-Bay North Coast' },
      { ar: 'بلوم فيلدز المستقبل (Bloomfields)', en: 'Bloomfields Mostakbal City' },
      { ar: 'سولت الساحل (Salt)', en: 'Salt North Coast' },
      { ar: 'ريفرز الشيخ زايد (Rivers)', en: 'Rivers Sheikh Zayed' },
    ],
  },
  {
    id: 'city-edge',
    nameAr: 'سيتي إيدج للتطوير (City Edge)',
    nameEn: 'City Edge Developments',
    tier: 'Tier 1',
    popular: false,
    compounds: [
      { ar: 'أبراج العلمين الجديدة (North Edge)', en: 'North Edge Towers' },
      { ar: 'المقصد العاصمة الإدارية (Al Maqsad)', en: 'Al Maqsad New Capital' },
      { ar: 'إيتابا الشيخ زايد (Etapa)', en: 'Etapa Sheikh Zayed' },
      { ar: 'زاهية المنصورة الجديدة (Zahya)', en: 'Zahya New Mansoura' },
      { ar: 'ماسبيرو بيزنس تاور (Maspero)', en: 'Maspero Business Tower' },
    ],
  },
  {
    id: 'la-vista',
    nameAr: 'لافيستا للتطوير (La Vista)',
    nameEn: 'La Vista Developments',
    tier: 'Tier 1',
    popular: false,
    compounds: [
      { ar: 'لافيستا سيتي العاصمة (La Vista City)', en: 'La Vista City' },
      { ar: 'لافيستا رأس الحكمة / باي / كاسكادا', en: 'La Vista Ras El Hekma / Bay' },
      { ar: 'الباتيوس الشيخ زايد / الشروق / التجمع', en: 'El Patio' },
      { ar: 'لافيستا العين السخنة (Ray / Topaz)', en: 'La Vista Sokhna' },
    ],
  },
  {
    id: 'new-giza',
    nameAr: 'نيو جيزة (New Giza)',
    nameEn: 'New Giza Developments',
    tier: 'Tier 1',
    popular: false,
    compounds: [
      { ar: 'كمبوند نيو جيزة (New Giza 6th October)', en: 'New Giza' },
      { ar: 'سيتي فيو (City View)', en: 'City View' },
      { ar: 'سي شيل الساحل الشمالي (Seashell)', en: 'Seashell' },
      { ar: 'بلايا الساحل الشمالي (Playa)', en: 'Playa Seashell' },
    ],
  },
  {
    id: 'marakez',
    nameAr: 'مراكز (Marakez - الحكير)',
    nameEn: 'Marakez Developments',
    tier: 'Tier 2',
    popular: false,
    compounds: [
      { ar: 'ديستريكت فايف التجمع (District 5)', en: 'District 5 New Cairo' },
      { ar: 'أيون الشيخ زايد (Aeon Towers)', en: 'Aeon Sheikh Zayed' },
      { ar: 'رامتان (Ramatan)', en: 'Ramatan' },
    ],
  },
  {
    id: 'dorra',
    nameAr: 'مجموعة درة (Dorra Group)',
    nameEn: 'Dorra Group',
    tier: 'Tier 2',
    popular: false,
    compounds: [
      { ar: 'ذا أدرس إيست التجمع (The Address East)', en: 'The Address East' },
      { ar: 'فيليج ويست زايد (Village West)', en: 'Village West Zayed' },
    ],
  },
  {
    id: 'inshaa-other',
    nameAr: 'مطور عقاري آخر / شركة استثمار عقاري',
    nameEn: 'Other Developer / Real Estate Company',
    tier: 'Tier 2',
    popular: false,
    compounds: [],
  },
];

/**
 * Returns matching developer or null.
 */
export const findDeveloper = (query: string): KnownDeveloper | undefined => {
  if (!query.trim()) return undefined;
  const q = query.trim().toLowerCase();
  return KNOWN_DEVELOPERS.find(
    (d) => d.nameAr.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q)
  );
};
