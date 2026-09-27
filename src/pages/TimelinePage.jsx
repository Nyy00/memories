import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import TimelineItem from '../components/TimelineItem'
import { TimelineItemSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { useFetch } from '../hooks/useMemory'
import { getTimeline } from '../services/memoryService'

// Floating hearts in the header
function FloatingHearts() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${8 + i * 9}%`,
            top: `${10 + (i % 4) * 22}%`,
          }}
          animate={{
            y: [0, -16, 0],
            rotate: [-15, 15, -15],
            opacity: [0.15, 0.55, 0.15],
            scale: [0.7, 1.1, 0.7],
          }}
          transition={{
            duration: 3.5 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.35,
          }}
        >
          <Heart
            size={5 + (i % 5) * 5}
            className="text-rose-300 fill-rose-200"
          />
        </motion.div>
      ))}
    </>
  )
}

export default function Timeline() {
  const fetcher = useCallback(() => getTimeline(), [])
  const { data: events, loading, error, refetch } = useFetch(fetcher)

  return (
    <div className="pt-20 pb-24 min-h-screen">
      {/* Animated page header */}
      <div className="relative overflow-hidden border-b border-rose-100">
        {/* Animated gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(160deg, #fff1f2 0%, #fafaf9 55%, #faf5ff 100%)',
              'linear-gradient(160deg, #faf5ff 0%, #fff1f2 55%, #fafaf9 100%)',
              'linear-gradient(160deg, #fff1f2 0%, #fafaf9 55%, #faf5ff 100%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Animated blobs */}
        <motion.div
          className="absolute top-0 right-0 w-56 h-56 rounded-full bg-rose-200/25"
          animate={{
            borderRadius: ['60% 40% 30% 70%/60% 30% 70% 40%', '30% 60% 70% 40%/50% 60% 30% 60%', '60% 40% 30% 70%/60% 30% 70% 40%'],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(50px)' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-lavender-200/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          style={{ filter: 'blur(40px)' }}
        />

        <FloatingHearts />

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
              <Heart size={30} className="text-rose-400 fill-rose-300 mx-auto" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl text-warm-800 mb-3">Our Journey</h1>
            <p className="text-warm-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
              Every step we took together, from the very beginning.
            </p>

            {/* Animated subtitle badge */}
            {!loading && events && events.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-500 text-xs font-medium"
              >
                <Sparkles size={11} />
                {events.length} milestone{events.length !== 1 ? 's' : ''}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Timeline content */}
      <div className="page-container max-w-5xl py-16">
        {loading ? (
          <div className="space-y-0">
            {[...Array(4)].map((_, i) => <TimelineItemSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : !events || events.length === 0 ? (
          <EmptyState
            title="No milestones yet."
            subtitle="Our story is still being written."
          />
        ) : (
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {events.map((event, i) => (
              <TimelineItem
                key={event.id}
                event={event}
                index={i}
                isLast={i === events.length - 1}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
