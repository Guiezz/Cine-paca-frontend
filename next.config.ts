import type { NextConfig } from "next";

const API_URL = "https://cine-paca-api.onrender.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.builder.io",
      },
      {
        protocol: "https",
        hostname: "cine-paca-api.onrender.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cdn.cinepaca.example",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      // Cloudflare R2 (bucket público). Host fixo de propósito: "**.r2.dev"
      // liberaria o bucket r2.dev de qualquer conta, permitindo usar o
      // /_next/image deste projeto para otimizar imagens de terceiros.
      {
        protocol: "https",
        hostname: "pub-439a7473a593405c998512ddc834adc0.r2.dev",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
