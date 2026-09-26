import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Image, Video, BookOpen, Grid3X3 } from 'lucide-react'
import MemoryCard from '../components/MemoryCard'
import { MemoryCardSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { getMemories } from '../services/memoryService'

const TYPES = [
  { value: null, label: 'All', icon: Grid3X3 },
  { value: 'photo', label: 'Photos', icon: Image },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'story', label: 'Stories', icon: BookOpen },
]

const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
]

export default function Memories() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [type, setType] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('newest')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await getMemories({ type, search, sort })
    if (err) setError(err)
    else setMemories(data || [])
    setLoading(false)
  }, [type, search, sort])

  useEffect(() => {
    load()
  }, [load])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400)
    return () => clearTimeout(t)
  }, [searchInput])

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-10 pb-8 text-center"
        >
          <h1 className="section-title text-4xl md:text-5xl mb-3">All Memories</h1>
          <p className="section-subtitle max-w-md mx-auto">
            Every moment we've shared, collected in one place.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              id="memory-search"
              placeholder="Search memories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400"
            />
            <select
              id="memory-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none cursor-pointer w-full sm:w-auto"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Type filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex gap-2 mb-10 overflow-x-auto pb-1"
        >
          {TYPES.map((t) => {
            const Icon = t.icon
            const isActive = type === t.value
            return (
              <button
                key={String(t.value)}
                id={`filter-${t.value || 'all'}`}
                onClick={() => setType(t.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-rose'
                    : 'bg-white text-warm-600 border border-warm-200 hover:border-rose-300 hover:text-rose-500'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            )
          })}
        </motion.div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-warm-400 mb-6">
            {memories.length} {memories.length === 1 ? 'memory' : 'memories'} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <MemoryCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : memories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((m, i) => (
              <MemoryCard key={m.id} memory={m} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
