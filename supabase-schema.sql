-- ============================================================
-- OUR MEMORIES — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Table: memories ─────────────────────────────────────────

create table if not exists public.memories (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text unique not null,
  description   text,
  quote         text,
  location      text,
  memory_date   date,
  type          text not null default 'story' check (type in ('photo', 'video', 'story')),
  cover_image   text,
  video_url     text,
  is_featured   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger memories_updated_at
  before update on public.memories
  for each row execute function update_updated_at();

-- ─── Table: memory_images ─────────────────────────────────────

create table if not exists public.memory_images (
  id          uuid primary key default uuid_generate_v4(),
  memory_id   uuid not null references public.memories(id) on delete cascade,
  image_url   text not null,
  caption     text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── Table: quotes ───────────────────────────────────────────

create table if not exists public.quotes (
  id          uuid primary key default uuid_generate_v4(),
  text        text not null,
  author      text,
  created_at  timestamptz not null default now()
);

-- ─── Table: timeline ─────────────────────────────────────────

create table if not exists public.timeline (
  id          uuid primary key default uuid_generate_v4(),
  emoji       text default '❤️',
  title       text not null,
  description text,
  event_date  date not null,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- ─── Row Level Security (RLS) ─────────────────────────────────
-- Public users can only SELECT (read). No INSERT, UPDATE, DELETE.

alter table public.memories       enable row level security;
alter table public.memory_images  enable row level security;
alter table public.quotes         enable row level security;
alter table public.timeline       enable row level security;

-- SELECT policies for anonymous/public users
create policy "Public can read memories"
  on public.memories for select
  using (true);

create policy "Public can read memory_images"
  on public.memory_images for select
  using (true);

create policy "Public can read quotes"
  on public.quotes for select
  using (true);

create policy "Public can read timeline"
  on public.timeline for select
  using (true);

-- ─── Indexes ─────────────────────────────────────────────────

create index if not exists memories_memory_date_idx on public.memories(memory_date desc);
create index if not exists memories_type_idx         on public.memories(type);
create index if not exists memories_slug_idx         on public.memories(slug);
create index if not exists memories_featured_idx     on public.memories(is_featured) where is_featured = true;
create index if not exists memory_images_memory_idx  on public.memory_images(memory_id);
create index if not exists timeline_event_date_idx   on public.timeline(event_date asc);

-- ─── Sample Data ─────────────────────────────────────────────

insert into public.timeline (emoji, title, description, event_date) values
  ('💫', 'We First Met',        'Awal dari semuanya — sebuah pertemuan yang tidak disengaja di sebuah acara bersama.',        '2022-11-20'),
  ('☕', 'Our First Date',       'Pertama kali kita menghabiskan waktu berdua. Kopi, obrolan, dan banyak tawa.',              '2023-02-14'),
  ('❤️', 'We Became Official',  'Hari ketika kita memutuskan untuk tidak lagi hanya berteman.',                               '2023-06-01'),
  ('🌹', 'First Anniversary',    'Satu tahun yang penuh cerita, tawa, dan kenangan yang tidak terlupakan.',                   '2024-02-14'),
  ('✈️', 'Our First Trip',      'Yogyakarta — perjalanan pertama kita. Sebuah petualangan yang selalu dirindukan.',           '2024-05-20'),
  ('🌊', 'Second Anniversary',   'Dua tahun bersama, dirayakan di pulau yang selalu kita impikan.',                           '2025-02-14')
on conflict do nothing;

insert into public.quotes (text) values
  ('Di antara begitu banyak hal yang terjadi dalam hidup, aku bersyukur salah satunya adalah bertemu kamu.'),
  ('Kamu bukan hanya seseorang yang aku cintai. Kamu adalah alasan mengapa aku percaya bahwa hal-hal baik memang ada.'),
  ('Bersamamu, bahkan hari yang biasa terasa seperti kenangan yang ingin selalu aku simpan.'),
  ('Aku tidak tahu ke mana hidup akan membawa kita, tapi selama kamu ada, aku tidak takut.'),
  ('Setiap foto yang kita ambil bukan hanya gambar. Itu adalah bukti bahwa kita pernah benar-benar bahagia.'),
  ('Hal terbaik yang pernah terjadi padaku adalah ketika kamu memilih untuk tetap ada.')
on conflict do nothing;

-- ─── Storage Buckets ─────────────────────────────────────────
-- Run in Supabase Storage or via Dashboard:
-- 1. Create bucket: "memories" (public)
-- 2. Folder structure:
--    memories/
--    ├── photos/
--    └── videos/

-- Storage RLS policy (allow public reads):
-- insert into storage.policies (name, bucket_id, definition) values
--   ('Public read memories', 'memories', '{"role":"anon","operation":"SELECT"}');

-- ─── Admin Panel Access (Authenticated Only) ───────────────────
-- Now that we have a login screen, only logged-in (authenticated) users
-- can add, edit, or delete data.

create policy "Auth can insert memories" on public.memories for insert to authenticated with check (true);
create policy "Auth can update memories" on public.memories for update to authenticated using (true);
create policy "Auth can delete memories" on public.memories for delete to authenticated using (true);

create policy "Auth can insert memory_images" on public.memory_images for insert to authenticated with check (true);
create policy "Auth can delete memory_images" on public.memory_images for delete to authenticated using (true);

create policy "Auth can insert timeline" on public.timeline for insert to authenticated with check (true);
create policy "Auth can update timeline" on public.timeline for update to authenticated using (true);
create policy "Auth can delete timeline" on public.timeline for delete to authenticated using (true);

create policy "Auth can insert quotes" on public.quotes for insert to authenticated with check (true);
create policy "Auth can delete quotes" on public.quotes for delete to authenticated using (true);

-- To allow file uploads via Admin Panel, you also need to run this storage policy:
-- insert into storage.policies (name, bucket_id, definition) values ('Auth can upload memories', 'memories', '{"role":"authenticated","operation":"INSERT"}');
