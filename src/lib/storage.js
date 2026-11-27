// Small wrapper so a blocked or full localStorage never crashes the site.
export function readStore(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch {
    return null
  }
}

export function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    throw new Error('This browser could not save the change (storage is full or blocked).')
  }
}

export function removeStore(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    throw new Error('This browser blocked access to saved data.')
  }
}
