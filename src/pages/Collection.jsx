import { useSearchParams } from 'react-router-dom'
import CollectionToolbar from '@/components/dresses/CollectionToolbar'
import DressGrid from '@/components/dresses/DressGrid'
import SectionHeading from '@/components/shared/SectionHeading'
import StateMessage from '@/components/shared/StateMessage'
import { availabilityService, getStatus } from '@/services/availabilityService'
import { dressService } from '@/services/dressService'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { filterDresses, getCategories } from '@/lib/catalog'
import { formatDate, pickDate } from '@/lib/dates'

const loadCatalog = () => Promise.all([dressService.list(), availabilityService.list()])

export default function Collection() {
  useDocumentTitle('Collection')
  const catalog = useAsync(loadCatalog)
  const [params, setParams] = useSearchParams()
  const filters = {
    query: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? 'featured',
  }
  const date = pickDate(params.get('date'))
  const [dresses, periods] = catalog.data ?? [[], []]
  const onlyAvailable = params.get('available') === '1'
  const results = filterDresses(dresses, filters)
    .map((d) => ({ ...d, status: getStatus(periods, d.id, date) }))
    .filter((d) => !onlyAvailable || d.status === 'available')

  // Filters live in the URL, so they survive "back" and can be shared.
  function update(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  function clearFilters() {
    setParams(params.get('date') ? { date: params.get('date') } : {}, { replace: true })
  }

  return (
    <div className="container-page py-14 sm:py-20">
      <SectionHeading as="h1" eyebrow="Collection" title="The collection">
        {dresses.some((d) => d.isSample) ? 'Listings marked as samples are for demonstration only.' : 'Choose a date to see what is open.'}
      </SectionHeading>
      <CollectionToolbar filters={filters} date={date} onlyAvailable={onlyAvailable} categories={getCategories(dresses)} onChange={update} />
      <p aria-live="polite" className="mb-5 text-sm text-muted">
        {catalog.status === 'success' &&
          `${results.length} ${results.length === 1 ? 'dress' : 'dresses'} · availability for ${formatDate(date)}`}
      </p>
      <h2 className="sr-only">Dresses</h2>
      <DressGrid
        {...catalog}
        data={results}
        date={date}
        empty={<StateMessage title="No dresses match" message="Try a different search or category." actionLabel="Clear filters" onAction={clearFilters} />}
      />
    </div>
  )
}
