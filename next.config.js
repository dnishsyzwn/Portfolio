/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/my-pricing",
        destination: "/pricing",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
