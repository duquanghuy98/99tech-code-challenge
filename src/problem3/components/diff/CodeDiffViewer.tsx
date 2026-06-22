import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Panel, Group, Separator } from 'react-resizable-panels'
import { GripVertical, MoveHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSyncedScroll } from '../../hooks/useSyncedScroll'
import type { IssueHighlightRange, IssueRef } from '../../types'
import CodePane from './CodePane'
import DiffIssueToolbar, { MobilePanelToggle } from './DiffIssueToolbar'

export type { IssueRef } from '../../types'

interface CodeDiffViewerProps {
  originalCode: string
  refactoredCode: string
  language?: string
  originalFilename?: string
  refactoredFilename?: string
  highlightLines?: IssueHighlightRange
  highlightKey?: number
  currentIssue?: IssueRef
  allIssues?: IssueRef[]
  onIssueSelect?: (id: string) => void
  onPrev?: () => void
  onNext?: () => void
  className?: string
}

export default function CodeDiffViewer({
  originalCode,
  refactoredCode,
  language = 'tsx',
  originalFilename = 'original.tsx',
  refactoredFilename = 'WalletPage.tsx',
  highlightLines,
  highlightKey = 0,
  currentIssue,
  allIssues = [],
  onIssueSelect,
  onPrev,
  onNext,
  className,
}: CodeDiffViewerProps) {
  const { t } = useTranslation()
  const { leftScrollRef, rightScrollRef, syncScroll } = useSyncedScroll()
  const [isMobile, setIsMobile] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<'left' | 'right'>('right')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const leftIssueMarkers = allIssues.map((issue) => ({
    id: issue.id,
    firstLine: issue.originalLines[0],
    isActive: issue.id === currentIssue?.id,
  }))

  const rightIssueMarkers = allIssues.map((issue) => ({
    id: issue.id,
    firstLine: issue.refactoredLines[0],
    isActive: issue.id === currentIssue?.id,
  }))

  const inlineBar = currentIssue ? (
    <DiffIssueToolbar
      currentIssue={currentIssue}
      highlightKey={highlightKey}
      onPrev={onPrev}
      onNext={onNext}
    />
  ) : undefined

  const sharedMarkerProps = { onMarkerClick: onIssueSelect }
  const isScrollSynced = !highlightLines

  if (isMobile) {
    return (
      <div className={cn(className)}>
        <div className="rounded-xl border border-border overflow-hidden">
          <MobilePanelToggle mobilePanel={mobilePanel} onPanelChange={setMobilePanel} />
          <p className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] text-muted-foreground bg-muted/20 border-b border-border">
            <MoveHorizontal className="h-3 w-3 shrink-0 opacity-70" />
            {t('problem3.diff.scrollHint')}
          </p>
          <div className="h-[420px]">
            {mobilePanel === 'left' ? (
              <CodePane
                code={originalCode}
                language={language}
                filename={originalFilename}
                side="left"
                highlightLines={highlightLines?.original}
                flashKey={highlightKey}
                scrollRef={leftScrollRef}
                onScroll={() => {}}
                issueMarkers={leftIssueMarkers}
                {...sharedMarkerProps}
              />
            ) : (
              <CodePane
                code={refactoredCode}
                language={language}
                filename={refactoredFilename}
                side="right"
                highlightLines={highlightLines?.refactored}
                flashKey={highlightKey}
                scrollRef={rightScrollRef}
                onScroll={() => {}}
                inlineBar={inlineBar}
                issueMarkers={rightIssueMarkers}
                {...sharedMarkerProps}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border border-border overflow-hidden', className)}>
      <p className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] text-muted-foreground bg-muted/20 border-b border-border">
        <GripVertical className="h-3 w-3 shrink-0 opacity-70" />
        {t('problem3.diff.dragHint')}
      </p>
      <div style={{ height: 520 }}>
      <Group orientation="horizontal" className="h-full">
        <Panel defaultSize="50%" minSize="20%">
          <div className="h-full border-r border-border">
            <CodePane
              code={originalCode}
              language={language}
              filename={originalFilename}
              side="left"
              highlightLines={highlightLines?.original}
              flashKey={highlightKey}
              scrollRef={leftScrollRef}
              onScroll={isScrollSynced ? () => syncScroll('left') : () => {}}
              issueMarkers={leftIssueMarkers}
              {...sharedMarkerProps}
            />
          </div>
        </Panel>

        <Separator className="w-2 flex items-center justify-center bg-muted/30 hover:bg-muted/60 active:bg-muted transition-colors cursor-col-resize group">
          <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Separator>

        <Panel defaultSize="50%" minSize="20%">
          <CodePane
            code={refactoredCode}
            language={language}
            filename={refactoredFilename}
            side="right"
            highlightLines={highlightLines?.refactored}
            flashKey={highlightKey}
            scrollRef={rightScrollRef}
            onScroll={isScrollSynced ? () => syncScroll('right') : () => {}}
            inlineBar={inlineBar}
            issueMarkers={rightIssueMarkers}
            {...sharedMarkerProps}
          />
        </Panel>
      </Group>
      </div>
    </div>
  )
}
