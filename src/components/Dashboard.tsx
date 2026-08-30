import { Activity, Cpu, HardDrive, Zap, Settings, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Dashboard() {
  const { environmentName, setActiveTab } = useAppStore();

  return (
    <div className="flex flex-col gap-6 h-full pb-4">
      {/* Dashboard Header with Top-Right Settings Icon */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Active Workspace</p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{environmentName}</h3>
        </div>
        <button 
          onClick={() => setActiveTab('Node Settings')}
          className="p-2 rounded-xl bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-slate-200 dark:border-white/[0.06] transition-colors shadow-sm flex items-center justify-center"
          title="Node Settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Clean Metric Grid (No heavy boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<Cpu size={18} />} label="Core Processor" value="ARM64 Oryon" status="Optimal" />
        <MetricCard icon={<Activity size={18} />} label="System Load" value="1.42 GHz" status="Stable" />
        <MetricCard icon={<HardDrive size={18} />} label="Memory Usage" value="12.4 / 32 GB" status="38%" />
        <MetricCard icon={<Zap size={18} />} label="Node Efficiency" value="99.8%" status="Active" />
      </div>

      {/* Quick Diagnostics Section */}
      <div className="mt-2">
        <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider mb-3">Quick Diagnostics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setActiveTab('Processes')}
            className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/[0.06] hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <Activity size={18} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Process Monitor</h5>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">View live system metrics & RAM consumption</p>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </div>

          <div 
            onClick={() => setActiveTab('Battery')}
            className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/[0.06] hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <Zap size={18} />
              </div>
              <div>
                <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Power & Battery</h5>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage power modes & efficiency states</p>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, status }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/[0.06] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300">{icon}</span>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">{status}</span>
      </div>
      <div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">{label}</p>
        <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{value}</h4>
      </div>
    </div>
  );
}