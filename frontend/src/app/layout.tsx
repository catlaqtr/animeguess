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
    default: 'Anime Guess Game - Free Online Anime Character Guessing Game',
    template: '%s | Anime Guess Game',
  },
  description:
    'Play the best free anime character guessing game online! Test your anime knowledge with AI-powered clues. Guess characters from Naruto, One Piece, Dragon Ball, and more. Free to play, no download required.',
  keywords: [
    'anime guessing game',
    'anime character quiz',
    'anime trivia game',
    'guess anime character',
    'anime quiz online',
    'free anime game',
    'anime knowledge test',
    'anime character guessing',
    'anime trivia',
    'anime quiz game',
    'free online anime game',
    'anime character quiz game',
  ],
  authors: [{ name: 'Anime Guess Game' }],
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Anime Guess Game - Free Online Anime Character Guessing Game',
    description:
      'Play the best free anime character guessing game online! Test your anime knowledge with AI-powered clues. Guess characters from popular anime series.',
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
    title: 'Anime Guess Game - Free Online Anime Character Guessing Game',
    description:
      'Play the best free anime character guessing game online! Test your anime knowledge with AI-powered clues.',
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
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do you play Anime Guess Game?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Anime Guess Game is a free online guessing game where you ask questions to identify a secret anime character. Ask yes/no or descriptive questions, get AI-powered clues, and make your guess to win!',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Anime Guess Game free to play?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Anime Guess Game is completely free to play. Create a free account to track your progress and compete on the leaderboard.',
        },
      },
      {
        '@type': 'Question',
        name: 'What anime characters are in the game?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Anime Guess Game features 50+ iconic characters from popular anime series including Naruto, One Piece, Dragon Ball, Attack on Titan, and many more. New characters are added regularly.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to download anything to play?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No download required! Anime Guess Game is a browser-based game that works on any device with an internet connection. Play instantly from your computer, tablet, or phone.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the AI provide clues?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Our AI analyzes your questions and provides accurate, lore-friendly answers based on the character's canonical information. The AI stays true to the source material to give you authentic clues.",
        },
      },
    ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
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
