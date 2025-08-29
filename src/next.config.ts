
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/localpulse-9e3lz.appspot.com/o/**",
      },
      {
        protocol: "https" as const,
        hostname: "firebasestorage.googleapis.com" as const,
        pathname: "/v0/b/localpulse-9e3lz.firebasestorage.app/o/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
