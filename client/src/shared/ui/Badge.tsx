type BadgeVariant = 'status' | 'genre' | 'type';
type StatusValue = 'watching' | 'completed' | 'planned' | 'dropped';
type TypeValue = 'anime' | 'movie' | 'series';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  status?: StatusValue;
  type?: TypeValue;
  className?: string;
}

const statusStyles: Record<StatusValue, string> = {
  watching: 'bg-[#2A1F08] text-[var(--color-primary)] border border-[var(--color-primary)]/30',
  completed: 'bg-[#0D1F14] text-[#4A7C59] border border-[#4A7C59]/30',
  planned: 'bg-[#0D1A1F] text-[#5A7A8B] border border-[#5A7A8B]/30',
  dropped: 'bg-[#1F0D0D] text-[#8B3A3A] border border-[#8B3A3A]/30',
};

const typeStyles: Record<TypeValue, string> = {
  anime:
    'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]',
  movie:
    'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]',
  series:
    'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]',
};

export function Badge({ label, variant = 'genre', status, type, className = '' }: BadgeProps) {
  let styles =
    'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]';

  if (variant === 'status' && status) styles = statusStyles[status];
  if (variant === 'type' && type) styles = typeStyles[type];

  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest whitespace-nowrap uppercase ${styles} ${className} `}
    >
      {label}
    </span>
  );
}
