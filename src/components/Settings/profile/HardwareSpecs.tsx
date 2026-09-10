import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Cpu, HardDrive, Monitor, Shield, Zap, User } from 'lucide-react';

interface SystemInfo {
  os_name: string; os_version: string; cpu_name: string;
  total_memory: number; host_name: string; architecture: string;
}

let cachedSysInfo: SystemInfo | null = null;

export default function HardwareSpecs() {
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(cachedSysInfo);

  useEffect(() => {
    const fetchInfo = async () => {
      if (cachedSysInfo) return; 
      try {
        const info: SystemInfo = await invoke('get_system_info');
        cachedSysInfo = info; 
        setSysInfo(info);
      } catch (err) { console.error("Failed to load system info", err); }
    };
    fetchInfo();
  }, []);

  return (
    <div className="mt-2 relative">
      <h4 className="text-sm font-bold mb-4 flex items-center gap-2 px-2 text-slate-700 dark:text-slate-200">
        <Monitor className="w-4 h-4 text-blue-500" /> System Architecture
      </h4>
      {sysInfo ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <BentoCard icon={<Cpu />} label="Processor" value={sysInfo.cpu_name} highlight />
          <BentoCard icon={<HardDrive />} label="Memory" value={`${sysInfo.total_memory} GB`} />
          <BentoCard icon={<Zap />} label="Arch" value={sysInfo.architecture.toUpperCase()} />
          <BentoCard icon={<Monitor />} label="OS" value={sysInfo.os_name} />
          <BentoCard icon={<Shield />} label="Kernel" value={sysInfo.os_version} />
          <BentoCard icon={<User />} label="Host" value={sysInfo.host_name} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse border border-slate-300/50 dark:border-white/5" />
          ))}
        </div>
      )}
    </div>
  );
}

function BentoCard({ icon, label, value, highlight = false }: any) {
  return (
    <div className={`relative overflow-hidden flex flex-col p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-none group ${highlight ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-500/30' : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
      <div className="flex items-center gap-2.5 mb-1.5 z-10">
        <div className={`p-1.5 rounded-lg transition-colors duration-300 ${highlight ? 'bg-blue-500/20 text-blue-500 group-hover:bg-blue-500/30' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}>
          <div className="[&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">{label}</span>
      </div>
      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 z-10 truncate group-hover:text-blue-500 transition-colors duration-300" title={value}>{value}</span>
    </div>
  );
}