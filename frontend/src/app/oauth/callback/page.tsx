'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleAuthResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    if (hasHandledRef.current) {
      return;
    }

    const token = searchParams.get('token');
    const type = searchParams.get('type') ?? 'Bearer';
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');
    const email = searchParams.get('email');

    const parsedUserId = userId ? Number(userId) : NaN;

    if (token && username && email && Number.isFinite(parsedUserId)) {
      hasHandledRef.current = true;

      handleAuthResponse({
        token,
        type,
        userId: parsedUserId,
        username,
        email,
      });

      router.replace('/game');
    } else {
      hasHandledRef.current = true;
      router.replace('/login?oauth=failed');
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-white to-pink-100 p-6 text-center">
      <div className="w-full max-w-md rounded-3xl bg-white/80 p-10 shadow-xl backdrop-blur-md">
        <h1 className="mb-4 text-3xl font-bold text-purple-700">Signing you in…</h1>
        <p className="text-gray-600">
          We&apos;re completing your Google sign-in and getting your game ready. Hang tight!
        </p>
      </div>
    </div>
  );
}
