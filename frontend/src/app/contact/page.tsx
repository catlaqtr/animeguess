'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { contactAPI, type ContactRequest } from '@/lib/api';
import { isAxiosError } from 'axios';

const contactItems = [
  {
    title: 'Support',
    description: 'Account issues, password resets, bug reports.',
    email: 'support@animeguess.ca',
  },
  {
    title: 'General Inquiries',
    description: 'Questions, feedback, or general information.',
    email: 'info@animeguess.ca',
  },
  {
    title: 'Contact',
    description: 'Direct contact for all inquiries.',
    email: 'contact@animeguess.ca',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactRequest>();

  const onSubmit = async (data: ContactRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await contactAPI.submitContact(data);
      setSubmitSuccess(true);
      reset();
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Failed to send message. Please try again.';
        setSubmitError(errorMessage);
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-sm text-green-800"
          >
            Thank you for your message! We&apos;ll get back to you soon.
          </motion.div>
        )}

        {submitError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700"
          >
            {submitError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Your name"
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Message
            </label>
            <textarea
              {...register('message', { required: 'Message is required' })}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="How can we help?"
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? 'Sending...' : 'Submit message'}
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
