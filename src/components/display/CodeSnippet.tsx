import { useTheme } from 'next-themes'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'

interface CodeSnippetProps {
  code: string
  language?: string
  filename?: string
  highlightLines?: number[]
  compact?: boolean
}

const BG = { dark: '#282c34', light: '#fafafa' } as const

export default function CodeSnippet({
  code,
  language = 'javascript',
  filename,
  highlightLines = [],
  compact = false,
}: CodeSnippetProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const bg = isDark ? BG.dark : BG.light
  const highlightSet = new Set(highlightLines)
  const highlightBg = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(14, 165, 233, 0.14)'

  return (
    <div className="rounded-xl overflow-hidden border border-border w-full min-w-0 max-w-full">
      {filename && (
        <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-muted/50 border-b border-border min-w-0">
          <span className="text-xs font-mono text-muted-foreground truncate">{filename}</span>
        </div>
      )}
      <div className={cn('max-w-full min-w-0', compact ? 'overflow-hidden' : 'overflow-x-auto code-snippet-body')}>
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          wrapLines
          wrapLongLines={compact}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: compact ? '0.68rem' : '0.78rem',
            lineHeight: '1.55',
            padding: compact ? '0.625rem' : '0.875rem',
            background: bg,
            maxWidth: '100%',
            overflow: 'hidden',
          }}
          codeTagProps={{
            style: {
              background: 'none',
              whiteSpace: compact ? 'pre-wrap' : 'pre',
              wordBreak: compact ? 'break-word' : 'normal',
            },
          }}
          lineProps={(lineNumber) => ({
            style: {
              display: 'block',
              background: highlightSet.has(lineNumber) ? highlightBg : 'none',
              padding: highlightSet.has(lineNumber) ? '0 0.25rem' : undefined,
              borderRadius: highlightSet.has(lineNumber) ? '0.125rem' : undefined,
            },
          })}
          showLineNumbers={!compact}
          lineNumberStyle={{ opacity: 0.3, fontSize: '0.68rem', background: 'none', minWidth: '2em' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
