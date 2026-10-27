/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow production verification without overwriting a running dev server's output.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
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
