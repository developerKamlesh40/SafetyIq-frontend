import { Search, ChevronLeft, ChevronRight, Filter, Map, Layers } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  layers: Record<string, boolean>;
  toggleLayer: (key: string) => void;
  viewMode: 'satellite' | 'heatmap' | 'activity';
  setViewMode: (mode: 'satellite' | 'heatmap' | 'activity') => void;
  floor: number;
  setFloor: (floor: number) => void;
}

const CATEGORIES = [
  { id: 'buildings', label: 'Buildings & Zones', color: '#0ea5e9' },
  { id: 'machines', label: 'Machinery', color: '#22c55e' },
  { id: 'workers', label: 'Personnel', color: '#38bdf8' },
  { id: 'vehicles', label: 'Vehicles & AGVs', color: '#a855f7' },
  { id: 'sensors', label: 'IoT Sensors', color: '#f97316' },
  { id: 'safety', label: 'Safety Equipment', color: '#ef4444' },
];

export default function MapGenieSidebar({ layers, toggleLayer, viewMode, setViewMode, floor, setFloor }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState('');

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-[1000] bg-[#1a1f2e] border border-gray-700 p-2.5 rounded-lg text-white hover:bg-gray-800 shadow-xl transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-[#161b22]/95 backdrop-blur-md border-r border-gray-800 shadow-2xl z-[1000] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0d1117]">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Map className="w-5 h-5 text-cyan-400" /> Plant Navigator
        </h2>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search locations, machines..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder-gray-600 transition-colors"
          />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="p-4 border-b border-gray-800">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">View Mode</p>
        <div className="flex flex-col gap-2">
          <div className="flex bg-[#0d1117] rounded-lg p-1 border border-gray-800">
            <button 
              onClick={() => setViewMode('satellite')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'satellite' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Blueprint
            </button>
            <button 
              onClick={() => setViewMode('heatmap')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'heatmap' ? 'bg-red-500/20 text-red-400 shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Heatmap
            </button>
            <button 
              onClick={() => setViewMode('activity')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'activity' ? 'bg-purple-500/20 text-purple-400 shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Activity Map
            </button>
          </div>

          {viewMode === 'activity' && (
            <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg animate-fade-in">
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">RUview Active</p>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>Real-time Utilization View</strong> monitors area activity and density using IoT telemetry and RF positioning—providing complete operational awareness without the privacy limitations of CCTV cameras.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floor Selector */}
      <div className="p-4 border-b border-gray-800">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Floor Level</p>
        <div className="flex gap-2">
          {[{id:0, label:'Ground'}, {id:1, label:'Mezzanine'}, {id:2, label:'Upper'}].map(f => (
            <button
              key={f.id}
              onClick={() => setFloor(f.id)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${floor === f.id ? 'bg-cyan-500 border-cyan-400 text-[#020608] shadow-[0_0_10px_rgba(0,212,255,0.3)]' : 'bg-[#0d1117] border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories / Filters */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
            <Filter className="w-3 h-3" /> Filters
          </p>
          <button 
            onClick={() => {
              const allOn = Object.values(layers).every(v => v);
              CATEGORIES.forEach(c => {
                if (layers[c.id] === allOn) toggleLayer(c.id);
              });
            }}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase"
          >
            Toggle All
          </button>
        </div>

        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => toggleLayer(cat.id)}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${layers[cat.id] !== false ? 'bg-gray-700 border-gray-500' : 'bg-transparent border-gray-600'}`}
                >
                  {layers[cat.id] !== false && <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: cat.color }} />}
                </div>
                <span className={`text-sm font-medium transition-colors ${layers[cat.id] !== false ? 'text-gray-200' : 'text-gray-500'}`}>
                  {cat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
