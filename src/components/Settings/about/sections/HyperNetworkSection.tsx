// src/components/Settings/about/sections/HyperNetworkSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Server, Globe } from 'lucide-react';
import { RevealText, HollywoodCard } from '../Animations';

export const HyperNetworkSection = () => {
  return (
    <section id="network" className="min-h-screen flex flex-col justify-center items-center text-center border-t border-slate-200/50 dark:border-zinc-800/50 py-24">
      <h2 className="text-2xl text-slate-400 dark:text-zinc-500 mb-6 font-medium">04 // Infrastructure</h2>
      <RevealText 
        text="Bridging local nodes with global cloud tunnels." 
        className="text-5xl md:text-7xl font-black tracking-tighter mb-16 dark:text-white max-w-4xl" 
      />
      
      <HollywoodCard className="w-full max-w-5xl p-12 flex flex-col md:flex-row items-center justify-between gap-10 bg-slate-50 dark:bg-zinc-900/50">
        <div className="w-28 h-28 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center relative shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          <Server className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        
        {/* Animated Data Stream */}
        <div className="flex-1 h-2 bg-slate-200 dark:bg-zinc-800 relative rounded-full overflow-hidden w-full md:w-auto">
          <motion.div 
            animate={{ x: ["-100%", "200%"] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} 
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 dark:via-blue-400 to-transparent" 
          />
        </div>
        
        <div className="w-28 h-28 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center relative shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <Globe className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </div>
      </HollywoodCard>
    </section>
  );
};