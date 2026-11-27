import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { BlurFade } from '@/components/magicui/blur-fade'
import { BUSINESS } from '@/config/business'
import SectionHeading from '@/components/shared/SectionHeading'

/** Index-style list of occasions; each links to the collection filtered by that category. */
export default function Occasions() {
  return (
    <section className="bg-charcoal py-20 text-ivory sm:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHeading eyebrow="Shop by occasion" title="Dressed for the moment" as="h2" className="mb-0 [&_p]:text-rose-dusty">
          Choose the occasion and we will show the matching dresses.
        </SectionHeading>
        <ul className="border-t border-ivory/20">
          {BUSINESS.occasions.map((occasion, index) => (
            <li key={occasion}>
              <BlurFade>
                <Link to={`/collection?category=${encodeURIComponent(occasion)}`}
                  className="group flex min-h-16 items-center justify-between gap-4 border-b border-ivory/20 py-4 transition-colors hover:text-rose-dusty">
                  <span className="flex items-baseline gap-5">
                    <span aria-hidden="true" className="w-8 font-display text-lg italic text-rose-dusty">{String(index + 1).padStart(2, '0')}</span>
                    <span className="font-display text-3xl sm:text-4xl">{occasion}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none" aria-hidden="true" />
                </Link>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
