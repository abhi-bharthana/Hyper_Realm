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
    <div className="lg:col-span-1 bg-black/40 border border-white/15 rounded-3xl p-4 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <HardDrive size={14} className="text-rose-500" />
          <span>~/Videos Directory</span>
        </div>
        <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 font-mono">{videos.length} found</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {videos.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500 px-4">
            No videos found in your Windows `Videos` folder. Click "Scan" or browse manually.
          </div>
        ) : (
          videos.map((vid, idx) => (
            <button
              key={idx}
              onClick={() => onSelectVideo(vid)}
              className="w-full text-left p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800 border border-white/5 hover:border-white/10 transition-all group flex items-center gap-3"
            >
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform shrink-0">
                <Film size={14} />
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-zinc-200 truncate">{vid.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{vid.path}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}