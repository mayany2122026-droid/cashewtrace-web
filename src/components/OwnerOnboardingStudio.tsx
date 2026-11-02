/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Lock, Unlock, UserCheck, Building, Leaf, 
  QrCode, Printer, Download, Sparkles, CheckCircle2, ArrowRight, 
  MapPin, Phone, Mail, Presentation, Globe, Plus, AlertCircle,
  Layers, Package, Check, RefreshCw, LogOut, FileText
} from 'lucide-react';
import CashewTraceLogo, { CashewTraceIcon } from './CashewTraceLogo';

interface OwnerOnboardingStudioProps {
  onOpenPitchDeck?: () => void;
  onNavigateSector: (tab: 'passport' | 'map' | 'inventory' | 'mango' | 'admin' | 'mayany' | 'social' | 'farmer' | 'packaging') => void;
  onLogout: () => void;
}

interface OnboardedFarmer {
  id: string;
  nameKh: string;
  nameEn: string;
  phone: string;
  province: string;
  district: string;
  cropVariety: string;
  farmAreaHa: number;
  treesCount: number;
  gpsCoords: string;
  eudrStatus: 'VERIFIED' | 'PENDING';
  createdDate: string;
}

interface OnboardedMSME {
  id: string;
  enterpriseName: string;
  contactPerson: string;
  phone: string;
  productName: string;
  packagingWeight: string;
  cs001Status: 'COMPLIANT' | 'REVIEW';
  barcode: string;
  batchCode: string;
  createdDate: string;
}

export default function OwnerOnboardingStudio({
  onOpenPitchDeck,
  onNavigateSector,
  onLogout
}: OwnerOnboardingStudioProps) {
  const [activeSubTab, setActiveSubTab] = useState<'farmers' | 'msmes' | 'presentation' | 'sandbox'>('farmers');

  // Farmer Onboarding Form State
  const [farmerNameKh, setFarmerNameKh] = useState('');
  const [farmerNameEn, setFarmerNameEn] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerProvince, setFarmerProvince] = useState('កំពង់ធំ (Kampong Thom)');
  const [farmerDistrict, setFarmerDistrict] = useState('ប្រាសាទសំបូរ (Prasat Sambour)');
  const [cropVariety, setCropVariety] = useState('គ្រាប់ស្វាយចន្ទីពូជ M23 (Cashew M23)');
  const [farmArea, setFarmArea] = useState('3.5');
  const [gpsLat, setGpsLat] = useState('12.7915');
  const [gpsLng, setGpsLng] = useState('105.0210');
  const [eudrCompliant, setEudrCompliant] = useState(true);

  // List of Onboarded Farmers during this demo session
  const [onboardedFarmers, setOnboardedFarmers] = useState<OnboardedFarmer[]>([
    {
      id: 'CT-FARM-2026-081',
      nameKh: 'សាន ប៊ុនលី',
      nameEn: 'San Bunly',
      phone: '+855 12 889 102',
      province: 'កំពង់ធំ (Kampong Thom)',
      district: 'ប្រាសាទសំបូរ (Prasat Sambour)',
      cropVariety: 'M23 Elite Variety',
      farmAreaHa: 4.2,
      treesCount: 680,
      gpsCoords: '12.7915° N, 105.0210° E',
      eudrStatus: 'VERIFIED',
      createdDate: '2026-08-28'
    },
    {
      id: 'CT-FARM-2026-082',
      nameKh: 'ខៀវ ស្រីពៅ',
      nameEn: 'Khiev Sreypov',
      phone: '+855 97 554 321',
      province: 'ក្រចេះ (Kratie)',
      district: 'ស្នួល (Snuol)',
      cropVariety: 'H09 Cashew Variety',
      farmAreaHa: 2.8,
      treesCount: 450,
      gpsCoords: '12.2850° N, 106.3210° E',
      eudrStatus: 'VERIFIED',
      createdDate: '2026-08-28'
    }
  ]);

  const [activeFarmerCard, setActiveFarmerCard] = useState<OnboardedFarmer | null>(onboardedFarmers[0]);

  // MSME Onboarding Form State
  const [msmeName, setMsmeName] = useState('');
  const [msmeOwner, setMsmeOwner] = useState('');
  const [msmePhone, setMsmePhone] = useState('');
  const [productName, setProductName] = useState('គ្រាប់ស្វាយចន្ទីលីងអំបិល (Salted Roasted Cashews)');
  const [packagingType, setPackagingType] = useState('កំប៉ុង PP Tub 200g (PP Jar 200g)');
  const [onboardedMSMEs, setOnboardedMSMEs] = useState<OnboardedMSME[]>([
    {
      id: 'CT-SME-2026-01',
      enterpriseName: 'Mayany Enterprise (CashewTrace Demonstration Unit)',
      contactPerson: 'Mrs. Mayany SAM',
      phone: '+855 61 734 415',
      productName: 'Roasted Cashew Kernels with Sea Salt',
      packagingWeight: '200g PP Container',
      cs001Status: 'COMPLIANT',
      barcode: '8841234567890',
      batchCode: 'CT-2026-BN-09',
      createdDate: '2026-08-28'
    }
  ]);
  const [activeMsmePreview, setActiveMsmePreview] = useState<OnboardedMSME | null>(onboardedMSMEs[0]);

  // Sandbox Traceability Demo State
  const [sandboxStep, setSandboxStep] = useState(1);

  const handleRegisterFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerNameKh.trim()) return;

    const newId = `CT-FARM-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newFarmer: OnboardedFarmer = {
      id: newId,
      nameKh: farmerNameKh,
      nameEn: farmerNameEn || farmerNameKh,
      phone: farmerPhone || '+855 61 734 415',
      province: farmerProvince,
      district: farmerDistrict,
      cropVariety: cropVariety,
      farmAreaHa: parseFloat(farmArea) || 2.5,
      treesCount: Math.round((parseFloat(farmArea) || 2.5) * 160),
      gpsCoords: `${gpsLat}° N, ${gpsLng}° E`,
      eudrStatus: eudrCompliant ? 'VERIFIED' : 'PENDING',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setOnboardedFarmers([newFarmer, ...onboardedFarmers]);
    setActiveFarmerCard(newFarmer);
    setFarmerNameKh('');
    setFarmerNameEn('');
    setFarmerPhone('');
  };

  const handleRegisterMSME = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msmeName.trim()) return;

    const newMsme: OnboardedMSME = {
      id: `CT-SME-2026-${Math.floor(10 + Math.random() * 90)}`,
      enterpriseName: msmeName,
      contactPerson: msmeOwner || 'Enterprise Representative',
      phone: msmePhone || '+855 61 734 415',
      productName: productName,
      packagingWeight: packagingType,
      cs001Status: 'COMPLIANT',
      barcode: `884${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      batchCode: `CT-2026-BN-${Math.floor(10 + Math.random() * 90)}`,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setOnboardedMSMEs([newMsme, ...onboardedMSMEs]);
    setActiveMsmePreview(newMsme);
    setMsmeName('');
    setMsmeOwner('');
    setMsmePhone('');
  };

  const handleFillDemoCoords = () => {
    const coords = [
      { lat: '12.7915', lng: '105.0210', prov: 'កំពង់ធំ (Kampong Thom)', dist: 'ប្រាសាទសំបូរ (Prasat Sambour)' },
      { lat: '12.2850', lng: '106.3210', prov: 'ក្រចេះ (Kratie)', dist: 'ស្នួល (Snuol)' },
      { lat: '13.7380', lng: '106.9850', prov: 'រតនគិរី (Ratanakiri)', dist: 'អូរជុំ (Ou Chum)' },
      { lat: '11.9920', lng: '105.4630', prov: 'កំពង់ចាម (Kampong Cham)', dist: 'ចំការលើ (Chamkar Leu)' },
    ];
    const pick = coords[Math.floor(Math.random() * coords.length)];
    setGpsLat(pick.lat);
    setGpsLng(pick.lng);
    setFarmerProvince(pick.prov);
    setFarmerDistrict(pick.dist);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Owner Workspace Banner with Privacy Status */}
      <section className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Unlock size={14} className="text-amber-400" />
                <span>DEMONSTRATION & ONBOARDING STUDIO</span>
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono">
                Authenticated: mayany@mayanyenterprise.com
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
              ផ្ទាំងគ្រប់គ្រងសម្រាប់ធ្វើបទបង្ហាញ និងចុះឈ្មោះកសិករ/សហគ្រាស
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
              លោកអ្នកស្ថិតក្នុង <strong>Owner Workspace</strong> ផ្ទាល់ខ្លួន។ ផ្ទាំងនេះត្រូវបានរៀបចំសម្រាប់ធ្វើបទបង្ហាញ (Demo) ទៅកាន់ម្ចាស់ចម្ការ (Farm Owners) និងសហគ្រាសកែច្នៃ (MSMEs)។ ព័ត៌មានឯកជនទាំងអស់ត្រូវបានការពារ ហើយមិនបង្ហាញជាសាធារណៈឡើយ។
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenPitchDeck && (
              <button
                onClick={onOpenPitchDeck}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Presentation size={16} />
                <span>បើក Pitch Deck (9 Slides)</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-900/40 hover:bg-rose-800/60 border border-rose-500/40 text-rose-200 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
              title="Return to Public View"
            >
              <LogOut size={15} />
              <span>ចាកចេញ & ចាក់សោរសាធារណៈ (Lock)</span>
            </button>
          </div>
        </div>

        {/* Privacy Shield Notice Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={16} className="shrink-0" />
            <span><strong>Privacy Shield Active:</strong> សាធារណជនមិនអាចមើលឃើញទិន្នន័យចុះឈ្មោះ និងគម្រោងខាងក្នុងនេះឡើយ។</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">CashewTrace v2.6 • Secure Sandbox</span>
        </div>
      </section>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('farmers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'farmers'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <UserCheck size={16} />
          <span>👨‍🌾 ចុះឈ្មោះម្ចាស់ចម្ការ (Farm Owners Onboarding)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('msmes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'msmes'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <Building size={16} />
          <span>🏭 ចុះឈ្មោះសហគ្រាស (MSMEs CS 001 Onboarding)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('presentation')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'presentation'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <Presentation size={16} />
          <span>📊 មគ្គុទ្ទេសក៍បទបង្ហាញ (Pitch & Slides Kit)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sandbox')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'sandbox'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:bg-white'
          }`}
        >
          <Layers size={16} />
          <span>🔄 សាកល្បងខ្សែច្រវាក់កសិផល (Traceability Sandbox)</span>
        </button>
      </div>

      {/* 3. Tab Content 1: Farm Owners Onboarding */}
      {activeSubTab === 'farmers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input Form for Live Onboarding */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <Plus size={14} />
                <span>LIVE FARMER ONBOARDING</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                ចុះបញ្ជីកសិករ និងកំណត់ត្រាដីចម្ការ (Register Farm Owner)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                បំពេញទិន្នន័យដើម្បីបង្កើតកាតឌីជីថល (Digital Farmer Passport) ភ្លាមៗក្នុងពេលធ្វើបទបង្ហាញ៖
              </p>
            </div>

            <form onSubmit={handleRegisterFarmer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះកសិករ (ខ្មែរ) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. សាន ប៊ុនលី"
                    value={farmerNameKh}
                    onChange={(e) => setFarmerNameKh(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name in Latin (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. San Bunly"
                    value={farmerNameEn}
                    onChange={(e) => setFarmerNameEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">លេខទូរស័ព្ទ / Phone</label>
                  <input
                    type="text"
                    placeholder="+855 12 345 678"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ពូជស្វាយចន្ទី / Variety</label>
                  <select
                    value={cropVariety}
                    onChange={(e) => setCropVariety(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
                  >
                    <option value="គ្រាប់ស្វាយចន្ទីពូជ M23 (Cashew M23)">M23 (Elite High Yield)</option>
                    <option value="គ្រាប់ស្វាយចន្ទីពូជ H09 (Cashew H09)">H09 (Large Nut Quality)</option>
                    <option value="ពូជប្រពៃណីកំពង់ធំ (Traditional Local)">Traditional Local Variety</option>
                    <option value="ស្វាយកែវរមៀត (Keo Romeat Mango)">Keo Romeat Mango</option>
                    <option value="ម្រេចសរីរាង្គ (Organic Pepper)">Organic Pepper / Spices</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ខេត្ត / Province</label>
                  <select
                    value={farmerProvince}
                    onChange={(e) => setFarmerProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
                  >
                    <option value="កំពង់ធំ (Kampong Thom)">កំពង់ធំ (Kampong Thom)</option>
                    <option value="ក្រចេះ (Kratie)">ក្រចេះ (Kratie)</option>
                    <option value="រតនគិរី (Ratanakiri)">រតនគិរី (Ratanakiri)</option>
                    <option value="កំពង់ចាម (Kampong Cham)">កំពង់ចាម (Kampong Cham)</option>
                    <option value="មណ្ឌលគិរី (Mondulkiri)">មណ្ឌលគិរី (Mondulkiri)</option>
                    <option value="ព្រះវិហារ (Preah Vihear)">ព្រះវិហារ (Preah Vihear)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ទំហំដីចម្ការ (ហិកតា) / Area (Ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={farmArea}
                    onChange={(e) => setFarmArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600 font-mono"
                  />
                </div>
              </div>

              {/* GPS Coordinates & Quick Demo Generator */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-700" />
                    <span>កូអរដោនេដីចម្ការ GPS (Polygon Plot Point)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleFillDemoCoords}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw size={11} />
                    <span>បំពេញកូអរដោនេស្វ័យប្រវត្តិ (Sample GPS)</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-mono">Latitude (N)</label>
                    <input
                      type="text"
                      value={gpsLat}
                      onChange={(e) => setGpsLat(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-mono">Longitude (E)</label>
                    <input
                      type="text"
                      value={gpsLng}
                      onChange={(e) => setGpsLng(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="eudr-check"
                  checked={eudrCompliant}
                  onChange={(e) => setEudrCompliant(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="eudr-check" className="text-xs text-slate-700 cursor-pointer">
                  ផ្ទៀងផ្ទាត់មិនកាប់បំផ្លាញព្រៃឈើ (EUDR Non-Deforestation Compliance Verified)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <QrCode size={16} />
                <span>ចុះឈ្មោះ & បង្កើតកាតឌីជីថល (Generate Digital Passport)</span>
              </button>
            </form>
          </div>

          {/* Right: Live Digital Farmer Passport & List */}
          <div className="lg:col-span-6 space-y-6">
            {activeFarmerCard && (
              <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white p-6 sm:p-7 rounded-3xl border border-emerald-500/40 shadow-xl space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <CashewTraceLogo className="h-8 brightness-150" />
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-300 block">
                        FARMER TRACEABILITY PASSPORT
                      </span>
                      <h3 className="text-xs font-bold text-white">កាតឌីជីថលកសិករគំរូ</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono text-[10px] font-bold">
                    {activeFarmerCard.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center relative z-10">
                  {/* Farmer Info */}
                  <div className="sm:col-span-2 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">ឈ្មោះកសិករ / FARMER NAME</span>
                      <h4 className="text-lg font-bold text-white leading-tight">
                        {activeFarmerCard.nameKh}
                      </h4>
                      <p className="text-xs text-emerald-300 font-mono">{activeFarmerCard.nameEn}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">ទីតាំងដីចម្ការ / LOCATION</span>
                        <span className="text-slate-200 font-medium">{activeFarmerCard.province}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">ទំហំដី / FARM AREA</span>
                        <span className="text-slate-200 font-bold font-mono">{activeFarmerCard.farmAreaHa} Hectares</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">ពូជកសិផល / VARIETY</span>
                        <span className="text-slate-200 font-medium">{activeFarmerCard.cropVariety}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">EUDR STATUS</span>
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>PASSED & VERIFIED</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                      <MapPin size={13} className="text-rose-400" />
                      <span>{activeFarmerCard.gpsCoords}</span>
                    </div>
                  </div>

                  {/* Generated Traceability QR Code */}
                  <div className="bg-white p-3.5 rounded-2xl flex flex-col items-center justify-center text-slate-950 space-y-2 shadow-lg">
                    <div className="w-28 h-28 bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white relative">
                      <QrCode size={90} className="text-white" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white border-2 border-white shadow-sm font-bold text-xs">
                          CT
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider text-center">
                      SCAN FOR GPS LEDGER
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-500/30 flex items-center justify-between text-xs text-slate-300">
                  <span className="text-[11px]">ចេញដោយ៖ CashewTrace Platform</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer size={12} />
                      <span>បោះពុម្ពកាត (Print)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List of registered farmers */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                  បញ្ជីកសិករដែលបានចុះឈ្មោះក្នុងវគ្គនេះ ({onboardedFarmers.length})
                </h4>
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready for Presentation
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {onboardedFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    onClick={() => setActiveFarmerCard(farmer)}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${
                      activeFarmerCard?.id === farmer.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        🌾
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{farmer.nameKh} ({farmer.nameEn})</div>
                        <div className="text-[11px] text-slate-500 font-mono">{farmer.province} • {farmer.farmAreaHa} Ha</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 block">
                        {farmer.id}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{farmer.cropVariety}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab Content 2: MSMEs CS 001:2000 Onboarding */}
      {activeSubTab === 'msmes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input Form for MSME Onboarding */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-700 uppercase tracking-wider mb-1">
                <Plus size={14} />
                <span>LIVE MSME ONBOARDING</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                ចុះឈ្មោះសហគ្រាស និងរៀបចំស្លាក CS 001 (Register MSME)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                បង្កើតស្លាកសញ្ញាស្តង់ដារជាតិ CS 001:2000 និងបាកូដ EAN-13 សម្រាប់សហគ្រាសកែច្នៃ៖
              </p>
            </div>

            <form onSubmit={handleRegisterMSME} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះសហគ្រាសកែច្នៃ / Enterprise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="ឧ. សហគ្រាស ម៉ាយ៉ានី អេនធើប្រាយ (Mayany Enterprise)"
                  value={msmeName}
                  onChange={(e) => setMsmeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ម្ចាស់សហគ្រាស / Representative</label>
                  <input
                    type="text"
                    placeholder="ឈ្មោះអ្នកតំណាង"
                    value={msmeOwner}
                    onChange={(e) => setMsmeOwner(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ទូរស័ព្ទ / Phone</label>
                  <input
                    type="text"
                    placeholder="+855 61 734 415"
                    value={msmePhone}
                    onChange={(e) => setMsmePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-purple-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">មុខទំនិញ / Product</label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-purple-600"
                  >
                    <option value="គ្រាប់ស្វាយចន្ទីលីងអំបិល (Salted Roasted Cashews)">គ្រាប់ស្វាយចន្ទីលីងអំបិល (Salted Roasted)</option>
                    <option value="គ្រាប់ស្វាយចន្ទីសរីរាង្គកំប៉ុង (Organic Cashew Canister)">គ្រាប់ស្វាយចន្ទីសរីរាង្គកំប៉ុង</option>
                    <option value="ដំណាប់ស្វាយធម្មជាតិ (Natural Dried Mango)">ដំណាប់ស្វាយធម្មជាតិ (Dried Mango)</option>
                    <option value="ម្រេចកំពតខ្មៅកែច្នៃ (Black Kampot Pepper)">ម្រេចកំពតខ្មៅកែច្នៃ (Kampot Pepper)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ទម្ងន់វេចខ្ចប់ / Packaging Weight</label>
                  <select
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-purple-600"
                  >
                    <option value="កំប៉ុង PP Tub 200g (PP Jar 200g)">កំប៉ុង PP Tub 200g</option>
                    <option value="កញ្ចប់ Standup Pouch 100g">កញ្ចប់ Pouch 100g</option>
                    <option value="កញ្ចប់ Standup Pouch 250g">កញ្ចប់ Pouch 250g</option>
                    <option value="កញ្ចប់ Vacuum Retort 500g">កញ្ចប់ Retort 500g</option>
                  </select>
                </div>
              </div>

              {/* CS 001:2000 Checklist */}
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-purple-700" />
                  <span>ស្តង់ដារ CS 001:2000 ដែលប្រព័ន្ធរៀបចំដោយស្វ័យប្រវត្តិ</span>
                </span>
                <ul className="text-[11px] text-purple-900 space-y-1 font-sans">
                  <li>✓ ឈ្មោះផលិតផលពីរភាសា (ខ្មែរ & អង់គ្លេស) និងទម្ងន់សុទ្ធ</li>
                  <li>✓ តារាងសារធាតុផ្សំ និងសារធាតុបង្កអាឡែហ្ស៊ី (Allergen Notice)</li>
                  <li>✓ កាលបរិច្ឆេទផលិត & ផុតកំណត់ (MFG / EXP Format)</li>
                  <li>✓ បាកូដ EAN-13 Cambodia (884 prefix) + Traceability QR Code</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Package size={16} />
                <span>ចុះឈ្មោះ & បង្កើតស្លាក CS 001:2000 (Generate Label)</span>
              </button>
            </form>
          </div>

          {/* Right: MSME CS 001:2000 Label Live Preview */}
          <div className="lg:col-span-6 space-y-6">
            {activeMsmePreview && (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-dashed border-purple-300 shadow-lg space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-800 font-bold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    CS 001:2000 COMPLIANT FOOD LABEL
                  </span>
                  <span className="text-xs font-mono text-slate-500">{activeMsmePreview.batchCode}</span>
                </div>

                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
                      {activeMsmePreview.productName}
                    </h3>
                    <p className="text-xs text-amber-800 font-medium">
                      ផលិតដោយ៖ {activeMsmePreview.enterpriseName}
                    </p>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      ទម្ងន់សុទ្ធ / Net Weight: {activeMsmePreview.packagingWeight}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-700 border-t border-b border-amber-200/80 py-3">
                    <div>
                      <span className="font-bold block text-slate-900">គ្រឿងផ្សំ / Ingredients:</span>
                      <span>គ្រាប់ស្វាយចន្ទី ៩៨.៥%, អំបិលអ៊ីយ៉ូត ១.៥% (Cashew 98.5%, Salt 1.5%)</span>
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900">កាលបរិច្ឆេទ / Date:</span>
                      <span>MFG: 28/08/2026<br />EXP: 28/08/2027</span>
                    </div>
                  </div>

                  {/* Barcode EAN-13 & QR */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-mono bg-slate-200 px-1.5 py-0.5 rounded">EAN-13</span>
                        <span className="text-xs font-mono font-bold">{activeMsmePreview.barcode}</span>
                      </div>
                      <div className="h-8 w-36 bg-slate-900 flex items-center justify-center text-white text-[9px] font-mono tracking-widest">
                        ||||| | ||||| | ||||
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                      <QrCode size={40} className="text-slate-900" />
                      <div className="text-[9px] font-mono">
                        <span>SCAN TRACE</span>
                        <p className="text-emerald-700 font-bold">CashewTrace</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>ស្តង់ដារជាតិ៖ ក្រសួងឧស្សាហកម្ម វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា និងនវានុវត្តន៍</span>
                  <button
                    onClick={() => onNavigateSector('packaging')}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>បើកក្នុង Packaging Designer →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tab Content 3: Presentation Deck Kit */}
      {activeSubTab === 'presentation' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
                PRESENTATION & PITCH KIT
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-1">
                កញ្ចប់ស្លាយបទបង្ហាញផ្លូវការ (Official 9-Slide Presentation Deck)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                ប្រើប្រាស់សម្រាប់ធ្វើបទបង្ហាញជូនដៃគូកិច្ចសហការ ម្ចាស់ចម្ការ សហគមន៍កសិកម្ម និងវិនិយោគិន៖
              </p>
            </div>

            {onOpenPitchDeck && (
              <button
                onClick={onOpenPitchDeck}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-md cursor-pointer shrink-0"
              >
                <Presentation size={18} />
                <span>បើកមើលស្លាយពេញលេញ (Open 16:9 Deck)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Outline 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700">SLIDES 1–3</span>
              <h4 className="text-sm font-bold text-slate-900 font-sans">បញ្ហាប្រឈម & ដំណោះស្រាយ</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                ការនាំចេញគ្រាប់ឆៅ ៩០%, កង្វះតម្លាភាព EUDR, និងការបង្កើត CashewTrace ដើម្បីដោះស្រាយបញ្ហាដោយផ្ទាល់។
              </p>
            </div>

            {/* Outline 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-purple-700">SLIDES 4–6</span>
              <h4 className="text-sm font-bold text-slate-900 font-sans">ស្តង់ដារ CS 001 & AI</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                ការកែច្នៃបន្ថែមតម្លៃ, ការរៀបចំស្លាកសញ្ញា CS 001:2000, គណនាអាហារូបត្ថម្ភ និងការត្រៀមនាំចេញ។
              </p>
            </div>

            {/* Outline 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-700">SLIDES 7–9</span>
              <h4 className="text-sm font-bold text-slate-900 font-sans">ផែនការទីផ្សារ & ផលជះ</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                ការកើនឡើងប្រាក់ចំណូលកសិករ ៣៥%, តភ្ជាប់ទីផ្សារ B2B អន្តរជាតិ និងការអភិវឌ្ឍប្រកបដោយចីរភាព។
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab Content 4: Traceability Sandbox Simulation */}
      {activeSubTab === 'sandbox' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              DEMONSTRATION SIMULATOR
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-1">
              សាកល្បងដំណើរការដានកសិផលជាក់ស្តែង (Live End-to-End Sandbox)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ចុចតាមដំណាក់កាលនីមួយៗដើម្បីបង្ហាញអ្នកទស្សនាពីរបៀបដែលទិន្នន័យត្រូវបានកត់ត្រាតាមលំដាប់លំដោយ៖
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
            {[
              { step: 1, title: '១. ច្រូតកាត់ដីចម្ការ (Tree Harvest)' },
              { step: 2, title: '២. ត្រួតពិនិត្យសំណើម (Silot QC)' },
              { step: 3, title: '៣. កែច្នៃក្នុងរោងចក្រ (Processing)' },
              { step: 4, title: '៤. វេចខ្ចប់ CS 001 (Packaging)' },
              { step: 5, title: '៥. នាំចេញកុងតឺន័រ (Export Freight)' }
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setSandboxStep(s.step)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition cursor-pointer ${
                  sandboxStep === s.step
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            {sandboxStep === 1 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <Leaf size={18} />
                  <span>ដំណាក់កាលទី ១៖ ការប្រមូលផលពីដើមស្វាយចន្ទី និងកំណត់កូអរដោនេ GPS</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  កសិករប្រមូលផលគ្រាប់ស្វាយចន្ទីស្រស់ពីចម្ការដែលបានចុះបញ្ជី។ ប្រព័ន្ធកត់ត្រាលេខបាច់ (Batch CT-2026-BN-01) ភ្ជាប់ជាមួយកូអរដោនេដីចម្ការ (12.7915° N, 105.0210° E) មិនកាប់ព្រៃឈើ។
                </p>
              </div>
            )}

            {sandboxStep === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>ដំណាក់កាលទី ២៖ ការថ្លឹងទម្ងន់ និងពិនិត្យសំណើមនៅ Silot Depot</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  គ្រាប់ស្វាយចន្ទីស្ងួតត្រូវបានត្រួតពិនិត្យសំណើម (Moisture &lt; 9.0%) និងកម្រិតខូចខាត (Outturn Rate &gt; 48 lbs) ដើម្បីធានាបានចំណាត់ថ្នាក់ Grade A Premium មុននឹងបញ្ជូនទៅរោងចក្រកែច្នៃ។
                </p>
              </div>
            )}

            {sandboxStep === 3 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                  <Building size={18} />
                  <span>ដំណាក់កាលទី ៣៖ ការកែច្នៃ បកសំបក និងលីងដោយកម្តៅព្រះអាទិត្យ</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  រោងចក្រកែច្នៃអនុវត្តតាមស្តង់ដារអនាម័យ GHP / HACCP ដោយប្រើប្រាស់ឡសម្ងួតថាមពលកកើតឡើងវិញ និងកាត់បន្ថយការបំភាយឧស្ម័នកាបូន។
                </p>
              </div>
            )}

            {sandboxStep === 4 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <Package size={18} />
                  <span>ដំណាក់កាលទី ៤៖ ការវេចខ្ចប់ និងបិទស្លាកសញ្ញាស្តង់ដារ CS 001:2000</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  បិទស្ទីកឃ័រពីរភាសា បាកូដ EAN-13 និង QR Code សម្រាប់អ្នកទិញស្កេនពិនិត្យមើលប្រវត្តិនៃការប្រមូលផលតាំងពីចម្ការ។
                </p>
              </div>
            )}

            {sandboxStep === 5 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                  <Globe size={18} />
                  <span>ដំណាក់កាលទី ៥៖ ការដឹកជញ្ជូន និងតភ្ជាប់អ្នកបញ្ជាទិញអន្តរជាតិ (Export FCL)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  គណនាថ្លៃកុងតឺន័រ FCL 20ft ពីកំពង់ផែស្វយ័តក្រុងព្រះសីហនុ ទៅកាន់កំពង់ផែ Long Beach, Rotterdam ឬ Tokyo ដោយមានវិញ្ញាបនបត្របញ្ជាក់ប្រភពដើម និងភូតគាមអនាម័យត្រឹមត្រូវ។
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">ជំហាន {sandboxStep} នៃ ៥</span>
              <button
                onClick={() => setSandboxStep((prev) => (prev % 5) + 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>ជំហានបន្ទាប់ →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Quick Sector Apps Launcher for Demos */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            DEMONSTRATION APPS LAUNCHER
          </span>
          <h3 className="text-lg font-bold font-sans text-white mt-1">
            ផ្លូវកាត់ទៅកាន់កម្មវិធីនីមួយៗសម្រាប់ធ្វើការបង្ហាញ (Demonstration Shortcuts)
          </h3>
          <p className="text-xs text-slate-400">
            លោកអ្នកអាចចុចបើកកម្មវិធីនីមួយៗភ្លាមៗដើម្បីបង្ហាញទៅកាន់កសិករ ឬសហគ្រាស៖
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <button
            onClick={() => onNavigateSector('farmer')}
            className="p-3.5 rounded-xl bg-slate-800/90 hover:bg-emerald-800/80 border border-slate-700 text-left space-y-1 transition cursor-pointer"
          >
            <span className="text-lg">🌾</span>
            <div className="font-bold text-xs text-white">Cashew Silot</div>
            <p className="text-[10px] text-slate-400">កសិករ & ស៊ីឡូ</p>
          </button>

          <button
            onClick={() => onNavigateSector('mango')}
            className="p-3.5 rounded-xl bg-slate-800/90 hover:bg-amber-800/80 border border-slate-700 text-left space-y-1 transition cursor-pointer"
          >
            <span className="text-lg">🥭</span>
            <div className="font-bold text-xs text-white">Mango Pilot</div>
            <p className="text-[10px] text-slate-400">ស្វាយកែវរមៀត</p>
          </button>

          <button
            onClick={() => onNavigateSector('mayany')}
            className="p-3.5 rounded-xl bg-slate-800/90 hover:bg-purple-800/80 border border-slate-700 text-left space-y-1 transition cursor-pointer"
          >
            <span className="text-lg">🏭</span>
            <div className="font-bold text-xs text-white">Mayany Enterprise</div>
            <p className="text-[10px] text-slate-400">សហគ្រាសកែច្នៃ</p>
          </button>

          <button
            onClick={() => onNavigateSector('packaging')}
            className="p-3.5 rounded-xl bg-slate-800/90 hover:bg-indigo-800/80 border border-slate-700 text-left space-y-1 transition cursor-pointer"
          >
            <span className="text-lg">🏷️</span>
            <div className="font-bold text-xs text-white">Packaging CS 001</div>
            <p className="text-[10px] text-slate-400">ឌីហ្សាញស្លាកសញ្ញា</p>
          </button>

          <button
            onClick={() => onNavigateSector('map')}
            className="p-3.5 rounded-xl bg-slate-800/90 hover:bg-rose-800/80 border border-slate-700 text-left space-y-1 transition cursor-pointer"
          >
            <span className="text-lg">🌶️</span>
            <div className="font-bold text-xs text-white">Pepper & Spices</div>
            <p className="text-[10px] text-slate-400">ម្រេច & ដំណាំផ្សេងៗ</p>
          </button>
        </div>
      </section>
    </div>
  );
}
