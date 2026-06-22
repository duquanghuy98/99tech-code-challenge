import { Skeleton } from '@/components/ui/skeleton'

function ExchangeLegCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 p-4 min-h-[156px] flex flex-col">
      <Skeleton className="h-3 w-16 mb-3 shrink-0" />
      <div className="flex items-start gap-3 flex-1">
        <Skeleton className="h-10 w-[120px] rounded-lg shrink-0" />
        <Skeleton className="h-10 flex-1 min-w-0 rounded-lg" />
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 shrink-0">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-20 rounded shrink-0 max-w-[45%]" />
      </div>
    </div>
  )
}

export default function SwapFormSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Skeleton className="h-11 w-full rounded-2xl" />
      <div className="flex flex-col lg:flex-row gap-4 lg:items-stretch">
        <div className="w-full lg:flex-1 min-w-0 rounded-2xl border border-border/50 overflow-hidden">
          <Skeleton className="h-14 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <ExchangeLegCardSkeleton />
            <div className="flex justify-center -my-1">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            </div>
            <ExchangeLegCardSkeleton />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
        <div className="w-full lg:w-[minmax(260px,340px)] lg:max-w-[340px] shrink-0 min-h-[320px] lg:min-h-0 flex self-stretch">
          <div className="rounded-2xl border border-border/50 flex-1 w-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <Skeleton className="h-4 w-4 rounded shrink-0" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="p-3 space-y-1.5 flex-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-transparent p-2.5"
                >
                  <Skeleton className="h-4 w-5 shrink-0" />
                  <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-2.5 w-14" />
                  </div>
                  <Skeleton className="h-4 w-16 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
