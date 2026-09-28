import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit2, Trash2, Upload, Save, X, Check, AlertTriangle,
  Image, Video, BookOpen, Heart, Clock, Quote, ChevronDown,
  Home, ArrowLeft, Eye, Star, LogOut, Lock
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  adminGetAllMemories, adminGetAllTimeline, adminGetAllQuotes,
  createMemory, updateMemory, deleteMemory,
  createTimelineEvent, updateTimelineEvent, deleteTimelineEvent,
  createQuote, deleteQuote,
  uploadFile, adminLogin, adminLogout, checkSession
} from '../services/adminService'

// ─── Helpers ─────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-hover text-sm font-medium ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      {type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
      {message}
    </motion.div>
  )
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-warm-900/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-hover"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <p className="text-warm-800 font-medium">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Image Uploader ───────────────────────────────────────────

function ImageUploader({ onUploaded, label = 'Upload Image', folder = 'photos' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await uploadFile(file, folder)
      onUploaded(url)
    } catch (e) {
      alert('Upload failed: ' + e.message)
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div
        className="relative border-2 border-dashed border-warm-200 rounded-2xl p-4 text-center cursor-pointer hover:border-rose-300 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="" className="h-32 mx-auto rounded-xl object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center gap-2 text-warm-400">
            <Upload size={24} />
            <span className="text-sm">{label}</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
    </div>
  )
}

// ─── Memory Form ─────────────────────────────────────────────

const emptyMemory = {
  title: '', slug: '', description: '', quote: '',
  location: '', memory_date: '', type: 'photo',
  cover_image: '', video_url: '', is_featured: false
}

function MemoryForm({ initial = null, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyMemory)
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleTitleChange = (val) => {
    set('title', val)
    if (!initial) set('slug', slugify(val))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.slug) return alert('Title and slug are required.')
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Title *</label>
          <input
            className="input-field"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Our First Date"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Slug *</label>
          <input
            className="input-field"
            value={form.slug}
            onChange={e => set('slug', e.target.value)}
            placeholder="our-first-date"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Date</label>
          <input
            type="date"
            className="input-field"
            value={form.memory_date}
            onChange={e => set('memory_date', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Location</label>
          <input
            className="input-field"
            value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="Bandung"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Type</label>
          <select
            className="input-field"
            value={form.type}
            onChange={e => set('type', e.target.value)}
          >
            <option value="photo">📷 Photo</option>
            <option value="video">🎥 Video</option>
            <option value="story">📖 Story</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={e => set('is_featured', e.target.checked)}
              className="w-4 h-4 rounded accent-rose-500"
            />
            <span className="text-sm font-medium text-warm-700 flex items-center gap-1">
              <Star size={14} className="text-rose-400" /> Featured on Homepage
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-700 mb-1">Description</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Ceritakan momen ini..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-700 mb-1">Quote / Romantic Caption</label>
        <textarea
          className="input-field min-h-[60px] resize-none font-serif italic"
          value={form.quote}
          onChange={e => set('quote', e.target.value)}
          placeholder='"Hari yang sederhana, tapi selalu diingat..."'
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-700 mb-2">Cover Image</label>
        <div className="space-y-2">
          {isSupabaseConfigured && (
            <ImageUploader
              label="Upload Cover Image"
              folder="photos"
              onUploaded={url => set('cover_image', url)}
            />
          )}
          <input
            className="input-field"
            value={form.cover_image}
            onChange={e => set('cover_image', e.target.value)}
            placeholder="https://... (or paste URL after uploading)"
          />
        </div>
      </div>

      {form.type === 'video' && (
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-2">Video</label>
          <div className="space-y-2">
            {isSupabaseConfigured && (
              <ImageUploader
                label="Upload Video"
                folder="videos"
                onUploaded={url => set('video_url', url)}
              />
            )}
            <input
              className="input-field"
              value={form.video_url}
              onChange={e => set('video_url', e.target.value)}
              placeholder="https://... (video URL)"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          <X size={16} /> Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Save size={16} />}
          {initial ? 'Save Changes' : 'Add Memory'}
        </button>
      </div>
    </form>
  )
}

// ─── Memories Tab ─────────────────────────────────────────────

function MemoriesTab({ toast }) {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setMemories(await adminGetAllMemories())
    } catch (e) {
      toast(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { load() }, [load])

  const handleSave = async (form) => {
    try {
      if (editing) {
        await updateMemory(editing.id, form)
        toast('Memory updated ✓')
      } else {
        await createMemory(form)
        toast('Memory added ✓')
      }
      setShowForm(false)
      setEditing(null)
      load()
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMemory(deleteTarget.id)
      toast('Memory deleted')
      setDeleteTarget(null)
      load()
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  const typeIcon = { photo: <Image size={14} />, video: <Video size={14} />, story: <BookOpen size={14} /> }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-warm-800">Memories ({memories.length})</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="btn-primary"
        >
          <Plus size={16} /> Add Memory
        </button>
      </div>

      <AnimatePresence>
        {(showForm || editing) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="card p-6 mb-6 border border-rose-100"
          >
            <h3 className="font-display text-xl text-warm-800 mb-4">
              {editing ? `Edit: ${editing.title}` : 'New Memory'}
            </h3>
            <MemoryForm
              initial={editing}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditing(null) }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-16 text-warm-400">
          <Image size={40} className="mx-auto mb-3 opacity-30" />
          <p>No memories yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {memories.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-warm-100 hover:border-rose-200 transition-colors"
            >
              {m.cover_image && (
                <img src={m.cover_image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-warm-800 truncate">{m.title}</span>
                  {m.is_featured && <Star size={12} className="text-rose-400 fill-rose-300 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-warm-400 mt-0.5">
                  <span className="flex items-center gap-1">{typeIcon[m.type]} {m.type}</span>
                  {m.memory_date && <span>· {m.memory_date}</span>}
                  {m.location && <span>· {m.location}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/memories/${m.slug || m.id}`}
                  target="_blank"
                  className="p-2 rounded-xl text-warm-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  title="View"
                >
                  <Eye size={16} />
                </Link>
                <button
                  onClick={() => { setEditing(m); setShowForm(false) }}
                  className="p-2 rounded-xl text-warm-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeleteTarget(m)}
                  className="p-2 rounded-xl text-warm-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Timeline Tab ─────────────────────────────────────────────

const emptyEvent = { emoji: '❤️', title: '', description: '', event_date: '', image_url: '' }

function TimelineTab({ toast }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyEvent)

  const load = useCallback(async () => {
    setLoading(true)
    try { setEvents(await adminGetAllTimeline()) }
    catch (e) { toast(e.message, 'error') }
    finally { setLoading(false) }
  }, [toast])

  useEffect(() => { load() }, [load])

  const openNew = () => { setForm(emptyEvent); setEditing(null); setShowForm(true) }
  const openEdit = (ev) => { setForm(ev); setEditing(ev); setShowForm(true) }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    try {
      if (editing) { await updateTimelineEvent(editing.id, form); toast('Event updated ✓') }
      else { await createTimelineEvent(form); toast('Event added ✓') }
      setShowForm(false); setEditing(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async () => {
    try {
      await deleteTimelineEvent(deleteTarget.id)
      toast('Event deleted')
      setDeleteTarget(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleSeedDummy = async () => {
    const dummies = [
      { emoji: '💫', title: 'We First Met', description: 'Awal dari semuanya — sebuah pertemuan yang tidak disengaja.', event_date: '2022-11-20' },
      { emoji: '☕', title: 'Our First Date', description: 'Pertama kali kita menghabiskan waktu berdua.', event_date: '2023-02-14' },
      { emoji: '❤️', title: 'We Became Official', description: 'Hari ketika kita memutuskan untuk tidak lagi hanya berteman.', event_date: '2023-06-01' }
    ]
    try {
      for (const d of dummies) await createTimelineEvent(d)
      toast('Dummy data added! ✓')
      load()
    } catch (e) {
      toast(e.message, 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-warm-800">Timeline ({events.length})</h2>
        <div className="flex gap-2">
          {events.length === 0 && (
            <button onClick={handleSeedDummy} className="btn-secondary">Load Dummy</button>
          )}
          <button onClick={openNew} className="btn-primary"><Plus size={16} /> Add Event</button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="card p-6 mb-6 border border-rose-100 space-y-4"
          >
            <h3 className="font-display text-xl text-warm-800">{editing ? 'Edit Event' : 'New Event'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Emoji</label>
                <input className="input-field" value={form.emoji} onChange={e => set('emoji', e.target.value)} placeholder="❤️" />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Date *</label>
                <input type="date" className="input-field" value={form.event_date} onChange={e => set('event_date', e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Title *</label>
              <input className="input-field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="We First Met" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Description</label>
              <textarea className="input-field resize-none" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">Image</label>
              <div className="space-y-2">
                {isSupabaseConfigured && (
                  <ImageUploader
                    label="Upload Image"
                    folder="photos"
                    onUploaded={url => set('image_url', url)}
                  />
                )}
                <input className="input-field" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://... (or paste URL after uploading)" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="btn-secondary"><X size={16} /> Cancel</button>
              <button onClick={handleSave} className="btn-primary"><Save size={16} /> {editing ? 'Save' : 'Add'}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}</div>
        : events.map((ev, i) => (
          <motion.div key={ev.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-warm-100 hover:border-rose-200 transition-colors mb-3"
          >
            <span className="text-2xl">{ev.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-warm-800">{ev.title}</p>
              <p className="text-xs text-warm-400">
                {ev.event_date
                  ? new Date(ev.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                  : '—'}
              </p>
            </div>
            <button onClick={() => openEdit(ev)} className="p-2 rounded-xl text-warm-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"><Edit2 size={16} /></button>
            <button onClick={() => setDeleteTarget(ev)} className="p-2 rounded-xl text-warm-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
          </motion.div>
        ))
      }

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            message={`Delete "${deleteTarget.title}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Quotes Tab ───────────────────────────────────────────────

function QuotesTab({ toast }) {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ text: '', author: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { setQuotes(await adminGetAllQuotes()) }
    catch (e) { toast(e.message, 'error') }
    finally { setLoading(false) }
  }, [toast])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!form.text) return
    try {
      await createQuote(form)
      toast('Note added ✓')
      setShowForm(false)
      setForm({ text: '', author: '' })
      load()
    } catch (e) { toast(e.message, 'error') }
  }

  const handleDelete = async () => {
    try {
      await deleteQuote(deleteTarget.id)
      toast('Note deleted')
      setDeleteTarget(null); load()
    } catch (e) { toast(e.message, 'error') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-warm-800">Love Notes ({quotes.length})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add Note</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="card p-6 mb-6 border border-rose-100 space-y-4"
          >
            <h3 className="font-display text-xl text-warm-800">New Love Note</h3>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Note *</label>
              <textarea
                className="input-field font-serif italic resize-none"
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                rows={3}
                placeholder='"Di antara begitu banyak hal..."'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Author (optional)</label>
              <input className="input-field" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="— Your name" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="btn-secondary"><X size={16} /> Cancel</button>
              <button onClick={handleSave} className="btn-primary"><Save size={16} /> Add Note</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        : quotes.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-warm-100 mb-3"
          >
            <Quote size={18} className="text-rose-300 fill-rose-100 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-serif italic text-warm-700 text-sm leading-relaxed line-clamp-2">{q.text}</p>
              {q.author && <p className="text-xs text-warm-400 mt-1">— {q.author}</p>}
            </div>
            <button onClick={() => setDeleteTarget(q)} className="p-2 rounded-xl text-warm-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"><Trash2 size={16} /></button>
          </motion.div>
        ))
      }

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            message="Delete this love note?"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Admin Page ───────────────────────────────────────────────

const TABS = [
  { id: 'memories', label: 'Memories', icon: Image },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'notes', label: 'Love Notes', icon: Quote },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('memories')
  const [toasts, setToasts] = useState([])
  const [session, setSession] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  // Cek apakah sudah login saat pertama kali halaman dibuka
  useEffect(() => {
    checkSession().then(sess => {
      setSession(sess)
      setLoadingAuth(false)
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')
    try {
      await adminLogin(email, password)
      const sess = await checkSession()
      setSession(sess)
    } catch (e) {
      setLoginError(e.message || 'Login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await adminLogout()
    setSession(null)
  }

  // Loading Screen
  if (loadingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  }

  // Halaman Login (Jika belum login)
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-warm-50 p-4">
        <Link to="/" className="absolute top-6 left-6 text-warm-400 hover:text-rose-500 transition-colors flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Site
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 max-w-sm w-full bg-white border border-rose-100 shadow-xl text-center">
          <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-rose-500" />
          </div>
          <h1 className="font-display text-2xl text-warm-800 mb-2">Admin Access</h1>
          <p className="text-warm-400 text-sm mb-6">Silakan login untuk mengedit kenangan.</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="admin@domain.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
            </div>
            {loginError && <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded">{loginError}</p>}
            <button type="submit" disabled={isLoggingIn} className="btn-primary w-full justify-center mt-2">
              {isLoggingIn ? 'Memeriksa...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Halaman Admin Utama (Jika sudah login)
  return (
    <div className="min-h-screen bg-warm-50 pt-4 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-warm-100 sticky top-0 z-40">
        <div className="page-container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Heart size={18} className="text-rose-500 fill-rose-500" />
            <span className="font-display text-base font-semibold text-warm-800">
              Our Memories — Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-warm-400 hover:text-rose-500 text-sm font-medium transition-colors">
              View Site
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Supabase warning */}
      {!isSupabaseConfigured && (
        <div className="page-container mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-800 font-medium text-sm">Supabase not configured</p>
              <p className="text-amber-600 text-xs mt-0.5">
                Add <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file to enable editing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="page-container mt-6">
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-rose'
                    : 'bg-white text-warm-600 border border-warm-200 hover:border-rose-300'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="max-w-4xl">
          {activeTab === 'memories' && <MemoriesTab toast={toast} />}
          {activeTab === 'timeline' && <TimelineTab toast={toast} />}
          {activeTab === 'notes' && <QuotesTab toast={toast} />}
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
