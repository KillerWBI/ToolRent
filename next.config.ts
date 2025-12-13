import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        root: __dirname,
    },
    // compilerOptions must live in tsconfig.json; keep Next config minimal
    images: {
        // Используем remotePatterns вместо domains, как требуется
        remotePatterns: [
            { protocol: "http", hostname: "localhost", port: "3000" },
            { protocol: "http", hostname: "127.0.0.1", port: "3000" },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "ftp.goit.study",
                pathname: "**",
            },
        ],
    },
};

export default nextConfig;
