import { useState, useMemo } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Check, ChevronDown, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { cn } from '@/lib/utils'
import { type Token, getTokenIconUrl } from '../hooks/useTokenPrices'

interface TokenIconProps {
  currency: string
  size?: number
}

export function TokenIcon({ currency, size = 24 }: TokenIconProps) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        className="rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold shrink-0"
      >
        {currency[0]}
      </span>
    )
  }

  return (
    <img
      src={getTokenIconUrl(currency)}
      alt={currency}
      width={size}
      height={size}
      className="rounded-full shrink-0 object-cover"
      onError={() => setErrored(true)}
    />
  )
}

interface TokenSelectorProps {
  tokens: Token[]
  value: string
  onChange: (currency: string) => void
  placeholder: string
  searchPlaceholder: string
  noResults: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
}

export default function TokenSelector({
  tokens,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  noResults,
  disabled,
  className,
  triggerClassName,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const filtered = useMemo(
    () =>
      tokens.filter((t) =>
        t.currency.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [tokens, debouncedSearch],
  )

  const selected = tokens.find((t) => t.currency === value)

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className={className}>
      <PopoverPrimitive.Trigger asChild>
        <button
          disabled={disabled}
          className={cn(
            'flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border',
            'bg-background/60 hover:bg-accent backdrop-blur-sm transition-all duration-200',
            'text-sm font-medium min-w-[130px] w-full',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            triggerClassName,
          )}
        >
          {selected ? (
            <>
              <TokenIcon currency={selected.currency} size={22} />
              <span className="flex-1 text-left">{selected.currency}</span>
            </>
          ) : (
            <span className="flex-1 text-left text-muted-foreground">
              {placeholder}
            </span>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className="z-50 w-56 rounded-xl border border-border bg-popover shadow-xl p-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {/* Search */}
          <div className="flex items-center gap-2 px-2 py-1.5 mb-1 rounded-lg border border-border bg-muted/30">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 min-w-0"
            />
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-5">
                  {noResults}
                </p>
              ) : (
                filtered.map((token) => (
                  <button
                    key={token.currency}
                    onClick={() => {
                      onChange(token.currency)
                      setOpen(false)
                      setSearch('')
                    }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors',
                      'hover:bg-accent text-left',
                      value === token.currency && 'bg-accent',
                    )}
                  >
                    <TokenIcon currency={token.currency} size={22} />
                    <span className="font-medium flex-1">{token.currency}</span>
                    {value === token.currency && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))
              )}
            </AnimatePresence>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
      </div>
    </PopoverPrimitive.Root>
  )
}
