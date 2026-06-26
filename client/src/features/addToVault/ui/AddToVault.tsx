import { useState } from 'react';
import { Navbar } from '../../../shared/ui/Navbar';
import { Button } from '../../../shared/ui/Button';
import { Footer } from '../../../shared/ui/Footer';
import { useAddToVault } from '../hooks/useAddToVault';

const AddToVault = () => {
  const { register, handleSubmit, setValue, watch, onSubmit, navigate } = useAddToVault();

  // Watch fields for rendering active custom controls
  const activeType = watch('type');
  const activeStatus = watch('status');
  const genres = watch('genre');
  const rating = watch('rating');
  const coverImage = watch('coverImage');

  const [dragActive, setDragActive] = useState(false);

  // 3. Handle Cover Poster Upload Actions
  const handleImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setValue('coverImage', file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-on-background)]">
      {/* Navbar */}
      <Navbar currentPath="/vault/new" onVault={() => navigate('/vault')} />

      {/* Main Content Form Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-[var(--layout-container-max)] flex-1 space-y-8 px-[var(--layout-margin-desktop)] pt-20 pb-16 max-md:px-5 md:space-y-12 md:pt-28"
      >
        {/* Title Header with brand gold vertical line bar */}
        <div className="flex items-start gap-3 md:gap-4">
          <div className="h-10 w-1 flex-shrink-0 rounded-full bg-[var(--color-primary)] md:h-14" />
          <div className="space-y-1">
            <h1 className="font-display text-2xl leading-none font-bold tracking-tight text-[var(--color-on-surface)] sm:text-3xl md:text-4xl">
              New Entry
            </h1>
            <p className="font-body text-xs font-medium text-[var(--color-outline)]">
              Archiving a new masterpiece into your personal collection.
            </p>
          </div>
        </div>

        {/* 2-Column Form Fields Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* LEFT COLUMN: Cover Poster Drag & Drop & Overall Rating */}
          <div className="col-span-1 space-y-6 lg:col-span-4 lg:space-y-8">
            {/* Poster Upload Container */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                Cover Poster
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]);
                }}
                onClick={() => document.getElementById('cover-file-input')?.click()}
                className={`group relative mx-auto flex aspect-[2/3] w-full max-w-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-[var(--color-surface-container)] p-5 text-center transition-all duration-300 sm:max-w-[280px] sm:p-6 lg:mx-0 ${
                  dragActive
                    ? 'scale-102 border-[var(--color-primary)] bg-[var(--color-surface-container-high)]'
                    : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/45'
                }`}
              >
                <input
                  id="cover-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
                  }}
                />

                {coverImage ? (
                  <div className="absolute inset-0">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover preview"
                      className="h-full w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue('coverImage', null);
                      }}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/90"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-outline)] transition-colors group-hover:text-[var(--color-primary)] sm:mb-4 sm:h-12 sm:w-12">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="sm:h-6 sm:w-6"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                        <path d="M12 5v6M9 8h6" />
                      </svg>
                    </div>
                    <span className="mb-1 font-mono text-[9px] font-bold tracking-widest text-[var(--color-on-surface)] uppercase sm:text-[10px]">
                      Drag & Drop Poster
                    </span>
                    <span className="mb-3 font-mono text-[9px] font-bold tracking-widest text-[var(--color-outline)] uppercase sm:text-[10px]">
                      Or Click to Browse
                    </span>
                    <span className="font-mono text-[8px] tracking-wider text-[var(--color-outline-variant)] uppercase sm:text-[9px]">
                      2:3 Recommended Ratio
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Overall Rating (10 Stars Selector) */}
            <div className="space-y-3">
              <span className="block font-mono text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                Overall Rating
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => {
                  const starValue = i + 1;
                  const isFilled = starValue <= rating;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setValue('rating', starValue)}
                      className={`cursor-pointer text-xl leading-none transition-colors select-none sm:text-2xl ${
                        isFilled
                          ? 'text-[var(--color-primary)]'
                          : 'text-[var(--color-outline-variant)]/60 hover:text-[var(--color-primary)]/80'
                      }`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
              <span className="block font-mono text-[10px] font-semibold tracking-widest text-[var(--color-primary)] uppercase">
                {rating > 0 ? `${rating}/10` : 'Unrated'}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Production Title, Media Type, Archive Status, Genres, Editorial Review */}
          <div className="col-span-1 space-y-5 lg:col-span-8 lg:space-y-6">
            {/* Production Title */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                Production Title
              </label>
              <input
                type="text"
                placeholder="e.g. Neon Genesis Evangelion"
                {...register('title', { required: true })}
                className="w-full rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] px-4 py-2.5 text-sm text-[var(--color-on-surface)] placeholder-[var(--color-outline)]/40 focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>

            {/* Media Type & Archive Status Row */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              {/* Media Type Segmented Option */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                  Media Type
                </span>
                <div className="inline-flex rounded-md border border-[var(--color-divider)] bg-[var(--color-surface-container)] p-1">
                  {(['anime', 'movie', 'series'] as const).map((type) => {
                    const isActive = activeType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue('type', type)}
                        className={`flex-1 cursor-pointer rounded-md px-2 py-2 text-center text-[11px] font-semibold tracking-wide uppercase transition select-none sm:px-5 sm:text-xs ${
                          isActive
                            ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                            : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Archive Status Segmented Option */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                  Archive Status
                </span>
                <div className="inline-flex rounded-md border border-[var(--color-divider)] bg-[var(--color-surface-container)] p-1">
                  {(['watching', 'completed', 'planned'] as const).map((status) => {
                    const isActive = activeStatus === status;
                    let label = 'Watching';
                    let Icon = () => (
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    );
                    if (status === 'completed') {
                      label = 'Completed';
                      Icon = () => (
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      );
                    } else if (status === 'planned') {
                      label = 'Plan';
                      Icon = () => (
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                      );
                    }
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setValue('status', status)}
                        className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-2 text-[11px] font-semibold tracking-wide uppercase transition select-none sm:gap-1.5 sm:px-4 sm:text-xs ${
                          isActive
                            ? 'border border-[var(--color-outline)] bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] shadow-sm'
                            : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                        }`}
                      >
                        <Icon />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Genres / Tags Input Area */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                Genres / Tags
              </span>
              <div className="flex w-full flex-wrap items-center gap-2 rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] px-3 py-2">
                {genres.map((g, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-highest)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--color-primary)]"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          'genre',
                          genres.filter((genre) => genre !== g)
                        )
                      }
                      className="ml-1 cursor-pointer text-[10px] hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add genre..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value && !genres.includes(value)) {
                        setValue('genre', [...genres, value]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                  className="min-w-[100px] flex-1 border-none bg-transparent text-xs text-[var(--color-on-surface)] placeholder-[var(--color-outline)]/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Editorial Review Textarea */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase">
                Editorial Review
              </label>
              <textarea
                rows={6}
                placeholder="A visceral exploration of human isolation through the lens of giant mechanical deities..."
                {...register('review')}
                className="w-full resize-none rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] px-4 py-3 text-sm text-[var(--color-on-surface)] placeholder-[var(--color-outline)]/45 focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>

            {/* Form Button Actions Panel */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap sm:gap-4">
              {/* Save Button */}
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 px-8 select-none sm:w-auto"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Entry
              </Button>

              {/* Cancel Button */}
              <Button
                variant="ghost"
                size="lg"
                type="button"
                onClick={() => navigate('/vault')}
                className="w-full cursor-pointer bg-[var(--color-surface-container)] px-8 text-[var(--color-on-surface)] select-none hover:bg-[var(--color-surface-container-high)] sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AddToVault;
