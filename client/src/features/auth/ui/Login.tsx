import { Link } from 'react-router';
import { Mail, Lock, ArrowRight, EyeOff, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const Login = () => {
  const { register, handleSubmit, errors, isSubmitting, onLoginSubmit } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-(--color-background) px-4 py-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-[-20%] right-[-10%] h-[640px] w-[600px] rounded-full bg-(--color-primary) opacity-[0.03] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-(--color-primary) opacity-[0.02] blur-[120px]" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="font-display text-2xl font-bold text-(--color-primary)">WatchLore</span>

        <span className="mt-2 font-mono text-xs tracking-[0.3em] text-on-surface-variant uppercase">
          Archiving the Cinematic Journey
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-xl border border-[var(--color-card-border)] bg-[var(--color-surface-container-low)] p-8 shadow-lg">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-[var(--color-on-surface)]">Welcome Back</h2>

          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Sign in to access your curated archive.
          </p>
        </div>

        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs tracking-wider text-[var(--color-outline)] uppercase">
              <Mail size={14} />
              Email Address
            </label>

            <input
              type="email"
              placeholder="user@gmail.com"
              className={`w-full rounded-md border px-4 py-3 outline-none ${
                errors.email ? 'border-red-500' : 'border-[var(--color-outline-variant)]'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Invalid email address',
                },
              })}
            />

            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs tracking-wider text-[var(--color-outline)] uppercase">
              <Lock size={14} />
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full rounded-md border px-4 py-3 pr-12 outline-none ${
                  errors.password ? 'border-red-500' : 'border-[var(--color-outline-variant)]'
                }`}
                {...register('password', {
                  required: 'Password is required',
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-on-surface-variant"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] py-3 font-semibold text-[var(--color-on-primary)] disabled:opacity-50"
          >
            {isSubmitting ? 'Entering...' : 'Enter Archive'}

            <ArrowRight size={18} />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-[var(--color-divider)]" />

        {/* Register */}
        <div className="mt-8 text-center">
          <span className="text-sm text-on-surface-variant">New to the collection? </span>

          <Link to="/register" className="font-semibold text-(--color-primary) hover:underline">
            Register Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex gap-6 text-xs tracking-[0.25em] text-outline uppercase">
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/support">Support</Link>
      </div>
    </div>
  );
};

export default Login;
