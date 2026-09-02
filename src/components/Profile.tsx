import { useEffect, useState, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Cropper from 'react-easy-crop';
import { User, Cpu, HardDrive, Monitor, Shield, Zap, MapPin, Camera, Edit3, CheckCircle2, XCircle, Crop, ZoomIn } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getCroppedImg } from '../utils/cropUtils';

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
  const { userName, userTitle, userAvatar, updateProfile, updateAvatar } = useAppStore();
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(cachedSysInfo);
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempTitle, setTempTitle] = useState(userTitle);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleSave = () => {
    updateProfile(tempName, tempTitle);
    setIsEditing(false);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setImageSrc(imageDataUrl);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
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
    <div className="flex flex-col gap-[1.25rem] h-full pb-[1.5rem] px-[1rem] md:px-[2rem] overflow-y-auto custom-scrollbar text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- CROPPER MODAL --- */}
      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-[1rem] bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/10 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/20 shadow-[0_1.5rem_3rem_rgba(0,0,0,0.5)] rounded-[1.5rem] w-full max-w-[24rem] overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-300">
            
            <div className="relative aspect-square w-full max-h-[50vh] bg-black/80">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-[1.25rem] space-y-[1.25rem]">
              <div className="flex items-center gap-[0.75rem]">
                <ZoomIn className="w-[1.2rem] h-[1.2rem] text-slate-400" />
                <input
                  type="range" value={zoom} min={1} max={3} step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-700/50 h-[0.4rem] rounded-[0.5rem] appearance-none cursor-pointer"
                />
              </div>
              <div className="flex gap-[0.5rem] justify-end">
                <button onClick={cancelCrop} disabled={isProcessing} className="px-[1rem] py-[0.5rem] bg-slate-200/20 hover:bg-slate-200/30 text-white rounded-[0.5rem] text-[0.75em] font-semibold transition-all">
                  Cancel
                </button>
                <button onClick={handleCropSave} disabled={isProcessing} className="flex items-center gap-[0.4rem] px-[1rem] py-[0.5rem] bg-blue-600 hover:bg-blue-500 text-white rounded-[0.5rem] text-[0.75em] font-semibold transition-all shadow-[0_0.2rem_1rem_rgba(37,99,235,0.4)]">
                  {isProcessing ? <span className="animate-pulse">Saving...</span> : <><Crop className="w-[0.9rem] h-[0.9rem]" /> Update DP</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Identity Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-[0_0.5rem_2rem_rgba(0,0,0,0.05)] p-[1.5rem] md:p-[2rem] flex flex-col md:flex-row items-center gap-[1.5rem] md:gap-[2rem] shrink-0 group transition-all duration-500 mt-[0.5rem]">
        {/* Glow Effects */}
        <div className="absolute -top-[6rem] -right-[6rem] w-[18rem] h-[18rem] bg-blue-500/10 dark:bg-blue-600/10 blur-[4rem] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute -bottom-[4rem] -left-[4rem] w-[14rem] h-[14rem] bg-purple-500/5 dark:bg-purple-600/10 blur-[3rem] rounded-full pointer-events-none opacity-30 group-hover:opacity-70 group-hover:scale-125 transition-all duration-700 delay-100" />
        
        <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />

        {/* Avatar Ring */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-[7rem] h-[7rem] md:w-[8rem] md:h-[8rem] rounded-full bg-gradient-to-br from-white/60 to-white/20 dark:from-slate-800/80 dark:to-slate-900/80 border-[0.15rem] border-white dark:border-slate-700/50 shadow-[0_0.2rem_1.5rem_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden shrink-0 cursor-pointer z-10 group/avatar hover:scale-105 hover:shadow-[0_0.5rem_2rem_rgba(59,130,246,0.2)] transition-all duration-300"
        >
          {userAvatar ? (
            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
          ) : (
            <User className="w-[2.5rem] h-[2.5rem] text-slate-400 dark:text-slate-500 group-hover/avatar:scale-110 transition-transform duration-500" />
          )}
          
          <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
            <Camera className="w-[1.25rem] h-[1.25rem] text-white mb-[0.25rem]" />
            <span className="text-white text-[0.65em] font-bold uppercase tracking-wider">Change</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 w-full text-center md:text-left z-10">
          <div className="inline-flex items-center gap-[0.4rem] px-[0.75rem] py-[0.4rem] rounded-full bg-blue-500/10 border border-blue-500/20 mb-[0.75rem] hover:bg-blue-500/15 transition-colors">
            <Shield className="w-[0.8rem] h-[0.8rem] text-blue-600 dark:text-blue-400" />
            <span className="text-[0.65em] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Hyper_Realm Identity</span>
          </div>

          {isEditing ? (
            <div className="space-y-[0.75rem] max-w-[20rem] mx-auto md:mx-0 animate-in fade-in slide-in-from-right-4 duration-300">
              <input 
                type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-white/70 dark:bg-black/50 border border-slate-300/50 dark:border-white/10 rounded-[0.75rem] px-[1rem] py-[0.5rem] text-slate-900 dark:text-white font-semibold text-[0.9em] outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
              />
              <input 
                type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)}
                className="w-full bg-white/70 dark:bg-black/50 border border-slate-300/50 dark:border-white/10 rounded-[0.75rem] px-[1rem] py-[0.5rem] text-slate-900 dark:text-white text-[0.8em] outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
              />
              <div className="flex justify-center md:justify-start gap-[0.5rem] pt-[0.25rem]">
                <button onClick={handleSave} className="flex items-center gap-[0.4rem] px-[1.25rem] py-[0.5rem] bg-blue-600 hover:bg-blue-500 text-white rounded-[0.75rem] text-[0.75em] font-semibold transition-transform active:scale-95 shadow-[0_0.2rem_1rem_rgba(37,99,235,0.3)]">
                  <CheckCircle2 className="w-[0.9rem] h-[0.9rem]" /> Save
                </button>
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-[0.4rem] px-[1.25rem] py-[0.5rem] bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-[0.75rem] text-[0.75em] font-semibold transition-transform active:scale-95">
                  <XCircle className="w-[0.9rem] h-[0.9rem]" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-[1.8em] md:text-[2.2em] font-extrabold tracking-tight mb-[0.2rem] text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                {userName}
              </h3>
              <p className="text-[0.85em] text-slate-600 dark:text-slate-400 font-medium mb-[1rem]">{userTitle}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-[0.6rem]">
                <span className="flex items-center gap-[0.4rem] px-[0.75rem] py-[0.4rem] bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[0.75rem] text-[0.7em] font-semibold text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                  <MapPin className="w-[0.8rem] h-[0.8rem] text-emerald-500" /> Dehradun Node
                </span>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-[0.4rem] px-[0.75rem] py-[0.4rem] bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-[0.75rem] text-[0.7em] font-semibold transition-colors">
                  <Edit3 className="w-[0.8rem] h-[0.8rem]" /> Edit Identity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hardware Specs - System UI Tuned */}
      <div className="mt-[0.5rem] relative">
        <h4 className="text-[0.85em] font-bold mb-[1rem] flex items-center gap-[0.5rem] px-[0.5rem] text-slate-700 dark:text-slate-200">
          <Monitor className="w-[1rem] h-[1rem] text-blue-500" /> System Architecture
        </h4>
        
        {sysInfo ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1rem]">
            <BentoCard icon={<Cpu />} label="Processor" value={sysInfo.cpu_name} highlight />
            <BentoCard icon={<HardDrive />} label="Memory" value={`${sysInfo.total_memory} GB`} />
            <BentoCard icon={<Zap />} label="Arch" value={sysInfo.architecture.toUpperCase()} />
            <BentoCard icon={<Monitor />} label="OS" value={sysInfo.os_name} />
            <BentoCard icon={<Shield />} label="Kernel" value={sysInfo.os_version} />
            <BentoCard icon={<User />} label="Host" value={sysInfo.host_name} />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1rem]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[4rem] rounded-[1.25rem] bg-slate-200/50 dark:bg-slate-800/50 animate-pulse border border-slate-300/50 dark:border-white/5" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BentoCard({ icon, label, value, highlight = false }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`relative overflow-hidden flex flex-col p-[0.85rem] rounded-[1.25rem] border backdrop-blur-xl transition-all duration-300 hover:-translate-y-[0.15rem] hover:shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.05)] dark:hover:shadow-none group ${
      highlight 
        ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-600/10 dark:to-indigo-900/10 border-blue-500/30' 
        : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
    }`}>
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="flex items-center gap-[0.6rem] mb-[0.4rem] z-10">
        <div className={`p-[0.4rem] rounded-[0.5rem] transition-colors duration-300 ${highlight ? 'bg-blue-500/20 text-blue-500 group-hover:bg-blue-500/30' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}>
          <div className="[&>svg]:w-[0.9rem] [&>svg]:h-[0.9rem]">{icon}</div>
        </div>
        <span className="text-[0.65em] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {label}
        </span>
      </div>
      <span className="text-[0.8em] font-semibold text-slate-800 dark:text-slate-200 z-10 truncate group-hover:text-blue-500 transition-colors duration-300" title={value}>
        {value}
      </span>
    </div>
  );
}