import SyncedInput from '@/components/shared/SyncedInput'
import { todayISO } from '@/lib/dates'

export default function DateField({ id, label, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <SyncedInput id={id} type="date" min={todayISO()} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
