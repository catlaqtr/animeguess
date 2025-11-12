'use client';

import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ResetPasswordFormData, resetPasswordSchema } from '@/lib/validations';
import { useResetPassword } from '@/lib/hooks/useAuth';
import { authAPI } from '@/lib/api';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [resetComplete, setResetComplete] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const mutation = useResetPassword(() => {
    setResetComplete(true);
    setTimeout(() => router.push('/login'), 2000);
  });

  const extractErrorMessage = (err: unknown): string | undefined => {
    const axiosError = err as AxiosError<{ message?: string }>;
    return axiosError?.response?.data?.message;
  };

  useEffect(() => {
    if (!token) {
      setTokenError('Reset token missing. Please use the link from your email.');
      setIsValidating(false);
      return;
    }

    setValue('token', token);

    const validate = async () => {
      try {
        await authAPI.validateResetToken(token);
        setTokenError(null);
      } catch (error: unknown) {
        setTokenError(extractErrorMessage(error) || 'This reset link is invalid or expired.');
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [token, setValue]);

  const onSubmit = (data: ResetPasswordFormData) => {
    mutation.mutate({ token: data.token, newPassword: data.password });
  };

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        Validating reset link...
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 text-center text-white">
        <div className="max-w-md space-y-4">
          <div className="text-5xl">⛔</div>
          <p>{tokenError}</p>
          <p className="text-sm text-slate-300">
            If you need a new link, please submit your email again on the forgot password page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-black text-slate-900">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose a strong password that you haven’t used before. You’ll be able to sign in right
          away.
        </p>

        {resetComplete && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            Password updated! Redirecting to login...
          </div>
        )}

        {mutation.isError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {extractErrorMessage(mutation.error) ||
              'Unable to reset password. Please request a new link.'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <input type="hidden" {...register('token')} />
          <div>
            <label className="block text-sm font-semibold text-slate-700">New password</label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Enter a new password"
              required
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Confirm password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Re-enter your new password"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={mutation.isPending || resetComplete}
            className="w-full rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Resetting...' : 'Reset password'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
