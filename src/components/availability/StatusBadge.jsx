import { cn } from '@/lib/utils'

const STATUS = {
  available: { label: 'Available', dot: 'bg-emerald-600' },
  reserved: { label: 'Reserved', dot: 'bg-amber-500' },
  unavailable: { label: 'Unavailable', dot: 'bg-stone-500' },
}

export default function StatusBadge({ status, className }) {
  const { label, dot } = STATUS[status]
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm', className)}>
      <span className={cn('size-2 rounded-full', dot)} aria-hidden="true" />
      {label}
    </span>
  )
}
