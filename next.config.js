/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/Test' : '',
  assetPrefix: isProd ? '/Test/' : '',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
