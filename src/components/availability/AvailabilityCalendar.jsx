import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate, formatMonth, monthCells, shiftMonth, todayISO } from '@/lib/dates'
import { cn } from '@/lib/utils'

const STYLES = {
  available: { label: 'Available', cell: 'bg-white border-rose-dusty/70 hover:bg-blush', mark: '' },
  reserved: { label: 'Reserved', cell: 'bg-amber-100 border-amber-400 hover:bg-amber-200', mark: '•' },
  unavailable: { label: 'Unavailable', cell: 'bg-stone-200 border-stone-300 text-stone-600 line-through hover:bg-stone-300', mark: '' },
}
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const STEPS = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }

/** Month view. `statusFor(date)` colours each day; `start`/`end` outline the selection. */
export default function AvailabilityCalendar({ statusFor, start, end = start, onSelect }) {
  const today = todayISO()
  const [month, setMonth] = useState((start ?? today).slice(0, 7))

  function moveFocus(event) {
    const step = STEPS[event.key]
    if (!step) return
    const days = [...event.currentTarget.querySelectorAll('button')]
    const next = days[days.indexOf(event.target) + step]
    if (next && !next.disabled) {
      event.preventDefault()
      next.focus()
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Button variant="outline" size="icon" aria-label="Previous month" disabled={month <= today.slice(0, 7)}
          onClick={() => setMonth(shiftMonth(month, -1))}><ChevronLeft /></Button>
        <p className="font-display text-xl font-semibold" aria-live="polite">{formatMonth(month)}</p>
        <Button variant="outline" size="icon" aria-label="Next month" onClick={() => setMonth(shiftMonth(month, 1))}><ChevronRight /></Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted" aria-hidden="true">
        {WEEKDAYS.map((day) => <span key={day} className="py-1">{day}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1" role="group" aria-label={`Dates in ${formatMonth(month)}`} onKeyDown={moveFocus}>
        {monthCells(month).map((date, index) => {
          if (!date) return <span key={`blank-${index}`} />
          const past = date < today
          const status = STYLES[statusFor(date)]
          const selected = Boolean(start) && date >= start && date <= end
          return (
            <button key={date} type="button" data-date={date} disabled={past} aria-pressed={selected}
              aria-current={date === today ? 'date' : undefined}
              aria-label={past ? `${formatDate(date)}, past` : `${formatDate(date)}, ${status.label}`}
              onClick={() => onSelect(date)}
              className={cn('relative aspect-square min-w-0 rounded-lg border text-sm',
                past ? 'cursor-not-allowed border-transparent text-stone-400' : status.cell,
                date === today && 'font-semibold underline',
                selected && 'z-10 ring-2 ring-rose-deep ring-offset-1')}>
              {Number(date.slice(8))}
              {!past && status.mark && <span className="absolute inset-x-0 bottom-0 text-base leading-3" aria-hidden="true">{status.mark}</span>}
            </button>
          )
        })}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs" aria-label="Legend">
        {Object.entries(STYLES).map(([key, { label, cell, mark }]) => (
          <li key={key} className="flex items-center gap-2">
            <span className={cn('grid size-5 place-items-center rounded border', cell)} aria-hidden="true">{mark || '1'}</span>{label}
          </li>
        ))}
      </ul>
    </div>
  )
}
