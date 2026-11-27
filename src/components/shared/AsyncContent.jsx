import StateMessage from './StateMessage'
import TableSkeleton from './TableSkeleton'

/** Shared loading and error handling around `useAsync` results. */
export default function AsyncContent({ status, data, retry, children }) {
  if (status === 'loading') return <TableSkeleton />
  if (status === 'error') {
    return <StateMessage role="alert" title="Something went wrong while loading" actionLabel="Try again" onAction={retry} />
  }
  return children(data)
}
