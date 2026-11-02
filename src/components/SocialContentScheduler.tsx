import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { 
  Calendar, Copy, Check, Download, Share2, Sparkles, Filter, 
  Search, FileText, Image as ImageIcon, Edit3, Eye, Layers, 
  ChevronRight, ExternalLink, Heart, MessageSquare, RefreshCw, CheckCircle2,
  Sliders, Grid, Frame, CupSoda, Milk, Utensils
} from 'lucide-react';
import { CASHEW_TRACE_30_DAYS_QUOTES, SocialPostQuote } from '../data/socialQuotesData';
import { MAYANY_ENTERPRISE_30_DAYS_QUOTES } from '../data/mayanySocialQuotesData';
import CashewTraceLogo from './CashewTraceLogo';
import MayanyLogo from './MayanyLogo';

const farmGoldenImg = new URL('../assets/images/cashew_farm_golden_hour_1785138906165.jpg', import.meta.url).href;
const harvestTrayImg = new URL('../assets/images/cashew_harvest_tray_1785138921355.jpg', import.meta.url).href;
const productCollageImg = new URL('../assets/images/mayany_ke_application_product_collage_1785131513154.jpg', import.meta.url).href;
const houseMockupImg = new URL('../assets/images/mayany_cashew_house_mockup_1785128863626.jpg', import.meta.url).href;
const barKioskImg = new URL('../assets/images/mayany_cashew_bar_kiosk_franchise_1785129551670.jpg', import.meta.url).href;
const mayanyOfficialLogoImg = new URL('../assets/images/mayany_official_logo_1785158778520.jpg', import.meta.url).href;

// 30 Unique High-Res Photo Presets
const DEFAULT_PHOTO_PRESETS: string[] = [
  farmGoldenImg, // Day 1
  harvestTrayImg, // Day 2
  productCollageImg, // Day 3
  "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80", // Day 4
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", // Day 5
  houseMockupImg, // Day 6
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80", // Day 7
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80", // Day 8
  "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80", // Day 9
  "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80", // Day 10
  barKioskImg, // Day 11
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80", // Day 12
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80", // Day 13
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80", // Day 14
  "https://images.unsplash.com/photo-1592417817098-8f3d6eb19757?auto=format&fit=crop&w=1200&q=80", // Day 15
  "https://images.unsplash.com/photo-1509358211425-24d0423176c2?auto=format&fit=crop&w=1200&q=80", // Day 16
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80", // Day 17
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80", // Day 18
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80", // Day 19
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80", // Day 20
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80", // Day 21
  "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80", // Day 22
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // Day 23
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80", // Day 24
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80", // Day 25
  "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=1200&q=80", // Day 26
  "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80", // Day 27
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80", // Day 28
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", // Day 29
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"  // Day 30
];

export default function SocialContentScheduler() {
  const [selectedBrand, setSelectedBrand] = useState<'mayany' | 'cashewtrace'>('mayany');
  
  const [posts, setPosts] = useState<SocialPostQuote[]>(() => {
    const defaultList = selectedBrand === 'mayany' ? MAYANY_ENTERPRISE_30_DAYS_QUOTES : CASHEW_TRACE_30_DAYS_QUOTES;
    return defaultList.map((post, idx) => ({
      ...post,
      photoUrl: post.photoUrl || DEFAULT_PHOTO_PRESETS[idx % DEFAULT_PHOTO_PRESETS.length]
    }));
  });

  const [selectedPost, setSelectedPost] = useState<SocialPostQuote>(posts[0]);
  const [activeWeek, setActiveWeek] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<SocialPostQuote | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<{ url: string; title: string } | null>(null);

  const posterCardRef = useRef<HTMLDivElement>(null);

  // Switch brand suite
  const handleSwitchBrand = (brand: 'mayany' | 'cashewtrace') => {
    setSelectedBrand(brand);
    setSelectedCategory('all');
    setActiveWeek('all');
    const newList = brand === 'mayany' ? MAYANY_ENTERPRISE_30_DAYS_QUOTES : CASHEW_TRACE_30_DAYS_QUOTES;
    const formatted = newList.map((post, idx) => ({
      ...post,
      photoUrl: post.photoUrl || DEFAULT_PHOTO_PRESETS[idx % DEFAULT_PHOTO_PRESETS.length]
    }));
    setPosts(formatted);
    setSelectedPost(formatted[0]);
  };

  // Filter categories per brand
  const categoriesList = selectedBrand === 'mayany'
    ? ['all', 'Cashew Powder', 'Fruit Blends', 'Ready-Mix', 'Zero-Waste']
    : ['all', 'Resilience', 'Soil & Care', 'Community', 'Harvest & Gratitude', 'Quality & Origin', 'Sustainable Future'];

  // Filter posts logic
  const filteredPosts = posts.filter(post => {
    if (activeWeek !== 'all') {
      const weekNum = Math.ceil(post.dayNumber / 7);
      if (weekNum !== activeWeek) return false;
    }
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuote = post.mainQuote.toLowerCase().includes(q);
      const matchDay = post.dayOfWeek.toLowerCase().includes(q);
      const matchCaption = post.fbCaption.toLowerCase().includes(q);
      if (!matchQuote && !matchDay && !matchCaption) return false;
    }
    return true;
  });

  const handleCopyCaption = (post: SocialPostQuote, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(post.fbCaption);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadPoster = async (post: SocialPostQuote) => {
    setSelectedPost(post);
    setIsDownloading(true);

    try {
      const dataUrl = await generatePosterPNG(post, selectedBrand);
      const brandPrefix = selectedBrand === 'mayany' ? 'MAYANY_Enterprise' : 'CashewTrace';
      const fileName = `${brandPrefix}_Post_Day_${post.dayNumber}_${post.dayOfWeek.replace(/\s+/g, '_')}.png`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setPreviewModalImage({
        url: dataUrl,
        title: `${selectedBrand === 'mayany' ? 'MAYANY Enterprise' : 'CashewTrace'} Day ${post.dayNumber} - ${post.dayOfWeek}`
      });
    } catch (err) {
      console.error('Canvas poster generation error:', err);
      if (posterCardRef.current) {
        try {
          const canvas = await html2canvas(posterCardRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: null
          });
          const image = canvas.toDataURL('image/png', 1.0);
          setPreviewModalImage({
            url: image,
            title: `Day ${post.dayNumber} - ${post.dayOfWeek}`
          });
        } catch (e2) {
          alert('Could not generate PNG automatically. Please screenshot the preview card!');
        }
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBulkExportCsv = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    let csvContent = "Day,Date,Day_Title,Category,Main_Quote,Facebook_Caption\n";
    posts.forEach(p => {
      const escapedQuote = `"${p.mainQuote.replace(/"/g, '""')}"`;
      const escapedCaption = `"${p.fbCaption.replace(/"/g, '""')}"`;
      csvContent += `${p.dayNumber},"${p.dateFormatted}","${p.dayOfWeek}","${p.category}",${escapedQuote},${escapedCaption}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const brandPrefix = selectedBrand === 'mayany' ? 'MAYANY_Enterprise' : 'CashewTrace';
    link.setAttribute("href", url);
    link.setAttribute("download", `${brandPrefix}_30_Day_Facebook_Meta_Business_Schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkExportTxt = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const brandTitle = selectedBrand === 'mayany' ? 'MAYANY ENTERPRISE' : 'CASHEWTRACE';
    let txtContent = "====================================================\n";
    txtContent += `${brandTitle} 30-DAY FACEBOOK POST SCHEDULE & CAPTIONS\n`;
    txtContent += "====================================================\n\n";
    posts.forEach(p => {
      txtContent += `----------------------------------------------------\n`;
      txtContent += `DAY ${p.dayNumber} | ${p.dayOfWeek} (${p.dateFormatted})\n`;
      txtContent += `Category: ${p.category}\n`;
      txtContent += `----------------------------------------------------\n`;
      txtContent += `${p.fbCaption}\n\n\n`;
    });
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const brandPrefix = selectedBrand === 'mayany' ? 'MAYANY_Enterprise' : 'CashewTrace';
    link.href = url;
    link.download = `${brandPrefix}_30_Days_Facebook_Captions_Full.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = () => {
    if (editingPost) {
      setPosts(prev => prev.map(p => p.id === editingPost.id ? editingPost : p));
      if (selectedPost.id === editingPost.id) {
        setSelectedPost(editingPost);
      }
      setShowEditModal(false);
      setEditingPost(null);
    }
  };

  const getPosterBgStyle = (post: SocialPostQuote) => {
    const photo = post.photoUrl || DEFAULT_PHOTO_PRESETS[(post.dayNumber - 1) % DEFAULT_PHOTO_PRESETS.length];
    return {
      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.05) 35%, rgba(0, 0, 0, 0.15) 70%, rgba(0, 0, 0, 0.60) 100%), url(${photo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6 pb-20">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-mono font-bold">
              <Sparkles size={14} />
              <span>SOCIAL MEDIA POSTER & CAPTION GENERATOR</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans">
              30-Day Content Suite & <span className="text-amber-400">Photo Poster Studio</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Generate ready-to-publish social media posters and verified captions for <strong className="text-emerald-300">MAYANY Enterprise</strong> (Cashew Powder, Fruit Blends & Ready Mix) and <strong className="text-amber-300">CashewTrace</strong> (Farm Traceability & Smallholder Quotes).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleBulkExportCsv}
              className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer grow lg:grow-0"
            >
              <Download size={16} />
              <span>Export Schedule (.CSV)</span>
            </button>
            <button
              onClick={handleBulkExportTxt}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer grow lg:grow-0"
            >
              <FileText size={16} />
              <span>30 Captions (.TXT)</span>
            </button>
          </div>
        </div>

        {/* BRAND SWITCHER TABS */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-bold uppercase">
            <Layers size={16} className="text-amber-400" />
            <span>Select Brand Suite:</span>
          </div>

          <div className="grid grid-cols-2 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleSwitchBrand('mayany')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                selectedBrand === 'mayany'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <CupSoda size={16} className={selectedBrand === 'mayany' ? 'text-emerald-200' : ''} />
              <span>MAYANY Enterprise</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-950/80 text-emerald-300 rounded-full font-mono border border-emerald-500/30">
                Powder & Fruit Blends
              </span>
            </button>

            <button
              onClick={() => handleSwitchBrand('cashewtrace')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                selectedBrand === 'cashewtrace'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg border border-amber-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Milk size={16} className={selectedBrand === 'cashewtrace' ? 'text-amber-200' : ''} />
              <span>CashewTrace</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-950/80 text-amber-300 rounded-full font-mono border border-amber-500/30">
                Farm to Market
              </span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/20">
            <div className="text-2xl font-black text-emerald-400">
              {selectedBrand === 'mayany' ? 'Cashew Powder' : 'Farm Trace'}
            </div>
            <div className="text-xs text-slate-400 font-mono">30-Day Product Focus</div>
          </div>
          <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/20">
            <div className="text-2xl font-black text-amber-400">1-Click</div>
            <div className="text-xs text-slate-400 font-mono">1080x1350 PNG Export</div>
          </div>
          <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/20">
            <div className="text-2xl font-black text-emerald-400">
              {selectedBrand === 'mayany' ? 'MAYANY Logo' : 'CashewTrace Logo'}
            </div>
            <div className="text-xs text-slate-400 font-mono">Official Vector Stamp</div>
          </div>
          <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/20">
            <div className="text-2xl font-black text-amber-400">Khmer Dict</div>
            <div className="text-xs text-slate-400 font-mono">Verified Khmer Text</div>
          </div>
        </div>
      </div>

      {/* Main Layout: Left = Active Poster Studio, Right = 30-Day Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Featured Selected Poster Studio & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase">
                <Eye size={16} />
                <span>Selected Photo Poster (Day {selectedPost.dayNumber})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingPost({ ...selectedPost });
                    setShowEditModal(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-slate-700"
                >
                  <Edit3 size={14} />
                  <span>Customize Photo & Text</span>
                </button>
              </div>
            </div>

            {/* Poster Card Container for Capture */}
            <div 
              ref={posterCardRef}
              className={`w-full aspect-[3/4] rounded-2xl overflow-hidden p-5 md:p-7 flex flex-col justify-between text-white shadow-2xl relative border-4 ${
                selectedBrand === 'mayany' ? 'border-emerald-500/60' : 'border-amber-500/60'
              }`}
              style={getPosterBgStyle(selectedPost)}
            >
              {/* TOP BRAND HEADER WITH LOGO */}
              <div className="text-center space-y-2 relative z-10">
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-400/60 shadow-lg inline-block mx-auto max-w-full">
                  {selectedBrand === 'mayany' ? (
                    <MayanyLogo className="mx-auto" />
                  ) : (
                    <CashewTraceLogo className="h-8 md:h-10 mx-auto" />
                  )}
                </div>

                {/* Day Header Title Box */}
                <div className="pt-2">
                  <h2 className="text-2xl md:text-3xl font-black text-amber-300 tracking-tight uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-sans">
                    {selectedBrand === 'mayany' ? 'MAYANY ENTERPRISE' : 'CASHEW TRACE'} {selectedPost.dayOfWeek.toUpperCase()}
                  </h2>
                  <div className="inline-flex items-center gap-2 mt-2 px-5 py-1.5 md:py-2 bg-amber-100 border-2 border-amber-500 rounded-full text-xs md:text-sm font-mono font-black text-amber-950 shadow-lg">
                    <span className="text-sm md:text-base">{selectedBrand === 'mayany' ? '🥛' : '🍃'}</span>
                    <span>— {selectedPost.dateFormatted.toUpperCase()} —</span>
                  </div>
                </div>
              </div>

              {/* CENTRAL MAIN QUOTE - FLOATING & READABLE */}
              <div className="my-auto bg-slate-950/60 backdrop-blur-sm p-5 md:p-7 rounded-3xl border border-amber-400/40 text-center space-y-3.5 shadow-2xl relative">
                <div className="w-8 h-8 mx-auto rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs border border-amber-400/40 shadow-sm">
                  {selectedBrand === 'mayany' ? '🌱' : '🌾'}
                </div>
                
                <p className="text-base md:text-xl font-serif italic text-amber-50 font-semibold leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  "{selectedPost.mainQuote}"
                </p>

                {selectedPost.khmerQuote && (
                  <div className="pt-2.5 border-t border-amber-400/30">
                    <p className="text-xs md:text-sm font-semibold text-amber-200 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] font-sans">
                      {selectedPost.khmerQuote}
                    </p>
                  </div>
                )}

                <div className="text-[11px] font-mono text-amber-300 font-bold tracking-wider pt-0.5">
                  {selectedBrand === 'mayany'
                    ? '— MAYANY Enterprise • Plant Power & Fruit Blends'
                    : '— CashewTrace Cambodian Farm Reflections'}
                </div>
              </div>

              {/* BOTTOM TAGLINE & 3 PILLARS */}
              <div className="text-center space-y-3 relative z-10 pt-1">
                <p className="text-xs md:text-sm font-bold text-amber-100 italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] bg-slate-950/70 backdrop-blur-sm px-4 py-1.5 rounded-xl inline-block border border-amber-400/30">
                  "{selectedPost.subTagline}"
                </p>

                {/* 3 Pillar Badges */}
                <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto pt-1">
                  {selectedPost.pillars.map((pillar, idx) => (
                    <div key={idx} className="px-2 py-1.5 bg-slate-950/90 backdrop-blur-md border border-amber-400/50 rounded-xl text-[10px] md:text-[11px] font-bold text-amber-200 truncate shadow-lg text-center">
                      ✓ {pillar}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Poster Actions Bar */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleDownloadPoster(selectedPost)}
                disabled={isDownloading}
                className={`w-full py-3.5 font-black text-xs rounded-xl shadow-xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer ${
                  selectedBrand === 'mayany'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                <Download size={16} />
                <span>{isDownloading ? 'Generating High-Res PNG...' : 'Download Poster Photo (PNG)'}</span>
              </button>

              <button
                onClick={() => handleCopyCaption(selectedPost)}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  copiedId === selectedPost.id 
                    ? 'bg-emerald-600 text-white border-emerald-500' 
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                }`}
              >
                {copiedId === selectedPost.id ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedId === selectedPost.id ? 'Copied Facebook Caption!' : 'Copy Facebook Caption'}</span>
              </button>
            </div>

            {/* Facebook Caption Box Preview */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Facebook Caption Text</span>
                <span className="text-amber-400 font-bold">Ready to Paste</span>
              </div>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto p-2 bg-slate-900 rounded-xl border border-slate-800">
                {selectedPost.fbCaption}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 30-Day Grid with Photo Thumbnails & Filtering (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Controls Bar: Search, Category, Week Tabs */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search quotes, days, or keywords (e.g. powder, mango, smoothie)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Week Selector Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400">Filter Week:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveWeek('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                    activeWeek === 'all' 
                      ? 'bg-amber-500 text-slate-950' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All (30 Days)
                </button>
                {[1, 2, 3, 4].map(wk => (
                  <button
                    key={wk}
                    onClick={() => setActiveWeek(wk)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                      activeWeek === wk 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Week {wk} (Days {(wk - 1) * 7 + 1}-{Math.min(wk * 7, 30)})
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold' 
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid with Unique Photo Thumbnails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => {
              const isSelected = selectedPost.id === post.id;
              const photo = post.photoUrl || DEFAULT_PHOTO_PRESETS[(post.dayNumber - 1) % DEFAULT_PHOTO_PRESETS.length];
              return (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedPost(post)}
                  className={`rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-2xl' 
                      : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Photo Preview Thumbnail Header */}
                  <div className="h-32 w-full relative overflow-hidden bg-slate-950">
                    <img 
                      src={photo} 
                      alt={`Day ${post.dayNumber} Photo`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Top Day Badge & Category */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg border border-amber-500/30">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                          {post.dayNumber}
                        </span>
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide">
                          {post.dayOfWeek}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-amber-200 border border-slate-800 rounded text-[9px] font-mono">
                        {post.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-3 right-3 text-[10px] font-mono text-slate-300 truncate font-semibold">
                      {post.dateFormatted}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-200 font-serif italic line-clamp-3 leading-relaxed">
                      "{post.mainQuote}"
                    </p>

                    {post.khmerQuote && (
                      <p className="text-[11px] text-amber-200/90 font-sans line-clamp-2 leading-relaxed border-t border-slate-800/80 pt-1.5">
                        {post.khmerQuote}
                      </p>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                        ✓ {post.pillars[0]}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleCopyCaption(post, e)}
                          title="Copy Facebook Caption"
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            copiedId === post.id 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                          }`}
                        >
                          {copiedId === post.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPoster(post);
                          }}
                          title="Download Poster PNG"
                          className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CUSTOMIZE MODAL */}
      <AnimatePresence>
        {showEditModal && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-amber-400 font-sans flex items-center gap-2">
                  <Edit3 size={18} />
                  <span>Customize Poster — Day {editingPost.dayNumber} ({editingPost.dayOfWeek})</span>
                </h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">Background Photo URL:</label>
                  <input 
                    type="text" 
                    value={editingPost.photoUrl || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, photoUrl: e.target.value })}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Paste any high-resolution image URL or unsplash photo link.</p>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Day Title / Day of Week:</label>
                  <input 
                    type="text" 
                    value={editingPost.dayOfWeek}
                    onChange={(e) => setEditingPost({ ...editingPost, dayOfWeek: e.target.value })}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-bold text-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Main English Quote:</label>
                  <textarea 
                    rows={3}
                    value={editingPost.mainQuote}
                    onChange={(e) => setEditingPost({ ...editingPost, mainQuote: e.target.value })}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Khmer Translation Quote:</label>
                  <textarea 
                    rows={2}
                    value={editingPost.khmerQuote || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, khmerQuote: e.target.value })}
                    className="w-full bg-slate-950 text-amber-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Sub-tagline:</label>
                  <input 
                    type="text" 
                    value={editingPost.subTagline}
                    onChange={(e) => setEditingPost({ ...editingPost, subTagline: e.target.value })}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Facebook Caption:</label>
                  <textarea 
                    rows={4}
                    value={editingPost.fbCaption}
                    onChange={(e) => setEditingPost({ ...editingPost, fbCaption: e.target.value })}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN PREVIEW & DOWNLOAD MODAL */}
      <AnimatePresence>
        {previewModalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white text-center"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-sans">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span>Poster Photo Ready!</span>
                </div>
                <button 
                  onClick={() => setPreviewModalImage(null)}
                  className="text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-amber-500/30 max-h-[55vh] flex items-center justify-center bg-slate-950">
                <img 
                  src={previewModalImage.url} 
                  alt={previewModalImage.title}
                  className="max-h-[50vh] w-auto object-contain rounded-xl shadow-lg"
                />
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={previewModalImage.url}
                  download={`${previewModalImage.title.replace(/\s+/g, '_')}.png`}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <Download size={16} />
                  <span>Download Poster Photo (PNG)</span>
                </a>

                <p className="text-[11px] text-slate-400 font-mono">
                  💡 Tip: You can also right-click or long-press the photo above to select "Save Image As...".
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Canvas 2D High-Res Poster Generator (1080x1350 Facebook 4:5 Format)
async function generatePosterPNG(post: SocialPostQuote, brand: 'mayany' | 'cashewtrace'): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  // Background photo
  const photoUrl = post.photoUrl || DEFAULT_PHOTO_PRESETS[(post.dayNumber - 1) % DEFAULT_PHOTO_PRESETS.length];
  
  try {
    const img = new Image();
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => resolve(), 2500);
      img.onload = () => { clearTimeout(timer); resolve(); };
      img.onerror = () => { clearTimeout(timer); resolve(); };
      img.src = photoUrl;
      if (img.complete) { clearTimeout(timer); resolve(); }
    });

    if (img.complete && img.naturalWidth > 0) {
      const scale = Math.max(1080 / img.naturalWidth, 1350 / img.naturalHeight);
      const x = (1080 - img.naturalWidth * scale) / 2;
      const y = (1350 - img.naturalHeight * scale) / 2;
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    } else {
      drawFallbackBg(ctx, brand);
    }
  } catch (e) {
    drawFallbackBg(ctx, brand);
  }

  // Dark Overlay Gradient (Subtle vignette, keeping picture bright!)
  const grad = ctx.createLinearGradient(0, 0, 0, 1350);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.08)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.22)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.68)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1350);

  // Outer Border Accent
  ctx.strokeStyle = brand === 'mayany' ? 'rgba(34, 197, 94, 0.65)' : 'rgba(245, 158, 11, 0.65)';
  ctx.lineWidth = 12;
  ctx.strokeRect(18, 18, 1044, 1314);

  // Load and Render Brand Vector Logo onto Canvas
  const cashewTraceLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 100" width="350" height="100">
    <circle cx="50" cy="46" r="32" stroke="#1e293b" stroke-width="6" fill="white" />
    <path d="M 72 68 L 94 90" stroke="#1e293b" stroke-width="10" stroke-linecap="round" />
    <path d="M 32 46 C 30 32, 42 24, 56 26 C 68 28, 72 38, 68 48 C 64 58, 52 64, 42 62 C 32 60, 34 54, 32 46 Z" fill="url(#cashewGrad)" />
    <ellipse cx="44" cy="34" rx="3" ry="5" transform="rotate(-20 44 34)" fill="white" opacity="0.8" />
    <circle cx="54" cy="32" r="2" fill="white" opacity="0.8" />
    <circle cx="36" cy="42" r="1.5" fill="white" opacity="0.8" />
    <defs>
      <linearGradient id="cashewGrad" x1="32" y1="26" x2="68" y2="62" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#f97316" />
        <stop offset="100%" stop-color="#ea580c" />
      </linearGradient>
    </defs>
    <text x="110" y="54" fill="#15803d" font-size="36" font-family="sans-serif" font-weight="800" letter-spacing="-1px">CashewTrace</text>
    <text x="134" y="78" fill="#ea580c" font-size="16" font-family="sans-serif" font-weight="bold" font-style="italic">From Farm to Market</text>
  </svg>`;

  const mayanyLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 110" width="500" height="110">
    <rect x="2" y="2" width="496" height="106" rx="20" fill="#fffbeb" stroke="#f59e0b" stroke-width="2.5" />
    <g transform="translate(12, 10)">
      <circle cx="45" cy="45" r="42" fill="url(#goldGradBg)" stroke="#b45309" stroke-width="3" />
      <circle cx="45" cy="45" r="37" fill="none" stroke="#fef3c7" stroke-width="1.5" stroke-dasharray="3 2" />
      <path d="M 22 40 C 22 30, 32 25, 42 27 C 52 29, 60 38, 56 46 C 52 54, 40 58, 30 55 C 22 52, 28 42, 38 42 C 48 42, 54 48, 65 44" stroke="#78350f" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <rect x="18" y="58" width="54" height="15" rx="4" fill="#78350f" stroke="#fef3c7" stroke-width="1" />
      <text x="45" y="69" fill="#fef3c7" font-size="9" font-family="Georgia, serif" font-weight="900" text-anchor="middle" letter-spacing="0.8px">ENTERPRISE</text>
      <path d="M 45 6 C 52 12, 56 18, 45 22 C 34 18, 38 12, 45 6 Z" fill="#b45309" />
      <path d="M 45 84 C 52 78, 56 72, 45 68 C 34 72, 38 78, 45 84 Z" fill="#b45309" />
    </g>
    <text x="115" y="48" fill="#78350f" font-size="34" font-family="Georgia, serif" font-weight="900" letter-spacing="0.5px">MAYANY</text>
    <text x="272" y="48" fill="#b45309" font-size="24" font-family="Georgia, serif" font-weight="800" letter-spacing="2px">ENTERPRISE</text>
    <line x1="115" y1="58" x2="480" y2="58" stroke="#d97706" stroke-width="2" stroke-linecap="round" />
    <circle cx="115" cy="58" r="3" fill="#b45309" />
    <circle cx="480" cy="58" r="3" fill="#b45309" />
    <text x="115" y="82" fill="#15803d" font-size="15" font-family="sans-serif" font-weight="800">Cashew Powder • Ready Mix • Fruit Blends</text>
    <defs>
      <linearGradient id="goldGradBg" x1="0" y1="0" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#fef3c7" />
        <stop offset="50%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#b45309" />
      </linearGradient>
    </defs>
  </svg>`;

  if (brand === 'mayany') {
    let drawnImage = false;
    try {
      const mayanyImg = new Image();
      await new Promise<void>((resolve) => {
        const timer = setTimeout(() => resolve(), 2500);
        mayanyImg.onload = () => { clearTimeout(timer); resolve(); };
        mayanyImg.onerror = () => { clearTimeout(timer); resolve(); };
        mayanyImg.src = mayanyOfficialLogoImg;
        if (mayanyImg.complete) {
          clearTimeout(timer);
          resolve();
        }
      });

      if (mayanyImg.complete && mayanyImg.naturalWidth > 0) {
        const targetW = 460;
        const imgRatio = mayanyImg.naturalWidth / mayanyImg.naturalHeight;
        const targetH = targetW / imgRatio;
        const drawX = (1080 - targetW) / 2;
        const drawY = 24;

        // Clean white card backdrop for contrast
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
        ctx.shadowBlur = 10;
        drawRoundRect(ctx, drawX - 16, drawY - 8, targetW + 32, targetH + 16, 18, true, false);
        ctx.restore();

        // Draw exact user logo image directly
        ctx.drawImage(mayanyImg, drawX, drawY, targetW, targetH);
        drawnImage = true;
      }
    } catch (err) {
      console.warn('Mayany logo image load error:', err);
    }

    // Fallback vector logo if image failed to load
    if (!drawnImage) {
      try {
        const svgImg = new Image();
        await new Promise<void>((resolve) => {
          const timer = setTimeout(() => resolve(), 1500);
          svgImg.onload = () => { clearTimeout(timer); resolve(); };
          svgImg.onerror = () => { clearTimeout(timer); resolve(); };
          svgImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(mayanyLogoSvg);
          if (svgImg.complete) { clearTimeout(timer); resolve(); }
        });
        if (svgImg.complete && svgImg.naturalWidth > 0) {
          ctx.drawImage(svgImg, (1080 - 460) / 2, 24, 460, 120);
        }
      } catch (e) {
        console.error('Vector fallback error:', e);
      }
    }
  } else {
    try {
      const logoImg = new Image();
      await new Promise<void>((resolve) => {
        const timer = setTimeout(() => resolve(), 2500);
        logoImg.onload = () => { clearTimeout(timer); resolve(); };
        logoImg.onerror = () => { clearTimeout(timer); resolve(); };
        logoImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cashewTraceLogoSvg);
        if (logoImg.complete) {
          clearTimeout(timer);
          resolve();
        }
      });

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 3;
        const badgeW = 420;
        const badgeX = (1080 - badgeW) / 2;
        drawRoundRect(ctx, badgeX, 42, badgeW, 105, 22, true, true);
        ctx.drawImage(logoImg, badgeX + 10, 47, badgeW - 20, 95);
      }
    } catch (err) {
      console.error('CashewTrace logo render error:', err);
    }
  }

  // Day Title Header
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#fde68a';
  ctx.font = '900 40px sans-serif';
  const brandTitle = brand === 'mayany' ? 'MAYANY ENTERPRISE' : 'CASHEW TRACE';
  ctx.fillText(`${brandTitle} ${post.dayOfWeek.toUpperCase()}`, 540, 185);

  // Date Tag Ribbon Pill
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(254, 243, 199, 0.98)';
  ctx.strokeStyle = brand === 'mayany' ? '#16a34a' : '#f59e0b';
  ctx.lineWidth = 3;
  drawRoundRect(ctx, 330, 215, 420, 48, 24, true, true);

  ctx.fillStyle = brand === 'mayany' ? '#14532d' : '#78350f';
  ctx.font = 'bold 22px monospace';
  const iconEmoji = brand === 'mayany' ? '🥛' : '🍃';
  ctx.fillText(`${iconEmoji} — ${post.dateFormatted.toUpperCase()} —`, 540, 239);

  // Central Main Quote Box - Floating Glass Backdrop
  const qBoxW = 960;
  const qBoxH = 580;
  const qBoxX = (1080 - qBoxW) / 2;
  const qBoxY = 285;

  ctx.fillStyle = brand === 'mayany' ? 'rgba(6, 78, 59, 0.46)' : 'rgba(69, 26, 3, 0.46)';
  ctx.strokeStyle = brand === 'mayany' ? 'rgba(74, 222, 128, 0.6)' : 'rgba(251, 191, 36, 0.6)';
  ctx.lineWidth = 3;
  drawRoundRect(ctx, qBoxX, qBoxY, qBoxW, qBoxH, 28, true, true);

  // Sprout / Cup Icon
  ctx.fillStyle = '#fde68a';
  ctx.font = '36px sans-serif';
  ctx.fillText(brand === 'mayany' ? '🥛' : '🌱', 540, qBoxY + 52);

  // Main English Quote
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 600 38px Georgia, serif';
  const lines = wrapText(ctx, `"${post.mainQuote}"`, qBoxW - 80);
  let curY = qBoxY + 120;
  lines.forEach(line => {
    ctx.fillText(line, 540, curY);
    curY += 50;
  });

  // Khmer Translation
  if (post.khmerQuote) {
    curY += 15;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(390, curY);
    ctx.lineTo(690, curY);
    ctx.stroke();

    curY += 40;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#fde68a';
    ctx.font = '600 28px "Khmer OS Battambang", sans-serif';
    const khmerLines = wrapText(ctx, post.khmerQuote, qBoxW - 100);
    khmerLines.forEach(kLine => {
      ctx.fillText(kLine, 540, curY);
      curY += 42;
    });
  }

  // Attribution
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px monospace';
  const attributionText = brand === 'mayany'
    ? '— MAYANY Enterprise • Plant Power & Fruit Blends'
    : '— CashewTrace Cambodian Farm Reflections';
  ctx.fillText(attributionText, 540, qBoxY + qBoxH - 35);

  // Sub-tagline Banner
  const botY = 900;
  ctx.fillStyle = brand === 'mayany' ? 'rgba(6, 78, 59, 0.70)' : 'rgba(69, 26, 3, 0.70)';
  ctx.strokeStyle = brand === 'mayany' ? 'rgba(74, 222, 128, 0.5)' : 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, 140, botY + 10, 800, 48, 16, true, true);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic bold 22px Georgia, serif';
  ctx.fillText(`"${post.subTagline}"`, 540, botY + 34);

  // 3 Pillar Pills
  ctx.shadowBlur = 0;
  const pWidth = 280;
  const pGap = 20;
  const totalW = pWidth * 3 + pGap * 2;
  const pStartX = (1080 - totalW) / 2;
  const pY = botY + 75;

  post.pillars.forEach((pillar, i) => {
    const px = pStartX + i * (pWidth + pGap);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.92)';
    ctx.strokeStyle = brand === 'mayany' ? 'rgba(74, 222, 128, 0.6)' : 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 2;
    drawRoundRect(ctx, px, pY, pWidth, 48, 14, true, true);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText(`✓ ${pillar}`, px + pWidth / 2, pY + 24);
  });

  // Footer Tagline
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px monospace';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 6;
  const footerText = brand === 'mayany'
    ? 'WWW.MAYANYENTERPRISE.COM • PHNOM PENH & KAMPONG THOM'
    : 'WWW.CASHEWTRACE.COM • MAYANY AGRI-TECH';
  ctx.fillText(footerText, 540, 1265);

  return canvas.toDataURL('image/png', 1.0);
}

function drawFallbackBg(ctx: CanvasRenderingContext2D, brand: 'mayany' | 'cashewtrace') {
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
  if (brand === 'mayany') {
    bgGrad.addColorStop(0, '#064e3b');
    bgGrad.addColorStop(0.5, '#047857');
    bgGrad.addColorStop(1, '#022c22');
  } else {
    bgGrad.addColorStop(0, '#b8520e');
    bgGrad.addColorStop(0.5, '#d97706');
    bgGrad.addColorStop(1, '#78350f');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1350);
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: boolean, stroke: boolean) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
