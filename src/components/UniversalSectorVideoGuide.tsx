import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Smartphone, CheckCircle2, Sparkles, 
  ArrowRight, ShieldCheck, MapPin, Layers, Check, ExternalLink, HelpCircle,
  Volume2, VolumeX
} from 'lucide-react';

export type SectorKey = 'cashew' | 'farmer' | 'mango' | 'smes' | 'mayany' | 'packaging' | 'spices';

interface VideoScene {
  id: number;
  title: string;
  titleKhmer: string;
  description: string;
  badge: string;
  icon: string;
  color: string;
  summaryRows: { label: string; val: string; highlight?: boolean }[];
}

interface SectorGuideConfig {
  sectorKey: SectorKey;
  sectorNameKhmer: string;
  sectorNameEnglish: string;
  badgeText: string;
  badgeColor: string;
  descriptionText: string;
  scenes: VideoScene[];
  demoBtnText: string;
  tipText: string;
}

const cashewConfig: SectorGuideConfig = {
  sectorKey: 'cashew',
  sectorNameKhmer: 'ស្វាយចន្ទីកម្ពុជា (Cashew Nut Sector)',
  sectorNameEnglish: 'Cashew Nut Farm-to-Table & EUDR',
  badgeText: 'Cashew Nut Sector Only • សមាគមស្វាយចន្ទី (CAC)',
  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  descriptionText: 'របៀបចុះឈ្មោះ កត់ត្រាសកម្មភាពចម្ការស្វាយចន្ទី និងបង្កើតលិខិតឆ្លងដែន EUDR QR Passport',
  demoBtnText: '⚡ ចូលគណនីគំរូស្វាយចន្ទី (1-Click Cashew Demo)',
  tipText: 'សម្រាប់លោក អួន ស៊ីឡុត (Silot) ឬចម្ការគំរូ អាចចុច "⚡ គណនីគំរូ" ចូលភ្លាមៗ!',
  scenes: [
    {
      id: 0,
      title: 'ជំហានទី ១៖ ចុះឈ្មោះ ឬជ្រើសរើស "⚡ គណនីគំរូ"',
      titleKhmer: 'របៀបចុះឈ្មោះ និងចូលប្រើប្រាស់',
      description: 'បំពេញឈ្មោះ លេខអត្តសញ្ញាណប័ណ្ណ និងទូរស័ព្ទ ឬចុចយកគណនីគំរូរបស់ លោក អួន ស៊ីឡុត (Silot) ចូលភ្លាមៗ!',
      badge: 'REGISTER',
      icon: '📝',
      color: 'from-emerald-600 to-teal-700',
      summaryRows: [
        { label: 'ឈ្មោះកសិករ/ចម្ការ', val: 'ចម្ការស្វាយចន្ទីគំរូ (Silot Model)' },
        { label: 'ខេត្តដាំដុះ', val: 'កំពង់ធំ (Kampong Thom)', highlight: true },
        { label: 'ផ្ទៃដីដាំដុះ', val: '៣០ ហិកតា (៦,០០០ ដើម)' }
      ]
    },
    {
      id: 1,
      title: 'ជំហានទី ២៖ កត់ត្រាសកម្មភាព និងចាប់ទីតាំង GPS ចម្ការ',
      titleKhmer: 'កត់ត្រាការថែទាំ ដាក់ជី និង GPS',
      description: 'ជ្រើសរើសប្រភេទជីសរីរាង្គ ឬថ្នាំជីវសាស្ត្រ រួចចុច "ចាប់យកទីតាំង GPS" ពីក្នុងចម្ការជាក់ស្តែង។',
      badge: 'FARM LOG',
      icon: '📍',
      color: 'from-amber-600 to-orange-700',
      summaryRows: [
        { label: 'សកម្មភាពថែទាំ', val: 'ដាក់ជីសរីរាង្គ Meltert + កាត់មែក' },
        { label: 'កូអរដោនេ GPS', val: 'Lat: 12.7112, Lng: 104.8887', highlight: true },
        { label: 'ទិន្នផលរំពឹងទុក', val: '៤៥ តោន (៤៥,០០០ គីឡូក្រាម)' }
      ]
    },
    {
      id: 2,
      title: 'ជំហានទី ៣៖ បង្កើត និងបោះពុម្ព EUDR QR Passport',
      titleKhmer: 'ទាញយក QR Code ភ្ជាប់ប្រភពចម្ការ',
      description: 'ប្រព័ន្ធនឹងបង្កើត QR Code បញ្ជាក់ប្រភពចម្ការស្របច្បាប់ មិនកាប់ព្រៃឈើ (EUDR Compliance) សម្រាប់បិទលើបាវស្វាយចន្ទី!',
      badge: 'EUDR QR',
      icon: '📲',
      color: 'from-blue-600 to-indigo-700',
      summaryRows: [
        { label: 'EUDR QR Passport', val: 'KM-CASHEW-2026-B359', highlight: true },
        { label: 'ស្ថានភាពត្រួតពិនិត្យ', val: '✓ ផ្ទៀងផ្ទាត់មិនពាក់ព័ន្ធការកាប់ព្រៃឈើ' },
        { label: 'ទម្រង់ចែករំលែក', val: 'បោះពុម្ពបិទលើបាវ ឬផ្ញើតាម Telegram' }
      ]
    }
  ]
};

const smesConfig: SectorGuideConfig = {
  sectorKey: 'smes',
  sectorNameKhmer: 'សហគ្រាសធុនតូច & មធ្យម (SMEs Sector)',
  sectorNameEnglish: "Mayany Enterprise & M'day Processing",
  badgeText: "SMEs Sector Only • សហគ្រាស ម៉ាយ៉ានី & M'day",
  badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  descriptionText: 'របៀបគ្រប់គ្រងផលិតផលកែច្នៃ ការគណនាថ្លៃដើមនាំចេញ (B2B Freight) និងផែនការ GHP/HACCP ៦ខែ',
  demoBtnText: '⚡ ចូលពិនិត្យប្រវត្តិសហគ្រាស (1-Click SME Overview)',
  tipText: 'អាចទាញយកឯកសារ Company Profile និងគណនាតម្លៃទំនិញដឹកជញ្ជូនជាកុងតឺន័របានភ្លាមៗ!',
  scenes: [
    {
      id: 0,
      title: 'ជំហានទី ១៖ ពិនិត្យប្រវត្តិ និងចក្ខុវិស័យសហគ្រាសម៉ាយ៉ានី',
      titleKhmer: '១. ប្រវត្តិសហគ្រាស',
      description: 'ស្វែងយល់ពីបេសកកម្មនៃការលើកកម្ពស់កសិផលខ្មែរ គ្រាប់ស្វាយចន្ទី និងម្រេចកំពត GI ទៅកាន់ទីផ្សារពិភពលោក។',
      badge: 'PROFILE',
      icon: '🏢',
      color: 'from-emerald-700 to-teal-800',
      summaryRows: [
        { label: 'ឈ្មោះស្ថាប័ន', val: 'CashewTrace Supply Chains' },
        { label: 'ម៉ាកយីហោស្នូល', val: "Mayany & M'day Lactation", highlight: true },
        { label: 'វិញ្ញាបនបត្រ', val: 'GHP, HACCP Roadmap, GI Kampot' }
      ]
    },
    {
      id: 1,
      title: 'ជំហានទី ២៖ គណនាតម្លៃដឹកជញ្ជូន B2B Container Freight',
      titleKhmer: '២. គណនាថ្លៃដឹកនាំចេញ',
      description: 'ជ្រើសរើសកំពង់ផែគោលដៅ (សហរដ្ឋអាមេរិក អឺរ៉ុប ជប៉ុន ឬចិន) ដើម្បីគណនាតម្លៃ CIF/FOB និងទម្ងន់ផ្ទុកកុងតឺន័រ។',
      badge: 'CALCULATOR',
      icon: '🚢',
      color: 'from-amber-600 to-orange-700',
      summaryRows: [
        { label: 'ទំហំកុងតឺន័រ', val: '20ft FCL (15.5 Metric Tons)' },
        { label: 'កំពង់ផែគោលដៅ', val: 'Long Beach, USA / Rotterdam, EU', highlight: true },
        { label: 'ឯកសារភ្ជាប់', val: 'CoA, Phytosanitary, Bill of Lading' }
      ]
    },
    {
      id: 2,
      title: 'ជំហានទី ៣៖ ទាញយក Road Map HACCP & ទំនាក់ទំនង B2B',
      titleKhmer: '៣. ផែនការ HACCP & B2B',
      description: 'ទាញយកផែនទីបង្ហាញផ្លូវស្តង់ដារគុណភាព ៦ខែ និងទាក់ទងដោយផ្ទាល់ជាមួយថ្នាក់ដឹកនាំសហគ្រាស។',
      badge: 'DOWNLOAD',
      icon: '📑',
      color: 'from-blue-600 to-indigo-700',
      summaryRows: [
        { label: 'ប្រព័ន្ធគ្រប់គ្រង', val: 'CashewTrace Team' },
        { label: 'លេខទូរស័ព្ទ / Email', val: '+855 88 771 2862 • mayany@mayanyenterprise.com', highlight: true },
        { label: 'ទីតាំងប្រតិបត្តិការ', val: 'រាជធានីភ្នំពេញ, កម្ពុជា' }
      ]
    }
  ]
};

const SECTOR_CONFIGS: Record<SectorKey, SectorGuideConfig> = {
  cashew: cashewConfig,
  farmer: cashewConfig,
  smes: smesConfig,
  mayany: smesConfig,
  mango: {
    sectorKey: 'mango',
    sectorNameKhmer: 'ស្វាយកែវរមៀត (Mango Keo Romeat Sector)',
    sectorNameEnglish: 'Keo Romeat GAP & Export Verification',
    badgeText: 'Mango Keo Romeat Pilot Only • វិស័យស្វាយកែវរមៀត',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    descriptionText: 'របៀបចុះឈ្មោះចម្ការស្វាយកែវរមៀត កត់ត្រាស្តង់ដារ GAP ៥ កម្រិត និងទាញយក QR Traceability',
    demoBtnText: '⚡ ចូលគណនីគំរូស្វាយកែវរមៀត (1-Click Mango Demo)',
    tipText: 'អាចជ្រើសរើសចម្ការស្វាយកែវរមៀតកំពង់ស្ពឺ ឬបាត់ដំបង ដើម្បីមើលទិន្នន័យគំរូភ្លាមៗ!',
    scenes: [
      {
        id: 0,
        title: 'ជំហានទី ១៖ ចុះឈ្មោះ ឬជ្រើសរើសគំរូចម្ការស្វាយកែវរមៀត',
        titleKhmer: '១. ចុះឈ្មោះកសិករស្វាយ',
        description: 'បំពេញប្រវត្តិម្ចាស់ចម្ការ ផ្ទៃដីដាំដុះស្វាយកែវរមៀត និងស្ថានភាពវិញ្ញាបនបត្រ GAP ស្តង់ដារកម្ពុជា។',
        badge: 'MANGO REG',
        icon: '🥭',
        color: 'from-amber-500 to-yellow-600',
        summaryRows: [
          { label: 'ម្ចាស់ចម្ការស្វាយ', val: 'ចម្ការស្វាយកែវរមៀតកំពង់ស្ពឺ (Sokha Mean)' },
          { label: 'ពូជស្វាយ', val: 'កែវរមៀតខ្មែរ (Native Keo Romeat)', highlight: true },
          { label: 'ចំនួនដើមស្វាយ', val: '៣៩០ ដើម (ផ្ទៃដី ៤.៥ ហិកតា)' }
        ]
      },
      {
        id: 1,
        title: 'ជំហានទី ២៖ កត់ត្រាប្រតិបត្តិការ ៥ កម្រិត & ស្តង់ដារ GAP',
        titleKhmer: '២. កត់ត្រាការថែទាំ GAP',
        description: 'កត់ត្រាការស្រោចស្រព ប្រភពទឹក ការប្រើប្រាស់ថ្នាំកម្ចាត់សត្វល្អិតសុវត្ថិភាព IPM និងកាលវិភាគច្រូតកាត់។',
        badge: 'GAP AUDIT',
        icon: '📋',
        color: 'from-emerald-600 to-teal-700',
        summaryRows: [
          { label: 'ប្រព័ន្ធស្រោចស្រព', val: 'ស្រោចស្រពដំណក់ទឹក + អណ្តូងសហគមន៍' },
          { label: 'ស្តង់ដារអនុវត្ត', val: 'GAP Certified + IPM Pesticide Safety', highlight: true },
          { label: 'ទិន្នផលរំពឹងទុក', val: '១១,០០០ គីឡូក្រាម (១១ តោន)' }
        ]
      },
      {
        id: 2,
        title: 'ជំហានទី ៣៖ បង្កើត QR Passport & ចែករំលែកទៅកាន់រោងចក្រ',
        titleKhmer: '៣. QR Passport នាំចេញ',
        description: 'ទាញយក QR Code ភ្ជាប់លិខិតបញ្ជាក់ប្រភពចម្ការស្វាយកែវរមៀតសម្រាប់រោងចក្រកែច្នៃដំណាប់ ឬនាំចេញស្រស់!',
        badge: 'EXPORT QR',
        icon: '📲',
        color: 'from-blue-600 to-indigo-700',
        summaryRows: [
          { label: 'លេខកូដឡូតិ៍នាំចេញ', val: 'M-FARM-204-KEO-ROMEAT', highlight: true },
          { label: 'ការត្រួតពិនិត្យជាតិគីមី', val: '✓ អនុលោមតាមកម្រិត MRL អន្តរជាតិ' },
          { label: 'ការទាញយក', val: 'PDF Report & Digital QR Stamp' }
        ]
      }
    ]
  },
  packaging: {
    sectorKey: 'packaging',
    sectorNameKhmer: 'រចនាស្លាកសញ្ញា & ការវេចខ្ចប់ (Packaging & Label CS 001)',
    sectorNameEnglish: 'CS 001:2000 Label & Barcode Studio',
    badgeText: 'Food Label & Packaging CS 001 • ស្តង់ដារជាតិកម្ពុជា',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    descriptionText: 'របៀបបង្កើតស្លាកសញ្ញាម្ហូបអាហារត្រឹមត្រូវតាមស្តង់ដារជាតិ CS 001:2000 ភាសាខ្មែរ-អង់គ្លេស និងបាកូដ EAN-13',
    demoBtnText: '⚡ ចូលរចនាស្លាកសញ្ញាគំរូ (1-Click Label Designer)',
    tipText: 'ប្រព័ន្ធគាំទ្រទាំងភាសាខ្មែរ និងអង់គ្លេស ជាមួយតារាងអាហារូបត្ថម្ភ បាកូដ និង QR Traceability ស្វ័យប្រវត្តិ!',
    scenes: [
      {
        id: 0,
        title: 'ជំហានទី ១៖ ជ្រើសរើសប្រភេទផលិតផល និងទម្រង់វេចខ្ចប់',
        titleKhmer: '១. ជ្រើសរើសផលិតផល',
        description: 'ជ្រើសរើសម្សៅស្វាយចន្ទី គ្រាប់លីងអំបិល ឬម្រេចកំពត រួចជ្រើសរើសប្រភេទកំប៉ុង PP ឬថង់ហ្ស៊ីប។',
        badge: 'PRESET',
        icon: '📦',
        color: 'from-amber-600 to-rose-700',
        summaryRows: [
          { label: 'ផលិតផលគំរូ', val: 'ម្សៅគ្រាប់ស្វាយចន្ទីធម្មជាតិ (Cashew Powder 200g)' },
          { label: 'ទម្រង់វេចខ្ចប់', val: 'កំប៉ុងប្លាស្ទិកចំណីអាហារ PP Jar 200g', highlight: true },
          { label: 'ស្តង់ដារជាតិ', val: 'CS 001:2000 អនុលោមតាមក្រសួងឧស្សាហកម្ម' }
        ]
      },
      {
        id: 1,
        title: 'ជំហានទី ២៖ បញ្ចូលព័ត៌មានអាហារូបត្ថម្ភ & គ្រឿងផ្សំ ២ភាសា',
        titleKhmer: '២. បំពេញគ្រឿងផ្សំ & អាហារូបត្ថម្ភ',
        description: 'បំពេញគ្រឿងផ្សំជាភាសាខ្មែរ-អង់គ្លេស តារាងតម្លៃអាហារូបត្ថម្ភ (Energy, Fat, Protein) និងការព្រមានអាឡែកហ្ស៊ី។',
        badge: 'NUTRITION',
        icon: '🏷️',
        color: 'from-emerald-600 to-teal-700',
        summaryRows: [
          { label: 'គ្រឿងផ្សំខ្មែរ', val: 'គ្រាប់ស្វាយចន្ទីធម្មជាតិ ១០០%' },
          { label: 'ថាមពល / Energy', val: '553 kcal / 2314 kJ (ក្នុង ១០០ក្រាម)', highlight: true },
          { label: 'ការព្រមាន', val: 'មានផ្ទុកគ្រាប់រុក្ខជាតិ (Tree Nuts Warning)' }
        ]
      },
      {
        id: 2,
        title: 'ជំហានទី ៣៖ បង្កើតបាកូដ EAN-13 & បោះពុម្ពស្លាក',
        titleKhmer: '៣. បោះពុម្ពស្លាក & បាកូដ',
        description: 'ប្រព័ន្ធនឹងគណនាបាកូដ EAN-13 កម្ពុជា (884...) ដោយស្វ័យប្រវត្ត រួចអាច Print ឬទាញយកជា PDF ទៅកាន់រោងពុម្ព!',
        badge: 'PRINT READY',
        icon: '🖨️',
        color: 'from-blue-600 to-indigo-700',
        summaryRows: [
          { label: 'បាកូដទំនិញ', val: '884 6000 12345 2 (GS1 Cambodia)', highlight: true },
          { label: 'ទំហំស្លាកស្តង់ដារ', val: '180mm x 65mm (Wrap-around Label)' },
          { label: 'ទម្រង់ Export', val: 'High-Res Print PDF & Label Preview' }
        ]
      }
    ]
  },
  spices: {
    sectorKey: 'spices',
    sectorNameKhmer: 'គ្រឿងទេស & ម្រេចកំពត GI (Spices & Pepper Sector)',
    sectorNameEnglish: 'GI Kampot Pepper & Agri Spices',
    badgeText: 'Spices & GI Kampot Pepper Only • វិស័យគ្រឿងទេស',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    descriptionText: 'របៀបកត់ត្រាប្រភពដើមម្រេចកំពត GI គ្រឿងទេសកម្ពុជា ការត្រួតពិនិត្យសំណើម និងកូដត្រួតពិនិត្យគុណភាព',
    demoBtnText: '⚡ ចូលពិនិត្យវិស័យគ្រឿងទេស (1-Click Spices Demo)',
    tipText: 'អាចស្វែងរកទិន្នន័យកសិផលគ្រឿងទេស ម្រេចខ្មៅ ម្រេចក្រហម ម្រេចស និងស្ករត្នោតកំពង់ស្ពឺ!',
    scenes: [
      {
        id: 0,
        title: 'ជំហានទី ១៖ ជ្រើសរើសប្រភេទគ្រឿងទេស & ខេត្តប្រភពដើម',
        titleKhmer: '១. ជ្រើសរើសគ្រឿងទេស',
        description: 'ជ្រើសរើសម្រេចកំពត GI ស្លឹកគ្រៃ ខ្ញី រមៀត ឬស្ករត្នោត តាមបណ្តាខេត្តកម្ពុជា។',
        badge: 'SPICE ORIGIN',
        icon: '🌿',
        color: 'from-emerald-700 to-green-800',
        summaryRows: [
          { label: 'កសិផលគ្រឿងទេស', val: 'ម្រេចខ្មៅកំពត GI (Black Kampot Pepper)' },
          { label: 'ខេត្តប្រភពដើម', val: 'ខេត្តកំពត & កែប (Kampot & Kep GI Zone)', highlight: true },
          { label: 'វិញ្ញាបនបត្រ', val: 'PGI Cambodia & European Union' }
        ]
      },
      {
        id: 1,
        title: 'ជំហានទី ២៖ កត់ត្រាសំណើម & គុណភាពកម្រិតនាំចេញ',
        titleKhmer: '២. កត់ត្រាកម្រិតគុណភាព',
        description: 'កត់ត្រាសំណើម (Moisture < 12%) ការសម្អាត និងចំណាត់ថ្នាក់គុណភាព Grade A តាមស្តង់ដារអន្តរជាតិ។',
        badge: 'QUALITY LOG',
        icon: '🔬',
        color: 'from-amber-600 to-orange-700',
        summaryRows: [
          { label: 'កម្រិតសំណើម', val: '១១.៥% (Moisture Max 12%)', highlight: true },
          { label: 'ដង់ស៊ីតេទម្ងន់', val: '570 g/L (Grade A Premium)' },
          { label: 'វិធីសាស្ត្រសម្ងួត', val: 'សម្ងួតដោយពន្លឺព្រះអាទិត្យធម្មជាតិ' }
        ]
      },
      {
        id: 2,
        title: 'ជំហានទី ៣៖ បង្កើត QR Traceability & របាយការណ៍នាំចេញ',
        titleKhmer: '៣. QR Traceability នាំចេញ',
        description: 'ទាញយក QR Code បញ្ជាក់ប្រភពចម្ការម្រេចកំពត GI សម្រាប់បិទលើកញ្ចប់ និងផ្ទៀងផ្ទាត់លើទូរស័ព្ទ!',
        badge: 'GI QR CODE',
        icon: '📲',
        color: 'from-blue-600 to-indigo-700',
        summaryRows: [
          { label: 'កូដសម្គាល់ឡូតិ៍', val: 'KP-GI-PEPPER-2026-08', highlight: true },
          { label: 'ការបញ្ជាក់ប្រភព', val: '✓ GI Certified Origin Verification' },
          { label: 'ទម្រង់ចែករំលែក', val: 'QR Batch Passport & Print Report' }
        ]
      }
    ]
  }
};

interface UniversalVideoGuideProps {
  sectorKey: SectorKey;
  onSelectAction?: (action: 'register' | 'login' | 'demo') => void;
}

export default function UniversalSectorVideoGuide({ sectorKey, onSelectAction }: UniversalVideoGuideProps) {
  const config = SECTOR_CONFIGS[sectorKey] || SECTOR_CONFIGS.cashew;
  const [activeStep, setActiveStep] = useState<number>(0);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [activeVideoScene, setActiveVideoScene] = useState<number>(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);

  // Web Speech API Voice Narrator
  const speakScene = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      // Try to find Khmer or English voice
      const voices = window.speechSynthesis.getVoices();
      const khmerVoice = voices.find(v => v.lang.includes('km') || v.lang.includes('kh'));
      if (khmerVoice) {
        utterance.voice = khmerVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  };

  // Trigger voice narration whenever active video scene changes and playing
  useEffect(() => {
    if (isPlaying && videoModalOpen) {
      const current = config.scenes[activeVideoScene];
      if (current) {
        speakScene(`${current.titleKhmer}។ ${current.description}`);
      }
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [activeVideoScene, isPlaying, videoModalOpen, isVoiceEnabled]);

  // Auto-play timer for animated walkthrough simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && videoModalOpen) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setActiveVideoScene((curr) => (curr + 1) % config.scenes.length);
            return 0;
          }
          return prev + 1.2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoModalOpen, config.scenes.length]);

  const handlePlayVideo = () => {
    setVideoModalOpen(true);
    setIsPlaying(true);
    setPlaybackProgress(0);
    setActiveVideoScene(0);
  };

  const currentScene = config.scenes[activeVideoScene] || config.scenes[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl border-2 border-emerald-500/50 shadow-2xl p-5 sm:p-7 space-y-5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tag & Title */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase tracking-wide shadow-md">
              <Sparkles size={13} className="animate-spin" />
              <span>សេចក្តីណែនាំ និងវីដេអូបង្រៀនប្រើប្រាស់ (Video & User Guide)</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${config.badgeColor}`}>
              {config.badgeText}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-white flex items-center gap-2">
            <span>🎬 វីដេអូ & របៀបប្រើប្រាស់៖ {config.sectorNameKhmer}</span>
          </h2>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {config.descriptionText} — សូមចុចប៊ូតុង <strong>"ចាក់វីដេអូណែនាំ (Play Video)"</strong> ខាងក្រោម ដើម្បីទស្សនាការបង្ហាញផ្ទាល់៖
          </p>
        </div>

        {/* Video Tutorial Launcher Button */}
        <button
          type="button"
          onClick={handlePlayVideo}
          className="self-start md:self-center px-5 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-2xl shadow-xl hover:shadow-red-500/40 transition-all transform hover:scale-105 flex items-center gap-3 shrink-0 cursor-pointer border-2 border-red-400/50"
        >
          <div className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center shadow-md animate-pulse">
            <Play size={18} className="fill-red-600 translate-x-0.5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-black tracking-wide flex items-center gap-1.5">
              <span>▶ ចាក់វីដេអូណែនាំ (Play Video)</span>
            </div>
            <div className="text-[10px] text-amber-200 font-normal">វីដេអូបង្រៀនដំណើរការផ្ទាល់ • ២នាទី</div>
          </div>
        </button>
      </div>

      {/* 3 Step Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
        {config.scenes.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
              activeStep === idx
                ? 'bg-slate-900/90 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">{item.icon}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  activeStep === idx ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  ជំហានទី {idx + 1}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white font-sans line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-amber-300 font-sans flex items-start gap-1">
                <span className="shrink-0">💡</span>
                <span>{config.tipText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Bar */}
      <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2.5 text-slate-300 text-xs">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>
            {config.tipText}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onSelectAction && (
            <button
              type="button"
              onClick={() => onSelectAction('demo')}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{config.demoBtnText}</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Video Modal Interactive Simulation */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md">
                  <Play size={18} className="fill-white translate-x-0.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-sans text-white flex items-center gap-2">
                    <span>វីដេអូណែនាំការប្រើប្រាស់៖ {config.sectorNameKhmer}</span>
                    <span className="bg-red-500/20 text-red-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-red-400/30">
                      LIVE TUTORIAL
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    {config.sectorNameEnglish}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setVideoModalOpen(false);
                  setIsPlaying(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Video Screen Body */}
            <div className="relative bg-slate-950 p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-between">
              
              {/* Scene Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {config.scenes.map((scene, idx) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setActiveVideoScene(idx);
                      setPlaybackProgress(0);
                    }}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer flex items-center gap-2 ${
                      activeVideoScene === idx
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      activeVideoScene === idx ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold truncate">
                      {scene.titleKhmer}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main Video Display Window */}
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-700/80 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6">
                
                {/* Scene Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentScene.color} opacity-20 transition-all duration-700`} />

                {/* Top Overlay Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs backdrop-blur-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <span className="font-bold text-amber-300">
                      {currentScene.title}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                    Scene {activeVideoScene + 1}/3
                  </div>
                </div>

                {/* Center Dynamic Visual Animation */}
                <div className="relative z-10 py-3 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border-2 border-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg">
                    {currentScene.icon}
                  </div>

                  <div className="bg-slate-900/90 border border-slate-700 p-3.5 rounded-xl text-left space-y-1.5 shadow-xl max-w-md w-full">
                    {currentScene.summaryRows.map((row, rIdx) => (
                      <div key={rIdx} className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                        <span>{row.label}៖</span>
                        <span className={row.highlight ? 'text-amber-300 font-bold' : 'text-white'}>
                          {row.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-200 font-sans max-w-lg mx-auto bg-slate-950/90 px-4 py-2 rounded-xl border border-slate-800 shadow-md">
                    {currentScene.description}
                  </p>
                </div>

                {/* Video Playback Progress Bar */}
                <div className="relative z-10 space-y-2">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 transition-all duration-100"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-slate-950" />}
                        <span>{isPlaying ? 'ផ្អាក (Pause)' : 'ចាក់បន្ត (Play)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPlaybackProgress(0);
                          setIsPlaying(true);
                        }}
                        className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>ចាក់ឡើងវិញ (Replay)</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isVoiceEnabled;
                          setIsVoiceEnabled(next);
                          if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                          }
                        }}
                        className={`p-1.5 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                          isVoiceEnabled 
                            ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300' 
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                        title={isVoiceEnabled ? 'បិទសំឡេង (Mute Voice)' : 'បើកសំឡេង (Enable Voice)'}
                      >
                        {isVoiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        <span>{isVoiceEnabled ? 'សំឡេង៖ បើក' : 'សំឡេង៖ បិទ'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveVideoScene((prev) => (prev > 0 ? prev - 1 : config.scenes.length - 1));
                          setPlaybackProgress(0);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                      >
                        ◀ ថយក្រោយ
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVideoScene((prev) => (prev + 1) % config.scenes.length);
                          setPlaybackProgress(0);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                      >
                        បន្ទាប់ ▶
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-400 font-sans">
                💡 ចុចប៊ូតុងខាងស្តាំ ដើម្បីចាប់ផ្តើមសាកល្បងអនុវត្តផ្ទាល់!
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setVideoModalOpen(false);
                    setIsPlaying(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  បិទផ្ទាំង (Close)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoModalOpen(false);
                    setIsPlaying(false);
                    if (onSelectAction) onSelectAction('demo');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer transition flex items-center gap-1.5 shadow-lg"
                >
                  <span>⚡ ចូលសាកល្បងភ្លាម (Try Demo Now)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
