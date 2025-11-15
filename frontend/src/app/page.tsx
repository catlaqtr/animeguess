'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/lib/hooks/useAuthSession';

export default function HomePage() {
  const router = useRouter();
  const { authed, hydrated } = useAuthSession();
  const effectiveAuthed = hydrated && authed;

  useEffect(() => {
    if (effectiveAuthed) {
      router.prefetch('/game');
    }
  }, [effectiveAuthed, router]);

  return (
    <div className="relative overflow-hidden bg-white">
      <section className="relative isolate">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%-11rem)] h-[21rem] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-400 to-pink-400 opacity-30 sm:left-[calc(50%-30rem)] sm:h-[34rem] sm:w-[72rem]" />
        </div>

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pb-16 pt-20 text-center text-slate-700 sm:pt-28">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
            🎌 Play • Learn • Guess
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Free Anime Character Guessing Game - Test Your Anime Knowledge
          </h1>
          <p className="max-w-3xl text-lg text-slate-600 sm:text-xl">
            Play the best free anime character guessing game online! Ask strategic questions about
            characters from Naruto, One Piece, Dragon Ball, and more. Our AI-powered game provides
            accurate clues to help you guess the secret anime character. Perfect for anime fans and
            trivia lovers - completely free to play!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700"
            >
              Create a free account
            </Link>
            <Link
              href={effectiveAuthed ? '/game' : '/login'}
              className="rounded-full border border-purple-200 px-6 py-3 text-sm font-semibold text-purple-600 transition hover:border-purple-400 hover:text-purple-700"
            >
              {effectiveAuthed ? 'Play a round' : 'Sign in to play'}
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-slate-600 underline-offset-4 hover:underline"
            >
              Learn how it works
            </Link>
          </div>
          <dl className="grid w-full grid-cols-1 gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 text-left shadow-lg sm:grid-cols-3">
            {[
              { title: '50+', subtitle: 'Anime characters from popular series' },
              { title: 'AI-powered clues', subtitle: 'Accurate, lore-friendly answers' },
              { title: 'Free to play', subtitle: 'No download, no credit card required' },
            ].map((item) => (
              <div key={item.title}>
                <dt className="text-sm text-slate-500">{item.subtitle}</dt>
                <dd className="text-2xl font-bold text-slate-900">{item.title}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-slate-900 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-4 text-slate-100 sm:grid-cols-3">
          {[
            {
              title: 'Engaging Gameplay',
              description:
                'Ask yes/no or descriptive questions, unlock clues, and make the winning guess before you run out of time.',
            },
            {
              title: 'Learn While Playing',
              description:
                'Each character comes with curated lore and hints so you can discover something new every round.',
            },
            {
              title: 'Safe & Secure',
              description:
                'Protected with reCAPTCHA, rate limiting, and encrypted authentication to keep bots and cheaters out.',
            },
          ].map((feature) => (
            <article key={feature.title}>
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 text-left text-slate-700 sm:grid sm:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Built for the anime community</h2>
            <p className="mt-2 text-sm text-slate-600">
              Anime Guess Game is an independent project crafted by fans for fans. We focus on fair
              play, fast gameplay, and a welcoming community.
            </p>
          </div>
          <ul className="col-span-2 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <li className="rounded-2xl border border-slate-200 p-4">
              ✅ Regular content updates with new characters and trivia packs.
            </li>
            <li className="rounded-2xl border border-slate-200 p-4">
              ✅ Privacy-first analytics and optional cookie consent.
            </li>
            <li className="rounded-2xl border border-slate-200 p-4">
              ✅ Email notifications powered by SendGrid for account security.
            </li>
            <li className="rounded-2xl border border-slate-200 p-4">
              ✅ Powered by Spring Boot, Next.js, and secured with Cloudflare + Sentry.
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-6">
            {[
              {
                question: 'How do you play Anime Guess Game?',
                answer:
                  'Anime Guess Game is a free online guessing game where you ask questions to identify a secret anime character. Ask yes/no or descriptive questions, get AI-powered clues, and make your guess to win!',
              },
              {
                question: 'Is Anime Guess Game free to play?',
                answer:
                  'Yes! Anime Guess Game is completely free to play. Create a free account to track your progress and compete on the leaderboard. No credit card required.',
              },
              {
                question: 'What anime characters are in the game?',
                answer:
                  'Anime Guess Game features 50+ iconic characters from popular anime series including Naruto, One Piece, Dragon Ball, Attack on Titan, My Hero Academia, and many more. New characters are added regularly.',
              },
              {
                question: 'Do I need to download anything to play?',
                answer:
                  'No download required! Anime Guess Game is a browser-based game that works on any device with an internet connection. Play instantly from your computer, tablet, or phone.',
              },
              {
                question: 'How does the AI provide clues?',
                answer:
                  "Our AI analyzes your questions and provides accurate, lore-friendly answers based on the character's canonical information. The AI stays true to the source material to give you authentic clues.",
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <dt className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</dt>
                <dd className="text-slate-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-slate-100">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to test your anime instincts?</h2>
          <p className="mt-3 text-sm text-slate-300">
            Join thousands of fans sharpening their knowledge through fast-paced guessing games.
            Create a free account, earn badges, and climb the leaderboard.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-400 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
