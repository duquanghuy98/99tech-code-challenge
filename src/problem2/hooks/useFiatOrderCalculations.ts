import { useMemo } from 'react'
import {
  calcCryptoToFiat,
  calcFiatToCrypto,
} from '@/lib/formatNumbers'
import {
  calcFiatServiceFee,
  calcNetUsdForBuy,
  calcNetUsdForSell,
  MIN_FIAT_BUY_USD,
  type FiatMethodId,
} from '../lib/fiatUtils'

interface UseFiatOrderCalculationsOptions {
  mode: 'buy' | 'sell'
  debouncedNum: number
  tokenPrice: number
  methodId: FiatMethodId
}

export function useFiatOrderCalculations({
  mode,
  debouncedNum,
  tokenPrice,
  methodId,
}: UseFiatOrderCalculationsOptions) {
  const hasValidAmount =
    !isNaN(debouncedNum) &&
    debouncedNum > 0 &&
    (mode !== 'buy' || debouncedNum >= MIN_FIAT_BUY_USD)

  const grossUsd = useMemo(() => {
    if (!hasValidAmount || !tokenPrice) return 0
    if (mode === 'buy') return debouncedNum
    return parseFloat(calcCryptoToFiat(debouncedNum, tokenPrice)) || 0
  }, [mode, debouncedNum, tokenPrice, hasValidAmount])

  const serviceFee = useMemo(
    () => (grossUsd > 0 ? calcFiatServiceFee(grossUsd, methodId) : 0),
    [grossUsd, methodId],
  )

  const netUsd = useMemo(() => {
    if (!hasValidAmount || grossUsd <= 0) return 0
    if (mode === 'buy') return calcNetUsdForBuy(grossUsd, methodId)
    return calcNetUsdForSell(grossUsd, methodId)
  }, [mode, grossUsd, methodId, hasValidAmount])

  const cryptoAmount = useMemo(() => {
    if (!hasValidAmount || !tokenPrice) return 0
    if (mode === 'buy') {
      return parseFloat(calcFiatToCrypto(netUsd, tokenPrice)) || 0
    }
    return debouncedNum
  }, [mode, netUsd, tokenPrice, debouncedNum, hasValidAmount])

  const orderSummary = useMemo(
    () => ({
      grossUsd,
      serviceFee,
      netUsd,
      cryptoAmount,
      receiveAmount: mode === 'buy' ? cryptoAmount : netUsd,
    }),
    [grossUsd, serviceFee, netUsd, cryptoAmount, mode],
  )

  return { hasValidAmount, grossUsd, serviceFee, netUsd, cryptoAmount, orderSummary }
}
