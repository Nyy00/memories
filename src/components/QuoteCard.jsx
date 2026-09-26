import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export default function QuoteCard({ quote, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card p-8 relative overflow-hidden group hover:shadow-hover transition-shadow duration-300"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-50 to-transparent rounded-bl-full opacity-60" />

      {/* Quote icon */}
      <div className="relative mb-4">
        <Quote size={28} className="text-rose-300 fill-rose-100" />
      </div>

      {/* Text */}
      <blockquote className="relative font-serif text-lg md:text-xl text-warm-700 leading-relaxed italic">
        {quote.text}
      </blockquote>

      {/* Author */}
      {quote.author && (
        <cite className="block mt-4 text-sm text-warm-400 not-italic">
          — {quote.author}
        </cite>
      )}

      {/* Bottom accent */}
      <div className="mt-6 w-10 h-0.5 bg-gradient-to-r from-rose-300 to-lavender-300 rounded-full group-hover:w-16 transition-all duration-300" />
    </motion.div>
  )
}
