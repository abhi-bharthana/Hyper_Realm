import React, { useState, useEffect } from 'react';
import { useCloudStore } from '../../../store/useCloudStore'; // <-- Cloud Manager import

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

export default function LinkSync() {
  // 🌐 Smart Node Injection
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
        setStatus('Link added! 🚀');
        fetchLinks();
        setTimeout(() => setStatus(''), 2500);
      }
    } catch (e) {
      setStatus('Failed to add ❌');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Cloud Bookmarks</h3>
          <p className="text-xs text-slate-500">Access your saved links anywhere globally.</p>
        </div>
        {status && <span className="text-xs font-medium text-emerald-500 animate-pulse">{status}</span>}
      </div>

      {/* Add New Link */}
      <form onSubmit={handleAddLink} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="App/Site Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="md:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="md:col-span-2 p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="md:col-span-1 py-3 bg-slate-800 dark:bg-white/10 hover:bg-slate-700 text-white font-medium rounded-xl transition-all active:scale-95 text-sm"
        >
          Add ➕
        </button>
      </form>

      {/* Render Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all flex flex-col gap-1 group"
          >
            <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors text-sm">
              {link.title}
            </span>
            <span className="text-xs text-slate-400 font-mono truncate">{link.url}</span>
          </a>
        ))}
        {links.length === 0 && (
          <p className="text-sm text-slate-400 p-4">No links saved yet. Add one above!</p>
        )}
      </div>

    </div>
  );
}