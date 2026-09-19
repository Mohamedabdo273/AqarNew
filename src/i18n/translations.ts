import { Language } from '../types';

export interface Translations {
  // Navigation & Topbar
  countryEgypt: string;
  countryKSA: string;
  countryUAE: string;
  soon: string;
  topbarTagline: string;
  brandSuggestionsBtn: string;
  home: string;
  sellUnit: string;
  opportunities: string;
  howItWorks: string;
  forInvestors: string;
  ourStory: string;
  contactUs: string;
  wantToBuy: string;
  sellGetCash: string;
  login: string;
  register: string;
  myAccount: string;
  logout: string;
  switchLang: string;
  switchLangLabel: string;
  noOverpriceBadge: string;

  // Hero
  heroBadge: string;
  heroHeadlinePrefix: string;
  heroHeadlineHighlight: string;
  heroHeadlineSuffix: string;
  heroSubheadline: string;
  searchPlaceholder: string;
  allRegions: string;
  allPropertyTypes: string;
  exploreOpportunities: string;
  calculateExit: string;
  statCashRefunded: string;
  statCashRefundedSub: string;
  statZeroOverprice: string;
  statZeroOverpriceSub: string;
  statOfficialTransfer: string;
  statOfficialTransferSub: string;
  statExitSpeed: string;
  statExitSpeedSub: string;

  // Value Difference & Comparison
  theProblemTitle: string;
  theProblemSub: string;
  sellerDilemmaTitle: string;
  buyerDilemmaTitle: string;
  developerCancellation: string;
  traditionalResale: string;
  platformSolution: string;
  comparisonTableTitle: string;
  comparisonTableSub: string;
  featureCol: string;
  devCancelCol: string;
  brokerCol: string;
  platformCol: string;
  compRow1Feature: string;
  compRow1Dev: string;
  compRow1Broker: string;
  compRow1Platform: string;
  compRow2Feature: string;
  compRow2Dev: string;
  compRow2Broker: string;
  compRow2Platform: string;
  compRow3Feature: string;
  compRow3Dev: string;
  compRow3Broker: string;
  compRow3Platform: string;
  compRow4Feature: string;
  compRow4Dev: string;
  compRow4Broker: string;
  compRow4Platform: string;
  compRow5Feature: string;
  compRow5Dev: string;
  compRow5Broker: string;
  compRow5Platform: string;

  // Calculator
  calcTitle: string;
  calcSub: string;
  calcContractPrice: string;
  calcPaidAmount: string;
  calcDeveloperName: string;
  calcRemainingYears: string;
  calcResultTitle: string;
  calcDevLossTitle: string;
  calcDevLossPenalty: string;
  calcDevLossDelay: string;
  calcBrokerTitle: string;
  calcBrokerFee: string;
  calcBrokerWait: string;
  calcPlatformTitle: string;
  calcPlatformCash: string;
  calcPlatformSpeed: string;
  calcStartExitBtn: string;
  calcTotalSaved: string;

  // Listings / Marketplace
  marketTitle: string;
  marketSub: string;
  filterSearch: string;
  filterRegion: string;
  filterType: string;
  filterDelivery: string;
  filterSort: string;
  sortSavings: string;
  sortCashLow: string;
  sortNewest: string;
  sortArea: string;
  unitPaidCash: string;
  unitRemaining: string;
  unitSavings: string;
  unitOriginalPrice: string;
  unitCurrentMarketPrice: string;
  unitInstallmentValue: string;
  unitDelivery: string;
  unitBedrooms: string;
  unitBathrooms: string;
  unitArea: string;
  unitVerifiedContract: string;
  unitTransferPolicy: string;
  unitViewDetails: string;
  unitSaveDeal: string;
  unitSaved: string;
  noUnitsFound: string;
  resetFilters: string;
  listingsBadge: string;
  listingsTitle: string;
  listingsSub: string;
  sortPaidCash: string;
  m2: string;
  bedrooms: string;
  paidCashLabel: string;
  remainingInstallments: string;
  marketPriceToday: string;
  buyerSavings: string;
  viewUnitDetails: string;

  // How It Works
  hiwTitle: string;
  hiwSub: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;

  // Auth Modal
  authModalTitle: string;
  authModalSub: string;
  tabLogin: string;
  tabRegister: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  roleLabel: string;
  roleSeller: string;
  roleBuyer: string;
  roleInvestor: string;
  rememberMe: string;
  forgotPassword: string;
  signInBtn: string;
  registerBtn: string;
  demoAccountsTitle: string;
  tryAsSeller: string;
  tryAsBuyer: string;
  tryAsInvestor: string;
  orContinueWith: string;
  socialGoogle: string;
  termsAgree: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  loginSuccess: string;
  registerSuccess: string;
  logoutSuccess: string;

  // Profile Modal
  profileTitle: string;
  tabProfileInfo: string;
  tabMyUnits: string;
  tabSavedUnits: string;
  tabInquiries: string;
  accountRole: string;
  registeredDate: string;
  statusUnderReview: string;
  statusVerified: string;
  statusCompleted: string;
  noSavedUnits: string;
  noListedUnits: string;
  noInquiries: string;
  addUnitNow: string;
  browseUnitsNow: string;
  consultationWithLegal: string;
  scheduleMeeting: string;

  // Common & Footer
  egp: string;
  sqm: string;
  years: string;
  months: string;
  days: string;
  perQuarter: string;
  perMonth: string;
  verifiedOfficial: string;
  allRightsReserved: string;
  contactUsNow: string;
  directWhatsApp: string;
  hotlineText: string;
  close: string;
  submit: string;
  cancel: string;
  loading: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    // Navigation & Topbar
    countryEgypt: 'مصر',
    countryKSA: 'السعودية',
    countryUAE: 'الإمارات',
    soon: 'قريبًا',
    topbarTagline: 'منصة التنازل عن وحدات التقسيط بدون أوفر — البايع يسترجع فلوسه كاش، والمشتري ياخد سعر زمان.',
    brandSuggestionsBtn: 'اقتراحات الأسماء (6 بدائل)',
    home: 'الرئيسية',
    sellUnit: 'بيع وحدتك',
    opportunities: 'الفرص المتاحة',
    howItWorks: 'إزاي بنشتغل',
    forInvestors: 'للمستثمرين',
    ourStory: 'قصتنا',
    contactUs: 'كلمنا',
    wantToBuy: 'عايز تشتري',
    sellGetCash: 'بيع وحدتك (استرد كاش)',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    myAccount: 'حسابي',
    logout: 'تسجيل الخروج',
    switchLang: 'English',
    switchLangLabel: 'تغيير اللغة إلى الإنجليزية',
    noOverpriceBadge: 'بدون أوفر برايس • خروج رسمي',

    // Hero
    heroBadge: 'المنصة الأولى المعتمدة للتنازل العقاري الآمن في مصر',
    heroHeadlinePrefix: 'تخلّص من عبء الأقساط.. ',
    heroHeadlineHighlight: 'واسترد 100% من كاشك',
    heroHeadlineSuffix: ' بدون أوفر وبإجراءات المطور الرسمية',
    heroSubheadline: 'بديل فسخ العقد وغرامة الـ 15%، وبديل ركود السماسرة. البائع يسترد كل جنيه دفعه كاش، والمشتري يشتري عقد قديم بسعر 2023 ويكمل نفس الأقساط.',
    searchPlaceholder: 'ابحث باسم الكمبوند أو المطور (بالم هيلز، سوديك، إعمار...)...',
    allRegions: 'جميع المناطق',
    allPropertyTypes: 'كل أنواع الوحدات',
    exploreOpportunities: 'تصفح الفرص بدون أوفر',
    calculateExit: 'احسب قيمة استردادك كاش',
    statCashRefunded: '+450 مليون ج.م',
    statCashRefundedSub: 'كاش تم استرداده للبائعين بالكامل',
    statZeroOverprice: '0% أوفر برايس',
    statZeroOverpriceSub: 'البيع بقيمة المدفوع فقط للمشتري',
    statOfficialTransfer: '100% تنازل رسمي',
    statOfficialTransferSub: 'بمقر المطور مع نقل الشيكات المؤجلة',
    statExitSpeed: '11 يوم فقط',
    statExitSpeedSub: 'متوسط مدة توفيق المشتري واستلام الكاش',

    // Value Difference & Comparison
    theProblemTitle: 'لماذا يحتاج السوق المصري حلاً جذرياً الآن؟',
    theProblemSub: 'مع الارتفاعات المتتالية للأقساط وتعويم الجنيه، أصبح آلاف الملاك عالقين بين خيارين كلاهما خسارة: فسخ العقد مع المطور أو انتظار شهور مع السماسرة.',
    sellerDilemmaTitle: 'معادلة البائع العالق',
    buyerDilemmaTitle: 'فرصة المشتري الذكي',
    developerCancellation: 'فسخ العقد مع المطور',
    traditionalResale: 'الريسيل التقليدي والسماسرة',
    platformSolution: 'منظومة التنازل الآمن (الحل المبتكر)',
    comparisonTableTitle: 'مقارنة حاسمة: أين تذهب أموالك وحقوقك؟',
    comparisonTableSub: 'شفافية كاملة توضح الفارق الجذري بين مسارات الخروج العقاري المتاحة أمامك اليوم.',
    featureCol: 'وجه المقارنة',
    devCancelCol: 'فسخ العقد مع المطور',
    brokerCol: 'الريسيل التقليدي (السمسار)',
    platformCol: 'منصة التنازل الآمن',
    compRow1Feature: 'استرداد المبلغ المدفوع',
    compRow1Dev: 'خصم غرامة 10% إلى 15% من إجمالي قيمة العقد كاملة!',
    compRow1Broker: 'تطلب أوفر وتنتظر شهور، وغالباً لن تجد مشترياً',
    compRow1Platform: 'استرداد 100% من المدفوع الفعلي كاش بالكامل بدون أي خصم',
    compRow2Feature: 'سرعة استلام الكاش',
    compRow2Dev: 'تأخير من 6 إلى 12 شهراً حتى إعادة بيع الوحدة',
    compRow2Broker: 'غير مضمونة، تمتد من 4 إلى 9 شهور من التفاوض العقيم',
    compRow2Platform: 'متوسط 11 إلى 18 يوماً فقط مع تسليم الشيك المصرفي فوراً',
    compRow3Feature: 'مصير الشيكات البنكية',
    compRow3Dev: 'تبقى مرهونة لدى المطور حتى اكتمال إجراءات الفسخ',
    compRow3Broker: 'مخاطرة بالتوكيلات بدون إبراء ذمة بنكي فوري',
    compRow3Platform: 'استرداد كافة الشيكات المؤجلة وتوقيع مخالصة تامة بمقر المطور',
    compRow4Feature: 'العمولة والمصاريف',
    compRow4Dev: 'خسارة مئات الآلاف تحت بند "مصاريف إدارية وتسويقية"',
    compRow4Broker: '2.5% عمولة سمسار + طلب تخفيض السعر باستمرار',
    compRow4Platform: '0% عمولة على البائع المتعثر — المنصة تحمي أموالك',
    compRow5Feature: 'موقف المشتري الجديد',
    compRow5Dev: 'يشتري من المطور بأسعار 2026 التضخمية العالية',
    compRow5Broker: 'يدفع أوفر برايس مبالغ فيه وفوائد غير مبررة',
    compRow5Platform: 'يشتري بسعر العقد القديم (2022-2023) وبدون مليم أوفر',

    // Calculator
    calcTitle: 'حاسبة الخروج الآمن واسترداد الكاش',
    calcSub: 'اكتشف بالأرقام الدقيقة كم ستخسر إذا فسخت العقد مع المطور، وكم ستسترد كاش فورياً عبر التنازل الموثق.',
    calcContractPrice: 'سعر الوحدة الإجمالي في العقد الأصلي (ج.م)',
    calcPaidAmount: 'إجمالي المبلغ الذي دفعته كاش حتى الآن (ج.م)',
    calcDeveloperName: 'شركة التطوير العقاري',
    calcRemainingYears: 'عدد سنوات الأقساط المتبقية',
    calcResultTitle: 'التقرير المالي المقارن لموقفك',
    calcDevLossTitle: 'خيار 1: الفسخ مع المطور (خسارة مؤلمة)',
    calcDevLossPenalty: 'غرامة فسخ مخصومة فوراً (15% من العقد):',
    calcDevLossDelay: 'فترة الانتظار لاسترداد المتبقي: 9-12 شهر',
    calcBrokerTitle: 'خيار 2: الريسيل التقليدي (مخاطرة وركود)',
    calcBrokerFee: 'عمولة سمسار متوقعة (2.5%):',
    calcBrokerWait: 'وقت مهدور في طلب أوفر برايس وسط ركود السوق: 6-8 شهور',
    calcPlatformTitle: 'خيار 3: التنازل الآمن (حماية 100% لأموالك)',
    calcPlatformCash: 'صافي الكاش المسترد للبائع بدون خصم:',
    calcPlatformSpeed: 'سرعة التوفيق: 11 يوماً بالمتوسط',
    calcStartExitBtn: 'ابدأ طلب التنازل واسترداد الكاش الآن',
    calcTotalSaved: 'إجمالي ما تحميه من الضياع عبر المنصة:',

    // Listings
    marketTitle: 'سوق الفرص العقارية (عقود قديمة • 0% أوفر برايس)',
    marketSub: 'وحدات مفحوصة وموثقة قانونياً. يدفع المشتري فقط ما سدده المالك السابق، ويكمل الأقساط للمطور بنفس أسعار وجداول زمان.',
    filterSearch: 'بحث بالاسم أو الكمبوند...',
    filterRegion: 'المنطقة',
    filterType: 'نوع العقار',
    filterDelivery: 'موعد الاستلام',
    filterSort: 'ترتيب حسب',
    sortSavings: 'أعلى توفير عن سعر اليوم',
    sortCashLow: 'أقل كاش مطلوب للمالك',
    sortNewest: 'الأحدث طرحاً',
    sortArea: 'المساحة الأكبر',
    unitPaidCash: 'الكاش المطلوب للمالك:',
    unitRemaining: 'المتبقي أقساط للمطور:',
    unitSavings: 'توفير فوري عن سعر المطور اليوم:',
    unitOriginalPrice: 'سعر العقد الأصلي:',
    unitCurrentMarketPrice: 'سعر نفس الوحدة لدى المطور اليوم:',
    unitInstallmentValue: 'قيمة القسط:',
    unitDelivery: 'الاستلام:',
    unitBedrooms: 'غرف',
    unitBathrooms: 'حمامات',
    unitArea: 'م²',
    unitVerifiedContract: 'عقد موثق ومفحوص قانونياً',
    unitTransferPolicy: 'رسوم التنازل:',
    unitViewDetails: 'تفاصيل الصفقة',
    unitSaveDeal: 'حفظ الصفقة',
    unitSaved: 'تم الحفظ',
    noUnitsFound: 'لا توجد وحدات تطابق هذه الفلاتر حالياً.',
    resetFilters: 'إعادة ضبط الفلاتر',
    listingsBadge: 'فرص حصرية معتمدة',
    listingsTitle: 'تصفح أحدث صفقات التنازل',
    listingsSub: 'وحدات مفحوصة وموثقة قانونياً بعقود قديمة وبدون أوفر برايس إطلاقاً',
    sortPaidCash: 'أقل كاش مطلوب للمالك',
    m2: 'م²',
    bedrooms: 'غرف نوم',
    paidCashLabel: 'الكاش المطلوب للمالك الآن:',
    remainingInstallments: 'المتبقي أقساط للمطور',
    marketPriceToday: 'سعر الوحدة لدى المطور اليوم',
    buyerSavings: 'توفير فوري للمشتري',
    viewUnitDetails: 'تفاصيل الصفقة والفحص',

    // How It Works
    hiwTitle: 'كيف تتم عملية التنازل الرسمية في 5 خطوات؟',
    hiwSub: 'إجراءات قانونية وبنكية محكمة 100% داخل المقر الرسمي للمطور العقاري، تضمن سلامة البائع والمشتري دون ثغرات.',
    step1Title: '1. مراجعة كشف الحساب والموقف المالي',
    step1Desc: 'فحص إيصالات السداد وكشف الحساب البنكي للتأكد من عدم وجود متأخرات أو غرامات معلقة لدى المطور.',
    step2Title: '2. التدقيق القانوني وصياغة اتفاقية التنازل',
    step2Desc: 'مراجعة شروط عقد البيع الابتدائي للتأكد من أحقية التنازل ومعرفة لائحة رسوم نقل الملكية المعتمدة.',
    step3Title: '3. توفيق المشتري وتجميد الوحدة',
    step3Desc: 'مطابقة الوحدة مع شبكة المشترين والمستثمرين الجاهزين فوراً بالكاش بدون مساومة على السعر.',
    step4Title: '4. جلسة التنازل الرسمية بمقر المطور',
    step4Desc: 'حضور الطرفين أمام الإدارة العقارية للمطور، وتوقيع ملحق العقد الرسمي ونقل الملكية باسم المشتري الجديد.',
    step5Title: '5. استرداد الشيكات المؤجلة وتسليم الشيك المصرفي',
    step5Desc: 'تسليم البائع شيكاً مصرفياً معتمداً بكامل أمواله، واسترداد كافة الشيكات المؤجلة المسلمة للمطور مع مخالصة بنكية تامة.',

    // Auth Modal
    authModalTitle: 'تسجيل الدخول إلى المنصة',
    authModalSub: 'إدارة طلبات التنازل، متابعة الصفقات المحفوظة، والتواصل مع المستشار القانوني.',
    tabLogin: 'تسجيل الدخول',
    tabRegister: 'إنشاء حساب جديد',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    confirmPasswordLabel: 'تأكيد كلمة المرور',
    fullNameLabel: 'الاسم بالكامل',
    fullNamePlaceholder: 'أحمد محمود',
    phoneLabel: 'رقم الهاتف / الواتساب',
    phonePlaceholder: '01012345678',
    roleLabel: 'أنا أسجل بصفتي:',
    roleSeller: 'بائع وحدة (أرغب في الخروج واسترداد الكاش)',
    roleBuyer: 'مشتري (أبحث عن وحدة بدون أوفر بسعر زمان)',
    roleInvestor: 'مستثمر (أبحث عن صفقات فورية وعائد سريع)',
    rememberMe: 'تذكر بياناتي',
    forgotPassword: 'نسيت كلمة المرور؟',
    signInBtn: 'تسجيل الدخول',
    registerBtn: 'إنشاء الحساب الآن',
    demoAccountsTitle: 'تجربة سريعة بدون إدخال بيانات (حسابات تجريبية):',
    tryAsSeller: 'دخول كـ بائع',
    tryAsBuyer: 'دخول كـ مشتري',
    tryAsInvestor: 'دخول كـ مستثمر',
    orContinueWith: 'أو الاستمرار عبر',
    socialGoogle: 'جوجل (Google)',
    termsAgree: 'بإنشاء الحساب أنت توافق على شروط الخدمة وسياسة الخصوصية وسرية بيانات العقود.',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب حتى الآن؟',
    loginSuccess: 'تم تسجيل الدخول بنجاح! أهلاً بك.',
    registerSuccess: 'تم إنشاء حسابك بنجاح! أهلاً بك في المنصة.',
    logoutSuccess: 'تم تسجيل الخروج بنجاح.',

    // Profile Modal
    profileTitle: 'لوحة التحكم وحسابي',
    tabProfileInfo: 'البيانات الشخصية',
    tabMyUnits: 'وحداتي المعروضة',
    tabSavedUnits: 'الصفقات المحفوظة',
    tabInquiries: 'استشاراتي وطلباتي',
    accountRole: 'نوع الحساب:',
    registeredDate: 'تاريخ الانضمام:',
    statusUnderReview: 'قيد التدقيق والفحص',
    statusVerified: 'موثقة وجاهزة للتنازل',
    statusCompleted: 'تم التنازل واسترداد الكاش',
    noSavedUnits: 'لم تقم بحفظ أي وحدات في المفضلة بعد.',
    noListedUnits: 'ليس لديك وحدات معروضة للتنازل حالياً.',
    noInquiries: 'لا توجد طلبات استشارة نشطة.',
    addUnitNow: 'اعرض وحدتك للتنازل واسترد كاشك',
    browseUnitsNow: 'تصفح الفرص المتاحة بدون أوفر',
    consultationWithLegal: 'استشارة مع المستشار القانوني',
    scheduleMeeting: 'تحديد موعد جلسة تنازل',

    // Common & Footer
    egp: 'ج.م',
    sqm: 'م²',
    years: 'سنوات',
    months: 'شهور',
    days: 'أيام',
    perQuarter: 'كل ربع سنة',
    perMonth: 'شهرياً',
    verifiedOfficial: 'موثق رسمياً',
    allRightsReserved: 'جميع الحقوق محفوظة © منصة تنازل لحلول الخروج العقاري الآمن.',
    contactUsNow: 'تواصل معنا الآن',
    directWhatsApp: 'واتساب فوري',
    hotlineText: 'الخط الساخن: 19822',
    close: 'إغلاق',
    submit: 'إرسال',
    cancel: 'إلغاء',
    loading: 'جاري التحميل...'
  },

  en: {
    // Navigation & Topbar
    countryEgypt: 'Egypt',
    countryKSA: 'Saudi Arabia',
    countryUAE: 'UAE',
    soon: 'Soon',
    topbarTagline: 'Safe Real Estate Contract Exit & Installment Transfers at 0% Overprice — Sellers get 100% cash back, buyers secure original contract pricing.',
    brandSuggestionsBtn: 'Brand Name Ideas (6 Alternatives)',
    home: 'Home',
    sellUnit: 'Sell Your Unit',
    opportunities: 'Available Deals',
    howItWorks: 'How It Works',
    forInvestors: 'For Investors',
    ourStory: 'Our Story',
    contactUs: 'Contact Us',
    wantToBuy: 'Want to Buy',
    sellGetCash: 'Sell Unit (Get Cash)',
    login: 'Log In',
    register: 'Sign Up',
    myAccount: 'My Account',
    logout: 'Log Out',
    switchLang: 'العربية',
    switchLangLabel: 'Switch language to Arabic',
    noOverpriceBadge: 'Zero Overprice • Official Developer Transfer',

    // Hero
    heroBadge: 'Egypt\'s Premier Platform for Safe Real Estate Contract Exits',
    heroHeadlinePrefix: 'Escape the Installment Burden.. ',
    heroHeadlineHighlight: 'And Recover 100% of Your Cash',
    heroHeadlineSuffix: ' with 0% Overprice and Official Developer Transfer',
    heroSubheadline: 'The trusted alternative to developer cancellation fines (up to 15%) and traditional broker stagnation. Sellers recover every pound paid in cash, while buyers inherit original 2023 pricing and existing installment schedules.',
    searchPlaceholder: 'Search by compound or developer (Palm Hills, SODIC, Emaar...)...',
    allRegions: 'All Regions',
    allPropertyTypes: 'All Property Types',
    exploreOpportunities: 'Explore Zero-Overprice Deals',
    calculateExit: 'Calculate Your Cash Exit',
    statCashRefunded: 'EGP 450M+',
    statCashRefundedSub: 'Total cash refunded to sellers in full',
    statZeroOverprice: '0% Overprice',
    statZeroOverpriceSub: 'Buyers pay only what the seller paid',
    statOfficialTransfer: '100% Official Transfer',
    statOfficialTransferSub: 'Signed at the developer\'s HQ with check returns',
    statExitSpeed: '11 Days Avg.',
    statExitSpeedSub: 'Average time to match buyers & receive cash',

    // Value Difference & Comparison
    theProblemTitle: 'Why Does the Market Need a Radical Solution Now?',
    theProblemSub: 'With consecutive currency devaluations and soaring installment weights, thousands of owners find themselves trapped between developer cancellation penalties and months of broker indifference.',
    sellerDilemmaTitle: 'The Trapped Seller\'s Dilemma',
    buyerDilemmaTitle: 'The Smart Buyer\'s Arbitrage',
    developerCancellation: 'Developer Contract Cancellation',
    traditionalResale: 'Traditional Resale & Brokers',
    platformSolution: 'Safe Exit Platform (The Proven Solution)',
    comparisonTableTitle: 'Decisive Comparison: Where Do Your Rights Go?',
    comparisonTableSub: 'Full transparency highlighting the stark difference between your exit pathways today.',
    featureCol: 'Feature / Comparison Point',
    devCancelCol: 'Developer Cancellation',
    brokerCol: 'Traditional Broker Resale',
    platformCol: 'Safe Exit Platform',
    compRow1Feature: 'Paid Cash Refund',
    compRow1Dev: '10% to 15% penalty deducted from the TOTAL contract value!',
    compRow1Broker: 'They demand unrealistic overprice and leave you waiting for months',
    compRow1Platform: '100% recovery of all actual cash paid with zero penalty deductions',
    compRow2Feature: 'Speed of Receiving Cash',
    compRow2Dev: 'Delayed 6 to 12 months until developer resells the unit',
    compRow2Broker: 'Uncertain, dragging out 4 to 9 months of exhausting haggling',
    compRow2Platform: 'Average 11 to 18 days with certified cashier checks handed over',
    compRow3Feature: 'Bank Checks Fate',
    compRow3Dev: 'Held hostage by the developer until cancellation procedures conclude',
    compRow3Broker: 'Severe legal exposure with power of attorney without bank discharge',
    compRow3Platform: 'All pending checks returned with formal bank discharge at developer HQ',
    compRow4Feature: 'Broker Commissions & Fees',
    compRow4Dev: 'Hundreds of thousands lost under "administrative & marketing costs"',
    compRow4Broker: '2.5% broker fee + persistent pressure to slash your price',
    compRow4Platform: '0% commission on the distressed seller — the platform safeguards your capital',
    compRow5Feature: 'New Buyer\'s Position',
    compRow5Dev: 'Buys at hyper-inflated 2026 developer prices with new margins',
    compRow5Broker: 'Pays inflated overprice and unjustified extra premiums',
    compRow5Platform: 'Buys at original contract price (2022-2023) with ZERO overprice',

    // Calculator
    calcTitle: 'Safe Exit & Cash Recovery Calculator',
    calcSub: 'Discover the exact figures: what you stand to lose by cancelling with the developer versus what you recover immediately through verified assignment.',
    calcContractPrice: 'Total Original Contract Price (EGP)',
    calcPaidAmount: 'Total Cash Amount Paid to Date (EGP)',
    calcDeveloperName: 'Developer Company Name',
    calcRemainingYears: 'Remaining Installment Years',
    calcResultTitle: 'Comparative Financial Breakdown',
    calcDevLossTitle: 'Option 1: Developer Cancellation (Painful Loss)',
    calcDevLossPenalty: 'Penalty deducted immediately (15% of contract):',
    calcDevLossDelay: 'Waiting period for remaining refund: 9-12 months',
    calcBrokerTitle: 'Option 2: Traditional Resale (High Risk & Stagnation)',
    calcBrokerFee: 'Expected broker commission (2.5%):',
    calcBrokerWait: 'Wasted time demanding an overprice in a sluggish market: 6-8 months',
    calcPlatformTitle: 'Option 3: Safe Exit Platform (100% Capital Protection)',
    calcPlatformCash: 'Net cash refunded to seller with zero deduction:',
    calcPlatformSpeed: 'Average matching speed: 11 business days',
    calcStartExitBtn: 'Initiate Exit Request & Claim Cash Now',
    calcTotalSaved: 'Total Capital Protected from Loss:',

    // Listings
    marketTitle: 'Verified Marketplace (Original Contracts • 0% Overprice)',
    marketSub: 'Legally audited units. The buyer only reimburses the seller for what was paid, continuing existing installments at previous developer pricing.',
    filterSearch: 'Search by unit name or compound...',
    filterRegion: 'Region',
    filterType: 'Property Type',
    filterDelivery: 'Delivery Date',
    filterSort: 'Sort by',
    sortSavings: 'Highest Savings vs. Today\'s Price',
    sortCashLow: 'Lowest Cash Required for Seller',
    sortNewest: 'Recently Added',
    sortArea: 'Largest Area',
    unitPaidCash: 'Cash Required for Seller:',
    unitRemaining: 'Remaining Installments to Developer:',
    unitSavings: 'Instant Savings vs. Developer Current Price:',
    unitOriginalPrice: 'Original Contract Price:',
    unitCurrentMarketPrice: 'Current Developer Price for Same Unit:',
    unitInstallmentValue: 'Installment Value:',
    unitDelivery: 'Delivery:',
    unitBedrooms: 'Beds',
    unitBathrooms: 'Baths',
    unitArea: 'sqm',
    unitVerifiedContract: 'Verified Contract & Clean Audit',
    unitTransferPolicy: 'Assignment Fee:',
    unitViewDetails: 'View Deal Details',
    unitSaveDeal: 'Bookmark Deal',
    unitSaved: 'Saved',
    noUnitsFound: 'No units currently match your selected filters.',
    resetFilters: 'Reset Filters',
    listingsBadge: 'Verified Exclusive Deals',
    listingsTitle: 'Explore Latest Assignment Deals',
    listingsSub: 'Legally audited units with original contract pricing and 0% overprice',
    sortPaidCash: 'Lowest Cash to Seller',
    m2: 'sqm',
    bedrooms: 'Bedrooms',
    paidCashLabel: 'Cash required for seller now:',
    remainingInstallments: 'Remaining developer installments',
    marketPriceToday: 'Developer price today',
    buyerSavings: 'Instant Buyer Savings',
    viewUnitDetails: 'View Deal & Audit Details',

    // How It Works
    hiwTitle: 'How Does the Official Assignment Work in 5 Steps?',
    hiwSub: '100% legally and financially backed protocols conducted at the developer headquarters, safeguarding both parties without loopholes.',
    step1Title: '1. Financial Statement & Audit',
    step1Desc: 'Review payment receipts and bank statements to confirm no overdue installments, penalties, or developer liens exist.',
    step2Title: '2. Legal Due Diligence & Transfer Draft',
    step2Desc: 'Verify preliminary sale contracts for assignment eligibility and determine exact transfer fee schedules with the developer.',
    step3Title: '3. Buyer Matching & Unit Reservation',
    step3Desc: 'Match the unit with ready cash buyers and accredited investors without price haggling or unnecessary delays.',
    step4Title: '4. Official Assignment at Developer HQ',
    step4Desc: 'Both parties sign official contract annexes before developer legal counsel, transferring complete title to the new buyer.',
    step5Title: '5. Postdated Checks Return & Cash Receipt',
    step5Desc: 'Seller receives certified cashier checks for the full paid amount, recovers all unused bank checks, and receives full discharge.',

    // Auth Modal
    authModalTitle: 'Log in to the Platform',
    authModalSub: 'Manage exit requests, track bookmarked opportunities, and consult with our legal advisors.',
    tabLogin: 'Log In',
    tabRegister: 'Create Account',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    confirmPasswordLabel: 'Confirm Password',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Ahmed Mahmoud',
    phoneLabel: 'Phone / WhatsApp Number',
    phonePlaceholder: '+20 1012345678',
    roleLabel: 'I am registering as:',
    roleSeller: 'Unit Seller (Want to exit and recover cash)',
    roleBuyer: 'Buyer (Looking for zero-overprice deals at past prices)',
    roleInvestor: 'Investor (Seeking immediate equity & high IRR)',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signInBtn: 'Sign In',
    registerBtn: 'Create Account Now',
    demoAccountsTitle: 'One-Click Instant Demo Accounts (Test in 1 sec):',
    tryAsSeller: 'Demo as Seller',
    tryAsBuyer: 'Demo as Buyer',
    tryAsInvestor: 'Demo as Investor',
    orContinueWith: 'Or continue with',
    socialGoogle: 'Google',
    termsAgree: 'By creating an account, you agree to our Terms of Service, Privacy Policy, and Contract Confidentiality.',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account yet?',
    loginSuccess: 'Successfully logged in! Welcome back.',
    registerSuccess: 'Account created successfully! Welcome to the platform.',
    logoutSuccess: 'You have been logged out.',

    // Profile Modal
    profileTitle: 'User Account & Dashboard',
    tabProfileInfo: 'Profile Details',
    tabMyUnits: 'My Listed Units',
    tabSavedUnits: 'Saved Deals',
    tabInquiries: 'My Requests & Consultations',
    accountRole: 'Account Role:',
    registeredDate: 'Member Since:',
    statusUnderReview: 'Under Review & Audit',
    statusVerified: 'Verified & Listed for Exit',
    statusCompleted: 'Exit Completed & Cash Received',
    noSavedUnits: 'You haven\'t bookmarked any deals yet.',
    noListedUnits: 'You have no active units listed for exit.',
    noInquiries: 'No active consultation requests.',
    addUnitNow: 'List Your Unit for Exit & Claim Cash',
    browseUnitsNow: 'Explore Available Deals with 0% Overprice',
    consultationWithLegal: 'Consult with Legal Counsel',
    scheduleMeeting: 'Schedule Assignment Session',

    // Common & Footer
    egp: 'EGP',
    sqm: 'm²',
    years: 'years',
    months: 'months',
    days: 'days',
    perQuarter: 'Quarterly',
    perMonth: 'Monthly',
    verifiedOfficial: 'Officially Verified',
    allRightsReserved: 'All rights reserved © Tanazul Platform for Safe Real Estate Contract Exits.',
    contactUsNow: 'Contact Us Now',
    directWhatsApp: 'Direct WhatsApp',
    hotlineText: 'Hotline: 19822',
    close: 'Close',
    submit: 'Submit',
    cancel: 'Cancel',
    loading: 'Loading...'
  }
};
