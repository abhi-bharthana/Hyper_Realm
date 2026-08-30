import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const SOLID_PRESETS = [
  '#0a0a0a', '#171717', '#262626', // Dark Matte
  '#fafafa', '#f5f5f5', '#e5e5e5', // Lights
  '#27272a', '#1c1917', '#0f172a'  // Subtle Tints
];

const GRADIENT_PRESETS = [
  'linear-gradient(to right, #141e30, #243b55)', // Midnight
  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', // Matte Fog
  'linear-gradient(to right, #434343 0%, black 100%)', // Pure Dark
  'linear-gradient(to top, #09203f 0%, #537895 100%)', // Deep Space
  'linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgba(63, 61, 61, 1) 78.9%)' // Carbon
];

export default function HomeSettings({ onClose }: { onClose?: () => void }) {
  const { 
    homeShowClock, homeClockSize, homeClockPosition, homeBackgroundType, homeBackgroundValue,
    setHomeShowClock, setHomeClockSize, setHomeClockPosition, setHomeBackground 
  } = useAppStore();

  const [tempShowClock, setTempShowClock] = useState(homeShowClock);
  const [tempClockSize, setTempClockSize] = useState(homeClockSize);
  const [tempClockPosition, setTempClockPosition] = useState(homeClockPosition);
  const [tempBgType, setTempBgType] = useState(homeBackgroundType);
  const [tempBgValue, setTempBgValue] = useState(homeBackgroundValue);
  
  const [showToast, setShowToast] = useState(false);

  // CRITICAL FIX: Image Compression Logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create an off-screen canvas to resize the image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while resizing
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 70% quality to save LocalStorage space
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setTempBgValue(compressedBase64);
      };
      
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setHomeShowClock(tempShowClock);
    setHomeClockSize(tempClockSize);
    setHomeClockPosition(tempClockPosition);
    setHomeBackground(tempBgType, tempBgValue);
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      if(onClose) onClose();
    }, 1000);
  };

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">Environment Settings</h3>

      <div className="space-y-8">
        {/* Clock Settings */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">Display Clock</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={tempShowClock} onChange={(e) => setTempShowClock(e.target.checked)} />
              <div className="w-12 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-700 peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-200"></div>
            </label>
          </div>

          {tempShowClock && (
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2">Clock Size</label>
                <select value={tempClockSize} onChange={(e) => setTempClockSize(e.target.value as any)} className="w-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors">
                  <option value="small">Compact</option>
                  <option value="medium">Default</option>
                  <option value="large">Massive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2">Position</label>
                <select value={tempClockPosition} onChange={(e) => setTempClockPosition(e.target.value as any)} className="w-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors">
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Background Settings */}
        <div className="pb-4">
          <label className="block text-sm font-semibold tracking-wider uppercase text-neutral-800 dark:text-neutral-200 mb-4">Background Style</label>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {['default', 'solid', 'gradient', 'image'].map((type) => (
              <button 
                key={type}
                onClick={() => {
                  setTempBgType(type as any);
                  setTempBgValue(''); 
                }}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                  tempBgType === type 
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md' 
                    : 'bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* DYNAMIC SETTINGS */}
          {tempBgType === 'solid' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">Matte Presets</label>
              <div className="flex flex-wrap gap-3 mb-4">
                {SOLID_PRESETS.map(color => (
                  <button key={color} onClick={() => setTempBgValue(color)} className={`w-10 h-10 rounded-full border-2 transition-transform ${tempBgValue === color ? 'border-neutral-400 dark:border-neutral-300 scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
              <input type="text" value={tempBgValue} onChange={(e) => setTempBgValue(e.target.value)} placeholder="Hex Code (e.g. #111111)" className="w-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors"/>
            </div>
          )}

          {tempBgType === 'gradient' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">Matte & Deep Gradients</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {GRADIENT_PRESETS.map((grad, i) => (
                  <button key={i} onClick={() => setTempBgValue(grad)} className={`h-12 rounded-xl border-2 transition-all ${tempBgValue === grad ? 'border-neutral-400 dark:border-neutral-300 scale-[1.02] shadow-sm' : 'border-transparent hover:scale-[1.02]'}`} style={{ backgroundImage: grad }} />
                ))}
              </div>
              <input type="text" value={tempBgValue} onChange={(e) => setTempBgValue(e.target.value)} placeholder="Custom CSS Gradient..." className="w-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors"/>
            </div>
          )}

          {tempBgType === 'image' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">Upload Wallpaper (Auto-compressed to save space)</label>
              <div className="flex flex-col gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-neutral-500 dark:text-neutral-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-900 hover:file:bg-neutral-200 dark:file:bg-neutral-800 dark:file:text-neutral-200 dark:hover:file:bg-neutral-700 transition-colors cursor-pointer"
                />
                {tempBgValue && tempBgValue.startsWith('data:image') && (
                  <div className="h-40 w-full rounded-2xl bg-cover bg-center mt-2 border border-neutral-200 dark:border-neutral-800 shadow-inner" style={{ backgroundImage: `url(${tempBgValue})` }} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-6 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
          <span className={`text-sm font-medium text-green-600 dark:text-green-400 transition-opacity duration-300 ${showToast ? 'opacity-100' : 'opacity-0'}`}>
            Environment updated
          </span>
          <button 
            onClick={handleSave}
            className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}