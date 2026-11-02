import React, { useState } from 'react';
import { 
  X, Users, Plus, DollarSign, Calendar, Clock,
  Phone, UserCheck, AlertTriangle, CheckCircle2,
  Trash2, Volume2, ShieldAlert, FileText, ChevronRight
} from 'lucide-react';
import { HelperStaff, LaborLogRecord, SupportedLanguage, CurrencyConfig } from '../types';
import { speakText } from '../utils/speech';

interface HelperLaborModalProps {
  isOpen: boolean;
  onClose: () => void;
  helpers: HelperStaff[];
  laborLogs: LaborLogRecord[];
  onAddHelper: (helper: Omit<HelperStaff, 'id'>) => void;
  onUpdateHelper: (helper: HelperStaff) => void;
  onDeleteHelper: (id: string) => void;
  onAddLaborLog: (log: Omit<LaborLogRecord, 'id'>) => void;
  onDeleteLaborLog: (id: string) => void;
  currencyConfig: CurrencyConfig;
  lang: SupportedLanguage;
}

export const HelperLaborModal: React.FC<HelperLaborModalProps> = ({
  isOpen,
  onClose,
  helpers,
  laborLogs,
  onAddHelper,
  onUpdateHelper,
  onDeleteHelper,
  onAddLaborLog,
  onDeleteLaborLog,
  currencyConfig,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'helpers' | 'attendance' | 'add_log'>('overview');
  const [selectedHelperId, setSelectedHelperId] = useState<string>('');
  
  // Quick Log Entry Form State
  const [logType, setLogType] = useState<'salary' | 'advance' | 'absence'>('salary');
  const [logAmount, setLogAmount] = useState<string>('');
  const [logCurrency, setLogCurrency] = useState<string>('USD');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [logReason, setLogReason] = useState<string>('sick');
  const [logNotes, setLogNotes] = useState<string>('');

  // Add Helper Form State
  const [isAddingHelper, setIsAddingHelper] = useState(false);
  const [newHelperName, setNewHelperName] = useState('');
  const [newHelperPhone, setNewHelperPhone] = useState('');
  const [newHelperRole, setNewHelperRole] = useState('ជំនួយការហាង / Grocery Assistant');
  const [newHelperSalary, setNewHelperSalary] = useState('150');
  const [newHelperCurrency, setNewHelperCurrency] = useState('USD');

  if (!isOpen) return null;

  const isKm = lang === 'km';
  const usdRate = currencyConfig.usdToSecondaryRate || currencyConfig.usdToKhrRate || 4030;
  const secondarySymbol = currencyConfig.secondaryCurrencySymbol || '៛';

  // Calculate Monthly Metrics
  const currentMonthPrefix = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthLogs = laborLogs.filter((l) => l.date.startsWith(currentMonthPrefix));

  let totalSalaryPaidUsd = 0;
  let totalAdvancesUsd = 0;
  let totalAbsencesCount = 0;

  monthLogs.forEach((l) => {
    const amt = l.amount || 0;
    const isKhr = l.currency === 'KHR';
    const valUsd = isKhr ? amt / usdRate : amt;

    if (l.type === 'salary') {
      totalSalaryPaidUsd += valUsd;
    } else if (l.type === 'advance') {
      totalAdvancesUsd += valUsd;
    } else if (l.type === 'absence' || l.type === 'half_day') {
      totalAbsencesCount += l.type === 'half_day' ? 0.5 : 1;
    }
  });

  const totalLaborCostUsd = totalSalaryPaidUsd + totalAdvancesUsd;
  const totalLaborCostLocal = Math.round(totalLaborCostUsd * usdRate);

  // Spoken Explanation Out Loud
  const handleSpeakLaborSummary = () => {
    let text = '';
    if (isKm) {
      text = `នេះជាសង្ខេបថ្លៃពលកម្ម និងប្រាក់ខែបុគ្គលិកប្រចាំខែ។ ថ្លៃពលកម្មសរុបខែនេះអស់ ${totalLaborCostUsd.toFixed(2)} ដុល្លារ (ស្មើនឹង ${totalLaborCostLocal.toLocaleString()} ${secondarySymbol}) សម្រាប់បុគ្គលិកចំនួន ${helpers.length} នាក់។ ក្នុងនោះបានបើកប្រាក់ខែចំនួន ${totalSalaryPaidUsd.toFixed(2)} ដុល្លារ និងបុរេប្រទាន ${totalAdvancesUsd.toFixed(2)} ដុល្លារ។ មានកំណត់ត្រាអវត្តមានចំនួន ${totalAbsencesCount} ថ្ងៃ។`;
    } else {
      text = `Here is your monthly helper and labor cost summary. Total labor cost this month is $${totalLaborCostUsd.toFixed(2)} (${totalLaborCostLocal.toLocaleString()} ${secondarySymbol}) across ${helpers.length} helpers. You have paid $${totalSalaryPaidUsd.toFixed(2)} in salary and $${totalAdvancesUsd.toFixed(2)} in salary advances. A total of ${totalAbsencesCount} absences were recorded this month.`;
    }
    speakText(text, lang, { playChime: true });
  };

  const handleQuickAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const helper = helpers.find((h) => h.id === selectedHelperId) || helpers[0];
    if (!helper) return;

    onAddLaborLog({
      helperId: helper.id,
      helperName: helper.name,
      type: logType,
      amount: logType === 'absence' ? undefined : parseFloat(logAmount) || 0,
      currency: logCurrency,
      date: logDate,
      reason: logType === 'absence' ? logReason : undefined,
      notes: logNotes,
      deductedFromSalary: logType === 'advance',
    });

    // Reset
    setLogAmount('');
    setLogNotes('');
    setActiveTab('overview');
  };

  const handleCreateHelper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHelperName.trim()) return;

    onAddHelper({
      name: newHelperName.trim(),
      phone: newHelperPhone.trim(),
      role: newHelperRole.trim(),
      monthlySalary: parseFloat(newHelperSalary) || 0,
      currency: newHelperCurrency,
      startDate: new Date().toISOString().slice(0, 10),
      isActive: true,
    });

    setNewHelperName('');
    setNewHelperPhone('');
    setIsAddingHelper(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="helper-labor-manager-modal"
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
              👥
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight flex items-center gap-2">
                <span>{isKm ? 'គ្រប់គ្រងបុគ្គលិក & ថ្លៃពលកម្ម' : 'Helper & Labor Cost Manager'}</span>
                <span className="px-2 py-0.5 rounded-md bg-white/25 text-[10px] uppercase font-black tracking-wider">
                  MSME
                </span>
              </h3>
              <p className="text-xs text-white/90">
                {isKm 
                  ? 'កត់ត្រាប្រាក់ខែ បុរេប្រទាន & ការឈប់សម្រាករបស់កូនឈ្នួល ១-២ នាក់' 
                  : 'Track salary, advances, and absences for 1-2 shop helpers'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSpeakLaborSummary}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title={isKm ? 'អានសង្ខេបថ្លៃពលកម្ម' : 'Read Labor Summary Out Loud'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-4 pt-3 border-b border-slate-100 bg-slate-50 gap-2 shrink-0 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'border-amber-600 text-amber-900 font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 {isKm ? 'សង្ខេបថ្លៃពលកម្មប្រចាំខែ' : 'Monthly Overview'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('helpers')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'helpers' 
                ? 'border-amber-600 text-amber-900 font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            👥 {isKm ? `បញ្ជីបុគ្គលិក (${helpers.length})` : `Helpers (${helpers.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'attendance' 
                ? 'border-amber-600 text-amber-900 font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📅 {isKm ? 'កំណត់ត្រាវត្តមាន & ប្រាក់ខែ' : 'Attendance & Logs'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (helpers.length > 0 && !selectedHelperId) {
                setSelectedHelperId(helpers[0].id);
              }
              setActiveTab('add_log');
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add_log' 
                ? 'border-amber-600 text-amber-900 font-black' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ➕ {isKm ? 'កត់ត្រារហ័ស' : '+ Quick Record'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Metric Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    {isKm ? 'ថ្លៃពលកម្មខែនេះ' : 'Total Labor Cost'}
                  </span>
                  <div className="text-lg sm:text-xl font-black text-amber-900 font-mono">
                    ${totalLaborCostUsd.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-amber-700 font-mono">
                    ≈ {totalLaborCostLocal.toLocaleString()} {secondarySymbol}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {isKm ? 'ប្រាក់ខែបើករួច' : 'Salary Paid'}
                  </span>
                  <div className="text-lg sm:text-xl font-black text-emerald-900 font-mono">
                    ${totalSalaryPaidUsd.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-700">
                    {isKm ? 'បានបើក' : 'Paid out'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                    {isKm ? 'បុរេប្រទាន (ខ្ចីមុន)' : 'Advances Given'}
                  </span>
                  <div className="text-lg sm:text-xl font-black text-blue-900 font-mono">
                    ${totalAdvancesUsd.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-blue-700">
                    {isKm ? 'កាត់ពីប្រាក់ខែ' : 'Deducted'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                    {isKm ? 'អវត្តមានខែនេះ' : 'Days Absent'}
                  </span>
                  <div className="text-lg sm:text-xl font-black text-rose-900 font-mono">
                    {totalAbsencesCount} {isKm ? 'ថ្ងៃ' : 'days'}
                  </div>
                  <div className="text-[10px] text-rose-700">
                    {isKm ? 'ឈប់សម្រាក / ឈឺ' : 'Recorded leaves'}
                  </div>
                </div>
              </div>

              {/* Spoken Narration Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-950">
                      {isKm ? 'ស្តាប់ការពន្យល់សង្ខេបថ្លៃពលកម្មជាសំឡេង' : 'Listen to Voice Labor Summary'}
                    </h5>
                    <p className="text-[11px] text-amber-800/80">
                      {isKm 
                        ? 'ចុចដើម្បីឱ្យជំនួយការអានសង្ខេបប្រាក់ខែ និងវត្តមានកូនឈ្នួល' 
                        : 'Tap to have your assistant narrate labor costs aloud'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSpeakLaborSummary}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  {isKm ? 'ស្តាប់សំឡេង' : 'Listen'}
                </button>
              </div>

              {/* Helpers Card List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                    {isKm ? 'បុគ្គលិកសកម្ម' : 'Active Shop Helpers'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingHelper(true);
                      setActiveTab('helpers');
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isKm ? 'បន្ថែមបុគ្គលិក' : 'Add Helper'}</span>
                  </button>
                </div>

                {helpers.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">
                      {isKm ? 'មិនទាន់មានទិន្នន័យបុគ្គលិកនៅឡើយទេ' : 'No helpers registered yet.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingHelper(true);
                        setActiveTab('helpers');
                      }}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      + {isKm ? 'បន្ថែមបុគ្គលិកដំបូង' : 'Add First Helper'}
                    </button>
                  </div>
                ) : (
                  helpers.map((h) => {
                    const hLogs = monthLogs.filter((l) => l.helperId === h.id);
                    const paidSalary = hLogs.filter((l) => l.type === 'salary').reduce((acc, l) => acc + (l.amount || 0), 0);
                    const advances = hLogs.filter((l) => l.type === 'advance').reduce((acc, l) => acc + (l.amount || 0), 0);
                    const absences = hLogs.filter((l) => l.type === 'absence').length;
                    const baseSalary = h.monthlySalary || 150;
                    const remainingToPay = Math.max(0, baseSalary - paidSalary - advances);

                    return (
                      <div key={h.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center shrink-0">
                              {h.name.slice(0, 1)}
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <span>{h.name}</span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  {isKm ? 'សកម្ម' : 'Active'}
                                </span>
                              </h5>
                              <p className="text-xs text-slate-500">{h.role}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">{isKm ? 'ប្រាក់ខែគោល' : 'Base Wage'}</span>
                            <span className="text-sm font-black text-slate-900 font-mono">
                              ${baseSalary} / {isKm ? 'ខែ' : 'mo'}
                            </span>
                          </div>
                        </div>

                        {/* Helper Metrics */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">{isKm ? 'បានបើក' : 'Paid'}</span>
                            <span className="font-bold text-emerald-700 font-mono">${paidSalary}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{isKm ? 'បុរេប្រទាន' : 'Advances'}</span>
                            <span className="font-bold text-amber-700 font-mono">${advances}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">{isKm ? 'នៅសល់ត្រូវបើក' : 'Remaining'}</span>
                            <span className="font-black text-slate-900 font-mono">${remainingToPay}</span>
                          </div>
                        </div>

                        {/* Action Buttons for this helper */}
                        <div className="flex items-center justify-between gap-1.5 flex-wrap pt-1 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedHelperId(h.id);
                                setLogType('salary');
                                setLogAmount((h.monthlySalary || 150).toString());
                                setActiveTab('add_log');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-all cursor-pointer"
                            >
                              💵 {isKm ? 'បើកប្រាក់ខែ' : 'Pay Salary'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedHelperId(h.id);
                                setLogType('advance');
                                setLogAmount('20');
                                setActiveTab('add_log');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold transition-all cursor-pointer"
                            >
                              💸 {isKm ? 'បុរេប្រទាន' : 'Advance'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedHelperId(h.id);
                                setLogType('absence');
                                setActiveTab('add_log');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold transition-all cursor-pointer"
                            >
                              📅 {isKm ? 'កត់ត្រាឈប់' : 'Absence'}
                            </button>
                          </div>

                          {h.phone && (
                            <a
                              href={`tel:${h.phone}`}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{h.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HELPERS LIST & MANAGEMENT */}
          {activeTab === 'helpers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                  {isKm ? 'បញ្ជីឈ្មោះបុគ្គលិក / កូនឈ្នួល' : 'Helper Profiles'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingHelper(!isAddingHelper)}
                  className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isAddingHelper ? (isKm ? 'បោះបង់' : 'Cancel') : `+ ${isKm ? 'បន្ថែមថ្មី' : 'Add Helper'}`}
                </button>
              </div>

              {isAddingHelper && (
                <form onSubmit={handleCreateHelper} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <h5 className="text-xs font-black text-amber-900 uppercase">
                    {isKm ? 'ព័ត៌មានបុគ្គលិកថ្មី' : 'New Helper Information'}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isKm ? 'ឈ្មោះបុគ្គលិក *' : 'Helper Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newHelperName}
                        onChange={(e) => setNewHelperName(e.target.value)}
                        placeholder="e.g. សុខា, Dara, Linh"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isKm ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                      </label>
                      <input
                        type="text"
                        value={newHelperPhone}
                        onChange={(e) => setNewHelperPhone(e.target.value)}
                        placeholder="012 345 678"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isKm ? 'តួនាទី' : 'Role / Duties'}
                      </label>
                      <input
                        type="text"
                        value={newHelperRole}
                        onChange={(e) => setNewHelperRole(e.target.value)}
                        placeholder="ជំនួយការហាង, អ្នកដឹកទំនិញ..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isKm ? 'ប្រាក់ខែគោល (ដុល្លារ) *' : 'Base Monthly Salary ($) *'}
                      </label>
                      <input
                        type="number"
                        required
                        value={newHelperSalary}
                        onChange={(e) => setNewHelperSalary(e.target.value)}
                        placeholder="150"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingHelper(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      {isKm ? 'បោះបង់' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isKm ? 'រក្សាទុកបុគ្គលិក' : 'Save Helper'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {helpers.map((h) => (
                  <div key={h.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                        {h.name.slice(0, 1)}
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">{h.name}</h5>
                        <p className="text-[11px] text-slate-500">{h.role} • ${h.monthlySalary || 0}/mo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {h.phone && (
                        <a href={`tel:${h.phone}`} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteHelper(h.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Delete Helper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ATTENDANCE & ACTIVITY LOGS */}
          {activeTab === 'attendance' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                  {isKm ? 'កំណត់ត្រាវត្តមាន & ការទូទាត់ប្រាក់' : 'Attendance & Payment Logs'}
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('add_log')}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer"
                >
                  + {isKm ? 'កត់ត្រាថ្មី' : 'Add Log'}
                </button>
              </div>

              {laborLogs.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">
                    {isKm ? 'មិនទាន់មានកំណត់ត្រាអវត្តមាន ឬប្រាក់ខែនៅឡើយទេ' : 'No records yet. Use voice or the button above to add.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {laborLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                          log.type === 'salary' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : log.type === 'advance' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.type === 'salary' ? '💵' : log.type === 'advance' ? '💸' : '📅'}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">
                            {log.helperName} • {
                              log.type === 'salary' 
                                ? (isKm ? 'បើកប្រាក់ខែ' : 'Salary Payment')
                                : log.type === 'advance' 
                                ? (isKm ? 'បុរេប្រទាន (ខ្ចីមុន)' : 'Salary Advance')
                                : (isKm ? `អវត្តមាន / ឈប់ (${log.reason || 'ឈឺ'})` : `Absence (${log.reason || 'Sick'})`)
                            }
                          </span>
                          <span className="text-[10px] text-slate-400">{log.date} {log.notes ? `• "${log.notes}"` : ''}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {log.amount !== undefined && log.amount > 0 && (
                          <span className="font-mono font-black text-slate-900 text-xs sm:text-sm">
                            ${log.amount.toFixed(2)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteLaborLog(log.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUICK RECORD (SALARY / ADVANCE / ABSENCE) */}
          {activeTab === 'add_log' && (
            <form onSubmit={handleQuickAddLog} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                {isKm ? 'កត់ត្រារហ័ស៖ ប្រាក់ខែ, បុរេប្រទាន ឬ អវត្តមាន' : 'Quick Record: Salary, Advance, or Absence'}
              </h4>

              {/* Select Helper */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {isKm ? 'ជ្រើសរើសបុគ្គលិក *' : 'Select Helper *'}
                </label>
                <select
                  value={selectedHelperId}
                  onChange={(e) => setSelectedHelperId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {helpers.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.role}) - Base ${h.monthlySalary}/mo
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Type */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {isKm ? 'ប្រភេទកំណត់ត្រា *' : 'Record Type *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogType('salary')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      logType === 'salary' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    💵 {isKm ? 'បើកប្រាក់ខែ' : 'Salary'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogType('advance')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      logType === 'advance' 
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    💸 {isKm ? 'បុរេប្រទាន' : 'Advance'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogType('absence')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      logType === 'absence' 
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📅 {isKm ? 'អវត្តមាន/ឈប់' : 'Absence'}
                  </button>
                </div>
              </div>

              {/* Amount (if salary or advance) */}
              {logType !== 'absence' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {isKm ? 'ចំនួនទឹកប្រាក់ ($) *' : 'Amount ($) *'}
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={logAmount}
                      onChange={(e) => setLogAmount(e.target.value)}
                      placeholder="e.g. 150 or 20"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {isKm ? 'កាលបរិច្ឆេទ *' : 'Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Reason (if absence) */}
              {logType === 'absence' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {isKm ? 'មូលហេតុឈប់សម្រាក *' : 'Absence Reason *'}
                    </label>
                    <select
                      value={logReason}
                      onChange={(e) => setLogReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="sick">{isKm ? 'ឈឺ / សុខភាព (Sick)' : 'Sick Leave'}</option>
                      <option value="family">{isKm ? 'ធុរៈគ្រួសារ (Family)' : 'Family Matter'}</option>
                      <option value="emergency">{isKm ? 'បន្ទាន់ (Emergency)' : 'Emergency'}</option>
                      <option value="unexcused">{isKm ? 'គ្មានការអនុញ្ញាត (Unexcused)' : 'Unexcused'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {isKm ? 'កាលបរិច្ឆេទ *' : 'Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {isKm ? 'ចំណាំបន្ថែម (ស្រេចចិត្ត)' : 'Notes (Optional)'}
                </label>
                <input
                  type="text"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder={isKm ? 'ឧ. បើកតាម ABA ឬសាច់ប្រាក់...' : 'e.g. Paid in cash or ABA...'}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-colors cursor-pointer shadow-xs"
                >
                  {isKm ? 'កត់ត្រាទុក' : 'Save Record'}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">
              {isKm ? 'ទិន្នន័យត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិ' : 'Auto-synced to local ledger'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            {isKm ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
