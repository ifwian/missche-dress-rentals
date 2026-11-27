import DateManager from '@/components/dashboard/DateManager'
import AsyncContent from '@/components/shared/AsyncContent'
import StateMessage from '@/components/shared/StateMessage'
import { availabilityService } from '@/services/availabilityService'
import { dressService } from '@/services/dressService'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const load = () => Promise.all([dressService.list(), availabilityService.list()])

export default function ManageDates() {
  useDocumentTitle('Manage dates')
  const state = useAsync(load)

  return (
    <>
      <h1 className="mb-6 text-4xl">Availability</h1>
      <AsyncContent {...state}>
        {([dresses, periods]) => dresses.length
          ? <DateManager dresses={dresses} initialPeriods={periods} />
          : <StateMessage title="No active dresses" message="Add or restore a dress before managing dates." />}
      </AsyncContent>
    </>
  )
}
