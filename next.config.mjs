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
    TRUCKY_GOOGLE_MEPS_API_KEY: process.env.TRUCKY_GOOGLE_MEPS_API_KEY || ''
  },
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'bg'],
    defaultLocale: 'en'
  }
};
export default config;
