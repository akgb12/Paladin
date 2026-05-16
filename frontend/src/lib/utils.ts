import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined, currency = 'USD'): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  const d = new Date(Number(year), Number(month) - 1, Number(day))
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const d = new Date(Number(year), Number(month) - 1, 1)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    UPLOADED: 'Uploaded',
    EXTRACTED: 'Extracted',
    NEEDS_REVIEW: 'Needs Review',
    CORRECTED: 'Corrected',
    FAILED: 'Failed',
  }
  return labels[status] ?? status
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    UPLOADED: 'bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200/60',
    EXTRACTED: 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200/60',
    NEEDS_REVIEW: 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200/70',
    CORRECTED: 'bg-violet-100 text-violet-700 ring-1 ring-inset ring-violet-200/60',
    FAILED: 'bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200/60',
  }
  return colors[status] ?? 'bg-ink-100 text-ink-700 ring-1 ring-inset ring-ink-200/60'
}

export function merchantInitials(name: string): string {
  if (!name) return '?'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function merchantAccent(name: string): string {
  const palette = [
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
    'from-indigo-400 to-purple-500',
    'from-emerald-400 to-teal-500',
    'from-sky-400 to-blue-500',
    'from-violet-400 to-fuchsia-500',
    'from-yellow-400 to-amber-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
}
