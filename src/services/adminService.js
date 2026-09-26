import { supabase, isSupabaseConfigured } from '../lib/supabase'

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
