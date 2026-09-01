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
    <div className="w-full h-full p-6 sm:p-8 overflow-y-auto hide-scrollbar text-slate-800 dark:text-slate-200">
      
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-emerald-500" size={28} />
        <h2 className="text-2xl font-bold">Active Modules</h2>
      </div>

      {runningApps.length === 0 ? (
        <div className="text-center text-slate-500 mt-20 flex flex-col items-center gap-2">
          <Zap size={32} className="text-slate-300 dark:text-zinc-600 mb-2" />
          <p className="font-semibold text-lg">No active modules</p>
          <p className="text-sm">Power saving mode active. Memory is fully optimized.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-3xl">
          {runningApps.map(app => (
            <div key={app.id} className="bg-white/70 dark:bg-zinc-900/80 p-5 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
              
              <div className="flex items-center gap-4">
                {/* Live Process Icon */}
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide">{app.name}</h4>
                  <div className="flex gap-4 text-xs text-slate-500 font-mono mt-1">
                    {/* Dummy Metrics (Agar backend IPC connected nahi hai toh mock values) */}
                    <span className="flex items-center gap-1"><Cpu size={12} /> {(Math.random() * 2 + 0.1).toFixed(1)}%</span>
                    <span className="flex items-center gap-1"><Zap size={12} /> {(Math.random() * 40 + 15).toFixed(0)} MB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Process Mode Control */}
                <select 
                  value={app.mode}
                  onChange={(e) => setAppMode(app.id, e.target.value as any)}
                  className="text-xs bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-1.5 cursor-pointer outline-none"
                >
                  <option value="efficient">Power Save</option>
                  <option value="balanced">Balanced</option>
                  <option value="performance">Performance</option>
                </select>

                {/* Kill Process */}
                <button 
                  onClick={() => closeApp(app.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Terminate Module"
                >
                  <XCircle size={20} />
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