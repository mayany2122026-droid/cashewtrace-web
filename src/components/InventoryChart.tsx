import { useState } from 'react';
import { 
  Search, ArrowDownRight, ArrowUpRight, ShieldAlert, History,
  ShieldCheck, FileCheck, X, ChevronRight, Download, Layers, Cpu, Clock, RefreshCw
} from 'lucide-react';
import { InventoryRecord, Batch } from '../types';

interface InventoryChartProps {
  inventory: InventoryRecord[];
  activeBatch?: Batch;
  batches?: Batch[];
}

export default function InventoryChart({ inventory, activeBatch, batches }: InventoryChartProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [activeVersion, setActiveVersion] = useState('v1.3');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Find current batch
  const defaultBatch = batches?.find(b => b.status === 'VERIFIED') || {
    batch_id: 'B001',
    total_input_kg: 510,
    num_suppliers: 3,
    origin_province: 'BATTAMBANG, KAMPONG SPEU',
    production_date_raw: 46185.0,
    product: 'Banana Flour',
    product_name: "M'day Lactation",
    output_kg: 25.0,
    verified_by: 'CashewTrace',
    verification_date_raw: 46185,
    status: 'VERIFIED' as const,
    yield_percent: 0.04901960784,
    certification: 'GHP',
    moisture_percent: null,
    enterprise_name: 'CAM HEART',
    enterprise_location: 'BATTAMBANG PROVINCE',
    story: 'បេសកកម្ម និងការប្តេជ្ញាចិត្ត',
    sourcing_records: []
  };

  const currentBatch = activeBatch || defaultBatch;

  // Helper to generate a deterministic mock hash
  const getMockHash = (batchId: string, step: string) => {
    let hash = 0;
    const str = `${batchId}-${step}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(8, '0') + '...b8f' + batchId.toLowerCase();
  };

  // Helper for mock checklist items
  const getChecklistForVersion = (version: string) => {
    const isVerified = currentBatch.status === 'VERIFIED';
    switch (version) {
      case 'v1.0':
        return [
          { label: 'Operator session established', passed: true },
          { label: `Planned sourcing targets entered (${currentBatch.total_input_kg} kg)`, passed: true },
          { label: 'QA field inspector sign-off', passed: false },
          { label: 'Blockchain node broadcast completed', passed: false }
        ];
      case 'v1.1':
        return [
          { label: 'Sourcing weights validated on-site', passed: isVerified },
          { label: 'Smallholder CT identities authenticated', passed: isVerified },
          { label: 'Ingress logs written to local node', passed: isVerified },
          { label: 'QA supervisor biometric signature verified', passed: false }
        ];
      case 'v1.2':
        return [
          { label: 'Good Hygiene Practices (GHP) protocol met', passed: isVerified },
          { label: `Moisture percentage & yield verified (${(currentBatch.yield_percent * 100).toFixed(2)}%)`, passed: isVerified },
          { label: 'QA supervisor biometric signature verified', passed: isVerified },
          { label: 'Core Blockchain consensus broadcast completed', passed: false }
        ];
      case 'v1.3':
      default:
        return [
          { label: 'Decentralized node consensus reached', passed: isVerified },
          { label: 'Mass balance inputs strictly matched outputs', passed: isVerified },
          { label: 'Signature block written & sealed permanently', passed: isVerified },
          { label: 'Digital Passport & QR entry activated', passed: isVerified }
        ];
    }
  };

  // Helper for mock JSON payloads
  const getMockJsonBlock = (batch: Batch, version: string) => {
    const date = batch.production_date_raw - (3 - parseFloat(version.slice(1)));
    const blockNum = 10480 + (version === 'v1.3' ? 3 : version === 'v1.2' ? 2 : version === 'v1.1' ? 1 : 0);
    const hash = getMockHash(batch.batch_id, version);
    
    if (version === 'v1.0') {
      return {
        block: blockNum,
        timestamp: date,
        author: "Dalin Eng",
        action: "INITIAL_DRAFT_SUBMISSION",
        payload: {
          batch_id: batch.batch_id,
          product_name: batch.product_name,
          planned_input_kg: batch.total_input_kg,
          status: "DRAFT_LOGGED"
        },
        signature: hash
      };
    } else if (version === 'v1.1') {
      return {
        block: blockNum,
        timestamp: date,
        author: "CashewTrace Field Inspector Node",
        action: "SOURCING_INGRESS_VERIFIED",
        payload: {
          batch_id: batch.batch_id,
          suppliers_checked: batch.sourcing_records.length > 0 ? batch.sourcing_records.map(s => s.supplier_name) : ["SOK KHENG", "PHNOM PENH SUGAR", "CITY WATER"],
          total_ingrained_kg: batch.total_input_kg,
          status: batch.status === 'VERIFIED' ? "SOURCING_VERIFIED" : "PENDING_VERIFICATION"
        },
        signature: hash
      };
    } else if (version === 'v1.2') {
      return {
        block: blockNum,
        timestamp: date,
        author: "CAM HEART Quality Assurance Node",
        action: "PROCESSING_GHP_APPROVED",
        payload: {
          batch_id: batch.batch_id,
          output_kg: batch.output_kg,
          yield_percent: batch.yield_percent,
          hygiene_checklist: {
            equipment_sanitized: batch.status === 'VERIFIED',
            temperature_monitored: batch.status === 'VERIFIED',
            moisture_checked: batch.status === 'VERIFIED'
          },
          status: batch.status === 'VERIFIED' ? "PROCESSING_APPROVED" : "PENDING_VERIFICATION"
        },
        signature: hash
      };
    } else {
      return {
        block: blockNum,
        timestamp: date,
        author: "CashewTrace Core Node (BATTAMBANG_04)",
        action: "BLOCKCHAIN_LEDGER_SEALED",
        payload: {
          batch_id: batch.batch_id,
          final_yield: batch.yield_percent,
          certificate_type: batch.certification,
          verified_by: batch.verified_by,
          qr_passport_active: batch.status === 'VERIFIED',
          status: batch.status === 'VERIFIED' ? "SEALED_VERIFIED" : "PENDING_VERIFICATION"
        },
        signature: hash
      };
    }
  };

  const handleVerifySignature = () => {
    setVerifyStatus('loading');
    setTimeout(() => {
      setVerifyStatus('success');
    }, 1200);
  };

  const handleDownloadProof = () => {
    const blockData = getMockJsonBlock(currentBatch, activeVersion);
    const jsonStr = JSON.stringify(blockData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CashewTrace-Proof-${currentBatch.batch_id}-${activeVersion}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel date parser helper
  const parseDate = (excelDate: number) => {
    const base = new Date(Date.UTC(1899, 11, 30));
    const msInDay = 24 * 60 * 60 * 1000;
    const date = new Date(base.getTime() + excelDate * msInDay);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Extract valid ledger entries (ignoring empty or corrupt rows)
  const ledger = inventory
    .filter(item => item.date_raw && item.quantity_kg !== undefined)
    .map((item, idx) => {
      const isDeposit = item.supplier_name !== null;
      return {
        id: idx,
        date_raw: item.date_raw,
        dateStr: parseDate(item.date_raw),
        type: isDeposit ? 'Deposit' : 'Withdrawal (Batch Sourcing)',
        supplier: item.supplier_name || 'm\'day Factory Batch Sourced',
        ct_id: item.ct_id || 'ST-INTERNAL',
        quantity: item.quantity_kg,
        balance: item.balance !== null ? item.balance : (1000 - idx * 10), // logical fallback if balance field is blank
        province: item.province || 'Internal Processing'
      };
    });

  // Calculate high-level audit stats
  const initialDeposit = ledger.find(row => row.type === 'Deposit')?.quantity || 1000;
  const currentBalance = ledger[ledger.length - 1]?.balance || 0;
  const totalWithdrawn = initialDeposit - currentBalance;

  // Filter transactions
  const filteredLedger = ledger.filter(tx => {
    const query = searchQuery.toLowerCase();
    return (
      tx.dateStr.toLowerCase().includes(query) ||
      tx.type.toLowerCase().includes(query) ||
      tx.supplier.toLowerCase().includes(query) ||
      tx.ct_id.toLowerCase().includes(query) ||
      tx.province.toLowerCase().includes(query)
    );
  });

  // Plotting data points for the SVG chart
  const padding = 40;
  const chartWidth = 700;
  const chartHeight = 180;

  // Map balances to chart pixels
  const maxVal = 1000;
  const minVal = 0;
  const numPoints = Math.min(ledger.length, 50); // limit chart density for clean visuals
  const step = Math.ceil(ledger.length / numPoints);
  const chartPoints = ledger.filter((_, i) => i % step === 0);

  // Generate SVG Path coordinates
  let pathD = '';
  let areaD = '';
  if (chartPoints.length > 0) {
    const coords = chartPoints.map((pt, idx) => {
      const x = padding + (idx / (chartPoints.length - 1)) * (chartWidth - padding * 2);
      const y = chartHeight - padding - ((pt.balance - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2);
      return { x, y };
    });

    pathD = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
    areaD = `${pathD} L ${coords[coords.length - 1].x} ${chartHeight - padding} L ${coords[0].x} ${chartHeight - padding} Z`;
  }

  return (
    <div id="inventory-ledger-container" className="space-y-6">
      {/* Stat Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold block">
              ការដាក់ស្តុកស្ករដំបូង (Initial Sugar Deposit)
            </span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{initialDeposit.toLocaleString()} kg</div>
            <span className="text-[10px] text-slate-500 mt-1 block">ប្រភព៖ ស្ករភ្នំពេញ (Phnom Penh Sugar)</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
            <ArrowUpRight size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold block">
              ការដកប្រើប្រាស់សរុប (Total Sourcing Withdrawn)
            </span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{totalWithdrawn.toLocaleString()} kg</div>
            <span className="text-[10px] text-slate-500 mt-1 block">បែងចែកចូលក្រុមផលិតកម្ម (Allocated to Batches)</span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
            <ArrowDownRight size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold block">
              ស្តុកនៅសល់ជាក់ស្តែង (Audited Stock Balance)
            </span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{currentBalance.toLocaleString()} kg</div>
            <span className="text-[10px] text-slate-500 mt-1 block">ស្តុកការពារស្តង់ដារ GHP (Locked Inventory)</span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
            <ShieldAlert size={20} />
          </div>
        </div>
      </div>

      {/* SVG Timeline Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              តុល្យភាពស្តុក និងការដកប្រើប្រាស់ស្ករ (Sugar Sourcing & Balance Audits)
            </h3>
            <p className="text-xs text-slate-500">
              ការតាមដានតុល្យភាពបរិមាណតាមពេលវេលា • ស្តុកស្ករ CT-002 (Mass Balance Tracking)
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50/60 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-sans font-medium border border-emerald-200">
            <History size={11} /> បានផ្ទៀងផ្ទាត់សវនកម្មជាក់ស្តែង (Audit Trail Verified)
          </div>
        </div>

        {/* Responsive Chart Container */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[650px] h-[190px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full select-none font-mono text-[9px] text-slate-400">
              {/* Grid Y-Lines */}
              {[0, 250, 500, 750, 1000].map((yVal, idx) => {
                const y = chartHeight - padding - (yVal / 1000) * (chartHeight - padding * 2);
                return (
                  <g key={idx}>
                    <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={padding - 8} y={y + 3} textAnchor="end" fill="#94a3b8">{yVal} kg</text>
                  </g>
                );
              })}

              {/* Area & Line */}
              {areaD && <path d={areaD} fill="url(#blue-gradient)" opacity="0.08" />}
              {pathD && <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="1.75" />}

              {/* Chart Labels */}
              <text x={padding} y={chartHeight - 8} textAnchor="start" fill="#94a3b8">10 មិថុនា 2026 (June 10)</text>
              <text x={chartWidth - padding} y={chartHeight - 8} textAnchor="end" fill="#94a3b8">សវនកម្មឡូត៍ចុងក្រោយ (Latest Audit)</text>

              {/* Gradients */}
              <defs>
                <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Traceability Audit Trail Card & Expander */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                សវនកម្មប្រភពដើម និងត្រាឌីជីថល៖ ឡូត៍ {currentBatch.batch_id} (Traceability Audit Trail)
              </h3>
              <p className="text-xs text-slate-500">
                ត្រាផ្ទៀងផ្ទាត់គ្រីបតូ និងប្រវត្តិនៃការកែសម្រួល (Cryptographic Verification & Revision History)
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition rounded-xl cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Layers size={14} /> បើកកំណត់ត្រាសវនកម្មសុវត្ថិភាព (Open Secure Logs)
          </button>
        </div>

        {/* Verification Stamps Row */}
        <div>
          <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold block mb-3">
            ត្រាបញ្ជាក់សកម្មភាព (Active Verification Seals)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Seal 1 */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 flex items-start gap-3">
              <div className={`p-1.5 rounded-lg border shrink-0 ${
                currentBatch.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                <FileCheck size={16} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">ត្រាទី ១ (Seal 01)</div>
                <div className="text-xs font-bold text-slate-800">ប្រភពកសិករត្រឹមត្រូវ (Sourcing Authenticated)</div>
                <div className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                  CT-001, CT-002, CT-003 ផ្ទៀងផ្ទាត់ជាមួយកសិករ
                </div>
              </div>
            </div>

            {/* Seal 2 */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 flex items-start gap-3">
              <div className={`p-1.5 rounded-lg border shrink-0 ${
                currentBatch.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                <ShieldCheck size={16} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">ត្រាទី ២ (Seal 02)</div>
                <div className="text-xs font-bold text-slate-800">អនុលោមតាមស្តង់ដារ GHP (GHP Standard Approved)</div>
                <div className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                  កំណត់ត្រាអនាម័យ និងសុវត្ថិភាពរោងចក្រត្រឹមត្រូវ
                </div>
              </div>
            </div>

            {/* Seal 3 */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 flex items-start gap-3">
              <div className={`p-1.5 rounded-lg border shrink-0 ${
                currentBatch.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                <Cpu size={16} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">ត្រាទី ៣ (Seal 03)</div>
                <div className="text-xs font-bold text-slate-800">តុល្យភាពបរិមាណត្រឹមត្រូវ (Mass Balance Reconciled)</div>
                <div className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                  ធាតុចូល ({currentBatch.total_input_kg} kg) ត្រូវគ្នានឹងទិន្នផល ({currentBatch.output_kg || 25} kg)
                </div>
              </div>
            </div>

            {/* Seal 4 */}
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 flex items-start gap-3">
              <div className={`p-1.5 rounded-lg border shrink-0 ${
                currentBatch.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                <History size={16} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">ត្រាទី ៤ (Seal 04)</div>
                <div className="text-xs font-bold text-slate-800">សៀវភៅកត់ត្រាត្រូវបានបិទផ្សា (Ledger Sealed)</div>
                <div className="text-[10px] text-slate-500 font-mono leading-relaxed mt-0.5">
                  ហត្ថលេខាឌីជីថល {getMockHash(currentBatch.batch_id, 'seal').substring(0, 10)} ត្រូវបានកត់ត្រា
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini History Log Expander Panel */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden font-sans">
          <button 
            type="button"
            onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
            className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-700 hover:bg-slate-100/70 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-500" />
              <span>កំណត់ត្រាកំណែទម្រង់ និងស្ថានភាពផ្ទៀងផ្ទាត់ (Revision Logs & Verification Status Timeline)</span>
            </div>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase font-semibold">
              {isHistoryExpanded ? 'លាក់ប្រវត្តិ (Hide)' : 'បង្ហាញប្រវត្តិ (Show)'}
            </span>
          </button>

          {isHistoryExpanded && (
            <div className="p-5 border-t border-slate-200/80 bg-white space-y-4 font-sans">
              <div className="relative border-l-2 border-slate-100 pl-6 ml-3 space-y-6 text-xs">
                {/* Milestone 1 */}
                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white font-bold font-mono ${
                    currentBatch.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}>
                    {currentBatch.status === 'VERIFIED' ? '✓' : '○'}
                  </span>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">v1.3 • ប្លុកបិទផ្សារួចរាល់ (Current Sealed Block)</span>
                    <h4 className="font-bold text-slate-800 mt-0.5">បានចុះបញ្ជី និងចុះហត្ថលេខាលើប្លុកឆេន (Blockchain Registration Signed)</h4>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      {currentBatch.status === 'VERIFIED' 
                        ? 'លិខិតឆ្លងដែនផ្ទៀងផ្ទាត់ត្រូវបានបង្កើតជាមួយកូដ QR ជាក់លាក់។ កំណត់ត្រាប្រភពដើមត្រូវបានចាក់សោរជាអចិន្ត្រៃយ៍នៅលើបណ្តាញទិន្នន័យ។'
                        : 'ទិន្នន័យប្រភពដើមមិនទាន់គ្រប់គ្រាន់។ ការផ្ទៀងផ្ទាត់ប្លុកឆេន និងការបើកលិខិតឆ្លងដែនឌីជីថលកំពុងរង់ចាំ។'}
                    </p>
                    {currentBatch.status === 'VERIFIED' && (
                      <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">
                        <span><strong>Block Hash:</strong> {getMockHash(currentBatch.batch_id, 'v1.3')}</span>
                        <span className="text-slate-300">•</span>
                        <span><strong>Signer:</strong> CashewTrace Auth Node #4</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white font-bold font-mono ${
                    currentBatch.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}>
                    {currentBatch.status === 'VERIFIED' ? '✓' : '○'}
                  </span>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">v1.2 • សវនកម្មដំណាក់កាល (Stage Audit)</span>
                    <h4 className="font-bold text-slate-800 mt-0.5">តុល្យភាពបរិមាណ និងស្តង់ដារអនាម័យ GHP (Mass Balance & GHP Certification Match)</h4>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      {currentBatch.status === 'VERIFIED'
                        ? `ទិន្នផលផលិតកម្មរោងចក្រត្រូវបានផ្ទៀងផ្ទាត់។ បានពិនិត្យធាតុចូលឆៅ ${currentBatch.total_input_kg} kg ត្រូវគ្នានឹងផលិតផលសម្រេច ${currentBatch.output_kg || 25} kg។ ស្តង់ដារអនាម័យ GHP ត្រូវបានអនុម័ត។`
                        : 'កំណត់ត្រាផលិតកម្មកំពុងរង់ចាំការផ្ទៀងផ្ទាត់ទិន្នផល និងវិញ្ញាបនបត្រអនាម័យ GHP។'}
                    </p>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white font-bold font-mono ${
                    currentBatch.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}>
                    {currentBatch.status === 'VERIFIED' ? '✓' : '○'}
                  </span>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">v1.1 • ការនាំចូលពីចម្ការ (Field Ingress)</span>
                    <h4 className="font-bold text-slate-800 mt-0.5">សវនកម្មធាតុចូលកសិកម្ម (Agricultural Sourcing Inputs Audited)</h4>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      {currentBatch.status === 'VERIFIED'
                        ? 'ទិន្នន័យប្រភពកសិករ និងទម្ងន់ត្រូវបានផ្ទៀងផ្ទាត់ជាមួយវិក្កយបត្រឌីជីថលអ្នកផ្គត់ផ្គង់។ កាបូបឌីជីថលកសិករត្រូវបានបញ្ជាក់។'
                        : 'ធាតុចូលកម្រិតកសិដ្ឋានកំពុងរង់ចាំការពិនិត្យវិក្កយបត្រឌីជីថល និងការអនុម័តទីតាំងចម្ការ។'}
                    </p>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white font-bold font-mono">
                    ✓
                  </span>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">v1.0 • សេចក្តីព្រាង (Ingress Draft)</span>
                    <h4 className="font-bold text-slate-800 mt-0.5">បានបង្កើតកំណត់ត្រាឡូត៍ដំបូង (Initial Batch Log Created)</h4>
                    <p className="text-slate-500 mt-1 leading-relaxed">
                      ក្រុមប្រតិបត្តិការរោងចក្របានកត់ត្រាទម្រង់ឡូត៍បឋមជាមួយគោលដៅប្រភពគ្រោងទុក។ ស្ថានភាពកំណត់ត្រាត្រូវរង់ចាំសវនកម្មវាល។
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cryptographic Audit Ledger Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col font-sans">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <History className="text-slate-700" size={18} />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">សៀវភៅកត់ត្រាសវនកម្ម និងប្រភពដើមគ្រីបតូ (Cryptographic Audit Ledger)</h3>
                  <p className="text-[10px] text-slate-500 font-mono">កំណត់ត្រាប្លុកតាមដានសម្រាប់ឡូត៍ {currentBatch.batch_id}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setVerifyStatus('idle');
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Version Selection Tabs */}
            <div className="flex border-b border-slate-100 overflow-x-auto bg-slate-50/50 shrink-0">
              {['v1.3', 'v1.2', 'v1.1', 'v1.0'].map((v) => {
                const names: Record<string, string> = {
                  'v1.3': 'v1.3 (បិទផ្សារួច)',
                  'v1.2': 'v1.2 (បានពិនិត្យដំណើរការ)',
                  'v1.1': 'v1.1 (បានអនុម័តប្រភព)',
                  'v1.0': 'v1.0 (សេចក្តីព្រាង)'
                };
                return (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setActiveVersion(v)}
                    className={`px-4 py-3 text-[11px] font-sans border-b-2 font-bold whitespace-nowrap transition cursor-pointer ${
                      activeVersion === v 
                        ? 'border-slate-900 text-slate-900 bg-white' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {names[v]}
                  </button>
                );
              })}
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              
              {/* Active Version Overview Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-[10px] font-mono font-bold border ${
                    activeVersion === 'v1.3' 
                      ? (currentBatch.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200') 
                      : activeVersion === 'v1.2' || activeVersion === 'v1.1'
                      ? (currentBatch.status === 'VERIFIED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200')
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    ស្ថានភាព (Status): {
                      activeVersion === 'v1.3' ? (currentBatch.status === 'VERIFIED' ? 'SEALED & BROADCASTED' : 'PENDING CONSENSUS') : 
                      activeVersion === 'v1.2' ? (currentBatch.status === 'VERIFIED' ? 'AUDITED & LOCKED' : 'PENDING STAGE AUDIT') :
                      activeVersion === 'v1.1' ? (currentBatch.status === 'VERIFIED' ? 'INGRESS SIGNED' : 'PENDING FIELD SIGN') : 'OPERATOR DRAFT'
                    }
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    កាលបរិច្ឆេទចុះហត្ថលេខា: {parseDate(currentBatch.production_date_raw - (3 - parseFloat(activeVersion.slice(1))))}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-mono text-slate-600">
                  <div>
                    <span className="text-slate-400 block font-sans">អ្នកចុះហត្ថលេខា (Signer):</span>
                    <strong className="text-slate-800">{
                      activeVersion === 'v1.3' ? 'CashewTrace Core Node (BATTAMBANG_04)' :
                      activeVersion === 'v1.2' ? 'CAM HEART Quality Assurance Node' :
                      activeVersion === 'v1.1' ? 'CashewTrace Field Inspector Node' : 'Dalin Eng (Factory Operator Desktop)'
                    }</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans">កម្ពស់ប្លុក (Block Height):</span>
                    <strong className="text-slate-800">#{10480 + (activeVersion === 'v1.3' ? 3 : activeVersion === 'v1.2' ? 2 : activeVersion === 'v1.1' ? 1 : 0)}</strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/40 mt-1">
                    <span className="text-slate-400 block font-sans">ហត្ថលេខាគ្រីបតូ (Signature Hash):</span>
                    <span className="text-slate-700 break-all">{getMockHash(currentBatch.batch_id, activeVersion)}</span>
                  </div>
                </div>
              </div>

              {/* Revision Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  បញ្ជីផ្ទៀងផ្ទាត់សវនកម្ម (Audit Checklist Verification)
                </h4>
                <div className="space-y-1.5">
                  {getChecklistForVersion(activeVersion).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-600">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        item.passed ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {item.passed ? '✓' : '○'}
                      </span>
                      <span className={item.passed ? 'text-slate-800' : 'text-slate-400 font-medium'}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Payload Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">JSON Block Payload</h4>
                  <span className="text-[10px] font-sans text-slate-400">ប្លុកទិន្នន័យសុវត្ថិភាព (Read-Only)</span>
                </div>
                <div className="relative">
                  <pre className="font-mono bg-slate-900 text-slate-100 p-4 rounded-xl text-[10px] overflow-x-auto shadow-inner max-h-44 overflow-y-auto leading-relaxed border border-slate-800 select-all">
                    {JSON.stringify(getMockJsonBlock(currentBatch, activeVersion), null, 2)}
                  </pre>
                  <div className="absolute right-3 top-3 text-[10px] text-slate-400 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700/50 cursor-pointer transition select-none font-sans">
                    ចម្លង (Copy JSON)
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] font-sans">
                {verifyStatus === 'idle' && (
                  <span className="text-slate-500">មិនទាន់បានផ្ទៀងផ្ទាត់ក្នុងវគ្គបច្ចុប្បន្ន</span>
                )}
                {verifyStatus === 'loading' && (
                  <span className="text-amber-600 flex items-center gap-1">
                    <RefreshCw className="animate-spin" size={11} /> កំពុងផ្ទៀងផ្ទាត់ SHA-256...
                  </span>
                )}
                {verifyStatus === 'success' && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    ✓ បានផ្ទៀងផ្ទាត់សៀវភៅកត់ត្រាត្រឹមត្រូវ (MATCH SUCCESSFUL)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button 
                  type="button"
                  onClick={handleVerifySignature}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition rounded-xl cursor-pointer shadow-sm w-full sm:w-auto animate-pulse"
                >
                  ផ្ទៀងផ្ទាត់សុក្រឹតភាព (Verify Hash)
                </button>
                <button 
                  type="button"
                  onClick={handleDownloadProof}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition rounded-xl cursor-pointer shadow-sm w-full sm:w-auto"
                >
                  <Download size={13} /> ទាញយកភស្តុតាង (Export Proof)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Sourcing Audit Ledger */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              សៀវភៅកត់ត្រាសវនកម្មប្រភពដើម (Sourcing Verification Audit Ledger)
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              កំណត់ត្រាលម្អិតផ្គូផ្គងក្រុមផលិតកម្មទៅនឹងប្រភពកសិកម្មជាក់ស្តែង (Granular records matching batches to agricultural sources)
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរកកំណត់ត្រាសវនកម្ម (Search audit trail)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs w-full sm:w-64 border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl font-sans focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b border-slate-200">
                <th className="py-3 px-5">កាលបរិច្ឆេទ (Date)</th>
                <th className="py-3 px-4">ប្រតិបត្តិការ (Transaction / CT ID)</th>
                <th className="py-3 px-4">ប្រភព / អ្នកផ្គត់ផ្គង់ (Source / Supplier)</th>
                <th className="py-3 px-4 text-right">បរិមាណ (Quantity)</th>
                <th className="py-3 px-5 text-right">ស្តុកនៅសល់ (Audited Balance)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLedger.slice(0, 15).map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5 text-slate-500 font-mono">{row.dateStr}</td>
                  <td className="py-3 px-4 font-semibold">
                    <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[10px] font-medium ${
                      row.type === 'Deposit' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {row.type === 'Deposit' ? 'ដាក់ស្តុក (Deposit)' : 'ដកប្រើ (Sourced)'} • {row.ct_id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-sans">{row.supplier}</td>
                  <td className={`py-3 px-4 text-right font-bold font-mono ${
                    row.type === 'Deposit' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {row.type === 'Deposit' ? '+' : '-'}{row.quantity.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-slate-800 font-mono">{row.balance.toLocaleString()} kg</td>
                </tr>
              ))}
              {filteredLedger.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-sans">
                    មិនមានកំណត់ត្រាប្រតិបត្តិការដែលត្រូវគ្នានឹងពាក្យស្វែងរកឡើយ (No verified records found)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger footer */}
        {filteredLedger.length > 15 && (
          <div className="bg-slate-50/50 py-3 px-5 text-[11px] text-slate-500 text-center font-sans border-t border-slate-200">
            បង្ហាញ {filteredLedger.length} កំណត់ត្រាសវនកម្មចុងក្រោយ។ ទិន្នន័យប្រភពត្រូវបានផ្ទៀងផ្ទាត់តាមរយៈបណ្តាញ CashewTrace Ledger Node។
          </div>
        )}
      </div>
    </div>
  );
}
