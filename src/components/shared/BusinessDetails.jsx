import { Link } from 'react-router-dom'
import { ExternalLink, Mail, MapPin, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BUSINESS, OWNER_EMAIL } from '@/config/business'

const subject = encodeURIComponent(`Inquiry for ${BUSINESS.name}`)

export default function BusinessDetails() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border border-rose-dusty bg-transparent p-7 shadow-none sm:p-9">
        <h3 className="text-3xl">Visit &amp; services</h3>
        <p className="mt-4 flex gap-3"><MapPin className="mt-1 size-4 shrink-0 text-rose" aria-hidden="true" />{BUSINESS.location}</p>
        <ul className="mt-4 space-y-3">
          {BUSINESS.services.map((service) => (
            <li key={service} className="flex gap-3"><Sparkles className="mt-1 size-4 shrink-0 text-rose" aria-hidden="true" />{service}</li>
          ))}
        </ul>
      </Card>
      <Card className="flex flex-col items-start border border-rose-dusty bg-transparent p-7 shadow-none sm:p-9">
        <h3 className="text-3xl">Get in touch</h3>
        {OWNER_EMAIL ? (
          <>
            <p className="mt-4 break-words text-muted">Email us at {OWNER_EMAIL}. To ask about a specific dress, use the inquiry form.</p>
            <Button asChild className="mt-6"><a href={`mailto:${OWNER_EMAIL}?subject=${subject}`}><Mail aria-hidden="true" />Contact Owner</a></Button>
          </>
        ) : (
          <p className="mt-4 text-muted">Our email address will be posted here soon. For now, please reach us through our Facebook page.</p>
        )}
        <Button asChild className="mt-4"><Link to="/inquiries">Send an inquiry</Link></Button>
        <Button asChild variant="outline" className="mt-4">
          <a href={BUSINESS.facebookUrl} target="_blank" rel="noreferrer">Facebook page<ExternalLink aria-hidden="true" /></a>
        </Button>
      </Card>
    </div>
  )
}
