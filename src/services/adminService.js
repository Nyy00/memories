import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ─── Auth ────────────────────────────────────────────────────

export async function adminLogin(email, password) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function adminLogout() {
  if (!isSupabaseConfigured) return
  await supabase.auth.signOut()
}

export async function checkSession() {
  if (!isSupabaseConfigured) return null
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ─── Upload ke Supabase Storage ──────────────────────────────

export async function uploadFile(file, folder = 'photos') {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.')
  }

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from('memories')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('memories')
    .getPublicUrl(path)

  return publicUrl
}

// ─── Memories CRUD ───────────────────────────────────────────

export async function createMemory(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('memories')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMemory(id, payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('memories')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMemory(id) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ─── Memory Images ───────────────────────────────────────────

export async function addMemoryImage(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('memory_images')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMemoryImage(id) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('memory_images')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ─── Timeline ────────────────────────────────────────────────

export async function createTimelineEvent(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('timeline')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTimelineEvent(id, payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('timeline')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTimelineEvent(id) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('timeline')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ─── Quotes ──────────────────────────────────────────────────

export async function createQuote(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('quotes')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteQuote(id) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ─── Get all for admin ───────────────────────────────────────

export async function adminGetAllMemories() {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('memory_date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function adminGetAllTimeline() {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .order('event_date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function adminGetAllQuotes() {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ─── Memory Images (Multiple Media) ─────────────────────────

export async function getMemoryImages(memoryId) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('memory_images')
    .select('*')
    .eq('memory_id', memoryId)
    .order('sort_order')

  if (error) throw error
  return data || []
}

export async function addMemoryImages(memoryId, files, onProgress) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const results = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    // Tentukan folder dan type berdasarkan file mime
    const isVideo = file.type.startsWith('video/')
    const folder = isVideo ? 'videos' : 'photos'
    const mediaType = isVideo ? 'video' : 'photo'

    const url = await uploadFile(file, folder)

    const { data, error } = await supabase
      .from('memory_images')
      .insert([{
        memory_id: memoryId,
        image_url: url,
        type: mediaType,
        sort_order: i,
      }])
      .select()
      .single()

    if (error) throw error
    results.push(data)

    if (onProgress) onProgress(i + 1, files.length)
  }
  return results
}

export async function reorderMemoryImages(memoryId, orderedIds) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  const updates = orderedIds.map((id, idx) =>
    supabase
      .from('memory_images')
      .update({ sort_order: idx })
      .eq('id', id)
      .eq('memory_id', memoryId)
  )
  await Promise.all(updates)
}
