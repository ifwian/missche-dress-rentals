import { cn } from '@/lib/utils'

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center bg-ivory/95 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-rose-deep', className)}
      {...props}
    />
  )
}
