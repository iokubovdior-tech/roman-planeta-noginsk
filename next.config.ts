import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    qualities: [75, 92, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default nextConfig;
