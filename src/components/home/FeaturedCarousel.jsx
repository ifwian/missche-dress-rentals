import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AsyncContent from '@/components/shared/AsyncContent'
import StateMessage from '@/components/shared/StateMessage'
import DressCard from '@/components/dresses/DressCard'

/** Horizontal, swipeable product row with snap scrolling and previous/next buttons. */
export default function FeaturedCarousel({ state }) {
  const track = useRef(null)
  const scroll = (direction) => {
    const el = track.current
    el?.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section className="py-20 sm:py-28" aria-labelledby="featured-title">
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-rose">Featured</p>
            <h2 id="featured-title" className="text-4xl sm:text-5xl">The edit</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/collection" className="hidden py-2 text-xs font-semibold uppercase tracking-[0.16em] underline underline-offset-8 sm:block">View all</Link>
            <div className="hidden gap-2 md:flex">
              <button type="button" onClick={() => scroll(-1)} aria-label="Previous dresses" className="grid size-11 place-items-center border border-rose-dusty hover:bg-blush"><ChevronLeft className="size-4" aria-hidden="true" /></button>
              <button type="button" onClick={() => scroll(1)} aria-label="Next dresses" className="grid size-11 place-items-center border border-rose-dusty hover:bg-blush"><ChevronRight className="size-4" aria-hidden="true" /></button>
            </div>
          </div>
        </div>
        <AsyncContent {...state}>
          {(dresses) => dresses.length === 0
            ? <StateMessage title="New pieces will appear here soon" />
            : (
              <>
                <ul ref={track} tabIndex={0} aria-label="Featured dresses"
                  className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 sm:gap-6 [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto">
                  {dresses.map((dress) => (
                    <li key={dress.id} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-[27%]"><DressCard dress={dress} /></li>
                  ))}
                </ul>
                {dresses.some((d) => d.isSample) && <p className="mt-6 text-xs text-muted">Listings marked “Sample” are for demonstration only. Availability shown is for today.</p>}
              </>
            )}
        </AsyncContent>
      </div>
    </section>
  )
}
