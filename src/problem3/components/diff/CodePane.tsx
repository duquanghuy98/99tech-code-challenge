import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
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

/** Offset of `el` from the top of `container`'s scroll content. */
function getContentOffsetTop(el: HTMLElement, container: HTMLElement): number {
  const elRect = el.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  return elRect.top - containerRect.top + container.scrollTop
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
  inlineLabel?: React.ReactNode
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
  inlineLabel,
  issueMarkers = [],
  onMarkerClick,
}: CodePaneProps) {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const bg = isDark ? BG.dark : BG.light
  const [flashActive, setFlashActive] = useState(false)
  const [barTop, setBarTop] = useState<number | null>(null)
  const [labelTop, setLabelTop] = useState<number | null>(null)
  const [markerTops, setMarkerTops] = useState<Record<string, number>>({})
  const [showScrollDownHint, setShowScrollDownHint] = useState(false)
  const [showScrollUpHint, setShowScrollUpHint] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const scrollTargetIntoView = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const padding = 16
    const viewportTop = container.scrollTop
    const viewportBottom = viewportTop + container.clientHeight

    if (inlineBar && toolbarRef.current) {
      const toolbar = toolbarRef.current
      const targetTop = getContentOffsetTop(toolbar, container)
      const targetBottom = targetTop + toolbar.offsetHeight

      if (targetTop < viewportTop + padding) {
        container.scrollTo({ top: Math.max(0, targetTop - padding), behavior: 'smooth' })
      } else if (targetBottom > viewportBottom - padding) {
        container.scrollTo({
          top: Math.max(0, targetBottom - container.clientHeight + padding),
          behavior: 'smooth',
        })
      }
      return
    }

    if (!highlightLines) return
    const firstLineEl = container.querySelector<HTMLElement>(
      `[data-line-number="${highlightLines[0]}"]`,
    )
    const lastLineEl = container.querySelector<HTMLElement>(
      `[data-line-number="${highlightLines[1]}"]`,
    )
    if (!firstLineEl || !lastLineEl) return

    const targetTop = getContentOffsetTop(firstLineEl, container)
    const targetBottom = getContentOffsetTop(lastLineEl, container) + lastLineEl.offsetHeight

    if (targetTop < viewportTop + padding) {
      container.scrollTo({ top: Math.max(0, targetTop - padding), behavior: 'smooth' })
    } else if (targetBottom > viewportBottom - padding) {
      container.scrollTo({
        top: Math.max(0, targetBottom - container.clientHeight + padding),
        behavior: 'smooth',
      })
    }
  }, [scrollRef, inlineBar, highlightLines])

  const updateScrollHint = useCallback(() => {
    const container = scrollRef.current
    if (!container) {
      setShowScrollDownHint(false)
      setShowScrollUpHint(false)
      return
    }

    let regionTop: number
    let regionBottom: number

    if (inlineBar && toolbarRef.current) {
      const toolbarRect = toolbarRef.current.getBoundingClientRect()
      regionTop = toolbarRect.top
      regionBottom = toolbarRect.bottom
    } else if (highlightLines) {
      const firstLineEl = container.querySelector<HTMLElement>(
        `[data-line-number="${highlightLines[0]}"]`,
      )
      const lastLineEl = container.querySelector<HTMLElement>(
        `[data-line-number="${highlightLines[1]}"]`,
      )
      if (!firstLineEl || !lastLineEl) {
        setShowScrollDownHint(false)
        setShowScrollUpHint(false)
        return
      }
      const firstRect = firstLineEl.getBoundingClientRect()
      const lastRect = lastLineEl.getBoundingClientRect()
      regionTop = firstRect.top
      regionBottom = lastRect.bottom
    } else {
      setShowScrollDownHint(false)
      setShowScrollUpHint(false)
      return
    }

    const containerRect = container.getBoundingClientRect()
    const fullyVisible =
      regionTop >= containerRect.top - 2 &&
      regionBottom <= containerRect.bottom + 2

    setShowScrollDownHint(!fullyVisible && regionBottom > containerRect.bottom + 2)
    setShowScrollUpHint(!fullyVisible && regionTop < containerRect.top - 2)
  }, [inlineBar, highlightLines, scrollRef])

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
        const labelOffset = inlineLabel ? 36 : 0
        const target = Math.max(0, getContentOffsetTop(firstLineEl, container) - 80 - labelOffset)
        container.scrollTo({ top: target, behavior: 'smooth' })
      } else {
        const fontSize = parseFloat(window.getComputedStyle(container).fontSize) || 12
        const lineH = fontSize * LINE_HEIGHT_REM
        container.scrollTo({
          top: Math.max(0, (highlightLines[0] - 1) * lineH - 80),
          behavior: 'smooth',
        })
      }

      if (firstLineEl && inlineLabel) {
        setLabelTop(getContentOffsetTop(firstLineEl, container))
      } else {
        setLabelTop(null)
      }

      if (lastLineEl && inlineBar) {
        setBarTop(getContentOffsetTop(lastLineEl, container) + lastLineEl.offsetHeight)
      } else {
        setBarTop(null)
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [highlightLines, flashKey, scrollRef, inlineBar, inlineLabel])

  useEffect(() => {
    if (!inlineBar) setBarTop(null)
  }, [inlineBar])

  useEffect(() => {
    if (!inlineLabel) setLabelTop(null)
  }, [inlineLabel])

  useLayoutEffect(() => {
    updateScrollHint()
  }, [updateScrollHint, barTop, flashKey, highlightLines])

  useEffect(() => {
    updateScrollHint()
    const toolbar = toolbarRef.current
    const resizeObserver =
      toolbar && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateScrollHint())
        : null
    if (toolbar && resizeObserver) resizeObserver.observe(toolbar)

    const timers = [150, 400, 800, 1200].map((ms) => window.setTimeout(updateScrollHint, ms))

    return () => {
      resizeObserver?.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [updateScrollHint, barTop, flashKey, highlightLines])

  useEffect(() => {
    if (!issueMarkers.length || !scrollRef.current) return
    const frame = requestAnimationFrame(() => {
      const container = scrollRef.current
      if (!container) return
      const tops: Record<string, number> = {}
      for (const marker of issueMarkers) {
        const el = container.querySelector<HTMLElement>(`[data-line-number="${marker.firstLine}"]`)
        if (el) tops[marker.id] = getContentOffsetTop(el, container)
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
  const scrollHintsEnabled = Boolean(inlineBar || highlightLines)
  const scrollUpLabel = inlineBar
    ? t('problem3.diff.scrollUpForControls')
    : t('problem3.diff.scrollUpForHighlight')
  const scrollDownLabel = inlineBar
    ? t('problem3.diff.scrollDownForControls')
    : t('problem3.diff.scrollDownForHighlight')

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

      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          onScroll={() => {
            onScroll()
            updateScrollHint()
          }}
          className="h-full overflow-auto relative"
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

        {inlineLabel && labelTop !== null && (
          <div
            className="absolute left-0 right-0 px-3 z-10 pointer-events-none"
            style={{ top: labelTop, transform: 'translateY(calc(-100% - 4px))' }}
          >
            {inlineLabel}
          </div>
        )}

        {inlineBar && barTop !== null && (
          <div
            ref={toolbarRef}
            className="absolute left-0 right-0 px-3 py-2 z-10"
            style={{ top: barTop }}
          >
            {inlineBar}
          </div>
        )}
        </div>

        {showScrollUpHint && scrollHintsEnabled && (
          <ScrollControlsHint
            direction="up"
            side={side}
            isDark={isDark}
            label={scrollUpLabel}
            onClick={scrollTargetIntoView}
          />
        )}
        {showScrollDownHint && scrollHintsEnabled && (
          <ScrollControlsHint
            direction="down"
            side={side}
            isDark={isDark}
            label={scrollDownLabel}
            onClick={scrollTargetIntoView}
          />
        )}
      </div>
    </div>
  )
}

function ScrollControlsHint({
  direction,
  side,
  isDark,
  label,
  onClick,
}: {
  direction: 'up' | 'down'
  side: 'left' | 'right'
  isDark: boolean
  label: string
  onClick: () => void
}) {
  const isUp = direction === 'up'
  const isLeft = side === 'left'
  const accent = isLeft ? '239, 68, 68' : '34, 197, 94'
  const accentClass = isLeft ? 'text-red-500' : 'text-emerald-500'
  const gradient = isUp
    ? isDark
      ? `linear-gradient(to bottom, rgba(${accent}, 0.22) 0%, rgba(40, 44, 52, 0.82) 28%, rgba(40, 44, 52, 0.48) 58%, transparent 100%)`
      : `linear-gradient(to bottom, rgba(${accent}, 0.14) 0%, rgba(255, 255, 255, 0.92) 28%, rgba(250, 250, 250, 0.55) 58%, transparent 100%)`
    : isDark
      ? `linear-gradient(to top, rgba(${accent}, 0.22) 0%, rgba(40, 44, 52, 0.82) 28%, rgba(40, 44, 52, 0.48) 58%, transparent 100%)`
      : `linear-gradient(to top, rgba(${accent}, 0.14) 0%, rgba(255, 255, 255, 0.92) 28%, rgba(250, 250, 250, 0.55) 58%, transparent 100%)`

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute inset-x-0 z-50 w-full border-0 bg-transparent p-0',
        'cursor-pointer transition-all hover:brightness-110',
        isUp ? 'top-0' : 'bottom-0',
      )}
    >
      <div
        className={cn('w-full px-3', isUp ? 'pb-10 pt-2' : 'pt-10 pb-2')}
        style={{ background: gradient }}
      >
        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground/85 drop-shadow-sm">
          {isUp ? (
            <>
              <ChevronUp className={cn('h-4 w-4 shrink-0 animate-bounce', accentClass)} />
              {label}
            </>
          ) : (
            <>
              <ChevronDown className={cn('h-4 w-4 shrink-0 animate-bounce', accentClass)} />
              {label}
            </>
          )}
        </p>
      </div>
    </button>
  )
}
