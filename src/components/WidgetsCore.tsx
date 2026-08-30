import { Cpu, HardDrive, Wifi, CloudSun, Bitcoin, Calendar, Music } from 'lucide-react';

const MOCK_WIDGETS = [
  {
    id: 1,
    name: 'Weather Node',
    icon: <CloudSun size={24} className="text-sky-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]" />,
    status: 'Synced',
    cpu: '1.2%',
    ram: '45 MB',
    net: '12 KB/s',
    isStandalone: true,
  },
  {
    id: 2,
    name: 'Crypto Ticker',
    icon: <Bitcoin size={24} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />,
    status: 'Synced',
    cpu: '3.5%',
    ram: '120 MB',
    net: '450 KB/s',
    isStandalone: true,
  },
  {
    id: 3,
    name: 'Timeline Agenda',
    icon: <Calendar size={24} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />,
    status: 'Decoupled', 
    cpu: '0.1%',
    ram: '12 MB',
    net: '0 KB/s',
    isStandalone: true,
  },
  {
    id: 4,
    name: 'Hyper Player',
    icon: <Music size={24} className="text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />,
    status: 'Synced',
    cpu: '8.4%',
    ram: '310 MB',
    net: '2.4 MB/s',
    isStandalone: false,
  }
];

export default function WidgetsCore() {
  return (
    <div className="animate-in fade-in duration-500 pt-4 pb-12">
      
      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* FIX: Exact same glassmorphism class as your Sidebar */}
        <div className="p-5 rounded-3xl bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-xl flex items-center justify-between transition-colors">
          <div>
            <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Total Widget CPU</p>
            <p className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">13.2%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
            <Cpu size={22} strokeWidth={2.5} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-xl flex items-center justify-between transition-colors">
          <div>
            <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Allocated RAM</p>
            <p className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">487 MB</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
            <HardDrive size={22} strokeWidth={2.5} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-xl flex items-center justify-between transition-colors">
          <div>
            <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1.5">Network Telemetry</p>
            <p className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">2.8 MB/s</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner">
            <Wifi size={22} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* --- WIDGETS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_WIDGETS.map((widget) => (
          <div 
            key={widget.id} 
            // FIX: Exact same glassmorphism class as your Sidebar
            className="p-5 rounded-[2rem] bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-xl flex flex-col group hover:-translate-y-1 hover:border-white/60 dark:hover:border-white/20 transition-all duration-300 relative overflow-hidden"
          >
            {/* Widget Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5 flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500 ease-out">
                {widget.icon}
              </div>
              <div className={`px-2.5 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 ${
                widget.status === 'Synced' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${widget.status === 'Synced' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {widget.status}
              </div>
            </div>

            {/* Widget Info */}
            <div className="mb-6 mt-auto">
              <h3 className="text-[17px] font-bold text-neutral-900 dark:text-white tracking-wide mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{widget.name}</h3>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {widget.isStandalone ? 'Independent Module' : 'Core Module'}
              </p>
            </div>

            {/* Granular Telemetry Box */}
            <div className="space-y-2.5 bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/30 dark:border-white/5 shadow-inner">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400"><Cpu size={14} className="opacity-70"/> CPU</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-mono tracking-wide">{widget.cpu}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400"><HardDrive size={14} className="opacity-70"/> RAM</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-mono tracking-wide">{widget.ram}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400"><Wifi size={14} className="opacity-70"/> Net</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-mono tracking-wide">{widget.net}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}