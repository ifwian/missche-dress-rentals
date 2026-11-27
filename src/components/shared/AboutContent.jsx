import { BUSINESS } from '@/config/business'

export default function AboutContent() {
  return (
    <div className="max-w-2xl">
      <p className="font-display text-3xl leading-snug sm:text-4xl">Beautiful dresses direct from Vietnam &amp; BKK. Your dream dresses are here, where luxury meets affordability.</p>
      <p className="mt-10 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-rose">Perfect for</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {BUSINESS.occasions.map((occasion) => (
          <li key={occasion} className="border border-rose-dusty px-4 py-2 text-xs uppercase tracking-[0.14em]">{occasion}</li>
        ))}
      </ul>
    </div>
  )
}
