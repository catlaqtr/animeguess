import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Anime Guess Game collects, uses, and protects your data, including cookies, analytics, and marketing preferences.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 text-sm leading-6 text-slate-700">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">
          Privacy Policy
        </p>
        <h1 className="text-3xl font-black text-slate-900">Your privacy matters to us</h1>
        <p className="text-sm text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="mt-8 space-y-4">
        <p>
          Anime Guess Game (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the Anime
          Guess Game web application. This Privacy Policy explains what information we collect, how
          we use it, and the choices you can make about your data. By using the site, you agree to
          the practices described below.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Information we collect</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Account details:</strong> username, email address, and password (hashed with
            BCrypt).
          </li>
          <li>
            <strong>Gameplay activity:</strong> guesses, game history, leaderboard stats. Used to
            power in-game features and analytics.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, and device identifiers
            collected through server logs and security tooling (e.g. Cloudflare).
          </li>
          <li>
            <strong>Optional integrations:</strong> If you sign in via Google (OAuth2), we receive
            profile details shared by Google and nothing more.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">How we use your information</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Authenticate you and secure account access with JWT-based sessions.</li>
          <li>Deliver core gameplay: process questions, guesses, and AI responses.</li>
          <li>
            Send transactional emails via SendGrid (password resets, alerts, newsletters opt-in).
          </li>
          <li>
            Maintain security: rate limiting (Bucket4j), bot detection (reCAPTCHA), and auditing.
          </li>
          <li>Monitor performance and errors through Sentry and GitHub Actions.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Cookies & analytics</h2>
        <p>
          We use essential cookies to keep you signed in and secure. With your consent, we use
          analytics cookies (via privacy-first measurement tools) to understand engagement. You can
          manage consent via the cookie banner at the bottom of the site. Blocking cookies may limit
          certain features but should not prevent gameplay.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Sharing your data</h2>
        <p>
          We do <strong>not</strong> sell your personal information. We may share limited data with
          trusted processors, solely to operate the service:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Render (infrastructure hosting)</li>
          <li>Vercel (frontend hosting)</li>
          <li>Cloudflare (CDN and DDoS protection)</li>
          <li>SendGrid (transactional email)</li>
          <li>Sentry (error monitoring)</li>
          <li>Google AdSense (advertising, if enabled)</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Your rights</h2>
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, delete, or
          restrict processing of your personal data. Contact us at{' '}
          <a className="text-purple-600 underline" href="mailto:support@animeguess.com">
            support@animeguess.com
          </a>{' '}
          to make a request. We will respond within 30 days.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Children’s privacy</h2>
        <p>
          Anime Guess Game is not directed to children under 13. We do not knowingly collect data
          from children. If we learn that a child has provided personal information, we will delete
          it promptly.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Policy updates</h2>
        <p>
          We may update this policy to reflect legal or product changes. Significant updates will be
          announced in-app and via email. The latest version will always be available on this page.
        </p>
      </section>

      <section className="mt-12 rounded-2xl bg-slate-100 p-6 text-sm text-slate-700">
        <h2 className="text-lg font-semibold text-slate-900">Questions?</h2>
        <p className="mt-2">
          Contact our privacy team at{' '}
          <a className="text-purple-600 underline" href="mailto:privacy@animeguess.com">
            privacy@animeguess.com
          </a>{' '}
          or use the form on our{' '}
          <Link className="underline" href="/contact">
            Contact page
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
