import { Plus } from 'lucide-react';
import { Badge } from '../../../shared/ui/Badge';
import { Button } from '../../../shared/ui/Button';
import LoadingSkeleton from '../../../shared/ui/LoadingSkeleton';
import { Navbar } from '../../../shared/ui/Navbar';
import { useMovie } from '../hooks/useMovie';
import { useEffect, useRef } from 'react';
import addShowToVaultAPI from '../../../shared/api/AddShowToVaultApi';
import { useVaultShow } from '../../../shared/hooks/useVaultShow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

interface MoviesDATA {
  id: string;
  title: string;
  year?: string | number;
  type: 'anime' | 'movie' | 'series';
  rating: number;
  images: {
    url: string;
  };
  genre: string[];
  overview: string;
  status?: string;
  backdrop_image: {
    url: string;
  };
}

const TOP_GENRES = ['Drama', 'Action', 'Comedy', 'Thriller', 'Adventure'];

const MoviesPage = () => {
  const navigate = useNavigate();

  const { movies, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } = useMovie();

  const { vault } = useVaultShow();
  // console.log(vault);

  const queryClient = useQueryClient();
  const { mutate: addToVault, isPending: isAdding } = useMutation({
    mutationFn: addShowToVaultAPI,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vaultShows'] });
      toast.success(`${variables.title} - added to vault`);
    },
    onError: (error) => {
      toast.error('failed to add to vault');
      console.log('Failed to add movie to vault: ', error);
    },
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  // Set up intersection observer to detect when user reaches bottom
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending || !movies) return <LoadingSkeleton />;

  return (
    <>
      <Navbar currentPath="/movies" onVault={() => navigate('/vault')} />

      <section className="border-t border-[var(--color-divider)] bg-[var(--color-surface-container-lowest)] py-24">
        <div className="mx-auto max-w-[var(--layout-container-max)] px-[var(--layout-margin-desktop)] max-md:px-5">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-on-surface)] md:text-4xl">
              Discover movies worth adding to your vault
            </h2>

            {/* Filter  */}
            {/* <div className="flex justify-center gap-8"> */}
            {/*   {TOP_GENRES.map((g, i) => { */}
            {/*     return ( */}
            {/*       <div key={i}> */}
            {/*         <Button variant="ghost" onClick={() => console.log(`clicked - ${i} - ${g}`)}> */}
            {/*           {g} */}
            {/*         </Button> */}
            {/*       </div> */}
            {/*     ); */}
            {/*   })} */}
            {/* </div> */}
          </div>
          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {movies.map((card: MoviesDATA, index: number) => {
              // Compare case-insensitive title to verify if present in user's vault
              const isAlreadyAdded = vault?.some(
                (show: any) => show.title.toLowerCase() === card.title.toLowerCase()
              );
              return (
                <div key={index} className="group cursor-pointer">
                  {/* Poster Container */}
                  <div
                    onClick={() => console.log('movie container clicked')}
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-[var(--radius-md)] border border-white/5 bg-[var(--color-surface-container)]"
                  >
                    <img
                      src={card.images.url}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-[var(--transition-duration-slow)] group-hover:scale-105"
                    />
                    {/* Status Overlay (Using the Badge component) */}
                    <div className="absolute top-2.5 left-2.5">
                      <Badge
                        label={card.rating}
                        type="movie"
                        variant="status"
                        className="text-sm text-white"
                      />
                    </div>
                    {/* Black Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-[var(--transition-duration-base)] group-hover:bg-black/25" />
                  </div>
                  {/* Info */}
                  <div className="flex items-center justify-between gap-2 px-3 py-3">
                    <h4 className="truncate font-body text-sm font-semibold text-[var(--color-on-surface)] transition-colors duration-[var(--transition-duration-fast)] group-hover:text-[var(--color-primary)]">
                      {card.title}
                    </h4>

                    {/* Add Button */}
                    <Button
                      variant={isAlreadyAdded ? 'secondary' : 'primary'}
                      size="xs"
                      disabled={isAlreadyAdded || isAdding}
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering details click handlers
                        addToVault({
                          title: card.title,
                          type: 'movie',
                          genre: card.genre,
                          rating: card.rating,
                          imageUrl: card.images.url,
                          status: 'planned',
                          overview: card.overview,
                          backDropImage: card.backdrop_image.url,
                        });
                      }}
                    >
                      {isAlreadyAdded ? (
                        'Added'
                      ) : (
                        <>
                          <Plus size={16} /> Add
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* 
            Intersection target element at the bottom of the grid.
            This triggers the next page fetch when scrolled into view.
          */}
          <div ref={loadMoreRef} className="mt-12 flex min-h-[40px] w-full justify-center">
            {isFetchingNextPage && (
              <div className="animate-pulse font-mono text-sm text-[var(--color-outline)]">
                Loading more titles...
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MoviesPage;
