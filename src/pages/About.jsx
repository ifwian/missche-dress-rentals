import AboutContent from '@/components/shared/AboutContent'
import Benefits from '@/components/shared/Benefits'
import SectionHeading from '@/components/shared/SectionHeading'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function About() {
  useDocumentTitle('About')
  return (
    <>
      <div className="container-page py-14 sm:py-20">
        <SectionHeading as="h1" eyebrow="About us" title="Luxury meets affordability" />
        <AboutContent />
      </div>
      <Benefits />
    </>
  )
}
