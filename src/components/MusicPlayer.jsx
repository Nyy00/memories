import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Music2 } from 'lucide-react'

// Animated equalizer bars shown while playing
function EqualizerBars() {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {[
        { cls: 'animate-eq-1', h: 6 },
        { cls: 'animate-eq-2', h: 14 },
        { cls: 'animate-eq-3', h: 10 },
        { cls: 'animate-eq-1', h: 8, delay: '0.3s' },
        { cls: 'animate-eq-2', h: 12, delay: '0.15s' },
      ].map((bar, i) => (
        <motion.span
          key={i}
          className={`block w-[3px] rounded-full bg-white ${bar.cls}`}
          style={{
            height: bar.h,
            animationDelay: bar.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Show the label briefly on first mount
    const timer = setTimeout(() => setShowLabel(true), 2000)
    const hideTimer = setTimeout(() => setShowLabel(false), 5000)
    return () => { clearTimeout(timer); clearTimeout(hideTimer) }
  }, [])

  useEffect(() => {
    const playAttempt = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setHasInteracted(true)
          })
          .catch(() => {
            // Autoplay blocked by browser — normal behaviour
          })
      }
    }

    const handleInteraction = () => {
      playAttempt()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('scroll', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('scroll', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('scroll', handleInteraction)
    }
  }, [hasInteracted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
      setHasInteracted(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} loop src="/music.mp3" />

      <div className="fixed bottom-6 left-6 z-[100] flex items-center gap-2">
        {/* Tooltip label */}
        <AnimatePresence>
          {showLabel && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-xl px-3 py-1.5 shadow-soft border border-warm-100 flex items-center gap-1.5"
            >
              <Music2 size={12} className="text-rose-400" />
              <span className="text-warm-600 text-xs font-medium whitespace-nowrap">Play music</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-hover transition-colors duration-300 ${
            isPlaying
              ? 'bg-rose-500 text-white'
              : 'bg-white text-rose-500 border border-rose-100'
          }`}
          title="Play/Pause Background Music"
        >
          {/* Pulse rings when playing */}
          {isPlaying && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full bg-rose-400"
                animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.span
                className="absolute inset-0 rounded-full bg-rose-300"
                animate={{ scale: [1, 2.2], opacity: [0.25, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.35 }}
              />
            </>
          )}

          {/* Icon: equalizer bars when playing, play icon when paused */}
          <div className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div
                  key="eq"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <EqualizerBars />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
                  transition={{ duration: 0.2 }}
                >
                  <Play size={18} className="ml-0.5 fill-rose-500 text-rose-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>
    </>
  )
}
