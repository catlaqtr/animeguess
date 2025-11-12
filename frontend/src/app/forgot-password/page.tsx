'use client';

import { useState } from 'react';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/lib/validations';
import { useForgotPassword } from '@/lib/hooks/useAuth';

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useForgotPassword();

  const extractErrorMessage = (err: unknown): string | undefined => {
    const axiosError = err as AxiosError<{ message?: string }>;
    return axiosError?.response?.data?.message;
  };

  const onSubmit = (data: ForgotPasswordFormData) => {
    setSubmittedEmail(null);
    mutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setSubmittedEmail(data.email);
        },
      }
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-500 via-indigo-500 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-black text-slate-900">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter the email address linked to your account. We&apos;ll send instructions to reset your
          password.
        </p>

        {submittedEmail && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            If an account with <strong>{submittedEmail}</strong> exists, we&apos;ve emailed password
            reset instructions. Please check your inbox (and spam folder).
          </div>
        )}

        {mutation.isError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {extractErrorMessage(mutation.error) ||
              'Unable to process password reset right now. Please try again later.'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="you@example.com"
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Sending reset link...' : 'Send reset link'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <Link className="hover:text-purple-600" href="/login">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
