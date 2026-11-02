export type SupportedLanguage = 
  | 'en'
  | 'en-US'
  | 'en-GB'
  | 'ko'
  | 'km'
  | 'vi'
  | 'th'
  | 'id'
  | 'ms'
  | 'bn'
  | 'my'
  | 'zh'
  | 'fr'
  | 'de'
  | 'es'
  | 'it'
  | 'nl'
  | 'pt';

export type EntryType = 'income' | 'expense' | 'reminder' | 'task' | 'note' | 'debt';


export type CategoryType = 
  | 'msme' 
  | 'family' 
  | 'health' 
  | 'meeting' 
  | 'training' 
  | 'travel' 
  | 'tasks' 
  | 'notes' 
  | 'business'
  | 'others' 
  | string;

export interface CustomCategory {
  id: string;
  nameKm: string;
  nameEn: string;
  icon: string;
  color: string;
  activeBg: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phoneNumber: string;
  role: 'founder' | 'user' | 'msme';
  avatar: string;
  trialDaysLeft?: number;
  businessCategory?: string;
}

export interface BasketItem {
  name: string;
  quantity?: number;
  unit?: string;
  price: number;
  currency: string;
}

export interface Entry {
  id: string;
  userId: string;
  category: CategoryType;
  type: EntryType;
  titleKhmer: string;
  titleEnglish: string;
  amount?: number;
  currency?: 'USD' | 'KHR' | 'THB' | 'VND' | 'EUR' | string;
  date: string;
  reminderTime?: string;
  personName?: string;
  items?: string[];
  basketBreakdown?: BasketItem[];
  notes?: string;
  isCompleted: boolean;
  rawVoiceTranscript?: string;
  confidenceScore?: number;
  isSynced?: boolean;
  debtStatus?: 'owed' | 'settled';
  isLaborLog?: boolean;
  laborRecordId?: string;
}

export interface HelperStaff {
  id: string;
  name: string;
  phone?: string;
  role: string;
  monthlySalary?: number;
  dailyWage?: number;
  currency: 'USD' | 'KHR' | string;
  startDate?: string;
  notes?: string;
  isActive: boolean;
}

export interface LaborLogRecord {
  id: string;
  helperId: string;
  helperName: string;
  type: 'salary' | 'advance' | 'bonus' | 'absence' | 'overtime' | 'half_day';
  amount?: number;
  currency?: 'USD' | 'KHR' | string;
  date: string;
  month?: string;
  notes?: string;
  reason?: string;
  deductedFromSalary?: boolean;
  recordedViaVoice?: boolean;
  rawVoiceTranscript?: string;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber?: string;
  relation?: string;
  notes?: string;
  totalOwed?: number;
  isFavorite?: boolean;
}

export interface CategorizeResult {
  category: CategoryType;
  type: EntryType;
  titleKhmer: string;
  titleEnglish: string;
  amount?: number;
  currency?: 'USD' | 'KHR' | 'THB' | 'VND' | 'EUR' | string;
  reminderTime?: string;
  personName?: string;
  items?: string[];
  basketBreakdown?: BasketItem[];
  notes?: string;
  isLaborLog?: boolean;
  laborLogType?: 'salary' | 'advance' | 'bonus' | 'absence' | 'overtime' | 'half_day';
  laborRecordId?: string;
  confidenceScore?: number;
}

export interface CurrencyConfig {
  primaryCurrency: 'USD' | 'KHR' | 'EUR' | 'VND' | 'THB' | string;
  secondaryCurrency: 'USD' | 'KHR' | 'EUR' | 'VND' | 'THB' | string;
  secondaryCurrencySymbol: string;
  secondaryCurrencyName: string;
  exchangeRateMode: 'nbc' | 'market' | 'custom';
  usdToKhrRate: number; // e.g. 4030
  usdToSecondaryRate: number;
  lastUpdated: string;
  sourceLabel: string;
  allowFluctuation: boolean;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  date: string;
  notes?: string;
}

export interface CreditDebtRecord {
  id: string;
  contactName: string;
  contactPhone?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: 'USD' | 'KHR' | string;
  debtType: 'customer_owes_me' | 'i_owe_supplier';
  itemsOrDescription: string;
  dueDate?: string;
  createdAt: string;
  status: 'unpaid' | 'partial' | 'paid';
  paymentHistory?: PaymentRecord[];
}

export interface TierConfig {
  id: string;
  titleKm: string;
  titleEn: string;
  icon: string;
  descriptionKm: string;
  descriptionEn: string;
  badgeColor: string;
  subcategories: CategoryType[];
  templates: {
    titleKm: string;
    titleEn: string;
    scriptKm: string;
    scriptEn: string;
    category: CategoryType;
    type: EntryType;
  }[];
}

export interface ScheduleConfig {
  morningTime: string; // e.g. "05:00" or "07:00"
  eveningTime: string; // e.g. "21:00" or "18:00"
  telegramAlertsEnabled: boolean;
  lastEveningRecapDate?: string;
  lastMorningBriefingDate?: string;
}

