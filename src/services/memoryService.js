import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { seedMemories, seedImages, seedTimeline, seedQuotes, seedGalleryImages } from '../lib/seedData'

// ─── Memories ───────────────────────────────────────────────────────────────

export async function getMemories({ type = null, search = '', sort = 'newest' } = {}) {
  if (!isSupabaseConfigured) {
    let data = [...seedMemories]
    if (type) data = data.filter((m) => m.type === type)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.location?.toLowerCase().includes(q)
      )
    }
    data.sort((a, b) => {
      const da = new Date(a.memory_date)
      const db = new Date(b.memory_date)
      return sort === 'newest' ? db - da : da - db
    })
    return { data, error: null }
  }

  let query = supabase
    .from('memories')
    .select('*')
    .order('memory_date', { ascending: sort === 'oldest' })

  if (type) query = query.eq('type', type)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error } = await query
  return { data: data || [], error }
}

export async function getFeaturedMemories() {
  if (!isSupabaseConfigured) {
    return { data: seedMemories.filter((m) => m.is_featured), error: null }
  }
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('is_featured', true)
    .order('memory_date', { ascending: false })
    .limit(6)
  return { data: data || [], error }
}

export async function getLatestMemories(limit = 6) {
  if (!isSupabaseConfigured) {
    return {
      data: [...seedMemories]
        .sort((a, b) => new Date(b.memory_date) - new Date(a.memory_date))
        .slice(0, limit),
      error: null,
    }
  }
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('memory_date', { ascending: false })
    .limit(limit)
  return { data: data || [], error }
}

export async function getMemoryById(id) {
  if (!isSupabaseConfigured) {
    const memory = seedMemories.find((m) => m.id === id || m.slug === id)
    const images = seedImages[memory?.id] || []
    return { data: memory || null, images, error: memory ? null : new Error('Not found') }
  }

  const { data: memory, error } = await supabase
    .from('memories')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .single()

  if (error) return { data: null, images: [], error }

  const { data: images } = await supabase
    .from('memory_images')
    .select('*')
    .eq('memory_id', memory.id)
    .order('sort_order')

  return { data: memory, images: images || [], error: null }
}

export async function getMemoriesNavigation(currentId) {
  if (!isSupabaseConfigured) {
    const sorted = [...seedMemories].sort(
      (a, b) => new Date(a.memory_date) - new Date(b.memory_date)
    )
    const idx = sorted.findIndex((m) => m.id === currentId || m.slug === currentId)
    return {
      prev: idx > 0 ? sorted[idx - 1] : null,
      next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
    }
  }

  const { data: all } = await supabase
    .from('memories')
    .select('id,slug,title')
    .order('memory_date', { ascending: true })

  if (!all) return { prev: null, next: null }
  const idx = all.findIndex((m) => m.id === currentId || m.slug === currentId)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}

export async function getMemoryStats() {
  if (!isSupabaseConfigured) {
    const photos = seedMemories.filter((m) => m.type === 'photo').length
    const videos = seedMemories.filter((m) => m.type === 'video').length
    const startDate = new Date('2023-06-01')
    const now = new Date()
    const years = (
      (now - startDate) /
      (1000 * 60 * 60 * 24 * 365.25)
    ).toFixed(1)
    return {
      data: {
        total: seedMemories.length,
        photos,
        videos,
        years: parseFloat(years),
      },
      error: null,
    }
  }

  const { count: total } = await supabase
    .from('memories')
    .select('*', { count: 'exact', head: true })
  const { count: photos } = await supabase
    .from('memories')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'photo')
  const { count: videos } = await supabase
    .from('memories')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'video')

  const startDate = new Date('2023-06-01')
  const years = ((new Date() - startDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)

  return {
    data: { total: total || 0, photos: photos || 0, videos: videos || 0, years: parseFloat(years) },
    error: null,
  }
}

// ─── Timeline ────────────────────────────────────────────────────────────────

export async function getTimeline() {
  if (!isSupabaseConfigured) {
    return {
      data: [...seedTimeline].sort(
        (a, b) => new Date(a.event_date) - new Date(b.event_date)
      ),
      error: null,
    }
  }
  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .order('event_date', { ascending: true })
  return { data: data || [], error }
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export async function getGalleryImages() {
  if (!isSupabaseConfigured) {
    return { data: seedGalleryImages, error: null }
  }
  const { data, error } = await supabase
    .from('memory_images')
    .select('*, memories(title, memory_date, location)')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// ─── Videos ──────────────────────────────────────────────────────────────────

export async function getVideos() {
  if (!isSupabaseConfigured) {
    return {
      data: seedMemories.filter((m) => m.type === 'video'),
      error: null,
    }
  }
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('type', 'video')
    .order('memory_date', { ascending: false })
  return { data: data || [], error }
}

// ─── Quotes ──────────────────────────────────────────────────────────────────

export async function getQuotes() {
  if (!isSupabaseConfigured) {
    return { data: seedQuotes, error: null }
  }
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}
