import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  dotColorMap,
  getOffset,
  type Solution,
} from '../constants/solutionCarousel.constants'
import { useInfiniteCarousel } from '../hooks/useInfiniteCarousel'
import SolutionCardPanel from './SolutionCardPanel'

export type { Solution } from '../constants/solutionCarousel.constants'

interface SolutionCarouselProps {
  solutions: Solution[]
  n: number | null
  targetN?: number | null
  isResultPending?: boolean
}

export default function SolutionCarousel({
  solutions,
  n,
  targetN = n,
  isResultPending = false,
}: SolutionCarouselProps) {
  const { t, i18n } = useTranslation()
  const {
    active,
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
    handleMobileAnimationComplete,
    handlePanEnd,
  } = useInfiniteCarousel({ solutions, targetN, language: i18n.language })

  const pagination = (
    <>
      <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3 mt-1 sm:mt-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full shrink-0"
          onClick={() => goTo(prevIndex)}
          aria-label={t('problem1.carousel.prevAria')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {solutions.map((impl, i) => (
            <button
              key={impl.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t(`problem1.implementations.${impl.key}.name`)}
              className="flex h-4 w-6 items-center justify-center"
            >
              <span
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  active === i
                    ? `w-6 ${dotColorMap[impl.color]}`
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50',
                )}
              />
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full shrink-0"
          onClick={() => goTo(nextIndex)}
          aria-label={t('problem1.carousel.nextAria')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-2 md:block hidden">
        {t('problem1.carousel.hintDesktop')}
      </p>
      <p className="text-center text-xs text-muted-foreground mt-2 md:hidden">
        {t('problem1.carousel.hintMobile')}
      </p>
    </>
  )

  return (
    <div className="max-w-full max-md:overflow-x-hidden">
      <div
        ref={measureRef}
        className="pointer-events-none absolute -left-[9999px] top-0 w-[min(100%,36rem)] opacity-0"
        aria-hidden="true"
      >
        {solutions.map((impl) => (
          <div key={impl.key} data-measure-card>
            <SolutionCardPanel impl={impl} n={targetN} active={false} />
          </div>
        ))}
      </div>

      <div className="md:hidden overflow-x-hidden max-w-full">
        <div
          ref={mobileContainerRef}
          className="overflow-hidden w-full"
          style={{ minHeight: stageMinHeight }}
        >
          <motion.div
            className="flex touch-pan-y"
            animate={{ x: mobileWidth > 0 ? -trackIndex * mobileWidth : 0 }}
            transition={
              mobileInstant
                ? { duration: 0 }
                : { type: 'spring', stiffness: 320, damping: 32 }
            }
            onAnimationComplete={handleMobileAnimationComplete}
            onPanEnd={handlePanEnd}
          >
            {extendedSolutions.map((impl, i) => (
              <div
                key={`${impl.key}-track-${i}`}
                className="shrink-0"
                style={{
                  width: mobileWidth > 0 ? mobileWidth : '100%',
                  minHeight: stageMinHeight,
                }}
              >
                <SolutionCardPanel
                  impl={impl}
                  n={n}
                  active={trackIndex === i}
                  isResultPending={isResultPending}
                  className="h-full"
                />
              </div>
            ))}
          </motion.div>
        </div>
        {pagination}
      </div>

      <div
        className="hidden md:block relative mx-auto w-full overflow-visible pt-2"
        style={{ perspective: '1400px' }}
      >
        <motion.div
          className="relative overflow-visible pt-6 pb-2"
          style={{
            transformStyle: 'preserve-3d',
            minHeight: desktopStageHeight,
          }}
          onPanEnd={handlePanEnd}
        >
          {solutions
            .map((impl, index) => ({
              impl,
              index,
              offset: getOffset(index, active, solutions.length),
            }))
            .filter(({ offset }) => Math.abs(offset) <= 1)
            .sort((a, b) => (a.offset === 0 ? 1 : b.offset === 0 ? -1 : a.offset - b.offset))
            .map(({ impl, offset }) => {
              const isActive = offset === 0

              return (
                <motion.div
                  key={impl.key}
                  className="absolute top-6 left-1/2 w-[min(100%,36rem)]"
                  initial={false}
                  animate={{
                    x: `calc(-50% + ${offset * 62}%)`,
                    scale: isActive ? 1 : 0.78,
                    rotateY: offset * -32,
                    z: isActive ? 160 : -220,
                    opacity: isActive ? 1 : 0.5,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 28,
                    mass: 0.85,
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    zIndex: isActive ? 30 : 5,
                  }}
                >
                  <div
                    className={cn(
                      'h-full rounded-xl overflow-hidden',
                      isActive && 'isolate bg-background',
                      !isActive && 'blur-[4px] saturate-75 pointer-events-none',
                    )}
                    style={{ height: stageMinHeight }}
                  >
                    <SolutionCardPanel
                      impl={impl}
                      n={n}
                      active={isActive}
                      isResultPending={isResultPending}
                      className="h-full"
                    />
                  </div>
                </motion.div>
              )
            })}
        </motion.div>

        <button
          type="button"
          className="absolute left-0 top-6 bottom-20 z-50 w-[28%] max-w-[11rem] cursor-pointer bg-transparent border-0 p-0"
          onClick={() => goTo(prevIndex)}
          aria-label={t(`problem1.implementations.${solutions[prevIndex].key}.name`)}
        />
        <button
          type="button"
          className="absolute right-0 top-6 bottom-20 z-50 w-[28%] max-w-[11rem] cursor-pointer bg-transparent border-0 p-0"
          onClick={() => goTo(nextIndex)}
          aria-label={t(`problem1.implementations.${solutions[nextIndex].key}.name`)}
        />

        <div className="relative z-10 mt-2">{pagination}</div>
      </div>
    </div>
  )
}
