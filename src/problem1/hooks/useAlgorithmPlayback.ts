import { useCallback, useEffect, useState } from 'react'

interface UseAlgorithmPlaybackOptions {
  stepCount: number
  intervalMs?: number
  autoPlay?: boolean
}

export function useAlgorithmPlayback({
  stepCount,
  intervalMs = 900,
  autoPlay = false,
}: UseAlgorithmPlaybackOptions) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  const lastIndex = Math.max(0, stepCount - 1)

  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(autoPlay && stepCount > 1)
  }, [stepCount, autoPlay])

  useEffect(() => {
    if (!isPlaying || stepCount <= 1) return

    const timer = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= lastIndex) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [isPlaying, lastIndex, stepCount, intervalMs])

  const play = useCallback(() => {
    setCurrentStep((prev) => (prev >= lastIndex ? 0 : prev))
    setIsPlaying(true)
  }, [lastIndex])

  const pause = useCallback(() => setIsPlaying(false), [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(0)
  }, [])

  const stepForward = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.min(prev + 1, lastIndex))
  }, [lastIndex])

  const stepBack = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setIsPlaying(false)
      setCurrentStep(Math.min(Math.max(index, 0), lastIndex))
    },
    [lastIndex],
  )

  return {
    currentStep,
    isPlaying,
    isAtStart: currentStep === 0,
    isAtEnd: currentStep >= lastIndex,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    goTo,
  }
}
