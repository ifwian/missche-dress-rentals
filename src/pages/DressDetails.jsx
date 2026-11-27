import { useCallback } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar'
import StatusBadge from '@/components/availability/StatusBadge'
import DressGallery from '@/components/dresses/DressGallery'
import InquiryPanel from '@/components/dresses/InquiryPanel'
import StateMessage from '@/components/shared/StateMessage'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { availabilityService, getStatus } from '@/services/availabilityService'
import { dressService } from '@/services/dressService'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatDate, pickDate } from '@/lib/dates'
import { formatPrice } from '@/lib/utils'

function Details({ id }) {
  const load = useCallback(() => Promise.all([dressService.getById(id), availabilityService.list()]), [id])
  const { status, data, retry } = useAsync(load)
  const [params, setParams] = useSearchParams()
  const { state } = useLocation()
  const date = pickDate(params.get('date'))
  const [dress, periods] = data ?? [null, []]
  useDocumentTitle(dress?.name ?? 'Dress details')

  if (status === 'loading') {
    return (
      <div role="status" className="grid gap-10 md:grid-cols-2">
        <span className="sr-only">Loading dress</span>
        <div className="aspect-[2/3] animate-pulse rounded-card bg-blush" />
        <div className="h-64 animate-pulse rounded-card bg-blush" />
      </div>
    )
  }
  if (status === 'error') {
    return <StateMessage role="alert" title="We couldn't load this dress" message="Please try again." actionLabel="Try again" onAction={retry} />
  }
  if (!dress) {
    return <StateMessage title="Dress not found" message="It may no longer be part of the collection. Use the link above to browse other dresses." />
  }

  const availability = getStatus(periods, dress.id, date)
  const facts = [
    ['Available sizes', dress.sizes.join(', ')],
    ['Colour', dress.color],
    ['Occasions', dress.categories.join(', ')],
  ].filter(([, value]) => value)
  const measurements = Object.entries(dress.measurements ?? {}).filter(([, value]) => value)

  return (
    <div className="grid items-start gap-10 md:grid-cols-2 lg:gap-16">
      <DressGallery images={dress.images} name={dress.name} />
      <div>
        {dress.isSample && <Badge className="mb-4 bg-blush">Sample listing</Badge>}
        <p className="text-xs uppercase tracking-widest text-muted">{dress.code}</p>
        <h1 className="mt-2 text-5xl">{dress.name}</h1>
        <p className="mt-3 text-2xl font-medium text-rose-deep">{formatPrice(dress.price)} <span className="text-base font-light text-muted">rental</span></p>
        {dress.description && <p className="mt-5 text-muted">{dress.description}</p>}

        <dl className="mt-8 divide-y divide-rose-dusty/60 border-y border-rose-dusty/60">
          {facts.map(([term, value]) => (
            <div key={term} className="flex justify-between gap-6 py-3">
              <dt className="font-medium">{term}</dt><dd className="text-right">{value}</dd>
            </div>
          ))}
        </dl>

        {measurements.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl">Measurements</h2>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
              {measurements.map(([term, value]) => (
                <div key={term} className="rounded-none bg-blush p-3"><dt className="text-xs text-muted">{term}</dt><dd className="font-medium">{value}</dd></div>
              ))}
            </dl>
          </section>
        )}

        <Card className="mt-8 p-4 sm:p-6">
          <h2 className="mb-4 text-2xl">Availability</h2>
          <AvailabilityCalendar
            statusFor={(day) => getStatus(periods, dress.id, day)}
            start={date}
            onSelect={(day) => setParams({ date: day }, { replace: true, state })}
          />
          <p aria-live="polite" data-testid="selected-status" className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge status={availability} className="font-medium" />
            <span className="text-muted">on {formatDate(date)}</span>
          </p>
        </Card>
        <InquiryPanel dress={dress} date={date} status={availability} />
      </div>
    </div>
  )
}

export default function DressDetails() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { state } = useLocation()
  // Keep the collection's search, category and sort (passed along by the card) and the chosen date.
  const back = new URLSearchParams(typeof state?.back === 'string' ? state.back : '')
  if (params.get('date')) back.set('date', pickDate(params.get('date')))
  const backSearch = back.toString()
  return (
    <div className="container-page py-10">
      <Link to={backSearch ? `/collection?${backSearch}` : '/collection'} className="mb-6 inline-flex items-center gap-2 py-2 text-sm text-rose-deep hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />Back to collection
      </Link>
      <Details key={id} id={id} />
    </div>
  )
}
