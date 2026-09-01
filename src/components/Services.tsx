import React from 'react';
import CloudManager from "./services/cloud/CloudManager"; //[cite: 8]
import ServerManager from "./services/server/ServerManager"; // Naya import

export default function Services() {
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-neutral-950 custom-scrollbar">
      <div className="container mx-auto py-8 px-4 flex flex-col gap-6">
        
        {/* Naya Server Toggle & Features Panel */}
        <ServerManager />

        {/* Purana Cloud Manager[cite: 8] */}
        <CloudManager />
        
      </div>
    </div>
  );
}