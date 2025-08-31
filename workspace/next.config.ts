/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/localpulse-9e3lz.firebasestorage.app/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // This is required to fix a build issue with the `handlebars` dependency used by Genkit.
    // It tells Next.js to treat `handlebars` as an external package.
    serverComponentsExternalPackages: ["handlebars"],
  }
};

export default nextConfig;
