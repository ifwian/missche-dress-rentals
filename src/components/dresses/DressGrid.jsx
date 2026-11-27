import StateMessage from '@/components/shared/StateMessage'
import DressCard from './DressCard'

const layout = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'

export default function DressGrid({ status, data, retry, date, empty }) {
  if (status === 'loading') {
    return (
      <div className={layout} role="status">
        <span className="sr-only">Loading dresses</span>
        {[0, 1, 2].map((n) => <div key={n} className="aspect-[2/3] animate-pulse rounded-card bg-blush" />)}
      </div>
    )
  }
  if (status === 'error') {
    return <StateMessage role="alert" title="We couldn't load the dresses" message="Please try again." actionLabel="Try again" onAction={retry} />
  }
  if (!data.length) {
    return empty ?? <StateMessage title="No dresses yet" message="New pieces will appear here soon." />
  }
  return (
    <ul className={layout}>
      {data.map((dress) => <li key={dress.id}><DressCard dress={dress} date={date} /></li>)}
    </ul>
  )
}
