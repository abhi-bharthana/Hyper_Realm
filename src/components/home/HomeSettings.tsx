import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function HomeSettings() {
  // Store se real values pull karo
  const { 
    homeShowClock, homeClockSize, homeClockPosition, homeBackgroundType, homeBackgroundValue,
    setHomeShowClock, setHomeClockSize, setHomeClockPosition, setHomeBackground 
  } = useAppStore();

  // Temporary local states taaki "Save" click hone se pehle apply na ho
  const [tempShowClock, setTempShowClock] = useState(homeShowClock);
  const [tempClockSize, setTempClockSize] = useState(homeClockSize);
  const [tempClockPosition, setTempClockPosition] = useState(homeClockPosition);
  const [tempBgType, setTempBgType] = useState(homeBackgroundType);
  const [tempBgValue, setTempBgValue] = useState(homeBackgroundValue);
  
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    // Zustand store update karo (ye permanently save ho jayega automatically)
    setHomeShowClock(tempShowClock);
    setHomeClockSize(tempClockSize);
    setHomeClockPosition(tempClockPosition);
    setHomeBackground(tempBgType, tempBgValue);
    
    // Success Toast show karo
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-xl shadow-sm relative">
      <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Home Environment Settings</h3>

      <div className="space-y-6">
        {/* Clock Settings */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Display Clock</h4>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={tempShowClock} onChange={(e) => setTempShowClock(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-500"></div>
            </label>
          </div>

          {tempShowClock && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Clock Size</label>
                <select 
                  value={tempClockSize} onChange={(e) => setTempClockSize(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Clock Position</label>
                <select 
                  value={tempClockPosition} onChange={(e) => setTempClockPosition(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Background Settings */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Background Style</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {['default', 'solid', 'gradient', 'image'].map((type) => (
              <button 
                key={type}
                onClick={() => setTempBgType(type as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  tempBgType === type ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {tempBgType !== 'default' && (
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                {tempBgType === 'solid' ? 'Hex Color Code' : tempBgType === 'gradient' ? 'CSS Gradient' : 'Image URL'}
              </label>
              <input 
                type="text" 
                value={tempBgValue} 
                onChange={(e) => setTempBgValue(e.target.value)}
                placeholder={tempBgType === 'solid' ? '#1a1a2e' : tempBgType === 'gradient' ? 'linear-gradient(to right, #0f2027, #203a43)' : 'https://example.com/bg.jpg'}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 flex items-center justify-between">
          <span className={`text-sm font-medium text-emerald-500 transition-opacity duration-300 ${showToast ? 'opacity-100' : 'opacity-0'}`}>
            Settings saved successfully!
          </span>
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}