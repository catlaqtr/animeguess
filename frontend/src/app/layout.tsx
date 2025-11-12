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
  openGraph: {
    title: 'Anime Guess Game',
    description: 'Test your anime knowledge by guessing secret characters!',
    url: siteUrl,
    type: 'website',
    siteName: 'Anime Guess Game',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anime Guess Game',
    description: 'Test your anime knowledge by guessing secret characters!',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
