import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Lock, User, Phone, Building, 
  ArrowRight, X, Sparkles, CheckCircle2, AlertCircle, PhoneCall
} from 'lucide-react';
import CashewTraceLogo from './CashewTraceLogo';
import { useLanguage } from '../lib/LanguageContext';
import { recordUserSignIn } from '../lib/firebaseService';

export interface UserProfile {
  name: string;
  phone: string;
  organization?: string;
  title?: string;
  signedInAt: number;
}

interface ProjectSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProjectId: string;
  targetProjectTitleKhmer: string;
  targetProjectTitleEnglish: string;
  targetProjectIcon?: string;
  onSuccess: (profile: UserProfile) => void;
}

export default function ProjectSignInModal({
  isOpen,
  onClose,
  targetProjectId,
  targetProjectTitleKhmer,
  targetProjectTitleEnglish,
  targetProjectIcon = '🌾',
  onSuccess
}: ProjectSignInModalProps) {
  const { isKhmer, t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill existing user info if in localStorage
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('cashewtrace_user_session');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.name) setFullName(parsed.name);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.organization) setOrganization(parsed.organization);
        }
      } catch (e) {
        console.warn('Could not parse cached session:', e);
      }
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError(isKhmer ? 'សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក!' : 'Please enter your Full Name!');
      return;
    }

    if (!cleanPhone) {
      setError(isKhmer ? 'សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក!' : 'Please enter your Telephone Number!');
      return;
    }

    // Basic phone validation (at least 8 digits)
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 8) {
      setError(isKhmer ? 'លេខទូរស័ព្ទត្រូវមានយ៉ាងហោចណាស់ ៨ ខ្ទង់!' : 'Telephone number must be at least 8 digits!');
      return;
    }

    setIsSubmitting(true);

    const userProfile: UserProfile = {
      name: cleanName,
      phone: cleanPhone,
      organization: organization.trim() || undefined,
      signedInAt: Date.now(),
    };

    try {
      // 1. Save to local session
      localStorage.setItem('cashewtrace_user_session', JSON.stringify(userProfile));
      localStorage.setItem('cashewtrace_user_name', cleanName);
      localStorage.setItem('cashewtrace_user_phone', cleanPhone);
      
      // Also sync with dailypa phone / name if available
      localStorage.setItem('dailypa_user_phone', cleanPhone);
      localStorage.setItem('dailypa_user_name', cleanName);

      // 2. Record to Firestore audit log
      await recordUserSignIn(cleanName, cleanPhone, organization, targetProjectId);
    } catch (err) {
      console.warn('Sign in local save error:', err);
    } finally {
      setIsSubmitting(false);
      onSuccess(userProfile);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="project-signin-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-800 p-5 sm:p-6 text-white relative">
            <button
              id="close-signin-modal-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-2xl shadow-inner">
                {targetProjectIcon}
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-amber-100 border border-white/20">
                  <Lock className="w-3 h-3 text-amber-200" />
                  {isKhmer ? 'ការចុះឈ្មោះចូលប្រើប្រាស់គម្រោង' : 'Project Access Sign-In'}
                </span>
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                  {isKhmer ? targetProjectTitleKhmer : targetProjectTitleEnglish}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed mt-2">
              {isKhmer 
                ? 'សូមបញ្ចូលឈ្មោះពេញ និងលេខទូរស័ព្ទរបស់អ្នក ដើម្បីចូលប្រើប្រាស់ និងកត់ត្រាប្រតិបត្តិការក្នុងគម្រោងនេះ។'
                : 'Please enter your Full Name and Telephone Number to proceed and access this project.'}
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label 
                htmlFor="user-fullname-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                {isKhmer ? 'ឈ្មោះពេញ (Full Name)' : 'Full Name'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="user-fullname-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isKhmer ? 'បញ្ចូលឈ្មោះពេញរបស់អ្នក' : 'Enter your full name'}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm text-slate-800 font-medium transition-all"
                />
              </div>
            </div>

            {/* Telephone Number */}
            <div>
              <label 
                htmlFor="user-phone-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                {isKhmer ? 'លេខទូរស័ព្ទ (Telephone Number)' : 'Telephone Number'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="user-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isKhmer ? 'ឧ. 012 345 678' : 'e.g. 012 345 678 or +855 12 345 678'}
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm text-slate-800 font-semibold tracking-wide transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isKhmer 
                  ? 'លេខទូរស័ព្ទកម្ពុជា ០៩x, ០១x, ០៨x, ០៧x សម្រាប់ទំនាក់ទំនង និងការផ្ទៀងផ្ទាត់។'
                  : 'Cambodia phone format (e.g. 088..., 012..., 097...) or international.'}
              </p>
            </div>

            {/* Organization / Farm Name (Optional) */}
            <div>
              <label 
                htmlFor="user-org-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                {isKhmer ? 'ស្ថាប័ន / ចម្ការ / សហគ្រាស (ស្រេចចិត្ត)' : 'Organization / Farm / Business (Optional)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  id="user-org-input"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder={isKhmer ? 'ឧ. ឈ្មោះចម្ការ ឬ អាជីវកម្មរបស់អ្នក' : 'e.g. Your farm or business name'}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                id="cancel-signin-btn"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                {isKhmer ? 'ត្រឡប់ក្រោយ (Back)' : 'Cancel'}
              </button>

              <button
                type="submit"
                id="submit-signin-btn"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-emerald-700 hover:from-amber-700 hover:to-emerald-800 text-white text-xs font-black shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isKhmer ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Authenticating...'}</span>
                ) : (
                  <>
                    <span>{isKhmer ? 'បញ្ជាក់ & ចូលប្រើប្រាស់គម្រោង' : 'Confirm & Access Project'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Footer Notice */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {isKhmer 
                  ? 'ព័ត៌មានរបស់អ្នកត្រូវបានចងចាំក្នុង Browser នេះ ដូច្នេះអ្នកមិនបាច់វាយបញ្ចូលម្តងទៀតរាល់ពេលផ្លាស់ប្តូរគម្រោងឡើយ។'
                  : 'Your session is preserved locally so you do not need to sign in again when switching projects.'}
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
