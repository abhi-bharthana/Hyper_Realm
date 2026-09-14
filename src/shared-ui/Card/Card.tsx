import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

// 1. Strict Typing
export type CardVariant = 'glass' | 'solid' | 'outline';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  withGlow?: boolean; // Premium ambient light toggle
}

// 2. Styling Maps
const variantStyles: Record<CardVariant, string> = {
  glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
  solid: "bg-[#121212] border border-white/10 shadow-xl", // Perfect for dark mode solid areas
  outline: "bg-transparent border border-white/20",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', padding = 'md', withGlow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        // Base classes jo har card ko shape dengi
        className={cn(
          "relative rounded-3xl overflow-hidden transition-all duration-300",
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {/* Premium Ambient Glow Effect - Only shows if requested */}
        {withGlow && variant === 'glass' && (
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        )}
        
        {/* Content Wrapper - Keeps content above the background glow */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';