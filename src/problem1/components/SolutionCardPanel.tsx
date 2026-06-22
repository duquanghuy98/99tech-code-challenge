import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CodeSnippet from '@/components/display/CodeSnippet'
import { TruncatedInteger } from '@/components/display/TruncatedNumber'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { badgeColorMap, borderMap, type Solution } from '../constants/solutionCarousel.constants'
import AlgorithmDetailModal from './AlgorithmDetailModal'

interface SolutionCardPanelProps {
  impl: Solution
  n: number | null
  active?: boolean
  isResultPending?: boolean
  className?: string
}

export default function SolutionCardPanel({
  impl,
  n,
  active = true,
  isResultPending = false,
  className,
}: SolutionCardPanelProps) {
  const { t } = useTranslation()
  const [detailOpen, setDetailOpen] = useState(false)
  const result = n !== null ? impl.fn(n) : null

  return (
    <>
    <Card
      className={cn(
        'h-full flex flex-col border shadow-xl overflow-hidden bg-background',
        borderMap[impl.color],
        active && 'shadow-2xl ring-1 ring-border',
        className,
      )}
    >
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-base">
              {t(`problem1.implementations.${impl.key}.name`)}
            </CardTitle>
            <CardDescription className="mt-0.5">
              {t(`problem1.implementations.${impl.key}.description`)}
            </CardDescription>
          </div>
          <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColorMap[impl.color]}`}
            >
              {t('problem1.time')}: {impl.time}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColorMap[impl.color]}`}
            >
              {t('problem1.space')}: {impl.space}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-sm text-muted-foreground shrink-0">
              {t('problem1.result')}:
            </span>
            {isResultPending ? (
              <Skeleton className="h-8 w-24 shrink-0" />
            ) : active ? (
              <motion.span
                key={result}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-black max-w-full min-w-0"
              >
                {result !== null ? (
                  <TruncatedInteger value={result} className="block max-w-full" />
                ) : (
                  '-'
                )}
              </motion.span>
            ) : result !== null ? (
              <TruncatedInteger
                value={result}
                className="text-2xl font-black block max-w-full"
                wrapperClassName="max-w-full"
              />
            ) : (
              <span className="text-2xl font-black">-</span>
            )}
          </div>

          {active && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setDetailOpen(true)}
            >
              <Info className="h-4 w-4" />
              {t('problem1.moreInfo')}
            </Button>
          )}
        </div>

        <CodeSnippet code={impl.snippet} filename={`sum_to_n_${impl.key}(n)`} />
      </CardContent>
    </Card>

    <AlgorithmDetailModal
      impl={impl}
      n={n}
      open={detailOpen}
      onOpenChange={setDetailOpen}
    />
    </>
  )
}
