// Per-dress, date-based availability. Persistence is localStorage: this browser only,
// not shared and not real-time. Replace these methods with backend calls later.
import { samplePeriods } from '@/data/availability'
import { addDays, todayISO } from '@/lib/dates'
import { overlaps } from '@/lib/periods'
import { readStore, removeStore, writeStore } from '@/lib/storage'

const KEY = 'missche:availability:v1'
const TYPES = ['reserved', 'blocked', 'unavailable']

// A period is { id, dressId, type, start, end }. `end` is inclusive; null means "until restored".
const isPeriod = (p) =>
  p && typeof p.id === 'string' && typeof p.dressId === 'string' && TYPES.includes(p.type) &&
  typeof p.start === 'string' && (p.end === null || typeof p.end === 'string')

const read = () => {
  const saved = readStore(KEY)
  return Array.isArray(saved) && saved.every(isPeriod) ? saved : structuredClone(samplePeriods)
}

const save = (periods) => {
  writeStore(KEY, periods)
  return periods
}

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`


function assertRange(start, end) {
  if (!start || !end) throw new Error('Choose a date first.')
  if (end < start) throw new Error('The end date is before the start date.')
  if (start < todayISO()) throw new Error('Past dates cannot be changed.')
}

export const localAvailabilityService = {
  async list() {
    return read()
  },

  /** Adds a confirmed rental ('reserved') or an owner block ('blocked'). */
  async addPeriod({ dressId, type, start, end }) {
    if (!dressId || !['reserved', 'blocked'].includes(type)) throw new Error('Choose a dress and an action.')
    assertRange(start, end)
    const periods = read()
    if (periods.some((p) => p.dressId === dressId && overlaps(p, start, end))) {
      throw new Error('Some of those dates are already taken. Make them available first.')
    }
    return save([...periods, { id: newId(), dressId, type, start, end }])
  },

  async removePeriod(id) {
    return save(read().filter((p) => p.id !== id))
  },

  /** Frees the selected dates, trimming or splitting any period that covers them. */
  async restoreRange(dressId, start, end) {
    assertRange(start, end)
    return save(
      read().flatMap((p) => {
        if (p.dressId !== dressId || !overlaps(p, start, end)) return [p]
        const parts = []
        if (p.start < start) parts.push({ ...p, end: addDays(start, -1) })
        if (p.end === null || p.end > end) parts.push({ ...p, id: newId(), start: addDays(end, 1) })
        return parts
      }),
    )
  },

  /** Marks a dress unavailable from today until the owner restores it. */
  async markUnavailable(dressId) {
    const periods = read()
    if (periods.some((p) => p.dressId === dressId && p.end === null)) return periods
    return save([...periods, { id: newId(), dressId, type: 'unavailable', start: todayISO(), end: null }])
  },

  /** Ends temporary unavailability (including split-off parts); rentals and blocks stay. */
  async resume(dressId) {
    return save(read().filter((p) => !(p.dressId === dressId && p.type === 'unavailable')))
  },

  /** Discards saved changes and returns to the sample dates. */
  async reset() {
    removeStore(KEY)
    return read()
  },
}
