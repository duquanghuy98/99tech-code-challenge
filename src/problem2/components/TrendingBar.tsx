import { useTranslation } from 'react-i18next'
import { Flame } from 'lucide-react'
import { type Token } from '../hooks/useTokenPrices'
import { TokenIcon } from './TokenSelector'

interface TrendingBarProps {
  tokens: Token[]
}

function TrendingItem({ token }: { token: Token }) {
  return (
    <span className="flex items-center gap-2 shrink-0 rounded-full px-2.5 py-1.5 text-sm">
      <span className="shrink-0 rounded-full border border-border/70 bg-background/80 p-px shadow-sm">
        <TokenIcon currency={token.currency} size={20} />
      </span>
      <span className="font-semibold">{token.currency}</span>
    </span>
  )
}

export default function TrendingBar({ tokens }: TrendingBarProps) {
  const { t } = useTranslation()

  if (tokens.length === 0) return null

  const marqueeTokens = [...tokens, ...tokens]

  return (
    <div className="trending-glow-border">
      <div className="rounded-[15px] bg-transparent overflow-hidden">
        <div className="flex items-center px-3 py-2.5 sm:px-4">
          <div
            className="flex items-center shrink-0 pr-2 z-10"
            title={t('problem2.trending')}
          >
            <Flame className="h-4 w-4 text-orange-500" aria-hidden />
            <span className="sr-only">{t('problem2.trending')}</span>
          </div>

          <div className="relative flex-1 min-w-0 overflow-hidden ml-2">
            <div className="trending-marquee-track flex w-max items-center gap-2">
              {marqueeTokens.map((token, index) => (
                <TrendingItem
                  key={`${token.currency}-${index}`}
                  token={token}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
