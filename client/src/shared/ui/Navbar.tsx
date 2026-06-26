import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Lock, LogOut, Sun, Moon, Search, Menu, X } from 'lucide-react';
import { useLogout } from '../hooks/useLogout';
import { removeUser } from '../../features/auth/state/auth/authSlice';

type NavLink = { label: string; href: string; active?: boolean };

const NAV_LINKS: NavLink[] = [
  { label: 'Discover', href: '/home', active: true },
  { label: 'Movies', href: '/movies' },
  { label: 'Anime', href: '/anime' },
  { label: 'Series', href: '/series' },
];

interface NavbarProps {
  onVault?: () => void;
  currentPath?: string;
  showNavLinks?: boolean;
  showSearch?: boolean;
}

export function Navbar({
  onVault,
  currentPath = '/',
  showNavLinks = true,
  showSearch = true,
}: NavbarProps) {
  const { user } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      useLogout();

      // remove user from redux
      dispatch(removeUser());

      navigate('/');
    } catch (error) {
      console.log(`Error logout: `, error);
    }
  };

  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') ?? 'dark';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [mobileOpen]);

  // Close the drawer automatically if the viewport grows back to desktop size.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-[var(--transition-duration-base)] ${
        scrolled
          ? 'border-b border-[var(--color-divider)] bg-[var(--color-background)]/90 shadow-[var(--shadow-level-1)] backdrop-blur-md'
          : 'bg-transparent'
      } `}
    >
      <div className="mx-auto flex h-16 max-w-[var(--layout-container-max)] items-center justify-between gap-6 px-[var(--layout-margin-desktop)] max-md:px-4 md:h-22">
        {/* Logo */}
        <Link
          to="/"
          className="flex-shrink-0 font-display text-xl font-bold tracking-tight text-[var(--color-primary)] transition-colors duration-[var(--transition-duration-fast)] hover:text-[var(--color-primary-container)] md:text-3xl"
        >
          WatchLore
        </Link>

        {/* Desktop nav */}
        {showNavLinks && (
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative px-3 py-1.5 font-body text-sm font-semibold transition-colors duration-[var(--transition-duration-fast)] ${
                    isActive
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                  } `}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute right-3 bottom-0 left-3 h-0.5 rounded-full bg-[var(--color-primary)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search (hidden on the smallest screens to reduce clutter next to the hamburger) */}
          {showSearch && (
            <button
              aria-label="Search"
              className="xs:flex hidden h-8 w-8 items-center justify-center text-[var(--color-on-surface-variant)] transition-colors duration-[var(--transition-duration-fast)] hover:text-[var(--color-on-surface)]"
            >
              <Search size={16} />
            </button>
          )}

          {/* vault */}
          <Button
            onClick={onVault}
            size="sm"
            variant="secondary"
            className="flex cursor-pointer items-center gap-1.5 rounded-[var(--radius)] bg-[var(--color-surface-container)] px-2.5 py-1.5 text-sm font-semibold text-[var(--color-on-surface)] transition-colors duration-[var(--transition-duration-fast)] hover:bg-[var(--color-surface-container-high)] md:px-3"
          >
            <Lock size={16} />
            <span className="hidden sm:inline">My Vault</span>
          </Button>

          {/* Logout Button (Desktop only — mobile uses the drawer's logout button) */}
          {user && (
            <Button
              variant="primary"
              size="sm"
              className="hidden items-center gap-1.5 rounded-2xl md:flex"
              onClick={handleLogout}
            >
              <LogOut size={16} />
            </Button>
          )}

          {/* Theme toggle (Desktop only — mobile uses the drawer's theme button) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden h-8 w-8 items-center justify-center rounded-full text-[var(--color-on-surface-variant)] transition-colors duration-[var(--transition-duration-fast)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] md:flex"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Mobile menu toggle button */}
          {showNavLinks && (
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              className="flex h-9 w-9 cursor-pointer items-center justify-center text-[var(--color-on-surface-variant)] md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Sidebar Overlay) */}
      {showNavLinks && (
        <>
          {/* Backdrop blur overlay */}
          <div
            className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
              mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Sidebar Drawer */}
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className={`fixed top-0 right-0 bottom-0 z-50 flex w-72 max-w-[80vw] flex-col border-l border-[var(--color-divider)] bg-[var(--color-background)] p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
              mobileOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Header */}
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl font-bold text-[var(--color-primary)]">
                WatchLore
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="cursor-pointer text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="mb-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <hr className="border-[var(--color-divider)]" />

            {/* Spacer pushes the icon row to the bottom of the drawer */}
            <div className="flex-1" />

            {/* Drawer Footer: theme icon + logout icon, side by side */}
            <div className="flex items-center gap-3">
              {/* Theme Selector Option */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--color-surface-container)] px-4 py-3 text-sm font-semibold text-[var(--color-on-surface)] transition-all hover:bg-[var(--color-surface-container-high)]"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              {/* Logout Button */}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  aria-label="Sign out"
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-on-primary)] transition-all hover:opacity-90"
                >
                  <LogOut size={16} />
                  <span>LogOut</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
