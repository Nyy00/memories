import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react'

export default function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const current = images[currentIndex]

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [handleKey])

  if (!current) return null

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-3 sm:p-6"
      style={{ minHeight: '100dvh' }}
      onClick={onClose}
    >
      {/* Top Floating Controls */}
      <div
        className="fixed top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 flex items-center justify-between z-30 pointer-events-none"
      >
        <div className="pointer-events-auto px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-lg text-white text-xs sm:text-sm font-medium shadow-md">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/35 active:scale-90 backdrop-blur-lg flex items-center justify-center text-white transition-all shadow-md"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/35 active:scale-90 backdrop-blur-lg flex items-center justify-center text-white transition-all shadow-md"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Center Content Wrapper - Always centered vertically and horizontally */}
      <div
        className="w-full max-w-2xl flex flex-col items-center justify-center m-auto pt-14 pb-8 z-20 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            {/* Media Box */}
            <div className="relative flex items-center justify-center w-full">
              {current.type === 'video' ? (
                <video
                  src={current.url || current.image_url}
                  controls
                  autoPlay
                  className="max-h-[58vh] sm:max-h-[66vh] max-w-full rounded-2xl shadow-2xl bg-black object-contain mx-auto"
                  poster={current.thumb}
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                <img
                  src={current.url || current.image_url}
                  alt={current.caption || 'Memory'}
                  className="max-h-[58vh] sm:max-h-[66vh] max-w-full rounded-2xl shadow-2xl object-contain mx-auto"
                />
              )}
            </div>

            {/* Caption & Details */}
            {(current.caption || current.date || current.location) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3.5 bg-white/95 rounded-2xl px-5 py-3 text-center max-w-md w-full shadow-xl"
              >
                {current.caption && (
                  <p className="text-warm-900 font-semibold text-sm sm:text-base leading-snug">
                    {current.caption}
                  </p>
                )}
                <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  {current.date && (
                    <span className="flex items-center gap-1 text-warm-600 text-xs font-medium">
                      <Calendar size={12} className="text-rose-500" />
                      {new Date(current.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {current.location && (
                    <span className="flex items-center gap-1 text-warm-600 text-xs font-medium">
                      <MapPin size={12} className="text-rose-500" />
                      {current.location}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/35 active:scale-90 backdrop-blur-lg flex items-center justify-center text-white transition-all shadow-md"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </motion.div>
  )

  // Use React Portal to attach to document.body, escaping any parent transforms/containers
  return createPortal(content, document.body)
}
