import { cn } from '@/lib/utils'

export const EXCHANGE_LEG_MIN_HEIGHT = 'min-h-[156px]'

export function ExchangeLegCard({
  variant = 'sell',
  className,
  children,
}: {
  variant?: 'sell' | 'buy'
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-xl p-4 flex flex-col',
        EXCHANGE_LEG_MIN_HEIGHT,
        variant === 'sell'
          ? 'bg-gradient-to-br from-muted/70 to-muted/30 border border-border/40'
          : 'bg-gradient-to-br from-emerald-500/12 to-emerald-600/5 border border-emerald-500/25',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ExchangeLegLabel({
  variant = 'sell',
  children,
}: {
  variant?: 'sell' | 'buy'
  children: React.ReactNode
}) {
  return (
    <p
      className={cn(
        'text-xs font-medium mb-3 shrink-0',
        variant === 'sell'
          ? 'text-muted-foreground'
          : 'text-emerald-600/80 dark:text-emerald-400/80',
      )}
    >
      {children}
    </p>
  )
}
