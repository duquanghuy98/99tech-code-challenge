import { useMemo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import CodeSnippet from '@/components/display/CodeSnippet'
import { TruncatedInteger } from '@/components/display/TruncatedNumber'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { badgeColorMap, type Solution } from '../constants/solutionCarousel.constants'
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback'
import {
  playbackIntervalMs,
  type PlaybackSpeed,
} from '../constants/playback.constants'
import { getGaussOperations } from '../visualizers/traceGauss'
import { getLoopOperations } from '../visualizers/traceLoop'
import { getRecursiveOperations } from '../visualizers/traceRecursive'
import GaussPairingViz, {
  getGaussHighlightLines,
  useGaussSteps,
} from './visualizers/GaussPairingViz'
import LoopStepperViz, {
  getLoopHighlightLines,
  useLoopSteps,
} from './visualizers/LoopStepperViz'
import RecursionStackViz, {
  getRecursionHighlightLines,
  useRecursionSteps,
} from './visualizers/RecursionStackViz'
import StepPlaybackControls from './visualizers/StepPlaybackControls'
import {
  vizStatCellClass,
  vizStatGridClass,
  vizStatLabelClass,
  vizStatValueClass,
} from './visualizers/vizStyles'
import type { GaussStep, LoopStep, RecursionStep } from '../visualizers/types'

interface AlgorithmDetailModalProps {
  impl: Solution
  n: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function useDetailSteps(key: Solution['key'], n: number | null) {
  const safeN = n ?? 0
  const gaussSteps = useGaussSteps(safeN)
  const loopSteps = useLoopSteps(safeN)
  const recursionSteps = useRecursionSteps(safeN)

  return useMemo(() => {
    if (key === 'a') return gaussSteps
    if (key === 'b') return loopSteps
    return recursionSteps
  }, [key, gaussSteps, loopSteps, recursionSteps])
}

function getHighlightLines(key: Solution['key'], step: GaussStep | LoopStep | RecursionStep): number[] {
  if (key === 'a') return getGaussHighlightLines(step as GaussStep)
  if (key === 'b') return getLoopHighlightLines(step as LoopStep)
  return getRecursionHighlightLines(step as RecursionStep)
}

function getOperations(key: Solution['key'], n: number | null): string {
  const safeN = n ?? 0
  if (key === 'a') {
    const ops = getGaussOperations(safeN)
    return ops === 1 ? '1' : '0'
  }
  if (key === 'b') return String(getLoopOperations(safeN))
  const { calls, maxDepth } = getRecursiveOperations(safeN)
  return `${calls} calls · depth ${maxDepth}`
}

export default function AlgorithmDetailModal({
  impl,
  n,
  open,
  onOpenChange,
}: AlgorithmDetailModalProps) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [speed, setSpeed] = useState<PlaybackSpeed>(1)
  const steps = useDetailSteps(impl.key, n)
  const playback = useAlgorithmPlayback({
    stepCount: steps.length,
    intervalMs: playbackIntervalMs(speed),
  })

  useEffect(() => {
    if (open) {
      playback.reset()
      setSpeed(1)
    }
  }, [open, impl.key, n])

  const currentStepData = steps[playback.currentStep]
  const highlightLines = currentStepData ? getHighlightLines(impl.key, currentStepData) : []
  const result = n !== null ? impl.fn(n) : null
  const safeN = n ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          'max-w-2xl',
          'max-md:inset-0 max-md:left-0 max-md:top-0 max-md:h-[100dvh] max-md:w-full max-md:max-w-none',
          'max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none max-md:max-h-none',
        ].join(' ')}
      >
        <div className="flex flex-col h-full min-h-0 md:max-h-[min(90vh,52rem)]">
          <DialogHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b shrink-0 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pr-8 min-w-0">
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-lg">{t(`problem1.implementations.${impl.key}.name`)}</DialogTitle>
                <DialogDescription className="mt-1 break-words">
                  {t(`problem1.detail.explain.${impl.key}`)}
                </DialogDescription>
              </div>
              <div className="flex gap-1.5 shrink-0 flex-wrap">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColorMap[impl.color]}`}>
                  {t('problem1.time')}: {impl.time}
                </span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColorMap[impl.color]}`}>
                  {t('problem1.space')}: {impl.space}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto overflow-x-hidden px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4 flex-1 min-h-0 min-w-0 w-full">
            {n === null ? (
              <p className="text-sm text-muted-foreground break-words">{t('problem1.detail.noInput')}</p>
            ) : (
              <>
                <div className={vizStatGridClass}>
                  <div className={vizStatCellClass}>
                    <p className={vizStatLabelClass}>n</p>
                    <p className={vizStatValueClass}>{n}</p>
                  </div>
                  <div className={vizStatCellClass}>
                    <p className={vizStatLabelClass}>{t('problem1.result')}</p>
                    <p className={vizStatValueClass}>
                      {result !== null ? <TruncatedInteger value={result} className="inline" /> : '-'}
                    </p>
                  </div>
                  <div className={vizStatCellClass}>
                    <p className={vizStatLabelClass}>{t('problem1.detail.work')}</p>
                    <p className={cn(vizStatValueClass, 'text-sm sm:text-lg')}>{getOperations(impl.key, n)}</p>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    {t('problem1.detail.visualization')}
                  </p>
                  <div className="min-w-0 overflow-hidden">
                  {impl.key === 'a' && (
                    <GaussPairingViz n={safeN} currentStep={playback.currentStep} />
                  )}
                  {impl.key === 'b' && (
                    <LoopStepperViz n={safeN} currentStep={playback.currentStep} />
                  )}
                  {impl.key === 'c' && (
                    <RecursionStackViz n={safeN} currentStep={playback.currentStep} />
                  )}
                  </div>
                </div>

                <StepPlaybackControls
                  className="min-w-0"
                  speed={speed}
                  onSpeedChange={setSpeed}
                  currentStep={playback.currentStep}
                  totalSteps={steps.length}
                  isPlaying={playback.isPlaying}
                  isAtStart={playback.isAtStart}
                  isAtEnd={playback.isAtEnd}
                  onPlay={playback.play}
                  onPause={playback.pause}
                  onReset={playback.reset}
                  onStepBack={playback.stepBack}
                  onStepForward={playback.stepForward}
                  onScrub={playback.goTo}
                />

                <div className="min-w-0 max-w-full overflow-hidden">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    {t('problem1.detail.codeTrace')}
                  </p>
                  <CodeSnippet
                    code={impl.snippet}
                    filename={`sum_to_n_${impl.key}(n)`}
                    highlightLines={highlightLines}
                    compact={isMobile}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
