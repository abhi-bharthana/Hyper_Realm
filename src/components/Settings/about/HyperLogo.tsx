import React from 'react';

export const HyperLogo = ({ className = "w-24 h-24" }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Premium Squircle Background (Apple style rounded corners) */}
    <rect 
      width="100" 
      height="100" 
      rx="24" 
      className="fill-[#0a0a0c] dark:fill-white transition-colors duration-500" 
    />
    
    {/* Perfect Mathematically Balanced Lightning Bolt */}
    <polygon 
      points="58,12 22,54 52,54 42,88 78,46 48,46" 
      className="fill-white dark:fill-[#0a0a0c] transition-colors duration-500" 
    />
  </svg>
);