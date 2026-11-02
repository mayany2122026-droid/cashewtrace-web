export interface StandardAddress {
  houseNumber: string;
  streetNumber: string;
  groupNumber: string;
  village: string;
  commune: string;
  district: string;
  province: string;
}

export const COMMON_KHMER_ADDRESS_PRESETS: { name: string; address: StandardAddress }[] = [
  {
    name: 'សហគ្រាសម៉ាយ៉ានី - កំពង់ធំ (Mayany Kampong Thom Factory)',
    address: {
      houseNumber: 'ផ្ទះលេខ ៤៨ (No. 48)',
      streetNumber: 'ផ្លូវជាតិលេខ ៦ (National Road 6)',
      groupNumber: 'ក្រុមទី ០៣ (Group 3)',
      village: 'ភូមិត្រពាំងឫស្សី (Trapeang Russei)',
      commune: 'ឃុំត្រពាំងឫស្សី (Trapeang Russei)',
      district: 'ស្រុកកំពង់ស្វាយ (Kampong Svay)',
      province: 'កំពង់ធំ (Kampong Thom)'
    }
  },
  {
    name: 'រោងចក្រស្វាយចន្ទី - ភ្នំពេញ (Phnom Penh Processing)',
    address: {
      houseNumber: 'អាគារ B22 (Bldg B22)',
      streetNumber: 'ផ្លូវវេងស្រេង (Veng Sreng Blvd)',
      groupNumber: 'ក្រុម ០៥ (Group 5)',
      village: 'ភូមិទ្រា (Trea Village)',
      commune: 'សង្កាត់ស្ទឹងមានជ័យ (Stung Meanchey)',
      district: 'ខណ្ឌមានជ័យ (Mean Chey)',
      province: 'រាជធានីភ្នំពេញ (Phnom Penh)'
    }
  },
  {
    name: 'ចម្ការ & រោងសិប្បកម្ម - កំពង់ស្ពឺ (Kampong Speu Artisan)',
    address: {
      houseNumber: 'ដីឡូតិ៍លេខ ១០៥ (Lot 105)',
      streetNumber: 'ផ្លូវជាតិលេខ ៤ (National Road 4)',
      groupNumber: 'ក្រុម ០២ (Group 2)',
      village: 'ភូមិព្រៃផ្តៅ (Prey Phdau)',
      commune: 'ឃុំត្រពាំងគង (Trapeang Kong)',
      district: 'ស្រុកសំរោងទង (Samraong Tong)',
      province: 'កំពង់ស្ពឺ (Kampong Speu)'
    }
  },
  {
    name: 'សិប្បកម្មម្រេចកំពត GI - កំពត (Kampot GI Pepper)',
    address: {
      houseNumber: 'ផ្ទះលេខ ១២ (No. 12)',
      streetNumber: 'ផ្លូវលេខ ៣៣ (Street 33)',
      groupNumber: 'ក្រុម ០១ (Group 1)',
      village: 'ភូមិកំពង់ត្រាច (Kampong Trach)',
      commune: 'ឃុំដំណាក់កន្ទួត (Damnak Kantuot)',
      district: 'ស្រុកកំពង់ត្រាច (Kampong Trach)',
      province: 'កំពត (Kampot)'
    }
  }
];

export interface IndividualIngredientItem {
  id: string;
  category: 'grain' | 'sugar' | 'spice' | 'salt_sauce' | 'oil_fat' | 'fruit_meat' | 'additive' | 'base' | 'sweet_salt' | 'seed_additive';
  categoryKh: string;
  nameKh: string;
  nameEn: string;
  defaultPercent: number;
  displayText: string;
  tag?: string;
}

export interface IngredientCategoryGroup {
  id: string;
  nameKh: string;
  nameEn: string;
  icon: string;
  placeholderKh: string;
  descriptionKh: string;
  items: IndividualIngredientItem[];
}

// 1. Comprehensive Market Catalog Categorized for Dropdown Selection
export const INGREDIENT_CATEGORY_GROUPS: IngredientCategoryGroup[] = [
  {
    id: 'grain',
    nameKh: 'គ្រាប់ធញ្ញជាតិ, គ្រាប់ & ម្សៅ',
    nameEn: 'Grains, Cereals, Nuts & Flours',
    icon: '🌾',
    placeholderKh: '-- ជ្រើសរើសគ្រាប់ធញ្ញជាតិ / គ្រាប់ (Select Grains & Nuts) --',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទី, អង្ករផ្កាម្លិះ, អង្ករដំណើប, អូត, គីន័រ, សណ្តែក, អាល់ម៉ុន...',
    items: [
      { id: 'cashew-kernel-w240', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា W240', nameEn: 'Cambodian Cashew Kernels W240', defaultPercent: 85, displayText: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា W240 (Cambodian Cashew Kernels W240)', tag: 'Premium Grade' },
      { id: 'cashew-kernel-w320', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា W320', nameEn: 'Cambodian Cashew Kernels W320', defaultPercent: 85, displayText: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា W320 (Cambodian Cashew Kernels W320)' },
      { id: 'cashew-kernel-w180', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា W180 (King Size)', nameEn: 'Cambodian Jumbo Cashews W180', defaultPercent: 90, displayText: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា W180 (Jumbo Cashew Kernels W180)', tag: 'King Size' },
      { id: 'cashew-broken', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ស្វាយចន្ទីបាក់ (WS/LP)', nameEn: 'Broken Cashew Kernels (WS/LP)', defaultPercent: 60, displayText: 'គ្រាប់ស្វាយចន្ទីបាក់ (Broken Cashews WS/LP)' },
      { id: 'cashew-flour', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'ម្សៅគ្រាប់ស្វាយចន្ទីម៉ដ្ឋសុទ្ធ', nameEn: 'Pure Cashew Nut Flour', defaultPercent: 100, displayText: 'ម្សៅគ្រាប់ស្វាយចន្ទីម៉ដ្ឋសុទ្ធ (Pure Cashew Nut Flour)', tag: 'Gluten-Free' },
      { id: 'jasmine-rice', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'អង្ករផ្កាម្លិះម្លិះអង្គរ', nameEn: 'Cambodian Jasmine Rice (Malys Angkor)', defaultPercent: 40, displayText: 'អង្ករផ្កាម្លិះម្លិះអង្គរ (Cambodian Jasmine Rice)', tag: 'World Best Rice' },
      { id: 'sticky-rice', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'អង្ករដំណើបខ្មែរ', nameEn: 'Cambodian Sticky Rice', defaultPercent: 30, displayText: 'អង្ករដំណើបខ្មែរ (Cambodian Sticky Rice)' },
      { id: 'brown-rice', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'អង្ករសំរូបធម្មជាតិ', nameEn: 'Natural Brown Rice', defaultPercent: 35, displayText: 'អង្ករសំរូបធម្មជាតិ (Natural Brown Rice)', tag: 'High Fiber' },
      { id: 'red-rice', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'អង្ករក្រហមសរីរាង្គ', nameEn: 'Organic Red Rice', defaultPercent: 30, displayText: 'អង្ករក្រហមសរីរាង្គ (Organic Red Rice)', tag: 'Organic' },
      { id: 'germinated-rice', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'អង្ករផ្កាពន្លក (GABA Rice)', nameEn: 'Germinated Parboiled GABA Rice', defaultPercent: 30, displayText: 'អង្ករផ្កាពន្លក GABA (Germinated Rice)', tag: 'GABA Rich' },
      { id: 'rolled-oats', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'ស្រូវសាលី / អូត (Rolled Oats)', nameEn: 'Rolled Oats / Oatmeal', defaultPercent: 25, displayText: 'ស្រូវសាលីអូត (Rolled Oats)', tag: 'Whole Grain' },
      { id: 'quinoa-seeds', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់គីន័រ ៣ពណ៌ (Quinoa)', nameEn: 'Tri-Color Quinoa Seeds', defaultPercent: 20, displayText: 'គ្រាប់គីន័រ ៣ពណ៌ (Tri-Color Quinoa Seeds)', tag: 'Superfood' },
      { id: 'sweet-corn', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ពោតផ្អែម / ម្សៅពោត', nameEn: 'Sweet Corn Grains / Cornmeal', defaultPercent: 20, displayText: 'គ្រាប់ពោតផ្អែម (Sweet Corn Grains)' },
      { id: 'soybeans', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់សណ្តែកសៀងសរីរាង្គ', nameEn: 'Organic Soybeans', defaultPercent: 25, displayText: 'គ្រាប់សណ្តែកសៀងសរីរាង្គ (Organic Soybeans)' },
      { id: 'peanuts', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់សណ្តែកដីលីង', nameEn: 'Roasted Peanuts', defaultPercent: 30, displayText: 'គ្រាប់សណ្តែកដីលីង (Roasted Peanuts)' },
      { id: 'mung-beans', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់សណ្តែកបាយ', nameEn: 'Mung Beans', defaultPercent: 20, displayText: 'គ្រាប់សណ្តែកបាយ (Mung Beans)' },
      { id: 'black-beans', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់សណ្តែកខ្មៅ', nameEn: 'Black Beans', defaultPercent: 20, displayText: 'គ្រាប់សណ្តែកខ្មៅ (Black Beans)' },
      { id: 'red-kidney-beans', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់សណ្តែកក្រហម', nameEn: 'Red Kidney Beans', defaultPercent: 20, displayText: 'គ្រាប់សណ្តែកក្រហម (Red Kidney Beans)' },
      { id: 'almonds', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់អាល់ម៉ុន (Almonds)', nameEn: 'Whole Almonds', defaultPercent: 25, displayText: 'គ្រាប់អាល់ម៉ុន (Whole Almonds)' },
      { id: 'walnuts', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់វាល់ណាត់ (Walnuts)', nameEn: 'Raw Walnuts', defaultPercent: 20, displayText: 'គ្រាប់វាល់ណាត់ (Raw Walnuts)', tag: 'Omega 3' },
      { id: 'macadamia', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ម៉ាកាដាមៀ (Macadamia)', nameEn: 'Macadamia Nuts', defaultPercent: 25, displayText: 'គ្រាប់ម៉ាកាដាមៀ (Macadamia Nuts)' },
      { id: 'pistachios', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ពីស្តាស៊ីអូ (Pistachios)', nameEn: 'Roasted Pistachios', defaultPercent: 25, displayText: 'គ្រាប់ពីស្តាស៊ីអូ (Roasted Pistachios)' },
      { id: 'sunflower-seeds', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ផ្កាឈូករ័ត្នបកសំបក', nameEn: 'Shelled Sunflower Seeds', defaultPercent: 15, displayText: 'គ្រាប់ផ្កាឈូករ័ត្ន (Sunflower Seeds)' },
      { id: 'pumpkin-seeds', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ល្ពៅសរីរាង្គ (Pepitas)', nameEn: 'Organic Pumpkin Seeds (Pepitas)', defaultPercent: 15, displayText: 'គ្រាប់ល្ពៅសរីរាង្គ (Organic Pumpkin Seeds)' },
      { id: 'chia-seeds', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ជី / គ្រាប់ឈា (Chia)', nameEn: 'Black Chia Seeds', defaultPercent: 8, displayText: 'គ្រាប់ជីសរីរាង្គ (Organic Chia Seeds)', tag: 'Superfood' },
      { id: 'sesame-white', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ល្ងសធម្មជាតិ', nameEn: 'Natural White Sesame Seeds', defaultPercent: 10, displayText: 'គ្រាប់ល្ងសធម្មជាតិ (White Sesame Seeds)' },
      { id: 'sesame-black', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ល្ងខ្មៅសរីរាង្គ', nameEn: 'Organic Black Sesame Seeds', defaultPercent: 10, displayText: 'គ្រាប់ល្ងខ្មៅសរីរាង្គ (Black Sesame Seeds)' },
      { id: 'lotus-seeds', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'គ្រាប់ឈូកស្ងួតខ្មែរ', nameEn: 'Dried Lotus Seeds', defaultPercent: 18, displayText: 'គ្រាប់ឈូកស្ងួតខ្មែរ (Dried Lotus Seeds)' },
      { id: 'tapioca-flour', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'ម្សៅដំឡូងមីខ្មែរ', nameEn: 'Cambodian Tapioca Starch', defaultPercent: 12, displayText: 'ម្សៅដំឡូងមីខ្មែរ (Tapioca Starch)' },
      { id: 'banana-flour', category: 'grain', categoryKh: 'គ្រាប់ធញ្ញជាតិ & គ្រាប់', nameKh: 'ម្សៅចេកណាំវ៉ាធន់រំលាយ', nameEn: 'Green Banana Resistant Starch Flour', defaultPercent: 90, displayText: 'ម្សៅចេកណាំវ៉ាធន់រំលាយ (Banana Flour)', tag: 'Prebiotic' }
    ]
  },
  {
    id: 'sugar',
    nameKh: 'ជាតិផ្អែម & ស្ករគ្រប់ប្រភេទ',
    nameEn: 'Sugars, Syrups & Sweeteners',
    icon: '🍯',
    placeholderKh: '-- ជ្រើសរើសប្រភេទស្ករ / ជាតិផ្អែម (Select Sugars, Syrups & Sweeteners) --',
    descriptionKh: 'ស្ករសគ្រាប់, ស្ករសម្សៅ (Icing), ស្ករស៊ីរ៉ូខាប់, ស្ករត្នោត GI, ស្ករអំពៅ, ទឹកឃ្មុំ...',
    items: [
      // 1. White Sugar / Refined Granulated White Sugar (1%, 2%, 3%, 4%, 5%, 8%)
      { id: 'white-sugar-1', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករសគ្រាប់ ១% (White Sugar)', nameEn: 'Refined Granulated White Sugar 1%', defaultPercent: 1.0, displayText: 'ស្ករសគ្រាប់ ១% (Granulated White Sugar 1%)', tag: 'White Sugar 1%' },
      { id: 'white-sugar-2', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករសគ្រាប់ ២% (White Sugar)', nameEn: 'Refined Granulated White Sugar 2%', defaultPercent: 2.0, displayText: 'ស្ករសគ្រាប់ ២% (Granulated White Sugar 2%)', tag: 'White Sugar 2%' },
      { id: 'white-sugar-3', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករសគ្រាប់ ៣% (White Sugar)', nameEn: 'Refined Granulated White Sugar 3%', defaultPercent: 3.0, displayText: 'ស្ករសគ្រាប់ ៣% (Granulated White Sugar 3%)', tag: 'White Sugar 3%' },
      { id: 'white-sugar-4', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករសគ្រាប់ ៤% (White Sugar)', nameEn: 'Refined Granulated White Sugar 4%', defaultPercent: 4.0, displayText: 'ស្ករសគ្រាប់ ៤% (Granulated White Sugar 4%)', tag: 'White Sugar 4%' },
      { id: 'white-sugar-5', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករសគ្រាប់ ៥% (White Sugar)', nameEn: 'Refined Granulated White Sugar 5%', defaultPercent: 5.0, displayText: 'ស្ករសគ្រាប់ ៥% (Granulated White Sugar 5%)', tag: 'White Sugar 5%' },
      { id: 'white-sugar-std', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករសធម្មតា / ស្ករគ្រាប់សុទ្ធ', nameEn: 'Refined White Granulated Sugar', defaultPercent: 5.0, displayText: 'ស្ករសធម្មតា (Refined White Sugar)' },

      // 2. Powdered Sugar / Icing Sugar / Confectioner's Sugar (1% - 5%)
      { id: 'powdered-sugar-1', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ម្សៅស្ករសម៉ត់ ១% (Icing/Powdered Sugar)', nameEn: 'Powdered Icing Sugar 1%', defaultPercent: 1.0, displayText: 'ម្សៅស្ករសម៉ត់ ១% (Powdered Sugar 1%)', tag: 'Icing Sugar 1%' },
      { id: 'powdered-sugar-2', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ម្សៅស្ករសម៉ត់ ២% (Icing/Powdered Sugar)', nameEn: 'Powdered Icing Sugar 2%', defaultPercent: 2.0, displayText: 'ម្សៅស្ករសម៉ត់ ២% (Powdered Sugar 2%)', tag: 'Icing Sugar 2%' },
      { id: 'powdered-sugar-3', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ម្សៅស្ករសម៉ត់ ៣% (Icing/Powdered Sugar)', nameEn: 'Powdered Icing Sugar 3%', defaultPercent: 3.0, displayText: 'ម្សៅស្ករសម៉ត់ ៣% (Powdered Sugar 3%)', tag: 'Icing Sugar 3%' },
      { id: 'powdered-sugar-5', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ម្សៅស្ករសម៉ត់ ៥% (Icing/Powdered Sugar)', nameEn: 'Powdered Icing Sugar 5%', defaultPercent: 5.0, displayText: 'ម្សៅស្ករសម៉ត់ ៥% (Powdered Sugar 5%)', tag: 'Icing Sugar 5%' },
      { id: 'powdered-sugar-std', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ម្សៅស្ករសម៉ត់អាយស៊ីង (Icing Sugar)', nameEn: 'Confectioners Powdered Icing Sugar', defaultPercent: 8.0, displayText: 'ម្សៅស្ករសម៉ត់ (Icing Powdered Sugar)', tag: 'Baking & Coating' },

      // 3. Condensed Sugar / Sugar Syrup / Liquid Sweetener / Fructose Syrup (Lucky Supermarket Style)
      { id: 'condensed-sugar-syrup-2', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករស៊ីរ៉ូខាប់ ២% (Condensed Sugar Syrup)', nameEn: 'Condensed Sugar Syrup 2%', defaultPercent: 2.0, displayText: 'ស្ករស៊ីរ៉ូខាប់ ២% (Condensed Sugar Syrup 2%)', tag: 'Syrup 2%' },
      { id: 'condensed-sugar-syrup-5', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករស៊ីរ៉ូខាប់ ៥% (Condensed Sugar Syrup)', nameEn: 'Condensed Sugar Syrup 5%', defaultPercent: 5.0, displayText: 'ស្ករស៊ីរ៉ូខាប់ ៥% (Condensed Sugar Syrup 5%)', tag: 'Syrup 5%' },
      { id: 'condensed-sugar-syrup', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករស៊ីរ៉ូរាវខាប់ (Condensed Sugar / Cane Syrup)', nameEn: 'Condensed Liquid Cane Sugar Syrup', defaultPercent: 6.0, displayText: 'ស្ករស៊ីរ៉ូខាប់ (Condensed Sugar Syrup)', tag: 'Lucky / Retail Style' },
      { id: 'liquid-fructose-syrup', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ទឹកស្ករស៊ីរ៉ូហ្វ្រុកតូសរាវ (High Fructose Syrup)', nameEn: 'Liquid High Fructose Corn/Cane Syrup', defaultPercent: 5.0, displayText: 'ទឹកស្ករស៊ីរ៉ូរាវ (Liquid Fructose Syrup)' },
      { id: 'sweetened-condensed-creamer', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ទឹកដោះគោខាប់ផ្អែម (Sweetened Condensed Creamer)', nameEn: 'Sweetened Condensed Creamer', defaultPercent: 8.0, displayText: 'ទឹកដោះគោខាប់ផ្អែម (Sweetened Condensed Milk/Creamer)' },

      // 4. GI Kampong Speu Palm Sugar (1% - 12%)
      { id: 'palm-sugar-gi-1', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករត្នោតកំពង់ស្ពឺ GI ១%', nameEn: 'GI Kampong Speu Palm Sugar 1%', defaultPercent: 1.0, displayText: 'ស្ករត្នោតកំពង់ស្ពឺ GI ១% (GI Kampong Speu Palm Sugar 1%)', tag: 'GI 1%' },
      { id: 'palm-sugar-gi-2', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករត្នោតកំពង់ស្ពឺ GI ២%', nameEn: 'GI Kampong Speu Palm Sugar 2%', defaultPercent: 2.0, displayText: 'ស្ករត្នោតកំពង់ស្ពឺ GI ២% (GI Kampong Speu Palm Sugar 2%)', tag: 'GI 2%' },
      { id: 'palm-sugar-gi-3', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករត្នោតកំពង់ស្ពឺ GI ៣%', nameEn: 'GI Kampong Speu Palm Sugar 3%', defaultPercent: 3.0, displayText: 'ស្ករត្នោតកំពង់ស្ពឺ GI ៣% (GI Kampong Speu Palm Sugar 3%)', tag: 'GI 3%' },
      { id: 'palm-sugar-gi-4', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករត្នោតកំពង់ស្ពឺ GI ៤%', nameEn: 'GI Kampong Speu Palm Sugar 4%', defaultPercent: 4.0, displayText: 'ស្ករត្នោតកំពង់ស្ពឺ GI ៤% (GI Kampong Speu Palm Sugar 4%)', tag: 'GI 4%' },
      { id: 'palm-sugar-gi-5', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករត្នោតកំពង់ស្ពឺ GI ៥%', nameEn: 'GI Kampong Speu Palm Sugar 5%', defaultPercent: 5.0, displayText: 'ស្ករត្នោតកំពង់ស្ពឺ GI ៥% (GI Kampong Speu Palm Sugar 5%)', tag: 'GI 5%' },
      { id: 'palm-sugar-gi-granules', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករត្នោតកំពង់ស្ពឺ GI គ្រាប់ម្សៅ ១២%', nameEn: 'GI Kampong Speu Granulated Palm Sugar 12%', defaultPercent: 12, displayText: 'ស្ករត្នោតកំពង់ស្ពឺ GI ១២% (GI Kampong Speu Palm Sugar 12%)', tag: 'GI Protected' },
      { id: 'palm-sugar-paste', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករត្នោតផែន/ពាងប្រពៃណី', nameEn: 'Traditional Palm Sugar Paste', defaultPercent: 15, displayText: 'ស្ករត្នោតពាងប្រពៃណី (Traditional Palm Sugar Paste)' },
      { id: 'palm-nectar-liquid', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ទឹកស្ករត្នោតរាវធម្មជាតិ', nameEn: 'Liquid Palm Blossom Nectar', defaultPercent: 8, displayText: 'ទឹកស្ករត្នោតរាវ (Liquid Palm Nectar)', tag: 'Low GI' },

      // 5. Cane Sugars (Raw & Brown)
      { id: 'cane-sugar-raw', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករអំពៅធម្មជាតិមិនទាន់ចម្រាញ់', nameEn: 'Raw Unrefined Cane Sugar', defaultPercent: 8, displayText: 'ស្ករអំពៅធម្មជាតិ (Raw Brown Cane Sugar)' },
      { id: 'cane-sugar-refined', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករអំពៅសចម្រាញ់', nameEn: 'Refined White Cane Sugar', defaultPercent: 6, displayText: 'ស្ករអំពៅសចម្រាញ់ (Refined White Sugar)' },
      { id: 'brown-sugar', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករត្នោត/អំពៅក្រហម (Brown Sugar)', nameEn: 'Soft Light Brown Sugar', defaultPercent: 5.0, displayText: 'ស្ករក្រហម (Brown Sugar)' },

      // 6. Natural & Alternative Sweeteners (Honey, Stevia, Monk Fruit, Coconut Sugar, Agave, etc.)
      { id: 'wild-honey', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ទឹកឃ្មុំព្រៃធម្មជាតិសុទ្ធ', nameEn: 'Pure Natural Wild Forest Honey', defaultPercent: 4.0, displayText: 'ទឹកឃ្មុំព្រៃធម្មជាតិសុទ្ធ (Pure Wild Forest Honey)', tag: '100% Wild' },
      { id: 'coconut-sugar', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករផ្កាដូងសរីរាង្គ', nameEn: 'Organic Coconut Blossom Sugar', defaultPercent: 10, displayText: 'ស្ករផ្កាដូងសរីរាង្គ (Organic Coconut Sugar)', tag: 'Low GI' },
      { id: 'stevia-extract', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករស្មៅផ្អែមស្ទីវីយ៉ា', nameEn: 'Stevia Leaf Extract (Reb-A 98%)', defaultPercent: 0.1, displayText: 'ស្ករស្មៅផ្អែមស្ទីវីយ៉ា (Stevia Extract Reb-A)', tag: '0 Calorie / Keto' },
      { id: 'monk-fruit', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករផ្លែឡូហានគ័រ', nameEn: 'Monk Fruit Extract (Luo Han Guo)', defaultPercent: 0.2, displayText: 'ស្ករផ្លែឡូហានគ័រ (Monk Fruit Sweetener)', tag: '0 Calorie / Natural' },
      { id: 'erythritol', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករអ៊ីរីទ្រីថុល គីតូ', nameEn: 'Erythritol Natural Polyol Sweetener', defaultPercent: 5.0, displayText: 'ស្ករអ៊ីរីទ្រីថុល (Erythritol Keto Sweetener)', tag: 'Keto Friendly' },
      { id: 'maple-syrup', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករស៊ីរ៉ូដើមម៉េផលសុទ្ធ', nameEn: 'Pure Maple Syrup Grade A', defaultPercent: 5.0, displayText: 'ស្ករស៊ីរ៉ូដើមម៉េផល (Pure Maple Syrup)' },
      { id: 'agave-nectar', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករស៊ីរ៉ូផ្កាអាហ្គាវ៉ាសរីរាង្គ', nameEn: 'Organic Blue Agave Nectar', defaultPercent: 5.0, displayText: 'ស្ករស៊ីរ៉ូផ្កាអាហ្គាវ៉ា (Organic Agave Nectar)' },
      { id: 'maltose-syrup', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករម៉ាល់តូស / ស្ករស៊ីរ៉ូពោត', nameEn: 'Maltose / Glucose Syrup', defaultPercent: 6.0, displayText: 'ស្ករម៉ាល់តូស (Maltose Glucose Syrup)' },
      { id: 'molasses', category: 'sugar', categoryKh: 'ជាតិផ្អែម & ស្ករ', nameKh: 'ស្ករអំពៅរាវខាប់', nameEn: 'Organic Blackstrap Molasses', defaultPercent: 3.0, displayText: 'ស្ករអំពៅរាវខាប់ (Blackstrap Molasses)', tag: 'Mineral Rich' }
    ]
  },
  {
    id: 'spice',
    nameKh: 'គ្រឿងទេស, ម្សៅស្រោប & ឱសថ',
    nameEn: 'Spices, Seasoning Coatings & Herbs',
    icon: '🌶️',
    placeholderKh: '-- ជ្រើសរើសគ្រឿងទេស / ម្សៅស្រោប (Select Spices & Coatings) --',
    descriptionKh: 'ម្រេចកំពត GI (1-5%), ម្សៅស្រោបម្ទេស (1-5%), ម្សៅស្រោបស្ករ (1-5%), ឈីស, តុងយុាំ...',
    items: [
      // 1. Black Pepper Kampot GI (Granular 1%, 2%, 2.5%, 3%, 4%, 5%)
      { id: 'kampot-pepper-black-1', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចខ្មៅកំពត GI ១%', nameEn: 'GI Kampot Black Pepper 1%', defaultPercent: 1.0, displayText: 'ម្រេចខ្មៅកំពត GI ១% (GI Kampot Black Pepper 1%)', tag: 'GI 1%' },
      { id: 'kampot-pepper-black-2', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចខ្មៅកំពត GI ២%', nameEn: 'GI Kampot Black Pepper 2%', defaultPercent: 2.0, displayText: 'ម្រេចខ្មៅកំពត GI ២% (GI Kampot Black Pepper 2%)', tag: 'GI 2%' },
      { id: 'kampot-pepper-black', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចខ្មៅកំពត GI ២.៥%', nameEn: 'GI Kampot Black Pepper 2.5%', defaultPercent: 2.5, displayText: 'ម្រេចខ្មៅកំពត GI ២.៥% (GI Kampot Black Pepper 2.5%)', tag: 'GI Certified' },
      { id: 'kampot-pepper-black-3', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចខ្មៅកំពត GI ៣%', nameEn: 'GI Kampot Black Pepper 3%', defaultPercent: 3.0, displayText: 'ម្រេចខ្មៅកំពត GI ៣% (GI Kampot Black Pepper 3%)', tag: 'GI 3%' },
      { id: 'kampot-pepper-black-4', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចខ្មៅកំពត GI ៤%', nameEn: 'GI Kampot Black Pepper 4%', defaultPercent: 4.0, displayText: 'ម្រេចខ្មៅកំពត GI ៤% (GI Kampot Black Pepper 4%)', tag: 'GI 4%' },
      { id: 'kampot-pepper-black-5', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចខ្មៅកំពត GI ៥%', nameEn: 'GI Kampot Black Pepper 5%', defaultPercent: 5.0, displayText: 'ម្រេចខ្មៅកំពត GI ៥% (GI Kampot Black Pepper 5%)', tag: 'GI 5%' },

      // 2. Coated Pepper / ម្សៅស្រោបម្រេចកំពត GI (1%, 2%, 3%, 4%, 5%, 12%)
      { id: 'coating-pepper-gi-1', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្រេចកំពត GI ១%', nameEn: 'GI Kampot Pepper Coating 1%', defaultPercent: 1.0, displayText: 'ម្សៅស្រោបម្រេចកំពត GI ១% (GI Kampot Pepper Coating 1%)', tag: 'Coated Pepper 1%' },
      { id: 'coating-pepper-gi-2', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្រេចកំពត GI ២%', nameEn: 'GI Kampot Pepper Coating 2%', defaultPercent: 2.0, displayText: 'ម្សៅស្រោបម្រេចកំពត GI ២% (GI Kampot Pepper Coating 2%)', tag: 'Coated Pepper 2%' },
      { id: 'coating-pepper-gi-3', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្រេចកំពត GI ៣%', nameEn: 'GI Kampot Pepper Coating 3%', defaultPercent: 3.0, displayText: 'ម្សៅស្រោបម្រេចកំពត GI ៣% (GI Kampot Pepper Coating 3%)', tag: 'Coated Pepper 3%' },
      { id: 'coating-pepper-gi-4', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្រេចកំពត GI ៤%', nameEn: 'GI Kampot Pepper Coating 4%', defaultPercent: 4.0, displayText: 'ម្សៅស្រោបម្រេចកំពត GI ៤% (GI Kampot Pepper Coating 4%)', tag: 'Coated Pepper 4%' },
      { id: 'coating-pepper-gi-5', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្រេចកំពត GI ៥%', nameEn: 'GI Kampot Pepper Coating 5%', defaultPercent: 5.0, displayText: 'ម្សៅស្រោបម្រេចកំពត GI ៥% (GI Kampot Pepper Coating 5%)', tag: 'Coated Pepper 5%' },
      { id: 'coating-pepper-gi', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្រេចកំពត GI ១២%', nameEn: 'GI Kampot Pepper Gourmet Coating 12%', defaultPercent: 12, displayText: 'ម្សៅស្រោបម្រេចកំពត GI ១២% (GI Kampot Pepper Coating 12%)', tag: 'Signature' },

      // 3. Coated Chili (Light Chili 1-2%, Medium Chili 3%, Hot Chili 4-5%)
      { id: 'coating-chili-1', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្ទេស ១% (កម្រិតស្រាល)', nameEn: 'Coated Light Chili 1%', defaultPercent: 1.0, displayText: 'ម្សៅស្រោបម្ទេស ១% (Coated Light Chili 1%)', tag: 'Light Chili 1%' },
      { id: 'coating-chili-2', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្ទេស ២% (កម្រិតស្រាល)', nameEn: 'Coated Light Chili 2%', defaultPercent: 2.0, displayText: 'ម្សៅស្រោបម្ទេស ២% (Coated Light Chili 2%)', tag: 'Light Chili 2%' },
      { id: 'coating-chili-3', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្ទេស ៣% (កម្រិតមធ្យម)', nameEn: 'Coated Medium Chili 3%', defaultPercent: 3.0, displayText: 'ម្សៅស្រោបម្ទេស ៣% (Coated Medium Chili 3%)', tag: 'Medium Chili 3%' },
      { id: 'coating-chili-4', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្ទេស ៤% (កម្រិតហិរ)', nameEn: 'Coated Hot Chili 4%', defaultPercent: 4.0, displayText: 'ម្សៅស្រោបម្ទេស ៤% (Coated Hot Chili 4%)', tag: 'Hot Chili 4%' },
      { id: 'coating-chili-5', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្ទេស ៥% (កម្រិតហិរខ្លាំង)', nameEn: 'Coated Hot Chili 5%', defaultPercent: 5.0, displayText: 'ម្សៅស្រោបម្ទេស ៥% (Coated Hot Chili 5%)', tag: 'Hot Chili 5%' },

      // 4. Coated Sugar / ម្សៅស្រោបស្ករត្នោត (1%, 2%, 3%, 4%, 5%, 16%)
      { id: 'coating-sugar-1', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបស្ករត្នោត ១%', nameEn: 'Coated Palm Sugar 1%', defaultPercent: 1.0, displayText: 'ម្សៅស្រោបស្ករត្នោត ១% (Coated Palm Sugar 1%)', tag: 'Coated Sugar 1%' },
      { id: 'coating-sugar-2', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបស្ករត្នោត ២%', nameEn: 'Coated Palm Sugar 2%', defaultPercent: 2.0, displayText: 'ម្សៅស្រោបស្ករត្នោត ២% (Coated Palm Sugar 2%)', tag: 'Coated Sugar 2%' },
      { id: 'coating-sugar-3', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបស្ករត្នោត ៣%', nameEn: 'Coated Palm Sugar 3%', defaultPercent: 3.0, displayText: 'ម្សៅស្រោបស្ករត្នោត ៣% (Coated Palm Sugar 3%)', tag: 'Coated Sugar 3%' },
      { id: 'coating-sugar-4', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបស្ករត្នោត ៤%', nameEn: 'Coated Palm Sugar 4%', defaultPercent: 4.0, displayText: 'ម្សៅស្រោបស្ករត្នោត ៤% (Coated Palm Sugar 4%)', tag: 'Coated Sugar 4%' },
      { id: 'coating-sugar-5', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបស្ករត្នោត ៥%', nameEn: 'Coated Palm Sugar 5%', defaultPercent: 5.0, displayText: 'ម្សៅស្រោបស្ករត្នោត ៥% (Coated Palm Sugar 5%)', tag: 'Coated Sugar 5%' },
      { id: 'coating-sugar-16', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបស្ករត្នោតកំពង់ស្ពឺ GI ១៦%', nameEn: 'GI Palm Sugar Kettle Glaze 16%', defaultPercent: 16, displayText: 'ម្សៅស្រោបស្ករត្នោតកំពង់ស្ពឺ GI ១៦% (GI Palm Sugar Glaze 16%)', tag: 'GI Glaze 16%' },

      // Other Pepper Varieties
      { id: 'kampot-pepper-white', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចសកំពត GI', nameEn: 'GI Kampot White Pepper', defaultPercent: 2.0, displayText: 'ម្រេចសកំពត GI (GI Kampot White Pepper)', tag: 'GI Certified' },
      { id: 'kampot-pepper-red', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចក្រហមកំពត GI', nameEn: 'GI Kampot Red Pepper', defaultPercent: 2.5, displayText: 'ម្រេចក្រហមកំពត GI (GI Kampot Red Pepper)', tag: 'GI Certified' },
      { id: 'kampot-pepper-green', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្រេចខ្ចីត្រាំទឹកអំបិល', nameEn: 'Brined Fresh Green Kampot Pepper', defaultPercent: 3.0, displayText: 'ម្រេចខ្ចីកំពតត្រាំទឹកអំបិល (Brined Green Pepper)' },
      
      // Other Coatings & Spices
      { id: 'coating-chili-garlic', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបម្ទេស & ខ្ទឹមសបំពង', nameEn: 'Crispy Spicy Chili & Garlic Coating', defaultPercent: 13, displayText: 'ម្សៅស្រោបម្ទេស និងខ្ទឹមស (Spicy Chili & Garlic Coating)' },
      { id: 'coating-cheddar-cheese', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបរសជាតិឈីស (Cheddar Cheese)', nameEn: 'Cheddar Cheese Seasoning Coating', defaultPercent: 10, displayText: 'ម្សៅស្រោបរសជាតិឈីស (Cheddar Cheese Seasoning)' },
      { id: 'coating-tom-yum', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបរសជាតិតុងយុាំហិរជូរអែម', nameEn: 'Tom Yum Zesty Herb Seasoning', defaultPercent: 10, displayText: 'ម្សៅស្រោបរសជាតិតុងយុាំ (Tom Yum Herb Seasoning)' },
      { id: 'coating-bbq', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្រោបរសជាតិសាច់អាំង BBQ', nameEn: 'Smoky BBQ Spice Seasoning', defaultPercent: 9.0, displayText: 'ម្សៅស្រោបរសជាតិ BBQ (Smoky BBQ Seasoning)' },
      { id: 'chili-fresh-bird', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្ទេសអាចម៍សត្វ / ម្ទេសដៃនាងស្រស់', nameEn: 'Fresh Cambodian Bird Chili', defaultPercent: 2.5, displayText: 'ម្ទេសហិរធម្មជាតិ (Fresh Bird Chili)' },
      { id: 'chili-paprika-powder', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅម្ទេសក្រហមហិរ / ផាព្រីកា', nameEn: 'Chili Flakes / Paprika Powder', defaultPercent: 1.5, displayText: 'ម្សៅម្ទេសក្រហម (Chili Powder / Paprika)' },
      { id: 'crispy-garlic', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ខ្ទឹមសបំពងស្រួយ', nameEn: 'Crispy Fried Garlic', defaultPercent: 2.0, displayText: 'ខ្ទឹមសបំពងស្រួយ (Crispy Fried Garlic)' },
      { id: 'fresh-garlic-shallots', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ខ្ទឹមស & ខ្ទឹមក្រហមស្រស់', nameEn: 'Fresh Garlic & Shallots', defaultPercent: 3.0, displayText: 'ខ្ទឹមស និងខ្ទឹមក្រហម (Garlic & Shallots)' },
      { id: 'kroeung-lemongrass', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'គ្រឿងស្លឹកគ្រៃរមៀតខ្មែរ', nameEn: 'Traditional Khmer Kroeung Lemongrass Paste', defaultPercent: 4.0, displayText: 'គ្រឿងស្លឹកគ្រៃរមៀត (Khmer Kroeung Lemongrass Paste)' },
      { id: 'fresh-ginger', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ខ្ញីស្រស់ & ម្សៅខ្ញី', nameEn: 'Fresh Ginger / Ginger Powder', defaultPercent: 1.5, displayText: 'ខ្ញីស្រស់ (Fresh Ginger)' },
      { id: 'kaffir-lime-leaves', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ស្លឹកក្រូចសើចហាលស្ងួត', nameEn: 'Dried Kaffir Lime Leaves', defaultPercent: 0.5, displayText: 'ស្លឹកក្រូចសើច (Kaffir Lime Leaves)' },
      { id: 'star-anise-clove', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ផ្កាចន្ទន៍ & គ្រាប់ផ្កាក្លាំពូ', nameEn: 'Star Anise & Cloves', defaultPercent: 0.5, displayText: 'ផ្កាចន្ទន៍ និងផ្កាក្លាំពូ (Star Anise & Cloves)' },
      { id: 'cinnamon-powder', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅឈើអែម / ក្លិនឈុន', nameEn: 'Cinnamon Powder (Cassia)', defaultPercent: 0.8, displayText: 'ម្សៅឈើអែម (Cinnamon Powder)' },
      { id: 'khmer-curry-powder', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅការីខ្មែរប្រពៃណី', nameEn: 'Traditional Khmer Curry Spice Blend', defaultPercent: 2.0, displayText: 'ម្សៅការីខ្មែរប្រពៃណី (Khmer Curry Spice Blend)' },
      { id: 'bouillon-powder', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស៊ុបខ្នរ / ម្សៅផ្សំរសជាតិធម្មជាតិ', nameEn: 'Natural Seasoning Bouillon Powder', defaultPercent: 1.0, displayText: 'ម្សៅស៊ុបធម្មជាតិ (Natural Seasoning Powder)' },
      { id: 'pandan-leaf-powder', category: 'spice', categoryKh: 'គ្រឿងទេស & ម្សៅស្រោប', nameKh: 'ម្សៅស្លឹកតយធម្មជាតិ', nameEn: 'Natural Pandan Leaf Powder', defaultPercent: 1.5, displayText: 'ម្សៅស្លឹកតយធម្មជាតិ (Natural Pandan Leaf Powder)', tag: 'Natural Flavor' }
    ]
  },
  {
    id: 'salt_sauce',
    nameKh: 'អំបិល, ទឹកត្រី, ទឹកស៊ីអ៊ីវ & គ្រឿងប្រៃ',
    nameEn: 'Salts, Sauces & Fermented Condiments',
    icon: '🧂',
    placeholderKh: '-- ជ្រើសរើសអំបិល / ទឹកត្រី / ទឹកស៊ីអ៊ីវ (Select Salts & Sauces) --',
    descriptionKh: 'ផ្កាអំបិលកំពត GI, អំបិលសមុទ្រ, ទឹកត្រីកោះកុង, ទឹកស៊ីអ៊ីវ, ប្រហុក...',
    items: [
      { id: 'kampot-fleur-de-sel', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'ផ្កាអំបិលកំពត GI (Fleur de Sel)', nameEn: 'GI Kampot Fleur de Sel (Flower of Salt)', defaultPercent: 1.5, displayText: 'ផ្កាអំបិលកំពត GI (GI Kampot Fleur de Sel)', tag: 'GI Protected' },
      { id: 'kampot-sea-salt', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'អំបិលសមុទ្រកំពតធម្មជាតិ', nameEn: 'Kampot Natural Coarse Sea Salt', defaultPercent: 1.5, displayText: 'អំបិលសមុទ្រកំពត (Kampot Natural Sea Salt)' },
      { id: 'iodized-salt', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'អំបិលអ៊ីយ៉ូតកម្ពុជា', nameEn: 'Cambodian Iodized Table Salt', defaultPercent: 1.0, displayText: 'អំបិលអ៊ីយ៉ូត (Iodized Salt)' },
      { id: 'himalayan-pink-salt', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'អំបិលផ្កាឈូកហិម៉ាឡៃយ៉ា (Pink Salt)', nameEn: 'Natural Pink Himalayan Rock Salt', defaultPercent: 1.5, displayText: 'អំបិលផ្កាឈូកហិម៉ាឡៃយ៉ា (Pink Himalayan Salt)' },
      { id: 'fish-sauce-kohkong', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'ទឹកត្រីកោះកុងប្រពៃណីសុទ្ធ', nameEn: 'Pure Koh Kong Artisan Fish Sauce', defaultPercent: 2.0, displayText: 'ទឹកត្រីកោះកុងប្រពៃណី (Koh Kong Fish Sauce)' },
      { id: 'soy-sauce-naturally-brewed', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'ទឹកស៊ីអ៊ីវសណ្តែកសៀងផ្អាប់ធម្មជាតិ', nameEn: 'Naturally Fermented Soy Sauce', defaultPercent: 1.5, displayText: 'ទឹកស៊ីអ៊ីវសណ្តែកសៀង (Fermented Soy Sauce)' },
      { id: 'dark-soy-sauce', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'ទឹកស៊ីអ៊ីវខាប់ខ្មៅ', nameEn: 'Dark Sweet Soy Sauce', defaultPercent: 1.0, displayText: 'ទឹកស៊ីអ៊ីវខាប់ (Dark Sweet Soy Sauce)' },
      { id: 'oyster-sauce', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'ទឹកប្រេងខ្យងពិសេស', nameEn: 'Premium Oyster Sauce', defaultPercent: 2.0, displayText: 'ទឹកប្រេងខ្យង (Premium Oyster Sauce)' },
      { id: 'fermented-prahok', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'ប្រហុកសាច់ត្រីរ៉ស់បឹងទន្លេសាប', nameEn: 'Tonle Sap Fermented Snakehead Fish Prahok', defaultPercent: 45, displayText: 'ប្រហុកសាច់ត្រីរ៉ស់ (Fermented Fish Prahok)', tag: 'Traditional' },
      { id: 'shrimp-paste-kapi', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'កាពិកោះកុងប្រពៃណី', nameEn: 'Koh Kong Fermented Shrimp Paste (Kapi)', defaultPercent: 15, displayText: 'កាពិកោះកុង (Koh Kong Shrimp Paste)' },
      { id: 'sticky-rice-wine', category: 'salt_sauce', categoryKh: 'អំបិល & ទឹកត្រី', nameKh: 'ស្រាអង្ករដំណើបខ្មែរ', nameEn: 'Khmer Sticky Rice Cooking Wine', defaultPercent: 2.5, displayText: 'ស្រាអង្ករដំណើប (Khmer Rice Wine)' }
    ]
  },
  {
    id: 'oil_fat',
    nameKh: 'ប្រេង, ខ្លាញ់ & ទឹកដោះ',
    nameEn: 'Oils, Fats & Dairy/Plant Milks',
    icon: '🥥',
    placeholderKh: '-- ជ្រើសរើសប្រេង / ខ្លាញ់ / ទឹកដោះ (Select Oils & Fats) --',
    descriptionKh: 'ប្រេងដូងសុទ្ធ, ប្រេងគ្រាប់ស្វាយចន្ទី, ប្រេងល្ង, ប៊ឺធម្មជាតិ, ខ្ទិះដូង...',
    items: [
      { id: 'virgin-coconut-oil', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ប្រេងដូងសុទ្ធត្រជាក់ (Virgin Coconut Oil)', nameEn: 'Cold-Pressed Virgin Coconut Oil', defaultPercent: 4.0, displayText: 'ប្រេងដូងធម្មជាតិ (Virgin Coconut Oil)', tag: 'Cold-Pressed' },
      { id: 'cashew-oil', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ប្រេងគ្រាប់ស្វាយចន្ទីសុទ្ធ', nameEn: 'Virgin Cashew Kernel Nut Oil', defaultPercent: 4.0, displayText: 'ប្រេងគ្រាប់ស្វាយចន្ទីសុទ្ធ (Virgin Cashew Nut Oil)', tag: 'Artisan' },
      { id: 'toasted-sesame-oil', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ប្រេងល្ងក្រអូបសុទ្ធ', nameEn: 'Pure Toasted Sesame Oil', defaultPercent: 2.0, displayText: 'ប្រេងល្ងក្រអូប (Toasted Sesame Oil)' },
      { id: 'extra-virgin-olive-oil', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ប្រេងអូលីវព្រហ្មចារី (EVOO)', nameEn: 'Extra Virgin Olive Oil', defaultPercent: 3.5, displayText: 'ប្រេងអូលីវ (Extra Virgin Olive Oil)' },
      { id: 'rice-bran-oil', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ប្រេងកន្ទក់អង្ករខ្មែរ', nameEn: 'Cambodian Rice Bran Oil', defaultPercent: 4.0, displayText: 'ប្រេងកន្ទក់អង្ករ (Rice Bran Oil)', tag: 'High Smoke Point' },
      { id: 'fresh-coconut-cream', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ខ្ទិះដូងស្រស់ដើម', nameEn: 'Fresh Pure Coconut Milk / Cream', defaultPercent: 35, displayText: 'ខ្ទិះដូងស្រស់ (Fresh Coconut Cream)' },
      { id: 'natural-butter', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ប៊ឺធម្មជាតិសុទ្ធ (Dairy Butter)', nameEn: 'Pure Natural Dairy Butter', defaultPercent: 4.0, displayText: 'ប៊ឺធម្មជាតិ (Pure Dairy Butter)' },
      { id: 'milk-powder', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ម្សៅទឹកដោះគោសរីរាង្គ', nameEn: 'Organic Full Cream Milk Powder', defaultPercent: 5.0, displayText: 'ម្សៅទឹកដោះគោ (Organic Milk Powder)' },
      { id: 'pork-fat-lard', category: 'oil_fat', categoryKh: 'ប្រេង & ខ្លាញ់', nameKh: 'ខ្លាញ់ជ្រូកធម្មជាតិ', nameEn: 'Natural Rendered Pork Lard', defaultPercent: 8.0, displayText: 'ខ្លាញ់ជ្រូកធម្មជាតិ (Natural Pork Lard)' }
    ]
  },
  {
    id: 'fruit_meat',
    nameKh: 'ផ្លែឈើ, បន្លែ & សាច់កែច្នៃ',
    nameEn: 'Fruits, Vegetables & Meats',
    icon: '🥭',
    placeholderKh: '-- ជ្រើសរើសផ្លែឈើ / សាច់កែច្នៃ (Select Fruits & Meats) --',
    descriptionKh: 'ស្វាយកែវរមៀត, ចេកណាំវ៉ា, ម្នាស់, ខ្នុរ, ដូងកោស, សាច់ត្រីរ៉ស់, សាច់ជ្រូក...',
    items: [
      { id: 'mango-keo-romeat', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'សាច់ស្វាយកែវរមៀតស្រស់', nameEn: 'Fresh Cambodian Keo Romeat Mango', defaultPercent: 95, displayText: 'សាច់ស្វាយកែវរមៀតស្រស់ (Fresh Keo Romeat Mango)', tag: 'Export Grade' },
      { id: 'banana-namwa', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'ចេកណាំវ៉ាខ្មែរស្រស់', nameEn: 'Fresh Khmer Namwa Banana', defaultPercent: 92, displayText: 'ចេកណាំវ៉ាខ្មែរ (Khmer Namwa Banana)' },
      { id: 'honey-pineapple', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'ផ្លែម្នាស់ទឹកឃ្មុំស្រស់', nameEn: 'Sweet Honey Pineapple Fruit', defaultPercent: 90, displayText: 'ផ្លែម្នាស់ទឹកឃ្មុំ (Sweet Honey Pineapple)' },
      { id: 'red-dragonfruit', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'ផ្លែស្រកានាគក្រហម', nameEn: 'Red Flesh Dragonfruit', defaultPercent: 88, displayText: 'ផ្លែស្រកានាគក្រហម (Red Dragonfruit)' },
      { id: 'ripe-jackfruit', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'ផ្លែខ្នុរទុំធម្មជាតិ', nameEn: 'Ripe Golden Jackfruit', defaultPercent: 90, displayText: 'ផ្លែខ្នុរទុំធម្មជាតិ (Ripe Jackfruit)' },
      { id: 'desiccated-coconut', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'សាច់ដូងកោសស្ងួត', nameEn: 'Unsweetened Desiccated Coconut Flakes', defaultPercent: 15, displayText: 'សាច់ដូងកោសស្ងួត (Desiccated Coconut)' },
      { id: 'avocado-pulp', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'សាច់ផ្លែប័រ / ម្សៅផ្លែប័រ', nameEn: 'Fresh Avocado Pulp / Powder', defaultPercent: 20, displayText: 'សាច់ផ្លែប័រ (Avocado Pulp)' },
      { id: 'fish-snakehead-fillet', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'សាច់ត្រីរ៉ស់បឹងទន្លេសាប', nameEn: 'Tonle Sap Snakehead Fish Fillet', defaultPercent: 82, displayText: 'សាច់ត្រីរ៉ស់បឹងទន្លេសាប (Snakehead Fish Fillet)' },
      { id: 'pork-fresh-lean', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'សាច់ជ្រូកស្រស់ជ្រើសរើស', nameEn: 'Fresh Lean Pork Meat', defaultPercent: 78, displayText: 'សាច់ជ្រូកស្រស់ជ្រើសរើស (Fresh Lean Pork)' },
      { id: 'beef-fresh-cambodian', category: 'fruit_meat', categoryKh: 'ផ្លែឈើ & សាច់', nameKh: 'សាច់គោខ្មែរស្រស់', nameEn: 'Fresh Cambodian Grass-Fed Beef', defaultPercent: 80, displayText: 'សាច់គោខ្មែរស្រស់ (Fresh Cambodian Beef)' }
    ]
  },
  {
    id: 'additive',
    nameKh: 'សារធាតុបន្ថែមសុវត្ថិភាព & INS',
    nameEn: 'Food Additives, Regulators & INS Numbers',
    icon: '🛡️',
    placeholderKh: '-- ជ្រើសរើសសារធាតុបន្ថែមសុវត្ថិភាព (Select Food Additives / INS) --',
    descriptionKh: 'Citric Acid INS 330, MSG INS 621, Potassium Sorbate INS 202, Benzoate, Lecithin...',
    items: [
      { id: 'citric-acid-ins330', category: 'additive', categoryKh: 'សារធាតុបន្ថែម INS', nameKh: 'អាស៊ីតក្រូចឆ្មា INS 330 (កម្រិតអាស៊ីត)', nameEn: 'Citric Acid (INS 330 - Acidity Regulator)', defaultPercent: 0.2, displayText: 'អាស៊ីតក្រូចឆ្មា (Citric Acid INS 330)', tag: 'INS 330' },
      { id: 'msg-ins621', category: 'additive', categoryKh: 'សារធាតុបន្ថែម INS', nameKh: 'ប៊ីចេង / MSG INS 621 (បង្កើនរសជាតិ)', nameEn: 'Monosodium Glutamate (INS 621 - Flavor Enhancer)', defaultPercent: 0.5, displayText: 'ប៊ីចេង (Monosodium Glutamate E621 / INS 621)', tag: 'INS 621' },
      { id: 'potassium-sorbate-ins202', category: 'additive', categoryKh: 'សារធាតុបន្ថែម INS', nameKh: 'ប៉ូតាស្យូមស័របាត INS 202 (ប្រឆាំងផ្សិត)', nameEn: 'Potassium Sorbate (INS 202 - Anti-mold)', defaultPercent: 0.1, displayText: 'សារធាតុរក្សាគុណភាព (Potassium Sorbate INS 202)', tag: 'INS 202' },
      { id: 'sodium-benzoate-ins211', category: 'additive', categoryKh: 'សារធាតុបន្ថែម INS', nameKh: 'សូដ្យូមបង់សូអាត INS 211 (រក្សាគុណភាព)', nameEn: 'Sodium Benzoate (INS 211 - Preservative)', defaultPercent: 0.1, displayText: 'សារធាតុរក្សាគុណភាព (Sodium Benzoate INS 211)', tag: 'INS 211' },
      { id: 'soy-lecithin-ins322', category: 'additive', categoryKh: 'សារធាតុបន្ថែម INS', nameKh: 'ឡេស៊ីទីនសណ្តែកសៀង INS 322 (ធ្វើឱ្យរលាយស្មើ)', nameEn: 'Soy Lecithin (INS 322 - Emulsifier)', defaultPercent: 0.3, displayText: 'ឡេស៊ីទីនសណ្តែកសៀង (Soy Lecithin INS 322)', tag: 'INS 322' },
      { id: 'vitamin-e-ins307', category: 'additive', categoryKh: 'សារធាតុបន្ថែម INS', nameKh: 'វីតាមីន E / Tocopherol INS 307 (ប្រឆាំងអុកស៊ីតកម្ម)', nameEn: 'Mixed Tocopherols Vitamin E (INS 307 - Antioxidant)', defaultPercent: 0.05, displayText: 'វីតាមីន E ប្រឆាំងអុកស៊ីតកម្ម (Vitamin E INS 307)', tag: 'INS 307' },
      { id: 'calcium-chloride-ins509', category: 'additive', categoryKh: 'សារធាតុបន្ថែម INS', nameKh: 'កាល់ស្យូមក្លរួ INS 509 (រក្សាភាពស្រួយ)', nameEn: 'Calcium Chloride (INS 509 - Firming Agent)', defaultPercent: 0.1, displayText: 'កាល់ស្យូមក្លរួ (Calcium Chloride INS 509)', tag: 'INS 509' },
      { id: 'yeast-extract', category: 'additive', categoryKh: 'សារធាតុបន្ថែម INS', nameKh: 'សារធាតុចម្រាញ់ពីមេដំបែធម្មជាតិ', nameEn: 'Natural Autolyzed Yeast Extract', defaultPercent: 0.8, displayText: 'សារធាតុចម្រាញ់ពីមេដំបែធម្មជាតិ (Natural Yeast Extract)', tag: 'Clean Label' }
    ]
  }
];

// Flattened catalog maintaining backward compatibility
export const INDIVIDUAL_INGREDIENT_CATALOG: IndividualIngredientItem[] = INGREDIENT_CATEGORY_GROUPS.flatMap(group => group.items);

export const INGREDIENT_DROPDOWN_OPTIONS = [
  // 1. Cashew & Nuts Coated, Roasted & Processed Formulas
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេច ១% (Cashew Kernel Coated Pepper 1%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៦%, ម្រេចខ្មៅកំពត GI ១%, អំបិលសមុទ្រ ២%, ស្ករត្នោត ១%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេច ២% (Cashew Kernel Coated Pepper 2%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៥%, ម្រេចខ្មៅកំពត GI ២%, អំបិលសមុទ្រ ២%, ស្ករត្នោត ១%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេច ៣% (Cashew Kernel Coated Pepper 3%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៤%, ម្រេចខ្មៅកំពត GI ៣%, អំបិលសមុទ្រ ២%, ស្ករត្នោត ១%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេច ៥% (Cashew Kernel Coated Pepper 5%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩២%, ម្រេចខ្មៅកំពត GI ៥%, អំបិលសមុទ្រ ២%, ស្ករត្នោត ១%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេច ១២% (Cashew Kernel Coated Pepper 12%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៨៥%, ម្សៅស្រោបម្រេចកំពត GI ១២%, អំបិលសមុទ្រ ២%, ស្ករត្នោត ១%' },
  
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសស្រាល ២% (Coated Light Chili 2%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៥%, ម្សៅស្រោបម្ទេស ២%, ខ្ទឹមស ១.៥%, អំបិលសមុទ្រ ១.៥%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសហិរ ៥% (Coated Hot Chili 5%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩២%, ម្សៅស្រោបម្ទេស ៥%, ខ្ទឹមស ១.៥%, អំបិលសមុទ្រ ១.៥%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស & ខ្ទឹមស ១៣% (Cashew Kernel Coated Chili & Garlic)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៨៤%, ម្សៅស្រោបម្ទេស និងខ្ទឹមស ១៣%, អំបិលសមុទ្រ ២%, ស្ករត្នោត ១%' },
  
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករសគ្រាប់ ២% (Cashew Kernel White Sugar Coated 2%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៦%, ស្ករសគ្រាប់ ២%, អំបិលសមុទ្រ ២%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករសគ្រាប់ ៥% (Cashew Kernel White Sugar Coated 5%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៣%, ស្ករសគ្រាប់ ៥%, អំបិលសមុទ្រ ២%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្សៅស្ករម៉ត់ ៥% (Icing Sugar Glazed Cashews 5%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៣%, ម្សៅស្ករសម៉ត់ ៥%, អំបិលសមុទ្រ ២%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករស៊ីរ៉ូ ៥% (Condensed Sugar Syrup Cashews 5%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៣%, ស្ករស៊ីរ៉ូខាប់ ៥%, អំបិលសមុទ្រ ២%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ ២% (Cashew Kernel Coated Sugar 2%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៦%, ស្ករត្នោតកំពង់ស្ពឺ GI ២%, អំបិលសមុទ្រ ២%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ ៥% (Cashew Kernel Coated Sugar 5%)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៣%, ស្ករត្នោតកំពង់ស្ពឺ GI ៥%, អំបិលសមុទ្រ ២%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្នោត ១៦% (Cashew Kernel Sugar Coated / Palm Sugar Glazed)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៨២%, ស្ករត្នោតកំពង់ស្ពឺ GI ១៦%, អំបិលសមុទ្រ ២%' },
  
  { label: 'គ្រាប់ស្វាយចន្ទីលីងម្រេចខ្មៅកំពត ២.៥% (Gourmet Kampot Pepper Cashews)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩៦%, ម្រេចខ្មៅកំពត GI ២.៥%, អំបិលសមុទ្រ ១.៥%' },
  { label: 'គ្រាប់ស្វាយចន្ទីបំពងម្ទេស & ខ្ទឹមស ២.៥% (Crispy Spicy Chili Cashews)', val: 'គ្រាប់ស្វាយចន្ទី ៩៥%, ម្ទេសហិរធម្មជាតិ ២.៥%, ខ្ទឹមស ១.៥%, អំបិលសមុទ្រ ១%' },
  { label: 'គ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០% (100% Pure Cashew Kernels)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជាធម្មជាតិ ១០០% — គ្មានសារធាតុរក្សាទុក គ្មានជាតិគីមីបន្ថែម' },
  { label: 'គ្រាប់ស្វាយចន្ទីលីងអំបិល (Roasted Cashews with Kampot Salt)', val: 'គ្រាប់ស្វាយចន្ទី W240 ៩៨.៥%, អំបិលសមុទ្រកំពតធម្មជាតិ ១.៥%' },
  { label: 'នំស្រួយគ្រាប់ស្វាយចន្ទី ល្ងខ្មៅ & អង្ករដំណើប (Cashew Sesame Rice Cracker Snack)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៤៥%, អង្ករដំណើបខ្មែរ ៣០%, ល្ងខ្មៅសរីរាង្គ ១២%, ស្ករត្នោតធម្មជាតិ ៨%, ទឹកឃ្មុំព្រៃ ៣%, អំបិលសមុទ្រកំពត ២%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបល្ង & ស្ករត្នោត (Cashew Caramel Sesame Bites)', val: 'គ្រាប់ស្វាយចន្ទី ៦០%, ស្ករត្នោតកំពង់ស្ពឺ ២០%, គ្រាប់ល្ងស ១៥%, ប៊ឺធម្មជាតិ ៤%, អំបិល ១%' },
  { label: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ (Cashew Flour Powder)', val: 'ម្សៅគ្រាប់ស្វាយចន្ទីកិនម៉ដ្ឋពិសេស ១០០% — គ្មានលាយម្សៅស្រូវសាលី' },
  { label: 'ប៊ឺគ្រាប់ស្វាយចន្ទីធម្មជាតិ (Artisan Cashew Butter)', val: 'គ្រាប់ស្វាយចន្ទីលីង ៩៧.៥%, ទឹកឃ្មុំព្រៃធម្មជាតិ ២.០%, អំបិលកំពត ០.៥%' },
  { label: 'ទឹកដោះគ្រាប់ស្វាយចន្ទីធម្មជាតិ ១០០% (100% Cashew Milk 1L)', val: 'ទឹកចម្រោះ ៨៥%, សាច់គ្រាប់ស្វាយចន្ទីកម្ពុជា ១៤.៥%, អំបិលសមុទ្រកំពត ០.៥%' },
  { label: 'ទឹកដោះគ្រាប់ស្វាយចន្ទីរសជាតិស្លឹកតយ (Pandan Flavored Cashew Milk 1L)', val: 'ទឹកចម្រោះ ៨៣.៥%, សាច់គ្រាប់ស្វាយចន្ទីកម្ពុជា ១៤%, ម្សៅស្លឹកតយធម្មជាតិ ២%, អំបិលសមុទ្រកំពត ០.៥%' },
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោបម្សៅស្លឹកតយ (Pandan Powder Coated Cashews)', val: 'គ្រាប់ស្វាយចន្ទីកម្ពុជា ៩២%, ម្សៅស្លឹកតយធម្មជាតិ ៤%, ស្ករត្នោត ២%, អំបិលសមុទ្រ ២%' },
  
  // 2. Traditional Cambodian Processed Meats & Sausages (សាច់ក្រក, សាច់ក្រកត្រី, សាច់ក្រកជ្រូក)
  { label: 'សាច់ក្រកត្រីអត់ឆ្អឹង (Artisan Fish Sausage / Kvah Trey)', val: 'សាច់ត្រីរ៉ស់បឹងទន្លេសាប ៨២%, ខ្លាញ់ជ្រូកធម្មជាតិ ៨%, ស្ករត្នោត ៤.៥%, ខ្ទឹមស ២.៥%, ទឹកត្រីកោះកុង ២%, អំបិលសមុទ្រ ០.៨%, ម្រេចកំពត ០.២%' },
  { label: 'សាច់ក្រកជ្រូកខ្មែរប្រពៃណី (Traditional Khmer Pork Sausage / Kvah Chrouk)', val: 'សាច់ជ្រូកស្រស់ជ្រើសរើស ៧៨%, ខ្លាញ់ជ្រូក ១២%, ស្ករត្នោតកំពង់ស្ពឺ ៥%, ស្រាអង្ករដំណើប ២.៥%, ខ្ទឹមស ១%, អំបិល ១%, ម្ទេសក្រៀម ០.៥%' },
  { label: 'សាច់ក្រកគោរសជាតិដើម (Traditional Beef Sausage / Kvah Ko)', val: 'សាច់គោខ្មែរស្រស់ ៨០%, ខ្លាញ់គោ ៨%, ស្ករត្នោត ៥%, គល់ស្លឹកគ្រៃ & រមៀត ៣%, ខ្ទឹមស ២%, អំបិល ១%, ម្សៅស៊ុបធម្មជាតិ ១%' },
  { label: 'សាច់ជ្រូកងៀត ឬសាច់គោផ្អែម (Dried Sweet Meat Jerky)', val: 'សាច់ជ្រូក/សាច់គោសុទ្ធ ៨៨%, ស្ករត្នោត ៦%, ទឹកត្រី ៣%, ល្ងស ១.៥%, ខ្ទឹមស ១%, ម្រេចកំពត ០.៥%' },

  // 3. Fermented Fish & Ready-to-Eat Khmer Delicacies (ប្រហុកចិញ្ច្រាំ, ប្រហុកខ្ទិះ, ផ្អក, ម៉ាំ)
  { label: 'ប្រហុកចិញ្ច្រាំឆ្អិនស្រេច (Cooked Ready-to-Eat Minced Prahok)', val: 'ប្រហុកសាច់ត្រីរ៉ស់ ៤៥%, សាច់ជ្រូកចិញ្ច្រាំ ៣០%, គ្រឿងស្លឹកគ្រៃរមៀត ១២%, ម្ទេសស្រស់ ៥%, ខ្ទឹមសខ្ទឹមក្រហម ៤%, ស្ករត្នោត ៣%, ត្រប់ពុតលំញង ១%' },
  { label: 'ប្រហុកខ្ទិះកំប៉ុង (Ready-to-Eat Prahok Ktis in Coconut Cream)', val: 'ខ្ទិះដូងស្រស់ ៤០%, សាច់ជ្រូកចិញ្ច្រាំ ៣០%, ប្រហុកត្រីកំភ្លាញ ២០%, គ្រឿងបុកខ្មែរ ៥%, ស្ករត្នោត ៣%, ម្ទេស & ត្រប់ញ័រ ២%' },
  { label: 'ផ្អកត្រីប្រៃផ្អែម (Fermented Fish Pha-ok / Mam)', val: 'សាច់ត្រីកែច្នៃផ្អក ៨០%, អង្ករលីងក្រហម ១០%, ស្ករត្នោត ៥%, ខ្ទឹមស ៣%, ខ្ញីហាន់ ២%' },
  { label: 'ទឹកត្រីកោះកុងប្រភពដើម (Koh Kong Artisan Fish Sauce)', val: 'ត្រីកន្ទួតសមុទ្រ ៧៥%, អំបិលសមុទ្រកំពត ២៥% — អាយុកាលផ្អាប់ ១២ខែតាមក្បួនបុរាណ' },
  { label: 'អំបិលម្ទេសបង្គា / អំបិលម្រេចកំពត (Kampot Pepper & Shrimp Chili Salt)', val: 'អំបិលសមុទ្រកំពត ៥០%, បង្គាក្រៀម ២៥%, ម្ទេសក្រៀម ១៥%, ស្ករស ៨%, ខ្ទឹមស ២%' },
  
  // 4. Dried Fruits, Spices & Agricultural Processed Products
  { label: 'ដំណាប់ស្វាយកែវរមៀត (Dried Keo Romeat Mango)', val: 'សាច់ស្វាយកែវរមៀតស្រស់ ៩៥%, ស្ករអំពៅធម្មជាតិ ៤.៨%, អាស៊ីតក្រូចឆ្មា ០.២%' },
  { label: 'ដំណាប់ចេក ឬចេកបន្ទះបំពង (Crispy Banana Chips / Dried Banana)', val: 'ចេកណាំវ៉ាខ្មែរ ៩២%, ប្រេងដូង/ប្រេងរុក្ខជាតិ ៦%, ស្ករត្នោត ១.៥%, អំបិល ០.៥%' },
  { label: 'ម្រេចខ្មៅកំពត GI (GI Black Kampot Pepper)', val: 'គ្រាប់ម្រេចខ្មៅកំពត GI ធម្មជាតិ ១០០%' }
];

// Spices, Sweeteners, Seasonings & Condiments Quick Add-In Presets for Cambodian SMEs
export const SPICE_AND_SEASONING_ADDONS = [
  // Pepper Options (1% - 5%)
  { label: '+ ម្រេចខ្មៅកំពត GI 1% (1% Black Pepper)', text: 'ម្រេចខ្មៅកំពត GI ១%' },
  { label: '+ ម្រេចខ្មៅកំពត GI 2% (2% Black Pepper)', text: 'ម្រេចខ្មៅកំពត GI ២%' },
  { label: '+ ម្រេចខ្មៅកំពត GI 3% (3% Black Pepper)', text: 'ម្រេចខ្មៅកំពត GI ៣%' },
  { label: '+ ម្រេចខ្មៅកំពត GI 4% (4% Black Pepper)', text: 'ម្រេចខ្មៅកំពត GI ៤%' },
  { label: '+ ម្រេចខ្មៅកំពត GI 5% (5% Black Pepper)', text: 'ម្រេចខ្មៅកំពត GI ៥%' },
  
  // Chili Options (1% - 5%)
  { label: '+ ម្សៅស្រោបម្ទេសស្រាល 1% (Coated Light Chili 1%)', text: 'ម្សៅស្រោបម្ទេស ១%' },
  { label: '+ ម្សៅស្រោបម្ទេសស្រាល 2% (Coated Light Chili 2%)', text: 'ម្សៅស្រោបម្ទេស ២%' },
  { label: '+ ម្សៅស្រោបម្ទេសមធ្យម 3% (Coated Medium Chili 3%)', text: 'ម្សៅស្រោបម្ទេស ៣%' },
  { label: '+ ម្សៅស្រោបម្ទេសហិរ 4% (Coated Hot Chili 4%)', text: 'ម្សៅស្រោបម្ទេស ៤%' },
  { label: '+ ម្សៅស្រោបម្ទេសហិរ 5% (Coated Hot Chili 5%)', text: 'ម្សៅស្រោបម្ទេស ៥%' },

  // Sugar Options (Granulated White Sugar, Icing Powder, Condensed Syrup, GI Palm Sugar 1% - 5%)
  { label: '+ ស្ករសគ្រាប់ ១% (1% White Sugar)', text: 'ស្ករសគ្រាប់ ១%' },
  { label: '+ ស្ករសគ្រាប់ ២% (2% White Sugar)', text: 'ស្ករសគ្រាប់ ២%' },
  { label: '+ ស្ករសគ្រាប់ ៣% (3% White Sugar)', text: 'ស្ករសគ្រាប់ ៣%' },
  { label: '+ ស្ករសគ្រាប់ ៥% (5% White Sugar)', text: 'ស្ករសគ្រាប់ ៥%' },
  { label: '+ ម្សៅស្ករសម៉ត់ ២% (2% Icing Sugar)', text: 'ម្សៅស្ករសម៉ត់ ២%' },
  { label: '+ ម្សៅស្ករសម៉ត់ ៥% (5% Icing Sugar)', text: 'ម្សៅស្ករសម៉ត់ ៥%' },
  { label: '+ ស្ករស៊ីរ៉ូខាប់ ២% (2% Condensed Syrup)', text: 'ស្ករស៊ីរ៉ូខាប់ ២%' },
  { label: '+ ស្ករស៊ីរ៉ូខាប់ ៥% (5% Condensed Syrup)', text: 'ស្ករស៊ីរ៉ូខាប់ ៥%' },
  { label: '+ ម្សៅស្រោបស្ករត្នោត 1% (Coated Sugar 1%)', text: 'ម្សៅស្រោបស្ករត្នោត ១%' },
  { label: '+ ម្សៅស្រោបស្ករត្នោត 2% (Coated Sugar 2%)', text: 'ម្សៅស្រោបស្ករត្នោត ២%' },
  { label: '+ ម្សៅស្រោបស្ករត្នោត 3% (Coated Sugar 3%)', text: 'ម្សៅស្រោបស្ករត្នោត ៣%' },
  { label: '+ ម្សៅស្រោបស្ករត្នោត 4% (Coated Sugar 4%)', text: 'ម្សៅស្រោបស្ករត្នោត ៤%' },
  { label: '+ ម្សៅស្រោបស្ករត្នោត 5% (Coated Sugar 5%)', text: 'ម្សៅស្រោបស្ករត្នោត ៥%' },
  { label: '+ ស្ករត្នោតកំពង់ស្ពឺ GI 2% (GI Palm Sugar 2%)', text: 'ស្ករត្នោតកំពង់ស្ពឺ GI ២%' },
  { label: '+ ស្ករត្នោតកំពង់ស្ពឺ GI 5% (GI Palm Sugar 5%)', text: 'ស្ករត្នោតកំពង់ស្ពឺ GI ៥%' },
  { label: '+ ស្ករសធម្មតា (Refined White Sugar)', text: 'ស្ករសធម្មតា' },
  { label: '+ ស្ករត្នោតធម្មជាតិ (Natural Palm Sugar)', text: 'ស្ករត្នោតធម្មជាតិ' },
  { label: '+ ស្ករអំពៅស (Cane Sugar)', text: 'ស្ករអំពៅ' },

  // Salts & Flavors
  { label: '+ អំបិលសមុទ្រកំពត (Kampot Sea Salt)', text: 'អំបិលសមុទ្រកំពត' },
  { label: '+ ផ្កាអំបិលកំពត GI (Kampot Fleur de Sel)', text: 'ផ្កាអំបិលកំពត GI' },
  { label: '+ ខ្ទឹមស & ខ្ទឹមក្រហម (Garlic & Shallots)', text: 'ខ្ទឹមស និងខ្ទឹមក្រហម' },
  { label: '+ គ្រឿងស្លឹកគ្រៃរមៀត (Kroeung Paste)', text: 'គ្រឿងស្លឹកគ្រៃរមៀត' },
  { label: '+ ស្លឹកក្រូចសើច (Kaffir Lime Leaves)', text: 'ស្លឹកក្រូចសើច' },
  { label: '+ ប៊ីចេង / MSG (INS 621)', text: 'ប៊ីចេង' },
  { label: '+ ម្សៅស៊ុបខ្នរ (Seasoning Bouillon)', text: 'ម្សៅស៊ុបធម្មជាតិ' },
  { label: '+ ទឹកត្រីសុទ្ធ (Fish Sauce)', text: 'ទឹកត្រីប្រពៃណី' },
  { label: '+ ទឹកស៊ីអ៊ីវ (Soy Sauce)', text: 'ទឹកស៊ីអ៊ីវសណ្តែកសៀង' },
  { label: '+ ស្រាអង្ករដំណើប (Cooking Rice Wine)', text: 'ស្រាអង្ករដំណើប' },
  { label: '+ ទឹកឃ្មុំព្រៃធម្មជាតិ (Wild Honey)', text: 'ទឹកឃ្មុំព្រៃធម្មជាតិ' },
  { label: '+ គ្រាប់ល្ងស / ល្ងខ្មៅ (Sesame Seeds)', text: 'គ្រាប់ល្ងធម្មជាតិ' },
  { label: '+ ម្សៅស្លឹកតយធម្មជាតិ (Natural Pandan Leaf Powder)', text: 'ម្សៅស្លឹកតយធម្មជាតិ' },
  { label: '+ សារធាតុរក្សាគុណភាព (INS 202 / 211)', text: 'សារធាតុរក្សាគុណភាព' }
];

export const ALLERGEN_DROPDOWN_OPTIONS = [
  { label: 'ផ្ទុកសារធាតុបង្កប្រតិកម្ម: គ្រាប់ស្វាយចន្ទី (Contains: Tree Nuts - Cashew)', val: 'ផ្ទុកសារធាតុបង្កប្រតិកម្ម៖ គ្រាប់ស្វាយចន្ទី' },
  { label: 'គ្មានជាតិគ្លុយតែន & គ្មានទឹកដោះគោ (Gluten-Free & Dairy-Free)', val: 'គ្មានជាតិគ្លុយតែន និងគ្មានផលិតផលទឹកដោះគោ' },
  { label: 'ផ្ទុកសណ្តែកដី & សណ្តែកសៀង (Contains: Peanuts & Soy)', val: 'ផ្ទុកសណ្តែកដី និងសណ្តែកសៀង' },
  { label: 'ផលិតក្នុងរោងចក្រគ្មានសារធាតុអាឡែហ្ស៊ី (Produced in Allergen-Free Facility)', val: 'ផលិតក្នុងរោងចក្រគ្មានសារធាតុអាឡែហ្ស៊ី' }
];

export const STORAGE_DROPDOWN_OPTIONS = [
  { label: 'កន្លែងត្រជាក់ & ស្ងួត (< 25°C Cool Dry Place)', val: 'រក្សាទុកនៅកន្លែងស្ងួត ត្រជាក់ (< 25°C) ជៀសវាងពន្លឺព្រះអាទិត្យផ្ទាល់។ បិទគម្រប និងបន្ទះអាលុយមីញ៉ូមឱ្យជិតបន្ទាប់ពីប្រើរួច' },
  { label: 'រក្សាទុកក្នុងថង់បិទជិត (Keep Zipper Sealed - គ្រាប់ស្វាយចន្ទី & ផ្លែឈើស្ងួត)', val: 'បិទមាត់ថង់ហ្ស៊ីបឱ្យជិត ដើម្បីរក្សាភាពស្រួយ និងការពារសំណើមពីបរិយាកាស' },
  { label: 'ផ្លែឈើស្ងួត & បន្ទះចេក (Dried Fruits & Chips)', val: 'រក្សាទុកក្នុងកន្លែងត្រជាក់ ស្ងួត ជៀសវាងកម្តៅ និងសំណើម។ បិទថង់ឱ្យជិតក្រោយពេលបើក' },
  { label: 'ទឹកឃ្មុំព្រៃ & ស្ករត្នោត (Wild Honey & Palm Sugar)', val: 'រក្សាទុកនៅសីតុណ្ហភាពបន្ទប់ធម្មតា កន្លែងស្ងួត មិនចាំបាច់ក្លាសេក្នុងទូទឹកកកឡើយ' },
  { label: 'កាហ្វេម្សៅ & តែរុក្ខជាតិ (Ground Coffee & Herbal Tea)', val: 'រក្សាទុកក្នុងប្រអប់ ឬថង់បិទជិតមិនឱ្យចូលខ្យល់ ឆ្ងាយពីពន្លឺ និងសំណើម' },
  { label: 'ទឹកត្រី & ទឹកម្ទេស (Fish Sauce & Chili Sauce)', val: 'រក្សាទុកនៅកន្លែងត្រជាក់ ម្លប់។ ក្រោយបើកគម្រប បិទឱ្យជិត ឬដាក់ក្នុងទូទឹកកក' },
  { label: 'អង្ករប្រណិត & ធញ្ញជាតិ (Jasmine Rice & Grains)', val: 'រក្សាទុកក្នុងធុងបិទជិត ឬកន្លែងស្ងួត ផុតពីដី ការពារសត្វល្អិត និងសំណើម' },
  { label: 'ត្រីងៀត & សាច់ក្រក (Dried Fish & Sausages)', val: 'រក្សាទុកក្នុងទូទឹកកកសីតុណ្ហភាព ០°C ដល់ ៤°C ឬក្លាសេកក -១៨°C ដើម្បីរក្សាគុណភាពបានយូរ' },
  { label: 'រក្សាទុកក្នុងទូទឹកកកក្រោយបើក (Refrigerate After Opening - ប្រហុក & ប័រ)', val: 'ក្រោយបើកគម្របរួច សូមរក្សាទុកក្នុងទូទឹកកកសីតុណ្ហភាព ៤°C ទៅ ៨°C ហើយទទួលទានឱ្យអស់ក្នុងរយៈពេល ៣០ថ្ងៃ' }
];

export const USAGE_DROPDOWN_OPTIONS = [
  { label: 'គ្រាប់ស្វាយចន្ទីស្រោប & លីង - ញ៉ាំផ្ទាល់ (Ready-to-eat Coated Snack)', val: 'កសិផលសម្រន់សុខភាព អាចទទួលទានផ្ទាល់ ញ៉ាំជាមួយភេសជ្ជៈ ឬលាយជាមួយសាឡាដបន្លែធម្មជាតិ' },
  { label: 'ម្សៅគ្រាប់ស្វាយចន្ទី - ទឹកដោះ, ស្មូធី & ធ្វើនំ (Cashew Milk, Smoothies & Baking)', val: '• ធ្វើទឹកដោះគ្រាប់ស្វាយចន្ទីក្តៅ ឬត្រជាក់ (ម្សៅ ១ គីឡូក្រាម អាចធ្វើបានប្រហែល ៧ លីត្រ)\n• លាយក្នុងស្មូធី កាហ្វេ និងភេសជ្ជៈផ្សេងៗ\n• ប្រើធ្វើនំ នំប៉័ង នំប៊ីស្គីត បបរ និងម្ហូបផ្សេងៗ' },
  { label: 'ផ្លែឈើស្ងួត - ញ៉ាំផ្ទាល់ & អាហារសម្រន់ (Dried Fruit Ready-to-Eat)', val: 'ញ៉ាំផ្ទាល់ជាអាហារសម្រន់ធម្មជាតិផ្អែមឆ្ងាញ់ លាយជាមួយទឹកដោះគោជូរ ធញ្ញជាតិពេលព្រឹក ឬនំខេក' },
  { label: 'ទឹកឃ្មុំព្រៃ & ស្ករត្នោត - ភេសជ្ជៈ & បង្អែម (Honey & Sweetener)', val: 'ប្រើឆុងជាមួយតែ កាហ្វេ ទឹកក្រូចឆ្មា ឬបន្ថែមរសជាតិផ្អែមឈ្ងុយក្នុងមុខម្ហូប និងបង្អែមខ្មែរ' },
  { label: 'កាហ្វេម្សៅ & តែ - ឆុងក្តៅ/ត្រជាក់ (Coffee & Herbal Infusion)', val: 'ឆុងជាមួយទឹកក្តៅពុះ ៩០°C-៩៥°C រយៈពេល ៣-៥នាទី។ អាចបន្ថែមទឹកដោះគោ ឬទឹកកកតាមចំណូលចិត្ត' },
  { label: 'ទឹកត្រី & ទឹកម្ទេស - ជ្រលក់ & ស្ល (Dipping Sauce & Seasoning)', val: 'ប្រើជាទឹកជ្រលក់ផ្ទាល់សម្រាប់អាហារសមុទ្រ សាច់អាំង ឬចម្អិនជាគ្រឿងផ្សំសម្ល' },
  { label: 'អង្ករផ្ការំដួល - ដាំបាយក្រអូប (Steamed Fragrant Rice)', val: 'លាងអង្ករ ១-២ដង ដាំជាមួយទឹកក្នុងសមាមាត្រ អង្ករ ១កែវ ៖ ទឹក ១.២ ទៅ ១.៣កែវ' },
  { label: 'ត្រីងៀត & សាច់ក្រក - ចៀន អាំង ស្ល (Cooking Instructions)', val: 'ចៀន អាំង ឬចំហុយលើភ្លើងមធ្យម ៥-៨នាទីរហូតដល់ឆ្អិនល្អ និងឈ្ងុយឆ្ងាញ់' },
  { label: 'ប៊ឺស្វាយចន្ទី - លាបនំបុ័ង (Toast Spread & Dips)', val: 'លាបលើនំបុ័ង ជ្រលក់ផ្លែប៉ោម ចេក ឬលាយក្នុងទឹកជ្រលក់ស៊ុប និងទឹកសាឡាដ' }
];

export const COUNTRY_ORIGIN_OPTIONS = [
  { label: 'ផលិតផលនៃព្រះរាជាណាចក្រកម្ពុជា (Product of Cambodia)', val: 'ផលិតផលនៃព្រះរាជាណាចក្រកម្ពុជា' },
  { label: 'ផលិតនៅប្រទេសកម្ពុជា (Made in Cambodia)', val: 'ផលិតនៅប្រទេសកម្ពុជា' },
  { label: 'កសិផលប្រភពដើមកម្ពុជា ១០០% (100% Single Origin Cambodian Produce)', val: 'កសិផលប្រភពដើមកម្ពុជា ១០០%' }
];

export interface StandardCertificationItem {
  id: string;
  category: 'national' | 'food_safety' | 'iso' | 'organic' | 'origin_gi' | 'specialty';
  nameKh: string;
  nameEn: string;
  code: string;
  authorityKh: string;
  authorityEn: string;
  badgeLabel: string;
  icon: string;
  tag?: string;
  defaultCertNumber?: string;
}

export const CAMBODIA_CERTIFICATION_STANDARDS: StandardCertificationItem[] = [
  // 1. National & Food Safety Mandatory / Recommended Standards in Cambodia
  {
    id: 'cs-mark',
    category: 'national',
    nameKh: 'សញ្ញាស្តង់ដារកម្ពុជា CS (Cambodian Standard Mark)',
    nameEn: 'Cambodian Standard Product Certification (CS Mark)',
    code: 'CS 001:2000',
    authorityKh: 'វិទ្យាស្ថានស្តង់ដារកម្ពុជា (ISC) / ក្រសួង ឧ.វិ.ប.ន.',
    authorityEn: 'Institute of Standards of Cambodia (ISC / MISTI)',
    badgeLabel: 'CS 001:2000 Certified',
    icon: '🇰🇭',
    tag: 'National CS Mark',
    defaultCertNumber: 'ISC/CS-001/KH-2026-9812'
  },
  {
    id: 'ghp-cambodia',
    category: 'food_safety',
    nameKh: 'គោលការណ៍អនាម័យល្អ GHP (Good Hygiene Practices)',
    nameEn: 'Good Hygiene Practices (GHP Standard)',
    code: 'GHP / Codex Alimentarius',
    authorityKh: 'ក្រសួងឧស្សាហកម្ម វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា និងនវានុវត្តន៍ & ក្រសួងសុខាភិបាល',
    authorityEn: 'MISTI & Ministry of Health Cambodia',
    badgeLabel: 'GHP Certified Facility',
    icon: '🧼',
    tag: 'Hygiene Standard',
    defaultCertNumber: 'GHP-MISTI-KH-88301'
  },
  {
    id: 'gmp-cambodia',
    category: 'food_safety',
    nameKh: 'ការអនុវត្តផលិតកម្មល្អ GMP (Good Manufacturing Practices)',
    nameEn: 'Good Manufacturing Practices (GMP Certified)',
    code: 'ASEAN GMP / Codex CXC 1-1969',
    authorityKh: 'ក្រសួង ឧ.វិ.ប.ន. / នាយកដ្ឋានចំណីអាហារ',
    authorityEn: 'Department of Food Industry / ASEAN GMP Taskforce',
    badgeLabel: 'GMP Certified System',
    icon: '🏭',
    tag: 'Manufacturing Quality',
    defaultCertNumber: 'GMP-KH-2026-00452'
  },
  {
    id: 'haccp-cambodia',
    category: 'food_safety',
    nameKh: 'ការវិភាគគ្រោះថ្នាក់ & ចំណុចត្រួតពិនិត្យសំខាន់ HACCP',
    nameEn: 'Hazard Analysis and Critical Control Point (HACCP)',
    code: 'Codex HACCP / ISO 22000 aligned',
    authorityKh: 'អគ្គនាយកដ្ឋាន ក.ប.ប. (CCF) / ISC / អន្តរជាតិ',
    authorityEn: 'Directorate General of CCF / International Auditor',
    badgeLabel: 'HACCP Food Safety Certified',
    icon: '🛡️',
    tag: 'Supermarket Gold Standard',
    defaultCertNumber: 'HACCP-CODEX-KH-91823'
  },
  {
    id: 'product-cert-misti',
    category: 'national',
    nameKh: 'វិញ្ញាបនបត្របញ្ជាក់គុណភាពផលិតផល (MISTI Product Certification)',
    nameEn: 'MISTI Quality Product Conformity Certification',
    code: 'MISTI Product Conformity License',
    authorityKh: 'ក្រសួងឧស្សាហកម្ម វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា និងនវានុវត្តន៍',
    authorityEn: 'Ministry of Industry, Science, Technology & Innovation',
    badgeLabel: 'MISTI Conformity Mark',
    icon: '🏅',
    tag: 'Product License',
    defaultCertNumber: 'MISTI-PC-2026-00918'
  },
  {
    id: 'ccf-verified',
    category: 'national',
    nameKh: 'ការត្រួតពិនិត្យសុវត្ថិភាពម្ហូបអាហារ ក.ប.ប. (CCF Verified)',
    nameEn: 'CCF Consumer Protection & Food Safety Verified',
    code: 'CCF Law on Food Safety 2022',
    authorityKh: 'អគ្គនាយកដ្ឋានការពារអ្នកប្រើប្រាស់ កិច្ចការប្រកួតប្រជែង និងបង្ក្រាបការក្លែងបន្លំ (ក.ប.ប.)',
    authorityEn: 'Directorate General of CCF (Ministry of Commerce)',
    badgeLabel: 'CCF Compliance Verified',
    icon: '⚖️',
    tag: 'Consumer Protection',
    defaultCertNumber: 'CCF-FS-REG-2026-7731'
  },
  {
    id: 'camgap-maff',
    category: 'national',
    nameKh: 'ការអនុវត្តកសិកម្មល្អកម្ពុជា CamGAP (Cambodia GAP)',
    nameEn: 'Cambodia Good Agricultural Practices (CamGAP)',
    code: 'MAFF CamGAP Standard',
    authorityKh: 'ក្រសួងកសិកម្ម រុក្ខាប្រមាញ់ និងនេសាទ (MAFF)',
    authorityEn: 'Ministry of Agriculture, Forestry and Fisheries',
    badgeLabel: 'CamGAP Certified Farm',
    icon: '🌱',
    tag: 'Farm Level GAP',
    defaultCertNumber: 'CamGAP-MAFF-KT-5521'
  },

  // 2. ISO & International Management System Standards
  {
    id: 'iso-22000',
    category: 'iso',
    nameKh: 'ស្តង់ដារប្រព័ន្ធគ្រប់គ្រងសុវត្ថិភាពចំណីអាហារ ISO 22000:2018',
    nameEn: 'ISO 22000:2018 Food Safety Management System (FSMS)',
    code: 'ISO 22000:2018',
    authorityKh: 'អង្គការស្តង់ដារអន្តរជាតិ ISO (International Organization for Standardization)',
    authorityEn: 'Accredited International Certification Body',
    badgeLabel: 'ISO 22000:2018 Certified',
    icon: '🌐',
    tag: 'Global FSMS',
    defaultCertNumber: 'ISO-22000-FSMS-2026-1049'
  },
  {
    id: 'iso-9001',
    category: 'iso',
    nameKh: 'ស្តង់ដារប្រព័ន្ធគ្រប់គ្រងគុណភាព ISO 9001:2015',
    nameEn: 'ISO 9001:2015 Quality Management System (QMS)',
    code: 'ISO 9001:2015',
    authorityKh: 'អង្គការស្តង់ដារអន្តរជាតិ ISO',
    authorityEn: 'International Accreditation Forum (IAF Member)',
    badgeLabel: 'ISO 9001:2015 Quality Management',
    icon: '⭐',
    tag: 'Global QMS',
    defaultCertNumber: 'ISO-9001-QMS-2026-8834'
  },
  {
    id: 'iso-14001',
    category: 'iso',
    nameKh: 'ស្តង់ដារគ្រប់គ្រងបរិស្ថាន ISO 14001:2015',
    nameEn: 'ISO 14001:2015 Environmental Management System',
    code: 'ISO 14001:2015',
    authorityKh: 'អង្គការស្តង់ដារអន្តរជាតិ ISO',
    authorityEn: 'Environmental Management Certification Body',
    badgeLabel: 'ISO 14001 Environmental Eco',
    icon: '🌿',
    tag: 'Green Eco Standard',
    defaultCertNumber: 'ISO-14001-EMS-2026-4412'
  },
  {
    id: 'fssc-22000',
    category: 'iso',
    nameKh: 'ស្តង់ដារសុវត្ថិភាពចំណីអាហារសកល FSSC 22000 (GFSI Recognized)',
    nameEn: 'FSSC 22000 Version 6 (Global Food Safety Initiative GFSI)',
    code: 'FSSC 22000 V6',
    authorityKh: 'គណៈកម្មាធិការ FSSC Foundation / GFSI Global Retailers',
    authorityEn: 'Global Food Safety Initiative (GFSI Recognized)',
    badgeLabel: 'FSSC 22000 GFSI Approved',
    icon: '✨',
    tag: 'Global Export Spec',
    defaultCertNumber: 'FSSC-V6-KH-2026-6639'
  },
  {
    id: 'brcgs-food',
    category: 'iso',
    nameKh: 'ស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ BRCGS Food Safety',
    nameEn: 'BRCGS Global Standard for Food Safety Issue 9',
    code: 'BRCGS Issue 9',
    authorityKh: 'British Retail Consortium Global Standards',
    authorityEn: 'BRCGS International Certification Body',
    badgeLabel: 'BRCGS Food Safety Grade A',
    icon: '🏛️',
    tag: 'UK & EU Retail Standard',
    defaultCertNumber: 'BRCGS-FOOD-KH-9921'
  },

  // 3. Religious, Organic & Geographical Indication (GI) Certifications
  {
    id: 'halal-cambodia',
    category: 'specialty',
    nameKh: 'វិញ្ញាបនបត្របញ្ជាក់ផលិតផលហាឡាល់កម្ពុជា (Halal Cambodia)',
    nameEn: 'Cambodia National Halal Certification',
    code: 'Halal MoC / HICC Cambodia',
    authorityKh: 'គណៈកម្មាធិការត្រួតពិនិត្យផលិតផលហាឡាល់កម្ពុជា & គណៈដឹកនាំជាន់ខ្ពស់ឥស្លាមកម្ពុជា',
    authorityEn: 'Halal Inspection Committee of Cambodia & Ministry of Commerce',
    badgeLabel: 'Halal Certified (حلال)',
    icon: 'حلال',
    tag: 'Muslim Market Ready',
    defaultCertNumber: 'HALAL-KH-MOC-2026-0318'
  },
  {
    id: 'gi-cambodia',
    category: 'origin_gi',
    nameKh: 'ម៉ាកសម្គាល់ភូមិសាស្ត្រទំនិញ GI កម្ពុជា (GI Cambodia Protected)',
    nameEn: 'Cambodian Protected Geographical Indication (GI)',
    code: 'MoC GI Law / WIPO Protected',
    authorityKh: 'ក្រសួងពាណិជ្ជកម្មកម្ពុជា & សមាគមលើកកម្ពស់ផលិតផល GI',
    authorityEn: 'Department of Intellectual Property / Ministry of Commerce',
    badgeLabel: 'GI Protected Origin Cambodia',
    icon: '🗺️',
    tag: 'Geographical Indication',
    defaultCertNumber: 'GI-CAM-MOC-2026-0042'
  },
  {
    id: 'coraa-organic',
    category: 'organic',
    nameKh: 'វិញ្ញាបនបត្រកសិកម្មសរីរាង្គកម្ពុជា (COrAA / MAFF Organic)',
    nameEn: 'Cambodian Organic Agriculture Association (COrAA Organic)',
    code: 'COrAA Standard / MAFF Organic',
    authorityKh: 'សមាគមកសិកម្មសរីរាង្គកម្ពុជា (COrAA) & ក្រសួងកសិកម្ម',
    authorityEn: 'Cambodian Organic Agriculture Association (COrAA)',
    badgeLabel: 'COrAA 100% Organic',
    icon: '🍃',
    tag: 'Cambodia Organic Standard',
    defaultCertNumber: 'COrAA-ORG-KH-2026-1184'
  },
  {
    id: 'jas-organic',
    category: 'organic',
    nameKh: 'ស្តង់ដារកសិកម្មសរីរាង្គជប៉ុន JAS Organic (有機JAS Standard)',
    nameEn: 'Japanese Agricultural Standard Organic (JAS 有機JAS / MAFF Japan)',
    code: 'JAS Organic / 有機JAS (MAFF Japan)',
    authorityKh: 'ក្រសួងកសិកម្ម រុក្ខាប្រមាញ់ និងនេសាទជប៉ុន (MAFF Japan) & ស្ថាប័នបញ្ជាក់ស្របច្បាប់',
    authorityEn: 'Ministry of Agriculture, Forestry and Fisheries of Japan (MAFF) & Accredited Certifier',
    badgeLabel: 'JAS Organic (有機JAS)',
    icon: '🇯🇵',
    tag: 'Japan Market Export',
    defaultCertNumber: 'JAS-ORG-JP-2026-8902'
  },
  {
    id: 'eu-organic',
    category: 'organic',
    nameKh: 'ស្តង់ដារកសិកម្មសរីរាង្គសហភាពអឺរ៉ុប EU Organic (Euro-Leaf / Reg. 2018/848)',
    nameEn: 'European Union Organic Agriculture (Euro-Leaf / Regulation EU 2018/848)',
    code: 'EU Organic / Reg. (EU) 2018/848',
    authorityKh: 'គណៈកម្មការអឺរ៉ុប (European Commission DG AGRI) / Ecocert / Control Union',
    authorityEn: 'European Union Directorate-General for Agriculture (DG AGRI) & Accredited CB',
    badgeLabel: 'EU Organic (Euro-Leaf)',
    icon: '🇪🇺',
    tag: 'EU Market Export',
    defaultCertNumber: 'KH-BIO-149 / ECOCERT-EU-2026-442'
  },
  {
    id: 'usda-nop-organic',
    category: 'organic',
    nameKh: 'ស្តង់ដារកសិកម្មសរីរាង្គសហរដ្ឋអាមេរិក USDA NOP (7 CFR Part 205)',
    nameEn: 'USDA National Organic Program (NOP Certified / 7 CFR Part 205)',
    code: 'USDA NOP / 7 CFR Part 205',
    authorityKh: 'ក្រសួងកសិកម្មសហរដ្ឋអាមេរិក (USDA NOP) / ស្ថាប័នបញ្ជាក់ទទួលស្គាល់ NOP',
    authorityEn: 'USDA Agricultural Marketing Service (National Organic Program Accredited)',
    badgeLabel: 'USDA Organic (NOP)',
    icon: '🇺🇸',
    tag: 'USA Market Export',
    defaultCertNumber: 'USDA-NOP-KH-2026-1938'
  },
  {
    id: 'fairtrade-certified',
    category: 'specialty',
    nameKh: 'វិញ្ញាបនបត្រពាណិជ្ជកម្មយុត្តិធម៌ (Fairtrade Certified)',
    nameEn: 'Fairtrade International Certified',
    code: 'FLO-CERT Fairtrade Standard',
    authorityKh: 'Fairtrade International / FLO-CERT',
    authorityEn: 'Fairtrade Labelling Organizations International',
    badgeLabel: 'Fairtrade Certified Sourcing',
    icon: '🤝',
    tag: 'Ethical Smallholder',
    defaultCertNumber: 'FLO-ID-2026-55910'
  }
];

export interface RecycleOption {
  id: string;
  nameKh: string;
  nameEn: string;
  symbol: string;
  tag: string;
  resinCode: string;
  labelSnippet: string;
}

export const RECYCLE_BADGE_OPTIONS: RecycleOption[] = [
  {
    id: 'pp-05',
    nameKh: 'ជ័រ PP 05 អាចកែច្នៃឡើងវិញបាន (Food Grade PP 05 Polypropylene)',
    nameEn: 'PP 05 Food Grade Recyclable Resin',
    symbol: '♷',
    tag: 'PP 05',
    resinCode: '05 PP',
    labelSnippet: '♷ PP 05 • FOOD GRADE • 100% RECYCLABLE / ជ័រ PP សុវត្ថិភាពម្ហូបអាហារ'
  },
  {
    id: 'pet-01',
    nameKh: 'ជ័រ PET 01 អាចកែច្នៃឡើងវិញបាន (PET 01 Clear Bottle / Jar)',
    nameEn: 'PET 01 Recyclable Polyethylene Terephthalate',
    symbol: '♳',
    tag: 'PET 01',
    resinCode: '01 PET',
    labelSnippet: '♳ PET 01 • RECYCLABLE / ជ័រ PET កែច្នៃបាន'
  },
  {
    id: 'hdpe-02',
    nameKh: 'ជ័រ HDPE 02 (High-Density Polyethylene Tub)',
    nameEn: 'HDPE 02 Recyclable Tub / Canister',
    symbol: '♴',
    tag: 'HDPE 02',
    resinCode: '02 HDPE',
    labelSnippet: '♴ HDPE 02 • RECYCLABLE / ជ័រ HDPE កែច្នៃបាន'
  },
  {
    id: 'mobius-loop',
    nameKh: 'និមិត្តសញ្ញាកែច្នៃឡើងវិញទូទៅ (Universal Mobius Loop Recycle)',
    nameEn: 'Universal Mobius Loop Recyclable Packaging',
    symbol: '♻️',
    tag: 'Recyclable',
    resinCode: 'RECYCLE',
    labelSnippet: '♻️ PLEASE RECYCLE PACKAGING / សូមចូលរួមញែក និងកែច្នៃការវេចខ្ចប់'
  },
  {
    id: 'tidyman',
    nameKh: 'និមិត្តសញ្ញាបោះសំរាមក្នុងធុង (Tidyman - Keep Country Clean)',
    nameEn: 'Keep Clean Tidyman Symbol',
    symbol: '🚮',
    tag: 'Keep Clean',
    resinCode: 'TIDYMAN',
    labelSnippet: '🚮 សូមបោះសំរាមក្នុងធុង (Keep Cambodia Clean • Dispose Properly)'
  },
  {
    id: 'alu-foil-barrier',
    nameKh: 'ថង់អាលុយមីញ៉ូមទប់សំណើមខ្ពស់ (Alu-Foil Barrier Laminate)',
    nameEn: 'Tri-Laminate High Barrier Foil Packaging',
    symbol: '♹',
    tag: 'OTHER 07',
    resinCode: '07 OTHER',
    labelSnippet: '♹ OTHER (PET/AL/PE) • HIGH OXYGEN & MOISTURE BARRIER'
  }
];

export interface SocialSloganOption {
  id: string;
  category: 'anti_drug' | 'support_local' | 'environment' | 'food_safety' | 'farmer';
  nameKh: string;
  nameEn: string;
  icon: string;
  sloganKh: string;
  sloganEn: string;
}

export const SOCIAL_SLOGAN_OPTIONS: SocialSloganOption[] = [
  {
    id: 'anti_drug',
    category: 'anti_drug',
    nameKh: 'សារអប់រំគ្មានគ្រឿងញៀន (Say No to Drugs Campaign)',
    nameEn: 'Anti-Drug & Drug-Free Community National Campaign',
    icon: '🚫',
    sloganKh: 'ចូលរួមទាំងអស់គ្នាដើម្បីជីវិត និងសហគមន៍គ្មានគ្រឿងញៀន!',
    sloganEn: 'Together for a Drug-Free Life & Community (Say No to Drugs)'
  },
  {
    id: 'support_khmer',
    category: 'support_local',
    nameKh: 'គាំទ្រផលិតផលខ្មែរ (Proudly Support Cambodian Products)',
    nameEn: 'Proudly Made in Cambodia • Support Khmer Products',
    icon: '🇰🇭',
    sloganKh: 'ចូលរួមគាំទ្រ និងប្រើប្រាស់កសិផលខ្មែរ ដើម្បីសេដ្ឋកិច្ចជាតិ!',
    sloganEn: 'Proudly Supporting Cambodian Farmers & Local Production'
  },
  {
    id: 'environment_green',
    category: 'environment',
    nameKh: 'ថែរក្សាបរិស្ថាន (Environmental Protection & Green Earth)',
    nameEn: 'Environmental Protection & Sustainable Future',
    icon: '🌿',
    sloganKh: 'រួមគ្នាថែរក្សាបរិស្ថាន និងការពារធនធានធម្មជាតិ ដើម្បីភពផែនដីបៃតង!',
    sloganEn: 'Protect Our Environment & Preserve Green Natural Resources'
  },
  {
    id: 'safe_food',
    category: 'food_safety',
    nameKh: 'សុវត្ថិភាពចំណីអាហារ (Safe Food for Good Health)',
    nameEn: 'Safe Food & Nutrition for a Healthier Generation',
    icon: '🛡️',
    sloganKh: 'សុខភាពល្អ និងអនាគតភ្លឺស្វាង ផ្តើមចេញពីចំណីអាហារមានសុវត្ថិភាព!',
    sloganEn: 'Good Health & Vitality Start with Safe, Certified Nutrition'
  },
  {
    id: 'farmer_empowerment',
    category: 'farmer',
    nameKh: 'លើកកម្ពស់កសិករខ្នាតតូច (Empowering Smallholder Farmers)',
    nameEn: 'Empowering Cambodian Smallholder Farming Families',
    icon: '🌾',
    sloganKh: 'រាល់ការទិញរបស់លោកអ្នក ចូលរួមលើកកម្ពស់ជីវភាពកសិករស្វាយចន្ទីកម្ពុជា!',
    sloganEn: 'Every purchase empowers Cambodian smallholder farmer livelihoods'
  }
];


export const NET_WEIGHT_VOLUME_PRESETS = [
  // Grams (g) - Micro Single-Serve & Sachet Sizes (e.g. 12g Cashew Butter Sachet, 10g Dip, 15g Squeeze pack)
  { label: '១០g (កញ្ចប់តូច / 10g Mini Sachet)', value: '10 g ℮ (Net Wt. 0.35 oz)', unit: 'g', type: 'weight' },
  { label: '១២g (កញ្ចប់ប័រ & ទឹកជ្រលក់ / 12g Butter Sauce Sachet)', value: '12 g ℮ (Net Wt. 0.42 oz)', unit: 'g', type: 'weight' },
  { label: '១៥g (កញ្ចប់ជ្រលក់ / 15g Single Dip)', value: '15 g ℮ (Net Wt. 0.53 oz)', unit: 'g', type: 'weight' },
  { label: '២០g (កញ្ចប់សម្រន់ / 20g Snack Sachet)', value: '20 g ℮ (Net Wt. 0.70 oz)', unit: 'g', type: 'weight' },
  { label: '២៥g (កញ្ចប់ហោប៉ៅ / 25g Pocket Pack)', value: '25 g ℮ (Net Wt. 0.88 oz)', unit: 'g', type: 'weight' },
  // Grams (g) - Small Snack, Sample & Retail Sizes
  { label: '៣៥g (កញ្ចប់តូច ១,០០០៛ / 35g Small Pack $0.25)', value: '35 g ℮ (Net Wt. 1.23 oz)', unit: 'g', type: 'weight' },
  { label: '៤៥g (ថង់ហោប៉ៅ / 45g Snack Pouch)', value: '45 g ℮ (Net Wt. 1.58 oz)', unit: 'g', type: 'weight' },
  { label: '៥០g (កញ្ចប់គំរូ / 50g Sample)', value: '50 g ℮ (Net Wt. 1.76 oz)', unit: 'g', type: 'weight' },
  { label: '១០០g (កញ្ចប់ស្តង់ដារ / 100g Pack)', value: '100 g ℮ (Net Wt. 3.5 oz)', unit: 'g', type: 'weight' },
  { label: '១៥០g (ធុង ឬ ថង់ / 150g Tub Pouch)', value: '150 g ℮ (Net Wt. 5.29 oz)', unit: 'g', type: 'weight' },
  { label: '១៨០g (កំប៉ុងកែវ / 180g Glass Jar)', value: '180 g ℮ (Net Wt. 6.35 oz)', unit: 'g', type: 'weight' },
  { label: '២០០g (កំប៉ុងស្តង់ដារ / 200g Standard Jar)', value: '200 g ℮ (Net Wt. 7.05 oz)', unit: 'g', type: 'weight' },
  { label: '២៥០g (ថង់ឈរ / 250g Pouch)', value: '250 g ℮ (Net Wt. 8.8 oz)', unit: 'g', type: 'weight' },
  { label: '៣០០g (កំប៉ុង PET / 300g PET Canister)', value: '300 g ℮ (Net Wt. 10.58 oz)', unit: 'g', type: 'weight' },
  { label: '៣៥០g (កំប៉ុងកែវ / 350g Glass Jar)', value: '350 g ℮ (Net Wt. 12.3 oz)', unit: 'g', type: 'weight' },
  { label: '៥០០g (ធុង ឬ ថង់ / 500g Retail Tub Pouch)', value: '500 g ℮ (Net Wt. 17.6 oz)', unit: 'g', type: 'weight' },
  // Kilograms (kg)
  { label: '១ kg (ថង់គ្រួសារ / 1kg Family Bag)', value: '1 kg ℮ (2.20 lbs)', unit: 'kg', type: 'weight' },
  { label: '២ kg (កញ្ចប់ធំ / 2kg Club Pack)', value: '2 kg ℮ (4.41 lbs)', unit: 'kg', type: 'weight' },
  { label: '៥ kg (ធុងផ្គត់ផ្គង់ / 5kg Catering Tub)', value: '5 kg ℮ (11.02 lbs)', unit: 'kg', type: 'weight' },
  { label: '១០ kg (បាវពាណិជ្ជកម្ម / 10kg Commercial Sack)', value: '10 kg ℮ (22.05 lbs)', unit: 'kg', type: 'weight' },
  { label: '២០ kg (បាវ B2B / 20kg B2B Sack)', value: '20 kg ℮ (44.09 lbs)', unit: 'kg', type: 'weight' },
  { label: '២៥ kg (បាវឧស្សាហកម្ម / 25kg Industrial Sack)', value: '25 kg ℮ (55.12 lbs)', unit: 'kg', type: 'weight' },
  // Milliliters (ml / mL) & Liters (L) for liquid/extracts/pastes
  { label: '១០ ml (កញ្ចប់ជ្រលក់ / 10ml Sachet Dip)', value: '10 ml ℮ (0.34 fl oz)', unit: 'ml', type: 'volume' },
  { label: '១៥ ml (កញ្ចប់ច្របាច់ / 15ml Single Squeeze)', value: '15 ml ℮ (0.51 fl oz)', unit: 'ml', type: 'volume' },
  { label: '៣០ ml (ដបតូច / 30ml Mini Bottle)', value: '30 ml ℮ (1.01 fl oz)', unit: 'ml', type: 'volume' },
  { label: '៥០ ml (ដបគំរូ & ប្រេង / 50ml Sample Oil)', value: '50 ml ℮ (1.69 fl oz)', unit: 'ml', type: 'volume' },
  { label: '១០០ ml (ដបទឹកជ្រលក់ / 100ml Sauce Bottle)', value: '100 ml ℮ (3.38 fl oz)', unit: 'ml', type: 'volume' },
  { label: '១៥០ ml (កំប៉ុងតូច / 150ml Small Jar)', value: '150 ml ℮ (5.07 fl oz)', unit: 'ml', type: 'volume' },
  { label: '២៥០ ml (ដបកែវ / 250ml Glass Bottle)', value: '250 ml ℮ (8.45 fl oz)', unit: 'ml', type: 'volume' },
  { label: '៣៣០ ml (កំប៉ុង ឬ ដប / 330ml Can Bottle)', value: '330 ml ℮ (11.16 fl oz)', unit: 'ml', type: 'volume' },
  { label: '៥០០ ml (ដបភេសជ្ជៈ / 500ml Liquid Drink)', value: '500 ml ℮ (16.9 fl oz)', unit: 'ml', type: 'volume' },
  { label: '៧៥០ ml (ដបប្រណិត / 750ml Gourmet Bottle)', value: '750 ml ℮ (25.36 fl oz)', unit: 'ml', type: 'volume' },
  { label: '១០០០ ml / ១ L (ដប ១លីត្រ / 1 Liter Milk Juice)', value: '1000 ml ℮ (1 Liter / 33.8 fl oz)', unit: 'ml', type: 'volume' },
  { label: '២ លីត្រ (ធុងធំ / 2 Liters Bulk Jug)', value: '2 L ℮ (67.6 fl oz)', unit: 'L', type: 'volume' },
  { label: '៥ លីត្រ (ធុងពាណិជ្ជកម្ម / 5 Liters Commercial Jug)', value: '5 L ℮ (1.32 Gallons)', unit: 'L', type: 'volume' }
];

export interface AiDesignStylePreset {
  id: string;
  name: string;
  nameKhmer: string;
  description: string;
  theme: 'supermarket-clean' | 'artisan-kraft' | 'premium-black' | 'modern-green';
  bgGradient: string;
  borderStyle: string;
  accentColor: string;
  fontBadge: string;
  badgePills: string[];
  bannerCallout: string;
  sampleBrand: string;
}

export const AI_DESIGN_PRESETS: AiDesignStylePreset[] = [
  {
    id: 'aeon-clean-gold',
    name: 'Modern Supermarket Gold (Aeon & Lucky Spec)',
    nameKhmer: 'ម៉ូតផ្សារទំនើបទំនើបពណ៌មាស (ស្តង់ដារ អ៊ីអន & ឡាក់គី)',
    description: 'High-contrast clean white label with elegant gold framing, bold bilingual typography, and prominent nutritional callouts.',
    theme: 'supermarket-clean',
    bgGradient: 'from-amber-500/10 via-white to-amber-50',
    borderStyle: 'border-amber-400',
    accentColor: '#d97706',
    fontBadge: 'Supermarket Grade A',
    badgePills: ['100% Cambodian Pure', 'Stone Milled 200 Mesh', 'Zero Trans Fat', 'Plant Protein 18g', 'Keto & Vegan'],
    bannerCallout: '✦ PREMIUM EXPORT QUALITY ✦',
    sampleBrand: 'MAYANY • GOLD RESERVE'
  },
  {
    id: 'organic-artisan-kraft',
    name: 'Eco Artisan Kraft (Natural Organic Vibe)',
    nameKhmer: 'ម៉ូតក្រដាសក្រាហ្វធម្មជាតិ (កសិផលសរីរាង្គបុរាណ)',
    description: 'Earthy unbleached kraft paper finish, woodcut botanical illustrations, and artisan farm-to-table messaging.',
    theme: 'artisan-kraft',
    bgGradient: 'from-[#ebd7bf] via-[#f5ede3] to-[#e4cbaf]',
    borderStyle: 'border-[#b89569]',
    accentColor: '#92400e',
    fontBadge: 'Eco Organic Farmstead',
    badgePills: ['Farm Gate Direct', 'Pesticide-Free', 'Single Origin', 'Sun-Dried & Roasted', 'Solar Powered Milling'],
    bannerCallout: '✦ 100% NATURAL & UNREFINED ✦',
    sampleBrand: 'MAYANY • ARTISAN HARVEST'
  },
  {
    id: 'luxury-black-gold',
    name: 'Luxury Gourmet Black & Gold (Duty-Free & Export)',
    nameKhmer: 'ម៉ូតប្រណីតខ្មៅមាស (សម្រាប់ Duty-Free & ទីផ្សារនាំចេញ)',
    description: 'Ultra-luxurious matte obsidian canvas with metallic gold accents, minimalist typography, and high-end boutique appeal.',
    theme: 'premium-black',
    bgGradient: 'from-slate-950 via-slate-900 to-amber-950',
    borderStyle: 'border-amber-500',
    accentColor: '#f59e0b',
    fontBadge: 'Gourmet Grand Cru',
    badgePills: ['Jumbo Kernel Grade', 'Hand Selected', 'Export Certified', 'Zero Additives', 'Master Roasted'],
    bannerCallout: '✦ SOVEREIGN CAMBODIAN RESERVE ✦',
    sampleBrand: 'MAYANY • NOIR COLLECTION'
  },
  {
    id: 'vitality-modern-green',
    name: 'Vitality Emerald Botanic (Health & Wellness)',
    nameKhmer: 'ម៉ូតបៃតងត្បូងមរកត (សម្រាប់ផលិតផលសុខភាព & អាហារូបត្ថម្ភ)',
    description: 'Lush botanical green accents emphasizing plant-based protein, antioxidant vitality, and clean living wellness.',
    theme: 'modern-green',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    borderStyle: 'border-emerald-500',
    accentColor: '#10b981',
    fontBadge: 'Plant Vitality Active',
    badgePills: ['High Plant Protein', 'Gluten-Free Verified', 'Rich in Magnesium & Zinc', 'Heart-Healthy Fats', 'Superfood Daily'],
    bannerCallout: '✦ PURE BOTANICAL NUTRITION ✦',
    sampleBrand: 'MAYANY • BOTANIC VITALITY'
  }
];

export type DateMarkingScheme = 
  | 'cs001_standard'
  | 'export_bbd'
  | 'export_full_3dates'
  | 'export_eu_uk'
  | 'export_usa'
  | 'export_japan'
  | 'export_korea'
  | 'export_china'
  | 'export_australia'
  | 'export_gso_middle_east';

export interface DateMarkingOption {
  id: DateMarkingScheme;
  label: string;
  flag: string;
  targetMarket: string;
  standardCode: string;
  sampleFormat: string;
  guidelineKhmer: string;
  dateFields: {
    showMfd: boolean;
    showExp: boolean;
    showBbd: boolean;
    showPkd: boolean;
    showShelfLifeMonths: boolean;
  };
}

export const DATE_MARKING_SCHEME_OPTIONS: DateMarkingOption[] = [
  {
    id: 'cs001_standard',
    label: 'កម្ពុជា CS 001:2000 (MFD + EXP)',
    flag: '🇰🇭',
    targetMarket: 'Cambodia Domestic & General Retail',
    standardCode: 'ISC CS 001:2000 Rule 4.4',
    sampleFormat: 'MFD: 16/08/2026 | EXP: 16/02/2028',
    guidelineKhmer: 'ស្តង់ដារជាតិកម្ពុជា៖ តម្រូវឱ្យបង្ហាញ "ថ្ងៃខែឆ្នាំផលិត (MFD)" និង "កាលបរិច្ឆេទផុតកំណត់ (EXP)" ជាភាសាខ្មែរ និងអង់គ្លេស។',
    dateFields: { showMfd: true, showExp: true, showBbd: false, showPkd: false, showShelfLifeMonths: false }
  },
  {
    id: 'export_bbd',
    label: 'នាំចេញសកល Codex BBD (MFD + Best Before)',
    flag: '🌐',
    targetMarket: 'Global Export (Codex Alimentarius CXS 1-1985)',
    standardCode: 'Codex Stan 1-1985 / Rev. 2018',
    sampleFormat: 'MFD: 16/08/2026 | BEST BEFORE: 16/02/2028',
    guidelineKhmer: 'ស្តង់ដារចំណីអាហារពិភពលោក Codex សម្រាប់គ្រាប់ស្វាយចន្ទី & អាហារក្រៀម៖ ប្រើពាក្យ "Best Before" បញ្ជាក់ពីគុណភាព ភាពស្រួយ និងរសជាតិល្អឥតខ្ចោះ។',
    dateFields: { showMfd: true, showExp: false, showBbd: true, showPkd: false, showShelfLifeMonths: true }
  },
  {
    id: 'export_full_3dates',
    label: 'នាំចេញពេញលេញ ៣-កាលបរិច្ឆេទ (MFD + PKD + BBD + EXP)',
    flag: '⭐',
    targetMarket: 'Comprehensive Multi-Market Retailers & Importers',
    standardCode: 'Global Supermarket Best Practice',
    sampleFormat: 'MFD: 16/08/2026 | PKD: 17/08/2026 | BBD: 16/02/2028 | EXP: 16/08/2028',
    guidelineKhmer: 'ទម្រង់ពេញលេញបំផុតសម្រាប់អ្នកនាំចូលធំៗ៖ បង្ហាញថ្ងៃផលិត (កែច្នៃ), ថ្ងៃវេចខ្ចប់ (ច្រកកំប៉ុង), ថ្ងៃរក្សាគុណភាពល្អបំផុត និងថ្ងៃផុតកំណត់ចុងក្រោយ។',
    dateFields: { showMfd: true, showExp: true, showBbd: true, showPkd: true, showShelfLifeMonths: true }
  },
  {
    id: 'export_eu_uk',
    label: 'សហភាពអឺរ៉ុប & ចក្រភពអង់គ្លេស (EU 1169/2011)',
    flag: '🇪🇺 🇬🇧',
    targetMarket: 'European Union & United Kingdom',
    standardCode: 'EU Regulation No 1169/2011',
    sampleFormat: 'BEST BEFORE END: 02/2028 | LOT: LOT-2026-KT-0816',
    guidelineKhmer: 'ច្បាប់សហភាពអឺរ៉ុប៖ សម្រាប់ផលិតផលរក្សាទុកបានលើសពី ៣ខែ ត្រូវប្រើ "Best Before End: MM/YYYY" រួមជាមួយលេខសម្គាល់ឡូត៍ (Lot Code)។',
    dateFields: { showMfd: true, showExp: false, showBbd: true, showPkd: false, showShelfLifeMonths: true }
  },
  {
    id: 'export_usa',
    label: 'សហរដ្ឋអាមេរិក (US FDA & USDA)',
    flag: '🇺🇸',
    targetMarket: 'United States Food & Drug Administration',
    standardCode: 'US FDA 21 CFR 101.9 / USDA FSIS',
    sampleFormat: 'MFG: 08/16/2026 | BEST IF USED BY: 02/16/2028',
    guidelineKhmer: 'ស្តង់ដារទីផ្សារអាមេរិក៖ ណែនាំឱ្យប្រើឃ្លា "Best If Used By" ដើម្បីបញ្ជាក់ពីគុណភាពខ្ពស់បំផុត និងកាត់បន្ថយកាកសំណល់ម្ហូបអាហារ។',
    dateFields: { showMfd: true, showExp: false, showBbd: true, showPkd: false, showShelfLifeMonths: true }
  },
  {
    id: 'export_japan',
    label: 'ប្រទេសជប៉ុន (Japan JAS / CAA)',
    flag: '🇯🇵',
    targetMarket: 'Japan Consumer Affairs Agency & JAS',
    standardCode: 'Japan Food Labeling Standard 2015',
    sampleFormat: '製造年月日: 2026.08.16 | 賞味期限: 2028.02.16',
    guidelineKhmer: 'ស្តង់ដារប្រទេសជប៉ុន៖ ប្រើពាក្យ "賞味期限" (Shomikigen = Best Before) សម្រាប់គ្រាប់ស្វាយចន្ទី និងអាហារកែច្នៃ ព្រមទាំងថ្ងៃផលិត "製造年月日"។',
    dateFields: { showMfd: true, showExp: false, showBbd: true, showPkd: false, showShelfLifeMonths: true }
  },
  {
    id: 'export_korea',
    label: 'ប្រទេសកូរ៉េខាងត្បូង (South Korea MFDS)',
    flag: '🇰🇷',
    targetMarket: 'Ministry of Food and Drug Safety Korea',
    standardCode: 'Korea Food Code 2023 Revision',
    sampleFormat: '제조일자: 2026.08.16 | 소비기한: 2028.02.16',
    guidelineKhmer: 'ច្បាប់ថ្មីកូរ៉េខាងត្បូង៖ អនុវត្តពាក្យ "소비기한" (Use-by Date) ជំនួសឱ្យពាក្យចាស់ រួមជាមួយថ្ងៃផលិត "제조일자"។',
    dateFields: { showMfd: true, showExp: true, showBbd: false, showPkd: false, showShelfLifeMonths: true }
  },
  {
    id: 'export_china',
    label: 'ប្រទេសចិន (China GB 7718)',
    flag: '🇨🇳',
    targetMarket: 'China National Food Safety Standard',
    standardCode: 'GB 7718-2011 General Standard',
    sampleFormat: '生产日期: 2026/08/16 | 保质期至: 2028/02/16 (18个月)',
    guidelineKhmer: 'ស្តង់ដារជាតិចិន GB 7718៖ តម្រូវឱ្យបោះពុម្ព "生产日期" (Production Date) យ៉ាងច្បាស់ និង "保质期至" (Best Before Date) ឬរយៈពេលរក្សាទុក (保质期 18个月)។',
    dateFields: { showMfd: true, showExp: true, showBbd: true, showPkd: false, showShelfLifeMonths: true }
  },
  {
    id: 'export_australia',
    label: 'អូស្ត្រាលី & នូវែលហ្សេឡង់ (FSANZ Code)',
    flag: '🇦🇺 🇳🇿',
    targetMarket: 'Food Standards Australia New Zealand',
    standardCode: 'FSANZ Standard 1.2.5',
    sampleFormat: 'PACKED ON: 17/08/2026 | BEST BEFORE: 16/02/2028',
    guidelineKhmer: 'ស្តង់ដារអូស្ត្រាលី៖ តម្រូវឱ្យប្រើ "Best Before: DD/MM/YYYY" សម្រាប់អាហារដែលរក្សាទុកលើស ២ឆ្នាំ ឬក្រោម ២ឆ្នាំ។',
    dateFields: { showMfd: true, showExp: false, showBbd: true, showPkd: true, showShelfLifeMonths: true }
  },
  {
    id: 'export_gso_middle_east',
    label: 'មជ្ឈិមបូព៌ា & ឈូងសមុទ្រ (GSO Halal Spec)',
    flag: '🇦🇪 🇸🇦',
    targetMarket: 'Gulf Cooperation Council (GCC/GSO)',
    standardCode: 'GSO 9:2013 Prepackaged Food',
    sampleFormat: 'PROD: 16/08/2026 | EXP: 16/02/2028',
    guidelineKhmer: 'ស្តង់ដារឈូងសមុទ្រអារ៉ាប់ GSO៖ តម្រូវឱ្យមានទាំងថ្ងៃផលិត (Production Date) និងថ្ងៃផុតកំណត់ (Expiry Date) ច្បាស់លាស់។',
    dateFields: { showMfd: true, showExp: true, showBbd: false, showPkd: false, showShelfLifeMonths: true }
  }
];

export const SHELF_LIFE_QUICK_PRESETS = [
  { labelKhmer: '៣ ខែ (3 Months)', months: 3, descKhmer: 'អាហារសម្រន់ស្រោបគ្រឿងស្រស់ មិនប្រើសារធាតុរក្សាទុក (Fresh Coated / Short Shelf Life)', tag: 'Fresh Snack' },
  { labelKhmer: '៦ ខែ (6 Months)', months: 6, descKhmer: 'អាហារសម្រន់ស្រោបគ្រឿង ឬកញ្ចប់ធម្មតា (Coated Cashew / Normal Pouch)', tag: 'Coated Kernel' },
  { labelKhmer: '៩ ខែ (9 Months)', months: 9, descKhmer: 'កញ្ចប់ Foil ធម្មតា ឬកំប៉ុងជ័រ PET បិទជិត (Standard Foil Bag)', tag: 'Foil Pouch' },
  { labelKhmer: '១២ ខែ / ១ ឆ្នាំ (12 Months / 1 Year)', months: 12, descKhmer: 'គ្រាប់លីងអំបិល ឬវេចខ្ចប់ក្នុងថង់ Foil ស្តង់ដារ (Roasted Salted / Standard Pouch)', tag: 'Standard Grade' },
  { labelKhmer: '១៤ ខែ (14 Months)', months: 14, descKhmer: 'គ្រាប់ស្វាយចន្ទីកែច្នៃស្រោបម្រេច ឬស្ករត្នោត វេចខ្ចប់ស្រទាប់ការពារសំណើម (Moisture Barrier)', tag: 'Premium Snack' },
  { labelKhmer: '១៨ ខែ / ១.៥ ឆ្នាំ (18 Months / 1.5 Years)', months: 18, descKhmer: 'កំប៉ុងបិទជិត ឬថង់បាញ់ឧស្ម័ននីត្រូហ្សែន (Nitrogen Flush / Export Grade)', tag: 'Export Nitrogen' },
  { labelKhmer: '២៤ ខែ / ២ ឆ្នាំ (24 Months / 2 Years)', months: 24, descKhmer: 'ដបកែវបូមខ្យល់ ឬកំប៉ុងដែកបិទជិតអនាម័យខ្ពស់ (Retort / Vacuum Tin Can)', tag: 'Long Life Retort' },
  { labelKhmer: '៣៦ ខែ / ៣ ឆ្នាំ (36 Months / 3 Years)', months: 36, descKhmer: 'ម្សៅគ្រាប់ស្វាយចន្ទី ឬផលិតផលកំប៉ុងក្រៀមពិសេស (Dry Cashew Powder / Dehydrated)', tag: 'Dry Powder' }
];

export function calculateDateWithMonths(baseDate: string, monthsToAdd: number): string {
  if (!baseDate || !baseDate.trim()) return '';
  const parts = baseDate.trim().split(/[/.-]/);
  if (parts.length !== 3) return '';
  let d = 0, m = 0, y = 0;
  if (parts[0].length === 4) {
    y = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
    d = parseInt(parts[2], 10);
  } else {
    d = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
    y = parseInt(parts[2], 10);
  }
  if (isNaN(d) || isNaN(m) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31) return '';
  const dt = new Date(y, m - 1, d);
  if (!isNaN(dt.getTime())) {
    dt.setMonth(dt.getMonth() + monthsToAdd);
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yy = dt.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }
  return '';
}

