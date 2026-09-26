import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import QuoteCard from '../components/QuoteCard'
import { QuoteCardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { useFetch } from '../hooks/useMemory'
import { getQuotes } from '../services/memoryService'

export default function Notes() {
  const fetcher = useCallback(() => getQuotes(), [])
  const { data: quotes, loading, error, refetch } = useFetch(fetcher)

  return (
    <div className="pt-20 pb-24 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-rose-50 via-pink-50 to-warm-50 border-b border-rose-100">
        <div className="page-container py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart size={28} className="text-rose-400 fill-rose-300 mx-auto mb-4 animate-heartbeat" />
            <h1 className="section-title text-4xl md:text-5xl mb-3">Love Notes</h1>
            <p className="section-subtitle max-w-md mx-auto">
              Words that live in the space between us.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Intro */}
      <div className="page-container max-w-3xl py-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-lg text-warm-600 italic leading-relaxed"
        >
          "Some feelings are too big for words, but we try anyway.
          <br />
          These are our attempts."
        </motion.p>
      </div>

      {/* Notes grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {quotes.map((q, i) => (
              <QuoteCard key={q.id} quote={q} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom flourish */}
      <div className="page-container max-w-3xl pt-16 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center gap-4 justify-center mb-6">
            <div className="h-px flex-1 max-w-20 bg-rose-200" />
            <Heart size={18} className="text-rose-400 fill-rose-300 animate-heartbeat" />
            <div className="h-px flex-1 max-w-20 bg-rose-200" />
          </div>
          <p className="font-serif text-warm-500 italic">
            "Every word here is true."
          </p>
        </motion.div>
      </div>
    </div>
  )
}
