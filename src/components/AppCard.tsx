import React from 'react';

interface AppCardProps {
  name: string;
  icon: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  onClick?: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({ 
  name, 
  icon, 
  size = 'medium', 
  showName = true, 
  onClick 
}) => {
  
  // Dynamic Sizes for Squircle Box (Scaled with rem for UI Slider sync)
  const boxDimensions = {
    small: 'w-[3rem] h-[3rem] sm:w-[3.5rem] sm:h-[3.5rem] rounded-[0.8rem] sm:rounded-[1rem]',
    medium: 'w-[4rem] h-[4rem] sm:w-[4.5rem] sm:h-[4.5rem] rounded-[1.1rem] sm:rounded-[1.3rem]',
    large: 'w-[5rem] h-[5rem] sm:w-[5.5rem] sm:h-[5.5rem] rounded-[1.3rem] sm:rounded-[1.6rem]',
  };

  // Dynamic Sizes for inner SVG Icon (Scaled with rem)
  const iconDimensions = {
    small: '[&>svg]:w-[1.5rem] [&>svg]:h-[1.5rem] sm:[&>svg]:w-[1.75rem] sm:[&>svg]:h-[1.75rem]',
    medium: '[&>svg]:w-[2rem] [&>svg]:h-[2rem] sm:[&>svg]:w-[2.25rem] sm:[&>svg]:h-[2.25rem]',
    large: '[&>svg]:w-[2.5rem] [&>svg]:h-[2.5rem] sm:[&>svg]:w-[3rem] sm:[&>svg]:h-[3rem]',
  };

  // Container sizing based on icon size (Scaled with rem)
  const containerWidths = {
    small: 'w-[4rem] sm:w-[5rem] gap-[0.5rem]',
    medium: 'w-[5rem] sm:w-[6rem] gap-[0.75rem]',
    large: 'w-[6rem] sm:w-[7rem] gap-[1rem]',
  };

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-start cursor-pointer group ${containerWidths[size]}`}
    >
      <div className={`
        ${boxDimensions[size]}
        ${iconDimensions[size]}
        bg-[#1a1a1a] dark:bg-white
        border border-transparent dark:border-slate-200/50
        shadow-[0_0.5rem_2rem_rgba(0,0,0,0.15)] dark:shadow-[0_0.5rem_1.5rem_rgba(255,255,255,0.15)]
        flex items-center justify-center shrink-0
        transition-all duration-300 ease-out 
        group-hover:-translate-y-[0.3rem] 
        group-hover:shadow-[0_0.75rem_2.5rem_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_0.75rem_2rem_rgba(255,255,255,0.25)]
        group-active:scale-95 
        [&>svg]:stroke-white dark:[&>svg]:stroke-[#1a1a1a]
        [&>svg]:stroke-[1.5]
        [&>svg]:transition-transform [&>svg]:duration-300
        group-hover:[&>svg]:scale-110
      `}>
        {icon}
      </div>
      
      {showName && (
        <span className={`
          text-slate-700 dark:text-slate-200 font-semibold tracking-wide truncate w-full text-center transition-colors duration-200
          ${size === 'small' ? 'text-[0.7em]' : size === 'large' ? 'text-[0.95em]' : 'text-[0.8em] sm:text-[0.85em]'}
        `}>
          {name}
        </span>
      )}
    </div>
  );
};