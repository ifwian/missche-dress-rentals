// Dresses in Supabase. Same method names and return shapes as the local demo service.
// Do not use `this` in these methods: pages pass them around as plain functions.
import { IMAGE_BUCKET, explain, supabase } from '@/lib/backend'
import { validateDress } from '@/lib/dressForm'
import { pathFromUrl, supabaseImageService } from './image'

const COLUMNS = '*, dress_images(path, position)'

function toDress(row) {
  const images = [...(row.dress_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((image) => supabase.storage.from(IMAGE_BUCKET).getPublicUrl(image.path).data.publicUrl)
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    price: row.price,
    description: row.description,
    color: row.color,
    sizes: row.sizes ?? [],
    categories: row.categories ?? [],
    measurements: row.measurements ?? null,
    images,
    featured: row.featured,
    archived: row.archived,
    isSample: false,
    updatedAt: row.updated_at,
  }
}

const fields = (data) => ({
  code: data.code,
  name: data.name,
  price: data.price,
  description: data.description ?? '',
  color: data.color ?? '',
  sizes: data.sizes,
  categories: data.categories,
  measurements: data.measurements,
  featured: Boolean(data.featured),
})

async function fetchAll() {
  const { data, error } = await supabase.from('dresses').select(COLUMNS).order('created_at', { ascending: true })
  if (error) throw new Error(explain(error, 'Could not load the dresses.'))
  return data.map(toDress)
}

async function writeImages(dressId, urls) {
  const rows = urls
    .map((url, position) => ({ dress_id: dressId, path: pathFromUrl(url), position }))
    .filter((row) => row.path)
  const removed = await supabase.from('dress_images').delete().eq('dress_id', dressId)
  if (removed.error) throw new Error(explain(removed.error))
  if (rows.length) {
    const added = await supabase.from('dress_images').insert(rows)
    if (added.error) throw new Error(explain(added.error))
  }
}

async function fetchOne(id) {
  const { data, error } = await supabase.from('dresses').select(COLUMNS).eq('id', id).maybeSingle()
  if (error) {
    if (error.code === '22P02') return null // not a valid id
    throw new Error(explain(error, 'Could not load the dress.'))
  }
  return data ? toDress(data) : null
}

export const supabaseDressService = {
  async list() {
    return (await fetchAll()).filter((dress) => !dress.archived)
  },
  async listAll() {
    return fetchAll()
  },
  async listFeatured(limit = 3) {
    return (await fetchAll()).filter((dress) => !dress.archived && dress.featured).slice(0, limit)
  },
  /** Returns null when the dress does not exist or is archived. */
  async getById(id) {
    const dress = await fetchOne(id)
    return dress && !dress.archived ? dress : null
  },
  async create(data) {
    const errors = validateDress(data, await fetchAll())
    const first = Object.values(errors)[0]
    if (first) throw new Error(first)
    const { data: row, error } = await supabase.from('dresses').insert(fields(data)).select('id').single()
    if (error) throw new Error(explain(error, 'Could not save the dress.'))
    try {
      await writeImages(row.id, data.images)
    } catch (problem) {
      await supabase.from('dresses').delete().eq('id', row.id)
      throw problem
    }
    return fetchOne(row.id)
  },
  async update(id, data) {
    const all = await fetchAll()
    const errors = validateDress(data, all.filter((d) => d.id !== id))
    const first = Object.values(errors)[0]
    if (first) throw new Error(first)
    const before = all.find((d) => d.id === id)
    if (!before) throw new Error('That dress no longer exists.')
    const { error } = await supabase.from('dresses').update(fields(data)).eq('id', id)
    if (error) throw new Error(explain(error, 'Could not save the dress.'))
    await writeImages(id, data.images)
    await supabaseImageService.discard(before.images.filter((url) => !data.images.includes(url)))
    return fetchOne(id)
  },
  async setArchived(id, archived) {
    const { error } = await supabase.from('dresses').update({ archived }).eq('id', id)
    if (error) throw new Error(explain(error, 'Could not update the dress.'))
    return fetchOne(id)
  },
}
