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
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Local Wi-Fi & Bluetooth Bridge</h3>
            <p className="text-xs text-slate-400">Discover nearby devices on your local network for instant media streaming.</p>
          </div>
          <button
            onClick={scanLocalNetwork}
            disabled={scanning}
            className="px-5 py-2.5 bg-slate-800 dark:bg-white/10 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Scan Nearby 🔍'}
          </button>
        </div>

        {devices.length > 0 && (
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Available Local Nodes</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {devices.map((device, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{device}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}