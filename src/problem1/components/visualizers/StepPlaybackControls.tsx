import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  formatPlaybackSpeedLabel,
  nextPlaybackSpeed,
  type PlaybackSpeed,
} from '../../constants/playback.constants'

interface StepPlaybackControlsProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  isAtStart: boolean
  isAtEnd: boolean
  speed: PlaybackSpeed
  onSpeedChange: (speed: PlaybackSpeed) => void
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepBack: () => void
  onStepForward: () => void
  onScrub: (index: number) => void
  className?: string
}

export default function StepPlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  isAtStart,
  isAtEnd,
  speed,
  onSpeedChange,
  onPlay,
  onPause,
  onReset,
  onStepBack,
  onStepForward,
  onScrub,
  className,
}: StepPlaybackControlsProps) {
  const { t } = useTranslation()

  if (totalSteps <= 1) return null

  return (
    <div className={cn('space-y-3 min-w-0 max-w-full', className)}>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground tabular-nums min-w-0">
        <span className="truncate min-w-0">
          {t('problem1.detail.step', { current: currentStep + 1, total: totalSteps })}
        </span>
        <span className="shrink-0">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={currentStep}
        onChange={(e) => onScrub(Number(e.target.value))}
        className="w-full accent-primary h-1.5 cursor-pointer"
        aria-label={t('problem1.detail.scrubAria')}
      />

      <div className="relative flex items-center justify-center min-h-9 px-10 sm:px-12">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute left-0 h-8 w-8 rounded-full"
          onClick={onReset}
          aria-label={t('problem1.detail.reset')}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onStepBack}
            disabled={isAtStart}
            aria-label={t('problem1.detail.prevStep')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="default"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={isPlaying ? onPause : onPlay}
            aria-label={isPlaying ? t('problem1.detail.pause') : t('problem1.detail.play')}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onStepForward}
            disabled={isAtEnd}
            aria-label={t('problem1.detail.nextStep')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="absolute right-0 h-8 min-w-8 px-2 rounded-full text-[10px] sm:text-xs font-semibold tabular-nums"
          onClick={() => onSpeedChange(nextPlaybackSpeed(speed))}
          aria-label={t('problem1.detail.speedOption', {
            speed: formatPlaybackSpeedLabel(speed),
          })}
        >
          {formatPlaybackSpeedLabel(speed)}
        </Button>
      </div>
    </div>
  )
}
