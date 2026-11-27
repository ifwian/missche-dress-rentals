// Pure date-period helpers shared by every availability backend.
/** Does period `p` touch the inclusive range start..end? `p.end === null` means open-ended. */
export const overlaps = (p, start, end) => p.start <= end && (p.end === null || p.end >= start)

/** 'available' | 'reserved' | 'unavailable' for one dress on one date. */
export function getStatus(periods, dressId, date) {
  const matches = periods.filter((p) => p.dressId === dressId && overlaps(p, date, date))
  if (matches.some((p) => p.type !== 'reserved')) return 'unavailable'
  return matches.length ? 'reserved' : 'available'
}
