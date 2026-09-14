import { Play, Square } from 'lucide-react';
import * as Icons from 'lucide-react';
import { SystemAppExtended } from '../../../store/useAppStore';

interface AppCardProps {
  app: SystemAppExtended;
  onLaunch: () => void;
  onClose: () => void;
}

export const AppCard = ({ app, onLaunch, onClose }: AppCardProps) => {
  // 🛡️ Safety Check: Agar app object hi undefined ho toh crash na ho
  if (!app) return null;

  // 🔥 Dynamic Icon Engine (Safe fallback to Box if icon string is missing)
  const IconComponent = (Icons as any)[app.icon] || Icons.Box;

  // 🛠️ Fallback check: 'name' ki jagah 'title' bhi handle karega
  const displayName = (app as any).name || (app as any).title || 'Unknown Module';

  return (
    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
          <IconComponent size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-zinc-100">{displayName}</h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2">{app.description}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2">
         <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
           app.status === 'running' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
         }`}>
           {app.status === 'running' ? 'Active' : 'Idle'}
         </span>
         
         {app.status === 'idle' ? (
            <button 
              onClick={onLaunch} 
              className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors"
            >
              <Play size={16} /> Launch
            </button>
         ) : (
            <button 
              onClick={onClose} 
              className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
            >
              <Square size={16} /> Close
            </button>
         )}
      </div>
    </div>
  );
};