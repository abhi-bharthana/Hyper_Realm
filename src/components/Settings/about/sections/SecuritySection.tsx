// src/components/Settings/about/sections/SecuritySection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { RevealText, HollywoodCard } from '../Animations';

export const SecuritySection = () => {
  return (
    <section id="security" className="min-h-screen flex items-center border-t border-slate-200/50 dark:border-zinc-800/50 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full">
        
        <HollywoodCard className="order-2 lg:order-1 h-[450px] flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-zinc-900/50">
          {/* Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-blue-400/50 dark:border-blue-500/30"
          />
          {/* Inner Ring (Reverse Rotation) */}
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-[200px] h-[200px] rounded-full border-[2px] border-purple-400/30 dark:border-purple-500/20"
          />
          
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)]">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
        </HollywoodCard>

        <div className="order-1 lg:order-2">
          <h2 className="text-2xl text-slate-400 dark:text-zinc-500 mb-6 font-medium">06 // Zero Trust Architecture</h2>
          <div className="pb-4">
            <RevealText 
              text="Total isolation. Absolute privacy." 
              className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8 dark:text-white" 
            />
          </div>
          <p className="text-xl text-slate-600 dark:text-zinc-400 leading-relaxed font-light">
            Every module in Hyper Realm operates in a sandboxed environment. Your local data stays local. Cloud tunnels are end-to-end encrypted, ensuring that your digital footprint remains exclusively yours.
          </p>
        </div>

      </div>
    </section>
  );
};