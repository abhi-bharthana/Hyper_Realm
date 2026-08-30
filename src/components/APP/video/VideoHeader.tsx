import { Film, RefreshCw, FolderOpen } from 'lucide-react';

interface VideoHeaderProps {
  isLoading: boolean;
  onScan: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VideoHeader({ isLoading, onScan, onFileSelect }: VideoHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-white/15 shrink-0">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-2xl">
            <Film size={22} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Hyper-Media Center</h2>
        </div>
        <p className="text-xs text-zinc-400 font-medium">
          Universal playback engine with modular architecture.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onScan}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-2xl text-xs font-semibold transition-all"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Scan Videos Folder</span>
        </button>

        <label className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-rose-500/20">
          <FolderOpen size={15} />
          <span>Browse File</span>
          <input type="file" accept="video/*" onChange={onFileSelect} className="hidden" />
        </label>
      </div>
    </div>
  );
}