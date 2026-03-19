import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@wadv/ui', '@wadv/lib', '@wadv/config', '@wadv/types'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'placehold.co' }],
  },
};

export default nextConfig;
