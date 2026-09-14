import React, { HTMLAttributes, ElementType } from 'react';
import { cn } from '../utils/cn';

// ==========================================
// 1. HEADING COMPONENT
// ==========================================
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingVariant = 'default' | 'premium';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  variant?: HeadingVariant;
  as?: ElementType; // Allows overriding the HTML tag if needed
}

export const Heading = ({ 
  level = 'h2', 
  variant = 'default', 
  as, 
  className, 
  children, 
  ...props 
}: HeadingProps) => {
  // Use 'as' prop if provided, otherwise default to the 'level' (h1, h2, etc.)
  const Tag = as || level; 

  const sizeStyles: Record<HeadingLevel, string> = {
    h1: "text-4xl md:text-6xl font-extrabold tracking-tighter",
    h2: "text-3xl md:text-4xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold tracking-tight",
    h4: "text-xl md:text-2xl font-semibold",
    h5: "text-lg md:text-xl font-medium",
    h6: "text-base md:text-lg font-medium",
  };

  const variantStyles: Record<HeadingVariant, string> = {
    default: "text-white",
    // Tera signature gradient premium effect
    premium: "text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-sm",
  };

  return (
    <Tag className={cn(sizeStyles[level], variantStyles[variant], className)} {...props}>
      {children}
    </Tag>
  );
};

// ==========================================
// 2. TEXT COMPONENT
// ==========================================
export type TextVariant = 'default' | 'muted' | 'lead';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
}

export const Text = ({ variant = 'default', className, children, ...props }: TextProps) => {
  const variantStyles: Record<TextVariant, string> = {
    default: "text-gray-200 text-base",
    // Tera signature UI detail
    muted: "text-sm font-medium text-gray-400 tracking-wide uppercase",
    lead: "text-lg text-gray-300",
  };

  return (
    <p className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </p>
  );
};