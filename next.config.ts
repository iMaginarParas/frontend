import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  webpack: (config, { isServer }) => {
    // Ignore missing optional dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      '@x402/core/client': false,
      '@x402/evm': false,
      '@x402/evm/exact/client': false,
      '@x402/evm/upto/client': false,
      '@x402/svm/exact/client': false,
    }
    return config
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
    resolveAlias: {
      '@x402/core/client': './node_modules/next/dist/compiled/empty.js',
      '@x402/evm': './node_modules/next/dist/compiled/empty.js',
      '@x402/evm/exact/client': './node_modules/next/dist/compiled/empty.js',
      '@x402/evm/upto/client': './node_modules/next/dist/compiled/empty.js',
      '@x402/svm/exact/client': './node_modules/next/dist/compiled/empty.js',
    },
  },
};

export default nextConfig;
