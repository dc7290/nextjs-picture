/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // layout="raw"を使うため
    layoutRaw: true,
    // デフォルトで用意されているローダーでなく、作成したローダーを指定するため
    loader: 'custom',
    // Next.jsのセキュリティ上、画像のURLのドメインを記載する必要がある
    domains: ['images.microcms-assets.io'],
  },
}

module.exports = nextConfig
