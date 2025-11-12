import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 text-slate-700">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">🎌 Anime Guess Game &mdash; Learn, guess, and have fun.</p>
        <nav aria-label="Legal links">
          <ul className="flex flex-wrap items-center gap-4">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-purple-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Anime Guess Game. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
