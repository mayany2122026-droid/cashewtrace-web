import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Smartphone, CheckCircle2, Play, Pause, RotateCcw, 
  Volume2, VolumeX, ArrowRight, Sparkles, Building, Leaf, 
  Navigation2, Tag, Phone, User, Check, X, Download, HelpCircle,
  ExternalLink, ChevronRight, Share2, PlusSquare, Globe, Mic, MicOff, MapPin, Radio
} from 'lucide-react';
import CashewTraceLogo from './CashewTraceLogo';
import { useLanguage } from '../lib/LanguageContext';

export type SectorKey = 'cashew' | 'farmer' | 'smes' | 'mayany' | 'mango' | 'spices' | 'map' | 'packaging';

interface UnifiedSectorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSector?: SectorKey;
  onComplete: (sector: 'farmer' | 'mayany' | 'mango' | 'map' | 'packaging', userProfile: { name: string; phone: string; sector: string; location?: string; voiceNoteUrl?: string }) => void;
}


interface SectorOption {
  id: 'farmer' | 'mayany' | 'mango' | 'map' | 'packaging';
  titleKhmer: string;
  titleEnglish: string;
  badgeKhmer: string;
  badgeEnglish: string;
  badgeColor: string;
  icon: string;
  sampleNameKhmer: string;
  sampleNameEnglish: string;
  samplePhone: string;
  descriptionKhmer: string;
  descriptionEnglish: string;
  videoScenes: {
    titleKhmer: string;
    titleEnglish: string;
    descriptionKhmer: string;
    descriptionEnglish: string;
    badge: string;
    icon: string;
    color: string;
    summaryRowsKhmer: { label: string; val: string; highlight?: boolean }[];
    summaryRowsEnglish: { label: string; val: string; highlight?: boolean }[];
  }[];
}

const SECTOR_OPTIONS: SectorOption[] = [
  {
    id: 'farmer',
    titleKhmer: 'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទី (ម្ចាស់ចម្ការ, អ្នកប្រមូលទិញ, រោងចក្រ, នាំចេញ)',
    titleEnglish: 'Cashew Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)',
    badgeKhmer: 'អនុលោមភាព EUDR & ខ្សែច្រវ៉ាក់',
    badgeEnglish: 'EUDR Supply Chain',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: '🥜',
    sampleNameKhmer: 'លោក អួន ស៊ីឡុត (Silot Model Farm)',
    sampleNameEnglish: 'Mr. Oun Silot (Silot Model Farm)',
    samplePhone: '012 888 2026',
    descriptionKhmer: 'គ្រប់គ្រងខ្សែច្រវ៉ាក់ទាំងមូល៖ ម្ចាស់ចម្ការ ៣០ហិកតា, ចាប់ GPS, ស៊ីឡូស្តុក, និងបង្កើត EUDR QR Passport សម្រាប់នាំចេញ',
    descriptionEnglish: 'Manage full supply chain: 30ha orchard GPS plots, aggregation, drying silos, and EUDR QR Passports for export',
    videoScenes: [
      {
        titleKhmer: 'ជំហានទី ១៖ ចុះឈ្មោះកសិករ ឬចម្ការស្វាយចន្ទី',
        titleEnglish: 'Step 1: Register Farmer & Cashew Orchard',
        descriptionKhmer: 'បំពេញឈ្មោះ លេខទូរស័ព្ទ និងផ្ទៃដីដាំដុះស្វាយចន្ទីក្នុងខេត្តកំពង់ធំ ឬក្រចេះ។',
        descriptionEnglish: 'Fill in farmer name, phone number, and cashew plantation area in Kampong Thom or Kratie.',
        badge: 'REGISTER',
        icon: '📝',
        color: 'from-amber-600 to-amber-700',
        summaryRowsKhmer: [
          { label: 'ម្ចាស់ចម្ការ', val: 'ចម្ការស្វាយចន្ទីគំរូ (Silot Farm)' },
          { label: 'ខេត្តដាំដុះ', val: 'កំពង់ធំ (Kampong Thom)', highlight: true },
          { label: 'ផ្ទៃដី', val: '៣០ ហិកតា (៦,០០០ ដើម)' }
        ],
        summaryRowsEnglish: [
          { label: 'Farm Owner', val: 'Silot Model Farm' },
          { label: 'Province', val: 'Kampong Thom', highlight: true },
          { label: 'Land Area', val: '30 Hectares (6,000 Trees)' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ២៖ កត់ត្រាការថែទាំ ដាក់ជី និង GPS ចម្ការ',
        titleEnglish: 'Step 2: Log Farm Activities, Fertilizer & GPS',
        descriptionKhmer: 'ជ្រើសរើសប្រភេទជីសរីរាង្គ Meltert និងចុចចាប់យកកូអរដោនេ GPS ជាក់ស្តែងក្នុងចម្ការ។',
        descriptionEnglish: 'Select organic Meltert fertilizer and capture real-time GPS coordinates directly inside the orchard.',
        badge: 'FARM LOG',
        icon: '📍',
        color: 'from-emerald-600 to-teal-700',
        summaryRowsKhmer: [
          { label: 'សកម្មភាពថែទាំ', val: 'ដាក់ជីសរីរាង្គ + កាត់មែក' },
          { label: 'កូអរដោនេ GPS', val: 'Lat: 12.7112, Lng: 104.8887', highlight: true },
          { label: 'ទិន្នផលរំពឹងទុក', val: '៤៥ តោន' }
        ],
        summaryRowsEnglish: [
          { label: 'Activity', val: 'Organic Fertilization + Pruning' },
          { label: 'GPS Coordinates', val: 'Lat: 12.7112, Lng: 104.8887', highlight: true },
          { label: 'Expected Yield', val: '45 Metric Tons' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ៣៖ បង្កើត និងបោះពុម្ព EUDR QR Passport',
        titleEnglish: 'Step 3: Generate & Export EUDR QR Passport',
        descriptionKhmer: 'ប្រព័ន្ធនឹងបង្កើត QR Code បញ្ជាក់ប្រភពចម្ការមិនកាប់ព្រៃឈើសម្រាប់បិទលើបាវស្វាយចន្ទី!',
        descriptionEnglish: 'The system automatically generates a non-deforestation verified QR passport for packaging bags!',
        badge: 'EUDR QR',
        icon: '📲',
        color: 'from-blue-600 to-indigo-700',
        summaryRowsKhmer: [
          { label: 'EUDR Passport', val: 'KM-CASHEW-2026-B359', highlight: true },
          { label: 'ស្តង់ដារ', val: '✓ អនុលោមភាពសហភាពអឺរ៉ុប EUDR' },
          { label: 'ទម្រង់ចែករំលែក', val: 'បោះពុម្ពបិទលើបាវ ឬផ្ញើតាម Telegram' }
        ],
        summaryRowsEnglish: [
          { label: 'EUDR Passport', val: 'KM-CASHEW-2026-B359', highlight: true },
          { label: 'Standard', val: '✓ EU Deforestation Compliant' },
          { label: 'Share Format', val: 'Bag Print Sticker or Telegram' }
        ]
      }
    ]
  },
  {
    id: 'mayany',
    titleKhmer: 'សហគ្រាសធុនតូច & មធ្យម (Mayany SMEs)',
    titleEnglish: "Mayany Enterprise & M'day Processing",
    badgeKhmer: 'ការកែច្នៃ GHP & HACCP',
    badgeEnglish: 'GHP & HACCP Processing',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: '🏢',
    sampleNameKhmer: 'អ្នកស្រី ម៉ាយ៉ានី (Mayany Founder)',
    sampleNameEnglish: 'Ms. Mayany SAM (Mayany Founder)',
    samplePhone: '061 734 415',
    descriptionKhmer: 'គ្រប់គ្រងផលិតផលកែច្នៃ គណនាថ្លៃដឹកជញ្ជូន B2B Container Freight និងផែនទី HACCP ៦ខែ',
    descriptionEnglish: 'Agro-processing catalogue, B2B container freight cost estimator, and 6-month GHP/HACCP roadmap',
    videoScenes: [
      {
        titleKhmer: 'ជំហានទី ១៖ គ្រប់គ្រងកាតាឡុកផលិតផលកែច្នៃ',
        titleEnglish: 'Step 1: Manage Agro-Processed Product Catalogue',
        descriptionKhmer: 'គ្រប់គ្រងផលិតផលជំនួយទឹកដោះ M\'day Lactation បារគ្រាប់ស្វាយចន្ទី និងកំណត់ត្រា batch កែច្នៃ។',
        descriptionEnglish: 'Manage M\'day lactation snack bars, cashew products, and standard processing batch records.',
        badge: 'PRODUCTS',
        icon: '🥛',
        color: 'from-emerald-700 to-teal-800',
        summaryRowsKhmer: [
          { label: 'ផលិតផលស្នូល', val: 'M\'day Lactation Cashew Bar' },
          { label: 'ឡូតិ៍កែច្នៃ', val: 'MAYANY-2026-B108', highlight: true },
          { label: 'សមត្ថភាពកែច្នៃ', val: '១៥,០០០ ប្រអប់/ខែ' }
        ],
        summaryRowsEnglish: [
          { label: 'Core Product', val: 'M\'day Lactation Cashew Bar' },
          { label: 'Batch ID', val: 'MAYANY-2026-B108', highlight: true },
          { label: 'Capacity', val: '15,000 Boxes / Month' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ២៖ គណនាថ្លៃដឹកជញ្ជូននាំចេញ B2B Freight',
        titleEnglish: 'Step 2: Calculate B2B Export Freight Costing',
        descriptionKhmer: 'ជ្រើសរើសទំហំកុងតឺន័រ 20ft/40ft FCL និងកំពង់ផែគោលដៅ (សិង្ហបុរី ជប៉ុន ឬអាមេរិក) ដើម្បីដឹងថ្លៃដើម។',
        descriptionEnglish: 'Select 20ft/40ft FCL container and target ports (Singapore, Japan, USA) for exact CIF/FOB cost.',
        badge: 'EXPORT COST',
        icon: '🚢',
        color: 'from-amber-600 to-orange-700',
        summaryRowsKhmer: [
          { label: 'ប្រភេទកុងតឺន័រ', val: '20ft FCL (១៥ តោន)' },
          { label: 'កំពង់ផែគោលដៅ', val: 'Tokyo, Japan (CIF)', highlight: true },
          { label: 'ថ្លៃដើមសរុប', val: '$2,850 / Container' }
        ],
        summaryRowsEnglish: [
          { label: 'Container Type', val: '20ft FCL (15 MT)' },
          { label: 'Destination', val: 'Tokyo, Japan (CIF)', highlight: true },
          { label: 'Total Freight', val: '$2,850 / Container' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ៣៖ តាមដានផែនការស្តង់ដារ HACCP ៦ខែ',
        titleEnglish: 'Step 3: Track 6-Month GHP / HACCP Roadmap',
        descriptionKhmer: 'ពិនិត្យមើល Checklist អនាម័យបុគ្គលិក ការគ្រប់គ្រងសត្វល្អិត និងការត្រៀម Audit វិញ្ញាបនបត្រ។',
        descriptionEnglish: 'Review sanitation checklists, pest control audits, and certification readiness workflows.',
        badge: 'HACCP READY',
        icon: '🛡️',
        color: 'from-blue-600 to-indigo-700',
        summaryRowsKhmer: [
          { label: 'វឌ្ឍនភាព HACCP', val: '៧៥% (ដំណាក់កាលទី ៤)', highlight: true },
          { label: 'ការបណ្តុះបណ្តាល', val: '១២ នាក់បានបញ្ចប់វគ្គ GHP' },
          { label: 'គោលដៅ Audit', val: 'ខែ មិថុនា ឆ្នាំ ២០២៦' }
        ],
        summaryRowsEnglish: [
          { label: 'HACCP Progress', val: '75% (Phase 4)', highlight: true },
          { label: 'Staff Trained', val: '12 Personnel Certified in GHP' },
          { label: 'Audit Target', val: 'June 2026' }
        ]
      }
    ]
  },
  {
    id: 'mango',
    titleKhmer: 'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយកែវរមៀត (ម្ចាស់ចម្ការ, អ្នកប្រមូលទិញ, រោងចក្រ, នាំចេញ)',
    titleEnglish: 'Mango Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)',
    badgeKhmer: 'ស្តង់ដារ CamGAP & ខ្សែច្រវ៉ាក់នាំចេញ',
    badgeEnglish: 'CamGAP & Export Supply Chain',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    icon: '🥭',
    sampleNameKhmer: 'លោក សុខា (ចម្ការស្វាយកែវរមៀត GAP)',
    sampleNameEnglish: 'Mr. Sokha (Keo Romeat GAP Farm)',
    samplePhone: '097 999 1234',
    descriptionKhmer: 'គ្រប់គ្រងខ្សែច្រវ៉ាក់ស្វាយកែវរមៀតទាំងមូល៖ ចម្ការ CamGAP, អ្នកប្រមូលទិញ Grade A/B/C, រោងចក្រដំណាប់ និងការនាំចេញ',
    descriptionEnglish: 'Manage full mango supply chain: CamGAP orchards, Grade A/B/C sorting, dried fruit processors, and export logistics',
    videoScenes: [
      {
        titleKhmer: 'ជំហានទី ១៖ ចុះឈ្មោះចម្ការស្វាយ GAP & សមាជិក',
        titleEnglish: 'Step 1: Register GAP Mango Farm & Members',
        descriptionKhmer: 'បញ្ចូលទីតាំងចម្ការខេត្តកំពង់ស្ពឺ ឬបាត់ដំបង និងចំនួនដើមស្វាយកែវរមៀតជាក់ស្តែង។',
        descriptionEnglish: 'Register orchard in Kampong Speu or Battambang and log active Keo Romeat tree count.',
        badge: 'GAP REGISTER',
        icon: '🥭',
        color: 'from-orange-600 to-amber-700',
        summaryRowsKhmer: [
          { label: 'ពូជស្វាយ', val: 'ស្វាយកែវរមៀត (Keo Romeat)' },
          { label: 'ទីតាំងចម្ការ', val: 'ខេត្តកំពង់ស្ពឺ (Kampong Speu)', highlight: true },
          { label: 'ចំនួនដើម', val: '២,៥០០ ដើម (ស្តង់ដារ CamGAP)' }
        ],
        summaryRowsEnglish: [
          { label: 'Mango Variety', val: 'Keo Romeat' },
          { label: 'Location', val: 'Kampong Speu Province', highlight: true },
          { label: 'Tree Count', val: '2,500 Trees (CamGAP Standard)' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ២៖ កត់ត្រាការប្រមូលផល & ចំណាត់ថ្នាក់ Grade A, B, C',
        titleEnglish: 'Step 2: Record Harvest & Grading A/B/C',
        descriptionKhmer: 'កត់ត្រាបរិមាណផ្លែស្វាយបេះបាន ការបែងចែកទំហំ និងកម្រិតជាតិផ្អែម Brix 14°+។',
        descriptionEnglish: 'Record daily picked crates, size grading, and sugar sweetness Brix level (14°+).',
        badge: 'GRADING',
        icon: '⚖️',
        color: 'from-emerald-600 to-teal-700',
        summaryRowsKhmer: [
          { label: 'បរិមាណ Grade A', val: '១៨.៥ តោន (នាំចេញស្រស់)', highlight: true },
          { label: 'បរិមាណ Grade B/C', val: '១២.០ តោន (សម្រាប់ដំណាប់ស្វាយ)' },
          { label: 'កម្រិតជាតិផ្អែម', val: 'Brix 15.2° (គុណភាពល្អឥតខ្ចោះ)' }
        ],
        summaryRowsEnglish: [
          { label: 'Grade A Export', val: '18.5 Metric Tons (Fresh Export)', highlight: true },
          { label: 'Grade B/C', val: '12.0 Metric Tons (Dried Mango)' },
          { label: 'Sweetness Brix', val: 'Brix 15.2° (Premium Quality)' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ៣៖ បង្កើត QR Code តាមដានប្រភពផ្លែស្វាយ',
        titleEnglish: 'Step 3: Generate Mango Provenance QR Code',
        descriptionKhmer: 'បង្កើត QR Code សម្រាប់បិទលើកេសនាំចេញ ដើម្បីឱ្យអ្នកទិញស្កេនពិនិត្យមើលចម្ការដើម!',
        descriptionEnglish: 'Create QR sticker for export cartons for buyers and supermarket shoppers to trace the farm origin!',
        badge: 'MANGO QR',
        icon: '📲',
        color: 'from-blue-600 to-indigo-700',
        summaryRowsKhmer: [
          { label: 'កូដសម្គាល់ឡូតិ៍', val: 'MG-KEO-2026-B88', highlight: true },
          { label: 'វិញ្ញាបនបត្រ', val: '✓ CamGAP Certified Farm' },
          { label: 'គោលដៅទីផ្សារ', val: 'នាំចេញទៅប្រទេសចិន & កូរ៉េខាងត្បូង' }
        ],
        summaryRowsEnglish: [
          { label: 'Batch Code', val: 'MG-KEO-2026-B88', highlight: true },
          { label: 'Certification', val: '✓ CamGAP Certified Farm' },
          { label: 'Destination', val: 'Export to China & South Korea' }
        ]
      }
    ]
  },
  {
    id: 'map',
    titleKhmer: 'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ម្រេច & គ្រឿងទេស (ម្ចាស់ចម្ការ, អ្នកប្រមូលទិញ, រោងចក្រ, នាំចេញ)',
    titleEnglish: 'Pepper & Spices Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)',
    badgeKhmer: 'សម្គាល់ភូមិសាស្ត្រ GI & ខ្សែច្រវ៉ាក់នាំចេញ',
    badgeEnglish: 'GI & Export Supply Chain',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    icon: '🌿',
    sampleNameKhmer: 'លោក ចាន់រ៉ា (សមាគមម្រេចកំពត GI)',
    sampleNameEnglish: 'Mr. Chanra (Kampot Pepper GI)',
    samplePhone: '088 777 9922',
    descriptionKhmer: 'គ្រប់គ្រងខ្សែច្រវ៉ាក់ម្រេចកំពត GI និងគ្រឿងទេស៖ ចម្ការសរីរាង្គ, អ្នកប្រមូលទិញ, រោងចក្រកិនវេចខ្ចប់ និងការនាំចេញ',
    descriptionEnglish: 'Manage full pepper & spices supply chain: KPPA GI organic plantations, aggregation, milling, and export logistics',
    videoScenes: [
      {
        titleKhmer: 'ជំហានទី ១៖ ជ្រើសរើសប្រភេទគ្រឿងទេស & ខេត្តប្រភព',
        titleEnglish: 'Step 1: Select Spice Type & Origin Province',
        descriptionKhmer: 'ជ្រើសរើសម្រេចកំពត GI ស្លឹកគ្រៃ ខ្ញី រមៀត ឬស្ករត្នោត តាមបណ្តាខេត្តកម្ពុជា។',
        descriptionEnglish: 'Select GI Kampot pepper, lemongrass, ginger, turmeric, or natural palm sugar across Cambodia.',
        badge: 'SPICE ORIGIN',
        icon: '🌿',
        color: 'from-emerald-700 to-green-800',
        summaryRowsKhmer: [
          { label: 'កសិផលគ្រឿងទេស', val: 'ម្រេចខ្មៅកំពត GI (Black Kampot Pepper)' },
          { label: 'ខេត្តប្រភពដើម', val: 'ខេត្តកំពត & កែប (GI Protected Zone)', highlight: true },
          { label: 'វិញ្ញាបនបត្រ', val: 'PGI Cambodia & European Union' }
        ],
        summaryRowsEnglish: [
          { label: 'Spice Product', val: 'Black Kampot Pepper (GI)' },
          { label: 'Origin Province', val: 'Kampot & Kep (Protected Zone)', highlight: true },
          { label: 'Certification', val: 'PGI Cambodia & EU' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ២៖ កត់ត្រាសំណើម & គុណភាពនាំចេញ',
        titleEnglish: 'Step 2: Record Moisture & Export Grading',
        descriptionKhmer: 'កត់ត្រាសំណើម (Moisture < 12%) ការសម្អាត និងចំណាត់ថ្នាក់គុណភាព Grade A។',
        descriptionEnglish: 'Log moisture (<12%), cleaning protocols, and Grade A export density rating (570 g/L).',
        badge: 'QUALITY LOG',
        icon: '🔬',
        color: 'from-amber-600 to-orange-700',
        summaryRowsKhmer: [
          { label: 'កម្រិតសំណើម', val: '១១.៥% (Moisture Max 12%)', highlight: true },
          { label: 'ដង់ស៊ីតេទម្ងន់', val: '570 g/L (Grade A Premium)' },
          { label: 'វិធីសម្ងួត', val: 'សម្ងួតដោយពន្លឺព្រះអាទិត្យធម្មជាតិ' }
        ],
        summaryRowsEnglish: [
          { label: 'Moisture Level', val: '11.5% (Max 12% Standard)', highlight: true },
          { label: 'Density Weight', val: '570 g/L (Grade A Premium)' },
          { label: 'Drying Method', val: 'Natural Sun-Dried' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ៣៖ បង្កើត QR Traceability ម្រេចកំពត GI',
        titleEnglish: 'Step 3: Generate Kampot Pepper GI Traceability QR',
        descriptionKhmer: 'ទាញយក QR Code បញ្ជាក់ប្រភពចម្ការម្រេចកំពត GI សម្រាប់បិទលើកញ្ចប់ និងផ្ទៀងផ្ទាត់លើទូរស័ព្ទ!',
        descriptionEnglish: 'Download verified GI Kampot Pepper origin QR code for package labelling and phone scanning!',
        badge: 'GI QR CODE',
        icon: '📲',
        color: 'from-blue-600 to-indigo-700',
        summaryRowsKhmer: [
          { label: 'កូដសម្គាល់ឡូតិ៍', val: 'KP-GI-PEPPER-2026-08', highlight: true },
          { label: 'ការបញ្ជាក់ប្រភព', val: '✓ GI Certified Origin Verification' },
          { label: 'ទម្រង់ចែករំលែក', val: 'QR Batch Passport & Print Report' }
        ],
        summaryRowsEnglish: [
          { label: 'Batch ID', val: 'KP-GI-PEPPER-2026-08', highlight: true },
          { label: 'Verification', val: '✓ GI Certified Origin Verification' },
          { label: 'Share Format', val: 'QR Batch Passport & Print Report' }
        ]
      }
    ]
  },
  {
    id: 'packaging',
    titleKhmer: 'ស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល',
    titleEnglish: 'Digital Packaging Label',
    badgeKhmer: 'ស្តង់ដារ CS 001 & បាកូដ',
    badgeEnglish: 'CS 001 & Barcode',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    icon: '🏷️',
    sampleNameKhmer: 'អ្នកស្រី សុភា (ស្ទីកឃ័រ CS 001)',
    sampleNameEnglish: 'Ms. Sothea (CS 001 Studio)',
    samplePhone: '077 555 1234',
    descriptionKhmer: 'រចនាស្លាកសញ្ញាវេចខ្ចប់ឌីជីថលត្រឹមត្រូវតាមស្តង់ដារជាតិ CS 001:2000 និងបាកូដ EAN-13',
    descriptionEnglish: 'Design digital packaging labels compliant with Cambodian National Standard CS 001:2000 & EAN-13 barcodes',
    videoScenes: [
      {
        titleKhmer: 'ជំហានទី ១៖ ជ្រើសរើសប្រភេទផលិតផល & ទម្រង់វេចខ្ចប់',
        titleEnglish: 'Step 1: Choose Product & Packaging Form Factor',
        descriptionKhmer: 'ជ្រើសរើសម្សៅស្វាយចន្ទី គ្រាប់លីងអំបិល ឬម្រេចកំពត រួចជ្រើសរើសប្រភេទកំប៉ុង PP ឬថង់ហ្ស៊ីប។',
        descriptionEnglish: 'Select cashew powder, roasted cashew kernels, or spices, then pick PP jar or zip pouch format.',
        badge: 'PRESET',
        icon: '📦',
        color: 'from-amber-600 to-rose-700',
        summaryRowsKhmer: [
          { label: 'ផលិតផលគំរូ', val: 'ម្សៅគ្រាប់ស្វាយចន្ទីធម្មជាតិ (Cashew Powder 200g)' },
          { label: 'ទម្រង់វេចខ្ចប់', val: 'កំប៉ុងប្លាស្ទិកចំណីអាហារ PP Jar 200g', highlight: true },
          { label: 'ស្តង់ដារជាតិ', val: 'CS 001:2000 អនុលោមតាមក្រសួងឧស្សាហកម្ម' }
        ],
        summaryRowsEnglish: [
          { label: 'Sample Product', val: 'Pure Natural Cashew Powder 200g' },
          { label: 'Packaging Type', val: 'Food-Grade PP Plastic Jar 200g', highlight: true },
          { label: 'National Standard', val: 'CS 001:2000 Compliant (MISTI)' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ២៖ បំពេញព័ត៌មានអាហារូបត្ថម្ភ & គ្រឿងផ្សំ',
        titleEnglish: 'Step 2: Fill Nutrition Facts & Ingredients',
        descriptionKhmer: 'បំពេញគ្រឿងផ្សំ តារាងតម្លៃអាហារូបត្ថម្ភ និងការព្រមានអាឡែកហ្ស៊ីស្របតាមច្បាប់។',
        descriptionEnglish: 'Complete bilingual ingredients, nutrition facts table, and allergen warnings.',
        badge: 'NUTRITION',
        icon: '🏷️',
        color: 'from-emerald-600 to-teal-700',
        summaryRowsKhmer: [
          { label: 'គ្រឿងផ្សំ', val: 'គ្រាប់ស្វាយចន្ទីធម្មជាតិ ១០០%' },
          { label: 'ថាមពល / Energy', val: '553 kcal / 2314 kJ (ក្នុង ១០០ក្រាម)', highlight: true },
          { label: 'ការព្រមាន', val: 'មានផ្ទុកគ្រាប់រុក្ខជាតិ (Tree Nuts Warning)' }
        ],
        summaryRowsEnglish: [
          { label: 'Ingredients', val: '100% Pure Natural Cashew Nut' },
          { label: 'Energy Value', val: '553 kcal / 2314 kJ (per 100g)', highlight: true },
          { label: 'Allergen Alert', val: 'Contains Tree Nuts' }
        ]
      },
      {
        titleKhmer: 'ជំហានទី ៣៖ បង្កើតបាកូដ EAN-13 & បោះពុម្ពស្លាក',
        titleEnglish: 'Step 3: Generate EAN-13 Barcode & Export Label',
        descriptionKhmer: 'ប្រព័ន្ធនឹងគណនាបាកូដ EAN-13 កម្ពុជា (884...) ដោយស្វ័យប្រវត្ត រួចអាច Print ឬទាញយកជា PDF ទៅកាន់រោងពុម្ព!',
        descriptionEnglish: 'The platform generates Cambodia EAN-13 barcode (884...) ready for high-resolution print or PDF export!',
        badge: 'PRINT READY',
        icon: '🖨️',
        color: 'from-blue-600 to-indigo-700',
        summaryRowsKhmer: [
          { label: 'បាកូដទំនិញ', val: '884 6000 12345 2 (GS1 Cambodia)', highlight: true },
          { label: 'ទំហំស្លាកស្តង់ដារ', val: '180mm x 65mm (Wrap-around Label)' },
          { label: 'ទម្រង់ Export', val: 'High-Res Print PDF & Label Preview' }
        ],
        summaryRowsEnglish: [
          { label: 'Barcode', val: '884 6000 12345 2 (GS1 Cambodia)', highlight: true },
          { label: 'Label Dimension', val: '180mm x 65mm (Wrap-around)' },
          { label: 'Export Format', val: 'High-Res Print PDF & Label Preview' }
        ]
      }
    ]
  }
];

export default function UnifiedSectorOnboardingModal({
  isOpen,
  onClose,
  defaultSector = 'farmer',
  onComplete
}: UnifiedSectorOnboardingModalProps) {
  const { isKhmer, isGerman, language, setLanguage, t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSector, setSelectedSector] = useState<'farmer' | 'mayany' | 'mango' | 'map' | 'packaging'>('farmer');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userGpsLocation, setUserGpsLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  
  // Voice recording states for non-reading/writing users
  const [isVoiceLogging, setIsVoiceLogging] = useState(false);
  const [voiceNoteBlob, setVoiceNoteBlob] = useState<Blob | null>(null);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string>('');
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<any>(null);

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [activeVideoScene, setActiveVideoScene] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  // Map incoming sector prop
  useEffect(() => {
    if (defaultSector === 'cashew' || defaultSector === 'farmer') setSelectedSector('farmer');
    else if (defaultSector === 'smes' || defaultSector === 'mayany') setSelectedSector('mayany');
    else if (defaultSector === 'mango') setSelectedSector('mango');
    else if (defaultSector === 'spices' || defaultSector === 'map') setSelectedSector('map');
    else if (defaultSector === 'packaging') setSelectedSector('packaging');
  }, [defaultSector]);

  // Selected Sector Object
  const currentSectorObj = SECTOR_OPTIONS.find(s => s.id === selectedSector) || SECTOR_OPTIONS[0];

  // Auto-fill preset when sector changes
  const applyPreset = (sector: SectorOption) => {
    setSelectedSector(sector.id);
    setFullName(isKhmer ? sector.sampleNameKhmer : sector.sampleNameEnglish);
    setPhoneNumber(sector.samplePhone);
  };

  // One-Tap GPS Auto-Capture
  const handleAutoCaptureGps = () => {
    setIsCapturingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(5));
          const lng = parseFloat(pos.coords.longitude.toFixed(5));
          setUserGpsLocation({
            lat,
            lng,
            address: `GPS: ${lat}, ${lng} (Cambodia Farm Location)`
          });
          setIsCapturingGps(false);
        },
        () => {
          // Fallback location for demo in Cambodia
          setUserGpsLocation({
            lat: 12.7112,
            lng: 104.8887,
            address: 'GPS: 12.7112, 104.8887 (Kampong Thom Farm Center)'
          });
          setIsCapturingGps(false);
        },
        { timeout: 6000 }
      );
    } else {
      setUserGpsLocation({
        lat: 12.7112,
        lng: 104.8887,
        address: 'GPS: 12.7112, 104.8887 (Kampong Thom Farm Center)'
      });
      setIsCapturingGps(false);
    }
  };

  // Voice note recording for accessibility
  const startVoiceLogging = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) voiceChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setVoiceNoteBlob(blob);
        setVoiceNoteUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };

      mr.start(100);
      setIsVoiceLogging(true);
      setVoiceSeconds(0);
      voiceTimerRef.current = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Voice recording error:', err);
    }
  };

  const stopVoiceLogging = () => {
    if (mediaRecorderRef.current && isVoiceLogging) {
      mediaRecorderRef.current.stop();
      setIsVoiceLogging(false);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    }
  };

  // Speech Synthesis Voice Function
  const speakNarration = (khText: string, enText: string, deText?: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const textToSpeak = isGerman && deText ? deText : isKhmer ? khText : enText;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = isKhmer ? 0.92 : 0.98;
      utterance.pitch = 1.0;
      utterance.lang = isGerman ? 'de-DE' : isKhmer ? 'km-KH' : 'en-US';
      
      const voices = window.speechSynthesis.getVoices();
      if (isGerman) {
        const deVoice = voices.find(v => v.lang.includes('de'));
        if (deVoice) utterance.voice = deVoice;
      } else if (isKhmer) {
        const khmerVoice = voices.find(v => v.lang.includes('km') || v.lang.includes('kh'));
        if (khmerVoice) utterance.voice = khmerVoice;
      } else {
        const enVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB') || v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  // Handle Step 1: Send SMS & Transition to Step 2 (Auto-Fill OTP)
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      applyPreset(currentSectorObj);
    }
    // Auto trigger GPS capture if not already set
    if (!userGpsLocation) {
      handleAutoCaptureGps();
    }
    setStep(2);
    setIsAutoVerifying(true);

    // Auto-fill 6-digit code with realistic animation
    const mockOtp = ['8', '8', '2', '0', '2', '6'];
    mockOtp.forEach((digit, idx) => {
      setTimeout(() => {
        setOtpCode(prev => {
          const next = [...prev];
          next[idx] = digit;
          return next;
        });
      }, (idx + 1) * 200);
    });

    // Auto-verify after all digits filled
    setTimeout(() => {
      setIsAutoVerifying(false);
      setIsVerified(true);
      speakNarration(
        "ការផ្ទៀងផ្ទាត់លេខទូរស័ព្ទជោគជ័យ។ សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ!",
        "Phone verification successful. Welcome to the platform!",
        "Telefonverifizierung erfolgreich. Willkommen auf der Plattform!"
      );
      setTimeout(() => {
        setStep(3);
      }, 1200);
    }, 1800);
  };

  // Step 3 to Step 4 transition: Launch Video Guide
  const handleContinueToVideo = () => {
    setStep(4);
    setIsVideoPlaying(true);
    setActiveVideoScene(0);
    setVideoProgress(0);
  };

  // Trigger voice narration whenever active video scene changes on Step 4
  useEffect(() => {
    if (step === 4 && isVideoPlaying) {
      const scene = currentSectorObj.videoScenes[activeVideoScene];
      if (scene) {
        speakNarration(
          `${scene.titleKhmer}។ ${scene.descriptionKhmer}`,
          `${scene.titleEnglish}. ${scene.descriptionEnglish}`
        );
      }
    } else if (step !== 4) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [step, activeVideoScene, isVideoPlaying, currentSectorObj, isVoiceEnabled, isKhmer, isGerman]);

  // Video progress timer simulation
  useEffect(() => {
    let interval: any = null;
    if (step === 4 && isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setActiveVideoScene(curr => (curr + 1) % currentSectorObj.videoScenes.length);
            return 0;
          }
          return prev + 1.2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [step, isVideoPlaying, currentSectorObj.videoScenes.length]);

  // Finish Onboarding and enter sector
  const handleFinishOnboarding = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const defaultName = isKhmer ? currentSectorObj.sampleNameKhmer : currentSectorObj.sampleNameEnglish;
    const userProfile = {
      name: fullName || defaultName,
      phone: phoneNumber || currentSectorObj.samplePhone,
      sector: selectedSector,
      location: userGpsLocation?.address || 'Kampong Thom, Cambodia',
      voiceNoteUrl: voiceNoteUrl || undefined,
      verified: true
    };
    localStorage.setItem('cashewtrace_user_profile', JSON.stringify(userProfile));
    onComplete(selectedSector, userProfile);
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/60 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 px-5 py-4 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CashewTraceLogo className="h-8" variant="whiteText" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  {t('ប្រព័ន្ធចុះឈ្មោះ & វីដេអូបង្រៀន', '5-Sector Quick Onboarding & Video')}
                </span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Step {step} of 4
                </span>
              </div>
              <div className="text-[11px] text-emerald-300">
                {step === 1 && t('ជំហានទី ១៖ ជ្រើសរើសវិស័យ & បញ្ចូលឈ្មោះ/លេខទូរស័ព្ទ', 'Step 1: Select Sector & Enter Name / Phone')}
                {step === 2 && t('ជំហានទី ២៖ ផ្ទៀងផ្ទាត់លេខកូដ SMS ៦ខ្ទង់ស្វ័យប្រវត្តិ', 'Step 2: Automated 6-Digit SMS OTP Verification')}
                {step === 3 && t('ជំហានទី ៣៖ ដំឡើងលើ Home Screen ទូរស័ព្ទដៃ', 'Step 3: Add to Phone Home Screen')}
                {step === 4 && t('ជំហានទី ៤៖ វីដេអូ & សំឡេងណែនាំរបៀបប្រើប្រាស់', 'Step 4: Interactive Video & Voice Narration Guide')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Modal Language Selector */}
            <div className="inline-flex items-center rounded-xl p-0.5 bg-slate-800 border border-slate-700">
              <button
                type="button"
                onClick={() => setLanguage('kh')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  isKhmer ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇰🇭 ខ្មែរ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('de')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  language === 'de' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇩🇪 DE
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress Step Indicator Bar */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950 border-b border-slate-800">
          {[
            { num: 1, label: t('១. គណនី', '1. Account') },
            { num: 2, label: t('២. SMS OTP', '2. SMS OTP') },
            { num: 3, label: t('៣. Home Screen', '3. Install') },
            { num: 4, label: t('៤. វីដេអូណែនាំ', '4. Video') }
          ].map(s => (
            <div 
              key={s.num} 
              className={`h-1.5 rounded-full transition-all ${
                step >= s.num ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Dynamic Step Content */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* STEP 1: Welcome & Sector Selection + Name/Phone */}
          {step === 1 && (
            <form onSubmit={handleSendSms} className="space-y-5">
              <div className="text-center space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2">
                  <span>{t('សូមស្វាគមន៍មកកាន់ប្រព័ន្ធកសិផល & សហគ្រាសខ្មែរ', 'Welcome to Cambodian Agriculture & MSME Platform')}</span>
                </h3>
                <p className="text-xs text-slate-300">
                  {t(
                    'មិនបាច់មាន Email ឡើយ! គ្រាន់តែជ្រើសរើសវិស័យ និងបញ្ចូលឈ្មោះ/លេខទូរស័ព្ទដើម្បីចូលប្រើប្រាស់៖',
                    'No Email required! Simply choose your sector and enter your name and phone number to begin:'
                  )}
                </p>
              </div>

              {/* 5 Sector Option Selector Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-400 block">
                  {t('១. ជ្រើសរើសវិស័យកសិផល ឬសហគ្រាសរបស់អ្នក៖', '1. Select Your Agricultural Sector or Enterprise:')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SECTOR_OPTIONS.map((sec) => (
                    <div
                      key={sec.id}
                      onClick={() => applyPreset(sec)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        selectedSector === sec.id
                          ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                        {sec.icon}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <div className="text-xs font-bold text-white truncate">
                            {isKhmer ? sec.titleKhmer : sec.titleEnglish}
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${sec.badgeColor}`}>
                            {isKhmer ? sec.badgeKhmer : sec.badgeEnglish}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-2">
                          {isKhmer ? sec.descriptionKhmer : sec.descriptionEnglish}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Name and Phone Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <User size={13} className="text-emerald-400" />
                    <span>{t('ឈ្មោះពេញ (Full Name) *', 'Full Name *')}</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isKhmer ? currentSectorObj.sampleNameKhmer : currentSectorObj.sampleNameEnglish}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Phone size={13} className="text-emerald-400" />
                    <span>{t('លេខទូរស័ព្ទ (Phone Number) *', 'Phone Number *')}</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={currentSectorObj.samplePhone}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              {/* Automatic Location & Voice Recording Accessibility Feature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                {/* Auto GPS Location */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <MapPin size={13} />
                      <span>{t('ទីតាំង GPS ស្វ័យប្រវត្តិ', 'Auto GPS Location')}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoCaptureGps}
                      disabled={isCapturingGps}
                      className="text-[10px] text-emerald-300 underline hover:text-emerald-200 cursor-pointer"
                    >
                      {isCapturingGps ? t('កំពុងចាប់យក...', 'Locating...') : t('ចាប់យកឡើងវិញ', 'Refresh GPS')}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    {userGpsLocation ? `📍 ${userGpsLocation.address}` : t('📍 ស្វែងរកទីតាំងស្វ័យប្រវត្ត (Kampong Thom / Kratie)', '📍 Auto-detecting GPS (Cambodia)')}
                  </p>
                </div>

                {/* Voice-First Accessibility Recorder for Non-Literate Users */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Mic size={13} />
                      <span>{t('កំណត់ត្រាសំឡេង (Voice-First)', 'Voice Memo (No Typing)')}</span>
                    </span>
                    {voiceNoteUrl && (
                      <span className="text-[10px] text-emerald-400 font-bold">✓ {t('បានថតទុក', 'Recorded')}</span>
                    )}
                  </div>
                  {!isVoiceLogging ? (
                    <button
                      type="button"
                      onClick={startVoiceLogging}
                      className="w-full py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Mic size={13} />
                      <span>{voiceNoteUrl ? t('ថតសំឡេងឡើងវិញ', 'Re-record Voice') : t('ចុចនិយាយសំឡេង (មិនបាច់វាយអក្សរ)', 'Tap to Record Voice')}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopVoiceLogging}
                      className="w-full py-1.5 px-3 bg-rose-600 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 animate-pulse cursor-pointer"
                    >
                      <Radio size={13} />
                      <span>{t('កំពុងថត...', 'Recording...')} ({voiceSeconds}s) - {t('ចុចបញ្ឈប់', 'Stop')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('ផ្ញើលេខកូដផ្ទៀងផ្ទាត់ SMS', 'Send Automated SMS Verification Code')}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* STEP 2: 6-Digit Automated SMS Verification */}
          {step === 2 && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-pulse">
                <Smartphone size={32} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">
                  {t('ផ្ទៀងផ្ទាត់លេខទូរស័ព្ទដោយស្វ័យប្រវត្តិ', 'Automated SMS OTP Verification')}
                </h3>
                <p className="text-xs text-slate-300">
                  {t('លេខកូដសម្ងាត់ ៦ ខ្ទង់ត្រូវបានផ្ញើទៅកាន់ ', '6-Digit secure OTP sent to ')}<strong>{phoneNumber || currentSectorObj.samplePhone}</strong>
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ {t('ប្រព័ន្ធកំពុងបំពេញ និងផ្ទៀងផ្ទាត់លេខកូដដោយស្វ័យប្រវត្តិ (Zero Typing Required)...', 'System auto-filling and verifying secure OTP (Zero Typing Required)...')}
                </p>
              </div>

              {/* 6 Digit OTP Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                {otpCode.map((digit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-11 h-13 sm:w-13 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black font-mono shadow-inner ${
                      digit 
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/20' 
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}
                  >
                    {digit || '•'}
                  </motion.div>
                ))}
              </div>

              {/* Verification Status */}
              {isVerified ? (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span>{t('ផ្ទៀងផ្ទាត់ជោគជ័យ ១០០%! កំពុងរៀបចំដំឡើងលើអេក្រង់...', 'Verified 100%! Preparing home screen installation...')}</span>
                </motion.div>
              ) : (
                <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>{t('កំពុងផ្ទៀងផ្ទាត់កូដសុវត្ថិភាព Cloud Vault...', 'Verifying secure Cloud Vault tokens...')}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Force Install & Add to Home Screen */}
          {step === 3 && (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-full text-xs font-bold">
                  <Smartphone size={14} />
                  <span>{t('ដំឡើងលើអេក្រង់ដើមទូរស័ព្ទ', 'Add to Mobile Home Screen')}</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {t('ប្រើប្រាស់ដូចកម្មវិធីទូរស័ព្ទពិតប្រាកដ', 'Install as Dedicated Mobile App')}
                </h3>
                <p className="text-xs text-slate-300">
                  {t(
                    'ដំឡើងម្តង អាចចុចបើកពីលើអេក្រង់ទូរស័ព្ទដៃបានរហូត ទោះគ្មានអ៊ីនធឺណិតក៏អាចកត់ត្រាបាន!',
                    'Install once to open directly from your phone screen anytime, with full offline logging capabilities!'
                  )}
                </p>
              </div>

              {/* Visual Install Instructions Guide (Android & iOS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Android Chrome */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <span className="text-xs font-bold text-white">Android / Chrome</span>
                  </div>
                  <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>{t('ចុចសញ្ញាចុចបី (⋮) នៅជ្រុងខាងលើស្តាំ', 'Tap the 3 dots (⋮) menu in top right')}</li>
                    <li>{t('ជ្រើសរើស "ដំឡើងកម្មវិធី (Install App)" ឬ Add to Home Screen', 'Select "Install App" or "Add to Home Screen"')}</li>
                    <li>{t('ចុច "Install / ដំឡើង" ជាការស្រេច!', 'Tap "Install" to complete!')}</li>
                  </ol>
                </div>

                {/* iPhone / Safari */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍏</span>
                    <span className="text-xs font-bold text-white">iPhone / iPad Safari</span>
                  </div>
                  <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>{t('ចុចប៊ូតុង Share នៅបាតអេក្រង់', 'Tap Share button at the bottom')}</li>
                    <li>{t('អូសចុះក្រោម រកមើល "Add to Home Screen"', 'Scroll down and select "Add to Home Screen"')}</li>
                    <li>{t('ចុច "Add / បន្ថែម" នៅជ្រុងលើស្តាំ!', 'Tap "Add" in the top right!')}</li>
                  </ol>
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinueToVideo}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('បន្ទាប់៖ ទស្សនាវីដេអូ & សំឡេងណែនាំ ➔', 'Next: Watch Interactive Video Guide ➔')}</span>
              </button>
            </div>
          )}

          {/* STEP 4: Full-Screen Interactive Video & Speech Audio Explainer */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Top Header of Video */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      🎬 {t('វីដេអូណែនាំ៖', 'Video Guide:')} {isKhmer ? currentSectorObj.titleKhmer : currentSectorObj.titleEnglish}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${currentSectorObj.badgeColor}`}>
                      {isKhmer ? currentSectorObj.badgeKhmer : currentSectorObj.badgeEnglish}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {t('សំឡេងនិយាយច្បាស់ៗមួយៗ សម្រាប់អ្នកមិនសូវចេះអក្សរ', 'Clear step-by-step spoken narration for non-literate users')}
                  </div>
                </div>

                {/* Voice Narration Audio Toggle */}
                <button
                  type="button"
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isVoiceEnabled 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isVoiceEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} />}
                  <span>{isVoiceEnabled ? t('សំឡេង (Audio On)', 'Audio On') : t('បិទសំឡេង (Mute)', 'Mute')}</span>
                </button>
              </div>

              {/* Simulated HD Video Player Viewport */}
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-slate-950 overflow-hidden shadow-2xl relative">
                {/* Scene Active Visual Screen */}
                <div className="p-5 sm:p-7 min-h-[220px] flex flex-col justify-between relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl">
                        {currentSectorObj.videoScenes[activeVideoScene]?.icon || '📱'}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                          {currentSectorObj.videoScenes[activeVideoScene]?.badge}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {isKhmer 
                            ? currentSectorObj.videoScenes[activeVideoScene]?.titleKhmer 
                            : currentSectorObj.videoScenes[activeVideoScene]?.titleEnglish}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Scene {activeVideoScene + 1} / {currentSectorObj.videoScenes.length}
                    </span>
                  </div>

                  {/* Scene Description in large accessible text */}
                  <div className="my-3 p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                    <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-sans">
                      "{isKhmer 
                        ? currentSectorObj.videoScenes[activeVideoScene]?.descriptionKhmer 
                        : currentSectorObj.videoScenes[activeVideoScene]?.descriptionEnglish}"
                    </p>

                    {/* Scene Data Rows */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                      {(isKhmer 
                        ? currentSectorObj.videoScenes[activeVideoScene]?.summaryRowsKhmer 
                        : currentSectorObj.videoScenes[activeVideoScene]?.summaryRowsEnglish
                      )?.map((r, i) => (
                        <div key={i} className="bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 text-[10px]">
                          <span className="text-slate-400 block">{r.label}:</span>
                          <span className={`font-bold ${r.highlight ? 'text-amber-300' : 'text-white'}`}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Video Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-100" 
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span>0:0{activeVideoScene * 5} / 0:15</span>
                      <span>{t('កំពុងលេងដោយស្វ័យប្រវត្តិ...', 'Auto-playing interactive guide...')}</span>
                    </div>
                  </div>
                </div>

                {/* Video Playback Controls */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    >
                      {isVideoPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVideoScene(0);
                        setVideoProgress(0);
                        setIsVideoPlaying(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>

                  {/* Step Scene Selectors */}
                  <div className="flex items-center gap-1.5">
                    {currentSectorObj.videoScenes.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveVideoScene(idx);
                          setVideoProgress(0);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                          activeVideoScene === idx 
                            ? 'bg-emerald-500 text-slate-950' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t(`ជំហាន ${idx + 1}`, `Step ${idx + 1}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Big Final Action Button */}
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>🚀 {t(`យល់ហើយ! ចាប់ផ្តើមប្រើប្រាស់ ${currentSectorObj.titleKhmer}`, `Got it! Enter ${currentSectorObj.titleEnglish}`)}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
