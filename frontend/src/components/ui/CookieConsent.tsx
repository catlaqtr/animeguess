'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'animeguess-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-0">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl transition-all">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">We use cookies</h2>
            <p className="mt-1 text-xs text-slate-600">
              We use essential cookies to keep Anime Guess Game running and analytics cookies to
              improve your experience. By clicking &quot;Accept&quot;, you agree to our{' '}
              <a className="underline hover:text-purple-600" href="/privacy">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a className="underline hover:text-purple-600" href="/terms">
                Terms of Service
              </a>
              .
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
