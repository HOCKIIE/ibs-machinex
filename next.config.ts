import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost:8000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
