import { HAS_BACKEND } from '@/lib/backend'
import { localDressService } from './local/dress'
import { supabaseDressService } from './supabase/dress'

export const dressService = HAS_BACKEND ? supabaseDressService : localDressService
