import BigNumber from 'bignumber.js'

/** Max fractional digits shown for decimal numbers (rounded up). */
export const MAX_DECIMAL_PLACES = 3

/** Max characters shown before ellipsis + hover popup (fallback after compact). */
export const DISPLAY_CHAR_LIMIT = {
  token: 14,
  usd: 14,
  integer: 16,
} as const

/** Compact notation (M / B / T) starts at this absolute value. */
const COMPACT_MIN = new BigNumber('1e7') // 10M

const COMPACT_UNITS: { divisor: BigNumber; suffix: string }[] = [
  { divisor: new BigNumber('1e12'), suffix: 'T' },
  { divisor: new BigNumber('1e9'), suffix: 'B' },
  { divisor: new BigNumber('1e6'), suffix: 'M' },
]

export interface DisplayParts {
  display: string
  full: string
  truncated: boolean
}

function toBigNumber(value: number | string): BigNumber | null {
  if (value === '' || value === null || value === undefined) return null
  const bn = new BigNumber(value)
  return bn.isFinite() ? bn : null
}

export function ceilToDecimals(
  value: number | string,
  decimals = MAX_DECIMAL_PLACES,
): number {
  const bn = toBigNumber(value)
  if (!bn) return Number(value)
  return bn.decimalPlaces(decimals, BigNumber.ROUND_CEIL).toNumber()
}

export function ceilBigNumber(
  value: number | string,
  decimals = MAX_DECIMAL_PLACES,
): BigNumber | null {
  const bn = toBigNumber(value)
  if (!bn) return null
  return bn.decimalPlaces(decimals, BigNumber.ROUND_CEIL)
}

/** Plain string for inputs/state - no locale separators. */
export function ceilToDecimalString(
  value: number | string,
  decimals = MAX_DECIMAL_PLACES,
): string {
  const ceiled = ceilBigNumber(value, decimals)
  if (!ceiled) return '0'
  const fixed = ceiled.toFixed(decimals)
  return fixed.replace(/\.?0+$/, '') || '0'
}

function formatCeiledBigNumber(
  value: number | string | BigNumber,
  decimals = MAX_DECIMAL_PLACES,
): string {
  const ceiled =
    value instanceof BigNumber
      ? value.decimalPlaces(decimals, BigNumber.ROUND_CEIL)
      : ceilBigNumber(value, decimals)
  if (!ceiled) return '-'

  const trimmed = ceiled.toFixed(decimals).replace(/\.?0+$/, '') || '0'
  const [intPart, decPart] = trimmed.split('.')
  const groupedInt = new BigNumber(intPart).toFormat(0)
  return decPart ? `${groupedInt}.${decPart}` : groupedInt
}

function trimDecimals(bn: BigNumber, decimals = MAX_DECIMAL_PLACES): string {
  return bn.toFixed(decimals).replace(/\.?0+$/, '') || '0'
}

function toCompactDisplay(
  ceiled: BigNumber,
  prefix = '',
  maxChars?: number,
): DisplayParts {
  const full = `${prefix}${formatCeiledBigNumber(ceiled)}`
  const abs = ceiled.abs()

  let parts: DisplayParts

  if (abs.lt(COMPACT_MIN)) {
    parts = { display: full, full, truncated: false }
  } else {
    const unit = COMPACT_UNITS.find((u) => abs.gte(u.divisor))
    if (!unit) {
      parts = { display: full, full, truncated: false }
    } else {
      const scaled = ceiled
        .div(unit.divisor)
        .decimalPlaces(MAX_DECIMAL_PLACES, BigNumber.ROUND_CEIL)
      parts = {
        display: `${prefix}${trimDecimals(scaled)}${unit.suffix}`,
        full,
        truncated: true,
      }
    }
  }

  if (maxChars && parts.display.length > maxChars) {
    return {
      display: `${parts.display.slice(0, maxChars - 1)}...`,
      full: parts.full,
      truncated: true,
    }
  }

  return parts
}

export function limitDisplayChars(
  text: string,
  maxChars: number,
): DisplayParts {
  if (text.length <= maxChars) {
    return { display: text, full: text, truncated: false }
  }
  return {
    display: `${text.slice(0, maxChars - 1)}...`,
    full: text,
    truncated: true,
  }
}

export function formatTokenDisplay(
  value: number | string,
  maxChars?: number,
): DisplayParts {
  const bn = toBigNumber(value)
  if (!bn) return { display: '-', full: '-', truncated: false }
  const ceiled = bn.decimalPlaces(MAX_DECIMAL_PLACES, BigNumber.ROUND_CEIL)
  return toCompactDisplay(ceiled, '', maxChars)
}

export function formatUsdDisplay(
  value: number | string,
  maxChars?: number,
): DisplayParts {
  const bn = toBigNumber(value)
  if (!bn) return { display: '-', full: '-', truncated: false }
  const ceiled = bn.decimalPlaces(MAX_DECIMAL_PLACES, BigNumber.ROUND_CEIL)
  return toCompactDisplay(ceiled, '$', maxChars)
}

export function formatIntegerDisplay(
  value: number | string,
  maxChars?: number,
): DisplayParts {
  const bn = toBigNumber(value)
  if (!bn) return { display: '-', full: '-', truncated: false }

  if (bn.isInteger()) {
    const full = bn.toFormat(0)
    const parts = toCompactDisplay(
      bn.decimalPlaces(0, BigNumber.ROUND_CEIL),
      '',
      maxChars,
    )
    if (parts.truncated) {
      return { display: parts.display, full, truncated: true }
    }
    return limitDisplayChars(full, maxChars ?? full.length)
  }

  const ceiled = bn.decimalPlaces(MAX_DECIMAL_PLACES, BigNumber.ROUND_CEIL)
  return toCompactDisplay(ceiled, '', maxChars)
}

export function formatInteger(value: number | string): string {
  const bn = toBigNumber(value)
  if (!bn) return '-'
  if (bn.isInteger()) {
    return bn.toFormat(0)
  }
  return formatCeiledBigNumber(bn)
}
