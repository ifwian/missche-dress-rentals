import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

/** Hands the chosen dress and date to the dedicated Inquiries page. */
export default function InquiryPanel({ dress, date, status }) {
  return (
    <section className="mt-8 border-t border-rose-dusty pt-8">
      <h2 className="text-3xl">Rental information</h2>
      <p className="mt-3 text-sm text-muted">Standard rental is 3 days: pickup, event, return. A refundable security deposit is required. See the <Link to="/terms" className="underline">Terms &amp; Conditions</Link>.</p>
      {status !== 'available' && (
        <p className="mt-3 text-sm text-amber-800">This dress is {status} on your chosen date. Pick another date, or ask the owner about it.</p>
      )}
      <Button asChild size="lg" className="mt-6 w-full sm:w-auto">
        <Link to={`/inquiries?dress=${encodeURIComponent(dress.id)}&date=${date}`}>Inquire about this dress</Link>
      </Button>
      <p className="mt-4 text-xs text-muted">An inquiry is not a booking. The owner confirms every rental personally.</p>
    </section>
  )
}
