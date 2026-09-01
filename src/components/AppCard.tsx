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
  
  // Dynamic Sizes for Squircle Box
  const boxDimensions = {
    small: 'w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-[16px]',
    medium: 'w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[18px] sm:rounded-[22px]',
    large: 'w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-[22px] sm:rounded-[26px]',
  };

  // Dynamic Sizes for inner SVG Icon
  const iconDimensions = {
    small: '[&>svg]:w-[24px] [&>svg]:h-[24px] sm:[&>svg]:w-[28px] sm:[&>svg]:h-[28px]',
    medium: '[&>svg]:w-[32px] [&>svg]:h-[32px] sm:[&>svg]:w-[36px] sm:[&>svg]:h-[36px]',
    large: '[&>svg]:w-[40px] [&>svg]:h-[40px] sm:[&>svg]:w-[48px] sm:[&>svg]:h-[48px]',
  };

  // Container sizing based on icon size
  const containerWidths = {
    small: 'w-16 sm:w-20 gap-2',
    medium: 'w-20 sm:w-24 gap-3.5',
    large: 'w-24 sm:w-28 gap-4',
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
        shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_25px_rgba(255,255,255,0.15)]
        flex items-center justify-center shrink-0
        transition-all duration-300 ease-out 
        group-hover:-translate-y-1.5 
        group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_12px_35px_rgba(255,255,255,0.25)]
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
          ${size === 'small' ? 'text-[11px]' : size === 'large' ? 'text-[15px]' : 'text-[13px] sm:text-sm'}
        `}>
          {name}
        </span>
      )}
    </div>
  );
};