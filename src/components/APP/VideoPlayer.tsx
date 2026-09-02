import { useState, useRef, useEffect } from 'react';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { invoke, convertFileSrc } from '@tauri-apps/api/core';

import VideoHeader from './video/VideoHeader';
import VideoSidebar from './video/VideoSidebar';
import VideoControls from './video/VideoControls';

interface VideoItem {
  name: string;
  path: string;
}

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoSrc, setVideoSrc] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [videoTitle, setVideoTitle] = useState('Big Buck Bunny (Sample Stream)');
  const [systemVideos, setSystemVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSystemVideos = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await invoke<VideoItem[]>('scan_system_videos');
      setSystemVideos(result || []);
    } catch (error: any) {
      console.error("Failed to scan videos:", error);
      setErrorMessage(`Scan Error: ${error.toString()}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSystemVideos();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => setErrorMessage(`Playback error: ${err.message}`));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total && !isNaN(total) && isFinite(total) && total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (videoRef.current && videoRef.current.duration && isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
      videoRef.current.currentTime = (value / 100) * videoRef.current.duration;
    }
  };

  const handleSkipTime = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoSrc(fileUrl);
      setVideoTitle(file.name);
      setErrorMessage(null);
      setIsPlaying(false);
    }
  };

  const playSystemVideo = async (video: VideoItem) => {
    setVideoTitle(`Preparing ${video.name}...`);
    setErrorMessage(null);
    setIsTranscoding(true);

    try {
      const processedPath = await invoke<string>('prepare_video_playback', { filePath: video.path });
      if (processedPath) {
        const assetUrl = convertFileSrc(processedPath);
        setVideoSrc(assetUrl);
        setVideoTitle(video.name);
        setIsTranscoding(false);
        setIsPlaying(true);
        setTimeout(() => {
          if (videoRef.current) videoRef.current.play().catch(e => setErrorMessage(`Autoplay blocked: ${e.message}`));
        }, 150);
      }
    } catch (error: any) {
      setIsTranscoding(false);
      setErrorMessage(`Failed to prepare video: ${error.toString()}`);
      setVideoTitle("Playback Failed");
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    // Fixed: Now syncs with global light/dark theme seamlessly
    <div className="h-full flex flex-col bg-white/50 dark:bg-[#0a0a0c]/80 text-slate-900 dark:text-zinc-100 rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_1rem_3rem_rgba(0,0,0,0.5)] p-[1.5rem] md:p-[2rem] gap-[1.5rem] transition-colors duration-500">
      
      <VideoHeader isLoading={isLoading} onScan={fetchSystemVideos} onFileSelect={handleFileSelect} />

      {/* Error Box Fixed: Adapts to theme properly */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-[1rem] py-[0.75rem] rounded-[1rem] flex items-center gap-[0.75rem] shrink-0">
          <AlertCircle className="w-[1rem] h-[1rem] shrink-0" />
          <span className="font-mono text-[0.75em]">{errorMessage}</span>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-[1.5rem] overflow-hidden">
        
        <VideoSidebar videos={systemVideos} onSelectVideo={playSystemVideo} />

        {/* Video Player remains dark internally because videos need a black canvas */}
        <div className="lg:col-span-3 bg-black rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-white/10 relative group flex flex-col shadow-inner">
          
          {isTranscoding && (
            <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-[0.75rem]">
              <Loader2 className="w-[2.25rem] h-[2.25rem] text-rose-500 animate-spin" />
              <p className="text-[0.75em] font-mono text-zinc-300">Optimizing codecs for custom player...</p>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
            onError={() => setErrorMessage("Custom player error: Failed to decode video source.")}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer flex-1"
          />

          <div className="absolute top-[1rem] left-[1rem] bg-black/60 backdrop-blur-md px-[1rem] py-[0.5rem] rounded-[1rem] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-[0.5rem] pointer-events-none z-20">
            <Sparkles className="w-[0.9rem] h-[0.9rem] text-rose-400 shrink-0" />
            <span className="text-[0.75em] font-medium text-zinc-200 truncate max-w-[20rem]">{videoTitle}</span>
          </div>

          <VideoControls 
            isPlaying={isPlaying} progress={progress} volume={volume} isMuted={isMuted}
            onTogglePlay={togglePlay} onSeek={handleSeek} onSkipTime={handleSkipTime}
            onVolumeChange={handleVolumeChange} onToggleMute={() => setIsMuted(!isMuted)} onFullscreen={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
}