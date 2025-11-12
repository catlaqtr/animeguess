// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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
