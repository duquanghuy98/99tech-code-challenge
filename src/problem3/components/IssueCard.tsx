import { useTranslation } from 'react-i18next'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { severityConfig } from '../data/issues'
import type { Issue } from '../types'
import MiniCode from './MiniCode'

interface IssueCardProps {
  issue: Issue
  index: number
  isExpanded: boolean
  onToggle: () => void
  onViewInDiff: () => void
}

const cardEnter = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
}

export default function IssueCard({
  issue,
  index,
  isExpanded,
  onToggle,
  onViewInDiff,
}: IssueCardProps) {
  const { t } = useTranslation()
  const { icon: Icon, badgeVariant, border, iconColor } = severityConfig[issue.severity]

  return (
    <motion.div
      key={issue.id}
      custom={index}
      variants={cardEnter}
      initial="hidden"
      animate="show"
      className={cn(
        'rounded-xl border border-border bg-card/50 border-l-2 overflow-hidden',
        border,
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 sm:p-4 pl-4 sm:pl-5 text-left hover:bg-muted/30 transition-colors"
      >
        <Icon className={cn('h-4 w-4 shrink-0', iconColor)} />
        <span className="font-semibold text-sm flex-1 min-w-0 truncate">
          #{issue.id} {t(`problem3.issues.${issue.id}.title`)}
        </span>
        <Badge variant={badgeVariant} className="text-[10px] px-1.5 py-0 shrink-0">
          {t(`problem3.severity.${issue.severity}`)}
        </Badge>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
            isExpanded && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 space-y-3 border-t border-border/50 pt-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`problem3.issues.${issue.id}.detail`)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500">
                    {t('problem3.compare.before')}
                  </p>
                  <MiniCode code={issue.bugSnippet} variant="bug" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                    {t('problem3.compare.after')}
                  </p>
                  <MiniCode code={issue.fixSnippet} variant="fix" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={(e) => { e.stopPropagation(); onViewInDiff() }}
                >
                  {t('problem3.seeFixInDiff')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
