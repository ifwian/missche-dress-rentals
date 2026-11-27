import InquiryForm from '@/components/inquiry/InquiryForm'
import SectionHeading from '@/components/shared/SectionHeading'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function Inquiries() {
  useDocumentTitle('Inquiries')
  return (
    <div className="container-page py-16 sm:py-24">
      <SectionHeading as="h1" eyebrow="Inquiries" title="Ask about a dress">
        Tell us which dress and when. This is an inquiry, not a booking: we confirm availability and share payment instructions, and a reservation is confirmed only after full payment.
      </SectionHeading>
      <InquiryForm />
    </div>
  )
}
