import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '@/config/business'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import Logo from './Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const { status } = useAuth()
  const links = NAV_LINKS.map((l) => (l.to === '/signin' && status === 'signed-in' ? { to: '/account', label: 'Account' } : l))

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-rose-dusty/70 bg-ivory/95 backdrop-blur">
      <nav aria-label="Main" className="container-page">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Logo />
          <ul className="hidden items-center gap-10 md:flex">
            {links.filter((link) => link.to !== '/').map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) =>
                  cn('block border-b border-transparent py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] hover:text-rose', isActive && 'border-charcoal')}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button type="button" className="-mr-2 flex h-11 items-center gap-3 px-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] md:hidden"
            aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
            {open ? 'Close' : 'Menu'}
            <span aria-hidden="true" className="relative block h-2.5 w-5">
              <span className={cn('absolute left-0 h-px w-5 bg-charcoal transition-all', open ? 'top-1 rotate-45' : 'top-0')} />
              <span className={cn('absolute left-0 h-px w-5 bg-charcoal transition-all', open ? 'top-1 -rotate-45' : 'top-2.5')} />
            </span>
          </button>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div id="mobile-menu" className="overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: 'easeOut' }}>
              <ul className="pb-5 pt-1">
                {links.map(({ to, label }) => (
                  <li key={to} className="border-t border-rose-dusty/60">
                    <NavLink to={to} end={to === '/'} className={({ isActive }) =>
                      cn('flex min-h-14 items-center font-display text-3xl', isActive && 'italic text-rose')}>
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
