import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { Navbar } from '../../../shared/ui/Navbar';
import { Badge } from '../../../shared/ui/Badge';
import { RatingBadge } from '../../../shared/ui/RatingBadge';
import { Footer } from '../../../shared/ui/Footer';
import { useVault } from '../hooks/useVault';

type StatusFilter = 'all' | 'watching' | 'completed' | 'planned';
type TypeFilter = 'all' | 'movie' | 'series' | 'anime';
type SortKey = 'recent' | 'rating' | 'title';

export function VaultPage() {
  const navigate = useNavigate();

  // 1. Filter and Sorting States
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortKey>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Fetch Vault Shows
  const { vaultShow, isPending } = useVault();

  // 3. Client-side Filter & Sort Logic
  const filteredShows = useMemo(() => {
    return vaultShow
      .filter((show: any) => {
        const matchesStatus = statusFilter === 'all' || show.status === statusFilter;
        const matchesType = typeFilter === 'all' || show.type === typeFilter;
        const matchesSearch = show.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'recent') {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [vaultShow, statusFilter, typeFilter, searchQuery, sortBy]);

  const totalArchived = vaultShow.length;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-on-background)]">
      {/* Navbar */}
      <Navbar currentPath="/vault" onVault={() => navigate('/vault')} />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] flex-1 px-[var(--layout-margin-desktop)] pt-28 pb-16 max-md:px-5">
        {/* Title Header */}
        <div className="mb-8 space-y-2">
          <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-on-surface)]">
            Your Vault
          </h1>
          <p className="font-mono text-xs tracking-widest text-[var(--color-primary)] uppercase">
            {totalArchived} {totalArchived === 1 ? 'Title' : 'Titles'} Archived
          </p>
        </div>

        {/* Filters Controls Panel */}
        <div className="mb-10 flex flex-col gap-6 border-b border-[var(--color-divider)] pb-6 md:flex-row md:items-center md:justify-between">
          {/* Status Pills */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'watching', 'completed', 'planned'] as StatusFilter[]).map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all select-none ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                      : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Search and Dropdowns */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Type Dropdown */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                className="cursor-pointer appearance-none rounded-md border border-[var(--color-divider)] bg-[var(--color-surface-container)] py-2.5 pr-10 pl-4 text-xs font-semibold text-[var(--color-on-surface)] focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="movie">Movies</option>
                <option value="series">Series</option>
                <option value="anime">Anime</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-3 h-3.5 w-3.5 text-[var(--color-outline)]" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="cursor-pointer appearance-none rounded-md border border-[var(--color-divider)] bg-[var(--color-surface-container)] py-2.5 pr-10 pl-4 text-xs font-semibold text-[var(--color-on-surface)] focus:outline-none"
              >
                <option value="recent">Sort: Recent</option>
                <option value="rating">Sort: Rating</option>
                <option value="title">Sort: Alphabetical</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-3 right-3 h-3.5 w-3.5 text-[var(--color-outline)]" />
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-3 left-3 h-4 w-4 text-[var(--color-outline)]" />
              <input
                type="text"
                placeholder="Search your archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-[var(--color-divider)] bg-[var(--color-surface-container)] py-2 pr-4 pl-10 text-xs font-medium text-[var(--color-on-surface)] placeholder-[var(--color-outline)]/60 focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shows Cards Grid */}
        {isPending ? (
          <div className="animate-pulse py-20 text-center font-mono text-sm text-[var(--color-outline)]">
            Loading your vault...
          </div>
        ) : filteredShows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-divider)] py-24 text-center">
            <p className="text-sm font-medium text-[var(--color-outline)]">
              No archived titles found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {filteredShows.map((show: any) => (
              <div
                key={show.id || show.ID}
                onClick={() => navigate(`/vault/${show.id || show.ID}`)}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-[var(--radius-md)] border border-white/5 bg-[var(--color-surface-container-lowest)] transition-all duration-300 hover:border-white/10 hover:shadow-xl"
              >
                {/* Poster Cover container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[var(--color-surface-container)]">
                  <img
                    src={
                      show.images?.url ||
                      'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80'
                    }
                    alt={show.title}
                    className="h-full w-full object-cover transition-transform duration-[var(--transition-duration-slow)] group-hover:scale-103"
                    loading="lazy"
                  />

                  {/* Absolute Badge Stack on Top Left */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {/* Status Badge */}
                    <Badge label={show.status} variant="status" status={show.status} />
                    {/* Type Badge */}
                    <Badge label={show.type} variant="type" type={show.type} />
                  </div>

                  {/* Subtle dark gradient overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-[var(--transition-duration-base)] group-hover:bg-black/15" />
                </div>

                {/* Card Info Body */}
                <div className="flex flex-1 flex-col justify-between space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-body text-sm font-semibold tracking-tight text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
                      {show.title}
                    </h3>
                    {show.rating !== undefined && (
                      <RatingBadge rating={show.rating} className="flex-shrink-0" />
                    )}
                  </div>

                  {/* Review Quote */}
                  <p className="line-clamp-2 font-body text-xs text-[var(--color-outline)] italic">
                    {show.review ? `"${show.review}"` : '"No review written yet."'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => navigate('/add-to-vault')}
        aria-label="Add new titles"
        className="fixed right-8 bottom-8 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-lg transition-all select-none hover:bg-[var(--color-primary-container)] active:scale-95"
      >
        <Plus size={24} />
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
}
