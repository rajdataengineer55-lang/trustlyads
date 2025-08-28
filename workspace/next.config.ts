/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
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
