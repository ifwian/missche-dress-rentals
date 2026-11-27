// Customer inquiries. Only exists with Supabase: the local demo has no customers, so it is empty.
import { HAS_BACKEND, explain, supabase } from '@/lib/backend'

export const INQUIRY_STATUS = {
  pending_review: 'Pending Review', awaiting_owner: 'Awaiting Owner Response', awaiting_payment: 'Awaiting Payment',
  confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled',
}

export const inquiryService = {
  async list() {
    if (!HAS_BACKEND) return []
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    if (error) throw new Error(explain(error, 'Could not load inquiries.'))
    return data
  },
  async setStatus(id, status) {
    const { error } = await supabase.from('inquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) throw new Error(explain(error))
  },
  /** Customer submits an inquiry (must be signed in). Always starts as pending_review. */
  async submit(row) {
    const { error } = await supabase.from('inquiries').insert({ ...row, status: 'pending_review' })
    if (error) throw new Error(explain(error, 'Could not send your inquiry.'))
  },
}
