import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Play } from 'lucide-react'

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
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!current) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center lightbox-overlay bg-warm-900/90"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {current.type === 'video' ? (
            <video
              src={current.url || current.image_url}
              controls
              autoPlay
              className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl"
              poster={current.thumb}
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <img
              src={current.url || current.image_url}
              alt={current.caption || 'Memory'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
          )}

          {/* Caption area */}
          {(current.caption || current.date || current.location) && (
            <div className="glass rounded-2xl px-6 py-3 text-center max-w-lg w-full">
              {current.caption && (
                <p className="text-warm-800 font-medium text-sm">{current.caption}</p>
              )}
              <div className="flex items-center justify-center gap-4 mt-1">
                {current.date && (
                  <span className="flex items-center gap-1 text-warm-500 text-xs">
                    <Calendar size={11} />
                    {new Date(current.date).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                )}
                {current.location && (
                  <span className="flex items-center gap-1 text-warm-500 text-xs">
                    <MapPin size={11} />
                    {current.location}
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
