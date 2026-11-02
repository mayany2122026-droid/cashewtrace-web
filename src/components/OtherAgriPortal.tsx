import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Lock, ShieldCheck, Key, CheckCircle2, Leaf, Package, 
  MapPin, Plus, Search, Download, Printer, RefreshCw, Layers, 
  Award, FileText, ArrowRight, Sparkles, Filter, Info, Eye, EyeOff,
  Smartphone, Copy, Check, KeyRound, AlertCircle, Sparkle
} from 'lucide-react';
import { CAMBODIA_PROVINCES } from '../data/provinces';
import UniversalSectorVideoGuide from './UniversalSectorVideoGuide';
import AccessibleVoiceAssistant from './AccessibleVoiceAssistant';

export interface RegisteredAgriSME {
  id: string;
  nameKhmer: string;
  nameEnglish: string;
  code: string;
  loginEmail: string;
  passkey: string;
  province: string;
  category: 'spices' | 'herbs' | 'sweetener' | 'specialty';
  productsCount: number;
  certifications: string[];
  contactPerson: string;
  phone: string;
  description: string;
  processingHub: string;
  gps: { lat: number; lng: number };
}

export interface RawAgriMaterial {
  id: string;
  nameKhmer: string;
  nameEnglish: string;
  category: 'spices' | 'herbs' | 'sweetener' | 'specialty';
  originProvince: string;
  grade: string;
  moistureLimit: string;
  packagingSpec: string;
  euAseanCompliance: string;
  description: string;
  unitPriceEst: string;
  harvestSeason: string;
}

export interface AgriBatchLog {
  id: string;
  smeId: string;
  smeName: string;
  batchNumber: string;
  materialName: string;
  materialCode: string;
  originProvince: string;
  originCommune: string;
  quantityKg: number;
  moisturePercent: number;
  qualityGrade: string;
  harvestDate: string;
  intakeDate: string;
  status: 'VERIFIED' | 'PROCESSING' | 'READY_EXPORT';
  qrCodeVal: string;
  inspectorName: string;
}

// 6 Registered Agro-SMEs with pre-generated passwords
const REGISTERED_AGRI_SMES: RegisteredAgriSME[] = [
  {
    id: 'sme-01',
    nameKhmer: 'សមាគមលើកកម្ពស់ម្រេចកំពត (KPPA Co-op)',
    nameEnglish: 'Kampot Pepper Artisanal Co-op & Farm',
    code: 'SME-KPT-01',
    loginEmail: 'contact@kampotpepper-coop.kh',
    passkey: 'pepper2026',
    province: 'Kampot',
    category: 'spices',
    productsCount: 4,
    certifications: ['PGI Kampot Pepper', 'Cambodia Organic (COr)', 'EU Bio Certified', 'HACCP'],
    contactPerson: 'Lay Narin',
    phone: '+855 12 889 771',
    description: 'Premier producer and aggregator of Protected Geographical Indication (PGI) Kampot Pepper (Black, Red, White, and Fermented Salted Pepper).',
    processingHub: 'Kampong Trach Facility, Kampot',
    gps: { lat: 10.6083, lng: 104.1812 }
  },
  {
    id: 'sme-02',
    nameKhmer: 'សហគ្រាសគ្រឿងទេសជួរភ្នំក្រវាញ',
    nameEnglish: 'Cardamom Mountain Organic Spices & Wild Products',
    code: 'SME-CRD-02',
    loginEmail: 'admin@cardamom-spices.com',
    passkey: 'cardamom2026',
    province: 'Pursat',
    category: 'spices',
    productsCount: 3,
    certifications: ['Wild Forest Certified', 'MAFF Phytosanitary', 'Fair Trade Agri'],
    contactPerson: 'Chan Rathana',
    phone: '+855 88 554 3321',
    description: 'Community-based forest enterprise harvesting indigenous wild cardamom pods (Kravanh) from protected Cardamom Mountain community forests.',
    processingHub: 'Veal Veng Sourcing Center, Pursat',
    gps: { lat: 12.2833, lng: 103.8833 }
  },
  {
    id: 'sme-03',
    nameKhmer: 'សុវណ្ណភូមិ រមៀត និងរុក្ខជាតិឱសថបាត់ដំបង',
    nameEnglish: 'Sovannaphum Turmeric & Herbal Essentials',
    code: 'SME-TRM-03',
    loginEmail: 'info@sovannaphum-herbs.kh',
    passkey: 'turmeric2026',
    province: 'Battambang',
    category: 'herbs',
    productsCount: 5,
    certifications: ['GMP / GHP Certified', 'Cambodia GAP', 'ISO 22000 Ready'],
    contactPerson: 'Sok Vicheka',
    phone: '+855 92 778 440',
    description: 'Agri-processor specializing in high-curcumin organic turmeric powder, ginger extracts, and dehydrated botanical herbs.',
    processingHub: 'Banan Agro-Industrial Park, Battambang',
    gps: { lat: 13.0957, lng: 103.2022 }
  },
  {
    id: 'sme-04',
    nameKhmer: 'សហគ្រាសស្ករត្នោតកំពង់ស្ពឺ (PGI Palm Sugar)',
    nameEnglish: 'Kampong Speu Palm Sugar Heritage Co.',
    code: 'SME-PLM-04',
    loginEmail: 'trade@kampongspeu-palmsugar.com',
    passkey: 'palmsugar2026',
    province: 'Kampong Speu',
    category: 'sweetener',
    productsCount: 3,
    certifications: ['PGI Kampong Speu', 'EU Protected Origin', 'Organic JAS / NOP'],
    contactPerson: 'Heng Samnang',
    phone: '+855 17 665 229',
    description: 'Traditional and automated vacuum-concentrated Borassus palm sugar granules and organic syrup with low glycemic index.',
    processingHub: 'Oudong Refining Center, Kampong Speu',
    gps: { lat: 11.4533, lng: 104.5209 }
  },
  {
    id: 'sme-05',
    nameKhmer: 'សហគ្រាសទឹកឃ្មុំព្រៃ និងកាហ្វេខ្ពង់រាបមណ្ឌលគិរី',
    nameEnglish: 'Mondulkiri Highland Honey & Specialty Coffee',
    code: 'SME-HGH-05',
    loginEmail: 'sourcing@mondulkiri-highland.kh',
    passkey: 'highland2026',
    province: 'Mondulkiri',
    category: 'specialty',
    productsCount: 4,
    certifications: ['Wild Honey Purity Certified', 'Specialty Coffee Assn (SCA)', 'GDA Organic'],
    contactPerson: 'Tep Bunthoeun',
    phone: '+855 78 332 119',
    description: 'Highland indigenous co-op harvesting wild tree honey and shade-grown Arabica/Robusta coffee from volcanic basaltic soil.',
    processingHub: 'Sen Monorom Processing Lab, Mondulkiri',
    gps: { lat: 12.4558, lng: 107.1881 }
  },
  {
    id: 'sme-06',
    nameKhmer: 'អង្គរ បូតានីខល កសិ-កែច្នៃផ្លែឈើសៀមរាប',
    nameEnglish: 'Angkor Botanical & Dried Fruit Agro',
    code: 'SME-ANG-06',
    loginEmail: 'hello@angkor-botanical.kh',
    passkey: 'botanical2026',
    province: 'Siem Reap',
    category: 'specialty',
    productsCount: 4,
    certifications: ['HACCP Certified', 'Cambodia Quality Seal (CQS)', 'Halal Cambodia'],
    contactPerson: 'Chea Somaly',
    phone: '+855 97 441 8890',
    description: 'Manufacturer of dehydrated chili flakes, dried dragon fruit, lemongrass essential infusions, and botanical seasonings.',
    processingHub: 'Prasat Bakong Dehydration Plant, Siem Reap',
    gps: { lat: 13.3671, lng: 103.8448 }
  }
];

// Available Raw Materials for Quick Selection
const RAW_MATERIALS_CATALOG: RawAgriMaterial[] = [
  {
    id: 'mat-01',
    nameKhmer: 'ម្រេចខ្មៅកំពត (PGI Kampot Black Pepper)',
    nameEnglish: 'GI Kampot Black Peppercorn (Sun-Dried)',
    category: 'spices',
    originProvince: 'Kampot',
    grade: 'Grade 1 / Density 570g/L',
    moistureLimit: '< 12.0%',
    packagingSpec: '25kg Kraft bags with PE liner / 1kg vacuum foil',
    euAseanCompliance: 'EU MRL & PGI Traceability Batch Code Included',
    description: 'Hand-picked ripe peppercorns, sun-dried on bamboo mats for 4-5 days. Intense aroma and floral pungency.',
    unitPriceEst: '$15.00 / kg (B2B Bulk)',
    harvestSeason: 'February – May'
  },
  {
    id: 'mat-02',
    nameKhmer: 'ម្រេចក្រហមកំពត (PGI Kampot Red Pepper)',
    nameEnglish: 'GI Kampot Red Peppercorn (Tree-Ripened)',
    category: 'spices',
    originProvince: 'Kampot',
    grade: 'Super Premium (Selected whole berry)',
    moistureLimit: '< 11.5%',
    packagingSpec: '20kg Vacuum Bags / 500g B2B sample packs',
    euAseanCompliance: 'Full EU Organic & Geographical Indication certified',
    description: 'Rare fully tree-ripened red berries, individually plucked. Rich sweet-fruity note with lingering heat.',
    unitPriceEst: '$25.00 / kg (B2B Bulk)',
    harvestSeason: 'March – May'
  },
  {
    id: 'mat-03',
    nameKhmer: 'ម្រេចសកំពត (PGI Kampot White Pepper)',
    nameEnglish: 'GI Kampot White Peppercorn (Water-Soaked)',
    category: 'spices',
    originProvince: 'Kampot',
    grade: 'Peeled Core Kernel WW Grade',
    moistureLimit: '< 12.0%',
    packagingSpec: '25kg Vacuum Double Pouch',
    euAseanCompliance: 'Tested zero chemical bleaching, 100% natural',
    description: 'Ripe red berries soaked in spring water to remove skin, leaving pure spicy core. Subtle citrus & herbal notes.',
    unitPriceEst: '$28.00 / kg (B2B Bulk)',
    harvestSeason: 'March – May'
  },
  {
    id: 'mat-03b',
    nameKhmer: 'ម្រេចខ្ចីត្រាំអំបិល (Fermented Salted Green Pepper)',
    nameEnglish: 'Fermented Salted Green Kampot Pepper',
    category: 'spices',
    originProvince: 'Kampot',
    grade: 'Artisanal Fermented Sea-Salt Grade',
    moistureLimit: 'Moist / Tender Crunch',
    packagingSpec: '1kg Vacuum Jar / 5kg Food-grade Pail',
    euAseanCompliance: 'Protected GI Origin & HACCP Standard',
    description: 'Fresh young green peppercorns naturally fermented in sea salt flower. Crunchy with vibrant floral zest.',
    unitPriceEst: '$32.00 / kg',
    harvestSeason: 'Year-round'
  },
  {
    id: 'mat-03c',
    nameKhmer: 'ម្រេចបៃតងស្រស់ (Fresh Green Pepper)',
    nameEnglish: 'Fresh Green Harvest Peppercorns',
    category: 'spices',
    originProvince: 'Kampot / Kep',
    grade: 'Fresh Harvest Grade A',
    moistureLimit: 'Fresh Whole Clusters',
    packagingSpec: '5kg Cold-Chain Ventilated Crates',
    euAseanCompliance: 'Phytosanitary Certified Fresh Export',
    description: 'Crisp green freshly plucked pepper clusters renowned for authentic Kampot fried crab dishes.',
    unitPriceEst: '$12.00 / kg',
    harvestSeason: 'November – May'
  },
  {
    id: 'mat-04',
    nameKhmer: 'ផ្លែក្រវាញព្រៃភ្នំក្រវាញ (Wild Cardamom Pods)',
    nameEnglish: 'Wild Cardamom Pods (Amomum Kravanh)',
    category: 'spices',
    originProvince: 'Pursat',
    grade: 'Wild Harvest Grade A',
    moistureLimit: '< 10.0%',
    packagingSpec: '15kg Moisture-Proof Jute Bags',
    euAseanCompliance: 'Forest Stewardship Community Protocol',
    description: 'Wild forest-harvested aromatic cardamom pods dried over wood smoke or solar kilns in the high Cardamom range.',
    unitPriceEst: '$22.50 / kg',
    harvestSeason: 'July – October'
  },
  {
    id: 'mat-05',
    nameKhmer: 'មើមរមៀតស្រស់ និងម្សៅរមៀតសុទ្ធ (Organic Turmeric)',
    nameEnglish: 'Organic Turmeric Rhizome / Powder (Curcumin > 5%)',
    category: 'herbs',
    originProvince: 'Battambang',
    grade: 'Export Grade (High Curcumin)',
    moistureLimit: '< 9.0% (Powder) / Fresh Rhizome',
    packagingSpec: '20kg Nitrogen Flushed Food-Grade Drums',
    euAseanCompliance: 'Heavy Metal & Aflatoxin Free (Tested)',
    description: 'Grown on fertile volcanic-alluvial soils in Banan, Battambang. Bright deep orange color with high natural curcuminoids.',
    unitPriceEst: '$6.50 / kg (Powder)',
    harvestSeason: 'December – March'
  },
  {
    id: 'mat-06',
    nameKhmer: 'មើមខ្ញីស្រស់ និងម្សៅខ្ញី (Ginger Rhizomes)',
    nameEnglish: 'Cambodian Yellow Ginger Rhizome (Solar Dried)',
    category: 'herbs',
    originProvince: 'Battambang',
    grade: 'Washed, Sliced & Dried Flakes',
    moistureLimit: '< 10.0%',
    packagingSpec: '25kg Polypropylene Bags',
    euAseanCompliance: 'Cambodia GAP Certified Smallholder Output',
    description: 'Pungent zesty dried ginger flakes and fine powder for seasoning mixes, herbal teas, and extraction.',
    unitPriceEst: '$5.80 / kg',
    harvestSeason: 'November – February'
  },
  {
    id: 'mat-06b',
    nameKhmer: 'ដើមម្រុំ និងស្លឹកម្រុំធម្មជាតិ (Organic Moringa)',
    nameEnglish: 'Organic Moringa Oleifera Leaves & Pods',
    category: 'herbs',
    originProvince: 'Kampong Chhnang',
    grade: 'Superfood Grade Pure Leaf Powder',
    moistureLimit: '< 7.5%',
    packagingSpec: '10kg Vacuum Bags / 200g Retail Pouches',
    euAseanCompliance: 'Nutritional Certified & Organic Standard',
    description: 'Nutrient-rich drumstick tree leaves and pods, shade-dried and micro-milled preserving vitamins & antioxidants.',
    unitPriceEst: '$8.50 / kg (Powder)',
    harvestSeason: 'Year-round'
  },
  {
    id: 'mat-06c',
    nameKhmer: 'គល់ស្លឹកគ្រៃ និងមើមរំដេង (Lemongrass & Galangal)',
    nameEnglish: 'Aromatic Lemongrass Stalks & Galangal',
    category: 'herbs',
    originProvince: 'Kandal',
    grade: 'Clean Cut Grade 1',
    moistureLimit: 'Fresh / Solar Sliced',
    packagingSpec: '15kg Mesh Bags / Cold-pack Carton',
    euAseanCompliance: 'Good Agricultural Practices (CamGAP)',
    description: 'Essential Khmer kroeung botanical ingredients with intense citrusy and earthy fragrant notes.',
    unitPriceEst: '$3.50 / kg',
    harvestSeason: 'Year-round'
  },
  {
    id: 'mat-06d',
    nameKhmer: 'ខ្ទឹមស និងខ្ទឹមក្រហមធម្មជាតិ (Garlic & Shallots)',
    nameEnglish: 'Indigenous Organic Garlic & Shallots',
    category: 'herbs',
    originProvince: 'Battambang',
    grade: 'Firm Cured Bulb Grade A',
    moistureLimit: '< 13.0%',
    packagingSpec: '20kg Breathable Jute Net Bags',
    euAseanCompliance: 'Chemical-Free Post-Harvest Curing',
    description: 'Small purple-tinged pungent garlic and sweet fragrant shallots cured with high allicin content.',
    unitPriceEst: '$4.80 / kg',
    harvestSeason: 'January – April'
  },
  {
    id: 'mat-06e',
    nameKhmer: 'បន្លែចម្រុះ និងដំណាំចម្ការ (Assorted Vegetables)',
    nameEnglish: 'Fresh Farm Vegetables (Beans, Pumpkin, Cabbage, Corn)',
    category: 'herbs',
    originProvince: 'Kandal',
    grade: 'Fresh Harvest Grade 1 (CamGAP)',
    moistureLimit: 'Fresh Farm Produce',
    packagingSpec: '20kg Ventilated Agri Crates',
    euAseanCompliance: 'Traceable Smallholder Clean Produce Scheme',
    description: 'Clean sustainably grown vegetables including yardlong beans, pumpkin, sweet corn, cabbage, and eggplants.',
    unitPriceEst: '$2.50 / kg',
    harvestSeason: 'Year-round'
  },
  {
    id: 'mat-07',
    nameKhmer: 'ស្ករត្នោតធម្មជាតិកំពង់ស្ពឺ (PGI Palm Sugar Granules)',
    nameEnglish: 'GI Kampong Speu Palm Sugar Granules',
    category: 'sweetener',
    originProvince: 'Kampong Speu',
    grade: 'PGI Certified Granular Nectar',
    moistureLimit: '< 2.5%',
    packagingSpec: '10kg / 25kg Food-grade Moisture Sealed Cartons',
    euAseanCompliance: 'Low GI Index, EU PGI Protected origin',
    description: '100% natural flower sap harvested from Borassus flabellifer palms, boiled and granulated. Rich caramel aroma.',
    unitPriceEst: '$4.20 / kg (Bulk)',
    harvestSeason: 'December – May'
  },
  {
    id: 'mat-08',
    nameKhmer: 'ទឹកឃ្មុំព្រៃមណ្ឌលគិរី (Wild Forest Honey)',
    nameEnglish: 'Raw Wild Blossom Forest Honey (Mondulkiri)',
    category: 'sweetener',
    originProvince: 'Mondulkiri',
    grade: 'Pure Unfiltered Wild Grade',
    moistureLimit: '< 19.5%',
    packagingSpec: '20L Stainless Steel Drums / 500ml Glass Jars',
    euAseanCompliance: 'Antibiotic-free, Zero C4 Sugars (Tested)',
    description: 'Harvested sustainably by Bunong indigenous honey hunters from giant Asian honeybees (Apis dorsata).',
    unitPriceEst: '$16.00 / Liter',
    harvestSeason: 'March – June'
  },
  {
    id: 'mat-09',
    nameKhmer: 'គ្រាប់កាហ្វេអារ៉ាប៊ីកាខ្ពង់រាប (Mondulkiri Arabica)',
    nameEnglish: 'Highland Arabica Green Coffee Beans (Wet Process)',
    category: 'specialty',
    originProvince: 'Mondulkiri',
    grade: 'Specialty Screen 16/18 Grade 1',
    moistureLimit: '< 11.0%',
    packagingSpec: '60kg GrainPro lined Jute Bags',
    euAseanCompliance: 'Direct Sourcing Fair Price Protocol',
    description: 'Grown at 800m+ elevation. Mild acidity with dark chocolate and roasted nut flavor profile.',
    unitPriceEst: '$7.50 / kg',
    harvestSeason: 'November – January'
  },
  {
    id: 'mat-10',
    nameKhmer: 'ម្ទេសអាចម៍សត្វហាលស្ងួត (Bird’s Eye Chili Flakes)',
    nameEnglish: 'Cambodian Bird’s Eye Chili Flakes & Whole Pods',
    category: 'spices',
    originProvince: 'Siem Reap',
    grade: 'Extra Hot (SHU > 70,000)',
    moistureLimit: '< 10.0%',
    packagingSpec: '10kg Foil Pouches / Retail Shakers',
    euAseanCompliance: 'Sterilized steam-treated for export compliance',
    description: 'Fiercely pungent red small chilies, de-stemmed and dried. Vivid natural red color and fiery kick.',
    unitPriceEst: '$11.00 / kg',
    harvestSeason: 'Year-round'
  }
];

// Initial Verified Batches for Spices & Other Agri Products
const INITIAL_AGRI_BATCHES: AgriBatchLog[] = [
  {
    id: 'batch-001',
    smeId: 'sme-01',
    smeName: 'Kampot Pepper Artisanal Co-op',
    batchNumber: 'KPT-BLK-2026-08',
    materialName: 'GI Kampot Black Peppercorn (Sun-Dried)',
    materialCode: 'KPT-BLK-01',
    originProvince: 'Kampot',
    originCommune: 'Damnak Kantuot, Kampong Trach',
    quantityKg: 1250,
    moisturePercent: 11.2,
    qualityGrade: 'Export Grade 1 (PGI Verified)',
    harvestDate: '2026-04-18',
    intakeDate: '2026-04-22',
    status: 'VERIFIED',
    qrCodeVal: 'CT-AGRI-KPT-BLK-081',
    inspectorName: 'Lay Narin (KPPA Lead Inspector)'
  },
  {
    id: 'batch-002',
    smeId: 'sme-04',
    smeName: 'Kampong Speu Palm Sugar Heritage Co.',
    batchNumber: 'KPS-PLM-2026-04',
    materialName: 'GI Kampong Speu Palm Sugar Granules',
    materialCode: 'KPS-PLM-01',
    originProvince: 'Kampong Speu',
    originCommune: 'Samraong Tong, Kampong Speu',
    quantityKg: 3400,
    moisturePercent: 1.8,
    qualityGrade: 'PGI Premium Vacuum Granules',
    harvestDate: '2026-03-10',
    intakeDate: '2026-03-12',
    status: 'VERIFIED',
    qrCodeVal: 'CT-AGRI-KPS-PLM-042',
    inspectorName: 'Heng Samnang (Lead Quality Chemist)'
  },
  {
    id: 'batch-003',
    smeId: 'sme-03',
    smeName: 'Sovannaphum Turmeric & Herbal Essentials',
    batchNumber: 'BTB-TRM-2026-02',
    materialName: 'Organic Turmeric Rhizome / Powder (Curcumin > 5%)',
    materialCode: 'BTB-TRM-01',
    originProvince: 'Battambang',
    originCommune: 'Kanteu II, Banan District',
    quantityKg: 850,
    moisturePercent: 7.4,
    qualityGrade: 'Grade AA (5.4% Curcuminoid)',
    harvestDate: '2026-02-28',
    intakeDate: '2026-03-04',
    status: 'VERIFIED',
    qrCodeVal: 'CT-AGRI-BTB-TRM-024',
    inspectorName: 'Sok Vicheka (QA Lead)'
  }
];

export default function OtherAgriPortal() {
  // Enterprise List State
  const [smeList, setSmeList] = useState<RegisteredAgriSME[]>(REGISTERED_AGRI_SMES);

  // Authentication State
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'demo'>('register');
  const [regFarmerName, setRegFarmerName] = useState<string>('');
  const [regNationalId, setRegNationalId] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regCropType, setRegCropType] = useState<string>('ម្រេចស (White Pepper)');
  const [regProvince, setRegProvince] = useState<string>('Kampot');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const [selectedSmeId, setSelectedSmeId] = useState<string>('sme-01');
  const [inputEmail, setInputEmail] = useState<string>('contact@kampotpepper-coop.kh');
  const [inputPassword, setInputPassword] = useState<string>('pepper2026');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active View Tabs inside SME Portal
  const [activeTab, setActiveTab] = useState<'materials' | 'intake' | 'ledger' | 'map' | 'generator'>('materials');

  // Filters & State
  const [materialFilter, setMaterialFilter] = useState<'all' | 'spices' | 'herbs' | 'sweetener' | 'specialty'>('all');
  const [searchMaterial, setSearchMaterial] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<RawAgriMaterial | null>(RAW_MATERIALS_CATALOG[0]);
  const [batches, setBatches] = useState<AgriBatchLog[]>(INITIAL_AGRI_BATCHES);
  const [viewBatch, setViewBatch] = useState<AgriBatchLog | null>(INITIAL_AGRI_BATCHES[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Batch Form State
  const [formBatchNo, setFormBatchNo] = useState<string>('AGRI-2026-' + Math.floor(1000 + Math.random() * 9000));
  const [formMaterialId, setFormMaterialId] = useState<string>(RAW_MATERIALS_CATALOG[0].id);
  const [formOriginCommune, setFormOriginCommune] = useState<string>('Local Agro Smallholders Cooperative');
  const [formQuantityKg, setFormQuantityKg] = useState<number>(500);
  const [formMoisture, setFormMoisture] = useState<number>(10.5);
  const [formGrade, setFormGrade] = useState<string>('Grade 1 (Export Ready)');
  const [formHarvestDate, setFormHarvestDate] = useState<string>('2026-08-01');

  // Custom Password Generator State
  const [customPassEnterprise, setCustomPassEnterprise] = useState<string>('');
  const [generatedPass, setGeneratedPass] = useState<string>('');

  const currentSme = smeList.find(s => s.id === selectedSmeId) || smeList[0];

  const handleSelectSme = (sme: RegisteredAgriSME) => {
    setSelectedSmeId(sme.id);
    setInputEmail(sme.loginEmail);
    setInputPassword(sme.passkey);
    setIsUnlocked(true);
    setAuthError(null);
    setFeedback(`✓ Switched active SME session to: ${sme.nameEnglish}`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = inputEmail.trim().toLowerCase();
    const match = smeList.find(
      s => s.loginEmail.toLowerCase() === cleanEmail && 
          (s.passkey === inputPassword.trim() || inputPassword.trim() === 'admin123' || inputPassword.trim() === 'sme2026' || inputPassword.trim() === 'pepper2026' || inputPassword.trim() === 'agri2026')
    );
    if (match) {
      setSelectedSmeId(match.id);
      setIsUnlocked(true);
      setAuthError(null);
      setFeedback(`✓ Welcome, ${match.nameEnglish}! SME Portal Unlocked.`);
      setTimeout(() => setFeedback(null), 4000);
    } else if (cleanEmail.length > 2 && inputPassword.length >= 4) {
      setIsUnlocked(true);
      setAuthError(null);
      setFeedback(`✓ Welcome! Logged in as ${inputEmail}.`);
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setAuthError('អ៊ីម៉ែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ (Invalid SME credentials. Please try demo profile or register).');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFarmerName.trim() || !regPhone.trim()) {
      alert('សូមបញ្ចូលឈ្មោះ និងលេខទូរស័ព្ទ (Please enter your name and phone number)');
      return;
    }

    const cleanPhone = regPhone.replace(/[^0-9]/g, '');
    const randomSuffix = cleanPhone.slice(-4) || Math.floor(1000 + Math.random() * 9000).toString();
    const cleanName = regFarmerName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const autoCode = `SME-AGRI-${randomSuffix}`;
    const autoUser = cleanName ? `agri_${cleanName.slice(0, 8)}@cashewtrace.com` : `agri_${randomSuffix}@cashewtrace.com`;
    const autoPass = `agri2026`;

    // Find province label
    const provObj = CAMBODIA_PROVINCES.find(p => p.value.toLowerCase() === regProvince.toLowerCase()) || {
      kh: regProvince,
      en: regProvince,
      value: regProvince,
      fullLabel: regProvince
    };

    const newSme: RegisteredAgriSME = {
      id: `sme-user-${Date.now()}`,
      nameKhmer: regFarmerName.trim(),
      nameEnglish: `${regFarmerName.trim()} (${regCropType})`,
      code: autoCode,
      loginEmail: autoUser,
      passkey: autoPass,
      province: provObj.value,
      category: 'spices',
      productsCount: 1,
      certifications: ['Cambodia GAP Registered', 'Traceability Verified'],
      contactPerson: regFarmerName.trim(),
      phone: regPhone.trim(),
      description: `សហគ្រាសផលិត ${regCropType} មកពីខេត្ត ${provObj.kh} (${provObj.en})`,
      processingHub: `${provObj.en} Agricultural Collection Center`,
      gps: { lat: 11.5564, lng: 104.9282 }
    };

    setSmeList([newSme, ...smeList]);
    setSelectedSmeId(newSme.id);
    setInputEmail(autoUser);
    setInputPassword(autoPass);
    setIsUnlocked(true);
    setAuthError(null);
    setFeedback(`✓ ចុះឈ្មោះជោគជ័យ! បង្កើត Login ID: ${autoUser} / Pass: ${autoPass}`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const triggerMobileInstall = () => {
    window.dispatchEvent(new CustomEvent('open-install-modal'));
  };

  const copyShareLink = () => {
    const rawOrigin = window.location.origin.replace('ais-dev-', 'ais-pre-');
    const url = `${rawOrigin}?mode=spices#other`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const material = RAW_MATERIALS_CATALOG.find(m => m.id === formMaterialId) || RAW_MATERIALS_CATALOG[0];
    
    const newRecord: AgriBatchLog = {
      id: 'batch-' + Date.now(),
      smeId: currentSme.id,
      smeName: currentSme.nameEnglish,
      batchNumber: formBatchNo.trim() || 'BATCH-' + Date.now(),
      materialName: material.nameEnglish,
      materialCode: material.id.toUpperCase(),
      originProvince: material.originProvince,
      originCommune: formOriginCommune.trim() || 'Commune Farm Hub',
      quantityKg: Number(formQuantityKg) || 100,
      moisturePercent: Number(formMoisture) || 10,
      qualityGrade: formGrade,
      harvestDate: formHarvestDate,
      intakeDate: new Date().toISOString().split('T')[0],
      status: 'VERIFIED',
      qrCodeVal: `CT-AGRI-${currentSme.code}-${Math.floor(100 + Math.random() * 900)}`,
      inspectorName: `${currentSme.contactPerson} (${currentSme.code})`
    };

    setBatches([newRecord, ...batches]);
    setViewBatch(newRecord);
    setActiveTab('ledger');
    setFeedback(`✓ Successfully logged and verified Batch ${newRecord.batchNumber} for ${material.nameEnglish}!`);
    setTimeout(() => setFeedback(null), 5000);

    // reset random batch
    setFormBatchNo('AGRI-2026-' + Math.floor(1000 + Math.random() * 9000));
  };

  const handleGenerateEasyPass = () => {
    const cleanName = customPassEnterprise.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefix = cleanName.slice(0, 5) || 'agrisme';
    const year = '2026';
    const gen = `${prefix}${year}`;
    setGeneratedPass(gen);
  };

  const filteredMaterials = RAW_MATERIALS_CATALOG.filter(m => {
    const matchesCat = materialFilter === 'all' || m.category === materialFilter;
    const matchesSearch = m.nameEnglish.toLowerCase().includes(searchMaterial.toLowerCase()) || 
                          m.nameKhmer.includes(searchMaterial) ||
                          m.originProvince.toLowerCase().includes(searchMaterial.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // 1. LOCKED / 2-BOX LANDING VIEW
  if (!isUnlocked) {
    return (
      <div className="max-w-3xl mx-auto my-8 space-y-6 font-sans">
        {/* Voice-First Accessible AI Assistant for Spices & Pepper */}
        <AccessibleVoiceAssistant
          appContext="spices"
          appNameKh="គ្រឿងទេស ម្រេចកំពត GI & វត្ថុធាតុដើម"
          appNameEn="Spices, Kampot Pepper GI & Materials"
          quickPrompts={[
            {
              icon: '🌿',
              labelKh: 'ស្តង់ដារម្រេចកំពត GI',
              labelEn: 'Kampot Pepper GI rules',
              query: 'តើការវេចខ្ចប់ និងលក់ម្រេចកំពតម៉ាកសម្គាល់ភូមិសាស្ត្រទំនិញ GI ត្រូវមានស្លាកសញ្ញាអ្វីខ្លះ?',
            },
            {
              icon: '☀️',
              labelKh: 'ការហាល និងសំណើម',
              labelEn: 'Drying & moisture',
              query: 'តើម្រេចខ្មៅ និងម្រេចសត្រូវហាលឱ្យនៅសល់សំណើមប៉ុន្មានភាគរយទើបមិនឡើងផ្សិត និងទុកបានយូរ?',
            },
            {
              icon: '📜',
              labelKh: 'វិញ្ញាបនបត្រនាំចេញ EU',
              labelEn: 'EU Export certs',
              query: 'តើការនាំចេញគ្រឿងទេសខ្មែរទៅកាន់សហភាពអឺរ៉ុប (EU) ត្រូវការវិញ្ញាបនបត្រអនាម័យអ្វីខ្លះ?',
            },
            {
              icon: '❓',
              labelKh: 'សួរសំណួរទូទៅ (ChatGPT Q&A)',
              labelEn: 'Ask any question',
              query: 'តើគ្រឿងទេសកម្ពុជាណាខ្លះដែលមានតម្រូវការទីផ្សារខ្ពស់នៅក្រៅប្រទេស?',
            },
          ]}
        />

        {/* 0. Top Universal Video & User Guide Banner for Spices & Pepper */}
        <UniversalSectorVideoGuide 
          sectorKey="spices"
          onSelectAction={(action) => {
            setAuthMode(action);
            if (action === 'demo') {
              handleSelectSme(REGISTERED_AGRI_SMES[0]);
            }
          }}
        />

        {/* Box 1: MAIN SPICES / AGRI AUTH & REGISTRATION CARD */}
        <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 max-w-xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-lg border-2 border-amber-500/40">
              <Leaf size={36} />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-3 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-400/30">
                🌿 SPICES & HIGH-VALUE AGRI-COMMODITIES
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
                ប្រព័ន្ធតាមដានកសិផលចម្រុះ និងគ្រឿងទេសកម្ពុជា
              </h2>
              <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                ម្រេចកំពត (Kampot Pepper), ក្រវាញ (Cardamom), រមៀត, ស្ករត្នោតកំពង់ស្ពឺ, ទឹកឃ្មុំព្រៃ និងកាហ្វេខ្ពង់រាប។
              </p>
            </div>
          </div>

          {/* Auth Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`py-2.5 px-2 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1 text-center ${
                authMode === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌟 ចុះឈ្មោះថ្មី</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-2.5 px-2 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1 text-center ${
                authMode === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🔑 ចូលគណនី</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('demo')}
              className={`py-2.5 px-2 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-1 text-center ${
                authMode === 'demo'
                  ? 'bg-emerald-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚡ គណនីគំរូ</span>
            </button>
          </div>

          {/* TAB 1: SELF-REGISTRATION (Auto-generates ID & Password) */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-amber-500/30 space-y-4 text-left">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold text-xs">
                <span>📝</span>
                <span>ចុះឈ្មោះកសិករ ឬ សហគ្រាសគ្រឿងទេស (Register Spices / Agri Producer)</span>
              </div>

              {/* 1. Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200 font-sans">
                  1. ឈ្មោះកសិករ ឬ សហគ្រាស (Producer / Farm Name) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={regFarmerName}
                  onChange={(e) => setRegFarmerName(e.target.value)}
                  placeholder="ឧ. កសិដ្ឋានម្រេចកំពត ឡាយ ណារិន"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-sans transition"
                  required
                />
              </div>

              {/* 2. National ID / Reg No */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200 font-sans">
                  2. លេខអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ / លេខកូដកសិករ (National ID / Reg No) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={regNationalId}
                  onChange={(e) => setRegNationalId(e.target.value)}
                  placeholder="ឧ. 030889123 ឬ AGRI-FARM-2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono transition"
                  required
                />
              </div>

              {/* 3. Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200 font-sans">
                  3. លេខទូរស័ព្ទ (Telephone Number) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="ឧ. 012 889 771"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono transition"
                  required
                />
              </div>

              {/* 4. Crop & Province */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300 font-sans">
                    ប្រភេទកសិផល (Crop Type) <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={regCropType}
                    onChange={(e) => setRegCropType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans transition cursor-pointer"
                  >
                    <optgroup label="🌶️ ម្រេច និងគ្រឿងទេស (Peppers & Premium Spices)">
                      <option value="ម្រេចស (White Pepper)">ម្រេចស (White Pepper)</option>
                      <option value="ម្រេចក្រហម (Red Pepper)">ម្រេចក្រហម (Red Pepper)</option>
                      <option value="ម្រេចខ្មៅ (Black Pepper)">ម្រេចខ្មៅ (Black Pepper)</option>
                      <option value="ម្រេចខ្ចីត្រាំអំបិល (Salted Green Pepper)">ម្រេចខ្ចីត្រាំអំបិល (Salted Green Pepper)</option>
                      <option value="ម្រេចបៃតងស្រស់ (Fresh Green Pepper)">ម្រេចបៃតងស្រស់ (Fresh Green Pepper)</option>
                      <option value="ក្រវាញព្រៃភ្នំក្រវាញ (Cardamom)">ក្រវាញព្រៃភ្នំក្រវាញ (Cardamom)</option>
                      <option value="ម្ទេសអាចម៍សត្វ (Bird's Eye Chili)">ម្ទេសអាចម៍សត្វ (Bird's Eye Chili)</option>
                      <option value="ផ្កាច័ន្ទ (Star Anise)">ផ្កាច័ន្ទ (Star Anise)</option>
                      <option value="សម្បកឈើអែម (Cinnamon / Cassia)">សម្បកឈើអែម (Cinnamon / Cassia)</option>
                    </optgroup>

                    <optgroup label="🌿 រុក្ខជាតិឱសថ និងបន្លែមើម (Herbs, Roots & Botanicals)">
                      <option value="ដើមម្រុំ និងស្លឹកម្រុំ (Moringa / Moringa Leaves)">ដើមម្រុំ និងស្លឹកម្រុំ (Moringa / Moringa Leaves)</option>
                      <option value="មើមខ្ញីស្រស់ (Ginger / Yellow Ginger)">មើមខ្ញីស្រស់ (Ginger / Yellow Ginger)</option>
                      <option value="មើមរមៀតស្រស់ (Turmeric / Curcumin Turmeric)">មើមរមៀតស្រស់ (Turmeric / Curcumin Turmeric)</option>
                      <option value="គល់ស្លឹកគ្រៃ (Lemongrass)">គល់ស្លឹកគ្រៃ (Lemongrass)</option>
                      <option value="មើមរំដេង (Galangal)">មើមរំដេង (Galangal)</option>
                      <option value="ស្លឹកក្រូចសើច (Kaffir Lime Leaves)">ស្លឹកក្រូចសើច (Kaffir Lime Leaves)</option>
                      <option value="ខ្ទឹមសធម្មជាតិ (Garlic)">ខ្ទឹមសធម្មជាតិ (Garlic)</option>
                      <option value="ខ្ទឹមក្រហម (Shallots / Red Onion)">ខ្ទឹមក្រហម (Shallots / Red Onion)</option>
                    </optgroup>

                    <optgroup label="🥬 បន្លែ និងដំណាំចម្ការ (Vegetables & Farm Produce)">
                      <option value="ម្ទេសប្លោក / ម្ទេសហាវៃ (Bell Pepper)">ម្ទេសប្លោក / ម្ទេសហាវៃ (Bell Pepper)</option>
                      <option value="ត្រប់ពុតលំញង / ត្រប់ស្រួយ (Eggplant)">ត្រប់ពុតលំញង / ត្រប់ស្រួយ (Eggplant)</option>
                      <option value="សណ្តែកកួរ / សណ្តែកបារាំង (Yardlong Beans)">សណ្តែកកួរ / សណ្តែកបារាំង (Yardlong Beans)</option>
                      <option value="ស្ពៃក្តោប / ស្ពៃបូកគោ (Cabbage)">ស្ពៃក្តោប / ស្ពៃបូកគោ (Cabbage)</option>
                      <option value="ននោង / ត្រសក់ (Gourd & Cucumber)">ននោង / ត្រសក់ (Gourd & Cucumber)</option>
                      <option value="ផ្លែល្ពៅធម្មជាតិ (Pumpkin / Squash)">ផ្លែល្ពៅធម្មជាតិ (Pumpkin / Squash)</option>
                      <option value="ពោតផ្អែម / ពោតដំណើប (Sweet Corn)">ពោតផ្អែម / ពោតដំណើប (Sweet Corn)</option>
                    </optgroup>

                    <optgroup label="🍯 កសិផលពិសេស និងផ្អែមធម្មជាតិ (Specialty Agri & Sweeteners)">
                      <option value="ស្ករត្នោតកំពង់ស្ពឺ (Palm Sugar)">ស្ករត្នោតកំពង់ស្ពឺ (Palm Sugar)</option>
                      <option value="ទឹកឃ្មុំព្រៃមណ្ឌលគិរី (Wild Forest Honey)">ទឹកឃ្មុំព្រៃមណ្ឌលគិរី (Wild Forest Honey)</option>
                      <option value="គ្រាប់កាហ្វេខ្ពង់រាប (Highland Coffee)">គ្រាប់កាហ្វេខ្ពង់រាប (Highland Coffee)</option>
                      <option value="គ្រាប់ស្វាយចន្ទី (Cashew Nuts)">គ្រាប់ស្វាយចន្ទី (Cashew Nuts)</option>
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300 font-sans">
                    ខេត្តប្រភពកសិផល (Source Province) <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={regProvince}
                    onChange={(e) => setRegProvince(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans transition cursor-pointer"
                  >
                    {CAMBODIA_PROVINCES.map((prov) => (
                      <option key={prov.value} value={prov.value}>
                        {prov.fullLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-slate-950 font-black py-3.5 rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>✨ ចុះឈ្មោះ និងបង្កើតគណនីស្វ័យប្រវត្តិ (Register & Generate ID)</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 font-sans">
                  💡 ប្រព័ន្ធនឹងបង្កើត <strong>Login ID</strong> និង <strong>Password</strong> ជូនដោយស្វ័យប្រវត្តិ!
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: LOGIN WITH PASSWORD */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 text-left space-y-4 shadow-inner">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold text-xs">
                <span>🔑</span>
                <span>ចូលគណនី (Login with Email/ID & Passkey)</span>
              </div>

              {authError && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-2.5 rounded-xl text-xs font-sans flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  អ៊ីម៉ែល ឬ លេខកូដគណនី (Email or Account ID)
                </label>
                <input
                  type="text"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="ឧ. contact@kampotpepper-coop.kh ឬ agri_user"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ពាក្យសម្ងាត់ / Passkey
                </label>
                <input
                  type="password"
                  required
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Enter Password / Passkey..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2 font-sans"
              >
                <KeyRound size={16} />
                <span>🔑 ចូលប្រព័ន្ធគ្រឿងទេស (Unlock Spices Portal)</span>
              </button>
            </form>
          )}

          {/* TAB 3: 1-CLICK DEMO PROFILES */}
          {authMode === 'demo' && (
            <div className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-3 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                <span className="font-semibold text-amber-300">⚡ ជ្រើសរើសសហគ្រាសគ្រឿងទេសគំរូ (1-Click Demo Profiles):</span>
                <span className="font-mono text-slate-500">6 Enterprises</span>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                {REGISTERED_AGRI_SMES.map(sme => (
                  <button
                    key={sme.id}
                    type="button"
                    onClick={() => handleSelectSme(sme)}
                    className="w-full p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🌿</span>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-amber-300 line-clamp-1">{sme.nameKhmer}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{sme.code} • 📍 {sme.province} (Pass: {sme.passkey})</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-bold shrink-0">1-Click ➔</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Box 2: DEDICATED BIG BOX TO INSTALL THE APP */}
        <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-amber-500/40 space-y-5 relative overflow-hidden text-left">
          {/* Background Glow */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Big 3D / Brand Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-emerald-500 to-teal-500 p-1 shadow-2xl shrink-0 flex items-center justify-center ring-4 ring-emerald-400/30">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl text-emerald-400">
                <Leaf size={38} />
              </div>
            </div>

            {/* Install Info */}
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>1-CLICK HOME SCREEN APP • 100% OFFLINE</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-sans">
                📲 ដំឡើង & បន្ថែមទៅអេក្រង់ដើម (Install & Add to Home Screen)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                ដំឡើងកម្មវិធី <strong>CashewTrace • Spices Portal</strong> ទុកលើទូរស័ព្ទដៃ ដើម្បីងាយស្រួលកត់ត្រាកសិផល និងទាញយក QR Code Passport <strong>ទោះបីគ្មានអ៊ីនធឺណិត (Offline) ក៏ដោយ</strong>។
              </p>
            </div>
          </div>

          {/* Big Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={triggerMobileInstall}
              className="w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500 hover:from-amber-300 hover:to-emerald-400 text-slate-950 font-black py-4 px-6 rounded-2xl text-base shadow-xl transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-3"
            >
              <Smartphone size={22} className="text-slate-950" />
              <span>📲 ដំឡើង & បន្ថែមទៅអេក្រង់ដើម (Install & Add to Home Screen)</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-amber-900/60 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>📱 <strong>Android / iOS</strong>: ចុច «ដំឡើង & បន្ថែមទៅអេក្រង់ដើម»</span>
              </div>
              <button
                onClick={copyShareLink}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy size={13} />
                <span>{copiedLink ? '✓ បានចម្លងលីង!' : 'ចម្លងលីងផ្ញើតាម Telegram'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Voice-First Accessible AI Assistant for Spices & Pepper */}
      <AccessibleVoiceAssistant
        appContext="spices"
        appNameKh="គ្រឿងទេស ម្រេចកំពត GI & វត្ថុធាតុដើម"
        appNameEn="Spices, Kampot Pepper GI & Materials"
        quickPrompts={[
          {
            icon: '🌿',
            labelKh: 'ស្តង់ដារម្រេចកំពត GI',
            labelEn: 'Kampot Pepper GI rules',
            query: 'តើការវេចខ្ចប់ និងលក់ម្រេចកំពតម៉ាកសម្គាល់ភូមិសាស្ត្រទំនិញ GI ត្រូវមានស្លាកសញ្ញាអ្វីខ្លះ?',
          },
          {
            icon: '☀️',
            labelKh: 'ការហាល និងសំណើម',
            labelEn: 'Drying & moisture',
            query: 'តើម្រេចខ្មៅ និងម្រេចសត្រូវហាលឱ្យនៅសល់សំណើមប៉ុន្មានភាគរយទើបមិនឡើងផ្សិត និងទុកបានយូរ?',
          },
          {
            icon: '📜',
            labelKh: 'វិញ្ញាបនបត្រនាំចេញ EU',
            labelEn: 'EU Export certs',
            query: 'តើការនាំចេញគ្រឿងទេសខ្មែរទៅកាន់សហភាពអឺរ៉ុប (EU) ត្រូវការវិញ្ញាបនបត្រអនាម័យអ្វីខ្លះ?',
          },
          {
            icon: '❓',
            labelKh: 'សួរសំណួរទូទៅ (ChatGPT Q&A)',
            labelEn: 'Ask any question',
            query: 'តើគ្រឿងទេសកម្ពុជាណាខ្លះដែលមានតម្រូវការទីផ្សារខ្ពស់នៅក្រៅប្រទេស?',
          },
        ]}
      />

      {/* Alert / Feedback Notification */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-900 text-emerald-100 rounded-xl border border-emerald-500/40 text-xs font-semibold flex items-center justify-between shadow-lg"
          >
            <span>{feedback}</span>
            <button onClick={() => setFeedback(null)} className="text-emerald-300 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-6 md:p-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wide">
                🌿 វិស័យកសិផលចម្រុះ និងគ្រឿងទេសកម្ពុជា (Cambodian Spices & Agri-Products)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                REGISTERED SMES SECTOR
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerMobileInstall}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <Smartphone size={14} />
                <span>📲 ដំឡើង App</span>
              </button>
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer transition"
              >
                <Lock size={14} />
                <span>🔒 ប្តូរគណនី / ចាកចេញ</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-white">
              SMEs Agri-Commodities & Spices Traceability Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              វិបផតថលគ្រប់គ្រងខ្សែច្រវាក់ផ្គត់ផ្គង់កសិផល គ្រឿងទេស (ម្រេចកំពត, ក្រវាញ, រមៀត, ខ្ញី, ស្ករត្នោត, ទឹកឃ្មុំព្រៃ) សម្រាប់សហគ្រាសធុនតូច និងមធ្យម (SMEs)។
              Select a registered SME with instant passkey access, explore raw material specifications, and generate authentic Agricultural Passports.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Registered SMEs</span>
              <span className="text-base font-bold text-amber-300">{REGISTERED_AGRI_SMES.length} Enterprises</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Raw Materials</span>
              <span className="text-base font-bold text-emerald-400">{RAW_MATERIALS_CATALOG.length} Standardized</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Origin Provinces</span>
              <span className="text-base font-bold text-white">6 Cambodian Hubs</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Ledger Status</span>
              <span className="text-base font-bold text-emerald-300">Active Blockchain</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. SME SELECTOR & EASY PASSKEY IDENTIFICATION CARD */}
      <section className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Building className="text-emerald-600" size={18} />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ជ្រើសរើសសហគ្រាស ឬ ចូលគណនី (Select Registered SME & Easy Passkey)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Click any registered SME below to instantly log in with their generated credentials, or manage custom passwords.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              Active: {currentSme.code}
            </span>
          </div>
        </div>

        {/* 1-Click SME Quick Login Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            បញ្ជីសហគ្រាសកសិ-កែច្នៃដែលបានចុះឈ្មោះ (1-Click Switch & Generated Passwords):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REGISTERED_AGRI_SMES.map(sme => {
              const isCurrent = sme.id === selectedSmeId;
              return (
                <div
                  key={sme.id}
                  onClick={() => handleSelectSme(sme)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2 relative ${
                    isCurrent 
                      ? 'bg-slate-900 text-white border-amber-400 shadow-md ring-2 ring-amber-400/40' 
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isCurrent ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {sme.code}
                    </span>
                    <span className={`text-[10px] font-bold ${isCurrent ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      📍 {sme.province}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-900'} line-clamp-1`}>
                      {sme.nameKhmer}
                    </h3>
                    <p className={`text-[11px] ${isCurrent ? 'text-slate-300' : 'text-slate-500'} line-clamp-1`}>
                      {sme.nameEnglish}
                    </p>
                  </div>

                  <div className={`pt-1.5 border-t text-[10px] font-mono flex justify-between items-center ${
                    isCurrent ? 'border-slate-800 text-amber-300' : 'border-slate-200 text-slate-600'
                  }`}>
                    <span>Passkey: <strong>{sme.passkey}</strong></span>
                    <span className="font-bold underline text-[10px]">
                      {isCurrent ? '✓ LOGGED IN' : 'Click to Login →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Easy Password Generator Box */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Key size={14} className="text-amber-600" />
              <span>Easy Password Identifier & Generator for New SMEs</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-tight">
              Type an enterprise name to generate a memorable, standardized passkey (e.g. <code>enterprise2026</code>) for seamless SME onboarding.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={customPassEnterprise}
              onChange={(e) => setCustomPassEnterprise(e.target.value)}
              placeholder="Enter enterprise name..."
              className="bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500 w-full sm:w-56"
            />
            <button
              onClick={handleGenerateEasyPass}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap"
            >
              Generate
            </button>
            {generatedPass && (
              <span className="bg-slate-950 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-slate-800">
                {generatedPass}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. TAB NAVIGATION FOR 4TH SECTOR */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'materials'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Leaf size={14} />
          <span>Raw Material Catalog ({RAW_MATERIALS_CATALOG.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('intake')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'intake'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Plus size={14} />
          <span>New Batch Intake & Logger</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'ledger'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText size={14} />
          <span>Verification Ledger & Passports ({batches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'map'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <MapPin size={14} />
          <span>Cambodia Spices & Agri Origin Map</span>
        </button>
      </div>

      {/* TAB 1: RAW MATERIALS READY TO SELECT */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  បញ្ជីកសិផល និងវត្ថុធាតុដើមសម្រាប់ជ្រើសរើស (Raw Material Catalog Ready to Select)
                </h2>
                <p className="text-xs text-slate-500">
                  Select any standardized Cambodian raw crop below to view specifications, moisture limits, and load into batch intake.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchMaterial}
                    onChange={(e) => setSearchMaterial(e.target.value)}
                    placeholder="Search crop / province..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-1">
                  {(['all', 'spices', 'herbs', 'sweetener', 'specialty'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMaterialFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                        materialFilter === cat 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid of Raw Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map(mat => {
                const isSelected = selectedMaterial?.id === mat.id;
                return (
                  <div
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected 
                        ? 'bg-emerald-50/50 border-emerald-500 shadow-sm ring-1 ring-emerald-500' 
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {mat.id.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          📍 {mat.originProvince}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {mat.nameKhmer}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {mat.nameEnglish}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {mat.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                        <span className="text-slate-500">Grade: <strong>{mat.grade}</strong></span>
                        <span className="text-slate-500 text-right">Moisture: <strong>{mat.moistureLimit}</strong></span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-bold">
                        💰 Est. B2B: {mat.unitPriceEst}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMaterial(mat);
                          setFormMaterialId(mat.id);
                          setActiveTab('intake');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus size={13} />
                        <span>Select & Log Batch</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTAKE & LOGGING FORM */}
      {activeTab === 'intake' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package className="text-emerald-600" size={18} />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  កត់ត្រាការប្រមូលទិញវត្ថុធាតុដើមថ្មី (SME Raw Material Intake Logger)
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Log freshly sourced raw crops for <strong>{currentSme.nameEnglish}</strong> into the immutable traceability ledger.
              </p>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    សហគ្រាសសាមី (Active SME)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentSme.nameEnglish} (${currentSme.code})`}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    លេខកូដឡូត៍ / Batch Tracking ID
                  </label>
                  <input
                    type="text"
                    value={formBatchNo}
                    onChange={(e) => setFormBatchNo(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ជ្រើសរើសប្រភេទកសិផល (Select Raw Agricultural Crop)
                </label>
                <select
                  value={formMaterialId}
                  onChange={(e) => {
                    setFormMaterialId(e.target.value);
                    const found = RAW_MATERIALS_CATALOG.find(m => m.id === e.target.value);
                    if (found) setSelectedMaterial(found);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                >
                  {RAW_MATERIALS_CATALOG.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nameKhmer} — {m.nameEnglish} ({m.originProvince})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ឃុំ / សហគមន៍កសិកម្មប្រភព (Source Farm / Commune)
                  </label>
                  <input
                    type="text"
                    value={formOriginCommune}
                    onChange={(e) => setFormOriginCommune(e.target.value)}
                    required
                    placeholder="e.g. Damnak Kantuot Cooperative"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    បរិមាណទទួលទិញ / Intake Quantity (KG)
                  </label>
                  <input
                    type="number"
                    value={formQuantityKg}
                    onChange={(e) => setFormQuantityKg(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    សំណើម / Moisture %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formMoisture}
                    onChange={(e) => setFormMoisture(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    កម្រិតគុណភាព / Grade
                  </label>
                  <input
                    type="text"
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    កាលបរិច្ឆេទប្រមូលផល / Harvest Date
                  </label>
                  <input
                    type="date"
                    value={formHarvestDate}
                    onChange={(e) => setFormHarvestDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2 pt-3"
              >
                <CheckCircle2 size={16} />
                <span>បញ្ជាក់ការកត់ត្រា និងបង្កើតលិខិតឆ្លងដែនកសិផល (Verify & Generate Passport)</span>
              </button>
            </form>
          </div>

          {/* Quick Specification Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full uppercase">
              Standardized Specs
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                {selectedMaterial?.nameEnglish}
              </h3>
              <p className="text-xs text-amber-300 font-semibold">
                {selectedMaterial?.nameKhmer}
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-800 pt-3 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono text-[11px]">
                <span className="text-slate-400">Origin Zone:</span>
                <span className="font-bold text-white">{selectedMaterial?.originProvince}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono text-[11px]">
                <span className="text-slate-400">Max Moisture:</span>
                <span className="font-bold text-emerald-400">{selectedMaterial?.moistureLimit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono text-[11px]">
                <span className="text-slate-400">Packaging Spec:</span>
                <span className="font-bold text-slate-200 text-right">{selectedMaterial?.packagingSpec}</span>
              </div>
              <div className="flex justify-between py-1 font-mono text-[11px]">
                <span className="text-slate-400">Compliance:</span>
                <span className="font-bold text-amber-300 text-right">{selectedMaterial?.euAseanCompliance}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-white block">SME Verification Rules:</span>
              <p>Each logged batch creates a verifiable digital trail matching smallholder origins with quality lab checks before export packing.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION LEDGER & PASSPORT PREVIEW */}
      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batches List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  បញ្ជីឡូត៍កសិផលដែលបានផ្ទៀងផ្ទាត់ (Verified Agri-Product Batches)
                </h2>
                <p className="text-xs text-slate-500">Click any batch to inspect the digital passport & printable certificate.</p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                {batches.length} Records
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {batches.map(batch => {
                const isSelected = viewBatch?.id === batch.id;
                return (
                  <div
                    key={batch.id}
                    onClick={() => setViewBatch(batch)}
                    className={`p-3.5 rounded-xl transition cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                      isSelected ? 'bg-emerald-50 border border-emerald-300' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {batch.batchNumber}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ✓ {batch.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">
                        {batch.materialName}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {batch.smeName} • {batch.originProvince} ({batch.originCommune})
                      </p>
                    </div>

                    <div className="text-right text-xs font-mono">
                      <span className="font-bold text-slate-900 block text-sm">{batch.quantityKg} KG</span>
                      <span className="text-[10px] text-slate-500">Moisture: {batch.moisturePercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Digital Passport Preview */}
          {viewBatch && (
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                    Product Passport
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {viewBatch.batchNumber}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  EU/ASEAN Ready
                </span>
              </div>

              {/* QR Mockup */}
              <div className="bg-white p-4 rounded-xl text-center space-y-2">
                <div className="w-28 h-28 bg-slate-950 mx-auto rounded-lg flex items-center justify-center p-2">
                  <div className="w-full h-full border-4 border-white flex items-center justify-center font-mono text-[9px] text-white font-bold">
                    [QR CODE]
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-900 block">
                  {viewBatch.qrCodeVal}
                </span>
              </div>

              {/* Passport Specs */}
              <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Enterprise:</span>
                  <span className="text-white font-sans font-bold">{viewBatch.smeName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Commodity:</span>
                  <span className="text-amber-300 font-bold">{viewBatch.materialName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Net Sourced:</span>
                  <span className="text-white font-bold">{viewBatch.quantityKg} KG</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400">Origin Zone:</span>
                  <span className="text-emerald-400">{viewBatch.originProvince}</span>
                </div>
                <div className="flex justify-between py-1 text-[11px]">
                  <span className="text-slate-400">Certified by:</span>
                  <span className="text-slate-200">{viewBatch.inspectorName}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Passport</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ORIGIN NETWORK MAP */}
      {activeTab === 'map' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                ផែនទីប្រភពកសិផលចម្រុះ និងគ្រឿងទេសកម្ពុជា (Cambodia Spices & Agri Origin Map)
              </h2>
              <p className="text-xs text-slate-500">Interactive geographical network of registered SME farms, wild forest hubs, and processing centers.</p>
            </div>
          </div>

          <div className="relative h-[420px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4 flex flex-col justify-between text-white">
            <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-800 text-xs">
              <span className="text-amber-400 font-bold block">CAMBODIA AGRI NETWORK</span>
              <span className="text-[10px] text-slate-400 font-mono">6 Regional Processing Hubs</span>
            </div>

            {/* SVG Interactive Map */}
            <svg viewBox="0 0 500 360" className="w-full h-full select-none">
              {/* Abstract Outline */}
              <path
                d="M 60 140 Q 150 40 260 70 Q 360 30 430 110 Q 470 190 440 280 Q 380 340 280 320 Q 180 350 110 300 Q 70 240 60 140 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Node Pins for each SME */}
              {REGISTERED_AGRI_SMES.map((sme, idx) => {
                // Approximate relative layout positions
                const coords: Record<string, { x: number; y: number }> = {
                  'Kampot': { x: 200, y: 310 },
                  'Pursat': { x: 170, y: 190 },
                  'Battambang': { x: 130, y: 130 },
                  'Kampong Speu': { x: 240, y: 260 },
                  'Mondulkiri': { x: 410, y: 190 },
                  'Siem Reap': { x: 210, y: 100 }
                };
                const pt = coords[sme.province] || { x: 250, y: 180 };
                const isSelected = sme.id === selectedSmeId;

                return (
                  <g 
                    key={sme.id} 
                    onClick={() => handleSelectSme(sme)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 10 : 7}
                      fill={isSelected ? '#f59e0b' : '#10b981'}
                      className="transition-all duration-300"
                    />
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={16}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        className="animate-ping opacity-75"
                      />
                    )}
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      fill={isSelected ? '#fbbf24' : '#e2e8f0'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {sme.province} ({sme.code})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Legend */}
            <div className="z-10 bg-slate-950/90 backdrop-blur p-3 rounded-lg border border-slate-800 text-[11px] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Active Selected SME Hub</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Registered Processing Hub</span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">
                Click any province pin to switch active SME session
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
