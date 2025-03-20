import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve(__dirname, './node_modules/yjs')
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
          },
        },
      ],
    })
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
  async redirects() {
    return [
      {
        source: '/bCccDwkKkN',
        destination: '/', // Matched parameters can be used in the destination
        permanent: true,
      },
    ]
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
