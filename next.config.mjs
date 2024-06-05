import {withSentryConfig} from '@sentry/nextjs';
// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
  env: {
    TRUCKY_API_KEY: process.env.TRUCKY_API_KEY || '',
    TRUCKY_AUTH_DOMAIN: process.env.TRUCKY_AUTH_DOMAIN || '',
    TRUCKY_PROJECT_ID: process.env.TRUCKY_PROJECT_ID || '',
    TRUCKY_STORAGE_BUCKET: process.env.TRUCKY_STORAGE_BUCKET || '',
    TRUCKY_MESSAGING_SENDER_ID: process.env.TRUCKY_MESSAGING_SENDER_ID || '',
    TRUCKY_APP_ID: process.env.TRUCKY_APP_ID || '',
    TRUCKY_MEASUREMENT_ID: process.env.TRUCKY_MEASUREMENT_ID || '',
    TRUCKY_DATABASE_URL: process.env.TRUCKY_DATABASE_URL || '',
    TRUCKY_GOOGLE_MEPS_API_KEY: process.env.TRUCKY_GOOGLE_MEPS_API_KEY || '',
    TRUCKY_HERE_USER_ID: process.env.TRUCKY_HERE_USER_ID || '',
    TRUCKY_HERE_CLIENT_ID: process.env.TRUCKY_HERE_CLIENT_ID || '',
    TRUCKY_HERE_ACCESS_KEY_ID: process.env.TRUCKY_HERE_ACCESS_KEY_ID || '',
    TRUCKY_HERE_ACCESS_KEY_SECRET: process.env.TRUCKY_HERE_ACCESS_KEY_SECRET || '',
    TRUCKY_HERE_TOKEN_ENDPOINT_URL: process.env.TRUCKY_HERE_TOKEN_ENDPOINT_URL || '',
    TRUCKY_HERE_API_KEY: process.env.TRUCKY_HERE_API_KEY || '',
    TRUCKY_STRIPE_API_KEY: process.env.TRUCKY_STRIPE_API_KEY || ''
  },
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'bg'],
    defaultLocale: 'en'
  }
};
export default withSentryConfig(config, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "yanev-dev-ltd",
project: "trucky-one",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
// tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});