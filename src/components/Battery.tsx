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

  // Simulated active apps power breakdown matrix
  const [appStats] = useState<AppUsageStat[]>([
    { name: 'HyperSurf Browser', duration: '1h 24m', powerDraw: '320 mAh (2.1W)', iconColor: 'text-blue-400 bg-blue-500/10' },
    { name: 'Video Player Engine', duration: '45m', powerDraw: '210 mAh (1.8W)', iconColor: 'text-purple-400 bg-purple-500/10' },
    { name: 'Hyper_Dashboard Core', duration: '3h 10m', powerDraw: '150 mAh (0.9W)', iconColor: 'text-emerald-400 bg-emerald-500/10' },
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
    const interval = setInterval(fetchData, 5000);
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
    <div className="flex flex-col gap-[1.5rem] h-full pb-[1.5rem] px-[1rem] md:px-[2rem] overflow-y-auto custom-scrollbar text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Section: Battery Visualizer & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
        
        {/* Liquid Animated Battery Card */}
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-sm p-[1.5rem] flex flex-col items-center justify-center group hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.1)] transition-all duration-500">
          <div className={`absolute inset-0 bg-gradient-to-tr ${isCharging ? 'from-emerald-500/10' : 'from-blue-500/10'} to-transparent blur-[2rem] pointer-events-none transition-colors duration-1000`} />

          {battery ? (
            <>
              {/* Scalable Liquid Wave Circle */}
              <div className="relative flex items-center justify-center w-[8rem] h-[8rem] rounded-full bg-slate-200/50 dark:bg-slate-950/80 border-[0.2rem] border-white dark:border-white/10 shadow-inner overflow-hidden mb-[1rem] group-hover:scale-105 transition-transform duration-500">
                <div 
                  className={`absolute bottom-0 w-full bg-gradient-to-t ${getLiquidColor(battery.percentage, isCharging)} transition-all duration-1000 ease-in-out opacity-90`}
                  style={{ height: `${battery.percentage}%` }}
                >
                  {/* Glassy Wave crest effect */}
                  <div className="absolute top-0 w-full h-[0.3rem] bg-white/40 animate-pulse" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-[2em] font-black text-slate-900 dark:text-white drop-shadow-md tracking-tighter">
                    {Math.round(battery.percentage)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-[0.4rem] px-[0.75rem] py-[0.3rem] bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[0.75rem] backdrop-blur-md shadow-sm">
                <Zap className={`w-[0.9rem] h-[0.9rem] ${isCharging ? "text-emerald-500 animate-pulse" : "text-blue-500"}`} />
                <span className="text-[0.65em] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {battery.state}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center animate-pulse py-[2rem]">
              <Zap className="w-[2rem] h-[2rem] text-slate-400 mb-[0.5rem]" />
              <span className="text-[0.7em] font-bold uppercase">Syncing Node...</span>
            </div>
          )}
        </div>

        {/* Real-time Power Draw Telemetry Card */}
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-sm p-[1.5rem] flex flex-col justify-between hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.1)] transition-all duration-500 group">
          <div className="flex items-center justify-between">
            <h4 className="text-[0.75em] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-[0.4rem]">
              <Flame className="w-[1rem] h-[1rem] text-orange-500 group-hover:animate-bounce" /> Power Draw
            </h4>
            <span className="px-[0.5rem] py-[0.15rem] rounded-[0.4rem] bg-orange-500/10 text-orange-500 text-[0.65em] font-mono font-bold animate-pulse">LIVE</span>
          </div>

          <div className="my-auto py-[0.5rem]">
            <div className="text-[2.2em] font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {telemetry ? telemetry.current_wattage.toFixed(1) : '4.2'} <span className="text-[0.4em] font-sans font-semibold text-slate-500 uppercase tracking-widest">Watts</span>
            </div>
            <p className="text-[0.75em] text-slate-500 dark:text-slate-400 mt-[0.25rem]">ARM64 core voltage draw rate</p>
          </div>

          <div className="pt-[0.75rem] border-t border-slate-200/80 dark:border-white/5 flex justify-between items-center text-[0.8em] font-medium text-slate-600 dark:text-slate-300">
            <span>Session Drain:</span>
            <span className="font-mono font-bold text-blue-500 bg-blue-500/10 px-[0.5rem] py-[0.15rem] rounded-[0.4rem]">{telemetry ? telemetry.session_draw_mah : '280'} mAh</span>
          </div>
        </div>

        {/* Compact Power Mode Selector */}
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-sm p-[1.5rem] flex flex-col justify-between transition-all duration-500">
          <h4 className="text-[0.75em] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-[1rem]">Power Profile</h4>
          
          <div className="grid grid-cols-3 gap-[0.75rem] h-full">
            <button 
              onClick={() => handleModeChange('power_saver')}
              disabled={isChangingMode}
              className={`flex flex-col items-center justify-center p-[0.5rem] rounded-[1rem] border transition-all duration-300 hover:-translate-y-1 ${
                powerMode === 'power_saver' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-[0_0.2rem_1rem_rgba(16,185,129,0.2)]' : 'bg-white/50 dark:bg-black/20 border-transparent hover:border-slate-300 dark:hover:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Leaf className="w-[1.2rem] h-[1.2rem] mb-[0.4rem]" />
              <span className="text-[0.7em] font-bold tracking-wide">Eco</span>
            </button>

            <button 
              onClick={() => handleModeChange('balanced')}
              disabled={isChangingMode}
              className={`flex flex-col items-center justify-center p-[0.5rem] rounded-[1rem] border transition-all duration-300 hover:-translate-y-1 ${
                powerMode === 'balanced' ? 'bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400 shadow-[0_0.2rem_1rem_rgba(59,130,246,0.2)]' : 'bg-white/50 dark:bg-black/20 border-transparent hover:border-slate-300 dark:hover:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-[1.2rem] h-[1.2rem] mb-[0.4rem]" />
              <span className="text-[0.7em] font-bold tracking-wide">Balance</span>
            </button>

            <button 
              onClick={() => handleModeChange('high_performance')}
              disabled={isChangingMode}
              className={`flex flex-col items-center justify-center p-[0.5rem] rounded-[1rem] border transition-all duration-300 hover:-translate-y-1 ${
                powerMode === 'high_performance' ? 'bg-purple-500/10 border-purple-500/50 text-purple-600 dark:text-purple-400 shadow-[0_0.2rem_1rem_rgba(168,85,247,0.2)]' : 'bg-white/50 dark:bg-black/20 border-transparent hover:border-slate-300 dark:hover:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Rocket className="w-[1.2rem] h-[1.2rem] mb-[0.4rem]" />
              <span className="text-[0.7em] font-bold tracking-wide">Turbo</span>
            </button>
          </div>
        </div>

      </div>

      {/* App Power & Usage Breakdown Matrix */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-sm p-[1.5rem]">
        <h3 className="text-[0.8em] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-[1rem] flex items-center gap-[0.5rem]">
          <Cpu className="w-[1.2rem] h-[1.2rem] text-blue-500" /> Ecosystem App Power Matrix
        </h3>

        <div className="flex flex-col gap-[0.75rem]">
          {appStats.map((app, index) => (
            <div key={index} className="flex items-center justify-between p-[1rem] rounded-[1rem] bg-white/80 dark:bg-black/40 border border-slate-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md group">
              <div className="flex items-center gap-[1rem]">
                <div className={`p-[0.6rem] rounded-[0.75rem] ${app.iconColor} transition-transform group-hover:scale-110`}>
                  <Activity className="w-[1.2rem] h-[1.2rem]" />
                </div>
                <div>
                  <h4 className="font-bold text-[0.85em] text-slate-800 dark:text-slate-200 tracking-wide">{app.name}</h4>
                  <div className="flex items-center gap-[0.4rem] text-[0.7em] text-slate-500 mt-[0.2rem]">
                    <span className="flex items-center gap-[0.25rem] bg-slate-100 dark:bg-white/5 px-[0.4rem] py-[0.15rem] rounded-[0.3rem]">
                      <Clock className="w-[0.8rem] h-[0.8rem]" /> {app.duration} active
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[0.8em] font-bold text-slate-700 dark:text-slate-300">{app.powerDraw}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}