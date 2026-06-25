import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-primary)] text-[var(--color-on-primary)]
    hover:bg-[var(--color-primary-container)] hover:text-[var(--color-on-primary-container)]
    border border-transparent
  `,
  secondary: `
    bg-transparent text-[var(--color-primary)]
    border border-[var(--color-primary)]
    hover:bg-[var(--color-primary)]/10
  `,
  ghost: `
    bg-transparent text-[var(--color-on-surface-variant)]
    border border-transparent
    hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex cursor-pointer items-center justify-center rounded-[var(--radius)] font-body font-semibold tracking-wide transition-all duration-[var(--transition-duration-fast)] select-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 ${variantStyles[variant]} ${sizeStyles[size]} ${className} `}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
