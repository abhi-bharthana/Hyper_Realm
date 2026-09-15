import { useState, useRef, useCallback } from 'react';
import { User, Shield, MapPin, Camera, Edit3, CheckCircle2, XCircle, LogOut, Globe } from 'lucide-react';
import { useAppStore } from "../../../store/useAppStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { getCroppedImg } from "../../../utils/cropUtils";
import CropperModal from './CropperModal';
import { Card, Button, Input, Heading, Text } from '@/shared-ui';

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

  const onCropComplete = useCallback((_: any, cap: any) => {
    setCroppedAreaPixels(cap);
  }, []);

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
    } catch (error) { 
      console.error(error); 
    } finally {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
      setIsProcessing(false);
      setZoom(1);
    }
  };

  const handleCancelCrop = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setZoom(1);
  };

  return (
    <>
      {imageSrc && (
        <CropperModal 
          imageSrc={imageSrc} crop={crop} zoom={zoom} setCrop={setCrop} 
          onCropComplete={onCropComplete} setZoom={setZoom} 
          cancelCrop={handleCancelCrop} handleCropSave={handleCropSave} isProcessing={isProcessing} 
        />
      )}

      {/* 🔥 FIX: Changed layout to row-based (Side-by-Side) */}
      <Card variant="glass" className="p-6 md:p-7 shrink-0 relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-[#111111] backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col gap-6">
        
        <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
        
        {/* ROW 1: Avatar + Info */}
        <div className="flex items-center gap-5 w-full">
          {/* Avatar */}
          <div 
            onClick={() => fileInputRef.current?.click()} 
            className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-100 dark:bg-zinc-800 border-[3px] border-white dark:border-zinc-700 shadow-md flex items-center justify-center overflow-hidden shrink-0 z-10 group transition-all duration-300 ${user ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
          >
            {displayAvatar ? (
              <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <User className="w-10 h-10 text-slate-400 group-hover:scale-110 transition-transform" />
            )}
            {!user && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center">
                <Camera className="w-5 h-5 text-white mb-1" />
              </div>
            )}
          </div>

          {/* Info Section (Beside Avatar) */}
          <div className="flex-1 min-w-0 flex flex-col justify-center z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2 w-max">
              <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Hyper_Realm Identity</span>
            </div>

            {isLoading ? (
               <div className="animate-pulse space-y-2 w-full">
                 <div className="h-6 w-3/4 bg-slate-200 dark:bg-white/10 rounded-md" />
                 <div className="h-4 w-1/2 bg-slate-200 dark:bg-white/10 rounded-md" />
               </div>
            ) : isEditing ? (
              <div className="space-y-2 w-full animate-in fade-in duration-300">
                <Input value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Name" className="h-8 text-sm" />
                <Input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="Title" className="h-8 text-sm" />
              </div>
            ) : (
              <div className="animate-in fade-in duration-500 overflow-hidden">
                <Heading level="h3" className="mb-0.5 text-xl md:text-2xl truncate">{user ? user.user_metadata?.full_name || 'Realm Explorer' : userName}</Heading>
                <Text className="text-slate-500 dark:text-zinc-400 text-sm truncate">{user ? user.email : userTitle}</Text>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: Status & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            {user ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> : <MapPin className="w-3.5 h-3.5 text-emerald-500" />}
            {user ? 'Cloud Synced' : 'Local Node'}
          </span>
          
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSave} className="text-[11px] px-3 py-1.5"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Save</Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-[11px] px-3 py-1.5"><XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel</Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => user ? signOut() : setIsEditing(true)} 
              className={`text-[11px] px-3 py-1.5 ${user ? 'text-red-400 hover:bg-red-500/10' : 'text-blue-500 hover:bg-blue-500/10'}`}
            >
              {user ? <><LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out</> : <><Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Details</>}
            </Button>
          )}
        </div>

        {/* ROW 3: Provider Sync (Only if logged out) */}
        {!user && !isLoading && !isEditing && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-white/10 w-full">
            <Button variant="secondary" size="sm" onClick={() => signInWithProvider('google')} className="bg-white dark:bg-zinc-800/50 text-slate-800 dark:text-zinc-200 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-[11px] flex-1 justify-center">
              <Globe className="w-4 h-4 mr-1.5 text-blue-500" /> Sync with Google
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}