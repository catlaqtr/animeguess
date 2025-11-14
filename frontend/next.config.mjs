import { withSentryConfig } from '@sentry/nextjs';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const adsensePublisher = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '';
const adsenseSidebarSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '';

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://*.sentry.io https://pagead2.googlesyndication.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net;
  connect-src 'self' ${apiUrl} https://*.sentry.io https://*.ingest.us.sentry.io https://www.google.com https://www.recaptcha.net https://www.gstatic.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://www.google.com https://www.recaptcha.net https://googleads.g.doubleclick.net;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://formsubmit.co;
  worker-src 'self' blob:;
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: adsensePublisher,
    NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR: adsenseSidebarSlot,
    NEXT_PUBLIC_APP_ENV:
      process.env.NEXT_PUBLIC_APP_ENV ||
      process.env.VERCEL_ENV ||
      process.env.NODE_ENV ||
      'development',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  output: 'standalone',
};

const isSentryUploadConfigured =
  Boolean(process.env.SENTRY_AUTH_TOKEN) &&
  Boolean(process.env.SENTRY_ORG) &&
  Boolean(process.env.SENTRY_PROJECT);

// Temporarily disable Sentry source map uploads during build to avoid setCommits errors
// Error tracking will still work at runtime via NEXT_PUBLIC_SENTRY_DSN
// You can manually upload source maps later if needed
const DISABLE_SENTRY_BUILD = process.env.DISABLE_SENTRY_BUILD === 'true' || true; // Set to false to enable

let finalConfig = nextConfig;

if (isSentryUploadConfigured && !DISABLE_SENTRY_BUILD) {
  const sentryWebpackPluginOptions = {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    hideSourceMaps: true,
    release:
      process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA,
    setCommits: undefined,
    dryRun: false,
  };

  finalConfig = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
} else if (isSentryUploadConfigured) {
  // Sentry is configured but build uploads are disabled
  // Runtime error tracking will still work via NEXT_PUBLIC_SENTRY_DSN
  console.log('Sentry build-time source map uploads disabled to avoid setCommits errors');
}

export default finalConfig;
