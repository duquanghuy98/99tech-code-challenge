import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ExchangeSubmitButtonProps {
  canSubmit: boolean
  isLoading: boolean
  blockedReason: string
  loadingLabel: string
  idleLabel: string
}

export default function ExchangeSubmitButton({
  canSubmit,
  isLoading,
  blockedReason,
  loadingLabel,
  idleLabel,
}: ExchangeSubmitButtonProps) {
  const showBlockedHint = !canSubmit && !isLoading && blockedReason

  return (
    <span
      className={cn(
        'relative block w-full group/exchange-btn',
        showBlockedHint && 'cursor-not-allowed',
      )}
    >
      <Button
        type="submit"
        disabled={isLoading || !canSubmit}
        className={cn(
          'w-full h-12 rounded-xl font-semibold text-base',
          'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20',
          'border-0 disabled:opacity-50',
          showBlockedHint && 'pointer-events-none',
        )}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingLabel}
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
              {idleLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
      {showBlockedHint && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2',
            'rounded-lg border border-border bg-popover px-2.5 py-1.5',
            'text-xs font-medium text-popover-foreground shadow-lg',
            'max-w-[min(100%,280px)] text-center whitespace-normal',
            'opacity-0 invisible transition-opacity duration-150',
            'group-hover/exchange-btn:opacity-100 group-hover/exchange-btn:visible',
          )}
        >
          {blockedReason}
        </span>
      )}
    </span>
  )
}
