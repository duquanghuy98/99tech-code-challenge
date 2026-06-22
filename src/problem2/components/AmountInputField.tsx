import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import SwapAmountInput, { AMOUNT_FIELD_LAYOUT_CLASS } from './SwapAmountInput'

interface AmountInputFieldProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  error?: string
  placeholder?: string
  inputClassName?: string
}

export default function AmountInputField({
  value,
  onChange,
  onBlur,
  disabled,
  error,
  placeholder,
  inputClassName,
}: AmountInputFieldProps) {
  const [shakeKey, setShakeKey] = useState(0)

  useEffect(() => {
    if (error) {
      setShakeKey((k) => k + 1)
    }
  }, [error])

  const hasError = Boolean(error)

  return (
    <div className={cn('flex flex-col', AMOUNT_FIELD_LAYOUT_CLASS)}>
      <motion.div
        key={shakeKey}
        initial={{ x: 0 }}
        animate={
          hasError ? { x: [0, -6, 6, -5, 5, -2, 2, 0] } : { x: 0 }
        }
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={cn(
          'rounded-lg border px-2 py-0.5 transition-colors duration-200 w-full box-border',
          'border-border/40 bg-background/60',
          'focus-within:border-emerald-500/45 focus-within:shadow-sm focus-within:ring-1 focus-within:ring-emerald-500/15',
          hasError &&
            'border-destructive/70 bg-destructive/5 ring-1 ring-destructive/25 focus-within:border-destructive/70 focus-within:ring-destructive/25',
        )}
      >
        <SwapAmountInput
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'w-full min-w-0 bg-transparent text-2xl sm:text-3xl font-semibold text-right outline-none',
            'placeholder:text-muted-foreground/30 tabular-nums',
            hasError && 'text-destructive placeholder:text-destructive/30',
            inputClassName,
          )}
        />
      </motion.div>
      <div className="min-h-[18px] mt-1 w-full">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive text-right px-0.5 leading-tight"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
