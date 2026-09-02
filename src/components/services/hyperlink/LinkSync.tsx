import React, { useState, useEffect } from 'react';
import { useCloudStore } from '../../../store/useCloudStore';

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

export default function LinkSync() {
  const getActiveNode = useCloudStore((state) => state.getActiveNode);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${getActiveNode()}/api/links`);
      const data = await res.json();
      setLinks(data);
    } catch (e) {
      console.error("Failed to fetch links", e);
    }
  };

  useEffect(() => {
    fetchLinks();
    const interval = setInterval(fetchLinks, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    try {
      const res = await fetch(`${getActiveNode()}/api/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url }),
      });
      if (res.status === 201) {
        setTitle('');
        setUrl('');
        setStatus('Link added! 🔗');
        fetchLinks();
        setTimeout(() => setStatus(''), 2500);
      }
    } catch (e) {
      setStatus('Failed to add ❌');
    }
  };

  return (
    <div className="flex flex-col gap-[1.5rem] p-[1.5rem] bg-white/70 dark:bg-zinc-900/80 rounded-[1.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[1.1em] font-semibold text-slate-800 dark:text-white">Cloud Bookmarks</h3>
          <p className="text-[0.75em] text-slate-500">Access your saved links anywhere globally.</p>
        </div>
        {status && <span className="text-[0.75em] font-medium text-emerald-500 animate-pulse">{status}</span>}
      </div>

      {/* Add New Link */}
      <form onSubmit={handleAddLink} className="grid grid-cols-1 md:grid-cols-5 gap-[0.75rem]">
        <input
          type="text"
          placeholder="App/Site Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="md:col-span-2 p-[0.75rem] rounded-[0.75rem] bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/10 text-[0.85em] focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        />
        <input
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="md:col-span-2 p-[0.75rem] rounded-[0.75rem] bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/10 text-[0.85em] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          className="md:col-span-1 py-[0.75rem] bg-slate-800 dark:bg-white/10 hover:bg-slate-700 text-white font-medium rounded-[0.75rem] transition-all active:scale-95 text-[0.85em]"
        >
          Add 📌
        </button>
      </form>

      {/* Render Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.75rem] mt-[0.5rem]">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-[1rem] rounded-[1rem] bg-white/60 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all flex flex-col gap-[0.25rem] group"
          >
            <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors text-[0.85em]">
              {link.title}
            </span>
            <span className="text-[0.75em] text-slate-400 dark:text-zinc-500 font-mono truncate">{link.url}</span>
          </a>
        ))}
        {links.length === 0 && (
          <p className="text-[0.85em] text-slate-400 dark:text-zinc-500 p-[1rem]">No links saved yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}