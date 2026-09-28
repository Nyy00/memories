import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

/**
 * FloatingHearts background animation component
 * @param {number} count - number of floating hearts
 * @param {string} className - optional extra class for the container
 */
export default function FloatingHearts({ count = 12, className = '' }) {
  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 100) / count + (i % 3) * 3}%`,
    top: `${8 + ((i * 17) % 75)}%`,
    size: 8 + (i % 5) * 5, // size 8px to 28px
    duration: 3.5 + (i % 4) * 0.7,
    delay: (i % 6) * 0.4,
    yOffset: 12 + (i % 4) * 6,
    rotate: (i % 2 === 0 ? 1 : -1) * (12 + (i % 3) * 6),
  }))

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: item.left,
            top: item.top,
          }}
          animate={{
            y: [0, -item.yOffset, 0],
            rotate: [-item.rotate, item.rotate, -item.rotate],
            opacity: [0.18, 0.65, 0.18],
            scale: [0.75, 1.15, 0.75],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          <Heart
            size={item.size}
            className="text-rose-300 fill-rose-200 drop-shadow-sm"
          />
        </motion.div>
      ))}
    </div>
  )
}
