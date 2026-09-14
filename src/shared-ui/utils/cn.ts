// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to conditionally join Tailwind classes 
 * and safely merge conflicting styles.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}