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

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: isEven ? -50 : 50,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1],
        delay: 0.1,
      },
    },
  }

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 },
    },
  }

  return (
    <div ref={ref} className="relative">
      {/* Vertical connecting line */}
      {!isLast && (
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="absolute left-6 top-14 bottom-0 w-px origin-top md:left-1/2 md:-translate-x-px"
          style={{
            background: 'linear-gradient(to bottom, #fda4af, #e9d5ff, transparent)',
          }}
        />
      )}

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        className={`flex gap-4 md:gap-0 pb-12 ${
          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        }`}
      >
        {/* Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`flex-1 md:w-5/12 md:max-w-[calc(50%-3rem)] ${
            isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
          } ml-16 md:ml-0`}
        >
          <div className="group bg-white rounded-3xl shadow-card p-6 hover:shadow-hover transition-all duration-300 relative overflow-hidden">
            {/* Hover gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,241,242,0.5) 0%, rgba(250,245,255,0.5) 100%)',
              }}
            />

            {/* Year badge */}
            <div
              className={`relative flex items-center gap-2 mb-3 ${
                isEven ? 'md:justify-end' : 'md:justify-start'
              }`}
            >
              <motion.span
                whileHover={{ scale: 1.08 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-500 text-xs font-medium rounded-full border border-rose-100"
              >
                <Calendar size={11} />
                {formatYear(event.event_date)}
              </motion.span>
            </div>

            <h3 className="relative font-display text-xl text-warm-800 mb-2 group-hover:text-rose-700 transition-colors duration-200">
              {event.title}
            </h3>

            <p className="relative text-warm-500 text-sm leading-relaxed mb-3">
              {event.description}
            </p>

            <p className="relative text-xs text-warm-400">{formatDate(event.event_date)}</p>

            {/* Image */}
            {event.image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-4 rounded-2xl overflow-hidden aspect-video bg-warm-100 group/img relative"
              >
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-600 group-hover/img:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl pointer-events-none" />
              </motion.div>
            )}

            {/* Bottom accent line */}
            <div
              className={`absolute bottom-0 h-0.5 bg-gradient-to-r from-rose-300 to-lavender-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${
                isEven ? 'right-0 origin-right' : 'left-0 origin-left'
              }`}
              style={{ width: '100%' }}
            />
          </div>
        </motion.div>

        {/* Center emoji dot */}
        <div className="absolute left-0 top-6 md:static md:flex md:items-start md:justify-center md:w-2/12 md:pt-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isVisible ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, type: 'spring', stiffness: 260, damping: 16 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="w-12 h-12 rounded-full bg-white border-2 border-rose-300 shadow-rose flex items-center justify-center text-xl z-10 relative cursor-default"
          >
            {event.emoji || '❤️'}

            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-rose-300"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: index * 0.3 }}
            />
          </motion.div>
        </div>

        {/* Spacer */}
        <div className="hidden md:block md:flex-1 md:w-5/12" />
      </motion.div>
    </div>
  )
}
