import { cn } from '@/lib/utils'

/** Editorial heading. Left-aligned by default; pass align="center" for centred pages. */
export default function SectionHeading({ eyebrow, title, children, as: Tag = 'h2', align = 'left', className }) {
  return (
    <div className={cn('mb-10 max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-rose">{eyebrow}</p>}
      <Tag className="text-4xl sm:text-5xl">{title}</Tag>
      {children && <p className="mt-4 text-muted">{children}</p>}
    </div>
  )
}
