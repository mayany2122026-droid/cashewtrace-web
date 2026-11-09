export interface CertificateTranslation {
  // 1. logo and brand name
  kingdomHeader: string;
  motto: string;
  brandName: string;
  brandSubtitle: string;
  certTitle: string;
  certSubtitle: string;
  mistiBadge: string;

  // 2. product name in khmer and english
  productNameSectionHeader: string;
  productNameKhmerLabel: string;
  productNameEnLabel: string;
  productNameKoLabel?: string;

  // 3. scientific name in english
  scientificNameSectionHeader: string;
  scientificNameLabel: string;
  scientificClassification: string;

  // 4. product description
  descriptionHeader: string;
  descriptionSub: string;

  // 5. weight / volume
  weightHeader: string;
  netWeightLabel: string;
  weightHeaderGeneral?: string;
  weightLabelGeneral?: string;
  volumeHeader?: string;
  netVolumeLabel?: string;
  packagingFormatLabel: string;

  // 6. ingredient list
  ingredientsSectionHeader: string;
  ingredientsSub: string;
  fullDeclarationHeader: string;

  // 7. nutrition fact
  nutritionHeader: string;
  nutritionSub: string;
  energyLabel: string;
  proteinLabel: string;
  totalFatLabel: string;
  saturatedFatLabel: string;
  transFatLabel: string;
  cholesterolLabel: string;
  totalCarbLabel: string;
  dietaryFiberLabel: string;
  totalSugarsLabel: string;
  addedSugarsLabel: string;
  sodiumLabel: string;
  saltLabel: string;

  // 8. health benefits
  benefitsHeader: string;
  benefitsBadge: string;

  // 9. how to use
  usageHeader: string;
  usageSub: string;

  // 10. storage info
  storageHeader: string;
  storageSub: string;

  // 11. allergen info
  allergenAdvisoryHeader: string;
  allergenSub: string;

  // 12. Product Story
  storyHeader: string;
  storyBadge: string;

  // 13. manufactured by
  producerHeader: string;
  producerNameLabel: string;
  producerName: string;

  // 14. address
  addressHeader: string;
  addressLabel: string;
  addressText: string;
  originSourcingLabel: string;
  originSourcingText: string;

  // 15. contact info
  contactHeader: string;
  phoneLabel: string;
  emailLabel: string;
  websiteLabel: string;
  facebookLabel: string;

  // 16. mfg date
  mfdLabel: string;
  mfdSub: string;

  // 17. exp date
  expLabel: string;
  shelfLifeLabel: string;
  shelfLifeMonthsSuffix: string;

  // 18. Lot number
  lotLabel: string;
  lotSub: string;

  // Secondary Label (2nd Label) Packaging Specification Notice
  secondLabelNoticeTitle: string;
  secondLabelNoticeText: string;
  secondLabelJarNotice: string;
  secondLabelPouchNotice: string;
  secondLabelBadge: string;

  // 19. barcode
  barcodeLabel: string;
  barcodeSub: string;

  // 20. product of cambodia
  originBadge: string;
  productOfCambodiaTitle: string;
  standardsHeader: string;
  standardsBadge: string;
  stdCs001Title: string;
  stdCs001Sub: string;
  stdGhpTitle: string;
  stdGhpSub: string;
  stdGmpTitle: string;
  stdGmpSub: string;
  stdHaccpTitle: string;
  stdHaccpSub: string;
  stdEudrTitle: string;
  stdEudrSub: string;
  stdCamGapTitle: string;
  stdCamGapSub: string;
  complianceIconsHeader: string;
  iconRecyclable: string;
  iconAntiDrug: string;
  iconFoodGrade: string;
  iconNoChemicals: string;
  iconSupportKhmer: string;
  verificationHeader: string;
  qrScanNotice: string;
  digitalSealTitle: string;
  conformanceSealBadge: string;
  cashewTraceProtocolBadge: string;

  // Utilities
  copyBtn: string;
  printBtn: string;
  closeBtn: string;
  langSelectLabel: string;
  stampedNotice: string;
  stampedBadge: string;
  printedNotice: string;
  allergenWarningLabel: string;
  qrPassportLabel: string;
  standardTitle: string;
  standardSubtitle: string;
  productIdentityTitle: string;
  botanicalSubtitleFallback: string;
  batchHeader: string;
  formulationHeader: string;
  usageLabel: string;
  storageLabel: string;
  labHeader?: string;
  labBadge?: string;
  labParamHeader?: string;
  labLimitHeader?: string;
  labResultHeader?: string;
  labStatusHeader?: string;
  labMoistureLabel?: string;
  labMoistureLimit?: string;
  labDefectLabel?: string;
  labDefectLimit?: string;
  labAflatoxinLabel?: string;
  labAflatoxinLimit?: string;
  labHeavyMetalsLabel?: string;
  labHeavyMetalsLimit?: string;
  labNonDetectable?: string;
  labPass?: string;
}

export const CERTIFICATE_LANGUAGES: {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}[] = [
  { code: 'km', name: 'ភាសាខ្មែរ', nativeName: 'ភាសាខ្មែរ (Khmer - លំនាំដើម)', flag: '🇰🇭' },
  { code: 'en', name: 'English', nativeName: 'English (International / Export)', flag: '🌐' },
  { code: 'ko', name: '한국어', nativeName: '한국어 (Korea / Export)', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', nativeName: '日本語 (Japan / Export)', flag: '🇯🇵' },
];

export const CERTIFICATE_TRANSLATIONS: Record<string, CertificateTranslation> = {
  // ==========================================
  // KHMER (ភាសាខ្មែរ) - DEFAULT PRIMARY
  // ==========================================
  km: {
    // 1. logo and brand name
    kingdomHeader: 'ព្រះរាជាណាចក្រកម្ពុជា',
    motto: 'ជាតិ • សាសនា • ព្រះមហាក្សត្រ',
    brandName: 'សហគ្រាស ម៉ាយ៉ានី',
    brandSubtitle: 'សហគ្រាសកែច្នៃកសិផលស្តង់ដារគុណភាពខ្ពស់កម្ពុជា',
    certTitle: 'វិញ្ញាបនបត្របច្ចេកទេសផលិតផល & វេចខ្ចប់ CS 001 ផ្លូវការ',
    certSubtitle: 'ឯកសារផ្ទៀងផ្ទាត់គុណភាព និងការនាំចេញស្តង់ដារជាតិ CS 001:2000',
    mistiBadge: 'ស្តង់ដារជាតិ CS 001:2000 MISTI',

    // 2. product name in khmer and english
    productNameSectionHeader: 'ឈ្មោះផលិតផលផ្លូវការ',
    productNameKhmerLabel: 'ឈ្មោះជាភាសាខ្មែរ',
    productNameEnLabel: 'ឈ្មោះជាភាសាអង់គ្លេស',
    productNameKoLabel: 'ឈ្មោះជាភាសាកូរ៉េ',

    // 3. scientific name in english
    scientificNameSectionHeader: 'ឈ្មោះវិទ្យាសាស្ត្រ (ជាភាសាអង់គ្លេស)',
    scientificNameLabel: 'ចំណាត់ថ្នាក់រុក្ខសាស្ត្រផ្លូវការអន្តរជាតិ',
    scientificClassification: 'Anacardium occidentale',

    // 4. product description
    descriptionHeader: 'សេចក្តីពិពណ៌នាផលិតផលផ្លូវការ',
    descriptionSub: 'ស្តង់ដារ CS 001 មាត្រា ៤.២',

    // 5. weight / volume
    weightHeader: 'ទម្ងន់សុទ្ធ & ទម្រង់វេចខ្ចប់ផ្លូវការ',
    netWeightLabel: 'ទម្ងន់សុទ្ធផ្លូវការ',
    weightHeaderGeneral: 'ទម្ងន់ & ទម្រង់វេចខ្ចប់ផ្លូវការ',
    weightLabelGeneral: 'ទម្ងន់ផ្លូវការ',
    volumeHeader: 'ចំណុះសុទ្ធ & ទម្រង់វេចខ្ចប់ផ្លូវការ',
    netVolumeLabel: 'ចំណុះសុទ្ធផ្លូវការ',
    packagingFormatLabel: 'ទម្រង់វេចខ្ចប់ផ្លូវការ',

    // 6. ingredient list
    ingredientsSectionHeader: 'បញ្ជីគ្រឿងផ្សំ & សមាមាត្រភាគរយ',
    ingredientsSub: 'រៀបតាមលំដាប់បរិមាណពីច្រើនទៅតិច ស្របតាមស្តង់ដារ CS 001 ច្បាប់ ៤.៣',
    fullDeclarationHeader: 'សេចក្តីប្រកាសបញ្ជីគ្រឿងផ្សំពេញលេញ',

    // 7. nutrition fact
    nutritionHeader: 'ព័ត៌មានអាហារូបត្ថម្ភប្រចាំ ១០០ ក្រាម',
    nutritionSub: 'ស្តង់ដារជាតិ CS 001:2000 & Codex CXS 1-1985',
    energyLabel: 'ថាមពល',
    proteinLabel: 'ប្រូតេអ៊ីន',
    totalFatLabel: 'ខ្លាញ់សរុប',
    saturatedFatLabel: 'ខ្លាញ់ឆ្អែត',
    transFatLabel: 'ខ្លាញ់មិនឆ្អែតឆ្លង',
    cholesterolLabel: 'កូឡេស្តេរ៉ុល',
    totalCarbLabel: 'កាបូអ៊ីដ្រាតសរុប',
    dietaryFiberLabel: 'ជាតិសរសៃអាហារ',
    totalSugarsLabel: 'ជាតិស្ករសរុប',
    addedSugarsLabel: 'ជាតិស្ករបន្ថែម',
    sodiumLabel: 'សូដ្យូម',
    saltLabel: 'អំបិល',

    // 8. health benefits
    benefitsHeader: 'អត្ថប្រយោជន៍សុខភាព & អាហារូបត្ថម្ភ',
    benefitsBadge: 'សុខភាព & សារធាតុចិញ្ចឹមធម្មជាតិ',

    // 9. how to use
    usageHeader: 'របៀបប្រើប្រាស់ ឬទទួលទាន',
    usageSub: 'ស្តង់ដារ CS 001 ច្បាប់ ៤.៦',

    // 10. storage info
    storageHeader: 'លក្ខខណ្ឌរក្សាទុក',
    storageSub: 'ស្តង់ដារ CS 001 ច្បាប់ ៤.៥',

    // 11. allergen info
    allergenAdvisoryHeader: 'ព័ត៌មានសារធាតុអាឡែហ្ស៊ី',
    allergenSub: 'សេចក្តីជូនដំណឹងការពារសុវត្ថិភាពអ្នកបរិភោគ',

    // 12. Product Story
    storyHeader: 'រឿងរ៉ាវផលិតផល & ប្រភពដើមកសិករសហគមន៍',
    storyBadge: 'កសិផលខ្មែរ ១០០% ខេត្តកំពង់ធំ',

    // 13. manufactured by
    producerHeader: 'ផលិតដោយ',
    producerNameLabel: 'សហគ្រាសផលិតផ្លូវការ',
    producerName: 'សហគ្រាស ម៉ាយ៉ានី',

    // 14. address
    addressHeader: 'អាសយដ្ឋានរោងចក្រ & ទីតាំងកែច្នៃ',
    addressLabel: 'ទីតាំងរោងចក្រកែច្នៃផ្លូវការ',
    addressText: 'រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា',
    originSourcingLabel: 'ប្រភពវត្ថុធាតុដើម',
    originSourcingText: 'ព្រះរាជាណាចក្រកម្ពុជា ១០០% (ខេត្តកំពង់ធំ)',

    // 15. contact info
    contactHeader: 'ព័ត៌មានទំនាក់ទំនងផ្លូវការ',
    phoneLabel: 'ទូរស័ព្ទ / តេឡេក្រាម',
    emailLabel: 'អ៊ីមែលផ្លូវការ',
    websiteLabel: 'គេហទំព័រផ្លូវការ',
    facebookLabel: 'ទំព័រហ្វេសប៊ុក',

    // 16. mfg date
    mfdLabel: 'កាលបរិច្ឆេទផលិត',
    mfdSub: 'បោះត្រាផ្ទាល់លើកញ្ចប់ស្របតាមស្តង់ដារ CS 001:2000',

    // 17. exp date
    expLabel: 'កាលបរិច្ឆេទផុតកំណត់',
    shelfLifeLabel: 'អាយុកាលរក្សាទុកគុណភាពផ្លូវការ',
    shelfLifeMonthsSuffix: 'ខែ',

    // 18. Lot number
    lotLabel: 'លេខឡូតិ៍ផលិតកម្ម',
    lotSub: 'លេខកូដតាមដានប្រភពដើម និងការត្រួតពិនិត្យគុណភាព CS 001',

    // Secondary Label (2nd Label) Packaging Specification Notice
    secondLabelNoticeTitle: 'កំណត់សម្គាល់ការវេចខ្ចប់ (ស្លាកទី ២ / 2nd Label):',
    secondLabelNoticeText: 'លេខឡូតិ៍ (Lot No.), កាលបរិច្ឆេទផលិត (MFD), និងកាលបរិច្ឆេទផុតកំណត់ (EXP) មិនមាននៅលើស្លាកអចិន្ត្រៃយ៍មុខដបឡើយ គឺត្រូវបានបោះពុម្ពនៅលើ «ស្លាកទី ២ (Secondary Label Sticker)» ដែលបានបិទផ្ទាល់នៅលើកំប៉ុង PET (គម្រប ឬបាតកំប៉ុង) ឬលើកញ្ចប់ថង់។',
    secondLabelJarNotice: 'សម្រាប់កំប៉ុង PET (PET Jars)：ព័ត៌មាន Lot, MFD, EXP ត្រូវបានបោះពុម្ពលើស្លាកស្ទីកឃ័រទី ២ បិទលើគម្រប ឬបាតកំប៉ុង។',
    secondLabelPouchNotice: 'សម្រាប់កញ្ចប់ថង់ (Pouches)：ព័ត៌មាន Lot, MFD, EXP ត្រូវបានបោះពុម្ពលើស្លាកស្ទីកឃ័រទី ២ ឬបោះត្រាផ្ទាល់នៅផ្នែកខាងក្រោយ/ក្បាលថង់។',
    secondLabelBadge: 'ស្លាកទី ២ (Secondary Sticker)',

    // 19. barcode
    barcodeLabel: 'លេខកូដបាកូដ GS1 (EAN-13)',
    barcodeSub: 'បាកូដឆ្នូតស្តង់ដារអន្តរជាតិសម្រាប់ស្កេនទូទាត់ទូទាំងពិភពលោក',

    // 20. product of cambodia
    originBadge: 'ផលិតផលនៃព្រះរាជាណាចក្រកម្ពុជា',
    productOfCambodiaTitle: 'ផលិតផលនៃព្រះរាជាណាចក្រកម្ពុជា',
    standardsHeader: 'ស្តង់ដារគុណភាព & ការអនុលោមភាពអន្តរជាតិ',
    standardsBadge: 'ស្តង់ដារជាតិ CS 001',
    stdCs001Title: 'ស្តង់ដារជាតិ CS 001:2000',
    stdCs001Sub: 'ក្រសួងឧស្សាហកម្ម វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា និងនវានុវត្តន៍ (MISTI)',
    stdGhpTitle: 'ការអនុវត្តអនាម័យល្អ (GHP)',
    stdGhpSub: 'អនាម័យកែច្នៃកម្រិតខ្ពស់',
    stdGmpTitle: 'ការអនុវត្តផលិតកម្មល្អ (GMP)',
    stdGmpSub: 'រោងចក្រស្តង់ដារជាតិ',
    stdHaccpTitle: 'ប្រព័ន្ធវិភាគហានិភ័យចំណុចត្រួតពិនិត្យសំខាន់ (HACCP)',
    stdHaccpSub: 'ត្រួតពិនិត្យចំណុចសំខាន់',
    stdEudrTitle: 'មិនកាប់បំផ្លាញព្រៃឈើ (EUDR)',
    stdEudrSub: 'ទីផ្សារអឺរ៉ុប & ពិភពលោក',
    stdCamGapTitle: 'កសិកម្មល្អកម្ពុជា (CamGAP)',
    stdCamGapSub: 'ចម្ការកសិករកំពង់ធំ',
    complianceIconsHeader: 'និមិត្តសញ្ញាអនុលោមភាពវេចខ្ចប់',
    iconRecyclable: 'កញ្ចប់កែច្នៃឡើងវិញបាន',
    iconAntiDrug: 'គ្មានសារធាតុញៀន',
    iconFoodGrade: 'សម្ភារៈសុវត្ថិភាពម្ហូបអាហារ',
    iconNoChemicals: 'គ្មានសារធាតុគីមីគ្រោះថ្នាក់',
    iconSupportKhmer: 'គាំទ្រកសិផលជាតិខ្មែរ',
    verificationHeader: 'ការផ្ទៀងផ្ទាត់ឌីជីថលផ្លូវការ',
    qrScanNotice: 'ស្កេនកូដ QR នេះដោយប្រើទូរស័ព្ទដៃ ដើម្បីផ្ទៀងផ្ទាត់ប្រភពដើម ការអនុលោមភាព EUDR និងវិញ្ញាបនបត្រឌីជីថល CS 001 ជាក់ស្តែងភ្លាមៗ។',
    digitalSealTitle: 'ពិធីការស្តង់ដារជាតិ MISTI',
    conformanceSealBadge: 'ត្រាបញ្ជាក់ការអនុលោមភាព',
    cashewTraceProtocolBadge: 'ប្រព័ន្ធ CashewTrace ២០២៦',

    // Utilities
    copyBtn: 'ចម្លងអត្ថបទវិញ្ញាបនបត្រ',
    printBtn: 'បោះពុម្ពវិញ្ញាបនបត្រ (PDF)',
    closeBtn: 'បិទ',
    langSelectLabel: 'ជ្រើសរើសភាសាវិញ្ញាបនបត្រ',
    stampedNotice: 'សូមពិនិត្យមើលកាលបរិច្ឆេទ MFD, EXP និងលេខឡូតិ៍ដែលបោះត្រាផ្ទាល់លើកញ្ចប់។',
    stampedBadge: 'បោះត្រាលើកញ្ចប់',
    printedNotice: 'បោះពុម្ពម៉ាស៊ីនលើស្លាក',
    allergenWarningLabel: 'ព័ត៌មានសារធាតុអាឡែហ្ស៊ី',
    qrPassportLabel: 'Digital Passport',
    standardTitle: 'ស្តង់ដារជាតិ CS 001:2000',
    standardSubtitle: 'ស្តង់ដារវេចខ្ចប់កម្ពុជា (ឯកសារបច្ចេកទេស MISTI / ISC)',
    productIdentityTitle: 'អត្តសញ្ញាណផលិតផល & ចំណាត់ថ្នាក់រុក្ខសាស្ត្រ',
    botanicalSubtitleFallback: 'គ្រាប់ស្វាយចន្ទីកម្ពុជាសម្រិតសម្រាំង (Anacardium occidentale)',
    batchHeader: 'លក្ខណៈបច្ចេកទេសឡូតិ៍ & ភាពអាចតាមដានបាន',
    formulationHeader: 'បញ្ជីគ្រឿងផ្សំ & រូបមន្តស្របតាមបទប្បញ្ញត្តិ CS 001 ច្បាប់ ៤.៣',
    usageLabel: 'របៀបប្រើប្រាស់',
    storageLabel: 'លក្ខខណ្ឌរក្សាទុក',
    labHeader: 'លទ្ធផលវិភាគមន្ទីរពិសោធន៍ & សុវត្ថិភាពម្ហូបអាហារ',
    labBadge: 'ជាប់ស្តង់ដារគុណភាព ១០០%',
    labParamHeader: 'ប៉ារ៉ាម៉ែត្របច្ចេកទេស',
    labLimitHeader: 'កម្រិតកំណត់ស្តង់ដារជាតិ CS 001',
    labResultHeader: 'លទ្ធផលធ្វើតេស្តជាក់ស្តែង',
    labStatusHeader: 'ស្ថានភាព',
    labMoistureLabel: 'កម្រិតសំណើម',
    labMoistureLimit: 'អតិបរមា ៥.០% នៃម៉ាស់',
    labDefectLabel: 'អត្រាខូចខាត ឬពិការភាពសរុប',
    labDefectLimit: 'អតិបរមា ៨.០%',
    labAflatoxinLabel: 'សារធាតុពុលផ្សិត អាហ្វឡាតុកស៊ីន សរុប (B1+B2+G1+G2)',
    labAflatoxinLimit: 'អតិបរមា ៤.០ ppb (ស្តង់ដារ Codex)',
    labHeavyMetalsLabel: 'លោហៈធ្ងន់ (សំណ, កាដមីញ៉ូម)',
    labHeavyMetalsLimit: 'អតិបរមា ០.១ mg/kg',
    labNonDetectable: 'គ្មាន (រកមិនឃើញ)',
    labPass: 'ជាប់ស្តង់ដារ',
  },

  // ==========================================
  // ENGLISH (International / Export)
  // ==========================================
  en: {
    // 1. logo and brand name
    kingdomHeader: 'KINGDOM OF CAMBODIA',
    motto: 'Nation • Religion • King',
    brandName: 'MAYANY ENTERPRISE',
    brandSubtitle: 'Cambodian Agro-Processing Enterprise',
    certTitle: 'Official Technical Product & Packaging Certificate',
    certSubtitle: 'Cambodia National Standard CS 001:2000 Export & Quality Verification Dossier',
    mistiBadge: 'MISTI CS 001:2000 CERTIFIED',

    // 2. product name in khmer and english
    productNameSectionHeader: 'Official Product Name',
    productNameKhmerLabel: 'Name in Khmer',
    productNameEnLabel: 'English Name',
    productNameKoLabel: 'Korean Name',

    // 3. scientific name in english
    scientificNameSectionHeader: 'Scientific Name (Botanical Classification in English)',
    scientificNameLabel: 'Official International Botanical Classification',
    scientificClassification: 'Anacardium occidentale',

    // 4. product description
    descriptionHeader: 'Official Product Description',
    descriptionSub: 'CS 001 Standard Rule 4.2',

    // 5. weight / volume
    weightHeader: 'Official Net Weight & Packaging Format',
    netWeightLabel: 'Official Net Weight',
    weightHeaderGeneral: 'Official Weight & Packaging Format',
    weightLabelGeneral: 'Official Weight',
    volumeHeader: 'Official Net Volume & Packaging Format',
    netVolumeLabel: 'Official Net Volume',
    packagingFormatLabel: 'Official Packaging Format',

    // 6. ingredient list
    ingredientsSectionHeader: 'Ingredient List & Percentage Breakdown',
    ingredientsSub: 'Declared in descending order of proportion conforming to CS 001 Rule 4.3',
    fullDeclarationHeader: 'Full Ingredient Declaration',

    // 7. nutrition fact
    nutritionHeader: 'Nutrition Facts (per 100g Composition)',
    nutritionSub: 'Conforming to CS 001:2000 & Codex CXS 1-1985 Standard',
    energyLabel: 'Energy',
    proteinLabel: 'Protein',
    totalFatLabel: 'Total Fat',
    saturatedFatLabel: 'Saturated Fat',
    transFatLabel: 'Trans Fat',
    cholesterolLabel: 'Cholesterol',
    totalCarbLabel: 'Total Carbohydrates',
    dietaryFiberLabel: 'Dietary Fiber',
    totalSugarsLabel: 'Total Sugars',
    addedSugarsLabel: 'Added Sugars',
    sodiumLabel: 'Sodium',
    saltLabel: 'Salt',

    // 8. health benefits
    benefitsHeader: 'Health & Nutritional Benefits',
    benefitsBadge: 'Health & Essential Nutrition',

    // 9. how to use
    usageHeader: 'How to Use / Directions for Preparation',
    usageSub: 'CS 001 Standard Rule 4.6',

    // 10. storage info
    storageHeader: 'Storage Information & Conditions',
    storageSub: 'CS 001 Standard Rule 4.5',

    // 11. allergen info
    allergenAdvisoryHeader: 'Allergen Information & Advisory Notice',
    allergenSub: 'Mandatory Food Allergen Disclosure',

    // 12. Product Story
    storyHeader: 'Product Story & Community Sourcing Origins',
    storyBadge: '100% Kampong Thom Sourcing',

    // 13. manufactured by
    producerHeader: 'Manufactured By (Processor & Producer)',
    producerNameLabel: 'Official Registered Enterprise',
    producerName: 'Mayany Enterprise',

    // 14. address
    addressHeader: 'Factory & Processing Facility Address',
    addressLabel: 'Processing Facility Address',
    addressText: 'Phnom Penh, Kingdom of Cambodia',
    originSourcingLabel: 'Raw Material Origin',
    originSourcingText: '100% Kingdom of Cambodia (Kampong Thom Province)',

    // 15. contact info
    contactHeader: 'Official Contact Information',
    phoneLabel: 'Tel / Telegram / WhatsApp',
    emailLabel: 'Official Email',
    websiteLabel: 'Official Website',
    facebookLabel: 'Facebook Page',

    // 16. mfg date
    mfdLabel: 'Manufacturing Date (MFD)',
    mfdSub: 'Stamped directly on packaging bag per CS 001:2000',

    // 17. exp date
    expLabel: 'Expiration Date (EXP / Best Before)',
    shelfLifeLabel: 'Official Quality Shelf Life',
    shelfLifeMonthsSuffix: 'Months',

    // 18. Lot number
    lotLabel: 'Production Lot Number (LOT / Batch)',
    lotSub: 'Traceability & Batch Quality Tracking Identifier',

    // Secondary Label (2nd Label) Packaging Specification Notice
    secondLabelNoticeTitle: 'Packaging Specification Notice (2nd Label / Secondary Sticker):',
    secondLabelNoticeText: 'The Lot Number (Batch Code), Manufacturing Date (MFD), and Expiration Date (EXP) are not printed on the permanent front brand label; they are printed on the "2nd Label (Secondary Sticker)" applied directly to the jars (lid or bottom) or pouches.',
    secondLabelJarNotice: 'For PET Jars: Lot, MFD, and EXP are printed on the secondary sticker label affixed to the lid or container bottom.',
    secondLabelPouchNotice: 'For Pouches: Lot, MFD, and EXP are printed on the secondary sticker label affixed to the back/seal of the pouch.',
    secondLabelBadge: '2nd Label (Secondary Sticker)',

    // 19. barcode
    barcodeLabel: 'GS1 Barcode (EAN-13)',
    barcodeSub: 'International 1D Barcode for Point of Sale & Global Retail Checkout',

    // 20. product of cambodia
    originBadge: 'Product of Cambodia',
    productOfCambodiaTitle: 'Product of Cambodia (Origin Authenticity)',
    standardsHeader: 'Official Quality & Compliance Standards',
    standardsBadge: 'CS 001 STANDARDS',
    stdCs001Title: 'Cambodian Standard CS 001:2000',
    stdCs001Sub: 'MISTI Ministry',
    stdGhpTitle: 'Good Hygiene Practices (GHP)',
    stdGhpSub: 'Processing Hygiene',
    stdGmpTitle: 'Good Manufacturing Practices (GMP)',
    stdGmpSub: 'Factory Conformance',
    stdHaccpTitle: 'HACCP Safety Standard',
    stdHaccpSub: 'Critical Control Points',
    stdEudrTitle: 'EUDR Deforestation-Free',
    stdEudrSub: 'Global Export Ready',
    stdCamGapTitle: 'CamGAP Certified',
    stdCamGapSub: 'Kampong Thom Farms',
    complianceIconsHeader: 'Packaging Compliance Icons',
    iconRecyclable: 'Recyclable Package',
    iconAntiDrug: 'Anti-Drug Compliance',
    iconFoodGrade: 'Food Grade Material',
    iconNoChemicals: 'No Harmful Chemicals',
    iconSupportKhmer: 'Support Khmer Farmers',
    verificationHeader: 'Official Digital Verification',
    qrScanNotice: 'Scan this QR code with any smartphone to instantly confirm traceability, EUDR compliance, and MISTI CS 001 verification in real-time.',
    digitalSealTitle: 'MISTI PROTOCOL',
    conformanceSealBadge: 'CONFORMANCE SEAL',
    cashewTraceProtocolBadge: 'CashewTrace Protocol 2026',

    // Utilities
    copyBtn: 'Copy Dossier Text',
    printBtn: 'Print Certificate (PDF)',
    closeBtn: 'Close',
    langSelectLabel: 'Certificate Language',
    stampedNotice: 'Please refer to stamped MFD, EXP, and LOT details directly stamped on packaging bag.',
    stampedBadge: 'Stamped on Packaging Bag',
    printedNotice: 'Directly printed on packaging label',
    allergenWarningLabel: 'Allergen Advisory Notice',
    qrPassportLabel: 'Digital Passport',
    standardTitle: 'CAMBODIAN NATIONAL STANDARD CS 001:2000',
    standardSubtitle: 'Cambodia National Packaging Standard (MISTI / ISC Technical Dossier)',
    productIdentityTitle: 'PRODUCT IDENTITY & BOTANICAL CLASSIFICATION',
    botanicalSubtitleFallback: 'Selected Cambodian Cashews (Anacardium occidentale)',
    batchHeader: 'BATCH & TRACEABILITY SPECIFICATION',
    formulationHeader: 'FULL INGREDIENTS LIST & REGULATORY FORMULATION (CS 001 Rule 4.3)',
    usageLabel: 'Directions for Use',
    storageLabel: 'Storage Conditions',
    labHeader: 'Laboratory Safety & Quality Parameters:',
    labBadge: 'ALL PARAMETERS COMPLIANT',
    labParamHeader: 'Technical Parameter',
    labLimitHeader: 'Regulatory Limit (CS 001)',
    labResultHeader: 'Test Result',
    labStatusHeader: 'Status',
    labMoistureLabel: 'Moisture Content',
    labMoistureLimit: 'Max 5.0% by mass',
    labDefectLabel: 'Total Defect & Damage Rate',
    labDefectLimit: 'Max 8.0%',
    labAflatoxinLabel: 'Aflatoxin Total (B1+B2+G1+G2)',
    labAflatoxinLimit: 'Max 4.0 ppb (Codex Limit)',
    labHeavyMetalsLabel: 'Heavy Metals (Lead Pb, Cadmium Cd)',
    labHeavyMetalsLimit: 'Max 0.1 mg/kg',
    labNonDetectable: 'Non-Detectable (<0.01)',
    labPass: 'PASS',
  },

  // ==========================================
  // KOREAN (한국어 / Export to Korea)
  // ==========================================
  ko: {
    // 1. logo and brand name
    kingdomHeader: '캄보디아 왕국 (KINGDOM OF CAMBODIA)',
    motto: '국가 • 종교 • 국왕',
    brandName: '마야니 엔터프라이즈 (MAYANY ENTERPRISE)',
    brandSubtitle: '캄보디아 고품질 농산물 가공 전문 기업',
    certTitle: '공식 제품 및 포장 기술 검증 인증서',
    certSubtitle: '캄보디아 국가 표준 CS 001:2000 수출 품질 및 추적성 검증 도시에',
    mistiBadge: 'MISTI CS 001:2000 규격 인증',

    // 2. product name in khmer and english
    productNameSectionHeader: '공식 제품명 (Product Name)',
    productNameKhmerLabel: '크메르어 원어 제품명',
    productNameEnLabel: '영어 공식 제품명',
    productNameKoLabel: '한국어 공식 제품명',

    // 3. scientific name in english
    scientificNameSectionHeader: '식물학적 학명 (Scientific Name in English)',
    scientificNameLabel: '국제 공식 식물학적 분류 체계',
    scientificClassification: 'Anacardium occidentale',

    // 4. product description
    descriptionHeader: '공식 제품 설명 (Product Description)',
    descriptionSub: 'CS 001 규정 제4.2조 준수',

    // 5. weight / volume
    weightHeader: '공식 순 내용량 및 포장 형태',
    netWeightLabel: '순 내용량 (Net Weight)',
    weightHeaderGeneral: '공식 중량 및 포장 형태 (Weight & Package)',
    weightLabelGeneral: '공식 중량 (Weight)',
    volumeHeader: '공식 순 용량 및 포장 형태 (Net Volume & Package)',
    netVolumeLabel: '공식 순 용량 (Net Volume)',
    packagingFormatLabel: '공식 포장 형태 (Package Format)',

    // 6. ingredient list
    ingredientsSectionHeader: '원재료 및 함량 비율 (Ingredient List)',
    ingredientsSub: 'CS 001 규정 제4.3조에 따른 함량 순위 및 비율 표기',
    fullDeclarationHeader: '전체 원재료 및 성분 표시 전문',

    // 7. nutrition fact
    nutritionHeader: '100g당 영양성분 정보 (Nutrition Facts per 100g)',
    nutritionSub: '캄보디아 표준 CS 001:2000 및 국제식품규격 Codex 준수',
    energyLabel: '열량 (Energy)',
    proteinLabel: '단백질 (Protein)',
    totalFatLabel: '총 지방 (Total Fat)',
    saturatedFatLabel: '포화지방 (Saturated Fat)',
    transFatLabel: '트랜스지방 (Trans Fat)',
    cholesterolLabel: '콜레스테롤 (Cholesterol)',
    totalCarbLabel: '탄수화물 (Total Carbohydrates)',
    dietaryFiberLabel: '식이섬유 (Dietary Fiber)',
    totalSugarsLabel: '당류 (Total Sugars)',
    addedSugarsLabel: '첨가당 (Added Sugars)',
    sodiumLabel: '나트륨 (Sodium)',
    saltLabel: '식염상당량 (Salt)',

    // 8. health benefits
    benefitsHeader: '건강 및 영양학적 이점 (Health Benefits)',
    benefitsBadge: '자연 건강 및 영양성분',

    // 9. how to use
    usageHeader: '섭취 및 사용 방법 (How to Use)',
    usageSub: 'CS 001 규정 제4.6조 준수',

    // 10. storage info
    storageHeader: '보관 방법 및 조건 (Storage Information)',
    storageSub: 'CS 001 규정 제4.5조 준수',

    // 11. allergen info
    allergenAdvisoryHeader: '알레르기 유발물질 안내 (Allergen Information)',
    allergenSub: '식품 알레르기 안전 필수 고지 사항',

    // 12. Product Story
    storyHeader: '제품 스토리 및 생산 농가 유래 (Product Story)',
    storyBadge: '100% 캄퐁톰 현지 직송',

    // 13. manufactured by
    producerHeader: '제조원 (Manufactured By)',
    producerNameLabel: '공식 등록 제조 기업',
    producerName: '마야니 엔터프라이즈 (Mayany Enterprise)',

    // 14. address
    addressHeader: '제조 시설 및 사업장 주소 (Address)',
    addressLabel: '공식 제조 가공 시설 주소',
    addressText: '캄보디아 왕국 프놈펜 (Phnom Penh, Cambodia)',
    originSourcingLabel: '원자재 원산지',
    originSourcingText: '100% 캄보디아 왕국 (캄퐁톰 주 직송)',

    // 15. contact info
    contactHeader: '공식 고객센터 및 연락처 (Contact Info)',
    phoneLabel: '전화 / 텔레그램 / WhatsApp',
    emailLabel: '공식 이메일',
    websiteLabel: '공식 웹사이트',
    facebookLabel: '페이스북 페이지',

    // 16. mfg date
    mfdLabel: '제조일자 (Manufacturing Date / MFD)',
    mfdSub: 'CS 001:2000 규격에 따라 포장재에 직접 날인',

    // 17. exp date
    expLabel: '소비기한 (Expiration Date / EXP)',
    shelfLifeLabel: '공식 품질 유지 기한',
    shelfLifeMonthsSuffix: '개월 (Months)',

    // 18. Lot number
    lotLabel: '생산 로트 / 배치 번호 (Lot Number / Batch)',
    lotSub: '원산지 추적성 및 배치 품질 관리 코드',

    // Secondary Label (2nd Label) Packaging Specification Notice
    secondLabelNoticeTitle: '포장 표기 규격 안내 (제2라벨 / Secondary Sticker):',
    secondLabelNoticeText: '생산 로트 번호(Lot No.), 제조일자(MFD), 소비기한(EXP)은 전면 영구 라벨이 아닌, 용기 뚜껑(Lid) 또는 하단/후면에 별도 부착된 «제2라벨(2nd Label) 스티커»에 개별 인쇄되어 있습니다.',
    secondLabelJarNotice: 'PET 용기 포장: 로트 번호, 제조일자(MFD), 소비기한(EXP)은 뚜껑 또는 용기 바닥면 제2라벨 스티커에 인쇄되어 있습니다.',
    secondLabelPouchNotice: '파우치(Pouch) 포장: 로트 번호, 제조일자(MFD), 소비기한(EXP)은 파우치 후면 또는 밀봉 부위 제2라벨 스티커에 인쇄되어 있습니다.',
    secondLabelBadge: '제2라벨 (Secondary Sticker)',

    // 19. barcode
    barcodeLabel: '국제 표준 바코드 (GS1 Barcode EAN-13)',
    barcodeSub: '유통 및 판매 시점 관리를 위한 공식 1D 바코드',

    // 20. product of cambodia
    originBadge: '원산지: 캄보디아 (Product of Cambodia)',
    productOfCambodiaTitle: '원산지: 캄보디아 왕국 (Product of Cambodia)',
    standardsHeader: '공식 품질 규격 및 국제 인증 표준',
    standardsBadge: 'CS 001 인증',
    stdCs001Title: '캄보디아 국가 표준 CS 001:2000',
    stdCs001Sub: 'MISTI 과학기술혁신부',
    stdGhpTitle: '우수 위생 관리 기준 (GHP)',
    stdGhpSub: '가공 위생 관리',
    stdGmpTitle: '우수 제조 관리 기준 (GMP)',
    stdGmpSub: '공장 규격 적합성',
    stdHaccpTitle: 'HACCP 식품안전관리인증',
    stdHaccpSub: '중요관리점(CCP) 통제',
    stdEudrTitle: 'EU 산림전용방지법(EUDR) 준수',
    stdEudrSub: '글로벌 수출 적격',
    stdCamGapTitle: 'CamGAP 우수농산물인증',
    stdCamGapSub: '캄퐁톰 농가 직송',
    complianceIconsHeader: '포장 규격 준수 아이콘',
    iconRecyclable: '재활용 가능 포장재',
    iconAntiDrug: '마약류 유입 방지 준수',
    iconFoodGrade: '식품 등급 안심 포장',
    iconNoChemicals: '유해 화학물질 무첨가',
    iconSupportKhmer: '크메르 농가 상생 지원',
    verificationHeader: '공식 디지털 검증 및 인증 (Official Digital Verification)',
    qrScanNotice: '스마트폰으로 이 QR 코드를 스캔하시면 실시간으로 이력 추적, EUDR 산림보호 준수 및 MISTI CS 001 품질 검증을 확인하실 수 있습니다.',
    digitalSealTitle: 'MISTI 과학기술혁신부 프로토콜',
    conformanceSealBadge: '품질 적합성 인증 날인',
    cashewTraceProtocolBadge: 'CashewTrace 프로토콜 2026',

    // Utilities
    copyBtn: '인증서 텍스트 복사',
    printBtn: '인증서 인쇄 (PDF)',
    closeBtn: '닫기',
    langSelectLabel: '인증서 발급 언어 선택',
    stampedNotice: '포장지 겉면에 직접 타각/스탬프 인쇄된 제조일자(MFD), 소비기한(EXP) 및 로트 번호(LOT)를 확인하여 주십시오.',
    stampedBadge: '포장백 날인 완료',
    printedNotice: '라벨 인쇄 완료',
    allergenWarningLabel: '알레르기 유발물질 주의 문구',
    qrPassportLabel: '디지털 여권 (QR)',
    standardTitle: '캄보디아 국가 규격 CS 001:2000',
    standardSubtitle: '캄보디아 산업과학기술혁신부(MISTI / ISC) 포장 표준 기술 서류',
    productIdentityTitle: '제품 식별 및 식물학적 분류 (PRODUCT IDENTITY)',
    botanicalSubtitleFallback: '선별된 캄보디아산 캐슈넛 (Anacardium occidentale)',
    batchHeader: '생산 로트 및 추적성 규격',
    formulationHeader: '원재료 및 함량 전문 (CS 001 규정 제4.3조 준수)',
    usageLabel: '사용 지침',
    storageLabel: '보관 조건',
    labHeader: '실험실 안전 및 품질 분석 결과:',
    labBadge: '전 항목 규격 적합 (100%)',
    labParamHeader: '기술 분석 항목',
    labLimitHeader: '국가 규정 한도 (CS 001)',
    labResultHeader: '실측 시험 결과',
    labStatusHeader: '판정',
    labMoistureLabel: '수분 함량',
    labMoistureLimit: '최대 5.0% (질량비)',
    labDefectLabel: '결함 및 손상 과립 비율',
    labDefectLimit: '최대 8.0%',
    labAflatoxinLabel: '총 아플라톡신 (B1+B2+G1+G2)',
    labAflatoxinLimit: '최대 4.0 ppb (Codex 기준)',
    labHeavyMetalsLabel: '중금속 (납 Pb, 카드뮴 Cd)',
    labHeavyMetalsLimit: '최대 0.1 mg/kg',
    labNonDetectable: '불검출 (<0.01)',
    labPass: '적합 (PASS)',
  },

  // ==========================================
  // JAPANESE (日本語 🇯🇵) - EXPORT STANDARD
  // ==========================================
  ja: {
    // 1. logo and brand name
    kingdomHeader: 'カンボジア王国',
    motto: '国家 • 宗教 • 国王',
    brandName: 'マヤニー・エンタープライズ (Mayany Enterprise)',
    brandSubtitle: 'カンボジア産最高品質農産物加工・輸出企業',
    certTitle: '公式 CS 001 製品・包装技術仕様証明書',
    certSubtitle: 'カンボジア国家規格 CS 001:2000 品質認証・輸出技術文書',
    mistiBadge: '国家規格 CS 001:2000 MISTI 認証',

    // 2. product name
    productNameSectionHeader: '公式製品名',
    productNameKhmerLabel: 'クメール語名称',
    productNameEnLabel: '英語名称',
    productNameKoLabel: '日本語名称',

    // 3. scientific name
    scientificNameSectionHeader: '学名（英語）',
    scientificNameLabel: '国際植物分類名',
    scientificClassification: 'Anacardium occidentale',

    // 4. product description
    descriptionHeader: '公式製品説明および品質特性',
    descriptionSub: 'CS 001 規格第2.2条に基づく適正製造規範',

    // 5. weight / volume
    weightHeader: '公称内容量および包装規格',
    netWeightLabel: '正味内容量',
    weightHeaderGeneral: '内容量',
    weightLabelGeneral: '内容量',
    volumeHeader: '正味容量',
    netVolumeLabel: '正味容量',
    packagingFormatLabel: '包装仕様・形態',

    // 6. ingredient list
    ingredientsSectionHeader: '原材料表示（配合比率順）',
    ingredientsSub: 'CS 001 規格第4.3条に基づく完全開示',
    fullDeclarationHeader: '原材料配合明細',

    // 7. nutrition fact
    nutritionHeader: '栄養成分表示（100g当たり）',
    nutritionSub: '公式認定検査機関による分析値',
    energyLabel: 'エネルギー',
    proteinLabel: 'タンパク質',
    totalFatLabel: '脂質',
    saturatedFatLabel: '飽和脂肪酸',
    transFatLabel: 'トランス脂肪酸',
    cholesterolLabel: 'コレステロール',
    totalCarbLabel: '炭水化物',
    dietaryFiberLabel: '食物繊維',
    totalSugarsLabel: '糖類',
    addedSugarsLabel: '添加糖',
    sodiumLabel: 'ナトリウム',
    saltLabel: '食塩相当量',

    // 8. health benefits
    benefitsHeader: '栄養・健康機能の特徴',
    benefitsBadge: '100% 自然由来栄養素',

    // 9. how to use
    usageHeader: 'お召し上がり方・調理上の注意',
    usageSub: '品質を最高に保つための利用指針',

    // 10. storage info
    storageHeader: '保存方法および取扱基準',
    storageSub: '適正保管条件',

    // 11. allergen info
    allergenAdvisoryHeader: 'アレルギー物質表示義務情報',
    allergenSub: '国際食品規格 Codex および各国食品表示基準準拠',

    // 12. Product Story
    storyHeader: '農園から食卓へ：持続可能な調達ストーリー',
    storyBadge: '100% 契約農家直接調達',

    // 13. manufactured by
    producerHeader: '公式製造者・輸出事業者',
    producerNameLabel: '製造事業者名',
    producerName: 'マヤニー・エンタープライズ (Mayany Enterprise)',

    // 14. address
    addressHeader: '事業所・加工施設所在地',
    addressLabel: '加工施設所在地',
    addressText: 'カンボジア王国 プノンペン市',
    originSourcingLabel: '原料原産地',
    originSourcingText: 'カンボジア王国 コンポントム州 契約農園',

    // 15. contact info
    contactHeader: '公式お問い合わせ窓口',
    phoneLabel: '電話番号',
    emailLabel: 'Eメール',
    websiteLabel: '公式ウェブサイト',
    facebookLabel: '公式SNS (Facebook)',

    // 16. mfd date
    mfdLabel: '製造年月日 (MFD)',
    mfdSub: '別添生産ラベル参照（受注生産）',

    // 17. exp date
    expLabel: '賞味期限 (EXP)',
    shelfLifeLabel: '公式品質保持期間',
    shelfLifeMonthsSuffix: 'ヶ月',

    // 18. Lot number
    lotLabel: '製造ロット番号 (LOT / Batch)',
    lotSub: 'トレーサビリティおよび品質管理識別コード（受注生産）',

    // Secondary Label (2nd Label) Packaging Specification Notice
    secondLabelNoticeTitle: '包装仕様に関する重要事項 (第2ラベル / 別添シール):',
    secondLabelNoticeText: '製造ロット番号、製造日(MFD)、賞味期限(EXP)は、受注生産ごとに本体の第2ラベル（別添ステッカー）に印字・打刻されます。',
    secondLabelJarNotice: 'PET/ガラス瓶用: 蓋または底面の別添シールにロット番号、MFD、EXPが印字されます。',
    secondLabelPouchNotice: 'パウチ用: 背面シールの打刻枠にロット番号、MFD、EXPが印字されます。',
    secondLabelBadge: '第2ラベル (別添シール)',

    // 19. barcode
    barcodeLabel: 'GS1 バーコード (EAN-13)',
    barcodeSub: '国際標準POS・レジ精算用公式一次元コード',

    // 20. product of cambodia & standards
    originBadge: 'カンボジア産 (Product of Cambodia)',
    productOfCambodiaTitle: 'カンボジア純正品（原産地証明）',
    standardsHeader: '公式品質および適合規格',
    standardsBadge: 'CS 001 認証規格',
    stdCs001Title: 'カンボジア国家規格 CS 001:2000',
    stdCs001Sub: 'MISTI 認証',
    stdGhpTitle: '適正衛生規範 (GHP)',
    stdGhpSub: '衛生加工管理',
    stdGmpTitle: '適正製造規範 (GMP)',
    stdGmpSub: '施設基準適合',
    stdHaccpTitle: 'HACCP 食品安全基準',
    stdHaccpSub: '重要管理点制御',
    stdEudrTitle: 'EU森林破壊防止規則 (EUDR)',
    stdEudrSub: '国際輸出適合',
    stdCamGapTitle: 'CamGAP 農業生産工程管理',
    stdCamGapSub: 'コンポントム契約農園',
    complianceIconsHeader: '包装適合性アイコン',
    iconRecyclable: 'リサイクル可能包装',
    iconAntiDrug: '違法薬物不使用認証',
    iconFoodGrade: '食品接触用安全素材',
    iconNoChemicals: '有害化学物質ゼロ',
    iconSupportKhmer: 'クメール農家支援',
    verificationHeader: '公式デジタル製品検証',
    qrScanNotice: 'スマートフォンで本QRコードをスキャンすると、リアルタイムでトレーサビリティおよびMISTI CS 001認証を照会できます。',
    digitalSealTitle: 'MISTI プロトコル',
    conformanceSealBadge: '品質適合性公式認証',
    cashewTraceProtocolBadge: 'CashewTrace トレーサビリティ 2026',

    // Utilities
    copyBtn: '証明書テキストをコピー',
    printBtn: '証明書を印刷 (PDF)',
    closeBtn: '閉じる',
    langSelectLabel: '証明書発行言語の選択',
    stampedNotice: '製造年月日(MFD)、賞味期限(EXP)、ロット番号(LOT)は、受注生産ごとに外装別添ラベルに打刻・印字されます。',
    stampedBadge: '別添ラベル打刻',
    printedNotice: 'ラベル印字済み',
    allergenWarningLabel: 'アレルギー物質に関する注意文',
    qrPassportLabel: 'デジタルパスポート (QR)',
    standardTitle: 'カンボジア国家規格 CS 001:2000',
    standardSubtitle: 'カンボジア工業・科学・技術・イノベーション省(MISTI / ISC) 包装規格技術文書',
    productIdentityTitle: '製品識別および植物分類 (PRODUCT IDENTITY)',
    botanicalSubtitleFallback: '厳選カンボジア産カシューナッツ (Anacardium occidentale)',
    batchHeader: '生産ロット・トレーサビリティ仕様（受注生産）',
    formulationHeader: '原材料配合明細（CS 001 規格第4.3条準拠）',
    usageLabel: '使用方法',
    storageLabel: '保存条件',
    labHeader: '検査機関による安全性・品質試験成績：',
    labBadge: '全項目規格適合 (100%)',
    labParamHeader: '試験項目',
    labLimitHeader: '国家規格基準値 (CS 001)',
    labResultHeader: '実測分析値',
    labStatusHeader: '判定',
    labMoistureLabel: '水分含有率',
    labMoistureLimit: '5.0%以下（質量比）',
    labDefectLabel: '欠陥・損傷粒混入率',
    labDefectLimit: '8.0%以下',
    labAflatoxinLabel: '総アフラトキシン (B1+B2+G1+G2)',
    labAflatoxinLimit: '4.0 ppb以下 (Codex基準)',
    labHeavyMetalsLabel: '重金属（鉛 Pb、カドミウム Cd）',
    labHeavyMetalsLimit: '0.1 mg/kg以下',
    labNonDetectable: '不検出 (<0.01)',
    labPass: '適合 (PASS)',
  },
};

// Aliases
CERTIFICATE_TRANSLATIONS.kh = CERTIFICATE_TRANSLATIONS.km;
