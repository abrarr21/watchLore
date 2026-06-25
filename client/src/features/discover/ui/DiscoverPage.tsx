import { Navbar } from '../../../shared/ui/Navbar';
import { Footer } from '../../../shared/ui/Footer';
import { HeroSection } from './HeroSection';
import { ShowRow } from './ShowRow';
import { SeriesCard } from './SeriesCard';
import type { ShowCardData } from './ShowCard';
import { useDiscover } from '../hooks/useDiscover';
import { axiosInstance } from '../../../config/axiosInstance';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../../app/hooks';
import { removeUser } from '../../auth/state/auth/authSlice';

// ─── Page ─────────────────────────────────────────────────────────────────────

const DiscoverPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { heroShow, trendingShows, trendingMovies, trendingAnime, trendingSeries, isPending } =
    useDiscover();

  if (isPending || !heroShow) return <h1>Loading...</h1>;

  const handleCardClick = (show: ShowCardData) => {
    console.log('Navigate to show:', show.id);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar
        currentPath="/"
        onLogout={async () => {
          try {
            await axiosInstance.post(`/auth/users/logout`);

            // Remove user from redux
            dispatch(removeUser());

            navigate('/');
          } catch (error) {
            console.log('Failed to logout: ', error);
          }
        }}
      />

      {/* Hero — flush to top, no padding, nav floats over it */}
      <HeroSection
        show={heroShow}
        onAddToVault={(id) => console.log('add to vault', id)}
        onViewTrailer={(id) => console.log('view trailer', id)}
      />

      {/* Main content */}
      <main className="mx-auto mt-14 max-w-[var(--layout-container-max)] space-y-14 px-[var(--layout-margin-desktop)] max-md:px-5">
        {/* Trending This Week */}
        <ShowRow
          title="Trending This Week"
          subtitle="Curated selection of most watched titles"
          shows={trendingShows}
          onViewAll={() => console.log('view all trending')}
          onCardClick={handleCardClick}
        />

        {/* Popular Anime */}
        <ShowRow title="Popular Anime" shows={trendingAnime} onCardClick={handleCardClick} />

        {/* Popular Movies */}
        <ShowRow title="Popular Movies" shows={trendingMovies} onCardClick={handleCardClick} />

        {/* Popular Series — wider card layout */}
        <section className="w-full">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--color-on-surface)]">
              Popular Series
            </h2>
          </div>
          <div
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingSeries.map((show: ShowCardData) => (
              <SeriesCard key={show.id} show={show} onClick={handleCardClick} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DiscoverPage;
