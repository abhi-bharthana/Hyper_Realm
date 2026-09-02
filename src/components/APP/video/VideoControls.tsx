import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  progress: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkipTime: (amount: number) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onFullscreen: () => void;
}

export default function VideoControls({
  isPlaying, progress, volume, isMuted,
  onTogglePlay, onSeek, onSkipTime, onVolumeChange, onToggleMute, onFullscreen
}: VideoControlsProps) {
  return (
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-[1rem] flex flex-col gap-[0.75rem] opacity-0 group-hover:opacity-100 transition-opacity">
      
      {/* Scrubber Progress Bar */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={progress || 0}
        onChange={onSeek}
        className="w-full h-[0.4rem] bg-white/20 rounded-full appearance-none cursor-pointer accent-rose-500 hover:h-[0.5rem] transition-all"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1rem]">
          <button onClick={onTogglePlay} className="p-[0.5rem] rounded-[0.75rem] bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md">
            {isPlaying ? <Pause className="w-[1.2rem] h-[1.2rem]" /> : <Play className="w-[1.2rem] h-[1.2rem]" />}
          </button>
          
          <button onClick={() => onSkipTime(-10)} className="text-zinc-400 hover:text-white transition-colors" title="Rewind 10s">
            <RotateCcw className="w-[1.1rem] h-[1.1rem]" />
          </button>
          
          <button onClick={() => onSkipTime(10)} className="text-zinc-400 hover:text-white transition-colors" title="Forward 10s">
            <RotateCw className="w-[1.1rem] h-[1.1rem]" />
          </button>
          
          <div className="flex items-center gap-[0.5rem]">
            <button onClick={onToggleMute} className="text-zinc-400 hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-[1.2rem] h-[1.2rem]" /> : <Volume2 className="w-[1.2rem] h-[1.2rem]" />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="w-[5rem] h-[0.3rem] bg-white/20 rounded-full appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
        
        <button onClick={onFullscreen} className="text-zinc-400 hover:text-white transition-colors p-[0.5rem] rounded-[0.75rem] hover:bg-white/10">
          <Maximize className="w-[1.2rem] h-[1.2rem]" />
        </button>
      </div>
    </div>
  );
}