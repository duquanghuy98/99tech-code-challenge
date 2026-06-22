import type { LoopStep } from './types'

export function traceLoop(n: number): LoopStep[] {
  if (n <= 0) {
    return [{ type: 'done', sum: 0, highlightLine: 9 }]
  }

  const steps: LoopStep[] = [{ type: 'init', sum: 0, highlightLine: 5 }]
  let sum = 0

  for (let i = 1; i <= n; i++) {
    steps.push({
      type: 'check',
      i,
      sum,
      willContinue: true,
      highlightLine: 6,
    })
    const sumBefore = sum
    sum += i
    steps.push({
      type: 'add',
      i,
      sumBefore,
      sumAfter: sum,
      highlightLine: 7,
    })
  }

  steps.push({
    type: 'check',
    i: n + 1,
    sum,
    willContinue: false,
    highlightLine: 6,
  })
  steps.push({ type: 'done', sum, highlightLine: 9 })

  return steps
}

export function getLoopOperations(n: number): number {
  return n <= 0 ? 0 : n
}
