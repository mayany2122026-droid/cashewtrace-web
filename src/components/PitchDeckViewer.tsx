import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Printer, Maximize2, Minimize2,
  Sparkles, ShieldCheck, QrCode, CheckCircle2,
  Globe, Cpu, FileText, X, Play, ZoomIn, ZoomOut, Download, Copy, Check
} from 'lucide-react';
import CashewTraceLogo, { CashewTraceIcon, CashewNutIcon, PepperCornIcon } from './CashewTraceLogo';
import { downloadPitchDeckHtmlFile, openCleanPrintDeckWindow } from '../utils/pitchDeckExport';

interface PitchDeckViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PitchDeckViewer({ isOpen, onClose }: PitchDeckViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontScale, setFontScale] = useState<'normal' | 'large'>('large');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreen]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullScreen(false);
    }
  };

  if (!isOpen) return null;

  // Scale multipliers for presentation
  const isLarge = fontScale === 'large';

  const slides = [
    // SLIDE 1: COVER
    {
      id: 1,
      title: "Cover & Title",
      headerSubtitle: "AsiaBerlin Summit 2026 Delegation • Cambodian AgriTech & Sustainable Food Innovation",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
          {/* Subtle Beautiful.ai glow effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Row */}
          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200/80 inline-flex items-center">
                <CashewTraceLogo className="h-9 sm:h-11 w-auto" />
              </div>
            </div>
            <span className="text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-2">
              <span>🇰🇭🇩🇪</span>
              <span>AsiaBerlin Summit 2026 Delegation</span>
            </span>
          </div>

          {/* Center Main Hero */}
          <div className="my-auto z-10 max-w-4xl space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
              <Sparkles size={16} /> HACCP Agro-Processing • Digital QR Traceability • EUDR Compliance
            </div>
            <h1 className={`${isLarge ? 'text-3xl sm:text-5xl lg:text-6xl' : 'text-2xl sm:text-4xl lg:text-5xl'} font-black tracking-tight leading-tight text-white`}>
              Mayany Enterprise <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-400">
                Traceable Value-Added Cashew Innovation
              </span>
            </h1>
            <p className={`${isLarge ? 'text-base sm:text-xl lg:text-2xl' : 'text-sm sm:text-lg'} text-slate-200 max-w-3xl font-light leading-relaxed`}>
              Transforming Cambodian cashews into premium export-ready products—from signature <strong>GI Organic Kampot Pepper Coated Cashews</strong>, <strong>Cashew Nibs</strong>, and <strong>Cashew Biscuits</strong> to verifiable farm-to-shelf digital QR passports.
            </p>
          </div>

          {/* Bottom Footer Details */}
          <div className="pt-4 sm:pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-300 gap-2 z-10">
            <div>
              <p className="font-bold text-white text-sm sm:text-base">Mayany Enterprise <span className="text-emerald-400 font-normal">powered by CashewTrace</span></p>
              <p className="text-slate-400 text-xs mt-0.5">Founder & CEO: Mayany SAM • Supported by FTC / MISTI & Khmer Enterprise</p>
            </div>
            <div className="text-left sm:text-right font-mono text-emerald-300 text-xs sm:text-sm">
              <p className="font-bold">mayanyenterprise.com • cashewtrace.com</p>
              <p className="text-slate-400 font-sans">Production Facility in Phnom Penh & Suppliers from Kampong Thom province</p>
            </div>
          </div>
        </div>
      ),
      notes: "Good day, esteemed selection committee. I am Mayany SAM, Founder and CEO of Mayany Enterprise. We are an agro-processing company working directly with FTC / MISTI and Khmer Enterprise to operate a HACCP-standard facility in Cambodia. Through our CashewTrace digital platform and smart packaging, we deliver premium, traceable value-added cashew snacks to the European market."
    },

    // SLIDE 2: THE PROBLEM
    {
      id: 2,
      title: "The Problem",
      headerSubtitle: "Market Inefficiencies & Regulatory Roadblocks",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-950 text-white relative">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-400/30">
              The Market Challenge
            </span>
            <h2 className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-3xl'} font-black mt-2 text-white leading-tight`}>
              Why Cambodian Cashew Farmers & MSMEs Miss $1B+ in Value
            </h2>
          </div>

          {/* 3 High-Contrast Cards with Big Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 my-auto text-left">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-slate-700/80 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-3xl sm:text-5xl font-black text-red-400">85%+</span>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mt-2 mb-2`}>
                  Exported Raw Unprocessed
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  Cambodia harvests 1,100,000 MT of raw cashews, but lack of domestic value addition forces farmers to sell raw crop at bottom commodity prices.
                </p>
              </div>
              <span className="mt-4 text-[11px] sm:text-xs font-mono text-red-400/90 font-semibold">✗ Lost Local Profits</span>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-slate-700/80 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-3xl sm:text-5xl font-black text-amber-400">80%</span>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mt-2 mb-2`}>
                  Retail Packaging Rejection
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  Local food producers struggle with complex National Standard CS 001 packaging, barcode costs, and bilingual nutrition labels.
                </p>
              </div>
              <span className="mt-4 text-[11px] sm:text-xs font-mono text-amber-400/90 font-semibold">✗ Supermarket Shelf Block</span>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-slate-700/80 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-3xl sm:text-5xl font-black text-emerald-400">EUDR</span>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mt-2 mb-2`}>
                  Strict EU Traceability
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  EU Deforestation Regulations require verifiable GPS polygon farm plots and digital batch tracking that manual paper notebooks cannot meet.
                </p>
              </div>
              <span className="mt-4 text-[11px] sm:text-xs font-mono text-emerald-400/90 font-semibold">✗ High Export Barrier</span>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-400 gap-1 text-left">
            <span className="flex items-center gap-2 font-medium text-slate-300">
              <span className="text-amber-400 font-bold">Opportunity:</span> HACCP Facility + Light AI Traceability
            </span>
            <span className="text-slate-400 font-medium">
              Mayany Enterprise <span className="text-emerald-400 font-semibold">powered by CashewTrace</span>
            </span>
          </div>
        </div>
      ),
      notes: "Cambodian agricultural producers face a triple crisis: First, 85% of our 1.1M tons of cashew is shipped unprocessed to neighboring countries. Second, local processors trying to make high-value products fail to enter modern supermarkets because they cannot format CS 001 standard packaging. Third, upcoming EU deforestation rules threaten to shut Cambodian exporters out without digital GPS records."
    },

    // SLIDE 3: THE SOLUTION
    {
      id: 3,
      title: "The Solution",
      headerSubtitle: "HACCP Processing Facility + CashewTrace Digital Platform",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-950 text-white">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/30">
              Our Integrated Solution
            </span>
            <h2 className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-3xl'} font-black mt-2 text-white leading-tight`}>
              HACCP Food Processing + Smart Digital Packaging
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 my-auto text-left">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-amber-500/40 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <CashewNutIcon className="w-8 h-8" />
                </div>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mb-2`}>
                  1. Value-Added Products
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  Signature <strong>GI Organic Kampot Pepper Coated Cashews</strong>, <strong>Cashew Nibs</strong>, and <strong>Cashew Biscuits</strong> for zero-waste circular food production.
                </p>
              </div>
              <span className="mt-4 text-xs font-mono text-amber-400 font-bold">✓ Premium Taste & Zero Waste</span>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-emerald-500/40 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck size={26} />
                </div>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mb-2`}>
                  2. HACCP Standard Facility
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  Modern agro-processing plant upgraded with direct technical consultation from <strong>FTC / MISTI</strong> and <strong>Khmer Enterprise (KE)</strong>.
                </p>
              </div>
              <span className="mt-4 text-xs font-mono text-emerald-400 font-bold">✓ International Food Safety</span>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-blue-500/40 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <QrCode size={26} />
                </div>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mb-2`}>
                  3. Digital QR Passport
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  Interactive on-pack QR code linking European buyers and consumers directly to verified GPS farm origins, harvest dates, and food safety lab tests.
                </p>
              </div>
              <span className="mt-4 text-xs font-mono text-blue-400 font-bold">✓ EUDR Deforestation-Free Proof</span>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-400 gap-1 text-left">
            <span className="text-emerald-300 font-medium">Combining physical agro-processing excellence with transparent digital verification</span>
            <span className="text-slate-400 font-medium">
              Mayany Enterprise <span className="text-emerald-400 font-semibold">powered by CashewTrace</span>
            </span>
          </div>
        </div>
      ),
      notes: "Mayany Enterprise bridges this gap by combining physical agro-processing excellence with digital traceability. We produce high-value GI Organic Kampot pepper coated cashews, cashew nibs, and cashew biscuits in our HACCP-standard facility, and attach interactive QR digital product passports to every package."
    },

    // SLIDE 4: HOW THE AI WORKS
    {
      id: 4,
      title: "Technology & AI Engine",
      headerSubtitle: "Generative AI + Computer Vision Quality Assessment",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-950 text-white">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/30">
              Technology Architecture
            </span>
            <h2 className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-3xl'} font-black mt-2 text-white leading-tight`}>
              AI Built Specifically for Cambodian Agricultural Realities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 my-auto text-left">
            {/* GenAI Box */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-700/80 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-bold">
                  Phase 1 (Live Now)
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-mono">Gemini AI / LLM Engine</span>
              </div>
              <h3 className={`${isLarge ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} font-bold text-white`}>
                Local and multilingual Packaging & Standard Assistant
              </h3>
              <ul className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 space-y-3`}>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Translates technical ingredients into certified Khmer/English food terminology.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Calculates nutritional values and formats CS 001 / FDA compliant nutrition tables.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Generates compelling single-origin farmer stories for European conscious consumers.</span>
                </li>
              </ul>
            </div>

            {/* Computer Vision Box */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-700/80 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs sm:text-sm font-bold">
                  Phase 2 (Roadmap)
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-mono">Computer Vision / Edge AI</span>
              </div>
              <h3 className={`${isLarge ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} font-bold text-white`}>
                Automated Defect & Quality Grading
              </h3>
              <ul className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 space-y-3`}>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>Analyzes phone camera photos of raw cashews to detect spotted kernels, mold, and insect defects.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>Predicts Kernel Outturn Ratio (KOR) automatically to ensure fair farm-gate pricing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>Opportunity to collaborate with German/European AI and agri-sensor innovators.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-400 gap-1 text-left">
            <span><strong>Inclusive Design:</strong> Audio-supported, mobile-first interface empowering rural workers</span>
            <span className="text-slate-400 font-medium">
              Mayany Enterprise <span className="text-emerald-400 font-semibold">powered by CashewTrace</span>
            </span>
          </div>
        </div>
      ),
      notes: "Our AI architecture has two phases: Today in Phase 1, our live LLM assistant helps non-technical rural MSME owners generate certified bilingual packaging. In Phase 2, we are building Computer Vision models with technology partners to automatically grade cashew quality and KOR through smartphone camera photos."
    },

    // SLIDE 5: SIGNATURE PRODUCTS & TRACTION
    {
      id: 5,
      title: "Signature Products & Traction",
      headerSubtitle: "Supported by FTC / MISTI & Khmer Enterprise (KE)",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-950 text-white">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/30">
              Product Portfolio & Traction
            </span>
            <h2 className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-3xl'} font-black mt-2 text-white leading-tight`}>
              Premium Value-Added Cambodian Cashew Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 my-auto text-left">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-amber-500/40 rounded-2xl p-5 lg:p-6 text-center shadow-xl">
              <div className="flex justify-center mb-1">
                <PepperCornIcon className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className={`${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} font-bold text-white mt-2 mb-1`}>
                GI Organic Kampot Pepper
              </h3>
              <p className="text-xs text-amber-400 font-bold mb-2">Coated Roasted Cashews</p>
              <p className={`${isLarge ? 'text-xs sm:text-sm' : 'text-xs'} text-slate-300 leading-relaxed`}>
                Combining Cambodia's world-famous GI Kampot pepper with premium roasted cashews.
              </p>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-emerald-500/40 rounded-2xl p-5 lg:p-6 text-center shadow-xl">
              <div className="flex justify-center mb-1">
                <span className="text-3xl sm:text-4xl">🌾</span>
              </div>
              <h3 className={`${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} font-bold text-white mt-2 mb-1`}>
                Cashew Nibs & Biscuits
              </h3>
              <p className="text-xs text-emerald-400 font-bold mb-2">Zero-Waste Ingredients</p>
              <p className={`${isLarge ? 'text-xs sm:text-sm' : 'text-xs'} text-slate-300 leading-relaxed`}>
                Upcycling kernels into baking nibs and artisanal cashew biscuits for European markets.
              </p>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-blue-500/40 rounded-2xl p-5 lg:p-6 text-center shadow-xl">
              <div className="flex justify-center mb-1">
                <span className="text-3xl sm:text-4xl">🏛️</span>
              </div>
              <h3 className={`${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} font-bold text-white mt-2 mb-1`}>
                FTC / MISTI & Khmer Enterprise
              </h3>
              <p className="text-xs text-blue-400 font-bold mb-2">Technical Upgrading</p>
              <p className={`${isLarge ? 'text-xs sm:text-sm' : 'text-xs'} text-slate-300 leading-relaxed`}>
                Active partnership with FTC / MISTI and Khmer Enterprise for HACCP food safety standards.
              </p>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-purple-500/40 rounded-2xl p-5 lg:p-6 text-center shadow-xl">
              <div className="flex justify-center mb-1">
                <span className="text-3xl sm:text-4xl">📜</span>
              </div>
              <h3 className={`${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} font-bold text-white mt-2 mb-1`}>
                CAC & CS 001 Certified
              </h3>
              <p className="text-xs text-purple-400 font-bold mb-2">National Quality Standards</p>
              <p className={`${isLarge ? 'text-xs sm:text-sm' : 'text-xs'} text-slate-300 leading-relaxed`}>
                Strict grading compliance with Cashew Nut Association of Cambodia & Ministry standards.
              </p>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-400 gap-1 text-left">
            <div>
              <span className="font-bold text-white">Live Commercial Demo:</span>
              <span className="text-slate-300 ml-2">Smart QR digital packaging labels active & verifiable.</span>
            </div>
            <span className="text-slate-400 font-medium">
              Mayany Enterprise <span className="text-emerald-400 font-semibold">powered by CashewTrace</span>
            </span>
          </div>
        </div>
      ),
      notes: "Our commercial traction includes high-demand products like our GI Organic Kampot pepper coated cashews, zero-waste cashew nibs, and cashew powder. With technical backing from FTC / MISTI and Khmer Enterprise, we are upgrading our facility to international HACCP standards."
    },

    // SLIDE 6: MARKET & BUSINESS MODEL
    {
      id: 6,
      title: "Market & Business Model",
      headerSubtitle: "High-Margin Retail Snacks + B2B Ingredients + Traceability Licensing",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-950 text-white">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-400/30">
              Business Model & Revenue
            </span>
            <h2 className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-3xl'} font-black mt-2 text-white leading-tight`}>
              Multi-Stream Value Capture Across the Supply Chain
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 my-auto text-left">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-slate-700/80 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Stream 1</span>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mt-1 mb-2`}>
                  Premium Retail Snacks
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  Direct sale of branded GI Kampot pepper coated cashews, roasted kernels, and cashew nut butter to supermarkets and duty-free retail.
                </p>
              </div>
              <span className="mt-4 text-xs font-mono text-emerald-400 font-semibold">High Margin B2C / Retail</span>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-amber-500/40 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">Stream 2</span>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mt-1 mb-2`}>
                  B2B Circular Ingredients
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  Bulk supply of cashew nibs and protein powder to European bakeries, confectionery makers, and plant-based dairy manufacturers.
                </p>
              </div>
              <span className="mt-4 text-xs font-mono text-amber-400 font-semibold">Recurring B2B Export Contracts</span>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 border border-blue-500/40 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold uppercase">Stream 3</span>
                <h3 className={`${isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} font-bold text-white mt-1 mb-2`}>
                  Traceability Licensing
                </h3>
                <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                  Volume-based QR passport issuance and print partner referral fees for partner farmer co-ops and export aggregators.
                </p>
              </div>
              <span className="mt-4 text-xs font-mono text-blue-400 font-semibold">Scalable Software Revenue</span>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-400 gap-1 text-left">
            <div className="flex gap-4">
              <span><strong>Harvest Base:</strong> 1.1M MT</span>
              <span><strong>Target:</strong> 4,500+ MSMEs</span>
              <span className="text-emerald-400 font-bold">Export: Germany & EU</span>
            </div>
            <span className="text-slate-400 font-medium">
              Mayany Enterprise <span className="text-emerald-400 font-semibold">powered by CashewTrace</span>
            </span>
          </div>
        </div>
      ),
      notes: "Our business model aligns incentives across the value chain: We generate high margins on our own branded products, capture steady recurring revenue supplying B2B cashew nibs and powder, and scale digital traceability licensing across partner cooperatives."
    },

    // SLIDE 7: ASIA-BERLIN SYNERGY
    {
      id: 7,
      title: "AsiaBerlin Summit & EU Market",
      headerSubtitle: "Connecting Cambodian Sustainable Agriculture with Berlin & European Ecosystems",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-950 text-white">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/30">
              International Collaboration
            </span>
            <h2 className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-3xl'} font-black mt-2 text-white leading-tight`}>
              Why AsiaBerlin Summit 2026 is Our Strategic Destination
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 my-auto text-left">
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-700/80 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base sm:text-lg">
                <Globe size={22} />
                <span>Germany & EU: Leading Ethical Food Markets</span>
              </div>
              <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                Germany is Europe's largest importer of tree nuts and a global pioneer in organic, Fairtrade, and deforestation-free standards. With national food standards and export readiness in place, Mayany Enterprise is primed for German and EU market integration.
              </p>
              <ul className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-400 space-y-2 pt-2`}>
                <li className="flex items-center gap-2">• Direct distributor connections for GI Kampot pepper coated cashews.</li>
                <li className="flex items-center gap-2">• B2B supply agreements for organic cashew nibs & powder with European bakeries.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-700/80 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base sm:text-lg">
                <Cpu size={22} />
                <span>Objectives for AsiaBerlin Summit 2026</span>
              </div>
              <ul className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 space-y-3`}>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Import & Distribution Partners:</strong> Meet specialty nut importers, organic retailers, and food brokers across Germany and the EU.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Sustainable Packaging Innovation:</strong> Connect with Berlin eco-packaging startups to explore biodegradable packaging solutions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Impact & Climate Capital:</strong> Engage European impact investors supporting women-led agribusinesses and smallholder livelihoods.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-400 gap-1 text-left">
            <span><strong>Vision:</strong> Direct sustainable trade between Cambodian smallholders and European conscious consumers</span>
            <span className="text-slate-400 font-medium">
              Mayany Enterprise <span className="text-emerald-400 font-semibold">powered by CashewTrace</span>
            </span>
          </div>
        </div>
      ),
      notes: "The AsiaBerlin Summit is the ideal platform for Mayany Enterprise. Supported by Khmer Enterprise and FTC / MISTI, we aim to meet German organic food buyers, partner with eco-packaging innovators in Berlin, and connect with impact funds focused on women-led agricultural transformation."
    },

    // SLIDE 8: FOUNDER & LEADERSHIP
    {
      id: 8,
      title: "Leadership & Ecosystem",
      headerSubtitle: "30 Years of Agricultural Authority & Women-Led Innovation",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-slate-950 text-white">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/30">
              Leadership & Ecosystem
            </span>
            <h2 className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-3xl'} font-black mt-2 text-white leading-tight`}>
              Deep Agricultural Wisdom Meets Modern Enterprise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 my-auto text-left">
            {/* Founder Profile Card */}
            <div className="md:col-span-2 bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-700/80 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`${isLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-black text-white`}>Mayany SAM</h3>
                  <p className="text-xs sm:text-sm text-emerald-400 font-bold mt-0.5">Founder & CEO, Mayany Enterprise</p>
                </div>
                <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-bold rounded-full border border-emerald-500/40">
                  Female Agri-Entrepreneur
                </span>
              </div>

              <p className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-300 leading-relaxed`}>
                With over <strong>30 years of hands-on leadership</strong> in Cambodian agriculture, agro-processing, food standardization, and rural enterprise development, Mayany SAM has built trusted relationships with smallholder farming communities across Kampong Thom, Kratie, and Kampot provinces.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold">Domain Authority</span>
                  <p className="text-slate-300 mt-1">Understands exact regulatory hurdles (HACCP, CS 001, EUDR) required for international food export.</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold">Women & Youth Empowerment</span>
                  <p className="text-slate-300 mt-1">Championing female factory employment and digital agritech adoption among rural youth.</p>
                </div>
              </div>
            </div>

            {/* Strategic Partners Column */}
            <div className="space-y-3.5 flex flex-col justify-between">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-xs sm:text-sm">Strategic Allies</span>
              
              <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 p-4 rounded-2xl border border-slate-800 shadow-md">
                <p className="font-bold text-white text-sm sm:text-base">🏛️ FTC / MISTI</p>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">Food Technology Transfer & Technical Standards</p>
              </div>

              <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 p-4 rounded-2xl border border-slate-800 shadow-md">
                <p className="font-bold text-white text-sm sm:text-base">🇰🇭 Khmer Enterprise (KE)</p>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">National Business Incubation & Scale Support</p>
              </div>

              <div className="bg-gradient-to-b from-slate-900 to-slate-900/70 p-4 rounded-2xl border border-slate-800 shadow-md">
                <p className="font-bold text-white text-sm sm:text-base">🌾 Cambodian Cashew Association</p>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">Smallholder Supply & Harvest Coordination</p>
              </div>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-slate-400 gap-1 text-left">
            <span><strong>Mission:</strong> Bridging senior agro-industry wisdom with modern digital traceability and international food safety</span>
            <span className="text-slate-400 font-medium">
              Mayany Enterprise <span className="text-emerald-400 font-semibold">powered by CashewTrace</span>
            </span>
          </div>
        </div>
      ),
      notes: "Mayany Enterprise is led by Mayany SAM with 30 years of deep agricultural authority in Cambodia. Supported by Khmer Enterprise, FTC / MISTI, and the Cambodian Cashew Association, we provide European partners with complete trust, direct farmer relationships, and proven operational capability."
    },

    // SLIDE 9: ROADMAP & ASK
    {
      id: 9,
      title: "Roadmap & Delegation Goals",
      headerSubtitle: "Milestones & Target Outcomes from Berlin Delegation",
      renderSlide: () => (
        <div className="h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-400/30">
              Roadmap & Berlin Objectives
            </span>
            <h2 className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-3xl'} font-black mt-2 text-white leading-tight`}>
              Strategic Roadmap (2026 - 2027)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 my-auto text-left">
            {/* Timeline */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
              <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold uppercase">Key Milestones</span>
              <div className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} space-y-4`}>
                <div className="flex gap-3">
                  <span className="font-bold text-emerald-400 font-mono shrink-0">Q4 2026:</span>
                  <span className="text-slate-200">Participate in AsiaBerlin Summit 2026; learn from German specialty food distribution.</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-amber-400 font-mono shrink-0">Q2 2027:</span>
                  <span className="text-slate-200">Complete HACCP certification & final packaging validation with FTC / MISTI & KE support.</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-blue-400 font-mono shrink-0">Q3 2027:</span>
                  <span className="text-slate-200">Deploy GPS farm-origin traceability across 150+ smallholders during next harvest; possible dispatch first export shipment.</span>
                </div>
              </div>
            </div>

            {/* Delegation Objectives */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl">
              <span className="text-xs sm:text-sm font-mono text-amber-400 font-bold uppercase">Target Outcomes from Berlin</span>
              <ul className={`${isLarge ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'} text-slate-200 space-y-3`}>
                <li className="flex items-start gap-2.5 border-b border-slate-800 pb-2">
                  <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>1. Trade:</strong> Connect with at least 5 European specialty food distributors for possible product testing.</span>
                </li>
                <li className="flex items-start gap-2.5 border-b border-slate-800 pb-2">
                  <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>2. B2B Ingredient Contracts:</strong> Establish relationships for cashew nibs with European food manufacturers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>3. Country Representation:</strong> Showcase Cambodia's value-added agritech innovation at the Cambodia Pavilion.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-4 sm:pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm gap-3 text-left">
            <div>
              <p className="font-bold text-white text-sm sm:text-base">MAYANY Enterprise <span className="text-emerald-400 font-normal">powered by CashewTrace</span></p>
              <p className="text-slate-300 text-xs">Contact: mayany@mayanyenterprise.com • +855 88 771 2862 | mayanyenterprise.com • cashewtrace.com</p>
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-emerald-400 text-sm">
              <span>cashewtrace.com</span>
            </div>
          </div>
        </div>
      ),
      notes: "Our participation in AsiaBerlin Summit 2026 will turn our FTC and KE-backed HACCP facility and CashewTrace digital tools into concrete European trade contracts. We look forward to proudly representing Cambodia in Berlin. Thank you."
    }
  ];

  const handleCopyAllNotes = () => {
    const fullText = slides.map((s, idx) => `=== SLIDE ${idx + 1}: ${s.title.toUpperCase()} ===\nSubtitle: ${s.headerSubtitle}\n\n[Speaker Notes]\n"${s.notes}"\n\n`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleOpenPrintWindow = () => {
    openCleanPrintDeckWindow();
  };

  const handleDownloadStandaloneHtml = () => {
    downloadPitchDeckHtmlFile();
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-2 sm:p-5 select-none transition-all ${
        isFullScreen ? 'p-0 sm:p-0' : ''
      }`}
    >
      {/* Top Controls Bar (Hidden during print) */}
      <div className="w-full max-w-7xl mb-2 flex items-center justify-between text-white no-print font-sans px-2">
        <div className="flex items-center gap-3">
          <CashewTraceIcon className="h-7 w-7 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <span className="hidden sm:inline">ឯកសារបទបង្ហាញផ្លូវការ</span>
              <span>Official Pitch Deck</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                {currentSlide + 1} / {slides.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 relative">
          {/* Font Size Toggle (Beautiful.ai Readability control) */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-bold text-slate-300">
            <button
              type="button"
              onClick={() => setFontScale('normal')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                fontScale === 'normal' ? 'bg-slate-800 text-white' : 'hover:text-white'
              }`}
              title="Standard Font Size"
            >
              <ZoomOut size={13} />
              <span>Normal</span>
            </button>
            <button
              type="button"
              onClick={() => setFontScale('large')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                fontScale === 'large' ? 'bg-emerald-600 text-white' : 'hover:text-white'
              }`}
              title="Large Beautiful.ai Presentation Font"
            >
              <ZoomIn size={13} />
              <span>Large</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showNotes ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <FileText size={14} />
            <span className="hidden md:inline">{showNotes ? 'Hide Script' : 'Speaker Script'}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullScreen}
            className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Toggle Fullscreen Mode [F]"
          >
            {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden sm:inline">{isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          {/* Export PDF Primary Button (Triggers Clean Print Window) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Export or Save Deck to PDF"
            >
              <Printer size={14} />
              <span>Export PDF / Deck</span>
            </button>

            {/* Dropdown Menu for Guaranteed PDF & Offline Export */}
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-left font-sans animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">Export & Print Options</p>
                  <p className="text-[11px] text-slate-400">Guaranteed full color, no blank pages</p>
                </div>

                <div className="py-1 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handleOpenPrintWindow();
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-emerald-500/20 hover:text-emerald-300 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <Printer size={15} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold">Save as PDF (Clean Window)</p>
                      <p className="text-[10px] text-slate-400 font-normal">Opens isolated print dialog in landscape</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      handleDownloadStandaloneHtml();
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-emerald-500/20 hover:text-emerald-300 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={15} className="text-blue-400 shrink-0" />
                    <div>
                      <p className="font-bold">Download Presentation File (.HTML)</p>
                      <p className="text-[10px] text-slate-400 font-normal">Standalone offline deck, 100% full color</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleCopyAllNotes();
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-emerald-500/20 hover:text-emerald-300 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    {copiedText ? <Check size={15} className="text-emerald-400 shrink-0" /> : <Copy size={15} className="text-amber-400 shrink-0" />}
                    <div>
                      <p className="font-bold">{copiedText ? 'Copied to Clipboard!' : 'Copy Complete Deck Text'}</p>
                      <p className="text-[10px] text-slate-400 font-normal">Slides & speaker scripts for Google Docs</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage (16:9 Aspect Ratio / Full-Screen Responsive) */}
      <div className={`w-full max-w-7xl aspect-[16/9] print:hidden ${isFullScreen ? 'max-h-[88vh]' : 'max-h-[76vh]'} rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative bg-slate-950 flex flex-col transition-all duration-300`}>
        {slides[currentSlide].renderSlide()}
      </div>

      {/* Bottom Navigation Strip (Beautiful.ai slide hopper) */}
      <div className="w-full max-w-7xl mt-2 flex flex-col sm:flex-row items-center justify-between gap-2 no-print print:hidden font-sans px-2">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {/* Slide Number Thumbnails */}
          <div className="flex items-center gap-1.5 px-2 bg-slate-900/90 border border-slate-800 py-1 rounded-xl">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentSlide === idx 
                    ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`Slide ${idx + 1}: ${s.title}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentSlide === slides.length - 1}
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Status Hint */}
        <span className="text-xs text-slate-400 font-sans hidden sm:inline">
          Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-300">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-300">→</kbd> to advance • <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-300">F</kbd> for Fullscreen
        </span>
      </div>

      {/* Speaker Script / Video Notes Box */}
      {showNotes && (
        <div className="w-full max-w-7xl mt-2 p-4 bg-slate-900/95 border border-amber-500/40 rounded-2xl text-left no-print animate-in fade-in slide-in-from-bottom-2 font-sans shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Play size={14} className="fill-amber-400" />
              <span>Speaker Script for Slide {currentSlide + 1} ({slides[currentSlide].title})</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Estimated Read Time: ~35-45s</span>
          </div>
          <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed italic bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            "{slides[currentSlide].notes}"
          </p>
        </div>
      )}

      {/* Hidden Multi-Slide Container specifically for 9-Slide PDF Printing */}
      <div id="printable-pitch-deck-container" className="hidden print:block w-full">
        {slides.map((s) => (
          <div key={`print-slide-${s.id}`} className="pitch-deck-slide-print">
            <div className="w-full h-full rounded-none overflow-hidden bg-slate-950 flex flex-col justify-between border-0">
              {s.renderSlide()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
