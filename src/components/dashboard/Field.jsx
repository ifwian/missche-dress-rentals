import { Input } from '@/components/ui/input'

export default function Field({ id, label, error, hint, as: Control = Input, ...props }) {
  const note = error || hint
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <Control id={id} aria-invalid={Boolean(error)} aria-describedby={note ? `${id}-note` : undefined} {...props} />
      {note && <p id={`${id}-note`} className={`mt-1.5 text-xs ${error ? 'text-red-700' : 'text-muted'}`}>{note}</p>}
    </div>
  )
}
