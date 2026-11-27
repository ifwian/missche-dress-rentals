import { useState } from 'react'
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { fieldClass } from '@/components/ui/input'
import { availabilityService, getStatus } from '@/services/availabilityService'
import { formatDate, todayISO } from '@/lib/dates'

const TYPE_LABELS = { reserved: 'Confirmed rental', blocked: 'Blocked', unavailable: 'Temporarily unavailable' }

const describe = ({ start, end }) => {
  if (end === null) return `From ${formatDate(start)} until restored`
  return start === end ? formatDate(start) : `${formatDate(start)} to ${formatDate(end)}`
}

export default function DateManager({ dresses, initialPeriods }) {
  const [periods, setPeriods] = useState(initialPeriods)
  const [dressId, setDressId] = useState(dresses[0].id)
  const [range, setRange] = useState({ start: null, end: null })
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(false)

  const mine = periods
    .filter((p) => p.dressId === dressId && (p.end === null || p.end >= todayISO()))
    .sort((a, b) => a.start.localeCompare(b.start))
  const paused = mine.some((p) => p.end === null)
  const end = range.end ?? range.start

  // First click picks a start date; a second, later click completes the range.
  function select(date) {
    setNotice(null)
    setRange((r) => (!r.start || r.end || date < r.start ? { start: date, end: null } : { ...r, end: date }))
  }

  async function run(action, success) {
    setBusy(true)
    try {
      setPeriods(await action())
      setRange({ start: null, end: null })
      setNotice({ text: success })
    } catch (error) {
      setNotice({ text: error.message, error: true })
    } finally {
      setBusy(false)
    }
  }

  const add = (type, success) => run(() => availabilityService.addPeriod({ dressId, type, start: range.start, end }), success)

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card className="p-4 sm:p-6">
        <label htmlFor="dress" className="mb-1.5 block text-sm font-medium">Dress</label>
        <select id="dress" className={`${fieldClass} mb-5`} value={dressId}
          onChange={(e) => { setDressId(e.target.value); setRange({ start: null, end: null }); setNotice(null) }}>
          {dresses.map((d) => <option key={d.id} value={d.id}>{d.code}: {d.name}</option>)}
        </select>
        <AvailabilityCalendar key={dressId} statusFor={(d) => getStatus(periods, dressId, d)}
          start={range.start} end={end} onSelect={select} />
      </Card>

      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <h2 className="text-2xl">Selected dates</h2>
          <p className="mt-2 text-muted">
            {range.start
              ? `${describe({ start: range.start, end })}${range.end ? '' : '. Tap a later date to select a range.'}`
              : 'Tap a date on the calendar.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button disabled={!range.start || busy} onClick={() => add('reserved', 'Rental period saved.')}>Mark confirmed rental</Button>
            <Button variant="outline" disabled={!range.start || busy} onClick={() => add('blocked', 'Dates blocked.')}>Block dates</Button>
            <Button variant="outline" disabled={!range.start || busy}
              onClick={() => run(() => availabilityService.restoreRange(dressId, range.start, end), 'Dates are available again.')}>
              Make available
            </Button>
          </div>
          <p aria-live="polite" className={`mt-3 text-sm ${notice?.error ? 'text-red-700' : 'text-emerald-800'}`}>{notice?.text}</p>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="text-2xl">Temporary unavailability</h2>
          <p className="mt-2 text-sm text-muted">
            {paused ? 'This dress is marked unavailable until you restore it.' : 'Use this when a dress is out of service and you do not know for how long.'}
          </p>
          <Button className="mt-4" variant="outline" disabled={busy}
            onClick={() => run(() => (paused ? availabilityService.resume(dressId) : availabilityService.markUnavailable(dressId)),
              paused ? 'Temporary unavailability ended.' : 'Dress marked unavailable.')}>
            {paused ? 'End unavailability' : 'Mark temporarily unavailable'}
          </Button>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="text-2xl">Current and upcoming</h2>
          {mine.length === 0 ? (
            <p className="mt-2 text-muted">No reserved or blocked dates.</p>
          ) : (
            <ul className="mt-3 divide-y divide-rose-dusty/60">
              {mine.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div><p className="font-medium">{TYPE_LABELS[p.type]}</p><p className="text-sm text-muted">{describe(p)}</p></div>
                  <Button variant="outline" disabled={busy} aria-label={`Remove ${TYPE_LABELS[p.type]}, ${describe(p)}`}
                    onClick={() => run(() => availabilityService.removePeriod(p.id), 'Entry removed.')}>Remove</Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Button variant="outline" disabled={busy}
          onClick={() => window.confirm('Discard all saved date changes in this browser?') && run(availabilityService.reset, 'Sample dates restored.')}>
          Reset to sample dates
        </Button>
      </div>
    </div>
  )
}
