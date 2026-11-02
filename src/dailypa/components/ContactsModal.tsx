import React, { useState } from 'react';
import { X, Users, Plus, Phone, Search, Trash2, BookOpen } from 'lucide-react';
import { Contact, SupportedLanguage } from '../types';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onAddContact: (c: Omit<Contact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
  lang: SupportedLanguage;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onAddContact,
  onDeleteContact,
  lang,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('អតិថិជន (Customer)');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const isKm = lang === 'km';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddContact({
      name: name.trim(),
      phoneNumber: phone.trim() || undefined,
      relation,
    });

    setName('');
    setPhone('');
  };

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phoneNumber && c.phoneNumber.includes(search))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isKm ? 'សៀវភៅទំនាក់ទំនង (Contacts)' : 'Contact Book'}
              </h3>
              <p className="text-xs text-slate-500">
                {isKm ? 'ម៉ូយទំនិញ អតិថិជន និងអ្នកផ្គត់ផ្គង់' : 'Customers, suppliers, and partners'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Form */}
        <form onSubmit={handleAdd} className="p-4 bg-slate-50 border-b border-slate-100 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="ឈ្មោះ (Name) *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold"
            />
            <input
              type="tel"
              placeholder="លេខទូរស័ព្ទ (Phone)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
            >
              <option value="អតិថិជន (Customer)">អតិថិជន (Customer)</option>
              <option value="អ្នកផ្គត់ផ្គង់ (Supplier)">អ្នកផ្គត់ផ្គង់ (Supplier)</option>
              <option value="គ្រួសារ (Family)">គ្រួសារ (Family)</option>
              <option value="ដៃគូការងារ (Partner)">ដៃគូការងារ (Partner)</option>
            </select>

            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs"
            >
              + បន្ថែម
            </button>
          </div>
        </form>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400">មិនទាន់មានទំនាក់ទំនងនៅឡើយទេ</p>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-900">{c.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {c.phoneNumber ? `${c.phoneNumber} • ` : ''}{c.relation}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {c.phoneNumber && (
                    <a
                      href={`tel:${c.phoneNumber}`}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-emerald-600"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => onDeleteContact(c.id)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
