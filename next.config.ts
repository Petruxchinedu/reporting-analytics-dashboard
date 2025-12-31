/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // Set to false so it checks every time
      },
    ]
  },
  // ... your other config
}

module.exports = nextConfig