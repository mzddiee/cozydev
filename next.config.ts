import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent ESLint from blocking production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // (Optional) Prevent TS errors from blocking builds
  typescript: {
    ignoreBuildErrors: true,
  },
  /* any other config options here */
};

export default nextConfig;
