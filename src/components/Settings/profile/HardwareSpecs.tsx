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
    <div className="mt-4 relative">
      <h4 className="text-[13px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2 px-1 text-slate-500 dark:text-zinc-400">
        <Monitor className="w-4 h-4 text-blue-500" /> System Architecture
      </h4>

      {sysInfo ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* 🔥 FIX: gap-4 se gap-3 kiya aur columns set kiye PC and Mobile ke liye */}
          <BentoCard icon={<Cpu />} label="Processor" value={sysInfo.cpu_name} highlight />
          <BentoCard icon={<HardDrive />} label="Memory" value={`${sysInfo.total_memory} GB`} />
          <BentoCard icon={<Zap />} label="Arch" value={sysInfo.architecture.toUpperCase()} />
          <BentoCard icon={<Monitor />} label="OS" value={sysInfo.os_name} />
          <BentoCard icon={<Shield />} label="Kernel" value={sysInfo.os_version} />
          <BentoCard icon={<User />} label="Host" value={sysInfo.host_name} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 rounded-[1.25rem] bg-slate-200/50 dark:bg-zinc-800/50 animate-pulse border border-slate-300/50 dark:border-white/5" />
          ))}
        </div>
      )}
    </div>
  );
}

function BentoCard({ icon, label, value, highlight = false }: any) {
  return (
    <div className={`relative overflow-hidden flex flex-col p-3.5 rounded-[1.25rem] border transition-all duration-300 hover:-translate-y-0.5 group ${
      highlight 
        ? 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' 
        : 'bg-white/60 dark:bg-zinc-900/60 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
    }`}>
      <div className="flex items-center gap-2.5 mb-1.5 z-10">
        <div className={`p-1.5 rounded-lg transition-colors duration-300 ${
          highlight 
            ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
            : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-200'
        }`}>
          <div className="[&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 truncate">
          {label}
        </span>
      </div>
      <span className="text-[13px] font-semibold text-slate-800 dark:text-zinc-200 z-10 truncate group-hover:text-blue-500 transition-colors duration-300" title={value}>
        {value}
      </span>
    </div>
  );
}