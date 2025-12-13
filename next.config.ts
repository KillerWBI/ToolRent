import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // compilerOptions must live in tsconfig.json; keep Next config minimal
  images: {
    // Используем remotePatterns вместо domains, как требуется
    remotePatterns: [
      { protocol: "https", hostname: "ac.goit.global" },
      { protocol: "https", hostname: "zastavki.gas-kvas.com" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "http", hostname: "127.0.0.1", port: "3000" },
    ],
  },
};

export default nextConfig;
