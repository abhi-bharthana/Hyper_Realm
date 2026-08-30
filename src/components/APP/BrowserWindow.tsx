import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe, Lock, Download, ShieldCheck, Menu } from 'lucide-react';

export default function BrowserWindow() {
  const [currentUrl, setCurrentUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [history, setHistory] = useState<string[]>(['https://www.wikipedia.org']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [downloads, setDownloads] = useState<{ name: string; progress: number; status: string }[]>([]);
  const [showDownloads, setShowDownloads] = useState(false);

  // URL Navigate karne ka function
  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }
    
    // History update karo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(finalUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setCurrentUrl(finalUrl);
    setInputUrl(finalUrl);
  };

  // Back Button Logic
  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentUrl(history[prevIndex]);
      setInputUrl(history[prevIndex]);
    }
  };

  // Forward Button Logic
  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCurrentUrl(history[nextIndex]);
      setInputUrl(history[nextIndex]);
    }
  };

  // Reload Logic
  const handleReload = () => {
    const temp = currentUrl;
    setCurrentUrl('');
    setTimeout(() => setCurrentUrl(temp), 50);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#121215] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl animate-in fade-in duration-300">
      
      {/* Browser Control Toolbar */}
      <div className="flex items-center px-4 py-3 bg-slate-100/80 dark:bg-[#1a1a1e]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 gap-3">
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={handleBack} 
            disabled={historyIndex === 0}
            className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 transition-all"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={handleForward} 
            disabled={historyIndex === history.length - 1}
            className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 transition-all"
            title="Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={handleReload} 
            className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            title="Reload"
          >
            <RotateCw size={16} />
          </button>
        </div>

        {/* URL Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white dark:bg-black/60 rounded-2xl border border-slate-200 dark:border-white/10 px-3.5 py-1.5 shadow-inner focus-within:border-blue-500 transition-all">
          <Lock size={14} className="text-emerald-500 mr-2.5 shrink-0" />
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-slate-800 dark:text-zinc-200 font-medium"
            placeholder="Search or enter web address..."
          />
          <ShieldCheck size={14} className="text-slate-400 ml-2 shrink-0" title="Secure Connection" />
        </form>

        {/* Utility Buttons (Downloads & Menu) */}
        <div className="flex items-center gap-1.5 relative">
          <button 
            onClick={() => setShowDownloads(!showDownloads)}
            className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all relative"
            title="Downloads"
          >
            <Download size={16} />
            {downloads.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
          </button>
          <button className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
            <Menu size={16} />
          </button>

          {/* Downloads Dropdown Menu */}
          {showDownloads && (
            <div className="absolute right-0 top-12 w-72 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Downloads Manager</h4>
                <span className="text-[10px] text-zinc-400">{downloads.length} items</span>
              </div>
              {downloads.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-4">No active downloads</p>
              ) : (
                <div className="space-y-2">
                  {downloads.map((item, idx) => (
                    <div key={idx} className="text-xs bg-slate-50 dark:bg-black/40 p-2 rounded-xl">
                      <p className="font-medium text-slate-800 dark:text-zinc-200 truncate">{item.name}</p>
                      <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Browser Viewport Area */}
      <div className="flex-1 bg-white dark:bg-black relative">
        {currentUrl ? (
          <iframe 
            src={currentUrl} 
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            title="Hyper-Surf Browser View"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>
        )}
      </div>
    </div>
  );
}