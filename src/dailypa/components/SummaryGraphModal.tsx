import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, BarChart3, TrendingUp, TrendingDown, Calendar, 
  Volume2, VolumeX, Search, Sparkles, ArrowUpRight, 
  ArrowDownLeft, HelpCircle, CheckCircle2, ChevronRight,
  PieChart, RefreshCw
} from 'lucide-react';
import { Entry, SupportedLanguage, CurrencyConfig } from '../types';
import { speakText } from '../utils/speech';

export type SummaryTimeframe = 'day' | 'week' | 'month' | 'all';

interface SummaryGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
  currencyConfig: CurrencyConfig;
  lang: SupportedLanguage;
  initialTimeframe?: SummaryTimeframe;
  initialSearchQuery?: string;
  autoSpeakOnOpen?: boolean;
}

export const SummaryGraphModal: React.FC<SummaryGraphModalProps> = ({
  isOpen,
  onClose,
  entries,
  currencyConfig,
  lang,
  initialTimeframe = 'week',
  initialSearchQuery = '',
  autoSpeakOnOpen = false,
}) => {
  const [timeframe, setTimeframe] = useState<SummaryTimeframe>(initialTimeframe);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeHoverBar, setActiveHoverBar] = useState<string | null>(null);

  const rate = currencyConfig.usdToSecondaryRate || currencyConfig.usdToKhrRate || 4030;
  const secSymbol = currencyConfig.secondaryCurrencySymbol || '៛';
  const isKm = lang === 'km';

  // Synchronize initial props if modal reopens with different params
  useEffect(() => {
    if (isOpen) {
      if (initialTimeframe) setTimeframe(initialTimeframe);
      if (initialSearchQuery !== undefined) setSearchQuery(initialSearchQuery);
    }
  }, [isOpen, initialTimeframe, initialSearchQuery]);

  // Filter entries based on timeframe, search query, and type
  const { filteredEntries, chartData, stats } = useMemo(() => {
    const now = new Date();
    const query = searchQuery.trim().toLowerCase();

    // 1. Timeframe filtering
    const timeFiltered = entries.filter((e) => {
      const d = new Date(e.date);
      if (timeframe === 'day') {
        return d.toDateString() === now.toDateString();
      } else if (timeframe === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        return d >= weekAgo;
      } else if (timeframe === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      return true; // 'all'
    });

    // 2. Query and Type filtering
    const matching = timeFiltered.filter((e) => {
      if (filterType !== 'all' && e.type !== filterType) return false;
      if (!query) return true;
      const tKm = (e.titleKhmer || '').toLowerCase();
      const tEn = (e.titleEnglish || '').toLowerCase();
      const notes = (e.notes || '').toLowerCase();
      const items = (e.items || []).join(' ').toLowerCase();
      const person = (e.personName || '').toLowerCase();
      return (
        tKm.includes(query) ||
        tEn.includes(query) ||
        notes.includes(query) ||
        items.includes(query) ||
        person.includes(query)
      );
    });

    // 3. Financial calculations
    let totalIncomeUsd = 0;
    let totalExpenseUsd = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    matching.forEach((e) => {
      const amt = e.amount || 0;
      const isSec = e.currency === currencyConfig.secondaryCurrency || e.currency === 'KHR';
      const valUsd = isSec ? amt / rate : amt;

      if (e.type === 'income') {
        totalIncomeUsd += valUsd;
        incomeCount++;
      } else if (e.type === 'expense') {
        totalExpenseUsd += valUsd;
        expenseCount++;
      }
    });

    const netProfitUsd = totalIncomeUsd - totalExpenseUsd;
    const profitMargin = totalIncomeUsd > 0 ? (netProfitUsd / totalIncomeUsd) * 100 : 0;

    // 4. Generate structured graph bars
    interface BarItem {
      label: string;
      subLabel: string;
      incomeUsd: number;
      expenseUsd: number;
      netUsd: number;
      count: number;
    }

    const bars: BarItem[] = [];

    if (timeframe === 'day') {
      // Group by hours / periods of the day
      const buckets = [
        { label: '06:00 - 10:00', subLabel: isKm ? 'ព្រឹកព្រលឹម' : 'Early Morning', startH: 6, endH: 10 },
        { label: '10:00 - 14:00', subLabel: isKm ? 'ថ្ងៃត្រង់' : 'Midday', startH: 10, endH: 14 },
        { label: '14:00 - 18:00', subLabel: isKm ? 'រសៀល' : 'Afternoon', startH: 14, endH: 18 },
        { label: '18:00 - 22:00', subLabel: isKm ? 'ពេលល្ងាច' : 'Evening', startH: 18, endH: 22 },
      ];

      buckets.forEach((b) => {
        let bIncome = 0;
        let bExpense = 0;
        let bCount = 0;

        matching.forEach((e) => {
          const d = new Date(e.date);
          const h = d.getHours();
          if (h >= b.startH && h < b.endH) {
            const amt = e.amount || 0;
            const isSec = e.currency === currencyConfig.secondaryCurrency || e.currency === 'KHR';
            const val = isSec ? amt / rate : amt;
            if (e.type === 'income') bIncome += val;
            if (e.type === 'expense') bExpense += val;
            bCount++;
          }
        });

        bars.push({
          label: b.label,
          subLabel: b.subLabel,
          incomeUsd: bIncome,
          expenseUsd: bExpense,
          netUsd: bIncome - bExpense,
          count: bCount,
        });
      });
    } else if (timeframe === 'week') {
      // 7 consecutive days up to today
      for (let i = 6; i >= 0; i--) {
        const targetDate = new Date(now.getTime() - i * 86400000);
        const dateStr = targetDate.toISOString().slice(0, 10);
        const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayNamesKm = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហ', 'សុក្រ', 'សៅរ៍'];
        const dayIdx = targetDate.getDay();

        let dayIncome = 0;
        let dayExpense = 0;
        let dayCount = 0;

        matching.forEach((e) => {
          if (e.date.startsWith(dateStr)) {
            const amt = e.amount || 0;
            const isSec = e.currency === currencyConfig.secondaryCurrency || e.currency === 'KHR';
            const val = isSec ? amt / rate : amt;
            if (e.type === 'income') dayIncome += val;
            if (e.type === 'expense') dayExpense += val;
            dayCount++;
          }
        });

        bars.push({
          label: isKm ? dayNamesKm[dayIdx] : dayNamesEn[dayIdx],
          subLabel: `${targetDate.getMonth() + 1}/${targetDate.getDate()}`,
          incomeUsd: dayIncome,
          expenseUsd: dayExpense,
          netUsd: dayIncome - dayExpense,
          count: dayCount,
        });
      }
    } else if (timeframe === 'month') {
      // 4 weeks of current month
      const weekLabels = [
        { label: isKm ? 'សប្តាហ៍ទី ១' : 'Week 1', sub: 'Day 1-7', startD: 1, endD: 7 },
        { label: isKm ? 'សប្តាហ៍ទី ២' : 'Week 2', sub: 'Day 8-14', startD: 8, endD: 14 },
        { label: isKm ? 'សប្តាហ៍ទី ៣' : 'Week 3', sub: 'Day 15-21', startD: 15, endD: 21 },
        { label: isKm ? 'សប្តាហ៍ទី ៤+' : 'Week 4+', sub: 'Day 22-31', startD: 22, endD: 31 },
      ];

      weekLabels.forEach((w) => {
        let wIncome = 0;
        let wExpense = 0;
        let wCount = 0;

        matching.forEach((e) => {
          const d = new Date(e.date);
          const dayNum = d.getDate();
          if (dayNum >= w.startD && dayNum <= w.endD) {
            const amt = e.amount || 0;
            const isSec = e.currency === currencyConfig.secondaryCurrency || e.currency === 'KHR';
            const val = isSec ? amt / rate : amt;
            if (e.type === 'income') wIncome += val;
            if (e.type === 'expense') wExpense += val;
            wCount++;
          }
        });

        bars.push({
          label: w.label,
          subLabel: w.sub,
          incomeUsd: wIncome,
          expenseUsd: wExpense,
          netUsd: wIncome - wExpense,
          count: wCount,
        });
      });
    } else {
      // All time: group by last 4 months
      for (let m = 3; m >= 0; m--) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const mYear = d.getFullYear();
        const mMonth = d.getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthNamesKm = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

        let mIncome = 0;
        let mExpense = 0;
        let mCount = 0;

        matching.forEach((e) => {
          const ed = new Date(e.date);
          if (ed.getFullYear() === mYear && ed.getMonth() === mMonth) {
            const amt = e.amount || 0;
            const isSec = e.currency === currencyConfig.secondaryCurrency || e.currency === 'KHR';
            const val = isSec ? amt / rate : amt;
            if (e.type === 'income') mIncome += val;
            if (e.type === 'expense') mExpense += val;
            mCount++;
          }
        });

        bars.push({
          label: isKm ? monthNamesKm[mMonth] : monthNames[mMonth],
          subLabel: String(mYear),
          incomeUsd: mIncome,
          expenseUsd: mExpense,
          netUsd: mIncome - mExpense,
          count: mCount,
        });
      }
    }

    // Find highest peak bar for scaling
    const maxVal = Math.max(
      ...bars.map((b) => Math.max(b.incomeUsd, b.expenseUsd)),
      10 // minimum scale
    );

    return {
      filteredEntries: matching,
      chartData: { bars, maxVal },
      stats: {
        totalIncomeUsd,
        totalExpenseUsd,
        netProfitUsd,
        profitMargin,
        incomeCount,
        expenseCount,
        totalCount: matching.length,
      },
    };
  }, [entries, timeframe, filterType, searchQuery, currencyConfig, rate]);

  // Find peak day/bar
  const peakDay = useMemo(() => {
    if (!chartData.bars.length) return null;
    return [...chartData.bars].sort((a, b) => b.incomeUsd - a.incomeUsd)[0];
  }, [chartData]);

  // Generate intelligent spoken narrative explaining the graph out loud
  const generateSpokenExplanation = (): string => {
    const periodNameMap: Record<SummaryTimeframe, Record<string, string>> = {
      day: {
        km: 'ថ្ងៃនេះ',
        en: 'today',
        vi: 'hôm nay',
        th: 'วันนี้',
        id: 'hari ini',
        ms: 'hari ini',
        sg: 'today',
        bn: 'hari ini',
        fil: 'ngayong araw',
        lo: 'ມື້ນີ້',
        my: 'ယနေ့',
        zh: '今天',
        ko: '오늘',
        fr: "d'aujourd'hui",
        de: 'von heute',
        es: 'de hoy',
        it: 'di oggi',
        nl: 'van vandaag',
        pt: 'de hoje',
      },
      week: {
        km: 'ក្នុងរយៈពេល ៧ ថ្ងៃកន្លងមក',
        en: 'for the past 7 days',
        vi: 'trong 7 ngày qua',
        th: 'ในรอบ 7 วันที่ผ่านมา',
        id: 'selama 7 hari terakhir',
        ms: 'sepanjang 7 hari lalu',
        sg: 'for the past 7 days',
        bn: 'sepanjang 7 hari lalu',
        fil: 'sa nakaraang 7 araw',
        lo: 'ໃນ 7 ມື້ຜ່ານມາ',
        my: 'လွန်ခဲ့သော ၇ ရက်အတွင်း',
        zh: '过去 7 天',
        ko: '지난 7일간',
        fr: 'des 7 derniers jours',
        de: 'der letzten 7 Tage',
        es: 'de los últimos 7 días',
        it: 'degli ultimi 7 giorni',
        nl: 'van de afgelopen 7 dagen',
        pt: 'dos últimos 7 dias',
      },
      month: {
        km: 'ប្រចាំខែនេះ',
        en: 'for this month',
        vi: 'trong tháng này',
        th: 'สำหรับเดือนนี้',
        id: 'bulan ini',
        ms: 'bulan ini',
        sg: 'this month',
        bn: 'bulan ini',
        fil: 'ngayong buwan',
        lo: 'ເດືອນນີ້',
        my: 'ယခုလအတွက်',
        zh: '本月',
        ko: '이번 달',
        fr: 'de ce mois',
        de: 'dieses Monats',
        es: 'de este mes',
        it: 'di questo mese',
        nl: 'van deze maand',
        pt: 'deste mês',
      },
      all: {
        km: 'សរុបទាំងអស់',
        en: 'across all recorded periods',
        vi: 'trong toàn bộ thời gian',
        th: 'ทั้งหมดที่บันทึกไว้',
        id: 'sepanjang waktu',
        ms: 'sepanjang masa',
        sg: 'all-time',
        bn: 'sepanjang masa',
        fil: 'sa lahat ng talaan',
        lo: 'ທັງໝົດ',
        my: 'မှတ်တမ်းတင်ထားသမျှ အားလုံး',
        zh: '全部历史记录',
        ko: '전체 기간',
        fr: 'de toute la période',
        de: 'des gesamten Zeitraums',
        es: 'de todo el historial',
        it: 'di sempre',
        nl: 'van alle perioden',
        pt: 'de todo o histórico',
      },
    };

    const periodStr = periodNameMap[timeframe][lang] || periodNameMap[timeframe].en;
    const incUsd = stats.totalIncomeUsd.toFixed(2);
    const incSec = Math.round(stats.totalIncomeUsd * rate).toLocaleString();
    const expUsd = stats.totalExpenseUsd.toFixed(2);
    const expSec = Math.round(stats.totalExpenseUsd * rate).toLocaleString();
    const netUsd = stats.netProfitUsd.toFixed(2);
    const netSec = Math.round(stats.netProfitUsd * rate).toLocaleString();
    const isProfit = stats.netProfitUsd >= 0;

    const queryNotice = searchQuery
      ? (isKm ? `សម្រាប់ពាក្យគន្លឹះ "${searchQuery}"៖ ` : `For your filter "${searchQuery}": `)
      : '';

    const peakNotice = peakDay && peakDay.incomeUsd > 0
      ? (isKm 
          ? `។ នៅលើក្រាហ្វ ជួរឈរពណ៌បៃតងតំណាងឱ្យចំណូល ហើយជួរឈរពណ៌ក្រហមតំណាងឱ្យចំណាយ។ ថ្ងៃដែលលក់បានច្រើនជាងគេគឺ ${peakDay.label} ដែលមានចំណូល ${peakDay.incomeUsd.toFixed(0)} ដុល្លារ`
          : `. On the visual graph, green columns represent sales revenue while red columns represent operating expenses. Your highest revenue period was ${peakDay.label} with $${peakDay.incomeUsd.toFixed(0)}`)
      : '';

    if (lang === 'km') {
      return `${queryNotice}នេះជាការពន្យល់សង្ខេបក្រាហ្វ ${periodStr}។ ការលក់សរុបមានចំនួន ${incUsd} ដុល្លារ (ស្មើប្រមាណ ${incSec} ${secSymbol})។ ចំណាយប្រតិបត្តិការសរុបមានចំនួន ${expUsd} ដុល្លារ (ស្មើប្រមាណ ${expSec} ${secSymbol})។ ${
        isProfit 
          ? `អ្នកទទួលបានប្រាក់ចំណេញសុទ្ធចំនួន ${netUsd} ដុល្លារ (ប្រហែល ${netSec} ${secSymbol}) អត្រាចំណេញ ${stats.profitMargin.toFixed(0)} ភាគរយ`
          : `អ្នកមានការខាតបង់សុទ្ធចំនួន ${Math.abs(stats.netProfitUsd).toFixed(2)} ដុល្លារ សូមពិនិត្យមើលការកាត់បន្ថយចំណាយ`
      }${peakNotice}។ កត់ត្រាសរុបមានចំនួន ${stats.totalCount} ប្រតិបត្តិការ។`;
    }

    if (lang === 'vi') {
      return `${queryNotice}Đây là báo cáo biểu đồ ${periodStr}. Tổng doanh thu là $${incUsd}, chi phí là $${expUsd}. Lợi nhuận ròng là $${netUsd}. Trên biểu đồ, cột màu xanh thể hiện doanh thu và cột màu đỏ thể hiện chi phí. Tổng cộng có ${stats.totalCount} giao dịch được ghi nhận.`;
    }

    if (lang === 'th') {
      return `${queryNotice}นี่คือสรุปกราฟ${periodStr}ค่ะ ยอดขายรวมอยู่ที่ $${incUsd} ค่าใช้จ่ายรวม $${expUsd} กำไรสุทธิคือ $${netUsd} แท่งสีเขียวแสดงรายรับ และแท่งสีแดงแสดงรายจ่าย บันทึกทั้งหมด ${stats.totalCount} รายการค่ะ`;
    }

    if (lang === 'id') {
      return `${queryNotice}Berikut adalah ringkasan grafik ${periodStr}. Total pemasukan $${incUsd}, total pengeluaran $${expUsd}, dengan laba bersih $${netUsd}. Kolom hijau menunjukkan pemasukan dan kolom merah adalah pengeluaran.`;
    }

    if (lang === 'my') {
      return `${queryNotice}${periodStr}အတွက် ဂရပ်အနှစ်ချုပ်ဖြစ်ပါသည်။ စုစုပေါင်းရောင်းရငွေမှာ $${incUsd} ဖြစ်ပြီး အသုံးစရိတ်မှာ $${expUsd} ဖြစ်ကာ အသားတင်အမြတ်မှာ $${netUsd} ဖြစ်ပါသည်။ အစိမ်းရောင်တိုင်များသည် ဝင်ငွေကိုပြပြီး အနီရောင်တိုင်များသည် အသုံးစရိတ်ကို ပြသပါသည်။`;
    }

    if (lang === 'zh') {
      return `${queryNotice}这是您${periodStr}的图表分析。总收入为 $${incUsd}，总支出为 $${expUsd}，净利润为 $${netUsd}。图表上绿色柱代表营业额，红色柱代表经营支出。共记录了 ${stats.totalCount} 笔数据。`;
    }

    if (lang === 'ko') {
      return `${queryNotice}${periodStr} 그래프 요약 브리핑입니다. 총 수입은 $${incUsd}, 총 지출은 $${expUsd}, 순이익은 $${netUsd}입니다. 녹색 막대는 수입, 붉은 막대는 지출을 나타냅니다.`;
    }

    if (lang === 'fr') {
      return `${queryNotice}Voici le résumé graphique ${periodStr}. Ventes totales : $${incUsd}, dépenses : $${expUsd}, bénéfice net : $${netUsd}. Les barres vertes indiquent les revenus et les barres rouges les dépenses.`;
    }

    if (lang === 'de') {
      return `${queryNotice}Hier ist Ihre Grafik-Zusammenfassung ${periodStr}. Gesamteinnahmen: $${incUsd}, Gesamtausgaben: $${expUsd}, Reingewinn: $${netUsd}. Die grünen Balken stehen für Umsatz und die roten für Kosten.`;
    }

    if (lang === 'es') {
      return `${queryNotice}Aquí está el resumen gráfico ${periodStr}. Ventas totales: $${incUsd}, gastos: $${expUsd}, beneficio neto: $${netUsd}. Las barras verdes representan ingresos y las rojas gastos.`;
    }

    // Default English
    return `${queryNotice}Here is your visual graph summary ${periodStr}. Total revenue is $${incUsd} across ${stats.incomeCount} orders, total operating expenses are $${expUsd}, giving you a net profit of $${netUsd} with a ${stats.profitMargin.toFixed(0)}% profit margin${peakNotice}. A total of ${stats.totalCount} records were analyzed.`;
  };

  const handleSpeak = () => {
    const script = generateSpokenExplanation();
    setIsSpeaking(true);
    speakText(script, lang, { playChime: true });
    setTimeout(() => setIsSpeaking(false), 9000);
  };

  // Trigger speech on open if requested by voice command
  useEffect(() => {
    if (isOpen && autoSpeakOnOpen) {
      const timer = setTimeout(() => {
        handleSpeak();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoSpeakOnOpen]);

  if (!isOpen) return null;

  return (
    <div 
      id="summary-graph-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        id="summary-graph-modal-card"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 sm:p-6 text-white relative">
          <button 
            id="summary-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {isKm ? 'របាយការណ៍សង្ខេប & ក្រាហ្វវិភាគ' : 'Summary Report & Visual Graph'}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-amber-300" /> AI Voice
                </span>
              </div>
              <p className="text-emerald-100 text-xs mt-0.5">
                {isKm 
                  ? 'មើលក្រាហ្វចំណូល ចំណាយ និងស្តាប់ការពន្យល់ជាសំឡេងបានគ្រប់ភាសា' 
                  : 'View sales vs expenses charts with voice explanation read out loud'}
              </p>
            </div>
          </div>

          {/* Spoken Narration Button */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              id="summary-read-aloud-btn"
              onClick={handleSpeak}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Volume2 className={`w-4 h-4 text-emerald-600 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <span>
                {isSpeaking 
                  ? (isKm ? 'កំពុងពន្យល់ក្រាហ្វជាសំឡេង...' : 'Reading Graph Out Loud...') 
                  : (isKm ? 'ស្តាប់ការពន្យល់ក្រាហ្វជាសំឡេង' : 'Explain Graph Out Loud')}
              </span>
            </button>

            <span className="text-[11px] text-emerald-100 bg-emerald-700/40 px-3 py-1.5 rounded-full backdrop-blur-xs">
              {isKm ? 'សំឡេងស្វ័យប្រវត្តិតាមភាសាអ្នកជ្រើសរើស' : 'Auto-narrated in your active language'}
            </span>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Timeframe Selector */}
          <div className="inline-flex bg-slate-200 p-1 rounded-2xl">
            {(['day', 'week', 'month', 'all'] as SummaryTimeframe[]).map((tf) => {
              const labels: Record<SummaryTimeframe, { km: string; en: string }> = {
                day: { km: 'ថ្ងៃនេះ (Day)', en: 'Day' },
                week: { km: 'សប្តាហ៍ (Week)', en: 'Week' },
                month: { km: 'ខែ (Month)', en: 'Month' },
                all: { km: 'សរុប (All)', en: 'All-Time' },
              };
              const active = timeframe === tf;
              return (
                <button
                  key={tf}
                  id={`timeframe-${tf}-btn`}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isKm ? labels[tf].km : labels[tf].en}
                </button>
              );
            })}
          </div>

          {/* Search / Category Filter Bar */}
          <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="summary-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isKm ? 'ស្វែងរក (ឧ. កាហ្វេ, គ្រាប់ស្វាយចន្ទី, បំណុល)...' : 'Search (e.g. coffee, cashew, debt)...'}
                className="w-full bg-white pl-8 pr-7 py-1.5 text-xs text-slate-800 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Type Filter Pills */}
            <div className="inline-flex bg-slate-200 p-0.5 rounded-xl text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium ${filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                {isKm ? 'ទាំងអស់' : 'All'}
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium ${filterType === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
              >
                {isKm ? 'ចំណូល' : 'In'}
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium ${filterType === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'}`}
              >
                {isKm ? 'ចំណាយ' : 'Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-700">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Income */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                  {isKm ? 'ចំណូលសរុប (Income)' : 'Total Revenue'}
                </span>
                <p className="text-xl font-black text-emerald-950 mt-1">
                  ${stats.totalIncomeUsd.toFixed(2)}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  ≈ {Math.round(stats.totalIncomeUsd * rate).toLocaleString()} {secSymbol} ({stats.incomeCount} orders)
                </p>
              </div>
            </div>

            {/* Total Expense */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                  {isKm ? 'ចំណាយសរុប (Expenses)' : 'Total Expenses'}
                </span>
                <p className="text-xl font-black text-rose-950 mt-1">
                  ${stats.totalExpenseUsd.toFixed(2)}
                </p>
                <p className="text-[11px] text-rose-700 font-medium">
                  ≈ {Math.round(stats.totalExpenseUsd * rate).toLocaleString()} {secSymbol} ({stats.expenseCount} items)
                </p>
              </div>
            </div>

            {/* Net Profit / Margin */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              stats.netProfitUsd >= 0 
                ? 'bg-blue-50 border-blue-100' 
                : 'bg-amber-50 border-amber-100'
            }`}>
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                  {stats.netProfitUsd >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> : <TrendingDown className="w-3.5 h-3.5 text-amber-600" />}
                  {isKm ? 'ចំណេញសុទ្ធ (Net Profit)' : 'Net Profit / Margin'}
                </span>
                <p className={`text-xl font-black mt-1 ${stats.netProfitUsd >= 0 ? 'text-blue-950' : 'text-amber-950'}`}>
                  ${stats.netProfitUsd.toFixed(2)}
                </p>
                <p className="text-[11px] text-blue-700 font-medium">
                  {stats.profitMargin.toFixed(0)}% margin ({stats.totalCount} records)
                </p>
              </div>
            </div>
          </div>

          {/* Visual Graph Section */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {isKm ? 'ក្រាហ្វប្រៀបធៀបចំណូល និងចំណាយ' : 'Revenue vs Expense Distribution'}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500" />
                  {isKm ? 'ចំណូល (Income)' : 'Revenue'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-rose-500" />
                  {isKm ? 'ចំណាយ (Expense)' : 'Expense'}
                </span>
              </div>
            </div>

            {/* SVG Interactive Chart Canvas */}
            <div className="pt-4 pb-2">
              {chartData.bars.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  {isKm ? 'មិនមានទិន្នន័យសម្រាប់កាលបរិច្ឆេទនេះឡើយ' : 'No recorded data for this timeframe.'}
                </div>
              ) : (
                <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 sm:h-56 px-2 border-b border-slate-200">
                  {chartData.bars.map((bar, idx) => {
                    const incHeight = (bar.incomeUsd / chartData.maxVal) * 100;
                    const expHeight = (bar.expenseUsd / chartData.maxVal) * 100;
                    const isHovered = activeHoverBar === bar.label;

                    return (
                      <div 
                        key={idx} 
                        className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                        onMouseEnter={() => setActiveHoverBar(bar.label)}
                        onMouseLeave={() => setActiveHoverBar(null)}
                      >
                        {/* Hover Tooltip Popup */}
                        {isHovered && (
                          <div className="absolute -top-16 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-in fade-in duration-150 pointer-events-none">
                            <p className="font-bold text-amber-300">{bar.label} ({bar.subLabel})</p>
                            <p className="text-emerald-400">In: ${bar.incomeUsd.toFixed(2)}</p>
                            <p className="text-rose-400">Out: ${bar.expenseUsd.toFixed(2)}</p>
                            <p className="text-blue-300">Net: ${bar.netUsd.toFixed(2)}</p>
                          </div>
                        )}

                        {/* Visual Columns Pair */}
                        <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-1">
                          {/* Income Bar (Green) */}
                          <div 
                            style={{ height: `${Math.max(incHeight, 4)}%` }}
                            className={`w-3 sm:w-5 rounded-t-lg transition-all duration-300 ${
                              bar.incomeUsd > 0 ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-slate-200'
                            }`}
                          />

                          {/* Expense Bar (Rose) */}
                          <div 
                            style={{ height: `${Math.max(expHeight, 4)}%` }}
                            className={`w-3 sm:w-5 rounded-t-lg transition-all duration-300 ${
                              bar.expenseUsd > 0 ? 'bg-rose-500 group-hover:bg-rose-400' : 'bg-slate-200'
                            }`}
                          />
                        </div>

                        {/* X-Axis Label */}
                        <div className="mt-2 text-center">
                          <p className="text-[10px] sm:text-xs font-bold text-slate-700 leading-none">
                            {bar.label}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            {bar.subLabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Explanation card for how to read the graph */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <p className="font-semibold text-emerald-900">
                  {isKm ? 'របៀបអានក្រាហ្វ និងការវិភាគ AI' : 'How to Read this Graph & AI Insights:'}
                </p>
                <p className="text-[11px] text-emerald-800">
                  {isKm
                    ? '• ជួរឈរពណ៌បៃតងតំណាងឱ្យប្រាក់ចំណូល (ការលក់)។ ជួរឈរពណ៌ក្រហមតំណាងឱ្យការចំណាយ។'
                    : '• Green bars represent revenue (sales). Red bars represent business or personal expenses.'}
                </p>
                <p className="text-[11px] text-emerald-800">
                  {isKm
                    ? '• ចុចប៊ូតុង "ស្តាប់ការពន្យល់ក្រាហ្វជាសំឡេង" ដើម្បីឱ្យ AI អាន និងពន្យល់ពីចំណេញខាតជាសំឡេងភ្លាមៗ!'
                    : '• Tap "Explain Graph Out Loud" to have the AI voice assistant analyze and narrate your performance aloud!'}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Transactions Breakdown for this timeframe */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {isKm ? 'ប្រតិបត្តិការដែលបានវិភាគ' : 'Analyzed Transactions'} ({filteredEntries.length})
              </h4>
            </div>

            {filteredEntries.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                {isKm ? 'មិនមានកំណត់ត្រាក្នុងលក្ខខណ្ឌនេះទេ' : 'No records match this filter.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                {filteredEntries.slice(0, 15).map((e) => (
                  <div key={e.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${e.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <div>
                        <p className="font-semibold text-slate-800">
                          {isKm ? (e.titleKhmer || e.titleEnglish) : (e.titleEnglish || e.titleKhmer)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {e.date.slice(0, 10)} • {e.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${e.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {e.type === 'income' ? '+' : '-'}${Number(e.amount || 0).toFixed(2)}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {e.currency || 'USD'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            id="summary-speak-footer-btn"
            onClick={handleSpeak}
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>{isKm ? 'អានជាសំឡេងឡើងវិញ' : 'Replay Voice Explanation'}</span>
          </button>

          <button
            id="summary-modal-done-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm"
          >
            {isKm ? 'រួចរាល់ (Close)' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
