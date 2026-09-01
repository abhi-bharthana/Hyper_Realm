import React from 'react';
import { Cloud } from 'lucide-react';

interface CloudHeaderProps {
  isRunning: boolean;
}

export default function CloudHeader({ isRunning }: CloudHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
        <Cloud className={isRunning ? "text-blue-500" : "text-slate-400"} size={32} />
        Cloud Sync Manager
      </h2>
      <p className="text-slate-500 dark:text-white/50">
        Turn your PC into a global server. Access your music and files from anywhere.
      </p>
    </div>
  );
}