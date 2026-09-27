import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Heart, ArrowRight, Images, Video, Clock, Star, Sparkles } from 'lucide-react'
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

// ─── Animated counter ────────────────────────────────────────────────────────

function AnimatedCounter({ value, duration = 1.5 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView || value === 0) return
    let start = 0
    const end = Number(value)
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return <span ref={ref}>{display}</span>
}

// ─── Floating Particles ───────────────────────────────────────────────────────

function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 6,
    duration: Math.random() * 8 + 8,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-rose-300/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() > 0.5 ? 20 : -20, 0],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ featuredImage }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  }

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #fff1f2 0%, #fafaf9 40%, #faf5ff 100%)',
            'linear-gradient(135deg, #faf5ff 0%, #fff1f2 40%, #fafaf9 100%)',
            'linear-gradient(135deg, #fafaf9 0%, #faf5ff 40%, #fff1f2 100%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Animated morphing blobs */}
      <motion.div
        className="absolute top-10 right-10 w-96 h-96 bg-rose-200/30"
        animate={{
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
          ],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(60px)', y }}
      />
      <motion.div
        className="absolute bottom-20 left-0 w-80 h-80 bg-lavender-200/25"
        animate={{
          borderRadius: [
            '30% 70% 70% 30% / 30% 30% 70% 70%',
            '70% 30% 30% 70% / 70% 70% 30% 30%',
            '30% 70% 70% 30% / 30% 30% 70% 70%',
          ],
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(70px)' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-rose-100/40"
        animate={{
          scale: [1, 1.3, 0.9, 1],
          opacity: [0.3, 0.5, 0.2, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ filter: 'blur(80px)' }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative page-container py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center z-10"
      >
        {/* Text column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={14} className="text-rose-500" />
              </motion.div>
              <span className="text-rose-500 text-xs font-medium tracking-widest uppercase">
                Private Memory Book
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-warm-800 leading-tight">
              Our{' '}
              <span
                className="gradient-text"
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #c084fc, #f43f5e)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 4s linear infinite',
                }}
              >
                Memories
              </span>
            </h1>
          </motion.div>

          <motion.blockquote
            variants={itemVariants}
            className="font-serif text-lg md:text-xl text-warm-600 leading-relaxed italic border-l-2 border-rose-300 pl-4"
          >
            "Every picture has a story.
            <br />
            Every story has a memory.
            <br />
            And every memory has you."
          </motion.blockquote>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-warm-500 text-sm"
          >
            <Heart size={14} className="text-rose-400 fill-rose-400 animate-heartbeat" />
            <span>Together since 17 June 2025</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <Link to="/memories" className="btn-primary">
              Explore Our Memories
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </Link>
            <Link to="/timeline" className="btn-secondary">
              Our Journey
            </Link>
          </motion.div>
        </motion.div>

        {/* Image column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-glow-lg aspect-[4/5] max-h-[600px] group">
            {featuredImage ? (
              <img
                src={featuredImage}
                alt="Featured memory"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-lavender-100 flex items-center justify-center">
                <Heart size={64} className="text-rose-300 fill-rose-200 animate-float" />
              </div>
            )}
            {/* Multi-stop overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-warm-900/50 via-warm-900/10 to-transparent" />

            {/* Shimmer sweep on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
                animation: 'none',
              }}
            />

            <div className="absolute bottom-6 left-6 right-6">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="glass rounded-2xl px-4 py-3"
              >
                <p className="text-warm-800 text-sm font-medium">Welcome To Our Gallery</p>
                <p className="text-warm-500 text-xs mt-0.5">Dony & Jemila</p>
              </motion.div>
            </div>
          </div>

          {/* Floating tag cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -left-4 glass rounded-2xl px-4 py-2 shadow-card flex items-center gap-2 z-10 border border-white/60"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={14} className="text-rose-500 fill-rose-500" />
            </motion.div>
            <span className="text-warm-700 text-sm font-medium">Made with love</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-2 shadow-card flex items-center gap-2 z-10 border border-white/60"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Star size={14} className="text-rose-400 fill-rose-300" />
            </motion.div>
            <span className="text-warm-700 text-sm font-medium">Our story</span>
          </motion.div>

          {/* Decorative ring */}
          <div className="absolute -inset-3 rounded-[2.5rem] border border-rose-200/40 -z-10" />
          <div className="absolute -inset-6 rounded-[3rem] border border-lavender-200/30 -z-10" />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-warm-400 text-xs tracking-widest uppercase">Scroll</span>
        <div className="relative w-px h-10 overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-rose-400 to-transparent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn' }}
          />
        </div>
      </motion.div>
    </section>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatsSection({ stats }) {
  const items = [
    { label: 'Memories', value: stats?.total || 0, icon: Heart, color: 'rose' },
    { label: 'Photos', value: stats?.photos || 0, icon: Images, color: 'blue' },
    { label: 'Videos', value: stats?.videos || 0, icon: Video, color: 'purple' },
    { label: 'Years Together', value: stats?.years || 0, icon: Clock, color: 'rose' },
  ]

  const colorMap = {
    rose: 'bg-rose-50 text-rose-500 group-hover:bg-rose-100 group-hover:shadow-rose',
    blue: 'bg-blue-50 text-blue-500 group-hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-500 group-hover:bg-purple-100',
  }

  return (
    <section className="py-16 bg-white border-y border-warm-100 relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #fda4af 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="page-container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ y: -4 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-soft ${colorMap[item.color]}`}
                >
                  <Icon size={24} />
                </motion.div>
                <div className="font-display text-3xl md:text-4xl text-warm-800 font-medium tabular-nums">
                  <AnimatedCounter value={item.value} />
                </div>
                <div className="text-warm-400 text-sm mt-1 font-medium">{item.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, linkTo, linkLabel = 'See all' }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-subtitle mt-2 max-w-md"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {linkTo && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to={linkTo}
            className="text-rose-500 text-sm font-medium hover:text-rose-600 flex items-center gap-1 shrink-0 transition-colors group"
          >
            {linkLabel}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={14} />
            </motion.span>
          </Link>
        </motion.div>
      )}
    </div>
  )
}

// ─── Gallery Preview ──────────────────────────────────────────────────────────

function GalleryPreview({ images }) {
  const preview = images.slice(0, 6)

  return (
    <section className="py-20 bg-warm-50 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-lavender-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="page-container relative">
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              className={`relative overflow-hidden rounded-2xl bg-warm-100 group cursor-pointer ${
                i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'
              }`}
            >
              <img
                src={img.url}
                alt={img.caption || 'Gallery'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                <p className="text-white text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {img.caption}
                </p>
              </div>
              {/* Glow ring on hover */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-rose-400/0 group-hover:ring-rose-400/30 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-center"
        >
          <Link to="/gallery" className="btn-secondary">
            <Images size={16} />
            View All Photos
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Timeline Preview ─────────────────────────────────────────────────────────

function TimelinePreview({ events }) {
  const preview = events.slice(0, 3)

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute left-0 top-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-rose-200 to-transparent -translate-y-1/2" />
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
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ x: 6 }}
              className="flex gap-4 p-5 rounded-3xl bg-warm-50 hover:bg-rose-50 transition-colors duration-300 group cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-12 h-12 rounded-full bg-white border border-rose-200 shadow-soft flex items-center justify-center text-xl shrink-0 group-hover:shadow-rose transition-shadow duration-300"
              >
                {event.emoji || '❤️'}
              </motion.div>
              <div>
                <p className="text-xs text-rose-400 font-medium mb-1">
                  {new Date(event.event_date).getFullYear()}
                </p>
                <h3 className="font-display text-lg text-warm-800 group-hover:text-rose-700 transition-colors duration-200">
                  {event.title}
                </h3>
                <p className="text-warm-500 text-sm mt-1 leading-relaxed">
                  {event.description}
                </p>
              </div>
              <motion.div
                className="ml-auto shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={14} className="text-rose-400" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Love Note Preview ────────────────────────────────────────────────────────

function LoveNotePreview({ quote }) {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #fff1f2 0%, #faf5ff 100%)',
            'linear-gradient(135deg, #faf5ff 0%, #ffe4e6 100%)',
            'linear-gradient(135deg, #fff1f2 0%, #faf5ff 100%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        >
          <Heart size={8 + (i % 3) * 4} className="text-rose-300/60 fill-rose-200/60" />
        </motion.div>
      ))}

      <div className="page-container max-w-3xl relative">
        <div className="text-center mb-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart size={28} className="text-rose-400 fill-rose-300 mx-auto mb-4" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            A Note for You
          </motion.h2>
        </div>

        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-white/50 rounded-3xl blur-xl" />
            <blockquote className="relative text-center font-serif text-xl md:text-2xl text-warm-700 leading-relaxed italic px-8 py-6 bg-white/60 rounded-3xl border border-rose-100/60 shadow-soft">
              "{quote.text}"
            </blockquote>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link to="/notes" className="btn-primary">
            <Heart size={16} />
            Read All Notes
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="page-container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="max-w-xl mx-auto"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-6"
          >
            <Heart size={32} className="text-rose-400 fill-rose-300 mx-auto" />
          </motion.div>
          <h2 className="section-title mb-4">Keep making memories.</h2>
          <p className="section-subtitle mb-8">Every moment with you is worth preserving forever.</p>
          <Link to="/memories" className="btn-primary">
            View All Memories
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────

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
      setStats(statsRes)
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

  if (error) {
    return (
      <div className="pt-28">
        <ErrorState onRetry={load} />
      </div>
    )
  }

  const featuredImage = featuredMemories[0]?.cover_image || galleryImages[0]?.url

  return (
    <div>
      <Hero featuredImage={featuredImage} />
      <StatsSection stats={stats} />

      {/* Featured Memories */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <SectionHeader
            title="Featured Memories"
            subtitle="The moments most dear to our hearts."
            linkTo="/memories"
          />
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <MemoryCardSkeleton key={i} />)}
            </div>
          ) : featuredMemories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMemories.map((m, i) => (
                <MemoryCard key={m.id} memory={m} index={i} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {galleryImages.length > 0 && <GalleryPreview images={galleryImages} />}

      {/* Latest Memories */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <SectionHeader
            title="Latest Memories"
            subtitle="Fresh from our story."
            linkTo="/memories"
            linkLabel="See all"
          />
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <MemoryCardSkeleton key={i} />)}
            </div>
          ) : latestMemories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestMemories.map((m, i) => (
                <MemoryCard key={m.id} memory={m} index={i} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {timeline.length > 0 && <TimelinePreview events={timeline} />}
      {quotes.length > 0 && <LoveNotePreview quote={quotes[0]} />}
      <CTASection />
    </div>
  )
}
