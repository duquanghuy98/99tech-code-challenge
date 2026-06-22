import BigNumber from 'bignumber.js'
import { ceilBigNumber } from '@/lib/formatNumbers'

export type FiatMethodId = 'card' | 'bank'

export const MIN_FIAT_BUY_USD = 10

export interface FiatMethod {
  id: FiatMethodId
  feePercent: number
  flatFee: number
}

export const FIAT_PAYMENT_METHODS: FiatMethod[] = [
  { id: 'card', feePercent: 1.5, flatFee: 0.99 },
  { id: 'bank', feePercent: 0.5, flatFee: 0 },
]

export function getFiatMethod(id: FiatMethodId): FiatMethod {
  return FIAT_PAYMENT_METHODS.find((m) => m.id === id) ?? FIAT_PAYMENT_METHODS[0]
}

export function calcFiatServiceFee(
  usdAmount: number | string,
  methodId: FiatMethodId,
): number {
  const bn = ceilBigNumber(usdAmount)
  if (!bn || bn.lte(0)) return 0

  const method = getFiatMethod(methodId)
  const percentFee = bn.times(method.feePercent).div(100)
  const total = percentFee.plus(method.flatFee)
  return total.decimalPlaces(3, BigNumber.ROUND_CEIL).toNumber()
}

/** Net USD used for crypto purchase after service fee (buy). */
export function calcNetUsdForBuy(
  usdAmount: number | string,
  methodId: FiatMethodId,
): number {
  const bn = ceilBigNumber(usdAmount)
  if (!bn || bn.lte(0)) return 0

  const fee = new BigNumber(calcFiatServiceFee(usdAmount, methodId))
  const net = bn.minus(fee)
  return net.gt(0) ? net.decimalPlaces(3, BigNumber.ROUND_CEIL).toNumber() : 0
}

/** Net USD received after service fee (sell). */
export function calcNetUsdForSell(
  grossUsd: number | string,
  methodId: FiatMethodId,
): number {
  const bn = ceilBigNumber(grossUsd)
  if (!bn || bn.lte(0)) return 0

  const fee = new BigNumber(calcFiatServiceFee(grossUsd, methodId))
  const net = bn.minus(fee)
  return net.gt(0) ? net.decimalPlaces(3, BigNumber.ROUND_CEIL).toNumber() : 0
}

export function getFiatEta(methodId: FiatMethodId): string {
  return methodId === 'card' ? 'instant' : '1-3days'
}
