'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { isAxiosError } from 'axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { useRegister, useResendVerification } from '@/lib/hooks/useAuth';
import type { RegisterRequest } from '@/lib/api';

export default function RegisterView() {
  const { mutate: register, isPending, error } = useRegister();
  const resendVerification = useResendVerification();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registrationErrorMessage = useMemo(() => {
    if (!error || !isAxiosError(error)) {
      return undefined;
    }

    const errorData = error.response?.data;

    // Handle validation errors (returns { errors: { field: message } })
    if (errorData?.errors && typeof errorData.errors === 'object') {
      const errorMessages = Object.values(errorData.errors) as string[];
      return errorMessages.join(', ') || 'Validation failed. Please check your input.';
    }

    // Handle regular error messages
    return errorData?.message || 'Registration failed. Please try again.';
  }, [error]);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    void confirmPassword;
    setCaptchaError(null);

    if (!executeRecaptcha) {
      setCaptchaError('reCAPTCHA is still loading. Please try again in a moment.');
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('register');

      if (!recaptchaToken) {
        setCaptchaError('Unable to verify reCAPTCHA. Please refresh and try again.');
        return;
      }

      const payload: RegisterRequest = {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        recaptchaToken,
      };

      register(payload, {
        onSuccess: (response) => {
          setSuccessMessage(response.message);
          setRegisteredEmail(registerData.email);
        },
      });
    } catch {
      setCaptchaError('reCAPTCHA verification failed. Please refresh and try again.');
    }
  };

  const handleResendVerification = () => {
    if (!registeredEmail) return;
    resendVerification.mutate({ email: registeredEmail });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute right-10 top-10 animate-float text-6xl opacity-20">🎯</div>
      <div
        className="absolute left-16 top-32 animate-float text-5xl opacity-20"
        style={{ animationDelay: '1.2s' }}
      >
        🎨
      </div>
      <div
        className="absolute right-24 bottom-20 animate-float text-7xl opacity-20"
        style={{ animationDelay: '2.3s' }}
      >
        🌟
      </div>
      <div
        className="absolute left-12 bottom-16 animate-float text-6xl opacity-20"
        style={{ animationDelay: '1.8s' }}
      >
        ⚡
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="anime-card relative z-10 w-full max-w-md p-8"
      >
        <motion.h1
          initial={{ scale: 0.5, rotate: 5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.6 }}
          className="animate-glow bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 bg-clip-text text-center text-5xl font-black text-transparent"
          style={{ fontFamily: 'Bangers, cursive' }}
        >
          🎌 JOIN THE GAME
        </motion.h1>
        <p className="mb-8 text-center font-semibold text-gray-700">
          Become a legendary player! 🏆
        </p>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-sm text-green-800"
          >
            <p>{successMessage}</p>
            <p className="mt-2">
              We sent a verification link to{' '}
              <span className="font-semibold">{registeredEmail}</span>. Check your inbox (and spam
              folder) to activate your account.
            </p>
          </motion.div>
        )}

        {(captchaError || registrationErrorMessage) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          >
            {captchaError || registrationErrorMessage || 'Registration failed. Please try again.'}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              {...registerField('username')}
              type="text"
              id="username"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a username"
              disabled={!!successMessage}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...registerField('email')}
              type="email"
              id="email"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
              disabled={!!successMessage}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...registerField('password')}
              type="password"
              id="password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="At least 6 characters"
              disabled={!!successMessage}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              {...registerField('confirmPassword')}
              type="password"
              id="confirmPassword"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter your password"
              disabled={!!successMessage}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: successMessage ? 1 : 1.05 }}
            whileTap={{ scale: successMessage ? 1 : 0.95 }}
            type="submit"
            disabled={isPending || !!successMessage}
            className="anime-button w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? '✨ Creating account...'
              : successMessage
                ? 'Check your email'
                : '🚀 Sign Up & Start!'}
          </motion.button>
        </form>

        {successMessage && (
          <div className="mt-6 space-y-3 text-center text-sm text-gray-700">
            <p>
              Didn&apos;t receive the email?{' '}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendVerification.isPending}
                className="font-semibold text-purple-600 hover:text-purple-700 disabled:opacity-60"
              >
                {resendVerification.isPending ? 'Resending…' : 'Resend verification email'}
              </button>
            </p>
            {resendVerification.isSuccess && (
              <p className="text-green-600">{resendVerification.data?.message}</p>
            )}
            {resendVerification.isError && isAxiosError(resendVerification.error) && (
              <p className="text-red-600">
                {resendVerification.error.response?.data?.message ||
                  'Unable to resend verification email. Please try again later.'}
              </p>
            )}
            <div className="pt-2">
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text font-bold text-transparent transition-all hover:from-purple-500 hover:to-blue-600"
              >
                Go to sign in →
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="font-medium text-gray-700">
            Already have an account?{' '}
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text font-bold text-transparent transition-all hover:from-purple-500 hover:to-blue-600"
            >
              Sign in here! 🎮
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
