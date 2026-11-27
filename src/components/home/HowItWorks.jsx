import { BlurFade } from '@/components/magicui/blur-fade'
import SectionHeading from '@/components/shared/SectionHeading'

const STEPS = [
  ['Discover your dress', 'Browse the collection and find the one you love.'],
  ['Check your preferred dates', 'Use the availability calendar on the dress page.'],
  ['Send an inquiry', 'Tell us your dates. An inquiry is not a booking.'],
  ['Complete fitting and payment arrangements', 'We review your inquiry, confirm availability and share payment instructions. A booking is confirmed only after full payment.'],
  ['Pick up your dress and enjoy your event', 'Pickup is Day 1, your event is Day 2.'],
  ['Return your dress', 'Return it on or before the agreed date and time (Day 3).'],
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page scroll-mt-24 py-20 sm:py-28" >
      <SectionHeading eyebrow="How renting works" title="Six simple steps" />
      <ol className="grid gap-x-12 border-t border-rose-dusty md:grid-cols-2">
        {STEPS.map(([title, text], index) => (
          <li key={title}>
            <BlurFade className="flex gap-5 border-b border-rose-dusty py-6">
              <span aria-hidden="true" className="font-display text-4xl italic leading-none text-rose">{index + 1}</span>
              <div>
                <h3 className="text-2xl">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            </BlurFade>
          </li>
        ))}
      </ol>
    </section>
  )
}
