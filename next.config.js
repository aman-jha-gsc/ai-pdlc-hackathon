/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are stable in Next.js 14.2, but this is good practice
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;