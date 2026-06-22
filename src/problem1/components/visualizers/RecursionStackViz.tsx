import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { traceRecursive } from '../../visualizers/traceRecursive'
import type { RecursionStep } from '../../visualizers/types'
import {
  vizMonoBoxClass,
  vizRootClass,
  vizStatCellClass,
  vizStatLabelClass,
  vizStatValueClass,
  vizStepPanelClass,
  vizStepTextClass,
} from './vizStyles'

interface RecursionStackVizProps {
  n: number
  currentStep: number
}

interface StackFrame {
  n: number
  depth: number
  status: 'waiting' | 'base' | 'returned'
  returnValue?: number
}

function buildStack(steps: RecursionStep[], upToIndex: number): StackFrame[] {
  const frames: StackFrame[] = []

  for (let i = 0; i <= upToIndex; i++) {
    const step = steps[i]

    if (step.type === 'call') {
      frames.push({ n: step.n, depth: step.depth, status: 'waiting' })
    }

    if (step.type === 'base') {
      const idx = frames.findIndex((f) => f.n === 0)
      if (idx >= 0) {
        frames[idx] = { ...frames[idx], status: 'base', returnValue: 0 }
      }
    }

    if (step.type === 'return') {
      const idx = frames.findIndex((f) => f.n === step.n && f.depth === step.depth)
      if (idx >= 0) {
        frames[idx] = {
          ...frames[idx],
          status: 'returned',
          returnValue: step.returnValue,
        }
      }
    }
  }

  return frames
}

function getActiveFrameIndex(step: RecursionStep, stack: StackFrame[]): number {
  if (stack.length === 0) return -1
  if (step.type === 'call') {
    return stack.findIndex((f) => f.n === step.n && f.depth === step.depth)
  }
  if (step.type === 'base') {
    return stack.findIndex((f) => f.n === 0)
  }
  return stack.findIndex((f) => f.n === step.n && f.depth === step.depth)
}

export function useRecursionSteps(n: number) {
  return useMemo(() => traceRecursive(n), [n])
}

export default function RecursionStackViz({ n, currentStep }: RecursionStackVizProps) {
  const { t } = useTranslation()
  const steps = useRecursionSteps(n)
  const step = steps[currentStep] as RecursionStep
  const stack = useMemo(() => buildStack(steps, currentStep), [steps, currentStep])
  const maxDepth = n <= 0 ? 0 : n
  const activeFrameRef = useRef<HTMLDivElement>(null)
  const activeFrameIndex = useMemo(
    () => getActiveFrameIndex(step, stack),
    [step, stack],
  )

  useEffect(() => {
    activeFrameRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'nearest' })
  }, [currentStep, activeFrameIndex, stack.length])

  return (
    <div className={vizRootClass}>
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 min-w-0">
        <div className={vizStatCellClass}>
          <p className={vizStatLabelClass}>{t('problem1.detail.recursion.depth')}</p>
          <p className={vizStatValueClass}>
            {step.type === 'call' ? step.depth + 1 : step.type === 'return' ? step.depth + 1 : maxDepth + 1}
            <span className="text-xs sm:text-sm text-muted-foreground font-normal"> / {maxDepth + 1}</span>
          </p>
        </div>
        <div className={vizStatCellClass}>
          <p className={vizStatLabelClass}>{t('problem1.detail.recursion.calls')}</p>
          <p className={vizStatValueClass}>{Math.max(1, n + 1)}</p>
        </div>
      </div>

      <div className={cn(vizStepPanelClass, 'h-[8.5rem]')}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${n}-${currentStep}-${step.type}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {step.type === 'call' && (
              <p className={vizStepTextClass}>{t('problem1.detail.recursion.call', { n: step.n })}</p>
            )}
            {step.type === 'base' && (
              <p className={vizStepTextClass}>{t('problem1.detail.recursion.base')}</p>
            )}
            {step.type === 'return' && (
              <div className="space-y-2">
                <p className={vizStepTextClass}>
                  {t('problem1.detail.recursion.return', {
                    n: step.n,
                    child: step.childValue,
                    result: step.returnValue,
                  })}
                </p>
                <p className={vizMonoBoxClass}>
                  sum({step.n}) = {step.n} + sum({step.n - 1}) = {step.n} + {step.childValue} = {step.returnValue}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-1.5 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('problem1.detail.recursion.stack')}
        </p>
        <div className="rounded-xl border bg-background/50 p-2 sm:p-3 h-[12rem] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-gutter-stable">
          <div className="space-y-1.5 w-full min-w-0">
            {stack.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('problem1.detail.recursion.emptyStack')}
              </p>
            ) : (
              stack.map((frame, index) => (
                <div
                  key={`${frame.n}-${frame.depth}`}
                  ref={index === activeFrameIndex ? activeFrameRef : undefined}
                  className={cn(
                    'rounded-lg border px-2.5 sm:px-3 py-2 text-[11px] sm:text-sm font-mono flex items-center justify-between gap-2 w-full min-w-0 max-w-full',
                    index === activeFrameIndex && 'ring-2 ring-violet-500/50',
                    frame.status === 'waiting' && 'border-violet-500/30 bg-violet-500/8',
                    frame.status === 'base' && 'border-amber-500/40 bg-amber-500/10',
                    frame.status === 'returned' && 'border-emerald-500/40 bg-emerald-500/10',
                  )}
                >
                  <span className="shrink-0">sum({frame.n})</span>
                  <span className="text-muted-foreground truncate text-right min-w-0">
                    {frame.status === 'waiting' && t('problem1.detail.recursion.waiting')}
                    {frame.status === 'base' && '→ 0'}
                    {frame.status === 'returned' && `→ ${frame.returnValue}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function getRecursionHighlightLines(step: RecursionStep): number[] {
  if (step.type === 'call') return [4, 5]
  if (step.type === 'base') return [4]
  return [5]
}
