import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely parses JSON data with error handling
 */
export function safeJsonParse(data: any, fallback: any = undefined) {
  if (!data) return fallback;
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    // For objects, we use this technique to deep clone and ensure it's serializable
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

/**
 * Ensures that the provided value is an array or returns a fallback
 */
export function ensureArray(value: any, fallback: any[] = []): any[] {
  if (Array.isArray(value)) {
    return value;
  }
  
  if (!value) {
    return fallback;
  }
  
  try {
    // Try to parse if it's a string
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    }
    
    // If it's an object with a length property, try to convert it
    if (typeof value === 'object' && value !== null && 'length' in value) {
      return Array.from(value);
    }
  } catch (error) {
    console.error('Error ensuring array:', error);
  }
  
  return fallback;
}

/**
 * Formats a date string for display
 */
export function formatDate(date: string | Date) {
  if (!date) return '';
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return String(date);
  }
}
