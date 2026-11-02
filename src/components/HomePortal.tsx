import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, ArrowRight, ChevronDown, 
  Building, Leaf, Navigation2, Tag, 
  Phone, Mail, MapPin, User, Send, CheckCircle2,
  Lock, Globe, HelpCircle, Facebook, MessageCircle,
  Sparkles, Check, Presentation, ExternalLink
} from 'lucide-react';
import { CleanSheetData } from '../types';
import CashewTraceLogo from './CashewTraceLogo';
import { recordWebsiteView, recordSectorClick } from '../lib/firebaseService';
import VisualPictorialGuide from './VisualPictorialGuide';
import { useLanguage } from '../lib/LanguageContext';

interface HomePortalProps {
  data: CleanSheetData;
  onNavigate: (tab: 'passport' | 'map' | 'inventory' | 'mango' | 'admin' | 'mayany' | 'social' | 'farmer' | 'packaging' | 'dailypa' | 'store') => void;
  onSelectBatch?: (batchId: string) => void;
  onOpenPitchDeck?: () => void;
  onOpenOnboarding?: (sector?: 'farmer' | 'mayany' | 'mango' | 'map' | 'packaging') => void;
  isOwnerLoggedIn?: boolean;
}

export default function HomePortal({ onNavigate, onOpenPitchDeck, onOpenOnboarding, isOwnerLoggedIn = false }: HomePortalProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isKhmer, t } = useLanguage();

  // Record website view on initial mount
  useEffect(() => {
    recordWebsiteView('home_portal');
  }, []);

  const handleSectorClick = (
    sectorId: 'mayany' | 'farmer' | 'mango' | 'map' | 'packaging',
    sectorNameKhmer: string,
    sectorNameEnglish: string
  ) => {
    // Record click event in Firestore
    recordSectorClick(sectorId, isKhmer ? sectorNameKhmer : sectorNameEnglish);
    // Navigate to that sector view
    onNavigate(sectorId);
  };

  const sectors = [
    {
      id: 'mayany' as const,
      number: isKhmer ? '០១' : '01',
      title: t('វិស័យសហគ្រាសធុនតូច & មធ្យម (SMEs)', "Mayany Enterprise & M'day Processing"),
      badge: t('សហគ្រាស & ការកែច្នៃ', 'SMEs & Processing'),
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <Building className="w-7 h-7 text-emerald-600" />,
      imageSrc: '/images/mayany_cashew_bar_kiosk_franchise_1785129551670.jpg',
      imageAlt: t('សហគ្រាសកែច្នៃ Mayany & ស្តង់ដារ GHP/HACCP', 'Mayany Processing Enterprise & GHP/HACCP'),
      description: t(
        'ព័ត៌មានទូទៅនៃសហគ្រាសកែច្នៃផលិតផលកសិកម្មខ្មែរ ផលិតផលជំនួយទឹកដោះ M\'day Lactation ការគណនាថ្លៃដើមនាំចេញ B2B Freight និងផែនទីបង្ហាញផ្លូវស្តង់ដារគុណភាព GHP/HACCP។',
        'Overview of Cambodian agro-processing enterprise, M\'day lactation support products, B2B export freight costing, and 6-month GHP/HACCP standards roadmap.'
      ),
      keyHighlights: isKhmer ? [
        'ផលិតផលកែច្នៃក្នុងស្រុក និងចក្ខុវិស័យលើកកម្ពស់កសិផលខ្មែរ',
        'ការគណនាថ្លៃដឹកជញ្ជូនជាកុងតឺន័រ B2B Container Freight',
        'ផែនការ និងឯកសារស្តង់ដារគុណភាព GHP & HACCP ៦ខែ'
      ] : [
        'Domestic processed products & vision for uplifting Cambodian agriculture',
        'B2B Container Freight (FCL/LCL) export costing calculator',
        '6-Month GHP & HACCP quality standards roadmap and documentation'
      ],
      btnText: t('ចូលពិនិត្យវិស័យសហគ្រាស SMEs', 'Explore SMEs Sector'),
      accentColor: 'border-emerald-500 hover:border-emerald-600',
      tagBg: 'bg-emerald-50 text-emerald-700'
    },
    {
      id: 'farmer' as const,
      number: isKhmer ? '០២' : '02',
      title: t(
        'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទី',
        'Cashew Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)'
      ),
      badge: t('អនុលោមភាព EUDR & ខ្សែច្រវ៉ាក់ទាំងមូល', 'EUDR & Full Supply Chain Compliant'),
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: <Leaf className="w-7 h-7 text-amber-600" />,
      imageSrc: '/images/cambodia_cashew_farmer_1787965007571.jpg',
      imageAlt: t('ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់គ្រាប់ស្វាយចន្ទីកម្ពុជា', 'Cambodia Cashew Supply Chain & Harvest'),
      description: t(
        'ប្រព័ន្ធឌីជីថលតភ្ជាប់ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទីទាំងមូល៖ ម្ចាស់ចម្ការ (៣០ហិកតា & GPS), អ្នកប្រមូលទិញ, រោងចក្រកែច្នៃ, អ្នកនាំចេញ, និងដៃគូដឹកជញ្ជូន ស្របតាមអនុលោមភាព EUDR។',
        'End-to-end digital traceability connecting the entire cashew supply chain: orchard owners (30ha GPS plots), traders/collectors, processors, exporters, and logistics partners under EUDR compliance.'
      ),
      keyHighlights: isKhmer ? [
        'ម្ចាស់ចម្ការ & សហគមន៍ CAC៖ ផែនទី GPS ចម្ការ ៣០ ហិកតា & ការដាំដុះ',
        'អ្នកប្រមូលទិញ & រោងចក្រ៖ ការទិញ-លក់ ស្តុកគ្រាប់ស្ងួត និងកែច្នៃតាមស្តង់ដារ',
        'អ្នកនាំចេញ & ដឹកជញ្ជូន៖ EUDR Digital Passport QR & កុងតឺន័រនាំចេញ'
      ] : [
        'Orchard Owners & CAC: 30ha GPS polygon plot mapping & harvest logs',
        'Traders & Processors: Farm-gate aggregation, drying silots & grading',
        'Exporters & Logistics: EUDR Digital Passport QR & container dispatch'
      ],
      btnText: t('ចូលពិនិត្យខ្សែច្រវ៉ាក់ស្វាយចន្ទី', 'Explore Cashew Supply Chain'),
      accentColor: 'border-amber-500 hover:border-amber-600',
      tagBg: 'bg-amber-50 text-amber-800'
    },
    {
      id: 'mango' as const,
      number: isKhmer ? '០៣' : '03',
      title: t(
        'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយកែវរមៀត',
        'Mango Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)'
      ),
      badge: t('ស្តង់ដារ CamGAP & ខ្សែច្រវ៉ាក់នាំចេញ', 'CamGAP & Export Supply Chain'),
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: <span className="text-2xl">🥭</span>,
      imageSrc: '/images/cashew_farm_golden_hour_1785138906165.jpg',
      imageAlt: t('ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយកែវរមៀតកម្ពុជា', 'Cambodia Keo Romeat Mango Supply Chain'),
      description: t(
        'ប្រព័ន្ធឌីជីថលតភ្ជាប់ខ្សែច្រវ៉ាក់ផ្លែស្វាយកែវរមៀតស្រស់ និងដំណាប់ស្វាយ៖ ម្ចាស់ចម្ការ (CamGAP & GPS), អ្នកប្រមូលទិញ (Grade A/B/C), រោងចក្រកែច្នៃដំណាប់ស្វាយ, អ្នកនាំចេញ (VHT/អនាម័យភូតគាម), និងដៃគូដឹកជញ្ជូនត្រជាក់ (Cold-Chain)។',
        'End-to-end digital traceability connecting fresh & dried Keo Romeat mango supply chain: orchard owners (CamGAP & GPS), traders/collectors (Grade A/B/C sorting), dried fruit processors, exporters (VHT/phytosanitary), and cold-chain logistics partners.'
      ),
      keyHighlights: isKhmer ? [
        'ម្ចាស់ចម្ការ & GAP៖ ការថែទាំ ស្រោចស្រព ថង់ស្រោបផ្លែ និងកូអរដោនេ GPS',
        'អ្នកប្រមូលទិញ & រោងចក្រ៖ ការទិញតាមចម្ការ បែងចែកចំណាត់ថ្នាក់ A/B/C និងកែច្នៃដំណាប់',
        'អ្នកនាំចេញ & ដឹកជញ្ជូន៖ ការព្យាបាលដោយកម្តៅ (VHT), វិញ្ញាបនបត្រនាំចេញ និងទូត្រជាក់ Reefer'
      ] : [
        'Orchard Owners & GAP: Orchard logs, carbon paper bagging & GPS mapping',
        'Traders & Processors: Farm-gate collection, Grade A/B/C sorting & dried mango',
        'Exporters & Logistics: VHT phytosanitary clearance, export certs & reefer transport'
      ],
      btnText: t('ចូលពិនិត្យខ្សែច្រវ៉ាក់ស្វាយកែវរមៀត', 'Explore Mango Supply Chain'),
      accentColor: 'border-orange-500 hover:border-orange-600',
      tagBg: 'bg-orange-50 text-orange-800'
    },
    {
      id: 'map' as const,
      number: isKhmer ? '០៤' : '04',
      title: t(
        'ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ម្រេច & គ្រឿងទេស',
        'Pepper & Spices Supply Chain (Orchard Owners, Traders/Collectors, Processors, Exporters, Logistics Partners)'
      ),
      badge: t('សម្គាល់ភូមិសាស្ត្រ GI & ខ្សែច្រវ៉ាក់នាំចេញ', 'GI Kampot & Export Supply Chain'),
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <Navigation2 className="w-7 h-7 text-rose-600" />,
      imageSrc: '/images/cashew_harvest_tray_1785138921355.jpg',
      imageAlt: t('ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ម្រេចកំពត GI និងគ្រឿងទេសកម្ពុជា', 'Cambodia GI Kampot Pepper & Spices Supply Chain'),
      description: t(
        'ប្រព័ន្ធឌីជីថលតភ្ជាប់ខ្សែច្រវ៉ាក់ម្រេចកំពត GI និងគ្រឿងទេសកម្ពុជា៖ ម្ចាស់ចម្ការ (KPPA GI & GPS), អ្នកប្រមូលទិញ (សំណើម <12%), រោងចក្រសម្អាត កិន និងវេចខ្ចប់, អ្នកនាំចេញ (EU Organic & GI Stamps), និងដៃគូដឹកជញ្ជូននាំចេញ។',
        'End-to-end digital traceability connecting GI Kampot pepper & Cambodian spices supply chain: orchard owners (KPPA GI & GPS), traders/collectors (moisture <12%), sorting & milling processors, exporters (EU Organic & GI stamps), and logistics partners.'
      ),
      keyHighlights: isKhmer ? [
        'ម្ចាស់ចម្ការ & GI៖ ចម្ការម្រេចកំពត GI សរីរាង្គ ស្ករត្នោតធម្មជាតិ និងកូអរដោនេ GPS',
        'អ្នកប្រមូលទិញ & រោងចក្រ៖ ការត្រួតពិនិត្យសំណើម ចំណាត់ថ្នាក់គុណភាព និងការសម្ងួត',
        'អ្នកនាំចេញ & ដឹកជញ្ជូន៖ ស្លាកសញ្ញា GI ផ្លូវការ, QR តាមដានប្រភព និងការវេចខ្ចប់នាំចេញ'
      ] : [
        'Orchard Owners & GI: Organic KPPA GI plantations, palm sugar & GPS plots',
        'Traders & Processors: Farm-gate aggregation, moisture testing (<12%) & milling',
        'Exporters & Logistics: Official GI origin QR stamps, EU organic & export dispatch'
      ],
      btnText: t('ចូលពិនិត្យខ្សែច្រវ៉ាក់ម្រេច & គ្រឿងទេស', 'Explore Pepper & Spices Supply Chain'),
      accentColor: 'border-rose-500 hover:border-rose-600',
      tagBg: 'bg-rose-50 text-rose-800'
    },
    {
      id: 'packaging' as const,
      number: isKhmer ? '០៥' : '05',
      title: t('ស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល', 'Digital Packaging Label'),
      badge: t('ស្តង់ដារ CS 001 & បាកូដ EAN-13', 'CS 001 Standard & EAN-13'),
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <Tag className="w-7 h-7 text-purple-600" />,
      imageSrc: '/images/khmer_artisan_packaging_1787965050756.jpg',
      imageAlt: t('ស្លាកសញ្ញាវេចខ្ចប់ឌីជីថលស្តង់ដារជាតិ CS 001', 'Digital Packaging Label & CS 001 Standards'),
      description: t(
        'ប្រព័ន្ធរចនា និងបង្កើតស្លាកសញ្ញាវេចខ្ចប់ឌីជីថលសម្រាប់ផលិតផលម្ហូបអាហារកម្ពុជា អនុលោមតាមស្តង់ដារជាតិ CS 001:2000 បាកូដ EAN-13 និងតារាងអាហារូបត្ថម្ភត្រៀមឡើងផ្សារទំនើប។',
        'Digital packaging label creation system for Cambodian food products, compliant with National Standard CS 001:2000, EAN-13 barcodes, and nutrition facts ready for retail shelves.'
      ),
      keyHighlights: isKhmer ? [
        'រចនាស្លាកវេចខ្ចប់ឌីជីថលអនុលោមតាមស្តង់ដារជាតិ CS 001:2000',
        'គំរូស្ទីកឃ័រ ២ភាសា ខ្មែរ-អង់គ្លេស និងបាកូដ EAN-13 កម្ពុជា (884)',
        'ការរៀបចំទំហំកញ្ចប់ ថង់ និងដប PET/PP សម្រាប់ផ្សារទំនើប'
      ] : [
        'Digital packaging labels compliant with National Standard CS 001:2000',
        'Bilingual Khmer-English layout & Cambodian EAN-13 (884) barcodes',
        'Pouch, jar, and container label layouts ready for modern supermarkets'
      ],
      btnText: t('ចូលពិនិត្យស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល', 'Explore Digital Packaging Label'),
      accentColor: 'border-purple-500 hover:border-purple-600',
      tagBg: 'bg-purple-50 text-purple-800'
    }
  ];

  const faqs = [
    {
      q: t("អ្វីជាប្រព័ន្ធ CashewTrace Protocol?", "What is CashewTrace Protocol?"),
      a: t(
        "CashewTrace គឺជាប្រព័ន្ធឌីជីថលតម្លាភាពខ្សែច្រវាក់កសិផលកម្ពុជា ដែលតភ្ជាប់កសិករ សហគមន៍កសិកម្ម សហគ្រាសធុនតូច និងមធ្យម (SMEs) និងអ្នកបញ្ជាទិញ។ ប្រព័ន្ធនេះផ្តល់នូវព័ត៌មានទូទៅអំពីស្តង់ដារគុណភាព ការតាមដានប្រភព និងការអនុវត្តប្រកបដោយចីរភាព។",
        "CashewTrace is a Cambodian agricultural value chain transparency platform connecting smallholders, agricultural cooperatives, MSMEs, and global buyers. It provides verified standards, origin provenance, and sustainable agricultural practices."
      )
    },
    {
      q: t("តើទិន្នន័យគម្រោង និងព័ត៌មានបុគ្គលត្រូវបានការពារយ៉ាងដូចម្តេច?", "How is privacy safeguarded?"),
      a: t(
        "ដើម្បីការពារឯកជនភាព និងសុវត្ថិភាពទិន្នន័យ ព័ត៌មានលម្អិតនៃគម្រោងបុគ្គល កំណត់ត្រាចម្ការផ្ទាល់ខ្លួន និងរបាយការណ៍ហិរញ្ញវត្ថុមិនត្រូវបានបង្ហាញជាសាធារណៈឡើយ។ សាធារណជនអាចចូលមើលព័ត៌មានទូទៅនៃវិស័យទាំង ៥ និងសំណួរ-ចម្លើយទូទៅ ចំណែកម្ចាស់គណនីនីមួយៗអាចចូលប្រើប្រាស់ដោយសុវត្ថិភាពតាមរយៈគណនីសម្ងាត់ផ្ទាល់ខ្លួន។",
        "To ensure privacy and data security, individual project details, private farm records, and internal financial ledgers are not exposed publicly. The public can view general sector overviews and FAQs, while account owners access their private administration safely through authenticated login credentials."
      )
    },
    {
      q: t("តើវិស័យទាំង ៥ សំខាន់ៗនៃប្រព័ន្ធកសិកម្មកម្ពុជាមានអ្វីខ្លះ?", "What are the 5 main agricultural sectors?"),
      a: t(
        "វិស័យទាំង ៥ រួមមាន៖ (១) សហគ្រាសធុនតូច & មធ្យម, (២) ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយចន្ទី, (៣) ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ស្វាយកែវរមៀត, (៤) ខ្សែច្រវ៉ាក់ផ្គត់ផ្គង់ម្រេច & គ្រឿងទេស, និង (៥) ស្លាកសញ្ញាវេចខ្ចប់ឌីជីថល។",
        "The 5 major sectors comprise: (1) MSMEs & Agro-Processing, (2) Cashew Supply Chain (Orchards, Collectors, Processors, Exporters, Logistics), (3) Mango Supply Chain (Orchards, Collectors, Processors, Exporters, Logistics), (4) Pepper & Spices Supply Chain (Orchards, Collectors, Processors, Exporters, Logistics), and (5) Digital Packaging Label (CS 001 Compliance)."
      )
    },
    {
      q: t("តើអ្វីទៅជាស្តង់ដារ EUDR សម្រាប់គ្រាប់ស្វាយចន្ទីកម្ពុជា?", "What is EUDR compliance for Cambodian cashews?"),
      a: t(
        "EUDR (European Union Deforestation Regulation) គឺជាបទប្បញ្ញត្តិការពារការកាប់បំផ្លាញព្រៃឈើរបស់សហភាពអឺរ៉ុប។ CashewTrace ជួយដល់កសិករ និងសហគ្រាសកម្ពុជាក្នុងការបញ្ជាក់ថា កសិផលមិនបានមកពីដីព្រៃឈើដែលត្រូវបានកាប់បំផ្លាញក្រោយថ្ងៃទី ៣១ ខែធ្នូ ឆ្នាំ ២០២០ ឡើយ តាមរយៈការកត់ត្រាកូអរដោនេភូមិសាស្ត្រ GPS។",
        "EUDR is the European Union Deforestation Regulation. CashewTrace assists Cambodian farmers and enterprises in proving crops are not sourced from deforested land after December 31, 2020, through precise GPS polygon plot mapping and digital passports."
      )
    },
    {
      q: t("តើអ្វីទៅជាស្តង់ដារជាតិ CS 001:2000 សម្រាប់ការដាក់ស្លាកសញ្ញា?", "What is the CS 001:2000 National Standard for food labelling?"),
      a: t(
        "CS 001:2000 គឺជាស្តង់ដារជាតិនៃព្រះរាជាណាចក្រកម្ពុជា ដែលកំណត់លក្ខខណ្ឌតម្រូវសម្រាប់ការដាក់ស្លាកសញ្ញាលើផលិតផលម្ហូបអាហារវេចខ្ចប់ស្រេច រួមមានឈ្មោះផលិតផលជាភាសាខ្មែរធំជាងគេ គ្រឿងផ្សំ បរិមាណសុទ្ធ កាលបរិច្ឆេទផលិត និងផុតកំណត់ និងបាកូដ EAN-13 កម្ពុជា ដើម្បីត្រៀមចូលផ្សារទំនើបទំនើប។",
        "CS 001:2000 is the official National Standard of Cambodia specifying labelling requirements for prepackaged foods, including prominent Khmer product names, ingredients, net contents, manufacturing/expiry dates, and Cambodian EAN-13 barcodes for modern supermarket shelves."
      )
    }
  ];

  return (
    <div className="space-y-12">
      {/* 1. General Introduction Banner (Revolut-inspired Clean Layout & High Readability) */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.08),transparent_40%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-xs sm:text-sm font-mono font-bold tracking-wider text-emerald-300">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>{t('ថ្នាលតម្លាភាព និងខ្សែច្រវាក់កសិកម្មកម្ពុជា', 'CAMBODIAN AGRICULTURAL TRACEABILITY PLATFORM', 'KAMBODSCHANISCHE AGRAR-RÜCKVERFOLGBARKEIT')}</span>
            </div>
            {/* AsiaBerlin Delegation Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-xs font-bold text-amber-300 shadow-xs">
              <span>🇰🇭🇩🇪</span>
              <span>{t('ត្រៀម AsiaBerlin Summit 2026', 'AsiaBerlin Summit 2026 Delegation Candidate', 'Kandidat AsiaBerlin Summit 2026')}</span>
            </div>

            {/* ASEAN & European Multilingual Export Ready Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-500/20 border border-blue-400/40 rounded-full text-xs font-semibold text-blue-200">
              <Globe size={13} className="text-blue-400 shrink-0" />
              <span>
                {t(
                  'ត្រៀមទីផ្សារអាស៊ាន & អឺរ៉ុប (ASEAN & European Multilingual)',
                  'ASEAN & European Multilingual Ready',
                  'Bereit für ASEAN & EU-Märkte'
                )}
              </span>
              <span className="text-[11px] font-mono opacity-90 hidden sm:inline">
                🇰🇭 🌐 🇻🇳 🇹🇭 🇮🇩 🇲🇾 🇵🇭 🇱🇦 🇲🇲 🇨🇳 • 🇩🇪 🇫🇷 🇳🇱 🇮🇹 🇪🇸 🇰🇷
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-white leading-tight">
            {t('បណ្ដាញតម្លាភាព និងខ្សែច្រវាក់កសិផលកម្ពុជា', 'Cambodian Agricultural Value Chain', 'Kambodschanische Agrar-Wertschöpfungskette')}
            <span className="block text-emerald-400 text-2xl sm:text-3xl md:text-4xl font-semibold mt-2">
              {t('ពិធីសារស្តង់ដារគុណភាព & ការតាមដានប្រភព', 'Standards & Traceability Protocol', 'Standards & Rückverfolgbarkeits-Protokoll')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
            {t(
              'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធព័ត៌មានទូទៅ CashewTrace។ ប្រព័ន្ធនេះត្រូវបានបង្កើតឡើងក្នុងគោលបំណងលើកកម្ពស់កសិផលខ្មែរ ដោយតភ្ជាប់កសិករខ្នាតតូច សហគមន៍កសិកម្ម និងសហគ្រាសកែច្នៃធុនតូច និងមធ្យម (SMEs) តាមរយៈស្តង់ដារគុណភាព ការវេចខ្ចប់ត្រឹមត្រូវ និងការត្រៀមខ្លួនសម្រាប់ទីផ្សារអន្តរជាតិ។',
              'Welcome to the CashewTrace platform. Built to empower Cambodian agricultural produce by connecting smallholders, agricultural cooperatives, and MSMEs through verified standards, compliant packaging, and international export readiness.',
              'Willkommen auf der CashewTrace-Plattform. Entwickelt zur Stärkung der kambodschanischen Landwirtschaft durch Vernetzung von Kleinbauern, Kooperativen und Verarbeitungsbetrieben mit internationalen Qualitätsstandards.'
            )}
          </p>

          {/* Privacy & General Information Notice with larger font size */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl flex items-start gap-4 text-sm text-slate-200">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl shrink-0 mt-0.5">
              <Lock size={20} />
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <span>{t('ការគោរពឯកជនភាព និងសុវត្ថិភាពទិន្នន័យ', 'Data Privacy & Confidentiality Safeguarded', 'Datenschutz & Vertraulichkeit gewahrt')}</span>
              </p>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {t(
                  'ដើម្បីធានាឯកជនភាព គម្រោង និងទិន្នន័យបុគ្គលមិនត្រូវបានបង្ហាញជាសាធារណៈឡើយ។ លោកអ្នកអាចជ្រើសរើសចុចលើ វិស័យទាំង ៥ ខាងក្រោមនៅលើផ្ទាំងធំ ដើម្បីស្វែងយល់ព័ត៌មានទូទៅ មគ្គុទ្ទេសក៍ណែនាំ និងស្តង់ដារនៃវិស័យនីមួយៗ។',
                  'To safeguard privacy, individual project details and private farm records are not exposed to the public. You can click on the 5 main sectors below on the big screen to explore general overviews, video guides, and national standards.',
                  'Zum Schutz der Privatsphäre sind individuelle Betriebsdaten vertraulich. Sie können unten die 5 Sektoren auswählen, um allgemeine Richtlinien und Leitfäden einzusehen.'
                )}
              </p>
            </div>
          </div>

          {/* OFFICIAL MAYANY ENTERPRISE PRODUCT & STORE CALLOUT */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-amber-400/60 p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl text-left">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider rounded-full shadow-xs">
                  🛍️ ហាងកសិផល Mayany Enterprise
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-500/40">
                  {t('តម្លៃច្បាស់លាស់ & កុម្ម៉ង់ផ្ទាល់', 'Transparent Prices & Direct Order')}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                {t('បញ្ជាទិញកសិផលកែច្នៃ Mayany • ម្រេចកំពត GI & ម្សៅស្វាយចន្ទីសុទ្ធ', 'Order Mayany Products: GI Kampot Pepper & Pure Cashew Flour')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {t(
                  'សម្រាប់អតិថិជន និងវិនិយោគិនអន្តរជាតិ (កូរ៉េ អង់គ្លេស និងអាស៊ាន)៖ អាចពិនិត្យតម្លៃផលិតផលគ្រប់មុខជា USD, KRW (₩), GBP (£) និង KHR (៛) រួចចុចកុម្ម៉ង់ទិញតាម WhatsApp ឬតាមប្រព័ន្ធផ្ទាល់បានភ្លាមៗ។',
                  'For retail customers, Korean venture investors, and UK diplomatic/commercial buyers: View transparent prices in USD, KRW (₩), GBP (£), and KHR (៛). Order via instant WhatsApp or direct order desk!'
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('store')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-lg hover:shadow-amber-400/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('🛒 ចូលទៅកាន់ហាងទំនិញ & កុម្ម៉ង់', '🛒 Open Store & Order Now')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick Onboarding & Video Guide 4-Step Callout Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/80 border-2 border-emerald-500/50 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                  {t('⚡ ៤ ជំហានងាយៗ', '⚡ 4 QUICK STEPS')}
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  {t('ចុះឈ្មោះរហ័ស ផ្ទៀងផ្ទាត់ SMS ស្វ័យប្រវត្ត & វីដេអូបង្រៀន', 'Quick Signup, Auto SMS Verification & Video Guide')}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {t(
                  'មិនបាច់មាន Email • ផ្ទៀងផ្ទាត់លេខកូដ ៦ ខ្ទង់ស្វ័យប្រវត្តិ • ដំឡើងលើ Home Screen • វីដេអូ & សំឡេងខ្មែរច្បាស់ៗមួយៗ!',
                  'No Email needed • 6-Digit Auto OTP Verification • Install to Home Screen • Interactive Video & Khmer/English Voice Guide!'
                )}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => onOpenOnboarding && onOpenOnboarding()}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-md hover:shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('🎬 ចាប់ផ្តើមវីដេអូ & ចុះឈ្មោះ', '🎬 Start Video & Onboarding')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What CashewTrace Delivers For You (Public Benefits Breakdown) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>{t('ដំណោះស្រាយ & អត្ថប្រយោជន៍សាធារណៈ', 'SOLUTIONS & PUBLIC BENEFITS')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-sans">
            {t('អ្វីដែល CashewTrace ធ្វើជូនលោកអ្នក', 'What CashewTrace Delivers For You')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t(
              'យើងផ្តល់ជូននូវប្រព័ន្ធតម្លាភាព ស្តង់ដារ និងទីផ្សារទំនើបសម្រាប់គ្រប់តួអង្គក្នុងខ្សែច្រវាក់កសិកម្មកម្ពុជា៖',
              'We deliver transparency, national standards, and modern market connectivity for every stakeholder in Cambodia\'s agricultural value chain:'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Persona 1: Farmers */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🌾
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-sans">{t('សម្រាប់កសិករ & ម្ចាស់ចម្ការ', 'For Farmers & Growers')}</h3>
              <p className="text-[11px] text-emerald-800 font-sans">{t('កសិករ និងសហគមន៍កសិកម្ម', 'Farmers & Cooperatives')}</p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-1 font-sans">
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('ការចុះបញ្ជីកសិករ និងកត់ត្រាកូអរដោនេដីចម្ការ GPS', 'Farmer registration & GPS polygon plot mapping')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('ផ្ទៀងផ្ទាត់មិនកាប់បំផ្លាញព្រៃឈើតាមស្តង់ដារ EUDR', 'EUDR non-deforestation compliance verification')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{t('តភ្ជាប់ដោយផ្ទាល់ជាមួយសហគមន៍កសិកម្ម និងទីផ្សារ', 'Direct connection to agricultural cooperatives & buyers')}</span>
              </li>
            </ul>
          </div>

          {/* Persona 2: MSMEs */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🏭
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-sans">{t('សម្រាប់សហគ្រាសធុនតូច-មធ្យម', 'For Agro MSMEs')}</h3>
              <p className="text-[11px] text-purple-800 font-sans">{t('សហគ្រាសកែច្នៃកសិផល', 'Agri-Processing Enterprises')}</p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-1 font-sans">
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-purple-600 shrink-0 mt-0.5" />
                <span>{t('រៀបចំស្លាកសញ្ញាផលិតផលតាមស្តង់ដារ CS 001:2000', 'Product label compliance with CS 001:2000')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-purple-600 shrink-0 mt-0.5" />
                <span>{t('បង្កើតបាកូដ Barcode EAN-13 និងតារាងអាហារូបត្ថម្ភ', 'EAN-13 Barcode & nutrition facts table generation')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-purple-600 shrink-0 mt-0.5" />
                <span>{t('បង្កើតស្ទីកឃ័រ QR Code វេចខ្ចប់ស្រេចចូលផ្សារទំនើប', 'Supermarket-ready QR packaging label stickers')}</span>
              </li>
            </ul>
          </div>

          {/* Persona 3: Exporters */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🚢
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-sans">{t('សម្រាប់អ្នកនាំចេញ & B2B', 'For Exporters & B2B')}</h3>
              <p className="text-[11px] text-amber-800 font-sans">{t('អ្នកនាំចេញ និងដៃគូពាណិជ្ជកម្ម', 'Exporters & Trade Buyers')}</p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-1 font-sans">
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{t('គណនាថ្លៃដឹកជញ្ជូនកុងតឺន័រ FCL (CIF/FOB) ទៅទីផ្សារក្រៅប្រទេស', 'FCL container freight costing (CIF/FOB) to global ports')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{t('ផែនទីបង្ហាញផ្លូវស្តង់ដារអនាម័យ GHP / HACCP', 'GHP / HACCP hygiene standards roadmap')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{t('ផ្ទៀងផ្ទាត់ចំណាត់ថ្នាក់គុណភាព និងប្រភពជាក់ស្តែង', 'Verified quality grading & authenticated farm origin')}</span>
              </li>
            </ul>
          </div>

          {/* Persona 4: Consumers */}
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🛒
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-sans">{t('សម្រាប់អ្នកប្រើប្រាស់', 'For Consumers')}</h3>
              <p className="text-[11px] text-sky-800 font-sans">{t('អ្នកគាំទ្រកសិផលខ្មែរ', 'Supporters of Cambodian Produce')}</p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-1 font-sans">
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-sky-600 shrink-0 mt-0.5" />
                <span>{t('ស្កេនពិនិត្យប្រភពដើម និងប្រវត្តិនៃកសិផលខ្មែរពិតប្រាកដ', 'Scan to verify authentic Cambodian origin and farm story')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-sky-600 shrink-0 mt-0.5" />
                <span>{t('ទំនុកចិត្តលើសុវត្ថិភាពម្ហូបអាហារ និងអនាម័យ', 'Food safety, cleanliness, and hygiene confidence')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check size={14} className="text-sky-600 shrink-0 mt-0.5" />
                <span>{t('គាំទ្រដល់ជីវភាពកសិករ និងផលិតផលក្នុងស្រុក', 'Support local farmer livelihoods & domestic value addition')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2.5. Pictorial Visual Photo Guide for Farmers & MSMEs */}
      <VisualPictorialGuide onOpenFarmerPortal={() => onNavigate('farmer')} />

      {/* 3. The 5 Main Sectors On The Big Screen */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Globe size={14} />
              <span>{t('វិស័យកសិកម្មស្នូល', 'MAIN AGRICULTURAL SECTORS')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-sans">
              {t('វិស័យស្នូលទាំង ៥ នៃប្រព័ន្ធកសិកម្មកម្ពុជា', '5 Major Agricultural Sectors of Cambodia')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t(
                'សូមចុចលើវិស័យនីមួយៗដើម្បីពិនិត្យមើលព័ត៌មានទូទៅ មគ្គុទ្ទេសក៍វីដេអូ និងការអនុវត្តជាក់ស្តែង៖',
                'Click on each sector below to explore general information, video guides, and field implementations:'
              )}
            </p>
          </div>
        </div>

        {/* 5 Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sec) => (
            <motion.div
              key={sec.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-3xl border-2 ${sec.accentColor} shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden relative group cursor-pointer`}
              onClick={() => handleSectorClick(sec.id, sec.title, sec.title)}
            >
              {/* Sector Photo Preview */}
              <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={sec.imageSrc}
                  alt={sec.imageAlt || sec.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${sec.badgeColor} uppercase shadow-sm bg-white/95 backdrop-blur-xs`}>
                    {sec.badge}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-sm font-mono font-bold text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-sm">
                    {sec.number}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                {/* Icon & Titles */}
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-2xl ${sec.tagBg} shrink-0 shadow-xs`}>
                    {sec.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-sans leading-snug group-hover:text-emerald-700 transition-colors">
                      {sec.title}
                    </h3>
                  </div>
                </div>

                {/* Description - Larger readable text (14px) */}
                <p className="text-sm text-slate-700 leading-relaxed font-sans line-clamp-3">
                  {sec.description}
                </p>

                {/* Key Highlights - 13px with clear contrast */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-800 font-sans font-medium">
                  {sec.keyHighlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSectorClick(sec.id, sec.title, sec.title);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-sm font-bold font-sans transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-sm"
                >
                  <span>{sec.btnText}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenOnboarding) {
                      onOpenOnboarding(sec.id);
                    } else {
                      handleSectorClick(sec.id, sec.title, sec.title);
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('🎬 វីដេអូណែនាំ & ចុះឈ្មោះ', '🎬 Video Guide & Quick Signup', '🎬 Video-Anleitung & Registrierung')}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* 3. Frequently Asked Questions (FAQ) Section */}
      <section className="space-y-6 max-w-4xl mx-auto pt-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            <HelpCircle size={15} />
            <span>{t('ពិធីសារតម្លាភាព', 'TRANSPARENCY PROTOCOL')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-sans">
            {t('សំណួរដែលសួរញឹកញាប់', 'Frequently Asked Questions')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            {t(
              'ស្វែងយល់បន្ថែមអំពីពិធីសារតម្លាភាព ប៉ារ៉ាម៉ែត្របច្ចេកទេស និងវិធីសាស្ត្រផលជះ',
              'Learn more about the transparency protocol, its parameters, and our impact methodology'
            )}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-sans text-xs sm:text-sm font-bold text-slate-900 focus:outline-none hover:bg-slate-50 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180 text-emerald-600' : ''}`} 
                />
              </button>
              {openFaq === index && (
                <div className="p-5 pt-0 border-t border-slate-100 font-sans text-xs text-slate-600 leading-relaxed bg-slate-50/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Official Contact Information Section - CashewTrace */}
      <section id="contact-section" className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full uppercase">
              {t('ព័ត៌មានទំនាក់ទំនងផ្លូវការ', 'OFFICIAL CONTACT INFORMATION')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white mt-2">
              📞 {t('ព័ត៌មានទំនាក់ទំនងផ្លូវការ', 'Official Contact Information')} — CashewTrace
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
              {t(
                'សូមទាក់ទងមកកាន់ CashewTrace សម្រាប់កិច្ចសហការ ការចុះឈ្មោះកសិករ និងសហគ្រាស៖',
                'Please contact CashewTrace for partnerships, farmer registration, and enterprise onboarding:'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="tel:+855887712862"
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs font-sans transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Phone size={15} />
              <span>+855 88 771 2862</span>
            </a>
            <a
              href="https://t.me/+855887712862"
              target="_blank"
              rel="noreferrer"
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs font-sans transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Send size={15} />
              <span>Telegram: +855 88 771 2862</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Official Organization & Location */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Building size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-slate-400">{t('ស្ថាប័ន', 'Organization')}</span>
                  <h4 className="text-base font-bold text-white">CashewTrace</h4>
                  <p className="text-[11px] text-emerald-400 font-sans">{t('ពិធីសារតម្លាភាពកសិកម្មកម្ពុជា', 'Cambodian Agri-Traceability')}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-2 font-sans">
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin size={15} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">{t('ទីតាំង៖', 'Location:')} </span>
                    <span className="text-[11px]">{t('រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា', 'Phnom Penh, Kingdom of Cambodia')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60">
              EUDR & GHP Verified Ecosystem
            </div>
          </div>

          {/* Card 2: Phone, Telegram & WhatsApp */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-slate-400">{t('ទូរស័ព្ទ & ទំនាក់ទំនង', 'Direct Hotline')}</span>
                  <h4 className="text-sm font-bold text-white font-mono">+855 88 771 2862</h4>
                  <p className="text-[11px] text-slate-400 font-sans">ទូរស័ព្ទ • WhatsApp • Telegram</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-2 font-sans">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-emerald-400 shrink-0" />
                  <a href="tel:+855887712862" className="hover:underline text-slate-200 text-[11px]">
                    <strong className="font-mono">+855 88 771 2862</strong>
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={13} className="text-emerald-400 shrink-0" />
                  <a href="https://wa.me/855887712862" target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-300 text-[11px] flex items-center gap-1">
                    <span>WhatsApp: </span>
                    <strong className="font-mono">+855 88 771 2862</strong>
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Send size={13} className="text-sky-400 shrink-0" />
                  <a href="https://t.me/+855887712862" target="_blank" rel="noopener noreferrer" className="hover:underline text-sky-300 text-[11px] flex items-center gap-1">
                    <span>Telegram: </span>
                    <strong className="font-mono">+855 88 771 2862</strong>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60">
              Available 24/7 for Inquiries
            </div>
          </div>

          {/* Card 3: Facebook Page & Social */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
                  <Facebook size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-slate-400">{t('ហ្វេសប៊ុក & សង្គម', 'Facebook & Social')}</span>
                  <h4 className="text-sm font-bold text-white">CashewTrace</h4>
                  <p className="text-[11px] text-blue-400 font-sans">{t('ទំព័រផ្លូវការ', 'Official Facebook Page')}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-2.5 font-sans">
                <div>
                  <a
                    href="https://www.facebook.com/share/p/18sWyRnWDV/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-between px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white transition-all text-xs font-semibold group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Facebook size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>{t('ចូលទំព័រ Facebook ផ្លូវការ', 'Open Facebook Page')}</span>
                    </span>
                    <ExternalLink size={12} className="text-blue-400 shrink-0" />
                  </a>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <Mail size={13} className="text-sky-400 shrink-0" />
                  <a href="mailto:mayany@mayanyenterprise.com" className="hover:underline text-sky-300 font-mono text-[11px] truncate">
                    <span>mayany@mayanyenterprise.com</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-slate-400 font-mono border-t border-slate-800/60 truncate">
              facebook.com/share/p/18sWyRnWDV/
            </div>
          </div>

          {/* Card 4: Official Website & Web Portal */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Globe size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-slate-400">{t('គេហទំព័រ & ប្រព័ន្ធកម្មវិធី', 'Websites & Portals')}</span>
                  <h4 className="text-sm font-bold text-white font-mono">cashewtrace.com</h4>
                  <p className="text-[11px] text-emerald-400 font-sans">{t('គេហទំព័រផ្លូវការ', 'Official Domains')}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-2 font-sans">
                {/* Primary Website */}
                <div>
                  <a
                    href="https://cashewtrace.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 hover:text-emerald-300 transition-all text-xs font-mono group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Globe size={13} className="text-emerald-400" />
                      <span className="font-semibold">cashewtrace.com</span>
                    </span>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-white shrink-0" />
                  </a>
                </div>
                {/* Vercel Web App */}
                <div>
                  <a
                    href="https://cashew-trace.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 hover:text-sky-200 transition-all text-xs font-mono group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Tag size={13} className="text-sky-400" />
                      <span className="font-semibold truncate">cashew-trace.vercel.app</span>
                    </span>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-white shrink-0" />
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60">
              Live Cloud & Production Portals
            </div>
          </div>
        </div>

        {/* Action Direct Message CTA with direct 1-tap links */}
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-300 font-sans">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <span className="leading-relaxed">{t(
              'សម្រាប់ដៃគូសហការ អ្នកបញ្ជាទិញ កសិករ និងសហគ្រាសកសិកម្ម សូមទំនាក់ទំនងមកកាន់ CashewTrace ដោយផ្ទាល់តាមរយៈបណ្តាញផ្លូវការ៖',
              'For partners, international buyers, farmers, and agro-enterprises, please connect with CashewTrace directly via our official channels:'
            )}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Direct Facebook Link Button */}
            <a
              href="https://www.facebook.com/share/p/18sWyRnWDV/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              title={t('ចូលទៅកាន់ទំព័រ Facebook', 'Open Facebook Page')}
            >
              <Facebook size={14} />
              <span>Facebook Page</span>
              <ExternalLink size={11} className="opacity-75" />
            </a>

            {/* Direct Official Website Button */}
            <a
              href="https://cashewtrace.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold text-xs font-mono transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
              title="cashewtrace.com"
            >
              <Globe size={13} />
              <span>cashewtrace.com</span>
              <ExternalLink size={11} className="opacity-75" />
            </a>

            {/* Direct Vercel App Button */}
            <a
              href="https://cashew-trace.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-sky-200 font-bold text-xs font-mono transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
              title="cashew-trace.vercel.app"
            >
              <Tag size={13} />
              <span>cashew-trace.vercel.app</span>
              <ExternalLink size={11} className="opacity-75" />
            </a>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/855887712862"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>

            {/* Email Button */}
            <a
              href="mailto:mayany@mayanyenterprise.com?subject=Mayany%20Enterprise%20Cashew%20Inquiry"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 border border-slate-700"
            >
              <Mail size={13} />
              <span>Email</span>
            </a>

            {/* Phone Hotline Button */}
            <a
              href="tel:+855887712862"
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Phone size={13} />
              <span>+855 88 771 2862</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
