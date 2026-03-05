/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/nook-companion',
  assetPrefix: '/nook-companion/',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;