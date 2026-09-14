import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

// 1. Strict Typing for variants and sizes
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'premium';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

// 2. Interface extending Framer Motion props
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

// 3. Styling Maps (Single Source of Truth for Button Styles)
const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 border border-transparent shadow-sm",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent",
  ghost: "bg-transparent text-gray-300 hover:bg-white/10 hover:text-white border border-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent shadow-sm",
  // Tera signature premium glassmorphism effect!
  premium: "bg-white/10 border border-white/20 text-white shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] hover:bg-white/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-2xl",
  icon: "p-2 rounded-xl flex items-center justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, ...props }, ref) => {
    
    return (
      <motion.button
        ref={ref}
        // Base classes jo har button mein hongi
        className={cn(
          "relative inline-flex items-center justify-center font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden group tracking-wide",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        // Micro-interactions via Framer Motion
        whileHover={props.whileHover || { scale: 1.02 }}
        whileTap={props.whileTap || { scale: 0.98 }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {/* Shine effect specifically scoped for the 'premium' variant */}
        {variant === 'premium' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        )}

        {/* Content Wrapper (hides when loading) */}
        <span className={cn("relative z-10 flex items-center gap-2", isLoading && "opacity-0")}>
           {children}
        </span>
        
        {/* Sleek Loading Spinner */}
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
             <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';