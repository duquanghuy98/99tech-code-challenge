import { useTranslation } from 'react-i18next'
import { Building2, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FIAT_PAYMENT_METHODS, type FiatMethodId } from '../../lib/fiatUtils'

interface FiatMethodSelectorProps {
  mode: 'buy' | 'sell'
  methodId: FiatMethodId
  onMethodChange: (id: FiatMethodId) => void
}

export default function FiatMethodSelector({
  mode,
  methodId,
  onMethodChange,
}: FiatMethodSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        {mode === 'buy'
          ? t('problem2.fiat.paymentMethod')
          : t('problem2.fiat.payoutMethod')}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {FIAT_PAYMENT_METHODS.map((method) => {
          const Icon = method.id === 'card' ? CreditCard : Building2
          const active = methodId === method.id
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onMethodChange(method.id)}
              className={cn(
                'flex items-center gap-2 rounded-xl border p-3 text-left transition-colors',
                active
                  ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/25'
                  : 'border-border/50 bg-muted/20 hover:bg-muted/40',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  active ? 'text-emerald-500' : 'text-muted-foreground',
                )}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">
                  {t(`problem2.fiat.methods.${method.id}`)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {t(`problem2.fiat.methods.${method.id}Fee`)}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
