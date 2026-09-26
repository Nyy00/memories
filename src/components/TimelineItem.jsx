import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../hooks/useMemory'
import { Calendar } from 'lucide-react'

function formatYear(dateStr) {
  return new Date(dateStr).getFullYear()
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function TimelineItem({ event, index, isLast }) {
  const ref = useRef(null)
  const isVisible = useIntersectionObserver(ref)
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className="relative">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-rose-200 to-transparent md:left-1/2 md:-translate-x-px" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className={`flex gap-4 md:gap-0 pb-12 ${
          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        }`}
      >
        {/* Content */}
        <div
          className={`flex-1 md:w-5/12 md:max-w-[calc(50%-3rem)] ${
            isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
          } ml-16 md:ml-0`}
        >
          <div className="card p-6 hover:shadow-hover transition-shadow duration-300">
            {/* Year badge */}
            <div
              className={`flex items-center gap-2 mb-3 ${
                isEven ? 'md:justify-end' : 'md:justify-start'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-500 text-xs font-medium rounded-full">
                <Calendar size={11} />
                {formatYear(event.event_date)}
              </span>
            </div>

            <h3 className="font-display text-xl text-warm-800 mb-2">
              {event.title}
            </h3>

            <p className="text-warm-500 text-sm leading-relaxed mb-3">
              {event.description}
            </p>

            <p className="text-xs text-warm-400">{formatDate(event.event_date)}</p>

            {/* Image */}
            {event.image_url && (
              <div className="mt-4 rounded-2xl overflow-hidden aspect-video bg-warm-100">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        {/* Center dot */}
        <div className="absolute left-0 top-6 md:static md:flex md:items-start md:justify-center md:w-2/12 md:pt-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
            className="w-12 h-12 rounded-full bg-white border-2 border-rose-300 shadow-rose flex items-center justify-center text-xl z-10 relative"
          >
            {event.emoji || '❤️'}
          </motion.div>
        </div>

        {/* Spacer for alternating layout */}
        <div className="hidden md:block md:flex-1 md:w-5/12" />
      </motion.div>
    </div>
  )
}
