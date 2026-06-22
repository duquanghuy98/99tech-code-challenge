import { useTranslation } from 'react-i18next'
import { Clock, ShieldCheck } from 'lucide-react'
import { formatTokenAmount, formatUsd } from '@/lib/formatNumbers'
import { type FiatMethodId, getFiatEta } from '../../lib/fiatUtils'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface FiatOrderSummaryProps {
  mode: 'buy' | 'sell'
  token: string
  tokenPrice: number
  hasAmount: boolean
  isLoading?: boolean
  serviceFee: number
  grossUsd: number
  netUsd: number
  cryptoAmount: number
  methodId: FiatMethodId
}

function SummaryValueSkeleton({ wide }: { wide?: boolean }) {
  return (
    <Skeleton
      className={cn('h-4 rounded shrink-0', wide ? 'w-28' : 'w-16')}
    />
  )
}

export default function FiatOrderSummary({
  mode,
  token,
  tokenPrice,
  hasAmount,
  isLoading = false,
  serviceFee,
  grossUsd,
  netUsd,
  cryptoAmount,
  methodId,
}: FiatOrderSummaryProps) {
  const { t } = useTranslation()

  const etaKey =
    getFiatEta(methodId) === 'instant'
      ? 'problem2.fiat.etaInstant'
      : 'problem2.fiat.etaBank'

  const showContent = hasAmount && !isLoading && netUsd > 0 && cryptoAmount > 0

  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <h3 className="text-sm font-semibold">{t('problem2.fiat.summaryTitle')}</h3>
      </div>

      <div className="p-3 space-y-2">
        {!hasAmount ? (
          <p className="text-xs text-muted-foreground text-center py-4 px-2">
            {t('problem2.fiat.summaryHint')}
          </p>
        ) : isLoading ? (
          <>
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-2 items-center">
                <span className="text-muted-foreground">{t('problem2.fiat.rate')}</span>
                <SummaryValueSkeleton wide />
              </div>
              <div className="flex justify-between gap-2 items-center">
                <span className="text-muted-foreground">
                  {t('problem2.fiat.serviceFee')}
                </span>
                <SummaryValueSkeleton />
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex justify-between gap-2 items-center font-semibold">
                <span>
                  {mode === 'buy'
                    ? t('problem2.fiat.youReceive')
                    : t('problem2.fiat.youGet')}
                </span>
                <SummaryValueSkeleton wide />
              </div>
              {mode === 'buy' && (
                <div className="flex justify-between gap-2 items-center text-xs">
                  <span className="text-muted-foreground">{t('problem2.fiat.youPay')}</span>
                  <SummaryValueSkeleton />
                </div>
              )}
              {mode === 'sell' && (
                <div className="flex justify-between gap-2 items-center text-xs">
                  <span className="text-muted-foreground">{t('problem2.fiat.grossUsd')}</span>
                  <SummaryValueSkeleton />
                </div>
              )}
            </div>

            <Skeleton className="h-10 w-full rounded-xl" />

            <div className="space-y-1.5 px-1">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-[85%] rounded" />
            </div>
          </>
        ) : showContent ? (
          <>
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-2 text-muted-foreground">
                <span>{t('problem2.fiat.rate')}</span>
                <span className="text-foreground tabular-nums text-right">
                  1 {token} = {formatUsd(tokenPrice)}
                </span>
              </div>
              <div className="flex justify-between gap-2 text-muted-foreground">
                <span>{t('problem2.fiat.serviceFee')}</span>
                <span className="text-foreground tabular-nums">{formatUsd(serviceFee)}</span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex justify-between gap-2 font-semibold">
                <span>
                  {mode === 'buy'
                    ? t('problem2.fiat.youReceive')
                    : t('problem2.fiat.youGet')}
                </span>
                <span className="tabular-nums text-emerald-600 dark:text-emerald-400 text-right">
                  {mode === 'buy'
                    ? `${formatTokenAmount(cryptoAmount)} ${token}`
                    : formatUsd(netUsd)}
                </span>
              </div>
              {mode === 'buy' && (
                <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                  <span>{t('problem2.fiat.youPay')}</span>
                  <span className="tabular-nums">{formatUsd(grossUsd)}</span>
                </div>
              )}
              {mode === 'sell' && (
                <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                  <span>{t('problem2.fiat.grossUsd')}</span>
                  <span className="tabular-nums">{formatUsd(grossUsd)}</span>
                </div>
              )}
            </div>

            <div
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs',
                'border-emerald-500/25 bg-emerald-500/5 text-muted-foreground',
              )}
            >
              <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>{t(etaKey)}</span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
              {t('problem2.fiat.disclaimer')}
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4 px-2">
            {t('problem2.fiat.summaryHint')}
          </p>
        )}
      </div>
    </div>
  )
}
