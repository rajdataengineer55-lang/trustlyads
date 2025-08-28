
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
        protocol: "https",
        hostname: "placehold.co", // keep if you use placeholder images
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
