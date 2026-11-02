import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Home, Layers, Settings, Sun, Sparkles, ShoppingBag, Truck, 
  DollarSign, Calendar, MapPin, CheckCircle2, Leaf, Plus, Save, 
  Trash2, Download, Printer, ArrowRight, ClipboardList, RefreshCw, AlertCircle, Lock, ShieldCheck, Eye, EyeOff
} from 'lucide-react';
import { MangoPilotRecord } from '../types';
import { CAMBODIA_PROVINCES } from '../data/provinces';
import { saveMangoPilotToFirestore, deleteMangoPilotFromFirestore, subscribeToMangoPilots } from '../lib/firebaseService';
import MangoFarmerPortal from './MangoFarmerPortal';
import MangoCommunityDirectory from './MangoCommunityDirectory';
import UniversalSectorVideoGuide from './UniversalSectorVideoGuide';
import { MANGO_FARMERS_REGISTRY_RAW, mapRawFarmerToRecord } from '../data/mangoRegistry';

// Sample Mock Presets for easy demonstration
const SAMPLE_PRESETS: MangoPilotRecord[] = [
  {
    id: 'preset_kampong_speu',
    title: 'Kampong Speu Premium Keo Romeat Pilot',
    timestamp: Date.now() - 3600000 * 2,
    
    // Level 1: Farmer Profile
    farmerId: 'M-F-001',
    fullName: 'Sokha Mean',
    gender: 'Male',
    dob: '1979-05-12',
    phone: '085-555-124',
    address: 'Chbar Mon Commune, Kampong Speu Province, Cambodia',
    cooperative: 'Kampong Speu Mango Agricultural Cooperative',
    trainingReceived: 'GAP Standards, IPM Pesticide Training, Post-Harvest Packaging',
    gapStatus: 'Certified',
    organicStatus: 'In Progress',
    familyMembers: 5,
    laborAvailable: 3,
    mainIncome: 'Mango Orchard, Pig Farming',

    // Level 2: Farm Registration
    farmId: 'M-FARM-204',
    gpsLatitude: 11.4582,
    gpsLongitude: 104.5201,
    province: 'KAMPONG SPEU',
    district: 'Chbar Mon',
    commune: 'Roka Thum',
    village: 'Sra Kraang',
    farmArea: 4.5,

    // Level 3: Plot Details
    plotId: 'PLOT-A1',
    plotSize: 2.5,
    slope: 'Gentle',
    elevation: 115,
    soilType: 'Sandy clay loam with rich organic layer',
    irrigationSource: 'Cooperative Water Reservoir & Ground Well',
    waterAvailability: 'Year-round',

    // Level 4: Tree Group & Variety
    variety: 'Keo Romeat',
    treeGroupId: 'TG-KM-01',
    plantingDate: '2016-06-15',
    treeAge: 10,
    rootstock: 'Native Keo Romeat Seedling',
    spacing: '8m x 8m',
    numTrees: 390,
    treeHealth: 'Excellent',
    previousYield: 9500,
    currentYieldEstimate: 11000,
    yieldHistory: '2024: 8,200kg, 2025: 9,500kg',

    // Level 5: Farm Operations Log
    landPrepDate: '2026-03-10',
    landPrepActivity: 'Weeding, Organic mulching, Ditch clearing',
    landPrepLabor: 6,
    plantingDateActual: '2016-06-18',
    seedlingSource: 'Cooperative Certified Nursery',
    plantingQty: 400,
    pruningDate: '2026-04-05',
    pruningTrees: 390,
    pruningMethod: 'Structural center pruning for sunlight distribution',
    flowerInductionDate: '2026-05-20',
    flowerInductionMethod: 'Foliar spray inducer',
    flowerInductionMaterials: 'Paclobutrazol safe dosage formula',
    flowerInductionDosage: '150g per 100L water',
    irrigationDate: '2026-06-25',
    irrigationSourceLog: 'Reservoir Drip System',
    irrigationVolume: 45,
    fertilizerDate: '2026-04-12',
    fertilizerName: 'Premium Organic Compost & Safe NPK Booster',
    fertilizerNpk: '15-15-15',
    fertilizerBatch: 'F-NPK-802',
    fertilizerQty: 780,
    fertilizerCost: 350,
    organicInputsType: 'Chicken manure compost & rice husks',
    organicInputsQty: 1200,

    // Pest & Disease
    pestObserveDate: '2026-05-15',
    pestIdentified: 'Fruit fly',
    pestSeverity: 'Low',
    pestAffectedArea: 0.2,
    diseaseObserveDate: '2026-05-18',
    diseaseIdentified: 'Anthracnose',
    pesticideName: 'SafeGuard Bio-pesticide',
    pesticideActiveIngredient: 'Azadirachtin (Neem-extract)',
    pesticideRegNumber: 'KH-AG-2024-092',
    pesticideSupplier: 'Cambodia Agri-Input Association',
    pesticideBatch: 'SG-2201',
    pesticideDate: '2026-05-22',
    pesticideDosage: '200ml / 200L water',
    pesticideApplicator: 'Sokha Mean',
    pesticidePpeUsed: 'Goggles, face mask, rubber boots, protective apron',
    pesticidePhiDays: 14,

    // Level 6: Weather & Climate
    weatherRainfall: 120,
    weatherTemp: 33.5,
    weatherHumidity: 74,
    weatherSeasonalEvents: 'Brief dry spell early May solved by drip irrigation',
    sustainabilityWaterUse: 'Precision solar-powered drip irrigation system',
    sustainabilitySoilConservation: 'Rice straw mulching around root zones, vetiver grass on borders',
    sustainabilityBiodiversity: 'Border windbreaks of Acacia trees and flowering insectary plants',
    sustainabilityTreesPlanted: 25,

    // Level 7: Harvest & Quality Grading
    harvestBatchId: 'H-MNG-KS-08',
    harvestDate: '2026-06-30',
    harvestPlotId: 'PLOT-A1',
    harvestVariety: 'Keo Romeat',
    harvestQty: 10400,
    harvestCrates: 416,
    harvestCrew: 'Sokha Mean & Cooperative Harvesting Team',
    gradeA: 7200,
    gradeB: 2100,
    gradeC: 900,
    gradeRejected: 200,
    postWashing: true,
    postSorting: true,
    postPacking: true,
    postStorageTemp: 13,
    postStorageHumidity: 85,
    postStorageDuration: 3,

    // Level 8: Marketing & Sales
    buyerId: 'BYR-EXP-02',
    buyerName: 'Angkor Organic Export Corp',
    buyerType: 'Exporter',
    salesDate: '2026-07-03',
    salesBatchId: 'H-MNG-KS-08',
    salesQty: 9300,
    salesPricePerKg: 1.25,
    transportVehicle: 'Refrigerated container truck (5-Ton)',
    transportDriver: 'Sovan Som',
    transportDestination: 'Phnom Penh Export Port (to South Korea)',
    transportDeliveryDate: '2026-07-03',

    // Advanced module Economics
    econInputCost: 520,
    econLaborCost: 450,
    econTransportCost: 150,
    econPackagingCost: 180,
    econRevenue: 11625,
  },
  {
    id: 'preset_preah_vihear',
    title: 'Preah Vihear Organic Keo Romeat Pilot',
    timestamp: Date.now() - 3600000 * 5,
    
    // Level 1: Farmer Profile
    farmerId: 'M-F-PV-01',
    fullName: 'Chea Bunthoeun',
    gender: 'Male',
    dob: '1982-08-14',
    phone: '097-888-2311',
    address: 'Rovieng District, Preah Vihear Province, Cambodia',
    cooperative: 'Preah Vihear Organic Agro-Forestry Cooperative',
    trainingReceived: 'EU Organic Standards, IPM Bio-Pesticide, Water Conservation',
    gapStatus: 'Certified',
    organicStatus: 'Certified',
    familyMembers: 6,
    laborAvailable: 4,
    mainIncome: 'Keo Romeat Mango, Organic Cashew',

    // Level 2: Farm Registration
    farmId: 'M-FARM-PV-108',
    gpsLatitude: 13.7915,
    gpsLongitude: 104.9812,
    province: 'PREAH VIHEAR',
    district: 'Rovieng',
    commune: 'Robieb',
    village: 'Thnal',
    farmArea: 6.0,

    // Level 3: Plot Details
    plotId: 'PLOT-PV-01',
    plotSize: 3.5,
    slope: 'Flat',
    elevation: 85,
    soilType: 'Red volcanic loam with high organic matter',
    irrigationSource: 'Solar Pump & Natural Stream Reservoir',
    waterAvailability: 'Year-round',

    // Level 4: Tree Group & Variety
    variety: 'Keo Romeat',
    treeGroupId: 'TG-PV-01',
    plantingDate: '2017-07-10',
    treeAge: 9,
    rootstock: 'Native Keo Romeat Grafted',
    spacing: '8m x 8m',
    numTrees: 520,
    treeHealth: 'Excellent',
    previousYield: 12500,
    currentYieldEstimate: 14800,
    yieldHistory: '2024: 10,800kg, 2025: 12,500kg',

    // Level 5: Farm Operations Log
    landPrepDate: '2026-02-20',
    landPrepActivity: 'Organic weeding, biological mulching',
    landPrepLabor: 5,
    plantingDateActual: '2017-07-12',
    seedlingSource: 'Preah Vihear Organic Nursery',
    plantingQty: 520,
    pruningDate: '2026-03-15',
    pruningTrees: 520,
    pruningMethod: 'Sanitary & light penetration pruning',
    flowerInductionDate: '2026-04-22',
    flowerInductionMethod: 'Organic biological foliar stimulant',
    flowerInductionMaterials: 'Bio-Fermented Fish & Seaweed Extract',
    flowerInductionDosage: '200ml per 100L water',
    irrigationDate: '2026-05-18',
    irrigationSourceLog: 'Solar-powered micro-drip network',
    irrigationVolume: 50,
    fertilizerDate: '2026-04-02',
    fertilizerName: 'Certified Bio-Compost & Rock Phosphate',
    fertilizerNpk: 'Organic 4-3-3 + Micronutrients',
    fertilizerBatch: 'PV-BIO-304',
    fertilizerQty: 1040,
    fertilizerCost: 420,
    organicInputsType: 'Farm-made fermented compost & rice husk biochar',
    organicInputsQty: 1800,

    // Pest & Disease
    pestObserveDate: '2026-05-10',
    pestIdentified: 'None',
    pestSeverity: 'Low',
    pestAffectedArea: 0.1,
    diseaseObserveDate: '2026-05-12',
    diseaseIdentified: 'None',
    pesticideName: 'Pure Neem Oil & Trichoderma Bio-Shield',
    pesticideActiveIngredient: 'Azadirachtin + Trichoderma Harzianum',
    pesticideRegNumber: 'KH-BIO-2025-018',
    pesticideSupplier: 'Preah Vihear Organic Union',
    pesticideBatch: 'PV-BIO-091',
    pesticideDate: '2026-05-15',
    pesticideDosage: '250ml / 200L water',
    pesticideApplicator: 'Chea Bunthoeun',
    pesticidePpeUsed: 'Face shield, organic spray coat, gloves',
    pesticidePhiDays: 7,

    // Level 6: Weather & Climate
    weatherRainfall: 160,
    weatherTemp: 31.8,
    weatherHumidity: 78,
    weatherSeasonalEvents: 'Beneficial early monsoon showers with good soil moisture',
    sustainabilityWaterUse: '100% solar gravity-fed drip irrigation',
    sustainabilitySoilConservation: 'Continuous biochar and legume cover cropping',
    sustainabilityBiodiversity: 'Forest buffer zone with 45 native hardwood trees preserved',
    sustainabilityTreesPlanted: 30,

    // Level 7: Harvest & Quality Grading
    harvestBatchId: 'H-MNG-PV-03',
    harvestDate: '2026-06-28',
    harvestPlotId: 'PLOT-PV-01',
    harvestVariety: 'Keo Romeat',
    harvestQty: 13500,
    harvestCrates: 540,
    harvestCrew: 'Preah Vihear Organic Youth Harvesting Team',
    gradeA: 10200,
    gradeB: 2600,
    gradeC: 600,
    gradeRejected: 100,
    postWashing: true,
    postSorting: true,
    postPacking: true,
    postStorageTemp: 13,
    postStorageHumidity: 85,
    postStorageDuration: 4,

    // Level 8: Marketing & Sales
    buyerId: 'BYR-EXP-EU01',
    buyerName: 'Khmer Organic Agri Export Ltd.',
    buyerType: 'Exporter',
    salesDate: '2026-07-01',
    salesBatchId: 'H-MNG-PV-03',
    salesQty: 12800,
    salesPricePerKg: 1.35,
    transportVehicle: 'Solar refrigerated trailer (10-Ton)',
    transportDriver: 'Dara Pich',
    transportDestination: 'Sihanoukville Autonomous Port (To EU/France)',
    transportDeliveryDate: '2026-07-01',

    // Advanced module Economics
    econInputCost: 480,
    econLaborCost: 410,
    econTransportCost: 180,
    econPackagingCost: 200,
    econRevenue: 17280,
  },
  {
    id: 'preset_battambang',
    title: 'Battambang Nam Dok Mai Pilot Orchard',
    timestamp: Date.now() - 3600000 * 24,
    
    // Level 1: Farmer Profile
    farmerId: 'M-F-009',
    fullName: 'Sereyvudh Chan',
    gender: 'Male',
    dob: '1984-11-20',
    phone: '092-444-902',
    address: 'Samraong Commune, Battambang Province, Cambodia',
    cooperative: 'Battambang Export Fruit Association',
    trainingReceived: 'GAP Quality Grading, Export Standard Packing, Organic Composting',
    gapStatus: 'In Progress',
    organicStatus: 'Not Certified',
    familyMembers: 4,
    laborAvailable: 2,
    mainIncome: 'Mango Production, Corn Cultivation',

    // Level 2: Farm Registration
    farmId: 'M-FARM-911',
    gpsLatitude: 13.1022,
    gpsLongitude: 103.1945,
    province: 'BATTAMBANG',
    district: 'Ek Phnom',
    commune: 'Prek Norint',
    village: 'Sla Kram',
    farmArea: 3.2,

    // Level 3: Plot Details
    plotId: 'PLOT-EAST-1',
    plotSize: 2.0,
    slope: 'Flat',
    elevation: 19,
    soilType: 'Rich alluvial river deposit loam',
    irrigationSource: 'Sangker River Canal Pumping',
    waterAvailability: 'Year-round',

    // Level 4: Tree Group & Variety
    variety: 'Nam Dok Mai',
    treeGroupId: 'TG-ND-02',
    plantingDate: '2019-05-10',
    treeAge: 7,
    rootstock: 'Native Local Mango Seedling',
    spacing: '6m x 6m',
    numTrees: 450,
    treeHealth: 'Good',
    previousYield: 4800,
    currentYieldEstimate: 6200,
    yieldHistory: '2024: 3,500kg, 2025: 4,800kg',

    // Level 5: Farm Operations Log
    landPrepDate: '2026-02-15',
    landPrepActivity: 'Canal maintenance, weeding, soil aeration',
    landPrepLabor: 4,
    plantingDateActual: '2019-05-12',
    seedlingSource: 'Commercial Nursery Samraong',
    plantingQty: 450,
    pruningDate: '2026-03-22',
    pruningTrees: 450,
    pruningMethod: 'Light pruning to shape canopy',
    flowerInductionDate: '2026-04-18',
    flowerInductionMethod: 'Safe hormone spraying',
    flowerInductionMaterials: 'Thiourea safe formulation',
    flowerInductionDosage: '120g per 100L water',
    irrigationDate: '2026-05-10',
    irrigationSourceLog: 'Sangker River water canal pump',
    irrigationVolume: 60,
    fertilizerDate: '2026-03-28',
    fertilizerName: 'DAP & Potassium Sulfate blend',
    fertilizerNpk: '18-46-0 & Organic',
    fertilizerBatch: 'F-BATCH-201',
    fertilizerQty: 450,
    fertilizerCost: 210,
    organicInputsType: 'Cow manure & straw mulching',
    organicInputsQty: 900,

    // Pest & Disease
    pestObserveDate: '2026-05-02',
    pestIdentified: 'Thrips',
    pestSeverity: 'Medium',
    pestAffectedArea: 0.5,
    diseaseObserveDate: '2026-05-04',
    diseaseIdentified: 'Powdery mildew',
    pesticideName: 'AgroShield Mild Fungicide',
    pesticideActiveIngredient: 'Sulphur safe wettable powder',
    pesticideRegNumber: 'KH-PEST-2025-104',
    pesticideSupplier: 'Battambang Agricultural Services',
    pesticideBatch: 'AS-9921',
    pesticideDate: '2026-05-07',
    pesticideDosage: '250g / 200L water',
    pesticideApplicator: 'Sereyvudh Chan',
    pesticidePpeUsed: 'Goggles, face mask, gloves',
    pesticidePhiDays: 10,

    // Level 6: Weather & Climate
    weatherRainfall: 145,
    weatherTemp: 32.0,
    weatherHumidity: 82,
    weatherSeasonalEvents: 'Normal rainfall, high humidity conducive to mildew but managed',
    sustainabilityWaterUse: 'Pumping with eco-diesel engine and gated canal furrow irrigation',
    sustainabilitySoilConservation: 'Mulching with cover plants on water channels',
    sustainabilityBiodiversity: 'Retained 15 old tamarind trees and river grass buffers',
    sustainabilityTreesPlanted: 10,

    // Level 7: Harvest & Quality Grading
    harvestBatchId: 'H-MNG-BTB-14',
    harvestDate: '2026-06-25',
    harvestPlotId: 'PLOT-EAST-1',
    harvestVariety: 'Nam Dok Mai',
    harvestQty: 5900,
    harvestCrates: 295,
    harvestCrew: 'Family and neighbors',
    gradeA: 3800,
    gradeB: 1500,
    gradeC: 400,
    gradeRejected: 200,
    postWashing: true,
    postSorting: true,
    postPacking: false,
    postStorageTemp: 14,
    postStorageHumidity: 80,
    postStorageDuration: 2,

    // Level 8: Marketing & Sales
    buyerId: 'BYR-TRD-09',
    buyerName: 'Heng Fruits Trading Co., Ltd.',
    buyerType: 'Trader',
    salesDate: '2026-06-27',
    salesBatchId: 'H-MNG-BTB-14',
    salesQty: 5300,
    salesPricePerKg: 0.95,
    transportVehicle: 'Flatbed covered truck (3-Ton)',
    transportDriver: 'Vuthy Eng',
    transportDestination: 'Battambang Central Wholesale Market',
    transportDeliveryDate: '2026-06-27',

    // Advanced module Economics
    econInputCost: 310,
    econLaborCost: 280,
    econTransportCost: 90,
    econPackagingCost: 110,
    econRevenue: 5035,
  }
];

const INITIAL_FORM_STATE: MangoPilotRecord = {
  title: 'My Mango Interview Record',
  timestamp: Date.now(),
  
  // Level 1: Farmer Profile
  farmerId: 'M-F-001',
  fullName: '',
  gender: 'Female',
  dob: '1985-01-01',
  phone: '',
  address: '',
  cooperative: '',
  trainingReceived: '',
  gapStatus: 'In Progress',
  organicStatus: 'Not Certified',
  familyMembers: 4,
  laborAvailable: 2,
  mainIncome: '',

  // Level 2: Farm Registration
  farmId: 'M-FARM-001',
  gpsLatitude: 11.5,
  gpsLongitude: 104.8,
  province: 'KAMPONG SPEU',
  district: '',
  commune: '',
  village: '',
  farmArea: 2.0,

  // Level 3: Plot Details
  plotId: 'PLOT-1',
  plotSize: 1.5,
  slope: 'Flat',
  elevation: 50,
  soilType: 'Loam',
  irrigationSource: 'Well',
  waterAvailability: 'Year-round',

  // Level 4: Tree Group & Variety
  variety: 'Keo Romeat',
  treeGroupId: 'TG-1',
  plantingDate: '2018-06-01',
  treeAge: 8,
  rootstock: 'Native',
  spacing: '8m x 8m',
  numTrees: 150,
  treeHealth: 'Good',
  previousYield: 4500,
  currentYieldEstimate: 5000,
  yieldHistory: '',

  // Level 5: Farm Operations Log
  landPrepDate: '',
  landPrepActivity: '',
  landPrepLabor: 0,
  plantingDateActual: '',
  seedlingSource: '',
  plantingQty: 0,
  pruningDate: '',
  pruningTrees: 0,
  pruningMethod: '',
  flowerInductionDate: '',
  flowerInductionMethod: '',
  flowerInductionMaterials: '',
  flowerInductionDosage: '',
  irrigationDate: '',
  irrigationSourceLog: '',
  irrigationVolume: 0,
  fertilizerDate: '',
  fertilizerName: '',
  fertilizerNpk: '',
  fertilizerBatch: '',
  fertilizerQty: 0,
  fertilizerCost: 0,
  organicInputsType: '',
  organicInputsQty: 0,

  // Pest & Disease
  pestObserveDate: '',
  pestIdentified: 'None',
  pestSeverity: 'Low',
  pestAffectedArea: 0,
  diseaseObserveDate: '',
  diseaseIdentified: 'None',
  pesticideName: '',
  pesticideActiveIngredient: '',
  pesticideRegNumber: '',
  pesticideSupplier: '',
  pesticideBatch: '',
  pesticideDate: '',
  pesticideDosage: '',
  pesticideApplicator: '',
  pesticidePpeUsed: '',
  pesticidePhiDays: 14,

  // Level 6: Weather & Climate
  weatherRainfall: 0,
  weatherTemp: 31,
  weatherHumidity: 80,
  weatherSeasonalEvents: '',
  sustainabilityWaterUse: '',
  sustainabilitySoilConservation: '',
  sustainabilityBiodiversity: '',
  sustainabilityTreesPlanted: 0,

  // Level 7: Harvest & Quality Grading
  harvestBatchId: 'H-MNG-001',
  harvestDate: '',
  harvestPlotId: 'PLOT-1',
  harvestVariety: 'Keo Romeat',
  harvestQty: 5000,
  harvestCrates: 200,
  harvestCrew: '',
  gradeA: 3500,
  gradeB: 1000,
  gradeC: 400,
  gradeRejected: 100,
  postWashing: true,
  postSorting: true,
  postPacking: false,
  postStorageTemp: 14,
  postStorageHumidity: 85,
  postStorageDuration: 3,

  // Level 8: Marketing & Sales
  buyerId: 'BYR-001',
  buyerName: '',
  buyerType: 'Trader',
  salesDate: '',
  salesBatchId: 'H-MNG-001',
  salesQty: 4500,
  salesPricePerKg: 1.10,
  transportVehicle: '',
  transportDriver: '',
  transportDestination: '',
  transportDeliveryDate: '',

  // Advanced Module
  econInputCost: 200,
  econLaborCost: 150,
  econTransportCost: 50,
  econPackagingCost: 80,
  econRevenue: 4950,
};

type PilotSubTab = 
  | 'farmer' 
  | 'farm' 
  | 'plot' 
  | 'tree' 
  | 'operations' 
  | 'weather' 
  | 'harvest' 
  | 'sales' 
  | 'advanced';

export default function MangoPilot() {
  const [mainViewMode, setMainViewMode] = useState<'farmerPortal' | 'pilotVerification' | 'communityDirectory'>('farmerPortal');
  const [activeSubTab, setActiveSubTab] = useState<PilotSubTab>('farmer');
  const [formState, setFormState] = useState<MangoPilotRecord>(INITIAL_FORM_STATE);
  const [savedPilots, setSavedPilots] = useState<MangoPilotRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPassportMasked, setIsPassportMasked] = useState(false);

  // Subscribe to real-time Mango Pilots in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToMangoPilots((records) => {
      setSavedPilots(records);
    });
    return () => unsubscribe();
  }, []);

  const handleFieldChange = (field: keyof MangoPilotRecord, value: any) => {
    setFormState(prev => {
      const updated = { ...prev, [field]: value };
      
      // Dynamic updates for KPIs inside the state if needed
      if (field === 'gradeA' || field === 'gradeB' || field === 'gradeC' || field === 'gradeRejected') {
        const sum = Number(updated.gradeA || 0) + Number(updated.gradeB || 0) + Number(updated.gradeC || 0) + Number(updated.gradeRejected || 0);
        updated.harvestQty = sum;
      }
      
      if (field === 'salesQty' || field === 'salesPricePerKg') {
        updated.econRevenue = Number(updated.salesQty || 0) * Number(updated.salesPricePerKg || 0);
      }
      
      return updated;
    });
  };

  const loadPreset = (preset: MangoPilotRecord) => {
    setFormState({ ...preset, id: preset.id });
    setFeedback({ text: `Loaded preset: "${preset.title}"`, type: 'success' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveToCloud = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const recordToSave = {
        ...formState,
        timestamp: Date.now(),
        title: formState.fullName ? `Pilot: ${formState.fullName} (${formState.variety})` : formState.title
      };
      
      const savedId = await saveMangoPilotToFirestore(recordToSave);
      setFormState(prev => ({ ...prev, id: savedId }));
      setFeedback({ text: `✓ Securing Cloud Block - Interview securely written to Firestore (ID: ${savedId})`, type: 'success' });
    } catch (e: any) {
      setFeedback({ text: `Cloud write failed: ${e.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleDeleteRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this pilot record? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteMangoPilotFromFirestore(id);
      if (formState.id === id) {
        setFormState(INITIAL_FORM_STATE);
      }
      setFeedback({ text: 'Record deleted successfully.', type: 'success' });
    } catch (err: any) {
      setFeedback({ text: `Failed to delete: ${err.message}`, type: 'error' });
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(formState, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${formState.fullName || 'mango_pilot'}_trace_ledger.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Intermediate KPI Computations
  const computedTreeYield = formState.numTrees > 0 ? (formState.harvestQty / formState.numTrees).toFixed(1) : '0.0';
  const computedHaYield = formState.farmArea > 0 ? (formState.harvestQty / formState.farmArea).toFixed(0) : '0';
  
  const totalCosts = Number(formState.econInputCost || 0) + Number(formState.econLaborCost || 0) + Number(formState.econTransportCost || 0) + Number(formState.econPackagingCost || 0);
  const calculatedProfit = formState.econRevenue - totalCosts;
  const costPerKg = formState.harvestQty > 0 ? (totalCosts / formState.harvestQty).toFixed(2) : '0.00';
  const profitPerKg = formState.harvestQty > 0 ? (calculatedProfit / formState.harvestQty).toFixed(2) : '0.00';
  
  const rejectionRate = formState.harvestQty > 0 ? ((formState.gradeRejected / formState.harvestQty) * 100).toFixed(1) : '0.0';
  const co2Sequestration = formState.numTrees * 21.8; // Est. 21.8 kg/year/tree of CO2

  // Progress computation
  const getSubTabStatus = (tab: PilotSubTab) => {
    switch(tab) {
      case 'farmer': return formState.fullName ? 'completed' : 'empty';
      case 'farm': return formState.district ? 'completed' : 'empty';
      case 'plot': return formState.soilType ? 'completed' : 'empty';
      case 'tree': return formState.numTrees > 0 ? 'completed' : 'empty';
      case 'operations': return formState.fertilizerName ? 'completed' : 'empty';
      case 'weather': return formState.weatherTemp > 0 ? 'completed' : 'empty';
      case 'harvest': return formState.harvestDate ? 'completed' : 'empty';
      case 'sales': return formState.buyerName ? 'completed' : 'empty';
      case 'advanced': return formState.econRevenue > 0 ? 'completed' : 'empty';
      default: return 'empty';
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. Top Universal Video & User Guide Banner for Mango Keo Romeat */}
      <UniversalSectorVideoGuide 
        sectorKey="mango"
        onSelectAction={() => setMainViewMode('farmerPortal')}
      />
      
      {/* SECTOR TOP NAVIGATION VIEW MODE SWITCHER */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
            🥭
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-sans">
                🥭 Mango Keo Romeat Pilot App
              </h1>
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                ALL PROVINCES
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              ប្រព័ន្ធកត់ត្រាចម្ការស្វាយកែវរមៀតគ្រប់ខេត្ត • កំពង់ស្ពឺ • ព្រះវិហារ • បាត់ដំបង • ឧត្តរមានជ័យ & ស្តង់ដារ GAP ៨ កម្រិត
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setMainViewMode('farmerPortal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              mainViewMode === 'farmerPortal'
                ? 'bg-amber-500 text-slate-950 shadow-md font-sans'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 font-sans'
            }`}
          >
            <span>📱 ចូលគណនី & កត់ត្រាប្រចាំថ្ងៃ (Farmer Portal)</span>
          </button>
          <button
            onClick={() => setMainViewMode('pilotVerification')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              mainViewMode === 'pilotVerification'
                ? 'bg-emerald-600 text-white shadow-md font-sans'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 font-sans'
            }`}
          >
            <span>📋 ពិធីសារវាយតម្លៃ ៨ កម្រិត (8-Level Audit)</span>
          </button>
          <button
            onClick={() => setMainViewMode('communityDirectory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              mainViewMode === 'communityDirectory'
                ? 'bg-emerald-600 text-white shadow-md font-sans'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 font-sans'
            }`}
          >
            <span>🇰🇭 បញ្ជីកសិករស្វាយ (Communities)</span>
          </button>
        </div>
      </div>

      {/* PROVINCE SELECTOR BAR FOR FARM OWNERS */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-sm shrink-0">
            📍
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider block">
              ជ្រើសរើសខេត្តរបស់ម្ចាស់ចម្ការ (SELECT FARM PROVINCE)
            </span>
            <p className="text-xs font-bold text-slate-900">
              ខេត្តបច្ចុប្បន្ន៖ <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">{formState.province || 'KAMPONG SPEU'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* 25 provinces dropdown */}
          <div className="relative w-full md:w-auto">
            <select
              value={formState.province?.toUpperCase()}
              onChange={(e) => {
                const selectedVal = e.target.value;
                handleFieldChange('province', selectedVal);
                setFeedback({
                  text: `✓ បានប្តូរទីតាំងចម្ការស្វាយទៅកាន់៖ ${selectedVal}`,
                  type: 'success'
                });
                setTimeout(() => setFeedback(null), 3000);
              }}
              className="w-full md:w-auto bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="" disabled>-- ជ្រើសរើសខេត្ត (Select Province) --</option>
              {CAMBODIA_PROVINCES.map((p) => (
                <option key={p.value} value={p.value.toUpperCase()}>
                  {p.fullLabel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {mainViewMode === 'farmerPortal' && (
        <MangoFarmerPortal />
      )}

      {mainViewMode === 'communityDirectory' && (
        <MangoCommunityDirectory
          onSelectFarmerForAudit={(record) => {
            setFormState(record);
            setMainViewMode('pilotVerification');
            setFeedback({
              text: `✓ បានទាញទិន្នន័យកសិករ៖ ${record.fullName} (${record.cooperative}) ចូលទៅក្នុងទម្រង់វាយតម្លៃ ៨ កម្រិត!`,
              type: 'success'
            });
            setTimeout(() => setFeedback(null), 5000);
          }}
          onNavigateToFarmerPortal={() => setMainViewMode('farmerPortal')}
        />
      )}

      {mainViewMode === 'pilotVerification' && (
        <div className="space-y-6">
          {/* HEADER BAR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Mango Pilot Protocol</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Level 1 - 8 Verification</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🥭 Mango Keo Romeat Pilot
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure orchard mappings, tree metrics, weather monitors, and crop inputs to generate a printable **Agricultural Product Passport**. Directly synchronized with your Firestore cloud ledger for offline-ready field surveys.
          </p>
        </div>
        
        {/* PRESET LAUNCHERS */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button 
            onClick={() => loadPreset(SAMPLE_PRESETS[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs rounded-lg border border-slate-200 font-medium cursor-pointer transition-all"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span>Load Kampong Speu Pilot</span>
          </button>
          <button 
            onClick={() => loadPreset(SAMPLE_PRESETS[1])}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs rounded-lg border border-slate-200 font-medium cursor-pointer transition-all"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span>Load Preah Vihear Pilot</span>
          </button>
          <button 
            onClick={() => loadPreset(SAMPLE_PRESETS[2])}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs rounded-lg border border-slate-200 font-medium cursor-pointer transition-all"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span>Load Battambang Pilot</span>
          </button>
          <button 
            onClick={() => { setFormState(INITIAL_FORM_STATE); setFeedback({ text: 'Form reset to blank.', type: 'success' }); setTimeout(() => setFeedback(null), 2000); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs rounded-lg border border-red-200 font-medium cursor-pointer transition-all"
          >
            <Trash2 size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK STATUS */}
      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-xs font-mono border flex items-center gap-3 ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <AlertCircle size={16} className="text-red-500 shrink-0" />}
          <span>{feedback.text}</span>
        </motion.div>
      )}

      {/* CURRENT ACTIVE SMALLHOLDER CONTEXT BAR */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs font-mono tracking-tight shrink-0">
            {formState.farmerId || 'M-001'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-200/80 text-emerald-950 rounded-full">
                {formState.cooperative || 'សហគមន៍កសិកម្ម'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                {formState.variety || 'Keo Romeat'} Variety
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500">
                GPS: {formState.gpsLatitude?.toFixed(4)}, {formState.gpsLongitude?.toFixed(4)}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              {formState.fullName || 'កសិករមិនទាន់ដាក់ឈ្មោះ'} • {formState.numTrees ? `${formState.numTrees.toLocaleString()} ដើម` : 'មិនទាន់បញ្ជាក់ចំនួនដើម'} ({formState.farmArea || 0} ha)
            </h3>
          </div>
        </div>
        <button
          onClick={() => setMainViewMode('communityDirectory')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-emerald-800 hover:bg-emerald-100 text-xs rounded-xl border border-emerald-300 font-bold transition-all cursor-pointer shadow-xs shrink-0"
        >
          <span>🇰🇭 ប្តូរកសិករពីបញ្ជីសហគមន៍ (25 Smallholders)</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* INTERACTIVE HIERARCHY MAP PIPELINE */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,185,129,0.12),rgba(0,0,0,0))] pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Layers size={13} /> TRACEABILITY CHAIN LEVEL PIPELINE
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Click any stage below to navigate the questionnaire
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-9 gap-2">
            {[
              { id: 'farmer', title: 'L1: Farmer', icon: User, desc: 'Bio & Coop' },
              { id: 'farm', title: 'L2: Farm', icon: Home, desc: 'GPS & Area' },
              { id: 'plot', title: 'L3: Plot', icon: Layers, desc: 'Slope & Soil' },
              { id: 'tree', title: 'L4: Orchard', icon: Leaf, desc: 'Variety & Age' },
              { id: 'operations', title: 'L5: Logbook', icon: Settings, desc: 'Prune & Spray' },
              { id: 'weather', title: 'L6: Weather', icon: Sun, desc: 'Rain & Temp' },
              { id: 'harvest', title: 'L7: Harvest', icon: ClipboardList, desc: 'Batch Grading' },
              { id: 'sales', title: 'L8: Sells', icon: ShoppingBag, desc: 'Buyer & Transport' },
              { id: 'advanced', title: 'Economics', icon: DollarSign, desc: 'KPI & Carbon' },
            ].map((node) => {
              const active = activeSubTab === node.id;
              const status = getSubTabStatus(node.id as PilotSubTab);
              const NodeIcon = node.icon;
              
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveSubTab(node.id as PilotSubTab)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    active 
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                      : status === 'completed'
                      ? 'bg-slate-800 border-emerald-800/60 text-emerald-300 hover:bg-slate-750'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <NodeIcon size={16} className={active ? 'text-white' : status === 'completed' ? 'text-emerald-400' : 'text-slate-500'} />
                  <span className="text-[11px] font-bold mt-1.5 block">{node.title}</span>
                  <span className="text-[9px] opacity-75 mt-0.5 truncate max-w-full font-sans">{node.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE LEVEL FORM */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {activeSubTab === 'farmer' && 'L1'}
                {activeSubTab === 'farm' && 'L2'}
                {activeSubTab === 'plot' && 'L3'}
                {activeSubTab === 'tree' && 'L4'}
                {activeSubTab === 'operations' && 'L5'}
                {activeSubTab === 'weather' && 'L6'}
                {activeSubTab === 'harvest' && 'L7'}
                {activeSubTab === 'sales' && 'L8'}
                {activeSubTab === 'advanced' && '$$'}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wide">
                  {activeSubTab === 'farmer' && 'Level 1: Farmer & Household Profile'}
                  {activeSubTab === 'farm' && 'Level 2: Farm Registration & GPS Mapping'}
                  {activeSubTab === 'plot' && 'Level 3: Plot Characteristics'}
                  {activeSubTab === 'tree' && 'Level 4: Mango Orchard Variety & Inventory'}
                  {activeSubTab === 'operations' && 'Level 5: Farm Operations Log (Inputs)'}
                  {activeSubTab === 'weather' && 'Level 6: Climate & Sustainability Monitors'}
                  {activeSubTab === 'harvest' && 'Level 7: Harvest Yields & Grading Matrix'}
                  {activeSubTab === 'sales' && 'Level 8: Marketing, Sales & Logistics'}
                  {activeSubTab === 'advanced' && 'Advanced Economics & Carbon Estimation'}
                </h3>
                <p className="text-[10px] text-slate-500 font-sans">
                  {activeSubTab === 'farmer' && 'Demographics, cooperatives, certification status, household labor.'}
                  {activeSubTab === 'farm' && 'Location tracking, provincial markers, and total farm area boundaries.'}
                  {activeSubTab === 'plot' && 'Water availability, irrigation, soil profiles, and slope gradients.'}
                  {activeSubTab === 'tree' && 'Keo Romeat, Nam Dok Mai variety specs, spacing, tree health, and productivity.'}
                  {activeSubTab === 'operations' && 'Land prep, pruning method, induction dosage, and certified input tracking.'}
                  {activeSubTab === 'weather' && 'Local microclimate, weather hazards, and biodiversity indices.'}
                  {activeSubTab === 'harvest' && 'Traceable harvest batches, sorting grids A/B/C, and storage cooling.'}
                  {activeSubTab === 'sales' && 'Exporters, wholesalers, prices, refrigeration units, and delivery logs.'}
                  {activeSubTab === 'advanced' && 'Consolidated financial KPIs, cost-of-production trackers, and CO2 credits.'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.12 }}
                className="space-y-4 text-xs"
              >
                {/* LEVEL 1: FARMER */}
                {activeSubTab === 'farmer' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Farmer ID Code</label>
                      <input 
                        type="text" 
                        value={formState.farmerId} 
                        onChange={(e) => handleFieldChange('farmerId', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                        placeholder="M-F-001"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Farmer Full Name *</label>
                      <input 
                        type="text" 
                        value={formState.fullName} 
                        onChange={(e) => handleFieldChange('fullName', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-medium" 
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Gender</label>
                      <select 
                        value={formState.gender} 
                        onChange={(e) => handleFieldChange('gender', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500"
                      >
                        <option value="Male">ប្រុស (Male)</option>
                        <option value="Female">ស្រី (Female)</option>
                        <option value="Other">ផ្សេងៗ (Other)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Date of Birth</label>
                      <input 
                        type="date" 
                        value={formState.dob} 
                        onChange={(e) => handleFieldChange('dob', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Phone Number</label>
                      <input 
                        type="text" 
                        value={formState.phone} 
                        onChange={(e) => handleFieldChange('phone', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-mono" 
                        placeholder="012-345-678"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Cooperative Membership</label>
                      <input 
                        type="text" 
                        value={formState.cooperative} 
                        onChange={(e) => handleFieldChange('cooperative', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="Cooperative name"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Full Home Address</label>
                      <input 
                        type="text" 
                        value={formState.address} 
                        onChange={(e) => handleFieldChange('address', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="Commune, District, Province, Cambodia"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">GAP Certification Status</label>
                      <select 
                        value={formState.gapStatus} 
                        onChange={(e) => handleFieldChange('gapStatus', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500"
                      >
                        <option value="Certified">មានវិញ្ញាបនបត្រ GAP (Certified GAP)</option>
                        <option value="In Progress">កំពុងស្នើសុំ / ត្រួតពិនិត្យ (In Progress / Audited)</option>
                        <option value="Not Certified">មិនទាន់មានវិញ្ញាបនបត្រ (Not Certified)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Organic Status</label>
                      <select 
                        value={formState.organicStatus} 
                        onChange={(e) => handleFieldChange('organicStatus', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500"
                      >
                        <option value="Certified">សរីរាង្គមានវិញ្ញាបនបត្រ (Organic Certified)</option>
                        <option value="In Progress">ដំណាក់កាលអន្តរកាល (In Transition)</option>
                        <option value="Not Certified">មិនទាន់មានវិញ្ញាបនបត្រ (Not Certified)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Family Members Count</label>
                      <input 
                        type="number" 
                        value={formState.familyMembers} 
                        onChange={(e) => handleFieldChange('familyMembers', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Available Farm Laborers</label>
                      <input 
                        type="number" 
                        value={formState.laborAvailable} 
                        onChange={(e) => handleFieldChange('laborAvailable', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Primary Household Income Sources</label>
                      <input 
                        type="text" 
                        value={formState.mainIncome} 
                        onChange={(e) => handleFieldChange('mainIncome', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="e.g., Mangoes, Cashews, Rice"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">GAP/Agricultural Training Received</label>
                      <input 
                        type="text" 
                        value={formState.trainingReceived} 
                        onChange={(e) => handleFieldChange('trainingReceived', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="e.g. IPM, pruning, post-harvest sorting"
                      />
                    </div>
                  </div>
                )}

                {/* LEVEL 2: FARM */}
                {activeSubTab === 'farm' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Farm ID Code</label>
                      <input 
                        type="text" 
                        value={formState.farmId} 
                        onChange={(e) => handleFieldChange('farmId', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Total Farm Area (Hectares)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={formState.farmArea} 
                        onChange={(e) => handleFieldChange('farmArea', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">GPS Latitude Coordinates</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        value={formState.gpsLatitude} 
                        onChange={(e) => handleFieldChange('gpsLatitude', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">GPS Longitude Coordinates</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        value={formState.gpsLongitude} 
                        onChange={(e) => handleFieldChange('gpsLongitude', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Province Location</label>
                      <select 
                        value={formState.province} 
                        onChange={(e) => handleFieldChange('province', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-bold uppercase text-xs"
                      >
                        {CAMBODIA_PROVINCES.map((p) => (
                          <option key={p.value} value={p.value.toUpperCase()}>
                            {p.fullLabel}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">District</label>
                      <input 
                        type="text" 
                        value={formState.district} 
                        onChange={(e) => handleFieldChange('district', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Commune</label>
                      <input 
                        type="text" 
                        value={formState.commune} 
                        onChange={(e) => handleFieldChange('commune', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Village</label>
                      <input 
                        type="text" 
                        value={formState.village} 
                        onChange={(e) => handleFieldChange('village', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                  </div>
                )}

                {/* LEVEL 3: PLOT */}
                {activeSubTab === 'plot' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Plot ID Code</label>
                      <input 
                        type="text" 
                        value={formState.plotId} 
                        onChange={(e) => handleFieldChange('plotId', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Plot Size (Hectares)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={formState.plotSize} 
                        onChange={(e) => handleFieldChange('plotSize', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Slope Gradient</label>
                      <select 
                        value={formState.slope} 
                        onChange={(e) => handleFieldChange('slope', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500"
                      >
                        <option value="Flat">ដីរាបស្មើ (Flat 0-2°)</option>
                        <option value="Gentle">ដីជម្រាលស្រាល (Gentle Slope 2-15°)</option>
                        <option value="Steep">ដីជម្រាលខ្លាំង (Steep Slopes &gt;15°)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Elevation (Meters above sea level)</label>
                      <input 
                        type="number" 
                        value={formState.elevation} 
                        onChange={(e) => handleFieldChange('elevation', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-mono" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Soil Type / Profile</label>
                      <input 
                        type="text" 
                        value={formState.soilType} 
                        onChange={(e) => handleFieldChange('soilType', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="e.g. Alluvial Sandy Clay"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Primary Irrigation Source</label>
                      <input 
                        type="text" 
                        value={formState.irrigationSource} 
                        onChange={(e) => handleFieldChange('irrigationSource', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="e.g. Ground Well / River Basin"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Water Availability Status</label>
                      <select 
                        value={formState.waterAvailability} 
                        onChange={(e) => handleFieldChange('waterAvailability', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500"
                      >
                        <option value="Year-round">មានទឹកគ្រប់គ្រាន់ពេញមួយឆ្នាំ (Year-round Consistent Water)</option>
                        <option value="Seasonal">មានទឹកតាមរដូវកាល (Seasonal Constraints)</option>
                        <option value="Scarce">ខ្វះខាតទឹកខ្លាំង / រាំងស្ងួត (Highly Scarce / Drought-prone)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* LEVEL 4: ORCHARD & VARIETY */}
                {activeSubTab === 'tree' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Mango Variety</label>
                      <select 
                        value={formState.variety} 
                        onChange={(e) => handleFieldChange('variety', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-emerald-800 focus:bg-white focus:outline-emerald-500"
                      >
                        <option value="Keo Romeat">ស្វាយកែវរមៀត (Keo Romeat - Export Core)</option>
                        <option value="Keo Chen">ស្វាយកែវចិន (Keo Chen)</option>
                        <option value="Nam Dok Mai">ស្វាយណាំដកម៉ៃ (Nam Dok Mai - Golden Thai)</option>
                        <option value="Irwin">ស្វាយអ៊ឺវីន (Irwin - Apple Mango)</option>
                        <option value="Other">ពូជផ្សេងទៀត (Other Variety)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Tree Group ID / Batch Code</label>
                      <input 
                        type="text" 
                        value={formState.treeGroupId} 
                        onChange={(e) => handleFieldChange('treeGroupId', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Original Planting Date</label>
                      <input 
                        type="date" 
                        value={formState.plantingDate} 
                        onChange={(e) => handleFieldChange('plantingDate', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Average Tree Age (Years)</label>
                      <input 
                        type="number" 
                        value={formState.treeAge} 
                        onChange={(e) => handleFieldChange('treeAge', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-mono" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Grafting Rootstock Info</label>
                      <input 
                        type="text" 
                        value={formState.rootstock} 
                        onChange={(e) => handleFieldChange('rootstock', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="e.g. Local Wild Mango graft"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Tree Spacing Grid (m x m)</label>
                      <input 
                        type="text" 
                        value={formState.spacing} 
                        onChange={(e) => handleFieldChange('spacing', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-mono" 
                        placeholder="e.g. 8m x 8m"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Total Count of Trees *</label>
                      <input 
                        type="number" 
                        value={formState.numTrees} 
                        onChange={(e) => handleFieldChange('numTrees', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-bold font-mono" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">General Tree Health Status</label>
                      <select 
                        value={formState.treeHealth} 
                        onChange={(e) => handleFieldChange('treeHealth', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500"
                      >
                        <option value="Excellent">Excellent - Active flush, zero pest signs</option>
                        <option value="Good">Good - Well pruned, minor thrip presence</option>
                        <option value="Fair">Fair - Some dieback, needs organic composting</option>
                        <option value="Poor">Poor - Disease symptoms, water logged roots</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Previous Yield (kg)</label>
                      <input 
                        type="number" 
                        value={formState.previousYield} 
                        onChange={(e) => handleFieldChange('previousYield', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Current Season Yield Forecast (kg)</label>
                      <input 
                        type="number" 
                        value={formState.currentYieldEstimate} 
                        onChange={(e) => handleFieldChange('currentYieldEstimate', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Historical Yield Record Notes</label>
                      <input 
                        type="text" 
                        value={formState.yieldHistory} 
                        onChange={(e) => handleFieldChange('yieldHistory', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="e.g. 2024: 6500kg, 2025: 8200kg"
                      />
                    </div>
                  </div>
                )}

                {/* LEVEL 5: OPERATIONS & INPUTS */}
                {activeSubTab === 'operations' && (
                  <div className="space-y-6">
                    {/* Cultivation Log */}
                    <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 flex items-center gap-1.5">
                        <Layers size={12} className="text-emerald-600" /> Agronomic Operations (Pruning & Flower Induction)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Pruning Date</label>
                          <input 
                            type="date" 
                            value={formState.pruningDate} 
                            onChange={(e) => handleFieldChange('pruningDate', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Trees Pruned</label>
                          <input 
                            type="number" 
                            value={formState.pruningTrees} 
                            onChange={(e) => handleFieldChange('pruningTrees', Number(e.target.value))} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Pruning Technique</label>
                          <input 
                            type="text" 
                            value={formState.pruningMethod} 
                            onChange={(e) => handleFieldChange('pruningMethod', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                            placeholder="e.g. Crown center opening"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Induction Date</label>
                          <input 
                            type="date" 
                            value={formState.flowerInductionDate} 
                            onChange={(e) => handleFieldChange('flowerInductionDate', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Induction Material</label>
                          <input 
                            type="text" 
                            value={formState.flowerInductionMaterials} 
                            onChange={(e) => handleFieldChange('flowerInductionMaterials', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                            placeholder="e.g. Paclobutrazol safe formula"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Applied Dosage</label>
                          <input 
                            type="text" 
                            value={formState.flowerInductionDosage} 
                            onChange={(e) => handleFieldChange('flowerInductionDosage', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                            placeholder="e.g. 150g / 100L water"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fertilizers & Organic Inputs */}
                    <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 flex items-center gap-1.5">
                        <Leaf size={12} className="text-emerald-600" /> Traceable Nutrient Inputs (NPK & Composting)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Fertilizer Applied</label>
                          <input 
                            type="text" 
                            value={formState.fertilizerName} 
                            onChange={(e) => handleFieldChange('fertilizerName', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                            placeholder="Product name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">NPK Formula</label>
                          <input 
                            type="text" 
                            value={formState.fertilizerNpk} 
                            onChange={(e) => handleFieldChange('fertilizerNpk', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                            placeholder="e.g., 15-15-15"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Supply Lot / Batch #</label>
                          <input 
                            type="text" 
                            value={formState.fertilizerBatch} 
                            onChange={(e) => handleFieldChange('fertilizerBatch', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                            placeholder="Lot serial number"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Nutrient Mass (kg)</label>
                          <input 
                            type="number" 
                            value={formState.fertilizerQty} 
                            onChange={(e) => handleFieldChange('fertilizerQty', Number(e.target.value))} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Total Purchase Cost ($)</label>
                          <input 
                            type="number" 
                            value={formState.fertilizerCost} 
                            onChange={(e) => handleFieldChange('fertilizerCost', Number(e.target.value))} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Fertilizer App Date</label>
                          <input 
                            type="date" 
                            value={formState.fertilizerDate} 
                            onChange={(e) => handleFieldChange('fertilizerDate', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Organic Material Type</label>
                          <input 
                            type="text" 
                            value={formState.organicInputsType} 
                            onChange={(e) => handleFieldChange('organicInputsType', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                            placeholder="e.g. Cow manure & crop husks"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Organic Quantity (kg)</label>
                          <input 
                            type="number" 
                            value={formState.organicInputsQty} 
                            onChange={(e) => handleFieldChange('organicInputsQty', Number(e.target.value))} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pesticide Records (Auditor-Critical) */}
                    <div className="border border-red-100 bg-red-50/20 p-4 rounded-xl space-y-3">
                      <h4 className="font-bold text-red-900 text-xs border-b border-red-100 pb-1 flex items-center gap-1.5">
                        <AlertCircle size={12} className="text-red-600 animate-pulse" /> Pesticide & Plant Protection Log (Highly Monitored)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Pesticide Name</label>
                          <input 
                            type="text" 
                            value={formState.pesticideName} 
                            onChange={(e) => handleFieldChange('pesticideName', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                            placeholder="Product brand"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Active Ingredient</label>
                          <input 
                            type="text" 
                            value={formState.pesticideActiveIngredient} 
                            onChange={(e) => handleFieldChange('pesticideActiveIngredient', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                            placeholder="Chemical name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Gov Registry Code</label>
                          <input 
                            type="text" 
                            value={formState.pesticideRegNumber} 
                            onChange={(e) => handleFieldChange('pesticideRegNumber', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                            placeholder="KH-AG-xxxx"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Spray Dosage Rate</label>
                          <input 
                            type="text" 
                            value={formState.pesticideDosage} 
                            onChange={(e) => handleFieldChange('pesticideDosage', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono" 
                            placeholder="e.g. 150ml / 200L water"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Pre-Harvest Interval (PHI) *</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={formState.pesticidePhiDays} 
                              onChange={(e) => handleFieldChange('pesticidePhiDays', Number(e.target.value))} 
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 pr-12 font-bold text-red-700 font-mono" 
                            />
                            <span className="absolute right-3 top-2.5 text-slate-400 text-[10px]">days</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">PPE Safety Gears Used</label>
                          <input 
                            type="text" 
                            value={formState.pesticidePpeUsed} 
                            onChange={(e) => handleFieldChange('pesticidePpeUsed', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                            placeholder="e.g., Mask, gloves, boots"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Application Date</label>
                          <input 
                            type="date" 
                            value={formState.pesticideDate} 
                            onChange={(e) => handleFieldChange('pesticideDate', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Applicator Name</label>
                          <input 
                            type="text" 
                            value={formState.pesticideApplicator} 
                            onChange={(e) => handleFieldChange('pesticideApplicator', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Pest Target</label>
                          <select 
                            value={formState.pestIdentified} 
                            onChange={(e) => handleFieldChange('pestIdentified', e.target.value)} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2"
                          >
                            <option value="None">គ្មាន / ការពារជាមុន (None / Preventative)</option>
                            <option value="Fruit fly">រុយទិចផ្លែ (Fruit Fly / Thrip / Borer)</option>
                            <option value="Thrips">ដង្កូវស៊ីត្រួយ / ញាំ (Thrips)</option>
                            <option value="Mealybug">ចៃម្សៅ (Mealybug)</option>
                            <option value="Scale insect">ចៃស្រកា (Scale Insect)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LEVEL 6: WEATHER & ENVIRONMENTAL */}
                {activeSubTab === 'weather' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Daily Rainfall (mm)</label>
                      <input 
                        type="number" 
                        value={formState.weatherRainfall} 
                        onChange={(e) => handleFieldChange('weatherRainfall', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Daily Temperature (°C)</label>
                      <input 
                        type="number" 
                        value={formState.weatherTemp} 
                        onChange={(e) => handleFieldChange('weatherTemp', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Daily Humidity (%)</label>
                      <input 
                        type="number" 
                        value={formState.weatherHumidity} 
                        onChange={(e) => handleFieldChange('weatherHumidity', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">New Trees Planted (Biodiversity count)</label>
                      <input 
                        type="number" 
                        value={formState.sustainabilityTreesPlanted} 
                        onChange={(e) => handleFieldChange('sustainabilityTreesPlanted', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Drought / Flood / Severe Weather Incidents</label>
                      <input 
                        type="text" 
                        value={formState.weatherSeasonalEvents} 
                        onChange={(e) => handleFieldChange('weatherSeasonalEvents', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="Detail any major weather stresses"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Water Preservation / Solar Drip Irrigation Strategy</label>
                      <input 
                        type="text" 
                        value={formState.sustainabilityWaterUse} 
                        onChange={(e) => handleFieldChange('sustainabilityWaterUse', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="Detail water footprint reduction methods"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Soil Conservation Measures (Cover Crops, Mulching)</label>
                      <input 
                        type="text" 
                        value={formState.sustainabilitySoilConservation} 
                        onChange={(e) => handleFieldChange('sustainabilitySoilConservation', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="Detail composting & soil erosion control methods"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Orchard Biodiversity Enrichment</label>
                      <input 
                        type="text" 
                        value={formState.sustainabilityBiodiversity} 
                        onChange={(e) => handleFieldChange('sustainabilityBiodiversity', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="Secondary trees planted, border windbreaks, natural barriers"
                      />
                    </div>
                  </div>
                )}

                {/* LEVEL 7: HARVEST & GRADING */}
                {activeSubTab === 'harvest' && (
                  <div className="space-y-6 font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                      <div className="space-y-1 font-mono">
                        <label className="font-bold text-slate-700">Harvest Batch ID</label>
                        <input 
                          type="text" 
                          value={formState.harvestBatchId} 
                          onChange={(e) => handleFieldChange('harvestBatchId', e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Harvest Date</label>
                        <input 
                          type="date" 
                          value={formState.harvestDate} 
                          onChange={(e) => handleFieldChange('harvestDate', e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Harvest Plot Origin</label>
                        <input 
                          type="text" 
                          value={formState.harvestPlotId} 
                          onChange={(e) => handleFieldChange('harvestPlotId', e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5" 
                        />
                      </div>
                      <div className="space-y-1 font-sans">
                        <label className="font-bold text-slate-700 font-sans">Harvesting Crew Team</label>
                        <input 
                          type="text" 
                          value={formState.harvestCrew} 
                          onChange={(e) => handleFieldChange('harvestCrew', e.target.value)} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5" 
                          placeholder="e.g. SOK Co-op Harvesting squad"
                        />
                      </div>
                    </div>

                    {/* GRADING MATRIX */}
                    <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-4 font-sans">
                      <h4 className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 flex items-center gap-1.5">
                        <Layers size={12} className="text-emerald-600" /> Dynamic Quality Grading Matrix (Auto-aggregates harvest weight)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
                        <div className="space-y-1">
                          <label className="font-bold text-emerald-800 text-xs">Grade A (kg) - Export</label>
                          <input 
                            type="number" 
                            value={formState.gradeA} 
                            onChange={(e) => handleFieldChange('gradeA', Number(e.target.value))} 
                            className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-emerald-900 font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-blue-800 text-xs">Grade B (kg) - Local</label>
                          <input 
                            type="number" 
                            value={formState.gradeB} 
                            onChange={(e) => handleFieldChange('gradeB', Number(e.target.value))} 
                            className="w-full bg-white border border-blue-300 rounded-lg p-2 text-blue-900 font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-amber-800 text-xs">Grade C (kg) - Processing</label>
                          <input 
                            type="number" 
                            value={formState.gradeC} 
                            onChange={(e) => handleFieldChange('gradeC', Number(e.target.value))} 
                            className="w-full bg-white border border-amber-300 rounded-lg p-2 text-amber-900 font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-red-800 text-xs">Rejected Yield (kg)</label>
                          <input 
                            type="number" 
                            value={formState.gradeRejected} 
                            onChange={(e) => handleFieldChange('gradeRejected', Number(e.target.value))} 
                            className="w-full bg-white border border-red-300 rounded-lg p-2 text-red-900 font-bold" 
                          />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs rounded-lg flex items-center justify-between font-mono font-bold">
                        <span>COMPUTED TOTAL HARVEST WEIGHT:</span>
                        <span>{formState.harvestQty.toLocaleString()} kg</span>
                      </div>
                    </div>

                    {/* Post Harvest */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                      <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <input 
                          type="checkbox" 
                          id="wash_check"
                          checked={formState.postWashing} 
                          onChange={(e) => handleFieldChange('postWashing', e.target.checked)} 
                          className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <label htmlFor="wash_check" className="font-bold text-slate-700 cursor-pointer">Washing Completed</label>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <input 
                          type="checkbox" 
                          id="sort_check"
                          checked={formState.postSorting} 
                          onChange={(e) => handleFieldChange('postSorting', e.target.checked)} 
                          className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <label htmlFor="sort_check" className="font-bold text-slate-700 cursor-pointer">Sorting Completed</label>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <input 
                          type="checkbox" 
                          id="pack_check"
                          checked={formState.postPacking} 
                          onChange={(e) => handleFieldChange('postPacking', e.target.checked)} 
                          className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <label htmlFor="pack_check" className="font-bold text-slate-700 cursor-pointer">Packing Completed</label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Cold Storage Temp (°C)</label>
                        <input 
                          type="number" 
                          value={formState.postStorageTemp} 
                          onChange={(e) => handleFieldChange('postStorageTemp', Number(e.target.value))} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Cold Storage Humidity (%)</label>
                        <input 
                          type="number" 
                          value={formState.postStorageHumidity} 
                          onChange={(e) => handleFieldChange('postStorageHumidity', Number(e.target.value))} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Storage Duration (Days)</label>
                        <input 
                          type="number" 
                          value={formState.postStorageDuration} 
                          onChange={(e) => handleFieldChange('postStorageDuration', Number(e.target.value))} 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* LEVEL 8: SALES & SHIPMENT */}
                {activeSubTab === 'sales' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Buyer Corporate ID</label>
                      <input 
                        type="text" 
                        value={formState.buyerId} 
                        onChange={(e) => handleFieldChange('buyerId', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Buyer Corporate Name *</label>
                      <input 
                        type="text" 
                        value={formState.buyerName} 
                        onChange={(e) => handleFieldChange('buyerName', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-bold" 
                        placeholder="Enter corporate buyer name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Buyer Industry Type</label>
                      <select 
                        value={formState.buyerType} 
                        onChange={(e) => handleFieldChange('buyerType', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500"
                      >
                        <option value="Trader">Trader (Local Middleman)</option>
                        <option value="Exporter">Exporter (International Shipping)</option>
                        <option value="Processor">Processor (Value-added Pulp/Flour)</option>
                        <option value="Retailer">Direct Supermarket / Retailer</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Sales Date</label>
                      <input 
                        type="date" 
                        value={formState.salesDate} 
                        onChange={(e) => handleFieldChange('salesDate', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-mono" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Quantity Sold (kg)</label>
                      <input 
                        type="number" 
                        value={formState.salesQty} 
                        onChange={(e) => handleFieldChange('salesQty', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500 font-bold text-slate-800" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Price per Kilogram ($ USD/kg)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={formState.salesPricePerKg} 
                        onChange={(e) => handleFieldChange('salesPricePerKg', Number(e.target.value))} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:bg-white focus:outline-emerald-500 font-bold text-slate-800" 
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 text-xs rounded-lg flex items-center justify-between font-mono font-bold">
                        <span>CALCULATED GROSS REVENUE:</span>
                        <span>$ {formState.econRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Transport Vehicle Type</label>
                      <input 
                        type="text" 
                        value={formState.transportVehicle} 
                        onChange={(e) => handleFieldChange('transportVehicle', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="e.g. 5-Ton Reefer Truck"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Driver Name</label>
                      <input 
                        type="text" 
                        value={formState.transportDriver} 
                        onChange={(e) => handleFieldChange('transportDriver', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Delivery Destination</label>
                      <input 
                        type="text" 
                        value={formState.transportDestination} 
                        onChange={(e) => handleFieldChange('transportDestination', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500" 
                        placeholder="Port or storage depot"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Delivery Target Date</label>
                      <input 
                        type="date" 
                        value={formState.transportDeliveryDate} 
                        onChange={(e) => handleFieldChange('transportDeliveryDate', e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-emerald-500 font-mono" 
                      />
                    </div>
                  </div>
                )}

                {/* ADVANCED: ECONOMICS & CARBON */}
                {activeSubTab === 'advanced' && (
                  <div className="space-y-6 font-sans">
                    <div className="border border-slate-150 bg-slate-50/50 p-5 rounded-xl space-y-4">
                      <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 flex items-center gap-1.5 font-mono">
                        <DollarSign size={13} className="text-emerald-600" /> COMPREHENSIVE COST LEDGER (USD $)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Nutrients & Spray ($)</label>
                          <input 
                            type="number" 
                            value={formState.econInputCost} 
                            onChange={(e) => handleFieldChange('econInputCost', Number(e.target.value))} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Coop Labor Costs ($)</label>
                          <input 
                            type="number" 
                            value={formState.econLaborCost} 
                            onChange={(e) => handleFieldChange('econLaborCost', Number(e.target.value))} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Transport Costs ($)</label>
                          <input 
                            type="number" 
                            value={formState.econTransportCost} 
                            onChange={(e) => handleFieldChange('econTransportCost', Number(e.target.value))} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-600">Packaging Boxes ($)</label>
                          <input 
                            type="number" 
                            value={formState.econPackagingCost} 
                            onChange={(e) => handleFieldChange('econPackagingCost', Number(e.target.value))} 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold" 
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 font-mono text-xs">
                        <div className="flex justify-between border-b border-slate-800 pb-1">
                          <span className="text-slate-400">Total Crop Expenses:</span>
                          <span className="font-bold">$ {totalCosts.toLocaleString()} USD</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1">
                          <span className="text-slate-400">Export Crop Revenue:</span>
                          <span className="font-bold text-emerald-400">$ {formState.econRevenue.toLocaleString()} USD</span>
                        </div>
                        <div className="flex justify-between text-sm pt-1">
                          <span>Computed Net Profit:</span>
                          <span className={`font-bold ${calculatedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            $ {calculatedProfit.toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CARBON & WATER FOOTPRINT CARD */}
                    <div className="border border-emerald-100 bg-emerald-50/20 p-5 rounded-xl space-y-4">
                      <h4 className="font-bold text-emerald-900 text-xs border-b border-emerald-100 pb-1 flex items-center gap-1.5 font-mono">
                        <Leaf size={13} className="text-emerald-600" /> CARBON SEQUESTRATION & ECO-MARKERS
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white border border-emerald-200 rounded-lg space-y-2">
                          <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wide block">Carbon Mitigation Pool</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold font-mono text-emerald-700">{co2Sequestration.toLocaleString()}</span>
                            <span className="text-xs text-emerald-600 font-bold">kg CO₂ / yr</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                            Calculated dynamically based on organic biomass density (est. average **21.8 kg CO₂** locked per mango tree per year). This meets global Scope 3 supply chain greenhouse standards for international buyers.
                          </p>
                        </div>

                        <div className="p-4 bg-white border border-emerald-200 rounded-lg space-y-2">
                          <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wide block">Eco-Water Conservation</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold font-mono text-blue-700">{formState.irrigationVolume || '0'}</span>
                            <span className="text-xs text-blue-600 font-bold">m³ total water</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                            Tracks the active water footprint of the plot during fruit development. Promotes drip systems over gravity flood canals.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* FORM FOOTER CONTROLS */}
          <div className="border-t border-slate-200 p-5 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => {
                const tabs: PilotSubTab[] = ['farmer', 'farm', 'plot', 'tree', 'operations', 'weather', 'harvest', 'sales', 'advanced'];
                const idx = tabs.indexOf(activeSubTab);
                if (idx > 0) setActiveSubTab(tabs[idx - 1]);
              }}
              disabled={activeSubTab === 'farmer'}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 text-slate-700"
            >
              Back
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer transition-all flex items-center gap-1.5"
                title="Export JSON record"
              >
                <Download size={13} />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleSaveToCloud}
                disabled={isLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Syncing Block...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save to Cloud Ledger</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                const tabs: PilotSubTab[] = ['farmer', 'farm', 'plot', 'tree', 'operations', 'weather', 'harvest', 'sales', 'advanced'];
                const idx = tabs.indexOf(activeSubTab);
                if (idx < tabs.length - 1) {
                  setActiveSubTab(tabs[idx + 1]);
                } else {
                  handleSaveToCloud();
                }
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <span>{activeSubTab === 'advanced' ? 'Commit Block' : 'Next'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: PASSPORT PRINT PREVIEW SHEET */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PASSPORT CONTAINER */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 font-mono">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">LEDGER STATE PREVIEW</span>
              </div>
              <button 
                onClick={() => window.print()}
                className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-500 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Printer size={11} />
                <span>Print PDF Report</span>
              </button>
            </div>

            <div id="mango-print-sheet" className="p-6 space-y-5 text-slate-800">
              
              {/* BRANDING HEADER */}
              <div className="border-b border-dashed border-slate-300 pb-4 text-center space-y-1">
                <h1 className="text-sm font-extrabold tracking-tight text-slate-900 font-mono uppercase">
                  AGRICULTURAL VERIFIED PASSPORT
                </h1>
                <p className="text-[9px] text-slate-500 font-sans tracking-wide uppercase">
                  MANGO EXPORT TRACEABILITY NETWORK • CAMBODIA GAP
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 text-[9px] rounded font-mono font-bold uppercase">
                    PROVENANCE BLOCK SECURED
                  </span>
                  <button
                    onClick={() => setIsPassportMasked(!isPassportMasked)}
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {isPassportMasked ? <Lock size={9} className="text-amber-600" /> : <Eye size={9} className="text-slate-500" />}
                    <span>{isPassportMasked ? 'Masked' : 'Unmasked'}</span>
                  </button>
                </div>
              </div>

              {/* LEVEL 1 & 2 HEADER INFOBAR */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-semibold uppercase">FARMER BIO:</span>
                  <span className="font-bold text-slate-900">
                    {isPassportMasked 
                      ? '🔒 [Private / Protected for Public]' 
                      : (formState.fullName || '(Please input name)')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1.5 font-mono">
                  <span className="text-slate-500 font-semibold uppercase font-sans">CO-OP ASSN:</span>
                  <span className="font-bold text-emerald-800 uppercase">{formState.cooperative || 'Kampong Speu Alliance'}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 font-semibold uppercase font-sans">GPS LOCATION:</span>
                  <span className="font-bold text-slate-700">
                    {isPassportMasked
                      ? `[Zone: ${formState.province || 'Cambodia'}] (Exact GPS Protected)`
                      : `${formState.gpsLatitude.toFixed(4)}, ${formState.gpsLongitude.toFixed(4)} (${formState.province})`}
                  </span>
                </div>
              </div>

              {/* CORE DYNAMIC KPIs */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-wider font-mono">Yield per Tree</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">{computedTreeYield}</span>
                  <span className="text-[8px] text-slate-500 block">kg / tree</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-wider font-mono">Yield Density</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">{Number(computedHaYield).toLocaleString()}</span>
                  <span className="text-[8px] text-slate-500 block">kg / hectare</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-wider font-mono">Scope 3 CO2 Pool</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">{co2Sequestration.toFixed(0)}</span>
                  <span className="text-[8px] text-slate-500 block">kg carbon / yr</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-wider font-mono">Cost per kg</span>
                  <span className="text-lg font-bold font-mono text-emerald-700">$ {costPerKg}</span>
                  <span className="text-[8px] text-slate-500 block">USD / kg yield</span>
                </div>
              </div>

              {/* CROP OPERATIONS CHECKLIST */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block font-mono border-b border-slate-200 pb-0.5">Auditable Process Stages</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${formState.pruningDate ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className="text-slate-500">Pruning Completed:</span>
                    <span className="font-bold ml-auto">{formState.pruningDate ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${formState.flowerInductionDate ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className="text-slate-500">Flower Induced:</span>
                    <span className="font-bold ml-auto">{formState.flowerInductionDate ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${formState.fertilizerName ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className="text-slate-500">NPK Certified:</span>
                    <span className="font-bold ml-auto">{formState.fertilizerName ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className={`w-1.5 h-1.5 rounded-full ${formState.pesticidePhiDays <= 14 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                    <span className="text-slate-500 font-sans">Pesticide PHI Check:</span>
                    <span className="font-bold ml-auto">{formState.pesticidePhiDays} d</span>
                  </div>
                </div>
              </div>

              {/* EXPORT GRADE DISTRIBUTION CHART */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block font-mono border-b border-slate-200 pb-0.5">Harvest Grade Distribution (%)</span>
                <div className="space-y-2 text-[10px]">
                  
                  {/* Grade A */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-bold text-emerald-800">Grade A (Export Ready)</span>
                      <span className="font-bold font-mono">{formState.harvestQty > 0 ? ((formState.gradeA / formState.harvestQty) * 100).toFixed(0) : '0'}% ({formState.gradeA} kg)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${formState.harvestQty > 0 ? (formState.gradeA / formState.harvestQty) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Grade B */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-bold text-blue-800">Grade B (Local Premium)</span>
                      <span className="font-bold font-mono">{formState.harvestQty > 0 ? ((formState.gradeB / formState.harvestQty) * 100).toFixed(0) : '0'}% ({formState.gradeB} kg)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${formState.harvestQty > 0 ? (formState.gradeB / formState.harvestQty) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  {/* Rejected */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-bold text-red-800">Rejected Waste / Mulched</span>
                      <span className="font-bold font-mono text-red-600">{rejectionRate}% ({formState.gradeRejected} kg)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full transition-all" style={{ width: `${formState.harvestQty > 0 ? (formState.gradeRejected / formState.harvestQty) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BUYER AND SHIPMENT INFORMATION */}
              <div className="space-y-2 bg-slate-900 text-white p-3 rounded-lg text-[10px] border border-slate-800 font-mono">
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wide block border-b border-slate-800 pb-1 font-sans">SHIPMENT & BUYER CONFIRMATION</span>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Buyer Corp:</span>
                    <span className="font-bold text-white uppercase">{formState.buyerName || '(Awaiting sales info)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Transit Vehicle:</span>
                    <span className="font-bold text-white">{formState.transportVehicle || 'Reefer Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Destination Target:</span>
                    <span className="font-bold text-emerald-300">{formState.transportDestination || 'Export Port'}</span>
                  </div>
                </div>
              </div>

              {/* BARCODE FOOTER */}
              <div className="pt-4 border-t border-dashed border-slate-300 flex flex-col items-center justify-center space-y-1.5 text-center">
                <div className="text-xs tracking-widest font-mono text-slate-800 font-bold select-none h-6 flex items-center bg-slate-100 px-3 py-1 rounded">
                  ||| | ||||| | || |||| | || | ||| {formState.harvestBatchId}
                </div>
                <span className="text-[8px] text-slate-500 font-mono">Traceability ID Block: {formState.id || 'Draft_Active'}</span>
              </div>

            </div>
          </div>

          {/* CLOUD SURVEY SYNC MONITOR / HISTORIC RECORDS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <RefreshCw size={12} className="text-emerald-600" /> SECURED CLOUD LEDGERS ({savedPilots.length})
              </h4>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                Active pilot surveys registered in your Firestore container
              </p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {savedPilots.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-mono block">No active cloud pilots yet.</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Click "Save to Cloud Ledger" above to sync your first interview.</span>
                </div>
              ) : (
                savedPilots.map((record) => (
                  <div 
                    key={record.id}
                    onClick={() => loadPreset(record)}
                    className={`flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 cursor-pointer font-mono text-[10px] transition duration-150 ${
                      formState.id === record.id ? 'bg-emerald-50/50 border-emerald-400' : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <span className="font-bold text-slate-900 block truncate">{record.title}</span>
                      <span className="text-slate-400 block text-[8px]">
                        Synced {new Date(record.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Verified</span>
                      <button 
                        onClick={(e) => handleDeleteRecord(record.id!, e)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
        </div>
      )}
    </div>
  );
}
