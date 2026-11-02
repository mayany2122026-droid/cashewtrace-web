// Structured Ingredient Models and Bilingual Translators for Food Packaging Labels
// Designed for Cambodian Food SMEs, adhering to CS 001 and international export standards

export interface IngredientVariant {
  nameKh: string;
  nameEn: string;
  defaultPercent?: number;
}

export interface BaseIngredient {
  id: string;
  nameKh: string;
  nameEn: string;
  defaultPercent?: number;
  variants: IngredientVariant[];
}

export interface IngredientCategory {
  id: string;
  nameKh: string;
  nameEn: string;
  icon: string;
  placeholderKh: string;
  items: BaseIngredient[];
}

export const STRUCTURED_INGREDIENT_CATEGORIES: IngredientCategory[] = [
  // 1. MEAT & SEAFOOD (សាច់ & អាហារសមុទ្រ)
  {
    id: 'meat',
    nameKh: 'សាច់ & អាហារសមុទ្រ',
    nameEn: 'Meat, Poultry & Seafood',
    icon: '🥩',
    placeholderKh: '-- ជ្រើសរើសសាច់ (Select Meat / Seafood) --',
    items: [
      {
        id: 'pork',
        nameKh: 'សាច់ជ្រូក',
        nameEn: 'Pork',
        defaultPercent: 75,
        variants: [
          { nameKh: 'សាច់ជ្រូក', nameEn: 'Pork', defaultPercent: 75 },
          { nameKh: 'សាច់ជ្រូកសុទ្ធ', nameEn: 'Lean Pork', defaultPercent: 80 },
          { nameKh: 'សាច់ជ្រូកបីជាន់', nameEn: 'Pork Belly', defaultPercent: 70 },
          { nameKh: 'ខ្លាញ់ជ្រូកធម្មជាតិ', nameEn: 'Natural Pork Lard', defaultPercent: 8 },
          { nameKh: 'ស្បែកជ្រូក', nameEn: 'Pork Skin', defaultPercent: 5 }
        ]
      },
      {
        id: 'beef',
        nameKh: 'សាច់គោ',
        nameEn: 'Beef',
        defaultPercent: 75,
        variants: [
          { nameKh: 'សាច់គោ', nameEn: 'Beef', defaultPercent: 75 },
          { nameKh: 'សាច់គោខ្មែរស្រស់', nameEn: 'Fresh Cambodian Beef', defaultPercent: 80 },
          { nameKh: 'សាច់គោក្រៀម', nameEn: 'Dried Beef / Jerky', defaultPercent: 85 }
        ]
      },
      {
        id: 'fish',
        nameKh: 'សាច់ត្រី',
        nameEn: 'Fish',
        defaultPercent: 80,
        variants: [
          { nameKh: 'សាច់ត្រី', nameEn: 'Fish Meat', defaultPercent: 80 },
          { nameKh: 'សាច់ត្រីរ៉ស់', nameEn: 'Snakehead Fish Fillet', defaultPercent: 82 },
          { nameKh: 'សាច់ត្រីអត់ឆ្អឹង', nameEn: 'Boneless Fish Meat', defaultPercent: 85 },
          { nameKh: 'សាច់ត្រីប្រា', nameEn: 'Pangasius Fish Fillet', defaultPercent: 80 },
          { nameKh: 'សាច់ត្រីសាលម៉ុន', nameEn: 'Salmon Fillet', defaultPercent: 75 },
          { nameKh: 'ត្រីងៀត', nameEn: 'Dried Fish Meat', defaultPercent: 85 }
        ]
      },
      {
        id: 'chicken',
        nameKh: 'សាច់មាន់',
        nameEn: 'Chicken',
        defaultPercent: 75,
        variants: [
          { nameKh: 'សាច់មាន់', nameEn: 'Chicken Meat', defaultPercent: 75 },
          { nameKh: 'សាច់មាន់ស្រែ', nameEn: 'Free-Range Chicken Meat', defaultPercent: 80 },
          { nameKh: 'ទ្រូងមាន់សុទ្ធ', nameEn: 'Boneless Chicken Breast', defaultPercent: 85 }
        ]
      },
      {
        id: 'shrimp',
        nameKh: 'បង្គា',
        nameEn: 'Shrimp',
        defaultPercent: 65,
        variants: [
          { nameKh: 'បង្គា', nameEn: 'Shrimp', defaultPercent: 65 },
          { nameKh: 'សាច់បង្គាស្រស់', nameEn: 'Fresh Shrimp Meat', defaultPercent: 70 },
          { nameKh: 'បង្គាក្រៀម', nameEn: 'Dried Shrimp', defaultPercent: 20 },
          { nameKh: 'កាពិ', nameEn: 'Fermented Shrimp Paste (Kapi)', defaultPercent: 10 }
        ]
      },
      {
        id: 'crab',
        nameKh: 'ក្តាម',
        nameEn: 'Crab',
        defaultPercent: 60,
        variants: [
          { nameKh: 'សាច់ក្តាម', nameEn: 'Crab Meat', defaultPercent: 60 },
          { nameKh: 'សាច់ក្តាមសេះ', nameEn: 'Blue Swimming Crab Meat', defaultPercent: 65 }
        ]
      },
      {
        id: 'squid',
        nameKh: 'មឹក',
        nameEn: 'Squid',
        defaultPercent: 70,
        variants: [
          { nameKh: 'មឹក', nameEn: 'Squid', defaultPercent: 70 },
          { nameKh: 'មឹកក្រៀម', nameEn: 'Dried Squid', defaultPercent: 80 }
        ]
      }
    ]
  },

  // 2. GRAIN, SEEDS & NUTS (គ្រាប់ធញ្ញជាតិ & គ្រាប់ផ្លែឈើ)
  {
    id: 'grain',
    nameKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់',
    nameEn: 'Grain, Seeds & Nuts',
    icon: '🌾',
    placeholderKh: '-- ជ្រើសរើសគ្រាប់ធញ្ញជាតិ (Select Grain / Nuts) --',
    items: [
      {
        id: 'cashew',
        nameKh: 'គ្រាប់ស្វាយចន្ទី',
        nameEn: 'Cashews',
        defaultPercent: 95,
        variants: [
          { nameKh: 'គ្រាប់ស្វាយចន្ទី', nameEn: 'Cashew Kernels', defaultPercent: 95 },
          { nameKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា', nameEn: 'Cambodian Cashew Kernels', defaultPercent: 95 },
          { nameKh: 'គ្រាប់ស្វាយចន្ទី W240', nameEn: 'Cambodian Cashews W240', defaultPercent: 95 },
          { nameKh: 'ម្សៅគ្រាប់ស្វាយចន្ទី', nameEn: 'Pure Cashew Nut Flour', defaultPercent: 100 },
          { nameKh: 'ប័រគ្រាប់ស្វាយចន្ទី', nameEn: 'Natural Cashew Butter', defaultPercent: 98 }
        ]
      },
      {
        id: 'sesame',
        nameKh: 'ល្ង',
        nameEn: 'Sesame',
        defaultPercent: 10,
        variants: [
          { nameKh: 'ល្ង', nameEn: 'Sesame Seeds', defaultPercent: 10 },
          { nameKh: 'ល្ងស', nameEn: 'White Sesame Seeds', defaultPercent: 10 },
          { nameKh: 'ល្ងខ្មៅ', nameEn: 'Black Sesame Seeds', defaultPercent: 10 },
          { nameKh: 'ប្រេងល្ង', nameEn: 'Toasted Sesame Oil', defaultPercent: 2 }
        ]
      },
      {
        id: 'corn',
        nameKh: 'ពោត',
        nameEn: 'Corn',
        defaultPercent: 20,
        variants: [
          { nameKh: 'ពោត', nameEn: 'Corn Grains', defaultPercent: 20 },
          { nameKh: 'ពោតផ្អែម', nameEn: 'Sweet Corn', defaultPercent: 25 },
          { nameKh: 'ម្សៅពោត', nameEn: 'Cornstarch / Cornmeal', defaultPercent: 10 }
        ]
      },
      {
        id: 'peanut',
        nameKh: 'សណ្ដែកដី',
        nameEn: 'Peanuts',
        defaultPercent: 30,
        variants: [
          { nameKh: 'សណ្ដែកដី', nameEn: 'Peanuts', defaultPercent: 30 },
          { nameKh: 'សណ្ដែកដីលីង', nameEn: 'Roasted Peanuts', defaultPercent: 30 },
          { nameKh: 'ប័ររណ្តែកដី', nameEn: 'Peanut Butter', defaultPercent: 95 }
        ]
      },
      {
        id: 'soybean',
        nameKh: 'សណ្ដែកសៀង',
        nameEn: 'Soybeans',
        defaultPercent: 25,
        variants: [
          { nameKh: 'សណ្ដែកសៀង', nameEn: 'Soybeans', defaultPercent: 25 },
          { nameKh: 'ម្សៅសណ្ដែកសៀង', nameEn: 'Soy Flour', defaultPercent: 20 }
        ]
      },
      {
        id: 'rice',
        nameKh: 'អង្ករ',
        nameEn: 'Rice',
        defaultPercent: 40,
        variants: [
          { nameKh: 'អង្ករ', nameEn: 'Rice', defaultPercent: 40 },
          { nameKh: 'អង្ករផ្កាម្លិះ', nameEn: 'Jasmine Rice', defaultPercent: 40 },
          { nameKh: 'អង្ករដំណើប', nameEn: 'Sticky Rice', defaultPercent: 30 },
          { nameKh: 'ម្សៅអង្ករ', nameEn: 'Rice Flour', defaultPercent: 20 }
        ]
      },
      {
        id: 'lotus_seed',
        nameKh: 'គ្រាប់ឈូក',
        nameEn: 'Lotus Seeds',
        defaultPercent: 15,
        variants: [
          { nameKh: 'គ្រាប់ឈូក', nameEn: 'Lotus Seeds', defaultPercent: 15 },
          { nameKh: 'គ្រាប់ឈូកស្ងួត', nameEn: 'Dried Lotus Seeds', defaultPercent: 15 }
        ]
      },
      {
        id: 'mung_bean',
        nameKh: 'សណ្ដែកបាយ',
        nameEn: 'Mung Beans',
        defaultPercent: 20,
        variants: [
          { nameKh: 'សណ្ដែកបាយ', nameEn: 'Mung Beans', defaultPercent: 20 }
        ]
      }
    ]
  },

  // 3. SPICES, CONDIMENTS & DAIRY (គ្រឿងទេស, រសជាតិ & ទឹកដោះគោ)
  {
    id: 'spice',
    nameKh: 'គ្រឿងទេស, អំបិល, ស្ករ & ទឹកដោះ',
    nameEn: 'Spices, Salt, Sugar & Dairy',
    icon: '🧂',
    placeholderKh: '-- ជ្រើសរើសគ្រឿងទេស (Select Spices / Dairy) --',
    items: [
      {
        id: 'salt',
        nameKh: 'អំបិល',
        nameEn: 'Salt',
        defaultPercent: 2,
        variants: [
          { nameKh: 'អំបិល', nameEn: 'Salt', defaultPercent: 2 },
          { nameKh: 'អំបិលអ៊ីយ៉ូត', nameEn: 'Iodized Salt', defaultPercent: 1.5 },
          { nameKh: 'អំបិលកំពត', nameEn: 'Kampot Salt', defaultPercent: 1.5 },
          { nameKh: 'អំបិលសមុទ្រ', nameEn: 'Sea Salt', defaultPercent: 2 },
          { nameKh: 'ផ្កាអំបិលកំពត', nameEn: 'GI Kampot Fleur de Sel', defaultPercent: 1.5 },
          { nameKh: 'អំបិលផ្កាឈូក', nameEn: 'Himalayan Pink Salt', defaultPercent: 1.5 }
        ]
      },
      {
        id: 'sugar',
        nameKh: 'ស្ករ',
        nameEn: 'Sugar',
        defaultPercent: 3,
        variants: [
          { nameKh: 'ស្ករ', nameEn: 'Sugar', defaultPercent: 3 },
          { nameKh: 'ស្ករត្នោត', nameEn: 'Palm Sugar', defaultPercent: 3 },
          { nameKh: 'ស្ករត្នោតកំពង់ស្ពឺ', nameEn: 'GI Kampong Speu Palm Sugar', defaultPercent: 3 },
          { nameKh: 'ស្ករស', nameEn: 'White Granulated Sugar', defaultPercent: 3 },
          { nameKh: 'ស្ករអំពៅ', nameEn: 'Raw Cane Sugar', defaultPercent: 4 },
          { nameKh: 'ម្សៅស្ករសម៉ត់', nameEn: 'Powdered Icing Sugar', defaultPercent: 5 },
          { nameKh: 'ស្ករស៊ីរ៉ូខាប់', nameEn: 'Condensed Sugar Syrup', defaultPercent: 5 }
        ]
      },
      {
        id: 'pepper',
        nameKh: 'ម្រេច',
        nameEn: 'Pepper',
        defaultPercent: 2,
        variants: [
          { nameKh: 'ម្រេច', nameEn: 'Pepper', defaultPercent: 2 },
          { nameKh: 'ម្រេចកំពត', nameEn: 'GI Kampot Pepper', defaultPercent: 2 },
          { nameKh: 'ម្រេចខ្មៅកំពត', nameEn: 'GI Kampot Black Pepper', defaultPercent: 2.5 },
          { nameKh: 'ម្រេចសកំពត', nameEn: 'GI Kampot White Pepper', defaultPercent: 2 },
          { nameKh: 'ម្រេចក្រហមកំពត', nameEn: 'GI Kampot Red Pepper', defaultPercent: 2.5 },
          { nameKh: 'ម្សៅស្រោបម្រេច', nameEn: 'Pepper Coating Powder', defaultPercent: 5 }
        ]
      },
      {
        id: 'chili',
        nameKh: 'ម្ទេស',
        nameEn: 'Chili',
        defaultPercent: 2,
        variants: [
          { nameKh: 'ម្ទេស', nameEn: 'Chili', defaultPercent: 2 },
          { nameKh: 'ម្ទេសហិរធម្មជាតិ', nameEn: 'Fresh Bird Chili', defaultPercent: 2.5 },
          { nameKh: 'ម្ទេសក្រៀម', nameEn: 'Dried Chili', defaultPercent: 2 },
          { nameKh: 'ម្សៅម្ទេស', nameEn: 'Chili Powder / Paprika', defaultPercent: 2 },
          { nameKh: 'ម្សៅស្រោបម្ទេស', nameEn: 'Spicy Chili Coating', defaultPercent: 5 }
        ]
      },
      {
        id: 'condensed_milk',
        nameKh: 'ទឹកដោះគោខាប់',
        nameEn: 'Condensed Milk',
        defaultPercent: 5,
        variants: [
          { nameKh: 'ទឹកដោះគោខាប់', nameEn: 'Sweetened Condensed Milk', defaultPercent: 5 },
          { nameKh: 'ទឹកដោះគោខាប់ផ្អែម', nameEn: 'Sweetened Condensed Creamer', defaultPercent: 6 }
        ]
      },
      {
        id: 'milk_dairy',
        nameKh: 'ទឹកដោះគោ',
        nameEn: 'Milk & Dairy',
        defaultPercent: 5,
        variants: [
          { nameKh: 'ទឹកដោះគោ', nameEn: 'Fresh Milk', defaultPercent: 10 },
          { nameKh: 'ម្សៅទឹកដោះគោ', nameEn: 'Milk Powder', defaultPercent: 5 },
          { nameKh: 'ប៊ឺធម្មជាតិ', nameEn: 'Pure Natural Butter', defaultPercent: 4 },
          { nameKh: 'ឈីស', nameEn: 'Cheddar Cheese Seasoning', defaultPercent: 8 }
        ]
      },
      {
        id: 'garlic',
        nameKh: 'ខ្ទឹមស',
        nameEn: 'Garlic',
        defaultPercent: 2,
        variants: [
          { nameKh: 'ខ្ទឹមស', nameEn: 'Garlic', defaultPercent: 2 },
          { nameKh: 'ខ្ទឹមសបំពងស្រួយ', nameEn: 'Crispy Fried Garlic', defaultPercent: 2 },
          { nameKh: 'ម្សៅខ្ទឹមស', nameEn: 'Garlic Powder', defaultPercent: 1.5 }
        ]
      },
      {
        id: 'ginger',
        nameKh: 'ខ្ញី',
        nameEn: 'Ginger',
        defaultPercent: 1.5,
        variants: [
          { nameKh: 'ខ្ញី', nameEn: 'Fresh Ginger', defaultPercent: 1.5 },
          { nameKh: 'ម្សៅខ្ញី', nameEn: 'Ginger Powder', defaultPercent: 1 }
        ]
      },
      {
        id: 'lemongrass',
        nameKh: 'ស្លឹកគ្រៃ',
        nameEn: 'Lemongrass',
        defaultPercent: 3,
        variants: [
          { nameKh: 'ស្លឹកគ្រៃ', nameEn: 'Lemongrass', defaultPercent: 3 },
          { nameKh: 'គ្រឿងស្លឹកគ្រៃរមៀត', nameEn: 'Khmer Kroeung Lemongrass Paste', defaultPercent: 4 }
        ]
      },
      {
        id: 'turmeric',
        nameKh: 'រមៀត',
        nameEn: 'Turmeric',
        defaultPercent: 1,
        variants: [
          { nameKh: 'រមៀត', nameEn: 'Fresh Turmeric', defaultPercent: 1 },
          { nameKh: 'ម្សៅរមៀត', nameEn: 'Turmeric Powder', defaultPercent: 0.8 }
        ]
      },
      {
        id: 'fish_sauce',
        nameKh: 'ទឹកត្រី',
        nameEn: 'Fish Sauce',
        defaultPercent: 2,
        variants: [
          { nameKh: 'ទឹកត្រី', nameEn: 'Fish Sauce', defaultPercent: 2 },
          { nameKh: 'ទឹកត្រីកោះកុង', nameEn: 'Koh Kong Fish Sauce', defaultPercent: 2 }
        ]
      },
      {
        id: 'soy_sauce',
        nameKh: 'ទឹកស៊ីអ៊ីវ',
        nameEn: 'Soy Sauce',
        defaultPercent: 2,
        variants: [
          { nameKh: 'ទឹកស៊ីអ៊ីវ', nameEn: 'Naturally Brewed Soy Sauce', defaultPercent: 2 },
          { nameKh: 'ទឹកស៊ីអ៊ីវខាប់', nameEn: 'Dark Sweet Soy Sauce', defaultPercent: 1.5 }
        ]
      },
      {
        id: 'honey',
        nameKh: 'ទឹកឃ្មុំ',
        nameEn: 'Honey',
        defaultPercent: 3,
        variants: [
          { nameKh: 'ទឹកឃ្មុំ', nameEn: 'Honey', defaultPercent: 3 },
          { nameKh: 'ទឹកឃ្មុំព្រៃធម្មជាតិ', nameEn: 'Pure Wild Forest Honey', defaultPercent: 3 }
        ]
      }
    ]
  },

  // 4. VEGETABLES (បន្លែ)
  {
    id: 'vegetable',
    nameKh: 'បន្លែ',
    nameEn: 'Vegetables',
    icon: '🥒',
    placeholderKh: '-- ជ្រើសរើសបន្លែ (Select Vegetable) --',
    items: [
      {
        id: 'cucumber',
        nameKh: 'ត្រសក់',
        nameEn: 'Cucumber',
        defaultPercent: 30,
        variants: [
          { nameKh: 'ត្រសក់', nameEn: 'Cucumber', defaultPercent: 30 },
          { nameKh: 'ត្រសក់ស្រស់', nameEn: 'Fresh Cucumber', defaultPercent: 35 },
          { nameKh: 'ត្រសក់ត្រាំ', nameEn: 'Pickled Cucumber', defaultPercent: 25 }
        ]
      },
      {
        id: 'carrot',
        nameKh: 'ការ៉ុត',
        nameEn: 'Carrot',
        defaultPercent: 20,
        variants: [
          { nameKh: 'ការ៉ុត', nameEn: 'Carrot', defaultPercent: 20 },
          { nameKh: 'ការ៉ុតស្រស់', nameEn: 'Fresh Carrot', defaultPercent: 25 }
        ]
      },
      {
        id: 'onion',
        nameKh: 'ខ្ទឹមបារាំង',
        nameEn: 'Onion',
        defaultPercent: 10,
        variants: [
          { nameKh: 'ខ្ទឹមបារាំង', nameEn: 'Onion', defaultPercent: 10 },
          { nameKh: 'ខ្ទឹមបារាំងស្ងួត', nameEn: 'Dehydrated Onion Flakes', defaultPercent: 3 }
        ]
      },
      {
        id: 'shallot',
        nameKh: 'ខ្ទឹមក្រហម',
        nameEn: 'Shallot',
        defaultPercent: 5,
        variants: [
          { nameKh: 'ខ្ទឹមក្រហម', nameEn: 'Shallots', defaultPercent: 5 },
          { nameKh: 'ខ្ទឹមក្រហមបំពង', nameEn: 'Crispy Fried Shallots', defaultPercent: 3 }
        ]
      },
      {
        id: 'scallion',
        nameKh: 'ស្លឹកខ្ទឹម',
        nameEn: 'Spring Onion',
        defaultPercent: 2,
        variants: [
          { nameKh: 'ស្លឹកខ្ទឹម', nameEn: 'Spring Onion / Scallions', defaultPercent: 2 }
        ]
      },
      {
        id: 'tomato',
        nameKh: 'ប៉េងប៉ោះ',
        nameEn: 'Tomato',
        defaultPercent: 20,
        variants: [
          { nameKh: 'ប៉េងប៉ោះ', nameEn: 'Tomato', defaultPercent: 20 },
          { nameKh: 'ប៉េងប៉ោះស្ងួត', nameEn: 'Sun-Dried Tomatoes', defaultPercent: 10 }
        ]
      },
      {
        id: 'bell_pepper',
        nameKh: 'ម្ទេសប្លោក',
        nameEn: 'Bell Pepper',
        defaultPercent: 15,
        variants: [
          { nameKh: 'ម្ទេសប្លោក', nameEn: 'Sweet Bell Pepper', defaultPercent: 15 }
        ]
      },
      {
        id: 'mushroom',
        nameKh: 'ផ្សិត',
        nameEn: 'Mushroom',
        defaultPercent: 15,
        variants: [
          { nameKh: 'ផ្សិត', nameEn: 'Mushrooms', defaultPercent: 15 },
          { nameKh: 'ផ្សិតក្រៀម', nameEn: 'Dried Mushrooms', defaultPercent: 5 }
        ]
      }
    ]
  },

  // 5. FRUITS (ផ្លែឈើ)
  {
    id: 'fruit',
    nameKh: 'ផ្លែឈើ',
    nameEn: 'Fruits',
    icon: '🥑',
    placeholderKh: '-- ជ្រើសរើសផ្លែឈើ (Select Fruit) --',
    items: [
      {
        id: 'avocado',
        nameKh: 'ផ្លែប័រ',
        nameEn: 'Avocado',
        defaultPercent: 20,
        variants: [
          { nameKh: 'ផ្លែប័រ', nameEn: 'Avocado', defaultPercent: 20 },
          { nameKh: 'សាច់ផ្លែប័រ', nameEn: 'Fresh Avocado Pulp', defaultPercent: 25 },
          { nameKh: 'ម្សៅផ្លែប័រ', nameEn: 'Avocado Powder', defaultPercent: 15 }
        ]
      },
      {
        id: 'mango',
        nameKh: 'ស្វាយ',
        nameEn: 'Mango',
        defaultPercent: 90,
        variants: [
          { nameKh: 'ស្វាយ', nameEn: 'Mango', defaultPercent: 90 },
          { nameKh: 'ស្វាយកែវរមៀត', nameEn: 'Keo Romeat Mango', defaultPercent: 92 },
          { nameKh: 'ដំណាប់ស្វាយ', nameEn: 'Dried Mango Slices', defaultPercent: 95 }
        ]
      },
      {
        id: 'banana',
        nameKh: 'ចេក',
        nameEn: 'Banana',
        defaultPercent: 90,
        variants: [
          { nameKh: 'ចេក', nameEn: 'Banana', defaultPercent: 90 },
          { nameKh: 'ចេកណាំវ៉ា', nameEn: 'Khmer Namwa Banana', defaultPercent: 92 },
          { nameKh: 'ចេកក្រៀម', nameEn: 'Crispy Banana Chips', defaultPercent: 95 }
        ]
      },
      {
        id: 'durian',
        nameKh: 'ធុរេន',
        nameEn: 'Durian',
        defaultPercent: 85,
        variants: [
          { nameKh: 'ធុរេន', nameEn: 'Durian', defaultPercent: 85 },
          { nameKh: 'សាច់ធុរេនកំពត', nameEn: 'Kampot Durian Meat', defaultPercent: 90 },
          { nameKh: 'ធុរេនក្រៀម', nameEn: 'Freeze-Dried Durian', defaultPercent: 95 }
        ]
      },
      {
        id: 'pineapple',
        nameKh: 'ម្នាស់',
        nameEn: 'Pineapple',
        defaultPercent: 85,
        variants: [
          { nameKh: 'ម្នាស់', nameEn: 'Pineapple', defaultPercent: 85 },
          { nameKh: 'ម្នាស់ទឹកឃ្មុំ', nameEn: 'Sweet Honey Pineapple', defaultPercent: 90 }
        ]
      },
      {
        id: 'coconut',
        nameKh: 'ដូង',
        nameEn: 'Coconut',
        defaultPercent: 30,
        variants: [
          { nameKh: 'ដូង', nameEn: 'Coconut', defaultPercent: 30 },
          { nameKh: 'ខ្ទិះដូង', nameEn: 'Coconut Milk / Cream', defaultPercent: 35 },
          { nameKh: 'សាច់ដូងកោស', nameEn: 'Desiccated Coconut Flakes', defaultPercent: 15 },
          { nameKh: 'ប្រេងដូង', nameEn: 'Virgin Coconut Oil', defaultPercent: 4 }
        ]
      },
      {
        id: 'tamarind',
        nameKh: 'អំពិល',
        nameEn: 'Tamarind',
        defaultPercent: 15,
        variants: [
          { nameKh: 'អំពិល', nameEn: 'Tamarind', defaultPercent: 15 },
          { nameKh: 'សាច់អំពិលទុំ', nameEn: 'Ripe Tamarind Pulp', defaultPercent: 20 }
        ]
      },
      {
        id: 'longan',
        nameKh: 'មៀន',
        nameEn: 'Longan',
        defaultPercent: 85,
        variants: [
          { nameKh: 'មៀន', nameEn: 'Longan Fruit', defaultPercent: 85 },
          { nameKh: 'ដំណាប់មៀន', nameEn: 'Dried Longan Meat', defaultPercent: 90 }
        ]
      },
      {
        id: 'jackfruit',
        nameKh: 'ខ្នុរ',
        nameEn: 'Jackfruit',
        defaultPercent: 85,
        variants: [
          { nameKh: 'ខ្នុរ', nameEn: 'Jackfruit', defaultPercent: 85 },
          { nameKh: 'ខ្នុរទុំ', nameEn: 'Ripe Golden Jackfruit', defaultPercent: 90 }
        ]
      },
      {
        id: 'dragonfruit',
        nameKh: 'ស្រកានាគ',
        nameEn: 'Dragonfruit',
        defaultPercent: 85,
        variants: [
          { nameKh: 'ស្រកានាគ', nameEn: 'Dragonfruit', defaultPercent: 85 }
        ]
      }
    ]
  }
];

// Term mapping dictionary for automatic Khmer -> English ingredient translation
const INGREDIENT_TERMS: { khmer: string; english: string }[] = [
  // Multi-word / specific terms first to avoid sub-word collisions
  { khmer: 'ទឹកដោះគោខាប់ផ្អែម', english: 'Sweetened Condensed Creamer' },
  { khmer: 'ទឹកដោះគោខាប់', english: 'Sweetened Condensed Milk' },
  { khmer: 'ម្សៅទឹកដោះគោ', english: 'Milk Powder' },
  { khmer: 'ទឹកដោះគោ', english: 'Milk' },
  { khmer: 'ស្ករត្នោតកំពង់ស្ពឺ', english: 'GI Kampong Speu Palm Sugar' },
  { khmer: 'ស្ករត្នោត', english: 'Palm Sugar' },
  { khmer: 'ស្ករសគ្រាប់', english: 'Granulated White Sugar' },
  { khmer: 'ម្សៅស្ករសម៉ត់', english: 'Powdered Icing Sugar' },
  { khmer: 'ស្ករស', english: 'White Sugar' },
  { khmer: 'ស្ករអំពៅ', english: 'Cane Sugar' },
  { khmer: 'ស្ករស៊ីរ៉ូខាប់', english: 'Condensed Sugar Syrup' },
  { khmer: 'ស្ករ', english: 'Sugar' },

  { khmer: 'ផ្កាអំបិលកំពត', english: 'GI Kampot Fleur de Sel' },
  { khmer: 'អំបិលកំពត', english: 'Kampot Salt' },
  { khmer: 'អំបិលអ៊ីយ៉ូត', english: 'Iodized Salt' },
  { khmer: 'អំបិលអ៊ីយូដ', english: 'Iodized Salt' },
  { khmer: 'អំបិលសមុទ្រ', english: 'Sea Salt' },
  { khmer: 'អំបិលផ្កាឈូក', english: 'Pink Himalayan Salt' },
  { khmer: 'អំបិល', english: 'Salt' },

  { khmer: 'ម្រេចខ្មៅកំពត', english: 'GI Kampot Black Pepper' },
  { khmer: 'ម្រេចសកំពត', english: 'GI Kampot White Pepper' },
  { khmer: 'ម្រេចក្រហមកំពត', english: 'GI Kampot Red Pepper' },
  { khmer: 'ម្រេចកំពត', english: 'GI Kampot Pepper' },
  { khmer: 'ម្រេចខ្មៅ', english: 'Black Pepper' },
  { khmer: 'ម្រេចស', english: 'White Pepper' },
  { khmer: 'ម្សៅស្រោបម្រេច', english: 'Pepper Coating' },
  { khmer: 'ម្រេច', english: 'Pepper' },

  { khmer: 'ម្ទេសហិរធម្មជាតិ', english: 'Fresh Bird Chili' },
  { khmer: 'ម្ទេសក្រៀម', english: 'Dried Chili' },
  { khmer: 'ម្សៅម្ទេស', english: 'Chili Powder' },
  { khmer: 'ម្សៅស្រោបម្ទេស', english: 'Chili Coating' },
  { khmer: 'ម្ទេសប្លោក', english: 'Bell Pepper' },
  { khmer: 'ម្ទេស', english: 'Chili' },

  { khmer: 'ខ្ទឹមសបំពងស្រួយ', english: 'Crispy Fried Garlic' },
  { khmer: 'ម្សៅខ្ទឹមស', english: 'Garlic Powder' },
  { khmer: 'ខ្ទឹមស', english: 'Garlic' },
  { khmer: 'ខ្ទឹមបារាំង', english: 'Onion' },
  { khmer: 'ខ្ទឹមក្រហមបំពង', english: 'Fried Shallots' },
  { khmer: 'ខ្ទឹមក្រហម', english: 'Shallots' },
  { khmer: 'ស្លឹកខ្ទឹម', english: 'Spring Onion' },

  { khmer: 'សាច់ជ្រូកបីជាន់', english: 'Pork Belly' },
  { khmer: 'សាច់ជ្រូកសុទ្ធ', english: 'Lean Pork' },
  { khmer: 'ខ្លាញ់ជ្រូកធម្មជាតិ', english: 'Pork Lard' },
  { khmer: 'ស្បែកជ្រូក', english: 'Pork Skin' },
  { khmer: 'សាច់ជ្រូក', english: 'Pork' },

  { khmer: 'សាច់គោខ្មែរស្រស់', english: 'Fresh Cambodian Beef' },
  { khmer: 'សាច់គោក្រៀម', english: 'Dried Beef' },
  { khmer: 'សាច់គោ', english: 'Beef' },

  { khmer: 'សាច់ត្រីរ៉ស់', english: 'Snakehead Fish Fillet' },
  { khmer: 'សាច់ត្រីអត់ឆ្អឹង', english: 'Boneless Fish Meat' },
  { khmer: 'សាច់ត្រីប្រា', english: 'Pangasius Fish' },
  { khmer: 'សាច់ត្រីសាលម៉ុន', english: 'Salmon' },
  { khmer: 'ត្រីងៀត', english: 'Dried Fish' },
  { khmer: 'សាច់ត្រី', english: 'Fish' },

  { khmer: 'សាច់មាន់ស្រែ', english: 'Free-Range Chicken' },
  { khmer: 'ទ្រូងមាន់សុទ្ធ', english: 'Chicken Breast' },
  { khmer: 'សាច់មាន់', english: 'Chicken' },

  { khmer: 'បង្គាក្រៀម', english: 'Dried Shrimp' },
  { khmer: 'សាច់បង្គាស្រស់', english: 'Fresh Shrimp' },
  { khmer: 'បង្គា', english: 'Shrimp' },
  { khmer: 'កាពិ', english: 'Shrimp Paste' },

  { khmer: 'សាច់ក្តាមសេះ', english: 'Blue Swimming Crab' },
  { khmer: 'សាច់ក្តាម', english: 'Crab Meat' },
  { khmer: 'ក្តាម', english: 'Crab' },

  { khmer: 'មឹកក្រៀម', english: 'Dried Squid' },
  { khmer: 'មឹក', english: 'Squid' },

  { khmer: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា', english: 'Cambodian Cashews' },
  { khmer: 'ម្សៅគ្រាប់ស្វាយចន្ទី', english: 'Cashew Nut Flour' },
  { khmer: 'ប័រគ្រាប់ស្វាយចន្ទី', english: 'Cashew Butter' },
  { khmer: 'គ្រាប់ស្វាយចន្ទី', english: 'Cashew Kernels' },

  { khmer: 'ល្ងខ្មៅ', english: 'Black Sesame' },
  { khmer: 'ល្ងស', english: 'White Sesame' },
  { khmer: 'ប្រេងល្ង', english: 'Sesame Oil' },
  { khmer: 'ល្ង', english: 'Sesame' },

  { khmer: 'ពោតផ្អែម', english: 'Sweet Corn' },
  { khmer: 'ម្សៅពោត', english: 'Cornstarch' },
  { khmer: 'ពោត', english: 'Corn' },

  { khmer: 'សណ្ដែកដីលីង', english: 'Roasted Peanuts' },
  { khmer: 'ប័ររណ្តែកដី', english: 'Peanut Butter' },
  { khmer: 'សណ្ដែកដី', english: 'Peanuts' },
  { khmer: 'សណ្ដែកសៀង', english: 'Soybeans' },
  { khmer: 'ម្សៅសណ្ដែកសៀង', english: 'Soy Flour' },
  { khmer: 'សណ្ដែកបាយ', english: 'Mung Beans' },

  { khmer: 'អង្ករផ្កាម្លិះ', english: 'Jasmine Rice' },
  { khmer: 'អង្ករដំណើប', english: 'Sticky Rice' },
  { khmer: 'ម្សៅអង្ករ', english: 'Rice Flour' },
  { khmer: 'អង្ករ', english: 'Rice' },

  { khmer: 'គ្រាប់ឈូកស្ងួត', english: 'Dried Lotus Seeds' },
  { khmer: 'គ្រាប់ឈូក', english: 'Lotus Seeds' },

  { khmer: 'ត្រសក់ស្រស់', english: 'Fresh Cucumber' },
  { khmer: 'ត្រសក់ត្រាំ', english: 'Pickled Cucumber' },
  { khmer: 'ត្រសក់', english: 'Cucumber' },

  { khmer: 'ការ៉ុតស្រស់', english: 'Fresh Carrot' },
  { khmer: 'ការ៉ុត', english: 'Carrot' },
  { khmer: 'ប៉េងប៉ោះស្ងួត', english: 'Dried Tomato' },
  { khmer: 'ប៉េងប៉ោះ', english: 'Tomato' },
  { khmer: 'ផ្សិតក្រៀម', english: 'Dried Mushroom' },
  { khmer: 'ផ្សិត', english: 'Mushroom' },

  { khmer: 'សាច់ផ្លែប័រ', english: 'Fresh Avocado Pulp' },
  { khmer: 'ម្សៅផ្លែប័រ', english: 'Avocado Powder' },
  { khmer: 'ផ្លែប័រ', english: 'Avocado' },
  { khmer: 'ប័រធម្មជាតិ', english: 'Pure Butter' },
  { khmer: 'ប័រ', english: 'Avocado' },

  { khmer: 'ស្វាយកែវរមៀត', english: 'Keo Romeat Mango' },
  { khmer: 'ដំណាប់ស្វាយ', english: 'Dried Mango' },
  { khmer: 'ស្វាយ', english: 'Mango' },

  { khmer: 'ចេកណាំវ៉ា', english: 'Namwa Banana' },
  { khmer: 'ចេកក្រៀម', english: 'Banana Chips' },
  { khmer: 'ចេក', english: 'Banana' },

  { khmer: 'សាច់ធុរេនកំពត', english: 'Kampot Durian Meat' },
  { khmer: 'ធុរេនក្រៀម', english: 'Freeze-Dried Durian' },
  { khmer: 'ធុរេន', english: 'Durian' },

  { khmer: 'ម្នាស់ទឹកឃ្មុំ', english: 'Honey Pineapple' },
  { khmer: 'ម្នាស់', english: 'Pineapple' },

  { khmer: 'ខ្ទិះដូង', english: 'Coconut Cream' },
  { khmer: 'សាច់ដូងកោស', english: 'Desiccated Coconut' },
  { khmer: 'ប្រេងដូង', english: 'Virgin Coconut Oil' },
  { khmer: 'ដូង', english: 'Coconut' },

  { khmer: 'សាច់អំពិលទុំ', english: 'Ripe Tamarind' },
  { khmer: 'អំពិល', english: 'Tamarind' },
  { khmer: 'ដំណាប់មៀន', english: 'Dried Longan' },
  { khmer: 'មៀន', english: 'Longan' },
  { khmer: 'ខ្នុរទុំ', english: 'Ripe Jackfruit' },
  { khmer: 'ខ្នុរ', english: 'Jackfruit' },
  { khmer: 'ស្រកានាគ', english: 'Dragonfruit' },

  { khmer: 'គ្រឿងស្លឹកគ្រៃរមៀត', english: 'Khmer Kroeung Paste' },
  { khmer: 'ស្លឹកគ្រៃ', english: 'Lemongrass' },
  { khmer: 'ម្សៅខ្ញី', english: 'Ginger Powder' },
  { khmer: 'ខ្ញី', english: 'Ginger' },
  { khmer: 'ម្សៅរមៀត', english: 'Turmeric Powder' },
  { khmer: 'រមៀត', english: 'Turmeric' },
  { khmer: 'ទឹកត្រីកោះកុង', english: 'Koh Kong Fish Sauce' },
  { khmer: 'ទឹកត្រី', english: 'Fish Sauce' },
  { khmer: 'ទឹកស៊ីអ៊ីវខាប់', english: 'Dark Sweet Soy Sauce' },
  { khmer: 'ទឹកស៊ីអ៊ីវ', english: 'Soy Sauce' },
  { khmer: 'ទឹកឃ្មុំព្រៃធម្មជាតិ', english: 'Wild Forest Honey' },
  { khmer: 'ទឹកឃ្មុំ', english: 'Honey' }
];

// Convert Khmer numerals (០-៩) to Western (0-9)
export function khmerNumberToWestern(str: string): string {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  let res = str;
  khmerDigits.forEach((kd, idx) => {
    res = res.replaceAll(kd, idx.toString());
  });
  return res;
}

// Translate a single ingredient phrase (e.g. "អំបិលកំពត ២%") to bilingual format: "អំបិលកំពត ២% (Kampot Salt 2%)"
export function translateSingleIngredient(rawItem: string): string {
  const trimmed = rawItem.trim();
  if (!trimmed) return '';

  // If it already has English translation inside parenthesis (e.g. "អំបិល ២% (Salt 2%)"), leave it untouched
  if (/\(.*[a-zA-Z]+.*\)/.test(trimmed)) {
    return trimmed;
  }

  // Extract percentage if present (e.g. "៩៥%", "2%", "1.5%")
  const percentMatch = trimmed.match(/([០-៩0-9]+(?:\.[០-៩0-9]+)?)\s*%/);
  let percentStr = '';
  let percentWestern = '';
  if (percentMatch) {
    percentStr = percentMatch[0];
    percentWestern = khmerNumberToWestern(percentStr);
  }

  // Strip percentage for term matching
  const termOnly = trimmed.replace(/([០-៩0-9]+(?:\.[០-៩0-9]+)?)\s*%/, '').trim();

  // Find best translation match
  let matchedEnglish = '';
  for (const entry of INGREDIENT_TERMS) {
    if (termOnly.includes(entry.khmer)) {
      matchedEnglish = entry.english;
      break;
    }
  }

  // If no direct term matched, use termOnly or fallback
  if (!matchedEnglish) {
    matchedEnglish = termOnly;
  }

  // Formulate bilingual output
  const englishFull = percentWestern ? `${matchedEnglish} ${percentWestern}` : matchedEnglish;
  return `${trimmed} (${englishFull})`;
}

// Auto-translate entire comma or newline separated ingredients list
export function autoTranslateFullIngredientsList(rawText: string): string {
  if (!rawText || !rawText.trim()) return '';

  // Determine separator (comma or newline)
  const isNewline = rawText.includes('\n') && !rawText.includes(',');
  const delimiter = isNewline ? '\n' : ', ';

  const parts = rawText.split(isNewline ? /\n+/ : /[,،]+/);
  const translatedParts = parts
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => translateSingleIngredient(p));

  return translatedParts.join(delimiter);
}

export interface ParsedIngredientItem {
  original: string;
  nameKh: string;
  nameEn: string;
  percent: number | null;
  hasPercentage: boolean;
}

// Extract numeric percentage from string, supporting Khmer numerals (០-៩) and Western digits (0-9)
export function extractPercentageNumber(text: string): number | null {
  if (!text) return null;
  const match = text.match(/([០-៩0-9]+(?:\.[០-៩0-9]+)?)\s*%/);
  if (!match) return null;
  const western = khmerNumberToWestern(match[1]);
  const parsed = parseFloat(western);
  return isNaN(parsed) ? null : parsed;
}

// Format percentage neatly without floating point artifacts (e.g. 93.995% or 94%)
export function formatIngredientPercent(num: number): string {
  const rounded = Number(num.toFixed(4));
  return `${rounded}%`;
}

// Clean and parse a single ingredient chunk (e.g. "គ្រាប់ស្វាយចន្ទី 93.៥% (Cashew Kernels 93.៥%)")
export function parseIngredientChunk(rawItem: string): ParsedIngredientItem {
  const raw = rawItem.trim();
  if (!raw) {
    return { original: '', nameKh: '', nameEn: '', percent: null, hasPercentage: false };
  }

  // Check parenthetical clause at end: e.g. (Cashew Kernels 93.៥%) or (៥%)
  const parenMatch = raw.match(/\((.*?)\)$/);
  const parenContent = parenMatch ? parenMatch[1].trim() : '';
  const mainPart = parenMatch ? raw.slice(0, parenMatch.index).trim() : raw;

  const pctMain = extractPercentageNumber(mainPart);
  const pctParen = parenContent ? extractPercentageNumber(parenContent) : null;
  const percent = pctMain !== null ? pctMain : pctParen;
  const hasPercentage = percent !== null;

  // Clean names by removing percentage notations
  let cleanKh = mainPart.replace(/([០-៩0-9]+(?:\.[០-៩0-9]+)?)\s*%/, '').trim();
  let cleanEn = parenContent ? parenContent.replace(/([០-៩0-9]+(?:\.[០-៩0-9]+)?)\s*%/, '').trim() : '';

  // If parenContent was purely numbers/percentages like "(៥%)" or "(5%)", clear cleanEn
  if (/^[០-៩0-9.\s%]+$/.test(cleanEn)) {
    cleanEn = '';
  }

  return {
    original: raw,
    nameKh: cleanKh,
    nameEn: cleanEn,
    percent,
    hasPercentage
  };
}

// Check if two ingredient entries represent the same ingredient item
export function areSameIngredient(a: ParsedIngredientItem, b: ParsedIngredientItem): boolean {
  if (!a.nameKh && !b.nameKh && !a.nameEn && !b.nameEn) return false;

  // 1. Direct Khmer name equality
  if (a.nameKh && b.nameKh && a.nameKh.toLowerCase() === b.nameKh.toLowerCase()) {
    return true;
  }

  // 2. Compare normalized Khmer consonant/vowel core
  const khA = a.nameKh.replace(/[^ក-អ\u17b6-\u17d2]/g, '');
  const khB = b.nameKh.replace(/[^ក-អ\u17b6-\u17d2]/g, '');
  if (khA && khB) {
    if (khA === khB) return true;
    // Core cashew: ស្វាយចន្ទី
    if (khA.includes('ស្វាយចន្ទី') && khB.includes('ស្វាយចន្ទី')) return true;
    // Pepper: ម្រេច
    if (khA.includes('ម្រេច') && khB.includes('ម្រេច')) return true;
    // Salt: អំបិល
    if (khA.includes('អំបិល') && khB.includes('អំបិល')) return true;
    // Sugar: ស្ករ
    if (khA.includes('ស្ករ') && khB.includes('ស្ករ')) return true;
    // Substring containment with sufficient length
    if (khA.length >= 6 && khB.length >= 6 && (khA.includes(khB) || khB.includes(khA))) {
      return true;
    }
  }

  // 3. Compare English name
  const enA = a.nameEn.replace(/[^a-zA-Z]/g, '').toLowerCase();
  const enB = b.nameEn.replace(/[^a-zA-Z]/g, '').toLowerCase();
  if (enA && enB) {
    if (enA === enB) return true;
    if (enA.includes('cashew') && enB.includes('cashew')) return true;
    if (enA.includes('pepper') && enB.includes('pepper')) return true;
    if (enA.includes('salt') && enB.includes('salt')) return true;
    if (enA.includes('sugar') && enB.includes('sugar')) return true;
  }

  return false;
}

// Combine and sum duplicate ingredients from comma or newline-delimited text
export function combineDuplicateIngredients(rawText: string): string {
  if (!rawText || !rawText.trim()) return rawText;

  const isNewline = rawText.includes('\n') && !rawText.includes(',');
  const delimiter = isNewline ? '\n' : ', ';
  const parts = rawText.split(isNewline ? /\n+/ : /[,،]+/).map(p => p.trim()).filter(Boolean);

  if (parts.length === 0) return rawText;

  const parsedItems = parts.map(parseIngredientChunk);

  // Group items that belong to the same ingredient
  const groups: ParsedIngredientItem[][] = [];

  for (const item of parsedItems) {
    let matchedGroup: ParsedIngredientItem[] | undefined;
    for (const group of groups) {
      if (areSameIngredient(group[0], item)) {
        matchedGroup = group;
        break;
      }
    }
    if (matchedGroup) {
      matchedGroup.push(item);
    } else {
      groups.push([item]);
    }
  }

  // Build the combined list
  const output: string[] = [];

  for (const group of groups) {
    if (group.length === 1) {
      // Clean to Khmer only
      const item = group[0];
      let pct = item.percent;
      // Fix any > 100 artifact (e.g. 193.095% -> 93.095%)
      if (pct !== null && pct > 100 && pct < 200) {
        pct = Number((pct - 100).toFixed(4));
      } else if (pct !== null && pct >= 200) {
        pct = 100;
      }
      if (pct !== null) {
        output.push(`${item.nameKh} ${formatIngredientPercent(pct)}`);
      } else {
        output.push(item.nameKh || item.original);
      }
    } else {
      const pcts = group.map(g => g.percent).filter((p): p is number => p !== null);
      let finalPercent: number | null = null;

      if (pcts.length > 0) {
        const has100 = pcts.some(p => Math.abs(p - 100) < 0.001);
        const non100 = pcts.filter(p => Math.abs(p - 100) >= 0.001);

        // If one was 100% placeholder (default) and another is custom, prefer custom!
        if (has100 && non100.length > 0) {
          finalPercent = non100.reduce((s, p) => s + p, 0);
        } else {
          finalPercent = pcts.reduce((s, p) => s + p, 0);
        }

        if (finalPercent > 100 && finalPercent < 200) {
          finalPercent = Number((finalPercent - 100).toFixed(4));
        } else if (finalPercent > 100) {
          finalPercent = 100;
        }
      }

      const primary = group[0];
      const nameKh = primary.nameKh;

      if (finalPercent !== null) {
        output.push(`${nameKh} ${formatIngredientPercent(finalPercent)}`);
      } else {
        output.push(nameKh);
      }
    }
  }

  return output.join(delimiter);
}

// Add or merge an ingredient into an existing ingredients list (Strictly Khmer-only in fill-in forms)
export function addOrMergeIngredientToList(
  currentList: string,
  newEntry: { nameKh: string; nameEn?: string; percent?: number | string }
): {
  updatedList: string;
  mergedWithExisting: boolean;
  prevPercent?: number;
  combinedPercent?: number;
  itemName: string;
} {
  const nameKh = (newEntry.nameKh || '').trim();
  const nameEn = (newEntry.nameEn || '').trim();
  let percentNum = typeof newEntry.percent === 'number'
    ? newEntry.percent
    : newEntry.percent ? extractPercentageNumber(`${newEntry.percent}%`) : null;

  // Sanity check: single ingredient cannot exceed 100%
  if (percentNum !== null && percentNum > 100 && percentNum < 200) {
    percentNum = Number((percentNum - 100).toFixed(4));
  } else if (percentNum !== null && percentNum >= 200) {
    percentNum = 100;
  }

  if (!nameKh) {
    return { updatedList: currentList, mergedWithExisting: false, itemName: '' };
  }

  const newItem: ParsedIngredientItem = {
    original: '',
    nameKh,
    nameEn,
    percent: percentNum,
    hasPercentage: percentNum !== null
  };

  const isNewline = currentList.includes('\n') && !currentList.includes(',');
  const delimiter = isNewline ? '\n' : ', ';
  const parts = currentList.split(isNewline ? /\n+/ : /[,،]+/).map(p => p.trim()).filter(Boolean);

  if (parts.length === 0) {
    const pctStr = percentNum !== null ? formatIngredientPercent(percentNum) : '';
    const entryStr = pctStr ? `${nameKh} ${pctStr}` : nameKh;
    return { updatedList: entryStr, mergedWithExisting: false, itemName: nameKh };
  }

  const parsedParts = parts.map(parseIngredientChunk);
  const matchIndex = parsedParts.findIndex(existing => areSameIngredient(existing, newItem));

  if (matchIndex !== -1) {
    const existing = parsedParts[matchIndex];
    const prevPct = existing.percent !== null ? existing.percent : null;
    
    // CRITICAL FIX: When user specifies a percentage for an existing ingredient in the builder,
    // they are setting/updating that ingredient's percentage. Do NOT add 100 + 93.095 = 193.095%!
    let targetPct: number | null = null;
    if (percentNum !== null) {
      targetPct = percentNum;
    } else {
      targetPct = prevPct;
    }

    if (targetPct !== null && targetPct > 100 && targetPct < 200) {
      targetPct = Number((targetPct - 100).toFixed(4));
    } else if (targetPct !== null && targetPct > 100) {
      targetPct = 100;
    }

    const mergedNameKh = existing.nameKh || nameKh;

    let updatedChunk = '';
    if (targetPct !== null && targetPct > 0) {
      const pctStr = formatIngredientPercent(targetPct);
      updatedChunk = `${mergedNameKh} ${pctStr}`;
    } else {
      updatedChunk = mergedNameKh;
    }

    parts[matchIndex] = updatedChunk;

    return {
      updatedList: parts.join(delimiter),
      mergedWithExisting: true,
      prevPercent: prevPct !== null ? prevPct : undefined,
      combinedPercent: targetPct !== null ? targetPct : undefined,
      itemName: mergedNameKh
    };
  } else {
    const pctStr = percentNum !== null ? formatIngredientPercent(percentNum) : '';
    const newChunk = pctStr ? `${nameKh} ${pctStr}` : nameKh;

    // Smart auto-balance: If list currently has only 1 ingredient with 100% (e.g. "គ្រាប់ស្វាយចន្ទីកម្ពុជា 100%"),
    // and user adds a new ingredient with e.g. 2% pepper, adjust the base ingredient to 98% (100 - 2 = 98%)
    // so recipe stays perfectly balanced at 100%!
    if (parsedParts.length === 1 && parsedParts[0].percent === 100 && percentNum !== null && percentNum > 0 && percentNum < 100) {
      const baseKh = parsedParts[0].nameKh;
      const balancedBasePct = Number((100 - percentNum).toFixed(4));
      const balancedBaseChunk = `${baseKh} ${formatIngredientPercent(balancedBasePct)}`;
      return {
        updatedList: `${balancedBaseChunk}${delimiter}${newChunk}`,
        mergedWithExisting: false,
        itemName: nameKh
      };
    }

    // Clean up any existing > 100 artifacts in other chunks
    for (let i = 0; i < parts.length; i++) {
      const pItem = parsedParts[i];
      if (pItem.percent !== null && pItem.percent > 100 && pItem.percent < 200) {
        const fixedPct = Number((pItem.percent - 100).toFixed(4));
        parts[i] = `${pItem.nameKh} ${formatIngredientPercent(fixedPct)}`;
      }
    }

    return {
      updatedList: `${parts.join(delimiter)}${delimiter}${newChunk}`,
      mergedWithExisting: false,
      itemName: nameKh
    };
  }
}

/**
 * Intelligently balances ingredient percentages to sum up to exactly 100%.
 * Adjusts the primary/base ingredient (e.g. cashews) to 100% - sum(other ingredients),
 * and repairs any > 100% artifacts (e.g. 193.095% -> 93.095%).
 */
export function balanceIngredientsTo100(rawText: string): string {
  if (!rawText || !rawText.trim()) return rawText;

  const isNewline = rawText.includes('\n') && !rawText.includes(',');
  const delimiter = isNewline ? '\n' : ', ';
  
  // First run combine duplicates to unify duplicate items
  const unified = combineDuplicateIngredients(rawText);
  const parts = unified.split(isNewline ? /\n+/ : /[,،]+/).map(p => p.trim()).filter(Boolean);

  if (parts.length === 0) return rawText;

  const parsedItems = parts.map(parseIngredientChunk);

  if (parsedItems.length === 1) {
    const item = parsedItems[0];
    return `${item.nameKh} 100%`;
  }

  // Identify base ingredient (cashew or first item)
  let baseIndex = 0;
  for (let i = 0; i < parsedItems.length; i++) {
    const kh = parsedItems[i].nameKh;
    if (kh.includes('ស្វាយចន្ទី') || kh.includes('សាច់') || kh.includes('ត្រី') || kh.includes('អង្ករ') || kh.includes('ចេក') || kh.includes('ស្វាយ')) {
      baseIndex = i;
      break;
    }
  }

  // Sum all other ingredients
  let sumOthers = 0;
  for (let i = 0; i < parsedItems.length; i++) {
    if (i === baseIndex) continue;
    let p = parsedItems[i].percent;
    if (p !== null && p > 100 && p < 200) p = p - 100;
    if (p !== null && p > 100) p = 2;
    sumOthers += (p !== null ? p : 0);
  }

  // Base gets (100 - sumOthers)
  const basePercent = Math.max(0, Number((100 - sumOthers).toFixed(4)));

  const output: string[] = [];
  for (let i = 0; i < parsedItems.length; i++) {
    const item = parsedItems[i];
    if (i === baseIndex) {
      output.push(`${item.nameKh} ${formatIngredientPercent(basePercent)}`);
    } else {
      let p = item.percent;
      if (p !== null && p > 100 && p < 200) p = p - 100;
      if (p !== null && p > 100) p = 100;
      if (p !== null) {
        output.push(`${item.nameKh} ${formatIngredientPercent(p)}`);
      } else {
        output.push(item.nameKh);
      }
    }
  }

  return output.join(delimiter);
}

/**
 * Calculates current total percentage of ingredients and detects issues like > 100%
 */
export function calculateIngredientsTotalPercent(rawText: string): {
  totalPercent: number;
  itemCount: number;
  hasOver100: boolean;
  isBalanced: boolean;
  primaryItemName: string;
} {
  if (!rawText || !rawText.trim()) {
    return { totalPercent: 0, itemCount: 0, hasOver100: false, isBalanced: false, primaryItemName: '' };
  }

  const isNewline = rawText.includes('\n') && !rawText.includes(',');
  const parts = rawText.split(isNewline ? /\n+/ : /[,،]+/).map(p => p.trim()).filter(Boolean);
  const parsed = parts.map(parseIngredientChunk);

  let total = 0;
  let hasOver100 = false;
  for (const it of parsed) {
    if (it.percent !== null) {
      total += it.percent;
      if (it.percent > 100) hasOver100 = true;
    }
  }

  const roundedTotal = Number(total.toFixed(4));
  return {
    totalPercent: roundedTotal,
    itemCount: parsed.length,
    hasOver100: hasOver100 || roundedTotal > 100.01,
    isBalanced: Math.abs(roundedTotal - 100) <= 0.05,
    primaryItemName: parsed[0]?.nameKh || ''
  };
}

// Detect duplicate ingredients in a list for live UI suggestions and warnings
export function detectDuplicateIngredients(rawText: string): {
  hasDuplicates: boolean;
  duplicates: Array<{
    nameKh: string;
    nameEn: string;
    count: number;
    individualPercents: number[];
    combinedPercent: number;
  }>;
  combinedText: string;
} {
  if (!rawText || !rawText.trim()) {
    return { hasDuplicates: false, duplicates: [], combinedText: rawText };
  }

  const isNewline = rawText.includes('\n') && !rawText.includes(',');
  const parts = rawText.split(isNewline ? /\n+/ : /[,،]+/).map(p => p.trim()).filter(Boolean);

  if (parts.length <= 1) {
    return { hasDuplicates: false, duplicates: [], combinedText: rawText };
  }

  const parsedItems = parts.map(parseIngredientChunk);
  const groups: ParsedIngredientItem[][] = [];

  for (const item of parsedItems) {
    let matchedGroup: ParsedIngredientItem[] | undefined;
    for (const group of groups) {
      if (areSameIngredient(group[0], item)) {
        matchedGroup = group;
        break;
      }
    }
    if (matchedGroup) {
      matchedGroup.push(item);
    } else {
      groups.push([item]);
    }
  }

  const duplicates = groups
    .filter(g => g.length > 1)
    .map(g => {
      const pcts = g.map(it => it.percent).filter((p): p is number => p !== null);
      const combined = pcts.reduce((sum, p) => sum + p, 0);
      return {
        nameKh: g[0].nameKh,
        nameEn: g.find(it => it.nameEn)?.nameEn || '',
        count: g.length,
        individualPercents: pcts,
        combinedPercent: Number(combined.toFixed(4))
      };
    });

  const hasDuplicates = duplicates.length > 0;
  const combinedText = hasDuplicates ? combineDuplicateIngredients(rawText) : rawText;

  return {
    hasDuplicates,
    duplicates,
    combinedText
  };
}

// ---------------------------------------------------------------------------
// MONOLINGUAL KHMER CLEANERS FOR FILL-IN SECTIONS (Ensures zero English text)
// ---------------------------------------------------------------------------

/**
 * Strips all English translations, Latin marketing text, and parenthetical phrases
 * from the ingredients list so that the fill-in section contains 100% pure Khmer text.
 */
export function cleanIngredientsToKhmerOnly(rawText: string): string {
  if (!rawText || !rawText.trim()) return '';

  const isNewline = rawText.includes('\n') && !rawText.includes(',');
  const delimiter = isNewline ? '\n' : ', ';
  const chunks = rawText.split(isNewline ? /\n+/ : /[,،]+/).map(c => c.trim()).filter(Boolean);

  const cleanedChunks: string[] = [];

  for (const chunk of chunks) {
    // 1. If chunk has Khmer characters
    const hasKhmer = /[\u1780-\u17ff]/.test(chunk);

    if (hasKhmer) {
      // Remove any parenthetical English: e.g. "(WW180 Cashews 93%)" or "(Kampot Black Pepper 5%)"
      let cleaned = chunk.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '').trim();

      // Remove standalone Latin words if Khmer text is present
      cleaned = cleaned.replace(/\b[A-Za-z0-9-]+\s*(?:Cashews?|Pepper|Sugar|Salt|Kernels?|Pure|Additives?|Preservatives?)\b/gi, '').trim();

      // Remove dangling dashes, colons, or multiple spaces
      cleaned = cleaned.replace(/^[\s—–:-]+|[\s—–:-]+$/g, '').replace(/\s{2,}/g, ' ').trim();

      if (cleaned) {
        cleanedChunks.push(cleaned);
      }
    } else {
      // If purely English/Latin (e.g. "100% Pure Cambodian Cashew Kernels (Anacardium occidentale) — No Additives, No Preservatives")
      // Check if it's Cashew kernel marketing preamble
      const lower = chunk.toLowerCase();
      if (lower.includes('cashew') || lower.includes('anacardium') || lower.includes('ws') || lower.includes('ww')) {
        const pct = extractPercentageNumber(chunk);
        const isBroken = lower.includes('broken') || lower.includes('split') || lower.includes('ws');
        const isFlour = lower.includes('flour') || lower.includes('powder');
        if (isFlour) {
          cleanedChunks.push(pct ? `ម្សៅគ្រាប់ស្វាយចន្ទី ${pct}%` : 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%');
        } else if (isBroken) {
          cleanedChunks.push(pct ? `គ្រាប់ស្វាយចន្ទីបែក/ពុះកម្ពុជា ${pct}%` : 'គ្រាប់ស្វាយចន្ទីបែក/ពុះកម្ពុជា');
        } else if (pct) {
          cleanedChunks.push(`គ្រាប់ស្វាយចន្ទីកម្ពុជា ${pct}%`);
        } else if (!chunks.some(c => /[\u1780-\u17ff]/.test(c) && c.includes('ស្វាយចន្ទី'))) {
          cleanedChunks.push('គ្រាប់ស្វាយចន្ទីកម្ពុជា ១០០%');
        }
      } else if (lower.includes('pepper') || lower.includes('piper')) {
        const pct = extractPercentageNumber(chunk);
        cleanedChunks.push(pct ? `ម្រេចខ្មៅកំពត GI ${pct}%` : 'ម្រេចខ្មៅកំពត GI');
      } else if (lower.includes('chili') || lower.includes('capsicum')) {
        const pct = extractPercentageNumber(chunk);
        cleanedChunks.push(pct ? `ម្ទេសធម្មជាតិ ${pct}%` : 'ម្ទេសធម្មជាតិ');
      } else if (lower.includes('sugar')) {
        const pct = extractPercentageNumber(chunk);
        cleanedChunks.push(pct ? `ស្ករត្នោតធម្មជាតិ ${pct}%` : 'ស្ករត្នោតធម្មជាតិ');
      } else if (lower.includes('salt')) {
        const pct = extractPercentageNumber(chunk);
        cleanedChunks.push(pct ? `អំបិលសមុទ្រកំពត ${pct}%` : 'អំបិលសមុទ្រកំពត');
      } else if (lower.includes('garlic')) {
        const pct = extractPercentageNumber(chunk);
        cleanedChunks.push(pct ? `ខ្ទឹមស ${pct}%` : 'ខ្ទឹមស');
      }
    }
  }

  return cleanedChunks.join(delimiter);
}

/**
 * Cleans allergen advice to pure Khmer without English slashes or Latin text
 */
export function cleanKhmerAllergenOnly(rawAllergen: string): string {
  if (!rawAllergen || !rawAllergen.trim()) return '';
  const text = rawAllergen.trim();

  // If already bilingual with slash like "CONTAINS: TREE NUTS (CASHEW) / ផ្ទុកសារធាតុអាឡែហ្ស៊ី: គ្រាប់ស្វាយចន្ទី"
  if (text.includes('/')) {
    const parts = text.split('/');
    const khmerPart = parts.find(p => /[\u1780-\u17ff]/.test(p));
    if (khmerPart) {
      return khmerPart.replace(/[a-zA-Z()]/g, '').replace(/\s{2,}/g, ' ').trim();
    }
  }

  // Remove English keywords and brackets
  let cleaned = text.replace(/CONTAINS:?\s*(?:TREE\s*NUTS?|PEANUTS?|SOY|GLUTEN-FREE|DAIRY-FREE|ALLERGEN-FREE)?/gi, '');
  cleaned = cleaned.replace(/\([^)]*[a-zA-Z][^)]*\)/g, '');
  cleaned = cleaned.replace(/[A-Za-z]/g, '');
  cleaned = cleaned.replace(/^[\s—–:/-]+|[\s—–:/-]+$/g, '').replace(/\s{2,}/g, ' ').trim();

  if (!cleaned) {
    if (/cashew|nut/i.test(text)) return 'ផ្ទុកសារធាតុបង្កប្រតិកម្ម៖ គ្រាប់ស្វាយចន្ទី';
    if (/gluten|dairy/i.test(text)) return 'គ្មានជាតិគ្លុយតែន និងគ្មានផលិតផលទឹកដោះគោ';
    return 'ផ្ទុកសារធាតុបង្កប្រតិកម្ម៖ គ្រាប់ស្វាយចន្ទី';
  }

  return cleaned;
}

/**
 * Cleans storage instructions to pure Khmer without English parentheticals
 */
export function cleanKhmerStorageOnly(rawStorage: string): string {
  if (!rawStorage || !rawStorage.trim()) return '';
  let cleaned = rawStorage.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '');
  // Remove trailing English sentences
  cleaned = cleaned.replace(/\b(?:Store in a cool dry place|Keep zipper|Reseal tightly|Refrigerate).*$/gi, '');
  cleaned = cleaned.replace(/Store in.*$/gi, '');
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
  if (!cleaned || !/[\u1780-\u17FF]/.test(cleaned)) {
    return 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ ក្រោម ២៥°C ជៀសវាងពន្លឺថ្ងៃ និងសំណើម។ ក្រោយបើកប្រើរួច ត្រូវបិទខ្សែរូត ឬគម្របឱ្យជិត។';
  }
  return cleaned;
}

/**
 * Cleans instructions for use to pure Khmer
 */
export function cleanKhmerUsageOnly(rawUsage: string, isFlourProduct: boolean = false): string {
  if (!rawUsage || !rawUsage.trim()) {
    if (isFlourProduct) {
      return '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ';
    }
    return '';
  }
  let cleaned = rawUsage.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '');
  cleaned = cleaned.replace(/\b(?:Ready-to-eat|Serve as|Snack).*$/gi, '');
  cleaned = cleaned.replace(/[ \t]{2,}/g, ' ').trim();

  const lower = rawUsage.toLowerCase();
  const isTea = lower.includes('tea') || lower.includes('infus') || lower.includes('tisane') || rawUsage.includes('តែ') || rawUsage.includes('ស្លឹកគ្រៃ') || rawUsage.includes('អញ្ជ័ន');

  // If accidentally assigned tea brew instructions (250ml hot water) to cashew flour or non-tea products
  if (!isTea && (rawUsage.includes('២៥០') || lower.includes('250ml') || rawUsage.includes('៨៥°C') || lower.includes('85°c') || lower.includes('brew'))) {
    if (isFlourProduct || lower.includes('flour') || lower.includes('powder') || rawUsage.includes('ម្សៅ') || rawUsage.includes('ចន្ទី')) {
      return '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ';
    }
    return 'អាចទទួលទានភ្លាមៗជាអាហារសម្រន់សុខភាព ឬប្រើជាគ្រឿងបន្ថែមរសជាតិលើសាឡាត់ បបរ និងម្ហូបអាហារផ្សេងៗ។ ក្រោយបើកប្រើរួច ត្រូវបិទឱ្យជិត។';
  }

  if (!cleaned || !/[\u1780-\u17FF]/.test(cleaned)) {
    if (isFlourProduct || lower.includes('flour') || lower.includes('powder') || lower.includes('smoothie')) {
      return '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ';
    }
    return 'អាចទទួលទានភ្លាមៗជាអាហារសម្រន់សុខភាព ឬប្រើជាគ្រឿងបន្ថែមរសជាតិលើសាឡាត់ បបរ និងម្ហូបអាហារផ្សេងៗ។ ក្រោយបើកប្រើរួច ត្រូវបិទឱ្យជិត។';
  }
  return cleaned;
}

/**
 * Ensures that the official product name in Khmer is genuinely in Khmer script.
 * If rawText is in English/Latin or corrupted (e.g. "100% pure cashew nut powder"),
 * it restores or translates it to the authentic Khmer product name according to national standards.
 */
export function ensureKhmerProductName(rawText: string, fallbackEnglish?: string): string {
  const trimmed = (rawText || '').trim();
  const lowerRaw = trimmed.toLowerCase();
  const lowerFb = (fallbackEnglish || '').toLowerCase();
  const combined = `${lowerRaw} ${lowerFb}`;

  // Check if rawText contains genuine Khmer script characters (\u1780-\u17FF)
  const khmerMatches = trimmed.match(/[\u1780-\u17FF]/g) || [];
  const hasSubstantialKhmer = khmerMatches.length >= 2;

  // If it already has Khmer script:
  if (hasSubstantialKhmer) {
    // If the string starts with Latin/Korean words followed by Khmer in parens e.g. "100% Pure Cashew Flour (ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%)"
    const parenKhmerMatch = trimmed.match(/\(([\u1780-\u17FF\s0-9%.,\u17D2]+)\)/);
    if (!trimmed.match(/^[\u1780-\u17FF]/) && parenKhmerMatch && parenKhmerMatch[1].trim()) {
      return parenKhmerMatch[1].trim();
    }
    // If the text starts with Khmer script, return it
    if (/^[\u1780-\u17FF]/.test(trimmed)) {
      return trimmed;
    }
    // If it has Khmer anywhere, extract the Khmer portion
    const extractedKhmer = trimmed.replace(/^[a-zA-Z0-9\s%:.,()\-_/]+(?=[\u1780-\u17FF])/, '').trim();
    if (extractedKhmer && /^[\u1780-\u17FF]/.test(extractedKhmer)) {
      return extractedKhmer;
    }
  }

  // If rawText has NO Khmer characters at all (e.g. "100% pure cashew nut powder" or "100% Pure Cashew Kernel Flour"):
  // Intelligently map to official Cambodian national standard Khmer name:
  if (combined.includes('flour') || combined.includes('powder') || combined.includes('ម្សៅ') || combined.includes('smoothie')) {
    if (combined.includes('100%') || combined.includes('pure') || combined.includes('kernel') || combined.includes('nut')) {
      return 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%';
    }
    return 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%';
  }

  if (combined.includes('pepper') || combined.includes('kampot') || combined.includes('ម្រេច')) {
    if (combined.includes('gi') || combined.includes('kampot') || combined.includes('yas')) {
      return 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI';
    }
    return 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅ';
  }

  if (combined.includes('chili') || combined.includes('chilli') || combined.includes('spicy') || combined.includes('ម្ទេស')) {
    if (combined.includes('garlic') || combined.includes('ខ្ទឹម')) {
      return 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស & ខ្ទឹមស';
    }
    return 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហឹរ';
  }

  if (combined.includes('sugar') || combined.includes('caramel') || combined.includes('palm') || combined.includes('ស្ករ')) {
    return 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្នោត';
  }

  if (combined.includes('butter') || combined.includes('paste') || combined.includes('ប័រ')) {
    return 'ប័រគ្រាប់ស្វាយចន្ទីធម្មជាតិ';
  }

  if (combined.includes('mango') || combined.includes('keo')) {
    return 'ដំណាប់ស្វាយកែវរមៀត';
  }

  if (combined.includes('banana')) {
    return 'ដំណាប់ចេក / ចេកបំពង';
  }

  if (combined.includes('salt') || combined.includes('roasted') || combined.includes('លីង')) {
    return 'គ្រាប់ស្វាយចន្ទីលីងអំបិលធម្មជាតិ';
  }

  if (combined.includes('cashew') || combined.includes('kernel')) {
    return 'គ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់';
  }

  if (combined.includes('noodle') || combined.includes('noodles') || combined.includes('មី') || combined.includes('គុយទាវ')) {
    return 'មីគ្រាប់ស្វាយចន្ទីសុខភាពធម្មជាតិ';
  }

  return 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%';
}

/**
 * Returns accurate, professional Korean translation for products under
 * South Korean Ministry of Food and Drug Safety (식품의약품안전처 MFDS) food labeling standards.
 * Eliminates garbled prefixes like "% 100% Cas" and ensures natural, official terminology.
 */
export function getStandardKoreanProductName(
  rawKhmer: string, 
  rawEnglish: string, 
  isFlour: boolean = false
): string {
  // Cleanse any legacy corrupted fragments like "% 100% Cas" or Japanese Katakana "ウ"
  const cleanKhmer = (rawKhmer || '')
    .replace(/%\s*100%\s*cas/gi, '')
    .replace(/파ウ더/g, '파우더')
    .trim();
  const cleanEnglish = (rawEnglish || '')
    .replace(/%\s*100%\s*cas/gi, '')
    .trim();
  const combined = `${cleanKhmer} ${cleanEnglish}`.toLowerCase();

  // 0. Noodles (Healthy Cashew Nut Noodles)
  if (combined.includes('noodle') || combined.includes('noodles') || combined.includes('국수') || combined.includes('건면') || combined.includes('មី') || combined.includes('គុយទាវ')) {
    return '캄보디아산 프리미엄 캐슈넛 건면 (Healthy Cashew Nut Noodles)';
  }

  // 1. Flour / Powder (100% Pure Cashew Kernel Flour)
  if (isFlour || combined.includes('flour') || combined.includes('powder') || combined.includes('ម្សៅ') || combined.includes('파우더') || combined.includes('분말') || combined.includes('가루')) {
    return '100% 순수 캄보디아산 캐슈넛 파우더 (100% Pure Cashew Kernel Flour)';
  }

  // 2. Pepper coated cashews
  if (combined.includes('pepper') || combined.includes('ម្រេច')) {
    return '캄보디아 캄폿 GI 흑후추 코팅 캐슈넛 (GI Kampot Black Pepper Coated Cashews)';
  }

  // 3. Chili coated cashews
  if (combined.includes('chili') || combined.includes('chilli') || combined.includes('spicy') || combined.includes('ម្ទេស')) {
    return '매콤 칠리 & 마늘 코팅 캐슈넛 (Spicy Chili & Garlic Coated Cashews)';
  }

  // 4. Sugar coated cashews
  if (combined.includes('sugar') || combined.includes('caramel') || combined.includes('ស្ករ')) {
    return '캄퐁스페 팜슈가 글레이즈드 캐슈넛 (Kampong Speu Palm Sugar Glazed Cashews)';
  }

  // 5. Roasted salted cashews
  if (combined.includes('roasted') || combined.includes('salt') || combined.includes('លីង')) {
    return '캄보디아산 프리미엄 로스티드 솔티드 캐슈넛 (Natural Roasted Salted Cashews)';
  }

  // 6. Cashew butter
  if (combined.includes('butter') || combined.includes('ប័រ')) {
    return '100% 순수 무첨가 캐슈넛 버터 (100% Pure Natural Cashew Butter)';
  }

  // 7. Dried mango
  if (combined.includes('mango') || combined.includes('ស្វាយ')) {
    return '캄보디아산 프리미엄 건망고 (Premium Dried Keo Romeat Mango)';
  }

  // Default fallback
  return '캄보디아산 프리미엄 캐슈넛 (Cambodian Premium Cashews)';
}

// ---------------------------------------------------------------------------
// MULTILINGUAL EXPORT TRANSLATORS FOR CERTIFICATE & DIGITAL PASSPORT
// ---------------------------------------------------------------------------

interface IngredientLexicon {
  de: string;
  en: string;
  fr: string;
  ko: string;
  zh: string;
  ja: string;
  vi: string;
  th: string;
  nl: string;
  kh: string;
}

const INGREDIENT_LEXICON: Array<{ match: RegExp; trans: IngredientLexicon }> = [
  {
    match: /ម្សៅ(?:គ្រាប់)?ស្វាយចន្ទី|ម្សៅចន្ទី|cashew (?:kernel )?(?:flour|powder)/i,
    trans: {
      de: '100% Reines Cashewkernmehl',
      en: '100% Pure Cashew Kernel Flour',
      fr: 'Farine pure de noix de cajou',
      ko: '100% 순수 캄보디아산 캐슈넛 파우더',
      zh: '100% 纯正腰果仁粉',
      ja: '100% 純粋カシューナッツフラワー',
      vi: 'Bột hạt điều nguyên chất 100%',
      th: 'แป้งเม็ดมะม่วงหิมพานต์แท้ 100%',
      nl: '100% Puur Cashewmeel',
      kh: 'ម្សៅគ្រាប់ស្វាយចន្ទី'
    }
  },
  {
    match: /ម្សៅ(?:ស្លឹក)?តយ|ស្លឹកតយ|pandan(?: leaf)?(?: powder)?/i,
    trans: {
      de: 'Natürliches Pandanblatt-Pulver',
      en: 'Natural Pandan Leaf Powder',
      fr: 'Poudre naturelle de feuilles de pandan',
      ko: '천연 판단 잎 분말 (Pandan Powder)',
      zh: '天然斑斓叶粉 (Pandan Leaf Powder)',
      ja: '天然パンダンリーフパウダー',
      vi: 'Bột lá dứa tự nhiên',
      th: 'ผงใบเตยธรรมชาติ',
      nl: 'Natuurlijk Pandanpoeder',
      kh: 'ម្សៅស្លឹកតយធម្មជាតិ'
    }
  },
  {
    match: /ស្វាយចន្ទី|cashew|anacardium/i,
    trans: {
      de: 'Kambodschanische Cashewkerne',
      en: 'Cambodian Cashew Kernels',
      fr: 'Noix de cajou du Cambodge',
      ko: '캄보디아산 캐슈넛',
      zh: '柬埔寨优质腰果仁',
      ja: 'カンボジア産カシューナッツ',
      vi: 'Hạt điều Campuchia',
      th: 'เม็ดมะม่วงหิมพานต์กัมพูชา',
      nl: 'Cambodjaanse Cashewnoten',
      kh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា'
    }
  },
  {
    match: /ម្រេច|pepper|piper/i,
    trans: {
      de: 'Kampot Schwarzer Pfeffer (g.g.A.)',
      en: 'GI Kampot Black Pepper',
      fr: 'Poivre noir de Kampot IGP',
      ko: 'GI 캄폿 블랙페퍼',
      zh: '贡布地理标志黑胡椒',
      ja: 'カンポット黒胡椒 (GI)',
      vi: 'Tiêu đen Kampot GI',
      th: 'พริกไทยดำกัมปอต GI',
      nl: 'GI Kampot Zwarte Peper',
      kh: 'ម្រេចខ្មៅកំពត GI'
    }
  },
  {
    match: /ស្ករត្នោត|palm sugar|borassus/i,
    trans: {
      de: 'Kampong Speu Palmzucker (g.g.A.)',
      en: 'GI Kampong Speu Palm Sugar',
      fr: 'Sucre de palme de Kampong Speu IGP',
      ko: 'GI 캄퐁스페우 팜슈가',
      zh: '实居省地理标志棕榈糖',
      ja: 'コンポンスプー・パームシュガー (GI)',
      vi: 'Đường thốt nốt Kampong Speu GI',
      th: 'น้ำตาลโตนดกัมปงสปือ GI',
      nl: 'GI Kampong Speu Palmsuiker',
      kh: 'ស្ករត្នោតកំពង់ស្ពឺ GI'
    }
  },
  {
    match: /ស្ករ|sugar/i,
    trans: {
      de: 'Weißer Feinzucker',
      en: 'White Granulated Sugar',
      fr: 'Sucre blanc raffiné',
      ko: '백설탕',
      zh: '精制白砂糖',
      ja: '白砂糖',
      vi: 'Đường cát trắng',
      th: 'น้ำตาลทรายขาว',
      nl: 'Witte Kristalsuiker',
      kh: 'ស្ករស'
    }
  },
  {
    match: /ផ្កាអំបិល|fleur de sel/i,
    trans: {
      de: 'Kampot Fleur de Sel (g.g.A.)',
      en: 'GI Kampot Fleur de Sel',
      fr: 'Fleur de sel de Kampot IGP',
      ko: 'GI 캄폿 플뢰르 드 셀',
      zh: '贡布地理标志盐之花',
      ja: 'カンポット・フルール・ド・セル (GI)',
      vi: 'Muối hoa Fleur de Sel Kampot GI',
      th: 'ดอกเกลือกัมปอต GI',
      nl: 'GI Kampot Fleur de Sel',
      kh: 'ផ្កាអំបិលកំពត GI'
    }
  },
  {
    match: /អំបិល|salt/i,
    trans: {
      de: 'Kampot Meersalz',
      en: 'Natural Sea Salt',
      fr: 'Sel de mer naturel de Kampot',
      ko: '천일염',
      zh: '天然海盐',
      ja: '天然海塩',
      vi: 'Muối biển tự nhiên',
      th: 'เกลือสมุทรธรรมชาติ',
      nl: 'Natuurlijk Zeezout',
      kh: 'អំបិលសមុទ្រ'
    }
  },
  {
    match: /ម្ទេស|chili|capsicum/i,
    trans: {
      de: 'Kambodschanisches Chilipulver',
      en: 'Cambodian Chili Powder',
      fr: 'Piment du Cambodge',
      ko: '캄보디아산 고춧가루',
      zh: '柬埔寨辣椒粉',
      ja: 'カンボジア産唐辛子',
      vi: 'Bột ớt Campuchia',
      th: 'พริกป่นกัมพูชา',
      nl: 'Cambodjaans Chilipoeder',
      kh: 'ម្សៅម្ទេស'
    }
  },
  {
    match: /ល្ង|sesame/i,
    trans: {
      de: 'Sesamsamen',
      en: 'Sesame Seeds',
      fr: 'Graines de sésame',
      ko: '참깨',
      zh: '天然芝麻',
      ja: 'ごま',
      vi: 'Hạt mè',
      th: 'งาขาว',
      nl: 'Sesamzaad',
      kh: 'គ្រាប់ល្ង'
    }
  },
  {
    match: /ខ្ទឹម|garlic|shallot/i,
    trans: {
      de: 'Knoblauch & Schalotten',
      en: 'Garlic & Shallots',
      fr: 'Ail et échalotes',
      ko: '마늘 및 샬롯',
      zh: '大蒜与红葱头',
      ja: 'ニンニクとエシャロット',
      vi: 'Tỏi và hành tím',
      th: 'กระเทียมและหอมแดง',
      nl: 'Knoflook & Sjalotten',
      kh: 'ខ្ទឹមស និងខ្ទឹមក្រហម'
    }
  },
  {
    match: /ស្លឹកក្រូចសើច|kaffir lime/i,
    trans: {
      de: 'Kaffir-Limettenblätter',
      en: 'Kaffir Lime Leaves',
      fr: 'Feuilles de combava',
      ko: '카피르 라임 잎',
      zh: '马蜂橙叶',
      ja: 'カフィアライムリーフ',
      vi: 'Lá chanh Thái',
      th: 'ใบมะกรูด',
      nl: 'Kaffir Limoenblaadjes',
      kh: 'ស្លឹកក្រូចសើច'
    }
  },
  {
    match: /ទឹកឃ្មុំ|honey/i,
    trans: {
      de: 'Reiner Wildhonig',
      en: 'Pure Wild Honey',
      fr: 'Miel sauvage pur',
      ko: '자연산 야생꿀',
      zh: '纯天然野生蜂蜜',
      ja: '天然純粋ハチミツ',
      vi: 'Mật ong rừng nguyên chất',
      th: 'น้ำผึ้งป่าธรรมชาติ',
      nl: 'Zuivere Wilde Honing',
      kh: 'ទឹកឃ្មុំព្រៃធម្មជាតិ'
    }
  }
];

/**
 * Translates an ingredients list into the designated certificate/passport language.
 * Guarantees that when exporting in German, English, Korean, French, etc.,
 * all ingredients are displayed accurately in that language without mixed-language clutter!
 */
export function translateIngredientsToLanguage(rawIngredients: string, targetLang: string = 'en'): string {
  if (!rawIngredients || !rawIngredients.trim()) return '';
  const lang = (targetLang || 'en').toLowerCase();

  if (lang === 'kh' || lang === 'km') {
    return cleanIngredientsToKhmerOnly(rawIngredients);
  }

  // Handle special 100% pure cashew flour / powder full declaration phrase
  const isCashewFlourDeclaration = 
    rawIngredients.includes('ម្សៅ') ||
    rawIngredients.toLowerCase().includes('flour') ||
    rawIngredients.toLowerCase().includes('powder') ||
    (rawIngredients.includes('ចន្ទី') && (rawIngredients.includes('100%') || rawIngredients.includes('១០០%')));

  if (isCashewFlourDeclaration && (rawIngredients.includes('គ្មាន') || rawIngredients.includes('100%') || rawIngredients.includes('១០០%') || rawIngredients.toLowerCase().includes('zero') || rawIngredients.includes('សុទ្ធ'))) {
    if (lang === 'ko' || lang === 'kr') {
      return '100% 순수 캄보디아산 캐슈넛 가루 (100%) • 무염, 무설탕, 무방부제, 인공향료 무첨가, 무색소';
    }
    if (lang === 'de') {
      return '100% Reines kambodschanisches Cashewkernmehl (100%) • Ohne Salzzusatz, Ohne Zuckerzusatz, Ohne Konservierungsstoffe, Ohne künstliche Aromen, Ohne Farbstoffe';
    }
    if (lang === 'zh' || lang === 'cn') {
      return '100% 纯正柬埔寨腰果仁粉 (100%) • 无添加盐、无添加糖、无防腐剂、无人工香精、无色素';
    }
    if (lang === 'ja' || lang === 'jp') {
      return '100% 純粋カンボジア産カシューナッツフラワー (100%) • 食塩不使用、砂糖不使用、保存料無添加、香料無添加、着色料無添加';
    }
    if (lang === 'fr') {
      return '100% Farine pure de noix de cajou du Cambodge (100%) • Sans sel ajouté, sans sucre ajouté, sans conservateurs, sans arômes ajoutés, sans colorants';
    }
    return '100% Pure Cambodian Cashew Kernel Flour (100%) • Zero Added Salt, Zero Sugar, No Preservatives, No Added Flavor, No Added Color';
  }

  const isNewline = rawIngredients.includes('\n') && !rawIngredients.includes(',');
  const delimiter = isNewline ? '\n' : ', ';
  const chunks = rawIngredients.split(isNewline ? /\n+/ : /[,،•;]+/).map(c => c.trim()).filter(Boolean);

  const translatedList: string[] = [];

  for (const chunk of chunks) {
    const pct = extractPercentageNumber(chunk);
    const pctStr = pct !== null ? `${pct}%` : '';

    // Match against our comprehensive lexicon
    const matched = INGREDIENT_LEXICON.find(entry => entry.match.test(chunk));

    if (matched) {
      const langKey = (lang === 'km' || lang === 'kh') ? 'kh' : lang;
      const translatedName = matched.trans[langKey as keyof IngredientLexicon] || matched.trans.kh || matched.trans.en;
      translatedList.push(pctStr ? `${translatedName} ${pctStr}` : translatedName);
    } else {
      // Try fallback from English in parentheses if present
      const parenMatch = chunk.match(/\((.*?)\)/);
      if (parenMatch && parenMatch[1]) {
        let cleanName = parenMatch[1].replace(/([០-៩0-9]+(?:\.[០-៩0-9]+)?)\s*%/, '').trim();
        if (cleanName) {
          translatedList.push(pctStr ? `${cleanName} ${pctStr}` : cleanName);
          continue;
        }
      }
      // Clean Khmer letters if nothing matched
      const fallback = cleanIngredientsToKhmerOnly(chunk);
      translatedList.push(fallback);
    }
  }

  return translatedList.join(delimiter);
}

/**
 * Translates allergen warning into the target language for official certificates
 */
export function translateAllergenToLanguage(rawAllergen: string, targetLang: string = 'en'): string {
  if (!rawAllergen || !rawAllergen.trim()) return '';
  const lang = (targetLang || 'en').toLowerCase();
  const text = rawAllergen.toLowerCase();

  const isCashew = text.includes('cashew') || text.includes('ស្វាយចន្ទី') || text.includes('nut') || text.includes('គ្រាប់');
  const isPeanutSoy = text.includes('peanut') || text.includes('សណ្តែកដី') || text.includes('soy');
  const isGlutenFree = text.includes('gluten') || text.includes('គ្លុយតែន') || text.includes('dairy');

  if (isCashew) {
    switch (lang) {
      case 'de': return 'Enthält: Schalenfrüchte (Cashewkerne)';
      case 'fr': return 'Contient: Fruits à coque (Noix de cajou)';
      case 'ko': return '알레르기 유발물질: 견과류 (캐슈넛) 함유';
      case 'zh': return '含有：树坚果（腰果）';
      case 'ja': return 'アレルギー表示：カシューナッツを含む';
      case 'vi': return 'Chứa hạt cây (Hạt điều)';
      case 'th': return 'มีถั่วเปลือกแข็ง (เม็ดมะม่วงหิมพานต์)';
      case 'nl': return 'Bevat: Noten (Cashewnoten)';
      case 'kh':
      case 'km':
        return 'ផ្ទុកសារធាតុបង្កប្រតិកម្ម៖ គ្រាប់ស្វាយចន្ទី';
      case 'en':
      default: return 'CONTAINS: TREE NUTS (CASHEW)';
    }
  }

  if (isPeanutSoy) {
    switch (lang) {
      case 'de': return 'Enthält: Erdnüsse und Soja';
      case 'fr': return 'Contient: Arachides et Soja';
      case 'ko': return '알레르기 유발물질: 땅콩 및 대두 함유';
      case 'zh': return '含有：花生及大豆';
      case 'ja': return 'アレルギー表示：落花生および大豆を含む';
      case 'vi': return 'Chứa đậu phộng và đậu nành';
      case 'th': return 'มีถั่วลิสงและถั่วเหลือง';
      case 'nl': return 'Bevat: Pinda\'s en Soja';
      case 'kh':
      case 'km':
        return 'ផ្ទុកសារធាតុបង្កប្រតិកម្ម៖ សណ្តែកដី និងសណ្តែកសៀង';
      case 'en':
      default: return 'CONTAINS: PEANUTS & SOY';
    }
  }

  if (isGlutenFree) {
    switch (lang) {
      case 'de': return 'Glutenfrei & Laktosefrei (Keine Milchprodukte)';
      case 'fr': return 'Sans gluten & Sans produits laitiers';
      case 'ko': return '글루텐 프리 & 유제품 무첨가';
      case 'zh': return '无麸质、无乳制品';
      case 'ja': return 'グルテンフリー・乳成分不使用';
      case 'vi': return 'Không chứa gluten & Không chứa sữa';
      case 'th': return 'ปราศจากกลูเตนและนมวัว';
      case 'nl': return 'Glutenvrij & Zuivelvrij';
      case 'kh':
      case 'km':
        return 'គ្មានជាតិគ្លុយតែន និងគ្មានផលិតផលទឹកដោះគោ';
      case 'en':
      default: return 'GLUTEN-FREE & DAIRY-FREE';
    }
  }

  if (lang === 'kh' || lang === 'km') return cleanKhmerAllergenOnly(rawAllergen);
  return rawAllergen;
}

/**
 * Translates storage instructions into the target language for official certificates
 */
export function translateStorageToLanguage(rawStorage: string, targetLang: string = 'en'): string {
  if (!rawStorage || !rawStorage.trim()) return '';
  const lang = (targetLang || 'en').toLowerCase();

  if (lang === 'kh' || lang === 'km') {
    return cleanKhmerStorageOnly(rawStorage);
  }

  switch (lang) {
    case 'de':
      return 'Kühl und trocken lagern (< 25°C), vor direkter Sonneneinstrahlung schützen. Nach dem Öffnen gut wiederverschließen.';
    case 'fr':
      return 'Conserver dans un endroit frais et sec (< 25°C) à l\'abri du soleil. Bien refermer après ouverture.';
    case 'ko':
      return '직사광선을 피하고 서늘하고 건조한 곳(25°C 이하)에 보관하십시오. 개봉 후 지퍼백을 꼭 닫아 보관하십시오.';
    case 'zh':
      return '存放在阴凉干燥处（< 25°C），避免阳光直射。开封后请密封保存。';
    case 'ja':
      return '直射日光を避け、冷暗所（25℃以下）に保管してください。開封後はしっかり密閉してください。';
    case 'vi':
      return 'Bảo quản nơi khô ráo, thoáng mát (< 25°C), tránh ánh nắng trực tiếp. Đóng kín sau khi mở.';
    case 'th':
      return 'เก็บในที่แห้งและเย็น (< 25°C) หลีกเลี่ยงแสงแดด ปิดซองให้สนิทหลังเปิดใช้';
    case 'nl':
      return 'Koel en droog bewaren (< 25°C), uit de buurt van direct zonlicht. Na opening goed hersluiten.';
    case 'en':
    default:
      return 'Store in a cool, dry place (< 25°C) away from direct sunlight. Reseal tightly after use.';
  }
}

/**
 * Translates instructions for use & preparation into the target certificate language
 */
export function translateUsageToLanguage(rawUsage: string, targetLang: string = 'en', isFlourProduct: boolean = false): string {
  const lang = (targetLang || 'en').toLowerCase();
  const lower = (rawUsage || '').toLowerCase();

  const isTea = lower.includes('tea') || lower.includes('infus') || lower.includes('tisane') || (rawUsage && (rawUsage.includes('តែ') || rawUsage.includes('ស្លឹកគ្រៃ') || rawUsage.includes('អញ្ជ័ន')));

  // 1. Cashew Flour / Powder Culinary & Beverage Directions (Official Mayany Enterprise Standard)
  const isCashewFlourUsage = 
    isFlourProduct ||
    (!isTea && (
      rawUsage.includes('ទឹកដោះ') || 
      rawUsage.includes('ស្មូធី') || 
      rawUsage.includes('ម្សៅ') || 
      lower.includes('flour') || 
      lower.includes('powder') || 
      lower.includes('cashew milk') ||
      rawUsage.includes('នំប៉័ង') ||
      rawUsage.includes('នំប៊ីស្គីត') ||
      lower.includes('smoothie') ||
      lower.includes('baking') ||
      // If obsolete tea brewing text was attached to a flour product
      ((lower.includes('brew') || lower.includes('250ml') || rawUsage.includes('២៥០') || lower.includes('85°c') || rawUsage.includes('៨៥°C')) && (isFlourProduct || lower.includes('cashew') || rawUsage.includes('ចន្ទី')))
    ));

  if (lang === 'kh' || lang === 'km') {
    // Check if cashew flour / powder
    if (isCashewFlourUsage) {
      return '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ';
    }
    return cleanKhmerUsageOnly(rawUsage, isFlourProduct);
  }

  if (isCashewFlourUsage) {
    switch (lang) {
      case 'ko':
      case 'kr':
        return '• 따뜻하거나 시원한 캐슈넛 밀크 제조 (가루 1kg당 약 7L 제조 가능)\n• 스무디, 커피 및 다양한 음료에 블렌딩\n• 제과·제빵(빵, 케이크, 비스킷), 죽 및 각종 요리 재료로 활용';
      case 'de':
        return '• Für heiße oder kalte Cashewmilch (1 kg Pulver ergibt ca. 7 Liter)\n• In Smoothies, Kaffee und Spezialgetränke einrühren\n• Zum Backen von Brot, Kuchen, Keksen, Porridge und für herzhafte Speisen';
      case 'zh':
      case 'cn':
        return '• 调制冷热腰果植物奶（1公斤粉约可调制7升）\n• 融入冰沙、咖啡及各种风味饮品\n• 适用于烘焙面包、蛋糕、饼干、熬粥及各类烹饪料理';
      case 'ja':
      case 'jp':
        return '• 温かい・冷たいカシューミルクの調理（パウダー1kgで約7リットル）\n• スムージー、コーヒー、各種飲料へのブレンド\n• パン、ケーキ、ビスケット、お粥、各種料理への活用';
      case 'fr':
        return '• Préparation de lait de cajou chaud ou froid (1 kg donne environ 7 litres)\n• À mélanger dans smoothies, cafés et boissons végétales\n• Idéal pour la pâtisserie, pains, biscuits, porridge et cuisine';
      case 'vi':
        return '• Pha sữa hạt điều nóng hoặc lạnh (1 kg bột pha được khoảng 7 lít)\n• Trộn vào sinh tố, cà phê và các loại đồ uống\n• Dùng làm bánh mì, bánh ngọt, bánh quy, nấu cháo và chế biến món ăn';
      case 'th':
        return '• ทำนมเม็ดมะม่วงหิมพานต์ร้อนหรือเย็น (ผง 1 กก. ทำได้ประมาณ 7 ลิตร)\n• ผสมในสมูทตี้ กาแฟ และเครื่องดื่มต่างๆ\n• ใช้ทำขนมปัง เค้ก บิสกิต ข้าวต้ม และอาหารต่างๆ';
      case 'nl':
        return '• Bereid warme of koude cashewmelk (1 kg poeder levert ca. 7 liter op)\n• Meng door smoothies, koffie en speciale dranken\n• Te gebruiken voor brood, gebak, koekjes, pap en diverse gerechten';
      case 'en':
      default:
        return '• Make hot or cold cashew milk (1 kg powder yields approx. 7 liters)\n• Blend into smoothies, coffee, and specialty beverages\n• Use in baking bread, cakes, biscuits, porridge, and various culinary recipes';
    }
  }

  // If obsolete tea brewing was mistakenly passed to non-tea cashews (roasted, salted, pepper snacks)
  if (!isTea && (lower.includes('brew with 250ml') || (rawUsage.includes('២៥០') && rawUsage.includes('៨៥°C')) || lower.includes('brew with 250') || rawUsage.includes('ឆុងជាមួយទឹកក្តៅពុះ ៨៥°C'))) {
    switch (lang) {
      case 'de': return 'Verzehrfertiger Gourmet-Snack. Direkt genießen oder zu Getränken und Salaten servieren. Nach dem Öffnen gut verschließen.';
      case 'fr': return 'Collation gastronomique prête à consommer. À déguster directement ou avec des boissons. Bien refermer après ouverture.';
      case 'ko': return '즉시 섭취 가능한 프리미엄 건강 스낵. 바로 드시거나 음료 및 샐러드와 함께 즐기십시오. 개봉 후에는 바삭함을 유지하기 위해 밀봉 보관하십시오.';
      case 'zh': return '即食优质健康零食。可直接食用，或搭配饮品与沙拉享用。开封后请密封保存以保持酥脆。';
      case 'ja': return 'そのまま召し上がれるグルメスナック。直接またはお好みの飲み物とお楽しみください。開封後は密閉して保存してください。';
      case 'vi': return 'Món ăn nhẹ hảo hạng dùng ngay. Thưởng thức trực tiếp hoặc kèm đồ uống và salad.';
      case 'th': return 'ขนมขบเคี้ยวระดับพรีเมียมพร้อมรับประทาน รับประทานได้ทันทีหรือทานคู่กับเครื่องดื่ม';
      case 'nl': return 'Kant-en-klare gastronomische snack. Direct consumeren of serveren bij drankjes en salades.';
      case 'en':
      default: return 'Gourmet ready-to-eat healthy snack. Enjoy directly or serve with beverages and salads. Reseal tightly after opening to maintain natural crispness.';
    }
  }

  // 2. Ready to Eat / Snack directly (Whole Roasted Cashews, Pepper, Chili, Sweet)
  if (lower.includes('ready to eat') || rawUsage.includes('ទទួលទានផ្ទាល់') || rawUsage.includes('ញ៉ាំភ្លាម') || rawUsage.includes('ទទួលទានភ្លាម') || rawUsage.includes('អាហារសម្រន់') || rawUsage.includes('ស្រួយ')) {
    switch (lang) {
      case 'de': return 'Verzehrfertiger Gourmet-Snack. Direkt genießen oder zu Getränken und Salaten servieren. Nach dem Öffnen gut verschließen.';
      case 'fr': return 'Collation gastronomique prête à consommer. À déguster directement ou avec des boissons. Bien refermer après ouverture.';
      case 'ko': return '즉시 섭취 가능한 프리미엄 건강 스낵. 바로 드시거나 음료 및 샐러드와 함께 즐기십시오. 개봉 후에는 바삭함을 유지하기 위해 밀봉 보관하십시오.';
      case 'zh': return '即食优质健康零食。可直接食用，或搭配饮品与沙拉享用。开封后请密封保存以保持酥脆。';
      case 'ja': return 'そのまま召し上がれるグルメスナック。直接またはお好みの飲み物とお楽しみください。開封後は密閉して保存してください。';
      case 'vi': return 'Món ăn nhẹ hảo hạng dùng ngay. Thưởng thức trực tiếp hoặc kèm đồ uống và salad.';
      case 'th': return 'ขนมขบเคี้ยวระดับพรีเมียมพร้อมรับประทาน รับประทานได้ทันทีหรือทานคู่กับเครื่องดื่ม';
      case 'nl': return 'Kant-en-klare gastronomische snack. Direct consumeren of serveren bij drankjes en salades.';
      case 'en':
      default: return 'Gourmet ready-to-eat healthy snack. Enjoy directly or serve with beverages and salads. Reseal tightly after opening to maintain natural crispness.';
    }
  }

  // 3. Explicit Tea / Herbal Infusion Brew (ONLY for authentic tea/infusions)
  if (isTea && ((lower.includes('250ml') || rawUsage.includes('២៥០') || lower.includes('brew') || rawUsage.includes('ឆុង') || rawUsage.includes('ត្រាំ')))) {
    switch (lang) {
      case 'de': return 'Mit 250ml heißem Wasser (85°C - 95°C) für 3-5 Minuten aufgießen, vor dem Verzehr gut umrühren.';
      case 'fr': return 'Infuser avec 250ml d\'eau chaude (85°C - 95°C) pendant 3 à 5 minutes, bien mélanger avant de servir.';
      case 'ko': return '뜨거운 물(85°C - 95°C) 250ml를 붓고 3~5분간 우려낸 후 잘 저어 드십시오.';
      case 'zh': return '注入250毫升热水（85°C - 95°C）冲泡3至5分钟，搅拌均匀后饮用。';
      case 'ja': return '熱湯（85℃〜95℃）250mlを注ぎ、3〜5分蒸らしてからよくかき混ぜてお召し上がりください。';
      case 'en':
      default: return 'Brew with 250ml hot water (85°C - 95°C) for 3-5 minutes, stir well before consuming.';
    }
  }

  // 3. Smoothies / Flour / Porridge
  if (rawUsage.includes('ម្សៅ') || rawUsage.includes('ក្រឡុក') || rawUsage.includes('បបរ') || lower.includes('smoothie') || lower.includes('blend')) {
    switch (lang) {
      case 'de': return '2 Esslöffel in Smoothies, Frühstückshaferflocken, Backwaren oder warmes Wasser einrühren.';
      case 'fr': return 'Mélanger 2 cuillères à soupe dans des smoothies, flocons d\'avoine, pâtisseries ou eau tiède.';
      case 'ko': return '스무디, 아침 오트밀, 베이킹 또는 미온수에 2스푼을 섞어 드십시오.';
      case 'zh': return '将2汤匙加入冰沙、早餐麦片、烘焙食品或温水中调配饮用。';
      case 'ja': return 'スプーン2杯をスムージー、朝食のオートミール、お菓子作り、またはぬるま湯に混ぜてください。';
      case 'vi': return 'Trộn 2 thìa canh vào sinh tố, bột yến mạch ăn sáng, làm bánh hoặc nước ấm.';
      case 'th': return 'ผสม 2 ช้อนโต๊ะลงในสมูทตี้ ข้าวโอ๊ตยามเช้า ขนมอบ หรือน้ำอุ่น';
      case 'nl': return 'Meng 2 eetlepels door smoothies, ontbijthaver, gebak of warm water.';
      case 'en':
      default: return 'Blend 2 tablespoons into smoothies, morning porridge, baking recipes, or warm water.';
    }
  }

  // 4. Spread / Toast / Dip
  if (rawUsage.includes('លាប') || rawUsage.includes('នំបុ័ង') || rawUsage.includes('ជ្រលក់') || lower.includes('spread') || lower.includes('toast') || lower.includes('dip')) {
    switch (lang) {
      case 'de': return 'Auf Toast streichen, mit frischen Früchten dippen oder in Feinkostsaucen und Salate einrühren.';
      case 'fr': return 'Tartiner sur du pain grillé, tremper avec des fruits frais ou incorporer aux sauces et salades.';
      case 'ko': return '토스트에 바르거나 신선한 과일과 함께 디핑 소스로 즐기거나 샐러드에 곁들여 드십시오.';
      case 'zh': return '涂抹于吐司上，蘸新鲜水果，或调制成酱料搭配沙拉食用。';
      case 'ja': return 'トーストに塗ったり、フルーツのディップやドレッシングに混ぜてお召し上がりください。';
      case 'vi': return 'Phết lên bánh mì nướng, chấm với trái cây tươi hoặc trộn vào nước sốt và salad.';
      case 'th': return 'ทาบนขนมปังปิ้ง จิ้มผลไม้สด หรือผสมในน้ำสลัดและซอส';
      case 'nl': return 'Smeer op toast, dip met vers fruit of meng door sauzen en salades.';
      case 'en':
      default: return 'Spread over toast, dip with fresh fruit, or blend into gourmet sauces and salads.';
    }
  }

  // 5. Cook / Grill / Fry
  if (rawUsage.includes('ចម្អិន') || rawUsage.includes('អាំង') || rawUsage.includes('ចៀន') || lower.includes('cook') || lower.includes('grill') || lower.includes('fry')) {
    switch (lang) {
      case 'de': return 'Bei mittlerer Hitze 5-8 Minuten kochen, grillen oder anbraten, bis alles gar ist.';
      case 'fr': return 'Cuire, griller ou frire à feu moyen pendant 5 à 8 minutes jusqu\'à cuisson complète.';
      case 'ko': return '중불에서 5~8분간 완전히 익을 때까지 조리, 굽거나 튀겨 드십시오.';
      case 'zh': return '用中火烹饪、烧烤或煎炒 5-8 分钟，直至完全熟透。';
      case 'ja': return '中火で5〜8分間、火が通るまで加熱調理してください。';
      case 'vi': return 'Nấu, nướng hoặc chiên trên lửa vừa trong 5-8 phút cho đến khi chín đều.';
      case 'th': return 'ปรุงอาหาร ย่าง หรือทอดด้วยไฟปานกลาง 5-8 นาทีจนสุกทั่วถึง';
      case 'nl': return 'Bak, gril of kook op middelhoog vuur gedurende 5-8 minuten tot het gaar is.';
      case 'en':
      default: return 'Cook, grill, or fry over medium heat for 5-8 minutes until thoroughly cooked.';
    }
  }

  // 6. Rice cooking
  if (rawUsage.includes('អង្ករ') || rawUsage.includes('ដាំបាយ') || lower.includes('rice')) {
    switch (lang) {
      case 'de': return 'Reis 1-2 Mal spülen, mit Wasser im Verhältnis 1:1,2 bis 1:1,3 Reis zu Wasser kochen.';
      case 'fr': return 'Rincer le riz 1 à 2 fois, cuire avec de l\'eau selon un ratio de 1:1,2 à 1:1,3 riz pour eau.';
      case 'ko': return '쌀을 1~2회 씻은 후 쌀 1컵당 물 1.2~1.3컵 비율로 밥을 지으십시오.';
      case 'zh': return '将米淘洗1-2次，按米与水1:1.2至1:1.3比例煮熟。';
      case 'ja': return '米を1〜2回研ぎ、米1に対して水1.2〜1.3の割合で炊飯してください。';
      case 'vi': return 'Vo gạo 1-2 lần, nấu với tỷ lệ 1 bát gạo : 1.2 - 1.3 bát nước.';
      case 'th': return 'ซาวข้าว 1-2 ครั้ง หุงด้วยอัตราส่วน ข้าว 1 ส่วน ต่อน้ำ 1.2 ถึง 1.3 ส่วน';
      case 'nl': return 'Rijst 1-2 keer wassen, koken met een verhouding van 1:1,2 tot 1:1,3 rijst tot water.';
      case 'en':
      default: return 'Rinse rice 1-2 times, cook with water at a 1:1.2 to 1:1.3 rice-to-water ratio.';
    }
  }

  // If text is already mostly English or Latin
  const isLatin = /^[A-Za-z0-9\s.,!?:;%°\-()/'"]+$/.test(rawUsage.trim());
  if (isLatin) {
    return rawUsage.trim();
  }

  // Default clean text
  return cleanKhmerUsageOnly(rawUsage);
}

// -------------------------------------------------------------
// Supplier Strings Cleanser & Separator
// Strips supplier company names / raw supplier badges mistakenly placed into ingredients list
// -------------------------------------------------------------
export function hasSupplierStringsInIngredients(text: string): boolean {
  if (!text) return false;
  return /Cashew Nut Kernels|GRADE BB|WHOLE KERNELS|Angkor Sugar|REFINED SUGAR|GI Kampot Black Pepper|GI KAMPOT BLACK PEPPER|Ngov Heng|SEA SALT KAMPOT|MYRARTH|MIRARTH|TL AGRI|RINGACAM|BOH CO|KAMPONG SPEU SUGAR/i.test(text);
}

export function cleanseSupplierStringsFromIngredients(rawText: string): string {
  if (!rawText) return '';
  let cleaned = rawText;
  
  const supplierPatterns = [
    /Cashew Nut Kernels\s*\([^)]*\)/gi,
    /CASHEW NUT\s*\([^)]*\)/gi,
    /Angkor Sugar\s*\([^)]*\)/gi,
    /100%\s*REFINED SUGAR\s*\([^)]*\)/gi,
    /GI Kampot Black Pepper\s*\([^)]*\)/gi,
    /GI KAMPOT BLACK PEPPER\s*\([^)]*\)/gi,
    /Ngov Heng\s*\([^)]*\)/gi,
    /100%\s*SEA SALT KAMPOT\s*\([^)]*\)/gi,
    /MYRARTH AGRI TECH[^,]*/gi,
    /Mirarth Agri Tech[^,]*/gi,
    /TL AGRI FOOD[^,]*/gi,
    /RINGACAM ENTERPRISE[^,]*/gi,
    /E CHEI NGOV HENG[^,]*/gi,
    /KAMPONG SPEU SUGAR[^,]*/gi,
    /BOH CO\.,?\s*LTD[^,]*/gi,
  ];

  for (const pat of supplierPatterns) {
    cleaned = cleaned.replace(pat, '');
  }

  // Clean up dangling or multiple commas and spaces
  return cleaned
    .split(',')
    .map(s => s.trim())
    .filter(s => {
      if (!s) return false;
      const lower = s.toLowerCase();
      if (lower.includes('kernels') || lower.includes('grade bb') || lower.includes('whole kernels')) return false;
      if (lower.includes('refined sugar')) return false;
      if (lower.includes('sea salt kampot')) return false;
      if (lower.includes('chili powder (')) return false;
      return true;
    })
    .join(', ');
}

export interface OfficialSupplierOption {
  id: string;
  badgeTitle: string;
  supplierName: string;
  productName: string;
  province: string;
  icon: string;
  categoryKh: string;
}

export const DEFAULT_OFFICIAL_SUPPLIERS: OfficialSupplierOption[] = [
  {
    id: 'mirarth-ww180',
    badgeTitle: 'Mirarth Agri Tech Co., Ltd.',
    supplierName: 'Mirarth Agri Tech Co., Ltd.',
    productName: 'គ្រាប់ស្វាយចន្ទី',
    province: 'កំពង់ធំ (Kampong Thom)',
    icon: '🥜',
    categoryKh: 'គ្រាប់ស្វាយចន្ទី'
  },
  {
    id: 'angkor-sugar',
    badgeTitle: 'Angkor Sugar (ស្ករសចម្រាញ់សុទ្ធ)',
    supplierName: 'Angkor Sugar',
    productName: 'ស្ករសចម្រាញ់សុទ្ធ',
    province: 'កំពង់ស្ពឺ (Kampong Speu)',
    icon: '🍯',
    categoryKh: 'ស្ករសចម្រាញ់'
  },
  {
    id: 'boh-pepper',
    badgeTitle: 'BOH Co., Ltd. (ម្រេចខ្មៅកំពត GI)',
    supplierName: 'BOH Co., Ltd.',
    productName: 'ម្រេចខ្មៅកំពត GI',
    province: 'កំពត (Kampot)',
    icon: '🌿',
    categoryKh: 'ម្រេចខ្មៅកំពត GI'
  },
  {
    id: 'ngov-heng-salt',
    badgeTitle: 'Ngov Heng (អំបិលសមុទ្រកំពត)',
    supplierName: 'Ngov Heng',
    productName: 'អំបិលសមុទ្រកំពត',
    province: 'កំពត (Kampot)',
    icon: '🧂',
    categoryKh: 'អំបិលសមុទ្រកំពត'
  },
  {
    id: 'tl-agri-cashew',
    badgeTitle: 'TL Agri Food Import Export Co., Ltd. (គ្រាប់ស្វាយចន្ទី)',
    supplierName: 'TL Agri Food Import Export Co., Ltd.',
    productName: 'គ្រាប់ស្វាយចន្ទី',
    province: 'ភ្នំពេញ (Phnom Penh)',
    icon: '🥜',
    categoryKh: 'គ្រាប់ស្វាយចន្ទី'
  },
  {
    id: 'ringacam-chili',
    badgeTitle: 'Ringacam Enterprise (ម្សៅម្ទេស G.D.G)',
    supplierName: 'Ringacam Enterprise',
    productName: 'ម្សៅម្ទេស G.D.G',
    province: 'ភ្នំពេញ (Phnom Penh)',
    icon: '🌶️',
    categoryKh: 'ម្សៅម្ទេស'
  }
];

