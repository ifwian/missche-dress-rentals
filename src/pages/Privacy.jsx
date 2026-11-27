import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import { BUSINESS } from '@/config/business'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const SECTIONS = [
  ['What we ask for', 'The inquiry form asks for your name, email address, an optional contact number, the dress you are interested in, your pickup, event and return dates, your fitting preference and an optional message. We do not ask for photos of IDs or your full home address through this website. If you go ahead with a booking, we will tell you how to share those details.'],
  ['How your inquiry travels', 'The form prepares an email in your own email app, or lets you copy the text and send it through our Facebook page. Nothing is sent until you press send in that app. Once we receive it, it is kept in our inbox or Facebook messages.'],
  ['How we use it', 'Only to reply to your inquiry: checking availability, arranging a fitting, payment, pickup and return.'],
  ['Cookies and tracking', 'This website does not use advertising or analytics trackers. Its fonts are loaded from Google Fonts, so Google can see that your browser requested them. Links to Facebook open Facebook, which has its own privacy policy.'],
  ['Your choices', 'If you want to ask about or remove a message you sent us, contact us through the details on the Contact page.'],
  ['Changes', 'If the website later stores inquiries on a server, this page will be updated before that starts.'],
]

export default function Privacy() {
  useDocumentTitle('Privacy Policy')
  return (
    <div className="container-page py-16 sm:py-24">
      <SectionHeading as="h1" eyebrow="Missche Dress Rentals" title="Privacy Policy">
        How {BUSINESS.name} handles the information you share with us. Last updated November 27, 2026.
      </SectionHeading>
      <div className="max-w-3xl">
        {SECTIONS.map(([title, text]) => (
          <section key={title} className="border-t border-rose-dusty py-7">
            <h2 className="text-3xl">{title}</h2>
            <p className="mt-3 text-muted">{text}</p>
          </section>
        ))}
        <p className="border-t border-rose-dusty pt-7 text-sm text-muted">Questions? Visit the <Link to="/contact" className="underline">Contact page</Link>.</p>
      </div>
    </div>
  )
}
