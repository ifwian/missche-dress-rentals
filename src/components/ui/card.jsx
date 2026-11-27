import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return <div className={cn('rounded-card bg-white shadow-soft', className)} {...props} />
}
