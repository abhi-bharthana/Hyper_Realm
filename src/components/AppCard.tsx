import { Play, Square, Activity, Globe, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, SystemAppExtended } from '../store/useAppStore';

export default function AppCard({ app }: { app: SystemAppExtended }) {
  const { launchApp, closeApp } = useAppStore();
  const isRunning = app.status === 'running' || app.id === 'hyper-surf' || app.id === 'hyper-media';

  // Dynamic Icon Selector based on app config
  const renderIcon = () => {
    switch (app.icon) {
      case 'Globe': return <Globe size={22} />;
      case 'Film': return <Film size={22} />;
      default: return <Activity size={22} />;
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-6 rounded-2xl border backdrop-blur-xl flex flex-col justify-between group transition-all duration-500 ${
        isRunning 
          ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-500/30 shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]' 
          : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] hover:bg-white dark:hover:bg-white/[0.04] hover:border-slate-300 dark:hover:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3.5 rounded-xl shadow-inner transition-colors duration-500 ${
          isRunning 
            ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' 
            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5'
        }`}>
          {renderIcon()}
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors duration-500 ${
          isRunning 
            ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
            : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700/50'
        }`}>
          {isRunning ? 'Active' : 'Offline'}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1.5 tracking-tight transition-colors">{app.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed transition-colors">{app.description}</p>
      </div>

      <button 
        onClick={() => launchApp(app.id)}
        className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
          app.id !== 'hyper-surf' && app.id !== 'hyper-media' && isRunning 
            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border-rose-200 dark:border-rose-500/20' 
            : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white border-slate-200 dark:border-white/5 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]'
        }`}
      >
        {app.id === 'hyper-surf' || app.id === 'hyper-media' ? (
          <><Play size={16} fill="currentColor" /> <span>Open Workspace</span></>
        ) : isRunning ? (
          <><Square size={16} /> <span>Terminate Task</span></>
        ) : (
          <><Play size={16} fill="currentColor" /> <span>Initialize</span></>
        )}
      </button>
    </motion.div>
  );
}