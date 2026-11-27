import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { fieldClass } from '@/components/ui/input'

/**
 * Input whose value mirrors the URL without fighting the user's typing: it is left
 * alone while focused, and re-syncs when the value changes elsewhere or on blur.
 */
export default function SyncedInput({ value, className, ...props }) {
  const ref = useRef(null)
  useEffect(() => {
    if (document.activeElement !== ref.current) ref.current.value = value
  }, [value])

  return (
    <input
      ref={ref}
      defaultValue={value}
      onBlur={() => (ref.current.value = value)}
      className={cn(fieldClass, className)}
      {...props}
    />
  )
}
