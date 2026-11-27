import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import StateMessage from '@/components/shared/StateMessage'
import { Button } from '@/components/ui/button'
import { HAS_BACKEND } from '@/lib/backend'
import { useAuth } from '@/lib/auth'

/** Wraps every /admin page. Real protection is the database's Row Level Security; this shows the right screen. */
export default function RequireAdmin() {
  const { status, isAdmin, signOut } = useAuth()
  const location = useLocation()

  if (!HAS_BACKEND) {
    // Local demo (no Supabase keys): allowed while developing, never in a published build.
    if (import.meta.env.DEV) return <Outlet />
    return (
      <main className="container-page py-20">
        <StateMessage title="The owner area is not set up yet" message="Supabase has not been configured for this site, so owner login is switched off." />
        <Button asChild className="mt-6"><Link to="/">Back to the website</Link></Button>
      </main>
    )
  }

  if (status === 'loading') return <p role="status" className="container-page py-20 text-muted">Checking your sign-in…</p>
  if (status === 'signed-out') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (!isAdmin) {
    return (
      <main className="container-page py-20">
        <StateMessage title="This account is not an owner account" message="You are signed in, but this account has not been given access to the owner area." />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={signOut}>Sign out</Button>
          <Button asChild variant="outline"><Link to="/">Back to the website</Link></Button>
        </div>
      </main>
    )
  }
  return <Outlet />
}
