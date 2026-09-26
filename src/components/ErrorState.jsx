import { motion } from 'framer-motion'
import { RefreshCw, WifiOff } from 'lucide-react'

export default function ErrorState({
  title = 'Something went wrong.',
  subtitle = "We couldn't load our memories.",
  onRetry,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mb-6">
        <WifiOff size={32} className="text-warm-400" />
      </div>
      <h3 className="font-display text-2xl text-warm-700 mb-2">{title}</h3>
      <p className="text-warm-400 text-base max-w-sm mb-8">{subtitle}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </motion.div>
  )
}
