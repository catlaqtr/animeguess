'use client';

import { useState } from 'react';

export default function SentryTestPage() {
  const [hasThrown, setHasThrown] = useState(false);

  const handleClick = () => {
    setHasThrown(true);
    throw new Error('Frontend Sentry integration test');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950 text-white">
      <h1 className="text-3xl font-semibold">Sentry Test Page</h1>
      <p className="max-w-xl text-center text-slate-300">
        Click the button below to intentionally crash this page and send an event to Sentry. Refresh
        afterwards to use the app normally.
      </p>
      <button
        type="button"
        className="rounded bg-red-500 px-6 py-3 text-lg font-medium hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        onClick={handleClick}
        disabled={hasThrown}
      >
        Trigger Frontend Sentry Error
      </button>
    </div>
  );
}
