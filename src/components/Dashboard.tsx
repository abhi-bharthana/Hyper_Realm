import React from 'react';
import { Activity, Cpu, HardDrive, Zap, Settings, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card, Heading, Text, Button } from '@/shared-ui';

export default function Dashboard() {
  const { environmentName, setActiveTab } = useAppStore();

  return (
    <div className="flex flex-col gap-6 h-full pb-4">
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Text variant="muted">Active Workspace</Text>
          <Heading level="h2" variant="premium">
            {environmentName}
          </Heading>
        </div>
        
        {/* Refactored to use our shared Button component */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setActiveTab('Node Settings')}
          className="hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/10 group"
          title="Node Settings"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500 text-zinc-600 dark:text-zinc-300" />
        </Button>
      </div>

      {/* Clean Metric Grid - Bento Box Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<Cpu />} label="Core Processor" value="ARM64 Oryon" status="Optimal" />
        <MetricCard icon={<Activity />} label="System Load" value="1.42 GHz" status="Stable" />
        <MetricCard icon={<HardDrive />} label="Memory Usage" value="12.4 / 32 GB" status="38%" />
        <MetricCard icon={<Zap />} label="Node Efficiency" value="99.8%" status="Active" />
      </div>

      {/* Quick Diagnostics Section */}
      <div className="mt-2">
        <Text variant="muted" className="mb-4">Quick Diagnostics</Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Diagnostic Card 1 */}
          <Card 
            variant="glass" 
            padding="md"
            onClick={() => setActiveTab('Processes')}
            className="cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <Heading level="h5" className="text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500 transition-colors">
                  Process Monitor
                </Heading>
                <Text variant="default" className="text-xs text-zinc-500 dark:text-zinc-400">
                  View live system metrics & RAM consumption
                </Text>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Card>

          {/* Diagnostic Card 2 */}
          <Card 
            variant="glass" 
            padding="md"
            onClick={() => setActiveTab('Battery')}
            className="cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <Heading level="h5" className="text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
                  Power & Battery
                </Heading>
                <Text variant="default" className="text-xs text-zinc-500 dark:text-zinc-400">
                  Manage power modes & efficiency states
                </Text>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Card>

        </div>
      </div>
    </div>
  );
}

// Sub-component refactored to use Card and Text components
function MetricCard({ icon, label, value, status }: { icon: React.ReactNode, label: string, value: string, status: string }) {
  return (
    <Card 
      variant="glass" 
      padding="md" 
      className="flex flex-col justify-between hover:shadow-lg transition-shadow group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          {status}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <Text variant="default" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </Text>
        <Heading level="h4" className="text-zinc-900 dark:text-zinc-100 tracking-tight">
          {value}
        </Heading>
      </div>
    </Card>
  );
}