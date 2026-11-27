import { cn } from '@/lib/utils'

export const fieldClass =
  'h-12 w-full min-w-0 rounded-none border border-rose-dusty bg-white px-4 text-base text-charcoal sm:text-sm'

export function Input({ className, ...props }) {
  return <input className={cn(fieldClass, className)} {...props} />
}
