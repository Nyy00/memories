import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/memories/:id" element={<MemoryDetail />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/admin" element={<Admin />} />
          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="pt-28 pb-20 text-center min-h-screen flex flex-col items-center justify-center">
                <p className="font-display text-6xl text-warm-300 mb-4">404</p>
                <h1 className="section-title mb-3">Page not found.</h1>
                <p className="section-subtitle mb-8">This page doesn't exist in our memory book.</p>
                <a href="/" className="btn-primary">Go Home</a>
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
