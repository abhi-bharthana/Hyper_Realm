import { Sun, Moon, Monitor, Palette, Maximize2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Settings() {
  const { theme, setTheme, uiDensity, setUiDensity } = useAppStore();

  return (
    <div className="flex flex-col gap-6 h-full pb-4 max-w-3xl">
      {/* Theme Configuration Card */}
      <div className="bg-white/70 dark:bg-zinc-900/80 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2 flex items-center">
          <Palette className="mr-3 text-zinc-500" size={20} /> Appearance & Theme
        </h4>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
          Choose your interface aesthetic or sync directly with OS appearance.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <ThemeOption active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun size={18} />} label="Light" />
          <ThemeOption active={theme === 'system'} onClick={() => setTheme('system')} icon={<Monitor size={18} />} label="Auto (OS)" />
          <ThemeOption active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon size={18} />} label="Matte Dark" />
        </div>
      </div>

      {/* UI Size / Density Configuration Card */}
      <div className="bg-white/70 dark:bg-zinc-900/80 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2 flex items-center">
          <Maximize2 className="mr-3 text-zinc-500" size={20} /> Interface Size & Density
        </h4>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
          Adjust workspace spacing and element scaling safely.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <DensityOption active={uiDensity === 'ultra'} onClick={() => setUiDensity('ultra')} label="Ultra" desc="Maximum Space" />
          <DensityOption active={uiDensity === 'compact'} onClick={() => setUiDensity('compact')} label="Compact" desc="High Density" />
          <DensityOption active={uiDensity === 'normal'} onClick={() => setUiDensity('normal')} label="Normal" desc="Balanced" />
          <DensityOption active={uiDensity === 'spacious'} onClick={() => setUiDensity('spacious')} label="Spacious" desc="Relaxed View" />
        </div>
      </div>
    </div>
  );
}

function ThemeOption({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-md' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-semibold tracking-wide">{label}</span>
    </button>
  );
}

function DensityOption({ active, onClick, label, desc }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-300 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-md' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      }`}
    >
      <span className="text-sm font-bold tracking-wide">{label}</span>
      <span className="text-[10px] opacity-70 mt-0.5 font-mono">{desc}</span>
    </button>
  );
}