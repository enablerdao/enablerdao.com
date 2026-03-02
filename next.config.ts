import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Cloudflare Pages requires 'export' for static output
  // but we keep 'standalone' for flexibility with @cloudflare/next-on-pages
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for Cloudflare Pages
  },
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Suppress optional peer dependency warning from resend package
    if (isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        "@react-email/render": false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/dogs',
        destination: '/agents',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://plausible.io; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://plausible.io https://api.github.com https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
          {
            key: 'Server',
            value: '',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
