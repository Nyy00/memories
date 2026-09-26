import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Images } from 'lucide-react'
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

  // Normalize image format
  const normalizedImages = (images || []).map((img) => ({
    id: img.id,
    url: img.url || img.image_url,
    caption: img.caption,
    date: img.date || img.created_at,
    location: img.location || img.memories?.location,
  }))

  return (
    <div className="pt-20 pb-24 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-rose-50 to-warm-50 border-b border-rose-100">
        <div className="page-container py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Images size={28} className="text-rose-400 mx-auto mb-4" />
            <h1 className="section-title text-4xl md:text-5xl mb-3">Photo Gallery</h1>
            <p className="section-subtitle max-w-md mx-auto">
              Moments frozen in time, each one a chapter of our story.
            </p>
            {!loading && images && (
              <p className="text-warm-400 text-sm mt-3">{images.length} photos</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Gallery */}
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
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="masonry-item cursor-pointer group"
                onClick={() => setLightboxIdx(i)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-warm-100">
                  <img
                    src={img.url}
                    alt={img.caption || `Photo ${i + 1}`}
                    className="w-full object-cover block transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    {img.caption && (
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <ImageLightbox
          images={normalizedImages}
          currentIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => (i - 1 + normalizedImages.length) % normalizedImages.length)}
          onNext={() => setLightboxIdx((i) => (i + 1) % normalizedImages.length)}
        />
      )}
    </div>
  )
}
