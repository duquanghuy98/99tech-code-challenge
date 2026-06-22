import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownUp } from 'lucide-react'
import { toast } from 'sonner'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useDelayedValue } from '@/hooks/useDelayedValue'
import { calcSwapOutput, formatTokenAmount } from '@/lib/formatNumbers'
import { type Token } from '../hooks/useTokenPrices'
import { useAmountValidation } from '../hooks/useAmountValidation'
import TokenSelector, { TokenIcon } from './TokenSelector'
import AmountInputField from './AmountInputField'
import ExchangeSubmitButton from './ExchangeSubmitButton'
import { QuoteAmountSkeleton } from './QuoteAmountSkeleton'
import { clampAmountInput, AMOUNT_FIELD_LAYOUT_CLASS } from './SwapAmountInput'
import { ExchangeLegCard, ExchangeLegLabel } from './ExchangeLegCard'
import { getNetworkLabel } from '../lib/swapUtils'
import { cn } from '@/lib/utils'
import { TruncatedTokenAmount, TruncatedUsd } from '@/components/display/TruncatedNumber'
import { Skeleton } from '@/components/ui/skeleton'

interface SwapFormProps {
  tokens: Token[]
  selectedToken: string
  onSelectedTokenChange: (currency: string) => void
}

function getPrice(tokens: Token[], currency: string): number | undefined {
  return tokens.find((t) => t.currency === currency)?.price
}

export default function SwapForm({
  tokens,
  selectedToken,
  onSelectedTokenChange,
}: SwapFormProps) {
  const { t } = useTranslation()

  const [fromToken, setFromToken] = useState(tokens[0]?.currency ?? '')
  const [fromAmount, setFromAmount] = useState('')
  const debouncedFromAmount = useDebouncedValue(fromAmount, 300)
  const [isSwapping, setIsSwapping] = useState(false)
  const [touched, setTouched] = useState(false)

  const toToken = selectedToken
  const fromPrice = getPrice(tokens, fromToken)
  const toPrice = getPrice(tokens, toToken)

  const debouncedFromNum = parseFloat(debouncedFromAmount)
  const hasValidAmount = !isNaN(debouncedFromNum) && debouncedFromNum > 0
  const isDebouncing = fromAmount !== debouncedFromAmount

  const pairError = useMemo(() => {
    if (!touched) return ''
    if (fromToken === toToken) return t('problem2.errors.sameToken')
    return ''
  }, [touched, fromToken, toToken, t])

  const { amountNum: fromNum, error: amountError, submitBlockedReason, canSubmit } =
    useAmountValidation({
      amount: fromAmount,
      touched,
      extraSubmitCheck: () =>
        fromToken === toToken ? t('problem2.errors.sameToken') : '',
    })

  const inputError = amountError || pairError

  const toAmount = useMemo(() => {
    if (!hasValidAmount || !fromPrice || !toPrice) return ''
    return calcSwapOutput(debouncedFromNum, fromPrice, toPrice)
  }, [debouncedFromNum, fromPrice, toPrice, hasValidAmount])

  const { value: displayedToAmount, isPending: isQuotePending } = useDelayedValue(toAmount, {
    enabled: hasValidAmount && fromToken !== toToken,
  })
  const isQuoteLoading = isDebouncing || isQuotePending

  const displayedToNum = displayedToAmount ? parseFloat(displayedToAmount) : 0

  const exchangeRate = useMemo(() => {
    if (!fromPrice || !toPrice || !fromToken || !toToken) return null
    return fromPrice / toPrice
  }, [fromPrice, toPrice, fromToken, toToken])

  const fromUsd = hasValidAmount && fromPrice ? debouncedFromNum * fromPrice : 0
  const toUsd =
    !isQuoteLoading && displayedToNum && toPrice ? displayedToNum * toPrice : 0
  const priceImpact = hasValidAmount ? -0.28 : 0

  function handleSwapTokens() {
    const prevFrom = fromToken
    setFromToken(toToken)
    onSelectedTokenChange(prevFrom)
    setFromAmount(clampAmountInput(toAmount))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)

    if (!canSubmit || fromToken === toToken) return

    setIsSwapping(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSwapping(false)

    toast.success(t('problem2.success'), {
      description: t('problem2.successDetail', {
        from: `${formatTokenAmount(fromNum)} ${fromToken}`,
        to: `${formatTokenAmount(parseFloat(toAmount))} ${toToken}`,
      }),
    })

    setFromAmount('')
    setTouched(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="grid grid-rows-[1fr_auto_1fr] gap-3 items-stretch">
          <ExchangeLegCard variant="sell" className="h-full">
            <ExchangeLegLabel variant="sell">{t('problem2.youSell')}</ExchangeLegLabel>
            <div className="flex flex-col gap-2 flex-1 sm:flex-row sm:items-start sm:gap-3">
              <TokenSelector
                tokens={tokens}
                value={fromToken}
                onChange={(v) => {
                  setFromToken(v)
                  setTouched(false)
                }}
                placeholder={t('problem2.selectToken')}
                searchPlaceholder={t('problem2.searchToken')}
                noResults={t('problem2.noTokens')}
                disabled={isSwapping}
                className="w-full sm:w-auto sm:shrink-0"
                triggerClassName="w-full sm:min-w-[120px] sm:w-auto border-0 bg-background/40"
              />
              <AmountInputField
                value={fromAmount}
                onChange={(value) => {
                  setFromAmount(value)
                  setTouched(false)
                }}
                onBlur={() => setTouched(true)}
                disabled={isSwapping}
                error={inputError}
              />
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 text-xs text-muted-foreground shrink-0">
              <span>{getNetworkLabel(fromToken, t)}</span>
              {hasValidAmount && isQuoteLoading ? (
                <Skeleton className="h-4 w-20 rounded shrink-0 max-w-[45%] ml-auto" />
              ) : (
                <TruncatedUsd
                  value={fromUsd}
                  className="text-right"
                  wrapperClassName="max-w-[45%]"
                />
              )}
            </div>
          </ExchangeLegCard>

          <div className="flex justify-center relative z-10 -my-1">
            <motion.button
              type="button"
              onClick={handleSwapTokens}
              disabled={isSwapping}
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
            <ExchangeLegLabel variant="buy">{t('problem2.youBuy')}</ExchangeLegLabel>
            <div className="flex flex-col gap-2 flex-1 sm:flex-row sm:items-start sm:gap-3">
              <TokenSelector
                tokens={tokens}
                value={toToken}
                onChange={(v) => {
                  onSelectedTokenChange(v)
                  setTouched(false)
                }}
                placeholder={t('problem2.selectToken')}
                searchPlaceholder={t('problem2.searchToken')}
                noResults={t('problem2.noTokens')}
                disabled={isSwapping}
                className="w-full sm:w-auto sm:shrink-0"
                triggerClassName="w-full sm:min-w-[120px] sm:w-auto border-0 bg-background/30"
              />
              <div className={cn(AMOUNT_FIELD_LAYOUT_CLASS, 'text-right py-1 self-start')}>
                {isQuoteLoading ? (
                  <QuoteAmountSkeleton />
                ) : displayedToNum > 0 ? (
                  <TruncatedTokenAmount
                    value={displayedToNum}
                    className="text-2xl sm:text-3xl font-semibold text-right block w-full text-foreground"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-semibold text-right text-muted-foreground/30 block w-full truncate">
                    0.00
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 text-xs shrink-0">
              {isQuoteLoading ? (
                <Skeleton className="h-4 w-20 rounded shrink-0 max-w-[55%] ml-auto" />
              ) : (
                <TruncatedUsd
                  value={toUsd}
                  className="text-right"
                  wrapperClassName="max-w-[55%]"
                />
              )}
              {hasValidAmount && !isQuoteLoading && (
                <span className="text-red-400 font-medium tabular-nums">
                  {formatTokenAmount(priceImpact)}%
                </span>
              )}
            </div>
          </ExchangeLegCard>
        </div>

        <AnimatePresence>
          {exchangeRate !== null && fromToken !== toToken && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-2.5 rounded-xl bg-muted/30 border border-border/40 text-xs"
            >
              <span className="flex items-center gap-1.5 text-muted-foreground min-w-0 truncate">
                <TokenIcon currency={fromToken} size={14} />
                <span className="truncate">
                  1 {fromToken} ={' '}
                  <TruncatedTokenAmount value={exchangeRate} className="inline" />
                  {' '}
                  {toToken}
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <ExchangeSubmitButton
          canSubmit={canSubmit && fromToken !== toToken}
          isLoading={isSwapping}
          blockedReason={submitBlockedReason || (fromToken === toToken ? t('problem2.errors.sameToken') : '')}
          loadingLabel={t('problem2.swapping')}
          idleLabel={t('problem2.exchange')}
        />
      </div>
    </form>
  )
}
