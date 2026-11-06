import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // AGENTS.md is curated by the team; stop `next dev` from rewriting it.
  agentRules: false,
  images: {
    // TODO: placeholder photography (src/presentation/content/photos.ts). Remove once replaced.
    // The fixed query caps the original Unsplash serves to the optimizer at 2400px.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*", search: "?auto=format&fit=max&w=2400&q=80" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
