import React, { useState } from 'react';
import { ListOrdered, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useMusicStore } from '../../../../store/useMusicStore';

export const UpNextQueue = () => {
  const { queue, playlist, removeFromQueue, clearQueue } = useMusicStore();
  const [isQueueExpanded, setIsQueueExpanded] = useState(false);

  if (queue.length === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-3xl border-t border-slate-200 dark:border-white/10 z-30 transition-all duration-300 rounded-bl-[1.5rem] lg:rounded-bl-none shadow-[0_-0.5rem_2rem_-0.5rem_rgba(0,0,0,0.1)] dark:shadow-[0_-0.5rem_2rem_-0.5rem_rgba(0,0,0,0.5)]">
      <div className="p-[0.75rem] flex items-center justify-between cursor-pointer" onClick={() => setIsQueueExpanded(!isQueueExpanded)}>
        <div className="flex items-center gap-[0.5rem]">
          <ListOrdered className="w-[1.2rem] h-[1.2rem] text-blue-500" />
          <span className="text-[0.9em] font-bold text-slate-800 dark:text-white">Up Next <span className="text-blue-500 bg-blue-500/10 px-[0.4rem] rounded-[0.4rem] text-[0.7em] ml-[0.25rem]">{queue.length}</span></span>
        </div>
        <div className="flex items-center gap-[0.75rem]">
          <button onClick={(e) => { e.stopPropagation(); clearQueue(); setIsQueueExpanded(false); }} className="text-[0.7em] uppercase tracking-wider font-bold text-slate-400 hover:text-red-500 transition-colors">Clear</button>
          <div className="p-[0.25rem] bg-slate-100 dark:bg-white/10 rounded-[0.4rem] text-slate-500 dark:text-white/60">
            {isQueueExpanded ? <ChevronDown className="w-[1rem] h-[1rem]" /> : <ChevronUp className="w-[1rem] h-[1rem]" />}
          </div>
        </div>
      </div>
      
      {isQueueExpanded && (
        <div className="max-h-[14rem] overflow-y-auto custom-scrollbar p-[0.5rem] space-y-[0.25rem] animate-in slide-in-from-bottom-2">
          {queue.map((path, idx) => {
            const qTrack = playlist.find(t => t.path === path);
            if (!qTrack) return null;
            return (
              <div key={idx} className="flex items-center gap-[0.75rem] p-[0.5rem] hover:bg-slate-100 dark:hover:bg-white/5 rounded-[0.75rem] transition-colors group">
                <img src={qTrack.coverUrl || 'placeholder.jpg'} loading="lazy" decoding="async" className="w-[2rem] h-[2rem] rounded-[0.5rem] object-cover bg-slate-200 dark:bg-white/10" />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8em] font-bold text-slate-800 dark:text-white truncate">{qTrack.title}</p>
                  <p className="text-[0.7em] text-slate-500 dark:text-white/50 truncate">{qTrack.artist}</p>
                </div>
                <button onClick={() => removeFromQueue(idx)} className="p-[0.4rem] text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 rounded-[0.4rem] transition-all"><X className="w-[1rem] h-[1rem]"/></button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};