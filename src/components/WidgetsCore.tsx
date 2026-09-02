import { Cpu, HardDrive, Wifi, CloudSun, Bitcoin, Calendar, Music } from 'lucide-react';

// MOCK_WIDGETS Icons upgraded to use rem classes instead of fixed sizes
const MOCK_WIDGETS = [
  {
    id: 1,
    name: 'Weather Node',
    icon: <CloudSun className="w-[1.5rem] h-[1.5rem] text-sky-500 drop-shadow-[0_0_0.5rem_rgba(14,165,233,0.4)]" />,
    status: 'Synced',
    cpu: '1.2%',
    ram: '45 MB',
    net: '12 KB/s',
    isStandalone: true,
  },
  {
    id: 2,
    name: 'Crypto Ticker',
    icon: <Bitcoin className="w-[1.5rem] h-[1.5rem] text-amber-500 drop-shadow-[0_0_0.5rem_rgba(245,158,11,0.4)]" />,
    status: 'Synced',
    cpu: '3.5%',
    ram: '120 MB',
    net: '450 KB/s',
    isStandalone: true,
  },
  {
    id: 3,
    name: 'Timeline Agenda',
    icon: <Calendar className="w-[1.5rem] h-[1.5rem] text-emerald-500 drop-shadow-[0_0_0.5rem_rgba(16,185,129,0.4)]" />,
    status: 'Decoupled', 
    cpu: '0.1%',
    ram: '12 MB',
    net: '0 KB/s',
    isStandalone: true,
  },
  {
    id: 4,
    name: 'Hyper Player',
    icon: <Music className="w-[1.5rem] h-[1.5rem] text-purple-500 drop-shadow-[0_0_0.5rem_rgba(168,85,247,0.4)]" />,
    status: 'Synced',
    cpu: '8.4%',
    ram: '310 MB',
    net: '2.4 MB/s',
    isStandalone: false,
  }
];

export default function WidgetsCore() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-[1rem] pb-[3rem]">
      
      {/* --- STATS OVERVIEW SCALED --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.25rem] mb-[2rem]">
        
        <div className="p-[1.25rem] rounded-[1.5rem] bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.05)] flex items-center justify-between transition-all duration-300 group">
          <div>
            <p className="text-[0.65em] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-[0.4rem]">Total Widget CPU</p>
            <p className="text-[1.8em] font-black text-neutral-900 dark:text-white tracking-tight leading-none group-hover:text-blue-500 transition-colors duration-300">13.2%</p>
          </div>
          <div className="w-[3rem] h-[3rem] rounded-[1rem] bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Cpu className="w-[1.4rem] h-[1.4rem]" strokeWidth={2.5} />
          </div>
        </div>

        <div className="p-[1.25rem] rounded-[1.5rem] bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.05)] flex items-center justify-between transition-all duration-300 group">
          <div>
            <p className="text-[0.65em] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-[0.4rem]">Allocated RAM</p>
            <p className="text-[1.8em] font-black text-neutral-900 dark:text-white tracking-tight leading-none group-hover:text-emerald-500 transition-colors duration-300">487 MB</p>
          </div>
          <div className="w-[3rem] h-[3rem] rounded-[1rem] bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <HardDrive className="w-[1.4rem] h-[1.4rem]" strokeWidth={2.5} />
          </div>
        </div>

        <div className="p-[1.25rem] rounded-[1.5rem] bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.05)] flex items-center justify-between transition-all duration-300 group">
          <div>
            <p className="text-[0.65em] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-[0.4rem]">Network Telemetry</p>
            <p className="text-[1.8em] font-black text-neutral-900 dark:text-white tracking-tight leading-none group-hover:text-purple-500 transition-colors duration-300">2.8 MB/s</p>
          </div>
          <div className="w-[3rem] h-[3rem] rounded-[1rem] bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <Wifi className="w-[1.4rem] h-[1.4rem]" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* --- WIDGETS GRID SCALED --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1.5rem]">
        {MOCK_WIDGETS.map((widget) => (
          <div 
            key={widget.id} 
            className="p-[1.25rem] rounded-[2rem] bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm flex flex-col group hover:-translate-y-[0.25rem] hover:shadow-[0_1rem_2.5rem_rgba(0,0,0,0.08)] dark:hover:shadow-[0_1rem_2.5rem_rgba(0,0,0,0.4)] hover:border-white/60 dark:hover:border-white/20 transition-all duration-500 relative overflow-hidden"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Widget Header */}
            <div className="flex items-start justify-between mb-[2rem] z-10">
              <div className="w-[3rem] h-[3rem] rounded-[1rem] bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/5 flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500 ease-out">
                {widget.icon}
              </div>
              <div className={`px-[0.6rem] py-[0.25rem] rounded-full border text-[0.6em] font-black tracking-widest uppercase flex items-center gap-[0.4rem] shadow-sm ${
                widget.status === 'Synced' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
                <div className={`w-[0.4rem] h-[0.4rem] rounded-full ${widget.status === 'Synced' ? 'bg-emerald-500 animate-pulse shadow-[0_0_0.5rem_#10b981]' : 'bg-amber-500'}`} />
                {widget.status}
              </div>
            </div>

            {/* Widget Info */}
            <div className="mb-[1.5rem] mt-auto z-10">
              <h3 className="text-[1.1em] font-bold text-neutral-900 dark:text-white tracking-wide mb-[0.25rem] group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{widget.name}</h3>
              <p className="text-[0.7em] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {widget.isStandalone ? 'Independent Module' : 'Core Module'}
              </p>
            </div>

            {/* Granular Telemetry Box */}
            <div className="space-y-[0.6rem] bg-white/40 dark:bg-white/5 p-[1rem] rounded-[1rem] border border-white/30 dark:border-white/5 shadow-inner z-10 transition-colors group-hover:bg-white/60 dark:group-hover:bg-white/10">
              <div className="flex items-center justify-between text-[0.75em] font-semibold">
                <span className="flex items-center gap-[0.5rem] text-neutral-500 dark:text-neutral-400"><Cpu className="w-[0.9rem] h-[0.9rem] opacity-70"/> CPU</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-mono tracking-wide">{widget.cpu}</span>
              </div>
              <div className="flex items-center justify-between text-[0.75em] font-semibold">
                <span className="flex items-center gap-[0.5rem] text-neutral-500 dark:text-neutral-400"><HardDrive className="w-[0.9rem] h-[0.9rem] opacity-70"/> RAM</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-mono tracking-wide">{widget.ram}</span>
              </div>
              <div className="flex items-center justify-between text-[0.75em] font-semibold">
                <span className="flex items-center gap-[0.5rem] text-neutral-500 dark:text-neutral-400"><Wifi className="w-[0.9rem] h-[0.9rem] opacity-70"/> Net</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-mono tracking-wide">{widget.net}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}