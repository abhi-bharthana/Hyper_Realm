import AppCard from './AppCard';
import { useAppStore } from '../store/useAppStore';

export default function Applications() {
  const { apps } = useAppStore();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}