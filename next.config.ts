import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // The static export has no optimizer, so gallery frames are pre-generated at
    // these widths by scripts/prepare-frames.py and picked by app/frame-loader.ts.
    // Every other image opts out with `unoptimized` and is served as authored.
    loader: "custom",
    loaderFile: "./app/frame-loader.ts",
    deviceSizes: [640, 1280],
    imageSizes: [],
  },
};

export default nextConfig;
