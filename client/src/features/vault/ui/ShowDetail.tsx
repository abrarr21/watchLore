import { useShowDetail } from '../hooks/useShowDetail';
import { Navbar } from '../../../shared/ui/Navbar';
import { Footer } from '../../../shared/ui/Footer';
import LoadingSkeleton from '../../../shared/ui/LoadingSkeleton';
import { Play, Check, Calendar, Star, Edit2, Trash, MessageSquare } from 'lucide-react';

const ShowDetail = () => {
  const { show, isPending, error, handleStatusChange, handleDeleteShow, navigate } =
    useShowDetail();

  if (isPending) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Navbar currentPath="/vault" onVault={() => navigate('/vault')} />
        <div className="pt-20 md:pt-28">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-on-background)]">
        <Navbar currentPath="/vault" onVault={() => navigate('/vault')} />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <h2 className="font-display text-2xl font-bold text-red-500">Show Not Found</h2>
          <p className="mt-2 text-sm text-[var(--color-outline)]">
            This entry could not be retrieved from your vault.
          </p>
          <button
            onClick={() => navigate('/vault')}
            className="mt-6 cursor-pointer rounded-full bg-[var(--color-primary)] px-6 py-2 text-xs font-semibold tracking-wider text-[var(--color-on-primary)] uppercase shadow hover:opacity-90"
          >
            Back to Vault
          </button>
        </div>
      </div>
    );
  }

  // Handle Edit Button - Navigate to AddToVault page and pass show details in React Router state
  const handleEditClick = () => {
    navigate('/add-to-vault', {
      state: {
        editShow: {
          id: show.id || show.ID,
          title: show.title,
          type: show.type,
          status: show.status,
          genre: show.genre,
          rating: show.rating,
          review: show.review,
          imageUrl: show.images?.url,
          overview: show.overview,
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#131313] text-[#F3EFE0]">
      {/* Navbar */}
      <Navbar currentPath="/vault" onVault={() => navigate('/vault')} />

      {/* Hero Banner Section */}
      <div className="relative min-h-[60vh] w-full overflow-hidden sm:min-h-[65vh] lg:h-[70vh] lg:min-h-0">
        {/* Backdrop Image */}
        <img
          src={
            show.backdrop_image?.url ||
            show.images?.url ||
            'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1280&q=80'
          }
          alt={show.title}
          className="absolute inset-0 h-full w-full object-cover object-top"
          loading="eager"
        />

        {/* Bottom fading gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent" />

        {/* Floating Details Content Container */}
        <div className="relative mx-auto w-full max-w-[var(--layout-container-max)] px-[var(--layout-margin-desktop)] pt-32 pb-8 max-md:px-5 sm:pb-10 lg:absolute lg:right-0 lg:bottom-0 lg:left-0 lg:pt-0 lg:pb-12">
          {/* Metadata Row */}
          <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold tracking-widest text-[var(--color-outline)] uppercase sm:mb-4 sm:gap-3 sm:text-xs">
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] tracking-widest text-white">
              {show.type}
            </span>
            <span>•</span>
            <span>{show.created_at ? new Date(show.created_at).getFullYear() : '2020'}</span>
            <span>•</span>
            <span>TV-MA</span>
          </div>

          {/* Title */}
          <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-[var(--color-on-surface)] sm:text-4xl md:text-6xl lg:mb-6 lg:text-7xl">
            {show.title}
          </h1>

          {/* Genres & Rating Badge Row */}
          <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8 sm:gap-3">
            {show.genre?.map((g: string, index: number) => (
              <span
                key={index}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-[var(--color-on-surface-variant)] sm:px-4 sm:py-1.5 sm:text-xs"
              >
                {g}
              </span>
            ))}
            {show.rating !== undefined && show.rating > 0 && (
              <span className="ml-1 flex items-center gap-1.5 font-body text-sm font-bold text-[#E5A93C] sm:ml-2">
                <Star size={16} fill="currentColor" /> {show.rating.toFixed(1)}{' '}
                <span className="text-xs font-normal text-[var(--color-outline)]">/ 10</span>
              </span>
            )}
          </div>

          {/* Actions Controls Bar */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Status Pills Selector - Toggling triggers PATCH API call immediately */}
            <div className="flex w-full flex-wrap gap-1 rounded-md border border-white/10 bg-black/30 p-1 backdrop-blur-md sm:w-fit sm:flex-nowrap">
              {(
                [
                  { id: 'watching', icon: Play },
                  { id: 'completed', icon: Check },
                  { id: 'planned', icon: Calendar },
                ] as const
              ).map((item) => {
                const isActive = show.status === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleStatusChange(item.id)}
                    className={`flex flex-1 cursor-pointer items-center justify-center rounded-md px-3 py-2 text-[11px] font-bold tracking-wide uppercase transition-all select-none sm:flex-none sm:justify-start sm:px-5 sm:text-xs ${
                      isActive
                        ? 'bg-[#E5A93C] text-black shadow-md'
                        : 'text-[var(--color-outline)] hover:text-white'
                    }`}
                  >
                    {item.id === 'watching' ? (
                      <Icon size={12} className="mr-1.5 flex-shrink-0" fill="currentColor" />
                    ) : (
                      <Icon size={12} className="mr-1.5 flex-shrink-0" />
                    )}
                    {item.id}
                  </button>
                );
              })}

              {/* Dropped Button - Disabled to match DB schema restrictions */}
              <button
                disabled
                title="Dropped status is currently not supported by the database"
                className="flex flex-1 cursor-not-allowed items-center justify-center rounded-md px-3 py-2 text-[11px] font-bold tracking-wide text-white/35 uppercase select-none sm:flex-none sm:justify-start sm:px-5 sm:text-xs"
              >
                <span className="mr-1.5 font-bold text-red-500">×</span>
                Dropped
              </button>
            </div>

            {/* Edit / Rate / Remove Controls */}
            <div className="flex items-center gap-5 font-mono text-xs font-bold tracking-wider text-[var(--color-outline)] uppercase sm:gap-6">
              <button
                onClick={handleEditClick}
                className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-white"
              >
                <Edit2 size={14} /> <span className="hidden sm:inline">Edit Details</span>
                <span className="sm:hidden">Edit</span>
              </button>

              <button
                onClick={handleDeleteShow}
                className="flex cursor-pointer items-center gap-1.5 text-red-400 transition-colors hover:text-red-300"
              >
                <Trash size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body Section */}
      <main className="mx-auto w-full max-w-[var(--layout-container-max)] flex-1 px-[var(--layout-margin-desktop)] py-8 max-md:px-5 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Mobile/Tablet Poster Widget — hidden on desktop where the hero is already large and a sticky sidebar poster takes over */}
          <div className="col-span-1 flex justify-center lg:hidden">
            <div className="w-32 flex-shrink-0 overflow-hidden rounded-md border border-white/5 bg-[var(--color-surface-container)] shadow-lg sm:w-40">
              <div className="aspect-[2/3]">
                <img
                  src={
                    show.images?.url ||
                    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80'
                  }
                  alt={show.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Left Column: Synopsis / Reviews */}
          <div className="col-span-1 space-y-8 lg:col-span-8 lg:space-y-12">
            {/* Synopsis Section */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="font-mono text-xs font-bold tracking-widest text-[var(--color-outline)] uppercase">
                Synopsis
              </h2>
              <hr className="border-white/10" />
              <p className="font-body text-sm leading-relaxed text-[var(--color-on-surface-variant)] opacity-90">
                {show.overview ||
                  'No synopsis has been captured for this entry yet. Edit details to add one.'}
              </p>
            </div>

            {/* User Review Section */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="font-mono text-xs font-bold tracking-widest text-[var(--color-outline)] uppercase">
                Your Review
              </h2>
              <div className="rounded-lg border border-white/5 bg-[#171717] p-4 shadow-lg sm:p-6">
                {show.review ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-[#E5A93C]">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starValue = (i + 1) * 2;
                        const ratingVal = show.rating || 0;
                        const isFilled = ratingVal >= starValue;
                        const isHalf = !isFilled && ratingVal >= starValue - 1;
                        return (
                          <Star
                            key={i}
                            size={16}
                            fill={isFilled ? 'currentColor' : 'none'}
                            className={isHalf ? 'opacity-50' : ''}
                          />
                        );
                      })}
                      <span className="ml-2 font-mono text-xs text-[var(--color-outline)]">
                        ({show.rating ? show.rating.toFixed(1) : '0.0'}/10)
                      </span>
                    </div>
                    <p className="font-body text-sm leading-relaxed text-[var(--color-on-surface)]">
                      {show.review}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-[var(--color-outline)]">
                    <MessageSquare size={24} className="mb-2 opacity-55" />
                    <p className="text-xs font-semibold tracking-wider uppercase">
                      No review written yet
                    </p>
                    <button
                      onClick={handleEditClick}
                      className="mt-3 cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-all hover:bg-white/10"
                    >
                      Write Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Mini Poster Widget (Desktop only) */}
          <div className="col-span-1 hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 rounded-lg border border-white/5 bg-[#171717] p-4 shadow-xl">
              <div className="aspect-[2/3] overflow-hidden rounded-md border border-white/5 bg-[var(--color-surface-container)]">
                <img
                  src={
                    show.images?.url ||
                    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80'
                  }
                  alt={show.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShowDetail;
