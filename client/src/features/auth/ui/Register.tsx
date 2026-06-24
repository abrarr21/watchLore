import { useState } from 'react';
import { Link } from 'react-router';
import { User, AtSign, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const {
    registerRegister,
    handleRegisterSubmit,
    watchRegister,
    errorsRegister,
    isSubmittingRegister,
    onRegisterSubmit,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watchRegister('password');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-background)] px-4 py-8">
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[var(--color-primary)] opacity-[0.03] blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[var(--color-primary)] opacity-[0.02] blur-[120px]" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-[var(--color-primary)]">WatchLore</h1>

          <p className="mt-2 font-mono text-xs tracking-[0.3em] text-[var(--color-on-surface-variant)] uppercase">
            The Collector's Archive
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-surface-container-low)] p-8 shadow-xl backdrop-blur">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-[var(--color-on-surface)]">
              Create Account
            </h2>

            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Join our curated archive of cinema and anime.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs tracking-wider text-[var(--color-outline)] uppercase">
                <User size={14} />
                Full Name
              </label>

              <input
                type="text"
                placeholder="Alexander Thorne"
                className="w-full rounded-md border border-[var(--color-outline-variant)] px-4 py-3 outline-none"
                {...registerRegister('name', {
                  required: 'Full name is required',
                })}
              />

              {errorsRegister.name && (
                <p className="mt-1 text-xs text-red-500">{errorsRegister.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs tracking-wider text-[var(--color-outline)] uppercase">
                <AtSign size={14} />
                Username
              </label>

              <input
                type="text"
                placeholder="archivist_01"
                className="w-full rounded-md border border-[var(--color-outline-variant)] px-4 py-3 outline-none"
                {...registerRegister('username', {
                  required: 'Username is required',
                })}
              />

              {errorsRegister.username && (
                <p className="mt-1 text-xs text-red-500">{errorsRegister.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs tracking-wider text-[var(--color-outline)] uppercase">
                <Mail size={14} />
                Email Address
              </label>

              <input
                type="email"
                placeholder="archive@watchlore.com"
                className="w-full rounded-md border border-[var(--color-outline-variant)] px-4 py-3 outline-none"
                {...registerRegister('email', {
                  required: 'Email is required',
                })}
              />

              {errorsRegister.email && (
                <p className="mt-1 text-xs text-red-500">{errorsRegister.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs tracking-wider text-[var(--color-outline)] uppercase">
                <Lock size={14} />
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[var(--color-outline-variant)] px-4 py-3 pr-12 outline-none"
                  {...registerRegister('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 characters',
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errorsRegister.password && (
                <p className="mt-1 text-xs text-red-500">{errorsRegister.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs tracking-wider text-[var(--color-outline)] uppercase">
                <Lock size={14} />
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[var(--color-outline-variant)] px-4 py-3 pr-12 outline-none"
                  {...registerRegister('confirmPassword', {
                    required: 'Confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errorsRegister.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errorsRegister.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmittingRegister}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] py-3 font-semibold text-[var(--color-on-primary)] transition disabled:opacity-50"
            >
              {isSubmittingRegister ? 'Creating Account...' : 'Create Account'}

              <ArrowRight size={18} />
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <span className="text-sm text-[var(--color-on-surface-variant)]">
              Already a member?{' '}
            </span>

            <Link to="/" className="font-semibold text-[var(--color-primary)] hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
