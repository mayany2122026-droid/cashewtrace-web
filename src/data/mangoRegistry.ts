import { MangoPilotRecord } from '../types';

export interface MangoFarmerRaw {
  id: string;
  name: string;
  zone: 'អូរដំបង' | 'ត្រកាំងប្រាសាទ';
  coop: string;
  product: string;
  code: string;
  area: number | null;
  trees: number | null;
  yield: number | null;
  phone: string;
  highlightName: boolean;
  highlightTrees: boolean;
  notes?: string;
}

export const MANGO_FARMERS_REGISTRY_RAW: MangoFarmerRaw[] = [
  { id: 'M-F-001', name: 'ហេង ពៅ', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង', product: 'ខុសរដូវ', code: 'កសិករ 001', area: 10, trees: 2500, yield: 150, phone: '071 977 7799', highlightName: false, highlightTrees: false },
  { id: 'M-F-002', name: 'ណុប ណុត្រ', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង', product: 'ខុសរដូវ', code: 'កសិករ 002', area: 5, trees: 1500, yield: 90, phone: '088 444 5586', highlightName: false, highlightTrees: false },
  { id: 'M-F-003', name: 'ហេង ធី', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង', product: 'ខុសរដូវ', code: 'កសិករ 003', area: 10, trees: 2000, yield: 120, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-004', name: 'អ៊ឹង ណយ', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង', product: 'ខុសរដូវ', code: 'កសិករ 004', area: 10, trees: 2500, yield: 150, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-005', name: 'ម៉ាន់ រស្មី', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង', product: 'ខុសរដូវ', code: 'កសិករ 005', area: 5, trees: 1000, yield: 60, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-006', name: 'នួន រិទ្ធី', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង', product: 'ខុសរដូវ', code: 'កសិករ 006', area: 5, trees: 2000, yield: 120, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-007', name: 'សុក វ៉ាត់', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មក្រាំងតាយ៉ង', product: 'ខុសរដូវ', code: 'កសិករ 007', area: null, trees: null, yield: null, phone: '', highlightName: true, highlightTrees: false, notes: 'Missing area & tree survey on paper' },
  { id: 'M-F-008', name: 'ហង្ស ច័ន្ទ', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 008', area: 1, trees: 200, yield: 12, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-009', name: 'ស្រី សុខគុម', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 009', area: 10, trees: 2000, yield: 120, phone: '066 307959', highlightName: false, highlightTrees: false },
  { id: 'M-F-010', name: 'យីន ណាង', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 010', area: 20, trees: 4000, yield: 240, phone: '097 7744664', highlightName: false, highlightTrees: false },
  { id: 'M-F-011', name: 'អៀ វ៉ាង', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 011', area: 10, trees: 2000, yield: 120, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-012', name: 'កែវ សឿន', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 012', area: 20, trees: 4000, yield: 240, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-013', name: 'ស៊ុក ចាន់នាគ', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 013', area: 6, trees: 1200, yield: 72, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-014', name: 'ស្រី ម៉េងយូរ', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មស្វាយចន្ទីឃុំអូរដំបង', product: 'ខុសរដូវ', code: 'កសិករ 014', area: 2, trees: 500, yield: 30, phone: '088 573 5693', highlightName: false, highlightTrees: false },
  { id: 'M-F-015', name: 'ឆឹង សំអូន', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មស្វាយចន្ទីឃុំអូរដំបង', product: 'ខុសរដូវ', code: 'កសិករ 015', area: 3, trees: 600, yield: 36, phone: '097 81 86 222', highlightName: false, highlightTrees: false },
  { id: 'M-F-016', name: 'សោម ស៊ុយ', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មស្វាយចន្ទីឃុំអូរដំបង', product: 'ខុសរដូវ', code: 'កសិករ 016', area: 2, trees: 500, yield: 30, phone: '097 47 67 951', highlightName: false, highlightTrees: false },
  { id: 'M-F-017', name: 'គង់ ណែម', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មស្វាយចន្ទីឃុំអូរដំបង', product: 'ខុសរដូវ', code: 'កសិករ 017', area: null, trees: null, yield: null, phone: '', highlightName: true, highlightTrees: false, notes: 'Missing area & tree survey on paper' },
  { id: 'M-F-018', name: 'សាត ធៀប', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មអូរដំបងមានជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 018', area: 11.3, trees: 2500, yield: 150, phone: '011 41 48 42', highlightName: false, highlightTrees: true, notes: 'Paper indicated 11.3ha with 2500 trees' },
  { id: 'M-F-019', name: 'អៀម ទ្រី', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មអូរដំបងមានជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 019', area: 5, trees: 1500, yield: 90, phone: '097 71 70 657', highlightName: false, highlightTrees: false },
  { id: 'M-F-020', name: 'ហួត លាងហាប់', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មអូរដំបងមានជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 020', area: 2, trees: 400, yield: 24, phone: '066 56 3336', highlightName: false, highlightTrees: false },
  { id: 'M-F-021', name: 'គង់ ម៉ិន', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មអូរដំបងមានជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 021', area: 2, trees: 500, yield: 30, phone: '088 3395 341', highlightName: false, highlightTrees: false },
  { id: 'M-F-022', name: 'ណុប លីណា', zone: 'អូរដំបង', coop: 'សហគមន៍កសិកម្មអូរដំបងមានជ័យ', product: 'ខុសរដូវ', code: 'កសិករ 022', area: 15, trees: 4000, yield: 240, phone: '090 811 633', highlightName: false, highlightTrees: true, notes: 'Paper survey flagged for high density verification' },
  { id: 'M-F-023', name: 'ម៉ី គួចញ៉ឺត', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មស្វាយចន្ទីឃុំត្រកាំងប្រាសាទ', product: 'ខុសរដូវ', code: 'កសិករ 023', area: 2, trees: 300, yield: 18, phone: '088 522 2251', highlightName: false, highlightTrees: false },
  { id: 'M-F-024', name: 'តូច មករា', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មស្វាយចន្ទីឃុំត្រកាំងប្រាសាទ', product: 'ខុសរដូវ', code: 'កសិករ 024', area: 10, trees: 2500, yield: 150, phone: '', highlightName: false, highlightTrees: false },
  { id: 'M-F-025', name: 'សូ អ៊ឹមសន្តិភាព', zone: 'ត្រកាំងប្រាសាទ', coop: 'សហគមន៍កសិកម្មស្វាយចន្ទីឃុំត្រកាំងប្រាសាទ', product: 'ខុសរដូវ', code: 'កសិករ 025', area: null, trees: null, yield: null, phone: '', highlightName: true, highlightTrees: false, notes: 'Missing area & tree survey on paper' }
];

export const mapRawFarmerToRecord = (raw: MangoFarmerRaw): MangoPilotRecord => {
  return {
    title: `Pilot: ${raw.name} (${raw.coop})`,
    timestamp: Date.now(),
    
    // Level 1: Farmer Profile
    farmerId: raw.id,
    fullName: raw.name,
    gender: 'Male',
    dob: '1982-04-12',
    phone: raw.phone || '',
    address: `${raw.zone}, ${raw.coop}, Cambodia`,
    cooperative: raw.coop,
    trainingReceived: 'GAP Standards, IPM Pesticide Training, Post-Harvest Packaging',
    gapStatus: raw.area ? 'Certified' : 'In Progress',
    organicStatus: 'Not Certified',
    familyMembers: 5,
    laborAvailable: 3,
    mainIncome: `Mango orchard harvest, ${raw.coop.includes('ស្វាយចន្ទី') ? 'Cashew nuts' : 'Crop trading'}`,

    // Level 2: Farm Registration
    farmId: `FARM-${raw.id.replace('M-F-', 'M-')}`,
    gpsLatitude: raw.zone === 'អូរដំបង' ? 13.0645 : 14.2381,
    gpsLongitude: raw.zone === 'អូរដំបង' ? 103.2215 : 104.1450,
    province: raw.zone === 'អូរដំបង' ? 'BATTAMBANG' : 'ODDAR MEANCHEY',
    district: raw.zone === 'អូរដំបង' ? 'Sangkae' : 'Trapeang Prasat',
    commune: raw.zone === 'អូរដំបង' ? "O'Dambang" : 'Trapeang Prasat',
    village: raw.zone === 'អូរដំបង' ? 'Krang Tayong' : 'Dong Tong',
    farmArea: raw.area || 0,

    // Level 3: Plot Details
    plotId: `PLOT-${raw.id.replace('M-F-', '')}-1`,
    plotSize: raw.area ? Number((raw.area * 0.8).toFixed(1)) : 0,
    slope: 'Flat',
    elevation: raw.zone === 'អូរដំបង' ? 15 : 120,
    soilType: raw.zone === 'អូរដំបង' ? 'Alluvial Clay Loam' : 'Red Basaltic Loam',
    irrigationSource: 'Well & Stream pump',
    waterAvailability: 'Year-round',

    // Level 4: Tree Group & Variety
    variety: 'Keo Romeat',
    treeGroupId: `TG-${raw.id.replace('M-F-', '')}`,
    plantingDate: '2017-05-20',
    treeAge: 9,
    rootstock: 'Native Local Seedling',
    spacing: '8m x 8m',
    numTrees: raw.trees || 0,
    treeHealth: 'Good',
    previousYield: raw.yield ? raw.yield * 1000 : 0,
    currentYieldEstimate: raw.yield ? raw.yield * 1100 : 0,
    yieldHistory: raw.yield ? `2024: ${(raw.yield * 0.85).toFixed(0)}t, 2025: ${(raw.yield * 0.95).toFixed(0)}t` : '',

    // Level 5: Farm Operations Log
    landPrepDate: '2026-03-05',
    landPrepActivity: 'Shallow ploughing, organic compost application',
    landPrepLabor: 4,
    plantingDateActual: '2017-05-25',
    seedlingSource: 'Cooperative Nursery',
    plantingQty: raw.trees || 0,
    pruningDate: '2026-04-10',
    pruningTrees: raw.trees || 0,
    pruningMethod: 'Light structural pruning',
    flowerInductionDate: '2026-05-15',
    flowerInductionMethod: 'Safe spraying',
    flowerInductionMaterials: 'Certified induction compound',
    flowerInductionDosage: '100g / 100L',
    irrigationDate: '2026-05-20',
    irrigationSourceLog: 'Piped surface irrigation',
    irrigationVolume: raw.area ? raw.area * 15 : 0,
    fertilizerDate: '2026-04-12',
    fertilizerName: 'GAP Approved Compound Fertilizer',
    fertilizerNpk: '15-15-15',
    fertilizerBatch: 'B-FERT-904',
    fertilizerQty: raw.trees ? raw.trees * 2 : 0,
    fertilizerCost: raw.trees ? raw.trees * 1.5 : 0,
    organicInputsType: 'Organic cow compost',
    organicInputsQty: raw.trees ? raw.trees * 5 : 0,

    // Pest & Disease
    pestObserveDate: '2026-05-28',
    pestIdentified: 'Thrips',
    pestSeverity: 'Low',
    pestAffectedArea: raw.area ? Number((raw.area * 0.1).toFixed(1)) : 0,
    diseaseObserveDate: '2026-05-28',
    diseaseIdentified: 'None',
    pesticideName: 'Safe Neem Extract Soap',
    pesticideActiveIngredient: 'Azadirachtin',
    pesticideRegNumber: 'KH-PEST-2026-088',
    pesticideSupplier: 'Coop Agri Supply Depot',
    pesticideBatch: 'N-SOAP-22',
    pesticideDate: '2026-06-02',
    pesticideDosage: '150ml / 100L',
    pesticideApplicator: raw.name,
    pesticidePpeUsed: 'Goggles, face mask, rubber boots',
    pesticidePhiDays: 14,

    // Level 6: Weather & Climate
    weatherRainfall: 140,
    weatherTemp: 33,
    weatherHumidity: 78,
    weatherSeasonalEvents: 'Normal climate cycle',
    sustainabilityWaterUse: 'Scheduled pumping',
    sustainabilitySoilConservation: 'Rice straw cover mulching',
    sustainabilityBiodiversity: 'Natural hedge windbreaks',
    sustainabilityTreesPlanted: 15,

    // Level 7: Harvest & Quality Grading
    harvestBatchId: `H-MNG-${raw.id.replace('M-F-', '')}`,
    harvestDate: '2026-06-25',
    harvestPlotId: `PLOT-${raw.id.replace('M-F-', '')}-1`,
    harvestVariety: 'Keo Romeat',
    harvestQty: raw.yield ? raw.yield * 1000 : 0,
    harvestCrates: raw.yield ? Math.ceil((raw.yield * 1000) / 25) : 0,
    harvestCrew: `${raw.name} & family`,
    gradeA: raw.yield ? Math.floor(raw.yield * 700) : 0,
    gradeB: raw.yield ? Math.floor(raw.yield * 200) : 0,
    gradeC: raw.yield ? Math.floor(raw.yield * 80) : 0,
    gradeRejected: raw.yield ? Math.floor(raw.yield * 20) : 0,
    postWashing: true,
    postSorting: true,
    postPacking: true,
    postStorageTemp: 13.5,
    postStorageHumidity: 85,
    postStorageDuration: 12,

    // Level 8: Marketing & Sales
    buyerId: 'BUYER-EX-808',
    buyerName: 'Angkor Mango Fresh Exporters Ltd.',
    buyerType: 'Exporter',
    salesDate: '2026-06-28',
    salesBatchId: `BATCH-SALE-${raw.id.replace('M-F-', '')}`,
    salesQty: raw.yield ? raw.yield * 900 : 0,
    salesPricePerKg: 0.85,
    transportVehicle: 'Refrigerated 5-ton Truck',
    transportDriver: 'Sok Vichea',
    transportDestination: 'Phnom Penh Export Sorting Hub',
    transportDeliveryDate: '2026-06-29',

    // Advanced Economics
    econInputCost: raw.trees ? raw.trees * 2.8 : 0,
    econLaborCost: raw.trees ? raw.trees * 1.5 : 0,
    econTransportCost: raw.yield ? raw.yield * 15 : 0,
    econPackagingCost: raw.yield ? raw.yield * 20 : 0,
    econRevenue: raw.yield ? raw.yield * 900 * 0.85 : 0,
    customNotes: `Synchronized from Cambodian Mango Registry Record [${raw.code} - ${raw.coop}]. Area: ${raw.area || 0} ha, Trees: ${raw.trees || 0}, Off-season yield: ${raw.yield || 0} t.`
  };
};
