import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Zap, Leaf, Activity, Rocket, Cpu, Clock, Flame } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface BatteryData {
  percentage: number;
  state: string;
}

interface PowerTelemetry {
  current_wattage: number;
  session_draw_mah: number;
}

interface AppUsageStat {
  name: string;
  duration: string;
  powerDraw: string;
  iconColor: string;
}

type PowerMode = 'power_saver' | 'balanced' | 'high_performance';

export default function Battery() {
  const [battery, setBattery] = useState<BatteryData | null>(null);
  const [telemetry, setTelemetry] = useState<PowerTelemetry | null>(null);
  
  const { powerMode = 'balanced', setPowerMode } = useAppStore() as any; 
  const [isChangingMode, setIsChangingMode] = useState(false);

  // Simulated active apps power breakdown matrix (Ye state tere app manager ke sath sync hogi)
  const [appStats] = useState<AppUsageStat[]>([
    { name: 'HyperSurf Browser', duration: '1h 24m', powerDraw: '320 mAh (2.1W)', iconColor: 'text-blue-400' },
    { name: 'Video Player Engine', duration: '45m', powerDraw: '210 mAh (1.8W)', iconColor: 'text-purple-400' },
    { name: 'Hyper_Dashboard Core', duration: '3h 10m', powerDraw: '150 mAh (0.9W)', iconColor: 'text-emerald-400' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const batData: BatteryData = await invoke('get_battery_info');
        const telData: PowerTelemetry = await invoke('get_power_telemetry').catch(() => ({ current_wattage: 4.2, session_draw_mah: 280 }));
        setBattery(batData);
        setTelemetry(telData);
      } catch (error) {
        console.error("Failed to fetch power telemetry", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // 5s interval for telemetry
    return () => clearInterval(interval);
  }, []);

  const handleModeChange = async (mode: PowerMode) => {
    setIsChangingMode(true);
    try {
      await invoke('set_power_mode', { mode });
      if (setPowerMode) setPowerMode(mode);
    } catch (error) {
      console.error("Failed to set power mode", error);
    } finally {
      setIsChangingMode(false);
    }
  };

  const isCharging = battery?.state.includes("Charging") || battery?.state.includes("AC Power");

  const getLiquidColor = (percentage: number, charging: boolean) => {
    if (charging) return 'from-emerald-400 via-teal-500 to-emerald-600';
    if (percentage > 70) return 'from-emerald-500 to-teal-600';
    if (percentage > 30) return 'from-blue-500 to-indigo-600';
    if (percentage > 15) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-700 animate-pulse';
  };

  return (
    <div className="flex flex-col gap-4 h-full pb-4 px-4 overflow-y-auto custom-scrollbar text-slate-800 dark:text-slate-100 mt-1">
      
      {/* Top Section: Battery Visualizer & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Liquid Animated Battery Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white/40 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm p-5 flex flex-col items-center justify-center group">
          <div className={`absolute inset-0 bg-gradient-to-tr ${isCharging ? 'from-emerald-500/10' : 'from-blue-500/10'} to-transparent blur-2xl pointer-events-none`} />

          {battery ? (
            <>
              {/* Liquid Wave Circle */}
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-slate-200/50 dark:bg-slate-900/90 border-2 border-white/20 shadow-inner overflow-hidden mb-3">
                <div 
                  className={`absolute bottom-0 w-full bg-gradient-to-t ${getLiquidColor(battery.percentage, isCharging)} transition-all duration-700 ease-in-out opacity-90`}
                  style={{ height: `${battery.percentage}%` }}
                >
                  {/* Wave crest animation effect */}
                  <div className="absolute top-0 w-full h-1.5 bg-white/40 animate-pulse" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white drop-shadow">
                    {Math.round(battery.percentage)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/60 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg backdrop-blur-md">
                <Zap size={13} className={isCharging ? "text-emerald-400 animate-bounce" : "text-blue-400"} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {battery.state}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center animate-pulse py-6">
              <Zap size={28} className="text-slate-400 mb-2" />
              <span className="text-xs font-bold uppercase">Syncing Node...</span>
            </div>
          )}
        </div>

        {/* Real-time Power Draw Telemetry Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white/40 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Flame size={14} className="text-orange-500" /> Power Draw
            </h4>
            <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold">LIVE</span>
          </div>

          <div className="my-auto py-2">
            <div className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {telemetry ? telemetry.current_wattage.toFixed(1) : '4.2'} <span className="text-sm font-sans font-semibold text-slate-500">Watts</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">ARM64 core voltage draw rate</p>
          </div>

          <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Session Drain:</span>
            <span className="font-mono font-bold text-blue-500">{telemetry ? telemetry.session_draw_mah : '280'} mAh</span>
          </div>
        </div>

        {/* Compact Power Mode Selector */}
        <div className="relative overflow-hidden rounded-2xl bg-white/40 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm p-4 flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Power Profile</h4>
          
          <div className="grid grid-cols-3 gap-2 h-full">
            <button 
              onClick={() => handleModeChange('power_saver')}
              disabled={isChangingMode}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                powerMode === 'power_saver' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm' : 'bg-white/30 dark:bg-black/20 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Leaf size={16} className="mb-1" />
              <span className="text-[10px] font-bold">Eco</span>
            </button>

            <button 
              onClick={() => handleModeChange('balanced')}
              disabled={isChangingMode}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                powerMode === 'balanced' ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-sm' : 'bg-white/30 dark:bg-black/20 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity size={16} className="mb-1" />
              <span className="text-[10px] font-bold">Balance</span>
            </button>

            <button 
              onClick={() => handleModeChange('high_performance')}
              disabled={isChangingMode}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                powerMode === 'high_performance' ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-sm' : 'bg-white/30 dark:bg-black/20 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Rocket size={16} className="mb-1" />
              <span className="text-[10px] font-bold">Turbo</span>
            </button>
          </div>
        </div>

      </div>

      {/* App Power & Usage Breakdown Matrix */}
      <div className="relative overflow-hidden rounded-2xl bg-white/40 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-sm p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Cpu size={14} className="text-blue-500" /> Ecosystem App Power Matrix (Usage & Draw)
        </h3>

        <div className="space-y-2.5">
          {appStats.map((app, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-black/30 border border-slate-200/50 dark:border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-200/50 dark:bg-slate-800 ${app.iconColor}`}>
                  <Activity size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{app.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1"><Clock size={10} /> {app.duration} active</span>
                  </div>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-blue-500 dark:text-blue-400">{app.powerDraw}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}