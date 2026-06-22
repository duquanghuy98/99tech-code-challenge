import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, ArrowLeftRight, Bug, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PageTransition from '@/components/display/PageTransition'
import FuzzyText from '@/components/effects/FuzzyText'
import BorderGlow from '@/components/effects/BorderGlow'
import DecryptedText from '@/components/effects/DecryptedText'


const problemRoutes = ['/problem1', '/problem2', '/problem3'] as const
const problemIcons = [Code2, ArrowLeftRight, Bug]
const problemKeys = ['p1', 'p2', 'p3'] as const

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const ROTATING_WORDS = ['React', 'TS', 'Vite']

export default function LandingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex(i => (i + 1) % ROTATING_WORDS.length)
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')

    const applyOverflowLock = () => {
      document.documentElement.style.overflowX = mediaQuery.matches ? 'hidden' : ''
    }

    applyOverflowLock()
    mediaQuery.addEventListener('change', applyOverflowLock)
    return () => {
      mediaQuery.removeEventListener('change', applyOverflowLock)
      document.documentElement.style.overflowX = ''
    }
  }, [])

  return (
    <PageTransition>
      <div className="flex flex-col page-container max-sm:!px-3 max-sm:overflow-x-hidden min-w-0">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center pt-4 sm:pt-6 pb-3 sm:pb-4 relative max-sm:overflow-x-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] max-w-full max-h-full rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute top-1/4 left-1/3 -translate-x-1/4 size-72 max-w-[70%] max-h-[70%] rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center gap-3 sm:gap-4 max-w-2xl"
          >
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-xs font-medium border-primary/30 text-primary"
            >
              <Sparkles className="h-3 w-3" />
              {t('landing.badge')}
            </Badge>

            <h1 className="font-black tracking-tight w-full flex justify-center">
              <FuzzyText
                fontSize="clamp(2.5rem, 8vw, 6rem)"
                fontWeight={900}
                baseIntensity={0.15}
                hoverIntensity={0.6}
                transitionDuration={300}
                enableHover
                gradient={['#a78bfa', '#818cf8', '#38bdf8']}
              >
                {t('landing.title')}
              </FuzzyText>
            </h1>

            <p className="text-muted-foreground text-lg w-full max-w-md leading-relaxed">
              {t('landing.subtitlePrefix')}{' '}
              <span className="inline-block w-[3.2rem] align-bottom px-1">
                <DecryptedText
                  key={wordIndex}
                  text={ROTATING_WORDS[wordIndex]}
                  animateOn="view"
                  sequential
                  revealDirection="start"
                  speed={40}
                  className="text-primary font-semibold"
                  encryptedClassName="text-primary/50"
                />
              </span>
              .{' '}{t('landing.subtitleSuffix')}
            </p>
          </motion.div>
        </section>

        {/* Problem cards */}
        <section className="pb-12 sm:pb-14 w-full shrink-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-3 gap-4 sm:gap-5"
          >
            {problemKeys.map((key, i) => {
              const Icon = problemIcons[i]
              const tags = t(`landing.problems.${key}.tags`, {
                returnObjects: true,
              }) as string[]

              return (
                <motion.div
                  key={key}
                  variants={cardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group cursor-pointer"
                  onClick={() => navigate(problemRoutes[i])}
                >
                  <BorderGlow
                    className="flex flex-col p-3 sm:p-6 h-full"
                    backgroundColor="hsl(var(--card))"
                    borderRadius={16}
                    colors={['#a78bfa', '#818cf8', '#38bdf8']}
                    glowColor="250 80 70"
                    glowIntensity={1.2}
                    fillOpacity={0}
                  >

                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground/50 tabular-nums">
                        0{i + 1}
                      </span>
                    </div>

                    <h2 className="font-bold text-base mb-2 leading-snug">
                      {t(`landing.problems.${key}.title`)}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                      {t(`landing.problems.${key}.description`)}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-auto border border-white/10 text-foreground/70 hover:text-foreground hover:bg-white/10 transition-all duration-300"
                    >
                      {t('landing.viewSolution')}
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </BorderGlow>
                </motion.div>
              )
            })}
          </motion.div>
        </section>
      </div>
    </PageTransition>
  )
}
