import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowDownUp } from 'lucide-react'
import { toast } from 'sonner'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useDelayedValue } from '@/hooks/useDelayedValue'
import {
  formatTokenAmount,
  formatUsd,
} from '@/lib/formatNumbers'
import { cn } from '@/lib/utils'
import { TruncatedTokenAmount, TruncatedUsd } from '@/components/display/TruncatedNumber'
import { Skeleton } from '@/components/ui/skeleton'
import { type Token } from '../../hooks/useTokenPrices'
import { useAmountValidation } from '../../hooks/useAmountValidation'
import { useFiatOrderCalculations } from '../../hooks/useFiatOrderCalculations'
import TokenSelector from '../TokenSelector'
import AmountInputField from '../AmountInputField'
import ExchangeSubmitButton from '../ExchangeSubmitButton'
import { clampAmountInput, AMOUNT_FIELD_LAYOUT_CLASS } from '../SwapAmountInput'
import { QuoteAmountSkeleton } from '../QuoteAmountSkeleton'
import { ExchangeLegCard, ExchangeLegLabel } from '../ExchangeLegCard'
import {
  MIN_FIAT_BUY_USD,
  type FiatMethodId,
} from '../../lib/fiatUtils'
import { getNetworkLabel } from '../../lib/swapUtils'
import FiatUsdBadge from './FiatUsdBadge'
import FiatMethodSelector from './FiatMethodSelector'
import FiatOrderSummary from './FiatOrderSummary'

interface FiatExchangeFormProps {
  tokens: Token[]
  selectedToken: string
  onSelectedTokenChange: (currency: string) => void
}

export default function FiatExchangeForm({
  tokens,
  selectedToken,
  onSelectedTokenChange,
}: FiatExchangeFormProps) {
  const { t } = useTranslation()

  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const token = selectedToken
  const [amount, setAmount] = useState('')
  const debouncedAmount = useDebouncedValue(amount, 300)
  const [methodId, setMethodId] = useState<FiatMethodId>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [touched, setTouched] = useState(false)

  const tokenPrice = tokens.find((item) => item.currency === token)?.price ?? 0
  const debouncedNum = parseFloat(debouncedAmount)
  const isDebouncing = amount !== debouncedAmount

  const minBuyCheck = (num: number) =>
    mode === 'buy' && num < MIN_FIAT_BUY_USD ? t('problem2.fiat.minBuy') : ''

  const { amountNum, error, submitBlockedReason, canSubmit } = useAmountValidation({
    amount,
    touched,
    extraError: minBuyCheck,
    extraSubmitCheck: minBuyCheck,
  })

  const {
    hasValidAmount,
    grossUsd,
    serviceFee,
    netUsd,
    cryptoAmount,
    orderSummary,
  } = useFiatOrderCalculations({ mode, debouncedNum, tokenPrice, methodId })

  const { value: displayedOrder, isPending: isQuotePending } = useDelayedValue(orderSummary, {
    enabled: hasValidAmount,
  })
  const isQuoteLoading = isDebouncing || isQuotePending
  const displayedReceive = displayedOrder.receiveAmount

  function handleFlipMode() {
    if (mode === 'buy') {
      setMode('sell')
      setAmount(cryptoAmount > 0 ? clampAmountInput(String(cryptoAmount)) : '')
    } else {
      setMode('buy')
      setAmount(netUsd > 0 ? clampAmountInput(String(netUsd)) : '')
    }
    setTouched(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)

    if (!canSubmit) return

    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsProcessing(false)

    if (mode === 'buy') {
      toast.success(t('problem2.fiat.successBuy'), {
        description: t('problem2.fiat.successBuyDetail', {
          usd: formatUsd(amountNum),
          amount: formatTokenAmount(cryptoAmount),
          token,
        }),
      })
    } else {
      toast.success(t('problem2.fiat.successSell'), {
        description: t('problem2.fiat.successSellDetail', {
          amount: formatTokenAmount(amountNum),
          token,
          usd: formatUsd(netUsd),
        }),
      })
    }

    setAmount('')
    setTouched(false)
  }

  const topLabel = mode === 'buy' ? t('problem2.fiat.youPay') : t('problem2.youSell')
  const bottomLabel = mode === 'buy' ? t('problem2.fiat.youReceive') : t('problem2.fiat.youGet')

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="grid grid-rows-[1fr_auto_1fr] gap-3 items-stretch">
          <ExchangeLegCard variant="sell" className="h-full">
            <ExchangeLegLabel variant="sell">{topLabel}</ExchangeLegLabel>
            <div className="flex flex-col gap-2 flex-1 sm:flex-row sm:items-start sm:gap-3">
              {mode === 'buy' ? (
                <FiatUsdBadge className="bg-background/40" />
              ) : (
                <TokenSelector
                  tokens={tokens}
                  value={token}
                  onChange={(v) => {
                    onSelectedTokenChange(v)
                    setTouched(false)
                  }}
                  placeholder={t('problem2.selectToken')}
                  searchPlaceholder={t('problem2.searchToken')}
                  noResults={t('problem2.noTokens')}
                  disabled={isProcessing}
                  className="w-full sm:w-auto sm:shrink-0"
                  triggerClassName="w-full sm:min-w-[120px] sm:w-auto border-0 bg-background/40"
                />
              )}
              <AmountInputField
                value={amount}
                onChange={(v) => {
                  setAmount(v)
                  setTouched(false)
                }}
                onBlur={() => setTouched(true)}
                disabled={isProcessing}
                error={error}
              />
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 text-xs text-muted-foreground shrink-0">
              {mode === 'buy' ? (
                <span>{t('problem2.fiat.minBuyHint')}</span>
              ) : (
                <span>{getNetworkLabel(token, t)}</span>
              )}
              {mode === 'sell' &&
                (hasValidAmount && isQuoteLoading ? (
                  <Skeleton className="h-4 w-20 rounded shrink-0 max-w-[45%] ml-auto" />
                ) : (
                  <TruncatedUsd
                    value={grossUsd}
                    className="text-right"
                    wrapperClassName="max-w-[45%]"
                  />
                ))}
            </div>
          </ExchangeLegCard>

          <div className="flex justify-center relative z-10 -my-1">
            <motion.button
              type="button"
              onClick={handleFlipMode}
              disabled={isProcessing}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={cn(
                'w-10 h-10 rounded-full border border-border bg-background shadow-md',
                'flex items-center justify-center text-muted-foreground',
                'hover:text-foreground hover:border-emerald-500/40 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              <ArrowDownUp className="h-4 w-4" />
            </motion.button>
          </div>

          <ExchangeLegCard variant="buy" className="h-full">
            <ExchangeLegLabel variant="buy">{bottomLabel}</ExchangeLegLabel>
            <div className="flex flex-col gap-2 flex-1 sm:flex-row sm:items-start sm:gap-3">
              {mode === 'buy' ? (
                <TokenSelector
                  tokens={tokens}
                  value={token}
                  onChange={(v) => {
                    onSelectedTokenChange(v)
                    setTouched(false)
                  }}
                  placeholder={t('problem2.selectToken')}
                  searchPlaceholder={t('problem2.searchToken')}
                  noResults={t('problem2.noTokens')}
                  disabled={isProcessing}
                  className="w-full sm:w-auto sm:shrink-0"
                  triggerClassName="w-full sm:min-w-[120px] sm:w-auto border-0 bg-background/30"
                />
              ) : (
                <FiatUsdBadge className="bg-background/30" />
              )}
              <div className={cn(AMOUNT_FIELD_LAYOUT_CLASS, 'text-right py-1 self-start')}>
                {isQuoteLoading ? (
                  <QuoteAmountSkeleton />
                ) : mode === 'buy' ? (
                  displayedReceive > 0 ? (
                    <TruncatedTokenAmount
                      value={displayedReceive}
                      className="text-2xl sm:text-3xl font-semibold text-right block w-full"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-semibold text-right text-muted-foreground/30 block w-full">
                      0.00
                    </span>
                  )
                ) : displayedReceive > 0 ? (
                  <TruncatedUsd
                    value={displayedReceive}
                    className="text-2xl sm:text-3xl font-semibold text-right block w-full"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-semibold text-right text-muted-foreground/30 block w-full">
                    $0.00
                  </span>
                )}
              </div>
            </div>
            <div className="mt-auto pt-2 text-xs text-muted-foreground shrink-0">
              {mode === 'buy' ? (
                getNetworkLabel(token, t)
              ) : (
                serviceFee > 0 &&
                netUsd > 0 && (
                  <span className="block text-right">
                    {t('problem2.fiat.feeDeducted', { fee: formatUsd(serviceFee) })}
                  </span>
                )
              )}
            </div>
          </ExchangeLegCard>
        </div>

        <FiatMethodSelector
          mode={mode}
          methodId={methodId}
          onMethodChange={setMethodId}
        />

        <FiatOrderSummary
          mode={mode}
          token={token}
          tokenPrice={tokenPrice}
          hasAmount={hasValidAmount}
          isLoading={isQuoteLoading}
          serviceFee={displayedOrder.serviceFee}
          grossUsd={displayedOrder.grossUsd}
          netUsd={displayedOrder.netUsd}
          cryptoAmount={displayedOrder.cryptoAmount}
          methodId={methodId}
        />

        <ExchangeSubmitButton
          canSubmit={canSubmit}
          isLoading={isProcessing}
          blockedReason={submitBlockedReason}
          loadingLabel={t('problem2.fiat.processing')}
          idleLabel={t('problem2.exchange')}
        />
      </div>
    </form>
  )
}
