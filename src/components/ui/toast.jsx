import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

const ToastContext = createContext(() => {})
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const dismiss = useCallback((id) => setItems((list) => list.filter((t) => t.id !== id)), [])
  const toast = useMemo(() => {
    const push = (kind) => (text) => {
      const id = crypto.randomUUID()
      setItems((list) => [...list.slice(-3), { id, kind, text }])
      setTimeout(() => dismiss(id), kind === 'error' ? 7000 : 4000)
    }
    return { success: push('success'), error: push('error') }
  }, [dismiss])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} role={t.kind === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full max-w-md items-start gap-3 border border-charcoal/15 bg-white p-3 text-sm shadow-lift">
            {t.kind === 'error' ? <XCircle className="mt-0.5 size-5 shrink-0 text-red-700" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-800" aria-hidden="true" />}
            <p className="flex-1 py-0.5"><span className="font-semibold">{t.kind === 'error' ? 'Error: ' : 'Done: '}</span>{t.text}</p>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="-m-2 grid size-11 place-items-center"><X className="size-4" aria-hidden="true" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
