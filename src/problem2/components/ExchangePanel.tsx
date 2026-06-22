import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeftRight, Banknote } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { type Token } from '../hooks/useTokenPrices'
import { getTrendingTokens } from '../lib/swapUtils'
import TrendingBar from './TrendingBar'
import SwapForm from './SwapForm'
import FiatExchangeForm from './fiat/FiatExchangeForm'
import TopPricesPanel from './TopPricesPanel'

interface ExchangePanelProps {
  tokens: Token[]
}

export default function ExchangePanel({ tokens }: ExchangePanelProps) {
  const { t } = useTranslation()
  const [selectedToken, setSelectedToken] = useState(
    tokens[1]?.currency ?? tokens[0]?.currency ?? '',
  )

  const trending = useMemo(() => getTrendingTokens(tokens), [tokens])

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <TrendingBar tokens={trending} />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
        <div className="w-full lg:flex-1 min-w-0 flex flex-col">
          <div
            className={cn(
              'rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl',
              'shadow-xl shadow-black/10 overflow-hidden flex flex-col',
            )}
          >
            <Tabs defaultValue="swap" className="flex flex-col">
              <div className="px-4 pt-3 pb-3 border-b border-border/50">
                <TabsList
                  className={cn(
                    'w-full h-10 p-1 grid grid-cols-2 rounded-xl',
                    'bg-muted/50 border border-border/40',
                  )}
                >
                  <TabsTrigger
                    value="swap"
                    className="rounded-lg gap-2 data-[state=active]:shadow-sm"
                  >
                    <ArrowLeftRight className="h-4 w-4 shrink-0" />
                    {t('problem2.tabSwap')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="cash"
                    className="rounded-lg gap-2 data-[state=active]:shadow-sm"
                  >
                    <Banknote className="h-4 w-4 shrink-0" />
                    {t('problem2.tabCash')}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="swap" className="mt-0 p-4 focus-visible:outline-none">
                <SwapForm
                  tokens={tokens}
                  selectedToken={selectedToken}
                  onSelectedTokenChange={setSelectedToken}
                />
              </TabsContent>

              <TabsContent value="cash" className="mt-0 p-4 focus-visible:outline-none">
                <FiatExchangeForm
                  tokens={tokens}
                  selectedToken={selectedToken}
                  onSelectedTokenChange={setSelectedToken}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="w-full lg:w-[minmax(260px,340px)] lg:max-w-[340px] shrink-0">
          <TopPricesPanel
            tokens={tokens}
            activeCurrency={selectedToken}
            onSelect={setSelectedToken}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
