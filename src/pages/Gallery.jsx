import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Images, Sparkles, Play } from 'lucide-react'
import ImageLightbox from '../components/ImageLightbox'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { useFetch } from '../hooks/useMemory'
import { getGalleryImages } from '../services/memoryService'

function GallerySkeleton() {
  const heights = [200, 280, 240, 320, 200, 260, 300, 220, 280, 200, 240, 300]
  return (
    <div className="masonry-grid">
      {heights.map((h, i) => (
        <div key={i} className="masonry-item">
          <div className="skeleton rounded-2xl" style={{ height: h }} />
        </div>
      ))}
    </div>
  )
}

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const fetcher = useCallback(() => getGalleryImages(), [])
  const { data: images, loading, error, refetch } = useFetch(fetcher)

  const normalizedImages = (images || []).map((img) => ({
    id: img.id,
    url: img.url || img.image_url,           // video_url untuk video, cover_image untuk foto
    thumb: img.thumb || img.url || img.image_url, // selalu cover_image untuk thumbnail grid
    caption: img.caption,
    date: img.date || img.created_at,
    location: img.location || img.memories?.location,
    type: img.type || 'photo',
  }))

  return (
    <div className="pt-20 pb-24 min-h-screen">
      {/* Animated Header */}
      <div className="relative overflow-hidden border-b border-rose-100">
        {/* Animated gradient bg */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(160deg, #fff1f2 0%, #fafaf9 60%, #faf5ff 100%)',
              'linear-gradient(160deg, #faf5ff 0%, #fff1f2 60%, #fafaf9 100%)',
              'linear-gradient(160deg, #fff1f2 0%, #fafaf9 60%, #faf5ff 100%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating blobs */}
        <motion.div
          className="absolute top-0 right-0 w-48 h-48 rounded-full bg-rose-200/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(40px)' }}
        />
        <motion.div
          className="absolute bottom-0 left-10 w-36 h-36 rounded-full bg-lavender-200/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ filter: 'blur(40px)' }}
        />

        <div className="page-container py-16 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-4"
            >
              <Images size={30} className="text-rose-400 mx-auto" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl text-warm-800 mb-3">Photo Gallery</h1>
            <p className="text-warm-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
              Moments frozen in time, each one a chapter of our story.
            </p>
            {!loading && images && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-500 text-xs font-medium"
              >
                <Sparkles size={11} />
                {images.length} photos
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="page-container py-12">
        {loading ? (
          <GallerySkeleton />
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : normalizedImages.length === 0 ? (
          <EmptyState title="No photos yet." subtitle="Our gallery is waiting to be filled." />
        ) : (
          <div className="masonry-grid">
            {normalizedImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: Math.min(i * 0.04, 0.6),
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                whileHover={{ y: -4, zIndex: 10 }}
                className="masonry-item cursor-pointer group"
                onClick={() => setLightboxIdx(i)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-warm-100">
                  {/* Thumbnail grid selalu pakai cover_image (img.thumb) */}
                  <img
                    src={img.thumb}
                    alt={img.caption || `Photo ${i + 1}`}
                    className="w-full object-cover block transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Video play overlay */}
                  {img.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <Play size={20} className="text-white fill-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4">
                    {img.caption && (
                      <motion.p
                        className="text-white text-sm font-medium translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        {img.caption}
                      </motion.p>
                    )}
                  </div>

                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-rose-400/0 group-hover:ring-rose-400/40 transition-all duration-400" />

                  {/* Corner shine */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <ImageLightbox
            images={normalizedImages}
            currentIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx((i) => (i - 1 + normalizedImages.length) % normalizedImages.length)}
            onNext={() => setLightboxIdx((i) => (i + 1) % normalizedImages.length)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
