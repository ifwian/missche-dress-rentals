// Pages talk to this service only, never to the data file or storage. To move to a
// backend, keep these signatures and replace the bodies. Persistence here is
// localStorage: one browser only, not shared and not real-time.
import { sampleDresses } from '@/data/dresses'
import { validateDress } from '@/lib/dressForm'
import { readStore, removeStore, writeStore } from '@/lib/storage'

const KEY = 'missche:dresses:v1'

const isDress = (d) =>
  d && ['id', 'code', 'name'].every((k) => typeof d[k] === 'string') && typeof d.price === 'number' &&
  ['images', 'sizes', 'categories'].every((k) => Array.isArray(d[k]))

const read = () => {
  const saved = readStore(KEY)
  return Array.isArray(saved) && saved.every(isDress) ? saved : structuredClone(sampleDresses)
}

const visible = () => read().filter((dress) => !dress.archived)

function check(data, others) {
  const errors = validateDress(data, others)
  const first = Object.values(errors)[0]
  if (first) throw new Error(first)
}

function change(id, patch) {
  const all = read()
  const index = all.findIndex((d) => d.id === id)
  if (index < 0) throw new Error('That dress no longer exists.')
  all[index] = { ...all[index], ...patch, id, updatedAt: new Date().toISOString() }
  writeStore(KEY, all)
  return all[index]
}

export const localDressService = {
  async list() {
    return visible()
  },
  async listAll() {
    return read()
  },
  async listFeatured(limit = 3) {
    return visible().filter((dress) => dress.featured).slice(0, limit)
  },
  /** Returns null when the dress does not exist or is archived. */
  async getById(id) {
    return visible().find((dress) => dress.id === id) ?? null
  },
  async create(data) {
    const all = read()
    check(data, all)
    const id = `dress-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
    const dress = { ...data, id, archived: false, updatedAt: new Date().toISOString() }
    writeStore(KEY, [...all, dress])
    return dress
  },
  async update(id, data) {
    check(data, read().filter((d) => d.id !== id))
    return change(id, data)
  },
  async setArchived(id, archived) {
    return change(id, { archived })
  },
  /** Discards saved dresses and returns to the samples. */
  async reset() {
    removeStore(KEY)
  },
}
