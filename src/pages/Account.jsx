import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/backend'
import { useAuth } from '@/lib/auth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const STATUS = {
  pending_review: 'Pending Review', awaiting_owner: 'Awaiting Owner Response', awaiting_payment: 'Awaiting Payment',
  confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled',
}

export default function Account() {
  useDocumentTitle('My account')
  const { status, session, signOut } = useAuth()
  const [state, setState] = useState({ loading: true, error: '', rows: [] })

  useEffect(() => {
    if (status !== 'signed-in') return
    let active = true
    supabase.from('inquiries').select('id, dress_code, dress_name, pickup_date, event_date, return_date, status, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => active && setState({ loading: false, error: error ? 'Could not load your inquiries. Try again.' : '', rows: data ?? [] }))
    return () => { active = false }
  }, [status])

  if (status === 'loading') return <main className="container-page py-16"><Skeleton className="h-10 w-64" /></main>
  if (status !== 'signed-in') return <Navigate to="/signin" replace />

  return (
    <main className="container-page py-16">
      <h1 className="text-4xl">My account</h1>
      <p className="mt-2 text-muted">Signed in as {session.user.email}</p>
      <h2 className="mt-10 text-2xl">My inquiries</h2>
      <div className="mt-4 max-w-2xl divide-y divide-charcoal/10 border-y border-charcoal/10" aria-busy={state.loading}>
        {state.loading && [0, 1, 2].map((i) => <div key={i} className="space-y-2 py-4"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-72" /></div>)}
        {!state.loading && state.error && <p role="alert" className="py-4 text-red-700">{state.error}</p>}
        {!state.loading && !state.error && state.rows.length === 0 && (
          <p className="py-6 text-muted">No inquiries yet. <Link to="/collection" className="underline underline-offset-4">Browse the collection</Link> to send one.</p>
        )}
        {state.rows.map((row) => (
          <article key={row.id} className="py-4">
            <h3 className="font-semibold">{row.dress_name} <span className="font-normal text-muted">({row.dress_code})</span></h3>
            <p className="text-sm">Status: <strong>{STATUS[row.status] ?? row.status}</strong></p>
            <p className="text-sm text-muted">Pickup {row.pickup_date} · Event {row.event_date} · Return {row.return_date}</p>
          </article>
        ))}
      </div>
      <Button variant="outline" className="mt-10" onClick={signOut}>Sign out</Button>
    </main>
  )
}
