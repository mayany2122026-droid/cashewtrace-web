// Mayany Enterprise Authentic Packaging Product Descriptions
// Crafted specifically for Mayany Cashew Products following national food safety and CS 001 standards

export interface MayanyProductDescription {
  id: string;
  titleKh: string;
  titleEn: string;
  icon: string;
  category: 'cashew' | 'flour' | 'ww180' | 'spice_reference';
  descriptionKh: string;
  descriptionEn: string;
  combinedText: string;
  row1: string;
  row2: string;
  isReferenceOnly?: boolean;
}

export const MAYANY_PRODUCT_DESCRIPTIONS: MayanyProductDescription[] = [
  {
    id: 'mayany-roasted-pepper',
    titleKh: 'គ្រាប់ស្វាយចន្ទីលីងម្រេចខ្មៅកំពត GI',
    titleEn: 'Roasted Cashew Kernels with GI Kampot Black Pepper',
    icon: '🥜',
    category: 'cashew',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីផ្តល់នូវរសជាតិឈ្ងុយឆ្ងាញ់ធម្មជាតិ ស្រួយពិសេស និងប្រើប្រាស់ជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។',
    descriptionEn: 'Cashew nuts are made from high quality Cambodian cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Cashew nuts are used as a delicious, wholesome daily snack.',
    combinedText: 'Cashew nuts are made from high quality Cambodian cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Cashew nuts are used as a delicious, wholesome daily snack.\n\nគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីផ្តល់នូវរសជាតិឈ្ងុយឆ្ងាញ់ធម្មជាតិ ស្រួយពិសេស និងប្រើប្រាស់ជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។',
    row1: 'Selected Cambodian Cashews (Anacardium occidentale)',
    row2: 'Artisanal Protected GI Kampot Black Pepper Coated (Piper nigrum)'
  },
  {
    id: 'mayany-cashew-flour',
    titleKh: 'ម្សៅគ្រាប់ស្វាយចន្ទី',
    titleEn: '100% Pure Cashew Kernel Flour',
    icon: '🌾',
    category: 'flour',
    descriptionKh: 'ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ រាល់ដំណាក់កាលនៃការផលិតត្រូវបានយកចិត្តទុកដាក់ និងសម្រិតសម្រាំង ដើម្បីរក្សាបាននូវគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមគោលការណ៍សុវត្ថិភាពម្ហូបអាហារ។\n\nផលិតផលនេះ មិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។\n\nម្សៅគ្រាប់ស្វាយចន្ទីមានផ្ទុកប្រូតេអ៊ីន រួមជាមួយសារធាតុរ៉ែ និងសារធាតុចិញ្ចឹមជាច្រើន។ វាអាចប្រើប្រាស់ជាគ្រឿងផ្សំសម្រាប់ធ្វើនំ ភេសជ្ជៈ កាហ្វេ អាហារប្រចាំថ្ងៃ និងមុខម្ហូបផ្សេងៗ។ វាក៏អាចប្រើជាជម្រើសគ្រឿងផ្សំដែលមិនមែនជាផលិតផលទឹកដោះគោ សម្រាប់អ្នកដែលចៀសវាងផលិតផលទឹកដោះគោ ឬជ្រើសរើសអាហារដែលមានប្រភពពីរុក្ខជាតិ។',
    descriptionEn: 'Cashew kernel flour is made from premium cashews grown and deshelled in Kampong Thom province, Kingdom of Cambodia. Every stage of production is meticulously refined to ensure exceptional quality, safety, and hygiene in full compliance with food safety principles.\n\nThis product contains no added preservatives, no added aroma, and no added colors, preserving the authentic natural taste and pristine character of Cambodian cashew nuts.\n\nCashew flour is rich in plant-based protein, essential minerals, and vital micronutrients. It can be used as a versatile culinary ingredient for baking pastries, smoothies, coffee blends, daily healthy dishes, and culinary recipes. It also serves as a nutritious dairy-free alternative for individuals seeking lactose-free or plant-based nutrition.',
    combinedText: 'Cashew kernel flour is made from premium cashews grown and deshelled in Kampong Thom province, Kingdom of Cambodia. Every stage of production is meticulously refined to ensure exceptional quality, safety, and hygiene in full compliance with food safety principles, without preservatives, added aroma, or color.\n\nម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ មិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។',
    row1: '100% Pure Cashew Kernel Flour (Anacardium occidentale)',
    row2: '100% Natural, Pure Plant-Based Protein Flour'
  },
  {
    id: 'mayany-ww180-jumbo',
    titleKh: 'គ្រាប់ស្វាយចន្ទី WW180 គ្រាប់ធំពេញលេខមួយ',
    titleEn: 'Grade WW180 Jumbo Whole Cashews',
    icon: '🌟',
    category: 'ww180',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីលីងត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទី WW180 គុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីត្រូវបានប្រើប្រាស់ជាអាហារសម្រន់ប្រណិតធម្មជាតិប្រចាំថ្ងៃ។',
    descriptionEn: 'Roasted cashew nuts are made from high quality Grade WW180 jumbo cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Roasted cashews are enjoyed as a premium daily healthy snack.',
    combinedText: 'Roasted cashew nuts are made from high quality Grade WW180 jumbo cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Roasted cashews are enjoyed as a premium daily healthy snack.\n\nគ្រាប់ស្វាយចន្ទីលីងត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទី WW180 គុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីត្រូវបានប្រើប្រាស់ជាអាហារសម្រន់ប្រណិតធម្មជាតិប្រចាំថ្ងៃ។',
    row1: 'Grade WW180 Jumbo Cambodian Cashews (Anacardium occidentale)',
    row2: 'Crispy Roasted Wholes • Artisanal Seasoned'
  },
  {
    id: 'ringacam-chili-ref',
    titleKh: 'គំរូយោងម្សៅម្ទេស (Ringacam Enterprise G.D.G)',
    titleEn: 'Reference: Ringacam Enterprise Chili Powder',
    icon: '🌶️',
    category: 'spice_reference',
    isReferenceOnly: true,
    descriptionKh: 'ម្សៅម្ទេសផលិតចេញពីម្ទេសគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ ម្សៅម្ទេសត្រូវបានប្រើប្រាស់ជាសារធាតុបន្ថែមក្នុងម្ហូបអាហារប្រចាំថ្ងៃជាច្រើនមុខ។',
    descriptionEn: 'Chili powder is made from high quality, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Chili powder is used as an additive in many daily foods.',
    combinedText: 'Chili powder is made from high quality, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Chili powder is used as an additive in many daily foods.\n\nម្សៅម្ទេសផលិតចេញពីម្ទេសគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ ម្សៅម្ទេសត្រូវបានប្រើប្រាស់ជាសារធាតុបន្ថែមក្នុងម្ហូបអាហារប្រចាំថ្ងៃជាច្រើនមុខ។',
    row1: 'Natural Cambodian Chili Powder (Capsicum frutescens)',
    row2: 'G.D.G Authentic Spice Additive • Food Safety Refined'
  },
  {
    id: 'mayany-sugar-cashews',
    titleKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ',
    titleEn: 'Sugar coated cashew kernels',
    icon: '🥥',
    category: 'cashew',
    descriptionKh: 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបស្ករផ្តល់នូវរសជាតិឈ្ងុយឆ្ងាញ់ផ្អែមស្រាល ស្រួយពិសេស និងប្រើប្រាស់ជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។',
    descriptionEn: 'Sugar coated cashew kernels are made from high quality Cambodian cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Enjoyed as a delicious, wholesome sweet daily snack.',
    combinedText: 'Sugar coated cashew kernels are made from high quality Cambodian cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Enjoyed as a delicious, wholesome sweet daily snack.\n\nគ្រាប់ស្វាយចន្ទីស្រោបស្ករត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបស្ករផ្តល់នូវរសជាតិឈ្ងុយឆ្ងាញ់ផ្អែមស្រាល ស្រួយពិសេស និងប្រើប្រាស់ជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។',
    row1: 'Cambodian Cashews (Anacardium occidentale)',
    row2: 'Sugar coated cashew kernels'
  }
];

export interface ProductStoryBenefit {
  title: string;
  desc: string;
}

export interface MayanyProductStoryResult {
  title: string;
  story: string;
  paragraphs: string[];
  benefitsHeader: string;
  benefits: ProductStoryBenefit[];
  badges: string[];
}

export function getCashewKernelBenefits(langCode: string = 'en'): { benefitsHeader: string; benefits: ProductStoryBenefit[] } {
  const lang = (langCode || 'en').toLowerCase();
  switch (lang) {
    case 'kh':
    case 'km':
      return {
        benefitsHeader: 'អត្ថប្រយោជន៍សុខភាព & អាហារូបត្ថម្ភនៃការទទួលទានគ្រាប់ស្វាយចន្ទី',
        benefits: [
          { title: 'ប្រូតេអ៊ីនពីរុក្ខជាតិ', desc: 'គ្រាប់ស្វាយចន្ទីសម្បូរដោយប្រូតេអ៊ីនរុក្ខជាតិធម្មជាតិ ជួយទ្រទ្រង់ និងស្តារឡើងវិញនូវកោសិកាសាច់ដុំ។' },
          { title: 'ខ្លាញ់ល្អមិនឆ្អែត', desc: 'ផ្ទុកអាស៊ីតខ្លាញ់មិនឆ្អែតឯក និងពហុ (Oleic Acid) ដែលជួយដល់សុខភាពសរសៃឈាមបេះដូង និងកាត់បន្ថយខ្លាញ់មិនល្អ។' },
          { title: 'ម៉ាញេស្យូម និងទង់ដែង', desc: 'សារធាតុរ៉ែសំខាន់ៗជួយពង្រឹងឆ្អឹង ធ្មេញ ប្រព័ន្ធប្រសាទ និងការផលិតថាមពលក្នុងរាងកាយ។' },
          { title: 'គ្មានកូឡេស្តេរ៉ុល (០%)', desc: 'ជាអាហារសម្រន់សុខភាពធម្មជាតិគ្មានកូឡេស្តេរ៉ុល និងមានសន្ទស្សន៍ជាតិស្ករទាប (Low GI)។' },
          { title: 'សារធាតុប្រឆាំងអុកស៊ីតកម្ម និងវីតាមីន E', desc: 'សម្បូរវីតាមីន E, K និង Polyphenols ជួយពង្រឹងប្រព័ន្ធការពាររាងកាយ និងការពារកោសិកាពីភាពចាស់។' },
          { title: 'ជាតិសរសៃអាហារ', desc: 'ជួយសម្រួលដល់ប្រព័ន្ធរំលាយអាហារ រក្សាតុល្យភាពពោះវៀន និងផ្តល់អារម្មណ៍ឆ្អែតបានយូរ។' }
        ]
      };
    case 'ko':
    case 'kr':
      return {
        benefitsHeader: '캐슈넛 커널의 주요 영양 및 건강 효능:',
        benefits: [
          { title: '고품질 식물성 단백질', desc: '근육 생성과 세포 활력을 돕는 필수 아미노산이 풍부한 순수 식물성 단백질 공급원입니다.' },
          { title: '심장 건강에 좋은 불포화지방산', desc: '올레산 등 유익한 불포화지방산이 풍부하여 혈관 건강과 콜레스테롤 균형을 돕습니다.' },
          { title: '마그네슘 및 필수 구리', desc: '뼈 건강 증진, 신경계 안정 및 에너지 대사를 촉진하는 필수 미네랄이 가득합니다.' },
          { title: '무콜레스테롤 & 저혈당 지수(Low GI)', desc: '콜레스테롤 0%의 천연 건강 스낵으로 급격한 혈당 상승 없이 지속적인 에너지를 공급합니다.' },
          { title: '항산화 성분 및 비타민 E', desc: '폴리페놀과 비타민 E가 풍부하여 유해 활성산소를 억제하고 신체 면역력을 강화합니다.' },
          { title: '장 건강을 위한 풍부한 식이섬유', desc: '소화 작용을 원활하게 돕고 장내 유익균을 활성화하며 편안한 포만감을 유지합니다.' }
        ]
      };
    case 'de':
      return {
        benefitsHeader: 'Gesundheitliche & ernährungsphysiologische Vorteile:',
        benefits: [
          { title: 'Pflanzliches Eiweiß', desc: 'Reich an hochwertigem pflanzlichem Protein zur Unterstützung von Muskelaufbau und Zellregeneration.' },
          { title: 'Herzgesunde ungesättigte Fettsäuren', desc: 'Hoher Gehalt an Ölsäure zur Förderung eines gesunden Cholesterinspiegels und Herz-Kreislauf-Systems.' },
          { title: 'Magnesium & Kupfer', desc: 'Essenzielle Mineralstoffe für stabile Knochendichte, starke Nerven und gesunden Energiestoffwechsel.' },
          { title: '0% Cholesterin & Niedriger GI', desc: 'Von Natur aus cholesterinfrei mit niedrigem glykämischem Index für langanhaltende, gleichmäßige Energie.' },
          { title: 'Natürliche Antioxidantien & Vitamin E', desc: 'Schützt Körperzellen vor oxidativem Stress und stärkt die natürlichen Abwehrkräfte.' },
          { title: 'Wertvolle Ballaststoffe', desc: 'Fördert eine gesunde Verdauung, unterstützt die Darmflora und sorgt für ein anhaltendes Sättigungsgefühl.' }
        ]
      };
    case 'fr':
      return {
        benefitsHeader: 'Bienfaits nutritionnels et pour la santé :',
        benefits: [
          { title: 'Protéines végétales de qualité', desc: 'Riche en acides aminés essentiels pour soutenir la régénération musculaire et l’énergie corporelle.' },
          { title: 'Acides gras insaturés bienfaisants', desc: 'Excellente teneur en acide oléique favorisant l’équilibre cardiovasculaire et lipidique.' },
          { title: 'Magnésium et Cuivre essentiels', desc: 'Minéraux indispensables au maintien de l’ossature, à la vitalité nerveuse et au métabolisme énergétique.' },
          { title: '0% Cholestérol & Faible indice glycémique', desc: 'Collation saine naturellement sans cholestérol offrant une énergie diffuse et durable.' },
          { title: 'Antioxydants naturels & Vitamine E', desc: 'Protège les cellules contre le stress oxydatif et stimule les défenses immunitaires.' },
          { title: 'Fibres alimentaires bénéfiques', desc: 'Optimise le transit digestif, nourrit le microbiote intestinal et procure une satiété prolongée.' }
        ]
      };
    case 'zh':
      return {
        benefitsHeader: '腰果仁的核心健康与营养益处：',
        benefits: [
          { title: '优质植物蛋白', desc: '富含天然植物性蛋白质与必需氨基酸，有助于肌肉修复与身体活力维持。' },
          { title: '有益心血管的不饱和脂肪酸', desc: '富含高含量油酸与亚油酸，有助于改善血脂平衡与促进心血管健康。' },
          { title: '镁元素与微量铜元素', desc: '支持骨骼强韧、神经系统稳定及体内酶能量代谢的关键矿物质。' },
          { title: '零胆固醇与低升糖指数(Low GI)', desc: '天然无胆固醇，释放平稳持久能量，是理想的日常健康低负担佐食。' },
          { title: '天然抗氧化剂与维生素E', desc: '富含多酚类抗氧化物质与维生素E，有效清除自由基并增强机体免疫力。' },
          { title: '促进消化的膳食纤维', desc: '富含优质膳食纤维，改善肠道益生菌微生态平衡，维持长久饱腹感。' }
        ]
      };
    case 'ja':
      return {
        benefitsHeader: 'カシューナッツの主な栄養と健康効果：',
        benefits: [
          { title: '良質な植物性プロテイン', desc: '筋肉の修復と毎日の活力をサポートする良質な植物性タンパク質を豊富に含みます。' },
          { title: '心臓にやさしい不飽和脂肪酸', desc: 'オレイン酸をはじめとする良質な不飽和脂肪酸が血管の健康とコレステロールバランスを整えます。' },
          { title: 'マグネシウムと必須の銅', desc: '骨密度の維持、神経系の安定、エネルギー代謝に欠かせない重要ミネラルを豊富に含有。' },
          { title: 'コレステロールゼロ＆低GI', desc: 'コレステロール完全ゼロで低GI食品のため、急激な血糖値上昇を防ぎ持続的なエネルギーを提供。' },
          { title: '天然抗酸化成分とビタミンE', desc: 'ポリフェノールとビタミンEが活性酸素を抑制し、毎日の免疫力をサポートします。' },
          { title: '腸内環境を整える食物繊維', desc: '豊富に含まれる食物繊維がお腹の調子を整え、健康的な満腹感を維持します。' }
        ]
      };
    case 'nl':
      return {
        benefitsHeader: 'Gezondheids- en voedingsvoordelen:',
        benefits: [
          { title: 'Plantaardige eiwitten', desc: 'Rijk aan plantaardige eiwitten voor spierherstel en dagelijkse vitaliteit.' },
          { title: 'Hart-gezonde onverzadigde vetten', desc: 'Hoog gehalte aan oliezuur dat een gezonde bloedsomloop en cholesterolspiegel ondersteunt.' },
          { title: 'Magnesium & Koper', desc: 'Belangrijke mineralen voor sterke botten, zenuwstelsel en energiemetabolisme.' },
          { title: '0% Cholesterol & Lage GI', desc: 'Natuurlijk cholesterolvrij met een lage glykemische index voor langdurige, stabiele energie.' },
          { title: 'Antioxidanten & Vitamine E', desc: 'Beschermt lichaamscellen tegen oxidatieve stress en verhoogt natuurlijke weerstand.' },
          { title: 'Voedingsvezels', desc: 'Ondersteunt een evenwichtige spijsvertering en gezonde darmflora.' }
        ]
      };
    case 'vi':
      return {
        benefitsHeader: 'Lợi ích sức khỏe & dinh dưỡng từ hạt điều:',
        benefits: [
          { title: 'Protein thực vật dồi dào', desc: 'Cung cấp protein thực vật sạch giúp duy trì cơ bắp và năng lượng bền bỉ.' },
          { title: 'Chất béo không bão hòa tốt cho tim mạch', desc: 'Giàu axit oleic giúp cân bằng cholesterol và bảo vệ hệ tim mạch khỏe mạnh.' },
          { title: 'Magie & Đồng thiết yếu', desc: 'Khoáng chất quan trọng giúp xương chắc khỏe, ổn định thần kinh và trao đổi chất.' },
          { title: 'Không cholesterol & Chỉ số đường huyết thấp', desc: 'Món ăn vặt lành mạnh tự nhiên không chứa cholesterol, cung cấp năng lượng ổn định.' },
          { title: 'Chất chống oxy hóa & Vitamin E', desc: 'Chứa polyphenol giúp trung hòa gốc tự do và tăng cường sức đề kháng.' },
          { title: 'Chất xơ hỗ trợ tiêu hóa', desc: 'Hàm lượng chất xơ dồi dào giúp hỗ trợ hệ vi sinh đường ruột và tạo cảm giác no lâu.' }
        ]
      };
    case 'th':
      return {
        benefitsHeader: 'ประโยชน์ต่อสุขภาพและคุณค่าทางโภชนาการ:',
        benefits: [
          { title: 'โปรตีนจากพืชคุณภาพสูง', desc: 'อุดมด้วยโปรตีนจากพืชธรรมชาติ ช่วยเสริมสร้างและซ่อมแซมกล้ามเนื้อ' },
          { title: 'ไขมันไม่อิ่มตัวดีต่อหัวใจ', desc: 'อุดมด้วยกรดโอเลอิกที่ช่วยดูแลสุขภาพหลอดเลือดหัวใจและรักษาสมดุลคอเลสเตอรอล' },
          { title: 'แมกนีเซียมและทองแดงจำเป็น', desc: 'แร่ธาตุสำคัญช่วยเสริมสร้างความแข็งแรงของกระดูกและระบบประสาท' },
          { title: 'ปราศจากคอเลสเตอรอลและดัชนีน้ำตาลต่ำ', desc: 'ของว่างสุขภาพปราศจากคอเลสเตอรอล ให้พลังงานยาวนานอย่างต่อเนื่อง' },
          { title: 'สารต้านอนุมูลอิสระและวิตามินอี', desc: 'มีโพลีฟีนอลช่วยปกป้องเซลล์และเสริมสร้างระบบภูมิคุ้มกันร่างกาย' },
          { title: 'ใยอาหารช่วยระบบย่อยอาหาร', desc: 'ช่วยส่งเสริมการทำงานของระบบขับถ่ายและจุลินทรีย์ที่ดีในลำไส้' }
        ]
      };
    case 'en':
    default:
      return {
        benefitsHeader: 'Health & Nutritional Benefits of Cashew Kernels:',
        benefits: [
          { title: 'Plant-Based Protein', desc: 'Rich in clean plant protein that supports muscle repair, cellular vitality, and daily wellness.' },
          { title: 'Heart-Healthy Unsaturated Fats', desc: 'Loaded with oleic and linoleic essential fatty acids that actively support cardiovascular wellness.' },
          { title: 'Magnesium & Essential Copper', desc: 'Vital micronutrients for optimal nerve signaling, strong bone density, and enzymatic energy production.' },
          { title: 'Zero Cholesterol & Low GI', desc: 'Naturally 100% cholesterol-free snack with a low glycemic index, providing steady, sustained energy.' },
          { title: 'Antioxidants & Vitamin E', desc: 'Contains potent polyphenols and carotenoids that neutralize free radicals and strengthen immunity.' },
          { title: 'Dietary Fiber for Digestion', desc: 'High prebiotic dietary fiber that promotes balanced gut microbiome and sustained satiety.' }
        ]
      };
  }
}

export function getMayanyProductStory(
  productNameKh: string = '',
  productNameEn: string = '',
  langCode: string = 'en'
): MayanyProductStoryResult {
  const normKh = productNameKh.toLowerCase();
  const normEn = productNameEn.toLowerCase();

  const isFlour = normKh.includes('ម្សៅ') || normEn.includes('flour') || normEn.includes('powder');
  const isSugar = normKh.includes('ស្ករ') || normEn.includes('sugar');
  const isChili = normKh.includes('ម្ទេស') || normEn.includes('chili');
  const isPepper = normKh.includes('ម្រេច') || normEn.includes('pepper') || normKh.includes('កំពត');

  const lang = (langCode || 'en').toLowerCase();

  if (isFlour) {
    if (lang === 'kh' || lang === 'km') {
      const p1 = 'ម្សៅគ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីដែលដាំដុះ និងបកសំបកនៅក្នុងខេត្តកំពង់ធំ ព្រះរាជាណាចក្រកម្ពុជា។ រាល់ដំណាក់កាលនៃការផលិតត្រូវបានយកចិត្តទុកដាក់ និងសម្រិតសម្រាំង ដើម្បីរក្សាបាននូវគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមគោលការណ៍សុវត្ថិភាពម្ហូបអាហារ។';
      const p2 = 'ផលិតផលនេះ មិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន និងមិនបន្ថែមពណ៌ ដើម្បីរក្សារសជាតិ និងលក្ខណៈធម្មជាតិរបស់គ្រាប់ស្វាយចន្ទី។';
      const p3 = 'ម្សៅគ្រាប់ស្វាយចន្ទីមានផ្ទុកប្រូតេអ៊ីន រួមជាមួយសារធាតុរ៉ែ និងសារធាតុចិញ្ចឹមជាច្រើន។ វាអាចប្រើប្រាស់ជាគ្រឿងផ្សំសម្រាប់ធ្វើនំ ភេសជ្ជៈ កាហ្វេ អាហារប្រចាំថ្ងៃ និងមុខម្ហូបផ្សេងៗ។ វាក៏អាចប្រើជាជម្រើសគ្រឿងផ្សំដែលមិនមែនជាផលិតផលទឹកដោះគោ សម្រាប់អ្នកដែលចៀសវាងផលិតផលទឹកដោះគោ ឬជ្រើសរើសអាហារដែលមានប្រភពពីរុក្ខជាតិ។';
      return {
        title: 'ម្សៅគ្រាប់ស្វាយចន្ទីសុទ្ធ ១០០%',
        paragraphs: [p1, p2, p3],
        story: `${p1}\n\n${p2}\n\n${p3}`,
        benefitsHeader: 'អត្ថប្រយោជន៍នៃការទទួលទានគ្រាប់ស្វាយចន្ទី',
        benefits: [
          { title: 'ប្រូតេអ៊ីនពីរុក្ខជាតិ', desc: 'គ្រាប់ស្វាយចន្ទីមានផ្ទុកប្រូតេអ៊ីន ដែលជាសារធាតុចិញ្ចឹមសំខាន់សម្រាប់រាងកាយ និងការថែរក្សាសាច់ដុំ។' },
          { title: 'ខ្លាញ់មិនឆ្អែត', desc: 'គ្រាប់ស្វាយចន្ទីមានខ្លាញ់មិនឆ្អែតជាចម្បង ដែលជាផ្នែកមួយនៃរបបអាហារដែលមានតុល្យភាព។' },
          { title: 'ម៉ាញេស្យូម', desc: 'ជាសារធាតុរ៉ែដែលរាងកាយត្រូវការសម្រាប់មុខងារសាច់ដុំ ប្រព័ន្ធប្រសាទ ឆ្អឹង និងការបង្កើតថាមពល។' },
          { title: 'ទង់ដែង ស័ង្កសី និងជាតិដែក', desc: 'ជាសារធាតុរ៉ែសំខាន់ៗដែលចូលរួមក្នុងមុខងារផ្សេងៗរបស់រាងកាយ ដូចជា ប្រព័ន្ធភាពស៊ាំ ការបង្កើតកោសិកាឈាមក្រហម និងការរំលាយអាហារ។' },
          { title: 'ផូស្វ័រ', desc: 'ជួយគាំទ្រមុខងារធម្មតារបស់ឆ្អឹង និងធ្មេញ ព្រមទាំងដំណើរការផលិតថាមពលរបស់រាងកាយ។' },
          { title: 'វីតាមីន និងសារធាតុប្រឆាំងអុកស៊ីតកម្ម', desc: 'គ្រាប់ស្វាយចន្ទីមានផ្ទុកវីតាមីន និងសារធាតុប្រឆាំងអុកស៊ីតកម្មមួយចំនួន ដែលចូលរួមក្នុងការគាំទ្រសុខភាព និងការការពារកោសិកា។' },
          { title: 'គ្មានផលិតផលទឹកដោះគោ និងគ្មានជាតិឡាក់តូស', desc: 'ម្សៅគ្រាប់ស្វាយចន្ទីជាផលិតផលពីរុក្ខជាតិ និងមិនមានការបន្ថែមផលិតផលទឹកដោះគោ ឬឡាក់តូស។' },
          { title: 'ប្រើប្រាស់បានច្រើនមុខ', desc: 'អាចយកទៅប្រើក្នុងការធ្វើនំ ភេសជ្ជៈ កាហ្វេ ទឹកជ្រលក់ ស៊ុប និងការចម្អិនម្ហូបអាហារប្រចាំថ្ងៃ។' }
        ],
        badges: [
          'ដាំដុះ & បកសំបកនៅកំពង់ធំ',
          'គ្មានសារធាតុរក្សាទុក',
          'គ្មានបន្ថែមក្លិន',
          'គ្មានបន្ថែមពណ៌',
          'គ្មានជាតិឡាក់តូស',
          'ស្តង់ដារ CS 001'
        ]
      };
    }
    if (lang === 'ko' || lang === 'kr') {
      const p1 = '100% 순수 캐슈넛 가루는 캄보디아 왕국 캄퐁톰(Kampong Thom) 지역에서 재배되고 탈각된 프리미엄 캐슈넛으로 제조됩니다. 모든 생산 과정은 식품 안전 원칙에 따라 품질, 안전 및 위생을 철저히 유지하기 위해 세심하게 관리됩니다.';
      const p2 = '방부제, 인공 향료, 색소를 일체 첨가하지 않아 캄보디아 캐슈넛 본연의 고소한 풍미와 자연적인 특성을 그대로 보존합니다.';
      const p3 = '식물성 단백질, 필수 미네랄 및 풍부한 영양소를 함유하고 있어 제과제빵, 스무디, 커피, 일상 요리 및 소스에 다용도로 활용됩니다. 유제품을 피하거나 식물성 식단을 선호하는 분들을 위한 훌륭한 무유당(Lactose-free) 대안입니다.';
      return {
        title: '100% 순수 캐슈넛 가루 (100% Pure Cashew Kernel Flour)',
        paragraphs: [p1, p2, p3],
        story: `${p1}\n\n${p2}\n\n${p3}`,
        benefitsHeader: '캐슈넛 섭취의 주요 영양 및 건강 효능',
        benefits: [
          { title: '식물성 단백질', desc: '신체 활력과 근육 유지에 필수적인 양질의 식물성 단백질이 풍부합니다.' },
          { title: '불포화 지방산', desc: '균형 잡힌 식단에 필수적인 건강한 불포화 지방산을 함유하고 있습니다.' },
          { title: '마그네슘', desc: '근육과 신경 기능 유지, 뼈 건강 및 에너지 생성에 필요한 핵심 미네랄입니다.' },
          { title: '구리, 아연 및 철분', desc: '면역 체계 강화, 적혈구 생성 및 원활한 대사 작용을 돕는 필수 미네랄입니다.' },
          { title: '인 (Phosphorus)', desc: '뼈와 치아 건강을 지키고 신체 에너지 생성 과정을 지원합니다.' },
          { title: '비타민 및 항산화 성분', desc: '세포 보호와 전반적인 건강 증진을 돕는 천연 항산화 물질이 포함되어 있습니다.' },
          { title: '유제품 및 유당 불포함', desc: '100% 식물성 식품으로 유제품 및 유당이 없어 소화가 편안합니다.' },
          { title: '다양한 요리 활용도', desc: '베이킹, 음료, 커피 블렌딩, 건강 소스, 수프 등 일상 요리에 폭넓게 활용할 수 있습니다.' }
        ],
        badges: [
          '캄퐁톰 재배 및 탈각 (Kampong Thom)',
          '무방부제 (0% Preservatives)',
          '무인공향료 (No Added Aroma)',
          '무색소 (No Added Colors)',
          '락토스프리 (Dairy & Lactose-Free)',
          'CS 001 준수'
        ]
      };
    }
    if (lang === 'de') {
      const p1 = '100% reines Cashewmehl wird aus erstklassigen Cashews hergestellt, die in der Provinz Kampong Thom im Königreich Kambodscha angebaut und geschält werden. Alle Verarbeitungsstufen erfolgen mit größter Sorgfalt nach strengen Standards der Lebensmittelsicherheit und Hygiene.';
      const p2 = 'Ohne Zusatz von Konservierungsstoffen, ohne künstliche Aromen und ohne Farbstoffe – für den unverfälschten, natürlichen Geschmack kambodschanischer Cashews.';
      const p3 = 'Reich an pflanzlichem Protein, Mineralstoffen und wertvollen Nährstoffen. Hervorragend geeignet zum Backen, für Smoothies, Kaffee, Suppen und die tägliche Küche. Eine ideale laktosefreie und milchfreie Zutat für eine ausgewogene pflanzenbasierte Ernährung.';
      return {
        title: '100% Reines Cashewmehl (100% Pure Cashew Kernel Flour)',
        paragraphs: [p1, p2, p3],
        story: `${p1}\n\n${p2}\n\n${p3}`,
        benefitsHeader: 'Ernährungs- und Gesundheitsvorteile von Cashews',
        benefits: [
          { title: 'Pflanzliches Protein', desc: 'Reich an hochwertigem pflanzlichem Eiweiß für Muskelaufbau und Zellvitalität.' },
          { title: 'Ungesättigte Fettsäuren', desc: 'Hauptsächlich gesunde ungesättigte Fette als Teil einer ausgewogenen Ernährung.' },
          { title: 'Magnesium', desc: 'Unterstützt Muskelfunktion, Nervensystem, Knochengesundheit und Energiestoffwechsel.' },
          { title: 'Kupfer, Zink & Eisen', desc: 'Wichtige Spurenelemente für Immunsystem, Blutbildung und Vitalität.' },
          { title: 'Phosphor', desc: 'Fördert gesunde Knochen und Zähne sowie normale Energieproduktion.' },
          { title: 'Vitamine & Antioxidantien', desc: 'Schützt die Körperzellen vor oxidativem Stress.' },
          { title: 'Milchfrei & Laktosefrei', desc: '100% pflanzlich, ideal für vegane und laktosefreie Ernährung.' },
          { title: 'Vielseitige Verwendung', desc: 'Perfekt für Gebäck, Getränke, Kaffee, Saucen, Suppen und die tägliche Küche.' }
        ],
        badges: [
          'Kampong Thom Herkunft',
          'Ohne Konservierungsstoffe',
          'Ohne künstliche Aromen',
          'Ohne Farbstoffe',
          'Laktosefrei (Dairy-Free)',
          'Standard CS 001 konform'
        ]
      };
    }
    if (lang === 'zh' || lang === 'cn') {
      const p1 = '腰果仁纯粉精选柬埔寨王国磅同省（Kampong Thom）种植并去壳的优质腰果加工而成。严格把控每一道生产工艺，全面遵循食品安全与卫生标准。';
      const p2 = '本品无防腐剂、无添加香精、无添加人工色素，最大程度保留柬埔寨腰果天然清香与纯正本色。';
      const p3 = '腰果仁粉富含优质植物蛋白、多种微量矿物质和必需营养成分。可广泛用作烘焙西点、饮品冲调、咖啡伴侣、日常营养餐及各式料理的配料。亦是不耐乳糖或推崇植物基饮食人群理想的无乳制品优质选择。';
      return {
        title: '100% 纯腰果仁粉 (100% Pure Cashew Kernel Flour)',
        paragraphs: [p1, p2, p3],
        story: `${p1}\n\n${p2}\n\n${p3}`,
        benefitsHeader: '食用腰果仁粉的关键健康与营养益处',
        benefits: [
          { title: '优质植物蛋白', desc: '腰果富含优质植物蛋白，是人体体力恢复与肌肉健康的必需营养。' },
          { title: '不饱和健康脂肪', desc: '主要成分为优质不饱和脂肪酸，是均衡日常膳食的重要组成部分。' },
          { title: '镁元素 (Magnesium)', desc: '支持肌肉和神经系统正常功能、促进骨骼健康及能量代谢。' },
          { title: '铜、锌与铁元素', desc: '人体必需微量元素，参与免疫防御、红细胞生成及正常新陈代谢。' },
          { title: '磷元素 (Phosphorus)', desc: '有助于维护骨骼和牙齿结构健康，并支持机体自然能量合成。' },
          { title: '维生素与天然抗氧化物', desc: '天然蕴含抗氧化成分，助力细胞保护与机体充沛活力。' },
          { title: '无乳制品与无乳糖', desc: '100% 纯植物性食品，不含任何乳制品或乳糖，温和易消化。' },
          { title: '多用途烹饪烘焙', desc: '广泛适用于西点烘焙、果昔、咖啡调饮、酱汁、汤品及家常料理。' }
        ],
        badges: [
          '磅同省原产与脱壳 (Kampong Thom)',
          '0% 防腐剂 (No Preservatives)',
          '无添加香精 (No Added Aroma)',
          '无人工色素 (No Added Color)',
          '无乳制品与无乳糖 (Dairy-Free)',
          '符合 CS 001 标准'
        ]
      };
    }
    if (lang === 'ja' || lang === 'jp') {
      const p1 = '100% 純粋カシューナッツフラワーは、カンボジア王国コンポントム州で栽培・脱殻された最高級カシューナッツから製造されています。食品安全と衛生原則に基づき、すべての製造工程を徹底的に管理しています。';
      const p2 = '保存料、香料、着色料は一切添加しておらず、カシューナッツ本来の香ばしさと自然な風味をそのまま保持しています。';
      const p3 = '植物性プロテイン、ミネラル、豊富な栄養素を含み、製菓・ベーキング、スムージー、コーヒー、料理やスープの隠し味として幅広くお使いいただけます。乳製品を控えている方やプラントベース食を好む方にも最適な代替素材です。';
      return {
        title: '100% 純粋カシューナッツフラワー (100% Pure Cashew Kernel Flour)',
        paragraphs: [p1, p2, p3],
        story: `${p1}\n\n${p2}\n\n${p3}`,
        benefitsHeader: 'カシューナッツ摂取の主な栄養と健康効果',
        benefits: [
          { title: '植物性プロテイン', desc: '身体の健康維持や筋肉のサポートに不可欠な良質なたんぱく質が豊富です。' },
          { title: '不飽和脂肪酸', desc: 'バランスの取れた食生活に欠かせないヘルシーな良質脂肪酸を含みます。' },
          { title: 'マグネシウム', desc: '筋肉や神経の正常な働き、骨の健康、エネルギー生成に必須のミネラルです。' },
          { title: '銅・亜鉛・鉄分', desc: '免疫機能の維持、赤血球の形成、代謝を支える重要ミネラルです。' },
          { title: 'リン (Phosphorus)', desc: '骨や歯の健康維持とエネルギー代謝プロセスをサポートします。' },
          { title: 'ビタミン＆抗酸化物質', desc: '細胞を守り、健やかな若々しさを保つ天然成分が含まれています。' },
          { title: '乳製品・乳糖不使用', desc: '100% プラントベースで乳製品や乳糖（ラクトース）を含みません。' },
          { title: '多彩な料理への活用', desc: 'お菓子作り、スムージー、コーヒー、ソース、スープなど毎日の料理に。' }
        ],
        badges: [
          'コンポントム州産 (Kampong Thom)',
          '保存料ゼロ (0% Preservatives)',
          '香料無添加 (No Added Aroma)',
          '着色料無添加 (No Added Colors)',
          '乳製品フリー (Dairy & Lactose-Free)',
          'CS 001 規格準拠'
        ]
      };
    }
    if (lang === 'fr') {
      const p1 = 'La farine de noix de cajou pure est produite à partir de noix de cajou d’exception, cultivées et décortiquées dans la province de Kampong Thom, au Royaume du Cambodge. Chaque étape est minutieusement maîtrisée dans le respect strict des normes d’hygiène et de sécurité alimentaire.';
      const p2 = 'Ce produit est garanti sans conservateurs, sans arômes ajoutés et sans colorants artificiels, préservant ainsi la pureté et la saveur naturelle des noix de cajou du Cambodge.';
      const p3 = 'Riche en protéines végétales, minéraux et micronutriments essentiels, elle s’utilise pour les pâtisseries, smoothies, cafés, soupes et plats cuisinés du quotidien. C’est également une alternative végétale et sans lactose idéale.';
      return {
        title: '100% Farine Pure de Noix de Cajou (100% Pure Cashew Kernel Flour)',
        paragraphs: [p1, p2, p3],
        story: `${p1}\n\n${p2}\n\n${p3}`,
        benefitsHeader: 'Bienfaits nutritionnels et santé des noix de cajou',
        benefits: [
          { title: 'Protéines végétales', desc: 'Riche en protéines végétales de haute qualité pour la vitalité et les muscles.' },
          { title: 'Acides gras insaturés', desc: 'Principalement des graisses saines insaturées, au cœur d’une alimentation équilibrée.' },
          { title: 'Magnésium', desc: 'Minéral essentiel au bon fonctionnement musculaire, nerveux et osseux.' },
          { title: 'Cuivre, Zinc et Fer', desc: 'Oligo-éléments clés soutenant le système immunitaire et la vitalité.' },
          { title: 'Phosphore', desc: 'Contribue à la santé des os et des dents ainsi qu’à la production d’énergie.' },
          { title: 'Vitamines et antioxydants', desc: 'Participe à la protection cellulaire contre le stress oxydatif.' },
          { title: 'Sans produits laitiers ni lactose', desc: '100% végétal et sans lactose, idéal pour les régimes végétaliens.' },
          { title: 'Polyvalence culinaire', desc: 'Parfait pour la pâtisserie, les smoothies, le café, les sauces et la cuisine.' }
        ],
        badges: [
          'Origine Kampong Thom',
          'Sans conservateurs (0%)',
          'Sans arômes ajoutés',
          'Sans colorants',
          'Sans lactose (Dairy-Free)',
          'Conforme CS 001'
        ]
      };
    }
    // English default
    const p1 = 'Cashew kernel flour is made from premium cashews grown and deshelled in Kampong Thom province, Kingdom of Cambodia. Every stage of production is meticulously refined to ensure exceptional quality, safety, and hygiene in full compliance with food safety principles.';
    const p2 = 'This product contains no added preservatives, no added aroma/odor, and no added colors, preserving the authentic natural taste and pristine character of Cambodian cashew nuts.';
    const p3 = 'Cashew flour is rich in plant-based protein, essential minerals, and vital micronutrients. It can be used as a versatile culinary ingredient for baking pastries, smoothies, coffee blends, daily healthy dishes, and culinary recipes. It also serves as a nutritious dairy-free alternative for individuals seeking lactose-free or plant-based nutrition.';
    return {
      title: '100% Pure Cashew Kernel Flour (CS 001 §4.2)',
      paragraphs: [p1, p2, p3],
      story: `${p1}\n\n${p2}\n\n${p3}`,
      benefitsHeader: 'Health & Nutritional Benefits of Cashew Flour',
      benefits: [
        { title: 'Plant-Based Protein', desc: 'Rich in quality plant protein, an essential nutrient for bodily strength and muscle maintenance.' },
        { title: 'Unsaturated Healthy Fats', desc: 'Primarily composed of wholesome unsaturated fatty acids for balanced daily nutrition.' },
        { title: 'Magnesium', desc: 'Essential mineral required for muscle function, nervous system support, bone health, and energy synthesis.' },
        { title: 'Copper, Zinc & Iron', desc: 'Vital trace minerals contributing to robust immune defense, red blood cell production, and active metabolism.' },
        { title: 'Phosphorus', desc: 'Supports normal bone and dental integrity while assisting the body’s natural energy production pathways.' },
        { title: 'Vitamins & Antioxidants', desc: 'Naturally contains protective vitamins and antioxidants that assist cellular defense and vitality.' },
        { title: 'Dairy-Free & Lactose-Free', desc: '100% plant-based with zero added dairy or lactose, ideal for vegan and lactose-sensitive diets.' },
        { title: 'Versatile Culinary Uses', desc: 'Perfect for baking pastries, smoothies, morning coffee, sauces, soups, and everyday cooking.' }
      ],
      badges: [
        'Kampong Thom Grown & Deshelled',
        '0% Preservatives',
        'No Added Aroma/Odor',
        'No Added Color',
        'Dairy & Lactose-Free',
        'CS 001 Compliant'
      ]
    };
  }

  const cashewBenefits = getCashewKernelBenefits(lang);

  if (isSugar) {
    let s = 'Sugar coated cashew kernels are made from high quality Cambodian cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Enjoyed as a delicious, wholesome sweet daily snack.';
    let title = 'Sugar Coated Cashew Kernels (CS 001 §4.2)';
    let badges = ['0% Preservatives', 'No Added Odor/Aroma', 'No Added Color', 'CS 001 Compliant'];

    if (lang === 'kh' || lang === 'km') {
      s = 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបស្ករផ្តល់នូវរសជាតិឈ្ងុយឆ្ងាញ់ផ្អែមស្រាល ស្រួយពិសេស និងប្រើប្រាស់ជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។';
      title = 'គ្រាប់ស្វាយចន្ទីស្រោបស្ករ (Sugar Coated Cashew Kernels)';
      badges = ['គ្មានសារធាតុរក្សាទុក (0% Preservatives)', 'គ្មានបន្ថែមក្លិន (No Artificial Aroma)', 'គ្មានបន្ថែមពណ៌ (No Artificial Colors)', 'ស្តង់ដារ CS 001'];
    } else if (lang === 'ko' || lang === 'kr') {
      s = '슈가 코팅 캐슈넛은 엄선된 고품질 캄보디아산 캐슈넛 커널로 제조되며, 모든 생산 단계에서 식품 안전 및 위생 표준을 철저히 준수합니다. 방부제, 인공 향료 및 색소를 첨가하지 않아 자연 그대로의 고소하고 달콤한 바삭함을 선사하는 프리미엄 데일리 건강 스낵입니다.';
      title = '슈가 코팅 캐슈넛 (Sugar Coated Cashews)';
      badges = ['무방부제 (0% Preservatives)', '무인공향료 (No Artificial Flavor)', '무색소 (No Artificial Colors)', 'CS 001 준수'];
    } else if (lang === 'de') {
      s = 'Zuckerglasierte Cashewkerne werden aus erlesenen kambodschanischen Cashewkernen hergestellt. Alle Produktionsstufen folgen strengen Lebensmittelsicherheits- und Hygienestandards – ohne Konservierungsstoffe, künstliche Aromen oder Farbstoffe. Ein feiner, knuspriger und natürlicher Snack für jeden Tag.';
      title = 'Zuckerglasierte Cashewkerne (Sugar Coated Cashews)';
      badges = ['Ohne Konservierungsstoffe', 'Ohne künstliche Aromen', 'Ohne Farbstoffe', 'Standard CS 001 konform'];
    } else if (lang === 'fr') {
      s = 'Les noix de cajou caramélisées sont élaborées à partir de noix de cajou cambodgiennes de qualité supérieure. Chaque étape de fabrication respecte scrupuleusement les normes d’hygiène et de sécurité alimentaire, sans conservateurs, sans arômes artificiels ni colorants. Une collation saine, croquante et délicate.';
      title = 'Noix de cajou enrobées de sucre (Sugar Coated Cashews)';
      badges = ['0% Conservateurs', 'Sans arôme artificiel', 'Sans colorant', 'Conforme CS 001'];
    } else if (lang === 'zh') {
      s = '裹糖腰果仁精选柬埔寨高品质腰果仁精心烘焙，全程严格遵循食品安全与卫生标准。不添加防腐剂、人工香精及色素，天然酥脆香甜，是理想的日常健康零食。';
      title = '酥香裹糖腰果仁 (Sugar Coated Cashews)';
      badges = ['0% 防腐剂', '无添加人工香精', '无人工色素', '符合 CS 001 标准'];
    } else if (lang === 'ja') {
      s = 'シュガーコーティングカシューナッツは厳選されたカンボジア産最高級カシューナッツから製造され、食品安全および衛生基準を徹底管理。保存料、香料、着色料は一切不使用。自然な甘みとカリッとした香ばしさが楽しめるヘルシースナックです。';
      title = 'シュガーコーティングカシューナッツ (Sugar Coated)';
      badges = ['保存料不使用', '香料無添加', '着色料無添加', 'CS 001 規格準拠'];
    }

    return {
      title,
      paragraphs: [s],
      story: s,
      benefitsHeader: cashewBenefits.benefitsHeader,
      benefits: cashewBenefits.benefits,
      badges
    };
  }

  if (isChili) {
    let s = 'Chili coated cashew kernels are made from high quality Cambodian cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Enjoyed as a crunchy, flavorful spicy natural snack.';
    let title = 'Chili Coated Cashew Kernels (CS 001 §4.2)';
    let badges = ['0% Preservatives', 'No Added Odor/Aroma', 'No Added Color', 'CS 001 Compliant'];

    if (lang === 'kh' || lang === 'km') {
      s = 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេសត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ ផ្តល់នូវរសជាតិហឹរស្រួយឈ្ងុយឆ្ងាញ់ធម្មជាតិ និងប្រើប្រាស់ជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។';
      title = 'គ្រាប់ស្វាយចន្ទីស្រោបម្ទេស (Chili Coated Cashews)';
      badges = ['គ្មានសារធាតុរក្សាទុក (0% Preservatives)', 'គ្មានបន្ថែមក្លិន (No Artificial Aroma)', 'គ្មានបន្ថែមពណ៌ (No Artificial Colors)', 'ស្តង់ដារ CS 001'];
    } else if (lang === 'ko' || lang === 'kr') {
      s = '칠리 코팅 캐슈넛은 엄선된 고품질 캄보디아산 캐슈넛 커널로 제조되며, 천연 칠리 스파이스를 입혀 매콤하고 바삭한 풍미를 선사합니다. 방부제, 인공 향료 및 색소를 첨가하지 않아 자연 그대로의 건강한 감칠맛을 즐길 수 있습니다.';
      title = '칠리 코팅 캐슈넛 (Chili Coated Cashews)';
      badges = ['무방부제 (0% Preservatives)', '무인공향료 (No Artificial Flavor)', '무색소 (No Artificial Colors)', 'CS 001 준수'];
    } else if (lang === 'de') {
      s = 'Chili-umhüllte Cashewkerne werden aus hochwertigen kambodschanischen Cashewkernen schonend verarbeitet. Mit natürlicher Schärfe verfeinert, ohne Konservierungsstoffe, künstliche Aromen oder Farbstoffe. Ein würzig-knuspriger Premium-Snack.';
      title = 'Chili Cashewkerne (Chili Coated Cashews)';
      badges = ['Ohne Konservierungsstoffe', 'Ohne künstliche Aromen', 'Ohne Farbstoffe', 'Standard CS 001 konform'];
    } else if (lang === 'fr') {
      s = 'Les noix de cajou au piment cambodgien sont élaborées à partir de noix de cajou sélectionnées avec soin, assaisonnées d’épices naturelles. Sans conservateurs, sans arômes ajoutés ni colorants artificiels, offrant un piquant croustillant et savoureux.';
      title = 'Noix de cajou épicées au piment (Chili Coated)';
      badges = ['0% Conservateurs', 'Sans arôme artificiel', 'Sans colorant', 'Conforme CS 001'];
    } else if (lang === 'zh') {
      s = '香辣裹椒腰果仁选用柬埔寨高等级腰果仁，精心裹覆地道天然红辣椒与香料。不含防腐剂、人工香精及色素，香辣爽脆、风味醇厚，为日常聚会及佐酒零食佳品。';
      title = '香辣风味腰果仁 (Chili Coated Cashews)';
      badges = ['0% 防腐剂', '无添加人工香精', '无人工色素', '符合 CS 001 标准'];
    }

    return {
      title,
      paragraphs: [s],
      story: s,
      benefitsHeader: cashewBenefits.benefitsHeader,
      benefits: cashewBenefits.benefits,
      badges
    };
  }

  // Default / Pepper Cashew / Broken Cashews / WW180
  const isBroken = normKh.includes('បែក') || normKh.includes('ពុះ') || normEn.includes('broken') || normEn.includes('ws');
  let s = 'Cashew nuts are made from high quality Cambodian cashew kernels, all stages of production are carefully selected and refined for quality, safety and hygiene aligned with food safety standards, without the addition of preservatives, without adding odor, without adding color. Cashew nuts are used as a delicious, wholesome daily snack.';
  let title = 'Product Story & Quality Assurance (CS 001 Rule 4.2)';
  let badges = ['0% Preservatives', 'No Added Odor/Aroma', 'No Added Color', 'CS 001 Compliant'];

  if (lang === 'kh' || lang === 'km') {
    if (isPepper) {
      s = isBroken
        ? 'គ្រាប់ស្វាយចន្ទីបែក/ពុះស្រោបម្រេចខ្មៅកំពត GI ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ និងម្រេចខ្មៅកំពត GI ដ៏ល្បីល្បាញលើពិភពលោក។ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ CS 001 ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពតផ្តល់នូវរសជាតិឈ្ងុយហឹរស្រាល ស្រួយឆ្ងាញ់ធម្មជាតិ និងជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។'
        : 'គ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI ត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ និងម្រេចខ្មៅកំពត GI ដ៏ល្បីល្បាញលើពិភពលោក។ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ CS 001 ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីស្រោបម្រេចកំពតផ្តល់នូវរសជាតិឈ្ងុយហឹរស្រាល ស្រួយឆ្ងាញ់ធម្មជាតិ និងជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។';
      title = 'សាច់រឿងគ្រាប់ស្វាយចន្ទីស្រោបម្រេចខ្មៅកំពត GI';
      badges = ['ម្រេចខ្មៅកំពត GI ៥%', 'គ្មានសារធាតុរក្សាទុក', 'គ្មានបន្ថែមក្លិន', 'គ្មានបន្ថែមពណ៌', 'ស្តង់ដារ CS 001'];
    } else {
      s = isBroken
        ? 'គ្រាប់ស្វាយចន្ទីបែក/ពុះត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីផ្តល់នូវរសជាតិឈ្ងុយឆ្ងាញ់ធម្មជាតិ ស្រួយពិសេស និងប្រើប្រាស់ជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។'
        : 'គ្រាប់ស្វាយចន្ទីត្រូវបានផលិតចេញពីគ្រាប់ស្វាយចន្ទីកម្ពុជាគុណភាពខ្ពស់ គ្រប់ដំណាក់កាលនៃផលិតកម្មត្រូវបានសម្រិតសម្រាំង និងយកចិត្តទុកដាក់ខ្ពស់ដើម្បីគុណភាព សុវត្ថិភាព និងអនាម័យស្របតាមស្តង់ដារសុវត្ថិភាពម្ហូបអាហារ ដោយមិនបន្ថែមសារធាតុរក្សាទុក មិនបន្ថែមក្លិន មិនបន្ថែមពណ៌។ គ្រាប់ស្វាយចន្ទីផ្តល់នូវរសជាតិឈ្ងុយឆ្ងាញ់ធម្មជាតិ ស្រួយពិសេស និងប្រើប្រាស់ជាអាហារសម្រន់សុខភាពប្រចាំថ្ងៃ។';
      title = 'សាច់រឿងផលិតផល & ដំណើរការផលិត';
      badges = ['គ្មានសារធាតុរក្សាទុក', 'គ្មានបន្ថែមក្លិន', 'គ្មានបន្ថែមពណ៌', 'ស្តង់ដារ CS 001'];
    }
  } else if (lang === 'ko' || lang === 'kr') {
    s = isPepper
      ? '캄보디아 지리적 표시(GI) 보호를 받는 명품 캄폿 흑후추를 입힌 프리미엄 캐슈넛입니다. 고품질 캐슈넛 커널을 엄선하여 식품 안전 및 위생 기준을 철저히 준수하여 제조하며, 방부제와 인공 착향료, 색소를 전혀 첨가하지 않아 자연 그대로의 건강하고 바삭한 풍미를 선사합니다.'
      : '본 제품은 고품질의 캄보디아산 캐슈넛 커널로 제조되며, 모든 생산 단계에서 품질, 안전 및 위생을 위해 엄격하게 선별 및 관리됩니다. 방부제, 인공 향료 및 색소를 전혀 첨가하지 않아 자연 그대로의 바삭함과 건강함을 담은 프리미엄 일상 건강 스낵입니다.';
    title = '제품 스토리 및 품질 보증 (Product Story & Quality Assurance)';
    badges = ['무방부제 (0% Preservatives)', '무인공향료 (No Artificial Flavor)', '무색소 (No Artificial Colors)', 'CS 001 준수'];
  } else if (lang === 'de') {
    s = isPepper
      ? 'Veredelt mit echtem, geschütztem Kampot-Pfeffer (g.g.A.) aus Kambodscha. Hergestellt aus handverlesenen Cashewkernen nach strengen Qualitäts- und Hygienestandards. Frei von Konservierungsstoffen, Aromen oder Farbstoffen für ein unverfälschtes pfeffrig-knuspriges Geschmackserlebnis.'
      : 'Hergestellt aus erstklassigen kambodschanischen Cashewkernen. Alle Produktionsphasen werden streng nach den Standards für Lebensmittelsicherheit und Hygiene kontrolliert – ohne Konservierungsstoffe, künstliche Aromen oder Farbstoffe. Ein gesunder Premium-Snack mit natürlicher Knusprigkeit für jeden Tag.';
    title = 'Produktgeschichte & Qualitätssicherung (Product Story & Quality Assurance)';
    badges = ['Ohne Konservierungsstoffe', 'Ohne künstliche Aromen', 'Ohne Farbstoffe', 'Standard CS 001 konform'];
  } else if (lang === 'fr') {
    s = isPepper
      ? 'Enrobées de véritable poivre noir de Kampot IGP, ces noix de cajou cambodgiennes sont sélectionnées et torréfiées selon les normes d’hygiène les plus strictes. Sans additif, sans conservateur ni colorant, elles allient croquant délicat et puissance aromatique du poivre.'
      : 'Fabriquées à partir de noix de cajou cambodgiennes haut de gamme, toutes les étapes de production sont rigoureusement contrôlées pour garantir pureté, qualité et sécurité alimentaire, sans conservateur ni additif artificiel.';
    title = 'Histoire du produit & Assurance Qualité (CS 001 §4.2)';
    badges = ['0% Conservateurs', 'Sans arôme artificiel', 'Sans colorant', 'Conforme CS 001'];
  } else if (lang === 'zh') {
    s = isPepper
      ? '精选柬埔寨上等腰果仁，手工裹覆享誉全球的贡布地理标志保护（GI）黑胡椒。严守食品安全标准控温慢烤，绝不添加防腐剂、香精或色素，粒粒饱满、椒香酥脆，尽显高棉纯正风味。'
      : '精选柬埔寨优质腰果仁，全程按照严格食品安全与卫生标准精工制作，不含防腐剂、人工香精及色素，天然酥脆，是老少皆宜的健康品质零食。';
    title = '产品源流与品质承诺 (Product Story & Quality)';
    badges = ['0% 防腐剂', '无添加人工香精', '无人工色素', '符合 CS 001 标准'];
  } else if (lang === 'ja') {
    s = isPepper
      ? '地理的表示保護（GI）認定のカンボジア産最高峰「カンポット黒胡椒」を贅沢に使用。徹底した衛生管理のもと、保存料・香料・着色料を一切使わず自然のスパイスと上質なカシューナッツの香ばしさを引き出しました。'
      : '厳選されたカンボジア産高品質カシューナッツを使用し、食品衛生基準に準拠して丁寧に製造。保存料や合成添加物不使用の体にやさしい健康おやつです。';
    title = '製品の背景と品質保証 (Product Story & Quality)';
    badges = ['保存料不使用', '香料無添加', '着色料無添加', 'CS 001 規格準拠'];
  } else if (lang === 'nl') {
    s = isPepper
      ? 'Gemaakt van geselecteerde Cambodjaanse cashewnoten en omhuld met beschermde Kampot zwarte peper (BGA). Vrij van conserveermiddelen en kunstmatige toevoegingen voor een pure, knapperige smaakbeleving.'
      : 'Gemaakt van hoogwaardige Cambodjaanse cashewnoten onder strikte voedselveiligheidsnormen, zonder conserveringsmiddelen of kunstmatige toevoegingen.';
    title = 'Productverhaal & Kwaliteitsborging (CS 001 §4.2)';
    badges = ['0% Conserveermiddelen', 'Geen Kunstmatige Aroma\'s', 'Geen Kleurstoffen', 'CS 001 Conform'];
  } else if (lang === 'vi') {
    s = isPepper
      ? 'Sản phẩm hạt điều cao cấp Campuchia được phủ lớp tiêu đen Kampot chỉ dẫn địa lý (GI) lừng danh. Quy trình chế biến đạt tiêu chuẩn vệ sinh an toàn thực phẩm, không chất bảo quản, không hương liệu hay phẩm màu hóa học, giữ trọn vị cay nồng giòn rụm tự nhiên.'
      : 'Sản xuất từ hạt điều chất lượng cao của Campuchia, tuân thủ nghiêm ngặt quy định an toàn vệ sinh thực phẩm, không chất bảo quản, là món ăn nhẹ thơm ngon bổ dưỡng mỗi ngày.';
    title = 'Câu chuyện sản phẩm & Cam kết chất lượng (CS 001 §4.2)';
    badges = ['Không chất bảo quản', 'Không hương liệu nhân tạo', 'Không phẩm màu', 'Chuẩn CS 001'];
  }

  return {
    title,
    paragraphs: [s],
    story: s,
    benefitsHeader: cashewBenefits.benefitsHeader,
    benefits: cashewBenefits.benefits,
    badges
  };
}
