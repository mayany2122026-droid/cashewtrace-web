import React, { useState } from 'react';
import { 
  X, Volume2, Calendar, Clock, DollarSign, 
  Send, Bell, Moon, Sun, CheckCircle2, Pill, GraduationCap, Users, 
  HelpCircle, Mic, Sparkles, ChevronRight, AlertCircle
} from 'lucide-react';
import { Entry, SupportedLanguage, ScheduleConfig, CreditDebtRecord } from '../types';
import { speakText } from '../utils/speech';
import { triggerTelegramHaptic } from '../utils/telegram';
import { 
  generateComprehensiveEveningRecap, 
  handleSmartMemoryAndMentorQuery,
  queryScheduledReminderTimes
} from '../utils/voiceAssistantEngine';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
  debts?: CreditDebtRecord[];
  currencyRate: number;
  lang: SupportedLanguage;
  schedule: ScheduleConfig;
  onUpdateSchedule: (newCfg: Partial<ScheduleConfig>) => void;
  onAddEntry?: (parsed: any, raw: string) => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  isOpen,
  onClose,
  entries,
  debts = [],
  currencyRate,
  lang,
  schedule,
  onUpdateSchedule,
  onAddEntry,
}) => {
  const [activeTab, setActiveTab] = useState<'evening' | 'morning' | 'memory' | 'settings'>('evening');
  const [testSent, setTestSent] = useState(false);
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [activeQaQuestion, setActiveQaQuestion] = useState<string | null>(null);
  const [medicineRecordedToday, setMedicineRecordedToday] = useState(false);

  if (!isOpen) return null;

  const isKm = lang === 'km';
  const isMy = lang === 'my';
  const now = new Date();

  // Comprehensive Evening Recap calculations
  const recap = generateComprehensiveEveningRecap(entries, debts, currencyRate, lang);
  const isProfitable = recap.netProfitUsd >= 0;

  const pendingReminders = entries.filter(
    (e) => (e.type === 'reminder' || e.type === 'task') && !e.isCompleted
  );

  // 1. Play Comprehensive Voice Recap
  const handlePlayVoice = (type: 'evening' | 'morning') => {
    if (type === 'evening') {
      speakText(recap.spokenRecap, lang, { playChime: true });
    } else {
      const morningText = isKm
        ? `ជម្រាបសួរពេលព្រឹក! ខ្ញុំជា Mayany ជំនួយការផ្ទាល់ខ្លួនរបស់អ្នក។ ថ្ងៃនេះអ្នកមានកិច្ចការ និងការណាត់ជួបចំនួន ${pendingReminders.length} ត្រូវបំពេញ។ សូមជូនពរឱ្យថ្ងៃនេះជាថ្ងៃលក់ដាច់ មានសិរីសួស្តី និងសំណាងល្អ!`
        : isMy
        ? `မင်္ဂလာနံနက်ခင်းပါ! ယနေ့အတွက် သင့်တွင် လုပ်ငန်းနှင့် အစည်းအဝေး ${pendingReminders.length} ခု ရှိပါသည်။ ရောင်းဝယ်ဖောက်ကား ကောင်းမွန်ပါစေ!`
        : `Good morning! I am Mayany, your personal voice assistant. You have ${pendingReminders.length} tasks and appointments scheduled today. Wishing you a profitable and productive day!`;
      speakText(morningText, lang, { playChime: true });
    }
  };

  // 2. Quick Mark Medicine Taken
  const handleMarkMedicineTaken = () => {
    setMedicineRecordedToday(true);
    const titleKhmer = 'បានលេបថ្នាំពេលល្ងាចរួចរាល់';
    const titleEnglish = 'Evening medication taken';
    if (onAddEntry) {
      onAddEntry(
        {
          category: 'health',
          type: 'reminder',
          titleKhmer,
          titleEnglish,
          confidenceScore: 0.99,
        },
        titleKhmer
      );
    }
    const feedback = isKm 
      ? 'បានកត់ត្រាថាបានលេបថ្នាំរួចរាល់ហើយ! ពិតជាល្អណាស់សម្រាប់ការថែទាំសុខភាព។' 
      : isMy
      ? 'ညနေခင်းဆေးသောက်ပြီးကြောင်း မှတ်တမ်းတင်ပြီးပါပြီ။'
      : 'Recorded that evening medication has been taken. Great job taking care of your health!';
    speakText(feedback, lang, { playChime: true });
  };

  // 3. Handle Interactive Q&A Chip
  const handleAskQuestion = (question: string) => {
    setActiveQaQuestion(question);
    
    // Check schedule queries first
    const schedQuery = queryScheduledReminderTimes(question, schedule, lang);
    if (schedQuery) {
      setQaAnswer(schedQuery.spokenResponse);
      speakText(schedQuery.spokenResponse, lang, { playChime: true });
      return;
    }

    // Check smart memory & mentor queries
    const ans = handleSmartMemoryAndMentorQuery(question, entries, debts, schedule, currencyRate, lang);
    if (ans) {
      setQaAnswer(ans.spokenAnswer);
      speakText(ans.spokenAnswer, lang, { playChime: true });
    } else {
      const fallback = isKm
        ? 'ខ្ញុំជាជំនួយការរបស់អ្នក។ អ្នកអាចសួរខ្ញុំអំពីការលេបថ្នាំ ការប្រជុំ វគ្គបណ្តុះបណ្តាល ឬប្រាក់ចំណេញបានគ្រប់ពេល!'
        : 'I am your assistant. You can ask me about medicines, meetings, training sessions, or profit anytime!';
      setQaAnswer(fallback);
      speakText(fallback, lang, { playChime: true });
    }
  };

  // 4. Simulate or send automated Telegram Alert
  const handleTestSendTelegram = () => {
    triggerTelegramHaptic('success');
    setTestSent(true);

    // Speak audio recap
    const alertConfirmation = isKm 
      ? `សារសង្ខេបប្រាក់ចំណេញ និងកិច្ចការប្រចាំថ្ងៃ ត្រូវបានកំណត់ផ្ញើទៅតេឡេក្រាមរបស់អ្នកនៅម៉ោង ${schedule.eveningTime} ដោយជោគជ័យ!`
      : isMy
      ? `ညနေ ${schedule.eveningTime} နာရီတွင် တယ်လီဂရမ်သို့ အလိုအလျောက် ပေးပို့ရန် သတ်မှတ်ပြီးပါပြီ။`
      : `Daily profit recap and agenda scheduled to send to Telegram at ${schedule.eveningTime} successfully!`;

    speakText(alertConfirmation, lang, { playChime: true });

    setTimeout(() => {
      setTestSent(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-rose-500/20">
              🎙️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {isKm ? 'សង្ខេបប្រាក់ចំណេញ & កិច្ចការប្រចាំថ្ងៃ' : isMy ? 'ညနေခင်း အမြတ်ငွေနှင့် လုပ်ငန်း အကျဉ်းချုပ်' : 'Evening Profit Recap & Daily Agenda'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isKm ? 'ប្រាក់ចំណេញ • លេបថ្នាំ • ប្រជុំ • វគ្គបណ្តុះបណ្តាល • ម៉ោងរោទ៍' : 'Profit • Medicine • Meetings • Training • Reminders'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Tab Navigation: Evening / Morning / Smart Q&A / Schedule */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('evening')}
            className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'evening'
                ? 'bg-white text-rose-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-rose-600" />
            <span className="truncate">{isKm ? 'ចំណេញល្ងាច' : 'Evening'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('morning')}
            className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'morning'
                ? 'bg-white text-amber-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate">{isKm ? 'សង្ខេបព្រឹក' : 'Morning'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('memory')}
            className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'memory'
                ? 'bg-white text-purple-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="truncate">{isKm ? 'ឆ្លាតវៃ Q&A' : 'Smart Q&A'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 rounded-xl text-[11px] font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span className="truncate">{isKm ? 'ម៉ោងរោទ៍' : 'Schedule'}</span>
          </button>
        </div>

        {/* TAB 1: Comprehensive Evening Voice Profit Recap */}
        {activeTab === 'evening' && (
          <div className="space-y-3.5 animate-in fade-in">
            {/* Net Profit Card */}
            <div className={`p-4 rounded-3xl border-2 space-y-2 text-center relative overflow-hidden ${
              isProfitable 
                ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 border-emerald-300 text-emerald-950' 
                : 'bg-gradient-to-br from-rose-50 via-red-50 to-rose-100/50 border-rose-300 text-rose-950'
            }`}>
              <span className="text-[11px] font-black uppercase tracking-wider block opacity-75">
                🌙 {isKm ? 'ប្រាក់ចំណេញសុទ្ធថ្ងៃនេះ (Net Profit Today)' : 'Net Profit Today'}
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono">
                  {isProfitable ? '+' : ''}${recap.netProfitUsd.toFixed(2)}
                </span>
                <span className="text-sm font-bold opacity-80">
                  ({Math.round(recap.netProfitUsd * currencyRate).toLocaleString()} ៛)
                </span>
              </div>
              <p className="text-xs font-semibold opacity-90 max-w-sm mx-auto">
                {isProfitable 
                  ? (isKm ? '🎉 អបអរសាទរ! ថ្ងៃនេះអាជីវកម្មរបស់អ្នកទទួលបានប្រាក់ចំណេញសុទ្ធ!' : '🎉 Congratulations! Your sales exceeded expenses today.')
                  : (isKm ? '💡 ថ្ងៃនេះការចំណាយច្រើនជាងចំណូលបន្តិចបន្តួច។' : '💡 Expenses were higher than sales today.')}
              </p>
            </div>

            {/* Income & Expense Breakdown */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  {isKm ? 'ចំណូលលក់បាន' : 'Total Income'}
                </span>
                <p className="text-lg font-black font-mono text-emerald-700 mt-0.5">${recap.incomeUsd.toFixed(2)}</p>
                <span className="text-[10px] text-emerald-600 font-mono">
                  {Math.round(recap.incomeUsd * currencyRate).toLocaleString()} ៛
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">
                  {isKm ? 'ចំណាយសរុប' : 'Total Expenses'}
                </span>
                <p className="text-lg font-black font-mono text-rose-700 mt-0.5">${recap.expenseUsd.toFixed(2)}</p>
                <span className="text-[10px] text-rose-600 font-mono">
                  {Math.round(recap.expenseUsd * currencyRate).toLocaleString()} ៛
                </span>
              </div>
            </div>

            {/* Section: Medicine & Health Intake Routine (For forgetful users/mentors) */}
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center text-xs font-black">
                    💊
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-sky-950">
                      {isKm ? 'ការលេបថ្នាំ & សុខភាព (Medicine Intake)' : 'Medicine & Health Routine'}
                    </h5>
                    <p className="text-[10px] text-sky-700">
                      {recap.medicineStatus.taken || medicineRecordedToday
                        ? (isKm ? '✅ ថ្ងៃនេះបានកត់ត្រាលេបថ្នាំរួចរាល់' : '✅ Medication recorded for today')
                        : (isKm ? '⚠️ កុំភ្លេចលេបថ្នាំមុនចូលគេង!' : '⚠️ Don\'t forget evening medicine before sleep!')}
                    </p>
                  </div>
                </div>

                {!(recap.medicineStatus.taken || medicineRecordedToday) && (
                  <button
                    type="button"
                    onClick={handleMarkMedicineTaken}
                    className="px-2.5 py-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isKm ? 'លេបថ្នាំរួច' : 'Mark Taken'}</span>
                  </button>
                )}
              </div>
              {recap.medicineStatus.items.length > 0 && (
                <div className="text-[11px] text-sky-900 bg-white/70 p-2 rounded-xl font-medium border border-sky-100">
                  {recap.medicineStatus.items.join(', ')}
                </div>
              )}
            </div>

            {/* Section: Trainings & Digital Mentorship + Meetings Today */}
            {(recap.trainingsToday.length > 0 || recap.meetingsToday.length > 0) && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-950 font-black">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>{isKm ? 'វគ្គបណ្តុះបណ្តាល & ការប្រជុំថ្ងៃនេះ' : 'Trainings & Meetings Today'}</span>
                </div>
                <div className="space-y-1">
                  {recap.trainingsToday.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <span className="text-amber-500">🎓</span>
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                  {recap.meetingsToday.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <span className="text-amber-500">🤝</span>
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tomorrow's Sneak Peek (Calms nighttime anxiety for forgetful users) */}
            {recap.tomorrowPreview.length > 0 && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 font-black">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isKm ? 'ត្រៀមសម្រាប់ស្អែក (Tomorrow\'s Sneak Peek)' : 'Tomorrow\'s Agenda'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">
                    {recap.tomorrowPreview.length} {isKm ? 'កិច្ចការ' : 'items'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {recap.tomorrowPreview.slice(0, 3).join(' • ')}
                </p>
              </div>
            )}

            {/* Customer Debts if any */}
            {recap.debtOwedUsd > 0 && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900">
                  🤝 {isKm ? 'អតិថិជនជំពាក់ថ្ងៃនេះ (Customer Debt)' : 'Customer Debt'}
                </span>
                <span className="font-black font-mono text-amber-800">${recap.debtOwedUsd.toFixed(2)}</span>
              </div>
            )}

            {/* Big Loud Audio Button for Evening Recap */}
            <button
              type="button"
              onClick={() => handlePlayVoice('evening')}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-rose-600/30 cursor-pointer transition-all active:scale-98"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>{isKm ? '🔊 ចាក់ស្តាប់សង្ខេបប្រាក់ចំណេញ & កិច្ចការពេលល្ងាច' : 'Listen to Full Evening Voice Recap'}</span>
            </button>
          </div>
        )}

        {/* TAB 2: Morning Focus & Tasks Briefing */}
        {activeTab === 'morning' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
              <span className="text-2xl">☀️</span>
              <div>
                <h4 className="text-xs font-black text-amber-900">
                  {isKm ? 'សង្ខេបកិច្ចការពេលព្រឹក (Morning Tasks Briefing)' : 'Morning Focus & Tasks Briefing'}
                </h4>
                <p className="text-[11px] text-amber-700">
                  {isKm ? `អ្នកមានកិច្ចការ និងការណាត់ជួបចំនួន ${pendingReminders.length} ត្រូវធ្វើ` : `${pendingReminders.length} pending tasks to tackle`}
                </p>
              </div>
            </div>

            {/* Task list */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {pendingReminders.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-xs">
                  🎉 {isKm ? 'គ្មានកិច្ចការដែលនៅសល់ទេ! អស្ចារ្យណាស់។' : 'No pending tasks today! Everything clean.'}
                </div>
              ) : (
                pendingReminders.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate">{isKm ? item.titleKhmer : item.titleEnglish}</span>
                    {item.reminderTime && (
                      <span className="text-[10px] font-mono text-amber-800 px-1.5 py-0.5 rounded bg-amber-100 font-black shrink-0">
                        {item.reminderTime}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => handlePlayVoice('morning')}
              className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-98"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isKm ? '🔊 ចាក់ស្តាប់សង្ខេបពេលព្រឹក' : 'Listen to Morning Briefing'}</span>
            </button>
          </div>
        )}

        {/* TAB 3: Smart Memory Recall & Digital Mentor Q&A (For Forgetful Users/Mentors) */}
        {activeTab === 'memory' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <div>
                  <h4 className="text-xs font-black text-purple-900">
                    {isKm ? 'ជំនួយការចងចាំ & សួរសំនួរ (Smart Memory & Mentor Q&A)' : 'Smart Memory & Digital Mentor Q&A'}
                  </h4>
                  <p className="text-[11px] text-purple-700">
                    {isKm 
                      ? 'សម្រាប់អ្នកភ្លេចភ្លាំង ឬគ្រូឧទ្ទេស៖ ចុចសំនួរ ឬសួរដោយសំឡេង ខ្ញុំនឹងឆ្លើយភ្លាមៗ!'
                      : 'For forgetful users and mentors: Tap a question or speak to get instant answers!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Question Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                {isKm ? 'សំនួរដែលសួរញឹកញាប់ (Tap to ask aloud):' : 'Frequently Asked Memory Questions:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { q: 'តើខ្ញុំបានលេបថ្នាំហើយឬនៅ?', labelKm: '💊 តើបានលេបថ្នាំហើយឬនៅ?', labelEn: '💊 Did I take my medicine?' },
                  { q: 'តើខ្ញុំមានប្រជុំ ឬវគ្គបណ្តុះបណ្តាលអ្វីខ្លះ?', labelKm: '🎓 ប្រជុំ/បណ្តុះបណ្តាលអ្វីខ្លះ?', labelEn: '🎓 Any meetings or training?' },
                  { q: 'តើស្អែកខ្ញុំត្រូវធ្វើអ្វីខ្លះ?', labelKm: '📝 ស្អែកត្រូវធ្វើអ្វីខ្លះ?', labelEn: '📝 What to do tomorrow?' },
                  { q: 'តើខ្ញុំកំណត់ម៉ោងរំលឹកម៉ោងប៉ុន្មាន?', labelKm: '⏰ ម៉ោងរំលឹកម៉ោងប៉ុន្មាន?', labelEn: '⏰ What time is reminder set?' },
                  { q: 'តើថ្ងៃនេះចំណេញប៉ុន្មាន?', labelKm: '💰 ថ្ងៃនេះចំណេញប៉ុន្មាន?', labelEn: '💰 How much profit today?' },
                  { q: 'តើអតិថិជនណាខ្លះជំពាក់លុយ?', labelKm: '🤝 អ្នកណាខ្លះជំពាក់លុយ?', labelEn: '🤝 Who owes me money?' },
                  { q: 'តើធ្វើដូចម្តេចដើម្បីគិតប្រាក់ចំណេញ?', labelKm: '💡 គិតប្រាក់ចំណេញដូចម្តេច?', labelEn: '💡 How to calculate profit?' },
                  { q: 'តើធ្វើដូចម្តេចដើម្បីគ្រប់គ្រងលុយ?', labelKm: '💡 គ្រប់គ្រងលុយ MSME ដូចម្តេច?', labelEn: '💡 Manage MSME cashflow?' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskQuestion(item.q)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left text-xs font-bold text-slate-800 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{isKm ? item.labelKm : item.labelEn}</span>
                    <Volume2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Display Answer Card */}
            {qaAnswer && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-purple-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>{isKm ? 'ចម្លើយជំនួយការ (Spoken Answer):' : 'Assistant Answer:'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => speakText(qaAnswer, lang, { playChime: true })}
                    className="px-2 py-0.5 rounded-lg bg-purple-200 hover:bg-purple-300 text-purple-900 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isKm ? 'ចាក់ឡើងវិញ' : 'Replay'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                  {qaAnswer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Schedule Times & Automated Alerts (100% Voice-Configurable) */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Prominent Voice Reassurance Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎙️</span>
                <h4 className="text-xs font-black text-emerald-900">
                  {isKm ? 'កំណត់ម៉ោងរោទ៍ដោយសំឡេងបាន ១០០% (Voice Alone)!' : '100% Voice-Controllable Reminders!'}
                </h4>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                {isKm 
                  ? 'អ្នកមិនបាច់ចេះអក្សរឡើយ! គ្រាន់តែចុចមីក្រូហ្វូនធំពណ៌ក្រហមនៅលើអេក្រង់ ហើយនិយាយថា៖ «រំលឹកខ្ញុំម៉ោង ៩ យប់» ឬ «កំណត់ម៉ោង ៥ ព្រឹក» នោះកម្មវិធីនឹងកំណត់ភ្លាមៗ និងឆ្លើយតបជាសំឡេងបញ្ជាក់ជូនអ្នក!'
                  : isMy
                  ? 'စာရေးစရာမလိုပါ! မိုက်ခရိုဖုန်းကို နှိပ်ပြီး «ည ၉ နာရီ သတိပေးပါ» သို့မဟုတ် «မနက် ၅ နာရီ သတိပေးပါ» ဟု ပြောရုံဖြင့် အလိုအလျောက် သတ်မှတ်ပေးပါမည်။'
                  : 'Zero reading or writing needed! Just tap the red mic on the home screen and say: "Remind me at 9pm" or "Set reminder to 5am" — the assistant updates it instantly and speaks confirmation!'}
              </p>
            </div>

            {/* Evening Recap Time Picker & Quick Chips */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-rose-600" />
                  <span>{isKm ? 'ម៉ោងសង្ខេបប្រាក់ចំណេញពេលល្ងាច (Evening Recap)' : 'Evening Profit Recap Time'}</span>
                </label>
                <input
                  type="time"
                  value={schedule.eveningTime}
                  onChange={(e) => onUpdateSchedule({ eveningTime: e.target.value })}
                  className="px-2 py-1 rounded-xl bg-white border border-slate-300 font-mono text-xs font-black text-slate-900 focus:outline-rose-500"
                />
              </div>

              {/* Quick Preset Chips for Evening */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {['18:00', '19:00', '20:30', '21:00', '22:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onUpdateSchedule({ eveningTime: time })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                      schedule.eveningTime === time
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {time === '21:00' ? `${time} (9 PM)` : time}
                  </button>
                ))}
              </div>
            </div>

            {/* Morning Briefing Time Picker & Quick Chips */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{isKm ? 'ម៉ោងសង្ខេបកិច្ចការពេលព្រឹក (Morning Briefing)' : 'Morning Briefing Time'}</span>
                </label>
                <input
                  type="time"
                  value={schedule.morningTime}
                  onChange={(e) => onUpdateSchedule({ morningTime: e.target.value })}
                  className="px-2 py-1 rounded-xl bg-white border border-slate-300 font-mono text-xs font-black text-slate-900 focus:outline-amber-500"
                />
              </div>

              {/* Quick Preset Chips for Morning */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {['05:00', '06:00', '06:30', '07:00', '08:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onUpdateSchedule({ morningTime: time })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                      schedule.morningTime === time
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {time === '05:00' ? `${time} (5 AM)` : time}
                  </button>
                ))}
              </div>
            </div>

            {/* Telegram Automated Alerts Toggle & Instant Test */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-black">
                    ✈️
                  </div>
                  <div>
                    <span className="text-xs font-black text-blue-950 block">
                      {isKm ? 'ផ្ញើសំឡេង & សារទៅ Telegram' : 'Automated Telegram Voice Alerts'}
                    </span>
                    <span className="text-[10px] text-blue-700">
                      {isKm ? `ផ្ញើនៅម៉ោង ${schedule.eveningTime} (ល្ងាច) & ${schedule.morningTime} (ព្រឹក)` : `Alerts set for ${schedule.eveningTime} & ${schedule.morningTime}`}
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule.telegramAlertsEnabled}
                    onChange={(e) => onUpdateSchedule({ telegramAlertsEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleTestSendTelegram}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer transition-all active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isKm ? '🔔 សាកល្បងផ្ញើទៅ Telegram ឥឡូវនេះ (Test Ping)' : 'Test Send Alert to Telegram Now'}</span>
              </button>

              {testSent && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isKm ? 'បានផ្ញើសារសាកល្បងទៅ Telegram រួចរាល់!' : 'Test alert simulated to Telegram!'}</span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>💡 {isKm ? 'គ្រប់មុខងារអាចបញ្ជាដោយសំឡេងបានទាំងអស់' : 'All features can be controlled by voice'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            {isKm ? 'បិទ' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};


