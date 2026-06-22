import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
// @ts-expect-error plain JS module, no declaration file needed
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './written-answer/index.js'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PageTransition from '@/components/display/PageTransition'
import ProblemBadge from '@/components/common/ProblemBadge'
import SolutionCarousel, { type Solution } from './components/SolutionCarousel'
import Problem1CarouselSkeleton from './Problem1CarouselSkeleton'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useDelayedValue, useInitialMinLoading } from '@/hooks/useDelayedValue'
import { Sigma } from 'lucide-react'

function sanitizeNumericInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 2)
}

const implementations: Solution[] = [
  {
    key: 'a',
    fn: sum_to_n_a,
    time: 'O(1)',
    space: 'O(1)',
    color: 'emerald',
    snippet:
`var sum_to_n_a = function (n) {
  // Gauss closed-form: sum(1..n) = n * (n + 1) / 2
  // Constant time - no loop or recursion needed
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
};`,
  },
  {
    key: 'b',
    fn: sum_to_n_b,
    time: 'O(n)',
    space: 'O(1)',
    color: 'blue',
    snippet:
`var sum_to_n_b = function (n) {
  // Accumulate the total with a single for-loop
  // Linear time, constant space - no call stack growth
  if (n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};`,
  },
  {
    key: 'c',
    fn: sum_to_n_c,
    time: 'O(n)',
    space: 'O(n)',
    color: 'violet',
    snippet:
`var sum_to_n_c = function (n) {
  // Recursive: sum(n) = n + sum(n - 1), base case n <= 0
  // Each call adds one frame to the call stack - O(n) space
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};`,
  },
]

export default function Problem1Page() {
  const { t } = useTranslation()
  const showCarouselSkeleton = useInitialMinLoading()
  const [input, setInput] = useState('10')
  const debouncedInput = useDebouncedValue(input, 300)

  const n = useMemo(() => {
    if (debouncedInput === '') return null
    const parsed = parseInt(debouncedInput, 10)
    return Number.isNaN(parsed) ? null : parsed
  }, [debouncedInput])

  const { value: displayedN, isPending: isCalculating } = useDelayedValue(n, {
    enabled: n !== null,
  })

  return (
    <PageTransition>
      <div className="page-container pb-8">
        {/* Header */}
        <div className="mb-4 sm:mb-5 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <Sigma className="h-5 w-5 text-primary" />
            </div>
            <ProblemBadge problem={1} />
          </div>
          <h1 className="text-3xl font-black mb-2">{t('problem1.title')}</h1>
          <p className="text-muted-foreground">{t('problem1.description')}</p>
        </div>

        {/* Input */}
        <div className="mb-4 sm:mb-5 max-w-3xl">
          <Label htmlFor="n-input" className="text-sm font-semibold mb-2 block">
            {t('problem1.inputLabel')}
          </Label>
          <Input
            id="n-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            placeholder={t('problem1.inputPlaceholder')}
            value={input}
            onChange={(e) => setInput(sanitizeNumericInput(e.target.value))}
            className="max-w-xs text-base tabular-nums"
            autoComplete="off"
          />
        </div>

        {/* Carousel */}
        {showCarouselSkeleton ? (
          <Problem1CarouselSkeleton />
        ) : n === null && input === '' ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground text-sm py-8 sm:py-12"
          >
            {t('problem1.emptyHint')}
          </motion.p>
        ) : (
          <div className="max-w-full max-md:overflow-x-hidden">
            <SolutionCarousel
              solutions={implementations}
              n={displayedN}
              targetN={n}
              isResultPending={isCalculating}
            />
          </div>
        )}
      </div>
    </PageTransition>
  )
}

