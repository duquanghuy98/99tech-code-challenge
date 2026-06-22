import { NumericFormat } from 'react-number-format'
import { MAX_DECIMAL_PLACES } from '@/lib/formatNumbers'
import { cn } from '@/lib/utils'

export const MAX_AMOUNT_INPUT_CHARS = 9

/** Width for tabular amount display - 9ch at input font size + padding. */
export const AMOUNT_FIELD_WIDTH_CLASS =
  'w-full sm:w-[calc(12ch+1.5rem)] sm:max-w-[calc(12ch+1.5rem)]'

export const AMOUNT_FIELD_LAYOUT_CLASS = cn(
  'sm:shrink-0 sm:ml-auto text-2xl sm:text-3xl tabular-nums',
  AMOUNT_FIELD_WIDTH_CLASS,
)

export function clampAmountInput(value: string): string {
  if (!value || value.length <= MAX_AMOUNT_INPUT_CHARS) return value
  return value.slice(0, MAX_AMOUNT_INPUT_CHARS)
}

interface SwapAmountInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export default function SwapAmountInput({
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  className,
  placeholder = '0.00',
}: SwapAmountInputProps) {
  return (
    <NumericFormat
      value={value}
      valueIsNumericString
      onValueChange={(values) => onChange(values.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      placeholder={placeholder}
      allowNegative={false}
      decimalScale={MAX_DECIMAL_PLACES}
      thousandSeparator={false}
      isAllowed={({ value: raw }) =>
        raw === '' || raw.length <= MAX_AMOUNT_INPUT_CHARS
      }
      className={cn(className)}
    />
  )
}
