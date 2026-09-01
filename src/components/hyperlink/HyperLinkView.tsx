import React, { useState } from 'react';
import { useCloudStore } from '../../store/useCloudStore';
// Niche wale components hum aage banayenge (Clipboard aur Links ke liye)
import ClipboardSync from '../services/hyperlink/ClipboardSync';
import LinkSync from '../services/hyperlink/LinkSync';

export default function HyperLinkView() {
  // Cloud ka status yahan directly mil jayega store se!
  const { isRunning, tunnelUrl } = useCloudStore();
  const [activeTab, setActiveTab] = useState<'clipboard' | 'links' | 'devices'>('clipboard');

  return (
    <div className="p-6 md:p-10 w-full max-w-5xl mx-auto flex flex-col gap-8">
      
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">🔗 Hyper-Link</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
            Aapke saare devices ke beech ka seamless bond. Data, media, aur links ko real-time mein sync karein.
          </p>
        </div>

        {/* Dynamic Bonding Status */}
        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-3 shadow-sm ${
          isRunning 
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' 
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        }`}>
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isRunning ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isRunning ? 'Global Bond Active' : 'Local Bond Active'}
            </span>
            {isRunning && tunnelUrl && (
              <span className="text-[10px] font-mono opacity-80">{tunnelUrl}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Sidebar (Tabs for Hyper-Link Features) */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          <button
            onClick={() => setActiveTab('clipboard')}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-medium transition-all min-w-max lg:min-w-0 ${
              activeTab === 'clipboard'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-xl">📋</span> Universal Clipboard
          </button>
          
          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-medium transition-all min-w-max lg:min-w-0 ${
              activeTab === 'links'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-xl">🌐</span> Saved Links
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-medium transition-all min-w-max lg:min-w-0 ${
              activeTab === 'devices'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-xl">📱</span> Connected Nodes
          </button>
        </div>

        {/* Right Side (Active Tab Content) */}
        <div className="lg:col-span-2">
          {activeTab === 'clipboard' && <ClipboardSync />}
          {activeTab === 'links' && <LinkSync />}
          {activeTab === 'devices' && (
            <div className="p-6 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Nearby & Synced Devices</h3>
              <p className="text-sm text-slate-500 mb-6">Agar Cloud ON hai, toh devices duniya ke kisi bhi kone se connect ho sakte hain.</p>
              {/* Dummy device list for now */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">Abhi's Phone (Hyper-App)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Connected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}