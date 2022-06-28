/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    layoutRaw: true,
    loader: 'custom',
    domains: ['images.microcms-assets.io'],
  },
  experimental: {},
  swcMinify: true,
}

module.exports = nextConfig
