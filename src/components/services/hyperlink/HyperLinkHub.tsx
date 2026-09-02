import React, { useState } from 'react';
import CloudConnect from './CloudConnect';
import LocalConnect from './LocalConnect';

export default function HyperLinkHub() {
  const [activeTab, setActiveTab] = useState<'cloud' | 'local'>('cloud');

  return (
    <div className="p-[1.5rem] md:p-[2.5rem] w-full max-w-[56rem] mx-auto flex flex-col gap-[2rem]">
      {/* Header & Tabs Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[1rem] border-b border-slate-200 dark:border-white/10 pb-[1.5rem]">
        <div>
          <h2 className="text-[1.5em] font-bold text-slate-800 dark:text-white tracking-tight">🔗 Hyper-Link Hub</h2>
          <p className="text-[0.85em] text-slate-500 dark:text-slate-400 mt-[0.25rem]">
            Seamless Connectivity: Manage your Cloud and Local network bridges.
          </p>
        </div>
        
        {/* Tab Buttons Scaled */}
        <div className="flex items-center bg-slate-100 dark:bg-white/5 p-[0.35rem] rounded-[1.25rem] border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-[1.25rem] py-[0.5rem] rounded-[1rem] text-[0.85em] font-medium transition-all ${
              activeTab === 'cloud'
                ? 'bg-blue-600 text-white shadow-[0_0.5rem_1rem_rgba(37,99,235,0.25)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cloud Connect
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`px-[1.25rem] py-[0.5rem] rounded-[1rem] text-[0.85em] font-medium transition-all ${
              activeTab === 'local'
                ? 'bg-blue-600 text-white shadow-[0_0.5rem_1rem_rgba(37,99,235,0.25)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Local Connect
          </button>
        </div>
      </div>

      {/* Dynamic Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'cloud' ? <CloudConnect /> : <LocalConnect />}
      </div>
    </div>
  );
}