import React, { useState } from 'react';
import CloudConnect from './CloudConnect';
import LocalConnect from './LocalConnect';

export default function HyperLinkHub() {
  const [activeTab, setActiveTab] = useState<'cloud' | 'local'>('cloud');

  return (
    <div className="p-6 md:p-10 w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header & Tabs Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">⚡ Hyper-Link Hub</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Seamless Connectivity: Manage your Cloud and Local network bridges.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'cloud'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🌐 Cloud Connect
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'local'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📡 Local Connect
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