import BusinessDetails from '@/components/shared/BusinessDetails'
import SectionHeading from '@/components/shared/SectionHeading'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function Contact() {
  useDocumentTitle('Contact')
  return (
    <div className="container-page py-14 sm:py-20">
      <SectionHeading as="h1" eyebrow="Contact" title="Visit or message us">
        Inquiries are confirmed personally by the owner. Nothing is booked automatically.
      </SectionHeading>
      <BusinessDetails />
    </div>
  )
}
