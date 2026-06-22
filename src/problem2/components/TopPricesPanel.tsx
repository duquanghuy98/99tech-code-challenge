import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TruncatedUsd } from '@/components/display/TruncatedNumber'

import { type Token } from '../hooks/useTokenPrices'
import { getNetworkLabel, getTopTokensByPrice } from '../lib/swapUtils'
import { TokenIcon } from './TokenSelector'

interface TopPricesPanelProps {
  tokens: Token[]
  activeCurrency?: string
  onSelect?: (currency: string) => void
  limit?: number
  className?: string
}

export default function TopPricesPanel({
  tokens,
  activeCurrency,
  onSelect,
  limit = 10,
  className,
}: TopPricesPanelProps) {
  const { t } = useTranslation()
  const ranked = getTopTokensByPrice(tokens, limit)

  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm',
        'flex flex-col',
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 shrink-0">
        <TrendingUp className="h-4 w-4 text-emerald-500" />
        <h3 className="text-sm font-semibold">{t('problem2.topPrices')}</h3>
      </div>

      <div className="p-3 space-y-1.5">
        {ranked.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10 px-4">
            {t('problem2.topPricesHint')}
          </p>
        ) : (
          ranked.map((token, i) => {
            const active = token.currency === activeCurrency
            return (
              <motion.button
                key={token.currency}
                type="button"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelect?.(token.currency)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl border p-2.5 text-left transition-colors',
                  active
                    ? 'border-emerald-500/40 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                    : 'border-transparent hover:border-border/50 hover:bg-muted/30',
                )}
              >
                <span
                  className={cn(
                    'text-xs font-bold tabular-nums w-5 shrink-0 text-center',
                    i < 3 ? 'text-emerald-500' : 'text-muted-foreground',
                  )}
                >
                  {i + 1}
                </span>
                <TokenIcon currency={token.currency} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight truncate">
                    {token.currency}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {getNetworkLabel(token.currency, t)}
                  </p>
                </div>
                <TruncatedUsd
                  value={token.price}
                  className="text-sm font-semibold shrink-0"
                />
              </motion.button>
            )
          })
        )}
      </div>
    </div>
  )
}
