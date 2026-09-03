// src/components/Settings/about/Animations.tsx
import React from 'react';
import { motion } from 'framer-motion';

// Apple's Buttery Smooth Easing
export const cinematicEase = [0.16, 1, 0.3, 1];

// Staggered Text Reveal (Word by Word with Blur)
export const RevealText = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <motion.div 
      initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }} 
      className={className}
    >
      {words.map((word, index) => (
        <motion.span key={index} className="inline-block mr-3"
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(10px)", scale: 0.9 },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.8, ease: cinematicEase } }
          }}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// 3D Parallax Hover Card
export const HollywoodCard = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 80, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, delay, ease: cinematicEase }}
    whileHover={{ scale: 1.02, y: -5, boxShadow: "0px 30px 60px rgba(139, 92, 246, 0.15)" }}
    className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);