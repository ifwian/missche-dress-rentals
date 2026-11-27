// Single source of truth for business details. Only add facts the owner has supplied.
const configuredEmail = (import.meta.env.VITE_OWNER_EMAIL ?? '').trim()

/** Empty string when not configured (or not shaped like an email address). */
export const OWNER_EMAIL = /^[^\s@?&]+@[^\s@?&]+\.[^\s@?&]+$/.test(configuredEmail) ? configuredEmail : ''

const configuredTiktok = (import.meta.env.VITE_TIKTOK_URL ?? '').trim()
/** Empty until the owner supplies a verified TikTok profile URL (set VITE_TIKTOK_URL). */
export const TIKTOK_URL = /^https:\/\/(www\.)?tiktok\.com\//.test(configuredTiktok) ? configuredTiktok : ''

export const BUSINESS = {
  name: 'Missche Dress Rentals',
  shortName: 'Missche',
  location: 'Brgy. Bañadero, Calamba, Laguna, Philippines',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61592192577429',
  priceRange: { min: 399, max: 899 },
  occasions: ['Wedding Guest', 'Birthday', 'Graduation', 'Photoshoot', 'Formal Events', 'Special Occasions'],
  services: ['Mini fitting studio', 'Lalamove delivery available', 'Customer inquiries through email'],
  // Real photographs only. Add files to public/images/campaign/ and list them here (see the README there).
  campaignImages: [],
  editorialImage: '',
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Collection' },
  { to: '/inquiries', label: 'Inquiries' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/signin', label: 'Sign in' },
]

export const POLICY_LINKS = [
  { to: '/faqs', label: 'FAQs' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/contact', label: 'Contact' },
]
