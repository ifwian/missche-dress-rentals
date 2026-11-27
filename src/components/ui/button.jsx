import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-none text-xs font-semibold uppercase tracking-[0.16em] transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-rose text-ivory hover:bg-rose-deep',
        outline: 'border border-rose/40 text-rose-deep hover:bg-blush',
        light: 'bg-ivory text-charcoal hover:bg-blush',
      },
      size: { default: 'h-11 px-6', lg: 'h-12 px-8', icon: 'size-11' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  const type = asChild ? undefined : (props.type ?? 'button')
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} type={type} />
}
