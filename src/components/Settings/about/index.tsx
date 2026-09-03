// src/components/Settings/about/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FloatingNav } from './FloatingNav';
import { HeroSection } from './sections/HeroSection';
import { CoreEngineSection } from './sections/CoreEngineSection';
import { AIRecorderSection } from './sections/AIRecorderSection';
import { HyperNetworkSection } from './sections/HyperNetworkSection';
import { DeveloperSection } from './sections/DeveloperSection'; // NEW
import { SecuritySection } from './sections/SecuritySection'; // NEW
import { RoadmapSection } from './sections/RoadmapSection';

interface AboutProps {
  onBack: () => void;
}

export const AboutHyperRealm: React.FC<AboutProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('hero');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Awesome Top Progress Bar
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        const sections = ['hero', 'core', 'ai', 'network', 'developer', 'security', 'roadmap'];
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top >= -300 && rect.top <= 300) {
              setActiveSection(section);
              break;
            }
          }
        }
        timeoutId = null;
      }, 50);
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Buttery Smooth entry
      className="fixed inset-0 z-[100] bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-zinc-100 overflow-hidden flex flex-col transition-colors duration-700"
    >
      {/* Scroll Progress Bar (Top) */}
      <motion.div 
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 z-[110]"
      />

      {/* Cinematic Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full pointer-events-none transition-colors duration-1000" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)' }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full pointer-events-none transition-colors duration-1000" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 60%)' }} />

      {/* Top Navbar */}
      <div className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-all group hover:shadow-2xl hover:scale-105">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-widest text-xs uppercase">Close Mission Control</span>
        </button>
      </div>

      {/* Make sure FloatingNav has 'developer' and 'security' added to its array! */}
      <FloatingNav activeSection={activeSection} />

      {/* Main Scrollable Area */}
      <div 
        ref={scrollContainerRef}
        id="about-scroll-container" 
        className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth"
      >
        <div className="max-w-7xl mx-auto px-6 lg:pl-32 pb-10">
          <HeroSection />
          <CoreEngineSection />
          <AIRecorderSection />
          <HyperNetworkSection />
          <DeveloperSection />
          <SecuritySection />
          <RoadmapSection />
        </div>
      </div>
    </motion.div>
  );
};