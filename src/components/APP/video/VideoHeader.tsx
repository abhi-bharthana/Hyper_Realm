import { Film, RefreshCw, FolderOpen } from 'lucide-react';

interface VideoHeaderProps {
  isLoading: boolean;
  onScan: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VideoHeader({ isLoading, onScan, onFileSelect }: VideoHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-[1rem] border-b border-slate-200 dark:border-white/15 shrink-0 transition-colors">
      <div>
        <div className="flex items-center gap-[0.75rem] mb-[0.25rem]">
          <div className="p-[0.7rem] bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-[1rem]">
            <Film className="w-[1.4rem] h-[1.4rem]" />
          </div>
          <h2 className="text-[1.5em] font-bold tracking-tight text-slate-900 dark:text-zinc-100">Hyper-Media Center</h2>
        </div>
        <p className="text-[0.75em] text-slate-500 dark:text-zinc-400 font-medium">
          Universal playback engine with modular architecture.
        </p>
      </div>
      
      <div className="flex items-center gap-[0.75rem]">
        {/* Sync Button: Adapts to light/dark */}
        <button 
          onClick={onScan}
          className="flex items-center gap-[0.5rem] px-[1rem] py-[0.6rem] bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-[1rem] text-[0.8em] font-semibold transition-all"
        >
          <RefreshCw className={`w-[1rem] h-[1rem] ${isLoading ? "animate-spin" : ""}`} />
          <span>Scan Videos Folder</span>
        </button>
        
        <label className="flex items-center gap-[0.5rem] px-[1rem] py-[0.6rem] bg-rose-600 hover:bg-rose-500 text-white rounded-[1rem] text-[0.8em] font-bold cursor-pointer transition-all shadow-[0_0.5rem_1rem_rgba(244,63,94,0.2)]">
          <FolderOpen className="w-[1rem] h-[1rem]" />
          <span>Browse File</span>
          <input type="file" accept="video/*" onChange={onFileSelect} className="hidden" />
        </label>
      </div>
    </div>
  );
}