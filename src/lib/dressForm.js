export const MEASUREMENT_FIELDS = ['Bust', 'Waist', 'Hips', 'Length']
export const MAX_IMAGES = 6

const splitList = (text) => [...new Set(text.split(',').map((item) => item.trim()).filter(Boolean))]

export function toForm(dress) {
  return {
    name: dress?.name ?? '',
    code: dress?.code ?? '',
    price: dress ? String(dress.price) : '',
    description: dress?.description ?? '',
    color: dress?.color ?? '',
    sizes: dress?.sizes.join(', ') ?? '',
    categories: dress?.categories ?? [],
    otherCategories: '',
    measurements: { ...dress?.measurements },
    images: dress?.images ?? [],
    featured: dress?.featured ?? false,
    isSample: dress?.isSample ?? false,
  }
}

export function fromForm(form) {
  const measurements = Object.fromEntries(
    Object.entries(form.measurements).map(([k, v]) => [k, v.trim()]).filter(([, v]) => v),
  )
  return {
    name: form.name.trim(),
    code: form.code.trim().toUpperCase(),
    price: Number(form.price),
    description: form.description.trim(),
    color: form.color.trim(),
    sizes: splitList(form.sizes),
    categories: [...new Set([...form.categories, ...splitList(form.otherCategories)])],
    measurements: Object.keys(measurements).length ? measurements : null,
    images: form.images,
    featured: form.featured,
    isSample: form.isSample,
  }
}

/** Returns { field: message }. `others` are all other dresses, including archived ones. */
export function validateDress(data, others) {
  const errors = {}
  if (!data.name) errors.name = 'Enter the dress name.'
  if (!data.code) errors.code = 'Enter a dress code.'
  else if (others.some((d) => d.code.toLowerCase() === data.code.toLowerCase())) errors.code = 'Another dress already uses this code.'
  if (!Number.isInteger(data.price) || data.price < 1 || data.price > 100000) errors.price = 'Enter the price in whole pesos, for example 499.'
  if (data.images.length > MAX_IMAGES) errors.images = `Use up to ${MAX_IMAGES} photos.`
  return errors
}
