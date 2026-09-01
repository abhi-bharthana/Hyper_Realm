import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CloudLinkDisplayProps {
  url: string;
}

export default function CloudLinkDisplay({ url }: CloudLinkDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-top-4">
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Your Global Link</p>
        <div className="flex items-center gap-2 bg-white dark:bg-black/40 p-2 rounded-xl border border-slate-200 dark:border-white/10">
          <input 
            type="text" 
            readOnly 
            value={url} 
            className="flex-1 bg-transparent text-sm font-mono text-blue-600 dark:text-blue-400 px-2 outline-none"
          />
          <button onClick={copyUrl} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400" />}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">Keep your PC on. Scan the QR from your mobile app to sync instantly over the internet.</p>
      </div>

      <div className="shrink-0 flex flex-col items-center gap-2 p-3 bg-white dark:bg-white/10 rounded-2xl">
        <div className="bg-white p-2 rounded-xl">
          <QRCodeSVG value={url} size={100} level="M" />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scan from Mobile</span>
      </div>
    </div>
  );
}