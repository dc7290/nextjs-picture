/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Next.jsのセキュリティ上、画像のURLのドメインを記載する必要がある
    domains: ['images.microcms-assets.io'],
  },
  experimental: {
    images: {
      // next/future/imageを使うための設定
      allowFutureImage: true,
    },
  },
}

module.exports = nextConfig
