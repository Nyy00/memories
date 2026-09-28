import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, ArrowLeft, ArrowRight, Image, Video, BookOpen, Quote } from 'lucide-react'
import ImageLightbox from '../components/ImageLightbox'
import ErrorState from '../components/ErrorState'
import { getMemoryById, getMemoriesNavigation } from '../services/memoryService'

const typeConfig = {
  photo: { icon: Image, label: 'Photo' },
  video: { icon: Video, label: 'Video' },
  story: { icon: BookOpen, label: 'Story' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Skeleton for detail page
function DetailSkeleton() {
  return (
    <div className="pt-20 pb-20">
      <div className="skeleton h-[60vh] w-full" />
      <div className="page-container py-10 space-y-6 max-w-4xl">
        <div className="skeleton h-10 w-2/3 rounded-2xl" />
        <div className="flex gap-4">
          <div className="skeleton h-5 w-32 rounded-lg" />
          <div className="skeleton h-5 w-24 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-4 rounded-lg" style={{ width: `${90 - i * 10}%` }} />)}
        </div>
      </div>
    </div>
  )
}

export default function MemoryDetail() {
  const { id } = useParams()
  const [memory, setMemory] = useState(null)
  const [images, setImages] = useState([])
  const [nav, setNav] = useState({ prev: null, next: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lightboxIdx, setLightboxIdx] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, images: imgs, error: err } = await getMemoryById(id)
    if (err || !data) {
      setError(err || new Error('Not found'))
      setLoading(false)
      return
    }
    setMemory(data)
    setImages(imgs || [])
    const navRes = await getMemoriesNavigation(data.id)
    setNav(navRes)
    setLoading(false)
  }, [id])

  useEffect(() => {
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [load])

  if (loading) return <DetailSkeleton />
  if (error) return (
    <div className="pt-28">
      <ErrorState
        title="Memory not found."
        subtitle="This memory may have been moved or doesn't exist."
        onRetry={load}
      />
    </div>
  )

  const type = typeConfig[memory.type] || typeConfig.story
  const TypeIcon = type.icon

  // Combine cover + gallery for lightbox
  const allImages = [
    ...(memory.cover_image ? [{ id: 'cover', url: memory.cover_image, caption: memory.title, date: memory.memory_date, location: memory.location, type: memory.type === 'video' && memory.video_url ? 'photo' : memory.type }] : []),
    ...images.map((img) => ({ 
      id: img.id, 
      url: img.image_url, 
      caption: img.caption, 
      date: memory.memory_date, 
      location: memory.location,
      type: img.type || 'photo'
    })),
  ]

  return (
    <>
      <div className="pt-16 pb-20 min-h-screen">
        {/* Cover Image Hero */}
        {memory.cover_image && (
          <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-warm-900">
            <img
              src={memory.cover_image}
              alt={memory.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-warm-900/80 via-warm-900/20 to-transparent" />

            {/* Back button */}
            <Link
              to="/memories"
              className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium glass px-4 py-2 rounded-full transition-colors"
            >
              <ArrowLeft size={14} />
              All Memories
            </Link>

            {/* Type badge */}
            <div className="absolute top-6 right-6">
              <span className={`tag ${memory.type === 'photo' ? 'tag-photo' : memory.type === 'video' ? 'tag-video' : 'tag-story'}`}>
                <TypeIcon size={11} />
                {type.label}
              </span>
            </div>

            {/* Hero title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="page-container max-w-4xl">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="font-display text-3xl md:text-5xl text-white mb-3"
                >
                  {memory.title}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="flex flex-wrap gap-4 text-white/70 text-sm"
                >
                  {memory.memory_date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {formatDate(memory.memory_date)}
                    </span>
                  )}
                  {memory.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      {memory.location}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="page-container max-w-4xl py-10">
          {/* Title (if no cover) */}
          {!memory.cover_image && (
            <div className="mb-8">
              <Link
                to="/memories"
                className="inline-flex items-center gap-2 text-warm-500 hover:text-rose-500 text-sm mb-6 transition-colors"
              >
                <ArrowLeft size={14} />
                All Memories
              </Link>
              <h1 className="font-display text-4xl md:text-5xl text-warm-800 mb-4">
                {memory.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-warm-400 text-sm">
                {memory.memory_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formatDate(memory.memory_date)}
                  </span>
                )}
                {memory.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    {memory.location}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {memory.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="prose max-w-none mb-8"
            >
              <p className="text-warm-600 text-lg leading-relaxed">{memory.description}</p>
            </motion.div>
          )}

          {/* Quote */}
          {memory.quote && (
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative my-10 pl-6 border-l-4 border-rose-300"
            >
              <Quote size={28} className="text-rose-200 fill-rose-100 mb-2" />
              <p className="font-serif text-xl md:text-2xl text-warm-700 italic leading-relaxed">
                "{memory.quote}"
              </p>
            </motion.blockquote>
          )}

          {/* Video */}
          {memory.video_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="my-10"
            >
              <h2 className="font-display text-2xl text-warm-800 mb-4">Video</h2>
              <div className="rounded-3xl overflow-hidden bg-warm-900 aspect-video">
                <video
                  src={memory.video_url}
                  controls
                  className="w-full h-full"
                  poster={memory.cover_image}
                >
                  Your browser does not support video playback.
                </video>
              </div>
            </motion.div>
          )}

          {/* Gallery */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="my-10"
            >
              <h2 className="font-display text-2xl text-warm-800 mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative overflow-hidden rounded-2xl aspect-square bg-warm-100 cursor-pointer group"
                    onClick={() => setLightboxIdx(i + (memory.cover_image ? 1 : 0))}
                  >
                    {/* Render video atau foto berdasarkan tipe */}
                    {img.type === 'video' ? (
                      <video
                        src={img.image_url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        playsInline
                      />
                    ) : (
                      <img
                        src={img.image_url}
                        alt={img.caption || `Gallery ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Overlay Icon: Play untuk video, Image untuk foto */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      {img.type === 'video' ? (
                        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center border border-white/30">
                          <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-white ml-1"></div>
                        </div>
                      ) : (
                        <Image size={24} className="text-white" />
                      )}
                    </div>
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50">
                        <p className="text-white text-xs">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-warm-100 grid grid-cols-2 gap-4">
            {nav.prev ? (
              <Link
                to={`/memories/${nav.prev.slug || nav.prev.id}`}
                className="group flex items-start gap-3 p-4 rounded-2xl hover:bg-warm-50 transition-colors"
              >
                <ArrowLeft size={18} className="text-warm-400 group-hover:text-rose-500 mt-0.5 shrink-0 transition-colors" />
                <div>
                  <p className="text-xs text-warm-400 mb-1">← Previous Memory</p>
                  <p className="text-sm font-medium text-warm-700 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {nav.prev.title}
                  </p>
                </div>
              </Link>
            ) : <div />}

            {nav.next ? (
              <Link
                to={`/memories/${nav.next.slug || nav.next.id}`}
                className="group flex items-start gap-3 p-4 rounded-2xl hover:bg-warm-50 transition-colors text-right ml-auto w-full justify-end"
              >
                <div>
                  <p className="text-xs text-warm-400 mb-1">Next Memory →</p>
                  <p className="text-sm font-medium text-warm-700 group-hover:text-rose-600 transition-colors line-clamp-2">
                    {nav.next.title}
                  </p>
                </div>
                <ArrowRight size={18} className="text-warm-400 group-hover:text-rose-500 mt-0.5 shrink-0 transition-colors" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <ImageLightbox
          images={allImages}
          currentIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => (i - 1 + allImages.length) % allImages.length)}
          onNext={() => setLightboxIdx((i) => (i + 1) % allImages.length)}
        />
      )}
    </>
  )
}
