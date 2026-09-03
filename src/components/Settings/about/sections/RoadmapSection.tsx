// src/components/Settings/about/sections/RoadmapSection.tsx
import React from 'react';
import { Shield, Cpu, Code } from 'lucide-react';
import { RevealText, HollywoodCard } from '../Animations';

const pendingFeatures = [
  { status: "In Progress", title: "P2P Encrypted Handoff", icon: Shield },
  { status: "Planned", title: "AI Agent Workspace", icon: Cpu },
  { status: "Planned", title: "Plugin Marketplace", icon: Code },
];

export const RoadmapSection = () => {
  return (
    <section id="roadmap" className="min-h-screen flex flex-col justify-between border-t border-slate-200/50 dark:border-zinc-800/50 pt-24">
      
      <div className="w-full">
        <h2 className="text-2xl text-slate-400 dark:text-zinc-500 mb-6 font-medium">05 // The Future</h2>
        <RevealText 
          text="What's Next for Hyper Realm?" 
          className="text-5xl md:text-7xl font-black tracking-tighter mb-16 dark:text-white" 
        />
        
        <div className="space-y-6">
          {pendingFeatures.map((item, idx) => (
            <HollywoodCard key={idx} delay={idx * 0.15} className="flex flex-col md:flex-row md:items-center gap-6 p-8 border-slate-200/80 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-800/40">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest mb-2 block ${item.status === 'In Progress' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500'}`}>
                  {item.status}
                </span>
                <h3 className="text-2xl font-bold dark:text-white">{item.title}</h3>
              </div>
            </HollywoodCard>
          ))}
        </div>
      </div>

      {/* Epic Footer */}
      <footer className="mt-32 pb-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center mb-8 shadow-xl">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold tracking-tighter mb-6 dark:text-white">Hyper Realm Ecosystem</h2>
        <div className="flex gap-4 mb-8">
          <span className="px-5 py-2 rounded-full border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Version 1.0.0</span>
          <span className="px-5 py-2 rounded-full border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Dev Build</span>
        </div>
        <div className="flex gap-8">
          <a href="https://hyper-realm.space" target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">hyper-realm.space</a>
          <a href="https://hyper-realm.com" target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">hyper-realm.com</a>
        </div>
      </footer>

    </section>
  );
};