import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRank(level: number): string {
  if (level >= 10) return "Elite";
  if (level >= 8) return "Platinum";
  if (level >= 5) return "Gold";
  if (level >= 3) return "Silver";
  return "Bronze";
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}
