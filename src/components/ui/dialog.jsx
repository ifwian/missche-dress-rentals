// Native <dialog>: the browser provides focus trapping, Escape to close and focus return.
import { useEffect, useRef } from 'react'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Dialog({ open, onClose, title, children, footer }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])
  if (!open) return null
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-labelledby="dialog-title"
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto border border-charcoal/15 bg-white p-0 text-charcoal shadow-lift backdrop:bg-charcoal/50">
      <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 p-5">
        <h2 id="dialog-title" className="text-2xl">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close dialog" className="-m-2 grid size-11 shrink-0 place-items-center hover:bg-blush"><X className="size-5" aria-hidden="true" /></button>
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="flex flex-col-reverse gap-2 border-t border-charcoal/10 p-5 sm:flex-row sm:justify-end">{footer}</div>}
    </dialog>
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', busy, onConfirm, onClose }) {
  return (
    <Dialog open={open} onClose={busy ? () => {} : onClose} title={title}
      footer={<>
        <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button onClick={onConfirm} disabled={busy}>{busy && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}{busy ? 'Working…' : confirmLabel}</Button>
      </>}>
      <p className="text-muted">{message}</p>
    </Dialog>
  )
}
