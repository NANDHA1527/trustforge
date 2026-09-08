/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*'
        }
      ];
    }
    // In production the Vercel vercel.json rewrites handle routing
    return [];
  }
};

module.exports = nextConfig;
