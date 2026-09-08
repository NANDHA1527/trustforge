import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date | undefined) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch {
    return String(dateString);
  }
}

export function truncateHash(hash: string | undefined, head = 10, tail = 8) {
  if (!hash) return '';
  if (hash.length <= head + tail) return hash;
  return `${hash.substring(0, head)}...${hash.substring(hash.length - tail)}`;
}

export function getStatusTheme(status: string | undefined) {
  switch (status?.toUpperCase()) {
    case 'GENUINE':
    case 'MATCHED':
    case 'PASS':
    case 'CONFIRMED':
    case 'APPROVE':
    case 'RESOLVED':
      return {
        badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400'
      };
    case 'REVIEW REQUIRED':
    case 'REVIEW':
    case 'FLAGGED':
    case 'UNDER INVESTIGATION':
      return {
        badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400'
      };
    case 'SUSPICIOUS':
    case 'MISMATCH':
    case 'FAILED':
    case 'CRITICAL':
    case 'SUSPICIOUS_MODIFICATION_DETECTED':
    case 'ESCALATED':
      return {
        badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        dot: 'bg-rose-400'
      };
    case 'IN_PROGRESS':
    case 'OPEN':
    default:
      return {
        badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400'
      };
  }
}

export function getRiskLevel(score: number) {
  if (score >= 61) return { level: 'HIGH RISK', status: 'SUSPICIOUS', color: 'rose' };
  if (score >= 31) return { level: 'MEDIUM RISK', status: 'REVIEW REQUIRED', color: 'amber' };
  return { level: 'LOW RISK', status: 'GENUINE', color: 'emerald' };
}
