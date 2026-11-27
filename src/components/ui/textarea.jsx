import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn('w-full min-w-0 rounded-2xl border border-rose-dusty bg-white px-4 py-3 text-base sm:text-sm', className)}
      {...props}
    />
  )
}
