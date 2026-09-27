import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef(null)

  // Mencoba play otomatis saat web dibuka (tergantung browser)
  useEffect(() => {
    const playAttempt = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setHasInteracted(true)
          })
          .catch(() => {
            // Autoplay diblock browser, wajar.
          })
      }
    }

    // Coba putar otomatis saat user pertama kali klik halaman
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
      {/* Ganti file music.mp3 nanti di folder public/ */}
      <audio ref={audioRef} loop src="/music.mp3" />
      
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`fixed bottom-6 left-6 z-[100] w-12 h-12 rounded-full flex items-center justify-center shadow-hover transition-colors duration-300 ${
          isPlaying ? 'bg-rose-500 text-white' : 'bg-white text-rose-500 border border-rose-100'
        }`}
        title="Play/Pause Background Music"
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center w-full h-full">
            <Pause size={20} className="relative z-10" />
            <span className="absolute inset-0 rounded-full border-2 border-rose-300 animate-ping opacity-50"></span>
          </div>
        ) : (
          <Play size={20} className="ml-1" />
        )}
      </motion.button>
    </>
  )
}
