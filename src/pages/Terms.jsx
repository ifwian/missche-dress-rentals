import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import { TERMS } from '@/content/terms'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function Terms() {
  useDocumentTitle('Terms & Conditions')
  return (
    <div className="container-page py-16 sm:py-24">
      <SectionHeading as="h1" eyebrow="Missche Dress Rentals" title="Terms & Conditions" />
      <div className="max-w-3xl">
        {TERMS.map(({ title, intro, items, outro }, index) => (
          <section key={title} className="border-t border-rose-dusty py-8">
            <h2 className="flex items-baseline gap-4 text-3xl">
              <span aria-hidden="true" className="font-display text-xl italic text-rose">{String(index + 1).padStart(2, '0')}</span>{title}
            </h2>
            {intro && <p className="mt-4">{intro}</p>}
            <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-rose">
              {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            {outro && <p className="mt-4">{outro}</p>}
          </section>
        ))}
        <div className="border-t border-rose-dusty pt-8">
          <p className="font-display text-3xl italic">Rent It • Wear It • Slay It</p>
          <p className="mt-2 text-muted">Thank you for trusting Missche Dress Rentals.</p>
          <p className="mt-6 text-sm text-muted">Questions about these terms? See the <Link to="/faqs" className="underline">FAQs</Link> or <Link to="/contact" className="underline">contact us</Link>.</p>
        </div>
      </div>
    </div>
  )
}
