import { useState } from 'react'
import { cn } from '@/lib/utils'

/** Fills its parent; shows a quiet "photo to be added" tile when the photo is missing or fails to load. */
export default function DressImage({ src, alt, className, ...props }) {
  const [failed, setFailed] = useState(null)

  if (!src || failed === src) {
    return (
      <span className="flex size-full flex-col items-center justify-center gap-2 bg-blush text-rose/60">
        <span aria-hidden="true" className="font-display text-5xl italic leading-none">M</span>
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted">Photo to be added</span>
      </span>
    )
  }
  return <img src={src} alt={alt} onError={() => setFailed(src)} className={cn('size-full object-cover', className)} {...props} />
}
