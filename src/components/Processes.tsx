import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Activity, XCircle, Cpu, Zap } from 'lucide-react';

export const Processes = () => {
  const apps = useAppStore(state => state.apps);
  const closeApp = useAppStore(state => state.closeApp);
  const setAppMode = useAppStore(state => state.setAppMode);

  // Sirf Internal Running Apps Filter Karo
  const runningApps = apps.filter(app => app.status === 'running' && ['hyper-surf', 'hyper-media', 'hyper-music'].includes(app.id));

  return (
    <div className="w-full h-full p-[1.5rem] sm:p-[2rem] overflow-y-auto hide-scrollbar text-slate-800 dark:text-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center gap-[0.75rem] mb-[2rem]">
        <Activity className="w-[1.75rem] h-[1.75rem] text-emerald-500" />
        <h2 className="text-[1.5em] font-bold tracking-tight">Active Modules</h2>
      </div>

      {runningApps.length === 0 ? (
        <div className="text-center text-slate-500 mt-[5rem] flex flex-col items-center gap-[0.5rem] animate-pulse">
          <Zap className="w-[2.5rem] h-[2.5rem] text-slate-300 dark:text-zinc-600 mb-[0.5rem]" />
          <p className="font-semibold text-[1.1em]">No active modules</p>
          <p className="text-[0.85em]">Power saving mode active. Memory is fully optimized.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[1rem] max-w-[48rem]">
          {runningApps.map(app => (
            <div key={app.id} className="bg-white/70 dark:bg-zinc-900/80 p-[1.25rem] rounded-[1.5rem] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem] sm:gap-0 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              
              <div className="flex items-center gap-[1rem]">
                {/* Live Process Icon Scaled */}
                <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <span className="w-[0.6rem] h-[0.6rem] rounded-full bg-emerald-500 animate-pulse shadow-[0_0_0.5rem_#10b981]"></span>
                </div>
                <div className="flex flex-col gap-[0.25rem]">
                  <h4 className="font-bold text-[0.9em] tracking-wide text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{app.name}</h4>
                  <div className="flex gap-[1rem] text-[0.75em] text-slate-500 font-mono">
                    {/* Dummy Metrics */}
                    <span className="flex items-center gap-[0.25rem] bg-slate-100 dark:bg-white/5 px-[0.4rem] py-[0.1rem] rounded-[0.25rem]"><Cpu className="w-[0.8rem] h-[0.8rem]" /> {(Math.random() * 2 + 0.1).toFixed(1)}%</span>
                    <span className="flex items-center gap-[0.25rem] bg-slate-100 dark:bg-white/5 px-[0.4rem] py-[0.1rem] rounded-[0.25rem]"><Zap className="w-[0.8rem] h-[0.8rem]" /> {(Math.random() * 40 + 15).toFixed(0)} MB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-[1rem]">
                {/* Process Mode Control Scaled */}
                <select 
                  value={app.mode}
                  onChange={(e) => setAppMode(app.id, e.target.value as any)}
                  className="text-[0.75em] font-medium bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 rounded-[0.75rem] px-[0.75rem] py-[0.4rem] cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/50 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <option value="efficient">Power Save</option>
                  <option value="balanced">Balanced</option>
                  <option value="performance">Performance</option>
                </select>

                {/* Kill Process Scaled */}
                <button 
                  onClick={() => closeApp(app.id)}
                  className="p-[0.5rem] text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-[0.75rem] transition-all duration-300 active:scale-95"
                  title="Terminate Module"
                >
                  <XCircle className="w-[1.25rem] h-[1.25rem]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Processes;