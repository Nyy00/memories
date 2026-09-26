import { motion } from 'framer-motion'
import { Heart, Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'No memories yet.',
  subtitle = 'Maybe this is where our next story begins.',
  icon: Icon = Inbox,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center">
          <Icon size={32} className="text-rose-300" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white shadow-soft flex items-center justify-center">
          <Heart size={14} className="text-rose-400 fill-rose-400" />
        </div>
      </div>

      {/* Text */}
      <h3 className="font-display text-2xl text-warm-700 mb-2">{title}</h3>
      <p className="text-warm-400 text-base max-w-sm leading-relaxed italic">
        "{subtitle}"
      </p>
    </motion.div>
  )
}
