import {withSentryConfig} from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during build
  silent: true,
  org: "jsm-x9",
  project: "javascript-nextjs",
}, {
  // --- ADD THESE TWO LINES TO FIX THE BUILD ERROR ---
  disableServerWebpackPlugin: true,
  disableClientWebpackPlugin: true,
  // --------------------------------------------------

  widenClientFileUpload: true,
  transpileClientSDK: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});