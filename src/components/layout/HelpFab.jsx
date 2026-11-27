import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { POLICY_LINKS } from '@/config/business'

/** Small floating help button (bottom right) that opens FAQs, policies and contact. */
export default function HelpFab() {
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onPointer = (event) => box.current && !box.current.contains(event.target) && setOpen(false)
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={box} className="fixed right-4 z-30 flex flex-col items-end gap-2 [bottom:calc(1rem+env(safe-area-inset-bottom))]">
      <AnimatePresence>
        {open && (
          <motion.ul id="help-menu" aria-label="Help and policies"
            className="w-52 border border-rose-dusty bg-ivory py-1 shadow-lift"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}>
            {POLICY_LINKS.map(({ to, label }) => (
              <li key={to}><Link to={to} className="flex min-h-11 items-center px-4 text-sm hover:bg-blush">{label}</Link></li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <button type="button" aria-expanded={open} aria-controls="help-menu" aria-label={open ? 'Close help menu' : 'Help and policies'}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center rounded-full bg-charcoal text-ivory shadow-lift transition-colors hover:bg-rose-deep">
        {open ? <X className="size-4" aria-hidden="true" /> : <span aria-hidden="true" className="font-display text-xl italic leading-none">?</span>}
      </button>
    </div>
  )
}
