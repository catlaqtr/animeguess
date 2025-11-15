import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://animeguess.ca';

export const homeMetadata: Metadata = {
  title: 'Anime Guess Game - Free Online Anime Character Guessing Game',
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
  ],
  openGraph: {
    title: 'Anime Guess Game - Free Online Anime Character Guessing Game',
    description:
      'Test your anime knowledge! Play the best free anime character guessing game. Guess characters from popular anime series using AI-powered clues.',
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
      'Test your anime knowledge! Play the best free anime character guessing game. Guess characters from popular anime series.',
    images: [`${siteUrl}/logo.svg`],
  },
};

export const gameMetadata: Metadata = {
  title: 'Play Anime Guess Game - Free Online Character Guessing',
  description:
    'Play Anime Guess Game now! Ask questions and guess the secret anime character. Free to play, no registration required to start. Challenge your anime knowledge!',
  keywords: [
    'play anime game',
    'anime character guessing',
    'anime quiz play',
    'anime trivia online',
    'guess anime character game',
  ],
};

export const aboutMetadata: Metadata = {
  title: 'About Anime Guess Game - How It Works & Our Mission',
  description:
    'Learn about Anime Guess Game, how to play, and our mission to create the best free anime trivia experience. Built by anime fans for anime fans.',
  keywords: ['about anime guess game', 'how anime guessing game works', 'anime game mission'],
};

export const contactMetadata: Metadata = {
  title: 'Contact Us - Anime Guess Game Support',
  description:
    'Get help with Anime Guess Game. Contact our support team for account issues, bug reports, or general inquiries. We respond quickly!',
  keywords: ['anime guess game contact', 'anime game support', 'anime quiz help'],
};
