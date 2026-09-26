import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Image, Video, BookOpen } from 'lucide-react'

const typeConfig = {
  photo: { icon: Image, label: 'Photo', className: 'tag-photo' },
  video: { icon: Video, label: 'Video', className: 'tag-video' },
  story: { icon: BookOpen, label: 'Story', className: 'tag-story' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function MemoryCard({ memory, index = 0 }) {
  const type = typeConfig[memory.type] || typeConfig.story
  const TypeIcon = type.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link to={`/memories/${memory.slug || memory.id}`} className="block group">
        <article className="card-hover h-full flex flex-col">
          {/* Cover Image */}
          <div className="relative overflow-hidden aspect-memory bg-warm-100">
            {memory.cover_image ? (
              <img
                src={memory.cover_image}
                alt={memory.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-lavender-100">
                <TypeIcon size={40} className="text-rose-300" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Type badge */}
            <div className="absolute top-3 left-3">
              <span className={type.className}>
                <TypeIcon size={11} />
                {type.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5 gap-3">
            <h3 className="font-display text-xl text-warm-800 group-hover:text-rose-600 transition-colors duration-200 leading-tight">
              {memory.title}
            </h3>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 text-xs text-warm-400">
              {memory.memory_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {formatDate(memory.memory_date)}
                </span>
              )}
              {memory.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  {memory.location}
                </span>
              )}
            </div>

            {/* Description */}
            {memory.description && (
              <p className="text-sm text-warm-500 leading-relaxed line-clamp-3 flex-1">
                {memory.description}
              </p>
            )}

            {/* Read more hint */}
            <div className="text-xs font-medium text-rose-400 group-hover:text-rose-500 transition-colors mt-auto">
              Open memory →
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
