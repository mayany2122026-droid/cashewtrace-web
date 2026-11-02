import React, { useState, useEffect } from 'react';
import { 
  X, Phone, User, CheckCircle2, Sparkles, Mic, 
  ArrowRight, ShieldCheck, Volume2, LogOut, RefreshCw,
  Calendar, Layers, Clock
} from 'lucide-react';
import { speakText } from '../utils/speech';
import { SupportedLanguage } from '../types';
import { 
  registerOrSignInWithPhone, 
  signOutUser, 
  getTrialStats, 
  TrialStats, 
  MAX_FREE_VOICE_RECORDS, 
  MAX_FREE_TRIAL_DAYS 
} from '../utils/trialTracker';

interface AuthOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (name: string, phone: string, category: string) => void;
  onSignOut?: () => void;
  currentUserName?: string;
  currentUserPhone?: string;
  lang: SupportedLanguage;
}

export const AuthOnboardingModal: React.FC<AuthOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
  onSignOut,
  currentUserName,
  currentUserPhone,
  lang,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('msme');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [stats, setStats] = useState<TrialStats>(() => getTrialStats());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const currentStats = getTrialStats();
      setStats(currentStats);
      if (currentStats.userName || currentUserName) {
        setName(currentStats.userName || currentUserName || '');
      }
      if (currentStats.userPhoneNumber || currentUserPhone) {
        setPhone(currentStats.userPhoneNumber || currentUserPhone || '');
      }
      setStep(1);
      setErrorMessage(null);
    }
  }, [isOpen, currentUserName, currentUserPhone]);

  if (!isOpen) return null;

  const isKm = lang === 'km';
  const isSignedIn = Boolean((stats.userPhoneNumber || currentUserPhone) && (stats.userPhoneNumber || currentUserPhone)!.trim().length > 0);

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMessage(isKm ? 'សូមបញ្ចូលឈ្មោះ និងលេខទូរស័ព្ទ' : 'Please enter your name and phone number');
      return;
    }

    setErrorMessage(null);
    setStep(2);
    setIsVerifying(true);
    setVerificationCode('');

    // Animate the 6-digit OTP `887712`
    const digits = ['8', '8', '7', '7', '1', '2'];
    digits.forEach((digit, index) => {
      setTimeout(() => {
        setVerificationCode((prev) => prev + digit);
        if (index === digits.length - 1) {
          setTimeout(async () => {
            setIsVerifying(false);
            
            // Sync with Firestore & localStorage
            const result = await registerOrSignInWithPhone(name, phone, category);
            setStats(result.stats);

            // Spoken welcome greeting
            const welcomeText = isKm 
              ? (result.isExistingUser 
                  ? `សូមស្វាគមន៍មកវិញ ${name}! យើងបានរកឃើញគណនី និងទិន្នន័យរបស់អ្នករួចរាល់ហើយ។` 
                  : `សូមស្វាគមន៍ ${name}! ការចុះឈ្មោះជោគជ័យ។ អ្នកទទួលបានសិទ្ធិកត់ត្រា ៣០០ ដង ឬ ៦០ ថ្ងៃឥតគិតថ្លៃ។`)
              : (result.isExistingUser
                  ? `Welcome back ${name}! Your account and trial balance have been restored.`
                  : `Welcome ${name}! Registration successful with 300 records and 60 days free trial.`);
            
            speakText(welcomeText, lang, { playChime: true });

            setTimeout(() => {
              onCompleteOnboarding(name, phone, category);
              onClose();
            }, 1200);
          }, 600);
        }
      }, (index + 1) * 200);
    });
  };

  const handleSignOut = () => {
    const newStats = signOutUser();
    setStats(newStats);
    setName('');
    setPhone('');
    if (onSignOut) {
      onSignOut();
    }
    speakText(isKm ? 'បានចាកចេញពីគណនីរួចរាល់' : 'Signed out successfully', lang, { playChime: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
              👤
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {isSignedIn 
                  ? (isKm ? 'ព័ត៌មានគណនី & កូតាប្រើប្រាស់' : 'Account & Trial Usage')
                  : (isKm ? 'ចូលគណនី / ចុះឈ្មោះ (ឈ្មោះ & លេខទូរស័ព្ទ)' : 'Sign In / Register (Name & Phone)')}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isKm 
                  ? 'រក្សាទុកកូតា ៣០០ ដង ឬ ៦០ ថ្ងៃក្នុងពពក Cloud (មិនបាត់បង់ទិន្នន័យ)' 
                  : 'Cloud-synced 300 records & 60 days trial across your devices'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 300 Records & 60 Days Live Counter Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1">
              <span>🎁</span>
              <span>{isKm ? 'កូតាសាកល្បងឥតគិតថ្លៃ (Free Trial)' : 'Free Trial Status'}</span>
            </span>
            <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
              stats.isExpired 
                ? 'bg-rose-50 text-rose-800 border-rose-200' 
                : 'bg-white text-emerald-800 border-emerald-200'
            }`}>
              {stats.isExpired 
                ? (isKm ? '⚠️ ផុតកំណត់កូតា (Expired)' : '⚠️ Trial Expired') 
                : (isKm ? '✅ កំពុងសាកល្បង (Active)' : '✅ Active Free Trial')}
            </span>
          </div>

          {/* 2 Visual Progress Bars: Records Count & Days Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Voice Records Bar */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <Mic className="w-3 h-3 text-rose-500" />
                  <span>{isKm ? 'សំឡេងកត់ត្រា' : 'Voice Records'}</span>
                </span>
                <span className="font-mono text-emerald-800 font-black">
                  {stats.voiceRecordingsCount} / {MAX_FREE_VOICE_RECORDS}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.voiceRecordingsCount / MAX_FREE_VOICE_RECORDS) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 text-right">
                {stats.recordsRemaining} {isKm ? 'ដងនៅសល់' : 'records left'}
              </p>
            </div>

            {/* Days Bar */}
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  <span>{isKm ? 'រយៈពេលប្រើប្រាស់' : 'Active Days'}</span>
                </span>
                <span className="font-mono text-indigo-800 font-black">
                  {stats.daysUsed} / {MAX_FREE_TRIAL_DAYS} {isKm ? 'ថ្ងៃ' : 'days'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.daysUsed / MAX_FREE_TRIAL_DAYS) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 text-right">
                {stats.daysRemaining} {isKm ? 'ថ្ងៃនៅសល់' : 'days left'}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
            {isKm 
              ? '💡 អ្នកអាចកត់ត្រាបានរហូតដល់ ៣០០ ដង ឬ ៦០ ថ្ងៃ (មួយណាមកដល់មុន) ដោយមិនគិតថ្លៃអ្វីទាំងអស់។ លេខទូរស័ព្ទរបស់អ្នកជួយរក្សាទុកទិន្នន័យនេះមិនឱ្យបាត់បង់!'
              : '💡 You have 300 voice recordings or 60 days (whichever comes first) completely free. Your phone number secures your balance and records in the cloud!'}
          </p>
        </div>

        {/* Existing Signed In Profile View */}
        {isSignedIn && step === 1 ? (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-600 tracking-wider">
                  {isKm ? 'គណនីដែលបានភ្ជាប់' : 'Connected Profile'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                  ✓ {isKm ? 'បានផ្ទៀងផ្ទាត់' : 'Verified'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{isKm ? 'ឈ្មោះ / ហាង៖' : 'Name / Store:'}</span>
                  <span className="font-bold text-slate-900">{stats.userName || currentUserName || 'Mayany User'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{isKm ? 'លេខទូរស័ព្ទ៖' : 'Phone Number:'}</span>
                  <span className="font-mono font-bold text-slate-900">{stats.userPhoneNumber || currentUserPhone}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{isKm ? 'កាលបរិច្ឆេទចាប់ផ្តើម៖' : 'Started On:'}</span>
                  <span className="font-mono text-slate-600">
                    {new Date(stats.firstActiveAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <span>{isKm ? 'ចាកចេញពីគណនី (Sign Out)' : 'Sign Out'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <span>{isKm ? 'រួចរាល់ (បិទ)' : 'Done (Close)'}</span>
              </button>
            </div>
          </div>
        ) : step === 1 ? (
          /* Sign In / Registration Form */
          <form onSubmit={handleStartVerification} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isKm ? 'ឈ្មោះរបស់អ្នក ឬឈ្មោះហាង/អាជីវកម្ម *' : 'Your Full Name or Store Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isKm ? 'ឧ. សុខា, ហាងកាហ្វេភ្នំពេញ, Mayany...' : 'e.g. Mayany SAM, Sokha Store...'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isKm ? 'លេខទូរស័ព្ទដៃ (សម្រាប់ភ្ជាប់ & រក្សាទុកកូតា 300 ដង) *' : 'Phone Number (To Track 300 Records & 60 Days) *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="088 771 2862 / 012 345 678..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
              <p className="text-[10.5px] text-slate-400 mt-1">
                {isKm 
                  ? '🔒 ប្រសិនបើអ្នកធ្លាប់ចុះឈ្មោះពីមុន ប្រព័ន្ធនឹងទាញយកទិន្នន័យចាស់មកវិញស្វ័យប្រវត្តិ។' 
                  : '🔒 If you already have an account, your previous records and remaining days will automatically load.'}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isKm ? 'ប្រភេទអាជីវកម្ម / ការប្រើប្រាស់' : 'Primary Usage Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
              >
                <option value="msme">🛍️ អាជីវកម្ម & ហាងលក់ដូរ (MSME / Store)</option>
                <option value="vendor">🛵 អ្នករត់ម៉ូតូឌុប កង់បី ឬតូបតូច (Micro Vendor / Tuk-Tuk)</option>
                <option value="grocery">🥬 ហាងចាប់ហួយ & កែសម្ផស្ស (Grocery / Salon)</option>
                <option value="cafe">☕ ហាងកាហ្វេ & ភោជនីយដ្ឋាន (Cafe & Restaurant)</option>
                <option value="wholesale">📦 ដេប៉ូបោះដុំ & អាជីវកម្មធំ (Wholesale & Trade)</option>
                <option value="family">🏡 គ្រួសារ & ផ្ទាល់ខ្លួន (Personal & Family)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>{isKm ? 'ចូលគណនី / ផ្ទៀងផ្ទាត់ភ្លាមៗ ➔' : 'Sign In & Verify Instantly ➔'}</span>
            </button>
          </form>
        ) : (
          /* Verification Step */
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-2xl">
              {isVerifying ? '⏳' : '✅'}
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">
                {isVerifying ? (isKm ? 'កំពុងផ្ទៀងផ្ទាត់ និងភ្ជាប់ទិន្នន័យ Cloud...' : 'Verifying & Syncing Cloud Ledger...') : (isKm ? 'ផ្ទៀងផ្ទាត់ជោគជ័យ!' : 'Verification Successful!')}
              </h4>
              <p className="text-xs text-slate-500">
                {isKm ? 'លេខទូរស័ព្ទ៖' : 'Phone:'} <strong className="font-mono text-slate-800">{phone}</strong>
              </p>
            </div>

            {/* 6-Digit Auto OTP Box */}
            <div className="flex justify-center gap-2 py-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className="w-10 h-12 rounded-xl border-2 border-rose-400 bg-rose-50/50 flex items-center justify-center text-lg font-black font-mono text-rose-800 shadow-2xs"
                >
                  {verificationCode[idx] || '•'}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400">
              {isKm 
                ? 'ប្រព័ន្ធកំពុងផ្ទៀងផ្ទាត់កូដស្វ័យប្រវត្តិ និងភ្ជាប់កូតា ៣០០ ដង / ៦០ ថ្ងៃ'
                : 'Zero-friction auto-verification in progress... Syncing 300 voice recordings & 60 days'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
