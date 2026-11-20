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
  nameFr: string;                  // Official French Product Name
  packageFormatKh: string;         // Packaging format description in Khmer
  packageFormatEn: string;         // Packaging format description in English
  packageFormatJa: string;         // Packaging format description in Japanese
  packageFormatFr: string;         // Packaging format description in French
  packageFormatKo?: string;        // Packaging format description in Korean
  ingredientsKh: string;           // Khmer ingredients with percentages
  ingredientsEn: string;           // English ingredients
  ingredientsJa: string;           // Japanese ingredients
  ingredientsFr: string;           // French ingredients
  ingredientsKo?: string;          // Korean ingredients
  cleanIngredients: string;        // Simple ingredient list
  allergenKh: string;              // Khmer allergen advice
  allergenEn: string;              // English allergen advice
  allergenJa: string;              // Japanese allergen advice
  allergenFr: string;              // French allergen advice
  allergenKo?: string;             // Korean allergen advice
  storageKh: string;               // Khmer storage instructions
  storageEn: string;               // English storage instructions
  storageJa: string;               // Japanese storage instructions
  storageFr: string;               // French storage instructions
  storageKo?: string;              // Korean storage instructions
  instructionsKh: string;          // Instructions for use
  instructionsEn: string;          // Instructions for use
  instructionsJa: string;          // Instructions for use
  instructionsFr: string;          // Instructions for use (French)
  instructionsKo?: string;         // Instructions for use (Korean)
  shelfLifeMonths: number;         // Shelf life in months
  grade: string;                   // Cashew grade (WW180, BB, etc.)
  originKh: string;                // Country of origin (Khmer)
  originEn: string;                // Country of origin (English)
  originJa: string;                // Country of origin (Japanese)
  originFr: string;                // Country of origin (French)
  originKo?: string;               // Country of origin (Korean)
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
  descriptionFr: string;
  descriptionKo?: string;
  storyKh?: string;
  storyEn?: string;
  storyFr?: string;
  storyKo?: string;
  storyJa?: string;
  benefitsByLang?: Partial<Record<'km' | 'en' | 'fr' | 'ko' | 'ja', Array<{ title: string; desc?: string }>>>;
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
    nameFr: 'Lait de Noix de Cajou 100% Végétal (Bouteille 1L)',
    packageFormatKh: 'ដបកែវ ១ លីត្រ (1L Food-Grade Glass Bottle with Tamper Seal)',
    packageFormatEn: '1L Food-Grade Sanitary Glass Bottle with Tamper Evident Seal',
    packageFormatJa: '1000ml 食品用衛生ガラスボトル（密閉キャップ）',
    packageFormatFr: 'Bouteille en Verre Sanitaire de Qualité Alimentaire 1L avec Bague d\'Inviolabilité',
    ingredientsKh: 'ទឹកចម្រោះ 86%, គ្រាប់ស្វាយចន្ទី 12.9%, ស្ករ 0.86%, ម្សៅស្លឹកតើយ 0.13%, អំបិល 0.09%',
    ingredientsEn: 'Purified water 86%, cashew kernels 12.9%, sugar 0.86%, pandan powder 0.13%, salt 0.09%',
    ingredientsJa: '精製水 86%、カシューナッツ 12.9%、砂糖 0.86%、パンダン粉末 0.13%、塩 0.09%',
    ingredientsFr: 'Eau purifiée 86%, noix de cajou 12,9%, sucre naturel 0,86%, poudre de feuilles de pandan 0,13%, sel 0,09%',
    cleanIngredients: 'Water, cashew kernels, sugar, pandan powder, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ（特定原材料に準ずるもの）',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'រក្សាទុកក្នុងទូទឹកកកក្រោម ៤°C ក្រោយពេលបើក។ ក្រឡុកដបឱ្យសព្វមុនពេលទទួលទាន។',
    storageEn: 'Serve hot, or keep refrigerated below 4°C. Consume by the expiry date.',
    storageJa: '要冷蔵（4℃以下保存）。開栓後は冷蔵庫に保管し賞味期限内にお召し上がりください。',
    storageFr: 'À déguster chaud, ou à conserver au réfrigérateur en dessous de 4°C. Consommer avant la date limite.',
    instructionsKh: 'ភេសជ្ជៈប្រណិត អាចទទួលទានផ្ទាល់ភ្លាមៗ ឬលាយជាមួយកាហ្វេ តែ និងគ្រាប់ធញ្ញជាតិ។',
    instructionsEn: 'Ready-to-drink fresh beverage. Enjoy chilled or warmed, blend in smoothies or froth for artisan cashew lattes.',
    instructionsJa: 'ストレートでそのまま美味しくお召し上がりいただけます。温めてホットミルクや、カシューラテ用フォームミルクとしても最適です。',
    instructionsFr: 'Boisson fraîche prête à boire. À savourer bien fraîche ou chaude, en smoothie ou émulsionnée pour un Cashew Latte artisanal.',
    shelfLifeMonths: 3,
    grade: 'Premium Kernels (គ្រាប់កែច្នៃស្រស់)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    originFr: 'Royaume du Cambodge (Produit du Cambodge)',
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
    descriptionJa: '100%植物性プレミアムカシューミルク。完全受注生産（Make-to-Order）。乳製品不使用（Dairy-Free）、保存料・人工添加物ゼロ。濃厚でクリーミーな味わいと良質な植物性タンパク質をお届けします。',
    descriptionFr: 'Lait de noix de cajou 100% végétal du Cambodge (Fabriqué à la commande). Tarification transparente : 4,50 $ au total (3,00 $ boisson + 1,50 $ bouteille en verre consigne réutilisable). Naturellement sans lactose et sans produits laitiers.'
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
    nameFr: 'Noix de Cajou Entières Enrobées au Piment (Bocal 175 g)',
    packageFormatKh: 'ក្រឡបិទជិត ១៧៥g (175g Clear Air-Tight Induction Jar)',
    packageFormatEn: '175g Clear Air-Tight Food-Grade Jar with Induction Seal',
    packageFormatJa: '175g 食品用密閉ガラス瓶（誘導シール密封）',
    packageFormatFr: 'Bocal Alimentaire Hermétique Transparent 175 g avec Opercule à Induction',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩២%, ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 92%, Natural Chili 4%, Garlic 2%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 92%、有機赤唐辛子 4%、乾燥ガーリック 2%、天然海塩 2%',
    ingredientsFr: 'Noix de cajou du Cambodge (WW180) 92%, piment naturel 4%, ail 2%, sel de mer 2%',
    cleanIngredients: 'Cashew kernels, chili, garlic, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ បិទគម្របឱ្យជិតក្រោយពេលបើក។',
    storageEn: 'Store in a cool, dry place. Keep tightly closed after opening.',
    storageJa: '直射日光・高温多湿を避け、25℃以下の涼しい場所で密閉保存してください。',
    storageFr: 'Conserver dans un endroit frais et sec (< 25°C). Bien refermer après ouverture.',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ ឬក្លែមជាមួយភេសជ្ជៈ។',
    instructionsEn: 'Ready-to-eat gourmet spicy snack.',
    instructionsJa: 'そのまま香ばしいおつまみやおやつとしてお召し上がりいただけます。',
    instructionsFr: 'Collation gastronomique épicée prête à déguster, idéale à l\'apéritif.',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    originFr: 'Royaume du Cambodge (Produit du Cambodge)',
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
    descriptionJa: 'カンボジア産最高峰キングサイズWW180カシューナッツに、天日干し唐辛子とガーリック、天然塩を香ばしくコーティングした旨辛スナック。',
    descriptionFr: 'Nos noix de cajou entières calibrées WW180 King-Size sont délicatement torréfiées et enrobées de piment cambodgien séché au soleil et d\'ail aromatique.'
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
    nameEn: 'GI Kampot Black Pepper Coated Cashew Kernels',
    nameKo: 'GI 캄폿 흑후추 코팅 통 캐슈넛 (WW180 • 175g PET 용기)',
    nameJa: 'GIカンポット黒胡椒コーティング カシューナッツ大粒 (WW180 • 175g)',
    nameFr: 'Noix de Cajou Entières Enrobées au Poivre Noir de Kampot IGP (Bocal 175 g)',
    packageFormatKh: 'កំប៉ុង PET ១៧៥ ក្រាម បិទជិត',
    packageFormatEn: '175g Sealed PET Jar',
    packageFormatKo: '175g 밀폐 PET 용기 (Sealed PET Jar)',
    packageFormatJa: '175g 密閉PETジャー（食品用シール密封）',
    packageFormatFr: 'Bocal PET Hermétique 175 g',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 ៩៥.០%, ម្រេចខ្មៅកំពត GI ៤.៧%, ស្ករ ០.៣%, អំបិល ០.០២%',
    ingredientsEn: 'Cashew kernels (WW180) 95.0%, GI Kampot black pepper 4.7%, sugar 0.3%, salt 0.02%',
    ingredientsKo: '통 캐슈넛(WW180) 95.0%, GI 캄폿 흑후추 4.7%, 설탕 0.3%, 소금 0.02%',
    ingredientsJa: 'カシューナッツ大粒(WW180) 95.0%、GIカンポット黒胡椒 4.7%、砂糖 0.3%、塩 0.02%',
    ingredientsFr: 'Noix de cajou entières (WW180) 95,0%, poivre noir de Kampot IGP 4,7%, sucre 0,3%, sel 0,02%',
    cleanIngredients: 'Cashew kernels (WW180) 95.0%, GI Kampot black pepper 4.7%, sugar 0.3%, salt 0.02%',
    allergenKh: 'មានផ្ទុកគ្រាប់ស្វាយចន្ទី (គ្រាប់ឈើ)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenKo: '알레르기 유발물질: 견과류(캐슈넛) 함유',
    allergenJa: 'アレルギー物質表示：カシューナッツ（木の実）を含む',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'ទុកកន្លែងត្រជាក់ និងស្ងួត។ បិទគម្របឱ្យជិតក្រោយបើក។',
    storageEn: 'Store in a cool and dry place. Keep lid tightly closed after opening.',
    storageKo: '서늘하고 건조한 곳에 보관하십시오. 개봉 후 뚜껑을 꼭 닫아 보관하십시오.',
    storageJa: '涼しく乾燥した場所に保管してください。開封後は蓋をしっかり閉めてください。',
    storageFr: 'À conserver dans un endroit frais et sec. Bien refermer le couvercle après ouverture.',
    instructionsKh: '• ញ៉ាំភ្លាមជាអាហារសម្រន់\n• ញ៉ាំជាមួយតែ កាហ្វេ ឬភេសជ្ជៈ\n• ក្រឡុកលើសាឡាត់ ឬម្ហូប\n• ជាអំណោយ',
    instructionsEn: '• Enjoy directly as a ready-to-eat snack\n• Pair with tea, coffee, or beverages\n• Sprinkle over salads or dishes\n• Ideal as a thoughtful gift',
    instructionsKo: '• 별도 조리 없이 바로 간식으로 섭취\n• 차, 커피 또는 음료와 함께 즐기기\n• 샐러드나 요리 토핑으로 활용\n• 품격 있는 선물용으로 추천',
    instructionsJa: '• そのままスナックとしてお召し上がりください\n• お茶、コーヒー、お好みのドリンクと一緒に\n• サラダや料理にふりかけて\n• 大切な方への贈り物・ギフトにも最適',
    instructionsFr: '• À déguster directement comme collation gastronomique\n• À savourer avec du thé, du café ou des boissons\n• À parsemer sur vos salades ou plats\n• Idéal comme cadeau gourmand',
    shelfLifeMonths: 9,
    grade: 'WW180 (Whole Kernels)',
    originKh: 'ខេត្តកំពង់ធំ ប្រទេសកម្ពុជា',
    originEn: 'Kampong Thom Province, Cambodia',
    originKo: '캄보디아 캄퐁톰 주',
    originJa: 'カンボジア王国 コンポントム州',
    originFr: 'Province de Kampong Thom, Cambodge',
    requiresRefrigeration: false,
    cashewPct: 95.0,
    sugarPct: 0.3,
    saltPct: 0.02,
    spicePct: 4.7,
    activeSpice: 'ម្រេចខ្មៅកំពត GI ៤.៧%',
    nutrition: {
      energyKcal: '560',
      totalFat: '44',
      saturatedFat: '9',
      totalCarb: '34',
      dietaryFiber: '4',
      totalSugars: '5',
      protein: '15',
      sodium: '20',
      salt: '0.05'
    },
    descriptionKh: 'ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI របស់ MAYANY Enterprise ធ្វើពីគ្រាប់ស្វាយចន្ទីទាំងមូលថ្នាក់ WW180 អាំងស្រួយ ហើយស្រោបដោយម្រេចខ្មៅកំពតដែលមានសញ្ញាបញ្ជាក់ភូមិសាស្ត្រ (GI)។ ម្រេចជាប់ជុំវិញគ្រាប់ ផ្តល់ក្លិនក្រអូប និងរសជាតិស្រាលៗ ឆ្ងាញ់ល្មម។ ញ៉ាំជាអាហារសម្រន់ ឬជាមួយភេសជ្ជៈ។ ដាក់ក្នុងកំប៉ុង PET ១៧៥ ក្រាម បិទជិត រក្សាភាពស្រួយ។',
    descriptionEn: 'MAYANY Enterprise GI Kampot Black Pepper Coated Cashew Kernels are crafted from crispy roasted whole WW180 cashew kernels coated with authentic Geographical Indication (GI) Kampot black pepper. Every kernel is evenly coated to deliver a fragrant aroma and balanced mild pepper flavor, ideal as an everyday snack or beverage pairing in a sealed 175g PET jar for lasting crispness.',
    descriptionFr: 'Les noix de cajou enrobées au poivre noir de Kampot IGP de MAYANY Enterprise sont préparées à partir de noix entières de calibre WW180 grillées et croquantes, enrobées de véritable poivre noir de Kampot certifié Indication Géographique (IGP). Chaque noix révèle un parfum intense et une saveur équilibrée, présentée dans un bocal PET hermétique de 175 g pour préserver tout le croquant.',
    descriptionKo: 'MAYANY Enterprise의 GI 캄폿 흑후추 코팅 캐슈넛은 바삭하게 구운 최상급 통캐슈넛(WW180)에 지리적 표시(GI) 인증 캄폿 흑후추를 고르게 입혀 만든 제품입니다. 풍부한 향과 과하지 않은 깔끔한 맛으로 간식이나 음료 페어링에 잘 어울리며, 175g 밀폐 PET 용기에 담아 바삭한 식감을 오래 유지합니다.',
    descriptionJa: 'MAYANY EnterpriseのGIカンポット黒胡椒コーティングカシューナッツは、香ばしくローストした丸粒WW180等級のカシューナッツに地理的表示（GI）認定カンポット黒胡椒をまとわせた逸品です。粒全体に均一に絡む芳醇な香りとまろやかな辛味が魅力で、175g密閉PETジャーがサクサクの食感と鮮度を保ちます。',
    storyKh: 'យើងឃើញថា ស្វាយចន្ទី និងម្រេចកំពត GI ជាផលិតផលពិសេសរបស់កម្ពុជា ដែលអាចរួមគ្នាបង្កើតរសជាតិថ្មី។ MAYANY Enterprise បានស្រោបម្រេចខ្មៅកំពតលើគ្រាប់ស្វាយចន្ទី ដោយប្រើតែគ្រឿងផ្សំក្នុងស្រុក។\n\nអតិថិជនបានបញ្ជាទិញម្តងទៀត តាមរយៈការប្រាប់ពីមាត់ទៅមាត់។\n\nគ្រប់ដបទាំងអស់ជួយពង្រឹងជីវភាពគ្រួសារកសិករចម្ការស្វាយចន្ទី និងចម្ការម្រេច ដើម្បីឱ្យពួកគាត់បន្តផលិតបានល្អបំផុតសម្រាប់ពិភពលោក។',
    storyEn: 'We saw that Cambodian cashew nuts and GI Kampot pepper are signature national treasures that come together naturally to create an unforgettable flavor. MAYANY Enterprise coats roasted whole cashews with authentic GI Kampot black pepper using 100% locally sourced ingredients.\n\nCustomers keep reordering again and again through genuine word-of-mouth.\n\nEvery jar helps strengthen the livelihoods of cashew and Kampot pepper farming families so they can continue producing Cambodia’s finest harvest for the world.',
    storyFr: 'Nous avons uni deux trésors emblématiques du Cambodge : la noix de cajou et le poivre noir de Kampot IGP, pour créer une saveur unique. MAYANY Enterprise enrobe ses noix de cajou entières de poivre de Kampot IGP en utilisant exclusivement des ingrédients locaux.\n\nNos clients commandent à nouveau grâce au bouche-à-oreille authentique.\n\nChaque bocal contribue à renforcer les revenus des familles de producteurs de cajou et de poivre de Kampot afin qu’elles continuent d’offrir le meilleur au monde.',
    storyKo: '저희는 캄보디아를 대표하는 두 특산물인 캐슈넛과 GI 캄폿 흑후추가 만나 특별한 새로운 풍미를 만들어낼 수 있다고 믿었습니다. MAYANY Enterprise는 100% 현지 원재료만을 사용하여 통캐슈넛에 정품 캄폿 흑후추를 정성스럽게 코팅했습니다.\n\n진정성 있는 입소문을 통해 고객들의 재주문이 꾸준히 이어지고 있습니다.\n\n한 병 한 병이 캐슈넛과 캄폿 후추 농가 가족들의 생계를 더욱 튼튼히 하여, 세계에 최고의 농산물을 계속 선보일 수 있도록 돕습니다.',
    storyJa: 'カンボジアを代表する2つの特産品であるカシューナッツとGIカンポット黒胡椒を組み合わせることで、新しい美味しさが生まれると考えました。MAYANY Enterpriseは100%国内産の原材料のみを使い、丸粒カシューナッツに本物のカンポット黒胡椒をまとわせています。\n\n口コミで評判が広がり、多くのお客様からリピート注文をいただいています。\n\n一瓶ごとにカシューナッツ農家とカンポット胡椒農家の暮らしを支え、世界へ最高品質を届け続ける力になっています。',
    benefitsByLang: {
      km: [
        { title: 'ជាប្រភពប្រូតេអ៊ីន និងខ្លាញ់ល្អពីរុក្ខជាតិ' },
        { title: 'មានម្រេចខ្មៅកំពត GI ពិតប្រាកដ' },
        { title: 'គ្មានទឹកដោះគោ (ស្រោបដោយទឹកគ្រាប់ស្វាយចន្ទី)' },
        { title: 'មិនមានសារធាតុការពារ គ្មានពណ៌ ឬរសជាតិសិប្បនិម្មិត' },
        { title: 'ស្ករ និងអំបិលតិចតួចបំផុត' },
        { title: 'គ្រឿងផ្សំផលិតក្នុងស្រុកទាំងអស់' }
      ],
      en: [
        { title: 'Plant-based source of protein and healthy fats' },
        { title: 'Made with authentic GI Kampot black pepper' },
        { title: 'Dairy-free — glazed with natural cashew milk' },
        { title: 'Zero preservatives, artificial colors, or artificial flavors' },
        { title: 'Minimal sugar and sea salt' },
        { title: '100% locally produced ingredients in Cambodia' }
      ],
      fr: [
        { title: 'Source végétale de protéines et de bons lipides' },
        { title: 'Préparé avec du véritable poivre noir de Kampot IGP' },
        { title: 'Sans produits laitiers — enrobé au lait de cajou' },
        { title: 'Sans conservateurs, ni colorants ou arômes artificiels' },
        { title: 'Très faible teneur en sucre et en sel' },
        { title: 'Ingrédients 100 % cultivés et transformés au Cambodge' }
      ],
      ko: [
        { title: '식물성 단백질과 건강한 불포화지방 공급원' },
        { title: '정품 GI 캄폿 흑후추 사용' },
        { title: '유제품 무첨가 — 천연 캐슈넛 밀크 코팅' },
        { title: '방부제, 인공 색소 및 인공 향료 무첨가' },
        { title: '설탕과 소금 함량을 최소화한 담백한 배합' },
        { title: '100% 캄보디아 현지 원재료 사용' }
      ],
      ja: [
        { title: '植物性タンパク質と良質な脂質の供給源' },
        { title: '本物のGI認定カンポット黒胡椒を使用' },
        { title: '乳製品不使用 — 自家製カシューミルクでコーティング' },
        { title: '保存料・合成着色料・合成香料不使用' },
        { title: '砂糖と塩を最小限に抑えた自然な味わい' },
        { title: '100%カンボジア国内産の原材料を使用' }
      ]
    }
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
    nameFr: 'Noix de Cajou Entières Caramélisées au Sucre Naturel (Bocal 175 g)',
    packageFormatKh: 'ក្រឡបិទជិត ១៧៥g (175g Clear Air-Tight Induction Jar)',
    packageFormatEn: '175g Clear Air-Tight Food-Grade Jar with Induction Seal',
    packageFormatJa: '175g 食品用密閉ガラス瓶（誘導シール密封）',
    packageFormatFr: 'Bocal Alimentaire Hermétique Transparent 175 g avec Opercule à Induction',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩០%, ស្ករសធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 90%, Natural Sugar 8%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 90%、天然糖 8%、天然海塩 2%',
    ingredientsFr: 'Noix de cajou du Cambodge (WW180) 90%, sucre naturel 8%, sel de mer 2%',
    cleanIngredients: 'Cashew kernels, sugar, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts / Tree nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ បិទគម្របឱ្យជិតក្រោយពេលបើក។',
    storageEn: 'Store in a cool, dry place. Keep tightly closed after opening.',
    storageJa: '直射日光・高温多湿を避け、涼しい乾燥した場所で密閉保存してください。',
    storageFr: 'Conserver dans un endroit frais et sec (< 25°C). Bien refermer après ouverture.',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ ឬប្រើជាបង្អែមស្រួយឆ្ងាញ់សម្រាប់ទទួលភ្ញៀវ។',
    instructionsEn: 'Ready-to-eat gourmet snack. Enjoy directly or serve with tea and desserts.',
    instructionsJa: 'そのままサクサク香ばしいおやつとして、またはデザートやお茶請けとしてお召し上がりいただけます。',
    instructionsFr: 'Collation gourmande et croquante prête à déguster, idéale avec le café, le thé ou en dessert.',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    originFr: 'Royaume du Cambodge (Produit du Cambodge)',
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
    descriptionJa: '大粒WW180最高級カシューナッツに天然糖の薄い飴衣を丁寧にコーティング。ほんのり上品な甘さとカリッとした歯ごたえが特長の伝統菓子。',
    descriptionFr: 'Noix de cajou géantes WW180 du Cambodge délicatement enrobées d\'un fin glaçage de sucre naturel doré et d\'une pointe de fleur de sel marin, torréfiées sans aucun conservateur selon la norme CS 001.'
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
    nameFr: 'Noix de Cajou Caramélisées au Sucre Naturel (Sachet 50 g)',
    packageFormatKh: 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)',
    packageFormatEn: '50g Food-Grade Stand-Up Barrier Pouch with Zipper',
    packageFormatJa: '50g チャック付き自立型アルミ防湿パウチ',
    packageFormatFr: 'Sachet Stand-Up Hermétique avec Zip Refermable 50 g',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩០%, ស្ករសធម្មជាតិ ៨%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 90%, Natural Sugar 8%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 90%、天然糖 8%、天然海塩 2%',
    ingredientsFr: 'Noix de cajou du Cambodge (WW180) 90%, sucre naturel 8%, sel de mer 2%',
    cleanIngredients: 'Cashew kernels, sugar, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។',
    storageEn: 'Store in a cool, dry place. Keep sealed.',
    storageJa: '直射日光・高温多湿を避け、涼しい場所でチャックを閉めて保存してください。',
    storageFr: 'Conserver dans un endroit frais et sec (< 25°C). Bien refermer le zip après ouverture.',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ។',
    instructionsEn: 'Ready-to-eat gourmet snack.',
    instructionsJa: '手軽に持ち運べるおやつとしてお召し上がりください。',
    instructionsFr: 'En-cas gastronomique croquant prêt à savourer à tout moment.',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    originFr: 'Royaume du Cambodge (Produit du Cambodge)',
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
    descriptionJa: '持ち運びに便利な50gスタンドパウチ。やさしい甘さのシュガーコーティングカシューナッツ。',
    descriptionFr: 'Noix de cajou entières caramélisées au sucre naturel en format nomade pratique de 50 g avec zip fraîcheur.'
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
    nameFr: 'Noix de Cajou Enrobées au Piment (Sachet 50 g)',
    packageFormatKh: 'កញ្ចប់បាតឈរ ៥០g ជាមួយខ្សែរូត (50g Standing Pouch with Zipper)',
    packageFormatEn: '50g Food-Grade Stand-Up Barrier Pouch with Zipper',
    packageFormatJa: '50g チャック付き自立型アルミ防湿パウチ',
    packageFormatFr: 'Sachet Stand-Up Hermétique avec Zip Refermable 50 g',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 កម្ពុជា ៩២%, ម្ទេសហិរធម្មជាតិ ៤%, ខ្ទឹមស ២%, អំបិលសមុទ្រ ២%',
    ingredientsEn: 'Cambodian Cashew Kernels (WW180) 92%, Natural Chili 4%, Garlic 2%, Sea Salt 2%',
    ingredientsJa: 'カンボジア産カシューナッツ(WW180) 92%、有機赤唐辛子 4%、乾燥ガーリック 2%、天然海塩 2%',
    ingredientsFr: 'Noix de cajou du Cambodge (WW180) 92%, piment naturel 4%, ail 2%, sel de mer 2%',
    cleanIngredients: 'Cashew kernels, chili, garlic, salt',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។',
    storageEn: 'Store in a cool, dry place. Keep sealed.',
    storageJa: '直射日光・高温多湿を避け、涼しい場所でチャックを閉めて保存してください。',
    storageFr: 'Conserver dans un endroit frais et sec (< 25°C). Bien refermer le zip après ouverture.',
    instructionsKh: 'អាហារសម្រន់ប្រណិតធម្មជាតិញ៉ាំភ្លាមៗ។',
    instructionsEn: 'Ready-to-eat gourmet spicy snack.',
    instructionsJa: '手軽に楽しめるスパイシーなおつまみとしてお召し上がりください。',
    instructionsFr: 'Collation épicée prête à déguster, parfaite à l\'apéritif.',
    shelfLifeMonths: 9,
    grade: 'WW180 (King Size Jumbo)',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    originFr: 'Royaume du Cambodge (Produit du Cambodge)',
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
    descriptionJa: 'ピリッと旨辛い有機唐辛子仕立ての50gパウチ。ビールやお酒のおつまみに最適です。',
    descriptionFr: 'Noix de cajou entières relevées au piment cambodgien en sachet stand-up refermable de 50 g. Croquant savoureux idéal pour l\'apéritif.'
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
    nameKh: 'ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI ថង់ឈរ ៥០ ក្រាម',
    nameEn: 'GI Kampot Black Pepper Coated Cashew Kernels',
    nameKo: 'GI 캄폿 흑후추 코팅 통 캐슈넛 (WW180 • 50g 지퍼 파우치)',
    nameJa: 'GIカンポット黒胡椒コーティング カシューナッツ大粒 (WW180 • 50g)',
    nameFr: 'Noix de Cajou Entières Enrobées au Poivre Noir de Kampot IGP (Sachet 50 g)',
    packageFormatKh: 'ថង់ឈរមានរ៉ូត ៥០ ក្រាម បិទជិត',
    packageFormatEn: '50g Sealed Standing Zipper Pouch',
    packageFormatKo: '50g 밀폐 스탠드형 지퍼 파우치 (Standing Zipper Pouch)',
    packageFormatJa: '50g 密閉チャック付き自立型スタンドパウチ',
    packageFormatFr: 'Sachet stand-up hermétique avec zip refermable 50 g',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទី WW180 ៩១.០%, ម្រេចខ្មៅកំពត GI ៤.៣%, ស្ករ ៤.៣%, អំបិលសមុទ្រ ០.៣%',
    ingredientsEn: 'Cashew kernels (WW180) 91.0%, GI Kampot black pepper 4.3%, sugar 4.3%, sea salt 0.3%',
    ingredientsKo: '통 캐슈넛(WW180) 91.0%, GI 캄폿 흑후추 4.3%, 설탕 4.3%, 천일염 0.3%',
    ingredientsJa: 'カシューナッツ大粒(WW180) 91.0%、GIカンポット黒胡椒 4.3%、砂糖 4.3%、海塩 0.3%',
    ingredientsFr: 'Noix de cajou entières (WW180) 91,0%, poivre noir de Kampot IGP 4,3%, sucre 4,3%, sel de mer 0,3%',
    cleanIngredients: 'Cashew kernels (WW180) 91.0%, GI Kampot black pepper 4.3%, sugar 4.3%, sea salt 0.3%',
    allergenKh: 'មានផ្ទុកគ្រាប់ស្វាយចន្ទី (គ្រាប់ឈើ)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenKo: '알레르기 유발물질: 견과류(캐슈넛) 함유',
    allergenJa: 'アレルギー物質表示：カシューナッツ（木の実）を含む',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'ទុកកន្លែងត្រជាក់ និងស្ងួត។ បិទរ៉ូតឱ្យជិតក្រោយបើក។',
    storageEn: 'Store in a cool and dry place. Seal zipper tightly after opening.',
    storageKo: '서늘하고 건조한 곳에 보관하십시오. 개봉 후 지퍼를 꼭 닫아 보관하십시오.',
    storageJa: '涼しく乾燥した場所に保管してください。開封後はチャックをしっかり閉めてください。',
    storageFr: 'À conserver dans un endroit frais et sec. Bien refermer le zip après ouverture.',
    instructionsKh: '• ញ៉ាំភ្លាមជាអាហារសម្រន់\n• ញ៉ាំជាមួយតែ កាហ្វេ ឬភេសជ្ជៈ\n• ក្រឡុកលើសាឡាត់ ឬម្ហូប\n• ជាអំណោយ',
    instructionsEn: '• Enjoy directly as a ready-to-eat snack\n• Pair with tea, coffee, or beverages\n• Sprinkle over salads or dishes\n• Ideal as a thoughtful gift',
    instructionsKo: '• 별도 조리 없이 바로 간식으로 섭취\n• 차, 커피 또는 음료와 함께 즐기기\n• 샐러드나 요리 토핑으로 활용\n• 가볍고 품격 있는 선물용으로 추천',
    instructionsJa: '• そのままスナックとしてお召し上がりください\n• お茶、コーヒー、お好みのドリンクと一緒に\n• サラダや料理にふりかけて\n• 手軽なギフト・お土産にも最適',
    instructionsFr: '• À déguster directement comme collation gastronomique\n• À savourer avec du thé, du café ou des boissons\n• À parsemer sur vos salades ou plats\n• Idéal comme cadeau gourmand',
    shelfLifeMonths: 9,
    grade: 'WW180 (Whole Kernels)',
    originKh: 'ខេត្តកំពង់ធំ ប្រទេសកម្ពុជា',
    originEn: 'Kampong Thom Province, Cambodia',
    originKo: '캄보디아 캄퐁톰 주',
    originJa: 'カンボジア王国 コンポントム州',
    originFr: 'Province de Kampong Thom, Cambodge',
    requiresRefrigeration: false,
    cashewPct: 91.0,
    sugarPct: 4.3,
    saltPct: 0.3,
    spicePct: 4.3,
    activeSpice: 'ម្រេចខ្មៅកំពត GI ៤.៣%',
    nutrition: {
      energyKcal: '550',
      totalFat: '42',
      saturatedFat: '8',
      totalCarb: '37',
      dietaryFiber: '4',
      totalSugars: '9',
      protein: '14',
      sodium: '125',
      salt: '0.31'
    },
    descriptionKh: 'ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI របស់ MAYANY Enterprise ធ្វើពីគ្រាប់ស្វាយចន្ទីទាំងមូលថ្នាក់ WW180 អាំងស្រួយ ហើយស្រោបដោយម្រេចខ្មៅកំពតដែលមានសញ្ញាបញ្ជាក់ភូមិសាស្ត្រ (GI)។ ម្រេចជាប់ជុំវិញគ្រាប់ ផ្តល់ក្លិនក្រអូប និងរសជាតិស្រាលៗ ឆ្ងាញ់ល្មម។ ញ៉ាំជាអាហារសម្រន់ ឬជាមួយភេសជ្ជៈ។ ដាក់ក្នុងថង់ឈរមានរ៉ូត ៥០ ក្រាម ងាយស្រួលយកតាមខ្លួន។',
    descriptionEn: 'MAYANY Enterprise GI Kampot Black Pepper Coated Cashew Kernels are crafted from crispy roasted whole WW180 cashew kernels coated with authentic Geographical Indication (GI) Kampot black pepper. Every kernel is evenly coated to deliver a fragrant aroma and balanced mild pepper flavor, ideal as an everyday snack or beverage pairing in a convenient 50g standing zipper pouch.',
    descriptionFr: 'Les noix de cajou enrobées au poivre noir de Kampot IGP de MAYANY Enterprise sont préparées à partir de noix entières de calibre WW180 grillées et croquantes, enrobées de véritable poivre noir de Kampot certifié Indication Géographique (IGP). Chaque noix révèle un parfum intense et une saveur équilibrée, présentée dans un sachet zip stand-up de 50 g facile à emporter.',
    descriptionKo: 'MAYANY Enterprise의 GI 캄폿 흑후추 코팅 캐슈넛은 바삭하게 구운 최상급 통캐슈넛(WW180)에 지리적 표시(GI) 인증 캄폿 흑후추를 고르게 입혀 만든 제품입니다. 풍부한 향과 과하지 않은 깔끔한 맛으로 간식이나 음료 페어링에 잘 어울리며, 휴대가 간편한 50g 스탠드형 지퍼 파우치에 담겨 있습니다.',
    descriptionJa: 'MAYANY EnterpriseのGIカンポット黒胡椒コーティングカシューナッツは、香ばしくローストした丸粒WW180等級のカシューナッツに地理的表示（GI）認定カンポット黒胡椒をまとわせた逸品です。粒全体に均一に絡む芳醇な香りとまろやかな辛味が魅力で、持ち運びに便利な50g自立型チャック付きパウチ入りです。',
    storyKh: 'យើងឃើញថា ស្វាយចន្ទី និងម្រេចកំពត GI ជាផលិតផលពិសេសរបស់កម្ពុជា ដែលអាចរួមគ្នាបង្កើតរសជាតិថ្មី។ MAYANY Enterprise បានស្រោបម្រេចខ្មៅកំពតលើគ្រាប់ស្វាយចន្ទី ដោយប្រើតែគ្រឿងផ្សំក្នុងស្រុក។\n\nអតិថិជនបានបញ្ជាទិញម្តងទៀត តាមរយៈការប្រាប់ពីមាត់ទៅមាត់។\n\nគ្រប់ថង់ទាំងអស់ជួយពង្រឹងជីវភាពគ្រួសារកសិករចម្ការស្វាយចន្ទី និងចម្ការម្រេច ដើម្បីឱ្យពួកគាត់បន្តផលិតបានល្អបំផុតសម្រាប់ពិភពលោក។',
    storyEn: 'We saw that Cambodian cashew nuts and GI Kampot pepper are signature national treasures that come together naturally to create an unforgettable flavor. MAYANY Enterprise coats roasted whole cashews with authentic GI Kampot black pepper using 100% locally sourced ingredients.\n\nCustomers keep reordering again and again through genuine word-of-mouth.\n\nEvery pouch helps strengthen the livelihoods of cashew and Kampot pepper farming families so they can continue producing Cambodia’s finest harvest for the world.',
    storyFr: 'Nous avons uni deux trésors emblématiques du Cambodge : la noix de cajou et le poivre noir de Kampot IGP, pour créer une saveur unique. MAYANY Enterprise enrobe ses noix de cajou entières de poivre de Kampot IGP en utilisant exclusivement des ingrédients locaux.\n\nNos clients commandent à nouveau grâce au bouche-à-oreille authentique.\n\nChaque sachet contribue à renforcer les revenus des familles de producteurs de cajou et de poivre de Kampot afin qu’elles continuent d’offrir le meilleur au monde.',
    storyKo: '저희는 캄보디아를 대표하는 두 특산물인 캐슈넛과 GI 캄폿 흑후추가 만나 특별한 새로운 풍미를 만들어낼 수 있다고 믿었습니다. MAYANY Enterprise는 100% 현지 원재료만을 사용하여 통캐슈넛에 정품 캄폿 흑후추를 정성스럽게 코팅했습니다.\n\n진정성 있는 입소문을 통해 고객들의 재주문이 꾸준히 이어지고 있습니다.\n\n모든 파우치 한 팩이 캐슈넛과 캄폿 후추 농가 가족들의 생계를 더욱 튼튼히 하여, 세계에 최고의 농산물을 계속 선보일 수 있도록 돕습니다.',
    storyJa: 'カンボジアを代表する2つの特産品であるカシューナッツとGIカンポット黒胡椒を組み合わせることで、新しい美味しさが生まれると考えました。MAYANY Enterpriseは100%国内産の原材料のみを使い、丸粒カシューナッツに本物のカンポット黒胡椒をまとわせています。\n\n口コミで評判が広がり、多くのお客様からリピート注文をいただいています。\n\n一袋ごとにカシューナッツ農家とカンポット胡椒農家の暮らしを支え、世界へ最高品質を届け続ける力になっています。',
    benefitsByLang: {
      km: [
        { title: 'ជាប្រភពប្រូតេអ៊ីន និងខ្លាញ់ល្អពីរុក្ខជាតិ' },
        { title: 'មានម្រេចខ្មៅកំពត GI ពិតប្រាកដ' },
        { title: 'គ្មានទឹកដោះគោ (ស្រោបដោយទឹកគ្រាប់ស្វាយចន្ទី)' },
        { title: 'មិនមានសារធាតុការពារ គ្មានពណ៌ ឬរសជាតិសិប្បនិម្មិត' },
        { title: 'ស្ករ និងអំបិលតិចតួចបំផុត' },
        { title: 'គ្រឿងផ្សំផលិតក្នុងស្រុកទាំងអស់' }
      ],
      en: [
        { title: 'Plant-based source of protein and healthy fats' },
        { title: 'Made with authentic GI Kampot black pepper' },
        { title: 'Dairy-free — glazed with natural cashew milk' },
        { title: 'Zero preservatives, artificial colors, or artificial flavors' },
        { title: 'Minimal sugar and sea salt' },
        { title: '100% locally produced ingredients in Cambodia' }
      ],
      fr: [
        { title: 'Source végétale de protéines et de bons lipides' },
        { title: 'Préparé avec du véritable poivre noir de Kampot IGP' },
        { title: 'Sans produits laitiers — enrobé au lait de cajou' },
        { title: 'Sans conservateurs, ni colorants ou arômes artificiels' },
        { title: 'Très faible teneur en sucre et en sel' },
        { title: 'Ingrédients 100 % cultivés et transformés au Cambodge' }
      ],
      ko: [
        { title: '식물성 단백질과 건강한 불포화지방 공급원' },
        { title: '정품 GI 캄폿 흑후추 사용' },
        { title: '유제품 무첨가 — 천연 캐슈넛 밀크 코팅' },
        { title: '방부제, 인공 색소 및 인공 향료 무첨가' },
        { title: '설탕과 소금 함량을 최소화한 담백한 배합' },
        { title: '100% 캄보디아 현지 원재료 사용' }
      ],
      ja: [
        { title: '植物性タンパク質と良質な脂質の供給源' },
        { title: '本物のGI認定カンポット黒胡椒を使用' },
        { title: '乳製品不使用 — 自家製カシューミルクでコーティング' },
        { title: '保存料・合成着色料・合成香料不使用' },
        { title: '砂糖と塩を最小限に抑えた自然な味わい' },
        { title: '100%カンボジア国内産の原材料を使用' }
      ]
    }
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
    nameKh: 'ស្វាយចន្ទីបំបែកស្រោបម្រេចខ្មៅកំពត GI',
    nameEn: 'GI Kampot Pepper Coated Broken Cashew Kernels (Broken Grade)',
    nameKo: 'GI 캄폿 흑후추 코팅 조각 캐슈넛 (브로큰 등급 • 50g)',
    nameJa: 'GIカンポット黒胡椒コーティング 割れカシューナッツ (ブロークン等級 • 50g)',
    nameFr: 'Brisures de Noix de Cajou Enrobées au Poivre Noir de Kampot IGP',
    packageFormatKh: 'ថង់ឈរមានរ៉ូត (standing zipper pouch) ៥០ ក្រាម',
    packageFormatEn: '50g Standing Zipper Pouch',
    packageFormatKo: '50g 스탠드형 지퍼 파우치 (standing zipper pouch)',
    packageFormatJa: '50g チャック付き自立型スタンドパウチ',
    packageFormatFr: 'Sachet stand-up refermable avec zip 50 g',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទីបំបែក (Broken) ៩១.០%, ម្រេចខ្មៅកំពត GI ៤.៣%, ស្ករ ៤.៣%, អំបិលសមុទ្រ ០.៣%',
    ingredientsEn: 'Broken cashew kernels 91.0%, GI Kampot black pepper 4.3%, sugar 4.3%, sea salt 0.3%',
    ingredientsKo: '조각 캐슈넛(Broken) 91.0%, GI 캄폿 흑후추 4.3%, 설탕 4.3%, 천일염 0.3%',
    ingredientsJa: '割れカシューナッツ(ブロークン) 91.0%、GIカンポット黒胡椒 4.3%、砂糖 4.3%、海塩 0.3%',
    ingredientsFr: 'Brisures de noix de cajou 91,0%, poivre noir de Kampot IGP 4,3%, sucre 4,3%, sel de mer 0,3%',
    cleanIngredients: 'Broken cashew kernels (91.0%), GI Kampot black pepper (4.3%), sugar (4.3%), sea salt (0.3%)',
    allergenKh: 'មានផ្ទុកគ្រាប់ស្វាយចន្ទី (គ្រាប់ឈើ)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenKo: '알레르기 유발물질: 견과류(캐슈넛) 함유',
    allergenJa: 'アレルギー物質表示：カシューナッツ（木の実）を含む',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'ទុកកន្លែងត្រជាក់ និងស្ងួត។ បិទរ៉ូតឱ្យជិតក្រោយបើក។',
    storageEn: 'Store in a cool and dry place. Seal zipper tightly after opening.',
    storageKo: '서늘하고 건조한 곳에 보관하십시오. 개봉 후 지퍼를 꼭 닫아 보관하십시오.',
    storageJa: '涼しく乾燥した場所に保管してください。開封後はチャックをしっかり閉めてください。',
    storageFr: 'À conserver dans un endroit frais et sec. Bien refermer le zip après ouverture.',
    instructionsKh: '• ញ៉ាំភ្លាមជាអាហារសម្រន់\n• យកតាមខ្លួនពេលធ្វើដំណើរ ឬទៅធ្វើការ\n• ញ៉ាំជាមួយតែ កាហ្វេ ឬភេសជ្ជៈ\n• ក្រឡុកលើសាឡាត់ ឬម្ហូប',
    instructionsEn: '• Enjoy directly as a ready-to-eat snack\n• Convenient to carry while traveling or at work\n• Pair with tea, coffee, or beverages\n• Sprinkle over salads or dishes',
    instructionsKo: '• 별도 조리 없이 바로 간식으로 섭취\n• 여행이나 직장 등 외출 시 간편 휴대\n• 차, 커피 또는 음료와 함께 즐기기\n• 샐러드나 요리 위에 뿌려서 활용',
    instructionsJa: '• そのままスナックとしてお召し上がりください\n• 旅行や職場への持ち運びに便利\n• お茶、コーヒー、お好みのドリンクと一緒に\n• サラダや料理にふりかけても美味しく召し上がれます',
    instructionsFr: '• À déguster directement comme collation prête à consommer\n• Facile à emporter en voyage ou au travail\n• À savourer avec du thé, du café ou des boissons\n• À parsemer sur vos salades ou plats',
    shelfLifeMonths: 9,
    grade: 'Broken',
    originKh: 'ខេត្តកំពង់ធំ ប្រទេសកម្ពុជា',
    originEn: 'Kampong Thom Province, Cambodia',
    originKo: '캄보디아 캄퐁톰 주',
    originJa: 'カンボジア王国 コンポントム州',
    originFr: 'Province de Kampong Thom, Cambodge',
    requiresRefrigeration: false,
    cashewPct: 91.0,
    sugarPct: 4.3,
    saltPct: 0.3,
    spicePct: 4.3,
    activeSpice: 'ម្រេចខ្មៅកំពត GI ៤.៣%',
    nutrition: {
      energyKcal: '550',
      totalFat: '42',
      saturatedFat: '8',
      totalCarb: '37',
      dietaryFiber: '4',
      totalSugars: '9',
      protein: '14',
      sodium: '125',
      salt: '0.31'
    },
    descriptionKh: 'ស្វាយចន្ទីបំបែកស្រោបម្រេចខ្មៅកំពត GI របស់ MAYANY Enterprise ធ្វើពីគ្រាប់ស្វាយចន្ទីបំបែកថ្នាក់ Broken អាំងស្រួយ ហើយស្រោបដោយម្រេចខ្មៅកំពតដែលមានសញ្ញាបញ្ជាក់ភូមិសាស្ត្រ (GI)។ គ្រាប់បំបែកមានគុណប្រយោជន៍ដូចគ្រាប់ទាំងមូល ហើយម្រេចជាប់ល្អជាងលើគ្រាប់បំបែក ធ្វើឱ្យមានរសជាតិឆ្ងាញ់។ តម្លៃសមរម្យជាងគ្រាប់ទាំងមូល ដូច្នេះគ្រប់គ្នាអាចទិញបាន។ ដាក់ក្នុងថង់ឈរមានរ៉ូត ៥០ ក្រាម ងាយស្រួលយកតាមខ្លួន។',
    descriptionEn: 'MAYANY Enterprise GI Kampot Pepper Coated Broken Cashew Kernels are crafted from crispy roasted broken-grade cashew kernels and coated with authentic Geographical Indication (GI) Kampot black pepper. Broken kernels deliver the same nutritional benefits as whole kernels while allowing the Kampot pepper to cling even better for richer flavor. Priced more affordably than whole kernels so everyone can enjoy them, packed in a convenient 50g standing zipper pouch.',
    descriptionFr: 'Les brisures de noix de cajou enrobées au poivre noir de Kampot IGP de MAYANY Enterprise sont préparées à partir d’éclats de cajou (grade Broken) grillés et croustillants, enrobés de véritable poivre noir de Kampot certifié Indication Géographique (IGP). Elles offrent les mêmes bienfaits nutritionnels que les noix entières tout en permettant au poivre d’adhérer encore mieux pour une saveur plus intense, à un prix accessible dans un sachet zip de 50 g facile à emporter.',
    descriptionKo: 'MAYANY Enterprise의 GI 캄폿 흑후추 코팅 조각 캐슈넛은 바삭하게 구운 브로큰 등급 캐슈넛에 지리적 표시(GI) 인증 캄폿 흑후추를 입혀 만든 제품입니다. 조각 캐슈넛은 통캐슈넛과 동일한 영양 효능을 지니며, 표면에 후추가 더욱 고르게 밀착되어 깊은 풍미를 선사합니다. 통캐슈넛보다 합리적인 가격으로 누구나 부담 없이 즐길 수 있으며, 휴대가 간편한 50g 스탠드형 지퍼 파우치에 담겨 있습니다.',
    descriptionJa: 'MAYANY EnterpriseのGIカンポット黒胡椒コーティング割れカシューナッツは、香ばしくローストしたブロークン等級のカシューナッツに地理的表示（GI）認定カンポット黒胡椒をまとわせた逸品です。割れ粒でも丸粒と同じ栄養価を持ち、黒胡椒がよりしっかり絡むことで豊かな風味を実現。お求めやすい価格で、持ち運びに便利な50g自立型チャック付きパウチ入りです。',
    storyKh: 'កន្លងមក គ្រាប់ស្វាយចន្ទីបំបែកត្រូវបានគេប្រើប្រាស់តិចតួច ទាំងដែលវាមានគុណប្រយោជន៍ដូចគ្រាប់ទាំងមូល។ MAYANY Enterprise បានបង្កើតផលិតផលនេះ ដើម្បីឱ្យគ្រាប់បំបែកមានតម្លៃ ដោយស្រោបម្រេចខ្មៅកំពត GI ដែលជាប់ល្អជាងលើគ្រាប់បំបែក។\n\nតម្លៃថោកជាងគ្រាប់ទាំងមូល ៤០-៥០% ដូច្នេះអ្នកដែលមិនអាចទិញគ្រាប់ទាំងមូលបាន ក៏អាចរីករាយបាន។ គ្រឿងផ្សំផលិតក្នុងស្រុកទាំងអស់។\n\nគ្រប់ថង់ទាំងអស់ជួយបង្កើតការងារ និងពង្រឹងជីវភាពគ្រួសារកសិករចម្ការស្វាយចន្ទី និងចម្ការម្រេច។',
    storyEn: 'In the past, broken cashew kernels were often underutilized even though they offer the exact same nutrition and quality as whole kernels. MAYANY Enterprise created this product to give broken kernels real value by coating them with GI Kampot black pepper, which clings even better to broken pieces.\n\nPriced 40–50% more affordably than whole kernels, it makes authentic Kampot pepper cashews accessible to everyone. All ingredients are 100% locally sourced in Cambodia.\n\nEvery pouch helps create meaningful local jobs and strengthen the livelihoods of cashew and Kampot pepper farming families.',
    storyFr: 'Auparavant, les brisures de noix de cajou étaient peu valorisées alors qu’elles possèdent exactement les mêmes qualités nutritionnelles que les noix entières. MAYANY Enterprise a créé ce produit pour leur redonner toute leur valeur en les enrobant de poivre noir de Kampot IGP, qui adhère encore mieux sur les brisures.\n\nProposé à un prix 40 à 50 % plus abordable que les noix entières, chacun peut ainsi en profiter, avec des ingrédients 100 % locaux.\n\nChaque sachet contribue à créer des emplois et à soutenir durablement les familles d’agriculteurs de cajou et de poivre de Kampot.',
    storyKo: '그동안 조각 캐슈넛은 통캐슈넛과 동일한 영양적 가치를 지니고 있음에도 불구하고 충분히 활용되지 못했습니다. MAYANY Enterprise는 후추 시즈닝이 표면에 더욱 잘 어우러지는 조각 캐슈넛의 장점을 살려 GI 캄폿 흑후추를 입힘으로써 새로운 가치를 창출했습니다.\n\n통캐슈넛보다 40~50% 더 합리적인 가격으로 누구나 부담 없이 즐길 수 있으며, 모든 원재료는 100% 캄보디아 현지에서 생산됩니다.\n\n모든 파우치 한 팩이 현지 일자리 창출과 캐슈넛 및 캄폿 후추 농가 가족의 생계 향상에 직접적인 힘이 됩니다.',
    storyJa: 'これまで割れカシューナッツは、丸粒と同じ栄養価を持ちながらも十分に活用されてきませんでした。MAYANY Enterpriseは、割れ粒の方がGIカンポット黒胡椒がしっかり絡むという特長を活かし、価値ある商品として蘇らせました。\n\n丸粒より40〜50%お求めやすい価格で、すべての原材料をカンボジア国内で調達しています。\n\n一袋ごとに地域の雇用を生み出し、カシューナッツ農家とカンポット胡椒農家の暮らしを支えています。',
    benefitsByLang: {
      km: [
        { title: 'ជាប្រភពប្រូតេអ៊ីន និងខ្លាញ់ល្អពីរុក្ខជាតិ' },
        { title: 'មានម្រេចខ្មៅកំពត GI ពិតប្រាកដ' },
        { title: 'គ្មានទឹកដោះគោ ស្រោបដោយទឹកគ្រាប់ស្វាយចន្ទី' },
        { title: 'មិនមានសារធាតុការពារ គ្មានពណ៌ ឬរសជាតិសិប្បនិម្មិត' },
        { title: 'តម្លៃសមរម្យ សម្រាប់អ្នកដែលមិនអាចទិញគ្រាប់ទាំងមូលបាន' },
        { title: 'ជួយកាត់បន្ថយការខ្ជះខ្ជាយ ដោយប្រើគ្រាប់បំបែកឱ្យមានតម្លៃ' }
      ],
      en: [
        { title: 'Plant-based source of protein and healthy fats' },
        { title: 'Made with authentic GI Kampot black pepper' },
        { title: 'Dairy-free — glazed with natural cashew milk' },
        { title: 'Zero preservatives, artificial colors, or artificial flavors' },
        { title: 'Affordable everyday value for consumers' },
        { title: 'Reduces food waste by upcycling broken kernels' }
      ],
      fr: [
        { title: 'Source végétale de protéines et de bons lipides' },
        { title: 'Préparé avec du véritable poivre noir de Kampot IGP' },
        { title: 'Sans produits laitiers — enrobé au lait de cajou' },
        { title: 'Sans conservateurs, ni colorants ou arômes artificiels' },
        { title: 'Prix accessible à tous par rapport aux noix entières' },
        { title: 'Réduit le gaspillage alimentaire en valorisant les brisures' }
      ],
      ko: [
        { title: '식물성 단백질과 건강한 불포화지방 공급원' },
        { title: '정품 GI 캄폿 흑후추 사용' },
        { title: '유제품 무첨가 — 천연 캐슈넛 밀크 코팅' },
        { title: '방부제, 인공 색소 및 인공 향료 무첨가' },
        { title: '통캐슈넛 대비 합리적이고 부담 없는 가격' },
        { title: '조각 캐슈넛 업사이클링으로 식량 낭비 저감' }
      ],
      ja: [
        { title: '植物性タンパク質と良質な脂質の供給源' },
        { title: '本物のGI認定カンポット黒胡椒を使用' },
        { title: '乳製品不使用 — 自家製カシューミルクでコーティング' },
        { title: '保存料・合成着色料・合成香料不使用' },
        { title: '丸粒よりお求めやすい手頃な価格' },
        { title: '割れカシューナッツの活用で食品ロスを削減' }
      ]
    }
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
    nameFr: 'Farine Pure de Noix de Cajou 100% (Bocal 200 g)',
    packageFormatKh: 'ក្រឡកែវ/PET ២០០g (200g Clear Food-Grade Jar)',
    packageFormatEn: '200g Clear Food-Grade Sealed Jar',
    packageFormatJa: '200g 食品用密閉ガラス瓶',
    packageFormatFr: 'Bocal Alimentaire Hermétique Transparent 200 g',
    ingredientsKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០%',
    ingredientsEn: 'Cambodian Cashew Kernels 100%',
    ingredientsJa: 'カンボジア産ローストカシューナッツ 100%',
    ingredientsFr: 'Noix de cajou du Cambodge 100%',
    cleanIngredients: '100% pure cashew kernels',
    allergenKh: 'ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី (Contains: Cashew Nuts)',
    allergenEn: 'Contains: Cashew nuts (tree nuts)',
    allergenJa: 'アレルギー物質表示：カシューナッツ',
    allergenFr: 'Allergène : Contient des fruits à coque (noix de cajou)',
    storageKh: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។',
    storageEn: 'Store in a cool, dry place. Keep tightly closed.',
    storageJa: '直射日光・高温多湿を避け、25℃以下の冷暗所で密閉保存してください。',
    storageFr: 'Conserver dans un endroit frais et sec (< 25°C). Bien refermer après usage.',
    instructionsKh: 'សម្រាប់ឆុងកាហ្វេ (Cashew Latte/Creamer) ធ្វើទឹកដោះគ្រាប់ ធ្វើនំ និងអាហារសុខភាព។',
    instructionsEn: 'Ideal for coffee creamer (cashew latte), plant milk, baking, and healthy cooking.',
    instructionsJa: 'カシューラテ用のコーヒークリーマー、自家製カシューミルク、製菓・グルテンフリー料理に幅広くご利用いただけます。',
    instructionsFr: 'Idéal comme crème végétale pour café (Cashew Latte), lait de cajou maison, pâtisserie sans gluten et cuisine saine.',
    shelfLifeMonths: 9,
    grade: 'Pure Cold-Milled Kernel Flour',
    originKh: 'ព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)',
    originEn: 'Kingdom of Cambodia (Product of Cambodia)',
    originJa: 'カンボジア王国（カンボジア産）',
    originFr: 'Royaume du Cambodge (Produit du Cambodge)',
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
    descriptionJa: 'カンポン・トム州産の契約農家カシューナッツを100%使用した無添加パウダー。グルテンフリー、乳製品不使用。',
    descriptionFr: 'Farine pure moulue à froid à partir de noix de cajou d\'origine unique de Kampong Thom, Cambodge. 100% naturelle, sans produits laitiers, sans gluten, sans sucre ni sel ajouté.'
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
