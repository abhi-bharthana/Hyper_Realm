import { Activity, Cpu, HardDrive, Zap, Settings, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Dashboard() {
  const { environmentName, setActiveTab } = useAppStore();

  return (
    <div className="flex flex-col gap-[1.5rem] h-full pb-[1rem]">
      {/* Dashboard Header with Top-Right Settings Icon */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[0.25rem]">
          <p className="text-[0.75em] font-mono text-zinc-500 uppercase tracking-widest leading-tight">Active Workspace</p>
          <h3 className="text-[1.8em] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">{environmentName}</h3>
        </div>
        
        <button 
          onClick={() => setActiveTab('Node Settings')}
          className="p-[0.75rem] rounded-[1rem] bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-slate-200 dark:border-white/[0.06] transition-all duration-300 shadow-sm flex items-center justify-center hover:-translate-y-[0.2rem] active:scale-95 group"
          title="Node Settings"
        >
          <Settings className="w-[1.2rem] h-[1.2rem] group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Clean Metric Grid Scaled */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1rem]">
        <MetricCard icon={<Cpu className="w-[1.2rem] h-[1.2rem]" />} label="Core Processor" value="ARM64 Oryon" status="Optimal" />
        <MetricCard icon={<Activity className="w-[1.2rem] h-[1.2rem]" />} label="System Load" value="1.42 GHz" status="Stable" />
        <MetricCard icon={<HardDrive className="w-[1.2rem] h-[1.2rem]" />} label="Memory Usage" value="12.4 / 32 GB" status="38%" />
        <MetricCard icon={<Zap className="w-[1.2rem] h-[1.2rem]" />} label="Node Efficiency" value="99.8%" status="Active" />
      </div>

      {/* Quick Diagnostics Section */}
      <div className="mt-[0.5rem]">
        <h4 className="text-[0.8em] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-[1rem]">Quick Diagnostics</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
          <div 
            onClick={() => setActiveTab('Processes')}
            className="p-[1rem] rounded-[1.25rem] bg-white/40 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/[0.06] hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-[1rem]">
              <div className="p-[0.7rem] rounded-[1rem] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform">
                <Activity className="w-[1.4rem] h-[1.4rem]" />
              </div>
              <div className="flex flex-col gap-[0.2rem]">
                <h5 className="font-bold text-[0.9em] text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">Process Monitor</h5>
                <p className="text-[0.75em] text-zinc-500 dark:text-zinc-400">View live system metrics & RAM consumption</p>
              </div>
            </div>
            <ArrowUpRight className="w-[1.2rem] h-[1.2rem] text-zinc-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-[0.2rem] group-hover:-translate-y-[0.2rem]" />
          </div>

          <div 
            onClick={() => setActiveTab('Battery')}
            className="p-[1rem] rounded-[1.25rem] bg-white/40 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/[0.06] hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-[1rem]">
              <div className="p-[0.7rem] rounded-[1rem] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform">
                <Zap className="w-[1.4rem] h-[1.4rem]" />
              </div>
              <div className="flex flex-col gap-[0.2rem]">
                <h5 className="font-bold text-[0.9em] text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">Power & Battery</h5>
                <p className="text-[0.75em] text-zinc-500 dark:text-zinc-400">Manage power modes & efficiency states</p>
              </div>
            </div>
            <ArrowUpRight className="w-[1.2rem] h-[1.2rem] text-zinc-400 group-hover:text-emerald-500 transition-colors group-hover:translate-x-[0.2rem] group-hover:-translate-y-[0.2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, status }: any) {
  return (
    <div className="p-[1.2rem] rounded-[1.25rem] bg-white/40 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/[0.06] flex flex-col justify-between hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.05)] dark:hover:shadow-none transition-shadow group">
      <div className="flex items-center justify-between mb-[1rem]">
        <span className="p-[0.6rem] rounded-[0.8rem] bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <span className="text-[0.65em] font-mono font-bold px-[0.6rem] py-[0.2rem] rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_1rem_rgba(16,185,129,0.1)]">
          {status}
        </span>
      </div>
      <div className="flex flex-col gap-[0.25rem]">
        <p className="text-[0.75em] font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
        <h4 className="text-[1.2em] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{value}</h4>
      </div>
    </div>
  );
}