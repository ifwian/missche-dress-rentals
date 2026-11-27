// SAMPLE periods, placed relative to today so the demo stays meaningful.
// Once anything is changed on the Manage dates page, fixed dates are saved in the browser.
import { addDays, todayISO } from '@/lib/dates'

const period = (n, dressId, type, from, to) => ({
  id: `sample-period-${n}`, dressId, type, start: addDays(todayISO(), from), end: addDays(todayISO(), to),
})

export const samplePeriods = [
  period(1, 'sample-02', 'reserved', 0, 2),
  period(2, 'sample-04', 'blocked', 0, 6),
  period(3, 'sample-01', 'reserved', 5, 7),
  period(4, 'sample-03', 'reserved', 10, 12),
]
