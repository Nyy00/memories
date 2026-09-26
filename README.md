# Our Memories 💕

A private digital memory book built with React + Vite + Tailwind CSS + Supabase.

> "Sebuah tempat kecil di internet yang hanya berisi cerita tentang kami."

---

## Tech Stack

- **React 18** + **Vite 4**
- **Tailwind CSS 3**
- **React Router 6**
- **Framer Motion 10**
- **Lucide React**
- **Supabase** (Database + Storage)
- **Vercel** (Deployment)

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd our-memories
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Never commit your real credentials. Only use the **anon key** in frontend.

### 3. Setup Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open **SQL Editor**
3. Run the contents of `supabase-schema.sql`

This will create:
- `memories` table
- `memory_images` table
- `quotes` table
- `timeline` table
- Row Level Security (SELECT only for public)
- Indexes for performance

### 4. Setup Supabase Storage

1. Go to **Storage** in Supabase Dashboard
2. Create a new bucket named `memories` (set to **Public**)
3. Create folders: `photos/` and `videos/`

Upload your images/videos there and use the public URL in database records.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — Hero, Stats, Featured Memories |
| `/memories` | All memories with filter & search |
| `/memories/:id` | Memory detail with gallery & video |
| `/timeline` | Relationship journey timeline |
| `/gallery` | Masonry photo gallery with lightbox |
| `/videos` | Video memories |
| `/notes` | Love notes & quotes |

---

## Adding Memories

Since this app has **no authentication**, manage data via:

1. **Supabase Dashboard** → Table Editor → Insert rows
2. **Supabase Storage** → Upload images/videos → Copy public URL

### Memory Types

- `photo` — Photo memory
- `video` — Video memory  
- `story` — Text/story memory

### Supabase Storage URL Format

```
https://[project].supabase.co/storage/v1/object/public/memories/photos/filename.jpg
```

---

## Deployment to Vercel

1. Push your code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

The `vercel.json` file handles React Router rewrites automatically.

---

## Security Notes

- ✅ Only **SELECT** (read) is allowed for anonymous users (RLS enforced)
- ✅ No INSERT/UPDATE/DELETE from the public frontend
- ✅ Only the **anon key** is used in frontend (never service role key)
- ✅ Supabase Storage bucket is public for reading, but upload requires service role key (via dashboard only)

---

## Without Supabase

The app works **fully offline** with seed data when Supabase credentials are not provided. Perfect for development and preview.

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── MemoryCard.jsx
│   ├── TimelineItem.jsx
│   ├── ImageLightbox.jsx
│   ├── QuoteCard.jsx
│   ├── Skeleton.jsx
│   ├── EmptyState.jsx
│   └── ErrorState.jsx
├── pages/            # Route pages
│   ├── Home.jsx
│   ├── Memories.jsx
│   ├── MemoryDetail.jsx
│   ├── TimelinePage.jsx
│   ├── Gallery.jsx
│   ├── Videos.jsx
│   └── Notes.jsx
├── lib/
│   ├── supabase.js   # Supabase client
│   └── seedData.js   # Demo seed data
├── services/
│   └── memoryService.js  # Data fetching (Supabase or seed)
├── hooks/
│   └── useMemory.js  # useFetch, useIntersectionObserver
├── App.jsx           # Routes & page transitions
├── main.jsx          # Entry point
└── index.css         # Global styles + Tailwind
```

---

Made with ❤️ — Our Memories
