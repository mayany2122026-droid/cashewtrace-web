import React from 'react';
import { 
  Search, Filter, RotateCcw, CheckCircle2, 
  ArrowDownLeft, ArrowUpRight, Clock, CheckSquare, FileText,
  Tag, ChevronDown, Sparkles
} from 'lucide-react';
import { CategoryType, EntryType, SupportedLanguage } from '../types';
import { TIERS_CONFIG } from '../utils/tiers';
import { t } from '../utils/i18n';

interface BoxTabsProps {
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (cat: CategoryType | 'all') => void;
  selectedType: EntryType | 'all';
  onSelectType: (type: EntryType | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  lang: SupportedLanguage;
  sortOrder: 'desc' | 'asc';
  onToggleSortOrder: () => void;
  onClearData: () => void;
  onLoadSamples: () => void;
}

export const BoxTabs: React.FC<BoxTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  searchQuery,
  onSearchChange,
  lang,
}) => {
  const TYPE_TABS: { id: EntryType | 'all'; labelKey: string; icon: string }[] = [
    { id: 'all', labelKey: 'tabAll', icon: '✨' },
    { id: 'income', labelKey: 'tabIncome', icon: '🟢' },
    { id: 'expense', labelKey: 'tabExpense', icon: '🔴' },
    { id: 'reminder', labelKey: 'tabReminder', icon: '⏰' },
    { id: 'task', labelKey: 'tabTask', icon: '☑️' },
  ];

  const getTierLocalizedTitle = (tierId: string) => {
    switch (tierId) {
      case 'micro_business':
      case 'tier_msme':
        return t('tierMicroBiz', lang);
      case 'family_household':
      case 'tier_family':
        return t('tierFamilyHouse', lang);
      case 'farmer_agri':
      case 'tier_professional':
        return t('tierFarmerSupply', lang);
      case 'health_wellness':
      case 'tier_lifestyle':
        return t('tierHealthWellness', lang);
      default:
        return tierId;
    }
  };

  const getTierLocalizedDesc = (tierId: string) => {
    if (lang === 'nl') {
      switch (tierId) {
        case 'tier_msme':
        case 'micro_business':
          return 'Winkeliers, marktkramen, salons, groothandel en levering';
        case 'tier_family':
        case 'family_household':
          return 'Nutsvoorzieningen, boodschappen, huishoudelijke uitgaven';
        case 'tier_professional':
        case 'farmer_agri':
          return 'Artsen, apotheken, juristen, adviseurs en teams';
        case 'tier_lifestyle':
        case 'health_wellness':
          return 'Studenten, sport, reizen en dagelijkse notities';
        default:
          return '';
      }
    }
    if (lang === 'de') {
      switch (tierId) {
        case 'tier_msme':
        case 'micro_business':
          return 'Händler, Marktstände, Cafés, Großhandel und Lieferung';
        case 'tier_family':
        case 'family_household':
          return 'Nebenkosten, Lebensmittel, Haushaltsbudget';
        case 'tier_professional':
        case 'farmer_agri':
          return 'Ärzte, Apotheken, Berater und Partner';
        case 'tier_lifestyle':
        case 'health_wellness':
          return 'Studenten, Fitness, Reisen und Notizen';
        default:
          return '';
      }
    }
    if (lang === 'th') {
      switch (tierId) {
        case 'tier_msme':
        case 'micro_business':
          return 'พ่อค้าแม่ค้า ร้านกาแฟ ร้านของชำ และขนส่ง';
        case 'tier_family':
        case 'family_household':
          return 'ค่าไฟ ค่าน้ำ ของสด และการแจ้งเตือนยา';
        case 'tier_professional':
        case 'farmer_agri':
          return 'แพทย์ เภสัชกร ทนายความ และที่ปรึกษา';
        case 'tier_lifestyle':
        case 'health_wellness':
          return 'นักเรียน การออกกำลังกาย และบันทึกประจำวัน';
        default:
          return '';
      }
    }
    return '';
  };

  const getQuickTags = () => {
    if (lang === 'nl') {
      return [
        { label: 'Elektriciteit', query: 'stroom' },
        { label: 'Boodschappen', query: 'boodschappen' },
        { label: 'Verkoop', query: 'verkoop' },
        { label: 'Apotheek', query: 'medicijn' },
      ];
    }
    if (lang === 'de') {
      return [
        { label: 'Strom', query: 'strom' },
        { label: 'Einkauf', query: 'einkauf' },
        { label: 'Verkauf', query: 'verkauf' },
        { label: 'Apotheke', query: 'medizin' },
      ];
    }
    if (lang === 'th') {
      return [
        { label: 'ค่าไฟ', query: 'ค่าไฟ' },
        { label: 'ซื้อของสด', query: 'ของสด' },
        { label: 'ยอดขาย', query: 'ขาย' },
        { label: 'ค่ายา', query: 'ยา' },
      ];
    }
    if (lang === 'vi') {
      return [
        { label: 'Tiền điện', query: 'điện' },
        { label: 'Đi chợ', query: 'chợ' },
        { label: 'Bán hàng', query: 'bán' },
        { label: 'Thuốc men', query: 'thuốc' },
      ];
    }
    if (lang === 'km') {
      return [
        { label: 'ភ្លើង EDC', query: 'ភ្លើង' },
        { label: 'ម្ហូបផ្សារ', query: 'ម្ហូប' },
        { label: 'លក់ទំនិញ', query: 'លក់' },
        { label: 'ថ្នាំពេទ្យ', query: 'ថ្នាំ' },
      ];
    }
    return [
      { label: 'Electricity', query: 'electric' },
      { label: 'Groceries', query: 'grocery' },
      { label: 'Sales', query: 'sold' },
      { label: 'Pharmacy', query: 'medicine' },
    ];
  };

  return (
    <div className="space-y-4">
      
      {/* 4-Tier Socio-Economic Accordions & Selector Bar */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-800">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('socioEconomicTiersTitle', lang)}</span>
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              {t('showAllReset', lang)}
            </button>
          )}
        </div>

        {/* 4 Tier Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIERS_CONFIG.map((tier) => {
            const isSelected = tier.subcategories.includes(selectedCategory as any);
            return (
              <button
                key={tier.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : tier.subcategories[0])}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-black truncate mb-0.5">
                  <span>{tier.icon}</span>
                  <span className="truncate">{getTierLocalizedTitle(tier.id)}</span>
                </div>
                <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {getTierLocalizedDesc(tier.id) || (lang === 'km' ? tier.descriptionKm : tier.descriptionEn)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Filter Pills (Income, Expense, Reminder, Task, All) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedType === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{t(tab.labelKey, lang)}</span>
          </button>
        ))}
      </div>

      {/* Search Input & Quick Tag Buttons */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-3 shadow-2xs space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-entries-input"
            type="text"
            placeholder={t('searchPlaceholder', lang)}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Quick Tag Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{t('quickTagLabel', lang)}</span>
          </span>
          {getQuickTags().map((tag) => (
            <button
              key={tag.label}
              onClick={() => onSearchChange(searchQuery === tag.query ? '' : tag.query)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                searchQuery === tag.query
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {tag.label}
            </button>
          ))}

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[11px] font-bold text-rose-600 hover:underline ml-auto cursor-pointer"
            >
              {t('resetBtn', lang)}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
