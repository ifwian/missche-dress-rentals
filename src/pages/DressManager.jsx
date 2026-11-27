import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import DressImage from '@/components/dresses/DressImage'
import AsyncContent from '@/components/shared/AsyncContent'
import PageHeader from '@/components/shared/PageHeader'
import StateMessage from '@/components/shared/StateMessage'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { availabilityService, getStatus } from '@/services/availabilityService'
import { dressService } from '@/services/dressService'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { todayISO } from '@/lib/dates'
import { formatPrice } from '@/lib/utils'

const load = () => Promise.all([dressService.listAll(), availabilityService.list()])
const LABEL = { available: 'Available', reserved: 'Reserved', unavailable: 'Unavailable', blocked: 'Unavailable' }

function Inventory({ initial, periods }) {
  const toast = useToast()
  const [dresses, setDresses] = useState(initial)
  const [showArchived, setShowArchived] = useState(false)
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const shown = useMemo(() => dresses.filter((d) => Boolean(d.archived) === showArchived &&
    `${d.code} ${d.name} ${d.categories.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())), [dresses, showArchived, query])

  async function confirm() {
    setBusy(true)
    try {
      await dressService.setArchived(target.id, !target.archived)
      setDresses(await dressService.listAll())
      toast.success(`${target.code} ${target.archived ? 'restored' : 'archived'}.`)
      setTarget(null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Show dresses" className="flex gap-2">
          {[[false, 'Active'], [true, 'Archived']].map(([value, label]) => (
            <Button key={label} variant={showArchived === value ? 'default' : 'outline'} aria-pressed={showArchived === value} onClick={() => setShowArchived(value)}>
              {label} ({dresses.filter((d) => Boolean(d.archived) === value).length})
            </Button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input type="search" aria-label="Search dresses by code, name or category" placeholder="Search code, name, category" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {shown.length === 0 ? (
        <StateMessage title={query ? 'No dresses match your search' : showArchived ? 'No archived dresses' : 'No dresses yet'} message={!query && !showArchived ? 'Add your first dress to start the collection.' : undefined} />
      ) : (
        <div className="overflow-x-auto border border-charcoal/10 bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Dress inventory</caption>
            <thead className="border-b border-charcoal/10 bg-blush/60 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="p-3">Dress</th>
                <th scope="col" className="hidden p-3 md:table-cell">Category</th>
                <th scope="col" className="p-3">Price</th>
                <th scope="col" className="p-3">Today</th>
                <th scope="col" className="hidden p-3 lg:table-cell">Updated</th>
                <th scope="col" className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {shown.map((d) => (
                <tr key={d.id}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="aspect-[3/4] w-12 shrink-0 overflow-hidden bg-blush"><DressImage src={d.images[0]} alt="" /></div>
                      <div className="min-w-0"><p className="text-xs uppercase tracking-widest text-muted">{d.code}</p><p className="font-medium">{d.name}</p></div>
                    </div>
                  </td>
                  <td className="hidden p-3 md:table-cell">{d.categories.join(', ') || '-'}</td>
                  <td className="p-3">{formatPrice(d.price)}</td>
                  <td className="p-3 font-medium">{LABEL[getStatus(periods, d.id, todayISO())] ?? '-'}</td>
                  <td className="hidden p-3 text-muted lg:table-cell">{d.updatedAt ? new Date(d.updatedAt).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : '-'}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline"><Link to={`/admin/dresses/${d.id}/edit`} aria-label={`Edit ${d.code}`}>Edit</Link></Button>
                      <Button variant="outline" aria-label={`${d.archived ? 'Restore' : 'Archive'} ${d.code}`} onClick={() => setTarget(d)}>{d.archived ? 'Restore' : 'Archive'}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={Boolean(target)} busy={busy} onClose={() => setTarget(null)} onConfirm={confirm}
        title={target?.archived ? 'Restore this dress?' : 'Archive this dress?'}
        confirmLabel={target?.archived ? 'Restore' : 'Archive'}
        message={target ? (target.archived ? `${target.code} will appear in the public collection again.` : `${target.code} will be hidden from customers. You can restore it any time.`) : ''} />
    </>
  )
}

export default function DressManager() {
  useDocumentTitle('Dress inventory')
  const state = useAsync(load)
  return (
    <>
      <PageHeader title="Dress Inventory" description="Every dress, its price and whether it is free today."
        actions={<Button asChild><Link to="/admin/dresses/new"><Plus className="size-4" aria-hidden="true" />Add dress</Link></Button>} />
      <AsyncContent {...state}>{([dresses, periods]) => <Inventory initial={dresses} periods={periods} />}</AsyncContent>
    </>
  )
}
