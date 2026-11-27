import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { CalendarDays, CalendarCheck, ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, Settings, Shirt, Tags, X } from 'lucide-react'
import { BUSINESS } from '@/config/business'
import { HAS_BACKEND } from '@/lib/backend'
import { useAuth } from '@/lib/auth'
import { ToastProvider } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/dresses', label: 'Dress Inventory', icon: Shirt },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/availability', label: 'Availability', icon: CalendarDays },
  { to: '/admin/inquiries', label: 'Customer Inquiries', icon: Inbox },
  { to: '/admin/bookings', label: 'Confirmed Bookings', icon: CalendarCheck },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

function Sidebar({ onNavigate }) {
  return (
    <nav aria-label="Dashboard" className="flex h-full flex-col">
      <div className="px-5 py-6">
        <p className="font-display text-2xl italic">{BUSINESS.shortName}</p>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-muted">Owner dashboard</p>
      </div>
      <ul className="flex-1 space-y-0.5 px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} onClick={onNavigate}
              className={({ isActive }) => cn('flex min-h-11 items-center gap-3 px-3 text-sm transition-colors', isActive ? 'bg-charcoal font-semibold text-ivory' : 'text-charcoal hover:bg-blush')}>
              <Icon className="size-4 shrink-0" aria-hidden="true" />{label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="border-t border-charcoal/10 p-3">
        <Link to="/" className="flex min-h-11 items-center gap-3 px-3 text-sm text-muted hover:bg-blush"><ExternalLink className="size-4" aria-hidden="true" />View website</Link>
      </div>
    </nav>
  )
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const { signOut, session } = useAuth()
  const [open, setOpen] = useState(false)
  const current = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))

  useEffect(() => { window.scrollTo(0, 0); setOpen(false) }, [pathname])
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'; meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f3f1ed] lg:grid lg:grid-cols-[16rem_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-charcoal/10 bg-white lg:block"><Sidebar /></aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-charcoal/50" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-lift">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-1 top-1 grid size-11 place-items-center"><X className="size-5" aria-hidden="true" /></button>
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-charcoal/10 bg-white px-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="-ml-2 grid size-11 place-items-center lg:hidden"><Menu className="size-5" aria-hidden="true" /></button>
              <nav aria-label="Breadcrumb" className="truncate text-sm text-muted">
                <Link to="/admin" className="hover:underline">Admin</Link>{current && !current.end && <> <span aria-hidden="true">/</span> <span className="font-medium text-charcoal">{current.label}</span></>}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {HAS_BACKEND && session && <span className="hidden max-w-48 truncate text-sm text-muted sm:block" title={session.user.email}>{session.user.email}</span>}
              {HAS_BACKEND && session && <button type="button" onClick={signOut} className="inline-flex min-h-11 items-center gap-2 border border-charcoal/20 px-3 text-sm hover:bg-blush"><LogOut className="size-4" aria-hidden="true" />Sign out</button>}
            </div>
          </header>
          <main className="px-4 py-8 sm:px-8">
            {!HAS_BACKEND && (
              <p role="note" className="mb-6 border-l-2 border-charcoal bg-white p-4 text-sm">
                <strong>Local demo.</strong> No database is connected: no login, and changes are saved only in this browser. Inquiries and bookings need Supabase.
              </p>
            )}
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
