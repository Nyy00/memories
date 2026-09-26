import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import TimelineItem from '../components/TimelineItem'
import { TimelineItemSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { useFetch } from '../hooks/useMemory'
import { getTimeline } from '../services/memoryService'

export default function Timeline() {
  const fetcher = useCallback(() => getTimeline(), [])
  const { data: events, loading, error, refetch } = useFetch(fetcher)

  return (
    <div className="pt-20 pb-24 min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-b from-rose-50 to-warm-50 border-b border-rose-100">
        <div className="page-container py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart size={28} className="text-rose-400 fill-rose-300 mx-auto mb-4 animate-heartbeat" />
            <h1 className="section-title text-4xl md:text-5xl mb-3">Our Journey</h1>
            <p className="section-subtitle max-w-md mx-auto">
              Every step we took together, from the very beginning.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
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
          <div className="relative">
            {events.map((event, i) => (
              <TimelineItem
                key={event.id}
                event={event}
                index={i}
                isLast={i === events.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
