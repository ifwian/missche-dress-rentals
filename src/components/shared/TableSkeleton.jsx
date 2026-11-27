import { Skeleton } from '@/components/ui/skeleton'

export default function TableSkeleton({ rows = 5 }) {
  return (
    <div role="status" aria-label="Loading" className="divide-y divide-charcoal/10 border border-charcoal/10 bg-white">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-4"><Skeleton className="h-16 w-12 shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-2/3" /></div></div>
      ))}
    </div>
  )
}
