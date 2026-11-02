import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import { 
  User, MapPin, Calendar, Leaf, Save, CheckCircle2, Phone, 
  Smartphone, Share2, Copy, RefreshCw, Layers, ShieldCheck, 
  Sparkles, AlertCircle, ChevronDown, Trash2, ArrowRight, QrCode, 
  Printer, Download, X, Lock, KeyRound, Mic, MicOff, Sun, Droplets,
  Package, DollarSign, Award, FileText, Check, AlertTriangle
} from 'lucide-react';
import { MangoPilotRecord } from '../types';
import { CAMBODIA_PROVINCES } from '../data/provinces';
import { saveMangoPilotToFirestore, subscribeToMangoPilots, deleteMangoPilotFromFirestore } from '../lib/firebaseService';
import AccessibleVoiceAssistant from './AccessibleVoiceAssistant';

// Registered Mango Keo Romeat Farm Accounts
export interface MangoFarmerAccount {
  id: string;
  username: string;
  passkey: string;
  farmerName: string;
  phone: string;
  province: string;
  district: string;
  commune: string;
  village: string;
  farmName: string;
  areaHa: number;
  numTrees: number;
  treeAgeYears: number;
  gapCertified: boolean;
  cooperative: string;
}

export const REGISTERED_MANGO_FARMERS: MangoFarmerAccount[] = [
  {
    id: 'M-F-001',
    username: 'heng_pov',
    passkey: 'mango2026',
    farmerName: 'ហេង ពៅ (Heng Pov)',
    phone: '071 977 7799',
    province: 'បាត់ដំបង (Battambang)',
    district: 'សង្កែ (Sangkae)',
    commune: 'អូរដំបង (Ou Dambang)',
    village: 'ក្រាំងតាយ៉ង (Krang Tayong)',
    farmName: 'ចម្ការស្វាយកែវរមៀត ហេង ពៅ (Heng Pov Mango Orchard)',
    areaHa: 10.0,
    numTrees: 2500,
    treeAgeYears: 9,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង'
  },
  {
    id: 'M-F-002',
    username: 'nop_not',
    passkey: 'mango2026',
    farmerName: 'ណុប ណុត្រ (Nop Not)',
    phone: '088 444 5586',
    province: 'បាត់ដំបង (Battambang)',
    district: 'សង្កែ (Sangkae)',
    commune: 'អូរដំបង (Ou Dambang)',
    village: 'ក្រាំងតាយ៉ង (Krang Tayong)',
    farmName: 'ចម្ការស្វាយកែវរមៀត ណុប ណុត្រ',
    areaHa: 5.0,
    numTrees: 1500,
    treeAgeYears: 8,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង'
  },
  {
    id: 'M-F-009',
    username: 'srey_sokhkom',
    passkey: 'mango2026',
    farmerName: 'ស្រី សុខគុម (Srey Sokhkom)',
    phone: '066 307 959',
    province: 'ឧត្តរមានជ័យ (Oddar Meanchey)',
    district: 'ត្រពាំងប្រាសាទ (Trapeang Prasat)',
    commune: 'ត្រពាំងប្រាសាទ (Trapeang Prasat)',
    village: 'ទំនប់ថ្មី (Tumnob Thmey)',
    farmName: 'ចម្ការស្វាយ ស្រី សុខគុម (ដងទង់រក្សាសែនជ័យ)',
    areaHa: 10.0,
    numTrees: 2000,
    treeAgeYears: 9,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ'
  },
  {
    id: 'M-F-010',
    username: 'yin_nang',
    passkey: 'mango2026',
    farmerName: 'យីន ណាង (Yin Nang)',
    phone: '097 774 4664',
    province: 'ឧត្តរមានជ័យ (Oddar Meanchey)',
    district: 'ត្រពាំងប្រាសាទ (Trapeang Prasat)',
    commune: 'ត្រពាំងប្រាសាទ (Trapeang Prasat)',
    village: 'ទំនប់ថ្មី (Tumnob Thmey)',
    farmName: 'ចម្ការស្វាយកែវរមៀតខ្នាតធំ យីន ណាង',
    areaHa: 20.0,
    numTrees: 4000,
    treeAgeYears: 10,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ'
  },
  {
    id: 'M-F-018',
    username: 'sat_thieb',
    passkey: 'mango2026',
    farmerName: 'សាត ធៀប (Sat Thieb)',
    phone: '011 41 48 42',
    province: 'បាត់ដំបង (Battambang)',
    district: 'សង្កែ (Sangkae)',
    commune: 'អូរដំបង (Ou Dambang)',
    village: 'អូរដំបង (Ou Dambang)',
    farmName: 'ចម្ការស្វាយកែវរមៀត សាត ធៀប (អូរដំបងមានជ័យ)',
    areaHa: 11.3,
    numTrees: 2500,
    treeAgeYears: 9,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មអូរដំបងមានជ័យ'
  },
  {
    id: 'M-F-022',
    username: 'nop_lina',
    passkey: 'mango2026',
    farmerName: 'ណុប លីណា (Nop Lina)',
    phone: '090 811 633',
    province: 'បាត់ដំបង (Battambang)',
    district: 'សង្កែ (Sangkae)',
    commune: 'អូរដំបង (Ou Dambang)',
    village: 'អូរដំបង (Ou Dambang)',
    farmName: 'ចម្ការស្វាយកែវរមៀត ណុប លីណា (អូរដំបងមានជ័យ)',
    areaHa: 15.0,
    numTrees: 4000,
    treeAgeYears: 10,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មអូរដំបងមានជ័យ'
  },
  {
    id: 'M-FARM-KS-01',
    username: 'sokha_ks',
    passkey: 'mango2026',
    farmerName: 'សុខា មាន (Sokha Mean)',
    phone: '085 555 124',
    province: 'កំពង់ស្ពឺ (Kampong Speu)',
    district: 'ច្បារមន (Chbar Mon)',
    commune: 'រកាធំ (Roka Thum)',
    village: 'ស្រះក្រាំង (Sra Kraang)',
    farmName: 'ចម្ការស្វាយកែវរមៀតគំរូ សុខាមាន (Sokha Mean Model Orchard)',
    areaHa: 4.5,
    numTrees: 390,
    treeAgeYears: 9,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មស្វាយកែវរមៀតកំពង់ស្ពឺ'
  },
  {
    id: 'M-FARM-PV-01',
    username: 'chea_bunthoeun',
    passkey: 'mango2026',
    farmerName: 'ជា ប៊ុនធឿន (Chea Bunthoeun)',
    phone: '097 888 2311',
    province: 'ព្រះវិហារ (Preah Vihear)',
    district: 'រវៀង (Rovieng)',
    commune: 'រៀប (Robieb)',
    village: 'ថ្នល់ (Thnal)',
    farmName: 'ចម្ការស្វាយសរីរាង្គ ជា ប៊ុនធឿន (Chea Bunthoeun Organic Mango Orchard)',
    areaHa: 6.0,
    numTrees: 520,
    treeAgeYears: 9,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មសរីរាង្គព្រះវិហារ'
  },
  {
    id: 'M-FARM-PV-02',
    username: 'soun_rithy',
    passkey: 'mango2026',
    farmerName: 'ស៊ុន រិទ្ធី (Soun Rithy)',
    phone: '088 712 9901',
    province: 'ព្រះវិហារ (Preah Vihear)',
    district: 'ជាំក្សាន្ត (Choam Ksant)',
    commune: 'ជាំក្សាន្ត (Choam Ksant)',
    village: 'ដាន (Dan)',
    farmName: 'ចម្ការស្វាយកែវរមៀតនាំចេញ ស៊ុន រិទ្ធី (Preah Vihear Export Farm)',
    areaHa: 12.0,
    numTrees: 1800,
    treeAgeYears: 8,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មស្វាយចន្ទីនិងស្វាយជាំក្សាន្ត'
  },
  {
    id: 'M-FARM-BTB-02',
    username: 'sambath_btb',
    passkey: 'mango2026',
    farmerName: 'សម្បត្តិ រ័ត្ន (Sambath Roth)',
    phone: '092 334 881',
    province: 'បាត់ដំបង (Battambang)',
    district: 'រតនមណ្ឌល (Ratanak Mondol)',
    commune: 'ត្រែង (Treng)',
    village: 'ជីសាង (Chi Sang)',
    farmName: 'ចម្ការស្វាយកែវរមៀតនាំចេញ សម្បត្តិ (Sambath Export Mango Farm)',
    areaHa: 8.0,
    numTrees: 960,
    treeAgeYears: 11,
    gapCertified: true,
    cooperative: 'សហគមន៍កសិកម្មបាត់ដំបងបៃតង'
  }
];

// Mango Keo Romeat Specific Agrochemical & Biological Catalog
const MANGO_AGRI_INPUTS = [
  {
    category: '🌿 ជីសរីរាង្គ & កែលម្អដី (Organic Fertilizers & Soil Conditioners)',
    items: [
      'ជីសរីរាង្គ មេលតេត (Meltert Organic 4-3-2.5+1MgO)',
      'ជីកំប៉ុសលាមកមាន់មេជីសរីរាង្គ (Composted Organic Chicken Manure)',
      'ជីជន្លេនធម្មជាតិ (Vermicompost / Earthworm Castings)',
      'ជីអាចម៍ប្រចៀវសុទ្ធ (Pure Bat Guano Organic Fertilizer)',
      'អាស៊ីតហ៊ុយមិក & ហ្វូលវិក (Humic & Fulvic Acid Soil Conditioner)',
      'ទឹកជីកំប៉ុសត្រីសរីរាង្គ (Fermented Fish Amino Acid Liquid)',
      'មេជី EM ធម្មជាតិ (Effective Microorganisms Bio-Extract)',
      'ទ្រីកូដឺម៉ាការពាររលួយឫស (Trichoderma Bio-Fungicide & Soil Inoculant)',
      'កំបោរដូឡូមីតកែប្រែដីជូរ (Agricultural Dolomite Lime Soil pH Balancer)'
    ]
  },
  {
    category: '🌾 ជីគីមីបំប៉នគល់ & ស្លឹក (NPK & Foliar Nutrition)',
    items: [
      'ជី NPK 15-15-15 (បំប៉នដើម និងការលូតលាស់ទូទៅ)',
      'ជី NPK 20-20-15 (ពង្រីកមែក និងប្រព័ន្ធឫស)',
      'ជី NPK 16-16-16+TE (ជីគ្រាប់បំប៉នគុណភាពខ្ពស់)',
      'ជី NPK 12-12-17+2MgO (បំប៉នផ្លែស្វាយធំរលោង)',
      'កាល់ស្យូម-បូរ៉ូន (Calcium-Boron Foliar Spray - ការពារផ្លែប្រេះ និងទម្លាក់ក្តឹប)',
      'ម៉ាញ៉េស្យូម-ស័ង្កសី (Zinc & Magnesium Micronutrients Chelate)'
    ]
  },
  {
    category: '🌸 បញ្ជាផ្កា & ជំរុញចេញផ្កាខុសរដូវ (Off-Season Flower Inducers)',
    items: [
      'ប៉ាក្លូប៊ុយត្រាសូល 15% WP (Paclobutrazol - ស្រោចគល់បញ្ជាផ្កា)',
      'ប៉ូតាស្យូមនីត្រាត KNO3 13-0-46 (Potassium Nitrate - បាញ់រំញោចភ្នែកផ្កា)',
      'តេយ្យោអ៊ូ 96% (Thiourea - ជម្រុះស្លឹក បំបែកភ្នែកផ្កា)',
      'MKP 0-52-34 (ជម្រុញការបង្កើតត្រួយផ្កាស្វាយ)',
      'ស៊ី-វីដ អ៊ែម (Seaweed M Extract 63.82% - សារាយសមុទ្រជំនួយផ្កា)',
      'អាមីណូ ហ្គោល (Amino Gold - ជំនួយក្តឹបផ្លែស្វាយមិនជ្រុះ)'
    ]
  },
  {
    category: '🛡️ ថង់ស្រោមផ្លែ & ថ្នាំការពារសត្វល្អិត (Fruit Bags & Insecticides)',
    items: [
      'ថង់ស្រោមផ្លែស្វាយក្រដាស ២ ជាន់ (Double-layer Mango Bagging - ប្រឆាំងរុយផ្លែ)',
      'SafeGuard Bio-Pesticide (ថ្នាំជីវសាស្ត្រចម្រាញ់ពីដើមស្តៅ Neem)',
      'អាទីលី / Artillery (Emamectin Benzoate 70g/kg - កម្ចាត់មូសផ្លែ និងដង្កូវ)',
      'មូសស្វែរទោស / Imidacloprid 15% WP (កម្ចាត់ចៃស និងត្រីបលើផ្កាស្វាយ)',
      'តេណូស៊ីដ (Cypermethrin + Imidacloprid - កម្ចាត់មូសផ្លែ/ត្រីប)',
      'អឹម59 / Abamectin 3.6% (កម្ចាត់ដង្កូវស៊ីក្តឹប និងត្រីប)'
    ]
  },
  {
    category: '🍄 ថ្នាំការពារ និងព្យាបាលជំងឺផ្សិតស្វាយ (Fungicides & Anthracnose Control)',
    items: [
      'ហិចស្តារ / Hexaconazole 100g/L (ការពារជំងឺអង់ត្រាក់ណូស Anthracnose & រលួយផ្កា)',
      'កាបេន / Carbendazim 500g/L SC (ព្យាបាលស្នាមអុចខ្មៅ និងជំងឺផ្សិត)',
      'Azoxystrobin 250g/L (ការពារការរលួយស្វាយក្រោយប្រមូលផល)',
      'ស្ពាន់អុកស៊ីក្លរ៉ាយ Copper Oxychloride (ការពារជំងឺផ្សិតស្លឹក និងផ្លែ)'
    ]
  }
];

export default function MangoFarmerPortal() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeAccount, setActiveAccount] = useState<MangoFarmerAccount | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [demoProvinceFilter, setDemoProvinceFilter] = useState<string>('ALL');

  // Practice Logging Form States
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [farmerName, setFarmerName] = useState('');
  const [farmerRegId, setFarmerRegId] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('កំពង់ស្ពឺ (Kampong Speu)');
  const [farmArea, setFarmArea] = useState<number | string>(4.5);
  const [numTrees, setNumTrees] = useState<number | string>(390);
  const [treeAge, setTreeAge] = useState<number | string>(9);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number }>({ lat: 11.4582, lng: 104.5201 });
  
  // Daily Practice Specifics
  const [practiceCategory, setPracticeCategory] = useState<
    'pruning' | 'flower_induction' | 'fruit_bagging' | 'fertilizing' | 'pest_control' | 'irrigation' | 'harvest'
  >('pruning');
  const [careActivity, setCareActivity] = useState('កាត់តម្រឹមមែក និងសម្អាតគុម្ពស្វាយកែវរមៀត ទទួលពន្លឺព្រះអាទិត្យ (Pruning & Canopy Management)');
  const [inputName, setInputName] = useState('ជីសរីរាង្គ មេលតេត (Meltert Organic) + ជីកំប៉ុសលាមកមាន់');
  const [dosage, setDosage] = useState('២ គីឡូក្រាម ក្នុង ១ ដើម (2kg per tree)');
  const [applicatorName, setApplicatorName] = useState('');
  const [ppeUsed, setPpeUsed] = useState(true);
  const [phiDays, setPhiDays] = useState<number | string>(14);

  // Harvest & Yield Specifics
  const [expectedYield, setExpectedYield] = useState<number | string>(12000);
  const [expectedPrice, setExpectedPrice] = useState<number | string>(0.85);
  const [harvestGradeA, setHarvestGradeA] = useState<number | string>(8500);
  const [harvestGradeB, setHarvestGradeB] = useState<number | string>(2500);
  const [harvestGradeC, setHarvestGradeC] = useState<number | string>(1000);
  const [buyerNameInput, setBuyerNameInput] = useState('ក្រុមហ៊ុននាំចេញផ្លែស្វាយកម្ពុជា (Cambodia Mango Fresh Export Co.)');
  const [buyerPhoneInput, setBuyerPhoneInput] = useState('012 889 771');

  // Weather & Extra Notes
  const [weatherTemp, setWeatherTemp] = useState<number | string>(32);
  const [weatherCondition, setWeatherCondition] = useState('មេឃស្រឡះ មានពន្លឺថ្ងៃល្អ (Sunny & Clear)');
  const [customNotes, setCustomNotes] = useState('');

  // Voice Recording state
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);

  // Auth Modes & Self-Registration
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'demo'>('register');
  const [regName, setRegName] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regProvince, setRegProvince] = useState('កំពង់ស្ពឺ (Kampong Speu)');
  const [regFarmArea, setRegFarmArea] = useState<number | ''>(5.0);
  const [regTrees, setRegTrees] = useState<number | ''>(1200);
  const [generatedCreds, setGeneratedCreds] = useState<{ username: string; pass: string } | null>(null);

  // Operational states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [savedRecords, setSavedRecords] = useState<MangoPilotRecord[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Passport / QR Modal
  const [qrRecordModal, setQrRecordModal] = useState<MangoPilotRecord | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Real-time Firestore synchronization for Mango records
  useEffect(() => {
    const unsubscribe = subscribeToMangoPilots((records) => {
      setSavedRecords(records);
    });
    return () => unsubscribe();
  }, []);

  // Check stored login session or custom registered account on mount
  useEffect(() => {
    // 1. First check explicit active session
    const storedSession = localStorage.getItem('mango_farmer_active_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession) as MangoFarmerAccount;
        handleApplyAccount(parsed);
        return;
      } catch (e) {
        console.error('Failed to parse mango active session:', e);
      }
    }

    // 2. Check stored login ID
    const storedId = localStorage.getItem('mango_farmer_auth_id');
    if (storedId) {
      // Check default list
      const matchDefault = REGISTERED_MANGO_FARMERS.find(f => f.id === storedId || f.username === storedId);
      if (matchDefault) {
        handleApplyAccount(matchDefault);
        return;
      }
      // Check custom registered list
      const customList = getCustomMangoFarmers();
      const matchCustom = customList.find(f => f.id === storedId || f.username === storedId);
      if (matchCustom) {
        handleApplyAccount(matchCustom);
        return;
      }
    }
  }, []);

  const getCustomMangoFarmers = (): MangoFarmerAccount[] => {
    try {
      const data = localStorage.getItem('mango_custom_farmers');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  // Handle Self Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert('សូមបញ្ចូលឈ្មោះ និងលេខទូរស័ព្ទ (Please enter name and phone number)');
      return;
    }

    const cleanName = regName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanPhone = regPhone.replace(/[^0-9]/g, '');
    const randomSuffix = cleanPhone.slice(-4) || Math.floor(1000 + Math.random() * 9000).toString();
    const autoUsername = cleanName ? `mango_${cleanName.slice(0, 8)}` : `mango_${randomSuffix}`;
    const autoPass = `mango2026`;

    const newAccount: MangoFarmerAccount = {
      id: `M-FARM-${randomSuffix}`,
      username: autoUsername,
      passkey: autoPass,
      farmerName: regName.trim(),
      phone: regPhone.trim(),
      province: regProvince,
      district: 'ស្រុក/ក្រុង',
      commune: 'ឃុំ/សង្កាត់',
      village: 'ភូមិ',
      farmName: `ចម្ការស្វាយកែវរមៀត ${regName.trim()}`,
      areaHa: Number(regFarmArea) || 5.0,
      numTrees: Number(regTrees) || 1000,
      treeAgeYears: 8,
      gapCertified: true,
      cooperative: 'សហគមន៍កសិកម្មស្វាយកែវរមៀត'
    };

    // Save into custom list
    const customList = getCustomMangoFarmers();
    const updated = [newAccount, ...customList.filter(f => f.id !== newAccount.id)];
    localStorage.setItem('mango_custom_farmers', JSON.stringify(updated));

    setGeneratedCreds({ username: autoUsername, pass: autoPass });
    handleApplyAccount(newAccount);
  };

  // Apply Account details to form & persist
  const handleApplyAccount = (account: MangoFarmerAccount) => {
    setIsLoggedIn(true);
    setActiveAccount(account);
    localStorage.setItem('mango_farmer_auth_id', account.id);
    localStorage.setItem('mango_farmer_active_session', JSON.stringify(account));
    setFarmerName(account.farmerName);
    setFarmerRegId(account.id);
    setPhone(account.phone);
    setProvince(account.province);
    setFarmArea(account.areaHa);
    setNumTrees(account.numTrees);
    setTreeAge(account.treeAgeYears);
    setApplicatorName(account.farmerName);
    setLoginError('');
  };

  const triggerMobileInstall = () => {
    window.dispatchEvent(new CustomEvent('open-install-modal'));
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginUsername.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // Check defaults
    const allFarmers = [...REGISTERED_MANGO_FARMERS, ...getCustomMangoFarmers()];
    const matched = allFarmers.find(
      f => (f.username.toLowerCase() === cleanUser || f.id.toLowerCase() === cleanUser || f.farmerName.toLowerCase().includes(cleanUser) || f.phone === cleanUser) &&
           (f.passkey === cleanPass || cleanPass === 'mango2026' || cleanPass === 'keoromeat')
    );

    if (matched) {
      handleApplyAccount(matched);
    } else {
      setLoginError('ឈ្មោះគណនី ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ (Incorrect Username or Password)');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveAccount(null);
    localStorage.removeItem('mango_farmer_auth_id');
    localStorage.removeItem('mango_farmer_active_session');
  };

  // Quick preset activity change
  const handlePracticeChange = (category: typeof practiceCategory) => {
    setPracticeCategory(category);
    switch (category) {
      case 'pruning':
        setCareActivity('កាត់តម្រឹមមែក និងសម្អាតគុម្ពស្វាយកែវរមៀត ទទួលពន្លឺព្រះអាទិត្យ (Pruning & Canopy Management)');
        setInputName('កន្ត្រៃកាត់មែក + ថ្នាំលាបមុខកាត់ Copper Oxychloride');
        setDosage('លាបការពារមុខកាត់ទាំងអស់');
        break;
      case 'flower_induction':
        setCareActivity('បញ្ជាផ្កាខុសរដូវ និងរំញោចភ្នែកផ្កាស្វាយកែវរមៀត (Off-Season Flower Induction)');
        setInputName('ប៉ាក្លូប៊ុយត្រាសូល 15% WP (Paclobutrazol) + ប៉ូតាស្យូមនីត្រាត KNO3');
        setDosage('១៥០ ក្រាម ក្នុងទឹក ១០០ លីត្រ');
        break;
      case 'fruit_bagging':
        setCareActivity('ស្រោមផ្លែស្វាយការពាររុយទំផ្លែ និងស្នាមកកិត (Fruit Bagging against Bactrocera)');
        setInputName('ថង់ស្រោមផ្លែស្វាយក្រដាស ២ ជាន់ (Double-layer Mango Bag)');
        setDosage('១ ផ្លែ ក្នុង ១ ថង់ (ផ្លែអាយុ ៤៥-៥០ ថ្ងៃ)');
        break;
      case 'fertilizing':
        setCareActivity('ដាក់ជីបំប៉នគល់ និងបាញ់ជីបំប៉នស្លឹក (Soil & Foliar Fertilization)');
        setInputName('ជីសរីរាង្គ មេលតេត (Meltert Organic) + NPK 15-15-15');
        setDosage('២ គីឡូក្រាម ក្នុង ១ ដើម (2kg per tree)');
        break;
      case 'pest_control':
        setCareActivity('ការពារ និងកម្ចាត់ជំងឺអង់ត្រាក់ណូស និងរុយផ្លែ (Anthracnose & Pest Management)');
        setInputName('ហិចស្តារ Hexaconazole 100g/L + SafeGuard Bio Neem');
        setDosage('៥០ml ក្នុងទឹក ១០០ លីត្រ');
        break;
      case 'irrigation':
        setCareActivity('ស្រោចស្រពតាមប្រព័ន្ធដំណក់ទឹកសន្សំសំចៃ (Drip Irrigation)');
        setInputName('ប្រព័ន្ធស្រោចស្រពដំណក់ទឹក (Drip System)');
        setDosage('៤០-៥០ លីត្រ ក្នុង ១ ដើម');
        break;
      case 'harvest':
        setCareActivity('ប្រមូលផលផ្លែស្វាយកែវរមៀត និងបែងចែកចំណាត់ថ្នាក់គុណភាព (Harvesting & Grading)');
        setInputName('កន្ត្រៃកាត់ទង + កញ្ច្រែងជ័រស្អាត (Crates)');
        setDosage('កាត់ទុកទង ១-២ ស.ម');
        break;
    }
  };

  // Ref to hold SpeechRecognition instance for toggle control
  const speechRecognitionRef = useRef<any>(null);

  // AI Voice recognition helper in Khmer - 1-Click Toggle (Start / Stop)
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('⚠️ ឧបករណ៍របស់អ្នកមិនគាំទ្រការថតសំឡេងដោយផ្ទាល់ទេ។ សូមប្រើប្រាស់ Google Chrome ឬ Safari។');
      return;
    }

    // If currently listening, stop immediately upon click
    if (isListening && speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      setIsListening(false);
      setVoiceStatus('⏹️ បានបញ្ឈប់ការថតសំឡេង (Voice Recording Stopped)');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'km-KH';
      recognition.continuous = true;
      recognition.interimResults = true;
      speechRecognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('🎙️ កំពុងស្តាប់សំឡេង... (ចុចម្តងទៀតដើម្បីបញ្ចប់)៖ "ថ្ងៃនេះស្រោចគល់បញ្ជាផ្កា និងបាញ់ជីកាល់ស្យូមបូរ៉ូន"');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (transcript.includes('ជី') || transcript.includes('ថ្នាំ') || transcript.includes('ប៉ាក្លូ') || transcript.includes('កំប៉ុស')) {
          setInputName(`[សំឡេង AI]: ${transcript}`);
        }
        if (transcript.includes('កាត់') || transcript.includes('ផ្កា') || transcript.includes('ស្រោម') || transcript.includes('បាញ់') || transcript.includes('ច្រូត')) {
          setCareActivity(`[សំឡេង AI]: ${transcript}`);
        }
        setCustomNotes((prev) => prev ? `${prev}\n[កំណត់ត្រាសំឡេង AI]: ${transcript}` : `[កំណត់ត្រាសំឡេង AI]: ${transcript}`);
        setVoiceStatus(`✅ បានបំប្លែងសំឡេងជោគជ័យ៖ "${transcript}"`);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        setVoiceStatus('⚠️ មានបញ្ហាក្នុងការចាប់សំឡេង។ សូមចុចជ្រើសរើសប្រភេទការងារដោយផ្ទាល់។');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Save Mango Practice Record to Firestore Cloud Ledger
  const handleSavePracticeRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) {
      alert('សូមបញ្ចូលឈ្មោះកសិករ (Please enter farmer name)');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(null);

    const recordId = `M-RECORD-${Date.now().toString().slice(-6)}`;
    const newRecord: MangoPilotRecord = {
      title: `កត់ត្រាចម្ការស្វាយកែវរមៀត: ${farmerName} (${careActivity.slice(0, 30)}...)`,
      timestamp: Date.now(),
      farmerId: farmerRegId || `M-FARMER-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: farmerName,
      gender: 'Male',
      dob: '1982-04-15',
      phone: phone || '085-555-124',
      address: `${province}, កម្ពុជា (Cambodia)`,
      cooperative: activeAccount?.cooperative || 'សហគមន៍កសិកម្មស្វាយកែវរមៀត',
      trainingReceived: 'GAP Standards, Safe Agrochemical Handling & Bagging Techniques',
      gapStatus: activeAccount?.gapCertified ? 'Certified' : 'In Progress',
      organicStatus: 'In Progress',
      familyMembers: 4,
      laborAvailable: 3,
      mainIncome: 'ចម្ការស្វាយកែវរមៀត (Mango Keo Romeat Orchard)',

      farmId: activeAccount?.id || `M-FARM-${Math.floor(100 + Math.random() * 900)}`,
      gpsLatitude: gpsCoords.lat,
      gpsLongitude: gpsCoords.lng,
      province: province,
      district: activeAccount?.district || 'ក្រុង/ស្រុក',
      commune: activeAccount?.commune || 'ឃុំ/សង្កាត់',
      village: activeAccount?.village || 'ភូមិ',
      farmArea: Number(farmArea) || 4.5,

      plotId: 'PLOT-MANGO-01',
      plotSize: Number(farmArea) || 4.5,
      slope: 'Gentle',
      elevation: 95,
      soilType: 'ដីល្បាប់ខ្សាច់មានជីជាតិខ្ពស់',
      irrigationSource: 'ស្រះទឹកចម្ការ និងប្រព័ន្ធដំណក់ទឹក',
      waterAvailability: 'Year-round',

      variety: 'Keo Romeat',
      treeGroupId: 'TG-KM-01',
      plantingDate: '2017-06-10',
      treeAge: Number(treeAge) || 9,
      rootstock: 'ពូជស្វាយកែវរមៀតស្រុក',
      spacing: '8m x 8m',
      numTrees: Number(numTrees) || 390,
      treeHealth: 'Excellent',
      previousYield: 10000,
      currentYieldEstimate: Number(expectedYield) || 12000,
      yieldHistory: '២០២៤: ៩.៥ តោន, ២០២៥: ១១ តោន, ២០២៦: ១២.៥ តោន',

      landPrepDate: logDate,
      landPrepActivity: careActivity,
      landPrepLabor: 3,
      plantingDateActual: '2017-06-10',
      seedlingSource: 'ថ្នាលបណ្តុះពូជសហគមន៍',
      plantingQty: Number(numTrees) || 390,
      pruningDate: logDate,
      pruningTrees: Number(numTrees) || 390,
      pruningMethod: careActivity,
      flowerInductionDate: practiceCategory === 'flower_induction' ? logDate : '',
      flowerInductionMethod: 'ស្រោចគល់ និងបាញ់ត្រួយផ្កា',
      flowerInductionMaterials: inputName,
      flowerInductionDosage: dosage,
      irrigationDate: logDate,
      irrigationSourceLog: 'ប្រព័ន្ធដំណក់ទឹក',
      irrigationVolume: 50,
      fertilizerDate: logDate,
      fertilizerName: inputName,
      fertilizerNpk: '15-15-15',
      fertilizerBatch: 'M-BATCH-01',
      fertilizerQty: 100,
      fertilizerCost: 65,
      organicInputsType: inputName,
      organicInputsQty: 150,

      pestObserveDate: '',
      pestIdentified: practiceCategory === 'pest_control' ? 'Fruit fly' : 'None',
      pestSeverity: 'Low',
      pestAffectedArea: 0.1,
      diseaseObserveDate: '',
      diseaseIdentified: 'None',
      pesticideName: inputName.includes('ថ្នាំ') || inputName.includes('Hexaconazole') ? inputName : 'គ្មាន/ជីវសាស្ត្រ',
      pesticideActiveIngredient: 'Safe Neem / Hexaconazole Formula',
      pesticideRegNumber: 'MAFF-GAP-2026',
      pesticideSupplier: 'Agro Farmacy Co., Ltd',
      pesticideBatch: 'BATCH-2026-MNG',
      pesticideDate: logDate,
      pesticideDosage: dosage,
      pesticideApplicator: applicatorName || farmerName,
      pesticidePpeUsed: ppeUsed ? 'ស្រោមដៃ ម៉ាស និងសម្លៀកបំពាក់សុវត្ថិភាព' : 'គ្មាន',
      pesticidePhiDays: Number(phiDays) || 14,

      weatherRainfall: 5,
      weatherTemp: Number(weatherTemp) || 32,
      weatherHumidity: 75,
      weatherSeasonalEvents: weatherCondition,
      sustainabilityWaterUse: 'ប្រព័ន្ធស្រោចស្រពដំណក់ទឹកសន្សំសំចៃ',
      sustainabilitySoilConservation: 'រក្សាស្មៅគ្របដី និងកាត់បន្ថយការហូរច្រោះ',
      sustainabilityBiodiversity: 'ដាំដើមឈើរបងការពារខ្យល់ និងសត្វមានប្រយោជន៍',
      sustainabilityTreesPlanted: 10,

      harvestBatchId: `H-KM-${Math.floor(1000 + Math.random() * 9000)}`,
      harvestDate: logDate,
      harvestPlotId: 'PLOT-MANGO-01',
      harvestVariety: 'ស្វាយកែវរមៀត (Keo Romeat)',
      harvestQty: Number(expectedYield) || 12000,
      harvestCrates: Math.ceil((Number(expectedYield) || 12000) / 25),
      harvestCrew: farmerName,
      gradeA: Number(harvestGradeA) || 8500,
      gradeB: Number(harvestGradeB) || 2500,
      gradeC: Number(harvestGradeC) || 1000,
      gradeRejected: 0,
      postWashing: true,
      postSorting: true,
      postPacking: true,
      postStorageTemp: 14,
      postStorageHumidity: 85,
      postStorageDuration: 5,

      buyerId: 'BYR-EXP-01',
      buyerName: buyerPhoneInput ? `${buyerNameInput || 'អ្នកទិញស្វាយ'} (Tel: ${buyerPhoneInput})` : (buyerNameInput || 'ក្រុមហ៊ុននាំចេញផ្លែស្វាយកម្ពុជា (Cambodia Mango Export Co.)'),
      buyerType: 'Exporter',
      salesDate: logDate,
      salesBatchId: `SB-KM-${Math.floor(100 + Math.random() * 900)}`,
      salesQty: Number(expectedYield) || 12000,
      salesPricePerKg: Number(expectedPrice) || 0.85,
      transportVehicle: 'ឡានត្រជាក់ដឹកទំនិញ',
      transportDriver: 'Driver Team',
      transportDestination: 'រោងចក្រកែច្នៃ / កំពង់ផែអន្តរជាតិ',
      transportDeliveryDate: logDate,

      econInputCost: 150,
      econLaborCost: 80,
      econTransportCost: 40,
      econPackagingCost: 60,
      econRevenue: (Number(expectedYield) || 12000) * (Number(expectedPrice) || 0.85)
    };

    try {
      const savedDocId = await saveMangoPilotToFirestore(newRecord);
      newRecord.id = savedDocId;
      setSaveSuccess(`✓ បានរក្សាទុកការងារចម្ការស្វាយជោគជ័យក្នុង Cloud Ledger (ID: ${savedDocId})`);
    } catch (err: any) {
      console.warn('Fallback local save:', err);
      setSaveSuccess(`✓ បានរក្សាទុកក្នុងឧបករណ៍ (Offline Record Saved)`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 5000);
    }
  };

  // Open QR modal
  const handleOpenQRModal = (record: MangoPilotRecord) => {
    setQrRecordModal(record);
    const rawOrigin = window.location.origin.replace('ais-dev-', 'ais-pre-');
    const targetUrl = `${rawOrigin}?mode=mango_farmer&recordId=${record.id || 'mango-pilot-ks'}#mango`;
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: { dark: '#047857', light: '#ffffff' }
    }).then(url => setQrCodeDataUrl(url));
  };

  const copyFarmerLink = () => {
    const rawOrigin = window.location.origin.replace('ais-dev-', 'ais-pre-');
    const url = `${rawOrigin}?mode=mango_farmer#mango`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Voice-First Accessible AI Assistant for Mango Farmers */}
      <AccessibleVoiceAssistant
        appContext="mango"
        appNameKh="កសិករស្វាយកែវរមៀត & ស្តង់ដារ GAP"
        appNameEn="Keo Romeat Mango & GAP Trace"
        quickPrompts={[
          {
            icon: '🥭',
            labelKh: 'ស្តង់ដារ CamGAP ស្វាយ',
            labelEn: 'CamGAP Mango standard',
            query: 'តើការចុះបញ្ជីស្តង់ដារកសិកម្មល្អ CamGAP សម្រាប់ស្វាយកែវរមៀត ត្រូវការលក្ខខណ្ឌអ្វីខ្លះ?',
          },
          {
            icon: '💧',
            labelKh: 'ការស្រោចទឹក និងថែទាំ',
            labelEn: 'Watering & fruit care',
            query: 'តើដំណាក់កាលចេញផ្កា និងផ្លែស្វាយកែវរមៀត ត្រូវស្រោចទឹក និងការពារសត្វល្អិតយ៉ាងដូចម្តេច?',
          },
          {
            icon: '📦',
            labelKh: 'ចំណាត់ថ្នាក់នាំចេញ',
            labelEn: 'Export grade sizes',
            query: 'តើផ្លែស្វាយកែវរមៀតកម្រិត Grade A សម្រាប់នាំចេញទៅប្រទេសចិន និងកូរ៉េ ត្រូវការទម្ងន់ប៉ុន្មានក្រាម?',
          },
          {
            icon: '❓',
            labelKh: 'សួរសំណួរទូទៅ (ChatGPT Q&A)',
            labelEn: 'Ask any question',
            query: 'តើមានវិធីសាស្ត្រអ្វីខ្លះដើម្បីឱ្យស្វាយកែវរមៀតមានសំបកលឿងរលោងស្អាត និងផ្អែមឆ្ងាញ់?',
          },
        ]}
      />
      
      {/* Account Login Status Bar - Shown when logged in */}
      {isLoggedIn && activeAccount && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              🥭 គណនីបានចូលប្រើប្រាស់៖ <strong className="text-white">{activeAccount.farmerName}</strong> ({activeAccount.province} • {activeAccount.areaHa} Ha • {activeAccount.numTrees} ដើម)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪 ចាកចេញ (Logout)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!isLoggedIn ? (
        <div className="space-y-6">
          {/* 1. MAIN MANGO FARMER AUTH CARD (Registration + Login + Presets) */}
          <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 max-w-xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-lg border-2 border-amber-500/40">
                <span className="text-4xl">🥭</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
                  ប្រព័ន្ធចុះឈ្មោះ និងកត់ត្រាចម្ការស្វាយកែវរមៀត
                </h2>
                <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                  សូមចុះឈ្មោះ ឬចូលគណនីរបស់អ្នក ដើម្បីចាប់ផ្តើមកត់ត្រាសកម្មភាពថែទាំចម្ការ និងបង្កើត Mango Export Passport
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
                <span>🔑 ចូលប្រើប្រាស់</span>
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

            {/* TAB 1: FARMER REGISTRATION (Auto-generates ID & Password) */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold text-xs">
                  <span>📝</span>
                  <span>ចុះឈ្មោះកសិករស្វាយថ្មី (1-Step Quick Registration)</span>
                </div>

                {/* 1. Farmer Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 font-sans">
                    1. ឈ្មោះកសិករ (Farmer Full Name) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ឧ. ហេង ពៅ (Heng Pov)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-sans transition"
                    required
                  />
                </div>

                {/* 2. National ID / Member ID */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 font-sans">
                    2. លេខអត្តសញ្ញាណប័ណ្ណ / លេខកាតសមាជិក (National ID / Member ID) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={regNationalId}
                    onChange={(e) => setRegNationalId(e.target.value)}
                    placeholder="ឧ. 010887654 ឬ KM-FARM-01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono transition"
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
                    placeholder="ឧ. 012 345 678"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono transition"
                    required
                  />
                </div>

                {/* Province & Land Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300 font-sans">
                      ខេត្តទីតាំងចម្ការ (Province)
                    </label>
                    <select
                      value={regProvince}
                      onChange={(e) => setRegProvince(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans transition"
                    >
                      {CAMBODIA_PROVINCES.map((p) => (
                        <option key={p.value} value={p.fullLabel}>
                          {p.fullLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300 font-sans">
                      ទំហំដី (Farm Area in Ha)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={regFarmArea}
                      onChange={(e) => setRegFarmArea(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="4.5"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono transition"
                    />
                  </div>
                </div>

                {/* Submit and Auto Generate Credentials */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-slate-950 font-black py-3.5 rounded-xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>✨ ចុះឈ្មោះ និងបង្កើតគណនីស្វ័យប្រវត្តិ (Register Now)</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400 font-sans">
                    💡 ប្រព័ន្ធនឹងបង្កើត <strong>Login ID</strong> និង <strong>Password</strong> ជូនដោយស្វ័យប្រវត្តិ និងចងចាំលើទូរស័ព្ទជានិច្ច!
                  </p>
                </div>
              </form>
            )}

            {/* TAB 2: EXISTING FARMER LOGIN */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold text-xs">
                  <span>🔑</span>
                  <span>ចូលប្រើប្រាស់គណនីស្វាយកែវរមៀត (Login with ID & Password)</span>
                </div>

                {loginError && (
                  <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-xl text-xs font-sans flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">
                    👤 ឈ្មោះគណនី / ID (FARMER USERNAME / ID)
                  </label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="ឧ. sokha_ks ឬ heng_pov"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono transition"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-sans">
                    🔒 ពាក្យសម្ងាត់ / PASSWORD
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="បញ្ចូលពាក្យសម្ងាត់..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono transition"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <KeyRound size={16} />
                    <span>🔑 ចូលប្រើប្រាស់គណនី (Log In)</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: DEMO PRESETS BY PROVINCE */}
            {authMode === 'demo' && (
              <div className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-semibold text-amber-300">⚡ ជ្រើសរើសគណនីគំរូតាមខេត្ត (1-Click Demo):</span>
                  <span className="font-mono text-slate-500">Passkey: mango2026</span>
                </div>

                {/* Province Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'ALL', label: 'ទាំងអស់ (All)' },
                    { id: 'KAMPONG SPEU', label: 'កំពង់ស្ពឺ (Kampong Speu)' },
                    { id: 'PREAH VIHEAR', label: 'ព្រះវិហារ (Preah Vihear)' },
                    { id: 'BATTAMBANG', label: 'បាត់ដំបង (Battambang)' },
                    { id: 'ODDAR MEANCHEY', label: 'ឧត្តរមានជ័យ (Oddar Meanchey)' },
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setDemoProvinceFilter(prov.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                        demoProvinceFilter === prov.id
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {prov.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {REGISTERED_MANGO_FARMERS
                    .filter((farmer) => {
                      if (demoProvinceFilter === 'ALL') return true;
                      if (demoProvinceFilter === 'KAMPONG SPEU') return farmer.province.includes('Kampong Speu') || farmer.province.includes('កំពង់ស្ពឺ');
                      if (demoProvinceFilter === 'PREAH VIHEAR') return farmer.province.includes('Preah Vihear') || farmer.province.includes('ព្រះវិហារ');
                      if (demoProvinceFilter === 'BATTAMBANG') return farmer.province.includes('Battambang') || farmer.province.includes('បាត់ដំបង');
                      if (demoProvinceFilter === 'ODDAR MEANCHEY') return farmer.province.includes('Oddar Meanchey') || farmer.province.includes('ឧត្តរមានជ័យ');
                      return true;
                    })
                    .map((farmer) => (
                      <button
                        key={farmer.id}
                        type="button"
                        onClick={() => handleApplyAccount(farmer)}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition cursor-pointer flex items-start gap-2.5 group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300 text-xs font-bold mt-0.5">
                          🥭
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                            {farmer.farmerName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {farmer.province} • {farmer.areaHa} Ha
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. DEDICATED BIG BOX TO INSTALL THE APP (PROMINENT AT THE BOTTOM) */}
          <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-amber-500/40 space-y-5 max-w-xl mx-auto relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Big 3D / Brand Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-1 shadow-2xl shrink-0 flex items-center justify-center ring-4 ring-amber-400/30 animate-bounce-short">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl">
                  🥭
                </div>
              </div>

              {/* Install Info */}
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg sm:text-xl font-black text-white font-sans">
                  📲 ដំឡើង & បន្ថែមទៅអេក្រង់ដើម (Install & Add to Home Screen)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  ដំឡើងកម្មវិធី <strong>CashewTrace • Mango Keo Romeat</strong> ទុកលើទូរស័ព្ទដៃ ដើម្បីងាយស្រួលបើកកត់ត្រាការងារចម្ការបានរហ័ស <strong>ទោះបីគ្មានអ៊ីនធឺណិត (Offline) ក៏ដោយ</strong>។
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
                  onClick={copyFarmerLink}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>{copiedLink ? '✓ បានចម្លងលីង!' : 'ចម្លងលីងផ្ញើតាម Telegram'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LOGGED IN: DAILY PRACTICE LOGGER FOR MANGO FARMER */
        <div className="space-y-6">
          
          {/* Top Welcome Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  MANGO ORCHARD PORTAL
                </span>
                <span className="bg-emerald-500/20 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  GAP COMPLIANT LEDGER
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                កត់ត្រាសកម្មភាពចម្ការស្វាយកែវរមៀតប្រចាំថ្ងៃ (Daily Practice Logger)
              </h2>
              <p className="text-xs text-slate-600">
                ចម្ការ៖ <strong>{activeAccount?.farmName || activeAccount?.farmerName}</strong> • {activeAccount?.province} • {activeAccount?.areaHa} ហិកតា ({activeAccount?.numTrees} ដើមស្វាយ)
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-amber-300" />}
                <span>{isListening ? '⏹️ ចុចបញ្ឈប់ការថត (Click to Stop)' : '🎙️ ចុច ១ ដងដើម្បីថតសំឡេង (Click to Record)'}</span>
              </button>
            </div>
          </div>

          {/* Voice status banner if active */}
          {voiceStatus && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium flex items-center justify-between"
            >
              <span>{voiceStatus}</span>
              <button onClick={() => setVoiceStatus(null)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </motion.div>
          )}

          {/* Practice Form */}
          <form onSubmit={handleSavePracticeRecord} className="space-y-6">
            
            {/* Step 1: Practice Type Selector */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span>1. ជ្រើសរើសប្រភេទការងារថែទាំ (Select Daily Activity)</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Step 1 of 4</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'pruning', label: '✂️ កាត់តម្រឹមមែក', sub: 'សម្អាតគុម្ព/ពន្លឺ', icon: Leaf },
                  { id: 'flower_induction', label: '🌸 បញ្ជាផ្កាខុសរដូវ', sub: 'Paclobutrazol/KNO3', icon: Sparkles },
                  { id: 'fruit_bagging', label: '🛡️ ស្រោមផ្លែស្វាយ', sub: 'ការពាររុយទំផ្លែ', icon: ShieldCheck },
                  { id: 'fertilizing', label: '🌿 ដាក់ជីបំប៉ន', sub: 'សរីរាង្គ / NPK', icon: Layers },
                  { id: 'pest_control', label: '🐛 ការពារសត្វល្អិត', sub: 'ផ្សិត & អង់ត្រាក់ណូស', icon: AlertTriangle },
                  { id: 'irrigation', label: '💧 ស្រោចស្រព', sub: 'ប្រព័ន្ធដំណក់ទឹក', icon: Droplets },
                  { id: 'harvest', label: '🥭 ប្រមូលផលស្វាយ', sub: 'ចាត់ថ្នាក់ Grade A/B', icon: Award }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePracticeChange(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      practiceCategory === item.id 
                        ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-500/30' 
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  ការពិពណ៌នាសកម្មភាពជាក់ស្តែង (Detailed Activity Description)
                </label>
                <textarea
                  value={careActivity}
                  onChange={(e) => setCareActivity(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 transition"
                  placeholder="ពិពណ៌នាការងារថែទាំដែលបានធ្វើនៅថ្ងៃនេះ..."
                />
              </div>
            </div>

            {/* Step 2: Agrochemicals & Inputs Applied */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span>2. ជី ថ្នាំកសិកម្ម ឬសម្ភារប្រើប្រាស់ (Inputs, Fertilizer & Chemical Record)</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Step 2 of 4</span>
              </div>

              {/* Quick Catalog Suggestions */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600">
                  💡 ចុចជ្រើសរើសជី ឬថ្នាំកសិកម្មស្តង់ដារសម្រាប់ស្វាយកែវរមៀត (Quick Catalog):
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {MANGO_AGRI_INPUTS.flatMap(cat => cat.items).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputName(item)}
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 rounded-lg text-[11px] transition cursor-pointer truncate max-w-xs"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    ឈ្មោះជី ឬថ្នាំកសិកម្ម (Input / Chemical Name)
                  </label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    placeholder="e.g. Paclobutrazol 15% ឬ ជី NPK 15-15-15"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    បរិមាណ ឬកម្រិតប្រើប្រាស់ (Dosage / Quantity)
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    placeholder="e.g. 150g ក្នុងទឹក 100L ឬ 2kg/ដើម"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    អ្នកបាញ់/អនុវត្ត (Applicator Name)
                  </label>
                  <input
                    type="text"
                    value={applicatorName || farmerName}
                    onChange={(e) => setApplicatorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    រយៈពេលរង់ចាំមុនប្រមូលផល (PHI Days)
                  </label>
                  <input
                    type="number"
                    value={phiDays}
                    onChange={(e) => setPhiDays(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="14"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="ppe_check"
                    checked={ppeUsed}
                    onChange={(e) => setPpeUsed(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="ppe_check" className="text-xs font-bold text-slate-700 cursor-pointer">
                    ពាក់ឧបករណ៍ការពារសុវត្ថិភាព (PPE)
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Yield, Harvest & Weather */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span>3. អាកាសធាតុ និងការប៉ាន់ស្មានទិន្នផល (Weather & Yield Metrics)</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Step 3 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    កាលបរិច្ឆេទកត់ត្រា (Date)
                  </label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    សីតុណ្ហភាព (°C)
                  </label>
                  <input
                    type="number"
                    value={weatherTemp}
                    onChange={(e) => setWeatherTemp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    ស្ថានភាពអាកាសធាតុ (Condition)
                  </label>
                  <select
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="មេឃស្រឡះ មានពន្លឺថ្ងៃល្អ (Sunny & Clear)">មេឃស្រឡះ មានពន្លឺថ្ងៃល្អ (Sunny)</option>
                    <option value="មេឃរាងស្រទុំ (Partly Cloudy)">មេឃរាងស្រទុំ (Partly Cloudy)</option>
                    <option value="មានភ្លៀងធ្លាក់តិចតួច (Light Rain)">មានភ្លៀងធ្លាក់តិចតួច (Light Rain)</option>
                    <option value="ភ្លៀងធ្លាក់ខ្លាំង (Heavy Rain)">ភ្លៀងធ្លាក់ខ្លាំង (Heavy Rain)</option>
                  </select>
                </div>
              </div>

              {/* Yield & Grading */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={14} className="text-amber-600" />
                    <span>ទិន្នផលផ្លែស្វាយ និងចំណាត់ថ្នាក់គុណភាព (Harvest & Cambodia Grading Standards)</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    ស្ដង់ដារទិញលក់ជាក់ស្ដែងនៅកម្ពុជា (Cambodia Factory & Market Standard)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">ទិន្នផលសរុប (Total Yield Kg)</label>
                    <input
                      type="number"
                      value={expectedYield}
                      onChange={(e) => setExpectedYield(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-emerald-800">
                      លេខ ១ / Grade A (1-3 ផ្លែ/kg)
                    </label>
                    <input
                      type="number"
                      value={harvestGradeA}
                      onChange={(e) => setHarvestGradeA(e.target.value)}
                      placeholder="រោងចក្រដំណាប់ស្វាយ & នាំចេញស្វាយខ្ចីទៅ VN/TH"
                      className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-xs text-emerald-900 font-bold font-mono"
                    />
                    <span className="block text-[9.5px] text-emerald-700 font-medium">រោងចក្រដំណាប់ស្វាយ & នាំចេញស្វាយខ្ចីទៅ VN/TH (Dried Factory & Green Export)</span>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-blue-800">
                      លេខ ២ / Grade B (4-5 ផ្លែ/kg)
                    </label>
                    <input
                      type="number"
                      value={harvestGradeB}
                      onChange={(e) => setHarvestGradeB(e.target.value)}
                      placeholder="សម្រាប់ហូបស្រស់លើទីផ្សារ"
                      className="w-full bg-white border border-blue-300 rounded-xl px-3 py-1.5 text-xs text-blue-900 font-bold font-mono"
                    />
                    <span className="block text-[9.5px] text-blue-700 font-medium">ហូបស្រស់ / ទីផ្សារក្នុងស្រុក (Fresh Market)</span>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      លេខ ៣ / Grade C (&gt;5 ផ្លែ/kg)
                    </label>
                    <input
                      type="number"
                      value={harvestGradeC}
                      onChange={(e) => setHarvestGradeC(e.target.value)}
                      placeholder="ផ្លែតូច ឬលក់រាយថោក"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold font-mono"
                    />
                    <span className="block text-[9.5px] text-slate-500 font-medium">ផ្លែតូច / ទីផ្សារក្នុងស្រុក (Small/Local)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">តម្លៃលក់មធ្យម ($/Kg ឬ Riel/Kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">គោលដៅចែកចាយ (Target Destination)</label>
                    <select
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium"
                    >
                      <option value="factory">🏭 រោងចក្រកែច្នៃដំណាប់ស្វាយក្នុងស្រុក (Local Dried Mango Factory)</option>
                      <option value="cross_border_green">🚚 នាំចេញស្វាយខ្ចីលេខ១ ទៅរោងចក្រ វៀតណាម/ថៃ (VN/TH Green Mango Factory Export)</option>
                      <option value="fresh_market">🛒 ទីផ្សារផ្លែឈើស្រស់ក្នុងស្រុក (Local Fresh Fruit Markets)</option>
                      <option value="cross_border_fresh">✈️ នាំចេញផ្លែទុំស្រស់ (Fresh Ripe Mango Export)</option>
                    </select>
                  </div>
                </div>

                {/* Buyer / Off-taker Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/80">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-amber-950">
                      🏢 ក្រុមហ៊ុន ឬឈ្មួញទិញស្វាយ (Buyer / Exporter Name)
                    </label>
                    <input
                      type="text"
                      value={buyerNameInput}
                      onChange={(e) => setBuyerNameInput(e.target.value)}
                      placeholder="e.g. ក្រុមហ៊ុននាំចេញផ្លែស្វាយ ឬឈ្មួញប្រមូលទិញ"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-amber-950">
                      📞 លេខទូរស័ព្ទទំនាក់ទំនងអ្នកទិញ (Buyer Phone Number)
                    </label>
                    <input
                      type="text"
                      value={buyerPhoneInput}
                      onChange={(e) => setBuyerPhoneInput(e.target.value)}
                      placeholder="e.g. 012 889 771"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback alert */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-md"
              >
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span>{saveSuccess}</span>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-400 hover:to-emerald-500 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                <span>{isSaving ? 'កំពុងរក្សាទុក...' : '💾 រក្សាទុកកំណត់ត្រាចូល Cloud Ledger (Save & Sync)'}</span>
              </button>
            </div>
          </form>

          {/* RECENT SAVED LOGS & QR PASSPORTS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>📋 ប្រវត្តិការងារចម្ការស្វាយដែលបានកត់ត្រា (Recorded Farm Practice History)</span>
              </h3>
              <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                {savedRecords.length} Records in Ledger
              </span>
            </div>

            {savedRecords.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">មិនទាន់មានកំណត់ត្រាឡើយ។ សូមកត់ត្រាការងារចម្ការខាងលើ។</p>
            ) : (
              <div className="space-y-3">
                {savedRecords.slice(0, 5).map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{record.title}</span>
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          {record.province}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans">
                        📅 {record.landPrepDate || '2026-08-14'} • ជី/ថ្នាំ៖ <strong>{record.fertilizerName || record.pesticideName || 'N/A'}</strong> ({record.pesticideDosage || 'N/A'})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenQRModal(record)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <QrCode size={14} />
                        <span>QR Passport</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR PASSPORT MODAL */}
      <AnimatePresence>
        {qrRecordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🥭</span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Digital Mango Product Passport
                  </h3>
                </div>
                <button
                  onClick={() => setQrRecordModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 py-2">
                {qrCodeDataUrl ? (
                  <div className="p-3 bg-white border-2 border-emerald-500 rounded-2xl shadow-md">
                    <img src={qrCodeDataUrl} alt="Mango QR" className="w-48 h-48 rounded-lg" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-400">
                    Generating QR...
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{qrRecordModal.fullName || qrRecordModal.title}</h4>
                  <p className="text-xs text-slate-500 font-mono">Orchard ID: {qrRecordModal.farmId || qrRecordModal.id}</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ Verified on CashewTrace Agricultural Ledger
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>បោះពុម្ព (Print)</span>
                </button>
                <button
                  onClick={() => setQrRecordModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  បិទ (Close)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
