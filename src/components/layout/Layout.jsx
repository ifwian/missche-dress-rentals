import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import HelpFab from './HelpFab'

export default function Layout() {
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {/* Gentle fade on every page change (skipped for reduced motion). */}
        <motion.div key={pathname} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <HelpFab />
    </div>
  )
}
