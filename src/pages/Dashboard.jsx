import { useState } from 'react'
import { Link } from 'react-router-dom'
import AsyncContent from '@/components/shared/AsyncContent'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { availabilityService, getStatus } from '@/services/availabilityService'
import { dressService } from '@/services/dressService'
import { inquiryService } from '@/services/inquiryService'
import { HAS_BACKEND } from '@/lib/backend'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatDate, todayISO } from '@/lib/dates'

const load = () => Promise.all([dressService.listAll(), availabilityService.list(), inquiryService.list()])

function Stat({ label, value, to }) {
  return (
    <Link to={to} className="block border border-charcoal/10 bg-white p-4 hover:bg-blush/50">
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold">{value}</dd>
    </Link>
  )
}

function Overview({ all, periods, inquiries, onReset }) {
  const today = todayISO()
  const active = all.filter((d) => !d.archived)
  const count = (s) => active.filter((d) => getStatus(periods, d.id, today) === s).length
  const needReply = inquiries.filter((i) => ['pending_review', 'awaiting_owner'].includes(i.status))
  const payment = inquiries.filter((i) => i.status === 'awaiting_payment')
  const returns = inquiries.filter((i) => i.status === 'confirmed' && i.return_date <= today)
  const tasks = [
    HAS_BACKEND && needReply.length > 0 && [`${needReply.length} inquiry${needReply.length > 1 ? 'ies' : ''} need your reply`, '/admin/inquiries'],
    HAS_BACKEND && payment.length > 0 && [`${payment.length} waiting for payment`, '/admin/inquiries'],
    HAS_BACKEND && returns.length > 0 && [`${returns.length} dress${returns.length > 1 ? 'es' : ''} due back (return date today or earlier)`, '/admin/bookings'],
  ].filter(Boolean)

  return (
    <>
      <section aria-labelledby="todo" className="border border-charcoal/10 bg-white p-5">
        <h2 id="todo" className="text-2xl">What needs doing</h2>
        {tasks.length === 0 ? <p className="mt-2 text-muted">{HAS_BACKEND ? 'Nothing needs attention right now.' : 'Inquiry tasks appear here once the database is connected.'}</p> : (
          <ul className="mt-3 divide-y divide-charcoal/10">{tasks.map(([text, to]) => <li key={text}><Link to={to} className="flex min-h-11 items-center justify-between gap-3 py-2 hover:underline"><span>{text}</span><span aria-hidden="true">→</span></Link></li>)}</ul>
        )}
      </section>
      <p className="mb-2 mt-8 text-sm text-muted">Dresses today, {formatDate(today)}</p>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Active dresses" value={active.length} to="/admin/dresses" />
        <Stat label="Available" value={count('available')} to="/admin/dresses" />
        <Stat label="Reserved" value={count('reserved')} to="/admin/availability" />
        <Stat label="Unavailable" value={count('unavailable')} to="/admin/availability" />
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild><Link to="/admin/dresses/new">Add dress</Link></Button>
        <Button asChild variant="outline"><Link to="/admin/availability">Manage dates</Link></Button>
        {!HAS_BACKEND && <Button variant="outline" onClick={onReset}>Reset demo data</Button>}
      </div>
    </>
  )
}

export default function Dashboard() {
  useDocumentTitle('Overview')
  const state = useAsync(load)
  const toast = useToast()
  const [ask, setAsk] = useState(false)
  const [busy, setBusy] = useState(false)

  async function reset() {
    setBusy(true)
    try {
      await Promise.all([dressService.reset(), availabilityService.reset()])
      toast.success('Demo data reset.')
      setAsk(false)
      state.retry()
    } catch (problem) {
      toast.error(problem.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Overview" description="Today at a glance." />
      <AsyncContent {...state}>{([all, periods, inquiries]) => <Overview all={all} periods={periods} inquiries={inquiries} onReset={() => setAsk(true)} />}</AsyncContent>
      <ConfirmDialog open={ask} busy={busy} onClose={() => setAsk(false)} onConfirm={reset} title="Reset demo data?" confirmLabel="Reset"
        message="This deletes all dresses, photos and dates saved in this browser and restores the samples." />
    </>
  )
}
