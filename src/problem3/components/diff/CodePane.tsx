import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IssueMarker } from '../../types'

const BG = { dark: '#282c34', light: '#fafafa' } as const
const LINE_HEIGHT_REM = 1.6
const FONT_SIZE_REM = 0.75

/** Keeps line backgrounds/highlights spanning full scrollable line width on mobile. */
const LINE_LAYOUT_STYLE: React.CSSProperties = {
  display: 'block',
  width: 'max-content',
  minWidth: '100%',
}

export interface CodePaneProps {
  code: string
  language: string
  filename: string
  side: 'left' | 'right'
  highlightLines?: [number, number]
  scrollRef: React.RefObject<HTMLDivElement>
  onScroll: () => void
  flashKey?: number
  inlineBar?: React.ReactNode
  issueMarkers?: IssueMarker[]
  onMarkerClick?: (id: string) => void
}

export default function CodePane({
  code,
  language,
  filename,
  side,
  highlightLines,
  scrollRef,
  onScroll,
  flashKey,
  inlineBar,
  issueMarkers = [],
  onMarkerClick,
}: CodePaneProps) {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const bg = isDark ? BG.dark : BG.light
  const [flashActive, setFlashActive] = useState(false)
  const [barTop, setBarTop] = useState<number | null>(null)
  const [markerTops, setMarkerTops] = useState<Record<string, number>>({})

  useEffect(() => {
    if (flashKey === undefined || !highlightLines) return
    setFlashActive(true)
    const timer = window.setTimeout(() => setFlashActive(false), 1400)
    return () => window.clearTimeout(timer)
  }, [flashKey, highlightLines])

  useEffect(() => {
    if (!highlightLines || !scrollRef.current) return
    const frame = requestAnimationFrame(() => {
      const container = scrollRef.current
      if (!container) return

      const firstLineEl = container.querySelector<HTMLElement>(
        `[data-line-number="${highlightLines[0]}"]`,
      )
      const lastLineEl = container.querySelector<HTMLElement>(
        `[data-line-number="${highlightLines[1]}"]`,
      )

      if (firstLineEl) {
        const target = Math.max(0, firstLineEl.offsetTop - 80)
        container.scrollTo({ top: target, behavior: 'smooth' })
      } else {
        const fontSize = parseFloat(window.getComputedStyle(container).fontSize) || 12
        const lineH = fontSize * LINE_HEIGHT_REM
        container.scrollTo({
          top: Math.max(0, (highlightLines[0] - 1) * lineH - 80),
          behavior: 'smooth',
        })
      }

      if (lastLineEl && inlineBar !== undefined) {
        setBarTop(lastLineEl.offsetTop + lastLineEl.offsetHeight)
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [highlightLines, flashKey, scrollRef, inlineBar])

  useEffect(() => {
    if (!issueMarkers.length || !scrollRef.current) return
    const frame = requestAnimationFrame(() => {
      const container = scrollRef.current
      if (!container) return
      const tops: Record<string, number> = {}
      for (const marker of issueMarkers) {
        const el = container.querySelector<HTMLElement>(`[data-line-number="${marker.firstLine}"]`)
        if (el) tops[marker.id] = el.offsetTop
      }
      setMarkerTops(tops)
    })
    return () => cancelAnimationFrame(frame)
  }, [issueMarkers, scrollRef, flashKey])

  const lineProps = (lineNumber: number): React.HTMLAttributes<HTMLElement> => {
    const base: React.HTMLAttributes<HTMLElement> = {
      'data-line-number': lineNumber,
      style: LINE_LAYOUT_STYLE,
    } as React.HTMLAttributes<HTMLElement>

    if (!highlightLines) return base
    const [start, end] = highlightLines
    if (lineNumber < start || lineNumber > end) return base

    const isLeft = side === 'left'
    return {
      ...base,
      style: {
        ...LINE_LAYOUT_STYLE,
        borderRadius: '2px',
        transition: 'background 0.4s ease',
        background: flashActive
          ? isLeft
            ? isDark ? 'rgba(239,68,68,0.28)' : 'rgba(239,68,68,0.18)'
            : isDark ? 'rgba(34,197,94,0.28)' : 'rgba(34,197,94,0.18)'
          : isLeft
            ? isDark ? 'rgba(239,68,68,0.13)' : 'rgba(239,68,68,0.09)'
            : isDark ? 'rgba(34,197,94,0.13)' : 'rgba(34,197,94,0.09)',
      },
    }
  }

  const lineHeightPx = FONT_SIZE_REM * LINE_HEIGHT_REM * 16

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50 shrink-0',
        side === 'left' ? 'border-r-0' : '',
      )}>
        <span className={cn(
          'text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0',
          side === 'left' ? 'bg-red-500/15 text-red-500' : 'bg-emerald-500/15 text-emerald-500',
        )}>
          {side === 'left' ? t('problem3.compare.before') : t('problem3.compare.after')}
        </span>
        <span className="text-xs font-mono text-muted-foreground truncate">{filename}</span>
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-auto relative"
        style={{ background: bg }}
      >
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: `${FONT_SIZE_REM}rem`,
            lineHeight: LINE_HEIGHT_REM,
            padding: '0.875rem',
            background: bg,
            minHeight: '100%',
            width: 'max-content',
            minWidth: '100%',
          }}
          codeTagProps={{
            style: {
              background: 'none',
              display: 'block',
              width: 'max-content',
              minWidth: '100%',
            },
          }}
          showLineNumbers
          lineNumberStyle={{ opacity: 0.3, fontSize: '0.7rem', background: 'none', userSelect: 'none' }}
          wrapLines
          lineProps={lineProps}
        >
          {code}
        </SyntaxHighlighter>

        {issueMarkers.map((marker) => {
          const top = markerTops[marker.id]
          if (top === undefined) return null
          const isLeft = side === 'left'
          return (
            <button
              key={marker.id}
              type="button"
              onClick={() => onMarkerClick?.(marker.id)}
              title={t('problem3.diff.issueLabel', { id: marker.id })}
              className={cn(
                'absolute flex items-center justify-center rounded transition-all z-20',
                'w-4 h-4 hover:scale-125',
                marker.isActive
                  ? isLeft
                    ? 'text-red-400 opacity-100'
                    : 'text-emerald-400 opacity-100'
                  : 'text-yellow-400 opacity-50 hover:opacity-100',
              )}
              style={{
                top: top + (lineHeightPx - 16) / 2,
                left: 4,
              }}
            >
              <Lightbulb className="w-3 h-3" />
            </button>
          )
        })}

        {inlineBar && barTop !== null && (
          <div
            className="absolute left-0 right-0 px-3 py-2 z-10"
            style={{ top: barTop }}
          >
            {inlineBar}
          </div>
        )}
      </div>
    </div>
  )
}
