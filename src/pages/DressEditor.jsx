import { Link, useNavigate, useParams } from 'react-router-dom'
import DressForm from '@/components/dashboard/DressForm'
import AsyncContent from '@/components/shared/AsyncContent'
import StateMessage from '@/components/shared/StateMessage'
import { Button } from '@/components/ui/button'
import { dressService } from '@/services/dressService'
import { useAsync } from '@/hooks/useAsync'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

function Editor({ id }) {
  const state = useAsync(dressService.listAll)
  const navigate = useNavigate()

  async function save(data) {
    await (id ? dressService.update(id, data) : dressService.create(data))
    navigate('/admin/dresses')
  }

  return (
    <AsyncContent {...state}>
      {(all) => {
        const dress = all.find((d) => d.id === id)
        if (id && !dress) {
          return (
            <>
              <StateMessage title="Dress not found" />
              <Button asChild className="mt-4"><Link to="/admin/dresses">Back to dresses</Link></Button>
            </>
          )
        }
        return <DressForm dress={dress} others={all.filter((d) => d.id !== id)} onSave={save} />
      }}
    </AsyncContent>
  )
}

export default function DressEditor() {
  const { id } = useParams()
  useDocumentTitle(id ? 'Edit dress' : 'Add dress')
  return (
    <>
      <h1 className="mb-6 text-4xl">{id ? 'Edit dress' : 'Add dress'}</h1>
      <Editor key={id ?? 'new'} id={id} />
    </>
  )
}
