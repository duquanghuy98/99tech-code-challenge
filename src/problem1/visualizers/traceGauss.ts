import type { GaussStep } from './types'

const MAX_PAIR_STEPS = 12

export function traceGauss(n: number): GaussStep[] {
  if (n <= 0) {
    return [{ type: 'empty', n, result: 0 }]
  }

  const terms = Array.from({ length: n }, (_, i) => i + 1)
  const steps: GaussStep[] = [{ type: 'intro', n, terms }]
  const pairCount = Math.floor(n / 2)
  const pairSum = n + 1
  const middle = n % 2 === 1 ? Math.ceil(n / 2) : 0

  if (pairCount === 0) {
    steps.push({
      type: 'formula',
      pairCount: 0,
      pairSum,
      middle: 1,
      result: 1,
    })
    return steps
  }

  const showAllPairs = pairCount <= MAX_PAIR_STEPS
  const pairIndices = showAllPairs
    ? Array.from({ length: pairCount }, (_, i) => i)
    : [0, 1, 2, Math.floor(pairCount / 2), pairCount - 1].filter(
        (value, index, arr) => arr.indexOf(value) === index && value < pairCount,
      )

  for (const pairIndex of pairIndices) {
    const left = pairIndex + 1
    const right = n - pairIndex
    steps.push({
      type: 'pair',
      left,
      right,
      pairSum,
      pairIndex: pairIndex + 1,
      totalPairs: pairCount,
    })
  }

  if (middle > 0) {
    steps.push({ type: 'middle', value: middle })
  }

  const result = (n * (n + 1)) / 2
  steps.push({
    type: 'formula',
    pairCount,
    pairSum,
    middle,
    result,
  })

  return steps
}

export function getGaussOperations(n: number): number {
  return n <= 0 ? 0 : 1
}
