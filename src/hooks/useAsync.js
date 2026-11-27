import { useCallback, useEffect, useState } from 'react'
import { HAS_BACKEND } from '@/lib/backend'

/** Runs an async loader and exposes loading / error / data. Pass a stable function. */
export function useAsync(loader) {
  const [state, setState] = useState({ status: 'loading', data: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setState({ status: 'loading', data: null })
    loader().then(
      (data) => active && setState({ status: 'success', data }),
      () => active && setState({ status: 'error', data: null }),
    )
    return () => {
      active = false
    }
  }, [loader, attempt])

  // With a shared database, quietly refresh when the person returns to this tab so
  // availability changed by the owner shows up (not instant: this is not real-time).
  useEffect(() => {
    if (!HAS_BACKEND) return undefined
    let active = true
    const refresh = () => {
      if (document.visibilityState !== 'visible') return
      loader().then((data) => active && setState({ status: 'success', data }), () => {})
    }
    document.addEventListener('visibilitychange', refresh)
    return () => {
      active = false
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [loader])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { ...state, retry }
}
