/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/localpulse-9e3lz.firebasestorage.app/o/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },

  experimental: {
    allowedDevOrigins: [
      "http://localhost:9003",
      "https://9003-firebase-studio-1755798338059.cluster-fkltigo73ncaixtmokrzxhwsfc.cloudworkstations.dev"
    ],
  },
};

export default nextConfig;
