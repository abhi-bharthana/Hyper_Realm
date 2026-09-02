import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const SOLID_PRESETS = [
  '#0a0a0a', '#171717', '#262626', 
  '#fafafa', '#f5f5f5', '#e5e5e5', 
  '#27272a', '#1c1917', '#0f172a'  
];

const GRADIENT_PRESETS = [
  'linear-gradient(to right, #141e30, #243b55)', 
  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', 
  'linear-gradient(to right, #434343 0%, black 100%)', 
  'linear-gradient(to top, #09203f 0%, #537895 100%)', 
  'linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgba(63, 61, 61, 1) 78.9%)' 
];

export default function HomeSettings({ onClose }: { onClose?: () => void }) {
  const { 
    homeShowClock, homeClockSize, homeClockPosition, homeBackgroundType, homeBackgroundValue,
    showMusicWidget,
    setHomeShowClock, setHomeClockSize, setHomeClockPosition, setHomeBackground,
    setShowMusicWidget 
  } = useAppStore();

  const [tempShowClock, setTempShowClock] = useState(homeShowClock);
  const [tempClockSize, setTempClockSize] = useState(homeClockSize);
  const [tempClockPosition, setTempClockPosition] = useState(homeClockPosition);
  const [tempBgType, setTempBgType] = useState(homeBackgroundType);
  const [tempBgValue, setTempBgValue] = useState(homeBackgroundValue);
  const [tempShowMusicWidget, setTempShowMusicWidget] = useState(showMusicWidget);
  const [showToast, setShowToast] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setTempBgValue(compressedBase64);
      };
      if (typeof event.target?.result === 'string') img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setHomeShowClock(tempShowClock);
    setHomeClockSize(tempClockSize);
    setHomeClockPosition(tempClockPosition);
    setHomeBackground(tempBgType, tempBgValue);
    setShowMusicWidget(tempShowMusicWidget);
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      if(onClose) onClose();
    }, 1000);
  };

  return (
    <div className="p-[2.5em] flex flex-col">
      <h3 className="text-[1.8em] font-bold mb-[1em] text-neutral-900 dark:text-neutral-100 tracking-tight">
        Environment Settings
      </h3>

      <div className="flex flex-col gap-[2em]">
        
        {/* Clock Settings */}
        <div className="flex flex-col gap-[1.5em] border-b border-neutral-200/60 dark:border-white/10 pb-[2em]">
          <div className="flex items-center justify-between">
            <h4 className="text-[1.1em] font-semibold text-neutral-800 dark:text-neutral-200">Display Clock</h4>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" checked={tempShowClock} onChange={(e) => setTempShowClock(e.target.checked)} />
              {/* Toggle switch completely relative scaled */}
              <div className="w-[3.5em] h-[1.8em] rounded-full transition-colors duration-300 relative bg-neutral-300 dark:bg-white/10 peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-100">
                <div className={`absolute top-[0.2em] left-[0.2em] w-[1.4em] h-[1.4em] rounded-full bg-white dark:bg-[#111] transition-transform duration-300 ${tempShowClock ? 'translate-x-[1.7em]' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>

          {tempShowClock && (
            <div className="grid grid-cols-2 gap-[1.5em] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col gap-[0.5em]">
                <label className="text-[0.75em] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">Clock Size</label>
                <select value={tempClockSize} onChange={(e) => setTempClockSize(e.target.value as any)} className="w-full bg-neutral-100/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-[0.75em] px-[1em] py-[0.75em] text-[0.95em] font-medium text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 transition-colors">
                  <option value="small">Compact</option>
                  <option value="medium">Default</option>
                  <option value="large">Massive</option>
                </select>
              </div>
              <div className="flex flex-col gap-[0.5em]">
                <label className="text-[0.75em] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">Position</label>
                <select value={tempClockPosition} onChange={(e) => setTempClockPosition(e.target.value as any)} className="w-full bg-neutral-100/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-[0.75em] px-[1em] py-[0.75em] text-[0.95em] font-medium text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 transition-colors">
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Floating Music Player */}
        <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-white/10 pb-[2em]">
          <div className="flex flex-col gap-[0.25em]">
            <h4 className="text-[1.1em] font-semibold text-neutral-800 dark:text-neutral-200">Floating Music Player</h4>
            <p className="text-[0.85em] text-neutral-500">Display a mini interactive music player on the Home screen</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" className="sr-only peer" checked={tempShowMusicWidget} onChange={(e) => setTempShowMusicWidget(e.target.checked)} />
            <div className="w-[3.5em] h-[1.8em] rounded-full transition-colors duration-300 relative bg-neutral-300 dark:bg-white/10 peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-100">
              <div className={`absolute top-[0.2em] left-[0.2em] w-[1.4em] h-[1.4em] rounded-full bg-white dark:bg-[#111] transition-transform duration-300 ${tempShowMusicWidget ? 'translate-x-[1.7em]' : 'translate-x-0'}`} />
            </div>
          </label>
        </div>

        {/* Background Settings */}
        <div className="flex flex-col gap-[1.5em] pb-[1em]">
          <label className="text-[0.85em] font-bold tracking-wider uppercase text-neutral-800 dark:text-neutral-200">Background Style</label>
          <div className="grid grid-cols-4 gap-[0.5em]">
            {['default', 'solid', 'gradient', 'image'].map((type) => (
              <button 
                key={type}
                onClick={() => { setTempBgType(type as any); setTempBgValue(''); }}
                className={`px-[1em] py-[0.75em] rounded-[0.75em] text-[0.9em] font-semibold capitalize transition-all duration-200 ${
                  tempBgType === type 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-[0_0.5em_1em_rgba(0,0,0,0.1)]' 
                    : 'bg-neutral-100/80 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {tempBgType === 'solid' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-[0.75em]">
              <label className="text-[0.8em] font-medium text-neutral-500 dark:text-neutral-400">Matte Presets</label>
              <div className="flex flex-wrap gap-[0.75em]">
                {SOLID_PRESETS.map(color => (
                  <button key={color} onClick={() => setTempBgValue(color)} className={`w-[2.5em] h-[2.5em] rounded-full border-[0.15em] transition-transform ${tempBgValue === color ? 'border-neutral-400 dark:border-neutral-300 scale-110 shadow-[0_0.2em_0.5em_rgba(0,0,0,0.2)]' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
              <input type="text" value={tempBgValue} onChange={(e) => setTempBgValue(e.target.value)} placeholder="Hex Code (e.g. #111111)" className="w-full bg-neutral-100/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-[0.75em] px-[1em] py-[0.75em] text-[0.95em] font-medium text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 transition-colors"/>
            </div>
          )}

          {tempBgType === 'gradient' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-[0.75em]">
              <label className="text-[0.8em] font-medium text-neutral-500 dark:text-neutral-400">Matte & Deep Gradients</label>
              <div className="grid grid-cols-2 gap-[0.75em]">
                {GRADIENT_PRESETS.map((grad, i) => (
                  <button key={i} onClick={() => setTempBgValue(grad)} className={`h-[3.5em] rounded-[0.75em] border-[0.15em] transition-all ${tempBgValue === grad ? 'border-neutral-400 dark:border-white/50 scale-[1.02] shadow-[0_0.2em_0.5em_rgba(0,0,0,0.2)]' : 'border-transparent hover:scale-[1.02]'}`} style={{ backgroundImage: grad }} />
                ))}
              </div>
              <input type="text" value={tempBgValue} onChange={(e) => setTempBgValue(e.target.value)} placeholder="Custom CSS Gradient..." className="w-full bg-neutral-100/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-[0.75em] px-[1em] py-[0.75em] text-[0.95em] font-medium text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 transition-colors"/>
            </div>
          )}

          {tempBgType === 'image' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-[0.75em]">
              <label className="text-[0.8em] font-medium text-neutral-500 dark:text-neutral-400">Upload Wallpaper</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-[0.9em] text-neutral-500 dark:text-neutral-400 file:mr-[1em] file:py-[0.5em] file:px-[1em] file:rounded-[0.5em] file:border-0 file:font-semibold file:bg-neutral-200 dark:file:bg-white/10 file:text-neutral-900 dark:file:text-neutral-200 hover:file:bg-neutral-300 dark:hover:file:bg-white/20 transition-colors cursor-pointer"
              />
              {tempBgValue && tempBgValue.startsWith('data:image') && (
                <div className="h-[12em] w-full rounded-[1em] bg-cover bg-center border border-neutral-200 dark:border-white/10 shadow-inner" style={{ backgroundImage: `url(${tempBgValue})` }} />
              )}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="pt-[1.5em] flex items-center justify-between border-t border-neutral-200/60 dark:border-white/10">
          <span className={`text-[0.9em] font-medium text-emerald-600 dark:text-emerald-400 transition-opacity duration-300 ${showToast ? 'opacity-100' : 'opacity-0'}`}>
            Environment updated
          </span>
          <button 
            onClick={handleSave}
            className="bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black px-[2em] py-[0.75em] rounded-[0.75em] text-[0.95em] font-bold shadow-[0_0.5em_1em_rgba(0,0,0,0.15)] transition-all active:scale-95"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}