import BigNumber from 'bignumber.js'
import { MAX_DECIMAL_PLACES } from './formatDisplay'

function toBigNumber(value: number | string): BigNumber | null {
  if (value === '' || value === null || value === undefined) return null
  const bn = new BigNumber(value)
  return bn.isFinite() ? bn : null
}

function formatCeiledBigNumber(
  value: number | string | BigNumber,
  decimals = MAX_DECIMAL_PLACES,
): string {
  const ceiled =
    value instanceof BigNumber
      ? value.decimalPlaces(decimals, BigNumber.ROUND_CEIL)
      : (() => {
          const bn = toBigNumber(value)
          return bn ? bn.decimalPlaces(decimals, BigNumber.ROUND_CEIL) : null
        })()
  if (!ceiled) return '-'

  const trimmed = ceiled.toFixed(decimals).replace(/\.?0+$/, '') || '0'
  const [intPart, decPart] = trimmed.split('.')
  const groupedInt = new BigNumber(intPart).toFormat(0)
  return decPart ? `${groupedInt}.${decPart}` : groupedInt
}

/** Full formatted string (no compact notation). */
export function formatTokenAmount(value: number | string): string {
  const bn = toBigNumber(value)
  if (!bn) return '-'
  return formatCeiledBigNumber(bn)
}

export function formatUsd(value: number | string): string {
  const bn = toBigNumber(value)
  if (!bn) return '-'
  return `$${formatCeiledBigNumber(bn)}`
}

/** Swap output: (amount * fromPrice) / toPrice, ceiled to max decimals. */
export function calcSwapOutput(
  amount: number | string,
  fromPrice: number | string,
  toPrice: number | string,
): string {
  const amountBn = toBigNumber(amount)
  const fromBn = toBigNumber(fromPrice)
  const toBn = toBigNumber(toPrice)
  if (!amountBn || !fromBn || !toBn || toBn.isZero()) return ''

  const result = amountBn
    .times(fromBn)
    .div(toBn)
    .decimalPlaces(MAX_DECIMAL_PLACES, BigNumber.ROUND_CEIL)

  return result.toFixed(MAX_DECIMAL_PLACES).replace(/\.?0+$/, '') || '0'
}

/** USD -> crypto at token price (ceiled). */
export function calcFiatToCrypto(
  usd: number | string,
  tokenPrice: number | string,
): string {
  const usdBn = toBigNumber(usd)
  const priceBn = toBigNumber(tokenPrice)
  if (!usdBn || !priceBn || priceBn.isZero()) return ''

  const result = usdBn
    .div(priceBn)
    .decimalPlaces(MAX_DECIMAL_PLACES, BigNumber.ROUND_CEIL)

  return result.toFixed(MAX_DECIMAL_PLACES).replace(/\.?0+$/, '') || '0'
}

/** Crypto -> USD at token price (ceiled). */
export function calcCryptoToFiat(
  crypto: number | string,
  tokenPrice: number | string,
): string {
  const cryptoBn = toBigNumber(crypto)
  const priceBn = toBigNumber(tokenPrice)
  if (!cryptoBn || !priceBn) return ''

  const result = cryptoBn
    .times(priceBn)
    .decimalPlaces(MAX_DECIMAL_PLACES, BigNumber.ROUND_CEIL)

  return result.toFixed(MAX_DECIMAL_PLACES).replace(/\.?0+$/, '') || '0'
}
