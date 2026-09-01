import React, { useState, useEffect, useRef } from 'react';
import { useCloudStore } from '../../../store/useCloudStore'; // Cloud Manager se connect

interface ClipEntry {
  id: string;
  text: string;
  timestamp: number;
}

export default function ClipboardSync() {
  // 🌐 Smart Node Injection: Yeh khud decide karega Local hai ya Global
  const getActiveNode = useCloudStore((state) => state.getActiveNode);
  
  const [history, setHistory] = useState<ClipEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [status, setStatus] = useState('');
  const isFocused = useRef(false);

  // 🔄 Fetch History from Active Node
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
    const interval = setInterval(fetchHistory, 3000); // 3 sec auto-sync
    return () => clearInterval(interval);
  }, []);

  // 📥 AUTO-PULL OS CLIPBOARD ON WINDOW FOCUS
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

  // 🚀 Push to Active Node
  const handlePushToCloud = async (textToSync: string, isAuto = false) => {
    if (!textToSync.trim()) return;
    try {
      await fetch(`${getActiveNode()}/api/clipboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSync }),
      });
      setStatus(isAuto ? 'Auto-Pulled & Synced! 🚀' : 'Synced globally! 🚀');
      fetchHistory(); 
      setTimeout(() => setStatus(''), 2500);
    } catch (e) {
      setStatus('Sync failed ❌');
    }
  };

  // 🗑️ Delete Entry from Active Node
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

  // 📋 Copy Back to OS
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
    <div className="flex flex-col gap-6 w-full">
      {/* ✍️ Live Typing Area */}
      <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Active Clipboard</h3>
            <p className="text-xs text-slate-500">Auto-pulls from Windows when you switch back to this app.</p>
          </div>
          <span className="text-xs font-medium text-emerald-500 animate-pulse">{status}</span>
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
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
        />
      </div>

      {/* 🕒 Clipboard History List */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-2">Clipboard History (7 Days)</h4>
        
        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {history.length === 0 ? (
            <p className="text-xs text-slate-400 px-2">No history yet.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all group flex flex-col gap-2">
                <p className="text-sm text-slate-700 dark:text-slate-200 font-mono whitespace-pre-wrap break-words max-h-24 overflow-hidden">
                  {item.text}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 mt-1">
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp * 1000).toLocaleString()}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyToOS(item.text)} className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-500/20">
                      Copy
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium rounded-lg hover:bg-rose-500/20">
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