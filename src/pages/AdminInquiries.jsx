import { useMemo, useState } from 'react'
import AsyncContent from '@/components/shared/AsyncContent'
import PageHeader from '@/components/shared/PageHeader'
import StateMessage from '@/components/shared/StateMessage'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, Dialog } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { availabilityService } from '@/services/availabilityService'
import { INQUIRY_STATUS, inquiryService } from '@/services/inquiryService'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatDate } from '@/lib/dates'

const FITTING = { fitting: 'Wants a fitting (₱100)', none: 'No fitting', undecided: 'Not sure yet' }
const FILTERS = [['open', 'Needs action'], ['confirmed', 'Confirmed'], ['all', 'All']]
const isOpen = (s) => ['pending_review', 'awaiting_owner', 'awaiting_payment'].includes(s)

export function InquiryTable({ initial, mode }) {
  const toast = useToast()
  const [rows, setRows] = useState(initial)
  const [filter, setFilter] = useState(mode === 'bookings' ? 'confirmed' : 'open')
  const [view, setView] = useState(null)
  const [confirm, setConfirm] = useState(null) // { row, status }
  const [busy, setBusy] = useState(false)

  const shown = useMemo(() => rows.filter((r) => mode === 'bookings' ? ['confirmed', 'completed'].includes(r.status)
    : filter === 'all' || (filter === 'open' ? isOpen(r.status) : r.status === filter)), [rows, filter, mode])

  async function apply() {
    const { row, status } = confirm
    setBusy(true)
    try {
      if (status === 'confirmed' && row.dress_id) {
        await availabilityService.addPeriod({ dressId: row.dress_id, type: 'reserved', start: row.pickup_date, end: row.return_date })
      }
      await inquiryService.setStatus(row.id, status)
      setRows(await inquiryService.list())
      toast.success(`${row.dress_code} marked ${INQUIRY_STATUS[status]}.`)
      setConfirm(null); setView(null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy(false)
    }
  }

  const actions = (r) => ({
    pending_review: [['awaiting_payment', 'Approve, ask for payment'], ['cancelled', 'Cancel']],
    awaiting_owner: [['awaiting_payment', 'Approve, ask for payment'], ['cancelled', 'Cancel']],
    awaiting_payment: [['confirmed', 'Payment received, confirm'], ['cancelled', 'Cancel']],
    confirmed: [['completed', 'Mark returned / completed'], ['cancelled', 'Cancel']],
  }[r.status] ?? [])

  return (
    <>
      {mode !== 'bookings' && (
        <div role="group" aria-label="Filter inquiries" className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map(([v, label]) => <Button key={v} variant={filter === v ? 'default' : 'outline'} aria-pressed={filter === v} onClick={() => setFilter(v)}>{label}</Button>)}
        </div>
      )}
      {shown.length === 0 ? <StateMessage title={mode === 'bookings' ? 'No confirmed bookings yet' : 'No inquiries here'} message="They appear here when customers send inquiries while signed in." /> : (
        <div className="overflow-x-auto border border-charcoal/10 bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">{mode === 'bookings' ? 'Confirmed bookings' : 'Customer inquiries'}</caption>
            <thead className="border-b border-charcoal/10 bg-blush/60 text-xs uppercase tracking-wider text-muted">
              <tr><th scope="col" className="p-3">Customer</th><th scope="col" className="p-3">Dress</th><th scope="col" className="hidden p-3 md:table-cell">Pickup → Return</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3 text-right">Details</th></tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {shown.map((r) => (
                <tr key={r.id}>
                  <td className="p-3"><p className="font-medium">{r.customer_name}</p><p className="break-all text-xs text-muted">{r.customer_email}</p></td>
                  <td className="p-3">{r.dress_name} <span className="text-muted">({r.dress_code})</span></td>
                  <td className="hidden p-3 md:table-cell">{formatDate(r.pickup_date)} → {formatDate(r.return_date)}</td>
                  <td className="p-3 font-medium">{INQUIRY_STATUS[r.status]}</td>
                  <td className="p-3 text-right"><Button variant="outline" onClick={() => setView(r)} aria-label={`View inquiry from ${r.customer_name}`}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={Boolean(view) && !confirm} onClose={() => setView(null)} title="Inquiry details"
        footer={view && actions(view).map(([status, label]) => <Button key={status} variant={status === 'cancelled' ? 'outline' : 'default'} onClick={() => setConfirm({ row: view, status })}>{label}</Button>)}>
        {view && (
          <dl className="space-y-3 text-sm">
            {[['Name', view.customer_name], ['Email', view.customer_email], view.customer_phone && ['Contact number', view.customer_phone],
              ['Dress', `${view.dress_name} (${view.dress_code})`], ['Pickup (Day 1)', formatDate(view.pickup_date)], ['Event (Day 2)', formatDate(view.event_date)],
              ['Return (Day 3)', formatDate(view.return_date)], ['Fitting', FITTING[view.fitting]], view.message && ['Message', view.message], ['Status', INQUIRY_STATUS[view.status]]]
              .filter(Boolean).map(([t, v]) => <div key={t}><dt className="text-xs uppercase tracking-wider text-muted">{t}</dt><dd className="whitespace-pre-line break-words">{v}</dd></div>)}
          </dl>
        )}
      </Dialog>
      <ConfirmDialog open={Boolean(confirm)} busy={busy} onClose={() => setConfirm(null)} onConfirm={apply}
        title={confirm ? `Change status to ${INQUIRY_STATUS[confirm.status]}?` : ''} confirmLabel="Yes, change"
        message={confirm?.status === 'confirmed' ? 'Only confirm after FULL payment has been received. The dress will be marked Reserved for pickup to return dates.' : confirm?.status === 'cancelled' ? 'The customer will see this inquiry as Cancelled.' : 'The customer will see the new status in their account.'} />
    </>
  )
}

export default function AdminInquiries() {
  useDocumentTitle('Customer inquiries')
  const state = useAsync(inquiryService.list)
  return (
    <>
      <PageHeader title="Customer Inquiries" description="An inquiry is not a booking. Confirm only after full payment is received." />
      <AsyncContent {...state}>{(rows) => <InquiryTable initial={rows} mode="inquiries" />}</AsyncContent>
    </>
  )
}
