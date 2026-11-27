// Pages import services from here only. Picks Supabase when configured, otherwise the
// local (browser-only) demo. Both expose the same async methods and return shapes.
import { HAS_BACKEND } from '@/lib/backend'
import { localAvailabilityService } from './local/availability'
import { supabaseAvailabilityService } from './supabase/availability'

export { getStatus } from '@/lib/periods'
export const availabilityService = HAS_BACKEND ? supabaseAvailabilityService : localAvailabilityService
