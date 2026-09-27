import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import QuoteCard from '../components/QuoteCard'
import { QuoteCardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { useFetch } from '../hooks/useMemory'
import { getQuotes } from '../services/memoryService'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

export default function Notes() {
  const fetcher = useCallback(() => getQuotes(), [])
  const { data: quotes, loading, error, refetch } = useFetch(fetcher)

  return (
    <div className="pt-20 pb-24 min-h-screen">
      {/* Animated header */}
      <div className="relative overflow-hidden border-b border-rose-100">
        {/* Animated gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(160deg, #fff1f2 0%, #fce7f3 40%, #fafaf9 100%)',
              'linear-gradient(160deg, #fce7f3 0%, #faf5ff 40%, #fff1f2 100%)',
              'linear-gradient(160deg, #fff1f2 0%, #fce7f3 40%, #fafaf9 100%)',
            ],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating hearts decoration */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 28}%`,
            }}
            animate={{
              y: [0, -12, 0],
              rotate: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            <Heart
              size={6 + (i % 4) * 4}
              className="text-rose-300 fill-rose-200"
            />
          </motion.div>
        ))}

        <div className="page-container py-16 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-4"
            >
              <Heart size={30} className="text-rose-400 fill-rose-300" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl text-warm-800 mb-3">Love Notes</h1>
            <p className="text-warm-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
              Words that live in the space between us.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Animated intro quote */}
      <div className="page-container max-w-3xl py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative inline-block"
        >
          {/* Background glow */}
          <div className="absolute -inset-4 bg-rose-50/60 rounded-3xl blur-xl pointer-events-none" />
          <p className="relative font-serif text-lg text-warm-600 italic leading-relaxed px-6 py-4">
            "Some feelings are too big for words, but we try anyway.
            <br />
            These are our attempts."
          </p>
        </motion.div>
      </div>

      {/* Notes grid with stagger */}
      <div className="page-container py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[...Array(4)].map((_, i) => <QuoteCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : !quotes || quotes.length === 0 ? (
          <EmptyState
            title="No notes yet."
            subtitle="The words are still being found."
            icon={Heart}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {quotes.map((q, i) => (
              <QuoteCard key={q.id} quote={q} index={i} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Animated flourish */}
      <div className="page-container max-w-3xl pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="flex items-center gap-4 justify-center mb-6">
            <motion.div
              className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-rose-200 rounded-full"
              initial={{ scaleX: 0, originX: 1 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={18} className="text-rose-400 fill-rose-300" />
            </motion.div>
            <motion.div
              className="h-px flex-1 max-w-20 bg-gradient-to-r from-rose-200 to-transparent rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />
          </div>
          <p className="font-serif text-warm-500 italic">
            "Every word here is true."
          </p>
        </motion.div>
      </div>
    </div>
  )
}
