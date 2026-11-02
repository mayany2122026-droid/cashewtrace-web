import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface TwoAppsInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const TwoAppsInstallModal: React.FC<TwoAppsInstallModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [copiedApp, setCopiedApp] = useState<string | null>(null);

  if (!isOpen) return null;

  const isKm = lang === 'km';

  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const personalUrl = `${baseUrl}?app=personal`;
  const founderUrl = `${baseUrl}?app=founder`;

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedApp(key);
    setTimeout(() => setCopiedApp(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                ដំឡើង 2 កម្មវិធីដាច់ដោយឡែក (2 Separate Apps)
              </h3>
              <p className="text-xs text-slate-500">
                Mayany SAM Personal vs Founder Admin
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Apps Cards */}
        <div className="space-y-3">
          
          {/* App 1: Mayany SAM Personal */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <div>
                  <h4 className="text-sm font-black text-rose-950">MyDailyPA — Mayany SAM</h4>
                  <p className="text-[11px] text-rose-700 font-semibold">គណនីផ្ទាល់ខ្លួន (mydailypa.com/?app=personal)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-200 text-rose-900">
                ?app=personal
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ដាច់ដោយឡែកសម្រាប់កត់ត្រាចំណូល-ចំណាយផ្ទាល់ខ្លួន និងគ្រួសារ ដោយមិនលាយឡំទិន្នន័យជាមួយអ្នកដទៃ។
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={personalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <span>បើកកម្មវិធី</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleCopy(personalUrl, 'personal')}
                className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1"
              >
                {copiedApp === 'personal' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedApp === 'personal' ? 'បានចម្លង!' : 'ចម្លង Link'}</span>
              </button>
            </div>
          </div>

          {/* App 2: Founder Admin */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <div>
                  <h4 className="text-sm font-black text-indigo-950">MyDailyPA — Founder Admin</h4>
                  <p className="text-[11px] text-indigo-700 font-semibold">088 771 2862 / mayany@mydailypa.com</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-200 text-indigo-900">
                ?app=founder
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ផ្ទាំងគ្រប់គ្រងកណ្តាលរបស់ស្ថាបនិក (Founder Control Hub) សម្រាប់មើលស្ថិតិ ទាញយក JSON Backup និងកំណត់ប្រព័ន្ធ។
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={founderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <span>បើក Admin</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleCopy(founderUrl, 'founder')}
                className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-1"
              >
                {copiedApp === 'founder' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedApp === 'founder' ? 'បានចម្លង!' : 'ចម្លង Link'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
