import { useState, useRef, useLayoutEffect, useMemo } from 'react'
import { PanInfo } from 'framer-motion'
import type { Solution } from '../constants/solutionCarousel.constants'
import { wrap } from '../constants/solutionCarousel.constants'

interface UseInfiniteCarouselOptions {
  solutions: Solution[]
  targetN?: number | null
  language: string
}

export function useInfiniteCarousel({ solutions, targetN, language }: UseInfiniteCarouselOptions) {
  const total = solutions.length
  const [active, setActive] = useState(0)
  const measureRef = useRef<HTMLDivElement>(null)
  const mobileContainerRef = useRef<HTMLDivElement>(null)
  const panLock = useRef(false)
  const [mobileInstant, setMobileInstant] = useState(false)
  const [cardHeight, setCardHeight] = useState<number | null>(null)
  const [mobileWidth, setMobileWidth] = useState(0)
  const [trackIndex, setTrackIndex] = useState(1)

  const extendedSolutions = useMemo(
    () => [solutions[total - 1], ...solutions, solutions[0]],
    [solutions, total],
  )

  useLayoutEffect(() => {
    const container = measureRef.current
    if (!container) return

    const measure = () => {
      const heights = Array.from(container.children).map(
        (child) => child.getBoundingClientRect().height,
      )
      const max = Math.max(...heights, 0)
      if (max > 0) setCardHeight(max)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [targetN, solutions, language])

  useLayoutEffect(() => {
    const el = mobileContainerRef.current
    if (!el) return

    const update = () => setMobileWidth(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stageMinHeight = cardHeight ?? 500
  const desktopStageHeight = stageMinHeight + 48
  const prevIndex = wrap(active - 1, total)
  const nextIndex = wrap(active + 1, total)

  const isMobileViewport = () => window.matchMedia('(max-width: 767px)').matches

  const goTo = (index: number) => {
    const next = wrap(index, total)
    if (next === active) return

    const mobile = isMobileViewport()

    if (mobile && active === total - 1 && next === 0) {
      setActive(0)
      setTrackIndex(total + 1)
      return
    }
    if (mobile && active === 0 && next === total - 1) {
      setActive(total - 1)
      setTrackIndex(0)
      return
    }

    setActive(next)
    if (mobile) setTrackIndex(next + 1)
  }

  const goNext = () => {
    const mobile = isMobileViewport()

    if (mobile && trackIndex === total) {
      setActive(0)
      setTrackIndex(total + 1)
      return
    }

    const next = wrap(active + 1, total)
    setActive(next)
    if (mobile) setTrackIndex(next + 1)
  }

  const goPrev = () => {
    const mobile = isMobileViewport()

    if (mobile && trackIndex === 1) {
      setActive(total - 1)
      setTrackIndex(0)
      return
    }

    const prev = wrap(active - 1, total)
    setActive(prev)
    if (mobile) setTrackIndex(prev + 1)
  }

  const handleMobileAnimationComplete = () => {
    if (mobileInstant) {
      setMobileInstant(false)
      return
    }

    if (trackIndex === total + 1) {
      setMobileInstant(true)
      setTrackIndex(1)
    } else if (trackIndex === 0) {
      setMobileInstant(true)
      setTrackIndex(total)
    }
  }

  const handlePanEnd = (_: unknown, info: PanInfo) => {
    if (panLock.current) return

    const threshold = 50
    const velocityThreshold = 250
    const swipeLeft =
      info.offset.x < -threshold || info.velocity.x < -velocityThreshold
    const swipeRight =
      info.offset.x > threshold || info.velocity.x > velocityThreshold

    if (!swipeLeft && !swipeRight) return

    panLock.current = true
    if (swipeLeft) goNext()
    else goPrev()
    window.setTimeout(() => {
      panLock.current = false
    }, 450)
  }

  return {
    active,
    total,
    measureRef,
    mobileContainerRef,
    mobileInstant,
    stageMinHeight,
    desktopStageHeight,
    prevIndex,
    nextIndex,
    trackIndex,
    mobileWidth,
    extendedSolutions,
    goTo,
    goNext,
    goPrev,
    handleMobileAnimationComplete,
    handlePanEnd,
  }
}
