import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, MessageSquare, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { severityConfig } from '../../data/issues'
import type { IssueRef } from '../../types'

interface DiffIssueToolbarProps {
  currentIssue?: IssueRef
  highlightKey?: number
  onPrev?: () => void
  onNext?: () => void
  mobileVariant?: 'original' | 'refactored'
  onViewRefactored?: () => void
  onViewOriginal?: () => void
}

export function IssueLabelBadge({ issue }: { issue: IssueRef }) {
  const { t } = useTranslation()
  const severityLabel = t(`problem3.severity.${issue.severity}`)
  const issueMeta = t('problem3.diff.issueLabel', { id: issue.id })
  const { iconColor } = severityConfig[issue.severity]

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-background text-xs font-semibold text-foreground shadow-sm shrink-0">
      <span>{issueMeta}</span>
      <span className="text-border font-normal">|</span>
      <span className={iconColor}>{severityLabel}</span>
    </span>
  )
}

export default function DiffIssueToolbar({
  currentIssue,
  highlightKey = 0,
  onPrev,
  onNext,
  mobileVariant,
  onViewRefactored,
  onViewOriginal,
}: DiffIssueToolbarProps) {
  const { t } = useTranslation()
  const [reasoningOpen, setReasoningOpen] = useState(false)

  useEffect(() => { setReasoningOpen(false) }, [highlightKey])

  if (!currentIssue) return null

  const severityLabel = t(`problem3.severity.${currentIssue.severity}`)
  const issueMeta = t('problem3.diff.issueLabel', { id: currentIssue.id })

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => onPrev?.()}
          className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-background/90 backdrop-blur hover:bg-muted text-xs font-medium transition-colors shadow-sm"
        >
          <ChevronLeft className="h-3 w-3" />
          {t('problem3.diff.prev')}
        </button>

        <button
          type="button"
          onClick={() => onNext?.()}
          className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-background/90 backdrop-blur hover:bg-muted text-xs font-medium transition-colors shadow-sm"
        >
          {t('problem3.diff.next')}
          <ChevronRight className="h-3 w-3" />
        </button>

        <button
          type="button"
          onClick={() => setReasoningOpen((open) => !open)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-colors shadow-sm backdrop-blur',
            reasoningOpen
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-background/90 hover:bg-muted',
          )}
        >
          <MessageSquare className="h-3 w-3" />
          {t('problem3.diff.reasoning')}
        </button>

        {mobileVariant === 'original' && (
          <button
            type="button"
            onClick={() => onViewRefactored?.()}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-background/90 backdrop-blur hover:bg-muted text-xs font-medium transition-colors shadow-sm"
          >
            {t('problem3.diff.viewRefactored')}
            <ChevronRight className="h-3 w-3" />
          </button>
        )}

        {mobileVariant === 'refactored' && (
          <button
            type="button"
            onClick={() => onViewOriginal?.()}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-background/90 backdrop-blur hover:bg-muted text-xs font-medium transition-colors shadow-sm"
          >
            <ChevronLeft className="h-3 w-3" />
            {t('problem3.diff.viewOriginal')}
          </button>
        )}
      </div>

      <AnimatePresence>
        {reasoningOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="rounded-xl border border-border bg-card/95 backdrop-blur shadow-xl p-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                  {issueMeta} | {severityLabel}
                </p>
                <span className="text-xs font-semibold">{currentIssue.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setReasoningOpen(false)}
                className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentIssue.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface MobilePanelToggleProps {
  mobilePanel: 'left' | 'right'
  onPanelChange: (panel: 'left' | 'right') => void
}

export function MobilePanelToggle({ mobilePanel, onPanelChange }: MobilePanelToggleProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 border-b border-border">
      {(['left', 'right'] as const).map((panel) => (
        <button
          key={panel}
          type="button"
          onClick={() => onPanelChange(panel)}
          className={cn(
            'flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors',
            mobilePanel === panel
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {panel === 'left'
            ? t('problem3.compare.beforeOriginal')
            : t('problem3.compare.afterRefactored')}
        </button>
      ))}
    </div>
  )
}
