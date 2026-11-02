import React, { useState } from 'react';
import { 
  X, ShieldCheck, Download, RefreshCw, Users, 
  Database, FileText, CheckCircle2, Lock
} from 'lucide-react';
import { Entry, UserProfile, SupportedLanguage } from '../types';

interface AdminHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
  currentProfile: UserProfile;
  onResetAllData: () => void;
  onLoadSampleData: () => void;
  lang: SupportedLanguage;
  onOpenLeanCanvas?: () => void;
}

export const AdminHubModal: React.FC<AdminHubModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentProfile,
  onResetAllData,
  onLoadSampleData,
  lang,
  onOpenLeanCanvas,
}) => {
  const [adminKey, setAdminKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(
    currentProfile.role === 'founder' || currentProfile.phoneNumber === '0887712862'
  );

  if (!isOpen) return null;

  const isKm = lang === 'km';

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mydailypa_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === '887712' || adminKey === '0887712862' || adminKey === 'admin') {
      setIsUnlocked(true);
    } else {
      alert('លេខកូដសម្ងាត់មិនត្រឹមត្រូវ! (Incorrect Admin Passcode)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Founder & Admin Control Hub
              </h3>
              <p className="text-xs text-slate-500">
                088 771 2862 / mayany@mydailypa.com
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-700">
              សូមបញ្ចូលលេខកូដសម្ងាត់ Admin (Enter Founder PIN):
            </p>
            <input
              type="password"
              placeholder="កូដសម្ងាត់ (Default: 887712)"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              ដោះសោ Admin Hub
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            {/* System Status Stats */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">ទិន្នន័យកត់ត្រាសរុប</span>
                <p className="text-xl font-black font-mono text-slate-900 mt-0.5">{entries.length} ប្រតិបត្តិការ</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">ស្ថានភាព Local Vault</span>
                <p className="text-xl font-black text-emerald-600 mt-0.5">Active & Synced</p>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="space-y-2">
              {onOpenLeanCanvas && (
                <button
                  onClick={() => {
                    onOpenLeanCanvas();
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>មើល & កែសម្រួល Lean Canvas (AIM Growth Program)</span>
                  </div>
                  <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-bold">2026 Model</span>
                </button>
              )}

              <button
                onClick={handleExportJson}
                className="w-full p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>ទាញយកទិន្នន័យបម្រុងទុក (Export JSON Backup)</span>
                </div>
                <span className="text-[10px] text-indigo-600 font-mono">.json</span>
              </button>

              <button
                onClick={onLoadSampleData}
                className="w-full p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  <span>បញ្ចូលទិន្នន័យគំរូ MSME & ហាង (Load Sample Data)</span>
                </div>
                <span className="text-[10px] text-emerald-600">Demo</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('តើអ្នកពិតជាចង់សម្អាតទិន្នន័យទាំងអស់មែនទេ? (Clear all data?)')) {
                    onResetAllData();
                    onClose();
                  }
                }}
                className="w-full p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-rose-600" />
                  <span>សម្អាតទិន្នន័យទាំងអស់ (Reset All to Clean Slate)</span>
                </div>
                <span className="text-[10px] text-rose-600">Danger</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              🛡️ កំណត់ត្រាទាំងអស់ត្រូវបានការពារក្នុង Isolated Local Storage Vault របស់ឧបករណ៍នីមួយៗ មិនមានការលេចធ្លាយទៅក្រៅឡើយ។
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
