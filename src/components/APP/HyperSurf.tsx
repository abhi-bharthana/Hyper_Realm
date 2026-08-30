import { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, RotateCw, Home, Lock, 
  Download, Plus, X, Globe, Sparkles, ExternalLink, Shield, Puzzle, Menu, Search
} from 'lucide-react';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export default function HyperSurf() {
  const [currentTime, setCurrentTime] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', url: '', active: true }
  ]);

  // Live Clock for New Tab Page (Brave/Chrome style)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Open Native Window function when URL is searched/entered
  const handleNavigate = (targetUrl: string) => {
    let finalUrl = targetUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      // If it's a search term, search via Google
      if (!finalUrl.includes('.') || finalUrl.includes(' ')) {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
      } else {
        finalUrl = `https://${finalUrl}`;
      }
    }

    try {
      new WebviewWindow(`hyper_surf_${Date.now()}`, {
        url: finalUrl,
        title: 'Hyper-Surf Browser',
        width: 1280,
        height: 720,
        decorations: true,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      });
    } catch (error) {
      console.error("Failed to open browser window:", error);
    }
  };

  const quickSites = [
    { name: 'GitHub', url: 'https://github.com', icon: '🐙', bg: 'from-zinc-800 to-black' },
    { name: 'ChatGPT', url: 'https://chatgpt.com', icon: '🤖', bg: 'from-emerald-600 to-teal-800' },
    { name: 'Google Gemini', url: 'https://gemini.google.com', icon: '✨', bg: 'from-blue-600 to-indigo-800' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️', bg: 'from-red-600 to-rose-800' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚', bg: 'from-zinc-600 to-zinc-800' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0f0f12] text-zinc-100 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      
      {/* 1. TOP BROWSER CHROME: Tabs & Window Controls */}
      <div className="flex items-center px-3 pt-2.5 bg-[#141418] border-b border-white/10 gap-2 select-none">
        
        {/* Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar flex-1">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-t-2xl text-xs font-medium transition-all max-w-[180px] cursor-pointer ${
                tab.active 
                  ? 'bg-[#0f0f12] text-zinc-100 border-t-2 border-blue-500 shadow-sm' 
                  : 'bg-[#1a1a20]/50 text-zinc-400 hover:bg-[#1a1a20]'
              }`}
            >
              <Globe size={13} className="text-blue-400 shrink-0" />
              <span className="truncate">{tab.title}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="p-0.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-zinc-200 ml-1 opacity-60 group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <button 
            onClick={() => setTabs([...tabs, { id: Date.now(), title: 'New Tab', url: '', active: false }])}
            className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors ml-1"
            title="Open New Tab"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION TOOLBAR: Back, Forward, Refresh, URL Bar, Extensions */}
      <div className="flex items-center px-3 py-2 bg-[#141418] border-b border-white/10 gap-2.5">
        
        {/* History Nav Buttons */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button className="p-1.5 rounded-xl hover:bg-white/10 hover:text-zinc-200 disabled:opacity-30 transition-colors" disabled>
            <ArrowLeft size={16} />
          </button>
          <button className="p-1.5 rounded-xl hover:bg-white/10 hover:text-zinc-200 disabled:opacity-30 transition-colors" disabled>
            <ArrowRight size={16} />
          </button>
          <button className="p-1.5 rounded-xl hover:bg-white/10 hover:text-zinc-200 transition-colors">
            <RotateCw size={15} />
          </button>
          <button className="p-1.5 rounded-xl hover:bg-white/10 hover:text-zinc-200 transition-colors">
            <Home size={15} />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-[#09090b] border border-white/10 rounded-2xl px-3.5 py-1.5 focus-within:border-blue-500/80 transition-all shadow-inner">
          <Shield size={14} className="text-emerald-400 mr-2.5 shrink-0" />
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate(inputUrl)}
            placeholder="Search with Google or enter address"
            className="w-full bg-transparent border-none outline-none text-xs text-zinc-200 font-medium placeholder:text-zinc-600"
          />
        </div>

        {/* Utility / Extensions Icons */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button className="p-2 rounded-xl hover:bg-white/10 hover:text-zinc-200 transition-colors" title="Extensions">
            <Puzzle size={16} />
          </button>
          <button className="p-2 rounded-xl hover:bg-white/10 hover:text-zinc-200 transition-colors" title="Downloads">
            <Download size={16} />
          </button>
          <button className="p-2 rounded-xl hover:bg-white/10 hover:text-zinc-200 transition-colors" title="Menu">
            <Menu size={16} />
          </button>
        </div>
      </div>

      {/* 3. NEW TAB PAGE CONTENT (Matching your screenshot style) */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[#0b0b0e] via-[#121218] to-[#08080a]">
        
        {/* Background Ambient Glow */}
        <div className="absolute w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-0" />

        <div className="z-10 w-full max-w-2xl flex flex-col items-center space-y-8">
          
          {/* Huge Live Clock */}
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-light tracking-tighter text-zinc-100 font-mono drop-shadow-lg">
              {currentTime || "17:21"}
            </h1>
            <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase mt-1">Hyper-Surf Workspace</p>
          </div>

          {/* Central Search Box */}
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate((e.target as HTMLInputElement).value);
                }
              }}
              placeholder="Search the web or type a URL..."
              className="w-full bg-[#18181f]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 shadow-2xl transition-all"
            />
          </div>

          {/* Quick Shortcuts Grid (Brave/Chrome Style Tiles) */}
          <div className="grid grid-cols-5 gap-4 w-full pt-2">
            {quickSites.map((site, idx) => (
              <button
                key={idx}
                onClick={() => handleNavigate(site.url)}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#16161c]/60 hover:bg-[#202028] border border-white/5 hover:border-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${site.bg} flex items-center justify-center text-lg shadow-md mb-2 group-hover:rotate-3 transition-transform`}>
                  {site.icon}
                </div>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-full text-center">
                  {site.name}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}