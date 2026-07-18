import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getStatusColor(status) {
  const colors = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    available: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    good: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    rented: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    returned: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    cancelled: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    blocked: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    maintenance: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    damaged: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    minor_damage: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    refunded: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  };
  return colors[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
