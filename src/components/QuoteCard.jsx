import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Quote } from 'lucide-react'

export default function QuoteCard({ quote, index = 0 }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-60, 60], [4, -4])
  const rotateY = useTransform(x, [-60, 60], [-4, 4])

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative bg-white rounded-3xl shadow-card overflow-hidden p-8 h-full flex flex-col transition-shadow duration-300 group-hover:shadow-hover">
        {/* Animated gradient background decoration */}
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-60"
          animate={{
            background: [
              'linear-gradient(225deg, #fff1f2, transparent)',
              'linear-gradient(225deg, #faf5ff, transparent)',
              'linear-gradient(225deg, #fff1f2, transparent)',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Animated gradient border on hover (via box-shadow) */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(244,63,94,0.2), 0 8px 32px rgba(244,63,94,0.1)',
          }}
        />

        {/* Floating quote icon */}
        <motion.div
          className="relative mb-5 self-start"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-50 to-lavender-50 flex items-center justify-center">
            <Quote size={20} className="text-rose-400 fill-rose-100" />
          </div>
        </motion.div>

        {/* Text with stagger reveal */}
        <blockquote className="relative flex-1 font-serif text-lg md:text-xl text-warm-700 leading-relaxed italic">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
          >
            {quote.text}
          </motion.span>
        </blockquote>

        {/* Author */}
        {quote.author && (
          <motion.cite
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="block mt-5 text-sm text-warm-400 not-italic"
          >
            — {quote.author}
          </motion.cite>
        )}

        {/* Animated bottom accent bar */}
        <div className="mt-5 relative h-0.5 bg-warm-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-300 to-lavender-300 rounded-full"
            initial={{ width: '2.5rem' }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}
