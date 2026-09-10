import IdentityCard from './IdentityCard';
import HardwareSpecs from './HardwareSpecs';

export default function Profile() {
  return (
    <div className="flex flex-col gap-5 h-full pb-6 px-4 md:px-8 overflow-y-auto custom-scrollbar text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <IdentityCard />
      <HardwareSpecs />
    </div>
  );
}