import React from 'react';
import CloudManager from "./services/cloud/CloudManager"; 
import ServerManager from "./services/server/ServerManager";

export default function Services() {
  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto py-[1.5rem] md:py-[2.5rem] px-[1rem] md:px-[2rem] flex flex-col gap-[2rem] max-w-[56rem]">
        
        {/* Naya Server Toggle & Features Panel */}
        <ServerManager />

        {/* Purana Cloud Manager */}
        <CloudManager />
        
      </div>
    </div>
  );
}