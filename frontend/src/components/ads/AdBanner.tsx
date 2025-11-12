'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

type AdBannerProps = {
  slot: string;
  className?: string;
};

const clientId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

export default function AdBanner({ slot, className }: AdBannerProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    const markInteracted = () => {
      setHasInteracted(true);
      window.removeEventListener('pointerdown', markInteracted);
      window.removeEventListener('keydown', markInteracted);
    };

    window.addEventListener('pointerdown', markInteracted, { once: true });
    window.addEventListener('keydown', markInteracted, { once: true });

    return () => {
      window.removeEventListener('pointerdown', markInteracted);
      window.removeEventListener('keydown', markInteracted);
    };
  }, []);

  useEffect(() => {
    if (!clientId || !hasInteracted) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('AdSense push error', error);
      }
    }
  }, [hasInteracted, slot]);

  if (!clientId || !hasInteracted) {
    return null;
  }

  return (
    <ins
      className={`adsbygoogle block ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
