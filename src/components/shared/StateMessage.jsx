import { Button } from '@/components/ui/button'

export default function StateMessage({ title, message, actionLabel, onAction, role = 'status' }) {
  return (
    <div role={role} className="rounded-card border border-dashed border-rose-dusty px-6 py-14 text-center">
      <h3 className="text-2xl">{title}</h3>
      {message && <p className="mt-2 text-muted">{message}</p>}
      {onAction && <Button className="mt-6" onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}
