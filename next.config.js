/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure webpack to handle native modules
  webpack: (config, { isServer, webpack }) => {
    // Handle native modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      dns: false,
      http2: false,
      module: false,
      dgram: false,
    };

    // Server-side only configuration
    if (isServer) {
      // Make sure Vedic Astrology is only bundled on the server
      config.externals = config.externals || [];
      config.externals.push({
        'swisseph': 'commonjs swisseph',
        'swisseph-v2': 'commonjs swisseph-v2',
        'vedic-astrology': 'commonjs vedic-astrology'
      });
      
      // Add node-loader for .node files
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });
    } else {
      // Client-side configuration
      config.externals = config.externals || [];
      
      // These should not be bundled in the browser
      config.externals.push({
        'swisseph': 'swisseph',
        'swisseph-v2': 'swisseph-v2',
        'vedic-astrology': 'vedic-astrology'
      });
    }

    return config;
  },
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // Configure images
  images: {
    domains: ['localhost'],
  },
  
  // Environment variables
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://vishaka-astrology.netlify.app',
  },
};

// Configuration for @next/mdx
const withMDX = require('@next/mdx')({
  extension: /\\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withMDX(nextConfig);
