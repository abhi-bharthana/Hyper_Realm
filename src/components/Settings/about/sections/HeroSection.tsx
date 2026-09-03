import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealText } from '../Animations';

// 🔥 Yahan hum tera actual logo import kar rahe hain
import hyperLogo from '../../../../assets/logo.png'; 

export const HeroSection = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20">
      <motion.div style={{ y, opacity }} className="flex flex-col items-center text-center z-10 w-full px-4">
        
        {/* REAL IMAGE WITH EPIC GLOW EFFECT */}
        <div className="relative mb-14 group">
          <div className="absolute inset-0 bg-purple-500 blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity duration-1000 rounded-full" />
          
          <motion.img
            initial={{ scale: 0, rotate: -45 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
            src={hyperLogo} 
            alt="Hyper Realm Logo"
            className="w-32 h-32 md:w-40 md:h-40 relative z-10 object-contain drop-shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]"
          />
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm font-bold tracking-[0.4em] text-slate-500 dark:text-zinc-400 uppercase mb-8">
          Welcome to the Ecosystem
        </motion.p>
        
        <div className="pb-4">
          <RevealText 
            text="Redefining the digital space with raw power and boundless scale." 
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight md:leading-tight text-slate-900 dark:text-white max-w-5xl"
          />
        </div>
      </motion.div>
    </section>
  );
};