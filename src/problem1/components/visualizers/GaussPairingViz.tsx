import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { traceGauss } from '../../visualizers/traceGauss'
import type { GaussStep } from '../../visualizers/types'
import {
  vizMonoBoxClass,
  vizStepPanelClass,
  vizStepTextClass,
} from './vizStyles'

interface GaussPairingVizProps {
  n: number
  currentStep: number
}

function visibleTerms(terms: number[], max = 14): { items: number[] } {
  if (terms.length <= max) return { items: terms }
  return { items: [...terms.slice(0, 6), -1, ...terms.slice(-4)] }
}

const termTileClass =
  'inline-flex h-7 min-w-7 sm:h-8 sm:min-w-8 items-center justify-center rounded-lg bg-background border text-xs sm:text-sm font-semibold tabular-nums'
const pairTileClass =
  'inline-flex h-8 min-w-8 sm:h-9 sm:min-w-9 items-center justify-center rounded-lg font-bold tabular-nums text-sm sm:text-base'

export function useGaussSteps(n: number) {
  return useMemo(() => traceGauss(n), [n])
}

export default function GaussPairingViz({ n, currentStep }: GaussPairingVizProps) {
  const { t } = useTranslation()
  const steps = useGaussSteps(n)
  const step = steps[currentStep] as GaussStep

  const paired = useMemo(() => {
    const set = new Set<number>()
    for (let i = 0; i <= currentStep; i++) {
      const s = steps[i]
      if (s.type === 'pair') {
        set.add(s.left)
        set.add(s.right)
      }
      if (s.type === 'middle') set.add(s.value)
    }
    return set
  }, [currentStep, steps])

  const activePair =
    step.type === 'pair' ? { left: step.left, right: step.right } : null

  const introTerms = steps.find((s) => s.type === 'intro')?.terms ?? []

  return (
    <div className={cn(vizStepPanelClass, 'h-[9.5rem]')}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${n}-${currentStep}-${step.type}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
        {step.type === 'empty' && (
          <p className={cn(vizStepTextClass, 'text-muted-foreground')}>{t('problem1.detail.gauss.empty')}</p>
        )}

        {step.type === 'intro' && (
          <div className="space-y-3">
            <p className={vizStepTextClass}>{t('problem1.detail.gauss.intro', { n })}</p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center max-w-full">
              {visibleTerms(step.terms).items.map((term, idx) =>
                term === -1 ? (
                  <span key={`gap-${idx}`} className="px-1 text-muted-foreground self-center">…</span>
                ) : (
                  <span key={term} className={termTileClass}>
                    {term}
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {step.type === 'pair' && (
          <div className="space-y-3">
            <p className={vizStepTextClass}>
              {t('problem1.detail.gauss.pair', {
                left: step.left,
                right: step.right,
                sum: step.pairSum,
                index: step.pairIndex,
                total: step.totalPairs,
              })}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full">
              <span className={cn(pairTileClass, 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300')}>
                {step.left}
              </span>
              <span className="text-muted-foreground font-medium">+</span>
              <span className={cn(pairTileClass, 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300')}>
                {step.right}
              </span>
              <span className="text-muted-foreground font-medium">=</span>
              <span className={cn(pairTileClass, 'bg-primary/15 border border-primary/40')}>
                {step.pairSum}
              </span>
            </div>
            {introTerms.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center pt-1 max-w-full">
                {visibleTerms(introTerms, 12).items.map((term, idx) =>
                  term === -1 ? (
                    <span key={`gap-${idx}`} className="px-1 text-muted-foreground">…</span>
                  ) : (
                    <span
                      key={term}
                      className={cn(
                        'inline-flex h-6 min-w-6 sm:h-7 sm:min-w-7 items-center justify-center rounded-md border text-[10px] sm:text-xs tabular-nums',
                        paired.has(term)
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-background text-muted-foreground',
                        activePair && (term === activePair.left || term === activePair.right) &&
                          'ring-2 ring-emerald-500',
                      )}
                    >
                      {term}
                    </span>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {step.type === 'middle' && (
          <div className="space-y-2 text-center">
            <p className={vizStepTextClass}>{t('problem1.detail.gauss.middle', { value: step.value })}</p>
            <span className={cn(pairTileClass, 'bg-amber-500/15 border border-amber-500/40 inline-flex')}>
              {step.value}
            </span>
          </div>
        )}

        {step.type === 'formula' && (
          <div className="space-y-2">
            <p className={vizStepTextClass}>{t('problem1.detail.gauss.formulaIntro')}</p>
            <div className={cn(vizMonoBoxClass, 'space-y-1')}>
              {step.pairCount > 0 && (
                <p>
                  {step.pairCount} × {step.pairSum}
                  {step.middle > 0 ? ` + ${step.middle}` : ''} = {step.result}
                </p>
              )}
              <p className="text-primary font-semibold">
                n(n + 1) / 2 = {n} × {n + 1} / 2 = {step.result}
              </p>
            </div>
            <p className="text-muted-foreground text-xs break-words">{t('problem1.detail.gauss.constant')}</p>
          </div>
        )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function getGaussHighlightLines(step: GaussStep): number[] {
  if (step.type === 'empty') return [4]
  if (step.type === 'formula') return [5]
  return [4, 5]
}
