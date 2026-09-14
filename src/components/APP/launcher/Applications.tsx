import { useAppStore } from '../../../store/useAppStore';
import { AppCard } from './AppCard';

export const Applications = () => {
  const { apps, launchApp, closeApp } = useAppStore();

  // 🔥 Sirf internal GUI Apps ko filter karo (Background services hatane ke liye)
  const displayApps = apps.filter(a => a.executable_path.startsWith('internal://'));

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-100 mb-2">Applications</h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage and launch your isolated environment modules.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayApps.map((app) => (
          <AppCard 
            key={app.id} 
            app={app} 
            onLaunch={() => launchApp(app.id)} 
            onClose={() => closeApp(app.id)}
          />
        ))}
      </div>
    </div>
  );
};