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
  async headers() {
    // Scroll-sequence frames live in a versioned folder (RITUAL_VERSION in content/home.ts).
    // Not in dev: frames get re-exported under the same names while iterating.
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/ritual/:version/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
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
