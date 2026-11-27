// Per-dress availability in Supabase. Overlapping rentals/blocks are rejected by the
// database itself (exclusion constraint), not just by this code.
import { todayISO } from '@/lib/dates'
import { explain, supabase } from '@/lib/backend'

const toPeriod = (row) => ({ id: row.id, dressId: row.dress_id, type: row.type, start: row.start_date, end: row.end_date })

async function list() {
  const { data, error } = await supabase.from('availability_blocks').select('*').order('start_date')
  if (error) throw new Error(explain(error, 'Could not load the dates.'))
  return data.map(toPeriod)
}

function assertRange(start, end) {
  if (!start || !end) throw new Error('Choose a date first.')
  if (end < start) throw new Error('The end date is before the start date.')
  if (start < todayISO()) throw new Error('Past dates cannot be changed.')
}

export const supabaseAvailabilityService = {
  list,

  /** Adds a confirmed rental ('reserved') or an owner block ('blocked'). */
  async addPeriod({ dressId, type, start, end }) {
    if (!dressId || !['reserved', 'blocked'].includes(type)) throw new Error('Choose a dress and an action.')
    assertRange(start, end)
    const { error } = await supabase.from('availability_blocks').insert({ dress_id: dressId, type, start_date: start, end_date: end })
    if (error) throw new Error(explain(error))
    return list()
  },

  async removePeriod(id) {
    const { error } = await supabase.from('availability_blocks').delete().eq('id', id)
    if (error) throw new Error(explain(error))
    return list()
  },

  /** Frees the selected dates, trimming or splitting any period that covers them (one transaction). */
  async restoreRange(dressId, start, end) {
    assertRange(start, end)
    const { error } = await supabase.rpc('restore_availability', { p_dress: dressId, p_start: start, p_end: end })
    if (error) throw new Error(explain(error))
    return list()
  },

  /** Marks a dress unavailable from today until the owner restores it. */
  async markUnavailable(dressId) {
    const { error } = await supabase
      .from('availability_blocks')
      .insert({ dress_id: dressId, type: 'unavailable', start_date: todayISO(), end_date: null })
    if (error && error.code !== '23505') throw new Error(explain(error)) // already unavailable: fine
    return list()
  },

  /** Ends temporary unavailability; rentals and blocks stay. */
  async resume(dressId) {
    const { error } = await supabase.from('availability_blocks').delete().eq('dress_id', dressId).eq('type', 'unavailable')
    if (error) throw new Error(explain(error))
    return list()
  },
}
