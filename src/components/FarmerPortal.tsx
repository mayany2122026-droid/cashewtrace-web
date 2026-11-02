import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import { 
  User, MapPin, Calendar, Leaf, Save, CheckCircle2, Phone, 
  Smartphone, Share2, Copy, RefreshCw, Layers, ShieldCheck, 
  Sparkles, AlertCircle, ChevronDown, Trash2, ArrowRight, QrCode, Printer, Download, X, Lock, KeyRound
} from 'lucide-react';
import { MangoPilotRecord } from '../types';
import { CAMBODIA_PROVINCES } from '../data/provinces';
import { saveMangoPilotToFirestore, subscribeToMangoPilots, deleteMangoPilotFromFirestore } from '../lib/firebaseService';
import CashewTraceLogo, { CashewTraceIcon, CashewNutIcon } from './CashewTraceLogo';
import UniversalSectorVideoGuide from './UniversalSectorVideoGuide';
import VisualPictorialGuide from './VisualPictorialGuide';
import AccessibleVoiceAssistant from './AccessibleVoiceAssistant';

// Sample pre-configured Khmer farmer presets for 1-click testing
const KHMER_FARMER_PRESETS = [
  {
    farmerName: 'ចម្ការស្វាយចន្ទីគំរូ (Model Cashew Orchard - 30 Ha)',
    phone: '012 *** ***',
    province: 'កំពង់ធំ (Kampong Thom)',
    cropType: 'Cashew Nut',
    trees: 6000,
    area: 30.0,
    gpsLat: 12.7112,
    gpsLng: 104.8887,
    activity: 'កាត់តម្រឹមមែក ដាក់ជីសរីរាង្គ និង ថែទាំចម្ការស្វាយចន្ទី ៣០ហិកតា (Pre-harvest Pruning & Soil Care)',
    inputName: 'ជីសរីរាង្គ មេលតេត (Meltert Organic 4-3-2.5) + ជី NPK 20-20-15',
    dosage: '៣ គីឡូក្រាម ក្នុង ១ ដើម (3kg per tree)',
    expectedYield: 45000,
    expectedPrice: 1.50,
  },
  {
    farmerName: 'ហេង ពៅ (Heng Pov)',
    phone: '071 977 7799',
    province: 'កំពង់ធំ (Kampong Thom)',
    cropType: 'Cashew Nut',
    trees: 1500,
    area: 10.0,
    gpsLat: 12.7112,
    gpsLng: 104.8887,
    activity: 'សម្អាតគល់ និង បាញ់ថ្នាំការពារសត្វល្អិត (Weeding & Safe Biological Pesticide)',
    inputName: 'ថ្នាំជីវសាស្ត្រ SafeGuard Bio-Pesticide',
    dosage: '២០០ml ក្នុង ទឹក ២០០ លីត្រ',
    expectedYield: 15000,
    expectedPrice: 1.45,
  },
  {
    farmerName: 'សុខា មាន (Sokha Mean)',
    phone: '085 555 124',
    province: 'កំពង់ស្ពឺ (Kampong Speu)',
    cropType: 'Keo Romeat Mango',
    trees: 390,
    area: 4.5,
    gpsLat: 11.4582,
    gpsLng: 104.5201,
    activity: 'កាត់តម្រឹមមែក និង ដាក់ជីធម្មជាតិ (Pruning & Organic Fertilizer)',
    inputName: 'ជីកំប៉ុសលាមកមាន់ និង ជីបំប៉ន NPK 15-15-15',
    dosage: '២ គីឡូក្រាម ក្នុង ១ ដើម',
    expectedYield: 11000,
    expectedPrice: 1.25,
  }
];

// Official agrochemical catalog from Agro Farmacy Co., Ltd handbook for Cashew & Fruit Orchards
const AGRO_CHEMICAL_CATALOG = [
  {
    category: '🌿 ជីបំប៉នគល់ និងជីជំនួយដី (Root & Soil Fertilizers)',
    items: [
      'ជីសរីរាង្គ មេលតេត (Meltert Organic 4-3-2.5+1MgO)',
      'ជី NPK 20-15-7+TE (ពង្រីកការលូតលាស់ ឫស/ដើម/ត្រួយ)',
      'ជី NPK 20-20-15 (ជីគល់ពង្រីកដើម និងឫស)',
      'ជី NPK 15-15-15+TE (ជីគល់បំប៉ន)',
      'ជី NPK 16-16-13S (ជីគល់បំប៉ន)',
      'ជីកំប៉ុសធម្មជាតិ / លាមកសត្វ (Organic Compost)',
    ]
  },
  {
    category: '🌱 ជីបំប៉នស្លឹក ផ្កា ក្តឹប និង Biostimulants',
    items: [
      'អាមីណូ ហ្គោល (Amino Gold - Amino Acids 20.3%)',
      'ស៊ី-វីដ អ៊ែម (Seaweed M Extract 63.82%)',
      'ប្រូអ៊ិច (Pro-X - NPK 3.38-0.08-1.07)',
      'ស៊ីវីដ ហ្វឺន (Seaweed Fern Red Seaweed)',
      'លីងកូខាប Plus (CaO 15% + Amino)',
      'ស៊ីវីដផ្លាស់ (Seaweed Plus)',
      'លីកអាតូនីក (Atonik Formula Biostimulant)',
      'លីកាតូឡា (NPK 6-32-35+TE ជំរុញចេញផ្កា)',
      'អាមិច លឿង (NPK Trace Elements)',
      'ជីស្លឹក ១៦៨ (NPK 33-11-11+TE)',
      'ជីផ្កា ១៦៨ (NPK 10-60-10+TE)',
      'ជីផ្លែ ១៦៨ (NPK 7-5-44+TE)',
      'តេយ្យោអ៊ូ (Thiourea 96% - ជម្រុះស្លឹក បំបែកភ្នែកផ្កា)',
      'ខេឌីប្រាត (NPK 13-0-36 - បញ្ចេញក្តឹប)',
      'MKP 0-52-34 (ជម្រុះស្លឹក បញ្ចេញផ្កា)',
      'ខីឡូត (Non-ionic Fatty Acid Ethoxylates)',
      'អឹមស៊ុលហ្វាត (Mg 16%, S 32.5% - ជំរុញចេញផ្កា)',
      'ស៊ីង-ស៊ុលហ្វាត (Zinc 15%, Sulfur 7% - ជំរុញក្លរ៉ូហ្វីល)',
    ]
  },
  {
    category: '🐜 ថ្នាំកម្ចាត់សត្វល្អិត (Pesticides / Insecticides)',
    items: [
      'អាទីលី / Artillery (Emamectin Benzoate 70g/kg - កម្ចាត់មូសផ្លែ/ដង្កូវ)',
      'អាសេផាត 97 SG (Acephate 97 - កម្ចាត់មូសផ្លែ/ត្រីប/ចៃស)',
      'មូសស្វែរទោស / Imidacloprid 15% WP (កម្ចាត់ចៃស/ត្រីប)',
      'តេណូស៊ីដ (Cypermethrin + Imidacloprid - កម្ចាត់មូសផ្លែ/ត្រីប)',
      'អឹម59 / Abamectin 3.6% (កម្ចាត់ដង្កូវ/ត្រីប/ចៃស)',
      'ខេ ៤៧ (Thiamethoxam + Lambda - កម្ចាត់មូសផ្លែ/ត្រីប)',
      'តារ៉ាឈុត / Chlorpyrifos 48% EC (កម្ចាត់មូសផ្លែ/ដង្កូវ)',
      'តារ៉ានីល / Pymetrozine + Nitenpyram (កម្ចាត់មូសផ្លែ/ត្រីប)',
      'តារ៉ាម 95SP / Cartap Hydrochloride (កម្ចាត់ដង្កូវរូងដើម/មូរស្លឹក)',
      'អាទីលី + អឹម59 (រូបមន្តកម្ចាត់មូសផ្លែ Tea Mosquito Bug)',
    ]
  },
  {
    category: '🛡️ ថ្នាំការពារ និងព្យាបាលជំងឺ (Fungicides)',
    items: [
      'ហិចស្តារ / Hexaconazole 100g/L (ជំងឺរលួយផ្កា/អង់ត្រាក់ណូស/ទឹកភ្លៀង)',
      'កាបេន / Carbendazim 500g/L SC (ជំងឺអង់ត្រាក់ណូស/រលួយក្តឹប)',
      'ភីលឡា / Cyazofamid + Cymoxanil (ជំងឺរលួយដើម/រលួយផ្លែ/ជ័រហូរ)',
      'Azoxystrobin (ថ្នាំផ្សិតការពាររលួយ)',
      'Pyraclostrobin + Metiram (ថ្នាំផ្សិតការពារទឹកភ្លៀង)',
    ]
  }
];

// Official training catalog for CAC (Cashew nut Association of Cambodia) pre & post-harvest workshops
const CAC_TRAINING_CATALOG = [
  '🎓 វគ្គបណ្តុះបណ្តាលបច្ចេកទេស៖ "ការកែច្នៃស្វាយចន្ទី" (Cashew Nut Processing Technical Training - 3 Days, CAC HQ)',
  '🎓 វគ្គបណ្តុះបណ្តាល៖ "បច្ចេកទេសបង្កើនទិន្នផលចន្ទី សម្រាប់ រដូវដាំដុះថ្មី" (Cashew Yield Increase Techniques for New Season - Kratie University)',
  '🎓 សិក្ខាសាលា៖ "ឥទ្ធិពលនៃការបង្កើនទិន្នផលទៅលើប្រាក់ចំណេញក្នុងផលិតកម្មកសិកម្ម" (Yield Increase Impact on Profits Workshop - Kampong Thom Polytechnic)',
  '🎓 វគ្គបណ្តុះបណ្តាលបច្ចេកទេស៖ "ការថែទាំត្រៀមរដូវកាលថ្មី ផលិតផ្កាផ្លែ និងបន្ធូឥទ្ធិពល El Niño & ការកាត់តម្រឹមមែក"',
  '🎓 វគ្គបណ្តុះបណ្តាល៖ "ការអនុវត្តកសិកម្មល្អ (GAP) & អនាម័យដំណាំ" (Good Agricultural Practices - GAP Training)',
  '🎓 វគ្គបណ្តុះបណ្តាល៖ "ការប្រើប្រាស់ជី និងថ្នាំកសិកម្មឱ្យមានប្រសិទ្ធភាព និងសុវត្ថិភាព" (Safe Agrochemical & Fertilizer Application)',
  '🎓 វគ្គបណ្តុះបណ្តាល៖ "ការប្រមូលផល និងការរក្សាទុកគ្រាប់ស្វាយចន្ទីស្ងួត" (Cashew Post-Harvest Handling & Storage Training)',
];

export default function FarmerPortal() {
  const [cropType, setCropType] = useState<'Cashew Nut' | 'Keo Romeat Mango'>('Cashew Nut');
  const [farmerName, setFarmerName] = useState('');
  const [farmerRegId, setFarmerRegId] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('កំពង់ធំ (Kampong Thom)');
  const [numTrees, setNumTrees] = useState<number | ''>(6000);
  const [farmArea, setFarmArea] = useState<number | ''>(30.0);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number }>({ lat: 12.7112, lng: 104.8887 });
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [trainingReceived, setTrainingReceived] = useState<string>('🎓 វគ្គបណ្តុះបណ្តាលបច្ចេកទេស៖ "ការកែច្នៃស្វាយចន្ទី" (Cashew Nut Processing Technical Training - 3 Days, CAC HQ)');
  
  // Off-season activity inputs
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [careActivity, setCareActivity] = useState<string>('កាត់តម្រឹមមែក និង សម្អាតចម្ការ ៣០ ហិកតា (30 Ha Pre-harvest Canopy Pruning & Orchard Cleaning)');
  const [inputName, setInputName] = useState<string>('ជីសរីរាង្គ មេលតេត (Meltert Organic 4-3-2.5) + ជីបំប៉ន NPK 20-20-15');
  const [dosage, setDosage] = useState<string>('៣ គីឡូក្រាម ក្នុង ១ ដើម (3kg per tree)');
  const [expectedYield, setExpectedYield] = useState<number | ''>(45000);
  const [expectedPrice, setExpectedPrice] = useState<number | ''>(1.50);
  const [customNotes, setCustomNotes] = useState<string>('ចម្ការស្វាយចន្ទី ៣០ ហិកតា នៅកំពង់ធំ។ ការថែទាំដី និងការកាត់តម្រឹមមែកកំពុងដំណើរការជាធម្មតាក្នុងរដូវទំនេរ។ (30 Ha Cashew Orchard in Kampong Thom. Off-season soil care & canopy pruning underway).');
  
  // VIP & Registered Farmer Login States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'demo'>('register');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isFarmerLoggedIn, setIsFarmerLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cashew_farmer_unlocked') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [loggedInFarmerInfo, setLoggedInFarmerInfo] = useState<any>(null);
  const [loginError, setLoginError] = useState('');

  // Farmer Self-Registration Form States
  const [regName, setRegName] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regProvince, setRegProvince] = useState('កំពង់ធំ (Kampong Thom)');
  const [regFarmArea, setRegFarmArea] = useState<number | ''>(5.0);
  const [regTrees, setRegTrees] = useState<number | ''>(1000);
  const [generatedCreds, setGeneratedCreds] = useState<{ username: string; pass: string } | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Khmer Voice AI Assistant State
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const speechRecognitionRef = useRef<any>(null);
  const isManuallyLoggingVoiceRef = useRef(false);
  const voiceAccumulatedRef = useRef('');

  const handleStartVoiceLogging = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('⚠️ ឧបករណ៍របស់អ្នកមិនគាំទ្រការថតសំឡេងដោយផ្ទាល់ទេ។ សូមប្រើប្រាស់ Google Chrome ឬ Safari។');
      return;
    }

    // Toggle stop if already recording
    if (isListening) {
      isManuallyLoggingVoiceRef.current = false;
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {
          console.warn('Error stopping recognition:', e);
        }
      }
      setIsListening(false);
      setVoiceStatus('⏹️ បានបញ្ឈប់ការថតសំឡេងដោយជោគជ័យ (Voice Recording Completed)');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'km-KH';
      recognition.continuous = true;
      recognition.interimResults = true;
      speechRecognitionRef.current = recognition;
      isManuallyLoggingVoiceRef.current = true;
      voiceAccumulatedRef.current = '';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('🎙️ កំពុងស្តាប់សំឡេងដោយគ្មានកំណត់ពេល (ចុចម្តងទៀតដើម្បីបញ្ចប់)៖ "ថ្ងៃនេះកាត់មែក ដាក់ជី ២ គីឡូ..."');
      };

      recognition.onresult = (event: any) => {
        let final = voiceAccumulatedRef.current;
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const part = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += (final ? ' ' : '') + part;
          } else {
            interim += part;
          }
        }
        voiceAccumulatedRef.current = final;
        const currentSpoken = (final + ' ' + interim).trim();

        // Auto-fill form fields intelligently based on spoken Khmer keywords
        if (currentSpoken.includes('ជី') || currentSpoken.includes('ថ្នាំ') || currentSpoken.includes('អិនភីខេ') || currentSpoken.includes('សរីរាង្គ')) {
          setInputName(`[សំឡេង]: ${currentSpoken}`);
        }
        if (currentSpoken.includes('កាត់') || currentSpoken.includes('តម្រឹម') || currentSpoken.includes('សម្អាត') || currentSpoken.includes('បាញ់')) {
          setCareActivity(`[សំឡេង]: ${currentSpoken}`);
        }
        setVoiceStatus(`✅ កំពុងចាប់សំឡេង៖ "${currentSpoken}"`);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        if (event.error === 'no-speech') return;
      };

      recognition.onend = () => {
        // Continuous listening: if user hasn't toggled stop, auto-restart so it never cuts off
        if (isManuallyLoggingVoiceRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        } else {
          setIsListening(false);
          if (voiceAccumulatedRef.current) {
            const finalNote = voiceAccumulatedRef.current.trim();
            setCustomNotes((prev) => prev ? `${prev}\n[កំណត់ត្រាសំឡេង - ${new Date().toLocaleTimeString()}]: ${finalNote}` : `[កំណត់ត្រាសំឡេង - ${new Date().toLocaleTimeString()}]: ${finalNote}`);
          }
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      isManuallyLoggingVoiceRef.current = false;
    }
  };

  const handleApplyVoicePreset = (sampleText: string) => {
    if (sampleText.includes('ជី') || sampleText.includes('ថ្នាំ')) {
      setInputName(`[សំឡេង AI]: ${sampleText}`);
    }
    if (sampleText.includes('កាត់') || sampleText.includes('តម្រឹម') || sampleText.includes('សម្អាត')) {
      setCareActivity(`[សំឡេង AI]: ${sampleText}`);
    }
    setCustomNotes((prev) => prev ? `${prev}\n[កំណត់ត្រាសំឡេង AI Voice Log]: ${sampleText}` : `[កំណត់ត្រាសំឡេង AI Voice Log]: ${sampleText}`);
    setVoiceStatus(`✅ បានបំពេញទិន្នន័យពីសំឡេងគំរូ៖ "${sampleText}"`);
  };

  // Helper to load registered farmers
  const getRegisteredFarmers = (): any[] => {
    try {
      const data = localStorage.getItem('cashew_custom_farmers');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  // Check stored login or URL parameters
  useEffect(() => {
    try {
      const isUnlocked = sessionStorage.getItem('cashew_farmer_unlocked') === 'true';
      if (!isUnlocked) {
        setIsFarmerLoggedIn(false);
        setFarmerName('');
        setFarmerRegId('');
        setPhone('');
        return;
      }

      const stored = localStorage.getItem('cashew_farmer_login');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setIsFarmerLoggedIn(true);
          setLoggedInFarmerInfo(parsed);
          setCropType('Cashew Nut');
          setFarmerName(parsed.fullName || parsed.farmerName || '');
          setFarmerRegId(parsed.farmerId || parsed.farmerRegId || '');
          setPhone(parsed.phone || '');
          setProvince(parsed.province || 'កំពង់ធំ (Kampong Thom)');
          setNumTrees(parsed.trees || 1000);
          setFarmArea(parsed.area || 5.0);
          return;
        } catch (e) {
          if (stored === 'silot_authenticated') {
            setIsFarmerLoggedIn(true);
            const silot = {
              fullName: 'លោក អ៊ុន ស៊ីឡុត (Uon Silot)',
              farmerId: 'CCA-PRESIDENT-30HA',
              phone: '012 888 999',
              province: 'កំពង់ធំ (Kampong Thom)',
              trees: 6000,
              area: 30.0
            };
            setLoggedInFarmerInfo(silot);
            setCropType('Cashew Nut');
            setFarmerName(silot.fullName);
            setFarmerRegId(silot.farmerId);
            setPhone(silot.phone);
            setProvince(silot.province);
            setNumTrees(silot.trees);
            setFarmArea(silot.area);
            return;
          }
        }
      }
    } catch (e) {
      // ignore
    }
    
    setIsFarmerLoggedIn(false);
    setFarmerName('');
    setFarmerRegId('');
    setPhone('');
  }, []);

  // Handle New Farmer Self-Registration (Auto-generates ID & Password)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert('សូមបញ្ចូលឈ្មោះកសិករ និងលេខទូរស័ព្ទ (Please enter Farmer Name and Phone Number)');
      return;
    }

    // Auto-generate clean, memorable Login ID and Password
    const cleanDigits = regPhone.replace(/\D/g, '').slice(-6) || Math.floor(100000 + Math.random() * 900000).toString();
    const autoUsername = `farmer_${cleanDigits}`;
    const autoPassword = `cashew${cleanDigits.slice(-4) || '2026'}`;
    const autoFarmerId = regNationalId.trim() || `KH-CASHEW-${cleanDigits}`;

    const newFarmer = {
      id: `reg_${Date.now()}`,
      username: autoUsername,
      password: autoPassword,
      fullName: regName.trim(),
      nationalId: regNationalId.trim(),
      farmerId: autoFarmerId,
      phone: regPhone.trim(),
      province: regProvince,
      area: Number(regFarmArea) || 5.0,
      trees: Number(regTrees) || 1000,
      registeredAt: new Date().toISOString()
    };

    // Save to local list of custom farmers
    const existingList = getRegisteredFarmers();
    const updatedList = [newFarmer, ...existingList.filter((f) => f.username !== autoUsername)];
    localStorage.setItem('cashew_custom_farmers', JSON.stringify(updatedList));

    // Save current session & login
    try {
      sessionStorage.setItem('cashew_farmer_unlocked', 'true');
    } catch (e) {}
    localStorage.setItem('cashew_farmer_login', JSON.stringify(newFarmer));
    setGeneratedCreds({ username: autoUsername, pass: autoPassword });
    setLoggedInFarmerInfo(newFarmer);
    setIsFarmerLoggedIn(true);

    // Populate active entry form
    setCropType('Cashew Nut');
    setFarmerName(newFarmer.fullName);
    setFarmerRegId(newFarmer.farmerId);
    setPhone(newFarmer.phone);
    setProvince(newFarmer.province);
    setNumTrees(newFarmer.trees);
    setFarmArea(newFarmer.area);
    setCareActivity(`ការងារថែទាំចម្ការស្វាយចន្ទី ${newFarmer.area} ហិកតា (Orchard Care ${newFarmer.area} Ha)`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = loginUsername.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // Check Uon Silot preset
    if ((cleanUser === 'silot_cca' || cleanUser.includes('silot') || cleanUser.includes('ស៊ីឡុត')) && cleanPass === 'cashew30ha') {
      const silotInfo = {
        fullName: 'លោក អ៊ុន ស៊ីឡុត (Uon Silot - CCA President)',
        farmerId: 'CCA-PRESIDENT-30HA',
        phone: '012 888 999',
        province: 'កំពង់ធំ (Kampong Thom)',
        trees: 6000,
        area: 30.0
      };
      try {
        sessionStorage.setItem('cashew_farmer_unlocked', 'true');
      } catch (e) {}
      setIsFarmerLoggedIn(true);
      setLoggedInFarmerInfo(silotInfo);
      setShowLoginModal(false);
      setLoginError('');
      localStorage.setItem('cashew_farmer_login', JSON.stringify(silotInfo));
      setCropType('Cashew Nut');
      setFarmerName(silotInfo.fullName);
      setFarmerRegId(silotInfo.farmerId);
      setPhone(silotInfo.phone);
      setProvince(silotInfo.province);
      setNumTrees(silotInfo.trees);
      setFarmArea(silotInfo.area);
      return;
    }

    // Check custom registered farmers
    const registered = getRegisteredFarmers();
    const matched = registered.find(
      (f) => (f.username?.toLowerCase() === cleanUser || f.phone === cleanUser || f.nationalId === cleanUser) && f.password === cleanPass
    );

    if (matched) {
      try {
        sessionStorage.setItem('cashew_farmer_unlocked', 'true');
      } catch (e) {}
      setIsFarmerLoggedIn(true);
      setLoggedInFarmerInfo(matched);
      setShowLoginModal(false);
      setLoginError('');
      localStorage.setItem('cashew_farmer_login', JSON.stringify(matched));
      setCropType('Cashew Nut');
      setFarmerName(matched.fullName);
      setFarmerRegId(matched.farmerId);
      setPhone(matched.phone);
      setProvince(matched.province);
      setNumTrees(matched.trees);
      setFarmArea(matched.area);
    } else {
      setLoginError('ឈ្មោះគណនី ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ (Incorrect Username or Password)');
    }
  };

  const handleApplyDemoAccount = (preset: typeof KHMER_FARMER_PRESETS[0]) => {
    const demoInfo = {
      fullName: preset.farmerName,
      farmerId: `DEMO-${preset.farmerName.slice(0, 4)}`,
      phone: preset.phone,
      province: preset.province,
      trees: preset.trees,
      area: preset.area
    };
    try {
      sessionStorage.setItem('cashew_farmer_unlocked', 'true');
    } catch (e) {}
    setIsFarmerLoggedIn(true);
    setLoggedInFarmerInfo(demoInfo);
    localStorage.setItem('cashew_farmer_login', JSON.stringify(demoInfo));
    setCropType(preset.cropType as any);
    setFarmerName(preset.farmerName);
    setFarmerRegId(demoInfo.farmerId);
    setPhone(preset.phone);
    setProvince(preset.province);
    setNumTrees(preset.trees);
    setFarmArea(preset.area);
    setGpsCoords({ lat: preset.gpsLat, lng: preset.gpsLng });
    setCareActivity(preset.activity);
    setInputName(preset.inputName);
    setDosage(preset.dosage);
    setExpectedYield(preset.expectedYield);
    setExpectedPrice(preset.expectedPrice);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('cashew_farmer_unlocked');
    } catch (e) {}
    setIsFarmerLoggedIn(false);
    setLoggedInFarmerInfo(null);
    localStorage.removeItem('cashew_farmer_login');
    setFarmerName('');
    setFarmerRegId('');
    setPhone('');
  };
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [savedRecords, setSavedRecords] = useState<MangoPilotRecord[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVisualGuide, setShowVisualGuide] = useState(false);

  // QR Modal states
  const [qrRecordModal, setQrRecordModal] = useState<MangoPilotRecord | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate QR Code data URL when a record is selected
  useEffect(() => {
    if (qrRecordModal) {
      const rawOrigin = window.location.origin.replace('ais-dev-', 'ais-pre-');
      const targetUrl = `${rawOrigin}?mode=farmer&recordId=${qrRecordModal.id || 'cca-silot-30ha'}#farmer`;
      QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: { dark: '#064e3b', light: '#ffffff' }
      })
        .then(url => setQrCodeDataUrl(url))
        .catch(console.error);
    } else {
      setQrCodeDataUrl('');
    }
  }, [qrRecordModal]);

  // Offline queue and network resilience state - 100% automated background sync
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const isSyncingRef = useRef(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('cashew_offline_queue');
      return raw ? JSON.parse(raw).length : 0;
    } catch (e) {
      return 0;
    }
  });

  // 100% Autonomous background sync function: uploads locally queued records to Firestore seamlessly
  const syncOfflineQueue = async () => {
    if (isSyncingRef.current) return;
    try {
      const raw = localStorage.getItem('cashew_offline_queue');
      if (!raw) return;
      const queue: MangoPilotRecord[] = JSON.parse(raw);
      if (!queue.length) return;

      isSyncingRef.current = true;
      setIsAutoSyncing(true);
      console.log(`[Auto-Sync] Automatically syncing ${queue.length} offline cashew records to Firestore...`);
      
      const remaining: MangoPilotRecord[] = [];
      let syncedCount = 0;
      for (const item of queue) {
        try {
          await saveMangoPilotToFirestore(item);
          syncedCount++;
        } catch (err) {
          console.warn('[Auto-Sync] Retry pending for record:', item.id, err);
          remaining.push(item);
        }
      }
      localStorage.setItem('cashew_offline_queue', JSON.stringify(remaining));
      setOfflineQueueCount(remaining.length);
      if (syncedCount > 0) {
        setSaveSuccess(`✓ ប្រព័ន្ធបានធ្វើសមកាលកម្ម ${syncedCount} កំណត់ត្រាទៅ Cloud ដោយស្វ័យប្រវត្តិ ១០០% ជោគជ័យ!`);
        setTimeout(() => setSaveSuccess(null), 6000);
      }
    } catch (e) {
      console.warn('[Auto-Sync] Notice:', e);
    } finally {
      isSyncingRef.current = false;
      setIsAutoSyncing(false);
    }
  };

  // Continuous background monitor: Auto-sync on network reconnect, visibility wake-up, or 6s heartbeat interval
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        syncOfflineQueue();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial check on page load
    if (navigator.onLine) {
      syncOfflineQueue();
    }

    // Automated periodic background sync polling every 6 seconds
    const interval = setInterval(() => {
      if (navigator.onLine && !isSyncingRef.current) {
        try {
          const raw = localStorage.getItem('cashew_offline_queue');
          if (raw && JSON.parse(raw).length > 0) {
            syncOfflineQueue();
          }
        } catch (e) {}
      }
    }, 6000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  // Subscribe to real-time records and merge offline queued records
  useEffect(() => {
    const unsubscribe = subscribeToMangoPilots((records) => {
      try {
        const raw = localStorage.getItem('cashew_offline_queue');
        const queue: MangoPilotRecord[] = raw ? JSON.parse(raw) : [];
        if (queue.length > 0) {
          // Merge offline records at the top if not already present
          const recordIds = new Set(records.map(r => r.id));
          const unsynced = queue.filter(q => !recordIds.has(q.id));
          setSavedRecords([...unsynced, ...records]);
        } else {
          setSavedRecords(records);
        }
      } catch (e) {
        setSavedRecords(records);
      }
    });
    return () => unsubscribe();
  }, []);

  // GPS Location Capture
  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            lat: Number(position.coords.latitude.toFixed(4)),
            lng: Number(position.coords.longitude.toFixed(4))
          });
          setIsCapturingGps(false);
        },
        (error) => {
          console.warn('GPS capture fallback to province defaults:', error);
          // Set default based on province
          if (province.includes('កំពង់ធំ')) {
            setGpsCoords({ lat: 12.7112, lng: 104.8887 });
          } else if (province.includes('ព្រះវិហារ')) {
            setGpsCoords({ lat: 14.2381, lng: 104.1450 });
          } else {
            setGpsCoords({ lat: 11.4582, lng: 104.5201 });
          }
          setIsCapturingGps(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsCapturingGps(false);
    }
  };

  // Preset Load
  const applyPreset = (preset: typeof KHMER_FARMER_PRESETS[0]) => {
    setFarmerName(preset.farmerName);
    setPhone(preset.phone);
    setProvince(preset.province);
    setCropType(preset.cropType as any);
    setNumTrees(preset.trees);
    setFarmArea(preset.area);
    setGpsCoords({ lat: preset.gpsLat, lng: preset.gpsLng });
    setCareActivity(preset.activity);
    setInputName(preset.inputName);
    setDosage(preset.dosage);
    setExpectedYield(preset.expectedYield);
    setExpectedPrice(preset.expectedPrice);
  };

  // Save Record
  const handleSaveFarmRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) {
      alert('សូមបញ្ចូលឈ្មោះកសិករ (Please enter farmer name)');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(null);

    const newRecord: MangoPilotRecord = {
      title: `កត់ត្រាចម្ការ: ${farmerName} (${cropType === 'Cashew Nut' ? 'ស្វាយចន្ទី' : 'ស្វាយកែវរមៀត'})`,
      timestamp: Date.now(),
      farmerId: farmerRegId.trim() || `KM-FARMER-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: farmerName,
      gender: 'Male',
      dob: '1985-05-10',
      phone: phone || '085-000-000',
      address: `${province}, កម្ពុជា (Cambodia)`,
      cooperative: 'កសិករឯករាជ្យ (Independent Farmer)',
      trainingReceived: trainingReceived.trim() || 'ការថែទាំចម្ការ GAP & អនាម័យដំណាំ',
      gapStatus: 'In Progress',
      organicStatus: 'Not Certified',
      familyMembers: 4,
      laborAvailable: 2,
      mainIncome: cropType === 'Cashew Nut' ? 'ចម្ការស្វាយចន្ទី' : 'ចម្ការស្វាយកែវរមៀត',

      farmId: `FARM-KM-${Math.floor(100 + Math.random() * 900)}`,
      gpsLatitude: gpsCoords.lat,
      gpsLongitude: gpsCoords.lng,
      province: province,
      district: 'ស្រុក/ខណ្ឌ',
      commune: 'ឃុំ/សង្កាត់',
      village: 'ភូមិ',
      farmArea: Number(farmArea) || 1.0,

      plotId: 'PLOT-01',
      plotSize: Number(farmArea) || 1.0,
      slope: 'Flat',
      elevation: 45,
      soilType: 'ដីល្បាប់មានជីជាតិខ្ពស់',
      irrigationSource: 'អណ្ដូង ឬ ទឹកស្ទឹង',
      waterAvailability: 'Year-round',

      variety: cropType === 'Cashew Nut' ? 'Other' : 'Keo Romeat',
      treeGroupId: 'TG-01',
      plantingDate: '2018-05-15',
      treeAge: 8,
      rootstock: 'ពូជស្រុក',
      spacing: '8m x 8m',
      numTrees: Number(numTrees) || 100,
      treeHealth: 'Good',
      previousYield: Number(expectedYield) ? Number(expectedYield) * 0.9 : 5000,
      currentYieldEstimate: Number(expectedYield) || 8000,
      yieldHistory: '២០២៥: ៨ តោន, ២០២៦: ១០ តោន',

      landPrepDate: logDate,
      landPrepActivity: careActivity,
      landPrepLabor: 2,
      plantingDateActual: '2018-05-15',
      seedlingSource: 'ចម្ការផ្ទាល់ខ្លួន',
      plantingQty: Number(numTrees) || 100,
      pruningDate: logDate,
      pruningTrees: Number(numTrees) || 100,
      pruningMethod: careActivity,
      flowerInductionDate: '',
      flowerInductionMethod: '',
      flowerInductionMaterials: '',
      flowerInductionDosage: '',
      irrigationDate: logDate,
      irrigationSourceLog: 'ប្រព័ន្ធស្រោចស្រព',
      irrigationVolume: 50,
      fertilizerDate: logDate,
      fertilizerName: inputName,
      fertilizerNpk: 'ជីជាតិធម្មជាតិ',
      fertilizerBatch: 'F-LOCAL-01',
      fertilizerQty: 100,
      fertilizerCost: 50,
      organicInputsType: inputName,
      organicInputsQty: 100,

      pestObserveDate: '',
      pestIdentified: 'None',
      pestSeverity: 'Low',
      pestAffectedArea: 0,
      diseaseObserveDate: '',
      diseaseIdentified: 'None',
      pesticideName: inputName.includes('ថ្នាំ') ? inputName : 'គ្មាន',
      pesticideActiveIngredient: '',
      pesticideRegNumber: '',
      pesticideSupplier: '',
      pesticideBatch: '',
      pesticideDate: logDate,
      pesticideDosage: dosage,
      pesticideApplicator: farmerName,
      pesticidePpeUsed: 'ស្រោមដៃ និង ម៉ាស',
      pesticidePhiDays: 14,

      weatherRainfall: 120,
      weatherTemp: 32,
      weatherHumidity: 75,
      weatherSeasonalEvents: 'រដូវថែទាំដើម',
      sustainabilityWaterUse: 'ស្រោចស្រពសន្សំសំចៃ',
      sustainabilitySoilConservation: 'រក្សាស្មៅគ្របដី',
      sustainabilityBiodiversity: 'ដាំដើមឈើអមព្រំដី',
      sustainabilityTreesPlanted: 5,

      harvestBatchId: `H-KM-${Math.floor(100 + Math.random() * 900)}`,
      harvestDate: '2026-11-20',
      harvestPlotId: 'PLOT-01',
      harvestVariety: cropType === 'Cashew Nut' ? 'ស្វាយចន្ទី M23' : 'ស្វាយកែវរមៀត',
      harvestQty: Number(expectedYield) || 8000,
      harvestCrates: Math.ceil((Number(expectedYield) || 8000) / 25),
      harvestCrew: farmerName,
      gradeA: Math.floor((Number(expectedYield) || 8000) * 0.7),
      gradeB: Math.floor((Number(expectedYield) || 8000) * 0.2),
      gradeC: Math.floor((Number(expectedYield) || 8000) * 0.1),
      gradeRejected: 0,
      postWashing: true,
      postSorting: true,
      postPacking: true,
      postStorageTemp: 14,
      postStorageHumidity: 80,
      postStorageDuration: 3,

      buyerId: cropType === 'Cashew Nut' ? 'BYR-CHEY-SAMBO' : 'BYR-KIRIROM',
      buyerName: cropType === 'Cashew Nut' ? 'រោងចក្រកែច្នៃ ជ័យ សំបូរ (ខេត្តកំពង់ស្ពឺ)' : 'រោងចក្រគិរីរម្យ (Kirirum Factory) / ក្រុមហ៊ុននាំចេញ',
      buyerType: 'Processor',
      salesDate: '2026-11-25',
      salesBatchId: 'H-KM-01',
      salesQty: Number(expectedYield) || 8000,
      salesPricePerKg: Number(expectedPrice) || 1.20,
      transportVehicle: 'រថយន្តដឹកជញ្ជូន',
      transportDriver: 'អ្នកដឹកជញ្ជូន',
      transportDestination: cropType === 'Cashew Nut' ? 'រោងចក្រកែច្នៃ ជ័យ សំបូរ (កំពង់ស្ពឺ)' : 'រោងចក្រកែច្នៃ',
      transportDeliveryDate: '2026-11-25',

      econInputCost: 150,
      econLaborCost: 100,
      econTransportCost: 50,
      econPackagingCost: 50,
      econRevenue: (Number(expectedYield) || 8000) * (Number(expectedPrice) || 1.20),
      customNotes: customNotes,
    };

    // If device is offline, safely queue locally to localStorage
    if (!navigator.onLine) {
      try {
        const raw = localStorage.getItem('cashew_offline_queue');
        const queue: MangoPilotRecord[] = raw ? JSON.parse(raw) : [];
        queue.unshift(newRecord);
        localStorage.setItem('cashew_offline_queue', JSON.stringify(queue));
        setOfflineQueueCount(queue.length);
        setSavedRecords(prev => [newRecord, ...prev]);
        setIsSaving(false);
        setSaveSuccess(`✓ រក្សាទុកក្នុងទូរស័ព្ទជោគជ័យ (Offline Safe)! ដោយសារគ្មានអ៊ីនធឺណិតនៅចម្ការ ទិន្នន័យត្រូវបានកត់ត្រាទុកក្នុងម៉ាស៊ីន ហើយនឹងធ្វើសមកាលកម្ម (Auto-Sync) ទៅ Cloud ដោយស្វ័យប្រវត្តិពេលមានអ៊ីនធឺណិតឡើងវិញ។`);
        setTimeout(() => setSaveSuccess(null), 8000);
        return;
      } catch (e: any) {
        setIsSaving(false);
        alert(`មានបញ្ហាក្នុងការរក្សាទុកក្នុងទូរស័ព្ទ: ${e.message}`);
        return;
      }
    }

    try {
      const savedId = await saveMangoPilotToFirestore(newRecord);
      setIsSaving(false);
      setSaveSuccess(`✓ រក្សាទុកបានជោគជ័យ! ទិន្នន័យចម្ការរបស់ ${farmerName} ត្រូវ បានចុះក្នុងប្រព័ន្ធ Cloud ប្លុក (លេខសំគាល់: ${savedId})`);
      setTimeout(() => setSaveSuccess(null), 6000);
    } catch (err: any) {
      // Network interruption fallback: safely preserve in offline queue so farmer's data is never lost!
      try {
        const raw = localStorage.getItem('cashew_offline_queue');
        const queue: MangoPilotRecord[] = raw ? JSON.parse(raw) : [];
        queue.unshift(newRecord);
        localStorage.setItem('cashew_offline_queue', JSON.stringify(queue));
        setOfflineQueueCount(queue.length);
        setSavedRecords(prev => [newRecord, ...prev]);
        setIsSaving(false);
        setSaveSuccess(`✓ ដោយសារសេវាអ៊ីនធឺណិតរអាក់រអួល ទិន្នន័យរបស់ ${farmerName} ត្រូវបានរក្សាទុកក្នុងទូរស័ព្ទ (Offline Safe) និងធ្វើសមកាលកម្ម (Sync) ដោយស្វ័យប្រវត្តពេលអ៊ីនធឺណិតមានស្ថិរភាពឡើងវិញ!`);
        setTimeout(() => setSaveSuccess(null), 8000);
      } catch (fallbackErr) {
        setIsSaving(false);
        alert(`មានបញ្ហាក្នុងការរក្សាទុក: ${err.message}`);
      }
    }
  };

  const copyFarmerLink = () => {
    const rawOrigin = window.location.origin;
    // Automatically convert dev preview URL to public shared URL if copying from AI Studio dev environment
    const publicOrigin = rawOrigin.replace('ais-dev-', 'ais-pre-');
    const url = `${publicOrigin}${window.location.pathname}?mode=farmer#farmer`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const triggerMobileInstall = () => {
    window.dispatchEvent(new CustomEvent('open-install-modal'));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?')) {
      await deleteMangoPilotFromFirestore(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* 100% Autonomous Background Sync Indicator (Zero manual button clicks required) */}
      {(offlineQueueCount > 0 || isAutoSyncing) && (
        <div
          className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 text-xs font-bold transition-all shadow-sm ${
            isAutoSyncing
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950'
              : !isOnline
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-950'
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 animate-pulse'
          }`}
        >
          <div className="flex items-center gap-3">
            {isAutoSyncing ? (
              <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
            ) : !isOnline ? (
              <span className="text-xl shrink-0">📦</span>
            ) : (
              <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />
            )}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm">
                  {isAutoSyncing
                    ? `កំពុងធ្វើសមកាលកម្មទិន្នន័យ ${offlineQueueCount} កំណត់ត្រាទៅ Cloud...`
                    : !isOnline
                    ? `រក្សាទុកក្នុងទូរស័ព្ទសុវត្ថិភាព (${offlineQueueCount} កំណត់ត្រា)`
                    : `កំពុងធ្វើសមកាលកម្មស្វ័យប្រវត្តិ...`}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  ស្វ័យប្រវត្តិ ១០០% (Auto-Sync)
                </span>
              </div>
              <p className="text-[11px] opacity-85 font-normal">
                {isAutoSyncing
                  ? 'ទិន្នន័យកំពុងត្រូវបានបញ្ជូនទៅ Cloud ដោយស្វ័យប្រវត្តិ។ កសិករមិនបាច់ចុចអ្វីទាំងអស់។'
                  : !isOnline
                  ? 'គ្មានអ៊ីនធឺណិតនៅចម្ការ — ទិន្នន័យនឹងបញ្ចូលទៅ Cloud ដោយស្វ័យប្រវត្តិ ១០០% ភ្លាមៗពេលមានសេវាវិញ។ មិនបាច់ចុចប៊ូតុងអ្វីឡើយ។'
                  : 'បានរកឃើញសេវាអ៊ីនធឺណិត — ប្រព័ន្ធកំពុងបញ្ចូលទៅ Cloud ដោយស្វ័យប្រវត្តិ។'}
              </p>
            </div>
          </div>
          {isAutoSyncing && (
            <span className="text-[11px] text-emerald-700 font-bold shrink-0 hidden sm:inline">
              កំពុងដំណើរការ...
            </span>
          )}
        </div>
      )}

      {/* Voice-First Accessible AI Assistant for Cashew Farmers */}
      <AccessibleVoiceAssistant
        appContext="farmer"
        appNameKh="ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទី & ជ័យ សំបូរ (កំពង់ស្ពឺ)"
        appNameEn="Cashew Supply Chain & Chey Sambo (Kampong Speu)"
        quickPrompts={[
          {
            icon: '🏭',
            labelKh: 'រោងចក្រ ជ័យ សំបូរ (កំពង់ស្ពឺ)',
            labelEn: 'Chey Sambo processing facility',
            query: 'តើការលក់គ្រាប់ស្វាយចន្ទីទៅរោងចក្រ ជ័យ សំបូរ (ខេត្តកំពង់ស្ពឺ) ទាមទារលក្ខខណ្ឌគុណភាព និងសំណើមអ្វីខ្លះ?',
          },
          {
            icon: '☀️',
            labelKh: 'ហាលស្ងួតសំណើម ៨-១០%',
            labelEn: 'Sun-drying & 8-10% moisture',
            query: 'តើបច្ចេកទេសហាលសម្ងួតគ្រាប់ស្វាយចន្ទីឱ្យបានសំណើម ៨ ទៅ ១០ ភាគរយ ត្រូវធ្វើដូចម្តេច?',
          },
          {
            icon: '🌱',
            labelKh: 'ជីសរីរាង្គ & កាត់មែក',
            labelEn: 'Organic fertilizer & pruning',
            query: 'តើការប្រើប្រាស់ជីសរីរាង្គ និងការកាត់តម្រឹមមែកស្វាយចន្ទី ត្រូវធ្វើនៅពេលណាទើបទទួលបានទិន្នផលខ្ពស់?',
          },
          {
            icon: '🇪🇺',
            labelKh: 'ច្បាប់ EUDR & GPS ៣០ ហិកតា',
            labelEn: 'EUDR deforestation & GPS mapping',
            query: 'តើច្បាប់ EUDR សហភាពអឺរ៉ុប និងការវាស់កូអរដោនេ GPS ៣០ ហិកតា មានអត្ថប្រយោជន៍អ្វីដល់ម្ចាស់ចម្ការ?',
          },
          {
            icon: '🔗',
            labelKh: 'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ទាំង ៥',
            labelEn: '5 Supply Chain Pillars',
            query: 'តើតួនាទីទាំង ៥ ក្នុងខ្សែច្រវ៉ាក់ស្វាយចន្ទី (ម្ចាស់ចម្ការ អ្នកប្រមូលទិញ រោងចក្រ ជ័យ សំបូរ អ្នកនាំចេញ ដឹកជញ្ជូន) ដំណើរការយ៉ាងដូចម្តេច?',
          },
        ]}
      />

      {/* Account Login Status Bar - Only shown when logged in */}
      {isFarmerLoggedIn && loggedInFarmerInfo && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-3 text-emerald-400 font-bold">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <div>
              <div className="text-white text-sm font-bold flex items-center gap-2">
                <span>👤 {loggedInFarmerInfo.fullName || farmerName}</span>
                {loggedInFarmerInfo.farmerId && (
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    ID: {loggedInFarmerInfo.farmerId}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-normal mt-0.5">
                📞 {loggedInFarmerInfo.phone || phone || 'N/A'} • 📍 {loggedInFarmerInfo.province || province} • 🌳 {loggedInFarmerInfo.area || farmArea} ហិកតា ({loggedInFarmerInfo.trees || numTrees} ដើម)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <span>🚪 ចាកចេញ (Logout)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!isFarmerLoggedIn ? (
        <div className="space-y-6">
          {/* Quick Access to Pictorial Guide for Non-literate / Speaking-first Farm Owners */}
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-amber-400/50 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm bg-white">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                📸
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-950 font-sans">
                  មគ្គុទ្ទេសក៍រូបភាព ៥ ជំហានសម្រាប់កសិករ (Visual Photo Guide - ៥ ជំហានងាយៗ)
                </h3>
                <p className="text-xs text-slate-600 font-sans mt-0.5">
                  រូបភាពច្បាស់ៗ អមដោយសំឡេងអានជាភាសាខ្មែរ សម្រាប់ម្ចាស់ចម្ការដែលមិនសូវចេះអក្សរ (Real photos & Khmer voice read-aloud for non-reading farmers)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowVisualGuide(!showVisualGuide)}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shrink-0 shadow-sm flex items-center justify-center gap-2"
            >
              <span>{showVisualGuide ? '✖ បិទមគ្គុទ្ទេសក៍រូបភាព (Close Guide)' : '👁️ បើកមើលមគ្គុទ្ទេសក៍រូបភាព (Open 5-Step Photo Guide)'}</span>
            </button>
          </div>

          {showVisualGuide && (
            <div className="space-y-4">
              <VisualPictorialGuide />
            </div>
          )}

          {/* 0. Top Box: Interactive Video & Instruction Guide for Silot and Farmers */}
          <UniversalSectorVideoGuide 
            sectorKey="cashew"
            onSelectAction={(action) => {
              setAuthMode(action);
              if (action === 'demo') {
                handleApplyDemoAccount(KHMER_FARMER_PRESETS[0]);
              }
            }} 
          />

          {/* 1. Main Farmer Auth Card (Registration + Login + Presets) */}
          <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 max-w-xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-2xl bg-white text-slate-950 flex items-center justify-center shadow-lg border-2 border-amber-400/80">
                <CashewTraceLogo className="h-10 sm:h-12 w-auto" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-400/30">
                  CashewTrace • កម្មវិធីកសិករស្វាយចន្ទី
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
                  ប្រព័ន្ធចុះឈ្មោះ និងកត់ត្រាចម្ការ
                </h2>
                <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                  សូមចុះឈ្មោះ ឬចូលគណនីរបស់អ្នក ដើម្បីចាប់ផ្តើមកត់ត្រាសកម្មភាពថែទាំចម្ការ និងបង្កើតលិខិតឆ្លងដែន EUDR Passport
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
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
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
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
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
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ គណនីគំរូ</span>
              </button>
            </div>

            {/* TAB 1: FARMER REGISTRATION (Auto-generates ID & Password) */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-emerald-400 font-bold text-xs">
                  <span>📝</span>
                  <span>ចុះឈ្មោះកសិករថ្មី (1-Step Quick Registration)</span>
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
                    placeholder="ឧ. ហេង ប៊ុនធឿន (Heng Bunthoeun)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 font-sans transition"
                    required
                  />
                </div>

                {/* 2. National ID / Farmer ID */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 font-sans">
                    2. លេខអត្តសញ្ញាណប័ណ្ណ / លេខកាតសមាជិក (National ID / Member ID) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={regNationalId}
                    onChange={(e) => setRegNationalId(e.target.value)}
                    placeholder="ឧ. 010928374 ឬ CCA-MEMBER-01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono transition"
                    required
                  />
                </div>

                {/* 3. Telephone Number */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 font-sans">
                    3. លេខទូរស័ព្ទ (Telephone Number) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="ឧ. 012 345 678"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono transition"
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-sans transition"
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
                      placeholder="5.0"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono transition"
                    />
                  </div>
                </div>

                {/* Submit and Auto Generate Credentials */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-3.5 rounded-xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
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
                  <span>ចូលប្រើប្រាស់គណនីដែលបានចុះឈ្មោះ (Login with ID & Password)</span>
                </div>

                {loginError && (
                  <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-xl text-xs font-sans flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 font-sans">
                    👤 ឈ្មោះគណនី / លេខទូរស័ព្ទ (Username / Phone / ID)
                  </label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="ឧ. farmer_123456 ឬ silot_cca"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono transition"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-200 font-sans">
                    🔒 ពាក្យសម្ងាត់ (Password)
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
                    className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <KeyRound size={16} />
                    <span>🔑 ចូលប្រើប្រាស់គណនី (Log In)</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: DEMO PRESETS */}
            {authMode === 'demo' && (
              <div className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-300 font-bold text-xs">
                  <span>⚡</span>
                  <span>ជ្រើសរើសគណនីគំរូសាកល្បង (1-Click Demo Profiles)</span>
                </div>

                <div className="space-y-2">
                  {KHMER_FARMER_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyDemoAccount(preset)}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 transition cursor-pointer group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                          {preset.farmerName}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          📍 {preset.province} • {preset.area} Ha • {preset.trees} ដើម
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                        ចូលភ្លាម →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. DEDICATED BIG BOX TO INSTALL THE APP (PROMINENT AT THE BOTTOM) */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-emerald-500/40 space-y-5 max-w-xl mx-auto relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Big 3D / Brand Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1 shadow-2xl shrink-0 flex items-center justify-center ring-4 ring-emerald-400/30 animate-bounce-short">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center p-2">
                  <CashewTraceIcon className="w-14 h-14 sm:w-16 sm:h-16" />
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
                  ដំឡើងកម្មវិធី <strong>CashewTrace</strong> ទុកលើទូរស័ព្ទដៃ ដើម្បីងាយស្រួលបើកកត់ត្រាការងារចម្ការបានរហ័ស <strong>ទោះបីគ្មានអ៊ីនធឺណិត (Offline) ក៏ដោយ</strong>។
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

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-emerald-900/60 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span>📱 <strong>Android / iOS</strong>: ចុច «ដំឡើង & បន្ថែមទៅអេក្រង់ដើម»</span>
                </div>
                <button
                  onClick={copyFarmerLink}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>{copiedLink ? '✓ បានចម្លងលីង!' : 'ចម្លងលីងផ្ញើតាម Telegram'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Logged-in Header with Title & Action Controls */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-amber-950 text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-emerald-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <Smartphone size={24} className="text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      កសិករចូលប្រើប្រាស់ • FARMER PORTAL
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                      OFFLINE-READY
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-white font-sans mt-0.5">
                    ប្រព័ន្ធចុះកត់ត្រាកសិករ កាស្យ៊ូត្រេស (CashewTrace)
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={triggerMobileInstall}
                  className="flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition duration-150 shadow-md cursor-pointer shrink-0"
                >
                  <Smartphone size={15} />
                  <span>📲 ដាក់ App លើទូរស័ព្ទ</span>
                </button>
                <button
                  onClick={copyFarmerLink}
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition duration-150 shadow-md cursor-pointer shrink-0"
                >
                  {copiedLink ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  <span>{copiedLink ? 'បានចម្លងលីង!' : 'ចម្លងលីងសម្រាប់កសិករ'}</span>
                </button>
              </div>
            </div>

            {/* Confirmation Banner for newly generated credentials */}
            {generatedCreds && (
              <div className="bg-emerald-500/20 border border-emerald-400/60 p-4 rounded-xl text-xs text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                    <span>🎉</span>
                    <span>គណនីរបស់អ្នកត្រូវបានបង្កើតជោគជ័យ! (Account Generated)</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`CashewTrace Login\nID: ${generatedCreds.username}\nPassword: ${generatedCreds.pass}`);
                      setCopiedCreds(true);
                      setTimeout(() => setCopiedCreds(false), 3000);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                  >
                    {copiedCreds ? '✓ បានចម្លង!' : '📋 ចម្លងទុក'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg font-mono text-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] block">ឈ្មោះគណនី (ID):</span>
                    <strong className="text-amber-300">{generatedCreds.username}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ពាក្យសម្ងាត់ (Password):</span>
                    <strong className="text-emerald-300">{generatedCreds.pass}</strong>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              សូមប្រើប្រាស់ទម្រង់ខាងក្រោម ឬ <strong>ជំនួយការសំឡេង AI (Khmer Voice AI)</strong> ដើម្បីកត់ត្រាការងារថែទាំចម្ការស្វាយចន្ទី និងបង្កើតកូដ EUDR Passport។
            </p>
          </div>
          {/* Main Khmer Farmer Entry Form */}
          <form onSubmit={handleSaveFarmRecord} className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Crop Selector - Cashew Nut Sector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            ប្រភេទដំណាំ (Crop Type)
          </label>
          <div className="bg-amber-500 text-slate-950 font-bold p-3.5 rounded-xl border border-amber-500 shadow-sm text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CashewNutIcon className="w-5 h-5 shrink-0" />
              <span>ស្វាយចន្ទី (Cashew Nut Sector - 30 Ha Model Orchard)</span>
            </div>
            <span className="bg-slate-950 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">EUDR READY</span>
          </div>
        </div>

        {/* 🎤 Khmer Voice AI Field Assistant */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4.5 rounded-2xl border border-emerald-700 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold">
                🎙️
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>ជំនួយការសំឡេង AI ភាសាខ្មែរ (Khmer Voice AI Field Log)</span>
                  <span className="bg-emerald-400 text-slate-950 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase">1-Tap Voice</span>
                </h3>
                <p className="text-[11px] text-slate-300 font-sans">
                  កសិករអាចនិយាយជាភាសាខ្មែរដើម្បីកត់ត្រាការងារថែទាំចម្ការ ដោយមិនបាច់វាយអក្សរលើទូរស័ព្ទ។
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleStartVoiceLogging}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <span className="text-sm">{isListening ? '⏹️' : '🎤'}</span>
              <span>{isListening ? '⏹️ ចុចបញ្ឈប់ការថត (Click to Stop)' : '🎙️ ចុច ១ ដងដើម្បីថតសំឡេង (Click to Record)'}</span>
            </button>

            <span className="text-[11px] text-slate-400 font-sans">ឬជ្រើសរើសសំឡេងគំរូ៖</span>

            <button
              type="button"
              onClick={() => handleApplyVoicePreset('ថ្ងៃនេះកាត់តម្រឹមមែក និងបាញ់ថ្នាំការពារសត្វល្អិតលើចម្ការ ៣០ ហិកតា')}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer"
            >
              🗣️ "កាត់តម្រឹមមែកចម្ការ"
            </button>

            <button
              type="button"
              onClick={() => handleApplyVoicePreset('ដាក់ជីសរីរាង្គ មេលតេត ៣ គីឡូ ក្នុង ១ ដើម លើចម្ការស្វាយចន្ទី')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer"
            >
              🗣️ "ដាក់ជីសរីរាង្គ ៣ គីឡូ"
            </button>
          </div>

          {voiceStatus && (
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-800/80 text-[11px] text-emerald-300 font-sans">
              {voiceStatus}
            </div>
          )}
        </div>

        {/* Section 1: Farmer & Location */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">1</span>
            <h2 className="text-sm font-bold text-slate-900">
              ព័ត៌មានកសិករ និង ទីតាំងចម្ការ (Farmer Profile & GPS Location)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ឈ្មោះកសិករ (Farmer Full Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ឧទាហរណ៍៖ សុខា មាន"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                លេខអត្តសញ្ញាណកសិករ (Farmer Reg. ID - Optional)
              </label>
              <input
                type="text"
                placeholder="ឧទាហរណ៍៖ KM-FARMER-8821 (ឬ ទុកទំនេរ)"
                value={farmerRegId}
                onChange={(e) => setFarmerRegId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                លេខទូរស័ព្ទទំនាក់ទំនង (Phone Number)
              </label>
              <input
                type="text"
                placeholder="ឧទាហរណ៍៖ 012 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ខេត្ត/ទីតាំងចម្ការ (Province / Region)
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
              >
                {CAMBODIA_PROVINCES.map((p) => (
                  <option key={p.value} value={`${p.kh} (${p.en})`}>
                    ខេត្ត{p.kh} ({p.fullLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block font-medium text-slate-700">
                វគ្គបណ្តុះបណ្តាលដែលបានចូលរួម (Training Workshops Attended)
              </label>
              
              {/* Training Preset Dropdown */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setTrainingReceived(e.target.value);
                  }
                }}
                className="w-full bg-emerald-50/70 border border-emerald-300 text-emerald-950 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
              >
                <option value="">-- ជ្រើសរើសវគ្គបណ្តុះបណ្តាលផ្លូវការរបស់ CAC (Select Official CAC Training) --</option>
                {CAC_TRAINING_CATALOG.map((tr, idx) => (
                  <option key={idx} value={tr}>
                    {tr}
                  </option>
                ))}
              </select>

              {/* Editable Training Text */}
              <input
                type="text"
                placeholder="ឬ បញ្ចូលឈ្មោះវគ្គបណ្តុះបណ្តាលផ្សេងៗ (Or enter custom training title...)"
                value={trainingReceived}
                onChange={(e) => setTrainingReceived(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ផ្ទៃដី (ហិចតា)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={farmArea}
                  onChange={(e) => setFarmArea(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  ចំនួនដើម (Trees)
                </label>
                <input
                  type="number"
                  value={numTrees}
                  onChange={(e) => setNumTrees(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* GPS Capture Button */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="font-bold text-slate-800 block">ទីតាំង GPS ដីចម្ការ (GPS Coordinates)</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {gpsCoords.lat.toFixed(4)}° N, {gpsCoords.lng.toFixed(4)}° E
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCaptureGps}
              disabled={isCapturingGps}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <RefreshCw size={14} className={isCapturingGps ? 'animate-spin' : ''} />
              <span>{isCapturingGps ? 'កំពុងចាប់ទីតាំង...' : 'ចាប់ទីតាំង GPS ឥឡូវ'}</span>
            </button>
          </div>
        </div>

        {/* Section 2: Off-Season Farm Practices */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                ការថែទាំចម្ការក្នុងរដូវទំនេរ (Off-Season Orchard Maintenance)
              </h2>
              <p className="text-[11px] text-slate-500 font-sans">
                កត់ត្រាសកម្មភាពថែទាំដើម, ការប្រើប្រាស់ជី, និង ការបាញ់ថ្នាំការពារ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                កាលបរិច្ឆេទថែទាំ (Date of Care)
              </label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                សកម្មភាពថែទាំ (Activity Practice)
              </label>
              <select
                value={careActivity}
                onChange={(e) => setCareActivity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
              >
                <option value="កាត់តម្រឹមមែក និង សម្អាតចម្ការ (Canopy Pruning & Cleaning)">✂️ កាត់តម្រឹមមែក និង សម្អាតចម្ការ (Pruning)</option>
                <option value="ដាក់ជីធម្មជាតិ ឬ ជីបំប៉ន (Organic/Compound Fertilizer Application)">🌿 ដាក់ជីធម្មជាតិ ឬ ជីបំប៉ន (Fertilizer)</option>
                <option value="បាញ់ថ្នាំការពារសត្វល្អិត និង ជំងឺ (Pesticide/Insecticide Spray)">🛡️ បាញ់ថ្នាំការពារសត្វល្អិត និង ជំងឺ (Pesticide)</option>
                <option value="ស្រោចទឹក និង រៀបចំប្រព័ន្ធស្រោចស្រព (Irrigation & Soil Moisture)">💧 ស្រោចទឹក និង រៀបចំដី (Irrigation)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium text-slate-700">
                ឈ្មោះជី ឬ ថ្នាំប្រើប្រាស់ (Fertilizer / Insecticide Name)
              </label>
              
              {/* Dropdown Quick Selection from Agro Farmacy Catalog */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setInputName(e.target.value);
                  }
                }}
                className="w-full bg-emerald-50/70 border border-emerald-300 text-emerald-950 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
              >
                <option value="">-- ជ្រើសរើសពីបញ្ជីស្តង់ដារ (Select from Standard Catalog) --</option>
                {AGRO_CHEMICAL_CATALOG.map((group, idx) => (
                  <optgroup key={idx} label={group.category}>
                    {group.items.map((item, itemIdx) => (
                      <option key={itemIdx} value={item}>
                        {item}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* Editable Text Field */}
              <input
                type="text"
                placeholder="ឬ បញ្ចូលឈ្មោះជី/ថ្នាំដោយផ្ទាល់ (Or type custom name...)"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                បរិមាណប្រើប្រាស់ (Dosage / Quantity)
              </label>
              <input
                type="text"
                placeholder="ឧទាហរណ៍៖ ២ គីឡូក្រាម/ដើម ឬ ២០០ml/២០០L"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Yield & Price Projection */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                ការប៉ាន់ប្រមាណផល និង តម្លៃលក់ (Harvest Forecast & Yield Projections)
              </h2>
              <p className="text-[11px] text-slate-500 font-sans">
                ទិន្នន័យនេះជួយរោងចក្រកែច្នៃ ជ័យ សំបូរ (ខេត្តកំពង់ស្ពឺ) ទទួលទិញ និងរៀបចំផែនការកែច្នៃគ្រាប់ស្វាយចន្ទីជាមុន
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ទិន្នផលប៉ាន់ប្រមាណសរុប (Expected Yield in Kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={expectedYield}
                  onChange={(e) => setExpectedYield(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-12 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-2.5 text-slate-500 font-bold text-[11px]">Kg</span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                តម្លៃលក់រំពឹងទុក (Expected Sale Price per Kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-12 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-2.5 text-slate-500 font-bold text-[11px]">$/Kg</span>
              </div>
            </div>

            <div className="sm:col-span-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <span className="text-base">🏭</span>
                <span>រោងចក្រដៃគូទទួលទិញ (Target Processor):</span>
                <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black text-[11px]">
                  រោងចក្រកែច្នៃ ជ័យ សំបូរ (ខេត្តកំពង់ស្ពឺ)
                </span>
              </div>
              <span className="text-[10px] text-amber-800 font-medium">
                ភ្ជាប់ដោយស្វ័យប្រវត្តិតាមរយៈលេខឡូតិ៍ & QR Digital Passport
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Custom Farm Notes & Additional Details */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">4</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                កំណត់ចំណាំ និង ព័ត៌មានបន្ថែមផ្សេងៗ (Custom Farm Notes, Observations & EUDR Compliance)
              </h2>
              <p className="text-[11px] text-slate-500 font-sans">
                លោកអ្នកអាចវាយបញ្ចូលព័ត៌មានបន្ថែមដែលមិនមានក្នុងបញ្ជី (កត់ត្រាសភាពដី, ប្រភពទឹក, ការអនុវត្តសរីរាង្គ, ឬ សំណូមពរផ្សេងៗ)
              </p>
            </div>
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="វាយបញ្ចូលកំណត់ចំណាំបន្ថែមពីចម្ការរបស់អ្នកនៅទីនេះ... (Enter any additional details, off-season notes, or special requirements...)"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans leading-relaxed resize-y"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200">
          {saveSuccess && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl font-sans leading-relaxed">
              {saveSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSaving ? 'កំពុងរក្សាទុកក្នុងប្រព័ន្ធ Cloud...' : '💾 រក្សាទុកទិន្នន័យចម្ការ (Save Farm Record)'}</span>
          </button>
        </div>
      </form>

      {/* Saved Records List */}
      {(() => {
        const farmerFilteredRecords = isFarmerLoggedIn && loggedInFarmerInfo
          ? savedRecords.filter(r => 
              r.fullName.toLowerCase().includes(loggedInFarmerInfo.fullName?.toLowerCase() || '') || 
              (loggedInFarmerInfo.farmerId && r.farmerId?.includes(loggedInFarmerInfo.farmerId)) ||
              (loggedInFarmerInfo.phone && r.phone?.includes(loggedInFarmerInfo.phone))
            )
          : savedRecords;

        return (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  {isFarmerLoggedIn && loggedInFarmerInfo
                    ? `ប្រវត្តិកត់ត្រាចម្ការរបស់ ${loggedInFarmerInfo.fullName} (${farmerFilteredRecords.length})`
                    : `បញ្ជីកសិករដែលបានចុះកត់ត្រាក្នុងប្រព័ន្ធ (${savedRecords.length})`
                  }
                </h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                REALTIME FIRESTORE CLOUD
              </span>
            </div>

            {farmerFilteredRecords.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">មិនទាន់មានទិន្នន័យកត់ត្រាឡើយ។ សូមចុច "រក្សាទុកទិន្នន័យចម្ការ" ខាងលើដើម្បីបង្កើតកំណត់ត្រាដំបូង។</p>
            ) : (
              <div className="space-y-3 text-xs">
                {farmerFilteredRecords.slice(0, 15).map((r) => (
                  <div
                    key={r.id}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-emerald-500/40 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{r.fullName}</span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {r.variety === 'Keo Romeat' ? 'ស្វាយកែវរមៀត' : 'ស្វាយចន្ទី (Cashew Nut)'}
                        </span>
                      </div>
                      <button
                        onClick={() => r.id && handleDelete(r.id)}
                        className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 font-sans">
                      <div>
                        <span className="text-slate-400 block text-[10px]">ទីតាំង:</span>
                        <span>{r.province.split(' ')[0]}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">ដើម/ផ្ទៃដី:</span>
                        <span>{r.numTrees} ដើម ({r.farmArea} ហិចតា)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">ទិន្នផលរំពឹងទុក:</span>
                        <span className="font-mono font-bold text-emerald-700">{r.harvestQty.toLocaleString()} Kg</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">ការថែទាំ:</span>
                        <span className="truncate block">{r.fertilizerName || 'កាត់តម្រឹមមែក'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200/70">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-700">🏭 រោងចក្រទទួលទិញ:</span>
                        <span className="text-amber-900 font-semibold">{r.buyerName || 'រោងចក្រកែច្នៃ ជ័យ សំបូរ (ខេត្តកំពង់ស្ពឺ)'}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">
                        {r.salesQty ? `${r.salesQty.toLocaleString()} Kg @ $${r.salesPricePerKg || 1.2}/Kg` : ''}
                      </span>
                    </div>

                    {r.customNotes && (
                      <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 text-[11px] text-emerald-900 font-sans leading-relaxed">
                        <span className="font-bold text-emerald-800 block text-[10px] mb-0.5">📝 កំណត់ចំណាំបន្ថែម (Custom Notes):</span>
                        {r.customNotes}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {r.id ? r.id.substring(0, 10) : 'CLOUD-REC'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQrRecordModal(r)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <QrCode size={13} />
                        <span>មើល QR Passport (View QR Passport)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
        </>
      )}

      {/* QR Code Passport Modal */}
      {qrRecordModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <QrCode size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">កូដ QR ព័ត៌មានចម្ការ (Digital Farm Passport)</h3>
                  <p className="text-[11px] text-slate-500">CashewTrace QR Code & Traceability Verification</p>
                </div>
              </div>
              <button
                onClick={() => setQrRecordModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block shadow-inner">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Farm Passport QR Code" className="w-56 h-56 mx-auto rounded-lg shadow-sm" />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                    <RefreshCw className="animate-spin" size={24} />
                  </div>
                )}
              </div>

              <div className="space-y-1 text-xs font-sans">
                <h4 className="font-bold text-emerald-900 text-sm">{qrRecordModal.fullName}</h4>
                <p className="text-slate-600 text-[11px]">
                  ចម្ការស្វាយចន្ទី {qrRecordModal.farmArea} ហិចតា ({qrRecordModal.numTrees} ដើម) • {qrRecordModal.province}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold mt-1">
                  <ShieldCheck size={12} />
                  <span>EUDR Verified • Geolocation Recorded ({qrRecordModal.gpsLatitude}, {qrRecordModal.gpsLongitude})</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 leading-relaxed font-sans">
              💡 <strong>ការប្រើប្រាស់កូដ QR៖</strong> អ្នកអាចបោះពុម្ព (Print) ឬ រក្សាទុកកូដ QR នេះ ដើម្បីបិតលើបាវស្វាយចន្ទី ឬ ផ្ញើជូនរោងចក្រ/ទិញផល ដើម្បីស្កេនពិនិត្យប្រភពដើម និង ការអនុវត្ត EUDR។
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs"
              >
                <Printer size={14} />
                <span>បោះពុម្ព QR (Print)</span>
              </button>
              <button
                type="button"
                onClick={() => setQrRecordModal(null)}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-xs"
              >
                រួចរាល់ (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
