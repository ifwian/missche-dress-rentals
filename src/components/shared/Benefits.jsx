import { BlurFade } from '@/components/magicui/blur-fade'
import { BUSINESS } from '@/config/business'
import SectionHeading from './SectionHeading'

const BENEFITS = [
  'Save money',
  'Wear premium dresses',
  'Perfect for one-time events',
  'No need for storage',
  'Always wear something new',
  'Feel confident and elegant',
]

/** Why rent. Shows a real editorial photo beside the list only when one is configured. */
export default function Benefits() {
  const image = BUSINESS.editorialImage
  return (
    <section className="bg-blush py-20 sm:py-28">
      <div className={image ? 'container-page grid items-center gap-12 md:grid-cols-[5fr_6fr] lg:gap-20' : 'container-page'}>
        {image && <img src={image} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />}
        <div>
          <SectionHeading eyebrow="Why rent" title="Rent instead of buy" />
          <ol className="border-t border-rose-dusty">
            {BENEFITS.map((title, index) => (
              <li key={title}>
                <BlurFade className="flex items-baseline gap-5 border-b border-rose-dusty py-4">
                  <span aria-hidden="true" className="w-8 font-display text-xl italic text-rose">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-2xl sm:text-3xl">{title}</h3>
                </BlurFade>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
