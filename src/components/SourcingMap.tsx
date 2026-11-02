import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRightLeft, ShieldCheck, Landmark } from 'lucide-react';
import { Supplier } from '../types';

interface SourcingMapProps {
  suppliers: Supplier[];
  activeSupplierId: string | null;
  onSelectSupplier: (id: string | null) => void;
}

export default function SourcingMap({
  suppliers,
  activeSupplierId,
  onSelectSupplier,
}: SourcingMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Stylized layout coords for the Cambodia map (width=500, height=420)
  const nodes = [
    {
      id: 'factory',
      name: "រោងចក្រ ម៉ាយ៉ានី Mayany Enterprise (Phnom Penh Hub)",
      type: 'processor',
      province: 'រាជធានីភ្នំពេញ (Phnom Penh)',
      x: 270,
      y: 275,
      description: 'មជ្ឈមណ្ឌលកែច្នៃសម្រិតសម្រាំង និងវេចខ្ចប់ស្តង់ដារ CS 001:2000 & GHP។ ទទួលគ្រាប់ស្វាយចន្ទីកែច្នៃ Grade BB ពី Myrarth Agri Tech និង TL Agri Food ដើម្បីដកប្រេងកិនជាម្សៅចន្ទីធម្មជាតិ ១០០% និងលីងស្រោបម្រេចកំពត GI ព្រមទាំងចេញប័ណ្ណសម្គាល់ QR Digital Passport។ (Secondary processing, defatting, milling into 100% natural Cashew Flour, roasting, CS 001 packaging, and issuance of QR Digital Passports).',
    },
    {
      id: 'CT-004',
      name: 'រោងចក្រកែច្នៃបឋម Myrarth Agri Tech Co., Ltd.',
      type: 'processor_partner',
      ingredient: 'គ្រាប់ស្វាយចន្ទីកែច្នៃ Grade BB (Baby Bits)',
      province: 'ខេត្តកំពង់ធំ (Kampong Thom)',
      x: 235,
      y: 175,
      description: 'រោងចក្រកែច្នៃស្វាយចន្ទីបឋមបច្ចេកវិទ្យាទំនើបធំជាងគេនៅខេត្តកំពង់ធំ។ ប្រមូលទិញគ្រាប់ឆៅ (RCN) ពីកសិករក្នុងស្រុក ឆ្លងកាត់ម៉ាស៊ីនចំហុយ បកសំបក បកស្រទាប់ស្តើង សម្ងួត និងបែងចែកទំហំ (Color Sorting) ផលិតបាន Grade BB ប្រកបដោយគុណភាពខ្ពស់ និងស្តង់ដារអនាម័យ។ (Modern industrial cashew primary processing plant in Kampong Thom. Shells RCN from local smallholders, steams, peels, sorts, and produces high-purity Grade BB Baby Bits).',
    },
    {
      id: 'CT-005',
      name: 'ក្រុមហ៊ុន TL Agri Food Import Export Co., Ltd.',
      type: 'processor_partner',
      ingredient: 'គ្រាប់ស្វាយចន្ទីកែច្នៃ Grade BB (Baby Bits)',
      province: 'រាជធានីភ្នំពេញ (Phnom Penh)',
      x: 320,
      y: 260,
      description: 'ក្រុមហ៊ុនកែច្នៃ និងនាំចេញកសិផលឈានមុខនៅកម្ពុជា។ ផ្ទៀងផ្ទាត់គុណភាព សំណើម និងផ្គត់ផ្គង់គ្រាប់ស្វាយចន្ទី Grade BB សម្រាប់ខ្សែច្រវាក់ផលិតកម្មម្សៅចន្ទី និងនំចំណីអាហារ។ (Leading Cambodian agricultural processor and exporter supplying sorted, audited Grade BB cashew kernels).',
    },
    {
      id: 'CT-006',
      name: 'សហគមន៍កសិករស្វាយចន្ទីខេត្តកំពង់ធំ (Kampong Thom Farmers)',
      type: 'supplier',
      ingredient: 'គ្រាប់ស្វាយចន្ទីឆៅ (Raw Cashew Nut - RCN)',
      province: 'ខេត្តកំពង់ធំ (Kampong Thom)',
      x: 195,
      y: 120,
      description: 'បណ្តាញចម្ការកសិករខ្នាតតូច និងសហគមន៍កសិកម្មចន្ទីគំរូ (ស្រុកប្រាសាទសំបូរ កំពង់ស្វាយ សណ្តាន់)។ ប្រមូលផលតាមរដូវកាល កត់ត្រាជីធម្មជាតិ ទីតាំងកូអរដោនេ GPS និងលក់ត្រង់ជូនរោងចក្រ Myrarth Agri Tech។ (Smallholder cashew farmer network in Kampong Thom supplying verified RCN with GPS orchard coordinates).',
    },
    {
      id: 'CT-007',
      name: 'សមាគមលើកកម្ពស់ម្រេចកំពត GI (Kampot GI Pepper)',
      type: 'supplier',
      ingredient: 'ម្រេចខ្មៅកំពតសរីរាង្គ GI YAS (GI Black Pepper)',
      province: 'ខេត្តកំពត (Kampot)',
      x: 190,
      y: 360,
      description: 'សហគមន៍កសិករដាំម្រេចកំពតសម្គាល់ភូមិសាស្ត្រទំនិញ (GI) ស្តង់ដារសរីរាង្គអន្តរជាតិ។ ផ្តល់ក្លិនឈ្ងុយពិសេសសម្រាប់លីងស្រោបគ្រាប់ស្វាយចន្ទី Mayany Enterprise។ (Certified Protected Geographical Indication organic black pepper cooperative).',
    }
  ];

  // Sourcing transport flows to the factory and between nodes
  const flows = [
    { from: 'CT-006', to: 'CT-004', color: '#10B981', label: 'គ្រាប់ឆៅ RCN (Farmers -> Myrarth Agri Tech)' },
    { from: 'CT-004', to: 'factory', color: '#F59E0B', label: 'គ្រាប់ BB Baby Bits (Myrarth -> Mayany)' },
    { from: 'CT-005', to: 'factory', color: '#3B82F6', label: 'គ្រាប់ BB Baby Bits (TL Agri Food -> Mayany)' },
    { from: 'CT-007', to: 'factory', color: '#8B5CF6', label: 'ម្រេចកំពត GI (Kampot -> Mayany)' },
  ];

  const getCoordinates = (id: string) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const selectedNode = nodes.find(n => n.id === activeSupplierId) || nodes.find(n => n.id === 'factory');

  return (
    <div id="sourcing-map-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm font-sans">
      <div id="map-visualization" className="lg:col-span-2 relative flex flex-col justify-between h-[450px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70 pointer-events-none" />
        
        {/* Header Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
            ផែនទីប្រភពដើមអន្តរកម្ម (Interactive Origin Map)
          </span>
          <span className="text-xs font-bold text-slate-950">
            បណ្តាញផ្គត់ផ្គង់កសិផលកម្ពុជា (Cambodia Sourcing Network)
          </span>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-sm text-[11px] font-sans">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>កសិករស្វាយចន្ទី - កំពង់ធំ (RCN Farmers)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Myrarth Agri Tech - កំពង់ធំ (Grade BB)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>TL Agri Food - ភ្នំពេញ (Grade BB)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>ម្រេចកំពត GI - កំពត (GI Pepper)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 border-t border-slate-200 pt-1.5 mt-1 font-bold">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-900 flex items-center justify-center text-[8px] text-amber-400 font-bold font-sans">M</span>
            <span>Mayany Enterprise - ភ្នំពេញ (Value-Add Hub)</span>
          </div>
        </div>

        {/* SVG Drawing Canvas */}
        <svg viewBox="0 0 500 420" className="w-full h-full select-none">
          {/* Cambodia Boundary Guideline (abstract minimalist shape) */}
          <path
            d="M 50 150 Q 150 50 250 80 Q 350 40 430 120 Q 480 200 450 300 Q 400 400 300 380 Q 200 410 120 350 Q 80 300 50 150 Z"
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Sourcing flow paths */}
          {flows.map((flow, idx) => {
            const start = getCoordinates(flow.from);
            const end = getCoordinates(flow.to);
            const isHighlighted = hoveredNode === flow.from || activeSupplierId === flow.from;
            return (
              <g key={idx}>
                {/* Background flow line */}
                <path
                  d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - 20} ${end.x} ${end.y}`}
                  fill="none"
                  stroke={flow.color}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  strokeOpacity={isHighlighted ? 0.8 : 0.3}
                  className="transition-all duration-300"
                />
                {/* Animated dash flow */}
                <path
                  d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - 20} ${end.x} ${end.y}`}
                  fill="none"
                  stroke={flow.color}
                  strokeWidth={isHighlighted ? 3.5 : 2}
                  strokeDasharray="6 6"
                  strokeOpacity={isHighlighted ? 0.9 : 0.6}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="36;0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            );
          })}

          {/* Interactive Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            const isSelected = activeSupplierId === node.id;
            const isProcessor = node.type === 'processor';
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectSupplier(isProcessor ? null : node.id)}
              >
                {/* Highlight Glow Ring */}
                {(isHovered || isSelected) && (
                  <circle
                    r={isProcessor ? 24 : 18}
                    fill={isProcessor ? 'rgba(30, 41, 59, 0.1)' : 'rgba(16, 185, 129, 0.15)'}
                    className="transition-all duration-200"
                  />
                )}

                {/* Base Node Pin */}
                {isProcessor ? (
                  <g>
                    <circle r="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="#f59e0b"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      M
                    </text>
                  </g>
                ) : (
                  <circle
                    r={node.type === 'processor_partner' ? 11 : 9}
                    fill={
                      node.id === 'CT-006'
                        ? '#10b981'
                        : node.id === 'CT-004'
                        ? '#f59e0b'
                        : node.id === 'CT-005'
                        ? '#3b82f6'
                        : node.id === 'CT-007'
                        ? '#8b5cf6'
                        : '#10b981'
                    }
                    stroke="#fff"
                    strokeWidth="2"
                  />
                )}

                {/* Label Overlay */}
                <text
                  y={isProcessor ? -22 : -15}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="10"
                  fontWeight={(isHovered || isSelected) ? 'bold' : '600'}
                  fontFamily="sans-serif"
                  className="pointer-events-none transition-all duration-200"
                >
                  {node.id === 'factory' 
                    ? 'Mayany (ភ្នំពេញ)' 
                    : node.id === 'CT-004'
                    ? 'Myrarth (កំពង់ធំ)'
                    : node.id === 'CT-005'
                    ? 'TL Agri (ភ្នំពេញ)'
                    : node.id === 'CT-006'
                    ? 'កសិករចន្ទី (កំពង់ធំ)'
                    : node.id === 'CT-007'
                    ? 'ម្រេច GI (កំពត)'
                    : node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Supplier Profile Panel */}
      <div id="supplier-profile-panel" className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 pt-6 lg:pt-0 font-sans">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {selectedNode.type === 'processor' ? (
                <div className="bg-slate-900 text-white p-2 rounded-lg">
                  <Landmark size={18} />
                </div>
              ) : (
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                  <MapPin size={18} />
                </div>
              )}
              <div>
                <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold block">
                  {selectedNode.type === 'processor' ? 'មជ្ឈមណ្ឌលកែច្នៃកណ្តាល (Central Processing Hub)' : 'ប្រភពវត្ថុធាតុដើមកសិកម្ម (Verified Raw Sourcing)'}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {selectedNode.name}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-3">
              <p>{selectedNode.description}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-[11px]">
                <div>
                  <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-sans">ទីតាំង (Location)</span>
                  <span className="text-slate-800 font-semibold">{selectedNode.province}</span>
                </div>
                {selectedNode.ingredient && (
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-sans">វត្ថុធាតុដើមផ្គត់ផ្គង់ (Material)</span>
                    <span className="text-emerald-600 font-semibold">{selectedNode.ingredient}</span>
                  </div>
                )}
                {(selectedNode.type === 'processor' || selectedNode.type === 'processor_partner') && (
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-sans">ស្ថានភាព (Status)</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      <ShieldCheck size={12} className="inline" /> 
                      {selectedNode.type === 'processor' ? 'GHP & CS 001 Certified' : 'HACCP / GHP Primary Processor'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-sans">
            {selectedNode.type !== 'processor' ? (
              <button
                onClick={() => onSelectSupplier(null)}
                className="w-full py-2.5 px-4 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium rounded-xl transition duration-150 flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
              >
                <ArrowRightLeft size={14} /> ត្រឡប់ទៅមជ្ឈមណ្ឌលកណ្តាល (Back to Central Hub)
              </button>
            ) : (
              <div className="text-[11px] text-slate-500 text-center italic leading-normal">
                ចុចលើចំណុចកសិដ្ឋានណាមួយនៅលើផែនទី ឬជ្រើសរើសអ្នកផ្គត់ផ្គង់ខាងក្រោម ដើម្បីស្វែងយល់ពីប្រវត្តិ និងលិខិតឆ្លងដែនតាមដានប្រភពដើម។ (Click on any farm node in the map to explore direct traceability).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
