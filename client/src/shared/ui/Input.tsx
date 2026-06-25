import { type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export function Input({ label, error, hint, icon, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-xs font-semibold tracking-widest text-[var(--color-on-surface-variant)] uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-outline)]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full rounded-[var(--radius)] border bg-[var(--color-surface-container)] text-[var(--color-on-surface)] ${error ? 'border-[var(--color-error)]' : 'border-[var(--color-outline-variant)]'} ${icon ? 'pl-10' : 'pl-4'} py-2.5 pr-4 font-body text-sm transition-colors duration-[var(--transition-duration-fast)] placeholder:text-[var(--color-outline)] focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-container-high)] focus:outline-none ${className} `}
          {...props}
        />
      </div>
      {error && <p className="font-body text-xs text-[var(--color-error)]">{error}</p>}
      {hint && !error && <p className="font-body text-xs text-[var(--color-outline)]">{hint}</p>}
    </div>
  );
}
