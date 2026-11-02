/**
 * Internationalization (i18n) Translations
 * Streamlined exclusively to English & Korean for optimal performance & token efficiency
 */

export type AppLanguage = 'en' | 'ko' | 'kh' | 'km' | 'de' | 'fr' | 'zh';

export interface LanguageMeta {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: 'global' | 'east_asia';
  regionLabel: string;
  currency: string;
  currencySymbol: string;
  rateToUsd: number;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'km',
    name: 'Khmer (ភាសាខ្មែរ)',
    nativeName: 'ភាសាខ្មែរ',
    flag: '🇰🇭',
    region: 'global',
    regionLabel: 'Cambodia / National',
    currency: 'KHR',
    currencySymbol: '៛',
    rateToUsd: 4030,
  },
  {
    code: 'en',
    name: 'English (International)',
    nativeName: 'English',
    flag: '🌐',
    region: 'global',
    regionLabel: 'Global / International',
    currency: 'USD',
    currencySymbol: '$',
    rateToUsd: 1.0,
  },
  {
    code: 'ko',
    name: 'Korean (한국어)',
    nativeName: '한국어',
    flag: '🇰🇷',
    region: 'east_asia',
    regionLabel: 'East Asia / Korea',
    currency: 'KRW',
    currencySymbol: '₩',
    rateToUsd: 1380,
  },
];

export interface TranslationDictionary {
  // Navigation
  navHome: string;
  navPassport: string;
  navMap: string;
  navInventory: string;
  navAdmin: string;
  navPackaging: string;
  navPitchDeck: string;
  navFarmer: string;
  navOnboarding: string;
  protocolTitle: string;
  startVideoGuide: string;
  login: string;
  logout: string;
  demoStudio: string;

  // Digital Passport & Product fields
  passportTitle: string;
  passportSubtitle: string;
  authenticTitle: string;
  authenticSubtitle: string;
  lotCode: string;
  netWeight: string;
  mfdDate: string;
  expDate: string;
  originCountry: string;
  eudrBadge: string;
  fullDeclaration: string;
  cashews: string;
  naturalSugar: string;
  seaSalt: string;
  kampotPepper: string;
  nutritionFacts: string;
  protein: string;
  totalFat: string;
  carbs: string;
  sugars: string;
  fiber: string;
  sodium: string;
  allergenWarning: string;
  allergenDetails: string;
  storageWarning: string;
  manufacturerExporter: string;
  factoryPhnomPenh: string;
  farmersKampongThom: string;
  scanVerification: string;
  verifiedGpsStory: string;
  viewMap: string;
  printQr: string;
  sharePassport: string;
  close: string;

  // Product names
  productPepperCashew: string;
  productPepperCashewDesc: string;
  productRoastedCashew: string;
  productCashewNibs: string;
  productCashewBiscuits: string;

  // Common UI
  languageLabel: string;
  selectLanguage: string;
  aseanRegion: string;
  europeRegion: string;
  eastAsiaRegion: string;
  verifiedBadge: string;
  unverifiedBadge: string;
  supportedBy: string;
}

export const TRANSLATIONS: Record<'en' | 'ko', TranslationDictionary> & Partial<Record<AppLanguage, TranslationDictionary>> = {
  // ENGLISH (International Standard)
  en: {
    navHome: 'Home',
    navPassport: 'Digital Passport & E-Label',
    navMap: 'Sourcing Map',
    navInventory: 'Inventory & Batches',
    navAdmin: 'Processor Portal',
    navPackaging: 'Packaging & Labels',
    navPitchDeck: 'Pitch Deck',
    navFarmer: 'Farmer Portal',
    navOnboarding: 'Owner Demo Studio',
    protocolTitle: 'Cambodia Agri Traceability Protocol',
    startVideoGuide: '⚡ Start & Video',
    login: '🔑 Login',
    logout: 'Lock',
    demoStudio: '👑 Demo Studio',

    passportTitle: 'Digital Product Passport (DPP)',
    passportSubtitle: 'Smart E-Label & Farm-to-Shelf Traceability Protocol',
    authenticTitle: 'Authentic Cambodian Produce',
    authenticSubtitle: '100% Cambodian Single-Origin Verified',
    lotCode: 'Batch / LOT Code',
    netWeight: 'Net Weight',
    mfdDate: 'Manufacturing Date (MFD)',
    expDate: 'Best Before / Expiry (EXP)',
    originCountry: 'Kingdom of Cambodia',
    eudrBadge: 'EUDR Deforestation-Free & CS 001 Certified',
    fullDeclaration: 'Full Ingredient Declaration',
    cashews: 'Cambodian Cashew Kernels',
    naturalSugar: 'Natural Palm Sugar',
    seaSalt: 'Kampot Sea Salt',
    kampotPepper: 'GI Organic Kampot Pepper',
    nutritionFacts: 'Nutrition Facts (per 100g)',
    protein: 'Protein',
    totalFat: 'Total Fat',
    carbs: 'Total Carbohydrates',
    sugars: 'Total Sugars',
    fiber: 'Dietary Fiber',
    sodium: 'Sodium',
    allergenWarning: 'Allergen & Storage Information',
    allergenDetails: 'Contains tree nuts (cashews). May contain traces of peanuts.',
    storageWarning: 'Store in a cool, dry place away from direct sunlight. Reseal tightly after opening.',
    manufacturerExporter: 'Manufacturer & Exporter',
    factoryPhnomPenh: 'Production Facility in Phnom Penh, Cambodia',
    farmersKampongThom: 'Suppliers from Kampong Thom province, Cambodia',
    scanVerification: 'Digitally Verified & Blockchain-Ready Identity',
    verifiedGpsStory: 'Verified GPS Farm Origin & Harvest Heritage',
    viewMap: 'View Sourcing Map',
    printQr: 'Print Smart QR Label',
    sharePassport: 'Share Passport Link',
    close: 'Close',

    productPepperCashew: 'GI Organic Kampot Pepper Coated Cashews',
    productPepperCashewDesc: 'Combining Cambodia world-famous GI Kampot pepper with premium roasted cashews.',
    productRoastedCashew: 'Premium Roasted Salted Cashews',
    productCashewNibs: 'Cashew Nibs (Zero-Waste Baking)',
    productCashewBiscuits: 'Artisanal Cashew Biscuits',

    languageLabel: 'Language',
    selectLanguage: 'Select Language (English & Korean)',
    aseanRegion: 'ASEAN & Global',
    europeRegion: 'Export Markets',
    eastAsiaRegion: 'East Asian Markets',
    verifiedBadge: 'Verified Clean',
    unverifiedBadge: 'Awaiting Audit',
    supportedBy: 'Supported by FTC / MISTI & Khmer Enterprise (KE)',
  },

  // KOREAN (한국어)
  ko: {
    navHome: '홈',
    navPassport: '디지털 제품 여권 & E-라벨',
    navMap: '산지 지도',
    navInventory: '재고 및 로트 관리',
    navAdmin: '가공 관리 포털',
    navPackaging: '패키징 & 라벨 디자인',
    navPitchDeck: '투자 및 수출 발표 자료',
    navFarmer: '농가 포털',
    navOnboarding: '시연 스튜디오',
    protocolTitle: '캄보디아 농산물 추적성 프로토콜',
    startVideoGuide: '⚡ 시작 및 영상',
    login: '🔑 로그인',
    logout: '잠금',
    demoStudio: '👑 시연 스튜디오',

    passportTitle: '디지털 제품 여권 (Digital Product Passport)',
    passportSubtitle: '스마트 전자 라벨 & 농장에서 식탁까지의 투명 추적 프로토콜',
    authenticTitle: '캄보디아 정품 인증 (AUTHENTIC)',
    authenticSubtitle: '100% 캄보디아산 단일 원산지 인증 (Single-Origin)',
    lotCode: '배치 / 로트 번호 (LOT Code)',
    netWeight: '순 내용량 (Net Weight)',
    mfdDate: '제조일자 (MFD)',
    expDate: '소비기한 (EXP / 소비기한)',
    originCountry: '캄보디아 왕국 (Kingdom of Cambodia)',
    eudrBadge: 'EUDR 산림벌채방지규정 준수 & CS 001 인증',
    fullDeclaration: '원재료 전문 (Full Declaration)',
    cashews: '캄보디아산 프리미엄 캐슈넛 원물',
    naturalSugar: '천연 야자당 (Palm Sugar)',
    seaSalt: '캄폿 천일염 (Sea Salt)',
    kampotPepper: '캄폿 유기농 지리적표시(GI) 후추',
    nutritionFacts: '영양정보 (Nutrition Facts per 100g)',
    protein: '단백질 (Protein)',
    totalFat: '지방 (Total Fat)',
    carbs: '탄수화물 (Carbohydrates)',
    sugars: '당류 (Total Sugars)',
    fiber: '식이섬유 (Dietary Fiber)',
    sodium: '나트륨 (Sodium)',
    allergenWarning: '알레르기 및 보관 주의사항',
    allergenDetails: '견과류(캐슈넛) 함유. 땅콩 혼입 가능성 있음.',
    storageWarning: '직사광선을 피하고 서늘하고 건조한 곳에 보관하십시오. 개봉 후에는 밀봉하여 보관하십시오.',
    manufacturerExporter: '제조원 및 수출자 (Manufacturer & Exporter)',
    factoryPhnomPenh: '가공 시설: 캄보디아 프놈펜',
    farmersKampongThom: '원물 공급 농가: 캄보디아 캄퐁톰 주',
    scanVerification: '디지털 정품 인증 및 블록체인 추적 완료',
    verifiedGpsStory: '검증된 농장 GPS 좌표 및 수확 이력',
    viewMap: '원산지 지도 보기',
    printQr: '스마트 QR 라벨 인쇄',
    sharePassport: '제품 여권 링크 공유',
    close: '닫기',

    productPepperCashew: '유기농 캄폿 후추 코팅 캐슈넛 (Black Pepper Coated Cashew)',
    productPepperCashewDesc: '세계적으로 유명한 캄보디아 캄폿 지리적표시(GI) 후추와 프리미엄 로스팅 캐슈넛의 조화로운 풍미.',
    productRoastedCashew: '프리미엄 구운 소금 캐슈넛',
    productCashewNibs: '캐슈넛 닙스 (베이커리용 제로웨이스트)',
    productCashewBiscuits: '수제 캄보디아 캐슈넛 비스킷',

    languageLabel: '언어',
    selectLanguage: '언어 선택 (영어 및 한국어)',
    aseanRegion: '아세안 & 글로벌',
    europeRegion: '수출 파트너 시장',
    eastAsiaRegion: '동아시아 수출 시장',
    verifiedBadge: '인증 완료',
    unverifiedBadge: '검증 대기',
    supportedBy: 'FTC / MISTI 시설 및 크메르 엔터프라이즈(KE) 지원',
  },

  // KHMER (ភាសាខ្មែរ) - DEFAULT NATIONAL
  km: {
    navHome: 'ទំព័រដើម',
    navPassport: 'លិខិតឆ្លងដែនឌីជីថល & ស្លាកអេឡិចត្រូនិច',
    navMap: 'ផែនទីប្រភពដើម',
    navInventory: 'សារពើភ័ណ្ឌ & ឡូតិ៍',
    navAdmin: 'ផ្ទាំងគ្រប់គ្រងរោងចក្រ',
    navPackaging: 'ស្ទូឌីយោវេចខ្ចប់ & ស្លាក',
    navPitchDeck: 'ឯកសារវិនិយោគ & នាំចេញ',
    navFarmer: 'ច្រកទ្វារកសិករ',
    navOnboarding: 'ស្ទូឌីយោសាកល្បង',
    protocolTitle: 'ពិធីការតាមដានកសិផលកម្ពុជា',
    startVideoGuide: '⚡ ចាប់ផ្តើម & វីដេអូ',
    login: '🔑 ចូលប្រើប្រព័ន្ធ',
    logout: 'ចាកចេញ',
    demoStudio: '👑 ស្ទូឌីយោសាកល្បង',

    passportTitle: 'លិខិតឆ្លងដែនឌីជីថលផលិតផល (DPP)',
    passportSubtitle: 'ស្លាកអេឡិចត្រូនិចវៃឆ្លាត និងប្រព័ន្ធតាមដានប្រភពដើមពីចម្ការដល់ដៃអតិថិជន',
    authenticTitle: 'កសិផលខ្មែរពិតប្រាកដ ១០០%',
    authenticSubtitle: 'ប្រភពកសិករខេត្តកំពង់ធំ ស្តង់ដារជាតិ CS 001',
    lotCode: 'លេខឡូតិ៍ផលិតកម្ម (LOT Code)',
    netWeight: 'ទម្ងន់សុទ្ធ (Net Weight)',
    mfdDate: 'កាលបរិច្ឆេទផលិត (MFD)',
    expDate: 'កាលបរិច្ឆេទផុតកំណត់ (EXP)',
    originCountry: 'ព្រះរាជាណាចក្រកម្ពុជា',
    eudrBadge: 'អនុលោមភាព EUDR មិនកាប់ព្រៃឈើ & ស្តង់ដារជាតិ CS 001',
    fullDeclaration: 'សេចក្តីប្រកាសបញ្ជីគ្រឿងផ្សំពេញលេញ',
    cashews: 'គ្រាប់ស្វាយចន្ទីកម្ពុជាសម្រិតសម្រាំង',
    naturalSugar: 'ស្ករត្នោតធម្មជាតិ',
    seaSalt: 'អំបិលសមុទ្រកំពត',
    kampotPepper: 'ម្រេចខ្មៅកំពត GI សរីរាង្គ',
    nutritionFacts: 'ព័ត៌មានអាហារូបត្ថម្ភប្រចាំ ១០០ ក្រាម',
    protein: 'ប្រូតេអ៊ីន',
    totalFat: 'ខ្លាញ់សរុប',
    carbs: 'កាបូអ៊ីដ្រាតសរុប',
    sugars: 'ជាតិស្ករសរុប',
    fiber: 'ជាតិសរសៃអាហារ',
    sodium: 'សូដ្យូម',
    allergenWarning: 'ព័ត៌មានសារធាតុអាឡែហ្ស៊ី & ការរក្សាទុក',
    allergenDetails: 'ផ្ទុកសារធាតុបង្កប្រតិកម្ម៖ គ្រាប់ស្វាយចន្ទី (Cashew Nuts)',
    storageWarning: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ ក្រោយបើកប្រើរួច ត្រូវបិទខ្សែរូតឱ្យជិត។',
    manufacturerExporter: 'សហគ្រាសផលិត និងនាំចេញផ្លូវការ',
    factoryPhnomPenh: 'រោងចក្រកែច្នៃ៖ រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា',
    farmersKampongThom: 'ប្រភពកសិករ៖ ខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា',
    scanVerification: 'ការផ្ទៀងផ្ទាត់ឌីជីថល និងប្រព័ន្ធតាមដាន CS 001 ជោគជ័យ',
    verifiedGpsStory: 'កូអរដោនេ GPS ចម្ការ និងប្រវត្តិប្រមូលផលបានផ្ទៀងផ្ទាត់',
    viewMap: 'មើលផែនទីប្រភពដើម',
    printQr: 'បោះពុម្ពស្លាក Smart QR',
    sharePassport: 'ចែករំលែកតំណភ្ជាប់',
    close: 'បិទ',

    productPepperCashew: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI',
    productPepperCashewDesc: 'ផ្សំឡើងពីគ្រាប់ស្វាយចន្ទីកម្ពុជាលំដាប់ខ្ពស់ និងម្រេចខ្មៅកំពត GI ដ៏ល្បីល្បាញលើពិភពលោក។',
    productRoastedCashew: 'គ្រាប់ស្វាយចន្ទីលីងអំបិលធម្មជាតិ',
    productCashewNibs: 'គ្រាប់ស្វាយចន្ទីបំបែក (Cashew Nibs)',
    productCashewBiscuits: 'នំប៊ីស្គីតគ្រាប់ស្វាយចន្ទី',

    languageLabel: 'ភាសា',
    selectLanguage: 'ជ្រើសរើសភាសា (ភាសាខ្មែរ, English, 한국어)',
    aseanRegion: 'អាស៊ាន & ពិភពលោក',
    europeRegion: 'ទីផ្សារនាំចេញអន្តរជាតិ',
    eastAsiaRegion: 'ទីផ្សារអាស៊ីបូព៌ា',
    verifiedBadge: 'បានផ្ទៀងផ្ទាត់រួចរាល់',
    unverifiedBadge: 'រង់ចាំការធ្វើសវនកម្ម',
    supportedBy: 'គាំទ្រដោយ FTC / MISTI និង សហគ្រិនខ្មែរ (KE)',
  },
};

// Aliases for compatibility
(TRANSLATIONS as any).kh = TRANSLATIONS.km;

