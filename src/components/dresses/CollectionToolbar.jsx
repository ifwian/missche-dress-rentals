import { Search } from 'lucide-react'
import DateField from '@/components/availability/DateField'
import SyncedInput from '@/components/shared/SyncedInput'
import { fieldClass } from '@/components/ui/input'
import { SORT_OPTIONS } from '@/lib/catalog'
import { cn } from '@/lib/utils'

export default function CollectionToolbar({ filters, date, categories, onlyAvailable, onChange }) {
  return (
    <div className="mb-8 space-y-5">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label htmlFor="search" className="mb-1.5 block text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-3.5 size-4 text-muted" aria-hidden="true" />
            <SyncedInput id="search" type="search" placeholder="Name, code or colour" className="pl-11"
              value={filters.query} onChange={(e) => onChange('q', e.target.value)} />
          </div>
        </div>
        <DateField id="date" label="Rental date" value={date} onChange={(value) => onChange('date', value)} />
        <div>
          <label htmlFor="sort" className="mb-1.5 block text-sm font-medium">Sort by</label>
          <select id="sort" className={cn(fieldClass)} value={filters.sort} onChange={(e) => onChange('sort', e.target.value)}>
            {SORT_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>
      <label className="flex min-h-11 w-fit items-center gap-3 text-sm">
        <input type="checkbox" className="size-5 accent-rose" checked={onlyAvailable} onChange={(e) => onChange('available', e.target.checked ? '1' : '')} />
        Show only dresses available on the rental date
      </label>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {['', ...categories].map((category) => {
          const active = filters.category === category
          return (
            <button key={category || 'all'} type="button" aria-pressed={active} onClick={() => onChange('category', category)}
              className={cn('min-h-10 rounded-none border px-5 text-xs uppercase tracking-[0.14em] transition-colors',
                active ? 'border-rose bg-rose text-ivory' : 'border-rose-dusty hover:bg-blush')}>
              {category || 'All'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
