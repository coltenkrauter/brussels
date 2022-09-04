/** @type {import('next').NextConfig} */

const nextConfig = {
  future: { webpack5: true },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
      return config;
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        destination: '/',
        permanent: true,
        source: '/feeding-my-family',
      },
    ]
  },
};

module.exports = nextConfig;
