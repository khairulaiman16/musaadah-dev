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
  silent: true,
  org: "jsm-x9",
  project: "javascript-nextjs",
}, {
  // --- ADD THESE TWO LINES TO BYPASS THE 401 ERROR ---
  disableServerWebpackPlugin: true,
  disableClientWebpackPlugin: true,
  // --------------------------------------------------

  widenClientFileUpload: true,
  transpileClientSDK: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});