// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const environment =
  process.env.SENTRY_ENVIRONMENT ??
  process.env.NEXT_PUBLIC_APP_ENV ??
  process.env.NEXT_PUBLIC_VERCEL_ENV ??
  process.env.NODE_ENV ??
  'development';

const isProductionEnvironment = environment === 'production';
const release =
  process.env.SENTRY_RELEASE ??
  process.env.NEXT_PUBLIC_SENTRY_RELEASE ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  'development';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment,
  release,
  tracesSampleRate: isProductionEnvironment ? 0.2 : 1.0,
  debug: !isProductionEnvironment,
});
