import { useNavigate } from 'react-router';
import { useAppSelector } from '../app/hooks';
import { Navbar } from '../shared/ui/Navbar';
import { Button } from '../shared/ui/Button';
import { Badge } from '../shared/ui/Badge';
import { SHOWCASE_CARDS } from './Landingpage.constants';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((store) => store.auth);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-background)] text-[var(--color-on-background)] selection:bg-[var(--color-primary)] selection:text-[var(--color-on-primary)]">
      {/* Navigation */}
      <Navbar
        isAuthenticated={!!user}
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
        onVault={() => navigate('/home')}
        currentPath="/"
        showNavLinks={false}
        showSearch={false}
      />

      {/* 1. Hero Section */}
      <section className="relative mx-auto flex min-h-screen max-w-[var(--layout-container-max)] flex-col justify-center px-[var(--layout-margin-desktop)] pt-28 pb-16 max-md:px-5 md:flex-row md:items-center md:gap-12">
        {/* Hero Left Content */}
        <div className="flex-1 space-y-6">
          <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[var(--color-primary)] uppercase">
            Your Personal Cinema Archive
          </span>
          <h1 className="font-display text-[3.2rem] leading-[1.05] tracking-tight text-[var(--color-on-surface)] md:text-display-lg">
            Every Title.
            <br />
            <span className="font-semibold text-[var(--color-on-surface-variant)] italic">
              Every Memory.
            </span>
          </h1>
          <p className="max-w-md font-body text-base leading-relaxed text-[var(--color-outline)]">
            Track what you're watching, archive what you've loved, and discover what's next — all in
            one cinematic vault.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
              Get Started — It's Free
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
              Explore the Archive
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 font-mono text-[10px] tracking-widest text-[var(--color-outline-variant)] uppercase">
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-primary)]">•</span> No Credit Card
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-primary)]">•</span> Free Forever
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-primary)]">•</span> Cancel Anytime
            </span>
          </div>
        </div>

        {/* Hero Right Visuals (Stacked Card Fan) */}
        <div className="relative mt-16 flex h-[400px] flex-1 items-center justify-center max-md:hidden">
          {/* Card Fan Back Left */}
          <div className="absolute h-[315px] w-[210px] translate-x-[-110px] translate-y-[20px] scale-[0.9] -rotate-[10deg] overflow-hidden rounded-lg border border-white/5 bg-black/40 opacity-40 shadow-2xl transition-transform duration-[var(--transition-duration-slow)] hover:scale-[0.93]">
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80"
              alt="Background Film"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Card Fan Back Right */}
          <div className="absolute h-[315px] w-[210px] translate-x-[90px] translate-y-[15px] scale-[0.92] rotate-[12deg] overflow-hidden rounded-lg border border-white/5 bg-black/40 opacity-50 shadow-2xl transition-transform duration-[var(--transition-duration-slow)] hover:scale-[0.95]">
            <img
              src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80"
              alt="Background Cinema"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Card Fan Main Center (Yellow Motorcycle Visual) */}
          <div className="absolute h-[345px] w-[230px] translate-x-[-10px] rotate-[2deg] overflow-hidden rounded-lg border border-white/10 bg-[var(--color-surface-container)] shadow-[var(--shadow-level-2)] transition-transform duration-[var(--transition-duration-slow)] hover:scale-105 hover:rotate-0">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnpL25t5MSkNQEwitONOB4o8Qgxm2sso9bhxHPJuvRCvO5-1B63QuwM7I&s=10"
              alt="Fight Club"
              className="h-full w-full object-cover object-center"
            />
            {/* Dark Gradient bottom overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute right-4 bottom-4 left-4 flex justify-between">
              <span className="font-mono text-[9px] tracking-wider text-white/60">WL #982</span>
              <span className="font-mono text-[9px] tracking-wider text-[var(--color-primary)]">
                1080P
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Grid Section */}
      <section className="border-t border-[var(--color-divider)] bg-[var(--color-surface-container-lowest)] py-24">
        <div className="mx-auto max-w-[var(--layout-container-max)] px-[var(--layout-margin-desktop)] max-md:px-5">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-on-surface)] md:text-4xl">
              Built for the obsessive viewer
            </h2>
            <p className="mx-auto max-w-xl font-body text-sm leading-relaxed text-[var(--color-outline)]">
              Not a social network. Not a recommendation engine. A personal archive — yours,
              correct, private.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Your Vault */}
            <div className="space-y-4 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface-container-low)] p-6 transition-all duration-[var(--transition-duration-fast)] hover:border-[var(--color-primary)]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Your Vault
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                Your data is yours. Export it anytime. No algorithms dictating what you should see
                next.
              </p>
            </div>

            {/* Feature 2: Track Status */}
            <div className="space-y-4 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface-container-low)] p-6 transition-all duration-[var(--transition-duration-fast)] hover:border-[var(--color-primary)]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Track Status
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                From "Plan to Watch" to "Abandoned", track your progress with granular control over
                seasons and episodes.
              </p>
            </div>

            {/* Feature 3: Rate & Review */}
            <div className="space-y-4 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface-container-low)] p-6 transition-all duration-[var(--transition-duration-fast)] hover:border-[var(--color-primary)]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Rate & Review
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                Write detailed logs for every showing. Keep your thoughts private or share your
                curation journal entries.
              </p>
            </div>

            {/* Feature 4: Cover Art */}
            <div className="space-y-4 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface-container-low)] p-6 transition-all duration-[var(--transition-duration-fast)] hover:border-[var(--color-primary)]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Cover Art
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                Personalize your vault with a choice of high-resolution posters for every single
                title in our database.
              </p>
            </div>

            {/* Feature 5: Discover */}
            <div className="space-y-4 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface-container-low)] p-6 transition-all duration-[var(--transition-duration-fast)] hover:border-[var(--color-primary)]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Discover
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                Browse deep archive series by director, cinematographer, or studio. Find the hidden
                gems.
              </p>
            </div>

            {/* Feature 6: Light & Dark */}
            <div className="space-y-4 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface-container-low)] p-6 transition-all duration-[var(--transition-duration-fast)] hover:border-[var(--color-primary)]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.38 5.38 0 0 1-4.4 2.26 5.4 5.4 0 0 1-5.4-5.4 5.4 5.4 0 0 1 2.2-4.4C12.91 3.04 12.46 3 12 3z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Light & Dark
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                Switch between a crisp paper-white journal or a dark cinematic vault depending on
                your viewing mood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Steps Section (Simple by Design) */}
      <section className="border-t border-[var(--color-divider)] py-24">
        <div className="mx-auto max-w-[var(--layout-container-max)] px-[var(--layout-margin-desktop)] max-md:px-5">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-on-surface)] md:text-4xl">
              Simple by design
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="space-y-4">
              <span className="block font-display text-5xl font-bold text-[var(--color-outline-variant)]/40 md:text-6xl">
                01
              </span>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Create your account
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                Register in seconds. No screenings required. We value your privacy and data
                autonomy.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <span className="block font-display text-5xl font-bold text-[var(--color-outline-variant)]/40 md:text-6xl">
                02
              </span>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Add your first title
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                Search or browse our extensive archive. Pick a show, set your status, and add it to
                your collection.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <span className="block font-display text-5xl font-bold text-[var(--color-outline-variant)]/40 md:text-6xl">
                03
              </span>
              <h3 className="font-display text-lg font-bold text-[var(--color-on-surface)]">
                Build your archive
              </h3>
              <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
                Every title you add shapes your personal vault. Review your history and curate your
                watch-lists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Vault Showcase Section */}
      <section className="border-t border-[var(--color-divider)] bg-[var(--color-surface-container-lowest)] py-24">
        <div className="mx-auto max-w-[var(--layout-container-max)] px-[var(--layout-margin-desktop)] max-md:px-5">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-on-surface)] md:text-4xl">
              What your vault looks like
            </h2>
            <p className="mx-auto max-w-xl font-body text-sm leading-relaxed text-[var(--color-outline)]">
              A curated grid of your views.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {SHOWCASE_CARDS.map((card, index) => (
              <div key={index} className="group cursor-pointer">
                {/* Poster Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[var(--radius-md)] border border-white/5 bg-[var(--color-surface-container)]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-[var(--transition-duration-slow)] group-hover:scale-105"
                  />
                  {/* Status Overlay (Using the Badge component) */}
                  <div className="absolute top-2.5 left-2.5">
                    <Badge label={card.statusLabel} variant="status" status={card.status} />
                  </div>
                  {/* Resolution Indicator */}
                  <div className="absolute right-2.5 bottom-2.5">
                    <span className="rounded-sm border border-white/10 bg-black/60 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-white/80 uppercase backdrop-blur-xs">
                      {card.resolution}
                    </span>
                  </div>
                  {/* Black Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-[var(--transition-duration-base)] group-hover:bg-black/25" />
                </div>
                {/* Info */}
                <h4 className="mt-3 truncate font-body text-xs font-semibold text-[var(--color-on-surface)] transition-colors duration-[var(--transition-duration-fast)] group-hover:text-[var(--color-primary)]">
                  {card.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call-To-Action (CTA) Section */}
      <section className="border-t border-[var(--color-divider)] py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6 px-5">
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-[var(--color-primary)] uppercase">
            Start Your Archive
          </span>
          <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-[var(--color-on-surface)] md:text-[2.6rem]">
            Your watchlist deserves better than a notes app.
          </h2>
          <p className="mx-auto max-w-md font-body text-sm leading-relaxed text-[var(--color-outline)]">
            WatchLore is free, always. Join a community of intentional viewers.
          </p>
          <div className="pt-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Custom Landing Footer */}
      <footer className="border-t border-[var(--color-divider)] bg-[var(--color-surface-container-lowest)] py-16">
        <div className="mx-auto grid max-w-[var(--layout-container-max)] grid-cols-1 gap-12 px-[var(--layout-margin-desktop)] max-md:px-5 md:grid-cols-3">
          {/* Logo column */}
          <div className="max-w-sm space-y-4">
            <p className="font-display text-xl font-bold tracking-tight text-[var(--color-primary)]">
              WatchLore
            </p>
            <p className="font-body text-xs leading-relaxed text-[var(--color-outline)]">
              A collector-grade cinematic archive for intentional viewers. Curate your history,
              track your future, and own your data.
            </p>
            <p className="pt-2 font-mono text-[9px] tracking-widest text-[var(--color-outline-variant)] uppercase">
              © 2026 WatchLore Archive. All rights reserved.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] font-bold tracking-[0.15em] text-[var(--color-primary)] uppercase">
              Discover
            </h5>
            <nav className="flex flex-col gap-2">
              <a
                href="#"
                className="font-body text-xs text-[var(--color-outline)] transition-colors hover:text-[var(--color-primary)]"
              >
                Archive
              </a>
              <a
                href="#"
                className="font-body text-xs text-[var(--color-outline)] transition-colors hover:text-[var(--color-primary)]"
              >
                Curators
              </a>
              <a
                href="#"
                className="font-body text-xs text-[var(--color-outline)] transition-colors hover:text-[var(--color-primary)]"
              >
                Explore
              </a>
            </nav>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] font-bold tracking-[0.15em] text-[var(--color-primary)] uppercase">
              Platform
            </h5>
            <nav className="flex flex-col gap-2">
              <a
                href="#"
                className="font-body text-xs text-[var(--color-outline)] transition-colors hover:text-[var(--color-primary)]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-body text-xs text-[var(--color-outline)] transition-colors hover:text-[var(--color-primary)]"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="font-body text-xs text-[var(--color-outline)] transition-colors hover:text-[var(--color-primary)]"
              >
                API Docs
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
