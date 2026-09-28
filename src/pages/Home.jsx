import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Heart, ArrowRight, Images, Video, Clock, Star } from 'lucide-react'
import MemoryCard from '../components/MemoryCard'
import QuoteCard from '../components/QuoteCard'
import { MemoryCardSkeleton } from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import {
  getFeaturedMemories,
  getLatestMemories,
  getMemoryStats,
  getGalleryImages,
  getTimeline,
  getQuotes,
} from '../services/memoryService'

// ─── Animated Counter ────────────────────────────────────────────────────

function AnimatedCounter({ value, duration = 1.5, decimals = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => { setDisplay(0) }, [value])

  useEffect(() => {
    if (!isInView || !value) return
    let start = 0
    const end = Number(value)
    const steps = duration * 60
    const increment = end / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(decimals > 0 ? parseFloat(start.toFixed(decimals)) : Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, value, duration, decimals])

  return <span ref={ref}>{decimals > 0 ? Number(display).toFixed(decimals) : display}</span>
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero({ featuredImage }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-warm-50 to-lavender-50" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-rose-100/40 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-lavender-100/40 blur-3xl" />

      <div className="relative page-container py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-rose-400" />
              <span className="text-rose-500 text-sm font-medium tracking-widest uppercase">
                Private Memory Book
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-warm-800 leading-tight">
              Our{' '}
              <span className="gradient-text">Memories</span>
            </h1>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-lg md:text-xl text-warm-600 leading-relaxed italic border-l-2 border-rose-300 pl-4"
          >
            "Every picture has a story.
            <br />
            Every story has a memory.
            <br />
            And every memory has you."
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex items-center gap-2 text-warm-500 text-sm"
          >
            <Heart size={14} className="text-rose-400 fill-rose-400 animate-heartbeat" />
            <span>Together since 17 June 2025</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/memories" className="btn-primary">
              Explore Our Memories
              <ArrowRight size={16} />
            </Link>
            <Link to="/timeline" className="btn-secondary">
              Our Journey
            </Link>
          </motion.div>
        </div>

        {/* Featured image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-hover aspect-[4/5] max-h-[600px]">
            {featuredImage ? (
              <img
                src={featuredImage}
                alt="Featured memory"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-lavender-100 flex items-center justify-center">
                <Heart size={64} className="text-rose-300 fill-rose-200 animate-float" />
              </div>
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-warm-900/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass rounded-2xl px-4 py-3">
                <p className="text-warm-800 text-sm font-medium">Welcome To Our Gallery</p>
                <p className="text-warm-500 text-xs mt-0.5">Dony & Jemila</p>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -left-4 glass rounded-2xl px-4 py-2 shadow-card flex items-center gap-2 z-10"
          >
            <Heart size={14} className="text-rose-500 fill-rose-500" />
            <span className="text-warm-700 text-sm font-medium">Made with love</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-2 shadow-card flex items-center gap-2 z-10"
          >
            <Star size={14} className="text-rose-400 fill-rose-300" />
            <span className="text-warm-700 text-sm font-medium">Our story</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-warm-400 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-rose-300 to-transparent"
        />
      </motion.div>
    </section>
  )
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function StatsSection({ stats }) {
  const items = [
    { label: 'Memories', value: stats?.total || 0, icon: Heart, decimals: 0 },
    { label: 'Photos', value: stats?.photos || 0, icon: Images, decimals: 0 },
    { label: 'Videos', value: stats?.videos || 0, icon: Video, decimals: 0 },
    { label: 'Years Together', value: stats?.years || 0, icon: Clock, decimals: 1 },
  ]

  return (
    <section className="py-16 bg-white border-y border-warm-100">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-rose-100 transition-colors"
                >
                  <Icon size={22} className="text-rose-500" />
                </motion.div>
                <div className="font-display text-3xl md:text-4xl text-warm-800 font-medium tabular-nums">
                  <AnimatedCounter value={item.value} decimals={item.decimals} />
                </div>
                <div className="text-warm-400 text-sm mt-1">{item.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, linkTo, linkLabel = 'See all' }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle mt-2 max-w-md">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-rose-500 text-sm font-medium hover:text-rose-600 flex items-center gap-1 shrink-0 transition-colors"
        >
          {linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}

// ─── Gallery Preview ─────────────────────────────────────────────────────────

function GalleryPreview({ images }) {
  const preview = images.slice(0, 6)

  return (
    <section className="py-20 bg-warm-50">
      <div className="page-container">
        <SectionHeader
          title="Photo Gallery"
          subtitle="A glimpse of our moments, frozen in time."
          linkTo="/gallery"
          linkLabel="Full Gallery"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {preview.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative overflow-hidden rounded-2xl bg-warm-100 group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'
                }`}
            >
              <img
                src={img.thumb || img.url}
                alt={img.caption || 'Gallery'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/gallery" className="btn-secondary">
            <Images size={16} />
            View All Photos
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Timeline Preview ────────────────────────────────────────────────────────

function TimelinePreview({ events }) {
  const preview = events.slice(0, 3)

  return (
    <section className="py-20 bg-white">
      <div className="page-container">
        <SectionHeader
          title="Our Journey"
          subtitle="The milestones that shaped us."
          linkTo="/timeline"
          linkLabel="Full Timeline"
        />
        <div className="space-y-4">
          {preview.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 p-5 rounded-3xl bg-warm-50 hover:bg-rose-50 transition-colors duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-rose-200 shadow-soft flex items-center justify-center text-xl shrink-0">
                {event.emoji || '❤️'}
              </div>
              <div>
                <p className="text-xs text-rose-400 font-medium mb-1">
                  {new Date(event.event_date).getFullYear()}
                </p>
                <h3 className="font-display text-lg text-warm-800">{event.title}</h3>
                <p className="text-warm-500 text-sm mt-1 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Love Note Preview ───────────────────────────────────────────────────────

function LoveNotePreview({ quote }) {
  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-lavender-50">
      <div className="page-container max-w-3xl">
        <div className="text-center mb-10">
          <Heart size={28} className="text-rose-400 fill-rose-300 mx-auto mb-4 animate-heartbeat" />
          <h2 className="section-title">A Note for You</h2>
        </div>
        {quote && (
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center font-serif text-xl md:text-2xl text-warm-700 leading-relaxed italic"
          >
            "{quote.text}"
          </motion.blockquote>
        )}
        <div className="mt-8 text-center">
          <Link to="/notes" className="btn-primary">
            <Heart size={16} />
            Read All Notes
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Home Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [featuredMemories, setFeaturedMemories] = useState([])
  const [latestMemories, setLatestMemories] = useState([])
  const [stats, setStats] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [timeline, setTimeline] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [feat, latest, statsRes, gallery, tl, q] = await Promise.all([
        getFeaturedMemories(),
        getLatestMemories(6),
        getMemoryStats(),
        getGalleryImages(),
        getTimeline(),
        getQuotes(),
      ])
      setFeaturedMemories(feat.data || [])
      setLatestMemories(latest.data || [])
      setStats(statsRes.data)
      setGalleryImages(gallery.data || [])
      setTimeline(tl.data || [])
      setQuotes(q.data || [])
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const featuredImage = featuredMemories[0]?.cover_image || latestMemories[0]?.cover_image

  if (error) {
    return (
      <div className="pt-20">
        <ErrorState onRetry={load} />
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <Hero featuredImage={featuredImage} />

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Featured Memories */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <SectionHeader
            title="Featured Memories"
            subtitle="The moments we treasure the most."
            linkTo="/memories"
          />
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <MemoryCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMemories.slice(0, 3).map((m, i) => (
                <MemoryCard key={m.id} memory={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Memories */}
      <section className="py-20 bg-warm-50">
        <div className="page-container">
          <SectionHeader
            title="Latest Memories"
            subtitle="Our most recent stories."
            linkTo="/memories"
          />
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <MemoryCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestMemories.map((m, i) => (
                <MemoryCard key={m.id} memory={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview */}
      {galleryImages.length > 0 && <GalleryPreview images={galleryImages} />}

      {/* Timeline Preview */}
      {timeline.length > 0 && <TimelinePreview events={timeline} />}

      {/* Love Note */}
      {quotes.length > 0 && <LoveNotePreview quote={quotes[0]} />}

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <div className="page-container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart size={32} className="text-rose-400 fill-rose-300 mx-auto mb-6 animate-heartbeat" />
            <h2 className="section-title mb-4">
              Every Memory Lives Here
            </h2>
            <p className="section-subtitle mb-8">
              A small corner of the internet that holds only our stories.
            </p>
            <Link to="/memories" className="btn-primary">
              Explore Our Memories
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
