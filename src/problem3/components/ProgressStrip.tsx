import { useTranslation } from 'react-i18next'

interface ProgressStripProps {
  total: number
  criticalCount: number
  warningCount: number
  minorCount: number
}

export default function ProgressStrip({
  total,
  criticalCount,
  warningCount,
  minorCount,
}: ProgressStripProps) {
  const { t } = useTranslation()

  return (
    <div className="mb-4 sm:mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          {t('problem3.issueCount', { count: total })}
        </span>
        <span className="text-xs text-muted-foreground">
          {t('problem3.progress.allFixed')}
        </span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden gap-px bg-muted">
        {Array.from({ length: criticalCount }).map((_, i) => (
          <div key={`c${i}`} className="flex-1 bg-red-500 rounded-sm" />
        ))}
        {Array.from({ length: warningCount }).map((_, i) => (
          <div key={`w${i}`} className="flex-1 bg-amber-500 rounded-sm" />
        ))}
        {Array.from({ length: minorCount }).map((_, i) => (
          <div key={`m${i}`} className="flex-1 bg-blue-500 rounded-sm" />
        ))}
      </div>
    </div>
  )
}
