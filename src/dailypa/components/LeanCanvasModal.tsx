import React, { useState, useEffect } from 'react';
import { 
  X, Copy, Check, Printer, Sparkles, Edit3, Save, 
  RotateCcw, ArrowRight, Layers, FileText, CheckCircle2 
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface LeanCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: SupportedLanguage;
}

export interface LeanCanvasData {
  problem: string[];
  existingAlternatives: string[];
  solution: string[];
  keyMetrics: string[];
  uvp: string;
  highLevelConcept: string;
  unfairAdvantage: string[];
  channels: string[];
  customerSegments: string[];
  earlyAdopters: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export const ORIGINAL_WORKBOOK_CANVAS: LeanCanvasData = {
  problem: [
    "Too many fragmented daily activities (medicines, grocery budgets, classes, debts, meetings).",
    "Typing in Khmer on mobile keyboards is slow, frustrating, and prone to typos for busy parents, elders, and workers.",
    "Traditional reminder/calendar apps are rigid and require multi-step manual setup."
  ],
  existingAlternatives: [
    "Paper notebooks, sticky notes",
    "Default smartphone calendar",
    "Telegram/WhatsApp self-chat",
    "Manual memory"
  ],
  solution: [
    "1-Tap Spoken Life-Log: Just tap & speak in natural Khmer/English — AI instantly auto-triages into Sales, Expenses, Medicine, or Tasks.",
    "Smart Proactive Audio Reminders: 5-minute advance voice alerts in Khmer + 1-day ahead evening preparation audio briefing.",
    "Offline-First Engine: Works 100% with zero internet; auto-syncs to cloud when connected.",
    "OCR Scanner & Bakong KHQR: Scan business cards & prescriptions; generate instant payment QR codes."
  ],
  keyMetrics: [
    "Daily Active Users (DAU) logging >= 2 voice notes/day.",
    "Voice-to-Action conversion rate (reminders completed, medicine taken).",
    "7-Day & 30-Day User Retention rate.",
    "Free-to-Paid Conversion rate after the 30-day free trial."
  ],
  uvp: "Your personal Khmer AI life & business assistant. Just speak your day naturally, and it automatically organizes your expenses, schedules, and health reminders with 1-tap simplicity.",
  highLevelConcept: "Siri + WhatsApp voice-log for Cambodian families & businesses.",
  unfairAdvantage: [
    "Deep Khmer voice understanding with native audio announcements & bilingual pronunciation.",
    "Multi-generational co-founding team (Mother + High-school Son + Lead Founder) testing daily in real family and school scenarios.",
    "Offline-ready PWA architecture tailored for Cambodian mobile data realities."
  ],
  channels: [
    "Family & student word-of-mouth (mothers sharing with relatives, students sharing in classroom study groups).",
    "TikTok / Facebook Reels 5-second demos: \"Stop typing to-do lists in Khmer — just talk to DailyPA!\"",
    "Community partnerships: High schools, universities, local health clinics, and SME merchant groups."
  ],
  customerSegments: [
    "Primary: Busy mothers & family caretakers (family health, medicine schedules, daily household expenses).",
    "Secondary: High school & university students (exam deadlines, homework, class schedules, personal allowances).",
    "Tertiary: Local MSME shop owners & freelancers (sales logs, customer receivables/debts, client contacts)."
  ],
  earlyAdopters: [
    "Smartphone users in Cambodia who already prefer voice notes on Telegram, and busy mothers managing elder care."
  ],
  costStructure: [
    "AI Speech-to-Text & Gemini NLP API costs (~$0.075 / million tokens — ultra low).",
    "Cloud Database & Hosting (Google Cloud Run & Firebase Firestore).",
    "Community testing incentives & localized marketing."
  ],
  revenueStreams: [
    "30-Day Full Free Trial for all new registered users ($0.00 / 0 KHR).",
    "Tiered Monthly Subscriptions via Bakong KHQR:",
    "• Tier 1 (1–10 logs/day): $1.00 = 4,000 KHR / month",
    "• Tier 2 (11–20 logs/day): $2.00 = 8,000 KHR / month",
    "• Tier 3 (21–30 logs/day): $3.00 = 12,000 KHR / month",
    "• Tier 4 (31–40 logs/day): $4.00 = 16,000 KHR / month",
    "• Tier 5 (>40 logs/day): $5.00 = 20,000 KHR / month",
    "Annual Pass Option: Pay 10 months, get 2 free (e.g., $40 / 160,000 KHR / year)."
  ]
};

export const UPDATED_RECOMMENDED_CANVAS: LeanCanvasData = {
  problem: [
    "Khmer Mobile Keyboard Friction: Typing complex Khmer script (vowels, subscripts, co-articulations) on mobile is frustrating and slow for busy mothers, elders, and shopkeepers.",
    "Dual-Currency & Cash Tracking Chaos: Constantly toggling between Riels (៛) and Dollars ($) causes daily mental calculation errors, unrecorded cash, and lost receipts.",
    "Unrecorded Informal Debts ('លុយជំពាក់') & Wage Advances: Customer debts and daily helper wages are scribbled on paper scraps or forgotten.",
    "Fragmented Apps: Calendar, calculator, Telegram voice memos, and notebooks are disconnected."
  ],
  existingAlternatives: [
    "Telegram voice messages to oneself or family members",
    "Torn paper slips & physical receipt notebooks",
    "Standard smartphone calculator + mental rate conversion (~4,000៛/$)",
    "Unstructured memory (leading to disputes and missed medicines)"
  ],
  solution: [
    "1-Tap Voice Secretary: Speak naturally in Khmer or English; AI instantly extracts Amount, Currency (៛ or $), Type, Category, and Due Date with zero typing.",
    "Native Dual-Currency Parser: Auto-detects Riels & USD (e.g. '២ម៉ឺនរៀល', 'ដុល្លារកន្លះ', '$10') with live KHQR exchange rates.",
    "Customer Debt & Labor Advance Vault: Instant voice-tracked credit book ('អតិថិជនជំពាក់' & 'កម្មករខ្ចីប្រាក់') with WhatsApp/Telegram receipt share.",
    "Proactive Audio Care: 5-minute spoken Khmer reminders for elders' medicines & daily P&L evening audio recap.",
    "Offline-First + Telegram Mini App: Zero install friction inside Telegram; works 100% offline without cellular data."
  ],
  keyMetrics: [
    "Daily Active Loggers (DAL): % of users recording >= 2 transactions or reminders daily.",
    "Voice-to-Action Accuracy: >95% voice transactions saved without manual keyboard correction.",
    "Dual-Currency Penetration: % of users actively tracking in both KHR and USD.",
    "Free-to-Paid Bakong Conversion: Trial-to-paid upgrade via 1-tap KHQR after 30 days.",
    "30-Day Retention: % of users who maintain active weekly streak."
  ],
  uvp: "The 1-Tap Khmer Voice Secretary for your daily money & life. Just speak your income, expenses, debts, and medication in natural Khmer — auto-organized in Riels (៛) & USD ($) with zero typing required.",
  highLevelConcept: "Siri + QuickBooks for Cambodia, natively integrated with Telegram & Bakong KHQR.",
  unfairAdvantage: [
    "Proprietary Khmer Colloquial Number & Dual-Currency NLP rules engine (handles verbal forms like ម៉ឺន, សែន, កន្លះដុល្លារ).",
    "Zero-Install Telegram Mini App distribution riding Cambodia's #1 messaging platform.",
    "Authentic Multi-Generational Co-founding Team (Mother + Son + Lead Founder) solving real daily Cambodian family and MSME challenges.",
    "Offline-first PWA architecture resilient to provincial internet dropouts."
  ],
  channels: [
    "Telegram Bot & Channel Virality: Direct export of daily voice recaps & payment receipts to family/vendor Telegram chats.",
    "5-Second TikTok / Facebook Reels: High-contrast videos ('Stop typing Khmer to-do lists — watch DailyPA do it in 2 seconds').",
    "Market Vendor & Salon Ambassadors: On-the-ground 30-second demos at local wet markets (Toul Tompoung, Phsar Thmei).",
    "High School & University Study Groups: Student allowance and exam reminder word-of-mouth."
  ],
  customerSegments: [
    "Primary Beachhead: Local Khmer MSMEs & Market Stalls (grocery shops, coffee kiosks, street vendors, salons) needing effortless daily sales & debt logs.",
    "Core Family: Busy mothers & family caretakers managing elder health/prescriptions and household grocery budgets.",
    "Youth & Students: High school & college students tracking daily allowance, study schedules, and exam deadlines.",
    "Early Adopters: Cambodian smartphone users who already communicate primarily via Telegram voice notes instead of typing text."
  ],
  earlyAdopters: [
    "Cambodian smartphone users who already exchange 10+ Telegram voice notes per day, market stall vendors handling Bakong KHQR, and mothers managing elderly parents' daily medicines."
  ],
  costStructure: [
    "AI Speech-to-Text & Gemini NLP Tokens (~$0.075 / million tokens — ultra-low marginal cost).",
    "Cloud Infrastructure: Google Cloud Run & Firebase Firestore with client-side caching.",
    "Bakong KHQR Payment Gateway API integration & merchant verification.",
    "Localized Community Outreach & Market Ambassador incentives."
  ],
  revenueStreams: [
    "30-Day Full Free Trial: 100% unrestricted features for all new users ($0.00 / 0 KHR).",
    "Tiered Monthly Subscriptions via Bakong KHQR:",
    "• Tier 1 (1–10 logs/day): $1.00 = 4,000 KHR / month",
    "• Tier 2 (11–20 logs/day): $2.00 = 8,000 KHR / month",
    "• Tier 3 (21–30 logs/day): $3.00 = 12,000 KHR / month",
    "• Tier 4 (31–40 logs/day): $4.00 = 16,000 KHR / month",
    "• Tier 5 (>40 logs/day): $5.00 = 20,000 KHR / month",
    "Annual Pass Option: Pay 10 months, get 2 free (e.g., $40 / 160,000 KHR / year)."
  ]
};

export const LeanCanvasModal: React.FC<LeanCanvasModalProps> = ({
  isOpen,
  onClose,
  lang = 'km',
}) => {
  const [activeTab, setActiveTab] = useState<'updated' | 'original' | 'diff'>('updated');
  const [canvasData, setCanvasData] = useState<LeanCanvasData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dailypa_custom_lean_canvas');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return UPDATED_RECOMMENDED_CANVAS;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeTab === 'original') {
      setCanvasData(ORIGINAL_WORKBOOK_CANVAS);
      setIsEditing(false);
    } else if (activeTab === 'updated') {
      const saved = localStorage.getItem('dailypa_custom_lean_canvas');
      if (saved) {
        try { setCanvasData(JSON.parse(saved)); } catch (e) {}
      } else {
        setCanvasData(UPDATED_RECOMMENDED_CANVAS);
      }
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const data = activeTab === 'original' ? ORIGINAL_WORKBOOK_CANVAS : canvasData;
    const text = `
LEAN CANVAS - AIM GROWTH PROGRAM (MyDailyPA)
==============================================
1. PROBLEM:
${data.problem.map(p => `• ${p}`).join('\n')}

EXISTING ALTERNATIVES:
${data.existingAlternatives.map(a => `• ${a}`).join('\n')}

2. CUSTOMER SEGMENTS:
${data.customerSegments.map(c => `• ${c}`).join('\n')}

EARLY ADOPTERS:
${data.earlyAdopters.map(e => `• ${e}`).join('\n')}

3. UNIQUE VALUE PROPOSITION:
"${data.uvp}"
High-Level Concept: ${data.highLevelConcept}

4. SOLUTION:
${data.solution.map(s => `• ${s}`).join('\n')}

5. CHANNELS:
${data.channels.map(c => `• ${c}`).join('\n')}

6. REVENUE STREAMS:
${data.revenueStreams.map(r => `• ${r}`).join('\n')}

7. COST STRUCTURE:
${data.costStructure.map(c => `• ${c}`).join('\n')}

8. KEY METRICS:
${data.keyMetrics.map(k => `• ${k}`).join('\n')}

9. UNFAIR ADVANTAGE:
${data.unfairAdvantage.map(u => `• ${u}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('dailypa_custom_lean_canvas', JSON.stringify(canvasData));
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    if (confirm('កំណត់ឡើងវិញទៅទម្រង់គំរូ 2026? (Reset to 2026 Recommended Version?)')) {
      localStorage.removeItem('dailypa_custom_lean_canvas');
      setCanvasData(UPDATED_RECOMMENDED_CANVAS);
      setIsEditing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentData = activeTab === 'original' ? ORIGINAL_WORKBOOK_CANVAS : canvasData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-6xl my-auto rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Control Bar */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/40">
                  AIM Growth Program · Workbook
                </span>
                <span className="text-[10px] font-black text-slate-400">Page 2 of 3</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>LEAN CANVAS · MyDailyPA</span>
                <span className="text-xs font-normal text-slate-400 hidden sm:inline">Your business, one page at a time</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Selector */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center text-xs font-bold border border-slate-700">
              <button
                onClick={() => setActiveTab('updated')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'updated' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                ✨ Updated 2026 Model
              </button>
              <button
                onClick={() => setActiveTab('original')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'original' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                📄 Original Sheet
              </button>
              <button
                onClick={() => setActiveTab('diff')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'diff' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                ⚖️ What Changed?
              </button>
            </div>

            <button
              onClick={handleCopySummary}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Copy structured text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Print Canvas"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status banner */}
        <div className="px-6 py-2 bg-indigo-50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-indigo-950 font-medium">
            <span className="text-sm">🎯</span>
            {activeTab === 'updated' && (
              <span><strong>Updated 2026 Strategy:</strong> Integrated Dual-Currency KHR/USD, Telegram Mini App distribution, Simplified Voice UX, and Bakong KHQR tiers.</span>
            )}
            {activeTab === 'original' && (
              <span><strong>Original Sheet:</strong> Exact transcript of the filled workbook sheet from your AIM Growth Program session.</span>
            )}
            {activeTab === 'diff' && (
              <span><strong>Strategic Comparison:</strong> Review key evolutions between the original workbook draft and our actual market product.</span>
            )}
          </div>

          {activeTab === 'updated' && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveCustom}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1 hover:bg-indigo-100"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Canvas</span>
                  </button>
                  <button
                    onClick={handleResetToDefault}
                    className="p-1 text-slate-400 hover:text-slate-600 text-xs"
                    title="Reset to recommended"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 print:bg-white print:p-0">
          
          {activeTab === 'diff' ? (
            /* Strategic Diff / Analysis View */
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Key Strategic Updates to Your Lean Canvas</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Based on your product execution and Cambodia's market reality, here are the 5 major pivots updated in the 2026 Model:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Dual Currency */}
                <div className="p-4 rounded-2xl bg-white border-l-4 border-l-emerald-500 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900">1. Dual-Currency (KHR ៛ & USD $) as Core Pillar</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Crucial Pivot</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Before:</strong> General expense tracking without acknowledging Cambodia’s dual-currency everyday reality.<br />
                    <strong>Updated:</strong> Spoken Khmer recognition handles colloquial numbers (ម៉ឺន, សែន, កន្លះដុល្លារ) and toggles Riels and USD natively with live KHQR conversions.
                  </p>
                </div>

                {/* 2. Customer Segment */}
                <div className="p-4 rounded-2xl bg-white border-l-4 border-l-indigo-500 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900">2. Beachhead: MSMEs & Market Stalls</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">High Willingness to Pay</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Before:</strong> Students and busy mothers prioritized equally with MSMEs.<br />
                    <strong>Updated:</strong> While students love the free trial, <em>MSMEs, coffee shops, grocery stalls, and salons</em> have an immediate ROI for logging sales, customer debt ("លុយជំពាក់"), and helper wages.
                  </p>
                </div>

                {/* 3. Distribution */}
                <div className="p-4 rounded-2xl bg-white border-l-4 border-l-sky-500 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900">3. Telegram Mini App as #1 Channel</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">Zero Friction</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Before:</strong> General app store PWA and social media ads.<br />
                    <strong>Updated:</strong> Embed directly inside Telegram via Telegram WebApp (TMA), bypassing app store friction and meeting Cambodians right inside their primary daily chat tool.
                  </p>
                </div>

                {/* 4. Pricing Alignment */}
                <div className="p-4 rounded-2xl bg-white border-l-4 border-l-amber-500 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900">4. Aligned Bakong KHQR Tiers</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Synchronized</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Unified Setup:</strong> Perfectly aligned across the app, Bakong KHQR, and your workbook:<br />
                    • Tier 1 (1–10 logs/day): $1 = 4,000៛ (Students & Daily Study)<br />
                    • Tier 2 (11–20 logs/day): $2 = 8,000៛ (Family Care & Elder Medicine)<br />
                    • Tier 3 (21–30 logs/day): $3 = 12,000៛ (Freelancers & Project Work)<br />
                    • Tier 4 (31–40 logs/day): $4 = 16,000៛ (MSMEs, Salons, Coffee Shops)<br />
                    • Tier 5 (&gt;40 logs/day): $5 = 20,000៛ (Wholesalers & Power Users)<br />
                    • <em>Annual Pass Option:</em> Pay 10 months, get 2 free (e.g. $40 / 160,000 KHR/yr).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Ready to apply this to your AIM Growth Program Workbook?</h4>
                  <p className="text-xs text-slate-400">Switch to the "Updated 2026 Model" tab to review or copy the full text.</p>
                </div>
                <button
                  onClick={() => setActiveTab('updated')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white flex items-center gap-1.5"
                >
                  <span>View Updated Model</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Traditional 9-Box Lean Canvas Grid Layout */
            <div className="w-full bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-3 sm:p-5 print:border-none print:shadow-none space-y-3">
              
              {/* Top Header of Workbook */}
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <div>
                  <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">LEAN CANVAS</span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Your business, one page at a time</h1>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">Fill each box as we go through it, box by box. Don't worry about neatness — this gets rewritten every week.</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block">
                    <span className="block text-xs font-black tracking-wider text-slate-900 uppercase">FIRST WAVE</span>
                    <span className="block text-[10px] font-bold text-indigo-600">AIM AI IN MOTION</span>
                  </div>
                </div>
              </div>

              {/* Grid System for 9 Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 sm:gap-3">
                
                {/* 1. PROBLEM + EXISTING ALTERNATIVES */}
                <div className="md:col-span-1 flex flex-col gap-2.5">
                  {/* Problem Box */}
                  <div className="flex-1 p-3 rounded-xl border border-slate-300 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-indigo-950">1 · Problem</span>
                      </div>
                      <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-3 leading-relaxed">
                        {currentData.problem.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Existing Alternatives */}
                  <div className="p-3 rounded-xl border border-slate-300 bg-white">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Existing Alternatives</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-3">
                      {currentData.existingAlternatives.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. SOLUTION + 8. KEY METRICS */}
                <div className="md:col-span-1 flex flex-col gap-2.5">
                  {/* Solution Box */}
                  <div className="flex-1 p-3 rounded-xl border border-slate-300 bg-slate-50/50">
                    <span className="text-xs font-black text-indigo-950 block mb-1.5">4 · Solution</span>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-3 leading-relaxed">
                      {currentData.solution.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Metrics Box */}
                  <div className="p-3 rounded-xl border border-slate-300 bg-white">
                    <span className="text-[11px] font-bold text-slate-800 block mb-1">8 · Key Metrics</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-3 leading-relaxed">
                      {currentData.keyMetrics.map((k, idx) => (
                        <li key={idx}>{k}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3. UNIQUE VALUE PROPOSITION (Dark Navy centerpiece matching the workbook) */}
                <div className="md:col-span-1 p-3.5 rounded-xl bg-slate-900 text-white flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-xs font-black text-indigo-300 block mb-1">3 · Unique Value Proposition</span>
                    <p className="text-[10px] text-slate-400 mb-2 italic">One sentence — why should a stranger care?</p>
                    <blockquote className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed border-l-2 border-indigo-400 pl-2.5 py-1">
                      "{currentData.uvp}"
                    </blockquote>
                  </div>

                  <div className="pt-3 border-t border-slate-800 mt-3">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">High-Level Concept</span>
                    <p className="text-xs text-slate-300 font-medium">
                      {currentData.highLevelConcept}
                    </p>
                  </div>
                </div>

                {/* 9. UNFAIR ADVANTAGE + 5. CHANNELS */}
                <div className="md:col-span-1 flex flex-col gap-2.5">
                  {/* Unfair Advantage Box */}
                  <div className="flex-1 p-3 rounded-xl border border-slate-300 bg-slate-50/50">
                    <span className="text-xs font-black text-indigo-950 block mb-1.5">9 · Unfair Advantage</span>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-3 leading-relaxed">
                      {currentData.unfairAdvantage.map((u, idx) => (
                        <li key={idx}>{u}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Channels Box */}
                  <div className="p-3 rounded-xl border border-slate-300 bg-white">
                    <span className="text-[11px] font-bold text-slate-800 block mb-1">5 · Channels</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-3 leading-relaxed">
                      {currentData.channels.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. CUSTOMER SEGMENTS + EARLY ADOPTERS */}
                <div className="md:col-span-1 flex flex-col gap-2.5">
                  {/* Customer Segments Box */}
                  <div className="flex-1 p-3 rounded-xl border-2 border-dashed border-sky-400 bg-sky-50/40">
                    <span className="text-xs font-black text-sky-950 block mb-1.5">2 · Customer Segments</span>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-3 leading-relaxed">
                      {currentData.customerSegments.map((cs, idx) => (
                        <li key={idx}>{cs}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Early Adopters */}
                  <div className="p-3 rounded-xl border border-slate-300 bg-white">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Early Adopters</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-3">
                      {currentData.earlyAdopters.map((ea, idx) => (
                        <li key={idx}>{ea}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Bottom Row: 7. Cost Structure & 6. Revenue Streams */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t-2 border-slate-200">
                {/* 7. Cost Structure */}
                <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50/60">
                  <span className="text-xs font-black text-indigo-950 block mb-1.5">7 · Cost Structure</span>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc pl-3 leading-relaxed">
                    {currentData.costStructure.map((cost, idx) => (
                      <li key={idx}>{cost}</li>
                    ))}
                  </ul>
                </div>

                {/* 6. Revenue Streams */}
                <div className="p-3.5 rounded-xl border border-slate-300 bg-emerald-50/40">
                  <span className="text-xs font-black text-emerald-950 block mb-1.5">6 · Revenue Streams</span>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc pl-3 leading-relaxed">
                    {currentData.revenueStreams.map((rev, idx) => (
                      <li key={idx}>{rev}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer matching workbook */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                <div>AIM Growth Program · Workbook</div>
                <div className="font-mono">Founder's Reality Check & Lean Canvas · Page 2 of 3</div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
