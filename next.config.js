/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/nook-companion',
  assetPrefix: '/nook-companion/',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;