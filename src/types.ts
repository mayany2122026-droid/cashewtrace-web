/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SourcingRecord {
  supplier_name: string;
  ct_id: string;
  quantity_kg: number;
  province: string;
  sale_destination: string;
}

export interface Batch {
  batch_id: string;
  total_input_kg: number;
  num_suppliers: number;
  origin_province: string;
  production_date_raw: number;
  product: string;
  product_name: string;
  output_kg: number;
  verified_by: string;
  verification_date_raw: number;
  status: 'VERIFIED' | 'UNVERIFIED';
  yield_percent: number;
  certification: string;
  moisture_percent: number | null;
  enterprise_name: string;
  enterprise_location: string;
  story: string;
  sourcing_records: SourcingRecord[];
}

export interface Supplier {
  'Supplier Name': string;
  'ST ID': string;
  Province: string;
  Ingredients: string;
  'National ID Number'?: number;
  'Date of Birth'?: number;
  Sex?: string;
  Group?: number;
  'Telephone Number'?: string;
  productName?: string;
  description?: string;
}

export interface InventoryRecord {
  date_raw: number;
  supplier_name: string | null;
  ct_id: string | null;
  quantity_kg: number;
  province: string | null;
  balance: number | null;
}

export interface StorySection {
  title_kh: string;
  title_en: string;
  kh: string;
  en: string;
}

export interface ContactInfo {
  phone: string;
  telegram: string;
  whatsapp: string;
  email: string;
  facebook: string;
  facebook_url: string;
  telegram_group?: string;
  telegram_group_url?: string;
  website?: string;
  website_url?: string;
  app_url?: string;
}

export interface CleanSheetData {
  suppliers: Supplier[];
  batches: Batch[];
  inventory: InventoryRecord[];
  story_sections: StorySection[];
  contact_info: ContactInfo;
}

export interface MangoPilotRecord {
  id?: string;
  title: string;
  timestamp: number;
  
  // Level 1: Farmer Profile
  farmerId: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  phone: string;
  address: string;
  cooperative: string;
  trainingReceived: string;
  gapStatus: 'Certified' | 'In Progress' | 'Not Certified';
  organicStatus: 'Certified' | 'In Progress' | 'Not Certified';
  familyMembers: number;
  laborAvailable: number;
  mainIncome: string;

  // Level 2: Farm Registration
  farmId: string;
  gpsLatitude: number;
  gpsLongitude: number;
  province: string;
  district: string;
  commune: string;
  village: string;
  farmArea: number;

  // Level 3: Plot Details
  plotId: string;
  plotSize: number;
  slope: 'Flat' | 'Gentle' | 'Steep';
  elevation: number;
  soilType: string;
  irrigationSource: string;
  waterAvailability: 'Year-round' | 'Seasonal' | 'Scarce';

  // Level 4: Tree Group & Variety
  variety: 'Keo Romeat' | 'Keo Chen' | 'Nam Dok Mai' | 'Irwin' | 'Other';
  treeGroupId: string;
  plantingDate: string;
  treeAge: number;
  rootstock: string;
  spacing: string;
  numTrees: number;
  treeHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  previousYield: number;
  currentYieldEstimate: number;
  yieldHistory: string;

  // Level 5: Farm Operations Log
  landPrepDate: string;
  landPrepActivity: string;
  landPrepLabor: number;
  plantingDateActual: string;
  seedlingSource: string;
  plantingQty: number;
  pruningDate: string;
  pruningTrees: number;
  pruningMethod: string;
  flowerInductionDate: string;
  flowerInductionMethod: string;
  flowerInductionMaterials: string;
  flowerInductionDosage: string;
  irrigationDate: string;
  irrigationSourceLog: string;
  irrigationVolume: number;
  fertilizerDate: string;
  fertilizerName: string;
  fertilizerNpk: string;
  fertilizerBatch: string;
  fertilizerQty: number;
  fertilizerCost: number;
  organicInputsType: string;
  organicInputsQty: number;

  // Pest & Disease
  pestObserveDate: string;
  pestIdentified: 'Fruit fly' | 'Thrips' | 'Mealybug' | 'Scale insect' | 'None';
  pestSeverity: 'Low' | 'Medium' | 'High';
  pestAffectedArea: number;
  diseaseObserveDate: string;
  diseaseIdentified: 'Anthracnose' | 'Powdery mildew' | 'Stem rot' | 'Sooty mold' | 'None';
  pesticideName: string;
  pesticideActiveIngredient: string;
  pesticideRegNumber: string;
  pesticideSupplier: string;
  pesticideBatch: string;
  pesticideDate: string;
  pesticideDosage: string;
  pesticideApplicator: string;
  pesticidePpeUsed: string;
  pesticidePhiDays: number;

  // Level 6: Weather & Climate
  weatherRainfall: number;
  weatherTemp: number;
  weatherHumidity: number;
  weatherSeasonalEvents: string;
  sustainabilityWaterUse: string;
  sustainabilitySoilConservation: string;
  sustainabilityBiodiversity: string;
  sustainabilityTreesPlanted: number;

  // Level 7: Harvest & Quality Grading
  harvestBatchId: string;
  harvestDate: string;
  harvestPlotId: string;
  harvestVariety: string;
  harvestQty: number;
  harvestCrates: number;
  harvestCrew: string;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeRejected: number;
  postWashing: boolean;
  postSorting: boolean;
  postPacking: boolean;
  postStorageTemp: number;
  postStorageHumidity: number;
  postStorageDuration: number;

  // Level 8: Marketing & Sales
  buyerId: string;
  buyerName: string;
  buyerType: 'Trader' | 'Exporter' | 'Processor' | 'Retailer';
  salesDate: string;
  salesBatchId: string;
  salesQty: number;
  salesPricePerKg: number;
  transportVehicle: string;
  transportDriver: string;
  transportDestination: string;
  transportDeliveryDate: string;

  // Advanced Module
  econInputCost: number;
  econLaborCost: number;
  econTransportCost: number;
  econPackagingCost: number;
  econRevenue: number;
  customNotes?: string;
}

export interface NutritionFacts {
  energyKcal: string;
  energyKj: string;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  cholesterol: string;
  sodium: string;
  totalCarb: string;
  dietaryFiber: string;
  totalSugars: string;
  addedSugars: string;
  protein: string;
  salt: string;
}

export type ContainerType = 
  | 'pp-jar-200g' 
  | 'pp-tub-150g'
  | 'pp-tub-500g'
  | 'pet-canister-300g'
  | 'standup-pouch-50g'
  | 'pouch-micro-35g'
  | 'pouch-snack-45g'
  | 'standup-pouch-100g'
  | 'standup-pouch-250g'
  | 'standup-pouch-500g'
  | 'standup-pouch-1kg'
  | 'kraft-pouch-250g'
  | 'vacuum-retort-250g'
  | 'vacuum-retort-500g'
  | 'glass-jar-180g'
  | 'glass-jar-350g' 
  | 'glass-jar-500g'
  | 'spice-jar-100g' 
  | 'tin-can-150g'
  | 'glass-bottle-250ml'
  | 'glass-bottle-500ml'
  | 'bulk-sack-5kg'
  | 'bulk-sack-10kg'
  | 'bulk-sack-20kg'
  | string;
