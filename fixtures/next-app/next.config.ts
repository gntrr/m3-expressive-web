import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This is a standalone packed-package consumer, not a workspace application.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
