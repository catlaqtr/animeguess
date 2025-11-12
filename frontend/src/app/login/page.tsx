import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const LoginView = dynamic(() => import('./LoginView'), { ssr: false });

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to Anime Guess Game to resume your games and track your progress.',
  alternates: {
    canonical: '/login',
  },
};

export default function LoginPage() {
  return <LoginView />;
}
