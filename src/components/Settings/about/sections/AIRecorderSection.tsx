import React from 'react';
import { motion } from 'framer-motion';
import { RevealText, HollywoodCard } from '../Animations';

export const AIRecorderSection = () => {
  return (
    <section id="ai" className="min-h-screen flex items-center border-t border-slate-200/50 dark:border-zinc-800/50 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full">
        
        {/* Animated Waveform Visual */}
        <HollywoodCard className="order-2 lg:order-1 h-[450px] p-12 flex items-center justify-center relative overflow-hidden bg-slate-900 dark:bg-black border-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
          <div className="flex items-center gap-3 h-32 relative z-10">
            {[...Array(14)].map((_, i) => (
              <motion.div 
                key={i} 
                // OPTIMIZATION: Use scaleY instead of height for ZERO layout thrashing (GPU accelerated)
                animate={{ scaleY: [0.2, 1, 0.2] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }} 
                className="w-3 h-full origin-bottom bg-gradient-to-t from-blue-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
              />
            ))}
          </div>
        </HollywoodCard>

        {/* Text Content */}
        <div className="order-1 lg:order-2">
          <h2 className="text-2xl text-slate-400 dark:text-zinc-500 mb-6 font-medium">03 // Cognitive Intelligence</h2>
          
          {/* OPTIMIZATION: `leading-tight` lagaya gaya hai texts ke liye */}
          <div className="pb-4">
            <RevealText 
              text="Audio that understands you." 
              className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8 dark:text-white" 
            />
          </div>
          <p className="text-xl text-slate-600 dark:text-zinc-400 leading-relaxed font-light">
            The AI Recorder isn't just listening. With deeply integrated Whisper STT models and VAD processing, it transcribes and understands in real-time, completely on-device. No data leaves your machine.
          </p>
        </div>

      </div>
    </section>
  );
};