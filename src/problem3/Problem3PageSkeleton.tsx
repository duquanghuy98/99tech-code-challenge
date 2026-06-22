import { Skeleton } from '@/components/ui/skeleton'

function IssueCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-3 sm:p-4 pl-4 sm:pl-5 border-l-2 border-l-border">
      <div className="flex items-start gap-3">
        <Skeleton className="h-4 w-4 mt-0.5 shrink-0 rounded" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-48 max-w-full" />
            <Skeleton className="h-4 w-14 rounded-full shrink-0" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[90%]" />
        </div>
      </div>
    </div>
  )
}

export default function Problem3PageSkeleton() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="flex gap-1 rounded-lg bg-muted/50 p-1 w-fit">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-28 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <IssueCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
