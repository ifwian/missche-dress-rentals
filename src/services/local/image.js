// Turns an uploaded file into something a dress record can store. Today: a resized
// JPEG data URL kept in this browser. With a backend: upload the file here and
// return its URL; nothing else needs to change.
const MAX_SIDE = 1100
const MAX_BYTES = 15 * 1024 * 1024
const TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const localImageService = {
  async prepare(file) {
    if (!TYPES.includes(file.type)) throw new Error(`${file.name}: use a JPG, PNG or WebP photo.`)
    if (file.size > MAX_BYTES) throw new Error(`${file.name}: the file is larger than 15 MB.`)
    let bitmap
    try {
      bitmap = await createImageBitmap(file)
    } catch {
      throw new Error(`${file.name}: this photo could not be read.`)
    }
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    return canvas.toDataURL('image/jpeg', 0.78)
  },
}
