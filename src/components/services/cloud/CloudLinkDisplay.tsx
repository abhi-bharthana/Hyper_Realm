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
    <div className="mt-[2rem] pt-[2rem] border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-[1.5rem] animate-in fade-in slide-in-from-top-4">
      
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-[0.75em] font-bold text-slate-400 uppercase tracking-wider mb-[0.5rem]">Your Global Link</p>
        
        <div className="flex items-center gap-[0.5rem] bg-white dark:bg-black/40 p-[0.5rem] rounded-[0.75rem] border border-slate-200 dark:border-white/10">
          <input 
            type="text" 
            readOnly 
            value={url} 
            className="flex-1 bg-transparent text-[0.85em] font-mono text-blue-600 dark:text-blue-400 px-[0.5rem] outline-none"
          />
          <button onClick={copyUrl} className="p-[0.4rem] hover:bg-slate-100 dark:hover:bg-white/10 rounded-[0.5rem] transition-colors">
            {copied ? <Check className="w-[1.2rem] h-[1.2rem] text-emerald-500" /> : <Copy className="w-[1.2rem] h-[1.2rem] text-slate-400" />}
          </button>
        </div>
        
        <p className="text-[0.75em] text-slate-500 mt-[0.75rem]">
          Keep your PC on. Scan the QR from your mobile app to sync instantly over the internet.
        </p>
      </div>

      <div className="shrink-0 flex flex-col items-center gap-[0.5rem] p-[0.75rem] bg-white/50 dark:bg-white/10 border border-slate-200 dark:border-transparent rounded-[1.25rem]">
        <div className="bg-white p-[0.5rem] rounded-[0.75rem]">
          <QRCodeSVG value={url} size={100} style={{ width: '6rem', height: '6rem' }} level="M" />
        </div>
        <span className="text-[0.65em] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Scan from Mobile</span>
      </div>
      
    </div>
  );
}