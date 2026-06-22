import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { traceLoop } from '../../visualizers/traceLoop'
import type { LoopStep } from '../../visualizers/types'
import {
  vizMonoBoxClass,
  vizRootClass,
  vizStatCellClass,
  vizStatGridClass,
  vizStatLabelClass,
  vizStatValueClass,
  vizStepPanelClass,
  vizStepTextClass,
} from './vizStyles'

interface LoopStepperVizProps {
  n: number
  currentStep: number
}

export function useLoopSteps(n: number) {
  return useMemo(() => traceLoop(n), [n])
}

function getActiveTileValue(step: LoopStep, n: number): number | null {
  if (n <= 0) return null
  if (step.type === 'init') return 1
  if (step.type === 'add' || step.type === 'check') return step.i
  if (step.type === 'done') return n
  return null
}

function isTileProcessed(value: number, step: LoopStep): boolean {
  if (step.type === 'add') return value <= step.i
  if (step.type === 'done' || (step.type === 'check' && !step.willContinue)) return true
  if (step.type === 'check') return value < step.i
  return false
}

export default function LoopStepperViz({ n, currentStep }: LoopStepperVizProps) {
  const { t } = useTranslation()
  const steps = useLoopSteps(n)
  const step = steps[currentStep] as LoopStep

  const runningSum =
    step.type === 'init'
      ? 0
      : step.type === 'done'
        ? step.sum
        : step.type === 'add'
          ? step.sumAfter
          : step.sum

  const activeTileValue = getActiveTileValue(step, n)
  const currentI = step.type === 'check' || step.type === 'add' ? step.i : null
  const activeTileRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    activeTileRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'nearest' })
  }, [currentStep, activeTileValue, n])

  return (
    <div className={vizRootClass}>
      <div className={vizStatGridClass}>
        <div className={vizStatCellClass}>
          <p className={vizStatLabelClass}>i</p>
          <p className={vizStatValueClass}>{currentI ?? '-'}</p>
        </div>
        <div className={vizStatCellClass}>
          <p className={vizStatLabelClass}>sum</p>
          <p className={vizStatValueClass}>{runningSum}</p>
        </div>
        <div className={vizStatCellClass}>
          <p className={vizStatLabelClass}>{t('problem1.detail.loop.iterations')}</p>
          <p className={vizStatValueClass}>{Math.max(0, n)}</p>
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
            {step.type === 'init' && <p className={vizStepTextClass}>{t('problem1.detail.loop.init')}</p>}
            {step.type === 'check' && (
              <p className={vizStepTextClass}>
                {step.willContinue
                  ? t('problem1.detail.loop.checkContinue', { i: step.i, sum: step.sum })
                  : t('problem1.detail.loop.checkExit', { i: step.i, sum: step.sum })}
              </p>
            )}
            {step.type === 'add' && (
              <div className="space-y-2">
                <p className={vizStepTextClass}>
                  {t('problem1.detail.loop.add', {
                    i: step.i,
                    before: step.sumBefore,
                    after: step.sumAfter,
                  })}
                </p>
                <p className={vizMonoBoxClass}>
                  sum = {step.sumBefore} + {step.i} = {step.sumAfter}
                </p>
              </div>
            )}
            {step.type === 'done' && (
              <p className={cn(vizStepTextClass, 'font-medium')}>
                {t('problem1.detail.loop.done', { sum: step.sum })}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {n > 0 && (
        <div className="space-y-1.5 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t('problem1.detail.loop.track')}
          </p>
          <div className="rounded-xl border bg-background/50 p-2 sm:p-3 max-h-[12rem] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-gutter-stable">
            <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center max-w-full">
              {Array.from({ length: n }, (_, idx) => {
                const value = idx + 1
                const processed = isTileProcessed(value, step)
                const active = activeTileValue === value
                return (
                  <span
                    key={value}
                    ref={active ? activeTileRef : undefined}
                    className={cn(
                      'inline-flex h-6 min-w-6 sm:h-7 sm:min-w-7 items-center justify-center rounded-md border text-[10px] sm:text-xs tabular-nums transition-colors',
                      active && 'ring-2 ring-blue-500 bg-blue-500/15 border-blue-500/40',
                      processed && !active && 'bg-blue-500/10 border-blue-500/25 text-blue-700 dark:text-blue-300',
                      !processed && !active && 'bg-background text-muted-foreground',
                    )}
                  >
                    {value}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function getLoopHighlightLines(step: LoopStep): number[] {
  return [step.highlightLine]
}
