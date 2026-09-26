export function MemoryCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-memory" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-6 w-3/4 rounded-xl" />
        <div className="flex gap-3">
          <div className="skeleton h-4 w-24 rounded-lg" />
          <div className="skeleton h-4 w-20 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded-lg" />
          <div className="skeleton h-3 w-4/5 rounded-lg" />
          <div className="skeleton h-3 w-3/5 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function TimelineItemSkeleton() {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="skeleton w-px h-24 mt-3 rounded-full" />
      </div>
      <div className="flex-1 pb-8 space-y-3">
        <div className="skeleton h-5 w-32 rounded-lg" />
        <div className="skeleton h-6 w-48 rounded-xl" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-3/4 rounded-lg" />
      </div>
    </div>
  )
}

export function GalleryImageSkeleton() {
  return (
    <div className="masonry-item">
      <div className="skeleton rounded-2xl" style={{ height: `${180 + Math.random() * 120}px` }} />
    </div>
  )
}

export function QuoteCardSkeleton() {
  return (
    <div className="card p-8 space-y-4">
      <div className="skeleton h-4 w-12 rounded-full" />
      <div className="space-y-2">
        <div className="skeleton h-5 w-full rounded-lg" />
        <div className="skeleton h-5 w-5/6 rounded-lg" />
        <div className="skeleton h-5 w-4/5 rounded-lg" />
      </div>
    </div>
  )
}
