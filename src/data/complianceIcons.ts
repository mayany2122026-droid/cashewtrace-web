export interface ComplianceIconOption {
  id: string;
  labelKh: string;
  labelEn: string;
  icon: string;
  descriptionKh: string;
  badgeText: string;
}

export const MISTI_COMPLIANCE_ICONS: ComplianceIconOption[] = [
  {
    id: 'recycle',
    labelKh: 'សូមកែច្នៃឡើងវិញ (Please Recycle)',
    labelEn: 'Please Recycle',
    icon: '♻️',
    descriptionKh: 'កញ្ចប់អាចកែច្នៃឡើងវិញបាន ជួយកាត់បន្ថយសំណល់ប្លាស្ទិក និងថែរក្សាបរិស្ថាន',
    badgeText: 'PLEASE RECYCLE • សូមកែច្នៃឡើងវិញ'
  },
  {
    id: 'anti_drug',
    labelKh: 'គ្មានគ្រឿងញៀន (Say No to Drugs)',
    labelEn: 'Say No to Drugs / Drug-Free',
    icon: '🚫',
    descriptionKh: 'ចូលរួមទាំងអស់គ្នាដើម្បីជីវិត និងសហគមន៍គ្មានគ្រឿងញៀន (យុទ្ធនាការជាតិ)',
    badgeText: 'DRUG-FREE COMMUNITY • គ្មានគ្រឿងញៀន'
  },
  {
    id: 'tidyman',
    labelKh: 'ទុកដាក់សំរាមឱ្យត្រឹមត្រូវ (Do Not Litter)',
    labelEn: 'Keep Clean / Do Not Litter',
    icon: '🚯',
    descriptionKh: 'សូមទុកដាក់កាកសំណល់ក្នុងធុងសំរាម ថែរក្សាអនាម័យសាធារណៈ',
    badgeText: 'KEEP CLEAN • ទុកដាក់សំរាមក្នុងធុង'
  },
  {
    id: 'food_grade',
    labelKh: 'សម្ភារៈកម្រិតម្ហូបអាហារ (Food Grade Packaging)',
    labelEn: 'Food Grade Material Safe',
    icon: '🍴',
    descriptionKh: 'កញ្ចប់វេចខ្ចប់ផលិតពីវត្ថុធាតុដើមកម្រិតម្ហូបអាហារមានសុវត្ថិភាព មិនបញ្ចេញជាតិពុល',
    badgeText: 'FOOD GRADE SAFE • សម្ភារៈកម្រិតចំណីអាហារ'
  },
  {
    id: 'no_chemicals',
    labelKh: 'គ្មានសារធាតុគីមី & រក្សាទុក (No Preservatives)',
    labelEn: 'No Preservatives / Chemical-Free',
    icon: '🛡️',
    descriptionKh: 'គ្មានបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន ឬពណ៌ក្លែងក្លាយ ស្របតាមស្តង់ដារម្ហូបអាហារ',
    badgeText: 'NO PRESERVATIVES • គ្មានសារធាតុគីមីរក្សាទុក'
  },
  {
    id: 'support_khmer',
    labelKh: 'គាំទ្រផលិតផលខ្មែរ (Support Cambodian Farmers)',
    labelEn: 'Support Cambodian Local Products',
    icon: '🇰🇭',
    descriptionKh: 'ចូលរួមគាំទ្រ និងប្រើប្រាស់កសិផលខ្មែរ ដើម្បីលើកកម្ពស់ជីវភាពកសិករ និងសេដ្ឋកិច្ចជាតិ',
    badgeText: 'SUPPORT CAMBODIAN FARMERS • គាំទ្រកសិផលខ្មែរ'
  },
  {
    id: 'halal',
    labelKh: 'ស្តង់ដារហាឡាល (Halal Compliance)',
    labelEn: 'Halal Certified Standard',
    icon: 'حلال',
    descriptionKh: 'ផលិតតាមគោលការណ៍អនាម័យខ្ពស់ ស្របតាមស្តង់ដារចំណីអាហារឥស្លាម',
    badgeText: 'HALAL COMPLIANT • ហាឡាល'
  },
  {
    id: 'natural_harvest',
    labelKh: 'ធម្មជាតិ ១០០% (100% Pure Natural)',
    labelEn: '100% Pure Natural Harvest',
    icon: '🌿',
    descriptionKh: 'កសិផលធម្មជាតិពិតប្រាកដ ប្រមូលផលផ្ទាល់ពីចម្ការកម្ពុជា',
    badgeText: '100% NATURAL • ធម្មជាតិ ១០០%'
  }
];

export const STORAGE_PRESET_OPTIONS = [
  {
    id: 'reseal_cool_dry',
    textKh: 'បិទមាត់ថង់ឱ្យជិតបន្ទាប់ពីបើករួច និងរក្សាទុកនៅកន្លែងត្រជាក់ ស្ងួត ជៀសវាងពន្លឺថ្ងៃ',
    textEn: 'Reseal bag after opening and store in cool, dry place away from direct sunlight',
    tag: 'ស្តង់ដារណែនាំខ្ពស់ (Recommended)'
  },
  {
    id: 'cool_dry_away_sun',
    textKh: 'រក្សាទុកនៅកន្លែងត្រជាក់ និងស្ងួត ជៀសវាងពន្លឺថ្ងៃ និងសំណើម',
    textEn: 'Store in a cool, dry place away from direct sunlight and moisture',
    tag: 'ទូទៅ (General Retail)'
  },
  {
    id: 'airtight_container',
    textKh: 'ក្រោយពេលបើកកញ្ចប់ សូមបិទមាត់ថង់ឱ្យជិត ឬច្រកក្នុងកំប៉ុងបិទជិត',
    textEn: 'After opening, reseal tightly or transfer to an airtight container',
    tag: 'សម្រាប់កំប៉ុង ឬថង់ (Jar/Pouch)'
  },
  {
    id: 'ambient_temp',
    textKh: 'រក្សាទុកក្នុងសីតុណ្ហភាពបន្ទប់ធម្មតា ជៀសវាងខ្យល់អាកាស និងកម្តៅ',
    textEn: 'Store at ambient room temperature, avoid airflow and heat exposure',
    tag: 'បន្ទប់ធម្មតា (Ambient)'
  }
];
