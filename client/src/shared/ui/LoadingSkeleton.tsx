import { SkeletonCard } from './SkeletonCard'; // Adjust this path if needed

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-background)] text-[var(--color-on-background)]">
      {/* ─── NAVBAR SKELETON ─── */}
      <header className="fixed top-0 right-0 left-0 z-40 border-b border-[var(--color-divider)] bg-[var(--color-background)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-[var(--layout-container-max)] items-center justify-between gap-6 px-[var(--layout-margin-desktop)] max-md:px-5">
          {/* Logo block */}
          <div className="h-5 w-28 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="h-8 w-24 animate-pulse rounded-md bg-[var(--color-surface-container)]" />
            <div className="h-8 w-16 animate-pulse rounded-md bg-[var(--color-surface-container)]" />
            <div className="h-8 w-18 animate-pulse rounded-md bg-[var(--color-surface-container)]" />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            {/* Search placeholder */}
            <div className="h-7 w-7 animate-pulse rounded-full bg-[var(--color-surface-container-high)]" />
            {/* Auth / Action button */}
            <div className="h-8 w-20 animate-pulse rounded-md bg-[var(--color-surface-container-high)] max-md:hidden" />
            {/* Theme switcher */}
            <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--color-surface-container-high)]" />
          </div>
        </div>
      </header>

      {/* ─── MAIN HERO SKELETON ─── */}
      <div className="pt-24 pb-8">
        <section className="mx-auto max-w-[var(--layout-container-max)] px-[var(--layout-margin-desktop)] max-md:px-5">
          {/* 1. Desktop Hero (md:grid) */}
          <div className="hidden h-[360px] grid-cols-12 items-center gap-12 md:grid">
            <div className="col-span-7 space-y-5">
              <div className="h-3 w-40 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
              <div className="space-y-2.5">
                <div className="h-10 w-[75%] animate-pulse rounded bg-[var(--color-surface-container-high)]" />
                <div className="h-10 w-[55%] animate-pulse rounded bg-[var(--color-surface-container-high)]" />
              </div>
              <div className="h-4 w-96 animate-pulse rounded bg-[var(--color-surface-container-high)]" />
              <div className="flex gap-3 pt-2">
                <div className="h-10 w-32 animate-pulse rounded-md bg-[var(--color-surface-container-high)]" />
                <div className="h-10 w-36 animate-pulse rounded-md bg-[var(--color-surface-container-high)]" />
              </div>
            </div>
            <div className="col-span-5 flex justify-end">
              {/* Backing box for poster stack */}
              <div className="h-[340px] w-[240px] animate-pulse rounded-lg bg-[var(--color-surface-container-high)]/60" />
            </div>
          </div>

          {/* 2. Mobile Hero (max-md:block) */}
          <div className="block md:hidden">
            <div className="relative flex aspect-[4/5] w-full animate-pulse items-end overflow-hidden rounded-xl bg-[var(--color-surface-container-high)] p-6">
              {/* Overlay lines inside the mobile poster */}
              <div className="z-10 w-full space-y-3.5">
                <div className="h-6 w-3/5 animate-pulse rounded bg-[var(--color-surface-container)]" />
                <div className="h-5 w-2/5 animate-pulse rounded bg-[var(--color-surface-container)]" />
                <div className="h-3 w-[85%] animate-pulse rounded bg-[var(--color-surface-container)]" />
                <div className="flex gap-2 pt-2">
                  <div className="h-8 w-24 animate-pulse rounded-md bg-[var(--color-surface-container)]" />
                  <div className="h-8 w-24 animate-pulse rounded-md bg-[var(--color-surface-container)]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── ROWS & GRID SECTION ─── */}
      <main className="mx-auto max-w-[var(--layout-container-max)] space-y-12 px-[var(--layout-margin-desktop)] pb-32 max-md:px-5">
        {/* 1. DESKTOP ROWS SKELETON */}
        <div className="hidden space-y-12 md:block">
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <div key={rowIndex} className="space-y-4">
              <div className="flex items-end justify-between">
                <div className="h-5 w-48 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
                <div className="h-3 w-16 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
              </div>
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }).map((_, cardIndex) => (
                  <SkeletonCard key={cardIndex} className="w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 2. MOBILE ROWS SKELETON */}
        <div className="block space-y-10 md:hidden">
          {/* Mobile Row 1 (Standard Card Row) */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div className="h-5 w-36 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
              <div className="h-3 w-12 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
            </div>
            <div className="flex gap-4 overflow-x-hidden">
              <SkeletonCard className="w-28" />
              <SkeletonCard className="w-28" />
              <SkeletonCard className="w-28" />
            </div>
          </div>

          {/* Mobile Row 2 (List Layout - Thumbnail + Text) */}
          <div className="space-y-4">
            <div className="h-5 w-44 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
            <div className="space-y-4 divide-y divide-[var(--color-divider)]">
              {Array.from({ length: 3 }).map((_, listIndex) => (
                <div key={listIndex} className="flex items-center gap-4 pt-4 first:pt-0">
                  {/* Thumbnail */}
                  <div className="h-20 w-14 flex-shrink-0 animate-pulse rounded bg-[var(--color-surface-container-high)]" />
                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-[70%] animate-pulse rounded bg-[var(--color-surface-container-high)]" />
                    <div className="h-2.5 w-[45%] animate-pulse rounded bg-[var(--color-surface-container-high)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ─── BOTTOM MOBILE NAVIGATION SKELETON ─── */}
      <div className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t border-[var(--color-divider)] bg-[var(--color-surface-container-lowest)]/95 px-6 backdrop-blur-md md:hidden">
        <div className="h-6 w-6 animate-pulse rounded bg-[var(--color-surface-container-high)]" />
        <div className="h-6 w-6 animate-pulse rounded bg-[var(--color-surface-container-high)]" />

        {/* Large center action item */}
        <div className="relative flex -translate-y-3 items-center justify-center">
          <div className="h-13 w-13 animate-pulse rounded-full border-4 border-[var(--color-background)] bg-[var(--color-surface-container-high)] shadow-lg" />
        </div>

        <div className="h-6 w-6 animate-pulse rounded bg-[var(--color-surface-container-high)]" />
        <div className="h-6 w-6 animate-pulse rounded bg-[var(--color-surface-container-high)]" />
      </div>

      {/* ─── DESKTOP FOOTER SKELETON ─── */}
      <footer className="hidden border-t border-[var(--color-divider)] bg-[var(--color-surface-container-lowest)] py-12 md:block">
        <div className="mx-auto flex max-w-[var(--layout-container-max)] items-start justify-between gap-12 px-[var(--layout-margin-desktop)]">
          <div className="w-72 space-y-3">
            <div className="h-5 w-24 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
            <div className="h-3 w-full animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
            <div className="h-3 w-[70%] animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
          </div>
          <div className="flex gap-16">
            <div className="w-20 space-y-2.5">
              <div className="h-3.5 w-16 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
              <div className="h-2.5 w-12 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
              <div className="h-2.5 w-14 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
            </div>
            <div className="w-20 space-y-2.5">
              <div className="h-3.5 w-14 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
              <div className="h-2.5 w-16 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
              <div className="h-2.5 w-12 animate-pulse rounded-sm bg-[var(--color-surface-container-high)]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoadingSkeleton;
