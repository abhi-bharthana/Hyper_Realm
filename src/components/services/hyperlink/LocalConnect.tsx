import React, { useState } from 'react';

export default function LocalConnect() {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<string[]>([]);

  const scanLocalNetwork = () => {
    setScanning(true);
    setTimeout(() => {
      setDevices(['Hyper-Mobile (Wi-Fi)', 'Desktop Audio Bridge', 'Bluetooth Speaker (Living Room)']);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <div className="bg-white/70 dark:bg-zinc-900/80 p-[1.5rem] rounded-[1.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col gap-[1rem]">
        <div className="flex items-center justify-between gap-[1rem]">
          <div className="flex flex-col gap-[0.25rem]">
            <h3 className="text-[1.1em] font-semibold text-slate-800 dark:text-white">Local Wi-Fi & Bluetooth Bridge</h3>
            <p className="text-[0.75em] text-slate-500 dark:text-zinc-400">Discover nearby devices on your local network for instant media streaming.</p>
          </div>
          <button
            onClick={scanLocalNetwork}
            disabled={scanning}
            className="px-[1.25rem] py-[0.6rem] bg-slate-800 dark:bg-white/10 hover:bg-slate-700 text-white text-[0.85em] font-medium rounded-[0.75rem] transition-all active:scale-95 disabled:opacity-50 shrink-0"
          >
            {scanning ? 'Scanning...' : 'Scan Nearby 📡'}
          </button>
        </div>

        {devices.length > 0 && (
          <div className="flex flex-col gap-[0.5rem] pt-[1rem] border-t border-slate-100 dark:border-white/5">
            <span className="text-[0.75em] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Available Local Nodes</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.75rem]">
              {devices.map((device, idx) => (
                <div key={idx} className="p-[1rem] rounded-[1rem] bg-slate-50 dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[0.85em] font-medium text-slate-700 dark:text-slate-200">{device}</span>
                  <span className="w-[0.6rem] h-[0.6rem] rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}