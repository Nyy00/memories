import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/memories', label: 'Memories' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
  { to: '/notes', label: 'Love Notes' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-warm-200/60 shadow-soft'
            : 'bg-transparent'
        }`}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-rose-400 via-rose-500 to-lavender-400 z-10"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />

        <nav className="page-container flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Heart size={20} className="text-rose-500 fill-rose-500 animate-heartbeat" />
            </motion.div>
            <motion.span
              className="font-display text-lg font-semibold text-warm-800 tracking-wide"
              whileHover={{ color: '#e11d48' }}
              transition={{ duration: 0.2 }}
            >
              Our Memories
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
              >
                {({ isActive }) => (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="relative px-4 py-2"
                  >
                    <span
                      className={`text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-rose-600'
                          : 'text-warm-600 hover:text-warm-800'
                      }`}
                    >
                      {link.label}
                    </span>

                    {/* Active indicator pill */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 rounded-xl bg-rose-50 -z-10"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Hover underline */}
                    {!isActive && (
                      <motion.div
                        className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-rose-400 to-lavender-400"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileHover={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.25 }}
                        style={{ originX: 0 }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Toggle */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-warm-600 hover:bg-warm-100 transition-colors"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-warm-900/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-xl flex flex-col"
            >
              {/* Decorative gradient strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-rose-500 to-lavender-400" />

              <div className="flex items-center justify-between p-5 border-b border-warm-100 mt-1">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-rose-500 fill-rose-500 animate-heartbeat" />
                  <span className="font-display text-base font-semibold text-warm-800">
                    Our Memories
                  </span>
                </div>
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-warm-500 hover:bg-warm-100"
                  whileTap={{ scale: 0.9, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-rose-600 bg-rose-50 shadow-sm'
                            : 'text-warm-700 hover:bg-warm-50 hover:pl-6'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <span className="flex items-center gap-3">
                          {isActive && (
                            <motion.span
                              layoutId="mobile-indicator"
                              className="w-1.5 h-1.5 rounded-full bg-rose-500"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            />
                          )}
                          {link.label}
                        </span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="p-5 border-t border-warm-100">
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-xs text-warm-400 text-center flex items-center justify-center gap-1"
                >
                  Made with
                  <Heart size={10} className="text-rose-400 fill-rose-400 inline" />
                  for us
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
