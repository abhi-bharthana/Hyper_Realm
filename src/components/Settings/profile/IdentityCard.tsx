import { useState, useRef, useCallback } from 'react';
import { User, Shield, MapPin, Camera, Edit3, CheckCircle2, XCircle, LogOut, Cloud, Globe } from 'lucide-react';
import { useAppStore } from "../../../store/useAppStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { getCroppedImg } from "../../../utils/cropUtils";
import CropperModal from './CropperModal';

export default function IdentityCard() {
  const { userName, userTitle, userAvatar, updateProfile, updateAvatar } = useAppStore();
  const { user, isLoading, signInWithProvider, signOut } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempTitle, setTempTitle] = useState(userTitle);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const displayAvatar = user?.user_metadata?.avatar_url || userAvatar;

  const handleSave = () => {
    updateProfile(tempName, tempTitle);
    setIsEditing(false);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) return; 
    if (e.target.files && e.target.files.length > 0) {
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBase64) updateAvatar(croppedBase64);
    } catch (error) { console.error(error); } 
    finally {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null); setIsProcessing(false); setZoom(1);
    }
  };

  return (
    <>
      {imageSrc && (
        <CropperModal 
          imageSrc={imageSrc} crop={crop} zoom={zoom} setCrop={setCrop} 
          onCropComplete={useCallback((_: any, cap: any) => setCroppedAreaPixels(cap), [])} 
          setZoom={setZoom} cancelCrop={() => { URL.revokeObjectURL(imageSrc); setImageSrc(null); setZoom(1); }} 
          handleCropSave={handleCropSave} isProcessing={isProcessing} 
        />
      )}

      <div className="relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-[0_0.5rem_2rem_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shrink-0 group transition-all duration-500 mt-2">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 blur-[4rem] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-all duration-700" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-500/5 dark:bg-purple-600/10 blur-[3rem] rounded-full pointer-events-none opacity-30 group-hover:opacity-70 transition-all duration-700" />
        
        <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />

        <div onClick={() => fileInputRef.current?.click()} className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-white/60 to-white/20 dark:from-slate-800/80 dark:to-slate-900/80 border-[3px] border-white dark:border-slate-700/50 shadow-lg flex items-center justify-center overflow-hidden shrink-0 z-10 group/avatar transition-all duration-300 ${user ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}>
          {displayAvatar ? <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform" /> : <User className="w-10 h-10 text-slate-400 group-hover/avatar:scale-110 transition-transform" />}
          {!user && <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center"><Camera className="w-5 h-5 text-white mb-1" /><span className="text-white text-[10px] font-bold uppercase">Change</span></div>}
        </div>

        <div className="flex-1 w-full text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3"><Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /><span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Hyper_Realm Identity</span></div>

          {isLoading ? (
             <div className="animate-pulse space-y-3"><div className="h-6 w-48 bg-slate-200 dark:bg-white/10 rounded-md mx-auto md:mx-0" /><div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded-md mx-auto md:mx-0" /></div>
          ) : user ? (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{user.user_metadata?.full_name || 'Realm Explorer'}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-4">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] font-semibold text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Cloud Synced</span>
                <button onClick={signOut} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-600 border border-red-500/20 rounded-xl text-[11px] font-semibold hover:bg-red-500/20 transition-colors"><LogOut className="w-3.5 h-3.5" /> Sign Out</button>
              </div>
            </div>
          ) : isEditing ? (
            <div className="space-y-3 max-w-xs mx-auto md:mx-0 animate-in fade-in slide-in-from-right-4 duration-300">
              <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full bg-white/70 dark:bg-black/50 border border-slate-300/50 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500/50" />
              <input type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="w-full bg-white/70 dark:bg-black/50 border border-slate-300/50 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50" />
              <div className="flex justify-center md:justify-start gap-2 pt-1">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500"><CheckCircle2 className="w-3.5 h-3.5" /> Save</button>
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 px-5 py-2 bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"><XCircle className="w-3.5 h-3.5" /> Cancel</button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">{userName}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-4">{userTitle}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-300"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Dehradun Node</span>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-xl text-[11px] font-semibold hover:bg-blue-500/20"><Edit3 className="w-3.5 h-3.5" /> Edit Local</button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-4 border-t border-slate-200/50 dark:border-white/10">
                <button onClick={() => signInWithProvider('google')} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50"><Globe className="w-4 h-4 text-blue-500" /> Sync with Google</button>
                <button onClick={() => alert("GitHub coming soon!")} className="flex items-center gap-2 px-4 py-2 bg-[#24292F]/60 text-white/80 text-xs font-bold rounded-xl cursor-not-allowed"><Cloud className="w-4 h-4 opacity-70" /> GitHub (Soon)</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}