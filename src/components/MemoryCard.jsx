import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Image, Video, BookOpen, ArrowUpRight } from 'lucide-react'

const typeConfig = {
  photo: { icon: Image, label: 'Photo', className: 'tag-photo', accent: 'from-blue-400 to-blue-500' },
  video: { icon: Video, label: 'Video', className: 'tag-video', accent: 'from-purple-400 to-purple-500' },
  story: { icon: BookOpen, label: 'Story', className: 'tag-story', accent: 'from-rose-400 to-rose-500' },
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/memories/${memory.slug || memory.id}`} className="block group">
        <article className="relative bg-white rounded-3xl shadow-card overflow-hidden h-full flex flex-col cursor-pointer transition-shadow duration-300 group-hover:shadow-hover">

          {/* Animated gradient border on hover */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
            style={{
              background: 'linear-gradient(135deg, #fda4af, #e9d5ff, #fda4af)',
              backgroundSize: '300% 300%',
              animation: 'gradientBorder 4s ease infinite',
              padding: '1px',
            }}
          />

          {/* Cover Image */}
          <div className="relative overflow-hidden aspect-memory bg-warm-100">
            {memory.cover_image ? (
              <img
                src={memory.cover_image}
                alt={memory.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
                style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-lavender-100">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <TypeIcon size={40} className="text-rose-300" />
                </motion.div>
              </div>
            )}

            {/* Gradient overlay — slides up on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

            {/* Type badge */}
            <motion.div
              className="absolute top-3 left-3"
              whileHover={{ scale: 1.1 }}
            >
              <span className={`${type.className} backdrop-blur-sm shadow-sm`}>
                <TypeIcon size={11} />
                {type.label}
              </span>
            </motion.div>

            {/* Arrow icon reveals on hover */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <ArrowUpRight size={14} className="text-warm-700" />
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

            {/* Read more */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-400 group-hover:text-rose-600 transition-colors mt-auto pt-1">
              <span>Open memory</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </div>
          </div>

          {/* Bottom gradient accent bar */}
          <div
            className={`h-0.5 bg-gradient-to-r ${type.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
          />
        </article>
      </Link>
    </motion.div>
  )
}
