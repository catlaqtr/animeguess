'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { isAxiosError } from 'axios';
import { authAPI } from '@/lib/api';

type Status = 'loading' | 'success' | 'error' | 'missing';

export const dynamic = 'force-dynamic';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState<string>('Verifying your email...');
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('missing');
      setMessage('Verification token is missing. Please use the link from your email.');
      return;
    }

    if (hasAttemptedRef.current) {
      return;
    }

    hasAttemptedRef.current = true;

    const verify = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');

        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');

        if (isAxiosError(error)) {
          setMessage(
            error.response?.data?.message || 'Unable to verify email. The link may have expired.'
          );
        } else {
          setMessage('Something went wrong while verifying your email.');
        }
      }
    };

    void verify();
  }, [router, searchParams]);

  const renderIcon = () => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
      case 'missing':
        return '⚠️';
      default:
        return '⌛';
    }
  };

  const renderTitle = () => {
    switch (status) {
      case 'success':
        return 'Email verified!';
      case 'error':
        return 'Verification failed';
      case 'missing':
        return 'Token missing';
      default:
        return 'Verifying...';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur"
      >
        <div className="text-5xl">{renderIcon()}</div>
        <h1 className="mt-4 text-2xl font-bold">{renderTitle()}</h1>
        <p className="mt-3 text-sm text-slate-200">{message}</p>

        {status === 'success' && (
          <p className="mt-4 text-xs text-slate-400">
            Redirecting you to the sign-in page. You can close this tab if nothing happens.
          </p>
        )}

        {(status === 'error' || status === 'missing') && (
          <div className="mt-6 space-y-3 text-sm">
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="w-full rounded-full bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
            >
              Create a new account
            </button>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full rounded-full border border-white/20 px-4 py-2 font-semibold text-white hover:border-white/40"
            >
              Back to sign in
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
