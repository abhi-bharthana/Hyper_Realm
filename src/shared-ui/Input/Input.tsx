import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

// 1. Extend standard input props to keep it strictly typed but flexible
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string; // Optional error message
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        
        {/* Input Wrapper for relative positioning of icons */}
        <div className="relative flex items-center group">
          
          {/* Left Icon */}
          {leftIcon && (
            <span className="absolute left-3.5 text-gray-400 group-focus-within:text-blue-400 transition-colors pointer-events-none">
              {leftIcon}
            </span>
          )}

          {/* Core Input Field */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 transition-all duration-300",
              "focus:outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              // Dynamic padding based on icons
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              // Error state overriding borders
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10",
              className
            )}
            {...props}
          />

          {/* Right Icon (e.g., Password toggle or Clear button) */}
          {rightIcon && (
            <span className="absolute right-3.5 text-gray-400 flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error Message Display */}
        {error && (
          <span className="text-xs text-red-400 font-medium pl-1 animate-pulse">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';