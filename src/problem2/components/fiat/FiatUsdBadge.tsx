import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface FiatUsdBadgeProps {
  className?: string
}

export default function FiatUsdBadge({ className }: FiatUsdBadgeProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border-0',
        'w-full sm:w-auto sm:shrink-0 sm:min-w-[120px]',
        className,
      )}
    >
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center',
          'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold',
        )}
      >
        $
      </div>
      <span className="font-semibold text-sm">{t('problem2.fiat.usd')}</span>
    </div>
  )
}
