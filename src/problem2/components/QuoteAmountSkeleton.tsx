import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/** Matches the fixed-width amount column (`AMOUNT_FIELD_LAYOUT_CLASS` parent). */
export function QuoteAmountSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn('h-8 sm:h-9 w-full min-w-0 rounded-md', className)}
    />
  )
}
