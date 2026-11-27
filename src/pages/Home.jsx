import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlurFade } from '@/components/magicui/blur-fade'
import Hero from '@/components/home/Hero'
import FeaturedCarousel from '@/components/home/FeaturedCarousel'
import Occasions from '@/components/home/Occasions'
import HowItWorks from '@/components/home/HowItWorks'
import Benefits from '@/components/shared/Benefits'
import SectionHeading from '@/components/shared/SectionHeading'
import { BUSINESS } from '@/config/business'
import { dressService } from '@/services/dressService'
import { availabilityService, getStatus } from '@/services/availabilityService'
import { todayISO } from '@/lib/dates'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatPrice } from '@/lib/utils'

async function loadFeatured() {
  const [dresses, periods] = await Promise.all([dressService.listFeatured(), availabilityService.list()])
  return dresses.map((dress) => ({ ...dress, status: getStatus(periods, dress.id, todayISO()) }))
}

const FACTS = [
  ['Vietnam & Bangkok', 'Dresses direct from Vietnam and BKK, including our Vietnam long dress collection.'],
  ['Luxury meets affordability', 'Rentals from {min} to {max}.'],
  ['Mini fitting studio', 'Try your dress on before you decide.'],
  ['Lalamove delivery', 'Delivery is available through Lalamove.'],
]

export default function Home() {
  useDocumentTitle()
  const featured = useAsync(loadFeatured)
  const { min, max } = BUSINESS.priceRange

  return (
    <>
      <Hero />
      <FeaturedCarousel state={featured} />
      <Occasions />
      <Benefits />
      <HowItWorks />

      <section className="bg-blush py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeading eyebrow="About Missche" title="Calamba, Laguna" as="h2" className="mb-0">
            {BUSINESS.location}
          </SectionHeading>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FACTS.map(([term, text]) => (
              <BlurFade key={term}>
                <dt className="font-display text-3xl">{term}</dt>
                <dd className="mt-2 text-sm text-muted">{text.replace('{min}', formatPrice(min)).replace('{max}', formatPrice(max))}</dd>
              </BlurFade>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page py-24 text-center sm:py-32">
        <BlurFade>
          <h2 className="mx-auto max-w-3xl text-5xl sm:text-7xl">Find the dress for your next moment.</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg"><Link to="/collection">Explore the collection<ArrowRight aria-hidden="true" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/inquiries">Send an inquiry</Link></Button>
          </div>
        </BlurFade>
      </section>
    </>
  )
}
