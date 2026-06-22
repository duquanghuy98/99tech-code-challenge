export type GaussStep =
  | { type: 'empty'; n: number; result: 0 }
  | { type: 'intro'; n: number; terms: number[] }
  | { type: 'pair'; left: number; right: number; pairSum: number; pairIndex: number; totalPairs: number }
  | { type: 'middle'; value: number }
  | { type: 'formula'; pairCount: number; pairSum: number; middle: number; result: number }

export type LoopStep =
  | { type: 'init'; sum: 0; highlightLine: 5 }
  | { type: 'check'; i: number; sum: number; willContinue: boolean; highlightLine: 6 }
  | { type: 'add'; i: number; sumBefore: number; sumAfter: number; highlightLine: 7 }
  | { type: 'done'; sum: number; highlightLine: 9 }

export type RecursionStep =
  | { type: 'call'; n: number; depth: number }
  | { type: 'base'; depth: number; returnValue: 0 }
  | { type: 'return'; n: number; depth: number; childValue: number; returnValue: number }

export type AlgorithmStep = GaussStep | LoopStep | RecursionStep
