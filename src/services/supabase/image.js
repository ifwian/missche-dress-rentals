// Resizes in the browser (same rules as the local demo), uploads to Supabase Storage and
// returns the public URL. Only the signed-in owner may upload (Storage policies).
import { IMAGE_BUCKET, explain, supabase } from '@/lib/backend'
import { localImageService } from '../local/image'

export const PUBLIC_PREFIX = `/storage/v1/object/public/${IMAGE_BUCKET}/`

/** Storage path of one of our public URLs, or null for anything else. */
export const pathFromUrl = (url) => {
  const i = typeof url === 'string' ? url.indexOf(PUBLIC_PREFIX) : -1
  return i < 0 ? null : decodeURIComponent(url.slice(i + PUBLIC_PREFIX.length).split('?')[0])
}

export const supabaseImageService = {
  async prepare(file) {
    const dataUrl = await localImageService.prepare(file) // validates type/size, resizes to 1100px JPEG
    const blob = await (await fetch(dataUrl)).blob()
    const path = `dresses/${crypto.randomUUID()}.jpg`
    const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, {
      contentType: 'image/jpeg',
      cacheControl: '31536000',
      upsert: false,
    })
    if (error) throw new Error(`${file.name}: ${explain(error, 'the upload failed.')}`)
    return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
  },

  /** Deletes files no dress uses any more. Failures are ignored (an orphan file is harmless). */
  async discard(urls) {
    const paths = urls.map(pathFromUrl).filter(Boolean)
    if (paths.length) await supabase.storage.from(IMAGE_BUCKET).remove(paths)
  },
}
