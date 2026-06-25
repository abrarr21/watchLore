const FOOTER_LINKS = ['Archive', 'Curators', 'Explore', 'Privacy', 'Terms'];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--color-divider)] bg-[var(--color-surface-container-lowest)]">
      <div className="mx-auto flex max-w-[var(--layout-container-max)] flex-col items-start justify-between gap-6 px-[var(--layout-margin-desktop)] py-10 max-md:px-5 md:flex-row md:items-center">
        <div className="max-w-xs">
          <p className="font-display text-lg font-bold text-[var(--color-primary)]">WatchLore</p>
          <p className="mt-2 font-body text-xs leading-relaxed text-[var(--color-outline)]">
            The definitive archival resource for premium cinema, anime, and series. Preserving the
            legacy of film as high art.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-outline)] uppercase transition-colors duration-[var(--transition-duration-fast)] hover:text-[var(--color-primary)]"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-[var(--color-divider)] px-[var(--layout-margin-desktop)] py-4 max-md:px-5">
        <p className="text-center font-mono text-[10px] tracking-[0.08em] text-[var(--color-outline)]/60 uppercase">
          © 2026 WatchLore Archive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
