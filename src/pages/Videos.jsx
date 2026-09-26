import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Video as VideoIcon, Play, Calendar, MapPin, X } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-hover group"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video bg-warm-200">
        {video.cover_image ? (
          <img
            src={video.cover_image}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-rose-100 flex items-center justify-center">
            <VideoIcon size={40} className="text-purple-300" />
          </div>
        )}
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <Play size={22} className="text-rose-500 ml-1 fill-rose-500" />
          </div>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg text-warm-800 group-hover:text-rose-600 transition-colors mb-2">
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
    </motion.div>
  )
}

function VideoModal({ video, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-warm-900/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
      >
        <X size={20} />
      </button>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {video.video_url ? (
          <video
            src={video.video_url}
            controls
            autoPlay
            className="w-full rounded-2xl bg-black"
            poster={video.cover_image}
          >
            Your browser doesn't support video.
          </video>
        ) : (
          <div className="aspect-video bg-warm-800 rounded-2xl flex flex-col items-center justify-center gap-4">
            <VideoIcon size={48} className="text-warm-500" />
            <p className="text-warm-400 text-center px-6">
              Video URL not available. Add the video to Supabase Storage and update the video_url in the database.
            </p>
          </div>
        )}
        <div className="mt-4 text-center">
          <h3 className="font-display text-xl text-white">{video.title}</h3>
          {video.description && (
            <p className="text-white/60 text-sm mt-1">{video.description}</p>
          )}
        </div>
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
        <div className="bg-gradient-to-b from-purple-50 to-warm-50 border-b border-purple-100">
          <div className="page-container py-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <VideoIcon size={28} className="text-purple-400 mx-auto mb-4" />
              <h1 className="section-title text-4xl md:text-5xl mb-3">Our Videos</h1>
              <p className="section-subtitle max-w-md mx-auto">
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

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  )
}
