import { useRef } from 'react';
import { Settings, Image as ImageIcon, PaintBucket, LayoutTemplate, X, ChevronUp, Minus, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HomeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset Gradients
const GRADIENTS = [
  'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', // Pink
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', // Light Blue
  'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', // Silver
  'linear-gradient(135deg, #434343 0%, #000000 100%)', // Dark Mode Focus
];

export default function HomeSettings({ isOpen, onClose }: HomeSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    homeShowClock, setHomeShowClock,
    homeClockSize, setHomeClockSize,
    homeClockPosition, setHomeClockPosition,
    homeBackgroundType, homeBackgroundValue, setHomeBackground
  } = useAppStore();

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHomeBackground('image', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getButtonStyle = (type: string) => {
    const isActive = homeBackgroundType === type;
    return `relative p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all duration-300 overflow-hidden cursor-pointer border-2 ${
      isActive 
        ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]' 
        : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-zinc-200 hover:border-white/10'
    }`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      <div className="bg-[#121215] border border-white/10 w-full max-w-md rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2.5 tracking-wide">
            <Settings size={18} className="text-blue-400" /> Home Customization
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-100 hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Clock Section */}
          <div className="space-y-3">
            <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Clock Settings</span>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <span className="font-semibold text-zinc-100 block">Show Live Clock</span>
                <span className="text-xs text-zinc-500">Display digital time on the screen</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={homeShowClock} onChange={(e) => setHomeShowClock(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {/* Clock Controls */}
            {homeShowClock && (
              <div className="flex gap-2">
                {/* Size Selector */}
                <div className="flex-1 p-1 bg-white/5 rounded-xl flex items-center">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setHomeClockSize(size)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${homeClockSize === size ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {/* Position Selector (Using Safe Icons) */}
                <div className="p-1 bg-white/5 rounded-xl flex items-center gap-1">
                  <button onClick={() => setHomeClockPosition('top')} className={`p-2 rounded-lg transition-all ${homeClockPosition === 'top' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`} title="Top">
                    <ChevronUp size={16} />
                  </button>
                  <button onClick={() => setHomeClockPosition('center')} className={`p-2 rounded-lg transition-all ${homeClockPosition === 'center' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`} title="Center">
                    <Minus size={16} />
                  </button>
                  <button onClick={() => setHomeClockPosition('bottom')} className={`p-2 rounded-lg transition-all ${homeClockPosition === 'bottom' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`} title="Bottom">
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Background Selection */}
          <div className="space-y-3">
            <span className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Background Style</span>
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setHomeBackground('default', '')} className={getButtonStyle('default')}>
                <LayoutTemplate size={24} strokeWidth={1.5} /> 
                <span className="text-xs font-semibold tracking-wide">Default UI</span>
              </button>
              
              {/* Gradient Trigger */}
              <button onClick={() => setHomeBackground('gradient', GRADIENTS[0])} className={getButtonStyle('gradient')}>
                <PaintBucket size={24} strokeWidth={1.5} /> 
                <span className="text-xs font-semibold tracking-wide">Gradient</span>
              </button>

              <div className={getButtonStyle('solid')}>
                <PaintBucket size={24} strokeWidth={1.5} /> 
                <span className="text-xs font-semibold tracking-wide flex items-center gap-2">
                  Solid Color {homeBackgroundType === 'solid' && <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: homeBackgroundValue }}/>}
                </span>
                <input type="color" value={homeBackgroundType === 'solid' ? homeBackgroundValue : '#000000'} onChange={(e) => setHomeBackground('solid', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>

              <div onClick={() => fileInputRef.current?.click()} className={getButtonStyle('image')}>
                <ImageIcon size={24} strokeWidth={1.5} /> 
                <span className="text-xs font-semibold tracking-wide">Custom Image</span>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            {/* Gradient Swatches */}
            {homeBackgroundType === 'gradient' && (
              <div className="flex gap-2 p-2 bg-white/5 rounded-2xl overflow-x-auto custom-scrollbar mt-2">
                {GRADIENTS.map((grad, i) => (
                  <button
                    key={i}
                    onClick={() => setHomeBackground('gradient', grad)}
                    className={`shrink-0 w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${homeBackgroundValue === grad ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                    style={{ background: grad }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}