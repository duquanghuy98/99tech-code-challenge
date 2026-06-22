import { cn } from '@/lib/utils'
import {
  DISPLAY_CHAR_LIMIT,
  formatIntegerDisplay,
  formatTokenDisplay,
  formatUsdDisplay,
} from '@/lib/formatNumbers'

interface TruncatedNumberProps {
  display: string
  full: string
  truncated: boolean
  className?: string
  wrapperClassName?: string
}

function TruncatedNumberCore({
  display,
  full,
  truncated,
  className,
  wrapperClassName,
}: TruncatedNumberProps) {
  if (!truncated) {
    return (
      <span
        className={cn(
          'tabular-nums min-w-0 max-w-full truncate',
          className,
          wrapperClassName,
        )}
      >
        {display}
      </span>
    )
  }

  return (
    <span
      tabIndex={0}
      className={cn(
        'relative min-w-0 max-w-full group/trunc',
        'cursor-default rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
        wrapperClassName,
      )}
    >
      <span className="truncate tabular-nums">{display}</span>
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full right-0 z-50 mb-1.5',
          'rounded-lg border border-border bg-popover px-2.5 py-1.5',
          'text-xs font-medium text-popover-foreground tabular-nums shadow-lg',
          'whitespace-nowrap opacity-0 invisible',
          'transition-opacity duration-150',
          'group-hover/trunc:opacity-100 group-hover/trunc:visible',
          'group-focus-within/trunc:opacity-100 group-focus-within/trunc:visible',
        )}
      >
        {full}
      </span>
    </span>
  )
}

export function TruncatedTokenAmount({
  value,
  className,
  wrapperClassName,
  maxChars = DISPLAY_CHAR_LIMIT.token,
}: {
  value: number
  className?: string
  wrapperClassName?: string
  maxChars?: number
}) {
  if (!Number.isFinite(value)) {
    return <span className={className}>-</span>
  }

  const { display, full, truncated } = formatTokenDisplay(value, maxChars)

  return (
    <TruncatedNumberCore
      display={display}
      full={full}
      truncated={truncated}
      className={className}
      wrapperClassName={wrapperClassName}
    />
  )
}

export function TruncatedUsd({
  value,
  className,
  wrapperClassName,
  maxChars = DISPLAY_CHAR_LIMIT.usd,
}: {
  value: number
  className?: string
  wrapperClassName?: string
  maxChars?: number
}) {
  if (!Number.isFinite(value) || value <= 0) {
    return <span className={className}>-</span>
  }

  const { display, full, truncated } = formatUsdDisplay(value, maxChars)

  return (
    <TruncatedNumberCore
      display={display}
      full={full}
      truncated={truncated}
      className={className}
      wrapperClassName={wrapperClassName}
    />
  )
}

export function TruncatedInteger({
  value,
  className,
  wrapperClassName,
  maxChars = DISPLAY_CHAR_LIMIT.integer,
}: {
  value: number
  className?: string
  wrapperClassName?: string
  maxChars?: number
}) {
  if (!Number.isFinite(value)) {
    return <span className={className}>-</span>
  }

  const { display, full, truncated } = formatIntegerDisplay(value, maxChars)

  return (
    <TruncatedNumberCore
      display={display}
      full={full}
      truncated={truncated}
      className={className}
      wrapperClassName={wrapperClassName}
    />
  )
}
