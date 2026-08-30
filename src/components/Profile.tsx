import { useEffect, useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { User, Cpu, HardDrive, Monitor, Shield, Zap, MapPin, Camera } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface SystemInfo {
  os_name: string;
  os_version: string;
  cpu_name: string;
  total_memory: number;
  host_name: string;
  architecture: string;
}

export default function Profile() {
  const { userName, userTitle, userAvatar, updateProfile, updateAvatar } = useAppStore();
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempTitle, setTempTitle] = useState(userTitle);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info: SystemInfo = await invoke('get_system_info');
        setSysInfo(info);
      } catch (err) { console.error("Failed to load system info", err); }
    };
    fetchInfo();
  }, []);

  const handleSave = () => {
    updateProfile(tempName, tempTitle);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { updateAvatar(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-4">
      {/* 1. Identity Section - Yahan 'shrink-0' add kiya jisse layout squish nahi hoga */}
      <div className="bg-white/60 dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-xl shadow-sm flex flex-col md:flex-row items-center md:items-center gap-8 relative shrink-0">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-md flex items-center justify-center overflow-hidden shrink-0 relative group cursor-pointer z-10"
        >
          {userAvatar ? (
            <img src={userAvatar} alt="Hyper Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={40} className="text-slate-400" />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
            <Camera size={20} className="text-white mb-1" />
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
          </div>
        </div>

        <div className="flex-1 w-full text-center md:text-left z-10">
          <div className="mb-1.5">
            <p className="text-xs font-mono text-blue-500 font-bold uppercase tracking-widest">Hyper_Realm Identity</p>
          </div>

          {isEditing ? (
            <div className="space-y-3 max-w-sm mx-auto md:mx-0">
              <input 
                type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white font-bold"
              />
              <input 
                type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Enter your title (e.g. Node Admin)"
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white text-sm"
              />
              <div className="flex justify-center md:justify-start gap-2 pt-1">
                <button onClick={handleSave} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors">Save</button>
                <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-1.5">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">{userName}</h3>
                <span className="px-2.5 py-1 mb-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-200 dark:border-emerald-500/30 whitespace-nowrap">Active Node</span>
              </div>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium mb-3">{userTitle}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-500 font-medium">
                <span className="flex items-center"><MapPin size={15} className="mr-1.5" /> Local System</span>
                <span className="flex items-center"><Shield size={15} className="mr-1.5" /> Root Access</span>
                <button onClick={() => setIsEditing(true)} className="text-blue-600 dark:text-blue-400 hover:underline ml-1">Edit Identity</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Specs - Flex-1 ensure karta hai ye baaki bachi space lega */}
      <div className="flex-1 bg-white/60 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-xl p-6 md:p-8 shadow-sm overflow-y-auto custom-scrollbar">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center sticky top-0">
          <Monitor className="mr-3 text-blue-500" size={20} /> Device Specifications
        </h4>
        
        {sysInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <SpecRow icon={<Monitor />} label="Operating System" value={sysInfo.os_name} />
            <SpecRow icon={<Shield />} label="Kernel Version" value={sysInfo.os_version} />
            <SpecRow icon={<Cpu />} label="Processor" value={sysInfo.cpu_name} />
            <SpecRow icon={<HardDrive />} label="Installed RAM" value={`${sysInfo.total_memory} GB`} />
            <SpecRow icon={<Zap />} label="System Architecture" value={sysInfo.architecture.toUpperCase()} />
            <SpecRow icon={<User />} label="Host Name" value={sysInfo.host_name} />
          </div>
        ) : (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecRow({ icon, label, value }: any) {
  return (
    <div className="flex flex-col border-b border-slate-100 dark:border-slate-800/50 pb-2">
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center">
        <span className="mr-1.5 opacity-70 scale-75">{icon}</span> {label}
      </span>
      <span className="text-slate-900 dark:text-slate-200 font-medium text-sm leading-relaxed">{value}</span>
    </div>
  );
}