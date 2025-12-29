/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [

      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "9140475.kz",
        port: "3000",
      },

      {
        protocol: "https",
        hostname: "api.9140475.kz",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
