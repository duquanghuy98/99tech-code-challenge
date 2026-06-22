import { useTranslation } from 'react-i18next'
import { ArrowLeftRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageTransition from '@/components/display/PageTransition'
import ProblemBadge from '@/components/common/ProblemBadge'
import { useMinLoadingTime } from '@/hooks/useDelayedValue'
import { useTokenPrices } from './hooks/useTokenPrices'
import ExchangePanel from './components/ExchangePanel'
import SwapFormSkeleton from './components/SwapFormSkeleton'

export default function Problem2Page() {
  const { t } = useTranslation()
  const { data: tokens, isLoading, isFetching, isError, refetch } = useTokenPrices()

  const isPricesFetching = isLoading || isFetching
  const showPricesSkeleton = useMinLoadingTime(isPricesFetching)

  return (
    <PageTransition>
      <div className="page-container-lg pb-8">
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
            </div>
            <ProblemBadge problem={2} />
          </div>
          <h1 className="text-3xl font-black mb-2">{t('problem2.title')}</h1>
        </div>

        {showPricesSkeleton && <SwapFormSkeleton />}

        {isError && !isPricesFetching && (
          <div className="flex flex-col items-center gap-4 py-10 sm:py-16 text-center">
            <p className="text-muted-foreground">{t('problem2.errorPrices')}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.retry')}
            </Button>
          </div>
        )}

        {!showPricesSkeleton && tokens && tokens.length > 0 && (
          <ExchangePanel tokens={tokens} />
        )}
      </div>
    </PageTransition>
  )
}
