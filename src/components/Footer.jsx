import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/memories', label: 'Memories' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
  { to: '/notes', label: 'Love Notes' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-warm-100 mt-20 relative overflow-hidden">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/20 to-white pointer-events-none" />

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

      <div className="page-container py-12 relative">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex items-center gap-2 group"
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={20} className="text-rose-500 fill-rose-500" />
            </motion.div>
            <span className="font-display text-xl font-semibold text-warm-800 group-hover:text-rose-600 transition-colors duration-200">
              Our Memories
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-warm-400 text-sm italic font-serif"
          >
            "Made with love."
          </motion.p>

          {/* Nav Links with stagger */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-warm-500"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              >
                <Link
                  to={link.to}
                  className="relative hover:text-rose-500 transition-colors duration-200 group"
                >
                  {link.label}
                  {/* Underline reveal */}
                  <span className="absolute bottom-0 left-0 w-full h-px bg-rose-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Divider with animated hearts */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-rose-200 rounded-full" />
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={12} className="text-rose-300 fill-rose-200" />
            </motion.div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-rose-200 rounded-full" />
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-warm-400 text-xs"
          >
            © {year} Our Memories ❤️ — A private digital memory book.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
