// Dates are "YYYY-MM-DD" strings, so they compare correctly and never shift between time zones.
const manila = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
})

/** Today at the shop (Philippine time). */
export const todayISO = () => manila.format(new Date())

export function addDays(iso, days) {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export const formatDate = (iso) =>
  new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`))

/** The requested date if it is a real date from today onward, otherwise today. */
export function pickDate(value) {
  const today = todayISO()
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(value ?? '') && !Number.isNaN(Date.parse(value)) && addDays(value, 0) === value
  return valid && value >= today ? value : today
}

/** "2026-11" -> the first day of the month shifted by `months`, as "YYYY-MM". */
export function shiftMonth(month, months) {
  const date = new Date(`${month}-01T00:00:00Z`)
  date.setUTCMonth(date.getUTCMonth() + months)
  return date.toISOString().slice(0, 7)
}

export const formatMonth = (month) =>
  new Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T00:00:00Z`))

/** Leading blanks (null) followed by every date of the month, weeks starting Sunday. */
export function monthCells(month) {
  const first = `${month}-01`
  const blanks = new Date(`${first}T00:00:00Z`).getUTCDay()
  const cells = Array(blanks).fill(null)
  for (let day = first; day.startsWith(month); day = addDays(day, 1)) cells.push(day)
  return cells
}
