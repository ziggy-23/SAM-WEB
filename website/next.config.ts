import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The content/ folder lives one level above website/. Telling Next where the
  // monorepo root is lets it trace those files correctly when deploying.
  outputFileTracingRoot: path.join(__dirname, ".."),
  turbopack: { root: path.join(__dirname, "..") },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
  },
  poweredByHeader: false,
};

export default nextConfig;
