import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Anime Guess Game Terms of Service to understand usage guidelines, acceptable behavior, and legal responsibilities.',
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 text-sm leading-6 text-slate-700">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">
          Terms of Service
        </p>
        <h1 className="text-3xl font-black text-slate-900">Use Anime Guess Game responsibly</h1>
        <p className="text-sm text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="mt-8 space-y-4">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Anime
          Guess Game website and services (collectively, the &quot;Service&quot;). By using the
          Service, you agree to be bound by these Terms and our{' '}
          <a className="text-purple-600 underline" href="/privacy">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">1. Eligibility</h2>
        <p>
          You must be at least 13 years old to create an account. If you are under 18, you confirm
          that you have consent from a parent or guardian. You are responsible for ensuring the
          Service is legal in your jurisdiction.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">2. Account responsibilities</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Keep your login credentials confidential.</li>
          <li>Notify us immediately of unauthorized use of your account.</li>
          <li>You are responsible for all activity under your account.</li>
          <li>We reserve the right to suspend or terminate accounts for policy violations.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Share content that is unlawful, hateful, or infringing.</li>
          <li>Attempt to disrupt or overload the Service (e.g., DDoS, scraping, brute force).</li>
          <li>Use bots or automation to manipulate gameplay or leaderboards.</li>
          <li>Reverse engineer or copy source code, APIs, or proprietary data.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          4. Content and intellectual property
        </h2>
        <p>
          Anime Guess Game and its original assets (UI, story prompts, AI messaging) are protected
          by copyright and trademark laws. You retain rights to content you create while using the
          Service, but you grant us a non-exclusive license to store and display it for gameplay
          purposes. Please respect the rights of anime creators; do not upload unauthorized
          material.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          5. Advertising & third-party services
        </h2>
        <p>
          We may display advertisements (e.g., Google AdSense) and include links to third-party
          products or services. We are not responsible for third-party content or practices. Review
          their terms and privacy policies before interacting with them.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">6. Termination</h2>
        <p>
          We may suspend or terminate access if you violate these Terms or if we investigate
          suspected misconduct. You may delete your account at any time via the settings page or by
          contacting us at{' '}
          <a className="text-purple-600 underline" href="mailto:support@animeguess.ca">
            support@animeguess.ca
          </a>
          .
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">7. Disclaimers & liability</h2>
        <p>
          The Service is provided &quot;as is&quot; without warranties of any kind. We strive for
          uptime and accuracy but do not guarantee error-free or uninterrupted availability. To the
          fullest extent permitted by law, Anime Guess Game is not liable for indirect or incidental
          damages arising from your use of the Service.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">8. Changes to these Terms</h2>
        <p>
          We may update these Terms when we launch new features or when legal requirements change.
          Continued use after updates constitutes acceptance. We will always indicate the latest
          revision date at the top of this page.
        </p>
      </section>

      <section className="mt-12 rounded-2xl bg-slate-100 p-6 text-sm text-slate-700">
        <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
        <p className="mt-2">
          Questions about these Terms? Email{' '}
          <a className="text-purple-600 underline" href="mailto:support@animeguess.ca">
            support@animeguess.ca
          </a>
          .
        </p>
      </section>
    </article>
  );
}
