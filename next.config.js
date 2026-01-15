/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'i.imgur.com',
      'imgur.com',
      'i.ibb.co',
      'ibb.co',
      'i.postimg.cc',
      'postimg.cc',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.postimg.cc',
      },
    ],
  },
}

module.exports = nextConfig

