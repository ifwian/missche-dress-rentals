import { Mail } from 'lucide-react'
import { BUSINESS, OWNER_EMAIL, TIKTOK_URL } from '@/config/business'
import Logo from './Logo'

// Brand icons are inline SVG (Lucide has no TikTok icon). Decorative: the link carries the label.
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.9c-.3 0-1.3-.2-2.4-.2-2.5 0-4.1 1.5-4.1 4.2v2.6H7.6v3.3h2.8V22h3.1z" /></svg>
)
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.3 2.4 1.7 3.9 4 4v3.1c-1.5.1-2.9-.4-4-1.1v6.2c0 3.9-3.3 6.3-6.6 5.6-2.7-.6-4.5-3.1-4.1-5.9.4-2.9 3-4.8 5.9-4.4v3.2c-1.5-.4-3 .6-3 2.2 0 1.4 1.2 2.4 2.5 2.2 1.1-.2 1.8-1 1.8-2.2V3h3.500z" /></svg>
)

const iconLink = 'inline-flex size-11 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-page flex flex-col items-center gap-6 py-14 text-center">
        <Logo light />
        <p className="font-display text-2xl italic text-rose-dusty">Rent It • Wear It • Slay It</p>
        <p className="max-w-md text-sm text-ivory/75">Vietnam and Bangkok long dresses for rent in Calamba, Laguna. Mini fitting studio and Lalamove delivery available.</p>
        <ul className="flex items-center gap-3" aria-label="Social media and contact">
          <li>
            <a href={BUSINESS.facebookUrl} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="Missche Dress Rentals on Facebook (opens in a new tab)" title="Facebook"><FacebookIcon /></a>
          </li>
          {TIKTOK_URL && (
            <li>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="Missche Dress Rentals on TikTok (opens in a new tab)" title="TikTok"><TiktokIcon /></a>
            </li>
          )}
          {OWNER_EMAIL && (
            <li>
              <a href={`mailto:${OWNER_EMAIL}`} className={iconLink} aria-label="Email Missche Dress Rentals" title="Email"><Mail className="size-5" aria-hidden="true" /></a>
            </li>
          )}
        </ul>
      </div>
      <p className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/60">© {new Date().getFullYear()} {BUSINESS.name}</p>
    </footer>
  )
}
