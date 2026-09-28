import { useEffect, useCallback } from 'react'
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
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!current) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[120] overflow-y-auto overflow-x-hidden lightbox-overlay bg-black/85 flex flex-col justify-between p-4 md:p-8"
      onClick={onClose}
    >
      {/* Top Bar: Counter & Close button */}
      <div
        className="w-full flex items-center justify-between z-20 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Counter */}
        <div className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs md:text-sm font-medium shadow-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200 active:scale-95 shadow-md"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Center Area: Navigation buttons + Media container */}
      <div className="relative my-auto w-full flex items-center justify-center py-4">
        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200 active:scale-90 shadow-md"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Media (Image / Video) & Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col items-center max-w-full max-h-[76vh] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {current.type === 'video' ? (
              <video
                src={current.url || current.image_url}
                controls
                autoPlay
                className="max-w-[90vw] md:max-w-4xl max-h-[62vh] rounded-2xl shadow-2xl bg-black object-contain"
                poster={current.thumb}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <img
                src={current.url || current.image_url}
                alt={current.caption || 'Memory'}
                className="max-w-[90vw] md:max-w-4xl max-h-[62vh] object-contain rounded-2xl shadow-2xl"
              />
            )}

            {/* Caption & Metadata */}
            {(current.caption || current.date || current.location) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3.5 glass rounded-2xl px-5 py-2.5 text-center max-w-md w-full shadow-lg border border-white/20"
              >
                {current.caption && (
                  <p className="text-warm-900 font-semibold text-sm leading-snug">
                    {current.caption}
                  </p>
                )}
                <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-1">
                  {current.date && (
                    <span className="flex items-center gap-1 text-warm-600 text-xs">
                      <Calendar size={12} className="text-rose-500" />
                      {new Date(current.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {current.location && (
                    <span className="flex items-center gap-1 text-warm-600 text-xs">
                      <MapPin size={12} className="text-rose-500" />
                      {current.location}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-200 active:scale-90 shadow-md"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom spacer for balance */}
      <div className="h-2 w-full pointer-events-none" />
    </motion.div>
  )
}
