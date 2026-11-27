import { Link } from 'react-router-dom'
import { BUSINESS } from '@/config/business'

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex flex-col leading-none" aria-label={`${BUSINESS.name} home`}>
      <span className={`font-display text-[1.75rem] font-semibold uppercase tracking-[0.22em] ${light ? 'text-ivory' : 'text-charcoal'}`}>{BUSINESS.shortName}</span>
      <span className={`mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.42em] ${light ? 'text-ivory/70' : 'text-muted'}`}>Dress Rentals</span>
    </Link>
  )
}
