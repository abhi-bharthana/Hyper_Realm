import { useState, useRef, useCallback } from 'react';
import { User, Shield, MapPin, Camera, Edit3, CheckCircle2, XCircle, LogOut, Cloud, Globe } from 'lucide-react';
import { useAppStore } from "../../../store/useAppStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { getCroppedImg } from "../../../utils/cropUtils";
import CropperModal from './CropperModal';

// 🔥 Shared UI Imports
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

  // ✅ BUG FIX: useCallback ko ekdum TOP level par nikal diya
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
      {/* Cropper Modal */}
      {imageSrc && (
        <CropperModal 
          imageSrc={imageSrc} 
          crop={crop} 
          zoom={zoom} 
          setCrop={setCrop} 
          onCropComplete={onCropComplete} // ✅ Ab yeh safe hai kyunki function top-level pe define hua hai
          setZoom={setZoom} 
          cancelCrop={handleCancelCrop} 
          handleCropSave={handleCropSave} 
          isProcessing={isProcessing} 
        />
      )}

      {/* 🚀 SHARED-UI CARD: Pehle wale lambe div ki jagah */}
      <Card variant="glass" padding="lg" withGlow={true} className="flex flex-col md:flex-row items-center gap-6 md:gap-8 shrink-0 group mt-2">
        
        {/* Custom Glows (Overriding defaults for specific purple/blue mix) */}
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-500/5 dark:bg-purple-600/10 blur-[3rem] rounded-full pointer-events-none opacity-30 group-hover:opacity-70 transition-all duration-700" />
        
        <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />

        {/* Avatar Section */}
        <div 
          onClick={() => fileInputRef.current?.click()} 
          className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-white/60 to-white/20 dark:from-slate-800/80 dark:to-slate-900/80 border-[3px] border-white dark:border-slate-700/50 shadow-lg flex items-center justify-center overflow-hidden shrink-0 z-10 group/avatar transition-all duration-300 ${user ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
        >
          {displayAvatar ? (
            <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform" />
          ) : (
            <User className="w-10 h-10 text-slate-400 group-hover/avatar:scale-110 transition-transform" />
          )}
          {!user && (
            <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center">
              <Camera className="w-5 h-5 text-white mb-1" />
              <span className="text-white text-[10px] font-bold uppercase">Change</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 w-full text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Hyper_Realm Identity</span>
          </div>

          {isLoading ? (
             <div className="animate-pulse space-y-3">
               <div className="h-6 w-48 bg-slate-200 dark:bg-white/10 rounded-md mx-auto md:mx-0" />
               <div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded-md mx-auto md:mx-0" />
             </div>
          ) : user ? (
            <div className="animate-in fade-in duration-500">
              <Heading level="h3" variant="premium" className="mb-1">
                {user.user_metadata?.full_name || 'Realm Explorer'}
              </Heading>
              <Text variant="default" className="font-medium mb-4">
                {user.email}
              </Text>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Cloud Synced
                </span>
                {/* 🚀 SHARED-UI BUTTON */}
                <Button variant="danger" size="sm" onClick={signOut} className="text-[11px] px-3 py-1.5">
                  <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
                </Button>
              </div>
            </div>
          ) : isEditing ? (
            <div className="space-y-3 max-w-xs mx-auto md:mx-0 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* 🚀 SHARED-UI INPUT */}
              <Input 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)} 
                placeholder="Name" 
              />
              <Input 
                value={tempTitle} 
                onChange={(e) => setTempTitle(e.target.value)} 
                placeholder="Title" 
              />
              <div className="flex justify-center md:justify-start gap-2 pt-1">
                <Button variant="primary" size="sm" onClick={handleSave}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {/* 🚀 SHARED-UI TYPOGRAPHY */}
              <Heading level="h3" variant="premium" className="mb-1">
                {userName}
              </Heading>
              <Text variant="muted" className="mb-4">
                {userTitle}
              </Text>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Dehradun Node
                </span>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-[11px] px-3 py-1.5 text-blue-400">
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Local
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-4 border-t border-slate-200/50 dark:border-white/10">
                <Button variant="secondary" size="sm" onClick={() => signInWithProvider('google')} className="bg-white text-slate-800 hover:bg-slate-50 border-slate-200 text-xs">
                  <Globe className="w-4 h-4 mr-1.5 text-blue-500" /> Sync with Google
                </Button>
                <Button variant="secondary" size="sm" onClick={() => alert("GitHub coming soon!")} disabled className="bg-[#24292F]/60 text-white/80 text-xs border-transparent">
                  <Cloud className="w-4 h-4 mr-1.5 opacity-70" /> GitHub (Soon)
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}