import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video as VideoIcon, Play, Calendar, MapPin, X, Sparkles } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FloatingHearts from '../components/FloatingHearts'
import { useFetch } from '../hooks/useMemory'
import { getVideos } from '../services/memoryService'

function VideoCard({ video, index, onClick }) {
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <article className="bg-white rounded-3xl shadow-card overflow-hidden transition-shadow duration-300 group-hover:shadow-hover">
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video bg-warm-200">
          {video.cover_image ? (
            <img
              src={video.cover_image}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-rose-100 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <VideoIcon size={40} className="text-purple-300" />
              </motion.div>
            </div>
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Animated play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
            >
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/40"
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              />
              <Play size={22} className="text-rose-500 ml-1 fill-rose-500 relative z-10" />
            </motion.div>
          </div>

          {/* Shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            }}
          />

          {/* Duration badge if available */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
              <Play size={9} className="fill-white" />
              Play
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-lg text-warm-800 group-hover:text-rose-600 transition-colors duration-200 mb-2">
            {video.title}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-warm-400 mb-3">
            {video.memory_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={11} />
                {formatDate(video.memory_date)}
              </span>
            )}
            {video.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={11} />
                {video.location}
              </span>
            )}
          </div>
          {video.description && (
            <p className="text-sm text-warm-500 leading-relaxed line-clamp-2">{video.description}</p>
          )}
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 bg-gradient-to-r from-purple-300 to-rose-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </article>
    </motion.div>
  )
}

function VideoModal({ video, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-warm-900/92 p-4 lightbox-overlay"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-colors"
      >
        <X size={20} />
      </motion.button>

      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {video.video_url ? (
          <video
            src={video.video_url}
            controls
            autoPlay
            className="w-full rounded-3xl bg-black shadow-2xl"
            poster={video.cover_image}
          >
            Your browser doesn't support video.
          </video>
        ) : (
          <div className="aspect-video bg-warm-800 rounded-3xl flex flex-col items-center justify-center gap-4">
            <VideoIcon size={48} className="text-warm-500" />
            <p className="text-warm-400 text-center px-6 max-w-sm">
              Video URL not available. Add the video to Supabase Storage and update the video_url in the database.
            </p>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-center"
        >
          <h3 className="font-display text-xl text-white">{video.title}</h3>
          {video.description && (
            <p className="text-white/60 text-sm mt-1">{video.description}</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function VideoSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-video" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-xl" />
        <div className="flex gap-3">
          <div className="skeleton h-4 w-24 rounded-lg" />
        </div>
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-4/5 rounded-lg" />
      </div>
    </div>
  )
}

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState(null)
  const fetcher = useCallback(() => getVideos(), [])
  const { data: videos, loading, error, refetch } = useFetch(fetcher)

  return (
    <>
      <div className="pt-20 pb-24 min-h-screen">
        {/* Header */}
        <div className="relative overflow-hidden border-b border-purple-100">
          {/* Animated bg */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(160deg, #f5f3ff 0%, #fafaf9 60%, #fff1f2 100%)',
                'linear-gradient(160deg, #faf5ff 0%, #f5f3ff 60%, #fafaf9 100%)',
                'linear-gradient(160deg, #f5f3ff 0%, #fafaf9 60%, #fff1f2 100%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-200/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{ filter: 'blur(40px)' }}
          />

          {/* Floating hearts */}
          <FloatingHearts count={10} />

          <div className="page-container py-16 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block mb-4"
              >
                <VideoIcon size={30} className="text-purple-400 mx-auto" />
              </motion.div>
              <h1 className="font-display text-4xl md:text-5xl text-warm-800 mb-3">Our Videos</h1>
              <p className="text-warm-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                Moving pictures, living memories.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Grid */}
        <div className="page-container py-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <VideoSkeleton key={i} />)}
            </div>
          ) : error ? (
            <ErrorState onRetry={refetch} />
          ) : !videos || videos.length === 0 ? (
            <EmptyState
              title="No videos yet."
              subtitle="Our moving memories will appear here."
              icon={VideoIcon}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((v, i) => (
                <VideoCard
                  key={v.id}
                  video={v}
                  index={i}
                  onClick={() => setActiveVideo(v)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
