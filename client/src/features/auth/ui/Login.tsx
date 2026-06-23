import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { register, handleSubmit, errors, isSubmitting, onLoginSubmit, navigate } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">Login</h1>

        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-blue-500"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-blue-500"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => navigate('/')}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="font-semibold text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
