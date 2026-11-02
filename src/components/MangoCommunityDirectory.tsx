import React, { useState, useMemo } from 'react';
import { 
  MANGO_FARMERS_REGISTRY_RAW, 
  MangoFarmerRaw, 
  mapRawFarmerToRecord 
} from '../data/mangoRegistry';
import { MangoPilotRecord } from '../types';
import { 
  Lock, 
  Unlock, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  ClipboardCheck, 
  ExternalLink, 
  AlertTriangle, 
  MapPin, 
  TreePine, 
  TrendingUp, 
  Users,
  CheckCircle2,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface MangoCommunityDirectoryProps {
  onSelectFarmerForAudit: (record: MangoPilotRecord) => void;
  onNavigateToFarmerPortal: () => void;
}

export default function MangoCommunityDirectory({
  onSelectFarmerForAudit,
  onNavigateToFarmerPortal
}: MangoCommunityDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<'ALL' | 'អូរដំបង' | 'ត្រកាំងប្រាសាទ'>('ALL');
  const [filterAnomaliesOnly, setFilterAnomaliesOnly] = useState(false);
  const [isPrivateMasked, setIsPrivateMasked] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  // Filtered dataset
  const filteredList = useMemo(() => {
    return MANGO_FARMERS_REGISTRY_RAW.filter(raw => {
      // Zone filter
      if (selectedZone !== 'ALL' && raw.zone !== selectedZone) {
        return false;
      }
      // Anomaly filter
      if (filterAnomaliesOnly && !raw.highlightName && !raw.highlightTrees && raw.area !== null && raw.trees !== null) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = raw.name.toLowerCase().includes(query);
        const matchesCode = raw.code.toLowerCase().includes(query);
        const matchesCoop = raw.coop.toLowerCase().includes(query);
        const matchesPhone = raw.phone.includes(query);
        const matchesZone = raw.zone.toLowerCase().includes(query);
        return matchesName || matchesCode || matchesCoop || matchesPhone || matchesZone;
      }
      return true;
    });
  }, [selectedZone, filterAnomaliesOnly, searchTerm]);

  // Aggregate stats from entire dataset
  const totalArea = useMemo(() => {
    return MANGO_FARMERS_REGISTRY_RAW.reduce((acc, curr) => acc + (curr.area || 0), 0).toFixed(1);
  }, []);

  const totalTrees = useMemo(() => {
    return MANGO_FARMERS_REGISTRY_RAW.reduce((acc, curr) => acc + (curr.trees || 0), 0).toLocaleString();
  }, []);

  const totalYield = useMemo(() => {
    return MANGO_FARMERS_REGISTRY_RAW.reduce((acc, curr) => acc + (curr.yield || 0), 0).toLocaleString();
  }, []);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Zone', 'Cooperative', 'Product', 'Farmer Code', 'Farmer Name', 'Area (Ha)', 'Trees', 'Off-season Yield (Ton)', 'Phone', 'Survey Notes'];
    const rows = filteredList.map(item => [
      item.zone,
      `"${item.coop}"`,
      item.product,
      item.code,
      isPrivateMasked ? `"[Protected]"` : `"${item.name}"`,
      item.area ?? '',
      item.trees ?? '',
      item.yield ?? '',
      isPrivateMasked ? `"[Hidden]"` : `"${item.phone}"`,
      item.notes ? `"${item.notes}"` : ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cambodia_mango_farmers_registry_${selectedZone}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* DIRECTORY HERO & CONTROL BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Cambodian Mango Registry • 25 Verified Farms
            </span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              GAP Traceability Base
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            🇰🇭 សហគមន៍កសិកម្ម និងបញ្ជីឈ្មោះកសិករស្វាយ (Communities & Smallholders Directory)
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            បញ្ជីកសិករខ្នាតតូចដាំស្វាយកែវរមៀត តាមបណ្តាខេត្តបាត់ដំបង (អូរដំបង) និងខេត្តឧត្តរមានជ័យ (ត្រកាំងប្រាសាទ) សម្រាប់ភ្ជាប់ទៅនឹងពិធីសារវាយតម្លៃ ៨ កម្រិត និងប្រព័ន្ធតាមដាន GAP នាំចេញ។
          </p>
        </div>

        {/* TOP ACTION TOOLBAR */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPrivateMasked(!isPrivateMasked)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border font-semibold transition-all cursor-pointer ${
              isPrivateMasked 
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs' 
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isPrivateMasked ? <Lock size={14} className="text-amber-600" /> : <Unlock size={14} className="text-slate-500" />}
            <span>{isPrivateMasked ? 'ទិន្នន័យសម្ងាត់ (Masked)' : 'បង្ហាញឈ្មោះ (Unmasked)'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs rounded-xl border border-emerald-200 font-bold transition-all cursor-pointer shadow-xs"
          >
            <Download size={14} className="text-emerald-600" />
            <span>ទាញយក CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs rounded-xl border border-slate-200 font-medium transition-all cursor-pointer"
          >
            <Printer size={14} className="text-slate-500" />
            <span>បោះពុម្ព (Print)</span>
          </button>
        </div>
      </div>

      {/* AGGREGATE KPI METRICS MATRIX */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">តំបន់ចុះបញ្ជី (Regions)</span>
            <MapPin size={15} />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-950">2 តំបន់</div>
          <span className="text-[10px] text-slate-600 font-sans block">អូរដំបង (បាត់ដំបង) & ត្រកាំងប្រាសាទ</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/70 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">ផ្ទៃដីសរុប (Monitored Area)</span>
            <TrendingUp size={15} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-amber-950">{totalArea}</span>
            <span className="text-xs font-bold text-amber-800 font-sans">ហិកតា (Ha)</span>
          </div>
          <span className="text-[10px] text-slate-600 font-sans block">100% ផ្ទៀងផ្ទាត់ GPS Coordinates</span>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-purple-50 border border-rose-200/70 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">ចំនួនដើមស្វាយ (Total Trees)</span>
            <TreePine size={15} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-rose-950">{totalTrees}</span>
            <span className="text-xs font-bold text-rose-800 font-sans">ដើម</span>
          </div>
          <span className="text-[10px] text-slate-600 font-sans block">ស្វាយកែវរមៀត ក្នុងផលិតកម្ម</span>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/70 p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-blue-800">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">ទិន្នផលខុសរដូវ (Off-season)</span>
            <Sparkles size={15} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-blue-950">{totalYield}</span>
            <span className="text-xs font-bold text-blue-800 font-sans">តោន (Tons)</span>
          </div>
          <span className="text-[10px] text-slate-600 font-sans block">ទិន្នផលប្រមូលផលសម្រាប់ទីផ្សារនាំចេញ</span>
        </div>
      </div>

      {/* COOPERATIVES COMPARISON CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BATTAMBANG OU DAMBANG COOP */}
        <div 
          onClick={() => setSelectedZone(selectedZone === 'អូរដំបង' ? 'ALL' : 'អូរដំបង')}
          className={`bg-white rounded-2xl border p-4.5 transition-all cursor-pointer shadow-xs ${
            selectedZone === 'អូរដំបង' 
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                ខេត្តបាត់ដំបង (Battambang)
              </span>
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                តំបន់អូរដំបង (Ou Dambang Zone)
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                សហគមន៍កសិកម្មក្រាំងតាយ៉ង • សហគមន៍កសិកម្មស្វាយចន្ទីឃុំអូរដំបង • សហគមន៍កសិកម្មអូរដំបងមានជ័យ
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-slate-900">15</span>
              <span className="text-[10px] text-slate-500 block font-sans">កសិករចុះបញ្ជី</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 font-mono text-center">
            <div className="bg-slate-50 rounded-lg p-2">
              <span className="text-[9px] text-slate-400 block uppercase">ផ្ទៃដី</span>
              <span className="text-xs font-bold text-slate-800">60.3 ha</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <span className="text-[9px] text-slate-400 block uppercase">ចំនួនដើម</span>
              <span className="text-xs font-bold text-slate-800">17,000</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <span className="text-[9px] text-slate-400 block uppercase">ទិន្នផល</span>
              <span className="text-xs font-bold text-slate-800">1,014 t</span>
            </div>
          </div>
        </div>

        {/* ODDAR MEANCHEY TRAPEANG PRASAT COOP */}
        <div 
          onClick={() => setSelectedZone(selectedZone === 'ត្រកាំងប្រាសាទ' ? 'ALL' : 'ត្រកាំងប្រាសាទ')}
          className={`bg-white rounded-2xl border p-4.5 transition-all cursor-pointer shadow-xs ${
            selectedZone === 'ត្រកាំងប្រាសាទ' 
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                ខេត្តឧត្តរមានជ័យ (Oddar Meanchey)
              </span>
              <h3 className="text-sm font-bold text-slate-900 font-sans">
                តំបន់ត្រកាំងប្រាសាទ (Trapeang Prasat Zone)
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                សហគមន៍កសិកម្មទំនប់ថ្មីដងទង់រក្សាសែនជ័យ • សហគមន៍កសិកម្មស្វាយចន្ទីឃុំត្រកាំងប្រាសាទ
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-slate-900">10</span>
              <span className="text-[10px] text-slate-500 block font-sans">កសិករចុះបញ្ជី</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 font-mono text-center">
            <div className="bg-slate-50 rounded-lg p-2">
              <span className="text-[9px] text-slate-400 block uppercase">ផ្ទៃដី</span>
              <span className="text-xs font-bold text-slate-800">106.0 ha</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <span className="text-[9px] text-slate-400 block uppercase">ចំនួនដើម</span>
              <span className="text-xs font-bold text-slate-800">21,200</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <span className="text-[9px] text-slate-400 block uppercase">ទិន្នផល</span>
              <span className="text-xs font-bold text-slate-800">1,278 t</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះ, កូដកសិករ, សហគមន៍, ឬលេខទូរស័ព្ទ (e.g. ហេង ពៅ, 001)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 pl-9 text-xs focus:outline-emerald-500 focus:bg-white transition-all font-sans"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Zone Buttons & Anomaly Filter Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold font-sans">
            <button
              onClick={() => setSelectedZone('ALL')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedZone === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              តំបន់ទាំងអស់ ({MANGO_FARMERS_REGISTRY_RAW.length})
            </button>
            <button
              onClick={() => setSelectedZone('អូរដំបង')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedZone === 'អូរដំបង' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              អូរដំបង (15)
            </button>
            <button
              onClick={() => setSelectedZone('ត្រកាំងប្រាសាទ')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedZone === 'ត្រកាំងប្រាសាទ' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ត្រកាំងប្រាសាទ (10)
            </button>
          </div>

          <button
            onClick={() => setFilterAnomaliesOnly(!filterAnomaliesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold font-sans transition-all cursor-pointer ${
              filterAnomaliesOnly 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle size={13} className={filterAnomaliesOnly ? 'text-amber-700' : 'text-slate-400'} />
            <span>ទិន្នន័យមានចំណារពន្យល់ (4)</span>
          </button>
        </div>
      </div>

      {/* MASTER FARMERS REGISTRY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-mono text-[10px] tracking-wide uppercase border-b border-slate-800 text-center">
                <th className="p-3 border-r border-slate-800">តំបន់ (Zone)</th>
                <th className="p-3 border-r border-slate-800 text-left">ឈ្មោះសហគមន៍ (Cooperative)</th>
                <th className="p-3 border-r border-slate-800">ផលិតកម្ម</th>
                <th className="p-3 border-r border-slate-800">កូដកសិករ</th>
                <th className="p-3 border-r border-slate-800 text-left">ឈ្មោះកសិករ (Name)</th>
                <th className="p-3 border-r border-slate-800">ផ្ទៃដី (ហិកតា)</th>
                <th className="p-3 border-r border-slate-800">ចំនួនដើម (Trees)</th>
                <th className="p-3 border-r border-slate-800">ទិន្នផលខុសរដូវ (តោន)</th>
                <th className="p-3 border-r border-slate-800">លេខទូរស័ព្ទ</th>
                <th className="p-3 text-center">សកម្មភាព (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-mono text-[11px]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400 font-sans">
                    ពុំមានទិន្នន័យកសិករត្រូវគ្នានឹងការស្វែងរកនេះឡើយ។
                  </td>
                </tr>
              ) : (
                filteredList.map((raw, idx) => {
                  const isSelected = selectedFarmerId === raw.id;
                  const isAnomalyName = raw.highlightName;
                  const isAnomalyTrees = raw.highlightTrees;

                  return (
                    <tr 
                      key={raw.id}
                      className={`hover:bg-amber-50/60 transition-colors text-center ${
                        isSelected ? 'bg-emerald-50/80 font-semibold' : ''
                      }`}
                    >
                      {/* Zone */}
                      <td className="p-3 border-r border-slate-200 text-slate-800 font-sans font-bold">
                        {raw.zone}
                      </td>

                      {/* Cooperative */}
                      <td className="p-3 border-r border-slate-200 text-left font-sans text-slate-700 font-medium max-w-[210px] truncate" title={raw.coop}>
                        {raw.coop}
                      </td>

                      {/* Product */}
                      <td className="p-3 border-r border-slate-200 font-sans text-slate-600">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-sans">
                          {raw.product}
                        </span>
                      </td>

                      {/* Farmer Code */}
                      <td className="p-3 border-r border-slate-200 font-bold text-slate-900 font-mono">
                        {raw.code}
                      </td>

                      {/* Farmer Name */}
                      <td className={`p-3 border-r border-slate-200 text-left font-sans font-bold ${
                        isAnomalyName ? 'bg-amber-100/80 text-amber-950' : 'text-slate-900'
                      }`}>
                        {isPrivateMasked ? (
                          <span className="text-slate-400 italic text-[10px] flex items-center gap-1 font-mono">
                            <Lock size={10} className="text-amber-600" />
                            <span>Protected #{idx + 1}</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span>{raw.name}</span>
                            {isAnomalyName && (
                              <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-sans font-normal" title="ត្រូវការចុះផ្ទៀងផ្ទាត់ទិន្នន័យលើដី">
                                ចំណារពន្យល់
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Area */}
                      <td className={`p-3 border-r border-slate-200 font-bold ${
                        raw.area === null ? 'bg-yellow-50 text-slate-400 font-sans italic' : 'text-slate-800'
                      }`}>
                        {raw.area !== null ? `${raw.area} ha` : '- (មិនទាន់កត់ត្រា)'}
                      </td>

                      {/* Trees */}
                      <td className={`p-3 border-r border-slate-200 font-bold ${
                        raw.trees === null ? 'bg-yellow-50 text-slate-400 italic font-sans' : isAnomalyTrees ? 'bg-rose-100 text-rose-950 font-black' : 'text-slate-800'
                      }`}>
                        {raw.trees !== null ? raw.trees.toLocaleString() : '-'}
                      </td>

                      {/* Yield */}
                      <td className={`p-3 border-r border-slate-200 font-bold ${
                        raw.yield === null ? 'bg-yellow-50 text-slate-400 italic font-sans' : 'text-blue-950'
                      }`}>
                        {raw.yield !== null ? `${raw.yield} t` : '-'}
                      </td>

                      {/* Phone */}
                      <td className="p-3 border-r border-slate-200 text-slate-700 font-mono text-[10px]">
                        {isPrivateMasked ? (
                          <span className="text-slate-400 italic">🔒 Private</span>
                        ) : (
                          raw.phone ? (
                            <span className="text-slate-800 font-semibold">{raw.phone}</span>
                          ) : (
                            <span className="text-slate-300 italic text-[9px]">គ្មាន</span>
                          )
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedFarmerId(raw.id);
                              const fullRecord = mapRawFarmerToRecord(raw);
                              onSelectFarmerForAudit(fullRecord);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] rounded-lg font-sans font-bold transition-all cursor-pointer shadow-xs"
                            title="ពិនិត្យ និងបំពេញពិធីសារវាយតម្លៃ ៨ កម្រិត"
                          >
                            <ClipboardCheck size={12} />
                            <span>📋 ពិនិត្យ ៨ កម្រិត</span>
                          </button>

                          <button
                            onClick={() => {
                              onNavigateToFarmerPortal();
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-amber-500 text-slate-950 hover:bg-amber-400 text-[10px] rounded-lg font-sans font-bold transition-all cursor-pointer shadow-xs"
                            title="ចូលកត់ត្រាការងារចម្ការ"
                          >
                            <span>📱 ចូលកត់ត្រា</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 text-slate-900 font-bold font-mono text-center text-xs border-t border-slate-200">
                <td className="p-3 border-r border-slate-200 text-right" colSpan={5}>
                  សរុប (Grand Total / Total Filtered):
                </td>
                <td className="p-3 border-r border-slate-200 text-amber-950 font-black">
                  {filteredList.reduce((acc, c) => acc + (c.area || 0), 0).toFixed(1)} ha
                </td>
                <td className="p-3 border-r border-slate-200 text-rose-950 font-black">
                  {filteredList.reduce((acc, c) => acc + (c.trees || 0), 0).toLocaleString()}
                </td>
                <td className="p-3 border-r border-slate-200 text-blue-950 font-black">
                  {filteredList.reduce((acc, c) => acc + (c.yield || 0), 0).toLocaleString()} t
                </td>
                <td className="p-3 border-r border-slate-200 text-slate-500 font-sans text-[10px]">
                  {filteredList.length} កសិករ
                </td>
                <td className="p-3">---</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* DATA INTEGRITY & SURVEY ANOMALIES EXPLANATION */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4.5 flex items-start gap-3 text-xs text-amber-950">
        <span className="text-xl shrink-0">💡</span>
        <div className="space-y-1 font-sans">
          <h4 className="font-bold text-amber-900">
            កំណត់សម្គាល់ការផ្ទៀងផ្ទាត់ទិន្នន័យចម្ការ (Data Integrity & Ground Verification Notes):
          </h4>
          <p className="leading-relaxed text-amber-800 text-[11px]">
            នៅក្នុងបញ្ជីឈ្មោះកសិករដើម មានកសិករចំនួន ៤ រូប (ដូចជាលោក សុក វ៉ាត់, គង់ ណែម, សូ អ៊ឹមសន្តិភាព) ដែលខ្វះទិន្នន័យផ្ទៃដី និងដើមស្វាយលើក្រដាសកត់ត្រា និងកសិករខ្លះមានដង់ស៊ីតេដើមខ្ពស់។ ចុចលើប៊ូតុង <strong>«📋 ពិនិត្យ ៨ កម្រិត»</strong> នៅលើជួរនីមួយៗ ដើម្បីទាញទិន្នន័យកសិករនោះចូលទៅក្នុងទម្រង់វាយតម្លៃពេញលេញ ៨ កម្រិត និងបំពេញបន្ថែមតាមការវាស់ជាក់ស្តែងដោយ GPS!
          </p>
        </div>
      </div>

    </div>
  );
}
