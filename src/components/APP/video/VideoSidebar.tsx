import { HardDrive, Film } from 'lucide-react';

interface VideoItem {
  name: string;
  path: string;
}

interface VideoSidebarProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
}

export default function VideoSidebar({ videos, onSelectVideo }: VideoSidebarProps) {
  return (
    <div className="lg:col-span-1 bg-slate-100/60 dark:bg-black/40 border border-slate-200 dark:border-white/15 rounded-[1.5rem] p-[1rem] flex flex-col overflow-hidden transition-colors">
      
      <div className="flex items-center justify-between mb-[0.75rem] pb-[0.5rem] border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-[0.5rem] text-[0.75em] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          <HardDrive className="w-[1rem] h-[1rem] text-rose-500" />
          <span>~/Videos Directory</span>
        </div>
        <span className="text-[0.65em] bg-slate-200 dark:bg-zinc-800 px-[0.5rem] py-[0.15rem] rounded-full text-slate-600 dark:text-zinc-400 font-mono">
          {videos.length} found
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-[0.5rem] pr-[0.25rem] custom-scrollbar">
        {videos.length === 0 ? (
          <div className="text-center py-[2.5rem] text-[0.75em] text-slate-500 dark:text-zinc-500 px-[1rem]">
            No videos found in your Windows `Videos` folder. Click "Scan" or browse manually.
          </div>
        ) : (
          videos.map((vid, idx) => (
            <button
              key={idx}
              onClick={() => onSelectVideo(vid)}
              className="w-full text-left p-[0.75rem] rounded-[1rem] bg-white/60 hover:bg-white dark:bg-zinc-900/60 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all group flex items-center gap-[0.75rem]"
            >
              <div className="p-[0.5rem] rounded-[0.75rem] bg-rose-500/10 text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform shrink-0">
                <Film className="w-[1rem] h-[1rem]" />
              </div>
              <div className="truncate">
                <p className="text-[0.75em] font-medium text-slate-800 dark:text-zinc-200 truncate">{vid.name}</p>
                <p className="text-[0.65em] text-slate-500 truncate">{vid.path}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}