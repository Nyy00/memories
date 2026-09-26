import { useState, useEffect } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      if (result.error) {
        setError(result.error)
      } else {
        setData(result.data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, refetch }
}

export function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, ...options }
    )

    const current = ref.current
    if (current) observer.observe(current)
    return () => current && observer.unobserve(current)
  }, [ref, options])

  return isVisible
}
