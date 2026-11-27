import { useState } from 'react'
import DressImage from '@/components/dresses/DressImage'
import { Button } from '@/components/ui/button'
import { imageService } from '@/services/imageService'

/** Multiple-photo field. The first photo is the cover. */
export default function ImageUploader({ images, onChange, max, onBusyChange }) {
  const [busy, setBusy] = useState(false)
  const [problems, setProblems] = useState([])

  async function add(event) {
    const input = event.target
    const files = [...input.files]
    input.value = ''
    const room = max - images.length
    const messages = files.length > room ? [`Only ${max} photos are allowed, so some were skipped.`] : []
    setBusy(true)
    onBusyChange(true)
    const results = await Promise.allSettled(files.slice(0, room).map((file) => imageService.prepare(file)))
    const added = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
    messages.push(...results.filter((r) => r.status === 'rejected').map((r) => r.reason.message))
    if (added.length) onChange((current) => [...current, ...added].slice(0, max))
    setProblems(messages)
    setBusy(false)
    onBusyChange(false)
  }

  const makeCover = (index) => onChange((current) => [current[index], ...current.filter((_, i) => i !== index)])
  const remove = (index) => onChange((current) => current.filter((_, i) => i !== index))

  return (
    <div>
      <label htmlFor="photos" className="mb-1.5 block text-sm font-medium">Photos ({images.length} of {max})</label>
      <input id="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple
        disabled={busy || images.length >= max} onChange={add}
        className="block w-full text-sm file:mr-4 file:h-11 file:rounded-none file:border-0 file:bg-blush file:px-5 file:text-rose-deep" />
      <p className="mt-1.5 text-xs text-muted">Tall (2:3) photos look best. The first photo is the cover.</p>
      <div aria-live="polite">
        {busy && <p className="mt-2 text-sm text-muted">Preparing photos…</p>}
        {problems.map((message) => <p key={message} className="mt-2 text-sm text-red-700">{message}</p>)}
      </div>
      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((src, index) => (
            <li key={`${index}-${src.slice(-24)}`}>
              <div className="aspect-[2/3] overflow-hidden rounded-xl bg-blush"><DressImage src={src} alt={`Photo ${index + 1}`} /></div>
              <div className="mt-2 flex flex-col gap-2">
                {index === 0
                  ? <p className="grid h-11 place-items-center text-sm font-medium text-rose-deep">Cover photo</p>
                  : <Button variant="outline" onClick={() => makeCover(index)} aria-label={`Make photo ${index + 1} the cover`}>Make cover</Button>}
                <Button variant="outline" onClick={() => remove(index)} aria-label={`Remove photo ${index + 1}`}>Remove</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
