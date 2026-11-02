import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, User, Phone, Briefcase, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertCircle, Tag, Package, Check, RefreshCw
} from 'lucide-react';
import CashewTraceLogo from './CashewTraceLogo';
import { useLanguage } from '../lib/LanguageContext';
import { UserProfile } from './ProjectSignInModal';
import { recordUserSignIn } from '../lib/firebaseService';

interface AppGreetingScreenProps {
  initialProfile: UserProfile | null;
  onContinueToPackaging: (profile: UserProfile) => void;
}

const COMMON_TITLES_KH = [
  { kh: 'ម្ចាស់សហគ្រាស / សិប្បកម្ម (MSME Owner)', en: 'MSME / Enterprise Owner' },
  { kh: 'អ្នកគ្រប់គ្រងរោងចក្រកែច្នៃ', en: 'Processing Facility Manager' },
  { kh: 'ប្រធានផ្នែកវេចខ្ចប់ & ទីផ្សារ', en: 'Packaging & Marketing Lead' },
  { kh: 'អ្នកគ្រប់គ្រងគុណភាព & ស្តង់ដារ (QA/QC)', en: 'Quality & Standards Manager' },
  { kh: 'សហគ្រិនកែច្នៃម្ហូបអាហារ', en: 'Agri-Food Processing Entrepreneur' },
];

export default function AppGreetingScreen({
  initialProfile,
  onContinueToPackaging
}: AppGreetingScreenProps) {
  const { isKhmer } = useLanguage();

  const [fullName, setFullName] = useState(initialProfile?.name || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [title, setTitle] = useState(initialProfile?.title || 'ម្ចាស់សហគ្រាស / អាជីវកម្ម');
  const [customTitle, setCustomTitle] = useState('');
  const [isEditingExisting, setIsEditingExisting] = useState(!initialProfile?.name);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setFullName(initialProfile.name || '');
      setPhone(initialProfile.phone || '');
      if (initialProfile.title) {
        setTitle(initialProfile.title);
      }
    }
  }, [initialProfile]);

  const handleQuickTitleSelect = (tKh: string) => {
    setTitle(tKh);
    setCustomTitle('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const finalTitle = (customTitle.trim() || title.trim()) || 'ម្ចាស់សហគ្រាស / អាជីវកម្ម';

    if (!cleanName) {
      setError(isKhmer ? 'សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក!' : 'Please enter your Full Name!');
      return;
    }

    if (!cleanPhone) {
      setError(isKhmer ? 'សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក!' : 'Please enter your Telephone Number!');
      return;
    }

    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 8) {
      setError(isKhmer ? 'លេខទូរស័ព្ទត្រូវមានយ៉ាងហោចណាស់ ៨ ខ្ទង់!' : 'Telephone number must be at least 8 digits!');
      return;
    }

    setIsSubmitting(true);

    const profile: UserProfile = {
      name: cleanName,
      phone: cleanPhone,
      title: finalTitle,
      organization: initialProfile?.organization || 'សហគ្រាសកែច្នៃកម្ពុជា',
      signedInAt: Date.now()
    };

    try {
      localStorage.setItem('cashewtrace_user_session', JSON.stringify(profile));
      localStorage.setItem('cashewtrace_user_name', cleanName);
      localStorage.setItem('cashewtrace_user_phone', cleanPhone);
      localStorage.setItem('cashewtrace_user_title', finalTitle);
      
      // Also sync with dailypa phone
      localStorage.setItem('dailypa_user_phone', cleanPhone);
      localStorage.setItem('dailypa_user_name', cleanName);

      // Record to audit log
      await recordUserSignIn(cleanName, cleanPhone, finalTitle, 'packaging');
    } catch (err) {
      console.warn('Sign-in save error:', err);
    } finally {
      setIsSubmitting(false);
      onContinueToPackaging(profile);
    }
  };

  const handleInstantContinue = () => {
    if (initialProfile) {
      onContinueToPackaging(initialProfile);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 my-auto">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden"
      >
        {/* Header with warm greeting and CS 001 Badge */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-emerald-900 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between gap-4 mb-4">
            <CashewTraceLogo className="h-8 sm:h-9 w-auto brightness-200" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-200 border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              CS 001:2000 & QR Trace
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2 font-sans">
            {isKhmer 
              ? 'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធរចនាស្លាកវេចខ្ចប់ស្តង់ដារ' 
              : 'Welcome to CS 001 Packaging Label Designer'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
            {isKhmer 
              ? 'រចនាស្លាកវេចខ្ចប់កសិផល និងអាហារកែច្នៃស្របតាមស្តង់ដារជាតិកម្ពុជា CS 001:2000 មួយជំហានម្តងៗ ងាយស្រួល ច្បាស់លាស់ និងបោះពុម្ពបានភ្លាមៗ។'
              : 'Create compliant Cambodian food & agro packaging labels step by step, compliant with CS 001:2000 with real-time barcode & QR passport generation.'}
          </p>
        </div>

        {/* Existing User Quick Greeting Card */}
        {initialProfile?.name && !isEditingExisting ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                {initialProfile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                  {isKhmer ? 'ស្វាគមន៍មកវិញ (Welcome Back)' : 'Welcome Back'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {initialProfile.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md">
                    <Briefcase className="w-3 h-3 text-amber-700" />
                    {initialProfile.title || 'ម្ចាស់សហគ្រាស'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {initialProfile.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                id="greeting-continue-btn"
                onClick={handleInstantContinue}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:to-emerald-800 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isKhmer ? 'បន្តទៅកាន់ផ្ទាំងរចនាស្លាកវេចខ្ចប់' : 'Continue to Packaging Designer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="greeting-edit-profile-btn"
                onClick={() => setIsEditingExisting(true)}
                className="w-full sm:w-auto py-3.5 px-4 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>{isKhmer ? 'កែប្រែព័ត៌មាន' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form for First-Time or Profile Edit */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider font-sans">
                {isKhmer ? 'សូមជម្រាបព័ត៌មានរបស់អ្នក' : 'Please Enter Your Information'}
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {isKhmer 
                  ? 'ព័ត៌មាននេះនឹងប្រើសម្រាប់កត់ត្រាស្លាកផលិតផល និងលេខទំនាក់ទំនងលើកញ្ចប់'
                  : 'This helps identify your enterprise and auto-fill contact information on labels'}
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Name */}
            <div>
              <label 
                htmlFor="greeting-fullname-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                {isKhmer ? '១. ឈ្មោះពេញ (Full Name)' : '1. Full Name'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="greeting-fullname-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isKhmer ? 'ឧ. សុខ សុផល (Sok Sophal)' : 'e.g. Sok Sophal'}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm text-slate-900 font-semibold transition-all"
                />
              </div>
            </div>

            {/* 2. Phone Number */}
            <div>
              <label 
                htmlFor="greeting-phone-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                {isKhmer ? '២. លេខទូរស័ព្ទ (Telephone Number)' : '2. Telephone Number'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="greeting-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isKhmer ? 'ឧ. 012 345 678' : 'e.g. 012 345 678'}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm text-slate-900 font-mono font-bold tracking-wide transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isKhmer ? 'លេខទូរស័ព្ទកម្ពុជា ០១២, ០៨៨, ០៩៧... ឬលេខអន្តរជាតិ' : 'Cambodian phone number or international format'}
              </p>
            </div>

            {/* 3. Title / Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isKhmer ? '៣. តួនាទី / មុខតំណែង (Your Title / Role)' : '3. Your Title / Role'} <span className="text-rose-500">*</span>
              </label>
              
              {/* Quick Click Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {COMMON_TITLES_KH.map((item) => {
                  const isSelected = title === item.kh && !customTitle;
                  return (
                    <button
                      key={item.kh}
                      type="button"
                      onClick={() => handleQuickTitleSelect(item.kh)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isSelected 
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{isKhmer ? item.kh : item.en}</span>
                    </button>
                  );
                })}
              </div>

              {/* Or Custom Title Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  id="greeting-custom-title-input"
                  type="text"
                  value={customTitle}
                  onChange={(e) => {
                    setCustomTitle(e.target.value);
                    if (e.target.value) setTitle(e.target.value);
                  }}
                  placeholder={isKhmer ? 'ឬវាយបញ្ចូលតួនាទីផ្សេងទៀត...' : 'Or type a custom title...'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-xs text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-2.5">
              {initialProfile?.name && (
                <button
                  type="button"
                  onClick={() => setIsEditingExisting(false)}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  {isKhmer ? 'ថយក្រោយ' : 'Cancel'}
                </button>
              )}

              <button
                type="submit"
                id="submit-greeting-btn"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:to-emerald-800 text-white text-sm font-black shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isKhmer ? 'កំពុងដំណើរការ...' : 'Starting...'}</span>
                ) : (
                  <>
                    <span>{isKhmer ? 'ចាប់ផ្តើមរចនាស្លាកវេចខ្ចប់' : 'Start Packaging Designer'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
