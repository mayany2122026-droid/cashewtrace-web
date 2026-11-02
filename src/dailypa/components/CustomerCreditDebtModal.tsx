import React, { useState } from 'react';
import { 
  X, Plus, BookOpen, User, Phone, DollarSign, Calendar,
  ArrowDownLeft, ArrowUpRight, Send, CheckCircle2, MessageSquare,
  Mic, Trash2
} from 'lucide-react';
import { CreditDebtRecord, SupportedLanguage } from '../types';

interface CustomerCreditDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtRecords: CreditDebtRecord[];
  onAddDebtRecord: (record: Omit<CreditDebtRecord, 'id' | 'createdAt'>) => void;
  onRecordPayment: (id: string, paymentAmount: number, syncToIncome: boolean) => void;
  onDeleteDebtRecord: (id: string) => void;
  currencyRate: number;
  lang: SupportedLanguage;
}

export const CustomerCreditDebtModal: React.FC<CustomerCreditDebtModalProps> = ({
  isOpen,
  onClose,
  debtRecords,
  onAddDebtRecord,
  onRecordPayment,
  onDeleteDebtRecord,
  currencyRate,
  lang,
}) => {
  const [filter, setFilter] = useState<'all' | 'customer_owes_me' | 'i_owe_supplier'>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD');
  const [debtType, setDebtType] = useState<'customer_owes_me' | 'i_owe_supplier'>('customer_owes_me');
  const [itemsOrDescription, setItemsOrDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Payment collection popup
  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [syncToIncome, setSyncToIncome] = useState(true);

  if (!isOpen) return null;

  const isKm = lang === 'km';

  const filtered = debtRecords.filter((r) => {
    if (filter === 'customer_owes_me') return r.debtType === 'customer_owes_me';
    if (filter === 'i_owe_supplier') return r.debtType === 'i_owe_supplier';
    return true;
  });

  // Calculate totals
  let totalReceivableUsd = 0;
  let totalPayableUsd = 0;

  debtRecords.forEach((r) => {
    const val = r.currency === 'KHR' ? r.remainingAmount / currencyRate : r.remainingAmount;
    if (r.debtType === 'customer_owes_me') {
      totalReceivableUsd += val;
    } else {
      totalPayableUsd += val;
    }
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !totalAmount) return;

    const amt = parseFloat(totalAmount);
    onAddDebtRecord({
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim() || undefined,
      totalAmount: amt,
      paidAmount: 0,
      remainingAmount: amt,
      currency,
      debtType,
      itemsOrDescription: itemsOrDescription.trim() || 'កត់បំណុល',
      dueDate: dueDate || undefined,
      status: 'unpaid',
      paymentHistory: [],
    });

    // Reset
    setContactName('');
    setContactPhone('');
    setTotalAmount('');
    setItemsOrDescription('');
    setDueDate('');
    setIsAddingNew(false);
  };

  const handlePaymentSubmit = (id: string) => {
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return;
    onRecordPayment(id, amt, syncToIncome);
    setCollectingId(null);
    setPayAmount('');
  };

  const handleSendReminder = (record: CreditDebtRecord) => {
    const text = `សួស្តីបង ${record.contactName}! នាងខ្ញុំសូមរំលឹកពីការជំពាក់ថ្លៃ ${record.itemsOrDescription} ចំនួន ${record.remainingAmount} ${record.currency}។ សូមអរគុណបងច្រើន!`;
    const url = `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isKm ? 'សៀវភៅកត់បំណុល (Credit & Debt Book)' : 'Customer Debt & Credit Book'}
              </h3>
              <p className="text-xs text-slate-500">
                {isKm ? 'កត់ត្រាម៉ូយជំពាក់ និងយើងជំពាក់គេ 100% ឯកជនភាព' : 'Track receivables, payables, and friendly reminders'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Overview Cards */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-black uppercase text-emerald-800">
              {isKm ? 'ម៉ូយជំពាក់យើង (Customer Owes Me)' : 'Receivables'}
            </span>
            <p className="text-lg font-black font-mono text-emerald-700 mt-0.5">
              ${totalReceivableUsd.toFixed(2)}
            </p>
            <span className="text-[10px] font-mono text-emerald-600">
              ≈ {(totalReceivableUsd * currencyRate).toLocaleString()} ៛
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[10px] font-black uppercase text-rose-800">
              {isKm ? 'យើងជំពាក់គេ (I Owe Supplier)' : 'Payables'}
            </span>
            <p className="text-lg font-black font-mono text-rose-700 mt-0.5">
              ${totalPayableUsd.toFixed(2)}
            </p>
            <span className="text-[10px] font-mono text-rose-600">
              ≈ {(totalPayableUsd * currencyRate).toLocaleString()} ៛
            </span>
          </div>
        </div>

        {/* Filter Tabs & Add Button */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${filter === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'}`}
            >
              ទាំងអស់ ({debtRecords.length})
            </button>
            <button
              onClick={() => setFilter('customer_owes_me')}
              className={`px-3 py-1 rounded-lg transition-all ${filter === 'customer_owes_me' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600'}`}
            >
              ម៉ូយជំពាក់
            </button>
            <button
              onClick={() => setFilter('i_owe_supplier')}
              className={`px-3 py-1 rounded-lg transition-all ${filter === 'i_owe_supplier' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-600'}`}
            >
              យើងជំពាក់គេ
            </button>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingNew ? 'បិទ' : '+ កត់បំណុលថ្មី'}</span>
          </button>
        </div>

        {/* Add New Debt Form Drawer */}
        {isAddingNew && (
          <form onSubmit={handleCreateSubmit} className="p-4 bg-amber-50/60 border-b border-amber-200 space-y-3">
            <h4 className="text-xs font-black text-amber-900 uppercase">កត់ត្រាការជំពាក់ថ្មី</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">ឈ្មោះអ្នកជំពាក់ *</label>
                <input
                  type="text"
                  placeholder="ឧ. សុខលី, ហាងកេសក្រដាស..."
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">លេខទូរស័ព្ទ (Optional)</label>
                <input
                  type="tel"
                  placeholder="012 345 678"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">ចំនួនទឹកប្រាក់ *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="50"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">រូបិយប័ណ្ណ</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                >
                  <option value="USD">USD ($)</option>
                  <option value="KHR">KHR (៛)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">ប្រភេទជំពាក់</label>
                <select
                  value={debtType}
                  onChange={(e) => setDebtType(e.target.value as any)}
                  className="w-full px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                >
                  <option value="customer_owes_me">ម៉ូយជំពាក់ខ្ញុំ (Receivable)</option>
                  <option value="i_owe_supplier">ខ្ញុំជំពាក់គេ (Payable)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">ថ្ងៃសងវិញ (Due Date)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">បរិយាយទំនិញ / កំណត់ត្រា</label>
              <input
                type="text"
                placeholder="ឧ. ទិញសាប៊ូធម្មជាតិ ៥០ ដប, ថ្លៃប្រអប់កេស..."
                value={itemsOrDescription}
                onChange={(e) => setItemsOrDescription(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
              >
                បោះបង់
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs"
              >
                រក្សាទុក
              </button>
            </div>
          </form>
        )}

        {/* Scrollable Debt List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="text-3xl">📖</div>
              <h4 className="text-sm font-black text-slate-700">មិនទាន់មានទិន្នន័យជំពាក់នៅឡើយទេ</h4>
              <p className="text-xs text-slate-400">ចុចលើ "+ កត់បំណុលថ្មី" ដើម្បីបន្ថែម</p>
            </div>
          ) : (
            filtered.map((record) => {
              const isReceivable = record.debtType === 'customer_owes_me';
              return (
                <div
                  key={record.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isReceivable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isReceivable ? 'ម៉ូយជំពាក់' : 'ជំពាក់គេ'}
                        </span>
                        <h4 className="text-sm font-black text-slate-900">{record.contactName}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{record.itemsOrDescription}</p>
                      {record.dueDate && (
                        <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>សងនៅ៖ {record.dueDate}</span>
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black font-mono text-slate-900 block">
                        {record.remainingAmount.toLocaleString()} {record.currency}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        សរុប៖ {record.totalAmount} | បានបង់៖ {record.paidAmount}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Collect Payment, Send Reminder, Delete */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {/* Collect Payment button */}
                      {record.remainingAmount > 0 && (
                        <button
                          onClick={() => setCollectingId(record.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>កត់ប្រមូលលុយ</span>
                        </button>
                      )}

                      {/* 1-tap Telegram reminder */}
                      {isReceivable && record.remainingAmount > 0 && (
                        <button
                          onClick={() => handleSendReminder(record)}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3 text-sky-600" />
                          <span>រំលឹក Telegram</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteDebtRecord(record.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Payment Collection Drawer inside card */}
                  {collectingId === record.id && (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span>កត់ត្រាការបង់លុយសង៖</span>
                        <button onClick={() => setCollectingId(null)} className="text-slate-400">✕</button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="any"
                          placeholder={`ចំនួនប្រាក់ (${record.currency})`}
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-bold"
                        />
                        <button
                          onClick={() => handlePaymentSubmit(record.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                        >
                          កត់ត្រា
                        </button>
                      </div>

                      <label className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncToIncome}
                          onChange={(e) => setSyncToIncome(e.target.checked)}
                          className="rounded text-emerald-600"
                        />
                        <span>បញ្ចូលជាចំណូល DailyPA ស្វ័យប្រវត្តិ (Sync to Income)</span>
                      </label>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
