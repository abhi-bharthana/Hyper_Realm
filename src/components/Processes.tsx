import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Activity, Cpu, Database, Microchip, Settings2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface ProcessData {
  pid: number;
  name: string;
  cpu: number;
  ram: number;
}

export default function Processes() {
  const [view, setView] = useState<'system' | 'manager'>('manager');
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const { apps, setAppMode } = useAppStore();

  const runningApps = apps.filter(app => app.status === 'running');

  useEffect(() => {
    if (view !== 'system') return;
    
    let isMounted = true;
    const fetchProcesses = async () => {
      try {
        const data: ProcessData[] = await invoke('get_processes');
        if (isMounted) setProcesses(data);
      } catch (error) {
        console.error("Failed to fetch processes", error);
      }
    };
    
    fetchProcesses();
    // Interval ko 3 seconds kar diya hai taaki performance smooth rahe
    const interval = setInterval(fetchProcesses, 3000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [view]);

  return (
    <div className="bg-white/70 dark:bg-zinc-900/80 rounded-3xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-xl flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Activity className="text-zinc-500" size={24} />
          <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Process Control</h3>
        </div>
        
        <div className="flex space-x-1 bg-slate-100 dark:bg-black/30 p-1 rounded-xl border border-slate-200 dark:border-white/[0.06]">
          <button 
            onClick={() => setView('manager')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              view === 'manager' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}>
            <Settings2 size={16} /> <span>App Manager</span>
          </button>
          <button 
            onClick={() => setView('system')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              view === 'system' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}>
            <Activity size={16} /> <span>System Monitor</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        {view === 'manager' ? (
          <div className="p-6 space-y-4">
            {runningApps.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400">
                <Settings2 size={48} className="mb-4 opacity-50" />
                <p>No Hyper_Realm modules are currently active.</p>
              </div>
            ) : (
              runningApps.map(app => (
                <div key={app.id} className="p-5 rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-slate-200 dark:border-white/[0.06] flex flex-col xl:flex-row xl:items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      <Cpu size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{app.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 font-mono">PID: {app.pid} • Tracked via Hyper_Realm</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-black/30 p-1.5 rounded-xl border border-slate-200 dark:border-white/[0.06]">
                    <button onClick={() => setAppMode(app.id, 'efficient')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${app.mode === 'efficient' ? 'bg-white dark:bg-zinc-700 text-emerald-500 shadow-sm' : 'text-slate-500'}`}>Efficient</button>
                    <button onClick={() => setAppMode(app.id, 'balanced')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${app.mode === 'balanced' ? 'bg-white dark:bg-zinc-700 text-blue-500 shadow-sm' : 'text-slate-500'}`}>Balanced</button>
                    <button onClick={() => setAppMode(app.id, 'performance')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${app.mode === 'performance' ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-sm' : 'text-slate-500'}`}>High Perf.</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-xs font-mono tracking-widest text-slate-500 dark:text-zinc-400 uppercase border-b border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-transparent sticky top-0">
                <th className="p-4 pl-6">PID</th>
                <th className="p-4">Process Name</th>
                <th className="p-4"><Cpu size={14} className="inline mr-2"/>CPU</th>
                <th className="p-4"><Database size={14} className="inline mr-2"/>RAM</th>
                <th className="p-4"><Microchip size={14} className="inline mr-2"/>GPU</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {processes.map((proc) => (
                <tr key={proc.pid} className="border-b border-slate-100 dark:border-white/[0.02] hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 pl-6 text-slate-400 dark:text-zinc-500 font-mono">{proc.pid}</td>
                  <td className="p-4 text-slate-800 dark:text-zinc-200">{proc.name}</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400">{proc.cpu.toFixed(1)}%</td>
                  <td className="p-4 text-blue-600 dark:text-blue-400">{proc.ram} MB</td>
                  <td className="p-4 text-slate-400 dark:text-zinc-500">N/A</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}