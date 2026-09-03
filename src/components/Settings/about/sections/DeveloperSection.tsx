// src/components/Settings/about/sections/DeveloperSection.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal } from 'lucide-react';
import { RevealText, HollywoodCard, cinematicEase } from '../Animations';

const codeSnippet = `#[tauri::command]
async fn hyper_engine_init() -> Result<Response, Error> {
    let ecosystem = App::new()
        .enable_ai_models()
        .mount_virtual_dom()
        .await?;
    
    Ok(Response::new("Hyper Realm Active"))
}`;

export const DeveloperSection = () => {
  const [displayedCode, setDisplayedCode] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCode(codeSnippet.substring(0, i));
      i++;
      if (i > codeSnippet.length) clearInterval(interval);
    }, 20); // Typing speed
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="developer" className="min-h-screen flex items-center border-t border-slate-200/50 dark:border-zinc-800/50 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full">
        
        <div>
          <h2 className="text-2xl text-slate-400 dark:text-zinc-500 mb-6 font-medium flex items-center gap-3">
            <Terminal className="w-6 h-6 text-indigo-500" /> 05 // The Engine
          </h2>
          <div className="pb-4">
            <RevealText 
              text="Rust Backend meets React Fluidity." 
              className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8 dark:text-white" 
            />
          </div>
          <p className="text-xl text-slate-600 dark:text-zinc-400 leading-relaxed font-light">
            Built on top of Tauri, Hyper Realm consumes a fraction of memory compared to Electron apps. The backend talks directly to the OS, giving you unparalleled speed and deep system integration.
          </p>
        </div>

        <HollywoodCard className="h-[450px] p-0 relative overflow-hidden bg-slate-950 dark:bg-black border-slate-800">
          <div className="flex items-center gap-2 px-6 py-4 bg-slate-900 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-xs font-mono text-slate-500">core_engine.rs</span>
          </div>
          <div className="p-8 font-mono text-sm md:text-base text-indigo-300 whitespace-pre-wrap">
            {displayedCode}
            <motion.span 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-5 bg-indigo-500 ml-1 translate-y-1"
            />
          </div>
        </HollywoodCard>

      </div>
    </section>
  );
};