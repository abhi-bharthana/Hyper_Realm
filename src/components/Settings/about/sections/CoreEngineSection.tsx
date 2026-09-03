// src/components/Settings/about/sections/CoreEngineSection.tsx
import React from 'react';
import { Globe, Music, Cpu, Zap } from 'lucide-react';
import { RevealText, HollywoodCard } from '../Animations';

const coreFeatures = [
  { icon: Globe, title: "Hyper-Surf", desc: "Native isolated browsing for max security and speed." },
  { icon: Music, title: "Audio Core", desc: "Gapless transitions & granular library management." },
  { icon: Cpu, title: "Telemetry", desc: "Live resource monitoring & process orchestration." },
  { icon: Zap, title: "Efficiency", desc: "ARM64-ready power draw and node optimization." },
];

export const CoreEngineSection = () => {
  return (
    <section id="core" className="min-h-screen flex flex-col justify-center border-t border-slate-200/50 dark:border-zinc-800/50 py-24">
      <h2 className="text-2xl text-slate-400 dark:text-zinc-500 mb-6 font-medium">02 // The Architecture</h2>
      <RevealText 
        text="A foundation built for absolute performance." 
        className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 text-slate-800 dark:text-zinc-100 max-w-4xl" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coreFeatures.map((feature, idx) => (
          <HollywoodCard key={idx} delay={idx * 0.1} className="p-8 group">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all duration-500">
              <feature.icon className="w-6 h-6 text-slate-700 dark:text-zinc-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 dark:text-white">{feature.title}</h3>
            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
          </HollywoodCard>
        ))}
      </div>
    </section>
  );
};