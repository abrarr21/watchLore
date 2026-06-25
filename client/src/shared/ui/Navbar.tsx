import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Lock, LogOut } from 'lucide-react';
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
      <div className="mx-auto flex h-18 max-w-[var(--layout-container-max)] items-center justify-between gap-6 px-[var(--layout-margin-desktop)] max-md:px-5 md:h-22">
        {/* Logo */}
        <Link
          to="/"
          className="flex-shrink-0 font-display text-2xl font-bold tracking-tight text-[var(--color-primary)] transition-colors duration-[var(--transition-duration-fast)] hover:text-[var(--color-primary-container)] md:text-3xl"
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
        <div className="flex items-center gap-3">
          {/* Search */}
          {showSearch && (
            <button className="flex h-8 w-8 items-center justify-center text-[var(--color-on-surface-variant)] transition-colors duration-[var(--transition-duration-fast)] hover:text-[var(--color-on-surface)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          )}

          {/* vault */}
          <Button
            onClick={onVault}
            size="sm"
            variant="secondary"
            className="flex cursor-pointer items-center gap-1.5 rounded-[var(--radius)] bg-[var(--color-surface-container)] px-3 py-1.5 text-sm font-semibold text-[var(--color-on-surface)] transition-colors duration-[var(--transition-duration-fast)] hover:bg-[var(--color-surface-container-high)]"
          >
            <Lock size={16} />
            My Vault
          </Button>

          {/* Logout Button */}
          {user && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1 rounded-2xl"
              onClick={handleLogout}
            >
              <LogOut size={16} />
            </Button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-on-surface-variant)] transition-colors duration-[var(--transition-duration-fast)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)]"
          >
            {theme === 'dark' ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          {showNavLinks && (
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center text-[var(--color-on-surface-variant)] md:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {showNavLinks && mobileOpen && (
        <div className="border-t border-[var(--color-divider)] bg-[var(--color-background)]/95 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="py-2.5 text-sm font-semibold text-[var(--color-on-surface-variant)] transition-colors duration-[var(--transition-duration-fast)] hover:text-[var(--color-primary)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
