import { useTheme } from 'next-themes'
import {
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

export function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'light' ? 'light' : 'dark'

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-right"
      expand
      visibleToasts={4}
      closeButton
      duration={4500}
      offset={{ bottom: 20, right: 20 }}
      icons={{
        success: (
          <CircleCheck className="h-5 w-5 shrink-0 text-emerald-500" strokeWidth={2.25} />
        ),
        error: (
          <CircleX className="h-5 w-5 shrink-0 text-red-500" strokeWidth={2.25} />
        ),
        warning: (
          <TriangleAlert className="h-5 w-5 shrink-0 text-amber-500" strokeWidth={2.25} />
        ),
        info: (
          <Info className="h-5 w-5 shrink-0 text-sky-400" strokeWidth={2.25} />
        ),
        loading: (
          <LoaderCircle
            className="h-5 w-5 shrink-0 animate-spin text-violet-400"
            strokeWidth={2.25}
          />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast !items-start gap-3 !rounded-xl !border !border-border/60 !bg-card/95 !p-4 !text-foreground !shadow-xl !shadow-black/25 !backdrop-blur-xl dark:!shadow-black/40',
          title: '!text-sm !font-semibold !leading-snug !tracking-tight',
          description: '!text-sm !text-muted-foreground !mt-1 !leading-relaxed',
          content: '!flex-1 !min-w-0',
          icon: '!mt-0.5 !shrink-0',
          success:
            '!border-l-[3px] !border-l-emerald-500 !shadow-emerald-500/[0.12]',
          error: '!border-l-[3px] !border-l-red-500 !shadow-red-500/[0.12]',
          warning: '!border-l-[3px] !border-l-amber-500 !shadow-amber-500/[0.1]',
          info: '!border-l-[3px] !border-l-sky-500 !shadow-sky-500/[0.1]',
          actionButton:
            '!rounded-lg !bg-primary !px-3 !py-1.5 !text-xs !font-medium !text-primary-foreground !transition-colors hover:!bg-primary/90',
          cancelButton:
            '!rounded-lg !bg-muted !px-3 !py-1.5 !text-xs !font-medium !text-muted-foreground',
          closeButton:
            '!left-auto !right-0 !top-0 !translate-x-[35%] !translate-y-[-35%] !rounded-full !border !border-border/70 !bg-background/90 !text-muted-foreground !shadow-sm !transition-colors hover:!bg-muted hover:!text-foreground',
        },
      }}
      {...props}
    />
  )
}

export { toast } from 'sonner'
