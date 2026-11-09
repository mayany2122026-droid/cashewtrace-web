/**
 * Official Mayany Enterprise Certified Product Registry
 * 
 * Strict authoritative product definitions to guarantee that every product link
 * and packaging QR code opens its exact, verified CS 001 digital certificate.
 * 
 * 100% Make-to-Order Architecture:
 * - Product identity, specifications, and barcodes are permanent per product.
 * - Lot numbers, MFG dates, and EXP dates are assigned fresh per order on an extra label.
 * - Permanent QR codes do not hardcode a single lot number.
 * - Full multilingual support: Khmer (National), English (Global), Korean (East Asia), Japanese (日本語 🇯🇵).
 */

export interface MayanyProductRecord {
  id: string;                      // Canonical ID, e.g. 'sugar-jar-175g'
  aliases: string[];               // All matching query IDs, presets, and slugs
  ean13: string;                   // Official GS1 Barcode (unique per SKU)
  batch: string;                   // Default MTO standard code
  weight: string;                  // Net weight, e.g. '175g', '1L', '200g', '50g'
  flavor: string;                  // Flavor classification code
  nameKh: string;                  // Official Khmer Product Name
  nameEn: string;                  // Official English Product Name
  nameKo: string;                  // Official Korean Product Name
  nameJa: string;                  // Official Japanese Product Name
  packageFormatKh: string;         // Packaging format description in Khmer
  packageFormatEn: string;         // Packaging format description in English
  packageFormatJa: string;         // Packaging format description in Japanese
  ingredientsKh: string;           // Khmer ingredients with percentages
  ingredientsEn: string;           // English ingredients
  ingredientsJa: string;           // Japanese ingredients
  cleanIngredients: string;        // Simple ingredient list
  allergenKh: string;              // Khmer allergen advice
  allergenEn: string;              // English allergen advice
  allergenJa: string;              // Japanese allergen advice
  storageKh: string;               // Khmer storage instructions
  storageEn: string;               // English storage instructions
  storageJa: string;               // Japanese storage instructions
  instructionsKh: string;          // Instructions for use
  instructionsEn: string;          // Instructions for use
  instructionsJa: string;          // Instructions for use
  shelfLifeMonths: number;         // Shelf life in months
  grade: string;                   // Cashew grade (WW180, BB, etc.)
  originKh: string;                // Country of origin (Khmer)
  originEn: string;                // Country of origin (English)
  originJa: string;                // Country of origin (Japanese)
  requiresRefrigeration: boolean;  // Requires refrigeration (<4°C)
  cashewPct: number;
  sugarPct: number;
  saltPct: number;
  spicePct: number;
  activeSpice: string;
  nutrition: {
    energyKcal: string;
    totalFat: string;
    saturatedFat: string;
    totalCarb: string;
    dietaryFiber: string;
    totalSugars: string;
    protein: string;
    sodium: string;
    salt: string;
  };
  descriptionKh: string;
  descriptionEn: string;
  descriptionJa: string;
}

export const CANONICAL_DOMAIN = 'https://mayanyenterprise.com';
export const FALLBACK_DOMAIN = 'https://cashewtrace.com';

export const MAYANY_PRODUCT_REGISTRY: MayanyProductRecord[] = [
  // 1. 100% Plant-Based Cashew Milk (1L Bottle) - Barcode: 8847116350054
  {
    id: 'cashew-milk-1l',
    aliases: [
      'cashew-milk-1l',
      'mayany-cashew-milk-1l',
      'cashew-milk',
      'milk-1l',
      'cashew_milk',
      'milk_natural',
      'MTO-CM-1L',
      '8847116350054'
    ],
    ean13: '8847116350054',
    batch: 'MTO-CM-1L',
    weight: '1L',
    flavor: 'cashew_milk',
    nameKh: 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០%',
    nameEn: '100% Plant-Based Cashew Milk',
    nameKo: '100% 순수 식물성 프리미엄 캐슈넛 밀크 (1L Bottle)',
    nameJa: '100%植物性カシューミルク (1Lボトル)',
    packageFormatKh: 'ដបកែវ ១ លីត្រ (1L Food-Grade Glass Bottle with Tamper Seal)',
    packageFormatEn: '1L Food-Grade Sanitary Glass Bottle with Tamper Evident Seal',
    packageFormatJa: '1000ml 食品用衛生ガラスボトル（密閉キャップ）',
    ingredientsKh: 'ទឹកចម្រោះ 86%, គ្រាប់ស្វាយចន្ទី 12.9%, ស្ករ 0.86%, ម្សៅស្លឹកតើយ 0.13%, អំបិល 0.09%',
    ingredientsEn: 'Purified water 86%, cashew kernels 12.9%, sugar 0.86%, pandan powder 0.13%, salt 0.09%',
    ingredientsJa: '精製水 86%、カシューナッツ 12.9%、砂糖 0.86%、パンダン粉末 0.13%、塩 0.09%',
    cleanIngredients: 'Water, cashew kernels, sugar, pandan powder, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ（特定原材料に準ずるもの）',
    storageKh: 'រក្សាទុកក្នុងទូទឹកកកក្រោម ៤°C ក្រោយពេលបើក។ ក្រឡុកដបឱ្យសព្វមុនពេលទទួលទាន។',
    storageEn: 'Serve hot, or keep refrigerated below 4°C. Consume by the expiry date.',
    storageJa: '要冷蔵（4℃以下保存）。開栓後は冷蔵庫に保管し賞味期限内にお召し上がりください。',
    instructionsKh: 'ភេសជ្ជៈប្រណិត អាចទទួលទានផ្ទាល់ភ្លាមៗ ឬលាយជាមួយកាហ្វេ តែ និងគ្រាប់ធញ្ញជាតិ។',
    instructionsEn: 'Ready-to-drink fresh beverage. Enjoy chilled or warmed, blend in smoothies or froth for artisan cashew lattes.',
    instructionsJa: 'ストレートでそのまま美味しくお召し上がりいただけます。温めてホットミルクや、カシューラテ用フォームミルクとしても最適です。',
    shelfLifeMonths: 3,
    grade: 'Premium Kernels (គ្រាប់កែច្នៃស្រស់)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: true,
    cashewPct: 12.9,
    sugarPct: 0.86,
    saltPct: 0.09,
    spicePct: 0.13,
    activeSpice: 'ម្សៅស្លឹកតើយ (Pandan)',
    nutrition: {
      energyKcal: '150',
      totalFat: '8.5',
      saturatedFat: '1.5',
      totalCarb: '16.0',
      dietaryFiber: '1.0',
      totalSugars: '3.5',
      protein: '4.0',
      sodium: '60',
      salt: '0.15'
    },
    descriptionKh: 'ទឹកដោះគោគ្រាប់ស្វាយចន្ទី ១០០% (Make-to-Order)។ តម្លាភាពតម្លៃសរុប ៤.៥០$ (ទឹកដោះគោ ៣.០០$ + ថ្លៃដបកែវ ១.៥០$)។ អតិថិជនអាចយកដបមកប្តូរទិញទឹកដោះគោលើកក្រោយក្នុងតម្លៃត្រឹមតែ ៣.០០$។ គ្មានជាតិទឹកដោះគោ (Dairy-Free) និងគ្មានសារធាតុរក្សាទុកគីមី។',
    descriptionEn: '100% Plant-Based Cambodian Cashew Milk. Transparent pricing: $4.50 Total ($3.00 Drink + $1.50 Glass Bottle). Bottle is exchangeable/reusable for future refills at $3.00 only. Naturally lactose-free, dairy-free, and rich in healthy plant protein.',
    descriptionJa: '100%植物性プレミアムカシューミルク。完全受注生産（Make-to-Order）。乳製品不使用（Dairy-Free）、保存料・人工添加物ゼロ。濃厚でクリーミーな味わいと良質な植物性タンパク質をお届けします。'
  },

  // 2. Chili Coated Cashew Kernels Jar (175g) Whole - Barcode: 8847116350092
  {
    id: 'chili-jar-175g',
    aliases: [
      'chili-jar-175g',
      'ww180-chili-jar-175g',
      'mayany-ww180-chili-jar-175g',
      'chili-jar',
      'chili_jar_175g',
      '2026-ckc-261j',
      '8847116350092'
    ],
    ean13: '8847116350092',
    batch: '2026-ckc-261j',
    weight: '175g',
    flavor: 'chili',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស',
    nameEn: 'Chili Coated Cashew Kernels Jar (175g) Whole',
    nameKo: '칠리 코팅 매콤 캐슈넛 (175g Jar)',
    nameJa: '有機チリコーティング カシューナッツ大粒 (175g 瓶)',
    packageFormatKh: 'ក្រឡបិទជិត ១៧៥g (175g Clear Air-Tight Induction Jar)',
    packageFormatEn: '175g Clear Air-Tight Food-Grade Jar with Induction Seal',
    packageFormatJa: '175g 食品用密閉ガラス瓶（誘導シール密封）',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩២%, ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 92%, Natural Chili 4%, Garlic 2%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 92%、有機赤唐辛子 4%、乾燥ガーリック 2%、天然海塩 2%',
    cleanIngredients: 'Cashew kernels, chili, garlic, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ បិទគម្របឱ្យជិតក្រោយពេលបើក។',
    storageEn: 'Store in a cool, dry place. Keep tightly closed after opening.',
    storageJa: '直射日光・高温多湿を避け、25℃以下の涼しい場所で密閉保存してください。',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ ឬក្លែមជាមួយភេសជ្ជៈ។',
    instructionsEn: 'Ready-to-eat gourmet spicy snack.',
    instructionsJa: 'そのまま香ばしいおつまみやおやつとしてお召し上がりいただけます。',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: false,
    cashewPct: 92,
    sugarPct: 0,
    saltPct: 2,
    spicePct: 4,
    activeSpice: 'ម្ទេសហិរធម្មជាតិ ៤%',
    nutrition: {
      energyKcal: '580',
      totalFat: '46.0',
      saturatedFat: '9.0',
      totalCarb: '27.0',
      dietaryFiber: '4.0',
      totalSugars: '5.2',
      protein: '18.5',
      sodium: '380',
      salt: '0.95'
    },
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរធម្មជាតិ ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទី WW180 កម្ពុជាគុណភាពខ្ពស់ ស្រោបម្ទេសធម្មជាតិ និងខ្ទឹមស។ ស្រួយឆ្ងាញ់ហឹរឈ្ងុយ គ្មានសារធាតុគីមីរក្សាទុក។',
    descriptionEn: 'Chili Coated Cashew Kernels combine crunchy WW180 King-Size cashews with authentic sun-dried Cambodian chili and aromatic garlic.',
    descriptionJa: 'カンボジア産最高峰キングサイズWW180カシューナッツに、天日干し唐辛子とガーリック、天然塩を香ばしくコーティングした旨辛スナック。'
  },

  // 3. GI Kampot Black Pepper Coated Cashew Kernels Jar (175g) Whole - Barcode: 8847116350061
  {
    id: 'pepper-jar-175g',
    aliases: [
      'pepper-jar-175g',
      'ww180-pepper-jar-175g',
      'mayany-ww180-pepper-jar-175g',
      'pepper-jar',
      'pepper_jar_175g',
      '2026-ckp-261j',
      '8847116350061'
    ],
    ean13: '8847116350061',
    batch: '2026-ckp-261j',
    weight: '175g',
    flavor: 'pepper',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI',
    nameEn: 'GI Kampot Black Pepper Coated Cashew Kernels Jar (175g) Whole',
    nameKo: 'GI 캄폿 후추 코팅 프리미엄 캐슈넛 (175g Jar)',
    nameJa: 'GIカンポット黒胡椒 カシューナッツ大粒 (175g 瓶)',
    packageFormatKh: 'ក្រឡបិទជិត ១៧៥g (175g Clear Air-Tight Induction Jar)',
    packageFormatEn: '175g Clear Air-Tight Food-Grade Jar with Induction Seal',
    packageFormatJa: '175g 食品用密閉ガラス瓶（誘導シール密封）',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩៣%, ម្រេចខ្មៅកំពត GI YAS ៥%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 93%, GI Kampot Black Pepper 5%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 93%、GI認定カンポット黒胡椒 5%、天然海塩 2%',
    cleanIngredients: 'Cashew kernels, GI Kampot black pepper, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ បិទគម្របឱ្យជិតក្រោយពេលបើក។',
    storageEn: 'Store in a cool, dry place. Keep tightly closed after opening.',
    storageJa: '直射日光・高温多湿を避け、涼しい乾燥した場所で密閉保存してください。',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ ឬក្លែមជាមួយភេសជ្ជៈ និងតែ។',
    instructionsEn: 'Ready-to-eat gourmet snack. Enjoy directly or serve with tea and fine beverages.',
    instructionsJa: 'そのまま風味豊かなおやつとして、または上質なお茶やお酒のお供としてお楽しみください。',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: false,
    cashewPct: 93,
    sugarPct: 0,
    saltPct: 2,
    spicePct: 5,
    activeSpice: 'ម្រេចខ្មៅកំពត GI YAS ៥%',
    nutrition: {
      energyKcal: '572',
      totalFat: '45.6',
      saturatedFat: '9.0',
      totalCarb: '28.4',
      dietaryFiber: '3.8',
      totalSugars: '5.0',
      protein: '18.8',
      sodium: '390',
      salt: '0.98'
    },
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ និងម្រេចខ្មៅកំពត GI ដ៏ល្បីល្បាញលើពិភពលោក។ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ CS 001 ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពតផ្តល់នូវរសជាតិឈ្ងុយហឹរស្រាល ស្រួយឆ្ងាញ់ធម្មជាតិ និងជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។',
    descriptionEn: 'GI Kampot Black Pepper Coated Cashew Kernels pair jumbo WW180 Cambodian cashews with world-renowned Protected Geographical Indication (GI) Kampot black pepper and natural sea salt.',
    descriptionJa: '世界的名声を誇る地理的表示(GI)保護認証の「カンポット黒胡椒」を贅沢に使用。大粒カシューナッツの甘みと胡椒の芳醇なアロマが絶妙に調和した逸品。'
  },

  // 4. Sugar Coated Cashew Kernels Jar (175g) Whole - Barcode: 8847116350085
  {
    id: 'sugar-jar-175g',
    aliases: [
      'sugar-jar-175g',
      'ww180-sugar-jar-175g',
      'mayany-ww180-sugar-jar-175g',
      'sugar-jar',
      'sugar_jar_175g',
      'sugar-coated-jar',
      '2026-cks-261j',
      '8847116350085'
    ],
    ean13: '8847116350085',
    batch: '2026-cks-261j',
    weight: '175g',
    flavor: 'sugar',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ',
    nameEn: 'Sugar Coated Cashew Kernels Jar (175g) Whole',
    nameKo: '슈가 코팅 프리미엄 캐슈넛 (175g Jar)',
    nameJa: 'シュガーコーティング カシューナッツ大粒 (175g 瓶)',
    packageFormatKh: 'ក្រឡបិទជិត ១៧៥g (175g Clear Air-Tight Induction Jar)',
    packageFormatEn: '175g Clear Air-Tight Food-Grade Jar with Induction Seal',
    packageFormatJa: '175g 食品用密閉ガラス瓶（誘導シール密封）',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩០%, ស្ករសធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 90%, Natural Sugar 8%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 90%、天然糖 8%、天然海塩 2%',
    cleanIngredients: 'Cashew kernels, sugar, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts / Tree nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ បិទគម្របឱ្យជិតក្រោយពេលបើក។',
    storageEn: 'Store in a cool, dry place. Keep tightly closed after opening.',
    storageJa: '直射日光・高温多湿を避け、涼しい乾燥した場所で密閉保存してください。',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ ឬប្រើជាបង្អែមស្រួយឆ្ងាញ់សម្រាប់ទទួលភ្ញៀវ។',
    instructionsEn: 'Ready-to-eat gourmet snack. Enjoy directly or serve with tea and desserts.',
    instructionsJa: 'そのままサクサク香ばしいおやつとして、またはデザートやお茶請けとしてお召し上がりいただけます。',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: false,
    cashewPct: 90,
    sugarPct: 8,
    saltPct: 2,
    spicePct: 0,
    activeSpice: 'ស្ករសធម្មជាតិ (Natural Sugar)',
    nutrition: {
      energyKcal: '590',
      totalFat: '43.0',
      saturatedFat: '8.4',
      totalCarb: '37.0',
      dietaryFiber: '3.0',
      totalSugars: '14.0',
      protein: '17.5',
      sodium: '320',
      salt: '0.80'
    },
    descriptionKh: 'គ្រាប់ស្វាយចន្ទី WW180 ស្រោបស្ករសធម្មជាតិ ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់បំផុត និងស្ករធម្មជាតិ។ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ CS 001 ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបស្ករផ្តល់នូវរសជាតិផ្អែមស្រាល ស្រួយឈ្ងុយឆ្ងាញ់ធម្មជាតិ និងជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។',
    descriptionEn: 'Sugar Coated Cashew Kernels are crafted from premium grade WW180 King-Size Cambodian cashews coated in natural golden sugar glaze and a pinch of sea salt. Meticulously roasted under CS 001 standards with zero artificial preservatives, colors, or flavors.',
    descriptionJa: '大粒WW180最高級カシューナッツに天然糖の薄い飴衣を丁寧にコーティング。ほんのり上品な甘さとカリッとした歯ごたえが特長の伝統菓子。'
  },

  // 5. 50g Pouches Whole - Sugar Coated Cashew Kernels - Barcode: 8847116350023
  {
    id: 'sugar-pouch-50g',
    aliases: [
      'sugar-pouch-50g',
      'ww180-sugar-pouch-50g',
      'mayany-ww180-sugar',
      'sugar-pouch',
      '2026-cks-261',
      '2026-cks-050',
      '8847116350023'
    ],
    ean13: '8847116350023',
    batch: '2026-cks-261',
    weight: '50g',
    flavor: 'sugar',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ',
    nameEn: '50g Pouches Whole - Sugar Coated Cashew Kernels',
    nameKo: '슈가 코팅 프리미엄 캐슈넛 (50g Pouch)',
    nameJa: 'シュガーコーティング カシューナッツ (50g パウチ)',
    packageFormatKh: 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)',
    packageFormatEn: '50g Food-Grade Stand-Up Barrier Pouch with Zipper',
    packageFormatJa: '50g チャック付き自立型アルミ防湿パウチ',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩០%, ស្ករសធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 90%, Natural Sugar 8%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 90%、天然糖 8%、天然海塩 2%',
    cleanIngredients: 'Cashew kernels, sugar, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។',
    storageEn: 'Store in a cool, dry place. Keep sealed.',
    storageJa: '直射日光・高温多湿を避け、涼しい場所でチャックを閉めて保存してください。',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ។',
    instructionsEn: 'Ready-to-eat gourmet snack.',
    instructionsJa: '手軽に持ち運べるおやつとしてお召し上がりください。',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: false,
    cashewPct: 90,
    sugarPct: 8,
    saltPct: 2,
    spicePct: 0,
    activeSpice: 'ស្ករសធម្មជាតិ (Natural Sugar)',
    nutrition: {
      energyKcal: '590',
      totalFat: '43.0',
      saturatedFat: '8.4',
      totalCarb: '37.0',
      dietaryFiber: '3.0',
      totalSugars: '14.0',
      protein: '17.5',
      sodium: '320',
      salt: '0.80'
    },
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករធម្មជាតិ កញ្ចប់ ៥០ ក្រាម ងាយស្រួលយកតាមខ្លួន ស្រួយឆ្ងាញ់ផ្អែមស្រាល។',
    descriptionEn: 'Sugar Coated Cashew Kernels in a convenient 50g stand-up zipper pouch.',
    descriptionJa: '持ち運びに便利な50gスタンドパウチ。やさしい甘さのシュガーコーティングカシューナッツ。'
  },

  // 6. 50g Pouches Whole - Chili Coated Cashew Kernels - Barcode: 8847116350078
  {
    id: 'chili-pouch-50g',
    aliases: [
      'chili-pouch-50g',
      'ww180-chili-pouch-50g',
      'mayany-ww180-chili',
      'chili-pouch',
      '2026-ckc-261',
      '2026-ckc-050',
      '8847116350078'
    ],
    ean13: '8847116350078',
    batch: '2026-ckc-261',
    weight: '50g',
    flavor: 'chili',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស',
    nameEn: '50g Pouches Whole - Chili Coated Cashew Kernels',
    nameKo: '칠리 코팅 매콤 캐슈넛 (50g Pouch)',
    nameJa: '有機チリコーティング カシューナッツ (50g パウチ)',
    packageFormatKh: 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)',
    packageFormatEn: '50g Food-Grade Stand-Up Barrier Pouch with Zipper',
    packageFormatJa: '50g チャック付き自立型アルミ防湿パウチ',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩២%, ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 92%, Natural Chili 4%, Garlic 2%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 92%、有機赤唐辛子 4%、乾燥ガーリック 2%、天然海塩 2%',
    cleanIngredients: 'Cashew kernels, chili, garlic, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។',
    storageEn: 'Store in a cool, dry place. Keep sealed.',
    storageJa: '直射日光・高温多湿を避け、涼しい場所でチャックを閉めて保存してください。',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ។',
    instructionsEn: 'Ready-to-eat gourmet spicy snack.',
    instructionsJa: '手軽に楽しめるスパイシーなおつまみとしてお召し上がりください。',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: false,
    cashewPct: 92,
    sugarPct: 0,
    saltPct: 2,
    spicePct: 4,
    activeSpice: 'ម្ទេសហិរធម្មជាតិ ៤%',
    nutrition: {
      energyKcal: '580',
      totalFat: '46.0',
      saturatedFat: '9.0',
      totalCarb: '27.0',
      dietaryFiber: '4.0',
      totalSugars: '5.2',
      protein: '18.5',
      sodium: '380',
      salt: '0.95'
    },
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរ កញ្ចប់ ៥០g ងាយស្រួលយកតាមខ្លួន ស្រួយឆ្ងាញ់ហឹរឈ្ងុយ។',
    descriptionEn: 'Chili Coated Cashew Kernels in a convenient 50g stand-up zipper pouch.',
    descriptionJa: 'ピリッと旨辛い有機唐辛子仕立ての50gパウチ。ビールやお酒のおつまみに最適です。'
  },

  // 7. 50g Pouches Whole - GI Kampot Black Pepper Coated Cashew Kernels - Barcode: 8847116350016
  {
    id: 'pepper-pouch-50g',
    aliases: [
      'pepper-pouch-50g',
      'ww180-pepper-pouch-50g',
      'mayany-ww180-pepper-5',
      'pepper-pouch',
      '2026-ckp-261',
      '2026-ckp-050',
      '8847116350016'
    ],
    ean13: '8847116350016',
    batch: '2026-ckp-261',
    weight: '50g',
    flavor: 'pepper',
    nameKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI',
    nameEn: '50g Pouches Whole - GI Kampot Black Pepper Coated Cashew Kernels',
    nameKo: 'GI 캄폿 후추 코팅 프리미엄 캐슈넛 (50g Pouch)',
    nameJa: 'GIカンポット黒胡椒 カシューナッツ (50g パウチ)',
    packageFormatKh: 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)',
    packageFormatEn: '50g Food-Grade Stand-Up Barrier Pouch with Zipper',
    packageFormatJa: '50g チャック付き自立型アルミ防湿パウチ',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩៣%, ម្រេចខ្មៅកំពត GI YAS ៥%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 93%, GI Kampot Black Pepper 5%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 93%、GI認定カンポット黒胡椒 5%、天然海塩 2%',
    cleanIngredients: 'Cashew kernels, GI Kampot black pepper, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។',
    storageEn: 'Store in a cool, dry place. Keep sealed.',
    storageJa: '直射日光・高温多湿を避け、涼しい場所でチャックを閉めて保存してください。',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ។',
    instructionsEn: 'Ready-to-eat gourmet snack.',
    instructionsJa: '手軽に楽しめる香り高いプレミアムナッツとしてお召し上がりください。',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: false,
    cashewPct: 93,
    sugarPct: 0,
    saltPct: 2,
    spicePct: 5,
    activeSpice: 'ម្រេចខ្មៅកំពត GI YAS ៥%',
    nutrition: {
      energyKcal: '572',
      totalFat: '45.6',
      saturatedFat: '9.0',
      totalCarb: '28.4',
      dietaryFiber: '3.8',
      totalSugars: '5.0',
      protein: '18.8',
      sodium: '390',
      salt: '0.98'
    },
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI កញ្ចប់ ៥០g ងាយស្រួលយកតាមខ្លួន ស្រួយឆ្ងាញ់ឈ្ងុយហឹរស្រាល។',
    descriptionEn: 'GI Kampot Black Pepper Coated Cashew Kernels in a convenient 50g stand-up zipper pouch.',
    descriptionJa: '世界遺産級の香りを誇るGI認定カンポット黒胡椒をまとわせた50gパウチ。'
  },

  // 8. 50g Pouches Broken Grade - GI Kampot Black Pepper Coated Cashew Kernels - Barcode: 8847116350108
  {
    id: 'pepper-broken-pouch-50g',
    aliases: [
      'pepper-broken-pouch-50g',
      'bb-pepper-pouch-50g',
      'mayany-bb-pepper-50g',
      'broken-pepper-pouch-50g',
      '2026-ckp-bb50',
      '8847116350108'
    ],
    ean13: '8847116350108',
    batch: '2026-ckp-261',
    weight: '50g',
    flavor: 'pepper',
    nameKh: 'គ្រាប់ស្វាយចន្ទីបាក់ស្រោបម្រេចខ្មៅកំពត GI (BB)',
    nameEn: '50g Pouches Broken Grade - GI Kampot Black Pepper Coated Cashew Kernels',
    nameKo: 'GI 캄폿 후추 코팅 조각 캐슈넛 (50g BB Pouch)',
    nameJa: 'GIカンポット黒胡椒 割れカシューナッツお徳用 (50g パウチ)',
    packageFormatKh: 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)',
    packageFormatEn: '50g Food-Grade Stand-Up Barrier Pouch with Zipper',
    packageFormatJa: '50g チャック付き自立型アルミ防湿パウチ',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទីបាក់ BB កម្ពុជា ៩៣%, ម្រេចខ្មៅកំពត GI YAS ៥%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Broken Cashews (BB) 93%, GI Kampot Black Pepper 5%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産割れカシューナッツ(BBグレード) 93%、GI認定カンポット黒胡椒 5%、天然海塩 2%',
    cleanIngredients: 'Broken cashew kernels (BB), GI Kampot black pepper, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។',
    storageEn: 'Store in a cool, dry place. Keep sealed.',
    storageJa: '直射日光・高温多湿を避け、涼しい場所でチャックを閉めて保存してください。',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ ឬប្រើជាគ្រឿងបន្ថែមលើម្ហូប។',
    instructionsEn: 'Ready-to-eat gourmet broken cashew snack.',
    instructionsJa: '手軽なおやつやおつまみはもちろん、サラダや料理のトッピングにも重宝します。',
    shelfLifeMonths: 9,
    grade: 'BB (Broken Kernels)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: false,
    cashewPct: 93,
    sugarPct: 0,
    saltPct: 2,
    spicePct: 5,
    activeSpice: 'ម្រេចខ្មៅកំពត GI YAS ៥%',
    nutrition: {
      energyKcal: '572',
      totalFat: '45.6',
      saturatedFat: '9.0',
      totalCarb: '28.4',
      dietaryFiber: '3.8',
      totalSugars: '5.0',
      protein: '18.8',
      sodium: '390',
      salt: '0.98'
    },
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីបាក់ (BB) ស្រោបម្រេចខ្មៅកំពត GI កញ្ចប់ ៥០g តម្លៃសមរម្យ រសជាតិឆ្ងាញ់ដូចគ្នា។',
    descriptionEn: 'Broken (BB) Kampot Black Pepper Cashews in a 50g pouch. Premium flavor at everyday value.',
    descriptionJa: '高品質BBグレード（割れ）カシューナッツを使用したお買い得パック。GIカンポット黒胡椒のスパイシーな風味はそのまま。'
  },

  // 9. 100% Pure Cashew Kernel Flour 200g Jar - Barcode: 8847116350047
  {
    id: 'cashew-powder-200g',
    aliases: [
      'cashew-powder-200g',
      'flour-jar-200g',
      'cashew-flour-200g',
      'pure-flour-200g',
      '2026-MAY-FLR',
      '8847116350047'
    ],
    ean13: '8847116350047',
    batch: '2026-MAY-FLR',
    weight: '200g',
    flavor: 'pure_flour',
    nameKh: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%',
    nameEn: '100% Pure Cashew Kernel Flour 200g Jar',
    nameKo: '100% 순수 캐슈넛 분말 가루 (200g Jar)',
    nameJa: '純カシューナッツ粉末 / ローストフラワー (200g 瓶)',
    packageFormatKh: 'ក្រឡកែវ/PET ២០០g (200g Clear Food-Grade Jar)',
    packageFormatEn: '200g Clear Food-Grade Sealed Jar',
    packageFormatJa: '200g 食品用密閉ガラス瓶',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០%',
    ingredientsEn: 'Cambodian Cashew Kernels 100%',
    ingredientsJa: 'カンボジア産ローストカシューナッツ 100%',
    cleanIngredients: '100% pure cashew kernels',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។',
    storageEn: 'Store in a cool, dry place. Keep tightly closed.',
    storageJa: '直射日光・高温多湿を避け、25℃以下の冷暗所で密閉保存してください。',
    instructionsKh: 'សម្រាប់ឆុងកាហ្វេ (Cashew Latte/Creamer) ធ្វើទឹកដោះគ្រាប់ ធ្វើនំ និងអាហារសុខភាព។',
    instructionsEn: 'Ideal for coffee creamer (cashew latte), plant milk, baking, and healthy cooking.',
    instructionsJa: 'カシューラテ用のコーヒークリーマー、自家製カシューミルク、製菓・グルテンフリー料理に幅広くご利用いただけます。',
    shelfLifeMonths: 9,
    grade: 'Pure Cold-Milled Kernel Flour',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    requiresRefrigeration: false,
    cashewPct: 100,
    sugarPct: 0,
    saltPct: 0,
    spicePct: 0,
    activeSpice: '',
    nutrition: {
      energyKcal: '575',
      totalFat: '46.0',
      saturatedFat: '9.0',
      totalCarb: '30.0',
      dietaryFiber: '3.3',
      totalSugars: '6.0',
      protein: '18.0',
      sodium: '8',
      salt: '0.00'
    },
    descriptionKh: 'ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ មិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។',
    descriptionEn: 'Pure cashew kernel flour produced from single-origin Cambodian cashews grown in Kampong Thom province. 100% natural, dairy-free, gluten-free, with zero added sugars, salt, or fillers.',
    descriptionJa: 'カンポン・トム州産の契約農家カシューナッツを100%使用した無添加パウダー。グルテンフリー、乳製品不使用。'
  }
];

/**
 * Strict product resolver that matches URL parameters to the authoritative Mayany registry.
 * 
 * Supports:
 * - Direct Barcode / EAN lookups (e.g. ?ean=8847116350085 or ?barcode=...)
 * - Product ID lookups (e.g. ?product=sugar-jar-175g)
 * - Legacy alias & preset lookups
 * - Make-to-Order safety: Never requires a hardcoded lot number!
 */
export function resolveMayanyProduct(params: URLSearchParams): MayanyProductRecord | null {
  const rawEan = (params.get('ean') || params.get('ean13') || params.get('barcode') || '').trim();
  const rawProduct = (params.get('product') || params.get('p') || '').trim().toLowerCase();
  const rawProdId = (params.get('prodId') || params.get('productId') || '').trim().toLowerCase();
  const rawPreset = (params.get('preset') || params.get('id') || '').trim().toLowerCase();
  const rawBatch = (params.get('batch') || params.get('lot') || '').trim().toLowerCase();
  const rawFlv = (params.get('flavor') || params.get('flv') || '').trim().toLowerCase();
  const rawWeight = (params.get('weight') || params.get('net') || '').trim().toLowerCase();

  // 1. Strict match by EAN Barcode (strongest permanent unique identifier)
  if (rawEan) {
    const byEan = MAYANY_PRODUCT_REGISTRY.find(p => p.ean13 === rawEan);
    if (byEan) return byEan;
  }

  // 2. Strict match by Product ID / Alias / Preset ID
  const searchId = rawProduct || rawProdId || rawPreset;
  if (searchId) {
    const byId = MAYANY_PRODUCT_REGISTRY.find(p => 
      p.id.toLowerCase() === searchId || 
      p.aliases.some(a => a.toLowerCase() === searchId)
    );
    if (byId) return byId;

    // Substring or prefix match for common slugs
    if (searchId.includes('sugar') && (searchId.includes('175') || searchId.includes('jar'))) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'sugar-jar-175g') || null;
    }
    if (searchId.includes('sugar') && (searchId.includes('50') || searchId.includes('pouch'))) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'sugar-pouch-50g') || null;
    }
    if (searchId.includes('milk') || searchId.includes('drink')) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'cashew-milk-1l') || null;
    }
    if (searchId.includes('flour') || searchId.includes('powder')) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'cashew-powder-200g') || null;
    }
    if (searchId.includes('pepper') && (searchId.includes('175') || searchId.includes('jar'))) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'pepper-jar-175g') || null;
    }
    if (searchId.includes('pepper') && (searchId.includes('50') || searchId.includes('pouch')) && (searchId.includes('bb') || searchId.includes('broken'))) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'pepper-broken-pouch-50g') || null;
    }
    if (searchId.includes('pepper') && (searchId.includes('50') || searchId.includes('pouch'))) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'pepper-pouch-50g') || null;
    }
    if (searchId.includes('chili') && (searchId.includes('175') || searchId.includes('jar'))) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'chili-jar-175g') || null;
    }
    if (searchId.includes('chili') && (searchId.includes('50') || searchId.includes('pouch'))) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'chili-pouch-50g') || null;
    }
  }

  // 3. Match by Batch ID (for legacy scans or order-specific lookups)
  if (rawBatch && rawBatch !== 'mto' && rawBatch !== 'mto-cm-1l') {
    // Flour
    if (rawBatch.includes('flr') || rawBatch.includes('may-flr')) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'cashew-powder-200g') || null;
    }
    // Sugar jar vs pouch
    if (rawBatch.includes('cks')) {
      if (rawBatch.includes('261j') || rawBatch.includes('175') || rawWeight === '175g') {
        return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'sugar-jar-175g') || null;
      }
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'sugar-pouch-50g') || null;
    }
    // Pepper jar vs pouch vs bb
    if (rawBatch.includes('ckp')) {
      if (rawBatch.includes('261j') || rawBatch.includes('175') || rawWeight === '175g') {
        return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'pepper-jar-175g') || null;
      }
      if (rawBatch.includes('bb')) {
        return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'pepper-broken-pouch-50g') || null;
      }
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'pepper-pouch-50g') || null;
    }
    // Chili jar vs pouch
    if (rawBatch.includes('ckc') || rawBatch.includes('chl')) {
      if (rawBatch.includes('261j') || rawBatch.includes('175') || rawWeight === '175g') {
        return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'chili-jar-175g') || null;
      }
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'chili-pouch-50g') || null;
    }
  }

  // 4. Match by Flavor + Weight combination
  if (rawFlv) {
    if (rawFlv.includes('milk')) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'cashew-milk-1l') || null;
    }
    if (rawFlv === 'pure_flour' || rawFlv.includes('flour')) {
      return MAYANY_PRODUCT_REGISTRY.find(p => p.id === 'cashew-powder-200g') || null;
    }
    if (rawFlv === 'sugar') {
      return MAYANY_PRODUCT_REGISTRY.find(p => rawWeight === '175g' ? p.id === 'sugar-jar-175g' : p.id === 'sugar-pouch-50g') || null;
    }
    if (rawFlv === 'pepper') {
      return MAYANY_PRODUCT_REGISTRY.find(p => rawWeight === '175g' ? p.id === 'pepper-jar-175g' : p.id === 'pepper-pouch-50g') || null;
    }
    if (rawFlv === 'chili') {
      return MAYANY_PRODUCT_REGISTRY.find(p => rawWeight === '175g' ? p.id === 'chili-jar-175g' : p.id === 'chili-pouch-50g') || null;
    }
  }

  return null;
}

/**
 * Builds the official, single canonical passport URL for any product.
 * 
 * Make-to-Order Clean Format:
 * Permanently points to the verified Product ID and EAN barcode, with zero static batch locked in.
 */
export function buildCanonicalProductPassportUrl(
  productId: string,
  domain: string = CANONICAL_DOMAIN
): string {
  const prod = MAYANY_PRODUCT_REGISTRY.find(p => p.id === productId || p.aliases.includes(productId)) || MAYANY_PRODUCT_REGISTRY[0];
  const cleanDomain = domain.replace(/\/+$/, '');
  return `${cleanDomain}/?mode=passport&product=${prod.id}&view=certificate&project=passport`;
}
