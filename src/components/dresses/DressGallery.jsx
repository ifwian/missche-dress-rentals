import { useState } from 'react'
import { cn } from '@/lib/utils'
import DressImage from './DressImage'

export default function DressGallery({ images = [], name }) {
  const [selected, setSelected] = useState(0)

  return (
    <div>
      <div className="aspect-[2/3] overflow-hidden rounded-card bg-blush shadow-soft">
        <DressImage src={images[selected]} alt={`${name}, photo ${selected + 1} of ${images.length || 1}`} />
      </div>
      {images.length > 1 && (
        <ul className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, index) => (
            <li key={index}>
              <button type="button" aria-pressed={index === selected} aria-label={`Show photo ${index + 1}`}
                onClick={() => setSelected(index)}
                className={cn('block aspect-[2/3] w-full overflow-hidden rounded-none border-2 bg-blush transition',
                  index === selected ? 'border-rose' : 'border-transparent opacity-70 hover:opacity-100')}>
                <DressImage src={src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
