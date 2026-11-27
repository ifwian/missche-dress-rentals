import AsyncContent from '@/components/shared/AsyncContent'
import PageHeader from '@/components/shared/PageHeader'
import { BUSINESS } from '@/config/business'
import { dressService } from '@/services/dressService'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function AdminCategories() {
  useDocumentTitle('Categories')
  const state = useAsync(dressService.listAll)
  return (
    <>
      <PageHeader title="Categories" description="Occasions customers can browse. Assign them to a dress when you add or edit it." />
      <AsyncContent {...state}>{(dresses) => {
        const active = dresses.filter((d) => !d.archived)
        const names = [...new Set([...BUSINESS.occasions, ...active.flatMap((d) => d.categories)])]
        return (
          <ul className="divide-y divide-charcoal/10 border border-charcoal/10 bg-white">
            {names.map((n) => <li key={n} className="flex min-h-14 items-center justify-between gap-3 px-4"><span className="font-medium">{n}</span><span className="text-sm text-muted">{active.filter((d) => d.categories.includes(n)).length} dresses</span></li>)}
          </ul>
        )
      }}</AsyncContent>
    </>
  )
}
