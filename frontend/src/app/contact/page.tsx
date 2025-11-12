import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the Anime Guess Game team for support, business inquiries, or feedback.',
  alternates: {
    canonical: '/contact',
  },
};

const contactItems = [
  {
    title: 'Support',
    description: 'Account issues, password resets, bug reports.',
    email: 'support@animeguess.com',
  },
  {
    title: 'Partnerships',
    description: 'Sponsorships, content collaborations, licensing.',
    email: 'partners@animeguess.com',
  },
  {
    title: 'Privacy & Legal',
    description: 'Data requests, policy questions, legal inquiries.',
    email: 'legal@animeguess.com',
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-sm text-slate-600">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-600">
          Contact us
        </p>
        <h1 className="text-3xl font-black text-slate-900">We’d love to hear from you</h1>
        <p>
          Have a question, found a bug, or want to collaborate? Reach out using the details below.
          We respond to most requests within 2 business days.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {contactItems.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-200"
          >
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-xs text-slate-600">{item.description}</p>
            <a
              href={`mailto:${item.email}`}
              className="mt-3 inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              {item.email}
            </a>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Send us a detailed message</h2>
        <p className="mt-2 text-xs text-slate-600">
          Prefer a form? Fill in the details below and we’ll respond as soon as possible.
        </p>
        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          action="https://formsubmit.co/support@animeguess.com"
          method="POST"
        >
          <input type="hidden" name="_subject" value="Anime Guess Game Contact Form" />
          <input type="hidden" name="_captcha" value="false" />

          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Name
            </label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Your name"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="you@example.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="How can we help?"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 sm:w-auto"
            >
              Submit message
            </button>
          </div>
        </form>
      </section>

      <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8">
        <h2 className="text-xl font-semibold text-slate-900">Business details</h2>
        <ul className="mt-4 space-y-2 text-xs text-slate-600">
          <li>
            <strong>Operating hours:</strong> Monday to Friday, 9:00 AM – 5:00 PM (Eastern Time)
          </li>
          <li>
            <strong>Mailing address:</strong> Anime Guess Game, 123 Fan Street, Toronto, ON, Canada
          </li>
          <li>
            <strong>Support SLA:</strong> We aim to resolve critical incidents within 12 hours.
          </li>
        </ul>
      </section>
    </div>
  );
}
