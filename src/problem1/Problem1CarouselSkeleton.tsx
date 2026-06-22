import { Skeleton } from '@/components/ui/skeleton'

export default function Problem1CarouselSkeleton() {
  return (
    <div className="max-w-full max-md:overflow-x-hidden">
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 border-b border-border/40">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-full max-w-sm" />
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 bg-muted/30">
              <Skeleton className="h-3 w-3 rounded-full shrink-0" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[92%]" />
              <Skeleton className="h-3 w-[85%]" />
              <Skeleton className="h-3 w-[78%]" />
              <Skeleton className="h-3 w-[88%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3 mt-1 sm:mt-2">
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-2 w-6 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      </div>
    </div>
  )
}
