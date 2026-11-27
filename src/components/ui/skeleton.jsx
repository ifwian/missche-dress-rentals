import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }) {
  return <div aria-hidden="true" className={cn('animate-pulse bg-charcoal/10 motion-reduce:animate-none', className)} {...props} />
}
