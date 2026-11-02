/**
 * Comprehensive Offline Knowledge Base for Cambodian Agri Supply Chains
 * Specially equipped for field meetings with cashew farmers (e.g. Chey Sambo Cashew Nut Processing in Kampong Speu)
 * Enables instant voice/text answers without cutting off, even in areas with zero or weak cellular data.
 */

export interface OfflineEntry {
  id: string;
  keywords: string[];
  titleKh: string;
  titleEn: string;
  answerKh: string;
  answerEn: string;
  spokenKh: string;
  spokenEn: string;
}

export const OFFLINE_KNOWLEDGE_ENTRIES: OfflineEntry[] = [
  {
    id: 'chey_sambo',
    keywords: [
      'ជ័យ សំបូរ', 'ជ័យសំបូរ', 'រោងចក្រ', 'រោងចក្រស្វាយចន្ទី', 'កំពង់ស្ពឺ', 'ទិញគ្រាប់', 'កែច្នៃ',
      'chey sambo', 'factory', 'processing', 'kampong speu', 'buyer', 'purchase'
    ],
    titleKh: 'រោងចក្រកែច្នៃគ្រាប់ស្វាយចន្ទី ជ័យ សំបូរ (ខេត្តកំពង់ស្ពឺ)',
    titleEn: 'Chey Sambo Cashew Nut Processing Facility (Kampong Speu)',
    answerKh: `រោងចក្រកែច្នៃគ្រាប់ស្វាយចន្ទី ជ័យ សំបូរ (ខេត្តកំពង់ស្ពឺ) គឺជាដៃគូកែច្នៃដ៏សំខាន់ដែលប្រមូលទិញគ្រាប់ស្វាយចន្ទីផ្ទាល់ពីកសិករ និងសហគមន៍កសិកម្ម។

លក្ខខណ្ឌសំខាន់ៗដែលរោងចក្រទាមទារ៖
១. សំណើមគ្រាប់ស្ងួត៖ ត្រូវស្ថិតនៅចន្លោះ ៨% ទៅ ១០% (ស្ងួតល្អ មិនដុះផ្សិត)
២. អត្រាសាច់ (KOR / Outturn)៖ ចាប់ពី ៤៨ ដល់ ៥២ ផោនឡើងទៅ
៣. គុណភាពគ្រាប់៖ គ្រាប់ពេញទំហំល្អ គ្មានគ្រាប់ប្រហោង ឬសត្វល្អិតស៊ីលើស ៥%
៤. តម្លាភាព៖ ផ្តល់កិច្ចសន្យាទិញ-លក់ច្បាស់លាស់ ថ្លឹងទម្ងន់ត្រឹមត្រូវ និងទូទាត់ប្រាក់ទាន់ពេល។`,
    answerEn: `Chey Sambo Cashew Nut Processing Facility in Kampong Speu is a leading domestic processor sourcing directly from farm owners and cooperatives.

Key Factory Purchase Requirements:
1. Moisture Level: Must be properly dried to 8% - 10% (mold-free).
2. Kernel Output Ratio (KOR): Ideally 48 - 52 lbs or higher.
3. Defect Rate: Under 5% insect damage or hollow shells.
4. Benefits: Fair farm-gate pricing, certified weighing, prompt payments, and formal supply contracts.`,
    spokenKh: `រោងចក្រកែច្នៃ ជ័យ សំបូរ នៅខេត្តកំពង់ស្ពឺ ប្រមូលទិញគ្រាប់ស្វាយចន្ទីផ្ទាល់ពីកសិករ។ លក្ខខណ្ឌសំខាន់គឺសំណើមគ្រាប់ស្ងួតត្រូវនៅចន្លោះ ៨ ដល់ ១០ ភាគរយ និងអត្រាសាច់ KOR ខ្ពស់ គ្មានគ្រាប់ខូចលើស ៥ ភាគរយឡើយ។`,
    spokenEn: `Chey Sambo processing facility in Kampong Speu purchases cashew nuts directly from farmers. Key requirements are dry nuts at 8 to 10 percent moisture and high KOR yield with defect rates under 5 percent.`
  },
  {
    id: 'fertilizer',
    keywords: [
      'ជី', 'ជីកំប៉ុស', 'ជីសរីរាង្គ', 'ដាក់ជី', 'អិនភីខេ', 'npk', '១៦-២០-០', '១៥-១៥-១៥', 'ជីគីមី',
      'fertilizer', 'compost', 'organic fertilizer', 'nutrients'
    ],
    titleKh: 'ការប្រើប្រាស់ជីសម្រាប់ដើមស្វាយចន្ទី',
    titleEn: 'Fertilizer Guidelines for Cashew Orchards',
    answerKh: `ការដាក់ជីត្រឹមត្រូវតាមវដ្តជីវិតរបស់ដើមស្វាយចន្ទីជួយបង្កើនទិន្នផលទ្វេដង៖

១. ដើមតូច (អាយុ ១ ដល់ ២ ឆ្នាំ)៖
- ប្រើជីកំប៉ុសធម្មជាតិ ៥ ទៅ ១០ គីឡូក្នុងមួយដើម
- បន្ថែមជី NPK ១៦-២០-០ ឬ ២០-២០-១៥ ប្រហែល ១០០-២០០ ក្រាម ដើម្បីពង្រឹងប្រព័ន្ធឫស និងដើម។

២. ដើមធំពេញវ័យ (អាយុ ៣ ឆ្នាំឡើង)៖
- ដើមរដូវវស្សា (ឧសភា-មិថុនា)៖ ដាក់ជីកំប៉ុស និងជី NPK ១៥-១៥-១៥ ដើម្បីចិញ្ចឹមមែកថ្មី
- មុនចេញផ្កា (តុលា-វិច្ឆិកា)៖ ដាក់ជីសម្បូរ ប៉ូតាស្យូម (K) ដើម្បីជួយឱ្យផ្កាចេញស្មើ និងទម្ងន់គ្រាប់ធ្ងន់។
- វិធីដាក់៖ ជីករណ្តៅជុំវិញរង្វង់ tán ស្លឹកដើម រួចលប់ដីវិញ។`,
    answerEn: `Optimal cashew fertilizer management:
1. Young Trees (1-2 years): Apply 5-10kg organic compost plus 100-200g NPK 16-20-0 around root zone to boost vegetative vigor.
2. Mature Trees (3+ years):
- Early rainy season (May-June): Apply balanced NPK 15-15-15 + organic compost to nourish canopy flush.
- Pre-flowering (Oct-Nov): Increase potassium (K) fertilizer for abundant flowering and dense kernel weight.
Always trench along the outer canopy drip line and cover with soil.`,
    spokenKh: `សម្រាប់ដើមស្វាយចន្ទី បងគួរប្រើជីធម្មជាតិ ឬជីកំប៉ុសជុំវិញគល់។ សម្រាប់ដើមតូចប្រើជី NPK ១៦-២០-០ ដើម្បីជួយឫស ហើយពេលដើមជិតចេញផ្កា ប្រើជី NPK ១៥-១៥-១៥ ដើម្បីឱ្យផ្កាចេញច្រើន និងគ្រាប់ធ្ងន់ល្អ។`,
    spokenEn: `For cashew trees, apply organic compost along the canopy drip line. Use NPK 16-20-0 for young trees to build strong roots, and NPK 15-15-15 before flowering to maximize kernel size and yield.`
  },
  {
    id: 'pests',
    keywords: [
      'ដង្កូវ', 'ដង្កូវស៊ីត្រួយ', 'មមាច', 'មមាចផ្កា', 'សត្វល្អិត', 'សត្វល្អិតចង្រៃ', 'ថ្នាំពុល', 'ជីវសាស្ត្រ', 'ស្តៅ',
      'pest', 'shoot borer', 'tea mosquito', 'insects', 'spray', 'neem'
    ],
    titleKh: 'ការកម្ចាត់ដង្កូវស៊ីត្រួយ និងសត្វល្អិតស្វាយចន្ទី',
    titleEn: 'Cashew Pest & Disease Management',
    answerKh: `សត្វល្អិតចម្បងលើស្វាយចន្ទីរួមមាន ដង្កូវស៊ីត្រួយ និងមមាចផ្កា (Tea Mosquito Bug)៖

វិធីសាស្ត្រការពារបែបធម្មជាតិ និងជីវសាស្ត្រ (អនុលោមតាម EUDR & GAP)៖
១. កាត់មែកដែលដង្កូវស៊ីចេញភ្លាមៗ រួចយកទៅដុតចោលក្រៅចម្ការ។
២. ប្រើប្រេងស្លឹកស្តៅ (Neem Oil) ឬទឹកថ្នាំផ្សំពីរុក្ខជាតិ (ម្ទេស ខ្ទឹមស ស្លឹកគ្រៃ ផ្សំជាមួយសាប៊ូកក់សក់បន្តិច) បាញ់នៅពេលព្រលឹម ឬល្ងាចត្រជាក់។
៣. សម្អាតស្មៅក្រោមគល់ដើម និងរក្សាចម្ការឱ្យមានពន្លឺថ្ងៃចាំងចូលគ្រប់គ្រាន់ ដើម្បីកម្ចាត់ជម្រកសត្វល្អិត។
៤. ជៀសវាងការប្រើថ្នាំគីមីហាមឃាត់របស់សហភាពអឺរ៉ុប។`,
    answerEn: `Common cashew pests include shoot borers and tea mosquito bugs.
Eco-friendly & EUDR compliant controls:
1. Prune and destroy infested shoots outside the orchard.
2. Spray organic neem oil extract or biological herbal sprays (chili, garlic, lemongrass).
3. Clear undergrowth to allow sunlight penetration and eliminate insect breeding habitats.
4. Avoid EU-banned synthetic pesticides to ensure export eligibility.`,
    spokenKh: `ដើម្បីកម្ចាត់ដង្កូវស៊ីត្រួយ និងមមាចផ្កា បងក្រឡេកមើលមែកដែលឆ្លង រួចកាត់ដុតចោល។ ប្រើប្រេងស្លឹកស្តៅ ឬថ្នាំផ្សំពីរុក្ខជាតិបាញ់នៅពេលត្រជាក់ និងសម្អាតស្មៅក្រោមគល់ឱ្យស្រឡះ។`,
    spokenEn: `To manage cashew shoot borer and tea mosquito bug, prune infested tips and burn them. Apply biological neem oil sprays and keep the orchard floor clean to remove pest shelters.`
  },
  {
    id: 'drying_moisture',
    keywords: [
      'សំណើម', 'ហាល', 'សម្ងួត', 'ហាលថ្ងៃ', '៨%', '១០%', 'ផ្សិត', 'ស្ងួត', 'គ្រាប់ស្ងួត', 'សំណើមគ្រាប់',
      'moisture', 'dry', 'drying', 'sun dry', 'tarp', 'humidity'
    ],
    titleKh: 'បច្ចេកទេសសម្ងួតគ្រាប់ស្វាយចន្ទីឱ្យបានសំណើម ៨-១០%',
    titleEn: 'Cashew Nut Sun-Drying & Moisture Control',
    answerKh: `ការសម្ងួតត្រឹមត្រូវគឺជាគន្លឹះកំណត់តម្លៃខ្ពស់បំផុតពេលលក់ជូនរោងចក្រ ជ័យ សំបូរ៖

១. ហាលលើកន្ទេល ឬតង់ស្អាត (ហាមហាលផ្ទាល់លើដីដាច់ខាត)
២. កម្រាស់គ្រាប់ដែលហាល មិនឱ្យក្រាស់ជាង ៥ សង់ទីម៉ែត្រឡើយ
៣. ត្រូវកៀរត្រឡប់គ្រាប់រៀងរាល់ ២ ទៅ ៣ ម៉ោងម្តង ដើម្បីឱ្យស្ងួតស្មើគ្នា
៤. រយៈពេលហាល៖ ២ ទៅ ៣ ថ្ងៃនៃថ្ងៃក្តៅខ្លាំង ដើម្បីទម្លាក់សំណើមមកនៅត្រឹម ៨% ទៅ ១០%
៥. វិធីសាកល្បងដោយដៃ៖ គ្រាប់ស្ងួតល្អ ពេលខាំឮសូរ "ប្រេះផូង" មិនទន់ស្វិត និងមិនមានជាតិទឹក។`,
    answerEn: `Proper drying determines premium pricing at processing plants like Chey Sambo:
1. Always dry on clean food-grade tarps or concrete drying patios (never directly on bare dirt).
2. Spread nuts evenly no deeper than 5cm.
3. Rake and turn every 2-3 hours for uniform heat exposure.
4. Sun-dry for 2-3 consecutive sunny days to reach 8% - 10% moisture content.
5. Quick field test: Dried nuts make a clean, dry cracking sound when shaken or bitten, with no softness.`,
    spokenKh: `គ្រាប់ស្វាយចន្ទីត្រូវហាលលើតង់ស្អាត ២ ទៅ ៣ ថ្ងៃនៃថ្ងៃក្តៅ ដើម្បីទម្លាក់សំណើមមកនៅ ៨ ទៅ ១០ ភាគរយ។ ហាមហាលលើដីផ្ទាល់ ហើយត្រូវកៀរត្រឡប់គ្រាប់ញឹកញាប់ដើម្បីកុំឱ្យដុះផ្សិត។`,
    spokenEn: `Cashew nuts should be sun-dried on clean tarps for 2 to 3 days to lower moisture to 8 to 10 percent. Never dry on bare soil, and turn the nuts regularly to prevent fungal mold.`
  },
  {
    id: 'pruning',
    keywords: [
      'កាត់មែក', 'តម្រឹម', 'កាត់តម្រឹម', 'មែកខ្នែង', 'មែកងាប់', 'កាត់ដើម', 'កាត់ស្វាយចន្ទី',
      'prune', 'pruning', 'canopy', 'branches', 'trimming'
    ],
    titleKh: 'បច្ចេកទេសកាត់តម្រឹមមែកស្វាយចន្ទី',
    titleEn: 'Cashew Tree Pruning Techniques',
    answerKh: `ការកាត់តម្រឹមមែកត្រូវធ្វើឡើងភ្លាមៗក្រោយប្រមូលផលរួច (ខែឧសភា ដល់ មិថុនា)៖

គោលការណ៍កាត់តម្រឹម៖
១. កាត់មែកជិតដី (កម្ពស់ក្រោម ១ ម៉ែត្រ) ដើម្បីងាយស្រួលដើរប្រមូលផល
២. កាត់មែកដុះខ្វែងគ្នា មែកដុះចូលក្នុងទ្រូងដើម និងមែកស្ងួតងាប់
៣. កាត់ចុងមែកដែលខ្ពស់ជ្រុល ដើម្បីទម្លាក់កម្ពស់ដើមឱ្យនៅត្រឹម ៤ ទៅ ៥ ម៉ែត្រ
៤. ក្រោយកាត់រួច ត្រូវលាបកំបោរ ឬថ្នាំការពារផ្សិតលើមុខកាត់ធំៗ ដើម្បីការពារការរលួយ។`,
    answerEn: `Pruning should be completed immediately after harvest (May-June):
1. Skirt branches lower than 1 meter from the ground for harvest access.
2. Remove internal water sprouts, crisscrossing branches, and dead wood to open canopy to light.
3. Top tall leaders to maintain canopy height below 4-5 meters for easier harvesting and spraying.
4. Paint larger cut wounds with copper fungicide or lime wash to prevent fungal infection.`,
    spokenKh: `ការកាត់តម្រឹមមែកស្វាយចន្ទី គួរធ្វើភ្លាមក្រោយប្រមូលផលរួច។ កាត់មែកជិតដី មែកងាប់ និងមែកខ្វែងគ្នាក្នុងទ្រូងដើម ដើម្បីឱ្យពន្លឺថ្ងៃចាំងចូលសព្វ និងចេញផ្កាបានល្អនៅរដូវក្រោយ។`,
    spokenEn: `Cashew pruning is best done right after harvest. Remove branches close to the ground, dead wood, and internal crisscrossing branches so sunlight penetrates the entire canopy.`
  },
  {
    id: 'eudr',
    keywords: [
      'eudr', 'អឺរ៉ុប', 'ព្រៃឈើ', 'កាត់ព្រៃ', 'ច្បាប់អឺរ៉ុប', 'gps', 'កូអរដោនេ', '៣០ ហិកតា', '៣០ហិកតា',
      'deforestation', 'europe', 'polygon', 'coordinates', 'compliance'
    ],
    titleKh: 'បទប្បញ្ញត្តិ EUDR សហភាពអឺរ៉ុប និងចម្ការគំរូ ៣០ ហិកតា',
    titleEn: 'EUDR European Deforestation Regulation & 30ha Farm Mapping',
    answerKh: `ច្បាប់ EUDR របស់សហភាពអឺរ៉ុប តម្រូវឱ្យផលិតផលកសិកម្មនាំចូលអឺរ៉ុប (រួមទាំងស្វាយចន្ទី) ត្រូវគោរពតាមលក្ខខណ្ឌ៖

១. គ្មានការកាប់បំផ្លាញព្រៃឈើ (Deforestation-Free)៖ ដីចម្ការមិនត្រូវកាប់ឆ្ការព្រៃឈើក្រោយថ្ងៃទី ៣១ ខែធ្នូ ឆ្នាំ ២០២០ ឡើយ។
២. ទីតាំងភូមិសាស្ត្រច្បាស់លាស់ (Geolocation GPS)៖ ចម្ការលើសពី ៤ ហិកតា ត្រូវមាន Polygon គូសព្រំប្រទល់ GPS ពេញលេញ។
៣. ស្របច្បាប់ជាតិនៃប្រទេសផលិត៖ មានប័ណ្ណកម្មសិទ្ធិដីធ្លី ឬការបញ្ជាក់ដីកសិកម្មពីអាជ្ញាធរមូលដ្ឋាន។
៤. ការតាមដានប្រភព៖ តាមដានពីចម្ការ ឆ្លងកាត់រោងចក្រ ជ័យ សំបូរ រហូតដល់កុងតឺន័រនាំចេញ។`,
    answerEn: `EU Deforestation Regulation (EUDR) mandates for exporting cashews into the EU:
1. Deforestation-Free: Zero deforestation on the farm plot after December 31, 2020.
2. Geolocation: Farms over 4 hectares require full GPS polygon boundaries; smaller farms need point coordinates.
3. Legality: Production must comply with local Cambodian land use and labor laws.
4. End-to-End Traceability: From the farm plot through Chey Sambo factory to the export shipping vessel.`,
    spokenKh: `ច្បាប់ EUDR របស់អឺរ៉ុប តម្រូវឱ្យចម្ការស្វាយចន្ទីត្រូវមានកូអរដោនេ GPS ច្បាស់លាស់ និងមិនកាប់ឆ្ការព្រៃឈើក្រោយឆ្នាំ ២០២០ ឡើយ។ រោងចក្រ ជ័យ សំបូរ ជួយកសិករតភ្ជាប់ប្រព័ន្ធនេះដើម្បីនាំចេញទៅអឺរ៉ុប។`,
    spokenEn: `The EUDR regulation requires cashew orchards to have verified GPS polygon boundaries and zero deforestation after 2020. Chey Sambo factory connects compliant farms directly to European export markets.`
  },
  {
    id: 'price',
    keywords: [
      'តម្លៃ', 'ថ្លៃ', 'ទីផ្សារ', 'ប៉ុន្មាន', 'មួយគីឡូ', 'គ្រាប់សើម', 'គ្រាប់ស្ងួត', 'លុយ', 'លក់',
      'price', 'market price', 'cost', 'sell', 'riel', 'dollar'
    ],
    titleKh: 'តម្លៃទីផ្សារគ្រាប់ស្វាយចន្ទី និងកត្តាកំណត់តម្លៃ',
    titleEn: 'Cashew Market Pricing & Quality Value Factors',
    answerKh: `តម្លៃគ្រាប់ស្វាយចន្ទីអាស្រ័យលើកត្តាសំខាន់ៗចំនួន ៤៖

១. គ្រាប់សើម ទល់នឹង គ្រាប់ស្ងួត៖ គ្រាប់ហាលស្ងួតល្អ (សំណើម ៨-១០%) តែងតែទទួលបានតម្លៃខ្ពស់ជាងគ្រាប់សើមពី ៣០% ទៅ ៥០%។
២. អត្រាសាច់ (KOR / Outturn)៖ កាលណាភាគរយសាច់គ្រាប់ខ្ពស់ (ឧទាហរណ៍ ៥០-៥២ lbs) តម្លៃទិញកាន់តែថ្លៃ។
៣. ទំហំគ្រាប់ (Nut Count)៖ ចំនួនគ្រាប់ក្នុង ១ គីឡូក្រាមកាន់តែតិច (គ្រាប់ធំ ១៥០-១៨០ គ្រាប់/គីឡូ) តម្លៃកាន់តែល្អ។
៤. ការលក់ផ្ទាល់ជូនរោងចក្រ ជ័យ សំបូរ ជួយកាត់បន្ថយការកាត់ថ្លៃពីឈ្មួញកណ្តាល។`,
    answerEn: `Cashew market value is determined by 4 key criteria:
1. Moisture: Sun-dried nuts (8-10% moisture) command 30% to 50% higher price than wet freshly picked nuts.
2. Kernel Output Ratio (KOR): High outturn (e.g. 50-52 lbs) earns top market tier.
3. Nut Count: Larger kernels (150-180 nuts/kg) obtain premium grade over smaller nuts (200+ nuts/kg).
4. Selling directly to processors like Chey Sambo eliminates unnecessary intermediary price discounting.`,
    spokenKh: `តម្លៃគ្រាប់ស្វាយចន្ទីខ្ពស់ ឬទាប អាស្រ័យលើសំណើមស្ងួតល្អ និងអត្រាសាច់ KOR។ ការហាលគ្រាប់ឱ្យស្ងួត ៨ ទៅ ១០ ភាគរយ ជួយឱ្យបងលក់បានតម្លៃខ្ពស់ជាងគ្រាប់សើមរហូតដល់ ៤០ ភាគរយ។`,
    spokenEn: `Cashew prices depend on dry moisture and KOR kernel yield. Sun-drying nuts properly to 8-10% moisture gives farmers up to 40% higher profits compared to selling wet nuts.`
  },
  {
    id: 'harvest',
    keywords: [
      'ប្រមូលផល', 'បេះ', 'រើស', 'រើសគ្រាប់', 'ជ្រុះ', 'ផ្លែទុំ', 'ពេលណា',
      'harvest', 'picking', 'collection', 'ripe'
    ],
    titleKh: 'បច្ចេកទេសប្រមូលផលគ្រាប់ស្វាយចន្ទីត្រឹមត្រូវ',
    titleEn: 'Cashew Harvesting Best Practices',
    answerKh: `បច្ចេកទេសប្រមូលផលគ្រាប់ស្វាយចន្ទីប្រកបដោយគុណភាពខ្ពស់៖

១. រើសតែគ្រាប់ដែលផ្លែទុំជ្រុះដល់ដីដោយធម្មជាតិ (ហាមបេះផ្លែខ្ចីលើដើមជាដាច់ខាត ព្រោះសាច់មិនទាន់ពេញ)
២. ប្រមូលរៀងរាល់ ២ ទៅ ៣ ថ្ងៃម្តង ដើម្បីកុំឱ្យគ្រាប់ត្រាំទឹកភ្លៀង ឬដុះផ្សិតនៅលើដី
៣. បេះផ្លែចេញពីគ្រាប់ភ្លាមៗ រួចសម្អាតសាច់ផ្លែដែលជាប់គ្រាប់ឱ្យស្អាត
៤. យកទៅហាលថ្ងៃភ្លាមៗក្នុងថ្ងៃដដែល មិនត្រូវច្រកបាវទុកពេលសើមឡើយ។`,
    answerEn: `Cashew harvesting guidelines:
1. Only gather nuts from naturally fallen, fully ripened fruits (never pick unripened fruit from branches).
2. Collect fallen nuts every 2 to 3 days so they don't sit on damp ground or develop mold.
3. Detach fruit apples immediately and remove all flesh remnants from the shell.
4. Spread to sun-dry immediately on the same day; never store wet nuts inside sealed sacks.`,
    spokenKh: `ពេលប្រមូលផល បងគួររើសតែគ្រាប់ដែលផ្លែទុំជ្រុះដល់ដីដោយធម្មជាតិ។ បេះផ្លែចេញភ្លាម រួចយកគ្រាប់ទៅហាលថ្ងៃក្នុងថ្ងៃដដែល កុំទុកឱ្យគ្រាប់ត្រាំទឹកភ្លៀងនៅលើដី។`,
    spokenEn: `Only collect cashew nuts that drop naturally when fully ripe. Remove the cashew apple immediately and sun-dry the nuts on the same day.`
  },
  {
    id: 'supply_chain',
    keywords: [
      'ខ្សែច្រវ៉ាក់', 'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់', 'តួនាទី', 'ម្ចាស់ចម្ការ', 'អ្នកប្រមូលទិញ', 'អ្នកនាំចេញ', 'ដឹកជញ្ជូន',
      'supply chain', 'stakeholders', 'traders', 'processors', 'logistics', 'orchard'
    ],
    titleKh: 'តួនាទីតួអង្គទាំង ៥ ក្នុងខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទី',
    titleEn: 'The 5 Stakeholder Roles in Cashew Supply Chain',
    answerKh: `ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទីកម្ពុជា រួមបញ្ចូលតួអង្គសំខាន់ៗចំនួន ៥៖

១. ម្ចាស់ចម្ការ (Orchard Owners)៖ ដាំដុះ ថែទាំ ហាលសម្ងួត និងកត់ត្រាកូអរដោនេ GPS ចម្ការ
២. អ្នកប្រមូលទិញ (Traders/Collectors)៖ ប្រមូលទិញតាមចម្ការ វាស់សំណើម និងវេចខ្ចប់តាមឡូត៍
៣. រោងចក្រកែច្នៃ (Processors - Chey Sambo)៖ បកសំបក កម្ដៅ ញែកចំណាត់ថ្នាក់គុណភាព និងវេចខ្ចប់ស្តង់ដារ
៤. អ្នកនាំចេញ (Exporters)៖ រៀបចំឯកសារភូតគាមអនាម័យ វិញ្ញាបនបត្រ EUDR និងទីផ្សារអន្តរជាតិ
៥. ដៃគូដឹកជញ្ជូន (Logistics Partners)៖ ដឹកជញ្ជូនពីចម្ការមករោងចក្រ និងទៅកាន់កំពង់ផែអន្តរជាតិ។`,
    answerEn: `The 5 Essential Cashew Supply Chain Stakeholder Pillars:
1. Orchard Owners: Cultivate, maintain, sun-dry, and maintain GPS orchard traceability.
2. Traders/Collectors: Village-level aggregation, moisture grading, and batch lot tracking.
3. Processors (e.g. Chey Sambo): Steaming, shelling, grading, vacuum packing, and food safety standards.
4. Exporters: Phytosanitary certification, EUDR compliance dossiers, and global buyer relationships.
5. Logistics Partners: Farm-to-factory haulage and international port shipping dispatch.`,
    spokenKh: `ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទីមាន ៥ ផ្នែកសំខាន់៖ ម្ចាស់ចម្ការ, អ្នកប្រមូលទិញ, រោងចក្រកែច្នៃ ជ័យ សំបូរ, អ្នកនាំចេញ និងដៃគូដឹកជញ្ជូន ដែលធ្វើការរួមគ្នាដើម្បីនាំស្វាយចន្ទីខ្មែរទៅកាន់ពិភពលោក។`,
    spokenEn: `The cashew supply chain connects 5 pillars: Orchard Owners, Collectors, Processors like Chey Sambo, Exporters, and Logistics Partners working together to export premium Cambodian cashews.`
  }
];

/**
 * Intelligent Offline Matcher
 * Analyzes the user's spoken voice query and returns the most accurate, authoritative response
 */
export function getOfflineAnswer(query: string, lang: 'km' | 'en' = 'km', appContext: string = 'farmer'): {
  found: boolean;
  title: string;
  answer: string;
  spokenText: string;
} {
  const cleanQ = query.toLowerCase().trim();
  if (!cleanQ) {
    return {
      found: false,
      title: lang === 'km' ? 'គ្មានសំណួរ' : 'No Query',
      answer: lang === 'km' ? 'សូមចុចមីក្រូហ្វូន រួចនិយាយសួរសំណួររបស់អ្នក។' : 'Please tap the mic and speak your question.',
      spokenText: lang === 'km' ? 'សូមចុចមីក្រូហ្វូន រួចនិយាយសួរ។' : 'Please tap the mic and speak.'
    };
  }

  // Score each knowledge entry
  let bestMatch: OfflineEntry | null = null;
  let highestScore = 0;

  for (const entry of OFFLINE_KNOWLEDGE_ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (cleanQ.includes(kw.toLowerCase())) {
        score += kw.length; // weight longer specific keywords higher
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && highestScore > 0) {
    return {
      found: true,
      title: lang === 'km' ? bestMatch.titleKh : bestMatch.titleEn,
      answer: lang === 'km' ? bestMatch.answerKh : bestMatch.answerEn,
      spokenText: lang === 'km' ? bestMatch.spokenKh : bestMatch.spokenEn,
    };
  }

  // Fallback intelligent response tailored for Cambodian agricultural context
  if (lang === 'km') {
    const isCashew = appContext === 'farmer' || cleanQ.includes('ចន្ទី') || cleanQ.includes('គ្រាប់');
    const answer = isCashew
      ? `[ទម្រង់ឆ្លើយតប Offline ដោយសារអ៊ីនធឺណិតខ្សោយ]៖ ខ្ញុំបានកត់ត្រាសំណួររបស់បង៖ "${query}"។\n\nសម្រាប់ដំណាំស្វាយចន្ទី និងការលក់ជូនរោងចក្រ ជ័យ សំបូរ (កំពង់ស្ពឺ)៖\n• ត្រូវហាលគ្រាប់ស្ងួតល្អ ដោយរក្សាសំណើមនៅចន្លោះ ៨% ទៅ ១០%\n• ប្រើជីកំប៉ុសធម្មជាតិ និងជី NPK ១៥-១៥-១៥ ដើម្បីបង្កើនទិន្នផលគ្រាប់\n• រក្សាកំណត់ត្រាកូអរដោនេ GPS នៃចម្ការ ដើម្បីស្របតាមស្តង់ដារ EUDR។`
      : `[ទម្រង់ឆ្លើយតប Offline ដោយសារអ៊ីនធឺណិតខ្សោយ]៖ ខ្ញុំបានកត់ត្រាសំណួររបស់បង៖ "${query}"។ ព័ត៌មានលម្អិតបន្ថែមនឹងត្រូវទាញយកដោយស្វ័យប្រវត្តិពីប្រព័ន្ធ AI នៅពេលទូរស័ព្ទភ្ជាប់អ៊ីនធឺណិតឡើងវិញ។`;

    const spoken = isCashew
      ? `ខ្ញុំបានកត់ត្រាសំណួររបស់បង។ សម្រាប់ស្វាយចន្ទី សូមប្រាកដថាគ្រាប់ស្ងួតល្អមានសំណើម ៨ ទៅ ១០ ភាគរយ មុនលក់ជូនរោងចក្រ ជ័យ សំបូរ ដើម្បីទទួលបានតម្លៃខ្ពស់បំផុត។`
      : `ខ្ញុំបានកត់ត្រាសំណួររបស់បងរួចហើយ។`;

    return {
      found: false,
      title: 'ជំនួយការកសិកម្ម Offline (Offline Agronomy)',
      answer,
      spokenText: spoken,
    };
  } else {
    return {
      found: false,
      title: 'Offline Agronomy Assistant',
      answer: `[Offline Mode due to weak internet] I recorded your question: "${query}".\n\nFor Cashew Farmers & Chey Sambo Processing Facility (Kampong Speu):\n• Maintain dried kernel moisture between 8% and 10% on clean tarps.\n• Apply balanced organic compost and NPK to maximize KOR yield.\n• Keep GPS farm coordinates ready for EUDR export certification.`,
      spokenText: `I recorded your question. For cashew selling to Chey Sambo, ensure nuts are sun-dried to 8 to 10 percent moisture for maximum pricing.`
    };
  }
}
