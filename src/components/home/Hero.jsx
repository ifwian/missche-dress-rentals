import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlurFade } from '@/components/magicui/blur-fade'
import { BUSINESS } from '@/config/business'

/** Campaign hero. With real photos configured it becomes a full-bleed slideshow; without, it is a typographic cover. */
export default function Hero() {
  const images = BUSINESS.campaignImages
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2 || reduce) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % images.length), 5500)
    return () => clearInterval(timer)
  }, [images.length, reduce])

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-charcoal text-ivory md:min-h-[min(46rem,calc(100svh-5rem))]">
      {images.length > 0 && (
        <>
          <AnimatePresence initial={false}>
            <motion.img key={images[index]} src={images[index]} alt="" className="absolute inset-0 -z-10 size-full object-cover"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 1.2 }} />
          </AnimatePresence>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        </>
      )}
      <div className="container-page pb-12 pt-24 sm:pb-16">
        <BlurFade>
          <p className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-rose-dusty">Vietnam &amp; Bangkok dress collections</p>
        </BlurFade>
        <h1 className="text-[3.6rem] leading-[0.95] sm:text-8xl lg:text-[9rem]">
          <BlurFade delay={0.05} className="block">Rent It.</BlurFade>
          <BlurFade delay={0.15} className="block italic text-rose-dusty">Wear It.</BlurFade>
          <BlurFade delay={0.25} className="block">Slay It.</BlurFade>
        </h1>
        <BlurFade delay={0.35}>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-base text-ivory/85 sm:text-lg">Discover beautiful dresses for every moment worth remembering.</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <Button asChild size="lg" variant="light"><Link to="/collection">Explore the collection<ArrowRight aria-hidden="true" /></Link></Button>
              <a href="#how-it-works" className="py-2 text-xs font-semibold uppercase tracking-[0.16em] underline underline-offset-8">How renting works</a>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
