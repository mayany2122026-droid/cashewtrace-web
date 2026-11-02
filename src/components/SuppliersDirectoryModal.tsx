import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
import cleanSheetRaw from '../data/clean_sheet_data.json';
import { saveSupplierToFirestore, subscribeToSuppliers } from '../lib/firebaseService';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Plus, 
  Check, 
  Search, 
  X, 
  ShieldCheck, 
  Tag, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function formatSupplierBadgeTitle(supplier: Supplier): string {
  const name = (supplier['Supplier Name'] || '').toUpperCase();
  if (name.includes('MYRARTH') || name.includes('MIRARTH')) {
    return 'Mirarth Agri Tech Co., Ltd.';
  }
  if (name.includes('KAMPONG SPEU SUGAR') || name.includes('ANGKOR SUGAR')) {
    return 'Angkor Sugar (ស្ករសចម្រាញ់សុទ្ធ)';
  }
  if (name.includes('BOH')) {
    return 'BOH Co., Ltd. (ម្រេចខ្មៅកំពត GI)';
  }
  if (name.includes('NGOV HENG')) {
    return 'Ngov Heng (អំបិលសមុទ្រកំពត)';
  }
  if (name.includes('TL AGRI')) {
    return 'TL Agri Food Import Export Co., Ltd. (គ្រាប់ស្វាយចន្ទី)';
  }
  if (name.includes('RINGACAM')) {
    return 'Ringacam Enterprise (ម្សៅម្ទេស G.D.G)';
  }
  
  const shortName = supplier['Supplier Name']?.trim() || 'Supplier';
  const prod = supplier.productName?.trim() || supplier.Ingredients?.trim() || 'Raw Material';
  return `${shortName} (${prod})`;
}

interface SuppliersDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSupplier?: (supplierText: string) => void;
  onSelectSupplierIngredient?: (ingredientText: string) => void;
  isKhmer?: boolean;
}

export default function SuppliersDirectoryModal({
  isOpen,
  onClose,
  onSelectSupplier,
  onSelectSupplierIngredient,
  isKhmer = true
}: SuppliersDirectoryModalProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const defaultSuppliers = (cleanSheetRaw as any).suppliers || [];
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('cashewtrace_custom_suppliers');
        if (cached) {
          const parsed = JSON.parse(cached);
          const merged = [...defaultSuppliers];
          for (const item of parsed) {
            if (!merged.some(s => s['ST ID'] === item['ST ID'])) {
              merged.push(item);
            }
          }
          return merged;
        }
      } catch (e) {
        console.warn('Could not load custom suppliers:', e);
      }
    }
    return defaultSuppliers;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvince, setFilterProvince] = useState('ALL');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Supplier Form State
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newIngredients, setNewIngredients] = useState('');
  const [newProvince, setNewProvince] = useState('កំពង់ធំ (Kampong Thom)');
  const [newPhone, setNewPhone] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Subscribe to live Firestore suppliers
  useEffect(() => {
    try {
      const unsubscribe = subscribeToSuppliers((liveList) => {
        if (liveList && liveList.length > 0) {
          setSuppliers(prev => {
            const merged = [...liveList];
            for (const item of prev) {
              if (!merged.some(m => m['ST ID'] === item['ST ID'])) {
                merged.push(item);
              }
            }
            return merged;
          });
        }
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    } catch (e) {
      console.warn('Could not subscribe to suppliers:', e);
    }
  }, []);

  if (!isOpen) return null;

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = 
      (s['Supplier Name'] || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.Ingredients || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.Province || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvince = filterProvince === 'ALL' || s.Province.toUpperCase().includes(filterProvince.toUpperCase());
    return matchesSearch && matchesProvince;
  });

  const handleAddNewSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName.trim()) return;

    setIsSaving(true);
    const traceId = `CT-${String(suppliers.length + 1).padStart(3, '0')}`;
    const cleanProvince = newProvince.split(' ')[0] || newProvince;

    const newSupplierObj: Supplier = {
      'Supplier Name': newSupplierName.trim().toUpperCase(),
      'ST ID': traceId,
      Province: cleanProvince.toUpperCase(),
      Ingredients: newIngredients.trim() || newProductName.trim() || 'AGRI PRODUCT',
      'Telephone Number': newPhone.trim() || '+855 23 888 999',
      productName: newProductName.trim() || newSupplierName.trim(),
      description: newDescription.trim() || 'Verified Cambodian agricultural supplier compliant with food safety standards.'
    };

    try {
      // 1. Save to Firestore
      await saveSupplierToFirestore(newSupplierObj);
    } catch (err) {
      console.warn('Firestore write fallback to local storage:', err);
    }

    // 2. Update local state and localStorage
    const updated = [newSupplierObj, ...suppliers];
    setSuppliers(updated);
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('cashewtrace_custom_suppliers');
        const customList = cached ? JSON.parse(cached) : [];
        customList.push(newSupplierObj);
        localStorage.setItem('cashewtrace_custom_suppliers', JSON.stringify(customList));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
    }

    setIsSaving(false);
    setSaveSuccessMsg(isKhmer ? `✓ បានចុះឈ្មោះអ្នកផ្គត់ផ្គង់ "${newSupplierName}" ដោយជោគជ័យ!` : `✓ Supplier "${newSupplierName}" registered successfully!`);
    
    // Reset Form
    setNewSupplierName('');
    setNewProductName('');
    setNewIngredients('');
    setNewPhone('');
    setNewDescription('');
    setIsAddingNew(false);

    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-xs">
              🌾
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-sans tracking-wide">
                {isKhmer ? 'បញ្ជីអ្នកផ្គត់ផ្គង់ និងវត្ថុធាតុដើមដែលបានផ្ទៀងផ្ទាត់' : 'Verified Suppliers & Sourcing Partners'}
              </h3>
              <p className="text-xs text-amber-100 font-sans">
                {isKhmer 
                  ? 'តភ្ជាប់ប្រភពដើម និងស្តង់ដារគុណភាពសម្រាប់ផលិតផលម៉ាយ៉ានី' 
                  : 'Audited supply chain partners, raw ingredients & food safety origins'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isKhmer ? "ស្វែងរកតាមឈ្មោះក្រុមហ៊ុន ផលិតផល ឬខេត្ត..." : "Search supplier, product, or province..."}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <select
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 cursor-pointer focus:border-amber-500 focus:outline-hidden"
            >
              <option value="ALL">{isKhmer ? 'គ្រប់ខេត្ត (All Provinces)' : 'All Provinces'}</option>
              <option value="KAMPONG THOM">កំពង់ធំ (Kampong Thom)</option>
              <option value="PHNOM PENH">ភ្នំពេញ (Phnom Penh)</option>
              <option value="KAMPOT">កំពត (Kampot)</option>
              <option value="KAMPONG SPEU">កំពង់ស្ពឺ (Kampong Speu)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition shrink-0"
          >
            <Plus size={14} />
            <span>{isAddingNew ? (isKhmer ? 'បិទផ្ទាំងបញ្ចូល' : 'Cancel Form') : (isKhmer ? '+ បន្ថែមអ្នកផ្គត់ផ្គង់ថ្មី' : '+ Add New Supplier')}</span>
          </button>
        </div>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body: Scrollable */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Add New Supplier Form Drawer */}
          {isAddingNew && (
            <form onSubmit={handleAddNewSupplier} className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <Plus size={14} className="text-amber-600" />
                  <span>{isKhmer ? 'ចុះឈ្មោះអ្នកផ្គត់ផ្គង់វត្ថុធាតុដើមថ្មី' : 'Register New Agricultural Supplier'}</span>
                </h4>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  AUTO TRACE ID
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isKhmer ? 'ឈ្មោះក្រុមហ៊ុន / សហគ្រាសផ្គត់ផ្គង់ *' : 'Supplier Company / Enterprise Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newSupplierName}
                    onChange={(e) => setNewSupplierName(e.target.value)}
                    placeholder="ឧ. MYRARTH AGRI TECH CO., LTD."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isKhmer ? 'ឈ្មោះផលិតផល (Product Name)' : 'Product Name'}
                  </label>
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="ឧ. Ngov Heng / Angkor Sugar / G.D.G / Cashew Nut"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isKhmer ? 'ប្រភេទវត្ថុធាតុដើម (Raw Material / Ingredient)' : 'Ingredient / Material'}
                  </label>
                  <input
                    type="text"
                    value={newIngredients}
                    onChange={(e) => setNewIngredients(e.target.value)}
                    placeholder="ឧ. គ្រាប់ស្វាយចន្ទី Grade BB / អំបិលសមុទ្រ / ម្សៅម្ទេស"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isKhmer ? 'ខេត្ត / រាជធានី (Province / Location)' : 'Province'}
                  </label>
                  <select
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden bg-white cursor-pointer"
                  >
                    <option value="កំពង់ធំ (Kampong Thom)">កំពង់ធំ (Kampong Thom)</option>
                    <option value="ភ្នំពេញ (Phnom Penh)">ភ្នំពេញ (Phnom Penh)</option>
                    <option value="កំពត (Kampot)">កំពត (Kampot)</option>
                    <option value="កំពង់ស្ពឺ (Kampong Speu)">កំពង់ស្ពឺ (Kampong Speu)</option>
                    <option value="បាត់ដំបង (Battambang)">បាត់ដំបង (Battambang)</option>
                    <option value="សៀមរាប (Siem Reap)">សៀមរាប (Siem Reap)</option>
                    <option value="មណ្ឌលគិរី (Mondulkiri)">មណ្ឌលគិរី (Mondulkiri)</option>
                    <option value="រតនគិរី (Ratanakiri)">រតនគិរី (Ratanakiri)</option>
                    <option value="ព្រះវិហារ (Preah Vihear)">ព្រះវិហារ (Preah Vihear)</option>
                    <option value="ក្រចេះ (Kratie)">ក្រចេះ (Kratie)</option>
                    <option value="ស្ទឹងត្រែង (Stung Treng)">ស្ទឹងត្រែង (Stung Treng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isKhmer ? 'លេខទូរស័ព្ទទំនាក់ទំនង (Phone Number)' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+855 88 771 2862"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isKhmer ? 'ការពិពណ៌នាស្តង់ដារគុណភាព & អនាម័យ (Quality & Food Safety Description)' : 'Quality Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="បញ្ជាក់ពីគុណភាព សុវត្ថិភាពចំណីអាហារ គ្មានសារធាតុគីមី ឬវិធីសាស្ត្រផលិត..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 outline-hidden text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  {isKhmer ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (isKhmer ? 'កំពុងរក្សាទុក...' : 'Saving...') : (isKhmer ? 'រក្សាទុកអ្នកផ្គត់ផ្គង់' : 'Save Supplier')}
                </button>
              </div>
            </form>
          )}

          {/* Supplier Cards Grid */}
          <div className="space-y-3">
            {filteredSuppliers.map((supplier, idx) => {
              const isSpecialSourced = 
                supplier['Supplier Name'].includes('MYRARTH') ||
                supplier['Supplier Name'].includes('TL AGRI') ||
                supplier['Supplier Name'].includes('NGOV HENG') ||
                supplier['Supplier Name'].includes('KAMPONG SPEU') ||
                supplier['Supplier Name'].includes('BOH') ||
                supplier['Supplier Name'].includes('RINGACAM');

              return (
                <div
                  key={supplier['ST ID'] || idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSpecialSourced 
                      ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400 hover:shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 shrink-0">
                          {supplier['ST ID']}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-950 font-sans tracking-tight">
                          {supplier['Supplier Name']}
                        </h4>
                        {supplier.productName && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-sans">
                            🏷️ {supplier.productName}
                          </span>
                        )}
                      </div>

                      {/* Ingredients & Location details */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-1 font-semibold text-amber-900">
                          <Tag size={13} className="text-amber-600" />
                          <span>{supplier.Ingredients}</span>
                        </div>
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin size={13} className="text-slate-400" />
                          <span>{supplier.Province}</span>
                        </div>
                        {supplier['Telephone Number'] && (
                          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                            <Phone size={12} className="text-slate-400" />
                            <span>{supplier['Telephone Number']}</span>
                          </div>
                        )}
                      </div>

                      {/* Quality & Traceability description */}
                      {supplier.description && (
                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans bg-white/80 p-2.5 rounded-xl border border-amber-200/60 mt-2">
                          <span className="font-bold text-amber-950">{isKhmer ? 'ស្តង់ដារគុណភាព ៖ ' : 'Quality Note: '}</span>
                          {supplier.description}
                        </p>
                      )}
                    </div>

                    {/* Apply Button */}
                    {(onSelectSupplier || onSelectSupplierIngredient) && (
                      <button
                        type="button"
                        onClick={() => {
                          const formatted = formatSupplierBadgeTitle(supplier);
                          if (onSelectSupplier) {
                            onSelectSupplier(formatted);
                          } else if (onSelectSupplierIngredient) {
                            onSelectSupplierIngredient(formatted);
                          }
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs self-start transition active:scale-95"
                        title={isKhmer ? 'ជ្រើសរើសជាអ្នកផ្គត់ផ្គង់ផ្លូវការ' : 'Select as official supplier'}
                      >
                        <Plus size={13} />
                        <span>{isKhmer ? 'ជ្រើសរើស' : 'Select'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredSuppliers.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                {isKhmer ? 'មិនមានអ្នកផ្គត់ផ្គង់ដែលត្រូវនឹងការស្វែងរកនេះទេ។' : 'No suppliers found matching your query.'}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="font-bold text-slate-800">
              {isKhmer 
                ? `ដៃគូផ្គត់ផ្គង់សរុប៖ ${suppliers.length} សហគ្រាស (CS 001 & EUDR Compliant)` 
                : `Total Registered Suppliers: ${suppliers.length}`}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition shadow-2xs"
          >
            {isKhmer ? 'រួចរាល់' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
}
