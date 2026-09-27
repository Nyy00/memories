import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import Home from './pages/Home'
import Memories from './pages/Memories'
import MemoryDetail from './pages/MemoryDetail'
import TimelinePage from './pages/TimelinePage'
import Gallery from './pages/Gallery'
import Videos from './pages/Videos'
import Notes from './pages/Notes'
import Admin from './pages/Admin'

// Richer per-route transition presets
const routeVariants = {
  '/': {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
    exit:    { opacity: 0, scale: 1.01, transition: { duration: 0.22 } },
  },
  default: {
    initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
    exit:    { opacity: 0, y: -8, filter: 'blur(2px)', transition: { duration: 0.22 } },
  },
}

function getVariants(pathname) {
  return routeVariants[pathname] || routeVariants.default
}

function AnimatedRoutes() {
  const location = useLocation()
  const variants = getVariants(location.pathname)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/memories/:id" element={<MemoryDetail />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="*"
            element={
              <div className="pt-28 pb-20 text-center min-h-screen flex flex-col items-center justify-center">
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="font-display text-7xl text-warm-200 mb-4"
                >
                  404
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="font-display text-3xl text-warm-700 mb-3"
                >
                  Page not found.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-warm-400 mb-8"
                >
                  This page doesn't exist in our memory book.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Link to="/" className="btn-primary">Go Home</Link>
                </motion.div>
              </div>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppLayout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      {!isAdmin && (
        <>
          <MusicPlayer />
          <Footer />
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
