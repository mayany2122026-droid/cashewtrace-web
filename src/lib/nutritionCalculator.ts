import { NutritionFacts } from '../types';

export interface IngredientNutrientProfile {
  id: string;
  nameKh: string;
  nameEn: string;
  category: 'nut' | 'spice' | 'sweetener' | 'salt' | 'fruit' | 'fat' | 'herb' | 'other';
  keywords: string[];
  // Nutritional values per 100g (ASEAN / USDA / Codex reference standards)
  per100g: {
    energyKcal: number;
    energyKj: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    cholesterol: number;
    sodium: number; // mg
    totalCarb: number;
    dietaryFiber: number;
    totalSugars: number;
    addedSugars: number;
    protein: number;
    salt: number; // g
  };
}

export const FOOD_NUTRITION_DATABASE: IngredientNutrientProfile[] = [
  {
    id: 'cashew',
    nameKh: 'គ្រាប់ស្វាយចន្ទី (Cashew Kernels)',
    nameEn: 'Cashew Kernels (Roasted/Dry)',
    category: 'nut',
    keywords: ['cashew', 'cashews', 'ស្វាយចន្ទី', 'ចន្ទី', 'គ្រាប់ស្វាយចន្ទី', 'ww180', 'ww240', 'ww320', 'ws', 'lsp', 'anacardium'],
    per100g: {
      energyKcal: 580,
      energyKj: 2426,
      totalFat: 43.8,
      saturatedFat: 7.8,
      transFat: 0,
      cholesterol: 0,
      sodium: 12,
      totalCarb: 30.1,
      dietaryFiber: 3.3,
      totalSugars: 5.9,
      addedSugars: 0,
      protein: 18.2,
      salt: 0.03
    }
  },
  {
    id: 'kampot_pepper',
    nameKh: 'ម្រេចកំពត GI / ម្រេចខ្មៅ (Kampot Pepper)',
    nameEn: 'GI Kampot Black / Red / White Pepper',
    category: 'spice',
    keywords: ['pepper', 'kampot pepper', 'black pepper', 'red pepper', 'white pepper', 'ម្រេច', 'ម្រេចកំពត', 'ម្រេចខ្មៅ', 'ម្រេចក្រហម', 'ម្រេចស', 'piper nigrum'],
    per100g: {
      energyKcal: 251,
      energyKj: 1050,
      totalFat: 3.3,
      saturatedFat: 1.4,
      transFat: 0,
      cholesterol: 0,
      sodium: 20,
      totalCarb: 64.0,
      dietaryFiber: 25.3,
      totalSugars: 0.6,
      addedSugars: 0,
      protein: 10.4,
      salt: 0.05
    }
  },
  {
    id: 'sugar_palm',
    nameKh: 'ស្ករត្នោតធម្មជាតិ (Palm Sugar)',
    nameEn: 'Natural Palm Sugar (Kampong Speu GI)',
    category: 'sweetener',
    keywords: ['palm sugar', 'ស្ករត្នោត', 'borassus', 'sugar cane', 'ស្ករធម្មជាតិ'],
    per100g: {
      energyKcal: 382,
      energyKj: 1598,
      totalFat: 0.2,
      saturatedFat: 0.0,
      transFat: 0,
      cholesterol: 0,
      sodium: 45,
      totalCarb: 95.0,
      dietaryFiber: 1.0,
      totalSugars: 91.0,
      addedSugars: 91.0,
      protein: 0.4,
      salt: 0.11
    }
  },
  {
    id: 'sugar_white',
    nameKh: 'ស្ករស / ស្កររលាយ (Cane Sugar / White Sugar)',
    nameEn: 'Refined White / Cane Sugar',
    category: 'sweetener',
    keywords: ['white sugar', 'refined sugar', 'cane sugar', 'sugar', 'ស្ករស', 'ស្ករ', 'sweetener'],
    per100g: {
      energyKcal: 387,
      energyKj: 1619,
      totalFat: 0.0,
      saturatedFat: 0.0,
      transFat: 0,
      cholesterol: 0,
      sodium: 1,
      totalCarb: 99.9,
      dietaryFiber: 0.0,
      totalSugars: 99.8,
      addedSugars: 99.8,
      protein: 0.0,
      salt: 0.01
    }
  },
  {
    id: 'sea_salt',
    nameKh: 'អំបិលសមុទ្រកំពត / អំបិលអ៊ីយ៉ូត (Kampot Sea Salt)',
    nameEn: 'Kampot Natural Sea Salt / Iodized Salt',
    category: 'salt',
    keywords: ['salt', 'sea salt', 'kampot salt', 'iodized salt', 'អំបិល', 'អំបិលសមុទ្រ', 'អំបិលកំពត', 'អំបិលអ៊ីយ៉ូត', 'sodium chloride'],
    per100g: {
      energyKcal: 0,
      energyKj: 0,
      totalFat: 0.0,
      saturatedFat: 0.0,
      transFat: 0,
      cholesterol: 0,
      sodium: 38800,
      totalCarb: 0.0,
      dietaryFiber: 0.0,
      totalSugars: 0.0,
      addedSugars: 0.0,
      protein: 0.0,
      salt: 98.5
    }
  },
  {
    id: 'chili',
    nameKh: 'ម្ទេសហឹរខ្មែរ / ម្ទេសក្រហម (Cambodian Chili)',
    nameEn: 'Spicy Cambodian Chili / Capsicum',
    category: 'spice',
    keywords: ['chili', 'chilli', 'spicy', 'hot pepper', 'cayenne', 'ម្ទេស', 'ម្ទេសហឹរ', 'ម្ទេសក្រហម', 'ម្ទេសប្លោក'],
    per100g: {
      energyKcal: 314,
      energyKj: 1313,
      totalFat: 16.8,
      saturatedFat: 3.0,
      transFat: 0,
      cholesterol: 0,
      sodium: 30,
      totalCarb: 56.6,
      dietaryFiber: 27.2,
      totalSugars: 10.3,
      addedSugars: 0,
      protein: 12.0,
      salt: 0.08
    }
  },
  {
    id: 'garlic',
    nameKh: 'ខ្ទឹមស / ម្សៅខ្ទឹម (Garlic Powder / Natural Garlic)',
    nameEn: 'Natural Cambodian Garlic',
    category: 'spice',
    keywords: ['garlic', 'ខ្ទឹម', 'ខ្ទឹមស', 'ម្សៅខ្ទឹម', 'allium sativum'],
    per100g: {
      energyKcal: 149,
      energyKj: 623,
      totalFat: 0.5,
      saturatedFat: 0.1,
      transFat: 0,
      cholesterol: 0,
      sodium: 17,
      totalCarb: 33.1,
      dietaryFiber: 2.1,
      totalSugars: 1.0,
      addedSugars: 0,
      protein: 6.4,
      salt: 0.04
    }
  },
  {
    id: 'sesame',
    nameKh: 'ល្ងស / ល្ងខ្មៅលីង (Roasted Sesame Seeds)',
    nameEn: 'Roasted Sesame Seeds (White / Black)',
    category: 'nut',
    keywords: ['sesame', 'ល្ង', 'ល្ងស', 'ល្ងខ្មៅ', 'sesamum'],
    per100g: {
      energyKcal: 573,
      energyKj: 2397,
      totalFat: 49.7,
      saturatedFat: 7.0,
      transFat: 0,
      cholesterol: 0,
      sodium: 11,
      totalCarb: 23.4,
      dietaryFiber: 11.8,
      totalSugars: 0.3,
      addedSugars: 0,
      protein: 17.7,
      salt: 0.03
    }
  },
  {
    id: 'honey',
    nameKh: 'ទឹកឃ្មុំព្រៃធម្មជាតិ (Natural Wild Honey)',
    nameEn: 'Natural Forest Honey',
    category: 'sweetener',
    keywords: ['honey', 'wild honey', 'ទឹកឃ្មុំ', 'ទឹកឃ្មុំព្រៃ'],
    per100g: {
      energyKcal: 304,
      energyKj: 1272,
      totalFat: 0.0,
      saturatedFat: 0.0,
      transFat: 0,
      cholesterol: 0,
      sodium: 4,
      totalCarb: 82.4,
      dietaryFiber: 0.2,
      totalSugars: 82.1,
      addedSugars: 0,
      protein: 0.3,
      salt: 0.01
    }
  },
  {
    id: 'herbs',
    nameKh: 'ស្លឹកក្រូចសើច / ស្លឹកគ្រៃ (Kaffir Lime / Lemongrass)',
    nameEn: 'Kaffir Lime Leaves & Lemongrass Herb',
    category: 'herb',
    keywords: ['kaffir', 'lime leaf', 'lemongrass', 'herb', 'ស្លឹកក្រូច', 'ស្លឹកក្រូចសើច', 'ស្លឹកគ្រៃ', 'រមៀត', 'turmeric'],
    per100g: {
      energyKcal: 85,
      energyKj: 355,
      totalFat: 0.5,
      saturatedFat: 0.1,
      transFat: 0,
      cholesterol: 0,
      sodium: 10,
      totalCarb: 18.0,
      dietaryFiber: 6.0,
      totalSugars: 2.0,
      addedSugars: 0,
      protein: 3.0,
      salt: 0.03
    }
  },
  {
    id: 'coconut_oil',
    nameKh: 'ប្រេងដូង / ប្រេងបន្លែ (Coconut / Vegetable Oil)',
    nameEn: 'Refined Coconut / Vegetable Oil',
    category: 'fat',
    keywords: ['oil', 'vegetable oil', 'coconut oil', 'rice bran oil', 'ប្រេង', 'ប្រេងដូង', 'ប្រេងបន្លែ'],
    per100g: {
      energyKcal: 884,
      energyKj: 3699,
      totalFat: 100.0,
      saturatedFat: 30.0,
      transFat: 0,
      cholesterol: 0,
      sodium: 0,
      totalCarb: 0.0,
      dietaryFiber: 0.0,
      totalSugars: 0.0,
      addedSugars: 0.0,
      protein: 0.0,
      salt: 0.0
    }
  },
  {
    id: 'dried_mango',
    nameKh: 'ដំណាប់ស្វាយ / ផ្លែឈើក្រៀម (Dried Mango / Fruit)',
    nameEn: 'Dried Keo Romeat Mango / Fruit',
    category: 'fruit',
    keywords: ['mango', 'dried mango', 'dried fruit', 'ស្វាយ', 'ដំណាប់ស្វាយ', 'ផ្លែឈើ', 'ចេក'],
    per100g: {
      energyKcal: 319,
      energyKj: 1335,
      totalFat: 1.2,
      saturatedFat: 0.3,
      transFat: 0,
      cholesterol: 0,
      sodium: 20,
      totalCarb: 78.6,
      dietaryFiber: 2.4,
      totalSugars: 66.0,
      addedSugars: 15.0,
      protein: 2.5,
      salt: 0.05
    }
  }
];

// Helper to convert Khmer numerals to Arabic digits
function convertKhmerNumeralsToArabic(str: string): string {
  const khmerDigits: { [k: string]: string } = {
    '០': '0', '១': '1', '២': '2', '៣': '3', '៤': '4',
    '៥': '5', '៦': '6', '៧': '7', '៨': '8', '៩': '9'
  };
  return str.replace(/[០-៩]/g, d => khmerDigits[d] || d);
}

export interface ParsedIngredientItem {
  rawText: string;
  profile: IngredientNutrientProfile;
  percentage: number;
  isCustomPct: boolean;
}

/**
 * Parses an ingredients declaration string (Khmer or English)
 * and extracts recognized ingredients and their quantitative percentages.
 */
export function parseIngredientsAndRatios(text: string): ParsedIngredientItem[] {
  if (!text || text.trim().length === 0) {
    // Default fallback to standard Cashew (98%) + Sea Salt (2%)
    const defaultCashew = FOOD_NUTRITION_DATABASE.find(f => f.id === 'cashew')!;
    const defaultSalt = FOOD_NUTRITION_DATABASE.find(f => f.id === 'sea_salt')!;
    return [
      { rawText: 'Cashews', profile: defaultCashew, percentage: 98, isCustomPct: false },
      { rawText: 'Sea Salt', profile: defaultSalt, percentage: 2, isCustomPct: false }
    ];
  }

  // Split by commas or newlines
  const chunks = text.split(/[,،\n]+/).map(c => c.trim()).filter(Boolean);
  const detectedItems: ParsedIngredientItem[] = [];

  for (const chunk of chunks) {
    const normalizedChunk = convertKhmerNumeralsToArabic(chunk.toLowerCase());

    // Check for explicit percentage, e.g. "90%", "5 %", "(90%)"
    const pctMatch = normalizedChunk.match(/([0-9]+(?:\.[0-9]+)?)\s*%/);
    const parsedPct = pctMatch ? parseFloat(pctMatch[1]) : 0;

    // Match profile from keywords
    let matchedProfile: IngredientNutrientProfile | undefined;
    for (const profile of FOOD_NUTRITION_DATABASE) {
      if (profile.keywords.some(kw => normalizedChunk.includes(kw.toLowerCase()))) {
        matchedProfile = profile;
        break;
      }
    }

    if (matchedProfile) {
      // Avoid duplicate profile additions if already detected in the same item
      const existing = detectedItems.find(it => it.profile.id === matchedProfile!.id);
      if (existing) {
        if (parsedPct > 0) existing.percentage += parsedPct;
      } else {
        detectedItems.push({
          rawText: chunk,
          profile: matchedProfile,
          percentage: parsedPct,
          isCustomPct: parsedPct > 0
        });
      }
    }
  }

  // If no known ingredients were recognized, default to Cashews + Salt
  if (detectedItems.length === 0) {
    const defaultCashew = FOOD_NUTRITION_DATABASE.find(f => f.id === 'cashew')!;
    return [{ rawText: text, profile: defaultCashew, percentage: 100, isCustomPct: false }];
  }

  // Ensure Cashew exists if this is a cashew product and not yet matched
  const hasNut = detectedItems.some(i => i.profile.category === 'nut');
  if (!hasNut) {
    const cashewProfile = FOOD_NUTRITION_DATABASE.find(f => f.id === 'cashew')!;
    detectedItems.unshift({
      rawText: 'Cashews',
      profile: cashewProfile,
      percentage: 0,
      isCustomPct: false
    });
  }

  // Check total percentage
  const totalSpecifiedPct = detectedItems.reduce((sum, item) => sum + (item.isCustomPct ? item.percentage : 0), 0);
  const unspecifiedItems = detectedItems.filter(item => !item.isCustomPct);

  if (unspecifiedItems.length > 0) {
    // If some or all items had no percentage in the text, allocate intelligent typical proportions
    const remainingPct = Math.max(0, 100 - totalSpecifiedPct);

    // Heuristic allocation:
    // Nuts/fruits take the majority (~88-95%)
    // Pepper / spice takes ~3-5%
    // Sugar takes ~3-5%
    // Salt takes ~1.5-2%
    let nutWeight = 0;
    let spiceWeight = 0;
    let sugarWeight = 0;
    let saltWeight = 0;
    let otherWeight = 0;

    unspecifiedItems.forEach(item => {
      if (item.profile.category === 'nut' || item.profile.category === 'fruit') nutWeight += 90;
      else if (item.profile.id === 'kampot_pepper' || item.profile.id === 'chili') spiceWeight += 5;
      else if (item.profile.category === 'sweetener') sugarWeight += 3;
      else if (item.profile.category === 'salt') saltWeight += 2;
      else otherWeight += 2;
    });

    const totalWeight = nutWeight + spiceWeight + sugarWeight + saltWeight + otherWeight || 100;

    unspecifiedItems.forEach(item => {
      let w = 10;
      if (item.profile.category === 'nut' || item.profile.category === 'fruit') w = nutWeight;
      else if (item.profile.id === 'kampot_pepper' || item.profile.id === 'chili') w = spiceWeight;
      else if (item.profile.category === 'sweetener') w = sugarWeight;
      else if (item.profile.category === 'salt') w = saltWeight;
      else w = otherWeight;

      const allocated = Math.round((w / totalWeight) * remainingPct * 10) / 10;
      item.percentage = allocated;
    });
  }

  // Normalize total to exactly 100%
  const currentTotal = detectedItems.reduce((s, i) => s + i.percentage, 0);
  if (currentTotal > 0 && Math.abs(currentTotal - 100) > 0.5) {
    const factor = 100 / currentTotal;
    detectedItems.forEach(i => {
      i.percentage = Math.round(i.percentage * factor * 10) / 10;
    });
    // Adjust rounding difference on primary ingredient
    const adjustedTotal = detectedItems.reduce((s, i) => s + i.percentage, 0);
    const diff = Math.round((100 - adjustedTotal) * 10) / 10;
    if (diff !== 0 && detectedItems[0]) {
      detectedItems[0].percentage = Math.round((detectedItems[0].percentage + diff) * 10) / 10;
    }
  }

  return detectedItems;
}

export interface CalculationResult {
  nutrition: NutritionFacts;
  breakdown: Array<{
    id: string;
    nameKh: string;
    nameEn: string;
    percentage: number;
    contributionKcal: number;
    contributionProtein: number;
    contributionFat: number;
    contributionCarb: number;
    contributionSugar: number;
    contributionSalt: number;
  }>;
}

/**
 * Calculates weighted Nutrition Facts per 100g based on parsed ingredients
 * and ASEAN / USDA food composition standard tables.
 */
export function calculateNutritionFromRecipe(
  ingredientsText: string,
  customRatios?: { [ingredientId: string]: number }
): CalculationResult {
  const items = parseIngredientsAndRatios(ingredientsText);

  // Apply manual ratio overrides if provided
  if (customRatios) {
    items.forEach(item => {
      if (customRatios[item.profile.id] !== undefined) {
        item.percentage = customRatios[item.profile.id];
      }
    });
    // Re-normalize to 100%
    const sum = items.reduce((s, i) => s + i.percentage, 0);
    if (sum > 0) {
      items.forEach(i => {
        i.percentage = Math.round((i.percentage / sum) * 100 * 10) / 10;
      });
    }
  }

  let totalKcal = 0;
  let totalFat = 0;
  let totalSatFat = 0;
  let totalTransFat = 0;
  let totalCholesterol = 0;
  let totalSodium = 0;
  let totalCarb = 0;
  let totalFiber = 0;
  let totalSugars = 0;
  let totalAddedSugars = 0;
  let totalProtein = 0;
  let totalSalt = 0;

  const breakdown: CalculationResult['breakdown'] = [];

  items.forEach(item => {
    const fraction = item.percentage / 100;
    const p = item.profile.per100g;

    const itemKcal = p.energyKcal * fraction;
    const itemFat = p.totalFat * fraction;
    const itemSatFat = p.saturatedFat * fraction;
    const itemCarb = p.totalCarb * fraction;
    const itemSugar = p.totalSugars * fraction;
    const itemProtein = p.protein * fraction;
    const itemSalt = p.salt * fraction;
    const itemSodium = p.sodium * fraction;
    const itemFiber = p.dietaryFiber * fraction;

    totalKcal += itemKcal;
    totalFat += itemFat;
    totalSatFat += itemSatFat;
    totalTransFat += p.transFat * fraction;
    totalCholesterol += p.cholesterol * fraction;
    totalSodium += itemSodium;
    totalCarb += itemCarb;
    totalFiber += itemFiber;
    totalSugars += itemSugar;
    totalAddedSugars += p.addedSugars * fraction;
    totalProtein += itemProtein;
    totalSalt += itemSalt;

    breakdown.push({
      id: item.profile.id,
      nameKh: item.profile.nameKh,
      nameEn: item.profile.nameEn,
      percentage: item.percentage,
      contributionKcal: Math.round(itemKcal),
      contributionProtein: Math.round(itemProtein * 10) / 10,
      contributionFat: Math.round(itemFat * 10) / 10,
      contributionCarb: Math.round(itemCarb * 10) / 10,
      contributionSugar: Math.round(itemSugar * 10) / 10,
      contributionSalt: Math.round(itemSalt * 100) / 100
    });
  });

  const roundedKcal = Math.round(totalKcal);
  const calculatedKj = Math.round(roundedKcal * 4.184);

  const nutrition: NutritionFacts = {
    energyKcal: String(roundedKcal),
    energyKj: String(calculatedKj),
    totalFat: (Math.round(totalFat * 10) / 10).toFixed(1),
    saturatedFat: (Math.round(totalSatFat * 10) / 10).toFixed(1),
    transFat: (Math.round(totalTransFat * 10) / 10).toFixed(1),
    cholesterol: String(Math.round(totalCholesterol)),
    sodium: String(Math.round(totalSodium)),
    totalCarb: (Math.round(totalCarb * 10) / 10).toFixed(1),
    dietaryFiber: (Math.round(totalFiber * 10) / 10).toFixed(1),
    totalSugars: (Math.round(totalSugars * 10) / 10).toFixed(1),
    addedSugars: (Math.round(totalAddedSugars * 10) / 10).toFixed(1),
    protein: (Math.round(totalProtein * 10) / 10).toFixed(1),
    salt: (Math.round(totalSalt * 100) / 100).toFixed(2)
  };

  return {
    nutrition,
    breakdown
  };
}
