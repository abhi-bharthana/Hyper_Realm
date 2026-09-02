import React, { useState, useEffect, useRef } from 'react';
import { useCloudStore } from '../../../store/useCloudStore';

interface ClipEntry {
  id: string;
  text: string;
  timestamp: number;
}

export default function ClipboardSync() {
  const getActiveNode = useCloudStore((state) => state.getActiveNode);
  const [history, setHistory] = useState<ClipEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [status, setStatus] = useState('');
  const isFocused = useRef(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${getActiveNode()}/api/clipboard`);
      const data: ClipEntry[] = await res.json();
      setHistory(data);
      if (data.length > 0 && !isFocused.current) {
        setCurrentText(data[0].text);
      }
    } catch (e) {
      console.error("Failed to fetch clipboard", e);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const autoPullFromOS = async () => {
      try {
        const osText = await navigator.clipboard.readText();
        if (osText && (!history.length || history[0].text !== osText)) {
          handlePushToCloud(osText, true);
        }
      } catch (err) {
        console.warn('Auto-pull needs manual permission first time');
      }
    };
    window.addEventListener('focus', autoPullFromOS);
    return () => window.removeEventListener('focus', autoPullFromOS);
  }, [history]);

  const handlePushToCloud = async (textToSync: string, isAuto = false) => {
    if (!textToSync.trim()) return;
    try {
      await fetch(`${getActiveNode()}/api/clipboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSync }),
      });
      setStatus(isAuto ? 'Auto-Pulled & Synced! ✨' : 'Synced globally! 🚀');
      fetchHistory();
      setTimeout(() => setStatus(''), 2500);
    } catch (e) {
      setStatus('Sync failed ❌');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${getActiveNode()}/api/clipboard/${id}`, { method: 'DELETE' });
      setHistory(history.filter(item => item.id !== id));
      setStatus('Item deleted 🗑️');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setStatus('Delete failed ❌');
    }
  };

  const copyToOS = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied to OS! 📋');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus('Failed to copy ❌');
    }
  };

  return (
    <div className="flex flex-col gap-[1.5rem] w-full">
      {/* Live Typing Area */}
      <div className="p-[1.5rem] bg-white/70 dark:bg-zinc-900/80 rounded-[1.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col gap-[1rem]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[1.1em] font-semibold text-slate-800 dark:text-white">Active Clipboard</h3>
            <p className="text-[0.75em] text-slate-500">Auto-pulls from Windows when you switch back to this app.</p>
          </div>
          <span className="text-[0.75em] font-medium text-emerald-500 animate-pulse">{status}</span>
        </div>
        <textarea
          rows={3}
          value={currentText}
          onFocus={() => { isFocused.current = true; }}
          onBlur={() => { 
            isFocused.current = false;
            handlePushToCloud(currentText);
          }}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="Type or paste to broadcast..."
          className="w-full p-[1rem] rounded-[1rem] bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[0.85em] resize-none"
        />
      </div>

      {/* Clipboard History List */}
      <div className="flex flex-col gap-[0.75rem]">
        <h4 className="text-[0.85em] font-semibold text-slate-700 dark:text-slate-300 px-[0.5rem]">Clipboard History (7 Days)</h4>
        
        <div className="flex flex-col gap-[0.5rem] max-h-[25rem] overflow-y-auto custom-scrollbar pr-[0.5rem]">
          {history.length === 0 ? (
            <p className="text-[0.75em] text-slate-400 px-[0.5rem]">No history yet.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-[1rem] rounded-[1rem] bg-white/60 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all group flex flex-col gap-[0.5rem]">
                <p className="text-[0.85em] text-slate-700 dark:text-slate-200 font-mono whitespace-pre-wrap break-words max-h-[6rem] overflow-hidden">
                  {item.text}
                </p>
                <div className="flex items-center justify-between pt-[0.5rem] border-t border-slate-100 dark:border-white/5 mt-[0.25rem]">
                  <span className="text-[0.65em] text-slate-500 dark:text-zinc-500">
                    {new Date(item.timestamp * 1000).toLocaleString()}
                  </span>
                  <div className="flex gap-[0.5rem] opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyToOS(item.text)} className="px-[0.75rem] py-[0.25rem] bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[0.75em] font-medium rounded-[0.5rem] hover:bg-blue-500/20">
                      Copy
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="px-[0.75rem] py-[0.25rem] bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[0.75em] font-medium rounded-[0.5rem] hover:bg-rose-500/20">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}