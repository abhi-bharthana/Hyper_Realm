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
    <div className="p-[1.5rem] md:p-[2.5rem] w-full max-w-[64rem] mx-auto flex flex-col gap-[2rem]">
      
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-[1rem] border-b border-slate-200 dark:border-white/10 pb-[1.5rem]">
        <div className="flex flex-col gap-[0.5rem]">
          <h1 className="text-[1.8em] font-bold text-slate-800 dark:text-white tracking-tight">🔗 Hyper-Link</h1>
          <p className="text-[0.85em] text-slate-500 dark:text-slate-400 max-w-[32rem]">
            Aapke saare devices ke beech ka seamless bond. Data, media, aur links ko real-time mein sync karein.
          </p>
        </div>

        {/* Dynamic Bonding Status */}
        <div className={`px-[1rem] py-[0.5rem] rounded-[1rem] border flex items-center gap-[0.75rem] shadow-sm ${
          isRunning 
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' 
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        }`}>
          <span className="relative flex h-[0.75rem] w-[0.75rem] shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-[0.75rem] w-[0.75rem] ${isRunning ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
          </span>
          <div className="flex flex-col justify-center">
            <span className="text-[0.75em] font-bold uppercase tracking-wider leading-tight">
              {isRunning ? 'Global Bond Active' : 'Local Bond Active'}
            </span>
            {isRunning && tunnelUrl && (
              <span className="text-[0.65em] font-mono opacity-80 mt-[0.2em]">{tunnelUrl}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1.5rem]">
        
        {/* Left Sidebar (Tabs for Hyper-Link Features) */}
        <div className="flex lg:flex-col gap-[0.5rem] overflow-x-auto pb-[0.5rem] lg:pb-0 hide-scrollbar">
          <button
            onClick={() => setActiveTab('clipboard')}
            className={`flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-[1rem] text-left font-medium transition-all min-w-max lg:min-w-0 ${
              activeTab === 'clipboard'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_0.2em_1em_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200 dark:border-white/10'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-[1.25em]">📋</span> 
            <span className="text-[0.9em]">Universal Clipboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-[1rem] text-left font-medium transition-all min-w-max lg:min-w-0 ${
              activeTab === 'links'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_0.2em_1em_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200 dark:border-white/10'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-[1.25em]">🌐</span> 
            <span className="text-[0.9em]">Saved Links</span>
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-[0.75rem] px-[1.25rem] py-[1rem] rounded-[1rem] text-left font-medium transition-all min-w-max lg:min-w-0 ${
              activeTab === 'devices'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_0.2em_1em_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200 dark:border-white/10'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-[1.25em]">📱</span> 
            <span className="text-[0.9em]">Connected Nodes</span>
          </button>
        </div>

        {/* Right Side (Active Tab Content) */}
        <div className="lg:col-span-2">
          {activeTab === 'clipboard' && <ClipboardSync />}
          {activeTab === 'links' && <LinkSync />}
          {activeTab === 'devices' && (
            <div className="p-[1.5rem] bg-white dark:bg-white/5 rounded-[1.5rem] border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-[1.1em] font-semibold text-slate-800 dark:text-white mb-[0.5rem]">Nearby & Synced Devices</h3>
              <p className="text-[0.85em] text-slate-500 mb-[1.5rem]">Agar Cloud ON hai, toh devices duniya ke kisi bhi kone se connect ho sakte hain.</p>
              
              {/* Dummy device list for now */}
              <div className="flex flex-col gap-[0.75rem]">
                <div className="flex items-center justify-between p-[1rem] rounded-[1rem] bg-slate-50 dark:bg-neutral-900/50 border border-slate-200 dark:border-white/5 transition-colors hover:bg-slate-100 dark:hover:bg-neutral-800/80">
                  <div className="flex items-center gap-[0.75rem]">
                    <span className="text-[1.5em]">📱</span>
                    <span className="text-[0.9em] font-medium text-slate-700 dark:text-slate-200">Abhi's Phone (Hyper-App)</span>
                  </div>
                  <span className="text-[0.75em] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-[0.5rem] py-[0.25rem] rounded-[0.5rem]">Connected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}