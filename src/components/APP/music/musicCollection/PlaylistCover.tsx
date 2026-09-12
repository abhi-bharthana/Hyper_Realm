import React from 'react';
import { List } from 'lucide-react';
import { Track } from '../../../../store/useMusicStore';

interface Props {
  trackPaths: string[];
  allTracks: Track[];
  historyPaths: string[];
}

export const PlaylistCover = ({ trackPaths, allTracks, historyPaths }: Props) => {
  const playlistTracks = trackPaths.map(p => allTracks.find(t => t.path === p)).filter(Boolean) as Track[];
  const sortedTracks = [...playlistTracks].sort((a, b) => {
    const indexA = historyPaths.indexOf(a.path);
    const indexB = historyPaths.indexOf(b.path);
    return (indexA === -1 ? 9999 : indexA) - (indexB === -1 ? 9999 : indexB);
  });
  
  const uniqueCovers = Array.from(new Set(sortedTracks.map(t => t.coverUrl).filter(url => url !== '')));
  const covers = uniqueCovers.slice(0, 4);

  const baseClasses = "w-[3rem] h-[3rem] rounded-[0.75rem] overflow-hidden shrink-0 border border-slate-200 dark:border-white/10";

  if (covers.length === 0) return <div className={`${baseClasses} bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400`}><List className="w-[1.2rem] h-[1.2rem]" /></div>;
  if (covers.length === 1) return <img src={covers[0]} loading="lazy" decoding="async" className={`${baseClasses} object-cover`} alt="Cover" />;
  if (covers.length === 2) return <div className={`${baseClasses} grid grid-cols-2 gap-[0.1rem] bg-slate-300 dark:bg-slate-800`}><img src={covers[0]} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Cover 1" /><img src={covers[1]} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Cover 2" /></div>;
  if (covers.length === 3) return <div className={`${baseClasses} grid grid-cols-2 grid-rows-2 gap-[0.1rem] bg-slate-300 dark:bg-slate-800`}><img src={covers[0]} loading="lazy" decoding="async" className="w-full h-full object-cover col-span-2 row-span-1" alt="Cover 1" /><img src={covers[1]} loading="lazy" decoding="async" className="w-full h-full object-cover col-span-1 row-span-1" alt="Cover 2" /><img src={covers[2]} loading="lazy" decoding="async" className="w-full h-full object-cover col-span-1 row-span-1" alt="Cover 3" /></div>;
  
  return (
    <div className={`${baseClasses} grid grid-cols-2 grid-rows-2 gap-[0.1rem] bg-slate-300 dark:bg-slate-800`}>
      <img src={covers[0]} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Cover 1" />
      <img src={covers[1]} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Cover 2" />
      <img src={covers[2]} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Cover 3" />
      <img src={covers[3]} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Cover 4" />
    </div>
  );
};