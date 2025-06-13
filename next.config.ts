import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for better deployment
  output: 'standalone',
  
  // Disable TypeScript build errors in production (since we check them separately)
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Disable ESLint build errors in production (since we check them separately)
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Environment variables
  env: {
    CUSTOM_PORT: process.env.PORT || '4000',
  },
};

export default nextConfig;
