import { cn } from '@/lib/utils'

interface MiniCodeProps {
  code: string
  variant: 'bug' | 'fix'
}

export default function MiniCode({ code, variant }: MiniCodeProps) {
  return (
    <pre
      className={cn(
        'text-[0.72rem] leading-relaxed rounded-lg px-3 py-2 font-mono whitespace-pre-wrap break-words border',
        variant === 'bug'
          ? 'bg-red-500/8 border-red-500/20 text-red-600 dark:text-red-400'
          : 'bg-emerald-500/8 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
      )}
    >
      {code}
    </pre>
  )
}
