import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const RegisterView = dynamic(() => import('./RegisterView'), { ssr: false });

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your Anime Guess Game account and start playing in seconds.',
  alternates: {
    canonical: '/register',
  },
};

export default function RegisterPage() {
  return <RegisterView />;
}
