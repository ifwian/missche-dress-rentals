import { HAS_BACKEND } from '@/lib/backend'
import { localImageService } from './local/image'
import { supabaseImageService } from './supabase/image'

export const imageService = HAS_BACKEND ? supabaseImageService : localImageService
