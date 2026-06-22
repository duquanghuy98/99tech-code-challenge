import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bug } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import PageTransition from '@/components/display/PageTransition'
import ProblemBadge from '@/components/common/ProblemBadge'
import { useInitialMinLoading } from '@/hooks/useDelayedValue'
import CodeSnippet from '@/components/display/CodeSnippet'
import Problem3PageSkeleton from './Problem3PageSkeleton'
import CodeDiffViewer from './components/diff/CodeDiffViewer'
import IssueCard from './components/IssueCard'
import ProgressStrip from './components/ProgressStrip'
import { issues } from './data/issues'
import type { Issue, IssueHighlightRange, Severity } from './types'
import { cn } from '@/lib/utils'
import ORIGINAL_RAW from './written-answer/original.tsx?raw'
import REFACTORED_RAW from './written-answer/WalletPage.tsx?raw'

const ORIGINAL_CODE = ORIGINAL_RAW
const REFACTORED_CODE = REFACTORED_RAW

export default function Problem3Page() {
  const { t } = useTranslation()
  const showContentSkeleton = useInitialMinLoading()

  const [activeFilters, setActiveFilters] = useState<Set<Severity>>(
    new Set(['critical', 'warning', 'minor']),
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('issues')
  const [highlightLines, setHighlightLines] = useState<IssueHighlightRange | undefined>()
  const [highlightKey, setHighlightKey] = useState(0)
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null)

  const criticalCount = issues.filter((i) => i.severity === 'critical').length
  const warningCount = issues.filter((i) => i.severity === 'warning').length
  const minorCount = issues.filter((i) => i.severity === 'minor').length

  const filteredIssues = issues.filter((i) => activeFilters.has(i.severity))

  function toggleFilter(severity: Severity) {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(severity) && next.size > 1) next.delete(severity)
      else next.add(severity)
      return next
    })
  }

  function handleViewInDiff(issue: Issue) {
    setHighlightLines({
      original: issue.originalLines,
      refactored: issue.refactoredLines,
    })
    setHighlightKey((k) => k + 1)
    setActiveIssueId(issue.id)
    setActiveTab('compare')
  }

  function handleNavigateIssue(direction: 'next' | 'prev') {
    const idx = issues.findIndex((i) => i.id === activeIssueId)
    if (idx === -1) return
    const next = direction === 'next'
      ? issues[(idx + 1) % issues.length]
      : issues[(idx - 1 + issues.length) % issues.length]
    handleViewInDiff(next)
  }

  const currentIssue = activeIssueId
    ? issues.find((i) => i.id === activeIssueId)
    : undefined

  return (
    <PageTransition>
      <div className="page-container pb-8">
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
              <Bug className="h-5 w-5 text-primary" />
            </div>
            <ProblemBadge problem={3} />
          </div>
          <h1 className="text-3xl font-black mb-2">{t('problem3.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('problem3.subtitle')}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {(['critical', 'warning', 'minor'] as Severity[]).map((severity) => {
              const active = activeFilters.has(severity)
              const count = severity === 'critical'
                ? criticalCount
                : severity === 'warning'
                  ? warningCount
                  : minorCount
              return (
                <button
                  key={severity}
                  type="button"
                  onClick={() => toggleFilter(severity)}
                  className={cn(
                    'transition-all duration-150',
                    !active && 'opacity-40 grayscale',
                  )}
                >
                  <Badge
                    variant={active ? severity : 'outline'}
                    className="cursor-pointer select-none px-2 py-0.5 text-xs"
                  >
                    {count} {t(`problem3.severity.${severity}`)}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        {showContentSkeleton ? (
          <Problem3PageSkeleton />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 sm:mb-5">
              <TabsTrigger value="issues">{t('problem3.tabs.issues')}</TabsTrigger>
              <TabsTrigger value="compare">{t('problem3.tabs.compare')}</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="mt-0 focus-visible:outline-none">
              <ProgressStrip
                  total={issues.length}
                  criticalCount={criticalCount}
                  warningCount={warningCount}
                  minorCount={minorCount}
                />

                {filteredIssues.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    {t('problem3.emptyFilter')}
                  </p>
                ) : (
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-2">
                      {filteredIssues.map((issue, i) => (
                        <IssueCard
                          key={issue.id}
                          issue={issue}
                          index={i}
                          isExpanded={expandedId === issue.id}
                          onToggle={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                          onViewInDiff={() => handleViewInDiff(issue)}
                        />
                      ))}
                    </div>
                  </AnimatePresence>
                )}
            </TabsContent>

            <TabsContent value="compare" className="mt-4 focus-visible:outline-none">
              <CodeDiffViewer
                  originalCode={ORIGINAL_CODE}
                  refactoredCode={REFACTORED_CODE}
                  language="tsx"
                  originalFilename="original.tsx"
                  refactoredFilename={t('problem3.filenames.refactored')}
                  highlightLines={highlightLines}
                  highlightKey={highlightKey}
                  currentIssue={currentIssue ? {
                    ...currentIssue,
                    title: t(`problem3.issues.${currentIssue.id}.title`),
                    detail: t(`problem3.issues.${currentIssue.id}.detail`),
                  } : undefined}
                  allIssues={issues.map((issue) => ({
                    ...issue,
                    title: t(`problem3.issues.${issue.id}.title`),
                    detail: t(`problem3.issues.${issue.id}.detail`),
                  }))}
                  onIssueSelect={(id) => {
                    const issue = issues.find((i) => i.id === id)
                    if (issue) handleViewInDiff(issue)
                  }}
                  onPrev={() => handleNavigateIssue('prev')}
                  onNext={() => handleNavigateIssue('next')}
                />
              <div className="mt-4">
                <CodeSnippet
                  code={REFACTORED_CODE}
                  language="tsx"
                  filename={t('problem3.filenames.fullRefactored')}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PageTransition>
  )
}
