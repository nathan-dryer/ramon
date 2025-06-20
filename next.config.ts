import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  /**
   * Custom webpack configuration
   * - Strip server-only AI/Genkit libraries from the **client** bundle
   *   by aliasing them to `false`.  This prevents large, unused
   *   packages from being pulled into pages like `/scrapbook`,
   *   radically cutting first-load JS size.
   */
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        // Mark these modules as "do not bundle" for the browser build
        genkit: false,
        '@genkit-ai/googleai': false,
        '@genkit-ai/core': false,
        '@genkit-ai/next': false,
        '@genkit-ai/ai': false,
      };
    }
    return config;
  },
};

export default nextConfig;
