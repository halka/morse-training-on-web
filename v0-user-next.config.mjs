/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Node.js v22.14.0に対応するために古い実験的機能を削除
  },
  reactStrictMode: true,
  output: 'standalone',
}

export default nextConfig

