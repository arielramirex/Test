/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Test',
  assetPrefix: '/Test/',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
