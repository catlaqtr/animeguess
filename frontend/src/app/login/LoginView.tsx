'use client';

import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useLogin } from '@/lib/hooks/useAuth';
import type { LoginRequest } from '@/lib/api';

export default function LoginView() {
  const { mutate: login, isPending, error } = useLogin();
  const searchParams = useSearchParams();

  const apiBaseUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return base.replace(/\/$/, '');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data as LoginRequest);
  };

  const handleGoogleLogin = useCallback(() => {
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google`;
  }, [apiBaseUrl]);

  const shouldShowOAuthError = searchParams?.get('oauth') === 'failed';

  const extractErrorMessage = (err: unknown): string | undefined => {
    const axiosError = err as AxiosError<{ message?: string }>;
    return axiosError?.response?.data?.message;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute left-10 top-10 animate-float text-6xl opacity-20">⭐</div>
      <div
        className="absolute right-20 top-20 animate-float text-5xl opacity-20"
        style={{ animationDelay: '1s' }}
      >
        ✨
      </div>
      <div
        className="absolute left-20 bottom-20 animate-float text-7xl opacity-20"
        style={{ animationDelay: '2s' }}
      >
        🌸
      </div>
      <div
        className="absolute right-10 bottom-10 animate-float text-6xl opacity-20"
        style={{ animationDelay: '1.5s' }}
      >
        💫
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="anime-card relative z-10 w-full max-w-md p-8"
      >
        <motion.h1
          initial={{ scale: 0.5, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.6 }}
          className="animate-glow bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-center text-5xl font-black text-transparent"
          style={{ fontFamily: 'Bangers, cursive' }}
        >
          🎌 ANIME GUESS
        </motion.h1>
        <p className="mb-8 text-center font-semibold text-gray-700">Welcome back, player! 🎮</p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          >
            {extractErrorMessage(error) || 'Login failed. Please try again.'}
          </motion.div>
        )}

        {shouldShowOAuthError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          >
            Google sign-in failed. Please try again or use your username and password.
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              {...register('username')}
              type="text"
              id="username"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="mt-2 text-right text-xs">
              <Link
                href="/forgot-password"
                className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text font-semibold text-transparent hover:from-pink-500 hover:to-purple-600"
              >
                Forgot password?
              </Link>
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isPending}
            className="anime-button w-full rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '⚡ Signing in...' : '🎮 Sign In & Play!'}
          </motion.button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          <span className="px-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span className="text-2xl">🔐</span>
          Sign in with Google
        </motion.button>

        <div className="mt-6 text-center">
          <p className="font-medium text-gray-700">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text font-bold text-transparent transition-all hover:from-pink-500 hover:to-purple-600"
            >
              Sign up here! ✨
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
