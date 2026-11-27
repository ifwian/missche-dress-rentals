export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
]

const compare = {
  featured: (a, b) => Number(b.featured) - Number(a.featured),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }),
}

export const getCategories = (dresses) => [...new Set(dresses.flatMap((d) => d.categories))].sort()

export function filterDresses(dresses, { query = '', category = '', sort = 'featured' }) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  return dresses
    .filter((d) => !category || d.categories.includes(category))
    .filter((d) => {
      const text = [d.name, d.code, d.color, ...d.categories].join(' ').toLowerCase()
      return words.every((word) => text.includes(word))
    })
    .sort(compare[sort] ?? compare.featured)
}
