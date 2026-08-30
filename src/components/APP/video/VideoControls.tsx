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
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
      
      {/* Scrubber Progress Bar */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={progress || 0}
        onChange={onSeek}
        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:h-2 transition-all"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onTogglePlay} className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button onClick={() => onSkipTime(-10)} className="text-zinc-400 hover:text-white transition-colors" title="Rewind 10s">
            <RotateCcw size={16} />
          </button>
          <button onClick={() => onSkipTime(10)} className="text-zinc-400 hover:text-white transition-colors" title="Forward 10s">
            <RotateCw size={16} />
          </button>

          <div className="flex items-center gap-2">
            <button onClick={onToggleMute} className="text-zinc-400 hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>

        <button onClick={onFullscreen} className="text-zinc-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}