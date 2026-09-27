import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, Image, Video, BookOpen, Grid3X3, Sparkles } from 'lucide-react'
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

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export default function Memories() {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [type, setType] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('newest')
  const [focused, setFocused] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await getMemories({ type, search, sort })
    if (err) setError(err)
    else setMemories(data || [])
    setLoading(false)
  }, [type, search, sort])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400)
    return () => clearTimeout(t)
  }, [searchInput])

  return (
    <div className="pt-20 pb-20 min-h-screen">
      {/* Animated header */}
      <div className="relative overflow-hidden border-b border-warm-100">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(160deg, #fff1f2 0%, #fafaf9 100%)',
              'linear-gradient(160deg, #fafaf9 0%, #faf5ff 100%)',
              'linear-gradient(160deg, #fff1f2 0%, #fafaf9 100%)',
            ],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 top-0 w-40 h-40 rounded-full bg-rose-200/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
          style={{ filter: 'blur(40px)' }}
        />

        <div className="page-container py-14 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <h1 className="font-display text-4xl md:text-5xl text-warm-800 mb-3">All Memories</h1>
            <p className="text-warm-500 text-base md:text-lg max-w-md mx-auto">
              Every moment we've shared, collected in one place.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="page-container pt-10 pb-10">
        {/* Search + Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          {/* Search with animated focus ring */}
          <motion.div
            className="relative flex-1"
            animate={{ scale: focused ? 1.01 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ color: focused ? '#f43f5e' : '#a8a29e' }}
              className="absolute left-4 top-1/2 -translate-y-1/2"
            >
              <Search size={16} />
            </motion.div>
            <input
              type="text"
              id="memory-search"
              placeholder="Search memories…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="input-field pl-10 transition-all duration-300"
              style={{
                boxShadow: focused ? '0 0 0 3px rgba(244,63,94,0.12)' : undefined,
              }}
            />
            {/* Animated bottom line */}
            <motion.div
              className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-rose-400 to-lavender-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focused ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0.5 }}
            />
          </motion.div>

          {/* Sort select */}
          <div className="relative">
            <SlidersHorizontal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400" />
            <select
              id="memory-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none cursor-pointer w-full sm:w-auto"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Type filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex gap-2 mb-10 overflow-x-auto pb-1"
        >
          {TYPES.map((t, i) => {
            const Icon = t.icon
            const isActive = type === t.value
            return (
              <motion.button
                key={String(t.value)}
                id={`filter-${t.value || 'all'}`}
                onClick={() => setType(t.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors duration-200 overflow-hidden ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-rose'
                    : 'bg-white text-warm-600 border border-warm-200 hover:border-rose-300 hover:text-rose-500'
                }`}
              >
                {/* Active shimmer sweep */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                  />
                )}
                <Icon size={14} className="relative z-10" />
                <span className="relative z-10">{t.label}</span>

                {/* Active dot */}
                {isActive && (
                  <motion.span
                    layoutId="filter-dot"
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Results count */}
        <AnimatePresence mode="wait">
          {!loading && (
            <motion.p
              key={memories.length}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-warm-400 mb-6 flex items-center gap-1.5"
            >
              <Sparkles size={12} className="text-rose-300" />
              {memories.length} {memories.length === 1 ? 'memory' : 'memories'} found
            </motion.p>
          )}
        </AnimatePresence>

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
          <AnimatePresence mode="wait">
            <motion.div
              key={`${type}-${sort}-${search}`}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {memories.map((m, i) => (
                <MemoryCard key={m.id} memory={m} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
