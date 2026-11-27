import { useState } from 'react'
import { Link } from 'react-router-dom'
import ImageUploader from '@/components/shared/ImageUploader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { BUSINESS } from '@/config/business'
import { fromForm, MAX_IMAGES, MEASUREMENT_FIELDS, toForm, validateDress } from '@/lib/dressForm'
import { formatPrice } from '@/lib/utils'
import Field from './Field'

export default function DressForm({ dress, others, onSave }) {
  const [form, setForm] = useState(() => toForm(dress))
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [preparing, setPreparing] = useState(false)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const text = (key) => ({ id: key, value: form[key], error: errors[key], onChange: (e) => {
    set(key, e.target.value)
    setErrors((current) => ({ ...current, [key]: undefined }))
  } })
  // Occasions from the business, plus any custom category already used.
  const categories = [...new Set([...BUSINESS.occasions, ...others.flatMap((d) => d.categories), ...(dress?.categories ?? [])])]
  const { min, max } = BUSINESS.priceRange

  async function submit(event) {
    event.preventDefault()
    const data = fromForm(form)
    const found = validateDress(data, others)
    setErrors(found)
    setSaveError('')
    const first = Object.keys(found)[0]
    if (first) return document.getElementById(first)?.focus()
    setSaving(true)
    try {
      await onSave(data)
    } catch (error) {
      setSaveError(error.message)
      setSaving(false)
    }
  }

  return (
    <form noValidate onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-2">
      <Card className="space-y-5 p-5 sm:p-6">
        <Field label="Dress name" {...text('name')} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Dress code" hint="Must be unique." {...text('code')} />
          <Field label="Rental price (₱)" type="number" inputMode="numeric" min="1" step="1"
            hint={`Usual range: ${formatPrice(min)} to ${formatPrice(max)}.`} {...text('price')} />
        </div>
        <Field label="Description" as={Textarea} rows={4} {...text('description')} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Colour" {...text('color')} />
          <Field label="Available sizes" hint="Separate with commas." {...text('sizes')} />
        </div>
        <fieldset>
          <legend className="mb-1 text-sm font-medium">Categories</legend>
          <div className="flex flex-wrap gap-x-5">
            {categories.map((category) => (
              <label key={category} className="flex min-h-11 items-center gap-2 text-sm">
                <input type="checkbox" className="size-4 accent-rose" checked={form.categories.includes(category)}
                  onChange={(e) => set('categories', e.target.checked ? [...form.categories, category] : form.categories.filter((c) => c !== category))} />
                {category}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="New categories (optional)" hint="Separate with commas." {...text('otherCategories')} />
        <fieldset>
          <legend className="mb-3 text-sm font-medium">Measurements (optional, include the unit)</legend>
          <div className="grid grid-cols-2 gap-4">
            {MEASUREMENT_FIELDS.map((name) => (
              <Field key={name} id={`measure-${name}`} label={name} value={form.measurements[name] ?? ''}
                onChange={(e) => set('measurements', { ...form.measurements, [name]: e.target.value })} />
            ))}
          </div>
        </fieldset>
      </Card>

      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <ImageUploader images={form.images} max={MAX_IMAGES} onBusyChange={setPreparing}
            onChange={(update) => setForm((f) => ({ ...f, images: update(f.images) }))} />
          {errors.images && <p role="alert" className="mt-2 text-sm text-red-700">{errors.images}</p>}
        </Card>
        <Card className="p-5 sm:p-6">
          {[['featured', 'Feature on the home page (first three featured dresses are shown)'], ['isSample', 'Label as a sample listing']].map(([key, label]) => (
            <label key={key} className="flex min-h-11 items-center gap-3 text-sm">
              <input type="checkbox" className="size-4 shrink-0 accent-rose" checked={form[key]} onChange={(e) => set(key, e.target.checked)} />{label}
            </label>
          ))}
          {saveError && <p role="alert" className="mt-3 text-sm text-red-700">{saveError}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="submit" disabled={saving || preparing}>{dress ? 'Save changes' : 'Add dress'}</Button>
            <Button asChild variant="outline"><Link to="/admin/dresses">Cancel</Link></Button>
          </div>
        </Card>
      </div>
    </form>
  )
}
