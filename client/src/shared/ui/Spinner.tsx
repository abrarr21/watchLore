interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-[var(--color-outline-variant)] border-t-[var(--color-primary)] ${sizes[size]} ${className} `}
      role="status"
      aria-label="Loading"
    />
  );
}
