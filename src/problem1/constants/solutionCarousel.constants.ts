export interface Solution {
  key: 'a' | 'b' | 'c'
  fn: (n: number) => number
  time: string
  space: string
  color: string
  snippet: string
}

export const borderMap: Record<string, string> = {
  emerald: 'border-emerald-500/30',
  blue: 'border-blue-500/30',
  violet: 'border-violet-500/30',
}

export const badgeColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  violet: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
}

export const dotColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
}

export function wrap(index: number, total: number) {
  return ((index % total) + total) % total
}

export function getOffset(index: number, active: number, total: number): number {
  let diff = index - active
  if (diff > total / 2) diff -= total
  if (diff < -total / 2) diff += total
  return diff
}
