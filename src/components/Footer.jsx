import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-warm-100 mt-20">
      <div className="page-container py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500 fill-rose-500 animate-heartbeat" />
            <span className="font-display text-xl font-semibold text-warm-800">
              Our Memories
            </span>
          </div>

          {/* Tagline */}
          <p className="text-warm-400 text-sm italic font-serif">
            "Made with love."
          </p>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-warm-500">
            {[
              { to: '/', label: 'Home' },
              { to: '/memories', label: 'Memories' },
              { to: '/timeline', label: 'Timeline' },
              { to: '/gallery', label: 'Gallery' },
              { to: '/videos', label: 'Videos' },
              { to: '/notes', label: 'Love Notes' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-rose-500 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-16 h-px bg-rose-200 rounded-full" />

          {/* Copyright */}
          <p className="text-warm-400 text-xs">
            © {year} Our Memories ❤️ — A private digital memory book.
          </p>
        </div>
      </div>
    </footer>
  )
}
