import type { RecursionStep } from './types'

export function traceRecursive(n: number): RecursionStep[] {
  if (n <= 0) {
    return [{ type: 'base', depth: 0, returnValue: 0 }]
  }

  const steps: RecursionStep[] = []

  for (let current = n; current >= 0; current--) {
    steps.push({ type: 'call', n: current, depth: n - current })
    if (current === 0) {
      steps.push({ type: 'base', depth: n, returnValue: 0 })
      break
    }
  }

  for (let current = 1; current <= n; current++) {
    const childValue = current === 1 ? 0 : (current - 1) * current / 2
    const returnValue = current + childValue
    steps.push({
      type: 'return',
      n: current,
      depth: n - current,
      childValue,
      returnValue,
    })
  }

  return steps
}

export function getRecursiveOperations(n: number): { calls: number; maxDepth: number } {
  if (n <= 0) return { calls: 1, maxDepth: 0 }
  return { calls: n + 1, maxDepth: n }
}
