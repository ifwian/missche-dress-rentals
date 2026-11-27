import AsyncContent from '@/components/shared/AsyncContent'
import PageHeader from '@/components/shared/PageHeader'
import { InquiryTable } from '@/pages/AdminInquiries'
import { inquiryService } from '@/services/inquiryService'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function AdminBookings() {
  useDocumentTitle('Confirmed bookings')
  const state = useAsync(inquiryService.list)
  return (
    <>
      <PageHeader title="Confirmed Bookings" description="Paid reservations. Mark a booking completed when the dress is returned." />
      <AsyncContent {...state}>{(rows) => <InquiryTable initial={rows} mode="bookings" />}</AsyncContent>
    </>
  )
}
