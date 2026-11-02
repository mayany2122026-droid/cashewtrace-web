import React, { useState, useEffect } from 'react';
import { 
  Building2, Phone, Send, Sparkles, CheckCircle2, ShieldCheck, 
  ArrowRight, Users, Eye, Check, X, Award, FileSpreadsheet, Lock
} from 'lucide-react';
import { collection, doc, setDoc, getDocs, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseService';

export interface RegisteredSmeRecord {
  id: string;
  smeName: string;
  phoneOrTelegram: string;
  registeredAt: number;
  lastActiveAt: number;
  productCountEstimate?: number;
  selectedSector?: string;
  labelsCreatedCount?: number;
  notes?: string;
}

interface SmeRegistrationBannerProps {
  onRegistered?: (record: RegisteredSmeRecord) => void;
  activeSector?: string;
}

export default function SmeRegistrationBanner({ onRegistered, activeSector = 'Cashew / Multi-Product' }: SmeRegistrationBannerProps) {
  const [smeName, setSmeName] = useState('');
  const [phoneOrTelegram, setPhoneOrTelegram] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSme, setCurrentSme] = useState<RegisteredSmeRecord | null>(null);
  const [showAdminDirectoryModal, setShowAdminDirectoryModal] = useState(false);
  const [adminDirectory, setAdminDirectory] = useState<RegisteredSmeRecord[]>([]);

  // Check local cache on mount
  useEffect(() => {
    const cached = localStorage.getItem('cashewtrace_sme_profile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as RegisteredSmeRecord;
        setCurrentSme(parsed);
        setIsSaved(true);
        setSmeName(parsed.smeName);
        setPhoneOrTelegram(parsed.phoneOrTelegram);
        if (onRegistered) onRegistered(parsed);
      } catch (e) {
        console.error('Error reading cached SME profile:', e);
      }
    }
  }, []);

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!smeName.trim() || !phoneOrTelegram.trim()) return;

    setLoading(true);
    try {
      const cleanPhone = phoneOrTelegram.trim().replace(/[^a-zA-Z0-9+@._]/g, '');
      const docId = `sme_${cleanPhone.toLowerCase() || Date.now().toString()}`;

      const newRecord: RegisteredSmeRecord = {
        id: docId,
        smeName: smeName.trim(),
        phoneOrTelegram: phoneOrTelegram.trim(),
        registeredAt: currentSme?.registeredAt || Date.now(),
        lastActiveAt: Date.now(),
        selectedSector: activeSector,
        labelsCreatedCount: (currentSme?.labelsCreatedCount || 0) + 1,
      };

      // 1. Save to local storage
      localStorage.setItem('cashewtrace_sme_profile', JSON.stringify(newRecord));
      setCurrentSme(newRecord);
      setIsSaved(true);

      // 2. Save directly into Firestore database
      const docRef = doc(db, 'registered_smes', docId);
      await setDoc(docRef, newRecord, { merge: true });

      if (onRegistered) onRegistered(newRecord);
    } catch (error) {
      console.error('Error registering SME in background:', error);
      // Even if offline, local storage succeeds
      setIsSaved(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAdminList = async () => {
    setShowAdminDirectoryModal(true);
    try {
      const colRef = collection(db, 'registered_smes');
      const snap = await getDocs(colRef);
      const list: RegisteredSmeRecord[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as RegisteredSmeRecord);
      });
      list.sort((a, b) => (b.lastActiveAt || 0) - (a.lastActiveAt || 0));
      setAdminDirectory(list);
    } catch (err) {
      console.error('Error loading SME directory:', err);
    }
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-3 sm:p-4 rounded-2xl border border-amber-500/30 shadow-lg relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Friendly Purpose Text */}
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                ឥតគិតថ្លៃ ១០០% • 100% Free For All MSMEs
              </span>
              <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>CS 001 MISTI Verified</span>
              </span>
            </div>
            
            <h3 className="text-xs sm:text-sm font-bold text-white font-sans flex items-center gap-1.5">
              <span>ចុះឈ្មោះអាជីវកម្មសាមញ្ញ (SME Quick-Pass) ដើម្បីរក្សាទុក & ប្រើប្រាស់គំរូស្លាកសញ្ញា</span>
            </h3>
            
            <p className="text-[11px] text-slate-300 font-sans leading-tight">
              គ្រាន់តែបញ្ចូល <strong className="text-amber-200">ឈ្មោះសហគ្រាស</strong> និង <strong className="text-amber-200">លេខទូរស័ព្ទ/Telegram</strong> តែប៉ុណ្ណោះ ដើម្បីទទួលបានការគាំទ្រ & មិនបាត់បង់ទិន្នន័យ។
            </p>
          </div>

          {/* Right: The 2-Field Quick Form or Saved Badge */}
          {isSaved && currentSme ? (
            <div className="flex items-center gap-2 bg-slate-950/80 border border-emerald-500/40 p-2.5 rounded-xl self-start md:self-auto">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="text-left font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-300">{currentSme.smeName}</span>
                  <span className="text-[9px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.2 rounded font-mono">បានភ្ជាប់</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">{currentSme.phoneOrTelegram}</p>
              </div>

              <div className="flex items-center gap-1 ml-2 border-l border-slate-800 pl-2">
                <button
                  type="button"
                  onClick={() => setIsSaved(false)}
                  className="text-[10px] text-slate-400 hover:text-amber-300 underline font-sans cursor-pointer"
                >
                  កែប្រែ
                </button>
                <button
                  type="button"
                  onClick={handleLoadAdminList}
                  title="View Registry Telemetry"
                  className="p-1 rounded text-slate-500 hover:text-slate-200 cursor-pointer"
                >
                  <Users size={14} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
              <div className="w-full sm:w-44">
                <input
                  type="text"
                  required
                  placeholder="ឈ្មោះសហគ្រាស (SME Name)"
                  value={smeName}
                  onChange={(e) => setSmeName(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                />
              </div>

              <div className="w-full sm:w-44">
                <input
                  type="text"
                  required
                  placeholder="លេខទូរស័ព្ទ ឬ Telegram"
                  value={phoneOrTelegram}
                  onChange={(e) => setPhoneOrTelegram(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <span>កំពុងភ្ជាប់...</span>
                ) : (
                  <>
                    <Send size={13} />
                    <span>ភ្ជាប់ & រក្សាទុក</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Admin Registry Telemetry Modal (For Owner to track who is using) */}
      {showAdminDirectoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="text-amber-400" size={18} />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">បញ្ជីសហគ្រាសដែលបានចុះឈ្មោះប្រើប្រាស់ (SME Usage Directory)</h4>
                  <p className="text-[10px] text-slate-400">ទិន្នន័យរក្សាទុកក្នុង Firestore Cloud Database</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAdminDirectoryModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              <div className="flex items-center justify-between text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 font-medium">
                <span>សរុបសហគ្រាសប្រើប្រាស់ (Total Tracked SMEs): <strong>{adminDirectory.length} សហគ្រាស</strong></span>
                <span className="text-[10px] font-mono bg-amber-200 px-2 py-0.5 rounded">Live Cloud Registry</span>
              </div>

              {adminDirectory.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <p>មិនទាន់មានទិន្នន័យពីចម្ងាយ (ឬទិន្នន័យទើបតែបានរក្សាទុកក្នុង Local Storage)</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {adminDirectory.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 hover:bg-slate-50 flex items-center justify-between text-xs transition">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{item.smeName}</span>
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">#{idx + 1}</span>
                        </p>
                        <p className="text-[11px] text-emerald-700 font-mono font-bold">
                          📞 {item.phoneOrTelegram}
                        </p>
                        {item.selectedSector && (
                          <p className="text-[10px] text-slate-500">
                            វិស័យ: {item.selectedSector}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-[10px] text-slate-400 font-mono">
                        <p>ចុះឈ្មោះ: {new Date(item.registeredAt || Date.now()).toLocaleDateString()}</p>
                        <span className="text-emerald-600 font-bold">សកម្ម: {new Date(item.lastActiveAt || Date.now()).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAdminDirectoryModal(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                បិទផ្ទាំង (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
