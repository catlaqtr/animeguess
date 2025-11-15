import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Anime Guess Game - How It Works & Our Mission',
  description:
    'Learn about Anime Guess Game, how to play the free anime character guessing game, and our mission to create the best anime trivia experience. Built by anime fans for anime fans.',
  keywords: [
    'about anime guess game',
    'how anime guessing game works',
    'anime game mission',
    'anime trivia game about',
  ],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">About us</p>
        <h1 className="text-4xl font-black text-slate-900">Built by anime fans for anime fans</h1>
        <p className="text-lg text-slate-700">
          Anime Guess Game is a passion project created by a small team of developers and anime
          enthusiasts. We wanted a place where fans could sharpen their knowledge, discover new
          characters, and enjoy a modern, accessible trivia experience.
        </p>
      </div>

      <div className="mt-12 grid gap-6 text-sm text-slate-600 sm:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Our mission</h2>
          <p className="mt-3">
            To celebrate anime storytelling with a game that is fair, fast, and welcoming. We
            believe trivia should be more than static quizzes, so we blended conversational AI with
            curated lore to deliver a replayable experience.
          </p>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">What makes us different</h2>
          <ul className="mt-3 space-y-2">
            <li>✅ AI-assisted hints that stay true to canon.</li>
            <li>✅ A friendly leaderboard powered by verified accounts.</li>
            <li>
              ✅ Security-first design: JWT auth, rate limits, reCAPTCHA, and Sentry monitoring.
            </li>
            <li>✅ Community-driven roadmap (new characters, seasonal events, accessibility).</li>
          </ul>
        </section>
      </div>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-900 p-8 text-slate-100">
        <h2 className="text-2xl font-semibold">Transparency matters to us</h2>
        <p className="mt-3 text-sm text-slate-300">
          We host our backend on Render, CDN the frontend on Vercel, and cache through Cloudflare.
          Error reporting is handled by Sentry, and we use SendGrid for transactional emails. Learn
          more about how we protect users in our{' '}
          <Link href="/privacy" className="underline hover:text-purple-200">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="underline hover:text-purple-200">
            Terms of Service
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">Roadmap highlights</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <strong>Seasonal trivia packs</strong>
            <p className="text-sm text-slate-600">
              Rotating character collections inspired by current anime seasons and classic arcs.
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <strong>Co-op mode</strong>
            <p className="text-sm text-slate-600">
              Team up with friends to guess faster and climb cooperative leaderboards.
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <strong>Accessibility updates</strong>
            <p className="text-sm text-slate-600">
              WCAG improvements, screen-reader hints, and language localization.
            </p>
          </li>
          <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <strong>Community spotlight</strong>
            <p className="text-sm text-slate-600">
              Featuring fan-submitted trivia, art contests, and curated playlists.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
