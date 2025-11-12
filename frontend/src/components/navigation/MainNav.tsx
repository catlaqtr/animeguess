'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { logout } from '@/lib/auth';
import { useAuthSession } from '@/lib/hooks/useAuthSession';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/game', label: 'Play' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

export default function MainNav() {
  const pathname = usePathname();
  const { authed, user, hydrated } = useAuthSession();
  const effectiveAuthed = hydrated && authed;
  const username = effectiveAuthed ? (user?.username ?? null) : null;

  const activePath = useMemo(() => {
    if (!pathname) return '/';
    if (pathname.startsWith('/privacy')) return '/privacy';
    if (pathname.startsWith('/terms')) return '/terms';
    if (pathname.startsWith('/contact')) return '/contact';
    if (pathname.startsWith('/about')) return '/about';
    if (pathname.startsWith('/game')) return '/game';
    return '/';
  }, [pathname]);

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-purple-600">
          <span aria-hidden="true">🎌</span>
          <span>Anime Guess Game</span>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-1 items-center justify-end gap-4">
          <ul className="flex items-center gap-4 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => {
              const href = link.href === '/game' && !effectiveAuthed ? '/login' : link.href;
              const isActive = activePath === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={href}
                    className={`rounded-full px-3 py-1 transition-colors ${
                      isActive ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-3">
            {effectiveAuthed ? (
              <>
                <span className="text-sm text-slate-600">
                  Hi, <span className="font-semibold text-purple-600">{username ?? 'Player'}</span>
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-purple-200 px-4 py-1.5 text-sm font-semibold text-purple-600 transition hover:border-purple-300 hover:text-purple-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-purple-200 px-4 py-1.5 text-sm font-semibold text-purple-600 transition hover:border-purple-300 hover:text-purple-700"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
