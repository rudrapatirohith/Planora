import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date, fmt: string = 'MMM d, yyyy'): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, fmt)
  } catch {
    return String(date)
  }
}

export function formatRelativeDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return String(date)
  }
}

export function getDaysBetween(start: string, end: string): number {
  try {
    return differenceInDays(parseISO(end), parseISO(start)) + 1
  } catch {
    return 0
  }
}

export function getDaysUntil(date: string): number {
  try {
    return differenceInDays(parseISO(date), new Date())
  } catch {
    return 0
  }
}

export function generateDaysBetween(start: string, end: string): Date[] {
  const dates: Date[] = []
  try {
    const startDate = parseISO(start)
    const endDate = parseISO(end)
    const current = new Date(startDate)
    while (current <= endDate) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
  } catch {}
  return dates
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function isDateInPast(date: string): boolean {
  try {
    return parseISO(date) < new Date()
  } catch {
    return false
  }
}

export function isDateInFuture(date: string): boolean {
  try {
    return parseISO(date) > new Date()
  } catch {
    return false
  }
}

export function getTripStatusColor(status: string): string {
  const colors: Record<string, string> = {
    planning: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    completed: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    archived: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
  }
  return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20'
}

export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-amber-400 bg-amber-400/10',
    confirmed: 'text-emerald-400 bg-emerald-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
    completed: 'text-gray-400 bg-gray-400/10',
  }
  return colors[status] || 'text-gray-400 bg-gray-400/10'
}

export function getBudgetPercentage(actual: number, planned: number): number {
  if (planned <= 0) return actual > 0 ? 100 : 0
  return Math.round((actual / planned) * 100)
}

export function parseFormNumber(value: string | null | undefined): number | undefined {
  if (!value) return undefined
  const num = parseFloat(value)
  return isNaN(num) ? undefined : num
}
