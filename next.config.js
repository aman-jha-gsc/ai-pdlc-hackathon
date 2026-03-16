/** @type {import('next').NextConfig} */
const nextConfig = {
  // The `standalone` output mode is recommended for Docker deployments
  // It creates a smaller image by copying only necessary files
  output: 'standalone',
};

module.exports = nextConfig;