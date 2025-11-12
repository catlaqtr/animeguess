// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const environment =
  process.env.NEXT_PUBLIC_APP_ENV ??
  process.env.NEXT_PUBLIC_VERCEL_ENV ??
  process.env.NODE_ENV ??
  'development';

const isProductionEnvironment = environment === 'production';
const release =
  process.env.NEXT_PUBLIC_SENTRY_RELEASE ??
  process.env.SENTRY_RELEASE ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  'development';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment,
  release,

  // Capture 100% of transactions locally, taper down in hosted environments
  tracesSampleRate: isProductionEnvironment ? 0.2 : 1.0,

  // Helpful while wiring things up; disable noise in production
  debug: !isProductionEnvironment,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: isProductionEnvironment ? 0.05 : 1.0,

  ignoreErrors: [
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'fb_xd_fragment',
  ],
});
