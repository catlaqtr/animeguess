import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import MainNav from '@/components/navigation/MainNav';
import Footer from '@/components/layout/Footer';

const CookieConsent = dynamic(() => import('@/components/ui/CookieConsent'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Anime Guess Game - Can You Guess the Character?',
    template: '%s | Anime Guess Game',
  },
  description: 'Test your anime knowledge! Ask questions and guess the secret anime character.',
  keywords: ['anime', 'game', 'guessing game', 'trivia', 'anime characters'],
  authors: [{ name: 'Anime Guess Game' }],
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Anime Guess Game',
    description: 'Test your anime knowledge by guessing secret characters!',
    url: siteUrl,
    type: 'website',
    siteName: 'Anime Guess Game',
    images: [
      {
        url: `${siteUrl}/logo.svg`,
        width: 200,
        height: 60,
        alt: 'Anime Guess Game Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anime Guess Game',
    description: 'Test your anime knowledge by guessing secret characters!',
    images: [`${siteUrl}/logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(googleSiteVerification && {
    verification: {
      google: googleSiteVerification,
    },
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Anime Guess Game',
    url: siteUrl,
    description: 'Test your anime knowledge! Ask questions and guess the secret anime character.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/game`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const gameStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: 'Anime Guess Game',
    description:
      'An interactive guessing game where players ask questions to identify anime characters.',
    url: siteUrl,
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
  };

  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(gameStructuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        {adsenseClient ? (
          <Script
            id="google-adsense"
            async
            strategy="lazyOnload"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          />
        ) : null}
        <Providers>
          <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
