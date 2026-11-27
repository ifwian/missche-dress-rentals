import { Link, useLocation } from 'react-router-dom'
import StatusBadge from '@/components/availability/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import DressImage from './DressImage'

export default function DressCard({ dress, date }) {
  const { pathname, search } = useLocation()
  const to = date ? `/collection/${dress.id}?date=${date}` : `/collection/${dress.id}`
  // Remember the collection's filters so the dress page can link back to them.
  const state = pathname === '/collection' ? { back: search } : undefined
  const [first, second] = dress.images ?? []

  return (
    <article className="group relative h-full">
      <div className="relative aspect-[2/3] overflow-hidden bg-blush">
        <DressImage src={first} alt="" loading="lazy" className="transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        {second && (
          <DressImage src={second} alt="" loading="lazy" aria-hidden="true"
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none" />
        )}
        {dress.isSample && <Badge className="absolute left-3 top-3">Sample</Badge>}
      </div>
      <div className="pt-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">{dress.code}</p>
        <h3 className="mt-1 text-2xl">
          {/* The ::after layer makes the whole card clickable. */}
          <Link to={to} state={state} className="after:absolute after:inset-0">{dress.name}</Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">{formatPrice(dress.price)} <span className="font-normal text-muted">/ rental</span></p>
          {dress.status && <StatusBadge status={dress.status} />}
        </div>
      </div>
    </article>
  )
}
