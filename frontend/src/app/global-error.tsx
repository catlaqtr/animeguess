'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 text-6xl">😵‍💫</div>
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-sm text-slate-300">
            Our team has been notified. You can try again or head back home.
          </p>
          {error.digest ? (
            <p className="mt-2 text-xs text-slate-400">Error ID: {error.digest}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-100 hover:border-slate-400"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
