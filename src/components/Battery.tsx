import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { BatteryCharging, Battery as BatteryIcon, Zap, Clock, ShieldCheck, MonitorOff } from 'lucide-react';

interface BatteryData {
  level: number;
  charging: boolean;
  exists: boolean;
}

export default function Battery() {
  const [battery, setBattery] = useState<BatteryData>({ level: 0, charging: false, exists: true });

  useEffect(() => {
    const fetchBattery = async () => {
      try {
        const data: BatteryData = await invoke('get_battery_info');
        setBattery(data);
      } catch (error) {
        console.error("Failed to fetch battery info", error);
      }
    };
    fetchBattery();
    const interval = setInterval(fetchBattery, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!battery.exists) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-xl">
        <MonitorOff size={48} className="text-slate-400 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Battery Detected</h3>
        <p className="text-slate-500">Running on direct AC wall power.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="bg-white/60 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800">
          <div 
            className={`h-full transition-all duration-1000 ${battery.level <= 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
            style={{ width: `${battery.level}%` }}
          />
        </div>
        
        <div className="w-56 h-56 rounded-full border-[8px] border-slate-100 dark:border-slate-800/50 flex items-center justify-center relative shadow-inner mb-8">
          <div className={`absolute inset-0 rounded-full border-[8px] ${battery.level <= 20 ? 'border-rose-500' : 'border-emerald-500'} border-t-transparent animate-spin opacity-30`} />
          <div className="text-center">
            <h2 className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">{battery.level}%</h2>
            <p className={`font-medium text-sm mt-2 flex items-center justify-center ${battery.charging ? 'text-blue-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {battery.charging ? <Zap size={16} className="mr-1.5" /> : <BatteryIcon size={16} className="mr-1.5" />}
              {battery.charging ? 'AC Connected' : 'Discharging'}
            </p>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">ARM64 Power Node</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-xs">
          Live system telemetry active. {battery.charging ? 'Battery is replenishing.' : 'Optimized power delivery active.'}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <StatCard 
          icon={<Clock size={24} />}
          title="State"
          value={battery.charging ? "Charging" : "On Battery"}
          subtext="Real-time Windows WMI Hook"
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <StatCard 
          icon={<Zap size={24} />}
          title="Status"
          value={battery.level === 100 ? "Fully Charged" : "Active"}
          subtext="Monitoring local power delivery"
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
        <StatCard 
          icon={<ShieldCheck size={24} />}
          title="Hardware"
          value="Online"
          subtext="System Battery Controller"
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtext, color, bg }: any) {
  return (
    <div className="bg-white/60 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-xl flex items-center space-x-6 flex-1 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</h4>
        <p className="text-xs text-slate-400 mt-1 font-mono">{subtext}</p>
      </div>
    </div>
  );
}