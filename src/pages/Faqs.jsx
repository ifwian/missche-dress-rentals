import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'
import { FAQS } from '@/content/faqs'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function Faqs() {
  useDocumentTitle('FAQs')
  return (
    <div className="container-page py-16 sm:py-24">
      <SectionHeading as="h1" eyebrow="Help" title="Frequently asked questions" />
      <div className="max-w-3xl border-t border-rose-dusty">
        {FAQS.map(([question, answer]) => (
          <details key={question} className="group border-b border-rose-dusty">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-2xl marker:hidden [&::-webkit-details-marker]:hidden">
              {question}
              <Plus className="size-5 shrink-0 text-rose transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" />
            </summary>
            <p className="pb-6 pr-10 text-muted">{answer}</p>
          </details>
        ))}
      </div>
      <p className="mt-10 max-w-3xl text-sm text-muted">
        Read the full <Link to="/terms" className="underline">Terms &amp; Conditions</Link>, or <Link to="/contact" className="underline">contact the owner</Link> for anything not covered here.
      </p>
    </div>
  )
}
