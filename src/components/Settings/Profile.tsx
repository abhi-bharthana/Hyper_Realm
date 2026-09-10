import { useEffect, useState, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Cropper from 'react-easy-crop';
import { 
  User, Cpu, HardDrive, Monitor, Shield, Zap, MapPin, 
  Camera, Edit3, CheckCircle2, XCircle, Crop, ZoomIn, 
  LogOut, Cloud, Globe 
} from 'lucide-react';

import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { getCroppedImg } from "../../utils/cropUtils";

interface SystemInfo {
  os_name: string;
  os_version: string;
  cpu_name: string;
  total_memory: number;
  host_name: string;
  architecture: string;
}

let cachedSysInfo: SystemInfo | null = null;

export default function Profile() {
  // Store Connections
  const { userName, userTitle, userAvatar, updateProfile, updateAvatar } = useAppStore();
  const { user, isLoading, signInWithProvider, signOut } = useAuthStore();
  
  // Local States
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(cachedSysInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempTitle, setTempTitle] = useState(userTitle);
  
  // Cropper States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cloud avatar gets priority if logged in, otherwise local avatar
  const displayAvatar = user?.user_metadata?.avatar_url || userAvatar;

  // Fetch System Info on Mount
  useEffect(() => {
    const fetchInfo = async () => {
      if (cachedSysInfo) return; 
      try {
        const info: SystemInfo = await invoke('get_system_info');
        cachedSysInfo = info; 
        setSysInfo(info);
      } catch (err) { 
        console.error("Failed to load system info", err); 
      }
    };
    fetchInfo();
  }, []);

  // Handlers
  const handleSave = () => {
    updateProfile(tempName, tempTitle);
    setIsEditing(false);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) return; // Prevent local upload if synced with cloud
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setImageSrc(imageDataUrl);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBase64) {
        updateAvatar(croppedBase64);
      }
    } catch (error) {
      console.error("Cropping failed", error);
    } finally {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
      setIsProcessing(false);
      setZoom(1);
    }
  };

  const cancelCrop = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setZoom(1);
  };

  return (
    <div className="flex flex-col gap-5 h-full pb-6 px-4 md:px-8 overflow-y-auto custom-scrollbar text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- CROPPER MODAL --- */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/10 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/20 shadow-[0_1.5rem_3rem_rgba(0,0,0,0.5)] rounded-3xl w-full max-w-sm overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-300">
            <div className="relative aspect-square w-full max-h-[50vh] bg-black/80">
              <Cropper
                image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false}
                onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom}
              />
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-5 h-5 text-slate-400" />
                <input
                  type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-700/50 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={cancelCrop} disabled={isProcessing} className="px-4 py-2 bg-slate-200/20 hover:bg-slate-200/30 text-white rounded-lg text-xs font-semibold transition-all">
                  Cancel
                </button>
                <button onClick={handleCropSave} disabled={isProcessing} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0.2rem_1rem_rgba(37,99,235,0.4)]">
                  {isProcessing ? <span className="animate-pulse">Saving...</span> : <><Crop className="w-3.5 h-3.5" /> Update DP</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- IDENTITY CARD --- */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-[0_0.5rem_2rem_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shrink-0 group transition-all duration-500 mt-2">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 blur-[4rem] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-500/5 dark:bg-purple-600/10 blur-[3rem] rounded-full pointer-events-none opacity-30 group-hover:opacity-70 group-hover:scale-125 transition-all duration-700 delay-100" />
        
        <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />

        {/* Avatar Ring */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-white/60 to-white/20 dark:from-slate-800/80 dark:to-slate-900/80 border-[3px] border-white dark:border-slate-700/50 shadow-lg flex items-center justify-center overflow-hidden shrink-0 z-10 group/avatar transition-all duration-300 ${user ? 'cursor-default' : 'cursor-pointer hover:scale-105 hover:shadow-[0_0.5rem_2rem_rgba(59,130,246,0.2)]'}`}
        >
          {displayAvatar ? (
            <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
          ) : (
            <User className="w-10 h-10 text-slate-400 dark:text-slate-500 group-hover/avatar:scale-110 transition-transform duration-500" />
          )}
          
          {!user && (
            <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
              <Camera className="w-5 h-5 text-white mb-1" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
            </div>
          )}
        </div>

        {/* User Info & Auth Logic */}
        <div className="flex-1 w-full text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 hover:bg-blue-500/15 transition-colors">
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Hyper_Realm Identity</span>
          </div>

          {isLoading ? (
             <div className="animate-pulse space-y-3">
               <div className="h-6 w-48 bg-slate-200 dark:bg-white/10 rounded-md mx-auto md:mx-0"></div>
               <div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded-md mx-auto md:mx-0"></div>
             </div>
          ) : user ? (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
                {user.user_metadata?.full_name || 'Realm Explorer'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-4">{user.email}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cloud Synced
                </span>
                <button onClick={signOut} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl text-[11px] font-semibold transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          ) : isEditing ? (
            <div className="space-y-3 max-w-xs mx-auto md:mx-0 animate-in fade-in slide-in-from-right-4 duration-300">
              <input 
                type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-white/70 dark:bg-black/50 border border-slate-300/50 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
              />
              <input 
                type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)}
                className="w-full bg-white/70 dark:bg-black/50 border border-slate-300/50 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
              />
              <div className="flex justify-center md:justify-start gap-2 pt-1">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-transform active:scale-95 shadow-[0_0.2rem_1rem_rgba(37,99,235,0.3)]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 px-5 py-2 bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-transform active:scale-95">
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                {userName}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-4">{userTitle}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Dehradun Node
                </span>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-xl text-[11px] font-semibold transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Local
                </button>
              </div>

              {/* CLOUD SYNC BUTTONS - GITHUB IS NOW DUMMY */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-4 border-t border-slate-200/50 dark:border-white/10">
                <button 
                  onClick={() => signInWithProvider('google')} 
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:shadow transition-all"
                >
                  <Globe className="w-4 h-4 text-blue-500" /> Sync with Google
                </button>
                
                {/* 🚧 Dummy GitHub Button */}
                <button 
                  onClick={() => alert("GitHub integration is currently under development. Please use Google Sync for now!")} 
                  className="flex items-center gap-2 px-4 py-2 bg-[#24292F]/60 text-white/80 text-xs font-bold rounded-xl shadow-sm cursor-not-allowed border border-transparent transition-all"
                  title="Coming Soon"
                >
                  <Cloud className="w-4 h-4 opacity-70" /> GitHub (Coming Soon)
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* --- HARDWARE SPECS BENTO GRID --- */}
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
    </div>
  );
}

// BENTO CARD COMPONENT
function BentoCard({ icon, label, value, highlight = false }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`relative overflow-hidden flex flex-col p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-none group ${
      highlight 
        ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-600/10 dark:to-indigo-900/10 border-blue-500/30' 
        : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
      <div className="flex items-center gap-2.5 mb-1.5 z-10">
        <div className={`p-1.5 rounded-lg transition-colors duration-300 ${highlight ? 'bg-blue-500/20 text-blue-500 group-hover:bg-blue-500/30' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}>
          <div className="[&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {label}
        </span>
      </div>
      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 z-10 truncate group-hover:text-blue-500 transition-colors duration-300" title={value}>
        {value}
      </span>
    </div>
  );
}