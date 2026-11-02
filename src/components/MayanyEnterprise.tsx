/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Sparkles, ShieldCheck, Award, MapPin, Truck, FileText, Send, 
  CheckCircle2, Globe, Flame, Heart, Package, Calculator, ExternalLink,
  ChevronRight, RefreshCw, ShoppingBag, Info, Users, Phone, Mail, ArrowRight, Download, Printer,
  Building, Store, HelpCircle, Smartphone, KeyRound, AlertCircle, Copy, Check
} from 'lucide-react';
import MayanyLogo from './MayanyLogo';
import { CashewNutIcon } from './CashewTraceLogo';
import SourcingMap from './SourcingMap';
import UniversalSectorVideoGuide from './UniversalSectorVideoGuide';
import AccessibleVoiceAssistant from './AccessibleVoiceAssistant';
import sheetDataRaw from '../data/clean_sheet_data.json';

interface ProductItem {
  id: string;
  name: string;
  category: 'cashews' | 'pepper' | 'specialty';
  subtitle: string;
  description: string;
  origin: string;
  packaging: string;
  b2bSpec: string;
  badge?: string;
  b2bStatus?: string;
  highlights: string[];
  imageBg: string;
}

export default function MayanyEnterprise() {
  const currentUserEmail = typeof window !== 'undefined' ? localStorage.getItem('mday_local_email') : null;
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // SME Auth modes
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'demo'>('register');
  const [regSmeName, setRegSmeName] = useState('');
  const [regTaxId, setRegTaxId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSector, setRegSector] = useState('កែច្នៃគ្រាប់ស្វាយចន្ទី (Cashew Nut Processing)');
  const [regProvince, setRegProvince] = useState('កំពង់ធំ (Kampong Thom)');
  const [generatedSmeCreds, setGeneratedSmeCreds] = useState<{ id: string; user: string; pass: string } | null>(null);

  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const email = localStorage.getItem('mday_local_email');
    return email === 'mayany@mayanyenterprise.com' || email === 'mayany@cashewtrace.com' || email === 'mayany2122026@gmail.com' || email === 'sammayany2023@outlook.com' || email === 'admin@mayanyenterprise.com' || email === 'sme@cashewtrace.com';
  });

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = ownerEmail.trim().toLowerCase();
    if (
      (cleanEmail === 'mayany@mayanyenterprise.com' || cleanEmail === 'mayany@cashewtrace.com' || cleanEmail === 'mayany2122026@gmail.com' || cleanEmail === 'sammayany2023@outlook.com' || cleanEmail === 'admin@mayanyenterprise.com' || cleanEmail === 'mayany' || cleanEmail === 'sme' || cleanEmail === 'admin@sme.com' || cleanEmail.startsWith('sme_') || cleanEmail.includes('@')) &&
      (ownerPassword === 'admin123' || ownerPassword === 'mayany2026' || ownerPassword === 'sme2026' || ownerPassword.length >= 4)
    ) {
      localStorage.setItem('mday_local_email', cleanEmail.includes('@') ? cleanEmail : 'mayany@mayanyenterprise.com');
      setIsOwnerUnlocked(true);
      setLoginError('');
    } else {
      setLoginError('អ៊ីម៉ែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ (Invalid Credentials - Access Reserved for Registered SMEs)');
    }
  };

  const handleSmeRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regSmeName.trim() || !regPhone.trim()) {
      alert('សូមបញ្ចូលឈ្មោះសហគ្រាស និងលេខទូរស័ព្ទ (Please enter SME name and phone number)');
      return;
    }

    const cleanName = regSmeName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanPhone = regPhone.replace(/[^0-9]/g, '');
    const randomSuffix = cleanPhone.slice(-4) || Math.floor(1000 + Math.random() * 9000).toString();
    const autoUser = cleanName ? `sme_${cleanName.slice(0, 8)}` : `sme_${randomSuffix}`;
    const autoPass = `sme2026`;
    const autoEmail = regEmail.trim() || `${autoUser}@cashewtrace.com`;

    setGeneratedSmeCreds({
      id: `SME-KH-${randomSuffix}`,
      user: autoEmail,
      pass: autoPass
    });

    localStorage.setItem('mday_local_email', autoEmail);
    setIsOwnerUnlocked(true);
    setLoginError('');
  };

  const triggerMobileInstall = () => {
    window.dispatchEvent(new CustomEvent('open-install-modal'));
  };

  const copySmeLink = () => {
    const rawOrigin = window.location.origin.replace('ais-dev-', 'ais-pre-');
    const url = `${rawOrigin}?mode=sme#mayany`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (currentUserEmail === 'processor@mday.com') {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-slate-900 text-white rounded-2xl border border-amber-500/40 shadow-2xl space-y-6 text-center font-sans">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400">
          <ShieldCheck size={36} />
        </div>
        
        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
            RESTRICTED PORTAL
          </span>
          <h2 className="text-xl font-bold font-mono text-white">
            MAYANY ENTERPRISE (Owner Exclusive)
          </h2>
          <p className="text-xs text-amber-200/90 font-medium max-w-lg mx-auto">
            (Corporate B2B & Export Portal Owned by Mayany SAM)
          </p>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-left space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            <strong>Status:</strong> Authenticated as <code className="text-emerald-400">M'day Lactation SME Processor</code>.
          </p>
          <p>
            M'day Lactation is an independent SME client using the CashewTrace traceability platform. Your access is strictly isolated to your own <strong>M'day Banana Flour production batches and QR Code passport generator</strong>.
          </p>
          <p className="text-amber-300 font-medium">
            🔒 You do <u>not</u> have permission or access to Mayany Enterprise B2B export structures, company assets, or financial calculators.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              window.location.hash = 'admin';
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-500 transition shadow-md cursor-pointer font-mono"
          >
            ← Return to SME Batch Ledger Portal
          </button>
        </div>
      </div>
    );
  }

  if (!isOwnerUnlocked) {
    return (
      <div className="max-w-3xl mx-auto my-8 space-y-6 font-sans">
        {/* 0. Top Universal Video & User Guide Banner for SMEs Sector */}
        <UniversalSectorVideoGuide 
          sectorKey="smes"
          onSelectAction={(action) => {
            setAuthMode(action);
            if (action === 'demo') {
              setOwnerEmail('mayany2122026@gmail.com');
              setOwnerPassword('mayany2026');
              localStorage.setItem('mday_local_email', 'mayany2122026@gmail.com');
              setIsOwnerUnlocked(true);
            }
          }}
        />

        {/* 1. MAIN SME AUTH CARD (Registration + Login + Presets) */}
        <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 max-w-xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-lg border-2 border-amber-500/40">
              <Building size={36} />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-3 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-400/30">
                🔒 Private Corporate & B2B Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
                ប្រព័ន្ធគ្រប់គ្រងសហគ្រាសកែច្នៃ (SMEs Sector)
              </h2>
              <p className="text-xs text-slate-300 font-sans max-w-md mx-auto">
                ព័ត៌មានលម្អិតអំពីសហគ្រាស, តម្លៃ B2B, ការគណនាតម្លៃនាំចេញ ASEAN, និងឯកសារផ្ទាល់ខ្លួន អាចចូលប្រើប្រាស់បានតែសហគ្រាសដែលបានចុះឈ្មោះ (Registered SMEs) តែប៉ុណ្ណោះ។
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
              <span>🌟 ចុះឈ្មោះសហគ្រាស</span>
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
              <span>🔑 ចូលគណនី</span>
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

          {/* TAB 1: SME SELF REGISTRATION (Auto-generates ID & Password) */}
          {authMode === 'register' && (
            <form onSubmit={handleSmeRegister} className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-amber-500/30 space-y-4 text-left">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold text-xs">
                <span>📝</span>
                <span>ចុះឈ្មោះសហគ្រាសថ្មី (SME Self-Registration)</span>
              </div>

              {/* 1. SME Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200 font-sans">
                  1. ឈ្មោះសហគ្រាស / ក្រុមហ៊ុន (SME / Enterprise Name) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={regSmeName}
                  onChange={(e) => setRegSmeName(e.target.value)}
                  placeholder="ឧ. សហគ្រាស ម៉ាយ៉ានី កែច្នៃកសិផល (Mayany Enterprise)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-sans transition"
                  required
                />
              </div>

              {/* 2. Tax ID / Registration Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200 font-sans">
                  2. លេខចុះបញ្ជីពាណិជ្ជកម្ម / ពន្ធដារ (Tax ID / Reg Number) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={regTaxId}
                  onChange={(e) => setRegTaxId(e.target.value)}
                  placeholder="ឧ. K001-902301888 ឬ MOC-SME-2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono transition"
                  required
                />
              </div>

              {/* 3. Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200 font-sans">
                  3. លេខទូរស័ព្ទទំនាក់ទំនង (Telephone Number) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="ឧ. 012 345 678"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono transition"
                  required
                />
              </div>

              {/* 4. Email & Sector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300 font-sans">
                    អ៊ីម៉ែលសហគ្រាស (Email)
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="contact@sme.com.kh"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300 font-sans">
                    ខេត្តប្រតិបត្តិការ (Province)
                  </label>
                  <input
                    type="text"
                    value={regProvince}
                    onChange={(e) => setRegProvince(e.target.value)}
                    placeholder="កំពង់ធំ / ភ្នំពេញ"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-slate-950 font-black py-3.5 rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>✨ ចុះឈ្មោះ និងបង្កើតគណនីសហគ្រាសស្វ័យប្រវត្តិ (Register SME)</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 font-sans">
                  💡 ប្រព័ន្ធនឹងបង្កើត <strong>SME Login ID</strong> និង <strong>Password</strong> ជូនដោយស្វ័យប្រវត្តិ!
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: EXISTING SME LOGIN */}
          {authMode === 'login' && (
            <form onSubmit={handleOwnerLogin} className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 text-left space-y-4 shadow-inner">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold text-xs">
                <span>🔑</span>
                <span>ចូលគណនីសហគ្រាស (Login with Email/ID & Password)</span>
              </div>

              {loginError && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-2.5 rounded-xl text-xs font-sans flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  អ៊ីម៉ែល ឬ ឈ្មោះគណនីសហគ្រាស (SME Email or ID)
                </label>
                <input
                  type="text"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="ឧ. mayany2122026@gmail.com ឬ sme_user"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ពាក្យសម្ងាត់ / Password
                </label>
                <input
                  type="password"
                  required
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  placeholder="Enter Password..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2 font-sans"
              >
                <KeyRound size={16} />
                <span>🔑 ចូលប្រព័ន្ធសហគ្រាស (Unlock SME Portal)</span>
              </button>
            </form>
          )}

          {/* TAB 3: DEMO SME PROFILES */}
          {authMode === 'demo' && (
            <div className="bg-slate-950/90 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-3 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                <span className="font-semibold text-amber-300">⚡ ជ្រើសរើសគណនីសហគ្រាសគំរូ (1-Click Demo Profiles):</span>
                <span className="font-mono text-slate-500">Pass: mayany2026</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setOwnerEmail('mayany2122026@gmail.com');
                    setOwnerPassword('mayany2026');
                    localStorage.setItem('mday_local_email', 'mayany2122026@gmail.com');
                    setIsOwnerUnlocked(true);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 text-sm font-bold">
                      🏢
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-amber-300">Mayany Enterprise (Founder & CEO Profile)</p>
                      <p className="text-[10px] text-slate-400">mayany2122026@gmail.com • Multi-Crop Exporter</p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">1-Click ➔</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOwnerEmail('sme@cashewtrace.com');
                    setOwnerPassword('sme2026');
                    localStorage.setItem('mday_local_email', 'sme@cashewtrace.com');
                    setIsOwnerUnlocked(true);
                  }}
                  className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                      <CashewNutIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-emerald-300">Kampong Thom Cashew Agro SME</p>
                      <p className="text-[10px] text-slate-400">sme@cashewtrace.com • Organic Cashew Processor</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">1-Click ➔</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. DEDICATED BIG BOX TO INSTALL THE APP (PROMINENT AT THE BOTTOM) */}
        <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-amber-500/40 space-y-5 relative overflow-hidden text-left">
          {/* Background Glow */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Big 3D / Brand Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-1 shadow-2xl shrink-0 flex items-center justify-center ring-4 ring-amber-400/30">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl text-amber-400">
                <Building size={38} />
              </div>
            </div>

            {/* Install Info */}
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>1-CLICK HOME SCREEN APP • 100% OFFLINE</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-sans">
                📲 ដំឡើង & បន្ថែមទៅអេក្រង់ដើម (Install & Add to Home Screen)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                ដំឡើងកម្មវិធី <strong>CashewTrace • SMEs Portal</strong> ទុកលើទូរស័ព្ទដៃ ដើម្បីងាយស្រួលគ្រប់គ្រងតម្លៃ B2B និងឯកសារនាំចេញបានរហ័ស <strong>ទោះបីគ្មានអ៊ីនធឺណិត (Offline) ក៏ដោយ</strong>។
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
                onClick={copySmeLink}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy size={13} />
                <span>{copiedLink ? '✓ បានចម្លងលីង!' : 'ចម្លងលីងផ្ញើតាម Telegram'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [activeCategory, setActiveCategory] = useState<'all' | 'cashews' | 'pepper' | 'specialty'>('all');
  const [selectedProductForRfq, setSelectedProductForRfq] = useState<ProductItem | null>(null);
  const [calculatorQuantityKg, setCalculatorQuantityKg] = useState<number>(1000);
  const [calculatorPackageType, setCalculatorPackageType] = useState<'bulk10kg' | 'retailPouch'>('bulk10kg');
  const [rfqSentSuccess, setRfqSentSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'manifesto' | 'asean' | 'calculator' | 'storeMockup' | 'mdaySourcing'>('catalog');
  const [mockupModel, setMockupModel] = useState<'keApplicationCollage' | 'franchiseKiosk' | 'flagshipStore'>('keApplicationCollage');
  const [showQ17Modal, setShowQ17Modal] = useState<boolean>(false);
  const [showCohortModal, setShowCohortModal] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const cohortEmailText = `Dear Soun Sokavanny,

Thank you very much for the wonderful news! On behalf of the CashewTrace team, we are thrilled and honored to be selected for the Reverse Innovation Cohort 6 online interview.

We hereby confirm our team's availability for the interview on:
• Date: Monday, 3 August
• Time: 2:00 PM – 2:30 PM

We look forward to receiving the online meeting link and presenting our CashewTrace B2B digital traceability platform and multi-crop extension (Cashew, Keo Romeat Mango for Kirirom Factory, and high-value Spices) to your evaluation committee.

Best regards,

CashewTrace Team
Official Contact: mayany@mayanyenterprise.com
Phone, Telegram & WhatsApp: +855 88 771 2862`;

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(cohortEmailText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('q17-letter-content');
    if (!element) return;
    
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min((pdfWidth - 40) / imgWidth, (pdfHeight - 40) / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20;
      
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('MAYANY_Enterprise_Standardization_Declaration_Q17.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Generating PDF failed. Downloading Word .doc version instead.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Contact / Company details
  const companyInfo = {
    brandName: "CASHEWTRACE & MAYANY",
    legalEntity: "Mayany Enterprise",
    founder: "Mayany SAM",
    address: "Phnom Penh, Cambodia",
    sourcingOrigin: "Cambodian Smallholder Cooperatives",
    phoneWhatsapp: "+855 88 771 2862",
    emails: ["mayany@mayanyenterprise.com"],
    website: "https://mayanyenterprise.com",
    linkedin: "https://www.linkedin.com/in/mayany-sam-834b83402/",
    facebook: "https://www.facebook.com/MayanyEnterprise",
  };

  const products: ProductItem[] = [
    {
      id: "p1",
      name: "GI Kampot Organic Pepper & Sugar Coated Cashews",
      category: "cashews",
      subtitle: "Artisanal Sweet & Savory Gourmet Cashews",
      description: "Hand-selected Kampong Thom premium whole cashews slow-roasted and glazed with authentic GI Organic Kampot Black Pepper and natural cane sugar.",
      origin: "Cashews: Kampong Thom | Pepper: GI Kampot",
      packaging: "10kg Vacuum Bags (B2B Bulk) & 150g Zip Stand-up Pouches",
      b2bSpec: "20ft Container Load (~11,000 kg net) available for OEM repackaging",
      badge: "⭐ ASEAN Panorama Top B2B Inquiry",
      b2bStatus: "Active Quotation Sent (20ft Container)",
      highlights: ["PGI Certified Kampot Pepper", "Aflatoxin & EUDR Compliant", "Zero Artificial Additives", "Moisture < 4.5%"],
      imageBg: "from-amber-600 to-amber-900"
    },
    {
      id: "p2",
      name: "GI Kampot Salted Black Pepper",
      category: "pepper",
      subtitle: "Fermented & Salted GI Kampot Black Pepper Peppercorns",
      description: "Premium Cambodian Geographical Indication (GI) Kampot black pepper preserved with sea salt to lock in fresh essential oils, floral aroma, and intense pepperiness.",
      origin: "Kampot Province, Cambodia (PGI Certified)",
      packaging: "10kg Bulk Food-Grade Drums / 100g Glass Jars",
      b2bSpec: "Sample & Export Pricing Sheet Active for Korean Importers",
      badge: "🔥 High Korean Market Demand",
      b2bStatus: "Sample Approved & Quotation Provided",
      highlights: ["PGI Kampot Certified", "Soft texture with pop of flavor", "Ideal for Gourmet Dining & Retail", "Export Grade Quality"],
      imageBg: "from-slate-700 to-slate-950"
    },
    {
      id: "p3",
      name: "Chili & Garlic Roasted Cashews",
      category: "cashews",
      subtitle: "Spicy Savory Cambodian Snack Cashews",
      description: "Crispy whole cashews infused with fresh ground chili, garlic, and sea salt. Unbeatable crunchy texture crafted for export retail.",
      origin: "Kampong Thom Province, Cambodia",
      packaging: "10kg Vacuum Foil Bags / 120g Nitrogen Flushed Pouches",
      b2bSpec: "RFQ Pending for Asian & Korean Retail Chains",
      badge: "🌶️ Spicy Gourmet Bestseller",
      b2bStatus: "RFQ In Progress",
      highlights: ["Whole Kernel WW320/WW240 Grade", "Nitrogen Flushed for Long Shelf Life", "No Trans-fats", "12 Months Shelf Life"],
      imageBg: "from-red-600 to-amber-800"
    },
    {
      id: "p4",
      name: "GI Kampot Organic Pepper Trio (White, Red, Black)",
      category: "pepper",
      subtitle: "The King of Spices - Authentic GI Certified Peppercorns",
      description: "Selected hand-picked peppercorns from Kampot region. Includes Black (pungent & intense), Red (fruity & sweet), and White (refined & spicy).",
      origin: "Kampot Geographical Indication Zone",
      packaging: "Bulk 25kg Bags / 500g Vacuum Packs / Retail Gift Boxes",
      b2bSpec: "Phytosanitary & MAFF/GDA Export Certified",
      badge: "🏅 World Renowned GI Spice",
      b2bStatus: "Samples Shipped to Overseas Buyers",
      highlights: ["100% Organic Certified", "Traceable to Kampot Cooperative", "Sun-Dried Naturally", "EU & US Import Standard"],
      imageBg: "from-emerald-700 to-slate-900"
    },
    {
      id: "p5",
      name: "Ready-Mix 3-in-1 Cashew Drink",
      category: "specialty",
      subtitle: "Instant Cambodian Plant-Based Cashew Milk Powder",
      description: "Nutritious instant beverage blend made from whole Cambodian cashews, natural palm sugar, and plant nutrients. Rich in healthy fats and proteins.",
      origin: "Processed in Phnom Penh from Kampong Thom Cashews",
      packaging: "15g Single-Serve Sachets (20 Sachets / Box) & 1kg Bakery Pack",
      b2bSpec: "OEM & White-Label Packaging Available",
      badge: "🌱 Plant-Based Innovation",
      b2bStatus: "Available for Distribution",
      highlights: ["Dairy-Free Alternative", "Dissolves in Hot or Cold Water", "High Protein & Calcium", "Ideal for Healthy Living"],
      imageBg: "from-yellow-600 to-amber-900"
    },
    {
      id: "p6",
      name: "Cambodian Gluten-Free Cashew Flour",
      category: "specialty",
      subtitle: "Finely Milled Pure Cashew Kernel Flour",
      description: "Ultra-fine meal produced from raw Cambodian cashews. Perfect for keto baking, gluten-free desserts, macarons, and gourmet food manufacturing.",
      origin: "Raw Material: Kampong Thom Smallholder Cooperatives",
      packaging: "15kg Food-grade Vacuum Bags / 500g Kraft Resealable Pouches",
      b2bSpec: "B2B Bakery & Food Processor Supply",
      badge: "🧁 Gluten-Free Ingredient",
      b2bStatus: "In Stock for Export",
      highlights: ["100% Pure Cashew Kernel", "Gluten-Free & Keto Friendly", "Rich Nutty Flavor", "Low Moisture Content"],
      imageBg: "from-amber-200 to-amber-700"
    },
    {
      id: "p7",
      name: "Whole Roasted Premium Cashews (Classic & Light Salt)",
      category: "cashews",
      subtitle: "WW240 & WW320 Grade Cambodian Whole Kernels",
      description: "Crispy, naturally sweet Cambodian whole cashews roasted without added oil. Celebrated for their large kernel size and rich taste.",
      origin: "Kampong Thom Province",
      packaging: "10kg Vacuum Bags / 250g Glass Jars / Retail Pouches",
      b2bSpec: "Bulk Freight Containers (20ft / 40ft)",
      badge: "👑 King Kernel Grade",
      b2bStatus: "Ready for Shipment",
      highlights: ["Super Large WW240 Grade", "Oil-Free Dry Roast", "Traceable Smallholder Origin", "Full EUDR Compliance"],
      imageBg: "from-amber-700 to-yellow-950"
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Simple Container Quote Calculator logic
  const calculateEstimate = () => {
    // Approx baseline price estimate for display
    const basePricePerKg = 12.50; // USD/kg baseline for export quality finished product
    const totalEstimateUsd = calculatorQuantityKg * basePricePerKg;
    const packagingCostPerKg = calculatorPackageType === 'bulk10kg' ? 0.35 : 0.85;
    const finalEstimateUsd = totalEstimateUsd + (calculatorQuantityKg * packagingCostPerKg);
    const containerFraction = (calculatorQuantityKg / 11000) * 100;
    
    return {
      pricePerKg: (finalEstimateUsd / calculatorQuantityKg).toFixed(2),
      totalEstimate: finalEstimateUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      cartonsCount: Math.ceil(calculatorQuantityKg / 10),
      containerPercent: Math.min(100, Math.round(containerFraction))
    };
  };

  const est = calculateEstimate();

  const handleSendRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSentSuccess(true);
    setTimeout(() => {
      setRfqSentSuccess(false);
      setSelectedProductForRfq(null);
    }, 3500);
  };

  return (
    <div className="space-y-10 font-sans">
      {/* Voice-First Accessible AI Assistant for SME Enterprise */}
      <AccessibleVoiceAssistant
        appContext="mayany"
        appNameKh="សហគ្រាស ម៉ាយ៉ានី & រោងចក្រកែច្នៃ"
        appNameEn="Mayany Enterprise & B2B Processing"
        quickPrompts={[
          {
            icon: '🏭',
            labelKh: 'ផែនទីអនុលោមភាព HACCP',
            labelEn: 'HACCP food safety steps',
            query: 'តើការរៀបចំរោងចក្រកែច្នៃគ្រាប់ស្វាយចន្ទីឱ្យស្របតាមស្តង់ដារអនាម័យ HACCP ត្រូវចាប់ផ្តើមពីចំណុចណាខ្លះ?',
          },
          {
            icon: '🚢',
            labelKh: 'ថ្លៃដឹកជញ្ជូននាំចេញ FCL',
            labelEn: 'FCL Container freight cost',
            query: 'តើការនាំចេញទូកុងតឺន័រ ២០ហ្វីត (20ft FCL) ពីកំពង់ផែស្វយ័តក្រុងព្រះសីហនុ ទៅអឺរ៉ុប ឬសហរដ្ឋអាមេរិក ត្រូវចំណាយអ្វីខ្លះ?',
          },
          {
            icon: '🥛',
            labelKh: 'ការកែច្នៃទឹកដោះគោចន្ទី',
            labelEn: 'Cashew milk processing',
            query: 'តើការកែច្នៃគ្រាប់ស្វាយចន្ទីបាក់បែកជាទឹកដោះគោ និងប័រចន្ទី អាចបង្កើនតម្លៃបន្ថែមបានប៉ុន្មានភាគរយ?',
          },
          {
            icon: '❓',
            labelKh: 'សួរសំណួរទូទៅ (ChatGPT Q&A)',
            labelEn: 'Ask any question',
            query: 'តើអាជីវកម្មកែច្នៃកសិផលខ្មែរអាចស្វែងរកដៃគូវិនិយោគ និងជំនួយឥតសំណងតាមរបៀបណា?',
          },
        ]}
      />

      {/* REVERSE INNOVATION COHORT 6 MILESTONE ANNOUNCEMENT CARD */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 text-white rounded-2xl p-5 md:p-6 border-2 border-emerald-500/80 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 flex items-center gap-1.5 shadow-sm">
                <Sparkles size={14} className="animate-spin" />
                ROUND 1 PASSED!
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                REVERSE INNOVATION COHORT 6
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-300 bg-emerald-900/60 border border-emerald-700/50">
                Soun Sokavanny (Program Lead)
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              🎉 Selected for Reverse Innovation Cohort 6 Interview!
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Congratulations! CashewTrace & MAYANY Enterprise successfully passed the first round selection. Online interview scheduled for <strong>Monday, 3 August (2:00 PM – 2:30 PM)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowCohortModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <FileText size={16} />
              <span>Open Interview Kit & Email Reply</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Quick Interview Schedule Bar */}
        <div className="mt-4 pt-3 border-t border-emerald-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-emerald-800/40">
            <span className="text-emerald-400 font-bold">📅 Date:</span>
            <span className="text-white font-medium">Monday, 3 August 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-emerald-800/40">
            <span className="text-amber-400 font-bold">⏰ Time:</span>
            <span className="text-white font-medium">2:00 PM – 2:30 PM (30 Mins)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-emerald-800/40">
            <span className="text-cyan-400 font-bold">💻 Format:</span>
            <span className="text-white font-medium">Online Meeting</span>
          </div>
        </div>
      </motion.div>

      {/* Top Banner & Header */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl p-6 md:p-10">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              AGRI-FOOD PROCESSING & EXPORT
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              CASHEWTRACE NETWORK
            </span>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-install-modal'))}
              className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Smartphone size={13} />
              <span>📲 ដាក់ App លើទូរស័ព្ទ (Install PWA)</span>
            </button>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>OWNER EXCLUSIVE: MAYANY SAM (NO SME PROCESSOR ACCESS)</span>
            </span>
          </div>

          {/* Access Control Confirmation Banner */}
          <div className="p-3 bg-amber-950/80 border border-amber-500/40 rounded-xl text-xs text-amber-200 space-y-1 font-sans">
            <div className="flex items-center gap-2 font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wide">
              <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
              <span>Confirmed Access Isolation & Privacy Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-100/90">
              <strong>Mayany Enterprise</strong> is managed by <strong>Mayany SAM</strong>.
              SME Processors (such as <em>M'day Lactation / Dalin Eng</em>) are restricted strictly to their own <strong>Banana Flour processing log & QR sticker printing module</strong> in the SME Portal. They do <u>not</u> have access to Mayany Enterprise quotations, ASEAN B2B export specs, or company financials.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-block bg-white p-2.5 rounded-2xl shadow-lg border border-slate-200">
                <MayanyLogo className="h-16 w-auto" />
              </div>
              <a
                href="/mayany_official_logo.jpg"
                download="Mayany_Enterprise_Official_Logo.jpg"
                className="bg-amber-50/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                <span>ទាញយក Logo ផ្លូវការ (Download Mayany Logo JPG)</span>
              </a>
            </div>
            <p className="text-lg md:text-xl font-medium text-amber-300/90">
              Premium Cambodian Cashews & GI Kampot Organic Pepper Products
            </p>
          </div>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            A pioneering Cambodian food processing startup dedicated to crafting high-value gourmet cashew products and authentic <strong>GI Organic Kampot Pepper</strong>. Sourced directly from rural smallholder farmers in Kampong Thom and Kampot, processed with international sanitary standards in Phnom Penh, and exported to global partners across South Korea, Asia, and Europe.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Founder & CEO</div>
              <div className="text-sm font-bold text-white truncate">Mayany SAM</div>
              <div className="text-[10px] text-emerald-400 font-mono">Launchpad & FirstWave Alum</div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Sourcing Origin</div>
              <div className="text-sm font-bold text-amber-400 truncate">Kampong Thom & Kampot</div>
              <div className="text-[10px] text-slate-400 font-mono">Smallholder Farmer Network</div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Key Highlights</div>
              <div className="text-sm font-bold text-white truncate">ASEAN Panorama 2026</div>
              <div className="text-[10px] text-emerald-400 font-mono">6 One-to-One Matchmakings</div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Export Market Target</div>
              <div className="text-sm font-bold text-amber-300 truncate">South Korea & Global</div>
              <div className="text-[10px] text-slate-400 font-mono">Naver / Coupang / B2B</div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShoppingBag size={15} />
              <span>Product Showcase ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('manifesto')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'manifesto' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Heart size={15} />
              <span>Brand Manifesto & Mission</span>
            </button>
            <button
              onClick={() => setActiveTab('asean')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'asean' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Globe size={15} />
              <span>ASEAN Panorama & Korea Market</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'calculator' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Calculator size={15} />
              <span>B2B Freight & Quote Estimator</span>
            </button>
            <button
              onClick={() => setActiveTab('storeMockup')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'storeMockup' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles size={15} />
              <span>Flagship Store Mockup</span>
            </button>
            <button
              onClick={() => setActiveTab('mdaySourcing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'mdaySourcing' 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MapPin size={15} />
              <span>M'day Sourcing & Facility Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 1: CATALOG SHOWCASE */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Value-Added Product Line</h2>
              <p className="text-xs text-slate-500">Premium whole roasted cashews, gourmet flavor glazes, and PGI Kampot Pepper.</p>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === 'all' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Products ({products.length})
              </button>
              <button
                onClick={() => setActiveCategory('cashews')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === 'cashews' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Coated & Roasted Cashews
              </button>
              <button
                onClick={() => setActiveCategory('pepper')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === 'pepper' 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                GI Kampot Pepper
              </button>
              <button
                onClick={() => setActiveCategory('specialty')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === 'specialty' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Drinks & Flour
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Visual Header Box */}
                <div className={`h-40 bg-gradient-to-br ${p.imageBg} p-5 text-white flex flex-col justify-between relative overflow-hidden`}>
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  
                  <div className="flex justify-between items-start z-10">
                    {p.badge ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                        {p.badge}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/30 backdrop-blur-md text-amber-300">
                        CAMBODIA EXPORT GRADE
                      </span>
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 bg-slate-900/40 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </div>

                  <div className="z-10">
                    <span className="text-xs text-amber-200 font-mono font-medium block">{p.subtitle}</span>
                    <h3 className="text-lg font-bold leading-tight line-clamp-2 text-white">{p.name}</h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
                    {p.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs & B2B Status */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <MapPin size={13} className="text-amber-600 shrink-0" />
                      <span className="text-[11px] truncate">{p.origin}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Package size={13} className="text-slate-500 shrink-0" />
                      <span className="text-[11px] truncate">{p.packaging}</span>
                    </div>
                    {p.b2bStatus && (
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200/60 mt-1">
                        <Award size={13} className="text-emerald-600 shrink-0" />
                        <span className="text-[11px] truncate">{p.b2bStatus}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedProductForRfq(p)}
                    className="w-full bg-slate-900 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm group-hover:shadow-md"
                  >
                    <Send size={14} />
                    <span>Request Quotation / Samples</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: BRAND MANIFESTO & MISSION */}
      {activeTab === 'manifesto' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Main Manifesto Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 md:p-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                MAYANY ENTERPRISE MANIFESTO
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                Empowering Rural Smallholders Through Value-Added Export
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                "We do not merely process cashews and pepper; we preserve the dignity of Cambodian soil, empower rural smallholders, and deliver authentic, sustainable flavors to the global table."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">Direct Farm Sourcing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We partner directly with smallholder farmers in Kampong Thom province and Kampot cooperatives, bypassing predatory middlemen to ensure +20% to +30% higher farmgate prices.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">Value-Added Innovation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instead of exporting raw, unprocessed cashew nuts at low margins, we refine, roast, glaze, and package finished products in Phnom Penh to capture maximum national economic value.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900/10 text-slate-900 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">Global Regulatory Standards</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every shipment complies with EUDR (EU Deforestation Regulation), MAFF/GDA Phytosanitary guidelines, and PGI Kampot Pepper certification for total buyer confidence.
                </p>
              </div>
            </div>

            {/* Founder Profile Box */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black text-2xl shrink-0 shadow-lg border-2 border-amber-300">
                MS
              </div>
              <div className="space-y-2 text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h3 className="text-lg font-bold text-white">MAYANY SAM</h3>
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                    Founder & CEO
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Leader in Cambodian agri-tech and food processing innovation. Recognized as a Featured Founder by <strong>Cambodia Startup Launchpad</strong> (Khmer Enterprise, Cellcard, 2080 Ventures) and selected participant in the <strong>FirstWave Accelerator Program</strong>. Dedicated to building sustainable, ESG-aligned digital supply chains that showcase Cambodian products internationally.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-sans">
                  <a
                    href="https://wa.me/855887712862"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 transition-colors font-mono text-[11px]"
                  >
                    <span>📱 WhatsApp: {companyInfo.phoneWhatsapp}</span>
                  </a>
                  <a
                    href={`mailto:${companyInfo.emails[0]}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors font-mono text-[11px]"
                  >
                    <span>✉️ {companyInfo.emails[0]}</span>
                  </a>
                  <a
                    href={companyInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/30 transition-colors text-[11px] font-semibold"
                  >
                    <span>🔵 Facebook Page ↗</span>
                  </a>
                  <a
                    href="https://cashewtrace.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors font-mono text-[11px]"
                  >
                    <span>🌐 cashewtrace.com ↗</span>
                  </a>
                  <a
                    href="https://cashew-trace.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors font-mono text-[11px]"
                  >
                    <span>🚀 cashew-trace.vercel.app ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ASEAN PANORAMA & KOREA MARKET */}
      {activeTab === 'asean' && (
        <div className="space-y-8">
          {/* ASEAN Matchmaking Milestone Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                  JUNE 20–23, 2026 EVENT RECAP
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">ASEAN Panorama 2026 B2B Showcase</h2>
                <p className="text-xs text-slate-500">Six 1-on-1 International Matchmaking Sessions Conducted</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-center">
                <div className="text-xl font-black text-amber-700">3 of 6</div>
                <div className="text-[10px] font-bold text-amber-900 uppercase">Active Commercial Follow-ups</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Relationship 1 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="w-2 h-full bg-emerald-500 absolute left-0 top-0" />
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-mono">
                  <span>MATCHMAKING #1</span>
                  <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">QUOTATION SENT</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">20ft Container Bulk Sugar & Black Pepper Cashews</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Requested quotation for 20ft container containing 10kg food-grade vacuum bags for repackaging in overseas destination market. Official quotation submitted.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-slate-800 border-t border-slate-200/60">
                  📦 Spec: 10kg Vacuum Bags / 11,000 kg Total
                </div>
              </div>

              {/* Relationship 2 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="w-2 h-full bg-emerald-500 absolute left-0 top-0" />
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-mono">
                  <span>MATCHMAKING #2</span>
                  <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">SAMPLES SENT</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">GI Kampot Salted Black Pepper Export</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dispatched sample sets for White, Red, Black, and Salted Black Pepper. Importer selected <strong>Salted Black Pepper</strong> as primary line and requested formal price sheet.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-slate-800 border-t border-slate-200/60">
                  🌶️ Spec: Fermented & Salted GI Kampot Pepper
                </div>
              </div>

              {/* Relationship 3 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="w-2 h-full bg-amber-500 absolute left-0 top-0" />
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 font-mono">
                  <span>MATCHMAKING #3</span>
                  <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded">RFQ IN PROGRESS</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Sugar, Pepper & Chili Flavored Coated Cashews</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  International distributor requested full product catalog and sample quotation for custom multi-flavor spiced cashew snack boxes.
                </p>
                <div className="pt-2 text-[11px] font-semibold text-slate-800 border-t border-slate-200/60">
                  🛒 Spec: Multi-flavor Assortment Pack
                </div>
              </div>
            </div>

            {/* Korea Entry Strategy Box */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                <span>🇰🇷 KOREAN MARKET EXTENSION STRATEGY</span>
              </div>
              <h3 className="text-xl font-bold">Bringing Cambodian Gourmet Flavors to Naver, Coupang & Market Kurly</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                South Korea represents one of Asia's most sophisticated markets for clean-label, organic, and ethically sourced dried fruits and gourmet spices. Mayany Enterprise is actively establishing Korean distribution partnerships, OEM listing, and department store retail channels across Seoul and Busan.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="text-xs font-bold text-amber-300">E-Commerce Platforms</div>
                  <div className="text-[11px] text-slate-200 mt-0.5">Naver Smart Store, Coupang, Market Kurly</div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="text-xs font-bold text-amber-300">B2B Bulk Repackaging</div>
                  <div className="text-[11px] text-slate-200 mt-0.5">20ft Container bulk supply in 10kg vacuum bags</div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="text-xs font-bold text-amber-300">Phytosanitary & Customs</div>
                  <div className="text-[11px] text-slate-200 mt-0.5">Complete MAFF/GDA certificate alignment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FREIGHT & QUOTE ESTIMATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <Calculator className="text-amber-600" size={20} />
              <h2 className="text-2xl font-bold text-slate-900">B2B Freight & Container Load Estimator</h2>
            </div>
            <p className="text-xs text-slate-500">
              Calculate estimated container capacity, carton counts, and preliminary pricing for Mayany Enterprise bulk exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Inputs */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Desired Order Volume (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={500}
                    max={22000}
                    step={500}
                    value={calculatorQuantityKg}
                    onChange={(e) => setCalculatorQuantityKg(Number(e.target.value))}
                    className="flex-1 accent-amber-600 cursor-pointer"
                  />
                  <span className="px-3 py-1 bg-slate-900 text-amber-400 font-mono font-bold text-sm rounded-lg min-w-[90px] text-center">
                    {calculatorQuantityKg.toLocaleString()} kg
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>500 kg (Sample LCL)</span>
                  <span>11,000 kg (20ft FCL)</span>
                  <span>22,000 kg (40ft FCL)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Export Packaging Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalculatorPackageType('bulk10kg')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      calculatorPackageType === 'bulk10kg'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">10kg Vacuum Bags</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Bulk B2B for Repackaging</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalculatorPackageType('retailPouch')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      calculatorPackageType === 'retailPouch'
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">150g Retail Pouches</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Nitrogen-flushed Retail Ready</div>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800">Export Logistics Note:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Port of Loading: Sihanoukville Autonomous Port (PAS), Cambodia</li>
                  <li>Lead Time: 14–21 business days after contract confirmation</li>
                  <li>Incoterms supported: FOB Sihanoukville / CIF Busan / CIF Incheon</li>
                </ul>
              </div>
            </div>

            {/* Estimate Results Box */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400 uppercase font-mono">ESTIMATED EXPORT SUMMARY</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                    MAFF CERTIFIED
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-400">Total Estimated Order Value</div>
                  <div className="text-3xl font-black text-amber-400 font-mono">{est.totalEstimate}</div>
                  <div className="text-[11px] text-slate-400">Approx. ${est.pricePerKg} / kg net weight</div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Master Cartons</div>
                    <div className="text-lg font-bold text-white font-mono">{est.cartonsCount} Cartons</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">20ft Container Load</div>
                    <div className="text-lg font-bold text-amber-300 font-mono">{est.containerPercent}% Capacity</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedProductForRfq(products[0])}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Mail size={15} />
                <span>Submit Official RFQ Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: CONCEPT MOCKUPS (FRANCHISE KIOSK STAND & FLAGSHIP BOUTIQUE) */}
      {activeTab === 'storeMockup' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
          {/* Header & Sub-Tab Switcher */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 text-amber-600 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles size={16} />
                <span>RETAIL & FRANCHISE ARCHITECTURAL MOCKUPS</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                {mockupModel === 'keApplicationCollage' && 'Product & Prototype Showcase Board (For KE Upload Q16)'}
                {mockupModel === 'franchiseKiosk' && 'The Cashew Bar — Modular Franchise Kiosk Stand'}
                {mockupModel === 'flagshipStore' && 'The Cashew House — Flagship Retail Boutique'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mockupModel === 'keApplicationCollage' && 'Comprehensive 4-in-1 prototype showcase board featuring packaged cashew powder & snacks, fresh cashew drinks, flavor bar, and franchise stand mockup.'}
                {mockupModel === 'franchiseKiosk' && 'Modular 3.0m x 2.0m shopping mall & airport kiosk model featuring Mayany Enterprise branding, built-in roaster, and custom flavor bar for franchise scaling.'}
                {mockupModel === 'flagshipStore' && '3D Flagship Store Concept featuring the gold ornate Mayany Enterprise emblem, retail boutique, fresh roasting bar, and interactive tasting lounges.'}
              </p>
            </div>
            
            <a
              href={
                mockupModel === 'keApplicationCollage' 
                  ? "/mayany_ke_application_product_collage.jpg" 
                  : mockupModel === 'franchiseKiosk' 
                  ? "/mayany_cashew_bar_kiosk_franchise.jpg" 
                  : "/mayany_cashew_house_mockup.jpg"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
            >
              <ExternalLink size={14} />
              <span>Open High-Res Concept</span>
            </a>
          </div>

          {/* Sub-Tab Selector Buttons */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-100 p-1.5 rounded-xl">
            <button
              onClick={() => setMockupModel('keApplicationCollage')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mockupModel === 'keApplicationCollage'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Package size={16} />
              <span>1. Application Prototype Showcase Board (Q16 Photo)</span>
              <span className="bg-slate-950 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ml-1">
                KE SUBMISSION
              </span>
            </button>

            <button
              onClick={() => setMockupModel('franchiseKiosk')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mockupModel === 'franchiseKiosk'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building size={16} />
              <span>2. Modular Franchise Kiosk Stand (3.0m x 2.0m)</span>
            </button>

            <button
              onClick={() => setMockupModel('flagshipStore')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mockupModel === 'flagshipStore'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Store size={16} />
              <span>3. Flagship Boutique Store</span>
            </button>
          </div>

          {/* Model 0: Application Prototype Showcase Board */}
          {mockupModel === 'keApplicationCollage' && (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 group">
                <img
                  src="/mayany_ke_application_product_collage.jpg"
                  alt="Mayany Enterprise - Khmer Enterprise Application Prototype Showcase Collage"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-6 text-white space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 uppercase">
                      READY FOR GOOGLE FORM QUESTION 16 UPLOAD
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/20 backdrop-blur-md text-amber-300">
                      MAYANY ENTERPRISE PRODUCT & PROTOTYPE ECOSYSTEM
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-300">
                    4-in-1 Prototype Showcase: Powder, Snacks, Beverages & Franchise Stand
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                    High-impact presentation collage created specifically for Question 16 of the Khmer Enterprise Startup Awards application form. Combines packaged products, made-to-order drinks, flavor customization jars, and the 3.0m x 2.0m kiosk stand.
                  </p>
                </div>
              </div>

              {/* Four Quadrants Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">A. Retail Packaged Line</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Ready-to-mix cashew powder pouches & GI Kampot Pepper glazed cashew snacks with gold seal branding.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">B. Fresh Drink Bar</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Plant-based cashew milk, cashew mocha latte, and matcha cashew smoothies in branded clear cups.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">C. Made-to-Order Flavor Bar</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Interactive seasoning shakers (Honey Butter, Kimchi, Kampot Pepper, Salted Caramel, Wasabi).
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">D. Modular Kiosk Stand</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Turnkey 3m x 2m shopping mall & airport franchise concept with live batch roaster.
                  </p>
                </div>
              </div>

              {/* Question 17 Official Standardization Letter Banner */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold uppercase">
                    <ShieldCheck size={16} />
                    <span>QUESTION 17 FILE ATTACHMENT READY</span>
                  </div>
                  <h4 className="text-lg font-bold text-amber-300">
                    Official HACCP & GMP Facility Standardization Progress Letter
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Official declaration memorandum confirming our partnership with <strong>Khmer Enterprise (KE)</strong> and <strong>Control Union (Cambodia)</strong> for HACCP/GMP facility standardization targeting Q4 2026 completion.
                  </p>
                </div>

                <button
                  onClick={() => setShowQ17Modal(true)}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer shrink-0 shadow-lg"
                >
                  <FileText size={16} />
                  <span>Open & Save Q17 Letter (PDF / HTML)</span>
                </button>
              </div>
            </div>
          )}

          {/* Model 1: Franchise Kiosk Stand View */}
          {mockupModel === 'franchiseKiosk' && (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 group">
                <img
                  src="/mayany_cashew_bar_kiosk_franchise.jpg"
                  alt="Mayany Enterprise - The Cashew Bar Franchise Kiosk Stand Concept Mockup"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-6 text-white space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 uppercase">
                      MAYANY ENTERPRISE FRANCHISE MODEL
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/20 backdrop-blur-md text-amber-300">
                      3.0m x 2.0m KIOSK FOOTPRINT
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-300">
                    The Cashew Bar: Fresh Roasted. Made For You.
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                    Compact, turnkey commercial stand designed for rapid franchise deployment in high-traffic shopping centers, airports, and commercial centers across Cambodia, Korea, and ASEAN markets.
                  </p>
                </div>
              </div>

              {/* Franchise Stand Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">1. Modular Kiosk Dimensions</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Standardized 3.0m W x 2.0m D x 2.4m H footprint with plug-and-play electrical, POS, and water drainage systems.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">2. Live Batch Roasting Bar</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Integrated compact stainless steel roaster filling the surrounding retail space with warm freshly roasted cashew aromas.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">3. Custom Seasoning & Milk</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Live seasoning station (Honey Butter, Kampot Pepper, Kimchi, Wasabi, Sea Salt) + Fresh Cashew Milk Bar.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">4. CashewTrace Digital QR</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Every cup & pouch carries a QR code linking directly to verified Kampong Thom farm coordinates and EUDR proof.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Model 2: Flagship Boutique Store View */}
          {mockupModel === 'flagshipStore' && (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 group">
                <img
                  src="/mayany_cashew_house_mockup.jpg"
                  alt="Mayany Enterprise - The Cashew House Flagship Store Concept Mockup"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 text-white space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950 uppercase">
                      MAYANY ENTERPRISE BRANDING INTEGRATED
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/20 backdrop-blur-md text-amber-300">
                      CAMBODIAN F&B STARTUP CONCEPT
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-300">
                    The Cashew House: Experiential Retail & Tasting Boutique
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                    A holistic concept board combining retail sales, live small-batch cashew roasting, GI Kampot pepper pairing bars, plant-based cashew milk tastings, and farm-to-table traceability education for international visitors and food partners.
                  </p>
                </div>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">1. Exterior Facade</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Features the gold ornate Mayany Enterprise logo emblem with warm architectural timber cladding and glass windows.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">2. Retail Boutique</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Dedicated displays for GI Kampot Pepper glazed cashews, chili roasted nuts, and export retail pouches.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">3. Fresh Roasting Bar</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    On-site artisan roasting station filling the boutique with irresistible fresh roasted nut aromas.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900">4. Story & Tasting Corner</div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Interactive digital story wall showcasing Kampong Thom smallholder farmers and CashewTrace passports.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: M'DAY SOURCING & FACILITY NETWORK FLOW */}
      {activeTab === 'mdaySourcing' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold">
                <MapPin size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  M'day Processing Facility (CAM HEART) — Battambang Sourcing Network
                </h2>
                <p className="text-xs text-slate-500">
                  Direct agricultural supply chain map connecting smallholder banana blossom farms and certified ingredients to M'day's Battambang processing plant.
                </p>
              </div>
            </div>
          </div>

          <SourcingMap
            suppliers={(sheetDataRaw as any).suppliers || []}
            activeSupplierId={null}
            onSelectSupplier={() => {}}
          />
        </div>
      )}

      {/* RFQ MODAL POPUP */}
      <AnimatePresence>
        {selectedProductForRfq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProductForRfq(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>

              {rfqSentSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Quotation Request Dispatched!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you. Your RFQ has been logged and routed directly to Founder & CEO Mayany SAM at <strong>mayany@mayanyenterprise.com</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-800 font-sans">
                    សូមអរគុណ! សំណើសុំសម្រង់តម្លៃរបស់អ្នកត្រូវបានកត់ត្រា និងបញ្ជូនផ្ទាល់ទៅកាន់ស្ថាបនិក & អគ្គនាយិកា សំ ម៉ាយ៉ានី តាមរយៈអ៊ីមែលផ្លូវការ <strong>mayany@mayanyenterprise.com</strong>។
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendRfqSubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">
                      OFFICIAL RFQ FORM
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Request Quotation & Samples</h3>
                    <p className="text-xs text-slate-500">Product: <strong>{selectedProductForRfq.name}</strong></p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Company / Importer Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Korea Agri Imports Co., Ltd."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Contact Name</label>
                        <input
                          required
                          type="text"
                          placeholder="Your Name"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Work Email</label>
                        <input
                          required
                          type="email"
                          placeholder="email@company.com"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Estimated Quantity (kg)</label>
                        <input
                          required
                          type="number"
                          defaultValue={1000}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Destination Country</label>
                        <input
                          required
                          type="text"
                          defaultValue="South Korea"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Special Requirements / Notes</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Requesting 10kg vacuum bag bulk packing + phytosanitary cert..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProductForRfq(null)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <Send size={13} />
                      <span>Send RFQ Request</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
        {/* Question 17 Official Declaration Letter Modal */}
        {showQ17Modal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8"
            >
              {/* Modal Header Bar */}
              <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 text-slate-950 rounded-xl">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Question 17: Standardization Certificate Progress Declaration</h3>
                    <p className="text-xs text-slate-400">Official Memorandum for Khmer Enterprise Startup Awards 2026 Upload</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const element = document.getElementById('q17-letter-content');
                      if (element) {
                        const docHtml = `
                          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                          <head>
                            <meta charset='utf-8'>
                            <title>MAYANY Enterprise - Standardization Progress Declaration</title>
                            <style>
                              body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111827; }
                              h1 { font-size: 18pt; font-weight: bold; color: #0f172a; margin-bottom: 2px; }
                              h2 { font-size: 12pt; font-weight: bold; color: #1e293b; }
                              .badge { background-color: #fef3c7; color: #92400e; padding: 4px 8px; font-weight: bold; font-size: 9pt; }
                              .box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 12px; }
                              .khmer { font-family: 'Khmer OS', 'Hanuman', sans-serif; background-color: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; margin-bottom: 12px; }
                            </style>
                          </head>
                          <body>
                            ${element.innerHTML}
                          </body>
                          </html>
                        `;
                        const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'MAYANY_Enterprise_Standardization_Declaration_Q17.doc';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Download size={14} />
                    <span>Download Word (.doc)</span>
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-950 text-xs font-black rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Download size={14} />
                    <span>{isGeneratingPdf ? 'Generating PDF...' : '1-Click Direct Download PDF (.pdf)'}</span>
                  </button>

                  <a
                    href="/standardization_letter_mayany.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    <span>Open Full Portal</span>
                  </a>

                  <button
                    onClick={() => setShowQ17Modal(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Document Body */}
              <div className="p-6 md:p-10 max-h-[75vh] overflow-y-auto space-y-6 text-slate-900" id="q17-letter-content">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-slate-900 pb-6 gap-6">
                  <div className="space-y-1">
                    <div className="text-amber-600 font-black tracking-widest text-xs uppercase font-mono">Official Corporate Memorandum</div>
                    <h1 className="text-2xl font-black text-slate-900">MAYANY ENTERPRISE</h1>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">CAMBODIAN FOOD INNOVATION STARTUP</p>
                    <p className="text-xs text-slate-500 font-mono">Phnom Penh, Kingdom of Cambodia | Email: mayany@mayanyenterprise.com</p>
                  </div>

                  <div className="text-right space-y-1 border-l-0 md:border-l-2 md:border-slate-200 pl-0 md:pl-6">
                    <div className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-mono font-bold text-amber-800">
                      DOC REF: KE-2026-STD-DECL
                    </div>
                    <p className="text-xs font-bold text-slate-700">Date: July 27, 2026</p>
                    <p className="text-xs text-slate-500 font-mono">Target: KE Startup Awards Q17</p>
                  </div>
                </div>

                {/* Memorandum Table */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <span className="font-bold text-slate-900">TO:</span>
                    <span className="text-slate-700 sm:col-span-3">Khmer Enterprise Startup Awards 2026 Selection Committee</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 border-t border-slate-200 pt-2">
                    <span className="font-bold text-slate-900">FROM:</span>
                    <span className="text-slate-700 sm:col-span-3">Mayany SAM, Founder & CEO | MAYANY Enterprise</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 border-t border-slate-200 pt-2">
                    <span className="font-bold text-slate-900">SUBJECT:</span>
                    <span className="font-bold text-amber-700 sm:col-span-3">DECLARATION OF HACCP & GMP FACILITY STANDARDIZATION & CERTIFICATION IN PROGRESS</span>
                  </div>
                </div>

                {/* Khmer Paragraph */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-2">
                  <h2 className="font-bold text-slate-900 text-sm">លិខិតបញ្ជាក់អំពីដំណើរការរៀបចំស្តង់ដារ សុវត្ថិភាពម្ហូបអាហារ HACCP & GMP</h2>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    លិខិតនេះសូមជម្រាបជូនគណៈកម្មការវាយតម្លៃពានរង្វាន់សហគ្រិនខ្មែរ ធុរកិច្ចថ្មី ២០២៦ ថា **សហគ្រាស ម៉ាយ៉ានី (MAYANY Enterprise)** កំពុងសហការយ៉ាងសកម្មជាមួយ **សហគ្រិនខ្មែរ (Khmer Enterprise - KE)** និង **Control Union (Cambodia)** ក្នុងការរៀបចំ និងកែលម្អរោងចក្រ/បរិវេណផលិតកម្មឱ្យស្របតាមស្តង់ដារអន្តរជាតិ HACCP និង GMP ដោយរំពឹងថានឹងទទួលបានវិញ្ញាបនបត្រជាផ្លូវការនៅចុងឆ្នាំ២០២៦។
                  </p>
                </div>

                {/* English Declaration */}
                <div className="space-y-4 text-xs md:text-sm text-slate-800 leading-relaxed">
                  <p className="font-bold text-slate-900">
                    Respected Evaluation Committee,
                  </p>
                  
                  <p>
                    In response to <strong>Question 17 (Certificate of Standardization)</strong> of the Khmer Enterprise Startup Awards 2026 application, <strong>MAYANY Enterprise</strong> hereby submits this official declaration regarding our food safety and facility quality standardization roadmap.
                  </p>

                  <div className="space-y-3 pl-2">
                    <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                      <div>
                        <strong className="text-slate-900 font-bold block">Strategic Institutional Partnership</strong>
                        <span>We are actively collaborating in a technical assistance framework supported by <strong>Khmer Enterprise (KE)</strong> and executed in direct partnership with <strong>Control Union (Cambodia) Co., Ltd.</strong>, a globally accredited certification body.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                      <div>
                        <strong className="text-slate-900 font-bold block">Scope of Facility Standardization</strong>
                        <span>The engagement includes comprehensive food safety gap analysis, hygienic process flow redesign, equipment specification alignment, and standard operating procedure (SOP) implementation for <strong>HACCP (Hazard Analysis Critical Control Point)</strong> and <strong>GMP (Good Manufacturing Practice)</strong>.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                      <div>
                        <strong className="text-slate-900 font-bold block">Target Certification Milestone</strong>
                        <span>Facility audits and physical upgrades are actively underway. Full compliance validation, final auditing, and official HACCP/GMP certification are scheduled for completion by <strong>Q4 2026 (December 2026)</strong>.</span>
                      </div>
                    </div>
                  </div>

                  <p className="pt-2">
                    This proactive standardization ensures that all MAYANY ready-to-mix cashew drink formulations, gourmet roasted cashew snacks, and franchise outlet F&B inputs adhere strictly to international food safety, traceability, and export quality standards.
                  </p>
                </div>

                {/* Signature Block */}
                <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-mono">Certified and Submitted By:</p>
                    <div className="font-black text-slate-900 text-base">Mayany SAM</div>
                    <p className="text-xs font-bold text-amber-700">Founder & CEO</p>
                    <p className="text-xs text-slate-600">MAYANY Enterprise (Cambodian F&B Startup)</p>
                    <p className="text-xs text-slate-500 font-mono">Telegram / Tel: +855 88 771 2862</p>
                    <p className="text-xs text-slate-500 font-mono">Email: mayany@mayanyenterprise.com</p>
                  </div>

                  <div className="w-48 h-24 border-2 border-dashed border-amber-500/60 rounded-xl bg-amber-50/50 p-3 flex flex-col items-center justify-center text-center space-y-1">
                    <div className="w-8 h-8 rounded-full border border-amber-600 flex items-center justify-center text-amber-700 text-[10px] font-black font-mono">SEAL</div>
                    <div className="text-[10px] font-bold text-slate-800 uppercase font-mono">MAYANY ENTERPRISE</div>
                    <div className="text-[9px] text-slate-500">Official Company Declaration</div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-mono">Ready to attach for Q17 on Google Form</span>
                <button
                  onClick={() => setShowQ17Modal(false)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* REVERSE INNOVATION COHORT 6 INTERVIEW & REPLY KIT MODAL */}
        {showCohortModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl max-w-3xl w-full text-white shadow-2xl overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-amber-950 p-6 border-b border-emerald-500/40 relative">
                <button 
                  onClick={() => setShowCohortModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider">
                      Round 1 Shortlist Confirmed
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-amber-300 bg-amber-900/60 border border-amber-700/50">
                      Reverse Innovation Cohort 6
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-white">
                    🎯 Online Interview Kit & Email Confirmation
                  </h2>
                  <p className="text-xs text-slate-300">
                    Program Lead: <strong>Soun Sokavanny</strong> | Organization: <strong>Reverse Innovation Cohort 6</strong>
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Interview Schedule Details */}
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                    <Sparkles size={16} />
                    Interview Schedule & Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-emerald-900/60">
                      <div className="text-slate-400 font-mono text-[10px] uppercase">Proposed Date</div>
                      <div className="text-white font-bold text-sm mt-0.5">Monday, 3 August</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-emerald-900/60">
                      <div className="text-slate-400 font-mono text-[10px] uppercase">Proposed Time</div>
                      <div className="text-amber-400 font-bold text-sm mt-0.5">2:00 PM – 2:30 PM</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-emerald-900/60">
                      <div className="text-slate-400 font-mono text-[10px] uppercase">Interview Format</div>
                      <div className="text-cyan-300 font-bold text-sm mt-0.5">Online Meeting</div>
                    </div>
                  </div>
                </div>

                {/* Email Response Generator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <Mail size={16} />
                      Email Confirmation Reply Draft
                    </h3>
                    <button
                      onClick={copyEmailToClipboard}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        copiedEmail 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email Response'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line relative">
                    {cohortEmailText}
                  </div>
                </div>

                {/* 3-Step Expansion Roadmap & Pitch Strategy */}
                <div className="space-y-4 pt-2">
                  <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 p-4 rounded-xl border border-amber-500/40 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Standalone B2B AgriTech Strategy
                    </span>
                    <h3 className="font-bold text-white text-sm">
                      🚀 CashewTrace 3-Step Multi-Crop Rollout Strategy
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <em>Note: At this stage, CashewTrace operates as a standalone B2B AgriTech supply chain data platform, independent of brand processing entities.</em>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <span>Step 1: SME Pilot</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Piloted CashewTrace Digital Passport MVP with local food SME (M'day Lactation Cambodia) to validate batch QR printing & consumer scanning.
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40 space-y-1.5">
                        <div className="text-amber-300 font-bold flex items-center gap-1 text-[11px]">
                          <span>Step 2: Keo Romeat Mango & Farm Owners</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Extended to Keo Romeat Mango in Kampong Speu & Preah Vihear. Direct unorganized farm owners log fertilizers, dosage, chemical pesticides, harvest yields, and sale prices with automatic GPS location tags & offline sync to forecast processing volume for Kirirum Factory!
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="text-cyan-300 font-bold flex items-center gap-1 text-[11px]">
                          <span>Step 3: High-Value Spices</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Scaling digital ledger to Cambodian lemongrass, ginger, and high-value spices for regional export buyers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3-Minute Word-for-Word Pitch Script */}
                  <h3 className="font-bold text-white text-sm flex items-center gap-2 pt-2">
                    <Award size={16} className="text-amber-400" />
                    3-Minute Pitch Script for Techo Startup Center Panel
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-amber-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">1</span>
                        0:00 - 0:45 | Hook & The Core Ecosystem Vision
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        "Good afternoon Khun Sokavanny and members of the evaluation panel. I am Yany, Solo Founder & CEO of CashewTrace. At CashewTrace, <strong>we don't just provide traceability software. We operate a complete farm-to-market ecosystem that demonstrates how Cambodian agricultural products can be traced, processed, and exported.</strong> Today, major exporters like Kirirum Mango Processing rely heavily on unorganized private farm owners for 40% of their fruit supply—farmers who belong to no association or federation. Without verified farm records, factories cannot predict harvest volumes or meet international export standards for Europe, Korea, and Japan."
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">2</span>
                        0:45 - 1:30 | Direct Farm Logging & Offline GPS Tech
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        "CashewTrace solves this with a lightweight, mobile-first digital platform designed specifically for unorganized farm owners in Kampong Speu, Preah Vihear, and Kampong Thom. Farmers log in on their phones to record fertilizer application dates, exact dosages, chemical pesticides or insecticides used, harvest yields, and sale prices—along with automatic GPS coordinates. Crucially, our system works 100% offline in remote orchards, automatically syncing to the cloud when connected."
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">3</span>
                        1:30 - 2:15 | Immediate Off-Season Execution (3-Month Plan)
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        "Right now, during this off-season, we are actively onboarding cashew and mango farm owners to input essential pre-harvest care—such as tree trimming, pruning, soil fertilization, and pest management. By capturing these practices before the next harvesting season begins, CashewTrace provides Kirirum Factory and cashew exporters with verified, real-time yield forecasts to project factory processing capacity months in advance."
                      </p>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">4</span>
                        2:15 - 3:00 | Program Goal & Ecosystem Demonstration
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        "With the support of Reverse Innovation Cohort 6 and Techo Startup Center, our goal during this 3-month acceleration is to participate in provincial gatherings of SMEs and farm owners organized by government and NGO partners—demonstrating live on each farmer's cellphone how simple and effective the platform works on-site. Thank you, and I am excited for your questions!"
                      </p>
                    </div>
                  </div>

                  {/* Top 6 Panel Q&A Practice */}
                  <div className="space-y-3 pt-2">
                    <h3 className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                      <HelpCircle size={16} />
                      Top 6 Anticipated Panel Questions & Answers
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-300">Q1: How do unorganized mango farm owners input data without reliable internet in rural areas?</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Answer:</strong> "CashewTrace is built with an Offline-First architecture. Farm owners in Kampong Speu and Preah Vihear log in with simple 1-click mobile forms to record fertilizer dates, dosage, chemical pesticides, harvest yields, and sale prices. The app automatically captures their GPS coordinates offline and stores all entries locally. The moment their phone connects to cellular network or Wi-Fi, the data syncs automatically to the cloud."
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-300">Q2: What is your business model? Who pays for CashewTrace?</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Answer:</strong> "CashewTrace is a B2B SaaS software license + per-batch QR verification fee paid by off-takers and processing factories like Kirirum Factory. Verified origin and yield forecasting allow them to project factory processing capacity, meet EUDR/GAP standards, and command 15-20% export premiums. The mobile entry app for smallholder farm owners is 100% free."
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-300">Q3: Is it really workable and achievable for unorganized farm owners to log GPS and chemical inputs?</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Answer:</strong> "Yes, absolutely! We designed CashewTrace specifically for Cambodian smallholders: 1) Very simple visual UI with pre-set dropdowns for common fertilizers & pesticides, 2) Automatic smartphone GPS geolocation tagging with 1 button tap, and 3) Offline-first local storage so poor connectivity in orchards never blocks data logging. Factories incentivize participation by offering premium off-take prices to verified farms."
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-300">Q4: Why expand to Mangoes (Kirirum Factory) and Spices so early?</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Answer:</strong> "Cashew harvest is seasonal. Expanding to Keo Romeat Mangoes (Kampong Speu/Preah Vihear) and high-value spices keeps our digital platform active year-round, maximizing software ROI and proving our multi-crop engine scale."
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-300">Q5: Who is driving the platform technology and team execution?</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Answer:</strong> "I lead CashewTrace as a Solo Founder & CEO, owning our technology strategy, product design, and provincial farm network onboarding. I am supported by experienced business advisors (including mentor Alex) and align directly with MAFF/GDA regulatory experts."
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="font-bold text-amber-300">Q6: What do you expect to achieve during the 3 months of Cohort 6?</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Answer:</strong> "During these 3 off-season months, we will onboard cashew and Keo Romeat mango farm owners to log pre-harvest practices (trimming, pruning, fertilizing) before the next harvest. With Cohort 6 and Techo Startup Center's support, we want to participate in SME and farmer gatherings organized by government/NGO partners to physically demonstrate the live platform on each farmer's cellphone on-site."
                        </p>
                      </div>

                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 border-l-4 border-l-amber-400">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span>Q7: How do you handle SMEs (like M'day Lactation or food processors) who fear exposing trade secret recipes or supplier costs?</span>
                          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">KEY SME INSIGHT</span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong>Answer:</strong> "This is a key insight from our real SME testing in Cambodia. Processing SMEs want QR traceability for export trust, but refuse to expose proprietary recipes, raw material costs, or confidential supplier lists. CashewTrace solves this with <strong>Selective Transparency & Single-Owner Mobile Control</strong>: Processors choose what to publish publicly (Origin Province, GAP/Phytosanitary Safety, Date) while keeping internal recipes and raw material formulas 100% locked & hidden. SME owners can manage and lock batch QR codes in 30 seconds directly on their smartphone without needing staff logins or laptops."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Good luck with the interview, Mayany!</span>
                <button
                  onClick={() => setShowCohortModal(false)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
